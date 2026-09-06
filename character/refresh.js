import { lib, get, _status, game, ui } from "noname";
const characters = {
  re_xushu: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["zhuhai", "qianxin"]
  },
  re_lidian: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["xunxun", "xinwangxi"],
    dieAudios: ["lidian"]
  },
  re_zhongyao: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["rehuomo", "zuoding"],
    clans: ["颍川钟氏"]
  },
  xin_zhangliang: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["rejijun", "refangtong"]
  },
  re_simalang: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["requji", "rejunbing"],
    names: "司马|朗"
  },
  re_zhugedan: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["regongao", "rejuyi"],
    names: "诸葛|诞",
    clans: ["琅琊诸葛氏"]
  },
  re_caorui: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["huituo", "remingjian", "xingshuai"],
    isZhugong: true
  },
  re_caochong: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["rechengxiang", "renxin"]
  },
  ol_zhangzhang: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["olzhijian", "olguzheng"],
    names: "张|昭-张|纮"
  },
  re_jsp_huangyueying: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["rejiqiao", "relinglong"]
  },
  re_zhangsong: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["qiangzhi", "rexiantu"]
  },
  re_zhuzhi: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["reanguo"]
  },
  dc_caozhi: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["reluoying", "dcjiushi"]
  },
  ol_huangzhong: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["xinliegong", "remoshi"]
  },
  re_wenpin: {
    sex: "male",
    group: "wei",
    hp: 5,
    skills: ["rezhenwei"]
  },
  re_guanzhang: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["fuhun", "retongxin"],
    names: "关|兴-张|苞"
  },
  re_mazhong: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["refuman"]
  },
  dc_chenqun: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["repindi", "dcfaen"],
    clans: ["颍川陈氏"]
  },
  re_sundeng: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["rekuangbi"]
  },
  re_caiyong: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["rebizhuan", "retongbo"]
  },
  re_chengong: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["remingce", "zhichi"]
  },
  re_xunyou: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["reqice", "rezhiyu"],
    clans: ["颍川荀氏"]
  },
  dc_liru: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["xinjuece", "dcmieji", "dcfencheng"]
  },
  re_zhuhuan: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["refenli", "repingkou"]
  },
  ol_dianwei: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["olqiangxi", "olninge"]
  },
  re_sp_taishici: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["rejixu"],
    names: "太史|慈"
  },
  re_liufeng: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["rexiansi"]
  },
  ol_xunyu: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["quhu", "oljieming"],
    clans: ["颍川荀氏"]
  },
  re_liuchen: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["rezhanjue", "reqinwang"],
    isZhugong: true
  },
  dc_gongsunzan: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcyicong", "dcqiaomeng"],
    names: "公孙|瓒"
  },
  re_duji: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["reandong", "reyingshi"]
  },
  re_jushou: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcjianying", "dcshibei"]
  },
  re_zhanghe: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["reqiaobian"]
  },
  dc_xushu: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["rezhuhai", "xsqianxin"]
  },
  xin_gaoshun: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["decadexianzhen", "decadejinjiu"]
  },
  re_guohuanghou: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["rejiaozhao", "redanxin"],
    names: "郭|null"
  },
  re_xiahoushi: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["reqiaoshi", "reyanyu"],
    names: "夏侯|null"
  },
  ol_lusu: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["olhaoshi", "oldimeng"]
  },
  re_jiaxu: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["rewansha", "reluanwu", "reweimu"]
  },
  re_guyong: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["reshenxing", "rebingyi"]
  },
  xin_zhonghui: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["xinquanji", "xinzili"],
    clans: ["颍川钟氏"]
  },
  re_caifuren: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["reqieting", "rexianzhou"],
    names: "蔡|null"
  },
  re_guanping: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["relongyin", "jiezhong"]
  },
  re_guotufengji: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["rejigong", "shifei"],
    names: "郭|图-逢|记"
  },
  re_zhoucang: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["rezhongyong"]
  },
  ol_zhurong: {
    sex: "female",
    group: "shu",
    hp: 4,
    skills: ["juxiang", "lieren", "changbiao"],
    doubleGroup: ["shu", "qun"],
    names: "null|null"
  },
  re_zhangchunhua: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["rejueqing", "shangshi"]
  },
  re_gongsunyuan: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["rehuaiyi"],
    names: "公孙|渊"
  },
  re_caozhen: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["residi"]
  },
  re_fuhuanghou: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["rezhuikong", "reqiuyuan"]
  },
  re_fazheng: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["reenyuan", "rexuanhuo"]
  },
  xin_lingtong: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["decadexuanfeng", "yongjin"]
  },
  xin_liubiao: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["decadezishou", "decadezongshi"]
  },
  re_caoxiu: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["qianju", "reqingxi"]
  },
  re_sunxiu: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["reyanzhu", "rexingxue", "zhaofu"],
    isZhugong: true
  },
  ol_dengai: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["oltuntian", "olzaoxian"]
  },
  re_gongsunzan: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["reqiaomeng", "reyicong"],
    names: "公孙|瓒"
  },
  re_manchong: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["rejunxing", "yuce"]
  },
  xin_yufan: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["xinzhiyan", "xinzongxuan"]
  },
  dc_bulianshi: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["dcanxu", "dczhuiyi"]
  },
  re_hanhaoshihuan: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["reshenduan", "reyonglve"],
    names: "韩|浩-史|涣"
  },
  re_panzhangmazhong: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["reduodao", "reanjian"],
    names: "潘|璋-马|忠"
  },
  re_wangyi: {
    sex: "female",
    group: "wei",
    hp: 4,
    skills: ["zhenlie", "miji"]
  },
  re_madai: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["mashu", "reqianxi"]
  },
  xin_xusheng: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["decadepojun"]
  },
  re_taishici: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["tianyi", "hanzhan"],
    names: "太史|慈"
  },
  re_masu: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["resanyao", "rezhiman"]
  },
  re_sunluban: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["rechanhui", "rejiaojin"]
  },
  xin_handang: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["xingongji", "xinjiefan"]
  },
  yujin_yujin: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["decadezhenjun"],
    dieAudios: ["xin_yujin.mp3"]
  },
  re_caozhang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["xinjiangchi"]
  },
  re_chengpu: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["ollihuo", "rechunlao"]
  },
  re_quancong: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["xinyaoming"]
  },
  re_liaohua: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["xindangxian", "xinfuli"]
  },
  re_guohuai: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["decadejingce"]
  },
  re_wuyi: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["xinbenxi"],
    clans: ["陈留吴氏"]
  },
  re_zhuran: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["xindanshou"]
  },
  ol_pangtong: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["ollianhuan", "olniepan"]
  },
  re_zhangyi: {
    sex: "male",
    group: "shu",
    hp: 5,
    skills: ["rewurong", "reshizhi"]
  },
  xin_wuguotai: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["xinganlu", "xinbuyi"],
    names: "丁|null"
  },
  re_caocao: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["new_rejianxiong", "rehujia"],
    isZhugong: true
  },
  re_simayi: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["refankui", "reguicai"],
    names: "司马|懿"
  },
  re_guojia: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["tiandu", "new_reyiji"]
  },
  re_zhangliao: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["new_retuxi"]
  },
  re_xuzhu: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["new_reluoyi"]
  },
  re_xiahoudun: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["reganglie", "new_qingjian"],
    names: "夏侯|惇"
  },
  re_zhangfei: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["olpaoxiao", "oltishen"]
  },
  re_zhaoyun: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["ollongdan", "olyajiao"]
  },
  re_guanyu: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["new_rewusheng", "new_yijue"]
  },
  re_machao: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["mashu", "retieji"]
  },
  re_zhouyu: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["reyingzi", "refanjian"]
  },
  re_lvmeng: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["keji", "qinxue", "rebotu"]
  },
  re_ganning: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["qixi", "fenwei"]
  },
  re_luxun: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["reqianxun", "relianying"],
    clans: ["吴郡陆氏"]
  },
  re_daqiao: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["reguose", "liuli"],
    names: "桥|null"
  },
  re_huanggai: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["rekurou", "zhaxiang"]
  },
  re_lvbu: {
    sex: "male",
    group: "qun",
    hp: 5,
    skills: ["wushuang", "new_liyu"]
  },
  re_huatuo: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["jijiu", "new_reqingnang"]
  },
  re_liubei: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["rerende", "rejijiang"],
    isZhugong: true
  },
  re_diaochan: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["lijian", "rebiyue"],
    names: "null|null"
  },
  re_huangyueying: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["rejizhi", "reqicai"]
  },
  re_sunquan: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["rezhiheng", "rejiuyuan"],
    isZhugong: true
  },
  re_sunshangxiang: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["xiaoji", "rejieyin"]
  },
  re_zhenji: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["reluoshen", "qingguo"]
  },
  re_zhugeliang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["reguanxing", "kongcheng"],
    names: "诸葛|亮",
    clans: ["琅琊诸葛氏"]
  },
  re_huaxiong: {
    sex: "male",
    group: "qun",
    hp: 6,
    skills: ["reyaowu", "shizhan"]
  },
  re_zhangjiao: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["xinleiji", "xinguidao", "xinhuangtian"],
    isZhugong: true
  },
  xin_yuji: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["reguhuo"]
  },
  re_zuoci: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["rehuashen", "rexinsheng"]
  },
  ol_xiahouyuan: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["xinshensu", "shebian"],
    names: "夏侯|渊"
  },
  caoren: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["xinjushou", "xinjiewei"]
  },
  ol_weiyan: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["xinkuanggu", "reqimou"]
  },
  ol_xiaoqiao: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["oltianxiang", "olhongyan", "piaoling"],
    names: "桥|null"
  },
  zhoutai: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["buqu", "fenji"]
  },
  ol_pangde: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["mashu", "rejianchu"]
  },
  ol_xuhuang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["olduanliang", "oljiezi"]
  },
  ol_sp_zhugeliang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["bazhen", "olhuoji", "olkanpo", "cangzhuo"],
    names: "诸葛|亮",
    clans: ["琅琊诸葛氏"]
  },
  ol_yanwen: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olshuangxiong"],
    names: "颜|良-文|丑"
  },
  ol_yuanshao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olluanji", "olxueyi"],
    isZhugong: true
  },
  re_menghuo: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["huoshou", "rezaiqi", "twqiushou"],
    isZhugong: true,
    doubleGroup: ["shu", "qun"]
  },
  ol_dongzhuo: {
    sex: "male",
    group: "qun",
    hp: 8,
    skills: ["oljiuchi", "roulin", "benghuai", "olbaonue"],
    isZhugong: true
  },
  ol_sunjian: {
    sex: "male",
    group: "wu",
    hp: 4,
    maxHp: 5,
    skills: ["gzyinghun", "wulie", "twpolu"],
    isZhugong: true
  },
  re_caopi: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["rexingshang", "refangzhu", "songwei"],
    isZhugong: true
  },
  ol_jiangwei: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["oltiaoxin", "olzhiji"]
  },
  ol_caiwenji: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["olbeige", "duanchang"]
  },
  ol_liushan: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["xiangle", "olfangquan", "olruoyu"],
    isZhugong: true
  },
  re_sunce: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["oljiang", "olhunzi", "olzhiba"],
    isZhugong: true
  },
  re_jianyong: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["reqiaoshui", "jyzongshi"]
  }
};
const cards = {};
const pinyins = {};
const skills = {
  ollianhuan: {
    audio: "xinlianhuan",
    audioname: ["ol_pangtong"],
    hiddenCard: (player, name) => {
      return name == "tiesuo" && player.hasCard((card) => get.suit(card) == "club", "she");
    },
    filter(event, player) {
      if (!player.hasCard((card) => get.suit(card) == "club", "she")) {
        return false;
      }
      return event.type == "phase" || event.filterCard({ name: "tiesuo" }, player, event);
    },
    position: "hes",
    inherit: "lianhuan",
    group: "ollianhuan_add",
    subSkill: {
      add: {
        audio: "xinlianhuan",
        audioname: ["ol_pangtong"],
        trigger: { player: "useCard2" },
        filter(event, player) {
          if (event.card.name != "tiesuo") {
            return false;
          }
          var info = get.info(event.card);
          if (info.allowMultiple == false) {
            return false;
          }
          if (event.targets && !info.multitarget) {
            if (game.hasPlayer((current) => {
              return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current);
            })) {
              return true;
            }
          }
          return false;
        },
        charlotte: true,
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const result = await player.chooseTarget({
            prompt: get.prompt("ollianhuan"),
            filterTarget(card, player2, target) {
              const event2 = get.event();
              return !event2.sourcex.includes(target) && lib.filter.targetEnabled2(event2.card, player2, target);
            }
          }).set("prompt2", `为${get.translation(trigger.card)}额外指定一个目标`).set("sourcex", trigger.targets).set("ai", function(target) {
            var player2 = _status.event.player;
            return get.effect(target, _status.event.card, player2, player2);
          }).set("card", trigger.card).forResult();
          if (result?.bool && result.targets) {
            if (!event.isMine() && !event.isOnline()) {
              await game.delayex();
            }
            const targets = result.targets;
            player.logSkill("ollianhuan_add", targets);
            trigger.targets.addArray(targets);
            game.log(targets, "也成为了", trigger.card, "的目标");
          }
        }
      }
    }
  },
  rehuomo: {
    audio: "huomo",
    audioname: ["huzhao", "re_zhongyao"],
    enable: "chooseToUse",
    hiddenCard(player, name) {
      if (get.type(name) != "basic") {
        return false;
      }
      const list = player.getStorage("rehuomo");
      if (list.includes(name)) {
        return false;
      }
      return player.hasCard(function(card) {
        return get.color(card) == "black" && get.type(card) != "basic";
      }, "eh");
    },
    filter(event, player) {
      if (event.type == "wuxie" || !player.hasCard(function(card) {
        return get.color(card) == "black" && get.type(card) != "basic";
      }, "eh")) {
        return false;
      }
      const list = player.getStorage("rehuomo");
      for (let name of lib.inpile) {
        if (get.type(name) != "basic" || list.includes(name)) {
          continue;
        }
        let card = { name, isCard: true };
        if (event.filterCard(card, player, event)) {
          return true;
        }
        if (name == "sha") {
          for (let nature of lib.inpile_nature) {
            card.nature = nature;
            if (event.filterCard(card, player, event)) {
              return true;
            }
          }
        }
      }
      return false;
    },
    chooseButton: {
      dialog(event, player) {
        const vcards = [];
        const list = player.getStorage("rehuomo");
        for (let name of lib.inpile) {
          if (get.type(name) != "basic" || list.includes(name)) {
            continue;
          }
          let card = { name, isCard: true };
          if (event.filterCard(card, player, event)) {
            vcards.push(["基本", "", name]);
          }
          if (name == "sha") {
            for (let nature of lib.inpile_nature) {
              card.nature = nature;
              if (event.filterCard(card, player, event)) {
                vcards.push(["基本", "", name, nature]);
              }
            }
          }
        }
        return ui.create.dialog("活墨", [vcards, "vcard"], "hidden");
      },
      check(button) {
        const player = _status.event.player;
        const card = { name: button.link[2], nature: button.link[3] };
        if (game.hasPlayer((current) => player.canUse(card, current) && get.effect(current, card, player, player) > 0)) {
          switch (button.link[2]) {
            case "tao":
              return 5;
            case "jiu":
              return 3.01;
            case "sha":
              if (button.link[3] == "fire") {
                return 2.95;
              } else if (button.link[3] == "thunder") {
                return 2.92;
              } else {
                return 2.9;
              }
            case "shan":
              return 1;
          }
        }
        return 0;
      },
      backup(links, player) {
        return {
          check(card) {
            return 1 / Math.max(0.1, get.value(card));
          },
          filterCard(card) {
            return get.type(card) != "basic" && get.color(card) == "black";
          },
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            suit: "none",
            number: void 0,
            isCard: true
          },
          position: "he",
          popname: true,
          ignoreMod: true,
          async precontent(event, trigger, player2) {
            if (!event.result?.bool || !event.result.card || !event.result.cards?.length) {
              return;
            }
            player2.logSkill("rehuomo");
            const card = event.result.cards[0];
            game.log(player2, "将", card, "置于牌堆顶");
            await player2.loseToDiscardpile({
              cards: [card],
              position: ui.cardPile,
              insert_card: true
            }).set("log", false);
            const viewAs = {
              name: event.result.card.name,
              nature: event.result.card.nature,
              isCard: true
            };
            event.result.card = viewAs;
            event.result.cards = [];
            if (!player2.storage.rehuomo) {
              player2.when({ global: "phaseAfter" }).step(async (event2, trigger2, player3) => {
                player3.unmarkSkill("rehuomo");
              });
            }
            player2.markAuto("rehuomo", viewAs.name);
          }
        };
      },
      prompt(links, player) {
        return "将一张黑色非基本牌置于牌堆顶并视为使用一张" + get.translation(links[0][3] || "") + get.translation(links[0][2]);
      }
    },
    marktext: "墨",
    intro: {
      content: "本回合已因〖活墨〗使用过$",
      onunmark: true
    },
    ai: {
      order() {
        var player = _status.event.player;
        var event = _status.event;
        var list = player.getStorage("rehuomo");
        if (!list.includes("jiu") && event.filterCard({ name: "jiu" }, player, event) && get.effect(player, { name: "jiu" }) > 0) {
          return 3.1;
        }
        return 2.9;
      },
      respondSha: true,
      fireAttack: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        if (tag == "fireAttack") {
          return true;
        }
        if (player.hasCard(function(card) {
          return get.color(card) == "black" && get.type(card) != "basic";
        }, "he")) {
          if (arg === "respond") {
            return false;
          }
          var list = player.getStorage("rehuomo");
          if (tag == "respondSha") {
            if (list.includes("sha")) {
              return false;
            }
          } else if (tag == "respondShan") {
            if (list.includes("shan")) {
              return false;
            }
          }
        } else {
          return false;
        }
      },
      result: {
        player: 1
      }
    }
  },
  //界张梁
  rejijun: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter(event, player) {
      return event.targets && event.targets.includes(player);
    },
    frequent: true,
    async content(event, trigger, player) {
      const judgeEvent = player.judge({
        judge(card) {
          return 1;
        }
      });
      judgeEvent.callback = lib.skill.rejijun.callback;
      await judgeEvent;
    },
    async callback(event, trigger, player) {
      const { card } = event;
      if (typeof card?.number == "number") {
        const next = player.addToExpansion(card, "gain2");
        next.gaintag.add("rejijun");
        await next;
      }
    },
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile({
          cards: cards2
        });
      }
    },
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    marktext: "方",
    ai: { combo: "refangtong" }
  },
  refangtong: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard({
        prompt: get.prompt2("refangtong"),
        filterCard(card) {
          return typeof card.number === "number";
        }
      }).set("ai", (card) => {
        var player2 = _status.event.player;
        if (!game.hasPlayer((target) => target != player2 && get.damageEffect(target, player2, player2, "thunder") > 0)) {
          return 0;
        }
        if (player2.getExpansions("rejijun").reduce(function(num, card2) {
          const number = get.number(card2, false);
          return num + (typeof number === "number" ? number : 0);
        }, 0) > 36) {
          return 1 / (get.value(card) || 0.5);
        } else {
          if (lib.skill.refangtong.thunderEffect(card, player2)) {
            return 10 - get.value(card);
          }
          return 5 - get.value(card);
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const cards2 = event.cards;
      await player.addToExpansion({
        cards: cards2,
        source: player,
        animate: "give",
        gaintag: ["rejijun"]
      });
      const result = await player.chooseButton({
        selectButton: [1, player.getExpansions("rejijun").length],
        createDialog: ["###是否移去任意张“方”，对一名其他角色造成1点雷属性伤害？###若你移去的“方”的点数和大于36，则改为造成3点雷属性伤害", player.getExpansions("rejijun")],
        allowChooseAll: true,
        ai(button) {
          var player2 = _status.event.player;
          var cards3 = player2.getExpansions("rejijun");
          if (cards3.reduce((num2, card) => {
            const number = get.number(card, false);
            return num2 + (typeof number === "number" ? number : 0);
          }, 0) <= 36) {
            if (!ui.selected.buttons.length) {
              const number = get.number(button.link, false);
              if (typeof number !== "number") {
                return 0;
              }
              return 1 / number;
            }
            return 0;
          } else {
            var num = 0, list = [];
            cards3.sort((a, b) => {
              const numberA = get.number(a, false);
              const numberB = get.number(b, false);
              if (typeof numberA !== "number") {
                return 1;
              }
              if (typeof numberB !== "number") {
                return -1;
              }
              return numberB - numberA;
            });
            for (const card of cards3) {
              list.push(card);
              const number = get.number(card, false);
              if (typeof number !== "number") {
                continue;
              }
              num += number;
              if (num > 36) {
                break;
              }
            }
            return list.includes(button.link) ? 1 : 0;
          }
        }
      }).forResult();
      if (result?.bool && result.links?.length) {
        const bool = result.links.reduce((num, card) => {
          const number = get.number(card, false);
          return num + (typeof number === "number" ? number : 0);
        }, 0) > 36;
        await player.loseToDiscardpile({ cards: result.links });
        const result2 = await player.chooseTarget({
          prompt: "请选择一名其他角色",
          prompt2: `对其造成${bool ? 3 : 1}点雷属性伤害`,
          filterTarget: lib.filter.notMe,
          ai(target) {
            return get.damageEffect(target, _status.event.player, _status.event.player, "thunder");
          }
        }).forResult();
        if (result2?.bool && result2.targets?.length) {
          const target = result2.targets[0];
          player.line(target, "thunder");
          await target.damage({
            num: bool ? 3 : 1,
            nature: "thunder"
          });
        }
      }
    },
    thunderEffect(card, player) {
      let cards2 = player.getExpansions("rejijun"), num = 0;
      cards2.push(card);
      if (cards2.reduce(function(num2, card2) {
        return num2 + get.number(card2, false);
      }, 0) <= 36) {
        return false;
      }
      cards2.sort((a, b) => get.number(b, false) - get.number(a, false));
      let bool = false;
      for (let i = 0; i < cards2.length; i++) {
        if (cards2[i] == card) {
          bool = true;
        }
        num += get.number(cards2[i], false);
        if (num > 36) {
          break;
        }
      }
      return bool;
    }
  },
  //界司马朗
  requji: {
    inherit: "quji",
    async content(event, trigger, player) {
      const { target, targets, cards: cards2 } = event;
      await target.recover();
      if (target.isDamaged()) {
        await target.draw();
      }
      if (target == targets[targets.length - 1] && cards2.some((card) => get.color(card, player) == "black")) {
        await player.loseHp();
      }
    }
  },
  rejunbing: {
    audio: 2,
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      return event.player.countCards("h") < event.player.getHp();
    },
    async cost(event, trigger, player) {
      event.result = await trigger.player.chooseBool({
        prompt: player === trigger.player ? get.prompt(event.skill) : `是否响应${get.translation(player)}的【郡兵】？`,
        prompt2: "摸一张牌" + (player === trigger.player ? "" : "，将所有手牌交给" + get.translation(player) + "，然后其可以交给你等量张牌"),
        ai() {
          return get.event().choice;
        }
      }).set("choice", get.attitude(trigger.player, player) > 0).forResult();
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      if (target != player) {
        game.log(target, "响应了", player, "的", "#g【郡兵】");
      }
      await target.draw();
      let cards2 = target.getCards("h");
      if (target == player || !cards2.length) {
        return;
      }
      await target.give(cards2, player);
      const num = cards2.length;
      if (player.countCards("he") >= num) {
        const result = await player.chooseCard({
          prompt: "郡兵：是否还给" + get.translation(target) + get.translation(num) + "张牌？",
          selectCard: num,
          position: "he",
          ai(card) {
            const player2 = _status.event.player;
            const target2 = get.event().target;
            if (get.attitude(player2, target2) <= 0) {
              if (card.name === "du") {
                return 1145141919810;
              }
              return -get.value(card);
            }
            return 8 - Math.sqrt(target2.hp) - get.value(card);
          }
        }).set("target", target).forResult();
        if (result.bool && result.cards?.length) {
          await player.give(result.cards, target);
        }
      }
    }
  },
  //界诸葛诞
  regongao: {
    audio: 2,
    trigger: { global: "dying" },
    filter(event, player) {
      if (player == event.player) {
        return false;
      }
      return !player.getAllHistory("useSkill", (evt) => evt.skill == "regongao" && evt.targets[0] == event.player).length;
    },
    forced: true,
    logTarget: "player",
    async content(event, trigger, player) {
      await player.gainMaxHp();
      await player.recover();
    }
  },
  rejuyi: {
    audio: 2,
    derivation: ["benghuai", "reweizhong"],
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return player.maxHp > game.countPlayer() && player.isDamaged();
    },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "thunder",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.drawTo(player.maxHp);
      await player.addSkills(["benghuai", "reweizhong"]);
    }
  },
  reweizhong: {
    audio: 1,
    inherit: "weizhong",
    async content(event, trigger, player) {
      await player.draw({
        num: 2
      });
    }
  },
  benghuai_re_zhugedan: { audio: 1 },
  //堪比界曹冲的界曹叡
  remingjian: {
    inherit: "mingjian",
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      await player.give(cards2, target);
      target.addTempSkill("remingjian_buff", { player: "phaseAfter" });
      if (!target.storage.remingjian_buff) {
        target.storage.remingjian_buff = [];
      }
      target.storage.remingjian_buff.push(player);
      target.markSkill("remingjian_buff");
    },
    derivation: "huituo",
    subSkill: {
      buff: {
        charlotte: true,
        mark: true,
        marktext: "鉴",
        intro: {
          content: (storage, player) => {
            const num = storage.length;
            return `<li>被${get.translation(storage.toUniqued())}鉴识<li>手牌上限+${num}，出杀次数+${num}`;
          }
        },
        onremove: true,
        trigger: { source: "damageSource" },
        filter(event, player) {
          if (_status.currentPhase !== player) {
            return false;
          }
          return player.getHistory("sourceDamage").indexOf(event) == 0 && player.getStorage("remingjian_buff").some((current) => current.isIn());
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const masters = player.getStorage(event.name).filter((current) => current.isIn()).toUniqued().sortBySeat(_status.currentPhase);
          while (masters.length) {
            const master = masters.shift();
            if (!master.isIn()) {
              continue;
            }
            const next = game.createEvent("huituo");
            next.setContent(lib.skill.huituo.content);
            next.player = master;
            next.forced = true;
            next._trigger = trigger;
            await next;
          }
        },
        mod: {
          maxHandcard(player, num) {
            return num + player.getStorage("remingjian_buff").length;
          },
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.getStorage("remingjian_buff").length;
            }
          }
        }
      }
    }
  },
  rexingshuai: {
    audio: 2,
    skillAnimation: true,
    animationColor: "thunder",
    trigger: { player: "dying" },
    zhuSkill: true,
    filter(event, player) {
      if (player.hp > 0) {
        return false;
      }
      if (!player.hasZhuSkill("rexingshuai")) {
        return false;
      }
      return game.hasPlayer(function(current) {
        return current != player && current.group == "wei";
      });
    },
    limited: true,
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const targets = game.filterPlayer();
      targets.sortBySeat(_status.currentPhase);
      targets.remove(player);
      const damages = [];
      player.addSkill("rexingshuai_restore");
      while (targets.length) {
        const current = targets.shift();
        if (current.group == "wei") {
          const result = await current.chooseBool("是否令" + get.translation(player) + "回复1点体力？").set("ai", function() {
            return get.attitude(_status.event.player, _status.event.target) > 2;
          }).set("target", player).forResult();
          if (result?.bool) {
            damages.push(event.current);
            current.line(player, "green");
            game.log(current, "令", player, "回复1点体力");
            await player.recover(current);
          }
        }
      }
      if (damages.length) {
        const next = game.createEvent("rexingshuai_next");
        event.next.remove(next);
        trigger.after.push(next);
        next.targets = damages;
        next.setContent(function() {
          targets.shift().damage();
          if (targets.length) {
            event.redo();
          }
        });
      }
    },
    subSkill: {
      restore: {
        audio: "rexingshuai",
        trigger: {
          global: "dieAfter"
        },
        charlotte: true,
        forced: true,
        filter(event, player) {
          return event.source && event.source.isIn() && event.source.hasSkill("remingjian_buff");
        },
        async content(event, trigger, player) {
          player.restoreSkill("rexingshuai");
          game.log(player, "重置了", "#g【兴衰】");
        }
      }
    }
  },
  //不想突破可以不突破的界曹冲
  rechengxiang: {
    audio: 2,
    audioname2: { sxrm_caocao: "rechengxiang_sxrm_caocao", tw_sxrm_caocao: "rechengxiang_sxrm_caocao" },
    inherit: "chengxiang",
    async callback(event, trigger, player) {
      if (event.cards2?.length && event.cards2.map((card) => {
        return get.number(card);
      }).reduce((sum, num) => {
        return sum += num;
      }, 0) == 13) {
        await player.link(false);
        await player.turnOver(false);
      }
    }
  },
  //OL界二张
  olzhijian: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.countCards("he", { type: "equip" }) > 0;
    },
    filterCard(card) {
      return get.type(card) == "equip";
    },
    position: "he",
    check(card) {
      var player = _status.currentPhase;
      if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
        return 11 - get.equipValue(card);
      }
      return 6 - get.value(card);
    },
    filterTarget(card, player, target) {
      if (target.isMin()) {
        return false;
      }
      return player != target && target.canEquip(card, true);
    },
    async content(event, trigger, player) {
      await event.target.equip(event.cards[0]);
      await player.draw();
    },
    discard: false,
    lose: false,
    prepare(cards2, player, targets) {
      player.$give(cards2, targets[0], false);
    },
    ai: {
      basic: {
        order: 10
      },
      result: {
        target(player, target) {
          var card = ui.selected.cards[0];
          if (card) {
            return get.effect(target, card, target, target);
          }
          return 0;
        }
      },
      threaten: 1.35
    }
  },
  olguzheng: {
    audio: 2,
    trigger: {
      global: ["loseAfter", "loseAsyncAfter"]
    },
    filter(event, player) {
      if (event.type != "discard") {
        return false;
      }
      if (player.hasSkill("olguzheng_used")) {
        return false;
      }
      var phaseName;
      for (var name of lib.phaseName) {
        var evt = event.getParent(name);
        if (!evt || evt.name != name) {
          continue;
        }
        phaseName = name;
        break;
      }
      if (!phaseName) {
        return false;
      }
      return game.hasPlayer((current) => {
        if (current == player) {
          return false;
        }
        var evt2 = event.getl(current);
        if (!evt2 || !evt2.cards2 || evt2.cards2.filterInD("d").length < 2) {
          return false;
        }
        return true;
      });
    },
    checkx(event, player, cards2) {
      if (cards2.length > 2 || get.attitude(player, event.player) > 0) {
        return true;
      }
      for (var i = 0; i < cards2.length; i++) {
        if (get.value(cards2[i], event.player, "raw") < 0) {
          return true;
        }
      }
      return false;
    },
    direct: true,
    preHidden: true,
    async content(event, trigger, player) {
      const targets = [], cardsList = [], players = game.filterPlayer().sortBySeat(_status.currentPhase);
      for (const current of players) {
        if (current == player) {
          continue;
        }
        const cards2 = [];
        const evt = trigger.getl(current);
        if (!evt || !evt.cards2) {
          continue;
        }
        const cardsx = evt.cards2.filterInD("d");
        cards2.addArray(cardsx);
        if (cards2.length) {
          targets.push(current);
          cardsList.push(cards2);
        }
      }
      while (targets.length) {
        const target = targets.shift();
        let cards2 = cardsList.shift();
        const result = await player.chooseButton(2, [get.prompt("olguzheng", target), '<span class="text center">被选择的牌将成为对方收回的牌</span>', cards2, [["获得剩余的牌", "放弃剩余的牌"], "tdnodes"]]).set("filterButton", function(button) {
          const type = typeof button.link;
          if (ui.selected.buttons.length && type == typeof ui.selected.buttons[0].link) {
            return false;
          }
          return true;
        }).set("check", lib.skill.olguzheng.checkx(trigger, player, cards2)).set("ai", function(button) {
          if (typeof button.link == "string") {
            return button.link == "获得剩余的牌" ? 1 : 0;
          }
          if (_status.event.check) {
            return 20 - get.value(button.link, _status.event.getTrigger().player);
          }
          return 0;
        }).setHiddenSkill("olguzheng").forResult();
        if (result?.links) {
          player.logSkill("olguzheng", target);
          const links = result.links;
          player.addTempSkill("olguzheng_used", ["phaseZhunbeiAfter", "phaseDrawAfter", "phaseJudgeAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"]);
          if (typeof links[0] != "string") {
            links.reverse();
          }
          const card = links[1];
          await target.gain(card, "gain2");
          cards2.remove(card);
          cards2 = cards2.filterInD("d");
          if (cards2.length > 0 && links[0] == "获得剩余的牌") {
            await player.gain(cards2, "gain2");
          }
          break;
        }
      }
    },
    ai: {
      threaten: 1.3,
      expose: 0.2
    },
    subSkill: {
      used: {
        charlotte: true
      }
    }
  },
  //SP黄月英
  rejiqiao: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard(get.prompt2("rejiqiao"), [1, player.countCards("he")], "he", "chooseonly", "allowChooseAll").set("ai", function(card) {
        if (card.name == "bagua") {
          return 10;
        }
        return 7 - get.value(card);
      }).forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      await player.modedDiscard(cards2);
      const num = cards2.length + cards2.filter((card) => get.type(card) == "equip").length;
      const showCards = get.cards(num);
      await game.cardsGotoOrdering(showCards);
      await player.showCards(showCards);
      await player.gain(
        showCards.filter((card) => get.type(card) != "equip"),
        "gain2"
      );
    },
    ai: {
      threaten: 1.6
    }
  },
  relinglong: {
    audio: 2,
    trigger: {
      player: ["loseAfter", "disableEquipAfter", "enableEquipAfter"],
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "phaseBefore"]
    },
    init(player, skill) {
      player.addExtraEquip(skill, "bagua", true, (player2) => player2.hasEmptySlot(2) && lib.card.bagua);
    },
    onremove(player, skill) {
      delete player.storage[skill];
      player.removeExtraEquip(skill);
    },
    forced: true,
    derivation: "reqicai",
    filter(event, player) {
      if (event.name == "disableEquip" || event.name == "enableEquip") {
        if (!event.slots.includes("equip5")) {
          return false;
        }
      } else if (event.name != "phase" && (event.name != "equip" || event.player != player)) {
        var evt = event.getl(player);
        if (!evt || !evt.es || !evt.es.some((i) => get.subtypes(i).includes("equip5"))) {
          return false;
        }
      }
      var skills2 = player.additionalSkills["relinglong"];
      return (skills2 && skills2.length > 0) != player.hasEmptySlot(5);
    },
    direct: true,
    async content(event, trigger, player) {
      player.removeAdditionalSkill("relinglong");
      if (player.hasEmptySlot(5)) {
        player.addAdditionalSkill("relinglong", ["reqicai"]);
      }
    },
    group: ["linglong_bagua", "relinglong_directhit"],
    mod: {
      maxHandcard(player, num) {
        if (!player.hasEmptySlot(3) || !player.hasEmptySlot(4)) {
          return;
        }
        return num + 2;
      }
    },
    subSkill: {
      directhit: {
        audio: "relinglong",
        trigger: { player: "useCard" },
        forced: true,
        filter(event, player) {
          if (event.card.name != "sha" && get.type(event.card, null, false) != "trick") {
            return false;
          }
          for (var i = 2; i < 6; i++) {
            if (!player.hasEmptySlot(i)) {
              return false;
            }
          }
          return true;
        },
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.players);
          game.log(trigger.card, "不可被响应");
        },
        ai: {
          directHit_ai: true,
          skillTagFilter(player, tag, arg) {
            if (!arg || !arg.card || !arg.target || arg.card.name != "sha" && get.type(arg.card, null, false) != "trick") {
              return false;
            }
            for (var i = 2; i < 6; i++) {
              if (!player.hasEmptySlot(i)) {
                return false;
              }
            }
            return true;
          }
        }
      }
    }
  },
  //张松
  rexiantu: {
    audio: 2,
    trigger: { global: "phaseUseBegin" },
    filter(event, player) {
      return event.player != player;
    },
    logTarget: "player",
    check(event, player) {
      if (get.attitude(_status.event.player, event.player) < 1) {
        return false;
      }
      return player.hp > 1 || player.hasCard((card) => (get.name(card) === "tao" || get.name(card) === "jiu") && lib.filter.cardEnabled(card, player), "hs");
    },
    async content(event, trigger, player) {
      if (get.mode() !== "identity" || player.identity !== "nei") {
        player.addExpose(0.2);
      }
      await player.draw(2);
      if (!player.countCards("he")) {
        return;
      }
      const result = await player.chooseCard(2, "he", true, "交给" + get.translation(trigger.player) + "两张牌").set("ai", function(card) {
        if (ui.selected.cards.length && card.name == ui.selected.cards[0].name) {
          return -1;
        }
        if (get.tag(card, "damage")) {
          return 1;
        }
        if (get.type(card) == "equip") {
          return 1;
        }
        return 0;
      }).forResult();
      if (result?.cards?.length) {
        const target = trigger.player;
        await player.give(result.cards, target);
        target.addTempSkill("rexiantu_check", "phaseUseAfter");
        target.markAuto("rexiantu_check", [player]);
      }
    },
    ai: {
      threaten(player, target) {
        return 1 + game.countPlayer((current) => {
          if (current != target && get.attitude(target, current) > 0) {
            return 0.5;
          }
          return 0;
        });
      },
      expose: 0.3
    },
    subSkill: {
      check: {
        charlotte: true,
        trigger: { player: "phaseUseEnd" },
        forced: true,
        popup: false,
        onremove: true,
        filter(event, player) {
          return !player.getHistory("sourceDamage", (evt) => {
            return evt.getParent("phaseUse") == event;
          }).length;
        },
        async content(event, trigger, player) {
          var targets = player.getStorage("rexiantu_check");
          targets.sortBySeat();
          for (var i of targets) {
            if (i.isIn()) {
              await i.loseHp();
            }
          }
          player.removeSkill("rexiantu_check");
        }
      }
    }
  },
  //新服公孙瓒
  dcyicong: {
    trigger: {
      player: ["changeHp"]
    },
    audio: 2,
    forced: true,
    filter(event, player) {
      return get.sgn(player.getDamagedHp() - 1.5) != get.sgn(player.getDamagedHp() - 1.5 + event.num);
    },
    async content(_) {
    },
    mod: {
      globalFrom(from, to, current) {
        return current - 1;
      },
      globalTo(from, to, current) {
        if (to.getDamagedHp() >= 2) {
          return current + 1;
        }
      }
    },
    ai: {
      threaten: 0.8
    }
  },
  //朱治
  reanguo: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const { target } = event;
      let draw, recover, equip;
      if (target.isMinHandcard()) {
        await target.draw();
        draw = true;
      }
      if (target.isMinHp() && target.isDamaged()) {
        await target.recover();
        recover = true;
      }
      if (target.isMinEquip()) {
        const cardx = get.cardPile(
          function(card) {
            return get.type(card) == "equip" && target.hasUseTarget(card);
          },
          false,
          "random"
        );
        if (cardx) {
          await target.chooseUseTarget(cardx, "nothrow", "nopopup", true);
          equip = true;
        }
      }
      game.updateRoundNumber();
      if (!draw && player.isMinHandcard()) {
        await player.draw();
        draw = true;
      }
      if (!recover && player.isMinHp() && player.isDamaged()) {
        await player.recover();
        recover = true;
      }
      if (!equip && player.isMinEquip()) {
        const cardx = get.cardPile(function(card) {
          return get.type(card) == "equip" && player.hasUseTarget(card);
        });
        if (cardx) {
          await player.chooseUseTarget(cardx, "nothrow", "nopopup", true);
          equip = true;
        }
      }
      if (draw && recover && equip) {
        const result = await player.chooseCard("安国：是否重铸任意张牌？", [1, Infinity], lib.filter.cardRecastable, "he", "allowChooseAll").set("ai", (card) => {
          return 6 - get.value(card);
        }).forResult();
        if (result?.bool) {
          await player.recast(result.cards);
        }
      }
    },
    ai: {
      threaten: 1.65,
      order: 9,
      result: {
        player(player, target) {
          if (get.attitude(player, target) <= 0) {
            if (target.isMinHandcard() || target.isMinEquip() || target.isMinHp()) {
              return -1;
            }
          }
          let num = 0;
          if (player.isMinHandcard() || target.isMinHandcard()) {
            num++;
          }
          if (player.isMinEquip() || target.isMinEquip()) {
            num++;
          }
          if (player.isMinHp() && player.isDamaged() || target.isMinHp() && target.isDamaged()) {
            num += 2.1;
          }
          return num;
        }
      }
    }
  },
  //颜良文丑
  olshuangxiong: {
    audio: 2,
    trigger: { player: "phaseDrawEnd" },
    filter: (event, player) => player.countCards("he") > 0,
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard("he", get.prompt("olshuangxiong"), "弃置一张牌，然后你本回合内可以将一张与此牌颜色不同的牌当做【决斗】使用", "chooseonly").set("ai", function(card) {
        let player2 = _status.event.player;
        if (!_status.event.goon || player2.skipList.includes("phaseUse")) {
          return -get.value(card);
        }
        let color = get.color(card), effect = 0, cards2 = player2.getCards("hes"), sha = false;
        for (const cardx of cards2) {
          if (cardx == card || get.color(cardx) == color) {
            continue;
          }
          const cardy = get.autoViewAs({ name: "juedou" }, [cardx]), eff1 = player2.getUseValue(cardy);
          if (get.position(cardx) == "e") {
            let eff22 = get.value(cardx);
            if (eff1 > eff22) {
              effect += eff1 - eff22;
            }
            continue;
          } else if (get.name(cardx) == "sha") {
            if (sha) {
              effect += eff1;
              continue;
            } else {
              sha = true;
            }
          }
          let eff2 = player2.getUseValue(cardx, null, true);
          if (eff1 > eff2) {
            effect += eff1 - eff2;
          }
        }
        return effect - get.value(card);
      }).set("goon", player.hasValueTarget({ name: "juedou" }) && !player.hasSkill("olshuangxiong_effect")).forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event, color = get.color(cards2[0], player);
      await player.modedDiscard(cards2);
      player.markAuto("olshuangxiong_effect", [color]);
      player.addTempSkill("olshuangxiong_effect");
    },
    group: "olshuangxiong_jianxiong",
    subSkill: {
      effect: {
        audio: "olshuangxiong",
        enable: "chooseToUse",
        viewAs: { name: "juedou" },
        position: "hes",
        viewAsFilter(player) {
          return player.hasCard((card) => lib.skill.olshuangxiong_effect.filterCard(card, player), "hes");
        },
        filterCard(card, player) {
          const color = get.color(card), colors = player.getStorage("olshuangxiong_effect");
          for (const i of colors) {
            if (color != i) {
              return true;
            }
          }
          return false;
        },
        prompt() {
          const colors = _status.event.player.getStorage("olshuangxiong_effect");
          let str = "将一张颜色";
          for (let i = 0; i < colors.length; i++) {
            if (i > 0) {
              str += "或";
            }
            str += "不为";
            str += get.translation(colors[i]);
          }
          str += "的牌当做【决斗】使用";
          return str;
        },
        check(card) {
          const player = _status.event.player;
          if (get.position(card) == "e") {
            const raw2 = get.value(card);
            const eff2 = player.getUseValue(get.autoViewAs({ name: "juedou" }, [card]));
            return eff2 - raw2;
          }
          const raw = player.getUseValue(card, null, true);
          const eff = player.getUseValue(get.autoViewAs({ name: "juedou" }, [card]));
          return eff - raw;
        },
        onremove: true,
        charlotte: true,
        ai: { order: 7 }
      },
      jianxiong: {
        audio: "olshuangxiong",
        trigger: { player: "phaseJieshuBegin" },
        forced: true,
        locked: false,
        filter(event, player) {
          return player.hasHistory("damage", function(evt) {
            return evt.card && evt.cards && evt.cards.some((card) => get.position(card, true));
          });
        },
        async content(event, trigger, player) {
          const cards2 = [];
          player.getHistory("damage", function(evt) {
            if (evt.card && evt.cards) {
              cards2.addArray(evt.cards.filterInD("d"));
            }
          });
          if (cards2.length) {
            await player.gain(cards2, "gain2");
          }
        }
      }
    }
  },
  //新李典
  xinwangxi: {
    audio: "wangxi",
    inherit: "wangxi",
    async content(event, trigger, player) {
      const target = get.info(event.name).logTarget(trigger, player);
      await player.draw(2);
      if (player.countCards("he") && target.isIn()) {
        await player.chooseToGive(target, "he", true);
      }
    }
  },
  //OL界火诸葛
  olhuoji: {
    audio: "rehuoji",
    audioname: ["ol_sp_zhugeliang", "ol_pangtong"],
    trigger: { player: "huogongBegin" },
    forced: true,
    locked: false,
    popup: false,
    group: "olhuoji_viewAs",
    async content(event, trigger, player) {
      trigger.set("chooseToShow", async (event2, player2, target) => {
        const { showPosition = "h" } = event2;
        const cards2 = target.getCards(showPosition).randomGets(1);
        return { bool: true, cards: cards2 };
      });
      trigger.set("filterDiscard", (card) => {
        const { cards2 } = get.event().getParent("huogong", true);
        return get.color(card) == get.color(cards2[0]);
      });
    },
    async huogongContent(event, trigger, player) {
      const { target } = event;
      if (target.countCards("h") == 0) {
        return;
      }
      const cards2 = target.getCards("h").randomGets(1), card = cards2[0];
      await target.showCards(cards2).setContent(function() {
      });
      event.dialog = ui.create.dialog(get.translation(target) + "展示的手牌", cards2);
      event.videoId = lib.status.videoId++;
      game.broadcast("createDialog", event.videoId, get.translation(target) + "展示的手牌", cards2);
      game.addVideo("cardDialog", null, [get.translation(target) + "展示的手牌", get.cardsInfo(cards2), event.videoId]);
      game.log(target, "展示了", card);
      const result = await player.chooseToDiscard({ color: get.color(card) }, "h", function(card2) {
        var evt = _status.event.getParent();
        if (get.damageEffect(evt.target, evt.player, evt.player, "fire") > 0) {
          return 7 - get.value(card2, evt.player);
        }
        return -1;
      }).set("prompt", false).forResult();
      if (result?.bool) {
        await target.damage("fire");
      } else {
        target.addTempSkill("huogong2");
      }
      event.dialog.close();
      game.addVideo("cardDialog", null, event.videoId);
      game.broadcast("closeDialog", event.videoId);
    },
    subSkill: { viewAs: { inherit: "rehuoji", audio: "rehuoji" } }
  },
  olkanpo: {
    audio: "rekanpo",
    audioname: ["ol_sp_zhugeliang", "ol_pangtong"],
    trigger: { player: "useCard" },
    forced: true,
    locked: false,
    popup: false,
    group: "olkanpo_viewAs",
    filter(event, player) {
      return event.card.name == "wuxie";
    },
    async content(event, trigger, player) {
      trigger.directHit.addArray(game.players);
    },
    subSkill: { viewAs: { inherit: "rekanpo", audio: "rekanpo" } }
  },
  //新杀界曹植
  dcjiushi: {
    audio: 2,
    trigger: {
      player: "useCardAfter"
    },
    filter(event, player) {
      return event.card.name == "jiu";
    },
    forced: true,
    locked: false,
    async content(event, trigger, player) {
      player.addTempSkill("dcjiushi_sha", { player: "phaseEnd" });
      player.addMark("dcjiushi_sha", 1, false);
    },
    group: ["dcjiushi_use", "dcjiushi_damage"],
    subSkill: {
      use: {
        audio: "dcjiushi",
        enable: "chooseToUse",
        hiddenCard(player, name) {
          if (name == "jiu") {
            return !player.isTurnedOver();
          }
          return false;
        },
        filter(event, player) {
          if (player.isTurnedOver()) {
            return false;
          }
          return event.filterCard({ name: "jiu", isCard: true }, player, event);
        },
        async content(event, trigger, player) {
          if (_status.event.getParent(2).type == "dying") {
            event.dying = player;
            event.type = "dying";
          }
          await player.turnOver();
          await player.useCard({ name: "jiu", isCard: true }, player);
        },
        ai: {
          save: true,
          skillTagFilter(player, tag, arg) {
            return !player.isTurnedOver() && _status.event?.dying == player;
          },
          order: 5,
          result: {
            player(player) {
              if (_status.event.parent.name == "phaseUse") {
                if (player.countCards("h", "jiu") > 0) {
                  return 0;
                }
                if (player.getEquip("zhuge") && player.countCards("h", "sha") > 1) {
                  return 0;
                }
                if (!player.countCards("h", "sha")) {
                  return 0;
                }
                var targets = [];
                var target;
                var players = game.filterPlayer();
                for (var i = 0; i < players.length; i++) {
                  if (get.attitude(player, players[i]) < 0) {
                    if (player.canUse("sha", players[i], true, true)) {
                      targets.push(players[i]);
                    }
                  }
                }
                if (targets.length) {
                  target = targets[0];
                } else {
                  return 0;
                }
                var num = get.effect(target, { name: "sha" }, player, player);
                for (var i = 1; i < targets.length; i++) {
                  var num2 = get.effect(targets[i], { name: "sha" }, player, player);
                  if (num2 > num) {
                    target = targets[i];
                    num = num2;
                  }
                }
                if (num <= 0) {
                  return 0;
                }
                var e2 = target.getEquip(2);
                if (e2) {
                  if (e2.name == "tengjia") {
                    if (!player.countCards("h", {
                      name: "sha",
                      nature: "fire"
                    }) && !player.getEquip("zhuque")) {
                      return 0;
                    }
                  }
                  if (e2.name == "renwang") {
                    if (!player.countCards("h", { name: "sha", color: "red" })) {
                      return 0;
                    }
                  }
                  if (e2.name == "baiyin") {
                    return 0;
                  }
                }
                if (player.getEquip("guanshi") && player.countCards("he") > 2) {
                  return 1;
                }
                return target.countCards("h") > 3 ? 0 : 1;
              }
              if (player == _status.event.dying || player.isTurnedOver()) {
                return 3;
              }
            }
          },
          effect: {
            target(card, player, target) {
              if (target.isTurnedOver()) {
                if (get.tag(card, "damage")) {
                  if (player.hasSkillTag("jueqing", false, target)) {
                    return [1, -2];
                  }
                  if (target.hp == 1) {
                    return;
                  }
                  return [1, target.countCards("h") / 2];
                }
              }
            }
          }
        }
      },
      damage: {
        audio: "dcjiushi",
        trigger: { player: "damageEnd" },
        check(event, player) {
          return player.isTurnedOver();
        },
        prompt: "是否发动【酒诗】，将武将牌翻面？",
        filter(event, player) {
          if (event.checkJiushi) {
            return true;
          }
          return false;
        },
        async content(event, trigger, player) {
          await player.turnOver();
        }
      },
      sha: {
        charlotte: true,
        onremove: true,
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.countMark("dcjiushi_sha");
            }
          }
        }
      }
    }
  },
  //OL界黄忠
  remoshi: {
    trigger: { source: "damageSource" },
    forced: true,
    filter(event, player) {
      return event.player.isIn() && event.card && event.card.name == "sha" && event.cards.filterInD("od").length && event.notLink() && [2, 3, 4].some((i) => event.player.getEquips(i).length > 0);
    },
    group: "remoshi_retrieve",
    async content(event, trigger, player) {
      trigger.player.addSkill("remoshi_stuck");
      const next = trigger.player.addToExpansion(trigger.cards.filterInD("od"), "gain2");
      next.gaintag.add("remoshi_stuck");
      await next;
    },
    subSkill: {
      retrieve: {
        audio: "remoshi",
        trigger: {
          global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter(event, player, name, target) {
          return target.isIn() && target.countExpansions("remoshi_stuck");
        },
        getIndex(event, player) {
          const keys = ["equip2", "equip3", "equip4"];
          return game.filterPlayer((current) => {
            if (event.name == "gain" && current == player) {
              return false;
            }
            const cards2 = current.getExpansions("remoshi_stuck");
            if (!cards2.length) {
              return false;
            }
            const evt = event.getl(current);
            if (evt && evt.cards2 && evt.cards2.some((i) => get.subtypes(i).some((slot) => keys.includes(slot)))) {
              return true;
            }
          }).sortBySeat();
        },
        forced: true,
        logTarget: (event, player, name, target) => target,
        async content(event, trigger, player) {
          const target = event.indexedData;
          const cards2 = target.getExpansions("remoshi_stuck");
          await player.gain(cards2, target, "give", "bySelf");
        }
      },
      stuck: {
        marktext: "矢",
        charlotte: true,
        intro: {
          name: "没矢",
          name2: "矢",
          content: "expansion",
          markcount: "expansion"
        },
        onremove(player, skill) {
          var cards2 = player.getExpansions(skill);
          if (cards2.length) {
            player.loseToDiscardpile(cards2);
          }
        }
      }
    }
  },
  //界文聘
  rezhenwei: {
    audio: "zhenwei",
    inherit: "zhenwei",
    filter(event, player) {
      if (player == event.target || player == event.player) {
        return false;
      }
      if (!player.countCards("he")) {
        return false;
      }
      if (event.targets.length > 1) {
        return false;
      }
      if (!event.target) {
        return false;
      }
      if (event.target.hp > player.hp) {
        return false;
      }
      var card = event.card;
      if (card.name == "sha") {
        return true;
      }
      if (get.color(card) == "black" && get.type(card, "trick") == "trick") {
        return true;
      }
      return false;
    }
  },
  //界关张……
  retongxin: {
    mod: {
      attackRange: (player, num) => num + 2
    }
  },
  //马忠
  refuman: {
    audio: 2,
    enable: "phaseUse",
    filterTarget(card, player, target) {
      return !player.getStorage("refuman_used").includes(target);
    },
    filter(event, player) {
      return player.countCards("he") > 0 && game.hasPlayer((current) => lib.skill.refuman.filterTarget(null, player, current));
    },
    filterCard: lib.filter.cardDiscardable,
    position: "he",
    async content(event, trigger, player) {
      const card = get.discardPile((card2) => card2.name == "sha"), { target } = event;
      if (card) {
        target.addTempSkill("refuman2", { player: "phaseAfter" });
        player.addSkill("refuman_draw");
        const next = target.gain(card, "gain2");
        next.gaintag.add("refuman");
        await next;
      }
      player.addTempSkill(event.name + "_used", "phaseChange");
      player.markAuto(event.name + "_used", target);
    },
    check(card) {
      return get.discardPile((card2) => card2.name == "sha") ? 6 - get.value(card) : 0;
    },
    ai: {
      order: 2,
      result: {
        target(player, target) {
          if (!target.hasSha()) {
            return 1.2;
          }
          return 1;
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "已发动过角色：$"
        }
      },
      draw: {
        charlotte: true,
        audio: "refuman",
        trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
        getIndex(event, player) {
          return game.filterPlayer2((target) => {
            const evt = event.getParent();
            if (!["useCard", "respond"].includes(evt?.name) && !target.isIn()) {
              return false;
            }
            if (event.name == "lose") {
              if (target !== event.player || event.refuman_active) {
                return false;
              }
              return Object.values(event.gaintag_map).flat().includes("refuman");
            }
            return target.hasHistory("lose", (evt2) => {
              if (event !== evt2.getParent() || evt2.refuman_active) {
                return false;
              }
              return Object.values(evt2.gaintag_map).flat().includes("refuman");
            });
          }).sortBySeat();
        },
        forced: true,
        filter: (event, player, name, target) => target,
        logTarget: (event, player, name, target) => target,
        async content(event, trigger, player) {
          const [target] = event.targets, evt = trigger.getParent();
          if (["useCard", "respond"].includes(evt?.name)) {
            await game.asyncDraw([target, player]);
          } else {
            await target.draw();
          }
          trigger.refuman_active = true;
        }
      }
    }
  },
  refuman2: {
    charlotte: true,
    onremove(player) {
      player.removeGaintag("refuman");
    },
    mod: {
      aiOrder(player, card, num) {
        if (get.itemtype(card) == "card" && card.hasGaintag("refuman")) {
          return num + 1;
        }
      }
    }
  },
  //十周年陈群
  repindi: {
    audio: 2,
    enable: "phaseUse",
    filterTarget(card, player, target) {
      return !player.getStorage("repindi_target").includes(target);
    },
    filterCard(card, player) {
      return !player.getStorage("repindi_type").includes(get.type2(card));
    },
    check(card) {
      var num = _status.event.player.getStat("skill").repindi || 0;
      return 6 + num - get.value(card);
    },
    position: "he",
    async content(event, trigger, player) {
      const { target, cards: cards2 } = event, num = player.getStat("skill").repindi;
      player.addTempSkill("repindi_clear", ["phaseUseAfter", "phaseAfter"]);
      player.markAuto("repindi_target", [target]);
      player.markAuto("repindi_type", [get.type2(cards2[0], cards2[0].original == "h" ? player : false)]);
      player.syncStorage();
      let result;
      if (target.countCards("he") == 0) {
        result = { index: 0 };
      } else {
        result = await player.chooseControlList(true, ["令" + get.translation(target) + "摸" + get.cnNumber(num) + "张牌", "令" + get.translation(target) + "弃置" + get.cnNumber(num) + "张牌"], function() {
          return _status.event.choice;
        }).set("choice", get.attitude(player, target) > 0 ? 0 : 1).forResult();
      }
      if (result?.index == 0) {
        await target.draw(num);
      } else {
        await target.chooseToDiscard(num, "he", true);
      }
      if (target.isDamaged()) {
        await player.link();
      }
    },
    subSkill: {
      clear: {
        trigger: { player: "phaseAfter" },
        charlotte: true,
        silent: true,
        onremove(player) {
          delete player.storage.repindi_target;
          delete player.storage.repindi_type;
        }
      }
    },
    ai: {
      order: 8,
      threaten: 1.9,
      result: {
        target(player, target) {
          var att = get.attitude(player, target);
          var num = (player.getStat("skill").repindi || 0) + 1;
          if (att <= 0 && target.countCards("he") < num) {
            return 0;
          }
          return get.sgn(att);
        }
      }
    }
  },
  //十周年孙登
  rekuangbi: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2("rekuangbi"), (card, player2, target) => {
        return target.countCards("he") > 0 && target != player2;
      }).set("ai", (target) => {
        var player2 = _status.event.player, att = get.attitude(player2, target);
        if (_status.event.goon) {
          if (att > 0) {
            return att * Math.sqrt(target.countCards("he"));
          }
          return (1 - att) / (target.countCards("he") + 1);
        }
        return -10 * att / (target.countCards("he") + 1);
      }).set("goon", player.countCards("hs", (card) => player.hasValueTarget(card)) >= 2).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      const result = await target.chooseCard("匡弼：将至多三张牌置于" + get.translation(player) + "的武将牌上", "he", [1, 3], true).set("ai", (card) => {
        if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) {
          return 7 - get.value(card);
        }
        return -get.value(card);
      }).forResult();
      if (result?.bool) {
        await player.addToExpansion(result.cards, target, "give").set("gaintag", ["rekuangbi_effect"]);
        player.addTempSkill("rekuangbi_effect", "phaseUseEnd");
        player.markAuto("rekuangbi_effect", [target]);
      }
    },
    subSkill: {
      effect: {
        audio: "rekuangbi",
        mod: {
          aiOrder(player, card, num) {
            if (num <= 0 || !player.getExpansions("rekuangbi_effect").length) {
              return;
            }
            let suit = get.suit(card);
            if (player.getExpansions("rekuangbi_effect").some((i) => get.suit(i) == suit)) {
              return num + 10;
            }
            return num / 4;
          }
        },
        trigger: { player: "useCard" },
        charlotte: true,
        forced: true,
        filter(event, player) {
          return player.getExpansions("rekuangbi_effect").length > 0;
        },
        async content(event, trigger, player) {
          const cards2 = player.getExpansions("rekuangbi_effect");
          const suit = get.suit(trigger.card), cardsx = cards2.filter((card) => get.suit(card) == suit);
          const len = cardsx.length;
          let result;
          if (len > 1) {
            result = await player.chooseButton(["匡弼：移去一张同花色的“匡弼”牌", cards2], true).set("filterButton", (button) => {
              return get.suit(button.link) == _status.event.suit;
            }).set("suit", suit).forResult();
          } else if (len == 1) {
            result = { bool: true, links: cardsx };
          } else {
            result = { bool: false, links: [cards2.randomGet()] };
          }
          if (result?.links?.length) {
            await player.loseToDiscardpile(result.links);
            await game.delayx();
          }
          if (result?.bool) {
            await player.draw("nodelay");
            const target = player.getStorage("rekuangbi_effect")[0];
            if (target?.isIn()) {
              await target.draw();
            }
          } else {
            await player.draw();
          }
        },
        intro: {
          content: "expansion",
          markcount: "expansion"
        },
        onremove(player, skill) {
          var cards2 = player.getExpansions(skill);
          if (cards2.length) {
            player.loseToDiscardpile(cards2);
          }
          delete player.storage[skill];
        }
      }
    }
  },
  //十周年蔡邕
  rebizhuan: {
    audio: 2,
    trigger: {
      player: "useCard",
      target: "useCardToTargeted"
    },
    filter(event, player) {
      if (event.name != "useCard" && event.player == event.target) {
        return false;
      }
      var num = 4 + Math.min(player.countMark("retongbo"), game.countPlayer());
      if (player.getExpansions("rebizhuan").length >= num) {
        return false;
      }
      return get.suit(event.card) == "spade";
    },
    marktext: "书",
    intro: {
      name: "辟撰(书)",
      name2: "书",
      content: "expansion",
      markcount: "expansion"
    },
    frequent: true,
    locked: false,
    async content(event, trigger, player) {
      const next = player.addToExpansion(get.cards(), "gain2");
      next.gaintag.add("rebizhuan");
      await next;
    },
    mod: {
      maxHandcard(player, num) {
        return num + player.getExpansions("rebizhuan").length;
      }
    },
    ai: {
      notemp: true
    }
  },
  retongbo: {
    audio: 2,
    trigger: { player: "phaseDrawAfter" },
    direct: true,
    filter(event, player) {
      return player.getExpansions("rebizhuan").length > 0 && player.countCards("he") > 0;
    },
    async content(event, trigger, player) {
      const next = player.chooseToMove("通博：是否交换“书”和手牌？");
      next.set("list", [
        [get.translation(player) + "（你）的“书”", player.getExpansions("rebizhuan")],
        ["你的牌", player.getCards("he")]
      ]);
      next.set("filterMove", function(from, to) {
        return typeof to != "number";
      });
      next.set("processAI", function(list) {
        const player2 = _status.event.player;
        let cards2 = list[0][1].concat(list[1][1]), cards22 = [];
        cards2.sort((a, b) => {
          return get.useful(a) - get.useful(b);
        });
        cards22 = cards2.splice(0, player2.getExpansions("rebizhuan").length);
        return [cards22, cards2];
      });
      const result = await next.forResult();
      if (result?.bool) {
        const pushs = result.moved[0], gains = result.moved[1];
        pushs.removeArray(player.getExpansions("rebizhuan"));
        gains.removeArray(player.getCards("he"));
        if (!pushs.length || pushs.length != gains.length) {
          return;
        }
        player.logSkill("retongbo");
        await player.addToExpansion(pushs, "give", player).set("gaintag", ["rebizhuan"]);
        await player.gain(gains, "gain2");
        const cards2 = player.getExpansions("rebizhuan").slice(0);
        if (cards2.length < 4) {
          return;
        }
        event.given = [];
        const list = cards2.map((card) => get.suit(card)).unique();
        if (list.length >= 4 && player.hp <= 2) {
          event.four = true;
        }
        while (event.given.length < 4) {
          const resultx = await player.chooseCardButton("是否将" + get.cnNumber(4 - event.given.length) + "张“书”交给任意名其他角色？", cards2, [1, 4 - event.given.length], event.given.length > 0).set("ai", function(button) {
            if (!_status.event.goon) {
              return 0;
            }
            var four = _status.event.getParent().four, given = _status.event.getParent().given;
            if (four) {
              return get.value(button.link) + (given.map((i2) => get.suit(i2)).includes(get.suit(button.link)) ? 0 : 10);
            }
            if (ui.selected.buttons.length == 0) {
              return get.value(button.link);
            }
            return 0;
          }).set(
            "goon",
            game.hasPlayer((current) => current != player && get.attitude(player, current) > 0)
          ).forResult();
          if (resultx?.bool) {
            for (var i = 0; i < resultx.links.length; i++) {
              cards2.remove(resultx.links[i]);
            }
            const togive = resultx.links.slice(0);
            event.given.addArray(togive);
            const resulty = await player.chooseTarget("将" + get.translation(resultx.links) + "交给一名其他角色", true, function(card, player2, target) {
              return target != player2;
            }).set("ai", function(target) {
              var att = get.attitude(_status.event.player, target);
              if (_status.event.enemy) {
                return -att;
              } else if (att > 0) {
                return att / (1 + target.countCards("h"));
              } else {
                return att / 100;
              }
            }).set("enemy", get.value(togive[0], player, "raw") < 0).forResult();
            if (resulty?.targets?.length) {
              const target = resulty.targets[0];
              player.line(target, "green");
              game.log(target, "获得了" + get.cnNumber(togive.length) + "张", "#g“书”");
              await target.gain(togive, "draw").set("giver", player);
            }
          } else {
            return;
          }
        }
        if (event.given.length == 4) {
          const suits = lib.suit.slice(0);
          event.given.forEach((i2) => suits.remove(get.suit(i2, player)));
          if (suits.length == 0) {
            await player.recover();
            player.addMark("retongbo", 1, false);
          }
        }
      }
    },
    marktext: "博",
    intro: {
      content(storage, player) {
        var num = 4 + Math.min(storage, game.countPlayer());
        return "“书”的上限+" + num;
      }
    },
    ai: {
      combo: "rebizhuan"
    }
  },
  //十周年陈宫
  remingce: {
    enable: "phaseUse",
    usable: 1,
    audio: 2,
    position: "he",
    filterCard(card) {
      return get.name(card) == "sha" || get.type(card) == "equip";
    },
    filter(event, player) {
      return player.countCards("h", "sha") > 0 || player.countCards("he", { type: "equip" }) > 0;
    },
    check(card) {
      return 8 - get.value(card);
    },
    selectTarget: 2,
    multitarget: true,
    discard: false,
    lose: false,
    targetprompt: ["得到牌", "出杀目标"],
    filterTarget(card, player, target) {
      if (ui.selected.targets.length == 0) {
        return player != target;
      }
      return true;
    },
    delay: false,
    async content(event, trigger, player) {
      const { cards: cards2, targets } = event;
      await player.give(cards2, targets[0], "visible");
      let result;
      if (!targets[0].canUse({ name: "sha", isCard: true }, targets[1], false, false)) {
        result = { control: "选项二" };
      } else {
        result = await targets[0].chooseControl().set("ai", function() {
          var player2 = _status.event.player, target = _status.event.target;
          return get.effect(target, { name: "sha", isCard: true }, player2, player2) > 0 ? 0 : 1;
        }).set("choiceList", ["视为对" + get.translation(targets[1]) + "使用一张【杀】，若此杀造成伤害则执行选项二", "你与" + get.translation(player) + "各摸一张牌"]).set("target", targets[1]).set("prompt", "对" + get.translation(targets[1]) + "使用一张杀，或摸一张牌").forResult();
      }
      if (result?.control == "选项二") {
        await game.asyncDraw([player, targets[0]]);
        return;
      } else {
        await targets[0].useCard({ name: "sha", isCard: true }, targets[1]);
        if (targets[0].hasHistory("useCard", (evt) => {
          return evt.getParent() == event && targets[0].hasHistory("sourceDamage", (evtx) => evt.card == evtx.card);
        })) {
          await game.asyncDraw([player, targets[0]]);
        }
      }
    },
    ai: {
      result: {
        player(player) {
          var players = game.filterPlayer();
          for (var i = 0; i < players.length; i++) {
            if (players[i] != player && get.attitude(player, players[i]) > 1 && get.attitude(players[i], player) > 1) {
              return 1;
            }
          }
          return 0;
        },
        target(player, target) {
          if (ui.selected.targets.length) {
            return -0.1;
          }
          return 1;
        }
      },
      order: 8.5,
      expose: 0.2
    }
  },
  // 界荀攸
  reqice: {
    audio: 2,
    enable: "phaseUse",
    usable(skill, player) {
      return player.countMark("reqice_mark") + 1;
    },
    filter(event, player) {
      const hs = player.getCards("h");
      if (!hs.length) {
        return false;
      }
      if (hs.some((card) => {
        const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
        return mod2 === false;
      })) {
        return false;
      }
      return lib.inpile.some((name) => {
        if (get.type(name) != "trick") {
          return false;
        }
        const card = get.autoViewAs({ name }, hs);
        return event.filterCard(card, player, event);
      });
    },
    chooseButton: {
      dialog(event, player) {
        var list = [];
        for (var i = 0; i < lib.inpile.length; i++) {
          if (get.type(lib.inpile[i]) == "trick") {
            list.push(["锦囊", "", lib.inpile[i]]);
          }
        }
        return ui.create.dialog(get.translation("reqice"), [list, "vcard"]);
      },
      filter(button, player) {
        const event = _status.event.getParent(), card = get.autoViewAs(
          {
            name: button.link[2]
          },
          player.getCards("h")
        );
        return event.filterCard(card, player, event);
      },
      check(button) {
        var player = _status.event.player;
        var effect = player.getUseValue(button.link[2]);
        if (player.countCards("hs", button.link[2]) > 0) {
          return 0;
        }
        if ((player.getStat("skill").reqice || 0) < player.countMark("reqice_mark") + 1) {
          if (["draw", "gain"].some((i) => get.tag(button.link[2], i) >= 1)) {
            return effect * 5;
          }
        }
        if (effect > 0) {
          return effect;
        }
        return 0;
      },
      backup(links, player) {
        return {
          filterCard: true,
          selectCard: -1,
          position: "h",
          audio: "reqice",
          popname: true,
          viewAs: { name: links[0][2] }
        };
      },
      prompt(links, player) {
        return "将所有手牌当【" + get.translation(links[0][2]) + "】使用";
      }
    },
    ai: {
      order: 1,
      result: {
        player(player) {
          var num = 0;
          var cards2 = player.getCards("h");
          if (cards2.length >= 3 && player.hp >= 3 && player.countMark("reqice_mark") < 2) {
            return 0;
          }
          for (var i = 0; i < cards2.length; i++) {
            num += Math.max(0, get.value(cards2[i], player, "raw"));
          }
          num /= cards2.length;
          num /= (player.countMark("reqice_mark") + 1) * 1.3;
          num *= Math.min(cards2.length, player.hp);
          return 13 - num;
        }
      },
      nokeep: true,
      skillTagFilter(player, tag, arg) {
        if (tag === "nokeep") {
          return (!arg || arg.card && get.name(arg.card) === "tao") && player.isPhaseUsing() && !player.getStat("skill").reqice && player.hasCard((card) => get.name(card) != "tao", "h");
        }
      },
      threaten: 1.7
    },
    subSkill: {
      backup: {},
      mark: {
        charlotte: true,
        onremove: true,
        intro: {
          name2: "奇策",
          content: "mark"
        }
      }
    }
  },
  rezhiyu: {
    audio: 2,
    trigger: { player: "damageEnd" },
    async content(event, trigger, player) {
      await player.draw();
      if (!player.countCards("h")) {
        return;
      } else {
        await player.showHandcards();
      }
      let result;
      if (!trigger.source?.isIn()) {
        result = { bool: false, cards: [] };
      } else {
        result = await trigger.source.chooseToDiscard("智愚：请弃置一张手牌", true).forResult();
      }
      let cards2 = player.getCards("h");
      const bool = cards2.map((card) => get.color(card, player)).unique().length == 1;
      if (bool) {
        cards2 = result.cards.filterInD("d");
        if (cards2.length) {
          await player.gain(cards2, "gain2");
        }
        player.addMark("reqice_mark", 1);
        player.addTempSkill("reqice_mark", { player: "phaseAfter" });
      }
    },
    ai: {
      maixie_defend: true,
      threaten: 0.85
    }
  },
  oljiang: {
    audio: "jiang",
    inherit: "jiang",
    group: "oljiang_gain",
    subSkill: {
      gain: {
        audio: "jiang",
        audioname: ["sp_lvmeng", "re_sunben", "re_sunce"],
        trigger: { global: ["loseAfter", "loseAsyncAfter"] },
        usable: 1,
        filter(event, player) {
          if (player.hp < 1 || event.type != "discard" || event.position != ui.discardPile) {
            return false;
          }
          var filter = (card) => card.name == "juedou" || card.name == "sha" && get.color(card, false) == "red";
          var cards2 = event.getd().filter(filter);
          if (!cards2.filter((card) => get.position(card, true) == "d").length) {
            return false;
          }
          var searched = false;
          if (game.getGlobalHistory("cardMove", function(evt) {
            if (searched || evt.type != "discard" || evt.position != ui.discardPile) {
              return false;
            }
            var evtx = evt;
            if (evtx.getlx === false) {
              evtx = evt.getParent();
            }
            var cards3 = evtx.getd().filter(filter);
            if (!cards3.length) {
              return false;
            }
            searched = true;
            return evtx != event;
          }).length > 0) {
            return false;
          }
          return true;
        },
        prompt2(event, player) {
          var cards2 = event.getd().filter(function(card) {
            return (card.name == "juedou" || card.name == "sha" && get.color(card, false) == "red") && get.position(card, true) == "d";
          });
          return "失去1点体力并获得" + get.translation(cards2);
        },
        check(event, player) {
          return player.hp > 1 && !player.storage.olhunzi;
        },
        async content(event, trigger, player) {
          await player.loseHp();
          const cards2 = trigger.getd().filter((card) => {
            return (card.name == "juedou" || card.name == "sha" && get.color(card, false) == "red") && get.position(card, true) == "d";
          });
          if (cards2.length > 0) {
            await player.gain(cards2, "gain2");
          }
        }
      }
    }
  },
  //李儒
  dcmieji: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hasCard(lib.skill.dcmieji.filterCard, "eh");
    },
    position: "he",
    filterCard(card) {
      if (get.subtype(card) == "equip1") {
        return true;
      }
      return get.color(card) == "black" && get.type(card, "trick") == "trick";
    },
    filterTarget(card, player, target) {
      return target != player && target.countCards("h") > 0;
    },
    discard: false,
    delay: false,
    check(card) {
      return 8 - get.value(card);
    },
    loseTo: "cardPile",
    insert: true,
    visible: true,
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      await player.showCards(cards2);
      const result = await target.chooseToDiscard("he", true).set("prompt", "请弃置一张锦囊牌，或依次弃置两张非锦囊牌。").forResult();
      if ((!result.cards || get.type(result.cards[0], "trick", result.cards[0].original == "h" ? target : false) != "trick") && target.countCards("he", function(card) {
        return get.type(card, "trick") != "trick";
      })) {
        await target.chooseToDiscard("he", true, function(card) {
          return get.type(card, "trick") != "trick";
        }).set("prompt", "请弃置第二张非锦囊牌");
      }
    },
    ai: {
      order: 9,
      result: {
        target: -1
      }
    }
  },
  dcfencheng: {
    audio: 2,
    audioname: ["ol_liru"],
    audioname2: {
      ol_sb_dongzhuo: "dcfencheng_ol_sb_dongzhuo"
    },
    enable: "phaseUse",
    filterTarget: lib.filter.notMe,
    limited: true,
    line: "fire",
    skillAnimation: "epic",
    animationColor: "fire",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      let targets = game.filterPlayer((current) => current != player);
      targets.sortBySeat(event.target);
      let num = 1;
      if (targets.length) {
        for (const target of targets) {
          if (target.isIn()) {
            player.line(target, "fire");
            const result = await target.chooseToDiscard("he", "焚城：弃置至少" + get.cnNumber(num) + "张牌，或受到2点火焰伤害", [num, Infinity], "allowChooseAll").set("ai", (card) => {
              if (ui.selected.cards.length >= get.event().num) {
                return -1;
              }
              if (get.player().hasSkillTag("nofire")) {
                return -1;
              }
              if (get.event().res >= 0) {
                return 6 - get.value(card);
              }
              if (get.type(card) != "basic") {
                return 10 - get.value(card);
              }
              return 8 - get.value(card);
            }).set("num", num).set("res", get.damageEffect(target, player, target, "fire")).forResult();
            if (!result?.bool) {
              await target.damage(2, "fire");
              num = 1;
            } else {
              num = result.cards.length + 1;
            }
          }
        }
      }
    },
    subSkill: { ol_sb_dongzhuo: { audio: 1 } },
    ai: {
      order: 1,
      result: {
        player(player, target) {
          if (player.hasUnknown(2)) {
            return 0;
          }
          let num = 0, eff = 0, players = game.filterPlayer((current) => {
            return current != player;
          }).sortBySeat(target);
          for (const target2 of players) {
            if (get.damageEffect(target2, player, target2, "fire") >= 0) {
              num = 0;
              continue;
            }
            let shao = false;
            num++;
            if (target2.countCards("he", (card) => {
              if (get.type(card) != "basic") {
                return get.value(card) < 10;
              }
              return get.value(card) < 8;
            }) < num) {
              shao = true;
            }
            if (shao) {
              eff -= 4 * (get.realAttitude || get.attitude)(player, target2);
              num = 0;
            } else {
              eff -= num * (get.realAttitude || get.attitude)(player, target2) / 4;
            }
          }
          if (eff < 4) {
            return 0;
          }
          return eff;
        }
      }
    }
  },
  //朱桓
  refenli: {
    audio: 2,
    group: ["refenli_draw", "refenli_use", "refenli_discard"],
    subfrequent: ["discard"],
    subSkill: {
      draw: {
        audio: "refenli",
        trigger: { player: "phaseJudgeBefore" },
        prompt: "是否发动【奋励】跳过判定和摸牌阶段？",
        filter(event, player) {
          return player.isMaxHandcard();
        },
        check(event, player) {
          if (player.hasJudge("lebu") || player.hasJudge("bingliang")) {
            return true;
          }
          if (!player.hasSkill("repingkou") || player.getHistory("skipped").length > 0) {
            return false;
          }
          return game.hasPlayer(function(current) {
            return get.attitude(player, current) < 0 && current.hp == 1 && get.damageEffect(current, player, player) > 0;
          });
        },
        async content(event, trigger, player) {
          trigger.cancel();
          player.skip("phaseDraw");
        }
      },
      use: {
        audio: "refenli",
        trigger: { player: "phaseUseBefore" },
        prompt: "是否发动【奋励】跳过出牌阶段？",
        filter(event, player) {
          return player.isMaxHp();
        },
        check(event, player) {
          if (!player.hasSkill("repingkou")) {
            return false;
          }
          if (!player.needsToDiscard() || player.countCards("e") && player.isMaxEquip()) {
            return true;
          }
          if (player.getHistory("skipped").length > 0) {
            return false;
          }
          return game.hasPlayer(function(current) {
            return get.attitude(player, current) < 0 && current.hp == 1 && get.damageEffect(current, player, player) > 0;
          });
        },
        async content(event, trigger, player) {
          trigger.cancel();
        }
      },
      discard: {
        audio: "refenli",
        trigger: { player: "phaseDiscardBefore" },
        prompt: "是否发动【奋励】跳过弃牌阶段？",
        frequent: true,
        filter(event, player) {
          return player.isMaxEquip() && player.countCards("e");
        },
        async content(event, trigger, player) {
          trigger.cancel();
        }
      }
    },
    ai: {
      combo: "repingkou"
    }
  },
  repingkou: {
    audio: 2,
    trigger: { player: "phaseEnd" },
    filter(event, player) {
      return player.getHistory("skipped").length > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget([1, player.getHistory("skipped").length], get.prompt2("repingkou"), "对至多" + get.cnNumber(player.getHistory("skipped").length) + "名其他角色各造成1点伤害。若你选择的角色数小于最大角色数，则你可以弃置其中一名目标角色装备区内的一张牌", function(card, player2, target) {
        return target != player2;
      }).set("ai", function(target) {
        var player2 = _status.event.player;
        return get.damageEffect(target, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const targets = event.targets.slice(0).sortBySeat();
      for (const target of targets) {
        if (target.isIn()) {
          await target.damage();
        }
      }
      if (targets.length >= player.getHistory("skipped").length) {
        return;
      }
      const targets2 = targets.filter(function(target) {
        return target.countDiscardableCards(player, "e") > 0;
      });
      if (targets2.length > 0) {
        const result = await player.chooseTarget("是否弃置一名目标角色的一张装备牌？", function(card, player2, target) {
          return _status.event.targets.includes(target);
        }).set("targets", targets2).set("ai", function(target) {
          var att = get.attitude(player, target), eff = 0;
          target.getCards("e", function(card) {
            var val = get.value(card, target);
            eff = Math.max(eff, -val * att);
          });
          return eff;
        }).forResult();
        if (result.bool) {
          const target = result.targets[0];
          player.line(target, "green");
          const card = target.getDiscardableCards(player, "e").randomGet();
          if (card) {
            await target.discard(card);
          }
        }
      }
    },
    ai: {
      effect: {
        target(card) {
          if (card.name == "lebu" || card.name == "bingliang") {
            return 0.5;
          }
        }
      },
      combo: "refenli"
    }
  },
  //典韦
  olqiangxi: {
    audio: "qiangxi",
    audioname: ["ol_dianwei", "boss_lvbu3"],
    enable: "phaseUse",
    usable: 2,
    filter(event, player) {
      if (player.hp < 1 && !player.hasCard((card) => lib.skill.olqiangxi.filterCard(card), "he")) {
        return false;
      }
      return game.hasPlayer((current) => lib.skill.olqiangxi.filterTarget(null, player, current));
    },
    filterCard(card) {
      return get.subtype(card) == "equip1";
    },
    position: "he",
    filterTarget(card, player, target) {
      if (target == player) {
        return false;
      }
      var stat = player.getStat()._olqiangxi;
      return !stat || !stat.includes(target);
    },
    selectCard() {
      if (_status.event.player.hp < 1) {
        return 1;
      }
      return [0, 1];
    },
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      var stat = player.getStat();
      if (!stat._olqiangxi) {
        stat._olqiangxi = [];
      }
      stat._olqiangxi.push(target);
      if (!cards2.length) {
        await player.damage("nosource", "nocard");
      }
      await target.damage("nocard");
    },
    ai: {
      damage: true,
      order: 8,
      result: {
        player(player, target) {
          if (ui.selected.cards.length) {
            return 0;
          }
          if (player.hp >= target.hp) {
            return -0.9;
          }
          if (player.hp <= 2) {
            return -10;
          }
          return get.damageEffect(player, player, player);
        },
        target(player, target) {
          if (!ui.selected.cards.length) {
            if (player.hp < 2) {
              return 0;
            }
            if (player.hp == 2 && target.hp >= 2) {
              return 0;
            }
            if (target.hp > player.hp) {
              return 0;
            }
          }
          return get.damageEffect(target, player, target);
        }
      },
      threaten: 1.5
    }
  },
  olninge: {
    audio: 2,
    trigger: { global: "damageEnd" },
    filter(event, player) {
      if (player != event.player && player != event.source) {
        return false;
      }
      return event.player.getHistory("damage").indexOf(event) == 1;
    },
    logTarget: "player",
    forced: true,
    async content(event, trigger, player) {
      await player.draw();
      await player.discardPlayerCard(trigger.player, true, "ej");
    }
  },
  //群太史慈
  rejixu: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hp > 0 && player.countCards("h") > 0;
    },
    filterTarget: lib.filter.notMe,
    selectTarget() {
      return [1, _status.event.player.hp];
    },
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      const { targets } = event;
      if (!event.caicuolist) {
        event.caicuolist = [];
      }
      for (const target of targets) {
        const result = await target.chooseBool("是否押杀？").set("ai", function() {
          const evt = _status.event.getParent(), player2 = get.player();
          if (get.attitude(player2, evt.player) > 0) {
            return evt.player.countCards("h", "sha") ? false : true;
          }
          if (evt.player.hasKnownCards(target, (c) => {
            return c.name == "sha";
          })) {
            return true;
          }
          return Math.random() < evt.player.countCards("h") / 4;
        }).forResult();
        if (!result) {
          continue;
        }
        if (result.bool) {
          target.chat("有杀");
          game.log(target, "认为", player, "#g有杀");
          if (!player.countCards("h", "sha")) {
            event.caicuolist.add(target);
          }
        } else {
          target.chat("没杀");
          game.log(target, "认为", player, "#y没有杀");
          if (player.countCards("h", "sha")) {
            event.caicuolist.add(target);
          }
        }
      }
      player.popup(player.countCards("h", "sha") ? "有杀" : "没杀");
      game.log(player, player.countCards("h", "sha") ? "有杀" : "没杀");
      if (event.caicuolist.length > 0) {
        if (player.countCards("h", "sha")) {
          player.markAuto("rejixu_sha", event.caicuolist);
          player.addTempSkill("rejixu_sha", "phaseUseAfter");
        } else {
          for (const target of event.caicuolist) {
            if (target.countDiscardableCards(player, "he") > 0) {
              player.line(target);
              await player.discardPlayerCard(true, "he", target);
            }
          }
        }
        await player.draw(event.caicuolist.length);
      }
    },
    ai: {
      order() {
        return get.order({ name: "sha" }) + 0.6;
      },
      result: {
        target(player, target) {
          if (player.countCards("h", "sha")) {
            return get.effect(target, { name: "sha" }, player, target);
          } else {
            return get.effect(target, { name: "guohe_copy2" }, player, target);
          }
        }
      },
      expose: 0.4
    },
    subSkill: {
      sha: {
        audio: "rejixu",
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.getStorage("rejixu_sha").length;
            }
          }
        },
        charlotte: true,
        onremove: true,
        trigger: { player: "useCard2" },
        filter(event, player) {
          if (event.card.name != "sha") {
            return false;
          }
          for (var target of player.getStorage("rejixu_sha")) {
            if (event.targets.includes(target) || !target.isIn()) {
              return false;
            }
            if (lib.filter.targetEnabled2(event.card, player, target)) {
              return true;
            }
          }
          return false;
        },
        prompt: "是否发动【击虚】？",
        prompt2(event, player) {
          var list = player.getStorage("rejixu_sha").filter(function(target) {
            if (event.targets.includes(target) || !target.isIn()) {
              return false;
            }
            return lib.filter.targetEnabled2(event.card, player, target);
          });
          return "令" + get.translation(list) + "也成为" + get.translation(event.card) + "的目标";
        },
        logTarget(event, player) {
          return player.getStorage("rejixu_sha").filter(function(target) {
            if (event.targets.includes(target) || !target.isIn()) {
              return false;
            }
            return lib.filter.targetEnabled2(event.card, player, target);
          });
        },
        check(event, player) {
          var eff = 0;
          var list = player.getStorage("rejixu_sha").filter(function(target) {
            if (event.targets.includes(target) || !target.isIn()) {
              return false;
            }
            return lib.filter.targetEnabled2(event.card, player, target);
          });
          for (var i of list) {
            eff += get.effect(i, event.card, player, player);
          }
          return eff > 0;
        },
        async content(event, trigger, player) {
          const list = player.getStorage("rejixu_sha").filter((target) => {
            if (trigger.targets.includes(target) || !target.isIn()) {
              return false;
            }
            return lib.filter.targetEnabled2(trigger.card, player, target);
          });
          if (list.length > 0) {
            trigger.targets.addArray(list);
            game.log(list, "也成为了", trigger.card, "的目标");
          }
        }
      }
    }
  },
  //界刘封
  rexiansi: {
    inherit: "xiansi",
    audio: "xiansi",
    audioname: ["re_liufeng"],
    group: ["rexiansi2", "xiansix"]
  },
  rexiansi2: {
    enable: "chooseToUse",
    sourceSkill: "rexiansi",
    filter(event, player) {
      return player.getExpansions("xiansi").length > Math.max(0, player.hp) && event.filterCard({ name: "sha", isCard: true }, player, event);
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("陷嗣", player.getExpansions("xiansi"), "hidden");
      },
      backup(links, player) {
        return {
          viewAs: { name: "sha", isCard: true },
          filterCard: () => false,
          selectCard: -1,
          card: links[0],
          log: false,
          async precontent(event, trigger, player2) {
            player2.logSkill("rexiansi");
            await player2.loseToDiscardpile(lib.skill.rexiansi2_backup.card);
          }
        };
      },
      prompt: () => "请选择【杀】的目标"
    },
    ai: {
      order() {
        return get.order({ name: "sha" }) + 0.6;
      },
      result: { player: 1 }
    }
  },
  //界荀彧
  oljieming: {
    audio: 2,
    audioname2: { sxrm_caocao: "oljieming_sxrm_caocao", tw_sxrm_caocao: "oljieming_sxrm_caocao" },
    trigger: { player: ["damageEnd", "die"] },
    forceDie: true,
    filter(event, player) {
      if (event.name == "die") {
        return true;
      }
      return player.isIn() && event.num > 0;
    },
    getIndex(event) {
      return event.num || 1;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return target.maxHp > 0;
      }).set("ai", (target) => {
        const player2 = get.player();
        let att = get.attitude(player2, target);
        let draw = Math.min(5, target.maxHp) - target.countCards("h");
        if (draw >= 0) {
          if (target.hasSkillTag("nogain")) {
            att /= 6;
          }
          if (att > 2) {
            return Math.sqrt(draw + 1) * att;
          }
          return att / 3;
        }
        if (draw < -1) {
          if (target.hasSkillTag("nogain")) {
            att *= 6;
          }
          if (att < -2) {
            return -Math.sqrt(1 - draw) * att;
          }
        }
        return 0;
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      await target.draw(Math.min(5, target.maxHp));
      let num = target.countCards("h") - Math.min(5, target.maxHp);
      if (num > 0) {
        await target.chooseToDiscard("h", true, num, "allowChooseAll");
      }
    },
    ai: {
      expose: 0.2,
      maixie: true,
      maixie_hp: true,
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "damage") && target.hp > 1) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return [1, -2];
            }
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
          if ((card.name == "tao" || card.name == "caoyao") && target.hp > 1 && target.countCards("h") <= target.hp) {
            return [0, 0];
          }
        }
      }
    }
  },
  //OL华雄
  shizhan: {
    audio: 2,
    enable: "phaseUse",
    usable: 2,
    filterTarget(card, player, target) {
      return target != player && target.canUse("juedou", player);
    },
    async content(event, trigger, player) {
      await event.target.useCard({ name: "juedou", isCard: true }, player, "noai");
    },
    ai: {
      order: 2,
      result: {
        player(player, target) {
          return get.effect(player, { name: "juedou", isCard: true }, target, player);
        }
      }
    }
  },
  //刘谌
  rezhanjue: {
    audio: 2,
    enable: "phaseUse",
    filterCard(card) {
      return !card.hasGaintag("reqinwang");
    },
    selectCard: -1,
    position: "h",
    filter(event, player) {
      var stat = player.getStat().skill;
      if (stat.rezhanjue_draw && stat.rezhanjue_draw >= 3) {
        return false;
      }
      var hs = player.getCards("h", function(card) {
        return !card.hasGaintag("reqinwang");
      });
      if (!hs.length) {
        return false;
      }
      for (var i = 0; i < hs.length; i++) {
        var mod2 = game.checkMod(hs[i], player, "unchanged", "cardEnabled2", player);
        if (mod2 === false) {
          return false;
        }
      }
      return event.filterCard(get.autoViewAs({ name: "juedou" }, hs));
    },
    viewAs: { name: "juedou" },
    onuse(links, player) {
      player.addTempSkill("rezhanjue_effect", "phaseUseEnd");
    },
    ai: {
      order(item, player) {
        if (player.countCards("h") > 1) {
          return 0.8;
        }
        return 8;
      },
      tag: {
        respond: 2,
        respondSha: 2,
        damage: 1
      },
      result: {
        player(player, target) {
          let td = get.damageEffect(target, player, target);
          if (!td) {
            return 0;
          }
          let hs = player.getCards("h"), val = hs.reduce((acc, i) => acc - get.value(i, player), 0) / 6 + 1;
          if (td > 0) {
            return val;
          }
          if (player.hasSkillTag("directHit_ai", true, {
            target,
            card: get.autoViewAs({ name: "juedou" }, hs)
          })) {
            return val;
          }
          let pd = get.damageEffect(player, target, player), att = get.attitude(player, target);
          if (att > 0 && get.damageEffect(target, player, player) > pd) {
            return val;
          }
          let ts = target.mayHaveSha(player, "respond", null, "count");
          if (ts < 1 && ts * 8 < Math.pow(player.hp, 2)) {
            return val;
          }
          let damage = pd / get.attitude(player, player), ps = player.mayHaveSha(player, "respond", hs, "count");
          if (att > 0) {
            if (ts < 1) {
              return val;
            }
            return val + damage + 1;
          }
          if (pd >= 0) {
            return val + damage + 1;
          }
          if (ts - ps + Math.exp(0.8 - player.hp) < 1) {
            return val - ts;
          }
          return val + damage + 1 - ts;
        },
        target(player, target) {
          let td = get.damageEffect(target, player, target) / get.attitude(target, target);
          if (!td) {
            return 0;
          }
          let hs = player.getCards("h");
          if (td > 0 || player.hasSkillTag("directHit_ai", true, {
            target,
            card: get.autoViewAs({ name: "juedou" }, hs)
          })) {
            return td + 1;
          }
          let pd = get.damageEffect(player, target, player), att = get.attitude(player, target);
          if (att > 0) {
            return td + 1;
          }
          let ts = target.mayHaveSha(player, "respond", null, "count"), ps = player.mayHaveSha(player, "respond", hs, "count");
          if (ts < 1) {
            return td + 1;
          }
          if (pd >= 0) {
            return 0;
          }
          if (ts - ps < 1) {
            return td + 1 - ts;
          }
          return -ts;
        }
      },
      nokeep: true,
      skillTagFilter(player, tag, arg) {
        if (tag === "nokeep") {
          return (!arg || arg.card && get.name(arg.card) === "tao") && player.isPhaseUsing() && get.skillCount("rezhanjue_draw", player) < 3 && player.hasCard((card) => {
            return get.name(card) !== "tao" && !card.hasGaintag("reqinwang");
          }, "h");
        }
      }
    }
  },
  rezhanjue_effect: {
    audio: false,
    trigger: { player: "useCardAfter" },
    forced: true,
    popup: false,
    charlotte: true,
    sourceSkill: "rezhanjue",
    onremove(player) {
      delete player.getStat().skill.rezhanjue_draw;
    },
    filter(event, player) {
      return event.skill == "rezhanjue";
    },
    async content(event, trigger, player) {
      let stat = player.getStat().skill;
      if (!stat.rezhanjue_draw) {
        stat.rezhanjue_draw = 0;
      }
      stat.rezhanjue_draw++;
      await player.draw("nodelay");
      const list = game.filterPlayer(function(current) {
        if (current.getHistory("damage", function(evt) {
          return evt.card == trigger.card;
        }).length > 0) {
          if (current == player) {
            stat.rezhanjue_draw++;
          }
          return true;
        }
        return false;
      });
      if (list.length) {
        list.sortBySeat();
        await game.asyncDraw(list);
      }
      game.delay();
    }
  },
  reqinwang: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    zhuSkill: true,
    filter(event, player) {
      if (!player.hasZhuSkill("reqinwang")) {
        return false;
      }
      return game.hasPlayer(function(current) {
        return current != player && current.group == "shu" && player.hasZhuSkill("reqinwang", current);
      });
    },
    selectTarget: -1,
    filterTarget(card, player, current) {
      return current != player && current.group == "shu" && player.hasZhuSkill("reqinwang", current);
    },
    async content(event, trigger, player) {
      const { target } = event;
      if (target.hasCard(function(card) {
        return _status.connectMode || get.name(card, target) == "sha";
      }, "h")) {
        const result = await target.chooseCard(
          "是否交给" + get.translation(player) + "一张【杀】？",
          function(card, player2) {
            return get.name(card, player2) == "sha";
          },
          "h"
        ).set("goon", get.attitude(target, player) > 0).set("ai", function(card) {
          return _status.event.goon ? 1 : 0;
        }).forResult();
        if (result?.bool) {
          const card = result.cards[0];
          await target.give(card, player).set("gaintag", ["reqinwang"]);
          player.addTempSkill("reqinwang_clear");
          const result2 = await player.chooseBool("是否令" + get.translation(target) + "摸一张牌？").forResult();
          if (result2?.bool) {
            await target.draw();
          }
        }
      }
    },
    ai: {
      order: 5,
      result: { player: 1 }
    },
    subSkill: {
      clear: {
        charlotte: true,
        onremove(player) {
          player.removeGaintag("reqinwang");
        }
      }
    }
  },
  //公孙瓒
  dcqiaomeng: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      if (!event.isFirstTarget || get.color(event.card) != "black") {
        return false;
      }
      for (var i of event.targets) {
        if (i != player && i.hasCard(function(card) {
          return lib.filter.canBeDiscarded(card, player, i);
        }, "he")) {
          return true;
        }
      }
      return false;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt("dcqiaomeng"), "选择一名不为自己的目标角色，然后弃置其一张牌。若以此法弃置的牌为：装备牌，你获得此牌；锦囊牌，你令" + get.translation(trigger.card) + "不可被响应。", function(card, player2, target) {
        return target != player2 && _status.event.getTrigger().targets.includes(target) && target.hasCard(function(card2) {
          return lib.filter.canBeDiscarded(card2, player2, target);
        }, "he");
      }).set("ai", function(target) {
        const player2 = _status.event.player;
        return get.effect(target, { name: "guohe_copy2" }, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      const result = await player.discardPlayerCard(target, true, "he").forResult();
      if (result?.bool && result.cards?.length) {
        const card = result.cards[0], type = get.type2(card, false);
        if (type == "trick") {
          trigger.directHit.addArray(game.filterPlayer((current) => current != player));
        }
        if (type == "equip" && get.position(card, true) == "d") {
          await player.gain(card, "gain2");
        }
      }
    }
  },
  //杜畿
  reandong: {
    audio: 2,
    trigger: { player: "damageBegin2" },
    filter(event, player) {
      return event.source && event.source.isIn() && event.source != player;
    },
    logTarget: "source",
    async content(event, trigger, player) {
      const target = trigger.source, bool = player.storage.reandong;
      let str = get.translation(player), result;
      if (bool) {
        str = "自己";
      }
      let choiceList = ["防止" + str + "即将受到的伤害，且本回合内红桃牌不计入" + (bool ? get.translation(target) : "自己") + "的手牌上限。"];
      if (!target.countCards("h")) {
        choiceList.push("令" + str + "下次发动〖安东〗时改为自行选择");
      } else {
        choiceList.push("令" + str + "观看你的手牌并获得所有红桃牌");
      }
      if (bool) {
        delete player.storage.reandong;
        result = await player.chooseControl().set("choiceList", choiceList).set("prompt", "安东：请选择一项").forResult();
      } else {
        result = await target.chooseControl().set("choiceList", choiceList).set("prompt", "安东：请选择一项").set("ai", function(event2, target2) {
          const player2 = event2.player;
          const trigger2 = event2.getTrigger();
          if (get.attitude(target2, player2) > 0) {
            return 0;
          }
          const hs = target2.getGainableCards(player2, "h", (card) => get.suit(card) == "heart");
          if (hs.length) {
            const recover = hs.filter((card) => get.tag(card, "save") || get.tag(card, "recover")).length;
            if (trigger2.num <= recover) {
              return 0;
            }
          }
          return 1;
        }).forResult();
      }
      if (result?.index == 0) {
        target.addTempSkill("reandong_ignore");
        trigger.cancel();
        await game.delayx();
      } else {
        if (!target.countCards("h")) {
          player.storage.reandong = true;
          await game.delayx();
        } else {
          await player.viewHandcards(target);
          const cards2 = target.getCards("h", function(card) {
            return get.suit(card, target) == "heart";
          });
          if (cards2.length > 0) {
            await player.gain(cards2, target, "give", "bySelf");
          }
        }
      }
    },
    ai: {
      maixie: true,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return [1, -1];
          }
          if (get.tag(card, "damage") && player != target && get.attitude(player, target) < 0) {
            let cards2 = player.getCards("h", function(cardx) {
              return card != cardx && (!card.cards || !card.cards.includes(cardx)) && get.suit(cardx) == "heart";
            });
            if (!cards2.length) {
              return;
            }
            const recover = cards2.filter((card2) => get.tag(card2, "save") || get.tag(card2, "recover")).length;
            if (recover >= target.getDamagedHp()) {
              let eff = player.needsToDiscard(0, (card2, player2) => get.suit(card2) != "heart" || !player2.canIgnoreHandcard(card2));
              return [0, 0, 0, eff / 10];
            }
            const val = get.value(cards2, target);
            if (val >= 6 + target.getDamagedHp()) {
              return [1, val / 10, 1, -val / 10];
            }
            return [1, 0.6];
          }
        }
      }
    },
    subSkill: {
      ignore: {
        mod: {
          ignoredHandcard(card, player) {
            if (get.suit(card) == "heart") {
              return true;
            }
          },
          cardDiscardable(card, player, name) {
            if (name == "phaseDiscard" && get.suit(card) == "heart") {
              return false;
            }
          }
        },
        charlotte: true,
        marktext: "♥",
        intro: "红桃牌于本回合内不计入手牌上限"
      }
    }
  },
  reyingshi: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    direct: true,
    filter(event, player) {
      return player.countCards("h") > 0 && game.countPlayer() > 1;
    },
    async content(event, trigger, player) {
      const result = await player.chooseCardTarget({
        prompt: get.prompt("reyingshi"),
        prompt2: "操作提示：选择一张作为赏金的手牌，然后选择作为赏金猎人的角色A和作为出杀目标的其他角色B",
        filterCard: true,
        selectTarget: 2,
        position: "h",
        filterTarget(card, player2, target) {
          if (!ui.selected.targets.length) {
            return true;
          }
          return target != player2;
        },
        complexTarget: true,
        targetprompt: ["出杀", "被杀"],
        complexSelect: true,
        ai1(card) {
          return 1 / Math.max(1, get.value(card));
        },
        ai2(target) {
          var player2 = _status.event.player;
          if (!ui.selected.targets.length) {
            var att = get.attitude(player2, target);
            if (att < 0) {
              return 0;
            }
            if (target.hasSha()) {
              return Math.pow(target.countCards("h") + 1, 1.1) * (player2 == target ? 3 : 1);
            }
            return Math.sqrt(1 + target.countCards("h"));
          }
          return get.effect(target, { name: "sha" }, ui.selected.targets[0], player2);
        }
      }).forResult();
      if (result?.bool && result.cards?.length && result.targets?.length) {
        const targets = result.targets;
        player.logSkill("reyingshi", targets[1]);
        const card = result.cards[0];
        player.showCards(card, get.translation(player) + "对" + get.translation(targets[1]) + "发动了【应势】");
        player.line(targets[0], "fire");
        const suit = get.suit(card), number = get.number(card);
        const cardx = Array.from(ui.cardPile.childNodes).filter((card2) => {
          if (card2.suit == suit && card2.number == number) {
            return true;
          }
        });
        if (cardx.length) {
          await player.showCards(cardx, `${get.translation(player)}发动了【应势】`);
        }
        await game.delayx(2);
        const next = targets[0].chooseToUse(
          function(card2, player2, event2) {
            if (get.name(card2) != "sha") {
              return false;
            }
            return lib.filter.cardEnabled.apply(this, arguments) && lib.filter.targetEnabled(card2, player2, (event2 || _status.event).sourcex);
          },
          "###是否对" + get.translation(targets[1]) + "使用一张【杀】？###若选择使用，则获得赏金（" + get.translation(card) + "）。若造成伤害，则再从牌堆中获得与此牌花色点数相同的牌作为额外赏金。"
        );
        next.set("addCount", false);
        next.set("complexSelect", true);
        next.set("filterTarget", function(card2, player2, target2) {
          if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
            return false;
          }
          return lib.filter.targetEnabled.apply(this, arguments);
        });
        next.set("sourcex", targets[1]);
        const result2 = await next.forResult();
        const target = targets[0];
        if (result2?.bool && target.isIn()) {
          let cards2 = [], slice = 0;
          if (player != target && player.getCards("h").includes(card)) {
            cards2.push(card);
            slice++;
          }
          if (target.hasHistory("useCard", function(evt) {
            if (evt.getParent(2) != event) {
              return false;
            }
            return target.hasHistory("sourceDamage", function(evtx) {
              return evtx.card == evt.card;
            });
          })) {
            cards2.addArray(
              Array.from(ui.cardPile.childNodes).filter((cardx2) => {
                if (cardx2.suit == suit && cardx2.number == number) {
                  return true;
                }
              })
            );
            if (cards2.length > 0) {
              if (!slice) {
                await target.gain(cards2, "gain2");
              } else {
                setTimeout(
                  function() {
                    target.$gain2(cards2.slice(slice), true);
                  },
                  get.delayx(200, 200)
                );
                await target.gain(cards2, player, "give");
              }
            }
          } else {
            if (cards2.length > 0) {
              await target.gain(cards2, player, "give");
            }
          }
        }
      }
    }
  },
  //十周年沮授
  dcshibei: {
    audio: 2,
    audioname2: { tw_jushou: "shibei_xin_jushou" },
    trigger: { player: "damageEnd" },
    check(event, player) {
      return player.getHistory("damage").indexOf(event) == 0;
    },
    filter(event, player) {
      var index = player.getHistory("damage").indexOf(event);
      return index == 0 || index == 1;
    },
    forced: true,
    async content(event, trigger, player) {
      if (player.getHistory("damage").indexOf(trigger) > 0) {
        await player.loseHp();
      } else {
        await player.recover();
      }
    },
    subSkill: {
      damaged: {},
      ai: {}
    },
    ai: {
      maixie_defend: true,
      threaten: 0.9,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return;
          }
          if (target.hujia) {
            return;
          }
          if (player._shibei_tmp) {
            return;
          }
          if (target.hasSkill("shibei_ai")) {
            return;
          }
          if (_status.event.getParent("useCard", true) || _status.event.getParent("_wuxie", true)) {
            return;
          }
          if (get.tag(card, "damage")) {
            if (target.getHistory("damage").length > 0) {
              return [1, -2];
            } else {
              if (get.attitude(player, target) > 0 && target.hp > 1) {
                return 0;
              }
              if (get.attitude(player, target) < 0 && !player.hasSkillTag("damageBonus", "e", {
                target,
                card
              })) {
                if (card.name == "sha") {
                  return;
                }
                var sha = false;
                player._shibei_tmp = true;
                var num = player.countCards("h", function(card2) {
                  if (card2.name == "sha") {
                    if (sha) {
                      return false;
                    } else {
                      sha = true;
                    }
                  }
                  return get.tag(card2, "damage") && player.canUse(card2, target) && get.effect(target, card2, player, player) > 0;
                });
                delete player._shibei_tmp;
                if (player.hasSkillTag("damage")) {
                  num++;
                }
                if (num < 2) {
                  var enemies = player.getEnemies();
                  if (enemies.length == 1 && enemies[0] == target && player.needsToDiscard()) {
                    return;
                  }
                  return 0;
                }
              }
            }
          }
        }
      }
    }
  },
  dcjianying: {
    audio: 2,
    locked: false,
    mod: {
      aiOrder(player, card, num) {
        if (typeof card == "object" && player.isPhaseUsing()) {
          var evt = lib.skill.dcjianying.getLastUsed(player);
          if (evt && evt.card && (get.suit(evt.card) && get.suit(evt.card) == get.suit(card) || evt.card.number && evt.card.number == get.number(card))) {
            return num + 10;
          }
        }
      }
    },
    trigger: { player: "useCard" },
    frequent: true,
    getLastUsed(player, event) {
      var history = player.getAllHistory("useCard");
      var index;
      if (event) {
        index = history.indexOf(event) - 1;
      } else {
        index = history.length - 1;
      }
      if (index >= 0) {
        return history[index];
      }
      return false;
    },
    filter(event, player) {
      var evt = lib.skill.dcjianying.getLastUsed(player, event);
      if (!evt || !evt.card) {
        return false;
      }
      return lib.suit.includes(get.suit(evt.card)) && get.suit(evt.card) == get.suit(event.card) || typeof get.number(evt.card, false) == "number" && get.number(evt.card, false) == get.number(event.card);
    },
    async content(event, trigger, player) {
      await player.draw("nodelay");
    },
    group: "dcjianying_mark",
    init(player) {
      var history = player.getAllHistory("useCard");
      if (history.length) {
        var trigger = history[history.length - 1];
        if (get.suit(trigger.card, player) == "none" || typeof get.number(trigger.card, player) != "number") {
          return;
        }
        player.storage.dcjianying_mark = trigger.card;
        player.markSkill("dcjianying_mark");
        game.broadcastAll(
          function(player2, suit) {
            if (player2.marks.dcjianying_mark) {
              player2.marks.dcjianying_mark.firstChild.innerHTML = get.translation(suit);
            }
          },
          player,
          get.suit(trigger.card, player)
        );
      }
    },
    onremove(player) {
      player.unmarkSkill("dcjianying_mark");
      delete player.storage.dcjianying_mark;
    },
    subSkill: {
      mark: {
        charlotte: true,
        trigger: { player: "useCard1" },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          if (get.suit(trigger.card, player) == "none" || typeof get.number(trigger.card, player) != "number") {
            player.unmarkSkill("dcjianying_mark");
          } else {
            player.storage.dcjianying_mark = trigger.card;
            player.markSkill("dcjianying_mark");
            game.broadcastAll(
              function(player2, suit) {
                if (player2.marks.dcjianying_mark) {
                  player2.marks.dcjianying_mark.firstChild.innerHTML = get.translation(suit);
                }
              },
              player,
              get.suit(trigger.card, player)
            );
          }
        },
        intro: {
          markcount(card, player) {
            return get.strNumber(get.number(card, player));
          },
          content(card, player) {
            var suit = get.suit(card, player);
            var num = get.number(card, player);
            var str = "<li>上一张牌的花色：" + get.translation(suit);
            str += "<br><li>上一张牌的点数：" + get.strNumber(num);
            return str;
          }
        }
      }
    }
  },
  //十周年步练师
  dcanxu: {
    enable: "phaseUse",
    usable: 1,
    multitarget: true,
    audio: 2,
    filterTarget(card, player, target) {
      if (player == target) {
        return false;
      }
      var num = target.countCards("h");
      if (ui.selected.targets.length) {
        return num < ui.selected.targets[0].countCards("h");
      }
      var players = game.filterPlayer();
      for (var i = 0; i < players.length; i++) {
        if (num > players[i].countCards("h")) {
          return true;
        }
      }
      return false;
    },
    selectTarget: 2,
    async content(event, trigger, player) {
      let gainner, giver;
      const { targets } = event;
      if (targets[0].countCards("h") < targets[1].countCards("h")) {
        gainner = targets[0];
        giver = targets[1];
      } else {
        gainner = targets[1];
        giver = targets[0];
      }
      const result = await gainner.gainPlayerCard(giver, true, "h", "visibleMove").forResult();
      if (result?.cards?.length) {
        const card = result.cards[0];
        if (gainner.getCards("h").includes(card) && get.suit(card, gainner) != "spade") {
          await player.draw();
        }
      }
      if (gainner.countCards("h") == giver.countCards("h")) {
        await player.recover();
      }
    },
    ai: {
      order: 10.5,
      threaten: 2.3,
      result: {
        target(player, target) {
          var num = target.countCards("h");
          var att = get.attitude(player, target);
          if (ui.selected.targets.length == 0) {
            if (att > 0) {
              return -1;
            }
            var players = game.filterPlayer();
            for (var i = 0; i < players.length; i++) {
              var num2 = players[i].countCards("h");
              var att2 = get.attitude(player, players[i]);
              if (num2 < num) {
                if (att2 > 0) {
                  return -3;
                }
                return -1;
              }
            }
            return 0;
          } else {
            return 1;
          }
        },
        player: 1
      }
    }
  },
  dczhuiyi: {
    audio: 2,
    trigger: { player: "die" },
    skillAnimation: true,
    animationColor: "wood",
    forceDie: true,
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2("dczhuiyi"), function(card, player2, target) {
        return player2 != target && _status.event.sourcex != target;
      }).set("forceDie", true).set("ai", function(target) {
        var num = get.attitude(_status.event.player, target);
        if (num > 0) {
          if (target.hp == 1) {
            num += 2;
          }
          if (target.hp < target.maxHp) {
            num += 2;
          }
        }
        return num;
      }).set("sourcex", trigger.source).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await target.recover();
      await target.draw(game.countPlayer());
    },
    ai: {
      expose: 0.5
    }
  },
  //OL界蔡文姬
  olbeige: {
    audio: "beige",
    audioname: ["ol_caiwenji"],
    trigger: { global: "damageEnd" },
    logTarget: "player",
    filter(event, player) {
      return event.card && event.card.name == "sha" && event.player.isIn() && player.countCards("he") > 0;
    },
    check(event, player) {
      let att = get.attitude(player, event.player);
      if (event.player.hasSkill("xinleiji")) {
        return att > 0;
      }
      if (att > 0 || event.player.isHealthy()) {
        return true;
      }
      if (!event.source) {
        return true;
      }
      att = get.attitude(player, event.source);
      return att <= 0 || event.source.isTurnedOver();
    },
    prompt2: "令其进行判定，然后你可根据判定结果，弃置一张牌并令其执行对应效果。",
    async content(event, trigger, player) {
      const target = trigger.player;
      const source = trigger.source;
      let result;
      result = await trigger.player.judge().forResult();
      const judgeResult = get.copy(result);
      let str = "是否弃置一张牌", strt = get.translation(target), strs = get.translation(source), goon = 0;
      switch (result.suit) {
        case "heart":
          if (target.isIn() && target.isDamaged()) {
            str += "，令" + strt + "回复1点体力";
            goon = get.recoverEffect(target, player, player);
          }
          break;
        case "diamond":
          if (target.isIn()) {
            str += "，令" + strt + "摸两张牌";
            goon = 2 * get.effect(target, { name: "draw" }, player, player);
          }
          break;
        case "spade":
          if (source && source.isIn()) {
            str += "，令" + strs + "翻" + (source.isTurnedOver() ? "回正" : "") + "面";
            goon = get.attitude(player, source) * (source.isTurnedOver() ? 2 : -2);
          }
          break;
        case "club":
          if (source && source.isIn()) {
            str += "，令" + strs + "弃置两张牌";
            var cards2 = source.getCards("he").sort(function(a, b) {
              return get.value(a, source) - get.value(b, source);
            }).slice(0, 2);
            for (var i of cards2) {
              goon += get.value(i, source);
            }
            goon *= -get.sgn(get.attitude(player, source));
          }
          break;
      }
      str += "？";
      var str2 = "若弃置点数为" + get.strNumber(result.number) + "的牌则收回自己弃置的牌";
      if (get.position(result.card, true) == "d") {
        str2 += "；若弃置花色为" + get.translation(result.suit) + "的牌则获得" + get.translation(result.card);
      }
      result = await player.chooseToDiscard({
        position: "he",
        prompt: str,
        prompt2: str2
      }).set("goon", goon).set("ai", function(card) {
        const { result: result2, goon: goon2, player: player2 } = get.event();
        let eff = Math.min(7, goon2);
        if (eff <= 0) {
          return 0;
        }
        if (get.suit(card, player2) == result2.suit) {
          eff += get.value(result2.card, player2);
        }
        if (get.number(card, player2) == result2.number) {
          return eff;
        }
        return eff - get.value(card);
      }).set("result", judgeResult).forResult();
      if (result.bool) {
        const card = result.cards[0];
        switch (judgeResult.suit) {
          case "heart":
            if (target.isIn() && target.isDamaged()) {
              await target.recover().forResult();
            }
            break;
          case "diamond":
            if (target.isIn()) {
              await target.draw(2).forResult();
            }
            break;
          case "spade":
            if (source && source.isIn()) {
              await source.turnOver().forResult();
            }
            player.addExpose(0.1);
            break;
          case "club":
            if (source && source.isIn() && source.countCards("he") > 0) {
              await source.chooseToDiscard(2, "he", true).forResult();
            }
            player.addExpose(0.1);
            break;
        }
        var gains = [];
        if (get.position(judgeResult.card, true) == "d" && get.suit(card, player) == judgeResult.suit) {
          gains.push(judgeResult.card);
        }
        if (get.position(card, true) == "d" && get.number(card, player) == judgeResult.number) {
          gains.push(card);
        }
        if (gains.length) {
          player.gain(gains, "gain2");
        }
      }
    }
  },
  //OL界张郃
  reqiaobian: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    locked: false,
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      player.addMark("reqiaobian", 2);
      await game.delayx();
    },
    marktext: "变",
    intro: {
      name2: "变",
      content(storage, player) {
        var str = "共有" + (storage || 0) + "个标记";
        if (player.storage.reqiaobian_jieshu) {
          str = "<li>" + str + "<br><li>已记录手牌数：" + get.translation(player.storage.reqiaobian_jieshu);
        }
        return str;
      }
    },
    group: ["reqiaobian_judge", "reqiaobian_draw", "reqiaobian_use", "reqiaobian_discard", "reqiaobian_jieshu"],
    subSkill: {
      judge: {
        audio: "reqiaobian",
        trigger: { player: "phaseJudgeBefore" },
        direct: true,
        filter(event, player) {
          return player.hasMark("reqiaobian") || player.hasCard((card) => lib.filter.cardDiscardable(card, player, "reqiaobian_judge"), "he");
        },
        check(event, player) {
          return player.hasCard(function(card) {
            return get.effect(
              player,
              {
                name: card.viewAs || card.name,
                cards: [card]
              },
              player,
              player
            ) < 0;
          }, "j");
        },
        async content(event, trigger, player) {
          let result;
          var choices = [];
          if (player.hasMark("reqiaobian")) {
            choices.push("弃置标记");
          }
          if (player.hasCard((card) => lib.filter.cardDiscardable(card, player, "reqiaobian_judge"), "he")) {
            choices.push("弃置牌");
          }
          choices.push("cancel2");
          result = await player.chooseControl(choices).set("prompt", "巧变：是否跳过判定阶段？").set("ai", function() {
            var evt = _status.event;
            if (lib.skill[evt.getParent().name].check(evt.getTrigger(), evt.player)) {
              return 0;
            }
            return "cancel2";
          }).forResult();
          if (result.control != "cancel2") {
            if (result.control == "弃置牌") {
              const discardResult = await player.chooseToDiscard("he", true).forResult();
              discardResult.logSkill = event.name;
            } else {
              player.logSkill(event.name);
              player.removeMark("reqiaobian", 1);
            }
            trigger.cancel();
          }
        }
      },
      draw: {
        audio: "reqiaobian",
        trigger: { player: "phaseDrawBefore" },
        direct: true,
        filter(event, player) {
          return player.hasMark("reqiaobian") || player.hasCard((card) => lib.filter.cardDiscardable(card, player, "reqiaobian_judge"), "he");
        },
        check(event, player) {
          return game.countPlayer(function(current) {
            if (current == player || current.countGainableCards(player, "h") == 0) {
              return false;
            }
            var att = get.attitude(player, current);
            if (current.hasSkill("tuntian")) {
              return att > 0;
            }
            return att < 1;
          }) > 1;
        },
        async content(event, trigger, player) {
          let result;
          var choices = [];
          if (player.hasMark("reqiaobian")) {
            choices.push("弃置标记");
          }
          if (player.hasCard((card) => lib.filter.cardDiscardable(card, player, "reqiaobian_draw"), "he")) {
            choices.push("弃置牌");
          }
          choices.push("cancel2");
          result = await player.chooseControl(choices).set("prompt", "巧变：是否跳过摸牌阶段？").set("ai", function() {
            var evt = _status.event;
            if (lib.skill[evt.getParent().name].check(evt.getTrigger(), evt.player)) {
              return 0;
            }
            return "cancel2";
          }).forResult();
          if (result.control != "cancel2") {
            if (result.control == "弃置牌") {
              const discardResult = await player.chooseToDiscard("he", true).forResult();
              discardResult.logSkill = event.name;
            } else {
              player.logSkill(event.name);
              player.removeMark("reqiaobian", 1);
            }
            trigger.cancel();
            if (game.hasPlayer((current) => current.countGainableCards(player, "h") > 0)) {
              result = await player.chooseTarget("是否获得至多两名其他角色的各一张手牌？", [1, 2], function(card, player2, target) {
                return target != player2 && target.countGainableCards(player2, "h") > 0;
              }).set("ai", function(target) {
                var att = get.attitude(_status.event.player, target);
                if (target.hasSkill("tuntian")) {
                  return att / 10;
                }
                return 1 - att;
              }).forResult();
              if (result.bool) {
                var targets = result.targets.sortBySeat();
                player.line(targets, "green");
                await player.gainMultiple(targets).forResult();
              }
            }
          }
        }
      },
      use: {
        audio: "reqiaobian",
        trigger: { player: "phaseUseBefore" },
        direct: true,
        filter(event, player) {
          return player.hasMark("reqiaobian") || player.hasCard((card) => lib.filter.cardDiscardable(card, player, "reqiaobian_judge"), "he");
        },
        check(event, player) {
          if (player.countCards("h", function(card) {
            return player.hasValueTarget(card, null, true);
          }) > 1) {
            return false;
          }
          return game.hasPlayer(function(current) {
            var att = get.sgn(get.attitude(player, current));
            if (att != 0) {
              var es = current.getCards("e");
              for (var i = 0; i < es.length; i++) {
                if (game.hasPlayer(function(current2) {
                  if (get.sgn(get.value(es[i], current)) != -att || get.value(es[i], current) < 5) {
                    return false;
                  }
                  var att2 = get.sgn(get.attitude(player, current2));
                  if (att == att2 || att2 != get.sgn(get.effect(current2, es[i], player, current2))) {
                    return false;
                  }
                  return current != current2 && !current2.isMin() && current2.canEquip(es[i]);
                })) {
                  return true;
                }
              }
            }
            if (att > 0) {
              var js = current.getCards("j", function(card) {
                return get.effect(
                  current,
                  {
                    name: card.viewAs || card.name,
                    cards: [card]
                  },
                  current,
                  current
                ) < -2;
              });
              for (var i = 0; i < js.length; i++) {
                if (game.hasPlayer(function(current2) {
                  var att2 = get.attitude(player, current2);
                  if (att2 >= 0) {
                    return false;
                  }
                  return current != current2 && current2.canAddJudge(js[i]);
                })) {
                  return true;
                }
              }
            }
          });
        },
        async content(event, trigger, player) {
          let result;
          var choices = [];
          if (player.hasMark("reqiaobian")) {
            choices.push("弃置标记");
          }
          if (player.hasCard((card) => lib.filter.cardDiscardable(card, player, "reqiaobian_use"), "he")) {
            choices.push("弃置牌");
          }
          choices.push("cancel2");
          result = await player.chooseControl(choices).set("prompt", "巧变：是否跳过出牌阶段？").set("ai", function() {
            var evt = _status.event;
            if (lib.skill[evt.getParent().name].check(evt.getTrigger(), evt.player)) {
              return 0;
            }
            return "cancel2";
          }).forResult();
          if (result.control != "cancel2") {
            if (result.control == "弃置牌") {
              const discardResult = await player.chooseToDiscard("he", true).forResult();
              discardResult.logSkill = event.name;
            } else {
              player.logSkill(event.name);
              player.removeMark("reqiaobian", 1);
            }
            trigger.cancel();
            await player.moveCard().forResult();
          }
        }
      },
      discard: {
        audio: "reqiaobian",
        trigger: { player: "phaseDiscardBefore" },
        direct: true,
        filter(event, player) {
          return player.hasMark("reqiaobian") || player.hasCard((card) => lib.filter.cardDiscardable(card, player, "reqiaobian_judge"), "he");
        },
        check(event, player) {
          return player.needsToDiscard();
        },
        async content(event, trigger, player) {
          let result;
          var choices = [];
          if (player.hasMark("reqiaobian")) {
            choices.push("弃置标记");
          }
          if (player.hasCard((card) => lib.filter.cardDiscardable(card, player, "reqiaobian_discard"), "he")) {
            choices.push("弃置牌");
          }
          choices.push("cancel2");
          result = await player.chooseControl(choices).set("prompt", "巧变：是否跳过弃牌阶段？").set("ai", function() {
            var evt = _status.event;
            if (lib.skill[evt.getParent().name].check(evt.getTrigger(), evt.player)) {
              return 0;
            }
            return "cancel2";
          }).forResult();
          if (result.control != "cancel2") {
            if (result.control == "弃置牌") {
              const discardResult = await player.chooseToDiscard("he", true).forResult();
              discardResult.logSkill = event.name;
            } else {
              player.logSkill(event.name);
              player.removeMark("reqiaobian", 1);
            }
            trigger.cancel();
          }
        }
      },
      jieshu: {
        audio: "reqiaobian",
        trigger: { player: "phaseJieshuBegin" },
        forced: true,
        filter(event, player) {
          return !player.getStorage("reqiaobian_jieshu").includes(player.countCards("h"));
        },
        async content(event, trigger, player) {
          player.addMark("reqiaobian", 1);
          player.markAuto("reqiaobian_jieshu", [player.countCards("h")]);
          player.storage.reqiaobian_jieshu.sort();
        }
      }
    }
  },
  //十周年徐庶
  rezhuhai: {
    audio: 2,
    trigger: { global: "phaseJieshuBegin" },
    direct: true,
    filter(event, player) {
      return player != event.player && event.player.getHistory("sourceDamage").length > 0 && event.player.isIn() && (player.countCards("h") > 0 || player.canUse("guohe", event.player));
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      let result;
      var choiceList = ["将一张手牌当做【杀】对其使用", "视为对其使用一张【过河拆桥】"];
      var bool = false, hs = player.getCards("h");
      for (var i of hs) {
        if (game.checkMod(i, player, "unchanged", "cardEnabled2", player) !== false && player.canUse(get.autoViewAs({ name: "sha" }, [i]), target, false)) {
          bool = true;
          break;
        }
      }
      var choices = [];
      if (bool) {
        choices.push("选项一");
      } else {
        choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
      }
      if (player.canUse("guohe", target)) {
        choices.push("选项二");
      } else {
        choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
      }
      choices.push("cancel2");
      result = await player.chooseControl(choices).set("choiceList", choiceList).set("prompt", get.prompt("rezhuhai", target)).set("ai", function() {
        var choices2 = _status.event.controls;
        var eff1 = 0, eff2 = 0;
        var player2 = _status.event.player, target2 = _status.event.getTrigger().player;
        if (choices2.includes("选项一")) {
          eff1 = get.effect(target2, { name: "sha" }, player2, player2);
        }
        if (choices2.includes("选项二")) {
          eff2 = get.effect(target2, { name: "guohe" }, player2, player2);
        }
        if (eff1 > 0 && (player2.hasSkill("xsqianxin") && player2.isDamaged() || eff1 > eff2)) {
          return "选项一";
        }
        if (eff2 > 0) {
          return "选项二";
        }
        return "cancel2";
      }).forResult();
      if (result.control != "cancel2") {
        if (result.control == "选项一") {
          result = await player.chooseCard(
            "h",
            true,
            function(card, player2) {
              if (!game.checkMod(card, player2, "unchanged", "cardEnabled2", player2)) {
                return false;
              }
              return player2.canUse(get.autoViewAs({ name: "sha" }, [card]), _status.event.getTrigger().player, false);
            },
            "选择一张手牌当做【杀】对" + get.translation(trigger.player) + "使用"
          ).set("ai", function(card) {
            var player2 = _status.event.player;
            return get.effect(_status.event.getTrigger().player, get.autoViewAs({ name: "sha" }, [card]), player2, player2) / Math.max(1, get.value(card));
          }).forResult();
          if (result.bool) {
            await player.useCard({ name: "sha" }, result.cards, "rezhuhai", trigger.player, false).forResult();
          }
        } else {
          await player.useCard({ name: "guohe", isCard: true }, trigger.player, "rezhuhai").forResult();
        }
      }
    }
  },
  xsqianxin: {
    audio: 2,
    trigger: { source: "damageSource" },
    juexingji: true,
    forced: true,
    skillAnimation: true,
    animationColor: "orange",
    filter(event, player) {
      return player.isDamaged();
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.loseMaxHp();
      await player.addSkills("rejianyan");
    },
    derivation: "rejianyan"
  },
  rejianyan: {
    audio: 2,
    enable: "phaseUse",
    usable: 2,
    filter(event, player) {
      return game.hasPlayer((current) => current.group == "key" || current.hasSex("male"));
    },
    chooseButton: {
      dialog() {
        return ui.create.dialog("###荐言###" + get.translation("rejianyan_info"));
      },
      chooseControl(event, player) {
        const list = [], storage = player.getStorage("rejianyan_used");
        if (!storage.includes("color")) {
          list.addArray(["red", "black"]);
        }
        if (!storage.includes("type")) {
          list.addArray(["basic", "trick", "equip"]);
        }
        list.push("cancel2");
        return list;
      },
      check() {
        if (!_status.event.player.getStorage("rejianyan_used").includes("color")) {
          return "red";
        }
        return "trick";
      },
      backup(result, player) {
        return {
          audio: "rejianyan",
          filterCard: () => false,
          selectCard: -1,
          info: result.control,
          async content(event, trigger, player2) {
            let result2;
            let card = false;
            let info = lib.skill.rejianyan_backup.info;
            let info2 = info in lib.color ? "color" : "type";
            player2.addTempSkill("rejianyan_used", "phaseUseEnd");
            let func = (card2) => get[info2 == "type" ? "type2" : "color"](card2) == info;
            player2.markAuto("rejianyan_used", info2);
            card = get.cardPile2(func, "top");
            event.card = card;
            if (!card) {
              if (get.discardPile(func, "top")) {
                await game.washCard();
                card = get.cardPile2(func, "top");
              }
              if (!card) {
                return;
              }
            }
            player2.showCards(card, get.translation(player2) + "发动了【荐言】");
            result2 = await player2.chooseTarget(true, "选择一名角色获得" + get.translation(card), function(card2, player3, target2) {
              return target2.group == "key" || target2.hasSex("male");
            }).set("ai", function(target2) {
              var player3 = _status.event.player, att = get.attitude(player3, target2);
              if (target2.hasSkill("nogain")) {
                att /= 10;
              }
              return att / Math.sqrt(get.distance(player3, target2, "absolute"));
            }).forResult();
            if (result2.bool) {
              var target = result2.targets[0];
              player2.line(target, "green");
              target.gain(card, "gain2");
            }
          },
          ai: { result: { player: 1 } }
        };
      }
    },
    ai: {
      order: 8,
      result: {
        player(player, target) {
          if (game.hasPlayer((current) => (current.group == "key" || current.hasSex("male")) && get.attitude(player, current) > 0)) {
            return 1;
          }
          return 0;
        }
      }
    },
    subSkill: { used: { charlotte: true, onremove: true }, backup: {} }
  },
  //野兽高顺
  decadexianzhen: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return player.canCompare(target);
    },
    filter(event, player) {
      return player.countCards("h") > 0 && !player.hasSkill("decadexianzhen2") && !player.hasSkill("decadexianzhen3");
    },
    async content(event, trigger, player) {
      const target = event.target;
      let result;
      result = await player.chooseToCompare(target).forResult();
      if (result.bool) {
        player.storage.decadexianzhen2 = target;
        player.addTempSkill("decadexianzhen2");
      } else {
        player.addTempSkill("decadexianzhen3");
      }
    },
    ai: {
      order(name, player) {
        var cards2 = player.getCards("h");
        if (player.countCards("h", "sha") == 0) {
          return 1;
        }
        for (var i = 0; i < cards2.length; i++) {
          if (cards2[i].name != "sha" && get.number(cards2[i]) > 11 && get.value(cards2[i]) < 7) {
            return 9;
          }
        }
        return get.order({ name: "sha" }) - 1;
      },
      result: {
        player(player) {
          if (player.countCards("h", "sha") > 0) {
            return 0;
          }
          var num = player.countCards("h");
          if (num > player.hp) {
            return 0;
          }
          if (num == 1) {
            return -2;
          }
          if (num == 2) {
            return -1;
          }
          return -0.7;
        },
        target(player, target) {
          var num = target.countCards("h");
          if (num == 1) {
            return -1;
          }
          if (num == 2) {
            return -0.7;
          }
          return -0.5;
        }
      },
      threaten: 1.3
    }
  },
  decadexianzhen2: {
    audio: "decadexianzhen",
    charlotte: true,
    onremove: true,
    sourceSkill: "decadexianzhen",
    mod: {
      targetInRange(card, player, target) {
        if (target == player.storage.decadexianzhen2) {
          return true;
        }
      },
      cardUsableTarget(card, player, target) {
        if (target == player.storage.decadexianzhen2) {
          return true;
        }
      }
    },
    ai: {
      unequip: true,
      skillTagFilter(player, tag, arg) {
        if (arg.target != player.storage.decadexianzhen2) {
          return false;
        }
      }
    },
    group: "decadexianzhen2_damage",
    subSkill: {
      damage: {
        audio: "decadexianzhen",
        trigger: { source: "damageBegin1" },
        forced: true,
        filter(event, player) {
          return event.card && event.player == player.storage.decadexianzhen2 && !player.hasHistory("custom", function(evt) {
            return evt.name == "decadexianzhen" && evt.cardname == event.card.name;
          });
        },
        logTarget: "player",
        async content(event, trigger, player) {
          trigger.num++;
          player.getHistory("custom").push({
            name: "decadexianzhen",
            cardname: trigger.card.name
          });
        }
      }
    }
  },
  decadexianzhen3: {
    charlotte: true,
    mod: {
      cardEnabled(card) {
        if (card.name == "sha") {
          return false;
        }
      },
      ignoredHandcard(card, player) {
        if (get.name(card) == "sha") {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name == "phaseDiscard" && get.name(card) == "sha") {
          return false;
        }
      }
    }
  },
  decadejinjiu: {
    global: "decadejinjiu_global",
    mod: {
      cardname(card) {
        if (card.name == "jiu") {
          return "sha";
        }
      },
      cardnumber(card) {
        if (card.name == "jiu") {
          return 13;
        }
      }
    },
    audio: 2,
    audioname2: {
      ol_gaoshun: "rejinjiu"
    },
    trigger: { player: ["useCard1", "respond"] },
    filter(event, player) {
      return event.card.name == "sha" && !event.skill && event.cards && event.cards.length == 1 && event.cards[0].name == "jiu";
    },
    forced: true,
    firstDo: true,
    async content(_) {
    },
    subSkill: {
      global: {
        mod: {
          cardEnabled(card, player) {
            if (card.name == "jiu") {
              var source = _status.currentPhase;
              if (source && source != player && source.hasSkill("decadejinjiu")) {
                return false;
              }
            }
          },
          cardSavable(card, player) {
            if (card.name == "jiu") {
              var source = _status.currentPhase;
              if (source && source != player && source.hasSkill("decadejinjiu")) {
                return false;
              }
            }
          }
        }
      }
    }
  },
  rebotu: {
    audio: "botu",
    trigger: { player: "phaseEnd" },
    frequent: true,
    filter(event, player) {
      if (player.countMark("rebotu_used") >= Math.min(3, game.countPlayer())) {
        return false;
      }
      var suits = [];
      game.getGlobalHistory("cardMove", function(evt) {
        if (suits.length >= 4) {
          return;
        }
        if (evt.name == "lose") {
          if (evt.position == ui.discardPile) {
            for (var i of evt.cards) {
              suits.add(get.suit(i, false));
            }
          }
        } else {
          if (evt.name == "cardsDiscard") {
            for (var i of evt.cards) {
              suits.add(get.suit(i, false));
            }
          }
        }
      });
      return suits.length >= 4;
    },
    async content(event, trigger, player) {
      player.addTempSkill("rebotu_used", "roundStart");
      player.addMark("rebotu_used", 1, false);
      player.insertPhase();
    },
    group: "rebotu_mark",
    subSkill: {
      used: {
        onremove: true,
        charlotte: true
      },
      mark: {
        trigger: {
          global: ["loseAfter", "cardsDiscardAfter"],
          player: "phaseAfter"
        },
        forced: true,
        firstDo: true,
        silent: true,
        filter(event, player) {
          if (event.name == "phase") {
            return true;
          }
          if (player != _status.currentPhase) {
            return false;
          }
          if (event.name == "lose") {
            return event.position == ui.discardPile;
          }
          return true;
        },
        async content(event, trigger, player) {
          if (trigger.name == "phase") {
            player.unmarkSkill("rebotu_mark");
            return;
          }
          const suits = [];
          game.getGlobalHistory("cardMove", (evt) => {
            if (suits.length >= 4) {
              return false;
            }
            if (evt.name == "lose") {
              if (evt.position == ui.discardPile) {
                for (const c of evt.cards) {
                  suits.add(get.suit(c, false));
                }
              }
            } else if (evt.name == "cardsDiscard") {
              for (const c of evt.cards) {
                suits.add(get.suit(c, false));
              }
            }
            return false;
          });
          player.storage.rebotu_mark = suits;
          player.markSkill("rebotu_mark");
        },
        intro: {
          onunmark: true,
          content: "本回合已有$花色的牌进入过弃牌堆"
        }
      }
    }
  },
  xinganlu: {
    enable: "phaseUse",
    usable: 1,
    audio: 2,
    selectTarget: 2,
    delay: 0,
    filterTarget(card, player, target) {
      if (target.isMin()) {
        return false;
      }
      if (ui.selected.targets.length == 0) {
        return true;
      }
      if (ui.selected.targets[0].countCards("e") == 0 && target.countCards("e") == 0) {
        return false;
      }
      return true;
    },
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      const targets = event.targets;
      await targets[0].swapEquip(targets[1]).forResult();
      await game.delayex().forResult();
      var num = Math.abs(targets[0].countCards("e") - targets[1].countCards("e"));
      if (num > player.getDamagedHp()) {
        await player.chooseToDiscard("h", 2, true).forResult();
      }
    },
    ai: {
      order: 10,
      expose: 0.2,
      threaten(player, target) {
        return 0.8 * Math.max(1 + target.maxHp - target.hp);
      },
      result: {
        target(player, target) {
          if (!ui.selected.targets.length) {
            return -get.value(target.getCards("e"), target);
          }
          var target2 = ui.selected.targets[0];
          var eff_target = get.value(target2.getCards("e"), target) - get.value(target.getCards("e"), target);
          if (get.sgn(eff_target) == get.sgn(-get.value(target2.getCards("e"), target2))) {
            return 0;
          }
          return eff_target;
        }
      }
    }
  },
  xinbuyi: {
    audio: 2,
    trigger: { global: "dying" },
    filter(event, player) {
      return event.player.countCards("h") > 0;
    },
    check(event, player) {
      return get.attitude(player, event.player) > 0;
    },
    async content(event, trigger, player) {
      let result;
      if (player == trigger.player) {
        result = await player.chooseCard("h", true).set("ai", function(card2) {
          if (get.type(card2) != "basic") {
            return 100 - get.value(card2);
          }
          return 0;
        }).forResult();
      } else {
        result = await player.choosePlayerCard("h", trigger.player, true).forResult();
      }
      var card = result.cards[0], target = trigger.player;
      player.showCards(card, get.translation(player) + "对" + (player == target ? "自己" : get.translation(target)) + "发动了【补益】");
      if (get.type(card, null, target) != "basic") {
        target.discard(card);
        target.recover();
        if (target.countCards("h") == 1) {
          target.draw();
        }
      }
    },
    logTarget: "player"
  },
  rejiaozhao: {
    audio: 2,
    enable: "phaseUse",
    group: "rejiaozhao_base",
    locked: false,
    mod: {
      targetEnabled(card, player, target) {
        if (player == target && card.storage && card.storage.rejiaozhao) {
          return false;
        }
      }
    },
    filter(event, player) {
      return player.hasMark("redanxin") && player.countCards("h") && player.getStorage("rejiaozhao_clear").length < player.countMark("redanxin");
    },
    chooseButton: {
      dialog(event, player) {
        var list = [], storage = player.getStorage("rejiaozhao_clear");
        for (var name of lib.inpile) {
          var type = get.type(name);
          if ((type == "basic" || type == "trick") && !storage.includes(type)) {
            list.push([type, "", name]);
            if (name == "sha") {
              for (var nature of lib.inpile_nature) {
                list.push([type, "", name, nature]);
              }
            }
          }
        }
        return ui.create.dialog("矫诏", [list, "vcard"]);
      },
      filter(button, player) {
        var card = { name: button.link[2], nature: button.link[3] };
        if (player.countMark("redanxin") < 2) {
          card.storage = { rejiaozhao: true };
        }
        var evt = _status.event.getParent();
        return evt.filterCard(card, player, evt);
      },
      check(button) {
        var card = { name: button.link[2], nature: button.link[3] }, player = _status.event.player;
        if (player.countMark("redanxin") < 2) {
          card.storage = { rejiaozhao: true };
        }
        return player.getUseValue(card, null, true);
      },
      backup(links, player) {
        var next = {
          audio: "redanxin",
          viewAs: { name: links[0][2], nature: links[0][3] },
          filterCard: true,
          position: "h",
          popname: true,
          ai1: (card) => 8 - get.value(card),
          onuse(result, player2) {
            player2.addTempSkill("rejiaozhao_clear", "phaseUseAfter");
            player2.markAuto("rejiaozhao_clear", [get.type(result.card)]);
          }
        };
        if (player.countMark("redanxin") < 2) {
          next.viewAs.storage = { rejiaozhao: true };
        }
        return next;
      },
      prompt(links) {
        return "将一张手牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
      }
    },
    ai: {
      order: 6,
      result: {
        player: 1
      }
    },
    derivation: ["rejiaozhao_lv2", "rejiaozhao_lv3"],
    subSkill: {
      clear: { onremove: true },
      base: {
        audio: "rejiaozhao",
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
          if (player.hasMark("redanxin")) {
            return false;
          }
          return player.countCards("h") > 0 && game.hasPlayer((current) => current != player);
        },
        filterCard: true,
        position: "h",
        discard: false,
        lose: false,
        check(card) {
          return 1 / Math.max(1, _status.event.player.getUseValue(card));
        },
        prompt: "出牌阶段限一次。你可以展示一张手牌，并令一名距离你最近的角色选择一种基本牌或普通锦囊牌的牌名。你可将此牌当做其声明的牌使用直到此阶段结束（你不是此牌的合法目标）。",
        async content(event, trigger, player) {
          const cards2 = event.cards;
          let result;
          player.showCards(cards2);
          var targets = game.filterPlayer();
          targets.remove(player);
          targets.sort(function(a, b) {
            return Math.max(1, get.distance(player, a)) - Math.max(1, get.distance(player, b));
          });
          var distance = Math.max(1, get.distance(player, targets[0]));
          for (var i = 1; i < targets.length; i++) {
            if (Math.max(1, get.distance(player, targets[i])) > distance) {
              targets.splice(i);
              break;
            }
          }
          result = await player.chooseTarget("请选择【矫诏】的目标", true, function(card, player2, target2) {
            return _status.event.targets.includes(target2);
          }).set("ai", function(target2) {
            return get.attitude(_status.event.player, target2);
          }).set("targets", targets).forResult();
          if (!result.bool) {
            return;
          }
          var target = result.targets[0];
          event.target = target;
          var list = [];
          for (var i = 0; i < lib.inpile.length; i++) {
            var name = lib.inpile[i];
            if (name == "sha") {
              list.push(["基本", "", "sha"]);
              for (var j of lib.inpile_nature) {
                list.push(["基本", "", "sha", j]);
              }
            } else if (get.type(name) == "basic") {
              list.push(["基本", "", name]);
            } else if (get.type(name) == "trick") {
              list.push(["锦囊", "", name]);
            }
          }
          result = await target.chooseButton(["矫诏", [list, "vcard"]], true).set("ai", function(button) {
            var player2 = _status.event.getParent().player, card = {
              name: button.link[2],
              nature: button.link[3],
              storage: {
                rejiaozhao: true
              }
            };
            return player2.getUseValue(card, null, true) * _status.event.att;
          }).set("att", get.attitude(event.target, player) > 0 ? 1 : -1).forResult();
          var chosen = result.links[0][2];
          var nature = result.links[0][3];
          var fakecard = {
            name: chosen,
            storage: { rejiaozhao: true }
          };
          if (nature) {
            fakecard.nature = nature;
          }
          event.target.showCards(
            game.createCard({
              name: chosen,
              nature,
              suit: cards2[0].suit,
              number: cards2[0].number
            }),
            get.translation(event.target) + "声明了" + get.translation(chosen)
          );
          game.broadcastAll(
            (player2, fakecard2) => {
              player2.storage.rejiaozhao_viewas = fakecard2;
            },
            player,
            fakecard
          );
          cards2[0].addGaintag("rejiaozhao");
          player.addTempSkill("rejiaozhao_viewas", "phaseUseEnd");
        },
        ai: {
          order: 9,
          result: {
            player: 1
          }
        }
      },
      backup: { audio: "rejiaozhao" },
      viewas: {
        enable: "phaseUse",
        mod: {
          targetEnabled(card, player, target) {
            if (player == target && card.storage && card.storage.rejiaozhao) {
              return false;
            }
          }
        },
        filter(event, player) {
          if (!player.storage.rejiaozhao_viewas) {
            return false;
          }
          var cards2 = player.getCards("h", function(card2) {
            return card2.hasGaintag("rejiaozhao");
          });
          if (!cards2.length) {
            return false;
          }
          if (!game.checkMod(cards2[0], player, "unchanged", "cardEnabled2", player)) {
            return false;
          }
          var card = get.autoViewAs(player.storage.rejiaozhao_viewas, cards2);
          return event.filterCard(card, player, event);
        },
        viewAs(cards2, player) {
          return player.storage.rejiaozhao_viewas;
        },
        filterCard(card) {
          return card.hasGaintag("rejiaozhao");
        },
        selectCard: -1,
        position: "h",
        popname: true,
        prompt() {
          return "将“矫诏”牌当做" + get.translation(_status.event.player.storage.rejiaozhao_viewas) + "使用";
        },
        onremove(player) {
          player.removeGaintag("rejiaozhao");
          delete player.storage.rejiaozhao_viewas;
        },
        ai: { order: 8 }
      }
    }
  },
  redanxin: {
    audio: 2,
    trigger: { player: "damageEnd" },
    frequent: true,
    async content(event, trigger, player) {
      await player.draw();
      if (player.countMark("redanxin") < 2) {
        player.addMark("redanxin", 1, false);
      }
    },
    intro: { content: "当前升级等级：Lv#" },
    ai: {
      maixie: true,
      effect: {
        target: (card, player, target) => {
          if (!get.tag(card, "damage")) {
            return;
          }
          if (target.hp + target.hujia < 2 || player.hasSkillTag("jueqing", false, target)) {
            return 2;
          }
          if (!target.hasSkill("rejiaozhao") || target.countMark("redanxin") > 1) {
            return [1, 1];
          }
          return [1, 0.8 * target.hp - 0.4];
        }
      }
    }
  },
  //马岱
  reqianxi: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    frequent: true,
    async content(event, trigger, player) {
      let result;
      await player.draw();
      if (player.hasCard((card) => {
        return lib.filter.cardDiscardable(card, player, "reqianxi");
      }, "he")) {
        result = await player.chooseToDiscard("he", true).set("ai", (card) => {
          let player2 = get.event().player;
          if (get.color(card, player2)) {
            return 7 - get.value(card, player2);
          }
          return 4 - get.value(card, player2);
        }).forResult();
      } else {
        return;
      }
      if (result.bool && game.hasPlayer((current) => current != player && get.distance(player, current) <= 1)) {
        var selectedColor = get.color(result.cards[0], player);
        var color = get.translation(selectedColor);
        result = await player.chooseTarget(true, "选择【潜袭】的目标", "令其本回合不能使用或打出" + color + "牌，且" + color + "防具失效，且回复体力时，你摸两张牌", function(card, player2, target2) {
          return target2 != player2 && get.distance(player2, target2) <= 1;
        }).set("ai", function(target2) {
          return -get.attitude(_status.event.player, target2) * Math.sqrt(1 + target2.countCards("he"));
        }).forResult();
      } else {
        return;
      }
      if (result.bool) {
        var target = result.targets[0];
        player.line(target, "green");
        target.storage.reqianxi_effect = [selectedColor, player];
        target.addTempSkill("reqianxi_effect");
        target.markSkill("reqianxi_effect");
      }
    },
    subSkill: {
      effect: {
        mark: true,
        intro: {
          markcount: () => 0,
          content(storage, player) {
            var color = get.translation(storage[0]), source = get.translation(storage[1]);
            return "本回合不能使用或打出" + color + "牌，且" + color + "防具失效，且回复体力时，" + source + "摸两张牌";
          }
        },
        charlotte: true,
        onremove: true,
        mod: {
          cardEnabled2(card, player) {
            if (get.itemtype(card) == "card" && get.color(card) == player.getStorage("reqianxi_effect")[0]) {
              return false;
            }
          }
        },
        trigger: { player: "recoverEnd" },
        forced: true,
        popup: false,
        filter(event, player) {
          return player.storage.reqianxi_effect && player.storage.reqianxi_effect[1].isIn();
        },
        async content(event, trigger, player) {
          const target = player.storage.reqianxi_effect[1];
          target.logSkill("reqianxi", player);
          await target.draw(2);
        },
        ai: {
          unequip2: true,
          skillTagFilter(player) {
            var evt = _status.event, color = player.getStorage("reqianxi_effect")[0];
            if (evt.name == "lose" && evt.loseEquip) {
              var card = evt.cards[evt.num];
              if (card && get.subtype(card, false) == "equip2" && get.color(card) == color) {
                return true;
              }
              return false;
            } else {
              var equip = player.getEquip(2);
              if (equip && get.color(equip) == color) {
                return true;
              }
              return false;
            }
          }
        }
      }
    }
  },
  //徐晃
  olduanliang: {
    audio: 2,
    locked: false,
    enable: "chooseToUse",
    filterCard(card) {
      return get.type2(card) != "trick" && get.color(card) == "black";
    },
    filter(event, player) {
      return player.hasCard((card) => get.type2(card) != "trick" && get.color(card) == "black", "hes");
    },
    position: "hes",
    viewAs: { name: "bingliang" },
    prompt: "将一张黑色非锦囊牌当做兵粮寸断使用",
    check(card) {
      return 6 - get.value(card);
    },
    ai: {
      order: 9
    },
    mod: {
      targetInRange(card, player, target) {
        if (card.name == "bingliang" && !player.getStat("damage")) {
          return true;
        }
      }
    }
  },
  oljiezi: {
    audio: 2,
    trigger: { global: ["phaseDrawSkipped", "phaseDrawCancelled"] },
    direct: true,
    async content(event, trigger, player) {
      let result = await player.chooseTarget(get.prompt("oljiezi"), "你可选择一名角色。若该角色：手牌数为全场最少且没有“辎”，则其获得一枚“辎”。否则其摸一张牌。").set("ai", function(target2) {
        var att = get.attitude(_status.event.player, target2);
        if (!target2.hasMark("oljiezi") && target2.isMinHandcard()) {
          att *= 2;
        }
        return att;
      }).forResult();
      if (result.bool) {
        var target = result.targets[0];
        player.logSkill("oljiezi", target);
        if (!target.hasMark("oljiezi") && target.isMinHandcard()) {
          target.addMark("oljiezi", 1);
        } else {
          target.draw();
        }
      }
    },
    marktext: "辎",
    intro: {
      name2: "辎",
      content: "mark",
      onunmark: true
    },
    group: "oljiezi_extra",
    subSkill: {
      extra: {
        audio: "oljiezi",
        trigger: { global: "phaseDrawAfter" },
        forced: true,
        filter(event, player) {
          return event.player.hasMark("oljiezi");
        },
        logTarget: "player",
        async content(event, trigger, player) {
          const evt = trigger.getParent("phase", true, true);
          if (evt?.phaseList) {
            evt.phaseList.splice(evt.num + 1, 0, "phaseDraw|oljiezi");
          }
          trigger.player.removeMark("oljiezi", trigger.player.countMark("oljiezi"));
        }
      }
    }
  },
  //界护驾
  rehujia: {
    audio: "hujia",
    inherit: "hujia",
    filter(event, player) {
      if (event.responded) {
        return false;
      }
      if (player.storage.hujiaing) {
        return false;
      }
      if (!player.hasZhuSkill("rehujia")) {
        return false;
      }
      if (!event.filterCard({ name: "shan" }, player, event)) {
        return false;
      }
      return game.hasPlayer((current) => current != player && current.group == "wei");
    },
    ai: {
      respondShan: true,
      skillTagFilter(player) {
        if (player.storage.hujiaing) {
          return false;
        }
        if (!player.hasZhuSkill("rehujia")) {
          return false;
        }
        return game.hasPlayer((current) => current != player && current.group == "wei");
      }
    },
    group: "rehujia_draw",
    subSkill: {
      draw: {
        trigger: { global: ["useCard", "respond"] },
        usable: 1,
        filter(event, player) {
          return event.card.name == "shan" && event.player != player && event.player.group == "wei" && event.player.isIn() && event.player != _status.currentPhase && player.hasZhuSkill("rehujia");
        },
        async cost(event, trigger, player) {
          event.result = await trigger.player.chooseBool(`护驾：是否令${get.translation(player)}摸一张牌？`).set("ai", () => {
            const evt = _status.event;
            return get.attitude(evt.player, evt.getParent().player) > 0;
          }).forResult();
        },
        async content(event, trigger, player) {
          trigger.player.line(player, "fire");
          await player.draw();
        }
      }
    }
  },
  //夏侯氏
  reqiaoshi: {
    audio: 2,
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      return event.player != player && event.player.countCards("h") == player.countCards("h") && event.player.isIn();
    },
    check(event, player) {
      return get.attitude(player, event.player) >= 0;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      while (player.isIn() && target.isIn()) {
        const list1 = (await player.draw("nodelay").forResult()).cards;
        const list2 = (await target.draw().forResult()).cards;
        await game.delayx();
        if ([list1, list2].every((cards2) => get.itemtype(cards2) == "cards") && list1.length == list2.length && list1.map((card) => get.suit(card, player)).toUniqued().every((suit) => list2.some((card) => get.suit(card, target) == suit))) {
          const result = await player.chooseBool("是否继续发动【樵拾】？", `和${get.translation(target)}各摸一张牌`).forResult();
          if (!result?.bool) {
            break;
          }
        } else {
          break;
        }
      }
    },
    ai: { expose: 0.1 }
  },
  reyanyu: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.hasCard((card) => lib.skill.reyanyu.filterCard(card, player), "h");
    },
    filterCard: (card, player) => get.name(card) == "sha" && player.canRecast(card),
    discard: false,
    lose: false,
    delay: false,
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      await player.recast(cards2);
    },
    ai: {
      basic: {
        order: 1
      },
      result: {
        player: 1
      }
    },
    group: "reyanyu2"
  },
  reyanyu2: {
    trigger: { player: "phaseUseEnd" },
    direct: true,
    sourceSkill: "reyanyu",
    filter: (event, player) => player.hasHistory("useSkill", (evt) => evt.skill == "reyanyu" && evt.event.getParent(2) == event) && game.hasPlayer((target) => target.hasSex("male") && target != player),
    async content(event, trigger, player) {
      let result;
      const num = Math.min(3, player.getHistory("useSkill", (evt) => evt.skill == "reyanyu" && evt.event.getParent(2) == trigger).length);
      result = await player.chooseTarget(get.prompt("reyanyu"), "令一名男性角色摸" + get.cnNumber(num) + "张牌", function(card, player2, target) {
        return target.hasSex("male") && target != player2;
      }).set("ai", function(target) {
        return get.attitude(_status.event.player, target);
      }).forResult();
      if (result.bool) {
        player.logSkill("reyanyu", result.targets);
        await result.targets[0].draw(num).forResult();
      }
    }
  },
  //虞翻
  xinzongxuan: {
    audio: 2,
    trigger: {
      player: "loseAfter",
      global: "loseAsyncAfter"
    },
    filter(event, player) {
      if (event.type != "discard") {
        return false;
      }
      var evt = event.getl(player);
      if (!evt || !evt.cards2) {
        return false;
      }
      for (var i = 0; i < evt.cards2.length; i++) {
        if (get.position(evt.cards2[i]) == "d") {
          return true;
        }
      }
      return false;
    },
    check(trigger, player) {
      if (trigger.getParent(3).name == "phaseDiscard") {
        return true;
      }
      if (!game.hasPlayer(function(current) {
        return current != player && get.attitude(player, current) > 0 && !current.hasSkillTag("nogain");
      })) {
        return false;
      }
      var cards2 = trigger.getl(player).cards2;
      for (var i = 0; i < cards2.length; i++) {
        if (get.position(cards2[i], true) == "d" && get.type2(cards2[i], false) == "trick") {
          return true;
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      const cards2 = [], cards22 = trigger.getl(player).cards2;
      cards2.push(...cards22.filter((card) => get.position(card, true) == "d"));
      const result = await player.chooseToMove("纵玄：将任意张牌置于牌堆顶（左边的牌更接近牌堆顶）", true, "allowChooseAll").set("list", [["本次弃置的牌（请将要给出的锦囊牌留在这里）", cards2], ["牌堆顶"]]).set("filterOk", function(moved) {
        if (moved[0].length == 1 && get.type2(moved[0][0], false) == "trick") {
          return true;
        }
        return moved[1].length > 0;
      }).set("processAI", function(list) {
        const cards3 = list[0][1].slice(0), player2 = _status.event.player;
        let result2 = [[], []];
        if (game.hasPlayer(function(current) {
          return current != player2 && get.attitude(player2, current) > 0 && !current.hasSkillTag("nogain");
        })) {
          var max_val = 0;
          var max_card = false;
          for (var i of cards3) {
            if (get.type2(i, false) == "trick") {
              var val = get.value(i, "raw");
              if (val > max_val) {
                max_card = i;
                max_val = val;
              }
            }
          }
          if (max_card) {
            result2[0].push(max_card);
            cards3.remove(max_card);
          }
        }
        if (cards3.length) {
          var max_val = 0;
          var max_card = false;
          var equip = game.hasPlayer(function(current) {
            return current.isDamaged() && get.recoverEffect(current, player2, player2) > 0;
          });
          for (var i of cards3) {
            var val = get.value(i);
            var type = get.type2(i, false);
            if (type == "basic") {
              val += 3;
            }
            if (type == "equip" && equip) {
              val += 9;
            }
            if (max_val == 0 || val > max_val) {
              max_card = i;
              max_val = val;
            }
          }
          if (max_card) {
            result2[1].push(max_card);
            cards3.remove(max_card);
          }
          result2[0].addArray(cards3);
        }
        return result2;
      }).forResult();
      if (result.bool) {
        const cards3 = result.moved[1].slice(0);
        if (cards3?.length) {
          cards3.reverse();
          game.log(player, "将", cards3, "置于牌堆顶");
          await game.cardsGotoPile(cards3, "insert");
        }
        const list = result.moved[0].filter(function(i) {
          return get.type2(i, false) == "trick";
        });
        if (!list.length || !game.hasPlayer((current) => current != player)) {
          return;
        }
        const result2 = await player.chooseButtonTarget({
          createDialog: ["纵玄：是否将一张锦囊牌交给一名其他角色？", list],
          filterButton: true,
          filterTarget: lib.filter.notMe,
          ai1(button) {
            if (_status.event.goon) {
              return Math.max(0.1, get.value(button.link, "raw"));
            }
            return 0;
          },
          forced: !result.moved[1].length,
          goon: game.hasPlayer(function(current) {
            return current != player && get.attitude(player, current) > 0 && !current.hasSkillTag("nogain");
          }),
          ai2(target) {
            const card = ui.selected.buttons[0].link, player2 = get.player();
            let eff = Math.max(0.1, get.value(card, target)) * get.attitude(player2, target);
            if (target.hasSkill("nogain")) {
              eff /= 10;
            }
            return eff;
          }
        }).forResult();
        if (result2.bool && result2.links?.length && result2.targets?.length) {
          const {
            links: cards4,
            targets: [target]
          } = result2;
          player.line(target, "green");
          await target.gain(cards4, "gain2");
        }
      }
    }
  },
  xinzhiyan: {
    audio: "zhiyan",
    audioname: ["re_yufan", "xin_yufan"],
    audioname2: { gexuan: "zhiyan_gexuan" },
    trigger: { player: "phaseJieshuBegin" },
    direct: true,
    async content(event, trigger, player) {
      let result = await player.chooseTarget(get.prompt("zhiyan"), "令一名角色摸一张牌并展示之。若为基本牌则你摸一张牌；若为装备牌，则其回复1点体力").set("ai", function(target2) {
        return get.attitude(_status.event.player, target2) * (target2.isDamaged() ? 2 : 1);
      }).forResult();
      if (!result.bool) {
        return;
      }
      var target = result.targets[0];
      player.logSkill("xinzhiyan", result.targets);
      var needRecover = false;
      result = await target.draw("visible").forResult();
      var card = result?.cards?.[0];
      if (get.type(card) == "basic") {
        player.draw();
      }
      if (get.type(card) == "equip") {
        if (target.getCards("h").includes(card) && target.hasUseTarget(card)) {
          target.chooseUseTarget(card, true, "nopopup");
          game.delay();
        }
        needRecover = true;
      }
      if (needRecover) {
        target.recover();
      }
    },
    ai: {
      expose: 0.2,
      threaten: 1.2
    }
  },
  //新主公技
  xinhuangtian: {
    audio: "xinhuangtian2",
    audioname: ["zhangjiao", "re_zhangjiao"],
    global: "xinhuangtian2",
    zhuSkill: true
  },
  xinhuangtian2: {
    audio: 2,
    enable: "phaseUse",
    discard: false,
    lose: false,
    delay: false,
    line: true,
    prepare(cards2, player, targets) {
      targets[0].logSkill("xinhuangtian");
    },
    prompt() {
      var player = _status.event.player;
      var list = game.filterPlayer(function(target) {
        return target != player && target.hasZhuSkill("xinhuangtian", player);
      });
      var str = "将一张【闪】或黑桃手牌交给" + get.translation(list);
      if (list.length > 1) {
        str += "中的一人";
      }
      return str;
    },
    filter(event, player) {
      if (player.group != "qun") {
        return false;
      }
      if (!game.hasPlayer(function(target) {
        return target != player && target.hasZhuSkill("xinhuangtian", player) && !target.hasSkill("xinhuangtian3");
      })) {
        return false;
      }
      return player.hasCard(function(card) {
        return lib.skill.xinhuangtian2.filterCard(card, player);
      }, "h");
    },
    filterCard(card, player) {
      return get.name(card, player) == "shan" || get.suit(card, player) == "spade";
    },
    log: false,
    visible: true,
    filterTarget(card, player, target) {
      return target != player && target.hasZhuSkill("xinhuangtian", player) && !target.hasSkill("xinhuangtian3");
    },
    //usable:1,
    //forceaudio:true,
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      await player.give(cards2, target);
      target.addTempSkill("xinhuangtian3", "phaseUseEnd");
    },
    ai: {
      expose: 0.3,
      order: 10,
      result: {
        target: 5
      }
    }
  },
  xinhuangtian3: {},
  rejijiang: {
    audio: "jijiang1",
    audioname: ["liushan", "re_liubei", "re_liushan", "ol_liushan"],
    group: ["rejijiang1", "rejijiang3"],
    zhuSkill: true,
    filter(event, player) {
      if (!player.hasZhuSkill("rejijiang") || !game.hasPlayer(function(current) {
        return current != player && current.group == "shu";
      })) {
        return false;
      }
      return !event.jijiang && (event.type != "phase" || !player.hasSkill("jijiang3"));
    },
    enable: ["chooseToUse", "chooseToRespond"],
    viewAs: { name: "sha" },
    filterCard: () => false,
    selectCard: -1,
    ai: {
      order() {
        return get.order({ name: "sha" }) + 0.3;
      },
      respondSha: true,
      skillTagFilter(player) {
        if (!player.hasZhuSkill("rejijiang") || !game.hasPlayer(function(current) {
          return current != player && current.group == "shu";
        })) {
          return false;
        }
      }
    }
  },
  rejijiang1: {
    audio: "jijiang1",
    audioname: ["liushan", "re_liubei", "re_liushan", "ol_liushan"],
    trigger: { player: ["useCardBegin", "respondBegin"] },
    logTarget: "targets",
    sourceSkill: "rejijiang",
    filter(event, player) {
      return event.skill == "rejijiang";
    },
    forced: true,
    async content(event, trigger, player) {
      delete trigger.skill;
      trigger.getParent().set("jijiang", true);
      var current = player.next;
      while (current != player) {
        if (current.group == "shu") {
          var next = current.chooseToRespond("是否替" + get.translation(player) + "打出一张杀？");
          next.set("filterCard", function(card, player2) {
            if (get.name(card) !== "sha") {
              return false;
            }
            return lib.filter.cardRespondable(card, player2);
          });
          next.set("ai", function() {
            var event2 = _status.event;
            return get.attitude(event2.player, event2.source) - 2;
          });
          next.set("source", player);
          next.set("jijiang", true);
          next.set("skillwarn", "替" + get.translation(player) + "打出一张杀");
          next.noOrdering = true;
          next.autochoose = lib.filter.autoRespondSha;
          var result = await next.forResult();
          if (result.bool) {
            trigger.card = result.card;
            trigger.cards = result.cards;
            trigger.throw = false;
            if (typeof current.ai.shown == "number" && current.ai.shown < 0.95) {
              current.ai.shown += 0.3;
              if (current.ai.shown > 0.95) {
                current.ai.shown = 0.95;
              }
            }
            return;
          }
        }
        current = current.next;
      }
      player.addTempSkill("jijiang3");
      trigger.cancel();
      trigger.getParent().goto(0);
    }
  },
  rejijiang3: {
    trigger: { global: ["useCard", "respond"] },
    usable: 1,
    sourceSkill: "rejijiang",
    filter(event, player) {
      return event.card.name == "sha" && event.player != player && event.player.group == "shu" && event.player.isIn() && event.player != _status.currentPhase && player.hasZhuSkill("rejijiang");
    },
    async cost(event, trigger, player) {
      event.result = await trigger.player.chooseBool(`激将：是否令${get.translation(player)}摸一张牌？`).set("ai", () => {
        const evt = _status.event;
        return get.attitude(evt.player, evt.getParent().player) > 0;
      }).forResult();
    },
    async content(event, trigger, player) {
      trigger.player.line(player, "fire");
      await player.draw();
    }
  },
  //鲁肃
  olhaoshi: {
    audio: 2,
    trigger: { player: "phaseDrawBegin2" },
    filter(event, player) {
      return !event.numFixed;
    },
    check(event, player) {
      return player.countCards("h") + 2 + event.num <= 5 || game.hasPlayer(function(target) {
        return player !== target && !game.hasPlayer(function(current) {
          return current !== player && current !== target && current.countCards("h") < target.countCards("h");
        }) && get.attitude(player, target) > 0;
      });
    },
    async content(event, trigger, player) {
      trigger.num += 2;
      player.addTempSkill("olhaoshi_give", "phaseDrawAfter");
    },
    subSkill: {
      give: {
        trigger: { player: "phaseDrawEnd" },
        forced: true,
        charlotte: true,
        popup: false,
        filter(event, player) {
          return player.countCards("h") > 5;
        },
        async content(event, trigger, player) {
          let result;
          var targets = game.filterPlayer(function(target2) {
            return target2 != player && !game.hasPlayer(function(current) {
              return current != player && current != target2 && current.countCards("h") < target2.countCards("h");
            });
          }), num = Math.floor(player.countCards("h") / 2);
          result = await player.chooseCardTarget({
            position: "h",
            filterCard: true,
            filterTarget(card, player2, target2) {
              return _status.event.targets.includes(target2);
            },
            targets,
            selectTarget: targets.length == 1 ? -1 : 1,
            selectCard: num,
            prompt: "将" + get.cnNumber(num) + "张手牌交给一名手牌数最少的其他角色",
            forced: true,
            ai1(card) {
              var goon = false, player2 = _status.event.player;
              for (var i of _status.event.targets) {
                if (get.attitude(i, player2) > 0 && get.attitude(player2, i) > 0) {
                  goon = true;
                }
                break;
              }
              if (goon) {
                if (!player2.hasValueTarget(card) || card.name == "sha" && player2.countCards("h", function(cardx) {
                  return cardx.name == "sha" && !ui.selected.cards.includes(cardx);
                }) > player2.getCardUsable("sha")) {
                  return 2;
                }
                return Math.max(2, get.value(card) / 4);
              }
              return 1 / Math.max(1, get.value(card));
            },
            ai2(target2) {
              return get.attitude(_status.event.player, target2);
            }
          }).forResult();
          if (result.bool) {
            var target = result.targets[0];
            player.line(target, "green");
            player.give(result.cards, target);
            player.markAuto("olhaoshi_help", [target]);
            player.addTempSkill("olhaoshi_help", { player: "phaseBeginStart" });
          }
        }
      },
      help: {
        trigger: { target: "useCardToTargeted" },
        direct: true,
        charlotte: true,
        onremove: true,
        filter(event, player) {
          if (!player.storage.olhaoshi_help || !player.storage.olhaoshi_help.length) {
            return false;
          }
          if (event.card.name != "sha" && get.type(event.card) != "trick") {
            return false;
          }
          for (var i of player.storage.olhaoshi_help) {
            if (i.countCards("h") > 0) {
              return true;
            }
          }
          return false;
        },
        async content(event, trigger, player) {
          let result;
          let targets = event.targets;
          let target = event.target;
          while (true) {
            if (!targets) {
              targets = player.storage.olhaoshi_help.slice(0).sortBySeat();
            }
            if (!targets.length) break;
            target = targets.shift();
            result = await target.chooseCard("h", "好施：是否将一张手牌交给" + get.translation(player) + "？").set("ai", function(card) {
              var player2 = _status.event.player, target2 = _status.event.getTrigger().player;
              if (!_status.event.goon) {
                if (get.value(card, player2) < 0 || get.value(card, target2) < 0) {
                  return 1;
                }
                return 0;
              }
              var cardx = _status.event.getTrigger().card;
              if (card.name == "shan" && get.tag(cardx, "respondShan") && target2.countCards("h", "shan") < player2.countCards("h", "shan")) {
                return 2;
              }
              if (card.name == "sha" && (cardx.name == "juedou" || get.tag(card, "respondSha") && target2.countCards("h", "sha") < player2.countCards("h", "sha"))) {
                return 2;
              }
              if (get.value(card, target2) > get.value(card, player2) || target2.getUseValue(card) > player2.getUseValue(card)) {
                return 1;
              }
              if (player2.hasSkillTag("noh")) {
                return 0.5 / Math.max(1, get.value(card, player2));
              }
              return 0;
            }).set("goon", get.attitude(target, player) > 0).forResult();
            if (result.bool) {
              target.logSkill("olhaoshi_help", player);
              target.give(result.cards, player);
            }
          }
        }
      }
    }
  },
  oldimeng: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => lib.skill.oldimeng.filterTarget(null, player, current));
    },
    selectTarget: 2,
    complexTarget: true,
    filterTarget(card, player, target) {
      if (target == player) {
        return false;
      }
      var ps = player.countCards("he");
      if (!ui.selected.targets.length) {
        var hs = target.countCards("h");
        return game.hasPlayer(function(current2) {
          if (current2 == player || current2 == target) {
            return false;
          }
          var cs2 = current2.countCards("h");
          return (hs > 0 || cs2 > 0) && Math.abs(hs - cs2) <= ps;
        });
      }
      var current = ui.selected.targets[0], hs = target.countCards("h"), cs = current.countCards("h");
      return (hs > 0 || cs > 0) && Math.abs(hs - cs) <= ps;
    },
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      const { targets } = event;
      await targets[0].swapHandcards(targets[1]);
      player.addTempSkill("oldimeng_discard", "phaseUseAfter");
      player.markAuto("oldimeng_discard", [targets]);
    },
    ai: {
      threaten: 4.5,
      pretao: true,
      nokeep: true,
      order: 1,
      expose: 0.2,
      result: {
        target(player, target) {
          if (!ui.selected.targets.length) {
            return -Math.sqrt(target.countCards("h"));
          }
          var h1 = ui.selected.targets[0].getCards("h"), h2 = target.getCards("h");
          if (h2.length > h1.length) {
            return 0;
          }
          var delval = get.value(h2, target) - get.value(h1, ui.selected.targets[0]);
          if (delval >= 0) {
            return 0;
          }
          return -delval * (h1.length - h2.length);
        }
      }
    },
    subSkill: {
      discard: {
        audio: "oldimeng",
        trigger: { player: "phaseUseEnd" },
        forced: true,
        charlotte: true,
        onremove: true,
        filter(event, player) {
          return player.countCards("he") > 0;
        },
        async content(event, trigger, player) {
          for (let targets of player.getStorage("oldimeng_discard")) {
            if (targets.length < 2) {
              continue;
            }
            const num = Math.abs(targets[0].countCards("h") - targets[1].countCards("h"));
            if (num > 0 && player.countCards("he") > 0) {
              await player.chooseToDiscard("he", true, num);
            }
          }
        }
      }
    }
  },
  //贾诩
  rewansha: {
    audio: "wansha",
    audioname: ["re_jiaxu", "boss_lvbu3", "new_simayi"],
    audioname2: { shen_simayi: "jilue_wansha" },
    global: "rewansha_global",
    trigger: { global: "dyingBegin" },
    forced: true,
    logTarget: "player",
    filter(event, player) {
      return player == _status.currentPhase;
    },
    async content(event, trigger, player) {
      const targets = game.filterPlayer();
      for (const current of targets) {
        if (current != player && current != trigger.player) {
          current.addSkillBlocker("rewansha_fengyin");
        }
      }
      player.addTempSkill("rewansha_clear");
    },
    subSkill: {
      global: {
        mod: {
          cardEnabled(card, player) {
            var source = _status.currentPhase;
            if (card.name == "tao" && source && source != player && source.hasSkill("rewansha") && !player.isDying()) {
              return false;
            }
          },
          cardSavable(card, player) {
            var source = _status.currentPhase;
            if (card.name == "tao" && source && source != player && source.hasSkill("rewansha") && !player.isDying()) {
              return false;
            }
          }
        }
      },
      fengyin: {
        inherit: "fengyin"
      },
      clear: {
        trigger: { global: "dyingAfter" },
        forced: true,
        charlotte: true,
        popup: false,
        filter(event, player) {
          return !_status.dying.length;
        },
        async content(event, trigger, player) {
          player.removeSkill("rewansha_clear");
        },
        onremove() {
          game.countPlayer2(function(current) {
            current.removeSkillBlocker("rewansha_fengyin");
          });
        }
      }
    }
  },
  reluanwu: {
    audio: "luanwu",
    inherit: "luanwu",
    async contentAfter(event, trigger, player) {
      await player.chooseUseTarget("sha", "是否使用一张【杀】？", false, "nodistance");
    }
  },
  reweimu: {
    audio: 2,
    mod: {
      targetEnabled(card) {
        if (get.type2(card) == "trick" && get.color(card) == "black") {
          return false;
        }
      }
    },
    trigger: { player: "damageBegin4" },
    forced: true,
    filter(event, player) {
      return player == _status.currentPhase;
    },
    async content(event, trigger, player) {
      trigger.cancel();
      const num = trigger.num;
      await player.draw(2 * num);
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (target == _status.currentPhase && get.tag(card, "damage")) {
            return [0, 2, 0, 0];
          }
        }
      }
    },
    group: "reweimu_log",
    subSkill: {
      log: {
        audio: "reweimu",
        trigger: { global: "useCard1" },
        forced: true,
        firstDo: true,
        filter(event, player) {
          if (event.player == player) {
            return false;
          }
          if (get.color(event.card) != "black" || get.type(event.card) != "trick") {
            return false;
          }
          var info = lib.card[event.card.name];
          return info && info.selectTarget && info.selectTarget == -1 && !info.toself;
        },
        async content(_) {
        }
      }
    }
  },
  //顾雍
  reshenxing: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.countCards("he") >= Math.min(2, player.countMark("reshenxing_used"));
    },
    selectCard() {
      return Math.min(2, _status.event.player.countMark("reshenxing_used"));
    },
    prompt() {
      return "弃置" + get.cnNumber(Math.min(2, _status.event.player.countMark("reshenxing_used"))) + "张牌并摸一张牌";
    },
    check(card) {
      var num = _status.event.player.countCards("h", { color: get.color(card) });
      if (get.position(card) == "e") {
        num++;
      }
      return (Math.max(4, 7.1 - num) - get.value(card)) / num;
    },
    filterCard: lib.filter.cardDiscardable,
    position: "he",
    async content(event, trigger, player) {
      await player.draw();
      player.addTempSkill(event.name + "_used", "phaseUseAfter");
      player.addMark(event.name + "_used", 1, false);
    },
    ai: {
      order(item, player) {
        if (!player.hasMark("reshenxing_used")) {
          return 10;
        }
        return 1;
      },
      result: { player: 1 }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "已发动过#次"
        }
      }
    }
  },
  rebingyi: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    filterx(player) {
      var cards2 = player.getCards("h");
      if (cards2.length == 1) {
        return true;
      }
      var color = get.color(cards2[0], player);
      for (var i = 1; i < cards2.length; i++) {
        if (get.color(cards2[i], player) != color) {
          return false;
        }
      }
      return true;
    },
    filtery(player) {
      var cards2 = player.getCards("h");
      if (cards2.length == 1) {
        return true;
      }
      var color = get.number(cards2[0], player);
      for (var i = 1; i < cards2.length; i++) {
        if (get.number(cards2[i], player) != color) {
          return false;
        }
      }
      return true;
    },
    async cost(event, trigger, player) {
      const selfDraw = get.info(event.skill).filterx(player) && get.info(event.skill).filtery(player), asyncDraw = get.info(event.skill).filterx(player);
      if (asyncDraw) {
        const num = player.countCards("h");
        const result = await player.chooseTarget(get.prompt(event.skill), `展示所有手牌，并选择至多${get.cnNumber(num)}名角色各摸一张牌${selfDraw ? "，然后你摸一张牌" : ""}`, [0, num]).set("ai", function(target) {
          return get.attitude(get.player(), target);
        }).forResult();
        if (result.bool) {
          event.result = {
            bool: result.bool,
            cost_data: {
              asyncDraw,
              selfDraw,
              targets: result.targets
            }
          };
        }
      } else {
        event.result = await player.chooseBool(get.prompt(event.skill), `展示所有手牌${selfDraw ? "，然后你摸一张牌" : ""}`).set("choice", selfDraw).set("ai", () => get.event().choice).forResult();
        event.result.cost_data = { selfDraw };
      }
    },
    async content(event, trigger, player) {
      await player.showHandcards(get.translation(player) + "发动了【秉壹】");
      const data = event.cost_data;
      if (data.asyncDraw && data.targets && data.targets.length) {
        const targets = data.targets.sortBySeat();
        await game.asyncDraw(targets);
      }
      if (data.selfDraw) {
        player.draw();
      }
    }
  },
  //钟会
  xinquanji: {
    audio: 2,
    trigger: {
      player: ["damageEnd"],
      global: ["gainAfter", "loseAsyncAfter"]
    },
    getIndex(event, player, triggername) {
      return event.name == "damage" ? event.num : 1;
    },
    filter(event, player) {
      if (event.name == "damage") {
        return event.num > 0;
      }
      if (event.name == "loseAsync") {
        if (event.type != "gain" || event.giver) {
          return false;
        }
        return game.hasPlayer((current) => {
          if (current == player) {
            return false;
          }
          return event.getg?.(current).some((card) => event.getl?.(player)?.cards2?.includes(card));
        });
      }
      if (player == event.player) {
        return false;
      }
      if (event.giver || event.getParent().name == "gift") {
        return false;
      }
      return event.getl?.(player)?.cards2?.length;
    },
    frequent: true,
    async content(event, trigger, player) {
      await player.draw();
      const hs = player.getCards("h");
      if (!hs.length) {
        return;
      }
      const result = hs.length == 1 ? { bool: true, cards: hs } : await player.chooseCard("h", true, "选择一张手牌作为“权”").forResult();
      if (result?.bool && result?.cards?.length) {
        const next = player.addToExpansion(result.cards, player, "give");
        next.gaintag.add(event.name);
        await next;
      }
    },
    locked: false,
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    mod: {
      maxHandcard(player, num) {
        return num + player.getExpansions("xinquanji").length;
      }
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      notemp: true,
      threaten: 0.8,
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage") && !target.storage.xinzili) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return [1, -2];
            }
            if (!target.hasFriend()) {
              return;
            }
            if (target.hp >= 4) {
              return [0.5, get.tag(card, "damage") * 2];
            }
            if (!target.hasSkill("xinpaiyi") && target.hp > 1) {
              return [0.5, get.tag(card, "damage") * 1.5];
            }
            if (target.hp == 3) {
              return [0.5, get.tag(card, "damage") * 1.5];
            }
            if (target.hp == 2) {
              return [1, get.tag(card, "damage") * 0.5];
            }
          }
        }
      }
    }
  },
  xinzili: {
    derivation: "xinpaiyi",
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "thunder",
    filter(event, player) {
      return player.getExpansions("xinquanji").length > 2;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.recover();
      await player.draw(2);
      await player.loseMaxHp();
      await player.addSkills("xinpaiyi");
    },
    ai: {
      combo: "xinquanji"
    }
  },
  xinpaiyi: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      if (player.getStorage("xinpaiyi_used").length > 1) {
        return false;
      }
      return player.getExpansions("xinquanji").length > 0;
    },
    chooseButton: {
      check(button) {
        if (typeof button.link == "object") {
          return 1;
        }
        var player = _status.event.player, num = player.getExpansions("xinquanji").length - 1;
        if (button.link == 1) {
          if (game.countPlayer(function(current) {
            return get.damageEffect(current, player, player) > 0;
          }) < num) {
            return 0.5;
          }
          return 2;
        }
        if (num < 2) {
          return 0;
        }
        return 1;
      },
      dialog(event, player) {
        var dialog = ui.create.dialog("权计", "hidden");
        var table = document.createElement("div");
        table.classList.add("add-setting");
        table.style.margin = "0";
        table.style.width = "100%";
        table.style.position = "relative";
        var list = ["摸牌", "造成伤害"];
        dialog.add([
          list.map((item, i) => {
            return [i, item];
          }),
          "tdnodes"
        ]);
        dialog.add(player.getExpansions("xinquanji"));
        return dialog;
      },
      select: 2,
      filter(button, player) {
        if (typeof button.link == "number" && player.getStorage("xinpaiyi_used").includes(button.link)) {
          return false;
        }
        if (ui.selected.buttons.length) {
          return typeof ui.selected.buttons[0].link != typeof button.link;
        }
        return true;
      },
      backup(links) {
        if (typeof links[0] == "object") {
          links.reverse();
        }
        var next = get.copy(lib.skill["xinpaiyi_backup" + links[0]]);
        next.card = links[1];
        return next;
      },
      prompt(links, player) {
        if (typeof links[0] == "object") {
          links.reverse();
        }
        var num = get.cnNumber(Math.max(1, player.getExpansions("xinquanji").length - 1)), card = get.translation(links[1]);
        if (links[0] == 0) {
          return "移去" + card + "并令一名角色摸" + num + "张牌";
        }
        return "移去" + card + "并对至多" + num + "名角色造成1点伤害";
      }
    },
    ai: {
      order: 1,
      result: { player: 1 },
      combo: "xinquanji"
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      },
      backup0: {
        audio: "xinpaiyi",
        filterCard: () => false,
        selectCard: -1,
        filterTarget: true,
        delay: false,
        async content(event, trigger, player) {
          const target = event.target;
          player.addTempSkill("xinpaiyi_used", "phaseUseEnd");
          player.markAuto("xinpaiyi_used", [0]);
          var card = lib.skill.xinpaiyi_backup.card;
          await player.loseToDiscardpile(card);
          await target.draw(Math.max(1, player.getExpansions("xinquanji").length)).forResult();
        },
        ai: {
          result: {
            target(player, target) {
              if (target.hasSkill("nogain")) {
                return 0;
              }
              if (player == target && !player.needsToDiscard()) {
                return 3;
              }
              return 1;
            }
          }
        }
      },
      backup1: {
        audio: "xinpaiyi",
        filterCard: () => false,
        selectCard: -1,
        filterTarget: true,
        delay: false,
        multitarget: true,
        multiline: true,
        selectTarget() {
          return [1, Math.max(1, _status.event.player.getExpansions("xinquanji").length - 1)];
        },
        async content(event, trigger, player) {
          const targets = event.targets;
          targets.sortBySeat();
          player.addTempSkill("xinpaiyi_used", "phaseUseEnd");
          player.markAuto("xinpaiyi_used", [1]);
          var card = lib.skill.xinpaiyi_backup.card;
          player.loseToDiscardpile(card);
          for (var i of targets) {
            await i.damage().forResult();
          }
        },
        ai: {
          tag: {
            damage: 1
          },
          result: {
            target: -1.5
          }
        }
      }
    }
  },
  //界蔡夫人
  reqieting: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    direct: true,
    filter(event, player) {
      var target = event.player;
      if (player == target) {
        return false;
      }
      if (!target.getHistory("sourceDamage").length) {
        var cards2 = target.getCards("e");
        for (var i of cards2) {
          if (player.canEquip(i)) {
            return true;
          }
        }
      }
      return target.getHistory("useCard", function(evt) {
        return evt.targets && evt.targets.filter(function(i2) {
          return i2 != target;
        }).length > 0;
      }).length == 0;
    },
    frequent: true,
    async content(event, trigger, player) {
      const target = trigger.player;
      let logged = false;
      let result;
      var list = [];
      if (!target.getHistory("sourceDamage").length) {
        var cards2 = target.getCards("e");
        for (var i of cards2) {
          if (player.canEquip(i)) {
            list.push(i);
          }
        }
      }
      if (list.length) {
        result = await player.choosePlayerCard(target, "e", get.prompt("reqieting", target)).set("list", list).set("filterButton", function(button) {
          return _status.event.list.includes(button.link);
        }).set("ai", function(button) {
          var evt = _status.event, val = get.value(button.link);
          if (evt.target.hasSkillTag("noe")) {
            val -= 4;
          }
          if (evt.att > 0 == val > 0) {
            return 0;
          }
          return get.effect(evt.player, button.link, evt.player, evt.player);
        }).set("att", get.attitude(player, target)).forResult();
        if (result.bool) {
          player.logSkill("reqieting", target);
          logged = true;
          var card = result.links[0];
          target.$give(card, player, false);
          await game.delay(0.5);
          player.equip(card);
        }
      }
      if (target.getHistory("useCard", function(evt) {
        return evt.targets && evt.targets.filter(function(i2) {
          return i2 != target;
        }).length > 0;
      }).length != 0) {
        return;
      }
      result = await player.chooseBool("是否发动【窃听】摸一张牌？").set("frequentSkill", "reqieting").forResult();
      if (result.bool) {
        if (!logged) {
          player.logSkill("reqieting", target);
        }
        await player.draw().forResult();
      }
    }
  },
  rexianzhou: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "gray",
    filter(event, player) {
      return player.countCards("e") > 0;
    },
    filterCard: true,
    position: "e",
    selectCard: -1,
    filterTarget: lib.filter.notMe,
    discard: false,
    lose: false,
    delay: false,
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      player.awakenSkill(event.name);
      player.give(cards2, target);
      player.recover(cards2.length);
      const list = game.filterPlayer(function(current) {
        return target.inRange(current);
      });
      if (list.length) {
        const max = Math.min(list.length, cards2.length);
        const result = await target.chooseTarget(true, [1, max], "对至多" + get.cnNumber(max) + "名范围内的角色各造成1点伤害", function(card, player2, target2) {
          return _status.event.list.includes(target2);
        }).set("list", list).set("ai", function(target2) {
          var player2 = _status.event.player;
          return get.damageEffect(target2, player2, player2);
        }).forResult();
        if (result.bool) {
          const targets = result.targets.sortBySeat();
          player.line(targets, "green");
          for (const i of targets) {
            i.damage("nocard");
          }
        }
      } else {
        return;
      }
    },
    ai: {
      order: 1,
      result: {
        target: 1,
        player(player) {
          var bool = true, players = game.filterPlayer();
          for (var i = 0; i < players.length; i++) {
            if (players[i] != player && get.attitude(player, players[i]) > 2 && get.attitude(players[i], player) > 2) {
              bool = false;
              break;
            }
          }
          if (bool) {
            return -10;
          }
          if (player.hp == 1) {
            return 1;
          }
          if (game.phaseNumber < game.players.length) {
            return -10;
          }
          if (player.countCards("e") + player.hp <= player.maxHp) {
            return 1;
          }
          return -10;
        }
      }
    }
  },
  //界关平
  relongyin: {
    audio: 2,
    init: (player) => {
      game.addGlobalSkill("relongyin_order");
    },
    onremove: (player) => {
      if (!game.hasPlayer((current) => current.hasSkill("relongyin", null, null, false), true)) {
        game.removeGlobalSkill("relongyin_order");
      }
    },
    trigger: { global: "useCard" },
    direct: true,
    filter(event, player) {
      return event.card.name == "sha" && player.countCards("he") > 0 && event.player.isPhaseUsing();
    },
    async content(event, trigger, player) {
      let go = false;
      if (get.attitude(player, trigger.player) > 0) {
        if (get.color(trigger.card) == "red") {
          go = true;
        } else if (trigger.addCount === false || !trigger.player.isPhaseUsing()) {
          go = false;
        } else if (!trigger.player.hasSkill("paoxiao") && !trigger.player.hasSkill("tanlin3") && !trigger.player.hasSkill("zhaxiang2") && !trigger.player.hasSkill("fengnu") && !trigger.player.getEquip("zhuge")) {
          const nh = trigger.player.countCards("h");
          if (player == trigger.player) {
            go = player.countCards("h", "sha") > 0;
          } else if (nh >= 4) {
            go = true;
          } else if (player.countCards("h", "sha")) {
            if (nh == 3) {
              go = Math.random() < 0.8;
            } else if (nh == 2) {
              go = Math.random() < 0.5;
            }
          } else if (nh >= 3) {
            if (nh == 3) {
              go = Math.random() < 0.5;
            } else if (nh == 2) {
              go = Math.random() < 0.2;
            }
          }
        }
      }
      if (go && !event.isMine() && !event.isOnline() && player.hasCard(function(card) {
        return get.value(card) < 6 && lib.filter.cardDiscardable(card, player, event.name);
      }, "he")) {
        game.delayx();
      }
      const result = await player.chooseToDiscard(get.prompt("longyin"), "弃置一张牌" + (get.color(trigger.card) == "red" ? "并摸一张牌" : "") + "，令" + get.translation(trigger.player) + "本次使用的【杀】不计入使用次数", "he").set("logSkill", ["relongyin", trigger.player]).set("ai", function(card) {
        if (_status.event.go) {
          return 6 - get.value(card);
        }
        return 0;
      }).set("go", go).forResult();
      if (result.bool) {
        if (trigger.addCount !== false) {
          trigger.addCount = false;
          const stat = trigger.player.getStat().card, name = trigger.card.name;
          if (typeof stat[name] === "number") {
            stat[name]--;
          }
        }
        if (get.color(trigger.card) == "red") {
          player.draw();
        }
        if (get.number(result.cards[0], player) == get.number(trigger.card)) {
          player.restoreSkill("jiezhong");
        }
      }
    },
    ai: {
      expose: 0.2
    },
    subSkill: {
      order: {
        mod: {
          aiOrder: (player, card, num) => {
            if (num && card.name === "sha" && get.color(card) === "red") {
              let gp = game.findPlayer((current) => {
                return current.hasSkill("relongyin") && current.hasCard((i) => true, "he");
              });
              if (gp) {
                return num + 0.15 * Math.sign(get.attitude(player, gp));
              }
            }
          }
        },
        trigger: { player: "dieAfter" },
        filter: (event, player) => {
          return !game.hasPlayer((current) => current.hasSkill("relongyin", null, null, false), true);
        },
        silent: true,
        forceDie: true,
        charlotte: true,
        content: () => {
          game.removeGlobalSkill("relongyin_order");
        }
      }
    }
  },
  jiezhong: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    limited: true,
    skillAnimation: true,
    animationColor: "orange",
    filter(event, player) {
      return player.countCards("h") < player.maxHp;
    },
    async content(event, trigger, player) {
      const { name } = event;
      player.awakenSkill(name);
      await player.drawTo(player.maxHp);
    }
  },
  //新郭淮
  decadejingce: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    frequent: true,
    filter(event, player) {
      return player.getHistory("useCard").length >= player.hp;
    },
    async content(event, trigger, player) {
      const list = [], history = player.getHistory("useCard");
      for (const i of history) {
        let suit = get.suit(i.card);
        if (lib.suit.includes(suit)) {
          list.add(suit);
        }
        if (list.length >= player.hp) {
          break;
        }
      }
      let result;
      let goon = false;
      if (list.length >= player.hp) {
        goon = true;
      } else {
        result = await player.chooseControl("摸牌阶段", "出牌阶段").set("prompt", "精策：选择要执行的额外阶段").forResult();
      }
      const evt = trigger.getParent("phase", true, true);
      if (goon || result && result.index == 1) {
        if (evt?.phaseList) {
          evt.phaseList.splice(evt.num + 1, 0, `phaseUse|${event.name}`);
        }
      }
      if (goon || result && result.index == 0) {
        if (evt?.phaseList) {
          evt.phaseList.splice(evt.num + 1, 0, `phaseDraw|${event.name}`);
        }
      }
    }
  },
  //新于禁
  decadezhenjun: {
    audio: 2,
    trigger: {
      player: ["phaseZhunbeiBegin", "phaseJieshuBegin"]
    },
    filter(event, player) {
      return game.hasPlayer(function(current) {
        return current.countDiscardableCards(player, "he") > 0;
      });
    },
    direct: true,
    async content(event, trigger, player) {
      const chooseResult = await player.chooseTarget(get.prompt2("decadezhenjun"), function(card, player2, target2) {
        return target2.countDiscardableCards(player2, "he") > 0;
      }).set("ai", function(target2) {
        const player2 = get.player();
        return -get.attitude(player2, target2) * (target2.countDiscardableCards(player2, "e") + 1);
      }).forResult();
      if (!chooseResult.bool) return;
      const target = chooseResult.targets[0];
      const num = Math.min(Math.max(target.countCards("h") - target.hp, 1), target.countDiscardableCards(player, "he"));
      player.logSkill("decadezhenjun", target);
      const discardResult = await player.discardPlayerCard(num, target, true, "allowChooseAll").forResult();
      if (discardResult.cards && discardResult.cards.length) {
        for (let i = 0; i < discardResult.cards.length; i++) {
          if (get.type(discardResult.cards[i]) == "equip") {
            return;
          }
        }
        const cardNum = discardResult.cards.length;
        if (cardNum > 0) {
          const prompt = "弃置一张牌，或令" + get.translation(target) + "摸" + get.cnNumber(cardNum) + "张牌";
          const result = await player.chooseToDiscard(prompt, "he").set("ai", function(card) {
            return 7 - get.value(card);
          }).forResult();
          if (!result.bool) {
            target.draw(cardNum);
          }
        }
      }
    }
  },
  //界姜维
  oltiaoxin: {
    audio: "tiaoxin",
    audioname: ["sp_jiangwei", "xiahouba", "re_jiangwei", "gz_jiangwei", "ol_jiangwei"],
    enable: "phaseUse",
    usable(skill, player) {
      return 1 + (player.hasSkill(skill + "_rewrite", null, null, false) ? 1 : 0);
    },
    filter(event, player) {
      return game.hasPlayer((target) => lib.skill.oltiaoxin.filterTarget(null, player, target));
    },
    filterTarget(card, player, target) {
      return target != player && target.inRange(player) && target.countCards("he") > 0;
    },
    async content(event, trigger, player) {
      const { target } = event;
      const result = await target.chooseToUse(
        function(card, player2, event2) {
          if (get.name(card) != "sha") {
            return false;
          }
          return lib.filter.filterCard.apply(this, arguments);
        },
        "挑衅：对" + get.translation(player) + "使用一张杀，或令其弃置你的一张牌"
      ).set("targetRequired", true).set("complexSelect", true).set("complexTarget", true).set("filterTarget", function(card, player2, target2) {
        if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
          return false;
        }
        return lib.filter.filterTarget.apply(this, arguments);
      }).set("sourcex", player).forResult();
      if (!result.bool || !player.hasHistory("damage", (evt) => {
        return evt.getParent().type == "card" && evt.getParent(4) == event;
      })) {
        if (target.countDiscardableCards(player, "he") > 0) {
          await player.discardPlayerCard(target, "he", true).set("boolline", true);
        }
        player.addTempSkill(event.name + "_rewrite", "phaseUseEnd");
      }
    },
    ai: {
      order: 4,
      expose: 0.2,
      result: {
        target: -1,
        player(player, target) {
          if (target.countCards("h") == 0) {
            return 0;
          }
          if (target.countCards("h") == 1) {
            return -0.1;
          }
          if (player.hp <= 2) {
            return -2;
          }
          if (player.countCards("h", "shan") == 0) {
            return -1;
          }
          return -0.5;
        }
      },
      threaten: 1.1
    },
    subSkill: { rewrite: { charlotte: true } }
  },
  olzhiji: {
    skillAnimation: true,
    animationColor: "fire",
    audio: 2,
    juexingji: true,
    //priority:-10,
    derivation: "reguanxing",
    trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
    forced: true,
    filter(event, player) {
      return player.countCards("h") == 0;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      player.chooseDrawRecover(2, true);
      player.loseMaxHp();
      player.addSkills("reguanxing");
    }
  },
  //界郭图逢纪
  rejigong: {
    audio: 2,
    direct: true,
    trigger: { player: "phaseUseBegin" },
    async content(event, trigger, player) {
      const result = await player.chooseControl("一张", "两张", "三张", "cancel2").set("prompt", get.prompt2("rejigong")).set("ai", () => "三张").forResult();
      if (result.control != "cancel2") {
        player.logSkill("rejigong");
        player.addTempSkill("rejigong2");
        player.draw(1 + result.index);
      }
    }
  },
  rejigong2: {
    audio: "rejigong",
    mod: {
      maxHandcardBase(player) {
        if (game.online) {
          return player.getStat("damage") || 0;
        }
        var num = 0;
        player.getHistory("sourceDamage", function(evt) {
          num += evt.num;
        });
        return num;
      }
    },
    trigger: { player: "phaseUseEnd" },
    forced: true,
    charlotte: true,
    sourceSkill: "rejigong",
    filter(event, player) {
      if (player.isHealthy()) {
        return false;
      }
      var num = 0;
      player.getHistory("sourceDamage", function(evt) {
        num += evt.num;
      });
      if (!num) {
        return false;
      }
      var num2 = 0;
      player.getHistory("gain", function(evt) {
        var evtx = evt.getParent(2);
        if (evtx.name == "rejigong" && evtx.player == player) {
          num2 += evt.cards.length;
        }
      });
      return num >= num2;
    },
    async content(event, trigger, player) {
      await player.recover();
    }
  },
  reshizhi: {
    audio: 2,
    mod: {
      cardname(card, player) {
        if (card.name == "shan" && player.hp == 1) {
          return "sha";
        }
      }
    },
    trigger: { source: "damageEnd" },
    forced: true,
    filter(event, player) {
      return event.card && event.card.name == "sha" && player.hp == 1 && event.cards && event.cards.length == 1 && event.cards[0].name == "shan";
    },
    async content(event, trigger, player) {
      await player.recover();
    },
    ai: {
      halfneg: true
    }
  },
  //界陈群
  redingpin: {
    audio: 2,
    enable: "phaseUse",
    onChooseToUse(event) {
      if (event.type != "phase" || game.online) {
        return;
      }
      var list = [], player = event.player;
      player.getHistory("useCard", function(evt) {
        list.add(get.type2(evt.card));
      });
      player.getHistory("lose", function(evt) {
        if (evt.type != "discard" || evt.getParent(2).redingpin_ignore) {
          return;
        }
        for (var i of evt.cards2) {
          list.add(get.type2(i, evt.hs.includes(i) ? player : false));
        }
      });
      event.set("redingpin_types", list);
    },
    filter(event, player) {
      var list = event.redingpin_types || [];
      return player.countCards("he", function(card) {
        return !list.includes(get.type2(card));
      }) > 0;
    },
    filterCard(card) {
      var list = _status.event.redingpin_types || [];
      return !list.includes(get.type2(card));
    },
    position: "he",
    filterTarget(card, player, target) {
      return !target.hasSkill("redingpin2");
    },
    async content(event, trigger, player) {
      const { target } = event;
      const judgeResult = await target.judge(function(card) {
        var evt = _status.event.getParent("redingpin"), suit = get.suit(card);
        switch (suit) {
          case "club":
          case "spade":
            return evt.target.hp;
          case "diamond":
            return get.sgn(get.attitude(evt.target, evt.player)) * -3;
        }
        return 0;
      }).forResult();
      judgeResult.judge2 = function(result) {
        if (result.color == "black") {
          return true;
        }
        return false;
      };
      switch (judgeResult.suit) {
        case "spade":
        case "club":
          if (target.hp > 0) {
            target.draw(Math.min(3, target.hp));
          }
          target.addTempSkill("redingpin2");
          break;
        case "heart":
          event.getParent().redingpin_ignore = true;
          break;
        case "diamond":
          player.turnOver();
          break;
      }
    },
    ai: {
      order: 9,
      result: {
        target(player, target) {
          if (player.isTurnedOver()) {
            return target.hp;
          }
          var card = ui.cardPile.firstChild;
          if (!card) {
            return;
          }
          if (get.color(card) == "black") {
            return target.hp;
          }
          return 0;
        }
      }
    }
  },
  redingpin2: { charlotte: true },
  refaen: {
    audio: 2,
    audioname: ["dc_chenqun"],
    trigger: { global: ["turnOverAfter", "linkAfter"] },
    logTarget: "player",
    filter(event, player) {
      if (event.name == "link") {
        return event.player.isLinked();
      }
      return true;
    },
    check(event, player) {
      return get.attitude(player, event.player) > 0;
    },
    async content(event, trigger, player) {
      await trigger.player.draw();
    },
    global: "faen_global"
  },
  dcfaen: {
    audio: "refaen",
    audioname: ["dc_chenqun"],
    trigger: { global: ["turnOverAfter", "linkAfter"] },
    logTarget: "player",
    filter(event, player) {
      if (event.name == "link") {
        return event.player.isLinked();
      }
      return !event.player.isTurnedOver();
    },
    check(event, player) {
      return get.attitude(player, event.player) > 0;
    },
    async content(event, trigger, player) {
      await trigger.player.draw();
    },
    global: "faen_global"
  },
  //界曹彰
  xinjiangchi: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    direct: true,
    async content(event, trigger, player) {
      const list = ["摸一张牌", "摸两张牌，本回合内不能使用或打出【杀】"];
      if (player.countCards("he", function(card) {
        return lib.filter.cardDiscardable(card, player, "xinjiangchi") > 0;
      }) > 0) {
        list.push("弃置一张牌，本回合可以多使用一张【杀】且无距离限制");
      }
      const result = await player.chooseControl("cancel2").set("prompt", get.prompt("xinjiangchi")).set("choiceList", list).set("ai", function() {
        var player2 = _status.event.player;
        if (!player2.countCards("hs", function(card) {
          return get.name(card) == "sha" && player2.hasValueTarget(card, false);
        })) {
          return 1;
        }
        return 0;
      }).forResult();
      if (result.control != "cancel2") {
        player.logSkill("xinjiangchi");
        switch (result.index) {
          case 0: {
            player.draw();
            break;
          }
          case 1: {
            await player.draw(2);
            player.addTempSkill("xinjiangchi_less");
            break;
          }
          case 2: {
            await player.chooseToDiscard("he", true);
            player.addTempSkill("xinjiangchi_more");
            break;
          }
        }
      }
    },
    subSkill: {
      less: {
        mod: {
          cardEnabled(card) {
            if (card.name == "sha") {
              return false;
            }
          },
          cardRespondable(card) {
            if (card.name == "sha") {
              return false;
            }
          }
        },
        charlotte: true
      },
      more: {
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + 1;
            }
          },
          targetInRange(card) {
            if (card.name == "sha") {
              return true;
            }
          }
        },
        charlotte: true
      }
    }
  },
  //界周仓和程普
  ollihuo: {
    mod: {
      aiOrder(player, card, num) {
        if (card.name == "sha" && !player.getHistory("useCard").length) {
          return num + 7;
        }
      }
    },
    trigger: { player: "useCard1" },
    filter(event, player) {
      if (event.card.name == "sha" && !game.hasNature(event.card)) {
        return true;
      }
      return false;
    },
    audio: "lihuo",
    locked: false,
    prompt2(event) {
      return "将" + get.translation(event.card) + "改为火属性";
    },
    audioname: ["re_chengpu"],
    check(event, player) {
      return (event.baseDamage > 1 || player.getHistory("useCard").indexOf(event) == 0) && (player.hp > 1 || player.getExpansions("rechunlao").length) && game.hasPlayer(function(current) {
        return !event.targets.includes(current) && player.canUse(event.card, current) && get.attitude(player, current) < 0 && !current.hasShan() && get.effect(current, { name: "sha", nature: "fire" }, player, player) > 0;
      });
    },
    async content(event, trigger, player) {
      game.setNature(trigger.card, "fire");
      trigger.lihuo_changed = true;
    },
    group: ["ollihuo2", "ollihuo3", "ollihuo4"],
    ai: {
      fireAttack: true
    }
  },
  ollihuo2: {
    trigger: { player: "useCard2" },
    sourceSkill: "ollihuo",
    filter(event, player) {
      if (event.card.name != "sha" || !game.hasNature(event.card, "fire")) {
        return false;
      }
      return game.hasPlayer(function(current) {
        return !event.targets.includes(current) && lib.filter.targetEnabled(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
      });
    },
    direct: true,
    async content(event, trigger, player) {
      const targetResult = await player.chooseTarget(get.prompt("ollihuo"), "为" + get.translation(trigger.card) + "增加一个目标", function(card, player2, target2) {
        return !_status.event.sourcex.includes(target2) && lib.filter.targetInRange(_status.event.card, player2, target2) && lib.filter.targetEnabled(_status.event.card, player2, target2);
      }).set("sourcex", trigger.targets).set("card", trigger.card).set("ai", function(target2) {
        var player2 = _status.event.player;
        return get.effect(target2, _status.event.card, player2, player2);
      }).forResult();
      if (!targetResult.bool) {
        return;
      }
      if (!event.isMine() && !_status.connectMode) {
        game.delayx();
      }
      const target = targetResult.targets[0];
      player.logSkill("ollihuo", target);
      trigger.targets.push(target);
    }
  },
  ollihuo3: {
    trigger: { player: "useCardEnd" },
    sourceSkill: "ollihuo",
    filter(event, player) {
      return event.lihuo_changed == true && player.getHistory("sourceDamage", function(evt) {
        return evt.card == event.card;
      }).length > 0;
    },
    forced: true,
    audio: "lihuo",
    audioname: ["re_chengpu"],
    async content(event, trigger, player) {
      await player.loseHp();
    }
  },
  ollihuo4: {
    trigger: { player: "useCardAfter" },
    frequent: true,
    audio: "lihuo",
    audioname: ["re_chengpu"],
    sourceSkill: "ollihuo",
    filter(event, player) {
      return event.card.name == "sha" && player.getHistory("useCard").indexOf(event) == 0 && event.cards.filterInD().length > 0;
    },
    async content(event, trigger, player) {
      const cards2 = trigger.cards.filterInD();
      const next = player.addToExpansion(cards2, "gain2");
      next.gaintag.add("rechunlao");
      await next;
    }
  },
  rezhongyong: {
    trigger: { player: "useCardAfter" },
    audio: 2,
    direct: true,
    filter(event, player) {
      return event.card.name == "sha";
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      const usedCards = trigger.cards.filterInD();
      let allCards = usedCards.slice();
      game.countPlayer2(function(current) {
        current.getHistory("useCard", function(evt) {
          if (evt.card.name == "shan" && evt.getParent(3) == trigger) {
            allCards.addArray(evt.cards.filterInD("od"));
          }
        });
      });
      if (!allCards.length) {
        return;
      }
      const targetResult = await player.chooseTarget(get.prompt2("rezhongyong"), "令一名其他角色获得" + get.translation(allCards), function(card, player2, target) {
        return !_status.event.source.includes(target) && target != player2;
      }).set("ai", function(target) {
        return get.attitude(_status.event.player, target);
      }).set("source", trigger.targets).forResult();
      if (targetResult.bool) {
        const target = targetResult.targets[0];
        player.logSkill("rezhongyong", target);
        target.gain(allCards, "gain2");
        let red = false, black = false;
        for (const i of allCards) {
          const color = get.color(i, false);
          if (color == "red") {
            red = true;
          }
          if (color == "black") {
            black = true;
          }
          if (red && black) {
            break;
          }
        }
        if (red) {
          target.chooseToUse("是否使用一张杀？", { name: "sha" }).set("filterTarget", function(card, player2, target2) {
            return target2 != _status.event.sourcex && _status.event.sourcex.inRange(target2) && lib.filter.targetEnabled.apply(this, arguments);
          }).set("sourcex", player).set("addCount", false);
        }
        if (black) {
          target.draw();
        }
      }
    }
  },
  //长标
  changbiao: {
    audio: 2,
    mod: {
      targetInRange(card, player, target) {
        if (card.changbiao) {
          return true;
        }
      }
    },
    enable: "phaseUse",
    usable: 1,
    viewAs: {
      name: "sha",
      changbiao: true
    },
    locked: false,
    filter(event, player) {
      return player.countCards("hs") > 0;
    },
    filterCard: true,
    selectCard: [1, Infinity],
    allowChooseAll: true,
    position: "hs",
    check(card) {
      let player = _status.event.player;
      if (ui.selected.cards.length) {
        let list = game.filterPlayer(function(current) {
          return current !== player && player.canUse("sha", current, false) && get.effect(current, { name: "sha" }, player, player) > 0;
        }).sort(function(a, b) {
          return get.effect(b, { name: "sha" }, player, player) - get.effect(a, { name: "sha" }, player, player);
        });
        if (!list.length) {
          return 0;
        }
        let target = list[0], cards2 = ui.selected.cards.concat([card]), color = [];
        for (let i of cards2) {
          if (!color.includes(get.color(i, player))) {
            color.add(get.color(i, player));
          }
        }
        if (color.length !== 1) {
          color[0] = "none";
        }
        if (player.hasSkillTag(
          "directHit_ai",
          true,
          {
            target,
            card: {
              name: "sha",
              suit: "none",
              color: color[0],
              cards: cards2,
              isCard: true
            }
          },
          true
        )) {
          return 6.5 - get.value(card, player);
        }
        if (Math.random() * target.countCards("hs") < 1 || player.needsToDiscard(0, (i, player2) => {
          return !ui.selected.cards.includes(i) && !player2.canIgnoreHandcard(i);
        })) {
          return 6 - get.value(card, player);
        }
        return 0;
      }
      return 6.3 - get.value(card);
    },
    onuse(result, player) {
      player.addTempSkill("changbiao_draw");
    },
    subSkill: {
      draw: {
        audio: "changbiao",
        trigger: { player: "phaseUseEnd" },
        forced: true,
        charlotte: true,
        filter(event, player) {
          return player.hasHistory("sourceDamage", function(evxt) {
            var evt = evxt.getParent();
            return evt && evt.name == "sha" && evt.skill == "changbiao" && evt.getParent("phaseUse") == event;
          });
        },
        async content(event, trigger, player) {
          const cards2 = [];
          for (const evxt of player.getHistory("sourceDamage")) {
            const evt = evxt.getParent();
            if (evt && evt.name === "sha" && evt.skill === "changbiao" && evt.getParent("phaseUse") === trigger) {
              cards2.addArray(evt.cards);
            }
          }
          if (cards2.length) {
            await player.draw(cards2.length);
          }
        }
      }
    },
    ai: {
      order(item, player) {
        return get.order({ name: "sha" }, player) + 0.3 * (Math.min(
          player.getCardUsable("sha"),
          player.countCards("hs", "sha") + player.hasCard(function(card) {
            return card.name != "sha" && get.value(card, player) < 6.3;
          }, "hs") ? 1 : 0
        ) > 1 ? -1 : 1);
      },
      nokeep: true,
      skillTagFilter(player, tag, arg) {
        if (tag === "nokeep") {
          let num = 0;
          if (arg && (!arg.card || get.name(arg.card) !== "tao")) {
            return false;
          }
          player.getHistory("sourceDamage", function(evxt) {
            let evt = evxt.getParent();
            if (evt && evt.name == "sha" && evt.skill == "changbiao") {
              num += evt.cards.length;
            }
          });
          return player.needsToDiscard(num) > 0;
        }
      }
    }
  },
  //国钟会
  gzquanji: {
    audio: 2,
    trigger: {
      player: "damageEnd",
      source: "damageSource"
    },
    frequent: true,
    preHidden: true,
    filter(event, player, name) {
      if (player.getStorage("gzquanji_used").includes(name)) {
        return false;
      }
      return true;
    },
    async content(event, trigger, player) {
      player.addTempSkill("gzquanji_used");
      player.markAuto("gzquanji_used", event.triggername);
      player.draw();
      const hs = player.getCards("he");
      if (hs.length > 0) {
        let result;
        if (hs.length == 1) {
          result = { bool: true, cards: hs };
        } else {
          result = await player.chooseCard("he", true, "选择一张牌作为“权”").forResult();
        }
        if (result.bool) {
          const cs = result.cards;
          player.addToExpansion(cs, player, "give").gaintag.add("gzquanji");
        }
      }
    },
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill) {
      var cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    locked: false,
    mod: {
      maxHandcard(player, num) {
        return num + player.getExpansions("gzquanji").length;
      }
    },
    ai: {
      notemp: true
    },
    subSkill: {
      used: {
        onremove: true,
        charlotte: true
      }
    }
  },
  gzpaiyi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.getExpansions("gzquanji").length > 0;
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("排异", player.getExpansions("gzquanji"), "hidden");
      },
      backup(links, player) {
        return {
          audio: "gzpaiyi",
          filterTarget: true,
          filterCard() {
            return false;
          },
          selectCard: -1,
          card: links[0],
          delay: false,
          content: lib.skill.gzpaiyi.contentx,
          ai: {
            order: 10,
            result: {
              target(player2, target) {
                if (target != player2) {
                  return 0;
                }
                if (player2.getExpansions("gzquanji").length <= 1 || player2.needsToDiscard() && !player2.getEquip("zhuge") && !player2.hasSkill("new_paoxiao")) {
                  return 0;
                }
                return 1;
              }
            }
          }
        };
      },
      prompt() {
        return "请选择【排异】的目标";
      }
    },
    async contentx(event, trigger, player) {
      const { target } = event;
      const card = lib.skill.gzpaiyi_backup.card;
      await player.loseToDiscardpile(card);
      const num = player.getExpansions("gzquanji").length;
      if (num > 0) {
        await target.draw(Math.min(7, num));
      }
      if (target.countCards("h") > player.countCards("h")) {
        await target.damage();
      }
    },
    ai: {
      order(item, player) {
        var num = player.getExpansions("gzquanji").length;
        if (num == 1) {
          return 8;
        }
        return 1;
      },
      result: {
        player: 1
      },
      combo: "gzquanji"
    }
  },
  gzquanji2: { charlotte: true },
  xingongji: {
    enable: "phaseUse",
    usable: 1,
    audio: 2,
    position: "he",
    filterCard: true,
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    check(card) {
      var base = 0, player = _status.event.player, suit = get.suit(card, player), added = false, added2 = false, added3;
      if (get.type(card) == "equip" && game.hasPlayer(function(target) {
        var att = get.attitude(player, target);
        if (att >= 0) {
          return 0;
        }
        if (target.countCards("he", function(card2) {
          return get.value(card2) > 5;
        })) {
          return -att;
        }
      })) {
        base += 6;
      }
      var hs = player.getCards("h");
      var muniu = player.getEquip("muniu");
      if (muniu && card != muniu && muniu.cards) {
        hs = hs.concat(muniu.cards);
      }
      for (var i of hs) {
        if (i != card && get.name(i) == "sha") {
          if (get.suit(i, player) == suit) {
            if (player.hasValueTarget(i, false)) {
              added3 = true;
              base += 5.5;
            }
          } else {
            if (player.hasValueTarget(i, false)) {
              added2 = true;
            }
            if (!added && !player.hasValueTarget(i, null, true) && player.hasValueTarget(i, false, true)) {
              base += 4;
              added = true;
            }
          }
        }
      }
      if (added3 && !added2) {
        base -= 4.5;
      }
      return base - get.value(card);
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      if (!player.storage.xingongji2) {
        player.storage.xingongji2 = [];
      }
      player.storage.xingongji2.add(get.suit(cards2[0], player));
      player.addTempSkill("xingongji2");
      if (get.type(cards2[0], null, cards2[0].original == "h" ? player : false) == "equip") {
        const targetResult = await player.chooseTarget("是否弃置一名角色的一张牌？", function(card, player2, target) {
          return player2 != target && target.countCards("he") > 0;
        }).set("ai", function(target) {
          var att = get.attitude(player, target);
          if (att >= 0) {
            return 0;
          }
          if (target.countCards("he", function(card) {
            return get.value(card) > 5;
          })) {
            return -att;
          }
          return -att * 0.8;
        }).forResult();
        if (targetResult.bool) {
          player.line(targetResult.targets, "green");
          player.discardPlayerCard(targetResult.targets[0], "he", true);
        }
      }
    },
    ai: {
      order: 4.5,
      result: {
        player: 1
      }
    }
  },
  xingongji2: {
    charlotte: true,
    onremove: true,
    mod: {
      attackRangeBase() {
        return Infinity;
      },
      cardUsable(card, player) {
        if (card.name == "sha") {
          const suit = get.suit(card);
          if (suit === "unsure" || player.storage.xingongji2.includes(suit)) {
            return Infinity;
          }
        }
      },
      aiOrder(player, card, num) {
        if (get.name(card) == "sha" && !player.storage.xingongji2.includes(get.suit(card))) {
          return num + 1;
        }
      }
    },
    mark: true,
    intro: {
      content: "使用$花色的杀无次数限制"
    }
  },
  xinjiefan: {
    skillAnimation: true,
    animationColor: "wood",
    audio: 2,
    limited: true,
    enable: "phaseUse",
    filterTarget: true,
    async content(event, trigger, player) {
      const { target } = event;
      let result;
      player.awakenSkill(event.name);
      event.players = game.filterPlayer(function(current) {
        return current != target && current.inRange(target);
      });
      event.players.sortBySeat();
      while (event.players.length) {
        event.current = event.players.shift();
        event.current.addTempClass("target");
        player.line(event.current, "green");
        if (event.current.countCards("he") && target.isIn()) {
          result = await event.current.chooseToDiscard({ subtype: "equip1" }, "he", "弃置一张武器牌或让" + get.translation(target) + "摸一张牌").set("ai", function(card) {
            if (get.attitude(_status.event.player, _status.event.target) < 0) {
              return 7 - get.value(card);
            }
            return -1;
          }).set("target", target).forResult();
          event.tempbool = false;
        } else {
          event.tempbool = true;
        }
        if (event.tempbool || result.bool == false) {
          await target.draw();
        }
      }
      if (game.roundNumber <= 1) {
        player.addTempSkill("xinjiefan2");
      }
    },
    ai: {
      order: 5,
      result: {
        target(player, target) {
          if (player.hp > 2 && game.roundNumber > 1) {
            if (game.phaseNumber < game.players.length * 2) {
              return 0;
            }
          }
          var num = 0, players = game.filterPlayer();
          for (var i = 0; i < players.length; i++) {
            if (players[i] != target && players[i].inRange(target)) {
              num++;
            }
          }
          return num;
        }
      }
    }
  },
  xinjiefan2: {
    trigger: { player: "phaseEnd" },
    forced: true,
    popup: false,
    sourceSkill: "xinjiefan",
    async content(event, trigger, player) {
      player.restoreSkill("xinjiefan");
    }
  },
  residi: {
    trigger: { player: "phaseJieshuBegin" },
    direct: true,
    audio: 2,
    filter(event, player) {
      return player.countCards("he", function(card) {
        if (_status.connectMode) {
          return true;
        }
        return get.type(card) != "basic";
      }) > 0;
    },
    async content(event, trigger, player) {
      let result;
      result = await player.chooseCard("he", get.prompt("residi"), "将一张非基本牌置于武将牌上作为“司”", function(card, player2) {
        return get.type(card) != "basic";
      }).set("ai", function(card) {
        if (get.position(card) == "e") {
          return 5 + player.hp - get.value(card);
        }
        return 7 - get.value(card);
      }).forResult();
      if (result.bool) {
        player.logSkill("residi");
        player.addToExpansion(result.cards, "give", player).gaintag.add("residi");
      }
    },
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill) {
      var cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    group: "residi_push",
    ai: {
      notemp: true
    }
  },
  residi_push: {
    trigger: { global: "phaseUseBegin" },
    direct: true,
    sourceSkill: "residi",
    filter(event, player) {
      return event.player != player && player.getExpansions("residi").length > 0;
    },
    async content(event, trigger, player) {
      let result;
      result = await player.chooseButton([get.prompt("residi", trigger.player), player.getExpansions("residi")]).set("ai", function(button) {
        var player2 = _status.event.player;
        var target2 = _status.event.getTrigger().player;
        if (get.attitude(player2, target2) > -1) {
          return 0;
        }
        button.link;
        var color2 = get.color(button.link, false);
        var eff = target2.countCards("h", function(card2) {
          return get.color(card2, target2) == color2 && target2.hasValueTarget(card2);
        });
        if (!target2.countCards("h", function(card2) {
          return get.color(card2, target2) == color2 && get.name(card2, target2) == "sha" && target2.hasValueTarget(card2);
        })) {
          eff += 1.5;
        }
        if (!target2.countCards("h", function(card2) {
          return get.color(card2, target2) == color2 && get.type2(card2, target2) == "trick" && target2.hasValueTarget(card2);
        })) {
          eff += 1.5;
        }
        return eff - 1;
      }).forResult();
      if (result.bool) {
        if (!trigger.residi) {
          trigger.residi = [];
        }
        trigger.residi.push(player);
        var card = result.links[0];
        var target = trigger.player;
        player.logSkill("residi", target);
        player.loseToDiscardpile(card);
        var color = get.color(card, false);
        if (!target.storage.residi2) {
          target.storage.residi2 = [];
        }
        target.storage.residi2.add(color);
        target.addTempSkill("residi2", "phaseUseAfter");
        target.markSkill("residi2");
        player.addTempSkill("residi3", "phaseUseAfter");
      }
    }
  },
  residi2: {
    onremove: true,
    mod: {
      cardEnabled(card, player) {
        if (player.getStorage("residi2").includes(get.color(card, player))) {
          return false;
        }
      },
      cardRespondable(card, player) {
        if (player.getStorage("residi2").includes(get.color(card, player))) {
          return false;
        }
      },
      cardSavable(card, player) {
        if (player.getStorage("residi2").includes(get.color(card, player))) {
          return false;
        }
      }
    },
    intro: {
      content: "不能使用或打出$牌"
    },
    marktext: "敌"
  },
  residi3: {
    audio: "residi",
    trigger: { global: "phaseUseEnd" },
    forced: true,
    sourceSkill: "residi",
    filter(event, player) {
      if (!event.residi || !event.residi.includes(player)) {
        return false;
      }
      var sha = player.canUse("sha", event.player, false), trick = true;
      event.player.getHistory("useCard", function(evt) {
        if (evt.getParent("phaseUse") != event) {
          return false;
        }
        if (sha && evt.card.name == "sha") {
          sha = false;
        }
        if (trick && get.type2(evt.card, false) == "trick") {
          trick = false;
        }
      });
      return sha || trick;
    },
    async content(event, trigger, player) {
      const canUseSha = player.canUse("sha", trigger.player, false);
      let sha = canUseSha;
      let trick = true;
      trigger.player.getHistory("useCard", (evt) => {
        if (evt.getParent("phaseUse") != trigger) {
          return false;
        }
        if (sha && evt.card.name == "sha") {
          sha = false;
        }
        if (trick && get.type2(evt.card, false) == "trick") {
          trick = false;
        }
        return false;
      });
      if (sha) {
        await player.useCard({ name: "sha", isCard: true }, trigger.player).forResult();
      }
      if (trick) {
        await player.draw(2).forResult();
      }
    }
  },
  rehuaiyi: {
    audio: 2,
    enable: "phaseUse",
    usable(skill, player) {
      return 1 + (player.hasSkill(skill + "_rewrite", null, null, false) ? 1 : 0);
    },
    delay: false,
    filter(event, player) {
      return player.countCards("h");
    },
    async content(event, trigger, player) {
      await player.showHandcards();
      const hs = player.getCards("h"), color = get.color(hs[0], player);
      if (hs.length === 1 || !hs.some((card, index) => {
        return index > 0 && get.color(card) !== color;
      })) {
        await player.draw();
        player.addTempSkill(event.name + "_rewrite", "phaseUseEnd");
      } else {
        const list = [], bannedList = [], indexs = Object.keys(lib.color);
        player.getCards("h").forEach((card) => {
          const color2 = get.color(card, player);
          list.add(color2);
          if (!lib.filter.cardDiscardable(card, player, "rehuaiyi")) {
            bannedList.add(color2);
          }
        });
        list.removeArray(bannedList);
        list.sort((a, b) => indexs.indexOf(a) - indexs.indexOf(b));
        let result;
        if (!list.length) {
          return;
        } else if (list.length === 1) {
          result = { control: list[0] };
        } else {
          result = await player.chooseControl(list.map((i) => `${i}2`)).set("ai", () => {
            const player2 = get.player();
            if (player2.countCards("h", { color: "red" }) == 1 && player2.countCards("h", { color: "black" }) > 1) {
              return 1;
            }
            return 0;
          }).set("prompt", "请选择弃置一种颜色的所有手牌").forResult();
        }
        const control = result.control.slice(0, -1);
        const cards2 = player.getCards("h", { color: control }), num = cards2.length;
        await player.discard(cards2);
        const { targets } = await player.chooseTarget(`请选择至多${get.cnNumber(num)}名有牌的其他角色，获得这些角色的各一张牌。`, [1, num], (card, player2, target) => {
          return target != player2 && target.countGainableCards(player2, "he");
        }).set("ai", (target) => {
          return -get.attitude(get.player(), target) + 0.5;
        }).forResult();
        if (!targets || !targets.length) {
          return;
        }
        player.line(targets, "green");
        for (const target of targets.sortBySeat()) {
          if (target.isIn() && target.countGainableCards(player, "he")) {
            await player.gainPlayerCard(target, "he", true);
          }
        }
        if (player.getHistory("gain", (evt) => evt.getParent(2) == event).reduce((sum, evt) => sum + evt.cards.length, 0) > 1) {
          await player.loseHp();
        }
      }
    },
    ai: {
      order(item, player) {
        if (player.countCards("h", { color: "red" }) == 0) {
          return 10;
        }
        if (player.countCards("h", { color: "black" }) == 0) {
          return 10;
        }
        return 1;
      },
      result: {
        player: 1
      }
    },
    subSkill: { rewrite: { charlotte: true } }
  },
  rezhuikong: {
    audio: 2,
    audioname: ["ol_fuhuanghou"],
    audioname2: { tw_fuhuanghou: "xinzhuikong" },
    trigger: { global: "phaseZhunbeiBegin" },
    check(event, player) {
      if (get.attitude(player, event.player) < -2) {
        var cards2 = player.getCards("h");
        if (cards2.length > player.hp) {
          return true;
        }
        for (var i = 0; i < cards2.length; i++) {
          var useful = get.useful(cards2[i]);
          if (useful < 5) {
            return true;
          }
          if (get.number(cards2[i]) > 7 && useful < 7) {
            return true;
          }
        }
      }
      return false;
    },
    logTarget: "player",
    filter(event, player) {
      return player.hp < player.maxHp && player.canCompare(event.player);
    },
    async content(event, trigger, player) {
      const { player: target } = trigger;
      const result = await player.chooseToCompare(target).set("small", player.hp > 1 && get.effect(player, { name: "sha" }, target, player) > 0 && Math.random() < 0.9).forResult();
      if (result.bool) {
        target.addTempSkill("zishou2");
      } else {
        if (result.target && get.position(result.target) == "d") {
          await player.gain(result.target, "gain2", "log");
        }
        const card = { name: "sha", isCard: true };
        if (target.canUse(card, player, false)) {
          await target.useCard(card, player, false);
        }
      }
    }
  },
  reqiuyuan: {
    inherit: "qiuyuan",
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      const { card } = trigger;
      const result = await target.chooseToGive(
        (card2, player2) => {
          const name = get.name(card2, player2);
          return name != "sha" && get.type(name) == "basic";
        },
        `交给${get.translation(player)}一张不为【杀】的基本牌，或成为${get.translation(card)}的额外目标且不可响应此牌`,
        player
      ).set("ai", (card2) => {
        const { player: player2, target: target2 } = get.event();
        return get.attitude(player2, target2) >= 0 ? 1 : -1;
      }).forResult();
      if (!result?.bool) {
        trigger.getParent().targets.push(target);
        trigger.getParent().triggeredTargets2.push(target);
        trigger.directHit.push(target);
        game.log(target, "成为了", card, "的额外目标");
      }
    }
  },
  reenyuan: {
    audio: 2,
    group: ["reenyuan1", "reenyuan2"]
  },
  reenyuan1: {
    audio: "reenyuan",
    inherit: "xinenyuan1",
    sourceSkill: "reenyuan"
  },
  reenyuan2: {
    audio: "reenyuan",
    inherit: "xinenyuan2",
    sourceSkill: "reenyuan",
    prompt2: (event) => `令${get.translation(event.source)}选择一项：1.失去1点体力；2.交给你一张手牌，若此牌的花色不为♥，你摸一张牌。`,
    async content(event, trigger, player) {
      const result = await trigger.source.chooseToGive(`恩怨：交给${get.translation(player)}一张手牌，或失去1点体力`, "h", player).set("ai", (card) => {
        const { player: player2, target } = get.event();
        if (get.attitude(player2, target) > 0) {
          if (get.suit(card) != "heart") {
            return 15 - get.value(card);
          }
          return 11 - get.value(card);
        } else {
          let num = 12 - player2.hp * 2;
          if (get.suit(card) != "heart") {
            num -= 2;
          }
          return num - get.value(card);
        }
      }).forResult();
      if (!result?.bool || !result?.cards?.length) {
        await trigger.source.loseHp();
      } else if (result?.cards?.length && get.suit(result.cards[0]) !== "heart") {
        await player.draw();
      }
    }
  },
  rexuanhuo: {
    audio: 2,
    trigger: { player: "phaseDrawEnd" },
    filter(event, player) {
      return player.countCards("h") > 1 && game.countPlayer() > 2;
    },
    async cost(event, trigger, player) {
      const ai2 = function(target) {
        const player2 = get.player();
        if (get.attitude(player2, target) <= 0) {
          return 0;
        }
        const list = [null, "juedou"].concat(lib.inpile_nature);
        if (target.hasSkill("ayato_zenshen")) {
          list.push("kami");
        }
        let num = Math.max.apply(
          Math,
          list.map(function(i) {
            if (i == "juedou") {
              return target.getUseValue({ name: "juedou", isCard: true }, false);
            }
            const card = { name: "sha", nature: i, isCard: true };
            return target.getUseValue(card, false);
          })
        );
        if (target.hasSkillTag("nogain")) {
          num /= 4;
        }
        return num;
      };
      event.result = await player.chooseCardTarget({
        prompt: get.prompt2(event.skill),
        filterCard: true,
        selectCard: 2,
        position: "h",
        filterTarget: lib.filter.notMe,
        goon: game.hasPlayer((current) => {
          return current != player && ai2(current) > 0;
        }),
        ai1(card) {
          if (!_status.event.goon) {
            return 0;
          }
          return 7 - get.value(card);
        },
        ai2
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await player.give(event.cards, target);
      let result;
      const targets = game.filterPlayer((current) => {
        return current != player && current != target;
      });
      if (!targets.length) {
        return;
      }
      result = targets.length == 1 ? { bool: true, targets } : await player.chooseTarget(
        (card, player2, target3) => {
          return _status.event.targets?.includes(target3);
        },
        `选择${get.translation(target)}使用【杀】或【决斗】的目标`,
        true
      ).set("target", target).set("ai", (target3) => {
        const evt = _status.event;
        const list2 = [null, "juedou"].concat(lib.inpile_nature);
        if (evt.target.hasSkill("ayato_zenshen")) {
          list2.push("kami");
        }
        return Math.max.apply(
          Math,
          list2.map((item) => {
            const card = { name: "sha", isCard: true };
            if (item == "juedou") {
              card.name = "juedou";
            } else if (item) {
              card.nature = item;
            }
            if (!evt.target.canUse(card, target3, false)) {
              return 0;
            }
            return get.effect(target3, card, evt.target, evt.player);
          })
        );
      }).set("targets", targets).forResult();
      if (!result?.bool) {
        return;
      }
      const target2 = result.targets[0];
      event.target2 = target2;
      player.line(target2);
      game.log(player, "选择了", target2);
      const list = lib.inpile_nature.slice(0);
      list.unshift(null);
      let vcards = [];
      if (target.hasSkill("ayato_zenshen")) {
        list.add("kami");
      }
      vcards = list.filter((nature) => target.canUse({ name: "sha", isCard: true, nature }, target2, false)).map((nature) => {
        return ["基本", "", "sha", nature];
      });
      if (target.canUse({ name: "juedou", isCard: true }, target2, false)) {
        vcards.push(["基本", "", "juedou"]);
      }
      if (!vcards.length) {
        if (!target.countCards("h")) {
          return;
        } else {
          result = { index: 1 };
        }
      } else if (!target.countCards("h")) {
        result = { index: 0 };
      } else {
        result = await target.chooseControl().set("choiceList", [`视为对${get.translation(target2)}使用任意一种【杀】或【决斗】`, `将所有手牌交给${get.translation(player)}`]).forResult();
      }
      if (result?.index == 0) {
        result = await target.chooseButton([`眩惑：请选择要对${get.translation(target2)}使用的牌`, [vcards, "vcard"]], true).set("target", target2).set("direct", true).set("ai", (button) => {
          const { player: player2, target: target3 } = get.event();
          return get.effect(target3, { name: button.link[2], isCard: true, nature: button.link[3] }, player2, player2);
        }).forResult();
        if (result?.bool) {
          await target.useCard({ name: result.links[0][2], isCard: true, nature: result.links[0][3] }, false, target2);
        }
      } else if (result?.index == 1) {
        await target.give(target.getCards("h"), player, "giveAuto");
      }
    },
    ai: {
      expose: 0.17,
      fireAttack: true,
      skillTagFilter(player) {
        return player.hasFriend();
      }
    }
  },
  decadezongshi: {
    audio: 2,
    mod: {
      maxHandcard(player, num) {
        return num + game.countGroup();
      }
    },
    trigger: { target: "useCardToTargeted" },
    forced: true,
    filter(event, player) {
      return player != _status.currentPhase && player.countCards("h") >= player.getHandcardLimit() && (get.type(event.card) == "delay" || get.color(event.card) == "none");
    },
    async content(event, trigger, player) {
      trigger.excluded.add(player);
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (target != _status.currentPhase && target.countCards("h") >= target.getHandcardLimit() && (get.type(card) == "delay" || get.color(card) == "none")) {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  decadezishou: {
    audio: 2,
    inherit: "rezishou",
    group: "decadezishou_zhiheng",
    ai: {
      threaten: 1.8
    }
  },
  decadezishou_zhiheng: {
    trigger: { player: "phaseJieshuBegin" },
    direct: true,
    sourceSkill: "decadezishou",
    filter(event, player) {
      return player.countCards("h") > 0 && !player.getHistory("useCard", function(evt) {
        return evt.targets.filter(function(target) {
          return target != player;
        }).length > 0;
      }).length;
    },
    async content(event, trigger, player) {
      var list = [];
      var hs = player.getCards("h");
      for (var i of hs) {
        list.add(get.suit(i, player));
      }
      const result = await player.chooseToDiscard("h", get.prompt("decadezishou"), "弃置任意张花色不同的手牌并摸等量的牌", [1, list.length], function(card, player2) {
        if (ui.selected.cards.length) {
          var suit = get.suit(card, player2);
          for (var i2 of ui.selected.cards) {
            if (get.suit(i2, player2) == suit) {
              return false;
            }
          }
        }
        return true;
      }).set("ai", lib.skill.zhiheng.check).set("complexCard", true).forResult();
      if (result.bool) {
        player.logSkill("decadezishou");
        await player.draw(result.cards.length);
      }
    }
  },
  yongjin: {
    audio: 2,
    audioname: ["xin_lingtong"],
    limited: true,
    skillAnimation: true,
    animationColor: "wood",
    enable: "phaseUse",
    filter(event, player, cards2) {
      return game.hasPlayer(function(current) {
        var es = current.getCards("e", function(card) {
          return !cards2 || !cards2.includes(card);
        });
        for (var i = 0; i < es.length; i++) {
          if (game.hasPlayer(function(current2) {
            return current != current2 && !current2.isMin() && current2.canEquip(es[i]);
          })) {
            return true;
          }
        }
      });
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      event.count = 3;
      event.cards = [];
      while (event.count > 0) {
        event.count--;
        if (!lib.skill.yongjin.filter(null, player, event.cards)) {
          break;
        }
        const chooseTargetResult = await player.chooseTarget(2, function(card, player2, target) {
          if (ui.selected.targets.length) {
            var from = ui.selected.targets[0];
            if (target.isMin()) {
              return false;
            }
            var es = from.getCards("e", function(card2) {
              return !_status.event.cards.includes(card2);
            });
            for (var i = 0; i < es.length; i++) {
              if (target.canEquip(es[i])) {
                return true;
              }
            }
            return false;
          } else {
            return target.countCards("e", function(card2) {
              return !_status.event.cards.includes(card2);
            }) > 0;
          }
        }).set("ai", function(target) {
          var player2 = _status.event.player;
          var att = get.attitude(player2, target);
          var sgnatt = get.sgn(att);
          if (ui.selected.targets.length == 0) {
            if (target == player2 && player2.hasSkill("decadexuanfeng")) {
              if (player2.countCards("e", function(card) {
                return !_status.event.cards.includes(card) && game.hasPlayer(function(current) {
                  return current != target && current.canEquip(card) && get.effect(current, card, player2, player2) < 0;
                });
              }) > 0) {
                return 18;
              }
              return 7;
            } else if (att > 0) {
              if (target.countCards("e", function(card) {
                return get.value(card, target) < 0 && !_status.event.cards.includes(card) && game.hasPlayer(function(current) {
                  return current != target && current.canEquip(card) && get.effect(current, card, player2, player2) < 0;
                });
              }) > 0) {
                return 9;
              }
            } else if (att < 0) {
              if (game.hasPlayer(function(current) {
                if (current != target && get.attitude(player2, current) > 0) {
                  var es2 = target.getCards("e", function(card) {
                    return !_status.event.cards.includes(card);
                  });
                  for (var i2 = 0; i2 < es2.length; i2++) {
                    if (get.value(es2[i2], target) > 0 && current.canEquip(es2[i2]) && get.effect(current, es2[i2], player2, current) > 0) {
                      return true;
                    }
                  }
                }
              })) {
                return -att;
              }
            }
            return 0;
          }
          var es = ui.selected.targets[0].getCards("e", function(card) {
            return !_status.event.cards.includes(card);
          });
          var i;
          var att2 = get.sgn(get.attitude(player2, ui.selected.targets[0]));
          for (i = 0; i < es.length; i++) {
            if (ui.selected.targets[0] == player2 && player2.hasSkill("decadexuanfeng")) {
              var bool = game.hasPlayer(function(current) {
                return get.attitude(player2, current) < 0 && current.countDiscardableCards(player2, "he") > 0 && get.damageEffect(current, player2, player2) > 0;
              });
              if (bool && player2.countCards("e", function(card) {
                return !_status.event.cards.includes(card) && target.canEquip(card) && get.effect(target, card, player2, player2) > 0;
              })) {
                return 2.5 * Math.abs(att);
              } else if (bool) {
                return 1 / Math.max(1, Math.abs(att));
              } else {
                return get.damageEffect(target, player2, player2);
              }
            }
            if (sgnatt != 0 && att2 != 0 && sgnatt != att2 && get.sgn(get.value(es[i], ui.selected.targets[0])) == -att2 && get.sgn(get.effect(target, es[i], player2, target)) == sgnatt && target.canEquip(es[i])) {
              return Math.abs(att);
            }
          }
          if (i == es.length) {
            return 0;
          }
          return -att * get.attitude(player2, ui.selected.targets[0]);
        }).set("multitarget", true).set("cards", event.cards).set("targetprompt", ["被移走", "移动目标"]).set("prompt", "移动场上的一张装备牌").forResult();
        if (chooseTargetResult.bool) {
          player.line2(chooseTargetResult.targets, "green");
          event.targets = chooseTargetResult.targets;
        } else {
          break;
        }
        await game.delay();
        if (event.targets.length == 2) {
          const chooseCardResult = await player.choosePlayerCard(
            "e",
            true,
            function(button) {
              var player2 = _status.event.player;
              var targets0 = _status.event.targets0;
              var targets1 = _status.event.targets1;
              if (get.attitude(player2, targets0) > 0 && get.attitude(player2, targets1) < 0) {
                if (get.value(button.link, targets0) < 0 && get.effect(targets1, button.link, player2, targets1) > 0) {
                  return 10;
                }
                return 0;
              } else {
                return get.value(button.link) * get.effect(targets1, button.link, player2, player2);
              }
            },
            event.targets[0]
          ).set("nojudge", event.nojudge || false).set("targets0", event.targets[0]).set("targets1", event.targets[1]).set("filterButton", function(button) {
            if (_status.event.cards.includes(button.link)) {
              return false;
            }
            var targets1 = _status.event.targets1;
            return targets1.canEquip(button.link);
          }).set("cards", event.cards).forResult();
          if (chooseCardResult.bool && chooseCardResult.links.length) {
            var link = chooseCardResult.links[0];
            event.cards.add(link);
            await event.targets[1].equip(link);
            event.targets[0].$give(link, event.targets[1]);
            await game.delay();
          } else {
            break;
          }
        } else {
          break;
        }
      }
    },
    ai: {
      order: 7,
      result: {
        player(player) {
          var num = 0;
          var friends = game.filterPlayer(function(current) {
            return get.attitude(player, current) >= 4;
          });
          var vacancies = {
            equip1: 0,
            equip2: 0,
            equip3: 0,
            equip4: 0,
            equip5: 0
          };
          for (var i = 0; i < friends.length; i++) {
            for (var j = 1; j <= 5; j++) {
              if (friends[i].hasEmptySlot(j)) {
                vacancies["equip" + j]++;
              }
            }
          }
          var sources = game.filterPlayer(function(current) {
            return (current == player && current.hasSkill("decadexuanfeng") || get.attitude(player, current) < 0) && current.countCards("e");
          });
          for (var i = 0; i < sources.length; i++) {
            var es = sources[i].getCards("e");
            for (var j = 0; j < es.length; j++) {
              var type = get.subtype(es[j]);
              if (sources[i] == player || vacancies[type] > 0 && get.value(es[j]) > 0) {
                num++;
                if (sources[i] == player && vacancies[type] && game.hasPlayer(function(current) {
                  return get.attitude(player, current) < 0 && current.countDiscardableCards(player, "he") > 0 && get.damageEffect(current, player, player) > 0;
                })) {
                  num += 0.5;
                }
                if (num >= 3) {
                  return 1;
                }
                vacancies[type]--;
              }
            }
          }
          if (num && player.hp == 1) {
            return 0.5;
          }
          return 0;
        }
      }
    }
  },
  decadexuanfeng: {
    audio: "xuanfeng",
    audioname: ["boss_lvbu3", "re_heqi", "xin_lingtong"],
    mod: {
      aiOrder(player, card, num) {
        if (num <= 0 || !player.isPhaseUsing() || player.needsToDiscard() !== 2 || !card.cards || !card.cards.some((i) => {
          return get.position(i) === "h";
        }) || get.tag(card, "draw") || get.tag(card, "gain")) {
          return;
        }
        if (get.type(card) == "equip" && player.hasCard((cardx) => card != cardx && (!card.cards || !card.cards.includes(cardx)) && (player.hasSkill("yongjin") || get.subtype(card) == get.subtype(cardx)) && (get.position(cardx) == "e" || player.canUse(cardx, player)), "hes")) {
          return;
        }
        if (!game.hasPlayer((current) => get.attitude(player, current) < 0 && current.countDiscardableCards(player, "he") > 0 && get.damageEffect(current, player, player) > 0)) {
          return;
        }
        return 0;
      }
    },
    trigger: {
      player: ["loseAfter", "phaseDiscardEnd"],
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    filter(event, player) {
      if (_status.dying.length) {
        return false;
      }
      if (event.name == "phaseDiscard") {
        var cards2 = [];
        player.getHistory("lose", function(evt2) {
          if (evt2 && evt2.type == "discard" && evt2.getParent("phaseDiscard") == event && evt2.hs) {
            cards2.addArray(evt2.hs);
          }
        });
        return cards2.length > 1;
      } else {
        var evt = event.getl(player);
        return evt && evt.es && evt.es.length > 0;
      }
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(
        get.prompt2(event.skill),
        (card, player2, target) => {
          if (player2 == target) {
            return false;
          }
          return target.countDiscardableCards(player2, "he");
        },
        [1, 2]
      ).set("ai", (target) => {
        let player2 = get.event().player, att = get.attitude(player2, target), hs = target.countCards("h"), es = target.countCards("e");
        if (hs && target.hasSkillTag("noh") || es && target.hasSkillTag("noe")) {
          att *= 0.8;
        } else {
          att = -att;
        }
        if (ui.selected.targets.length) {
          let pre = ui.selected.targets[0], damage = get.event().damage;
          if (get.attitude(player2, pre) < 0 && (damage ? get.damageEffect(pre, player2, player2) > 0 : true) && pre.countCards("he") >= 2) {
            return 0;
          }
          if (damage) {
            return att + get.damageEffect(target, player2, player2);
          }
        }
        return att;
      }).set("damage", player == _status.currentPhase).set("complexTarget", true).forResult();
    },
    locked: false,
    async content(event, trigger, player) {
      const targets = event.targets;
      for (const target of targets) {
        let num = targets.length > 1 ? 1 : 2;
        if (get.mode() !== "identity" || player.identity !== "nei") {
          player.addExpose(0.2);
        }
        for (let i = 0; i < num; i++) {
          if (!target.countDiscardableCards(player, "he")) {
            break;
          }
          const next = player.discardPlayerCard(target, "he");
          if (i > 0) {
            next.set("prompt", `旋风：是否继续弃置${get.translation(target)}一张牌？`);
          } else {
            next.set("forced", true);
          }
        }
      }
      if (player !== _status.currentPhase) {
        return;
      }
      const result = await player.chooseTarget("是否对一名目标角色造成1点伤害？", (card, player2, target) => {
        return _status.event.targets.includes(target);
      }).set("targets", targets).set("ai", (target) => {
        const player2 = get.event().player;
        return get.damageEffect(target, player2, player2);
      }).forResult();
      if (result.bool) {
        player.line(result.targets[0], "thunder");
        await result.targets[0].damage();
      }
    },
    ai: {
      effect: {
        target(card, player, target, current) {
          if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) {
            return [1, 3];
          }
          if (get.tag(card, "damage") && target.hp > 2) {
            var num1 = target.countCards("h"), num2 = target.getHandcardLimit();
            if (num1 > num2) {
              return [1, 1];
            }
            if (num1 == num2) {
              return [1.1, _status.event.player == target ? 3 : 0.5];
            }
            if (num1 == num2 - 1) {
              return [0.1, _status.event.player == target ? 4.5 : 0.1];
            }
          }
          if (typeof card !== "object") {
            return;
          }
          if ((get.tag(card, "discard") || get.tag(card, "loseCard")) && target.countCards("h") > 0 && get.attitude(player, target) < 0) {
            return [1, -1];
          }
        }
      },
      reverseEquip: true,
      noe: true,
      threaten(player, target) {
        return target.countCards("e") + target.countCards("h") / 3;
      }
    }
  },
  oltuntian: {
    inherit: "tuntian",
    filter(event, player) {
      if (player == _status.currentPhase) {
        if (event.type != "discard") {
          return false;
        }
        var evt = event.getl(player);
        return evt && evt.cards2 && evt.cards2.filter(function(i) {
          return get.name(i, evt.hs.includes(i) ? player : false) == "sha";
        }).length > 0;
      }
      if (event.name == "gain" && event.player == player) {
        return false;
      }
      var evt = event.getl(player);
      return evt && evt.cards2 && evt.cards2.length > 0;
    }
  },
  olzaoxian: {
    inherit: "zaoxian",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.loseMaxHp();
      player.addSkills("jixi");
      player.insertPhase();
    },
    ai: {
      combo: "oltuntian"
    }
  },
  rejunxing: {
    enable: "phaseUse",
    audio: 2,
    usable: 1,
    filterCard: lib.filter.cardDiscardable,
    selectCard: [1, Infinity],
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    check(card) {
      if (ui.selected.cards.length) {
        return -1;
      }
      return 6 - get.value(card);
    },
    filterTarget(card, player, target) {
      return player != target;
    },
    allowChooseAll: true,
    async content(event, trigger, player) {
      const { target, cards: cards2 } = event;
      const result = await target.chooseToDiscard(cards2.length, "弃置" + get.cnNumber(cards2.length) + "张牌并失去1点体力，或点取消将武将牌翻面并摸" + get.cnNumber(cards2.length) + "张牌", "he").set("ai", function(card) {
        const player2 = get.event().player;
        if (get.event().cardsx?.length > 3 || player2.hasSkillTag("noturn") || player2.isTurnedOver() || (get.name(card) == "tao" || get.name(card) == "jiu") && lib.filter.cardSavable(card, player2, player2)) {
          return -1;
        }
        if (player2.hp <= 1) {
          if (cards2.length < player2.getEnemies().length && player2.hasCard((cardx) => {
            return (get.name(cardx) == "tao" || get.name(cardx) == "jiu") && lib.filter.cardSavable(cardx, player2, player2);
          }, "hs")) {
            return 7 - get.value(card);
          }
          return -1;
        }
        return 24 - 5 * cards2.length - 2 * Math.min(4, player2.hp) - get.value(card);
      }).set("cardsx", cards2).forResult();
      if (!result.bool) {
        await target.turnOver();
        await target.draw(cards2.length);
      } else {
        await target.loseHp();
      }
    },
    ai: {
      order: 2,
      threaten: 1.8,
      result: {
        target(player, target) {
          if (target.hasSkillTag("noturn")) {
            return 0;
          }
          if (target.isTurnedOver()) {
            return 2;
          }
          return -1 / (target.countCards("h") + 1);
        }
      }
    }
  },
  rejuece: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    direct: true,
    filter(event, player) {
      return game.hasPlayer(function(current) {
        return current != player && current.getHistory("lose", function(evt) {
          return evt.cards2 && evt.cards2.length > 0;
        }).length > 0;
      });
    },
    async content(event, trigger, player) {
      const result = await player.chooseTarget(get.prompt("rejuece"), "对一名本回合失去过牌的其他角色造成1点伤害", function(card, player2, target2) {
        return _status.event.targets.includes(target2);
      }).set(
        "targets",
        game.filterPlayer(function(current) {
          return current != player && current.getHistory("lose", function(evt) {
            return evt.cards2 && evt.cards2.length > 0;
          }).length > 0;
        })
      ).set("ai", function(target2) {
        var player2 = _status.event.player;
        return get.damageEffect(target2, player2, player2);
      }).forResult();
      if (result.bool) {
        var target = result.targets[0];
        player.logSkill("rejuece", target);
        await target.damage();
      }
    }
  },
  remieji: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h", { type: ["trick", "delay"], color: "black" });
    },
    filterCard(card) {
      return get.color(card) == "black" && get.type(card, "trick") == "trick";
    },
    filterTarget(card, player, target) {
      return target != player && target.countCards("he") > 0;
    },
    discard: false,
    delay: false,
    loseTo: "cardPile",
    insert: true,
    visible: true,
    check(card) {
      return 8 - get.value(card);
    },
    async content(event, trigger, player) {
      const { target, cards: cards2 } = event;
      await player.showCards(cards2, `${get.translation(player)}对${get.translation(target)}发动了【${get.translation(event.name)}】`);
      if (!target.countCards("he", function(card) {
        if (get.type2(card) == "trick") {
          return true;
        }
        return lib.filter.cardDiscardable(card, target, "remieji");
      })) {
        return;
      } else {
        const result = await target.chooseCard("he", true, function(card, player2) {
          if (get.type2(card) == "trick") {
            return true;
          }
          return lib.filter.cardDiscardable(card, player2, "remieji");
        }).set("prompt", "选择交给" + get.translation(player) + "一张锦囊牌，或依次弃置两张非锦囊牌。").forResult();
        if (result.cards?.length) {
          const {
            cards: [card]
          } = result;
          if (get.type2(card) == "trick") {
            await target.give(card, player);
          } else {
            await target.discard(card);
            await target.chooseToDiscard("he", true, function(card2) {
              return get.type2(card2) != "trick";
            });
          }
        }
      }
    },
    ai: {
      order: 9,
      result: {
        target: -1
      }
    }
  },
  decadelihuo: {
    trigger: { player: "useCard1" },
    filter(event, player) {
      if (event.card.name == "sha" && !game.hasNature(event.card)) {
        return true;
      }
      return false;
    },
    audio: "lihuo",
    prompt2(event) {
      return "将" + get.translation(event.card) + "改为火属性";
    },
    audioname: ["re_chengpu"],
    check(event, player) {
      return event.baseDamage > 1 && game.hasPlayer(function(current) {
        return !event.targets.includes(current) && player.canUse(event.card, current) && get.attitude(player, current) < 0 && !current.hasShan() && get.effect(current, { name: "sha", nature: "fire" }, player, player) > 0;
      });
    },
    async content(event, trigger, player) {
      game.setNature(trigger.card, "fire");
    },
    group: ["decadelihuo2", "decadelihuo3"],
    ai: {
      fireAttack: true
    }
  },
  decadelihuo2: {
    trigger: { player: "useCard2" },
    sourceSkill: "decadelihuo",
    filter(event, player) {
      if (event.card.name != "sha" || !game.hasNature(event.card, "fire")) {
        return false;
      }
      return game.hasPlayer(function(current) {
        return !event.targets.includes(current) && player.canUse(event.card, current);
      });
    },
    direct: true,
    async content(event, trigger, player) {
      const result = await player.chooseTarget(get.prompt("decadelihuo"), "为" + get.translation(trigger.card) + "增加一个目标", function(card, player2, target) {
        return !_status.event.sourcex.includes(target) && player2.canUse(_status.event.card, target);
      }).set("sourcex", trigger.targets).set("card", trigger.card).set("ai", function(target) {
        var player2 = _status.event.player;
        return get.effect(target, _status.event.card, player2, player2);
      }).forResult();
      if (result.bool) {
        if (!event.isMine() && !_status.connectMode) {
          await game.delayx();
        }
        const target = result.targets[0];
        player.logSkill("decadelihuo", target);
        trigger.targets.push(target);
      }
    }
  },
  decadelihuo3: {
    trigger: { player: "useCardAfter" },
    sourceSkill: "decadelihuo",
    filter(event, player) {
      return event.card.name == "sha" && game.hasNature(event.card, "fire") && event.targets.length > 1 && player.getHistory("sourceDamage", function(evt) {
        return evt.card == event.card;
      }).length > 0;
    },
    forced: true,
    audio: "lihuo",
    audioname: ["re_chengpu"],
    async content(event, trigger, player) {
      await player.loseHp();
    }
  },
  decadechunlao: {
    audio: "chunlao",
    audioname: ["re_chengpu"],
    enable: "chooseToUse",
    viewAs: { name: "jiu", isCard: true },
    viewAsFilter(player) {
      return !player.isLinked();
    },
    filter(event, player) {
      return !player.isLinked();
    },
    filterCard: () => false,
    selectCard: -1,
    log: false,
    async precontent(event, trigger, player) {
      player.logSkill("decadechunlao");
      await player.link();
    },
    group: ["decadechunlao2", "decadechunlaox"],
    ai: { jiuOther: true }
  },
  decadechunlaox: {
    trigger: { player: "damageBegin2" },
    silent: true,
    lastDo: true,
    sourceSkill: "decadechunlao",
    filter(event, player) {
      return !player.isLinked();
    },
    async content(event, trigger, player) {
      trigger.decadechunlaox = true;
    }
  },
  decadechunlao2: {
    trigger: {
      source: "damageSource",
      player: "damageEnd"
    },
    prompt: "是否发动【醇醪】将武将牌重置？",
    sourceSkill: "decadechunlao",
    filter(event, player) {
      return player.isLinked() && event.num > 1 && !event.decadechunlaox;
    },
    async content(event, trigger, player) {
      await player.link();
    }
  },
  oltianxiang: {
    audio: "tianxiang",
    audioname: ["daxiaoqiao", "re_xiaoqiao", "ol_xiaoqiao"],
    trigger: { player: "damageBegin4" },
    direct: true,
    filter(event, player) {
      return player.countCards("he", function(card) {
        if (_status.connectMode && get.position(card) == "h") {
          return true;
        }
        return get.suit(card, player) == "heart";
      }) > 0 && event.num > 0;
    },
    async content(event, trigger, player) {
      const result = await player.chooseCardTarget({
        filterCard(card, player2) {
          return get.suit(card) == "heart" && lib.filter.cardDiscardable(card, player2);
        },
        filterTarget(card, player2, target2) {
          return player2 != target2;
        },
        position: "he",
        ai1(card) {
          return 10 - get.value(card);
        },
        ai2(target2) {
          var att = get.attitude(_status.event.player, target2);
          var trigger2 = _status.event.getTrigger();
          var da = 0;
          if (_status.event.player.hp == 1) {
            da = 10;
          }
          var eff = get.damageEffect(target2, trigger2.source, target2);
          if (att == 0) {
            return 0.1 + da;
          }
          if (eff >= 0 && att > 0) {
            return att + da;
          }
          if (att > 0 && target2.hp > 1) {
            if (target2.maxHp - target2.hp >= 3) {
              return att * 1.1 + da;
            }
            if (target2.maxHp - target2.hp >= 2) {
              return att * 0.9 + da;
            }
          }
          return -att + da;
        },
        prompt: get.prompt("oltianxiang"),
        prompt2: lib.translate.oltianxiang_info
      }).forResult();
      if (result.bool) {
        await player.discard(result.cards);
        var target = result.targets[0];
        const result2 = await player.chooseControlList(
          true,
          function(event2, player2) {
            var target2 = _status.event.target;
            var att = get.attitude(player2, target2);
            if (target2.hasSkillTag("maihp")) {
              att = -att;
            }
            if (att > 0) {
              return 0;
            } else {
              return 1;
            }
          },
          ["令" + get.translation(target) + "受到伤害来源对其造成的1点伤害，然后摸X张牌（X为其已损失体力值且至多为5）", "令" + get.translation(target) + "失去1点体力，然后获得" + get.translation(result.cards)]
        ).set("target", target).forResult();
        player.logSkill(event.name, target);
        trigger.cancel();
        event.target = target;
        event.card = result.cards[0];
        if (typeof result2.index == "number") {
          event.index = result2.index;
          if (result2.index) {
            event.related = event.target.loseHp();
          } else {
            const param = trigger.source ? { source: trigger.source, nocard: true } : { nosource: true, nocard: true };
            event.related = event.target.damage(param);
          }
          await event.related;
        } else {
          return;
        }
        if (event.related.cancelled || target.isDead()) {
          return;
        }
        if (event.index && event.card.isInPile()) {
          await target.gain(event.card, "gain2");
        } else if (target.getDamagedHp()) {
          await target.draw({ num: Math.min(5, target.getDamagedHp()) });
        }
      }
    },
    ai: {
      maixie_defend: true,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return;
          }
          if (get.tag(card, "damage") && target.countCards("he") > 1) {
            return 0.7;
          }
        }
      }
    }
  },
  olhongyan: {
    audio: "rehongyan",
    mod: {
      suit(card, suit) {
        if (suit == "spade") {
          return "heart";
        }
      },
      maxHandcardBase(player, num) {
        if (player.countCards("e", function(card) {
          return get.suit(card, player) == "heart";
        })) {
          return player.maxHp;
        }
      }
    }
  },
  piaoling: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    frequent: true,
    async content(event, trigger, player) {
      const result = await player.judge(function(card) {
        return get.suit(card) == "heart" ? 2 : 0;
      }).set("judge2", function(result2) {
        return result2.bool ? true : false;
      }).forResult();
      if (result?.card && result.suit == "heart") {
        const { card } = result;
        if (get.position(card, true) == "d") {
          const result2 = await player.chooseTarget("飘零：令一名角色获得" + get.translation(card) + "，或点【取消】将其置于牌堆顶").set("ai", function(target) {
            var player2 = _status.event.player;
            var att = get.attitude(player2, target);
            if (player2 == target) {
              att /= 2;
            }
            return att;
          }).forResult();
          if (result2.bool && result2.targets?.length) {
            const {
              targets: [target]
            } = result2;
            player.line(target, "green");
            await target.gain(card, "gain2");
            if (player == target) {
              await player.chooseToDiscard("he", true);
            }
          } else {
            game.log(player, "将", card, "置于牌堆顶");
            await game.cardsGotoPile(card, "insert");
          }
        }
      }
    }
  },
  xinyicong: {
    audio: "yicong",
    mod: {
      globalFrom(from, to, current) {
        return current - Math.max(0, from.hp - 1);
      },
      globalTo(from, to, current) {
        return current + Math.max(0, to.getDamagedHp() - 1);
      }
    },
    ai: {
      threaten: 0.8
    }
  },
  rezongshi: {
    audio: 2,
    mod: {
      maxHandcard(player, num) {
        return num + game.countGroup();
      }
    },
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      return player.countCards("h") > player.hp;
    },
    async content(event, trigger, player) {
      player.addTempSkill("rezongshi_paoxiao");
    }
  },
  rezongshi_paoxiao: {
    mod: {
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return Infinity;
        }
      }
    }
  },
  olbaonue: {
    audio: 2,
    zhuSkill: true,
    trigger: { global: "damageSource" },
    filter(event, player) {
      if (player == event.source || !event.source || event.source.group != "qun") {
        return false;
      }
      return player.hasZhuSkill("olbaonue", event.source);
    },
    getIndex: (event) => event.num,
    logTarget: "source",
    async content(event, trigger, player) {
      const next = player.judge((card) => {
        if (get.suit(card) == "spade") {
          return 4;
        }
        return 0;
      });
      next.set("callback", async (event2) => {
        if (event2.judgeResult.suit == "spade") {
          await player.recover();
          if (get.position(event2.judgeResult.card, true) == "o") {
            await player.gain(event2.judgeResult.card, "gain2", "log");
          }
        }
      });
      next.judge2 = (result) => result.bool;
      await next;
    }
  },
  rezishou: {
    audio: "zishou",
    audioname: ["re_liubiao"],
    trigger: { player: "phaseDrawBegin2" },
    check(event, player) {
      return player.countCards("h") <= (player.hasSkill("zongshi") ? player.maxHp : player.hp - 2) || player.skipList.includes("phaseUse") || !player.countCards("h", function(card) {
        return get.tag(card, "damage") && player.hasUseTarget(card);
      });
    },
    filter(event, player) {
      return !event.numFixed;
    },
    async content(event, trigger, player) {
      trigger.num += game.countGroup();
      player.addTempSkill("rezishou2");
    },
    ai: {
      threaten: 1.5
    }
  },
  rezishou2: {
    audio: "rezishou",
    trigger: {
      source: "damageBegin2"
      //player:'phaseJieshuBegin',
    },
    forced: true,
    sourceSkill: "rezishou",
    filter(event, player) {
      if (event.name == "damage") {
        return event.player != player;
      }
      if (player.getHistory("skipped").includes("phaseUse")) {
        return false;
      }
      return player.getHistory("useCard", function(evt) {
        if (evt.targets && evt.targets.length && evt.isPhaseUsing()) {
          var targets = evt.targets.slice(0);
          while (targets.includes(player)) {
            targets.remove(player);
          }
          return targets.length > 0;
        }
        return false;
      }).length == 0;
    },
    popup: false,
    async content(event, trigger, player) {
      if (trigger.name == "damage") {
        player.logSkill("rezishou", trigger.player);
        trigger.cancel();
        return;
      } else {
        var filterTarget = function(card, player2, target2) {
          return target2 != player2 && target2.countCards("e", function(card2) {
            return player2.canEquip(card2);
          });
        };
        if (game.hasPlayer(function(current) {
          return filterTarget(null, player, current);
        })) {
          const result = await player.chooseTarget(filterTarget, "是否将一名其他角色装备区内的一张牌移动到自己的装备区？").set("ai", function(target2) {
            var player2 = _status.event.player;
            var att = get.attitude(player2, target2);
            if (att > 0 && !target2.hasSkillTag("noe")) {
              return 0;
            }
            var num = 0;
            target2.countCards("e", function(card) {
              if (player2.canEquip(card)) {
                var eff = get.effect(player2, card, player2, player2);
                if (eff > num) {
                  num = eff;
                }
              }
            });
            if (num <= 0) {
              return 0;
            }
            if (att < 0) {
              return num * -att;
            }
            return 1 / num;
          }).forResult();
          if (result.bool) {
            var target = result.targets[0];
            event.target = target;
            player.logSkill("rezishou", target);
            const result2 = await player.choosePlayerCard(target, "e", "将一张装备牌移至你的装备区").set("filterButton", function(button) {
              return _status.event.player.canEquip(button.link);
            }).forResult();
            if (result2 && result2.links && result2.links.length) {
              await game.delay(2);
              await target.$give(result2.links[0], player, false);
              await player.equip(result2.links[0]);
              player.addExpose(0.2);
            }
          }
        }
      }
    },
    ai: {
      effect: {
        player(card, player, target) {
          if (get.tag(card, "damage")) {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  decadepojun: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    direct: true,
    filter(event, player) {
      return event.card.name == "sha" && event.target.hp > 0 && event.target.countCards("he") > 0;
    },
    async content(event, trigger, player) {
      const next = player.choosePlayerCard(trigger.target, "he", [1, Math.min(trigger.target.hp, trigger.target.countCards("he"))], get.prompt("decadepojun", trigger.target), "allowChooseAll");
      next.set("ai", function(button) {
        if (!_status.event.goon) {
          return 0;
        }
        const val = get.value(button.link);
        if (button.link == _status.event.target.getEquip(2)) {
          return 2 * (val + 3);
        }
        return val;
      });
      next.set("goon", get.attitude(player, trigger.target) <= 0);
      next.set("forceAuto", true);
      const result = await next.forResult();
      if (result.bool) {
        event.cards = result.cards;
        const target = trigger.target;
        player.logSkill("decadepojun", trigger.target);
        target.addSkill("decadepojun2");
        const next2 = target.addToExpansion(result.cards, "giveAuto", target);
        next2.gaintag.add("decadepojun2");
        await next2;
      } else {
        return;
      }
      let discard = false, draw = false;
      for (const i of event.cards) {
        const type = get.type2(i);
        if (type == "equip") {
          discard = true;
        }
        if (type == "trick") {
          draw = true;
        }
      }
      let result2;
      if (discard) {
        event.equip = true;
        result2 = await player.chooseButton(
          [
            "选择一张牌置入弃牌堆",
            event.cards.filter(function(card) {
              return get.type(card) == "equip";
            })
          ],
          true
        ).set("ai", function(button) {
          return get.value(button.link, _status.event.getTrigger().target);
        }).forResult();
      }
      if (draw) {
        event.draw = true;
      }
      if (event.equip && result2 && result2.links && result2.links.length) {
        await trigger.target.loseToDiscardpile(result2.links);
      }
      if (event.draw) {
        await player.draw();
      }
    },
    ai: {
      unequip_ai: true,
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (get.attitude(player, arg.target) > 0) {
          return false;
        }
        if (tag == "directHit_ai") {
          return arg.target.hp >= Math.max(1, arg.target.countCards("h") - 1);
        }
        if (arg && arg.name == "sha" && arg.target.getEquip(2)) {
          return true;
        }
        return false;
      }
    }
  },
  decadepojun2: {
    trigger: { global: "phaseEnd" },
    forced: true,
    popup: false,
    charlotte: true,
    sourceSkill: "decadepojun",
    filter(event, player) {
      return player.getExpansions("decadepojun2").length > 0;
    },
    async content(event, trigger, player) {
      const cards2 = player.getExpansions("decadepojun2");
      game.log(player, "收回了" + get.cnNumber(cards2.length) + "张“破军”牌");
      await player.gain(cards2, "draw");
      player.removeSkill("decadepojun2");
    },
    intro: {
      markcount: "expansion",
      mark(dialog, storage, player) {
        var cards2 = player.getExpansions("decadepojun2");
        if (player.isUnderControl(true)) {
          dialog.addAuto(cards2);
        } else {
          return "共有" + get.cnNumber(cards2.length) + "张牌";
        }
      }
    }
  },
  hanzhan: {
    audio: 2,
    trigger: {
      global: "chooseToCompareBegin"
    },
    filter(event, player) {
      if (player == event.player) {
        return true;
      }
      if (event.targets) {
        return event.targets.includes(player);
      }
      return player == event.target;
    },
    logTarget(event, player) {
      if (player != event.player) {
        return event.player;
      }
      return event.targets || event.target;
    },
    prompt2(event, player) {
      return "令其改为使用随机的手牌进行拼点";
    },
    check(trigger, player) {
      var num = 0;
      var targets = player == trigger.player ? trigger.targets ? trigger.targets.slice(0) : [trigger.target] : [trigger.player];
      while (targets.length) {
        var target = targets.shift();
        if (target.getCards("h").length > 1) {
          num -= get.attitude(player, target);
        }
      }
      return num > 0;
    },
    async content(event, trigger, player) {
      const targets = player == trigger.player ? trigger.targets ? trigger.targets.slice(0) : [trigger.target] : [trigger.player];
      if (!trigger.fixedResult) {
        trigger.fixedResult = {};
      }
      for (const target of targets) {
        const hs = target.getCards("h");
        if (hs.length) {
          trigger.fixedResult[target.playerid] = hs.randomGet();
        }
      }
    },
    group: "hanzhan_gain",
    subfrequent: ["gain"]
  },
  hanzhan_gain: {
    trigger: {
      global: "chooseToCompareAfter"
    },
    audio: "hanzhan",
    sourceSkill: "hanzhan",
    filter(event, player) {
      if (event.preserve) {
        return false;
      }
      if (player != event.player && player != event.target && (!event.targets || !event.targets.includes(player))) {
        return false;
      }
      for (var i of event.lose_list) {
        if (Array.isArray(i[1])) {
          for (var j of i[1]) {
            if (get.name(j, i[0]) == "sha" && get.position(j, true) == "o") {
              return true;
            }
          }
        } else {
          var j = i[1];
          if (get.name(j, i[0]) == "sha" && get.position(j, true) == "o") {
            return true;
          }
        }
      }
      return false;
    },
    frequent: true,
    prompt2(event, player) {
      var cards2 = [], max = 0;
      for (var i of event.lose_list) {
        if (Array.isArray(i[1])) {
          for (var j of i[1]) {
            if (get.name(j, i[0]) == "sha" && get.position(j, true) == "o") {
              var num = get.number(j, i[0]);
              if (num > max) {
                cards2 = [];
                max = num;
              }
              if (num == max) {
                cards2.push(j);
              }
            }
          }
        } else {
          var j = i[1];
          if (get.name(j, i[0]) == "sha" && get.position(j, true) == "o") {
            var num = get.number(j, i[0]);
            if (num > max) {
              cards2 = [];
              max = num;
            }
            if (num == max) {
              cards2.push(j);
            }
          }
        }
      }
      return "获得" + get.translation(cards2);
    },
    async content(event, trigger, player) {
      const cards2 = [];
      let max = 0;
      for (const entry of trigger.lose_list) {
        const owner = entry[0];
        const item = entry[1];
        if (Array.isArray(item)) {
          for (const j of item) {
            if (get.name(j, owner) === "sha" && get.position(j, true) === "o") {
              const num = get.number(j, owner);
              if (num > max) {
                cards2.length = 0;
                max = num;
              }
              if (num === max) {
                cards2.push(j);
              }
            }
          }
        } else {
          const j = item;
          if (get.name(j, owner) === "sha" && get.position(j, true) === "o") {
            const num = get.number(j, owner);
            if (num > max) {
              cards2.length = 0;
              max = num;
            }
            if (num === max) {
              cards2.push(j);
            }
          }
        }
      }
      if (cards2.length) {
        await player.gain(cards2, "gain2");
      }
    }
  },
  rejianchu: {
    audio: 2,
    audioname: ["re_pangde"],
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return event.card.name == "sha" && event.target.countDiscardableCards(player, "he") > 0;
    },
    direct: true,
    async content(event, trigger, player) {
      const result = await player.discardPlayerCard(trigger.target, get.prompt("rejianchu", trigger.target)).set("ai", function(button) {
        if (!_status.event.att) {
          return 0;
        }
        if (get.position(button.link) == "e") {
          if (get.subtype(button.link) == "equip2") {
            return 5 * get.value(button.link);
          }
          return get.value(button.link);
        }
        return 1;
      }).set("logSkill", ["rejianchu", trigger.target]).set("att", get.attitude(player, trigger.target) <= 0).forResult();
      if (result.bool && result.links && result.links.length) {
        if (get.type(result.links[0], null, result.links[0].original == "h" ? player : false) != "basic") {
          trigger.getParent().directHit.add(trigger.target);
          player.addTempSkill("rejianchu2");
          player.addMark("rejianchu2", 1, false);
        } else if (trigger.cards) {
          var list = [];
          for (var i = 0; i < trigger.cards.length; i++) {
            if (get.position(trigger.cards[i], true) == "o") {
              list.push(trigger.cards[i]);
            }
          }
          if (list.length) {
            await trigger.target.gain(list, "gain2", "log");
          }
        }
      }
    },
    ai: {
      unequip_ai: true,
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (tag == "directHit_ai") {
          return arg.card.name == "sha" && arg.target.countCards("e", function(card) {
            return get.value(card) > 1;
          }) > 0;
        }
        if (arg && arg.name == "sha" && arg.target.getEquip(2)) {
          return true;
        }
        return false;
      }
    }
  },
  rejianchu2: {
    mod: {
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return num + player.countMark("rejianchu2");
        }
      }
    },
    onremove: true
  },
  wulie: {
    trigger: { player: "phaseJieshuBegin" },
    audio: 2,
    direct: true,
    limited: true,
    skillAnimation: true,
    animationColor: "wood",
    filter(event, player) {
      return player.hp > 0;
    },
    async content(event, trigger, player) {
      const result = await player.chooseTarget([1, player.hp], get.prompt2("wulie"), lib.filter.notMe).set("ai", function(target) {
        var player2 = _status.event.player;
        if (player2.hasUnknown()) {
          return 0;
        }
        if (player2.hp - ui.selected.targets.length > 1 + player2.countCards("hs", (card) => player2.canSaveCard(card, player2))) {
          return get.attitude(player2, target);
        }
        return 0;
      }).forResult();
      if (result.bool) {
        var targets = result.targets.sortBySeat();
        player.logSkill("wulie", targets);
        player.awakenSkill(event.name);
        await player.loseHp(targets.length);
        while (targets.length) {
          targets[0].addSkill("wulie2");
          targets.shift().addMark("wulie2");
        }
      }
    }
  },
  wulie2: {
    marktext: "烈",
    intro: { name2: "烈", content: "mark" },
    trigger: { player: "damageBegin3" },
    forced: true,
    sourceSkill: "wulie",
    async content(event, trigger, player) {
      trigger.cancel();
      player.removeMark("wulie2", 1);
      if (!player.storage.wulie2) {
        player.removeSkill("wulie2");
      }
    }
  },
  regongji: {
    mod: {
      attackRangeBase(player) {
        if (player.getEquips(3).length > 0 || player.getEquips(4).length > 0) {
          return Infinity;
        }
      }
    },
    locked: false,
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    position: "he",
    filter(event, player) {
      return player.hasCard(function(card) {
        return lib.skill.regongji.filterCard(card);
      }, "eh");
    },
    filterCard(card, player) {
      return get.type(card) != "basic";
    },
    filterTarget(card, player, target) {
      return target != player && target.countDiscardableCards(player, "he") > 0;
    },
    check(card) {
      return 4.5 - get.value(card);
    },
    async content(event, trigger, player) {
      const { target } = event;
      if (target.countDiscardableCards(player, "he") > 0) {
        await player.discardPlayerCard(target, "he", true);
      }
    },
    ai: {
      order: 5,
      result: {
        target(player, target) {
          var att = get.attitude(player, target);
          var nh = target.countCards("h");
          if (att > 0) {
            if (target.getEquip("baiyin") && target.isDamaged() && get.recoverEffect(target, player, player) > 0) {
              if (target.hp == 1 && !target.hujia) {
                return 1.6;
              }
              if (target.hp == 2) {
                return 0.01;
              }
              return 0;
            }
          }
          var es = target.getCards("e");
          var noe = es.length == 0 || target.hasSkillTag("noe");
          var noe2 = es.length == 1 && es[0].name != "tengjia" && get.value(es[0]) <= 0;
          var noh = nh == 0 || target.hasSkillTag("noh");
          if (noh && (noe || noe2)) {
            return 0;
          }
          if (att <= 0 && !target.countCards("he")) {
            return 1.5;
          }
          return -1.5;
        }
      },
      tag: {
        loseCard: 1,
        discard: 1
      }
    }
  },
  ollongdan: {
    mod: {
      aiValue(player, card, num) {
        if (card.name != "sha" && card.name != "shan") {
          return;
        }
        var geti = function() {
          var cards2 = player.getCards("hs", function(card2) {
            return card2.name == "sha" || card2.name == "shan";
          });
          if (cards2.includes(card)) {
            return cards2.indexOf(card);
          }
          return cards2.length;
        };
        return Math.max(num, [7, 5, 5, 3][Math.min(geti(), 3)]);
      },
      aiUseful() {
        return lib.skill.ollongdan.mod.aiValue.apply(this, arguments);
      }
    },
    locked: false,
    audio: "longdan_sha",
    audioname: ["re_zhaoyun", "huan_zhaoyun", "sp_zhaoyun"],
    audioname2: { tongyuan: "longdan_tongyuan" },
    hiddenCard(player, name) {
      if (name == "tao") {
        return player.countCards("hs", "jiu") > 0;
      }
      if (name == "jiu") {
        return player.countCards("hs", "tao") > 0;
      }
      return false;
    },
    enable: ["chooseToUse", "chooseToRespond"],
    position: "hs",
    prompt: "将杀当做闪，或将闪当做杀，或将桃当做酒，或将酒当做桃使用或打出",
    viewAs(cards2, player) {
      if (cards2.length) {
        var name = false;
        switch (get.name(cards2[0], player)) {
          case "sha":
            name = "shan";
            break;
          case "shan":
            name = "sha";
            break;
          case "tao":
            name = "jiu";
            break;
          case "jiu":
            name = "tao";
            break;
        }
        if (name) {
          return { name };
        }
      }
      return null;
    },
    check(card) {
      var player = _status.event.player;
      if (_status.event.type == "phase") {
        var max = 0;
        var name2;
        var list = ["sha", "tao", "jiu"];
        var map = { sha: "shan", tao: "jiu", jiu: "tao" };
        for (var i = 0; i < list.length; i++) {
          var name = list[i];
          if (player.countCards("hs", map[name]) > (name == "jiu" ? 1 : 0) && player.getUseValue({ name }) > 0) {
            var temp = get.order({ name });
            if (temp > max) {
              max = temp;
              name2 = map[name];
            }
          }
        }
        if (name2 == get.name(card, player)) {
          return 1;
        }
        return 0;
      }
      return 1;
    },
    filterCard(card, player, event) {
      event = event || _status.event;
      var filter = event._backup.filterCard;
      var name = get.name(card, player);
      if (name == "sha" && filter({ name: "shan", cards: [card] }, player, event)) {
        return true;
      }
      if (name == "shan" && filter({ name: "sha", cards: [card] }, player, event)) {
        return true;
      }
      if (name == "tao" && filter({ name: "jiu", cards: [card] }, player, event)) {
        return true;
      }
      if (name == "jiu" && filter({ name: "tao", cards: [card] }, player, event)) {
        return true;
      }
      return false;
    },
    filter(event, player) {
      var filter = event.filterCard;
      if (filter(get.autoViewAs({ name: "sha" }, "unsure"), player, event) && player.countCards("hs", "shan")) {
        return true;
      }
      if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hs", "sha")) {
        return true;
      }
      if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hs", "jiu")) {
        return true;
      }
      if (filter(get.autoViewAs({ name: "jiu" }, "unsure"), player, event) && player.countCards("hs", "tao")) {
        return true;
      }
      return false;
    },
    ai: {
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag) {
        var name;
        switch (tag) {
          case "respondSha":
            name = "shan";
            break;
          case "respondShan":
            name = "sha";
            break;
        }
        if (!player.countCards("hs", name)) {
          return false;
        }
      },
      order(item, player) {
        if (player && _status.event.type == "phase") {
          var max = 0;
          var list = ["sha", "tao", "jiu"];
          var map = { sha: "shan", tao: "jiu", jiu: "tao" };
          for (var i = 0; i < list.length; i++) {
            var name = list[i];
            if (player.countCards("hs", map[name]) > (name == "jiu" ? 1 : 0) && player.getUseValue({ name }) > 0) {
              var temp = get.order({ name });
              if (temp > max) {
                max = temp;
              }
            }
          }
          if (max > 0) {
            max += 0.3;
          }
          return max;
        }
        return 4;
      }
    }
  },
  olyajiao: {
    audio: "reyajiao",
    trigger: {
      player: "loseAfter",
      global: "loseAsyncAfter"
    },
    frequent: true,
    filter(event, player) {
      if (player == _status.currentPhase) {
        return false;
      }
      return ["useCard", "respond"].includes(event.getParent().name) && event.getl(player)?.hs?.length;
    },
    async content(event, trigger, player) {
      const cards2 = get.cards(1, true);
      await player.showCards(cards2, get.translation(player) + "发动了【涯角】", true).set("type", get.type2(trigger.getParent().card)).set("clearArena", false).set("removeHighlight", false).set("callback", async (event2, trigger2, player2) => {
        const { cards: cards3 } = event2;
        const [card] = cards3;
        const evt = event2.getParent();
        const { type, videoId, highlightRemove } = evt;
        if (get.type2(card) == type) {
          const result = await player2.chooseTarget("涯角：选择获得此牌的角色").set("ai", function(target) {
            var att = get.attitude(_status.event.player, target);
            if (_status.event.du) {
              if (target.hasSkillTag("nodu")) {
                return 0;
              }
              return -att;
            }
            if (att > 0) {
              return att + Math.max(0, 5 - target.countCards("h"));
            }
            return att;
          }).set("du", get.name(card) == "du").forResult();
          highlightRemove();
          if (result?.bool && result.targets?.length) {
            const {
              targets: [target]
            } = result;
            player2.line(target, "green");
            await target.gain(cards3, "gain2");
          }
        } else {
          const result = await player2.chooseTarget("涯角：是否弃置攻击范围内包含你的一名角色区域内的一张牌？", function(card2, player3, target) {
            return target.inRange(player3) && target.countDiscardableCards(player3, "hej") > 0;
          }).set("ai", function(target) {
            var player3 = _status.event.player;
            return get.effect(target, { name: "guohe" }, player3, player3);
          }).forResult();
          highlightRemove();
          if (result?.bool && result.targets?.length) {
            const {
              targets: [target]
            } = result;
            player2.line(target, "green");
            await player2.discardPlayerCard(target, "hej", true);
          }
        }
        game.broadcastAll(ui.clear);
        game.addVideo("judge2", null, videoId);
        if (cards3.someInD()) {
          await game.cardsGotoPile(cards3.filterInD(), "insert");
        }
      });
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (get.tag(card, "respond") && target.countCards("h") > 1) {
            return [1, 0.2];
          }
        }
      }
    }
  },
  olpaoxiao: {
    audio: "paoxiao",
    audioname: ["re_zhangfei", "xiahouba", "re_guanzhang"],
    audioname2: { guanzhang: "paoxiao_guanzhang", ol_guanzhang: "paoxiao_ol_guanzhang" },
    trigger: { player: "shaMiss" },
    forced: true,
    async content(event, trigger, player) {
      player.addTempSkill("olpaoxiao2");
      player.addMark("olpaoxiao2", 1, false);
    },
    mod: {
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return Infinity;
        }
      }
    }
  },
  olpaoxiao2: {
    trigger: { source: "damageBegin1" },
    forced: true,
    audio: "paoxiao",
    audioname: ["re_zhangfei", "xiahouba", "re_guanzhang"],
    audioname2: { guanzhang: "paoxiao_guanzhang", ol_guanzhang: "paoxiao_ol_guanzhang" },
    sourceSkill: "olpaoxiao",
    filter(event, player) {
      return event.card && event.card.name == "sha" && player.countMark("olpaoxiao2") > 0;
    },
    onremove: true,
    async content(event, trigger, player) {
      trigger.num += player.countMark("olpaoxiao2");
      player.removeSkill("olpaoxiao2");
    },
    intro: { content: "本回合内下一次使用【杀】造成伤害时令伤害值+#" }
  },
  paoxiao_ol_guanzhang: { audio: 1 },
  oltishen: {
    audio: "retishen",
    skillAnimation: true,
    animationColor: "soil",
    limited: true,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return player.isDamaged();
    },
    check(event, player) {
      if (player.hp <= 2 || player.getDamagedHp() > 2) {
        return true;
      }
      if (player.getDamagedHp() <= 1) {
        return false;
      }
      return player.getDamagedHp() < game.roundNumber;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const num = player.getDamagedHp(true);
      await player.recover(num);
      await player.draw(num);
    }
  },
  rexuanfeng: {
    audio: "xuanfeng",
    audioname: ["boss_lvbu3", "re_lingtong"],
    audioname2: { re_heqi: "fenwei_heqi" },
    trigger: {
      player: ["loseAfter", "phaseDiscardEnd"],
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    filter(event, player) {
      if (!game.hasPlayer(function(current) {
        return current != player && current.countCards("he") > 0;
      })) {
        return false;
      }
      if (event.name == "phaseDiscard") {
        var cards2 = [];
        player.getHistory("lose", function(evt2) {
          if (evt2 && evt2.type == "discard" && evt2.getParent("phaseDiscard") == event && evt2.hs) {
            cards2.addArray(evt2.hs);
          }
        });
        return cards2.length > 1;
      }
      var evt = event.getl(player);
      return evt && evt.es && evt.es.length > 0;
    },
    async cost(event, trigger, player) {
      const list = ["弃置至多两名其他角色的合计两张牌"];
      const choices = ["选项一"];
      if (player.canMoveCard(
        null,
        true,
        game.filterPlayer((target) => target != player),
        game.filterPlayer((target) => target != player)
      )) {
        list.push("将一名其他角色装备区内的一张牌移动到另一名角色的装备区内");
        choices.push("选项二");
      }
      if (list.length > 1 && player.countEnabledSlot()) {
        list.push("背水：废除你的一个装备栏");
        choices.push("背水！");
      }
      choices.push("cancel2");
      const result = await player.chooseControl(choices).set("choiceList", list).set("prompt", get.prompt(event.skill)).set("ai", function() {
        if (get.player().canMoveCard(
          null,
          true,
          game.filterPlayer((target) => target != player),
          game.filterPlayer((target) => target != player)
        )) {
          return 1;
        }
        return 0;
      }).forResult();
      if (result?.control != "cancel2") {
        event.result = {
          bool: true,
          cost_data: result.index
        };
      }
    },
    async content(event, trigger, player) {
      const index = event.cost_data;
      if (index % 2 == 0) {
        for (let i = 0; i < 2; i++) {
          const result = await player.chooseTarget("弃置一名其他角色的一张牌", function(card, player2, target) {
            if (player2 == target) {
              return false;
            }
            return target.countDiscardableCards(player2, "he");
          }).set("ai", function(target) {
            return -get.attitude(_status.event.player, target);
          }).forResult();
          if (result?.bool && result.targets?.length) {
            player.line(result.targets[0], "green");
            await player.discardPlayerCard(result.targets[0], "he", true);
          }
        }
      }
      if (index > 0 && player.canMoveCard(
        null,
        true,
        game.filterPlayer((target) => target != player),
        game.filterPlayer((target) => target != player)
      )) {
        await player.moveCard(
          true,
          game.filterPlayer((target) => target != player),
          game.filterPlayer((target) => target != player)
        ).set("noJudge", true);
      }
      if (index == 2) {
        await player.chooseToDisable();
      }
    },
    ai: {
      effect: {
        target(card, player, target, current) {
          if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) {
            return [1, 3];
          }
        }
      },
      reverseEquip: true,
      noe: true
    }
  },
  reyongjin: {
    audio: "yongjin",
    trigger: {
      global: "phaseAnyEnd"
    },
    filter(event, player) {
      const count = (current) => {
        let cards2 = [];
        current.getHistory("lose", (evt) => {
          if (evt.getParent(event.name) == event) {
            cards2.addArray(evt.cards2);
          }
        });
        return cards2.length;
      };
      const num = count(player), card = new lib.element.VCard({ name: "sha", isCard: true });
      return num > 0 && game.hasPlayer((current) => {
        return count(current) == num && player.canUse(card, current, false);
      });
    },
    async cost(event, trigger, player) {
      const count = (current) => {
        let cards2 = [];
        current.getHistory("lose", (evt) => {
          if (evt.getParent(trigger.name) == trigger) {
            cards2.addArray(evt.cards2);
          }
        });
        return cards2.length;
      };
      const num = count(player), card = new lib.element.VCard({ name: "sha", isCard: true });
      const targets = game.filterPlayer((current) => {
        return count(current) == num && player.canUse(card, current, false);
      });
      event.result = await player.chooseTarget(
        get.prompt2(event.skill),
        (card2, player2, target) => {
          return get.event().targetx.includes(target);
        },
        [1, Infinity]
      ).set("targetx", targets).set("ai", (target) => {
        const card2 = new lib.element.VCard({ name: "sha", isCard: true }), player2 = get.player();
        return get.effect(target, card2, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const card = new lib.element.VCard({ name: "sha", storage: { reyongjin: true }, isCard: true }), targets = event.targets.filter((target) => player.canUse(card, target, false));
      if (!targets.length) {
        return;
      }
      const skill = "reyongjin_effect";
      player.addSkill(skill);
      const next = player.useCard(card, targets, false);
      player.markAuto(skill, next);
      await next;
    },
    subSkill: {
      effect: {
        trigger: {
          player: "useCardAfter",
          source: "damageSource"
        },
        charlotte: true,
        filter(event, player) {
          const evt = event.name == "damage" ? event.getParent(2) : event;
          return player.getStorage("reyongjin_effect").includes(evt);
        },
        async cost(event, trigger, player) {
          if (trigger.name == "useCard") {
            player.unmarkAuto(event.skill, trigger);
            return;
          }
          event.result = {
            bool: true
          };
        },
        async content(event, trigger, player) {
          const slots = Array.from(Array(13)).map((v, i) => `equip${parseFloat(i + 1)}`).filter((i) => player.hasDisabledSlot(i));
          if (slots.length) {
            const slot = slots.randomGet();
            await player.enableEquip(slot);
            return;
          }
          const card = get.discardPile((card2) => get.type(card2) == "equip" && player.canEquip(card2) && !get.tag(card2, "gifts"));
          if (card) {
            player.$gain2(card, false);
            await player.equip(card);
          }
        }
      }
    }
  },
  rechunlao: {
    trigger: { player: "phaseUseEnd" },
    audio: 2,
    filter(event, player) {
      return player.countCards("h") > 0 && (_status.connectMode || player.countCards("h", "sha") > 0) && !player.hasExpansions("rechunlao");
    },
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill) {
      var cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard({
        selectCard: [1, Math.max(1, player.countCards("h", "sha"))],
        prompt: get.prompt(event.skill),
        prompt2: '将任意张【杀】置于武将牌上作为"醇"',
        filterCard(card) {
          return get.name(card) == "sha";
        },
        allowChooseAll: true
      }).set("ai", function() {
        return 1;
      }).forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      await player.addToExpansion({ cards: cards2, animate: "giveAuto", gaintag: [event.name] });
    },
    ai: {
      threaten: 1.4
    },
    group: "rechunlao2"
  },
  rechunlao2: {
    enable: "chooseToUse",
    sourceSkill: "rechunlao",
    filter(event, player) {
      return event.type == "dying" && event.dying && event.dying.hp <= 0 && player.getExpansions("rechunlao").length > 0;
    },
    filterTarget(card, player, target) {
      return target == _status.event.dying;
    },
    direct: true,
    delay: false,
    selectTarget: -1,
    async content(event, trigger, player) {
      const target = event.targets[0];
      const result = await player.chooseCardButton(get.translation("rechunlao"), player.getExpansions("rechunlao"), true).forResult();
      if (result.bool) {
        player.logSkill("rechunlao");
        event.type = "dying";
        await player.loseToDiscardpile(result.links);
        await target.useCard({ name: "jiu", isCard: true }, target);
        const natures = get.natureList(result.links[0]);
        if (natures.includes("fire")) {
          await player.recover();
        }
        if (natures.includes("thunder")) {
          await player.draw(2);
        }
      }
    },
    ai: {
      order: 6,
      skillTagFilter(player) {
        return player.getExpansions("rechunlao").length > 0;
      },
      save: true,
      result: {
        target: 3
      },
      threaten: 1.6
    }
  },
  reluoying: {
    audio: 2,
    audioname: ["dc_caozhi", "ol_caozhi"],
    group: ["reluoying_discard", "reluoying_judge"],
    subfrequent: ["judge"],
    subSkill: {
      discard: {
        audio: "reluoying",
        audioname: ["dc_caozhi", "ol_caozhi"],
        trigger: { global: ["loseAfter", "loseAsyncAfter"] },
        filter(event, player) {
          if (event.type != "discard" || event.getlx === false) {
            return false;
          }
          var cards2 = event.cards.slice(0);
          var evt = event.getl(player);
          if (evt && evt.cards) {
            cards2.removeArray(evt.cards);
          }
          for (var i = 0; i < cards2.length; i++) {
            if (cards2[i].original != "j" && get.suit(cards2[i], event.player) == "club" && get.position(cards2[i], true) == "d") {
              return true;
            }
          }
          return false;
        },
        direct: true,
        async content(event, trigger, player) {
          if (trigger.delay == false) {
            await game.delay();
          }
          var cards2 = [], cards22 = trigger.cards.slice(0), evt = trigger.getl(player);
          if (evt && evt.cards) {
            cards22.removeArray(evt.cards);
          }
          for (var i = 0; i < cards22.length; i++) {
            if (cards22[i].original != "j" && get.suit(cards22[i], trigger.player) == "club" && get.position(cards22[i], true) == "d") {
              cards2.push(cards22[i]);
            }
          }
          let result;
          if (cards2.length) {
            result = await player.chooseButton(["落英：选择要获得的牌", cards2], [1, cards2.length]).set("ai", function(button) {
              return get.value(button.link, _status.event.player, "raw");
            }).forResult();
          }
          if (result && result.bool) {
            player.logSkill(event.name);
            await player.gain(result.links, "gain2", "log");
          }
        }
      },
      judge: {
        audio: "reluoying",
        audioname: ["dc_caozhi", "ol_caozhi"],
        trigger: { global: "cardsDiscardAfter" },
        direct: true,
        filter(event, player) {
          var evt = event.getParent().relatedEvent;
          if (!evt || evt.name != "judge") {
            return;
          }
          if (evt.player == player) {
            return false;
          }
          if (get.position(event.cards[0], true) != "d") {
            return false;
          }
          return get.suit(event.cards[0]) == "club";
        },
        async content(event, trigger, player) {
          const result = await player.chooseButton(["落英：选择要获得的牌", trigger.cards], [1, trigger.cards.length]).set("ai", function(button) {
            return get.value(button.link, _status.event.player, "raw");
          }).forResult();
          if (result.bool) {
            player.logSkill(event.name);
            await player.gain(result.links, "gain2", "log");
          }
        }
      }
    }
  },
  chengzhang: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    derivation: "rejiushi_mark",
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "water",
    filter(event, player) {
      var num = 0;
      player.getAllHistory("sourceDamage", function(evt) {
        num += evt.num;
      });
      if (num >= 7) {
        return true;
      }
      player.getAllHistory("damage", function(evt) {
        num += evt.num;
      });
      return num >= 7;
    },
    async content(event, trigger, player) {
      player.markSkill("rejiushi_mark");
      player.awakenSkill(event.name);
      player.storage.chengzhang = true;
      await player.recover();
      await player.draw();
    },
    ai: {
      combo: "rejiushi"
    }
  },
  rejiushi: {
    audio: 2,
    group: ["rejiushi1", "rejiushi3", "rejiushi_gain"],
    subfrequent: ["gain"],
    subSkill: {
      gain: {
        audio: "rejiushi",
        trigger: { player: "turnOverAfter" },
        frequent: true,
        filter(event, player) {
          return player.storage.chengzhang == true;
        },
        prompt: "是否发动【酒诗】，从牌堆中随机获得一张锦囊牌？",
        async content(event, trigger, player) {
          const card = get.cardPile2((card2) => get.type2(card2) == "trick", "random");
          if (card) {
            await player.gain(card, "gain2", "log");
          }
        }
      }
    }
  },
  rejiushi1: {
    hiddenCard(player, name) {
      if (name == "jiu") {
        return !player.isTurnedOver();
      }
      return false;
    },
    audio: "rejiushi",
    enable: "chooseToUse",
    sourceSkill: "rejiushi",
    filter(event, player) {
      if (player.classList.contains("turnedover")) {
        return false;
      }
      return event.filterCard({ name: "jiu", isCard: true }, player, event);
    },
    async content(event, trigger, player) {
      if (_status.event.getParent(2).type == "dying") {
        event.dying = player;
        event.type = "dying";
      }
      await player.turnOver();
      await player.useCard({ name: "jiu", isCard: true }, player);
    },
    ai: {
      save: true,
      skillTagFilter(player, tag, arg) {
        return !player.isTurnedOver() && _status.event?.dying == player;
      },
      order: 5,
      result: {
        player(player) {
          if (_status.event.parent.name == "phaseUse") {
            if (player.countCards("h", "jiu") > 0) {
              return 0;
            }
            if (player.getEquip("zhuge") && player.countCards("h", "sha") > 1) {
              return 0;
            }
            if (!player.countCards("h", "sha")) {
              return 0;
            }
            var targets = [];
            var target;
            var players = game.filterPlayer();
            for (var i = 0; i < players.length; i++) {
              if (get.attitude(player, players[i]) < 0) {
                if (player.canUse("sha", players[i], true, true)) {
                  targets.push(players[i]);
                }
              }
            }
            if (targets.length) {
              target = targets[0];
            } else {
              return 0;
            }
            var num = get.effect(target, { name: "sha" }, player, player);
            for (var i = 1; i < targets.length; i++) {
              var num2 = get.effect(targets[i], { name: "sha" }, player, player);
              if (num2 > num) {
                target = targets[i];
                num = num2;
              }
            }
            if (num <= 0) {
              return 0;
            }
            var e2 = target.getEquip(2);
            if (e2) {
              if (e2.name == "tengjia") {
                if (!player.countCards("h", { name: "sha", nature: "fire" }) && !player.getEquip("zhuque")) {
                  return 0;
                }
              }
              if (e2.name == "renwang") {
                if (!player.countCards("h", { name: "sha", color: "red" })) {
                  return 0;
                }
              }
              if (e2.name == "baiyin") {
                return 0;
              }
            }
            if (player.getEquip("guanshi") && player.countCards("he") > 2) {
              return 1;
            }
            return target.countCards("h") > 3 ? 0 : 1;
          }
          if (player == _status.event.dying || player.isTurnedOver()) {
            return 3;
          }
        }
      },
      effect: {
        target(card, player, target) {
          if (target.isTurnedOver()) {
            if (get.tag(card, "damage")) {
              if (player.hasSkillTag("jueqing", false, target)) {
                return [1, -2];
              }
              if (target.hp == 1) {
                return;
              }
              return [1, target.countCards("h") / 2];
            }
          }
        }
      }
    }
  },
  rejiushi3: {
    audio: "rejiushi",
    trigger: { player: "damageEnd" },
    sourceSkill: "rejiushi",
    check(event, player) {
      return player.isTurnedOver();
    },
    filter(event, player) {
      if (player.hasHistory("useCard", (evt) => {
        if (evt.card.name != "jiu" || evt.getParent().name != "rejiushi1") {
          return false;
        }
        return evt.getParent("damage", true) == event;
      })) {
        return false;
      }
      return player.isTurnedOver();
    },
    prompt(event, player) {
      var str = "是否发动【酒诗】，将武将牌翻面";
      if (!player.storage.chengzhang) {
        str += "，并获得牌堆中的一张锦囊牌";
      }
      str += "？";
      return str;
    },
    async content(event, trigger, player) {
      await player.turnOver();
      if (!player.storage.chengzhang) {
        const card = get.cardPile2((card2) => get.type2(card2) == "trick");
        if (card) {
          await player.gain(card, "gain2", "log");
        }
      }
    }
  },
  rejiushi_mark: {
    mark: true,
    marktext: "改",
    intro: {
      content: "当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。当你受到伤害后，若你的武将牌于受到伤害时背面向上，你可以翻面。当你翻面时，你获得牌堆中的一张随机锦囊牌。"
    }
  },
  rehongyan: {
    audio: 2,
    mod: {
      suit(card, suit) {
        if (suit == "spade") {
          return "heart";
        }
      }
    },
    trigger: { player: "loseEnd" },
    filter(event, player) {
      if (player == _status.currentPhase || !event.visible || player.hp <= player.countCards("h")) {
        return false;
      }
      for (var i = 0; i < event.cards2.length; i++) {
        if (get.suit(event.cards2[i], player) == "heart") {
          return true;
        }
      }
      return false;
    },
    frequent: true,
    async content(event, trigger, player) {
      await player.draw();
    }
  },
  reqimou: {
    limited: true,
    audio: 2,
    enable: "phaseUse",
    skillAnimation: true,
    animationColor: "orange",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const result = await player.chooseNumbers(get.prompt(event.name), [{ prompt: "请选择你要失去的体力值", min: 1, max: player.getHp() }], true).set("processAI", () => {
        const player2 = get.player();
        let num = player2.getHp() - 1;
        if (player2.countCards("hs", { name: ["tao", "jiu"] })) {
          num = player2.getHp();
        }
        return [num];
      }).forResult();
      const number = result.numbers[0];
      player.storage.reqimou2 = number;
      await player.loseHp(number);
      await player.draw(number);
      player.addTempSkill("reqimou2");
    },
    ai: {
      order: 14,
      result: {
        player(player) {
          if (player.hp < 3) {
            return false;
          }
          var mindist = player.hp;
          if (player.countCards("hs", (card) => player.canSaveCard(card, player))) {
            mindist++;
          }
          if (game.hasPlayer(function(current) {
            return get.distance(player, current) <= mindist && player.canUse("sha", current, false) && get.effect(current, { name: "sha" }, player, player) > 0;
          })) {
            return 1;
          }
          return 0;
        }
      }
    }
  },
  reqimou2: {
    onremove: true,
    mod: {
      cardUsable(card, player, num) {
        if (typeof player.storage.reqimou2 == "number" && card.name == "sha") {
          return num + player.storage.reqimou2;
        }
      },
      globalFrom(from, to, distance) {
        if (typeof from.storage.reqimou2 == "number") {
          return distance - from.storage.reqimou2;
        }
      }
    }
  },
  olniepan: {
    audio: 2,
    enable: "chooseToUse",
    skillAnimation: true,
    limited: true,
    animationColor: "orange",
    filter(event, player) {
      if (event.type == "dying") {
        if (player != event.dying) {
          return false;
        }
        return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      player.storage.olniepan = true;
      await player.discard(player.getCards("hej"));
      await player.link(false);
      await player.turnOver(false);
      await player.draw(3);
      if (player.hp < 3) {
        await player.recover(3 - player.hp);
      }
      const result = await player.chooseControl("bazhen", "olhuoji", "olkanpo").set("prompt", "选择获得一个技能").set("ai", () => {
        let player2 = get.event().player, threaten = get.threaten(player2);
        if (!player2.hasEmptySlot(2)) {
          return "olhuoji";
        }
        if (threaten < 0.8) {
          return "olkanpo";
        }
        if (threaten < 1.6) {
          return "bazhen";
        }
        return ["olhuoji", "bazhen"].randomGet();
      }).forResult();
      player.addSkills(result.control);
    },
    derivation: ["bazhen", "olhuoji", "olkanpo"],
    ai: {
      order: 1,
      skillTagFilter(player, tag, target) {
        if (player != target || player.storage.olniepan) {
          return false;
        }
      },
      save: true,
      result: {
        player(player) {
          if (player.hp <= 0) {
            return 10;
          }
          if (player.hp <= 2 && player.countCards("he") <= 1) {
            return 10;
          }
          return 0;
        }
      },
      threaten(player, target) {
        if (!target.storage.olniepan) {
          return 0.6;
        }
      }
    }
  },
  rewurong: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    filterTarget(card, player, target) {
      return target != player && target.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      const { target } = event;
      if (target.countCards("h") == 0 || player.countCards("h") == 0) {
        return;
      }
      const sendback = function() {
        if (_status.event != event) {
          return function() {
            event.resultOL = _status.event.resultOL;
          };
        }
      };
      if (player.isOnline()) {
        player.wait(sendback);
        event.ol = true;
        player.send(function() {
          game.me.chooseCard(true).set("glow_result", true).ai = function() {
            return Math.random();
          };
          game.resume();
        });
      } else {
        event.localPlayer = true;
        const hasShan = !target.countCards("h", "shan");
        player.chooseCard(true).set("glow_result", true).ai = function(card) {
          if (hasShan && get.name(card) == "sha") {
            return 1;
          }
          return Math.random();
        };
      }
      if (target.isOnline()) {
        target.wait(sendback);
        event.ol = true;
        target.send(function() {
          const rand = Math.random() < 0.4;
          game.me.chooseCard(true).set("glow_result", true).set("ai", function(card) {
            if (rand) {
              return card.name == "shan" ? 1 : 0;
            }
            return card.name == "shan" ? 0 : 1;
          });
          game.resume();
        });
      } else {
        event.localTarget = true;
      }
      let result;
      if (event.localPlayer) {
        result = await player.chooseCard(true).set("glow_result", true).set("ai", function(card) {
          if (!target.countCards("h", "shan") && get.name(card) == "sha") {
            return 1;
          }
          return Math.random();
        }).forResult();
        event.card1 = result.cards[0];
      }
      if (event.localTarget) {
        const rand = Math.random() < 0.4;
        result = await target.chooseCard(true).set("glow_result", true).set("ai", function(card) {
          if (rand) {
            return card.name == "shan" ? 1 : 0;
          }
          return card.name == "shan" ? 0 : 1;
        }).forResult();
        event.card2 = result.cards[0];
      }
      if (!event.resultOL && event.ol) {
        game.pause();
      }
      try {
        if (!event.card1) {
          event.card1 = event.resultOL[player.playerid].cards[0];
        }
        if (!event.card2) {
          event.card2 = event.resultOL[target.playerid].cards[0];
        }
        if (!event.card1 || !event.card2) {
          throw new Error("err");
        }
      } catch (e) {
        console.log(e);
        return;
      }
      game.broadcastAll(
        function(card1, card2) {
          card1.classList.remove("glow");
          card2.classList.remove("glow");
        },
        event.card1,
        event.card2
      );
      game.broadcastAll(function() {
        ui.arena.classList.add("thrownhighlight");
      });
      game.addVideo("thrownhighlight1");
      player.$compare(event.card1, target, event.card2);
      game.delay(4);
      let next = game.createEvent("showCards");
      next.player = player;
      next.cards = [event.card1];
      next.setContent("emptyEvent");
      game.log(player, "展示了", event.card1);
      next = game.createEvent("showCards");
      next.player = target;
      next.cards = [event.card2];
      next.setContent("emptyEvent");
      game.log(target, "展示了", event.card2);
      const name1 = get.name(event.card1);
      const name2 = get.name(event.card2);
      if (name1 == "sha" && name2 != "shan") {
        target.$gain2(event.card2);
        const clone = event.card1.clone;
        if (clone) {
          clone.style.transition = "all 0.5s";
          clone.style.transform = "scale(1.2)";
          clone.delete();
          game.addVideo("deletenode", player, get.cardsInfo([clone]));
        }
        game.broadcast(function(card) {
          const clone2 = card.clone;
          if (clone2) {
            clone2.style.transition = "all 0.5s";
            clone2.style.transform = "scale(1.2)";
            clone2.delete();
          }
        }, event.card1);
        await target.damage("nocard");
      } else if (name1 != "sha" && name2 == "shan") {
        target.$gain2(event.card2);
        const clone = event.card1.clone;
        if (clone) {
          clone.style.transition = "all 0.5s";
          clone.style.transform = "scale(1.2)";
          clone.delete();
          game.addVideo("deletenode", player, get.cardsInfo([clone]));
        }
        game.broadcast(function(card) {
          const clone2 = card.clone;
          if (clone2) {
            clone2.style.transition = "all 0.5s";
            clone2.style.transform = "scale(1.2)";
            clone2.delete();
          }
        }, event.card1);
        await player.gainPlayerCard(target, true, "he");
      } else {
        player.$gain2(event.card1);
        target.$gain2(event.card2);
      }
      game.broadcastAll(function() {
        ui.arena.classList.remove("thrownhighlight");
      });
      game.addVideo("thrownhighlight2");
    },
    ai: {
      order: 6,
      result: {
        target: -1
      }
    }
  },
  cangzhuo: {
    trigger: { player: "phaseDiscardBegin" },
    frequent: true,
    audio: 2,
    filter(event, player) {
      return player.getHistory("useCard", function(card) {
        return get.type(card.card, "trick") == "trick";
      }).length == 0;
    },
    async content(event, trigger, player) {
      player.addTempSkill("cangzhuo2");
    }
  },
  cangzhuo2: {
    mod: {
      ignoredHandcard(card, player) {
        if (get.type(card, "trick") == "trick") {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name == "phaseDiscard" && get.type(card, "trick") == "trick") {
          return false;
        }
      }
    }
  },
  shebian: {
    audio: 2,
    trigger: { player: "turnOverEnd" },
    check(event, player) {
      return player.canMoveCard(true, true);
    },
    filter(event, player) {
      return player.canMoveCard(null, true);
    },
    async content(event, trigger, player) {
      await player.moveCard().set("nojudge", true);
    }
  },
  rexianzhen: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return player.canCompare(target);
    },
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      const target = event.target;
      const result = await player.chooseToCompare(target).forResult();
      if (result.player && get.name(result.player, player) == "sha") {
        player.addTempSkill("rexianzhen4");
      }
      if (result.bool) {
        player.storage[event.name] = target;
        player.addTempSkill(event.name + 2);
      } else {
        player.addTempSkill(event.name + 3);
      }
    },
    ai: {
      order(name, player) {
        var cards2 = player.getCards("h");
        if (player.countCards("h", "sha") == 0) {
          return 1;
        }
        for (var i = 0; i < cards2.length; i++) {
          if (cards2[i].name != "sha" && get.number(cards2[i]) > 11 && get.value(cards2[i]) < 7) {
            return 9;
          }
        }
        return get.order({ name: "sha" }) - 1;
      },
      result: {
        player(player) {
          if (player.countCards("h", "sha") > 0) {
            return 0;
          }
          var num = player.countCards("h");
          if (num > player.hp) {
            return 0;
          }
          if (num == 1) {
            return -2;
          }
          if (num == 2) {
            return -1;
          }
          return -0.7;
        },
        target(player, target) {
          var num = target.countCards("h");
          if (num == 1) {
            return -1;
          }
          if (num == 2) {
            return -0.7;
          }
          return -0.5;
        }
      },
      threaten: 1.3
    }
  },
  rexianzhen2: {
    charlotte: true,
    mod: {
      targetInRange(card, player, target) {
        if (target == player.storage.rexianzhen) {
          return true;
        }
      },
      cardUsableTarget(card, player, target) {
        if (target == player.storage.rexianzhen) {
          return true;
        }
      }
    },
    ai: {
      unequip: true,
      skillTagFilter(player, tag, arg) {
        if (arg.target != player.storage.rexianzhen) {
          return false;
        }
      }
    }
  },
  rexianzhen3: {
    charlotte: true,
    mod: {
      cardEnabled(card) {
        if (card.name == "sha") {
          return false;
        }
      }
    }
  },
  rexianzhen4: {
    mod: {
      ignoredHandcard(card, player) {
        if (get.name(card) == "sha") {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name == "phaseDiscard" && get.name(card) == "sha") {
          return false;
        }
      }
    }
  },
  rejinjiu: {
    mod: {
      cardname(card, player) {
        if (card.name == "jiu") {
          return "sha";
        }
      }
    },
    ai: {
      skillTagFilter(player) {
        if (!player.countCards("h", "jiu")) {
          return false;
        }
      },
      respondSha: true
    },
    audio: 2,
    trigger: { player: ["useCard1", "respond"] },
    firstDo: true,
    forced: true,
    filter(event, player) {
      return event.card.name == "sha" && !event.skill && event.cards.length == 1 && event.cards[0].name == "jiu";
    },
    async content(event, trigger, player) {
    },
    group: "rejinjiu2",
    global: "rejinjiu3"
  },
  rejinjiu3: {
    mod: {
      cardEnabled(card, player) {
        if (card.name == "jiu" && _status.currentPhase && _status.currentPhase != player && _status.currentPhase.hasSkill("rejinjiu")) {
          return false;
        }
      },
      cardSavable(card, player) {
        if (card.name == "jiu" && _status.currentPhase && _status.currentPhase != player && _status.currentPhase.hasSkill("rejinjiu")) {
          return false;
        }
      }
    }
  },
  rejinjiu2: {
    audio: "rejinjiu",
    forced: true,
    trigger: { player: "damageBegin3" },
    sourceSkill: "rejinjiu",
    filter(event, player) {
      return event.getParent(2).jiu == true;
    },
    async content(event, trigger, player) {
      trigger.num -= trigger.getParent(2).jiu_add;
    },
    ai: {
      filterDamage: true,
      skillTagFilter(player, tag, arg) {
        return arg && arg.jiu == true;
      }
    }
  },
  repojun: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    direct: true,
    filter(event, player) {
      return event.card.name == "sha" && event.target.hp > 0 && event.target.countCards("he") > 0;
    },
    preHidden: true,
    async content(event, trigger, player) {
      var next = player.choosePlayerCard(trigger.target, "he", [1, Math.min(trigger.target.hp, trigger.target.countCards("he"))], get.prompt("repojun", trigger.target), "allowChooseAll");
      next.set("ai", function(button) {
        if (!_status.event.goon) {
          return 0;
        }
        var val = get.value(button.link);
        if (button.link == _status.event.target.getEquip(2)) {
          return 2 * (val + 3);
        }
        return val;
      });
      next.set("goon", get.attitude(player, trigger.target) <= 0);
      next.set("forceAuto", true);
      next.setHiddenSkill(event.name);
      const result = await next.forResult();
      if (result.bool) {
        const target = trigger.target;
        player.logSkill("repojun", target);
        target.addSkill("repojun2");
        const next2 = target.addToExpansion("giveAuto", result.cards, target);
        next2.gaintag.add("repojun2");
        await next2;
      }
    },
    ai: {
      unequip_ai: true,
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (get.attitude(player, arg.target) > 0) {
          return false;
        }
        if (tag == "directHit_ai") {
          return arg.target.hp >= Math.max(1, arg.target.countCards("h") - 1);
        }
        if (arg && arg.name == "sha" && arg.target.getEquip(2)) {
          return true;
        }
        return false;
      }
    },
    group: "repojun3"
  },
  repojun3: {
    audio: "repojun",
    trigger: { source: "damageBegin1" },
    sourceSkill: "repojun",
    filter(event, player) {
      var target = event.player;
      return event.card && event.card.name == "sha" && player.countCards("h") >= target.countCards("h") && player.countCards("e") >= target.countCards("e");
    },
    forced: true,
    locked: false,
    logTarget: "player",
    preHidden: true,
    check(event, player) {
      return get.attitude(player, event.player) < 0;
    },
    async content(event, trigger, player) {
      trigger.num++;
    }
  },
  repojun2: {
    trigger: { global: "phaseEnd" },
    forced: true,
    popup: false,
    charlotte: true,
    sourceSkill: "repojun",
    filter(event, player) {
      return player.getExpansions("repojun2").length > 0;
    },
    async content(event, trigger, player) {
      const cards2 = player.getExpansions("repojun2");
      if (cards2.length) {
        await player.gain(cards2, "draw");
      }
      game.log(player, "收回了" + get.cnNumber(cards2.length) + "张“破军”牌");
      player.removeSkill("repojun2");
    },
    intro: {
      markcount: "expansion",
      mark(dialog, storage, player) {
        var cards2 = player.getExpansions("repojun2");
        if (player.isUnderControl(true)) {
          dialog.addAuto(cards2);
        } else {
          return "共有" + get.cnNumber(cards2.length) + "张牌";
        }
      }
    }
  },
  sishu: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill)).set("ai", (target) => {
        const att = get.attitude(get.player(), target);
        if (target.countMark("sishu2") % 2 == 1) {
          return -att;
        }
        return att;
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      target.addSkill("sishu_reverse");
      target.addMark("sishu_reverse", 1, false);
    },
    subSkill: {
      reverse: {
        charlotte: true,
        onremove: true,
        marktext: "思",
        intro: {
          name: "思蜀",
          content: "本局游戏内计算【乐不思蜀】的效果时反转#次"
        },
        trigger: {
          player: "judgeBefore"
        },
        filter(event, player) {
          return event.card?.name == "lebu";
        },
        firstDo: true,
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          trigger.judgeFromSishu = trigger.judge;
          trigger.judge = function(card) {
            const { player: player2, judgeFromSishu } = this;
            let result = judgeFromSishu(card);
            if (player2.countMark("sishu_reverse") % 2 == 1) {
              result *= -1;
            }
            return result;
          };
        }
      }
    }
  },
  sishu2: {
    charlotte: true,
    marktext: "思",
    intro: {
      name: "思蜀",
      content: "本局游戏内计算【乐不思蜀】的效果时反转#次"
    },
    mod: {
      judge(player, result) {
        if (_status.event.cardname == "lebu" && player.countMark("sishu2") % 2 == 1) {
          if (result.bool == false) {
            result.bool = true;
          } else {
            result.bool = false;
          }
        }
      }
    }
  },
  olruoyu: {
    skillAnimation: true,
    animationColor: "fire",
    audio: 2,
    juexingji: true,
    zhuSkill: true,
    keepSkill: true,
    derivation: ["rejijiang", "sishu"],
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      if (!player.hasZhuSkill("olruoyu")) {
        return false;
      }
      return player.isMinHp();
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.gainMaxHp();
      if (player.hp < 3) {
        await player.recover(3 - player.hp);
      }
      player.addSkills(["sishu", "rejijiang"]);
    }
  },
  olfangquan: {
    audio: 2,
    audioname2: { shen_caopi: "olfangquan_shen_caopi" },
    trigger: { player: "phaseUseBefore" },
    filter(event, player) {
      return player.countCards("h") > 0 && !player.hasSkill("olfangquan3");
    },
    direct: true,
    async content(event, trigger, player) {
      var fang = player.countMark("olfangquan2") == 0 && player.hp >= 2 && player.countCards("h") <= player.hp + 2;
      const result = await player.chooseBool(get.prompt2("olfangquan")).set("ai", function() {
        if (!_status.event.fang) {
          return false;
        }
        return game.hasPlayer(function(target) {
          if (target.hasJudge("lebu") || target == player) {
            return false;
          }
          if (get.attitude(player, target) > 4) {
            return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1) > 0;
          }
          return false;
        });
      }).set("fang", fang).forResult();
      if (result.bool) {
        player.logSkill("olfangquan");
        trigger.cancel();
        player.addTempSkill("olfangquan2");
        player.addMark("olfangquan2", 1, false);
      }
    }
  },
  olfangquan2: {
    trigger: { player: "phaseDiscardBegin" },
    forced: true,
    popup: false,
    audio: false,
    onremove: true,
    sourceSkill: "olfangquan",
    async content(event, trigger, player) {
      event.count = player.countMark(event.name);
      player.removeMark(event.name, event.count, false);
      while (event.count > 0) {
        event.count--;
        const result = await player.chooseToDiscard("是否弃置一张手牌并令一名其他角色进行一个额外回合？").set("logSkill", "olfangquan").set("ai", (card) => {
          return 20 - get.value(card);
        }).forResult();
        if (result.bool) {
          const result2 = await player.chooseTarget(true, "请选择进行额外回合的目标角色", lib.filter.notMe).set("ai", (target2) => {
            if (target2.hasJudge("lebu")) {
              return -1;
            }
            if (get.attitude(player, target2) > 4) {
              return get.threaten(target2) / Math.sqrt(target2.hp + 1) / Math.sqrt(target2.countCards("h") + 1);
            }
            return -1;
          }).forResult();
          if (result2.bool) {
            var target = result2.targets[0];
            player.line(target, "fire");
            target.markSkillCharacter("olfangquan", player, "放权", "进行一个额外回合");
            target.insertPhase();
            target.addSkill("olfangquan3");
          }
        } else {
          break;
        }
      }
    }
  },
  olfangquan3: {
    trigger: { player: ["phaseAfter", "phaseCancelled"] },
    forced: true,
    popup: false,
    audio: false,
    sourceSkill: "olfangquan",
    async content(event, trigger, player) {
      player.unmarkSkill("olfangquan");
      player.removeSkill("olfangquan3");
    }
  },
  olluanji: {
    inherit: "luanji",
    audioname2: { shen_caopi: "olluanji_shen_caopi" },
    audio: 2,
    line: false,
    group: "olluanji_remove",
    check(card) {
      return 7 - get.value(card);
    }
  },
  olluanji_remove: {
    trigger: { player: "useCard2" },
    direct: true,
    sourceSkill: "olluanji",
    filter(event, player) {
      return event.card.name == "wanjian" && event.targets.length > 0;
    },
    line: false,
    async content(event, trigger, player) {
      const result = await player.chooseTarget(get.prompt("olluanji"), "为" + get.translation(trigger.card) + "减少一个目标", function(card, player2, target) {
        return _status.event.targets.includes(target);
      }).set("targets", trigger.targets).set("ai", function(target) {
        var player2 = _status.event.player;
        return -get.effect(target, _status.event.getTrigger().card, player2, player2);
      }).forResult();
      if (result.bool) {
        player.logSkill("olluanji", result.targets);
        trigger.targets.remove(result.targets[0]);
      }
    }
  },
  olxueyi: {
    audio: 2,
    trigger: { global: "phaseBefore", player: "enterGame" },
    forced: true,
    zhuSkill: true,
    filter(event, player) {
      return (event.name != "phase" || game.phaseNumber == 0) && player.hasZhuSkill("olxueyi");
    },
    async content(event, trigger, player) {
      const num = game.countPlayer((current) => current.group == "qun");
      if (num) {
        player.addMark("olxueyi", num * 2);
      }
    },
    marktext: "裔",
    intro: {
      name2: "裔",
      content: "mark"
    },
    mod: {
      maxHandcard(player, num) {
        if (player.hasZhuSkill("olxueyi")) {
          return num + player.countMark("olxueyi");
        }
      }
    },
    group: "olxueyi_draw",
    subSkill: {
      draw: {
        audio: "olxueyi",
        trigger: { player: "phaseUseBegin" },
        prompt2: "弃置一枚「裔」标记，然后摸一张牌",
        check(event, player) {
          return player.getUseValue("wanjian") > 0 || !player.needsToDiscard();
        },
        filter(event, player) {
          return player.hasZhuSkill("olxueyi") && player.hasMark("olxueyi");
        },
        async content(event, trigger, player) {
          player.removeMark("olxueyi", 1);
          await player.draw();
        }
      }
    }
  },
  olhunzi: {
    audio: 2,
    audioname: ["re_sunyi"],
    inherit: "hunzi",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.loseMaxHp();
      await player.addSkills(["reyingzi", "gzyinghun"]);
      player.addTempSkill("olhunzi_effect");
    },
    subSkill: {
      effect: {
        trigger: { player: "phaseJieshuBegin" },
        forced: true,
        popup: false,
        charlotte: true,
        async content(event, trigger, player) {
          await player.chooseDrawRecover(2, true);
        }
      }
    }
  },
  olzhiba: {
    audio: 2,
    zhuSkill: true,
    global: "olzhiba2"
  },
  olzhiba2: {
    ai: {
      order: 1,
      result: {
        target(player, target) {
          if (player.hasZhuSkill("olzhiba") && !player.hasSkill("olzhiba3") && target.group == "wu") {
            if (player.countCards("h", function(card) {
              var val = get.value(card);
              if (val < 0) {
                return true;
              }
              if (val <= 5) {
                return get.number(card) >= 12;
              }
              if (val <= 6) {
                return get.number(card) >= 13;
              }
              return false;
            }) > 0) {
              return -1;
            }
            return 0;
          } else {
            if (player.countCards("h", "du") && get.attitude(player, target) < 0) {
              return -1;
            }
            if (player.countCards("h") <= player.hp) {
              return 0;
            }
            var maxnum = 0;
            var cards2 = target.getCards("h");
            for (var i = 0; i < cards2.length; i++) {
              if (get.number(cards2[i]) > maxnum) {
                maxnum = get.number(cards2[i]);
              }
            }
            if (maxnum > 10) {
              maxnum = 10;
            }
            if (maxnum < 5 && cards2.length > 1) {
              maxnum = 5;
            }
            var cards3 = player.getCards("h");
            for (var i = 0; i < cards3.length; i++) {
              if (get.number(cards3[i]) < maxnum) {
                return 1;
              }
            }
            return 0;
          }
        }
      }
    },
    enable: "phaseUse",
    //usable:1,
    prompt: "请选择〖制霸〗的目标",
    filter(event, player) {
      if (player.hasZhuSkill("olzhiba") && !player.hasSkill("olzhiba3") && game.hasPlayer(function(current) {
        return current != player && current.group == "wu" && player.canCompare(current);
      })) {
        return true;
      }
      return player.group == "wu" && game.hasPlayer(function(current) {
        return current != player && current.hasZhuSkill("olzhiba", player) && !current.hasSkill("olzhiba3") && player.canCompare(current);
      });
    },
    filterTarget(card, player, target) {
      if (player.hasZhuSkill("olzhiba") && !player.hasSkill("olzhiba3") && target.group == "wu" && player.canCompare(target)) {
        return true;
      }
      return player.group == "wu" && target.hasZhuSkill("olzhiba", player) && !target.hasSkill("olzhiba3") && player.canCompare(target);
    },
    prepare(cards2, player, targets) {
      if (player.hasZhuSkill("olzhiba")) {
        player.logSkill("olzhiba");
      }
      if (targets[0].hasZhuSkill("olzhiba", player)) {
        targets[0].logSkill("olzhiba");
      }
    },
    direct: true,
    clearTime: true,
    async contentBefore(event, trigger, player) {
      const { targets } = event;
      const list = [];
      if (player.hasZhuSkill("olzhiba") && targets[0].group === "wu" && !player.hasSkill("olzhiba3")) {
        list.push(player);
      }
      if (player.group === "wu" && targets[0].hasZhuSkill("olzhiba") && !targets[0].hasSkill("olzhiba3")) {
        list.push(targets[0]);
      }
      let chooseRes;
      if (list.length === 1) {
        event.target = list[0];
      } else {
        chooseRes = await player.chooseTarget(true, "请选择获得所有拼点牌的角色", (card, pl, target2) => _status.event.list.includes(target2)).set("list", list).forResult();
        if (!chooseRes?.bool) {
          return;
        }
        event.target = chooseRes.targets[0];
      }
      const target = event.target;
      target.addTempSkill("olzhiba3", "phaseUseEnd");
      let acceptRes;
      if (target === targets[0]) {
        acceptRes = await target.chooseBool("是否接受来自" + get.translation(player) + "的拼点请求？").set(
          "choice",
          get.attitude(target, player) > 0 || target.countCards("h", (card) => {
            const val = get.value(card);
            if (val < 0) return true;
            if (val <= 5) return get.number(card) >= 12;
            if (val <= 6) return get.number(card) >= 13;
            return false;
          }) > 0
        ).set("ai", () => _status.event.choice).forResult();
      } else {
        acceptRes = { bool: true };
      }
      if (acceptRes.bool) {
        event.getParent().zhiba_target = target;
      } else {
        game.log(target, "拒绝了", player, "的拼点请求");
        target.chat("拒绝");
      }
    },
    async content(event, trigger, player) {
      const { target } = event;
      const parent = event.getParent();
      const source = parent?.zhiba_target;
      event.source = source;
      if (!source) {
        return;
      }
      const comp = player.chooseToCompare(target).set("small", target == source && get.attitude(player, target) > 0);
      comp.clear = false;
      const cmpResult = await comp.forResult();
      if (player === source && (cmpResult.bool || cmpResult.tie) || target === source && !cmpResult.bool) {
        event.cards = [cmpResult.player, cmpResult.target].filterInD("d");
        if (!event.cards.length) return;
        const ctrl = await source.chooseControl("ok", "cancel2").set("dialog", ["是否获得拼点牌？", event.cards]).set("ai", () => get.value(event.cards, source, "raw") > 0).forResult();
        if (ctrl.control !== "cancel2") {
          await source.gain(event.cards, "gain2", "log");
        } else {
          ui.clear();
        }
      } else {
        return;
      }
    }
  },
  olzhiba3: {},
  rehuashen: {
    unique: true,
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: ["enterGame", "phaseBegin", "phaseEnd"]
    },
    filter(event, player, name) {
      if (event.name != "phase") {
        return true;
      }
      if (name == "phaseBefore") {
        return game.phaseNumber == 0;
      }
      return player.storage.rehuashen?.character?.length > 0;
    },
    async cost(event, trigger, player) {
      if (trigger.name !== "phase" || event.triggername === "phaseBefore") {
        event.result = { bool: true, cost_data: ["替换当前化身"] };
        return;
      }
      const prompt = "###" + get.prompt(event.skill) + '###<div class="text center">替换当前化身牌或制衡至多两张其他化身牌</div>';
      const result = await player.chooseControl("替换当前化身", "制衡其他化身", "cancel2").set("ai", () => {
        const { player: player2, cond } = get.event();
        let skills2 = player2.storage.rehuashen.character.map((i) => get.character(i).skills).flat();
        skills2.randomSort();
        skills2.sort((a, b) => get.skillRank(b, cond) - get.skillRank(a, cond));
        if (skills2[0] === player2.storage.rehuashen.current2 || get.skillRank(skills2[0], cond) < 1) {
          return "制衡其他化身";
        }
        return "替换当前化身";
      }).set("cond", event.triggername).set("prompt", prompt).forResult();
      const control = result.control;
      event.result = { bool: typeof control === "string" && control !== "cancel2", cost_data: control };
    },
    async content(event, trigger, player) {
      let choice = event.cost_data;
      if (Array.isArray(choice)) {
        lib.skill.rehuashen.addHuashens(player, 3);
        [choice] = choice;
      }
      _status.noclearcountdown = true;
      const id = lib.status.videoId++, prompt = choice === "替换当前化身" ? "化身：请选择你要更换的武将牌" : "化身：选择制衡至多两张武将牌";
      const cards2 = player.storage.rehuashen.character;
      if (player.isOnline2()) {
        player.send(
          (cards3, prompt2, id2) => {
            const dialog2 = ui.create.dialog(prompt2, [cards3, lib.skill.rehuashen.$createButton]);
            dialog2.videoId = id2;
          },
          cards2,
          prompt,
          id
        );
      }
      const dialog = ui.create.dialog(prompt, [cards2, lib.skill.rehuashen.$createButton]);
      dialog.videoId = id;
      if (!event.isMine()) {
        dialog.style.display = "none";
      }
      if (choice === "替换当前化身") {
        const buttons = dialog.content.querySelector(".buttons");
        const array = dialog.buttons.filter((item) => !item.classList.contains("nodisplay") && item.style.display !== "none");
        const choosed = player.storage.rehuashen.choosed;
        const groups = array.map((i) => get.character(i.link).group).unique().sort((a, b) => {
          const getNum = (g) => lib.group.includes(g) ? lib.group.indexOf(g) : lib.group.length;
          return getNum(a) - getNum(b);
        });
        if (choosed.length > 0 || groups.length > 1) {
          dialog.style.bottom = (parseInt(dialog.style.top || "0", 10) + get.is.phoneLayout() ? 230 : 220) + "px";
          dialog.addPagination({
            data: array,
            totalPageCount: groups.length + Math.sign(choosed.length),
            container: dialog.content,
            insertAfter: buttons,
            onPageChange(state) {
              const { pageNumber, data, pageElement } = state;
              const { groups: groups2, choosed: choosed2 } = pageElement;
              data.forEach((item) => {
                item.classList[(() => {
                  const name = item.link, goon = choosed2.length > 0;
                  if (goon && pageNumber === 1) {
                    return choosed2.includes(name);
                  }
                  const group = get.character(name).group;
                  return groups2.indexOf(group) + (1 + goon) === pageNumber;
                })() ? "remove" : "add"]("nodisplay");
              });
              ui.update();
            },
            pageLimitForCN: ["←", "→"],
            pageNumberForCN: (choosed.length > 0 ? ["常用"] : []).concat(
              groups.map((i) => {
                const isChineseChar = (char) => {
                  const regex = /[\u4e00-\u9fff\u3400-\u4dbf\ud840-\ud86f\udc00-\udfff\ud870-\ud87f\udc00-\udfff\ud880-\ud88f\udc00-\udfff\ud890-\ud8af\udc00-\udfff\ud8b0-\ud8bf\udc00-\udfff\ud8c0-\ud8df\udc00-\udfff\ud8e0-\ud8ff\udc00-\udfff\ud900-\ud91f\udc00-\udfff\ud920-\ud93f\udc00-\udfff\ud940-\ud97f\udc00-\udfff\ud980-\ud9bf\udc00-\udfff\ud9c0-\ud9ff\udc00-\udfff]/u;
                  return regex.test(char);
                };
                const str = get.plainText(lib.translate[i + "2"] || lib.translate[i] || "无");
                return isChineseChar(str.slice(0, 1)) ? str.slice(0, 1) : str;
              })
            ),
            changePageEvent: "click",
            pageElement: {
              groups,
              choosed
            }
          });
        }
      }
      const finish = () => {
        if (player.isOnline2()) {
          player.send("closeDialog", id);
        }
        dialog.close();
        delete _status.noclearcountdown;
        if (!_status.noclearcountdown) {
          game.stopCountChoose();
        }
      };
      while (true) {
        const next = player.chooseButton(true).set("dialog", id);
        if (choice === "制衡其他化身") {
          next.set("selectButton", [1, 2]);
          next.set("filterButton", (button) => button.link !== get.event().current);
          next.set("current", player.storage.rehuashen.current);
        } else {
          next.set("ai", (button) => {
            const { player: player2, cond } = get.event();
            let skills2 = player2.storage.rehuashen.character.map((i) => get.character(i).skills).flat();
            skills2.randomSort();
            skills2.sort((a, b) => get.skillRank(b, cond) - get.skillRank(a, cond));
            return player2.storage.rehuashen.map[button.link].includes(skills2[0]) ? 2.5 : 1 + Math.random();
          });
          next.set("cond", event.triggername);
        }
        const result = await next.forResult();
        if (choice === "制衡其他化身") {
          finish();
          lib.skill.rehuashen.removeHuashen(player, result.links);
          lib.skill.rehuashen.addHuashens(player, result.links.length);
          return;
        } else {
          const card = result.links[0];
          const func = function(card2, id2) {
            const dialog2 = get.idDialog(id2);
            if (dialog2) {
              const paginationInstance = dialog2.paginationMap?.get(dialog2.content.querySelector(".buttons"));
              if (paginationInstance?.state) {
                paginationInstance.state.pageRefuseChanged = true;
              }
              for (let i = 0; i < dialog2.buttons.length; i++) {
                if (dialog2.buttons[i].link == card2) {
                  dialog2.buttons[i].classList.add("selectedx");
                } else {
                  dialog2.buttons[i].classList.add("unselectable");
                }
              }
            }
          };
          if (player.isOnline2()) {
            player.send(func, card, id);
          } else if (event.isMine()) {
            func(card, id);
          }
          const result2 = await player.chooseControl(player.storage.rehuashen.map[card], "返回").set("ai", () => {
            const { player: player2, cond, controls } = get.event();
            let skills2 = controls.slice();
            skills2.randomSort();
            skills2.sort((a, b) => get.skillRank(b, cond) - get.skillRank(a, cond));
            return skills2[0];
          }).set("cond", event.triggername).forResult();
          const control = result2.control;
          if (control === "返回") {
            const func2 = function(card2, id2) {
              const dialog2 = get.idDialog(id2);
              if (dialog2) {
                const paginationInstance = dialog2.paginationMap?.get(dialog2.content.querySelector(".buttons"));
                if (paginationInstance?.state) {
                  paginationInstance.state.pageRefuseChanged = false;
                }
                for (let i = 0; i < dialog2.buttons.length; i++) {
                  dialog2.buttons[i].classList.remove("selectedx");
                  dialog2.buttons[i].classList.remove("unselectable");
                }
              }
            };
            if (player.isOnline2()) {
              player.send(func2, card, id);
            } else if (event.isMine()) {
              func2(card, id);
            }
          } else {
            finish();
            player.storage.rehuashen.choosed.add(card);
            if (player.storage.rehuashen.current != card) {
              const old = player.storage.rehuashen.current;
              player.storage.rehuashen.current = card;
              game.broadcastAll(
                (player2, character, old2) => {
                  player2.tempname.remove(old2);
                  player2.tempname.add(character);
                  player2.sex = lib.character[character][0];
                },
                player,
                card,
                old
              );
              game.log(player, "将性别变为了", "#y" + get.translation(get.character(card).sex) + "性");
              player.changeGroup(get.character(card).group);
            }
            player.storage.rehuashen.current2 = control;
            if (!player.additionalSkills.rehuashen?.includes(control)) {
              player.flashAvatar("rehuashen", card);
              player.syncStorage("rehuashen");
              player.updateMarks("rehuashen");
              await player.addAdditionalSkills("rehuashen", control);
            }
            return;
          }
        }
      }
    },
    init(player, skill) {
      if (!player.storage[skill]) {
        player.storage[skill] = {
          character: [],
          choosed: [],
          map: {}
        };
      }
    },
    banned: ["lisu", "sp_xiahoudun", "xushao", "jsrg_xushao", "zhoutai", "old_zhoutai", "shixie", "xin_zhoutai", "dc_shixie", "old_shixie"],
    bannedType: ["Charlotte", "主公技", "觉醒技", "限定技", "隐匿技", "使命技"],
    addHuashen(player) {
      if (!player.storage.rehuashen) {
        return;
      }
      if (!_status.characterlist) {
        game.initCharacterList();
      }
      _status.characterlist.randomSort();
      for (let i = 0; i < _status.characterlist.length; i++) {
        let name = _status.characterlist[i];
        if (name.indexOf("zuoci") != -1 || name.indexOf("key_") == 0 || name.indexOf("sp_key_") == 0 || get.is.double(name) || lib.skill.rehuashen.banned.includes(name) || player.storage.rehuashen.character.includes(name)) {
          continue;
        }
        let skills2 = lib.character[name][3].filter((skill) => {
          const categories = get.skillCategoriesOf(skill, player);
          return !categories.some((type) => lib.skill.rehuashen.bannedType.includes(type));
        });
        if (skills2.length) {
          player.storage.rehuashen.character.push(name);
          player.storage.rehuashen.map[name] = skills2;
          _status.characterlist.remove(name);
          return name;
        }
      }
    },
    addHuashens(player, num) {
      var list = [];
      for (var i = 0; i < num; i++) {
        var name = lib.skill.rehuashen.addHuashen(player);
        if (name) {
          list.push(name);
        }
      }
      if (list.length) {
        player.syncStorage("rehuashen");
        player.updateMarks("rehuashen");
        game.log(player, "获得了", get.cnNumber(list.length) + "张", "#g化身");
        lib.skill.rehuashen.drawCharacter(player, list);
      }
    },
    removeHuashen(player, links) {
      player.storage.rehuashen.character.removeArray(links);
      _status.characterlist.addArray(links);
      game.log(player, "移去了", get.cnNumber(links.length) + "张", "#g化身");
    },
    drawCharacter(player, list) {
      game.broadcastAll(
        function(player2, list2) {
          if (player2.isUnderControl(true)) {
            var cards2 = [];
            for (var i = 0; i < list2.length; i++) {
              var cardname = "huashen_card_" + list2[i];
              lib.card[cardname] = {
                fullimage: true,
                image: "character:" + list2[i]
              };
              lib.translate[cardname] = get.rawName2(list2[i]);
              cards2.push(game.createCard(cardname, "", ""));
            }
            player2.$draw(cards2, "nobroadcast");
          }
        },
        player,
        list
      );
    },
    $createButton(item, type, position, noclick, node) {
      node = ui.create.buttonPresets.character(item, "character", position, noclick);
      const info = lib.character[item];
      const skills2 = info[3].filter(function(skill) {
        const categories = get.skillCategoriesOf(skill, get.player());
        return !categories.some((type2) => lib.skill.rehuashen.bannedType.includes(type2));
      });
      if (skills2.length) {
        const skillstr = skills2.map((i) => `[${get.translation(i)}]`).join("<br>");
        const skillnode = ui.create.caption(`<div class="text" data-nature=${get.groupnature(info[1], "raw")}m style="font-family: ${lib.config.name_font || "xinwei"},xinwei">${skillstr}</div>`, node);
        skillnode.style.left = "2px";
        skillnode.style.bottom = "2px";
      }
      node._customintro = function(uiintro, evt) {
        const character = node.link, characterInfo = get.character(node.link);
        let capt = get.translation(character);
        if (characterInfo) {
          capt += `&nbsp;&nbsp;${get.translation(characterInfo.sex)}`;
          let charactergroup;
          const charactergroups = get.is.double(character, true);
          if (charactergroups) {
            charactergroup = charactergroups.map((i) => get.translation(i)).join("/");
          } else {
            charactergroup = get.translation(characterInfo.group);
          }
          capt += `&nbsp;&nbsp;${charactergroup}`;
        }
        uiintro.add(capt);
        if (lib.characterTitle[node.link]) {
          uiintro.addText(get.colorspan(lib.characterTitle[node.link]));
        }
        for (let i = 0; i < skills2.length; i++) {
          if (lib.translate[skills2[i] + "_info"]) {
            let translation = lib.translate[skills2[i] + "_ab"] || get.translation(skills2[i]).slice(0, 2);
            if (lib.skill[skills2[i]] && lib.skill[skills2[i]].nobracket) {
              uiintro.add('<div><div class="skilln">' + get.translation(skills2[i]) + "</div><div>" + get.skillInfoTranslation(skills2[i], null, false) + "</div></div>");
            } else {
              uiintro.add('<div><div class="skill">【' + translation + "】</div><div>" + get.skillInfoTranslation(skills2[i], null, false) + "</div></div>");
            }
            if (lib.translate[skills2[i] + "_append"]) {
              uiintro._place_text = uiintro.add('<div class="text">' + lib.translate[skills2[i] + "_append"] + "</div>");
            }
          }
        }
      };
      return node;
    },
    // createAudio:(character,skillx,name)=>{
    // 	var skills=game.expandSkills([skillx]);
    // 	skills=skills.filter(skill=>get.info(skill));
    // 	if(!skills.length) return;
    // 	var skillss=skills.filter(skill=>get.info(skill).derivation);
    // 	if(skillss.length){
    // 		skillss.forEach(skill=>{
    // 			var derivationSkill=get.info(skill).derivation;
    // 			skills[Array.isArray(derivationSkill)?'addArray':'add'](derivationSkill);
    // 		});
    // 	}
    // 	skills.forEach(skill=>{
    // 		var info=lib.skill[skill];
    // 		if(info){
    // 			if(!info.audioname2) info.audioname2={};
    // 			if(info.audioname&&info.audioname.includes(character)){
    // 				if(info.audio){
    // 					if(typeof info.audio=='string') skill=info.audio;
    // 					if(Array.isArray(info.audio)) skill=info.audio[0];
    // 				}
    // 				if(!lib.skill[skill+'_'+character]) lib.skill[skill+'_'+character]={audio:2};
    // 				info.audioname2[name]=(skill+'_'+character);
    // 			}
    // 			else if(info.audioname2[character]){
    // 				info.audioname2[name]=info.audioname2[character];
    // 			}
    // 			else{
    // 				if(info.audio){
    // 					if(typeof info.audio=='string') skill=info.audio;
    // 					if(Array.isArray(info.audio)) skill=info.audio[0];
    // 				}
    // 				info.audioname2[name]=skill;
    // 			}
    // 		}
    // 	});
    // },
    mark: true,
    intro: {
      onunmark(storage, player) {
        _status.characterlist.addArray(storage.character);
        storage.character = [];
        const name = player.name ? player.name : player.name1;
        if (name) {
          const sex = get.character(name).sex;
          const group = get.character(name).group;
          if (player.sex !== sex) {
            game.broadcastAll(
              (player2, sex2) => {
                player2.sex = sex2;
              },
              player,
              sex
            );
            game.log(player, "将性别变为了", "#y" + get.translation(sex) + "性");
          }
          if (player.group !== group) {
            game.broadcastAll(
              (player2, group2) => {
                player2.group = group2;
                player2.node.name.dataset.nature = get.groupnature(group2);
              },
              player,
              group
            );
            game.log(player, "将势力变为了", "#y" + get.translation(group + 2));
          }
        }
      },
      mark(dialog, storage, player) {
        if (storage && storage.current) {
          dialog.addSmall([[storage.current], (item, type, position, noclick, node) => lib.skill.rehuashen.$createButton(item, type, position, noclick, node)]);
        }
        if (storage && storage.current2) {
          dialog.add('<div><div class="skill">【' + get.translation(lib.translate[storage.current2 + "_ab"] || get.translation(storage.current2).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(storage.current2, player, false) + "</div></div>");
        }
        if (storage && storage.character.length) {
          if (player.isUnderControl(true)) {
            dialog.addSmall([storage.character, (item, type, position, noclick, node) => lib.skill.rehuashen.$createButton(item, type, position, noclick, node)]);
          } else {
            dialog.addText("共有" + get.cnNumber(storage.character.length) + "张“化身”");
          }
        } else {
          return "没有化身";
        }
      },
      content(storage, player) {
        return "共有" + get.cnNumber(storage.character.length) + "张“化身”";
      },
      markcount(storage, player) {
        if (storage && storage.character) {
          return storage.character.length;
        }
        return 0;
      }
    }
  },
  rexinsheng: {
    inherit: "xinsheng",
    async content(event, trigger, player) {
      lib.skill.rehuashen.addHuashens(player, 1);
    },
    ai: { combo: "rehuashen" }
  },
  reguhuo: {
    audio: 2,
    derivation: "rechanyuan",
    enable: ["chooseToUse", "chooseToRespond"],
    hiddenCard(player, name) {
      return lib.inpile.includes(name) && player.countCards("h") > 0 && !player.hasSkill("reguhuo_used");
    },
    filter(event, player) {
      if (!player.countCards("hs") || player.hasSkill("reguhuo_used")) {
        return false;
      }
      for (var i of lib.inpile) {
        var type = get.type(i);
        if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
          return true;
        }
        if (i == "sha") {
          for (var j of lib.inpile_nature) {
            if (event.filterCard(get.autoViewAs({ name: i, nature: j }, "unsure"), player, event)) {
              return true;
            }
          }
        }
      }
      return false;
    },
    chooseButton: {
      dialog() {
        var list = [];
        for (var i of lib.inpile) {
          var type = get.type(i);
          if (type == "basic" || type == "trick") {
            list.push([type, "", i]);
          }
          if (i == "sha") {
            for (var j of lib.inpile_nature) {
              list.push(["基本", "", "sha", j]);
            }
          }
        }
        return ui.create.dialog("蛊惑", [list, "vcard"]);
      },
      filter(button, player) {
        var evt = _status.event.getParent();
        return evt.filterCard(get.autoViewAs({ name: button.link[2], nature: button.link[3] }, "unsure"), player, evt);
      },
      check(button) {
        var player = _status.event.player;
        var rand = _status.event.getParent().getRand("reguhuo");
        var hasEnemy = game.hasPlayer(function(current) {
          return current != player && !current.hasSkill("rechanyuan") && (get.realAttitude || get.attitude)(current, player) < 0;
        });
        var card = { name: button.link[2], nature: button.link[3] };
        var val = _status.event.getParent().type == "phase" ? player.getUseValue(card) : 1;
        if (val <= 0) {
          return 0;
        }
        if (hasEnemy && rand > 0.3) {
          if (!player.countCards("h", function(cardx) {
            if (card.name == cardx.name) {
              if (card.name != "sha") {
                return true;
              }
              return get.is.sameNature(card, cardx);
            }
            return false;
          })) {
            return 0;
          }
          return 3 * val;
        }
        return val;
      },
      backup(links, player) {
        return {
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            suit: "none",
            number: null
          },
          filterCard(card, player2, target) {
            var result = true;
            var suit = card.suit, number = card.number;
            card.suit = "none";
            card.number = null;
            var mod = game.checkMod(card, player2, "unchanged", "cardEnabled2", player2);
            if (mod != "unchanged") {
              result = mod;
            }
            card.suit = suit;
            card.number = number;
            return result;
          },
          position: "hs",
          ignoreMod: true,
          ai1(card) {
            var player2 = _status.event.player;
            var hasEnemy = game.hasPlayer(function(current) {
              return current != player2 && !current.hasSkill("rechanyuan") && (get.realAttitude || get.attitude)(current, player2) < 0;
            });
            var rand = _status.event.getRand("reguhuo");
            var cardx = lib.skill.reguhuo_backup.viewAs;
            if (hasEnemy && rand > 0.3) {
              if (card.name == cardx.name && (card.name != "sha" || get.is.sameNature(card, cardx))) {
                return 10;
              }
              return 0;
            }
            return 6 - get.value(card);
          },
          async precontent(event, trigger, player2) {
            const { result } = event;
            player2.logSkill("reguhuo");
            player2.addTempSkill("reguhuo_guess");
            const card = result.cards[0];
            result.card.suit = get.suit(card);
            result.card.number = get.number(card);
          }
        };
      },
      prompt(links) {
        return "将一张手牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
      }
    },
    ai: {
      fireAttack: true,
      respondShan: true,
      respondSha: true,
      skillTagFilter(player) {
        if (!player.countCards("hs") || player.hasSkill("reguhuo_used")) {
          return false;
        }
      },
      order: 10,
      result: {
        player: 1
      },
      threaten: 1.3
    },
    subSkill: {
      backup: {},
      used: { charlotte: true },
      guess: {
        trigger: {
          player: ["useCardBefore", "respondBefore"]
        },
        forced: true,
        silent: true,
        popup: false,
        charlotte: true,
        firstDo: true,
        sourceSkill: "reguhuo",
        filter(event, player) {
          return event.skill && event.skill.indexOf("reguhuo_") == 0;
        },
        async content(event, trigger, player) {
          player.addTempSkill("reguhuo_used");
          event.fake = false;
          const card = trigger.cards[0];
          if (card.name != trigger.card.name || card.name == "sha" && !get.is.sameNature(trigger.card, card)) {
            event.fake = true;
          }
          player.line(trigger.targets, get.nature(trigger.card));
          event.cardTranslate = get.translation(trigger.card.name);
          trigger.card.number = get.number(card);
          trigger.card.suit = get.suit(card);
          trigger.skill = "reguhuo_backup";
          if (trigger.card.name == "sha" && get.natureList(trigger.card).length) {
            event.cardTranslate = get.translation(trigger.card.nature) + event.cardTranslate;
          }
          player.popup(event.cardTranslate, trigger.name == "useCard" ? "metal" : "wood");
          event.prompt = "是否质疑" + get.translation(player) + "声明的" + event.cardTranslate + "？";
          game.log(player, "声明了", "#y" + event.cardTranslate);
          event.targets = game.filterPlayer(function(current) {
            return current != player && !current.hasSkill("rechanyuan");
          }).sortBySeat();
          event.targets2 = event.targets.slice(0);
          player.lose(card, ui.ordering).relatedEvent = trigger;
          if (!event.targets.length) {
            event.betrays = [];
            for (const i of event.targets2) {
              i.popup("不质疑", "wood");
              game.log(i, "#g不质疑");
            }
            game.delay();
            player.showCards(trigger.cards);
            return;
          }
          event.betrays = [];
          let list = event.targets.map(function(target) {
            return [target, [event.prompt, [["reguhuo_ally", "reguhuo_betray"], "vcard"]], true];
          });
          const result = await player.chooseButtonOL(list).set("switchToAuto", function() {
            _status.event.result = "ai";
          }).set("processAI", function() {
            let choice = Math.random() > 0.5 ? "reguhuo_ally" : "reguhuo_betray";
            const playerx = _status.event.player;
            const evt = _status.event.getParent("reguhuo_guess");
            if (playerx.hp <= 1 || evt && (get.realAttitude || get.attitude)(playerx, evt.player) >= 0) {
              choice = "reguhuo_ally";
            }
            return {
              bool: true,
              links: [["", "", choice]]
            };
          }).forResult();
          for (const i in result) {
            if (result[i].links[0][2] == "reguhuo_betray") {
              const current = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
              event.betrays.push(current);
              current.addExpose(0.2);
            }
          }
          for (const i of event.targets2) {
            const b = event.betrays.includes(i);
            i.popup(b ? "质疑" : "不质疑", b ? "fire" : "wood");
            game.log(i, b ? "#y质疑" : "#g不质疑");
          }
          game.delay();
          player.showCards(trigger.cards);
          if (event.betrays.length) {
            event.betrays.sortBySeat();
            if (event.fake) {
              game.asyncDraw(event.betrays);
              trigger.cancel();
              trigger.getParent().goto(0);
              game.log(player, "声明的", "#y" + event.cardTranslate, "作废了");
            } else {
              const next = game.createEvent("reguhuo_final", false);
              event.next.remove(next);
              trigger.after.push(next);
              next.targets = event.betrays;
              next.setContent(lib.skill.reguhuo_guess.contentx);
            }
          }
          game.delayx();
        },
        async contentx(event, trigger, player) {
          const targets = (event.targets || []).slice(0);
          let result;
          while (targets.length) {
            const target = targets.shift();
            event.target = target;
            result = await target.chooseToDiscard("弃置一张牌或失去1点体力").set("ai", (card) => 9 - get.value(card)).forResult();
            if (!result.bool) {
              await target.loseHp();
            }
            await target.addSkills("rechanyuan");
          }
        }
      }
    }
  },
  rechanyuan: {
    init(player, skill) {
      if (player.hp <= 1) {
        player.logSkill(skill);
      }
      player.addSkillBlocker(skill);
    },
    onremove(player, skill) {
      player.removeSkillBlocker(skill);
    },
    skillBlocker(skill, player) {
      return skill != "chanyuan" && skill != "rechanyuan" && !lib.skill[skill].charlotte && !lib.skill[skill].persevereSkill && player.hp <= 1;
    },
    mark: true,
    intro: {
      content(storage, player, skill) {
        var str = "<li>锁定技，你不能于〖蛊惑〗的结算流程中进行质疑。当你的体力值不大于1时，你的其他技能失效。";
        var list = player.getSkills(null, false, false).filter(function(i) {
          return lib.skill.rechanyuan.skillBlocker(i, player);
        });
        if (list.length) {
          str += "<br><li>失效技能：" + get.translation(list);
        }
        return str;
      }
    },
    audio: 2,
    trigger: { player: "changeHp" },
    filter(event, player) {
      if (event.changedHp == 0) {
        return false;
      }
      return get.sgn(player.hp - 1.5) != get.sgn(player.hp - 1.5 - event.changedHp);
    },
    forced: true,
    async content(event, trigger, player) {
    }
  },
  botu: {
    audio: 2,
    trigger: { player: "phaseAfter" },
    frequent: true,
    filter(event, player) {
      var history = player.getHistory("useCard", function(evt) {
        return evt.isPhaseUsing();
      });
      var suits = [];
      for (var i = 0; i < history.length; i++) {
        var suit = get.suit(history[i].card);
        if (suit) {
          suits.add(suit);
        }
      }
      return suits.length == 4;
    },
    async content(event, trigger, player) {
      player.insertPhase();
    }
  },
  xinleiji: {
    group: "xinleiji_misa",
    audio: 2,
    derivation: "xinleiji_faq",
    audioname: ["boss_qinglong"],
    trigger: { player: ["useCard", "respond"] },
    filter(event, player) {
      return event.card.name == "shan" || event.name == "useCard" && event.card.name == "shandian";
    },
    judgeCheck(card, bool) {
      var suit = get.suit(card);
      if (suit == "spade") {
        if (bool && get.number(card) > 1 && get.number(card) < 10) {
          return 5;
        }
        return 4;
      }
      if (suit == "club") {
        return 2;
      }
      return 0;
    },
    async content(event, trigger, player) {
      const judgeEvent = player.judge(lib.skill.xinleiji.judgeCheck);
      judgeEvent.judge2 = (result) => !!result.bool;
      await judgeEvent;
    },
    ai: {
      useShan: true,
      effect: {
        target_use(card, player, target, current) {
          let name;
          if (typeof card == "object") {
            if (card.viewAs) {
              name = card.viewAs;
            } else {
              name = get.name(card);
            }
          }
          if (name == "shandian" || get.tag(card, "respondShan") && !player.hasSkillTag(
            "directHit_ai",
            true,
            {
              target,
              card
            },
            true
          )) {
            let club = 0, spade = 0;
            if (game.hasPlayer(function(current2) {
              return get.attitude(target, current2) < 0 && get.damageEffect(current2, target, target, "thunder") > 0;
            })) {
              club = 2;
              spade = 4;
            }
            if (!target.isHealthy()) {
              club += 2;
            }
            if (!club && !spade) {
              return 1;
            }
            if (name === "sha") {
              if (!target.mayHaveShan(player, "use")) {
                return;
              }
            } else if (!target.mayHaveShan(player)) {
              return 1 - 0.1 * Math.min(5, target.countCards("hs"));
            }
            if (!target.hasSkillTag("rejudge")) {
              return [1, (club + spade) / 4];
            }
            let pos = player == target || player.hasSkillTag("viewHandcard", null, target, true) ? "hes" : "e", better = club > spade ? "club" : "spade", max = 0;
            target.hasCard(function(cardx) {
              if (get.suit(cardx) == better) {
                max = 2;
                return true;
              }
              if (spade && get.color(cardx) == "black") {
                max = 1;
              }
            }, pos);
            if (max == 2) {
              return [1, Math.max(club, spade)];
            }
            if (max == 1) {
              return [1, Math.min(club, spade)];
            }
            if (pos == "e") {
              return [1, Math.min(Math.max(1, target.countCards("hs")) * (club + spade) / 4, Math.max(club, spade))];
            }
            return [1, (club + spade) / 4];
          }
        },
        target(card, player, target) {
          let name;
          if (typeof card == "object") {
            if (card.viewAs) {
              name = card.viewAs;
            } else {
              name = get.name(card);
            }
          }
          if (name == "lebu" || name == "bingliang") {
            return [target.hasSkillTag("rejudge") ? 0.4 : 1, 2, target.hasSkillTag("rejudge") ? 0.4 : 1, 0];
          }
        }
      }
    }
  },
  xinleiji_misa: {
    audio: "xinleiji",
    trigger: { player: "judgeEnd" },
    direct: true,
    disableReason: ["暴虐", "助祭", "弘仪", "孤影"],
    sourceSkill: "xinleiji",
    filter(event, player) {
      return !lib.skill.xinleiji_misa.disableReason.includes(event.judgestr) && ["spade", "club"].includes(event.result.suit);
    },
    async content(event, trigger, player) {
      event.num = 1 + ["club", "spade"].indexOf(trigger.result.suit);
      event.logged = false;
      if (event.num == 1 && player.isDamaged()) {
        event.logged = true;
        player.logSkill("xinleiji");
        await player.recover();
      }
      const result = await player.chooseTarget("雷击：是否对一名角色造成" + event.num + "点雷电伤害？").set("ai", (target) => {
        const player2 = _status.event.player;
        let eff = get.damageEffect(target, player2, target, "thunder");
        if (get.event().num > 1 && !target.hasSkillTag("filterDamage", null, {
          player: player2,
          card: null,
          nature: "thunder"
        })) {
          if (eff > 0) {
            eff -= 25;
          } else if (eff < 0) {
            eff *= 2;
          }
        }
        return eff * get.attitude(player2, target);
      }).set("num", event.num).forResult();
      if (result.bool && result.targets && result.targets.length) {
        if (!event.logged) {
          player.logSkill("xinleiji", result.targets);
        } else {
          player.line(result.targets, "thunder");
        }
        await result.targets[0].damage(event.num, "thunder");
      }
    }
  },
  xinguidao: {
    audio: 2,
    mod: {
      aiOrder(player, card, num) {
        if (num > 0 && get.itemtype(card) == "card" && get.color(card) == "black" && get.type(card) == "equip") ;
      },
      aiValue(player, card, num) {
        if (num > 0 && get.itemtype(card) == "card" && get.color(card) == "black") {
          return num * 1.15;
        }
      },
      aiUseful(player, card, num) {
        if (num > 0 && get.itemtype(card) == "card" && get.color(card) == "black") {
          return num * 1.35;
        }
      }
    },
    locked: false,
    trigger: { global: "judge" },
    filter(event, player) {
      return player.hasCards("hes", { color: "black" });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard({
        prompt: `${get.translation(trigger.player)}的${trigger.judgestr || ""}判定为${get.translation(trigger.player.judging[0])}，${get.prompt(event.skill)}`,
        filterCard(card) {
          const player2 = get.player();
          if (get.color(card) !== "black") {
            return false;
          }
          const mod2 = game.checkMod(card, player2, "unchanged", "cardEnabled2", player2);
          if (mod2 != "unchanged") {
            return mod2;
          }
          const mod = game.checkMod(card, player2, "unchanged", "cardRespondable", player2);
          if (mod != "unchanged") {
            return mod;
          }
          return true;
        },
        position: "hes",
        ai(card) {
          const trigger2 = get.event().getTrigger();
          const { player: player2, judging } = get.event();
          const result = trigger2.judge(card) - trigger2.judge(judging);
          const attitude = get.attitude(player2, trigger2.player);
          if (attitude == 0 || result == 0) {
            if (trigger2.player != player2) {
              return 0;
            }
            if (game.hasPlayer((current) => get.attitude(player2, current) < 0)) {
              const checkx = lib.skill.xinleiji.judgeCheck(card, true) - lib.skill.xinleiji.judgeCheck(judging);
              if (checkx > 0) {
                return checkx;
              }
            }
            return 0;
          }
          let val = get.value(card);
          if (get.subtype(card) == "equip2") {
            val /= 2;
          } else {
            val /= 7;
          }
          if (attitude == 0 || result == 0) {
            return 0;
          }
          if (attitude > 0) {
            return result - val;
          }
          return -result - val;
        }
      }).set("judging", trigger.player.judging[0]).forResult();
    },
    popup: false,
    async content(event, trigger, player) {
      const next = player.respond({
        cards: event.cards,
        skill: event.name,
        highlight: true,
        noOrdering: true
      });
      await next;
      const { cards: cards2 } = next;
      if (cards2?.length) {
        player.$gain2(trigger.player.judging[0]);
        await player.gain(trigger.player.judging[0]);
        const card = cards2[0];
        if (get.suit(card) == "spade" && get.number(card) > 1 && get.number(card) < 10) {
          await player.draw("nodelay");
        }
        trigger.player.judging[0] = card;
        trigger.orderingCards.addArray(cards2);
        game.log(trigger.player, "的判定牌改为", cards2);
        await game.delay(2);
      }
    },
    ai: {
      rejudge: true,
      tag: { rejudge: 1 }
    }
  },
  reqingguo: {
    mod: {
      aiValue(player, card, num) {
        if (get.name(card) != "shan" && get.color(card) != "black") {
          return;
        }
        var cards2 = player.getCards("hs", function(card2) {
          return get.name(card2) == "shan" || get.color(card2) == "black";
        });
        cards2.sort(function(a, b) {
          return (get.name(b) == "shan" ? 1 : 2) - (get.name(a) == "shan" ? 1 : 2);
        });
        var geti = function() {
          if (cards2.includes(card)) {
            return cards2.indexOf(card);
          }
          return cards2.length;
        };
        if (get.name(card) == "shan") {
          return Math.min(num, [6, 4, 3][Math.min(geti(), 2)]) * 0.6;
        }
        return Math.max(num, [6.5, 4, 3][Math.min(geti(), 2)]);
      },
      aiUseful() {
        return lib.skill.reqingguo.mod.aiValue.apply(this, arguments);
      }
    },
    locked: false,
    audio: 2,
    enable: ["chooseToRespond", "chooseToUse"],
    filterCard(card) {
      return get.color(card) == "black";
    },
    position: "hes",
    viewAs: { name: "shan" },
    viewAsFilter(player) {
      if (!player.countCards("hes", { color: "black" })) {
        return false;
      }
    },
    prompt: "将一张黑色牌当闪打出",
    check() {
      return 1;
    },
    ai: {
      order: 2,
      respondShan: true,
      skillTagFilter(player) {
        if (!player.countCards("hes", { color: "black" })) {
          return false;
        }
      },
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "respondShan") && current < 0) {
            return 0.6;
          }
        }
      }
    }
  },
  reqiangxi: {
    subSkill: {
      off: {
        sub: true
      }
    },
    audio: 2,
    enable: "phaseUse",
    filterCard(card) {
      return get.subtype(card) == "equip1";
    },
    selectCard() {
      return [0, 1];
    },
    filterTarget(card, player, target) {
      if (player == target) {
        return false;
      }
      if (target.hasSkill("reqiangxi_off")) {
        return false;
      }
      return player.inRange(target);
    },
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      if (cards2.length === 0) {
        await player.loseHp();
      }
      target.addTempSkill("reqiangxi_off", "phaseUseAfter");
      await target.damage("nocard");
    },
    check(card) {
      return 10 - get.value(card);
    },
    position: "he",
    ai: {
      order: 8.5,
      result: {
        target(player, target) {
          if (!ui.selected.cards.length) {
            if (player.hp < 2) {
              return 0;
            }
            if (target.hp >= player.hp) {
              return 0;
            }
          }
          return get.damageEffect(target, player);
        }
      }
    },
    threaten: 1.5
  },
  rehuoji: {
    position: "hes",
    audio: 2,
    audioname: ["ol_sp_zhugeliang", "ol_pangtong"],
    enable: "chooseToUse",
    filterCard(card) {
      return get.color(card) == "red";
    },
    viewAs: {
      name: "huogong"
    },
    viewAsFilter(player) {
      if (!player.countCards("hes", { color: "red" })) {
        return false;
      }
    },
    prompt: "将一张红色牌当火攻使用",
    check(card) {
      var player = get.player();
      if (player.countCards("h") > player.hp) {
        return 6 - get.value(card);
      }
      return 4 - get.value(card);
    },
    ai: {
      fireAttack: true
    }
  },
  rekanpo: {
    mod: {
      aiValue(player, card, num) {
        if (get.name(card) != "wuxie" && get.color(card) != "black") {
          return;
        }
        var cards2 = player.getCards("hs", function(card2) {
          return get.name(card2) == "wuxie" || get.color(card2) == "black";
        });
        cards2.sort(function(a, b) {
          return (get.name(b) == "wuxie" ? 1 : 2) - (get.name(a) == "wuxie" ? 1 : 2);
        });
        var geti = function() {
          if (cards2.includes(card)) {
            return cards2.indexOf(card);
          }
          return cards2.length;
        };
        if (get.name(card) == "wuxie") {
          return Math.min(num, [6, 4, 3][Math.min(geti(), 2)]) * 0.6;
        }
        return Math.max(num, [6, 4, 3][Math.min(geti(), 2)]);
      },
      aiUseful() {
        return lib.skill.rekanpo.mod.aiValue.apply(this, arguments);
      }
    },
    locked: false,
    audio: 2,
    audioname: ["ol_sp_zhugeliang", "ol_pangtong"],
    position: "hes",
    enable: "chooseToUse",
    filterCard(card) {
      return get.color(card) == "black";
    },
    viewAsFilter(player) {
      return player.countCards("hes", { color: "black" }) > 0;
    },
    viewAs: {
      name: "wuxie"
    },
    prompt: "将一张黑色牌当无懈可击使用",
    check(card) {
      return 8 - get.value(card);
    }
  },
  reshuangxiong: {
    audio: "shuangxiong",
    audioname: ["re_yanwen"],
    group: ["reshuangxiong_judge", "reshuangxiong_gain"],
    subSkill: {
      judge: {
        audio: "reshuangxiong",
        logAudio: () => 1,
        trigger: { player: "phaseDrawBegin1" },
        check(event, player) {
          if (player.countCards("h") > player.hp) {
            return true;
          }
          if (player.countCards("h") > 3) {
            return true;
          }
          return false;
        },
        filter(event, player) {
          return !event.numFixed;
        },
        prompt2() {
          return "放弃摸牌，然后亮出牌堆顶的两张牌并选择获得其中的一张。本回合内可以将与此牌颜色不同的一张手牌当做【决斗】使用";
        },
        async content(event, trigger, player) {
          trigger.changeToZero();
          event.cards = get.cards(2);
          event.videoId = lib.status.videoId++;
          game.broadcastAll(
            function(player2, id, cards2) {
              const str = player2 == game.me && !_status.auto ? "【双雄】选择获得其中一张牌" : "双雄";
              const dialog = ui.create.dialog(str, cards2);
              dialog.videoId = id;
            },
            player,
            event.videoId,
            event.cards
          );
          event.time = get.utc();
          game.addVideo("showCards", player, ["双雄", get.cardsInfo(event.cards)]);
          game.addVideo("delay", null, 2);
          const result = await player.chooseButton([1, 1], true).set("dialog", event.videoId).set("ai", function(button) {
            const playerx = _status.event.player;
            const color = get.color(button.link);
            let value = get.value(button.link, playerx);
            if (playerx.countCards("h", { color }) > playerx.countCards("h", ["red", "black"].remove(color)[0])) {
              value += 5;
            }
            return value;
          }).forResult();
          if (result.bool && result.links) {
            const cards2 = [];
            for (const link of result.links) {
              cards2.push(link);
              event.cards.remove(link);
            }
            await game.cardsDiscard(event.cards);
            event.card2 = cards2[0];
          }
          const time = 1e3 - (get.utc() - event.time);
          if (time > 0) {
            await game.delay(0, time);
          }
          game.broadcastAll("closeDialog", event.videoId);
          const card2 = event.card2;
          if (card2) {
            await player.gain(card2, "gain2");
            player.addTempSkill("reshuangxiong_viewas");
            player.markAuto("reshuangxiong_viewas", [get.color(card2, false)]);
          }
        }
      },
      gain: {
        trigger: {
          player: "damageEnd"
        },
        audio: "reshuangxiong",
        filter(event, player) {
          const evt = event.getParent();
          return evt?.name == "juedou" && evt[player == evt.player ? "targetCards" : "playerCards"]?.someInD("od");
        },
        async cost(event, trigger, player) {
          let evt = trigger.getParent();
          let cards2 = evt[player == evt.player ? "targetCards" : "playerCards"].slice(0).filterInD("od");
          event.result = await player.chooseBool("是否发动【双雄】，获得" + get.translation(cards2) + "?").forResult();
          event.result.cards = cards2;
        },
        async content(event, trigger, player) {
          await player.gain(event.cards, "gain2");
        }
      },
      viewas: {
        charlotte: true,
        onremove: true,
        audio: "reshuangxiong",
        logAudio: () => "shuangxiong_re_yanwen2.mp3",
        enable: "chooseToUse",
        viewAs: { name: "juedou" },
        position: "hs",
        viewAsFilter(player) {
          return player.hasCard((card) => lib.skill.reshuangxiong_viewas.filterCard(card, player), "hs");
        },
        filterCard(card, player) {
          const color = get.color(card), colors = player.getStorage("reshuangxiong_viewas");
          for (const i of colors) {
            if (color != i) {
              return true;
            }
          }
          return false;
        },
        prompt() {
          const colors = _status.event.player.getStorage("reshuangxiong_viewas");
          let str = "将一张颜色";
          for (let i = 0; i < colors.length; i++) {
            if (i > 0) {
              str += "或";
            }
            str += "不为";
            str += get.translation(colors[i]);
          }
          str += "的手牌当做【决斗】使用";
          return str;
        },
        check(card) {
          const player = _status.event.player;
          const raw = player.getUseValue(card, null, true);
          const eff = player.getUseValue(get.autoViewAs({ name: "juedou" }, [card]));
          return eff - raw;
        },
        ai: { order: 7 }
      }
    }
  },
  reshuangxiong1: {
    audio: "shuangxiong1",
    audioname2: {
      re_yanwen: "shuangxiong_re_yanwen1"
    },
    trigger: { player: "phaseDrawBegin1" },
    sourceSkill: "reshuangxiong",
    check(event, player) {
      if (player.countCards("h") > player.hp) {
        return true;
      }
      if (player.countCards("h") > 3) {
        return true;
      }
      return false;
    },
    filter(event, player) {
      return !event.numFixed;
    },
    prompt2() {
      return "放弃摸牌，然后亮出牌堆顶的两张牌并选择获得其中的一张。本回合内可以将与此牌颜色不同的一张手牌当做【决斗】使用";
    },
    async content(event, trigger, player) {
      const cards2 = event.cards.slice(0);
      let result;
      trigger.changeToZero();
      event.cards = get.cards(2);
      event.videoId = lib.status.videoId++;
      game.broadcastAll(
        (player2, id, cardsInner) => {
          const str = player2 == game.me && !_status.auto ? "【双雄】选择获得其中一张牌" : "双雄";
          const dialog = ui.create.dialog(str, cardsInner);
          dialog.videoId = id;
        },
        player,
        event.videoId,
        event.cards
      );
      event.time = get.utc();
      game.addVideo("showCards", player, ["双雄", get.cardsInfo(event.cards)]);
      game.addVideo("delay", null, 2);
      result = await player.chooseButton([1, 1], true).set("dialog", event.videoId).set("ai", function(button) {
        const playerx = _status.event.player;
        const color = get.color(button.link);
        let value = get.value(button.link, playerx);
        if (playerx.countCards("h", { color }) > playerx.countCards("h", ["red", "black"].remove(color)[0])) {
          value += 5;
        }
        return value;
      }).forResult();
      if (result?.bool && result.links) {
        const cards22 = [];
        for (const link of result.links) {
          cards22.push(link);
          cards2.remove(link);
        }
        await game.cardsDiscard(cards2);
        event.card2 = cards22[0];
      }
      const time = 1e3 - (get.utc() - event.time);
      if (time > 0) {
        await game.delay(0, time);
      }
      game.broadcastAll("closeDialog", event.videoId);
      const card2 = event.card2;
      if (card2) {
        await player.gain(card2, "gain2");
        player.addTempSkill("shuangxiong2");
        player.markAuto("shuangxiong2", [get.color(card2, false)]);
      }
    }
  },
  reshuangxiong2: {
    trigger: {
      player: "damageEnd"
    },
    direct: true,
    sourceSkill: "reshuangxiong",
    filter(event, player) {
      var evt = event.getParent();
      return (evt && evt.name == "juedou" && evt[player == evt.player ? "targetCards" : "playerCards"].length) > 0;
    },
    async content(event, trigger, player) {
      const evt = trigger.getParent();
      let cards2 = (evt[player == evt.player ? "targetCards" : "playerCards"] || []).slice(0);
      cards2 = cards2.filter((card) => get.position(card) == "d");
      if (!cards2.length) {
        return;
      }
      event.cards = cards2;
      const result = await player.chooseBool("是否发动【双雄】，获得" + get.translation(event.cards) + "?").set("ai", () => true).forResult();
      if (result.bool) {
        player.logSkill("reshuangxiong");
        await player.gain(cards2, "gain2");
      }
    }
  },
  new_yajiao: {
    audio: "reyajiao",
    trigger: { player: ["useCard", "respond"] },
    frequent: true,
    filter(event, player) {
      return player != _status.currentPhase;
    },
    async content(event, trigger, player) {
      event.card = get.cards()[0];
      await player.showCards(event.card);
      event.same = get.type2(event.card) == get.type2(trigger.card);
      const result = await player.chooseTarget(`涯角：令一名角色获得${get.translation(event.card)}`, true).set("ai", (target) => {
        const { player: player2, du, same } = get.event();
        let att = get.attitude(player2, target);
        if (du) {
          if (target.hasSkillTag("nodu")) {
            return 0;
          }
          return -att;
        }
        if (!same) {
          att += target == player2 ? 1 : 0;
        }
        if (att > 0) {
          return att + Math.max(0, 5 - target.countCards("h"));
        }
        return att;
      }).set("du", event.card.name == "du").set("same", event.same).forResult();
      if (result?.targets?.length) {
        player.line(result.targets, "green");
        await result.targets[0].gain(event.card, "gain2");
        if (!event.same) {
          await player.chooseToDiscard(true, "he");
        }
      }
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (get.tag(card, "respond") && target.countCards("h") > 1) {
            return [1, 0.2];
          }
        }
      }
    }
  },
  new_liyu: {
    audio: "liyu",
    trigger: {
      source: "damageSource"
    },
    filter(event, player) {
      if (event._notrigger.includes(event.player)) {
        return false;
      }
      return event.card && event.card.name == "sha" && event.player != player && event.player.isIn() && event.player.countGainableCards(player, "hej") > 0;
    },
    direct: true,
    async content(event, trigger, player) {
      const gainResult = await player.gainPlayerCard(get.prompt("new_liyu", trigger.player), trigger.player, "hej", "visibleMove").set("ai", function(button) {
        const player2 = _status.event.player;
        const target = _status.event.target;
        if (get.attitude(player2, target) > 0 && get.position(button.link) === "j") {
          return 4 + get.value(button.link);
        }
        if (get.type(button.link) === "equip") {
          return _status.event.juedou;
        }
        return 3;
      }).set(
        "juedou",
        (() => {
          if (get.attitude(player, trigger.player) > 0 && game.hasPlayer((current) => {
            return player.canUse({ name: "juedou" }, current) && current != trigger.player && current != player && get.effect(current, { name: "juedou" }, player, player) > 2;
          })) {
            return 5;
          }
          if (game.hasPlayer((current) => {
            return player.canUse({ name: "juedou" }, current) && current != trigger.player && current != player && get.effect(current, { name: "juedou" }, player, player) < 0;
          })) {
            return 1;
          }
          return 4;
        })()
      ).set("logSkill", ["new_liyu", trigger.player]).forResult();
      if (!gainResult?.bool) return;
      const gained = gainResult.cards?.[0];
      if (!gained) return;
      if (get.type(gained) !== "equip") {
        await trigger.player.draw();
        return;
      }
      if (!game.hasPlayer((current) => current != player && current != trigger.player && player.canUse("juedou", current))) {
        return;
      }
      const chooseRes = await trigger.player.chooseTarget(
        true,
        (card, player2, target) => {
          const evt = _status.event.getParent();
          return evt.player.canUse({ name: "juedou" }, target) && target != _status.event.player;
        },
        "请选择一名角色，视为" + get.translation(player) + "对其使用【决斗】"
      ).set("ai", (target) => {
        const evt = _status.event.getParent();
        return get.effect(target, { name: "juedou" }, evt.player, _status.event.player) - 2;
      }).forResult();
      if (chooseRes?.targets?.length) {
        await player.useCard({ name: "juedou", isCard: true }, chooseRes.targets[0], "noai");
      }
    },
    ai: {
      halfneg: true
    }
  },
  new_retuxi: {
    audio: "retuxi",
    audioname2: { gz_jun_caocao: "jianan_tuxi" },
    trigger: {
      player: "phaseDrawBegin2"
    },
    direct: true,
    preHidden: true,
    filter(event, player) {
      return event.num > 0 && !event.numFixed && game.hasPlayer(function(target) {
        return target.countCards("h") > 0 && player != target;
      });
    },
    async content(event, trigger, player) {
      let result;
      let num = get.copy(trigger.num);
      if (get.mode() == "guozhan" && num > 2) {
        num = 2;
      }
      result = await player.chooseTarget(get.prompt("new_retuxi"), "获得至多" + get.translation(num) + "名角色的各一张手牌，然后少摸等量的牌", [1, num], (card, player2, target) => target.countCards("h") > 0 && player2 != target).set("ai", (target) => {
        let att = get.attitude(_status.event.player, target);
        if (target.hasSkill("tuntian")) {
          return att / 10;
        }
        return 1 - att;
      }).setHiddenSkill("new_retuxi").forResult();
      if (result.bool) {
        result.targets.sortBySeat();
        player.logSkill("new_retuxi", result.targets);
        await player.gainMultiple(result.targets);
        trigger.num -= result.targets.length;
      } else {
        return;
      }
      if (trigger.num <= 0) {
        await game.delay();
      }
    },
    ai: {
      threaten: 1.6,
      expose: 0.2
    }
  },
  new_reyiji: {
    audio: "reyiji",
    audioname: ["yj_sb_guojia", "yj_sb_guojia_shadow"],
    audioname2: { sxrm_caocao: "reyiji_sxrm_caocao", tw_sxrm_caocao: "reyiji_sxrm_caocao" },
    trigger: {
      player: "damageEnd"
    },
    frequent: true,
    filter(event) {
      return event.num > 0;
    },
    getIndex(event, player, triggername) {
      return event.num;
    },
    async content(event, trigger, player) {
      let result;
      result = await player.draw(2).forResult();
      if (_status.connectMode) {
        game.broadcastAll(() => {
          _status.noclearcountdown = true;
        });
      }
      event.given_map = {};
      event.num = 2;
      while (event.num > 0) {
        result = await player.chooseCardTarget({
          filterCard(card) {
            return get.itemtype(card) == "card" && !card.hasGaintag("reyiji_tag");
          },
          filterTarget: lib.filter.notMe,
          selectCard: [1, event.num],
          prompt: "请选择要分配的卡牌和目标",
          ai1(card) {
            return ui.selected.cards.length ? 0 : 1;
          },
          ai2(target) {
            const player2 = _status.event.player;
            const card = ui.selected.cards[0];
            const val = target.getUseValue(card);
            if (val > 0) return val * get.attitude(player2, target) * 2;
            return get.value(card, target) * get.attitude(player2, target);
          }
        }).forResult();
        if (result.bool) {
          const res = result.cards;
          const targetId = result.targets[0].playerid;
          player.addGaintag(res, "reyiji_tag");
          event.num -= res.length;
          if (!event.given_map[targetId]) event.given_map[targetId] = [];
          event.given_map[targetId].addArray(res);
          continue;
        }
        if (event.num === 2) {
          if (_status.connectMode) {
            game.broadcastAll(() => {
              delete _status.noclearcountdown;
              game.stopCountChoose();
            });
          }
          return;
        }
        break;
      }
      if (_status.connectMode) {
        game.broadcastAll(() => {
          delete _status.noclearcountdown;
          game.stopCountChoose();
        });
      }
      const map = [];
      const cards2 = [];
      for (const id of Object.keys(event.given_map)) {
        const source = (_status.connectMode ? lib.playerOL : game.playerMap)[id];
        player.line(source, "green");
        if (player !== source && (get.mode() !== "identity" || player.identity !== "nei")) {
          player.addExpose(0.18);
        }
        map.push([source, event.given_map[id]]);
        cards2.addArray(event.given_map[id]);
      }
      await game.loseAsync({
        gain_list: map,
        player,
        cards: cards2,
        giver: player,
        animate: "giveAuto"
      }).setContent("gaincardMultiple");
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage")) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return [1, -2];
            }
            if (!target.hasFriend()) {
              return;
            }
            let num = 1;
            if (get.attitude(player, target) > 0) {
              if (player.needsToDiscard()) {
                num = 0.7;
              } else {
                num = 0.5;
              }
            }
            if (target.hp >= 4) {
              return [1, num * 2];
            }
            if (target.hp == 3) {
              return [1, num * 1.5];
            }
            if (target.hp == 2) {
              return [1, num * 0.5];
            }
          }
        }
      },
      threaten: 0.6
    }
  },
  new_rejianxiong: {
    audio: "rejianxiong",
    audioname: ["shen_caopi", "mb_caocao"],
    audioname2: { caoying: "lingren_jianxiong" },
    trigger: { player: "damageEnd" },
    async content(event, trigger, player) {
      if (get.itemtype(trigger.cards) == "cards" && get.position(trigger.cards[0], true) == "o") {
        await player.gain(trigger.cards, "gain2");
      }
      await player.draw("nodelay");
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return [1, -1];
          }
          if (get.tag(card, "damage") && player != target) {
            var cards2 = card.cards, evt = _status.event;
            if (evt.player == target && card.name == "damage" && evt.getParent().type == "card") {
              cards2 = evt.getParent().cards.filterInD();
            }
            if (target.hp <= 1) {
              return;
            }
            if (get.itemtype(cards2) != "cards") {
              return;
            }
            for (var i of cards2) {
              if (get.name(i, target) == "tao") {
                return [1, 4.5];
              }
            }
            if (get.value(cards2, target) >= 7 + target.getDamagedHp()) {
              return [1, 2.5];
            }
            return [1, 0.6];
          }
        }
      }
    }
  },
  new_reluoyi: {
    audio: "reluoyi",
    trigger: {
      player: "phaseDrawBegin1"
    },
    forced: true,
    locked: false,
    filter(event, player) {
      return !event.numFixed;
    },
    async content(event, trigger, player) {
      const cards2 = get.cards(3, true);
      await player.showCards(cards2, "裸衣", true);
      const cardsx = [];
      for (const c of cards2) {
        const type = get.type(c);
        if (type == "basic" || c.name == "juedou" || type == "equip" && get.subtype(c) == "equip1") {
          cardsx.push(c);
        }
      }
      event.cards = cardsx;
      const prompt = "是否放弃摸牌" + (cardsx.length ? "，改为获得" + get.translation(cardsx) : "") + "？";
      const result = await player.chooseBool(prompt).set("choice", cardsx.length >= trigger.num).forResult();
      if (result.bool) {
        if (cardsx.length) {
          await player.gain(cardsx, "gain2");
        }
        player.addTempSkill("new_reluoyi_buff", { player: "phaseBeforeStart" });
        trigger.changeToZero();
      }
    },
    subSkill: { buff: { inherit: "reluoyi2", sourceSkill: "new_reluoyi" } }
  },
  new_rewusheng: {
    mod: {
      targetInRange(card) {
        if (get.suit(card) == "diamond" && card.name == "sha") {
          return true;
        }
      }
    },
    locked: false,
    audio: "wusheng",
    audioname: ["re_guanyu", "jsp_guanyu", "re_guanzhang", "dc_jsp_guanyu"],
    audioname2: {
      dc_guansuo: "wusheng_guansuo",
      guanzhang: "wusheng_guanzhang",
      guansuo: "wusheng_guansuo",
      gz_jun_liubei: "shouyue_wusheng",
      std_guanxing: "wusheng_guanzhang",
      ty_guanxing: "wusheng_guanzhang",
      ol_guanzhang: "wusheng_ol_guanzhang",
      re_baosanniang: "wusheng_re_baosanniang"
    },
    enable: ["chooseToRespond", "chooseToUse"],
    filterCard(card, player) {
      if (get.zhu(player, "shouyue")) {
        return true;
      }
      return get.color(card) == "red";
    },
    position: "hes",
    viewAs: {
      name: "sha"
    },
    viewAsFilter(player) {
      if (get.zhu(player, "shouyue")) {
        if (!player.countCards("hes")) {
          return false;
        }
      } else {
        if (!player.countCards("hes", { color: "red" })) {
          return false;
        }
      }
    },
    prompt: "将一张红色牌当杀使用或打出",
    check(card) {
      var val = get.value(card);
      if (_status.event.name == "chooseToRespond") {
        return 1 / Math.max(0.1, val);
      }
      return 5 - val;
    },
    ai: {
      respondSha: true,
      skillTagFilter(player) {
        if (get.zhu(player, "shouyue")) {
          if (!player.countCards("hes")) {
            return false;
          }
        } else {
          if (!player.countCards("hes", { color: "red" })) {
            return false;
          }
        }
      }
    }
  },
  wusheng_ol_guanzhang: { audio: 1 },
  new_yijue: {
    initSkill(skill) {
      if (!lib.skill[skill]) {
        lib.skill[skill] = {
          charlotte: true,
          onremove: true,
          mark: true,
          marktext: "绝",
          intro: {
            markcount: () => 0,
            content: (storage) => `本回合不能使用或打出手牌、非锁定技失效且受到${get.translation(storage[1])}红桃【杀】的伤害+1`
          },
          group: "new_yijue_ban"
        };
        lib.translate[skill] = "义绝";
        lib.translate[skill + "_bg"] = "绝";
      }
    },
    audio: "yijue",
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return player != target && target.countCards("h");
    },
    filterCard: lib.filter.cardDiscardable,
    position: "he",
    check(card) {
      return 8 - get.value(card);
    },
    async content(event, trigger, player) {
      const { target } = event;
      if (!target.countCards("h")) {
        return;
      }
      const result = await target.chooseCard(true, "h").set("ai", (card) => {
        get.player();
        if (get.color(card) == "black") {
          return 18 - get.event().black - get.value(card);
        }
        return 18 - get.value(card);
      }).set(
        "black",
        (() => {
          if (get.attitude(target, player) > 0) {
            return 18;
          }
          if (target.hasCard((card) => {
            const name = get.name(card, target);
            return name === "shan" || name === "tao" || name === "jiu" && target.hp < 3;
          })) {
            return 18 / target.hp;
          }
          if (target.hp < 3) {
            return 12 / target.hp;
          }
          return 0;
        })()
      ).forResult();
      if (result?.bool && result?.cards?.length) {
        const { cards: cards2 } = result;
        await target.showCards(cards2);
        const [card] = cards2;
        if (get.color(card) == "black") {
          if (!target.hasSkill("fengyin")) {
            target.addTempSkill("fengyin");
          }
          const skill = "new_yijue_" + player.playerid;
          game.broadcastAll(lib.skill.new_yijue.initSkill, skill);
          target.addTempSkill(skill);
          target.storage[skill] ??= [0, player];
          target.storage[skill][0]++;
          target.markSkill(skill);
          player.addTempSkill("new_yijue_effect");
        } else if (get.color(card) == "red") {
          await player.gain(card, target, "give", "bySelf");
          if (target.isDamaged()) {
            const result2 = await player.chooseBool(`是否让${get.translation(target)}回复1点体力？`).set("choice", get.recoverEffect(target, player, player) > 0).forResult();
            if (result2?.bool) {
              await target.recover();
            }
          }
        }
      }
    },
    ai: {
      result: {
        target(player, target) {
          var hs = player.getCards("h");
          if (hs.length < 3) {
            return 0;
          }
          if (target.countCards("h") > target.hp + 1 && get.recoverEffect(target) > 0) {
            return 1;
          }
          if (player.canUse("sha", target) && (player.countCards("h", "sha") || player.countCards("he", { color: "red" }))) {
            return -2;
          }
          return -0.5;
        }
      },
      order: 9,
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (!arg?.target?.hasSkill("new_yijue_" + player.playerid)) {
          return false;
        }
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        trigger: { source: "damageBegin1" },
        filter(event, player) {
          return event.card?.name == "sha" && get.suit(event.card) == "heart" && event.notLink() && event.player.storage["new_yijue_" + player.playerid]?.[1] == player;
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          trigger.num += trigger.player.storage["new_yijue_" + player.playerid][0];
        }
      },
      ban: {
        charlotte: true,
        mod: {
          cardEnabled2(card) {
            if (get.position(card) == "h") {
              return false;
            }
          }
        }
      }
    }
  },
  paoxiao_re_zhangfei: { audio: 2 },
  new_repaoxiao: {
    audio: "paoxiao",
    firstDo: true,
    audioname2: {
      old_guanzhang: "old_fuhun",
      xin_zhangfei: "paoxiao_re_zhangfei",
      old_zhangfei: "paoxiao_re_zhangfei"
    },
    audioname: ["re_zhangfei", "guanzhang", "xiahouba", "re_guanzhang"],
    trigger: { player: "useCard1" },
    forced: true,
    filter(event, player) {
      return event.card.name == "sha" && (!event.audioed || !player.hasSkill("new_repaoxiao2"));
    },
    async content(event, trigger, player) {
      trigger.audioed = true;
      player.addTempSkill("new_repaoxiao2");
    },
    mod: {
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return Infinity;
        }
      }
    },
    ai: {
      unequip: true,
      skillTagFilter(player, tag, arg) {
        if (!get.zhu(player, "shouyue")) {
          return false;
        }
        if (arg && arg.name == "sha") {
          return true;
        }
        return false;
      }
    }
  },
  new_repaoxiao2: {
    charlotte: true,
    mod: {
      targetInRange(card, player) {
        if (card.name == "sha") {
          return true;
        }
      }
    }
  },
  new_tishen: {
    trigger: {
      player: "phaseUseEnd"
    },
    check(event, player) {
      var num = 0;
      var he = player.getCards("he");
      for (var i = 0; i < he.length; i++) {
        if (get.type(he[i], "trick") == "trick") {
          num++;
        }
        if (get.type(he[i]) == "equip") {
          var subtype = get.subtype(he[i]);
          if (subtype == "equip3" || subtype == "equip4" || subtype == "equip6") {
            num++;
          }
        }
      }
      return num == 0 || num <= player.countCards("h") - player.getHandcardLimit();
    },
    async content(event, trigger, player) {
      const list = [];
      const he = player.getCards("he");
      for (const card of he) {
        if (get.type(card, "trick") == "trick") {
          list.push(card);
        }
        if (get.type(card) == "equip") {
          const subtype = get.subtype(card);
          if (subtype == "equip3" || subtype == "equip4" || subtype == "equip6") {
            list.push(card);
          }
        }
      }
      if (list.length) {
        await player.discard(list);
      }
      player.addTempSkill("new_tishen2", { player: "phaseBefore" });
    },
    audio: "retishen"
  },
  new_tishen2: {
    audio: "retishen",
    trigger: {
      global: "useCardAfter"
    },
    filter(event, player) {
      return event.card.name == "sha" && event.targets && event.targets.includes(player) && !player.hasHistory("damage", (evt) => evt.card == event.card) && event.cards.filterInD("od").length;
    },
    forced: true,
    charlotte: true,
    sourceSkill: "new_tishen",
    async content(event, trigger, player) {
      await player.gain(trigger.cards.filterInD("od"), "gain2");
    }
  },
  new_qingjian: {
    audio: "qingjian",
    trigger: {
      player: "gainAfter",
      global: "loseAsyncAfter"
    },
    usable: 1,
    filter(event, player) {
      const evt = event.getParent("phaseDraw");
      if (evt?.player == player) {
        return false;
      }
      return event.getg(player).length > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        position: "he",
        filterCard: true,
        selectCard: [1, Infinity],
        filterTarget: lib.filter.notMe,
        ai1(card) {
          const player2 = get.player();
          if (card.name != "du" && get.attitude(player2, _status.currentPhase) < 0 && _status.currentPhase?.needsToDiscard()) {
            return -1;
          }
          for (var i = 0; i < ui.selected.cards.length; i++) {
            if (get.type(ui.selected.cards[i]) == get.type(card) || ui.selected.cards[i].name == "du" && card.name != "du") {
              return -1;
            }
          }
          if (card.name == "du") {
            return 20;
          }
          return player2.countCards("h") - player2.hp;
        },
        allowChooseAll: true,
        ai2(target) {
          const player2 = get.player();
          if (get.attitude(player2, _status.currentPhase) < 0) {
            return -1;
          }
          const att = get.attitude(player2, target);
          if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
            if (target.hasSkillTag("nodu")) {
              return 0;
            }
            return 1 - att;
          }
          if (target.countCards("h") > player2.countCards("h")) {
            return 0;
          }
          return att - 4;
        },
        prompt: get.prompt2(event.name.slice(0, -5))
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target],
        cards: cards2
      } = event;
      await player.showCards(cards2);
      await player.give(cards2, target);
      const current = _status.currentPhase;
      if (current?.isIn()) {
        current.addTempSkill("qingjian_add");
        current.addMark("qingjian_add", cards2.map((card) => get.type2(card)).toUniqued().length, false);
      }
    },
    ai: { expose: 0.3 }
  },
  qingjian_add: {
    mark: true,
    intro: { content: "手牌上限+#" },
    mod: {
      maxHandcard(player, num) {
        return num + player.countMark("qingjian_add");
      }
    },
    charlotte: true,
    onremove: true
  },
  new_reqingnang: {
    subSkill: {
      off: {
        sub: true
      }
    },
    audio: 2,
    enable: "phaseUse",
    filterCard: true,
    check(card) {
      var player = _status.event.player;
      if (game.countPlayer(function(current) {
        return get.recoverEffect(current, player, player) > 0 && get.attitude(player, current) > 2;
      }) > 1 && get.color(card) == "black" && player.countCards("h", { color: "red" }) > 0) {
        return 3 - get.value(card);
      }
      return 9 - get.value(card);
    },
    filterTarget(card, player, target) {
      if (target.hp >= target.maxHp || target.hasSkill("new_reqingnang_off")) {
        return false;
      }
      return true;
    },
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      target.addTempSkill("new_reqingnang_off");
      if (get.color(cards2[0]) == "black") {
        player.tempBanSkill("new_reqingnang");
      }
      await target.recover();
    },
    ai: {
      order: 9,
      result: {
        target(player, target) {
          if (target.hp == 1) {
            return 5;
          }
          if (player == target && player.countCards("h") > player.hp) {
            return 5;
          }
          return 2;
        }
      },
      threaten: 2
    }
  },
  reyaowu: {
    trigger: { player: "damageBegin3" },
    audio: "new_reyaowu",
    forced: true,
    filter(event) {
      return event.card && (get.color(event.card) != "red" || event.source && event.source.isIn());
    },
    async content(event, trigger, player) {
      if (get.color(trigger.card) == "red") {
        await trigger.source.draw();
      } else {
        await trigger.player.draw();
      }
    },
    ai: {
      effect: {
        target: (card, player, target) => {
          if (typeof card !== "object" || !get.tag(card, "damage")) {
            return;
          }
          if (player.hasSkillTag("jueqing", false, target)) {
            return;
          }
          if (get.color(card) === "red") {
            return [1, 0, 1, 0.6];
          }
          return [1, 0.6];
        }
      }
    }
  },
  new_reyaowu: {
    trigger: {
      player: "damageBegin3"
    },
    //priority:1,
    audio: 2,
    audioname: ["sb_huaxiong", "ol_huaxiong"],
    filter(event) {
      return event.card && event.card.name == "sha" && (get.color(event.card) != "red" || event.source && event.source.isIn());
    },
    forced: true,
    async content(event, trigger, player) {
      if (get.color(trigger.card) != "red") {
        await player.draw();
      } else {
        await trigger.source.chooseDrawRecover(true);
      }
    },
    ai: {
      effect: {
        target: (card, player, target, current) => {
          if (card.name == "sha") {
            if (get.color(card) == "red") {
              let num = player.isDamaged() ? 1.6 : 0.7;
              if (get.attitude(player, target) > 0 && player.hp < 3) {
                return [1, 0, 1, num];
              }
              return [1, 0, 1, num / 2];
            }
            return [1, 0.6];
          }
        }
      }
    }
  },
  reguanxing: {
    audio: "guanxing",
    audioname: ["jiangwei", "re_jiangwei", "re_zhugeliang", "ol_jiangwei"],
    audioname2: { gexuan: "guanxing_gexuan" },
    trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
    frequent: true,
    filter(event, player, name) {
      if (name == "phaseJieshuBegin") {
        return player.hasSkill("reguanxing_on");
      }
      return true;
    },
    async content(event, trigger, player) {
      const result = await player.chooseToGuanxing(game.countPlayer() < 4 ? 3 : 5).set("prompt", "观星：点击或拖动将牌移动到牌堆顶或牌堆底").forResult();
      if ((!result.bool || !result.moved[0].length) && event.triggername == "phaseZhunbeiBegin") {
        player.addTempSkill(["reguanxing_on", "guanxing_fail"]);
      }
    },
    subSkill: {
      on: { charlotte: true }
    },
    ai: {
      guanxing: true
    }
  },
  reluoshen: {
    audio: 2,
    locked: false,
    trigger: { player: "phaseZhunbeiBegin" },
    frequent: true,
    async content(event, trigger, player) {
      player.addTempSkill("reluoshen_add");
      const cards2 = /* @__PURE__ */ new Set();
      let continuing = false;
      do {
        const next = player.judge({
          judge(card) {
            return get.color(card) === "black" ? 1.5 : -1.5;
          },
          judge2(result2) {
            return result2.bool;
          }
        });
        if (get.mode() !== "guozhan" && !player.hasSkillTag("rejudge")) {
          next.set("callback", async (event2, trigger2, player2) => {
            if (event2.judgeResult.color === "black" && get.position(event2.card, true) === "o") {
              await player2.gain({
                cards: [event2.card],
                gaintag: ["reluoshen"]
              });
            }
          });
        } else {
          next.set("callback", async (event2, trigger2, player2) => {
            if (event2.judgeResult.color === "black") {
              event2.getParent().orderingCards.remove(event2.card);
            }
          });
        }
        const result = await next.forResult();
        if (!result.bool) {
          break;
        }
        cards2.add(result.card);
        const continueResult = await player.chooseBool({ prompt: "是否继续进行判定？" }).set("frequentSkill", "reluoshen").forResult();
        continuing = continueResult.bool;
      } while (continuing);
      const gainning = [...cards2].filter((card) => get.position(card, true) === "o");
      if (gainning.length) {
        await player.gain({
          cards: gainning,
          animate: "gain2",
          gaintag: ["reluoshen"]
        });
      }
    },
    subSkill: {
      add: {
        mod: {
          ignoredHandcard(card, player) {
            if (card.hasGaintag("reluoshen")) {
              return true;
            }
          },
          cardDiscardable(card, player, name) {
            if (name == "phaseDiscard" && card.hasGaintag("reluoshen")) {
              return false;
            }
          }
        },
        onremove(player) {
          player.removeGaintag("reluoshen");
        }
      }
    }
  },
  rejieyin: {
    audio: 2,
    enable: "phaseUse",
    filterCard: true,
    usable: 1,
    position: "he",
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    check(card) {
      var player = _status.event.player;
      if (get.position(card) == "e") {
        var subtype = get.subtype(card);
        if (!game.hasPlayer(function(current) {
          return current != player && get.attitude(player, current) > 0 && !current.countCards("e", { subtype });
        })) {
          return 0;
        }
        if (player.countCards("h", { subtype })) {
          return 20 - get.value(card);
        }
        return 10 - get.value(card);
      } else {
        if (player.countCards("e")) {
          return 0;
        }
        if (player.countCards("h", { type: "equip" })) {
          return 0;
        }
        return 8 - get.value(card);
      }
    },
    filterTarget(card, player, target) {
      if (!target.hasSex("male")) {
        return false;
      }
      var card = ui.selected.cards[0];
      if (!card) {
        return false;
      }
      if (get.position(card) == "e" && !target.canEquip(card)) {
        return false;
      }
      return true;
    },
    discard: false,
    delay: false,
    lose: false,
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      let result;
      if (get.position(cards2[0]) == "e") {
        result = { index: 0 };
      } else if (get.type(cards2[0]) != "equip" || !target.canEquip(cards2[0])) {
        result = { index: 1 };
      } else {
        result = await player.chooseControl().set("choiceList", ["将" + get.translation(cards2[0]) + "置入" + get.translation(target) + "的装备区", "弃置" + get.translation(cards2[0])]).set("ai", () => 1).forResult();
      }
      if (result.index == 0) {
        player.$give(cards2, target, false);
        await target.equip(cards2[0]);
      } else {
        await player.discard(cards2);
      }
      if (player.hp > target.hp) {
        await player.draw();
        if (target.isDamaged()) {
          await target.recover();
        }
      } else if (player.hp < target.hp) {
        await target.draw();
        if (player.isDamaged()) {
          await player.recover();
        }
      }
    },
    ai: {
      order() {
        var player = _status.event.player;
        var es = player.getCards("e");
        for (var i = 0; i < es.length; i++) {
          if (player.countCards("h", { subtype: get.subtype(es[i]) })) {
            return 10;
          }
        }
        return 2;
      },
      result: {
        player(player, target) {
          if (!ui.selected.cards.length) {
            return 0;
          }
          let card = ui.selected.cards[0], val = -get.value(card, player) / 6;
          if (get.position(card) == "e") {
            val += 2;
          }
          if (player.hp > target.hp) {
            val++;
          } else if (player.hp < target.hp && player.isDamaged()) {
            val += get.recoverEffect(player, player, player) / get.attitude(player, player);
          }
          return val;
        },
        target(player, target) {
          if (!ui.selected.cards.length) {
            return 0;
          }
          let card = ui.selected.cards[0], val = get.position(card) == "e" ? get.value(card, target) / 6 : 0;
          if (target.hp > player.hp) {
            val++;
          } else if (target.hp < player.hp && target.isDamaged()) {
            val += get.recoverEffect(target, target, target) / get.attitude(target, target);
          }
          return val;
        }
      }
    }
  },
  rejiuyuan: {
    audio: 2,
    zhuSkill: true,
    trigger: { global: "recoverBefore" },
    direct: true,
    filter(event, player) {
      return player != event.player && event.player.group == "wu" && player.hp <= event.player.hp && event.getParent().name != "rejiuyuan" && player.hasZhuSkill("rejiuyuan", event.player) && event.player === _status.currentPhase;
    },
    async content(event, trigger, player) {
      const result = await trigger.player.chooseBool("是否对" + get.translation(player) + "发动【救援】？", "改为令其回复1点体力，然后你摸一张牌").set("ai", function() {
        const evt = _status.event;
        return get.attitude(evt.player, evt.getParent().player) > 0;
      }).forResult();
      if (result.bool) {
        player.logSkill("rejiuyuan");
        trigger.player.line(player, "green");
        trigger.cancel();
        await player.recover(trigger.player);
        await trigger.player.draw();
      }
    }
  },
  rezhiheng: {
    audio: 2,
    audioname2: { shen_caopi: "rezhiheng_shen_caopi", new_simayi: "rezhiheng_new_simayi" },
    mod: {
      aiOrder(player, card, num) {
        if (num <= 0 || get.itemtype(card) !== "card" || get.type(card) !== "equip") {
          return num;
        }
        let eq = player.getEquip(get.subtype(card));
        if (eq && get.equipValue(card) - get.equipValue(eq) < Math.max(1.2, 6 - player.hp)) {
          return 0;
        }
      }
    },
    locked: false,
    enable: "phaseUse",
    usable: 1,
    position: "he",
    filterCard: lib.filter.cardDiscardable,
    discard: false,
    lose: false,
    delay: false,
    selectCard: [1, Infinity],
    allowChooseAll: true,
    check(card) {
      let player = _status.event.player;
      if (get.position(card) == "h" && !player.countCards("h", "du") && (player.hp > 2 || !player.countCards("h", (i) => {
        return get.value(i) >= 8;
      }))) {
        return 1;
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
      event.num = 1;
      const hs = player.getCards("h");
      if (!hs.length) {
        event.num = 0;
      }
      for (let i = 0; i < hs.length; i++) {
        if (!cards2.includes(hs[i])) {
          event.num = 0;
          break;
        }
      }
      await player.discard(cards2);
      await player.draw(event.num + cards2.length);
    },
    //group:'rezhiheng_draw',
    subSkill: {
      draw: {
        trigger: { player: "loseEnd" },
        silent: true,
        filter(event, player) {
          if (event.getParent(2).skill != "rezhiheng" && event.getParent(2).skill != "jilue_zhiheng") {
            return false;
          }
          if (player.countCards("h")) {
            return false;
          }
          for (var i = 0; i < event.cards.length; i++) {
            if (event.cards[i].original == "h") {
              return true;
            }
          }
          return false;
        },
        async content(event, trigger, player) {
          player.addTempSkill("rezhiheng_delay", trigger.getParent(2).skill + "After");
        }
      },
      delay: {}
    },
    ai: {
      order(item, player) {
        if (player.hasCard((i) => get.value(i) > Math.max(6, 9 - player.hp), "he")) {
          return 1;
        }
        return 10;
      },
      result: {
        player: 1
      },
      nokeep: true,
      skillTagFilter(player, tag, arg) {
        if (tag === "nokeep") {
          return (!arg || arg && arg.card && get.name(arg.card) === "tao") && player.isPhaseUsing() && !player.getStat().skill.rezhiheng && player.hasCard((card) => get.name(card) !== "tao", "h");
        }
      },
      threaten: 1.55
    }
  },
  rezhiheng_new_simayi: { audio: 1 },
  reqicai: {
    audio: 2,
    mod: {
      targetInRange(card, player, target, now) {
        var type = get.type(card);
        if (type == "trick" || type == "delay") {
          return true;
        }
      },
      canBeDiscarded(card, player, target) {
        if (get.position(card) == "e" && get.subtypes(card).some((subtype) => ["equip2", "equip5"].includes(subtype)) && player != target) {
          return false;
        }
      }
    }
  },
  rejizhi: {
    audio: 2,
    audioname2: {
      lukang: "rejizhi_lukang",
      zj_lukang: "rejizhi_lukang",
      new_simayi: "rejizhi_new_simayi"
    },
    locked: false,
    trigger: { player: "useCard" },
    frequent: true,
    filter(event) {
      return get.type(event.card, "trick") == "trick" && event.card.isCard;
    },
    init(player) {
      player.storage.rejizhi = 0;
    },
    async content(event, trigger, player) {
      const result = await player.draw("nodelay").forResult();
      event.card = result.cards[0];
      if (get.type(event.card) !== "basic") {
        return;
      }
      const result2 = await player.chooseBool(`是否弃置${get.translation(event.card)}并令本回合手牌上限+1？`).set("ai", (evt, player2) => _status.currentPhase === player2 && player2.needsToDiscard(-3) && _status.event.value < 6).set("value", get.value(event.card, player)).forResult();
      if (result2.bool) {
        await player.discard(event.card);
        player.storage.rejizhi++;
        if (_status.currentPhase === player) {
          player.markSkill("rejizhi");
        }
      }
    },
    ai: {
      threaten: 1.4,
      noautowuxie: true
    },
    mod: {
      maxHandcard(player, num) {
        return num + player.storage.rejizhi;
      }
    },
    intro: {
      content: "本回合手牌上限+#"
    },
    group: "rejizhi_clear",
    subSkill: {
      clear: {
        trigger: { global: "phaseAfter" },
        silent: true,
        async content(event, trigger, player) {
          player.storage.rejizhi = 0;
          player.unmarkSkill("rejizhi");
        }
      }
    }
  },
  rejizhi_new_simayi: { audio: 1 },
  rebiyue: {
    audio: 2,
    audioname2: { sp_diaochan: "biyue" },
    trigger: { player: "phaseJieshuBegin" },
    frequent: true,
    async content(event, trigger, player) {
      await player.draw(player.countCards("h") ? 1 : 2);
    }
  },
  rerende: {
    audio: 2,
    audioname: ["gz_jun_liubei"],
    audioname2: { shen_caopi: "rerende_shen_caopi" },
    enable: "phaseUse",
    filter(event, player) {
      return player.countCards("h") && game.hasPlayer((current) => get.info("rerende").filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      if (player == target) {
        return false;
      }
      return !player.getStorage("rerende_targeted").includes(target);
    },
    filterCard: true,
    selectCard: [1, Infinity],
    allowChooseAll: true,
    discard: false,
    lose: false,
    delay: false,
    check(card) {
      if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
        return 0;
      }
      if (!ui.selected.cards.length && card.name == "du") {
        return 20;
      }
      var player = get.owner(card);
      if (ui.selected.cards.length >= Math.max(2, player.countCards("h") - player.hp)) {
        return 0;
      }
      if (player.hp == player.maxHp || player.countMark("rerende") < 0 || player.countCards("h") <= 1) {
        var players = game.filterPlayer();
        for (var i = 0; i < players.length; i++) {
          if (players[i].hasSkill("haoshi") && !players[i].isTurnedOver() && !players[i].hasJudge("lebu") && get.attitude(player, players[i]) >= 3 && get.attitude(players[i], player) >= 3) {
            return 11 - get.value(card);
          }
        }
        if (player.countCards("h") > player.hp) {
          return 10 - get.value(card);
        }
        if (player.countCards("h") > 2) {
          return 6 - get.value(card);
        }
        return -1;
      }
      return 10 - get.value(card);
    },
    async content(event, trigger, player) {
      const { target, cards: cards2, name } = event;
      player.addTempSkill(name + "_targeted", "phaseUseAfter");
      player.markAuto(name + "_targeted", [target]);
      let num = 0;
      player.getHistory("lose", (evt) => {
        if (evt.getParent(2).name == name && evt.getParent("phaseUse") == event.getParent(3)) {
          num += evt.cards.length;
        }
      });
      if (!player.storage[event.name]) {
        player.when({ player: "phaseUseEnd" }).step(async () => {
          player.clearMark(event.name, false);
        });
      }
      player.addMark(event.name, num + cards2.length, false);
      await player.give(cards2, target);
      const list = get.inpileVCardList((info) => {
        return info[0] == "basic" && player.hasUseTarget(new lib.element.VCard({ name: info[2], nature: info[3], isCard: true }), null, true);
      });
      if (num < 2 && num + cards2.length > 1 && list.length) {
        const result = await player.chooseButton(["是否视为使用一张基本牌？", [list, "vcard"]]).set("ai", (button) => {
          return get.player().getUseValue({ name: button.link[2], nature: button.link[3], isCard: true });
        }).forResult();
        if (!result?.links?.length) {
          return;
        }
        await player.chooseUseTarget(get.autoViewAs({ name: result.links[0][2], nature: result.links[0][3], isCard: true }), true);
      }
    },
    ai: {
      fireAttack: true,
      order(skill, player) {
        if (player.hp < player.maxHp && player.countMark("rerende") < 2 && player.countCards("h") > 1) {
          return 10;
        }
        return 4;
      },
      result: {
        target(player, target) {
          if (target.hasSkillTag("nogain")) {
            return 0;
          }
          if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
            if (target.hasSkillTag("nodu")) {
              return 0;
            }
            return -10;
          }
          if (target.hasJudge("lebu")) {
            return 0;
          }
          var nh = target.countCards("h");
          var np = player.countCards("h");
          if (player.hp == player.maxHp || player.countMark("rerende") < 0 || player.countCards("h") <= 1) {
            if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) {
              return 0;
            }
          }
          return Math.max(1, 5 - nh);
        }
      },
      effect: {
        target_use(card, player, target) {
          if (player == target && get.type(card) == "equip") {
            if (player.countCards("e", { subtype: get.subtype(card) })) {
              if (game.hasPlayer((current) => current != player && get.attitude(player, current) > 0)) {
                return 0;
              }
            }
          }
        }
      },
      threaten: 0.8
    },
    marktext: "仁",
    onremove: true,
    intro: {
      content: "本阶段已仁德牌数：#",
      onunmark: true
    },
    subSkill: {
      targeted: {
        onremove: true,
        charlotte: true
      }
    }
  },
  liyu: {
    audio: 2,
    trigger: { source: "damageSource" },
    forced: true,
    filter(event, player) {
      if (event._notrigger.includes(event.player)) {
        return false;
      }
      return event.card && event.card.name == "sha" && event.player.isIn() && event.player.countGainableCards(player, "he") > 0;
    },
    check() {
      return false;
    },
    async content(event, trigger, player) {
      const result = await trigger.player.chooseTarget(function(card, player2, target) {
        var evt = _status.event.getParent();
        return evt.player.canUse({ name: "juedou" }, target) && target != _status.event.player;
      }, get.prompt("liyu")).set("ai", function(target) {
        var evt = _status.event.getParent();
        return get.effect(target, { name: "juedou" }, evt.player, _status.event.player) - 2;
      }).forResult();
      if (result.bool) {
        await player.gainPlayerCard(trigger.player, "he", true);
        event.target = result.targets[0];
        trigger.player.line(player, "green");
      } else {
        return;
      }
      if (event.target) {
        await player.useCard({ name: "juedou", isCard: true }, event.target, "noai");
      }
    },
    ai: {
      halfneg: true
    }
  },
  /*reqicai:{
  	trigger:{player:'equipEnd'},
  	frequent:true,
  	content:function(){
  		player.draw();
  	},
  	mod:{
  		targetInRange:function(card,player,target,now){
  			var type=get.type(card);
  			if(type=='trick'||type=='delay') return true;
  		}
  	},
  },*/
  retuxi: {
    audio: 2,
    trigger: { player: "phaseDrawBegin2" },
    direct: true,
    filter(event) {
      return event.num > 0;
    },
    async content(event, trigger, player) {
      const result = await player.chooseTarget(
        get.prompt("retuxi"),
        [1, trigger.num],
        function(card, player2, target) {
          return target.countCards("h") > 0 && player2 != target && target.countCards("h") >= player2.countCards("h");
        },
        function(target) {
          var att = get.attitude(_status.event.player, target);
          if (target.hasSkill("tuntian")) {
            return att / 10;
          }
          return 1 - att;
        }
      ).forResult();
      if (result.bool) {
        player.logSkill("retuxi", result.targets);
        await player.gainMultiple(result.targets);
        trigger.num -= result.targets.length;
      } else {
        event.finish();
        return;
      }
      if (trigger.num <= 0) {
        await game.delay();
      }
    },
    ai: {
      threaten: 1.6,
      expose: 0.2
    }
  },
  reguicai: {
    audio: 2,
    audioname2: { new_simayi: "reguicai_new_simayi" },
    trigger: { global: "judge" },
    filter(event, player) {
      return player.countCards("hes") > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard(`${get.translation(trigger.player)}的${trigger.judgestr || ""}判定为${get.translation(trigger.player.judging[0])}，${get.prompt(event.skill)}`, "hes", (card) => {
        const player2 = get.player();
        const mod2 = game.checkMod(card, player2, "unchanged", "cardEnabled2", player2);
        if (mod2 != "unchanged") {
          return mod2;
        }
        const mod = game.checkMod(card, player2, "unchanged", "cardRespondable", player2);
        if (mod != "unchanged") {
          return mod;
        }
        return true;
      }).set("ai", (card) => {
        const trigger2 = get.event().getTrigger();
        const { player: player2, judging } = get.event();
        const result = trigger2.judge(card) - trigger2.judge(judging);
        const attitude = get.attitude(player2, trigger2.player);
        let val = get.value(card);
        if (get.subtype(card) == "equip2") {
          val /= 2;
        } else {
          val /= 4;
        }
        if (attitude == 0 || result == 0) {
          return 0;
        }
        if (attitude > 0) {
          return result - val;
        }
        return -result - val;
      }).set("judging", trigger.player.judging[0]).setHiddenSkill(event.skill).forResult();
    },
    preHidden: true,
    popup: false,
    async content(event, trigger, player) {
      const next = player.respond(event.cards, event.name, "highlight", "noOrdering");
      await next;
      const { cards: cards2 } = next;
      if (cards2?.length) {
        if (trigger.player.judging[0].clone) {
          trigger.player.judging[0].clone.classList.remove("thrownhighlight");
          game.broadcast(function(card) {
            if (card.clone) {
              card.clone.classList.remove("thrownhighlight");
            }
          }, trigger.player.judging[0]);
          game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
        }
        await game.cardsDiscard(trigger.player.judging[0]);
        trigger.player.judging[0] = cards2[0];
        trigger.orderingCards.addArray(cards2);
        game.log(trigger.player, "的判定牌改为", cards2);
        await game.delay(2);
      }
    },
    ai: {
      rejudge: true,
      tag: { rejudge: 1 }
    },
    subSkill: { new_simayi: { audio: 2 } }
  },
  refankui: {
    audio: 2,
    audioname2: { boss_chujiangwang: "boss_chujiangwang_fankui", sxrm_caocao: "refankui_sxrm_caocao", tw_sxrm_caocao: "refankui_sxrm_caocao" },
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return event.source && event.source.countGainableCards(player, event.source != player ? "he" : "e") && event.num > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.choosePlayerCard(get.prompt(event.skill, trigger.source), trigger.source, trigger.source != player ? "he" : "e").set("ai", (button) => {
        let val = get.buttonValue(button);
        if (get.event().att > 0) {
          return 1 - val;
        }
        return val;
      }).set("att", get.attitude(player, trigger.source)).forResult();
    },
    logTarget: "source",
    getIndex(event, player) {
      return event.num;
    },
    async content(event, trigger, player) {
      await player.gain(event.cards, trigger.source, "giveAuto", "bySelf");
    },
    ai: {
      maixie_defend: true,
      effect: {
        target(card, player, target) {
          if (player.countCards("he") > 1 && get.tag(card, "damage")) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return [1, -1.5];
            }
            if (get.attitude(target, player) < 0) {
              return [1, 1];
            }
          }
        }
      }
    }
  },
  reluoyi: {
    audio: 2,
    trigger: { player: "phaseDrawBegin1" },
    filter(event, player) {
      return !event.numFixed;
    },
    check(event, player) {
      if (player.countCards("h", "sha")) {
        return true;
      }
      return Math.random() < 0.5;
    },
    async content(event, trigger, player) {
      player.addTempSkill("reluoyi2", { player: "phaseBefore" });
      trigger.changeToZero();
      event.cards = get.cards(3);
      await player.showCards(event.cards, "裸衣");
      const cards2 = event.cards;
      for (let i = 0; i < cards2.length; i++) {
        if (get.type(cards2[i]) != "basic" && cards2[i].name != "juedou" && (get.type(cards2[i]) != "equip" || get.subtype(cards2[i]) != "equip1")) {
          cards2[i].discard();
          cards2.splice(i--, 1);
        }
      }
      await player.gain(cards2, "gain2");
    }
  },
  reluoyi2: {
    trigger: { source: "damageBegin1" },
    sourceSkill: "reluoyi",
    filter(event) {
      return event.card && (event.card.name == "sha" || event.card.name == "juedou") && event.notLink();
    },
    forced: true,
    charlotte: true,
    async content(event, trigger, player) {
      trigger.num++;
    },
    ai: {
      damageBonus: true,
      skillTagFilter(player, tag, arg) {
        if (tag === "damageBonus") {
          return arg && arg.card && (arg.card.name === "sha" || arg.card.name === "juedou");
        }
      }
    }
  },
  reganglie: {
    audio: 2,
    audioname2: { sxrm_caocao: "reganglie_sxrm_caocao", tw_sxrm_caocao: "reganglie_sxrm_caocao" },
    trigger: { player: "damageEnd" },
    getIndex(event, player, triggername) {
      if (get.mode() == "guozhan") {
        return 1;
      }
      return event.num;
    },
    filter(event) {
      return event.num > 0;
    },
    check(event, player) {
      if (!event.source?.isIn()) {
        return Math.random() < 0.5;
      }
      return get.attitude(player, event.source) <= 0;
    },
    prompt2(event, player) {
      let str = "你可以判定";
      if (event.source?.isIn()) {
        str += `，若结果为：红色，你对${get.translation(event.source)}造成1点伤害；黑色，你弃置${get.translation(event.source)}一张牌。`;
      } else {
        str += "。";
      }
      return str;
    },
    preHidden: true,
    async content(event, trigger, player) {
      const { source } = trigger;
      const result = await player.judge((card) => {
        if (get.color(card) == "red") {
          return 1;
        }
        return 0;
      }).forResult();
      if (!source?.isIn()) {
        return;
      }
      switch (result?.color) {
        case "black":
          if (source.countDiscardableCards(player, "he")) {
            await player.discardPlayerCard(source, "he", true);
          }
          break;
        case "red":
          await source.damage();
          break;
      }
    },
    ai: {
      maixie_defend: true,
      expose: 0.4
    }
  },
  qinxue: {
    skillAnimation: true,
    animationColor: "wood",
    audio: 2,
    juexingji: true,
    derivation: "gongxin",
    trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
    forced: true,
    filter(event, player) {
      if (player.countCards("h") >= player.hp + 2) {
        return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      const { name } = event;
      player.awakenSkill(name);
      await player.loseMaxHp();
      await player.chooseDrawRecover(2, true);
      await player.addSkills("gongxin");
    }
  },
  qingjian: {
    audio: 2,
    trigger: { player: "gainAfter" },
    direct: true,
    usable: 4,
    filter(event, player) {
      var evt = event.getParent("phaseDraw");
      if (evt && evt.player == player) {
        return false;
      }
      return event.getg(player).length > 0;
    },
    async content(event, trigger, player) {
      let result;
      event.cards = trigger.getg(player);
      while (true) {
        result = await player.chooseCardTarget({
          filterCard(card) {
            return _status.event.getParent().cards.includes(card);
          },
          selectCard: [1, event.cards.length],
          filterTarget(card, player2, target) {
            return player2 != target;
          },
          allowChooseAll: true,
          ai1(card) {
            if (ui.selected.cards.length > 0) {
              return -1;
            }
            if (card.name == "du") {
              return 20;
            }
            return _status.event.player.countCards("h") - _status.event.player.hp;
          },
          ai2(target) {
            var att = get.attitude(_status.event.player, target);
            if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
              if (target.hasSkillTag("nodu")) {
                return 0;
              }
              return 1 - att;
            }
            if (target.countCards("h") > _status.event.player.countCards("h")) {
              return 0;
            }
            return att - 4;
          },
          prompt: "请选择要送人的卡牌"
        }).forResult();
        if (result.bool) {
          player.storage.qingjian++;
          player.logSkill("qingjian", result.targets);
          await result.targets[0].gain(result.cards, player, "give");
          for (var i = 0; i < result.cards.length; i++) {
            event.cards.remove(result.cards[i]);
          }
          if (event.cards.length) {
            continue;
          }
          break;
        } else {
          player.storage.counttrigger.qingjian--;
          break;
        }
      }
    },
    ai: {
      expose: 0.3
    }
  },
  reyingzi: {
    audio: 2,
    audioname: ["sunce", "re_sunben", "re_sunce"],
    audioname2: {
      gexuan: "reyingzi_gexuan",
      re_sunyi: "reyingzi_re_sunyi",
      heqi: "reyingzi_heqi",
      re_heqi: "reyingzi_heqi",
      boss_sunce: "reyingzi_sunce"
    },
    trigger: { player: "phaseDrawBegin2" },
    forced: true,
    preHidden: true,
    filter(event, player) {
      return !event.numFixed;
    },
    async content(event, trigger, player) {
      trigger.num++;
    },
    ai: {
      threaten: 1.5
    },
    mod: {
      maxHandcardBase(player, num) {
        return player.maxHp;
      }
    }
  },
  refanjian: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    filterTarget(card, player, target) {
      return player != target;
    },
    filterCard: true,
    check(card) {
      return 8 - get.value(card);
    },
    discard: false,
    lose: false,
    delay: false,
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      let result;
      target.storage.refanjian = cards2[0];
      await player.give(cards2[0], target);
      if (!target.countCards("h")) {
        result = { control: "refanjian_hp" };
      } else {
        result = await target.chooseControl("refanjian_card", "refanjian_hp").set("ai", function(event2, player2) {
          var cards3 = player2.getCards("he", { suit: get.suit(player2.storage.refanjian) });
          if (cards3.length == 1) {
            return 0;
          }
          if (cards3.length >= 2) {
            for (var i = 0; i < cards3.length; i++) {
              if (get.tag(cards3[i], "save")) {
                return 1;
              }
            }
          }
          if (player2.hp == 1) {
            return 0;
          }
          for (var i = 0; i < cards3.length; i++) {
            if (get.value(cards3[i]) >= 8) {
              return 1;
            }
          }
          if (cards3.length > 2 && player2.hp > 2) {
            return 1;
          }
          if (cards3.length > 3) {
            return 1;
          }
          return 0;
        }).forResult();
      }
      if (result.control == "refanjian_card") {
        await target.showHandcards();
      } else {
        await target.loseHp();
        return;
      }
      const suit = get.suit(target.storage.refanjian);
      await target.discard(
        target.getCards("he", function(i) {
          return get.suit(i) == suit && lib.filter.cardDiscardable(i, target, "refanjian");
        })
      );
      delete target.storage.refanjian;
    },
    ai: {
      order: 9,
      result: {
        target(player, target) {
          return -target.countCards("he") - (player.countCards("h", "du") ? 1 : 0);
        }
      },
      threaten: 2
    }
  },
  reqianxun: {
    audio: 2,
    trigger: {
      target: "useCardToBegin",
      player: "judgeBefore"
    },
    filter(event, player) {
      if (player.countCards("h") == 0) {
        return false;
      }
      if (event.getParent().name == "phaseJudge") {
        return true;
      }
      if (event.name == "judge") {
        return false;
      }
      if (event.targets && event.targets.length > 1) {
        return false;
      }
      if (event.card && get.type(event.card) == "trick" && event.player != player) {
        return true;
      }
    },
    async content(event, trigger, player) {
      const cards2 = player.getCards("h");
      if (!cards2.length) {
        return;
      }
      const next = player.addToExpansion(cards2, "giveAuto", player);
      next.gaintag.add("reqianxun2");
      await next;
      player.addSkill("reqianxun2");
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (player == target || !target.hasFriend()) {
            return;
          }
          var type = get.type(card);
          var nh = Math.min(
            target.countCards(),
            game.countPlayer((i) => get.attitude(target, i) > 0)
          );
          if (type == "trick") {
            if (!get.tag(card, "multitarget") || get.info(card).singleCard) {
              if (get.tag(card, "damage")) {
                return [1.5, nh - 1];
              }
              return [1, nh];
            }
          } else if (type == "delay") {
            return [0.5, 0.5];
          }
        }
      }
    }
  },
  reqianxun2: {
    trigger: { global: "phaseEnd" },
    forced: true,
    audio: false,
    sourceSkill: "reqianxun",
    async content(event, trigger, player) {
      const cards2 = player.getExpansions("reqianxun2");
      if (cards2.length) {
        await player.gain(cards2, "draw");
      }
      player.removeSkill("reqianxun2");
    },
    intro: {
      mark(dialog, storage, player) {
        var cards2 = player.getExpansions("reqianxun2");
        if (player.isUnderControl(true)) {
          dialog.addAuto(cards2);
        } else {
          return "共有" + get.cnNumber(cards2.length) + "张牌";
        }
      },
      markcount: "expansion"
    }
  },
  relianying: {
    audio: 2,
    trigger: {
      player: "loseAfter",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    direct: true,
    filter(event, player) {
      if (player.countCards("h")) {
        return false;
      }
      var evt = event.getl(player);
      return evt && evt.hs && evt.hs.length;
    },
    async content(event, trigger, player) {
      const num = trigger.getl(player).hs.length;
      const result = await player.chooseTarget(get.prompt("relianying"), "令至多" + get.cnNumber(num) + "名角色各摸一张牌", [1, num]).set("ai", function(target) {
        const player2 = _status.event.player;
        if (player2 == target) {
          return get.attitude(player2, target) + 10;
        }
        return get.attitude(player2, target);
      }).forResult();
      if (!result?.bool) return;
      player.logSkill("relianying", result.targets);
      await game.asyncDraw(result.targets);
      await game.delay();
    },
    ai: {
      threaten: 0.8,
      effect: {
        player_use(card, player, target) {
          if (player.countCards("h") === 1) {
            return [1, 0.8];
          }
        },
        target(card, player, target) {
          if (get.tag(card, "loseCard") && target.countCards("h") === 1) {
            return 0.5;
          }
        }
      },
      noh: true,
      freeSha: true,
      freeShan: true,
      skillTagFilter(player) {
        return player.countCards("h") === 1;
      }
    }
  },
  retishen: {
    audio: 2,
    skillAnimation: true,
    animationColor: "soil",
    limited: true,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      if (typeof player.storage.retishen2 == "number") {
        return player.hp < player.storage.retishen2;
      }
      return false;
    },
    check(event, player) {
      if (player.hp <= 1) {
        return true;
      }
      return player.hp < player.storage.retishen2 - 1;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.recover(player.storage.retishen2 - player.hp);
      await player.draw(player.storage.retishen2 - player.hp);
    },
    intro: {
      mark(dialog, content, player) {
        if (player.storage.retishen) {
          return;
        }
        if (typeof player.storage.retishen2 != "number") {
          return "上回合体力：无";
        }
        return "上回合体力：" + player.storage.retishen2;
      },
      content: "limited"
    },
    group: ["retishen2"]
  },
  retishen2: {
    trigger: { player: "phaseJieshuBegin" },
    priority: -10,
    silent: true,
    sourceSkill: "retishen",
    async content(event, trigger, player) {
      player.storage.retishen2 = player.hp;
      game.broadcast((pl) => {
        pl.storage.retishen2 = pl.hp;
      }, player);
      game.addVideo("storage", player, ["retishen2", player.storage.retishen2]);
    },
    intro: {
      content(storage, player) {
        if (player.storage.retishen) {
          return;
        }
        return "上回合体力：" + storage;
      }
    }
  },
  reyajiao: {
    audio: 2,
    trigger: { player: ["respond", "useCard"] },
    frequent: true,
    filter(event, player) {
      return player != _status.currentPhase && get.itemtype(event.cards) == "cards";
    },
    async content(event, trigger, player) {
      let result;
      event.card = get.cards()[0];
      game.broadcast(function(card) {
        ui.arena.classList.add("thrownhighlight");
        card.copy("thrown", "center", "thrownhighlight", ui.arena).addTempClass("start");
      }, event.card);
      event.node = event.card.copy("thrown", "center", "thrownhighlight", ui.arena).addTempClass("start");
      ui.arena.classList.add("thrownhighlight");
      game.addVideo("thrownhighlight1");
      game.addVideo("centernode", null, get.cardInfo(event.card));
      if (get.type(event.card, "trick") == get.type(trigger.card, "trick")) {
        result = await player.chooseTarget("选择获得此牌的角色").set("ai", function(target) {
          var att = get.attitude(_status.event.player, target);
          if (_status.event.du) {
            if (target.hasSkillTag("nodu")) {
              return 0;
            }
            return -att;
          }
          if (att > 0) {
            return att + Math.max(0, 5 - target.countCards("h"));
          }
          return att;
        }).set("du", event.card.name == "du").forResult();
      } else {
        result = await player.chooseBool("是否弃置" + get.translation(event.card) + "？").forResult();
        event.disbool = true;
      }
      await game.delay(2);
      if (event.disbool) {
        if (!result.bool) {
          game.log(player, "展示了", event.card);
          ui.cardPile.insertBefore(event.card, ui.cardPile.firstChild);
        } else {
          game.log(player, "展示并弃掉了", event.card);
          await event.card.discard();
        }
        game.addVideo("deletenode", player, [get.cardInfo(event.node)]);
        event.node.delete();
        game.broadcast(function(card) {
          ui.arena.classList.remove("thrownhighlight");
          if (card.clone) {
            card.clone.delete();
          }
        }, event.card);
      } else if (result.targets) {
        player.line(result.targets, "green");
        await result.targets[0].gain(event.card, "log");
        event.node.moveDelete(result.targets[0]);
        game.addVideo("gain2", result.targets[0], [get.cardInfo(event.node)]);
        game.broadcast(
          function(card, target) {
            ui.arena.classList.remove("thrownhighlight");
            if (card.clone) {
              card.clone.moveDelete(target);
            }
          },
          event.card,
          result.targets[0]
        );
      } else {
        game.log(player, "展示并弃掉了", event.card);
        await event.card.discard();
        game.addVideo("deletenode", player, [get.cardInfo(event.node)]);
        event.node.delete();
        game.broadcast(function(card) {
          ui.arena.classList.remove("thrownhighlight");
          if (card.clone) {
            card.clone.delete();
          }
        }, event.card);
      }
      game.addVideo("thrownhighlight2");
      ui.arena.classList.remove("thrownhighlight");
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (get.tag(card, "respond") && target.countCards("h") > 1) {
            return [1, 0.2];
          }
        }
      }
    }
  },
  rejianxiong: {
    audio: 2,
    audioname: ["shen_caopi", "mb_caocao"],
    audioname2: { caoteng: "rejianxiong_caoteng" },
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return get.itemtype(event.cards) == "cards" && get.position(event.cards[0], true) == "o";
    },
    async content(event, trigger, player) {
      player.$gain2(trigger.cards);
      await player.gain(trigger.cards);
      await player.draw();
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return [1, -1];
          }
          if (get.tag(card, "damage")) {
            return [1, 0.55];
          }
        }
      }
    }
  },
  rejianxiong_old: {
    audio: "rejianxiong",
    audioname2: {
      gz_caocao: "jianxiong"
    },
    trigger: { player: "damageEnd" },
    async cost(event, trigger, player) {
      let list = ["摸牌"];
      if (get.itemtype(trigger.cards) == "cards" && trigger.cards.filterInD().length) {
        list.push("拿牌");
      }
      list.push("cancel2");
      const { control } = await player.chooseControl(list).set("prompt", get.prompt2(event.skill)).set("ai", () => {
        const player2 = get.event().player, trigger2 = get.event().getTrigger();
        const cards2 = trigger2.cards ? trigger2.cards.filterInD() : [];
        if (get.event().controls.includes("拿牌")) {
          if (cards2.reduce((sum, card) => {
            return sum + (card.name == "du" ? -1 : 1);
          }, 0) > 1 || player2.getUseValue(cards2[0]) > 6) {
            return "拿牌";
          }
        }
        return "摸牌";
      }).forResult();
      event.result = { bool: control != "cancel2", cost_data: control };
    },
    async content(event, trigger, player) {
      if (event.cost_data == "摸牌") {
        await player.draw();
      } else {
        await player.gain(trigger.cards.filterInD(), "gain2");
      }
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return [1, -1];
          }
          if (get.tag(card, "damage") && player != target) {
            return [1, 0.6];
          }
        }
      }
    }
  },
  reyiji: {
    audio: 2,
    audioname: ["yj_sb_guojia", "yj_sb_guojia_shadow"],
    trigger: { player: "damageEnd" },
    frequent: true,
    filter(event) {
      return event.num > 0;
    },
    async content(event, trigger, player) {
      event.num = 1;
      event.count = 1;
      let result;
      while (event.count <= trigger.num) {
        await player.gain(get.cards(2));
        player.$draw(2);
        while (true) {
          result = await player.chooseCardTarget({
            filterCard: true,
            selectCard: [1, 2],
            filterTarget(card, player2, target) {
              return player2 != target && target != event.temp;
            },
            ai1(card) {
              if (ui.selected.cards.length > 0) return -1;
              if (card.name == "du") return 20;
              return _status.event.player.countCards("h") - _status.event.player.hp;
            },
            ai2(target) {
              var att = get.attitude(_status.event.player, target);
              if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
                if (target.hasSkillTag("nodu")) return 0;
                return 1 - att;
              }
              return att - 4;
            },
            prompt: "请选择要送人的卡牌"
          }).forResult();
          if (result?.bool) {
            await player.lose(result.cards, ui.special, "toStorage");
            const tar = result.targets[0];
            if (tar.hasSkill("reyiji2")) {
              tar.storage.reyiji2 = tar.storage.reyiji2.concat(result.cards);
            } else {
              tar.addSkill("reyiji2");
              tar.storage.reyiji2 = result.cards;
            }
            player.$give(result.cards.length, tar, false);
            player.line(result.targets, "green");
            game.addVideo("storage", tar, ["reyiji2", get.cardsInfo(tar.storage.reyiji2), "cards"]);
            if (event.num === 1) {
              event.temp = tar;
              event.num++;
              continue;
            }
            delete event.temp;
            event.num = 1;
            event.count++;
            break;
          } else {
            if (event.count < trigger.num) {
              delete event.temp;
              event.num = 1;
              event.count++;
              break;
            }
            return;
          }
        }
      }
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage")) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return [1, -2];
            }
            if (!target.hasFriend()) {
              return;
            }
            var num = 1;
            if (get.attitude(player, target) > 0) {
              if (player.needsToDiscard()) {
                num = 0.7;
              } else {
                num = 0.5;
              }
            }
            if (player.hp >= 4) {
              return [1, num * 2];
            }
            if (target.hp == 3) {
              return [1, num * 1.5];
            }
            if (target.hp == 2) {
              return [1, num * 0.5];
            }
          }
        }
      },
      threaten: 0.6
    }
  },
  reyiji2: {
    trigger: { player: "phaseDrawBegin" },
    forced: true,
    mark: true,
    popup: "遗计拿牌",
    audio: false,
    sourceSkill: "reyiji",
    async content(event, trigger, player) {
      await player.$draw(player.storage.reyiji2.length);
      await player.gain(player.storage.reyiji2, "fromStorage");
      delete player.storage.reyiji2;
      player.removeSkill("reyiji2");
      await game.delay();
    },
    intro: {
      content: "cardCount"
    }
  },
  yijue: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return player != target && target.countCards("h");
    },
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      const { target } = event;
      let result;
      result = await player.chooseToCompare(target).set("small", true).forResult();
      if (result.bool) {
        if (!target.hasSkill("fengyin")) {
          target.addTempSkill("fengyin");
        }
        target.addTempSkill("yijue2");
        return;
      } else if (target.hp < target.maxHp) {
        result = await player.chooseBool("是否让目标回复1点体力？").set("ai", function() {
          return get.recoverEffect(target, player, player) > 0;
        }).forResult();
      } else {
        return;
      }
      if (result.bool) {
        await target.recover();
      }
    },
    ai: {
      result: {
        target(player, target) {
          var hs = player.getCards("h");
          if (hs.length < 3) {
            return 0;
          }
          var bool = false;
          for (var i = 0; i < hs.length; i++) {
            if (get.number(hs[i]) >= 9 && get.value(hs[i]) < 7) {
              bool = true;
              break;
            }
          }
          if (!bool) {
            return 0;
          }
          if (target.countCards("h") > target.hp + 1 && get.recoverEffect(target) > 0) {
            return 1;
          }
          if (player.canUse("sha", target) && (player.countCards("h", "sha") || player.countCards("he", { color: "red" }))) {
            return -2;
          }
          return -0.5;
        }
      },
      order: 9
    }
  },
  yijue2: {
    charlotte: true,
    mark: true,
    mod: {
      cardEnabled2(card) {
        if (get.position(card) == "h") {
          return false;
        }
      }
    },
    intro: { content: "不能使用或打出手牌" }
  },
  retieji: {
    audio: 2,
    audioname: ["boss_lvbu3", "tw_dm_quyi"],
    trigger: { player: "useCardToPlayered" },
    check(event, player) {
      return get.attitude(player, event.target) <= 0;
    },
    filter(event, player) {
      return event.card.name == "sha";
    },
    logTarget: "target",
    async content(event, trigger, player) {
      let result;
      result = await player.judge(function() {
        return 0;
      }).forResult();
      if (!trigger.target.hasSkill("fengyin")) {
        trigger.target.addTempSkill("fengyin");
      }
      const suit = result.suit;
      const target = trigger.target;
      const num = target.countCards("h", "shan");
      result = await target.chooseToGive({
        target: player,
        filterCard(card) {
          return get.suit(card) === get.event().suit;
        },
        position: "he",
        prompt: `请交给${get.translation(player)}一张${get.translation(suit)}牌，否则不能使用闪抵消此杀且此杀伤害+1`,
        ai(card) {
          const num2 = get.event().num;
          if (num2 == 0) {
            return 0;
          }
          if (card.name == "shan") {
            return num2 > 1 ? 2 : 0;
          }
          return 8 - get.value(card);
        }
      }).set("num", num).set("suit", suit).forResult();
      if (!result.bool) {
        trigger.getParent().directHit.add(trigger.target);
        if (typeof trigger.getParent().baseDamage !== "number") {
          trigger.getParent().baseDamage = 1;
        }
        trigger.getParent().baseDamage++;
      }
    },
    ai: {
      ignoreSkill: true,
      skillTagFilter(player, tag, arg) {
        if (tag == "directHit_ai") {
          return arg?.target && get.attitude(player, arg.target) <= 0;
        }
        if (!arg || arg.isLink || !arg.card || arg.card.name != "sha") {
          return false;
        }
        if (!arg.target || get.attitude(player, arg.target) >= 0) {
          return false;
        }
        if (!arg.skill || !lib.skill[arg.skill] || lib.skill[arg.skill].charlotte || lib.skill[arg.skill].persevereSkill || get.is.locked(arg.skill) || !arg.target.getSkills(true, false).includes(arg.skill)) {
          return false;
        }
      },
      directHit_ai: true
    }
  },
  reyicong: {
    trigger: {
      player: ["changeHp"]
    },
    audio: 2,
    audioname2: { gongsunzan: "yicong" },
    forced: true,
    filter(event, player) {
      return get.sgn(player.hp - 2.5) != get.sgn(player.hp - 2.5 - event.num);
    },
    async content(event, trigger, player) {
    },
    mod: {
      globalFrom(from, to, current) {
        return current - 1;
      },
      globalTo(from, to, current) {
        if (to.hp <= 2) {
          return current + 1;
        }
      }
    },
    ai: {
      threaten: 0.8
    }
  },
  reqiaomeng: {
    audio: "qiaomeng",
    trigger: { source: "damageSource" },
    direct: true,
    filter(event, player) {
      if (event._notrigger.includes(event.player)) {
        return false;
      }
      return event.card && event.card.name == "sha" && event.player.countDiscardableCards(player, "hej");
    },
    async content(event, trigger, player) {
      const result = await player.discardPlayerCard(get.prompt("reqiaomeng", trigger.player), "hej", trigger.player).set("logSkill", ["reqiaomeng", trigger.player]).forResult();
      if (result?.bool) {
        const card = result.cards[0];
        if (get.position(card) == "d") {
          const subtype = get.subtype(card);
          if (subtype == "equip3" || subtype == "equip4" || subtype == "equip6") {
            await player.gain(card, player, "gain2");
          }
        }
      }
    }
  },
  qiaomeng: {
    audio: 2,
    audioname: ["xin_gongsunzan"],
    trigger: { source: "damageSource" },
    direct: true,
    filter(event, player) {
      if (event._notrigger.includes(event.player)) {
        return false;
      }
      return event.card && event.card.name == "sha" && event.cards && get.color(event.cards) == "black" && event.player.countDiscardableCards(player, "e");
    },
    async content(event, trigger, player) {
      let result;
      result = await player.discardPlayerCard(get.prompt("qiaomeng", trigger.player), "e", trigger.player).set("logSkill", ["qiaomeng", trigger.player]).forResult();
      if (result?.bool) {
        const card = result.cards[0];
        if (get.position(card) == "d") {
          const subtype = get.subtype(card);
          if (subtype == "equip3" || subtype == "equip4" || subtype == "equip6") {
            await player.gain(card, player, "gain2");
          }
        }
      }
    }
  },
  rekurou: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterCard: lib.filter.cardDiscardable,
    check(card) {
      return 8 - get.value(card);
    },
    position: "he",
    async content(event, trigger, player) {
      await player.loseHp();
    },
    ai: {
      order: 8,
      result: {
        player(player) {
          if (player.needsToDiscard(3) && !player.hasValueTarget({ name: "sha" }, false)) {
            return -1;
          }
          return get.effect(player, { name: "losehp" }, player, player);
        }
      },
      neg: true
    }
  },
  zhaxiang: {
    audio: 2,
    audioname2: { ol_sb_jiangwei: "zhaxiang_ol_sb_jiangwei" },
    trigger: { player: "loseHpEnd" },
    filter(event, player) {
      return player.isIn() && event.num > 0;
    },
    getIndex: (event) => event.num,
    forced: true,
    async content(event, trigger, player) {
      await player.draw(3);
      if (player.isPhaseUsing()) {
        player.addTempSkill(event.name + "_effect");
        player.addMark(event.name + "_effect", 1, false);
      }
    },
    subSkill: {
      effect: {
        mod: {
          targetInRange(card, player, target, now) {
            if (card.name == "sha" && get.color(card) == "red") {
              return true;
            }
          },
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.countMark("zhaxiang_effect");
            }
          }
        },
        charlotte: true,
        onremove: true,
        audio: "zhaxiang",
        audioname2: { ol_sb_jiangwei: "zhaxiang_ol_sb_jiangwei" },
        trigger: { player: "useCard" },
        sourceSkill: "zhaxiang",
        filter(event, player) {
          return event.card?.name == "sha" && get.color(event.card) == "red";
        },
        forced: true,
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.players);
        },
        intro: { content: "<li>使用【杀】的次数上限+#<br><li>使用红色【杀】无距离限制且不能被【闪】响应" },
        ai: {
          directHit_ai: true,
          skillTagFilter(player, tag, arg) {
            return arg?.card?.name == "sha" && get.color(arg.card) == "red";
          }
        }
      }
    },
    ai: {
      maihp: true,
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage")) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return [1, 1];
            }
            return 1.2;
          }
          if (get.tag(card, "loseHp")) {
            if (target.hp <= 1) {
              return;
            }
            var using = target.isPhaseUsing();
            if (target.hp <= 2) {
              return [1, player.countCards("h") <= 1 && using ? 3 : 0];
            }
            if (using && target.countCards("h", { name: "sha", color: "red" })) {
              return [1, 3];
            }
            return [1, target.countCards("h") <= target.hp || using && game.hasPlayer((current) => current != player && get.attitude(player, current) < 0 && player.inRange(current)) ? 3 : 2];
          }
        }
      }
    }
  },
  zhuhai: {
    audio: 2,
    audioname: ["gz_re_xushu"],
    trigger: { global: "phaseJieshuBegin" },
    direct: true,
    filter(event, player) {
      return event.player.isIn() && event.player.getStat("damage") && lib.filter.targetEnabled({ name: "sha" }, player, event.player) && (player.hasSha() || _status.connectMode && player.countCards("h") > 0);
    },
    clearTime: true,
    async content(event, trigger, player) {
      await player.chooseToUse(
        function(card, player2, event2) {
          if (get.name(card) != "sha") {
            return false;
          }
          return lib.filter.filterCard.apply(this, arguments);
        },
        "诛害：是否对" + get.translation(trigger.player) + "使用一张杀？"
      ).set("logSkill", "zhuhai").set("complexSelect", true).set("complexTarget", true).set("filterTarget", function(card, player2, target) {
        if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
          return false;
        }
        return lib.filter.targetEnabled.apply(this, arguments);
      }).set("sourcex", trigger.player);
    }
  },
  qianxin: {
    skillAnimation: true,
    animationColor: "orange",
    audio: 2,
    juexingji: true,
    trigger: { source: "damageSource" },
    forced: true,
    derivation: "jianyan",
    filter(event, player) {
      return player.hp < player.maxHp;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.addSkills("jianyan");
      await player.loseMaxHp();
    }
  },
  jianyan: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    delay: false,
    filter(event, player) {
      return game.hasPlayer(function(current) {
        return current.hasSex("male");
      });
    },
    async content(event, trigger, player) {
      let result;
      result = await player.chooseControl(["red", "black", "basic", "trick", "equip"]).set("ai", function() {
        var player2 = _status.event.player;
        if (!player2.hasShan()) {
          return "basic";
        }
        if (player2.countCards("e") <= 1) {
          return "equip";
        }
        if (player2.countCards("h") > 2) {
          return "trick";
        }
        return "red";
      }).forResult();
      let func = function(card) {
        if (get.color(card) == result.control) {
          return true;
        }
        if (get.type(card, "trick") == result.control) {
          return true;
        }
        return false;
      };
      event.card = get.cardPile(func, "cardPile", "top");
      if (!event.card) {
        if (get.cardPile(func, "discardPile", "top")) {
          await game.washCard();
          event.card = get.cardPile(func, "cardPile", "top");
        }
        if (!event.card) {
          return;
        }
      }
      await player.showCards([event.card]);
      result = await player.chooseTarget(true, "选择一名男性角色送出" + get.translation(event.card), function(card, player2, target) {
        return target.hasSex("male");
      }).set("ai", function(target) {
        var att = get.attitude(_status.event.player, target);
        if (_status.event.neg) {
          return -att;
        }
        return att;
      }).set("neg", get.value(event.card, player, "raw") < 0).forResult();
      player.line(result.targets, "green");
      await result.targets[0].gain(event.card, "gain2");
    },
    ai: {
      order: 9,
      result: {
        player(player) {
          if (game.hasPlayer(function(current) {
            return current.hasSex("male") && get.attitude(player, current) > 0;
          })) {
            return 2;
          }
          return 0;
        }
      },
      threaten: 1.2
    }
  },
  reguose: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    discard: false,
    lose: false,
    delay: false,
    filter(event, player) {
      return player.countCards("hes", { suit: "diamond" }) > 0;
    },
    position: "hes",
    filterCard: { suit: "diamond" },
    filterTarget(card, player, target) {
      if (get.position(ui.selected.cards[0]) != "s" && lib.filter.cardDiscardable(ui.selected.cards[0], player, "reguose") && target.hasJudge("lebu")) {
        return true;
      }
      if (player == target) {
        return false;
      }
      if (!game.checkMod(ui.selected.cards[0], player, "unchanged", "cardEnabled2", player)) {
        return false;
      }
      return player.canUse({ name: "lebu", cards: ui.selected.cards }, target);
    },
    check(card) {
      return 7 - get.value(card);
    },
    async content(event, trigger, player) {
      const { target } = event;
      if (event.target.hasJudge("lebu")) {
        await player.discard(event.cards);
        await target.discard(event.target.getJudge("lebu"));
      } else {
        await player.useCard({ name: "lebu" }, event.target, event.cards).set("audio", false);
      }
      await player.draw();
    },
    ai: {
      result: {
        target(player, target) {
          if (target.hasJudge("lebu")) {
            return -get.effect(target, { name: "lebu" }, player, target);
          }
          return get.effect(target, { name: "lebu" }, player, target);
        }
      },
      order: 9
    }
  },
  fenwei: {
    audio: 2,
    audioname2: { heqi: "fenwei_heqi" },
    limited: true,
    trigger: { global: "useCardToPlayered" },
    filter(event, player) {
      if (event.getParent().triggeredTargets3.length > 1) {
        return false;
      }
      if (get.type(event.card) != "trick") {
        return false;
      }
      if (get.info(event.card).multitarget) {
        return false;
      }
      if (event.targets.length < 2) {
        return false;
      }
      return true;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), `令${get.translation(trigger.card)}对任意名角色无效`, [1, trigger.targets.length], (card, player2, target) => {
        return get.event().targets.includes(target);
      }).set("ai", (target) => {
        const player2 = get.player();
        const trigger2 = get.event().getTrigger();
        return -get.effect(target, trigger2.card, trigger2.player, player2);
      }).set("targets", trigger.targets).forResult();
    },
    skillAnimation: true,
    animationColor: "wood",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      trigger.getParent().excluded.addArray(event.targets);
      await game.delayx();
    }
  },
  chulao: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      if (player == target) {
        return false;
      }
      if (target.group == "unknown") {
        return false;
      }
      for (var i = 0; i < ui.selected.targets.length; i++) {
        if (ui.selected.targets[i].group == target.group) {
          return false;
        }
      }
      return target.countCards("he") > 0;
    },
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    filterCard: true,
    position: "he",
    selectTarget: [1, Infinity],
    check(card) {
      if (get.suit(card) == "spade") {
        return 8 - get.value(card);
      }
      return 5 - get.value(card);
    },
    async content(event, trigger, player) {
      const { num, cards: cards2, targets } = event;
      let result;
      if (num == 0 && get.suit(cards2[0]) == "spade") {
        await player.draw();
      }
      result = await player.choosePlayerCard(targets[num], "he", true).forResult();
      if (result.bool) {
        if (result.links && result.links.length) {
          await targets[num].discard(result.links[0]);
        }
        if (get.suit(result.links[0]) == "spade") {
          await targets[num].draw();
        }
      }
    },
    ai: {
      result: {
        target: -1
      },
      threaten: 1.2,
      order: 3
    }
  },
  xunxun: {
    audio: 2,
    trigger: { player: "phaseDrawBegin1" },
    preHidden: true,
    frequent: true,
    async content(event, trigger, player) {
      const cards2 = get.cards(4, true);
      await game.cardsGotoOrdering(cards2);
      const result = await player.chooseToMove("恂恂：将两张牌置于牌堆顶（靠左的牌更靠上）", true).set("list", [["牌堆顶", cards2], ["牌堆底"]]).set("filterMove", function(from, to, moved) {
        if (to == 1 && moved[1].length >= 2) {
          return false;
        }
        return true;
      }).set("filterOk", function(moved) {
        return moved[1].length == 2;
      }).set("processAI", function(list) {
        var cards3 = list[0][1].slice(0).sort(function(a, b) {
          return get.value(b) - get.value(a);
        });
        return [cards3, cards3.splice(2)];
      }).forResult();
      const top = result.moved[0];
      const bottom = result.moved[1];
      top.reverse();
      player.popup(`${get.cnNumber(top.length)}上${get.cnNumber(bottom.length)}下`);
      await game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event2, card) => {
        if (event2.top_cards.includes(card)) {
          return ui.cardPile.firstChild;
        }
        return null;
      });
    }
  },
  wangxi: {
    audio: 2,
    trigger: { player: "damageEnd", source: "damageSource" },
    getIndex: (event) => event.num,
    filter(event) {
      if (event._notrigger.includes(event.player)) {
        return false;
      }
      return event.num && event.source?.isIn() && event.player?.isIn() && event.source != event.player;
    },
    check(event, player) {
      if (player.isPhaseUsing()) {
        return true;
      }
      if (event.player == player) {
        return get.attitude(player, event.source) > -3;
      }
      return get.attitude(player, event.player) > -3;
    },
    logTarget(event, player) {
      if (event.player == player) {
        return event.source;
      }
      return event.player;
    },
    preHidden: true,
    async content(event, trigger, player) {
      await game.asyncDraw([trigger.player, trigger.source].sortBySeat());
    },
    ai: {
      maixie: true,
      maixie_hp: true
    }
  },
  refangquan: {
    audio: 2,
    trigger: { player: "phaseUseBefore" },
    filter(event, player) {
      return player.countCards("h") > 0 && !player.hasSkill("fangquan3");
    },
    direct: true,
    async content(event, trigger, player) {
      let result;
      var fang = player.countMark("fangquan2") == 0 && player.hp >= 2 && player.countCards("h") <= player.maxHp + 1;
      result = await player.chooseBool(get.prompt2("refangquan")).set("ai", function() {
        if (!_status.event.fang) {
          return false;
        }
        return game.hasPlayer(function(target) {
          if (target.hasJudge("lebu") || target == player) {
            return false;
          }
          if (get.attitude(player, target) > 4) {
            return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1) > 0;
          }
          return false;
        });
      }).set("fang", fang).forResult();
      if (result.bool) {
        player.logSkill("refangquan");
        trigger.cancel();
        player.addTempSkill("fangquan2", "phaseAfter");
        player.addMark("fangquan2", 1, false);
        player.addTempSkill("refangquan2");
      }
    }
  },
  refangquan2: {
    mod: {
      maxHandcardBase(player, num) {
        return player.maxHp;
      }
    }
  },
  rehunzi: {
    inherit: "hunzi",
    filter(event, player) {
      return player.hp <= 2 && !player.storage.rehunzi;
    },
    ai: {
      threaten(player, target) {
        if (target.hp <= 2) {
          return 2;
        }
        return 0.5;
      },
      maixie: true,
      effect: {
        target(card, player, target) {
          if (!target.hasFriend()) {
            return;
          }
          if (target.hp === 3 && get.tag(card, "damage") == 1 && !target.isTurnedOver() && _status.currentPhase != target && get.distance(_status.currentPhase, target, "absolute") <= 3) {
            return [0.5, 1];
          }
          if (target.hp === 1 && get.tag(card, "recover") && !target.isTurnedOver() && _status.currentPhase !== target && get.distance(_status.currentPhase, target, "absolute") <= 3) {
            return [1, -3];
          }
        }
      }
    }
  },
  rezhijian: {
    inherit: "zhijian",
    group: ["rezhijian_use"],
    subfrequent: ["use"],
    subSkill: {
      use: {
        audio: "rezhijian",
        trigger: { player: "useCard" },
        frequent: true,
        filter(event, player) {
          return get.type(event.card) == "equip";
        },
        prompt: "是否发动【直谏】摸一张牌？",
        async content(event, trigger, player) {
          await player.draw("nodelay");
        }
      }
    }
  },
  retuntian: {
    audio: 2,
    trigger: {
      player: "loseAfter",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    frequent: true,
    filter(event, player) {
      if (player == _status.currentPhase) {
        return false;
      }
      if (event.name == "gain" && event.player == player) {
        return false;
      }
      var evt = event.getl(player);
      return evt && evt.cards2 && evt.cards2.length > 0;
    },
    async content(event, trigger, player) {
      const judgeEvent = player.judge(function(card) {
        return 1;
      });
      judgeEvent.callback = lib.skill.retuntian.callback;
      await judgeEvent;
    },
    async callback(event, trigger, player) {
      let result;
      const { card } = event;
      if (event.judgeResult.suit == "heart") {
        player.gain(card, "gain2");
        return;
      } else if (get.mode() == "guozhan") {
        result = await player.chooseBool("是否将" + get.translation(card) + "作为“田”置于武将牌上？").set("frequentSkill", "retuntian").set("ai", function() {
          return true;
        }).forResult();
      } else {
        result = { bool: true };
      }
      if (!result.bool) {
        return;
      }
      const next = player.addToExpansion(card, "gain2");
      next.gaintag.add("tuntian");
      await next;
    },
    group: "tuntian_dist",
    locked: false,
    ai: {
      effect: {
        target() {
          return lib.skill.tuntian.ai.effect.target.apply(this, arguments);
        }
      },
      threaten(player, target) {
        if (target.countCards("h") == 0) {
          return 2;
        }
        return 0.5;
      },
      nodiscard: true,
      nolose: true,
      notemp: true
    }
  },
  rebeige: {
    audio: "beige",
    audioname: ["re_caiwenji"],
    trigger: { global: "damageEnd" },
    filter(event, player) {
      return event.card && event.card.name == "sha" && event.source && event.player.classList.contains("dead") == false && player.countCards("he");
    },
    direct: true,
    checkx(event, player) {
      var att1 = get.attitude(player, event.player);
      var att2 = get.attitude(player, event.source);
      return att1 > 0 && att2 <= 0;
    },
    async content(event, trigger, player) {
      let result;
      const next = player.chooseToDiscard("he", get.prompt2("rebeige", trigger.player));
      const check = lib.skill.beige.checkx(trigger, player);
      next.set("ai", function(card) {
        if (_status.event.goon) {
          return 8 - get.value(card);
        }
        return 0;
      });
      next.set("logSkill", "rebeige");
      next.set("goon", check);
      result = await next.forResult();
      if (result.bool) {
        result = await trigger.player.judge().forResult();
      } else {
        return;
      }
      switch (result.suit) {
        case "heart":
          trigger.player.recover(trigger.num);
          break;
        case "diamond":
          trigger.player.draw(3);
          break;
        case "club":
          await trigger.source.chooseToDiscard("he", 2, true);
          break;
        case "spade":
          trigger.source.turnOver();
          break;
      }
    },
    ai: {
      expose: 0.3
    }
  },
  rexingshang: {
    audio: 2,
    audioname: ["v_caopi"],
    audioname2: { caoying: "lingren_xingshang" },
    trigger: { global: "die" },
    filter(event, player) {
      return player.isDamaged() || event.player.countCards("he") > 0;
    },
    direct: true,
    async content(event, trigger, player) {
      let result;
      const choice = [];
      if (player.isDamaged()) {
        choice.push("回复体力");
      }
      if (trigger.player.countCards("he")) {
        choice.push("获得牌");
      }
      choice.push("cancel2");
      result = await player.chooseControl(choice).set("prompt", get.prompt2("rexingshang")).set("ai", function() {
        if (choice.length == 2) {
          return 0;
        }
        if (get.value(trigger.player.getCards("he")) > 8) {
          return 1;
        }
        return 0;
      }).forResult();
      if (result.control != "cancel2") {
        player.logSkill(event.name, trigger.player);
        if (result.control == "获得牌") {
          const togain = trigger.player.getCards("he");
          await player.gain(togain, trigger.player, "giveAuto", "bySelf");
        } else {
          await player.recover();
        }
      }
    }
  },
  refangzhu: {
    audio: 2,
    trigger: {
      player: "damageEnd"
    },
    direct: true,
    async content(event, trigger, player) {
      let result;
      let next = player.chooseTarget(get.prompt2("refangzhu"), function(card, player2, target) {
        return player2 != target;
      });
      next.ai = function(target) {
        if (target.hasSkillTag("noturn")) {
          return 0;
        }
        var player2 = _status.event.player;
        if (get.attitude(_status.event.player, target) == 0) {
          return 0;
        }
        if (get.attitude(_status.event.player, target) > 0) {
          if (target.classList.contains("turnedover")) {
            return 1e3 - target.countCards("h");
          }
          if (player2.getDamagedHp() < 3) {
            return -1;
          }
          return 100 - target.countCards("h");
        } else {
          if (target.classList.contains("turnedover")) {
            return -1;
          }
          if (player2.getDamagedHp() >= 3) {
            return -1;
          }
          return 1 + target.countCards("h");
        }
      };
      result = await next.forResult();
      if (result.bool) {
        player.logSkill("refangzhu", result.targets);
        event.target = result.targets[0];
        if (player.isHealthy()) {
          result = { bool: false };
        } else {
          let next2 = event.target.chooseToDiscard("he", player.getDamagedHp());
          next2.set("ai", function(card) {
            var player2 = _status.event.player;
            if (player2.isTurnedOver() || _status.event.getTrigger().player.getDamagedHp() > 2) {
              return -1;
            }
            return player2.hp * player2.hp - get.value(card);
          });
          next2.set("prompt", "弃置" + get.cnNumber(player.getDamagedHp()) + "张牌并失去1点体力；或选择不弃置，将武将牌翻面并摸" + get.cnNumber(player.getDamagedHp()) + "张牌。");
          result = await next2.forResult();
        }
      } else {
        return;
      }
      if (result.bool) {
        await event.target.loseHp();
      } else {
        if (player.isDamaged()) {
          await event.target.draw(player.getDamagedHp()).forResult();
        }
        await event.target.turnOver().forResult();
      }
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage")) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return [1, -1.5];
            }
            if (target.hp <= 1) {
              return;
            }
            if (!target.hasFriend()) {
              return;
            }
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
            if (get.attitude(player, target) > 0 && !hastarget) {
              return;
            }
            if (turnfriend || target.hp == target.maxHp) {
              return [0.5, 1];
            }
            if (target.hp > 1) {
              return [1, 0.5];
            }
          }
        }
      }
    }
  },
  repolu: {
    audio: 1,
    trigger: {
      source: "dieAfter",
      player: "die"
    },
    forceDie: true,
    filter(event, player, name) {
      return name == "die" || player.isIn();
    },
    direct: true,
    async content(event, trigger, player) {
      let result;
      if (!player.storage.repolu) {
        player.storage.repolu = 0;
      }
      event.num = player.storage.repolu + 1;
      result = await player.chooseTarget([1, Infinity], get.prompt("repolu"), "令任意名角色摸" + get.cnNumber(event.num) + "张牌").set("forceDie", true).set("ai", (target) => {
        return get.attitude(_status.event.player, target);
      }).forResult();
      if (result.bool) {
        player.storage.repolu++;
        result.targets.sortBySeat();
        player.logSkill("repolu", result.targets);
        await game.asyncDraw(result.targets, event.num);
      } else {
        return;
      }
      await game.delay();
    }
  },
  oljiuchi: {
    mod: {
      cardUsable(card, player, num) {
        if (card.name == "jiu") {
          return Infinity;
        }
      }
    },
    audio: 2,
    enable: "chooseToUse",
    filterCard(card) {
      return get.suit(card) == "spade";
    },
    viewAs: { name: "jiu" },
    position: "hs",
    viewAsFilter(player) {
      return player.hasCard((card) => get.suit(card) == "spade", "hs");
    },
    prompt: "将一张黑桃手牌当酒使用",
    check(cardx, player) {
      if (player && player == cardx.player) {
        return true;
      }
      if (_status.event.type == "dying") {
        return 1;
      }
      var player = _status.event.player;
      var shas = player.getCards("hs", function(card2) {
        return card2 != cardx && get.name(card2, player) == "sha";
      });
      if (!shas.length) {
        return -1;
      }
      if (shas.length > 1 && (player.getCardUsable("sha") > 1 || player.countCards("hs", "zhuge"))) {
        return 0;
      }
      shas.sort(function(a, b) {
        return get.order(b) - get.order(a);
      });
      var card = false;
      if (shas.length) {
        for (var i = 0; i < shas.length; i++) {
          if (shas[i] != cardx && lib.filter.filterCard(shas[i], player)) {
            card = shas[i];
            break;
          }
        }
      }
      if (card) {
        if (game.hasPlayer(function(current) {
          return get.attitude(player, current) < 0 && !current.hasShan() && current.hp + current.countCards("h", { name: ["tao", "jiu"] }) > 1 + (player.storage.jiu || 0) && player.canUse(card, current, true, true) && !current.hasSkillTag("filterDamage", null, {
            player,
            card,
            jiu: true
          }) && get.effect(current, card, player) > 0;
        })) {
          return 4 - get.value(cardx);
        }
      }
      return -1;
    },
    ai: {
      threaten: 1.5
    },
    trigger: { source: "damageEnd" },
    locked: false,
    forced: true,
    filter(event, player) {
      if (event.name == "chooseToUse") {
        return player.hasCard((card) => get.suit(card) == "spade", "hs");
      }
      return event.card && event.card.name == "sha" && event.getParent(2).jiu == true && !player.isTempBanned("benghuai");
    },
    async content(event, trigger, player) {
      player.logSkill("oljiuchi");
      player.tempBanSkill("benghuai");
    }
  },
  rezaiqi: {
    audio: 2,
    direct: true,
    filter(event, player) {
      return lib.skill.rezaiqi.count() > 0;
    },
    trigger: {
      player: "phaseJieshuBegin"
    },
    async content(event, trigger, player) {
      let result;
      result = await player.chooseTarget([1, lib.skill.rezaiqi.count()], get.prompt2("rezaiqi")).set("ai", function(target) {
        return get.attitude(_status.event.player, target);
      }).forResult();
      if (result.bool) {
        var targets = result.targets;
        targets.sortBySeat();
        player.line(targets, "fire");
        player.logSkill("rezaiqi", targets);
        event.targets = targets;
      } else {
        return;
      }
      while (event.targets.length) {
        event.current = event.targets.shift();
        if (player.isHealthy()) {
          result = { index: 0 };
        } else {
          result = await event.current.chooseControl().set("choiceList", ["摸一张牌", "令" + get.translation(player) + "回复1点体力"]).set("ai", function() {
            if (get.attitude(event.current, player) > 0) {
              return 1;
            }
            return 0;
          }).forResult();
        }
        if (result.index == 1) {
          event.current.line(player);
          await player.recover(event.current);
        } else {
          await event.current.draw();
        }
        await game.delay();
      }
    },
    count: () => get.discarded().filter((card) => get.color(card) === "red").length
  }
};
const translates = {
  re_zhangliao: "界张辽",
  re_zhangliao_prefix: "界",
  re_simayi: "界司马懿",
  re_simayi_prefix: "界",
  re_xuzhu: "界许褚",
  re_xuzhu_prefix: "界",
  re_xiahoudun: "界夏侯惇",
  re_xiahoudun_prefix: "界",
  re_lvmeng: "界吕蒙",
  re_lvmeng_prefix: "界",
  re_zhouyu: "界周瑜",
  re_zhouyu_prefix: "界",
  re_luxun: "界陆逊",
  re_luxun_prefix: "界",
  re_zhaoyun: "界赵云",
  re_zhaoyun_prefix: "界",
  re_guanyu: "界关羽",
  re_guanyu_prefix: "界",
  re_zhangfei: "界张飞",
  re_zhangfei_prefix: "界",
  re_machao: "界马超",
  re_machao_prefix: "界",
  re_caocao: "界曹操",
  re_caocao_prefix: "界",
  re_guojia: "界郭嘉",
  re_guojia_prefix: "界",
  re_lvbu: "界吕布",
  re_lvbu_prefix: "界",
  re_huanggai: "界黄盖",
  re_huanggai_prefix: "界",
  re_daqiao: "界大乔",
  re_daqiao_prefix: "界",
  re_ganning: "界甘宁",
  re_ganning_prefix: "界",
  re_huatuo: "界华佗",
  re_huatuo_prefix: "界",
  re_liubei: "界刘备",
  re_liubei_prefix: "界",
  re_diaochan: "界貂蝉",
  re_diaochan_prefix: "界",
  re_huangyueying: "界黄月英",
  re_huangyueying_prefix: "界",
  re_sunquan: "界孙权",
  re_sunquan_prefix: "界",
  re_sunshangxiang: "界孙尚香",
  re_sunshangxiang_prefix: "界",
  re_zhugeliang: "界诸葛亮",
  re_zhugeliang_prefix: "界",
  re_zhenji: "界甄宓",
  re_zhenji_prefix: "界",
  re_huaxiong: "界华雄",
  re_huaxiong_prefix: "界",
  ol_sp_zhugeliang: "界卧龙",
  ol_sp_zhugeliang_prefix: "界",
  re_zhangjiao: "界张角",
  re_zhangjiao_prefix: "界",
  re_sunce: "界孙策",
  re_sunce_prefix: "界",
  ol_yuanshao: "界袁绍",
  ol_yuanshao_prefix: "界",
  ol_liushan: "界刘禅",
  ol_liushan_prefix: "界",
  olfangquan: "放权",
  olfangquan_info: "出牌阶段开始前，你可以跳过此阶段。若如此做，弃牌阶段开始时，你可以弃置一张手牌，令一名其他角色进行一个额外回合。",
  olruoyu: "若愚",
  olruoyu_info: "主公技，觉醒技，准备阶段，若你的体力值为全场最少，则你加1点体力上限，将体力回复至3点，然后获得技能〖思蜀〗和〖激将〗。",
  sishu: "思蜀",
  sishu_info: "出牌阶段开始时，你可以选择一名角色。该角色本局游戏内【乐不思蜀】的判定效果反转。",
  olluanji: "乱击",
  olluanji_info: "你可以将两张花色相同的手牌当做【万箭齐发】使用。当你使用【万箭齐发】选择目标后，你可以为此牌减少一个目标。",
  olluanji_remove: "乱击",
  olxueyi: "血裔",
  olxueyi_info: "主公技，锁定技。①游戏开始时，你获得2X个“裔”标记（X为场上群势力角色的数目）。②出牌阶段开始时，你可以移去一个“裔”标记，然后摸一张牌。③你的手牌上限+Y（Y为“裔”标记数）。",
  olxueyi_draw: "血裔",
  olhunzi: "魂姿",
  olhunzi_info: "觉醒技，准备阶段，若你的体力值为1，你减1点体力上限并获得技能〖英姿〗和〖英魂〗；本回合的结束阶段，你摸两张牌或回复1点体力。",
  olzhiba: "制霸",
  olzhiba_info: "主公技，其他吴势力的角色的出牌阶段限一次，其可以与你拼点（你可拒绝此拼点）；你的出牌阶段限一次，你可以和一名吴势力角色拼点：若其没赢，你获得两张拼点牌。",
  olzhiba2: "制霸",
  xinleiji: "雷击",
  xinleiji_misa: "雷击",
  xinguidao: "鬼道",
  xinleiji_info: "①当你使用【闪】或【闪电】，或打出【闪】时，你可以进行判定。②当你的判定的判定牌生效后，若结果为：黑桃，你可对一名角色造成2点雷电伤害；梅花：你回复1点体力并可对一名角色造成1点雷电伤害。",
  xinleiji_append: '<span style="font-family:yuanli">不能触发〖雷击〗的判定：〖暴虐〗、〖助祭〗、<br>〖弘仪〗、〖孤影〗。</span>',
  xinleiji_faq: "不能触发〖雷击〗的判定",
  xinleiji_faq_info: "<br>董卓/界董卓〖暴虐〗<br>黄巾雷使〖助祭〗<br>羊徽瑜〖弘仪〗<br>鸣濑白羽〖孤影〗",
  xinguidao_info: "一名角色的判定牌生效前，你可以打出一张黑色牌作为判定牌并获得原判定牌。若你以此法打出的牌为黑桃2-9，则你摸一张牌。",
  xinhuangtian: "黄天",
  xinhuangtian2: "黄天",
  xinhuangtian_info: "主公技。其他群势力角色的出牌阶段限一次，该角色可以交给你一张【闪】或黑桃手牌。",
  reqiangxi: "强袭",
  reqiangxi_info: "出牌阶段对每名其他角色限一次，你可以选择一项：1. 失去1点体力并对你攻击范围内的一名其他角色造成1点伤害；2. 弃置一张武器牌并对你攻击范围内的一名其他角色造成1点伤害。",
  rehuoji: "火计",
  rehuoji_info: "你可一张红色牌当作【火攻】使用。",
  rekanpo: "看破",
  rekanpo_info: "你可以将一张黑色牌当作【无懈可击】使用。",
  reshuangxiong: "双雄",
  reshuangxiong1: "双雄",
  reshuangxiong2: "双雄",
  reshuangxiong_info: "摸牌阶段，你可以放弃摸牌。若如此做，你亮出牌堆顶的两张牌并选择获得其中的一张。然后，你本回合内可以将与此牌颜色不同的一张手牌当做【决斗】使用。当你受到此【决斗】造成的伤害时，你可以获得对方于此决斗中打出的所有【杀】。",
  reguanxing: "观星",
  reguanxing_info: "准备阶段，你可以观看牌堆顶的五张牌（存活角色小于4时改为三张），并将其以任意顺序置于牌堆顶或牌堆底，若你将〖观星〗的牌都放在了牌堆底，则你可以在结束阶段再次发动〖观星〗。",
  reluoshen: "洛神",
  reluoshen_info: "准备阶段，你可以进行判定，若结果为黑色则获得此判定牌，且可重复此流程直到出现红色的判定结果。你通过〖洛神〗得到的牌不计入当前回合的手牌上限。",
  reluoshen_info_guozhan: "准备阶段，你可以进行判定，若为黑色则可以继续判定，直到出现红色。然后你获得所有黑色的判定牌。你通过〖洛神〗得到的牌不计入当前回合的手牌上限（结果为黑色的判定牌于此过程中不会进入弃牌堆）。",
  rejieyin: "结姻",
  rejieyin_info: "出牌阶段限一次，你可以选择一名男性角色并弃置一张手牌或将装备区内的一张装备牌置于其装备区，你与其体力较高的角色摸一张牌，体力值较低的角色回复1点体力。",
  rebiyue: "闭月",
  rebiyue_info: "结束阶段，你可以摸一张牌，若你没有手牌，则改为摸两张牌。",
  rejizhi: "集智",
  rejizhi_info: "当你使用锦囊牌时，你可以摸一张牌。若此牌为基本牌，则你可以弃置之，然后令本回合手牌上限+1。",
  reqicai: "奇才",
  reqicai_info: "锁定技，你使用锦囊牌无距离限制，你装备区内的防具牌和宝物牌不能被其他角色弃置。",
  rezhiheng: "制衡",
  rezhiheng_info: "出牌阶段限一次，你可以弃置任意张牌并摸等量的牌，若你在发动〖制衡〗时弃置了所有手牌，则你多摸一张牌。",
  rejiuyuan: "救援",
  rejiuyuan_info: "主公技，其他吴势力角色于其回合内回复体力时，若其体力值大于等于你，则该角色可以改为令你回复1点体力，然后其摸一张牌。",
  new_yajiao: "涯角",
  new_yajiao_info: "每当你于回合外使用或打出牌时，你可以亮出牌堆顶的一张牌，并将其交给一名角色。若此牌与你此次使用或打出的牌类别不同，则你弃置一张牌。",
  new_liyu: "利驭",
  new_liyu_info: "当你使用【杀】对一名其他角色造成伤害后，你可以获得其区域内的一张牌。若此牌不为装备牌，则其摸一张牌。若此牌为装备牌，则视为你对其选择的另一名角色使用一张【决斗】。",
  new_retuxi: "突袭",
  new_retuxi_info: "摸牌阶段摸牌时，你可以少摸任意张牌，然后获得等量的角色的各一张手牌。",
  new_retuxi_info_guozhan: "摸牌阶段摸牌时，你可以少摸至多两张牌，然后获得等量的角色的各一张手牌。",
  reyiji_tag: "已分配",
  new_reyiji: "遗计",
  new_reyiji_info: "当你受到1点伤害后，你可以摸两张牌，然后可以将至多两张手牌交给其他角色。",
  new_rejianxiong: "奸雄",
  new_rejianxiong_info: "当你受到伤害后，你可以获得对你造成伤害的牌并摸一张牌。",
  new_reluoyi: "裸衣",
  new_reluoyi_info: "摸牌阶段开始时，你亮出牌堆顶的三张牌。然后，你可以放弃摸牌。若如此做，你获得其中的基本牌、武器牌和【决斗】，且直到你的下回合开始，你使用的【杀】或【决斗】造成伤害时，此伤害+1。否则，你将这些牌置入弃牌堆。",
  new_rewusheng: "武圣",
  new_rewusheng_info: "你可以将一张红色牌当做【杀】使用或打出。你使用的方片【杀】没有距离限制。",
  new_yijue: "义绝",
  new_yijue_info: "出牌阶段限一次，你可以弃置一张牌并令一名有手牌的其他角色展示一张手牌。若此牌为黑色，则该角色不能使用或打出手牌，非锁定技失效且受到来自你的红桃【杀】的伤害+1直到回合结束。若此牌为红色，则你可以获得此牌，并可以令其回复1点体力。",
  new_repaoxiao: "咆哮",
  new_repaoxiao_info: "锁定技，出牌阶段，你使用【杀】没有数量限制。若你于此出牌阶段内使用过【杀】，则你本回合内使用【杀】没有距离限制。",
  new_tishen: "替身",
  new_tishen_info: "出牌阶段结束时，你可以弃置你所有的锦囊牌与坐骑牌。若如此做，直到你的下个回合开始，当一张【杀】结算结束后，若你是此牌目标且你未受到此牌伤害，你获得此牌对应的所有实体牌。",
  new_tishen2: "替身",
  new_tishen2_info: "",
  new_qingjian: "清俭",
  new_qingjian_info: "每回合限一次。当你于摸牌阶段外得到牌后，你可以展示任意张牌并交给一名其他角色。然后，当前回合角色本回合的手牌上限+X（X为你给出的牌中包含的类别数）。",
  qingjian_add: "清俭",
  qingjian_add_info: "",
  new_reqingnang: "青囊",
  new_reqingnang_info: "出牌阶段，你可以弃置一张手牌，令一名本回合内未成为过〖青囊〗的目标的角色回复1点体力。若你弃置的是黑色牌，则你本回合内不能再发动〖青囊〗。",
  new_reyaowu: "耀武",
  new_reyaowu_info: "锁定技，当一名角色使用【杀】对你造成伤害时，若此【杀】为红色，该角色回复1点体力或摸一张牌。否则你摸一张牌。",
  reyaowu: "耀武",
  reyaowu_info: "锁定技，当你受到牌造成的伤害时，若此牌为红色，则伤害来源摸一张牌；否则你摸一张牌。",
  reqingguo: "倾国",
  reqingguo_info: "你可以将一张黑色牌当做【闪】使用或打出。",
  qinxue: "勤学",
  retuxi: "突袭",
  reluoyi: "裸衣",
  reluoyi2: "裸衣",
  reganglie: "刚烈",
  qingjian: "清俭",
  reyingzi: "英姿",
  refanjian: "反间",
  refanjian_card: "弃牌",
  refanjian_hp: "失去体力",
  reqianxun: "谦逊",
  reqianxun2: "谦逊",
  relianying: "连营",
  retishen: "替身",
  retishen2: "替身",
  reyajiao: "涯角",
  rejianxiong: "奸雄",
  rejianxiong_mopai: "摸牌",
  rejianxiong_napai: "拿牌",
  reyiji: "遗计",
  reyiji2: "遗计",
  yijue: "义绝",
  yijue2: "义绝",
  retieji: "铁骑",
  refankui: "反馈",
  reyicong: "义从",
  qiaomeng: "趫猛",
  rekurou: "苦肉",
  zhaxiang: "诈降",
  zhaxiang2: "诈降",
  zhuhai: "诛害",
  qianxin: "潜心",
  jianyan: "荐言",
  reguicai: "鬼才",
  xunxun: "恂恂",
  wangxi: "忘隙",
  reguose: "国色",
  fenwei: "奋威",
  chulao: "除疠",
  liyu: "利驭",
  rerende: "仁德",
  rerende_info: "出牌阶段，你可以将至少一张手牌交给其他角色，然后你于此阶段内不能再以此法交给该角色牌；若你于此阶段内给出的牌首次达到两张，你可以视为使用一张基本牌。",
  liyu_info: "当你使用【杀】对一名其他角色造成伤害后，该角色可令你获得其一张牌，若如此做，则视为你对其选择的另一名角色使用一张【决斗】。",
  xunxun_info: "摸牌阶段，你可以观看牌堆顶的四张牌，然后将其中的两张牌置于牌堆顶，并将其余的牌以任意顺序置于牌堆底。",
  wangxi_info: "每当你对其他角色造成1点伤害后，或受到其他角色造成的1点伤害后，你可与该角色各摸一张牌。",
  reguose_info: "出牌阶段限一次，你可以选择一项：将一张方片花色牌当做【乐不思蜀】使用；或弃置一张方片花色牌并弃置场上的一张【乐不思蜀】。选择完成后，你摸一张牌。",
  fenwei_info: "限定技，当一名角色使用的锦囊牌指定了至少两名角色为目标时，你可以令此牌对其中任意名角色无效。",
  chulao_info: "出牌阶段限一次，若你有牌，你可以选择任意名势力各不相同的其他角色，你弃置你和这些角色的各一张牌。然后以此法弃置黑桃牌的角色各摸一张牌。",
  reguicai_info: "在任意角色的判定牌生效前，你可以打出一张牌代替之。",
  zhuhai_info: "其他角色的结束阶段开始时，若该角色本回合造成过伤害，你可以对其使用一张【杀】。",
  qianxin_info: "觉醒技，当你造成一次伤害后，若你已受伤，你须减1点体力上限，并获得技能〖荐言〗。",
  jianyan_info: "出牌阶段限一次，你可以声明一种牌的类别或颜色，并亮出牌库中第一张符合你声明的牌，然后你令一名男性角色获得此牌。",
  rekurou_info: "出牌阶段限一次，你可以弃置一张牌，然后失去1点体力。",
  zhaxiang_info: "锁定技。当你失去1点体力后，你摸三张牌。然后若此时是你的出牌阶段，则你本回合获得此下效果：使用【杀】的次数上限+1，使用红色【杀】无距离限制且不能被【闪】响应。",
  qiaomeng_info: "当你使用黑色【杀】对一名角色造成伤害后，你可以弃置该角色装备区里的一张牌，若此牌是坐骑牌，你于此牌置入弃牌堆后获得之。",
  reyicong_info: "锁定技，你计算与其他角色的距离时-1。若你的体力值不大于2，则其他角色计算与你的距离时+1。",
  refankui_info: "每当你受到1点伤害后，你可以获得伤害来源的一张牌。",
  retieji_info: "当你使用【杀】指定一名角色为目标后，你可以进行一次判定并令该角色的非锁定技失效直到回合结束，除非该角色交给你一张与判定结果花色相同的牌，否则不能使用【闪】抵消此【杀】且此【杀】伤害+1。",
  yijue_info: "出牌阶段限一次，你可以与一名其他角色拼点，若你赢，则直到回合结束，该角色不能使用或打出手牌且其非锁定技失效，若你没赢，你可令该角色回复1点体力。",
  reyiji_info: "每当你受到1点伤害后，你可以摸两张牌。然后你可以在至多两名角色的武将牌旁边分别扣置至多两张手牌，这些角色的下个摸牌阶段开始时，该角色获得其武将牌旁的这些牌。",
  rejianxiong_info: "每当你受到伤害后，你可以获得对你造成伤害的牌，然后摸一张牌。",
  reyajiao_info: "每当你于回合外使用或打出一张手牌时，你可以亮出牌堆顶的一张牌，若此牌与你此次使用或打出的牌类别相同，你可以将之交给任意一名角色；若不同则你可以将之置入弃牌堆。",
  retishen_info: "限定技，准备阶段开始时，你可以将体力回复至等同于你上回合结束时的体力值，然后你每以此法回复1点体力，便摸一张牌。",
  reqianxun_info: "每当一张延时类锦囊牌或其他角色使用的普通锦囊牌生效时，若你是此牌的唯一目标，你可以将所有手牌置于你的武将牌上，若如此做，此回合结束时，你获得你武将牌上的所有牌。",
  relianying_info: "当你失去最后的手牌时，你可以令至多X名角色各摸一张牌（X为你此次失去的手牌数）。",
  reyingzi_info: "锁定技，摸牌阶段摸牌时，你额外摸一张牌；你的手牌上限为你的体力上限。",
  refanjian_info: "出牌阶段限一次，你可以展示一张手牌并将此牌交给一名其他角色。然后该角色选择一项：展示其手牌并弃置所有与此牌花色相同的牌，或失去1点体力。",
  qingjian_info: "每当你于摸牌阶段外得到牌时，你可以将其中任意牌以任意顺序交给其他角色，每回合最多发动四次。",
  qinxue_info: "觉醒技。准备阶段或结束阶段开始时，若你的手牌数减体力值大于1，则你减1点体力上限，回复1点体力或摸两张牌，获得技能〖攻心〗。",
  retuxi_info: "摸牌阶段摸牌时，你可以少摸任意张牌，然后选择等量的手牌数大于或等于你的其他角色，获得这些角色的各一张手牌。",
  reluoyi_info: "你可以跳过摸牌阶段，然后亮出牌堆顶的三张牌，获得其中的基本牌、武器牌和【决斗】，若如此做，直到你的下回合开始，你为伤害来源的【杀】或【决斗】造成的伤害+1。",
  reganglie_info: "当你受到1点伤害后，你可进行判定，若结果为：红色，你对伤害来源造成1点伤害；黑色，你弃置伤害来源一张牌。",
  reganglie_info_guozhan: "当你受到伤害后，你可进行判定，若结果为：红色，你对伤害来源造成1点伤害；黑色，你弃置伤害来源一张牌。",
  botu: "博图",
  botu_info: "回合结束时，若你本回合出牌阶段内使用的牌包含四种花色，则你可以进行一个额外回合。",
  rebotu: "博图",
  rebotu_info: "每轮限X次。回合结束时，若本回合内置入弃牌堆的牌中包含至少四种花色，则你可获得一个额外的回合。（X为存活角色数且至多为3）",
  xin_yuji: "界于吉",
  xin_yuji_prefix: "界",
  re_zuoci: "界左慈",
  re_zuoci_prefix: "界",
  reguhuo: "蛊惑",
  reguhuo_info: "每名角色的回合限一次，你可以扣置一张手牌当作一张基本牌或普通锦囊牌使用或打出。其他角色同时选择是否质疑。然后，你展示此牌。若有质疑的角色：若此牌为假，则此牌作废，且所有质疑者各摸一张牌；为真，则所有质疑角色于此牌结算完成后依次弃置一张牌或失去1点体力，并获得技能〖缠怨〗。",
  rechanyuan: "缠怨",
  rechanyuan_info: "锁定技，你不能于〖蛊惑〗的结算流程中进行质疑。当你的体力值不大于1时，你的其他技能失效。",
  reguhuo_ally: "信任",
  reguhuo_betray: "质疑",
  reguhuo_ally_bg: "真",
  reguhuo_betray_bg: "假",
  rehuashen: "化身",
  rehuashen_info: "游戏开始时，你随机获得三张未加入游戏的武将牌，选一张置于你面前并声明该武将牌的一项技能，你拥有该技能且同时将性别和势力属性变成与该武将相同直到该化身被替换。回合开始时或回合结束时，你可以选择一项：①弃置至多两张未展示的化身牌并重新获得等量化身牌；②更换所展示的化身牌或技能。（你不可声明限定技、觉醒技、隐匿技、使命技、主公技等特殊技能）。",
  rexinsheng: "新生",
  rexinsheng_info: "当你受到1点伤害后，你可以获得一张新的化身牌。",
  re_menghuo: "界孟获",
  re_menghuo_prefix: "界",
  re_caopi: "界曹丕",
  re_caopi_prefix: "界",
  oljiuchi: "酒池",
  oljiuchi_info: "你可以将一张黑桃手牌当做【酒】使用。你使用【酒】无次数限制，且当你于回合内使用带有【酒】效果的【杀】造成伤害后，你令你的〖崩坏〗失效直到回合结束。",
  repolu: "破虏",
  repolu_info: "当你杀死一名角色/死亡时，你可以令任意名角色摸X+1张牌。（X为你此前发动过〖破虏〗的次数）",
  rexingshang: "行殇",
  rexingshang_info: "当其他角色死亡后，你可以选择一项：回复1点体力，或获得其所有牌。",
  refangzhu: "放逐",
  refangzhu_info: "当你受到伤害后，你可以令一名其他角色选择一项：摸X张牌并将武将牌翻面，或弃置X张牌并失去1点体力。（X为你已损失的体力值）",
  rezaiqi: "再起",
  rezaiqi_info: "结束阶段，你可以令至多X名角色选择一项：1.摸一张牌，2.令你回复1点体力（X为本回合进入过弃牌堆的红色牌数）。",
  ol_caiwenji: "界蔡琰",
  ol_caiwenji_prefix: "界",
  retuntian: "屯田",
  rebeige: "悲歌",
  retuntian_info: "①当你于回合外失去牌后，你可以判定。若判定结果为♥，你获得此判定牌。否则你将此牌置于你的武将牌上，称为“田”。②你计算与其他角色的距离时-X（X为你武将牌上“田”的数目）。",
  rebeige_info: "当有角色受到【杀】造成的伤害后，你可以弃一张牌，并令其进行一次判定，若判定结果为：♥该角色回复X点体力(X为伤害点数)；♦︎该角色摸三张牌；♣伤害来源弃两张牌；♠伤害来源将其武将牌翻面。",
  rehunzi: "魂姿",
  rehunzi_info: "觉醒技，准备阶段，若你的体力值不大于2，你减1点体力上限，并获得技能〖英姿〗和〖英魂〗。",
  rezhijian: "直谏",
  rezhijian_info: "出牌阶段，你可以将手牌中的一张装备牌置于一名其他角色装备区里（不得替换原装备），然后摸一张牌。当你使用装备牌时，你可以摸一张牌。",
  refangquan: "放权",
  refangquan_info: "你可跳过你的出牌阶段，若如此做，你本回合的手牌上限为你的体力上限，且回合结束时，你可以弃置一张手牌并令一名其他角色进行一个额外的回合。",
  xin_gaoshun: "界高顺",
  xin_gaoshun_prefix: "界",
  repojun: "破军",
  repojun2: "破军",
  repojun3: "破军",
  repojun_info: "当你使用【杀】指定目标后，你可以将其的至多X张牌置于其武将牌上（X为其体力值），然后其于当前回合结束时获得这些牌。当你使用【杀】对一名角色造成伤害时，若该角色的手牌数和装备区内的牌数均不大于你，则此伤害+1。",
  rexianzhen: "陷阵",
  rexianzhen_info: "出牌阶段限一次，你可以和一名其他角色拼点。若你赢，你本回合内对其使用牌没有次数和距离限制且无视其防具。若你没赢，你本回合内不能使用【杀】。若你以此法失去的拼点牌为【杀】，则你的【杀】不计入本回合的手牌上限。",
  rejinjiu: "禁酒",
  rejinjiu_info: "锁定技，你的【酒】均视为【杀】。其他角色不能于你的回合内使用【酒】。当你受到酒【杀】的伤害时，你令此伤害-X（X为影响过此【杀】的伤害值的【酒】的数量）。",
  rejinjiu2: "禁酒",
  rejinjiu3: "禁酒",
  ol_xiahouyuan: "界夏侯渊",
  ol_xiahouyuan_prefix: "界",
  shebian: "设变",
  shebian_info: "当你的武将牌翻面后，你可以移动场上的一张装备牌。",
  cangzhuo: "藏拙",
  cangzhuo_info: "弃牌阶段开始时，若你本回合内没有使用过锦囊牌，则你的锦囊牌不计入手牌上限。",
  re_zhangyi: "界张嶷",
  re_zhangyi_prefix: "界",
  rewurong: "怃戎",
  rewurong_info: "出牌阶段限一次，你可以令一名其他角色与你同时展示一张手牌：若你展示的是【杀】且该角色展示的不是【闪】，则你对其造成1点伤害；若你展示的不是【杀】且该角色展示的是【闪】，则你获得其一张牌。",
  ol_pangtong: "界庞统",
  ol_pangtong_prefix: "界",
  olniepan: "涅槃",
  olniepan_info: "限定技，当你处于濒死状态时，你可以弃置你区域内的所有牌并复原你的武将牌，然后摸三张牌并将体力回复至3点。然后你选择获得以下技能中的一个：〖八阵〗/〖火计〗/〖看破〗。",
  ol_weiyan: "界魏延",
  ol_weiyan_prefix: "界",
  reqimou: "奇谋",
  reqimou_info: "限定技，出牌阶段，你可以失去任意点体力并摸等量的牌，然后直到回合结束，你计算与其他角色的距离时-X，且你可以多使用X张【杀】（X为你失去的体力值）。",
  ol_xiaoqiao: "界小乔",
  ol_xiaoqiao_prefix: "界",
  rehongyan: "红颜",
  rehongyan_info: "锁定技，你区域内的黑桃牌和黑桃判定牌均视为红桃。当你于回合外正面朝上失去红桃牌后，若你的手牌数小于体力值，你摸一张牌。",
  reluoying: "落英",
  reluoying_discard: "落英",
  reluoying_judge: "落英",
  reluoying_info: "当其他角色的梅花牌因弃置或判定而进入弃牌堆后，你可以获得之。",
  rejiushi: "酒诗",
  rejiushi_info: "当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。当你受到伤害后，若你的武将牌背面向上且你未因此次伤害发动过〖酒诗〗，你可以翻面并从牌堆中随机获得一张锦囊牌。",
  rejiushi1: "酒诗",
  rejiushi3: "酒诗",
  rejiushi_mark: "酒诗·改",
  rejiushi_mark_info: "当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。当你受到伤害后，若你的武将牌背面向上且你未因此次伤害发动过〖酒诗〗，你可以翻面。当你翻面时，你从牌堆中随机获得一张锦囊牌。",
  chengzhang: "成章",
  chengzhang_info: "觉醒技，准备阶段开始时，若你造成伤害与受到伤害值之和累计7点或以上，则你回复1点体力并摸一张牌，然后改写〖酒诗〗。",
  re_wuyi: "界吴懿",
  re_wuyi_prefix: "界",
  re_zhuran: "界朱然",
  re_zhuran_prefix: "界",
  re_quancong: "界全琮",
  re_quancong_prefix: "界",
  re_liaohua: "界廖化",
  re_liaohua_prefix: "界",
  re_guohuai: "界郭淮",
  re_guohuai_prefix: "界",
  re_chengpu: "界程普",
  re_chengpu_prefix: "界",
  rechunlao: "醇醪",
  rechunlao2: "醇醪",
  rechunlao_info: "出牌阶段结束时，若你没有“醇”，你可以将至少一张【杀】置于你的武将牌上，称为“醇”。当一名角色处于濒死状态时，你可以移去一张“醇”，视为该角色使用一张【酒】，然后若此“醇”的属性为：火，你回复1点体力、雷，你摸两张牌。",
  re_caozhang: "界曹彰",
  re_caozhang_prefix: "界",
  yujin_yujin: "界于禁",
  yujin_yujin_prefix: "界",
  rexuanfeng: "旋风",
  rexuanfeng_info: `当你失去装备区内的牌时，或于弃牌阶段弃置了两张或更多的手牌后，你可以选择一项：1.依次弃置一至两名其他角色的共计两张牌；2.将一名其他角色装备区内的一张牌移动到另一名其他角色的装备区内。${get.poptip("rule_beishui")}：废除你的一个装备栏。`,
  reyongjin: "勇进",
  reyongjin_info: "你失去过牌的阶段结束时，你可视为对本阶段失去牌数与你相同的任意名角色使用一张无距离限制的【杀】。此【杀】造成伤害后，你随机恢复一个装备栏（均未废除则改为将弃牌堆中一张装备牌置入你的空置装备栏）。",
  olpaoxiao: "咆哮",
  olpaoxiao2: "咆哮",
  olpaoxiao_info: "①锁定技，你使用【杀】无次数限制。②锁定技，当你使用的【杀】被【闪】抵消时，你获得一枚“咆”（→）当你因【杀】造成伤害时，你弃置所有“咆”并令伤害值+X（X为“咆”数）。回合结束后，你弃置所有“咆”。",
  oltishen: "替身",
  oltishen_info: "限定技，准备阶段，你可以将体力回复至上限，然后摸X张牌（X为你回复的体力值）。",
  ollongdan: "龙胆",
  ollongdan_info: "你可以将一张【杀】当做【闪】、【闪】当做【杀】、【酒】当做【桃】、【桃】当做【酒】使用或打出。",
  olyajiao: "涯角",
  olyajiao_info: "当你于回合外因使用或打出而失去手牌后，你可以亮出牌堆顶的一张牌。若这两张牌的类别相同，你可以将展示的牌交给一名角色；若类别不同，你可弃置攻击范围内包含你的角色区域里的一张牌。",
  regongji: "弓骑",
  regongji_info: "出牌阶段限一次，你可以弃置一张非基本牌，然后弃置一名其他角色的一张牌。锁定技，当你的装备区内有坐骑牌时，你的攻击范围无限。",
  ol_sunjian: "界孙坚",
  ol_sunjian_prefix: "界",
  wulie: "武烈",
  wulie2: "武烈",
  wulie_info: "限定技，结束阶段，你可以失去任意点体力并指定等量的其他角色。这些角色各获得一枚「烈」。有「烈」的角色受到伤害时，其移去一枚「烈」，然后防止此伤害。",
  re_sunluban: "界孙鲁班",
  re_sunluban_prefix: "界",
  re_masu: "界马谡",
  re_masu_prefix: "界",
  ol_pangde: "界庞德",
  ol_pangde_prefix: "界",
  rejianchu: "鞬出",
  rejianchu_info: "当你使用【杀】指定一名角色为目标后，你可以弃置其一张牌，若以此法弃置的牌不为基本牌，此【杀】不可被【闪】响应且你本回合使用【杀】的次数上限+1，为基本牌，该角色获得此【杀】。",
  re_taishici: "界太史慈",
  re_taishici_prefix: "界",
  hanzhan: "酣战",
  hanzhan_gain: "酣战",
  hanzhan_info: "①当你发起拼点时，或成为拼点的目标时，你可以令对方选择拼点牌的方式改为随机选择一张手牌。②当你拼点结束后，你可以获得本次拼点的拼点牌中点数最大的【杀】。",
  re_jianyong: "界简雍",
  re_jianyong_prefix: "界",
  xin_xusheng: "界徐盛",
  xin_xusheng_prefix: "界",
  decadepojun: "破军",
  decadepojun2: "破军",
  decadepojun_info: "当你使用【杀】指定目标后，你可以将其的至多X张牌置于其武将牌上（X为其体力值）。若这些牌中：有装备牌，你将这些装备牌中的一张置于弃牌堆；有锦囊牌，你摸一张牌。其于回合结束时获得其武将牌上的这些牌。",
  re_wangyi: "界王异",
  re_wangyi_prefix: "界",
  guanzhang: "关兴张苞",
  rezishou: "自守",
  rezishou2: "自守",
  rezishou_info: "摸牌阶段，你可以多摸X张牌（X为存活势力数）。若如此做，本回合你对其他角色造成伤害时，防止此伤害。",
  rezongshi: "宗室",
  rezongshi_info: "锁定技，你的手牌上限+X（X为存活势力数）。准备阶段，若你的手牌数大于体力值，则你本回合内使用【杀】无次数限制。",
  ol_dongzhuo: "界董卓",
  ol_dongzhuo_prefix: "界",
  olbaonue: "暴虐",
  olbaonue_info: "主公技，其他群雄角色造成1点伤害后，你可进行判定，若为♠，你回复1点体力并获得判定牌。",
  re_panzhangmazhong: "界潘璋马忠",
  re_panzhangmazhong_prefix: "界",
  re_hanhaoshihuan: "界韩浩史涣",
  re_hanhaoshihuan_prefix: "界",
  xinyicong: "义从",
  xinyicong_info: "锁定技，你计算与其他角色的距离时-X，其他角色计算与你的距离时+Y。（X为你的体力值-1，Y为你的已损失体力值-1）",
  oltianxiang: "天香",
  oltianxiang_info: "当你受到伤害时，你可以弃置一张红桃牌，防止此伤害并选择一名其他角色，然后你选择一项：1.令其受到伤害来源对其造成的1点伤害，然后摸X张牌（X为其已损失体力值且至多为5）；2.令其失去1点体力，然后获得你弃置的牌。",
  olhongyan: "红颜",
  olhongyan_info: "锁定技，你的黑桃牌的花色视为红桃。若你的装备区内有红桃牌，则你的手牌上限基数视为体力上限。",
  piaoling: "飘零",
  piaoling_info: "结束阶段，你可以进行判定。若判定结果为红桃，则你选择一项：1.将此牌交给一名角色。若你交给了自己，则你弃置一张牌。2.将此牌置于牌堆顶。",
  decadelihuo: "疠火",
  decadelihuo2: "疠火",
  decadelihuo3: "疠火",
  decadelihuo_info: "当你声明使用普【杀】后，你可以将此【杀】改为火【杀】。当你使用火【杀】选择目标时，可以选择一个额外目标。你使用的火【杀】结算完成后，若此【杀】的目标数大于1且你因此【杀】造成过伤害，则你失去1点体力。",
  decadechunlao: "醇醪",
  decadechunlao2: "醇醪",
  decadechunlao_info: "你可以对其他角色使用【酒（使用方法②）】。当你需要使用【酒】时，若你的武将牌未横置，则你可以将武将牌横置，然后视为使用【酒】。当你受到或造成伤害后，若伤害值大于1且你的武将牌横置，则你可以重置武将牌。",
  rejuece: "绝策",
  rejuece_info: "结束阶段，你可以对一名本回合内失去过牌的其他角色造成1点伤害。",
  remieji: "灭计",
  remieji_info: "出牌阶段限一次，你可以将一张黑色锦囊牌置于牌堆顶，然后令一名有牌的其他角色选择一项：交给你一张锦囊牌，或依次弃置两张非锦囊牌。",
  re_manchong: "界满宠",
  re_manchong_prefix: "界",
  rejunxing: "峻刑",
  rejunxing_info: "出牌阶段限一次，你可以弃置任意张手牌并选择一名其他角色。该角色选择一项：1.弃置X张牌并失去1点体力。2.翻面并摸X张牌。（X为你弃置的牌数）",
  re_gongsunzan: "界公孙瓒",
  re_gongsunzan_prefix: "界",
  reqiaomeng: "趫猛",
  reqiaomeng_info: "当你使用【杀】对一名角色造成伤害后，你可以弃置该角色区域内的一张牌。若此牌为坐骑牌，则你于此弃置事件结算结束后获得此牌。",
  ol_dengai: "界邓艾",
  ol_dengai_prefix: "界",
  oltuntian: "屯田",
  olzaoxian: "凿险",
  oltuntian_info: "①当你于回合外失去牌后，或于回合内因弃置而失去【杀】后，你可以判定。若判定结果不为♥，则你将此牌置于你的武将牌上，称为“田”。②你计算与其他角色的距离时-X（X为你武将牌上“田”的数目）。",
  olzaoxian_info: "觉醒技，准备阶段，若你武将牌上至少拥有三张“田”，则你减1点体力上限，并获得技能〖急袭〗。你于当前回合结束后进行一个额外的回合。",
  re_sunxiu: "界孙休",
  re_sunxiu_prefix: "界",
  re_caoxiu: "界曹休",
  re_caoxiu_prefix: "界",
  xin_lingtong: "界凌统",
  xin_lingtong_prefix: "界",
  decadexuanfeng: "旋风",
  decadexuanfeng_info: "当你于弃牌阶段弃置过至少两张牌，或当你失去装备区里的牌后，若场上没有处于濒死状态的角色，则你可以弃置至多两名其他角色的共计两张牌。若此时处于你的回合内，你可以对其中一名目标角色造成1点伤害。",
  yongjin: "勇进",
  yongjin_info: "限定技，出牌阶段，你可以依次移动场上的至多三张不同的装备牌。",
  xin_liubiao: "界刘表",
  xin_liubiao_prefix: "界",
  decadezishou: "自守",
  decadezishou_zhiheng: "自守",
  decadezishou_info: "摸牌阶段，你可以多摸X张牌（X为存活势力数）；然后本回合你对其他角色造成伤害时，防止此伤害。结束阶段，若你本回合没有使用牌指定其他角色为目标，你可以弃置任意张花色不同的手牌，然后摸等量的牌。",
  decadezongshi: "宗室",
  decadezongshi_info: "锁定技，你的手牌上限+X（X为存活势力数）。你的回合外，若你的手牌数大于等于手牌上限，则当你成为延时类锦囊牌或无颜色的牌的目标后，你令此牌对你无效。",
  re_fazheng: "界法正",
  re_fazheng_prefix: "界",
  reenyuan: "恩怨",
  reenyuan1: "恩怨",
  reenyuan2: "恩怨",
  reenyuan_info: "当你获得一名其他角色的至少两张牌后，你可以令其摸一张牌。当你受到1点伤害后，你可令伤害来源选择一项：①失去1点体力。②交给你一张手牌。若此牌不为♥，则你摸一张牌。",
  rexuanhuo: "眩惑",
  rexuanhuo_info: "摸牌阶段结束时，你可以交给一名其他角色两张手牌，然后该角色选择一项：1. 视为对你选择的另一名角色使用任意一种【杀】或【决斗】，2. 交给你所有手牌。",
  re_fuhuanghou: "界伏寿",
  re_fuhuanghou_prefix: "界",
  reqiuyuan: "求援",
  reqiuyuan_info: "当你成为【杀】的目标时，你可选择另一名其他角色。除非该角色交给你一张除【杀】以外的基本牌，否则其也成为此【杀】的目标且该角色不能响应此【杀】。",
  rezhuikong: "惴恐",
  rezhuikong_info: "其他角色的准备阶段开始时，若你已受伤，你可与其拼点：若你赢，本回合该角色只能对自己使用牌；若你没赢，你获得其拼点的牌，然后其视为对你使用一张【杀】。",
  re_gongsunyuan: "界公孙渊",
  re_gongsunyuan_prefix: "界",
  rehuaiyi: "怀异",
  rehuaiyi_info: "出牌阶段限一次，你可以展示所有手牌，若这些牌的颜色：全部相同，你摸一张牌，并将此技能于本阶段内改为“限两次”，然后终止此技能的结算流程；不全部相同，则你选择一种颜色并弃置该颜色的所有手牌，然后你可以获得至多X名其他角色的各一张牌（X为你以此法弃置的手牌数）。若你以此法得到的牌不少于两张，则你失去1点体力。",
  re_caozhen: "界曹真",
  re_caozhen_prefix: "界",
  residi: "司敌",
  residi_push: "司敌",
  residi2: "司敌",
  residi3: "司敌",
  residi_info: "结束阶段，你可以将一张非基本牌置于武将牌上，称为“司”。其他角色的出牌阶段开始时，你可以移去一张“司”。若如此做，其本阶段内不能使用或打出与“司”颜色相同的牌。此阶段结束时，若其于此阶段内未使用过：【杀】，你视为对其使用一张【杀】。锦囊牌，你摸两张牌。",
  gz_re_xushu: "徐庶",
  re_zhangchunhua: "界张春华",
  re_zhangchunhua_prefix: "界",
  xin_handang: "界韩当",
  xin_handang_prefix: "界",
  xingongji: "弓骑",
  xingongji2: "弓骑",
  xingongji_info: "出牌阶段限一次，你可以弃置一张牌，然后你的攻击范围视为无限且使用与此牌花色相同的【杀】无次数限制直到回合结束。若你以此法弃置的牌为装备牌，则你可以弃置一名其他角色的一张牌。",
  xinjiefan: "解烦",
  xinjiefan_info: "限定技，出牌阶段，你可以选择一名角色，令攻击范围内含有该角色的所有角色依次选择一项：1.弃置一张武器牌；2.令其摸一张牌。然后若游戏轮数为1，则你于此回合结束时恢复此技能。",
  gzquanji: "权计",
  gzquanji_info: "每回合每项各限一次。当你受到伤害后或造成伤害后，你可以摸一张牌，然后你将一张牌置于武将牌上，称为“权”；你的手牌上限+X（X为“权”的数量）。",
  gzpaiyi: "排异",
  gzpaiyi_backup: "排异",
  gzpaiyi_info: "出牌阶段限一次。你可以移去一张“权”并选择一名角色。令其摸X张牌（X为你的“权”数且至多为7）。然后若其手牌数大于你，则你对其造成1点伤害。",
  ol_zhurong: "界祝融",
  ol_zhurong_prefix: "界",
  changbiao: "长标",
  changbiao_info: "出牌阶段限一次，你可以将任意张手牌当做【杀】使用（无距离限制）。若你因此【杀】对目标角色造成过伤害，则你于出牌阶段结束时摸X张牌（X为此【杀】对应的实体牌数量）。",
  re_zhoucang: "界周仓",
  re_zhoucang_prefix: "界",
  rezhongyong: "忠勇",
  rezhongyong_info: "当你使用【杀】后，你可以将此【杀】以及目标角色使用的【闪】交给另一名其他角色，若其获得的牌中有红色，则其可以对你攻击范围内的角色使用一张【杀】。若其获得的牌中有黑色，其摸一张牌。",
  ollihuo: "疠火",
  ollihuo2: "疠火",
  ollihuo3: "疠火",
  ollihuo4: "疠火",
  ollihuo_info: "你使用普通的【杀】可以改为火【杀】，若此【杀】造成过伤害，你失去1点体力；你使用火【杀】可以多选择一个目标。你每回合使用的第一张牌如果是【杀】，则此【杀】结算完毕后可置于你的武将牌上。",
  xinjiangchi: "将驰",
  xinjiangchi_info: "出牌阶段开始时，你可选择：①摸一张牌。②摸两张牌，然后本回合内不能使用或打出【杀】。③弃置一张牌，然后本回合内可以多使用一张【杀】，且使用【杀】无距离限制。",
  redingpin: "定品",
  redingpin_info: "出牌阶段，你可以弃置一张本回合未使用过/弃置过的类型的牌并选择一名角色。其进行判定，若结果为：黑色，其摸X张牌（X为其体力值且至多为3）且本回合内不能再成为〖定品〗的目标；红桃，你令此次弃置的牌不计入〖定品〗弃置牌合法性的检测；方片，你将武将牌翻面。",
  refaen: "法恩",
  refaen_info: "一名角色翻面或横置后，你可令其摸一张牌。",
  dcfaen: "法恩",
  dcfaen_info: "一名角色翻至正面或横置后，你可令其摸一张牌。",
  reshizhi: "矢志",
  reshizhi_info: "锁定技，若你的体力值为1，则你的【闪】视为【杀】，且当你使用对应的实体牌为一张【闪】的非转化普通【杀】造成伤害后，你回复1点体力。",
  re_guotufengji: "界郭图逢纪",
  re_guotufengji_prefix: "界",
  rejigong: "急攻",
  rejigong2: "急攻",
  rejigong_info: "出牌阶段开始时，你可以摸至多三张牌。若如此做，你本回合的手牌上限基数改为X，且此阶段结束时，若X不小于Y，则你回复1点体力。（X为你本回合内造成的伤害值之和，Y为你本回合内因〖急攻〗摸牌而得到的牌的数量总和）",
  ol_jiangwei: "界姜维",
  ol_jiangwei_prefix: "界",
  oltiaoxin: "挑衅",
  oltiaoxin_info: "出牌阶段限一次，你可以选择一名攻击范围内包含你的角色。然后除非该角色对你使用一张【杀】且此【杀】对你造成伤害，否则你弃置其一张牌，然后将此技能于此出牌阶段内修改为出牌阶段限两次。",
  olzhiji: "志继",
  olzhiji_info: "觉醒技，准备阶段或结束阶段，若你没有手牌，你回复1点体力或摸两张牌，然后减1点体力上限，获得〖观星〗。",
  decadezhenjun: "镇军",
  decadezhenjun_info: "准备阶段或结束阶段，你可以弃置一名角色X张牌（X为其手牌数减体力值且至少为1），若其中没有装备牌，你选择一项：1.你弃一张牌；2.该角色摸等量的牌。",
  decadejingce: "精策",
  decadejingce_info: "结束阶段，若你本回合使用过的牌数不小于你的体力值，则你可执行一个摸牌阶段或出牌阶段；若这些牌包含的花色数也不小于你的体力值，则你将“或”改为“和”。",
  re_guanping: "界关平",
  re_guanping_prefix: "界",
  relongyin: "龙吟",
  relongyin_info: "当一名角色于其出牌阶段内使用【杀】时，你可弃置一张牌令此【杀】不计入出牌阶段使用次数。若此【杀】为红色，则你摸一张牌；若你以此法弃置的牌与此【杀】点数相同，则你重置“竭忠”。",
  jiezhong: "竭忠",
  jiezhong_info: "限定技，出牌阶段开始时，你可以将手牌补至体力上限。",
  re_caifuren: "界蔡夫人",
  re_caifuren_prefix: "界",
  reqieting: "窃听",
  reqieting_info: "其他角色的回合结束时，若其本回合内未造成过伤害，则你可将其装备区内的一张牌置于你的装备区内；若其本回合内未对其他角色使用过牌，则你可摸一张牌。",
  rexianzhou: "献州",
  rexianzhou_info: "限定技。出牌阶段，你可将装备区内的所有牌交给一名其他角色。你回复X点体力，然后对其攻击范围内的至多X名角色各造成1点伤害（X为你以此法给出的牌数）。",
  xin_zhonghui: "界钟会",
  xin_zhonghui_prefix: "界",
  xinquanji: "权计",
  xinquanji_info: "①当你受到1点伤害后，或其他角色不因你的赠予或交给而得到你的牌后，你可以摸一张牌，然后将一张手牌置于武将牌上，称为“权”。②你的手牌上限+X（X为“权”的数量）。",
  xinzili: "自立",
  xinzili_info: "觉醒技。准备阶段，若你的“权”数大于2，则你回复1点体力并摸两张牌，减1点体力上限并获得〖排异〗。",
  xinpaiyi: "排异",
  xinpaiyi_backup: "排异",
  xinpaiyi_info: "出牌阶段每项各限一次，你可移去一张“权”并选择一项：①令一名角色摸X张牌。②对至多X名角色各造成1点伤害。（X为“权”数）",
  re_guyong: "界顾雍",
  re_guyong_prefix: "界",
  reshenxing: "慎行",
  reshenxing_info: "出牌阶段，你可以弃置X张牌（X为你本阶段内发动过〖慎行〗的次数且至少为0，至多为2），然后摸一张牌。",
  rebingyi: "秉壹",
  rebingyi_info: "结束阶段，你可展示所有手牌。若这些牌：颜色均相同，则你可以令至多X名角色各摸一张牌（X为你的手牌数）；颜色点数均相同，则你摸一张牌。",
  re_jiaxu: "界贾诩",
  re_jiaxu_prefix: "界",
  rewansha: "完杀",
  rewansha_info: "锁定技。①你的回合内，不处于濒死状态的其他角色不能使用【桃】。②当有角色于你的回合内进入濒死状态时，你令其以外的所有其他角色的非锁定技失效直到此濒死状态结算结束。",
  reluanwu: "乱武",
  reluanwu_info: "限定技，出牌阶段，你可令所有其他角色依次选择一项：①对距离最近（或之一）的角色使用一张【杀】；②失去1点体力。结算完成后，你可视为使用一张【杀】（无距离限制）。",
  reweimu: "帷幕",
  reweimu_info: "锁定技。①你不能成为黑色锦囊牌的目标。②当你于回合内受到伤害时，你防止此伤害并摸2X张牌（X为伤害值）。",
  ol_lusu: "界鲁肃",
  ol_lusu_prefix: "界",
  olhaoshi: "好施",
  olhaoshi_info: "摸牌阶段开始时，你可以多摸两张牌。然后摸牌阶段结束时，若你的手牌数大于5，则你将手牌数的一半（向下取整）交给一名手牌最少其他角色并获得如下效果直到你下回合开始：当你成为【杀】或普通锦囊牌的目标后，其可以交给你一张手牌。",
  oldimeng: "缔盟",
  oldimeng_info: "出牌阶段限一次，你可令两名手牌数之差不大于你牌数的其他角色交换手牌。若如此做，此阶段结束时，你弃置X张牌（X为这两名角色手牌数之差）。",
  rejijiang: "激将",
  rejijiang1: "激将",
  rejijiang2: "激将",
  rejijiang_info: "主公技。①当你需要使用或打出【杀】时，你可以令其他蜀势力角色依次选择是否打出一张【杀】。若有角色响应，则你视为使用或打出了此【杀】。②每回合限一次。当有蜀势力角色于回合外使用或打出【杀】时，其可以令你摸一张牌。",
  xin_yufan: "界虞翻",
  xin_yufan_prefix: "界",
  xinzongxuan: "纵玄",
  xinzongxuan_info: "当你的牌因弃置而进入弃牌堆后，你可将其中的任意张牌置于牌堆顶。若剩余的牌中有锦囊牌，则你可以令一名其他角色获得其中的一张。",
  xinzhiyan: "直言",
  xinzhiyan_info: "结束阶段开始时，你可令一名角色摸一张牌（正面朝上移动）。若此牌为基本牌，则你摸一张牌。若此牌为装备牌，则其回复1点体力并使用此装备牌。",
  re_xiahoushi: "界夏侯氏",
  re_xiahoushi_prefix: "界",
  reqiaoshi: "樵拾",
  reqiaoshi_info: "其他角色的结束阶段开始时，若你的手牌数与其相等，则你可以与其各摸一张牌。若这两张牌花色相同，则你可以重复此步骤。",
  reyanyu: "燕语",
  reyanyu2: "燕语",
  reyanyu_info: "①出牌阶段，你可以重铸【杀】。②出牌阶段结束时，你可以令一名其他男性角色摸X张牌（X为你本阶段内发动过〖燕语①〗的次数且至多为3）。",
  rehujia: "护驾",
  rehujia_info: "主公技。①当你需要使用或打出一张【闪】时，你可以令其他魏势力角色选择是否打出一张【闪】。若有角色响应，则你视为使用或打出了一张【闪】。②每回合限一次。当有魏势力角色于回合外使用或打出【闪】时，其可以令你摸一张牌。",
  ol_xuhuang: "界徐晃",
  ol_xuhuang_prefix: "界",
  olduanliang: "断粮",
  olduanliang_info: "你可以将一张黑色非锦囊牌当做【兵粮寸断】使用。若你于当前回合内未造成过伤害，则你使用【兵粮寸断】无距离限制。",
  oljiezi: "截辎",
  oljiezi_info: "①当有角色跳过摸牌阶段后，你可选择一名角色。若该角色：手牌数为全场最少且没有“辎”，则其获得一枚“辎”。否则其摸一张牌。②一名角色的摸牌阶段结束时，若其有“辎”，则你移去其“辎”，然后令其获得一个额外的摸牌阶段。",
  re_madai: "界马岱",
  re_madai_prefix: "界",
  reqianxi: "潜袭",
  reqianxi_info: "准备阶段开始时，你可摸一张牌，然后弃置一张牌并选择一名距离为1的其他角色。该角色于本回合内：{不能使用或打出与此牌颜色相同的手牌，且其装备区内与此牌颜色相同的防具牌无效，且当其回复体力时，你摸两张牌。}",
  re_guohuanghou: "界郭皇后",
  re_guohuanghou_prefix: "界",
  rejiaozhao: "矫诏",
  rejiaozhao_info: "出牌阶段限一次。你可以展示一张手牌，并令一名距离你最近的其他角色选择一种基本牌或普通锦囊牌的牌名。你可将此牌当做其声明的牌使用直到此阶段结束（你不是此牌的合法目标）。",
  rejiaozhao_lv2: "矫诏·升级 Lv.1",
  rejiaozhao_lv2_info: "出牌阶段限一次。你可以将一张手牌当做一张基本牌或普通锦囊牌使用（你不是此牌的合法目标）。",
  rejiaozhao_lv3: "矫诏·升级 Lv.2",
  rejiaozhao_lv3_info: "出牌阶段每种类型各限一次。你可以将一张手牌当做一张基本牌或普通锦囊牌使用。",
  redanxin: "殚心",
  redanxin_info: "当你受到伤害后，你可以摸一张牌并升级〖矫诏〗。",
  xin_wuguotai: "界吴国太",
  xin_wuguotai_prefix: "界",
  xinganlu: "甘露",
  xinganlu_info: "出牌阶段限一次。你可以令两名角色交换装备区内的牌，然后若这两名角色装备区内牌数差的绝对值大于你已损失的体力值，则你弃置两张手牌。",
  xinbuyi: "补益",
  xinbuyi_info: "一名角色进入濒死状态时，你可展示其一张手牌。若此牌不为基本牌，则其弃置此牌并回复1点体力。若其以此法弃置的牌移动前为其的唯一一张手牌，则其摸一张牌。",
  decadexianzhen: "陷阵",
  decadexianzhen2: "陷阵",
  decadexianzhen_info: "每回合限一次。出牌阶段，你可以和一名其他角色拼点。若你赢：本回合你无视该角色的防具，且对其使用牌没有次数和距离限制，且本回合对其使用牌造成伤害时，此伤害+1（每种牌名每回合限一次）；若你没赢：你本回合内不能使用【杀】，且【杀】不计入手牌上限。",
  decadejinjiu: "禁酒",
  decadejinjiu_info: "锁定技。你的【酒】的牌名均视为【杀】且点数视为K；你的回合内，其他角色不能使用【酒】。",
  dc_xushu: "新杀徐庶",
  dc_xushu_prefix: "新杀",
  rezhuhai: "诛害",
  rezhuhai_info: "其他角色的结束阶段开始时，若其本回合内造成过伤害，则你可以选择一项：⒈将一张手牌当做【杀】对其使用。⒉视为对其使用一张【过河拆桥】。",
  xsqianxin: "潜心",
  xsqianxin_info: "觉醒技。当你造成伤害后，若你已受伤，则你减1点体力上限并获得〖荐言〗。",
  rejianyan: "荐言",
  rejianyan_info: "出牌阶段每项各限一次。你可选择一种颜色或一种牌的类别，然后系统从牌堆中检索出一张满足该条件的牌并展示之。然后你将此牌交给一名男性角色或Key势力角色。",
  re_zhanghe: "界张郃",
  re_zhanghe_prefix: "界",
  reqiaobian: "巧变",
  reqiaobian_info: "①游戏开始时，你获得两枚“变”。②判定阶段开始时，你可弃置一张牌或一枚“变”并跳过此阶段。③摸牌阶段开始时，你可弃置一张牌或一枚“变”并跳过此阶段，然后可以获得至多两名其他角色的各一张手牌。④出牌阶段开始时，你可弃置一张牌或一枚“变”并跳过此阶段，然后你可以移动场上的一张牌。⑤弃牌阶段开始时，你可弃置一张牌或一枚“变”并跳过此阶段。⑥结束阶段，若你的〖巧变⑥〗记录中不包含你的手牌数，则你获得一枚“变”并记录你的手牌数。",
  olbeige: "悲歌",
  olbeige_info: "当有角色受到渠道为【杀】的伤害后，若你有牌，你可令其进行判定。然后你可弃置一张牌，根据判定结果执行以下的一个选项：♥，其回复1点体力；♦，其摸两张牌；♣，伤害来源弃置两张牌️；♠，伤害来源将武将牌翻面。若你弃置的牌与判定结果：点数相同，则你获得你弃置的牌；花色相同，则你获得判定牌。",
  dc_bulianshi: "界步练师",
  dc_bulianshi_prefix: "界",
  dcanxu: "安恤",
  dcanxu_info: "出牌阶段限一次，你可以选择两名手牌数不同的其他角色，令其中手牌少的角色获得手牌多的角色的一张手牌并展示之。然后若此牌不为黑桃，则你摸一张牌；若这两名角色手牌数相等，则你回复1点体力。",
  dczhuiyi: "追忆",
  dczhuiyi_info: "当你死亡时，你可以令一名不为击杀者的其他角色摸X张牌（X为存活角色数），然后其回复1点体力。",
  re_jushou: "界沮授",
  re_jushou_prefix: "界",
  dcshibei: "矢北",
  dcshibei_info: "锁定技，当你于一回合内第一次受到伤害后，你回复1点体力；当你于一回合内第二次受到伤害后，你失去1点体力。",
  dcjianying: "渐营",
  dcjianying_info: "当你使用与你使用的上一张牌点数或花色相同的牌时，你可以摸一张牌。",
  re_duji: "界杜畿",
  re_duji_prefix: "界",
  reandong: "安东",
  reandong_info: "当你受到其他角色造成的伤害时，你可以令伤害来源选择一项：⒈防止此伤害。然后其♥牌不计入本回合的手牌上限；⒉你观看其手牌并获得其中的所有♥牌，若其没有手牌，则你下次发动〖安东〗时改为自行选择。",
  reyingshi: "应势",
  reyingshi_info: "出牌阶段开始时，你可以展示一张手牌，选择一名角色A和一名其他角色B，展示牌堆中与展示牌花色点数均相同的所有牌。A可以对B使用一张【杀】，然后获得你展示的牌。若A因此【杀】造成过伤害，则A获得牌堆中的展示牌。",
  dcqiaomeng: "趫猛",
  dcqiaomeng_info: "当你使用黑色牌指定第一个目标后，你可以弃置目标角色中一名其他角色的一张牌。若你以此法弃置的牌为：装备牌，你获得此牌；锦囊牌，你令此牌不可被响应。",
  dc_gongsunzan: "新杀公孙瓒",
  dc_gongsunzan_prefix: "新杀",
  re_liuchen: "界刘谌",
  re_liuchen_prefix: "界",
  rezhanjue: "战绝",
  rezhanjue_effect: "战绝",
  rezhanjue_info: "出牌阶段，若你本阶段内因〖战绝〗得到过的牌数小于3，则你可以将所有不具有“勤王”标记的手牌当做【决斗】使用。此【决斗】使用结算结束后，你摸一张牌。然后所有因此【决斗】受到过伤害的角色也各摸一张牌。",
  reqinwang: "勤王",
  reqinwang_info: "主公技。出牌阶段限一次，你可以令所有其他蜀势力角色依次选择是否交给你一张【杀】，然后你可以令选择是的角色摸一张牌。",
  shizhan: "势斩",
  shizhan_info: "出牌阶段限两次，你可以选择一名其他角色。该角色视为对你使用一张【决斗】。",
  ol_xunyu: "界荀彧",
  ol_xunyu_prefix: "界",
  oljieming: "节命",
  oljieming_info: "当你受到1点伤害后或死亡时，你可令一名角色摸X张牌。然后若其手牌数大于X，则其将手牌弃置至X张（X为其体力上限且至多为5）。",
  re_liufeng: "界刘封",
  re_liufeng_prefix: "界",
  rexiansi: "陷嗣",
  rexiansi2: "陷嗣",
  rexiansi_info: "①准备阶段开始时，你可以将一至两名角色的各一张牌置于你的武将牌上，称为“逆”。②当一名角色需要对你使用【杀】时，其可以移去两张“逆”，然后视为对你使用一张【杀】。③若你的“逆”数大于体力值，则你可以移去一张“逆”并视为使用一张【杀】。",
  re_sp_taishici: "界SP太史慈",
  re_sp_taishici_prefix: "界SP",
  rejixu: "击虚",
  rejixu_info: "出牌阶段限一次。若你有手牌，则你可以选择至多X名角色，令这些角色猜测你的手牌区中是否有【杀】。若你：有【杀】，则你本阶段使用【杀】的次数上限+Y，且当你于本阶段内使用【杀】指定目标后，你可以令这Y名角色也成为此【杀】的目标；没有【杀】，则你弃置这Y名角色的各一张牌。然后你摸Y张牌（X为你的体力值，Y为这些角色中猜错的角色数）。",
  ol_dianwei: "界典韦",
  ol_dianwei_prefix: "界",
  olqiangxi: "强袭",
  olqiangxi_info: "出牌阶段限两次。你可以弃置一张武器牌或受到1点无来源伤害，然后对一名本回合内未成为过〖强袭〗目标的其他角色造成1点伤害。",
  olninge: "狞恶",
  olninge_info: "锁定技。当一名角色A于一回合内第二次受到伤害后，若A或伤害来源为你，则你摸一张牌，然后弃置其装备区或判定区内的一张牌。",
  re_zhuhuan: "界朱桓",
  re_zhuhuan_prefix: "界",
  refenli: "奋励",
  refenli_info: "若你的手牌数为全场最多，你可以跳过判定阶段和摸牌阶段；若你的体力值为全场最多，你可以跳过出牌阶段；若你的装备区里有牌且数量为全场最多，你可以跳过弃牌阶段。",
  //破界石不值钱了 就逮着免费突破硬削是吧
  repingkou: "平寇",
  repingkou_info: "回合结束时，你可以对至多X名其他角色各造成1点伤害（X为你本回合跳过的阶段数）。若你选择的角色数小于X，则你可以令其中一名角色随机弃置装备区里的一张牌。",
  dc_liru: "界李儒",
  dc_liru_prefix: "界",
  dcmieji: "灭计",
  dcmieji_info: "出牌阶段限一次，你可以展示一张武器牌或黑色锦囊牌。你将此牌置于牌堆顶，然后令一名有手牌的其他角色选择一项：⒈弃置一张锦囊牌；⒉依次弃置两张非锦囊牌。",
  dcfencheng: "焚城",
  dcfencheng_info: "限定技。出牌阶段，你可以指定一名其他角色，令从其开始的其他角色依次选择一项：⒈弃置至少X张牌（X为上一名角色弃置的牌数+1）。⒉你对其造成2点火焰伤害。",
  oljiang: "激昂",
  oljiang_info: "①当你使用【决斗】或红色【杀】指定第一个目标后，或成为【决斗】或红色【杀】的目标后，你可以摸一张牌。②当有【决斗】或红色【杀】于每回合内首次因弃置而进入弃牌堆后，你可以失去1点体力并获得这些牌。",
  re_xunyou: "界荀攸",
  re_xunyou_prefix: "界",
  reqice: "奇策",
  reqice_info: "出牌阶段限X次（X为你的“奇策”数+1），你可以将所有手牌当做任意一张普通锦囊牌使用。",
  rezhiyu: "智愚",
  rezhiyu_info: "当你受到伤害后，你可以摸一张牌，然后展示所有手牌，令伤害来源弃置一张手牌。若你展示的牌颜色均相同，你获得1枚“奇策”直到下回合结束且获得来源弃置的牌。",
  re_caiyong: "界蔡邕",
  re_caiyong_prefix: "界",
  rebizhuan: "辟撰",
  rebizhuan_bg: "书",
  rebizhuan_info: "①当你使用♠牌时，或成为其他角色使用♠牌的目标后，你可以将牌堆顶的一张牌置于武将牌上，称为“书”（你至多拥有四张“书”）。②你的手牌上限+X（X为“书”数）。",
  retongbo: "通博",
  retongbo_info: "摸牌阶段结束时，你可以用任意手牌交换等量“书”。然后若“书”数至少为4，你可以将四张“书”任意交给其他角色。若你交出的牌花色各不相同，你回复1点体力且“书”的上限+1（至多增加等同存活角色数的上限）。",
  re_chengong: "界陈宫",
  re_chengong_prefix: "界",
  remingce: "明策",
  remingce_info: "出牌阶段限一次。你可以将一张【杀】或装备牌交给一名其他角色，其选择一项：1.视为对你选择的另一名角色使用一张【杀】，且若此牌造成伤害，则执行选项2；2.你与其各摸一张牌。",
  re_sundeng: "界孙登",
  re_sundeng_prefix: "界",
  rekuangbi: "匡弼",
  rekuangbi_info: "出牌阶段开始时，你可以令一名其他角色将至多三张牌置于你的武将牌上直到此阶段结束。然后当你使用牌时，若你：有与此牌花色相同的“匡弼”牌，你移去其中一张并与其各摸一张牌；没有与此牌花色相同的“匡弼”牌，你随机移去一张“匡弼”牌并摸一张牌。",
  dc_chenqun: "界陈群",
  dc_chenqun_prefix: "界",
  repindi: "品第",
  repindi_info: "出牌阶段每名角色限一次。你可以弃置一张本阶段未以此法弃置过的类型的牌并选择一名角色，你选择一项：1.其摸X张牌；2.其弃置X张牌（X为你本回合发动〖品第〗的次数）。然后若其已受伤，你横置或重置。",
  re_mazhong: "界马忠",
  re_mazhong_prefix: "界",
  refuman: "抚蛮",
  refuman_info: "出牌阶段每名角色限一次。你可以弃置一张牌，令一名角色从弃牌堆中获得一张【杀】。然后其于其下个回合结束前失去此牌后，其摸一张牌；若其因使用或打出失去此牌，则改为你与其各摸一张牌。",
  re_guanzhang: "界关兴张苞",
  re_guanzhang_prefix: "界",
  retongxin: "同心",
  retongxin_info: "锁定技。你的攻击范围+2。",
  re_wenpin: "界文聘",
  re_wenpin_prefix: "界",
  rezhenwei: "镇卫",
  rezhenwei_info: "当一名其他角色成为【杀】或黑色锦囊牌的目标时（使用者不为你），若该角色的体力值不大于你且此牌的目标角色数为1，你可以弃置一张牌并选择一项：1.摸一张牌，然后将此【杀】或黑色锦囊牌的目标转移给你；2.令此【杀】或黑色锦囊牌无效且将此【杀】或黑色锦囊牌置于使用者的武将牌上，然后当前回合结束后，使用者获得这些牌。",
  ol_huangzhong: "界黄忠",
  ol_huangzhong_prefix: "界",
  remoshi: "没矢",
  remoshi_info: "锁定技。①当你使用【杀】对目标角色造成伤害后，若其装备区里有防具牌或坐骑牌，你将此【杀】对应的实体牌置于其武将牌上。②当有“没矢”牌的角色失去防具牌或坐骑牌后，你获得其“没矢”牌。",
  dc_caozhi: "界曹植",
  dc_caozhi_prefix: "界",
  dcjiushi: "酒诗",
  dcjiushi_info: "①当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。②当你受到伤害后，若你的武将牌于受到伤害时背面向上，你可以翻面。③当你使用【酒】后，你使用【杀】的次数上限+1直到你的下个回合结束。",
  olhuoji: "火计",
  olhuoji_info: "①你可以将一张红色牌当【火攻】使用。②你使用【火攻】的作用效果改为“目标角色随机展示一张手牌A，然后你可以弃置一张与A颜色相同的手牌，对目标造成1点火属性伤害”。",
  olkanpo: "看破",
  olkanpo_info: "①你可以将一张黑色牌当【无懈可击】使用。②你使用的【无懈可击】不可被响应。",
  xinwangxi: "忘隙",
  xinwangxi_info: "当你对其他角色造成1点伤害后，或受到其他角色造成的1点伤害后，你可以摸两张牌，然后交给其一张牌。",
  ol_yanwen: "界颜良文丑",
  ol_yanwen_prefix: "界",
  olshuangxiong: "双雄",
  olshuangxiong_info: "①摸牌阶段结束时，你可以弃置一张牌。若如此做，你本回合内可以将一张与此牌颜色不同的牌当做【决斗】使用。②结束阶段，你从弃牌堆中获得本回合内对你造成伤害的所有牌。",
  re_zhuzhi: "界朱治",
  re_zhuzhi_prefix: "界",
  reanguo: "安国",
  reanguo_info: "出牌阶段限一次。你可以选择一名其他角色，若其：手牌数为全场最少，其摸一张牌；体力值为全场最低，其回复1点体力；装备区内牌数为全场最少，其随机使用一张装备牌。然后若该角色有未执行的效果且你满足条件，你执行之。若你与其执行了全部分支，你可以重铸任意张牌。",
  dcyicong: "义从",
  dcyicong_info: "锁定技。①你至其他角色的距离-1。②若你已损失的体力值不小于2，则其他角色至你的距离+1。",
  re_zhangsong: "界张松",
  re_zhangsong_prefix: "界",
  rexiantu: "献图",
  rexiantu_info: "其他角色的出牌阶段开始时，你可以摸两张牌，然后将两张牌交给该角色。然后此阶段结束时，若其于此阶段没有造成过伤害，你失去1点体力。",
  re_jsp_huangyueying: "界SP黄月英",
  re_jsp_huangyueying_prefix: "界SP",
  rejiqiao: "机巧",
  rejiqiao_info: "出牌阶段开始时，你可以弃置任意张牌，然后亮出牌堆顶X张牌（X为你以此法弃置的牌数与其中装备牌数之和），你获得其中所有非装备牌。",
  relinglong: "玲珑",
  relinglong_info: "锁定技。若你的装备区：有空置的防具栏，你视为拥有〖八卦阵〗；有空置的两种坐骑栏，你的手牌上限+2；有空置的宝物栏，你视为拥有〖奇才〗；以上均满足：你使用的【杀】或普通锦囊牌不可被响应。",
  ol_zhangzhang: "界张昭张纮",
  ol_zhangzhang_prefix: "界",
  olzhijian: "直谏",
  olzhijian_info: "出牌阶段，你可以将一张装备牌置于其他角色的装备区（可替换原装备），然后摸一张牌。",
  olguzheng: "固政",
  olguzheng_info: "每阶段限一次。当其他角色的至少两张牌因弃置而进入弃牌堆后，你可以令其获得其中一张牌，然后你可以获得剩余的牌。",
  re_caochong: "界曹冲",
  re_caochong_prefix: "界",
  rechengxiang: "称象",
  rechengxiang_info: "当你受到伤害后，你可以亮出牌堆顶的四张牌。然后获得其中任意数量点数之和不大于13的牌。若你得到的牌点数之和为13，你复原武将牌。",
  re_caorui: "界曹叡",
  re_caorui_prefix: "界",
  remingjian: "明鉴",
  remingjian_info: `出牌阶段限一次。你可以将所有手牌交给一名其他角色，然后该角色于其下个回合获得如下效果：1.手牌上限与使用【杀】的次数上限+1；2.当该角色首次造成伤害后，你发动一次${get.poptip("huituo")}。`,
  rexingshuai: "兴衰",
  rexingshuai_info: "主公技，限定技。当你进入濒死状态时，你可令其他魏势力角色依次选择是否令你回复1点体力。然后这些角色依次受到1点伤害。有〖明鉴〗效果的角色于其回合内杀死角色后，你重置〖兴衰〗。",
  xin_zhangliang: "界张梁",
  xin_zhangliang_prefix: "界",
  rejijun: "集军",
  rejijun_info: "当你使用目标角色含有自己的牌结算完毕后，你可以进行一次判定并将判定牌置于武将牌上，称为“方”。",
  refangtong: "方统",
  refangtong_info: "结束阶段，你可以将一张手牌置于武将牌上，称为“方”。若如此做，你可以移去任意张“方”并对一名其他角色造成1点雷属性伤害（若你移去的“方”的点数和大于36，则改为造成3点雷属性伤害）。",
  re_simalang: "界司马朗",
  re_simalang_prefix: "界",
  requji: "去疾",
  requji_info: "出牌阶段限一次，你可以弃置X张牌（X为你已损失的体力值）并令至多X名角色回复1点体力，然后仍处于受伤状态的目标角色摸一张牌。若你以此法弃置了黑色牌，你失去1点体力。",
  rejunbing: "郡兵",
  rejunbing_info: "一名角色的结束阶段，若其手牌数小于其体力值，其可以摸一张牌并将所有手牌交给你，然后你可以交给其等量的牌。",
  re_zhugedan: "界诸葛诞",
  re_zhugedan_prefix: "界",
  regongao: "功獒",
  regongao_info: "锁定技。一名其他角色首次进入濒死状态时，你增加1点体力上限，然后回复1点体力。",
  rejuyi: "举义",
  rejuyi_info: "觉醒技。准备阶段，若你已受伤，且你的体力上限大于场上的存活角色数，你将手牌数摸至体力上限，然后获得技能〖崩坏〗和〖威重〗。",
  reweizhong: "威重",
  reweizhong_info: "锁定技。当你的体力上限增加或减少时，你摸两张牌。",
  re_zhongyao: "界钟繇",
  re_zhongyao_prefix: "界",
  rehuomo: "活墨",
  rehuomo_info: "每种牌名每回合限一次。当你需要使用一张基本牌时，你可以将一张黑色非基本牌置于牌堆顶，视为使用此基本牌。",
  zhoutai: "界周泰",
  zhoutai_prefix: "界",
  caoren: "界曹仁",
  caoren_prefix: "界",
  ollianhuan: "连环",
  ollianhuan_info: "你可以将一张♣牌当【铁索连环】使用或重铸。你使用【铁索连环】选择目标后，可以给此牌增加一个目标。",
  re_lidian: "界李典",
  gz_re_lidian: "李典",
  re_lidian_prefix: "界",
  re_xushu: "界徐庶",
  re_xushu_prefix: "界",
  rejianxiong_old: "奸雄",
  rejianxiong_old_info: "当你受到伤害后，你可以摸一张牌或获得对你造成伤害的牌。"
};
const characterTitles = {
  re_zhangliao: "晋阳侯",
  re_simayi: "晋高祖",
  re_xuzhu: "牟乡侯",
  re_xiahoudun: "高安乡侯",
  re_lvmeng: "士别三日",
  re_zhouyu: "平虏伯",
  re_luxun: "江陵侯",
  re_zhaoyun: "虎威将军",
  re_guanyu: " 壮缪侯",
  re_zhangfei: "当阳怒吼",
  re_machao: "骠骑将军",
  re_caocao: "魏太祖",
  re_guojia: "英才天妒",
  re_lvbu: "不败战神",
  re_huanggai: "三朝元勋",
  re_daqiao: "虹彩流离",
  re_ganning: "折冲将军",
  re_huatuo: "药到病除",
  re_liubei: "汉昭烈帝",
  re_diaochan: "千舞风华",
  re_huangyueying: "深藏不露",
  re_sunquan: "东吴大帝",
  re_sunshangxiang: "不让须眉",
  re_zhugeliang: "鞠躬尽瘁",
  re_zhenji: "轻云蔽月",
  re_huaxiong: "暴走汜水",
  ol_sp_zhugeliang: "隆中对",
  re_zhangjiao: "太平教主",
  re_sunce: "长沙桓王",
  ol_yuanshao: "义军盟主",
  ol_liushan: "蜀后主",
  xin_yuji: "缠怨索魂",
  re_zuoci: "羽化飞升",
  re_menghuo: "扫坛蛮王",
  re_caopi: "霸业的继承者",
  xin_gaoshun: "攻无不克",
  ol_xiahouyuan: "疾行的猎豹",
  re_zhangyi: "通壮逾古",
  ol_pangtong: "凤雏高翔",
  ol_weiyan: "汉中镇守",
  ol_xiaoqiao: "仙姿玉质",
  re_wuyi: "奔袭千里",
  re_zhuran: "不动之督",
  re_quancong: "冯谖市义",
  re_liaohua: "历尽沧桑",
  re_guohuai: "见盔心伤",
  re_chengpu: "三朝虎臣",
  re_caozhang: "黄须儿",
  yujin_yujin: "讨暴坚垒",
  ol_sunjian: "忠壮之烈",
  re_sunluban: "为虎作伥",
  re_masu: "军略之才器",
  ol_caiwenji: "至柔动刚",
  re_taishici: "信义笃烈",
  ol_pangde: "关门亭侯",
  re_jianyong: "优游风议",
  xin_xusheng: "整军经武",
  re_wangyi: "决意的巾帼",
  ol_dongzhuo: "祸乱朝纲",
  re_manchong: "政法兵谋",
  re_gongsunzan: "白马将军",
  ol_dengai: "壮士解腕",
  re_sunxiu: "弥殇的景君",
  re_caoxiu: "征东大将军",
  xin_lingtong: "豪情烈胆",
  xin_liubiao: "跨蹈汉南",
  re_fazheng: "蜀汉的辅翼",
  re_fuhuanghou: "孤注一掷",
  re_gongsunyuan: "狡黠的投机者",
  gz_re_xushu: "化剑为犁",
  re_zhangchunhua: "冷血皇后",
  xin_handang: "石城侯",
  ol_zhurong: "火神血裔",
  re_zhoucang: "披肝沥胆",
  ol_jiangwei: "声畅华夏",
  re_guanping: "忠臣孝子",
  re_caifuren: "襄江的蒲苇",
  xin_zhonghui: "桀骜的野心家",
  re_guyong: "庙堂的玉磬",
  re_jiaxu: "洞悉先机者",
  ol_lusu: "股肱腹心",
  xin_yufan: "狂直之士",
  re_xiahoushi: "疾冲之恋",
  ol_xuhuang: "周亚夫之风",
  re_madai: "临危受命",
  re_guohuanghou: "月华驱霾",
  re_panzhangmazhong: "擒龙伏虎",
  xin_wuguotai: "武烈皇后",
  dc_xushu: "化剑为犂",
  re_zhanghe: "识变善营",
  dc_bulianshi: "无冕之后",
  re_jushou: "监军谋国",
  re_duji: "卧镇京畿",
  rdc_gongsunzan: "蓟侯",
  re_liuchen: "血荐轩辕",
  ol_xunyu: "万岁亭侯",
  re_liufeng: "骑虎之殇",
  re_sp_taishici: "北海酬恩",
  ol_dianwei: "临危横贯",
  re_zhuhuan: "中洲拒天人",
  dc_liru: "魔仕",
  re_xunyou: "曹魏的谋主",
  re_caiyong: "大鸿儒",
  re_chengong: "刚直壮烈",
  re_sundeng: "才高德茂",
  dc_chenqun: "万世臣表",
  re_mazhong: "笑合南中",
  re_guanzhang: "将门虎子",
  re_wenpin: "坚城宿卫",
  ol_huangzhong: "老将的逆袭",
  dc_caozhi: "八斗之才",
  ol_yanwen: "二夫之勇",
  re_zhuzhi: "王事靡盬",
  re_guotufengji: "凶蛇两端",
  re_zhangsong: "怀璧待凤仪",
  re_jsp_huangyueying: "闺中璞玉",
  ol_zhangzhang: "内事之托",
  re_caochong: "仁爱的神童",
  re_caorui: "天姿的明君",
  xin_zhangliang: "人公将军",
  re_simalang: "再世神农",
  re_zhugedan: "薤露蒿里",
  re_zhongyao: "正楷萧曹",
  zhoutai: "历战之躯",
  caoren: "大将军",
  dc_gongsunzan: "白马将军",
  re_lidian: "深明大义",
  gz_re_lidian: "深明大义",
  re_xushu: "化剑为犂"
};
const characterIntro = {
  jsp_huangyueying: "荆州沔南白水人，沔阳名士黄承彦之女，诸葛亮之妻，诸葛瞻之母。容貌甚丑，而有奇才：上通天文，下察地理，韬略近于诸书无所不晓，诸葛亮在南阳闻其贤而迎娶。",
  re_gongsunzan: "群雄之一。出身贵族，因母地位卑贱，只当了郡中小吏。他貌美，声音洪亮，机智善辩。后随卢植于缑氏山中读书，粗通经传。",
  lidian: "字曼成，曹操麾下将领。李典深明大义，不与人争功，崇尚学习与高贵儒雅，尊重博学之士，在军中被称为长者。李典有长者之风，官至破虏将军，三十六岁去世。魏文帝曹丕继位后追谥号为愍侯。",
  sunben: " "
};
const characterFilters = {
  re_zuoci(mode) {
    return mode != "guozhan";
  }
};
const dynamicTranslates = {
  rejiushi(player) {
    if (player.storage.chengzhang) {
      return "当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。当你受到伤害后，若你的武将牌于受到伤害时背面向上，你可以翻面。当你翻面时，你获得牌堆中的一张随机锦囊牌。";
    }
    return "当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。当你受到伤害后，若你的武将牌于受到伤害时背面向上，你可以翻面并获得牌堆中的一张随机锦囊牌。";
  },
  rejiaozhao(player) {
    return ["出牌阶段限一次。你可以展示一张手牌，并令一名距离你最近的角色选择一种基本牌或普通锦囊牌的牌名。你可将此牌当做其声明的牌使用直到此阶段结束（你不是此牌的合法目标）。", "出牌阶段限一次。你可以将一张手牌当做一张基本牌或普通锦囊牌使用（你不是此牌的合法目标）。", "出牌阶段每种类型各限一次。你可以将一张手牌当做一张基本牌或普通锦囊牌使用。"][player.countMark("redanxin")];
  }
};
const perfectPairs = {};
const voices = {
  "#regongao1": "百战余生者，唯我大魏虎贲！",
  "#regongao2": "大魏凭武立国，当以骨血为饲！",
  "#rejuyi1": "举义旗，兴王师，伐不臣！",
  "#rejuyi2": "逆贼篡国，天下义士当共讨之！",
  "#reweizhong1": "食君之禄，当忠君之事。",
  "#benghuai_re_zhugedan1": "粮尽，援绝，天不佑我。",
  "#re_zhugedan:die": "大魏危矣，社稷危矣。",
  "#reqicai1": "吾之才学，不逊先生分毫。",
  "#reqicai2": "女子之才，蕙质兰心。",
  "#reyiji_yj_sb_guojia1": "算无遗策，方能决胜于千里。",
  "#reyiji_yj_sb_guojia2": "吾身虽殒，然智计长存。",
  "#reyiji_yj_sb_guojia_shadow1": "今生不借此身度，更向何生度此身？",
  "#reyiji_yj_sb_guojia_shadow2": "胸怀丹心一颗，欲照山河万朵。",
  "#huituo_re_caorui1": "拓土复疆，扬大魏鸿威。",
  "#huituo_re_caorui2": "制律弘法，固天下社稷。",
  "#remingjian1": "敌将寇边，还请将军领兵御之。",
  "#remingjian2": "逆贼滔乱，须得阁下出手相助。",
  "#rexingshuai1": "家国兴衰，与君共担。",
  "#rexingshuai2": "携君并进，共克此难。",
  "#re_caorui:die": "胸有宏图待展，奈何命数已尽。",
  "#zhuhai1": "善恶有报，天道轮回！",
  "#zhuhai2": "早知今日，何必当初！",
  "#qianxin1": "既遇明主，天下可图！",
  "#qianxin2": "弃武从文，安邦卫国！",
  "#re_xushu:die": "母亲……孩儿……尽孝来了……",
  "#xunxun1": "众将死战，非我之功。",
  "#xunxun2": "爱兵如子，胜乃可全。",
  "#wangxi1": "大丈夫，何拘小节。",
  "#wangxi2": "前尘往事，莫再提起。",
  "#lidian:die": "报国杀敌，虽死犹荣……",
  "#huomo_re_zhongyao1": "笔墨抒胸臆，妙手成汗青。",
  "#huomo_re_zhongyao2": "胸蕴大家之行，则下笔如有神助。",
  "#zuoding_re_zhongyao1": "腹有大才，可助阁下成事。",
  "#zuoding_re_zhongyao2": "胸有良策，可济将军之危。",
  "#re_zhongyao:die": "人有寿终日，笔有墨尽时……",
  "#rechengxiang1": "冲有一法，可得其重。",
  "#rechengxiang2": "待我细细算来。",
  "#renxin_re_caochong1": "见死而不救，非仁者所为。",
  "#renxin_re_caochong2": "遇难而不援，非我之道也。",
  "#re_caochong:die": "父亲，兄长……",
  "#olzhijian1": "君有恙，臣者当舍命除之。",
  "#olzhijian2": "臣有言在喉，不吐不快。",
  "#olguzheng1": "兴国为任，可驱百里之行。",
  "#olguzheng2": "固政之责，在君亦在臣。",
  "#ol_zhangzhang:die": "老臣年迈，无力为继……",
  "#rejiqiao1": "机关将作之术，在乎手巧心灵。",
  "#rejiqiao2": "机巧藏于心，亦如君之容。",
  "#relinglong1": "我夫所赠之玫，遗香自长存。",
  "#relinglong2": "心有玲珑罩，不殇春与秋。",
  "#re_jsp_huangyueying:die": "此心欲留夏，奈何秋风起……",
  "#qiangzhi_re_zhangsong1": "过目难忘，千载在我腹间。",
  "#qiangzhi_re_zhangsong2": "吾目为镜，可照世间文字。",
  "#rexiantu1": "此图载益州山水，请君纳之。",
  "#rexiantu2": "我献梧木一株，为引凤而来。",
  "#re_zhangsong:die": "恨未见使君，入主益州……",
  "#reanguo1": "非武不可安邦，非兵不可定国。",
  "#reanguo2": "天下纷乱，正是吾等用武之时。",
  "#re_zhuzhi:die": "刀在人在，刀折人亡……",
  "#reluoying_dc_caozhi1": "花落断情伤，心碎斩痴妄。",
  "#reluoying_dc_caozhi2": "流水不言恨，落英难解愁。",
  "#dcjiushi1": "花开易见落难寻。",
  "#dcjiushi2": "金樽盛清酒，烟景入诗篇。",
  "#dc_caozhi:die": "一生轻松待来生……",
  "#liegong_ol_huangzhong1": "龙骨成镞，矢破苍穹！",
  "#liegong_ol_huangzhong2": "凤翎为羽，箭没坚城！",
  "#ol_huangzhong:die": "末将，有负主公重托……",
  "#zhenwei_re_wenpin1": "想攻城，问过我没有？",
  "#zhenwei_re_wenpin2": "有我坐镇，我军焉能有失？",
  "#re_wenpin:die": "没想到，敌军的攻势如此凌厉……",
  "#fuhun_re_guanzhang1": "擎刀执矛，以效先父之法！",
  "#fuhun_re_guanzhang2": "苍天在上，儿必不堕父亲威名！",
  "#re_guanzhang:die": "马革裹尸，九泉之下无愧见父……",
  "#refuman1": "蛮夷畏威，杀之积怨，抚之怀德。",
  "#refuman2": "以威镇夷，宜抚之，勿戾之。",
  "#re_mazhong:die": "愿付此生，见汉蛮一家……",
  "#repindi1": "以九品论才，正是栋梁之谋。",
  "#repindi2": "置州郡中正，可为百年之政。",
  "#refaen_dc_chenqun1": "国法虽严，然不外乎于情。",
  "#refaen_dc_chenqun2": "律令如铁，亦有可商榷之处。",
  "#dc_chenqun:die": "吾身虽亡，然吾志当遗百年……",
  "#rekuangbi1": "江东多娇，士当弼国以全方圆。",
  "#rekuangbi2": "吴垒锦绣，卿当匡佐使延万年。",
  "#re_sundeng:die": "此别无期，此恨绵绵……",
  "#rebizhuan1": "笔书石碑，以助群儒正道。",
  "#rebizhuan2": "正定六经，是为天下之法。",
  "#retongbo1": "博览诗书，通古圣之学。",
  "#retongbo2": "通读经典，悟群贤之道。",
  "#re_caiyong:die": "乞受刑罚，以求继承汉史？",
  "#remingce1": "阁下若纳此谋，则大业可成也！",
  "#remingce2": "形势如此，将军可按计行事。",
  "#zhichi_re_chengong1": "不若先行退避，再做打算。",
  "#zhichi_re_chengong2": "敌势汹汹，不宜与其交锋。",
  "#re_chengong:die": "一步迟，步步迟啊！",
  "#reqice1": "攸已有妙计在胸，此事不足为虑。",
  "#reqice2": "主公勿虑，攸有奇策，可解此局。",
  "#rezhiyu1": "经达权变，大智若愚。",
  "#rezhiyu2": "微末伎俩，让阁下见笑了。",
  "#re_xunyou:die": "再不能替主公出谋了……",
  "#juece_dc_liru1": "乏谋少计，别做无谓挣扎了！",
  "#juece_dc_liru2": "缺兵少粮，看你还能如何应对？",
  "#dcmieji1": "欲成大事，当弃则弃，怎可优柔寡断？",
  "#dcmieji2": "所谓智斗，便是以兑子入局取势，而后成杀。",
  "#dcfencheng1": "堆薪聚垛，以燃焚天之焰！",
  "#dcfencheng2": "就让这熊熊烈焰，为尔等送葬！",
  "#dc_liru:die": "多行不义，必自毙……",
  "#refenli1": "兵威已振，怎能踟蹰不前？",
  "#refenli2": "敌势汹汹，自当奋勇以对。",
  "#repingkou1": "群寇蜂起，以军平之。",
  "#repingkou2": "所到之处，寇患皆平。",
  "#re_zhuhuan:die": "憾老死病榻，恨未马革裹尸……",
  "#qiangxi_ol_dianwei1": "典韦来也，谁敢一战。",
  "#qiangxi_ol_dianwei2": "双戟青罡，百死无生！",
  "#olninge1": "古之恶来，今之典韦！",
  "#olninge2": "宁为刀俎，不为鱼肉。",
  "#ol_dianwei:die": "为将者，怎可徒手而亡？",
  "#rejixu1": "辨坚识钝，可解充栋之牛！",
  "#rejixu2": "以锐欺虚，可击泰山之踵！",
  "#re_sp_taishici:die": "危而不救为怯，救而不得为庸……",
  "#xiansi_re_liufeng1": "此皆孟达之过也！",
  "#xiansi_re_liufeng2": "非我不救，实乃孟达谗言。",
  "#re_liufeng:die": "父亲，儿实无异心……",
  "#quhu_ol_xunyu1": "两虎相斗，旁观成败。",
  "#quhu_ol_xunyu2": "驱兽相争，坐收渔利。",
  "#oljieming1": "含气在胸，有进无退。",
  "#oljieming2": "蕴节于形，生死无惧。",
  "#ol_xunyu:die": "一招不慎，为虎所噬……",
  "#rezhanjue1": "千里锦绣江山，岂能拱手相让！",
  "#rezhanjue2": "先帝一生心血，安可坐以待毙！",
  "#reqinwang1": "大江潮来，怎无忠勇之士？",
  "#reqinwang2": "泰山倾崩，可有坚贞之臣？",
  "#re_liuchen:die": "儿欲死战，父亲何故先降？",
  "#dcyicong1": "恩义聚骠骑，百战从公孙！",
  "#dcyicong2": "义从呼啸至，白马抖精神！",
  "#dcqiaomeng1": "猛士骁锐，可慑百蛮失蹄！",
  "#dcqiaomeng2": "锐士志猛，可凭白手夺马！",
  "#dc_gongsunzan:die": "良弓断，白马亡……",
  "#reandong1": "青龙映木，星出其东则天下安。",
  "#reandong2": "以身涉险，剑伐不臣而定河东。",
  "#reyingshi1": "大势如潮，可应之而不可逆之。",
  "#reyingshi2": "应大势伐贼者，当以重酬彰之。",
  "#re_duji:die": "公无渡河，公竟渡河……",
  "#dcjianying1": "步步为营，缓缓而进。",
  "#dcjianying2": "以强击弱，何必心急？",
  "#dcshibei1": "宁向北而死，不面南而生。",
  "#dcshibei2": "主公在北，吾心亦在北！",
  "#re_jushou:die": "身处河南，魂归河北……",
  "#reqiaobian1": "顺势而变，则胜矣。",
  "#reqiaobian2": "万物变化，固无休息。",
  "#re_zhanghe:die": "何处之流矢……",
  "#rezhuhai1": "霜刃出鞘，诛恶方还。",
  "#rezhuhai2": "心有不平，拔剑相向。",
  "#xsqianxin1": "弃剑执笔，修习韬略。",
  "#xsqianxin2": "休武兴文，专研筹划。",
  "#dc_xushu:die": "忠孝之德，庶两者皆空……",
  "#decadexianzhen1": "精练整齐，每战必克！",
  "#decadexianzhen2": "陷阵杀敌，好不爽快！",
  "#decadejinjiu1": "好酒之徒，难堪大任，不入我营！",
  "#decadejinjiu2": "饮酒误事，必当严禁！",
  "#xin_gaoshun:die": "力尽于布，与之偕死……",
  "#rejiaozhao1": "事关社稷，万望阁下谨慎行事。",
  "#rejiaozhao2": "为续江山，还请爱卿仔细观之。",
  "#redanxin1": "殚精出谋，以保社稷。",
  "#redanxin2": "竭心筹划，求续魏统。",
  "#re_guohuanghou:die": "哀家愧对先帝……",
  "#reqiaoshi1": "暖风细雨，心有灵犀。",
  "#reqiaoshi2": "樵采城郭外，忽见郎君来。",
  "#reyanyu1": "边功未成，还请郎君努力。",
  "#reyanyu2": "郎君有意倾心诉，妾身心中相思埋。",
  "#re_xiahoushi:die": "天气渐寒，郎君如今安在？",
  "#olhaoshi1": "仗义疏财，深得人心。",
  "#olhaoshi2": "招聚少年，给其衣食。",
  "#oldimeng1": "深知其奇，相与亲结。",
  "#oldimeng2": "同盟之人，言归于好。",
  "#ol_lusu:die": "一生为国，纵死无憾……",
  "#wansha_re_jiaxu1": "有谁敢试试？",
  "#wansha_re_jiaxu2": "斩草务尽，以绝后患。",
  "#luanwu_re_jiaxu1": "一切都在我的掌控中！",
  "#luanwu_re_jiaxu2": "这乱世还不够乱！",
  "#reweimu1": "此伤与我无关。",
  "#reweimu2": "还是另寻他法吧。",
  "#re_jiaxu:die": "此劫，我亦有所算……",
  "#reshenxing1": "谋而后动，行不容差。",
  "#reshenxing2": "谋略之道，需慎之又慎。",
  "#rebingyi1": "秉持心性，心口如一。",
  "#rebingyi2": "秉忠职守，一生不事二主。",
  "#re_guyong:die": "君不可不慎呐……",
  "#xinquanji1": "操权弄略，舍小利而谋大局。",
  "#xinquanji2": "大丈夫行事，岂较一兵一将之得失？",
  "#xinzili1": "烧去剑阁八百里，蜀中自有一片天！",
  "#xinzili2": "天下风流出我辈，一遇风云便化龙。",
  "#xin_zhonghui:die": "这就是……自食恶果的下场吗？",
  "#reqieting1": "谋略未定，窃听以察先机。",
  "#reqieting2": "所见相同，何必畏我？",
  "#rexianzhou1": "举州请降，高枕无忧。",
  "#rexianzhou2": "州固可贵，然不及我儿安危。",
  "#re_caifuren:die": "枉费妾身机关算尽……",
  "#relongyin1": "风云将起，龙虎齐鸣！",
  "#relongyin2": "武圣龙威，破敌无惧！",
  "#jiezhong1": "犯我疆土者，竭忠尽节以灭之。",
  "#jiezhong2": "竭力尽能以立功于国，忠心不二。",
  "#re_guanping:die": "黄泉路远，儿愿为父亲牵马执鞭……",
  "#rejigong1": "此时不战，更待何时！",
  "#rejigong2": "箭在弦上，不得不发！",
  "#shifei_re_guotufengji1": "若依吾计而行，许昌旦夕可破！",
  "#shifei_re_guotufengji2": "先锋怯战，非谋策之过。",
  "#re_guotufengji:die": "主公，我还有一计啊！",
  "#rezhongyong1": "赤兔北奔，马踏鼠胆之辈！",
  "#rezhongyong2": "青龙夜照，刀斩悖主之贼！",
  "#re_zhoucang:die": "愿随将军赴死！",
  "#juxiang1_ol_zhurong1": "巨象冲锋，踏平敌阵！",
  "#juxiang1_ol_zhurong2": "南兵象阵，刀枪不入！",
  "#lieren_ol_zhurong1": "烈火飞刃，例无虚发！",
  "#lieren_ol_zhurong2": "烈刃一出，谁与争锋？",
  "#changbiao1": "长标如虹，以伐蜀汉！",
  "#changbiao2": "长标在此，谁敢拦我？",
  "#ol_zhurong:die": "这汉人，竟……如此厉害……",
  "#rejueqing1": "不知情之所起，亦不知情之所终。",
  "#rejueqing2": "唯有情字最伤人！",
  "#reshangshi1": "半生韶华随流水，思君不见撷落花。",
  "#reshangshi2": "西风知我意，送我三尺秋。",
  "#re_zhangchunhua:die": "仲达负我！",
  "#rehuaiyi1": "曹刘可王，孤亦可王！",
  "#rehuaiyi2": "汉失其鹿，天下豪杰当共逐之。",
  "#re_gongsunyuan:die": "大星落，君王死……",
  "#residi1": "总算困住你了！",
  "#residi2": "你出得了手吗？",
  "#re_caozhen:die": "未竟之业，请你们务必继续！",
  "#rezhuikong1": "曹贼！你怎可如此不尊汉室！",
  "#rezhuikong2": "密信之事，不可被曹贼知晓。",
  "#reqiuyuan1": "陛下，我不想离开。",
  "#reqiuyuan2": "将军此事，可有希望。",
  "#re_fuhuanghou:die": "这幽禁之地，好冷……",
  "#reenyuan1": "善因得善果，恶因得恶报！",
  "#reenyuan2": "私我者赠之琼瑶，厌我者报之斧钺！",
  "#rexuanhuo1": "光以眩目，言以惑人。",
  "#rexuanhuo2": "我法孝直如何会害你？",
  "#re_fazheng:die": "恨未得见吾主，君临天下……",
  "#xuanfeng_xin_lingtong1": "风动扬帆起，枪出敌军溃！",
  "#xuanfeng_xin_lingtong2": "御风而动，敌军四散！",
  "#yongjin_xin_lingtong1": "鏖兵卫主，勇足以却敌！",
  "#yongjin_xin_lingtong2": "勇不可挡，进则无退！",
  "#xin_lingtong:die": "风萧而力去，风残……而力尽……",
  "#decadezishou1": "恩威并著，从容自保！",
  "#decadezishou2": "据有荆州，以观世事！",
  "#decadezongshi1": "汉室江山，气数未尽！",
  "#decadezongshi2": "我刘氏一族，皆海内之俊杰也！",
  "#xin_liubiao:die": "人心不古！",
  "#reqingxi1": "虎豹骑倾巢而动，安有不胜之理？",
  "#reqingxi2": "任尔等固若金汤，虎豹骑可破之！",
  "#re_caoxiu:die": "奈何痈发背薨！",
  "#reyanzhu1": "觥筹交错，杀人于无形！",
  "#reyanzhu2": "子烈设宴，意在汝项上人头！",
  "#rexingxue1": "案古置学官，以敦王化，以隆风俗。",
  "#rexingxue2": "志善好学，未来可期！",
  "#re_sunxiu:die": "盛世未成，实为憾事！",
  "#oltuntian1": "兵农一体，以屯养战。",
  "#oltuntian2": "垦田南山，志在西川。",
  "#olzaoxian1": "良田厚土，足平蜀道之难！",
  "#olzaoxian2": "效仿五丁开川，赢粮直捣黄龙！",
  "#ol_dengai:die": "钟会！你为何害我！",
  "#qiaomeng1": "秣马厉兵，枕戈待战。",
  "#qiaomeng2": "夺敌辎重，以为己用。",
  "#reyicong1": "变阵冲轭，以守代攻。",
  "#reyicong2": "列阵锋矢，直取要害。",
  "#re_gongsunzan:die": "皇图霸业梦，付之，一炬中……",
  "#rejunxing1": "严法尚公，岂分贵贱而异施？",
  "#rejunxing2": "情理可容之事，法未必能容！",
  "#yuce_re_manchong1": "骄之以利，示之以慑！",
  "#yuce_re_manchong2": "虽举得于外，则福生于内矣。",
  "#re_manchong:die": "宠一生为公，无愧忠俭之节……",
  "#zhiyan_xin_yufan1": "此事，臣有一言要讲。",
  "#zhiyan_xin_yufan2": "还望将军听我一言。",
  "#xinzongxuan1": "天命所定，乃天数之法。",
  "#xinzongxuan2": "因果循坏，已有定数。",
  "#xin_yufan:die": "若听谏言，何至如此……",
  "#dcanxu1": "温言呢喃，消君之愁。",
  "#dcanxu2": "吴侬软语，以解君忧。",
  "#dczhuiyi1": "别后庭中树，相思几度攀。",
  "#dczhuiyi2": "空馀宫阙恨，因此寄相思。",
  "#dc_bulianshi:die": "还请至尊多保重……",
  "#reshenduan1": "行军断策需慎之又慎！",
  "#reshenduan2": "为将者务当慎行谨断！",
  "#reyonglve1": "兵势勇健，战胜攻取，无不如志！",
  "#reyonglve2": "雄才大略，举无遗策，威震四海！",
  "#re_hanhaoshihuan:die": "末将愧对主公知遇之恩！",
  "#reduodao1": "宝刀配英雄，此刀志在必得！",
  "#reduodao2": "你根本不会用刀！",
  "#reanjian1": "暗箭中人，其疮及骨！",
  "#reanjian2": "战阵之间，不厌诈伪！",
  "#re_panzhangmazhong:die": "不知黄雀在其傍！",
  "#zhenlie_re_wangyi1": "女子，亦可有坚贞气节！",
  "#zhenlie_re_wangyi2": "品德端正，心中不移。",
  "#miji_re_wangyi1": "秘计已成，定助夫君得胜。",
  "#miji_re_wangyi2": "秘计在此，将军必凯旋而归。",
  "#re_wangyi:die": "秘计不成，此城难守……",
  "#reqianxi1": "暗影深处，袭敌斩首！",
  "#reqianxi2": "哼，出不了牌了吧？",
  "#re_madai:die": "丞相临终使命，岱已达成……",
  "#decadepojun1": "奋身出命，为国建功！",
  "#decadepojun2": "披甲持戟，先登陷陈！",
  "#xin_xusheng:die": "文向已无憾矣！",
  "#tianyi_re_taishici1": "天降大任，速战解围！",
  "#tianyi_re_taishici2": "义不从之，天必不佑！",
  "#hanzhan1": "伯符，且与我一战！",
  "#hanzhan2": "与君酣战，快哉快哉！",
  "#re_taishici:die": "无妄之灾，难以避免……",
  "#resanyao1": "蜚短流长，以基所毁，敌军自溃。",
  "#resanyao2": "群言谣混，积是成非！",
  "#zhiman_re_masu1": "断其粮草，不战而胜！",
  "#zhiman_re_masu2": "用兵之道，攻心为上！",
  "#re_masu:die": "谡虽死无恨于黄壤也……",
  "#rechanhui1": "萋兮斐兮，谋欲谮人！",
  "#rechanhui2": "稍稍谮毁，万劫不复！",
  "#rejiaojin1": "凭汝之力，何不自鉴？",
  "#rejiaojin2": "万金之躯，岂容狎侮！",
  "#re_sunluban:die": "谁敢动哀家一根寒毛！",
  "#xingongji1": "马踏飞箭，弓骑无双！",
  "#xingongji2": "提弓上马，箭砺八方！",
  "#xinjiefan1": "烦忧千万，且看我一刀解之。",
  "#xinjiefan2": "莫道雄兵属北地，解烦威名天下扬。",
  "#xin_handang:die": "三石雕弓今尤在，不见当年挽弓人……",
  "#decadezhenjun1": "奉令无犯，当敌制决！",
  "#decadezhenjun2": "质中性一，守执节义，自当无坚不陷。",
  "#yujin_yujin:die": "如今临危处难，却负丞相三十年之赏识，唉……",
  "#xinjiangchi1": "率师而行，所向皆破！",
  "#xinjiangchi2": "数从征伐，志意慷慨，不避险阻！",
  "#re_caozhang:die": "奈何病薨！",
  "#lihuo_re_chengpu1": "叛军者，非烈火灼身难泄吾恨。",
  "#lihuo_re_chengpu2": "投敌于火，烧炙其身，皮焦肉烂！",
  "#rechunlao1": "醉里披甲执坚，梦中杀敌破阵。",
  "#rechunlao2": "醇醪须与明君饮，沙场无还亦不悔。",
  "#re_chengpu:die": "病疠缠身，终天命难违……",
  "#xinyaoming1": "养威持重，不营小利。",
  "#xinyaoming2": "则天而行，作功邀名。",
  "#re_quancong:die": "邀名射利，内伤骨体，外乏筋肉。",
  "#dangxian_re_liaohua1": "竭诚当先，一举克定！",
  "#dangxian_re_liaohua2": "一马当先，奋勇杀敌！",
  "#xinfuli1": "匡扶汉室，死而后已！",
  "#xinfuli2": "一息尚存，不忘君恩！",
  "#re_liaohua:die": "汉室，气数已尽……",
  "#decadejingce1": "精细入微，策敌制胜。",
  "#decadejingce2": "妙策如神，精兵强将，安有不胜之理？",
  "#re_guohuai:die": "岂料姜维……空手接箭！",
  "#xinbenxi1": "北伐曹魏，以弱制强！",
  "#xinbenxi2": "引军汉中，以御敌袭！",
  "#re_wuyi:die": "终有疲惫之时！休矣！",
  "#xindanshou1": "胆识过人而劲勇，则见敌无所畏惧！",
  "#xindanshou2": "胆守有余，可堪大任！",
  "#re_zhuran:die": "义封一生不负国家！",
  "#xinlianhuan_ol_pangtong1": "连环之策，攻敌之计。",
  "#xinlianhuan_ol_pangtong2": "锁链连舟，困步难行。",
  "#olniepan1": "烈火脱胎，涅槃重生。",
  "#olniepan2": "破而后立，方有大成。",
  "#ol_pangtong:die": "骥飞羽落，坡道归尘……",
  "#rewurong1": "策略以入算，果烈以立威！",
  "#rewurong2": "诈与和亲，不攻可得！",
  "#reshizhi1": "护汉成勋业，矢志报国恩。",
  "#reshizhi2": "怀精忠之志，坦赤诚之心。",
  "#re_zhangyi:die": "挥师未捷，杀身以报！",
  "#xinganlu1": "纳采问名，而后交换文定。",
  "#xinganlu2": "兵戈相向，何如化戈为帛？",
  "#xinbuyi1": "有老身在，阁下勿忧。",
  "#xinbuyi2": "如此佳婿，谁敢伤之？",
  "#xin_wuguotai:die": "爱女已去，老身何存？",
  "#rejianxiong1": "燕雀，安知鸿鹄之志！",
  "#rejianxiong2": "夫英雄者，胸怀大志，腹有良谋！",
  "#hujia_re_caocao1": "大胆逆贼，谁可擒之！",
  "#hujia_re_caocao2": "护卫何在！",
  "#re_caocao:die": "华佗何在？……",
  "#refankui1": "哼，自作孽不可活！",
  "#refankui2": "哼，正中下怀！",
  "#reguicai1": "天命难违？哈哈哈哈哈……",
  "#reguicai2": "才通天地，逆天改命！",
  "#re_simayi:die": "我的气数，就到这里了么？",
  "#tiandu_re_guojia1": "天意如此。",
  "#tiandu_re_guojia2": "那，就这样吧。",
  "#reyiji1": "锦囊妙策，终定社稷。",
  "#reyiji2": "依此计行，辽东可定。",
  "#re_guojia:die": "咳，咳咳咳……",
  "#retuxi1": "快马突袭，占尽先机！",
  "#retuxi2": "马似飞影，枪如霹雳！",
  "#re_zhangliao:die": "被敌人占了先机……呃……",
  "#reluoyi1": "过来打一架，对，就是你！",
  "#reluoyi2": "废话少说，放马过来吧！",
  "#re_xuzhu:die": "丞相，末将尽力了……",
  "#reganglie1": "伤我者，十倍奉还！",
  "#reganglie2": "哪个敢动我！",
  "#qingjian1": "钱财，乃身外之物。",
  "#qingjian2": "福生于清俭，德生于卑退。",
  "#re_xiahoudun:die": "诸多败绩，有负丞相重托……",
  "#paoxiao_re_zhangfei1": "喝啊！",
  "#paoxiao_re_zhangfei2": "今，必斩汝马下！",
  "#retishen1": "谁，还敢过来一战？！",
  "#retishen2": "欺我无谋？定要尔等血偿！",
  "#re_zhangfei:die": "桃园一拜，此生……无憾……",
  "#longdan_sha_re_zhaoyun1": "龙威虎胆，斩敌破阵！",
  "#longdan_sha_re_zhaoyun2": "进退自如，游刃有余！",
  "#reyajiao1": "策马驱前，斩敌当先！",
  "#reyajiao2": "遍寻天下，但求一败！",
  "#re_zhaoyun:die": "你们谁……还敢再上……",
  "#wusheng_re_guanyu1": "刀锋所向，战无不克！",
  "#wusheng_re_guanyu2": "逆贼，哪里走！",
  "#yijue1": "恩已断，义当绝！",
  "#yijue2": "关某，向来恩怨分明！",
  "#re_guanyu:die": "桃园一拜，恩义常在……",
  "#retieji1": "目标敌阵，全军突击！",
  "#retieji2": "敌人阵型已乱，随我杀！",
  "#re_machao:die": "请将我，葬在西凉……",
  "#reyingzi1": "哈哈哈哈哈哈哈哈……！",
  "#reyingzi2": "伯符，且看我这一手！",
  "#refanjian1": "与我为敌，就当这般生不如死！",
  "#refanjian2": "抉择吧！在苦与痛的地狱中！",
  "#re_zhouyu:die": "既生瑜，何生亮！……既生瑜，何生亮……！",
  "#keji_re_lvmeng1": "蓄力待时，不争首功。",
  "#keji_re_lvmeng2": "最好的机会，还在等着我。",
  "#qinxue1": "勤以修身，学以报国。",
  "#qinxue2": "兵书熟读，了然于胸。",
  "#botu1": "今日起兵，渡江攻敌！",
  "#botu2": "时机已到，全军出击！",
  "#re_lvmeng:die": "你，给我等着！",
  "#qixi_re_ganning1": "弟兄们，准备动手！",
  "#qixi_re_ganning2": "你用不了这么多了！",
  "#fenwei1": "哼！敢欺我东吴无人。",
  "#fenwei2": "奋勇当先，威名远扬！",
  "#re_ganning:die": "别管我，继续上！",
  "#reqianxun1": "满招损，谦受益。",
  "#reqianxun2": "谦谦君子，温润如玉。",
  "#relianying1": "生生不息，源源不绝。",
  "#relianying2": "失之淡然，得之坦然。",
  "#re_luxun:die": "我的未竟之业……",
  "#reguose1": "旅途劳顿，请下马休整吧~",
  "#reguose2": "还没到休息的时候！",
  "#liuli_re_daqiao1": "伯符不在身边，我要自己保重！",
  "#liuli_re_daqiao2": "帮帮人家嘛~",
  "#re_daqiao:die": "伯符，再也没人能欺负我了……",
  "#rekurou1": "我这把老骨头，不算什么！",
  "#rekurou2": "为成大义，死不足惜！",
  "#zhaxiang1": "铁锁连舟而行，东吴水师可破！",
  "#zhaxiang2": "两军阵前，不斩降将！",
  "#re_huanggai:die": "盖，有负公瑾重托……",
  "#wushuang_re_lvbu1": "三个齐上，也不是我的对手！",
  "#wushuang_re_lvbu2": "还有哪个敢挑战我！？",
  "#liyu1": "人不为己，天诛地灭。",
  "#liyu2": "大丈夫，相时而动。",
  "#re_lvbu:die": "我竟然输了……不可能！",
  "#jijiu_re_huatuo1": "妙手仁心，药到病除。",
  "#jijiu_re_huatuo2": "救死扶伤，悬壶济世。",
  "#new_reqingnang1": "舒活筋络，方解病痛之苦。",
  "#new_reqingnang2": "悬丝诊脉，顽疾可医。",
  "#re_huatuo:die": "生老病死，命不可违……",
  "#rerende1": "施仁布泽，乃我大汉立国之本！",
  "#rerende2": "同心同德，救困扶危！",
  "#jijiang1_re_liubei1": "哪位将军，替我拿下此贼！",
  "#jijiang1_re_liubei2": "欺我军无人乎？！",
  "#re_liubei:die": "汉室未兴，祖宗未耀，朕实不忍此时西去……",
  "#lijian_re_diaochan1": "赢家，才能得到我~",
  "#lijian_re_diaochan2": "这场比赛，将军可要赢哦~",
  "#rebiyue1": "梦蝶幻月，如沫虚妄。",
  "#rebiyue2": "水映月明，芙蓉照倩影。",
  "#re_diaochan:die": "我的任务，终于完成了……",
  "#rejizhi1": "得上通，智集心。",
  "#rejizhi2": "集万千才智，致巧趣鲜用。",
  "#re_huangyueying:die": "我的面容，有吓到你吗？",
  "#rezhiheng1": "制衡互牵，大局可安。",
  "#rezhiheng2": "不急不躁，稳谋应对。",
  "#rejiuyuan1": "你们真是朕的得力干将。",
  "#rejiuyuan2": "有爱卿在，朕无烦忧。",
  "#re_sunquan:die": "锦绣江东，岂能失于我手……",
  "#xiaoji_re_sunshangxiang1": "剑利弓急，你可打不过我的。",
  "#xiaoji_re_sunshangxiang2": "我会的武器，可多着呢。",
  "#rejieyin1": "得遇夫君，妾身福分。",
  "#rejieyin2": "随夫嫁娶，宜室宜家。",
  "#re_sunshangxiang:die": "哎呀，这次弓箭射歪了。",
  "#reluoshen1": "屏翳收风，川后静波。",
  "#reluoshen2": "冯夷鸣鼓，女娲清歌。",
  "#reqingguo1": "肩若削成，腰如约素。",
  "#reqingguo2": "延颈秀项，皓质呈露。",
  "#re_zhenji:die": "出亦复何苦，入亦复何愁……",
  "#guanxing_re_zhugeliang1": "天星之变，吾窥探一二。",
  "#guanxing_re_zhugeliang2": "星途莫测，细细推敲。",
  "#kongcheng1_re_zhugeliang1": "淡然相对，转危为安。",
  "#kongcheng1_re_zhugeliang2": "绝处逢生，此招慎用。",
  "#re_zhugeliang:die": "穷尽毕生，有憾无悔……",
  "#new_reyaowu1": "有吾在此，解太师烦忧。",
  "#new_reyaowu2": "这些杂兵，我有何惧！",
  "#shizhan1": "看你能坚持几个回合！",
  "#shizhan2": "兀那汉子，且报上名来！",
  "#re_huaxiong:die": "我掉以轻心了……",
  "#xinleiji1": "疾雷迅电，不可趋避！",
  "#xinleiji2": "雷霆之诛，灭军毁城！",
  "#xinguidao1": "汝之命运，吾来改之！",
  "#xinguidao2": "鬼道运行，由我把控！",
  "#xinhuangtian2_re_zhangjiao1": "天书庇佑，黄巾可兴！",
  "#xinhuangtian2_re_zhangjiao2": "黄天法力，万军可灭！",
  "#re_zhangjiao:die": "天书无效，人心难聚……",
  "#reguhuo1": "这牌，猜对了吗？",
  "#reguhuo2": "真真假假，虚实难测。",
  "#xin_yuji:die": "符水失效，此病难医……",
  "#rehuashen1": "容貌发肤，不过浮尘。",
  "#rehuashen2": "皮囊万千，吾皆可化。",
  "#rexinsheng1": "枯木发荣，朽木逢春。",
  "#rexinsheng2": "风靡云涌，万丈光芒。",
  "#re_zuoci:die": "红尘看破，驾鹤仙升……",
  "#shensu1_ol_xiahouyuan1": "健步如飞，破敌不备！",
  "#shensu1_ol_xiahouyuan2": "奔逸绝尘，不留踪影！",
  "#shebian1": "随机应变，临机设变！",
  "#shebian2": "设变力战，虏敌千万！",
  "#ol_xiahouyuan:die": "我的速度，还是不够……",
  "#xinjushou1": "兵精粮足，守土一方。",
  "#xinjushou2": "坚守此地，不退半步。",
  "#xinjiewei1": "化守为攻，出奇制胜！",
  "#xinjiewei2": "坚壁清野，以挫敌锐！",
  "#caoren:die": "长江以南，再无王土矣……",
  "#kuanggu_ol_weiyan1": "反骨狂傲，彰显本色！",
  "#kuanggu_ol_weiyan2": "只有战场，能让我感到兴奋！",
  "#reqimou1": "勇战不如奇谋。",
  "#reqimou2": "为了胜利，可以出其不意！",
  "#ol_weiyan:die": "这次失败，意料之中……",
  "#tianxiang_ol_xiaoqiao1": "你岂会懂我的美丽？",
  "#tianxiang_ol_xiaoqiao2": "碧玉闺秀，只可远观。",
  "#rehongyan1": "红颜娇花好，折花门前盼。",
  "#rehongyan2": "我的容貌，让你心动了吗？",
  "#piaoling1": "清风拂枝，落花飘零。",
  "#piaoling2": "花自飘零水自流。",
  "#ol_xiaoqiao:die": "同心而离居，忧伤以终老……",
  "#zhoutai:die": "敌众我寡，无力回天……",
  "#rejianchu1": "你这身躯，怎么能快过我？",
  "#rejianchu2": "这些怎么能挡住我的威力！",
  "#ol_pangde:die": "人亡马倒，命之所归……",
  "#olduanliang1": "兵行无常，计行断粮。",
  "#olduanliang2": "焚其粮营，断其粮道。",
  "#oljiezi1": "剪径截辎，馈泽同袍。",
  "#oljiezi2": "截敌粮草，以资袍泽。",
  "#ol_xuhuang:die": "亚夫易老，李广难封……",
  "#bazhen_ol_sp_zhugeliang1": "八阵连心，日月同辉。",
  "#bazhen_ol_sp_zhugeliang2": "此阵变化，岂是汝等可解？",
  "#rehuoji_ol_sp_zhugeliang1": "东风，让这火烧得再猛烈些吧！",
  "#rehuoji_ol_sp_zhugeliang2": "赤壁借东风，燃火灭魏军。",
  "#rekanpo_ol_sp_zhugeliang1": "还有什么是我看不破的？",
  "#rekanpo_ol_sp_zhugeliang2": "此计奥妙，我已看破。",
  "#cangzhuo1": "藏巧于拙，用晦而明。",
  "#cangzhuo2": "寓清于浊，以屈为伸。",
  "#ol_sp_zhugeliang:die": "星途半废，夙愿未完……",
  "#olshuangxiong1": "吾执矛，君执槊，此天下可有挡我者？",
  "#olshuangxiong2": "兄弟协力，定可于乱世纵横！",
  "#ol_yanwen:die": "双雄皆陨，徒隆武圣之名……",
  "#olluanji1": "我的箭支，准备颇多！",
  "#olluanji2": "谁都挡不住，我的箭阵！",
  "#olxueyi1": "高贵名门，族裔盛名。",
  "#olxueyi2": "贵裔之脉，后起之秀！",
  "#ol_yuanshao:die": "孟德此计，防不胜防……",
  "#huoshou1_re_menghuo1": "啸据哀牢，闻祸而喜！",
  "#huoshou1_re_menghuo2": "坐据三山，蛮霸四野！",
  "#rezaiqi1": "挫而弥坚，战而弥勇！",
  "#rezaiqi2": "蛮人骨硬，其势复来！",
  "#re_menghuo:die": "勿再放我，但求速死！",
  "#oljiuchi1": "好酒，痛快！",
  "#oljiuchi2": "某，千杯不醉！",
  "#roulin_ol_dongzhuo1": "醇酒美人，幸甚乐甚！",
  "#roulin_ol_dongzhuo2": "这些美人，都可进贡。",
  "#benghuai_ol_dongzhuo1": "何人伤我？",
  "#benghuai_ol_dongzhuo2": "酒色伤身呐……",
  "#olbaonue1": "天下群雄，唯我独尊！",
  "#olbaonue2": "吾乃人屠，当以兵为贡。",
  "#ol_dongzhuo:die": "地府……可有美人乎？",
  "#wulie1": "孙武之后，英烈勇战。",
  "#wulie2": "兴义之中，忠烈之名。",
  "#ol_sunjian:die": "袁术之辈，不可共谋！",
  "#rexingshang1": "群燕辞归鹄南翔，念君客游思断肠。",
  "#rexingshang2": "霜露纷兮文下，木叶落兮凄凄。",
  "#refangzhu1": "国法不可废耳，汝先退去。",
  "#refangzhu2": "将军征战辛苦，孤当赠以良宅。",
  "#songwei2_re_caopi1": "藩屏大宗，御侮厌难！",
  "#songwei2_re_caopi2": "朕，承符运，终受革命！",
  "#re_caopi:die": "建平所言八十，谓昼夜也，吾其决矣……",
  "#tiaoxin_ol_jiangwei1": "会闻用师，观衅而动。",
  "#tiaoxin_ol_jiangwei2": "宜乘其衅会，以挑敌将。",
  "#olzhiji1": "丞相遗志，不死不休！",
  "#olzhiji2": "大业未成，矢志不渝！",
  "#ol_jiangwei:die": "星散流离……",
  "#beige_ol_caiwenji1": "箜篌鸣九霄，闻者心俱伤。",
  "#beige_ol_caiwenji2": " 琴弹十八拍，听此双泪流。",
  "#duanchang_ol_caiwenji1": "红颜留塞外，愁思欲断肠。",
  "#duanchang_ol_caiwenji2": "莫吟苦辛曲，此生谁忍闻。",
  "#ol_caiwenji:die": "飘飘外域里，何日能归乡？",
  "#xiangle_ol_liushan1": "嘿嘿嘿，还是玩耍快乐。",
  "#xiangle_ol_liushan2": "美好的日子，应该好好享受。",
  "#olfangquan1": "蜀汉有相父在，我可安心。",
  "#olfangquan2": "这些事情，你们安排就好。",
  "#olruoyu1": "若愚故泰，巧骗众人。",
  "#olruoyu2": "愚昧者，非真傻也。",
  "#ol_liushan:die": "将军英勇，我……我投降……",
  "#jiang_re_sunce1": "收合流散，东据吴会。",
  "#jiang_re_sunce2": "策虽暗稚，窃有微志。",
  "#olhunzi1": "江东新秀，由此崛起！",
  "#olhunzi2": "看汝等大展英气！",
  "#olzhiba1": "让将军在此恭候多时了。",
  "#olzhiba2": "有诸位将军在，此战岂会不胜？",
  "#re_sunce:die": "汝等，怎能受于吉蛊惑？",
  "#jyzongshi_re_jianyong1": "能断大事者，不拘小节。",
  "#jyzongshi_re_jianyong2": "闲暇自得，威仪不肃。",
  "#re_jianyong:die": "此景竟无言以对……",
  "#rexianzhen1": "陷阵之志，有死无生！",
  "#rexianzhen2": "攻则破城，战则克敌。",
  "#rejinjiu1": "耽此黄汤，岂不误事？",
  "#rejinjiu2": "陷阵营中，不可饮酒。",
  "#regongji1": "射石饮羽，弦无虚发！",
  "#regongji2": "驭马前行，弓急弦发！",
  "#repolu1": "斩敌复城，扬我江东军威！",
  "#jianyan1": "开言纳谏，社稷之福。",
  "#jianyan2": "如此如此，敌军自破！",
  "#wusheng_re_guanzhang1": "青龙驰骋，恍若汉寿再世。",
  "#wusheng_re_guanzhang2": "偃月幽光，恰如武圣冲阵。",
  "#paoxiao_re_guanzhang1": "桓侯之子，当效父之勇烈！",
  "#paoxiao_re_guanzhang2": "蛇矛在手，谁敢与我一战！",
  "#rejianyan1": "此人之才，胜吾十倍。",
  "#rejianyan2": "先生大才，请受此礼。",
  "#xinpaiyi1": "蜀川三千里，皆由我一言决之！",
  "#xinpaiyi2": "顺我者，封侯拜将；逆我者，斧钺加身！",
  "#jixi_ol_dengai1": "良田为济，神兵天降！",
  "#jixi_ol_dengai2": "明至剑阁，暗袭蜀都！",
  "#bazhen_ol_pangtong1": "八卦四象，阴阳运转。",
  "#bazhen_ol_pangtong2": "离火艮山，皆随我用。",
  "#rehuoji_ol_pangtong1": "火烧赤壁，曹贼必败。",
  "#rehuoji_ol_pangtong2": "火计诱敌，江水助势。",
  "#rekanpo_ol_pangtong1": "这些小伎俩，逃不出我的眼睛！",
  "#rekanpo_ol_pangtong2": "卧龙之才，吾也略懂。",
  "#gongxin_re_lvmeng1": "哼，早知如此。",
  "#gongxin_re_lvmeng2": "洞若观火，运筹帷幄。",
  "#rechanyuan1": "此咒甚重，怨念缠身。",
  "#rechanyuan2": "不信吾法，无福之缘。",
  "#guanxing_ol_jiangwei1": "星象相弦，此乃吉兆！",
  "#guanxing_ol_jiangwei2": "星之分野，各有所属。",
  "#jijiang1_ol_liushan1": "爱卿爱卿，快来护驾！",
  "#jijiang1_ol_liushan2": "将军快替我，拦下此贼！",
  "#sishu1": "蜀乐乡土，怎不思念？",
  "#sishu2": "思乡心切，徘徊惶惶。",
  "#reyingzi_re_sunce1": "得公瑾辅助，策必当一战！",
  "#reyingzi_re_sunce2": "公瑾在此，此战无忧！",
  "#yinghun_re_sunce1": "东吴繁盛，望父亲可知。",
  "#yinghun_re_sunce2": "父亲，吾定不负你期望！"
};
const characterSort = {
  refresh_standard: ["re_caocao", "re_simayi", "re_guojia", "re_zhangliao", "re_xuzhu", "re_xiahoudun", "re_zhangfei", "re_zhaoyun", "re_guanyu", "re_machao", "re_zhouyu", "re_lvmeng", "re_ganning", "re_luxun", "re_daqiao", "re_huanggai", "re_lvbu", "re_huatuo", "re_liubei", "re_diaochan", "re_huangyueying", "re_sunquan", "re_sunshangxiang", "re_zhenji", "re_zhugeliang", "re_huaxiong", "re_gongsunzan", "re_lidian", "re_xushu"],
  refresh_feng: ["caoren", "ol_xiahouyuan", "ol_weiyan", "ol_xiaoqiao", "zhoutai", "re_zhangjiao", "xin_yuji", "ol_huangzhong"],
  refresh_huo: ["ol_sp_zhugeliang", "ol_xunyu", "ol_dianwei", "ol_yanwen", "ol_pangtong", "ol_yuanshao", "ol_pangde", "re_taishici"],
  refresh_lin: ["re_menghuo", "ol_sunjian", "re_caopi", "ol_xuhuang", "ol_dongzhuo", "ol_zhurong", "re_jiaxu", "ol_lusu"],
  refresh_shan: ["ol_jiangwei", "ol_caiwenji", "ol_liushan", "ol_zhangzhang", "re_zuoci", "re_sunce", "ol_dengai", "re_zhanghe"],
  refresh_yijiang1: ["xin_wuguotai", "xin_gaoshun", "dc_caozhi", "yujin_yujin", "re_masu", "xin_xusheng", "re_fazheng", "xin_lingtong", "re_zhangchunhua", "dc_xushu", "re_chengong"],
  refresh_yijiang2: ["re_madai", "re_wangyi", "xin_handang", "xin_zhonghui", "re_liaohua", "re_chengpu", "re_caozhang", "dc_bulianshi", "xin_liubiao", "re_xunyou", "re_guanzhang"],
  refresh_yijiang3: ["re_jianyong", "re_guohuai", "re_zhuran", "re_panzhangmazhong", "xin_yufan", "dc_liru", "re_manchong", "re_fuhuanghou", "re_guanping", "re_liufeng", "re_caochong"],
  refresh_yijiang4: ["re_sunluban", "re_wuyi", "re_hanhaoshihuan", "re_caozhen", "re_zhoucang", "dc_chenqun", "re_caifuren", "re_guyong", "re_jushou", "re_zhuhuan", "re_zhangsong"],
  refresh_yijiang5: ["re_zhangyi", "re_quancong", "re_caoxiu", "re_sunxiu", "re_gongsunyuan", "re_guotufengji", "re_xiahoushi", "re_liuchen", "re_zhuzhi", "re_caorui", "re_zhongyao"],
  refresh_yijiang6: ["re_guohuanghou", "re_sundeng"],
  refresh_xinghuo: ["xin_zhangliang", "re_zhugedan", "re_simalang", "re_duji", "dc_gongsunzan", "re_sp_taishici", "re_caiyong", "re_mazhong", "re_wenpin", "re_jsp_huangyueying"]
};
const characterSortTranslate = {
  refresh_standard: "界限突破·标",
  refresh_feng: "界限突破·风",
  refresh_huo: "界限突破·火",
  refresh_lin: "界限突破·林",
  refresh_shan: "界限突破·山",
  refresh_yijiang1: "界限突破·将1",
  refresh_yijiang2: "界限突破·将2",
  refresh_yijiang3: "界限突破·将3",
  refresh_yijiang4: "界限突破·将4",
  refresh_yijiang5: "界限突破·将5",
  refresh_yijiang6: "界限突破·原6",
  refresh_xinghuo: "界限突破·星火"
};
game.import("character", function() {
  return {
    name: "refresh",
    connect: true,
    character: { ...characters },
    characterSort: {
      refresh: characterSort
    },
    characterFilter: { ...characterFilters },
    characterTitle: { ...characterTitles },
    dynamicTranslate: { ...dynamicTranslates },
    characterIntro: { ...characterIntro },
    card: { ...cards },
    skill: { ...skills },
    perfectPair: { ...perfectPairs },
    translate: { ...translates, ...voices, ...characterSortTranslate },
    pinyins: { ...pinyins }
  };
});
