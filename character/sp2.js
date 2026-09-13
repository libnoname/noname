import { lib, get, game, _status, ui } from "noname";
const characters = {
  star_zhugejin: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["starzunjian", "starhongya"]
  },
  caobao: {
    sex: "male",
    group: "qun",
    hp: 4,
    maxHp: 5,
    skills: ["yanjiu", "poyin"]
  },
  star_zhangsong: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["starxisong", "starfanglang"]
  },
  star_zhanghe: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["starjunxi", "starjixian"]
  },
  dc_yanxiang: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcyuzheng", "dcyxsuishi"]
  },
  cuilie: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dczijue", "dcchibi"]
  },
  star_jiangwan: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["starzhenting", "starchiguo"]
  },
  star_taishici: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["starchongwei", "starchongzu"]
  },
  star_zhangrang: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["starduhai", "starlingse"]
  },
  star_wenchou: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["starlianzhan", "starweiming"]
  },
  star_yanliang: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["starjizhan", "starcuxia"]
  },
  star_dingfeng: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["stardangchen", "starjianyu"]
  },
  star_fazheng: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["starzhiji", "staranji"]
  },
  matie: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["twodcspzhuiji", "dcquxian"]
  },
  hansong: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcyinbi", "dcshuaiyan"]
  },
  chezhou: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["dcshefu", "dcpigua"]
  },
  star_xunyu: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["staranshu", "starkuangzuo"],
    clans: ["颍川荀氏"]
  },
  star_zhangzhao: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["starzhongyan", "starjinglun"]
  },
  star_sunjian: {
    sex: "male",
    group: "qun",
    hp: 4,
    maxHp: 5,
    skills: ["starruijun", "stargangyi"]
  },
  star_xiahouba: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["starweigu", "starjuefa"],
    names: "夏侯|霸"
  },
  liqueguosi: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xiongsuan"],
    names: "李|傕-郭|汜"
  },
  star_zhangchunhua: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["starliangyan", "starminghui"]
  },
  star_yuanshao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["starxiaoyan", "starzongshi", "starjiaowang", "staraoshi"],
    isZhugong: true
  },
  star_dongzhuo: {
    sex: "male",
    group: "qun",
    hp: 5,
    skills: ["starweilin", "starzhangrong", "starhaoshou"],
    isZhugong: true
  },
  star_yuanshu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["starcanxi", "starpizhi", "starzhonggu"],
    isZhugong: true
  },
  star_caoren: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["starsujun", "starlifeng"]
  },
  star_sunshangxiang: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["starsaying", "starjiaohao"]
  },
  dc_jikang: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["new_qingxian", "dcjuexiang"],
    dieAudios: ["jikang"]
  },
  dc_jsp_guanyu: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["new_rewusheng", "dcdanji"],
    dieAudios: ["jsp_guanyu"],
    tempname: ["jsp_guanyu"]
  },
  dc_mengda: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["dclibang", "dcwujie"]
  },
  guānning: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["dcxiuwen", "longsong"]
  },
  sunhuan: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["dcniji"]
  },
  sunlang: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["dctingxian", "dcbenshi"]
  },
  shiyi: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["dccuichuan", "dczhengxu"]
  },
  dc_hujinding: {
    sex: "female",
    group: "shu",
    hp: 3,
    maxHp: 6,
    skills: ["dcdeshi", "dcwuyuan", "huaizi"]
  },
  liyixiejing: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["dcdouzhen"],
    names: "李|异-谢|旌"
  },
  mushun: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcjinjian", "dcshizhao"]
  },
  dc_zhaoyǎn: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["dcfuning", "dcbingji"]
  },
  wangwei: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcruizhan", "dcshilie"]
  },
  dc_huban: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["dcchongyi"]
  },
  niufu: {
    sex: "male",
    group: "qun",
    hp: 4,
    maxHp: 7,
    skills: ["dcxiaoxi", "xiongrao"]
  },
  bianxi: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["dunxi"]
  },
  fengfang: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcditing", "dcbihuo"]
  },
  qinyilu: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["piaoping", "tuoxian", "zhuili"]
  },
  yanrou: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["choutao", "xiangshu"]
  },
  dc_zhuling: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["dczhanyi"]
  },
  licaiwei: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["yijiao", "qibie"],
    groupBorder: "wei"
  },
  yanfuren: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["channi", "nifu"],
    names: "严|null"
  },
  haomeng: {
    sex: "male",
    group: "qun",
    hp: 7,
    skills: ["xiongmang"]
  },
  re_pangdegong: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["heqia", "yinyi"]
  },
  hanmeng: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jieliang", "quanjiu"]
  },
  xinping: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["fuyuan", "zhongjie", "yongdi"]
  },
  zhangning: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["tianze", "difa"]
  },
  tongyuan: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["chaofeng", "chuanshu"]
  },
  sp_mifangfushiren: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["fengshi"],
    names: "糜|芳-傅|士仁"
  },
  re_nanhualaoxian: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["gongxiu", "jinghe"],
    names: "庄|周"
  },
  dufuren: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["yise", "shunshi"],
    names: "杜|null"
  },
  caoanmin: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["xianwei"]
  },
  re_zoushi: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["rehuoshui", "reqingcheng"],
    names: "邹|null",
    dieAudios: ["zoushi"]
  },
  qiuliju: {
    sex: "male",
    group: "qun",
    hp: 4,
    maxHp: 6,
    skills: ["koulve", "qljsuiren"],
    names: "null|null"
  },
  re_hucheer: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["redaoji", "fuzhong"]
  },
  re_dongcheng: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xuezhao"]
  },
  tangji: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["kangge", "jielie"],
    names: "唐|null"
  },
  zhangheng: {
    sex: "male",
    group: "qun",
    hp: 8,
    skills: ["dangzai", "liangjue"]
  },
  duanwei: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["junklangmie"]
  },
  re_niujin: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["recuorui", "reliewei"]
  },
  zhangmiao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["mouni", "zongfan"]
  },
  liangxing: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["lulve", "lxzhuixi"]
  },
  caosong: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["cslilu", "csyizheng"]
  },
  re_taoqian: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["zhaohuo", "reyixiang", "reyirang"]
  },
  zhaozhong: {
    sex: "male",
    group: "qun",
    hp: 6,
    skills: ["yangzhong", "huangkong"]
  },
  hanfu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["hfjieying", "weipo"],
    clans: ["颍川韩氏"]
  },
  re_quyi: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["refuqi", "jiaozi"],
    dieAudios: ["quyi"]
  },
  dongxie: {
    sex: "female",
    group: "qun",
    hp: 4,
    skills: ["dcjiaoxia", "dchumei"]
  },
  wangrong: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["minsi", "jijing", "zhuide"]
  },
  ol_dingyuan: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["cixiao", "xianshuai"]
  },
  re_hejin: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["spmouzhu", "spyanhuo"],
    dieAudios: ["hejin"]
  },
  re_hansui: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["spniluan", "spweiwu"],
    dieAudios: ["hansui"]
  },
  liuhong: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["yujue", "tuxing"]
  },
  zhujun: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["gongjian", "kuimang"]
  },
  re_maliang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["rexiemu", "heli"]
  },
  caobuxing: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["moying", "juanhui"]
  },
  lijue: {
    sex: "male",
    group: "qun",
    hp: 4,
    maxHp: 6,
    skills: ["xinfu_langxi", "xinfu_yisuan"]
  },
  zhangji: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xinfu_lveming", "xinfu_tunjun"]
  },
  fanchou: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xinxingluan"]
  },
  guosi: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xinfu_tanbei", "xinfu_sidao"]
  },
  lvkai: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["xinfu_tunan", "xinfu_bijing"]
  },
  zhanggong: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["xinfu_zhenxing", "xinfu_qianxin"]
  },
  weiwenzhugezhi: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["xinfu_fuhai"],
    names: "卫|温-诸葛|直"
  },
  beimihu: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["zongkui", "guju", "baijia"],
    names: "null|null"
  },
  sp_liuqi: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["rewenji", "sptunjiang"]
  },
  xf_tangzi: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["xinfu_xingzhao"]
  },
  xf_huangquan: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["xinfu_dianhu", "xinfu_jianji"]
  },
  xf_sufei: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["xinfu_lianpian"]
  },
  xushao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["pingjian"]
  },
  xinpi: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["xpchijie", "yinju"]
  },
  lisu: {
    sex: "male",
    group: "qun",
    hp: 2,
    skills: ["lslixun", "lskuizhu"]
  },
  zhangwen: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["songshu", "sibian"]
  },
  mangyachang: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["spjiedao"],
    names: "null|null"
  },
  xugong: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["biaozhao", "yechou"]
  },
  zhangchangpu: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["yanjiao", "xingshen"]
  },
  gaolan: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xiying"]
  },
  sp_shenpei: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["gangzhi", "beizhan"]
  },
  xunchen: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["fenglve", "mouzhi"],
    clans: ["颍川荀氏"]
  },
  sp_zhanghe: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["yuanlve"]
  },
  sp_xuyou: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["spshicai", "spfushi"]
  },
  chunyuqiong: {
    sex: "male",
    group: "qun",
    hp: 5,
    skills: ["cangchu", "sushou", "liangying"],
    names: "淳于|琼"
  },
  lvkuanglvxiang: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["liehou", "qigong"],
    names: "吕|旷-吕|翔"
  },
  duji: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["xinfu_andong", "xinfu_yingshi"]
  },
  liuyao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xinfu_kannan", "twniju"],
    isZhugong: true
  },
  lvdai: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["xinfu_qinguo"]
  },
  sp_taishici: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xinfu_jixu"],
    names: "太史|慈"
  },
  re_zhangliang: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xinfu_jijun", "xinfu_fangtong"]
  }
};
const cards = {};
const pinyins = {};
const skills = {
  //星诸葛瑾
  starzunjian: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.hasDiscardableCards(player, "h", (card) => !player.getStorage("starzunjian_used").includes(get.suit(card)));
    },
    filterCard(card, player) {
      if (player.getStorage("starzunjian_used").includes(get.suit(card))) {
        return false;
      }
      if (!lib.filter.cardDiscardable(card, player, "starzunjian")) {
        return false;
      }
      if (ui.selected.cards.length) {
        return get.suit(card) === get.suit(ui.selected.cards[0]);
      }
      return true;
    },
    selectCard() {
      if (ui.selected.cards?.length) {
        return -1;
      }
      return 1;
    },
    position: "h",
    filterTarget: true,
    check(card) {
      return 8 - get.value(card);
    },
    async content(event, trigger, player) {
      const cards2 = event.cards;
      const target = event.target;
      player.addTempSkill(event.name + "_used");
      player.markAuto(event.name + "_used", [get.suit(cards2[0])]);
      const num = lib.suit.slice().removeArray(player.getCards("h").map((card) => get.suit(card))).length;
      if (num > 0) {
        await target.draw({ num });
      }
      if (target.isMaxHandcard(true) && target != player) {
        await target.chooseToGive({ target: player, selectCard: [1, 2], position: "h", prompt: `尊谏：你可以交给${get.translation(player)}至多两张手牌` });
      }
      if (target.isMinHp(true) && target.isDamaged()) {
        const result = await player.chooseBool({
          prompt: `尊谏：是否令${get.translation(target)}回复一点体力`,
          ai() {
            const { player: player2, target: target2 } = get.event();
            if (get.attitude(player2, target2) > 0) {
              return 1;
            }
            return 0;
          }
        }).set("target", target).forResult();
        if (result?.bool) {
          await target.recover();
        }
      }
    },
    ai: {
      order: 0.01,
      result: {
        player: 1,
        target(player, target) {
          if (target.hasSkillTag("nogain")) {
            return 0;
          }
          if (get.attitude(player, target) < 0) {
            return 0;
          }
          return target.countCards("h") * Math.max(1, target.getDamagedHp());
        }
      }
    },
    subSkill: { used: { charlotte: true, onremove: true, intro: { content: "本回合已弃置花色：$" } } }
  },
  starhongya: {
    audio: 2,
    trigger: { target: "useCardToTarget" },
    filter(event, player) {
      return player.hasCards("h") && player != event.player && typeof get.number(event.card) == "number";
    },
    usable: 2,
    async cost(event, trigger, player) {
      const num = get.number(trigger.card);
      event.result = await player.chooseCard({
        prompt: get.prompt(event.skill),
        prompt2: `重铸一张点数比${num}更大的手牌令${get.translation(trigger.card)}对你无效`,
        filterCard(card, player2) {
          if (!lib.filter.cardRecastable(card, player2)) {
            return false;
          }
          return get.number(card) > get.event().num;
        },
        ai(card) {
          const { player: player2, target, cardx } = get.event();
          if (get.effect(player2, cardx, target, player2) <= 0) {
            return 114514 - get.value(card);
          }
          return 0;
        }
      }).set("num", num).set("target", trigger.player).set("cardx", trigger.card).forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      trigger.getParent().excluded.add(player);
      const num = lib.suit.slice().removeArray(player.getCards("h").map((card) => get.suit(card))).length;
      const num1 = get.number(cards2[0]), num2 = Math.max(0, ...player.getCards("h").map((card) => get.number(card)));
      await player.recast(cards2);
      if (num1 >= num2 && num > 0) {
        await player.draw({ num });
      }
    }
  },
  //曹豹
  yanjiu: {
    audio: 2,
    forced: true,
    trigger: { global: "roundEnd" },
    getNum(player) {
      return player.countRoundHistory("useCard", (evt) => evt.card.name == "jiu");
    },
    async content(event, trigger, player) {
      const num = get.info(event.name).getNum(player);
      if (num > 0) {
        await player.loseHp(num);
        if (game.hasPlayer((current) => current != player)) {
          const result = await player.chooseTarget(lib.filter.notMe, "请选择一名其他角色，其下次受到【杀】的伤害+1", true).set("ai", (target) => {
            const player2 = get.player();
            return -get.attitude(player2, target);
          }).forResult();
          if (result?.bool) {
            const target = result.targets[0];
            player.line(target);
            target.addSkill(event.name + "_effect");
            target.addMark(event.name + "_effect", 1, false);
          }
        }
      } else {
        await player.recover();
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        trigger: { player: "damageBegin3" },
        filter(event, player) {
          return event.card?.name == "sha";
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          trigger.num += player.countMark(event.name);
          player.removeSkill(event.name);
        },
        intro: { content: "下次受到【杀】的伤害时，此伤害+#" }
      }
    }
  },
  poyin: {
    audio: 2,
    forced: true,
    trigger: { player: "phaseBegin" },
    async content(event, trigger, player) {
      let result = await player.draw({ num: player.maxHp }).forResult();
      if (get.itemtype(result?.cards) != "cards") {
        return;
      }
      const list = [player.getDamagedHp(), player.getHp()].sort((a, b) => a - b);
      const hs = player.getCards("h", (card) => result.cards.includes(card));
      if (hs.length <= list[1]) {
        result = { bool: true, cards: hs };
      } else {
        result = await player.chooseCard({
          prompt: `迫饮：选择其中${get.cnNumber(list[0])}张或${get.cnNumber(list[1])}张牌视为【酒】`,
          forced: true,
          position: "h",
          selectCard: list,
          filterCard(card, player2) {
            return get.event().cards?.includes(card);
          },
          filterOk() {
            return get.event().list.includes(ui.selected.cards?.length);
          },
          ai(card) {
            const num = get.event().selectCard[0];
            if (num == 0) {
              if (player.getHp() >= 3) {
                return 0;
              }
              return 6 - get.value(card);
            } else {
              if (ui.selected.cards.length == get.event().selectCard[0]) {
                return 0;
              }
              return 6 - get.value(card);
            }
          }
        }).set("list", list).set("cards", result.cards).forResult();
      }
      if (result?.cards?.length) {
        player.addSkill(`${event.name}_jiu`);
        player.addGaintag(result.cards, `${event.name}_jiu`);
      }
    },
    group: "poyin_end",
    subSkill: {
      end: {
        audio: "poyin",
        trigger: { player: "phaseEnd" },
        forced: true,
        logTarget(event, player, name) {
          return game.filterPlayer((target) => target.isMaxHandcard()).sortBySeat();
        },
        async content(event, trigger, player) {
          const { targets } = event;
          for (const target of targets.sortBySeat()) {
            if (!target.isIn()) {
              continue;
            }
            const reality = player.countCards("h", "jiu") > player.countCards("h", (card) => get.name(card) != "jiu");
            const result = await target.chooseBool({
              prompt: `迫饮：请猜测${get.translation(player)}手牌中的【酒】是否多于其余手牌`,
              choice: (() => {
                const view = target.hasSkillTag("viewHandcard", null, player, true);
                if (view) {
                  return reality;
                }
                if (player == target) {
                  return !reality;
                }
                return Math.random() > 0.5;
              })()
            }).forResult();
            const bool = Boolean(result?.bool);
            if (bool == reality) {
              target.popup("猜测正确");
              game.log(target, "#g猜测正确");
              const card = get.cardPile2((card2) => get.name(card2) == "sha");
              if (card) {
                await target.gain({ cards: [card], animate: "gain2" });
              }
            } else {
              target.popup("猜测错误");
              game.log(target, "#g猜测错误");
              const result2 = await player.chooseCard({
                prompt: `迫饮：你可以重铸任意张牌`,
                selectCard: [1, Infinity],
                filterCard: lib.filter.cardRecastable,
                position: "he",
                ai(card) {
                  const player2 = get.player();
                  if (player2.hasSkill("yanjiu") && get.name(card) == "jiu") {
                    return 8 - get.value(card);
                  }
                  return 6 - get.value(card);
                }
              }).forResult();
              if (result2?.bool && result2.cards?.length) {
                await player.recast(result2.cards);
              }
            }
          }
        }
      },
      jiu: {
        charlotte: true,
        onremove(player, skill) {
          player.removeGaintag(skill);
        },
        mod: {
          cardname(card, player) {
            if (get.itemtype(card) == "card" && card.hasGaintag("poyin_jiu")) {
              return "jiu";
            }
          }
        }
      }
    }
  },
  //星张松
  starxisong: {
    audio: 2,
    trigger: {
      global: "phaseUseBegin"
    },
    round: 1,
    filter(event, player) {
      return event.player != player && event.player.countCards("h") > 0;
    },
    logTarget: "player",
    check(event, player) {
      return get.attitude(player, event.player) < 0;
    },
    getList: (card) => [get.type2(card), get.suit(card), get.number(card)],
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      await player.viewHandcards(target);
      player.addTempSkill(`${event.name}_mark`, "phaseChange");
      player.markAuto(`${event.name}_mark`, target.getCards("h"));
      player.when({ global: "phaseUseEnd" }).filter((evt) => evt == trigger).then(async (event2, trigger2, player2) => {
        if (!target.isIn() || !target.countCards("h")) {
          return;
        }
        const known = target.getCards("h", (card) => card.isKnownBy(player2));
        const types = ["basic", "trick", "equip"];
        const suits = lib.suit.slice();
        const numbers = Array.from({ length: 13 }).map((val, i) => i + 1);
        const getList = get.info("starxisong").getList;
        const result = await player2.chooseButton([`悉诵：请声明一个类别、花色和点数并展示${get.translation(target)}的手牌`, [types.map((i) => [i, get.translation(i)]), "tdnodes"], [suits.map((i) => [i, get.translation(i)]), "tdnodes"], [numbers.map((i) => [i, get.strNumber(i)]), "tdnodes"]], 3, true).set("filterButton", (button) => {
          const { buttons } = ui.selected;
          const { link } = button;
          if (!buttons.length) {
            return ["basic", "trick", "equip"].includes(link);
          } else if (buttons.length == 1) {
            return lib.suit.includes(link);
          } else {
            return typeof link == "number";
          }
        }).set(
          "list",
          known.randomGets(1).flatMap((i) => getList(i))
        ).set("ai", (button) => {
          const { list } = get.event();
          if (!list?.length) {
            return Math.random();
          }
          return list.includes(button.link);
        }).forResult();
        const { links } = result;
        if (links?.length) {
          game.log(player2, "声明了", `#g${get.translation(links[0])}、${get.translation(links[1])}、${get.strNumber(links[2])}`);
          await target.showHandcards();
          const hs = target.getCards("h").filter((card) => getList(card).every((val, idx) => val == links[idx]));
          if (hs.length) {
            player2.popup("洗具");
            await target.modedDiscard(hs);
            player2.refreshSkill("starxisong");
            while (hs.length) {
              const card = hs.shift();
              if (get.position(card) == "d" && (player2.hasUseTarget(card, void 0, true) || get.info(card).notarget && lib.filter.cardEnabled(card, player2))) {
                await player2.chooseUseTarget(card, true, false);
              }
            }
          } else {
            player2.popup("杯具");
          }
        }
      });
    },
    subSkill: {
      mark: {
        charlotte: true,
        onremove: true,
        intro: {
          name: "悉诵（观看的牌）",
          markcount: () => 0,
          mark(dialog, storage, player) {
            if (player.isUnderControl(true)) {
              dialog.add(storage);
            } else {
              dialog.addText("雨女无瓜");
            }
          }
        }
      }
    }
  },
  starfanglang: {
    audio: 2,
    trigger: { player: "phaseDrawEnd" },
    filter(event, player) {
      const hs = player.getCards("he");
      return player.getHistory("gain", (evt) => evt.getParent("phaseDraw") == event).reduce((list, evt) => [...list, ...evt.cards], []).containsSome(...hs);
    },
    check: () => true,
    async cost(event, trigger, player) {
      const cards2 = player.getHistory("gain", (evt) => evt.getParent("phaseDraw") == trigger).reduce((list, evt) => [...list, ...evt.cards], []);
      event.result = await player.chooseCard({
        prompt: get.prompt2(event.skill),
        position: "he",
        filterCard(card, player2) {
          return get.event().cards.includes(card);
        },
        cards: cards2,
        ai(card) {
          return Math.random();
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      player.addTempSkill(event.name + "_draw", { player: "phaseBeforeStart" });
      player.markAuto(event.name + "_draw", cards2);
      await player.showCards(cards2);
    },
    group: ["starfanglang_gain"],
    subSkill: {
      draw: {
        audio: "starfanglang",
        charlotte: true,
        onremove: true,
        intro: { content: "cards" },
        trigger: { player: ["useCard", "respond"] },
        forced: true,
        filter(event, player) {
          const storage = player.getStorage("starfanglang_draw");
          return storage.length > 0 && (player.getHistory("useCard").indexOf(event) == 0 || player.getHistory("respond").indexOf(event) == 0) && !event.cards.containsSome(...storage) && get.info("starfanglang_draw").getNum(player, event.card) > 0;
        },
        getNum(player, card) {
          const getList = get.info("starxisong").getList;
          const storage = player.getStorage("starfanglang_draw");
          const list = storage.map((i) => getList(i));
          const keys = ["type2", "suit", "number"];
          return keys.filter((key, idx) => list.some((i) => i[idx] == get[key](card))).length;
        },
        async content(event, trigger, player) {
          await player.draw(get.info(event.name).getNum(player, trigger.card));
        }
      },
      gain: {
        audio: "starfanglang",
        trigger: { player: "phaseJieshuBegin" },
        filter(event, player) {
          return player.hasDiscardableCards(player, "he");
        },
        async cost(event, trigger, player) {
          event.result = await player.chooseToDiscard(`###${get.prompt(event.skill)}###你可以弃置一张牌，然后你获得弃牌堆中与此牌类别、点数、花色相同的牌各一张牌。`, "he", "chooseonly").set("ai", (card) => 7 - get.value(card)).forResult();
        },
        async content(event, trigger, player) {
          const { cards: cards2 } = event;
          await player.discard(cards2);
          const gain = [];
          const keys = ["type2", "suit", "number"];
          keys.forEach((key, idx) => {
            const card = get.discardPile((card2) => {
              return !gain.includes(card2) && get[key](card2) == get[key](cards2[0]);
            });
            if (card) {
              gain.push(card);
            }
          });
          if (gain.length) {
            await player.gain(gain, "gain2");
          }
        }
      }
    }
  },
  //星张郃
  starjunxi: {
    audio: 2,
    trigger: {
      player: ["phaseUseBegin", "phaseUseEnd"]
    },
    filter(event, player, name, list) {
      if (name == "phaseUseEnd") {
        return list[0]?.isIn();
      }
      return game.hasPlayer((current) => current != player);
    },
    getIndex(event, player, name) {
      if (name == "phaseUseEnd") {
        return player.getStorage("starjunxi");
      }
      return 1;
    },
    async cost(event, trigger, player) {
      if (event.triggername == "phaseUseEnd") {
        event.result = {
          bool: true,
          targets: [event.indexedData[0]]
        };
        return;
      }
      event.result = await player.chooseTarget(get.prompt2(event.skill), lib.filter.notMe).set("ai", (target) => {
        return -get.attitude(get.player(), target);
      }).forResult();
    },
    intro: {
      content(storage) {
        return storage.map((info) => `${get.translation(info[0])}：${info[1]}`).join("<br>");
      }
    },
    onremove: true,
    async content(event, trigger, player) {
      const target = event.targets[0], num = player.countCards("h");
      if (event.triggername == "phaseUseBegin") {
        player.markAuto(event.name, [[target, num]]);
        return;
      }
      const list = player.getStorage(event.name), index = list.findIndex((info) => info[0] == target);
      if (index < 0) {
        return;
      }
      const num2 = list.splice(index, 1)[0][1];
      player.setStorage(event.name, list, true);
      const numx = Math.abs(num - num2);
      if (numx == 0) {
        await player.chooseToDiscard("he", true, 2);
        return;
      }
      const result = target.countDiscardableCards(target, "he") > 0 ? await target.chooseToDiscard(`弃置${get.cnNumber(numx)}张牌，每少弃置一张牌便失去1点体力`, [1, numx], "he").set("ai", (card) => {
        const { eff, maxNum: num3, player: player2 } = get.event();
        if (eff > 0) {
          const numx2 = num3 - ui.selected.cards.length;
          if (numx2 < player2.hp) {
            return 0;
          }
        }
        return 10 - get.value(card);
      }).set("complexCard", true).set("maxNum", numx).set("eff", get.effect(target, { name: "losehp" }, target, target)).forResult() : {
        bool: false
      };
      if (result?.bool && result.cards?.length) {
        const numx2 = numx - result.cards.length;
        if (numx2 > 0) {
          await target.loseHp(numx2);
        }
      } else {
        await target.loseHp(numx);
      }
    }
  },
  starjixian: {
    audio: 2,
    trigger: {
      player: "phaseDiscardAfter"
    },
    filter(event, player) {
      const evt = game.getGlobalHistory("everything", (evt2) => evt2.name == "phaseUse" && evt2.player == player)[0];
      if (!evt || _status.currentPhase != player) {
        return false;
      }
      return !player.hasHistory("useCard", (evtx) => evtx.getParent("phaseUse") == evt && ["basic", "trick"].includes(get.type2(evtx.card)));
    },
    forced: true,
    locked: false,
    async content(event, trigger, player) {
      const evt = trigger.getParent("phase", true);
      if (evt) {
        evt.phaseList.splice(evt.num + 1, 0, `phaseUse|${event.name}`);
        player.when("phaseUseBegin").filter((evt2) => evt2._extraPhaseReason == event.name).step(async (event2, trigger2, player2) => {
          player2.addTempSkill(`starjixian_limit`, "phaseChange");
        });
      }
    },
    subSkill: {
      limit: {
        charlotte: true,
        mod: {
          cardEnabled(card, player) {
            if (get.type(card) == "equip") {
              return false;
            }
          }
        }
      }
    }
  },
  old_starjixian: {
    audio: 2,
    trigger: {
      player: "phaseBegin"
    },
    forced: true,
    filter(event, player) {
      return event.phaseList?.length > 1;
    },
    async content(event, trigger, player) {
      const evts = game.getAllGlobalHistory("everything", (evt) => {
        if (evt.name != "phase" || evt.player != player) {
          return false;
        }
        return !evt._finished && evt.phaseList?.length;
      }), filter = (phase) => lib.phaseName.includes(phase);
      let lastPhaseList = [];
      if (evts?.length > 1) {
        lastPhaseList = evts.at(-2).phaseList.filter(filter);
      }
      const list = trigger.phaseList.map((name, index) => [index + 1, "", name]).filter((info) => filter(info[2]));
      const result = await player.chooseToMove("机先：调整本回合额定阶段顺序", true).set("list", [
        [
          "额定阶段",
          [
            list,
            (item, type, position, noclick, node) => {
              let showCard = [item[0], item[1], `lusu_${item[2]}`];
              node = ui.create.buttonPresets.vcard(showCard, type, position, noclick);
              node.node.info.innerHTML = `<span style = "color:#ffffff">${item[0]}</span>`;
              node.node.info.style["font-size"] = "20px";
              node._link = node.link = item;
              node._customintro = (uiintro) => {
                uiintro.add(get.translation(node._link[2]));
                uiintro.addText(`此阶段为本回合第${get.cnNumber(node._link[0], true)}个阶段`);
                return uiintro;
              };
              return node;
            }
          ]
        ]
      ]).set("filterOk", (moved) => {
        const { lastPhaseList: preList } = get.event(), list2 = moved[0];
        if (preList.length != list2.length) {
          return true;
        }
        return list2.some((info, index) => preList[index] != info[2]);
      }).set("lastPhaseList", lastPhaseList).set("filterMove", (from, to, moved) => {
        return typeof to != "number";
      }).set("processAI", (list2) => {
        const { lastPhaseList: preList, player: player2, filterOk } = get.event();
        let moved = list2[0][1][0].slice(0), newList = [];
        const addPhase = (name, pre) => {
          const index = moved.findIndex((info) => info[2] == name);
          if (index < 0) {
            return newList;
          }
          const tempList = [newList, moved.splice(index, 1)];
          if (pre === true) {
            tempList.reverse();
          }
          newList = tempList.flat();
          return newList;
        };
        addPhase("phaseUse");
        const bool = player2.countCards("hs", (card) => player2.hasValueTarget(card)) <= 1;
        addPhase("phaseDraw", bool);
        const bool2 = player2.needsToDiscard() <= 0;
        addPhase("phaseDiscard", bool2);
        addPhase("phaseJudge");
        while (moved.length) {
          addPhase(moved.randomGet()[2], Math.random() > 0.5);
        }
        if (!filterOk([newList])) {
          newList = [...newList.slice(0, -2), ...newList.slice(-2).reverse()];
        }
        return [newList];
      }).forResult();
      if (!result?.bool || !result.moved?.length) {
        return;
      }
      result.moved[0].forEach((info, index) => {
        const name = info[2];
        const newIndex = list[index][0] - 1;
        trigger.phaseList[newIndex] = name;
      });
    }
  },
  //阎象
  dcyuzheng: {
    audio: 2,
    enable: "phaseUse",
    filterTarget(card, player, target) {
      if (!player.getStorage("dcyuzheng_used").includes(1)) {
        return target.maxHp > 0;
      }
      return !target.isMinHandcard();
    },
    filter(event, player) {
      return player.getStorage("dcyuzheng_used").length < 2 && game.hasPlayer((current) => get.info("dcyuzheng").filterTarget(null, player, current));
    },
    async content(event, trigger, player) {
      const { target } = event;
      const list = [`将手牌数调整至与全场最少角色相同，本轮下X次使用或打出牌后摸两张牌（X为以此法弃置的牌数）`, `摸等同于体力上限张牌（至多为5），本轮增加等量手牌上限，且本轮至多可以再使用等量张牌`];
      const storage = player.getStorage(`${event.name}_used`);
      let result;
      if (storage.length == 1) {
        result = { index: storage[0] == 0 ? 1 : 0 };
      } else if (target.isMinHandcard()) {
        result = { index: 1 };
      } else {
        result = await target.chooseControl({ choiceList: list, choice: 1 }).forResult();
      }
      if (typeof result?.index == "number") {
        const { index } = result;
        player.addTempSkill(`${event.name}_used`, "phaseChange");
        player.markAuto(`${event.name}_used`, index);
        if (index == 0) {
          const num = game.findPlayer((i) => i.isMinHandcard())?.countCards("h");
          if (num == null) {
            return;
          }
          const numx = num - target.countCards("h");
          if (numx > 0) {
            await target.draw({ num: numx });
          } else if (numx < 0) {
            const count = Math.max(1, -numx);
            if (numx < 0) {
              await target.chooseToDiscard({
                position: "h",
                selectCard: -numx,
                forced: true,
                allowChooseAll: true
              });
            }
            target.addTempSkill(`${event.name}_effect1`, "roundStart");
            target.addMark(`${event.name}_effect1`, count, false);
          }
        } else if (index == 1) {
          const num = Math.min(target.maxHp, 5);
          await target.draw({ num });
          target.addTempSkill(`${event.name}_debuff`, "roundStart");
          target.setMark(`${event.name}_debuff`, num, false);
          target.addTempSkill(`${event.name}_effect2`, "roundStart");
          target.addMark(`${event.name}_effect2`, num, false);
        }
      }
    },
    ai: {
      order: 7,
      result: {
        target(player, target) {
          if (!player.getStorage("dcyuzheng_used").length) {
            return 114514 - target.countCards("h");
          }
          return -target.countCards("h");
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      },
      effect1: {
        charlotte: true,
        onremove: true,
        forced: true,
        trigger: { player: ["useCardAfter", "respondAfter"] },
        filter(event, player) {
          return player.hasMark("dcyuzheng_effect1");
        },
        async content(event, trigger, player) {
          player.removeMark(event.name, 1, false);
          if (!player.hasMark(event.name)) {
            player.removeSkill(event.name);
          }
          await player.draw({ num: 2 });
        },
        intro: {
          content: "下#次使用或打出牌后摸两张牌"
        }
      },
      effect2: {
        charlotte: true,
        onremove: true,
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("dcyuzheng_effect2");
          }
        },
        markimage: "image/card/handcard.png",
        intro: {
          content: "本轮手牌上限+#"
        }
      },
      debuff: {
        charlotte: true,
        onremove: true,
        mod: {
          cardEnabled(card, player) {
            if (!player.hasMark("dcyuzheng_debuff")) {
              return false;
            }
          },
          cardSavable(card, player) {
            if (!player.hasMark("dcyuzheng_debuff")) {
              return false;
            }
          }
        },
        trigger: { player: "useCard1" },
        firstDo: true,
        forced: true,
        popup: false,
        filter(event, player) {
          return player.hasMark("dcyuzheng_debuff");
        },
        async content(event, trigger, player) {
          player.removeMark(event.name, 1, false);
        },
        intro: {
          content: "还能再使用#张牌"
        }
      }
    }
  },
  dcyxsuishi: {
    audio: 2,
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      return event.player.countCards("h") >= event.player.getHp();
    },
    async cost(event, trigger, player) {
      const list = get.inpileVCardList((info) => {
        if (info[3] || info[0] == "delay") {
          return false;
        }
        return get.tag({ name: info[2] }, "damage");
      });
      if (list.length) {
        const result = await player.chooseButton([get.prompt2(event.skill, trigger.player), [list, "vcard"]]).set("goon", get.attitude(player, trigger.player) > 0).set("target", trigger.player).set("ai", (button) => {
          if (!get.event().goon) {
            return 0;
          }
          const { target } = get.event();
          const card = get.autoViewAs({ name: button.link[2] }, "unsure");
          return Math.max(...game.players.map((targetx) => target.canUse(card, target) ? get.effect(targetx, card, target, get.player()) : 0));
        }).forResult();
        if (result?.bool && result.links?.length) {
          event.result = {
            bool: true,
            cost_data: { name: result.links[0][2] }
          };
        }
      }
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const {
        cost_data: card,
        targets: [target]
      } = event;
      game.broadcastAll(function(card2) {
        lib.skill.dcyxsuishi_backup.viewAs = card2;
      }, card);
      const next = target.chooseToUse();
      next.set("openskilldialog", `###${get.translation(event.name)}###是否将一张牌当做【${get.translation(card.name)}】使用？`);
      next.set("norestore", true);
      next.set("addCount", false);
      next.set("_backupevent", `${event.name}_backup`);
      next.set("custom", {
        add: {},
        replace: { window() {
        } }
      });
      next.backup(`${event.name}_backup`);
      await next;
    },
    subSkill: {
      backup: {
        audio: "dcyxsuishi",
        filterCard(card) {
          return get.itemtype(card) == "card";
        },
        position: "hes",
        selectCard: 1,
        check: (card) => 6 - get.value(card),
        popname: true,
        async precontent(event, trigger, player) {
          event.getParent().oncard = function() {
            const { card } = get.event();
            player.when("useCardAfter").filter((evt) => evt.card == card).step(async (event2, trigger2, player2) => {
              const targets = game.filterPlayer((target) => target.hasHistory("damage", (evt) => evt.card == trigger2.card));
              player2.line(targets, "yellow");
              targets.forEach((target) => {
                target.addTempSkill("dcyxsuishi_debuff", { player: "phaseAfter" });
                target.markAuto("dcyxsuishi_debuff", get.color(trigger2.card));
              });
            });
          };
        }
      },
      debuff: {
        charlotte: true,
        onremove: true,
        mod: {
          cardEnabled(card, player) {
            if (player.getStorage("dcyxsuishi_debuff").includes(get.color(card))) {
              return false;
            }
          },
          cardSavable(card, player) {
            if (player.getStorage("dcyxsuishi_debuff").includes(get.color(card))) {
              return false;
            }
          }
        },
        intro: {
          content: "不能使用$的牌直到你回合结束"
        }
      }
    }
  },
  //崔烈
  dczijue: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const { target, name } = event;
      const result = await target.chooseControl("两张", "三张", "四张").set("prompt", "声明一个数字").set("ai", () => {
        return get.event().resultx;
      }).set(
        "resultx",
        (() => {
          if (get.attitude(target, player) > 0 && player.getDamagedHp() < 2) {
            return "四张";
          }
          return "两张";
        })()
      ).forResult();
      target.popup(result.control, "wood");
      const num = result.index + 2;
      game.log(target, "声明的数字为", `#y${num}`);
      const result2 = await player.chooseToGive(target, "he", num, `交给${get.translation(target)}${get.cnNumber(num)}张牌，否则你摸${get.cnNumber(num)}张牌`).set("ai", (card) => {
        const { player: player2 } = get.event();
        if (player2.getDamagedHp() < 2) {
          return 0;
        }
        return 7 - get.value(card);
      }).forResult();
      if (result2?.bool && result2.cards?.length) {
        await player.recover();
        player.addTempSkill(`${name}_effect`, { player: "phaseBegin" });
        player.addMark(`${name}_effect`, num, false);
      } else {
        await player.draw(num);
      }
    },
    subSkill: {
      effect: {
        audio: "dczijue",
        charlotte: true,
        onremove: true,
        forced: true,
        locked: false,
        intro: { content: "其他角色计算与你的距离和你的拼点点数+#且你拼点时摸一张牌" },
        trigger: {
          player: "compare",
          target: "compare"
        },
        filter(event, player, name) {
          if (player != event.target && event.iwhile) {
            return false;
          }
          return player.countMark("dczijue_effect");
        },
        async content(event, trigger, player) {
          const key = player == trigger.player ? "num1" : "num2";
          trigger[key] = Math.min(13, trigger[key] + player.countMark(event.name));
          game.log(player, "的拼点牌点数+", player.countMark(event.name));
          await player.draw();
        },
        mod: {
          globalTo(from, to, num) {
            return num + to.countMark("dczijue_effect");
          }
        }
      }
    },
    ai: {
      order: 8,
      result: {
        target(player, target) {
          return 1;
        },
        player(player, target) {
          if (get.attitude(player, target) > 0 && player.getHp() > 1) {
            return 3 + get.damageEffect(player, target, player) / 3;
          }
          return 1;
        }
      }
    }
  },
  dcchibi: {
    audio: 2,
    trigger: { global: "useCardToPlayer" },
    filter(event, player) {
      if (event.player == player || event.player == event.target) {
        return false;
      }
      return get.distance(event.player, event.target) > 1 && player.canCompare(event.player);
    },
    logTarget: "player",
    check(event, player) {
      if (event.target != player && get.tag(event.card, "damage") && player.hp < 2) {
        return false;
      }
      return get.effect(event.target, event.card, event.player, player) < -2;
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const result = await player.chooseToCompare(target).forResult();
      const evt = trigger.getParent();
      if (result.bool) {
        evt.targets.length = 0;
        evt.all_excluded = true;
        if (evt.cards?.someInD()) {
          await player.gain(evt.cards.filterInD(), "gain2");
        }
      } else {
        player.tempBanSkill(event.name);
        if (!["basic", "trick"].includes(get.type(evt.card))) {
          return;
        }
        if (evt.targets.includes(player)) {
          return;
        }
        if (!lib.filter.targetEnabled2(evt.card, evt.player, player)) {
          return;
        }
        evt.targets.add(player);
      }
    }
  },
  //星蒋琬
  starzhenting: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      return game.countPlayer2((current) => {
        return current.hasHistory("damage");
      }, true) > 1;
    },
    async cost(event, trigger, player) {
      const damage = game.filterPlayer((current) => current.hasHistory("damage"));
      const sourceDamage = game.filterPlayer((current) => current.hasHistory("sourceDamage"));
      const target = game.players.maxBy((current) => {
        let eff = get.effect(current, { name: "draw" }, player, player), eff1 = 0, eff2 = 0;
        if (damage.includes(current)) {
          eff1 = eff + get.recoverEffect(current, player, player);
        }
        if (sourceDamage.includes(current)) {
          eff2 = 3 * eff;
        }
        return Math.max(eff1, eff2);
      });
      const result = await player.chooseButtonTarget({
        createDialog: [
          get.prompt(event.skill),
          [
            [
              ["damage", "令一名受到过伤害的角色回复1点体力并摸一张牌"],
              ["sourceDamage", "令一名造成过伤害的角色获得本回合进入弃牌堆的两张牌"]
            ],
            "textbutton"
          ]
        ],
        filterButton(button) {
          return get.event()[button.link]?.length;
        },
        filterTarget(card, player2, target2) {
          const type = ui.selected.buttons?.[0]?.link;
          if (!type) {
            return false;
          }
          return get.event()[type]?.includes(target2);
        },
        ai1(button) {
          const { targetx } = get.event();
          if (!targetx) {
            return 0;
          }
          if (get.event()[button.link]?.includes(targetx)) {
            return 1;
          }
          return 0;
        },
        ai2(target2) {
          const { targetx } = get.event();
          if (target2 == targetx) {
            return 1;
          }
          return 0;
        }
      }).set("complexTarget", true).set("damage", damage).set("sourceDamage", sourceDamage).set("targetx", target).forResult();
      event.result = {
        bool: result?.bool,
        targets: result?.targets,
        cost_data: result?.links?.[0]
      };
    },
    async content(event, trigger, player) {
      const {
        targets: [target],
        cost_data: type
      } = event;
      if (type == "damage") {
        await target.recover();
        await target.draw();
      } else {
        const cards2 = get.discarded().filterInD("d");
        if (!cards2.length) {
          return;
        }
        const result = await player.chooseButton([`镇庭：选择令${get.translation(target)}获得的牌`, cards2], true, Math.min(cards2.length, 2)).set("ai", (button) => {
          const { player: player2, target: target2 } = get.event();
          return get.sgnAttitude(player2, target2) * get.value(button.link, target2);
        }).set("target", target).forResult();
        if (result?.bool && result?.links?.length) {
          await target.gain(result.links, "gain2");
        }
      }
    }
  },
  starchiguo: {
    audio: 2,
    trigger: {
      player: "phaseUseBegin"
    },
    async content(event, trigger, player) {
      const cards2 = get.bottomCards(3, true);
      await player.chooseControl("ok").set("dialog", ["持国：牌堆底三张牌", cards2]);
      player.addTempSkill("starchiguo_effect", "phaseChange");
    },
    subSkill: {
      effect: {
        audio: "starchiguo",
        trigger: {
          player: "useCard1"
        },
        charlotte: true,
        async cost(event) {
          event.result = {
            bool: true
          };
        },
        async content(event, trigger, player) {
          const card = get.bottomCards()[0];
          await game.cardsGotoOrdering([card]);
          await player.showCards(card, `${get.translation(player)}发动了【持国】`, true);
          if (get.suit(card) == get.suit(trigger.card)) {
            const info = get.info(trigger.card);
            if (!["trick", "basic"].includes(info.type) || info.multitarget) {
              return;
            }
            if (trigger.targets?.length) {
              const targets = game.filterPlayer((current) => {
                if (trigger.targets?.includes(current)) {
                  return trigger.targets.length > 1;
                }
                return lib.filter.targetEnabled2(trigger.card, player, current);
              });
              if (targets.length) {
                const result = targets.length > 1 ? await player.chooseTarget(
                  `为${get.translation(trigger.card)}增加或减少一个目标`,
                  (card2, player2, target) => {
                    return get.event().targetx.includes(target);
                  },
                  true
                ).set("ai", (target) => {
                  const player2 = get.player(), trigger2 = get.event().getTrigger(), eff = get.effect(target, trigger2.card, trigger2.player, player2);
                  if (trigger2.targets?.includes(target)) {
                    return -eff;
                  }
                  return eff;
                }).set("targetx", targets).forResult() : {
                  bool: true,
                  targets
                };
                if (result.bool) {
                  player.line(result.targets);
                  if (trigger.targets.containsSome(...result.targets)) {
                    trigger.targets.removeArray(result.targets);
                  } else {
                    trigger.targets.addArray(result.targets);
                  }
                }
              }
            }
            await game.cardsDiscard(card);
          } else {
            if (trigger.targets?.length) {
              const result = trigger.targets.length > 1 ? await player.chooseTarget(
                `持国：将${get.translation(card)}交给一名目标角色`,
                (card2, player2, target) => {
                  const trigger2 = get.event().getTrigger();
                  return trigger2.targets?.includes(target);
                },
                true
              ).set("ai", (target) => {
                const { player: player2, cardx } = get.event();
                return target.getUseValue(cardx) * get.attitude(player2, target);
              }).set("cardx", card).forResult() : {
                bool: true,
                targets: trigger.targets
              };
              if (result.bool) {
                const target = result.targets[0];
                player.line(target);
                await target.gain(card, "gain2");
              }
            }
          }
        }
      }
    }
  },
  //星太史慈
  starchongwei: {
    audio: 2,
    trigger: {
      source: "damageSource"
    },
    mark: true,
    marktext: "围",
    intro: {
      markcount(storage) {
        let num = 3;
        if (typeof storage == "number") {
          num -= storage;
        }
        return Math.max(0, num);
      },
      content(storage, player) {
        let num = 3;
        if (typeof storage == "number") {
          num -= storage;
        }
        num = Math.max(0, num);
        return `计算与其他角色的距离+${num}`;
      }
    },
    async content(event, trigger, player) {
      player.addMark(event.name, 1, false);
      if (player.countMark(event.name) >= 3) {
        await player.recover();
        if (player.getHp() > 0) {
          await player.draw(player.getHp());
        }
        player.setStorage("starchongzu", true);
        await player.removeSkills(event.name);
      }
    },
    onremove: true,
    forced: true,
    mod: {
      globalFrom(from, to, current) {
        const num = Math.max(0, 3 - from.countMark("starchongwei"));
        return current + num;
      }
    }
  },
  starchongzu: {
    audio: 2,
    trigger: {
      player: "useCardAfter"
    },
    filter(event, player) {
      return event.targets?.some((target) => target == player);
    },
    async cost(event, trigger, player) {
      let list = [
        ["limit", "你使用下一张牌无距离次数限制"],
        ["draw", "摸两张牌且此项本回合失效"],
        ["damage", "你下次使用牌指定目标后，可对其中一个其他角色造成1点伤害"]
      ];
      if (!player.getStorage(event.skill, false)) {
        list.splice(2);
      }
      const result = await player.chooseButton([get.prompt(event.skill), [list, "textbutton"]]).set("filterButton", (button) => {
        const { link } = button, player2 = get.player();
        return link != "draw" || !player2.hasSkill("starchongzu_used");
      }).set("ai", (button) => {
        const { link } = button;
        return [null, "limit", "damage", "draw"].indexOf(link);
      }).forResult();
      if (result.bool) {
        event.result = {
          bool: true,
          cost_data: result.links
        };
      }
    },
    async content(event, trigger, player) {
      const link = event.cost_data[0];
      switch (link) {
        case "draw": {
          player.addTempSkill(`${event.name}_used`);
          await player.draw(2);
          break;
        }
        case "limit": {
          player.when({
            player: "useCard1"
          }).step(async (event2, trigger2, player2) => {
            if (trigger2.addCount !== false) {
              trigger2.addCount = false;
              const stat = player2.getStat().card, name = trigger2.card.name;
              if (typeof stat[name] === "number") {
                stat[name]--;
              }
            }
          }).assign({
            mod: {
              cardUsable: () => Infinity,
              targetInRange: () => true
            },
            ai: {
              presha: true
            }
          });
          break;
        }
        default: {
          player.when({
            player: "useCardToPlayered"
          }).filter((evt, player2) => evt.targets?.some((target) => target != player2)).step(async (event2, trigger2, player2) => {
            const targets = trigger2.targets.filter((target) => target != player2);
            const result = await player2.chooseTarget("冲阻：是否对目标角色中的一名其他角色造成1点伤害？", (card, player3, target) => {
              return get.event().targetsx.includes(target);
            }).set("targetsx", targets).set("ai", (target) => {
              const player3 = get.player();
              return get.damageEffect(target, player3, player3);
            }).forResult();
            if (result.bool) {
              const target = result.targets[0];
              player2.line(target);
              await target.damage(player2);
            }
          });
          break;
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true
      }
    },
    derivation: "starchongzu_rewrite"
  },
  //星张让
  starduhai: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    filter(event, player) {
      return event.player != player && event.player.isIn() && event.player.getStorage("starduhai_debuff").length < 4;
    },
    logTarget: "player",
    async cost(event, trigger, player) {
      const suits = lib.suit.slice().filter((suit) => !trigger.player.getStorage("starduhai_debuff").includes(suit));
      if (!suits.length) {
        return;
      }
      const result = await player.chooseControl(suits, "cancel2").set("prompt", get.prompt2(event.skill, trigger.player)).set("ai", () => {
        const player2 = get.player(), target = get.event().targetx;
        if (get.attitude(player2, target) > 0) {
          return "cancel2";
        }
        return get.event().choices.randomGet();
      }).set("targetx", trigger.player).set("choices", suits).forResult();
      if (result?.control != "cancel2") {
        event.result = {
          bool: true,
          cost_data: result.control
        };
      }
    },
    async content(event, trigger, player) {
      const suit = event.cost_data, skill = event.name + "_debuff", target = trigger.player;
      player.addTempSkill(skill, { player: "dieAfter" });
      target.markAuto(skill, [suit]);
      game.log(target, "获得了一个", `#g【蠹】(${get.translation(suit)})`);
    },
    subSkill: {
      debuff: {
        onremove(player, skill) {
          if (!game.hasPlayer((target) => target != player && target.hasSkill("starduhai"))) {
            game.players.forEach((target) => {
              target.unmarkAuto(skill, target.getStorage(skill));
              delete target.storage[skill];
            });
          }
        },
        charlotte: true,
        forced: true,
        intro: {
          content: (storage) => `已获得标记：<span class=thundertext>${storage.reduce((str, suit) => str + get.translation(suit), "")}</span>`
        },
        trigger: { global: "phaseEnd" },
        filter(event, player) {
          return event.player.hasCard((card) => event.player.getStorage("starduhai_debuff").includes(get.suit(card, event.player)), "h");
        },
        logTarget: "player",
        async content(event, trigger, player) {
          const skill = event.name, target = trigger.player, suits = target.getStorage(skill).filter((suit) => target.hasCard((card) => get.suit(card, target) == suit, "h"));
          await target.loseHp(suits.length);
          if (!target?.isIn()) {
            return;
          }
          target.unmarkAuto(skill, suits);
          game.log(target, "移去了", get.cnNumber(suits.length), "个", `#g【蠹】(${suits.reduce((str, suit) => str + get.translation(suit), "")})`);
        }
      }
    }
  },
  starlingse: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("he") && game.hasPlayer((target) => target != player);
    },
    filterCard: true,
    filterTarget: lib.filter.notMe,
    lose: false,
    discard: false,
    delay: false,
    check(card) {
      return 6 - get.value(card);
    },
    async content(event, trigger, player) {
      const card = event.cards[0], type = get.type2(card, false), target = event.targets[0];
      await player.give(card, target);
      const cards2 = target.getCards("he", (cardx) => get.type2(cardx) == type), sha = get.autoViewAs({ name: "sha", isCard: true });
      let gain = [];
      if (cards2.length > 0 && cards2.length <= 2) {
        gain = cards2.slice();
      } else if (cards2.length > 2) {
        gain = cards2.randomGets(2);
      }
      await player.gain(gain, target, "giveAuto", "bySelf");
      if (cards2.length < 2 && target.canUse(sha, player, false, false)) {
        await target.useCard(sha, player, false);
        if (player.hasHistory("damage", (evt) => evt.getParent(3) == event)) {
          delete player.getStat("skill")[event.name];
          game.log(player, "重置了", "#g【令色】");
        }
      }
    },
    ai: {
      order: 5,
      result: {
        target: -1
      }
    }
  },
  //颜良
  starjizhan: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      if (!event.getParent()?.targets?.length || !event.isFirstTarget) {
        return false;
      }
      return player.getHistory("useCard", (evt) => get.is.damageCard(evt.card)).indexOf(event.getParent()) == 0;
    },
    async cost(event, trigger, player) {
      const num = 2 - player.getHistory("useCard", (evt) => !get.is.damageCard(evt.card), trigger.getParent()).length;
      let str = num > 0 ? `令此牌对其中一个目标造成的伤害+${num}` : "选择一个目标";
      event.result = await player.chooseTarget(get.prompt(event.skill), `${str}，若此牌结算后未造成伤害，其对你造成1点伤害`).set("filterTarget", (card, player2, target) => {
        const trigger2 = get.event().getTrigger();
        return trigger2.targets?.includes(target);
      }).set("ai", (target) => {
        const { player: player2, num: num2 } = get.event();
        let eff = 0;
        if (num2 <= 0 || player2.hp <= 1) {
          eff += get.damageEffect(player2, target, player2);
        }
        if (num2 > 0) {
          eff += get.damageEffect(target, player2, player2);
        }
        return eff;
      }).set("numx", num).forResult();
      event.result.cost_data = Math.max(0, num);
    },
    async content(event, trigger, player) {
      const map = trigger.getParent().customArgs, {
        targets: [target],
        cost_data: num
      } = event, id = target.playerid;
      map[id] ??= {};
      if (typeof map[id].extraDamage !== "number") {
        map[id].extraDamage = 0;
      }
      map[id].extraDamage += num;
      player.when("useCardAfter").filter((evt) => evt == trigger.getParent()).step(async (event2, trigger2, player2) => {
        if (game.hasPlayer((current) => {
          return current.hasHistory("damage", (evt) => evt.card == trigger2.card);
        })) {
          return;
        }
        if (target.isIn() && player2?.isIn()) {
          target.line(player2);
          await player2.damage(target);
        }
      });
    },
    locked: false,
    mod: {
      aiOrder(player, card, num) {
        if (get.is.damageCard(card) && !player.hasHistory("useCard", (evt) => get.is.damageCard(evt.card))) {
          return num + 15;
        }
      }
    }
  },
  starcuxia: {
    audio: 2,
    trigger: { global: "useCard" },
    filter(event, player) {
      if (event.player === player || !event.targets?.includes(player)) {
        return false;
      }
      return event.player.getHp() > player.getHp() || event.player.getRoundHistory("sourceDamage", (evt) => {
        return player == evt.player;
      }).length > 0;
    },
    forced: true,
    logTarget: "player",
    async content(event, trigger, player) {
      await trigger.player.randomDiscard("h");
      if (trigger.player.getHp() > player.getHp() && trigger.player.getRoundHistory("sourceDamage", (evt) => {
        return player == evt.player;
      }).length > 0) {
        await player.draw();
      }
    }
  },
  //文丑
  starlianzhan: {
    audio: 2,
    trigger: { player: "useCardToPlayer" },
    filter(event, player) {
      if (event.targets.length !== 1) {
        return false;
      }
      return get.is.damageCard(event.card);
    },
    filterx(event, player) {
      const info = get.info(event.card);
      if (info.allowMultiple == false) {
        return false;
      }
      if (event.targets && !info.multitarget) {
        return game.hasPlayer((current) => {
          return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
        });
      }
      return false;
    },
    async cost(event, trigger, player) {
      const result = await player.chooseButton([
        get.prompt2(event.skill),
        [
          [
            ["extraTarget", `使${get.translation(trigger.card)}增加一个目标`],
            ["extraEffect", `令${get.translation(trigger.card)}额外结算一次`]
          ],
          "textbutton"
        ]
      ]).set("filterButton", (button) => {
        const { player: player2, evt: event2 } = get.event();
        if (button.link == "extraTarget") {
          return lib.skill.starlianzhan.filterx(event2, player2);
        }
        return true;
      }).set("ai", (button) => {
        const { player: player2, evt: event2 } = get.event();
        if (button.link == "extraTarget") {
          const targets = game.filterPlayer((current) => {
            return !event2.targets.includes(current) && lib.filter.targetEnabled2(event2.card, player2, current) && lib.filter.targetInRange(event2.card, player2, current);
          });
          return Math.max(...targets.map((target) => get.effect(target, event2.card, player2, player2)));
        }
        return event2.targets.reduce((sum, target) => sum + get.effect(target, event2.card, player2, player2), 0);
      }).set("evt", trigger.getParent()).forResult();
      event.result = {
        bool: result.bool,
        cost_data: result.links
      };
    },
    async content(event, trigger, player) {
      const { cost_data } = event;
      player.addTempSkill("starlianzhan_check");
      trigger.getParent().set("starlianzhan_check", true);
      if (cost_data[0] == "extraTarget") {
        const result = await player.chooseTarget(
          "请选择" + get.translation(trigger.card) + "的额外目标",
          (card, player2, target) => {
            const event2 = get.event().getTrigger();
            if (event2.targets.includes(target)) {
              return false;
            }
            return lib.filter.targetEnabled2(event2.card, player2, target) && lib.filter.targetInRange(event2.card, player2, target);
          },
          true
        ).set("ai", (target) => {
          const player2 = get.player(), event2 = get.event().getTrigger();
          return get.effect(target, event2.card, player2, player2);
        }).forResult();
        if (result?.bool && result.targets?.length) {
          player.line(result.targets);
          trigger.targets.addArray(result.targets);
          game.log(result.targets, "成为了", trigger.card, "的额外目标");
        }
      } else {
        trigger.getParent().effectCount++;
        game.log(trigger.card, "额外结算一次");
      }
    },
    subSkill: {
      check: {
        charlotte: true,
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          if (!event.starlianzhan_check) {
            return false;
          }
          const history = player.getHistory("sourceDamage", (evt) => {
            return event.targets.includes(evt.player) && evt.card == event.card;
          });
          if (history.length == 2) {
            return true;
          }
          if (history.length !== 0) {
            return false;
          }
          const card = new lib.element.VCard({ name: event.card.name, isCard: true });
          return event.targets?.some((target) => {
            if (!target?.isIn()) {
              return false;
            }
            return target.canUse(card, player, false);
          });
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const history = player.getHistory("sourceDamage", (evt) => {
            return trigger.targets.includes(evt.player) && evt.card == trigger.card;
          });
          if (history.length == 0) {
            const card = new lib.element.VCard({ name: trigger.card.name, isCard: true });
            for (const target of trigger.targets || []) {
              if (!target?.isIn()) {
                continue;
              }
              if (target.canUse(card, player, false)) {
                await target.useCard(card, player, false);
              }
            }
          } else if (history.length == 2) {
            const prompt = player.isDamaged() ? "回复1点体力" : "摸两张牌";
            await player.chooseBool(`连战：是否${prompt}？`).forResult();
            const next = player.isDamaged() ? player.recover() : player.draw(2);
            await next;
          }
        }
      }
    }
  },
  starweiming: {
    audio: 2,
    trigger: { global: "useCard" },
    filter(event, player) {
      if (event.player === player || !event.targets?.includes(player)) {
        return false;
      }
      return event.player.getHp() < player.getHp() || player.getRoundHistory("sourceDamage", (evt) => {
        return event.player == evt.player;
      }).length > 0;
    },
    forced: true,
    logTarget: "player",
    async content(event, trigger, player) {
      await trigger.player.randomDiscard("h");
      if (trigger.player.getHp() < player.getHp() && player.getRoundHistory("sourceDamage", (evt) => {
        return trigger.player == evt.player;
      }).length > 0) {
        await player.draw();
      }
    }
  },
  //丁奉
  stardangchen: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return player2 != target && target.countCards("he");
      }).set("ai", (target) => {
        const player2 = get.player();
        return -get.attitude(player2, target);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      let result = await target.chooseToGive(player, "he", true, [1, Infinity], "allowChooseAll").set("ai", (card) => {
        const { player: player2, target: target2 } = get.event();
        const att = get.attitude(player2, target2);
        if (att <= 0) {
          if (ui.selected.cards.length > 1) {
            return 0;
          }
          return 6 - get.value(card);
        }
        if (ui.selected.cards.length) {
          return 0;
        }
        return 7 - get.value(card);
      }).forResult();
      if (result?.bool && result.cards?.length) {
        const num = result.cards.length;
        const next = player.chooseToDiscard("he", num);
        next.set("prompt", "荡尘：是否弃置" + get.cnNumber(num) + "张牌并获得后续效果？");
        next.set("prompt2", `当你于本回合使用【杀】或普通锦囊牌指定${get.translation(target)}为目标后，可以进行一次判定，若判定的点数为` + num + "的倍数，则此牌额外结算一次");
        next.set("ai", (card) => {
          const { isDiscard } = get.event();
          if (isDiscard) {
            if (get.tag("draw", card)) {
              return -5;
            } else if (player.getUseValue(card, true, true) > 0) {
              return get.type(card) == "basic" ? 1 : 0.5;
            }
            return 8 - get.value(card);
          }
          return 0;
        });
        next.set(
          "isDiscard",
          (function() {
            const hs = player.getDiscardableCards(player, "h");
            const basic = hs.filter((card) => get.type(card) == "basic" && player.getUseValue(card, true, true) > 0);
            if (!basic.length) {
              return false;
            }
            return hs.length - basic.length >= num - 1;
          })()
        );
        result = await next.forResult();
        if (!result?.bool || !result.cards?.length) {
          return;
        }
        player.addTempSkill("stardangchen_buff", { player: "phaseUseEnd" });
        player.setStorage("stardangchen_buff", [num, target], true);
      }
    },
    subSkill: {
      buff: {
        charlotte: true,
        onremove: true,
        audio: "stardangchen",
        trigger: { player: "useCardToPlayered" },
        filter(event, player) {
          const [num, target] = player.getStorage("stardangchen_buff");
          if (event.card.name != "sha" && get.type(event.card) != "trick") {
            return false;
          }
          if (typeof num != "number" || !target?.isIn() || event.target != target) {
            return false;
          }
          return true;
        },
        check(event, player) {
          return get.effect(event.target, event.card, player, player) > 0;
        },
        prompt2(event, player) {
          const [num, target] = player.getStorage("stardangchen_buff");
          return "进行一次判定，若判定结果为" + num + "的倍数，则" + get.translation(event.card) + "额外结算一次";
        },
        async content(event, trigger, player) {
          const [num, target] = player.getStorage("stardangchen_buff");
          const result = await player.judge((card) => {
            const number2 = get.number(card);
            return 10 * (0.5 - (number2 % get.event().num !== 0));
          }).set("judge2", (result2) => Boolean(result2.bool)).set("num", num).forResult();
          const { number } = result;
          if (number % num === 0) {
            trigger.getParent().effectCount++;
            game.log(trigger.card, "额外结算一次");
          }
        },
        intro: {
          content([num, target], player) {
            return `使用【杀】或普通锦囊牌指定${get.translation(target)}可以进行一次判定，若判定的点数为${num}的倍数，则此牌额外结算一次`;
          }
        }
      }
    }
  },
  starjianyu: {
    audio: 2,
    trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
    getIndex(event, player) {
      if (_status.currentPhase !== player) {
        return false;
      }
      return game.filterPlayer2((target) => target !== player && event.getl?.(target)?.es?.length);
    },
    filterTarget: (event, player, name, target) => target,
    logTarget: (event, player, name, target) => target,
    forced: true,
    async content(event, trigger, player) {
      await player.draw();
    }
  },
  //法正
  starzhiji: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    async cost(event, trigger, player) {
      const next = player.chooseToDiscard(get.prompt2(event.skill), [0, Infinity], "allowChooseAll").set("logSkill", "starzhiji");
      if (_status.auto || !(player === game.me || player.isOnline())) {
        next.complexCard = true;
        next.ai = function(card) {
          const player2 = get.player();
          switch (get.sgn(player2.countCards("h") - 5)) {
            case 1: {
              const num = game.countPlayer((target) => target !== player2 && get.damageEffect(target, player2, player2) > 0);
              if (ui.selected.cards.length < num) {
                return 8 - get.value(card);
              }
              return 0;
            }
            default:
              return lib.skill.zhiheng.check(card) + (5 - player2.countCards("h")) * get.effect(player2, { name: "draw" }, player2, player2);
          }
        };
      }
      event.result = await next.forResult();
    },
    popup: false,
    async content(event, trigger, player) {
      const discardedCards = event.cards || [];
      const num = discardedCards.length - ((await player.drawTo(5).forResult()).cards || []).length;
      switch (get.sgn(num)) {
        case 1: {
          const result = await player.chooseTarget("是否对至多" + num + "名其他角色各造成1点伤害？", lib.filter.notMe, [1, num]).set("ai", (target) => {
            const player2 = get.player();
            return get.damageEffect(target, player2, player2);
          }).forResult();
          if (result.bool) {
            const targets = result.targets.sortBySeat();
            player.line(targets);
            for (const i of targets) {
              await i.damage();
            }
          }
          break;
        }
        case 0:
          player.addTempSkill("starzhiji_fuqi");
          break;
        case -1:
          player.addTempSkill("starzhiji_hand");
          player.addMark("starzhiji_hand", 2, false);
          break;
      }
    },
    subSkill: {
      fuqi: {
        charlotte: true,
        audio: "starzhiji",
        trigger: { player: "useCard" },
        forced: true,
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.players);
          game.log(trigger.cards, "不可被响应");
        },
        ai: { directHit_ai: true },
        mark: true,
        intro: { content: "使用牌不可被响应" }
      },
      hand: {
        charlotte: true,
        onremove: true,
        mod: { maxHandcard: (player, num) => num + player.countMark("starzhiji_hand") },
        intro: { content: "手牌上限+#" }
      }
    }
  },
  staranji: {
    getUsed(player) {
      let history = game.getRoundHistory("useCard"), suits = lib.suit.slice();
      const map = history.reduce((map2, evt) => {
        const suit = get.suit(evt.card);
        if (!map2[suit]) {
          map2[suit] = 1;
          suits.add(suit);
        } else {
          map2[suit]++;
        }
        return map2;
      }, {});
      return [map, suits];
    },
    audio: 2,
    trigger: { global: "useCard" },
    filter(event, player) {
      const [map, suits] = get.info("staranji").getUsed(player), min = Math.min(...suits.slice().map((suit) => map[suit] || 0));
      return map[get.suit(event.card)] === min;
    },
    forced: true,
    logTarget: "player",
    async content(event, trigger, player) {
      await player.draw();
    },
    init(player, skill) {
      const [map] = get.info(skill).getUsed(player);
      if (Object.keys(map).length) {
        player.storage[skill] = map;
        player.markSkill(skill);
      }
    },
    onremove: true,
    intro: {
      content(storage = {}, player) {
        if (!storage) {
          return "当前暂无记录";
        }
        let str = "本轮游戏所有角色使用牌的花色情况：<br>";
        const list = lib.suit.slice();
        const entries = Object.entries(storage).sort((a, b) => list.indexOf(a[0]) - list.indexOf(b[0]));
        for (const entry of entries) {
          str += "<li>" + get.translation(entry[0]) + "：" + entry[1];
        }
        return str;
      }
    },
    ai: { threaten: 2 },
    group: "staranji_count",
    subSkill: {
      count: {
        charlotte: true,
        trigger: { global: ["useCard1", "roundStart"] },
        filter(event, player, name) {
          return name == "useCard1" || Object.keys(player.storage.staranji || {}).length;
        },
        firstDo: true,
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          if (event.triggername == "roundStart") {
            delete player.storage.staranji;
            player.unmarkSkill("staranji");
          } else {
            const key = get.suit(trigger.card);
            player.storage.staranji ??= {};
            player.storage.staranji[key] ??= 0;
            player.storage.staranji[key]++;
            player.markSkill("staranji");
          }
        }
      }
    }
  },
  //荀彧
  staranshu: {
    audio: 2,
    trigger: { global: "roundEnd" },
    filter(event, player) {
      return get.discardPile((card) => get.type(card) == "basic");
    },
    prompt2: "将弃牌堆中不同牌名的基本牌各一张置于牌堆顶，然后视为使用一张【五谷丰登】（从你或一名已受伤角色开始结算）",
    async content(event, trigger, player) {
      game.players.forEach((current) => current.addTempSkill("staranshu_remove", "roundEnd"));
      const cardx = Array.from(ui.discardPile.childNodes).filter((card) => get.type(card) == "basic").randomSort();
      const cards2 = [];
      for (const card of cardx) {
        if (!cards2.some((c) => c.name == card.name)) {
          cards2.push(card);
        }
      }
      if (!cards2.length) return;
      await game.cardsGotoPile(cards2, "insert");
      const targets = game.filterPlayer((current) => current == player || current.isDamaged());
      let target = player;
      if (targets.length > 1) {
        const result = await player.chooseTarget("请选择【五谷丰登】的起点", true, function(card, player2, target2) {
          return get.event().targets.includes(target2);
        }).set("targets", targets).set("ai", (target2) => {
          return get.attitude(get.player(), target2);
        }).forResult();
        if (result?.bool && result.targets?.length) {
          target = result.targets[0];
        }
      }
      player.when({ global: "useCardToTargeted" }).filter((evt) => evt.card?.anshu && evt?.targets?.length == evt.getParent()?.triggeredTargets4?.length).step(async (event2, trigger2, player2) => {
        delete trigger2.card.anshu;
        trigger2.getParent().targets = trigger2.getParent().targets.sortBySeat(target);
        trigger2.getParent().triggeredTargets4 = trigger2.getParent().triggeredTargets4.sortBySeat(target);
      });
      await player.chooseUseTarget({ name: "wugu", isCard: true, anshu: true }, true);
    },
    group: "staranshu_draw",
    subSkill: {
      draw: {
        audio: "staranshu",
        trigger: { global: "phaseEnd" },
        getIndex(event, player) {
          return game.filterPlayer((current) => {
            return current.hasHistory("lose", (evt) => {
              for (var i in evt.gaintag_map) {
                if (evt.gaintag_map[i].includes("staranshu")) {
                  return true;
                }
              }
              return false;
            });
          }).sortBySeat();
        },
        filter(event, player, name, target) {
          return target.countCards("h") < target.maxHp;
        },
        logTarget(event, player, name, target) {
          return target;
        },
        check(event, player, name, target) {
          return get.attitude(player, target) > 0;
        },
        prompt2: "令其将手牌摸至体力上限（至多摸五张）",
        async content(event, trigger, player) {
          const target = event.targets[0];
          const num = Math.min(5, target.maxHp - target.countCards("h"));
          if (num > 0) {
            await target.draw(num);
          }
        }
      },
      remove: {
        charlotte: true,
        onremove(player) {
          player.removeGaintag("staranshu");
        },
        trigger: { player: "gainAfter" },
        filter(event, player) {
          return event.getParent("staranshu", true) && event.getParent("wugu", true);
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          player.addGaintag(trigger.cards, "staranshu");
        }
      }
    }
  },
  starkuangzuo: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "water",
    filterTarget: true,
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const target = event.target;
      const list = ["starchengfeng"];
      if (target.isZhu2() && !target.getSkills(null, false, false).filter((skill) => {
        var info = get.info(skill);
        if (!info || info.charlotte || !info.zhuSkill || get.skillInfoTranslation(skill, player).length == 0) {
          return false;
        }
        return true;
      }).length) {
        list.push("startongyin");
      }
      await target.addSkills(list);
      const targets = game.filterPlayer((current) => current != target && current.countCards("he"));
      let targetx;
      if (!targets.length) {
        return;
      } else if (targets.length == 1) {
        targetx = targets[0];
      } else {
        const result2 = await player.chooseTarget(`令另一名角色将牌置于${get.translation(target)}武将牌上`, true, function(card, player2, target2) {
          return target2 != get.event().gainer && target2.countCards("he");
        }).set("gainer", target).set("ai", (target2) => {
          return -get.attitude(get.player(), target2) * target2.countCards("he");
        }).forResult();
        if (result2?.targets?.length) {
          targetx = result2.targets[0];
        } else {
          return;
        }
      }
      let suits = [];
      for (let card of targetx.getCards("he")) {
        suits.add(get.suit(card));
      }
      const result = await targetx.chooseCard("he", true, suits.length).set("complexCard", true).set("filterCard", (card) => {
        return ui.selected.cards.every((cardx) => get.suit(cardx) != get.suit(card));
      }).forResult();
      if (result?.cards?.length) {
        const next = target.addToExpansion(result.cards, targetx, "give");
        next.gaintag.add("starchengfeng");
        await next;
      }
    },
    ai: {
      order: 10,
      result: {
        target: 1
      }
    },
    derivation: ["starchengfeng", "startongyin"]
  },
  starchengfeng: {
    marktext: "匡",
    intro: {
      name: "匡祚",
      markcount: "expansion",
      content: "expansion"
    },
    audio: 2,
    usable: 1,
    enable: "chooseToUse",
    filter(event, player) {
      for (const name of ["shan", "wuxie"]) {
        if (name == "wuxie") {
          let info = event.info_map;
          if (info && player != info.target) {
            continue;
          }
        } else if (!event.respondTo) {
          continue;
        }
        const color = name == "shan" ? "red" : "black";
        if (!event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
          continue;
        }
        if (player.getExpansions("starchengfeng").some((card) => get.color(card) == color)) {
          return true;
        }
      }
      return false;
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("承奉", player.getExpansions("starchengfeng"), "hidden");
      },
      filter(button, player) {
        const card = button.link;
        if (!game.checkMod(card, player, "unchanged", "cardEnabled2", player)) {
          return false;
        }
        const evt = _status.event.getParent();
        const name = get.color(card) == "red" ? "shan" : "wuxie";
        return evt.filterCard(get.autoViewAs({ name }, [card]), player, evt);
      },
      check(button) {
        if (_status.event.getParent().type != "phase") {
          return 1;
        }
        var player = _status.event.player;
        return player.getUseValue({
          name: button.link[2],
          nature: button.link[3]
        });
      },
      backup(links, player) {
        return {
          audio: "starchengfeng",
          selectCard: -1,
          position: "x",
          filterCard: (card) => card == lib.skill.starchengfeng_backup.card,
          viewAs(cards2, player2) {
            const name = get.color(cards2[0]) == "red" ? "shan" : "wuxie";
            return { name };
          },
          card: links[0]
        };
      },
      prompt(links, player) {
        return "将一张基本牌当做" + get.translation(links[0][2]) + "使用";
      }
    },
    hiddenCard(player, name) {
      const color = name == "shan" ? "red" : "black";
      if (player.getExpansions("starchengfeng").some((card) => get.color(card) == color)) {
        return true;
      }
    },
    ai: {
      respondShan: true,
      skillTagFilter(player, tag) {
        if (player.getExpansions("starchengfeng").some((card) => get.color(card) == "red")) {
          return true;
        }
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
    group: "starchengfeng_use",
    subSkill: {
      backup: {},
      use: {
        audio: "starchengfeng",
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          let colors = [];
          for (let card of player.getExpansions("starchengfeng")) {
            colors.add(get.color(card));
          }
          return event.skill == "starchengfeng_backup" && colors.length < 2;
        },
        prompt2: "将牌堆顶一张牌置入“匡祚”",
        async content(event, trigger, player) {
          player.addToExpansion(get.cards(1), "gain2").gaintag.add("starchengfeng");
        }
      }
    }
  },
  startongyin: {
    trigger: {
      player: "damageEnd"
    },
    filter(event, player) {
      if (!event.source || !event.card) {
        return false;
      }
      if (event.source == player) {
        return false;
      }
      if (event.source.group == player.group) {
        return event.cards?.length;
      }
      return event.source.countCards("he");
    },
    zhuSkill: true,
    logTarget: "source",
    async content(event, trigger, player) {
      let next;
      if (trigger.source.group == player.group) {
        next = player.addToExpansion(trigger.cards, "gain2");
      } else {
        const result = await player.choosePlayerCard(trigger.source, "he", true).forResult();
        next = player.addToExpansion(result.cards, trigger.source, "give");
      }
      next.gaintag.add("starchengfeng");
      await next;
    }
  },
  //马铁
  dczhuiwang: {
    mod: {
      globalFrom(from, to) {
        if (from.hp >= to.hp) {
          return -Infinity;
        }
      }
    }
  },
  dcquxian: {
    audio: 2,
    trigger: { player: ["phaseBegin", "phaseEnd"] },
    async content(event, trigger, player) {
      const card = get.cardPile2("sha");
      if (card) {
        await player.gain(card, "gain2");
      }
      const next = player.chooseTarget(true, "驱险：选择一名其他角色，攻击范围内包含其的角色可以对其使用【杀】", lib.filter.notMe).set("ai", (target) => {
        const player2 = get.player();
        return -get.attitude(player2, target);
      });
      next.set(
        "targetprompt2",
        next.targetprompt2.concat([
          (target) => {
            if (!target.isIn() || !target.classList.contains("selectable")) {
              return;
            }
            return `驱险${game.countPlayer((current) => target.inRangeOf(current))}`;
          }
        ])
      );
      const result = await next.forResult();
      if (result?.targets?.length) {
        const target = result.targets[0];
        player.line(target);
        const targets = game.filterPlayer((current) => current.inRange(target)).sortBySeat();
        if (!targets.length) {
          return;
        }
        let num = 0;
        const sha = [], nosha = [];
        while (targets.length) {
          const current = targets.shift();
          const { bool } = await current.chooseToUse(
            function(card2, player2, event2) {
              if (get.name(card2) != "sha") {
                return false;
              }
              return lib.filter.filterCard.apply(this, arguments);
            },
            "驱险：是否对" + get.translation(target) + "使用一张杀？"
          ).set("targetRequired", true).set("complexSelect", true).set("complexTarget", true).set("filterTarget", function(card2, player2, target2) {
            if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
              return false;
            }
            return lib.filter.targetEnabled.apply(this, arguments);
          }).set("sourcex", target).set("addCount", false).forResult();
          if (bool) {
            sha.push(current);
            num++;
          } else {
            nosha.push(current);
          }
        }
        if (num > 0) {
          await player.draw({ num });
        }
        if (!target.hasHistory("damage", (evt) => evt.getParent().type == "card" && evt.getParent(4) == event) && sha.length && nosha.length) {
          player.line(nosha, "green");
          await game.doAsyncInOrder(nosha, async (targetx, i) => targetx.loseHp(sha.length));
        }
      }
    }
  },
  //韩嵩
  dcyinbi: {
    audio: 2,
    mod: {
      targetInRange(card, player) {
        if (!game.hasPlayer((current) => current != player && current.countCards("h") == player.countCards("h"))) {
          return true;
        }
      },
      cardUsable(card, player) {
        if (!game.hasPlayer((current) => current != player && current.countCards("h") == player.countCards("h"))) {
          return Infinity;
        }
      },
      maxHandcardBase(player) {
        if (_status.dcyinbi) {
          return;
        }
        _status.dcyinbi = true;
        const num = Math.max(...game.filterPlayer().map((target) => target.getHandcardLimit()));
        delete _status.dcyinbi;
        return num;
      }
    }
  },
  dcshuaiyan: {
    audio: 2,
    trigger: {
      global: ["phaseDrawEnd", "phaseDiscardEnd"]
    },
    filter(event, player) {
      const num = player.countCards("h");
      if (event.player == player) {
        return game.hasPlayer((current) => {
          return current.countCards("h") == num;
        });
      }
      return event.player.countCards("h") == num;
    },
    async cost(event, trigger, player) {
      const num = player.countCards("h");
      if (trigger.player == player) {
        const count = game.countPlayer((current) => {
          return current.countCards("h") == num;
        });
        event.result = await player.chooseBool(get.prompt(event.skill), `摸${get.cnNumber(count)}张牌`).forResult();
      } else {
        event.result = await player.chooseBool(get.prompt(event.skill, trigger.player), "弃置其一张牌或摸一张牌").forResult();
        event.result.targets = [trigger.player];
      }
    },
    async content(event, trigger, player) {
      if (trigger.player == player) {
        const num = player.countCards("h");
        const count = game.countPlayer((current) => {
          return current.countCards("h") == num;
        });
        await player.draw(count);
        return;
      }
      const target = event.targets[0], goon = target.countDiscardableCards(player, "he");
      let result;
      if (goon) {
        result = await player.discardPlayerCard(target, "he", "弃置其一张牌，否则摸一张牌").set("ai", (button) => {
          const { player: player2, target: target2 } = get.event();
          if (get.effect(target2, { name: "guohe_copy2" }, player2, player2) > 0) {
            return get.buttonValue(button);
          }
          return 0;
        }).set("target", target).forResult();
      } else {
        result = { bool: false };
      }
      if (!result?.bool) {
        await player.draw();
      }
    }
  },
  //侧肘
  dcshefu: {
    audio: 2,
    trigger: {
      global: "damageBefore"
    },
    init(player, skill) {
      player.addSkill(skill + "_mark");
    },
    onremove(player, skill) {
      player.removeSkill(skill + "_mark");
    },
    filter(event, player) {
      if (!event.source || event.source == event.player || ![event.source, event.player].includes(player)) {
        return false;
      }
      const evt = event.getParent(2);
      return evt && evt.name == "useCard";
    },
    forced: true,
    logTarget(event, player) {
      return event.source == player ? event.player : event.source;
    },
    async content(event, trigger, player) {
      if (!trigger.cards?.length) {
        trigger.cancel();
        return;
      }
      const evt = trigger.getParent(2);
      const cards2 = evt.cards.filter((card) => {
        if (trigger.source._start_cards?.includes(card)) {
          return true;
        }
        return trigger.source.getAllHistory("gain", (evt2) => {
          return evt2.cards.includes(card);
        }).length;
      });
      trigger.num = Math.min(
        5,
        cards2.length + cards2.reduce((sum, card) => {
          let num = 0, history = trigger.source.actionHistory;
          for (let i = history.length - 1; i >= 0; i--) {
            if (history[i].gain.some((evtx) => evtx.cards.includes(card))) {
              break;
            }
            if (history[i].isRound) {
              num++;
            }
            if (i == 0 && trigger.source._start_cards?.includes(card)) {
              num--;
            }
          }
          return sum + num;
        }, 0)
      );
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (target == player || !get.tag(card, "damage")) {
            return;
          }
          if (card.name?.endsWith("damage") && lib.card[_status.event?.name]) {
            if (!(_status.event?.cards || []).length) {
              return "zerotarget";
            }
          } else {
            if (!(card.cards || []).length) {
              return "zerotarget";
            }
          }
        },
        player() {
          return lib.skill.dcshefu.ai.effect.target.apply(this, arguments);
        }
      }
    },
    subSkill: {
      mark: {
        charlotte: true,
        silent: true,
        popup: false,
        firstDo: true,
        init(player, skill) {
          const cards2 = player.getCards("h");
          get.info(skill).onremove(player, skill);
          if (cards2.length) {
            for (const card of cards2) {
              let num = 1, history = player.actionHistory;
              for (let i = history.length - 1; i >= 0; i--) {
                if (history[i].gain.some((evtx) => evtx.cards.includes(card))) {
                  break;
                }
                if (history[i].isRound) {
                  num++;
                }
                if (i == 0 && player._start_cards?.includes(card)) {
                  num--;
                }
              }
              num = Math.min(5, num);
              game.broadcastAll((card2) => {
                card2.addGaintag(skill + num);
              }, card);
            }
          }
        },
        onremove(player, skill) {
          for (let i = 1; i < 6; i++) {
            player.removeGaintag(skill + i);
          }
        },
        trigger: {
          player: "gainAfter",
          global: ["loseAsyncAfter", "roundStart"]
        },
        filter(event, player, name) {
          return name == "roundStart" || event.getg?.(player)?.length;
        },
        async content(event, trigger, player) {
          get.info(event.name).init(player, event.name);
        }
      }
    }
  },
  dcpigua: {
    audio: 2,
    trigger: { source: "damageSource" },
    filter(event, player) {
      if (event.player == player) {
        return false;
      }
      return event.num > 1 && event.player.isIn() && event.player.countCards("he") && game.roundNumber > 0;
    },
    async cost(event, trigger, player) {
      const target = trigger.player;
      let result = await player.gainPlayerCard(target, "he", [1, game.roundNumber]).set("prompt", get.prompt2(event.skill, target)).set("logSkill", [event.skill, target]).forResult();
      result.bool = Boolean((result.cards || []).length);
      event.result = result;
    },
    popup: false,
    async content(event, trigger, player) {
      player.addTempSkill("dcpigua_effect");
      player.addGaintag(event.cards, "dcpigua_effect");
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove(player, skill) {
          player.removeGaintag(skill);
        },
        mod: {
          ignoredHandcard(card) {
            if (card.hasGaintag("dcpigua_effect")) {
              return true;
            }
          },
          cardDiscardable(card, _, name) {
            if (name == "phaseDiscard" && card.hasGaintag("dcpigua_effect")) {
              return false;
            }
          }
        }
      }
    }
  },
  //星张昭
  starzhongyan: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => get.info("starzhongyan").filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return target.countCards("h");
    },
    async content(event, trigger, player) {
      const target = event.targets[0], topCards = get.cards(3);
      await game.cardsGotoOrdering(topCards);
      await player.showCards(topCards, get.translation(player) + "发动了【忠言】");
      if (!target.countCards("h")) {
        return;
      }
      const result = await target.chooseToMove("忠言：交换其中一张牌", true).set("list", [
        ["牌堆顶", topCards],
        ["你的手牌", target.getCards("h")]
      ]).set("filterMove", (from, to, moved) => {
        if (typeof to == "number") {
          return false;
        }
        var player2 = _status.event.player;
        var hs = player2.getCards("h");
        var changed = hs.filter(function(card) {
          return !moved[1].includes(card);
        });
        var changed2 = moved[1].filter(function(card) {
          return !hs.includes(card);
        });
        var pos1 = moved[0].includes(from.link) ? 0 : 1, pos2 = moved[0].includes(to.link) ? 0 : 1;
        if (pos1 == pos2) {
          return false;
        }
        if (changed.length < 1) {
          return true;
        }
        if (pos1 == 0) {
          if (changed.includes(from.link)) {
            return true;
          }
          return changed2.includes(to.link);
        }
        if (changed2.includes(from.link)) {
          return true;
        }
        return changed.includes(to.link);
      }).set("filterOk", (moved) => {
        return moved[0].filter((card) => get.owner(card)).length == 1;
      }).set("processAI", function(list) {
        var cards1 = list[0][1].slice(), cards2 = list[1][1].slice();
        var card1 = cards1.slice().sort((a, b) => get.value(b) - get.value(a))[0];
        var card2 = cards2.slice().sort((a, b) => get.value(a) - get.value(b))[0];
        if (card1 && card2) {
          var index1 = cards1.indexOf(card1), index2 = cards2.indexOf(card2);
          cards1[index1] = card2;
          cards2[index2] = card1;
        }
        return [cards1, cards2];
      }).forResult();
      if (result.bool) {
        const lose = result.moved[0].slice();
        const gain = result.moved[1].slice().filter((i) => !get.owner(i));
        if (lose.some((i) => get.owner(i))) {
          await target.lose(
            lose.filter((i) => get.owner(i)),
            ui.special
          );
        }
        await game.cardsGotoPile(lose.slice().reverse(), "insert");
        game.updateRoundNumber();
        if (gain.length) {
          await target.gain(gain, "draw");
        }
        if (lose.map((card) => get.color(card)).toUniqued().length == 1) {
          const chosen = [], list = player != target ? [target, player] : [target];
          for (const current of list) {
            const goon = game.hasPlayer((i) => i.countGainableCards(current, "ej"));
            const choices = [];
            const choiceList = ["回复1点体力", "获得场上一张牌"];
            if (current.isDamaged() && !chosen.includes("选项一")) {
              choices.push("选项一");
            } else {
              choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
            }
            if (goon && !chosen.includes("选项二")) {
              choices.push("选项二");
            } else {
              choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
            }
            if (!choices.length) {
              continue;
            }
            const control = choices.length == 1 ? choices[0] : (await current.chooseControl(choices).set("choiceList", choiceList).set("prompt", "忠言：请选择一项").set("ai", () => {
              const player2 = get.player();
              const eff2 = get.recoverEffect(player2, player2, player2);
              return eff2 ? 0 : 1;
            }).forResult()).control;
            chosen.push(control);
            if (control == "选项一") {
              await current.recover();
            } else {
              const { targets } = await current.chooseTarget("获得一名角色场上的一张牌", true, (card, player2, target2) => {
                const targetx = get.event().targetx;
                return target2.countGainableCards(targetx, "ej") > 0;
              }).set("ai", (target2) => {
                const player2 = get.player();
                let att = get.attitude(player2, target2);
                if (att < 0) {
                  att = -Math.sqrt(-att);
                } else {
                  att = Math.sqrt(att);
                }
                return att * lib.card.shunshou.ai.result.target(player2, target2);
              }).set("targetx", current).forResult();
              await current.gainPlayerCard(targets[0], "ej", true);
            }
          }
        }
      } else {
        await game.cardsGotoPile(topCards.slice().reverse(), "insert");
        game.updateRoundNumber();
      }
    },
    ai: {
      order: 8,
      result: {
        player: 1,
        target: 1
      }
    }
  },
  starjinglun: {
    audio: 2,
    trigger: {
      global: "damageSource"
    },
    filter(event, player) {
      const target = event.source;
      return target && target.isIn() && get.distance(player, target) <= 1;
    },
    check(event, player) {
      return get.attitude(player, event.source) > 0;
    },
    usable: 1,
    logTarget: "source",
    async content(event, trigger, player) {
      const target = trigger.source, num = target.countCards("e");
      if (num) {
        await target.draw(num);
      }
      await player.useSkill("starzhongyan", [target]);
    },
    derivation: "starzhongyan"
  },
  //星孙坚
  starruijun: {
    audio: 2,
    mod: {
      aiOrder(player, card, num) {
        if (num <= 0 || !player.isPhaseUsing()) {
          return num;
        }
        if (get.tag(card, "recover")) {
          if (player.needsToDiscard()) {
            return num / 3;
          }
          return 0;
        }
        if (player.hasSkill("starruijun_effect")) {
          return num;
        }
        const info = get.info(card);
        if (info?.toself) {
          return num;
        }
        if (game.hasPlayer((cur) => {
          return player.canUse(card, cur, true, true) && get.attitude(player, cur) < 0 && get.effect(cur, card, player, player) > 0 && get.damageEffect(cur, player, player) > 0 && !cur.hasSkillTag("filterDamage", null, {
            player,
            card
          });
        })) {
          return num + 2;
        }
        return num / 10;
      }
    },
    trigger: {
      player: "useCardToPlayered"
    },
    filter(event, player) {
      if (!player.isPhaseUsing() || player.hasHistory("useCard", (evt) => {
        if (evt === event.getParent()) {
          return false;
        }
        const targets = evt.targets;
        return evt.isPhaseUsing() && targets.some((target) => target !== player);
      })) {
        return false;
      }
      return event.isFirstTarget && (event.targets || []).some((target) => target !== player && target.isIn());
    },
    locked: false,
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.name.slice(0, -5)), `选择其中一名目标角色，摸${get.cnNumber(player.getDamagedHp() + 1)}张牌，令所有除其外的其他角色不在你的攻击范围内，且你对其造成的伤害逐次增加。`, (card, player2, target) => {
        return target != player2 && get.event().getTrigger().targets.includes(target) && target.isIn();
      }).set("ai", (target) => {
        const player2 = get.player(), original = get.event().original, draw = 1 + player2.getDamagedHp();
        if (Array.isArray(original)) {
          if (original.includes(target)) {
            return -get.attitude(player2, target);
          }
          return 0;
        }
        if (get.attitude(player2, target) >= 0) {
          return draw * get.effect(player2, { name: "draw" }, player2, player2) - original;
        }
        let shas = player2.getCardUsable("sha"), filterDamage = target.hasSkillTag("filterDamage", null, {
          player: player2
        }), idx = filterDamage ? 1 : 0;
        return player2.countCards("hs", (card) => {
          if (get.info(card).toself || !player2.canUse(card, target, false, true)) {
            return 0;
          }
          let eff = get.effect(target, card, player2, player2);
          if (eff <= 0) {
            return 0;
          }
          if (card.name === "sha" && shas-- <= 0) {
            return 0;
          }
          if (!get.tag(card, "damage") || get.type(card, null, player2) === "delay") {
            return eff;
          }
          if (!filterDamage && idx < 3) {
            idx += 0.65;
          }
          return eff * idx;
        }) + draw * get.effect(player2, { name: "draw" }, player2, player2) - original;
      }).set(
        "original",
        (function() {
          const cards2 = player.getCards("hs");
          let shas = player.getCardUsable("sha"), damage = trigger.targets.filter((tar) => {
            return get.attitude(player, tar) < 0 && get.damageEffect(tar, player, player) > 0 && !tar.hasSkillTag("filterDamage", null, {
              player
            });
          }).map((i) => [i, 0]), eff = 0;
          for (let card of cards2) {
            if (card.name === "sha" && shas-- <= 0) {
              continue;
            }
            if (get.info(card).toself) {
              continue;
            }
            if (get.tag(card, "damage") && get.type(card, null, player) !== "delay") {
              for (let arr of damage) {
                if (player.canUse(card, arr[0], false, true) && get.effect(arr[0], card, player, player) > 0) {
                  arr[1]++;
                  if (arr[1] > 4) {
                    return damage.filter((cur) => {
                      return cur[1] > 3;
                    }).map((i) => i[0]);
                  }
                }
              }
            }
            let val = player.getUseValue(card, true, true);
            if (val <= 0) {
              continue;
            }
            eff += val;
          }
          return eff;
        })()
      ).forResult();
    },
    async content(event, trigger, player) {
      await player.draw(player.getDamagedHp() + 1);
      player.addTempSkill("starruijun_effect", "phaseChange");
      player.markAuto("starruijun_effect", event.targets[0]);
    },
    ai: {
      effect: {
        player_use(card, player, target) {
          if (!target || target === player || player._starruijun_effect_use || !player.isPhaseUsing() || player.countSkill("starruijun")) {
            return;
          }
          player._starruijun_effect_use = true;
          if (get.attitude(player, target) < 0 && get.damageEffect(target, player, player) > 0 && !target.hasSkillTag("filterDamage", null, {
            player,
            card
          })) {
            delete player._starruijun_effect_use;
            return [1, 1 + player.getDamagedHp(), 1, -1.8 * player.countCards("hs", (i) => get.tag(i, "damage") && get.type(i) != "delay")];
          }
          delete player._starruijun_effect_use;
        }
      },
      threaten(player, target) {
        if (target.hp < 3) {
          return 9 / (1 + target.getHp());
        }
        return 1 + 0.3 * target.getDamagedHp();
      }
    },
    subSkill: {
      effect: {
        audio: "starruijun",
        trigger: {
          source: "damageBegin2"
        },
        filter(event, player) {
          if (!player.getStorage("starruijun_effect").includes(event.player)) {
            return false;
          }
          let evt = event.getParent("phaseUse");
          return evt && player.hasHistory("sourceDamage", (evt2) => {
            return evt2.source === player && evt2.player === event.player && evt2.getParent("phaseUse") === evt;
          });
        },
        charlotte: true,
        forced: true,
        onremove: true,
        async content(event, trigger, player) {
          let num = 1;
          const evts = player.getHistory("sourceDamage", (evt) => {
            return evt.source === player && evt.player === trigger.player && evt.getParent("phaseUse") === trigger.getParent("phaseUse");
          });
          if (evts.length) {
            num += evts.lastItem.num;
          }
          trigger.num = Math.min(5, num);
        },
        ai: {
          damageBonus: true,
          skillTagFilter(player, tag, arg) {
            if (tag !== "damageBonus") {
              return false;
            }
            return arg && arg.target && player.hasHistory("sourceDamage", (evt) => {
              return evt.source === player && evt.player === arg.target && evt.getParent("phaseUse") === _status.event.getParent("phaseUse");
            });
          },
          effect: {
            player(card, player, target) {
              if (!target || !player.getStorage("starruijun_effect").includes(target) || !get.tag(card, "damage")) {
                return;
              }
              return [2.5, 0, 2.5, 0];
            }
          }
        },
        mod: {
          inRange(from, to) {
            if (!from.getStorage("starruijun_effect").includes(to)) {
              return false;
            }
          },
          targetInRange(card, player, target) {
            if (player.getStorage("starruijun_effect").includes(target)) {
              return true;
            }
          }
        }
      }
    }
  },
  stargangyi: {
    audio: 2,
    trigger: {
      source: "damage"
    },
    silent: true,
    forced: true,
    group: "stargangyi_recover",
    async content(event, trigger, player) {
      player.addTempSkill("stargangyi_access");
    },
    ai: {
      halfneg: true
    },
    subSkill: {
      recover: {
        audio: "stargangyi",
        trigger: {
          player: "recoverBegin"
        },
        filter(event, player) {
          const evt = event.getParent(3);
          if (!player.isDying() || evt.type !== "dying") {
            return false;
          }
          return ["tao", "jiu"].includes(event.getParent().name);
        },
        forced: true,
        async content(event, trigger, player) {
          trigger.num++;
        },
        ai: {
          effect: {
            target(card, player, target) {
              if (target.hp <= 0 && get.tag(card, "recover")) {
                return 2;
              }
            }
          }
        }
      },
      access: {
        charlotte: true
      }
    },
    mod: {
      cardEnabled(card, player) {
        if (player.hasSkill("stargangyi_access")) {
          return;
        }
        if (player === _status.currentPhase && card.name === "tao") {
          return false;
        }
      },
      cardSavable(card, player) {
        if (player.hasSkill("stargangyi_access")) {
          return;
        }
        if (player === _status.currentPhase && card.name === "tao") {
          return false;
        }
      }
    }
  },
  //李傕郭汜
  xiongsuan: {
    audio: 2,
    enable: "phaseUse",
    filterTarget: true,
    filterCard: lib.filter.cardDiscardable,
    position: "h",
    usable: 1,
    async content(event, trigger, player) {
      const target = event.target;
      await target.damage();
      await player.draw(3);
      if (target != player) {
        await player.loseHp();
      }
    },
    ai: {
      order: 9,
      result: {
        player(player, target) {
          let res = 2 * get.effect(player, { name: "draw" }, player, player);
          if (player.hp <= 1 && !player.hasCard((i) => {
            let name = get.name(i, player);
            if (name != "tao" && name != "jiu") {
              return false;
            }
            return lib.filter.cardSavable(i, player, player);
          }, "hs")) {
            res = -res / 2;
          }
          if (player !== target) {
            res += get.effect(player, { name: "losehp" }, player, player);
          }
          return res;
        },
        target(player, target) {
          return get.damageEffect(target, player, target);
        }
      }
    }
  },
  // 星夏侯霸
  starweigu: {
    audio: 2,
    trigger: {
      player: "useCardToPlayer",
      target: "useCardToTarget"
    },
    filter(event, player) {
      if (!get.is.damageCard(event.card)) {
        return false;
      }
      if (event.targets?.length !== 1) {
        return false;
      }
      if (!player.hasCards("he", (card) => get.info("starweigu").isSelf(card, player) && lib.filter.cardDiscardable(card, player, "starweigu"))) {
        return false;
      }
      return true;
    },
    async cost(event, trigger, player) {
      let prompt = "弃置一张可指定自己为目标的牌，然后选择一项:";
      if (player.getStorage("starweigu", false)) {
        prompt += "<span class=text center>1、对一名角色造成2点伤害；</span>";
      } else {
        prompt += "<span class=text center>1、移动场上一张牌；</span>";
      }
      prompt += "2、令你攻击范围内的所有角色也成为此牌目标（不包括此牌使用者）。此牌结算后若牌未造成伤害，你失去1点体力并摸两张牌。";
      event.result = await player.chooseToDiscard({
        prompt: get.prompt("starweigu"),
        prompt2: prompt,
        filterCard: get.info("starweigu").isSelf,
        position: "he",
        ai(card) {
          return get.value(card);
        },
        chooseonly: true
      }).forResult();
    },
    getTargets(card, player, source) {
      return game.filterPlayer((current) => {
        if (player === current || source == current) {
          return false;
        }
        if (!player.inRange(current)) {
          return false;
        }
        return lib.filter.targetEnabled2(card, source, current);
      });
    },
    isSelf(card, player, evt = get.event()) {
      const info = get.info(card);
      if (info.toself) {
        return true;
      }
      return lib.filter.targetEnabled3(card, player, player);
    },
    async content(event, trigger, player) {
      await player.discard({ cards: event.cards });
      const choiceList = [];
      if (!player.getStorage("starweigu", false)) {
        if (player.canMoveCard()) {
          choiceList.push(["move", "移动场上的一张牌"]);
        }
      } else {
        choiceList.push(["damage", "对一名角色造成2点伤害"]);
      }
      const source = trigger.player == player ? player : trigger.player;
      const targets = get.info("starweigu").getTargets(trigger.card, player, source);
      choiceList.push(["addtarget", `令攻击范围内的所有角色（${targets.length ? get.translation(targets) : "滚木"}）成为${get.translation(trigger.card)}的额外目标`]);
      if (choiceList.length) {
        let choice;
        if (choiceList.length == 2) {
          const result = await player.chooseButton({
            createDialog: ["选择一项：", [choiceList, "textbutton"]],
            selectButton: 1,
            forced: true,
            ai(button) {
              const player2 = get.player();
              const { card, targets: targets2 } = get.event();
              if (button.link === "move") {
                return 1;
              } else if (button.link === "damage") {
                for (const current of game.filterPlayer((current2) => current2 !== player2)) {
                  if (get.damageEffect(current, player2, player2) > 0) {
                    return 666;
                  }
                }
              } else if (button.link === "addtarget") {
                let num = 0;
                targets2.forEach((target) => num += get.effect(target, { name: card.name }, player2, player2));
                return num;
              }
              return 0;
            }
          }).set("choiceList", choiceList).set("targets", targets).set("card", trigger.card).forResult();
          choice = result?.links?.[0];
        } else {
          choice = choiceList[0][0];
        }
        if (choice === "move") {
          await player.moveCard({
            prompt: "移动场上的一张牌",
            forced: true
          });
        } else if (choice === "damage") {
          const result = await player.chooseTarget({
            prompt: "对一名角色造成2点伤害",
            ai(target) {
              return -get.attitude(get.player(), target);
            }
          }).forResult();
          if (result.bool && result.targets?.length) {
            await result.targets[0].damage({
              num: 2,
              source: player
            });
          }
        } else if (choice === "addtarget") {
          trigger.targets.addArray(targets.filter((target) => target.isIn()));
        }
      }
      player.when({ global: "useCardAfter" }).filter((evt) => evt.card === trigger.card).then(async (event2, trigger2, player2) => {
        if (!game.hasGlobalHistory("everything", (evt) => evt.name === "damage" && evt.card === trigger2.card)) {
          await player2.loseHp();
          await player2.draw(2);
        }
      });
    }
  },
  starjuefa: {
    //批量改名前记得这里有starweigu
    audio: 2,
    enable: "phaseUse",
    skillAnimation: true,
    limited: true,
    animationColor: "red",
    manualConfirm: true,
    filter(event, player) {
      return !player.getStorage("starweigu", false);
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      player.addSkill("starjuefa_effect");
    },
    subSkill: {
      effect: {
        audio: "starjuefa",
        charlotte: true,
        forced: true,
        init(player, skill) {
          player.setStorage("starweigu", true);
          player.addSkill("starjuefa_remove");
          player.markAuto("starjuefa_remove", "die");
        },
        trigger: {
          source: "dieAfter"
        },
        async content(event, trigger, player) {
          player.unmarkAuto("starjuefa_remove", "die");
          if (trigger.reason?.getParent("starweigu")) {
            const num1 = player.countCards("h");
            const num2 = player.maxHp;
            const num3 = player.hp;
            if (num1 > num2) {
              await player.chooseToDiscard({
                selectCard: num1 - num2
              });
            } else if (num1 < num2) {
              await player.drawTo(num2);
            }
            if (num3 != num2) {
              await player.recover({ num: num2 - num3 });
            }
          }
        }
      },
      remove: {
        audio: "starjuefa",
        charlotte: true,
        forced: true,
        trigger: {
          player: "phaseEnd"
        },
        async content(event, trigger, player) {
          if (!player.getStorage("starjuefa_remove").includes("remove")) {
            player.markAuto("starjuefa_remove", "remove");
          } else {
            player.setStorage("starweigu", false);
            player.removeSkill("starjuefa_effect");
            player.removeSkill("starjuefa_remove");
            if (player.getStorage("starjuefa_remove").includes("die")) {
              if (player.hp > 0) {
                await player.loseHp(player.getHp());
              }
            }
          }
        }
      }
    }
  },
  //张春华
  starliangyan: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: lib.filter.notMe,
    chooseButton: {
      dialog(event, player) {
        const name = get.translation(event.result.targets[0]);
        const list = ["你摸一张牌，其弃置一张牌", "你弃置一张牌，其摸一张牌", "你摸两张牌，其弃置两张牌", "你弃置两张牌，其摸两张牌"].map((item, i) => [i, item]);
        const dialog = ui.create.dialog(`梁燕：请选择你与${name}要执行的选项`, [list.slice(0, 2), "tdnodes"], [list.slice(2, 4), "tdnodes"], "hidden");
        return dialog;
      },
      filter(button, player) {
        const link = button.link;
        if (link % 2 === 0) {
          return true;
        }
        return player.countDiscardableCards(player, "he") >= (link + 1) / 2;
      },
      check(button) {
        const player = get.player(), target = get.event().getParent().result.targets[0];
        const link = button.link;
        if (get.attitude(player, target) <= 0 && link === 2) {
          return 100;
        }
        const ph = player.countCards("h"), th = target.countCards("h");
        if (link % 2 === 0) {
          const num = link / 2 + 1;
          if (ph + num === th - num) {
            return 10;
          }
        } else {
          const num = (link + 1) / 2;
          if (ph - num === th + num) {
            return 10;
          }
        }
        return 5;
      },
      backup(links) {
        return {
          audio: "starliangyan",
          target: get.event().result.targets[0],
          link: links[0],
          filterTarget(card, player, target) {
            return target === lib.skill.starliangyan_backup.target;
          },
          selectTarget: -1,
          async content(content, trigger, player) {
            const target = lib.skill.starliangyan_backup.target;
            const link = lib.skill.starliangyan_backup.link;
            const num = link <= 1 ? 1 : 2;
            const fn = ["draw", "chooseToDiscard"];
            if (link % 2 === 1) {
              fn.reverse();
            }
            await player[fn[0]](num, true, "he");
            await target[fn[1]](num, true, "he");
            if (player.countCards("h") === target.countCards("h")) {
              const skipper = [player, target][link % 2];
              skipper.skip("phaseDiscard");
              game.log(skipper, "跳过了下一个", "#y弃牌阶段");
            }
          }
        };
      },
      prompt(links) {
        return "点击“确定”以执行效果";
      }
    },
    subSkill: {
      backup: {}
    },
    ai: {
      order(item, player) {
        if (!game.hasPlayer((current) => current !== player && get.attitude(player, current) > 0) && game.hasPlayer((current) => get.attitude(player, current) <= 0)) {
          return 10;
        }
        if (game.hasPlayer((current) => {
          const del = player.countCards("h") - current.countCards("h"), toFind = [2, 4].find((num) => Math.abs(del) === num);
          if (toFind === 4 && del < 0 && get.attitude(player, current) <= 0) {
            return true;
          }
          return false;
        })) {
          return 10;
        }
        return 1;
      },
      result: {
        target(player, target) {
          const del = player.countCards("h") - target.countCards("h"), toFind = [2, 4].find((num) => Math.abs(del) === num);
          if (toFind) {
            return -del * (get.attitude(player, target) * Math.min(3, target.countCards("h"))) * toFind / 10;
          }
          return -1;
        }
      }
    }
  },
  starminghui: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      return player.isMinHandcard() || player.isMaxHandcard();
    },
    direct: true,
    async content(event, trigger, player) {
      let logged = false;
      if (player.isMinHandcard()) {
        const card = new lib.element.VCard({
          name: "sha",
          isCard: true
        });
        const result = await player.chooseUseTarget(`###${get.prompt("starminghui")}###视为使用一张无距离限制的【杀】`, card, false, "nodistance").set("logSkill", "starminghui").forResult();
        if (result?.bool) {
          logged = true;
        }
      }
      const num = player.countCards("h");
      if (player.isMaxHandcard() && num > 0) {
        const maxNum = game.findPlayer((current) => {
          if (current === player) {
            return false;
          }
          return !game.hasPlayer((current2) => {
            if (current2 === player) {
              return false;
            }
            return current2.countCards("h") > current.countCards("h");
          });
        })?.countCards("h");
        if (!maxNum || !player.hasDiscardableCards(player, "h")) {
          return;
        }
        const leastDiscardNum = num - maxNum + 1;
        const prompt = logged ? `是否将手牌弃置至不为最多？` : get.prompt("starminghui");
        const next = player.chooseToDiscard(prompt, `弃置${get.cnNumber(leastDiscardNum)}张手牌，然后你令一名角色回复1点体力`, "allowChooseAll").set("selectCard", leastDiscardNum).set(
          "goon",
          game.hasPlayer((current) => get.recoverEffect(current, get.player(), get.player()))
        ).set("ai", (card) => {
          if (!get.event().goon) {
            return 0;
          }
          if (get.tag(card, "recover")) {
            return 0;
          }
          if (ui.selected.cards.length === get.event().selectCard[0] - 1) {
            return 6.5 - get.value(card);
          }
          return 4 - get.value(card);
        });
        if (!logged) {
          next.set("logSkill", "starminghui");
        }
        const result = await next.forResult();
        if (!result?.bool || !result.cards?.length) {
          return;
        }
        if (!player.isUnderControl(true) && !player.isOnline()) {
          await game.delayx();
        }
        if (game.hasPlayer((current) => current.isDamaged())) {
          const result2 = await player.chooseTarget("令一名角色回复1点体力", (card, player2, target) => {
            return target.isDamaged();
          }).set("ai", (target) => get.recoverEffect(target, get.player(), get.player())).forResult();
          if (result2?.targets?.length) {
            const target = result2.targets[0];
            player.line(target, "green");
            await target.recover();
          }
        }
      }
    }
  },
  //星袁绍
  starxiaoyan: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: [
        "enterGame"
        /*,'logSkill'*/
      ]
    },
    filter(event, player) {
      if (!game.hasPlayer((current) => current != player)) {
        return false;
      }
      return event.name != "phase" || game.phaseNumber == 0;
    },
    forced: true,
    async content(event, trigger, player) {
      let targets = game.filterPlayer((current) => current != player).sortBySeat();
      player.line(targets);
      for (const target of targets) {
        await target.damage("fire");
      }
      targets = targets.filter((i) => i.isIn());
      if (targets.length) {
        for (const target of targets) {
          if (!target.countCards("he")) {
            continue;
          }
          const { bool } = await target.chooseToGive("he", player).set("prompt", "是否交给" + get.translation(player) + "一张牌" + (target.isDamaged() ? "并回复1点体力" : "") + "？").set("ai", (card) => {
            const target2 = get.event().player, player2 = get.event().target;
            const att = get.attitude(target2, player2);
            if (get.recoverEffect(target2, target2, target2) <= 0) {
              if (att <= 0) {
                return -get.value(card);
              }
              return 0;
            }
            return 7 - get.value(card);
          }).set("target", player).forResult();
          if (bool) {
            await target.recover();
          }
        }
      }
    }
  },
  starzongshi: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      const cards2 = player.getCards("h", (card) => {
        const type = get.type(card, null, player);
        if (type != "basic" && type != "trick") {
          return false;
        }
        return lib.filter.cardUsable(card, player) && game.hasPlayer((target) => {
          return lib.filter.targetEnabled2(card, player, target);
        });
      });
      if (!cards2.length) {
        return false;
      }
      return cards2.some((card) => {
        const cardss = player.getCards("h", (cardx) => card != cardx && get.suit(card, player) == get.suit(cardx, player));
        return cardss.length && !cardss.some((cardx) => !game.checkMod(cardx, player, "unchanged", "cardEnabled2", player));
      });
    },
    filterCard(card, player) {
      if (ui.selected.cards.length) {
        return false;
      }
      const cards2 = player.getCards("h", (card2) => {
        const type = get.type(card2, null, player);
        if (type != "basic" && type != "trick") {
          return false;
        }
        return lib.filter.cardUsable(card2, player) && game.hasPlayer((target) => {
          return lib.filter.targetEnabled2(card2, player, target);
        });
      });
      if (!cards2.includes(card)) {
        return false;
      }
      const cardss = player.getCards("h", (cardx) => card != cardx && get.suit(card, player) == get.suit(cardx, player));
      return cardss.length && !cardss.some((cardx) => !game.checkMod(cardx, player, "unchanged", "cardEnabled2", player));
    },
    selectCard: [1, 2],
    complexCard: true,
    check(card) {
      const player = get.event().player, select = get.copy(get.info(card).selectTarget);
      let range;
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
      game.checkMod(card, player, range, "selectTarget", player);
      const cards2 = player.getCards("h", (cardx) => card != cardx && get.suit(card, player) == get.suit(cardx, player));
      let targets = game.filterPlayer((target) => lib.filter.targetEnabled2(card, player, target) && get.effect(target, card, player, player) > 0);
      const max = range[1], max2 = Math.min(cards2.length, targets.length);
      if (max > max2) {
        return 0;
      }
      targets = targets.sort((a, b) => get.effect(b, card, player, player) - get.effect(a, card, player, player)).slice(0, max2);
      const sum = targets.reduce((num, target) => num + get.effect(target, card, player, player), 0);
      if (max == -1) {
        if (game.filterPlayer((target) => {
          return lib.filter.targetEnabled2(card, player, target);
        }).reduce((num, target) => num + get.effect(target, card, player, player), 0) > sum) {
          return 0;
        }
      }
      return sum;
    },
    position: "h",
    discard: false,
    lose: false,
    delay: false,
    async content(event, trigger, player) {
      const card = event.cards[0], cards2 = player.getCards("h", (cardx2) => card != cardx2 && get.suit(card, player) == get.suit(cardx2, player));
      await player.showCards([card], get.translation(player) + "发动了【纵势】");
      const cardx = new lib.element.VCard({
        name: get.name(card, player),
        nature: get.nature(card, player),
        cards: cards2
      });
      const { bool, targets } = await player.chooseTarget((card2, player2, target) => {
        return lib.filter.targetEnabled2(get.event().cardx, player2, target);
      }, true).set("cardx", cardx).set("selectTarget", [1, cards2.length]).set("prompt", "请选择" + (game.hasNature(cardx) ? get.translation(get.nature(cardx)) : "") + "【" + get.translation(cardx) + "】（" + get.translation(cards2) + "）的目标").set("ai", (target) => {
        const player2 = get.event().player, card2 = get.event().cardx;
        return get.effect(target, card2, player2, player2);
      }).forResult();
      if (bool) {
        player.useCard(cardx, cards2, targets.sortBySeat());
      }
    },
    ai: {
      order: 9,
      result: { player: 1 }
    }
  },
  starjiaowang: {
    audio: 2,
    trigger: { global: "roundEnd" },
    filter(event, player) {
      const history = game.getAllGlobalHistory();
      for (let i = history.length - 1; i >= 0; i--) {
        const evt = history[i]["everything"];
        for (let j = evt.length - 1; j >= 0; j--) {
          if (evt[j].name == "die") {
            return false;
          }
        }
        if (history[i].isRound) {
          break;
        }
      }
      return true;
    },
    forced: true,
    derivation: "starxiaoyan",
    async content(event, trigger, player) {
      await player.loseHp();
      if (game.hasPlayer((current) => current != player)) {
        player.useResult({ skill: "starxiaoyan" }, event);
      }
    }
  },
  staraoshi: {
    audio: 2,
    zhuSkill: true,
    global: "staraoshi_global",
    derivation: "starzongshi",
    subSkill: {
      global: {
        audio: "staraoshi",
        forceaudio: true,
        enable: "phaseUse",
        filter(event, player) {
          return player.group == "qun" && game.hasPlayer((target) => lib.skill.staraoshi.subSkill.global.filterTarget(null, player, target));
        },
        filterTarget(card, player, target) {
          return target != player && target.hasZhuSkill("staraoshi");
        },
        prompt() {
          const player = get.event().player;
          const targets = game.filterPlayer((target) => lib.skill.staraoshi.subSkill.global.filterTarget(null, player, target));
          return "交给" + get.translation(targets) + (targets.length > 1 ? "中的一人" : "") + "一张手牌，然后其可以发动一次【纵势】";
        },
        filterCard: true,
        check(card) {
          const player = get.event().player;
          const target = game.filterPlayer((target2) => {
            return lib.skill.staraoshi.subSkill.global.filterTarget(null, player, target2);
          }).sort((a, b) => b.countCards("h") - a.countCards("h"))[0];
          return target.getUseValue(card);
        },
        discard: false,
        lose: false,
        delay: false,
        usable: 1,
        async content(event, trigger, player) {
          const target = event.target, info = get.info("starzongshi");
          await player.give(event.cards, target);
          const { bool, cards: cards2 } = await target.chooseCard(info.position, (card, player2) => {
            return get.event().info.filterCard(card, player2);
          }).set("info", info).set("ai", (card) => get.event().info.check(card)).set("selectCard", [1, 2]).set("complexCard", true).set("prompt", get.prompt("starzongshi")).set("prompt2", lib.translate.starzongshi_info.slice(8).slice(0, -1)).forResult();
          if (bool) {
            target.useResult({ skill: "starzongshi", cards: cards2 }, event);
          }
        },
        ai: {
          order: 9,
          result: {
            target(player, target) {
              return target.countCards("h") + 1;
            }
          }
        }
      }
    }
  },
  //星董卓
  starweilin: {
    audio: 2,
    trigger: { source: "damageBegin1" },
    filter(event, player) {
      if (_status.currentPhase !== player) {
        return false;
      }
      return !event.player.getHistory("damage").length && player.getHistory("useCard").length >= event.player.getHp();
    },
    forced: true,
    logTarget: "player",
    async content(event, trigger, player) {
      trigger.num++;
    }
  },
  starzhangrong: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return player.getHp() > 0;
    },
    direct: true,
    async content(event, trigger, player) {
      var str = get.cnNumber(player.getHp());
      var choiceList = ["令至多" + str + "名体力值大于等于你的角色各失去1点体力", "令至多" + str + "名手牌数大于等于你的角色各弃置一张手牌"], list = ["cancel2"];
      if (game.hasPlayer((target) => {
        if (target == player) {
          return player.countCards("h", (card) => lib.filter.cardDiscardable(card, player));
        }
        return target.countCards("h") >= Math.max(1, player.countCards("h"));
      })) {
        list.unshift("弃牌");
      } else {
        choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
      }
      list.unshift("扣血");
      var result = await player.chooseControl(list).set("prompt", "###" + get.prompt("starzhangrong") + "###选择其中一项令任意名符合条件的角色执行，然后你摸等量的牌，回合结束时，若这些角色中有本回合未受到过伤害的角色，则你失去1点体力").set("ai", () => {
        var player2 = _status.event.player;
        var controls = _status.event.controls.slice();
        var targets1 = game.filterPlayer(
          (target) => get.attitude(player2, target) < 0 && target.getHp() >= player2.getHp() && get.effect(target, { name: "losehp" }, player2, player2) > 0
          /*&&cards.some(card=>player.canUse(card,target))*/
        );
        _status.starzhangrong_check = true;
        var targets2 = game.filterPlayer(
          (target) => get.attitude(player2, target) < 0 && target.countCards("h") >= Math.max(1, player2.countCards("h")) && get.effect(target, { name: "guohe_copy2" }, player2, player2) > 0
          /*&&cards.some(card=>player.canUse(card,target))*/
        );
        delete _status.starzhangrong_check;
        [targets1, targets2].forEach((list2) => {
          list2.sort((a, b) => get.damageEffect(b) - get.damageEffect(a));
          list2 = list2.slice(0, Math.min(
            player2.getHp()
            /*,cards.length*/
          ));
        });
        if (!controls.includes("弃牌")) {
          return 1 - get.sgn(targets1.length);
        }
        return Math.max(0, get.sgn(targets2.length - targets1.length));
      }).set("choiceList", choiceList).forResult();
      if (result.control != "cancel2") {
        var choice = result.index;
        var result2 = await player.chooseTarget([1, player.getHp()], "请选择【掌戎】的目标", "令至多" + str + "名" + (choice ? "手牌数" : "体力值") + "大于你的角色各" + (choice ? "弃置一张手牌" : "失去1点体力"), (card, player2, target) => {
          var name = _status.event.card.name;
          if (name == "guohe_copy2") {
            if (target == player2) {
              return player2.countCards("h", (card2) => lib.filter.cardDiscardable(card2, player2));
            }
            return target.countCards("h") >= Math.max(1, player2.countCards("h"));
          }
          return target.getHp() >= player2.getHp();
        }).set("ai", (target) => {
          var player2 = _status.event.player;
          if (get.attitude(player2, target) >= 0) {
            return 0;
          }
          return get.effect(target, _status.event.card, player2, player2);
        }).set("card", { name: choice ? "guohe_copy2" : "losehp" }).forResult();
        if (result2.bool) {
          var targets = result2.targets.sortBySeat();
          player.logSkill("starzhangrong", targets);
          targets.forEach((target) => {
            target.addTempSkill("starzhangrong_threaten");
            if (choice) {
              target.chooseToDiscard("h", true);
            } else {
              target.loseHp();
            }
          });
          player.draw(targets.length);
          player.when("phaseEnd").step(async () => {
            targets.forEach((target) => target.removeSkill("starzhangrong_threaten"));
            var targetx = targets.filter((target) => !target.getHistory("damage").length);
            if (targetx.length) {
              targetx.forEach((target) => target.chat("乐"));
              player.popup("杯具");
              await player.loseHp();
              return;
            }
            player.popup("洗具");
          });
        }
      }
    },
    global: "starzhangrong_check",
    subSkill: {
      check: {
        mod: {
          canBeDiscarded(card, player, target) {
            if (!_status.starzhangrong_check) {
              return;
            }
            if (player.hasSkill("starzhangrong") && get.position(card) != "h") {
              return false;
            }
          }
        }
      },
      threaten: {
        charlotte: true,
        trigger: { player: "damageEnd" },
        firstDo: true,
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          player.removeSkill("starzhangrong_threaten");
        },
        ai: { threaten: 114514 + 1919810 },
        mark: true,
        markimage: "image/card/sha.png",
        intro: { content: "我还没受到伤害哟！" }
      }
    }
  },
  starhaoshou: {
    audio: 2,
    trigger: { global: "useCardAfter" },
    filter(event, player) {
      return event.player != player && event.card.name == "jiu" && player.isDamaged() && event.player.group == "qun";
    },
    direct: true,
    zhuSkill: true,
    async content(event, trigger, player) {
      var target = trigger.player;
      var result = await target.chooseBool(get.prompt("starhaoshou", player), "令" + get.translation(player) + "回复1点体力").set("choice", get.recoverEffect(player, target, target) > 0).forResult();
      if (result.bool) {
        target.line(player);
        player.logSkill("starhaoshou");
        player.recover(target);
      }
    },
    //global:'starhaoshou_global',
    subSkill: {
      global: {
        audio: "starhaoshou",
        forceaudio: true,
        filter(event, player) {
          if (!player.countCards("hes", (card) => {
            if (get.position(card) == "h" && _status.connectMode) {
              return true;
            }
            return get.name(card) == "jiu";
          })) {
            return false;
          }
          return event.type == "dying" && event.dying && event.dying != player && event.dying.hp <= 0 && event.dying.hasZhuSkill("starhaoshou") && player.group == "qun";
        },
        filterCard(card, player) {
          return get.name(card) == "jiu";
        },
        check: () => 1,
        viewAs: { name: "tao" },
        position: "hes",
        prompt() {
          return "将一张【酒】当作【桃】对" + get.translation(_status.event.dying) + "使用";
        },
        ai: {
          save: true,
          skillTagFilter(player, arg, target) {
            if (!player.countCards("hes", (card) => {
              if (get.position(card) == "h" && _status.connectMode) {
                return true;
              }
              return get.name(card) == "jiu";
            }) || player == target || !target.hasSkill("starhaoshou") || player.group != "qun") {
              return false;
            }
          }
        }
      }
    }
  },
  //星袁术
  starcanxi: {
    audio: 2,
    trigger: {
      global: ["phaseBefore", "roundStart"],
      player: "enterGame"
    },
    filter(event, player, name) {
      if (name === "roundStart") {
        return player.getSkills().some((skill) => skill.indexOf("starcanxi_") === 0);
      }
      return event.name !== "phase" || game.phaseNumber === 0;
    },
    forced: true,
    async content(event, trigger, player) {
      if (event.triggername !== "roundStart") {
        const list = game.filterPlayer().reduce((list2, target) => list2.add(target.group), []);
        list.sort((a, b) => lib.group.indexOf(a) - lib.group.indexOf(b));
        const lacks = lib.group.filter((group2) => group2 !== "shen" && !list.includes(group2));
        list.forEach((group2) => lib.skill.starcanxi.create(group2, player));
        if (lacks.length) {
          await player.gainMaxHp(lacks.length);
        }
        return;
      }
      const groups = player.getSkills().filter((skill2) => skill2.indexOf("starcanxi_") === 0).map((group2) => group2.slice(10));
      groups.sort((a, b) => lib.group.indexOf(a) - lib.group.indexOf(b));
      const result = await player.chooseButton({
        createDialog: [
          '###残玺###<div class="text center">请选择势力和效果</div>',
          [groups.map((group2) => [group2, lib.translate[`${group2}2`] || lib.translate[group2]]), "tdnodes"],
          [
            [
              ["wangsheng", '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【妄生】</div><div>被选择势力角色每回合首次造成的伤害+1且计算与其他角色间的距离-1</div></div>'],
              ["xiangsi", '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【向死】</div><div>其他被选择势力角色每回合首次回复体力后失去1点体力且每回合对你使用的第一张牌无效</div></div>']
            ],
            "textbutton"
          ]
        ],
        selectButton: 2,
        forced: true,
        filterButton: (button) => {
          const effects = ["wangsheng", "xiangsi"];
          if (!ui.selected.buttons.length) {
            return true;
          }
          return effects.includes(ui.selected.buttons[0].link) !== effects.includes(button.link);
        },
        ai: (button) => {
          const currentPlayer = _status.event.player;
          const map = _status.event.map;
          const effects = ["wangsheng", "xiangsi"];
          const getNum = (group2, effect) => {
            let num = 0;
            const sgn = effect === "wangsheng" ? 1.05 : -1;
            game.countPlayer((current) => {
              if (!(current === currentPlayer && sgn === -1) && current.group === group2) {
                num += get.sgn(get.attitude(currentPlayer, current)) * sgn;
              }
            });
            return num;
          };
          const list = [];
          for (const group2 of map) {
            for (const effect of effects) {
              list.push([group2, effect]);
            }
          }
          list.sort((a, b) => getNum(b[0], b[1]) - getNum(a[0], a[1]));
          return button.link === list[0][0] || button.link === list[0][1] ? 1 : 0;
        }
      }).set("map", groups).forResult();
      if (!result.bool) {
        return;
      }
      const links = result.links.slice();
      if (!groups.includes(links[0])) {
        links.reverse();
      }
      const group = links[0];
      const skill = `starcanxi_${links[1]}`;
      const str = lib.translate[`${group}2`] || lib.translate[group];
      player.popup([str, skill]);
      game.log(player, "选择了", `#g${str}`, "、", `#y${get.translation(skill)}`);
      player.addTempSkill(skill, "roundStart");
      player.markAuto(skill, [group]);
    },
    create(group, player) {
      const skill = `starcanxi_${group}`;
      get.info("starcanxi").createSkill(skill);
      if (!_status.postReconnect.starcanxi) {
        _status.postReconnect.starcanxi = [get.info("starcanxi").createSkill, []];
      }
      _status.postReconnect.starcanxi[1].add(skill);
      player.addSkill(skill);
    },
    createSkill(skill) {
      if (!lib.skill[skill]) {
        game.broadcastAll((skill2) => {
          const group = skill2.slice("starcanxi_".length);
          lib.skill[skill2] = {
            mark: true,
            charlotte: true,
            onremove(player) {
              player.addMark("starpizhi", 1, false);
            },
            intro: { content: "玉玺的一角" }
          };
          lib.translate[skill2] = `残玺·${get.translation(`${group}2`)}`;
          lib.skill[skill2].marktext = get.translation(group);
          lib.translate[`${skill2}_bg`] = get.translation(group);
        }, skill);
      }
    },
    subSkill: {
      wangsheng: {
        charlotte: true,
        onremove: true,
        trigger: { global: "damageBegin1" },
        filter(event, player) {
          if (!event.source || !player.getStorage("starcanxi_wangsheng").includes(event.source.group)) {
            return false;
          }
          return !event.source.getHistory("sourceDamage").length;
        },
        forced: true,
        logTarget: "source",
        async content(event, trigger, player) {
          trigger.num++;
        },
        group: "starcanxi_remove",
        global: "starcanxi_effect",
        intro: { content: "$势力角色每回合首次造成的伤害+1且计算与其他角色间的距离-1" }
      },
      xiangsi: {
        charlotte: true,
        onremove: true,
        trigger: { global: "recoverEnd" },
        filter(event, player) {
          if (!player.getStorage("starcanxi_xiangsi").includes(event.player.group) || event.player === player) {
            return false;
          }
          return game.getGlobalHistory("changeHp", (evt) => evt.getParent().name === "recover" && evt.player === event.player).map((evt) => evt.getParent()).indexOf(event) === 0;
        },
        forced: true,
        logTarget: "player",
        async content(event, trigger, player) {
          await trigger.player.loseHp();
        },
        group: ["starcanxi_remove", "starcanxi_cancel"],
        global: "starcanxi_effect",
        intro: { content: "其他$势力角色每回合首次回复体力后失去1点体力且每回合对你使用的第一张牌无效" }
      },
      cancel: {
        charlotte: true,
        trigger: { global: "useCard" },
        filter(event, player) {
          if (!event.targets || !event.targets.includes(player) || !player.getStorage("starcanxi_xiangsi").includes(event.player.group) || event.player === player) {
            return false;
          }
          return event.player.getHistory("useCard", (evt) => evt.targets && evt.targets.includes(player)).indexOf(event) === 0;
        },
        forced: true,
        logTarget: "player",
        async content(event, trigger, player) {
          trigger.excluded.add(player);
        }
      },
      effect: {
        mod: {
          globalFrom(from, to, distance) {
            if (game.hasPlayer((target) => target.getStorage("starcanxi_wangsheng").includes(from.group))) {
              return distance - 1;
            }
          }
        },
        ai: {
          effect: {
            player(card, player, target) {
              if (get.itemtype(card) !== "card" || !player || !target) {
                return;
              }
              const targets = game.filterPlayer((targetx) => targetx !== player && targetx.getStorage("starcanxi_xiangsi").includes(player.group));
              if (!targets.length) {
                return;
              }
              if (get.tag(card, "recover") && target === player && target.hp > 2) {
                return 0;
              }
              if (get.tag(card, "damage") && targets.includes(target)) {
                return 0.5;
              }
            }
          }
        }
      },
      remove: {
        charlotte: true,
        trigger: { player: "die" },
        forced: true,
        popup: false,
        firstDo: true,
        forceDie: true,
        async content(event, trigger, player) {
          player.removeSkill("starcanxi_wangsheng");
          player.removeSkill("starcanxi_xiangsi");
        }
      }
    }
  },
  starpizhi: {
    audio: 2,
    trigger: { player: "phaseEnd", global: "die" },
    filter(event, player) {
      if (event.name === "phase") {
        return player.hasMark("starpizhi");
      }
      if (!game.hasPlayer((current) => current !== event.player && current.group === event.player.group)) {
        return true;
      }
      if (!player.getStorage("starcanxi_wangsheng").includes(event.player.group) && !player.getStorage("starcanxi_xiangsi").includes(event.player.group)) {
        return false;
      }
      const groups = player.getSkills().filter((skill) => skill.indexOf("starcanxi_") === 0).map((group) => group.slice(10));
      return groups.includes(event.player.group);
    },
    forced: true,
    async content(event, trigger, player) {
      if (trigger.name === "die") {
        const skills2 = player.getSkills().filter((skill) => skill.indexOf("starcanxi_") === 0 && skill.slice(10) === trigger.player.group);
        player.removeSkill(skills2);
      }
      await player.draw(player.countMark("starpizhi"));
      if (player.isDamaged() && trigger.name === "die") {
        await player.recover();
      }
    },
    intro: { content: "已失去#个“玺角”" },
    ai: { combo: "starcanxi" }
  },
  starzhonggu: {
    audio: 2,
    trigger: { player: "phaseDrawBegin2" },
    filter(event, player) {
      return !event.numFixed;
    },
    forced: true,
    zhuSkill: true,
    async content(event, trigger, player) {
      const num = game.roundNumber >= game.countPlayer((current) => current.group === "qun") ? 2 : -1;
      trigger.num += num;
    }
  },
  //星曹仁
  starsujun: {
    audio: 2,
    trigger: { player: "useCard" },
    filter(event, player) {
      return player.countCards("h", { type: "basic" }) * 2 === player.countCards("h");
    },
    frequent: true,
    locked: false,
    async content(event, trigger, player) {
      await player.draw(2);
    },
    mod: {
      aiOrder(player, card, num) {
        const delta = player.countCards("h") - 2 * player.countCards("h", { type: "basic" });
        if (Math.abs(delta) !== 1) {
          return;
        }
        if (delta === 1 && get.type(card) !== "basic") {
          return delta + 10;
        }
        if (delta === -1 && get.type(card) === "basic") {
          return delta + 10;
        }
      }
    }
  },
  starlifeng: {
    audio: 2,
    enable: "chooseToUse",
    filter(event, player) {
      if (!event.filterCard(get.autoViewAs({ name: "sha", storage: { starlifeng: true } }, "unsure"), player, event) && !event.filterCard(get.autoViewAs({ name: "wuxie", storage: { starlifeng: true } }, "unsure"), player, event)) {
        return false;
      }
      return player.hasCard((card) => !player.getStorage("starlifeng_count").includes(get.color(card, player)), "hs");
    },
    chooseButton: {
      dialog(event, player) {
        const list = [];
        if (event.filterCard(get.autoViewAs({ name: "sha", storage: { starlifeng: true } }, "unsure"), player, event)) {
          list.push(["基本", "", "sha"]);
        }
        if (event.filterCard(get.autoViewAs({ name: "wuxie", storage: { starlifeng: true } }, "unsure"), player, event)) {
          list.push(["锦囊", "", "wuxie"]);
        }
        const dialog = ui.create.dialog("砺锋", [list, "vcard"]);
        dialog.direct = true;
        return dialog;
      },
      check(button) {
        const player = _status.event.player;
        return _status.event.getParent().type === "phase" ? player.getUseValue({ name: button.link[2] }) : 1;
      },
      backup(links, player) {
        return {
          filterCard(card, player2) {
            return !player2.getStorage("starlifeng_count").includes(get.color(card, player2));
          },
          async precontent(event, trigger, player2) {
            player2.logSkill("starlifeng");
            event.getParent().addCount = false;
          },
          log: false,
          popname: true,
          viewAs: {
            name: links[0][2],
            storage: {
              starlifeng: true
            }
          },
          ai1(card) {
            const player2 = _status.event.player;
            const num = player2.countCards("h") - 2 * player2.countCards("h", { type: "basic" });
            if (player2.hasSkill("starsujin") && Math.abs(num) === 1) {
              if (num === 1 && get.type(card) !== "basic") {
                return 15 - get.value(card);
              }
              if (num === -1 && get.type(card) === "basic") {
                return 15 - get.value(card);
              }
            }
            return 7 - get.value(card);
          }
        };
      },
      prompt(links) {
        return `将一张本回合未使用过的颜色的手牌当做【${get.translation(links[0][2])}】使用`;
      }
    },
    hiddenCard(player, name) {
      if (name === "wuxie") {
        return player.hasCards("hs", (card) => !player.getStorage("starlifeng_count").includes(get.color(card, player)) || _status.connectMode);
      }
    },
    ai: {
      respondSha: true,
      skillTagFilter(player, tag, arg) {
        if (arg === "respond") {
          return false;
        }
        if (!player.hasCards("hs", (card) => !player.getStorage("starlifeng_count").includes(get.color(card, player)) || _status.connectMode)) {
          return false;
        }
      },
      order: 10,
      result: { player: 1 }
    },
    locked: false,
    mod: {
      cardUsable(card, player) {
        if (card?.storage?.starlifeng) {
          return Infinity;
        }
      }
    },
    group: "starlifeng_mark",
    subSkill: {
      mark: {
        charlotte: true,
        trigger: { global: "useCard1" },
        filter(event, player) {
          return !player.getStorage("starlifeng_count").includes(get.color(event.card));
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          player.addTempSkill("starlifeng_count");
          player.markAuto("starlifeng_count", [get.color(trigger.card)]);
        }
      },
      count: {
        charlotte: true,
        onremove: true
      }
    }
  },
  //星孙尚香
  starsaying: {
    audio: 2,
    enable: "chooseToUse",
    hiddenCard(player, name) {
      if (player.getStorage("starsaying").includes(name)) {
        return false;
      }
      if (["shan", "sha"].includes(name)) {
        return player.hasCards("hs", (card) => get.type(card) === "equip" && player.canEquip(card, true));
      }
      if (["tao", "jiu"].includes(name)) {
        return player.hasCards("e");
      }
    },
    filter(event, player) {
      for (const name of ["shan", "sha"]) {
        if (player.getStorage("starsaying").includes(name)) {
          continue;
        }
        if (!player.hasCards("hs", (card) => get.type(card) === "equip" && player.canEquip(card, true))) {
          continue;
        }
        if (event.filterCard({ name, isCard: true }, player, event)) {
          return true;
        }
      }
      for (const name of ["tao", "jiu"]) {
        if (player.getStorage("starsaying").includes(name)) {
          continue;
        }
        if (!player.hasCards("e")) {
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
        const list = [];
        for (const name of ["shan", "sha"]) {
          if (player.getStorage("starsaying").includes(name)) {
            continue;
          }
          if (!player.hasCards("hs", (card) => get.type(card) === "equip" && player.canEquip(card, true))) {
            continue;
          }
          if (event.filterCard({ name, isCard: true }, player, event)) {
            list.push(["基本", "", name]);
          }
        }
        for (const name of ["tao", "jiu"]) {
          if (player.getStorage("starsaying").includes(name)) {
            continue;
          }
          if (!player.hasCards("e")) {
            continue;
          }
          if (event.filterCard({ name, isCard: true }, player, event)) {
            list.push(["基本", "", name]);
          }
        }
        return ui.create.dialog("飒影", [list, "vcard"], "hidden");
      },
      check(button) {
        const player = _status.event.player;
        const card = { name: button.link[2], isCard: true };
        return player.getUseValue(card);
      },
      backup(links, player) {
        return {
          check(card) {
            return 1 / Math.max(0.1, get.value(card));
          },
          filterCard(card) {
            if (["sha", "shan"].includes(links[0][2])) {
              return get.position(card) !== "e" && get.type(card) === "equip" && player.canEquip(card, true);
            }
            return get.position(card) === "e";
          },
          position: "hes",
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            suit: "none",
            number: null,
            isCard: true
          },
          popname: true,
          ignoreMod: true,
          async precontent(event, trigger, player2) {
            player2.logSkill("starsaying");
            const card = event.result.cards[0];
            player2.$give(card, player2, false);
            if (["sha", "shan"].includes(event.result.card.name)) {
              await player2.equip(card);
            } else {
              await player2.gain({ cards: [card], animate: "gain2" });
            }
            const viewAs = {
              name: event.result.card.name,
              nature: event.result.card.nature
            };
            event.result.card = viewAs;
            event.result.cards = [];
            if (!player2.storage.starsaying) {
              player2.when({ global: "roundStart" }).step(async () => {
                delete player2.storage.starsaying;
              });
            }
            player2.markAuto("starsaying", viewAs.name);
          }
        };
      },
      prompt(links, player) {
        const str = ["sha", "shan"].includes(links[0][2]) ? "使用一张装备牌" : "获得装备区里的一张牌";
        return `${str}，视为使用${get.translation(links[0][3] || "")}${get.translation(links[0][2])}`;
      }
    },
    ai: {
      order() {
        const player = _status.event.player;
        const event = _status.event;
        if (event.filterCard({ name: "jiu" }, player, event) && get.effect(player, { name: "jiu" }) > 0) {
          return 6.3;
        }
        return 6.1;
      },
      skillTagFilter(player, tag, arg) {
        const name = tag === "respondSha" ? "sha" : "shan";
        if (player.getStorage("starsaying").includes(name)) {
          return false;
        }
        if (!player.hasCards("hs", (card) => get.type(card) === "equip" && player.canEquip(card, true))) {
          return false;
        }
      },
      result: {
        player: 1
      },
      respondSha: true,
      respondShan: true
    }
  },
  starjiaohao: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h") && game.hasPlayer((current) => lib.skill.starjiaohao.filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return player.canCompare(target) && player.countCards("e") >= target.countCards("e");
    },
    async content(event, trigger, player) {
      const target = event.target;
      const result = await player.chooseToCompare(target).forResult();
      if (result.winner) {
        const cards2 = [result.player, result.target].filterInD("d");
        const result2 = await player.chooseControl("cancel2").set("choiceList", ["令" + get.translation(result.winner) + "获得" + (cards2.length ? get.translation(cards2) : "空气"), "令" + get.translation(result.winner) + "使用一张杀"]).set("ai", function() {
          return _status.event.check;
        }).set(
          "check",
          (function() {
            if (get.attitude(player, result.winner) <= 0) {
              return "cancel2";
            }
            if (!game.hasPlayer((current) => {
              return result.winner.canUse({ name: "sha" }, current, false) && get.effect(current, { name: "sha" }, result.winner, result.winner) > 0;
            }) || !cards2.length) {
              return "选项一";
            }
            let eff1 = result.winner.getUseValue({ name: "sha" }), eff2 = 0;
            for (let card of cards2) {
              eff2 += get.value(card, result.winner);
            }
            if (eff1 > eff2 * 2.5) {
              return "选项二";
            }
            return "选项一";
          })()
        ).forResult();
        switch (result2.control) {
          case "选项二": {
            const next = result.winner.chooseToUse("是否使用一张杀？", { name: "sha" }).set("filterTarget", function(card, player2, target2) {
              return lib.filter.filterTarget.apply(this, arguments);
            }).set("addCount", false);
            await next;
            break;
          }
          case "选项一": {
            await result.winner.gain(cards2, "gain2");
            break;
          }
        }
      }
    },
    ai: {
      order: 5,
      result: {
        target(player, target) {
          var hs = player.getCards("h").sort(function(a, b) {
            return b.number - a.number;
          });
          var ts = target.getCards("h").sort(function(a, b) {
            return b.number - a.number;
          });
          if (!hs.length || !ts.length) {
            return 0;
          }
          if (hs[0].number <= ts[0].number) {
            return 2;
          }
          if (player.countCards("h") >= target.countCards("h")) {
            return -10;
          }
          return -1;
        }
      }
    }
  },
  //十周年嵇康
  dcjuexiang: {
    derivation: "dccanyun",
    audio: "juexiang",
    trigger: { player: "die" },
    forced: true,
    locked: false,
    forceDie: true,
    skillAnimation: true,
    animationColor: "water",
    async content(event, trigger, player) {
      if (trigger.source && trigger.source.isIn()) {
        await trigger.source.discard({ cards: trigger.source.getCards("e") });
        await trigger.source.loseHp();
      }
      const result = await player.chooseTarget({
        prompt: "绝响：是否令一名其他角色获得技能〖残韵〗？",
        filterTarget: lib.filter.notMe,
        ai: (target2) => get.attitude(_status.event.player, target2)
      }).set("forceDie", true).forResult();
      if (!result.bool) {
        return;
      }
      const target = result.targets[0];
      player.line(target, "thunder");
      await target.addSkills("dccanyun");
    }
  },
  dccanyun: {
    enable: "phaseUse",
    filter(event, player) {
      return game.hasPlayer((target) => lib.skill.dccanyun.filterTarget(null, player, target));
    },
    filterTarget(card, player, target) {
      const list = [player];
      player.getAllHistory("useSkill", (evt) => {
        if (evt.skill === "dccanyun") {
          list.addArray(evt.targets);
        }
      });
      return !list.includes(target) && !ui.selected.targets.length;
    },
    selectTarget: [1, 2],
    targetprompt(target) {
      const pe = _status.event.player.countCards("e", (card) => !ui.selected.cards.includes(card));
      const te = target.countCards("e");
      if (pe > te) {
        return "回复体力";
      }
      if (pe === te) {
        return "摸一张牌";
      }
      return "失去体力";
    },
    filterCard: true,
    position: "he",
    check(cardx) {
      const player = _status.event.player;
      const number = game.countPlayer((target) => {
        if (player === target) {
          return false;
        }
        const pe = player.countCards("e", (card) => card !== cardx && !ui.selected.cards.includes(card));
        const te = target.countCards("e");
        if (pe > te && target.isDamaged() && get.attitude(player, target) > 2) {
          return true;
        }
        if (pe < te && get.attitude(player, target) < 0) {
          return true;
        }
        return false;
      });
      if (ui.selected.cards.length < number) {
        return 6 - get.value(cardx);
      }
      return 0;
    },
    usable: 1,
    async content(event, trigger, player) {
      const { target } = event;
      const pe = player.countCards("e");
      const te = target.countCards("e");
      if (pe > te) {
        await target.recover();
        return;
      }
      if (pe === te) {
        await target.draw();
        return;
      }
      await target.loseHp();
    },
    async contentAfter(event, trigger, player) {
      if (player.hp === 1) {
        await player.draw();
      }
    },
    ai: {
      order: 10,
      result: {
        target(player, target) {
          const pe = player.countCards("e");
          const te = target.countCards("e");
          if (pe > te && target.isDamaged()) {
            return 2;
          }
          if (pe === te) {
            return 1;
          }
          if (pe < te) {
            return -2.5;
          }
          return 0;
        }
      }
    }
  },
  //董翓
  dcjiaoxia: {
    mod: {
      cardUsableTarget(card, player, target) {
        if (!player.isPhaseUsing()) {
          return;
        }
        if (card.name === "sha" && !player.getStorage("dcjiaoxia_mark").includes(target)) {
          return true;
        }
      },
      targetInRange(card, player, target) {
        if (!player.isPhaseUsing()) {
          return;
        }
        if (card.name === "sha" && !player.getStorage("dcjiaoxia_mark").includes(target)) {
          return true;
        }
      }
    },
    audio: 2,
    locked: false,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return player.hasCards("h");
    },
    check(event, player) {
      return player.hasCards("h", (card) => {
        return game.hasPlayer((target) => {
          const cardx = get.autoViewAs({ name: "sha" }, [card]);
          return player.canUse(cardx, target) && get.effect(target, cardx, player, player) > 0 && (!player.hasUseTarget(card) || player.hasValueTarget(card));
        });
      });
    },
    async content(event, trigger, player) {
      const cards2 = player.getCards("h");
      player.addTempSkill("dcjiaoxia_viewas", "phaseUseAfter");
      player.addGaintag(cards2, "dcjiaoxia_viewas");
    },
    group: "dcjiaoxia_load",
    subSkill: {
      load: {
        charlotte: true,
        trigger: { player: "useCard1" },
        filter(event, player) {
          if (!player.isPhaseUsing()) {
            return false;
          }
          return event.card.name === "sha" && event.targets && event.targets.some((target) => !player.getStorage("dcjiaoxia_mark").includes(target));
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          if (trigger.addCount !== false) {
            trigger.addCount = false;
            const stat = player.getStat().card;
            const name = trigger.card.name;
            if (typeof stat[name] === "number") {
              stat[name]--;
            }
          }
          player.addTempSkill("dcjiaoxia_mark", "phaseUseAfter");
          player.markAuto(
            "dcjiaoxia_mark",
            trigger.targets.filter((target) => !player.getStorage("dcjiaoxia_mark").includes(target))
          );
        }
      },
      mark: {
        charlotte: true,
        onremove: true
      },
      viewas: {
        mod: {
          aiOrder(player, card, num) {
            if (get.itemtype(card) === "card" && card.hasGaintag("dcjiaoxia_viewas")) {
              return num + 1;
            }
          },
          cardname(card, player) {
            if (get.itemtype(card) === "card" && card.hasGaintag("dcjiaoxia_viewas")) {
              return "sha";
            }
          }
        },
        charlotte: true,
        onremove(player) {
          player.removeGaintag("dcjiaoxia_viewas");
        },
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          return event.cards && event.cards.length === 1 && player.hasUseTarget(get.copy(event.cards[0])) && player.getHistory("lose", (evt) => {
            if ((evt.relatedEvent || evt.getParent()) !== event) {
              return false;
            }
            for (const i in evt.gaintag_map) {
              if (evt.gaintag_map[i].includes("dcjiaoxia_viewas")) {
                return true;
              }
            }
            return false;
          }).length && player.getHistory("sourceDamage", (evt) => evt.card === event.card).length && player.hasUseTarget(event.cards[0]);
        },
        direct: true,
        async content(event, trigger, player) {
          const card = trigger.cards[0];
          await player.chooseUseTarget({
            card,
            prompt: get.prompt("dcjiaoxia"),
            prompt2: `使用${get.translation(card)}`,
            addCount: false,
            logSkill: "dcjiaoxia"
          });
        }
      }
    }
  },
  dchumei: {
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    },
    onChooseToUse(event) {
      if (!game.online && !event.dchumei_num) {
        const player = event.player;
        const evtx = event.getParent("phaseUse");
        event.set(
          "dchumei_num",
          player.getHistory("sourceDamage", (evt) => evt.getParent("phaseUse") === evtx).reduce((sum, evt) => sum + evt.num, 0)
        );
      }
    },
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      if (typeof event.dchumei_num !== "number") {
        return false;
      }
      return game.hasPlayer((target) => lib.skill.dchumei.filterTarget(null, player, target));
    },
    filterTarget(card, player, target) {
      if (target.getHp() > _status.event.dchumei_num) {
        return false;
      }
      const list = player.getStorage("dchumei_used");
      if (!list.includes("draw")) {
        return true;
      }
      if (!list.includes("give") && target.countCards("he")) {
        return true;
      }
      if (!list.includes("recover") && target.isDamaged()) {
        return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      const { target } = event;
      const str = get.translation(target);
      const result = await player.chooseButton({
        createDialog: [
          "狐魅：请选择一项",
          [
            [
              ["draw", `令${str}摸一张牌`],
              ["give", `令${str}交给你一张牌`],
              ["recover", `令${str}回复1点体力`]
            ].filter((list) => {
              if (player.getStorage("dchumei_used").includes(list[0])) {
                return false;
              }
              if (list[0] === "give" && !target.countCards("he")) {
                return false;
              }
              if (list[0] === "recover" && target.isHealthy()) {
                return false;
              }
              return true;
            }),
            "textbutton"
          ]
        ],
        forced: true,
        filterButton: (button) => {
          const { player: player2, target: target2 } = get.event();
          if (player2.getStorage("dchumei_used").includes(button.link)) {
            return false;
          }
          if (button.link === "give" && !target2.countCards("he")) {
            return false;
          }
          if (button.link === "recover" && target2.isHealthy()) {
            return false;
          }
          return true;
        },
        ai: (button) => {
          const current = _status.event.player;
          const target2 = _status.event.target;
          switch (button.link) {
            case "draw": {
              return get.effect(target2, { name: "draw" }, current, current);
            }
            case "give": {
              return get.effect(target2, { name: "shunshou_copy2" }, current, current);
            }
            case "recover": {
              return get.recoverEffect(target2, current, current);
            }
          }
          return 0;
        }
      }).set("target", target).forResult();
      if (!result.bool) {
        return;
      }
      player.addTempSkill("dchumei_used", "phaseUseAfter");
      player.markAuto("dchumei_used", result.links);
      switch (result.links[0]) {
        case "draw": {
          await target.draw();
          return;
        }
        case "recover": {
          await target.recover();
          return;
        }
      }
      const giveResult = await target.chooseCard({
        prompt: `狐魅：交给${get.translation(player)}一张牌`,
        position: "he",
        forced: true
      }).forResult();
      if (!giveResult.bool) {
        return;
      }
      await player.gain({ cards: giveResult.cards, source: target, animate: "giveAuto" });
    },
    ai: {
      order: 1,
      result: {
        target(player, target) {
          const list = player.getStorage("dchumei_used");
          if (!list.includes("draw")) {
            return 1;
          }
          if (!list.includes("give")) {
            return -1;
          }
          if (!list.includes("recover")) {
            return 1;
          }
        }
      }
    }
  },
  //魏关羽
  dcdanji: {
    audio: "danji",
    skillAnimation: true,
    animationColor: "water",
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    juexingji: true,
    derivation: ["mashu", "dcnuchen"],
    filter(event, player) {
      return player.countCards("hej") > player.getHp();
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.loseMaxHp();
      const num = player.maxHp - player.hp;
      if (num) {
        await player.recover(num);
        await player.draw(num);
      }
      await player.addSkills(["mashu", "dcnuchen"]);
    },
    ai: {
      maixie: true,
      skillTagFilter: (player, tag, arg) => {
        if (tag === "maixie") {
          return player.hp >= 2 && !player.storage.dcdanji && !player.hasSkill("dcnuchen") && player.countCards("h") === player.hp;
        }
      },
      effect: {
        target: (card, player, target) => {
          let hs = target.countCards("h");
          if (target.hp < 3 || target.storage.dcdanji || target.hasSkill("dcnuchen") || hs > target.hp + 1) {
            return;
          }
          if (get.tag(card, "draw")) {
            return 1.6;
          }
          if (get.tag(card, "lose") || get.tag(card, "discard")) {
            return [1, -0.8];
          }
          if (hs === target.hp && get.tag(card, "damage")) {
            return [1, target.hp / 3];
          }
          if (hs > target.hp && target.hp > 3 && (card.name === "shan" || card.name === "wuxie")) {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  dcnuchen: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target.hasCards("h") && target !== player;
    },
    async content(event, trigger, player) {
      const { target } = event;
      const result = await player.choosePlayerCard({
        target,
        forced: true,
        position: "h"
      }).forResult();
      if (!result.bool || !result.cards?.length) {
        return;
      }
      const card = result.cards[0];
      await player.showCards(card, `${get.translation(player)}对${get.translation(target)}发动了【怒嗔】`);
      const suit = get.suit(card);
      const str = get.translation(suit);
      const num = (() => {
        const eff = get.damageEffect(target, player, player);
        if (eff <= 0) {
          return 0;
        }
        if (get.attitude(player, target) > 0) {
          return 1;
        }
        const cards3 = target.getCards("h", { suit });
        if (cards3.length > 2 || get.value(cards3) >= 6) {
          return 0;
        }
        if (!player.hasSkillTag("jueqing", false, target) && target.hasSkillTag("filterDamage", null, { player })) {
          return 1;
        }
        return Infinity;
      })();
      const result2 = await player.chooseToDiscard({
        prompt: `怒嗔：是否弃置至少一张${str}牌？`,
        prompt2: `若如此做，你对其造成等量伤害；或点击“取消”，获得其所有${str}手牌`,
        position: "he",
        filterCard: { suit },
        selectCard: [1, Infinity],
        allowChooseAll: true,
        ai: (card2) => {
          if (ui.selected.cards.length >= _status.event.num) {
            return 0;
          }
          return 6 - get.value(card2);
        }
      }).set("num", num).forResult();
      if (result2.bool && result2.cards?.length) {
        await target.damage({ num: result2.cards.length, nocard: true });
        return;
      }
      const cards2 = target.getCards("h", { suit });
      if (cards2.length) {
        await player.gain({ cards: cards2, source: target, animate: "giveAuto", bySelf: true });
      }
    },
    ai: {
      expose: 0.4,
      order: 10,
      result: {
        target(player, target) {
          return -Math.sqrt(target.countCards("h"));
        }
      }
    }
  },
  //孟达
  dclibang: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterCard: true,
    position: "he",
    filter(event, player) {
      return player.hasCard((card) => lib.filter.cardDiscardable(card, player, "dclibang"), "he") && game.countPlayer((current) => current !== player) >= 2;
    },
    filterTarget(card, player, target) {
      return target !== player;
    },
    selectTarget: 2,
    multiline: true,
    multitarget: true,
    async content(event, trigger, player) {
      const { targets } = event;
      event.cardsx = [];
      targets.sortBySeat();
      for (const current of targets) {
        if (!current.hasCards("he")) {
          continue;
        }
        const result = await player.gainPlayerCard({
          target: current,
          position: "he",
          forced: true,
          visibleMove: true
        }).forResult();
        if (result.bool && result.cards?.length) {
          event.cardsx.push(result.cards[0]);
        }
      }
      await player.judge().set("callback", lib.skill.dclibang.contentx);
    },
    async contentx(event, trigger, player) {
      const { card, color } = event.judgeResult;
      const parent = event.getParent(2);
      if (parent.cardsx.some((cardx) => get.color(cardx) === color)) {
        if (get.position(card, true) === "o") {
          await player.gain({
            cards: [card],
            animate: "gain2"
          });
        }
        const targets = parent.targets.filter((target) => player.canUse("sha", target));
        if (!targets.length) {
          return;
        }
        const result2 = await player.chooseTarget({
          prompt: "利傍：视为对其中一名角色使用一张【杀】",
          forced: true,
          filterTarget: (card2, player2, target) => _status.event.targets.includes(target),
          ai: (target) => get.effect(target, { name: "sha" }, player, player)
        }).set("targets", targets).forResult();
        if (result2.bool) {
          await player.useCard({
            card: { name: "sha", isCard: true },
            targets: [result2.targets[0]],
            addCount: false
          });
        }
        return;
      }
      const result = await player.chooseCardTarget({
        filterCard(card2) {
          return get.itemtype(card2) === "card";
        },
        filterTarget(card2, player2, target) {
          return _status.event.targets.includes(target);
        },
        selectCard: 2,
        targets: parent.targets,
        position: "he",
        prompt: "交给其中一名角色两张牌，或失去1点体力",
        ai1(card2) {
          return 1;
        },
        ai2(target) {
          const player2 = _status.event.player;
          const card2 = ui.selected.cards[0];
          const val = get.value(card2, target);
          if (val > 0) {
            return get.attitude(player2, target) * 2;
          }
          return (val - 2) * get.attitude(player2, target);
        }
      }).forResult();
      if (result.bool) {
        await player.give(result.cards, result.targets[0]);
        return;
      }
      await player.loseHp();
    },
    ai: {
      order: 8,
      result: {
        target(player, target) {
          if (get.attitude(player, target) > 0 && ui.selected.targets.length) {
            return 0.1;
          }
          return -1;
        }
      }
    }
  },
  dcwujie: {
    audio: 2,
    trigger: {
      player: "dieBefore"
    },
    forced: true,
    forceDie: true,
    logTarget: "source",
    filter(event, player) {
      return get.mode() == "identity" && event.source?.isIn() && event.source != player;
    },
    async content(event, trigger, player) {
      trigger.set("noDieAfter2", true);
    },
    group: "dcwujie_inf",
    subSkill: {
      inf: {
        trigger: { player: "useCard1" },
        forced: true,
        popup: false,
        firstDo: true,
        filter(event, player) {
          if (get.color(event.card) == "none" && event.addCount !== false) {
            return true;
          }
          return false;
        },
        async content(event, trigger, player) {
          trigger.addCount = false;
          const stat = player.getStat().card;
          const name = trigger.card.name;
          if (typeof stat[name] == "number") {
            stat[name]--;
          }
        }
      }
    },
    mod: {
      targetInRange(card, player) {
        const color = get.color(card);
        if (color === "none" || color === "unsure") {
          return true;
        }
      },
      cardUsable(card) {
        const color = get.color(card);
        if (color === "none" || color === "unsure") {
          return Infinity;
        }
      }
    }
  },
  //关宁
  dcxiuwen: {
    audio: 2,
    trigger: { player: "useCard" },
    filter(event, player) {
      return !player.getStorage("dcxiuwen").includes(event.card.name);
    },
    frequent: true,
    async content(event, trigger, player) {
      player.markAuto("dcxiuwen", [trigger.card.name]);
      await player.draw();
    },
    intro: { content: "已使用：$" }
  },
  oldlongsong: {
    audio: "dclongsong",
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return player.hasCards("h");
    },
    getSkills(target, player, trigger) {
      return target.getSkills(null, false).filter((skill) => {
        const skills2 = game.expandSkills([skill]);
        return skills2.some((skillx) => {
          const info = get.info(skillx);
          if (!info || !info.enable || info.usable && !(info.usable >= 1)) {
            return false;
          }
          if (info.enable !== "phaseUse" && (!Array.isArray(info.enable) || !info.enable.includes("phaseUse"))) {
            return false;
          }
          if (info.viewAs && info.usable && info.usable !== 1) {
            return false;
          }
          if (info.juexingji || info.hiddenSkill || info.charlotte || info.limited || info.dutySkill) {
            return false;
          }
          if ((!info.usable || info.usable > 1) && info.filter) {
            let bool1;
            let bool2;
            let bool3;
            try {
              bool1 = info.filter(trigger, player);
              const num = player.getStat().skill[skillx];
              player.getStat().skill[skillx] = 1;
              bool2 = info.filter(trigger, player);
              if (!num) {
                delete player.getStat().skill[skillx];
              } else {
                player.getStat().skill[skillx] = num;
              }
              bool3 = !(bool1 && !bool2);
            } catch (e) {
              console.trace(e);
            }
            if (!bool1 && !bool2 && get.skillInfoTranslation(skill, player).indexOf("出牌阶段限一次") === -1) {
              return false;
            }
            if ((bool1 || bool2) && bool3) {
              return false;
            }
          }
          return true;
        });
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        filterCard: true,
        selectCard: 1,
        filterTarget(card, player2, target) {
          return player2 !== target;
        },
        ai1(card) {
          return 6 - get.value(card);
        },
        ai2(target) {
          const att = get.attitude(_status.event.player, target);
          const trigger2 = _status.event.getTrigger();
          const player2 = _status.event.player;
          return lib.skill.oldlongsong.getSkills(target, player2, trigger2).length * 3 + att / 3;
        },
        prompt: get.prompt2(event.skill)
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.line(target, "green");
      await player.give(event.cards, target);
      const skills2 = lib.skill.oldlongsong.getSkills(target, player, trigger);
      if (!skills2.length) {
        return;
      }
      if (!event.isMine() && !event.isOnline()) {
        await game.delayx();
      }
      target.disableSkill("oldlongsong_back", skills2);
      target.markAuto("oldlongsong_back", skills2);
      target.addTempSkill("oldlongsong_back", ["phaseUseAfter", "phaseAfter"]);
      const skillNames = skills2.map((skill) => `【${get.translation(skill)}】`).join("、");
      game.log(target, "的技能", `#g${skillNames}`, "失效了");
      for (const skill of skills2) {
        player.addTempSkills(skill, ["phaseUseAfter", "phaseAfter"]);
      }
    },
    ai: { expose: 0.2 },
    subSkill: {
      back: {
        charlotte: true,
        onremove(player, skill) {
          const skills2 = player.getStorage("oldlongsong_back");
          for (const key of skills2) {
            game.log(player, "恢复了技能", `#g【${get.translation(key)}】`);
            delete player.storage[key];
          }
          player.enableSkill(skill);
          player.popup(skills2, "thunder");
        }
      }
    }
  },
  dclongsong: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return player.hasCards("h");
    },
    getSkills(target, skills2) {
      return (target && !skills2 ? target.getSkills(null, false) : skills2).filter((skill) => {
        const description = get.skillInfoTranslation(skill, target);
        if (description.indexOf("当你于出牌阶段") !== -1) {
          return true;
        }
        const expandedSkills = game.expandSkills([skill]);
        return expandedSkills.some((skillx) => {
          const info = get.info(skillx);
          if (!info || !info.enable) {
            return false;
          }
          if (info.enable !== "phaseUse" && info.enable !== "chooseToUse" && (!Array.isArray(info.enable) || !info.enable.includes("phaseUse") && !info.enable.includes("chooseToUse"))) {
            return false;
          }
          if (info.juexingji || info.hiddenSkill || info.charlotte || info.limited || info.dutySkill) {
            return false;
          }
          if (info.ai && info.ai.notemp) {
            return false;
          }
          return true;
        });
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        filterCard: { color: "red" },
        selectCard: 1,
        position: "he",
        filterTarget(card, player2, target) {
          return player2 !== target;
        },
        ai1(card) {
          return 6 - get.value(card);
        },
        ai2(target) {
          const att = get.attitude(_status.event.player, target);
          return lib.skill.dclongsong.getSkills(target).length * 2 + att / 2.5;
        },
        prompt: get.prompt2(event.skill)
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.line(target, "green");
      await player.give(event.cards, target);
      const skills2 = lib.skill.dclongsong.getSkills(target);
      if (!skills2.length) {
        return;
      }
      if (!event.isMine() && !event.isOnline()) {
        await game.delayx();
      }
      target.disableSkill("dclongsong_back", skills2);
      target.markAuto("dclongsong_back", skills2);
      player.addTempSkill("dclongsong_remove", ["phaseUseAfter", "phaseAfter"]);
      player.markAuto("dclongsong_remove", skills2);
      target.addTempSkill("dclongsong_back", ["phaseUseAfter", "phaseAfter"]);
      const skillNames = skills2.map((skill) => `【${get.translation(skill)}】`).join("、");
      game.log(target, "的技能", `#g${skillNames}`, "失效了");
      for (const skill of skills2) {
        player.addTempSkills(skill, ["phaseUseAfter", "phaseAfter"]);
      }
    },
    ai: { expose: 0.2 },
    subSkill: {
      back: {
        charlotte: true,
        onremove(player, skill) {
          const skills2 = player.getStorage("dclongsong_back");
          for (const key of skills2) {
            game.log(player, "恢复了技能", `#g【${get.translation(key)}】`);
          }
          player.enableSkill(skill);
          player.popup(skills2, "thunder");
        }
      },
      remove: {
        trigger: { player: ["useSkill", "logSkillBegin"] },
        forced: true,
        charlotte: true,
        popup: false,
        onremove: true,
        filter(event, player) {
          const skill = get.sourceSkillFor(event);
          return player.getStorage("dclongsong_remove").includes(skill) && !player.getStockSkills(false, true).includes(skill);
        },
        async content(event, trigger, player) {
          const skill = get.sourceSkillFor(trigger);
          await player.removeSkills(skill);
          player.unmarkAuto("dclongsong_remove", [skill]);
        }
      }
    }
  },
  longsong: {
    audio: "dclongsong",
    trigger: { player: "phaseUseBegin" },
    getSkills(skills2, len) {
      skills2 = skills2.filter((skill) => {
        let str = get.skillInfoTranslation(skill, get.event().player);
        if (str.indexOf("当你于出牌阶段外") != -1) {
          return false;
        }
        if (str.indexOf("当你于出牌阶段") != -1) {
          return true;
        }
        let ss = game.expandSkills([skill]);
        if (ss.some((skillx) => {
          let info = get.info(skillx);
          if (!info || !info.enable) {
            return false;
          }
          if (info.enable != "phaseUse" && info.enable != "chooseToUse" && (!Array.isArray(info.enable) || !info.enable.includes("phaseUse") && !info.enable.includes("chooseToUse"))) {
            return false;
          }
          if (info.juexingji || info.hiddenSkill || info.charlotte || info.limited || info.dutySkill) {
            return false;
          }
          if (info.ai && info.ai.notemp) {
            return false;
          }
          return true;
        })) {
          return true;
        }
        return false;
      });
      if (len && !skills2.length) {
        if (!_status.characterlist) {
          game.initCharacterList();
        }
        let allList = _status.characterlist.slice(0);
        allList.randomSort();
        for (const name of allList) {
          const curSkills = lib.character[name][3];
          const filteredSkills = lib.skill.longsong.getSkills(curSkills);
          if (filteredSkills.length > 0) {
            return filteredSkills.randomGets(1);
          }
        }
      }
      return skills2;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        prompt: get.prompt2(event.skill),
        filterTarget(card, player2, target) {
          if (target === player2) {
            return false;
          }
          const skills2 = lib.skill.longsong.getSkills(target.getSkills(null, false)).map((skill) => get.translation(skill));
          if (skills2.length) {
            target.prompt(skills2.join("<br>"));
          }
          return true;
        },
        filterCard: { color: "red" },
        selectCard: [0, 1],
        ai1(card) {
          const ai2 = get.event().ai2;
          if (game.hasPlayer((current) => {
            return ai2(current) > 0;
          })) {
            return -1 - get.value(card);
          }
          return 6 - get.value(card);
        },
        ai2(target) {
          const player2 = get.event().player, att = get.attitude(player2, target);
          if (att > 0 && !target.hasGainableCards(player2, "he")) {
            return 0;
          }
          return lib.skill.longsong.getSkills(target.getSkills(null, false)).length + (att > 0 ? 0 : Math.max(0, get.effect(target, { name: "shunshou_copy2" }, player2, player2)));
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0], cards2 = event.cards, gainableCards = target.getGainableCards(player, "he").filter((card) => get.color(card) == "red");
      if (cards2) {
        await player.give(cards2, target);
      } else {
        if (gainableCards.length) {
          await player.gain(gainableCards.randomGet(), target, "giveAuto", "bySelf");
        } else {
          player.popup("杯具");
          player.chat("无牌可得？！");
          game.log("但是", target, "没有红色牌可被" + get.translation(player) + "获得！");
        }
      }
      let skills2 = lib.skill.longsong.getSkills(target.getSkills(null, false), true);
      if (!event.isMine() && !event.isOnline()) {
        await game.delayx();
      }
      if (!skills2.length) {
        return;
      }
      let skill;
      if (skills2.length == 1) {
        skill = skills2[0];
      } else {
        skill = (await player.chooseControl(skills2).set(
          "choiceList",
          skills2.map((i) => {
            return '<div class="skill">' + (lib.translate[i + "_ab"] || lib.translate[i]) + "</div><div>" + get.skillInfoTranslation(i, player, false) + "</div>";
          })
        ).set("displayIndex", false).set("prompt", "龙诵：请选择你要获得的技能").set("ai", () => {
          var list = _status.event.controls.slice();
          return list.sort((a, b) => {
            return get.skillRank(b, "in") - get.skillRank(a, "in");
          })[0];
        }).forResult()).control;
      }
      player.addTempSkill("dclongsong_remove", ["phaseUseAfter", "phaseAfter"]);
      player.markAuto("dclongsong_remove", [skill]);
      await player.addTempSkills(skill, ["phaseUseAfter", "phaseAfter"]);
    }
  },
  //伏完
  dcmoukui: {
    audio: "moukui",
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return event.card?.name == "sha" && event.isFirstTarget;
    },
    async cost(event, trigger, player) {
      const result = await player.chooseButton([
        get.prompt(event.skill),
        [
          [
            ["draw", "摸一张牌"],
            ["discard", "弃置" + (trigger.targets.length == 1 ? get.translation(trigger.targets[0]) : "一名目标角色") + "的一张牌"]
          ],
          "textbutton"
        ]
      ]).set("filterButton", (button) => {
        const player2 = get.player();
        if (button.link == "discard" && _status.event.getTrigger().targets.every((target) => {
          return !target.hasDiscardableCards(player2, "he");
        })) {
          return false;
        }
        return true;
      }).set("ai", (button) => {
        const player2 = get.player();
        if (button.link == "discard" && _status.event.getTrigger().targets.every((target) => {
          return get.effect(target, { name: "guohe_copy2" }, player2, player2) <= 0;
        })) {
          return 0;
        }
        return 1;
      }).set("selectButton", [1, 2]).forResult();
      event.result = {
        bool: result?.bool,
        cost_data: result?.links
      };
    },
    async content(event, trigger, player) {
      const choices = event.cost_data;
      if (choices.includes("draw")) {
        game.log(player, "选择了", "#y选项一");
        await player.draw();
      }
      if (choices.includes("discard")) {
        game.log(player, "选择了", "#y选项二");
        const targets = trigger.targets.filter((current) => current.hasDiscardableCards(player, "he"));
        if (!targets.length) {
          return;
        }
        const reult = targets.length == 1 ? { bool: true, targets } : await player.chooseTarget("谋溃：弃置一名目标角色的一张牌", true, (card, player2, target) => {
          return get.event().targets?.includes(target);
        }).set("targets", targets).set("ai", (target) => {
          const player2 = get.player();
          return get.effect(target, { name: "guohe_copy2" }, player2, player2);
        }).forResult();
        if (reult?.bool) {
          const target = reult.targets[0];
          await player.discardPlayerCard(target, true, "he").set("boolline", true);
          if (choices.includes("draw")) {
            player.addTempSkill(event.name + "_conseq");
            player.markAuto(event.name + "_conseq", [[trigger.card, target]]);
          }
        }
      }
    },
    subSkill: {
      conseq: {
        charlotte: true,
        onremove: true,
        trigger: { global: ["shaMiss", "useCardToExcluded", "eventNeutralized", "shaCancelled"] },
        filter(event, player) {
          if (!event.card) {
            return false;
          }
          if (!player.getStorage("dcmoukui_conseq").some(([card, target]) => event.card == card && target?.isIn())) {
            return false;
          }
          return true;
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          let list = player.getStorage(event.name).filter(([card, target]) => trigger.card == card);
          player.unmarkAuto(event.name, list);
          if (!player.getStorage(event.name).length) {
            player.removeSkill(event.name);
          }
          list = list.filter(([card, target]) => target?.isIn()).map((item) => item[1]);
          for (const target of list.sortBySeat()) {
            if (!target.isIn()) {
              continue;
            }
            await game.delayx();
            await target.discardPlayerCard(player, true, "he").set("boolline", true);
          }
        }
      }
    }
  },
  //孙桓
  dcniji: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    filter(event, player) {
      return get.type(event.card) !== "equip";
    },
    frequent: true,
    group: "dcniji_discard",
    async content(event, trigger, player) {
      const next = player.draw();
      const evt = trigger.getParent("dcniji_discard");
      if (!evt || evt.player !== player) {
        next.gaintag = ["dcniji"];
      }
      player.addTempSkill("dcniji_clear");
      await next;
    },
    subSkill: {
      clear: {
        charlotte: true,
        onremove(player) {
          player.removeGaintag("dcniji");
        }
      },
      discard: {
        audio: "dcniji",
        trigger: { global: "phaseJieshuBegin" },
        filter(event, player) {
          return player.hasCard((card) => card.hasGaintag("dcniji"), "h");
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          const cards2 = player.getCards("h", (card) => card.hasGaintag("dcniji") && lib.filter.cardDiscardable(card, player, "dcniji"));
          if (cards2.some((card) => player.hasUseTarget(card))) {
            const result = await player.chooseToUse({
              prompt: "是否使用一张“逆击”牌？",
              filterCard(card, player2) {
                if (![card].concat(card.cards || []).some((current) => get.itemtype(current) === "card" && current.hasGaintag("dcniji"))) {
                  return false;
                }
                return lib.filter.filterCard.apply(this, arguments);
              },
              ai1(card) {
                return get.player().getUseValue(card);
              }
            }).forResult();
            if (result.bool) {
              await game.delayex();
            }
          }
          const remainingCards = cards2.filter((card) => get.owner(card) === player && get.position(card) === "h" && lib.filter.cardDiscardable(card, player, "dcniji"));
          if (remainingCards.length) {
            await player.discard({ cards: remainingCards });
          }
        }
      }
    }
  },
  //孙狼
  dctingxian: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    usable: 1,
    filter(event, player) {
      return event.card.name === "sha" && event.getParent()?.triggeredTargets3.length === event.targets.length;
    },
    async content(event, trigger, player) {
      const num = player.countCards("e") + 1;
      await player.draw(num);
      const maxTargets = Math.min(trigger.targets.length, num);
      const result = await player.chooseTarget({
        prompt: `铤险：是否令此杀对其中至多${get.cnNumber(maxTargets)}个目标无效？`,
        selectTarget: [1, maxTargets],
        filterTarget: (card, player2, target) => _status.event.getTrigger().targets.includes(target),
        ai: (target) => 1 - get.effect(target, _status.event.getTrigger().card, _status.event.player, _status.event.player)
      }).forResult();
      if (!result.bool) {
        return;
      }
      player.line(result.targets);
      trigger.getParent()?.excluded.addArray(result.targets);
    }
  },
  dcbenshi: {
    audio: 2,
    forced: true,
    trigger: { player: "useCard1" },
    filter(event, player) {
      if (event.card.name !== "sha") {
        return false;
      }
      const card = event.card;
      const info = get.info(card);
      const select = get.copy(info.selectTarget);
      let range;
      if (select === void 0) {
        if (info.filterTarget === void 0) {
          return false;
        }
        range = [1, 1];
      } else if (typeof select === "number") {
        range = [select, select];
      } else if (get.itemtype(select) === "select") {
        range = select;
      } else if (typeof select === "function") {
        range = select(card, player);
        if (typeof range === "number") {
          range = [range, range];
        }
      }
      game.checkMod(card, player, range, "selectTarget", player);
      return range[1] === -1;
    },
    async content(event, trigger, player) {
    },
    mod: {
      attackRange(player, num) {
        return num + 1;
      },
      selectTarget(card, player, range) {
        if (card.name === "sha") {
          range[0] = -1;
          range[1] = -1;
        }
      }
    }
  },
  //是仪
  dccuichuan: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: true,
    filterCard: true,
    derivation: "dczuojian",
    filter(event, player) {
      return player.hasCards("h");
    },
    async content(event, trigger, player) {
      const { target } = event;
      const num = target.countCards("e");
      const subtypes = [];
      for (let i = 1; i < 7; i++) {
        if (target.hasEmptySlot(i)) {
          subtypes.push(`equip${i}`);
        }
      }
      subtypes.randomSort();
      for (const subtype of subtypes) {
        const card = get.cardPile2((card2) => get.subtype(card2) === subtype, "random");
        if (!card || !target.canUse(card, target)) {
          continue;
        }
        await target.chooseUseTarget({ card, forced: true, nopopup: true });
        break;
      }
      const numx = target.countCards("e");
      if (numx > 0) {
        await player.draw(numx);
      }
      await game.delayx();
      if (target.countCards("e") !== 4 || num === 4) {
        return;
      }
      player.trySkillAnimate("dccuichuan_animate", "dccuichuan_animate", player.checkShow("dccuichuan"));
      await player.changeSkills(["dczuojian"], ["dccuichuan"]);
      target.insertPhase();
      await game.delayx();
    },
    subSkill: {
      animate: {
        audio: "dccuichuan",
        skillAnimation: true,
        animationColor: "wood"
      }
    },
    ai: {
      order: 7,
      result: {
        target(player, target) {
          if (target.countCards("e") === 3) {
            return 2;
          }
          return 1;
        },
        player(player, target) {
          if (target.countCards("e") === 3) {
            return 0.5;
          }
          return target.countCards("e") + 1;
        }
      }
    }
  },
  dczhengxu: {
    audio: 2,
    group: ["dczhengxu_lose", "dczhengxu_damage"],
    subSkill: {
      lose: {
        audio: "dczhengxu",
        trigger: {
          player: "loseAfter",
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        prompt2(event, player) {
          return `当你失去牌后，若你本回合受到过伤害，你可以摸等量的牌（${get.cnNumber(event.getl(player).cards2.length)}张）`;
        },
        check: () => true,
        filter(event, player) {
          if (event.name === "gain" && event.player === player) {
            return false;
          }
          if (!player.getHistory("damage").length || player.hasHistory("useSkill", (evt2) => evt2.skill === "dczhengxu_lose")) {
            return false;
          }
          const evt = event.getl(player);
          return evt && evt.cards2 && evt.cards2.length > 0;
        },
        async content(event, trigger, player) {
          await player.draw(trigger.getl(player).cards2.length);
        },
        ai: {
          effect: {
            target: (card, player, target) => {
              if ((get.tag(card, "lose") || get.tag(card, "discard")) && target.getHistory("damage").length && !target.hasHistory("useSkill", (evt) => evt.skill === "dczhengxu_lose")) {
                return [1, 1];
              }
            }
          }
        }
      },
      damage: {
        audio: "dczhengxu",
        trigger: {
          player: "damageBegin4"
        },
        prompt2: "当你受到伤害时，若你本回合失去过牌，你可以防止之",
        check: () => true,
        filter(event, player) {
          return player.hasHistory("lose", (evt) => evt.cards2 && evt.cards2.length) && !player.hasHistory("useSkill", (evt) => evt.skill === "dczhengxu_damage");
        },
        async content(event, trigger, player) {
          trigger.cancel();
        },
        ai: {
          effect: {
            target: (card, player, target) => {
              if (player.hasSkillTag("jueqing", false, target) || !get.tag(card, "damage")) {
                return;
              }
              if (target.hasHistory("useSkill", (evt) => evt.skill === "dczhengxu_damage") || !target.hasHistory("lose", (evt) => evt.cards2 && evt.cards2.length)) {
                return;
              }
              if (get.attitude(player, target) >= 0) {
                return "zeroplayertarget";
              }
              let num = 0;
              let shas = player.getCardUsable("sha");
              const hs = player.getCards("hs", (i) => {
                if (i === card || card.cards && card.cards.includes(i) || !get.tag(i, "damage") || !player.canUse(i, target)) {
                  return false;
                }
                if (get.name(i) === "sha") {
                  num++;
                  return false;
                }
                return true;
              });
              if (card.name === "sha") {
                shas--;
              }
              num = Math.min(num, shas);
              num += hs.length;
              if (!num) {
                return "zeroplayertarget";
              }
              num = 1 - 2 / 3 / num;
              return [num, 0, num, 0];
            }
          }
        }
      }
    }
  },
  dczuojian: {
    audio: 2,
    trigger: { player: "phaseUseEnd" },
    filter(event, player) {
      return player.getHistory("useCard", (evt) => {
        const phaseUseEvent = evt.getParent("phaseUse");
        return phaseUseEvent === event;
      }).length >= player.hp;
    },
    async cost(event, trigger, player) {
      const choices = [];
      const choiceList = ["令装备区牌数多于你的角色各摸一张牌", "令装备区牌数少于你的角色各弃置一张手牌"];
      const num = player.countCards("e");
      const drawTargets = [];
      const discardTargets = [];
      let drawEffect = 0;
      let discardEffect = 0;
      for (const target of game.filterPlayer()) {
        if (target.countCards("e") > num) {
          drawTargets.push(target);
          drawEffect += get.attitude(player, target);
        }
        if (target.countCards("e") < num) {
          discardTargets.push(target);
          discardEffect -= get.attitude(player, target);
        }
      }
      if (drawTargets.length) {
        choices.push("选项一");
        choiceList[0] += `（${get.translation(drawTargets)}）`;
      } else {
        choiceList[0] = `<span style="opacity:0.5; ">${choiceList[0]}</span>`;
      }
      if (discardTargets.length) {
        choices.push("选项二");
        choiceList[1] += `（${get.translation(discardTargets)}）`;
      } else {
        choiceList[1] = `<span style="opacity:0.5; ">${choiceList[1]}</span>`;
      }
      if (!choices.length) {
        event.result = { bool: false };
        return;
      }
      const result = await player.chooseControl({
        controls: [...choices, "cancel2"],
        prompt: get.prompt("dczuojian"),
        choiceList,
        ai: () => {
          const controls = _status.event.controls;
          const choice = _status.event.choice;
          if (!controls.includes("选项一") || controls.includes("选项二") && choice === 1) {
            return "选项二";
          }
          return "选项一";
        }
      }).set("choice", drawEffect <= 0 && discardEffect <= 0 ? "cancel2" : drawEffect > -discardEffect ? 0 : 1).forResult();
      const targets = result.control === "选项一" ? drawTargets : result.control === "选项二" ? discardTargets : [];
      event.result = {
        bool: targets.length > 0,
        targets,
        cost_data: result.control
      };
    },
    async content(event, trigger, player) {
      if (event.cost_data === "选项一") {
        await game.asyncDraw(event.targets, 1);
      } else {
        for (const target of event.targets) {
          await player.discardPlayerCard({
            target,
            position: "h",
            forced: true
          });
        }
      }
    }
  },
  //胡金定
  dcdeshi: {
    audio: 2,
    trigger: { player: "damageBegin4" },
    forced: true,
    filter(event, player) {
      return player.isDamaged() && event.card && event.card.name === "sha";
    },
    async content(event, trigger, player) {
      trigger.cancel();
      for (const func of ["discardPile", "cardPile2"]) {
        const card = get[func]((card2) => card2.name === "sha");
        if (card) {
          await player.gain({
            cards: [card],
            animate: "gain2"
          });
          break;
        }
      }
      await player.loseMaxHp();
    },
    ai: {
      halfneg: true,
      filterDamage: true,
      skillTagFilter(player, tag, arg) {
        return arg?.card?.name === "sha";
      }
    }
  },
  dcwuyuan: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hasCards("h", "sha");
    },
    filterCard: { name: "sha" },
    filterTarget: lib.filter.notMe,
    check(card) {
      const player = _status.event.player;
      if (get.color(card) === "red" && game.hasPlayer((current) => current !== player && current.isDamaged() && get.attitude(player, current) > 2)) {
        return 2;
      }
      if (get.natureList(card).length) {
        return 1.5;
      }
      return 1;
    },
    discard: false,
    lose: false,
    delay: false,
    async content(event, trigger, player) {
      const cards2 = event.cards;
      const target = event.target;
      await player.give(cards2, target, true);
      await player.recover();
      let num = 1;
      if (get.natureList(cards2[0]).length) {
        num++;
      }
      await player.draw({ nodelay: true });
      await target.draw(num);
      if (get.color(cards2[0]) === "red") {
        await target.recover();
      }
    },
    ai: {
      order: 1,
      result: {
        player(player, target) {
          return player.isDamaged() ? 1 : 0;
        },
        target(player, target) {
          if (!ui.selected.cards.length) {
            return 1;
          }
          let num = 1;
          if (get.natureList(ui.selected.cards[0]).length) {
            num++;
          }
          if (target.hasSkillTag("nogain")) {
            num = 0;
          }
          if (get.color(ui.selected.cards[0]) === "red") {
            return num + 2;
          }
          return num + 1;
        }
      }
    }
  },
  //李异谢旌
  dcdouzhen: {
    audio: 2,
    trigger: {
      player: ["useCard", "respond"]
    },
    forced: true,
    zhuanhuanji: "number",
    mark: true,
    marktext: "☯",
    intro: {
      content(storage, player) {
        let str = `<li>已转换过${get.cnNumber(storage || 0)}次。<li>你的回合内，`;
        str += player.countMark("dcdouzhen") % 2 ? "你的红色基本牌均视为普【杀】且无次数限制。" : "你的黑色基本牌均视为【决斗】且使用时获得目标的一张牌。";
        return str;
      }
    },
    filter(event, player) {
      if (player !== _status.currentPhase || !event.card.isCard || !event.cards || event.cards.length !== 1 || get.type(event.cards[0]) !== "basic") {
        return false;
      }
      if (player.countMark("dcdouzhen") % 2) {
        return get.color(event.cards[0]) === "red" && event.card.name === "sha";
      }
      return event.name !== "respond" && get.color(event.cards[0]) === "black" && event.card.name === "juedou";
    },
    async content(event, trigger, player) {
      if (player.countMark("dcdouzhen") % 2) {
        if (trigger.addCount !== false) {
          trigger.addCount = false;
          const stat = player.getStat().card;
          const name = trigger.card.name;
          if (stat[name] > 0) {
            stat[name]--;
          }
        }
        player.changeZhuanhuanji("dcdouzhen");
        return;
      }
      if (trigger.targets.some((target) => target.hasGainableCards(player, "he"))) {
        await player.gainMultiple(trigger.targets.sortBySeat(), "he");
      }
      player.changeZhuanhuanji("dcdouzhen");
    },
    ai: {
      effect: {
        player_use(card, player, target) {
          if (card.name !== "juedou") {
            return;
          }
          if (player.hasSkillTag(
            "directHit_ai",
            true,
            {
              target,
              card
            },
            true
          )) {
            return [1, 1];
          }
          const hs1 = target.getCards("h", "sha");
          const hs2 = player.getCards("h", (card2) => get.color(card2) === "red" && get.type(card2) === "basic" || get.name(card2) === "sha");
          const hsx = target.getCards("h");
          if (hs1.length > hs2.length + 1 || hsx.length > 2 && hs2.length === 0 && hsx[0].number < 6 || hsx.length > 3 && hs2.length === 0 || hs1.length > hs2.length && (!hs2.length || hs1[0].number > hs2[0].number)) {
            return [1, -2];
          }
          return [1, -0.5];
        }
      }
    },
    mod: {
      cardname(card, player) {
        if (get.type(card, null, false) !== "basic" || player !== _status.currentPhase) {
          return;
        }
        if (player.countMark("dcdouzhen") % 2) {
          if (get.color(card) === "red") {
            return "sha";
          }
          return;
        }
        if (get.color(card) === "black") {
          return "juedou";
        }
      },
      cardnature(card, player) {
        if (get.type(card, null, false) !== "basic" || player !== _status.currentPhase) {
          return;
        }
        if (player.countMark("dcdouzhen") % 2 && get.color(card) === "red") {
          return false;
        }
      },
      cardUsable(card, player) {
        if (_status.currentPhase === player && card.name === "sha" && player.countMark("dcdouzhen") % 2 && get.color(card) === "red" && card.isCard) {
          return Infinity;
        }
      }
    }
  },
  //穆顺
  dcjinjian: {
    audio: 2,
    trigger: {
      player: "damageEnd",
      source: "damageSource"
    },
    forced: true,
    locked: false,
    filter(event, player, name) {
      return name === "damageSource" || event.source && event.source !== player && event.source.isIn();
    },
    async content(event, trigger, player) {
      player.addMark("dcjinjian", 1);
      await game.delayx();
      const source = trigger.source;
      if (!source || source === player || !source.isIn() || !player.canCompare(source)) {
        return;
      }
      const goon = (player.countCards("h") === 1 || player.hasCard((card) => get.value(card) <= 5 || get.number(card) > 10)) && (get.attitude(player, source) <= 0 || source.countCards("h") >= 4);
      const result = await player.chooseBool({
        prompt: `是否和${get.translation(source)}拼点？`,
        prompt2: "若你赢，则你恢复1点体力",
        ai: () => _status.event.goon
      }).set("goon", goon).forResult();
      if (!result.bool) {
        return;
      }
      player.line(source, "green");
      const result2 = await player.chooseToCompare(source).forResult();
      if (result2.bool) {
        await player.recover();
      }
    },
    intro: {
      name2: "劲",
      content: "mark"
    },
    mod: {
      attackRange(player, num) {
        return num + player.countMark("dcjinjian");
      }
    }
  },
  dcshizhao: {
    audio: 2,
    usable: 1,
    trigger: {
      player: ["loseAfter"],
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    forced: true,
    filter(event, player) {
      return player !== _status.currentPhase && !player.hasCards("h") && event.getl(player).hs.length > 0;
    },
    async content(event, trigger, player) {
      if (!player.hasMark("dcjinjian")) {
        player.addTempSkill("dcshizhao_effect");
        player.addMark("dcshizhao_effect", 1, false);
        await game.delayx();
        return;
      }
      player.removeMark("dcjinjian", 1);
      await player.draw(2);
    },
    subSkill: {
      effect: {
        audio: "dcshizhao",
        charlotte: true,
        onremove: true,
        trigger: { player: "damageBegin1" },
        forced: true,
        async content(event, trigger, player) {
          trigger.num += player.countMark(event.name);
          player.removeSkill(event.name);
        }
      }
    },
    ai: {
      combo: "dcjinjian",
      halfneg: true
    }
  },
  //赵俨
  dcfuning: {
    audio: 2,
    trigger: { player: "useCard" },
    prompt2(event, player) {
      const num = 1 + player.getHistory("useSkill", (evt) => evt.skill === "dcfuning").length;
      return `摸两张牌，然后弃置${get.cnNumber(num)}张牌`;
    },
    check(event, player) {
      return player.getHistory("useSkill", (evt) => evt.skill === "dcfuning").length < 2;
    },
    async content(event, trigger, player) {
      await player.draw(2);
      const num = player.getHistory("useSkill", (evt) => evt.skill === "dcfuning").length;
      await player.chooseToDiscard({ position: "he", forced: true, selectCard: num });
    }
  },
  dcbingji: {
    mod: {
      cardUsable(card, player, num) {
        if (card.storage?.dcbingji) {
          return Infinity;
        }
      },
      cardEnabled(card, player) {
        if (card.storage?.dcbingji) {
          return true;
        }
      }
    },
    locked: false,
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      const hs = player.getCards("h");
      const suits = player.getStorage("dcbingji_used");
      if (!hs.length) {
        return false;
      }
      const suit = get.suit(hs[0], player);
      if (suit === "none" || suits.includes(suit)) {
        return false;
      }
      for (const card of hs.slice(1)) {
        if (get.suit(card, player) !== suit) {
          return false;
        }
      }
      return true;
    },
    ai: {
      order: 10,
      result: { player: 1 }
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("秉纪", [["sha", "tao"], "vcard"], "hidden");
      },
      filter(button, player) {
        return lib.filter.cardEnabled(
          {
            name: button.link[2],
            isCard: true,
            storage: { dcbingji: true }
          },
          player,
          "forceEnable"
        );
      },
      check(button) {
        const card = {
          name: button.link[2],
          isCard: true,
          storage: { dcbingji: true }
        };
        const player = _status.event.player;
        const targets = game.filterPlayer((target) => {
          if (player === target) {
            return false;
          }
          return lib.filter.targetEnabled2(card, player, target) && lib.filter.targetInRange(card, player, target);
        });
        return Math.max(...targets.map((target) => get.effect(target, card, player, player)));
      },
      backup(links, player) {
        return {
          viewAs: {
            name: links[0][2],
            isCard: true,
            storage: { dcbingji: true }
          },
          filterCard: () => false,
          selectCard: -1,
          filterTarget(card, player2, target) {
            if (!card) {
              card = get.card();
            }
            if (player2 === target) {
              return false;
            }
            return lib.filter.targetEnabled2(card, player2, target) && lib.filter.targetInRange(card, player2, target);
          },
          selectTarget: 1,
          ignoreMod: true,
          filterOk: () => true,
          log: false,
          async precontent(event, trigger, player2) {
            player2.logSkill("dcbingji");
            const hs = player2.getCards("h");
            event.getParent().addCount = false;
            await player2.showCards(hs, `${get.translation(player2)}发动了【秉纪】`);
            player2.markAuto("dcbingji_used", [get.suit(hs[0], player2)]);
            player2.addTempSkill("dcbingji_used");
          }
        };
      },
      prompt(links, player) {
        return `请选择【${get.translation(links[0][2])}】的目标`;
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  //王威
  dcruizhan: {
    audio: 2,
    trigger: { global: "phaseZhunbeiBegin" },
    filter(event, player) {
      return player !== event.player && event.player.countCards("h") >= Math.max(1, event.player.hp) && player.canCompare(event.player);
    },
    logTarget: "player",
    check(event, player) {
      const goon = player.hasCard((card) => card.name === "sha" || get.value(card) <= 5);
      const target = event.player;
      if (goon && get.attitude(player, target) < 0) {
        return get.effect(target, { name: "sha" }, player, player) > 0;
      }
      return 0;
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      const result = await player.chooseToCompare(target, (card) => {
        if (typeof card === "string" && lib.skill[card]) {
          const ais = lib.skill[card].check || (() => 0);
          return ais();
        }
        const owner = get.owner(card);
        const getn = (card2) => {
          if (owner.hasSkill("tianbian") && get.suit(card2) === "heart") {
            return 13;
          }
          return get.number(card2);
        };
        const compareEvent = _status.event.getParent();
        let addi = get.value(card) >= 8 && get.type(card) !== "equip" ? -6 : 0;
        if (card.name === "du") {
          addi -= 5;
        }
        if (owner === compareEvent.player) {
          if (get.name(card, owner) === "sha") {
            return 10 + getn(card);
          }
          return getn(card) - get.value(card) / 2 + addi;
        }
        if (get.name(card, owner) === "sha") {
          return -10 - getn(card) - get.value(card) / 2 + addi;
        }
        return getn(card) - get.value(card) / 2 + addi;
      }).forResult();
      const compareWon = result.bool;
      const revealedSha = get.name(result.player, player) === "sha" || get.name(result.target, target) === "sha";
      if (!compareWon && !revealedSha || !player.canUse("sha", target, false)) {
        return;
      }
      await player.useCard({
        card: { name: "sha", isCard: true },
        targets: [target],
        addCount: false
      });
      if (!compareWon || !revealedSha || !target.hasCard((card) => lib.filter.canBeGained(card, player, target), "he")) {
        return;
      }
      const dealtDamage = player.hasHistory("sourceDamage", (evt) => {
        const useEvent = evt.getParent("useCard");
        return useEvent && useEvent.card === evt.card && useEvent.getParent() === event;
      });
      if (dealtDamage) {
        await player.gainPlayerCard({
          target,
          forced: true,
          position: "he"
        });
      }
    }
  },
  dcshilie: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog(
          "示烈：请选择一项",
          [
            [
              ["recover", "回复1点体力，将两张牌置于武将牌上作为“示烈”"],
              ["losehp", "失去1点体力，获得两张“示烈”牌"]
            ],
            "textbutton"
          ],
          "hidden"
        );
      },
      check(button) {
        return button.link === "recover" ? 1 : 0;
      },
      backup(links, player) {
        return get.copy(lib.skill[`dcshilie_${links[0]}`]);
      },
      prompt: () => "点击“确定”以执行选项"
    },
    intro: {
      markcount: "expansion",
      content: "expansion"
    },
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile({ cards: cards2 });
      }
    },
    group: "dcshilie_die",
    ai: {
      order: 0.5,
      result: {
        player(player) {
          if (player.isDamaged() && !player.countCards("h", "tao")) {
            return 1;
          }
          return 0;
        }
      }
    },
    subSkill: {
      backup: {},
      recover: {
        audio: "dcshilie",
        selectCard: -1,
        selectTarget: -1,
        filterCard: () => false,
        filterTarget: () => false,
        multitarget: true,
        async content(event, trigger, player) {
          await player.recover();
          const hs = player.getCards("he");
          if (!hs.length) {
            return;
          }
          let cards2 = hs;
          if (hs.length > 2) {
            const result = await player.chooseCard({
              position: "he",
              selectCard: 2,
              forced: true,
              prompt: "选择两张牌作为“示烈”牌"
            }).forResult();
            if (!result.bool) {
              return;
            }
            cards2 = result.cards;
          }
          await player.addToExpansion({
            cards: cards2,
            source: player,
            animate: "give",
            gaintag: ["dcshilie"]
          });
          const expansions = player.getExpansions("dcshilie");
          const count = game.countPlayer();
          if (expansions.length > count) {
            await player.loseToDiscardpile({ cards: expansions.slice(count) });
          }
        }
      },
      losehp: {
        audio: "dcshilie",
        selectCard: -1,
        selectTarget: -1,
        filterCard: () => false,
        filterTarget: () => false,
        multitarget: true,
        async content(event, trigger, player) {
          await player.loseHp();
          const hs = player.getExpansions("dcshilie");
          if (!hs.length) {
            return;
          }
          let cards2 = hs;
          if (hs.length > 2) {
            const result = await player.chooseButton({
              createDialog: ["选择获得两张“示烈”牌", hs],
              selectButton: 2,
              forced: true
            }).forResult();
            if (!result.bool) {
              return;
            }
            cards2 = result.links;
          }
          await player.gain({ cards: cards2, animate: "gain2" });
        }
      },
      die: {
        audio: "dcshilie",
        forceDie: true,
        trigger: { player: "die" },
        filter(event, player) {
          return player.getExpansions("dcshilie").length > 0;
        },
        direct: true,
        skillAnimation: true,
        animationColor: "metal",
        async content(event, trigger, player) {
          const result = await player.chooseTarget({
            prompt: get.prompt("dcshilie"),
            prompt2: "令一名角色获得你的“示烈”牌",
            filterTarget: (card, player2, target2) => target2 !== player2 && target2 !== _status.event.getTrigger().source
          }).forResult();
          if (!result.bool) {
            return;
          }
          const target = result.targets[0];
          player.logSkill("dcshilie_die", target);
          await player.give(player.getExpansions("dcshilie"), target, "give");
        }
      }
    }
  },
  //胡班
  dcchongyi: {
    audio: 2,
    init: () => {
      game.addGlobalSkill("dcchongyi_ai");
    },
    onremove: () => {
      if (!game.hasPlayer((i) => i.hasSkill("dcchongyi", null, null, false), true)) {
        game.removeGlobalSkill("dcchongyi_ai");
      }
    },
    trigger: { global: "useCard" },
    logTarget: "player",
    filter(event, player) {
      if (event.card.name !== "sha" || !event.player.isIn()) {
        return false;
      }
      const evt = event.getParent("phaseUse");
      if (!evt || evt.player !== event.player) {
        return false;
      }
      const firstUse = event.player.getHistory("useCard").find((evtx) => evtx.getParent("phaseUse") === evt);
      return firstUse === event;
    },
    prompt2: (event) => "令其摸两张牌，且使用【杀】的次数上限+1",
    check(event, player) {
      return get.attitude(player, event.player) > 0;
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      await target.draw(2);
      target.addMark("dcchongyi_sha", 1, false);
      target.addTempSkill("dcchongyi_sha");
    },
    group: "dcchongyi_end",
    subSkill: {
      ai: {
        mod: {
          aiOrder(player, card, num) {
            if (card.name !== "sha") {
              return;
            }
            const evt = _status.event.getParent("phaseUse");
            if (!evt || evt.player !== player) {
              return;
            }
            if (player.hasHistory("useCard", (evtx) => evtx.getParent("phaseUse") === evt)) {
              return;
            }
            if (game.hasPlayer((current) => current.hasSkill("dcchongyi") && get.attitude(player, current) >= 0)) {
              return num + 10;
            }
          }
        },
        trigger: { player: "dieAfter" },
        filter: () => !game.hasPlayer((i) => i.hasSkill("dcchongyi", null, null, false), true),
        silent: true,
        forceDie: true,
        content: async () => {
          game.removeGlobalSkill("dcchongyi_ai");
        }
      },
      end: {
        audio: "dcchongyi",
        trigger: { global: "phaseUseEnd" },
        logTarget: "player",
        filter(event, player) {
          if (!event.player.isIn()) {
            return false;
          }
          const history = event.player.getHistory("useCard", (evt) => evt.getParent("phaseUse") === event);
          return history.length && history[history.length - 1].card.name === "sha";
        },
        prompt2(event, player) {
          const target = event.player;
          const history = target.getHistory("useCard", (evt2) => evt2.getParent("phaseUse") === event);
          const evt = history.lastItem;
          const cards2 = evt.cards.filterInD("d");
          let str = `令${get.translation(target)}本回合的手牌上限+1`;
          if (cards2.length) {
            str += `，然后你获得${get.translation(cards2)}`;
          }
          str += "。";
          return str;
        },
        check(event, player) {
          return get.attitude(player, event.player) > 0;
        },
        async content(event, trigger, player) {
          const target = trigger.player;
          target.addMark("dcchongyi_keep", 1, false);
          target.addTempSkill("dcchongyi_keep");
          const history = target.getHistory("useCard", (evt2) => evt2.getParent("phaseUse") === trigger);
          const evt = history.lastItem;
          const cards2 = evt.cards.filterInD("d");
          if (!cards2.length) {
            await game.delayx();
            return;
          }
          await player.gain({ cards: cards2, animate: "gain2" });
        }
      },
      sha: {
        charlotte: true,
        mod: {
          cardUsable(card, player, num) {
            if (card.name === "sha") {
              return num + player.countMark("dcchongyi_sha");
            }
          }
        },
        onremove: true,
        intro: { content: "使用【杀】的次数上限+#" }
      },
      keep: {
        charlotte: true,
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("dcchongyi_keep");
          }
        },
        onremove: true,
        intro: { content: "手牌上限+#" }
      }
    }
  },
  //牛辅
  dcxiaoxi: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    forced: true,
    filter(event, player) {
      return player.maxHp > 1;
    },
    async content(event, trigger, player) {
      let index = 0;
      if (player.maxHp > 2) {
        const controlResult = await player.chooseControl({
          controls: ["1点", "2点"],
          prompt: "宵袭：减少1或2点体力上限",
          ai: () => {
            if (!game.hasPlayer((current) => {
              if (!player.inRange(current) || get.attitude(player, current) >= 0) {
                return false;
              }
              if (get.effect(current, { name: "shunshou_copy2" }, player, player) > 0 && current.countCards("h") + current.countCards("e", (card) => get.value(card, current) > 0) > 1) {
                return true;
              }
              if (get.effect(current, { name: "sha" }, player, player) > 0 && current.countCards("hs", "shan") + current.hp > 1) {
                return true;
              }
            })) {
              return 0;
            }
            return 1;
          }
        }).forResult();
        index = controlResult.index;
      }
      const num = 1 + index;
      await player.loseMaxHp(num);
      if (!game.hasPlayer((current) => player.inRange(current))) {
        return;
      }
      const targetResult = await player.chooseTarget({
        prompt: "请选择【宵袭】的目标",
        prompt2: `然后你选择一项：⒈获得该角色的${get.cnNumber(num)}张牌。⒉视为对其使用${get.cnNumber(num)}张【杀】。`,
        filterTarget: (_card, player2, target2) => player2.inRange(target2),
        forced: true,
        ai: (target2) => {
          if (get.attitude(player, target2) >= 0) {
            return 0;
          }
          let gainEffect = get.effect(target2, { name: "shunshou_copy2" }, player, player);
          if (gainEffect > 0 && target2.countCards("h") + target2.countCards("e", (card) => get.value(card, target2) > 0) > 1) {
            gainEffect *= 1.6;
          }
          let damageEffect = player.canUse("sha", target2) ? get.effect(target2, { name: "sha" }, player, player) : 0;
          if (damageEffect > 0 && target2.countCards("hs", "shan") + target2.hp > 1) {
            damageEffect *= 2;
          }
          return Math.max(gainEffect, damageEffect);
        }
      }).forResult();
      const target = targetResult.targets[0];
      player.line(target, "green");
      const canGain = target.countGainableCards(player, "he") > 0;
      const canUseSha = player.canUse("sha", target);
      if (!canGain && !canUseSha) {
        return;
      }
      let choiceIndex = canGain ? 0 : 1;
      if (canGain && canUseSha) {
        const targetName = get.translation(target);
        const countText = get.cnNumber(num);
        const choiceResult = await player.chooseControl({
          choiceList: [`获得${targetName}的${countText}张牌`, `视为对${targetName}使用${countText}张【杀】`],
          ai: () => {
            let gainEffect = get.effect(target, { name: "shunshou_copy2" }, player, player);
            if (gainEffect > 0 && target.countCards("h") + target.countCards("e", (card) => get.value(card, target) > 0) > 1) {
              gainEffect *= 1.6;
            }
            let damageEffect = player.canUse("sha", target) ? get.effect(target, { name: "sha" }, player, player) : 0;
            if (damageEffect > 0 && target.countCards("hs", "shan") + target.hp > 1) {
              damageEffect *= 2;
            }
            return gainEffect > damageEffect ? 0 : 1;
          }
        }).forResult();
        choiceIndex = choiceResult.index;
      }
      if (choiceIndex === 0) {
        await player.gainPlayerCard({
          target,
          forced: true,
          selectButton: num,
          position: "he"
        });
        return;
      }
      for (let i = 0; i < num; i++) {
        if (!player.canUse("sha", target, false)) {
          break;
        }
        await player.useCard({
          card: { name: "sha", isCard: true },
          targets: [target],
          addCount: false
        });
      }
    },
    ai: {
      neg: true
    }
  },
  xiongrao: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    limited: true,
    skillAnimation: true,
    animationColor: "soil",
    prompt(event, player) {
      return `是否发动【熊扰】？（可摸${get.cnNumber(Math.max(0, 7 - player.maxHp))}张牌）`;
    },
    logTarget: (event, player) => game.filterPlayer((current) => current !== player),
    check(event, player) {
      return player.maxHp <= 3;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      game.countPlayer((current) => {
        if (current !== player) {
          current.addTempSkill("xiongrao_blocker");
        }
      });
      const num = 7 - player.maxHp;
      if (num > 0) {
        await player.gainMaxHp(num);
        await player.draw(num);
      }
    },
    subSkill: {
      blocker: {
        init(player, skill) {
          player.addSkillBlocker(skill);
        },
        onremove(player, skill) {
          player.removeSkillBlocker(skill);
        },
        charlotte: true,
        locked: true,
        skillBlocker(skill, player) {
          const info = get.info(skill);
          return info && !info.charlotte && !info.persevereSkill && !get.is.locked(skill) && !info.limited && !info.juexingji;
        },
        mark: true,
        marktext: "扰",
        intro: {
          content(list, player, skill) {
            const storage = player.getSkills(null, false, false).filter((i) => lib.skill.xiongrao_blocker.skillBlocker(i, player));
            if (storage.length) {
              return `失效技能：${get.translation(storage)}`;
            }
            return "无失效技能";
          }
        }
      }
    }
  },
  //卞喜
  dunxi: {
    audio: 2,
    trigger: { player: "useCard" },
    filter(event, player) {
      if (!get.tag(event.card, "damage")) {
        return false;
      }
      return event.targets.some((target) => target !== player && target.isIn());
    },
    async cost(event, trigger, player) {
      const targets = trigger.targets.filter((current) => current !== player && current.isIn());
      if (targets.length === 1) {
        const target = targets[0];
        const result = await player.chooseBool({
          prompt: get.prompt(event.skill, target),
          prompt2: `令${get.translation(target)}获得一枚“钝”标记`,
          ai: () => _status.event.goon
        }).set("goon", get.attitude(player, target) < 0).forResult();
        event.result = {
          bool: result.bool,
          targets: [target]
        };
      } else {
        event.result = await player.chooseTarget({
          prompt: get.prompt(event.skill),
          prompt2: "选择一名目标角色获得一枚“钝”标记",
          filterTarget: (card, player2, target) => target !== player2 && _status.event.getTrigger().targets.includes(target),
          ai: (target) => {
            const att = get.attitude(_status.event.player, target);
            if (att >= 0) {
              return 0;
            }
            return -att / (1 + target.hasMark("dunxi"));
          }
        }).forResult();
      }
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      target.addMark("dunxi", 1);
      await game.delayx();
    },
    intro: { content: "mark", name2: "钝" },
    group: "dunxi_random",
    subSkill: {
      random: {
        audio: "dunxi",
        trigger: { global: "useCard" },
        forced: true,
        locked: false,
        filter(event, player) {
          if (!event.player.hasMark("dunxi") || event.targets.length !== 1 || event._dunxi || _status.dying.length) {
            return false;
          }
          const type = get.type2(event.card, false);
          return type === "basic" || type === "trick";
        },
        logTarget: "player",
        line: "fire",
        async content(event, trigger, player) {
          trigger._dunxi = true;
          trigger.player.removeMark("dunxi", 1);
          const target = trigger.targets[0];
          trigger.targets.remove(target);
          await game.delayx();
          const filter = get.type(trigger.card) !== "delay" ? (current) => lib.filter.targetEnabled2(trigger.card, trigger.player, current) : (current) => lib.filter.judge(trigger.card, trigger.player, current);
          const list = game.filterPlayer(filter);
          if (!list.length) {
            return;
          }
          const targetx = list.randomGet();
          trigger.targets.push(targetx);
          trigger.player.line(targetx, "fire");
          game.log(trigger.card, "的目标被改为", targetx);
          if (targetx === target) {
            await trigger.player.loseHp();
            const evt = trigger.getParent("phaseUse");
            if (evt && evt.player === trigger.player) {
              evt.skipped = true;
            }
          }
        }
      }
    }
  },
  //冯方
  dcditing: {
    audio: 2,
    trigger: { global: "phaseUseBegin" },
    logTarget: "player",
    filter(event, player) {
      return player.hp > 0 && event.player.hasCards("h") && event.player.inRange(player);
    },
    prompt2: (event, player) => `观看其${get.cnNumber(Math.min(player.hp, event.player.countCards("h")))}张手牌并选择其中一张`,
    check(event, player) {
      const target = event.player;
      if (get.attitude(player, target) > 0) {
        return true;
      }
      if (Math.min(player.hp, target.countCards("h")) > 2) {
        return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      const cards2 = target.getCards("h");
      const num = Math.min(cards2.length, player.hp);
      const shownCards = cards2.randomGets(num);
      const result = await player.chooseButton({
        createDialog: [`${get.translation(target)}的手牌（${num}/${cards2.length}）`, shownCards],
        forced: true,
        ai: (button) => {
          const player2 = _status.event.player;
          const target2 = _status.event.getTrigger().player;
          const card = button.link;
          const attitude = get.attitude(player2, target2);
          let value = target2.getUseValue(card, null, true);
          if (value <= 0) {
            return -get.value(card, target2) / 2 * get.sgn(attitude - 0.05);
          }
          if (target2.canUse(card, player2) && get.effect(player2, card, target2, target2) > 0) {
            const effect = get.effect(player2, card, target2, player2);
            if (effect < 0) {
              value -= effect;
            }
          }
          return value;
        }
      }).forResult();
      if (!result.bool) {
        return;
      }
      player.addTempSkill("dcditing_effect", "phaseUseAfter");
      player.storage.dcditing_effect = [trigger.player, result.links[0]];
    },
    subSkill: {
      effect: {
        audio: "dcditing",
        charlotte: true,
        trigger: { target: "useCardToTargeted" },
        forced: true,
        filter(event, player) {
          const list = player.storage.dcditing_effect;
          return list && event.player === list[0] && event.cards.includes(list[1]);
        },
        async content(event, trigger, player) {
          trigger.excluded.add(player);
          await game.delayx();
        },
        group: ["dcditing_draw", "dcditing_gain"]
      },
      draw: {
        audio: "dcditing",
        charlotte: true,
        trigger: { global: "useCardAfter" },
        forced: true,
        filter(event, player) {
          const list = player.storage.dcditing_effect;
          return list && event.player === list[0] && event.cards.includes(list[1]) && !event.targets.includes(player);
        },
        async content(event, trigger, player) {
          await player.draw(2);
        }
      },
      gain: {
        audio: "dcditing",
        charlotte: true,
        trigger: { global: "phaseUseEnd" },
        forced: true,
        filter(event, player) {
          const list = player.storage.dcditing_effect;
          return list && event.player === list[0] && event.player.getCards("h").includes(list[1]);
        },
        async content(event, trigger, player) {
          const list = player.storage.dcditing_effect;
          await player.gain({
            cards: [list[1]],
            source: list[0],
            animate: "giveAuto",
            bySelf: true
          });
        }
      }
    }
  },
  dcbihuo: {
    audio: 2,
    trigger: {
      player: "damageEnd",
      source: "damageSource"
    },
    filter(event, player) {
      return event.source && event.player != event.source;
    },
    async cost(event, trigger, player) {
      const num = event.triggername == "damageEnd" ? 1 : -1;
      event.result = await player.chooseTarget(get.prompt(event.skill), "令一名角色下回合的额定摸牌数" + (num > 0 ? "+1" : "-1")).set("ai", (target) => {
        const { player: player2, numx: num2 } = get.event();
        const att = get.attitude(player2, target);
        if (num2 > 0) {
          if (att <= 0) {
            return 0;
          }
          if (target.hasJudge("lebu")) {
            return att / 10;
          }
          return att / Math.sqrt(Math.min(5, 1 + target.countCards("h"))) * Math.sqrt(1 + target.hp);
        }
        if (num2 < 0) {
          if (att >= 0) {
            return 0;
          }
          if ((target.storage.dcbihuo_effect || 0) <= -2) {
            return -att / 10;
          }
          return -att / Math.sqrt(Math.min(5, 1 + target.countCards("h"))) * Math.sqrt(1 + target.hp);
        }
      }).set("numx", num).forResult();
    },
    async content(event, trigger, player) {
      const num = event.triggername == "damageEnd" ? 1 : -1;
      const target = event.targets[0];
      const effect = event.name + "_effect";
      if (typeof target.storage[effect] != "number") {
        target.storage[effect] = 0;
      }
      target.storage[effect] += num;
      target.addTempSkill(effect, { player: "phaseAfter" });
      target.markSkill(effect);
      await game.delayx();
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        trigger: { player: "phaseDrawBegin2" },
        filter(event, player) {
          return typeof player.storage.dcbihuo_effect == "number" && !event.numFixed;
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const num = player.countMark(event.name);
          trigger.num += num;
          game.log(player, "的额定摸牌数", "#g" + (num >= 0 ? "+" : "") + num);
        },
        mark: true,
        intro: { content: (num) => "额定摸牌数" + (num >= 0 ? "+" : "") + num }
      }
    }
  },
  //秦宜禄
  piaoping: {
    audio: 2,
    trigger: { player: "useCard" },
    forced: true,
    zhuanhuanji: true,
    async content(event, trigger, player) {
      player.changeZhuanhuanji("piaoping");
      const num = Math.min(player.hp, player.getHistory("useSkill", (evt) => evt.skill === "piaoping").length);
      if (num <= 0) {
        return;
      }
      if (player.storage.piaoping === true) {
        await player.draw(num);
      } else if (player.hasCard((card) => lib.filter.cardDiscardable(card, player, "piaoping"), "he")) {
        await game.delayx();
        await player.chooseToDiscard({ forced: true, position: "he", selectCard: num });
      }
    },
    mark: true,
    marktext: "☯",
    intro: {
      content(storage) {
        if (storage) {
          return "转换技，锁定技。当你使用一张牌时，你弃置X张牌。（X为你本阶段内发动过〖漂萍〗的次数且至多等于你的体力值）";
        }
        return "转换技，锁定技。当你使用一张牌时，你摸X张牌。（X为你本阶段内发动过〖漂萍〗的次数且至多等于你的体力值）";
      }
    }
  },
  tuoxian: {
    audio: 2,
    ai: { combo: "piaoping" },
    trigger: { player: "loseAfter" },
    marktext: "栗",
    filter(event, player) {
      return event.type == "discard" && event.getParent(3).name == "piaoping" && player.countMark("tuoxian") > player.countMark("tuoxian_used") && event.cards.filterInD("d").length > 0;
    },
    async cost(event, trigger, player) {
      const cards2 = trigger.cards.filterInD("d");
      event.result = await player.chooseTarget(lib.filter.notMe, get.prompt(event.skill), "令一名其他角色获得" + get.translation(cards2)).set("ai", function(target) {
        const player2 = _status.event.player;
        let att = get.attitude(player2, target);
        if (att < 0) {
          return 0;
        }
        if (target.hasSkillTag("nogain")) {
          att /= 10;
        }
        return att * Math.pow(1 + target.countCards("he"), 0.25);
      }).forResult();
      event.result.cards = cards2;
    },
    async content(event, trigger, player) {
      const target = event.targets[0], cards2 = event.cards;
      player.addSkill(event.name + "_used");
      player.addMark(event.name + "_used", 1, false);
      await target.gain(cards2, "gain2");
      const result = await target.chooseControl().set("choiceList", ["弃置区域内的" + get.cnNumber(cards2.length) + "张牌", "令" + get.translation(player) + "的〖漂萍〗于本回合内失效"]).set("ai", function() {
        const player2 = _status.event.player, target2 = _status.event.getParent().player;
        if (player2.hasCard(function(card) {
          return get.effect(player2, { name: card.viewAs || card.name }, player2, player2) < 0;
        }, "j") || player2.hasCard(function(card) {
          return get.value(card, player2) <= 0;
        })) {
          return 0;
        }
        if (get.attitude(player2, target2) <= 0 || !target2.isPhaseUsing()) {
          return 1;
        }
        if (!target2.needsToDiscard() && !target2.hasCard(function(card) {
          return !target2.hasValueTarget(card, null, true);
        }, "hs")) {
          return 1;
        }
        return 0;
      }).forResult();
      if (result.index == 0) {
        const num = Math.min(target.countCards("hej"), cards2.length);
        if (target.countCards("j") > 0) {
          await target.discardPlayerCard(target, num, true, "hej");
        } else {
          await target.chooseToDiscard("he", true, num);
        }
      } else {
        player.tempBanSkill("piaoping");
      }
    },
    init(player) {
      player.addMark("tuoxian", 1, false);
    },
    onremove: true,
    intro: {
      name2: "栗",
      markcount(storage, player) {
        return player.countMark("tuoxian") - player.countMark("tuoxian_used");
      },
      content(storage, player) {
        return `剩余可用${player.countMark("tuoxian") - player.countMark("tuoxian_used")}次`;
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  zhuili: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    forced: true,
    filter(event, player) {
      if (player === event.player || get.color(event.card) !== "black") {
        return false;
      }
      return player.hasSkill("piaoping", null, null, false);
    },
    async content(event, trigger, player) {
      if (player.storage.piaoping === true) {
        player.changeZhuanhuanji("piaoping");
      } else {
        player.addMark("tuoxian", 1, false);
        if (player.getAllHistory("useSkill", (evt) => evt.skill === "tuoxian").length > 3) {
          player.tempBanSkill("zhuili");
        }
      }
      await game.delayx();
    },
    ai: { combo: "piaoping" }
  },
  //闫柔
  choutao: {
    audio: 2,
    trigger: {
      player: "useCard",
      target: "useCardToTargeted"
    },
    filter(event, player) {
      if (event.card.name !== "sha" || !event.player.isIn()) {
        return false;
      }
      if (player === event.player) {
        return player.hasCard((card) => lib.filter.cardDiscardable(card, player, "choutao"), "he");
      }
      return event.player.hasCard((card) => lib.filter.canBeDiscarded(card, player, event.player), "he");
    },
    check(event, player) {
      if (player === event.player) {
        if (!player.hasCard((card) => get.value(card) <= 5, "he")) {
          return false;
        }
        for (const target of event.targets) {
          const effect = get.damageEffect(target, player, player);
          if (effect < 0) {
            return false;
          }
          if (target.hasShan() && effect > 0) {
            return true;
          }
        }
        let hasSha = false;
        return player.getCardUsable({ name: "sha" }) <= 0 && player.hasCard((card) => {
          if (!hasSha && get.name(card) === "sha" && player.getUseValue(card) > 0) {
            hasSha = true;
            return false;
          }
          return hasSha && get.value(card) <= 5;
        }, "hs");
      }
      const discardEffect = get.effect(event.player, { name: "guohe_copy2" }, player, player);
      const damageEffect = get.damageEffect(player, event.player, player);
      if (!player.hasShan()) {
        return discardEffect > 0;
      }
      if (damageEffect > 0) {
        return discardEffect > 0;
      }
      return player.hp > 2 && damageEffect < discardEffect;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      if (player !== game.me && !player.isOnline() && !player.isUnderControl()) {
        await game.delayx();
      }
      if (player === trigger.player) {
        await player.chooseToDiscard({
          position: "he",
          forced: true,
          ai: (card) => {
            const player2 = _status.event.player;
            let value = player2.getUseValue(card);
            if (get.name(card) === "sha" && player2.getUseValue(card) > 0) {
              value += 5;
            }
            return 20 - value;
          }
        });
      } else {
        await player.discardPlayerCard({
          target: trigger.player,
          forced: true,
          position: "he"
        });
      }
      trigger.directHit.addArray(game.players);
      if (player === trigger.player && trigger.addCount !== false) {
        trigger.addCount = false;
        const stat = player.getStat().card;
        const name = trigger.card.name;
        if (typeof stat[name] === "number") {
          stat[name]--;
        }
      }
    }
  },
  xiangshu: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    limited: true,
    skillAnimation: true,
    animationColor: "gray",
    filter(event, player) {
      return (player.getStat("damage") ?? 0) > 0 && game.hasPlayer((current) => current.isDamaged());
    },
    async cost(event, trigger, player) {
      const num = Math.min(5, player.getStat("damage") ?? 0);
      const result = await player.chooseTarget({
        prompt: "是否发动限定技【襄戍】？",
        prompt2: `令一名角色回复${num}点体力并摸${get.cnNumber(num)}张牌`,
        filterTarget: (card, player2, target) => target.isDamaged(),
        ai: (target) => {
          const att = get.attitude(player, target);
          if (att > 0 && num >= Math.min(player.hp, 2)) {
            return att * Math.sqrt(target.getDamagedHp());
          }
          return 0;
        }
      }).forResult();
      event.result = {
        bool: result.bool,
        targets: result.targets,
        cost_data: num
      };
    },
    async content(event, trigger, player) {
      const num = event.cost_data;
      const target = event.targets[0];
      player.awakenSkill(event.name);
      await target.recover(num);
      await target.draw(num);
      if (player !== target) {
        player.addExpose(0.2);
      }
    }
  },
  //朱灵
  dczhanyi: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      const types = ["basic", "trick", "equip"];
      const cards2 = player.getCards("he");
      return types.some((type) => {
        const ofType = cards2.filter((card) => get.type2(card, player) === type);
        return ofType.length > 0 && ofType.every((card) => lib.filter.cardDiscardable(card, player, "dczhanyi"));
      });
    },
    async cost(event, trigger, player) {
      const allTypes = ["basic", "trick", "equip"];
      const cards2 = player.getCards("he");
      const types = allTypes.filter((type) => {
        const ofType = cards2.filter((card) => get.type2(card, player) === type);
        return ofType.length > 0 && ofType.every((card) => lib.filter.cardDiscardable(card, player, "dczhanyi"));
      });
      const result = await player.chooseControl({
        controls: [...types, "cancel2"],
        prompt: get.prompt("dczhanyi"),
        prompt2: "弃置一种类型的所有牌",
        ai: () => {
          const player2 = _status.event.player;
          const getval = (control) => {
            if (control === "cancel2") {
              return 0;
            }
            const hs = player2.getCards("h");
            let eff2 = 0;
            const es = player2.getCards("e");
            const ss = player2.getCards("s");
            let sha = player2.getCardUsable({ name: "sha" });
            for (const card of hs) {
              const type = get.type2(card);
              if (type === control) {
                eff2 -= get.value(card, player2);
              } else {
                switch (type) {
                  case "basic":
                    if (sha > 0 && get.name(card) === "sha") {
                      sha--;
                      let add = 3;
                      if (!player2.hasValueTarget(card) && player2.hasValueTarget(card, false)) {
                        add += player2.getUseValue(card, false);
                      }
                      eff2 += add;
                    }
                    break;
                  case "trick":
                    if (player2.hasValueTarget(card)) {
                      eff2 += 6;
                    }
                    break;
                  case "equip":
                    if (player2.hasValueTarget({ name: "guohe_copy2" })) {
                      eff2 += player2.getUseValue({ name: "guohe_copy2" });
                    }
                    break;
                }
              }
            }
            if (control === "equip") {
              for (const card of es) {
                eff2 -= get.value(card, player2);
              }
            } else {
              for (const card of ss) {
                const type = get.type2(card);
                if (type === control) {
                  continue;
                }
                switch (type) {
                  case "basic":
                    if (sha > 0 && get.name(card) === "sha") {
                      sha--;
                      let add = 3;
                      if (!player2.hasValueTarget(card) && player2.hasValueTarget(card, false)) {
                        add += player2.getUseValue(card, false);
                      }
                      eff2 += add;
                    }
                    break;
                  case "trick":
                    if (player2.hasValueTarget(card)) {
                      eff2 += 6;
                    }
                    break;
                  case "equip":
                    if (player2.hasValueTarget({ name: "guohe_copy2" })) {
                      eff2 += player2.getUseValue({ name: "guohe_copy2" });
                    }
                    break;
                }
              }
            }
            return eff2;
          };
          const controls = _status.event.controls.slice(0);
          let eff = 0;
          let current = "cancel2";
          for (const control of controls) {
            const effx = getval(control);
            if (effx > eff) {
              eff = effx;
              current = control;
            }
          }
          return current;
        }
      }).forResult();
      if (result.control === "cancel2") {
        return;
      }
      const cards22 = player.getCards("he", (card) => get.type2(card, player) === result.control);
      if (!cards22.length) {
        return;
      }
      event.result = {
        bool: true,
        cards: cards22,
        cost_data: {
          type: result.control
        }
      };
    },
    async content(event, trigger, player) {
      const cards2 = event.cards;
      const { type } = event.cost_data;
      await player.discard({ cards: cards2 });
      for (const currentType of ["basic", "trick", "equip"]) {
        if (currentType !== type) {
          player.addTempSkill(`dczhanyi_${currentType}`, { player: "phaseBegin" });
        }
      }
    },
    subSkill: {
      basic: {
        audio: "dczhanyi",
        charlotte: true,
        marktext: "基",
        mark: true,
        intro: {
          content: "使用基本牌无距离限制，且伤害值和回复值基数+1"
        },
        trigger: { source: ["damageBegin1", "recoverBegin"] },
        filter(event, player) {
          const evt = event.getParent();
          return evt != null && evt.type === "card" && get.type(evt.card, null, false) === "basic";
        },
        forced: true,
        logTarget: "player",
        async content(event, trigger, player) {
          ++trigger.num;
        },
        mod: {
          targetInRange(card) {
            if (get.type(card) === "basic") {
              return true;
            }
          }
        },
        ai: {
          damageBonus: true
        }
      },
      trick: {
        audio: "dczhanyi",
        charlotte: true,
        marktext: "锦",
        mark: true,
        intro: {
          content: "使用锦囊牌时摸一张牌，且锦囊牌不计入本回合的手牌上限"
        },
        trigger: { player: "useCard" },
        filter(event, player) {
          return get.type2(event.card) === "trick";
        },
        forced: true,
        async content(event, trigger, player) {
          await player.draw();
        },
        mod: {
          ignoredHandcard(card, player) {
            if (get.type2(card, player) === "trick") {
              return true;
            }
          },
          cardDiscardable(card, player, name) {
            if (name === "phaseDiscard" && get.type2(card, player) === "trick") {
              return false;
            }
          }
        }
      },
      equip: {
        audio: "dczhanyi",
        charlotte: true,
        marktext: "装",
        mark: true,
        intro: {
          content: "有装备牌进入你的装备区时，可弃置一名其他角色的一张牌"
        },
        trigger: { player: "equipAfter" },
        filter(event, player) {
          return game.hasPlayer((target) => target !== player && target.hasDiscardableCards(player, "he"));
        },
        async cost(event, trigger, player) {
          event.result = await player.chooseTarget({
            prompt: "战意：是否弃置一名其他角色的一张牌？",
            filterTarget: (_card, player2, target) => target !== player2 && target.hasDiscardableCards(player2, "he"),
            ai: (target) => {
              const player2 = _status.event.player;
              return get.effect(target, { name: "guohe_copy2" }, player2, player2);
            }
          }).forResult();
        },
        async content(event, trigger, player) {
          const target = event.targets[0];
          await player.discardPlayerCard({ target, position: "he", forced: true });
        }
      }
    }
  },
  //李采薇
  yijiao: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => current !== player && !current.hasMark("yijiao"));
    },
    filterTarget(card, player, target) {
      return target !== player && !target.hasMark("yijiao");
    },
    async content(event, trigger, player) {
      const { target } = event;
      const result = await player.chooseControl({
        controls: ["10个", "20个", "30个", "40个"],
        prompt: `要令${get.translation(target)}获得多少标记？`,
        ai: () => {
          const player2 = _status.event.player;
          const target2 = _status.event.getParent().target;
          if (get.attitude(player2, target2) < 0) {
            return 3;
          }
          return 0;
        }
      }).forResult();
      target.addMark("yijiao", 10 * (1 + result.index));
    },
    ai: {
      order: 1.1,
      result: {
        player: 1,
        target: -0.5
      }
    },
    group: "yijiao_effect",
    subSkill: {
      effect: {
        audio: "yijiao",
        trigger: { global: "phaseJieshuBegin" },
        forced: true,
        filter(event, player) {
          return event.player.isIn() && event.player !== player && event.player.hasMark("yijiao");
        },
        logTarget: "player",
        async content(event, trigger, player) {
          const target = trigger.player;
          const num = target.countMark("yijiao");
          let num2 = 0;
          target.getHistory("useCard", (evt) => {
            const numz = get.number(evt.card);
            if (typeof numz === "number") {
              num2 += numz;
            }
          });
          if (num > num2) {
            const hs = target.getCards("h", (card) => lib.filter.cardDiscardable(card, target, "yijiao_effect"));
            if (hs.length) {
              await target.discard({ cards: hs.randomGets(get.rand(1, 3)) });
            }
          } else if (num === num2) {
            await target.insertPhase();
            await player.draw(2);
          } else {
            await player.draw(3);
          }
          target.removeMark("yijiao", num);
        }
      }
    },
    intro: {
      onunmark: true,
      name2: "异",
      content: "mark"
    }
  },
  qibie: {
    audio: 2,
    trigger: { global: "die" },
    filter(event, player) {
      return player.hasCards("h") && player.hasCard((card) => lib.filter.cardDiscardable(card, player, "qibie"), "h");
    },
    check(event, player) {
      return player.isDamaged() && player.countCards("h", "tao") < Math.max(2, player.hp);
    },
    async content(event, trigger, player) {
      const hs = player.getCards("h");
      await player.discard({ cards: hs });
      await player.recover();
      await player.draw(hs.length + 2);
    }
  },
  //严夫人
  channi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hasCards("h");
    },
    filterTarget: lib.filter.notMe,
    filterCard: true,
    selectCard: [1, Infinity],
    allowChooseAll: true,
    check(card) {
      const player = _status.event.player;
      const num = player.hasSkill("nifu") ? 15 : 8;
      if (ui.selected.cards.length <= Math.max(1, player.needsToDiscard(), player.countCards("h") - 4)) {
        return num - get.value(card);
      }
      return num / 2 - get.value(card);
    },
    position: "h",
    discard: false,
    lose: false,
    delay: false,
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      const giveEvent = player.give(cards2, target);
      player.addTempSkill("channi_effect");
      await giveEvent;
      if (target.countCards("h") > 0) {
        game.broadcastAll((num) => {
          lib.skill.channi_backup.selectCard = [1, num];
        }, cards2.length);
        const next = target.chooseToUse({
          openskilldialog: `将至多${get.cnNumber(cards2.length)}张手牌当做【决斗】使用`,
          norestore: true,
          addCount: false,
          _backupevent: "channi_backup",
          custom: {
            add: {},
            replace: { window() {
            } }
          }
        });
        next.backup("channi_backup");
        await next;
      }
      player.removeSkill("channi_effect");
    },
    subSkill: {
      effect: {
        trigger: { global: ["damageSource", "damageEnd"] },
        filter(event, player, name) {
          if (!event.card || event.card.name !== "juedou") {
            return false;
          }
          const evt = event.getParent(2);
          if (!evt || evt.name !== "useCard" || evt.card.name !== "juedou") {
            return false;
          }
          const user = evt.player;
          const evtx = event.getParent("channi", true);
          if (!evtx || evtx.player !== player) {
            return false;
          }
          if (name === "damageSource") {
            return event.source === user && evt.cards.length;
          }
          return event.player === user && player.countCards("h");
        },
        forced: true,
        charlotte: true,
        logTarget(event, player, name) {
          return event[name === "damageSource" ? "source" : "player"];
        },
        async content(event, trigger, player) {
          const evt = trigger.getParent(2);
          if (event.triggername === "damageSource") {
            await evt.player.draw(evt.cards.length);
          } else {
            await player.chooseToDiscard({
              position: "h",
              forced: true,
              selectCard: player.countCards("h")
            });
          }
        }
      },
      backup: {
        filterCard(card) {
          return get.itemtype(card) === "card";
        },
        viewAs: { name: "juedou" },
        position: "h",
        filterTarget: lib.filter.targetEnabled,
        ai1: (card) => {
          if (get.name(card) === "sha") {
            return 0;
          }
          return 5.5 - get.value(card);
        },
        log: false,
        allowChooseAll: true
      }
    },
    ai: {
      order: 0.3,
      result: {
        target(player, target) {
          if (target === game.me || target.isOnline() || target.hasValueTarget({ name: "juedou" })) {
            return 2;
          }
          if (player.needsToDiscard()) {
            return 0.5;
          }
          return 0;
        }
      }
    }
  },
  nifu: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    forced: true,
    filter(event, player) {
      return player.countCards("h") !== 4;
    },
    async content(event, trigger, player) {
      const num = player.countCards("h") - 4;
      if (num > 0) {
        await player.chooseToDiscard({ position: "h", selectCard: num, forced: true, allowChooseAll: true });
      } else {
        await player.draw(-num);
      }
    }
  },
  //郝萌
  xiongmang: {
    audio: 2,
    enable: "chooseToUse",
    viewAs: { name: "sha" },
    viewAsFilter(player) {
      return player.hasCards("hs");
    },
    selectCard() {
      return [1, 4];
    },
    selectTarget() {
      const card = get.card();
      const player = get.player();
      if (card === void 0) {
        return;
      }
      const range = [1, Math.max(1, ui.selected.cards.length)];
      game.checkMod(card, player, range, "selectTarget", player);
      return range;
    },
    complexCard: true,
    filterCard(card) {
      if (!ui.selected.cards.length) {
        return true;
      }
      const suit = get.suit(card);
      for (const i of ui.selected.cards) {
        if (get.suit(i) === suit) {
          return false;
        }
      }
      return true;
    },
    filterOk() {
      if (!ui.selected.targets.length) {
        return false;
      }
      const card = get.card();
      const player = get.player();
      if (card === void 0) {
        return;
      }
      const range = [1, Math.max(1, ui.selected.cards.length)];
      game.checkMod(card, player, range, "selectTarget", player);
      return range[0] <= ui.selected.targets.length && range[1] >= ui.selected.targets.length || range[0] === -1;
    },
    check(card) {
      const player = _status.event.player;
      card = get.autoViewAs({ name: "sha" }, ui.selected.cards.concat(card));
      if (game.countPlayer((current) => (_status.event.filterTarget || lib.filter.filterTarget)(card, player, current) && get.effect_use(current, card, player, player) > 0) <= ui.selected.cards.length) {
        return 0;
      }
      return 5 - get.value(card);
    },
    position: "hs",
    onuse(links, player) {
      player.addTempSkill("xiongmang_effect");
    },
    ai: {
      order: () => get.order({ name: "sha" }) + 0.2,
      respondSha: true,
      skillTagFilter(player, tag, arg) {
        return player.hasCards("hs");
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          return event.skill === "xiongmang";
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          if (!game.getGlobalHistory("changeHp", (evt) => evt.getParent().name === "damage" && evt.getParent().card && evt.getParent().card === trigger.card).length) {
            await player.loseMaxHp();
          } else {
            player.addTempSkill("xiongmang_more", ["phaseChange", "phaseAfter"]);
            player.addMark("xiongmang_more", 1, false);
          }
        }
      },
      more: {
        charlotte: true,
        onremove: true,
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.countMark("xiongmang_more");
            }
          }
        },
        intro: { content: "使用【杀】的额定次数+#" }
      }
    }
  },
  //庞德公
  heqia: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => current.countCards(current == player ? "he" : "h") > 0);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        prompt: get.prompt(event.skill),
        prompt2: "操作提示：选择要给出的牌和目标角色，或直接选择一名目标角色，令其将牌交给自己",
        filterCard: true,
        position: "he",
        selectCard() {
          if (ui.selected.targets.length && !ui.selected.targets[0].countCards("h")) {
            return [1, Infinity];
          }
          return [0, Infinity];
        },
        filterTarget(card, player2, target) {
          if (player2 == target) {
            return false;
          }
          if (!ui.selected.cards.length) {
            return target.countCards("h") > 0;
          }
          return true;
        },
        allowChooseAll: true,
        ai1(card) {
          if (!get.event().nogive || ui.selected.cards.length) {
            return 0 - get.value(card);
          }
          return 1 / Math.max(1, get.value(card));
        },
        ai2(target) {
          return (get.attitude(get.player(), target) - 0.1) * (ui.selected.cards.length ? 1 : -1);
        },
        nogive: !game.hasPlayer((current) => current != player && get.attitude(player, current) <= 0 && current.countCards("h"))
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target],
        cards: cards2
      } = event;
      let source, num;
      if (cards2?.length) {
        await player.give(cards2, target);
        source = target;
        num = cards2.length;
      } else if (target.countCards("h")) {
        event.source = target;
        const result = await target.chooseToGive(player, "he", true, [1, Infinity], `选择交给${get.translation(player)}任意张牌`, "allowChooseAll").set("ai", (card) => -get.value(card)).forResult();
        if (result?.cards?.length) {
          source = player;
          num = result.cards.length;
        }
      }
      event.num = num;
      if (source?.isIn() && source.countCards("h")) {
        const list = get.inpileVCardList((info) => {
          if (info[0] != "basic") {
            return false;
          }
          return source.hasUseTarget({ name: info[2], nature: info[3] }, false);
        });
        if (!list.length) {
          return;
        }
        const result = await source.chooseButton(["是否将一张手牌当做一种基本牌使用？", [list, "vcard"]]).set("ai", (button) => get.player().getUseValue({ name: button.link[2], nature: button.link[3] }, false)).forResult();
        if (!result?.links?.length) {
          return;
        }
        source.addSkill(event.name + "_add");
        const card = { name: result.links[0][2], nature: result.links[0][3] };
        game.broadcastAll((card2) => {
          lib.skill.heqia_backup.viewAs = card2;
        }, card);
        const next = source.chooseToUse();
        next.set("openskilldialog", "将一张手牌当做" + get.translation(card) + "使用");
        next.set("norestore", true);
        next.set("addCount", false);
        next.set("_backupevent", "heqia_backup");
        next.set("custom", {
          add: {},
          replace: { window() {
          } }
        });
        next.backup("heqia_backup");
        await next;
      }
    },
    subSkill: {
      backup: {
        filterCard(card) {
          return get.itemtype(card) == "card";
        },
        position: "h",
        filterTarget: lib.filter.targetEnabled,
        selectCard: 1,
        check: (card) => 6 - get.value(card),
        log: false
      },
      add: {
        charlotte: true,
        trigger: { player: "useCard2" },
        filter(event, player) {
          const evt = event.getParent(2);
          if (evt.name != "heqia" || !event.targets?.length || typeof evt.num != "number" || evt.num <= event.targets.length) {
            return false;
          }
          const { card } = event, info = get.info(card);
          if (info.allowMultiple == false) {
            return false;
          }
          if (event.targets && !info.multitarget) {
            return game.hasPlayer((current) => {
              return !event.targets.includes(current) && lib.filter.targetEnabled2(card, event.player, current);
            });
          }
          return false;
        },
        async cost(event, trigger, player) {
          player.removeSkill(event.skill);
          const num = trigger.getParent(2).num - trigger.targets.length;
          const prompt2 = "是否为" + get.translation(trigger.card) + "增加至多" + get.cnNumber(num) + "个目标？";
          event.result = await player.chooseTarget(prompt2, [1, num], (card, player2, target) => {
            return !get.event().targets.includes(target) && lib.filter.targetEnabled2(get.event().card, get.player(), target);
          }).set("ai", (target) => {
            const trigger2 = get.event().getTrigger();
            const player2 = get.player();
            return get.effect(target, trigger2.card, player2, player2);
          }).set("card", trigger.card).set("targets", trigger.targets).forResult();
        },
        popup: false,
        async content(event, trigger, player) {
          player.line(event.targets);
          game.log(event.targets, "也成为了", trigger.card, "的目标");
          trigger.targets.addArray(event.targets);
        }
      }
    }
  },
  yinyi: {
    audio: 2,
    trigger: { player: "damageBegin1" },
    forced: true,
    usable: 1,
    filter(event, player) {
      return event.source && event.source.hp !== player.hp && !event.hasNature("linked") && event.source.countCards("h") !== player.countCards("h");
    },
    async content(event, trigger, player) {
      trigger.cancel();
    },
    ai: {
      effect: {
        target(card, player, target, current) {
          if (!get.tag(card, "damage")) {
            return;
          }
          if (player.hp === target.hp || lib.linked.includes(get.nature(card))) {
            return;
          }
          const cards2 = [card];
          if (card.cards && card.cards.length) {
            cards2.addArray(card.cards);
          }
          if (ui.selected.cards.length) {
            cards2.addArray(ui.selected.cards);
          }
          if (player.countCards("h", (cardx) => !cards2.includes(cardx)) === target.countCards("h")) {
            return;
          }
          return "zeroplayertarget";
        }
      }
    }
  },
  //韩猛
  jieliang: {
    audio: 2,
    trigger: { global: "phaseDrawBegin2" },
    filter(event, player) {
      return event.player !== player && !event.numFixed && event.num > 1 && player.countCards("he") > 0;
    },
    async cost(event, trigger, player) {
      const target = trigger.player;
      event.result = await player.chooseToDiscard({
        prompt: get.prompt2(event.skill, target),
        position: "he",
        chooseonly: true,
        ai: (card) => {
          if (!_status.event.goon) {
            return 0;
          }
          return 7 - get.value(card);
        }
      }).set("goon", get.attitude(player, target) < -2).forResult();
      event.result.targets = [target];
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await player.discard(event.cards);
      trigger.num--;
      if (get.mode() !== "identity" || player.identity !== "nei") {
        player.addExpose(0.15);
      }
      target.addMark("jieliang_less", 1, false);
      target.addTempSkill("jieliang_less");
      player.addTempSkill("jieliang_gain");
    },
    subSkill: {
      less: {
        charlotte: true,
        mod: {
          maxHandcard(player, num) {
            return num - player.countMark("jieliang_less");
          }
        },
        onremove: true,
        intro: { content: "手牌上限-#" }
      },
      gain: {
        trigger: { global: "loseAfter" },
        charlotte: true,
        direct: true,
        filter(event, player) {
          return event.type === "discard" && event.player === _status.currentPhase && event.getParent(3).name === "phaseDiscard" && event.cards2.filterInD("d").length > 0;
        },
        async content(event, trigger, player) {
          const result = await player.chooseButton({
            createDialog: ["截粮：是否获得一张牌?", trigger.cards2.filterInD("d")],
            ai: (button) => get.value(button.link, _status.event.player)
          }).forResult();
          if (!result.bool) {
            return;
          }
          player.logSkill("jieliang", trigger.player);
          await player.gain({ cards: result.links, animate: "gain2" });
        }
      }
    }
  },
  quanjiu: {
    audio: 2,
    mod: {
      aiOrder(player, card, num) {
        if ((card.name === "jiu" || card.name === "xujiu") && get.name(card) === "sha") {
          return num + 0.5;
        }
      },
      cardname(card, player, name) {
        if (card.name === "jiu" || card.name === "xujiu") {
          return "sha";
        }
      }
    },
    trigger: { player: "useCard1" },
    forced: true,
    filter(event, player) {
      return event.addCount !== false && event.card.isCard && event.card.name === "sha" && event.cards.length === 1 && (event.cards[0].name === "jiu" || event.cards[0].name === "xujiu");
    },
    async content(event, trigger, player) {
      trigger.addCount = false;
      const stat = player.getStat().card;
      const name = trigger.card.name;
      if (typeof stat[name] === "number") {
        stat[name]--;
      }
    }
  },
  //辛评
  fuyuan: {
    audio: 2,
    trigger: { player: ["useCard", "respond"] },
    filter(event, player) {
      const target = _status.currentPhase;
      return target && target !== player && target.isIn();
    },
    logTarget(event, player) {
      const target = _status.currentPhase;
      return target.countCards("h") < player.countCards("h") ? target : player;
    },
    check(event, player) {
      const target = lib.skill.fuyuan.logTarget(event, player);
      return get.attitude(player, target) > 0;
    },
    prompt: "是否发动【辅袁】？",
    prompt2(event, player) {
      const target = lib.skill.fuyuan.logTarget(event, player);
      return `令${get.translation(target)}${target === player ? "（你）" : ""}摸一张牌`;
    },
    async content(event, trigger, player) {
      await lib.skill.fuyuan.logTarget(trigger, player).draw();
    }
  },
  zhongjie: {
    audio: 2,
    trigger: { player: "die" },
    forceDie: true,
    skillAnimation: true,
    animationColor: "gray",
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget: lib.filter.notMe,
        ai: (target) => get.attitude(_status.event.player, target)
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await target.gainMaxHp();
      await target.recover();
      await target.draw();
    }
  },
  //张宁
  tianze: {
    audio: 2,
    trigger: { global: "useCardAfter" },
    filter(event, player) {
      if (player === event.player || !event.player.isIn() || player.hasSkill("tianze_block")) {
        return false;
      }
      let evt = event.getParent("phaseUse");
      if (!evt || evt.player !== event.player) {
        return false;
      }
      return get.color(event.card) === "black" && event.player.hasHistory("lose", (event2) => {
        return event2 && event2.hs.length && (event2.relatedEvent || event2.getParent()) === event;
      }) && event.player.getHistory("useCard", (event2) => {
        return event2.getParent("phaseUse") === evt && get.color(event2.card) === "black";
      }).indexOf(event) === 0 && player.hasCard((card) => {
        if (_status.connectMode && get.position(card) == "h") {
          return true;
        }
        return get.color(card, player) == "black";
      }, "he");
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard(
        "he",
        "chooseonly",
        function(card, player2) {
          return get.color(card, player2) == "black";
        },
        get.prompt(event.skill, trigger.player),
        "弃置一张黑色牌并对其造成1点伤害"
      ).set("ai", function(card) {
        if (!_status.event.goon) {
          return 0;
        }
        return 8 - get.value(card);
      }).set("goon", get.damageEffect(trigger.player, player, player) > 0).set("logSkill", [event.skill, trigger.player]).forResult();
    },
    popup: false,
    async content(event, trigger, player) {
      await player.discard(event.cards);
      player.addTempSkill("tianze_block");
      if (get.mode() != "identity" || player.identity != "nei") {
        player.addExpose(0.2);
      }
      await trigger.player.damage();
      await game.delayx();
    },
    group: "tianze_draw",
    subSkill: {
      block: { charlotte: true },
      draw: {
        audio: "tianze",
        trigger: { global: "judgeEnd" },
        forced: true,
        locked: false,
        filter(event, player) {
          return event.player != player && event.result && event.result.color == "black";
        },
        async content(event, trigger, player) {
          await player.draw();
        }
      }
    }
  },
  difa: {
    audio: 2,
    trigger: { player: "gainAfter" },
    filter(event, player) {
      if (player != _status.currentPhase) {
        return false;
      }
      var hs = player.getCards("h");
      if (!hs.length) {
        return false;
      }
      for (var i of event.cards) {
        if (hs.includes(i) && get.color(i, player) == "red" && lib.filter.cardDiscardable(i, player, "difa")) {
          return true;
        }
      }
      return false;
    },
    async cost(event, trigger, player) {
      let hs = player.getCards("h"), cards2 = trigger.cards.filter(function(i) {
        return hs.includes(i) && get.color(i, player) == "red" && lib.filter.cardDiscardable(i, player, "difa");
      }), tricks = [];
      for (let i = 0; i < ui.cardPile.childNodes.length; i++) {
        let card = ui.cardPile.childNodes[i], type = get.type2(card, false);
        if (type != "trick" || tricks.includes(type)) {
          continue;
        }
        tricks.push([card.name, get.event().player.getUseValue(card)]);
      }
      for (let i = 0; i < ui.discardPile.childNodes.length; i++) {
        let card = ui.discardPile.childNodes[i], type = get.type2(card, false);
        if (type != "trick" || tricks.includes(type)) {
          continue;
        }
        tricks.push([card.name, get.event().player.getUseValue(card)]);
      }
      tricks.sort((a, b) => b[1] - a[1]);
      let result = await player.chooseToDiscard(get.prompt2(event.skill), (card) => {
        return get.event().cards.includes(card);
      }).set("ai", (card) => {
        let val = get.event().val;
        if (typeof val !== "number") {
          return 0;
        }
        return val - get.value(card);
      }).set(
        "val",
        (function() {
          if (!tricks.length) {
            return false;
          }
          return 3 * tricks[0][1];
        })()
      ).set("cards", cards2).set("chooseonly", true).forResult();
      event.result = {
        bool: result.bool,
        cards: result.cards,
        cost_data: tricks
      };
    },
    usable: 1,
    async content(event, trigger, player) {
      await player.discard(event.cards);
      let list = lib.inpile.filter(function(i) {
        return get.type2(i, false) == "trick";
      });
      if (!list.length) {
        return;
      }
      const result = await player.chooseButton(["选择获得一种锦囊牌", [list.map((i) => ["锦囊", "", i]), "vcard"]], true).set("ai", function(button) {
        var name = button.link[2];
        for (let i of get.event().list) {
          if (i[0] == name) {
            return i[1];
          }
        }
        return 0;
      }).set("list", event.cost_data).forResult();
      if (result.bool) {
        let card = get.cardPile((i) => {
          return i.name == result.links[0][2];
        });
        if (card) {
          await player.gain(card, "gain2");
        }
      }
    }
  },
  //童渊
  chaofeng: {
    audio: 2,
    trigger: { source: "damageBegin1" },
    filter(event, player) {
      return player.countCards("h") > 0 && player.isPhaseUsing() && !player.hasSkill("chaofeng_used");
    },
    popup: false,
    async cost(event, trigger, player) {
      let str = "弃置一张手牌并摸一张牌", color, type;
      if (trigger.card) {
        type = get.type2(trigger.card, false);
        color = get.color(trigger.card, false);
        if (color != "none") {
          str += "；若弃置" + get.translation(color) + "牌则改为摸两张牌";
        }
        if (type) {
          str += "；若弃置类型为" + get.translation(type) + "的牌则伤害+1";
        }
      }
      const next = player.chooseToDiscard("h", get.prompt(event.skill, trigger.player), str);
      next.set("ai", (card) => {
        const { player: player2, att, color: color2, type: type2 } = get.event();
        let val = 4.2 - get.value(card);
        if (get.color(card) == color2) {
          val += 3;
        }
        if (get.type2(card) == type2) {
          if (att < 0) {
            val += 4;
          } else if (att === 0) {
            val += 2;
          } else {
            val = 0;
          }
        }
        return val;
      });
      next.set("att", get.attitude(player, trigger.player));
      next.logSkill = ["chaofeng", trigger.player];
      if (color != "none") {
        next.set("color", color);
      }
      if (type) {
        next.set("type", type);
      }
      event.result = await next.forResult();
      event.result.cost_data = [color, type];
    },
    async content(event, trigger, player) {
      player.addTempSkill(event.name + "_used", "phaseUseEnd");
      const {
        cards: [card],
        cost_data: [color, type]
      } = event;
      await player.draw(color && get.color(card, card.original == "h" ? player : false) == color ? 2 : 1);
      if (type && get.type2(card, card.original == "h" ? player : false) == type) {
        trigger.num++;
      }
    },
    subSkill: { used: { charlotte: true } }
  },
  chuanshu: {
    audio: 2,
    trigger: { player: ["phaseZhunbeiBegin", "die"] },
    limited: true,
    forceDie: true,
    filter(event, player) {
      return player.isDamaged() && (event.name == "die" || player.isIn()) && game.hasPlayer((current) => current != player);
    },
    skillAnimation: true,
    animationColor: "gray",
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(lib.filter.notMe, get.prompt2(event.skill)).set("ai", (target) => {
        return get.attitude(get.player(), target);
      }).set("forceDie", true).forResult();
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const {
        targets: [target]
      } = event;
      await target.addSkills("chaofeng");
      if (player.isIn()) {
        await player.addSkills(get.info(event.name).derivation?.slice(1));
      }
    },
    derivation: ["chaofeng", "ollongdan", "drlt_congjian", "chuanyun"],
    ai: {
      maixie_hp: true,
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage")) {
            if (target.isHealthy() && target.maxHp > 1 && game.hasPlayer((current) => current != target && get.attitude(current, target) > 0)) {
              return [1, 1.6];
            }
          } else if (get.tag(card, "recover") && target.getDamagedHp() == 1) {
            return [0, 0];
          }
        }
      }
    }
  },
  longdan_tongyuan: { audio: true },
  ocongjian_tongyuan: { audio: true },
  chuanyun: {
    audio: true,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return event.card.name === "sha" && event.target.hasCards("e");
    },
    logTarget: "target",
    async content(event, trigger, player) {
      const target = trigger.target;
      const card = target.getCards("e").randomGet();
      if (card) {
        await target.discard({ cards: [card] });
      }
    }
  },
  //南华老仙
  jinghe: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return !player.hasSkill("jinghe_clear");
    },
    selectCard() {
      if (ui.selected.targets.length) {
        return [ui.selected.targets.length, 4];
      }
      return [1, 4];
    },
    selectTarget() {
      return ui.selected.cards.length;
    },
    filterTarget: true,
    filterCard(card) {
      if (ui.selected.cards.length) {
        const name = get.name(card);
        for (const selectedCard of ui.selected.cards) {
          if (get.name(selectedCard) === name) {
            return false;
          }
        }
      }
      return true;
    },
    check(card) {
      const player = _status.event.player;
      if (game.countPlayer((current) => get.attitude(player, current) > 0) > ui.selected.cards.length) {
        return 1;
      }
      return 0;
    },
    position: "h",
    complexCard: true,
    discard: false,
    lose: false,
    delay: false,
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      const { cards: cards2, targets } = event;
      const showEvent = player.showCards(cards2, `${get.translation(player)}发动了【经合】`);
      const skills2 = lib.skill.jinghe.derivation.randomGets(4);
      player.addTempSkill("jinghe_clear", { player: "phaseBegin" });
      targets.sortBySeat();
      await showEvent;
      for (const target of targets) {
        const result = await target.chooseControl({
          controls: [...skills2, "cancel2"],
          choiceList: skills2.map((skill2) => `<div class="skill">【${get.translation(lib.translate[`${skill2}_ab`] || get.translation(skill2).slice(0, 2))}】</div><div>${get.skillInfoTranslation(skill2, player, false)}</div>`),
          displayIndex: false,
          prompt: "选择获得一个技能"
        }).forResult();
        const skill = result.control;
        if (skill !== "cancel2") {
          skills2.remove(skill);
          await target.addAdditionalSkills(`jinghe_${player.playerid}`, skill, true);
        }
        if (target !== game.me && !target.isOnline2()) {
          await game.delayx();
        }
      }
    },
    ai: {
      threaten: 3,
      order: 10,
      result: {
        target: 1
      }
    },
    derivation: ["releiji", "rebiyue", "new_retuxi", "remingce", "xinzhiyan", "nhyinbing", "nhhuoqi", "nhguizhu", "nhxianshou", "nhlundao", "nhguanyue", "nhyanzheng"],
    subSkill: {
      clear: {
        onremove(player) {
          game.countPlayer((current) => current.removeAdditionalSkills(`jinghe_${player.playerid}`));
        }
      }
    }
  },
  gongxiu: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return player.hasSkill("jinghe_clear");
    },
    async cost(event, trigger, player) {
      const list1 = [];
      const list2 = [];
      let addIndex = 0;
      const choices = [];
      for (const current of game.filterPlayer()) {
        if (current.additionalSkills[`jinghe_${player.playerid}`]) {
          list1.push(current);
        } else {
          list2.push(current);
        }
      }
      list1.sortBySeat();
      if (list1.length) {
        choices.push(`令${get.translation(list1)}${list1.length > 1 ? "各" : ""}摸一张牌`);
      } else {
        addIndex++;
      }
      list2.sortBySeat();
      if (list2.length) {
        choices.push(`令${get.translation(list2)}${list2.length > 1 ? "各" : ""}弃置一张手牌`);
      }
      const result = await player.chooseControl({
        controls: ["cancel2"],
        choiceList: choices,
        prompt: get.prompt("gongxiu"),
        ai: () => {
          if (list2.filter((current) => get.attitude(player, current) <= 0 && !current.hasSkillTag("noh")).length - list1.length > 1) {
            return 1 - addIndex;
          }
          return 0;
        }
      }).forResult();
      if (result.control === "cancel2") {
        event.result = { bool: false };
        return;
      }
      const discard = result.index + addIndex !== 0;
      event.result = {
        bool: true,
        targets: discard ? list2 : list1,
        cost_data: discard
      };
    },
    async content(event, trigger, player) {
      if (event.cost_data) {
        const discardEvents = event.targets.map(
          (current) => current.chooseToDiscard({
            position: "h",
            forced: true
          })
        );
        await Promise.all(discardEvents);
        return;
      }
      await game.asyncDraw(event.targets);
      await game.delayx();
    },
    ai: {
      combo: "jinghe"
    }
  },
  nhyinbing: {
    trigger: { source: "damageBefore" },
    forced: true,
    filter(event, player) {
      return event.card && event.card.name === "sha";
    },
    async content(event, trigger, player) {
      trigger.cancel();
      await trigger.player.loseHp(trigger.num);
    },
    group: "nhyinbing_draw",
    subSkill: {
      draw: {
        trigger: { global: "loseHpAfter" },
        forced: true,
        filter(event, player) {
          return player !== event.player;
        },
        async content(event, trigger, player) {
          await player.draw();
        }
      }
    },
    ai: {
      jueqing: true
    }
  },
  nhhuoqi: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hasCards("he");
    },
    position: "he",
    filterCard: true,
    filterTarget(card, player, target) {
      return target.isMinHp();
    },
    check(card) {
      return 7 - get.value(card);
    },
    async content(event, trigger, player) {
      await event.target.recover();
      await event.target.draw();
    },
    ai: {
      order: 1,
      tag: {
        draw: 1,
        recover: 1
      },
      result: {
        target(player, target) {
          if (target.isDamaged()) {
            return 3;
          }
          if (ui.selected.cards.length) {
            return 0;
          }
          return 1;
        }
      }
    }
  },
  nhguizhu: {
    trigger: { global: "dying" },
    usable: 1,
    logTarget: "player",
    frequent: true,
    async content(event, trigger, player) {
      await player.draw(2);
    }
  },
  nhxianshou: {
    enable: "phaseUse",
    usable: 1,
    filterTarget: true,
    async content(event, trigger, player) {
      await event.target.draw(event.target.isHealthy() ? 2 : 1);
    },
    ai: {
      order: 1,
      tag: {
        draw: 1
      },
      result: {
        target(player, target) {
          return target.isHealthy() ? 2 : 0.5;
        }
      }
    }
  },
  nhlundao: {
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return event.source && player !== event.source && player.countCards("h") !== event.source.countCards("h");
    },
    logTarget: "source",
    check(event, player) {
      return player.countCards("h") < event.source.countCards("h") || get.effect(event.source, { name: "guohe_copy2" }, player, player) > 0;
    },
    async content(event, trigger, player) {
      if (player.countCards("h") > trigger.source.countCards("h")) {
        await player.draw();
      } else {
        await player.discardPlayerCard({ target: trigger.source, position: "he", forced: true });
      }
    }
  },
  nhguanyue: {
    trigger: { player: "phaseJieshuBegin" },
    frequent: true,
    async content(event, trigger, player) {
      const cards2 = get.cards(2, true);
      const result = await player.chooseButton(["观月：选择获得一张牌", cards2.slice(0)], true).set("ai", function(button) {
        return get.value(button.link, _status.event.player);
      }).forResult();
      if (result.bool && result.links?.length) {
        await player.gain(result.links, "gain2");
      }
    }
  },
  nhyanzheng: {
    trigger: { player: "phaseZhunbeiBegin" },
    direct: true,
    filter(event, player) {
      return player.hasCards("h");
    },
    async content(event, trigger, player) {
      const num = player.countCards("h") - 1;
      const goon = game.countPlayer((current) => get.damageEffect(current, player, player) > 0) >= Math.min(3, num);
      const cardResult = await player.chooseCard({
        position: "h",
        prompt: get.prompt("nhyanzheng"),
        ai: (card) => {
          if (_status.event.goon) {
            return Math.max(1, get.value(card));
          }
          return 0;
        }
      }).set("goon", goon).forResult();
      if (!cardResult.bool) {
        return;
      }
      player.logSkill("nhyanzheng");
      const cards2 = player.getCards("h", (card) => card !== cardResult.cards[0] && lib.filter.cardDiscardable(card, player, "nhyanzheng"));
      if (!cards2.length) {
        return;
      }
      await player.discard({ cards: cards2 });
      const targetNum = Math.min(cards2.length, game.countPlayer());
      const targetResult = await player.chooseTarget({
        selectTarget: [1, targetNum],
        forced: true,
        prompt: `对${targetNum > 1 ? "至多" : ""}${get.cnNumber(targetNum)}名角色造成1点伤害`,
        ai: (target) => {
          const player2 = _status.event.player;
          return get.damageEffect(target, player2, player2);
        }
      }).forResult();
      if (!targetResult.bool) {
        return;
      }
      const targets = targetResult.targets.sortBySeat();
      player.line(targets, "green");
      for (const target of targets) {
        await target.damage();
      }
    }
  },
  //樊稠
  xinxingluan: {
    audio: "xinfu_xingluan",
    usable: 1,
    trigger: { player: "useCardAfter" },
    filter(event, player) {
      return player.isPhaseUsing();
    },
    async cost(event, trigger, player) {
      const choiceList = ["观看牌堆中两张点数为6的牌并获得其中一张", "令一名其他角色弃置一张点数为6的牌或交给你一张牌", "获得场上一张点数为6的牌"];
      const choices = ["选项一"];
      if (game.hasPlayer((current) => current !== player && current.countCards("he") > 0)) {
        choices.push("选项二");
      } else {
        choiceList[1] = `<span style="opacity:0.5">${choiceList[1]}</span>`;
      }
      if (game.hasPlayer((current) => current.hasCard((card) => get.number(card) === 6 && lib.filter.canBeGained(card, current, player), "ej"))) {
        choices.push("选项三");
      } else {
        choiceList[2] = `<span style="opacity:0.5">${choiceList[2]}</span>`;
      }
      const result = await player.chooseControl({
        controls: [...choices, "cancel2"],
        choiceList,
        prompt: get.prompt(event.skill),
        ai: () => {
          if (game.hasPlayer((current) => {
            if (current === player) {
              return false;
            }
            const att = -get.sgn(get.attitude(player, current) - 0.1);
            return current.hasCard((card) => get.number(card) === 6 && lib.filter.canBeGained(card, current, player) && get.sgn(get.useful(card, current)) === att, "ej");
          })) {
            return "选项三";
          }
          if (game.hasPlayer((target) => {
            if (target === player) {
              return false;
            }
            const att = get.attitude(player, target);
            return att < 0 && target.countCards("he") > 0 && !target.hasCard((card) => get.value(card, target) <= 0, "he");
          })) {
            return "选项二";
          }
          return "选项一";
        }
      }).forResult();
      if (result.control === "cancel2") {
        return;
      }
      const results = { bool: true, cost_data: { index: choices.indexOf(result.control) } };
      if (results.cost_data.index === 1) {
        const { targets } = await player.chooseTarget({
          prompt: "令一名其他角色弃置一张点数为6的牌，否则交给你一张牌",
          forced: true,
          filterTarget: (_card, player2, current) => current !== player2 && current.countCards("he") > 0,
          ai: (target) => {
            const att = get.attitude(player, target);
            if (att >= 0) {
              return 0;
            }
            if (!target.hasCard((card) => get.value(card, target) <= 0, "he")) {
              return -att / Math.sqrt(target.countCards("he"));
            }
            return 0;
          }
        }).forResult();
        results.targets = targets;
      } else if (results.cost_data.index === 2) {
        const { targets } = await player.chooseTarget({
          prompt: "获得一名角色装备区或判定区内点数为6的牌",
          forced: true,
          filterTarget: (_card, player2, current) => current.hasCard((card) => get.number(card) === 6 && lib.filter.canBeGained(card, current, player2), "ej"),
          ai: (target) => {
            const att = -get.sgn(get.attitude(player, target) - 0.1);
            const cards2 = target.getCards("ej", (card) => get.number(card) === 6 && lib.filter.canBeGained(card, target, player));
            let max = 0;
            for (const card of cards2) {
              const num = get.useful(card, target) * att;
              if (num > max) {
                max = num;
              }
              return max;
            }
          }
        }).forResult();
        results.targets = targets;
      }
      event.result = results;
    },
    async content(event, trigger, player) {
      const { index } = event.cost_data;
      if (index === 2) {
        const target = event.targets[0];
        await player.gainPlayerCard({
          target,
          position: "ej",
          forced: true,
          filterButton: (button) => get.number(button.link) === 6
        });
        return;
      }
      if (index === 1) {
        const target = event.targets[0];
        const discardResult = await target.chooseToDiscard({
          position: "he",
          prompt: `弃置一张点数为6的牌，否则交给${get.translation(player)}一张牌`,
          filterCard: (card) => get.number(card) === 6,
          ai: (card) => 8 - get.value(card)
        }).forResult();
        if (discardResult.bool) {
          return;
        }
        const giveResult = await target.chooseCard({
          position: "he",
          forced: true,
          prompt: `交给${get.translation(player)}一张牌`
        }).forResult();
        if (giveResult.bool) {
          await target.give(giveResult.cards, player, "giveAuto");
        }
        return;
      }
      const cards2 = [];
      for (let i = 0; i < 2; i++) {
        const card = get.cardPile2((card2) => !cards2.includes(card2) && get.number(card2) === 6);
        if (!card) {
          break;
        }
        cards2.push(card);
      }
      if (!cards2.length) {
        await player.draw(6);
        return;
      }
      let gainCards = cards2;
      if (cards2.length > 1) {
        const buttonResult = await player.chooseButton({
          createDialog: ["兴乱：选择获得其中一张", cards2],
          forced: true,
          ai: (button) => get.value(button.link, player)
        }).forResult();
        if (!buttonResult.bool) {
          return;
        }
        gainCards = buttonResult.links;
      }
      await player.gain({ cards: gainCards, animate: "gain2" });
    }
  },
  rexingluan: {
    audio: "xinfu_xingluan",
    usable: 1,
    trigger: { player: "useCardAfter" },
    filter(event, player) {
      return event.targets && event.targets.length === 1 && typeof get.number(event.card, false) === "number" && player.isPhaseUsing();
    },
    async cost(event, trigger, player) {
      const num = get.number(trigger.card, false);
      const nums = get.strNumber(num);
      const list = game.filterPlayer((current) => current.hasCard((card) => get.number(card) === num && lib.filter.canBeGained(card, current, player), "ej"));
      let result;
      if (list.length) {
        result = await player.chooseTarget({
          prompt: get.prompt(event.skill),
          prompt2: `获得一名角色装备区或判定区内的一张点数为${nums}的牌，或直接从牌堆中获得一张点数为${nums}的牌`,
          selectTarget: [0, 1],
          filterTarget: (_card, _player, target) => list.includes(target),
          ai: (target) => {
            if (!target) {
              return 1;
            }
            const att = -get.sgn(get.attitude(player, target));
            if (target.hasCard((card) => get.number(card) === num && get.effect(target, card, target, player) < 0, "j")) {
              return 1.2 * Math.abs(get.attitude(player, target));
            }
            if (target.hasCard((card) => get.number(card) === num && get.sgn(get.value(card, target) + 0.1) === att, "e")) {
              return Math.abs(get.attitude(player, target));
            }
            return 0;
          }
        }).forResult();
      } else {
        result = await player.chooseBool({
          prompt: get.prompt(event.skill),
          prompt2: `从牌堆中获得一张点数为${nums}的牌`,
          ai: () => true
        }).forResult();
      }
      result.cost_data = num;
      event.result = result;
    },
    async content(event, trigger, player) {
      const num = event.cost_data;
      if (event.targets?.length) {
        const target = event.targets[0];
        await player.gainPlayerCard({
          target,
          position: "ej",
          forced: true,
          filterButton: (button) => get.number(button.link) === num
        });
        return;
      }
      const card = get.cardPile2((i) => get.number(i, false) === num, "random");
      if (!card) {
        return;
      }
      await player.gain({ cards: [card], animate: "gain2" });
    }
  },
  //杜夫人
  yise: {
    audio: 2,
    trigger: {
      global: "gainAfter",
      player: "loseAsyncAfter"
    },
    filter(event, player, name, target) {
      if (event.name == "loseAsync") {
        if (event.type != "gain") {
          return false;
        }
      }
      return target?.isIn();
    },
    getIndex(event, player) {
      const cards2 = event.getl?.(player)?.cards2;
      if (!cards2?.length) {
        return false;
      }
      return game.filterPlayer((current) => {
        if (current == player) {
          return false;
        }
        return event.getg?.(current)?.some((card) => {
          if (!cards2.includes(card)) {
            return false;
          }
          return get.color(card, player) == "red" && current.isDamaged() || get.color(card, player) == "black";
        });
      }).sortBySeat();
    },
    async cost(event, trigger, player) {
      const target = event.indexedData;
      const colors = ["red", "black"].filter((color) => trigger.getg(target).some((card) => trigger.getl(player).cards2.includes(card) && get.color(card, player) == color));
      const result = await player.chooseButton(
        [
          get.prompt(event.skill, target),
          [
            [
              ["recover", `令${get.translation(target)}回复1点体力`],
              ["damage", `令${get.translation(target)}下次受到【杀】造成的伤害+1`]
            ],
            "textbutton"
          ]
        ],
        [1, colors.length]
      ).set("filterButton", (button) => {
        const { player: player2, target: target2, colors: colors2 } = get.event();
        const link = button.link;
        if (link == "recover") {
          return colors2.includes("red") && target2.isDamaged();
        }
        return colors2.includes("black");
      }).set("ai", (button) => {
        const { player: player2, target: target2, colors: colors2 } = get.event();
        const link = button.link;
        if (link == "recover" && get.recoverEffect(target2, player2, player2) > 0) {
          return 2;
        }
        if (link == "damage" && get.attitude(player2, target2) < 0) {
          return 1;
        }
        return 0;
      }).set("target", target).set("colors", colors).forResult();
      event.result = {
        bool: result?.bool,
        cost_data: result?.links,
        targets: [target]
      };
    },
    async content(event, trigger, player) {
      const { indexedData: target, cost_data } = event;
      if (cost_data.includes("recover")) {
        await target.recover();
      }
      if (cost_data.includes("damage")) {
        target.addSkill(event.name + "_damage");
        target.addMark(event.name + "_damage", 1, false);
        game.log(target, "下一次受到【杀】的伤害", "#g+1");
      }
    },
    subSkill: {
      damage: {
        charlotte: true,
        onremove: true,
        trigger: { player: "damageBegin3" },
        filter(event, player) {
          return event.card?.name == "sha";
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          trigger.num += player.countMark(event.name);
          player.removeSkill(event.name);
        },
        intro: { content: "下一次受到杀的伤害+#" }
      }
    }
  },
  shunshi: {
    audio: 2,
    trigger: { player: ["damageEnd", "phaseZhunbeiBegin"] },
    filter(event, player) {
      return (event.name != "damage" || player != _status.currentPhase) && player.countCards("he") > 0 && game.hasPlayer((current) => current != player && current != event.source);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        prompt: get.prompt2(event.skill),
        filterCard: true,
        filterTarget(card, player2, target) {
          return target != player2 && target != _status.event.source;
        },
        position: "he",
        source: trigger.source,
        ai1(card) {
          const { player: player2, source } = get.event();
          if (player2.hasSkill("yise")) {
            if (get.color(card, player2) == "red" && game.hasPlayer((current) => {
              return current != player2 && current != source && current.isDamaged() && get.recoverEffect(current, player2, player2) > 0;
            })) {
              return 10 - get.value(card);
            }
            if (get.color(card, player2) == "black") {
              return 4 - get.value(card);
            }
          }
          return 8 - get.value(card);
        },
        ai2(target) {
          const player2 = get.player(), card = ui.selected.cards[0];
          if (player2.hasSkill("yise")) {
            if (get.color(card) == "red" && target.isDamaged()) {
              return 2 * get.recoverEffect(target, player2, player2);
            }
            if (get.color(card) == "black") {
              return -get.attitude(player2, target);
            }
          }
          if (get.value(card, target) < 0) {
            return -get.attitude(player2, target);
          }
          if (get.value(card, target) < 1) {
            return 0.01 * -get.attitude(player2, target);
          }
          return Math.max(1, get.value(card, target) - get.value(card, player2)) * get.attitude(player2, target);
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      await player.give(event.cards, event.targets[0]);
      player.addMark(event.name + "_mark", 1, false);
      player.addTempSkill(event.name + "_mark", { player: "phaseEnd" });
    },
    subSkill: {
      mark: {
        charlotte: true,
        onremove: true,
        trigger: { player: "phaseDrawBegin2" },
        filter(event, player) {
          return !event.numFixed;
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          trigger.num += player.countMark(event.name);
        },
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("shunshi_mark");
          },
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.countMark("shunshi_mark");
            }
          }
        },
        intro: { content: "拥有#层“顺世”效果" }
      }
    }
  },
  xianwei: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      return player.hasEnabledSlot();
    },
    async content(event, trigger, player) {
      const disableResult = await player.chooseToDisable({
        ai: (event2, player2, list) => {
          const getVal = (num2) => {
            const card2 = player2.getEquip(num2);
            if (card2) {
              const val = get.value(card2);
              if (val > 0) {
                return 0;
              }
              return 5 - val;
            }
            switch (num2) {
              case "equip3":
                return 4.5;
              case "equip4":
                return 4.4;
              case "equip5":
                return 4.3;
              case "equip2":
                return (3 - player2.hp) * 1.5;
              case "equip1": {
                if (game.hasPlayer((current) => (get.realAttitude || get.attitude)(player2, current) < 0 && get.distance(player2, current) > 1)) {
                  return 0;
                }
                return 3.2;
              }
            }
          };
          list.sort((a, b) => getVal(b) - getVal(a));
          return list[0];
        }
      }).forResult();
      const cardType = disableResult.control;
      const num = player.countDisabledSlot();
      if (num < 5) {
        await player.draw(5 - num);
      }
      if (!game.hasPlayer((current) => current !== player)) {
        return;
      }
      const targetResult = await player.chooseTarget({
        filterTarget: lib.filter.notMe,
        forced: true,
        prompt: `令一名其他角色从牌堆中使用一张${get.translation(cardType)}牌`,
        ai: (target2) => {
          const card2 = get.cardPile2((card3) => get.subtype(card3) === cardType && target2.canUse(card3, target2));
          if (!card2) {
            return 0;
          }
          return get.effect(target2, card2, target2, player);
        }
      }).forResult();
      if (!targetResult.bool) {
        return;
      }
      const target = targetResult.targets[0];
      player.line(target, "green");
      const card = get.cardPile2((card2) => get.subtype(card2) === cardType && target.canUse(card2, target));
      if (card) {
        await target.chooseUseTarget({ card, nopopup: true, forced: true });
      } else {
        await target.draw();
      }
    },
    group: "xianwei_all",
    subSkill: {
      all: {
        audio: "xianwei",
        trigger: { player: "disableEquipAfter" },
        forced: true,
        filter(event, player) {
          return !player.hasEnabledSlot();
        },
        async content(event, trigger, player) {
          await player.gainMaxHp(2);
          player.addSkill("xianwei_effect");
        }
      },
      effect: {
        charlotte: true,
        mark: true,
        intro: { content: "和其他角色视为在彼此的攻击范围内" },
        mod: {
          inRange: () => true,
          inRangeOf: () => true
        }
      }
    }
  },
  rehuoshui: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    async cost(event, trigger, player) {
      const num = Math.min(game.countPlayer() - 1, Math.max(1, player.getDamagedHp()));
      let prompt2;
      if (num > 1) {
        const descriptions = ["第一名角色的非锁定技失效直到回合结束", "；第二名角色交给你一张手牌", "；第三名及之后角色弃置装备区内的所有牌"];
        prompt2 = `选择至多${get.cnNumber(num)}名其他角色。${descriptions.slice(0, Math.min(3, num)).join("")}。`;
      } else {
        prompt2 = "令一名其他角色的非锁定技本回合内失效";
      }
      event.result = await player.chooseTarget({
        selectTarget: [1, num],
        prompt: get.prompt("rehuoshui"),
        prompt2,
        filterTarget: lib.filter.notMe,
        ai: (target) => {
          let attitude = -get.attitude(player, target);
          if (attitude <= 0) {
            return 0;
          }
          if (target.hasSkillTag("maixie") || target.hasSkill("maixie_hp") || target.hasSkill("maixie_defed")) {
            attitude *= 3;
          }
          return attitude / get.threaten(target);
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const targets = event.targets;
      targets[0].addTempSkill("fengyin");
      if (targets[1]?.hasCards("h")) {
        const result = await targets[1].chooseCard({
          position: "h",
          forced: true,
          prompt: `交给${get.translation(player)}一张手牌`
        }).forResult();
        if (result.bool && result.cards?.length) {
          await targets[1].give(result.cards, player);
        }
      }
      for (const target of targets.slice(2)) {
        const equipCount = target.countCards("e");
        if (equipCount > 0) {
          await target.chooseToDiscard({
            position: "e",
            forced: true,
            selectCard: equipCount
          });
        }
      }
      await game.delayx();
    }
  },
  reqingcheng: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => lib.skill.reqingcheng.filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return target !== player && target.hasSex("male") && target.countCards("h") <= player.countCards("h");
    },
    async content(event, trigger, player) {
      await player.swapHandcards(event.target);
    },
    ai: {
      order: 1,
      result: {
        player(player, target) {
          if (target.hasCards("h")) {
            return -Math.max(get.value(target.getCards("h"), player) - get.value(player.getCards("h"), player), 0);
          }
          return 0;
        }
      }
    }
  },
  //丘力居
  koulve: {
    audio: 2,
    trigger: { source: "damageSource" },
    logTarget: "player",
    filter(event, player) {
      return event.player.isDamaged() && event.player.countCards("h") > 0 && player.isPhaseUsing();
    },
    check(event, player) {
      if (player.hp === 1 && player.isHealthy()) {
        return false;
      }
      return get.attitude(player, event.player) <= 0;
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      const result = await player.choosePlayerCard({
        target,
        position: "h",
        forced: true,
        selectButton: target.getDamagedHp()
      }).forResult();
      if (!result.bool || !result.cards?.length) {
        return;
      }
      const cards2 = result.cards;
      await player.showCards(cards2, `${get.translation(player)}发动了【宼略】`);
      const gains = [];
      let red = false;
      for (const card of cards2) {
        const type = get.type2(card, target);
        if ((type === "basic" || type === "trick") && get.tag(card, "damage") > 0) {
          gains.push(card);
        }
        if (!red && get.color(card, target) === "red") {
          red = true;
        }
      }
      if (gains.length) {
        await player.gain({ cards: gains, animate: "give" });
      }
      if (!red) {
        return;
      }
      if (player.isDamaged()) {
        await player.loseMaxHp();
      } else {
        await player.loseHp();
      }
      await player.draw(2);
    }
  },
  qljsuiren: {
    audio: 2,
    trigger: { player: "die" },
    forceDie: true,
    skillAnimation: true,
    animationColor: "gray",
    filter(event, player) {
      return player.hasCards("h", (card) => {
        const type = get.type(card, null, player);
        return (type === "basic" || type === "trick") && get.tag(card, "damage") > 0;
      });
    },
    async cost(event, trigger, player) {
      const filterCard = (card) => {
        const type = get.type(card, null, player);
        return (type === "basic" || type === "trick") && get.tag(card, "damage") > 0;
      };
      const cards2 = player.getCards("h", filterCard);
      event.result = await player.chooseTarget({
        filterTarget: lib.filter.notMe,
        prompt: get.prompt(event.skill),
        prompt2: "将所有伤害性基本牌和锦囊牌交给一名其他角色",
        ai: (target) => {
          let att = get.attitude(player, target);
          if (att <= 0) {
            return 0;
          }
          if (target.hasSkillTag("nogain")) {
            att /= 100;
          }
          let num = 0.1;
          for (const card of cards2) {
            num += Math.max(0, target.getUseValue(card));
          }
          return num * att;
        }
      }).set("forceDie", true).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const filterCard = (card) => {
        const type = get.type(card, null, player);
        return (type === "basic" || type === "trick") && get.tag(card, "damage") > 0;
      };
      await player.give(player.getCards("h", filterCard), target, "give");
    }
  },
  //胡车儿
  redaoji: {
    audio: 2,
    trigger: { global: "useCard" },
    filter(event, player) {
      if (player === event.player || get.subtype(event.card, false) !== "equip1" || event.player.isDead() && !event.cards.filterInD().length) {
        return false;
      }
      const all = event.player.getAllHistory("useCard");
      for (const evt of all) {
        if (get.subtype(evt.card, false) === "equip1") {
          return evt === event;
        }
      }
      return false;
    },
    async cost(event, trigger, player) {
      const cards2 = trigger.cards.filterInD();
      const list = [];
      const addIndex = cards2.length ? 0 : 1;
      if (cards2.length) {
        list.push(`获得${get.translation(cards2)}`);
      }
      if (trigger.player.isIn()) {
        list.push(`令${get.translation(trigger.player)}本回合不能使用或打出【杀】`);
      }
      const result = await player.chooseControl({
        controls: ["cancel2"],
        choiceList: list,
        prompt: get.prompt(event.skill, trigger.player),
        ai: () => {
          if (addIndex === 0) {
            const choice = get.attitude(player, trigger.player) < 0 ? 1 : "cancel2";
            if (player.countMark("fuzhong") === 3) {
              return choice;
            }
            if (get.effect(trigger.targets[0], trigger.card, trigger.player, player) <= 0) {
              return 0;
            }
            return choice;
          }
          return get.attitude(player, trigger.player) < 0 ? 0 : "cancel2";
        }
      }).forResult();
      event.result = {
        bool: result.control !== "cancel2",
        targets: [trigger.player],
        cost_data: {
          index: result.index + addIndex,
          cards: cards2
        }
      };
    },
    async content(event, trigger, player) {
      await game.delayx();
      if (event.cost_data.index === 0) {
        await player.gain({ cards: event.cost_data.cards, animate: "gain2" });
        return;
      }
      trigger.player.addTempSkill("redaoji2");
    }
  },
  redaoji2: {
    charlotte: true,
    mark: true,
    mod: {
      cardEnabled(card) {
        if (card.name === "sha") {
          return false;
        }
      },
      cardRespondable(card) {
        if (card.name === "sha") {
          return false;
        }
      }
    },
    intro: {
      content: "本回合不能使用或打出杀"
    }
  },
  fuzhong: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    filter(event, player) {
      return player.countMark("fuzhong") > 3;
    },
    async content(event, trigger, player) {
      const result = await player.chooseTarget({
        filterTarget: lib.filter.notMe,
        prompt: "对一名其他角色造成1点伤害",
        forced: true,
        ai: (target) => {
          const player2 = _status.event.player;
          return get.damageEffect(target, player2, player2);
        }
      }).forResult();
      if (result.bool) {
        const target = result.targets[0];
        player.line(target);
        await target.damage({ nocard: true });
      }
      player.removeMark("fuzhong", 4);
    },
    marktext: "重",
    intro: { content: "mark" },
    group: ["fuzhong_gain", "fuzhong_yingzi"],
    mod: {
      maxHandcard(player, num) {
        if (player.countMark("fuzhong") > 2) {
          return num + 3;
        }
      },
      globalFrom(player, target, num) {
        if (player.countMark("fuzhong") > 1) {
          return num - 2;
        }
      }
    },
    subSkill: {
      gain: {
        audio: "fuzhong",
        trigger: {
          player: "gainAfter",
          global: "loseAsyncAfter"
        },
        forced: true,
        filter(event, player) {
          return player !== _status.currentPhase && event.getg(player).length > 0;
        },
        async content(event, trigger, player) {
          player.addMark("fuzhong", 1);
        }
      },
      yingzi: {
        audio: "fuzhong",
        trigger: { player: "phaseDrawBegin2" },
        forced: true,
        filter(event, player) {
          return !event.numFixed && player.countMark("fuzhong") > 0;
        },
        async content(event, trigger, player) {
          trigger.num++;
        }
      }
    }
  },
  //董承
  xuezhao: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.maxHp > 0 && player.hasCards("h");
    },
    filterCard: true,
    position: "h",
    filterTarget: lib.filter.notMe,
    selectTarget() {
      return [1, _status.event.player.maxHp];
    },
    check(card) {
      return 2 * (_status.event.player.maxHp + 2) - get.value(card);
    },
    async content(event, trigger, player) {
      const { target } = event;
      let result = { bool: false };
      if (target.hasCards("he")) {
        result = await target.chooseCard({
          position: "he",
          prompt: `交给${get.translation(player)}一张牌并摸一张牌，或不能响应其使用的牌直到回合结束`,
          ai: (card) => {
            const player2 = _status.event.player;
            const target2 = _status.event.getParent().player;
            const val = get.value(card);
            if (get.attitude(player2, target2) <= 0) {
              return -val;
            }
            if (get.name(card, target2) === "sha" && target2.hasValueTarget(card)) {
              return 30 - val;
            }
            return 20 - val;
          }
        }).forResult();
      }
      if (!result.bool) {
        player.addTempSkill("xuezhao_hit");
        player.markAuto("xuezhao_hit", [target]);
        return;
      }
      player.addTempSkill("xuezhao_sha");
      player.addMark("xuezhao_sha", 1, false);
      await target.give(result.cards, player);
      await target.draw();
    },
    async contentAfter(event, trigger, player) {
      if (!player.getHistory("gain", (evt) => evt.getParent("useSkill") === event.getParent("useSkill")).length) {
        await player.drawTo(player.maxHp);
      }
    },
    ai: {
      threaten: 2.4,
      order: 3.6,
      result: {
        player(player, target) {
          if (get.attitude(target, player) > 0) {
            if (target.hasCards("e", (card) => get.value(card, target) < 0)) {
              return 3;
            }
            return Math.sqrt(target.countCards("he"));
          }
          if (target.mayHaveShan(player, "use") && player.hasCards("hs", (card) => !ui.selected.cards.includes(card) && get.name(card) === "sha" && player.canUse(card, target) && get.effect(target, card, player, player) !== 0)) {
            return -Math.sqrt(Math.abs(get.attitude(player, target))) / 2;
          }
          return 0.1;
        }
      }
    },
    subSkill: {
      sha: {
        charlotte: true,
        onremove: true,
        marktext: "血",
        intro: { content: "多杀#刀，誓诛曹贼！" },
        mod: {
          cardUsable(card, player, num) {
            if (card.name === "sha") {
              return num + player.countMark("xuezhao_sha");
            }
          }
        }
      },
      hit: {
        charlotte: true,
        onremove: true,
        marktext: "诏",
        intro: { content: "$篡汉，其心可诛！" },
        trigger: { player: "useCard1" },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          trigger.directHit.addArray(player.getStorage("xuezhao_hit"));
        },
        ai: {
          directHit_ai: true,
          skillTagFilter(player, tag, arg) {
            return player.getStorage("xuezhao_hit").includes(arg.target);
          }
        }
      }
    }
  },
  //唐姬
  kangge: {
    audio: 2,
    trigger: { player: "phaseBegin" },
    direct: true,
    filter(event, player) {
      return player.phaseNumber === 1 && !player.storage.kangge && game.hasPlayer((current) => current !== player);
    },
    async content(event, trigger, player) {
      const result = await player.chooseTarget({
        prompt: "请选择【抗歌】的目标",
        prompt2: "其于回合外摸牌后，你摸等量的牌；其进入濒死状态时，你可令其回复体力至1点；其死亡后，你弃置所有牌并失去1点体力",
        filterTarget: lib.filter.notMe,
        forced: true,
        ai: (target2) => get.attitude(_status.event.player, target2)
      }).forResult();
      if (!result.bool) {
        return;
      }
      const target = result.targets[0];
      player.logSkill("kangge", target);
      if ((get.mode() !== "identity" || player.identity !== "nei") && (target.identityShown || typeof target.ai.expose === "number" && target.ai.expose > 0.5)) {
        player.addExpose(0.4);
      }
      player.addSkill("kangge_clear");
      player.storage.kangge = target;
      player.markSkill("kangge");
      await game.delayx();
    },
    intro: { content: "已指定$为目标" },
    group: ["kangge_draw", "kangge_dying", "kangge_die"],
    subSkill: {
      draw: {
        audio: "kangge",
        trigger: {
          global: ["gainAfter", "loseAsyncAfter"]
        },
        forced: true,
        filter(event, player) {
          if (player.countMark("kangge_draw") >= 3) {
            return false;
          }
          const target = player.storage.kangge;
          return target && target !== _status.currentPhase && event.getg(target).length > 0;
        },
        logTarget: "player",
        async content(event, trigger, player) {
          const num = Math.min(3 - player.countMark("kangge_draw"), trigger.getg(player.storage.kangge).length);
          player.addMark("kangge_draw", num, false);
          await player.draw(num);
        }
      },
      clear: {
        trigger: { global: "phaseBeginStart" },
        forced: true,
        firstDo: true,
        popup: false,
        charlotte: true,
        filter(event, player) {
          return player.countMark("kangge_draw") > 0;
        },
        async content(event, trigger, player) {
          player.removeMark("kangge_draw", player.countMark("kangge_draw"), false);
        }
      },
      dying: {
        audio: "kangge",
        trigger: { global: "dying" },
        logTarget: "player",
        filter(event, player) {
          return event.player === player.storage.kangge && event.player.hp < 1 && !player.hasSkill("kangge_temp");
        },
        check(event, player) {
          return get.attitude(player, event.player) > 0;
        },
        prompt2: "令其将体力值回复至1点",
        async content(event, trigger, player) {
          player.addTempSkill("kangge_temp", "roundStart");
          await trigger.player.recover(1 - trigger.player.hp);
        }
      },
      temp: {},
      die: {
        audio: "kangge",
        trigger: { global: "dieAfter" },
        filter(event, player) {
          return event.player === player.storage.kangge;
        },
        forced: true,
        async content(event, trigger, player) {
          const cards2 = player.getCards("he");
          if (cards2.length) {
            await player.discard({ cards: cards2 });
          }
          await player.loseHp();
        }
      }
    },
    ai: {
      threaten: 2
    }
  },
  jielie: {
    audio: 2,
    trigger: { player: "damageBegin4" },
    filter(event, player) {
      return (!event.source || event.source !== player && event.source !== player.storage.kangge) && player.storage.kangge && player.storage.kangge.isIn();
    },
    async cost(event, trigger, player) {
      const result = await player.chooseControl({
        controls: [...lib.suit, "cancel2"],
        prompt: get.prompt("jielie"),
        prompt2: `防止伤害并改为失去等量体力，且令${get.translation(player.storage.kangge)}从弃牌堆中随机获得等量的花色牌`,
        ai: () => {
          if (get.attitude(player, player.storage.kangge) <= 0) {
            return "cancel2";
          }
          return lib.suit.randomGet();
        }
      }).forResult();
      event.result = {
        bool: result.control !== "cancel2",
        cost_data: {
          suit: result.control
        }
      };
    },
    logTarget(_event, player) {
      return player?.storage.kangge;
    },
    async content(event, trigger, player) {
      const { suit } = event.cost_data;
      trigger.cancel();
      await player.loseHp(trigger.num);
      const cards2 = [];
      while (cards2.length < trigger.num) {
        const card = get.discardPile((card2) => get.suit(card2, false) === suit && !cards2.includes(card2), "random");
        if (card) {
          cards2.push(card);
        } else {
          break;
        }
      }
      if (cards2.length) {
        await player.storage.kangge.gain({
          cards: cards2,
          animate: "gain2"
        });
      }
    }
  },
  //张横
  dangzai: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return !player.isDisabledJudge() && game.hasPlayer(function(current) {
        return current != player && current.countCards("j", function(card) {
          return player.canAddJudge(card);
        }) > 0;
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(
        function(card, player2, target) {
          return target != player2 && target.countCards("j", function(card2) {
            return player2.canAddJudge(card2);
          }) > 0;
        },
        get.prompt(event.skill),
        "将一名其他角色判定区内的任意张牌移动到你的判定区内"
      ).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const result = await player.choosePlayerCard(target, "j", true, [1, Infinity]).set("filterButton", function(button) {
        return _status.event.player.canAddJudge(button.link);
      }).forResult();
      if (result.bool && result.cards) {
        while (result.cards.length) {
          const card = result.cards.shift();
          target.$give(card, player);
          await game.delay();
          const name = card.viewAs || card.name;
          if (card.name != name) {
            await player.addJudge(name, card);
          } else {
            await player.addJudge(card);
          }
        }
      }
    }
  },
  liangjue: {
    audio: 2,
    trigger: {
      player: "loseAfter",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    forced: true,
    getIndex(event, player, triggername) {
      let num = 0;
      if (event.player == player) {
        if (event.name == "equip" && get.color(event.card, player) == "black") {
          num++;
        }
        if (event.name == "addJudge" && get.color(event.cards[0], player) == "black") {
          num++;
        }
      }
      if (!event.getl) {
        return num;
      }
      let evt = event.getl(player);
      if (evt.es && evt.es.length) {
        for (var i of evt.es) {
          if (get.color(i, player) == "black") {
            num++;
          }
        }
      }
      if (evt.js && evt.js.length) {
        for (var i of evt.js) {
          if (get.color(i, player) == "black") {
            num++;
          }
        }
      }
      return num;
    },
    async content(event, trigger, player) {
      await player.draw(2);
      if (player.hp > 1) {
        await player.loseHp();
      }
    }
  },
  //狼灭
  langmie: {
    audio: 2,
    trigger: { global: "phaseUseEnd" },
    filter(event, player) {
      if (player === event.player || !player.hasCards("he")) {
        return false;
      }
      const map = {};
      const list = event.player.getHistory("useCard", (evt) => {
        const phaseUseEvent = evt.getParent("phaseUse");
        return phaseUseEvent === event;
      });
      for (const evt of list) {
        const name = get.type2(evt.card, false);
        if (!map[name]) {
          map[name] = true;
          continue;
        }
        return true;
      }
    },
    frequent: true,
    async content(event, trigger, player) {
      await player.draw();
    },
    group: "langmie_damage"
  },
  langmie_damage: {
    audio: "langmie",
    trigger: { global: "phaseEnd" },
    sourceSkill: "langmie",
    filter(event, player) {
      return event.player !== player && (event.player.getStat("damage") || 0) > 1 && player.hasCards("he");
    },
    async cost(event, trigger, player) {
      const next = player.chooseToDiscard({
        position: "he",
        chooseonly: true,
        prompt: get.prompt("langmie", trigger.player),
        prompt2: "弃置一张牌并对其造成1点伤害",
        ai: (card) => {
          if (!_status.event.goon) {
            return 0;
          }
          return 7 - get.value(card);
        }
      }).set("goon", get.damageEffect(trigger.player, player, player) > 0);
      event.result = await next.forResult();
      event.result.targets = [trigger.player];
    },
    async content(event, trigger, player) {
      await player.discard(event.cards);
      await trigger.player.damage();
    },
    ai: { expose: 0.2 }
  },
  //牛金
  recuorui: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "thunder",
    filter(event, player) {
      return player.hp > 0 && game.hasPlayer((current) => current !== player && current.hasGainableCards(player, "h"));
    },
    filterTarget(card, player, target) {
      return target !== player && target.hasGainableCards(player, "h");
    },
    selectTarget() {
      return [1, _status.event.player.hp];
    },
    async content(event, trigger, player) {
      if (event.num === 0) {
        player.awakenSkill(event.name);
      }
      await player.gainPlayerCard({
        target: event.target,
        forced: true,
        position: "h"
      });
    },
    ai: {
      order: 10,
      result: {
        player: 1,
        target(player, target) {
          if (target.hasSkillTag("noh")) {
            return 0;
          }
          return -1;
        }
      }
    }
  },
  reliewei: {
    audio: 2,
    trigger: { global: "dying" },
    filter(event, player) {
      return player === _status.currentPhase || player.getHistory("useSkill", (evt) => evt.skill === "reliewei").length < player.getHp();
    },
    frequent: true,
    async content(event, trigger, player) {
      await player.draw();
    }
  },
  //张邈
  mouni: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    direct: true,
    filter(event, player) {
      return player.hasCards("h", "sha");
    },
    async content(event, trigger, player) {
      player.addSkill("mouni2");
      const result = await player.chooseTarget({
        prompt: get.prompt2("mouni"),
        filterTarget: lib.filter.notMe,
        ai: (target2) => {
          const player2 = _status.event.player;
          const cards3 = player2.getCards("h", "sha");
          if (get.attitude(player2, target2) >= 0 || !player2.canUse(cards3[0], target2, false) || !player2.hasJudge("lebu") && target2.mayHaveShan(player2, "use") && !player2.hasSkillTag(
            "directHit_ai",
            true,
            {
              target: target2,
              card: cards3[0]
            },
            true
          )) {
            return 0;
          }
          return get.effect(target2, cards3[0], player2, player2);
        }
      }).forResult();
      if (!result.bool) {
        return;
      }
      const target = result.targets[0];
      event.target = target;
      player.logSkill("mouni", target);
      let cards2 = player.getCards("h", "sha");
      while (!event.mouni_dying) {
        const hs = player.getCards("h");
        cards2 = cards2.filter(
          (card2) => hs.includes(card2) && get.name(card2, player) === "sha" && player.canUse(
            {
              name: "sha",
              nature: get.nature(card2, player),
              isCard: true,
              cards: [card2]
            },
            target,
            false
          )
        );
        if (!cards2.length) {
          break;
        }
        const card = cards2.randomRemove(1)[0];
        await player.useCard({
          card,
          targets: [target],
          addCount: false
        });
      }
      if (player.getHistory("useCard", (evt) => {
        return evt.getParent() === event && !player.getHistory("sourceDamage", (evt2) => evt.card === evt2.card).length;
      }).length) {
        player.skip("phaseUse");
        player.skip("phaseDiscard");
      }
      player.removeSkill("mouni2");
    }
  },
  mouni2: {
    charlotte: true,
    trigger: { global: "dying" },
    forced: true,
    firstDo: true,
    popup: false,
    sourceSkill: "mouni",
    filter(event, player) {
      const evt = event.getParent("mouni");
      return evt && evt.player === player && evt.target === event.player;
    },
    async content(event, trigger, player) {
      trigger.getParent("mouni").mouni_dying = true;
    }
  },
  zongfan: {
    derivation: "zhangu",
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    juexingji: true,
    forced: true,
    skillAnimation: true,
    animationColor: "gray",
    filter(event, player) {
      return !player.getHistory("skipped").includes("phaseUse") && player.countHistory("useCard", (evt) => evt.getParent().name === "mouni") > 0;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const num = player.countCards("he");
      if (num > 0) {
        const result = await player.chooseCardTarget({
          prompt: "是否将任意张牌交给一名其他角色？",
          selectCard: [1, num],
          filterCard: true,
          filterTarget: lib.filter.notMe,
          position: "he",
          allowChooseAll: true,
          ai1(card) {
            if (card.name === "du") {
              return 10;
            }
            if (ui.selected.cards.length && ui.selected.cards[0].name === "du") {
              return 0;
            }
            if (ui.selected.cards.length > 4 || !game.hasPlayer((current) => get.attitude(player, current) > 0 && !current.hasSkillTag("nogain"))) {
              return 0;
            }
            return 1 / Math.max(0.1, get.value(card));
          },
          ai2(target) {
            let att = get.attitude(player, target);
            if (ui.selected.cards[0].name === "du") {
              return -att;
            }
            if (target.hasSkillTag("nogain")) {
              att /= 6;
            }
            return att;
          }
        }).forResult();
        if (result.bool) {
          const cards2 = result.cards;
          const target = result.targets[0];
          const gainNum = Math.min(5, cards2.length);
          await player.give(cards2, target);
          await player.gainMaxHp(gainNum);
          await player.recover(gainNum);
        }
      }
      await player.changeSkills(["zhangu"], ["mouni"]);
    },
    ai: {
      combo: "mouni"
    }
  },
  zhangu: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      return player.maxHp > 1 && (!player.hasCards("h") || !player.hasCards("e"));
    },
    async content(event, trigger, player) {
      const cards2 = [];
      const types = [];
      for (let i = 0; i < 3; i++) {
        const card = get.cardPile2((card2) => !cards2.includes(card2) && !types.includes(get.type2(card2, false)));
        if (!card) {
          break;
        }
        cards2.push(card);
        types.push(get.type2(card, false));
      }
      if (cards2.length) {
        await player.gain({ cards: cards2, animate: "gain2" });
      }
      await player.loseMaxHp();
    }
  },
  //梁兴
  lulve: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      const hs = player.countCards("h");
      return hs > 1 && game.hasPlayer((target) => {
        const ts = target.countCards("h");
        return target !== player && ts > 0 && hs > ts;
      });
    },
    direct: true,
    async content(event, trigger, player) {
      const result = await player.chooseTarget({
        prompt: get.prompt2("lulve"),
        filterTarget: (card, player2, target2) => {
          const hs = player2.countCards("h");
          const ts = target2.countCards("h");
          return target2 !== player2 && ts > 0 && hs > ts;
        },
        ai: (target2) => {
          const player2 = _status.event.player;
          const att = get.attitude(player2, target2);
          if (target2.isTurnedOver()) {
            return att / 10;
          }
          if (!player2.hasShan() && target2.canUse({ name: "sha", isCard: true }, player2, false) && get.effect(player2, { name: "sha", isCard: true }, target2, player2) < 0 && player2.hp < 4) {
            return 0;
          }
          return -att * Math.sqrt(target2.countCards("h"));
        }
      }).forResult();
      if (!result.bool) {
        return;
      }
      const target = result.targets[0];
      player.logSkill("lulve", target);
      const str = get.translation(player);
      const controlResult = await target.chooseControl({
        choiceList: [`将所有手牌交给${str}，然后其将武将牌翻面`, `将武将牌翻面，然后视为对${str}使用【杀】`],
        ai: () => {
          const player2 = _status.event.player;
          const target2 = _status.event.getParent().player;
          if (player2.isTurnedOver()) {
            return 1;
          }
          if (!target2.hasShan() && player2.canUse({ name: "sha", isCard: true }, target2, false) && get.effect(target2, { name: "sha", isCard: true }, player2, player2) < 0) {
            return 0;
          }
          return Math.random() < 0.5 ? 0 : 1;
        }
      }).forResult();
      if (controlResult.index === 0) {
        await target.give(target.getCards("h"), player);
        await player.turnOver();
        return;
      }
      await target.turnOver();
      if (target.canUse({ name: "sha", isCard: true }, player, false)) {
        await target.useCard({
          card: { name: "sha", isCard: true },
          targets: [player],
          addCount: false
        });
      }
    }
  },
  lxzhuixi: {
    audio: 2,
    trigger: {
      player: "damageBegin3",
      source: "damageBegin1"
    },
    forced: true,
    logTarget: "player",
    filter(event, player) {
      return event.source && event.player.isTurnedOver() !== event.source.isTurnedOver();
    },
    async content(event, trigger, player) {
      trigger.num++;
    },
    ai: {
      combo: "lulve",
      halfneg: true
    }
  },
  //陶谦和曹嵩
  reyirang: {
    audio: "yirang",
    audioname: ["re_taoqian"],
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      if (!player.hasCards("he", (card) => get.type(card) !== "basic")) {
        return false;
      }
      return game.hasPlayer((current) => current !== player);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget: (_card, player2, target) => target !== player2,
        ai: (target) => (get.attitude(_status.event.player, target) - 2) * target.maxHp
      }).forResult();
    },
    async content(event, trigger, player) {
      const cards2 = player.getCards("he", (card) => get.type(card) !== "basic");
      const target = event.targets[0];
      await player.give(cards2, target, "give");
      if (target.maxHp <= player.maxHp) {
        return;
      }
      await player.gainMaxHp({
        num: target.maxHp - player.maxHp,
        forced: true
      });
      await player.recover(cards2.length);
    }
  },
  cslilu: {
    audio: 2,
    trigger: { player: "phaseDrawBegin1" },
    filter(event, player) {
      return !event.numFixed;
    },
    check(event, player) {
      return Math.min(player.maxHp, 5) - player.countCards("h") > 3 || game.hasPlayer((current) => current !== player && get.attitude(player, current) > 0);
    },
    async content(event, trigger, player) {
      trigger.changeToZero();
      await player.drawTo(Math.min(player.maxHp, 5));
      const handCount = player.countCards("h");
      if (!handCount) {
        return;
      }
      let prompt = "将至少一张手牌交给一名其他角色";
      const markCount = player.countMark("cslilu");
      if (markCount < handCount) {
        if (markCount > 0) {
          prompt += `。若给出的牌数大于${get.cnNumber(markCount)}张，则你`;
        } else {
          prompt += "，并";
        }
        prompt += "加1点体力上限并回复1点体力";
      }
      const hasBeneficiary = game.hasPlayer((current) => current !== player && get.attitude(player, current) > 0 && !current.hasSkillTag("nogain") && !current.hasJudge("lebu"));
      const goon = hasBeneficiary && markCount < handCount ? markCount + 1 : 1;
      const result = await player.chooseCardTarget({
        prompt,
        filterCard: true,
        filterTarget: lib.filter.notMe,
        selectCard: [1, Infinity],
        forced: true,
        ai1: (card) => {
          if (ui.selected.cards.length >= _status.event.goon) {
            return 0;
          }
          if (get.tag(card, "damage") && game.hasPlayer((current) => current !== player && get.attitude(player, current) > 0 && !current.hasSkillTag("nogain") && !current.hasJudge("lebu") && current.hasValueTarget(card))) {
            return 1;
          }
          return 1 / Math.max(0.1, get.value(card));
        },
        ai2: (target) => Math.sqrt(5 - Math.min(4, target.countCards("h"))) * get.attitude(_status.event.player, target),
        allowChooseAll: true
      }).set("goon", goon).forResult();
      if (!result.bool) {
        return;
      }
      const currentMarkCount = player.countMark("cslilu");
      const giveEvent = player.give(result.cards, result.targets[0]);
      let gainMaxHpEvent;
      let recoverEvent;
      if (result.cards.length > currentMarkCount) {
        gainMaxHpEvent = player.gainMaxHp();
        recoverEvent = player.recover();
      }
      player.storage.cslilu = result.cards.length;
      player.markSkill("cslilu");
      await giveEvent;
      if (gainMaxHpEvent) {
        await gainMaxHpEvent;
        await recoverEvent;
      }
    }
  },
  csyizheng: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget: lib.filter.notMe,
        ai: (target) => {
          if (target.isTurnedOver() || target.hasJudge("lebu")) {
            return 0;
          }
          return get.attitude(_status.event.player, target) * Math.max(0, target.countCards("h") - 2);
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.storage.csyizheng2 = target;
      player.addTempSkill("csyizheng2", { player: "phaseBegin" });
    },
    ai: {
      combo: "cslilu"
    }
  },
  csyizheng2: {
    audio: "csyizheng",
    trigger: {
      global: ["recoverBegin", "damageBegin1"]
    },
    forced: true,
    charlotte: true,
    sourceSkill: "csyizheng",
    logTarget(event) {
      return event.name === "damage" ? event.source : event.player;
    },
    filter(event, player) {
      const target = lib.skill.csyizheng2.logTarget(event);
      if (target !== player.storage.csyizheng2) {
        return false;
      }
      return player.maxHp > target.maxHp;
    },
    async content(event, trigger, player) {
      await player.loseMaxHp();
      trigger.num++;
    },
    mark: "character",
    intro: {
      content: "$造成伤害或回复体力时，若你的体力上限大于其，则你减1点体力上限，然后此伤害/回复量+1"
    }
  },
  reyixiang: {
    audio: "yixiang",
    audioname: ["re_taoqian"],
    trigger: { player: "damageBegin1" },
    forced: true,
    filter(event, player) {
      const evt = event.getParent(2);
      if (evt.name !== "useCard" || evt.card !== event.card) {
        return false;
      }
      const source = evt.player;
      const phsu = evt.getParent("phaseUse");
      if (!source || source === player || source !== phsu.player) {
        return false;
      }
      return source.getHistory("useCard", (evt2) => evt2.getParent("phaseUse") === phsu)[0] === evt;
    },
    async content(event, trigger, player) {
      trigger.num--;
    },
    group: "reyixiang_card",
    subSkill: {
      card: {
        audio: "yixiang",
        audioname: ["re_taoqian"],
        trigger: { target: "useCardToTargeted" },
        forced: true,
        filter(event, player) {
          if (get.color(event.card) !== "black") {
            return false;
          }
          const evt = event.getParent();
          const source = evt.player;
          const phsu = evt.getParent("phaseUse");
          if (!source || source === player || source !== phsu.player) {
            return false;
          }
          return source.getHistory("useCard", (evt2) => evt2.getParent("phaseUse") === phsu).indexOf(evt) === 1;
        },
        async content(event, trigger, player) {
          trigger.excluded.add(player);
        }
      }
    },
    ai: {
      effect: {
        target(card, player, target, current, isLink) {
          if (isLink || typeof card !== "object" || !player.isPhaseUsing()) {
            return;
          }
          let num;
          const evt = _status.event.getParent("useCard");
          const evt2 = _status.event.getParent("phaseUse");
          if (evt.card === card) {
            num = player.getHistory("useCard", (evt3) => evt3.getParent("phaseUse") === evt2).indexOf(evt);
          } else {
            num = player.getHistory("useCard", (evt3) => evt3.getParent("phaseUse") === evt2).length;
          }
          if (num < 0 || num > 1) {
            return;
          }
          if (num === 0 && get.tag(card, "damage")) {
            if (target.hasSkillTag("filterDamage", null, {
              player,
              card
            }) || !player.hasSkillTag("damageBonus", true, {
              target,
              card
            })) {
              return "zeroplayertarget";
            }
            return [0.5, 0, 0.5, 0];
          }
          if (num === 1 && get.color(card) === "black") {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  //赵忠
  yangzhong: {
    audio: 2,
    trigger: {
      source: "damageSource",
      player: "damageEnd"
    },
    direct: true,
    filter(event, player) {
      const target = event.player;
      const source = event.source;
      if (player !== source && !player.hasSkill("yangzhong")) {
        return false;
      }
      if (!target || !source || !target.isIn() || !source.isIn()) {
        return false;
      }
      return source.countCards("he") > 1;
    },
    async content(event, trigger, player) {
      const next = trigger.source.chooseToDiscard({
        prompt: `是否对${get.translation(trigger.player)}发动【殃众】？`,
        prompt2: "弃置两张牌，并令其失去1点体力",
        position: "he",
        selectCard: 2,
        ai: (card) => {
          const evt = _status.event;
          if (get.attitude(evt.player, evt.getTrigger().player) >= 0) {
            return 0;
          }
          return 7 - get.value(card);
        }
      });
      next.logSkill = ["yangzhong", trigger.player];
      const result = await next.forResult();
      if (result.bool) {
        await trigger.player.loseHp();
      }
    }
  },
  huangkong: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    forced: true,
    filter(event, player) {
      if (player === _status.currentPhase || player.hasCards("h")) {
        return false;
      }
      return event.card.name === "sha" || get.type(event.card, null, false) === "trick";
    },
    async content(event, trigger, player) {
      await player.draw(2);
    }
  },
  hfjieying: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget: lib.filter.notMe,
        ai: (target) => get.attitude(player, target) * (1 + target.countCards("h", (card) => !get.tag(card, "damage") && target.hasValueTarget(card))) / (1 + target.countCards("h"))
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      target.addTempSkill("hfjieying2", { player: "phaseEnd" });
    },
    ai: {
      expose: 0.05
    }
  },
  hfjieying2: {
    mod: {
      cardEnabled(card, player) {
        return player.storage.hfjieying2 ? false : void 0;
      },
      cardSavable(card, player) {
        return player.storage.hfjieying2 ? false : void 0;
      },
      targetInRange(card, player) {
        if (player === _status.currentPhase && (card.name === "sha" || get.type(card) === "trick")) {
          return true;
        }
      },
      aiOrder(player, card, num) {
        const info = get.info(card);
        if (!get.tag(card, "damage") && (!info || !info.toself)) {
          return num + 8;
        }
      }
    },
    onremove: true,
    trigger: { player: "useCard2" },
    direct: true,
    charlotte: true,
    sourceSkill: "hfjieying",
    filter(event, player) {
      if (player !== _status.currentPhase || event.targets.length !== 1) {
        return false;
      }
      const card = event.card;
      if (card.name !== "sha" && get.type(card) !== "trick") {
        return false;
      }
      const info = get.info(card);
      if (info.allowMultiple === false) {
        return false;
      }
      if (!event.targets || info.multitarget) {
        return false;
      }
      return game.hasPlayer((current) => !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current));
    },
    async content(event, trigger, player) {
      const result = await player.chooseTarget({
        prompt: get.prompt("hfjieying2"),
        prompt2: `为${get.translation(trigger.card)}增加一个目标`,
        filterTarget: (card, player2, target) => !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player2, target),
        ai: (target) => {
          const trigger2 = _status.event.getTrigger();
          const player2 = _status.event.player;
          return get.effect(target, trigger2.card, player2, player2);
        }
      }).set("card", trigger.card).set("targets", trigger.targets).forResult();
      if (!result.bool) {
        return;
      }
      if (!event.isMine() && !event.isOnline()) {
        await game.delayx();
      }
      const targets = result.targets;
      player.logSkill("hfjieying2", targets);
      trigger.targets.addArray(targets);
    },
    group: "hfjieying3",
    mark: true,
    intro: {
      content(player) {
        if (player) {
          return "不能使用牌直到回合结束";
        }
        return "使用【杀】或普通锦囊牌时无距离限制且可以多指定一个目标";
      }
    }
  },
  hfjieying3: {
    trigger: { source: "damageSource" },
    forced: true,
    popup: false,
    sourceSkill: "hfjieying",
    filter(event, player) {
      return !player.storage.hfjieying2 && player === _status.currentPhase;
    },
    async content(event, trigger, player) {
      player.storage.hfjieying2 = true;
    }
  },
  weipo: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    forced: true,
    filter(event, player) {
      return player !== event.player && player.countCards("h") < Math.min(5, player.maxHp) && (event.card.name === "sha" || get.type(event.card) === "trick");
    },
    async content(event, trigger, player) {
      player.addTempSkill("weipo2");
      await player.drawTo(Math.min(5, player.maxHp));
      const evt = trigger.getParent();
      if (!evt.weipo) {
        evt.weipo = {};
      }
      evt.weipo[player.playerid] = player.countCards("h");
    }
  },
  weipo2: {
    charlotte: true,
    trigger: { global: "useCardAfter" },
    forced: true,
    popup: false,
    sourceSkill: "weipo",
    filter(event, player) {
      return event.weipo && event.weipo[player.playerid] !== void 0 && event.weipo[player.playerid] > player.countCards("h");
    },
    async content(event, trigger, player) {
      player.tempBanSkill("weipo", { player: "phaseBegin" });
      if (!player.hasCards("h") || !trigger.player.isIn()) {
        return;
      }
      const result = await player.chooseCard({
        position: "h",
        forced: true,
        prompt: `将一张手牌交给${get.translation(trigger.player)}`
      }).forResult();
      if (result.bool) {
        await player.give(result.cards, trigger.player);
      }
    }
  },
  refuqi: {
    audio: "fuqi",
    forced: true,
    trigger: {
      player: "useCard"
    },
    filter(event, player) {
      return event.card && (get.type(event.card) === "trick" || get.type(event.card) === "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name)) && game.hasPlayer((current) => current !== player && get.distance(player, current) <= 1);
    },
    async content(event, trigger, player) {
      trigger.directHit.addArray(game.filterPlayer((current) => current !== player && get.distance(player, current) <= 1));
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        return get.distance(player, arg.target) <= 1;
      }
    }
  },
  zhuide: {
    audio: 2,
    trigger: { player: "die" },
    forceDie: true,
    skillAnimation: true,
    animationColor: "thunder",
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget: lib.filter.notMe,
        ai: (target) => get.attitude(_status.event.player, target)
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const names = [];
      const cards2 = [];
      for (let i = 0; i < 4; i++) {
        const card = get.cardPile2((card2) => !cards2.includes(card2) && !names.includes(card2.name) && get.type(card2) === "basic");
        if (!card) {
          break;
        }
        cards2.push(card);
        names.push(card.name);
      }
      if (cards2.length) {
        await target.gain({
          cards: cards2,
          animate: "gain2"
        });
      }
    }
  },
  juntun: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      return player.maxHp > 1;
    },
    async content(event, trigger, player) {
      await player.loseMaxHp();
      await player.draw(player.maxHp);
    }
  },
  jiaojie: {
    audio: 2,
    mod: {
      ignoredHandcard(card, player) {
        if (get.color(card) == "red") {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name == "phaseDiscard" && get.color(card) == "red") {
          return false;
        }
      },
      targetInRange(card) {
        const color = get.color(card);
        if (color === "black" || color === "unsure") {
          return true;
        }
      },
      cardUsable(card) {
        const color = get.color(card);
        if (color === "black" || color === "unsure") {
          return Infinity;
        }
      }
    }
  },
  decadewuniang: {
    trigger: {
      player: ["useCard", "respond"]
    },
    audio: "xinfu_wuniang",
    filter(event, player) {
      return event.card.name === "sha";
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2("decadewuniang"),
        filterTarget: (card, player2, target) => player2 !== target && target.countGainableCards(player2, "he") > 0,
        ai: (target) => 10 - get.attitude(_status.event.player, target)
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.line(target, "fire");
      await player.gainPlayerCard({
        target,
        position: "he",
        forced: true
      });
      await target.draw();
      if (!player.storage.decadexushen) {
        return;
      }
      const list = game.filterPlayer((current) => current.name === "dc_guansuo" || current.name2 === "dc_guansuo");
      if (!list.length) {
        return;
      }
      await game.asyncDraw(list);
      await game.delayx();
    }
  },
  minsi: {
    audio: 2,
    enable: "phaseUse",
    getResult(cards2) {
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
        let num = 0;
        for (const card of array) {
          num += get.number(card);
        }
        if (num === 13) {
          list.push(array);
        }
      }
      if (list.length) {
        list.sort((a, b) => a.length !== b.length ? b.length - a.length : get.value(a) - get.value(b));
        return list[0];
      }
      return list;
    },
    usable: 1,
    filterCard(card) {
      let num = 0;
      for (const selected of ui.selected.cards) {
        num += get.number(selected);
      }
      return get.number(card) + num <= 13;
    },
    complexCard: true,
    selectCard() {
      let num = 0;
      for (const selected of ui.selected.cards) {
        num += get.number(selected);
      }
      if (num === 13) {
        return ui.selected.cards.length;
      }
      return ui.selected.cards.length + 2;
    },
    check(card) {
      const evt = _status.event;
      if (!evt.minsi_choice) {
        evt.minsi_choice = lib.skill.minsi.getResult(evt.player.getCards("he"));
      }
      if (!evt.minsi_choice.includes(card)) {
        return 0;
      }
      return 1;
    },
    position: "he",
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      await player.draw({ num: cards2.length * 2, gaintag: ["minsi2"] });
      player.addTempSkill("minsi2");
    },
    ai: {
      order: 5,
      result: { player: 1 }
    }
  },
  minsi2: {
    onremove(player) {
      player.removeGaintag("minsi2");
    },
    mod: {
      targetInRange(card, player, target) {
        if (!card.cards || !card.cards.length) {
          return;
        }
        for (const i of card.cards) {
          if (!i.hasGaintag("minsi2") || get.color(i) !== "black") {
            return;
          }
        }
        return true;
      },
      ignoredHandcard(card, player) {
        if (card.hasGaintag("minsi2") && get.color(card) === "red") {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name === "phaseDiscard" && card.hasGaintag("minsi2") && get.color(card) === "red") {
          return false;
        }
      },
      aiOrder(player, card, num) {
        if (get.itemtype(card) === "card" && card.hasGaintag("minsi2") && get.color(card) === "black") {
          return num - 0.1;
        }
      }
    }
  },
  jijing: {
    audio: 2,
    trigger: { player: "damageEnd" },
    frequent: true,
    async content(event, trigger, player) {
      const judgeResult = await player.judge().forResult();
      const num = judgeResult.number;
      const cards2 = player.getCards("he");
      const length = cards2.length;
      const all = Math.pow(length, 2);
      const list = [];
      for (let index = 1; index < all; index++) {
        const combination = [];
        for (let cardIndex = 0; cardIndex < length; cardIndex++) {
          if (Math.floor(index % Math.pow(2, cardIndex + 1) / Math.pow(2, cardIndex)) > 0) {
            combination.push(cards2[cardIndex]);
          }
        }
        let sum = 0;
        for (const card of combination) {
          sum += get.number(card);
        }
        if (sum === num) {
          list.push(combination);
        }
      }
      if (list.length) {
        list.sort((a, b) => get.value(a) - get.value(b));
      }
      const cardResult = list.length ? list[0] : list;
      const next = player.chooseToDiscard({
        prompt: `是否弃置任意张点数之和为${get.cnNumber(num)}的牌并回复1点体力？`,
        filterCard: (card) => {
          let sum = 0;
          for (const selectedCard of ui.selected.cards) {
            sum += get.number(selectedCard);
          }
          return get.number(card) + sum <= _status.event.num;
        },
        position: "he",
        complexCard: true,
        selectCard: () => {
          let sum = 0;
          for (const card of ui.selected.cards) {
            sum += get.number(card);
          }
          if (sum === _status.event.num) {
            return ui.selected.cards.length;
          }
          return ui.selected.cards.length + 2;
        },
        ai: (card) => {
          if (!_status.event.cardResult.includes(card)) {
            return 0;
          }
          return 6 - get.value(card);
        }
      });
      next.set("num", num);
      next.set("cardResult", cardResult);
      const result = await next.forResult();
      if (!result.bool) {
        return;
      }
      await player.recover();
    }
  },
  cixiao: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    direct: true,
    filter(event, player) {
      if (!game.hasPlayer((current) => current.hasSkill("panshi"))) {
        return true;
      }
      return player.countCards("he") >= 1 && game.hasPlayer((current) => current !== player && !current.hasSkill("panshi"));
    },
    async content(event, trigger, player) {
      if (!game.hasPlayer((current) => current.hasSkill("panshi"))) {
        const result2 = await player.chooseTarget({
          filterTarget: lib.filter.notMe,
          prompt: get.prompt("cixiao"),
          prompt2: "令一名其他角色获得「义子」标记",
          ai: (target3) => {
            const player2 = _status.event.player;
            const attitude2 = -get.attitude(player2, target3);
            return attitude2 * target3.countCards("h");
          }
        }).forResult();
        if (!result2.bool) {
          return;
        }
        const target2 = result2.targets[0];
        player.logSkill("cixiao", target2);
        await target2.addSkills("panshi");
        return;
      }
      const list = game.filterPlayer((current) => current.hasSkill("panshi"));
      const panshiPlayer = list[0];
      const attitude = -get.attitude(player, panshiPlayer);
      const result = await player.chooseCardTarget({
        prompt: get.prompt("cixiao"),
        prompt2: `弃置一张牌并将${get.translation(list)}的「义子」标记转移给其他角色`,
        position: "he",
        filterTarget(card, player2, target2) {
          return player2 !== target2 && !target2.hasSkill("panshi");
        },
        filterCard: lib.filter.cardDiscardable,
        ai1(card) {
          if (_status.event.goon) {
            return 5 - get.value(card);
          }
          return 0;
        },
        ai2(target2) {
          const player2 = _status.event.player;
          const attitude2 = -get.attitude(player2, target2);
          return attitude2 * target2.countCards("h");
        },
        goon: attitude * panshiPlayer.countCards("h") <= 0
      }).forResult();
      if (!result.bool) {
        return;
      }
      const target = result.targets[0];
      player.logSkill("cixiao");
      const discardEvent = player.discard({ cards: result.cards }).set("delay", false);
      const panshiPlayers = game.filterPlayer((current) => current.hasSkill("panshi"));
      for (const current of panshiPlayers) {
        current.removeSkills("panshi");
      }
      player.line2(panshiPlayers.concat(result.targets), "green");
      target.addSkills("panshi");
      await discardEvent;
      await game.delayx();
    },
    derivation: "panshi",
    ai: { threaten: 8 }
  },
  panshi: {
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      return player.hasCards("h") && game.hasPlayer((current) => current !== player && current.hasSkill("cixiao"));
    },
    async content(event, trigger, player) {
      const targets = game.filterPlayer((current) => current !== player && current.hasSkill("cixiao"));
      let target;
      let result;
      if (targets.length === 1) {
        event.target = targets[0];
        target = event.target;
        result = await player.chooseCard({
          position: "h",
          forced: true,
          prompt: `叛弑：将一张手牌交给${get.translation(targets)}`
        }).forResult();
      } else {
        result = await player.chooseCardTarget({
          prompt: `叛弑：将一张手牌交给${get.translation(targets)}中的一名角色`,
          filterCard: true,
          position: "h",
          targets,
          forced: true,
          filterTarget(card, player2, target2) {
            return _status.event.targets.includes(target2);
          }
        }).forResult();
        target = result.targets?.[0];
      }
      if (!result.bool) {
        return;
      }
      player.line(target);
      await player.give(result.cards, target);
    },
    mark: true,
    marktext: "子",
    intro: {
      name: "义子",
      content(_, player) {
        const targets = game.filterPlayer2((target) => target.hasSkill("cixiao", null, null, false)).sortBySeat(player);
        if (!targets.length) {
          return "我义父呢？！";
        }
        if (["name", "name1", "name2"].some((name) => {
          if (!player[name] || !get.character(player[name]) || typeof get.translation(player[name]) !== "string") {
            return false;
          }
          return player[name].includes("lvbu") && get.translation(player[name]).includes("吕布");
        })) {
          return "公若不弃，布愿拜为义父";
        }
        return `我是${get.translation(targets)}的${((player2) => {
          switch (player2.sex) {
            case "female":
              return "义女";
            case "double":
              return "义子义女";
            default:
              return "义子";
          }
        })(player)}`;
      }
    },
    group: "panshi_damage",
    ai: {
      halfneg: true
    }
  },
  panshi_damage: {
    trigger: { source: "damageBegin1" },
    forced: true,
    logTarget: "player",
    sourceSkill: "panshi",
    filter(event, player) {
      return player.isPhaseUsing() && event.card && event.card.name === "sha" && event.player.hasSkill("cixiao");
    },
    async content(event, trigger, player) {
      trigger.num++;
      if (["name", "name1", "name2"].some((name) => {
        if (!player[name] || !get.character(player[name]) || typeof get.translation(player[name]) !== "string") {
          return false;
        }
        return player[name].includes("lvbu") && get.translation(player[name]).includes("吕布");
      })) {
        player.chat("吾堂堂丈夫，安肯为汝子乎！");
      }
      const evt = event.getParent("phaseUse");
      if (evt && evt.player === player) {
        evt.skipped = true;
      }
    }
  },
  xianshuai: {
    audio: 2,
    trigger: { global: "damageSource" },
    forced: true,
    filter(event, player) {
      return event.source && event.source.isIn() && !player.hasSkill("xianshuai2");
    },
    async content(event, trigger, player) {
      player.addTempSkill("xianshuai2", "roundStart");
      await player.draw();
      if (player === trigger.source && trigger.player.isIn()) {
        player.line(trigger.player, "green");
        await trigger.player.damage();
      }
    }
  },
  xianshuai2: { charlotte: true },
  decadexushen: {
    derivation: "decadezhennan",
    audio: "xinfu_xushen",
    trigger: { player: "dying" },
    limited: true,
    skillAnimation: true,
    animationColor: "orange",
    filter(event, player) {
      return player.hp < 1;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const addSkillsEvent = player.addSkills("decadezhennan");
      player.addTempSkill("decadexushen2");
      trigger.decadexushen = true;
      await addSkillsEvent;
      await player.recover();
    }
  },
  decadexushen2: {
    trigger: { player: "dyingAfter" },
    forced: true,
    popup: false,
    charlotte: true,
    sourceSkill: "decadexushen",
    filter(event, player) {
      return event.decadexushen === true && !game.hasPlayer((current) => current.name === "dc_guansuo" || current.name2 === "dc_guansuo");
    },
    async content(event, trigger, player) {
      const result = await player.chooseTarget({
        filterTarget: lib.filter.notMe,
        prompt: "许身：是否令一名其他角色选择是否将其武将牌替换为“关索”并令其摸三张牌？",
        ai: (target2) => get.attitude(_status.event.player, target2)
      }).forResult();
      if (!result.bool) {
        return;
      }
      const target = result.targets[0];
      event.target = target;
      player.line(target, "fire");
      const chooseResult = await target.chooseBool({ prompt: `许身：是否将自己的一张武将牌替换为“关索”并令${get.translation(player)}摸三张牌？` }).forResult();
      if (chooseResult.bool) {
        let control = target.name1;
        if (target.name2 !== void 0) {
          const controlResult = await target.chooseControl({
            controls: [target.name1, target.name2],
            prompt: "请选择要更换的武将牌"
          }).forResult();
          control = controlResult.control;
        }
        target.reinitCharacter(control, "dc_guansuo");
      }
      await target.draw(3);
    }
  },
  decadezhennan: {
    audio: "xinfu_zhennan",
    trigger: {
      global: "useCardToPlayered"
    },
    filter(event, player) {
      return event.isFirstTarget && event.targets && event.targets.length > 1 && get.type2(event.card) === "trick";
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt(event.skill),
        prompt2: "对一名其他角色造成1点伤害",
        filterTarget: (card, player2, target) => target !== player2,
        ai: (target) => {
          const player2 = _status.event.player;
          return get.damageEffect(target, player2, player2);
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      await event.targets[0].damage();
    },
    ai: {
      expose: 0.25
    }
  },
  yujue: {
    initSkill(skill) {
      if (!lib.skill[skill]) {
        lib.skill[skill] = {
          charlotte: true,
          onremove: true,
          mark: "character",
          intro: { content: "以$之名，授予汝技能〖执笏〗，直至$的下回合开始为止！" }
        };
        lib.translate[skill] = "执笏";
      }
    },
    audio: 2,
    derivation: "zhihu",
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hasEnabledSlot();
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("###鬻爵###" + lib.translate.yujue_info);
      },
      chooseControl(event, player) {
        const list = [];
        for (let i = 1; i < 6; i++) {
          if (player.hasEnabledSlot(i)) {
            list.push("equip" + i);
          }
        }
        list.push("cancel2");
        return list;
      },
      check(event, player) {
        if (player.countEnabledSlot() == 1 && player.maxHp <= 3 && player.hasSkill("tuxing")) {
          return "cancel2";
        }
        for (let i = 5; i > 0; i--) {
          if (player.hasEmptySlot(i)) {
            return "equip" + i;
          }
        }
        return "cancel2";
      },
      backup(result) {
        return {
          audio: "yujue",
          position: result.control,
          async content(event, trigger, player) {
            await player.disableEquip(lib.skill.yujue_backup.position);
            if (player.isIn() && game.hasPlayer((current) => {
              return current != player && current.countCards("h");
            })) {
              const result2 = await player.chooseTarget(true, "选择一名其他角色交给你一张手牌并获得技能〖执笏〗", (card, player2, target) => {
                if (player2 == target) {
                  return false;
                }
                return target.countCards("h") > 0;
              }).set("ai", (target) => {
                return get.attitude(get.player(), target) * target.countCards("h");
              }).forResult();
              if (result2?.bool) {
                const target = result2.targets[0];
                player.line(target);
                const result22 = await target.chooseToGive(player, "h", true).forResult();
                if (result22?.bool) {
                  player.addTempSkill("yujue_clear", { player: "phaseBeginStart" });
                  const skill = `yujue_${player.playerid}`;
                  game.broadcastAll(lib.skill.yujue.initSkill, skill);
                  target.storage[skill] = player;
                  target.addSkill(skill);
                  await target.addAdditionalSkills(skill, "zhihu");
                }
              }
            }
          }
        };
      }
    },
    ai: {
      order: 1,
      result: {
        player(player) {
          if (player.countEnabledSlot() == 1 && player.maxHp <= 3 && player.hasSkill("tuxing")) {
            return 0;
          }
          if (game.hasPlayer(function(target) {
            if (player == target) {
              return false;
            }
            var hs = target.countCards("h");
            return hs > 2 && get.attitude(player, target) > 0;
          })) {
            return 1;
          }
          return 0;
        }
      }
    },
    subSkill: {
      backup: {},
      clear: {
        charlotte: true,
        onremove(player) {
          game.countPlayer((current) => {
            current.removeSkill(`yujue_${player.playerid}`);
          });
        }
      }
    }
  },
  zhihu: {
    usable: 2,
    trigger: { source: "damageSource" },
    forced: true,
    filter(event, player) {
      return player != event.player;
    },
    async content(event, trigger, player) {
      await player.draw(2);
    }
  },
  tuxing: {
    audio: 2,
    trigger: { player: "disableEquipEnd" },
    forced: true,
    async content(event, trigger, player) {
      const num = trigger.slots.length;
      await player.gainMaxHp(num);
      await player.recover(num);
      if (!player.hasEnabledSlot()) {
        await player.loseMaxHp(4);
        player.addSkill(event.name + "_effect");
        player.addMark(event.name + "_effect", 1, false);
      }
    },
    ai: { combo: "yujue" },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        audio: "tuxing",
        trigger: { source: "damageBegin1" },
        forced: true,
        async content(event, trigger, player) {
          trigger.num += player.countMark(event.name);
        },
        intro: { content: "造成伤害时，此伤害+#" }
      }
    }
  },
  gongjian: {
    audio: 2,
    trigger: { global: "useCardToPlayered" },
    usable: 1,
    logTarget(event) {
      return event.parent.gongjian_targets.filter((target) => event.targets.includes(target) && target.hasCards("he"));
    },
    filter(event, player) {
      if (event.card.name !== "sha" || !event.isFirstTarget) {
        return false;
      }
      return event.parent.gongjian_targets?.some((target) => event.targets.includes(target) && target.hasCards("he")) === true;
    },
    check(event, player) {
      const targets = event.parent.gongjian_targets.filter((target) => event.targets.includes(target) && target.hasCards("he"));
      let attitude = 0;
      for (const target of targets) {
        attitude += get.attitude(player, target);
      }
      return attitude < 0;
    },
    async content(event, trigger, player) {
      const targets = trigger.parent.gongjian_targets.filter((target) => trigger.targets.includes(target));
      for (const target of targets) {
        await player.discardPlayerCard({
          target,
          forced: true,
          position: "he",
          selectButton: [1, 2]
        }).set("forceAuto", true);
      }
      const cards2 = game.getGlobalHistory("cardMove", (evt) => evt.player && evt.hs && evt.type === "discard" && evt.getParent(3) === event).map((evt) => [evt.hs, evt.player]).flatMap(([cards3, playerx]) => cards3.filter((card) => get.name(card, playerx) === "sha" && get.position(card, true) === "d"));
      if (cards2.length) {
        await player.gain({
          cards: cards2,
          animate: "gain2"
        });
      }
    },
    group: "gongjian_count",
    subSkill: {
      count: {
        trigger: { global: "useCard1" },
        silent: true,
        firstDo: true,
        filter(event, player) {
          return event.card && event.card.name === "sha";
        },
        async content(event, trigger, player) {
          if (player.storage.gongjian) {
            trigger.gongjian_targets = player.storage.gongjian;
          }
          player.storage.gongjian = trigger.targets;
        }
      }
    }
  },
  kuimang: {
    audio: 2,
    trigger: { global: "dieAfter" },
    forced: true,
    filter(event, player) {
      return player.getAllHistory("sourceDamage", (damage) => damage.player === event.player).length > 0;
    },
    async content(event, trigger, player) {
      await player.draw(2);
    }
  },
  rexiemu: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return !game.hasPlayer((current) => current.hasMark("rexiemu"));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget: lib.filter.notMe,
        ai: (target) => {
          const player2 = _status.event.player;
          return get.attitude(player2, target) * Math.sqrt(Math.max(1 + player2.countCards("h"), 1 + target.countCards("h")));
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      target.addMark("rexiemu", 1);
      player.addSkill("rexiemu2");
    },
    intro: { content: "mark" },
    ai: {
      expose: 0.1
    }
  },
  rexiemu2: {
    audio: "rexiemu",
    trigger: { global: ["loseAfter"] },
    forced: true,
    charlotte: true,
    usable: 1,
    sourceSkill: "rexiemu",
    filter(event, player) {
      return (event.player === player || event.player.hasMark("rexiemu")) && ["useCard", "respond"].includes(event.getParent().name) && event.hs && event.hs.length && event.player !== _status.currentPhase && game.hasPlayer((current) => current.hasMark("rexiemu"));
    },
    async content(event, trigger, player) {
      await game.asyncDraw(game.filterPlayer((current) => current === player || current === trigger.player || current.hasMark("rexiemu")));
      await game.delayx();
    },
    group: "rexiemu3"
  },
  rexiemu3: {
    trigger: { player: "phaseBegin" },
    forced: true,
    charlotte: true,
    silent: true,
    firstDo: true,
    sourceSkill: "rexiemu",
    async content(event, trigger, player) {
      player.removeSkill("rexiemu2");
      for (const current of game.filterPlayer()) {
        const num = current.countMark("rexiemu");
        if (num) {
          current.removeMark("rexiemu", num);
        }
      }
    }
  },
  heli: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => lib.skill.heli.filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return target.countCards("h") < player.countCards("h");
    },
    async content(event, trigger, player) {
      const target = event.target;
      if (target.hasCards("h")) {
        await target.showHandcards();
      }
      const list = [];
      const cards2 = [];
      for (const name of lib.inpile) {
        list.add(get.type2(name));
      }
      for (const type of list) {
        if (target.hasCards("h", (card2) => get.type2(card2, target) === type)) {
          continue;
        }
        const card = get.cardPile2((card2) => get.type2(card2, false) === type, "random");
        if (card) {
          cards2.push(card);
        }
      }
      if (cards2.length) {
        await target.gain({
          cards: cards2,
          animate: "gain2",
          log: true
        });
      }
    },
    ai: {
      order: 10,
      result: {
        target(player, target) {
          return 1 / Math.sqrt(1 + target.countCards("h"));
        }
      }
    }
  },
  moying: {
    audio: 2,
    trigger: {
      player: "loseAfter",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    filter(event, player) {
      if (player == _status.currentPhase || (event.relatedEvent || event.getParent())?.name == "useCard") {
        return false;
      }
      if (event.name == "gain" && event.player == player) {
        return false;
      }
      const evt = event.getl(player);
      return evt && evt.cards2 && evt.cards2.length == 1 && ["equip", "trick"].includes(get.type2(evt.cards2[0], evt.type == "discard" && evt.hs.includes(evt.cards2[0]) ? player : false));
    },
    usable: 1,
    async cost(event, trigger, player) {
      const number = trigger.getl(player).cards2[0].number;
      const numbers = [number - 2, number - 1, number, number + 1, number + 2].filter(function(number2) {
        return number2 >= 1 && number2 <= 13;
      });
      const suits = lib.suit.slice();
      const result = await player.chooseButton([get.prompt2("moying"), `<div class="text center">花色</div>`, [suits.map((suit) => [suit, get.translation(suit)]), "tdnodes"], `<div class="text center">点数</div>`, [numbers, "tdnodes"]], 2).set("filterButton", (button) => {
        const selected = ui.selected.buttons;
        if (!selected.length) {
          return true;
        }
        return typeof button.link != typeof selected[0].link;
      }).set("ai", (button) => {
        return Math.random();
      }).forResult();
      if (result?.links?.length) {
        const links = result.links;
        if (!suits.includes(links[0])) {
          links.reverse();
        }
        event.result = {
          bool: true,
          cost_data: [links[0], links[1]]
        };
      }
    },
    async content(event, trigger, player) {
      const {
        cost_data: [suit, number]
      } = event;
      const cards2 = [];
      for (let i = 0; i < ui.cardPile.childNodes.length; i++) {
        const card = ui.cardPile.childNodes[i];
        if (get.suit(card) == suit && get.number(card) == number) {
          cards2.push(card);
        }
      }
      if (cards2.length) {
        await player.gain(cards2, "gain2");
      }
    }
  },
  //moying2: {},
  juanhui: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt("juanhui"), lib.filter.notMe, "选择记录一名其他角色使用过的牌").set("ai", function(target) {
        if (target.isTurnedOver() || target.hasJudge("lebu")) {
          return Math.random();
        }
        return (1 + target.countCards("h")) * 2 + Math.random();
      }).forResult();
    },
    async content(event, trigger, player) {
      const [target] = event.targets;
      player.storage.juanhui2 = target;
      player.storage.juanhui3 = [];
      player.addSkill("juanhui2");
    }
  },
  juanhui2: {
    charlotte: true,
    mark: true,
    mod: {
      cardUsable(card) {
        if (card.name === "sha" && _status.event.skill === "juanhui2_backup") {
          return Infinity;
        }
      }
    },
    intro: {
      markcount(storage, player) {
        return player.getStorage("juanhui3").length;
      },
      mark(dialog, storage, player) {
        dialog.addText("记录目标");
        dialog.addSmall([storage]);
        const vcard = player.getStorage("juanhui3");
        if (vcard.length) {
          dialog.addText("记录卡牌");
          dialog.addSmall([vcard, "vcard"]);
        }
      },
      content(storage, player) {
        let str = `记录目标：${get.translation(storage)}`;
        const vcard = player.getStorage("juanhui3");
        if (vcard.length) {
          str += "<br>记录卡牌：";
          for (const i of vcard) {
            if (i[2] === "sha" && i[3]) {
              str += get.translation(i[3]);
            }
            str += `${get.translation(i[2])}、`;
          }
          str = str.slice(0, -1);
        }
        return str;
      }
    },
    onremove(player) {
      delete player.storage.juanhui2;
      delete player.storage.juanhui3;
    },
    group: "juanhui3",
    enable: "phaseUse",
    sourceSkill: "juanhui",
    filter(event, player) {
      return player.getStorage("juanhui3").length > 0 && player.hasCards("hs");
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("绢绘", [player.getStorage("juanhui3"), "vcard"], "hidden");
      },
      filter(button, player) {
        return lib.filter.cardEnabled(
          {
            name: button.link[2],
            nature: button.link[3]
          },
          player,
          _status.event.getParent()
        );
      },
      check(button) {
        const player = _status.event.player;
        const card = {
          name: button.link[2],
          nature: button.link[3]
        };
        return player.getUseValue(card) > 0 ? get.order(card) : -1;
      },
      backup(links, player) {
        return {
          audio: "juanhui",
          popname: true,
          filterCard: true,
          position: "hs",
          viewAs: {
            name: links[0][2],
            nature: links[0][3]
          },
          check(card) {
            return 6 - get.value(card);
          },
          async precontent(event, trigger, player2) {
            const card = event.result.card;
            if (card.name === "sha") {
              event.getParent().addCount = false;
            }
            const vcard = player2.storage.juanhui3;
            for (let i = vcard.length - 1; i >= 0; i--) {
              if (vcard[i][2] === card.name) {
                vcard.splice(i, 1);
              }
            }
            if (vcard.length) {
              player2.markSkill("juanhui2");
            } else {
              player2.unmarkSkill("juanhui2");
              event.getParent().juanhui = true;
            }
          }
        };
      },
      prompt(links, player) {
        return `将一张手牌当做${links[0][2] === "sha" && links[0][3] ? get.translation(links[0][3]) : ""}${get.translation(links[0][2])}使用`;
      }
    },
    ai: {
      order(item, player) {
        const muniu = player.getStorage("juanhui3");
        let order = 0;
        for (const info of muniu) {
          const card = { name: info[2], nature: info[3] };
          if (player.getUseValue(card) > 0) {
            order = Math.max(order, get.order(card));
          }
        }
        return order + 0.1;
      },
      result: {
        player: 1
      }
    }
  },
  juanhui3: {
    charlotte: true,
    firstDo: true,
    trigger: {
      global: "useCard2",
      player: ["phaseUseEnd", "phaseUseSkipped", "useCardAfter"]
    },
    silent: true,
    sourceSkill: "juanhui",
    filter(event, player, name) {
      if (event.name == "phaseUse") {
        return true;
      } else if (name == "useCardAfter") {
        return event.getParent().juanhui;
      }
      return event.player == player.storage.juanhui2 && event.player.isPhaseUsing() && ["basic", "trick"].includes(get.type(event.card)) && player.getStorage("juanhui3").filter(function(vcard) {
        return vcard[2] == event.card.name;
      }).length == 0;
    },
    async content(event, trigger, player) {
      if (trigger.name == "phaseUse") {
        player.removeSkill("juanhui2");
      } else if (event.triggername == "useCardAfter") {
        await player.recover();
        await player.drawTo(3);
      } else {
        var vcard = [get.type(trigger.card), "", trigger.card.name];
        if (game.hasNature(trigger.card)) {
          vcard.push(get.nature(trigger.card));
        }
        player.storage.juanhui3.push(vcard);
        player.markSkill("juanhui2");
      }
    }
  },
  mubing: {
    audio: 2,
    audioname: ["sp_key_yuri"],
    trigger: { player: "phaseUseBegin" },
    //direct:true,
    frequent: true,
    filter(event, player) {
      return player.hasCards("he");
    },
    async content(event, trigger, player) {
      const num = player.storage.mubing2 ? 4 : 3;
      const cards2 = get.cards(num);
      const orderingEvent = game.cardsGotoOrdering(cards2);
      game.log(player, "展示了", cards2);
      const videoId = lib.status.videoId++;
      game.broadcastAll(
        (player2, id, cards3) => {
          const prompt = `${get.translation(player2)}发动了【募兵】`;
          const dialog = ui.create.dialog(prompt, cards3);
          dialog.videoId = id;
        },
        player,
        videoId,
        cards2
      );
      game.addVideo("showCards", player, [`${get.translation(player)}发动了【募兵】`, get.cardsInfo(cards2)]);
      await orderingEvent;
      await game.delay(2);
      cards2.sort((a, b) => a.number - b.number);
      const numa = cards2.reduce((sum, card) => get.value(card, player) > 0 ? sum + get.number(card) : sum, 0);
      const updateDialogPrompt = (id, prompt) => {
        const dialog = get.idDialog(id);
        if (dialog) {
          dialog.content.firstChild.innerHTML = prompt;
        }
      };
      const discardEvent = player.chooseToDiscard({
        selectCard: [1, Infinity],
        position: "h",
        ai: (card) => {
          const player2 = _status.event.player;
          const numa2 = _status.event.numa;
          const selectedNumber = ui.selected.cards.reduce((sum, selectedCard) => sum + selectedCard.number, 0);
          if (selectedNumber >= numa2) {
            return 0;
          }
          if (card.number + selectedNumber >= numa2) {
            return 15 - get.value(card);
          }
          if (!ui.selected.cards.length) {
            const min = _status.event.min;
            if (card.number < min && !player2.countCards("h", (xcard) => xcard !== card && card.number + xcard.number > min)) {
              return 0;
            }
            return card.number;
          }
          return Math.max(5 - get.value(card), card.number);
        }
      }).set("prompt", false).set("numa", numa).set("min", cards2[0].number);
      if (player === game.me) {
        updateDialogPrompt(videoId, "请选择要弃置的牌");
      } else if (player.isOnline()) {
        player.send(updateDialogPrompt, videoId, "请选择要弃置的牌");
      }
      const discardResult = await discardEvent.forResult();
      let selectedCards = [];
      if (discardResult.bool) {
        const maxNum = discardResult.cards.reduce((sum, card) => sum + get.number(card), 0);
        const buttonEvent = player.chooseButton({
          selectButton: [0, num],
          filterButton: (button) => {
            const selectedNumber = ui.selected.buttons.reduce((sum, selectedButton) => sum + get.number(selectedButton.link), 0);
            return selectedNumber + get.number(button.link) <= _status.event.maxNum;
          },
          ai: (button) => get.value(button.link, _status.event.player)
        }).set("dialog", videoId).set("maxNum", maxNum);
        if (player === game.me) {
          updateDialogPrompt(videoId, "请选择要获得的牌");
        } else if (player.isOnline()) {
          player.send(updateDialogPrompt, videoId, "请选择要获得的牌");
        }
        const buttonResult = await buttonEvent.forResult();
        if (buttonResult.bool) {
          selectedCards = buttonResult.links;
        }
      }
      game.broadcastAll("closeDialog", videoId);
      game.addVideo("cardDialog", null, videoId);
      if (!selectedCards.length) {
        return;
      }
      await player.gain({ cards: selectedCards, log: true, animate: "gain2" });
      if (!player.storage.mubing2) {
        return;
      }
      const given = [];
      let remainingCards = [...selectedCards];
      for (let i = 1; i < game.countPlayer(); i++) {
        const handCards = player.getCards("h");
        remainingCards = remainingCards.filter((card) => handCards.includes(card));
        if (!remainingCards.length || !game.hasPlayer((current) => current !== player && !given.includes(current))) {
          break;
        }
        const giveResult = await player.chooseCardTarget({
          prompt: "是否将得到的牌中的任意张交给其他角色？",
          selectCard: [1, remainingCards.length],
          filterCard: (card) => _status.event.cards.includes(card),
          filterTarget: (_card, player2, target2) => target2 !== player2 && !_status.event.given.includes(target2),
          cards: remainingCards,
          given,
          ai1: () => -1
        }).forResult();
        if (!giveResult.bool) {
          break;
        }
        const target = giveResult.targets[0];
        const cardsToGive = giveResult.cards;
        given.push(target);
        remainingCards.removeArray(cardsToGive);
        player.line(target, "green");
        await player.give(cardsToGive, target);
      }
    }
  },
  ziqu: {
    audio: 2,
    audioname: ["sp_key_yuri"],
    trigger: { source: "damageBegin2" },
    filter(event, player) {
      return event.player !== player && !player.getStorage("ziqu").includes(event.player);
    },
    check(event, player) {
      const target = event.player;
      const eff = get.damageEffect(target, player, player);
      if (get.attitude(player, target) > 0) {
        if (eff >= 0) {
          return false;
        }
        return true;
      }
      if (eff <= 0) {
        return true;
      }
      if (target.hp === 1) {
        return false;
      }
      if (event.num > 1) {
        return false;
      }
      const cards2 = target.getCards("he");
      for (const card of cards2) {
        if (get.number(card) > 10) {
          return true;
        }
      }
      return false;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      trigger.cancel();
      if (!player.storage.ziqu) {
        player.storage.ziqu = [];
      }
      player.storage.ziqu.push(trigger.player);
      player.markSkill("ziqu");
      const result = await trigger.player.chooseCard({
        forced: true,
        position: "he",
        filterCard: (card, player2) => !player2.hasCards("he", (cardx) => cardx.number > card.number)
      }).forResult();
      if (!result.bool || !result.cards?.length) {
        return;
      }
      await trigger.player.give(result.cards, player);
    },
    intro: { content: "已对$发动过" }
  },
  mubing_rewrite: {
    mark: true,
    intro: {
      content: "出牌阶段开始时，你可以亮出牌堆顶的四张牌。你可弃置任意张手牌，并可获得任意张点数之和不大于你弃置的牌点数之和的牌。然后你可将以此法得到的牌以任意方式交给其他角色。"
    },
    ai: {
      combo: "mubing"
    }
  },
  diaoling: {
    audio: 2,
    audioname: ["sp_key_yuri"],
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "metal",
    filter(event, player) {
      let num = 0;
      player.getAllHistory("gain", (evt) => {
        const evt2 = evt.getParent();
        if (evt2.name === "mubing" && evt2.player === player) {
          num += evt.cards.filter((card) => card.name === "sha" || get.subtype(card, false) === "equip1" || get.type2(card, false) === "trick" && get.tag({ name: card.name }, "damage")).length;
        }
      });
      return num >= 6;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      player.storage.mubing2 = true;
      player.markSkill("mubing_rewrite");
      await player.chooseDrawRecover(2, true);
    },
    ai: {
      combo: "mubing"
    },
    derivation: "mubing_rewrite"
  },
  refenyin_wufan: { audio: 2 },
  //官渡之战
  xiying: {
    trigger: { player: "phaseUseBegin" },
    audio: 2,
    filter(event, player) {
      return player.hasCards("h", (card) => _status.connectMode || get.type(card) !== "basic");
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard({
        prompt: get.prompt2("xiying"),
        position: "h",
        filterCard: (card) => get.type(card) !== "basic",
        chooseonly: true,
        ai: (card) => _status.event.val - get.value(card)
      }).set("val", 4 * Math.sqrt(game.countPlayer((current) => get.attitude(player, current) < 0 && current.hasCards("he")))).forResult();
      if (event.result.bool) {
        event.result.targets = game.filterPlayer((current) => current !== player);
        event.result.targets.sortBySeat();
      }
    },
    async content(event, trigger, player) {
      await player.discard({ cards: event.cards, discarder: player });
      player.addTempSkill("xiying_gain");
      for (const target of event.targets) {
        if (!target.isIn()) {
          continue;
        }
        const result = await target.chooseToDiscard({
          position: "he",
          prompt: "弃置一张牌，或本回合内不能使用或打出牌",
          ai: (card) => {
            const current = _status.event.player;
            const source = _status.event.getTrigger().player;
            if (get.attitude(source, current) > 0) {
              return -1;
            }
            if (_status.event.getRand() > 0.5) {
              return 5 - get.value(card);
            }
            return -1;
          }
        }).forResult();
        if (!result.bool) {
          target.addTempSkill("xiying2");
        }
      }
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        return arg.target.hasSkill("xiying2");
      }
    },
    subSkill: {
      gain: {
        audio: "xiying",
        trigger: { player: "phaseJieshuBegin" },
        forced: true,
        charlotte: true,
        filter(event, player) {
          return player.getHistory("sourceDamage", (evt) => evt.isPhaseUsing(player)).length > 0;
        },
        async content(event, trigger, player) {
          const card = get.cardPile2((card2) => {
            const type = get.type(card2, null, false);
            if (type !== "basic" && type !== "trick") {
              return false;
            }
            return get.tag(card2, "damage") > 0;
          });
          if (!card) {
            return;
          }
          await player.gain({ cards: [card], animate: "gain2" });
        }
      }
    }
  },
  xiying2: {
    mark: true,
    intro: { content: "本回合内不能使用或打出牌" },
    mod: {
      cardEnabled(card) {
        return false;
      },
      cardSavable(card) {
        return false;
      },
      cardRespondable(card) {
        return false;
      }
    }
  },
  gangzhi: {
    audio: 2,
    trigger: {
      player: "damageBefore",
      source: "damageBefore"
    },
    forced: true,
    filter(event, player) {
      if (event.source === event.player) {
        return false;
      }
      if (event.player === player) {
        return event.source && event.source.isIn();
      }
      return true;
    },
    async content(event, trigger, player) {
      trigger.cancel();
      await trigger.player.loseHp(trigger.num);
    },
    ai: {
      jueqing: true
    },
    init(player) {
      game.addGlobalSkill("gangzhi_jueqing");
    },
    onremove() {
      if (!game.hasPlayer((cur) => cur.hasSkill("gangzhi", null, null, false), true)) {
        game.removeGlobalSkill("gangzhi_jueqing");
      }
    },
    subSkill: {
      jueqing: {
        trigger: { player: "dieAfter" },
        filter(event, player) {
          return !game.hasPlayer((cur) => cur.hasSkill("gangzhi", null, null, false));
        },
        silent: true,
        forceDie: true,
        async content(event, trigger, player) {
          game.removeGlobalSkill("gangzhi_jueqing");
        },
        ai: {
          jueqing: true,
          skillTagFilter(player, tag, arg) {
            if (tag === "jueqing") {
              return arg && arg.hasSkill("gangzhi");
            }
          }
        }
      }
    }
  },
  beizhan: {
    trigger: { player: "phaseEnd" },
    audio: 2,
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        ai: (target) => {
          const player2 = _status.event.player;
          const attitude = get.attitude(player2, target);
          const handcardCount = target.countCards("h");
          const maxHp = target.maxHp;
          if (handcardCount >= maxHp && target.isMaxHandcard()) {
            return -attitude * handcardCount;
          }
          if (handcardCount < maxHp && game.hasPlayer((current) => current.countCards("h") > maxHp)) {
            return attitude * 2 * (maxHp - handcardCount);
          }
          return 0;
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const drawEvent = target.drawTo(Math.min(5, target.maxHp));
      target.addSkill("beizhan2");
      await drawEvent;
    },
    ai: {
      expose: 0.25
    }
  },
  beizhan2: {
    trigger: { player: "phaseBegin" },
    silent: true,
    firstDo: true,
    sourceSkill: "beizhan",
    async content(event, trigger, player) {
      player.removeSkill("beizhan2");
      if (player.isMaxHandcard()) {
        player.addTempSkill("zishou2");
      }
    },
    mark: true,
    intro: { content: "回合开始时，若手牌数为全场最多，则回合内不能使用牌指定其他角色为目标" }
  },
  fenglve: {
    audio: 2,
    trigger: {
      player: "phaseUseBegin"
    },
    direct: true,
    async content(event, trigger, player) {
      const goon = player.hasCard((card) => {
        if (get.position(card) !== "h") {
          return false;
        }
        const val = get.value(card);
        if (val < 0) {
          return true;
        }
        if (val <= 5) {
          return card.number >= 12;
        }
        if (val <= 6) {
          return card.number >= 13;
        }
        return false;
      });
      const targetResult = await player.chooseTarget({
        prompt: get.prompt2("fenglve"),
        filterTarget: (card, player2, target2) => player2.canCompare(target2),
        ai: (target2) => {
          if (!_status.event.goon) {
            return 0;
          }
          return -get.attitude(player, target2) * (1 + target2.countCards("e")) / (1 + target2.countCards("j"));
        }
      }).set("goon", goon).forResult();
      if (!targetResult.bool) {
        return;
      }
      const target = targetResult.targets[0];
      player.logSkill("fenglve", target);
      const compareResult = await player.chooseToCompare(target).forResult();
      let gainner;
      let giver;
      let cardResult;
      if (compareResult.bool) {
        const num = ["h", "e", "j"].filter((position) => target.hasCards(position)).length;
        if (!num) {
          return;
        }
        gainner = player;
        giver = target;
        cardResult = await target.choosePlayerCard({
          target,
          selectButton: num,
          position: "hej",
          forced: true,
          filterButton: (button) => ui.selected.buttons.every((selected) => get.position(button.link) !== get.position(selected.link)),
          prompt: `选择交给${get.translation(gainner)}的牌`
        }).forResult();
      } else {
        if (!player.countCards("he")) {
          return;
        }
        gainner = target;
        giver = player;
        cardResult = await player.choosePlayerCard({
          target: player,
          forced: true,
          position: "he",
          prompt: `选择交给${get.translation(gainner)}的牌`
        }).forResult();
      }
      await giver.give(cardResult.links, gainner);
    },
    group: "fenglve2",
    ai: {
      expose: 0.25
    }
  },
  fenglve2: {
    trigger: {
      player: "chooseToCompareAfter",
      target: "chooseToCompareAfter"
    },
    sourceSkill: "fenglve",
    check(event, player) {
      const card = player === event.player ? event.card1 : event.card2;
      const target = player === event.player ? event.target : event.player;
      return get.attitude(player, target) * get.value(card, target, "raw") > 0;
    },
    filter(event, player) {
      if (event.targets) {
        return false;
      }
      const card = player === event.player ? event.card1 : event.card2;
      return get.position(card, true) === "o";
    },
    prompt(event, player) {
      const card = player === event.player ? event.card1 : event.card2;
      const target = player === event.player ? event.target : event.player;
      return `是否发动【锋略】，令${get.translation(target)}获得${get.translation(card)}？`;
    },
    logTarget(event, player) {
      return player === event.player ? event.target : event.player;
    },
    async content(event, trigger, player) {
      const card = player === trigger.player ? trigger.card1 : trigger.card2;
      const target = player === trigger.player ? trigger.target : trigger.player;
      await target.gain({ cards: [card], animate: "gain2", log: true });
    }
  },
  mouzhi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hasCards("h");
    },
    filterCard: true,
    filterTarget(card, player, target) {
      if (target.storage.mouzhi2 && target.storage.mouzhi2.includes(player)) {
        return false;
      }
      return target !== player;
    },
    delay: 0,
    lose: false,
    discard: false,
    check(card) {
      if (card.name === "du") {
        return 20;
      }
      const player = _status.event.player;
      const useValue = player.getUseValue(card);
      let maxValue = 0;
      game.countPlayer((current) => {
        if (current !== player && !current.hasSkillTag("nogain") && get.attitude(player, current) > 0) {
          const currentValue = current.getUseValue(card);
          if (currentValue > maxValue) {
            maxValue = currentValue;
          }
        }
      });
      if (maxValue > 0 && get.tag(card, "damage")) {
        return 15;
      }
      if (maxValue > useValue) {
        return 10;
      }
      if (player.needsToDiscard()) {
        return 1 / Math.max(0.1, get.value(card));
      }
      return -1;
    },
    async content(event, trigger, player) {
      const cards2 = event.cards;
      const target = event.target;
      const giveEvent = player.give(cards2, target);
      target.addTempSkill("mouzhi2", { player: "phaseEnd" });
      target.storage.mouzhi2.add(player);
      target.storage.mouzhi2.sortBySeat(target);
      target.markSkill("mouzhi2");
      await giveEvent;
    },
    ai: {
      order: 10,
      result: {
        target(player, target) {
          if (!ui.selected.cards.length) {
            return 0;
          }
          const card = ui.selected.cards[0];
          if (card.name === "du") {
            return target.hasSkill("lucia_duqu") ? 1 : -1;
          }
          const targetValue = target.getUseValue(card);
          const playerValue = player.getUseValue(card);
          if (targetValue > playerValue) {
            return 2;
          }
          if (targetValue > 0) {
            return 1.5;
          }
          if (player.needsToDiscard()) {
            return 1;
          }
          return 0;
        }
      }
    }
  },
  mouzhi2: {
    init(player, skill) {
      if (!player.storage[skill]) {
        player.storage[skill] = [];
      }
    },
    onremove: true,
    trigger: { source: "damageSource" },
    forced: true,
    intro: {
      content: "出牌阶段内第一次对一名其他角色造成伤害时，$摸一张牌"
    },
    sourceSkill: "mouzhi",
    filter(event, player) {
      const phaseUseEvent = event.getParent("phaseUse");
      if (!phaseUseEvent || phaseUseEvent.player !== player) {
        return false;
      }
      const history = event.player.getHistory("damage", (evt) => evt.source === player && evt.getParent("phaseUse") === phaseUseEvent);
      return history[0] === event;
    },
    async content(event, trigger, player) {
      await game.asyncDraw(player.storage.mouzhi2);
      await game.delay();
    }
  },
  yuanlve: {
    enable: "phaseUse",
    usable: 1,
    audio: 2,
    filter(event, player) {
      return player.hasCards("h", (card) => get.type(card) !== "equip");
    },
    filterCard(card) {
      return get.type(card) !== "equip";
    },
    filterTarget: lib.filter.notMe,
    delay: false,
    discard: false,
    lose: false,
    check(card) {
      if (card.name === "du") {
        return 20;
      }
      const player = _status.event.player;
      const useValue = player.getUseValue(card);
      let maxValue = 0;
      game.countPlayer((current) => {
        if (current !== player && !current.hasSkillTag("nogain") && get.attitude(player, current) > 0) {
          const currentValue = current.getUseValue(card);
          if (currentValue > maxValue) {
            maxValue = currentValue;
          }
        }
      });
      if (maxValue > useValue) {
        return 15;
      }
      if (maxValue > 0) {
        return 10;
      }
      if (player.needsToDiscard()) {
        return 1 / Math.max(0.1, get.value(card));
      }
      return -1;
    },
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      await player.give(cards2, target);
      const result = await target.chooseUseTarget({
        card: cards2[0]
      }).forResult();
      if (!result.bool) {
        return;
      }
      await player.draw();
    },
    ai: {
      order: 10,
      result: {
        target(player, target) {
          if (!ui.selected.cards.length) {
            return 0;
          }
          const card = ui.selected.cards[0];
          if (card.name === "du") {
            return target.hasSkill("lucia_duqu") ? 1 : -1;
          }
          const targetValue = target.getUseValue(card);
          const playerValue = player.getUseValue(card);
          if (targetValue > playerValue) {
            return 2;
          }
          if (targetValue > 0) {
            return 1.5;
          }
          if (player.needsToDiscard()) {
            return 1;
          }
          return 0;
        }
      }
    }
  },
  //吕旷吕翔和淳于琼和官渡哔哔机
  spshicai: {
    audio: 2,
    enable: "phaseUse",
    position: "he",
    filter(event, player) {
      return !player.storage.spshicai2 || !player.hasCards("h", (card) => card === player.storage.spshicai2);
    },
    filterCard: true,
    prompt() {
      const str = get.itemtype(_status.pileTop) === "card" ? get.translation(_status.pileTop) : "牌堆顶的一张牌";
      return `弃置一张牌，然后获得${str}`;
    },
    check(card) {
      const player = _status.event.player;
      const cardx = _status.pileTop;
      if (get.itemtype(cardx) !== "card") {
        return 0;
      }
      const val = player.getUseValue(cardx, null, true);
      if (!val) {
        return 0;
      }
      const val2 = player.getUseValue(card, null, true);
      return (val - val2) / Math.max(0.1, get.value(card));
    },
    async content(event, trigger, player) {
      const card = get.cards()[0];
      player.storage.spshicai2 = card;
      await player.gain({
        cards: [card],
        animate: "draw"
      });
      game.log(player, "获得了牌堆顶的一张牌");
    },
    group: "spshicai_mark",
    ai: {
      order: 1,
      result: { player: 1 }
    }
  },
  spshicai_mark: {
    trigger: { player: "phaseUseBegin" },
    silent: true,
    firstDo: true,
    sourceSkill: "spshicai",
    async content(event, trigger, player) {
      player.addTempSkill("spshicai2", "phaseUseEnd");
    }
  },
  spshicai2: {
    onremove: true,
    mark: true,
    intro: {
      mark(dialog, content, player) {
        if (player !== game.me) {
          return `${get.translation(player)}观看牌堆中...`;
        }
        if (get.itemtype(_status.pileTop) !== "card") {
          return "牌堆顶无牌";
        }
        dialog.add([_status.pileTop]);
      }
    }
  },
  spfushi: {
    group: ["zezhu", "chenggong"],
    derivation: ["zezhu", "chenggong"],
    locked: true
  },
  zezhu: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      let enemy = 0;
      let friend = 0;
      let zhu = 0;
      for (const current of game.players) {
        if (current.isEnemyOf(player)) {
          enemy++;
        } else {
          friend++;
        }
        if (current !== player && current.isZhu) {
          zhu++;
        }
      }
      return zhu > 0 && enemy < friend;
    },
    filterTarget(card, player, target) {
      return target !== player && target.isZhu;
    },
    selectTarget: -1,
    multiline: true,
    multitarget: true,
    async content(event, trigger, player) {
      const { targets } = event;
      targets.sortBySeat();
      for (const target of targets) {
        if (target.hasGainableCards(player, "he")) {
          await player.gainPlayerCard({ target, position: "he", forced: true });
        } else {
          await player.draw();
        }
      }
      if (player.countCards("he") < targets.length) {
        return;
      }
      const result = await player.chooseCard({
        position: "he",
        forced: true,
        prompt: `依次选择${get.cnNumber(targets.length)}张牌，分别交给${get.translation(targets)}`,
        selectCard: targets.length,
        ai: (card) => {
          const target = _status.event.getParent().targets[ui.selected.cards.length];
          const current = _status.event.player;
          return get.attitude(current, target) * get.value(card, target);
        }
      }).forResult();
      const list = targets.map((target, index) => [target, result.cards[index]]);
      await game.loseAsync({
        gain_list: list,
        giver: player,
        player,
        cards: result.cards,
        animate: "giveAuto"
      }).setContent("gaincardMultiple");
    },
    ai: {
      order: 6,
      result: { player: 1 }
    }
  },
  chenggong: {
    audio: 2,
    trigger: { global: "useCardToPlayered" },
    filter(event, player) {
      if (!(event.isFirstTarget && event.targets && event.targets.length > 1 && event.player.isIn())) {
        return false;
      }
      let enemy = 0;
      let friend = 0;
      for (const i of game.players) {
        if (i.isEnemyOf(player)) {
          enemy++;
        } else {
          friend++;
        }
      }
      return enemy > friend;
    },
    check(event, player) {
      return get.attitude(player, event.player) > 0;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      await trigger.player.draw();
    }
  },
  cangchu: {
    trigger: {
      global: "phaseBefore",
      player: ["damageEnd", "enterGame"]
    },
    audio: 2,
    forced: true,
    filter(event, player) {
      if (event.name !== "damage") {
        return event.name !== "phase" || game.phaseNumber === 0;
      }
      return event.hasNature("fire") && player.countMark("cangchu") > 0;
    },
    async content(event, trigger, player) {
      if (trigger.name !== "damage") {
        player.addMark("cangchu", 3);
        return;
      }
      player.removeMark("cangchu", Math.min(trigger.num, player.countMark("cangchu")));
      if (!player.hasMark("cangchu")) {
        event.trigger("cangchuAwaken");
      }
    },
    marktext: "粮",
    intro: {
      name2: "粮",
      content: "mark"
    },
    ai: {
      threaten(player, target) {
        return 1 + target.countMark("cangchu") / 2;
      },
      effect: {
        target(card, player, target, current) {
          if (target.hasMark("cangchu")) {
            if (card.name === "sha") {
              if (lib.skill.global.includes("huoshaowuchao") || game.hasNature(card, "fire") || player.hasSkill("zhuque_skill")) {
                return 2;
              }
            }
            if (get.tag(card, "fireDamage") && current < 0) {
              return 2;
            }
          }
        }
      },
      combo: "liangying"
    }
  },
  sushou: {
    audio: 2,
    trigger: { player: "phaseDiscardBegin" },
    frequent: true,
    async content(event, trigger, player) {
      await player.draw(1 + player.countMark("cangchu"));
      const num = Math.min(
        player.countCards("h"),
        player.countCards("he"),
        game.countPlayer((target) => target != player && target.isFriendOf(player))
      );
      if (num) {
        let list = [];
        if (_status.connectMode) {
          game.broadcastAll(() => _status.noclearcountdown = true);
        }
        while (num - list.length > 0) {
          const { bool, targets, cards: cards2 } = await player.chooseCardTarget({
            prompt: "宿守：你可以交给友方角色各一张牌",
            position: "he",
            animate: false,
            filterCard(card, player2) {
              return !get.event().list.some((list2) => list2[1] == card);
            },
            filterTarget(card, player2, target) {
              return target != player2 && target.isFriendOf(player2) && !get.event().list.some((list2) => list2[0] == target);
            },
            ai1(card) {
              if (card.name == "shan") {
                return 1;
              }
              return Math.random();
            },
            ai2(target) {
              return get.attitude(get.event().player, target);
            }
          }).set("list", list).forResult();
          if (bool) {
            list.push([targets[0], cards2[0]]);
            player.addGaintag(cards2, "olsujian_given");
          } else {
            break;
          }
        }
        if (_status.connectMode) {
          game.broadcastAll(() => {
            delete _status.noclearcountdown;
            game.stopCountChoose();
          });
        }
        if (list.length) {
          await game.loseAsync({
            gain_list: list,
            player,
            cards: list.slice().flatMap((list2) => list2[1]),
            giver: player,
            animate: "giveAuto"
          }).setContent("gaincardMultiple");
        }
      }
    }
  },
  liangying: {
    trigger: {
      global: "phaseDrawBegin2",
      player: "cangchuAwaken"
    },
    forced: true,
    audio: false,
    logTarget(event, player) {
      if (event.name === "phaseDraw") {
        return event.player;
      }
      return game.filterPlayer((current) => current.isEnemyOf(player));
    },
    filter(event, player) {
      if (event.name === "cangchu") {
        return true;
      }
      return player.hasMark("cangchu") && !event.numFixed && event.player.isFriendOf(player);
    },
    async content(event, trigger, player) {
      if (trigger.name !== "cangchu") {
        trigger.num++;
        return;
      }
      const loseMaxHpEvent = player.loseMaxHp();
      const list = game.filterPlayer((current) => current.isEnemyOf(player));
      const drawPromise = list.length ? game.asyncDraw(list, 2) : null;
      await loseMaxHpEvent;
      if (drawPromise) {
        await drawPromise;
      }
      await game.delay();
    },
    ai: {
      combo: "cangchu"
    }
  },
  liehou: {
    enable: "phaseUse",
    usable: 1,
    audio: 2,
    filterTarget(card, player, target) {
      return player.inRange(target) && target.countCards("h");
    },
    async content(event, trigger, player) {
      const { target } = event;
      const giveResult = await target.chooseCard({
        position: "h",
        forced: true,
        prompt: `交给${get.translation(player)}一张牌`
      }).forResult();
      if (!giveResult.bool) {
        return;
      }
      await target.give(giveResult.cards, player);
      if (!player.countCards("h") || !game.hasPlayer((current) => current !== target && player.inRange(current))) {
        return;
      }
      const result = await player.chooseCardTarget({
        position: "h",
        filterCard: true,
        filterTarget: (card, player2, target2) => target2 !== _status.event.getParent().target && player2.inRange(target2),
        forced: true,
        prompt: "将一张手牌交给一名攻击范围内的其他角色",
        ai1: (card) => {
          const current = _status.event.player;
          if (get.name(card) === "du") {
            return 20;
          }
          if (game.hasPlayer((target2) => target2 !== _status.event.getParent().target && current.inRange(target2) && get.attitude(current, target2) > 0 && target2.getUseValue(card) > current.getUseValue(card))) {
            return 12;
          }
          if (game.hasPlayer((target2) => target2 !== current && get.attitude(current, target2) > 0)) {
            if (card.name === "wuxie") {
              return 11;
            }
            if (card.name === "shan" && current.countCards("h", "shan") > 1) {
              return 9;
            }
          }
          return 6 / Math.max(1, get.value(card));
        },
        ai2: (target2) => {
          const current = _status.event.player;
          const card = ui.selected.cards[0];
          const attitude = get.attitude(current, target2);
          if (card.name === "du") {
            return -6 * attitude;
          }
          if (attitude > 0) {
            if (get.position(card) === "h" && target2.getUseValue(card) > current.getUseValue(card)) {
              return 4 * attitude;
            }
            if (get.value(card, target2) > get.value(card, current)) {
              return 2 * attitude;
            }
            return 1.2 * attitude;
          }
          return -attitude * Math.min(4, target2.countCards("he")) / 6;
        }
      }).forResult();
      if (!result.bool) {
        return;
      }
      await player.give(result.cards, result.targets[0]);
    },
    ai: {
      order: 6,
      result: {
        target: -1
      }
    }
  },
  qigong: {
    trigger: { player: "shaMiss" },
    audio: 2,
    filter(event, player) {
      return event.targets?.length === 1 && event.target?.isIn() && game.hasPlayer((current) => current !== event.target && current.canUse("sha", event.target, false));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt(event.skill),
        prompt2: `令一名角色可再对${get.translation(trigger.target)}使用一张【杀】`,
        filterTarget: (card, player2, target) => {
          const source = _status.event.getTrigger().target;
          return target !== source && target.canUse("sha", source, false);
        },
        ai: (target) => {
          const player2 = _status.event.player;
          const card = { name: "sha" };
          const source = _status.event.getTrigger().target;
          if (target.hasSha()) {
            const effect = get.effect(source, card, target, target);
            if (effect > 0) {
              return get.effect(source, card, target, player2);
            }
          }
          return target !== player2 ? Math.random() * get.attitude(player2, target) : 0;
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      target.addTempSkill("qigong_ai", "chooseToUseEnd");
      const next = target.chooseToUse({
        prompt: `是否再对${get.translation(trigger.target)}使用一张【杀】？`,
        filterCard: (card, player2, event2) => get.name(card) === "sha" && lib.filter.filterCard(card, player2, event2),
        filterTarget: (card, player2, target2) => target2 === trigger.target,
        selectTarget: -1
      }).set("addCount", false).set("oncard", () => {
        _status.event.directHit.addArray(game.players);
      });
      await next;
    },
    subSkill: {
      ai: {
        ai: {
          directHit_ai: true,
          skillTagFilter(player, tag, arg) {
            return arg.card && arg.card.name === "sha";
          }
        }
      }
    }
  },
  //和沙摩柯一起上线的新服三将
  spjiedao: {
    audio: 2,
    trigger: { source: "damageBegin1" },
    filter(event, player) {
      return player.isDamaged() && game.getGlobalHistory("everything", (evt) => evt.name === "damage" && evt.source === player, event).indexOf(event) === 0 && event.player.isIn();
    },
    logTarget: "player",
    check(trigger, player) {
      if (get.attitude(player, trigger.player) >= -1) {
        return false;
      }
      return !trigger.player.hasSkillTag("filterDamage", null, {
        player,
        card: trigger.card
      });
    },
    async cost(event, trigger, player) {
      const num = player.getDamagedHp();
      const map = {};
      const controls = [];
      for (let i = 1; i <= num; i++) {
        const cn = get.cnNumber(i, true);
        map[cn] = i;
        controls.push(cn);
      }
      controls.push("cancel2");
      const result = await player.chooseControl({
        controls,
        prompt: get.prompt2(event.skill, trigger.player),
        ai: () => {
          if (!lib.skill.spjiedao.check(_status.event.getTrigger(), player)) {
            return "cancel2";
          }
          return get.cnNumber(_status.event.goon, true);
        }
      }).set("goon", num).forResult();
      event.result = {
        bool: result.control !== "cancel2",
        cost_data: map[result.control] || 1
      };
    },
    async content(event, trigger, player) {
      const selectedNum = event.cost_data;
      trigger.num += selectedNum;
      player.when({ global: "damageEnd" }).filter((evt) => evt === trigger).step(async (event2, trigger2, player2) => {
        if (!trigger2.player.isIn()) {
          return;
        }
        await player2.chooseToDiscard({
          selectCard: selectedNum,
          forced: true,
          position: "he"
        });
      });
    }
  },
  biaozhao: {
    audio: 2,
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile({ cards: cards2 });
      }
    },
    trigger: {
      player: "phaseJieshuBegin"
    },
    direct: true,
    filter(event, player) {
      return player.countCards("he") > 0 && !player.getExpansions("biaozhao").length;
    },
    async content(event, trigger, player) {
      const result = await player.chooseCard({
        position: "he",
        prompt: get.prompt("biaozhao"),
        prompt2: "将一张牌置于武将牌上作为“表”",
        ai: (card) => 6 - get.value(card)
      }).forResult();
      if (!result.bool) {
        return;
      }
      player.logSkill("biaozhao");
      await player.addToExpansion({
        cards: result.cards,
        source: player,
        animate: "give",
        gaintag: ["biaozhao"]
      });
    },
    ai: {
      notemp: true
    },
    group: ["biaozhao2", "biaozhao3"]
  },
  biaozhao2: {
    trigger: {
      global: ["loseAsyncAfter", "loseAfter", "cardsDiscardAfter"]
    },
    forced: true,
    audio: "biaozhao",
    sourceSkill: "biaozhao",
    filter(event, player) {
      if (event.name === "loseAsyncAfter" && event.type !== "discard") {
        return false;
      }
      if (event.name === "lose" && (event.getlx === false || event.position !== ui.discardPile)) {
        return false;
      }
      const expansionCards = player.getExpansions("biaozhao");
      if (!expansionCards.length) {
        return false;
      }
      const suit = get.suit(expansionCards[0]);
      const num = get.number(expansionCards[0]);
      const discardedCards = event.getd();
      for (const card of discardedCards) {
        if (get.suit(card) === suit && get.number(card) === num) {
          return true;
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      const card = player.getExpansions("biaozhao")[0];
      if (trigger.getParent().name === "discard") {
        await trigger.player.gain({
          cards: [card],
          source: player,
          animate: "give",
          bySelf: true
        });
      } else {
        await player.loseToDiscardpile({ cards: [card] });
      }
      await player.loseHp();
    }
  },
  biaozhao3: {
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    forced: true,
    charlotte: true,
    audio: "biaozhao",
    sourceSkill: "biaozhao",
    filter(event, player) {
      return player.getExpansions("biaozhao").length > 0;
    },
    async content(event, trigger, player) {
      const card = player.getExpansions("biaozhao")[0];
      await player.loseToDiscardpile({ cards: [card] });
      let num = 0;
      game.countPlayer((current) => {
        if (current.countCards("h") > num) {
          num = current.countCards("h");
        }
      });
      const result = await player.chooseTarget({
        prompt: `是否令一名角色将手牌摸至${num}张并回复1点体力？`,
        ai: (target2) => {
          let value = Math.min(_status.event.num - target2.countCards("h"), 5);
          if (target2.isDamaged()) {
            value++;
          }
          return value * get.attitude(_status.event.player, target2);
        }
      }).set("num", num).forResult();
      if (!result.bool) {
        return;
      }
      const target = result.targets[0];
      player.line(target, "green");
      const draw = Math.min(num - target.countCards("h"), 5);
      if (draw > 0) {
        await target.draw(draw);
      }
      await target.recover();
    }
  },
  yechou: {
    audio: 2,
    trigger: {
      player: "die"
    },
    forceDie: true,
    skillAnimation: true,
    animationColor: "wood",
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget: (card, player2, target) => player2 !== target && target.getDamagedHp() > 1,
        ai: (target) => {
          const attitude = get.attitude(_status.event.player, target);
          if (attitude > 0) {
            return 0;
          }
          const adjustedAttitude = Math.sqrt(0.01 - attitude);
          return adjustedAttitude * (get.distance(_status.currentPhase, target, "absolute") || game.players.length);
        }
      }).set("forceDie", true).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.line(target, "green");
      target.addTempSkill("yechou2", { player: "phaseZhunbeiBegin" });
    },
    ai: {
      expose: 0.5,
      maixie_defend: true
    }
  },
  yechou2: {
    mark: true,
    marktext: "仇",
    intro: {
      content: "每个回合结束时失去1点体力直到回合开始"
    },
    trigger: {
      global: "phaseAfter"
    },
    forced: true,
    sourceSkill: "yechou",
    async content(event, trigger, player) {
      await player.loseHp();
    }
  },
  yanjiao: {
    audio: 2,
    ai: {
      order: 10,
      result: {
        player: 1,
        target: 1.1
      }
    },
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target !== player;
    },
    async content(event, trigger, player) {
      const { target } = event;
      let num = 4;
      if (player.storage.xingshen) {
        num += player.storage.xingshen;
        player.storage.xingshen = 0;
        player.unmarkSkill("xingshen");
      }
      if (player.storage.olxingshen) {
        num += player.storage.olxingshen;
        player.storage.olxingshen = 0;
        player.unmarkSkill("olxingshen");
      }
      num = Math.min(10, num);
      const cards2 = get.cards(num);
      await game.cardsGotoOrdering(cards2);
      await player.showCards(cards2);
      let getedResult = lib.skill.yanjiao.getResult(cards2);
      if (!getedResult.length) {
        player.addTempSkill("yanjiao2");
        return;
      }
      const { control } = await target.chooseControl({
        controls: ["自动分配", "手动分配"],
        prompt: "【严教】：是否让系统自动分配方案？",
        ai: () => 0
      }).forResult();
      if (control === "手动分配") {
        const moveResult = await target.chooseToMove({
          prompt: "严教：分出点数相等的两组牌",
          list: [
            ["未分配", cards2, (list2) => `未分配（点数和${list2.reduce((sum, card) => sum + card.number, 0)}）`],
            ["第一组", [], (list2) => `第一组（点数和${list2.reduce((sum, card) => sum + card.number, 0)}）`],
            ["第二组", [], (list2) => `第二组（点数和${list2.reduce((sum, card) => sum + card.number, 0)}）`]
          ],
          processAI: () => false
        }).set("chooseTime", `${cards2.length * 4}`).set("filterOk", (moved2) => {
          const num1 = moved2[1].reduce((sum, card) => sum + card.number, 0);
          if (num1 === 0) {
            return false;
          }
          const num2 = moved2[2].reduce((sum, card) => sum + card.number, 0);
          return num1 === num2;
        }).forResult();
        if (!moveResult.bool) {
          player.addTempSkill("yanjiao2");
          return;
        }
        const moved = moveResult.moved;
        getedResult = [[moved[1], moved[2], moved[0]]];
      }
      const togain = getedResult[0];
      await target.showCards(togain[0], `${get.translation(target)}分出的第一份牌`);
      await target.showCards(togain[1], `${get.translation(target)}分出的第二份牌`);
      const { index } = await target.chooseControl({
        choiceList: [`获得${get.translation(togain[0])}`, `获得${get.translation(togain[1])}`],
        ai: () => Math.random() < 0.5 ? 1 : 0
      }).forResult();
      const list = [
        [target, togain[index]],
        [player, togain[1 - index]]
      ];
      await game.loseAsync({
        gain_list: list,
        giver: target,
        animate: "gain2"
      }).setContent("gaincardMultiple");
      if (togain[2].length > 1) {
        player.addTempSkill("yanjiao2");
      }
    },
    getResult(cards2) {
      const cl = cards2.length;
      const maxmium = Math.pow(3, cl);
      const filter = (list) => {
        if (!list[1].length || !list[0].length) {
          return false;
        }
        const num1 = list[1].reduce((sum, card) => sum + card.number, 0);
        const num2 = list[0].reduce((sum, card) => sum + card.number, 0);
        return num1 === num2;
      };
      const results = [];
      for (let i = 0; i < maxmium; i++) {
        const result = [[], [], []];
        for (let j = 0; j < cl; j++) {
          result[Math.floor(i % Math.pow(3, j + 1) / Math.pow(3, j))].push(cards2[j]);
        }
        if (filter(result)) {
          results.push(result);
        }
      }
      const filterSame = (list1, list2) => {
        if (list1[1].length !== list2[0].length || list1[0].length !== list2[1].length) {
          return false;
        }
        return list1[0].every((card) => list2[1].includes(card)) && list1[1].every((card) => list2[0].includes(card));
      };
      for (let i = 0; i < results.length; i++) {
        for (let j = i + 1; j < results.length; j++) {
          if (filterSame(results[i], results[j])) {
            results.splice(j--, 1);
          }
        }
      }
      results.sort((a, b) => a[2].length - b[2].length);
      return results.slice(0, 50);
    }
  },
  yanjiao2: {
    marktext: "教",
    mark: true,
    intro: {
      content: "本回合手牌上限-1"
    },
    mod: {
      maxHandcard(player, num) {
        return num - 1;
      }
    }
  },
  xingshen: {
    audio: 2,
    intro: {
      content: "下一次发动【严教】时多展示#张牌"
    },
    trigger: {
      player: "damageEnd"
    },
    frequent: true,
    async content(event, trigger, player) {
      await player.draw(player.isMinHandcard() ? 2 : 1);
      if (!player.storage.xingshen) {
        player.storage.xingshen = 0;
      }
      player.storage.xingshen += player.isMinHp() ? 2 : 1;
      if (player.storage.xingshen > 4) {
        player.storage.xingshen = 4;
      }
      player.markSkill("xingshen");
    }
  },
  pingjian: {
    initList() {
      game.initCharacterList();
    },
    init(player) {
      player.addSkill("pingjian_check");
      if (!player.storage.pingjian_check) {
        player.storage.pingjian_check = {};
      }
    },
    audio: 2,
    trigger: { player: ["damageEnd", "phaseJieshuBegin"] },
    frequent: true,
    async content(event, trigger, player) {
      if (Object.keys(player.storage.pingjian_check)?.length) {
        Object.keys(player.storage.pingjian_check).forEach((skill) => {
          player.removeSkill(skill);
          const names = player.tempname && player.tempname.filter((i) => get.character(i, 3)?.includes(skill));
          if (names) {
            get.nameList(player).forEach((name2) => {
              const { tempname } = get.character(name2);
              if (tempname && Array.isArray(tempname)) {
                names.removeArray(tempname);
              }
            });
            game.broadcastAll((player2, names2) => player2.tempname.removeArray(names2), player, names);
          }
          delete player.storage.pingjian_check[skill];
        });
      }
      if (!_status.characterlist) {
        game.initCharacterList();
      }
      const allList = _status.characterlist.slice(0);
      game.countPlayer((current) => {
        if (current.name && lib.character[current.name] && current.name.indexOf("gz_shibing") !== 0 && current.name.indexOf("gz_jun_") !== 0) {
          allList.add(current.name);
        }
        if (current.name1 && lib.character[current.name1] && current.name1.indexOf("gz_shibing") !== 0 && current.name1.indexOf("gz_jun_") !== 0) {
          allList.add(current.name1);
        }
        if (current.name2 && lib.character[current.name2] && current.name2.indexOf("gz_shibing") !== 0 && current.name2.indexOf("gz_jun_") !== 0) {
          allList.add(current.name2);
        }
      });
      const list = [];
      const skills2 = [];
      const map = [];
      allList.randomSort();
      const triggerName = event.triggername;
      for (const name2 of allList) {
        if (name2.indexOf("zuoci") !== -1 || name2.indexOf("xushao") !== -1) {
          continue;
        }
        const characterSkills = lib.character[name2][3];
        for (const skill of characterSkills) {
          if (player.getStorage("pingjian").includes(skill)) {
            continue;
          }
          if (player.hasSkill(skill, null, null, false)) {
            continue;
          }
          if (skills2.includes(skill)) {
            list.add(name2);
            if (!map[name2]) {
              map[name2] = [];
            }
            map[name2].push(skill);
            skills2.add(skill);
            continue;
          }
          const expandedSkills = [skill];
          game.expandSkills(expandedSkills);
          for (const expandedSkill of expandedSkills) {
            const info = lib.skill[expandedSkill];
            if (get.is.zhuanhuanji(expandedSkill, player)) {
              continue;
            }
            if (!info || !info.trigger || !info.trigger.player || info.silent || info.limited || info.juexingji || info.hiddenSkill || info.dutySkill || info.zhuSkill && !player.isZhu2()) {
              continue;
            }
            if (info.trigger.player === triggerName || Array.isArray(info.trigger.player) && info.trigger.player.includes(triggerName)) {
              if (info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) {
                continue;
              }
              if (info.init) {
                continue;
              }
              if (info.filter) {
                try {
                  const bool = info.filter(trigger, player, triggerName);
                  if (!bool) {
                    continue;
                  }
                } catch (e) {
                  continue;
                }
              }
              list.add(name2);
              if (!map[name2]) {
                map[name2] = [];
              }
              map[name2].push(skill);
              skills2.add(skill);
              break;
            }
          }
        }
        if (list.length > 2) {
          break;
        }
      }
      if (!skills2.length) {
        return;
      }
      event.list = list;
      const result = await player.chooseControl({ controls: skills2 }).set("dialog", ["评鉴：请选择尝试发动的技能", [list, "character"]]).forResult();
      player.markAuto("pingjian", [result.control]);
      player.addTempSkill(result.control);
      player.storage.pingjian_check[result.control] = trigger.name === "damage" ? trigger : "phaseJieshu";
      const name = event.list.find((name2) => lib.character[name2][3].includes(result.control));
      if (name) {
        game.broadcastAll((player2, name2) => player2.tempname.add(name2), player, name);
      }
    },
    group: "pingjian_use",
    phaseUse_special: [],
    ai: { threaten: 5 }
  },
  pingjian_use: {
    audio: "pingjian",
    enable: "phaseUse",
    usable: 1,
    sourceSkill: "pingjian",
    prompt: () => lib.translate.pingjian_info,
    async content(event, trigger, player) {
      if (Object.keys(player.storage.pingjian_check)?.length) {
        Object.keys(player.storage.pingjian_check).forEach((skill) => {
          player.removeSkill(skill);
          const names = player.tempname && player.tempname.filter((i) => get.character(i, 3)?.includes(skill));
          if (names) {
            get.nameList(player).forEach((name2) => {
              const { tempname } = get.character(name2);
              if (tempname && Array.isArray(tempname)) {
                names.removeArray(tempname);
              }
            });
            game.broadcastAll((player2, names2) => player2.tempname.removeArray(names2), player, names);
          }
          delete player.storage.pingjian_check[skill];
        });
      }
      const list = [];
      const skills2 = [];
      const map = [];
      const phaseUseEvent = event.getParent(2);
      if (!_status.characterlist) {
        game.initCharacterList();
      }
      const allList = _status.characterlist.slice(0);
      game.countPlayer((current) => {
        if (current.name && lib.character[current.name] && current.name.indexOf("gz_shibing") !== 0 && current.name.indexOf("gz_jun_") !== 0) {
          allList.add(current.name);
        }
        if (current.name1 && lib.character[current.name1] && current.name1.indexOf("gz_shibing") !== 0 && current.name1.indexOf("gz_jun_") !== 0) {
          allList.add(current.name1);
        }
        if (current.name2 && lib.character[current.name2] && current.name2.indexOf("gz_shibing") !== 0 && current.name2.indexOf("gz_jun_") !== 0) {
          allList.add(current.name2);
        }
      });
      allList.randomSort();
      for (const name2 of allList) {
        if (name2.indexOf("zuoci") !== -1 || name2.indexOf("xushao") !== -1) {
          continue;
        }
        const characterSkills = lib.character[name2][3];
        for (const skill of characterSkills) {
          if (player.getStorage("pingjian").includes(skill)) {
            continue;
          }
          if (player.hasSkill(skill, null, null, false)) {
            continue;
          }
          if (get.is.locked(skill, player)) {
            continue;
          }
          const skillInfoText = get.plainText(lib.translate[`${skill}_info`] || "");
          if (skills2.includes(skill) || skillInfoText.includes("当你于出牌阶段") && !skillInfoText.includes("当你于出牌阶段外")) {
            list.add(name2);
            map[name2] ??= [];
            map[name2].push(skill);
            skills2.add(skill);
            continue;
          }
          const expandedSkills = [skill];
          game.expandSkills(expandedSkills);
          for (const expandedSkill of expandedSkills) {
            const skillInfo = lib.skill[expandedSkill];
            if (get.is.zhuanhuanji(expandedSkill, player)) {
              continue;
            }
            if (!skillInfo || !skillInfo.enable || skillInfo.charlotte || skillInfo.limited || skillInfo.juexingji || skillInfo.hiddenSkill || skillInfo.dutySkill || skillInfo.zhuSkill && !player.isZhu2()) {
              continue;
            }
            if (skillInfo.enable === "phaseUse" || Array.isArray(skillInfo.enable) && skillInfo.enable.includes("phaseUse") || skillInfo.enable === "chooseToUse" || Array.isArray(skillInfo.enable) && skillInfo.enable.includes("chooseToUse")) {
              if (skillInfo.ai && (skillInfo.ai.combo || skillInfo.ai.notemp || skillInfo.ai.neg)) {
                continue;
              }
              if (skillInfo.init || skillInfo.onChooseToUse) {
                continue;
              }
              if (skillInfo.filter) {
                try {
                  const bool = skillInfo.filter(phaseUseEvent, player);
                  if (!bool) {
                    continue;
                  }
                } catch (e) {
                  continue;
                }
              } else if (skillInfo.viewAs && typeof skillInfo.viewAs !== "function") {
                try {
                  if (phaseUseEvent.filterCard && !phaseUseEvent.filterCard(skillInfo.viewAs, player, phaseUseEvent)) {
                    continue;
                  }
                  if (skillInfo.viewAsFilter && skillInfo.viewAsFilter(player) === false) {
                    continue;
                  }
                } catch (e) {
                  continue;
                }
              }
              list.add(name2);
              if (!map[name2]) {
                map[name2] = [];
              }
              map[name2].push(skill);
              skills2.add(skill);
              break;
            }
          }
        }
        if (list.length > 2) {
          break;
        }
      }
      if (!skills2.length) {
        return;
      }
      event.list = list;
      const result = await player.chooseControl({ controls: skills2 }).set("dialog", ["评鉴：请选择尝试发动的技能", [list, "character"]]).forResult();
      player.markAuto("pingjian", [result.control]);
      player.addTempSkill(result.control);
      player.storage.pingjian_check[result.control] = "phaseUse";
      const name = event.list.find((name2) => lib.character[name2][3].includes(result.control));
      if (name) {
        game.broadcastAll((player2, name2) => player2.tempname.add(name2), player, name);
      }
    },
    ai: { order: 12, result: { player: 1 } }
  },
  pingjian_check: {
    charlotte: true,
    trigger: { player: ["useSkill", "logSkillBegin"] },
    sourceSkill: "pingjian",
    filter(event, player) {
      const info = get.info(event.skill);
      if (info && info.charlotte) {
        return false;
      }
      const skill = get.sourceSkillFor(event);
      return player.storage.pingjian_check[skill];
    },
    direct: true,
    firstDo: true,
    priority: Infinity,
    async content(event, trigger, player) {
      const skill = get.sourceSkillFor(trigger);
      player.removeSkill(skill);
      const names = player.tempname && player.tempname.filter((i) => get.character(i, 3)?.includes(skill));
      if (names) {
        get.nameList(player).forEach((name) => {
          const { tempname } = get.character(name);
          if (tempname && Array.isArray(tempname)) {
            names.removeArray(tempname);
          }
        });
        game.broadcastAll((player2, names2) => player2.tempname.removeArray(names2), player, names);
      }
      delete player.storage.pingjian_check[skill];
    },
    group: "pingjian_check2"
  },
  pingjian_check2: {
    charlotte: true,
    trigger: { player: ["phaseUseEnd", "damageEnd", "phaseJieshuBegin"] },
    sourceSkill: "pingjian",
    filter(event, player) {
      return Object.keys(player.storage.pingjian_check).find((skill) => {
        if (event.name !== "damage") {
          return player.storage.pingjian_check[skill] === event.name;
        }
        return player.storage.pingjian_check[skill] === event;
      });
    },
    direct: true,
    lastDo: true,
    priority: -Infinity,
    async content(event, trigger, player) {
      const skills2 = Object.keys(player.storage.pingjian_check).filter((skill) => {
        if (trigger.name !== "damage") {
          return player.storage.pingjian_check[skill] === trigger.name;
        }
        return player.storage.pingjian_check[skill] === trigger;
      });
      player.removeSkill(skills2);
      const names = player.tempname && player.tempname.filter((i) => skills2.some((skill) => get.character(i, 3)?.includes(skill)));
      if (names) {
        get.nameList(player).forEach((name) => {
          const { tempname } = get.character(name);
          if (tempname && Array.isArray(tempname)) {
            names.removeArray(tempname);
          }
        });
        game.broadcastAll((player2, names2) => player2.tempname.removeArray(names2), player, names);
      }
      for (const skill of skills2) {
        delete player.storage.pingjian_check[skill];
      }
    }
  },
  //上兵伐谋
  //伊籍在标包 不会移动
  songshu: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.hasCards("h");
    },
    filterTarget(card, player, target) {
      return target !== player && player.canCompare(target);
    },
    async content(event, trigger, player) {
      const target = event.target;
      const result = await player.chooseToCompare(target).set("small", get.attitude(player, target) > 0).forResult();
      if (result.bool) {
        target.addTempSkill("songshu_ai");
        return;
      }
      const playerDrawEvent = player.draw({
        num: 2,
        nodelay: true
      });
      const targetDrawEvent = target.draw(2);
      player.tempBanSkill("songshu", "phaseUseAfter");
      await playerDrawEvent;
      await targetDrawEvent;
    },
    ai: {
      basic: {
        order: 1
      },
      expose: 0.2,
      result: {
        target(player, target) {
          if (target.hasSkill("songshu_ai", null, null, false)) {
            return 0;
          }
          let maxNumber = 0;
          const targetCards = target.getCards("h");
          for (const card of targetCards) {
            if (get.number(card) > maxNumber) {
              maxNumber = get.number(card);
            }
          }
          if (maxNumber > 10) {
            maxNumber = 10;
          }
          if (maxNumber < 5 && targetCards.length > 1) {
            maxNumber = 5;
          }
          const cards2 = player.getCards("h");
          for (const card of cards2) {
            if (get.number(card) < maxNumber) {
              return 1;
            }
          }
          return 0;
        }
      }
    }
  },
  songshu_ai: { charlotte: true },
  sibian: {
    audio: 2,
    trigger: { player: "phaseDrawBegin1" },
    filter(event, player) {
      return !event.numFixed;
    },
    async content(event, trigger, player) {
      trigger.changeToZero();
      const cards2 = get.cards(4);
      await game.cardsGotoOrdering(cards2);
      await player.showCards(cards2);
      cards2.sort((a, b) => b.number - a.number);
      const gains = [];
      const remainingCards = [];
      const extremeNumbers = [cards2[0].number, cards2[3].number];
      for (const card of cards2) {
        if (extremeNumbers.includes(card.number)) {
          gains.push(card);
        } else {
          remainingCards.push(card);
        }
      }
      await player.gain({
        cards: gains,
        animate: "gain2"
      });
      if (!remainingCards.length) {
        return;
      }
      const result = await player.chooseTarget({
        prompt: `是否令一名手牌数最少的角色获得${get.translation(remainingCards)}`,
        filterTarget: (_card, _player, target2) => target2.isMinHandcard(),
        ai: (target2) => get.attitude(_status.event.player, target2)
      }).forResult();
      if (!result.bool) {
        return;
      }
      const target = result.targets[0];
      player.line(target);
      player.addExpose(0.2);
      await target.gain({
        cards: remainingCards,
        animate: "gain2"
      });
    }
  },
  lslixun: {
    audio: 2,
    forced: true,
    trigger: { player: "damageBegin4" },
    marktext: "珠",
    intro: {
      name2: "珠",
      content: "共有#个“珠”"
    },
    async content(event, trigger, player) {
      trigger.cancel();
      player.addMark("lslixun", trigger.num);
    },
    group: "lslixun_fate"
  },
  lslixun_fate: {
    audio: "lslixun",
    trigger: { player: "phaseUseBegin" },
    forced: true,
    sourceSkill: "lslixun",
    filter(event, player) {
      return player.countMark("lslixun") > 0;
    },
    async content(event, trigger, player) {
      event.forceDie = true;
      _status.lslixun = player.countMark("lslixun");
      const judgeResult = await player.judge({
        judge: (card) => {
          if (get.number(card) < _status.lslixun) {
            return -_status.lslixun;
          }
          return 1;
        },
        judge2: (result) => result.bool
      }).forResult();
      delete _status.lslixun;
      if (judgeResult.bool) {
        return;
      }
      const discardResult = await player.chooseToDiscard({
        selectCard: [1, player.countMark("lslixun")],
        position: "h",
        ai: lib.skill.qiangxi.check
      }).forResult();
      let num = player.countMark("lslixun");
      if (discardResult.cards?.length) {
        num -= discardResult.cards.length;
      }
      if (num) {
        await player.loseHp(num);
      }
    }
  },
  lskuizhu: {
    audio: 2,
    trigger: { player: "phaseUseEnd" },
    filter(event, player) {
      return !player.isMaxHp(true);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2("lskuizhu"),
        filterTarget: (_card, player2, target) => target !== player2 && target.isMaxHp(),
        ai: (target) => {
          const targetHandCount = Math.min(5, target.countCards("h"));
          const delta = targetHandCount - player.countCards("h");
          if (delta <= 0) {
            return 0;
          }
          if (get.attitude(player, target) < 1) {
            return false;
          }
          return target.countCards("he", (card) => lib.skill.zhiheng.check(card) > 0) > 1 ? delta : 0;
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await player.drawTo(Math.min(5, target.countCards("h")));
      if (!player.hasCards("h")) {
        return;
      }
      await target.viewHandcards(player);
      if (!target.hasCards("h")) {
        return;
      }
      const result = await target.chooseToDiscard({
        forced: true,
        position: "h",
        selectCard: [0, player.countCards("h")],
        prompt: `弃置至多${get.cnNumber(player.countCards("h"))}张手牌，并获得${get.translation(player)}等量的手牌`,
        allowChooseAll: true,
        ai: (card) => {
          if (ui.selected.cards.length > 1) {
            return -1;
          }
          return lib.skill.zhiheng.check(card);
        }
      }).forResult();
      let result2 = result;
      if (result.bool && result.cards?.length && player.hasGainableCards(target, "h")) {
        result2 = await target.gainPlayerCard({
          target: player,
          position: "h",
          forced: true,
          selectButton: result.cards.length,
          visible: true
        }).forResult();
      }
      if (!result2.bool || !result2.cards || result2.cards.length <= 1) {
        return;
      }
      const forced = !(player.storage.lslixun > 0);
      const result3 = await player.chooseTarget({
        forced,
        prompt: `令${get.translation(target)}对其攻击范围内的一名角色造成1点伤害${forced ? "" : "，或点「取消」移去一个“珠”"}`,
        filterTarget: (_card, _player, damageTarget) => damageTarget !== target && target.inRange(damageTarget),
        ai: (damageTarget) => get.damageEffect(damageTarget, target, player)
      }).forResult();
      if (!result3.bool || !result3.targets?.length) {
        player.removeMark("lslixun", 1);
        return;
      }
      const target2 = result3.targets[0];
      player.line(target2);
      await target2.damage({ source: target });
    },
    ai: {
      expose: 0.25
    }
  },
  xpchijie: {
    audio: 2,
    trigger: {
      target: "useCardToAfter"
    },
    filter(event, player) {
      const evt = event.getParent();
      const targets = evt.targets.slice(evt.num + 1);
      return event.player !== player && targets.length > 0;
    },
    usable: 1,
    prompt2(event, player) {
      const evt = event.getParent();
      const targets = evt.targets.slice(evt.num + 1);
      return `令${get.translation(event.card)}对${get.translation(targets)}无效`;
    },
    check(event, player) {
      const evt = event.getParent();
      const targets = evt.targets.slice(evt.num + 1);
      let num = 0;
      for (const current of targets) {
        num += get.effect(current, evt.card, evt.player, player);
      }
      return num < -1;
    },
    async content(event, trigger, player) {
      const evt = trigger.getParent();
      evt.excluded.addArray(evt.targets);
    },
    group: "xpchijie2"
  },
  xpchijie2: {
    trigger: { global: "useCardAfter" },
    audio: "xpchijie",
    sourceSkill: "xpchijie",
    filter(event, player) {
      return event.player !== player && event.targets.includes(player) && event.cards.filterInD().length > 0 && !game.hasPlayer2((current) => current.getHistory("damage", (evt) => evt.card === event.card).length > 0);
    },
    usable: 1,
    check(event, player) {
      return get.value(event.cards.filterInD(), player, "raw") > 0;
    },
    prompt2(event, player) {
      return `获得${get.translation(event.cards.filterInD())}。`;
    },
    async content(event, trigger, player) {
      await player.gain({
        cards: trigger.cards.filterInD(),
        log: true,
        animate: "gain2"
      });
    }
  },
  xpchijie4: {},
  yinju: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    filterTarget: lib.filter.notMe,
    skillAnimation: true,
    animationColor: "water",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      player.storage.yinju2 = event.target;
      player.addTempSkill("yinju2");
      event.target.addTempSkill("yinju2_target");
    },
    ai: {
      result: {
        order: 10,
        player(player, target) {
          if (player.hasCards("hs", (card) => get.tag(card, "damage") && player.canUse(card, target)) && target.hp <= 2) {
            return 0.1;
          }
          if (player.countCards("hes", (card) => player.canUse(card, target)) <= 2) {
            return -100;
          }
          return 1;
        },
        target(player, target) {
          return target.isDamaged() ? 5 : 3;
        }
      }
    }
  },
  yinju2: {
    trigger: {
      player: "useCardToPlayered",
      source: "damageBefore"
    },
    forced: true,
    onremove: true,
    filter(event, player, name) {
      if (name == "useCardToPlayered") {
        return event.target == player.storage.yinju2;
      }
      return event.player == player.storage.yinju2;
    },
    logTarget(event) {
      return event[event.name == "damage" ? "player" : "target"];
    },
    async content(event, trigger, player) {
      if (trigger.name === "damage") {
        trigger.cancel();
        await trigger.player.recover(trigger.num);
      } else {
        await game.asyncDraw([player, trigger.target]);
        await game.delayx();
      }
    },
    ai: {
      effect: {
        player_use(card, player, target) {
          if (target !== player.storage.yinju2) {
            return;
          }
          if (card.name === "lebu") {
            return;
          }
          return [1, 0.6, 1, 0.6];
        }
      }
    },
    subSkill: {
      target: {
        charlotte: true,
        ai: {
          effect: {
            target(card, player, target) {
              if (!player || target !== player.storage.yinju2) {
                return;
              }
              if (card.name !== "huogong" && get.tag(card, "damage")) {
                return [0, target.isDamaged() ? 2.5 : 0.6, 0, 1];
              }
              return [1, 0.6, 1, 1];
            }
          }
        }
      }
    }
  },
  rewenji: {
    audio: "spwenji",
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => current !== player && current.hasCards("he"));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget: (_card, player2, target) => target !== player2 && target.hasCards("he"),
        ai: (target) => {
          const att = get.attitude(_status.event.player, target);
          if (att > 0) {
            return Math.sqrt(att) / 10;
          }
          return 5 - att;
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const cardResult = await target.chooseCard({
        position: "he",
        forced: true,
        prompt: `问计：将一张牌交给${get.translation(player)}`
      }).forResult();
      if (!cardResult.bool) {
        return;
      }
      player.addTempSkill("rewenji_respond");
      player.storage.rewenji_respond = get.type2(cardResult.cards[0], target);
      await target.give(cardResult.cards, player, true);
    },
    subSkill: {
      respond: {
        onremove: true,
        trigger: { player: "useCard" },
        forced: true,
        charlotte: true,
        audio: "spwenji",
        filter(event, player) {
          return get.type2(event.card) === player.storage.rewenji_respond;
        },
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.filterPlayer((current) => current !== player));
        },
        ai: {
          directHit_ai: true,
          skillTagFilter(player, tag, arg) {
            return get.type2(arg.card) === player.storage.rewenji_respond;
          }
        }
      }
    }
  },
  spwenji: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => current !== player && current.countCards("he"));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget: (_card, player2, target) => target !== player2 && target.countCards("he") > 0,
        ai: (target) => {
          const att = get.attitude(_status.event.player, target);
          if (att > 0) {
            return Math.sqrt(att) / 10;
          }
          return 5 - att;
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const cardResult = await target.chooseCard({
        position: "he",
        forced: true,
        prompt: `问计：将一张牌交给${get.translation(player)}`
      }).forResult();
      if (!cardResult.bool) {
        return;
      }
      player.addTempSkill("spwenji_respond");
      player.storage.spwenji_respond = cardResult.cards[0].name;
      await target.give(cardResult.cards, player, true);
    },
    subSkill: {
      respond: {
        onremove: true,
        trigger: { player: "useCard" },
        forced: true,
        charlotte: true,
        audio: "spwenji",
        filter(event, player) {
          return event.card.name === player.storage.spwenji_respond;
        },
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.filterPlayer((current) => current !== player));
        },
        ai: {
          directHit_ai: true,
          skillTagFilter(player, tag, arg) {
            return arg.card.name === player.storage.spwenji_respond;
          }
        }
      }
    }
  },
  sptunjiang: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    frequent: true,
    filter(event, player) {
      return player.getHistory("useCard", (evt) => {
        if (evt.targets && evt.targets.length && evt.isPhaseUsing()) {
          const targets = evt.targets.slice(0);
          while (targets.includes(player)) {
            targets.remove(player);
          }
          return targets.length > 0;
        }
        return false;
      }).length === 0;
    },
    async content(event, trigger, player) {
      await player.draw(game.countGroup());
    }
  },
  bingzhao: {
    audio: 2,
    trigger: {
      global: ["phaseBefore", "zhuUpdate"],
      player: "enterGame"
    },
    filter(event, player) {
      if (player.storage.bingzhao) {
        return false;
      }
      return lib.group.some((group) => group != player.group) && player.hasZhuSkill("bingzhao") && (event.name != "phase" || game.phaseNumber == 0);
    },
    zhuSkill: true,
    async cost(event, trigger, player) {
      const list = lib.group.filter((group) => group != player.group).slice();
      const maxGroup = list.slice().sort((a, b) => {
        return game.countPlayer((current) => {
          return current.group == b && current != player;
        }) - game.countPlayer((current) => {
          return current.group == a && current != player;
        });
      })[0];
      const { control } = await player.chooseControl(list).set("prompt", "秉诏：请选择一个其他势力").set("ai", () => {
        return get.event().choice;
      }).set("choice", maxGroup).forResult();
      event.result = { bool: true, cost_data: control };
    },
    async content(event, trigger, player) {
      const { cost_data: group } = event;
      player.popup(get.translation(group) + "势力", get.groupnature(group, "raw"));
      game.log(player, "选择了", "#y" + get.translation(group) + "势力");
      player.storage[event.name] = group;
      player.markSkill(event.name);
    },
    intro: { content: "已选择了$势力" },
    ai: { combo: "guju" }
  },
  baijia: {
    audio: 2,
    audioname: ["tw_beimihu"],
    derivation: "bmcanshi",
    juexingji: true,
    ai: { combo: "guju" },
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    skillAnimation: true,
    animationColor: "thunder",
    filter(event, player) {
      return player.getAllHistory("gain", (evt) => evt.getParent().name == "draw" && evt.getParent(2).name == "guju").reduce((num, evt) => num + evt.cards.length, 0) >= 7;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.gainMaxHp();
      await player.recover();
      const targets = game.filterPlayer((current) => player != current && !current.hasMark("zongkui_mark"));
      if (targets.length) {
        for (const target of targets.sortBySeat()) {
          target.addMark("zongkui_mark", 1);
          player.line(target, "green");
        }
      }
      await player.changeSkills(["bmcanshi"], ["guju"]);
    }
  },
  bmcanshi: {
    audio: 2,
    audioname: ["tw_beimihu"],
    trigger: {
      player: "useCard2",
      target: "useCardToTarget"
    },
    filter(event, player, name) {
      const { targets, card } = event;
      if (!["basic", "trick"].includes(get.type(card))) {
        return false;
      }
      if (!targets || targets.length != 1) {
        return false;
      }
      if (name == "useCardToTarget") {
        return event.player.hasMark("zongkui_mark");
      }
      const info = get.info(card);
      if (info.multitarget) {
        return false;
      }
      if (info.allowMultiple == false) {
        return false;
      }
      return game.hasPlayer((current) => {
        if (!current.hasMark("zongkui_mark")) {
          return false;
        }
        return !targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
      });
    },
    check(event, player) {
      return get.attitude(event.player, player) < 0 && get.effect(player, event.card, event.player, player) < 0;
    },
    async cost(event, trigger, player) {
      if (event.triggername == "useCardToTarget") {
        const { player: target } = trigger;
        const result = await player.chooseBool(get.prompt2(event.skill, target)).set("choice", get.info(event.skill).check(trigger, player)).forResult();
        if (result?.bool) {
          event.result = { bool: true, targets: [target] };
        }
      } else {
        event.result = await player.chooseTarget(get.prompt2(event.skill), [1, Infinity], (card, player2, target) => {
          if (!target.hasMark("zongkui_mark")) {
            return false;
          }
          const trigger2 = get.event().getTrigger();
          return !trigger2.targets.includes(target) && lib.filter.targetEnabled2(trigger2.card, player2, target);
        }).set("ai", (target) => {
          const player2 = get.player();
          return get.effect(target, get.event().getTrigger().card, player2, player2);
        }).forResult();
      }
    },
    async content(event, trigger, player) {
      if (event.triggername == "useCardToTarget") {
        trigger.targets.remove(player);
        trigger.getParent().triggeredTargets2.remove(player);
        await game.delay();
        trigger.player.removeMark("zongkui_mark");
      } else {
        if (!event.isMine() && !event.isOnline()) {
          await game.delayx();
        }
        const { targets } = event;
        targets.sortBySeat().forEach((current) => current.removeMark("zongkui_mark", 1));
        trigger.targets.addArray(event.targets);
      }
    },
    ai: { combo: "zongkui" }
  },
  guju: {
    audio: 2,
    audioname: ["tw_beimihu"],
    trigger: { global: "damageEnd" },
    forced: true,
    filter(event, player) {
      return event.player != player && event.player.hasMark("zongkui_mark");
    },
    async content(event, trigger, player) {
      await player.draw();
      player.addMark(event.name, 1, false);
      const { player: target } = trigger;
      if (player.hasZhuSkill("bingzhao", target) && target.group == player.storage.bingzhao && target.isIn()) {
        const result = await target.chooseBool(`是否对${get.translation(player)}发动【秉诏】？`).set("choice", get.attitude(target, player) > 1).forResult();
        if (!result?.bool) {
          return;
        }
        target.logSkill("bingzhao", player);
        await player.draw();
        player.addMark(event.name, 1, false);
      }
    },
    intro: { content: "已因〖骨疽〗获得#张牌" },
    ai: { combo: "zongkui" }
  },
  zongkui: {
    trigger: {
      player: "phaseBeforeEnd",
      global: "roundStart"
    },
    audio: 2,
    audioname: ["tw_beimihu"],
    filter(event, player, name) {
      return game.hasPlayer((current) => {
        if (name == "roundStart" && !current.isMinHp()) {
          return false;
        }
        return current != player && !current.hasMark("zongkui_mark");
      });
    },
    async cost(event, trigger, player) {
      const targets = game.filterPlayer((current) => {
        if (event.triggername == "roundStart" && !current.isMinHp()) {
          return false;
        }
        return current != player && !current.hasMark("zongkui_mark");
      });
      if (event.triggername == "roundStart" && targets.length == 1) {
        event.result = { bool: true, targets };
      } else {
        const round = event.triggername == "roundStart";
        const next = player.chooseTarget(get.prompt(event.skill), `令一名${event.triggername == "roundStart" ? "体力值最小的" : ""}其他角色获得“傀”标记`, (card, player2, target) => {
          if (get.event().round && !target.isMinHp()) {
            return false;
          }
          return target != player2 && !target.hasMark("zongkui_mark");
        }).set("ai", (target) => {
          const num = target.isMinHp() ? 0.5 : 1;
          return num * get.threaten(target);
        }).set("round", round);
        if (round) {
          next.set("forced", true);
        }
        event.result = await next.forResult();
      }
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      target.addMark("zongkui_mark", 1);
      await game.delayx();
    },
    subSkill: {
      mark: {
        marktext: "傀",
        intro: {
          name2: "傀",
          content: "mark"
        }
      }
    },
    ai: {
      combo: "guju",
      threaten: 1.4
    }
  },
  xinfu_langxi: {
    audio: 2,
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    filter(event, player) {
      return game.hasPlayer(function(current) {
        return current != player && current.hp <= player.hp;
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.name.slice(0, -5)), "对一名体力值不大于你的其他角色造成0-2点随机伤害", (card, player2, target) => {
        return target !== player2 && target.hp <= player2.hp;
      }).set("ai", (target) => {
        const player2 = get.event().player, att = get.attitude(player2, target);
        if (att > 0) {
          return 0;
        }
        return get.damageEffect(target, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      if (get.mode() !== "identity" || player.identity !== "nei") {
        player.addExpose(0.3);
      }
      event.num = get.rand(1, 6);
      const num = Math.ceil(event.num / 2 - 1);
      player.popup(num ? get.cnNumber(num) + "点" : "🐏袭");
      await target.damage(Math.ceil(event.num / 2 - 1));
    },
    ai: {
      threaten: 1.7
    }
  },
  xinfu_yisuan: {
    usable: 1,
    audio: 2,
    trigger: {
      player: "useCardEnd"
    },
    check(event, player) {
      return get.value(event.cards) + player.maxHp * 2 - 18 > 0;
    },
    prompt2(event, player) {
      return `你可以减1点体力上限，然后获得${get.translation(event.cards.filterInD())}。`;
    },
    filter(event, player) {
      return player.isPhaseUsing() && get.type(event.card) === "trick" && event.cards.filterInD().length > 0;
    },
    async content(event, trigger, player) {
      await player.loseMaxHp();
      await player.gain({
        cards: trigger.cards.filterInD(),
        animate: "gain2",
        log: true
      });
    }
  },
  xinfu_xingluan: {
    usable: 1,
    audio: 2,
    trigger: {
      player: "useCardAfter"
    },
    filter(event, player) {
      if (!player.isPhaseUsing()) {
        return false;
      }
      if (get.type(event.card) === void 0) {
        return false;
      }
      return event.targets && event.targets.length === 1;
    },
    async content(event, trigger, player) {
      const card = get.cardPile2((card2) => card2.number === 6, "random");
      if (!card) {
        player.chat("无牌可得了吗");
        game.log("但是牌堆里面已经没有点数为6的牌了！");
        return;
      }
      await player.gain({ cards: [card], animate: "gain2" });
    }
  },
  xinfu_lveming: {
    intro: {
      content: "已发动过#次"
    },
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return player !== target && target.countCards("e") < player.countCards("e");
    },
    async content(event, trigger, player) {
      const target = event.target;
      const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((index) => get.strNumber(index));
      const controlResult = await target.chooseControl({
        controls: list,
        prompt: "请选择一个点数",
        ai: () => get.rand(0, 12)
      }).forResult();
      const num = controlResult.control ? controlResult.index + 1 : 13;
      target.$damagepop(controlResult.control || "K", "thunder");
      event.num = num;
      game.log(target, "选择的点数是", `#y${get.strNumber(num)}`);
      player.addMark(event.name, 1, false);
      const judgeResult = await player.judge({
        judge: (card2) => {
          if (card2.number === _status.event.getParent("xinfu_lveming").num) {
            return 4;
          }
          return 0;
        }
      }).forResult();
      if (judgeResult.bool) {
        await target.damage(2);
        return;
      }
      const card = target.getCards("hej").randomGet();
      if (card) {
        await player.gain({
          cards: [card],
          source: target,
          animate: "giveAuto",
          bySelf: true
        });
      }
    },
    ai: {
      order: 9,
      result: {
        player(player, target) {
          if (target.countCards("hej")) {
            return 0.92;
          }
          return 0;
        },
        target(player, target) {
          const numj = target.countCards("j");
          const numhe = target.countCards("he");
          if (numhe + numj > 0) {
            return (1.6 * numj - numhe) / (numj + numhe) - 0.3;
          }
          return -0.3;
        }
      },
      threaten: 1.1
    }
  },
  xinfu_tunjun: {
    skillAnimation: true,
    animationColor: "metal",
    limited: true,
    enable: "phaseUse",
    audio: 2,
    filter(event, player) {
      return player.hasMark("xinfu_lveming");
    },
    filterTarget: true,
    selectTarget: 1,
    async content(event, trigger, player) {
      const { target } = event;
      player.awakenSkill(event.name);
      let num = player.countMark("xinfu_lveming");
      while (num > 0) {
        num--;
        const card = get.cardPile2((card2) => get.type(card2) == "equip" && target.canEquip(card2));
        if (card) {
          target.$gain(card);
          await target.chooseUseTarget({ forced: true, card, animate: false, nopopup: true });
        } else {
          break;
        }
      }
    },
    ai: {
      combo: "xinfu_lveming",
      order(item, player) {
        player ??= get.player();
        let num = 0;
        for (let i = 1; i < 6; i++) {
          num += player.countEquipableSlot(i);
        }
        if (num <= 2) {
          return 6;
        }
        if (player.hp <= 2 || !game.hasPlayer((current) => {
          if (player == current || get.attitude(player, current) < 0 || current.hp <= 1) {
            return false;
          }
          return current.hp > 2 || current.countCards("hs") > 2;
        })) {
          return 1;
        }
        return 0;
      },
      result: {
        target(player, target) {
          let num = 0;
          for (let i = 1; i < 6; i++) {
            num += target.countEquipableSlot(i);
          }
          return num;
        }
      }
    }
  },
  xinfu_tanbei: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return player !== target;
    },
    async content(event, trigger, player) {
      const { target } = event;
      let result = { index: 1 };
      if (target.hasCards("hej")) {
        result = await target.chooseControl({
          choiceList: [`令${get.translation(player)}随机获得你区域内的一张牌，然后其本回合内不能再对你使用牌。`, `令${get.translation(player)}本回合内对你使用牌没有次数与距离限制。`],
          ai: () => [0, 1].randomGet()
        }).forResult();
      }
      player.addTempSkill("tanbei_effect3");
      if (result.index !== 0) {
        target.addTempSkill("tanbei_effect1");
        return;
      }
      const card = target.getCards("hej").randomGet();
      await player.gain({ cards: [card], source: target, animate: "giveAuto", bySelf: true });
      target.addTempSkill("tanbei_effect2");
    },
    ai: {
      order() {
        return [2, 4, 6, 8, 10].randomGet();
      },
      result: {
        target(player, target) {
          return -2 - target.countCards("h");
        }
      },
      threaten: 1.1
    }
  },
  tanbei_effect3: {
    charlotte: true,
    mod: {
      targetInRange(card, player, target) {
        if (target.hasSkill("tanbei_effect1")) {
          return true;
        }
      },
      cardUsableTarget(card, player, target) {
        if (target.hasSkill("tanbei_effect1")) {
          return true;
        }
      },
      playerEnabled(card, player, target) {
        if (target.hasSkill("tanbei_effect2")) {
          return false;
        }
      }
    }
  },
  xinfu_sidao: {
    audio: 2,
    trigger: {
      player: "useCardAfter"
    },
    filter(event, player) {
      if (player.hasSkill("xinfu_sidaoy") || !player.hasCards("hs")) {
        return false;
      }
      if (!event.targets || !event.targets.length || !event.isPhaseUsing(player)) {
        return false;
      }
      const history = player.getHistory("useCard");
      const index = history.indexOf(event) - 1;
      if (index < 0) {
        return false;
      }
      const evt = history[index];
      if (!evt || !evt.targets || !evt.targets.length || !evt.isPhaseUsing(player)) {
        return false;
      }
      for (const target of event.targets) {
        if (evt.targets.includes(target) && lib.filter.filterTarget({ name: "shunshou" }, player, target)) {
          return true;
        }
      }
      return false;
    },
    direct: true,
    async content(event, trigger, player) {
      const targets = player.getLastUsed(1).targets;
      const next = player.chooseToUse();
      next.set(
        "targets",
        game.filterPlayer((current) => targets.includes(current) && trigger.targets.includes(current))
      );
      next.set("openskilldialog", get.prompt2("xinfu_sidao"));
      next.set("norestore", true);
      next.set("_backupevent", "xinfu_sidaox");
      next.set("custom", {
        add: {},
        replace: { window() {
        } }
      });
      next.backup("xinfu_sidaox");
      await next;
    }
  },
  xinfu_sidaox: {
    audio: "xinfu_sidao",
    sourceSkill: "xinfu_sidao",
    filterCard(card) {
      return get.itemtype(card) === "card";
    },
    position: "hs",
    viewAs: {
      name: "shunshou"
    },
    filterTarget(card, player, target) {
      return _status.event.targets && _status.event.targets.includes(target) && lib.filter.filterTarget.apply(this, arguments);
    },
    prompt: "将一张手牌当顺手牵羊使用",
    check(card) {
      return 7 - get.value(card);
    },
    onuse(links, player) {
      player.addTempSkill("xinfu_sidaoy");
    }
  },
  xinfu_sidaoy: {},
  tanbei_effect1: {
    charlotte: true
  },
  tanbei_effect2: {
    charlotte: true
  },
  xinfu_tunan: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target != player;
    },
    async content(event, trigger, player) {
      const { target } = event;
      const cards2 = get.cards(1, true);
      await target.viewCards(get.translation(player) + "对你发动了【图南】", cards2);
      const [card] = cards2;
      const bool1 = game.hasPlayer(function(current) {
        return target.canUse(card, current, false);
      });
      const bool2 = game.hasPlayer(function(current) {
        return target.canUse(get.autoViewAs({ name: "sha" }, [card]), current);
      });
      let result;
      if (bool1 && bool2) {
        result = await target.chooseControl(function() {
          return 0;
        }).set("choiceList", ["使用" + get.translation(cards2) + "。（没有距离限制）", "将" + get.translation(cards2) + "当做【杀】使用。"]).set("ai", function() {
          return _status.event.choice;
        }).set("choice", target.getUseValue(card, false) > target.getUseValue({ name: "sha", cards: cards2 }) ? 0 : 1).forResult();
      } else if (bool1) {
        result = { index: 0 };
      } else if (bool2) {
        result = { index: 1 };
      } else {
        return;
      }
      if (typeof result.index == "number") {
        const { index } = result;
        if (index == 1) {
          await target.chooseUseTarget({ name: "sha" }, cards2, true, false).set("viewAs", false);
        } else {
          await target.chooseUseTarget(card, true, false, "nodistance");
        }
      }
    },
    ai: {
      order: 7,
      result: {
        target: 1
      }
    }
  },
  xinfu_bijing: {
    audio: 2,
    subSkill: {
      lose: {
        trigger: {
          global: "phaseDiscardBegin"
        },
        audio: "xinfu_bijing",
        charlotte: true,
        filter(event, player) {
          if (event.player === player) {
            return false;
          }
          return player.getHistory("lose", (evt) => {
            for (const i in evt.gaintag_map) {
              if (evt.gaintag_map[i].includes("xinfu_bijing")) {
                return true;
              }
            }
          }).length > 0 && event.player.hasCards("he");
        },
        forced: true,
        logTarget: "player",
        async content(event, trigger, player) {
          await trigger.player.chooseToDiscard({ selectCard: 2, forced: true, position: "he" });
        },
        sub: true
      },
      discard: {
        audio: "xinfu_bijing",
        trigger: {
          player: "phaseZhunbeiBegin"
        },
        forced: true,
        charlotte: true,
        filter(event, player) {
          return player.hasCard((card) => card.hasGaintag("xinfu_bijing") && player.canRecast(card), "h");
        },
        async content(event, trigger, player) {
          await player.recast(player.getCards("h", (card) => card.hasGaintag("xinfu_bijing") && player.canRecast(card)));
        },
        sub: true
      }
    },
    trigger: {
      player: "phaseJieshuBegin"
    },
    filter(event, player) {
      return player.hasCards("h");
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard({
        prompt: get.prompt2(event.skill),
        position: "h",
        selectCard: [1, 2],
        ai: (card) => {
          if (card.name === "shan") {
            return 6;
          }
          return 6 - get.value(card);
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      player.addGaintag(event.cards, "xinfu_bijing");
      player.addSkill("xinfu_bijing_lose");
      player.addSkill("xinfu_bijing_discard");
    }
  },
  xinfu_zhenxing: {
    audio: 2,
    trigger: {
      player: ["damageEnd", "phaseJieshuBegin"]
    },
    async cost(event, trigger, player) {
      const result = await player.chooseControl("一张", "两张", "三张", "cancel2").set("prompt", get.prompt2(event.skill)).set("ai", function() {
        return 0;
      }).forResult();
      event.result = {
        bool: result.control !== "cancel2",
        cost_data: result.index + 1
      };
    },
    async content(event, trigger, player) {
      const cards2 = get.cards(event.cost_data);
      await game.cardsGotoOrdering(cards2);
      let result = await player.chooseButton(["【镇行】：请选择要获得的牌", cards2]).set("filterButton", function(button) {
        var cards3 = _status.event.cards;
        for (var i = 0; i < cards3.length; i++) {
          if (button.link != cards3[i] && get.suit(cards3[i]) == get.suit(button.link)) {
            return false;
          }
        }
        return true;
      }).set("ai", function(button) {
        return get.value(button.link);
      }).set("cards", cards2).forResult();
      if (result.bool) {
        await player.gain(result.links, "gain2");
      }
    }
  },
  xinfu_qianxin: {
    audio: 2,
    group: ["xinfu_qianxin2"],
    enable: "phaseUse",
    usable: 1,
    onChooseToUse(event) {
      if (!game.online) {
        var num1 = game.players.length - 1;
        var player = event.player;
        var num2 = ui.cardPile.childElementCount;
        var num3 = num2;
        if (num1 > num2) {
          num3 = 0;
        } else if (player.storage.xinfu_qianxin) {
          for (var i = 0; i < num2; i++) {
            if (player.storage.xinfu_qianxin.includes(ui.cardPile.childNodes[i])) {
              num3 = 0;
              break;
            }
          }
        }
        event.set("qianxinNum", num3);
      }
    },
    filter(event, player) {
      return event.qianxinNum && event.qianxinNum > 0;
    },
    filterTarget(card, player, target) {
      return target != player;
    },
    filterCard: true,
    selectCard() {
      var num1 = game.players.length - 1;
      var num2 = _status.event.qianxinNum;
      return [1, Math.floor(num2 / num1)];
    },
    discard: false,
    check() {
      return -1;
    },
    delay: false,
    lose: false,
    prompt() {
      return "选择一名角色并将任意张手牌放置于牌堆中" + get.cnNumber(game.players.length) + "倍数的位置（先选择的牌在上）";
    },
    allowChooseAll: true,
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      player.$throw(cards2.length);
      player.storage.xinfu_qianxin = cards2.slice(0);
      player.storage.xinfu_qianxin2 = target;
      game.log(player, "把", get.cnNumber(cards2.length), "张牌放在了牌堆里");
      await player.lose(cards2, ui.cardPile).set("insert_index", function(event2, card) {
        const num1 = game.players.length, i = event2.cards.indexOf(card);
        const num3 = num1 * (i + 1) - 1;
        return ui.cardPile.childNodes[num3];
      });
      await game.delayx();
    },
    ai: {
      order: 1,
      result: {
        target: -1
      }
    }
  },
  xinfu_qianxin2: {
    subSkill: {
      dis: {
        mod: {
          maxHandcard(player, num) {
            return num - 2;
          }
        },
        sub: true
      }
    },
    forced: true,
    locked: false,
    audio: "xinfu_qianxin",
    logTarget: "player",
    sourceSkill: "xinfu_qianxin",
    trigger: {
      global: "phaseDiscardBegin"
    },
    filter(event, player) {
      if (player.storage.xinfu_qianxin2 != event.player) {
        return false;
      }
      if (!player.storage.xinfu_qianxin) {
        return false;
      }
      var hs = event.player.getCards("h");
      var cs = player.storage.xinfu_qianxin;
      var history = event.player.getHistory("gain");
      for (var i = 0; i < history.length; i++) {
        for (var j = 0; j < history[i].cards.length; j++) {
          var card = history[i].cards[j];
          if (hs.includes(card) && cs.includes(card)) {
            return true;
          }
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      delete player.storage.xinfu_qianxin2;
      let result;
      if (player.countCards("h") >= 4) {
        result = { index: 1 };
      } else {
        result = await target.chooseControl().set("choiceList", ["令" + get.translation(player) + "将手牌摸至四张", "令自己本回合的手牌上限-2"]).set("ai", function() {
          const player2 = _status.event.player;
          const source = _status.event.getParent().player;
          if (get.attitude(player2, source) > 0) {
            return 0;
          }
          if (player2.hp - player2.countCards("h") > 1) {
            return 1;
          }
          return [0, 1].randomGet();
        }).forResult();
      }
      if (typeof result.index == "number") {
        if (result.index == 0) {
          await player.drawTo(4);
        } else {
          target.addTempSkill("xinfu_qianxin2_dis");
        }
      }
    }
  },
  xinfu_fuhai: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.hasCards("h") && game.hasPlayer((target) => get.info("xinfu_fuhai").filterTarget(null, player, target));
    },
    filterTarget(card, player, target) {
      return [player.next, player.previous].includes(target) && !player.getStorage("xinfu_fuhai_used").includes(target);
    },
    line: false,
    async content(event, trigger, player) {
      const { target } = event;
      let current, result;
      const side = target == player.next ? "next" : "previous";
      player.addTempSkill(event.name + "_used", "phaseAnyAfter");
      player.addTempSkill(event.name + "_mark");
      while (true) {
        current = !current ? target : current[side];
        if (!player.hasCards("h") || !current.hasCards("h") || player == current || player.getStorage(event.name + "_used").includes(current)) {
          return;
        }
        player.line(current, "green");
        player.markAuto(event.name + "_used", [current]);
        player.markAuto(event.name + "_mark", [current]);
        const next = current[side];
        let stopm = false, stopt = false;
        if (get.attitude(current, player) > 0) {
          if (get.attitude(next, target) <= 0 || !next.hasCards("h") || player.countCards("h") == 1) {
            stopm = true;
            stopt = true;
          }
        } else {
          if (get.attitude(next, target) >= 0) {
            stopt = true;
            stopm = false;
          }
        }
        result = await player.chooseCard({
          prompt: "浮海：请展示一张牌",
          forced: true,
          ai(card) {
            if (get.event().stopm) {
              return 14 - get.number(card);
            }
            return get.number(card);
          }
        }).set("stopm", stopm).forResult();
        if (result?.bool && result.cards?.length) {
          const cards2 = result.cards;
          await player.showCards(cards2);
          result = await current.chooseCard({
            prompt: "浮海：请展示一张牌",
            forced: true,
            ai(card) {
              if (get.event().stopt) {
                return 14 - get.number(card);
              }
              return get.number(card);
            }
          }).set("stopt", stopt).forResult();
          if (result?.bool && result.cards?.length) {
            const cardx = result.cards;
            await current.showCards(cardx);
            const num1 = get.number(cards2[0]);
            const num2 = get.number(cardx[0]);
            if (num1 < num2) {
              await current.modedDiscard({ cards: cardx });
              await game.asyncDraw([player, current], player.getStorage(event.name + "_mark").length);
              player.tempBanSkill(event.name, "phaseAnyAfter");
              break;
            } else {
              await player.modedDiscard({ cards: cards2 });
            }
          }
        }
      }
    },
    ai: {
      order: 1,
      result: {
        player(player, target) {
          const hs = player.countCards("h");
          const side = target == player.next ? "next" : "previous";
          let current = player;
          for (let i = 0; i < hs; i++) {
            current = current[side];
            if (current == player || !current.countCards("h")) {
              return 0;
            }
            if (get.attitude(current, player) > 0) {
              return 1;
            }
          }
          return 0;
        }
      }
    },
    subSkill: {
      used: { charlotte: true, onremove: true, intro: { content: "本阶段$已成为过浮海的目标" } },
      mark: { charlotte: true, onremove: true }
    }
  },
  xz_xunxun: {
    filter(event, player) {
      const num = game.countPlayer((current) => current.isDamaged());
      return num >= 1 && !player.hasSkill("xunxun");
    },
    audio: 2,
    trigger: {
      player: "phaseDrawBegin1"
    },
    //priority:10,
    async content(event, trigger, player) {
      const cards2 = get.cards(4);
      await game.cardsGotoOrdering(cards2);
      const result = await player.chooseToMove({
        prompt: "恂恂：将两张牌置于牌堆顶",
        forced: true,
        list: [["牌堆顶", cards2], ["牌堆底"]],
        processAI: (list) => {
          const cards3 = list[0][1].slice().sort((a, b) => get.value(b) - get.value(a));
          return [cards3, cards3.splice(2)];
        }
      }).set("filterMove", (from, to, moved) => {
        if (to === 1 && moved[1].length >= 2) {
          return false;
        }
        return true;
      }).set("filterOk", (moved) => moved[1].length === 2).forResult();
      const top = result.moved[0];
      const bottom = result.moved[1];
      top.reverse();
      for (const card of top) {
        ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
      }
      for (const card of bottom) {
        ui.cardPile.appendChild(card);
      }
      game.updateRoundNumber();
      await game.delayx();
    }
  },
  xinfu_xingzhao: {
    audio: 2,
    group: ["xz_xunxun", "xinfu_xingzhao2", "xinfu_xingzhao3"],
    trigger: {
      player: "loseAfter",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    forced: true,
    filter(event, player) {
      if (game.countPlayer((current) => current.isDamaged()) < 2) {
        return false;
      }
      const evt = event.getl(player);
      if (event.name === "equip" && event.player === player) {
        return true;
      }
      return evt && evt.es.length;
    },
    getIndex(event, player) {
      const evt = event.getl(player);
      if (event.name === "equip" && event.player === player && evt && evt.es.length) {
        return 2;
      }
      return 1;
    },
    async content(event, trigger, player) {
      await player.draw();
    },
    derivation: "xz_xunxun",
    mark: true,
    intro: {
      content(storage, player) {
        const num = game.countPlayer((current) => current.isDamaged());
        let str = "<li>造成的伤害+1";
        if (num >= 1) {
          str = "<li>视为拥有技能“恂恂”";
        }
        if (num >= 2) {
          str += "<br><li>装备牌进入或离开你的装备区时摸一张牌";
        }
        if (num >= 3) {
          str += "<br><li>始终跳过弃牌阶段";
        }
        if (num >= 4) {
          str += "<br><li>造成的伤害+1";
        }
        return str;
      }
    }
  },
  xinfu_xingzhao2: {
    audio: "xinfu_xingzhao",
    sourceSkill: "xinfu_xingzhao",
    trigger: {
      player: ["phaseJudgeBefore", "phaseDiscardBefore"]
    },
    forced: true,
    filter(event, player) {
      const num = game.countPlayer((current) => current.isDamaged());
      return num >= 3;
    },
    async content(event, trigger, player) {
      trigger.cancel();
      game.log(player, `跳过了${trigger.name === "phaseJudge" ? "判定" : "弃牌"}阶段`);
    }
  },
  xinfu_xingzhao3: {
    audio: "xinfu_xingzhao",
    sourceSkill: "xinfu_xingzhao",
    trigger: {
      source: "damageBegin1"
    },
    forced: true,
    filter(event, player) {
      const num = game.countPlayer((current) => current.isDamaged());
      return num === 0 || num >= 4;
    },
    async content(event, trigger, player) {
      trigger.num++;
    }
  },
  xinfu_dianhu: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    locked: true,
    filter(event, player) {
      return game.hasPlayer((current) => current != player) && (event.name != "phase" || game.phaseNumber == 0);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget("选择【点虎】的目标", lib.translate.xinfu_dianhu_info, true, function(card, player2, target) {
        return target != player2;
      }).set("ai", function(target) {
        var att = get.attitude(_status.event.player, target);
        if (att < 0) {
          return -att + 3;
        }
        return Math.random();
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      game.log(target, "成为了", "【点虎】", "的目标");
      if (get.mode() != "identity" || player.identity != "nei") {
        player.addExpose(0.25);
      }
      target.addSkill("xinfu_dianhu_effect");
      target.markAuto("xinfu_dianhu_effect", player);
    },
    subSkill: {
      effect: {
        intro: {
          content: "当你受到来自$的伤害或回复体力后，其摸一张牌"
        },
        trigger: {
          player: ["damageEnd", "recoverEnd"]
        },
        charlotte: true,
        forceDie: true,
        filter(event, player) {
          const targets = player.getStorage("xinfu_dianhu_effect");
          if (targets?.length) {
            if (event.name == "damage") {
              return event.source?.isIn() && targets.includes(event.source);
            }
            return targets.some((target) => target.isIn());
          }
        },
        async cost(event, trigger, player) {
          const targets = player.getStorage(event.skill);
          for (const target of targets.sortBySeat(_status.currentPhase)) {
            if (!target.isIn() || trigger.name == "damage" && target != trigger.source) {
              continue;
            }
            await target.useSkill(event.skill, [player]);
          }
        },
        async content(event, trigger, player) {
          await player.draw();
        }
      }
    }
  },
  xinfu_dianhu2: {
    mark: "character",
    intro: {
      content: "当你受到来自$的伤害或回复体力后，$摸一张牌"
    },
    nopop: true,
    trigger: {
      player: ["damageEnd", "recoverEnd"]
    },
    forced: true,
    popup: false,
    charlotte: true,
    sourceSkill: "xinfu_dianhu",
    filter(event, player) {
      const target = player.storage.xinfu_dianhu2;
      if (!target?.isIn()) {
        return false;
      }
      if (event.name !== "damage") {
        return true;
      }
      return event.source === target;
    },
    async content(event, trigger, player) {
      const target = player.storage.xinfu_dianhu2;
      target.logSkill("xinfu_dianhu");
      await target.draw();
    },
    onremove: true
  },
  xinfu_jianji: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target !== player;
    },
    async content(event, trigger, player) {
      const { target } = event;
      const { cards: cards2 } = await target.draw().forResult();
      const card = cards2?.[0];
      if (!card || !game.hasPlayer((current) => target.canUse(card, current)) || get.owner(card) !== target) {
        return;
      }
      await target.chooseToUse({
        prompt: `是否使用${get.translation(card)}？`,
        filterCard: (cardx) => cardx === _status.event.cardx,
        cardx: card
      });
    },
    ai: {
      order: 7.5,
      result: {
        target: 1
      }
    }
  },
  xinfu_lianpian: {
    audio: 2,
    usable: 3,
    trigger: {
      player: "useCardToPlayered"
    },
    frequent: true,
    filter(event, player) {
      if (!event.targets?.length || event.getParent()?.triggeredTargets3.length > 1 || !event.isPhaseUsing(player)) {
        return false;
      }
      const evt = player.getLastUsed(1);
      if (!evt?.targets?.length || !evt.isPhaseUsing(player)) {
        return false;
      }
      for (let i = 0; i < event.targets.length; i++) {
        if (evt.targets.includes(event.targets[i])) {
          return true;
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = await player.draw().forResult();
      if (!cards2?.length) {
        return;
      }
      const card = cards2[0];
      const ablers = player.getLastUsed(1)?.targets.slice(0) ?? [];
      for (let i = 0; i < ablers.length; i++) {
        if (ablers[i] == player || !trigger.targets.includes(ablers[i])) {
          ablers.splice(i--, 1);
        }
      }
      if (get.owner(card) == player && ablers.length) {
        const result = await player.chooseTarget({
          prompt: `联翩：是否将${get.translation(card)}交给其他角色`,
          filterTarget(card2, player2, target) {
            return get.event().ablers.includes(target) && target != player2;
          },
          ai: (target) => 0
        }).set("ablers", ablers).forResult();
        if (result?.bool && result.targets?.length) {
          const target = result.targets[0];
          player.line(target);
          await player.give(card, target, true);
        }
      }
    },
    locked: false,
    mod: {
      aiOrder(player, card, num) {
        if (player.isPhaseUsing() && (!player.storage.counttrigger || !player.storage.counttrigger.xinfu_lianpian || player.storage.counttrigger.xinfu_lianpian < 3)) {
          const evt = player.getLastUsed();
          if (evt?.targets?.length && evt.isPhaseUsing(player) && game.hasPlayer((current) => {
            return evt.targets.includes(current) && player.canUse(card, current) && get.effect(current, card, player, player) > 0;
          })) {
            return num + 10;
          }
        }
      }
    },
    ai: {
      effect: {
        player_use(card, player, target) {
          var evt = player.getLastUsed();
          if (evt && evt.targets.includes(target) && (!player.storage.counttrigger || !player.storage.counttrigger.xinfu_lianpian || player.storage.counttrigger.xinfu_lianpian < 3) && player.isPhaseUsing(player)) {
            return [1.5, 0];
          }
        }
      }
    }
  },
  //糜芳傅士仁
  fengshi: {
    audio: "mffengshi",
    audioname: ["sp_mifangfushiren"],
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      if (!event.isFirstTarget) {
        return false;
      }
      return event.targets.some((target) => {
        return player.countCards("h") > target.countCards("h") && (target.hasCards("he") || player.hasDiscardableCards(player, "he"));
      });
    },
    direct: true,
    async content(event, trigger, player) {
      const { bool, targets } = await player.chooseTarget(get.prompt("fengshi"), "弃置你与一名目标角色的各一张牌，然后令" + get.translation(event.card) + "对其造成的伤害+1", (card, player2, target) => {
        const targets2 = get.event().getTrigger().targets;
        if (!targets2.includes(target)) {
          return false;
        }
        return player2.countCards("h") > target.countCards("h") && target.hasCards("he");
      }).set("ai", (target) => {
        let trigger2 = get.event().getTrigger(), player2 = trigger2.player;
        if (get.attitude(player2, target) > 0) {
          return 0;
        }
        let eff = get.effect(player2, { name: "guohe" }, player2, get.event().player) + get.effect(target, { name: "guohe" }, player2, get.event().player);
        if (get.tag(trigger2.card, "damage")) {
          eff += get.effect(target, trigger2.card, trigger2.player, get.event().player);
        }
        return eff;
      }).forResult();
      if (bool) {
        const target = targets[0];
        player.logSkill("fengshi", target);
        if (player.hasDiscardableCards(player, "he")) {
          await player.chooseToDiscard("he", true);
        }
        if (target.hasCards("he")) {
          await player.discardPlayerCard(target, "he", true);
        }
        if (get.tag(trigger.card, "damage")) {
          var id = target.playerid;
          var map = trigger.getParent().customArgs;
          if (!map[id]) {
            map[id] = {};
          }
          if (typeof map[id].extraDamage != "number") {
            map[id].extraDamage = 0;
          }
          map[id].extraDamage++;
        }
      }
    },
    group: "fengshi_target",
    subSkill: {
      target: {
        trigger: { target: "useCardToTargeted" },
        filter(event, player) {
          if (event.player == event.target) {
            return false;
          }
          return event.player.countCards("h") > player.countCards("h") && (event.player.hasCards("he") || player.hasDiscardableCards(player, "he"));
        },
        audio: "mffengshi",
        audioname: ["sp_mifangfushiren"],
        logTarget(event, player) {
          return player == event.player ? event.target : event.player;
        },
        prompt2(event, player) {
          var target = lib.skill.dcmffengshi.logTarget(event, player);
          return "弃置你与" + get.translation(target) + "的各一张牌，然后令" + get.translation(event.card) + "的伤害+1";
        },
        check(event, player) {
          let viewer = get.event().player, user = event.player, target = event.target;
          if (get.attitude(player, target) > 0) {
            return 0;
          }
          let eff = get.effect(user, { name: "guohe" }, user, viewer) + get.effect(target, { name: "guohe" }, user, viewer);
          if (get.tag(event.card, "damage")) {
            eff += get.effect(target, event.card, player, viewer);
          }
          return eff > 0;
        },
        async content(event, trigger, player) {
          const target = trigger.player;
          if (player.hasDiscardableCards(player, "he")) {
            await player.chooseToDiscard("he", true);
          }
          if (target.hasCards("he")) {
            await player.discardPlayerCard(target, "he", true);
          }
          if (get.tag(trigger.card, "damage")) {
            var id = player.playerid;
            var map = trigger.getParent().customArgs;
            if (!map[id]) {
              map[id] = {};
            }
            if (typeof map[id].extraDamage != "number") {
              map[id].extraDamage = 0;
            }
            map[id].extraDamage++;
          }
        }
      }
    }
  },
  dcmffengshi: {
    audio: "mffengshi",
    audioname: ["sp_mifangfushiren"],
    trigger: {
      player: "useCardToPlayered",
      target: "useCardToTargeted"
    },
    filter(event, player, name) {
      if (event.player === event.target || event.targets.length !== 1) {
        return false;
      }
      return event.player.countCards("h") > event.target.countCards("h") && event.target.hasCards("he") && player.hasCard((card) => lib.filter.cardDiscardable(card, player, "dcmffengshi"), "he");
    },
    logTarget(event, player) {
      return player === event.player ? event.target : event.player;
    },
    prompt2(event, player) {
      const target = lib.skill.dcmffengshi.logTarget(event, player);
      return `弃置你与${get.translation(target)}的各一张牌，然后令${get.translation(event.card)}的伤害+1`;
    },
    check(event, player) {
      const viewer = get.event().player;
      const user = event.player;
      const target = event.target;
      if (get.attitude(player, target) > 0) {
        return 0;
      }
      let eff = get.effect(user, { name: "guohe" }, user, viewer) + get.effect(target, { name: "guohe" }, user, viewer);
      if (get.tag(event.card, "damage")) {
        eff += get.effect(target, event.card, player, viewer);
      }
      return eff > 0;
    },
    async content(event, trigger, player) {
      if (get.tag(trigger.card, "damage")) {
        trigger.getParent().baseDamage++;
      }
      const target = lib.skill.dcmffengshi.logTarget(trigger, player);
      await player.chooseToDiscard({ position: "he", forced: true });
      await player.discardPlayerCard({ target, position: "he", forced: true });
    }
  },
  mffengshi: {
    audio: 2,
    audioname: ["sp_mifangfushiren"],
    trigger: {
      player: "useCardToPlayered",
      target: "useCardToTargeted"
    },
    direct: true,
    preHidden: true,
    filter(event, player) {
      if (event.player === event.target || event.targets.length !== 1) {
        return false;
      }
      if (player !== event.player && !player.hasSkill("mffengshi")) {
        return false;
      }
      return event.player.countCards("h") > event.target.countCards("h") && event.target.countCards("he") > 0;
    },
    async content(event, trigger, player) {
      const source = trigger.player;
      const target = player === trigger.target ? trigger.player : trigger.target;
      const action = player === trigger.player ? "弃置自己的和该角色" : "令其弃置其与你的";
      let bool = 0;
      if (get.attitude(trigger.player, player) <= 0) {
        let effect = get.effect(trigger.player, { name: "guohe" }, player, trigger.player) + get.effect(trigger.target, { name: "guohe" }, player, trigger.player);
        if (get.tag(trigger.card, "damage")) {
          effect += get.effect(trigger.target, trigger.card, trigger.player, trigger.player);
        }
        bool = effect > 0;
      }
      const next = trigger.player.chooseBool({
        prompt: `是否对${get.translation(trigger.target)}发动【锋势】？`,
        prompt2: `${action}的各一张牌，然后令${get.translation(trigger.card)}的伤害+1`,
        ai: () => get.event().bool
      }).set("bool", bool);
      if (player === next.player) {
        next.setHiddenSkill("mffengshi");
      }
      const result = await next.forResult();
      if (!result.bool) {
        return;
      }
      if (player === source) {
        player.logSkill("mffengshi", target);
      } else {
        player.logSkill("mffengshi");
        source.line(player, "green");
      }
      if (get.tag(trigger.card, "damage")) {
        trigger.getParent().baseDamage++;
      }
      await player.chooseToDiscard({
        position: "he",
        forced: true
      });
      if (target.countDiscardableCards(player, "he") > 0) {
        await player.discardPlayerCard({
          target,
          position: "he",
          forced: true
        });
      }
    }
  }
};
const translates = {
  star_zhugejin: "星诸葛瑾",
  star_zhugejin_prefix: "星",
  starzunjian: "尊谏",
  starzunjian_info: "出牌阶段每种花色限一次，你可以弃置一种花色的所有手牌并令一名角色摸X张牌（X为你手牌中缺少的花色数），然后若其手牌数为全场唯一最多，其可以交给你至多两张手牌；若其体力值全场唯一最少，你可令其回复一点体力。",
  starhongya: "弘雅",
  starhongya_info: "每回合限两次，当你成为其他角色使用牌的目标时，你可以重铸一张比其使用的牌点数更大的手牌令其使用的牌对你无效；若你重铸的牌点数为你手牌中点数最大的牌，则你额外摸X张牌（X为你手牌中缺少的花色数）。",
  lijue: "李傕",
  zhangji: "张济",
  fanchou: "樊稠",
  guosi: "郭汜",
  lvkai: "吕凯",
  zhanggong: "张恭",
  weiwenzhugezhi: "卫温诸葛直",
  sp_liuqi: "刘琦",
  xf_tangzi: "唐咨",
  gz_xf_huangquan: "黄权",
  xf_huangquan: "OL黄权",
  xf_huangquan_prefix: "OL",
  gz_xf_sufei: "苏飞",
  xf_sufei: "OL苏飞",
  xf_sufei_prefix: "OL",
  xinfu_langxi: "狼袭",
  xinfu_langxi_info: "准备阶段，你可以对一名体力小于或等于你的其他角色造成0～2点随机伤害。",
  xinfu_yisuan: "亦算",
  xinfu_yisuan_info: "出牌阶段限一次。当你于出牌阶段内使用的锦囊牌结算结束后，你可以减1点体力上限并获得此牌对应的所有实体牌。",
  xinfu_xingluan: "兴乱",
  xinfu_xingluan_info: "每回合限一次。当你于出牌阶段内使用的仅指定一个目标的牌结算完成后，你可以从牌堆中随机获得一张点数为6的牌。",
  xinfu_lveming: "掠命",
  xinfu_lveming_info: "出牌阶段限一次，你可以选择一名装备区装备比你少的角色，令其选择一个点数，然后你进行判定：<br>若点数相同，你对其造成2点伤害；<br>若点数不同，则你随机获得其区域内的一张牌。",
  xinfu_tunjun: "屯军",
  xinfu_tunjun_info: "限定技，出牌阶段，你可以选择一名角色，令其随机使用牌堆中的X张装备牌（X为你发动过“掠命”的次数）。",
  xinfu_tanbei: "贪狈",
  xinfu_tanbei_info: "出牌阶段限一次，你可以令一名其他角色选择一项：1.令你随机获得其区域内的一张牌，本回合内你不能对其使用牌。2.令你此回合内对其使用牌没有次数与距离限制。",
  xinfu_sidao: "伺盗",
  xinfu_sidaox: "伺盗",
  xinfu_sidao_info: "出牌阶段限一次，当你对一名其他角色连续使用两张牌后，你可以将一张手牌当做【顺手牵羊】对其使用。",
  tanbei_effect1: "贪狈",
  tanbei_effect1_info: "",
  tanbei_effect2: "贪狈",
  tanbei_effect2_info: "",
  xinfu_tunan: "图南",
  xinfu_tunan_info: "出牌阶段限一次，你可以令一名其他角色观看牌堆顶的一张牌，然后该角色选择一项：1.使用此牌（无距离限制）；2.将此牌当普通【杀】使用。",
  xinfu_bijing: "闭境",
  xinfu_bijing_info: "结束阶段，你可以选择至多两张手牌并标记为“闭境”，然后你获得如下效果：1.其他角色的弃牌阶段开始时，若你于本回合内失去过“闭境”，其弃置两张牌；2.准备阶段，你重铸所有“闭境”牌。",
  xinfu_zhenxing: "镇行",
  xinfu_zhenxing_info: "结束阶段开始时或当你受到伤害后，你可以观看牌堆顶的至多三张牌，然后你获得其中与其余牌花色均不相同的一张牌。",
  xinfu_qianxin: "遣信",
  xinfu_qianxin_info: "出牌阶段限一次，若牌堆中没有“信”，你可以选择一名角色并将任意张手牌放置于牌堆中X倍数的位置（X为存活人数），称为“信”。该角色的弃牌阶段开始时，若其手牌区内有于本回合内获得过的“信”，其选择一项：令你将手牌摸至四张；本回合手牌上限-2。",
  qianxin_effect: "遣信",
  qianxin_effect_info: "",
  xinfu_qianxin2: "遣信",
  xinfu_qianxin2_info: "",
  xinfu_fuhai: "浮海",
  xinfu_fuhai_info: "出牌阶段对每名角色限一次，你可以展示一张手牌并选择上家或下家，该角色展示一张手牌。若你展示的牌点数大于等于其展示的牌点数，你弃置你展示的牌，然后继续对其上家或下家重复此流程；若你展示的牌点数小于该展示角色牌的点数，则该角色弃置其展示的牌，然后你与其各摸X张牌（X为你此回合内发动此技能选择的角色数），且你此阶段内〖浮海〗失效。",
  fuhai_clear: "浮海",
  fuhai_clear_info: "",
  xz_xunxun: "恂恂",
  xz_xunxun_info: "摸牌阶段，你可以观看牌堆顶的四张牌，然后将其中的两张牌置于牌堆顶，并将其余的牌以任意顺序置于牌堆底。",
  xinfu_xingzhao: "兴棹",
  xinfu_xingzhao_info: "锁定技。若场上已受伤的角色数：≥1，你视为拥有技能〖恂恂〗；X≥2，有装备牌进入或离开你的装备区时，你摸一张牌；X≥3，判定阶段或弃牌阶段开始时，你跳过此阶段；为0或≥4，当你造成伤害时，此伤害+1。",
  xinfu_xingzhao2: "兴棹",
  xinfu_xingzhao2_info: "",
  xinfu_xingzhao3: "兴棹",
  xinfu_dianhu: "点虎",
  xinfu_dianhu_info: "锁定技，游戏开始时，你选择一名其他角色。当其受到来自你的伤害后或回复体力后，你摸一张牌。",
  xinfu_dianhu2: "点虎",
  xinfu_dianhu2_info: "",
  xinfu_jianji: "谏计",
  xinfu_jianji_info: "出牌阶段限一次，你可以令一名其他角色摸一张牌。然后该角色可以使用此牌。",
  xinfu_lianpian: "联翩",
  xinfu_lianpian_info: "每回合限三次。当你于出牌阶段对一名角色连续使用牌时，你可以摸一张牌，然后可以将此牌交给该角色。",
  spwenji: "问计",
  spwenji_info: "出牌阶段开始时，你可以令一名其他角色交给你一张牌。你于本回合内使用与该牌名称相同的牌时不能被其他角色响应。",
  rewenji: "问计",
  rewenji_info: "出牌阶段开始时，你可以令一名其他角色交给你一张牌。你于本回合内使用与该牌类型相同的牌时不能被其他角色响应。",
  sptunjiang: "屯江",
  sptunjiang_info: "结束阶段，若你未于本回合的出牌阶段内使用牌指定过其他角色为目标，则你可以摸X张牌（X为全场势力数）。",
  zongkui: "纵傀",
  zongkui_mark: "纵傀",
  zongkui_mark_bg: "傀",
  zongkui_info: "回合开始前，你可以指定一名未拥有“傀”标记的其他角色，令其获得一枚“傀”标记。每轮开始时，你指定一名体力值最少且没有“傀”标记的其他角色，令其获得一枚“傀”标记。",
  guju: "骨疽",
  guju_info: "锁定技，拥有“傀”标记的角色受到伤害后，你摸一张牌。",
  baijia: "拜假",
  baijia_info: "觉醒技，准备阶段，若你因〖骨疽〗得到的牌不少于七张，则你增加1点体力上限，回复1点体力，然后令所有未拥有“傀”标记的其他角色获得“傀”标记，最后失去技能〖骨疽〗，并获得技能〖蚕食〗。",
  bmcanshi: "蚕食",
  bmcanshi_info: "一名角色使用基本牌或普通锦囊牌指定你为唯一目标时，若其有“傀”标记，你可以取消之，然后其失去“傀”标记；你使用牌仅指定一名角色为目标时，你可以额外指定任意名带有“傀”标记的角色为目标（无距离限制），然后这些角色失去“傀”标记。",
  xinpi: "辛毗",
  lisu: "李肃",
  zhangwen: "张温",
  xushao: "许劭",
  mangyachang: "忙牙长",
  xugong: "许贡",
  zhangchangpu: "张昌蒲",
  pingjian: "评荐",
  pingjian_use: "评荐",
  pingjian_info: "结束阶段开始时/当你受到伤害后/出牌阶段限一次，你可以令系统随机检索出三张拥有发动时机为结束阶段开始时/当你受到伤害后/出牌阶段的技能的武将牌。然后你可以选择尝试发动其中一个技能。每个技能每局游戏只能选择一次。",
  songshu: "颂蜀",
  songshu_info: "出牌阶段，你可以和其他角色拼点。若你没赢，你与其各摸两张牌，且你本阶段内不能再发动〖颂蜀〗。",
  sibian: "思辩",
  sibian_info: "摸牌阶段，你可以放弃摸牌，改为亮出牌堆顶的四张牌，然后获得其中所有点数最大与点数最小的牌，且可以将剩余的牌交给手牌数最少的角色。",
  lslixun: "利熏",
  lslixun_fate: "利熏",
  lslixun_info: "锁定技，当你受到伤害时，你防止此伤害，然后获得等同于伤害值的“珠”标记。出牌阶段开始时，你进行判定，若结果点数小于“珠”的数量，你弃置等同于“珠”数量的手牌（若弃牌的牌数不够，则失去剩余数量的体力值）。",
  lskuizhu: "馈珠",
  lskuizhu_info: "出牌阶段结束时，你可以选择体力值为全场最多的一名其他角色，将手牌摸至与该角色相同（最多摸至五张），然后该角色观看你的手牌，弃置任意张手牌并从观看的牌中获得等量的牌。若其得到的牌大于一张，则你选择一项：移去一个“珠”；或令其对其攻击范围内的一名角色造成1点伤害。",
  xpchijie: "持节",
  xpchijie_info: "每回合每项各限一次。1.当其他角色使用的牌对你结算结束后，你可以令此牌对所有后续目标无效。2.其他角色使用的牌结算完成时，若你是此牌的目标之一且此牌未造成过伤害，则你可以获得此牌对应的所有实体牌。",
  xpchijie2: "持节",
  yinju: "引裾",
  yinju_info: "限定技，出牌阶段，你可以选择一名其他角色。若如此做，直到回合结束：1.当你使用牌指定其为目标后，你与其各摸一张牌；2.当你即将对其造成伤害时，防止此伤害，然后其回复等量的体力。",
  yinju2: "引裾",
  spjiedao: "截刀",
  spjiedao_info: "当你每回合第一次造成伤害时，你可令此伤害至多+X（X为你损失的体力值）。然后若受到此伤害的角色没有死亡，你弃置等同于此伤害加值的牌。",
  biaozhao: "表召",
  biaozhao_info: "结束阶段，你可以将一张牌置于武将牌上，称为“表”。当有一张与“表”花色点数均相同的牌进入弃牌堆后，你将“表”置入弃牌堆并失去1点体力，若此牌是其他角色因弃置而进入弃牌堆的，则改为该角色获得“表”。准备阶段，若你的武将牌上有“表”，则你将“表”置入弃牌堆。然后你选择一名角色，该角色回复1点体力且将手牌摸至与全场手牌数最多的人相同（最多摸五张）。",
  biaozhao2: "表召",
  biaozhao2_info: "",
  biaozhao3: "表召",
  biaozhao3_info: "",
  yechou: "业仇",
  yechou_info: "当你死亡时，你可以选择一名已损失体力值大于1的角色。直到其下个回合开始前，每个回合结束时，该角色失去1点体力。",
  yechou2: "业仇",
  yechou2_info: "",
  yanjiao: "严教",
  yanjiao_info: "出牌阶段限一次，你可以选择一名其他角色并从牌堆顶亮出四张牌。该角色将这些牌分成点数之和相等的两组，你与其各获得其中一组，然后将剩余未分组的牌置入弃牌堆。若未分组的牌超过一张，则你本回合手牌上限-1。",
  yanjiao2: "严教",
  yanjiao2_info: "",
  xingshen: "省身",
  xingshen_info: "当你受到伤害后，你可以摸一张牌且下一次发动〖严教〗亮出的牌数+1。若你的手牌数为全场最少，则改为摸两张牌；若你的体力值为全场最少，则〖严教〗亮出的牌数改为+2（加值总数不能超过4）。",
  sp_zhanghe: "SP张郃",
  sp_zhanghe_prefix: "SP",
  yuanlve: "远略",
  yuanlve_info: "出牌阶段限一次，你可以将一张非装备牌交给一名角色，然后该角色可以使用该牌并令你摸一张牌。",
  xunchen: "OL荀谌",
  xunchen_prefix: "OL",
  fenglve: "锋略",
  fenglve2: "锋略",
  fenglve_info: "出牌阶段开始时，你可以与一名角色拼点，若你赢，该角色将其区域内的各一张牌交给你；若你没赢，你交给其一张牌。当你的单人拼点结算后，你可以令对方获得你拼点的牌。",
  mouzhi: "谋识",
  mouzhi2: "谋识",
  mouzhi_info: "出牌阶段限一次，你可以将一张手牌交给一名角色，若如此做，当其于其下回合的出牌阶段内对一名角色造成伤害后，若是此阶段其第一次对该角色造成伤害，你摸一张牌。",
  sp_shenpei: "SP审配",
  sp_shenpei_prefix: "SP",
  gangzhi: "刚直",
  gangzhi_info: "锁定技，当你即将受到其他角色造成的伤害时，或即将对其他角色造成伤害时，你防止此伤害，改为受到伤害的角色失去等量的体力。",
  beizhan: "备战",
  beizhan2: "备战",
  beizhan_info: "回合结束后，你可以令一名角色将手牌摸至体力上限（至多为5）。其下个回合开始时，若其手牌数为全场最多，则其此回合内使用的牌不能指定其他角色为目标。",
  gaolan: "OL高览",
  gaolan_prefix: "OL",
  xiying: "袭营",
  xiying2: "袭营",
  xiying_info: "出牌阶段开始时，你可以弃置一张非基本手牌，然后令所有其他角色依次选择一项：弃置一张牌，或本回合内不能使用或打出牌；且你本回合内获得如下效果：结束阶段，若你于本回合的出牌阶段内造成过伤害，则你从牌堆中获得一张伤害性基本牌或普通锦囊牌。",
  lvkuanglvxiang: "OL吕旷吕翔",
  lvkuanglvxiang_prefix: "OL",
  liehou: "列侯",
  liehou_info: "出牌阶段限一次，你可以令一名攻击范围内的角色交给你一张手牌，然后你将一张手牌交给攻击范围内的另一名角色。",
  qigong: "齐攻",
  qigong_info: "当你使用的仅指定唯一目标的【杀】被【闪】抵消之后，你可以令一名角色再对目标角色使用一张【杀】（不可被响应）。",
  chunyuqiong: "淳于琼",
  sushou: "宿守",
  sushou_info: "弃牌阶段开始时，你可以摸X+1张牌（X为“粮”数），然后可以交给任意名友方角色各一张牌。",
  cangchu: "仓储",
  cangchu_info: "锁定技，游戏开始时，你获得3枚“粮”标记，当你受到1点火焰伤害后，你失去一枚“粮”标记。",
  liangying: "粮营",
  liangying_info: "锁定技，若你有“粮”标记，则友方角色摸牌阶段摸牌数+1；当你失去所有“粮”标记后，你减1点体力上限，然后令敌方角色各摸两张牌。",
  sp_xuyou: "SP许攸",
  sp_xuyou_prefix: "SP",
  spshicai: "恃才",
  spshicai2: "恃才",
  spshicai_info: "出牌阶段，牌堆顶的一张牌对你可见。你可以弃置一张牌，然后获得牌堆顶的一张牌，且不能再发动〖恃才〗直到此牌离开你的手牌区。",
  spfushi: "附势",
  spfushi_info: "锁定技，若己方存活角色数：大于敌方，你视为拥有〖择主〗；小于敌方，你视为拥有〖逞功〗。",
  zezhu: "择主",
  zezhu_info: "出牌阶段限一次，你可以获得双方主帅的各一张牌（若无牌则改为你摸一张牌），然后交给双方主帅各一张牌。",
  chenggong: "逞功",
  chenggong_info: "当有角色使用牌指定目标后，若此牌对目标数大于1，则你可令使用者摸一张牌。",
  sp_zhangliao: "SP张辽",
  sp_zhangliao_prefix: "SP",
  //这仨技能给SP仲村由理毫无违和感好吗！！！
  mubing: "募兵",
  mubing_info: "出牌阶段开始时，你可以亮出牌堆顶的三张牌。你可弃置任意张手牌，并可获得任意张点数之和不大于你弃置的牌点数之和的牌。",
  ziqu: "资取",
  ziqu_info: "每名角色限一次，当你对其他角色造成伤害后，你可以防止此伤害。然后其将其点数最大的牌交给你。",
  diaoling: "调令",
  diaoling_info: "觉醒技，准备阶段，若你已因〖募兵〗获得了六张或更多的【杀】或武器牌或伤害锦囊牌，则你回复1点体力或摸两张牌，然后修改〖募兵〗。",
  mubing_rewrite: "募兵·改",
  mubing_rewrite_info: "出牌阶段开始时，你可以亮出牌堆顶的四张牌。你可弃置任意张手牌，并可获得任意张点数之和不大于你弃置的牌点数之和的牌。然后你可将以此法得到的牌以任意方式交给其他角色。",
  caobuxing: "曹不兴",
  moying: "墨影",
  moying_info: "每回合限一次，当你于回合外不因使用而失去单一一张锦囊牌或装备牌后，你可以选择一个花色和与此牌点数差绝对值不超过2的点数，然后获得牌堆中所有与此牌花色点数相同的牌。",
  juanhui: "绢绘",
  juanhui2: "绢绘",
  juanhui2_backup: "绢绘",
  juanhui_info: '结束阶段，你可以选择一名其他角色。记录该角色下回合的出牌阶段里使用的基本牌和普通锦囊牌（每种牌名限记一次），你的下回合出牌阶段，可将一张手牌当这些牌里的任意一张牌使用（每张限使用一次，且【杀】不计次数）。当"绢绘"的牌全部用完时，你回复1点体力并将手牌摸至三张。',
  re_maliang: "新杀马良",
  re_maliang_prefix: "新杀",
  rexiemu: "协穆",
  rexiemu_info: "结束阶段，若全场没有“协穆”标记，你可以选择一名角色获得“协穆”标记直到你的下回合开始。你或该角色在各自的回合外使用或打出手牌时，你与其各摸一张牌（每回合限一次）。",
  heli: "贺励",
  heli_info: "出牌阶段限一次，你可以选择手牌数比你少的一名其他角色。该角色展示所有手牌，然后每缺少一种类型的牌，便从牌堆中随机获得一张此类型的牌。",
  zhujun: "朱儁",
  gongjian: "攻坚",
  gongjian_info: "每回合限一次，当有角色使用【杀】指定第一个目标后，若此【杀】的目标和本局游戏内被使用的上一张【杀】的目标的交集A不为空，则你可以依次弃置A中所有角色的至多两张牌，然后获得以此法弃置的所有【杀】。",
  kuimang: "溃蟒",
  kuimang_info: "锁定技，一名角色死亡后，若你对其造成过伤害，你摸两张牌。",
  liuhong: "刘宏",
  yujue: "鬻爵",
  yujue_info: `出牌阶段限一次，你可以废除一个装备栏，然后令一名有手牌的其他角色交给你一张手牌。其获得${get.poptip("zhihu")}直到你的下回合开始。`,
  zhihu: "执笏",
  zhihu_info: "锁定技，每回合限两次，当你对其他角色造成伤害后，你摸两张牌。",
  tuxing: "图兴",
  tuxing_info: "锁定技，当你废除一个装备栏时，你加1点体力上限并回复1点体力。然后若你所有的装备栏均已被废除，则你减4点体力上限，且本局游戏内造成的伤害+1。",
  re_hejin: "新杀何进",
  re_hejin_prefix: "新杀",
  xin_baosanniang: "新杀鲍三娘",
  xin_baosanniang_prefix: "新杀",
  decadexushen: "许身",
  decadexushen2: "许身",
  decadexushen_info: `限定技，当你进入濒死状态后，你可以回复1点体力并获得技能${get.poptip("decadezhennan")}，然后如果你脱离濒死状态且${get.poptip({
    id: "character_dc_guansuo",
    name: "关索",
    type: "character",
    dialog: "characterDialog"
  })}不在场，你可令一名其他角色选择是否用${get.poptip("character_dc_guansuo")}代替其武将并令其摸三张牌。`,
  decadezhennan: "镇南",
  decadezhennan_info: "当有角色使用普通锦囊牌指定目标后，若此牌目标数大于1，你可以对一名其他角色造成1点伤害。",
  ol_dingyuan: "丁原",
  cixiao: "慈孝",
  cixiao_info: "准备阶段，若场上没有“义子”标记，你可令一名其他角色获得一个“义子”标记；若场上有“义子”标记，你可以弃置一张牌移动“义子”标记。拥有“义子”标记的角色获得技能“叛弑”。",
  panshi: "叛弑",
  panshi_info: "锁定技，准备阶段，你交给有“慈孝”技能的角色一张手牌；当你于出牌阶段因使用【杀】对其他角色造成伤害时，若其拥有技能“慈孝”，则此伤害+1，且你结束出牌阶段。",
  xianshuai: "先率",
  xianshuai_info: "锁定技，有角色造成伤害后，若此伤害是本轮第一次造成伤害：你摸一张牌；若伤害来源是你，则你对受伤角色再造成1点伤害。",
  wangrong: "王荣",
  minsi: "敏思",
  minsi2: "敏思",
  minsi_info: "出牌阶段限一次，你可以弃置任意张点数之和为13的牌，然后摸两倍数量的牌。以此法得到的牌中，黑色牌本回合无距离限制，红色牌本回合不计入手牌上限。",
  jijing: "吉境",
  jijing_info: "当你受到伤害后，你可以进行一次判定，然后若你弃置任意张点数之和与判定结果点数相同的牌，你回复1点体力。",
  zhuide: "追德",
  zhuide_info: "当你死亡时，你可令一名其他角色从牌堆中获得四张名称各不相同的基本牌。",
  decadewuniang: "武娘",
  decadewuniang_info: "当你使用或打出【杀】时，你可以获得一名其他角色的一张牌。若如此做，其摸一张牌。（若你已发动许身，则关索也摸一张牌）",
  dongxie: "董翓",
  juntun: "军屯",
  juntun_info: "锁定技，准备阶段，若X大于1，则你减1点体力上限并摸X张牌（X为你的体力上限）。",
  jiaojie: "狡黠",
  jiaojie_info: "锁定技，你的红色牌不计入手牌上限。你使用黑色牌无距离和次数限制。",
  dcjiaoxia: "狡黠",
  dcjiaoxia_info: "①出牌阶段开始时，你可以令自己的所有手牌于此阶段均视为【杀】。若如此做，你使用以此法转化的【杀】造成伤害后，你可以使用此牌对应的原卡牌。②出牌阶段，你对你本阶段未使用过【杀】的角色使用【杀】无距离和次数限制。",
  dchumei: "狐魅",
  dchumei_info: "出牌阶段各限一次，你可以选择一名体力值不大于X的角色，令其：①摸一张牌。②交给你一张牌。③回复1点体力。（X为你本阶段造成的伤害数）",
  buchen: "不臣",
  buchen_info: "隐匿技，你于其他角色的回合登场时，可获得当前回合角色的一张牌。",
  smyyingshi: "鹰视",
  smyyingshi_info: "锁定技，出牌阶段，你可观看牌堆顶的X张牌（X为你的体力上限）。",
  xiongzhi: "雄志",
  xiongzhi_info: "限定技，出牌阶段，你可观看牌堆顶的一张牌并使用之（使用【杀】有次数限制），且你重复此流程直到你无法使用观看的牌。",
  quanbian: "权变",
  quanbian2: "权变",
  quanbian_info: "当你于出牌阶段内使用/打出手牌时，若此牌有花色且你本回合内未使用/打出过该花色的其他手牌，则你可以选择一项：①摸一张牌。②将牌堆顶X张牌中的一张置于牌堆底（X为你的体力上限）。若你发动此技能，则你本回合内不能再使用与此牌花色相同的手牌。",
  re_hansui: "新杀韩遂",
  re_hansui_prefix: "新杀",
  re_quyi: "新杀麴义",
  re_quyi_prefix: "新杀",
  refuqi: "伏骑",
  refuqi_info: "锁定技，当你使用牌时，你令所有距离为1的其他角色不能使用或打出牌响应此牌。",
  hanfu: "韩馥",
  hfjieying: "节应",
  hfjieying2: "节应",
  hfjieying3: "节应",
  hfjieying_info: "结束阶段，你可以选择一名其他角色，该角色下回合使用目标数为1的【杀】或普通锦囊牌无距离限制且可多指定一个目标，且当其造成伤害后，其无法再使用牌直到回合结束。",
  weipo: "危迫",
  weipo_info: "锁定技，其他角色使用【杀】或普通锦囊牌指定你为目标后，若你的手牌数小于X，则你将手牌摸至X张，并记录摸牌事件结算后的手牌数Y。此牌结算结束后，若你的手牌数小于Y，则你将一张手牌交给此牌的使用者，且此技能失效直到你的下回合开始。（X为你的体力上限且至多为5）",
  zhaozhong: "赵忠",
  yangzhong: "殃众",
  yangzhong_info: "当你造成或受到伤害后，若受伤角色和伤害来源均存活，则伤害来源可弃置两张牌，然后令受伤角色失去1点体力。",
  huangkong: "惶恐",
  huangkong_info: "锁定技，当你于回合外成为【杀】或普通锦囊牌的目标后，若你没有手牌，则你摸两张牌。",
  re_taoqian: "陶谦",
  reyixiang: "义襄",
  reyixiang_info: "锁定技，其他角色于其出牌阶段内使用的第一张牌对你的伤害-1；其使用的第二张牌若为黑色，则对你无效。",
  caosong: "曹嵩",
  cslilu: "礼赂",
  cslilu_info: "摸牌阶段，你可以放弃摸牌，改为将手牌摸至X张（X为你的体力上限和5中的最小值），然后将至少一张手牌交给一名其他角色。若你以此法给出的牌数大于你上次以此法给出的牌数，则你加1点体力上限并回复1点体力。",
  csyizheng: "翊正",
  csyizheng2: "翊正",
  csyizheng_info: "结束阶段开始时，你可以选择一名其他角色。你的下回合开始前，当该角色造成伤害或回复体力时，若其体力上限小于你，则你减1点体力上限，且令此伤害值/回复值+1。",
  reyirang: "揖让",
  reyirang_info: "出牌阶段开始时，你可以将所有非基本牌交给一名其他角色。若其体力上限大于你，则你将体力上限调整至与其相同并回复X点体力（X为你以此法交给其的牌数）。",
  liangxing: "梁兴",
  lulve: "掳掠",
  lulve_info: "出牌阶段开始时，你可选择一名有手牌且手牌数少于你的角色。其选择一项：①将所有手牌交给你，然后你将武将牌翻面。②将武将牌翻面，然后其视为对你使用一张【杀】。",
  lxzhuixi: "追袭",
  lxzhuixi_info: "锁定技，当你造成伤害或受到伤害时，若受伤角色的翻面状态和伤害来源的翻面状态不同，则此伤害+1。",
  zhangmiao: "张邈",
  mouni: "谋逆",
  mouni_info: "准备阶段，你可对一名其他角色依次使用你手牌中所有的【杀】（若其进入了濒死状态，则终止此流程）。然后若这些【杀】中有未造成伤害的【杀】，则你跳过本回合的出牌阶段和弃牌阶段。",
  zongfan: "纵反",
  zongfan_info: "觉醒技。结束阶段，若你本回合内因〖谋逆〗使用过【杀】且未跳过本回合的出牌阶段，则你将任意张牌交给一名其他角色，然后加X点体力上限并回复X点体力（X为你以此法给出的牌数且至多为5）。最后失去〖谋逆〗并获得〖战孤〗。",
  zhangu: "战孤",
  zhangu_info: "锁定技，准备阶段，若你的体力上限大于1且没有手牌/装备区内没有牌，则你减1点体力上限，然后从牌堆中获得三张类型不同的牌。",
  re_niujin: "新杀牛金",
  re_niujin_prefix: "新杀",
  recuorui: "摧锐",
  recuorui_info: "限定技，出牌阶段，你可以依次获得至多X名角色的各一张手牌（X为你的体力值）。",
  reliewei: "裂围",
  reliewei_info: "每回合限Y次，当有角色进入濒死状态时，你可以摸一张牌（Y为你的体力值，若当前回合角色为你，则Y为Infinity）。",
  duanwei: "段煨",
  langmie: "狼灭",
  langmie_damage: "狼灭",
  langmie_info: "其他角色的出牌阶段结束时，若其本阶段内使用过的牌中有类型相同的牌，则你可以摸一张牌；其他角色的结束阶段开始时，若其本回合内造成的伤害大于1，则你可以弃置一张牌并对其造成1点伤害。",
  zhangheng: "张横",
  dangzai: "挡灾",
  dangzai_info: "出牌阶段开始时，你可将一名其他角色判定区内的任意张牌移动至你的判定区内。",
  liangjue: "粮绝",
  liangjue_info: "锁定技，一张黑色牌进入或者离开你的判定区或装备区后，你摸两张牌，然后若你的体力值大于1，你失去1点体力。",
  tangji: "唐姬",
  kangge: "抗歌",
  kangge_info: "你的第一个回合开始时，选择一名其他角色，该角色每次于其回合外得到牌后，你摸等量的牌（每回合至多摸三张）；其进入濒死状态时，你可令其回复体力至1点（每轮限一次）。该角色死亡时，你弃置所有牌并失去1点体力。",
  jielie: "节烈",
  jielie_info: "当你受到除自己和“抗歌”角色以外的角色造成的伤害时，你可以防止此伤害并选择一种花色，然后你失去X点体力，令“抗歌”角色从弃牌堆中随机获得X张此花色的牌（X为伤害值）。",
  re_dongcheng: "董承",
  xuezhao: "血诏",
  xuezhao_info: "出牌阶段限一次，你可弃置一张手牌并选择至多X名其他角色(X为你的体力上限）。这些角色依次选择是否交给你一张牌，若选择是，该角色摸一张牌且你本回合可多使用一张【杀】；若选择否，该角色本回合无法响应你使用的牌。若没有角色交给你牌，你将手牌摸至体力上限。",
  re_hucheer: "胡车儿",
  redaoji: "盗戟",
  redaoji2: "盗戟",
  redaoji_info: "其他角色第一次使用武器牌时，你可选择一项：①获得此牌。②令其本回合内不能使用或打出【杀】。",
  fuzhong: "负重",
  fuzhong_info: "锁定技，当你于回合外得到牌后，你获得一枚“重”标记。若X：大于0，你于摸牌阶段开始时令额定摸牌数+1；大于1，你至其他角色的距离-2；大于2，你的手牌上限+3；大于3，结束阶段开始时，你对一名其他角色造成1点伤害，然后移去4枚“重”（X为“重”数）。",
  qiuliju: "丘力居",
  koulve: "寇略",
  koulve_info: "当你于出牌阶段内对其他角色造成伤害后，你可以展示其X张手牌（X为其已损失的体力值）。若这些牌中：有带有伤害标签的基本牌或锦囊牌，则你获得之；有红色牌，则你失去1点体力（若已受伤则改为减1点体力上限），然后摸两张牌。",
  qljsuiren: "随认",
  qljsuiren_info: "当你死亡时，你可以将手牌中所有的带有伤害标签的基本牌或锦囊牌交给一名其他角色。",
  re_zoushi: "邹氏",
  rehuoshui: "祸水",
  rehuoshui_info: "准备阶段，你可以选择至多X名其他角色（X为你已损失的体力值且至少为1）。你令这些角色中第一名角色的非锁定技失效直到回合结束；第二名角色交给你一张手牌；第三名及之后角色弃置装备区内的所有牌。",
  reqingcheng: "倾城",
  reqingcheng_info: "出牌阶段限一次，你可以与一名手牌数不大于你的男性角色交换手牌。",
  caoanmin: "曹安民",
  xianwei: "险卫",
  xianwei_info: "锁定技，准备阶段，你废除一个装备栏并摸X张牌（X为你未废除的装备栏数），然后你令一名其他角色对其自己使用一张牌堆中的一张与此装备栏副类别相同的装备牌（没有可使用的牌则改为摸一张牌）。当你废除所有装备栏后，你加2点体力上限，然后你与所有其他角色视为在彼此的攻击范围内。",
  dufuren: "杜夫人",
  yise: "异色",
  yise_info: "其他角色得到你的牌后，若这些牌中：有红色牌，你可令其回复1点体力；有黑色牌，其下次受到因执行【杀】的效果造成的伤害时，此伤害+1。",
  shunshi: "顺世",
  shunshi_info: "准备阶段开始时，或当你于回合外受到伤害后，你可将一张牌交给一名不为伤害来源的其他角色并获得如下效果直到你的回合结束：摸牌阶段的额定摸牌数+1，使用【杀】的次数上限+1，手牌上限+1。",
  rexingluan: "兴乱",
  rexingluan_info: "出牌阶段限一次，当你使用的仅指定一个目标的牌结算完成后，你可以获得场上一张与此牌点数相同的牌，或获得牌堆中随机一张点数与此牌相同的牌。",
  xinxingluan: "兴乱",
  xinxingluan_info: "每回合限一次。当你于出牌阶段内使用牌结算结束后，你可选择一项：①观看牌堆中的两张点数为6的牌并获得其中一张（没有则改为摸六张牌）；②令一名其他角色弃置一张点数为6的牌或交给你一张牌；③获得场上的一张点数为6的牌。",
  re_nanhualaoxian: "南华老仙",
  gongxiu: "共修",
  gongxiu_info: `结束阶段，若你本回合内发动过${get.poptip("jinghe")}，则你选择一项：①令所有本回合内成为过${get.poptip("jinghe")}目标的角色各摸一张牌；②令所有本回合内未成为过${get.poptip("jinghe")}目标的角色各弃置一张手牌。`,
  jinghe: "经合",
  jinghe_info: `每回合限一次，出牌阶段，你可以展示至多四张牌名各不相同的手牌并选择等量的角色。系统从“写满技能的天书”（${["releiji", "rebiyue", "new_retuxi", "remingce", "xinzhiyan", "nhyinbing", "nhhuoqi", "nhguizhu", "nhxianshou", "nhlundao", "nhguanyue", "nhyanzheng"].map((skill) => get.poptip(skill)).join("、")} ）中随机选择四个技能，然后这些角色依次选择获得其中的一个直到你的下回合开始。`,
  nhyinbing: "阴兵",
  nhyinbing_info: "锁定技，你使用的【杀】造成伤害改为失去体力。其他角色失去体力后，你摸一张牌。",
  nhhuoqi: "活气",
  nhhuoqi_info: "出牌阶段限一次，你可以弃置一张牌，然后令体力值最少的一名角色回复1点体力并摸一张牌。",
  nhguizhu: "鬼助",
  nhguizhu_info: "一名角色进入濒死状态时，你可以摸两张牌（每回合限一次）。",
  nhxianshou: "仙授",
  nhxianshou_info: "出牌阶段限一次，你可以选择一名角色令其摸一张牌。若其未受伤，则多摸一张。",
  nhlundao: "论道",
  nhlundao_info: "当你受到伤害后，若伤害来源比你手牌多，你可以弃置其一张牌；若伤害来源比你手牌少，你摸一张牌。",
  nhguanyue: "观月",
  nhguanyue_info: "结束阶段，你可以观看牌堆顶两张牌，然后获得其中一张，另一张放回牌堆顶。",
  nhyanzheng: "言政",
  nhyanzheng_info: "准备阶段，若你的手牌数大于1，你可以保留一张手牌并弃置其余的牌，然后选择至多等于弃牌数量的角色，对这些角色各造成1点伤害。",
  sp_mifangfushiren: "糜芳傅士仁",
  mffengshi: "锋势",
  mffengshi_info: "当你使用牌指定唯一目标后，或成为其他角色使用牌的唯一目标后，若此牌使用者的手牌数大于此牌目标的手牌数，则此牌的使用者可令你弃置自己和对方的各一张牌，并令此牌的伤害值+1。",
  dcmffengshi: "锋势",
  dcmffengshi_info: "当你使用牌指定唯一目标后，或成为其他角色使用牌的唯一目标后，若此牌使用者的手牌数大于此牌目标的手牌数，则你可弃置自己和对方的各一张牌，并令此牌的伤害值+1。",
  fengshi: "锋势",
  fengshi_info: "当你使用牌指定第一个目标后，你可弃置你与其中一名手牌数小于你的目标角色的各一张牌，并令此牌对其造成的伤害+1；当你成为其他角色使用牌的目标后，若你的手牌数小于其，则你可以弃置你与其的各一张牌，并令此牌对你造成的伤害+1。",
  tongyuan: "童渊",
  chaofeng: "朝凤",
  chaofeng_info: "出牌阶段限一次。当你造成伤害时，你可以弃置一张手牌，然后摸一张牌。若此伤害的渠道为牌且你弃置的牌：与此牌颜色相同，则你改为摸两张牌；与此牌类型相同，则此伤害+1。",
  chuanshu: "传术",
  chuanshu_info: `限定技。准备阶段，若你已受伤；或当你死亡时，你可令一名其他角色获得${get.poptip("chaofeng")}。然后你获得${get.poptip("ollongdan")}、${get.poptip("drlt_congjian")}和${get.poptip("chuanyun")}。`,
  chuanyun: "穿云",
  chuanyun_info: "当你使用【杀】指定目标后，你可令目标角色随机弃置其装备区内的一张牌。",
  zhangning: "张宁",
  tianze: "天则",
  tianze_info: "①其他角色于其出牌阶段内使用的第一张黑色手牌结算结束后，你可以弃置一张黑色牌，并对其造成1点伤害。②其他角色的判定生效后，若结果为黑色，则你摸一张牌。",
  difa: "地法",
  difa_info: "每回合限一次。当你于回合内得到红色牌后，你可以弃置其中一张。然后你选择一个锦囊牌的牌名，并从牌堆/弃牌堆中获得一张此牌名的牌。",
  xinping: "辛评",
  fuyuan: "辅袁",
  fuyuan_info: "当你于回合外使用或打出牌时，若当前回合角色的手牌数：不小于你，你可摸一张牌；小于你，你可令其摸一张牌。",
  zhongjie: "忠节",
  zhongjie_info: "当你死亡时，你可令一名其他角色加1点体力上限并回复1点体力，然后摸一张牌。",
  hanmeng: "韩猛",
  jieliang: "截粮",
  jieliang_info: "其他角色的摸牌阶段开始时，你可弃置一张牌，令其本阶段的摸牌数和本回合的手牌上限-1。然后当其于本回合的弃牌阶段内因弃置而失去牌后，你可获得其中的一张。",
  quanjiu: "劝酒",
  quanjiu_info: "锁定技。①你手牌区中的【酒】的牌名视为【杀】。②你使用对应的实体牌为一张【酒】的非转化【杀】不计入次数限制。",
  re_pangdegong: "庞德公",
  heqia: "和洽",
  heqia_info: "出牌阶段开始时，你可选择一项：①将任意张牌交给一名其他角色。②令一名有手牌的其他角色交给你任意张牌。然后以此法得到牌的角色可以将一张手牌当作任意基本牌使用（此牌无距离和次数限制），且当其声明使用此牌后，可以为此牌增加至至多X个目标（X为以此法移动的牌数）。",
  yinyi: "隐逸",
  yinyi_info: "锁定技。每回合限一次，当你受到非属性伤害时，若你的手牌数和体力值与伤害来源均不相同，则你防止此伤害。",
  haomeng: "郝萌",
  xiongmang: "雄莽",
  xiongmang_info: "你可将任意张花色各不相同的手牌当做目标数上限为X的【杀】使用（X为此【杀】对应的实体牌数）。此【杀】使用结算结束后，若此牌造成过/未造成过伤害，则你本阶段使用【杀】的额定次数+1/减1点体力上限。",
  yanfuren: "严夫人",
  channi: "谗逆",
  channi_info: "出牌阶段限一次。你可将任意张手牌交给一名其他角色，然后其可以将至多等量的手牌当做【决斗】使用。当其因此【决斗】：造成伤害后，其摸X张牌（X为此【决斗】对应的实体牌数）；受到伤害后，你弃置所有手牌。",
  nifu: "匿伏",
  nifu_info: "锁定技。一名角色的回合结束时，你将手牌摸至或弃置至四张。",
  licaiwei: "李采薇",
  yijiao: "异教",
  yijiao_info: "出牌阶段限一次，你可以选择一名没有“异”标记的其他角色并声明一个整数X（X∈[1,4]），该角色获得10X个“异”标记。有“异”标记的角色的结束阶段，其移去“异”标记，且若其本回合使用牌的点数之和：1.小于“异”标记数，其随机弃置至多三张手牌；2.等于“异”标记数，你摸两张牌且该角色本回合结束后进行一个额外的回合；3.大于“异”标记数，你摸三张牌。",
  qibie: "泣别",
  qibie_info: "一名角色死亡后，若你有手牌且这些手牌均可被弃置，则你可以弃置所有手牌，然后回复1点体力并摸X+2张牌（X为你弃置的牌数）。",
  dc_zhuling: "朱灵",
  dczhanyi: "战意",
  dczhanyi_info: "出牌阶段开始时，你可以弃置所有基本牌/锦囊牌/装备牌，然后获得另外两种类型的牌对应的效果直到你的下个回合开始：基本牌、你使用基本牌无距离限制，且伤害值和回复值基数+1；锦囊牌、你使用锦囊牌时摸一张牌，且锦囊牌不计入手牌上限；装备牌，当装备牌进入你的装备区时，你可弃置一名其他角色的一张牌。",
  yanrou: "阎柔",
  choutao: "仇讨",
  choutao_info: "当你使用【杀】时，或成为【杀】的目标后，你可以弃置此【杀】使用者的一张牌，令此【杀】不可被响应。若你是此【杀】的使用者，则你令此【杀】不计入次数限制。",
  xiangshu: "襄戍",
  xiangshu_info: "限定技。结束阶段开始时，若你本回合内造成过伤害，则你可以选择一名已受伤的角色。该角色回复X点体力并摸X张牌（X为你本回合内造成的伤害值总和且至多为5）。",
  qinyilu: "秦宜禄",
  piaoping: "漂萍",
  piaoping_info: "转换技，锁定技。当你使用一张牌时，阳：你摸X张牌。阴：你弃置X张牌。（X为你本阶段内发动过〖漂萍〗的次数且至多等于你的体力值）",
  tuoxian: "托献",
  tuoxian_info: "每局游戏限一次。当你因执行〖漂萍〗的效果而弃置牌后，你可令一名其他角色获得这些牌，然后令该角色选择一项：⒈弃置区域内等量的牌。⒉令你的〖漂萍〗失效直到回合结束。",
  zhuili: "惴栗",
  zhuili_info: "锁定技。当你成为其他角色使用黑色牌的目标后，若你的〖漂萍〗：处于阴状态，则你将〖漂萍〗转换至阳状态；处于阳状态，则你令〖托献〗发动次数+1，然后若〖托献〗发动次数大于3，则〖惴栗〗于本回合内失效。",
  fengfang: "冯方",
  dcditing: "谛听",
  dcditing_info: "其他角色的出牌阶段开始时，若你在该角色的攻击范围内，则你可以观看其的X张手牌（X为你的体力值）并选择其中一张，且获得如下效果：①当其使用对应实体牌包含此牌的牌指定你为目标后，你令此牌对你无效。②当其使用对应实体牌包含此牌的牌结算结束后，若你不是此牌的目标，则你摸两张牌。③其出牌阶段结束时，若此牌位于其的手牌区，则你获得此牌。",
  dcbihuo: "避祸",
  dcbihuo_info: "①当你受到其他角色造成的伤害后，你可令一名角色下回合摸牌阶段的额定摸牌数+1。②当你对其他角色造成伤害后，你可令一名角色下回合摸牌阶段的额定摸牌数-1。",
  bianxi: "卞喜",
  dunxi: "钝袭",
  dunxi_info: "①当你使用具有伤害标签的牌时，你可以令一名不为你的目标角色获得一枚“钝”。②有“钝”的角色使用基本牌或锦囊牌时，若此牌目标数为1且此时没有角色处于濒死状态，你令其移去一枚“钝”。系统随机选择一名角色，并将此牌的目标改为该角色。若该角色和原目标相同，则其失去1点体力。若其正处于出牌阶段内，则结束此阶段。",
  niufu: "牛辅",
  dcxiaoxi: "宵袭",
  dcxiaoxi_info: "锁定技。出牌阶段开始时，你声明X并减X点体力上限（X∈[1,2]）。然后你选择一名攻击范围内的其他角色并选择一项：⒈获得该角色的X张牌。⒉视为对其使用X张【杀】。",
  xiongrao: "熊扰",
  xiongrao_info: "限定技。准备阶段开始时，你可以选择所有其他角色。这些角色本回合内所有不为锁定技、限定技、觉醒技的普通技能失效。然后你将体力上限增加至7点并摸X张牌（X为你以此法增加的体力上限数）。",
  dc_huban: "胡班",
  dcchongyi: "崇义",
  dcchongyi_info: "①一名角色使用【杀】时，若此牌是其于当前出牌阶段内使用的第一张牌，则你可以令其摸两张牌，且其本回合使用【杀】的次数上限+1。②一名角色的出牌阶段结束时，若其于此阶段内使用的最后一张牌为【杀】，则你可以令其本回合的手牌上限+1，然后你获得此【杀】。",
  wangwei: "王威",
  dcruizhan: "锐战",
  dcruizhan_info: "其他角色的准备阶段开始时，若其的手牌数不小于其体力值，则你可以和其拼点。若你赢或拼点牌中有【杀】，则你视为对其使用一张【杀】。然后若此【杀】造成了伤害且以上两个条件均被满足，则你获得其一张牌。",
  dcshilie: "示烈",
  dcshilie_info: "①出牌阶段限一次。你可以选择一项：⒈回复1点体力，将两张牌置于武将牌上作为“示烈”。若“示烈”牌数大于存活人数，则你将最早的多余牌置入弃牌堆；⒉失去1点体力，获得两张“示烈”牌。（满血则不回血，无牌则不移动）②当你死亡时，你可以将所有“示烈”牌交给一名不为伤害来源的其他角色。",
  dc_zhaoyǎn: "赵俨",
  dcfuning: "抚宁",
  dcfuning_info: "当你使用牌时，你可以摸两张牌，然后弃置X张牌（X为你本回合内发动过〖抚宁〗的次数）。",
  dcbingji: "秉纪",
  dcbingji_info: "出牌阶段每种花色各限一次。若你有手牌且这些牌的花色均相同，则你可以展示手牌，然后选择一名其他角色，视为对其使用一张【杀】或【桃】（有距离限制）。",
  mushun: "穆顺",
  dcjinjian: "劲坚",
  dcjinjian_info: "①当你受到其他角色造成的伤害后或造成伤害后，你获得一枚“劲”。然后你可以和伤害来源拼点，若你赢，你恢复1点体力。②你的攻击范围+X（X为“劲”数）。",
  dcshizhao: "失诏",
  dcshizhao_info: "锁定技。每回合限一次，当你于回合外失去手牌后，若你没有手牌，且你：有“劲”，则你移去一枚“劲”并摸两张牌；没有“劲”，则你本回合下一次受到的伤害+1。",
  liyixiejing: "李异谢旌",
  dcdouzhen: "斗阵",
  dcdouzhen_info: "锁定技。①转换技。你的回合内，阳：当你使用非转化且对应的实体牌为一张黑色基本牌的【决斗】时，你获得目标角色各一张牌并获得1枚“☯”；阴：当你使用或打出非转化且对应的实体牌为一张红色基本牌的【杀】时，你获得1枚“☯”。②若你的“☯”数为：偶数，你的黑色基本牌均视为【决斗】；奇数，你的红色基本牌均视为无次数限制的普【杀】。",
  dc_hujinding: "新杀胡金定",
  dc_hujinding_prefix: "新杀",
  dcdeshi: "德释",
  dcdeshi_info: "锁定技。当你受到【杀】的伤害时，若你已受伤，则你防止此伤害并令系统从弃牌堆/牌堆中检索一张【杀】，你获得此【杀】，然后减1点体力上限。",
  dcwuyuan: "武缘",
  dcwuyuan_info: "出牌阶段限一次。你可将一张【杀】交给一名其他角色，然后你回复1点体力，你与其各摸一张牌。若此【杀】为：红色【杀】，其回复1点体力；属性【杀】，其改为摸两张牌。",
  shiyi: "是仪",
  dccuichuan: "榱椽",
  dccuichuan_info: `出牌阶段限一次。你可以弃置一张手牌并选择一名角色，其随机使用牌堆里一张其空置装备栏对应副类别且其能对其使用的装备牌，你摸X张牌（X为其装备区里的牌数）。然后若其装备区里的牌数增加至四张，你失去〖榱椽〗，获得${get.poptip("dczuojian")}，且令其于此回合结束后进行一个额外回合。`,
  dczhengxu: "正序",
  dczhengxu_info: "每回合每项限一次。①当你受到伤害时，若你本回合失去过牌，你可以防止此伤害。②当你失去牌后，若你本回合受到过伤害，你可以摸等量的牌。",
  dczuojian: "佐谏",
  dczuojian_info: "出牌阶段结束时，若你于此阶段使用过的牌数不小于体力值，你可以选择一项：1.令装备区牌数多于你的角色各摸一张牌；2.弃置装备区牌数少于你的角色各一张手牌。",
  sunlang: "孙狼",
  dctingxian: "铤险",
  dctingxian_info: "每回合限一次。当你使用【杀】指定最后一个目标后，你可以摸X张牌，然后可以令此【杀】对其中至多X个目标无效（X为你装备区的牌数+1）。",
  dcbenshi: "奔矢",
  dcbenshi_info: "锁定技。①你的攻击范围+1。②由你使用的【杀】的牌面信息中的“使用目标”产生的规则改为“攻击范围内的所有角色”。",
  sunhuan: "孙桓",
  dcniji: "逆击",
  dcniji_info: "①当你成为非装备牌的目标后，你可以摸一张牌，称为“逆击”。②一名角色的结束阶段，你可以使用一张“逆击”牌，然后弃置所有“逆击”牌。",
  dcmoukui: "谋溃",
  dcmoukui_info: "当你使用【杀】指定第一个目标后，你可以选择任意项：1.摸一张牌；2.弃置其中一个目标角色一张牌。若你均选择，当此【杀】被无效后或被抵消后，该角色弃置你一张牌。",
  guānning: "关宁",
  dcxiuwen: "修文",
  dcxiuwen_info: "当你使用牌时，若你未记录此牌牌名，你可以记录之并摸一张牌。",
  oldlongsong: "龙诵",
  oldlongsong_info: "出牌阶段开始时，你可以将一张手牌交给一名其他角色。然后其须选择其所有的发动时机为出牌阶段内的空闲时间点且你至多能于此阶段发动一次的技能，其于此阶段这些技能失效，你获得这些技能。",
  dclongsong: "龙诵",
  dclongsong_info: "出牌阶段开始时，你可以将一张红色牌交给一名其他角色。然后其须选择其所有的发动时机包含“出牌阶段”的技能，其于此阶段这些技能失效，你获得这些技能且至多可以发动一次。",
  longsong: "龙诵",
  longsong_info: "出牌阶段开始时，你可以交给或获得一名其他角色一张红色牌，然后你本阶段获得其发动时机包含“出牌阶段”的一项技能且至多可以发动一次。若其没有符合条件的技能，则改为随机获得一个满足条件的技能。",
  dc_mengda: "孟达",
  dclibang: "利傍",
  dclibang_info: "出牌阶段限一次。你可以弃置一张牌，正面向上获得两名其他角色的各一张牌。然后你判定，若结果与这两张牌的颜色均不同，你交给其中一名角色两张牌或失去1点体力，否则你获得判定牌并视为对其中一名角色使用一张【杀】。",
  dcwujie: "无节",
  dcwujie_info: "锁定技。①你使用无色牌无距离限制且不计入使用次数。②其他角色杀死你后不执行身份奖惩。",
  dc_jsp_guanyu: "新杀SP关羽",
  dc_jsp_guanyu_prefix: "新杀SP",
  dcdanji: "单骑",
  dcdanji_info: "觉醒技。准备阶段，若你区域内的牌数大于体力值，你减1点体力上限，将体力回复至体力上限并摸等量张牌，然后获得〖马术〗和〖怒嗔〗。",
  dcnuchen: "怒嗔",
  dcnuchen_info: "出牌阶段限一次。你可以展示一名其他角色的一张手牌，然后选择一项：1.弃置任意张该花色的牌，对其造成等量伤害；2.获得该角色手牌中所有此花色的牌。",
  dc_jikang: "新杀嵇康",
  dc_jikang_prefix: "新杀",
  dcjuexiang: "绝响",
  dcjuexiang_info: "当你死亡时，杀死你的角色弃置其装备区内的所有牌并失去1点体力，然后你可以令一名其他角色获得〖残韵〗。",
  dccanyun: "残韵",
  dccanyun_info: "每名角色限一次。出牌阶段，你可以弃置一张牌并选择一名其他角色，然后若其装备区里的牌数：小于你，其回复1点体力；大于你，其失去1点体力；等于你，其摸一张牌。若你的体力值为1，你摸一张牌。",
  star_caoren: "星曹仁",
  star_caoren_prefix: "星",
  starsujun: "肃军",
  starsujun_info: "当你使用一张牌时，若你手牌中的基本牌和非基本牌的牌数相等，你可以摸两张牌。",
  starlifeng: "砺锋",
  starlifeng_info: "你可以将一张本回合未有角色使用过的颜色的手牌当做无次数限制且不计入次数的【杀】或【无懈可击】使用。",
  star_yuanshu: "星袁术",
  star_yuanshu_prefix: "星",
  starcanxi: "残玺",
  starcanxi_wangsheng: "妄生",
  starcanxi_xiangsi: "向死",
  starcanxi_cancel: "向死",
  starcanxi_info: "锁定技。①游戏开始时，你获得场上所有角色的势力对应的“玺角”标记（初始势力中未获得的“玺角”标记改为增加等量的体力上限）。②每轮开始时，你选择一个“玺角”对应势力并选择以下一项：1.妄生：本轮被选择势力角色每回合首次造成的伤害+1且计算与其他角色间的距离-1；2.向死：本轮其他被选择势力角色每回合首次回复体力后失去1点体力且每回合对你使用的第一张牌无效。",
  starpizhi: "圮秩",
  starpizhi_info: "锁定技。①一名角色死亡后，若你拥有该角色对应的“玺角”标记且你本轮发动〖残玺〗的势力与其相同，或其是该势力最后一名角色，你失去之，然后摸X张牌并回复1点体力。②结束阶段，你摸X张牌。（X为你本局游戏失去的“玺角”标记数）",
  starzhonggu: "冢骨",
  starzhonggu_info: "主公技，锁定技。摸牌阶段，若游戏轮数大于等于场上的群势力角色数，则你额外摸两张牌，否则你少摸一张牌。",
  star_dongzhuo: "星董卓",
  star_dongzhuo_prefix: "星",
  starweilin: "威临",
  starweilin_info: "锁定技。当你于回合内对一名角色造成伤害时，若其本回合未受到过伤害，且你本回合使用的牌数大于等于其体力值，则此伤害+1。",
  starzhangrong: "掌戎",
  starzhangrong_info: "准备阶段，你可以选择令至多X名体力值大于等于你的角色各失去1点体力或令至多X名手牌数大于等于你的角色各弃置一张手牌（X为你的体力值）。若如此做，你摸等同于选择角色数的牌，且本回合结束时，若这些角色中存在本回合未受到过伤害的角色，则你失去1点体力。",
  starhaoshou: "豪首",
  //starhaoshou_info:'主公技。①其他群势力角色使用【酒】结算完毕后，其可以令你回复1点体力。②当你处于濒死状态时，其他群势力角色可以将【酒】当作【桃】对你使用。',
  starhaoshou_info: "主公技。其他群势力角色使用【酒】结算完毕后，其可以令你回复1点体力。",
  star_yuanshao: "星袁绍",
  star_yuanshao_prefix: "星",
  starxiaoyan: "硝焰",
  starxiaoyan_info: "锁定技，游戏开始时，你对所有其他角色各造成1点火属性伤害，然后这些角色可依次交给你一张牌并回复1点体力。",
  starzongshi: "纵势",
  starzongshi_info: "出牌阶段，你可以展示一张可展示目标的基本牌或普通锦囊牌，然后你将手牌中所有与此牌花色相同的其他牌当作此牌使用（无距离限制），且此牌至多指定转化牌数的目标。",
  starjiaowang: "骄妄",
  starjiaowang_info: "锁定技，每轮结束时，若本轮没有角色死亡，则你失去1点体力并发动〖硝焰〗。",
  staraoshi: "傲势",
  staraoshi_info: "主公技，其他群势力角色的出牌阶段限一次，其可以交给你一张手牌，然后你可以发动一次〖纵势〗。",
  star_zhangchunhua: "星张春华",
  star_zhangchunhua_prefix: "星",
  starliangyan: "梁燕",
  starliangyan_info: "出牌阶段限一次。你可以选择一名其他角色，你摸/弃置至多两张牌，令其弃置/摸等量的牌。然后若你与其手牌数相同，以此法摸牌的角色跳过其下一个弃牌阶段。",
  starminghui: "明慧",
  starminghui_info: "一名角色的回合结束时，若你的手牌数：最少，你可以视为使用一张无距离限制的【杀】；最多，你可以将手牌弃置至你手牌数不为最多，然后令一名角色回复1点体力。",
  star_sunshangxiang: "星孙尚香",
  star_sunshangxiang_prefix: "星",
  starsaying: "飒影",
  starsaying_info: "每轮每种牌名限一次，你需要使用【杀】或【闪】时，你可以使用一张装备牌，视为使用之；你需要使用【桃】或【酒】时，你可以收回装备区里的一张牌，视为使用之。",
  starjiaohao: "骄豪",
  starjiaohao_info: "出牌阶段限一次，你可以与一名装备区牌数不大于你的角色拼点，然后你可令赢的角色获得拼点牌或令其使用一张【杀】。",
  liqueguosi: "李傕郭汜",
  xiongsuan: "凶算",
  xiongsuan_info: "出牌阶段限一次，你可以弃置一张手牌并对一名角色造成1点伤害，然后你摸三张牌。若该角色不为你，你失去1点体力。",
  star_sunjian: "星孙坚",
  star_sunjian_prefix: "星",
  starruijun: "锐军",
  starruijun_info: "当你于出牌阶段首次使用牌指定其他角色为目标后，你可以选择其中一名目标角色并摸X张牌（X为你已损失的体力值+1）。直到此阶段结束，除其外的其他角色均不在你的攻击范围内，你对其使用牌无距离限制，且当你对其造成非首次伤害时，此伤害值改为Y（Y为你此阶段上次对其造成的伤害值+1，至多为5）。",
  stargangyi: "刚毅",
  stargangyi_info: "锁定技。①你的回合内，若你本回合没有造成过伤害，你不能使用【桃】。②当你处于濒死状态时，以你为目标的【桃】或【酒】的回复值+1。",
  star_xiahouba: "星夏侯霸",
  star_xiahouba_prefix: "星",
  starweigu: "维谷",
  starweigu_info: "你使用伤害牌指定唯一目标或成为伤害牌唯一目标时，你可以弃置一张可指定自己为目标（toself为true或牌面目标合法）的牌，然后选择一项：1、移动场上一张牌；2、令你攻击范围内的所有角色也成为此牌目标（不包括此牌使用者）。此牌结算后若牌未造成伤害，你失去1点体力并摸两张牌。",
  starjuefa: "绝伐",
  starjuefa_info: "限定技，出牌阶段，你可以将“维谷”中“移动场上一张牌”改为“对一名角色造成2点伤害”直到你的下个回合结束。若如此做，当你于此期间通过“维谷”杀死角色后，你将手牌数和体力值调整至体力上限；若于此期间你未杀死过角色，效果结束时你失去所有体力。",
  star_zhangzhao: "星张昭",
  star_zhangzhao_prefix: "星",
  starzhongyan: "忠言",
  starzhongyan_info: "出牌阶段限一次，你可展示牌堆顶三张牌，然后令一名角色将一张手牌与其中一张牌交换。然后若这些牌颜色相同，其回复1点体力或获得场上一张牌。然后若该角色不为你，你执行其未执行的一项。",
  starjinglun: "经纶",
  starjinglun_info: "每回合限一次，当你距离1以内的角色造成伤害后，你可以令其摸X张牌并对其发动〖忠言〗（X为其装备区的牌数）。",
  chezhou: "车胄",
  dcshefu: "慑伏",
  dcshefu_mark1: "慑伏1",
  dcshefu_mark2: "慑伏2",
  dcshefu_mark3: "慑伏3",
  dcshefu_mark4: "慑伏4",
  dcshefu_mark5: "慑伏5",
  dcshefu_info: "锁定技。你对其他角色/其他角色对你使用牌的伤害基数改为X（X为此牌对应的所有实体牌最近一次被伤害来源获得后至现在经过的轮次数之和且至多为5）。",
  dcpigua: "披挂",
  dcpigua_info: "当你对一名其他角色造成超过1点伤害后，你可以获得其至多等同于游戏轮次的牌，这些牌本回合不计入你的手牌上限。",
  hansong: "韩嵩",
  dcyinbi: "隐避",
  dcyinbi_info: "锁定技。①你的手牌上限与场上手牌上限最多的角色相同。②若没有其他角色的手牌数与你相等，则你使用牌无距离和次数限制。",
  dcshuaiyan: "率言",
  dcshuaiyan_info: "①其他角色的摸牌阶段或弃牌阶段结束时，若手牌数与你相等，你可以弃置其一张牌或摸一张牌。②你的摸牌阶段或弃牌阶段结束时，可以摸X张牌（X为手牌数与你相同的角色数）。",
  matie: "马铁",
  dczhuiwang: "追亡",
  dczhuiwang_info: "锁定技，你计算体力值小于等于你的角色的距离视为1。",
  dcquxian: "驱险",
  dcquxian_info: "回合开始与结束时，你可以从牌堆获得一张【杀】并选择一名其他角色，攻击范围内包含其的角色可以依次对其使用一张【杀】，每有一名角色使用【杀】你便在所有【杀】结算后摸一张牌。若其未以此法受到伤害，这些角色中未使用【杀】的角色失去X点体力（X为这些角色中使用【杀】的角色数）。",
  star_xunyu: "星荀彧",
  star_xunyu_prefix: "星",
  staranshu: "安庶",
  staranshu_info: "①每轮结束时，你可将弃牌堆中不同牌名的基本牌各一张置于牌堆顶，然后视为使用一张【五谷丰登】（从你或一名已受伤角色开始结算）；②一名角色的回合结束时，若有角色本回合失去了上轮因〖安庶〗①获得的牌，你可令其将手牌摸至体力上限（至多摸五张）。",
  starkuangzuo: "匡祚",
  starkuangzuo_info: "限定技，出牌阶段，你可以令一名角色A获得〖承奉〗（若其为主公且没有主公技，其额外获得〖统荫〗），然后令另一名角色B将每种花色的牌各一张置于A武将牌上，称为“匡祚”。",
  starchengfeng: "承奉",
  starchengfeng_info: "每回合限一次，你可以将一张红色/黑色“匡祚”牌当作【闪】/【无懈可击】对即将对你生效的牌使用。此牌结算完成后，若你的“匡祚”牌包含颜色数少于2，你可以将牌堆顶一张牌当作“匡祚”置于武将牌上。",
  startongyin: "统荫",
  startongyin_info: "主公技，你受到其他角色使用牌造成的伤害后，若伤害来源与你势力相同/不同，你可以将此牌/其一张牌当作“匡祚”置于武将牌上。",
  star_fazheng: "星法正",
  star_fazheng_prefix: "星",
  starzhiji: "知机",
  starzhiji_info: "准备阶段，你可以弃置任意张手牌并将手牌数摸至五张，然后若你弃置的牌数与你摸的牌数之差X：大于0，你可以对至多X名其他角色各造成1点伤害；等于0，你本回合使用牌无法被响应；小于0，你本回合手牌上限+2。",
  staranji: "谙计",
  staranji_info: "锁定技，一名角色使用牌时，若此花色的牌本轮游戏使用的唯一最少，则你摸一张牌。",
  star_dingfeng: "星丁奉",
  star_dingfeng_prefix: "星",
  stardangchen: "荡尘",
  stardangchen_info: "出牌阶段开始时，你可以令一名角色交给你任意张牌，然后你可以弃置X张牌（X为其交给你的牌数）。若你因此弃牌，则当你于本阶段使用【杀】或普通锦囊牌指定其为目标后，可以进行一次判定，若判定的点数为X的倍数，则此牌额外结算一次。",
  starjianyu: "翦羽",
  starjianyu_info: "锁定技，其他角色在你回合内失去装备区的牌后，你摸一张牌。",
  star_wenchou: "星文丑",
  star_wenchou_prefix: "星",
  starlianzhan: "连战",
  starlianzhan_info: "当你使用伤害牌指定唯一目标时，你可以选择一项：①为此牌增加一个目标；②令此牌额外结算一次。若如此做，此牌结算完毕后，若此牌造成伤害的次数：为2，你可以回复1点体力（若你未受伤则改为摸两张牌）；为0，目标角色依次视为对你使用同名牌。",
  starweiming: "威名",
  starweiming_info: "锁定技，体力值小于你或本轮受到过你造成伤害的其他角色对你使用牌时，其随机弃置一张手牌，若所有条件同时满足，则你摸一张牌。",
  star_yanliang: "星颜良",
  star_yanliang_prefix: "星",
  starjizhan: "急战",
  starjizhan_info: "你于回合内使用首张伤害牌指定首个目标后，可令此牌对其中一个目标造成伤害+2（你本回合此前每使用过一张非伤害牌，此数值-1）；若此牌结算后未造成伤害，其对你造成1点伤害。",
  starcuxia: "促狭",
  starcuxia_info: "锁定技，体力值大于你或本轮对你造成过伤害的其他角色对你使用牌时，其随机弃置一张手牌，若所有条件同时满足，则你摸一张牌。",
  star_zhangrang: "星张让",
  star_zhangrang_prefix: "星",
  starduhai: "蠹害",
  starduhai_info: "你成为其他角色使用牌的目标后，你可以选择一种花色，然后令其增加此花色的「蠹」标记。该角色的回合结束时，若其手牌中有与「蠹」花色相同的牌，则其失去对应花色数点体力，然后移去这些花色的「蠹」。",
  starlingse: "令色",
  starlingse_info: "出牌阶段限一次，你可交给一名其他角色一张牌，然后随机获得该角色与此牌类型相同的两张牌，不足两张则视为其对你使用一张【杀】 。若此【杀】造成伤害，则此技能视为未发动过。",
  star_taishici: "星太史慈",
  star_taishici_prefix: "星",
  starchongwei: "重围",
  starchongwei_info: "锁定技，你计算与其他角色的距离+3。当你造成伤害后，此数值-1，减少至0时你回复1点体力并摸体力值张牌，修改〖冲阻〗并失去此技能。",
  starchongzu: "冲阻",
  starchongzu_info: "你使用指定自己为目标的牌结算完成后，可选择一项：1.你使用下一张牌无距离次数限制；2.摸两张牌且此项本回合失效。",
  starchongzu_rewrite: "冲阻·改",
  starchongzu_rewrite_info: "你使用指定自己为目标的牌结算完成后，可选择一项：1.你使用下一张牌无距离次数限制；2.摸两张牌且此项本回合失效；3.你下次使用牌指定目标后，可对其中一个其他角色造成1点伤害。",
  star_jiangwan: "星蒋琬",
  star_jiangwan_prefix: "星",
  starzhenting: "镇庭",
  starzhenting_info: "一名角色的回合结束时，若本回合至少两名角色受到过伤害，你可以选择一项：1.令本回合受到过伤害的一名角色回复1点体力并摸一张牌；2.令本回合造成过伤害的一名角色获得本回合进入弃牌堆的两张牌。",
  starchiguo: "持国",
  starchiguo_info: "出牌阶段开始时，你可以观看牌堆底三张牌，本阶段你使用一张牌时，亮出牌堆底一张牌，若两张牌花色相同，你为你使用的牌增加或减少一个目标（目标数至少为1），然后将此牌置入弃牌堆；否则你将亮出牌交给一名目标角色。",
  cuilie: "崔烈",
  dczijue: "赀爵",
  dczijue_info: "出牌阶段限一次，你可令一名其他角色声明2-4中的一个数字，你可交给其X张牌并回复1点体力，然后其他角色计算与你的距离和你的拼点牌点数+X直到你的下回合开始且你拼点时摸一张牌；若你未交给其牌，则你摸X张牌（X为其声明的数字）。",
  dcchibi: "斥避",
  dcchibi_info: "其他角色使用牌指定其计算距离大于1的角色为目标时，你可与其拼点：若你赢，你令此牌无效并获得此牌；若你没赢，你成为此牌的额外目标且此技能本回合失效。",
  dc_yanxiang: "新杀阎象",
  dc_yanxiang_prefix: "新杀",
  dcyuzheng: "谕诤",
  dcyuzheng_info: "出牌阶段每项各限一次，你可以令一名角色选择一项：1.将手牌数调整至与全场最少角色相同，本轮下X次使用或打出牌后摸两张牌（X为以此法弃置的牌数）；2.摸等同于体力上限张牌（至多为5），本轮增加等量手牌上限，且本轮至多可以再使用等量张牌。",
  dcyxsuishi: "邃识",
  dcyxsuishi_info: "一名角色的结束阶段，若其手牌数不小于体力值，你可以声明一种伤害牌牌名，其可将一张牌当此牌使用，若此牌造成伤害，受到伤害的角色不能使用与造成伤害的牌颜色相同的牌直到其回合结束。",
  star_zhanghe: "星张郃",
  star_zhanghe_prefix: "星",
  starjunxi: "峻袭",
  starjunxi_info: "出牌阶段开始时，你可选择一名其他角色并记录你的手牌数；此阶段结束时，该角色须弃置任意张牌并失去任意点体力（弃置牌数与体力值之和为X），若X等于0，你弃置两张牌（X为你当前手牌数与记录值的差值）。",
  starjixian: "机先",
  starjixian_info: "若你回合的第一个出牌阶段没有使用基本和锦囊牌，则弃牌阶段结束后你可以执行一个额外的出牌阶段，此阶段你不能使用装备牌。",
  old_starjixian: "机先",
  old_starjixian_info: "锁定技，回合开始时，你须调整本回合额定阶段的顺序（不可与上回合相同）。",
  star_zhangsong: "星张松",
  star_zhangsong_prefix: "星",
  starxisong: "悉诵",
  starxisong_info: "每轮限一次，其他角色的出牌阶段开始时，你可观看其手牌，若如此做，此阶段结束时，你声明一个类别、花色和点数并展示其手牌。若其中有完全符合你声明的牌，此技能视为未发动过，然后其弃置此牌，若你能使用则使用之。",
  starfanglang: "放浪",
  starfanglang_info: "①摸牌阶段结束时，你可以展示一张此阶段摸到的牌，然后直到你的下回合开始，当你每回合使用或打出第一张除展示牌外的牌时，你摸X张牌（X为此牌与展示牌类别、花色、点数相同的项数）。②结束阶段，你可以弃置一张牌，然后获得弃牌堆中与此牌类别、点数、花色相同的牌各一张。",
  caobao: "曹豹",
  yanjiu: "厌酒",
  yanjiu_info: "锁定技，每轮结束时，若X为0，则你回复1点体力；否则你失去X点体力，然后令一名其他角色下次受到【杀】的伤害+1。（X为你本轮使用的【酒】数量）",
  poyin: "迫饮",
  poyin_info: "锁定技。①回合开始时，你摸体力上限张牌，然后令其中体力值或已损失体力值张牌视为【酒】。②回合结束时，手牌最多的角色猜测你手牌中的【酒】是否多于其余手牌，若其猜对，则其从牌堆中获得一张【杀】；否则你可以重铸任意张牌。"
};
const characterTitles = {
  star_zhugejin: "怀玉之臣",
  caobao: "杯盏游神",
  star_zhangsong: "乌鹊折槁",
  star_zhanghe: "河北之庭柱",
  dc_yanxiang: "冢中鸣鸮",
  cuilie: "镇纲责僭",
  star_jiangwan: "讬忠赞业",
  star_yanliang: "狰颤四方",
  lijue: "奸谋恶勇",
  zhangji: "武威雄豪",
  fanchou: "庸生变难",
  guosi: "党豺为虐",
  lvkai: "铁心司南",
  zhanggong: "西域长歌",
  weiwenzhugezhi: "帆至夷洲",
  sp_liuqi: "居外而安",
  xf_tangzi: "工学之奇才",
  gz_xf_huangquan: "道绝殊途",
  xf_huangquan: "道绝殊途",
  gz_xf_sufei: "与子同袍",
  xf_sufei: "与子同袍",
  xinpi: "一节肃六军",
  lisu: "魔使",
  zhangwen: "	冲天孤鹭",
  xushao: "识人读心",
  mangyachang: "截头蛮锋",
  xugong: "独计击流",
  zhangchangpu: "矜严明训",
  sp_zhanghe: "名门的梁柱",
  xunchen: "单锋谋孤城",
  sp_shenpei: "总幕府",
  gaolan: "诽殇之柱",
  lvkuanglvxiang: "数合斩将",
  chunyuqiong: "西园右校尉",
  sp_xuyou: "恃才傲物",
  sp_zhangliao: "功果显名",
  caobuxing: "一点须弥",
  re_maliang: "文经勤类",
  zhujun: "征无疑虑",
  liuhong: "汉灵帝",
  re_hejin: "色厉内荏",
  ol_dingyuan: "养虎为患",
  wangrong: "灵怀皇后",
  dongxie: "暗夜豺狐",
  re_hansui: "雄踞北疆",
  re_quyi: "名门的骁将",
  hanfu: "度势恇然",
  zhaozhong: "骄纵窃幸",
  re_taoqian: "膺秉温仁",
  caosong: "依权弼子",
  liangxing: "凶豺掠豹",
  zhangmiao: "苔岑往却",
  re_niujin: "新杀牛金",
  duanwei: "凉国之英",
  zhangheng: "戾鹘枭鹰",
  tangji: "弘农王妃",
  re_dongcheng: "扬义誓诛",
  re_hucheer: "惩奸除恶",
  qiuliju: "乌丸王",
  re_zoushi: "惑心之魅",
  caoanmin: "履薄临深",
  dufuren: "沛王太妃",
  re_nanhualaoxian: "仙人指路",
  zhangning: "大贤后人",
  xinping: "全忠折节",
  hanmeng: "锥锋不虞",
  re_pangdegong: "德懿举世",
  haomeng: "悖虎之伥",
  yanfuren: "霜天薄裳",
  licaiwei: "啼雨孤鸯",
  dc_zhuling: "良将之亚",
  yanrou: "冠玉啸北",
  qinyilu: "尘垢粃糠",
  fengfang: "监彻京师",
  bianxi: "伏龛蛇影",
  niufu: "魔郎",
  dc_huban: "血火照路",
  wangwei: "苍心辟道",
  dc_zhaoyǎn: "扬历干功",
  mushun: "疾风劲草",
  liyixiejing: "踵蹑袭进",
  dc_hujinding: "怀子求怜",
  shiyi: "清恪贞佐",
  sunlang: "恶惮远役",
  sunhuan: "扼龙决险",
  guānning: "承义秉文",
  dc_mengda: "据国向己",
  dc_jsp_guanyu: "汉寿亭侯",
  dc_jikang: "登高远望",
  //疑似被购卡雪藏起来的新杀嵇康，只能用皮肤称号了
  star_caoren: "伏波四方",
  star_yuanshu: "狂貔猖貅",
  star_dongzhuo: "千里草的魔阀",
  star_yuanshao: "熏灼群魔",
  star_zhangchunhua: "皑雪皎月",
  star_sunshangxiang: "鸳袖衔剑珮",
  liqueguosi: "犯祚倾祸",
  star_sunjian: "破虏将军",
  star_xiahouba: "箍围抗尽",
  star_zhangzhao: "忠謇方直",
  chezhou: "当车螳臂",
  junk_zhangrang: "宦势控权",
  hansong: "楚国之望",
  matie: "继志伏波",
  star_xunyu: "怀忠念治",
  star_fazheng: "定军佐功",
  star_dingfeng: "廓清阶陛",
  star_wenchou: "夔威天下",
  star_zhangrang: "斗筲穿窬",
  star_taishici: "信义为先",
  tongyuan: "蓬莱枪神散人",
  sp_mifangfushiren: "进退维谷"
};
const characterIntro = {
  cuilie: "崔烈（？—192年6月28日），字威考，冀州博陵郡安平县（今河北省安平县）人。东汉大臣、名士。中平二年（185年），耗费五百万钱，担任司徒。中平四年，迁太尉。初平元年（190年），受累于儿子崔钧讨伐董卓，逮捕入狱。初平三年（192年）四月，董卓受诛，崔烈释放出狱，担任城门校尉。同年六月，李傕与郭汜率领凉州军攻破长安，崔烈战死。崔烈有文才，所著诗、书、教、颂等凡四篇。",
  liqueguosi: "请分别查看「李傕」和「郭汜」的武将介绍。",
  tangji: "唐姬，会稽太守唐瑁女，弘农怀王刘辩的妃子。刘辩死后，唐姬回归故里，因节烈不愿改嫁他人，后被汉献帝下诏封为弘农王妃。",
  lijue: "李傕（一说“傕”读音“què”）（？—198年），字稚然。北地郡泥阳县（今陕西省耀县）人，汉末群雄之一。东汉末年汉献帝时的军阀、权臣，官至大司马、车骑将军、开府、领司隶校尉、假节。<br>李傕本为董卓部将，后被董卓的女婿牛辅派遣至中牟与朱儁交战，大破朱儁，进而至陈留、颍川等地劫掠。初平三年（192年）董卓和牛辅被杀后，李傕归无所依，于是采用贾诩之谋，伙同郭汜、张济、樊稠等原董卓部曲将攻向长安。击败吕布，杀死王允等人，占领长安，把持朝廷大权。后诸将不和，李傕在会议上杀死了樊稠，又与郭汜分别劫持了汉献帝和众臣，相互交战，张济率兵赶来和解，于是二人罢兵，李傕出屯池阳黄白城，郭汜、张济等人随汉献帝东归前往弘农。<br>后来，李傕、郭汜、张济反悔，联合起来追击汉献帝，与杨奉、董承等人几番交战。汉献帝一路逃亡，狼狈不堪，到达安邑，与李傕等人讲和。不久，汉献帝被曹操迎往许都。建安三年（198年），曹操派谒者仆射裴茂召集关西诸将段煨等人征讨李傕，灭其三族。",
  zhangji: "张济（？－196年），武威郡祖厉县（今甘肃靖远东南）人。东汉末年割据军阀之一。 张济原为董卓部将，董卓被诛杀后，张济与李傕一同率军攻破长安，任中郎将。不久，升任镇东将军，封平阳侯，出屯弘农。献帝东迁时，张济升任骠骑将军，率军护卫献帝，后来因与董承等人有矛盾，便与李傕、郭汜一同追赶献帝。 建安元年（196年），张济因军队缺粮而进攻穰城，中流矢而死。死后，部队由侄儿张绣接管。",
  guosi: "郭汜（？－197年），又名郭多，凉州张掖（今甘肃张掖西北）人，东汉末年将领、军阀，献帝时权臣。原为董卓部下。董卓被杀后，凉州众将归无所依，于是采用贾诩之谋，联兵将攻向长安，击败吕布，杀死王允等人，占领长安，把持朝廷大权。几年后，郭汜被部将伍习杀死。",
  fanchou: "樊稠（？—195年），凉州金城（治今甘肃永靖西北）人。东汉末年军阀、将领。官至右将军，封万年侯。 原为董卓部将，董卓死后，伙同李傕、郭汜、张济等人合众十余万反扑长安，败吕布、杀王允，把持朝政。后马腾因与李傕有隙，于是联合韩遂举兵进攻，李傕派樊稠、郭汜等与其交战，大败马腾、韩遂于长平观下。樊稠追至陈仓，与韩遂友好罢兵，却遭李傕猜疑。兴平二年（195年），李傕让外甥骑都尉胡封在会议上将樊稠刺死（一说趁醉用杖击杀）。",
  lvkai: "吕凯（？―225年），字季平，永昌郡不韦县（今云南保山东北）人，三国时期蜀汉官员。初任永昌郡五官掾功曹。章武三年（223年），建宁太守雍闿反叛，投降吴国，吴国任雍闿为永昌太守，吕凯闭境抗拒雍闿。建兴三年（225年），丞相诸葛亮南征，表奏吕凯功劳，任命他为云南太守，封阳迁亭侯。吕凯还未上任，便被叛乱的少数民族杀害。",
  zhanggong: "张恭（生卒年不详），三国时期魏国大臣，与子张就一同闻名于西域。官至西域戊己校尉、关内侯，赠执金吾。初为敦煌郡功曹。东汉末河西大乱，太守马艾卒官，他被众人推为代理长史，遂派儿子张就请曹操委任太守，直至新太守到任。魏文帝时拜西域戊己校尉。魏明帝时去世。",
  weiwenzhugezhi: "卫温 （？—231年），三国时期东吴将领，曾任将军职。诸葛直（？—231年），三国时期东吴将领。黄龙二年（230年）正月，孙权派卫温、诸葛直带领上万士兵出海寻找夷洲、亶洲，想要俘获那里的民众以充实东吴的人口，陆逊和全琮都谏言反对，孙权不听。230年和卫温一起登上台湾（当时的台湾叫做夷洲），他们是中国历史上记载的最早登陆台湾的人。卫温和诸葛直花费了约一年时间行军，士兵们因为疾病死去了十分之八到十分之九，因为亶洲太过遥远，卫温和诸葛直最终没能到达那里，只带了几千名夷洲的人返回。黄龙三年（231年），孙权认为诸葛直违背诏令，劳财伤民，无功而返，和卫温一同入狱被处死。",
  beimihu: "卑弥呼（ひみこ，约159年-约249年，有的史书也写成“俾弥呼”）是日本弥生时代邪马台国（今日本本州近畿地区）的女王，在《三国志·魏书·倭人传》中有关于她的记载。关于她的真实身份一直众说纷纭，是个极具神秘色彩的古代女性统治者。亦是日本古代宗教鬼道教的发源者。",
  liuqi: "刘琦（？－209年）。兖州山阳郡高平县（今山东省济宁市微山县两城镇）人。荆州牧刘表的长子、谏议大夫刘琮兄。官至荆州刺史。建安十四年（209年）病逝。",
  tangzi: "唐咨（生卒年不详），三国时魏利城（今江苏赣榆西）人。魏文帝黄初中利城郡反，推唐咨为主。后为魏军击破，遂亡至吴，官至左将军，封侯、持节。后助诸葛诞拒魏，兵败被俘。为安抚吴国军民，魏主拜唐咨为安远将军。",
  huangquan: "黄权（？－240年），字公衡。巴西郡阆中县（今四川阆中）人。三国时期蜀汉、曹魏将领。<br>黄权年轻时为郡吏，后被益州牧刘璋召为主簿。曾劝谏刘璋不要迎接刘备，因而被外放为广汉县长。刘璋败，才降刘备，被拜为偏将军。建计取汉中，拜护军。刘备为汉中王，仍领益州牧，以黄权为治中从事。及刘备称帝，将伐吴，黄权劝谏而不纳。以其为镇北将军，督江北军以防魏师进攻。刘备伐吴败还，而归途隔绝，黄权不得归，无奈之下率部降魏。被魏文帝所赏识，拜镇南将军，封育阳侯，加侍中，使同车陪乘。后领益州刺史，进驻河南。景初三年（239年），迁车骑将军、仪同三司。正始元年（240年），黄权去世，谥号“景”。",
  sufei: "苏飞（生卒年不详），东汉末年人物，原为东汉末年荆州牧刘表的部将，任江夏都督。<br>苏飞与甘宁交好，但是数次向黄祖推荐都失败。甘宁决定投效孙权时助其逃离。后来甘宁率吴军攻破江夏，苏飞兵败被俘。孙权打算将苏飞处斩，但是因为甘宁用性命担保而赦免了苏飞。降吴后官至军都督。",
  zhangchangpu: "钟会的母亲。《母夫人张氏传》：夫人张氏，字昌蒲，太原兹氏人，太傅定陵成侯之命妇也。",
  xugong: "许贡是东汉末官吏。先后任吴郡都尉、太守，欲送密信给曹操，要曹操注意孙策，却被孙策发现而被杀。许贡生前招揽了一些门客，当中有三人不忘故主，千方百计想要手刃仇人。建安五年（公元200年），广陵太守陈登派人秘密联系孙策治下的山贼余党，企图颠覆孙策在江东的统治。孙策决定讨伐陈登，行军到丹徒时，许贡门客终于找到了机会。因为孙策有单骑出猎，在野外思考的习惯，三门客趁孙策轻装外出打猎时，放冷箭射中孙策面颊。这些门客后来在与孙策的搏斗中，被赶到的侍卫杀死。孙策此后因为伤口感染，并且俊美的容貌被毁，终于不治身亡，去世时年仅26岁。",
  mangyachang: "南蛮王孟获的部将，使一口截头大刀，骑一匹黄骠马。率军与蜀军交战，战败王平。后被平北将军马岱斩杀。只出现在《三国演义》里，正史中无此人。",
  xushao: "许劭（150年—195年），字子将。汝南平舆（今河南平舆县射桥镇）人。东汉末年著名人物评论家。据说他每月都要对当时人物进行一次品评，人称为“月旦评”。曾任汝南郡功曹，后南渡投靠扬州刺史刘繇。刘繇被孙策击败后，许劭随其逃往豫章郡，并在豫章去世。",
  zhangwen: "张温（193年—230年），字惠恕，吴郡吴县（今江苏苏州）人。少修节操，容貌奇伟。孙权召拜议郎、选曹尚书，徙太子太傅。黄武三年（224），以辅义中郎将身份出使蜀汉，孙权原先害怕诸葛亮会有意留难张温，但张温不担心。在呈上蜀汉朝廷的文书刻意称颂蜀汉，以表明和解的诚意，重建两国关系。他在蜀汉表现出色，得蜀汉朝廷重视。回东吴后不久，被调进豫章的军队，事业上再无进展。孙权一方面介怀他出使蜀汉时称颂蜀汉，又嫌他声名太盛，恐怕张温不会尽忠地由他任用。当时正好碰上暨艳事件，暨艳是张温引荐的臣子，但他滥用职权，升迁评定等只看自己喜恶。事件被揭发后暨艳及同党徐彪都自杀。孙权见此，于是以张温与暨艳、徐彪等人多有来往而下罪张温，后更将张温发还到家乡吴郡。将军骆统曾上书为张温辩解，但孙权不理会。六年后，张温病逝。",
  lisu: "李肃（？－192年），五原（治今内蒙古包头西北）人。永汉三年四月，司徒王允、尚书仆射士孙瑞、卓将吕布共谋诛卓。是时，天子有疾新愈，大会未央殿。布使同郡骑都尉肃等、将亲兵十馀人，伪著卫士服守掖门。布怀诏书。卓至，肃等格卓。卓惊呼布所在。布曰“有诏”，遂杀卓，夷三族。后卓女婿中郎将牛辅典兵别屯陕，分遣校尉李傕、郭汜、张济略陈留、颍川诸县。卓死，吕布使李肃至陕，欲以诏命诛辅。辅等逆与肃战，肃败走弘农，布诛肃。",
  xinpi: "辛毗（生卒年不详），字佐治，颍川阳翟人。三国时期曹魏大臣。原居陇西（郡治在今甘肃临洮县），东汉光武帝建武年间，其先人东迁。当初，辛毗跟随其兄事袁绍。曹操任司空时，征召辛毗，他不受命。官渡战后，辛毗事袁绍的儿子袁谭。公元204年，曹操攻下邺城，上表推荐辛毗任议郎，后为丞相长史。公元220年，曹丕即皇帝位，以辛毗为侍中，赐爵关内侯，后赐广平亭侯。魏明帝即位，封辛毗颍乡侯，食邑三百户，后为卫尉。公元234年，诸葛亮屯兵渭南，司马懿上表魏明帝。魏明帝任辛毗为大将军军师，加使持节号。诸葛亮病逝后，辛毗返回，仍任卫尉。不久，逝世，谥肃侯。",
  liuzan: "字正明，会稽长山人人，曾任左护军，有两子：留略、留平。少为会稽郡吏，曾参与镇压黄巾起义，后被东吴大将凌统所引用，任屯骑校尉。吴五凤二年（公元255年）留赞任左护军，随孙峻征淮南，因病撤军，被魏将蒋班围困于道，力战而死，时年73岁。",
  zhujun: "朱儁（？－195年），字公伟。会稽郡上虞县（今浙江绍兴上虞区）人。东汉末年名将。朱儁出身寒门，赡养母亲，以好义轻财闻名，受乡里敬重。后被太守徐珪举为孝廉，任兰陵令，颇有治绩。再升任交州刺史，以家兵五千大破叛军，平定交州。战后以功封都亭侯，入朝为谏议大夫。光和七年（184年），黄巾起义爆发，朱儁以右中郎将、持节平定三郡之地，以功进封西乡侯，迁镇贼中郎将。又率军讨平黄巾，“威声满天下”。中平二年（185年），进拜右车骑将军，更封钱塘侯。后为河内太守，击退进逼的张燕。权臣董卓秉政时，想任朱儁为副手，遭其婉拒。其后出逃荆州，更屯军中牟，徐州刺史陶谦等欲推举他为太师，并传檄各州牧伯，相邀讨伐李傕、奉迎天子。但朱儁却奉诏入京任太仆。初平三年（192年），升任太尉、录尚书事。兴平元年（194年），行骠骑将军事，持节镇关东，因故未成行。兴平二年（195年），李傕与郭汜相互攻杀，郭汜扣留朱儁作为人质。朱儁性格刚烈，即日发病而死。",
  liuhong: "汉灵帝刘宏（157年，一作156年－189年5月13日），生于冀州河间国（今河北深州）。东汉第十二位皇帝（168年－189年在位），汉章帝刘炟的玄孙。刘宏早年世袭解渎亭侯。永康元年（167年）十二月，汉桓帝刘志逝世，刘宏被外戚窦氏挑选为皇位继承人，于建宁元年（168年）正月即位。刘宏在位的大部分时期，施行党锢及宦官政治。他又设置西园，巧立名目搜刮钱财，甚至卖官鬻爵以用于自己享乐。在位晚期，爆发了黄巾起义，而凉州等地也陷入持续动乱之中。中平六年（189年），刘宏去世，谥号孝灵皇帝，葬于文陵。刘宏喜好辞赋，作有《皇羲篇》、《追德赋》、《令仪颂》、《招商歌》等。",
  wangrong: "汉灵怀皇后王荣（？~181年），赵国邯郸（今河北邯郸市）人。五官中郎将王苞孙女，汉灵帝刘宏妃子，汉献帝刘协生母。初以良家子选入掖庭，封为美人，服侍汉灵帝。光和四年（181年），生下陈留王刘协，惨遭灵思皇后毒杀。王荣死后，汉灵帝曾作《追德赋》、《令仪颂》。永汉元年（189年），其子刘协即位，是为汉献帝，追谥灵怀皇后，葬于文昭陵。",
  hanfu: "韩馥（？—191年），字文节，颍川郡（今河南禹州）人。东汉末年的诸侯，冀州牧。韩馥担任过东汉的御史中丞，之后被董卓举荐为冀州牧；在各诸侯起兵讨伐董卓时，韩馥也是其中之一的参与者。韩馥与袁绍也曾经有意立刘虞为皇帝。当时冀州民殷人盛，兵粮优足，于是袁绍便用计夺取冀州，韩馥被迫投靠张邈；之后张邈与袁绍的使者见面，韩馥以为是要来杀害自己的，于是在厕所中以刻书用的小刀自杀。",
  zhaozhong: "赵忠（？—189年），安平人，东汉末年宦官，赵延之兄。桓帝、灵帝时，历为小黄门、中常侍、大长秋、车骑将军等职，封都乡侯。在职时以搜刮暴敛、骄纵贪婪见称，灵帝极为宠信，常谓“赵常侍是我母”。中平六年（189年），何进谋诛宦官，事泄，他和其余几个常侍设计伏杀何进，袁绍、袁术等人闻何进被杀，入宫杀尽宦官，后捕杀赵忠。",
  caosong: "曹嵩（？—194年），字巨高，沛郡谯县（今安徽省亳州市）人。东汉大臣，大长秋曹腾的养子，曹操之父亲。门荫入仕，历任司隶校尉、鸿胪卿、大司农，位列九卿，位高权重。中平四年（187年），靠着贿赂中官，出任太尉，位列三公。中平五年（188年），受累于黄巾之乱，坐罪免官。兴平元年（194年），投奔兖州牧曹操，遇害于徐州。延康元年（220年），追尊魏国太王。曹魏建立后，追尊皇帝，谥号为太。",
  liangxing: "梁兴（？-212年），武威郡姑臧人也，东汉末年凉州军阀之一。与张横、贾诩、段煨是同乡，曾斩杀李傕。建安十六年，同韩遂、马超联合，起兵反抗曹操。梁兴率步骑五千夜袭曹军先头部队徐晃，被击退。联军战败后，梁兴逃到蓝田，劫掠周围郡县。夏侯渊进攻蓝田联合郑浑征讨梁兴，梁兴战败，不知所终。",
  zhangmiao: "张邈（？－195年），字孟卓，东平寿张（今山东东平县）人。东汉大臣、名士，“八厨”之一。举孝廉出身，授骑都尉，出任陈留太守。参与讨伐董卓，参加汴水之战，归附于曹操。兴平元年（194年），趁着曹操讨伐徐州牧陶谦，联合陈宫发动叛乱，迎立吕布为兖州牧。受到曹操讨伐，兵败投奔徐州牧刘备。兴平二年，张邈向袁术借兵途中，被部下所杀。",
  duanwei: "段煨（？～209年），字忠明，武威郡姑臧（今甘肃省武威市）人也。东汉末年将领，东汉太尉段颎同族兄弟，与太尉贾诩、张济、宣威侯张绣乃是同乡。原为董卓帐下将领，奉命屯兵华阴，勤劳农业。兴平二年（195年），迎接汉献帝刘协东归洛阳，供给衣食补给，与护驾将领杨定不和，引发激战十余天，听从汉献帝刘协劝解。东汉建安三年（198年），攻打黄白城，击杀李傕，夷其三族，封为镇远将军、闅乡亭侯、北地太守，累迁大鸿胪、金光禄大夫。建安十四年（209年），寿终正寝。",
  zhangheng: "张横，生卒年不详，武威郡姑臧人，东汉末年凉州军阀之一。与梁兴、贾诩、段煨乃是同乡。建安三年（198），张横与梁兴、段煨等斩杀李傕。十六年（211），同韩遂、马超联合，起兵反抗曹操，兵败后不知所终。",
  wenqin: "文钦（？~258年），字仲若，沛国谯郡（今安徽省亳州市）人，三国时期曹魏将领，曹操部将文稷之子。魏明帝太和年间文钦任牙门将、五营校督，后拜庐江太守、冠军将军，嘉平元年（249年），曹爽及其同党在高平陵之变中被杀，文钦心中不安，执政的司马氏集团为了安抚文钦，升其为前将军、扬州刺史，任职期间结交镇东将军毌丘俭。击退吴国太傅诸葛恪进攻，取得一定战果。正元二年（255年），文钦与镇东将军毌丘俭在扬州起兵讨伐司马师，兵败后投奔吴国，被封为镇北大将军、幽州牧，封谯侯。甘露二年（257年），文钦随吴军援救起兵反抗司马氏的诸葛诞，此后因被司马昭大军围困，军情告急，文钦与诸葛诞本就有矛盾，对文钦日益不满的诸葛诞遂将文钦杀死。淮南平定之后，文钦遗体被其二子收敛安葬。",
  qiuliju: "丘力居，东汉末年的辽西乌丸大人。拉拢中山太守张纯反叛东汉，寇略青、徐、幽、冀四州，杀略吏民。死时认为儿子楼班年幼，于是让从子蹋顿总摄三王部。",
  liuba: "刘巴（？－222年），字子初，荆州零陵郡烝阳县（今湖南省衡阳县、邵东县一带）人，东汉末年至三国时期蜀汉时期官员、名士。刘巴少知名，荆州牧刘表多次征用推举，刘巴均不应就。曹操征伐荆州，荆州士人多归刘备，刘巴却北上投靠曹操。后受曹操命令招降荆南三郡，不料先为刘备所得，刘巴不能复命曹操，遂远至交趾，又辗转进入益州。刘备平定益州后，刘巴归附刘备，为左将军西曹掾，法正死后接任尚书令。章武二年（222年）去世。刘巴博学多才，为刘备解决入蜀后的财政困难问题，又与诸葛亮等共制蜀汉的法律文件《蜀科》。为人简朴清高，退无私交，曹魏大臣陈群甚敬重之。所著录于《刘令君集》。",
  pengyang: "彭羕（184年－220年），字永年，广汉（今四川广汉北）人。东汉末年官吏。彭羕起初在益州任书佐，但后来其他人向益州牧刘璋诽谤他，刘璋于是以“髡钳”（剃去头发和胡须，并戴上刑具）处罚他，并且贬奴隶。此时刘备入蜀，彭羕想投靠刘备，于是去见庞统。庞统和他会面后很欣赏他，而法正亦很清楚彭羕，于是二人共同向刘备推荐彭羕。刘备多次命令彭羕传递军情和指示给诸将，表现都十分满意，日渐被赏识。刘备入主益州，领益州牧后就任命他为治州从事。彭羕见此，又变得嚣张自矜，诸葛亮对他礼待但心中并不喜欢他，多次密告刘备，说彭羕“心大志广，难可保安”。刘备见诸葛亮这样说，决定疏远彭羕，又观察他行事，于是贬他为江阳太守。彭羕见将被派往外地，心感不悦，与马超见面时又曾对他说“老革荒悖，可复道邪！”“卿为其外，我为其内，天下不足定也。”马超听后大惊，彭羕走后以他的说话告发彭羕，彭羕于是被收监下狱。最后彭羕被处死，死时三十七岁。",
  dongxie: "董卓之女，牛辅之妻。在《三国群英传》中名为董宜，在电视剧《三国群英会之吕布与貂蝉》中名为董媛。",
  caoanmin: "曹安民（？-197年），沛国谯县（今安徽亳州）人，字安民。东汉时期人物，曹德之子，曹操之侄，曹昂的堂兄弟，曹丕的堂兄，死于宛城之战。按曹丕《典论》记载的“亡兄孝廉子脩、从兄安民遇害。”等情况来看，安民应该是曹操侄子错不了，曹丕是他们属于兄弟关系肯定不会弄错。另外从典论的记载来看安民是和子脩并提的，子脩是曹昂的字，安民则肯定也是字不是名，至于三国志中记载则应取自曹丕之《典论》但陈寿又不知曹安民其名，故写为“长子昂、弟子安民”。",
  dufuren: "杜夫人（生卒年不详），东汉末年至三国时人。有异色，原为吕布将秦宜禄之妻，生子秦朗。后为曹操纳为妾，又生曹林、曹衮、金乡公主。",
  mifangfushiren: "糜芳（生卒年不详），字子方，东海郡朐县（今江苏省连云港市）人。汉末三国时期蜀国将领，刘备糜夫人的兄弟。糜芳本为徐州牧陶谦部下，曾被曹操表为彭城相。后来辞官，随刘备从徐州辗转至邺城、汝南、新野、长坂坡、江夏等地，奔波多年。傅士仁（生卒年不详），字君义，幽州广阳郡（今北京市）人，刘备手下将领。受到刘备的重用，但被关羽轻慢。<br>刘备称汉中王时，糜芳为南郡太守，但受到关羽的轻慢。后来，因未完成供给军资的任务而被关羽责骂，心中不安。吕蒙袭取荆州时，将已经投降的傅士仁展示给糜芳，糜芳于是选择投降，导致关羽兵败被杀。此后，在吴国担任将军，并且为吴征伐。",
  tongyuan: "童渊，字雄付，武术名家，与并州李彦是结拜兄弟，两人均师承义父玉真子，两人分别娶了河北颜家的两位大小姐颜云、颜雨。童飞之父，有张任、张绣为入室弟子，晚年收赵云为关门弟子，传其毕生所学。其成名技为“百鸟朝凤枪”。童渊是南方苏州评话三国中的原创人物，在历史中以及《三国演义》中并不存在。",
  //zhangning:'张宁，东汉末年大贤良师张角的女儿。自幼学习太平道法，掌握天地法则。',
  xinping: "辛评（？－204年），字仲治，颍川阳翟人，东汉末年人物。曹魏卫尉辛毗之兄。原是韩馥部下，韩馥逃亡后转而辅佐袁绍。袁绍死后，辛评、郭图欲立袁谭为主，与审配等不和。后来曹操破邺，其弟辛毗在城下劝降。审配怒遣手下将辛评全家杀害。",
  hanmeng: "韩猛，又名韩若、韩荀、韩泣（上荀下大） ，东汉末年袁绍帐下名将，或与《曹瞒传》所言韩莒子为同一人。公元200年，官渡之战爆发。袁绍派遣韩猛劫掠曹操军的西道，被曹军部将曹仁击破于鸡洛山。袁绍又派韩猛前去运送粮车，因为轻敌被曹军部将徐晃、史涣击退。",
  yanfuren: "《三国志》中东汉末年著名武将吕布有一妻子，但姓名未载于史书，或为魏续的姐妹魏氏。在李傕郭汜之乱期间曾受困，幸亏被庞舒所救，私藏于府中而得以幸免。吕布被曹操围困时，反对陈宫的计谋，导致了吕布的失败。《三国演义》中，姓严，通称严夫人，和吕布生有一女欲嫁于袁术之子，未果，吕布失败后与其女一同送往许昌。",
  haomeng: "郝萌（？－196年），东汉末年吕布帐下名将。建安元年（196年），郝萌在袁术的怂恿下反叛吕布，曾一度打得吕布躲入厕所。后来，被吕布部将高顺所阻，其部将曹性临阵反叛，最终被高顺所杀。在小说《三国演义》中，吕布被围下邳时，郝萌护送许汜王楷回城时，被张飞擒获，被曹操所杀。",
  licaiwei: "李采薇，生卒年不详，汉末将领庞德之妻，庞会之母。襄樊之战时，庞德任先锋，随于禁率军增援驻守樊城的曹仁。出战前，他将妻子李采薇与年仅六岁的儿子庞会叫来面前，对李采薇说：“吾今为先锋，义当效死疆场。我若死，汝好生看养吾儿。吾儿有异相，长大必当与吾报仇也。”李采薇闻言，与儿子痛哭送别庞德。她知道丈夫已下定决心，若无法胜利归还则必当战死沙场，绝不会投降求生。其后前线果然传来消息：魏军全军覆没，于禁投降，庞德誓死不降被关羽所杀。其子庞会自幼丧父，由母亲抚养长大。成年后，庞会性格勇烈，有先父之风。他多次立下战功，深受魏文帝曹丕的喜爱。后来庞会随钟会、邓艾伐蜀，成都城破之后，尽灭关氏家以报父仇。",
  yanrou: "阎柔（生卒年不详），燕国广阳（今北京市附近）人。三国时期曹魏名将。年少时曾被乌丸、鲜卑俘虏，后来却得到他们的信任。刘虞死后，阎柔被鲜于辅等推举为乌丸司马，联系鲜卑为刘虞报仇，和公孙瓒对抗。在官渡之战时归曹操，拜护乌丸校尉，对曹操讨伐乌丸有功，赐爵关内侯。曹操待其如子，曹丕也视其如亲兄弟，阎柔坐镇北方，统帅幽州兵马，抗击胡人的入侵。曹丕即位后，阎柔被拜为度辽将军。",
  qinyilu: "秦宜禄（？—200年），并州云中郡云中县人（今内蒙古自治区呼和浩特市托克托县古城镇）。东汉军阀吕布的部将。吕布战败后归降曹操，后为张飞所杀。",
  fengfang: "冯方，其字不详，司隶人。初掌校事，监察京师及周边地区，刺探文武百官秘事。十常侍之乱后，董卓进京，掌控朝政。冯方认为他胸怀不臣之心，于是弃官携女儿冯妤至江南避祸。其后董卓果然乱政，京师之地生灵涂炭，更将洛阳付之一炬。冯方因其先见之明得以保全家人。<br>冯妤长大成人后，有倾国之貌。一日袁术登城观景，得见冯妤，心中非常喜欢，于是将其纳为夫人。冯方心忧自家女儿不谙世事，于是将可以让人更显妩媚的家传宝梳交给她，希望能借此使其获得袁术的宠爱。其后果然传来袁术偏爱冯夫人的消息，冯方因此宽心，接受了袁术的征辟，为其效力。然而好景不长，没过多久，冯妤自缢身亡的消息传出，冯方悲愤不已，弃官而走，自此销声匿迹。",
  bianxi: "小说《三国演义》里的人物。汜水关守将，并州人氏。原是黄巾余党，后投曹操，拨来守汜水关。善使流星锤。在镇国寺设下伏兵欲谋害千里寻兄的关羽，但是寺中僧人普净暗示加以解救。最后被关羽斩杀。",
  niufu: "牛辅，东汉末年武将，东汉相国董卓的女婿。曾任中郎将，征讨白波军，不能取胜。董卓被杀时，牛辅别屯于陕地。吕布派李肃前去征讨牛辅，被牛辅击败。后来，牛辅营中有士兵半夜背叛出逃，造成内乱，牛辅以为整营皆叛，于是带着金银珠宝，独与亲信胡赤儿等五六人逾城北渡河。赤儿等人以绳索系在牛辅腰间将其从城头放下，但赤儿等因为谋财而在离地面数丈高的地方就松开了绳子使得牛辅重重摔在地上腰部受伤，而后赤儿与诸胡人将牛辅斩首，将其首级送去长安。",
  wangwei: "王威，东汉末年人。荆州刺史刘表部下将领，乃忠义之士。刘表亡后，刘琮投降曹操，王威向刘琮献计偷袭曹操，刘琮没有采纳。小说《三国演义》中，曹操表刘琮为青州刺史，使远离故乡，时只有王威追随，曹操复遣于禁追杀刘琮等人，王威亦于乱军中殉主。",
  liyixiejing: "李异（生卒年不详），三国时吴将领，曾随陆逊大败蜀军。谢旌（生卒年不详），三国时期吴国名将，会稽（今属浙江）人。建安末，李异与谢旌率水陆三千，破蜀将詹晏、陈凤。刘备领兵攻孙权，李异与陆议等屯巫、秭归，为蜀将所破。黄武元年（222），陆逊破刘备于猇亭，他追踪蜀军，屯驻南山。建安二十四年，陆逊击败关羽后，遣李异、谢旌二人将水陆军三千，进攻蜀将詹晏、陈凤。李异率水军，谢旌率陆军，于险要之地设防，击败詹晏，生擒陈凤。其后进攻房陵太守邓辅、南乡太守郭睦，大破之。又攻秭归大姓文布、邓凯等所合夷兵数千人，大胜，文布、邓凯落荒而逃。在《三国演义》中，两人为孙桓麾下部将，皆有“万夫不当之勇”。刘备攻吴时，谢旌迎战张苞，不敌败走。李异接战，被关兴所斩。次日，谢旌于乱军中被张苞一矛刺死。",
  shiyi: "是仪（生卒年不详），本名氏仪，字子羽，北海郡营陵县（今山东昌乐）人，三国时期吴国官员。仕东汉、东吴两朝，早年曾在本县营陵县及本郡北海郡任官，后在东吴历任骑都尉、忠义校尉、裨将军、偏将军、侍中、中执法、尚书仆射等官。先封都亭侯，后进封都乡侯。年八十一岁时病逝，死前要求节葬。",
  sunlang: "孙狼（生卒年不详），东汉末农民起义军首领。建安二十三年（218）陆浑（今河南嵩县东北）县长张固发民服徭役，百姓惶俱，狼等乘机发动起义，杀县主簿，攻破县城，后南下投奔蜀将关羽。",
  sp_jiaxu: "字文和，武威姑臧人。三国时期魏国著名谋士。曾先后担任三国军阀李傕、张绣、曹操的谋士。官至魏国太尉，谥曰肃侯。",
  sunhuan: "孙桓（198年－223年），字叔武，吴郡富春（今浙江杭州富阳区）人，三国时期吴国建武将军。孙河第三子。仪容端正，器怀聪明，博学强记，能论议应对，孙权常称为“宗室颜渊”。初擢为武卫都尉。建安二十四年（219年），参与由吕蒙指挥的袭击荆州行动，从讨关羽于华容，招揽关羽余众，得五千人以及大量牛马器械。黄武元年（222年），孙桓二十五岁，拜安东中郎将，跟随陆逊抗击进攻东吴的刘备。当时刘备率领众多兵众进攻，满山都是蜀军，孙桓奋战，与陆逊等协力击破蜀军。刘备兵败逃走，孙桓截击，“斩上夔道，扼要径”，差点生擒刘备。战后孙桓因功拜建武将军，封丹徒侯，督牛渚，修筑横江坞，期间逝世。",
  guānning: "关宁，《三国演义》的虚构人物，为关定之子，关平的哥哥，学文。关羽前往冀州寻找刘备时曾居于关定庄，关定命关宁、关平二子出拜。后关羽同刘备回到关定庄时，关羽向刘备介绍关宁、关平二人，关定即提出让关平拜关羽为义父。",
  mushun: "穆顺，小说《三国演义》中的人物，男，东汉末宦官。献帝欲修书与国舅伏完，共谋图曹公。因顺为宦官中之忠义可托者，乃命顺往送书。顺藏书于发中，潜出禁宫，径至完宅，将书呈上。及完回书付顺，顺乃藏于头髻内，辞完回宫。然公闻信，先于宫门等候，顺回遇公，公喝左右，遍搜身上，并无夹带，放行。忽然风吹落其帽。公又唤回，取帽视之，遍观无物，还帽令戴。顺双手倒戴其帽。公心疑，令左右搜其头发中，搜出伏完书来。公见书大怒，执下顺于密室问之，顺不肯招。当晚将顺、完等宗族二百余口，皆斩于市。",
  jsp_guanyu: "关羽，字云长。曾水淹七军、擒于禁、斩庞德、威震华夏，吓得曹操差点迁都躲避，但是东吴偷袭荆州，关羽兵败被害。后传说吕蒙因关羽之魂索命而死。",
  chezhou: "车胄（？－199年至200年），东汉末年武将，为曹操所置徐州刺史。建安四年，左将军刘备率军出征，前往下邳，于同年或次年杀死车胄。",
  hansong: "韩嵩（生卒年不详），字德高，南阳人。少好学，贫不改操。不应三公辟命，与同好数人隐居郦西山中。后担任刘表手下的别驾，转为从事中郎。出使许都，被拜为侍中，迁零陵太守。建安十三年（208年），韩嵩与蒯越、傅巽劝刘琮降曹。曹操平定荆州后，拜韩嵩为大鸿胪。",
  matie: "马铁（？－212年），扶风茂陵（今陕西兴平）人。马腾之子，马超之弟。马腾遭韩遂进攻，乃携马铁等入京受职。马铁被封为骑都尉。后在邺城居住。因其兄马超反曹而被曹操夷灭。"
};
const characterFilters = {
  chunyuqiong(mode) {
    return mode != "identity" && mode != "guozhan";
  },
  sp_xuyou(mode) {
    return mode == "versus" && ["guandu", "4v4", "four"].includes(_status.mode);
  }
};
const dynamicTranslates = {
  starchongzu(player) {
    if (player.getStorage("starchongzu", false)) {
      return lib.translate["starchongzu_rewrite_info"];
    }
    return lib.translate["starchongzu_info"];
  },
  mubing(player) {
    if (player.storage.mubing2) {
      return "出牌阶段开始时，你可以亮出牌堆顶的四张牌。你可弃置任意张手牌，并可获得任意张点数之和不大于你弃置的牌点数之和的牌。然后你可将以此法得到的牌以任意方式交给其他角色。";
    }
    return "出牌阶段开始时，你可以亮出牌堆顶的三张牌。你可弃置任意张手牌，并可获得任意张点数之和不大于你弃置的牌点数之和的牌。";
  },
  piaoping(player) {
    const bool = player.storage.piaoping;
    let yang = "你摸X张牌", yin = "你弃置X张牌";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技，锁定技。当你使用一张牌时，", end = "（X为你本阶段内发动过〖漂萍〗的次数且至多等于你的体力值）。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  zhuili(player) {
    if (!player.hasSkill("piaoping", null, null, false)) {
      return "锁定技。当你成为其他角色使用黑色牌的目标后，若你的〖漂萍〗：处于阳状态，则你将〖漂萍〗转换至阴状态；处于阴状态，则你令〖托献〗发动次数+1，然后若〖托献〗发动次数大于3，则〖惴栗〗于本回合内失效。";
    }
    if (player.storage.piaoping) {
      return '锁定技。当你成为其他角色使用黑色牌的目标后，若你的〖漂萍〗：<span class="bluetext">处于阳状态，则你将〖漂萍〗转换至阴状态；</span>处于阴状态，则你令〖托献〗发动次数+1，然后若〖托献〗发动次数大于3，则〖惴栗〗于本回合内失效。';
    }
    return '锁定技。当你成为其他角色使用黑色牌的目标后，若你的〖漂萍〗：处于阳状态，则你将〖漂萍〗转换至阴状态；<span class="bluetext">处于阴状态，则你令〖托献〗发动次数+1，然后若〖托献〗发动次数大于3，则〖惴栗〗于本回合内失效。</span>';
  },
  dcdouzhen(player) {
    const bool = player.countMark("dcdouzhen") % 2;
    let yang = "黑色基本牌均视为【决斗】，你的回合内：当你使用非转化且对应的实体牌为一张黑色基本牌的【决斗】时，你获得目标角色各一张牌并获得1枚“☯”", yin = "红色基本牌均视为无次数限制的普【杀】，你的回合内：当你使用或打出非转化且对应的实体牌为一张红色基本牌的【杀】时，你获得1枚“☯”";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "锁定技。转换技。你的", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  }
};
const perfectPairs = {};
const voices = {
  "#starweigu1": "进退皆死路，唯有一战尔！",
  "#starweigu2": "前有狼虎，后无归乡，唯以命相搏！",
  "#starjuefa1": "天意高难问，人事尽可为！",
  "#starjuefa2": "我本无根客，更何惜此头！",
  "#star_xiahouba:die": "我如无根之萍，不知埋骨何处。",
  "#yanjiu1": "喝喝喝！就知道喝！",
  "#yanjiu2": "这入喉的酒，就是穿肠的药！",
  "#poyin1": "黑厮不讲情面！哪有不吃酒还要被罚的道理！",
  "#poyin2": "适才服了汤药，医嘱不可饮酒~",
  "#caobao:die": "俺不敢啦！俺不敢啦！",
  "#starxisong1": "一目十行，速而不漏，博而不杂。",
  "#starxisong2": "张目可阅三千牍，弹舌能辨二百误！",
  "#starfanglang1": "吾当牵黄擎苍，猎尽天下伪君子面皮！",
  "#starfanglang2": "掷靴投铜鹤，呼尔莫上船！",
  "#star_zhangsong:die": "刘季玉！你也配某一声主公！",
  "#dcyuzheng1": "文王贤誉天下，犹知不可为众矢之的。",
  "#dcyuzheng2": "袁公路，汝当真要冒天下之大不韪吗？",
  "#dcyxsuishi1": "孙伯符，汝当真要作忘恩负义之徒吗？",
  "#dcyxsuishi2": "养虎不羁，饲者必成虎口之伥。",
  "#dc_yanxiang:die": "我等要皆为阶下囚了！",
  "#starjunxi1": "进亦死，退亦死，向死而生可乎！",
  "#starjunxi2": "与其坐以待毙，何不放手一搏！",
  "#starjixian1": "卸甲疾行，敌虽远亦一夕可至。",
  "#starjixian2": "用兵如水，无常势亦无常形。",
  "#star_zhanghe:die": "佞臣之言，猛于蛇虎。",
  "#dcyinbi1": "凤不栖枯木，君子不居危墙。",
  "#dcyinbi2": "君不见，多少江鲫作了俎上脍。",
  "#dcshuaiyan1": "将军拥众十万，安能坐观豪杰并争？",
  "#dcshuaiyan2": "我为将军计，不若举州以附曹公。",
  "#hansong:die": "刘景升外宽内忌，非明主。",
  "#starjizhan1": "为将者，不可失其勇！",
  "#starjizhan2": "阵前休得啰嗦，哪个敢来领死？",
  "#starcuxia1": "本将纵横幽冀，不知何为敌手！",
  "#starcuxia2": "兀那长须贼将，脸红什么！",
  "#star_yanliang:die": "来将可是关，啊！",
  "#dczijue1": "恨朱紫有价，怨寒门无阶。",
  "#dczijue2": "吾一腔才学，不当五百万钱否? ",
  "#dcchibi1": "凉州鄙夫，安敢立马君前! ",
  "#dcchibi2": "退! 退! 退! ",
  "#cuilie:die": "唉，尔以吾为瞽叟也。",
  "#starzhenting1": "臣者，国之股肱，君所倚仗也。",
  "#starzhenting2": "忠臣事君，当鞠躬尽瘁，死而后已。",
  "#starchiguo1": "国之兴亡，匹夫有责，况吾等尚食君禄。",
  "#starchiguo2": "益州疲弊，非忠志之士不可持之。",
  "#star_jiangwan:die": "琬无功于国，愧负丞相重托。",
  "#zhuiji_matie1": "伏波之裔，岂惧险地。",
  "#zhuiji_matie2": "纵龙潭虎穴在前，吾亦不惧半分。",
  "#dcquxian1": "策马赴国难，醉卧青山头。",
  "#dcquxian2": "曹贼坐据之处，建功立业之途。",
  "#matie:die": "铁视死如归，无憾！",
  "#starchongwei1": "敌聚如蝗，不可等闲视之。",
  "#starchongwei2": "贼围甚密，唯乘夜伺隙。",
  "#starchongzu1": "黄天已死，北海当立！",
  "#starchongzu2": "三日练靶，今日便穿汝喉舌！",
  "#star_taishici:die": "士为知已者死，何憾之有？",
  "#dcshefu1": "刘备！你一介织鞋贩夫，凭什么在这耀武扬威呀？",
  "#dcshefu2": "爷们水里进火里出，是响当当的铁汉子，硬骨头！",
  "#dcpigua1": "今日披挂上阵，定要斩关羽，诛张飞！",
  "#dcpigua2": "坚城在握，你刘玄德又奈我何？",
  "#chezhou:die": "玄德兄，适才相戏耳。",
  "#starlianzhan1": "敌虽众，于我如浮云！",
  "#starlianzhan2": "先斩那白马，再擒他公孙瓒！",
  "#starweiming1": "既知本将在此，安敢引兵来犯！",
  "#starweiming2": "前番饶过尔等，此番却又来找死！",
  "#star_wenchou:die": "今日之败，实在是天意弄人啊！",
  "#starduhai1": "朝堂好似大染缸，进来了，休想清白出去！",
  "#starduhai2": "后生，你也配打咱家主意？",
  "#starlingse1": "陛下尚唤咱家一声阿耶，你怎得张不开嘴？",
  "#starlingse2": "这宫里的水深的很，你呀，把握不住！",
  "#star_zhangrang:die": "先皇呀，小陛下他拿咱不当人！",
  "#stardangchen1": "举帆据徐塘，寒夜荡敌尘！",
  "#stardangchen2": "无恃敌之不至，恃吾有以胜之！",
  "#starjianyu1": "綝友党甚盛，当翦羽而后诛之。",
  "#starjianyu2": "奉虽不能吏书，犹怀一腔忠胆！",
  "#star_dingfeng:die": "野豕入营，此凶征也。",
  "#starzhongyan1": "千夫诺诺，不如一士谔谔。",
  "#starzhongyan2": "忠言如药，苦口而利身。",
  "#starjinglun1": "腹有珠玑，可坠在殿之玉盘。",
  "#starjinglun2": "胸纳百川，当汇凌日之沧海。",
  "#star_zhangzhao:die": "曹公虎豹也，不如以礼早降。",
  "#starzhiji1": "筹谋部划，知天机，行人事。",
  "#starzhiji2": "渊孤军出寨，可一鼓击之。",
  "#staranji1": "兵法谙熟于胸，今乃施为之时。",
  "#staranji2": "我军待时而动，以有备击不备。",
  "#star_fazheng:die": "我当为君之子房，奈何命寿将尽。",
  "#staranshu1": "与民休养生息，则国可得安泰。",
  "#staranshu2": "春种其粟，秋得其实。",
  "#starkuangzuo1": "吾辈向汉，当矢志不渝，不可坐视神州陆沉。",
  "#starkuangzuo2": "家国兴衰，系于一肩之上，朝纲待重整之时。",
  "#starchengfeng1": "承天子之任，奉天子之统。",
  "#starchengfeng2": "臣簇于君侧，为耳目，为股肱。",
  "#star_xunyu:die": "臣固忠于国，非一家之臣。",
  "#mpjianlin1": "吾性至俭，不能自奉，何况遗人？",
  "#mpjianlin2": "以财自污，则免清高之祸。",
  "#mpsixiao1": "风木之悲，痛彻肺腑。",
  "#mpsixiao2": "外容毁悴，内心神伤。",
  "#mp_wangrong:die": "自阮、嵇云亡，为世所羁，实有所叹……",
  "#starliangyan1": "佳燕并头语，不恋雕梁而归于万里。",
  "#starliangyan2": "灵禽非醴泉不饮，非积善之家不栖。",
  "#starminghui1": "大智若愚，女子之锦绣常隐于华服。",
  "#starminghui2": "知者不惑，心有明镜以照人。",
  "#star_zhangchunhua:die": "我何为也，竟称可憎之老物？",
  "#xiongsuan1": "朝中无一是男儿，谁敢拦我二人！",
  "#xiongsuan2": "挟持天子，执掌重兵，天下可图！",
  "#liqueguosi:die": "文和之言，诚不欺我……",
  "#starxiaoyan1": "万军付薪柴，戾火燃苍穹。",
  "#starxiaoyan2": "九州硝烟起，烽火灼铁衣。",
  "#starzongshi1": "四世三公之家，当为天下之望。",
  "#starzongshi2": "大势在我，可怀问鼎之心。",
  "#starjiaowang1": "剑顾四野，马踏青山，今谁堪敌手？",
  "#starjiaowang2": "并土四州，带甲百万，吾可居大否？",
  "#staraoshi1": "无傲骨近于鄙夫，有傲心方为君子。",
  "#staraoshi2": "得志则喜，临富贵如何不骄？",
  "#star_yuanshao:die": "骄兵必败，奈何不记前辙……",
  "#starweilin1": "今吾入京城，欲寻人而食。",
  "#starweilin2": "天下事在我，我今为之，谁敢不从？",
  "#starzhangrong1": "尔欲行大事，问过吾掌中兵刃否？",
  "#starzhangrong2": "西凉铁骑曳城，天下高楼可摧！",
  "#starhaoshou1": "满朝诸公，视吾剑不利否？",
  "#starhaoshou2": "顺我者生，逆我者十死无生！",
  "#star_dongzhuo:die": "美人迷人眼，溢权昏人智……",
  "#starcanxi1": "大势散于天下，全宝玺者其谁？",
  "#starcanxi2": "汉祚已僵待死，吾可取而代之。",
  "#starpizhi1": "春秋无义，秉笔汗青者，胜者尔。",
  "#starpizhi2": "大厦将倾，居危墙之下者，愚夫尔。",
  "#starzhonggu1": "既登九五之尊位，何惧为冢中之枯骨？",
  "#starzhonggu2": "天下英雄多矣，大浪淘沙，谁不老冢中？",
  "#star_yuanshu:die": "英雄不死则已，死则举大名尔……",
  "#starsujun1": "将为军魂，需以身作则。",
  "#starsujun2": "整肃三军，可育虎贲。",
  "#starlifeng1": "锋出百砺，健卒亦如是。",
  "#starlifeng2": "强军者，必校之以三九，练之三伏。",
  "#star_caoren:die": "濡须之败，此生之耻……",
  "#mpjiusong1": "大人以天地为一朝，以万期为须臾。",
  "#mpjiusong2": "以天为幕，以地为席！",
  "#mpmaotao1": "痛饮酕醄，醉生梦死！",
  "#mpmaotao2": "杜康既为酒圣，吾定为醉侯！",
  "#mpbishi1": "往矣！吾将曳尾于涂中。",
  "#mpbishi2": "仕途多舛，哪有醉卧山野痛快！",
  "#mp_liuling:die": "哈……呼……（鼾声渐小）",
  "#wusheng_dc_jsp_guanyu1": "以义传魂，以武入圣！",
  "#wusheng_dc_jsp_guanyu2": "义击逆流，武安黎庶。",
  "#dclibang1": "天下熙攘，所为者利尔。",
  "#dclibang2": "我有武力傍身，必可待价而沽。",
  "#dcwujie1": "腹中有粮则脊自直，非节盈之。",
  "#dcwujie2": "气节？可当粟米果腹乎！",
  "#dc_mengda:die": "司马老贼害我，诸葛老贼误我……",
  "#dcxiuwen1": "书生笔下三尺剑，毫锋可杀人。",
  "#dcxiuwen2": "吾以书执剑，可斩世间魍魉。",
  "#dclongsong1": "百家诸子，且听九霄龙吟。",
  "#dclongsong2": "朗朗书声，岂虚于刀斧铮鸣。",
  "#guānning:die": "为国捐生，虽死无憾……",
  "#dcniji1": "善战者后动，一击而毙敌。",
  "#dcniji2": "我所善者，后发制人尔。",
  "#sunhuan:die": "此建功立业之时，奈何……",
  "#dctingxian1": "大争之世，当举兵行义。",
  "#dctingxian2": "聚兵三千众，可为天下先。",
  "#dcbenshi1": "今，或为鱼肉，或为刀俎。",
  "#dcbenshi2": "所征徭者必死，可先斩之。",
  "#sunlang:die": "为关将军死，无憾……",
  "#dccuichuan1": "老臣在，必不使吴垒倾颓。",
  "#dccuichuan2": "舍老朽之躯，擎广厦之柱。",
  "#dczhengxu1": "陛下怜子无序，此取祸之道。",
  "#dczhengxu2": "古语有云，上尊而下卑。",
  "#shiyi:die": "吾故后，务从省约……",
  "#dcdeshi1": "你我素无仇怨，何故欺之太急。",
  "#dcdeshi2": "恃强凌弱，非大丈夫之所为。",
  "#dcwuyuan1": "生为关氏之妇，虽死亦不悔。",
  "#dcwuyuan2": "我夫关长生，乃盖世之英雄。",
  "#dc_hujinding:die": "妾不畏死，唯畏君断情……",
  "#dcdouzhen1": "擂鼓击柝，庆我兄弟凯旋。",
  "#dcdouzhen2": "匹夫欺我江东无人乎。",
  "#liyixiejing:die": "蜀军凶猛，虽力战犹不敌……",
  "#dcjinjian1": "卑微之人，脊中亦有七寸硬骨！",
  "#dcjinjian2": "目不识丁，胸中却含三分浩气！",
  "#dcshizhao1": "并无夹带，阁下多心了。",
  "#dcshizhao2": "将军多虑，顺安有忤逆之心？",
  "#mushun:die": "这，何来的大风？",
  "#dcfuning1": "为国效力，不可逞一时之气。",
  "#dcfuning2": "诸将和睦，方为国家之幸。",
  "#dcbingji1": "权其轻重，而后施令。",
  "#dcbingji2": "罪而后赦，以立恩威。",
  "#dc_zhaoyǎn:die": "背信食言，当有此劫……",
  "#dcruizhan1": "敌势汹汹，当急攻以挫其锐。",
  "#dcruizhan2": "威愿领骑兵千人，以破敌前军。",
  "#dcshilie1": "荆州七郡，亦有怀义之人！",
  "#dcshilie2": "食禄半生，安能弃旧主而去！",
  "#wangwei:die": "后有追兵，主公先行！",
  "#dcchongyi1": "班虽卑微，亦知何为大义。",
  "#dcchongyi2": "大义当头，且助君一臂之力。",
  "#dc_huban:die": "行义而亡，虽死无憾……",
  "#dcxiaoxi1": "夜深枭啼，亡命夺袭！",
  "#dcxiaoxi2": "以夜为幕，纵兵逞凶！",
  "#xiongrao1": "势如熊罴，威震四海！",
  "#xiongrao2": "啸聚熊虎，兔走狐惊！",
  "#niufu:die": "胡儿安敢杀我！",
  "#dunxi1": "看锤！",
  "#dunxi2": "且吃我一锤！",
  "#bianxi:die": "以力破巧，难挡其锋……",
  "#dcditing1": "奉命查验，还请配合。",
  "#dcditing2": "且容我查验一二。",
  "#dcbihuo1": "董卓乱政，京师不可久留。",
  "#dcbihuo2": "权臣当朝，不如早日脱身。",
  "#fengfang:die": "掌控校事，为人所忌……",
  "#piaoping1": "奔波四处，前途未明。",
  "#piaoping2": "辗转各地，功业难寻。",
  "#tuoxian1": "一贵一贱，其情乃见。",
  "#tuoxian2": "一死一生，乃知交情。",
  "#zhuili1": "近况艰难，何不忧愁？",
  "#zhuili2": "形势如此，惴惕难当。",
  "#qinyilu:die": "我竟落得如此下场……",
  "#choutao1": "大恨深仇，此剑讨之！",
  "#choutao2": "是非恩怨，此役决之！",
  "#xiangshu1": "得道多襄，为公是瞻！",
  "#xiangshu2": "愿为中原，永戍北疆！",
  "#yanrou:die": "寒风折戍矛，铁衣裹枯骨……",
  "#dczhanyi1": "以役兴国，战意磅礴！",
  "#dczhanyi2": "此命不已，此战不休！",
  "#dc_zhuling:die": "吾，错付曹公……",
  "#yijiao1": "公呼异教，思汉也已。",
  "#yijiao2": "非我同盟，其心必异。",
  "#qibie1": "忽闻君别，泣下沾襟。",
  "#qibie2": "相与泣别，承其遗志。",
  "#licaiwei:die": "随君而去……",
  "#channi1": "此人心怀叵测，将军当拔剑诛之！",
  "#channi2": "请夫君听妾身之言，勿为小人所误！",
  "#nifu1": "当为贤妻宜室，莫做妒妇祸家。",
  "#nifu2": "将军且往沙场驰骋，妾身自有苟全之法。",
  "#yanfuren:die": "妾身绝不会害将军呀！",
  "#xiongmang1": "力逮千军，唯武为雄！",
  "#xiongmang2": "莽行沙场，乱世称雄！",
  "#haomeng:die": "曹性，汝欲反我不成？",
  "#heqia1": "和洽不基，贵贱无司。",
  "#heqia2": "教化大行，天下和洽。",
  "#yinyi1": "采山饮河，所以养性。",
  "#yinyi2": "隐于鱼梁，率尔休畅。",
  "#re_pangdegong:die": "终无可避。",
  "#jieliang1": "伏兵起，粮道绝！",
  "#jieliang2": "粮草根本，截之破敌！",
  "#quanjiu1": "大敌当前，怎可松懈畅饮？",
  "#quanjiu2": "乌巢重地，不宜饮酒。",
  "#hanmeng:die": "曹操狡诈，防不胜防……",
  "#fuyuan1": "袁门一体，休戚与共。",
  "#fuyuan2": "袁氏荣光，俯仰唯卿。",
  "#zhongjie1": "义士有忠节，可杀不可量！",
  "#zhongjie2": "愿以骨血为饲，事汝君临天下。",
  "#yongdi_xinping1": "袁门当兴，兴在明公！",
  "#yongdi_xinping2": "主公之位，非君莫属。",
  "#xinping:die": "老臣，尽力了……",
  "#tianze1": "观天则，以断人事。",
  "#tianze2": "乾元用九，乃见天则。",
  "#difa1": "地蕴天成，微妙玄通。",
  "#difa2": "观地之法，吉在其中。",
  "#zhangning:die": "全气之地，当葬其止……",
  "#chaofeng1": "鸾凤归巢，百鸟齐鸣。",
  "#chaofeng2": "鸾凤之响，所闻皆朝。",
  "#chuanshu1": "此术不传子，独传于贤。",
  "#chuanshu2": "定倾之术，贤者可习之。",
  "#tongyuan:die": "一门三杰，无憾矣！",
  "#mffengshi_sp_mifangfushiren1": "锋芒之锐，势不可挡！",
  "#mffengshi_sp_mifangfushiren2": "势须砥砺，就其锋芒。",
  "#sp_mifangfushiren:die": "愧对将军……",
  "#gongxiu1": "福祸与共，业山可移。",
  "#gongxiu2": "修行退智，遂之道也。",
  "#jinghe1": "大哉乾元，万物资始。",
  "#jinghe2": "无极之外，复无无极。",
  "#re_nanhualaoxian:die": "道亦有穷时……",
  "#yise1": "明丽端庄，双瞳剪水。",
  "#yise2": "姿色天然，貌若桃李。",
  "#shunshi1": "顺应时运，得保安康。",
  "#shunshi2": "随遇而安，宠辱不惊。",
  "#dufuren:die": "往事云烟，去日苦多……",
  "#xianwei1": "曹家儿郎，何惧一死！",
  "#xianwei2": "此役当战，有死无生！",
  "#caoanmin:die": "伯父快走！",
  "#rehuoshui1": "走不动了嘛？",
  "#rehuoshui2": "别走了，再玩一会儿嘛。",
  "#reqingcheng1": "我和你们真是投缘呐。",
  "#reqingcheng2": "哼，眼睛都直了呀。",
  "#koulve1": "兵强马壮，时出寇略。",
  "#koulve2": "饥则寇略，饱则弃馀。",
  "#qljsuiren1": "就交给你了。",
  "#qljsuiren2": "我的财富，收好！",
  "#qiuliju:die": "乌丸危矣！",
  "#redaoji1": "典韦勇猛，盗戟可除。",
  "#redaoji2": "你的，就是我的。",
  "#fuzhong1": "身负重任，绝无懈怠。",
  "#fuzhong2": "勇冠其军，负重前行。",
  "#re_hucheer:die": "好快的涯角枪！",
  "#xuezhao1": "奉旨行事，莫敢不从？",
  "#xuezhao2": "衣带密诏，当诛曹公！",
  "#re_dongcheng:die": "是谁走漏了风声？",
  "#kangge1": "慷慨悲歌，以抗凶逆。",
  "#kangge2": "忧惶昼夜，抗之以歌。",
  "#jielie1": "节烈之妇，从一而终也！",
  "#jielie2": "清闲贞静，守节整齐。",
  "#tangji:die": "皇天崩兮后土颓……",
  "#dangzai1": "此处有我，休得放肆！",
  "#dangzai2": "退后，让我来！",
  "#liangjue1": "行军者，切不可无粮！",
  "#liangjue2": "粮尽援绝，须另谋出路。",
  "#zhangheng:die": "军粮匮乏……",
  "#langmie1": "群狼四起，灭其一威众。",
  "#langmie2": "贪狼强力，寡义而趋利。",
  "#duanwei:die": "狼伴其侧，终不胜防……",
  "#recuorui1": "挫其锐气，折其旌旗。",
  "#recuorui2": "摧折锐气，未战先衰。",
  "#reliewei1": "都给我交出来！",
  "#reliewei2": "还有点用，暂且饶你一命！",
  "#re_niujin:die": "这酒有毒！",
  "#mouni1": "反制于人，不以鄙乎！",
  "#mouni2": "与诸君终为敌，吾欲先手。",
  "#zongfan1": "今天下未定，有能者皆可谋之！",
  "#zongfan2": "吾以千里之众，当四战之地，可反也！",
  "#zhangmiao:die": "独木终难支矣……",
  "#lulve1": "趁火打劫，乘危掳掠。",
  "#lulve2": "天下大乱，掳掠以自保。",
  "#lxzhuixi1": "得势追击，胜望在握！",
  "#lxzhuixi2": "诸将得令，追而袭之！",
  "#liangxing:die": "夏侯渊，你竟敢！",
  "#cslilu1": "乱狱滋丰，以礼赂之。",
  "#cslilu2": "微薄之礼，聊表敬意！",
  "#csyizheng1": "玉树盈阶，望子成龙！",
  "#csyizheng2": "择善者，翊赞季兴。",
  "#caosong:die": "孟德，勿忘汝父之仇！",
  "#zhaohuo_re_taoqian1": "覆巢之下，安有完卵。",
  "#zhaohuo_re_taoqian2": "四战之地，兵连祸结。",
  "#yixiang_re_taoqian1": "阿瞒！你可攻的下这徐州城！",
  "#yixiang_re_taoqian2": "得道多助，失道寡助！",
  "#yirang_re_taoqian1": "百万黎庶，尽嘱明公！",
  "#yirang_re_taoqian2": "徐州之主，舍君其谁！",
  "#re_taoqian:die": "原知万事空，谁解托州意？",
  "#yangzhong1": "宦祸所起，池鱼所终！",
  "#yangzhong2": "窃权利己，弄祸殃众！",
  "#huangkong1": "满腹忠心，如履薄冰！",
  "#huangkong2": "咱家乃皇帝之母，能有什么坏心思？",
  "#zhaozhong:die": "咱家忠心可鉴啊！！",
  "#hfjieying1": "秉志持节，应时而动。",
  "#hfjieying2": "授节于汝，随机应变！",
  "#weipo1": "临渊勒马，进退维谷！",
  "#weipo2": "前狼后虎，朝不保夕！",
  "#hanfu:die": "袁本初，你为何不放过我！",
  "#dcjiaoxia1": "暗剑匿踪，现时必捣黄龙。",
  "#dcjiaoxia2": "袖中藏刃，欲取诸君之头。",
  "#dchumei1": "尔为靴下之臣，当行顺我之事。",
  "#dchumei2": "妾身一笑，可倾将军之城否？",
  "#dongxie:die": "覆巢之下，断无完卵余生。",
  "#minsi1": "能书会记，心思灵巧。",
  "#minsi2": "才情兼备，选入掖庭。",
  "#jijing1": "吉梦赐福，顺应天命。",
  "#jijing2": "梦之指引，必为吉运。",
  "#zhuide1": "思美人，两情悦。",
  "#zhuide2": "花香蝶恋，君德妾慕。",
  "#wangrong:die": "谁能护妾身幼子……",
  "#cixiao1": "吾儿奉先，天下无敌！",
  "#cixiao2": "父慈子孝，义理为先！",
  "#xianshuai1": "九州齐喑，首义瞩吾！",
  "#xianshuai2": "雄兵一击，则天下大白！",
  "#ol_dingyuan:die": "你我父子，此恩今日断！",
  "#spweiwu1": "凉州寸土，不可拱手让人。",
  "#spweiwu2": "明遵旨，暗忤意。",
  "#yujue1": "国库空虚，鬻爵可解。",
  "#yujue2": "卖官鬻爵，酣歌畅饮。",
  "#tuxing1": "国之兴亡，休戚相关。",
  "#tuxing2": "兴业安民，宏图可绘。",
  "#liuhong:die": "权利的滋味，让人沉沦……",
  "#gongjian1": "善攻者，敌不知其所守。",
  "#gongjian2": "围解自出，势必意散。",
  "#kuimang1": "黄巾流寇，不过如此。",
  "#kuimang2": "黄巾作乱，奉旨平叛！",
  "#zhujun:die": "乞降不受，愿一战！",
  "#xinfu_langxi1": "袭夺之势，如狼噬骨。",
  "#xinfu_langxi2": "引吾至此，怎能不袭掠之？",
  "#xinfu_yisuan1": "吾亦能善算谋划。",
  "#xinfu_yisuan2": "算计人心，我也可略施一二。",
  "#lijue:die": "若无内讧，也不至如此……",
  "#xinfu_lveming1": "劫命掠财，毫不费力。",
  "#xinfu_lveming2": "人财，皆掠之，哈哈！",
  "#xinfu_tunjun1": "得封侯爵，屯军弘农。",
  "#xinfu_tunjun2": "屯军弘农，养精蓄锐。",
  "#zhangji:die": "哪，哪里来的乱箭？",
  "#xinfu_xingluan1": "大兴兵争，长安当乱。",
  "#xinfu_xingluan2": "勇猛兴军，乱世当立。",
  "#fanchou:die": "唉，稚然疑心，甚重……",
  "#xinfu_tanbei1": "此机，我怎么会错失。",
  "#xinfu_tanbei2": "你的东西，现在是我的了！",
  "#xinfu_sidao1": "连发伺动，顺手可得。",
  "#xinfu_sidao2": "伺机而动，此地可窃。",
  "#guosi:die": "伍习，你……",
  "#xinfu_tunan1": "敢问丞相，何时挥师南下？",
  "#xinfu_tunan2": "攻伐之道，一念之间。",
  "#xinfu_bijing1": "拒吴闭境，臣誓保永昌！",
  "#xinfu_bijing2": "一臣无二主，可战不可降！",
  "#lvkai:die": "守节不易，吾愿舍身为蜀……",
  "#xinfu_zhenxing1": "东征西讨，募军百里挑一。",
  "#xinfu_zhenxing2": "众口铄金，积毁销骨。",
  "#xinfu_qianxin1": "兵困绝地，将至如归！",
  "#xinfu_qianxin2": "临危之际，速速来援！",
  "#zhanggong:die": "大漠孤烟，孤立无援啊……",
  "#xinfu_fuhai1": "跨海南征，波涛起浮。",
  "#xinfu_fuhai2": "宦海沉浮，生死难料！",
  "#weiwenzhugezhi:die": "吾皆海岱清士，岂料生死易逝……",
  "#zongkui1": "准备好，听候女王的差遣了吗？",
  "#zongkui2": "契约已定！",
  "#guju1": "我能看到，你的灵魂在颤抖。",
  "#guju2": "你死后，我将超度你的亡魂。",
  "#baijia1": "以邪马台的名义！",
  "#baijia2": "我要摧毁你的一切，然后建立我的国度。",
  "#beimihu:die": "我还会从黄泉比良坂回来的……",
  "#spwenji1": "还望先生救我！",
  "#spwenji2": "言出子口，入于吾耳，可以言未？",
  "#sptunjiang1": "江夏冲要之地，孩儿愿往守之。",
  "#sptunjiang2": "皇叔勿惊，吾与关将军已到。",
  "#sp_liuqi:die": "父亲，孩儿来，见你了……",
  "#xinfu_xingzhao1": "拿些上好的木料来。",
  "#xinfu_xingzhao2": "精挑细选，方能成百年之计。",
  "#xz_xunxun1": "让我先探他一探。",
  "#xz_xunxun2": "船，也不是一天就能造出来的。",
  "#xf_tangzi:die": "偷工减料，要不得啊……",
  "#xinfu_dianhu1": "就用你，给我军祭旗！",
  "#xinfu_dianhu2": "预则立，不预则废！",
  "#xinfu_jianji1": "密计交于将军，可解燃眉之困。",
  "#xinfu_jianji2": "锦上添花，不如雪中送炭。",
  "#xf_huangquan:die": "魏王厚待于我，降魏又有何错？",
  "#xinfu_lianpian1": "心无旁骛，断而敢行！",
  "#xinfu_lianpian2": "需持续投入，方有回报。",
  "#xf_sufei:die": "恐不能再与兴霸兄……并肩奋战了……",
  "#pingjian1": "识人读心，评荐推达。",
  "#pingjian2": "月旦雅评，试论天下。",
  "#xushao:die": "守节好耻，不可逡巡……",
  "#xpchijie1": "此战不在急，请仲达明了。",
  "#xpchijie2": "持节阻战，奉帝赐诏。",
  "#yinju1": "据理直谏，吾人臣本分。",
  "#yinju2": "迁徙之计，危涉万民。",
  "#xinpi:die": "失民心，且无食……",
  "#lslixun1": "利欲熏心，财权保命。",
  "#lslixun2": "利益当前，岂不心动？",
  "#lskuizhu1": "与君同谋，赠君金珠。",
  "#lskuizhu2": "金珠熠熠，都归将军了。",
  "#lisu:die": "金银珠宝再多，也难买命啊……",
  "#songshu1": "称颂蜀汉，以表诚心。",
  "#songshu2": "吴蜀两和，方可安稳。",
  "#sibian1": "弘雅之素，英秀之德。",
  "#sibian2": "才藻俊茂，辨思如涌。",
  "#zhangwen:die": "暨艳过错，强牵吾罪……",
  "#spjiedao1": "我这大刀，可是不看情面的。",
  "#spjiedao2": "截头大刀的威力，你来尝尝？",
  "#mangyachang:die": "黄骠马也跑不快了……",
  "#biaozhao1": "孙策宜加贵宠，须召还京邑！",
  "#biaozhao2": "此人有祸患之像，望丞相慎之。",
  "#yechou1": "会有人替我报仇的！",
  "#yechou2": "我的门客，是不会放过你的！",
  "#xugong:die": "终究……还是被其所害……",
  "#yanjiao1": "性矜严教，明于教训。",
  "#yanjiao2": "会虽童稚，勤见规诲。",
  "#xingshen1": "居上不骄，制节谨度。",
  "#xingshen2": "君子之行，皆积小以致高大。",
  "#zhangchangpu:die": "我还是小看了，孙氏的伎俩……",
  "#xiying1": "此番若功不能成，我军恐难以再战。",
  "#xiying2": "速袭曹营，以解乌巢之难！",
  "#gaolan:die": "郭图小辈之计……误军呐！",
  "#gangzhi1": "死便死，降？断不能降！",
  "#gangzhi2": "只恨箭支太少，不能射杀汝等！",
  "#beizhan1": "今伐曹氏，譬如覆手之举。",
  "#beizhan2": "十，则围之；五，则攻之！",
  "#sp_shenpei:die": "吾君在北，但求面北而亡……",
  "#fenglve1": "汝能比得上我家主公吗？",
  "#fenglve2": "将军有让贤之名而身安于泰山也，实乃上策。",
  "#mouzhi1": "官渡决战，袁公必胜而曹氏必败。",
  "#mouzhi2": "吾既辅佐袁公，定不会使其覆巢。",
  "#xunchen:die": "吾欲赴死，断不做背主之事……",
  "#yuanlve1": "若不引兵救乌巢，则主公危矣！",
  "#yuanlve2": "此番攻之不破，吾属尽成俘虏。",
  "#sp_zhanghe:die": "袁公不听吾之言，乃至今日……",
  "#spshicai1": "主公不听吾之言，实乃障目不见泰山也！",
  "#spshicai2": "遣轻骑以袭许都，大事可成。",
  "#sp_xuyou:die": "我军之所以败，皆因尔等指挥不当！",
  "#cangchu1": "敌袭！速度整军，坚守营寨！",
  "#cangchu2": "袁公所托，琼，必当死守！",
  "#sushou1": "吾军之所守，为重中之重，尔等、切莫懈怠！",
  "#sushou2": "今夜，需再加强巡逻，不要出了差池。",
  "#liangying1": "敌袭！速度整军，坚守营寨！",
  "#chunyuqiong:die": "子远老贼，吾死当追汝之魂！",
  "#liehou1": "识时务者为俊杰。",
  "#liehou2": "兄弟齐心，其利断金！",
  "#qigong1": "打虎亲兄弟！",
  "#qigong2": "丞相有令，尔敢不从？",
  "#lvkuanglvxiang:die": "此处可是新野……",
  "#dcnuchen1": "触关某之逆鳞者，杀无赦！",
  "#dcnuchen2": "天下碌碌之辈，安敢小觑关某？！",
  "#dczuojian1": "关羽者，刘备之枭将，宜除之。",
  "#dczuojian2": "主公虽非赵简子，然某可为周舍。",
  "#longdan_tongyuan": "能进能退，方显名将本色。",
  "#ocongjian_tongyuan": "察言纳谏，安身立命之道也。",
  "#chuanyun": "吾枪所至，人马俱亡！",
  "#zhangu1": "孤军奋战，独破众将。",
  "#zhangu2": "雄狮搏兔，何须援乎？",
  "#bmcanshi1": "是你，在召唤我吗？",
  "#bmcanshi2": "这片土地的人，真是太有趣了。",
  "#starruijun1": "三军夺锐，势不可挡。",
  "#starruijun2": "士如钢锋，可破三属之甲。",
  "#stargangyi1": "不见狼居胥，何妨马革裹尸。",
  "#stargangyi2": "既无功，不受禄。",
  "#star_sunjian:die": "身怀宝器，必受群狼觊觎……",
  "#starjiaohao1": "身虽为碧玉，手不怠锟铻！",
  "#starjiaohao2": "站住！且与本姑娘分个高下！",
  "#starsaying1": "倩影映江汀，巾帼犹飒爽！",
  "#starsaying2": "我有一袭红袖，欲揾英雄泪！",
  "#star_sunshangxiang:die": "秋风冷，江水寒……"
};
const characterSort = {
  sp2_tianliang: ["duji"],
  sp2_tiantong: ["sp_taishici"],
  sp2_tianxiang: ["lvdai", "liuyao"],
  sp2_qisha: ["re_zhangliang"],
  sp2_whlw: ["lijue", "zhangji", "fanchou", "guosi", "duanwei", "liangxing", "zhangheng", "tangji", "niufu", "dongxie", "liqueguosi"],
  sp2_zltx: ["lvkai", "zhanggong", "weiwenzhugezhi", "beimihu"],
  sp2_longzhou: ["xf_tangzi", "xf_huangquan", "xf_sufei", "sp_liuqi"],
  sp2_zizouqi: ["mangyachang", "xugong", "zhangchangpu", "cuilie"],
  sp2_sbfm: ["lisu", "xinpi", "zhangwen"],
  sp2_guandu: ["sp_zhanghe", "xunchen", "sp_shenpei", "gaolan", "lvkuanglvxiang", "chunyuqiong", "sp_xuyou", "xinping", "hanmeng"],
  sp2_qihuan: ["zhaozhong", "re_hejin", "fengfang", "mushun"],
  sp2_binglin: ["re_niujin", "sp_mifangfushiren", "licaiwei", "dc_zhaoyan", "shiyi", "sunlang", "sunhuan", "dc_mengda", "dc_zhaoyǎn", "wangwei", "liyixiejing"],
  sp2_danqi: ["dufuren", "qinyilu", "bianxi", "dc_huban", "dc_hujinding", "guānning", "dc_jsp_guanyu"],
  sp2_fenghuo: ["re_nanhualaoxian", "tongyuan", "zhangning", "re_pangdegong"],
  sp2_huangjin: ["liuhong", "zhujun", "re_hansui", "xushao"],
  sp2_fadong: ["ol_dingyuan", "wangrong", "re_quyi", "hanfu"],
  sp2_xuzhou: ["caobao", "re_taoqian", "caosong", "zhangmiao", "qiuliju"],
  sp2_zhongyuan: ["re_hucheer", "re_zoushi", "caoanmin", "re_dongcheng"],
  sp2_xiaohu: ["haomeng", "yanfuren", "yanrou", "dc_zhuling"],
  sp2_qunxiong: ["dc_yanxiang", "chezhou", "hansong", "matie"],
  sp2_tianshu: ["star_zhangrang", "star_yuanshu", "star_dongzhuo", "star_yuanshao"],
  sp2_yuheng: ["star_caoren", "star_zhangchunhua", "star_jiangwan", "star_zhanghe"],
  sp2_kaiyang: ["star_sunjian", "star_taishici", "star_xiahouba"],
  sp2_yaoguang: ["star_sunshangxiang", "star_dingfeng", "star_wenchou", "star_yanliang"],
  sp2_tianxuan: ["star_xunyu", "star_fazheng", "star_zhangzhao", "star_zhangsong", "star_zhugejin"],
  sp2_waitforsort: ["caobuxing", "re_maliang", "dc_jikang"]
};
const characterSortTranslate = {
  sp2_tianliang: "星火燎原·天梁",
  sp2_tiantong: "星火燎原·天同",
  sp2_tianxiang: "星火燎原·天相",
  sp2_qisha: "星火燎原·七杀",
  sp2_longzhou: "活动场·同舟共济",
  sp2_guandu: "活动场·官渡之战",
  sp2_whlw: "南征北战·文和乱武",
  sp2_zltx: "南征北战·逐鹿天下",
  sp2_zizouqi: "南征北战·食禄尽忠",
  sp2_sbfm: "南征北战·上兵伐谋",
  sp2_qihuan: "南征北战·戚宦之争",
  sp2_binglin: "南征北战·兵临城下",
  sp2_fenghuo: "南征北战·烽火连天",
  sp2_danqi: "南征北战·千里单骑",
  sp2_xiaohu: "武将列传·虓虎悲歌",
  sp2_qunxiong: "武将列传·群雄伺动",
  sp2_zhongyuan: "武将列传·中原狼烟",
  sp2_huangjin: "武将列传·黄巾之乱",
  sp2_fadong: "武将列传·诸侯伐董",
  sp2_xuzhou: "武将列传·徐州风云",
  sp2_tianshu: "星河璀璨·天枢",
  sp2_yuheng: "星河璀璨·玉衡",
  sp2_kaiyang: "星河璀璨·开阳",
  sp2_yaoguang: "星河璀璨·瑶光",
  sp2_tianxuan: "星河璀璨·天璇",
  sp2_waitforsort: "等待分包"
};
game.import("character", function() {
  return {
    name: "sp2",
    connect: true,
    character: { ...characters },
    characterSort: {
      sp2: characterSort
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
