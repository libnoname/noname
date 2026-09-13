import { get, lib, game, _status, ui } from "noname";
const characters = {
  sp_key_yuri: {
    sex: "female",
    group: "qun",
    hp: 4,
    skills: ["mubing", "ziqu", "diaoling"],
    groupBorder: "key",
    names: "仲村|由理"
  },
  key_lucia: {
    sex: "female",
    group: "key",
    hp: 2,
    maxHp: 3,
    skills: ["lucia_duqu", "lucia_zhenren"],
    names: "此花|露西娅"
  },
  key_kyousuke: {
    sex: "male",
    group: "key",
    hp: 4,
    skills: ["nk_shekong", "key_huanjie"],
    names: "枣|恭介"
  },
  key_yuri: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["yuri_xingdong", "key_huanjie", "yuri_wangxi"],
    isZhugong: true,
    names: "仲村|由理"
  },
  key_haruko: {
    sex: "female",
    group: "key",
    hp: 4,
    skills: ["haruko_haofang", "haruko_zhuishi"],
    names: "神尾|晴子"
  },
  key_umi: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["umi_chaofan", "umi_lunhui", "umi_qihuan"],
    names: "鹰原|羽未"
  },
  key_umi2: {
    sex: "female",
    group: "key",
    hp: 3,
    isUnseen: true,
    names: "鹰原|羽未"
  },
  key_rei: {
    sex: "male",
    group: "key",
    hp: 4,
    skills: ["xiandeng", "shulv", "xisheng"],
    names: "null|零"
  },
  key_komari: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["komari_tiankou", "komari_xueshang"],
    names: "神北|小毬"
  },
  key_yukine: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["yukine_wenzhou"],
    names: "宫泽|有纪宁"
  },
  key_yusa: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["yusa_yanyi", "yusa_misa", "dualside"],
    dualSideCharacter: "key_misa",
    names: "黑羽|柚咲"
  },
  key_misa: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["misa_yehuo", "misa_yusa", "dualside"],
    isUnseen: true,
    names: "黑羽|美砂"
  },
  key_masato: {
    sex: "male",
    group: "key",
    hp: 4,
    maxHp: 8,
    skills: ["masato_baoquan"],
    names: "井之原|真人"
  },
  key_iwasawa: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["iwasawa_yinhang", "iwasawa_mysong"],
    names: "岩泽|雅美"
  },
  key_kengo: {
    sex: "male",
    group: "key",
    hp: 4,
    skills: ["kengo_weishang", "kengo_guidui"],
    names: "宫泽|谦吾"
  },
  key_yoshino: {
    sex: "male",
    group: "key",
    hp: 4,
    skills: ["yoshino_jueyi"],
    names: "吉野|晴彦"
  },
  key_yui: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["yui_jiang", "yui_lieyin", "yui_takaramono"],
    names: "芳冈|由依"
  },
  key_tsumugi: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["tsumugi_mugyu", "tsumugi_huilang"],
    names: "文德斯|紬"
  },
  key_saya: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["saya_shouji", "saya_powei"],
    names: "朱鹭户|彩"
  },
  key_harukakanata: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["haruka_shuangche"],
    names: "三枝|叶留佳-二木|佳奈多"
  },
  key_inari: {
    sex: "female",
    group: "key",
    hp: 2,
    skills: ["inari_baiwei", "inari_huhun"],
    names: "空门|稻荷"
  },
  key_shiina: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["shiina_qingshen", "shiina_feiyan"],
    names: "null|椎名"
  },
  key_sunohara: {
    sex: "double",
    group: "key",
    hp: 3,
    hujia: 2,
    skills: ["sunohara_chengshuang", "sunohara_tiaoyin", "sunohara_jianren"],
    names: "春原|阳平-春原|芽衣"
  },
  key_rin: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["rin_baoqiu"],
    names: "枣|铃"
  },
  key_sasami: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["sasami_miaobian"],
    names: "笹濑川|佐佐美"
  },
  key_akane: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["akane_jugu", "akane_quanqing", "akane_yifu"],
    isZhugong: true,
    names: "千里|朱音"
  },
  key_doruji: {
    sex: "female",
    group: "key",
    hp: 16,
    skills: ["doruji_feiqu"],
    names: "null|多鲁基"
  },
  key_yuiko: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["yuiko_fenglun", "yuiko_dilve"],
    names: "来谷|唯湖"
  },
  key_riki: {
    sex: "double",
    group: "key",
    hp: 3,
    skills: ["riki_spwenji", "riki_nvzhuang", "riki_mengzhong"],
    names: "直枝|理树"
  },
  key_hisako: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["hisako_yinbao", "hisako_zhuanyun"],
    names: "渕田|久子"
  },
  key_hinata: {
    sex: "male",
    group: "key",
    hp: 4,
    skills: ["hinata_qiulve", "hinata_ehou"],
    names: "日向|秀树"
  },
  key_noda: {
    sex: "male",
    group: "key",
    hp: 4,
    skills: ["noda_fengcheng", "noda_xunxin"],
    names: "野田|null"
  },
  key_tomoya: {
    sex: "male",
    group: "key",
    hp: 4,
    skills: ["tomoya_shangxian", "tomoya_wangjin"],
    names: "冈崎|朋也"
  },
  key_nagisa: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["nagisa_tiandu", "nagisa_fuxin"],
    names: "古河|渚"
  },
  key_ayato: {
    sex: "male",
    group: "key",
    hp: 3,
    skills: ["ayato_jianshen", "ayato_zonghuan"],
    names: "直井|文人"
  },
  key_ao: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["ao_xishi", "ao_kuihun", "ao_shixin"],
    names: "空门|苍"
  },
  key_yuzuru: {
    sex: "male",
    group: "key",
    hp: 5,
    skills: ["yuzuru_wuxin", "yuzuru_deyi"],
    names: "音无|结弦"
  },
  sp_key_kanade: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["kanade_mapo", "kanade_benzhan"],
    names: "立华|奏"
  },
  key_mio: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["mio_tuifu", "mio_tishen"],
    names: "西园|美鱼"
  },
  key_midori: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["midori_nonghuan", "midori_tishen"],
    names: "西园|美鸟"
  },
  key_kyoko: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["kyoko_juwu", "kyoko_zhengyi"],
    names: "岬|镜子"
  },
  key_shizuru: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["shizuru_nianli", "shizuru_benzhan"],
    names: "中津|静流"
  },
  key_shiorimiyuki: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["shiorimiyuki_banyin", "shiorimiyuki_tingxian"],
    names: "关根|诗织-入江|美雪"
  },
  key_miki: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["miki_shenqiang", "miki_huanmeng", "miki_zhiluo"],
    names: "野村|美希"
  },
  key_shiori: {
    sex: "female",
    group: "key",
    hp: 2,
    maxHp: 3,
    skills: ["shiori_huijuan"],
    names: "美坂|栞"
  },
  key_kaori: {
    sex: "female",
    group: "key",
    hp: 3,
    maxHp: 4,
    skills: ["kaori_siyuan"],
    names: "美坂|香里"
  },
  key_akiko: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["akiko_dongcha"],
    names: "水濑|秋子"
  },
  key_abyusa: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["abyusa_jueqing", "abyusa_dunying"],
    names: "null|游佐"
  },
  key_godan: {
    sex: "male",
    group: "key",
    hp: 6,
    skills: ["godan_yuanyi", "godan_feiqu", "godan_xiaoyuan"],
    names: "松下|护驒"
  },
  key_yuu: {
    sex: "male",
    group: "key",
    hp: 3,
    skills: ["yuu_lveduo"],
    names: "乙坂|有宇"
  },
  key_ryoichi: {
    sex: "male",
    group: "key",
    hp: 4,
    skills: ["ryoichi_baoyi", "ryoichi_tuipi"],
    names: "三谷|良一"
  },
  key_kotori: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["kotori_yumo", "kotori_huazhan"],
    names: "神户|小鸟"
  },
  key_jojiro: {
    sex: "male",
    group: "key",
    hp: 4,
    skills: ["jojiro_shensu", "jojiro_shunying"],
    names: "高城|丈士朗"
  },
  key_shiroha: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["shiroha_yuzhao", "shiroha_guying", "shiroha_jiezhao"],
    names: "鸣濑|白羽"
  },
  key_shizuku: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["shizuku_sizhi", "shizuku_biyi", "shizuku_sanhua"],
    names: "水织|静久"
  },
  key_hiroto: {
    sex: "male",
    group: "key",
    hp: 3,
    skills: ["hiroto_huyu", "hiroto_tuolao"],
    names: "铃木|央人"
  },
  key_sakuya: {
    sex: "male",
    group: "key",
    hp: 3,
    skills: ["youlong", "luanfeng", "sakuya_junbu"],
    names: "凤|咲夜"
  },
  key_youta: {
    sex: "male",
    group: "key",
    hp: 4,
    skills: [],
    names: "成神|阳太"
  },
  key_rumi: {
    sex: "female",
    group: "key",
    hp: 3,
    maxHp: 4,
    skills: ["rumi_shuwu"],
    names: "七濑|留美"
  },
  key_chihaya: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["chihaya_liewu", "chihaya_youfeng"],
    names: "凤|千早"
  },
  key_yukito: {
    sex: "male",
    group: "key",
    hp: 4,
    skills: ["yukito_kongwu", "yukito_yaxiang"],
    names: "国崎|往人"
  },
  key_crow: {
    sex: "male",
    group: "key",
    hp: 4,
    skills: [],
    isUnseen: true,
    names: "null|空"
  },
  key_asara: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["asara_shelu", "asara_yingwei"],
    names: "井上|晶"
  },
  key_kotomi: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["kotomi_qinji", "kotomi_chuanxiang"],
    names: "一之濑|琴美"
  },
  key_mia: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["mia_shihui", "mia_qianmeng"],
    names: "藤川|米娅"
  },
  key_kano: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["kano_liezhen", "kano_poyu"],
    names: "雾岛|佳乃"
  },
  db_key_liyingxia: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["liyingxia_sanli", "liyingxia_zhenjun", "liyingxia_wumai"],
    doubleGroup: ["shu", "key"],
    names: "李|映夏"
  },
  key_erika: {
    sex: "female",
    group: "key",
    hp: 3,
    hujia: 2,
    skills: ["erika_shisong", "erika_yousheng"],
    names: "苍井|绘里香"
  },
  key_satomi: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["satomi_luodao", "satomi_daohai"],
    names: "藏|里见"
  },
  key_iriya: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["iriya_yinji", "iriya_haozhi"],
    names: "罗杰斯特|文斯卡娅"
  },
  key_fuuko: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["fuuko_xingdiao", "fuuko_chuanyuan"],
    names: "伊吹|风子"
  },
  key_kagari: {
    sex: "female",
    group: "shen",
    groupInGuozhan: "key",
    hp: 3,
    skills: ["kagari_zongsi"],
    names: "未来来|篝"
  },
  key_shiki: {
    sex: "female",
    group: "shen",
    groupInGuozhan: "key",
    hp: 3,
    maxHp: 5,
    skills: ["shiki_omusubi"],
    names: "神山|识"
  },
  db_key_hina: {
    sex: "female",
    group: "shen",
    groupInGuozhan: "key",
    hp: 3,
    skills: ["hina_shenshi", "hina_xingzhi"],
    doubleGroup: ["key", "shen"],
    names: "佐藤|雏"
  },
  key_kud: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["kud_qiaoshou", "kud_buhui"],
    names: "能美|库特莉亚芙卡"
  },
  key_misuzu: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["misuzu_hengzhou", "misuzu_nongyin", "misuzu_zhongxing"],
    names: "神尾|观铃"
  },
  key_kamome: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["kamome_yangfan", "kamome_huanmeng", "kamome_jieban"],
    names: "久岛|鸥"
  },
  key_nao: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["nao_duyin", "nao_wanxin", "nao_shouqing"],
    names: "友利|奈绪"
  },
  key_yuuki: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["yuuki_yicha"],
    names: "冰室|忧希"
  },
  key_kotarou: {
    sex: "male",
    group: "key",
    hp: 3,
    skills: ["kotarou_rewrite", "kotarou_aurora"],
    names: "天王寺|瑚太朗"
  },
  key_tenzen: {
    sex: "male",
    group: "key",
    hp: 4,
    skills: ["tenzen_fenghuan", "tenzen_retianquan"],
    names: "加纳|天善"
  },
  key_kyouko: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["kyouko_rongzhu", "kyouko_gongmian"],
    names: "伊座并|杏子"
  },
  key_kyou: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["kyou_zhidian", "kyou_duanfa"],
    names: "藤林|杏"
  },
  key_seira: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["seira_xinghui", "seira_yuanying"],
    names: "樱庭|星罗"
  },
  key_kiyu: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["kiyu_yuling", "kiyu_rexianyu"],
    names: "天宫|希优"
  },
  key_tomoyo: {
    sex: "female",
    group: "key",
    hp: 4,
    skills: ["tomoyo_wuwei", "tomoyo_zhengfeng"],
    names: "坂上|智代"
  },
  key_minagi: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["minagi_peiquan", "minagi_huanliu"],
    names: "远野|美凪"
  },
  key_michiru: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["michiru_sheyuan"],
    names: "远野|小满"
  }
};
const cards = {
  kano_paibingbuzhen: {
    fullskin: true,
    type: "trick",
    enable: true,
    filterTarget: true,
    selectTarget: [1, 3],
    derivation: "key_kano",
    async content(event, trigger, player) {
      const { target } = event;
      await target.draw();
      const hs = target.getCards("he");
      if (!hs.length) {
        return;
      }
      let result;
      if (hs.length == 1) {
        result = { bool: true, cards: hs };
      } else {
        result = await target.chooseCard("he", true, "选择一张牌置入仁库").forResult();
      }
      if (result.bool) {
        const card = result.cards[0];
        target.$throw(card, 1e3);
        await target.lose(card, "toRenku");
      }
    },
    async contentAfter(event, trigger, player) {
      const cards2 = event.cards;
      if (player.isIn() && cards2.length && (() => {
        if (cards2.length == 1) {
          return true;
        }
        let color = get.color(cards2[0], false);
        let type = get.type(cards2[0], false);
        for (let i = 1; i < cards2.length; i++) {
          if (color && get.color(cards2[i], false) != color) {
            color = false;
          }
          if (type && get.type(cards2[i], false) != type) {
            type = false;
          }
          if (!color && !type) {
            return false;
          }
        }
        return true;
      })()) {
        await player.draw();
      }
    },
    ai: {
      order: 1,
      result: {
        player(player, target) {
          if (player.hasSkill("kano_poyu")) {
            return 2;
          }
          return 0;
        },
        target: 0.1
      }
    }
  },
  kamome_suitcase: {
    fullskin: true,
    type: "equip",
    subtype: "equip5",
    derivation: "key_kamome",
    skills: ["kamome_suitcase"],
    ai: {
      equipValue(card) {
        return 7;
      },
      basic: {
        equipValue: 7
      }
    }
  },
  miki_hydrogladiator: {
    fullskin: true,
    type: "equip",
    subtype: "equip1",
    derivation: "key_miki",
    skills: ["miki_hydrogladiator_skill"],
    distance: {
      attackFrom: -5
    },
    ai: {
      equipValue(card) {
        return 7;
      },
      basic: {
        equipValue: 7
      }
    }
  },
  miki_binoculars: {
    fullskin: true,
    type: "equip",
    subtype: "equip5",
    derivation: "key_miki",
    skills: ["miki_binoculars"],
    ai: {
      equipValue(card) {
        return 7;
      },
      basic: {
        equipValue: 7
      }
    }
  }
};
const pinyins = {
  加藤うみ: ["Kato", "Umi"],
  鹰原羽未: ["Takahara", "Umi"],
  仲村由理: ["Nakamura", "Yuri"],
  此花露西娅: ["Konohana", "Lucia"],
  枣恭介: ["Natsume", "Kyousuke"],
  神尾晴子: ["Kamio", "Haruko"],
  神北小毬: ["Kamikita", "Komari"],
  宫泽有纪宁: ["Miyazawa", "Yukine"],
  西森柚咲: ["Nishimori", "Yusa"],
  黑羽美砂: ["Kurobane", "Misa"],
  井之原真人: ["Inohara", "Masato"],
  岩泽雅美: ["Iwasawa", "Masami"],
  宫泽谦吾: ["Miyazawa", "Kengo"],
  吉野晴彦: ["Yoshino", "Haruhiko"],
  芳冈由依: ["Yoshioka", "Yui"],
  紬文德斯: ["Tsumugi", "Wenders"],
  朱鹭户沙耶: ["Tokido", "Saya"],
  "三枝叶留佳&二木佳奈多": ["Saigusa", "Haruka", "Futaki", "Kanata"],
  三枝二木: ["Saigusa", "Haruka", "Futaki", "Kanata"],
  稻荷: ["Inari"],
  椎名: ["Shiina"],
  "春原阳平&春原芽衣": ["Sunohara", "Youhei", "Sunohara", "Mei"],
  阳平芽衣: ["Sunohara", "Youhei", "Sunohara", "Mei"],
  枣铃: ["Natsume", "Rin"],
  笹濑川佐佐美: ["Sasasegawa", "Sasami"],
  千里朱音: ["Senri", "Akane"],
  多鲁基: ["Dorj"],
  来谷唯湖: ["Kurugaya", "Yuiko"],
  直枝理树: ["Naoe", "Riki"],
  渕田久子: ["Fuchita", "Hisako"],
  日向秀树: ["Hinata", "Hideki"],
  野田: ["Noda"],
  冈崎朋也: ["Okazaki", "Tomoya"],
  古河渚: ["Furukawa", "Nagisa"],
  直井文人: ["Naoi", "Ayato"],
  空门苍: ["Sorakado", "Ao"],
  音无结弦: ["Otonashi", "Yuzuru"],
  立华奏: ["Tachibana", "Kanade"],
  西园美鱼: ["Nishizono", "Mio"],
  西园美鸟: ["Nishizono", "Midori"],
  岬镜子: ["Misaki", "Kyoko"],
  中津静流: ["Nakatsu", "Shizuru"],
  "关根诗织&入江美雪": ["Sekine", "Shiori", "Irie", "Miyuki"],
  关根入江: ["Sekine", "Shiori", "Irie", "Miyuki"],
  野村美希: ["Nomura", "Miki"],
  美坂栞: ["Misaka", "Shiori"],
  美坂香里: ["Misaka", "Kaori"],
  水濑秋子: ["Minase", "Akiko"],
  游佐: ["Yusa"],
  松下护騨: ["Matsushita", "Godan"],
  乙坂有宇: ["Otosaka", "Yuu"],
  三谷良一: ["Mitani", "Ryoichi"],
  神户小鸟: ["Kanbe", "Kotori"],
  高城丈士朗: ["Takajyo", "Jyojirou"],
  鸣濑白羽: ["Naruse", "Shiroha"],
  水织静久: ["Mizuori", "Shizuku"],
  铃木央人: ["Suzuki", "Hiroto"],
  凤咲夜: ["Ootori", "Sakuya"],
  成神阳太: ["Narukami", "Youta"],
  七濑留美: ["Nanase", "Rumi"],
  凤千早: ["Ootori", "Chihaya"],
  国崎往人: ["Kunisaki", "Yukito"],
  井上晶: ["Inoue", "Asara"],
  一之濑琴美: ["Ichinose", "Kotomi"],
  藤川米娅: ["Fujikawa", "Mia"],
  雾岛佳乃: ["Kirishima", "Kano"],
  苍井绘梨花: ["Aoi", "Erika"],
  藏里见: ["Kura", "Satomi"],
  "喵呜·喵呼": ["Myau", "Mya-fu"],
  喵呜喵呼: ["Myau", "Mya-fu"],
  伊吹风子: ["Ibuki", "Fuuko"],
  久岛鸥: ["Kushima", "Kamome"],
  库特莉亚芙卡: ["Noumi", "Kudryavka"],
  神尾观铃: ["Kamio", "Misuzu"],
  友利奈绪: ["Tomori", "Nao"],
  天王寺瑚太朗: ["Tennouji", "Kotarou"],
  藤林杏: ["Fujibayashi", "Kyou"],
  伊座并杏子: ["Izanami", "Kyouko"],
  加纳天善: ["Kano", "Tenzen"],
  冰室忧希: ["Himuro", "Yuuki"],
  露娜Ｑ: ["Lunar", "Q"],
  远野小满: ["Toono", "Michiru"],
  远野美凪: ["Toono", "Minagi"],
  樱庭星罗: ["Sakuraba", "Seira"],
  坂上智代: ["Sakagami", "Tomoyo"],
  冈崎汐: ["Okazaki", "Ushio"],
  神山识: ["Kamiyama", "Shiki"],
  佐藤雏: ["Satou", "Hina"],
  篝: ["Kagari"]
};
const skills = {
  //加纳天善（改版）
  tenzen_fenghuan: {
    trigger: { global: "useCardAfter" },
    filter(event, player) {
      if (player == event.player || event.targets.length != 1 || event.targets[0] != player || !event.player.isIn() || event.card.name != "sha" && (get.type(event.card, null, false) != "trick" || !get.tag(event.card, "damage"))) {
        return false;
      }
      if (!player.canUse(
        {
          name: event.card.name,
          nature: event.card.nature,
          isCard: true
        },
        event.player,
        false
      )) {
        return false;
      }
      let num = get.number(event.card);
      if (typeof num != "number") {
        return false;
      }
      num *= 2;
      let hs = player.getCards("he");
      for (const i of hs) {
        num -= get.number(i);
        if (num <= 0) {
          return true;
        }
      }
      return false;
    },
    async cost(event, trigger, player) {
      const num = get.number(trigger.card) * 2, card = {
        name: trigger.card.name,
        nature: trigger.card.nature,
        isCard: true
      };
      event.result = await player.chooseToDiscard("he", get.prompt(event.skill, trigger.player), "弃置任意张点数之和不小于" + num + "的牌，然后视为对其使用一张" + get.translation(card), "chooseonly").set("selectCard", function() {
        let cards2 = ui.selected.cards, num2 = _status.event.cardNumber;
        for (const i of cards2) {
          num2 -= get.number(i);
          if (num2 <= 0) {
            return [cards2.length, cards2.length + 1];
          }
        }
        return [cards2.length + 1, cards2.length + 1];
      }).set("cardNumber", num).set("effect", get.effect(trigger.player, card, player, player)).set("ai", (card2) => {
        let eff = _status.event.effect;
        if (eff <= 0) {
          return 0;
        }
        for (const i of ui.selected.cards) {
          eff -= get.value(i) / Math.sqrt(get.number(i) / 3);
        }
        return eff - get.value(card2) / Math.sqrt(get.number(card2) / 3);
      }).forResult();
    },
    async content(event, trigger, player) {
      await player.discard(event.cards);
      let card = {
        name: trigger.card.name,
        nature: trigger.card.nature,
        isCard: true
      }, target = trigger.player;
      if (target.isIn() && player.canUse(card, target, false)) {
        await player.useCard(card, target, false);
      }
    }
  },
  tenzen_retianquan: {
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return event.card.name == "sha" && (player.hp > 0 || player.hasCard((card) => {
        return lib.filter.cardDiscardable(card, player, "tenzen_retianquan");
      }, "he"));
    },
    logTarget: "target",
    usable: 1,
    check(event, player) {
      if (get.attitude(player, event.target) >= 0) {
        return false;
      }
      if (player.hp > player.maxHp / 2) {
        return true;
      }
      if (player.hasCard((card) => {
        return lib.filter.cardDiscardable(card, player, "tenzen_retianquan") && get.value(card) < 6;
      }, "he")) {
        return true;
      }
      return true;
    },
    prompt2: "你可失去1点体力或弃置一张牌，亮出牌堆顶的三张牌（若你的体力值小于体力上限的50%，则改为展示五张牌）。每有一张基本牌，其所需使用的【闪】的数量便+1。然后若此牌造成过伤害，则你获得展示牌中的所有非基本牌。",
    async content(event, trigger, player) {
      const result = await player.chooseToDiscard("弃置一张牌，或点「取消」失去1点体力", "he").set("goon", player.hp > player.maxHp / 2).set("ai", (card) => {
        const val = get.value(card);
        if (_status.event.goon) {
          return 0.1 - val;
        }
        return 6 - val;
      }).forResult();
      if (!result.bool) {
        await player.loseHp();
      }
      const cards2 = get.cards(player.hp <= player.maxHp / 2 ? 5 : 3);
      await player.showCards(cards2, get.translation(player) + "发动了【天全】");
      const next = game.cardsGotoOrdering(cards2);
      next.relatedEvent = trigger.getParent();
      await next;
      const num = cards2.filter((card) => get.type(card, null, false) == "basic").length;
      if (num && trigger.card.name == "sha") {
        const id = trigger.target.playerid;
        const map = trigger.getParent().customArgs;
        if (!map[id]) {
          map[id] = {};
        }
        if (typeof map[id].shanRequired == "number") {
          map[id].shanRequired += num;
        } else {
          map[id].shanRequired = 1 + num;
        }
      }
      if (num < 5) {
        const next2 = game.createEvent("tenzen_retianqua_gain");
        next2.cards = cards2;
        next2.player = player;
        next2.setContent(async (event2, trigger2, player2) => {
          if (player2.getHistory("sourceDamage", (evt) => evt.card == event2.getParent().card).length > 0) {
            await player2.gain(
              event2.cards.filter((card) => get.type(card, null, false) != "basic"),
              "gain2"
            );
          }
        });
        event.next.remove(next2);
        trigger.getParent().after.push(next2);
      }
    }
  },
  //藤林杏
  kyou_zhidian: {
    locked: false,
    mod: {
      targetInRange(card) {
        if (card.kyou_zhidian) {
          return true;
        }
      },
      aiOrder(player, card, numx) {
        let num = _status.event._kyou_zhidian_baseValue;
        if (num > 0 && get.type2(card) == "trick" && player.getUseValue(card) < num) {
          return numx / 10;
        }
      }
    },
    enable: "chooseToUse",
    filter(event, player) {
      return player.countCards("hs", (card) => get.type2(card) == "trick") > 0;
    },
    filterCard(card) {
      return get.type2(card) == "trick";
    },
    onChooseToUse(event) {
      event._kyou_zhidian_baseValue = event.player.getUseValue({
        name: "sha"
      });
    },
    check(card) {
      let num = _status.event._kyou_zhidian_baseValue, player = _status.event.player;
      return num - player.getUseValue(card);
    },
    prompt: "将一张锦囊牌当做【杀】使用",
    viewAs: {
      name: "sha",
      kyou_zhidian: true
    },
    group: "kyou_zhidian_aim",
    ai: {
      respondSha: true,
      skillTagFilter: (player) => player.countCards("hs", (card) => get.type2(card) == "trick") > 0
    },
    subSkill: {
      aim: {
        trigger: {
          player: "useCardToPlayered"
        },
        forced: true,
        locked: false,
        filter(event, player) {
          return event.isFirstTarget && event.card.name == "sha";
        },
        logTarget: "target",
        async content(event, trigger, player) {
          const list = ["不可被响应", "无视防具", "伤害+1", "不计入次数"];
          list.remove(player.storage.kyou_zhidian);
          const result = await player.chooseControl(list).set("prompt", "掷典：请为" + get.translation(trigger.card) + "选择一种效果").set("choice", (() => {
            if (list.includes("不计入次数") && player.hasSha()) {
              return "不计入次数";
            }
            if (list.includes("不可被响应") && trigger.target.mayHaveShan(player, "use")) {
              return "不可被响应";
            }
            if (list.includes("伤害+1")) {
              return "伤害+1";
            }
            return list.randomGet();
          })()).set("ai", () => _status.event.choice).forResult();
          const target = trigger.target;
          player.storage.kyou_zhidian = result.control;
          game.log(player, "对", target, "的", trigger.card, "#g" + result.control);
          switch (result.control) {
            case "不可被响应":
              trigger.directHit.add(target);
              break;
            case "无视防具":
              target.addTempSkill("qinggang2");
              target.storage.qinggang2.add(trigger.card);
              break;
            case "伤害+1": {
              const map = trigger.customArgs;
              const id = target.playerid;
              if (!map[id]) {
                map[id] = {};
              }
              if (!map[id].extraDamage) {
                map[id].extraDamage = 0;
              }
              map[id].extraDamage++;
              break;
            }
            case "不计入次数": {
              const evt = trigger.getParent();
              if (evt.addCount !== false) {
                evt.addCount = false;
                const stat = player.getStat().card, name = trigger.card.name;
                if (typeof stat[name] == "number") {
                  stat[name]--;
                }
              }
              break;
            }
          }
        }
      }
    }
  },
  kyou_duanfa: {
    trigger: { player: "damageBegin2" },
    limited: true,
    skillAnimation: true,
    animationColor: "thunder",
    filter(event, player) {
      return player.hp <= event.num;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      if (player.countCards("h") > 0) {
        await player.chooseToDiscard("h", true, player.countCards("h"));
      }
      await player.recover();
      trigger.cancel();
      player.addTempSkill("kyou_duanfa_draw", {
        player: "phaseBeginStart"
      });
    },
    subSkill: {
      draw: {
        trigger: { target: "useCardToTargeted" },
        forced: true,
        charlotte: true,
        filter(event, player) {
          if (event.card.name == "sha") {
            return true;
          }
          return get.type(event.card, null, false) == "trick" && get.tag(event.card, "damage") > 0;
        },
        async content(event, trigger, player) {
          await player.draw();
        }
      }
    }
  },
  //天王寺瑚太朗
  kotarou_aurora: {
    trigger: {
      player: ["damageEnd", "loseHpEnd", "gainMaxHpEnd"]
    },
    forced: true,
    charlotte: true,
    filter(event, player) {
      return player.hasEnabledSlot(1);
    },
    async content(event, trigger, player) {
      if (player.hasEmptySlot(1)) {
        const card = get.cardPile2((card2) => {
          return get.subtype(card2) == "equip1" && !get.cardtag(card2, "gifts") && player.canUse(card2, player);
        });
        if (card) {
          await player.chooseUseTarget(card, true);
        }
      } else {
        await player.chooseUseTarget("sha", true, false);
      }
    }
  },
  kotarou_rewrite: {
    enable: "phaseUse",
    charlotte: true,
    filter(event, player) {
      return !player.hasSkill("kotarou_rewrite_block");
    },
    async content(event, trigger, player) {
      player.getHistory("custom").push({ kotarou_rewrite: true });
      const controlResult = await player.chooseControl().set("choiceList", ["视为使用一张本局游戏没有以此法使用过的基本牌或普通锦囊牌", "移动场上的一张牌", "增加1点体力上限并失去1点体力", "本回合内下一次造成的伤害+1", "本回合内下一次回复体力时，额外回复1点体力", "本回合内手牌上限和【杀】的使用次数+1 　　　　　　　　　　　　　　　　　　　　　　　　"]).set("ai", () => {
        let player2 = _status.event.player;
        if (player2.hp > 2 && player2.getUseValue({ name: "sha" }) > 0) {
          return 2;
        }
        return 0;
      }).forResult();
      const index = controlResult.index;
      if (index === 0) {
        let list = [];
        if (!player.storage.kotarou_rewrite) {
          player.storage.kotarou_rewrite = [];
        }
        for (const i of lib.inpile) {
          if (player.storage.kotarou_rewrite.includes(i)) {
            continue;
          }
          let type = get.type(i);
          if (type == "basic" || type == "trick") {
            list.push([type, "", i]);
          }
          if (i == "sha") {
            for (const j of lib.inpile_nature) {
              list.push([type, "", i, j]);
            }
          }
        }
        if (list.length) {
          const buttonResult = await player.chooseButton(["改写：视为使用一张基本牌或普通锦囊牌", [list, "vcard"]], true).set("filterButton", (button) => {
            return player.hasUseTarget(
              {
                name: button.link[2],
                nature: button.link[3],
                isCard: true
              },
              null,
              true
            );
          }).set("ai", (button) => {
            return player.getUseValue({
              name: button.link[2],
              nature: button.link[3],
              isCard: true
            });
          }).forResult();
          if (buttonResult.bool) {
            player.storage.kotarou_rewrite.push(buttonResult.links[0][2]);
            player.chooseUseTarget(true, {
              name: buttonResult.links[0][2],
              nature: buttonResult.links[0][3],
              isCard: true
            });
          }
        }
      } else {
        lib.skill.kotarou_rewrite.rewrites[index](player, event);
      }
      if (player.getHistory("custom", function(evt) {
        return evt && evt.kotarou_rewrite == true;
      }).length >= 3) {
        player.addTempSkill("kotarou_rewrite_block");
      }
    },
    onremove: true,
    rewrites: [
      function(player, event) {
        let list = [];
        if (!player.storage.kotarou_rewrite) {
          player.storage.kotarou_rewrite = [];
        }
        for (const i of lib.inpile) {
          if (player.storage.kotarou_rewrite.includes(i)) {
            continue;
          }
          let type = get.type(i);
          if (type == "basic" || type == "trick") {
            list.push([type, "", i]);
          }
          if (i == "sha") {
            for (const j of lib.inpile_nature) {
              list.push([type, "", i, j]);
            }
          }
        }
        if (list.length) {
          player.chooseButton(["改写：视为使用一张基本牌或普通锦囊牌", [list, "vcard"]], true).set("filterButton", (button) => {
            return player.hasUseTarget(
              {
                name: button.link[2],
                nature: button.link[3],
                isCard: true
              },
              null,
              true
            );
          }).set("ai", (button) => {
            return player.getUseValue({
              name: button.link[2],
              nature: button.link[3],
              isCard: true
            });
          });
        } else {
          event._result = { bool: false };
        }
      },
      function(player, event) {
        player.moveCard(true);
      },
      function(player, event) {
        if (player.maxHp < 5) {
          player.gainMaxHp();
        }
        player.loseHp();
      },
      function(player, event) {
        player.addSkill("kotarou_rewrite_damage");
        player.addMark("kotarou_rewrite_damage", 1, false);
        game.log(player, "本回合下次造成的伤害", "#y+1");
      },
      function(player, event) {
        player.addSkill("kotarou_rewrite_recover");
        player.addMark("kotarou_rewrite_recover", 1, false);
        game.log(player, "本回合下次回复的体力", "#y+1");
      },
      function(player, event) {
        player.addSkill("kotarou_rewrite_sha");
        player.addMark("kotarou_rewrite_sha", 1, false);
        game.log(player, "本回合的手牌上限和使用【杀】的次数上限", "#y+1");
      }
    ],
    ai: {
      order: 4,
      result: {
        player(player) {
          if (player.getHistory("custom", function(evt) {
            return evt && evt.kotarou_rewrite == true;
          }).length >= 2) {
            return 0;
          }
          return 1;
        }
      }
    }
  },
  kotarou_rewrite_damage: {
    onremove: true,
    trigger: { source: "damageBegin1" },
    forced: true,
    async content(event, trigger, player) {
      trigger.num += player.countMark("kotarou_rewrite_damage");
      player.removeSkill("kotarou_rewrite_damage");
    },
    charlotte: true,
    intro: { content: "下一次造成的伤害+#" }
  },
  kotarou_rewrite_recover: {
    onremove: true,
    trigger: { player: "recoverBegin" },
    forced: true,
    async content(event, trigger, player) {
      trigger.num += player.countMark("kotarou_rewrite_recover");
      player.removeSkill("kotarou_rewrite_recover");
    },
    charlotte: true,
    intro: { content: "下一次回复的体力+#" }
  },
  kotarou_rewrite_sha: {
    onremove: true,
    mod: {
      maxHandcard(player, num) {
        return num + player.countMark("kotarou_rewrite_sha");
      },
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return num + player.countMark("kotarou_rewrite_sha");
        }
      }
    },
    charlotte: true,
    intro: { content: "手牌上限和出杀次数+#" }
  },
  kotarou_rewrite_block: {
    trigger: { player: "phaseEnd" },
    forced: true,
    charlotte: true,
    async content(event, trigger, player) {
      player.removeSkill("kotarou_rewrite");
      player.removeSkill("kotarou_aurora");
      if (player.maxHp > 3) {
        await player.loseMaxHp(player.maxHp - 3);
      }
    }
  },
  //伊座并杏子
  kyouko_rongzhu: {
    trigger: { global: "gainEnd" },
    filter(event, player) {
      if (player == event.player || event.getParent().name == "kyouko_rongzhu") {
        return false;
      }
      let evt = event.getl(player);
      return evt && evt.cards2 && evt.cards2.length > 0;
    },
    logTarget: "player",
    check(event, player) {
      return get.attitude(player, event.player) > 0;
    },
    async content(event, trigger, player) {
      await player.draw();
      const target = trigger.player;
      if (player.countCards("he") < 1 || !target.isIn()) {
        return;
      }
      const result = await player.chooseCard("he", true, "将一张牌交给" + get.translation(target)).forResult();
      if (result.bool) {
        await player.give(result.cards, trigger.player);
        const currentPhase = _status.currentPhase;
        let name;
        if (currentPhase == player) {
          name = "kyouko_rongzhu_me";
          player.addTempSkill(name);
          player.addMark(name, 1, false);
        } else if (currentPhase == trigger.player) {
          name = "kyouko_rongzhu_notme";
          currentPhase.addTempSkill(name);
          currentPhase.addMark(name, 1, false);
        }
      }
    },
    subSkill: {
      me: {
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("kyouko_rongzhu_me");
          }
        },
        intro: { content: "手牌上限+#" },
        onremove: true
      },
      notme: {
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.countMark("kyouko_rongzhu_notme");
            }
          }
        },
        intro: { content: "使用杀的次数上限+#" },
        onremove: true
      }
    }
  },
  kyouko_gongmian: {
    enable: "phaseUse",
    prompt: "出牌阶段，你可以选择一名未以此法选择过的角色，若其手牌：大于你，你获得其一张牌，然后交给其一张牌；小于你，其交给你一张牌，然后你交给其一张牌；等于你，你与其各摸一张牌。",
    filter(event, player) {
      return game.hasPlayer((current) => {
        return current != player && lib.skill.kyouko_gongmian.filterTarget(null, player, current);
      });
    },
    filterTarget(card, kyouko, hina) {
      if (kyouko == hina || kyouko.getStorage("kyouko_gongmian").includes(hina)) {
        return false;
      }
      let hs = hina.countCards("he");
      if (hs == 0) {
        return kyouko.countCards("h") == 0;
      }
      return true;
    },
    async content(event, trigger, player) {
      const { target, targets } = event;
      player.markAuto("kyouko_gongmian", targets);
      const hs = player.countCards("h");
      const ts = target.countCards("h");
      player.getHistory("custom").push({ kyouko_gongmian: true });
      let result;
      if (hs > ts) {
        result = await target.chooseCard("he", true, "交给" + get.translation(player) + "一张牌").forResult();
        if (!result.bool) return;
        target.give(result.cards, player);
      } else if (hs == ts) {
        game.asyncDraw([player, target]);
        await game.delayx();
        return;
      } else {
        result = await player.gainPlayerCard(target, true, "he").forResult();
        if (!result.bool) return;
      }
      if (player.countCards("he") > 0) {
        result = await player.chooseCard("he", true, "交给" + get.translation(target) + "一张牌").forResult();
        if (result.bool) {
          player.give(result.cards, target);
        }
      }
    },
    intro: {
      content: "已与$共勉"
    },
    group: ["kyouko_gongmian_use", "kyouko_gongmian_discard"],
    ai: {
      order: 6,
      result: {
        target(player, target) {
          if (player.getHistory("custom", function(evt) {
            return evt.kyouko_gongmian == true;
          }).length) {
            return 0;
          }
          return 1;
        }
      }
    }
  },
  kyouko_gongmian_use: {
    trigger: { player: "phaseUseEnd" },
    filter(event, player) {
      return player.getHistory("custom", function(evt) {
        return evt.kyouko_gongmian == true;
      }).length > 0 && game.hasPlayer((current) => {
        return current != player && current.countGainableCards(player, "hej") > 0;
      });
    },
    async cost(event, trigger, player) {
      const num = player.getHistory("custom", function(evt) {
        return evt.kyouko_gongmian == true;
      }).length;
      event.result = await player.chooseTarget(get.prompt("kyouko_gongmian"), "获得一名其他角色的至多" + get.cnNumber(num) + "张牌，然后交给其等量的牌", function(card, player2, target) {
        return target != player2 && target.countGainableCards(player2, "hej") > 0;
      }).set("ai", function(target) {
        let player2 = _status.event.player, att = get.attitude(player2, target);
        if (att > 0) {
          return att;
        }
        let he = player2.getCards("he");
        if (target.countCards("he", function(card) {
          return get.value(card, target) > 7;
        }) && he.length > 0) {
          return -att + 5 - Math.min.apply(
            Math,
            he.map((card) => {
              return get.value(card, player2);
            })
          );
        }
        return 0;
      }).forResult();
    },
    async content(event, trigger, player) {
      const num = player.getHistory("custom", function(evt) {
        return evt.kyouko_gongmian == true;
      }).length, target = event.targets[0];
      let result = await player.gainPlayerCard(target, "hej", true, [1, num]).forResult();
      if (target.isIn() && result.bool && result.cards && result.cards.length && player.countCards("he") > 0) {
        const num2 = result.cards.length, hs = player.getCards("he");
        if (hs.length <= num2) {
          result = { bool: true, cards: hs };
        } else {
          result = await player.chooseCard("he", true, num2, "交给" + get.translation(target) + get.cnNumber(num2) + "张牌").forResult();
        }
        if (result.bool && result.cards && result.cards.length) {
          player.give(result.cards, target);
        }
      }
    }
  },
  kyouko_gongmian_discard: {
    trigger: { player: "phaseDiscardBegin" },
    filter(event, player) {
      let hs = player.countCards("h");
      return hs > 0 && player.getHistory("custom", function(evt) {
        return evt.kyouko_gongmian == true;
      }).length >= player.hp && game.hasPlayer((current) => {
        return current != player && current.countCards("h") < hs;
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt("kyouko_gongmian"), "获得一名其他角色的所有手牌，然后将一半的牌交给该角色（向上取整）", function(card, player2, target) {
        return target != player2 && target.countCards("h") < player2.countCards("h");
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const hs = target.getCards("h");
      if (hs.length > 0) {
        await player.gain(hs, target, "giveAuto", "bySelf");
      }
      if (!target.isIn() || player.countCards("h") < 1) {
        return;
      }
      const playerCards = player.getCards("h"), num = Math.ceil(playerCards.length / 2);
      let result;
      if (playerCards.length <= num) {
        result = { bool: true, cards: playerCards };
      } else {
        result = await player.chooseCard("he", true, num, "交给" + get.translation(target) + get.cnNumber(num) + "张牌").forResult();
      }
      if (result.bool && result.cards && result.cards.length) {
        await player.give(result.cards, target);
      }
    }
  },
  //冰室忧希
  yuuki_yicha: {
    trigger: { player: "phaseUseBegin" },
    frequent: true,
    createDialog(id) {
      let dialog = ui.create.dialog("hidden");
      (dialog.textPrompt = dialog.add("异插")).style.textAlign = "center";
      dialog.cards = [];
      dialog.rawButtons = [];
      dialog.videoId = id;
      let cards2 = [];
      for (let i = 0; i < 3; i++) {
        let card = ui.create.card(null, null, true);
        card.pos = i;
        card.pos_x = i;
        card.pos_y = 0;
        cards2.push(card);
        dialog.rawButtons.push(card);
      }
      dialog.add(cards2);
      cards2 = [];
      for (let i = 0; i < 3; i++) {
        let card = ui.create.card(null, null, true);
        card.pos = i + 3;
        card.pos_x = i;
        card.pos_y = 1;
        cards2.push(card);
        dialog.rawButtons.push(card);
      }
      dialog.add(cards2);
      for (const i of dialog.buttons) {
        i.pos_x = i.link.pos_x;
        i.pos_y = i.link.pos_y;
        i.link = i.link.pos;
      }
      dialog.open();
    },
    addCard(card, id, pos) {
      let dialog = get.idDialog(id);
      if (!dialog) {
        return;
      }
      for (let i = 0; i < dialog.buttons.length; i++) {
        let button = dialog.buttons[i];
        if (button.link == pos) {
          let card2 = ui.create.button(card, "card");
          card2.pos = button.link;
          card2.pos_x = button.pos_x;
          card2.pos_y = button.pos_y;
          card2.classList.add("noclick");
          button.parentNode.insertBefore(card2, button);
          dialog.cards.push(card2);
          button.remove();
          dialog.buttons.splice(i, 1);
          break;
        }
      }
    },
    changePrompt(str, id) {
      let dialog = get.idDialog(id);
      if (!dialog) {
        return;
      }
      dialog.textPrompt.innerHTML = str;
    },
    async content(event, trigger, player) {
      const next = game.createEvent("cardsGotoOrdering");
      next.cards = [];
      next.setContent("cardsGotoOrdering");
      event.videoId = lib.status.videoId++;
      event.forceDie = true;
      const cards2 = [];
      const positions = [0, 1, 2, 3, 4, 5];
      const videoId = event.videoId;
      game.broadcastAll((id) => {
        lib.skill.yuuki_yicha.createDialog(id);
      }, videoId);
      const makeCallback = () => {
        return () => {
          event.getParent().orderingCards.remove(event.judgeResult.card);
          event.getParent(2).orderingCards.add(event.judgeResult.card);
        };
      };
      player.judge().set("callback", makeCallback());
      let judgeResult = await player.judge().set("callback", makeCallback()).forResult();
      let firstPos = null;
      if (get.position(judgeResult.card, true) == "o") {
        const pos = positions.randomRemove();
        firstPos = pos;
        game.broadcastAll(
          (card, id, player2, pos2) => {
            lib.skill.yuuki_yicha.addCard(card, id, pos2);
            lib.skill.yuuki_yicha.changePrompt(get.translation(player2) + "放置了" + get.translation(card), id);
          },
          judgeResult.card,
          videoId,
          player,
          pos
        );
        cards2.push(judgeResult.card);
        game.delay(2);
      }
      judgeResult = await player.judge().set("callback", makeCallback()).forResult();
      if (get.position(judgeResult.card, true) == "o") {
        let list = positions.slice();
        if (get.isLuckyStar(player) && firstPos !== null) {
          const index = get.color(cards2[0], false) == get.color(judgeResult.card, false) ? 0 : 1;
          list = list.filter((i) => Math.abs(i % 2 - firstPos % 2) == index);
        }
        const pos = list.randomRemove();
        game.broadcastAll(
          (card, id, player2, pos2) => {
            lib.skill.yuuki_yicha.addCard(card, id, pos2);
            lib.skill.yuuki_yicha.changePrompt(get.translation(player2) + "放置了" + get.translation(card), id);
          },
          judgeResult.card,
          videoId,
          player,
          pos
        );
        cards2.push(judgeResult.card);
        game.delay(2);
      }
      if (!cards2.length) {
        game.broadcastAll("closeDialog", videoId);
        event.finish();
        return;
      }
      for (let count = 4; count > 0; count--) {
        const judgeResult2 = await player.judge().set("callback", makeCallback()).forResult();
        const card = judgeResult2.card;
        const str = "请选择一个位置放置" + get.translation(card);
        if (player == game.me || player.isUnderControl()) {
          lib.skill.yuuki_yicha.changePrompt(str, videoId);
        } else if (player.isOnline()) {
          player.send(
            (str2, id) => {
              lib.skill.yuuki_yicha.changePrompt(str2, id);
            },
            str,
            videoId
          );
        }
        const posResult = await player.chooseButton().set("dialog", videoId).set("filterButton", (button) => {
          const posx = button.pos_x;
          const posy = button.pos_y;
          const adjacents = [];
          const dialogCards = ui.dialog.cards;
          for (const i of dialogCards) {
            if (i.pos_x == posx && Math.abs(i.pos_y - posy) == 1) adjacents.push(i.link);
            if (i.pos_y == posy && Math.abs(i.pos_x - posx) == 1) adjacents.push(i.link);
          }
          if (!adjacents.length) return false;
          const color = get.color(adjacents[0], false);
          if (adjacents.length > 1) {
            for (let i = 1; i < adjacents.length; i++) {
              if (get.color(adjacents[i]) != color) return false;
            }
          }
          return get.color(_status.event.card, false) != color;
        }).set("card", card).forResult();
        if (posResult.bool) {
          cards2.push(card);
          positions.remove(posResult.links[0]);
          game.broadcastAll(
            (card2, id, pos, player2) => {
              lib.skill.yuuki_yicha.addCard(card2, id, pos);
              lib.skill.yuuki_yicha.changePrompt(get.translation(player2) + "放置了" + get.translation(card2), id);
            },
            card,
            videoId,
            posResult.links[0],
            player
          );
          game.delay(2);
        }
      }
      game.broadcastAll("closeDialog", videoId);
      const targetResult = await player.chooseTarget("令一名角色获得" + get.translation(cards2), true).set("ai", (target) => {
        return get.attitude(_status.event.player, target);
      }).forResult();
      if (targetResult.bool && targetResult.targets && targetResult.targets.length) {
        const target = targetResult.targets[0];
        player.line(target, "green");
        target.gain({ cards: cards2, animate: "gain2" });
      }
    }
  },
  //库特莉亚芙卡
  kud_qiaoshou: {
    getList(event) {
      const bool = event.name == "phaseJieshu";
      const subtypes = bool ? ["equip2", "equip3"] : ["equip1", "equip4"];
      const list = bool ? ["rewrite_bagua", "rewrite_renwang", "rewrite_tengjia", "rewrite_baiyin"] : ["pyzhuren_heart", "pyzhuren_diamond", "pyzhuren_club", "pyzhuren_spade", "pyzhuren_shandian", "rewrite_zhuge"];
      return list.addArray(lib.inpile).map((name) => [get.subtype(name), "", name]).filter(([subtype]) => subtypes.includes(subtype));
    },
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      if (!get.info("kud_qiaoshou").getList(event).length) {
        return false;
      }
      return player.countCards("h") && !player.hasVCard((card) => card.storage?.kud_qiaoshou, "e");
    },
    chooseButton: {
      dialog(event, player) {
        const list = get.info("kud_qiaoshou").getList(event);
        return ui.create.dialog("巧手：选择一种装备牌", [list, "vcard"], "hidden");
      },
      check(button) {
        const player = get.player();
        const name = button.link[2];
        if (get.subtype(name) == "equip4" || player.getEquip(name)) {
          return 0;
        }
        const sha = player.countCards("h", "sha");
        switch (name) {
          case "rewrite_zhuge":
            return sha - player.getCardUsable("sha");
          case "guding":
            if (sha > 0 && game.hasPlayer((current) => {
              return get.attitude(player, current) < 0 && !current.countCards("h") && player.canUse("sha", current) && get.effect(current, { name: "sha" }, player) > 0;
            })) {
              return 1.4 + Math.random();
            }
            return 0;
          case "guanshi":
            if (sha > 0) {
              return 0.7 + Math.random();
            }
            return 0;
          case "qinggang":
            if (sha > 0) {
              return 0.4 + Math.random();
            }
            return 0;
          case "zhuque":
            if (game.hasPlayer((current) => {
              return get.attitude(player, current) < 0 && current.getEquip("tengjia") && get.effect(current, { name: "sha", nature: "fire" }, player) > 0;
            })) {
              return 1.2 + Math.random();
            }
            return 0;
          default:
            return 0;
        }
      },
      backup(links) {
        return {
          cardname: links[0][2],
          filterCard: true,
          discard: false,
          lose: false,
          delay: false,
          check(card) {
            return 6 - get.value(card);
          },
          async content(event, trigger, player) {
            const name = lib.skill.kud_qiaoshou_backup.cardname, card = {
              name,
              subtypes: [],
              storage: { kud_qiaoshou: true }
            };
            game.log(player, "声明了", "#y" + get.translation(name));
            player.$throw(event.cards);
            await game.delay(0, 300);
            await player.equip(get.autoViewAs(card, event.cards));
            player.addTempSkill("kud_qiaoshou_equip", { player: ["phaseUseEnd", "phaseZhunbeiBegin"] });
            await player.draw();
          },
          ai: { result: { player: 1 } }
        };
      },
      prompt(links) {
        return `选择一张手牌，将之视为${get.translation(links[0][2])}然后装备之`;
      }
    },
    group: "kud_qiaoshou_end",
    ai: {
      notemp: true,
      order: 5,
      result: { player: 1 }
    },
    subSkill: {
      end: {
        trigger: { player: "phaseJieshuBegin" },
        filter(event, player) {
          if (!get.info("kud_qiaoshou").getList(event).length) {
            return false;
          }
          return player.countCards("h") && !player.hasVCard((card) => card.storage?.kud_qiaoshou, "e");
        },
        async cost(event, trigger, player) {
          const list = get.info("kud_qiaoshou").getList(trigger);
          if (!list.length) {
            return;
          }
          let result;
          result = await player.chooseButton([get.prompt("kud_qiaoshou"), [list, "vcard"]]).set("ai", (button) => {
            const player2 = get.player();
            const name = button.link[2];
            if (get.subtype(name) == "equip3" || player2.getEquip(name)) {
              return false;
            }
            switch (name) {
              case "yexingyi":
                if (player2.hp > 2 || player2.getEquip("bagua") || player2.getEquip("tengjia")) {
                  return 1.5 + Math.random();
                }
                return 0.5 + Math.random();
              case "rewrite_bagua":
              case "rewrite_renwang":
                if (player2.getEquip("bagua") || player2.getEquip("tengjia") || player2.getEquip("renwang")) {
                  return Math.random();
                }
                return 1.2 + Math.random();
              case "rewrite_tengjia":
                if (player2.getEquip("baiyin")) {
                  return 1.3 + Math.random();
                }
                return Math.random();
              case "rewrite_baiyin":
                return 0.4 + Math.random();
              default:
                return 0;
            }
          }).forResult();
          if (!result?.bool || !result?.links?.length) {
            return;
          }
          const cardname = result.links[0][2];
          result = await player.chooseCard("h", `选择一张手牌，将之视为${get.translation(cardname)}然后装备之`).forResult();
          event.result = {
            bool: result?.bool,
            cards: result?.cards,
            cost_data: { cardname }
          };
        },
        async content(event, trigger, player) {
          const name = event.cost_data.cardname, card = {
            name,
            subtypes: [],
            storage: { kud_qiaoshou: true }
          };
          game.log(player, "声明了", "#y" + get.translation(name));
          player.$throw(event.cards);
          await game.delay(0, 300);
          await player.equip(get.autoViewAs(card, event.cards));
          player.addTempSkill("kud_qiaoshou_equip", { player: ["phaseUseEnd", "phaseZhunbeiBegin"] });
          await player.draw();
        }
      },
      backup: {},
      equip: {
        charlotte: true,
        onremove(player, skill) {
          const cards2 = player.getCards("e", (card) => card[card.cardSymbol]?.storage?.kud_qiaoshou);
          if (cards2.length) {
            player.loseToDiscardpile(cards2);
          }
        },
        mark: true,
        intro: {
          markcount: "expansion",
          mark(dialog, storage, player) {
            const cards2 = player.getCards("e", (card) => card[card.cardSymbol]?.storage?.kud_qiaoshou);
            if (!cards2.length) {
              return "无“巧”";
            } else {
              dialog.addText("当前装备");
              dialog.add(cards2);
            }
          }
        }
      }
    }
  },
  kud_buhui: {
    enable: "chooseToUse",
    filter(event, player) {
      return event.type == "dying" && player == event.dying && player.countCards("e") > 0;
    },
    skillAnimation: true,
    limited: true,
    animationColor: "gray",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const cards2 = player.getCards("e");
      if (cards2.length) {
        await player.discard(cards2);
        await player.draw(cards2.length);
      }
      player.addSkills("kud_chongzhen");
      await player.recoverTo(2);
    },
    derivation: "riki_chongzhen",
    ai: {
      order: 0.5,
      result: { player: 1 },
      save: true,
      skillTagFilter(player, tag, target) {
        return player == target;
      }
    }
  },
  kud_chongzhen: {
    inherit: "riki_chongzhen"
  },
  //神尾观铃
  misuzu_hengzhou: {
    trigger: {
      player: ["phaseJieshuBegin", "recoverEnd", "damageEnd", "phaseDrawBegin2", "phaseZhunbeiBegin"]
    },
    forced: true,
    character: true,
    filter(event, player) {
      if (event.name == "phaseZhunbei") {
        return true;
      }
      if (["damage", "recover"].includes(event.name)) {
        return event.num > 0;
      }
      let num = player.countMark("misuzu_hengzhou");
      if (event.name == "phaseDraw") {
        return num > 0 && !event.numFixed;
      }
      return num > 3;
    },
    async content(event, trigger, player) {
      let num = player.countMark("misuzu_hengzhou");
      if (trigger.name == "phaseDraw") {
        trigger.num += num;
      } else if (trigger.name == "phaseJieshu") {
        player.removeMark("misuzu_hengzhou", num);
        player.loseHp();
      } else {
        player.addMark("misuzu_hengzhou", trigger.num || 1);
      }
    },
    intro: {
      name: "诅咒",
      name2: "诅咒",
      content: "mark"
    },
    marktext: "诅",
    mod: {
      maxHandcard(player, num) {
        return num + player.countMark("misuzu_hengzhou");
      }
    },
    ai: {
      notemp: true
    }
  },
  misuzu_nongyin: {
    enable: "chooseToUse",
    viewAs: {
      name: "tao",
      isCard: true
    },
    viewAsFilter(player) {
      return !player.hasJudge("lebu") && player.countCards("hes", (card) => {
        return get.color(card) == "red" && get.type(card, "trick") != "trick";
      });
    },
    filterCard(card) {
      return get.color(card) == "red" && get.type(card, "trick") != "trick";
    },
    check(card) {
      return 7 + (_status.event.dying || _status.event.player).getDamagedHp() - get.value(card);
    },
    ignoreMod: true,
    position: "hes",
    log: false,
    async precontent(event, trigger, player) {
      const cards2 = event.result.cards;
      player.logSkill("misuzu_nongyin");
      player.$throw(cards2);
      await player.addJudge({ name: "lebu" }, cards2);
      event.result.card.cards = [];
      event.result.cards = [];
      delete event.result.card.suit;
      delete event.result.card.number;
    },
    ai: { result: 0.5 }
  },
  misuzu_zhongxing: {
    trigger: {
      player: "loseAfter",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    filter(event, player) {
      let evt = event.getl(player);
      return evt && evt.js && evt.js.length > 0 && !player.hasSkill("misuzu_zhongxing_haruko");
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "令一名角色选择摸两张牌或回复1点体力").set("ai", (card) => {
        return get.attitude(_status.event.player, card);
      }).forResult();
    },
    async content(event, trigger, player) {
      let target = event.targets[0];
      player.addTempSkill("misuzu_zhongxing_haruko");
      target.chooseDrawRecover(2, true);
    }
  },
  misuzu_zhongxing_haruko: { charlotte: true },
  //久岛鸥
  kamome_suitcase: {
    trigger: {
      player: ["phaseJudgeBefore", "phaseDiscardBefore", "turnOverBefore"]
    },
    forced: true,
    popup: false,
    equipSkill: true,
    async content(event, trigger, player) {
      trigger.cancel();
    }
  },
  kamome_yangfan: {
    trigger: {
      player: ["loseAfter", "enterGame"],
      global: ["equipAfter", "addJudgeAfter", "phaseBefore", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    forced: true,
    filter(event, player) {
      if (typeof event.getl != "function") {
        return event.name != "phase" || game.phaseNumber == 0;
      }
      let evt = event.getl(player);
      return evt && evt.player == player && evt.es && evt.es.length;
    },
    async content(event, trigger, player) {
      if (trigger.getl) {
        await player.draw(2 * trigger.getl(player).es.length);
      } else {
        await player.equip(game.createCard2("kamome_suitcase", "spade", 1));
      }
    },
    ai: {
      noe: true,
      reverseEquip: true,
      effect: {
        target(card, player, target, current) {
          if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) {
            return [1, 3];
          }
        }
      }
    }
  },
  kamome_huanmeng: {
    trigger: { player: "phaseZhunbeiBegin" },
    frequent: true,
    async content(event, trigger, player) {
      await player.chooseToGuanxing(1 + player.countCards("e")).set("prompt", "幻梦：点击或拖动将牌移动到牌堆顶或牌堆底");
    },
    ai: { threaten: 1.2 }
  },
  kamome_jieban: {
    trigger: {
      player: "damageEnd",
      source: "damageSource"
    },
    zhuanhuanji: true,
    marktext: "☯",
    mark: true,
    intro: {
      content(storage, player) {
        return "转换技。每回合限一次，当你受到或造成伤害后，" + (!storage ? "你可将两张牌交给一名其他角色，然后其交给你一张牌。" : "你可将一张牌交给一名其他角色，然后其交给你两张牌。");
      }
    },
    filter(event, player) {
      let num = player.storage.kamome_jieban ? 1 : 2;
      return player.countCards("he") >= num && !player.hasSkill("kamome_jieban_phase");
    },
    async cost(event, trigger, player) {
      event.num = player.storage.kamome_jieban ? 1 : 2;
      event.result = await player.chooseCardTarget({
        position: "he",
        filterCard: true,
        filterTarget: lib.filter.notMe,
        selectCard: event.num,
        prompt: get.prompt(event.skill),
        prompt2: event.num == 2 ? "将两张牌交给一名其他角色，然后其交给你一张牌。" : "将一张牌交给一名其他角色，然后其交给你两张牌。",
        ai1(card) {
          if (card.name == "du") {
            return 20;
          }
          let val = get.value(card);
          player = _status.event.player;
          if (get.position(card) == "e") {
            if (val <= 0) {
              return 10;
            }
            return 10 / val;
          }
          return 6 - val;
        },
        ai2(target) {
          player = _status.event.player;
          let att = get.attitude(player, target);
          if (ui.selected.cards[0].name == "du") {
            return -2 * att;
          }
          if (att > 0) {
            return 1.5 * att;
          }
          let num = get.select(_status.event.selectCard)[1];
          if (att < 0 && num == 1) {
            return -0.7 * att;
          }
          return att;
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const { targets, cards: cards2 } = event;
      const target = targets[0];
      player.addTempSkill("kamome_jieban_phase");
      await player.give(cards2, target);
      player.changeZhuanhuanji("kamome_jieban");
      const num = player.storage.kamome_jieban ? 1 : 2;
      const needNum = 3 - num;
      const hs = target.getCards("he");
      if (!hs.length) {
        return;
      }
      let result;
      if (hs.length <= needNum) {
        result = { bool: true, cards: hs };
      } else {
        result = await target.chooseCard("he", true, "交给" + get.translation(player) + get.cnNumber(needNum) + "张牌", needNum).set("ai", (card) => {
          const player2 = _status.event.player;
          const target2 = _status.event.getParent().player;
          if (get.attitude(player2, target2) > 0) {
            if (!target2.hasShan("all") && card.name == "shan") {
              return 10;
            }
            if (get.type(card) == "equip" && !get.cardtag(card, "gifts") && target2.hasUseTarget(card)) {
              return 10 - get.value(card);
            }
            return 6 - get.value(card);
          }
          return -get.value(card);
        }).forResult();
      }
      if (result.bool) {
        await target.give(result.cards, player);
      }
    }
  },
  kamome_jieban_phase: { charlotte: true },
  //友利奈绪
  nao_duyin: {
    trigger: { global: "phaseBegin" },
    filter(event, player) {
      return event.player != player && (!player.storage.nao_duyin || !player.storage.nao_duyin.includes(event.player));
    },
    logTarget: "player",
    charlotte: true,
    check() {
      return false;
    },
    async content(event, trigger, player) {
      const result = await player.chooseToDiscard("he", "弃置一张牌，或将武将牌翻面").set("ai", (card) => {
        if (_status.event.player.isTurnedOver()) {
          return 0;
        }
        return 6 - get.value(card);
      }).forResult();
      if (!result.bool) {
        await player.turnOver();
      }
      player.addTempSkill("nao_duyin2", { player: "phaseAfter" });
      if (!player.storage.nao_duyin) {
        player.storage.nao_duyin = [];
      }
      player.storage.nao_duyin.push(trigger.player);
      if (!player.storage.nao_duyin2) {
        player.storage.nao_duyin2 = [];
      }
      player.storage.nao_duyin2.push(trigger.player);
      player.markSkill("nao_duyin2");
    }
  },
  nao_duyin2: {
    intro: {
      content: "$不能使用牌指定你为目标，对$使用牌没有距离和次数限制"
    },
    mod: {
      targetEnabled(card, player, target) {
        if (target.storage.nao_duyin2 && target.storage.nao_duyin2.includes(player)) {
          return false;
        }
      },
      targetInRange(card, player, target) {
        if (player.storage.nao_duyin2 && player.storage.nao_duyin2.includes(target)) {
          return true;
        }
      }
    },
    trigger: { player: "useCardEnd" },
    firstDo: true,
    silent: true,
    onremove: true,
    filter(event, player) {
      if (player.storage.nao_duyin2) {
        for (const i of player.storage.nao_duyin2) {
          if (event.targets.includes(i)) {
            return true;
          }
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      if (trigger.addCount !== false) {
        trigger.addCount = false;
        const stat = player.getStat();
        if (stat && stat.card && stat.card[trigger.card.name]) {
          stat.card[trigger.card.name]--;
        }
      }
    }
  },
  nao_wanxin: {
    trigger: { global: "phaseEnd" },
    hasHistory(player) {
      return player.getHistory("damage").length > 0;
    },
    filter(event, player) {
      return game.hasPlayer((current) => {
        return lib.skill.nao_wanxin.hasHistory(current);
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), function(card, player2, target) {
        return _status.event.yuus.includes(target);
      }).set(
        "yuus",
        game.filterPlayer((current) => {
          return lib.skill.nao_wanxin.hasHistory(current);
        })
      ).set("ai", (target) => {
        return get.attitude(_status.event.player, target);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await target.draw(2);
      await player.turnOver(false);
      await player.link(false);
      if (target == player) {
        return;
      }
      await target.turnOver(false);
      await target.link(false);
    }
  },
  nao_shouqing: {
    global: "nao_shouqing2"
  },
  nao_shouqing2: {
    enable: "phaseUse",
    viewAs() {
      return { name: "tao" };
    },
    filterCard(card) {
      return get.name(card, false) === "tao";
    },
    ignoreMod: true,
    filterTarget(card, player, target) {
      return target != player && target.isDamaged() && target.hasSkill("nao_shouqing");
    },
    selectTarget() {
      return game.countPlayer((current) => {
        return lib.skill.nao_shouqing2.filterTarget(null, _status.event.player, current);
      }) > 1 ? 1 : -1;
    },
    chessForceAll: true,
    filter(event, player) {
      return player.hasCard((card) => get.name(card, false) === "tao", "hs") && game.hasPlayer((current) => {
        return lib.skill.nao_shouqing2.filterTarget(null, player, current);
      });
    },
    filterOk() {
      return ui.selected.cards.length === 1 && ui.selected.targets.length === 1;
    },
    position: "hs",
    onuse(links, player) {
      player.addSkill("nao_shouqing3");
      player.addMark("nao_shouqing3", 1, false);
    },
    prompt() {
      let list = game.filterPlayer((current) => {
        return lib.skill.nao_shouqing2.filterTarget(null, _status.event.player, current);
      });
      let str = "对" + get.translation(list);
      if (list.length > 1) {
        str += "中的一名角色";
      }
      str += "使用一张【桃】";
      return str;
    }
  },
  nao_shouqing3: {
    intro: {
      content: "手牌上限+#"
    },
    mod: {
      maxHandcard(player, num) {
        return num + player.countMark("nao_shouqing3");
      }
    },
    trigger: { player: "useCardAfter" },
    forced: true,
    popup: false,
    filter(event, player) {
      return event.skill == "nao_shouqing2";
    },
    async content(event, trigger, player) {
      await player.draw();
    }
  },
  //远野美凪&远野小满
  minagi_peiquan: {
    enable: "phaseUse",
    filter(event, player) {
      return player.hasCard((card) => card.hasGaintag("minagi_tag"), "h");
    },
    filterCard(card) {
      return card.hasGaintag("minagi_tag");
    },
    position: "h",
    filterTarget: lib.filter.notMe,
    discard: false,
    lose: false,
    delay: false,
    locked: true,
    promptfunc: () => "出牌阶段，你可以赠予一张“米券”，然后执行一项本回合内未被选择过的效果：⒈对其造成1点伤害；⒉摸两张牌；⒊弃置其的两张牌；⒋亮出牌堆顶的一张牌，然后你可以使用之。",
    check: (card) => {
      const player = _status.event.player;
      return get.type(card) == "equip" && game.hasPlayer((current) => player.canGift(card, current, true) && !current.refuseGifts(card, player) && get.effect(current, card, player, player) > 0) ? 2 : 1 + Math.random();
    },
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      await player.gift(cards2, target);
      const list = player.getStorage("minagi_peiquan_yukito");
      if (list.length >= 4) {
        return;
      }
      const yukito = get.translation(target);
      const next = player.chooseButton(
        [
          "配券：请选择一项执行",
          [
            [
              ["damage", "选项一：对" + yukito + "造成1点伤害"],
              ["draw", "选项二：摸两张牌"],
              ["discard", "选项三：弃置" + yukito + "的两张牌"],
              ["use", "选项四：亮出牌堆顶的一张牌，然后可以使用之"]
            ],
            "textbutton"
          ]
        ],
        true
      ).set("list", list).set("filterButton", (button) => !_status.event.list.includes(button.link)).set("ai", (button) => {
        const player2 = _status.event.player;
        const target2 = _status.event.getParent().target;
        switch (button.link) {
          case "damage":
            return get.damageEffect(target2, player2, player2);
          case "draw":
            return 2 * get.effect(player2, { name: "draw" }, player2, player2);
          case "discard":
            return get.effect(target2, { name: "guohe_copy2" }, player2, player2) * Math.min(1.6, target2.countCards("he"));
          case "use":
            return _status.event.getRand("minagi_peiquan") * 4;
        }
      });
      const result = await next.forResult();
      player.markAuto("minagi_peiquan_yukito", result.links);
      player.addTempSkill("minagi_peiquan_yukito");
      const choice = result.links[0];
      switch (choice) {
        case "damage":
          target.damage("nocard");
          break;
        case "draw":
          player.draw(2);
          break;
        case "discard":
          player.discardPlayerCard(target, 2, "he", true);
          break;
      }
      if (choice !== "use") {
        return;
      }
      const card = get.cards()[0];
      game.cardsGotoOrdering(card);
      player.showCards(card);
      await player.chooseUseTarget(card, "是否使用" + get.translation(card) + "？");
    },
    ai: {
      order: 4,
      result: {
        player: (player, target) => {
          const giftEffects = ui.selected.cards.map((value) => player.getGiftEffect(value, target));
          const baseEffect = Math.min(3, giftEffects.reduce((previousValue, currentValue) => previousValue + currentValue, 0) / giftEffects.length);
          const choices = ["damage", "draw", "discard", "use"];
          choices.removeArray(player.getStorage("minagi_peiquan_yukito"));
          if (choices.length <= 0) {
            return baseEffect;
          }
          return baseEffect + Math.max(
            ...choices.map((choice) => {
              switch (choice) {
                case "damage":
                  return get.damageEffect(target, player, player);
                case "draw":
                  return 2 * get.effect(player, { name: "draw" }, player, player);
                case "discard":
                  return get.effect(target, { name: "guohe_copy2" }, player, player) * Math.min(1.6, target.countCards("he"));
                case "use":
                  return _status.event.getRand("minagi_peiquan") * 4;
              }
            })
          );
        }
      }
    },
    group: "minagi_peiquan_umareta",
    subSkill: {
      yukito: { charlotte: true, onremove: true },
      umareta: {
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        forced: true,
        filter(event, player) {
          return (event.name != "phase" || game.phaseNumber == 0) && player.countCards("h") > 0;
        },
        async content(event, trigger, player) {
          const hs = player.getCards("h");
          player.addGaintag(hs, "minagi_tag");
        }
      }
    }
  },
  minagi_huanliu: {
    trigger: { player: "phaseZhunbeiBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(lib.filter.notMe, get.prompt(event.skill), "和一名其他角色进行“协力”，并获得“远野小满”的所有对应技能").set("ai", (target) => {
        return get.threaten(target) * Math.sqrt(1 + target.countCards("h")) * (target.isTurnedOver() || target.hasJudge("lebu") ? 0.1 : 1);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await player.chooseCooperationFor(target, "minagi_huanliu").set("ai", (button) => {
        let base = 0;
        switch (button.link) {
          case "cooperation_damage":
            base = 0.1;
            break;
          case "cooperation_draw":
            base = 0.6;
            break;
          case "cooperation_discard":
            base = 0.1;
            break;
          case "cooperation_use":
            base = 0.3;
            break;
        }
        return base + Math.random();
      });
      player.addAdditionalSkill("cooperation", ["minagi_huanliu_effect", "michiru_sheyuan"]);
      await game.delayx();
    },
    subSkill: {
      effect: {
        charlotte: true,
        trigger: { global: "phaseJieshuBegin" },
        forced: true,
        logTarget: "player",
        filter(event, player) {
          return player.checkCooperationStatus(event.player, "minagi_huanliu") && player.countCards("h") > 0;
        },
        async content(event, trigger, player) {
          game.log(player, "和", trigger.player, "的协力成功");
          const hs = player.getCards("h");
          player.addGaintag(hs, "minagi_tag");
          await game.delayx();
        }
      }
    },
    derivation: "michiru_sheyuan"
  },
  michiru_sheyuan: {
    charlotte: true,
    enable: "chooseToUse",
    filter(event, player) {
      if (player.hasSkill("michiru_sheyuan_round")) {
        return false;
      }
      let hs = player.getCards("h");
      if (!hs.length) {
        return false;
      }
      for (const i of hs) {
        if (i.hasGaintag("minagi_tag")) {
          return false;
        }
        if (!game.checkMod(i, player, "unchanged", "cardEnabled2", player)) {
          return false;
        }
      }
      for (const name of lib.inpile) {
        let type = get.type(name);
        if (type != "basic" && type != "trick") {
          return false;
        }
        let card = get.autoViewAs({ name }, hs);
        if (event.filterCard(card, player, event)) {
          return true;
        }
        if (name == "sha") {
          for (const nature of lib.inpile_nature) {
            card.nature = nature;
            if (event.filterCard(card, player, event)) {
              return true;
            }
          }
        }
      }
      return false;
    },
    hiddenCard(player, name) {
      let type = get.type(name);
      if (type != "basic" && type != "trick") {
        return false;
      }
      if (player.hasSkill("michiru_sheyuan_round")) {
        return false;
      }
      let hs = player.getCards("h");
      if (!hs.length) {
        return false;
      }
      if (_status.connectMode) {
        return true;
      }
      for (const i of hs) {
        if (i.hasGaintag("minagi_tag")) {
          return false;
        }
        if (!game.checkMod(i, player, "unchanged", "cardEnabled2", player)) {
          return false;
        }
      }
      return true;
    },
    chooseButton: {
      dialog(event, player) {
        let list = [], hs = player.getCards("h");
        for (const name of lib.inpile) {
          let type = get.type(name);
          if (type != "basic" && type != "trick") {
            continue;
          }
          let card = get.autoViewAs({ name }, hs);
          if (event.filterCard(card, player, event)) {
            list.push([type, "", name]);
          }
          if (name == "sha") {
            for (const nature of lib.inpile_nature) {
              card.nature = nature;
              if (event.filterCard(card, player, event)) {
                list.push([type, "", name, nature]);
              }
            }
          }
        }
        return ui.create.dialog("舍愿", [list, "vcard"], "hidden");
      },
      check(button) {
        let player = _status.event.player;
        let card = {
          name: button.link[2],
          nature: button.link[3]
        };
        if (_status.event.getParent().type == "phase") {
          return player.getUseValue(card, null, true);
        }
        return 1;
      },
      backup(links, player) {
        return {
          viewAs: {
            name: links[0][2],
            nature: links[0][3]
          },
          filterCard: true,
          position: "h",
          selectCard: -1,
          onuse(result, player2) {
            player2.addTempSkill("michiru_sheyuan_round", "roundStart");
          }
        };
      },
      prompt(links, player) {
        return "将所有手牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用，然后摸等量的牌";
      }
    },
    ai: {
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        return lib.skill.michiru_sheyuan.hiddenCard(player, "s" + tag.slice(8));
      },
      order: 1,
      result: {
        player(player) {
          if (_status.event.dying) {
            return get.attitude(player, _status.event.dying);
          }
          return 1;
        }
      }
    },
    subSkill: {
      round: {
        charlotte: true,
        trigger: { player: "useCardAfter" },
        forced: true,
        popup: false,
        filter(event, player) {
          return event.skill == "michiru_sheyuan_backup";
        },
        async content(event, trigger, player) {
          await player.draw(trigger.cards.length);
        }
      },
      backup: {}
    }
  },
  //坂上智代
  tomoyo_wuwei: {
    enable: ["chooseToUse", "chooseToRespond"],
    viewAs: { name: "sha" },
    viewAsFilter(player) {
      let storage = player.getStorage("tomoyo_wuwei_mark");
      return player.hasCard((card) => {
        return !storage.includes(get.suit(card));
      }, "hs");
    },
    position: "hs",
    filterCard(card, player) {
      let storage = player.getStorage("tomoyo_wuwei_mark");
      return !storage.includes(get.suit(card));
    },
    check(card) {
      return 5 - get.value(card);
    },
    onuse(result, player) {
      player.markAuto("tomoyo_wuwei_mark", [get.suit(result.card, false)]);
      player.addTempSkill("tomoyo_wuwei_mark");
    },
    onrespond(event, player) {
      player.markAuto("tomoyo_wuwei_mark", [get.suit(event.card, false)]);
      player.addTempSkill("tomoyo_wuwei_mark");
    },
    group: "tomoyo_wuwei_combo",
    subSkill: {
      mark: {
        charlotte: true,
        onremove: true
      },
      combo: {
        trigger: { global: "useCardAfter" },
        direct: true,
        //chooseToUse类技能暂时没办法改
        filter(event, player) {
          return event.card.name == "shan" && player.inRangeOf(event.player) && player.canUse("sha", event.player, false);
        },
        async content(event, trigger, player) {
          const next = player.chooseToUse(
            "武威：是否对" + get.translation(trigger.player) + "使用一张【杀】？",
            function(card, player2, event2) {
              if (get.name(card) != "sha") {
                return false;
              }
              return lib.filter.filterCard.apply(this, arguments);
            },
            trigger.player,
            -1
          );
          next.set("addCount", false);
          next.logSkill = "tomoyo_wuwei_combo";
          await next;
        }
      }
    }
  },
  tomoyo_zhengfeng: {
    dutySkill: true,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => player.inRange(current));
    },
    derivation: "tomoyo_changshi",
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "令一名攻击范围内的角色进行判定。其于你的下回合开始前使用与判定结果颜色相同的牌时，你摸一张牌。", function(card, player2, target) {
        return player2.inRange(target);
      }).set("ai", (target) => {
        let player2 = _status.event.player;
        if (player2.hp <= 1 && !player2.countCards("h")) {
          return 0;
        }
        let hs = target.countCards("h"), thr = get.threaten(target);
        if (target.hasJudge("lebu")) {
          return 0;
        }
        return Math.sqrt(1 + hs) * Math.sqrt(Math.max(1, 1 + thr));
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const result = await target.judge().forResult();
      player.addTempSkill("tomoyo_zhengfeng_tomoyo", {
        player: "phaseBeginStart"
      });
      player.markAuto("tomoyo_zhengfeng_tomoyo", [
        {
          target,
          color: result.color
        }
      ]);
    },
    group: "tomoyo_zhengfeng_after",
    subSkill: {
      tomoyo: {
        charlotte: true,
        onremove: true,
        mod: {
          inRangeOf(source, player) {
            let list = player.getStorage("tomoyo_zhengfeng_tomoyo");
            for (const obj of list) {
              if (obj.target == source) {
                return true;
              }
            }
          }
        },
        trigger: { global: "useCard" },
        forced: true,
        filter(event, player) {
          let color = get.color(event.card);
          if (color == "none") {
            return false;
          }
          let list = player.getStorage("tomoyo_zhengfeng_tomoyo");
          for (const obj of list) {
            if (obj.target == event.player && color == obj.color) {
              return true;
            }
          }
          return false;
        },
        async content(event, trigger, player) {
          await player.draw();
        },
        intro: {
          mark(dialog, students, player) {
            if (!students || !students.length) {
              return "全校风纪良好！";
            }
            let str = "";
            for (const i of students) {
              if (str.length > 0) {
                str += "<br>";
              }
              str += get.translation(i.target);
              str += "：";
              str += get.translation(i.color);
            }
            dialog.addText(str);
          }
        }
      },
      after: {
        trigger: { player: "phaseJieshuBegin" },
        filter(event, player) {
          return !player.hasHistory("useSkill", function(evt) {
            return evt.skill == "tomoyo_zhengfeng";
          });
        },
        prompt: "整风：是否放弃使命？",
        prompt2: "你可以减1点体力上限并失去〖武威〗，摸两张牌并回复1点体力，然后获得技能〖长誓〗。",
        skillAnimation: true,
        animationColor: "gray",
        check(event, player) {
          return player.hp * 1.1 + player.countCards("h") < 3;
        },
        async content(event, trigger, player) {
          game.log(player, "放弃了身为学生会长的使命");
          player.awakenSkill("tomoyo_zhengfeng");
          await player.loseMaxHp();
          await player.removeSkills("tomoyo_wuwei");
          await player.draw(2);
          await player.recover();
          await player.addSkills("tomoyo_changshi");
        }
      }
    }
  },
  tomoyo_changshi: {
    trigger: {
      global: ["gainAfter", "loseAsyncAfter"]
    },
    forced: true,
    filter(event, player) {
      return game.hasPlayer((current) => {
        return current != player && event.getg(current).length > 1 && player.inRangeOf(current);
      });
    },
    async content(event, trigger, player) {
      await player.draw();
    },
    group: "tomoyo_changshi_recover",
    subSkill: {
      recover: {
        trigger: { global: "recoverAfter" },
        forced: true,
        filter(event, player) {
          return event.player.isAlive() && player.inRangeOf(event.player);
        },
        async content(event, trigger, player) {
          await player.changeHujia(1);
        }
      }
    }
  },
  //天宫希优
  kiyu_yuling: {
    mod: {
      targetEnabled(card) {
        let info = get.info(card);
        if (!info || info.type != "trick" && info.type != "delay") {
          return;
        }
        if (info.range) {
          return false;
        }
      }
    },
    trigger: { target: "useCardToTargeted" },
    forced: true,
    charlotte: true,
    filter(event, player) {
      return event.card.name == "sha" && event.player.countCards("he") > 0;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      await trigger.player.chooseToDiscard("he", true, get.distance(trigger.player, player));
    },
    ai: {
      threaten: 0.7,
      effect: {
        target_use(card, player, target, current) {
          if (card.name == "sha") {
            return 0.7;
          }
        }
      }
    }
  },
  kiyu_rexianyu: {
    trigger: { player: "phaseUseEnd" },
    charlotte: true,
    filter(event, player) {
      return !player.hasSkill("kiyu_rexianyu_round", null, null, false) && player.hasHistory("useCard", function(evt) {
        let type = get.type(evt.card);
        if (type != "basic" && type != "trick") {
          return false;
        }
        return evt.getParent("phaseUse") == event;
      });
    },
    async cost(event, trigger, player) {
      const history = player.getHistory("useCard", function(evt) {
        let type = get.type(evt.card);
        if (type != "basic" && type != "trick") {
          return false;
        }
        return evt.getParent("phaseUse") == trigger;
      });
      const list = [];
      for (let i = 0; i < Math.min(history.length, 3); i++) {
        let card = history[i].card;
        list.push({ name: card.name, isCard: true });
        if (card.nature) {
          list[i].nature = card.nature;
        }
      }
      const result = await player.chooseTarget(get.prompt(event.skill), "将以下使用结果告知于一名其他角色：" + get.translation(list), function(card, player2, target) {
        return target != player2 && !target.hasSkill("kiyu_rexianyu_lastrun", null, null, false);
      }).set("ai", (target) => {
        return get.attitude(_status.event.player, target) * get.threaten(target) * Math.sqrt(1 + target.countCards("h")) * (target.isTurnedOver() || target.hasJudge("lebu") ? 0.1 : 1);
      }).forResult();
      if (result.bool) {
        event.result = {
          bool: result.bool,
          targets: result.targets,
          cost_data: { list }
        };
      }
    },
    async content(event, trigger, player) {
      player.addTempSkill("kiyu_rexianyu_round", "roundStart");
      const tabito = event.targets[0];
      tabito.storage.kiyu_rexianyu_lastrun = event.cost_data.list;
      tabito.storage.amamiya_kiyu = player;
      tabito.addTempSkill("kiyu_rexianyu_lastrun", {
        player: ["phaseUseAfter"],
        global: ["roundStart"]
      });
      await game.delayx();
    },
    subSkill: {
      round: { charlotte: true },
      lastrun: {
        enable: "chooseToUse",
        onChooseToUse(event) {
          if (!game.online && event.type == "phase") {
            let evtx = event.getParent();
            let num = event.player.getHistory("useCard", function(evt) {
              return evt.getParent("phaseUse") == evtx;
            }).length;
            event.set("rexianyu_num", num);
          }
        },
        filter(event, player) {
          if (!player.countCards("hs")) {
            return false;
          }
          let num = event.rexianyu_num, list = player.storage.kiyu_rexianyu_lastrun;
          if (!Array.isArray(list) || typeof num != "number" || list.length <= num) {
            return false;
          }
          let card = get.copy(list[num]);
          delete card.isCard;
          card = get.autoViewAs(card, "unsure");
          if (event.filterCard(card, player, event)) {
            return true;
          }
          return false;
        },
        onremove: true,
        viewAs(cards2, player) {
          let num = _status.event.rexianyu_num, list = player.storage.kiyu_rexianyu_lastrun;
          if (!Array.isArray(list) || typeof num != "number" || list.length <= num) {
            return { name: "sha" };
          }
          let card = get.copy(list[num]);
          delete card.isCard;
          return card;
        },
        prompt() {
          const player = _status.event.player;
          let num = _status.event.rexianyu_num, list = player.storage.kiyu_rexianyu_lastrun;
          if (!Array.isArray(list) || typeof num != "number" || list.length <= num) {
            return "无可用牌";
          }
          let card = list[num];
          let str = "将一张牌当做" + get.translation(card);
          let kiyu = player.storage.amamiya_kiyu;
          if (kiyu && kiyu.isAlive()) {
            str += "；然后" + get.translation(kiyu) + "摸一张牌，且你本回合的手牌上限+1";
          }
          return str;
        },
        filterCard: true,
        position: "h",
        popname: true,
        check(card) {
          let player = _status.event.player;
          let num = _status.event.rexianyu_num, list = player.storage.kiyu_rexianyu_lastrun;
          return player.getUseValue(list[num], null, true) - player.getUseValue(card, null, true);
        },
        group: "kiyu_rexianyu_earthbound",
        mark: true,
        intro: { content: "已记录：$" },
        ai: {
          order: 12,
          result: {
            player(player) {
              let lunarq = player.storage.amamiya_kiyu;
              if (lunarq && get.attitude(player, lunarq) <= 0) {
                return -1;
              }
              return 1;
            }
          }
        }
      },
      earthbound: {
        trigger: { player: "useCardAfter" },
        forced: true,
        charlotte: true,
        filter(event, player) {
          if (event.skill != "kiyu_rexianyu_lastrun") {
            return false;
          }
          let lunarq = player.storage.amamiya_kiyu;
          return get.itemtype(lunarq) == "player" && lunarq.isAlive();
        },
        async content(event, trigger, player) {
          const lunarq = player.storage.amamiya_kiyu;
          player.addTempSkill("kiyu_rexianyu_wolf");
          player.addMark("kiyu_rexianyu_wolf", 1, false);
          await lunarq.draw();
        }
      },
      wolf: {
        charlotte: true,
        onremove: true,
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("kiyu_rexianyu_wolf");
          }
        },
        markimage: "image/card/handcard.png",
        intro: { content: "手牌上限+#" }
      }
    }
  },
  //樱庭星罗
  seira_xinghui: {
    trigger: { player: "phaseZhunbeiBegin" },
    check(event, player) {
      return !player.getExpansions("seira_xinghui").length;
    },
    content: [
      async (event, trigger, player) => {
        await game.delayx();
        if (get.isLuckyStar(player)) {
          event.num = 6;
          player.throwDice(6);
        } else {
          player.throwDice();
        }
      },
      async (event, trigger, player) => {
        const num = event.num;
        const cards2 = get.cards(num);
        game.cardsGotoOrdering(cards2);
        const next = player.chooseToMove("allowChooseAll");
        next.set("prompt", "星辉：选择要作为“星屑”的牌（先选择的在上）");
        next.set("list", [["置于武将牌上", cards2], ["置入弃牌堆"]]);
        next.set("processAI", (list) => {
          let cards3 = list[0][1];
          const player2 = _status.event.player;
          const top = [];
          const judges = player2.getCards("j");
          let stopped = false;
          if (!player2.hasWuxie()) {
            for (let i = 0; i < judges.length; i++) {
              const judge = get.judge(judges[i]);
              cards3.sort((a, b) => judge(b) - judge(a));
              if (judge(cards3[0]) < 0) {
                stopped = true;
                break;
              } else {
                top.unshift(cards3.shift());
              }
            }
          }
          let bottom;
          if (!stopped) {
            cards3.sort((a, b) => get.value(b, player2) - get.value(a, player2));
            while (cards3.length) {
              if (get.value(cards3[0], player2) <= 5) break;
              top.unshift(cards3.shift());
            }
          }
          bottom = cards3;
          return [top, bottom];
        });
        const moveResult = await next.forResult();
        if (moveResult.bool && moveResult.moved && moveResult.moved[0].length) {
          const movedCards = moveResult.moved[0].slice().reverse();
          const targetResult = await player.chooseTarget(true, "将以下牌置于一名角色的武将牌上", get.translation(movedCards), (card, player2, target) => !target.getExpansions("seira_xinghui").length).set("ai", (target) => target == _status.event.player ? 1 : 0).forResult();
          if (targetResult.bool && targetResult.targets && targetResult.targets.length) {
            const target = targetResult.targets[0];
            player.line(target, { color: [253, 153, 182] });
            target.addToExpansion(movedCards).gaintag.add("seira_xinghui");
            game.log(player, "将" + get.cnNumber(movedCards.length) + "张牌置于", target, "的武将牌上");
            target.addSkill("seira_xinghui_hoshikuzu");
          }
        }
      }
    ],
    intro: {
      markcount: "expansion",
      content(storage, player) {
        return "共有" + get.cnNumber(player.getExpansions("seira_xinghui").length) + "张牌";
      },
      onunmark(storage, player) {
        player.removeSkill("seira_xinghui_hoshikuzu");
      }
    },
    subSkill: {
      hoshikuzu: {
        trigger: { source: "damageBegin1" },
        forced: true,
        charlotte: true,
        filter(event, player) {
          return player.getExpansions("seira_xinghui").length > 0;
        },
        async content(event, trigger, player) {
          trigger.num++;
          game.log(player, "造成了", "#y暴击伤害");
        },
        group: ["seira_xinghui_draw", "seira_xinghui_judge"]
      },
      draw: {
        trigger: { player: "drawBefore" },
        forced: true,
        filter(event, player) {
          return player.getExpansions("seira_xinghui").length > 0;
        },
        async content(event, trigger, player) {
          const cards2 = player.getExpansions("seira_xinghui");
          const num = Math.min(cards2.length, trigger.num);
          trigger.num -= num;
          await player.gain(cards2.slice(0, num), "draw");
          if (trigger.num == 0) {
            trigger.cancel();
          }
        }
      },
      judge: {
        trigger: { player: "judgeBegin" },
        forced: true,
        filter(event, player) {
          return player.getExpansions("seira_xinghui").length > 0;
        },
        async content(event, trigger, player) {
          trigger.directresult = player.getExpansions("seira_xinghui")[0];
        }
      }
    }
  },
  seira_yuanying: {
    enable: "phaseUse",
    usable: 1,
    filterTarget: true,
    selectTarget: 2,
    multitarget: true,
    multiline: true,
    line: { color: [253, 153, 182] },
    async content(event, trigger, player) {
      const targets = event.targets;
      for (const current of game.filterPlayer().sortBySeat()) {
        if (!targets.includes(current)) {
          await current.removeSkills("seira_yinyuan");
        } else {
          await current.addSkills("seira_yinyuan");
        }
      }
      await game.delayx();
    },
    ai: {
      order: 1,
      result: { target: 1 },
      expose: 0.1
    },
    derivation: "seira_yinyuan"
  },
  seira_yinyuan: {
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target != player && target.hasSkill("seira_yinyuan", null, null, false) && target.countCards("hej") > 0;
    },
    async content(event, trigger, player) {
      const { target } = event;
      await player.gainPlayerCard(target, true, "hej");
      await target.recover();
    },
    mark: true,
    intro: {
      content: "你的手牌对其他“姻缘者”可见。出牌阶段限一次，你可以获得一名其他“姻缘者”区域内的一张牌，然后其回复1点体力。"
    },
    ai: {
      order: 9,
      viewHandcard: true,
      skillTagFilter(player, tag, arg) {
        if (player == arg) {
          return false;
        }
        return player.hasSkill("seira_yinyuan") && arg.hasSkill("seira_yinyuan");
      },
      result: {
        player(player, target) {
          let effect = get.effect(target, { name: "shunshou_copy" }, player, player);
          if (target.isDamaged()) {
            if (effect < 0) {
              effect /= 2;
            }
            effect += get.recoverEffect(target, player, player);
          }
          return effect;
        }
      }
    }
  },
  //佐藤雏
  hina_shenshi: {
    groupSkill: "shen",
    trigger: { player: ["phaseUseBegin", "phaseUseEnd"] },
    frequent: true,
    filter(event, player) {
      return player.group == "shen";
    },
    async content(event, trigger, player) {
      const next = player.draw(2);
      next.gaintag = ["hina_shenshi"];
      await next;
      player.addSkill("hina_shenshi_yingbian");
      const cards2 = player.getCards("h", (card) => card.hasGaintag("hina_shenshi"));
      if (!cards2.length) {
        await game.delayx();
        return;
      }
      let result;
      if (cards2.length == 1) {
        result = { bool: true, cards: cards2 };
      } else {
        result = await player.chooseCard("h", true, "将一张“神视”牌置于牌堆顶", (card) => card.hasGaintag("hina_shenshi")).forResult();
      }
      if (result.bool) {
        game.log(player, "将一张牌置于了牌堆顶");
        await player.lose(result.cards, ui.cardPile, "insert");
        player.$throw(1, 1e3);
      }
      await game.delayx();
    },
    onremove(player) {
      player.removeGaintag("hina_shenshi");
    },
    group: "hina_shenshi_yingbian"
  },
  hina_shenshi_yingbian: {
    trigger: { player: "yingbian" },
    forced: true,
    filter: (event, player) => event.card.isCard && player.hasHistory("lose", (evt) => evt.getParent() == event && Object.values(evt.gaintag_map).some((value) => value.includes("hina_shenshi"))),
    async content(event, trigger, player) {
      if (!Array.isArray(trigger.temporaryYingbian)) {
        trigger.temporaryYingbian = [];
      }
      trigger.temporaryYingbian.add("force");
      trigger.temporaryYingbian.addArray(get.yingbianEffects());
    }
  },
  hina_xingzhi: {
    groupSkill: "key",
    trigger: { player: "yingbian" },
    usable: 1,
    filter: (event, player) => player.group == "key" && !event.card.yingbian && lib.yingbian.condition.complex.has("zhuzhan"),
    async content(event, trigger, player) {
      trigger.yingbianZhuzhanAI = (player2, card, source, targets) => (cardx) => {
        if (get.attitude(player2, source) <= 0) {
          return 0;
        }
        const info = get.info(card);
        let num = 0;
        if (info && info.ai && info.ai.yingbian) {
          const ai = info.ai.yingbian(card, source, targets, player2);
          if (ai) {
            num = ai;
          }
        }
        return Math.max(num, 6) - get.value(cardx);
      };
      trigger.afterYingbianZhuzhan = (event2) => event2.zhuzhanresult.draw(2);
      const result = await lib.yingbian.condition.complex.get("zhuzhan")(trigger);
      if (!result.bool) {
        return;
      }
      trigger.card.yingbian = true;
      lib.yingbian.effect.forEach((value) => game.yingbianEffect(trigger, value));
      player.addTempSkill("yingbian_changeTarget");
    }
  },
  //神山识
  shiki_omusubi: {
    audio: 2,
    trigger: { global: "roundStart" },
    direct: true,
    async content(event, trigger, player) {
      const result = await player.chooseTarget(get.prompt2("shiki_omusubi"), lib.filter.notMe).set("ai", (target) => {
        const player2 = _status.event.player;
        if (player2.isHealthy()) {
          return 0;
        }
        if (player2.hp < 3 && player2.getDamagedHp() < 2) {
          return 0;
        }
        const list = [];
        if (lib.character[target.name]) {
          list.addArray(lib.character[target.name][3]);
        }
        if (lib.character[target.name1]) {
          list.addArray(lib.character[target.name1][3]);
        }
        if (lib.character[target.name2]) {
          list.addArray(lib.character[target.name2][3]);
        }
        const filtered = list.filter((i) => !player2.hasSkill(i));
        if (!filtered.length) {
          return 0;
        }
        return 1 + Math.random();
      }).forResult();
      if (result.bool) {
        const target = result.targets[0];
        player.logSkill("shiki_omusubi", target);
        await player.loseMaxHp();
        const list = [];
        if (lib.character[target.name]) {
          list.addArray(lib.character[target.name][3]);
        }
        if (lib.character[target.name1]) {
          list.addArray(lib.character[target.name1][3]);
        }
        if (lib.character[target.name2]) {
          list.addArray(lib.character[target.name2][3]);
        }
        await player.addSkills(list);
        game.broadcastAll(function(list2) {
          lib.character.key_shiki[3].addArray(list2);
          game.expandSkills(list2);
          for (const i of list2) {
            const info = lib.skill[i];
            if (!info) {
              continue;
            }
            if (!info.audioname2) {
              info.audioname2 = {};
            }
            info.audioname2.key_shiki = "shiki_omusubi";
          }
        }, list);
      }
    }
  },
  //篝
  kagari_zongsi: {
    enable: "phaseUse",
    usable: 1,
    async content(event, trigger, player) {
      let result;
      const controls = [];
      if (ui.cardPile.hasChildNodes()) {
        controls.push("选择牌堆中的一张牌");
      }
      if (ui.discardPile.hasChildNodes()) {
        controls.push("选择弃牌堆中的一张牌");
      }
      if (game.hasPlayer((current) => current.countCards("hej") > 0)) {
        controls.push("选择一名角色区域内的一张牌");
      }
      if (!controls.length) {
        event.finish();
        return;
      }
      const next = player.chooseControl();
      next.set("choiceList", controls);
      next.set("prompt", "请选择要移动的卡牌的来源");
      next.set("ai", () => 0);
      result = await next.forResult();
      event.index = ["弃牌堆", "牌堆", "角色"].findIndex((item) => controls[result.index].includes(item));
      if (event.index == 2) {
        result = await player.chooseTarget("请选择要移动的卡牌的来源", true, (card, kagari, target) => target.countCards("hej") > 0).forResult();
      } else {
        const source = ui[event.index == 0 ? "discardPile" : "cardPile"].childNodes;
        const cardList = [...source];
        if (event.index == 0) {
          cardList.reverse();
        }
        const next3 = player.chooseButton(["请选择要移动的卡牌", cardList], true);
        next3.set("ai", get.buttonValue);
        result = await next3.forResult();
      }
      if (event.index == 2) {
        player.line(result.targets[0]);
        event.target1 = result.targets[0];
        result = await player.choosePlayerCard(result.targets[0], true, "hej").set("visible", true).forResult();
      } else {
        event.card = result.links[0];
      }
      if (event.index == 2) {
        event.card = result.cards[0];
      }
      const destControls = ["将这张牌移动到牌堆的顶部或者底部", "将这张牌移动到弃牌堆的顶部或者底部", "将这张牌移动到一名角色对应的区域里"];
      const next2 = player.chooseControl();
      next2.set("prompt", "要对" + get.translation(event.card) + "做什么呢？");
      next2.set("choiceList", destControls);
      next2.set("ai", () => 2);
      result = await next2.forResult();
      event.index2 = ["弃牌堆", "牌堆", "角色"].findIndex((item) => destControls[result.index].includes(item));
      if (event.index2 == 2) {
        const next3 = player.chooseTarget("要将" + get.translation(event.card) + "移动到哪一名角色的对应区域呢", true);
        next3.set("ai", (target) => target == _status.event.player ? 1 : 0);
        result = await next3.forResult();
      } else {
        result = await player.chooseControl("顶部", "底部").set("prompt", "把" + get.translation(event.card) + "移动到" + (event.index2 == 0 ? "弃" : "") + "牌堆的...").forResult();
      }
      if (event.index2 != 2) {
        event.way = result.control;
      } else {
        event.target2 = result.targets[0];
        const zoneList = ["手牌区"];
        if (lib.card[event.card.name].type == "equip" && event.target2.canEquip(event.card)) {
          zoneList.push("装备区");
        }
        if (lib.card[event.card.name].type == "delay" && !event.target2.isDisabledJudge() && !event.target2.hasJudge(event.card.name)) {
          zoneList.push("判定区");
        }
        if (zoneList.length == 1) {
          result = { control: zoneList[0] };
        } else {
          const next4 = player.chooseControl(zoneList);
          next4.set("prompt", "把" + get.translation(event.card) + "移动到" + get.translation(event.target2) + "的...");
          next4.set("ai", () => 0);
          result = await next4.forResult();
        }
      }
      if (event.index2 != 2) {
        const node = ui[event.index2 == 0 ? "discardPile" : "cardPile"];
        if (event.target1) {
          const next3 = event.target1.lose(event.card, event.position);
          if (event.way == "顶部") {
            next3.insert_card = true;
          }
          await next3;
        } else {
          if (event.way == "底部") {
            node.appendChild(event.card);
          } else {
            node.insertBefore(event.card, node.firstChild);
          }
        }
        game.updateRoundNumber();
        event.finish();
        return;
      }
      if (result.control == "手牌区") {
        const next3 = event.target2.gain(event.card);
        if (event.target1) {
          next3.source = event.target1;
          next3.animate = "giveAuto";
        } else {
          next3.animate = "draw";
        }
        await next3;
      } else if (result.control == "装备区") {
        if (event.target1) {
          event.target1.$give(event.card, event.target2);
        }
        event.target2.equip(event.card);
      } else {
        if (event.target1) {
          event.target1.$give(event.card, event.target2);
        }
        event.target2.addJudge(event.card);
      }
      game.updateRoundNumber();
    },
    ai: {
      order: 10,
      result: { player: 1 }
    }
  },
  //伊吹风子
  fuuko_xingdiao: {
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter: (event) => {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      await player.drawTo(8);
      const hs = player.getCards("h");
      if (hs.length > 0) {
        player.addShownCards(hs, "visible_fuuko_xingdiao");
      }
    },
    mod: {
      ignoredHandcard(card) {
        if (card.hasGaintag("visible_fuuko_xingdiao")) {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name == "phaseDiscard" && card.hasGaintag("visible_fuuko_xingdiao")) {
          return false;
        }
      }
    },
    onremove: true,
    global: "fuuko_xingdiao_gain",
    subSkill: {
      gain: {
        enable: "phaseUse",
        filter: (event, player) => {
          return game.hasPlayer((current) => lib.skill.fuuko_xingdiao_gain.filterTarget(null, player, current));
        },
        filterTarget: (card, player, target) => {
          return target != player && target.hasCard((card2) => card2.hasGaintag("visible_fuuko_xingdiao"), "h") && !target.getStorage("fuuko_xingdiao").includes(player) && target.hasSkill("fuuko_xingdiao");
        },
        selectTarget: () => {
          const num = game.countPlayer((current) => lib.skill.fuuko_xingdiao_gain.filterTarget(null, _status.event.player, current));
          return num > 1 ? 1 : -1;
        },
        async content(event, trigger, player) {
          const { target } = event;
          target.markAuto("fuuko_xingdiao", [player]);
          const cards2 = target.getCards("h", (card) => card.hasGaintag("visible_fuuko_xingdiao"));
          if (!cards2.length) {
            event.finish();
          } else {
            let result;
            if (cards2.length == 1) {
              result = { bool: true, links: cards2 };
            } else {
              result = await player.chooseButton(true, ["选择获得" + get.translation(target) + "的一张“星”", cards2]).forResult();
            }
            if (result.bool) {
              await player.gain(result.links, target, "give");
              await target.draw();
            }
          }
        },
        ai: {
          order: 6,
          result: {
            target: 1
          }
        }
      }
    }
  },
  fuuko_chuanyuan: {
    trigger: {
      player: "loseAfter",
      global: ["gainAfter", "equipAfter", "addJudgeAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    forced: true,
    filter(event, player) {
      const evt = event.getl(player);
      if (!evt.hs.length) {
        return false;
      }
      for (let i in evt.gaintag_map) {
        if (evt.gaintag_map[i].includes("visible_fuuko_xingdiao")) {
          return true;
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      const evt = trigger.getl(player), gains = [];
      let draws = 0;
      const map = evt.gaintag_map;
      const cards2 = evt.hs.filter((card) => {
        return map[card.cardid] && map[card.cardid].includes("visible_fuuko_xingdiao");
      });
      for (const card of cards2) {
        const suit = get.suit(card, player), num = get.number(card, player);
        const card2 = get.cardPile2((card3) => {
          if (gains.includes(card3)) {
            return false;
          }
          return get.suit(card3, player) == suit && get.number(card3, player) == num;
        });
        if (card2) {
          gains.push(card2);
        } else {
          draws++;
        }
      }
      if (gains.length) {
        const next = player.gain({ gains, animate: "gain2" });
        next.gaintag.add("fuuko_chuanyuan");
        await next;
      }
      if (draws) {
        await player.draw(draws).set("gaintag", ["fuuko_chuanyuan"]);
      }
      player.addSkill("fuuko_chuanyuan_effect");
    },
    ai: {
      combo: "fuuko_xingdiao"
    },
    subSkill: {
      effect: {
        mod: {
          targetInRange(card) {
            if (!card.cards || !card.cards.length) {
              return;
            }
            for (const i of card.cards) {
              if (!i.hasGaintag("fuuko_chuanyuan")) {
                return;
              }
            }
            return true;
          },
          cardUsable(card) {
            if (!card.cards || !card.cards.length) {
              return;
            }
            for (const i of card.cards) {
              if (!i.hasGaintag("fuuko_chuanyuan")) {
                return;
              }
            }
            return Infinity;
          }
        },
        charlotte: true,
        trigger: { player: "useCard1" },
        forced: true,
        popup: false,
        firstDo: true,
        filter(event, player) {
          if (event.addCount === false) {
            return false;
          }
          return player.hasHistory("lose", (evt) => {
            const evtx = evt.relatedEvent || evt.getParent();
            if (evtx != event) {
              return false;
            }
            for (let i in evt.gaintag_map) {
              if (evt.gaintag_map[i].includes("fuuko_chuanyuan")) {
                return true;
              }
            }
          });
        },
        async content(event, trigger, player) {
          trigger.addCount = false;
          const stat = player.getStat().card, name = trigger.card.name;
          if (typeof stat[name] == "number") {
            stat[name]--;
          }
        }
      }
    }
  },
  //伊莉雅
  iriya_yinji: {
    trigger: { player: "phaseUseBegin" },
    forced: true,
    filter(event, player) {
      return player.countCards("h") < 17;
    },
    async content(event, trigger, player) {
      await player.drawTo(17).set("gaintag", ["iriya_yinji_tag"]);
      player.addSkill("iriya_yinji_tag");
    },
    subSkill: {
      tag: {
        charlotte: true,
        mod: {
          cardEnabled(card) {
            if (get.itemtype(card) == "card") {
              if (card.hasGaintag("iriya_yinji_tag")) {
                return false;
              }
            } else if (card.isCard && card.cards) {
              if (card.cards.some((card2) => card2.hasGaintag("iriya_yinji_tag"))) {
                return false;
              }
            }
          },
          aiValue(player, card, num) {
            if (get.itemtype(card) == "card" && card.hasGaintag("iriya_yinji_tag")) {
              return num / 1e4;
            }
          },
          aiUseful(player, card, num) {
            if (get.itemtype(card) == "card" && card.hasGaintag("iriya_yinji_tag")) {
              return num / 1e4;
            }
          }
        }
      }
    }
  },
  iriya_haozhi: {
    enable: "phaseUse",
    filterCard: true,
    selectCard: [2, Infinity],
    promptfunc: () => "出牌阶段，你可以按照斗地主牌型弃置至少两张牌，且其他角色可以依次对其进行一轮响应。最后一名进行响应的角色可以根据对应牌型执行对应效果。",
    position: "he",
    getType(cards2, player) {
      let nums = cards2.map((card) => {
        let num = get.number(card, player);
        if (num <= 2) {
          return num + 13;
        }
        return num;
      }).sort((a, b) => a - b), len = nums.length;
      if (len == 1) {
        return ["单张", nums[0], 1];
      }
      if (len == 2) {
        return nums[1] == nums[0] ? ["对子", nums[0], 1] : null;
      }
      let map = {};
      for (let i = 0; i < len; i++) {
        let count = get.numOf(nums, nums[i]);
        if (!map[count]) {
          map[count] = [];
        }
        map[count].push(nums[i]);
        i += count - 1;
      }
      if (len == 3) {
        if (map[3]) {
          return ["三张", nums[0], 1];
        }
        return null;
      }
      if (map[len]) {
        return ["炸弹", nums[0], length];
      }
      if (map[1]) {
        if (map[1].length == len && len > 4) {
          for (let i = 0; i < map[1].length - 1; i++) {
            if (map[1][i + 1] - map[1][i] != 1) {
              return null;
            }
            if (map[1][i + 1] == 15) {
              return null;
            }
          }
          return ["单顺", nums[0], len];
        } else if (map[1].length == 2 && map[4] && len == 6) {
          return ["四带二", map[4][0], 1];
        } else if (map[3] && map[1].length == map[3].length && len == map[1].length * 4) {
          if (map[3].length == 1) {
            return ["三带一", map[3][0], 1];
          }
          for (let i = 0; i < map[3].length - 1; i++) {
            if (map[3][i + 1] - map[3][i] != 1) {
              return null;
            }
          }
          return ["单带飞机", map[3][0], map[3].length];
        }
        return null;
      }
      if (map[2]) {
        if (map[2].length * 2 == len && len > 5) {
          for (let i = 0; i < map[2].length - 1; i++) {
            if (map[2][i + 1] - map[2][i] != 1) {
              return null;
            }
            if (map[2][i + 1] == 15) {
              return null;
            }
          }
          return ["双顺", nums[0], len];
        } else if (map[4] && len == 6) {
          return ["四带二", map[4][0], 1];
        } else if (map[3] && map[2].length == map[3].length && len == map[2].length * 5) {
          if (map[3].length == 1) {
            return ["三带二", map[3][0], 1];
          }
          for (let i = 0; i < map[3].length - 1; i++) {
            if (map[3][i + 1] - map[3][i] != 1) {
              return null;
            }
            if (map[3][i + 1] == 15) {
              return null;
            }
          }
          return ["双带飞机", map[3][0], map[3].length];
        }
        return null;
      }
      if (map[3]) {
        if (map[3].length * 3 == len && len > 5) {
          for (let i = 0; i < map[3].length - 1; i++) {
            if (map[3][i + 1] - map[3][i] != 1) {
              return null;
            }
            if (map[3][i + 1] == 15) {
              return null;
            }
          }
          return ["三顺", nums[0], len];
        }
        return null;
      }
      return null;
    },
    filterOk() {
      return Array.isArray(lib.skill.iriya_haozhi.getType(ui.selected.cards, _status.event.player));
    },
    check(card) {
      let player = _status.event.player;
      let types = ["炸弹", "三顺", "单顺", "双顺", "三张", "对子"];
      let getNum = function(card2, player2) {
        let num2 = get.number(card2, player2);
        if (num2 <= 2) {
          return num2 + 13;
        }
        return num2;
      }, hasEnemy = game.hasPlayer((current) => get.attitude(player, current) < 0);
      let nums = player.getCards("he", function(card2) {
        return lib.filter.cardDiscardable(card2, player);
      }).map((card2) => getNum(card2, player));
      let numu = ui.selected.cards.map((card2) => getNum(card2, player));
      let num = getNum(card, player);
      if (!_status.event._iriya_haozhi_type) {
        for (const type of types) {
          switch (type) {
            case "炸弹":
              if (!hasEnemy) {
                break;
              }
              for (const i of nums) {
                if (get.numOf(nums, i) >= 4) {
                  _status.event._iriya_haozhi_type = "炸弹";
                  break;
                }
              }
              break;
            case "三顺":
              if (!hasEnemy) {
                break;
              }
              for (const i of nums) {
                if (i < 14 && get.numOf(nums, i) >= 3 && get.numOf(nums, i + 1) >= 3) {
                  _status.event._iriya_haozhi_type = "三顺";
                  break;
                }
              }
              break;
            case "双顺":
              if (!hasEnemy) {
                break;
              }
              for (const i of nums) {
                if (i < 13 && get.numOf(nums, i) >= 2) {
                  for (let j = 1; j < 3; j++) {
                    if (get.numOf(nums, i + j) < 2) {
                      break;
                    }
                    if (j == 2) {
                      _status.event._iriya_haozhi_type = "双顺";
                    }
                  }
                }
              }
              break;
            case "单顺":
              if (!hasEnemy) {
                break;
              }
              for (const i of nums) {
                if (i < 11) {
                  for (let j = 1; j < 5; j++) {
                    if (!nums.includes(i + j)) {
                      break;
                    }
                    if (j == 4) {
                      _status.event._iriya_haozhi_type = "单顺";
                    }
                  }
                }
              }
              break;
            case "三张":
              if (!hasEnemy) {
                break;
              }
              for (const i of nums) {
                if (get.numOf(nums, i) >= 3) {
                  _status.event._iriya_haozhi_type = "三张";
                  break;
                }
              }
              break;
            case "对子":
              for (const i of nums) {
                if (get.numOf(nums, i) >= 2) {
                  _status.event._iriya_haozhi_type = "对子";
                  break;
                }
              }
              break;
          }
          if (_status.event._iriya_haozhi_type) {
            break;
          }
        }
        if (!_status.event._iriya_haozhi_type) {
          _status.event._iriya_haozhi_type = "要不起";
        }
      }
      if (_status.event._iriya_haozhi_type == "要不起") {
        return 0;
      }
      if (!ui.selected.cards.length) {
        let count = get.numOf(nums, num);
        switch (_status.event._iriya_haozhi_type) {
          case "炸弹":
            if (count >= 4) {
              return 15;
            }
            break;
          case "对子":
            if (count > 1 && player.hasCard((cardx) => {
              return cardx != card && getNum(cardx, player) == num && cardx.hasGaintag("iriya_yinji_tag");
            }, "he")) {
              return 4 - get.value(card);
            }
            break;
          case "三张":
            if (count > 2) {
              return 8 - get.value(card);
            }
            break;
          case "单顺":
            if (num > 10) {
              return 0;
            }
            for (let i = 1; i < 5; i++) {
              if (get.numOf(nums, num + i) < 1) {
                return 0;
              }
            }
            return 9 - get.value(card);
          case "双顺":
            if (count < 2 || num > 12) {
              return 0;
            }
            for (let i = 1; i < 3; i++) {
              if (get.numOf(nums, num + i) < 2) {
                return 0;
              }
            }
            return 9 - get.value(card);
          case "三顺":
            if (count < 3 || num > 13) {
              return 0;
            }
            for (let i = 1; i < 2; i++) {
              if (get.numOf(nums, num + i) < 2) {
                return 0;
              }
            }
            return 12 - get.value(card);
        }
        return 0;
      } else {
        switch (_status.event._iriya_haozhi_type) {
          case "炸弹":
            if (numu.length >= 4) {
              return 0;
            }
            if (num == numu[0]) {
              return 15;
            }
            return 0;
          case "对子":
            if (numu.length >= 2) {
              return 0;
            }
            if (num == numu[0]) {
              return 3 - get.value(card);
            }
            return 0;
          case "三张":
            if (numu.length >= 3) {
              return 0;
            }
            if (num == numu[0]) {
              return 9 - get.value(card);
            }
            return 0;
          case "单顺":
          case "双顺":
          case "三顺":
            let map = {
              单顺: [5, 0],
              双顺: [3, 1],
              三顺: [2, 2]
            }, len = map[_status.event._iriya_haozhi_type][0], addNum = map[_status.event._iriya_haozhi_type][1];
            if (numu.length >= len) {
              return 0;
            }
            let numt = numu[numu.length - 1] + (numu.length % (1 + addNum) == 0 ? 1 : 0);
            if (num == numt) {
              return 10 + addNum - get.value(card);
            }
            return 0;
        }
      }
    },
    //响应AI
    respondAI(card) {
      if (!_status.event.goon) {
        return 0;
      }
      let type = _status.event.type, player = _status.event.player;
      let getNum = function(card2, player2) {
        let num2 = get.number(card2, player2);
        if (num2 <= 2) {
          return num2 + 13;
        }
        return num2;
      }, nums = player.getCards("he", function(card2) {
        return lib.filter.cardDiscardable(card2, player, "iriya_haozhi");
      }).map((card2) => getNum(card2, player));
      let num = getNum(card, player);
      if (!ui.selected.cards.length) {
        let count = get.numOf(nums, num);
        if (count >= 4 && (type[0] != "炸弹" || num > type[1] || count > type[2])) {
          return 15;
        }
        switch (type[0]) {
          case "对子":
            if (count > 1 && num > type[1]) {
              return 8 - get.value(card);
            }
            break;
          case "三张":
          case "三带一":
          case "三带二":
            if (count > 2 && num > type[1]) {
              return 9 - get.value(card);
            }
            break;
          case "单顺":
            if (num <= type[1] || num > 15 - type[2]) {
              return 0;
            }
            for (let i = 1; i < type[2]; i++) {
              if (get.numOf(nums, num + i) < 1) {
                return 0;
              }
            }
            return 10 - get.value(card);
          case "双顺":
            if (num <= type[1] || count < 2 || num > 15 - type[2] / 2) {
              return 0;
            }
            for (let i = 1; i < type[2] / 2; i++) {
              if (get.numOf(nums, num + i) < 2) {
                return 0;
              }
            }
            return 11 - get.value(card);
          case "三顺":
          case "单带飞机":
          case "双带飞机":
            let size = 3 + ["三顺", "单带飞机", "双带飞机"].indexOf(type[0]);
            if (num <= type[1] || count < 3 || num > 15 - type[2] / size) {
              return 0;
            }
            for (let i = 1; i < type[2] / size; i++) {
              if (get.numOf(nums, num + i) < 2) {
                return 0;
              }
            }
            return 12 - get.value(card);
        }
        return 0;
      } else {
        let numu = ui.selected.cards.map((card2) => getNum(card2, player));
        let numx = numu[0];
        if (num == numx) {
          let count = get.numOf(nums, numx);
          if (count >= 4 && (type[0] != "炸弹" || num > type[1] || count > type[2]) && numu.length < (type[0] == "炸弹" ? type[2] : 4)) {
            return 15;
          }
        }
        switch (type[0]) {
          case "对子":
            if (numu.length >= 2) {
              return 0;
            }
            if (num == numu[0]) {
              return 8 - get.value(card);
            }
            return 0;
          case "三张":
            if (numu.length >= 3) {
              return 0;
            }
            if (num == numu[0]) {
              return 9 - get.value(card);
            }
            return 0;
          case "三带一":
            if (numu.length == 3 || num == numu[0]) {
              return 9 - get.value(card);
            }
            return 0;
          case "三带二":
            if (numu.length >= 5) {
              return false;
            }
            if (numu.length == 3) {
              if (num == numu[0] || get.numOf(nums, num) < 2) {
                return 0;
              }
            } else if (numu.length == 4) {
              return num == numu[3] ? 9 - get.value(card) : 0;
            }
            if (num == numu[0]) {
              return 9 - get.value(card);
            }
            return 0;
          case "单顺":
          case "双顺":
          case "三顺":
            if (numu.length >= type[2]) {
              return 0;
            }
            let addNum = ["单顺", "双顺", "三顺"].indexOf(type[0]);
            let numt = numu[numu.length - 1] + (numu.length % (1 + addNum) == 0 ? 1 : 0);
            if (num == numt) {
              return 10 + addNum - get.value(card);
            }
            return 0;
          case "单带飞机":
            if (numu.length >= type[2]) {
              return 0;
            }
            let len = type[2] / 4 * 3;
            if (numu.length < len) {
              let numt2 = numu[numu.length - 1] + (numu.length % 3 == 0 ? 1 : 0);
              if (num == numt2) {
                return 12 - get.value(card);
              }
            } else {
              if (num >= numu[0] || num <= numu[len - 1]) {
                return 0;
              }
              return 12 - get.value(card);
            }
            return 0;
          case "双带飞机": {
            if (numu.length >= type[2]) {
              return 0;
            }
            let len2 = type[2] / 5 * 3;
            if (numu.length < len2) {
              let numt2 = numu[numu.length - 1] + (numu.length % 3 == 0 ? 1 : 0);
              if (num == numt2) {
                return 12 - get.value(card);
              }
            } else {
              if ((numu.length - len2) % 2 == 0) {
                if (numu.includes(num) || get.numOf(nums, num) < 2) {
                  return 0;
                }
                return 12 - get.value(card);
              } else {
                return num == numu[numu.length - 1] ? 12 - get.value(card) : 0;
              }
            }
            return 0;
          }
        }
      }
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      const players = game.filterPlayer().sortBySeat(player.getNext());
      let current = player;
      let current_type = lib.skill.iriya_haozhi.getType(cards2, player);
      let current_cards = cards2.slice(0);
      let result;
      if (!current_type) {
        event.finish();
        return;
      }
      for (const target of players) {
        if ((target != player || current != player) && target.isIn() && target.countCards("h") >= Math.min(cards2.length, 4)) {
          target.addTempSkill("iriya_haozhi_temp", {
            global: ["discardBefore", "chooseToDiscardEnd", "phaseAfter"]
          });
          const trans = get.translation(current);
          const getn = (card, player2) => {
            const num = get.number(card, player2);
            return num <= 2 ? num + 13 : num;
          };
          const sortedCards = [...current_cards].sort((a, b) => {
            const numa = getn(a, current);
            const numb = getn(b, current);
            if (numa != numb) return numa - numb;
            return lib.suit.indexOf(get.suit(a, current) - get.suit(b, current));
          });
          let cardsn = "";
          for (const i of sortedCards) {
            cardsn += "," + get.strNumber(get.number(i, current)) + get.translation(get.suit(i, current));
          }
          cardsn = cardsn.slice(1);
          const next = target.chooseToDiscard("是否响应" + trans + "的" + get.translation(current_type[0]) + "？", trans + "的牌组为" + cardsn + "。您此时可以点击“整理手牌”，将手牌按点数排序。", [2, Infinity], "he");
          next.set("type", current_type);
          next.set("filterOk", () => {
            const type2 = lib.skill.iriya_haozhi.getType(ui.selected.cards, _status.event.player);
            if (!type2) return false;
            const ptype = _status.event.type;
            if (type2[0] == "炸弹") {
              if (ptype[0] == "炸弹") {
                if (type2[2] > ptype[2]) return true;
                return type2[1] > ptype[1] && type2[2] == ptype[2];
              }
              return true;
            }
            return type2[0] == ptype[0] && type2[2] == ptype[2] && type2[1] > ptype[1];
          });
          next.set("goon", get.attitude(target, current) < 0);
          next.set("ai", lib.skill.iriya_haozhi.respondAI);
          result = await next.forResult();
          if (result.bool) {
            current = target;
            current_type = lib.skill.iriya_haozhi.getType(result.cards.slice(0), target);
            current_cards = result.cards.slice(0);
            if (!current_type) {
              event.finish();
              return;
            }
            current.addExpose(0.5);
          }
        }
      }
      if (!current.isIn()) return;
      const typeMap = {
        对子: 1,
        三张: 2,
        三带一: 2,
        三带二: 2,
        单顺: 3,
        双顺: 4,
        三顺: 5,
        单带飞机: 5,
        双带飞机: 5,
        炸弹: 6,
        四带二: 6
      };
      const type = typeMap[current_type[0]] || 0;
      if (type > 0) {
        const next = game.createEvent("iriya_haozhi_effect", false);
        next.player = current;
        next.setContent(lib.skill.iriya_haozhi["content" + type]);
      }
    },
    async content1(event, trigger, player) {
      const result = await player.chooseTarget([1, 2], "是否令至多两名角色各摸一张牌？").set("ai", (target) => {
        let att = get.attitude(_status.event.player, target);
        if (target.hasSkillTag("nogain")) att /= 10;
        return att;
      }).forResult();
      if (result.bool) {
        const targets = result.targets.sortBySeat();
        player.line(targets);
        game.asyncDraw(targets);
        game.delayex();
      }
    },
    async content2(event, trigger, player) {
      const result = await player.chooseTarget([1, 3], "是否弃置至多三名角色的各一张牌？", (card, player2, target) => {
        return target != player2 && target.hasCard((card2) => lib.filter.canBeDiscarded(card2, player2, target), "he");
      }).set("ai", (target) => {
        return get.effect(target, { name: "guohe_copy2" }, _status.event.player, _status.event.player);
      }).forResult();
      if (result.bool) {
        const targets = result.targets.sortBySeat();
        player.line(targets, "green");
        for (const target of targets) {
          player.discardPlayerCard(target, true, "he");
        }
      }
      player.draw();
    },
    async content3(event, trigger, player) {
      let count = 0;
      let color = null;
      for (; ; ) {
        const next = player.chooseTarget("是否弃置一名其他角色的一张牌？", (card, player2, target2) => {
          return target2 != player2 && target2.hasCard((card2) => lib.filter.canBeDiscarded(card2, player2, target2), "he");
        }).set("ai", (target2) => {
          return get.effect(target2, { name: "guohe_copy2" }, _status.event.player, _status.event.player);
        });
        if (color) next.set("prompt2", "若你弃置的牌为" + get.translation(color) + "，则你可以重复此流程");
        const chooseResult = await next.forResult();
        if (!chooseResult.bool) break;
        const target = chooseResult.targets[0];
        player.line(target, "fire");
        const discardResult = await player.discardPlayerCard(target, true, "he").forResult();
        if (!discardResult.bool) break;
        count++;
        const cardColor = get.color(discardResult.cards[0], false);
        if (!color) {
          color = cardColor;
        } else if (cardColor !== color) {
          break;
        }
      }
      if (count > 0) player.draw(count);
    },
    async content4(event, trigger, player) {
      let count = 0;
      let color = null;
      for (; ; ) {
        const next = player.chooseTarget("是否获得一名其他角色的一张牌？", (card, player2, target2) => {
          return target2 != player2 && target2.hasCard((card2) => lib.filter.canBeGained(card2, player2, target2), "he");
        }).set("ai", (target2) => {
          return get.effect(target2, { name: "shunshou_copy2" }, _status.event.player, _status.event.player);
        });
        if (color) next.set("prompt2", "若你得到的牌为" + get.translation(color) + "，则你可以重复此流程");
        const chooseResult = await next.forResult();
        if (!chooseResult.bool) break;
        const target = chooseResult.targets[0];
        player.line(target, "fire");
        const gainResult = await player.gainPlayerCard(target, true, "he").forResult();
        if (!gainResult.bool) break;
        count++;
        const cardColor = get.color(gainResult.cards[0], false);
        if (!color) {
          color = cardColor;
        } else if (cardColor !== color) {
          break;
        }
      }
      if (count > 0) await player.recover(count);
    },
    async content5(event, trigger, player) {
      const result = await player.chooseTarget([1, 3], "是否令至多三名其他角色翻面？", lib.filter.notMe).set("ai", (target) => {
        const att = get.attitude(_status.event.player, target);
        return target.isTurnedOver() ? 10 * att : -6 * att;
      }).forResult();
      if (!result.bool) return;
      const targets = result.targets.sortBySeat();
      player.line(targets, "thunder");
      for (const target of targets) {
        target.turnOver();
      }
      const result2 = await player.chooseTarget("是否对一名目标角色造成1点火属性伤害？", (card, player2, target) => {
        return targets.includes(target);
      }).set("ai", (target) => {
        return get.damageEffect(target, _status.event.player, _status.event.player, "fire");
      }).forResult();
      if (result2.bool) {
        const target = result2.targets[0];
        player.line(target, "fire");
        target.damage("fire");
      }
    },
    async content6(event, trigger, player) {
      const result = await player.chooseTarget("是否对一名其他角色进行核打击？", "你对该角色造成2点雷属性伤害，然后该角色翻面，弃置装备区内的所有牌和四张手牌。", lib.filter.notMe).set("ai", (target2) => {
        const att = get.attitude(_status.event.player, target2);
        return target2.isTurnedOver() ? -6 * att * Math.sqrt(2 + target2.countCards("he")) : -att * Math.sqrt(2 + target2.countCards("he"));
      }).forResult();
      if (!result.bool) {
        event.finish();
        return;
      }
      const target = result.targets[0];
      player.line(target, "thunder");
      target.damage("thunder", 2);
      target.turnOver();
      const eNum = target.countCards("e");
      if (eNum > 0) {
        await target.chooseToDiscard("e", true, eNum);
      }
      const hNum = target.countCards("h");
      if (hNum > 0) {
        await target.chooseToDiscard("h", true, Math.min(4, hNum));
      }
    },
    ai: {
      sortCardByNum: true,
      order: 13,
      result: {
        player: 1
      }
    },
    subSkill: {
      extra: {
        charlotte: true,
        mod: {
          targetInRange: () => true,
          cardUsable: () => Infinity
        },
        trigger: { player: "useCard2" },
        forced: true,
        onremove: true,
        async content(event, trigger, player) {
          const num = player.countMark("iriya_haozhi_extra");
          player.removeSkill("iriya_haozhi_extra");
          const card = trigger.card;
          if (trigger.addCount !== false) {
            trigger.addCount = false;
            const stat = player.getStat().card;
            if (stat[card.name] && stat[card.name] > 0) {
              stat[card.name]--;
            }
          }
          const info = get.info(card);
          if (info.allowMultiple == false) {
            event.finish();
            return;
          }
          if (!trigger.targets || info.multitarget) {
            return;
          }
          if (!game.hasPlayer((current) => !trigger.targets.includes(current) && lib.filter.targetEnabled2(card, player, current))) {
            return;
          }
          const prompt2 = "为" + get.translation(card) + "增加" + (num > 1 ? "至多" : "") + get.cnNumber(num) + "个目标";
          const result = await player.chooseTarget(get.prompt("iriya_haozhi_extra"), [1, num], (card2, player2, target) => {
            return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player2, target);
          }).set("prompt2", prompt2).set("ai", (target) => {
            return get.effect(target, trigger.card, _status.event.player, _status.event.player);
          }).set("card", trigger.card).set("targets", trigger.targets).forResult();
          if (result.bool) {
            if (!event.isMine() && !event.isOnline()) {
              game.delayx();
            }
            player.logSkill("iriya_haozhi_extra", result.targets);
            trigger.targets.addArray(result.targets);
          }
        },
        intro: {
          content: "使用下一张牌无距离和次数限制，且可以增加#个目标"
        }
      },
      temp: {
        ai: { sortCardByNum: true },
        charlotte: true
      }
    }
  },
  //藏里见
  satomi_luodao: {
    trigger: { player: "useCardToPlayered" },
    logTarget: "target",
    filter(event, player) {
      return event.card.name == "sha" && event.target.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      const target = trigger.target;
      target.showHandcards(get.translation(player) + "对" + get.translation(target) + "发动了【落刀】");
      if (target.hasCard((card) => get.name(card, target) == "shan", "h")) {
        await player.discardPlayerCard(target, true, "h", "visible").set("filterButton", (button) => get.name(button.link) == "shan");
      } else if (player.countCards("he") > 0) {
        await player.chooseToDiscard("he", true);
      }
    }
  },
  satomi_daohai: {
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return player.hasHistory("lose", function(evt) {
        return evt.type == "discard" && evt.cards2.length > 0;
      }) && player.hasUseTarget({ name: "wugu" });
    },
    check(event, player) {
      return player.getUseValue({ name: "wugu" }) + player.getUseValue({ name: "lebu" }) > 0;
    },
    async content(event, trigger, player) {
      const wuguResult = await player.chooseUseTarget("wugu", true).forResult();
      if (!wuguResult.bool) {
        return;
      }
      const gainedCards = [];
      player.getHistory("gain", function(evt) {
        if (evt.getParent().name == "wugu" && evt.getParent(4) == event) {
          gainedCards.addArray(evt.cards);
        }
      });
      const cards2 = gainedCards.filter((card) => {
        return player.getCards("h").includes(card) && game.checkMod(card, player, "unchanged", "cardEnabled2", player);
      });
      if (!cards2.length) {
        return;
      }
      const result = await player.chooseCardTarget({
        prompt: "是否将得到的牌当做【乐不思蜀】使用？",
        filterCard(card) {
          return _status.event.cards.includes(card);
        },
        cards: cards2,
        filterTarget(card, player2, target) {
          card = get.autoViewAs({ name: "lebu" }, ui.selected.cards);
          return player2.canUse(card, target);
        },
        ai1: () => 1,
        ai2(target) {
          let player2 = _status.event.player;
          get.autoViewAs({ name: "lebu" }, ui.selected.cards);
          return get.effect(target, { name: "lebu" }, player2, player2);
        }
      }).forResult();
      if (result.bool) {
        player.useCard({ name: "lebu" }, result.cards, result.targets[0]);
      }
    }
  },
  //苍井绘梨花
  erika_shisong: {
    trigger: { player: "useCard" },
    forced: true,
    charlotte: true,
    filter(event, player) {
      if (player != _status.currentPhase) {
        return false;
      }
      let index = player.getHistory("useCard").indexOf(event), history = player.actionHistory;
      for (let i = history.length - 2; i >= 0; i--) {
        if (history[i].isMe) {
          let evt = history[i].useCard[index];
          return evt && get.type2(evt.card) == get.type(event.card);
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      await player.draw();
    },
    mod: {
      maxHandcard(player, num) {
        return num + player.hujia;
      }
    }
  },
  erika_yousheng: {
    init: (player) => {
      player.addSkill("erika_yousheng_mamori");
    },
    dutySkill: true,
    group: ["erika_yousheng_achieve", "erika_yousheng_fail"],
    trigger: { global: "useCardToTarget" },
    filter(event, player) {
      return player.getStorage("erika_yousheng").includes(event.target) && (event.card.name == "sha" || get.type2(event.card, false) == "trick" && get.tag(event.card, "damage") > 0) && player.countMark("erika_yousheng_ruka") + 1 <= player.countCards("he");
    },
    intro: {
      content: "已保护$"
    },
    async cost(event, trigger, player) {
      const num = player.countMark("erika_yousheng_ruka") + 1;
      event.result = await player.chooseToDiscard("he", num, get.prompt(event.skill, trigger.target), "弃置" + num + "张牌，并转移" + get.translation(trigger.card), "chooseonly").forResult();
    },
    async content(event, trigger, player) {
      await player.discard(event.cards);
      let ruka = trigger.target, evt = trigger.getParent();
      evt.targets.remove(ruka);
      evt.triggeredTargets2.remove(ruka);
      evt.targets.push(player);
      evt.triggeredTargets2.push(player);
      player.addTempSkill("erika_yousheng_ruka");
      let str = "erika_yousheng_" + player.playerid;
      if (!evt[str]) {
        evt[str] = [];
      }
      evt[str].add(ruka);
    },
    subSkill: {
      achieve: {
        trigger: { player: "changeHujiaAfter" },
        forced: true,
        skillAnimation: "legend",
        animationColor: "water",
        filter(event, player) {
          return player.storage.erika_yousheng && event.num < 0 && !player.hujia;
        },
        async content(event, trigger, player) {
          player.awakenSkill("erika_yousheng");
          game.log(player, "成功完成使命");
          const list = [player];
          list.addArray(player.storage.erika_yousheng);
          list.sortBySeat();
          const alive = list.filter((current) => current.isAlive());
          player.line(alive, "green");
          await game.asyncDraw(alive, 3);
          await game.delayx();
        }
      },
      fail: {
        trigger: { global: "damageEnd" },
        forced: true,
        filter(event, player) {
          return player.getStorage("erika_yousheng").includes(event.player) && event.card && (event.card.name == "sha" || get.type2(event.card, false) == "trick" && get.tag(event.card, "damage") > 0);
        },
        async content(event, trigger, player) {
          player.awakenSkill("erika_yousheng");
          game.log(player, "使命失败");
          let num = player.hujia;
          if (num > 0) {
            player.changeHujia(-num);
            await player.chooseToDiscard(num, true, "he");
          }
        }
      },
      mamori: {
        trigger: { global: "roundStart" },
        skillAnimation: true,
        animationColor: "wood",
        async cost(event, trigger, player) {
          event.result = await player.chooseTarget(get.prompt("erika_yousheng"), [1, 2], lib.filter.notMe, "选择至多两名其他角色。你减2点体力上限并获得3点护甲。").set("ai", (ruka) => {
            return -1;
          }).forResult();
        },
        async content(event, trigger, player) {
          player.awakenSkill(event.name);
          player.markAuto("erika_yousheng", event.targets);
          await player.loseMaxHp(2);
          await player.changeHujia(3);
        }
      },
      ruka: {
        trigger: { global: "useCardAfter" },
        charlotte: true,
        filter(event, player) {
          return event["erika_yousheng_" + player.playerid] && event.cards.filterInD().length > 0;
        },
        async cost(event, trigger, player) {
          event.result = await player.chooseTarget("是否令一名原目标角色获得" + get.translation(trigger.cards.filterInD()) + "？", function(card, player2, target) {
            return _status.event.targets.includes(target);
          }).set("targets", trigger["erika_yousheng_" + player.playerid]).forResult();
        },
        async content(event, trigger, player) {
          const ruka = event.targets[0];
          player.line(ruka, "green");
          ruka.gain(trigger.cards.filterInD(), "gain2");
        }
      }
    }
  },
  //李映夏
  liyingxia_sanli: {
    trigger: { target: "useCardToTargeted" },
    forced: true,
    filter(event, player) {
      if (event.player == player || event.player != _status.currentPhase) {
        return false;
      }
      let index = event.player.getHistory("useCard", function(evt) {
        return evt.targets.includes(player);
      }).indexOf(event.getParent());
      if (index == 2) {
        return event.player.isIn() && player.countCards("he") > 0;
      }
      return index < 2 && index > -1;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const index = trigger.player.getHistory("useCard", (evt) => evt.targets.includes(player)).indexOf(trigger.getParent());
      if (index == 2) {
        const result = await player.chooseCard("he", true, "三礼：交给" + get.translation(trigger.player) + "一张牌").forResult();
        if (result.bool) {
          await player.give(result.cards, trigger.player);
        }
      } else {
        await player.draw();
      }
    }
  },
  liyingxia_zhenjun: {
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return player.group == "key";
    },
    async cost(event, trigger, player) {
      const num = player.getHistory("useCard", function(evt) {
        return evt.card.name == "sha" || get.type(evt.card) == "trick" && get.tag(evt.card, "damage") > 0;
      }).length + 1;
      event.result = await player.chooseTarget(get.prompt(event.skill), [1, num], "令至多" + get.cnNumber(num) + "名角色各摸一张牌").set("ai", (serafu) => get.attitude(_status.event.player, serafu)).forResult();
    },
    groupSkill: "key",
    async content(event, trigger, player) {
      const { targets } = event;
      targets.sortBySeat();
      await game.asyncDraw(targets);
      for (const i of targets) {
        i.addTempSkill("liyingxia_zhenjun_enhance", {
          player: player == i ? "phaseJieshuBegin" : "phaseAfter"
        });
      }
      await game.delayx();
    },
    subSkill: {
      enhance: {
        trigger: { source: "damageBegin1" },
        forced: true,
        charlotte: true,
        mark: true,
        filter: (event, player) => player == _status.currentPhase,
        intro: { content: "下回合首次造成的伤害+1" },
        async content(event, trigger, player) {
          trigger.num++;
          player.removeSkill(event.name);
        }
      }
    }
  },
  liyingxia_wumai: {
    trigger: { global: "roundStart" },
    filter(event, player) {
      return player.group == "shu" && (player.getStorage("liyingxia_wumai").length < 4 || game.hasPlayer((current) => current.isDamaged()));
    },
    async cost(event, trigger, player) {
      let list = lib.skill.liyingxia_wumai.derivation.slice(0);
      list.removeArray(player.getStorage("liyingxia_wumai"));
      if (list.length) {
        const result = await player.chooseControl(list, "cancel2").set("prompt", get.prompt(event.skill)).set("prompt2", "获得一个技能直到本轮结束").forResult();
        if (result.control !== "cancel2") {
          event.result = {
            bool: true,
            cost_data: {
              type: "addSkill",
              skill: result.control
            }
          };
        }
      } else {
        const num = Math.min(
          3,
          game.countPlayer((current) => current.isDamaged())
        );
        const result = await player.chooseBool(get.prompt(event.skill) + "（可摸" + get.cnNumber(num) + "张牌）").forResult();
        if (result.bool) {
          event.result = {
            bool: true,
            cost_data: {
              type: "drawCards",
              num
            }
          };
        }
      }
    },
    groupSkill: "shu",
    async content(event, trigger, player) {
      const result = event.cost_data;
      if (result.type === "addSkill") {
        player.markAuto("liyingxia_wumai", [result.skill]);
        player.addTempSkills(result.skill, "roundStart");
      } else if (result.type === "drawCards") {
        player.draw(result.num);
      }
    },
    derivation: ["bazhen", "rejizhi", "reguanxing", "youlong"]
  },
  //雾岛佳乃
  kano_liezhen: {
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return player.getHistory("useCard").length > 0;
    },
    frequent: true,
    async cost(event, trigger, player) {
      let history = player.getHistory("useCard");
      if (history.length > 1) {
        let type = get.type2(history[0].card, false);
        for (let i = 1; i < history.length; i++) {
          if (get.type2(history[i].card, false) != type) {
            const result = await player.chooseButton(["列阵：是否视为使用其中一种牌？", [["kano_paibingbuzhen"].concat(get.zhinangs()), "vcard"]]).set("filterButton", (button) => {
              return _status.event.player.hasUseTarget({
                name: button.link[2],
                isCard: true
              });
            }).set("ai", (button) => {
              return _status.event.player.getUseValue({
                name: button.link[2],
                isCard: true
              });
            }).forResult();
            if (result.bool) {
              event.result = {
                bool: true,
                cost_data: {
                  links: result.links
                }
              };
            }
            return;
          }
        }
      }
      let str = _status.renku.length ? "获得仁库中的所有牌" : "摸两张牌";
      event.result = await player.chooseBool(get.prompt(event.skill), str).set("frequentSkill", event.skill).forResult();
    },
    async content(event, trigger, player) {
      const result = event.cost_data;
      if (!result || !result.links.length) {
        if (_status.renku.length) {
          const cards2 = _status.renku.slice(0);
          await player.gain(cards2, "gain2", "fromRenku");
        } else {
          player.draw(2);
        }
      } else {
        player.chooseUseTarget(result.links[0][2], true);
      }
    },
    init(player) {
      player.storage.renku = true;
    }
  },
  kano_poyu: {
    trigger: { target: "useCardToTargeted" },
    charlotte: true,
    filter(event, player) {
      return _status.renku.length > 0 && (event.card.name == "sha" || get.type(event.card) == "trick" && get.tag(event.card, "damage") > 0);
    },
    check(trigger, player) {
      return get.effect(player, trigger.card, trigger.player, player) < 0;
    },
    async content(event, trigger, player) {
      const judgeResult = await player.judge().forResult();
      const bool = (() => {
        const type = get.type2(judgeResult.card.name);
        for (const i of _status.renku) {
          if (get.suit(i) == judgeResult.suit || get.type2(i) == type) {
            return true;
          }
        }
        return false;
      })();
      if (!bool) {
        return;
      }
      const result = await player.chooseButton(["是否移去一张牌，令" + get.translation(trigger.card) + "对你无效？", _status.renku]).set("types", [judgeResult.suit, get.type2(judgeResult.card.name)]).set("filterButton", (button) => {
        const types = _status.event.types;
        return get.suit(button.link, false) == types[0] || get.type2(button.link, false) == types[1];
      }).set("ai", () => 1).forResult();
      if (result.bool) {
        const card = result.links[0];
        player.$throw(card, 1e3);
        game.cardsDiscard(card).fromRenku = true;
        game.log(player, "将", card, "置入了弃牌堆");
        trigger.excluded.add(player);
        game.updateRenku();
      }
    },
    init(player) {
      player.storage.renku = true;
    }
  },
  //藤川米亚
  mia_shihui: {
    trigger: { player: "phaseDrawBegin1" },
    forced: true,
    filter(event, player) {
      return !event.numFixed;
    },
    async content(event, trigger, player) {
      trigger.changeToZero();
      let num = 0;
      const all = player.getAllHistory();
      if (all.length > 1) {
        for (let i = all.length - 2; i >= 0; i--) {
          if (all[i].isMe) {
            for (const evt of all[i].lose) {
              if (evt.type == "discard") {
                num += evt.cards2.length;
              }
            }
            break;
          }
        }
      }
      await player.draw(1 + num);
    },
    group: "mia_shihui_recover",
    subSkill: {
      recover: {
        trigger: { player: "phaseJieshuBegin" },
        forced: true,
        filter(event, player) {
          return player.isDamaged() || player.countCards("he") > 0;
        },
        async content(event, trigger, player) {
          await player.chooseToDiscard("he", true);
          await player.recover();
        }
      }
    }
  },
  mia_qianmeng: {
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    locked: false,
    dutySkill: true,
    derivation: "mia_fengfa",
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      await player.draw();
      if (player.countCards("he") > 0) {
        const result = await player.chooseCard("he", true, "潜梦：选择一张牌置于牌堆中").forResult();
        if (result.bool) {
          const card = result.cards[0];
          player.storage.mia_qianmeng = card;
          player.$throw(card, 1e3);
          const next = player.lose(card, ui.cardPile);
          next.insert_index = () => ui.cardPile.childNodes[Math.ceil(ui.cardPile.childNodes.length / 2)];
          await next;
        }
      }
      await game.delayx();
    },
    onremove: true,
    group: ["mia_qianmeng_achieve", "mia_qianmeng_fail"],
    subSkill: {
      achieve: {
        trigger: {
          global: ["gainAfter", "loseAsyncAfter"]
        },
        forced: true,
        filter(event, player) {
          let card = player.storage.mia_qianmeng;
          if (event.name == "gain") {
            let source = event.player, cards2 = event.getg(source);
            return cards2.includes(card) && source.getCards("hejsx").includes(card);
          } else {
            if (event.type != "gain") {
              return false;
            }
            let owner = get.owner(card);
            return owner && event.getg(owner).includes(card);
          }
        },
        skillAnimation: true,
        animationColor: "key",
        async content(event, trigger, player) {
          game.log(player, "成功完成使命");
          player.awakenSkill("mia_qianmeng");
          const card = player.storage.mia_qianmeng;
          const owner = get.owner(card);
          if (owner && owner != player) {
            await owner.give(card, player);
          }
          if (player.hp < player.maxHp) {
            await player.recover(player.maxHp - player.hp);
          }
          player.changeSkills(["mia_fengfa"], ["mia_shihui"]);
        }
      },
      fail: {
        trigger: { player: "die" },
        forceDie: true,
        filter(event, player) {
          return get.itemtype(player.storage.mia_qianmeng) == "card";
        },
        async cost(event, trigger, player) {
          event.result = await player.chooseTarget(get.prompt("mia_qianmeng"), "令一名角色获得牌堆中所有点数为" + player.storage.mia_qianmeng.number + "的牌", lib.filter.notMe).forResult();
        },
        async content(event, trigger, player) {
          game.log(player, "使命失败");
          player.awakenSkill("mia_qianmeng");
          let target = event.targets[0];
          let num = player.storage.mia_qianmeng.number, suit = player.storage.mia_qianmeng.suit, cards2 = [];
          for (let i = 0; i < ui.cardPile.childNodes.length; i++) {
            let card = ui.cardPile.childNodes[i];
            if (card.number == num && card.suit == suit) {
              cards2.push(card);
            }
          }
          if (cards2.length) {
            await target.gain({ cards: cards2, animate: "gain2" });
          }
        }
      }
    }
  },
  mia_fengfa: {
    trigger: { player: "phaseDrawBegin2" },
    forced: true,
    filter(event, player) {
      return !event.numFixed;
    },
    async content(event, trigger, player) {
      let num = 0;
      const all = player.getAllHistory();
      if (all.length > 1) {
        for (let i = all.length - 2; i >= 0; i--) {
          if (all[i].isMe) {
            num += all[i].useCard.length;
            break;
          }
        }
      }
      trigger.num += num;
    }
  },
  //一之濑琴美
  kotomi_qinji: {
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return player.hasUseTarget("wanjian");
    },
    //chooseUseTarget也不好改 先放着
    direct: true,
    async content(event, trigger, player) {
      player.addTempSkill("kotomi_qinji2");
      const next = player.chooseUseTarget({ name: "wanjian", isCard: true }, get.prompt("kotomi_qinji"), "视为使用一张【万箭齐发】");
      next.logSkill = "kotomi_qinji";
      await next;
    }
  },
  kotomi_qinji2: {
    trigger: { source: "damageBefore" },
    forced: true,
    popup: false,
    filter(event, player) {
      return event.getParent().skill == "kotomi_qinji";
    },
    async content(event, trigger, player) {
      trigger.cancel();
      await trigger.player.loseHp(trigger.num);
    }
  },
  kotomi_chuanxiang: {
    global: "kotomi_chuanxiang2"
  },
  kotomi_chuanxiang2: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return !player.hasSkill("kotomi_chuanxiang") && player.countCards("e", lib.skill.kotomi_chuanxiang2.filterCard) > 0;
    },
    filterCard(card, player) {
      if (!player) {
        player = _status.event.player;
      }
      return game.hasPlayer((current) => {
        return current != player && current.canEquip(card);
      });
    },
    position: "e",
    filterTarget(card, player, target) {
      return target != player && target.canEquip(ui.selected.cards[0]);
    },
    chessForceAll: true,
    check(card) {
      if (get.value(card) <= 0) {
        return 10;
      }
      let player = _status.event.player;
      if (game.hasPlayer((current) => {
        return current.hasSkill("kotomi_chuanxiang") && get.attitude(player, current) > 0;
      })) {
        let subtype = get.subtype(card, false);
        if (player.countCards("hs", (cardx) => {
          return get.type(cardx) == "equip" && get.subtype(cardx, false) == subtype && player.canUse(cardx, player) && get.effect(player, cardx, player, player) > 0;
        })) {
          return 8;
        }
        return 7 / Math.max(1, get.value(card));
      }
      return 0;
    },
    promptfunc() {
      let players = game.filterPlayer((current) => {
        return current.hasSkill("kotomi_chuanxiang");
      });
      return "将一张装备牌传给其他角色，然后令" + get.translation(players) + "摸一张牌。若传给该角色，则其改为摸两张牌。";
    },
    prepare: "give",
    discard: false,
    lose: false,
    async content(event, trigger, player) {
      const { target, cards: cards2 } = event;
      await target.equip(cards2[0]);
      const list = game.filterPlayer((current) => current.hasSkill("kotomi_chuanxiang"));
      await game.asyncDraw(list, (targetx) => targetx == target ? 2 : 1);
      await game.delayx();
    },
    ai: {
      order: 8,
      result: {
        target(player, target) {
          let card = ui.selected.cards[0];
          if (!card) {
            return 0;
          }
          let eff = get.effect(target, card, player, target);
          if (target.hasSkill("kotomi_chuanxiang")) {
            eff++;
          }
          return eff;
        }
      }
    }
  },
  //井上晶
  asara_shelu: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("he") > 0 && game.hasPlayer((current) => {
        return current != player && current.countCards("h") > 0;
      });
    },
    filterCard: true,
    position: "he",
    filterTarget(card, player, target) {
      return target != player && target.countCards("h") > 0;
    },
    check(card) {
      return 6 - get.value(card);
    },
    async content(event, trigger, player) {
      const { target, cards: cards2 } = event;
      if (!target.countCards("h")) {
        return;
      }
      const chooseResult = await player.choosePlayerCard(target, "h", true).forResult();
      player.showCards(chooseResult.cards);
      const cards22 = chooseResult.cards;
      target.$give(cards22, player, false);
      target.loseToSpecial(cards22, "asara_yingwei", player).visible = true;
      const card1 = cards2[0], card2 = cards22[0];
      if (card1.suit == card2.suit) {
        await player.draw(2);
      }
      if (card1.number == card2.number) {
        await player.recover();
      }
    },
    ai: {
      order: 6,
      result: {
        target: -1
      }
    }
  },
  asara_yingwei: {
    trigger: { player: "yingbian" },
    forced: true,
    filter: (event, player) => event.card.isCard && player.hasHistory("lose", (evt) => evt.getParent() == event && Object.values(evt.gaintag_map).some((value) => value.includes("asara_yingwei"))),
    async content(event, trigger, player) {
      trigger.forceYingbian = true;
    },
    ai: {
      combo: "asara_shelu"
    }
  },
  //国崎往人
  yukito_kongwu: {
    enable: "phaseUse",
    usable: 1,
    content: [
      async (event, trigger, player) => {
        if (_status.connectMode) {
          event.time = lib.configOL.choose_timeout;
        }
        event.videoId = lib.status.videoId++;
        if (player.isUnderControl()) {
          game.swapPlayerAuto(player);
        }
        const switchToAuto = () => {
          game.pause();
          game.countChoose();
          setTimeout(() => {
            _status.imchoosing = false;
            event._result = {
              bool: true,
              score: get.rand(1, 5)
            };
            if (event.dialog) event.dialog.close();
            if (event.control) event.control.close();
            game.resume();
          }, 5e3);
        };
        const createDialog = (player2, id) => {
          if (_status.connectMode) lib.configOL.choose_timeout = "30";
          if (player2 == game.me) return;
          const str = get.translation(player2) + "正在表演《小空飞天》...<br>";
          ui.create.dialog(str).videoId = id;
        };
        const chooseButton = () => {
          lib.skill.yufeng.$playFlappyBird(5, "小空飞天");
        };
        game.broadcastAll(createDialog, player, event.videoId);
        if (event.isMine()) {
          chooseButton();
        } else if (event.isOnline()) {
          event.player.send(chooseButton);
          event.player.wait();
          game.pause();
        } else {
          switchToAuto();
        }
      },
      async (event, trigger, player) => {
        game.broadcastAll(
          (id, time) => {
            if (_status.connectMode) lib.configOL.choose_timeout = time;
            const dialog = get.idDialog(id);
            if (dialog) dialog.close();
          },
          event.videoId,
          event.time
        );
        const result = event.result || event._result;
        game.log(player, "获得了", "#g" + result.score + "分");
        if (!result.score) {
          player.chooseToDiscard(2, true, "he");
          return;
        }
        const list = [];
        const list2 = [];
        for (let i = 0; i < 5; i++) {
          if (lib.skill.yukito_kongwu.moves[i].filter(player, true)) {
            list.push(i);
          } else {
            list2.push(i);
          }
        }
        const chosenList = list.length >= result.score ? list.randomGets(result.score) : list.concat(list2.randomGets(result.score - list.length));
        chosenList.sort();
        const next = player.chooseButton(["控物：请选择一项", [chosenList.map((i) => [i, lib.skill.yukito_kongwu.moves[i].prompt]), "textbutton"]]);
        next.set("forced", true);
        next.set("filterButton", (button) => {
          return lib.skill.yukito_kongwu.moves[button.link].filter(_status.event.player);
        });
        next.set("ai", (button) => {
          return lib.skill.yukito_kongwu.moves[button.link].filter(_status.event.player, true) ? 1 + Math.random() : Math.random();
        });
        const chooseResult = await next.forResult();
        const num = chooseResult.links[0];
        let branchResult;
        switch (num) {
          case 4:
            player.moveCard(true);
            event.finish();
            return;
          case 0:
            branchResult = await player.chooseTarget(true, "令一名角色摸两张牌").set("ai", (target) => {
              let att = get.attitude(_status.event.player, target) / Math.sqrt(1 + target.countCards("h"));
              if (target.hasSkillTag("nogain")) att /= 10;
              return att;
            }).forResult();
            if (branchResult.bool) {
              const target = branchResult.targets[0];
              player.line(target, "green");
              target.draw(2);
            }
            break;
          case 1:
            branchResult = await player.chooseTarget(true, "对一名角色造成1点伤害").set("ai", (target) => {
              return get.damageEffect(target, _status.event.player, _status.event.player);
            }).forResult();
            if (branchResult.bool) {
              const target = branchResult.targets[0];
              player.line(target, "green");
              target.damage();
            }
            break;
          case 2:
            branchResult = await player.chooseTarget(true, "令一名已受伤的角色回复1点体力", (card, player2, target) => {
              return target.isDamaged();
            }).set("ai", (target) => {
              return get.recoverEffect(target, _status.event.player, _status.event.player);
            }).forResult();
            if (branchResult.bool) {
              const target = branchResult.targets[0];
              player.line(target, "green");
              target.recover();
            }
            break;
          case 3:
            branchResult = await player.chooseTarget(true, "弃置一名角色区域内的两张牌", (card, player2, target) => {
              return target.countDiscardableCards(player2, "hej") > 0;
            }).set("ai", (target) => {
              return -get.attitude(_status.event.player, target);
            }).forResult();
            if (branchResult.bool) {
              const target = branchResult.targets[0];
              player.line(target, "green");
              player.discardPlayerCard(target, "hej", true, 2);
            }
            break;
        }
      }
    ],
    moves: [
      {
        prompt: "令一名角色摸两张牌",
        filter: () => true
      },
      {
        prompt: "对一名角色造成1点伤害",
        filter(player, ai) {
          if (!ai) {
            return true;
          }
          return game.hasPlayer((current) => {
            return get.damageEffect(current, player, player) > 0;
          });
        }
      },
      {
        prompt: "令一名已受伤的角色回复1点体力",
        filter(player, ai) {
          return game.hasPlayer((current) => {
            if (current.isDamaged()) {
              return !ai || get.recoverEffect(current, player, player) > 0;
            }
          });
        }
      },
      {
        prompt: "弃置一名角色区域内的两张牌",
        filter(player, ai) {
          return game.hasPlayer(function(current) {
            return current.countDiscardableCards(player, "hej", function(card) {
              if (!ai) {
                return true;
              }
              return get.buttonValue({
                link: card
              }) * get.attitude(player, current) > 0;
            }) >= (ai ? 1 : Math.min(2, current.countDiscardableCards(player, "hej")));
          });
        }
      },
      {
        prompt: "移动场上的一张牌",
        filter(player, ai) {
          return player.canMoveCard(ai);
        }
      }
    ],
    ai: {
      order: 10,
      result: { player: 1 },
      threaten: 3.2
    }
  },
  yukito_yaxiang: {
    forceunique: true,
    enable: "chooseToUse",
    limited: true,
    filter(event, player) {
      return event.type == "dying" && (player.name1 == "key_yukito" || player.name2 == "key_yukito");
    },
    filterTarget(card, player, target) {
      return target == _status.event.dying;
    },
    selectTarget: -1,
    skillAnimation: true,
    animationColor: "key",
    async content(event, trigger, player) {
      const target = event.targets[0];
      await player.awakenSkill(event.name);
      await player.reinitCharacter("key_yukito", "key_crow", false);
      if (target.hp < 3) {
        await target.recover(3 - target.hp);
      }
      const cards2 = target.getCards("j");
      if (cards2.length) {
        await target.discard(cards2);
      }
      await target.addSkills("misuzu_zhongyuan");
    },
    derivation: "misuzu_zhongyuan",
    ai: {
      save: true,
      order: 4,
      result: {
        target(player, target) {
          if (get.attitude(player, target) < 4) {
            return false;
          }
          if (player.countCards("h", (card) => {
            let mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
            if (mod2 != "unchanged") {
              return mod2;
            }
            let mod = game.checkMod(card, player, target, "unchanged", "cardSavable", player);
            if (mod != "unchanged") {
              return mod;
            }
            let savable = get.info(card).savable;
            if (typeof savable == "function") {
              savable = savable(card, player, target);
            }
            return savable;
          }) >= 1 - target.hp) {
            return false;
          }
          if (target == player || target == get.zhu(player)) {
            return true;
          }
          return !player.hasUnknown();
        }
      }
    }
  },
  misuzu_zhongyuan: {
    trigger: { player: "judge" },
    limited: true,
    skillAnimation: true,
    animationColor: "key",
    logTarget: "player",
    async cost(event, trigger, player) {
      const str = "你的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，是否发动【终愿】修改判定结果？";
      if (player.isUnderControl()) {
        game.swapPlayerAuto(player);
      }
      const chooseButton = (player2, str2) => {
        return new Promise((resolve) => {
          const evt = _status.event;
          player2 || evt.player;
          if (!evt._result) {
            evt._result = {};
          }
          const dialog = ui.create.dialog(str2, "forcebutton", "hidden");
          evt.dialog = dialog;
          dialog.addText("花色");
          const table = document.createElement("div");
          table.classList.add("add-setting");
          table.style.margin = "0";
          table.style.width = "100%";
          table.style.position = "relative";
          const listi = ["spade", "heart", "club", "diamond"];
          let resolved = false;
          for (const suit of listi) {
            const td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
            td.link = suit;
            table.appendChild(td);
            td.innerHTML = "<span>" + get.translation(suit) + "</span>";
            td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function() {
              if (_status.dragged || _status.justdragged) {
                return;
              }
              _status.tempNoButton = true;
              setTimeout(() => {
                _status.tempNoButton = false;
              }, 500);
              const link = this.link;
              const current = this.parentNode.querySelector(".bluebg");
              if (current) {
                current.classList.remove("bluebg");
              }
              this.classList.add("bluebg");
              evt._result.suit = link;
            });
          }
          dialog.content.appendChild(table);
          dialog.addText("点数");
          const table2 = document.createElement("div");
          table2.classList.add("add-setting");
          table2.style.margin = "0";
          table2.style.width = "100%";
          table2.style.position = "relative";
          for (let i = 1; i < 14; i++) {
            const td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
            td.link = i;
            table2.appendChild(td);
            td.innerHTML = "<span>" + get.strNumber(i) + "</span>";
            td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function() {
              if (_status.dragged || _status.justdragged) {
                return;
              }
              _status.tempNoButton = true;
              setTimeout(() => {
                _status.tempNoButton = false;
              }, 500);
              const link = this.link;
              const current = this.parentNode.querySelector(".bluebg");
              if (current) {
                current.classList.remove("bluebg");
              }
              this.classList.add("bluebg");
              evt._result.number = link;
            });
          }
          dialog.content.appendChild(table2);
          dialog.add("　　");
          evt.dialog.open();
          evt.switchToAuto = function() {
            if (resolved) {
              return;
            }
            resolved = true;
            evt.dialog.close();
            evt.control.close();
            _status.imchoosing = false;
            resolve({ bool: false });
          };
          evt.control = ui.create.control("ok", "cancel2", function(link) {
            if (resolved) {
              return;
            }
            const result = evt._result;
            if (link != "cancel2") {
              if (!result.number || !result.suit) {
                return;
              }
              result.bool = true;
            } else {
              result.bool = false;
            }
            resolved = true;
            evt.dialog.close();
            evt.control.close();
            _status.imchoosing = false;
            resolve(result);
          });
          for (const button of evt.dialog.buttons) {
            button.classList.add("selectable");
          }
        });
      };
      let map;
      if (event.isMine()) {
        map = await chooseButton(player, str);
      } else if (event.isOnline()) {
        event.player.send(chooseButton, event.player, str);
        map = await new Promise((resolve) => {
          event.player.wait();
          const origResume = game.resume.bind(game);
          let resolved = false;
          game.resume = function() {
            if (resolved) {
              return;
            }
            resolved = true;
            game.resume = origResume;
            origResume();
            resolve(event._result || { bool: false });
          };
          game.pause();
          game.countChoose();
        });
      } else {
        _status.imchoosing = false;
        map = { bool: false };
      }
      if (map.bool) {
        event.result = {
          bool: true,
          cost_data: map
        };
      }
    },
    async content(event, trigger, player) {
      let map = event.cost_data;
      player.awakenSkill(event.name);
      game.log(player, "将判定结果修改为了", "#g" + get.translation(map.suit + 2) + get.strNumber(map.number));
      trigger.fixedResult = {
        suit: map.suit,
        color: get.color({ suit: map.suit }),
        number: map.number
      };
      player.popup(get.translation(map.suit + 2) + get.strNumber(map.number), "thunder");
      event.getParent("arrangeTrigger").finish();
    }
  },
  //凤千早
  chihaya_liewu: {
    derivation: "chihaya_huairou",
    mod: {
      cardUsable(card) {
        if (card.name == "sha") {
          return Infinity;
        }
      },
      targetInRange(card) {
        if (card.name == "sha") {
          return true;
        }
      }
    },
    trigger: { player: "useCard2" },
    filter(event, player) {
      let card = event.card;
      let info = get.info(card);
      if (info.type != "trick" || info.allowMultiple == false) {
        return false;
      }
      if (event.targets && !info.multitarget) {
        if (game.hasPlayer((current) => {
          return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
        })) {
          return true;
        }
      }
      return false;
    },
    async cost(event, trigger, player) {
      let prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
      event.result = await player.chooseTarget(get.prompt(event.skill), function(card, player2, target) {
        player2 = _status.event.player;
        return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player2, target);
      }).set("prompt2", prompt2).set("ai", (target) => {
        let trigger2 = _status.event.getTrigger();
        let player2 = _status.event.player;
        return get.effect(target, trigger2.card, player2, player2);
      }).set("card", trigger.card).set("targets", trigger.targets).forResult();
    },
    autodelay: true,
    async content(event, trigger, player) {
      trigger.targets.addArray(event.targets);
      game.log(event.targets, "也成为了", trigger.card, "的目标");
    },
    group: "chihaya_liewu2"
  },
  chihaya_liewu2: {
    trigger: { player: "disableEquipAfter" },
    forced: true,
    filter(event, player) {
      return !player.hasEnabledSlot() && !player._chihaya_liewu;
    },
    skillAnimation: true,
    animationColor: "orange",
    async content(event, trigger, player) {
      player._chihaya_liewu = true;
      await player.loseMaxHp(4);
      player.addSkills("chihaya_huairou");
    }
  },
  chihaya_huairou: {
    audio: 2,
    enable: "phaseUse",
    position: "he",
    filter: (event, player) => player.hasCard((card) => lib.skill.chihaya_huairou.filterCard(card, player), lib.skill.chihaya_huairou.position),
    filterCard: (card, player) => get.type(card) == "equip" && player.canRecast(card),
    check(card) {
      if (get.position(card) == "e") {
        return 0.5 - get.value(card, get.player());
      }
      if (!get.player().hasEquipableSlot(get.subtype(card))) {
        return 5;
      }
      return 3 - get.value(card);
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      await player.recast(cards2);
    },
    discard: false,
    lose: false,
    delay: false,
    prompt: "将一张装备牌置入弃牌堆并摸一张牌",
    ai: {
      order: 10,
      result: {
        player: 1
      }
    }
  },
  chihaya_youfeng: {
    enable: "chooseToUse",
    zhuanhuanji: true,
    mark: true,
    intro: {
      content(storage, player) {
        return storage ? "每轮限一次，你可以废除你的一个装备栏，视为使用一张基本牌。" : "每轮限一次，你可以加1点体力上限，视为使用一张普通锦囊牌。";
      }
    },
    marktext: "☯",
    init(player) {
      player.storage.chihaya_youfeng = false;
    },
    hiddenCard(player, name) {
      if (player.storage.chihaya_youfeng && !player.hasEnabledSlot()) {
        return false;
      }
      if (player.hasSkill("chihaya_youfeng_" + (player.storage.chihaya_youfeng || false))) {
        return false;
      }
      let type = get.type(name);
      if (player.storage.chihaya_youfeng) {
        return type == "basic";
      }
      return type == "trick";
    },
    filter(event, player) {
      if (player.storage.chihaya_youfeng && !player.hasEnabledSlot()) {
        return false;
      }
      if (player.hasSkill("chihaya_youfeng_" + (player.storage.chihaya_youfeng || false))) {
        return false;
      }
      let type = player.storage.chihaya_youfeng ? "basic" : "trick";
      for (const name of lib.inpile) {
        if (get.type(name) != type) {
          continue;
        }
        if (event.filterCard({ name, isCard: true }, player, event)) {
          return true;
        }
      }
      return false;
    },
    chooseButton: {
      dialog(event, player) {
        const dialog = ui.create.dialog("游凤", "hidden");
        const equips = [];
        if (player.storage.chihaya_youfeng) {
          for (let i = 1; i < 6; i++) {
            if (!player.hasEnabledSlot(i)) {
              continue;
            }
            equips.push([i, get.translation("equip" + i)]);
          }
          if (equips.length > 0) {
            dialog.add([equips, "tdnodes"]);
          }
        }
        const type = player.storage.chihaya_youfeng ? "basic" : "trick";
        const list = [];
        for (const name of lib.inpile) {
          if (get.type(name) != type) {
            continue;
          }
          if (event.filterCard({ name, isCard: true }, player, event)) {
            list.push([type, "", name]);
            if (name == "sha") {
              for (let j of lib.inpile_nature) {
                list.push([type, "", name, j]);
              }
            }
          }
        }
        dialog.add([list, "vcard"]);
        return dialog;
      },
      filter(button) {
        if (ui.selected.buttons.length && typeof button.link == typeof ui.selected.buttons[0].link) {
          return false;
        }
        return true;
      },
      select() {
        if (_status.event.player.storage.chihaya_youfeng) {
          return 2;
        }
        return 1;
      },
      check(button) {
        let player = _status.event.player;
        if (typeof button.link == "number") {
          if (!player.hasEmptySlot(button.link)) {
            let card2 = player.getEquip(button.link);
            if (card2) {
              let val = get.value(card2);
              if (val > 0) {
                return 0;
              }
              return 5 - val;
            }
          }
          switch (button.link) {
            case 3:
              return 4.5;
            case 4:
              return 4.4;
            case 5:
              return 4.3;
            case 2:
              return (3 - player.hp) * 1.5;
            case 1: {
              if (game.hasPlayer((current) => {
                return (get.realAttitude || get.attitude)(player, current) < 0 && get.distance(player, current) > 1;
              })) {
                return 0;
              }
              return 3.2;
            }
          }
        }
        let name = button.link[2];
        let evt = _status.event.getParent();
        if (get.type(name) == "basic") {
          if (name == "shan") {
            return 2;
          }
          if (evt.type == "dying") {
            if (get.attitude(player, evt.dying) < 2) {
              return false;
            }
            if (name == "jiu") {
              return 2.1;
            }
            return 1.9;
          }
          if (evt.type == "phase") {
            return player.getUseValue({
              name,
              nature: button.link[3],
              isCard: true
            });
          }
          return 1;
        }
        if (!["chuqibuyi", "shuiyanqijunx", "juedou", "nanman", "wanjian", "shunshou", "zhujinqiyuan"].includes(name)) {
          return 0;
        }
        let card = { name, isCard: true };
        if (["shunshou", "zhujinqiyuan"].includes(card.name)) {
          if (!game.hasPlayer((current) => {
            return get.attitude(player, current) != 0 && get.distance(player, current) <= 1 && player.canUse(card, current) && get.effect(current, card, player, player) > 0;
          })) {
            return 0;
          }
          return player.getUseValue(card) - 7;
        }
        return player.getUseValue(card) - 4;
      },
      backup(links, player) {
        if (links.length == 1) {
          return {
            filterCard() {
              return false;
            },
            selectCard: -1,
            viewAs: {
              name: links[0][2],
              nature: links[0][3],
              isCard: true
            },
            log: false,
            popname: true,
            async precontent(event, trigger, player2) {
              player2.logSkill("chihaya_youfeng");
              player2.gainMaxHp();
              player2.addTempSkill("chihaya_youfeng_" + (player2.storage.chihaya_youfeng || false), "roundStart");
              player2.changeZhuanhuanji("chihaya_youfeng");
            }
          };
        }
        if (typeof links[1] == "number") {
          links.reverse();
        }
        let equip = links[0];
        let name = links[1][2];
        let nature = links[1][3];
        return {
          filterCard() {
            return false;
          },
          selectCard: -1,
          equip,
          viewAs: {
            name,
            nature,
            isCard: true
          },
          popname: true,
          log: false,
          async precontent(event, trigger, player2) {
            player2.logSkill("chihaya_youfeng");
            player2.disableEquip(lib.skill.chihaya_youfeng_backup.equip);
            player2.addTempSkill("chihaya_youfeng_" + (player2.storage.chihaya_youfeng || false), "roundStart");
            player2.changeZhuanhuanji("chihaya_youfeng");
          }
        };
      },
      prompt(links, player) {
        if (links.length == 1) {
          return "增加1点体力上限，视为使用" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
        }
        if (typeof links[1] == "number") {
          links.reverse();
        }
        let equip = "equip" + links[0];
        let name = links[1][2];
        let nature = links[1][3];
        return "废除自己的" + get.translation(equip) + "栏，视为使用" + (get.translation(nature) || "") + get.translation(name);
      }
    },
    ai: {
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        if (arg == "respond") {
          return false;
        }
        if (!player.storage.chihaya_youfeng || player.hasSkill("chihaya_youfeng_true")) {
          return false;
        }
      },
      order: 1,
      result: {
        player: 1
      }
    },
    subSkill: {
      true: { charlotte: true },
      false: { charlotte: true }
    }
  },
  //七濑留美
  rumi_shuwu: {
    mod: {
      cardUsable(card) {
        if (card.name == "sha") {
          return Infinity;
        }
      },
      targetInRange(card) {
        if (card.name == "sha") {
          return true;
        }
      }
    },
    trigger: { player: "useCard2" },
    filter(event, player) {
      let card = event.card;
      let info = get.info(card);
      if (info.type != "trick" || info.allowMultiple == false) {
        return false;
      }
      if (event.targets && !info.multitarget) {
        if (game.hasPlayer((current) => {
          return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
        })) {
          return true;
        }
      }
      return false;
    },
    autodelay: true,
    async cost(event, trigger, player) {
      let prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
      const result = await player.chooseTarget(get.prompt(event.skill), function(card, player2, target) {
        player2 = _status.event.player;
        return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player2, target);
      }).set("prompt2", prompt2).set("ai", (target) => {
        let trigger2 = _status.event.getTrigger();
        let player2 = _status.event.player;
        return get.effect(target, trigger2.card, player2, player2);
      }).set("card", trigger.card).set("targets", trigger.targets).forResult();
      event.result = result;
    },
    async content(event, trigger, player) {
      trigger.targets.addArray(event.targets);
      game.log(event.targets, "也成为了", trigger.card, "的目标");
    },
    group: "rumi_shuwu2"
  },
  rumi_shuwu2: {
    trigger: { player: "phaseUseEnd" },
    forced: true,
    filter(event, player) {
      if (player.hp <= 3) {
        return true;
      }
      if (player.getHistory("useCard", function(evt) {
        return evt.card.name == "sha" && evt.addCount !== false && evt.getParent("phaseUse") == event;
      }).length <= 1) {
        return true;
      }
      if (player.getHistory("sourceDamage", function(evt) {
        return get.type(evt.card, null, false) == "trick" && evt.getParent("phaseUse") == event;
      }).length == 0) {
        return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      let num = 0;
      if (player.hp <= 3) {
        num++;
      }
      if (player.getHistory("useCard", function(evt) {
        return evt.card.name == "sha" && evt.addCount !== false && evt.getParent("phaseUse") == trigger;
      }).length <= 1) {
        num++;
      }
      if (player.getHistory("sourceDamage", function(evt) {
        return get.type(evt.card, null, false) == "trick" && evt.getParent("phaseUse") == trigger;
      }).length == 0) {
        num++;
      }
      await player.draw(num);
      player.addTempSkill("rumi_shuwu3");
      player.addMark("rumi_shuwu3", num, false);
    }
  },
  rumi_shuwu3: {
    mod: {
      maxHandcard(player, num) {
        return num + player.countMark("rumi_shuwu3");
      }
    },
    onremove: true
  },
  //凤咲夜
  sakuya_junbu: {
    mod: {
      targetInRange(card, player) {
        if (player.countDisabledSlot() >= 1) {
          return true;
        }
      },
      cardUsable(card, player) {
        if (player.countDisabledSlot() >= 2) {
          return Infinity;
        }
      }
    },
    trigger: { player: "useCard2" },
    filter(event, player) {
      if (player.countDisabledSlot() >= 4) {
        return true;
      }
      return lib.skill.sakuya_junbu.filter2.apply(this, arguments);
    },
    filter2(event, player) {
      if (player.countDisabledSlot() < 3) {
        return false;
      }
      let card = event.card;
      let info = get.info(card);
      if (info.allowMultiple == false) {
        return false;
      }
      if (event.targets && !info.multitarget) {
        if (game.hasPlayer((current) => {
          return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
        })) {
          return true;
        }
      }
      return false;
    },
    async cost(event, trigger, player) {
      const result = { bool: false };
      event.result = result;
      if (player.countDisabledSlot() >= 4) {
        result.bool = true;
        if (!lib.skill.sakuya_junbu.filter2(trigger, player)) {
          return;
        }
      }
      let prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
      const result2 = await player.chooseTarget(get.prompt(event.skill), function(card, player2, target) {
        player2 = _status.event.player;
        return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player2, target);
      }).set("prompt2", prompt2).set("ai", (target) => {
        let trigger2 = _status.event.getTrigger();
        let player2 = _status.event.player;
        return get.effect(target, trigger2.card, player2, player2);
      }).set("card", trigger.card).set("targets", trigger.targets).forResult();
      if (result2.bool) {
        result.bool = true;
        result.targets = result2.targets;
      }
    },
    async content(event, trigger, player) {
      if (player.countDisabledSlot() >= 4) {
        trigger.directHit.addArray(game.players);
        game.log(trigger.card, "不可被响应");
      }
      if (event.targets && event.targets.length > 0) {
        trigger.targets.addArray(event.targets);
        game.log(event.targets, "也成为了", trigger.card, "的目标");
      }
    },
    group: "sakuya_junbu_damage",
    subSkill: {
      damage: {
        trigger: { source: "damageBegin1" },
        forced: true,
        sub: true,
        filter(event, player) {
          return !player.hasEnabledSlot() && event.getParent().type == "card";
        },
        logTarget: "player",
        async content(event, trigger, player) {
          player.loseHp();
          trigger.num++;
        }
      }
    },
    ai: {
      combo: "youlong"
    }
  },
  //铃木央人
  hiroto_huyu: {
    trigger: { global: "phaseUseEnd" },
    noHidden: true,
    filter(event, player) {
      return player != event.player && player.hasSkill("hiroto_huyu") && !player.hasSkill("hiroto_zonglve") && event.player.countCards("h") > 0;
    },
    async cost(event, trigger, player) {
      event.result = await trigger.player.chooseCard(2, "h", "是否对" + get.translation(player) + "发动【虎驭】？", "将两张手牌交给该角色，然后令其获得〖纵略〗并于下回合获得该角色得到的所有牌").set(
        "goon",
        (function() {
          let source = trigger.player;
          if (get.attitude(source, player) > 0) {
            return 7;
          }
          if (source.hp > 2) {
            return 4;
          }
          return 0;
        })()
      ).set("ai", (card) => {
        return _status.event.goon - get.value(card);
      }).forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      const target = trigger.player;
      await target.give(cards2, player);
      player.storage.hiroto_huyu2 = target;
      player.addSkills("hiroto_zonglve");
      player.addSkill("hiroto_huyu2");
    },
    derivation: "hiroto_zonglve"
  },
  hiroto_huyu2: {
    trigger: { player: "phaseEnd" },
    forced: true,
    popup: false,
    charlotte: true,
    async content(event, trigger, player) {
      player.removeSkill("hiroto_huyu2");
      await player.removeSkills("hiroto_zonglve");
      player.removeGaintag("hiroto_huyu2");
      let target = player.storage.hiroto_huyu2;
      if (target && target.isIn()) {
        let cards2 = [];
        player.getHistory("gain", function(evt) {
          cards2.addArray(evt.cards);
        });
        let he = player.getCards("he");
        cards2 = cards2.filter((card) => {
          return he.includes(card);
        });
        if (cards2.length) {
          target.gain(cards2, player, "giveAuto", "bySelf");
        }
      }
    },
    mark: "character",
    intro: { content: "已成为$的工具人" },
    group: "hiroto_huyu_gain"
  },
  hiroto_huyu_gain: {
    trigger: { player: "gainBegin" },
    silent: true,
    filter(event, player) {
      if (player == _status.currentPhase) {
        event.gaintag.add("hiroto_huyu2");
      }
      return false;
    }
  },
  hiroto_zonglve: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h") > 0 && game.hasPlayer((current) => {
        return current != player && current.countCards("h") > 0;
      });
    },
    filterTarget(card, player, target) {
      return target != player && target.countCards("h") > 0;
    },
    filterCard: true,
    delay: false,
    charlotte: true,
    position: "h",
    discard: false,
    lose: false,
    async content(event, trigger, player) {
      const { target, cards: cards2 } = event;
      const chooseResult = await player.choosePlayerCard(true, target, "h").forResult();
      const targetCard = chooseResult.cards[0];
      player.$compare(cards2[0], target, targetCard);
      game.log(player, "展示了", cards2[0]);
      game.log(target, "展示了", targetCard);
      await game.delay(3.5);
      game.broadcastAll(ui.clear);
      if (get.color(cards2[0], player) == get.color(targetCard, target)) {
        await target.damage("nocard");
        await target.discard(targetCard).set("animate", false);
      } else {
        await player.gainPlayerCard(target, true, 2, "hej");
      }
    },
    mod: {
      maxHandcard(player, num) {
        return num + 3;
      }
    },
    ai: {
      order: 7,
      result: {
        target: -1
      }
    }
  },
  hiroto_tuolao: {
    trigger: { player: "phaseAfter" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "water",
    filter(event, player) {
      return player.phaseNumber > 1 && !player.getHistory("lose", function(evt) {
        return evt.getParent(2).name == "hiroto_huyu2";
      }).length;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.draw(3);
      await player.changeSkills(["hiroto_zonglve"], ["hiroto_huyu"]);
    }
  },
  //水织静久
  shizuku_sizhi: {
    audio: 2,
    enable: "phaseUse",
    getResult(cards2) {
      let l = cards2.length;
      let all = Math.pow(l, 2);
      let list = [];
      for (let i = 1; i < all; i++) {
        let array = [];
        for (let j = 0; j < l; j++) {
          if (Math.floor(i % Math.pow(2, j + 1) / Math.pow(2, j)) > 0) {
            array.push(cards2[j]);
          }
        }
        let num = 0;
        for (const k of array) {
          num += get.number(k);
        }
        if (num == 13) {
          list.push(array);
        }
      }
      if (list.length) {
        list.sort((a, b) => {
          if (a.length != b.length) {
            return b.length - a.length;
          }
          return get.value(a) - get.value(b);
        });
        return list[0];
      }
      return list;
    },
    usable: 1,
    filterCard(card) {
      let num = 0;
      for (let i = 0; i < ui.selected.cards.length; i++) {
        num += get.number(ui.selected.cards[i]);
      }
      return get.number(card) + num <= 13;
    },
    complexCard: true,
    selectCard() {
      let num = 0;
      for (let i = 0; i < ui.selected.cards.length; i++) {
        num += get.number(ui.selected.cards[i]);
      }
      if (num == 13) {
        return ui.selected.cards.length;
      }
      return ui.selected.cards.length + 2;
    },
    check(card) {
      let evt = _status.event;
      if (!evt.shizuku_sizhi_choice) {
        evt.shizuku_sizhi_choice = lib.skill.shizuku_sizhi.getResult(evt.player.getCards("he"));
      }
      if (!evt.shizuku_sizhi_choice.includes(card)) {
        return 0;
      }
      return 1;
    },
    position: "he",
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      const next = player.draw(cards2.length * 2);
      next.gaintag = ["shizuku_sizhi2"];
      await next;
      player.addTempSkill("shizuku_sizhi2");
    },
    ai: {
      order: 5,
      result: { player: 1 }
    }
  },
  shizuku_sizhi2: {
    onremove(player) {
      player.removeGaintag("shizuku_sizhi2");
    },
    mod: {
      targetInRange(card) {
        if (!card.cards || !card.cards.length) {
          return;
        }
        for (const i of card.cards) {
          if (!i.hasGaintag("shizuku_sizhi2") || get.color(i) != "black") {
            return;
          }
        }
        return true;
      },
      cardUsable(card) {
        if (!card.cards || !card.cards.length) {
          return;
        }
        for (const i of card.cards) {
          if (!i.hasGaintag("shizuku_sizhi2") || get.color(i) != "black") {
            return;
          }
        }
        return Infinity;
      },
      ignoredHandcard(card, player) {
        if (card.hasGaintag("shizuku_sizhi2") && get.color(card) == "red") {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name == "phaseDiscard" && card.hasGaintag("shizuku_sizhi2") && get.color(card) == "red") {
          return false;
        }
      },
      aiOrder(player, card, num) {
        if (get.itemtype(card) == "card" && card.hasGaintag("shizuku_sizhi2") && get.color(card) == "black") {
          return num - 0.1;
        }
      }
    }
  },
  shizuku_biyi: {
    trigger: { player: "damageEnd" },
    frequent: true,
    async content(event, trigger, player) {
      const judgeResult = await player.judge().forResult();
      const num = judgeResult.number;
      const cardResult = (() => {
        const cards2 = player.getCards("he");
        const l = cards2.length;
        const all = Math.pow(l, 2);
        const list = [];
        for (let i = 1; i < all; i++) {
          const array = [];
          for (let j = 0; j < l; j++) {
            if (Math.floor(i % Math.pow(2, j + 1) / Math.pow(2, j)) > 0) {
              array.push(cards2[j]);
            }
          }
          let numx = 0;
          for (const k of array) {
            numx += get.number(k);
          }
          if (numx == num) {
            list.push(array);
          }
        }
        if (list.length) {
          list.sort((a, b) => get.value(a) - get.value(b));
          return list[0];
        }
        return list;
      })();
      const result = await player.chooseToDiscard(
        "是否弃置任意张点数之和为" + get.cnNumber(num) + "的牌并回复1点体力？",
        (card) => {
          let sum = 0;
          for (const selected of ui.selected.cards) {
            sum += get.number(selected);
          }
          return get.number(card) + sum <= _status.event.num;
        },
        "he"
      ).set("num", num).set("complexCard", true).set("selectCard", () => {
        let sum = 0;
        for (const selected of ui.selected.cards) {
          sum += get.number(selected);
        }
        if (sum == _status.event.num) {
          return ui.selected.cards.length;
        }
        return ui.selected.cards.length + 2;
      }).set("cardResult", cardResult).set("ai", (card) => {
        if (!_status.event.cardResult.includes(card)) {
          return 0;
        }
        return 6 - get.value(card);
      }).forResult();
      if (result.bool) {
        await player.recover();
      }
    }
  },
  shizuku_sanhua: {
    trigger: { player: "die" },
    forceDie: true,
    skillAnimation: true,
    animationColor: "thunder",
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), lib.filter.notMe).set("ai", (target) => {
        return get.attitude(_status.event.player, target);
      }).forResult();
    },
    async content(event, trigger, player) {
      let target = event.targets[0];
      let names = [];
      let cards2 = [];
      while (cards2.length < 4) {
        let card = get.cardPile2((card2) => {
          return !cards2.includes(card2) && !names.includes(card2.name) && get.type(card2) == "basic";
        });
        if (card) {
          cards2.push(card);
          names.push(card.name);
        } else {
          break;
        }
      }
      if (cards2.length) {
        await target.gain({ cards: cards2, animate: "gain2" });
      }
    }
  },
  //鸣濑白羽
  shiroha_yuzhao: {
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    charlotte: true,
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      const next = player.addToExpansion(get.cards(game.countGroup()), "draw");
      next.gaintag.add("shiroha_yuzhao");
      await next;
    },
    marktext: "兆",
    intro: {
      markcount: "expansion",
      mark(dialog, content, player) {
        content = player.getExpansions("shiroha_yuzhao");
        if (content && content.length) {
          if (player == game.me || player.isUnderControl()) {
            dialog.addAuto(content);
          } else {
            return "共有" + get.cnNumber(content.length) + "张牌";
          }
        }
      },
      content(content, player) {
        content = player.getExpansions("shiroha_yuzhao");
        if (content && content.length) {
          if (player == game.me || player.isUnderControl()) {
            return get.translation(content);
          }
          return "共有" + get.cnNumber(content.length) + "张牌";
        }
      }
    },
    group: "shiroha_yuzhao_umi"
  },
  shiroha_yuzhao_umi: {
    trigger: { global: "phaseBegin" },
    forced: true,
    filter(event, player) {
      return player.getExpansions("shiroha_yuzhao").length > 0 && get.distance(event.player, player) <= 1;
    },
    async content(event, trigger, player) {
      const num = game.countGroup();
      const next = player.addToExpansion(get.cards(num));
      next.gaintag.add("shiroha_yuzhao");
      await next;
      const moveResult = await player.chooseToMove().set("prompt", "预兆：将" + get.cnNumber(num) + "张牌置于牌堆顶").set("num", num).set("forced", true).set("filterOk", (moved) => moved[1].length == _status.event.num).set("filterMove", (from, to, moved) => {
        if (to != 1) {
          return true;
        }
        return moved[1].length < _status.event.num;
      }).set("list", [[get.translation(player) + "（你）的“兆”", player.getExpansions("shiroha_yuzhao")], ["牌堆顶"]]).set("processAI", (list) => {
        const cards2 = list[0][1], cards22 = cards2.randomRemove(_status.event.num);
        return [cards2, cards22];
      }).forResult();
      if (moveResult && moveResult.bool) {
        const cards2 = moveResult.moved[1];
        player.lose(cards2, ui.cardPile, "insert");
      }
      game.updateRoundNumber();
    }
  },
  shiroha_guying: {
    derivation: "shiroha_guying_rewrite",
    trigger: {
      player: "damageBegin3",
      source: "damageBegin1"
    },
    filter(event, player, name) {
      if (!player.storage.shiroha_jiezhao && player.hasSkill("shiroha_guying_temp")) {
        return false;
      }
      if (name == "damageBegin3") {
        return true;
      }
      return player != event.player;
    },
    locked(skill, player) {
      if (!player || !player.storage.shiroha_jiezhao) {
        return true;
      }
      return false;
    },
    async cost(event, trigger, player) {
      const num = event.triggername == "damageBegin3" ? -1 : 1;
      if (player.storage.shiroha_jiezhao || !player.hasSkill("shiroha_guying")) {
        const promptText = num > 0 ? get.prompt("shiroha_guying", trigger.player) : get.prompt("shiroha_guying");
        const prompt2 = num > 0 ? "进行判定。若判定结果为黑色，则即将对其造成的伤害+1" : "进行判定。若判定结果为红色，则即将受到的伤害-1";
        event.result = await player.chooseBool(promptText, prompt2).forResult();
      } else {
        event.result = { bool: true };
      }
    },
    async content(event, trigger, player) {
      const num = event.triggername == "damageBegin3" ? -1 : 1;
      player.addTempSkill("shiroha_guying_temp");
      const result = await player.judge((card) => get.color(card) == (num > 0 ? "black" : "red") ? 2 : 0).set("judge2", (result2) => result2.bool ? true : false).forResult();
      if (result.bool) {
        trigger.num += num;
      }
    }
  },
  shiroha_guying_temp: { charlotte: true },
  shiroha_jiezhao: {
    trigger: { global: "judge" },
    filter(event, player) {
      return player.getExpansions("shiroha_yuzhao").length && event.player.isIn();
    },
    async cost(event, trigger, player) {
      const list = player.getExpansions("shiroha_yuzhao");
      const result = await player.chooseButton([get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt(event.skill), list, "hidden"], function(button) {
        let card = button.link;
        let trigger2 = _status.event.getTrigger();
        let player2 = _status.event.player;
        let judging = _status.event.judging;
        let result2 = trigger2.judge(card) - trigger2.judge(judging);
        let attitude = get.attitude(player2, trigger2.player);
        return result2 * attitude;
      }).set("judging", trigger.player.judging[0]).set("filterButton", (button) => {
        let player2 = _status.event.player;
        let card = button.link;
        let mod2 = game.checkMod(card, player2, "unchanged", "cardEnabled2", player2);
        if (mod2 != "unchanged") {
          return mod2;
        }
        let mod = game.checkMod(card, player2, "unchanged", "cardRespondable", player2);
        if (mod != "unchanged") {
          return mod;
        }
        return true;
      }).forResult();
      if (result.bool) {
        event.result = { bool: true, cards: result.links };
      }
    },
    //logSkill留给respond
    popup: false,
    async content(event, trigger, player) {
      const cards2 = event.cards;
      await player.respond(cards2, "shiroha_jiezhao", "highlight", "noOrdering");
      if (trigger.player.judging[0].clone) {
        trigger.player.judging[0].clone.classList.remove("thrownhighlight");
        game.broadcast(function(card) {
          if (card.clone) {
            card.clone.classList.remove("thrownhighlight");
          }
        }, trigger.player.judging[0]);
        game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
      }
      const oldJudgeCard = trigger.player.judging[0];
      trigger.player.judging[0] = cards2[0];
      trigger.orderingCards.addArray(cards2);
      game.log(trigger.player, "的判定牌改为", cards2[0]);
      await game.cardsDiscard(oldJudgeCard);
      await game.delay(2);
      if (!player.getExpansions("shiroha_yuzhao").length) {
        player.storage.shiroha_jiezhao = true;
        player.gainMaxHp();
        player.recover();
        let list = ["umi_chaofan", "ao_xishi", "tsumugi_mugyu", "kamome_jieban"];
        let skill = list.randomGet();
        player.flashAvatar("shiroha_jiezhao", "key_" + skill.split("_")[0]);
        await player.addSkills(skill);
      }
    },
    ai: {
      rejudge: true,
      tag: {
        rejudge: 0.6
      },
      combo: "shiroha_yuzhao"
    },
    derivation: ["umi_chaofan", "ao_xishi", "tsumugi_mugyu", "kamome_jieban"]
  },
  //高城丈士朗
  jojiro_shensu: {
    group: ["jojiro_shensu1", "jojiro_shensu2", "jojiro_shensu4"],
    charlotte: true
  },
  jojiro_shensu1: {
    trigger: { player: "phaseJudgeBefore" },
    async cost(event, trigger, player) {
      const check = player.countCards("h") > 2;
      event.result = await player.chooseTarget(get.prompt("jojiro_shensu"), "跳过判定阶段和摸牌阶段，视为对一名其他角色使用一张【杀】", function(card, player2, target) {
        if (player2 == target) {
          return false;
        }
        return player2.canUse({ name: "sha" }, target, false);
      }).set("check", check).set("ai", (target) => {
        if (!_status.event.check) {
          return 0;
        }
        return get.effect(target, { name: "sha" }, _status.event.player);
      }).forResult();
    },
    async content(event, trigger, player) {
      trigger.cancel();
      player.skip("phaseDraw");
      await player.useCard({ name: "sha", isCard: true }, event.targets[0], false);
    }
  },
  jojiro_shensu2: {
    trigger: { player: "phaseUseBefore" },
    filter(event, player) {
      return player.countCards("he", { type: "equip" }) > 0;
    },
    async cost(event, trigger, player) {
      const check = player.needsToDiscard();
      event.result = await player.chooseCardTarget({
        prompt: get.prompt("jojiro_shensu"),
        prompt2: "弃置一张装备牌并跳过出牌阶段，视为对一名其他角色使用一张【杀】",
        filterCard(card, player2) {
          return get.type(card) == "equip" && lib.filter.cardDiscardable(card, player2);
        },
        position: "he",
        filterTarget(card, player2, target) {
          if (player2 == target) {
            return false;
          }
          return player2.canUse({ name: "sha" }, target, false);
        },
        ai1(card) {
          if (_status.event.check) {
            return 0;
          }
          return 6 - get.value(card);
        },
        ai2(target) {
          if (_status.event.check) {
            return 0;
          }
          return get.effect(target, { name: "sha" }, _status.event.player);
        },
        check
      }).forResult();
    },
    async content(event, trigger, player) {
      trigger.cancel();
      await player.discard(event.cards[0]);
      await player.useCard({ name: "sha", isCard: true }, event.targets[0]);
    }
  },
  jojiro_shensu4: {
    trigger: { player: "phaseDiscardBefore" },
    async cost(event, trigger, player) {
      let check = player.needsToDiscard() || player.isTurnedOver() || player.hasSkill("shebian") && player.canMoveCard(true, true);
      event.result = await player.chooseTarget(get.prompt("jojiro_shensu"), "跳过弃牌阶段并将武将牌翻面，视为对一名其他角色使用一张【杀】", function(card, player2, target) {
        if (player2 == target) {
          return false;
        }
        return player2.canUse({ name: "sha" }, target, false);
      }).set("check", check).set("ai", (target) => {
        if (!_status.event.check) {
          return 0;
        }
        return get.effect(target, { name: "sha" }, _status.event.player, _status.event.player);
      }).forResult();
    },
    async content(event, trigger, player) {
      trigger.cancel();
      await player.turnOver();
      await player.useCard({ name: "sha", isCard: true }, event.targets[0], false);
    }
  },
  jojiro_shunying: {
    trigger: { player: "phaseEnd" },
    forced: true,
    charlotte: true,
    filter(event, player) {
      return player.getHistory("skipped").length > 0;
    },
    async content(event, trigger, player) {
      const num = player.getHistory("skipped").length;
      const result = await player.chooseToMoveChess(num, "瞬影：移动至多" + get.cnNumber(num) + "格或失去1点体力").forResult();
      if (!result.bool) {
        await player.loseHp();
      } else {
        await player.draw(num);
      }
    }
  },
  //神户小鸟
  kotori_yumo: {
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    charlotte: true,
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    derivation: ["kotori_skill_wei", "kotori_skill_shu", "kotori_skill_wu", "kotori_skill_qun", "kotori_skill_jin", "kotori_skill_key"],
    async content(event, trigger, player) {
      const list = ["wei", "shu", "wu", "qun", "jin"];
      for (const i of list) {
        if (!player.hasMark("kotori_yumo_" + i)) {
          player.addMark("kotori_yumo_" + i, 1, false);
          game.log(player, "获得了一个", lib.translate["kotori_yumo_" + i].replace(/魔物/g, "【魔物】"));
        }
      }
    },
    group: ["kotori_yumo_damage", "kotori_yumo_gain"]
  },
  kotori_yumo_damage: {
    trigger: { global: "damageEnd" },
    forced: true,
    filter(event, player) {
      let name = "kotori_yumo_" + event.player.group;
      return lib.skill[name] && !player.hasMark(name);
    },
    popup: false,
    async content(event, trigger, player) {
      game.log(player, "对", trigger.player, "发动了", "#g【驭魔】");
      const group = trigger.player.group;
      player.popup("驭魔", get.groupnature(group));
      player.addMark("kotori_yumo_" + group, 1, false);
      game.log(player, "获得了一个", lib.translate["kotori_yumo_" + group].replace(/魔物/g, "【魔物】"));
    }
  },
  kotori_yumo_gain: {
    trigger: { player: "phaseBegin" },
    filter(event, player) {
      let list = ["wei", "shu", "wu", "qun", "key", "jin"];
      for (const i in list) {
        if (player.hasMark("kotori_yumo_" + list[i])) {
          return true;
        }
      }
      return false;
    },
    async cost(event, trigger, player) {
      const list = ["wei", "shu", "wu", "qun", "key", "jin"];
      const list2 = [];
      for (const i of list) {
        if (player.hasMark("kotori_yumo_" + i)) {
          list2.push("kotori_skill_" + i);
        }
      }
      list2.push("cancel2");
      const { control } = await player.chooseControl(list2).set("prompt", "###是否发动【驭魔】？###弃置对应的标记并获得下列技能中的一个，或点取消，不获得技能").set(
        "choice",
        (function() {
          if (list2.includes("kotori_skill_shu") && player.countCards("h", (card) => {
            return get.name(card, player) == "sha" && player.getUseValue(card) > 0;
          }) > 1) {
            return "kotori_skill_shu";
          }
          if (list2.includes("kotori_skill_key") && player.hp > 1) {
            return "kotori_skill_key";
          }
          if (list2.includes("kotori_skill_qun") && player.isDamaged() && player.needsToDiscard() > 1) {
            return "kotori_skill_qun";
          }
          return "cancel2";
        })()
      ).set("ai", () => {
        return _status.event.choice;
      }).forResult();
      event.result = {
        bool: control !== "cancel2",
        cost_data: { control }
      };
    },
    async content(event, trigger, player) {
      const result = event.cost_data;
      if (result.control != "cancel2") {
        const name = "kotori_yumo_" + result.control.slice(13);
        player.removeMark(name, 1, false);
        game.log(player, "移去了一个", lib.translate[name].replace(/魔物/g, "【魔物】"));
        await player.addTempSkills(result.control);
        game.log(player, "获得了技能", lib.translate[name].replace(/魔物/g, "【" + get.translation(result.control) + "】"));
      }
    }
  },
  kotori_skill_wei: {
    trigger: { player: "phaseBegin" },
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        prompt: get.prompt2(event.skill),
        filterCard: lib.filter.cardDiscardable,
        filterTarget(card, player2, target) {
          return player2 != target;
        },
        position: "he",
        ai1(card) {
          return 6 - get.value(card);
        },
        ai2(target) {
          return 1 / (1 + target.countCards("he")) * -get.attitude(_status.event.player, target);
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      const target = event.targets[0];
      await player.discard(cards2);
      const result = await target.chooseToDiscard("弃置一张牌，或令" + get.translation(player) + "摸一张牌", "he").set("ai", lib.skill.zhiheng.check).forResult();
      if (!result.bool) {
        await player.draw();
      }
    }
  },
  kotori_skill_shu: {
    mod: {
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return num + 1;
        }
      }
    },
    trigger: { player: "phaseUseEnd" },
    forced: true,
    filter(event, player) {
      return player.getHistory("useCard", function(evt) {
        return evt.card && evt.card.name == "sha" && evt.getParent("phaseUse") == event;
      }).length > 1;
    },
    async content(event, trigger, player) {
      await player.draw();
    }
  },
  kotori_skill_wu: {
    trigger: { player: "phaseEnd" },
    forced: true,
    filter(event, player) {
      return player.countCards("h") != player.hp;
    },
    async content(event, trigger, player) {
      await player.draw();
    }
  },
  kotori_skill_qun: {
    trigger: { player: "phaseDiscardBegin" },
    forced: true,
    filter(event, player) {
      return player.getDamagedHp() > 1 || player.countCards("h") - player.getHp() > 1;
    },
    async content(event, trigger, player) {
      let num = 0;
      if (player.getDamagedHp() > 1) {
        num++;
      }
      if (player.countCards("h") - player.getHp() > 1) {
        num++;
      }
      player.addMark("kotori_qunxin_temp", num, false);
      player.addTempSkill("kotori_qunxin_temp", "phaseDiscardEnd");
    }
  },
  kotori_skill_key: {
    enable: "phaseUse",
    usable: 1,
    async content(event, trigger, player) {
      await player.draw();
      player.changeHujia(1);
      const evt = event.getParent("phase");
      if (evt && evt.after) {
        const next = player.loseHp();
        event.next.remove(next);
        evt.after.push(next);
      }
    },
    ai: {
      order: 10,
      result: {
        player(player) {
          return player.hp - 1;
        }
      }
    }
  },
  kotori_skill_jin: {
    trigger: { player: "phaseDrawEnd" },
    filter(event, player) {
      let hs = player.getCards("h");
      return hs.length > 0 && player.getHistory("gain", function(evt) {
        if (evt.getParent().name != "draw" || evt.getParent("phaseDraw") != event) {
          return false;
        }
        for (const i of evt.cards) {
          if (hs.includes(i)) {
            return true;
          }
        }
        return false;
      }).length > 0;
    },
    check(event, player) {
      let hs = player.getCards("h"), cards2 = [], suits = [];
      player.getHistory("gain", function(evt) {
        if (evt.getParent().name != "draw" || evt.getParent("phaseDraw") != event) {
          return false;
        }
        for (const i of evt.cards) {
          if (hs.includes(i)) {
            cards2.add(i);
            suits.add(get.suit(i, player));
          }
        }
      });
      return cards2.length == suits.length;
    },
    async content(event, trigger, player) {
      const hs = player.getCards("h");
      const cards2 = [];
      const suits = [];
      player.getHistory("gain", (evt) => {
        if (evt.getParent().name != "draw" || evt.getParent("phaseDraw") != trigger) {
          return false;
        }
        for (const i of evt.cards) {
          if (hs.includes(i)) {
            cards2.add(i);
            suits.add(get.suit(i, player));
          }
        }
      });
      player.showCards(cards2, get.translation(player) + "发动了【晋势】");
      if (cards2.length == suits.length) {
        await player.draw();
      }
    }
  },
  kotori_qunxin_temp: {
    onremove: true,
    mod: {
      maxHandcard(player, num) {
        return num + player.countMark("kotori_qunxin_temp");
      }
    }
  },
  kotori_yumo_wei: {
    marktext: '<span class="thundertext">魔</span>',
    intro: {
      name: '<span class="thundertext">魔物</span>',
      content: "mark"
    }
  },
  kotori_yumo_shu: {
    marktext: '<span class="firetext">魔</span>',
    intro: {
      name: '<span class="firetext">魔物</span>',
      content: "mark"
    }
  },
  kotori_yumo_wu: {
    marktext: '<span class="greentext">魔</span>',
    intro: {
      name: '<span class="greentext">魔物</span>',
      content: "mark"
    }
  },
  kotori_yumo_qun: {
    marktext: '<span class="yellowtext">魔</span>',
    intro: {
      name: '<span class="yellowtext">魔物</span>',
      content: "mark"
    }
  },
  kotori_yumo_key: {
    marktext: '<span class="legendtext">魔</span>',
    intro: {
      name: '<span class="legendtext">魔物</span>',
      content: "mark"
    }
  },
  kotori_yumo_jin: {
    marktext: '<span class="icetext">魔</span>',
    intro: {
      name: '<span class="icetext">魔物</span>',
      content: "mark"
    }
  },
  kotori_huazhan: {
    charlotte: true,
    enable: "chooseToUse",
    filter(event, player) {
      let bool = false;
      let list = ["wei", "shu", "wu", "qun", "key", "jin"];
      for (const i of list) {
        if (player.hasMark("kotori_yumo_" + i) && !player.getStorage("kotori_huazhan2").includes("kotori_yumo_" + i)) {
          bool = true;
          break;
        }
      }
      return bool && event.filterCard({ name: "kaihua", isCard: true }, player, event);
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("###花绽###" + lib.translate.kotori_huazhan_info);
      },
      chooseControl(event, player) {
        let list = ["wei", "shu", "wu", "qun", "key", "jin"];
        let list2 = [];
        for (const i of list) {
          if (player.hasMark("kotori_yumo_" + i) && !player.getStorage("kotori_huazhan2").includes("kotori_yumo_" + i)) {
            list2.push("kotori_yumo_" + i);
          }
        }
        list2.push("cancel2");
        return list2;
      },
      check() {
        let player = _status.event.player;
        let list = ["wei", "shu", "wu", "qun", "key", "jin"];
        let list2 = [];
        for (const i of list) {
          if (player.hasMark("kotori_yumo_" + i) && !player.getStorage("kotori_huazhan2").includes("kotori_yumo_" + i)) {
            list2.push("kotori_yumo_" + i);
          }
        }
        if (list2.includes("kotori_yumo_wei")) {
          return "kotori_yumo_wei";
        }
        if (list2.includes("kotori_yumo_wu")) {
          return "kotori_yumo_wu";
        }
        if (list2.includes("kotori_yumo_qun")) {
          return "kotori_yumo_qun";
        }
        if (list2.includes("kotori_yumo_key")) {
          return "kotori_yumo_key";
        }
        if (list2.includes("kotori_yumo_shu") && game.hasPlayer((current) => {
          return current.group == "shu";
        })) {
          return "kotori_yumo_shu";
        }
        return "cancel2";
      },
      backup(result, player) {
        return {
          markname: result.control,
          viewAs: { name: "kaihua", isCard: true },
          filterCard() {
            return false;
          },
          selectCard: -1,
          log: false,
          async precontent(event, trigger, player2) {
            const name = lib.skill.kotori_huazhan_backup.markname;
            if (!player2.storage.kotori_huazhan2) {
              player2.storage.kotori_huazhan2 = [];
            }
            player2.storage.kotori_huazhan2.push(name);
            player2.addTempSkill("kotori_huazhan2");
            player2.popup("花绽", get.groupnature(name.slice(12)));
            game.log(player2, "发动了技能", lib.translate[name].replace(/魔物/g, "【花绽】"));
            player2.removeMark(name, 1, false);
            game.log(player2, "移去了一个", lib.translate[name].replace(/魔物/g, "【魔物】"));
          }
        };
      }
    },
    ai: {
      order: 1,
      result: {
        player(player) {
          if (player.countCards("he", (card) => {
            if (get.type(card, null, player) == "equip") {
              return get.value(card) < 6;
            }
            return get.value(card) < 5;
          }) < 2) {
            return 0;
          }
          return player.getUseValue({ name: "kaihua" });
        }
      },
      combo: "kotori_yumo"
    }
  },
  kotori_huazhan2: { onremove: true, charlotte: true },
  //三谷良一
  ryoichi_baoyi: {
    trigger: {
      player: "loseAfter",
      global: ["gainAfter", "equipAfter", "addJudgeAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    filterTarget(card, player, target) {
      return target != player && (target.hasSex("female") || target.countCards("hej") > 0);
    },
    filter(event, player) {
      let evt = event.getl(player);
      return evt && evt.es && evt.es.length > 0 && game.hasPlayer((target) => {
        return lib.skill.ryoichi_baoyi.filterTarget;
      });
    },
    forced: true,
    async content(event, trigger, player) {
      let count = trigger.getl(player).es.length;
      await player.draw(count);
      while (count > 0) {
        count--;
        if (!game.hasPlayer((target) => lib.skill.ryoichi_baoyi.filterTarget(null, player, target))) {
          return;
        }
        const result = await player.chooseTarget(true, lib.skill.ryoichi_baoyi.filterTarget, "请选择【爆衣】的目标").set("ai", (target) => -get.attitude(_status.event.player, target)).forResult();
        if (!result.bool || !result.targets || !result.targets.length) {
          return;
        }
        const chosenTarget = result.targets[0];
        player.line(chosenTarget, "green");
        if (chosenTarget.hasSex("female")) {
          await chosenTarget.loseHp();
        } else {
          await player.discardPlayerCard(chosenTarget, 2, "hej", true);
        }
      }
    }
  },
  ryoichi_tuipi: {
    mod: {
      targetEnabled(card) {
        if (card.name == "shunshou" || card.name == "guohe") {
          return false;
        }
      }
    },
    trigger: { player: "phaseDiscardBegin" },
    forced: true,
    async content(event, trigger, player) {
      trigger.setContent(lib.skill.ryoichi_tuipi.phaseDiscardContent);
    },
    async phaseDiscardContent(event, trigger, player) {
      const num = Math.max(0, player.countCards("he", (card) => !player.canIgnoreHandcard(card)) - player.getHandcardLimit());
      if (num <= 0) {
        return;
      }
      if (lib.config.show_phase_prompt) {
        player.popup("弃牌阶段");
      }
      event.trigger("phaseDiscard");
      const result = await player.chooseToDiscard(num, true, "he").forResult();
      event.cards = result.cards;
    },
    ai: {
      halfneg: true
    }
  },
  //乙坂有宇
  yuu_lveduo: {
    mod: {
      cardEnabled(card, player) {
        if (player.isTurnedOver()) {
          return false;
        }
      },
      cardRespondable(card, player) {
        if (player.isTurnedOver()) {
          return false;
        }
      },
      cardSavable(card, player) {
        if (player.isTurnedOver()) {
          return false;
        }
      }
    },
    trigger: { global: "phaseBeginStart" },
    filter(event, player) {
      return player != event.player && !event.player._trueMe && !player.getStorage("yuu_lveduo").includes(event.player) && !player.isTurnedOver() && !player.hasSkill("yuu_lveduo4");
    },
    charlotte: true,
    check(event, player) {
      if (get.attitude(player, event.player) > 0) {
        return false;
      }
      if (event.player.hasJudge("lebu") || !event.player.needsToDiscard()) {
        return false;
      }
      return true;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      await player.turnOver();
      if (player.isTurnedOver()) {
        player.addTempSkill("yuu_lveduo4", "roundStart");
        if (!player.storage.yuu_lveduo) {
          player.storage.yuu_lveduo = [];
        }
        player.storage.yuu_lveduo.push(trigger.player);
        trigger.player._trueMe = player;
        game.addGlobalSkill("autoswap");
        if (trigger.player == game.me) {
          game.notMe = true;
          if (!_status.auto) {
            ui.click.auto();
          }
        }
        player.addSkill("yuu_lveduo2");
        trigger.player.addSkill("yuu_lveduo3");
      }
    }
  },
  yuu_lveduo2: {
    trigger: {
      player: "turnOverEnd"
    },
    lastDo: true,
    charlotte: true,
    forceDie: true,
    forced: true,
    silent: true,
    filter(event, player) {
      return !player.isTurnedOver();
    },
    async content(event, trigger, player) {
      const target = game.findPlayer((current) => current._trueMe == player);
      if (!target) {
        player.removeSkill("yuu_lveduo2");
        return;
      }
      if (target == game.me) {
        if (!game.notMe) {
          game.swapPlayerAuto(target._trueMe);
        } else {
          delete game.notMe;
        }
        if (_status.auto) {
          ui.click.auto();
        }
      }
      delete target._trueMe;
      target.removeSkill("yuu_lveduo3");
      const skills2 = target.getStockSkills(true, true).filter((skill) => {
        const info = get.info(skill);
        return info && info.charlotte == true;
      });
      if (skills2.length) {
        target.removeSkills(skills2);
        player.addSkills(skills2);
        lib.translate.yuu_lveduo_info = lib.translate.yuu_lveduo_full_info;
      }
      if (target.name == "key_yusa") {
        delete target.storage.dualside;
        target.storage.dualside_over = true;
        target.unmarkSkill("dualside");
        target.removeSkill("dualside");
      } else if (target.name == "key_misa") {
        delete target.storage.dualside;
        target.storage.dualside_over = true;
        target.unmarkSkill("dualside");
        target.reinit("key_misa", "key_yusa");
        target.removeSkill("yusa_misa");
        target.removeSkill("dualside");
        target.turnOver(false);
      }
      player.removeSkill("yuu_lveduo2");
    }
  },
  yuu_lveduo3: {
    trigger: {
      player: ["phaseAfter", "dieAfter"],
      global: "phaseBefore"
    },
    lastDo: true,
    charlotte: true,
    forceDie: true,
    forced: true,
    silent: true,
    async content(event, trigger, player) {
      player.removeSkill("yuu_lveduo3");
    },
    onremove(player) {
      if (player._trueMe && player._trueMe.isTurnedOver()) {
        player._trueMe.turnOver();
      }
    }
  },
  yuu_lveduo4: { charlotte: true },
  //松下五段
  godan_yuanyi: {
    trigger: { player: "phaseBegin" },
    forced: true,
    async content(event, trigger, player) {
      const num = game.roundNumber;
      if (num && typeof num == "number") {
        await player.draw(Math.min(3, num));
      }
      trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
    }
  },
  godan_feiqu: {
    inherit: "doruji_feiqu"
  },
  godan_xiaoyuan: {
    trigger: { player: "changeHp" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "soil",
    filter(event, player) {
      return event.num < 0 && player.hp < 4;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.loseMaxHp(3);
      await player.draw(3);
      await player.removeSkills("godan_feiqu");
    },
    ai: {
      combo: "godan_feiqu",
      halfneg: true
    }
  },
  //游佐
  abyusa_jueqing: {
    audio: 2,
    trigger: { source: "damageBegin2" },
    skillAnimation: true,
    animationColor: "water",
    filter(event, player) {
      return player != event.player && !player.storage.abyusa_jueqing_rewrite;
    },
    prompt2(event, player) {
      let num = get.cnNumber(2 * event.num, true);
      return "令即将对其造成的伤害翻倍至" + num + "点，并令自己失去" + get.cnNumber(event.num) + "点体力";
    },
    check(event, player) {
      return player.hp > event.num && event.player.hp > event.num && !event.player.hasSkillTag("filterDamage", null, {
        player,
        card: event.card
      }) && get.attitude(player, event.player) < 0;
    },
    locked(skill, player) {
      return player && player.storage.abyusa_jueqing_rewrite;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      await player.loseHp(trigger.num);
      trigger.num *= 2;
      player.storage.abyusa_jueqing_rewrite = true;
    },
    derivation: "abyusa_jueqing_rewrite",
    group: "abyusa_jueqing_rewrite",
    subSkill: {
      rewrite: {
        audio: "abyusa_jueqing",
        trigger: { source: "damageBefore" },
        forced: true,
        charlotte: true,
        filter(event, player) {
          return player.storage.abyusa_jueqing_rewrite == true;
        },
        check() {
          return false;
        },
        async content(event, trigger, player) {
          trigger.cancel();
          await trigger.player.loseHp(trigger.num);
        },
        ai: {
          jueqing: true,
          skillTagFilter(player) {
            return player.storage.abyusa_jueqing_rewrite == true;
          }
        }
      }
    }
  },
  abyusa_dunying: {
    audio: 2,
    trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
    forced: true,
    filter(event, player) {
      return player.isDamaged();
    },
    async content(event, trigger, player) {
      await player.draw(player.getDamagedHp());
    },
    mod: {
      globalTo(from, to, num) {
        return num + to.getDamagedHp();
      }
    }
  },
  //水濑秋子
  akiko_dongcha: {
    trigger: { global: "phaseBefore" },
    forced: true,
    filter(event, player) {
      return get.mode() == "identity" && game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      const func = function() {
        game.countPlayer((current) => {
          current.setIdentity();
        });
      };
      if (player == game.me) {
        func();
      } else if (player.isOnline()) {
        player.send(func);
      }
      if (!player.storage.zhibi) {
        player.storage.zhibi = [];
      }
      player.storage.zhibi.addArray(game.players);
    },
    ai: {
      viewHandcard: true,
      skillTagFilter(player, tag, arg) {
        if (player == arg) {
          return false;
        }
      }
    }
  },
  //美坂香里
  kaori_siyuan: {
    enable: "phaseUse",
    filter(event, player) {
      return player.countCards("he", lib.skill.kaori_siyuan.filterCard);
    },
    filterCard(card) {
      return ["equip", "delay"].includes(get.type(card));
    },
    filterTarget(card, player, target) {
      if (player == target) {
        return false;
      }
      card = ui.selected.cards[0];
      if (get.type(card) == "delay") {
        return target.canAddJudge({ name: get.name(card, player) });
      }
      return target.canEquip(card);
    },
    discard: false,
    lose: false,
    prepare: "give",
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      const card = cards2[0];
      if (get.type(card) == "equip") {
        await target.equip(card);
      } else {
        await target.addJudge(get.name(card, player), [card]);
      }
      const list = [];
      for (const i of lib.inpile) {
        const type = get.type(i);
        if (type == "basic" || type == "trick") {
          list.push([type, "", i]);
        }
        if (i == "sha") {
          for (const j of lib.inpile_nature) {
            list.push([type, "", i, j]);
          }
        }
      }
      const result = await player.chooseButton(["是否视为使用一张基本牌或普通锦囊牌？", [list, "vcard"]]).set(
        "filterButton",
        (button) => player.hasUseTarget({
          name: button.link[2],
          nature: button.link[3],
          isCard: true
        })
      ).set(
        "ai",
        (button) => player.getUseValue({
          name: button.link[2],
          nature: button.link[3],
          isCard: true
        })
      ).forResult();
      if (result.bool) {
        await player.chooseUseTarget(true, {
          name: result.links[0][2],
          nature: result.links[0][3],
          isCard: true
        });
      }
    },
    ai: {
      basic: {
        order: 10
      },
      result: {
        target(player, target) {
          let card = ui.selected.cards[0];
          if (card) {
            return get.effect(target, card, target, target);
          }
          return 0;
        }
      }
    }
  },
  //美坂栞
  shiori_huijuan: {
    trigger: { global: "phaseJieshuBegin" },
    locked: true,
    filter(event, player) {
      return event.player != player && event.player.getHistory("useCard", function(evt) {
        return evt.isPhaseUsing() && ["basic", "trick"].includes(get.type(evt.card)) && player.hasUseTarget({
          name: evt.card.name,
          nature: evt.card.nature,
          isCard: true
        });
      }).length > 0;
    },
    async cost(event, trigger, player) {
      const list = [];
      trigger.player.getHistory("useCard", function(evt) {
        if (!evt.isPhaseUsing() || !["basic", "trick"].includes(get.type(evt.card))) {
          return;
        }
        if (evt.card.name == "sha" && evt.card.nature) {
          list.add("sha:" + evt.card.nature);
        } else {
          list.add(evt.card.name);
        }
      });
      for (let i = 0; i < list.length; i++) {
        if (list[i].indexOf("sha:") == 0) {
          list[i] = ["基本", "", "sha", list[i].slice(4)];
        } else {
          list[i] = [get.type(list[i]), "", list[i]];
        }
      }
      const result = await player.chooseButton([get.prompt(event.skill), [list, "vcard"]]).set("filterButton", (button) => {
        return player.hasUseTarget({
          name: button.link[2],
          nature: button.link[3],
          isCard: true
        });
      }).set("ai", (button) => {
        return player.getUseValue({
          name: button.link[2],
          nature: button.link[3],
          isCard: true
        });
      }).forResult();
      if (result.bool) {
        event.result = {
          bool: true,
          cost_data: {
            card: {
              name: result.links[0][2],
              nature: result.links[0][3],
              isCard: true
            }
          }
        };
      }
    },
    async content(event, trigger, player) {
      player.chooseUseTarget(true, event.cost_data.card);
      player.getStat("skill").shiori_huijuan = 1;
    },
    group: "shiori_huijuan_discard"
  },
  shiori_huijuan_discard: {
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      let num = 0;
      let stat = player.stat;
      for (let i = stat.length - 2; i--; i >= 0) {
        if (stat[i].isMe) {
          break;
        }
        if (stat[i].skill && stat[i].skill.shiori_huijuan) {
          num++;
        }
      }
      return num >= Math.max(2, game.countPlayer() / 2);
    },
    forced: true,
    async content(event, trigger, player) {
      let result;
      if (player.countDiscardableCards(player, "ej")) {
        result = await player.discardPlayerCard(player, "ej").set("ai", (button) => {
          let card = button.link;
          let player2 = _status.event.player;
          if (get.position(card) == "j") {
            return 7 + Math.random();
          }
          return 4 + player2.needsToDiscard() - get.value(card);
        }).forResult();
      } else {
        result = { bool: false };
      }
      if (!result.bool) {
        player.skip("phaseUse");
      }
    }
  },
  //野村美希
  miki_shenqiang: {
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      await player.equip(game.createCard2("miki_hydrogladiator", "club", 6));
      await player.equip(game.createCard2("miki_binoculars", "diamond", 6));
    },
    mod: {
      canBeDiscarded(card, player, target) {
        if (get.position(card) == "e" && get.subtypes(card).some((subtype) => ["equip1", "equip5"].includes(subtype)) && player != target) {
          return false;
        }
      }
    }
  },
  miki_huanmeng: {
    inherit: "kamome_huanmeng"
  },
  miki_zhiluo: {
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      return !event.player.countCards("e") && player.inRange(event.player);
    },
    locked: true,
    async cost(event, trigger, player) {
      event.result = { bool: true, cost_data: { index: 0 } };
      if (player.canUse("sha", trigger.player, false)) {
        const { index } = await player.chooseControl().set("prompt", "制裸：请选择一项").set("choiceList", ["摸一张牌", "视为对" + get.translation(trigger.player) + "使用一张【杀】"]).set("ai", () => {
          if (get.effect(_status.event.getTrigger().player, { name: "sha" }, _status.event.player) > 0) {
            return 1;
          }
          return 0;
        }).forResult();
        event.result.cost_data.index = index;
      }
    },
    async content(event, trigger, player) {
      const result = event.cost_data;
      if (result.index == 0) {
        player.logSkill("miki_zhiluo");
        player.draw();
      } else {
        player.useCard({ name: "sha", isCard: true }, trigger.player, "miki_zhiluo");
      }
    }
  },
  miki_hydrogladiator_skill: {
    trigger: {
      source: "damageSource"
    },
    locked: true,
    popup: "海德洛",
    filter(event, player) {
      return event.getParent().name == "sha" && game.hasPlayer((current) => {
        return (current == event.player || current != player && get.distance(current, event.player) <= 1) && current.countDiscardableCards(player, "he") > 0;
      });
    },
    async cost(event, trigger, player) {
      const list = [];
      const choiceList = [];
      if (trigger.player.countDiscardableCards(player, "he") > 0) {
        list.push(true);
        choiceList.push("弃置" + get.translation(trigger.player) + "的两张牌");
      }
      if (game.hasPlayer((current) => {
        return current != player && get.distance(current, trigger.player) <= 1;
      })) {
        list.push(false);
        choiceList.push("弃置所有至" + get.translation(trigger.player) + "距离为1的角色的各一张牌");
      }
      let index;
      if (list.length == 1) {
        index = 0;
      } else {
        const result = await player.chooseControl().set("choiceList", choiceList).set("prompt", "海德洛格拉迪尔特·改").set("ai", () => {
          const player2 = _status.event.player;
          const source = _status.event.getTrigger().player;
          const num = game.countPlayer((current) => {
            if (current != player2 && get.distance(current, source) <= 1 && current.countDiscardableCards(player2, "he") > 0) {
              return -get.sgn(get.attitude(player2, current));
            }
          });
          if (num > Math.min(2, source.countDiscardableCards(player2, "he"))) {
            return 1;
          }
          return 0;
        }).forResult();
        index = result.index;
      }
      if (list[index]) {
        event.result = {
          bool: true,
          cost_data: { type: "single" },
          targets: [trigger.player]
        };
      } else {
        event.result = {
          bool: true,
          cost_data: { type: "multiple" },
          targets: game.filterPlayer((current) => {
            return current != player && get.distance(current, trigger.player) <= 1;
          }).sortBySeat()
        };
      }
    },
    async content(event, trigger, player) {
      if (event.cost_data.type == "single") {
        await player.discardPlayerCard(event.targets[0], "he", 2, true);
        return;
      }
      for (const target of event.targets) {
        if (target.countDiscardableCards(player, "he") > 0) {
          await player.discardPlayerCard(target, "he", true);
        }
      }
    }
  },
  miki_binoculars: {
    locked: true,
    ai: {
      viewHandcard: true,
      skillTagFilter(player, tag, arg) {
        if (player == arg) {
          return false;
        }
      }
    }
  },
  //关根诗织&入江美雪
  shiorimiyuki_banyin: {
    audio: 2,
    trigger: { player: ["damageEnd", "recoverEnd"] },
    filter(event, player) {
      return game.hasPlayer((current) => {
        return current != player && current.isDamaged();
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "令一名其他角色回复1点体力", lib.filter.notMe).set("ai", (target) => {
        let player2 = _status.event.player;
        return get.recoverEffect(target, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      target.recover();
    }
  },
  shiorimiyuki_tingxian: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    async cost(event, trigger, player) {
      const { control, index } = await player.chooseControl("一张", "两张", "三张", "cancel2").set("prompt", get.prompt2(event.skill)).set("ai", () => {
        let player2 = _status.event.player;
        let max = Math.min(player2.hp + 1, player2.maxHp);
        let min = Math.min(Math.max(max - 2, max - player2.hp), 3);
        if (min) {
          return min - 1;
        }
        return 3;
      }).forResult();
      if (control != "cancel2") {
        event.result = { bool: true, cost_data: index };
      }
    },
    async content(event, trigger, player) {
      let num = 1 + event.cost_data;
      await player.draw(num).set("gaintag", ["shiorimiyuki_tingxian"]);
      await player.recover();
      player.addTempSkill("shiorimiyuki_tingxian2", "phaseUseAfter");
    },
    group: "shiorimiyuki_tingxian1"
  },
  shiorimiyuki_tingxian1: { audio: true },
  shiorimiyuki_tingxian2: {
    audio: true,
    trigger: { player: "phaseUseEnd" },
    forced: true,
    charlotte: true,
    mod: {
      aiOrder(player, card, num) {
        if (get.itemtype(card) == "card" && card.hasGaintag("shiorimiyuki_tingxian")) {
          return num + 2;
        }
      },
      aiValue(player, card, num) {
        if (get.itemtype(card) == "card" && card.hasGaintag("shiorimiyuki_tingxian")) {
          return 0;
        }
      }
    },
    filter(event, player) {
      return player.countCards("h", (card) => {
        return card.hasGaintag("shiorimiyuki_tingxian");
      }) > 0;
    },
    async content(event, trigger, player) {
      player.removeGaintag("shiorimiyuki_tingxian");
      await player.loseHp(
        player.countCards("h", (card) => card.hasGaintag("shiorimiyuki_tingxian"))
      );
    }
  },
  //中津静流
  shizuru_nianli: {
    enable: "chooseToUse",
    charlotte: true,
    prompt: "展示一张♦/♣/♥/♠手牌，然后视为使用一张雷【杀】/【闪】/【桃】/【无懈可击】",
    viewAs(cards2, player) {
      let name = false;
      let nature = null;
      switch (get.suit(cards2[0], player)) {
        case "club":
          name = "shan";
          break;
        case "diamond":
          name = "sha";
          nature = "thunder";
          break;
        case "spade":
          name = "wuxie";
          break;
        case "heart":
          name = "tao";
          break;
      }
      if (name) {
        return { name, nature, isCard: true };
      }
      return null;
    },
    check(card) {
      let player = _status.event.player;
      if (_status.event.type == "phase") {
        let max = 0;
        let name2;
        let list = ["sha", "tao"];
        let map = { sha: "diamond", tao: "heart" };
        for (let i = 0; i < list.length; i++) {
          let name = list[i];
          if (player.countCards("h", (card2) => {
            return get.suit(card2, player) == map[name];
          }) > 0 && player.getUseValue({
            name,
            nature: name == "sha" ? "fire" : null
          }) > 0) {
            let temp = get.order({
              name,
              nature: name == "sha" ? "fire" : null
            });
            if (temp > max) {
              max = temp;
              name2 = map[name];
            }
          }
        }
        if (name2 == get.suit(card, player)) {
          return 1;
        }
        return 0;
      }
      return 1;
    },
    ignoreMod: true,
    filterCard(card, player, event) {
      event = event || _status.event;
      let filter = event._backup.filterCard;
      let name = get.suit(card, player);
      if (name == "club" && filter({ name: "shan" }, player, event)) {
        return true;
      }
      if (name == "diamond" && filter({ name: "sha", nature: "thunder" }, player, event)) {
        return true;
      }
      if (name == "spade" && filter({ name: "wuxie" }, player, event)) {
        return true;
      }
      if (name == "heart" && filter({ name: "tao" }, player, event)) {
        return true;
      }
      return false;
    },
    filter(event, player) {
      if (player.hasSkill("shizuru_nianli_round")) {
        return false;
      }
      let filter = event.filterCard;
      if (filter({ name: "sha", nature: "thunder" }, player, event) && player.countCards("h", { suit: "diamond" })) {
        return true;
      }
      if (filter({ name: "shan" }, player, event) && player.countCards("h", { suit: "club" })) {
        return true;
      }
      if (filter({ name: "tao" }, player, event) && player.countCards("h", { suit: "heart" })) {
        return true;
      }
      if (filter({ name: "wuxie" }, player, event) && player.countCards("h", { suit: "spade" })) {
        return true;
      }
      return false;
    },
    log: false,
    async precontent(event, trigger, player) {
      player.logSkill("shizuru_nianli");
      player.addTempSkill("shizuru_nianli_clear");
      player.addTempSkill("shizuru_nianli_round", "roundStart");
      player.showCards(get.translation(player) + "发动了【念力】", event.result.cards.slice(0));
      event.result.card.cards = [];
      event.result.cards = [];
      delete event.result.card.suit;
      delete event.result.card.number;
      event.getParent().addCount = false;
      event.getParent().shizuru_nianli = true;
    },
    ai: {
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag) {
        if (player.hasSkill("shizuru_nianli_round")) {
          return false;
        }
        let name;
        switch (tag) {
          case "respondSha":
            name = "diamond";
            break;
          case "respondShan":
            name = "club";
            break;
          case "save":
            name = "heart";
            break;
        }
        if (!player.countCards("h", { suit: name })) {
          return false;
        }
      },
      order(item, player) {
        if (player && _status.event.type == "phase") {
          let max = 0;
          let list = ["sha", "tao"];
          let map = { sha: "diamond", tao: "heart" };
          for (let i = 0; i < list.length; i++) {
            let name = list[i];
            if (player.countCards("h", (card) => {
              return get.suit(card, player) == map[name];
            }) > 0 && player.getUseValue({
              name,
              nature: name == "sha" ? "thunder" : null
            }) > 0) {
              let temp = get.order({
                name,
                nature: name == "sha" ? "thunder" : null
              });
              if (temp > max) {
                max = temp;
              }
            }
          }
          max /= 1.1;
          return max;
        }
        return 2;
      }
    },
    hiddenCard(player, name) {
      if (name == "wuxie") {
        return player.countCards("h", (card) => {
          return _status.connectMode || get.suit(card) == "spade";
        }) > 0 && !player.hasSkill("shizuru_nianli_round");
      }
      if (name == "tao") {
        return player.countCards("h", { suit: "heart" }) > 0 && !player.hasSkill("shizuru_nianli_round");
      }
      return false;
    },
    subSkill: {
      round: {
        charlotte: true,
        mark: true,
        intro: { content: "本轮已发动" }
      },
      clear: {
        charlotte: true,
        trigger: { player: "useCardAfter" },
        lastDo: true,
        silent: true,
        filter(event, player) {
          return event.getParent().shizuru_nianli == true;
        },
        async content(event, trigger, player) {
          player.getHistory("useCard").remove(trigger);
        }
      }
    }
  },
  shizuru_benzhan: {
    trigger: { global: ["useCard", "respond"] },
    usable: 1,
    filter(event, player) {
      return Array.isArray(event.respondTo) && event.respondTo[0] != event.player && [event.respondTo[0], event.player].includes(player);
    },
    async cost(event, trigger, player) {
      event.type = get.type(trigger.card) == "basic";
      let prompt = event.type ? "令一名角色摸两张牌或弃置两张牌" : "令一名角色回复1点体力或对其造成1点伤害";
      event.result = await player.chooseTarget(get.prompt(event.skill), prompt).set("ai", function(target) {
        let player2 = _status.event.player;
        if (_status.event.getParent().type) {
          let att = get.attitude(player2, target);
          if (target.hasSkillTag("nogain")) {
            return -att;
          }
          if (target.countCards("he") == 1 && att < 0) {
            att /= 2;
          }
          return Math.abs(att) * (1 + 0.1 * Math.min(0, 5 - target.countCards("h")));
        }
        return Math.max(get.recoverEffect(target, player2, player2), get.damageEffect(target, player2, player2));
      }).forResult();
    },
    async content(event, trigger, player) {
      const type = get.type(trigger.card) == "basic";
      const target = event.targets[0];
      const trans = get.translation(target);
      let list;
      if (type) {
        if (!target.countCards("he")) {
          target.draw(2);
          player.addExpose(0.2);
          return;
        }
        list = ["令" + trans + "摸两张牌", "令" + trans + "弃置两张牌"];
      } else {
        if (target.isHealthy()) {
          target.damage();
          player.addExpose(0.2);
          return;
        }
        list = ["令" + trans + "回复1点体力", "对" + trans + "造成1点伤害"];
      }
      const result = await player.chooseControl().set("choiceList", list).set(
        "choice",
        (() => {
          if (type) {
            return get.attitude(player, target) > 0 ? 0 : 1;
          }
          return get.recoverEffect(target, player, player) > get.damageEffect(target, player, player) ? 0 : 1;
        })()
      ).set("ai", () => _status.event.choice).forResult();
      player.addExpose(0.2);
      if (type) {
        if (result.index == 0) {
          await target.draw(2);
        } else {
          await target.chooseToDiscard(2, "he", true);
        }
      } else {
        if (result.index == 0) {
          await target.recover();
        } else {
          await target.damage();
        }
      }
    }
  },
  //岬镜子
  kyoko_juwu: {
    trigger: {
      global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"]
    },
    filter(event, player) {
      if (player == _status.currentPhase) {
        return false;
      }
      let cards2 = event.getd();
      if (!cards2.length) {
        return false;
      }
      cards2.removeArray(event.getd(player));
      for (const card of cards2) {
        if (get.position(card, true) == "d" && get.type(card, null, false) == "equip") {
          return true;
        }
      }
      return false;
    },
    autodelay(event, player) {
      return event.delay === false;
    },
    async cost(event, trigger, player) {
      let cards2 = trigger.getd();
      cards2.removeArray(trigger.getd(player));
      cards2 = cards2.filter((card) => {
        if (get.position(card, true) == "d" && get.type(card, null, false) == "equip") {
          return true;
        }
      });
      const result = await player.chooseButton([get.prompt(event.skill), cards2], [1, cards2.length]).set("ai", () => {
        return 1;
      }).forResult();
      if (result.bool) {
        event.result = {
          bool: true,
          cards: result.links
        };
      }
    },
    async content(event, trigger, player) {
      await player.gain(event.cards, "gain2", "log");
    }
  },
  kyoko_zhengyi: {
    locked: true,
    group: ["kyoko_jingce", "kyoko_shelie", "kyoko_zhiheng"],
    count(player) {
      let list = [];
      player.countCards("e", (card) => {
        list.add(get.suit(card, player));
      });
      return list.length;
    }
  },
  kyoko_jingce: {
    trigger: { player: ["phaseUseEnd", "phaseJieshuBegin"] },
    filter(event, player) {
      let num = lib.skill.kyoko_zhengyi.count(player);
      if (!num || event.name == "phaseUse" == num > 3) {
        return false;
      }
      return player.getHistory("useCard", function(evt) {
        return event.name != "phaseUse" || evt.getParent("phaseUse") == event;
      }).length >= player.hp;
    },
    frequent: true,
    async content(event, trigger, player) {
      if (trigger.name == "phaseUse") {
        await player.draw(2);
        return;
      }
      const history = player.getHistory("useCard");
      const list = [];
      for (const i of history) {
        list.add(get.suit(i.card));
        if (list.length >= player.hp) {
          break;
        }
      }
      if (list.length >= player.hp) {
        const next1 = player.phaseDraw();
        event.next.remove(next1);
        trigger.getParent().next.push(next1);
        const next2 = player.phaseUse();
        event.next.remove(next2);
        trigger.getParent().next.push(next2);
      } else {
        const result = await player.chooseControl("摸牌阶段", "出牌阶段").set("prompt", "精策：选择要执行的额外阶段").forResult();
        if (result.index == 0) {
          const next = player.phaseDraw();
          event.next.remove(next);
          trigger.getParent().next.push(next);
        } else {
          const next = player.phaseUse();
          event.next.remove(next);
          trigger.getParent().next.push(next);
        }
      }
    }
  },
  kyoko_shelie: {
    audio: 2,
    trigger: { player: "phaseDrawBegin1" },
    filter(event, player) {
      return !event.numFixed && lib.skill.kyoko_zhengyi.count(player) > 1;
    },
    async content(event, trigger, player) {
      trigger.changeToZero();
      event.cards = get.cards(5);
      game.cardsGotoOrdering(event.cards);
      event.videoId = lib.status.videoId++;
      game.broadcastAll(
        function(player2, id, cards3) {
          let str;
          if (player2 == game.me && !_status.auto) {
            str = "涉猎：获取花色各不相同的牌";
          } else {
            str = "涉猎";
          }
          let dialog = ui.create.dialog(str, cards3);
          dialog.videoId = id;
        },
        player,
        event.videoId,
        event.cards
      );
      event.time = get.utc();
      game.addVideo("showCards", player, ["涉猎", get.cardsInfo(event.cards)]);
      game.addVideo("delay", null, 2);
      const result = await player.chooseButton([0, 5], true).set("dialog", event.videoId).set("filterButton", function(button) {
        for (let i = 0; i < ui.selected.buttons.length; i++) {
          if (get.suit(ui.selected.buttons[i].link) == get.suit(button.link)) {
            return false;
          }
        }
        return true;
      }).set("ai", (button) => {
        return get.value(button.link, _status.event.player);
      }).forResult();
      if (result.bool && result.links) {
        event.cards2 = result.links;
      } else {
        event.finish();
      }
      let time = 1e3 - (get.utc() - event.time);
      if (time > 0) {
        await game.delayx(time / 1e3);
      }
      game.broadcastAll("closeDialog", event.videoId);
      let cards2 = event.cards2;
      player.gain(cards2, "log", "gain2");
    }
  },
  kyoko_zhiheng: {
    enable: "phaseUse",
    usable: 1,
    position: "he",
    filter(event, player) {
      return lib.skill.kyoko_zhengyi.count(player) > 2;
    },
    prompt() {
      let str = "弃置任意张牌并摸等量的牌";
      if (lib.skill.kyoko_zhengyi.count(_status.event.player) > 3) {
        str += "，若弃置了所有手牌则多摸一张牌。";
      }
      return str;
    },
    filterCard: lib.filter.cardDiscardable,
    discard: false,
    lose: false,
    delay: false,
    selectCard: [1, Infinity],
    allowChooseAll: true,
    check(card) {
      let player = _status.event.player;
      if (get.position(card) == "h") {
        return 8 - get.value(card);
      }
      if (get.position(card) == "e") {
        let subs = get.subtypes(card);
        if (subs.includes("equip2") || subs.includes("equip3")) {
          return player.getHp() - get.value(card);
        }
      }
      return 6 - get.value(card);
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      await player.discard(cards2);
      let num = 1;
      const hs = player.getCards("h");
      if (hs.length && lib.skill.kyoko_zhengyi.count(player) >= 4) {
        for (let i = 0; i < hs.length; i++) {
          if (!cards2.includes(hs[i])) {
            num = 0;
            break;
          }
        }
      } else {
        num = 0;
      }
      await player.draw(num + cards2.length);
    },
    ai: {
      order: 1,
      result: {
        player: 1
      }
    }
  },
  //音无结弦（3v3）
  yuzuru_bujin: {
    global: "yuzuru_bujin2",
    trigger: { global: "phaseDrawBegin" },
    forced: true,
    logTarget: "player",
    filter(event, player) {
      return event.player != player && event.player.isFriendOf(player);
    },
    async content(event, trigger, player) {
      trigger.num++;
    }
  },
  yuzuru_bujin2: {
    mod: {
      globalFrom(from, to, num) {
        return num - game.countPlayer((current) => {
          return current != from && current.hasSkill("yuzuru_bujin") && current.isFriendOf(from);
        });
      }
    }
  },
  //西园美鱼
  mio_tuifu: {
    trigger: { global: "damageBegin1" },
    forced: true,
    filter(event, player) {
      return event.source && event.source.sameSexAs(event.player);
    },
    async content(event, trigger, player) {
      await player.draw();
    }
  },
  mio_tishen: {
    trigger: { player: "phaseZhunbeiBegin" },
    limited: true,
    forceunique: true,
    charlotte: true,
    skillAnimation: true,
    animationColor: "water",
    filter(event, player) {
      return player.isDamaged();
    },
    check(event, player) {
      if (![player.name1, player.name2].includes("key_mio")) {
        return false;
      }
      return player.hp <= 1 || player.getDamagedHp() > 1;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const num = player.maxHp - player.hp;
      await player.recover(num);
      await player.draw(num);
      if (_status.characterlist && _status.characterlist.includes("key_midori")) {
        player.reinitCharacter("key_mio", "key_midori", false);
      }
    }
  },
  //西园美鸟
  midori_nonghuan: {
    enable: "phaseUse",
    usable(skill, player) {
      return player.hp;
    },
    charlotte: true,
    filter(event, player) {
      return game.hasPlayer((target) => lib.skill.midori_nonghuan.filterTarget(null, player, target));
    },
    filterTarget(card, player, target) {
      let stat = player.getStat("midori_nonghuan");
      return target != player && (!stat || !stat.includes(target)) && target.countGainableCards(player, "hej") > 0;
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const stat = player.getStat();
      if (!stat.midori_nonghuan) {
        stat.midori_nonghuan = [];
      }
      stat.midori_nonghuan.push(target);
      await player.gainPlayerCard(target, "hej", true);
      await player.draw();
      if (player.countCards("he") > 0) {
        const result = await player.chooseCard("he", true, "交给" + get.translation(target) + "一张牌").forResult();
        await player.give(result.cards, target);
      }
      const cardHistory = game.getGlobalHistory("cardMove");
      for (let i = 0; i < cardHistory.length; i++) {
        if (cardHistory[i].getParent("midori_nonghuan") == event) {
          cardHistory.splice(i--, 1);
        }
      }
      game.countPlayer2((current) => {
        const loseHistory = current.getHistory("lose");
        for (let i = 0; i < loseHistory.length; i++) {
          if (loseHistory[i].getParent("midori_nonghuan") == event) {
            loseHistory.splice(i--, 1);
          }
        }
        const gainHistory = current.getHistory("gain");
        for (let i = 0; i < gainHistory.length; i++) {
          if (gainHistory[i].getParent("midori_nonghuan") == event) {
            gainHistory.splice(i--, 1);
          }
        }
      });
    },
    ai: {
      order: 9,
      result: {
        player() {
          return lib.card.shunshou.ai.result.player.apply(this, arguments);
        },
        target() {
          return lib.card.shunshou.ai.result.target.apply(this, arguments);
        }
      }
    }
  },
  midori_tishen: {
    trigger: { player: "phaseZhunbeiBegin" },
    limited: true,
    charlotte: true,
    forceunique: true,
    skillAnimation: true,
    animationColor: "water",
    filter(event, player) {
      return player.isDamaged();
    },
    check(event, player) {
      if (![player.name1, player.name2].includes("key_midori")) {
        return false;
      }
      return player.hp <= 1 || player.getDamagedHp() > 1;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const num = player.maxHp - player.hp;
      await player.recover(num);
      await player.draw(num);
      if (_status.characterlist && _status.characterlist.includes("key_mio")) {
        player.reinitCharacter("key_midori", "key_mio", false);
      }
    }
  },
  //立华奏
  kanade_mapo: {
    audio: 2,
    derivation: "mapodoufu",
    enable: "chooseToUse",
    viewAs: { name: "mapodoufu" },
    filterCard: { suit: "heart" },
    viewAsFilter(player) {
      return player.countCards("hes", { suit: "heart" }) > 0;
    },
    position: "hes",
    mod: {
      selectTarget(card, player, range) {
        if (card.name == "mapodoufu" && range[1] != -1) {
          range[1]++;
        }
      }
    },
    check(card) {
      let player = _status.event.player;
      if (game.countPlayer((current) => {
        return player.canUse("mapodoufu", current) && get.effect(current, { name: "mapodoufu" }, player, player) > 0;
      }) > 1) {
        return 6 - get.value(card);
      }
      return 4 - get.value(card);
    }
  },
  kanade_benzhan: {
    audio: 3,
    trigger: { global: ["useCard", "respond"] },
    usable: 1,
    filter(event, player) {
      return Array.isArray(event.respondTo) && event.respondTo[0] != event.player && [event.respondTo[0], event.player].includes(player);
    },
    async cost(event, trigger, player) {
      event.type = get.type(trigger.card) == "basic";
      let prompt = event.type ? "令一名角色摸两张牌或弃置两张牌" : "令一名角色回复1点体力或对其造成1点伤害";
      event.result = await player.chooseTarget(get.prompt(event.skill), prompt).set("ai", function(target) {
        let player2 = _status.event.player;
        if (_status.event.getParent().type) {
          let att = get.attitude(player2, target);
          if (target.hasSkillTag("nogain")) {
            return -att;
          }
          if (target.countCards("he") == 1 && att < 0) {
            att /= 2;
          }
          return Math.abs(att) * (1 + 0.1 * Math.min(0, 5 - target.countCards("h")));
        }
        return Math.max(get.recoverEffect(target, player2, player2), get.damageEffect(target, player2, player2));
      }).forResult();
    },
    async content(event, trigger, player) {
      const type = get.type(trigger.card) == "basic";
      const target = event.targets[0];
      const trans = get.translation(target);
      let list;
      if (type) {
        if (!target.countCards("he")) {
          target.draw(2);
          player.addExpose(0.2);
          return;
        }
        list = ["令" + trans + "摸两张牌", "令" + trans + "弃置两张牌"];
      } else {
        if (target.isHealthy()) {
          target.damage();
          player.addExpose(0.2);
          return;
        }
        list = ["令" + trans + "回复1点体力", "对" + trans + "造成1点伤害"];
      }
      const result = await player.chooseControl().set("choiceList", list).set(
        "choice",
        (() => {
          if (type) {
            return get.attitude(player, target) > 0 ? 0 : 1;
          }
          return get.recoverEffect(target, player, player) > get.damageEffect(target, player, player) ? 0 : 1;
        })()
      ).set("ai", () => _status.event.choice).forResult();
      player.addExpose(0.2);
      if (type) {
        if (result.index == 0) {
          await target.draw(2);
        } else {
          await target.chooseToDiscard(2, "he", true);
        }
      } else {
        if (result.index == 0) {
          await target.recover();
        } else {
          await target.damage();
        }
      }
    }
  },
  //音无结弦
  yuzuru_wuxin: {
    trigger: { player: "phaseJieshuBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        filterTarget() {
          if (ui.selected.cards.length) {
            return false;
          }
          return true;
        },
        filterCard() {
          if (ui.selected.targets.length) {
            return false;
          }
          return lib.filter.cardDiscardable.apply(this, arguments);
        },
        selectTarget() {
          if (!ui.selected.cards.length) {
            return [1, 1];
          }
          return [0, 0];
        },
        selectCard() {
          if (ui.selected.targets.length) {
            return [0, 0];
          }
          if (!ui.selected.cards.length) {
            return [0, 2];
          }
          return [2, 2];
        },
        prompt: get.prompt2(event.skill),
        complexCard: true,
        complexTarget: true,
        ai1(card) {
          player = _status.event.player;
          if (player.hp > 3) {
            return 0;
          }
          return player.getDamagedHp() * 2 - get.value(card);
        },
        ai2(target) {
          if (player.hp < 4 || target.hasSkillTag("nogain")) {
            return 0;
          }
          return get.attitude(_status.event.player, target);
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      if (event.cards && event.cards.length) {
        player.discard(event.cards);
        player.recover();
      } else {
        const target = event.targets[0];
        player.loseHp();
        target.draw(2);
      }
    }
  },
  yuzuru_deyi: {
    derivation: ["yuzuru_kunfen", "yuzuru_quji", "yuzuru_wangsheng", "yuzuru_kunfen_rewrite", "yuzuru_quji_rewrite"],
    trigger: { global: "dieAfter" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "orange",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.changeSkills(["yuzuru_kunfen", "yuzuru_quji", "yuzuru_wangsheng"], ["yuzuru_wuxin"]);
      await player.loseMaxHp();
      await player.recover();
    }
  },
  yuzuru_kunfen: {
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    async content(event, trigger, player) {
      if (!player.storage._yuzuru_sss) {
        await player.loseHp();
      }
      await player.draw(2);
      if (player.countCards("he") < 2) {
        return;
      }
      const result = await player.chooseCardTarget({
        selectCard: 2,
        filterTarget: lib.filter.notMe,
        prompt: "是否交给一名其他角色两张牌？",
        position: "he",
        ai1(card) {
          const player2 = _status.event.player;
          if (player2.maxHp - player2.hp == 1 && card.name == "du") {
            return 30;
          }
          const check = player2.countCards("h") - 2;
          if (check < 1) {
            return 0;
          }
          if (player2.hp > 1 && check < 2) {
            return 0;
          }
          return get.unuseful(card) + 9;
        },
        ai2(target) {
          const att = get.attitude(_status.event.player, target);
          if (ui.selected.cards.length == 1 && ui.selected.cards[0].name == "du") {
            return 1 - att;
          }
          return att - 2;
        }
      }).forResult();
      if (result.bool) {
        await player.give(result.cards, result.targets[0]);
      }
    }
  },
  yuzuru_quji: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    position: "he",
    filterCard: true,
    selectCard() {
      let player = _status.event.player;
      return player.getDamagedHp();
    },
    filterTarget(card, player, target) {
      return target != player && target.hp < target.maxHp;
    },
    filter(event, player) {
      return player.hp < player.maxHp;
    },
    selectTarget() {
      return [1, ui.selected.cards.length];
    },
    complexSelect: true,
    check(card) {
      if (!_status.event.player.storage._yuzuru_sss && get.color(card) == "black") {
        return -1;
      }
      return 9 - get.value(card);
    },
    line: { color: [194, 117, 92] },
    async content(event, trigger, player) {
      const { cards: cards2, target, targets } = event;
      await target.recover();
      if (target == targets[targets.length - 1] && !player.storage._yuzuru_sss) {
        for (const card of cards2) {
          if (get.color(card, player) == "black") {
            await player.loseHp();
            break;
          }
        }
      }
    },
    ai: {
      result: {
        target: 1
      },
      order: 6
    }
  },
  yuzuru_wangsheng: {
    trigger: { player: "dieBegin" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "soil",
    async content(event, trigger, player) {
      trigger.cancel();
      await player.awakenSkill(event.name);
      player.storage._yuzuru_sss = true;
      if (player.countCards("he") > 0) {
        const result = await player.chooseCardTarget({
          selectCard: [1, Infinity],
          filterTarget: lib.filter.notMe,
          prompt: "将任意张牌交给一名其他角色，或点【取消】。",
          position: "he",
          ai1: (card) => {
            const player2 = _status.event.player;
            if (get.suit(card, false) == "heart" && game.hasPlayer((current) => current.hasSkill("kanade_mapo") && get.attitude(player2, current) > 0)) {
              return 1;
            }
            return 0;
          },
          ai2: (kanade) => {
            if (kanade.hasSkill("kanade_mapo") && get.attitude(_status.event.player, kanade) > 0) {
              return 2;
            }
            return 0;
          },
          allowChooseAll: true
        }).forResult();
        if (result.bool) {
          await player.give(result.cards, result.targets[0]);
        }
      }
      await player.loseMaxHp();
      if (player.hp < 2) {
        await player.recover(2 - player.hp);
      }
    }
  },
  //空门苍
  ao_xishi: {
    trigger: {
      player: ["useCard", "respond"],
      target: "useCardToTargeted"
    },
    forced: true,
    filter(event, player, name) {
      return (name == "useCard" || name == "respond" || event.player != player) && get.suit(event.card) == "diamond";
    },
    async content(event, trigger, player) {
      await player.draw();
    }
  },
  ao_kuihun: {
    trigger: { global: "dying" },
    logTarget: "player",
    line: "thunder",
    filter(event, player) {
      return player != event.player;
    },
    async content(event, trigger, player) {
      await player.draw();
      if (!trigger.player.countCards("h")) {
        return;
      }
      const result = await player.chooseButton(["选择一张牌作为「蝶」", trigger.player.getCards("h")]).set("ai", (button) => {
        const val = get.buttonValue(button);
        if (get.attitude(_status.event.player, get.owner(button.link)) <= 0) {
          return 10 + val;
        }
        if (val <= 0) {
          return 20;
        }
        if (button.link.name == "tao" || button.link.name == "jiu") {
          return 0;
        }
        return 1 / val;
      }).forResult();
      if (result.bool) {
        player.addToExpansion(result.links, trigger.player, "give").set("log", false).gaintag.add("ao_diegui");
        game.log(result.links, "飞向了", player);
      }
    },
    locked: false,
    mod: {
      targetInRange(card, player) {
        const cardSuit = get.suit(card, false);
        const list = player.getExpansions("ao_diegui");
        for (let i = 0; i < list.length; i++) {
          if (cardSuit === "unsure" || get.suit(list[i], false) === cardSuit) {
            return true;
          }
        }
      },
      cardUsable(card, player) {
        const cardSuit = get.suit(card, false);
        const list = player.getExpansions("ao_diegui");
        for (let i = 0; i < list.length; i++) {
          if (cardSuit === "unsure" || get.suit(list[i], false) === cardSuit) {
            return Infinity;
          }
        }
      },
      maxHandcard(player, num) {
        return num + player.getExpansions("ao_diegui").length;
      }
    }
  },
  ao_shixin: {
    derivation: "ao_diegui",
    trigger: { player: "phaseZhunbeiBegin" },
    juexingji: true,
    forced: true,
    skillAnimation: true,
    animationColor: "key",
    filter(event, player) {
      let list = player.getExpansions("ao_diegui");
      let list2 = [];
      for (let i = 0; i < list.length; i++) {
        list2.add(get.suit(list[i], false));
      }
      return list2.length > 2;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.changeSkills(["ao_diegui"], ["ao_kuihun"]);
      await player.gainMaxHp();
      await player.recover();
    },
    ai: { combo: "ao_kuihun" }
  },
  ao_diegui: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.getExpansions("ao_diegui").length > 0;
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("蝶归", player.getExpansions("ao_diegui"), "hidden");
      },
      backup(links, player) {
        return {
          card: links,
          filterCard() {
            return false;
          },
          selectCard: -1,
          filterTarget: true,
          delay: false,
          content: lib.skill.ao_diegui.contentx,
          line: "thunder",
          ai: {
            result: {
              target(player2, target) {
                if (target != player2 && target.hasSkillTag("nogain")) {
                  return 0;
                }
                let num = 1;
                if (target.isTurnedOver()) {
                  num += 2;
                }
                if (target.isLinked()) {
                  num += 0.5;
                }
                return num;
              }
            }
          }
        };
      },
      prompt(links, player) {
        return "选择一名角色，令其获得" + get.translation(links[0]) + "，摸两张牌并将武将牌复原。";
      }
    },
    async contentx(event, trigger, player) {
      const { target } = event;
      await player.give(lib.skill.ao_diegui_backup.card, target, "visible");
      await target.draw(2);
      await target.link(false);
      await target.turnOver(false);
    },
    intro: {
      name: "七影蝶",
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill) {
      let cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    ai: { order: 1, result: { player: 1 } }
  },
  //直井文人
  ayato_jianshen: {
    mod: {
      cardnature(card, player) {
        if (get.name(card) == "sha") {
          return "kami";
        }
      }
    },
    ai: { threaten: 3 }
  },
  ayato_zonghuan: {
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target != player && target.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      const { target } = event;
      const chooseResult = await player.chooseButton(["请选择" + get.translation(target) + "的一张手牌", target.getCards("h")], true).set("ai", get.buttonValue).forResult();
      if (!chooseResult.bool) {
        return;
      }
      const card = chooseResult.links[0];
      if (!lib.filter.cardEnabled(card, target)) {
        await target.lose(card, ui.discardPile);
        target.$throw(card);
        game.log(target, "将", card, "置入了弃牌堆");
        return;
      }
      const info = get.info(card);
      let targets2;
      let range;
      if (!info.notarget) {
        const select = get.copy(info.selectTarget);
        if (select == void 0) {
          range = [1, 1];
        } else if (typeof select == "number") {
          range = [select, select];
        } else if (get.itemtype(select) == "select") {
          range = select;
        } else if (typeof select == "function") {
          range = select(card, player);
          if (typeof range == "number") {
            range = [range, range];
          }
        }
        game.checkMod(card, target, range, "selectTarget", target);
      }
      if (info.notarget || range[1] == -1) {
        if (range[1] == -1) {
          const allTargets = game.players.slice(0);
          for (let i = 0; i < allTargets.length; i++) {
            if (!target.canUse(card, allTargets[i])) {
              allTargets.splice(i--, 1);
            }
          }
          if (!allTargets.length) {
            await target.lose(card, ui.discardPile);
            target.$throw(card);
            game.log(target, "将", card, "置入了弃牌堆");
            return;
          }
          targets2 = allTargets;
        } else {
          targets2 = [];
        }
        const boolResult = await player.chooseBool().set("prompt", event.prompt || "是否令" + get.translation(target) + (targets2.length ? "对" : "") + get.translation(targets2) + "使用" + get.translation(card) + "?").set("prompt2", "或点「取消」，令其将此牌置入弃牌堆").set("ai", () => {
          let eff = 0;
          for (const t of targets2) {
            eff += get.effect(t, card, target, player);
          }
          return eff > 0;
        }).forResult();
        if (boolResult.bool) {
          target.useCard(card, targets2, false, "noai");
          player.draw();
        } else {
          await target.lose(card, ui.discardPile);
          target.$throw(card);
          game.log(target, "将", card, "置入了弃牌堆");
        }
      } else {
        const selectResult = await player.chooseTarget().set("_get_card", card).set("source", target).set("filterTarget", (card2, player2, target2) => lib.filter.filterTarget(_status.event._get_card, _status.event.source, target2)).set("ai", (target2) => {
          const evt = _status.event;
          return get.effect(target2, evt._get_card, evt.source, evt.player);
        }).set("selectTarget", () => {
          const card2 = get.card();
          const player2 = _status.event.source;
          if (card2 == void 0) {
            return;
          }
          let range2;
          const select = get.copy(get.info(card2).selectTarget);
          if (select == void 0) {
            if (get.info(card2).filterTarget == void 0) {
              return [0, 0];
            }
            range2 = [1, 1];
          } else if (typeof select == "number") {
            range2 = [select, select];
          } else if (get.itemtype(select) == "select") {
            range2 = select;
          } else if (typeof select == "function") {
            range2 = select(card2, player2);
            if (typeof range2 == "number") {
              range2 = [range2, range2];
            }
          }
          game.checkMod(card2, player2, range2, "selectTarget", player2);
          return range2;
        }).set("prompt", event.prompt || "选择" + get.translation(target) + "使用" + get.translation(card) + "的目标").set("prompt2", "或点「取消」令其将此牌置入弃牌堆").forResult();
        if (selectResult.bool) {
          target.useCard(card, selectResult.targets, false, "noai");
          player.draw();
        } else {
          await target.lose(card, ui.discardPile);
          target.$throw(card);
          game.log(target, "将", card, "置入了弃牌堆");
        }
      }
    },
    ai: { order: 10, result: { target: -1 } }
  },
  //古河渚
  nagisa_tiandu: {
    trigger: { player: "judgeEnd" },
    charlotte: true,
    frequent(event) {
      if (event.result.card.name == "du") {
        return false;
      }
      return true;
    },
    check(event) {
      if (event.result.card.name == "du") {
        return false;
      }
      return true;
    },
    filter(event, player) {
      return get.position(event.result.card, true) == "o";
    },
    async content(event, trigger, player) {
      await player.gain(trigger.result.card, "gain2");
    }
  },
  nagisa_fuxin: {
    trigger: {
      global: ["gainAfter", "loseAfter", "loseAsyncAfter", "damageEnd"]
    },
    filterx(event, player) {
      let source = _status.currentPhase;
      if (event.name == "damage") {
        return event.player.isAlive() && event.player != source;
      } else if (event.name == "lose") {
        if (event.type != "discard" || event.player == source || event.player.isDead()) {
          return false;
        }
        if ((event.discarder || event.getParent(2).player) == event.player) {
          return false;
        }
        if (!event.getl(event.player).hs.length) {
          return false;
        }
        return true;
      } else if (event.name == "gain") {
        if (event.giver || event.getParent().name == "gift") {
          return false;
        }
        let cards2 = event.getg(event.player);
        if (!cards2.length) {
          return false;
        }
        return game.hasPlayer(function(current) {
          if (current == event.player || current == source) {
            return false;
          }
          let hs = event.getl(current).hs;
          for (const i of hs) {
            if (cards2.includes(i)) {
              return true;
            }
          }
          return false;
        });
      } else if (event.type == "gain") {
        if (event.giver || !event.player || event.player == source || event.player.isDead()) {
          return false;
        }
        let hs = event.getl(event.player);
        return game.hasPlayer(function(current) {
          if (current == event.player) {
            return false;
          }
          let cards2 = event.getg(current);
          for (const i of cards2) {
            if (hs.includes(i)) {
              return true;
            }
          }
        });
      } else if (event.type == "discard") {
        if (!event.discarder) {
          return false;
        }
        return game.hasPlayer((current) => {
          return current != source && current != event.discarder && event.getl(current).hs.length > 0;
        });
      }
      return false;
    },
    filter(event, player, triggername, target) {
      return target.isIn();
    },
    getIndex(trigger, player, triggername) {
      if (!lib.skill.nagisa_fuxin.filterx(trigger, player)) {
        return false;
      }
      const targets = [], source = _status.currentPhase;
      if (trigger.name == "gain") {
        const cards2 = trigger.getg(trigger.player);
        targets.addArray(
          game.filterPlayer(function(current) {
            if (current === trigger.player || current === source) {
              return false;
            }
            const hs = trigger.getl(current).hs;
            for (const i of hs) {
              if (cards2.includes(i)) {
                return true;
              }
            }
            return false;
          })
        );
      } else if (trigger.name == "loseAsync" && trigger.type == "discard") {
        targets.addArray(
          game.filterPlayer((current) => {
            return current != trigger.discarder && current != source && trigger.getl(current).hs.length > 0;
          })
        );
      } else {
        targets.push(trigger.player);
      }
      targets.sortBySeat();
      return targets;
    },
    logTarget: (event, player, triggername, target) => target,
    check(event, player, triggername, target) {
      const source = _status.currentPhase;
      if (source && source.isIn() && get.attitude(player, source) > 0) {
        return false;
      }
      return get.attitude(player, target) > 0;
    },
    async content(event, trigger, player) {
      const target = event.indexedData;
      const result = await target.judge().forResult();
      switch (result.color) {
        case "red":
          await target.draw();
          break;
        case "black": {
          const source = _status.currentPhase;
          if (source && source.isIn() && source.countCards("h") > 0) {
            source.chooseToDiscard("he", true);
          }
          break;
        }
      }
    },
    ai: { expose: 0.2 }
  },
  //冈崎朋也
  tomoya_shangxian: {
    trigger: { player: "phaseUseBegin" },
    mark: true,
    locked: true,
    intro: {
      content(s) {
        return "计算与其他角色的距离时始终从" + (s ? "顺" : "逆") + "时针计算";
      }
    },
    async content(event, trigger, player) {
      await player.draw();
      player.storage.tomoya_shangxian = !player.storage.tomoya_shangxian;
    },
    ai: {
      left_hand: true,
      right_hand: true,
      skillTagFilter(player, tag) {
        return Boolean(player.storage.tomoya_shangxian) === Boolean(tag === "left_hand");
      }
    }
  },
  tomoya_wangjin: {
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      return player != event.player && !player.hasSkill("tomoya_wangjin_" + player.inRange(event.player));
    },
    logTarget: "player",
    check(event, player) {
      let target = event.player;
      let bool = player.inRange(target);
      if (!bool) {
        if (target.hp > player.hp) {
          return get.effect(target, { name: "sha", isCard: true }, player, player) > 0;
        }
        let temp2 = target;
        while (true) {
          temp2 = temp2.getNext();
          if (temp2 == target || temp2 == _status.roundStart) {
            return true;
          }
          if (temp2 == player) {
            continue;
          }
          if (temp2.hp > player.hp && !player.inRange(temp2) && get.effect(temp2, { name: "sha", isCard: true }, player, player) > 0) {
            return false;
          }
        }
      }
      if (get.attitude(player, target) < 2) {
        return false;
      }
      if (target.hp < player.hp && !target.hasSkillTag("nogain")) {
        return true;
      }
      let temp = target;
      while (true) {
        temp = temp.getNext();
        if (temp == target || temp == _status.roundStart) {
          return true;
        }
        if (temp == player) {
          continue;
        }
        if (temp.hp < player.hp && player.inRange(temp) && get.attitude(player, target) >= 2 && !temp.hasSkillTag("nogain")) {
          return false;
        }
      }
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      const bool = player.inRange(target);
      player.addTempSkill("tomoya_wangjin_" + bool, "roundStart");
      if (bool) {
        await target.draw();
      } else {
        await player.draw(2);
      }
      if (bool) {
        if (target.hp < player.hp) {
          await player.draw();
        } else {
          return;
        }
      } else {
        if (player.countDiscardableCards(target, "h") > 0) {
          await target.discardPlayerCard(player, "h", true);
        } else {
          return;
        }
      }
      if (bool) {
        const result = await player.chooseCard("h", "是否交给" + get.translation(target) + "一张牌？").forResult();
        if (result.bool) {
          player.give(result.cards, target);
        }
        return;
      }
      if (player.hp >= target.hp) {
        return;
      }
      const card = { name: "sha", isCard: true };
      if (player.canUse(card, target, false)) {
        await player.useCard(card, target, false);
      }
    },
    subSkill: {
      true: { charlotte: true },
      false: { charlotte: true }
    },
    ai: { expose: 0.2 }
  },
  //野田
  noda_fengcheng: {
    audio: 2,
    trigger: {
      player: "gainAfter"
    },
    forced: true,
    filter(event, player) {
      return get.itemtype(event.source) == "player" && event.bySelf != true;
    },
    check(event, player) {
      return get.attitude(player, event.source) > 0;
    },
    logTarget: "source",
    async content(event, trigger, player) {
      await trigger.source.draw();
    },
    ai: {
      combo: "noda_xunxin",
      halfneg: true
    }
  },
  noda_xunxin: {
    audio: 2,
    enable: "phaseUse",
    usable(skill, player) {
      return player.hp;
    },
    filter(event, player) {
      return game.hasPlayer((target) => lib.skill.noda_xunxin.filterTarget(null, player, target));
    },
    viewAs: {
      name: "juedou",
      isCard: true
    },
    filterTarget(card, player, target) {
      if (target.hp < player.hp) {
        return false;
      }
      return player.canUse({ name: "juedou" }, target);
    },
    selectCard: -1,
    filterCard: () => false,
    group: "noda_xunxin2"
  },
  noda_xunxin2: {
    trigger: { player: "juedouAfter" },
    popup: false,
    forced: true,
    filter(event, player) {
      if (event.target.isDead()) {
        return false;
      }
      return event.turn && event.turn.countCards("he") > 0;
    },
    async content(event, trigger, player) {
      const giver = trigger.turn;
      const gainner = giver == player ? trigger.target : player;
      const result = await giver.chooseCard("he", true, "交给" + get.translation(gainner) + "一张牌").forResult();
      await giver.give(result.cards, gainner);
    }
  },
  //日向秀树
  hinata_qiulve: {
    audio: 2,
    enable: ["chooseToUse", "chooseToRespond"],
    viewAsFilter(player) {
      return player.countCards("hes", (card) => {
        return get.type(card) != "basic";
      }) > 0;
    },
    viewAs: { name: "sha" },
    filterCard(card, player) {
      return get.type(card) != "basic";
    },
    locked: false,
    position: "hes",
    check(card) {
      let val = get.value(card);
      if (val >= 6) {
        return 0;
      }
      if (get.color(card) == "black") {
        return 12 - val;
      }
      return 6 - val;
    },
    mod: {
      targetInRange(card, player, target) {
        if (_status.event.skill == "hinata_qiulve") {
          return true;
        }
      }
    },
    group: "hinata_qiulve_clear",
    ai: {
      respondSha: true,
      skillTagFilter(player) {
        return player.countCards("hes", (card) => {
          return get.type(card) != "basic";
        }) > 0;
      }
    }
  },
  hinata_qiulve_clear: {
    trigger: { player: "useCard1" },
    firstDo: true,
    silent: true,
    filter(event, player) {
      return event.skill == "hinata_qiulve";
    },
    async content(event, trigger, player) {
      if (get.color(trigger.card) == "red") {
        trigger.directHit.addArray(game.players);
      } else if (trigger.addCount !== false) {
        trigger.addCount = false;
        const stat = player.getStat().card;
        const name = trigger.card.name;
        if (typeof stat[name] == "number") {
          stat[name]--;
        }
      }
    }
  },
  hinata_ehou: {
    audio: 2,
    trigger: { global: "useCardAfter" },
    //这个也是chooseToUse 改不了
    direct: true,
    filter(event, player) {
      return player != event.player && event.targets && event.targets.includes(player) && (_status.connectMode || player.hasSha());
    },
    clearTime: true,
    async content(event, trigger, player) {
      const result = await player.chooseToUse({
        logSkill: "hinata_ehou",
        preTarget: trigger.player,
        prompt: "是否发动【扼喉】，对" + get.translation(trigger.player) + "使用一张【杀】？",
        filterCard(card, player2) {
          return get.name(card) == "sha" && lib.filter.filterCard.apply(this, arguments);
        },
        filterTarget(card, player2, target) {
          return target == _status.event.preTarget && lib.filter.filterTarget.apply(this, arguments);
        },
        addCount: false
      }).forResult();
      if (result.bool && player.getHistory("sourceDamage", function(evt) {
        return evt.getParent(4) == event;
      }).length) {
        await player.draw();
      }
    }
  },
  //高桥久子
  hisako_yinbao: {
    audio: 2,
    trigger: { player: ["damageEnd", "recoverAfter"] },
    async content(event, trigger, player) {
      const judgeResult = await player.judge(function(card) {
        return get.suit(card) == "spade" ? 2 : -2;
      }).set("judge2", (result2) => result2.bool).forResult();
      if (!judgeResult.bool || !game.hasPlayer((current) => current != player)) {
        return;
      }
      const result = await player.chooseTarget(lib.filter.notMe, true, "选择一名其他角色，对其造成1点雷属性伤害").set("ai", (target2) => {
        let player2 = _status.event.player;
        return get.damageEffect(target2, player2, player2, "thunder");
      }).forResult();
      if (!result.bool || !result.targets || !result.targets.length) {
        return;
      }
      const target = result.targets[0];
      player.addExpose(0.2);
      player.line(target, "thunder");
      await target.damage("thunder");
    }
  },
  hisako_zhuanyun: {
    trigger: { player: "judgeBegin" },
    forced: true,
    charlotte: true,
    silent: true,
    filter(event, player) {
      return !event.directresult;
    },
    async content(event, trigger, player) {
      let tempcard = false;
      let temp = -Infinity;
      for (let i = 0; i < ui.cardPile.childElementCount; i++) {
        const card = ui.cardPile.childNodes[i];
        const temp2 = trigger.judge(card);
        if (temp2 > temp) {
          tempcard = card;
          temp = temp2;
        }
      }
      if (tempcard) {
        trigger.directresult = tempcard;
      }
    },
    ai: { luckyStar: true }
  },
  //直枝理树
  riki_spwenji: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => {
        return current != player && current.countCards("he");
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), function(card, player2, target) {
        return target != player2 && target.countCards("he");
      }).set("ai", (target) => {
        let att = get.attitude(_status.event.player, target);
        if (att > 0) {
          return Math.sqrt(att) / 10;
        }
        return 5 - att;
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const result = await target.chooseCard("he", true, "问计：将一张牌交给" + get.translation(player)).forResult();
      if (result.bool) {
        player.addTempSkill("riki_spwenji_respond");
        player.storage.riki_spwenji_respond = get.type2(result.cards[0], target);
        await target.give(result.cards, player, true);
      }
    },
    ai: { expose: 0.2 },
    subSkill: {
      respond: {
        onremove: true,
        trigger: { player: "useCard" },
        forced: true,
        charlotte: true,
        audio: "riki_spwenji",
        filter(event, player) {
          return get.type2(event.card) == player.storage.riki_spwenji_respond;
        },
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.players);
        },
        ai: {
          directHit_ai: true,
          skillTagFilter(player, tag, arg) {
            return get.type2(arg.card) == player.storage.riki_spwenji_respond;
          }
        }
      }
    }
  },
  riki_nvzhuang: {
    init(player) {
      if (get.character(player.name1, 3).includes("riki_nvzhuang")) {
        player.storage.riki_nvzhuang = player.sex;
        if (player.sex === "male") {
          player.sex = "double";
        } else {
          player.sex = "female";
        }
      }
    },
    onremove(player) {
      if (player.storage.riki_nvzhuang) {
        player.sex = player.storage.riki_nvzhuang;
      }
    },
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    async content(event, trigger, player) {
      await player.draw(player.countCards("h") == 0 ? 2 : 1);
    }
  },
  riki_mengzhong: {
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    derivation: "riki_chongzhen",
    juexingji: true,
    skillAnimation: true,
    animationColor: "key",
    filter(event, player) {
      let num = 0;
      player.getAllHistory("gain", function(evt) {
        if (evt.getParent().name == "riki_spwenji") {
          num += evt.cards.length;
        }
      });
      return num >= 3;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.removeSkills("riki_spwenji");
      await player.gainMaxHp();
      await player.recover();
      await player.addSkills("riki_chongzhen");
    },
    ai: { combo: "riki_spwenji" }
  },
  riki_chongzhen: {
    trigger: {
      player: "phaseUseBegin"
    },
    filter(event, player) {
      return game.hasPlayer((current) => player.canCompare(current));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), function(card, player2, target) {
        return player2.canCompare(target);
      }).set("ai", (target) => {
        return -get.attitude(player, target) * (1 + target.countCards("e")) / (1 + target.countCards("j"));
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const result = await player.chooseToCompare(target).forResult();
      if (result.bool) {
        let num = 0;
        if (target.countCards("h")) {
          num++;
        }
        if (target.countCards("e")) {
          num++;
        }
        if (target.countCards("j")) {
          num++;
        }
        if (num) {
          await player.gainPlayerCard(target, num, "hej", true).set("filterButton", (button) => {
            for (const btn of ui.selected.buttons) {
              if (get.position(button.link) == get.position(btn.link)) {
                return false;
              }
            }
            return true;
          });
        }
      } else {
        player.addTempSkill("zishou2", "phaseUseAfter");
      }
    },
    ai: { expose: 0.2 }
  },
  //来谷唯湖
  yuiko_fenglun: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h") > 0 && game.hasPlayer((current) => {
        return player.canCompare(current);
      });
    },
    filterTarget(card, player, target) {
      return player.canCompare(target);
    },
    async content(event, trigger, player) {
      const { target } = event;
      const result = await player.chooseToCompare(target).forResult();
      if (result.bool) {
        player.addTempSkill("yuiko_fenglun2", "phaseUseEnd");
      }
    },
    ai: {
      order: 10,
      result: { target: -1 }
    }
  },
  yuiko_fenglun2: {
    mod: {
      cardUsable() {
        return Infinity;
      },
      targetInRange() {
        return true;
      }
    }
  },
  yuiko_dilve: {
    enable: "chooseCard",
    check() {
      return 20;
    },
    filter(event) {
      return event.type == "compare" && !event.directresult;
    },
    onCompare(player) {
      return game.cardsGotoOrdering(get.bottomCards()).cards;
    },
    group: "yuiko_dilve_gain",
    subSkill: {
      gain: {
        trigger: {
          player: ["chooseToCompareAfter", "compareMultipleAfter"],
          target: ["chooseToCompareAfter", "compareMultipleAfter"]
        },
        filter(event, player) {
          if (event.preserve) {
            return false;
          }
          return [event.card1, event.card2].filterInD("od").length > 0;
        },
        prompt2(event, player) {
          return "获得" + get.translation([event.card1, event.card2].filterInD("od"));
        },
        async content(event, trigger, player) {
          await player.gain([trigger.card1, trigger.card2].filterInD("od"), "gain2", "log");
        }
      }
    }
  },
  //多鲁基
  doruji_feiqu: {
    trigger: {
      player: "useCard",
      target: "useCardToTargeted"
    },
    forced: true,
    filter(event, player) {
      return event.card.name == "sha";
    },
    async content(event, trigger, player) {
      if (trigger.name == "useCard") {
        trigger.directHit.addArray(game.players);
      } else {
        trigger.directHit.add(player);
      }
    },
    ai: {
      halfneg: true,
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        return arg.card.name == "sha";
      }
    },
    global: "doruji_feiqu_ai"
  },
  doruji_feiqu_ai: {
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        return arg.card.name == "sha" && (arg.target.hasSkill("doruji_feiqu") || arg.target.hasSkill("godan_feiqu"));
      }
    }
  },
  //千里朱音
  akane_jugu: {
    audio: 2,
    mod: {
      maxHandcard(player, num) {
        return num + player.maxHp;
      }
    },
    trigger: { global: "phaseBefore", player: "enterGame" },
    forced: true,
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      await player.draw(player.maxHp);
    }
  },
  akane_quanqing: {
    enable: "phaseUse",
    filterCard: true,
    filterTarget(card, player, target) {
      return target != player && player.inRange(target);
    },
    position: "he",
    check(card) {
      let val = get.value(card);
      let num = card.number;
      if (num > 10) {
        return 8 - val;
      }
      let player = _status.event.player;
      if (player.getUseValue(card, null, true) > player.getUseValue({ name: "guohe" })) {
        return 0;
      }
      if (num > 6) {
        return 6 - val;
      }
      return 3 - val;
    },
    async content(event, trigger, player) {
      const { target, cards: cards2 } = event;
      const num = cards2[0].number;
      const trans = get.translation(target);
      const list = ["令" + trans + "摸一张牌"];
      let addIndex = 0;
      if (num > 6) {
        if (target.countDiscardableCards(player, "hej") > 0) {
          list.push("弃置" + trans + "区域内的一张牌");
        } else {
          addIndex++;
        }
      }
      if (num > 10) {
        list.push("对" + trans + "造成1点伤害");
      }
      let result;
      if (list.length == 1) {
        result = { index: 0 };
      } else {
        result = await player.chooseControl().set("choiceList", list).set("index", list.length - 1).set("ai", () => _status.event.index).forResult();
      }
      let index = result.index;
      if (index > 0) {
        index += addIndex;
      }
      switch (index) {
        case 0:
          await target.draw();
          break;
        case 1:
          await player.discardPlayerCard(target, "hej", true);
          break;
        case 2:
          await target.damage("nocard");
          break;
      }
    },
    ai: {
      order: 4,
      result: {
        target(player, target) {
          let card = ui.selected.cards[0];
          if (card) {
            if (card.number > 10) {
              return get.damageEffect(target, player, target);
            }
            if (card.number > 6) {
              return lib.card.guohe.ai.result.target.apply(this, arguments);
            }
            return 1;
          }
        }
      }
    }
  },
  akane_yifu: {
    global: "akane_yifu2",
    zhuSkill: true
  },
  akane_yifu2: {
    audio: 2,
    enable: "phaseUse",
    discard: false,
    line: true,
    log: false,
    delay: false,
    lose: false,
    prepare(cards2, player, targets) {
      targets[0].logSkill("akane_yifu");
    },
    prompt() {
      let player = _status.event.player;
      let list = game.filterPlayer((target) => {
        return target != player && target.hasZhuSkill("akane_yifu", player);
      });
      let str = "将一张手牌交给" + get.translation(list);
      if (list.length > 1) {
        str += "中的一人";
      }
      return str;
    },
    filter(event, player) {
      if (player.group != "key") {
        return false;
      }
      if (player.countCards("h") == 0) {
        return 0;
      }
      return game.hasPlayer((target) => {
        return target != player && target.hasZhuSkill("akane_yifu", player) && !target.hasSkill("akane_yifu3");
      });
    },
    filterCard: true,
    filterTarget(card, player, target) {
      return target != player && target.hasZhuSkill("akane_yifu", player) && !target.hasSkill("akane_yifu3");
    },
    async content(event, trigger, player) {
      const { target, cards: cards2 } = event;
      await player.give(cards2, target);
      target.addTempSkill("akane_yifu3", "phaseUseEnd");
      await target.draw();
      if (target.countCards("h") < 1) {
        return;
      }
      const result = await target.chooseCard("h", true, "交给" + get.translation(player) + "一张牌").set("ai", (card) => {
        return 14 - get.value(card);
      }).forResult();
      if (result.bool) {
        await target.give(result.cards, player);
      }
    },
    ai: {
      expose: 0.3,
      order: 10,
      result: {
        target: 5
      }
    }
  },
  akane_yifu3: { charlotte: true },
  //笹濑川佐佐美
  sasami_miaobian: {
    derivation: ["sasami_gongqing", "sasami_funan", "sasami_baoqiu"],
    init2(player) {
      if (player.hp <= 3) {
        player.addSkill("sasami_gongqing");
      }
      if (player.hp <= 2) {
        player.addSkill("sasami_funan");
      }
      if (player.hp <= 1) {
        player.addSkill("sasami_baoqiu");
      }
    },
    trigger: { player: "changeHp" },
    filter(event, player) {
      return event.changedHp !== 0;
    },
    firstDo: true,
    silent: true,
    async content(event, trigger, player) {
      lib.skill.sasami_miaobian.init2(player);
    }
  },
  sasami_baoqiu: {
    line: { color: [173, 149, 206] },
    inherit: "rin_baoqiu"
  },
  sasami_gongqing: {
    audio: true,
    trigger: {
      player: ["damageBegin3", "damageBegin4"]
    },
    forced: true,
    filter(event, player, name) {
      if (!event.source) {
        return false;
      }
      let range = event.source.getAttackRange();
      if (name == "damageBegin3") {
        return range > 3;
      }
      return event.num > 1 && range < 3;
    },
    async content(event, trigger, player) {
      trigger.num = event.triggername == "damageBegin4" ? 1 : trigger.num + 1;
    },
    ai: {
      filterDamage: true,
      skillTagFilter(player, tag, arg) {
        if (arg && arg.player) {
          if (arg.player.hasSkillTag("jueqing", false, player)) {
            return false;
          }
          if (arg.player.getAttackRange() < 3) {
            return true;
          }
        }
        return false;
      }
    }
  },
  sasami_funan: {
    audio: 2,
    trigger: { global: ["respond", "useCard"] },
    line: { color: [173, 149, 206] },
    filter(event, player) {
      if (!event.respondTo) {
        return false;
      }
      if (event.player == player) {
        return false;
      }
      if (player != event.respondTo[0]) {
        return false;
      }
      if (!player.hasSkill("sasami_funan_jiexun")) {
        let cards2 = [];
        if (get.itemtype(event.respondTo[1]) == "card") {
          cards2.push(event.respondTo[1]);
        } else if (event.respondTo[1].cards) {
          cards2.addArray(event.respondTo[1].cards);
        }
        return cards2.filterInD("od").length > 0;
      } else {
        return event.cards.filterInD("od").length > 0;
      }
    },
    check(event, player) {
      if (player.hasSkill("sasami_funan_jiexun") || get.attitude(player, event.player) > 0) {
        return true;
      }
      let cards2 = [];
      if (get.itemtype(event.respondTo[1]) == "card") {
        cards2.push(event.respondTo[1]);
      } else if (event.respondTo[1].cards) {
        cards2.addArray(event.respondTo[1].cards);
      }
      return event.cards.filterInD("od").reduce((acc, card) => {
        return acc + get.value(card);
      }, 0) - cards2.filterInD("od").reduce((acc, card) => {
        return acc + get.value(card);
      });
    },
    logTarget: "player",
    async content(event, trigger, player) {
      if (!player.hasSkill("sasami_funan_jiexun")) {
        const cards1 = [];
        if (get.itemtype(trigger.respondTo[1]) == "card") {
          cards1.push(trigger.respondTo[1]);
        } else if (trigger.respondTo[1].cards) {
          cards1.addArray(trigger.respondTo[1].cards);
        }
        const filtered1 = cards1.filterInD("od");
        if (filtered1.length) {
          const next = trigger.player.gain(filtered1, "gain2", "log");
          next.gaintag.add("sasami_funan");
          await next;
        }
        trigger.player.addTempSkill("sasami_funan_use");
      }
      const cards2 = trigger.cards.filterInD("od");
      if (cards2.length) {
        await player.gain(cards2, "log", "gain2");
      }
    },
    subSkill: {
      use: {
        onremove(player) {
          player.removeGaintag("sasami_funan");
        },
        charlotte: true,
        mod: {
          cardEnabled2(card, player) {
            if (get.itemtype(card) == "card" && card.hasGaintag("sasami_funan")) {
              return false;
            }
          }
        }
      }
    }
  },
  //枣铃
  rin_baoqiu: {
    mod: {
      attackRange(rin, ball) {
        return ball + 2;
      }
    },
    trigger: { player: "useCardToPlayered" },
    forced: true,
    logTarget: "target",
    filter(event, player) {
      return event.card.name == "sha";
    },
    line: { color: [194, 117, 92] },
    async content(event, trigger, player) {
      const result = await player.judge(function() {
        return 0;
      }).forResult();
      const target = trigger.target;
      const map = trigger.customArgs;
      const id = target.playerid;
      if (!map[id]) {
        map[id] = {};
      }
      if (result.color == "red") {
        if (!map[id].extraDamage) {
          map[id].extraDamage = 0;
        }
        map[id].extraDamage++;
      }
      if (result.color == "black") {
        trigger.directHit.add(target);
      }
      if (result.suit == "spade" || result.suit == "heart") {
        const evt = trigger.getParent();
        if (evt.addCount !== false) {
          evt.addCount = false;
          const stat = player.getStat().card, name = trigger.card.name;
          if (typeof stat[name] == "number") {
            stat[name]--;
          }
        }
        await player.draw();
      }
      if (result.suit == "diamond" || result.suit == "club") {
        target.addTempSkill("fengyin");
        if (target.countDiscardableCards(player, "he") > 0) {
          await player.discardPlayerCard(target, "he", true);
        }
      }
    }
  },
  //春原阳平&春原芽衣
  sunohara_chengshuang: {
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    group: "sunohara_chengshuang_phase",
    forced: true,
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      const evt = event.getParent("phase");
      if (evt && evt.player == player) {
        evt.sunohara_chengshuang = true;
      }
      const result = await player.chooseControl("male", "female").set("prompt", "成双：请选择自己的性别").forResult();
      const sex = result.control;
      game.broadcastAll(
        (player2, sex2) => {
          player2.sex = sex2;
          if (player2.marks && player2.marks.sunohara_chengshuang) {
            player2.marks.sunohara_chengshuang.firstChild.innerHTML = sex2 == "male" ? "♂" : "♀";
          }
        },
        player,
        sex
      );
      game.log(player, "将性别变更为", "#g" + get.translation(sex) + "性");
    },
    mark: true,
    intro: {
      content(storage, player) {
        if (player.sex == "unknown" || player.sex == "double") {
          return "当前性别未确定";
        }
        return "当前性别：" + get.translation(player.sex);
      }
    },
    ai: {
      combo: "sunohara_jianren"
    }
  },
  sunohara_chengshuang_phase: {
    trigger: {
      player: "phaseBegin"
    },
    filter(event, player) {
      if (event.sunohara_chengshuang) {
        return false;
      }
      return game.phaseNumber > 1;
    },
    prompt2(event, player) {
      if (player.sex == "unknown" || player.sex == "double") {
        return "选择自己的性别";
      }
      return "将自己的性别变更为" + (player.sex == "male" ? "女性" : "男性");
    },
    async content(event, trigger, player) {
      let sex;
      if (player.sex == "unknown" || player.sex == "double") {
        const result = await player.chooseControl("male", "female").set("prompt", "成双：请选择自己的性别").forResult();
        sex = result.control;
      } else {
        sex = player.sex == "male" ? "female" : "male";
      }
      game.broadcastAll(
        (player2, sex2) => {
          player2.sex = sex2;
          if (player2.marks && player2.marks.sunohara_chengshuang) {
            player2.marks.sunohara_chengshuang.firstChild.innerHTML = sex2 == "male" ? "♂" : "♀";
          }
        },
        player,
        sex
      );
      game.log(player, "将性别变更为", "#g" + get.translation(sex) + "性");
    }
  },
  sunohara_tiaoyin: {
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target != player && target.countGainableCards(player, "hej") > 0;
    },
    selectCard: [1, 4],
    filterCard(card) {
      for (let i = 0; i < ui.selected.cards.length; i++) {
        if (get.suit(ui.selected.cards[i]) == get.suit(card)) {
          return false;
        }
      }
      return true;
    },
    complexSelect: true,
    complexCard: true,
    complexTarget: true,
    selectTarget() {
      return [ui.selected.cards.length, ui.selected.cards.length];
    },
    line: { color: [239, 204, 96] },
    async content(event, trigger, player) {
      const { target } = event;
      if (target.countGainableCards(player, "hej") <= 0) {
        return;
      }
      await player.gainPlayerCard(target, "hej", "visible");
    },
    async contentAfter(event, trigger, player) {
      const { targets } = event;
      for (const target of targets) {
        if (target.differentSexFrom(player)) {
          await player.loseHp();
          return;
        }
      }
    },
    ai: {
      order: 6,
      result: {
        target(player, target) {
          return lib.card.shunshou.ai.result.target.apply(this, arguments);
        },
        player(player, target) {
          if (target.sameSexAs(player)) {
            return 0;
          }
          for (let i = 0; i < ui.selected.targets.length; i++) {
            if (ui.selected.targets[i].differentSexFrom(player)) {
              return 0;
            }
          }
          return get.attitude(player, target) < 0 && target.countCards("h", "tao") > 0 ? 1 : -2;
        }
      }
    }
  },
  sunohara_jianren: {
    trigger: { player: "damageEnd" },
    line: { color: [145, 149, 179] },
    async cost(event, trigger, player) {
      const num = !trigger.source || trigger.source.isDead() || trigger.source.differentSexFrom(player) ? 3 : 1;
      event.result = await player.chooseTarget(get.prompt(event.skill), "令一名角色摸" + get.cnNumber(num) + "张牌。").set("ai", (target) => {
        const player2 = get.player();
        const att = get.attitude(player2, target);
        if (att <= 0) {
          return 0;
        }
        if (target.hasSkillTag("nogain") && target != _status.currentPhase) {
          return 0.1;
        }
        return att / (1 + 0.1 * target.countCards("h"));
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const num = !trigger.source || trigger.source.isDead() || trigger.source.differentSexFrom(player) ? 3 : 1;
      target.draw(num);
    }
  },
  //椎名
  shiina_qingshen: {
    audio: 1,
    trigger: {
      player: "damageEnd",
      source: "damageSource"
    },
    filter(event, player) {
      return event.cards && event.cards.filterInD().length > 0;
    },
    frequent: true,
    async content(event, trigger, player) {
      const cards2 = trigger.cards.filterInD("od");
      await player.gain(cards2, "gain2", "log");
      const count = cards2.length;
      const heCards = player.getCards("he");
      if (heCards.length === 0) {
        event.finish();
        return;
      }
      let result;
      if (heCards.length <= count) {
        result = { bool: true, cards: heCards };
      } else {
        result = await player.chooseCard(true, "he", count, "请选择要置于武将牌上的牌").forResult();
      }
      if (result.bool && result.cards.length) {
        player.addToExpansion(result.cards, player, "give").gaintag.add("shiina_qingshen");
      }
    },
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    mod: {
      attackRange(from, num) {
        return num + from.getExpansions("shiina_qingshen").length;
      },
      maxHandcard(from, num) {
        return num + from.getExpansions("shiina_qingshen").length;
      }
    },
    ai: {
      notemp: true
    }
  },
  shiina_feiyan: {
    audio: 1,
    animalList: ["key_inari", "key_doruji"],
    trigger: { global: "phaseBegin" },
    filter(event, player) {
      if (lib.skill.shiina_feiyan.animalList.includes(event.player.name)) {
        return false;
      }
      return player.getExpansions("shiina_qingshen").length > 0 && player.inRange(event.player);
    },
    async cost(event, trigger, player) {
      const result = await player.chooseButton([get.prompt(event.skill, trigger.player), player.getExpansions("shiina_qingshen")]).set("goon", get.attitude(player, trigger.player) < 0 ? 1 : -1).set("ai", () => {
        return _status.event.goon;
      }).forResult();
      if (result.bool) {
        event.result = {
          bool: true,
          cards: result.links
        };
      }
    },
    logTarget: "player",
    async content(event, trigger, player) {
      await player.loseToDiscardpile(event.cards);
      const cardToUse = { name: "sha", isCard: true };
      if (lib.filter.targetEnabled(cardToUse, player, trigger.player)) {
        const { card } = await player.useCard(cardToUse, trigger.player);
        if (!player.hasHistory("sourceDamage", function(evt) {
          return evt.card === card;
        })) {
          await player.draw();
        }
      }
    },
    group: "shiina_retieji",
    ai: {
      combo: "shiina_qingshen"
    }
  },
  shiina_retieji: {
    audio: 1,
    trigger: { player: "useCardToPlayered" },
    check(event, player) {
      return get.attitude(player, event.target) < 0;
    },
    filter(event, player) {
      return event.card.name == "sha" && event.getParent(2).name == "shiina_feiyan";
    },
    logTarget: "target",
    async content(event, trigger, player) {
      const result = await player.judge(() => 0).forResult();
      if (!trigger.target.hasSkill("fengyin")) {
        trigger.target.addTempSkill("fengyin");
      }
      const suit = get.suit(result.card);
      const target = trigger.target;
      const num = target.countCards("h", "shan");
      const discardResult = await target.chooseToDiscard("请弃置一张" + get.translation(suit) + "牌，否则不能使用闪抵消此杀", "he", (card) => get.suit(card) == _status.event.suit).set("ai", (card) => {
        const num2 = _status.event.num;
        if (num2 == 0) {
          return 0;
        }
        if (card.name == "shan") {
          return num2 > 1 ? 2 : 0;
        }
        return 8 - get.value(card);
      }).set("num", num).set("suit", suit).forResult();
      if (!discardResult.bool) {
        trigger.getParent().directHit.add(trigger.target);
      }
    }
  },
  //稻荷
  inari_baiwei: {
    enable: ["chooseToUse", "chooseToRespond"],
    hiddenCard(player, name) {
      return name != "du" && get.type(name) == "basic" && player.countCards("hes", { suit: "diamond" }) > 0;
    },
    filter(event, player) {
      if (event.type == "wuxie" || !player.countCards("hse", { suit: "diamond" })) {
        return false;
      }
      for (let i = 0; i < lib.inpile.length; i++) {
        let name = lib.inpile[i];
        if (name != "du" && get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
          return true;
        }
      }
      return false;
    },
    chooseButton: {
      dialog(event, player) {
        let list = [];
        for (let i = 0; i < lib.inpile.length; i++) {
          let name = lib.inpile[i];
          if (name == "du") {
            continue;
          }
          if (name == "sha") {
            list.push(["基本", "", "sha"]);
            for (const j of lib.inpile_nature) {
              list.push(["基本", "", name, j]);
            }
          } else if (get.type(name) == "basic") {
            list.push(["基本", "", name]);
          }
        }
        return ui.create.dialog("摆尾", [list, "vcard"], "hidden");
      },
      filter(button, player) {
        return _status.event.getParent().filterCard(get.autoViewAs({ name: button.link[2] }, "unsure"), player, _status.event.getParent());
      },
      check(button) {
        if (_status.event.getParent().type == "phase") {
          let player = _status.event.player;
          let fakecard = {
            name: button.link[2],
            nature: button.link[3]
          };
          if (player.getUseValue(fakecard) > 0) {
            return get.order(fakecard);
          }
          return 0;
        }
        return 1;
      },
      backup(links, player) {
        return {
          selectCard: 1,
          filterCard: { suit: "diamond" },
          popname: true,
          check(card) {
            if (get.type(card) == "basic") {
              return 6;
            }
            return 1 / Math.max(0.1, get.value(card));
          },
          position: "hse",
          viewAs: { name: links[0][2], nature: links[0][3] }
        };
      },
      prompt(links, player) {
        return "将一张♦牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用或打出";
      }
    },
    ai: {
      order(item, player) {
        if (player && _status.event.type == "phase") {
          let max = 0;
          for (let i = 0; i < lib.inpile.length; i++) {
            let name = lib.inpile[i];
            if (get.type(name) == "basic" && player.getUseValue({ name }) > 0) {
              let temp = get.order({ name });
              if (temp > max) {
                max = temp;
              }
            }
          }
          if (max > 0) {
            max += 0.5;
          }
          return max;
        }
        return 4;
      },
      result: {
        player: 1
      },
      respondSha: true,
      fireAttack: true,
      skillTagFilter(player, tag) {
        return tag == "fireAttack" || player.countCards("he", { suit: "diamond" }) > 0;
      }
    },
    group: ["inari_baiwei_draw"]
  },
  inari_baiwei_draw: {
    trigger: { player: ["useCardAfter", "respondAfter"] },
    forced: true,
    popup: false,
    filter(event, player) {
      return event.skill && event.skill.indexOf("inari_baiwei") == 0;
    },
    async content(event, trigger, player) {
      await player.draw();
    }
  },
  inari_huhun: {
    mod: {
      suit(card, suit) {
        if (suit == "club") {
          return "diamond";
        }
      },
      maxHandcard(player, num) {
        return num + 1;
      }
    }
  },
  //朱鹭户沙耶
  saya_powei: {
    audio: 2,
    trigger: { player: "phaseAfter" },
    limited: true,
    locked: false,
    skillAnimation: true,
    animationColor: "metal",
    filter(event, player) {
      return event.type != "saya_powei" && game.hasPlayer((current) => {
        return current.hp > player.hp;
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), function(card, saya, kyousuke) {
        return kyousuke.hp > saya.hp;
      }).set("ai", (target) => {
        let player2 = _status.event.player;
        let att = get.attitude(player2, target);
        if (att >= -2) {
          return 0;
        }
        if (target != get.zhu(target) && player2.hasUnknown()) {
          return 0;
        }
        if (target.getEquip(3) && !player2.getEquip(4)) {
          att /= 2;
        }
        if (player2.hp <= 1) {
          att *= 1.5;
        }
        return -att;
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.awakenSkill(event.name);
      await game.delay(3);
      let next = game.createEvent("saya_powei_loop", false, trigger);
      next.playertrue = player;
      next.playerfalse = target;
      next.setContent(lib.skill.saya_powei.content2);
    },
    async content2(event, trigger, player) {
      let count = 0;
      let stat = true;
      let current = event["player" + stat];
      game.countPlayer2((current2) => {
        if (current2 != event.playertrue && current2 != event.playerfalse) {
          current2.addSkill("saya_nodis");
        }
      });
      event.playertrue.addSkill("saya_judge");
      while (true) {
        count++;
        await current.phase().set("type", "saya_powei");
        if (count == 9 || event.playertrue.isDead() || event.playerfalse.isDead()) {
          game.countPlayer2((current2) => {
            current2.removeSkill("saya_nodis");
            current2.removeSkill("saya_judge");
          });
          break;
        }
        stat = !stat;
        current = event["player" + stat];
      }
    }
  },
  saya_nodis: {
    group: "undist",
    mark: true,
    intro: { content: "不计入距离和座次的计算" }
  },
  saya_judge: {
    trigger: { player: "phaseBegin" },
    forced: true,
    popup: false,
    filter(event, player) {
      return event.type == "saya_powei" && player == event.getParent().playertrue;
    },
    async content(event, trigger, player) {
      const result = await player.judge((card) => get.color(card) == "red" ? 5 : 0).set("judge2", (result2) => result2.bool ? true : false).forResult();
      if (result.bool) {
        player.line(trigger.getParent().playerfalse);
        await trigger.getParent().playerfalse.damage();
      }
    }
  },
  saya_shouji: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter(event, player) {
      return event.cards.filterInD().length > 0;
    },
    usable: 1,
    async cost(event, trigger, player) {
      const goon = (function() {
        let num = 0;
        let cards2 = trigger.cards.filterInD();
        for (let i = 0; i < cards2.length; i++) {
          num += player.getUseValue(cards2[i]);
        }
        return player.countCards("h", (card) => {
          return player.getUseValue(card, null, true) > num;
        }) == 0;
      })();
      event.result = await player.chooseTarget(get.prompt2(event.skill), lib.filter.notMe).set("ai", (target) => {
        if (!_status.event.goon) {
          return 0;
        }
        let player2 = _status.event.player;
        let cards2 = _status.event.getTrigger().cards.filterInD();
        let att = get.attitude(player2, target);
        let num = 0;
        for (let i = 0; i < cards2.length; i++) {
          num += target.getUseValue(cards2[i]);
        }
        return Math.max(num, 0.1) * att;
      }).set("goon", goon).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0], cards2 = trigger.cards.filterInD();
      await target.gain(cards2, "gain2", "log");
      const result = await target.chooseToUse({
        cards: cards2,
        filterCard(card) {
          if (get.itemtype(card) != "card" || !_status.event.cards || !_status.event.cards.includes(card)) {
            return false;
          }
          return lib.filter.filterCard.apply(this, arguments);
        },
        prompt: "是否使用得到的牌中的一张？"
      }).forResult();
      if (result.bool) {
        await player.draw();
      }
    }
  },
  //三枝叶留佳&二木佳奈多
  haruka_shuangche: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return !player.hasSkill("haruka_kanata");
    },
    chooseButton: {
      dialog(event, player) {
        let list = [];
        for (let i = 0; i < lib.inpile.length; i++) {
          let name = lib.inpile[i];
          if (name == "boss_mengpohuihun") {
            continue;
          }
          if (name == "sha") {
            list.push(["基本", "", "sha"]);
            for (const j of lib.inpile_nature) {
              list.push(["基本", "", name, j]);
            }
          } else if (get.type(name) == "trick") {
            list.push(["锦囊", "", name]);
          } else if (get.type(name) == "basic") {
            list.push(["基本", "", name]);
          }
        }
        return ui.create.dialog("双掣", [list, "vcard"]);
      },
      filter(button, player) {
        return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
      },
      check(button) {
        let player = _status.event.player;
        if (player.countCards("h", button.link[2]) > 0) {
          return 0;
        }
        if (["wugu", "zhulu_card"].includes(button.link[2])) {
          return 0;
        }
        let effect = player.getUseValue(button.link[2]);
        if (effect > 0) {
          return effect;
        }
        return 0;
      },
      backup(links, player) {
        return {
          audio: "haruka_shuangche",
          filterCard() {
            return false;
          },
          selectCard: -1,
          popname: true,
          check(card) {
            return 6 - get.value(card);
          },
          position: "he",
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            isCard: true
          }
        };
      },
      prompt(links, player) {
        return "请选择" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "的目标";
      }
    },
    ai: {
      order: 1,
      result: {
        player(player) {
          let cards2 = player.getCards("he").sort((a, b) => {
            return get.value(a) - get.value(b);
          });
          let num = (player.getStat("skill").haruka_shuangche || 0) + 1;
          if (player.needsToDiscard() >= num) {
            return 1;
          }
          if (player.hp > 2) {
            return 1;
          }
          if (cards2.length >= num) {
            let val = 0;
            for (let i = 0; i < cards2.length; i++) {
              val += get.value(cards2[i]);
            }
            return 12 - val;
          }
          return 0;
        }
      },
      fireAttack: true
    },
    group: "kanata_shuangche"
  },
  kanata_shuangche: {
    trigger: { player: "useCardAfter" },
    forced: true,
    filter(event, player) {
      return event.skill == "haruka_shuangche_backup";
    },
    async content(event, trigger, player) {
      const num = player.getStat("skill").haruka_shuangche || 1;
      const result = await player.chooseToDiscard("###双掣：请选择一项###选择弃置" + get.cnNumber(num) + "张牌，或失去1点体力且令〖双掣〗失效至回合结束", num, "he").set("ai", (card) => {
        let total = 12;
        for (let i = 0; i < ui.selected.cards.length; i++) {
          total -= get.value(ui.selected.cards[i]);
        }
        return total - get.value(card);
      }).forResult();
      if (!result.bool) {
        player.addTempSkill("haruka_kanata");
        await player.loseHp();
      }
    }
  },
  haruka_kanata: { charlotte: true },
  //紬文德斯
  tsumugi_mugyu: {
    audio: 5,
    trigger: { target: "useCardToTargeted" },
    frequent: true,
    filter(event, player) {
      return player.countCards("h") < player.maxHp;
    },
    async content(event, trigger, player) {
      await player.draw();
    }
  },
  tsumugi_huilang: {
    trigger: { player: "phaseEnd" },
    charlotte: true,
    line: { color: [253, 198, 116] },
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard("he", [1, player.countCards("he")], get.prompt2(event.skill), "allowChooseAll").set("ai", (card) => {
        if (get.position(card) != "h") {
          return -1;
        }
        if (!["shan", "wuxie", "caochuan"].includes(get.name(card))) {
          return 9;
        }
        return 5 - get.value(card);
      }).forResult();
    },
    async content(event, trigger, player) {
      const cards2 = event.cards;
      player.addSkill("tsumugi_huilang2");
      player.addToExpansion("giveAuto", cards2, player).gaintag.add("tsumugi_huilang2");
    }
  },
  tsumugi_huilang2: {
    charlotte: true,
    marktext: "隐",
    intro: { content: "隐藏于回廊之牌", markcount: "expansion" },
    onremove(player, skill) {
      let cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    trigger: { player: "phaseBegin" },
    forced: true,
    filter(event, player) {
      return player.getExpansions("tsumugi_huilang2").length > 0;
    },
    async content(event, trigger, player) {
      const cards2 = player.getExpansions("tsumugi_huilang2");
      const num = cards2.length;
      await player.gain(cards2, "draw");
      const result = await player.chooseTarget([1, num], "是否令至多" + get.cnNumber(num) + "名角色各摸一张牌？").set("ai", (target) => get.attitude(_status.event.player, target)).forResult();
      if (result.bool) {
        const targets = result.targets;
        player.line(targets, lib.skill.tsumugi_huilang.line);
        targets.sortBySeat();
        game.asyncDraw(targets);
      }
      await game.delayx();
    }
  },
  //由依
  yui_jiang: {
    audio: 2,
    audioname: ["sp_lvmeng", "re_sunben", "re_sunce"],
    trigger: {
      player: "useCardToPlayered",
      target: "useCardToTargeted"
    },
    filter(event, player) {
      if (!(event.card.name == "juedou" || event.card.name == "sha" && get.color(event.card) == "red")) {
        return false;
      }
      return player == event.target || event.getParent().triggeredTargets3.length == 1;
    },
    frequent: true,
    async content(event, trigger, player) {
      await player.draw();
    },
    ai: {
      effect: {
        target_use(card, player, target) {
          if (card.name == "sha" && get.color(card) == "red") {
            return [1, 0.6];
          }
        },
        player_use(card, player, target) {
          if (card.name == "sha" && get.color(card) == "red") {
            return [1, 1];
          }
        }
      }
    }
  },
  yui_lieyin: {
    trigger: { player: "phaseUseBegin" },
    locked: true,
    async cost(event, trigger, player) {
      const list = [];
      if (player.storage._ichiban_no_takaramono) {
        list.push("cancel2");
      }
      const { control, index } = await player.chooseControl(...list).set("choiceList", ["令此阶段内的所有红色牌视为【杀】", "令此阶段内的所有【杀】视为【决斗】"]).set("prompt", player.storage._ichiban_no_takaramono ? get.prompt(event.skill) : "烈音：请选择一项").set("ai", function() {
        let player2 = _status.event.player;
        let shas = player2.countCards("h", "sha");
        if (shas > 0) {
          if (game.hasPlayer((current) => {
            return get.attitude(player2, current) < 0 && player2.canUse("juedou", current) && !current.hasSha() && get.effect(current, { name: "juedou" }, player2, player2) > 0;
          })) {
            return 1;
          }
          if (player2.storage._ichiban_no_takaramono) {
            return "cancel2";
          }
        }
        if (player2.countCards("h", (card) => {
          return get.color(card) == "red" && card.name != "sha" && player2.hasValueTarget(card);
        }) == 0) {
          return 0;
        }
        if (player2.storage._ichiban_no_takaramono) {
          return "cancel2";
        }
        return 1;
      }).forResult();
      if (control !== "cancel2") {
        event.result = {
          bool: true,
          cost_data: { index }
        };
      }
    },
    async content(event, trigger, player) {
      player.addTempSkill(`yui_lieyin${event.cost_data.index}`, "phaseUseEnd");
    }
  },
  yui_lieyin0: {
    mod: {
      cardname(card) {
        if (get.color(card) == "red") {
          return "sha";
        }
      }
    }
  },
  yui_lieyin1: {
    mod: {
      cardname(card) {
        if (card.name == "sha") {
          return "juedou";
        }
      }
    }
  },
  yui_takaramono: {
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "key",
    filter(event, player) {
      let num = 0;
      if (player.hp <= 1) {
        num++;
      }
      if (game.dead.length > 0) {
        num++;
      }
      if (num != 1) {
        return num > 1;
      }
      let draw = 0;
      player.getAllHistory("gain", function(evt) {
        if (evt.getParent(2).name == "yui_jiang") {
          draw += evt.cards.length;
        }
      });
      return draw >= 3;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      player.storage._ichiban_no_takaramono = true;
      await player.addSkills("yui_yinhang");
      await player.gainMaxHp();
      await player.recover();
    },
    derivation: "yui_yinhang"
  },
  yui_yinhang: {
    trigger: { player: "changeHp" },
    locked: true,
    getIndex: (event) => Math.abs(event.changedHp),
    line: { color: [253, 153, 182] },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget([1, 2], get.prompt(event.skill), "令至多两名角色各摸一张牌").set("ai", (target) => {
        return get.attitude(_status.event.player, target);
      }).forResult();
    },
    async content(event, trigger, player) {
      const targets = event.targets;
      targets.sortBySeat();
      await game.asyncDraw(targets);
    }
  },
  //吉野晴彦
  yoshino_jueyi: {
    trigger: { player: "phaseUseBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(lib.filter.notMe, get.prompt2(event.skill)).set("ai", function(target) {
        let player2 = _status.event.player;
        if (get.damageEffect(target, player2, player2) < 0) {
          return 0;
        }
        let att = get.attitude(player2, target);
        if (att > 0) {
          return 0;
        }
        if (att == 0) {
          return 0.1;
        }
        let eff = 0;
        let hs = player2.getCards("h");
        for (let i = 0; i < hs.length; i++) {
          if (player2.canUse(hs[i], target)) {
            let eff2 = get.effect(target, hs[i], player2, player2);
            if (eff2 > 0) {
              eff += eff2;
            }
          }
        }
        return -att / (1 + eff);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await player.draw();
      let result;
      do {
        result = await player.chooseToPSS(target).forResult();
      } while (result.tie);
      if (result.bool) {
        await target.damage();
      } else {
        target.addTempSkill("yoshino_fail", "phaseUseEnd");
      }
    }
  },
  yoshino_fail: {
    mod: {
      targetEnabled(card, player, target) {
        if (player == _status.currentPhase) {
          return false;
        }
      }
    }
  },
  //宫泽谦吾
  kengo_weishang: {
    locked: false,
    mod: {
      cardUsable(card, player, num) {
        if (card.name == "sha" && player.hasDisabledSlot(1)) {
          return num + 1;
        }
      },
      globalFrom(from, to, distance) {
        if (from.hasDisabledSlot(4)) {
          return distance - 1;
        }
      },
      globalTo(from, to, distance) {
        if (to.hasDisabledSlot(3)) {
          return distance + 1;
        }
      }
    },
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      let list = ["equip1", "equip2", "equip3", "equip4", "equip5"];
      for (let i = 0; i < list.length; i++) {
        if (player.hasEnabledSlot(list[i]) && (!player.storage.kengo_guidui2 || !player.storage.kengo_guidui2.includes(list[i]))) {
          return true;
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      let list = ["equip1", "equip2", "equip3", "equip4", "equip5"].filter((item) => {
        return player.hasEnabledSlot(item) && (!player.storage.kengo_guidui2 || !player.storage.kengo_guidui2.includes(item));
      });
      const result = await player.chooseControl(list).set("prompt", "请选择废除一个装备栏").set("ai", () => {
        if (list.includes("equip1") && player.hasEmptySlot("equip1") && player.countCards("h", (card) => {
          return card.name == "sha" && player.getUseValue(card) > 0;
        })) {
          return "equip1";
        }
        if (list.includes("equip3") && player.hasEmptySlot("equip3")) {
          return "equip3";
        }
        if (list.includes("equip4") && player.hasEmptySlot("equip4")) {
          return "equip4";
        }
        if (list.includes("equip5") && player.hasEmptySlot("equip5")) {
          return "equip5";
        }
        if (list.includes("equip2") && player.hasEmptySlot("equip2")) {
          return "equip2";
        }
        return list.randomGet();
      }).forResult();
      await player.disableEquip(result.control);
      await player.draw(2);
    },
    group: ["kengo_weishang_sha", "kengo_weishang_shan"],
    ai: {
      order: 10,
      result: { player: 1 }
    }
  },
  kengo_weishang_sha: {
    trigger: { player: "useCardToPlayered" },
    forced: true,
    filter(event, player) {
      return event.card.name == "sha" && player.hasDisabledSlot(1) && event.target.countCards("he") > 0;
    },
    logTarget: "target",
    async content(event, trigger, player) {
      await trigger.target.chooseToDiscard("he", true);
    }
  },
  kengo_weishang_shan: {
    enable: ["chooseToUse", "chooseToRespond"],
    viewAs: { name: "shan" },
    filterCard: true,
    position: "hes",
    prompt: "将一张牌当做闪使用或打出",
    viewAsFilter(player) {
      return player.hasDisabledSlot(2) && player.countCards("hes") > 0;
    },
    check(card) {
      return 1 / Math.max(0.1, get.value(card));
    },
    ai: {
      respondShan: true,
      skillTagFilter(player) {
        return player.hasDisabledSlot(2) && player.countCards("he") > 0;
      }
    }
  },
  kengo_guidui: {
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      return player.countDisabledSlot() > 0;
    },
    async content(event, trigger, player) {
      const list = [];
      for (const slot of [1, 2, 3, 4, 5]) {
        list.push(...Array(player.countDisabledSlot(slot)).fill("equip" + slot));
      }
      player.enableEquip(list);
      if (!player.storage.kengo_guidui2) {
        player.storage.kengo_guidui2 = [];
      }
      player.storage.kengo_guidui2.addArray(list);
    },
    ai: {
      combo: "kengo_weishang"
    }
  },
  kengo_guidui2: { onremove: true },
  //岩泽雅美
  iwasawa_yinhang: {
    trigger: { player: "changeHp" },
    locked: true,
    line: { color: [235, 96, 138] },
    getIndex: (event) => Math.abs(event.changedHp),
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget([1, 2], get.prompt(event.skill), "令至多两名角色各摸一张牌").set("ai", (target) => {
        return get.attitude(_status.event.player, target);
      }).forResult();
    },
    async content(event, trigger, player) {
      const targets = event.targets;
      targets.sortBySeat();
      await game.asyncDraw(targets);
    }
  },
  iwasawa_mysong: {
    trigger: {
      player: ["phaseBeginStart", "phaseAfter", "dyingBefore"]
    },
    forced: true,
    filter(event, player) {
      return event.name == "dying" || player.hp < 1;
    },
    async content(event, trigger, player) {
      if (trigger.name == "dying") {
        trigger.cancel();
      } else if (event.triggername == "phaseBeginStart") {
        player.addTempSkill("iwasawa_fenyin");
      } else {
        await player.die();
      }
    },
    nobracket: true,
    derivation: "iwasawa_fenyin"
  },
  iwasawa_refenyin: {
    audio: 2,
    audioname2: {
      wufan: "refenyin_wufan"
    },
    trigger: {
      global: ["loseAfter", "cardsDiscardAfter", "equipAfter"]
    },
    forced: true,
    filter(event, player) {
      if (player != _status.currentPhase) {
        return false;
      }
      let cards2 = event.getd();
      let list = [];
      for (let i = 0; i < cards2.length; i++) {
        let card = cards2[i];
        list.add(card.suit);
      }
      game.getGlobalHistory("cardMove", function(evt) {
        if (evt == event || evt.getParent() == event || evt.name != "lose" && evt.name != "cardsDiscard") {
          return false;
        }
        if (evt.name == "lose" && evt.position != ui.discardPile) {
          return false;
        }
        for (let i = 0; i < evt.cards.length; i++) {
          let card = evt.cards[i];
          list.remove(card.suit);
        }
      });
      return list.length > 0;
    },
    async content(event, trigger, player) {
      const list = [];
      const list2 = [];
      const cards2 = trigger.getd();
      for (const card of cards2) {
        const suit = card.suit;
        list.add(suit);
        list2.add(suit);
      }
      game.getGlobalHistory("cardMove", (evt) => {
        if (evt == trigger || evt.getParent() == trigger || evt.name != "lose" && evt.name != "cardsDiscard") {
          return false;
        }
        if (evt.name == "lose" && evt.position != ui.discardPile) {
          return false;
        }
        for (const card of evt.cards) {
          const suit = card.suit;
          list.remove(suit);
          list2.add(suit);
        }
      });
      list2.sort();
      await player.draw(list.length);
      player.storage.iwasawa_refenyin_mark = list2;
      player.addTempSkill("iwasawa_refenyin_mark");
      player.markSkill("iwasawa_refenyin_mark");
    },
    subSkill: {
      mark: {
        onremove: true,
        intro: {
          content(s) {
            let str = "本回合已经进入过弃牌堆的卡牌的花色：";
            for (let i = 0; i < s.length; i++) {
              str += get.translation(s[i]);
            }
            return str;
          }
        }
      }
    }
  },
  iwasawa_fenyin: {
    mod: {
      aiOrder(player, card, num) {
        if (typeof card == "object" && player == _status.currentPhase) {
          let evt = player.getLastUsed();
          if (evt && evt.card && get.color(evt.card) != "none" && get.color(card) != "none" && get.color(evt.card) != get.color(card)) {
            return num + 10;
          }
        }
      }
    },
    audio: 2,
    trigger: { player: "useCard" },
    frequent: true,
    //usable:3,
    filter(event, player) {
      if (_status.currentPhase != player) {
        return false;
      }
      let evt = player.getLastUsed(1);
      if (!evt) {
        return false;
      }
      let color1 = get.color(evt.card);
      let color2 = get.color(event.card);
      return color1 && color2 && color1 != "none" && color2 != "none" && color1 != color2;
    },
    async content(event, trigger, player) {
      await player.draw();
    },
    ai: {
      threaten(player, target) {
        if (target.hp < 1) {
          return 3;
        }
        return 1;
      }
    }
  },
  //井之原真人
  masato_baoquan: {
    trigger: { source: "damageBefore" },
    forced: true,
    async content(event, trigger, player) {
      const result = await player.chooseControl("防止伤害", "增加伤害").set("prompt", "暴拳：防止即将对" + get.translation(trigger.player) + "造成的伤害，或失去1点体力上限并令此伤害+2").set("choice", get.attitude(player, trigger.player) >= 0 ? 0 : 1).set("ai", () => {
        return _status.event.choice;
      }).forResult();
      if (result.control == "增加伤害") {
        await player.loseMaxHp();
        trigger.num += 2;
      } else {
        trigger.cancel();
      }
    },
    ai: {
      effect: {
        player(card, player, target) {
          if (target && get.attitude(player, target) > 0 && get.tag(card, "damage")) {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  //西森柚咲&黑羽美砂
  yusa_yanyi: {
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return get.distance(player, target) <= player.hp;
    },
    selectTarget() {
      return [1, Math.max(_status.event.player.getAttackRange())];
    },
    line: "thunder",
    async content(event, trigger, player) {
      const { target } = event;
      let result;
      if (target.isHealthy()) {
        player.draw();
        return;
      } else {
        let name = get.translation(player);
        result = await target.chooseControl().set("choiceList", ["令" + name + "摸一张牌", "回复1点体力，然后交给" + name + "一张牌"]).set("ai", () => {
          return 1;
        }).forResult();
      }
      if (result && result.index == 0) {
        player.draw();
        return;
      } else if (result) {
        target.recover();
      }
      if (target != player && target.countCards("he") > 0) {
        const cardResult = await target.chooseCard("交给" + get.translation(player) + "一张牌", "he", true).forResult();
        result = cardResult;
      } else {
        return;
      }
      if (result && result.cards) {
        target.give(result.cards, player, "giveAuto");
      }
    },
    ai: {
      order: 10,
      result: {
        player(player, target) {
          return target.isHealthy() ? 1 : 0;
        },
        target(player, target) {
          if (target.isHealthy()) {
            return 0;
          }
          return get.recoverEffect(target, player, target);
        }
      }
    }
  },
  yusa_misa: {
    charlotte: true,
    trigger: { player: "useSkillAfter" },
    filter(event, player) {
      return event.skill == "yusa_yanyi" && !player.storage.dualside_over && Array.isArray(player.storage.dualside);
    },
    async content(event, trigger, player) {
      await player.turnOver();
    },
    ai: {
      combo: "yusa_yanyi"
    }
  },
  misa_yusa: {
    charlotte: true,
    trigger: { player: "misa_yehuoAfter" },
    filter(event, player) {
      return event.bool === true && !player.storage.dualside_over && Array.isArray(player.storage.dualside);
    },
    async content(event, trigger, player) {
      await player.turnOver();
    }
  },
  misa_yehuo: {
    charlotte: true,
    trigger: { global: "phaseDrawBegin1" },
    locked: true,
    line: { color: [236, 137, 52] },
    filter(event, player) {
      let target = event.player;
      return player.inRange(target) && player.countCards("he") >= get.distance(player, target);
    },
    async cost(event, trigger, player) {
      let next = player.chooseToDiscard("he", get.distance(player, trigger.player) || 1, get.prompt2(event.skill, trigger.player), "chooseonly");
      next.set("ai", (card) => {
        let val = _status.event.val;
        for (let i = 0; i < ui.selected.cards.length; i++) {
          val -= get.value(ui.selected.cards[i]);
        }
        return val - get.value(card);
      });
      next.set("val", -2 * get.attitude(player, trigger.player));
      event.result = await next.forResult();
    },
    logTarget: "player",
    async content(event, trigger, player) {
      await player.discard(event.cards);
      let result;
      if (trigger.numFixed) {
        result = { index: 0 };
      } else if (trigger.player.isIn()) {
        const name = get.translation(trigger.player);
        result = await player.chooseControl().set("choiceList", ["对" + name + "造成1点火属性伤害", "令" + name + "此出牌阶段的额定摸牌数改为0"]).forResult();
      }
      if (result?.index == 0) {
        await trigger.player.damage("fire");
      }
      if (result?.index == 1) {
        trigger.changeToZero();
      }
    },
    ai: {
      fireAttack: true
    }
  },
  //宫泽有纪宁
  yukine_wenzhou: {
    trigger: { global: "phaseUseBegin" },
    filter(event, player) {
      return event.player.countCards("he") > 0;
    },
    async cost(event, trigger, player) {
      event.forceDie = true;
      let ask = trigger.player.chooseCard("he", get.prompt(event.skill));
      if (player === trigger.player) {
        ask.set("prompt2", "选择一张牌，然后从牌堆中获得一张与此牌类型相同的牌。本回合内使用与此牌类型相同的牌时不可被其他角色响应。");
      } else {
        ask.set("prompt2", "将一张牌交给" + get.translation(player) + "然后其可以选择：交给你一张牌；或令你从牌堆中获得一张与此牌类型相同的牌，且你本回合内使用与此牌类型相同的牌时不可被响应。");
      }
      ask.set("ai", (card) => {
        if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) {
          return 10 - get.value(card);
        }
        return -1;
      });
      event.result = await ask.forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      event.forceDie = true;
      event.type = get.type(cards2[0], "trick");
      if (trigger.player != player) {
        trigger.player.give(cards2, player, "giveAuto");
      }
      let result;
      if (player == trigger.player || player.countCards("he") == 0) {
        result = { index: 1 };
      } else {
        result = await player.chooseControl().set("choiceList", ["将一张牌交给" + get.translation(trigger.player), "令" + get.translation(trigger.player) + "从牌堆中获得一张" + get.translation(event.type) + "牌，且其本回合内使用与此牌名称相同的牌时不可被响应"]).set("forceDie", true).set("ai", () => {
          if (get.attitude(_status.event.player, _status.event.getTrigger().player) > 0) {
            return 1;
          }
          return 0;
        }).forResult();
      }
      event.index = result.index;
      if (result.index == 1) {
        let magic = get.cardPile2((card) => {
          return get.type(card, "trick") == event.type;
        });
        if (magic) {
          trigger.player.addTempSkill("yukine_magic", "phaseUseEnd");
          trigger.player.storage.yukine_magic.add(magic.name);
          trigger.player.gain(magic, "draw");
        } else {
          return;
        }
      } else {
        const cardResult = await player.chooseCard("he", true, "选择要交给" + get.translation(trigger.player) + "的牌").set("ai", (card) => {
          return -get.value(card, _status.event.getTrigger().player);
        }).forResult();
        result = cardResult;
      }
      if (event.index == 1) {
        game.updateRoundNumber();
      } else if (result.bool) {
        player.give(result.cards, trigger.player, "giveAuto");
      }
    }
  },
  yukine_magic: {
    trigger: { player: "useCard" },
    forced: true,
    popup: false,
    charlotte: true,
    filter(event, player) {
      return player.storage.yukine_magic && player.storage.yukine_magic.includes(event.card.name);
    },
    async content(event, trigger, player) {
      trigger.directHit.addArray(
        game.filterPlayer((current) => {
          if (player != current) {
            return true;
          }
          return !player.hasSkill("yukine_wenzhou");
        })
      );
    },
    onremove: true,
    init(player, skill) {
      if (!player.storage[skill]) {
        player.storage[skill] = [];
      }
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        return player.storage.yukine_magic && player.storage.yukine_magic.includes(arg.card.name);
      }
    }
  },
  //神北小毬
  komari_tiankou: {
    trigger: {
      player: "useCard2",
      target: "useCardToTarget"
    },
    forced: true,
    filter(event, player, name) {
      if (name == "useCardToTarget" && player == event.player) {
        return false;
      }
      if (get.color(event.card) != "red") {
        return false;
      }
      if (get.tag(event.card, "damage")) {
        return false;
      }
      return ["basic", "trick"].includes(get.type(event.card));
    },
    async content(event, trigger, player) {
      const info = get.info(trigger.card);
      let list = [];
      if (!info.multitarget && info.allowMultiple !== false) {
        list = game.filterPlayer((current) => {
          return !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, trigger.player, current);
        });
      }
      if (list.length > 0) {
        const result = await player.chooseTarget("甜口：为" + get.translation(trigger.card) + "增加一个额外目标，或点【取消】摸一张牌。", (candy, komari, rin) => {
          return _status.event.rin_chan.includes(rin);
        }).set("rin_chan", list).set("ai", (target) => {
          const evt = _status.event;
          return get.effect(target, evt.candy, evt.source, evt.player);
        }).set("candy", trigger.card).set("source", trigger.player).forResult();
        if (result.bool) {
          const rin = result.targets[0];
          trigger.targets.push(rin);
          player.line(rin, { color: [255, 224, 172] });
        } else {
          await player.draw();
        }
      } else {
        await player.draw();
      }
    }
  },
  komari_xueshang: {
    trigger: { global: "die" },
    forced: true,
    skillAnimation: true,
    chargingSkill: true,
    filter(event, player) {
      return player.hp > 0;
    },
    animationColor: "metal",
    async content(event, trigger, player) {
      player.addSkill("riki_xueshang");
      const map = {};
      const list = [];
      for (let i = 1; i <= player.hp; i++) {
        const cn = get.cnNumber(i, true);
        map[cn] = i;
        list.push(cn);
      }
      const result = await player.chooseControl(list, () => "一").set("prompt", "血殇：请选择自己受到的伤害的点数").forResult();
      const num = map[result.control] || 1;
      const targetList = game.filterPlayer((current) => current != player).sortBySeat();
      await player.damage(num);
      player.line(targetList, { color: [255, 224, 172] });
      if (!player.hasSkill(event.name)) {
        return;
      }
      for (const target of targetList) {
        await target.damage(num);
      }
    }
  },
  riki_xueshang: {
    trigger: { global: "dying" },
    forced: true,
    popup: false,
    charlotte: true,
    filter(event, player) {
      return event.getParent(2).name == "komari_xueshang" && event.getParent(2).player == player;
    },
    async content(event, trigger, player) {
      await player.removeSkills("komari_xueshang");
      await player.gainMaxHp(true);
      await player.recover();
    }
  },
  //鹰原羽未
  umi_chaofan: {
    enable: "phaseUse",
    usable: 1,
    selectCard: 2,
    complexCard: true,
    filter(summer, umi) {
      return umi.countCards("h") > 1;
    },
    check(ingredient) {
      return 7 - get.value(ingredient);
    },
    filterCard(ingredient) {
      if (ui.selected.cards.length) {
        return get.suit(ingredient) != get.suit(ui.selected.cards[0]);
      }
      return true;
    },
    line: { color: [251, 193, 217] },
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const { target } = event;
      await player.draw();
      if (player.hp > 2) {
        await target.recover();
      } else if (player.hp == 2) {
        await target.draw(2);
      } else {
        await target.damage("fire", "nosource");
      }
    },
    ai: {
      order: 2,
      result: {
        target(umi, takahara) {
          if (umi.hp > 2 && takahara.isDamaged()) {
            return 2.2;
          }
          if (umi.hp == 2 && !takahara.hasSkillTag("nogain")) {
            return 2;
          }
          if (umi.hp < 2) {
            return get.damageEffect(takahara, umi, umi, "fire");
          }
        }
      }
    }
  },
  umi_lunhui: {
    trigger: { global: "phaseAfter" },
    filter(summer, umi) {
      if (get.itemtype(umi.getStorage("umi_shiroha")) === "player") {
        return false;
      }
      return summer.player != umi && umi.countCards("h") < umi.hp;
    },
    line: { color: [251, 193, 217] },
    logTarget: "player",
    charlotte: true,
    async content(event, trigger, player) {
      await player.loseHp();
      await player.draw(2);
      player.insertPhase();
      player.storage.umi_shiroha = trigger.player;
      player.addTempSkill("umi_shiroha", { player: "phaseAfter" });
    }
  },
  umi_shiroha: {
    mark: "character",
    intro: {
      content: "到$的距离视为1"
    },
    onremove: true,
    charlotte: true,
    mod: {
      globalFrom(umi, shiroha) {
        if (umi.storage.umi_shiroha == shiroha) {
          return -Infinity;
        }
      }
    }
  },
  umi_qihuan: {
    forceunique: true,
    enable: "chooseToUse",
    filter(summer, umi) {
      return summer.type == "dying" && umi.isDying() && [umi.name1, umi.name2].includes("key_umi");
    },
    limited: true,
    skillAnimation: true,
    charlotte: true,
    animationColor: "key",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      player.reinitCharacter("key_umi", "key_umi2", false);
      player.recover(game.countGroup() || 1);
      if (!game.dead.length) {
        event.finish();
        return;
      }
      const chara = [];
      const skills2 = [];
      for (const dead of game.dead) {
        const skill = [];
        if (dead.name && lib.character[dead.name]) skill.addArray(lib.character[dead.name][3]);
        if (dead.name2 && lib.character[dead.name2]) skill.addArray(lib.character[dead.name2][3]);
        if (skill.length) {
          chara.push(dead);
          skills2.push(skill);
        }
      }
      if (!chara.length) {
        event.finish();
        return;
      }
      const chosen = [];
      for (let i = 0; i < 2; i++) {
        const next = player.chooseTarget("是否获得一名已死亡角色的一个技能？");
        next.set("chara", chara);
        next.set("skills", skills2);
        next.set("chosen", chosen);
        next.set("filterTarget", (card, player2, target) => {
          if (target.isAlive()) return false;
          const evt = _status.event;
          if (!evt.chosen.length) return true;
          const skills3 = evt.skills[evt.chara.indexOf(target)];
          if (skills3.length == 1 && skills3[0] == evt.chosen[0]) return false;
          return true;
        });
        next.set("deadTarget", true);
        next.set("ai", () => Math.random());
        const charaResult = await next.forResult();
        if (!charaResult.bool) {
          event.finish();
          return;
        }
        const selectedChara = charaResult.targets[0];
        selectedChara.line(player, { color: [251, 193, 217] });
        const skillList = skills2[chara.indexOf(selectedChara)];
        skillList.removeArray(chosen);
        const skillResult = await player.chooseControl(skillList).set("prompt", "选择获得一个技能").forResult();
        player.addSkills(skillResult.control);
        chosen.push(skillResult.control);
      }
    },
    ai: {
      order: 10,
      save: true,
      skillTagFilter(player, tag, target) {
        return player == target;
      },
      result: { player: 1 }
    }
  },
  //神尾晴子
  haruko_haofang: {
    mod: {
      cardname(card, player, name) {
        if (lib.card[card.name].type == "delay") {
          return "wuzhong";
        }
      }
    },
    trigger: { player: "drawBefore" },
    forced: true,
    filter(event, player) {
      return event.getParent().name == "wuzhong";
    },
    async content(event, trigger, player) {
      trigger.num += 2;
    }
  },
  haruko_zhuishi: {
    trigger: { global: "phaseJudgeBegin" },
    filter(misuzu) {
      return misuzu.player.countCards("j") > 0;
    },
    check(event, player) {
      return get.attitude(player, event.player) > 1;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      await player.gain(trigger.player.getCards("j"), trigger.player, "give", "bySelf");
      if (player.hp > 1) {
        await player.loseHp();
      }
    }
  },
  yuri_xingdong: {
    audio: 3,
    group: "yuri_xingdong_gain",
    subSkill: {
      mark: {
        mark: true,
        marktext: "令",
        intro: {
          content: "跳过下个回合的判定阶段和摸牌阶段"
        }
      },
      gain: {
        audio: 2,
        trigger: { player: "phaseUseBegin" },
        forced: true,
        async content(event, trigger, player) {
          const card = get.cardPile(function(card2) {
            return card2.name == "sha" || get.type(card2) == "trick";
          });
          if (card) {
            await player.gain(card, "gain2", "log");
          }
          game.updateRoundNumber();
        }
      }
    },
    enable: "phaseUse",
    usable: 1,
    locked: true,
    filter(event, player) {
      return player.countCards("h", lib.skill.yuri_xingdong.filterCard);
    },
    filterCard(card) {
      return card.name == "sha" || get.type(card) == "trick";
    },
    check(card) {
      return 1;
    },
    filterTarget: lib.filter.notMe,
    discard: false,
    lose: false,
    delay: 0,
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      await player.give(cards2, target);
      let result;
      if (!target.getCards("h").includes(cards2[0])) {
        result = { bool: false };
      } else {
        result = await target.chooseUseTarget(
          cards2[0],
          game.filterPlayer((current) => {
            return current != player;
          }),
          "请使用得到的牌，或者跳过下回合的判定阶段和摸牌阶段"
        ).forResult();
      }
      if (result.bool) {
        game.asyncDraw([player, target]);
        await game.delay();
      } else {
        target.addTempSkill("yuri_xingdong_mark", "phaseJudgeSkipped");
        target.skip("phaseJudge");
        target.skip("phaseDraw");
        target.addTempSkill("zhengjing3", {
          player: "phaseAfter"
        });
      }
    },
    ai: {
      order: 12,
      result: {
        target(player, target) {
          let card = ui.selected.cards[0];
          if (target.hasSkill("pingkou")) {
            return 1;
          }
          if (!card) {
            return 0;
          }
          let info = get.info(card);
          if (info.selectTarget == -1) {
            let eff = 0;
            game.countPlayer((current) => {
              if (current != player && target.canUse(card, current)) {
                eff += get.effect(current, card, target, target);
              }
            });
            if (eff > 0 || get.value(card) < 3) {
              return eff;
            }
            return 0;
          } else if (game.hasPlayer((current) => {
            return current != player && target.canUse(card, current) && get.effect(current, card, target, target) > 0;
          })) {
            return 1.5;
          } else if (get.value(card) < 3) {
            return -1;
          }
          return 0;
        }
      }
    }
  },
  yuri_wangxi: {
    audio: 2,
    trigger: { global: "dieAfter" },
    limited: true,
    mark: false,
    init(player) {
      if (player.hasZhuSkill("yuri_wangxi")) {
        player.markSkill("yuri_wangxi");
        player.storage.yuri_wangxi = false;
      }
    },
    zhuSkill: true,
    skillAnimation: true,
    animationColor: "thunder",
    filter(event, player) {
      if (get.mode() != "identity") {
        return false;
      }
      if (!player.hasZhuSkill("yuri_wangxi")) {
        return false;
      }
      if (event.player.isIn()) {
        return false;
      }
      if (event.player.identity == "mingzhong") {
        return false;
      }
      let evt = event.getParent("yuri_xingdong");
      return evt && evt.name == "yuri_xingdong" && evt.player == player;
    },
    async cost(event, trigger, player) {
      event.result = await trigger.player.chooseBool("是否发动" + get.translation(player) + "的【忘隙】？").set("forceDie", true).forResult();
    },
    logTarget: "player",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      let identity = "zhong";
      if (_status.mode == "purple") {
        if (["rNei", "bNei"].includes(player.identity)) {
          identity = player.identity;
        } else if (["rZhu", "rZhong", "bNei"].includes(player.identity)) {
          identity = "rZhong";
        } else {
          identity = "bZhong";
        }
      }
      game.broadcastAll(
        function(source, identity2) {
          if (source.node.dieidentity) {
            source.node.dieidentity.innerHTML = get.translation(identity2 + 2);
          }
          source.revive(2, false);
          source.identity = identity2;
          source.setIdentity();
        },
        trigger.player,
        identity
      );
      let evt = trigger.getParent("damage");
      if (evt.untrigger) {
        evt.untrigger(false, trigger.player);
      }
      game.addVideo("setIdentity", trigger.player, "zhong");
      await trigger.player.changeGroup(player.group);
      await trigger.player.draw();
    },
    ai: { combo: "yuri_xingdong" }
  },
  //枣恭介
  nk_shekong: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    filterCard: lib.filter.cardDiscardable,
    selectCard() {
      if (ui.selected.targets.length) {
        return [1, ui.selected.targets[0].countCards("he")];
      }
      return [1, Infinity];
    },
    filterTarget(event, player, target) {
      return target != player && target.countCards("he") >= Math.max(1, ui.selected.cards.length);
    },
    check(card) {
      if (!game.hasPlayer((current) => {
        return current != _status.event.player && get.attitude(_status.event.player, current) < 0 && current.countCards("he") > ui.selected.cards.length;
      })) {
        return 0;
      }
      return 6 - get.value(card);
    },
    allowChooseAll: true,
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      const cardsx = cards2.slice(0);
      const num = get.cnNumber(cards2.length);
      const trans = get.translation(player);
      let prompt = "弃置" + num + "张牌，然后" + trans + "摸一张牌";
      if (cards2.length > 1) {
        prompt += "；或弃置一张牌，然后" + trans + "摸" + num + "张牌";
      }
      const next = target.chooseToDiscard(prompt, "he", true);
      next.numx = cards2.length;
      next.selectCard = function() {
        if (ui.selected.cards.length > 1) {
          return _status.event.numx;
        }
        return [1, _status.event.numx];
      };
      next.complexCard = true;
      next.ai = (card) => {
        if (ui.selected.cards.length == 0 || _status.event.player.countCards("he", (cardxq) => {
          return get.value(cardxq) < 7;
        }) >= _status.event.numx) {
          return 7 - get.value(card);
        }
        return -1;
      };
      const result = await next.forResult();
      if (result.bool) {
        if (result.cards.length == cards2.length) {
          await player.draw();
        } else {
          await player.draw(cards2.length);
        }
        cardsx.addArray(result.cards);
        for (let i = 0; i < cardsx.length; i++) {
          if (get.position(cardsx[i]) != "d") {
            cardsx.splice(i--, 1);
          }
        }
      } else {
        return;
      }
      if (cardsx.length) {
        const result2 = await player.chooseButton(["请按顺序将卡牌置于牌堆顶（先选择的在上）", cardsx], true, cardsx.length).forResult();
        if (result2.bool) {
          const cardsx2 = result2.links;
          while (cardsx2.length) {
            const card = cardsx2.pop();
            card.fix();
            ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
          }
        }
      }
    },
    ai: {
      order: 10,
      result: {
        target: -1
      }
    }
  },
  key_huanjie: {
    trigger: { player: ["drawBegin", "judgeBegin"] },
    forced: true,
    silent: true,
    popup: false,
    lastDo: true,
    filter(event) {
      return event.name == "draw" || !event.directresult;
    },
    async content(event, trigger, player) {
      if (trigger.name == "draw") {
        if (trigger.bottom) {
          trigger.bottom = false;
        } else {
          trigger.bottom = true;
        }
      } else {
        trigger.directresult = get.bottomCards()[0];
      }
    },
    ai: {
      abnormalDraw: true,
      skillTagFilter(player, tag, arg) {
        if (tag === "abnormalDraw") {
          return !arg || arg === "bottom";
        }
      }
    }
  },
  //此花露西娅
  lucia_duqu: {
    trigger: {
      player: ["damage", "loseHpBefore", "useCardBefore"],
      source: "damage"
    },
    forced: true,
    charlotte: true,
    filter(event, player, onrewrite) {
      if (onrewrite == "loseHpBefore") {
        return event.type == "du";
      }
      return event.source != void 0 && event.source != event.player;
    },
    async content(event, trigger, player) {
      const onrewrite = event.triggername;
      if (onrewrite == "loseHpBefore") {
        trigger.cancel();
        await player.recover(trigger.num);
      } else {
        const another = trigger[trigger.source == player ? "player" : "source"];
        player.line(another, { color: [220, 90, 139] });
        another.gain(game.createCard2("du"), "gain2");
      }
    },
    ai: {
      usedu: true
    }
  },
  lucia_zhenren: {
    trigger: { global: "phaseJieshuBegin" },
    forced: true,
    charlotte: true,
    filter(event, player) {
      return player.countCards("e") > 0;
    },
    async content(event, trigger, player) {
      const es = player.getCards("e");
      let count = es.length;
      await player.discard(es);
      while (count > 0) {
        count--;
        if (!game.hasPlayer((current) => current.countDiscardableCards(player, "ej") > 0)) {
          break;
        }
        const result = await player.chooseTarget("请选择一名角色，弃置其装备区或判定区内的一张牌。", true, (card, player2, target) => target.countDiscardableCards(player2, "ej") > 0).set("ai", (target) => {
          const att = get.attitude(_status.event.player, target);
          if (target.countCards("j") && att > 0) {
            return att * 1.5;
          }
          return -att;
        }).forResult();
        if (result.bool && result.targets && result.targets.length) {
          const target = result.targets[0];
          player.line(target, { color: [220, 90, 139] });
          await player.discardPlayerCard(target, "ej", true);
        }
      }
    }
  }
};
const translates = {
  sp_key_yuri: "SP仲村由理",
  sp_key_yuri_prefix: "SP",
  key_lucia: "此花露西娅",
  key_kyousuke: "枣恭介",
  key_yuri: "仲村由理",
  key_haruko: "神尾晴子",
  key_umi: "加藤うみ",
  key_umi2: "鹰原羽未",
  key_rei: "零",
  key_komari: "神北小毬",
  key_yukine: "宫泽有纪宁",
  key_yusa: "西森柚咲",
  key_misa: "黑羽美砂",
  key_masato: "井之原真人",
  key_iwasawa: "岩泽雅美",
  key_kengo: "宫泽谦吾",
  key_yoshino: "吉野晴彦",
  key_yui: "芳冈由依",
  key_tsumugi: "紬文德斯",
  key_saya: "朱鹭户沙耶",
  key_harukakanata: "三枝叶留佳&二木佳奈多",
  key_harukakanata_ab: "三枝二木",
  key_inari: "稻荷",
  key_shiina: "椎名",
  key_sunohara: "春原阳平&春原芽衣",
  key_sunohara_ab: "阳平芽衣",
  //该武将国战模式下不可用
  key_rin: "枣铃",
  key_sasami: "笹濑川佐佐美",
  key_akane: "千里朱音",
  key_doruji: "多鲁基",
  key_yuiko: "来谷唯湖",
  key_riki: "直枝理树",
  key_hisako: "渕田久子",
  key_hinata: "日向秀树",
  key_noda: "野田",
  key_tomoya: "冈崎朋也",
  key_nagisa: "古河渚",
  key_ayato: "直井文人",
  key_ao: "空门苍",
  key_yuzuru: "音无结弦",
  sp_key_kanade: "SP立华奏",
  sp_key_kanade_prefix: "SP",
  key_mio: "西园美鱼",
  key_midori: "西园美鸟",
  key_kyoko: "岬镜子",
  key_shizuru: "中津静流",
  key_shiorimiyuki: "关根诗织&入江美雪",
  key_shiorimiyuki_ab: "关根入江",
  key_miki: "野村美希",
  key_shiori: "美坂栞",
  key_kaori: "美坂香里",
  key_akiko: "水濑秋子",
  key_abyusa: "游佐",
  key_godan: "松下护騨",
  key_yuu: "乙坂有宇",
  key_ryoichi: "三谷良一",
  key_kotori: "神户小鸟",
  key_jojiro: "高城丈士朗",
  key_shiroha: "鸣濑白羽",
  key_shizuku: "水织静久",
  key_hiroto: "铃木央人",
  key_sakuya: "凤咲夜",
  key_youta: "成神阳太",
  key_rumi: "七濑留美",
  key_chihaya: "凤千早",
  key_yukito: "国崎往人",
  key_crow: "小空",
  key_asara: "井上晶",
  key_kotomi: "一之濑琴美",
  key_mia: "藤川米娅",
  key_kano: "雾岛佳乃",
  db_key_liyingxia: "李映夏",
  key_erika: "苍井绘里香",
  key_satomi: "藏里见",
  key_iriya: "喵呜·喵呼",
  key_iriya_ab: "喵呜喵呼",
  key_fuuko: "伊吹风子",
  lucia_duqu: "毒躯",
  lucia_duqu_info: "异能技，①当你对其他角色造成伤害或受到其他角色的伤害时，你令对方获得一张花色点数随机的【毒】。<br>②当你因【毒】失去体力时，你改为回复等量的体力。",
  lucia_duqu_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  lucia_zhenren: "振刃",
  lucia_zhenren_info: "异能技，每个结束阶段，若你的装备区内有牌，则你弃置之。然后，你依次弃置场上的X张牌。（X为你以此法弃置的牌数）",
  lucia_zhenren_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  nk_shekong: "设控",
  nk_shekong_info: "出牌阶段限一次，你可以弃置任意张手牌并选择一名其他角色（不能超过该角色的牌数），然后令其选择一项：弃置一张牌并令你摸X张牌，或弃置X张牌并令你摸一张牌。然后，你将你与其弃置的且位于弃牌堆中的牌以任意顺序置于牌堆顶。",
  key_huanjie: "幻界",
  key_huanjie_info: "锁定技，当你进行判定或摸牌时，你改为从牌堆的另一端获取相应的牌。",
  yuri_xingdong: "行动",
  yuri_xingdong_info: "锁定技，出牌阶段开始时，你获得一张【杀】或普通锦囊牌。出牌阶段限一次，你可以将一张【杀】或普通锦囊牌交给一名其他角色，然后该角色选择一项：对除你以外的角色使用此牌并在此牌结算完成后和你各摸一张牌；或跳过下回合的判定阶段和摸牌阶段。",
  //目标角色跳过阶段的同时 该回合不能发动〖整经(郑玄)〗
  yuri_wangxi: "忘隙",
  yuri_wangxi_info: "主公技，限定技，当有角色因你发动的【行动】而死亡后，若其身份不为【明忠】，则其可以将身份改为忠臣并重新加入游戏，然后将势力改为与你相同，将体力值回复至2点并摸一张牌。",
  haruko_haofang: "豪放",
  haruko_haofang_info: "锁定技，你的延时锦囊牌视为【无中生有】。当你因执行【无中生有】的效果而摸牌时，你令摸牌数+2。",
  haruko_zhuishi: "追逝",
  haruko_zhuishi_info: "一名角色的判定阶段开始时，若其判定区内有牌，则你可以获得其判定区内的所有牌。若你的体力值大于1，你失去1点体力。",
  umi_chaofan: "炒饭",
  umi_chaofan_info: "出牌阶段限一次，你可以弃置两张花色不同的手牌并选择一名其他角色。你摸一张牌，若你的体力值：大于2，目标角色回复1点体力；等于2，目标角色摸两张牌；小于2，目标角色受到1点无来源且对应渠道为这两张牌的火焰伤害。",
  umi_lunhui: "轮回",
  umi_lunhui_info: "异能技，一名其他角色的回合结束时，若你的手牌数小于体力值，则你可以失去1点体力。若如此做，你摸两张牌并进行一个额外回合，且你于此回合内计算与此角色的距离视为1。",
  umi_lunhui_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  umi_shiroha: "轮回 - 延时效果",
  umi_qihuan: "七幻",
  umi_qihuan_info: "异能技，限定技，当你处于濒死状态时，你可以移去此武将牌。若如此做，你回复X点体力（X为场上势力数）。然后，你可获得场上已死亡角色武将牌上的至多两个技能。",
  umi_qihuan_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  komari_tiankou: "甜口",
  komari_tiankou_info: "锁定技，当你使用红色的非伤害性基本牌/锦囊牌选择目标时，或成为其他角色使用的这些牌的目标时，你选择一项：1.摸一张牌；2.为此牌增加一个目标。",
  komari_xueshang: "血殇",
  komari_xueshang_info: "锁定技，蓄能技，当有角色死亡时，你对自己造成<span class=yellowtext>1</span>点伤害，然后对所有其他角色依次造成<span class=firetext>1</span>点伤害。当有角色因此法进入濒死状态时，你加1点体力上限并回复1点体力，然后失去此技能并终止此技能的所有后续结算。",
  yukine_wenzhou: "问咒",
  yukine_wenzhou_info: "一名角色的出牌阶段开始时，其可以交给你一张牌。若如此做，你选择一项：交给其一张牌，或令其从牌堆中获得一张与此牌类型相同的牌，且其于此阶段内使用与此牌牌名相同的牌时无法被响应。",
  //如果对自己发动【问咒】，则自己可以响应这些牌。但其他角色发动【问咒】时，该角色自己并不能响应
  yusa_yanyi: "演艺",
  yusa_yanyi_info: "出牌阶段限一次，你可以指定至多X名与你距离不大于你的体力值的角色。这些角色选择一项：①令你摸一张牌。②回复1点体力，然后交给你一张牌。（X为你的攻击范围且至少为1）",
  misa_yehuo: "业火",
  misa_yehuo_info: "一名角色的摸牌阶段开始时，若其在你的攻击范围内，你可以弃置X张牌并选择一项：①对其造成1点火属性伤害。②令其于此摸牌阶段放弃摸牌。（X为你与其的距离）",
  yusa_misa: "通灵",
  yusa_misa_info: "当你发动的〖演艺〗结算完成之后，你可以将武将牌翻面。",
  misa_yusa: "归魂",
  misa_yusa_info: "当你发动的〖业火〗结算完成后，你可以将武将牌翻面。",
  masato_baoquan: "暴拳",
  masato_baoquan_info: "锁定技，当你即将造成伤害时，你选择一项：1.令此伤害+2并减1点体力上限。2.防止此伤害。",
  iwasawa_yinhang: "引吭",
  iwasawa_yinhang_info: "锁定技，当你的体力值变化1点时，你可以令至多两名角色摸一张牌。",
  iwasawa_mysong: "My Song",
  iwasawa_mysong_info: "锁定技，当你即将进行濒死结算时，取消之。回合开始时，若你的体力值小于1，则你获得技能〖奋音〗直到回合结束。回合结束时，若你的体力值小于1，你死亡。",
  iwasawa_fenyin: "奋音",
  iwasawa_fenyin_info: "你的回合内，当你使用牌时，若此牌与你于此回合内使用的上一张牌的颜色不同，则你可以摸一张牌。",
  iwasawa_refenyin: "奋音",
  iwasawa_refenyin_info: "锁定技，你的回合内，当一张牌进入弃牌堆后，若本回合内没有过与此牌花色相同的卡牌进入过弃牌堆，则你摸一张牌。",
  //卡牌花色的计算不受〖红颜〗等技能的影响
  kengo_weishang: "伪伤",
  kengo_weishang_sha: "伪伤",
  kengo_weishang_shan: "伪伤",
  kengo_weishang_info: "出牌阶段限一次，你可以废除一个装备栏并摸两张牌。若你的武器栏已废除，则你使用【杀】的次数上限+1，且当你使用【杀】指定目标后，目标角色弃置一张牌；若你的防具栏已废除，则你可以将一张牌当做【闪】使用或打出；若你的攻击/防御坐骑栏已废除，则你至其他角色的距离-1/其他角色至你的距离-1。",
  kengo_guidui: "归队",
  kengo_guidui_info: "锁定技，准备阶段，若你有已废除的装备栏，则你恢复这些装备栏，且本局游戏内发动【伪伤】时不能废除这些装备栏。",
  yoshino_jueyi: "决义",
  yoshino_jueyi_info: "出牌阶段开始时，你可以选择一名其他角色。你摸一张牌并与其猜拳（平局则重来）。若你赢，你对其造成1点伤害。若你没赢，你本阶段内使用牌时不能指定其为目标。",
  yui_jiang: "激昂",
  yui_jiang_info: "每当你使用（指定目标后）或被使用（成为目标后）一张【决斗】或红色的【杀】时，你可以摸一张牌。",
  yui_lieyin: "烈音",
  yui_lieyin_info: "锁定技，出牌阶段开始时，你选择一项：①本阶段内的红色牌均视为【杀】；②本阶段内的【杀】均视为【决斗】。",
  yui_takaramono: "珍宝",
  yui_takaramono_info: "觉醒技，准备阶段，若你满足以下条件中的至少两个：①体力值不大于1；②场上有已死亡的角色；③已因〖激昂〗累计获得过至少三张牌；则你获得技能〖引吭〗，将〖烈音〗描述中的「你选择」改为「你可选择」，然后加1点体力上限并回复1点体力。",
  //ユイ/孙笨双将组合时，孙笨的〖激昂〗不计入〖珍宝〗的次数统计
  yui_yinhang: "引吭",
  yui_yinhang_info: "锁定技，当你的体力值变化1点时，你可以令至多两名角色摸一张牌。",
  tsumugi_mugyu: "姆啾",
  tsumugi_mugyu_info: "当你成为牌的目标后，若你的手牌数小于体力上限，则你可以摸一张牌。",
  tsumugi_huilang: "回廊",
  tsumugi_huilang2: "回廊",
  tsumugi_huilang_info: "异能技，回合结束时，你可以将任意张牌扣置于武将牌下（均称为「隐」）。回合开始时，你获得所有「隐」，然后可令等量的角色各摸一张牌。",
  tsumugi_huilang_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  //〖回廊〗涉及的所有卡牌移动的结算不会触发〖良姻〗
  haruka_shuangche: "双掣",
  kanata_shuangche: "双掣",
  haruka_shuangche_backup: "双掣",
  haruka_shuangche_info: "出牌阶段，你可以视为使用任意基本牌或普通锦囊牌。此牌结算完成后，你选择一项：1.弃置X张牌。2.失去1点体力且本回合内不能再发动〖双掣〗。（X为你于此回合内发动过〖双掣〗的次数）",
  //你不能以此法使用〖回魂〗
  saya_shouji: "授计",
  saya_shouji_info: "每回合限一次，当你使用的牌结算完成后，你可以将此牌对应的所有实体牌交给一名其他角色。其可以使用这些牌中的一张，若如此做，你摸一张牌。",
  saya_powei: "破围",
  saya_powei_info: "限定技，回合结束后，你可以选择一名体力值大于你的其他角色。你与其交替进行额外回合，直到你与其中的一名角色死亡或进行到九个回合。你于回合开始时进行判定，若结果为红色，则你对其造成1点伤害。此过程中其他角色不计入距离和座次计算。",
  saya_judge: "破围",
  saya_nodis: "破围",
  //〖破围〗不会因为〖铁骑〗无效
  inari_baiwei: "摆尾",
  inari_baiwei_draw: "摆尾",
  inari_baiwei_info: "你可以将一张♦牌当做任意基本牌使用或打出。此牌结算完成后，你摸一张牌。",
  //你不能以此法使用【毒】
  inari_baiwei_backup: "摆尾",
  inari_baiwei_sha: "摆尾",
  inari_baiwei_shan: "摆尾",
  inari_huhun: "狐魂",
  inari_huhun_info: "锁定技，你的♣牌的花色均视为♦。你的手牌上限+1。",
  shiina_qingshen: "轻身",
  shiina_qingshen_info: "当你受到或造成伤害后，你可以获得此次伤害的渠道对应的实体牌，然后将等量的牌置于你的武将牌上，称为「轻」。锁定技，你的手牌上限和攻击范围+X（X为「轻」数）。",
  shiina_feiyan: "飞燕",
  shiina_feiyan_info: "一名其他角色的回合开始时，若其在你的攻击范围内，则你可以将一张「轻」置于弃牌堆，然后视为对其使用一张【杀】。若此【杀】未造成伤害，你摸一张牌。你于此【杀】的结算流程中视为拥有技能〖铁骑〗。",
  shiina_retieji: "铁骑",
  //你不能对稻荷和多鲁基发动〖飞燕〗
  sunohara_chengshuang: "成双",
  sunohara_chengshuang_phase: "成双",
  sunohara_chengshuang_info: "锁定技，游戏开始时，你选择你的性别。回合开始时，你可以切换你的性别。",
  sunohara_tiaoyin: "挑引",
  sunohara_tiaoyin_info: "出牌阶段限一次，你可以弃置任意张花色各不相同的手牌，然后获得等量角色区域内的各一张牌。若你以此法获得了异性角色区域内的牌，则你失去1点体力。",
  sunohara_jianren: "坚忍",
  sunohara_jianren_info: "当你受到伤害后，你可以令一名角色摸一张牌。若伤害无来源或来源与你性别不同，则改为摸三张牌。",
  rin_baoqiu: "暴球",
  rin_baoqiu_info: "锁定技，你的攻击范围+2。当你使用【杀】指定目标后，你进行判定。若结果：为红色，此【杀】对其的伤害值基数+1；为黑色，其无法闪避此【杀】；为♠/♥，此【杀】不计入使用次数限制且你摸一张牌；为♦/♣，目标角色的所有非锁定技失效直到回合结束，且你弃置其一张牌。",
  sasami_miaobian: "喵变",
  sasami_miaobian_info: "锁定技，当你的体力值变为：3以下时，你获得技能〖公清〗，2以下时，你获得技能〖复难〗，1以下时，你获得技能〖暴球〗。",
  sasami_gongqing: "公清",
  sasami_gongqing_info: "锁定技。当你受到伤害时，若伤害来源的攻击范围：<3，则你令此伤害的数值减为1。>3，你令此伤害+1。",
  sasami_funan: "复难",
  sasami_funan_info: "其他角色使用或打出牌响应你使用的牌时，你可令其获得你使用的牌（其本回合不能使用或打出这些牌），然后你获得其使用或打出的牌。",
  sasami_baoqiu: "暴球",
  sasami_baoqiu_info: "锁定技，你的攻击范围+2。当你使用【杀】指定目标后，你进行判定。若结果：为红色，此【杀】对其的伤害值基数+1；为黑色，其无法闪避此【杀】；为♠/♥，此【杀】不计入使用次数限制且你摸一张牌；为♦/♣，目标角色的所有非锁定技失效直到回合结束，且你弃置其一张牌。",
  akane_jugu: "巨贾",
  akane_jugu_info: "锁定技，1.你的手牌上限+X。2.游戏开始时，你摸X张牌（X为你的体力上限）。",
  akane_quanqing: "权倾",
  akane_quanqing_info: "出牌阶段，你可选择：1.弃置一张点数大于10的牌并对攻击范围内的一名其他角色造成1点伤害；2.弃置一张点数大于6的牌并弃置攻击范围内的一名其他角色区域内的一张牌。3.弃置一张牌并令攻击范围内的一名其他角色摸一张牌。",
  akane_yifu: "蚁附",
  akane_yifu2: "蚁附",
  akane_yifu_info: "主公技，其他键势力角色的出牌阶段限一次，其可交给你一张手牌。然后你摸一张牌，并将一张手牌交给该角色。",
  doruji_feiqu: "肥躯",
  doruji_feiqu_info: "锁定技，当你使用【杀】时，或你成为【杀】的目标后，你令此【杀】不可被响应。",
  yuiko_fenglun: "锋论",
  yuiko_fenglun_info: "出牌阶段限一次，你可以和一名其他角色拼点。若你赢，你本阶段内使用牌没有次数和距离限制。",
  yuiko_dilve: "底略",
  yuiko_dilve_info: "你可以使用牌堆底的一张牌进行拼点。当你拼点后，你可以获得两张拼点牌。",
  riki_spwenji: "问计",
  riki_spwenji_info: "出牌阶段开始时，你可以令一名其他角色交给你一张牌。你于本回合内使用与该牌名称相同的牌时不能被其他角色响应。",
  riki_nvzhuang: "女装",
  riki_nvzhuang_info: "锁定技，此武将牌视为包含女性性别。结束阶段，若你：有手牌，你摸一张牌；没有手牌，你摸两张牌。",
  riki_mengzhong: "梦终",
  riki_mengzhong_info: "觉醒技，准备阶段，若你已因〖问计〗获得了三张或更多的牌，则你加1点体力上限并回复1点体力，失去〖问计〗并获得〖重振〗。",
  riki_chongzhen: "重振",
  riki_chongzhen_info: "出牌阶段开始时，你可以与一名角色拼点。若你赢，你获得该角色手牌区，装备区，判定区的各一张牌；若你没赢，你于此阶段内使用牌时不能指定其他角色为目标。",
  hisako_yinbao: "音爆",
  hisako_yinbao_info: "当你受到伤害/回复体力后，你可以判定。若结果为♠，则你对一名其他角色造成1点雷属性伤害。",
  hisako_zhuanyun: "转运",
  hisako_zhuanyun_info: "异能技，你的判定会朝向对你有利的方向倾斜。",
  hisako_zhuanyun_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  hinata_qiulve: "球略",
  hinata_qiulve_info: "你可以将一张非基本牌当做【杀】使用或打出（无距离限制）。你以此法使用的红色【杀】不可被响应，黑色【杀】不计入使用次数限制。",
  hinata_ehou: "扼喉",
  hinata_ehou_info: "其他角色对你使用的牌结算完成后，你可对其使用一张【杀】。若此【杀】造成伤害，则你摸一张牌。",
  noda_fengcheng: "奉承",
  noda_fengcheng_info: "锁定技，其他角色交给你牌后，其摸一张牌。",
  noda_xunxin: "寻衅",
  noda_xunxin2: "寻衅",
  noda_xunxin_info: "出牌阶段限X次，你可以视为对一名体力值不小于你的角色使用【决斗】。若如此做，此【决斗】结算完成后，没赢的角色交给赢的角色一张牌。（X为你的体力值）",
  tomoya_shangxian: "伤弦",
  tomoya_shangxian_info: "锁定技，你计算与其他角色的距离时始终从逆时针方向计算。出牌阶段开始时，你可摸一张牌，并改变此方向。",
  tomoya_wangjin: "往今",
  tomoya_wangjin_info: "每项每轮各限一次。一名其他角色的回合结束时，若其：在你的攻击范围内，你可令其摸一张牌。若其的体力值小于你，则你摸一张牌，并可交给其一张牌。不在你的攻击范围内，则你摸两张牌，并令其弃置你的一张手牌。若其的体力值大于你，则你视为对其使用一张【杀】（无距离限制）。",
  nagisa_tiandu: "天妒",
  nagisa_tiandu_info: "异能技，当你的判定牌生效后，你可以获得此牌。",
  nagisa_tiandu_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  nagisa_fuxin: "抚心",
  nagisa_fuxin_info: "当一名角色于回合外受到伤害，或其手牌被其他角色弃置或获得后，你可以令其判定。若结果为：红色，其摸一张牌。黑色，当前回合角色弃置一张牌。",
  ayato_jianshen: "僭神",
  ayato_jianshen_info: "锁定技，你手牌中的【杀】均视为神属性。",
  ayato_zonghuan: "纵幻",
  ayato_zonghuan_info: "出牌阶段限一次，你可以观看一名其他角色的手牌，然后选择一项：将其中的一张牌置入弃牌堆，或以该角色的视角使用其中的一张，然后摸一张牌。",
  ao_xishi: "习事",
  ao_xishi_info: "锁定技，当你使用或打出♦牌时，或其他角色使用♦牌指定你为目标后，你摸一张牌。",
  ao_kuihun: "窥魂",
  ao_kuihun_info: "其他角色进入濒死状态时，你可以摸一张牌，然后观看其手牌并将其中一张牌置于你的武将牌上，称为「蝶」。你使用与一张「蝶」花色相同的牌时无距离和次数限制。你的手牌上限+X（X为蝶数）。",
  ao_shixin: "释心",
  ao_shixin_info: "觉醒技，准备阶段，若你的「蝶」中包含至少三种花色，则你加1点体力上限并回复1点体力，失去〖窥魂〗并获得〖蝶归〗。",
  ao_diegui: "蝶归",
  ao_diegui_backup: "蝶归",
  ao_diegui_info: "出牌阶段限一次，你可以将一张「蝶」交给一名角色，该角色摸两张牌并复原武将牌。",
  yuzuru_wuxin: "无心",
  yuzuru_wuxin_info: "结束阶段，你可以选择一项：失去1点体力并令一名角色摸两张牌，或弃置两张牌并回复1点体力。",
  yuzuru_deyi: "得义",
  yuzuru_deyi_info: "觉醒技，当有其他角色死亡后，你减1点体力上限并回复1点体力，失去技能〖无心〗，获得技能〖往生〗〖困奋〗和〖去疾〗。",
  yuzuru_wangsheng: "往生",
  yuzuru_wangsheng_info: "觉醒技，当你即将死亡时，你防止此次死亡。你可以将任意张牌交给一名其他角色，然后减1点体力上限并将体力回复至2点，修改技能〖困奋〗和〖去疾〗。",
  yuzuru_kunfen: "困奋",
  yuzuru_kunfen_info: "锁定技，结束阶段，你失去1点体力并摸两张牌。然后你可以将两张牌交给一名其他角色。",
  yuzuru_quji: "去疾",
  yuzuru_quji_info: "出牌阶段限一次，你可以弃置X张牌并选择至多等量已受伤的其他角色，这些角色各回复1点体力。若你以此法弃置了黑色牌，则你失去1点体力。（X为你已损失的体力值）",
  yuzuru_kunfen_rewrite: "困奋·改",
  yuzuru_kunfen_rewrite_info: "锁定技，结束阶段，你摸两张牌。然后你可以将两张牌交给一名其他角色。",
  yuzuru_quji_rewrite: "去疾·改",
  yuzuru_quji_rewrite_info: "出牌阶段限一次，你可以弃置X张牌并选择至多等量已受伤的其他角色，这些角色各回复1点体力。（X为你已损失的体力值）",
  yuzuru_bujin: "步进",
  yuzuru_bujin_info: "锁定技，己方其他角色计算与其他角色的距离-1且摸牌阶段的额定摸牌数+1。",
  kanade_mapo: "麻婆",
  kanade_mapo_info: "你可以将一张♥牌当做【麻婆豆腐】使用。你使用的【麻婆豆腐】可以多指定一个目标。",
  kanade_benzhan: "奔战",
  kanade_benzhan_info: "每回合限一次。当你使用或打出牌响应其他角色，或其他角色使用或打出牌响应你后，若此牌为：基本牌，你可令一名角色弃置两张牌或令一名角色摸两张牌；非基本牌，你可对一名角色造成1点伤害或令一名其他角色回复1点体力。",
  mio_tuifu: "推腐",
  mio_tuifu_info: "锁定技，当一名角色对一名同性角色造成伤害时，你摸一张牌。",
  mio_tishen: "替身",
  mio_tishen_info: "异能技，限定技，准备阶段，你可以将体力值回复至体力上限并摸等同于回复量的牌，然后将武将牌替换为【西园美鸟】。",
  mio_tishen_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  midori_nonghuan: "弄幻",
  midori_nonghuan_info: "异能技，出牌阶段限X次（X为你的体力值），你可以获得一名本阶段内未选择过的其他角色的区域内的一张牌。你摸一张牌，然后将一张牌交给该角色。然后你清除此技能结算过程中所有卡牌移动事件的移动记录。",
  midori_nonghuan_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  //即技能结算完成后，所有涉及到的牌移动事件不会再被getHistory获取
  midori_tishen: "替身",
  midori_tishen_info: "异能技，限定技，准备阶段，你可以将体力值回复至体力上限并摸等同于回复量的牌，然后将武将牌替换为【西园美鱼】。",
  midori_tishen_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  kyoko_juwu: "聚物",
  kyoko_juwu_info: "你的回合外，当有装备牌进入弃牌堆后，若这些牌不是从你的区域移动的，则你可以获得这些牌。",
  kyoko_zhengyi: "整遗",
  kyoko_zhengyi_info: "锁定技，若你装备区的花色数：大于等于1，你视为拥有〖精策〗；大于等于2，你视为拥有〖涉猎〗：大于等于3，你视为拥有〖制衡〗；大于等于4，你将〖精策〗和〖制衡〗改为界限突破版本。",
  kyoko_jingce: "精策",
  kyoko_shelie: "涉猎",
  kyoko_zhiheng: "制衡",
  shizuru_nianli: "念力",
  shizuru_nianli_info: "异能技，每轮限一次，你可以展示一张♦/♣/♥/♠手牌，然后视为使用一张不计入次数限制和记录的雷【杀】/【闪】/【桃】/【无懈可击】。",
  shizuru_nianli_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  shizuru_benzhan: "奔战",
  shizuru_benzhan_info: "每回合限一次。当你使用或打出牌响应其他角色，或其他角色使用或打出牌响应你后，若此牌为：基本牌，你可令一名角色弃置两张牌或令一名角色摸两张牌；非基本牌，你可对一名角色造成1点伤害或令一名其他角色回复1点体力。",
  shiorimiyuki_banyin: "伴音",
  shiorimiyuki_banyin_info: "当你受到伤害或回复体力后，你可令一名其他角色回复1点体力。",
  shiorimiyuki_tingxian: "铤险",
  shiorimiyuki_tingxian_info: "出牌阶段开始时，你可以摸至多三张牌。若如此做，你回复1点体力，且此阶段结束时你失去X点体力。（X为你得到的牌中仍在手牌区的牌的数量）",
  shiorimiyuki_tingxian2: "铤险",
  miki_shenqiang: "神枪",
  miki_shenqiang_info: "锁定技，游戏开始时，你将一张【海德洛格拉迪尔特·改】和一张【望远镜】置入你的装备区。你装备区内的武器牌和宝物牌不能被其他角色弃置。",
  miki_huanmeng: "幻梦",
  miki_huanmeng_info: "准备阶段开始时，你可以观看牌堆顶的X+1张牌并可以按任意顺序置于牌堆顶或牌堆底。（X为你装备区内的牌数）",
  miki_zhiluo: "治裸",
  miki_zhiluo_info: "锁定技，一名其他角色的回合结束时，若其在你的攻击范围内且其装备区内没有牌，则你选择：①摸一张牌。②视为对其使用一张【杀】。",
  miki_hydrogladiator: "海德洛",
  miki_hydrogladiator_info: "全名为【海德洛格拉迪尔特·改】。锁定技，当你因执行【杀】的效果而对目标角色造成伤害后，你弃置所有至目标角色距离为1的其他角色的一张牌或弃置其两张牌。",
  miki_hydrogladiator_skill: "海德洛格拉迪尔特·改",
  miki_binoculars: "望远镜",
  miki_binoculars_info: "锁定技，其他角色的手牌对你可见。",
  shiori_huijuan: "绘卷",
  shiori_huijuan_discard: "绘卷",
  shiori_huijuan_info: "锁定技，其他角色的结束阶段开始时，你可以视为使用一张该角色本回合出牌阶段内使用过的基本牌或普通锦囊牌。准备阶段开始时，若你自上个回合起以此法使用的牌数不小于X，则你选择一项：①弃置装备区或判定区内的一张牌。②跳过本回合的出牌阶段。（X为场上玩家数的一半且至少为2）",
  kaori_siyuan: "思愿",
  kaori_siyuan_info: "出牌阶段，你可以将一张装备牌或延时锦囊牌置于一名其他角色的装备区内，然后可以视为使用一张基本牌或普通锦囊牌。",
  akiko_dongcha: "洞察",
  akiko_dongcha_info_identity: "锁定技，其他角色的手牌对你可见。游戏开始时，你令其他角色的身份牌对你可见。",
  akiko_dongcha_info: "锁定技，其他角色的手牌对你可见。",
  abyusa_jueqing: "绝情",
  abyusa_jueqing_info: "当你对其他角色造成伤害时，你可以令此伤害值+X。若如此做，你失去X点体力，并于此伤害结算完成后修改〖绝情〗（X为伤害值）。",
  abyusa_jueqing_1st: "绝情",
  abyusa_jueqing_rewrite: "绝情·改",
  abyusa_jueqing_rewrite_info: "锁定技，你即将造成的伤害均视为失去体力。",
  abyusa_dunying: "遁影",
  abyusa_dunying_info: "锁定技，其他角色计算与你的距离时+X。准备阶段和结束阶段，你摸X张牌（X为你已损失的体力值）。",
  godan_yuanyi: "远忆",
  godan_yuanyi_info: "锁定技，回合开始时，你摸X张牌并进行一个额外的出牌阶段（X为游戏轮数且至多为3）。",
  godan_feiqu: "肥躯",
  godan_feiqu_info: "锁定技，当你使用【杀】时，或你成为【杀】的目标后，你令此【杀】不可被响应。",
  godan_xiaoyuan: "消元",
  godan_xiaoyuan_info: "觉醒技，当你扣减体力时，若你的体力值小于4，则你减3点体力上限并摸三张牌，失去【肥躯】。",
  yuu_lveduo: "掠夺",
  yuu_lveduo_info: "异能技，每轮限一次，其他角色的回合开始时，若你本局游戏内未对其发动过〖掠夺〗且你的武将牌正面朝上，你可以将武将牌翻面并获得该角色本回合内的控制权。此回合结束时，你将武将牌翻回正面。锁定技，若你的武将牌背面朝上，则你不能使用或打出牌。",
  yuu_lveduo_full_info: "每轮限一次，其他角色的回合开始时，若你本局游戏内未对其发动过〖掠夺〗且你的武将牌正面朝上，你可以将武将牌翻面并获得该角色本回合内的控制权。此回合结束时，你将武将牌翻回正面，获得该角色武将牌上所有的带有「Charlotte」标签的技能，且该角色失去这些技能。锁定技，若你的武将牌背面朝上，则你不能使用或打出牌。",
  yuu_lveduo_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  ryoichi_baoyi: "爆衣",
  ryoichi_baoyi_info: "锁定技，当你失去装备区内的一张牌后，你摸一张牌，然后选择一项：①令一名其他女性角色失去1点体力。②弃置一名其他非女性角色区域内的两张牌。",
  ryoichi_tuipi: "褪皮",
  ryoichi_tuipi_info: "锁定技，你不是【顺手牵羊】和【过河拆桥】的合法目标。你装备区的牌于弃牌阶段内计入手牌上限。",
  kotori_yumo: "驭魔",
  kotori_yumo_damage: "驭魔",
  kotori_yumo_gain: "驭魔",
  kotori_yumo_info: "异能技，游戏开始时，你获得蓝色、红色、绿色、黄色、灰色魔物各一个。当有角色受到伤害后，若你没有对应的标记，你根据其势力获得一个对应魔物：魏：蓝、蜀：红、吴：绿、群：黄、灰：晋、键：紫。回合开始时，你可以弃置一个对应的魔物并获得以下技能之一直到回合结束：蓝：魏业、红：蜀义、绿：吴耀、黄：群心、灰：晋势、紫：键魂。",
  kotori_yumo_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  kotori_skill_wei: "魏业",
  kotori_skill_wei_info: "回合开始时，你可以弃置一张牌并指定一名其他角色，该角色须弃置一张牌，否则你摸一张牌。",
  kotori_skill_shu: "蜀义",
  kotori_skill_shu_info: "你使用【杀】上限+1；出牌阶段结束时，若你于此阶段使用【杀】次数不少于2，摸一张牌。",
  kotori_skill_wu: "吴耀",
  kotori_skill_wu_info: "回合结束时，若你的手牌数不等于你的体力值，则你摸一张牌。",
  kotori_skill_qun: "群心",
  kotori_skill_qun_info: "锁定技，弃牌阶段开始时，若你的手牌数比体力值多2或更多，你本回合手牌上限+1；若你已损失体力值大于1，你手牌上限+1。",
  kotori_skill_key: "键魂",
  kotori_skill_key_info: "出牌阶段限一次，你可以摸一张牌并获得1点护甲。若如此做，你于当前回合结束时失去1点体力。",
  kotori_skill_jin: "晋势",
  kotori_skill_jin_info: "摸牌阶段结束时，你可以展示你于此阶段内因摸牌而得到的牌。若这些牌的花色均不同，则你摸一张牌。",
  kotori_yumo_wei: '<span class="thundertext">魔物</span>',
  kotori_yumo_shu: '<span class="firetext">魔物</span>',
  kotori_yumo_wu: '<span class="greentext">魔物</span>',
  kotori_yumo_qun: '<span class="yellowtext">魔物</span>',
  kotori_yumo_key: '<span class="legendtext">魔物</span>',
  kotori_yumo_jin: '<span class="icetext">魔物</span>',
  kotori_huazhan: "花绽",
  kotori_huazhan_info: "异能技，每回合每种魔物限一次，你可将一个蓝色/红色/绿色/黄色/紫色/灰色魔物当做【树上开花】使用。",
  kotori_huazhan_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  jojiro_shensu: "神速",
  jojiro_shensu_info: "你可以选择一至三项：1. 跳过判定阶段和摸牌阶段；2. 跳过出牌阶段并弃置一张装备牌；3. 跳过弃牌阶段并将你的武将牌翻面。你每选择一项，视为你对一名其他角色使用一张没有距离限制的【杀】。",
  jojiro_shensu1: "神速",
  jojiro_shensu2: "神速",
  jojiro_shensu4: "神速",
  jojiro_shunying: "瞬影",
  jojiro_shunying_info: "锁定技，回合结束时，若你本回合内跳过了阶段，则你选择一项：1.失去1点体力。2.移动至多X格并摸X张牌（X为你本回合内跳过的阶段数）。",
  shiroha_yuzhao: "预兆",
  shiroha_yuzhao_umi: "预兆",
  shiroha_yuzhao_info: "异能技，游戏开始时，你将牌堆顶的X张牌扣置于你的武将牌上，称为「兆」。一名角色的回合开始时，若你有「兆」且其至你的距离不大于1，则你将牌堆顶的X张牌扣置为「兆」，然后将等量的「兆」置于牌堆顶。（X为势力数）",
  shiroha_yuzhao_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  shiroha_guying: "孤影",
  shiroha_guying_info: "锁定技，每回合限一次，当你受到伤害/对其他角色造成伤害时，你进行判定。若结果为红色/黑色，此伤害-1/+1。",
  shiroha_guying_rewrite: "孤影·改",
  shiroha_guying_rewrite_info: "当你受到伤害/对其他角色造成伤害时，你可进行判定。若结果为红色/黑色，此伤害-1/+1。",
  shiroha_jiezhao: "解兆",
  shiroha_jiezhao_info: "一名角色的判定牌生效前，你可打出一张「兆」代替之。当你以此法移去最后一张「兆」后，你加1点体力上限并回复1点体力，然后修改〖孤影〗并随机获得以下技能中的一个：〖炒饭〗/〖习事〗/〖呣啾〗/〖结伴〗。",
  //猴年马月爆料再利用
  shizuku_sizhi: "思智",
  shizuku_sizhi2: "思智",
  shizuku_sizhi_info: "出牌阶段限一次，你可以弃置任意张点数之和为13的牌，然后摸两倍数量的牌。以此法得到的牌中，黑色牌本回合无距离和次数限制，红色牌本回合不计入手牌上限。",
  shizuku_biyi: "避忆",
  shizuku_biyi_info: "当你受到伤害后，你可以进行一次判定，然后若你弃置任意张点数之和与判定结果点数相同的牌，你回复1点体力。",
  shizuku_sanhua: "散花",
  shizuku_sanhua_info: "当你死亡时，你可令一名其他角色从牌堆中获得四张名称各不相同的基本牌。",
  hiroto_huyu: "虎驭",
  hiroto_huyu2: "虎驭",
  hiroto_huyu_info: "其他角色的出牌阶段结束时，若你没有技能〖纵略〗，则其可将两张手牌交给你。若如此做，你获得〖纵略〗。你的下回合结束时，你失去〖纵略〗并将本回合内得到的所有牌交给该角色。",
  hiroto_zonglve: "纵略",
  hiroto_zonglve_info: "异能技，你的手牌上限+3。出牌阶段限一次，你可以将一张手牌背面朝下放置，并展示一名其他角色的一张手牌。若这两张牌：颜色相同，你对其造成1点伤害并弃置其展示的牌。颜色不同，你获得该角色区域内的两张牌。",
  hiroto_zonglve_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  hiroto_tuolao: "脱牢",
  hiroto_tuolao_info: "觉醒技，回合结束后，若此回合不是你的第一个回合且你此回合未因〖虎驭〗失去过牌，则你摸三张牌，失去〖虎驭〗并获得〖纵略〗。",
  sakuya_junbu: "均步",
  sakuya_junbu_info: "锁定技，若你已废除的装备栏数量：≥1，你使用牌无距离限制。≥2，你使用牌无次数限制。≥3，你使用牌时可以多指定一个目标。≥4，你使用的牌不可被响应。≥5，你使用牌造成伤害时失去1点体力，令此伤害+1。",
  rumi_shuwu: "淑武",
  rumi_shuwu2: "淑武",
  rumi_shuwu_info: "锁定技，你使用【杀】无距离和次数限制，你使用普通锦囊牌选择目标后，可增加一个目标。出牌阶段结束时，你令X=0，且每满足一项便令X+1：①你于本阶段内使用【杀】的次数不大于1。②你于本阶段内未使用锦囊牌造成过伤害。③你的体力值不大于3。你摸X张牌，且本回合手牌上限+X。",
  chihaya_liewu: "烈武",
  chihaya_liewu2: "烈武",
  chihaya_liewu_info: "锁定技，你使用【杀】无距离和次数限制，你使用普通锦囊牌选择目标后，可增加一个目标。当你首次废除最后一个装备栏后，你减4点体力上限并获得技能〖怀柔〗。",
  chihaya_youfeng: "游凤",
  chihaya_youfeng_info: "转换技，阴，每轮限一次，你可以加1点体力上限，视为使用一张普通锦囊牌；阳，每轮限一次，你可以废除你的一个装备栏，视为使用一张基本牌。",
  chihaya_huairou: "怀柔",
  chihaya_huairou_info: "出牌阶段，你可以重铸装备牌。",
  yukito_kongwu: "控物",
  yukito_kongwu_info: "出牌阶段限一次，你可以表演《小空飞天》。若如此做，你从以下项目中随机选择X项，并执行其中的一项：①令一名角色摸两张牌。②对一名角色造成1点伤害。③令一名已受伤的角色回复1点体力。④弃置一名角色区域内的两张牌。⑤移动场上的一张牌。若X=0，则你弃置两张牌。（X为你的得分）",
  yukito_yaxiang: "鸦翔",
  yukito_yaxiang_info: "限定技，当有角色进入濒死状态时，你可移去此武将牌，然后令该角色将体力值回复至3点，弃置判定区的所有牌并获得技能〖终愿〗。",
  misuzu_zhongyuan: "终愿",
  misuzu_zhongyuan_info: "限定技。当你的判定结果生效时，你可将判定结果改为任意花色和点数并结束此时机。",
  asara_shelu: "摄录",
  asara_shelu_info: "出牌阶段限一次，你可以弃置一张牌，然后展示一名其他角色的一张手牌并将其置于你的武将牌上，称为“影”。若你以此法弃置的牌和展示的牌：花色相同，则你摸两张牌。点数相同，则你回复1点体力。",
  asara_yingwei: "影威",
  asara_yingwei_info: "你可以如手牌般使用或打出“影”。锁定技，当你使用“影”时，强制触发对应的应变效果。",
  kotomi_qinji: "琴击",
  kotomi_qinji_info: "出牌阶段开始时，你可视为使用【万箭齐发】。你以此法使用【万箭齐发】造成的伤害视为失去体力。",
  kotomi_chuanxiang: "传箱",
  kotomi_chuanxiang2: "传箱",
  kotomi_chuanxiang_info: "其他角色的出牌阶段限一次，其可以将装备区内的一张牌移动到另一名角色的装备区内，然后你摸一张牌。若你是目标角色，则你改为摸两张牌。",
  mia_shihui: "时迴",
  mia_shihui_info: "锁定技，摸牌阶段，你改为摸X+1张牌（X为你上回合弃置的牌数）；结束阶段，你弃置一张牌并回复1点体力。",
  mia_qianmeng: "潜梦",
  mia_qianmeng_info: "使命技。①游戏开始时，你摸一张牌，然后将一张牌置于牌堆的正中央。②使命：当有角色获得“潜梦”牌时，其将此牌交给你。你将体力值回复至上限，失去〖时迴〗并获得〖风发〗。③失败：当你死亡时，你可令一名角色获得牌堆中所有与“潜梦”牌花色点数相同的牌。",
  mia_fengfa: "风发",
  mia_fengfa_info: "锁定技。摸牌阶段，你多摸X张牌（X为你上回合使用过的牌数）。",
  kano_liezhen: "列阵",
  kano_liezhen_info: "结束阶段，若你本回合内使用过牌且这些牌的类型：不均相同，你可视为使用【排兵布阵】或智囊；均相同，你获得仁库中的所有牌（没有则改为摸两张牌）。",
  kano_paibingbuzhen: "排兵布阵",
  kano_paibingbuzhen_info: "出牌阶段，对至多三名角色使用。目标角色摸一张牌，然后将一张牌置入仁库。若仁库中的牌类型或颜色均相同，则你摸一张牌。",
  kano_poyu: "破羽",
  kano_poyu_info: "异能技，当你成为【杀】或伤害性锦囊牌的目标后，若仁库中有牌，你可判定。然后你可从仁库中移去一张与此牌类型或花色相同的牌，令此牌对你无效。",
  kano_poyu_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  liyingxia_sanli: "三礼",
  liyingxia_sanli_info: "锁定技。其他角色于其回合内前两次使用牌指定你为目标后，你摸一张牌；第三次使用牌指定你为目标后，你交给其一张牌。",
  liyingxia_zhenjun: "振军",
  liyingxia_zhenjun_info: "键势力技。结束阶段，你可以令至多X+1名角色各摸一张牌，且这些角色于自己的下个回合内第一次造成的伤害+1（X为你本回合内使用【杀】和伤害性锦囊牌的次数）。",
  liyingxia_wumai: "武脉",
  liyingxia_wumai_info: "蜀势力技。每轮开始时，你可以选择获得其中一个未选择过的技能直到本轮结束：〖八阵〗/〖集智〗/〖观星〗/〖游龙〗。若均已选择过，则你可以摸X张牌（X为场上已受伤的角色数且至多为3）。",
  erika_shisong: "识诵",
  erika_shisong_info: "异能技，①你的手牌上限+X（X为你的护甲数）。②当你于回合内使用第Y张牌时，若此牌与你上回合使用的第Y张牌类型相同，则你摸一张牌。",
  erika_shisong_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  erika_yousheng: "佑生",
  erika_yousheng_info: "使命技。①限定技。每轮开始时，你可以选择至多两名其他角色。你减2点体力上限并增加3点护甲。②当你〖佑生①〗选择的角色成为【杀】或伤害类锦囊牌的目标时，你可以弃置X张牌并将此目标转移给自己（X为你本轮内发动过〖佑生②〗的次数）。此牌结算结束后，你可令一名原目标角色获得此牌。③成功：当你失去最后的护甲后，若你已发动过〖佑生①〗，则你和所有〖佑生①〗选择的角色各摸三张牌。④失败：当一名〖佑生①〗选择的角色因【杀】或伤害类锦囊牌而受到伤害时，你失去所有护甲并弃置等量的牌。",
  erika_yousheng_append: '<span style="font-family: yuanli">Death is not the end of life, but the completion of life.</span>',
  satomi_luodao: "落刀",
  satomi_luodao_info: "当你使用【杀】指定目标后，你可以展示目标角色的所有手牌。若其中：有【闪】，则你弃置其中的一张【闪】；没有【闪】，则你弃置一张牌。",
  satomi_daohai: "稻海",
  satomi_daohai_info: "结束阶段，若你本回合内弃置过牌，则你可以视为使用一张【五谷丰登】。然后你可以将你于此【五谷丰登】中得到的牌当做【乐不思蜀】使用。",
  satomi_daohai_append: '<span style="font-family: yuanli">五穀豊穣、刈り入れ時だね！</span>',
  tenzen_fenghuan: "封还",
  tenzen_fenghuan_info: "其他角色使用的【杀】或伤害性锦囊牌结算结束后，若你是此牌的唯一目标，则你可以弃置任意张点数之和大于等于此牌点数两倍的牌，然后视为对其使用一张名称相同的牌。",
  tenzen_retianquan: "天全",
  tenzen_retianquan_info: "每回合限一次。当你使用【杀】指定目标后，你可失去1点体力或弃置一张牌，然后亮出牌堆顶的三张牌（若你的体力值小于体力上限的50%，则改为展示五张牌）。这些牌中每有一张基本牌，响应此牌所需的【闪】的数量便+1。此牌结算结束后，若此牌造成过伤害，则你获得展示牌中的所有非基本牌。",
  iriya_yinji: "殷极",
  iriya_yinji_info: "锁定技。出牌阶段开始时，你将手牌摸至十七张。你不能直接使用以此法得到的牌。",
  iriya_haozhi: "豪掷",
  iriya_haozhi_info: "出牌阶段，你可以按照斗地主牌型弃置至少两张牌，且其他角色可以依次对其进行一轮响应。最后一名进行响应的角色可以根据对应牌型执行对应效果。对子：其可以令至多两名角色各摸一张牌。三带：其可以弃置至多三名其他角色的各一张牌，然后摸一张牌。单顺：其可以弃置一名其他角色的一张牌。若其未以此法弃置过颜色相同的牌，则其可以重复此流程。然后其摸等量的牌。双顺：其可以获得一名其他角色的一张牌。若其未以此法获得过颜色相同的牌，则其可以重复此流程。然后其回复等量的体力。三顺/飞机：其可以令至多3名其他角色翻面，然后对其中一名角色造成1点火属性伤害。炸弹/四带二：其可以对一名角色造成2点雷属性伤害，然后目标角色翻面，弃置装备区的所有牌和四张手牌。",
  visible_fuuko_xingdiao: '<span data-nature="soilmm">星</span>',
  fuuko_xingdiao: "星雕",
  fuuko_xingdiao_info: "锁定技。游戏开始时，你将手牌摸至八张，然后将所有手牌明置（称为“星”，不计入手牌上限）。每名其他角色限一次，其可以于出牌阶段选择获得你的一张“星”，然后你摸一张牌。",
  fuuko_chuanyuan: "传愿",
  fuuko_chuanyuan_info: "锁定技。当你失去一张“星”后，你回复1点体力，然后从牌堆中获得一张和“星”花色点数相同的牌（没有则改为摸一张牌，且使用此牌无距离和次数限制）。",
  key_kagari: "篝",
  kagari_zongsi: "纵丝",
  kagari_zongsi_info: "出牌阶段限一次，你可以选择一张不在游戏外的牌，然后将其置于牌堆/弃牌堆的顶部/底部或一名角色的对应区域内。",
  key_shiki: "神山识",
  key_shiki_ab: "神山识",
  shiki_omusubi: "御结",
  shiki_omusubi_info: "每轮开始时，你可以减1点体力上限，然后将一名其他角色武将牌上的技能加入到你的武将牌上。",
  shiki_omusubi_append: '<span style="font-family: yuanli">来吧，羽依里。用你的手，让我变成那只真正的鬼吧！</span>',
  db_key_hina: "佐藤雏",
  hina_shenshi: "神视",
  hina_shenshi_yingbian: "神视",
  hina_shenshi_info: "神势力技。出牌阶段开始时/结束时，你可摸两张牌，然后将其中一张牌置于牌堆顶。你以此法得到的牌视为拥有全部应变效果，且可以无条件发动。",
  hina_xingzhi: "幸凪",
  hina_xingzhi_info: "键势力技。每回合限一次，你可以通过“助战”触发一张牌的全部应变效果，且响应助战的角色摸两张牌。",
  key_kud: "库特莉亚芙卡",
  kud_qiaoshou: "巧手",
  kud_qiaoshou_equip: "巧手",
  kud_qiaoshou_end: "巧手",
  kud_qiaoshou_backup: "巧手",
  kud_qiaoshou_info: "出牌阶段限一次/结束阶段开始时，若你没有“巧”，则你可以将一张手牌当作任意一张武器牌或进攻坐骑牌/防具牌或防御坐骑牌置入装备区（不占用装备区栏位），称为“巧”。出牌阶段结束时/准备阶段开始时，你将“巧”置入弃牌堆。",
  kud_buhui: "不悔",
  kud_buhui_info: "限定技，当你进入濒死状态时，你可弃置装备区内的所有牌（至少一张）并摸等量的牌，将体力回复至2点，获得技能〖重振〗。",
  key_misuzu: "神尾观铃",
  misuzu_hengzhou: "恒咒",
  misuzu_hengzhou_info: "锁定技，准备阶段开始时，或当你受到1点伤害或回复1点体力后，你获得一个“诅咒”标记。你的手牌上限和摸牌阶段的额定摸牌数+X。结束阶段开始时，若X大于3，则你移去所有“诅咒”标记并失去1点体力。（X为“诅咒”标记数）",
  misuzu_nongyin: "浓饮",
  misuzu_nongyin_info: "当你需要使用【桃】时，你可将一张红色非锦囊牌当做【乐不思蜀】置入自己的判定区，然后视为使用一张【桃】。",
  misuzu_zhongxing: "终幸",
  misuzu_zhongxing_info: "每回合限一次，当你判定区的牌移动到其他区域后，你可令一名角色回复1点体力或摸两张牌。",
  key_kamome: "久岛鸥",
  kamome_yangfan: "扬帆",
  kamome_yangfan_info: "锁定技，游戏开始时，你将一张【旅行箱】置入你的装备区。当你失去装备区内的一张牌后，你摸两张牌。",
  kamome_huanmeng: "幻梦",
  kamome_huanmeng_info: "准备阶段开始时，你可以观看牌堆顶的X+1张牌并可以按任意顺序置于牌堆顶或牌堆底。（X为你装备区内的牌数）",
  kamome_jieban: "结伴",
  kamome_jieban_info: "转换技。每回合限一次，当你受到或造成伤害后，阴：你可将两张牌交给一名其他角色，然后其交给你一张牌。阳：你可将一张牌交给一名其他角色，然后其交给你两张牌。",
  kamome_suitcase: "旅行箱",
  kamome_suitcase_info: "锁定技，你跳过你的判定阶段和弃牌阶段；当你即将翻面时，取消之。",
  key_nao: "友利奈绪",
  nao_duyin: "独隐",
  nao_duyin2: "独隐",
  nao_duyin_info: "异能技，一名其他角色的回合开始时，若你本局游戏内未对其发动过〖独隐〗，则你可以弃置一张牌或将武将牌翻面。若如此做，你不能成为其使用牌的目标，且对其使用牌没有距离限制且不计入使用次数直到你的下回合结束。",
  nao_duyin_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  nao_wanxin: "挽心",
  nao_wanxin_info: "一名角色的回合结束时，你可以令一名本回合内受到过伤害的角色摸两张牌，然后你与其将武将牌重置。",
  nao_shouqing: "守情",
  nao_shouqing2: "守情",
  nao_shouqing3: "守情",
  nao_shouqing_info: "其他角色的出牌阶段内可以对你使用非转化的【桃】。若如此做，其摸一张牌，且本局游戏内的手牌上限+1。",
  key_yuuki: "冰室忧希",
  yuuki_yicha: "异插",
  yuuki_yicha_info: "出牌阶段开始时，你可依次进行两次判定并将判定牌依次置入两行三列方阵的两个随机位置中。然后你依次进行四次判定，每次可将当前判定牌置入空方格，且须与相邻方格的牌颜色均不同。若如此做，你令一名角色获得方阵内的所有牌。",
  key_kyouko: "伊座并杏子",
  kyouko_rongzhu: "容助",
  kyouko_rongzhu_info: "其他角色不因此技能而得到你的牌后，你可摸一张牌，然后交给其一张牌。若其是当前回合角色，则其本回合使用【杀】的次数上限+1；若你是当前回合角色，则你本回合的手牌上限+1。",
  kyouko_gongmian: "共勉",
  kyouko_gongmian_use: "共勉",
  kyouko_gongmian_exchange: "共勉",
  kyouko_gongmian_info: "①出牌阶段，你可以选择一名未以此法选择过的角色，若其手牌：大于你，你获得其一张牌，然后交给其一张牌；小于你，其交给你一张牌，然后你交给其一张牌；等于你，你与其各摸一张牌。②出牌阶段结束时，你可以获得一名其他角色区域内的至多X张牌，然后交给其等量的牌。③弃牌阶段开始时，若X不小于你的体力值，你可以获得一名手牌数少于你的角色的所有手牌，然后将手牌数的一半（向上取整）交给该角色。（X为你本回合内发动过〖共勉①〗的次数）",
  key_tenzen: "加纳天善",
  key_kotarou: "天王寺瑚太朗",
  kotarou_aurora: "丝刃",
  kotarou_aurora_info: "异能技，当扣减体力或增加体力上限后，若你的装备区内：有武器牌，你视为使用一张【杀】；没有武器牌，你使用牌堆中的一张不为赠物的武器牌。",
  kotarou_aurora_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  kotarou_rewrite: "改写",
  kotarou_rewrite_damage: "改写",
  kotarou_rewrite_recover: "改写",
  kotarou_rewrite_sha: "改写",
  kotarou_rewrite_block: "改写",
  kotarou_rewrite_info: "异能技，出牌阶段，你可选择：①视为使用一张本局游戏没有以此法使用过的基本牌或普通锦囊牌；②移动场上的一张牌；③增加1点体力上限并失去1点体力（体力上限至多为5）；④下一次造成的伤害+1；⑤下一次回复的体力值+1；⑥本回合内的手牌上限和使用【杀】的使用次数+1。若你于本回合内发动过〖改写〗的次数超过两次，则你令此技能失效，且于回合结束后将体力上限降至3点，失去〖丝刃〗和〖改写〗。",
  kotarou_rewrite_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  key_kyou: "藤林杏",
  kyou_zhidian: "掷典",
  kyou_zhidian_info: "你可以将一张锦囊牌当做【杀】使用（无距离限制）。当你使用【杀】指定第一个目标后，你选择一个与上次不同的选项：①此【杀】不可被响应。②此【杀】无视防具。③此【杀】伤害+1。④此【杀】不计入次数限制。",
  kyou_duanfa: "断发",
  kyou_duanfa_info: "限定技，当你受到伤害时，若伤害值不小于你的体力值，则你可弃置所有手牌，防止此伤害并回复1点体力；且当你于你的下回合开始前成为【杀】或伤害性锦囊牌的目标后，你摸一张牌。",
  key_seira: "樱庭星罗",
  seira_xinghui: "星辉",
  seira_xinghui_info: "准备阶段，你可以投掷一枚骰子，观看牌堆顶的X张牌（X为投掷点数）并以任意顺序扣置于一名没有“星屑”的角色的武将牌上，称为“星屑”。有“星屑”的角色造成的伤害+1，且当其从牌堆顶摸牌或取得判定牌时，改为从“星屑”中获取。",
  seira_yuanying: "缘映",
  seira_yuanying_info: "出牌阶段限一次，你可选择两名角色。这两名角色成为“姻缘者”且获得〖姻缘〗直到你下次发动〖缘映〗。",
  seira_yinyuan: "姻缘",
  seira_yinyuan_info: "你的手牌对其他“姻缘者”可见。出牌阶段限一次，你可以获得一名其他“姻缘者”区域内的一张牌，然后其回复1点体力。",
  key_kiyu: "露娜Ｑ",
  kiyu_yuling: "玉灵",
  kiyu_yuling_info: "异能技，你不是有距离限制的锦囊牌的合法目标；你成为【杀】的目标后，使用者需弃置X张牌（X为其至你的距离）。",
  kiyu_yuling_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  kiyu_rexianyu: "先预",
  kiyu_rexianyu_info: "异能技，每轮限一次。出牌阶段结束时，你可以选择一名其他角色。该角色于下个出牌阶段内使用第X张牌时，其可以将一张牌当做你本阶段内使用的第X张基本牌或普通锦囊牌使用（X至多为3）；若如此做，你摸一张牌，且其本回合的手牌上限+1。",
  kiyu_rexianyu_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  key_tomoyo: "坂上智代",
  tomoyo_wuwei: "武威",
  tomoyo_wuwei_info: "①每回合每种花色限一次。你可以将一张手牌当做【杀】使用或打出。②当有角色使用【闪】后，若你在其攻击范围内，你可以对其使用一张【杀】（无距离限制）。",
  tomoyo_zhengfeng: "整风",
  tomoyo_zhengfeng_info: "使命技。①准备阶段，你可以令攻击范围内的一名角色进行判定。若如此做，你获得如下效果直到下回合开始：你视为在该角色的攻击范围内，且当该角色使用与判定牌颜色相同的牌时，你摸一张牌。②失败：结束阶段，若你于本回合内未发动过〖整风①〗，则你可以减1点体力上限。你失去〖武威〗，摸两张牌并回复1点体力，然后获得〖长誓〗。",
  tomoyo_changshi: "长誓",
  tomoyo_changshi_info: "锁定技。一名攻击范围内包含你的角色回复体力后，你获得1点护甲；一名攻击范围内包含你的角色一次性获得至少两张牌后，你摸一张牌。",
  key_minagi: "远野美凪",
  minagi_peiquan: "配券",
  minagi_peiquan_info: "锁定技。①游戏开始时，你将你所有的手牌记录为“米券”。②出牌阶段，你可以赠予一张“米券”，然后执行一项本回合内未被选择过的效果：⒈对其造成1点伤害；⒉摸两张牌；⒊弃置其的两张牌；⒋亮出牌堆顶的一张牌，然后你可以使用之。",
  minagi_huanliu: "幻流",
  minagi_huanliu_info: `准备阶段开始时，你可与一名其他角色进行“${get.poptip("rule_xieli")}”，并获得“远野小满”的所有技能直到目标角色的结束阶段开始。若“协力”成功，则你可以将所有手牌记录为“米券”。`,
  key_michiru: "远野小满",
  michiru_sheyuan: "舍愿",
  michiru_sheyuan_info: "异能技，每轮限一次。若你没有“米券”，则你可以将所有手牌当做任意基本牌或普通锦囊牌使用，然后摸等量的牌。",
  michiru_sheyuan_append: `<span style="font-family:yuanli">异能技：带有Charlotte标签，带有该标签的技能不受【技能失效】效果以及【技能失去】效果的影响</span>`,
  minagi_tag: "米券"
};
const voices = {
  "#yuri_xingdong1": "では、オペレーション・スターーート！！",
  "#yuri_xingdong2": "では、オペレーション・スタート！",
  "#yuri_xingdong3": "では、オペレーションスタート！",
  "#yuri_xingdong_gain1": "…さすがね、あたしの勘",
  "#yuri_xingdong_gain2": "あたしの予想ではね",
  "#yuri_wangxi1": "賢明ね。これでようやくあなたにも戦線で戦う目的が生まれたってわけね",
  "#yuri_wangxi2": "落ち着いて…ここは地獄なんかじゃないわ",
  "#key_yuri:die": "ひどい…リーダーね",
  "#kanade_mapo1": "よくこの麻婆豆腐を前にぼーっとできるものね",
  "#kanade_mapo2": "…あたし、麻婆豆腐が好きなの？",
  "#kanade_benzhan1": "ガードスキル・ハンドソニック・バージョン２",
  "#kanade_benzhan2": "ガードスキル・ハンドソニック",
  "#kanade_benzhan3": "ハンドソニック",
  "#sp_key_kanade:die": "死ぬことなんで…あるの？",
  "#yui_jiang1": "みんな、こんなものかぁーー！？",
  "#yui_jiang2": "盛り上がって行くぜぇー！！",
  "#yui_lieyin1": "いくぞー！ワン、ツー、スリー、フォー！！",
  "#yui_lieyin2": "さあ、皆さん、演奏スタートですっ",
  "#yui_takaramono1": "よかった…",
  "#yui_takaramono2": "ほんとに…あたしが打ったの…？",
  "#key_yui:die": "あたしの…幸せ、ぜんぶ奪っていったんだ…",
  "#shiina_qingshen1": "あさはかなり…",
  // /-????
  // "#shiina_qingshen1": "哼——",
  "#shiina_retieji1": "もうその必要はない",
  "#key_shiina:die": "これは…悪夢か？",
  "#shiorimiyuki_banyin1": "おふたり、おめでとうございまーす！！",
  "#shiorimiyuki_banyin2": "お二人ともすごく素敵です！！",
  "#shiorimiyuki_tingxian1": "ですよねー！では、みゆきちで／え？　あたしが何！？",
  "#shiorimiyuki_tingxian2": "うわっ、こいつひさ子先輩にキレたっ！／逃げたほうがいいよ！",
  "#key_shiorimiyuki:die": "呜啊啊啊啊啊啊——",
  "#hisako_yinbao1": "関根、てめぇーーー！！",
  "#hisako_yinbao2": "お、ま、え、な…",
  "#key_hisako:die": "あたしの人生は一体なんだったと思う？",
  "#noda_xunxin1": "勝負は！？どっちの勝ちなんだ！？",
  "#noda_xunxin2": "はっ！なら…試してやろう",
  "#noda_fengcheng1": "ゆりっぺ…俺はお前のそばでお前を守りたい",
  "#noda_fengcheng2": "わかった…お前の言葉を信じる",
  "#key_noda:die": "噗啊啊啊啊啊啊啊——",
  "#abyusa_jueqing1": "私は感情など持ち合わせていませんので",
  "#abyusa_jueqing2": "人をお化けのように言わないでください",
  "#abyusa_dunying1": "だからそれはあなたが気づいていないだけで、いきなり現れたりなどしていません",
  "#abyusa_dunying2": "ちゃんと歩いてあなたの前に現れています。それに気づくか気づかないかはあなた次第かと",
  "#key_abyusa:die": "嗯…",
  "#hinata_qiulve1": "１番、お前な",
  "#hinata_qiulve2": "よっしゃー！俺も続くぜ！",
  "#hinata_ehou1": "てめぇ、何様だよぉぉぉーーーっ！！",
  "#hinata_ehou2": "そっっっいうのが一番むかつくんだよっ！！！",
  "#key_hinata:die": "呜哇啊啊啊啊啊啊啊啊——————————",
  "#shiki_omusubi1": "始めるんだ…神山識",
  "#shiki_omusubi2": "大切な人を守るために！",
  "#key_shiki:die": "ありがとう…羽依里くん…",
  "#saya_shouji1": "じゃあ…Game Start!",
  "#saya_shouji2": "いくつかポイントがあるの",
  "#saya_powei1": "決して任務には失敗しないんだ！",
  "#saya_powei2": "ただ、もう一度だけトライさせてもらえるかしら",
  "#key_saya:die": "砰——"
};
const characterSort = {
  key_one: ["key_rumi"],
  key_kanon: ["key_shiori", "key_kaori", "key_akiko"],
  key_air: ["key_haruko", "key_yukito", "key_crow", "key_kano", "key_misuzu", "key_minagi", "key_michiru"],
  key_clannad: ["key_yukine", "key_sunohara", "key_tomoya", "key_nagisa", "key_kotomi", "key_fuuko", "key_kyou", "key_tomoyo"],
  key_littlebusters: ["key_kyousuke", "key_komari", "key_masato", "key_kengo", "key_saya", "key_harukakanata", "key_rin", "key_sasami", "key_doruji", "key_yuiko", "key_riki", "key_mio", "key_midori", "key_kud", "key_yuuki"],
  key_rewrite: ["key_lucia", "key_akane", "key_shizuru", "key_kotori", "key_sakuya", "key_chihaya", "key_asara", "key_kagari", "key_kotarou"],
  key_angelbeats: ["sp_key_yuri", "key_yuri", "key_iwasawa", "key_yoshino", "key_yui", "key_shiina", "key_hisako", "key_hinata", "key_noda", "key_ayato", "key_yuzuru", "sp_key_kanade", "key_shiorimiyuki", "key_abyusa", "key_godan"],
  key_charlotte: ["key_yusa", "key_misa", "key_yuu", "key_jojiro", "key_nao"],
  key_harmonia: ["key_rei"],
  key_summerpockets: ["key_umi", "key_umi2", "key_tsumugi", "key_inari", "key_ao", "key_kyoko", "key_miki", "key_ryoichi", "key_shiroha", "key_shizuku", "key_shiki", "key_kamome", "key_tenzen"],
  key_kamisamaninattahi: ["key_hiroto", "key_youta", "db_key_hina", "key_kyouko"],
  key_loopers: ["key_mia"],
  key_lunaria: ["key_iriya", "key_kiyu"],
  key_heavenburnsred: ["db_key_liyingxia", "key_erika", "key_satomi", "key_seira"]
};
const characterSortTranslate = {
  key_one: "ONE ～辉之季节～",
  key_kanon: "Kanon",
  key_air: "AIR",
  key_clannad: "Clannad",
  key_littlebusters: "Little Busters!",
  key_rewrite: "Rewrite",
  key_angelbeats: "Angel Beats!",
  key_charlotte: "Charlotte",
  key_harmonia: "Harmonia",
  key_summerpockets: "Summer Pockets",
  key_kamisamaninattahi: "成神之日",
  key_loopers: "Loopers",
  key_lunaria: "LUNARiA",
  key_heavenburnsred: "炽焰天穹"
};
game.import("character", function() {
  if (lib.config.characters.includes("key")) {
    lib.group.add("key");
  }
  return {
    name: "key",
    connect: true,
    character: { ...characters },
    characterSort: {
      key: characterSort
    },
    characterFilter: {
      key_jojiro(mode) {
        return mode == "chess" || mode == "tafang";
      },
      key_yuu(mode) {
        return mode == "identity" || mode == "doudizhu" || mode == "single" || mode == "versus" && _status.mode != "standard" && _status.mode != "three";
      },
      key_tomoya(mode) {
        return mode != "chess" && mode != "tafang" && mode != "stone";
      },
      key_sunohara(mode) {
        return mode != "guozhan";
      }
    },
    characterTitle: {
      key_kotomi: "#g落英逐紫裙",
      key_jojiro: "战棋专属角色",
      key_kud: "#b千夜",
      key_misuzu: "#b长发及腰黑长直",
      key_kamome: "#b仿生纱",
      key_nao: "#b潮鸣",
      key_kyou: "#b长发及腰黑长直",
      key_yuuki: "#b4399司命",
      key_kyouko: "#b阿阿阿687",
      key_tenzen: "#b皋耳击",
      key_kotarou: "#bb1154486224",
      key_seira: "#b阿开木木W🍀",
      key_kiyu: "#b无面◎隐者",
      key_tomoyo: "#b长发及腰黑长直",
      key_minagi: "#b无面◎隐者"
    },
    card: { ...cards },
    skill: { ...skills },
    translate: { ...translates, ...voices, ...characterSortTranslate },
    pinyins: { ...pinyins }
  };
});
