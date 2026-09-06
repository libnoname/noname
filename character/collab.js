import { game, get, _status, lib, ui, ai } from "noname";
const characters = {
  ol_chitu: {
    sex: "female",
    group: "shu",
    hp: 4,
    skills: [],
    names: "null|null",
    isUnseen: true
  },
  ol_le_menghuo: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: [],
    groupBorder: "qun",
    isUnseen: true
  },
  ol_niuma: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["oldianbu", "oljuhun"],
    names: "null|null-null|null",
    isUnseen: true
  },
  xiangxue_liushan: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["xiangxue", "zhiyong"]
  },
  haoxue_lvmeng: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["haoxue", "qiongshe"]
  },
  boxue_caochong: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["boxue", "zhizhong"]
  },
  natu_guanyu: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["natuyi"]
  },
  natu_zhugeliang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["natuxing", "natufu"],
    names: "诸葛|亮",
    clans: ["琅琊诸葛氏"]
  },
  natu_zhaoyun: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["natulie", "natuheng"]
  },
  ol_le_caopi: {
    sex: "male",
    group: "wei",
    hp: 2,
    maxHp: 4,
    skills: ["olweidai", "olliangzi"]
  },
  tw_dm_zhouyu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["twjuyan", "twlihuo", "yingjian", "yiran"]
  },
  ol_re_nianshou: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olsuizhong", "olnianyi", "dchuace", "olfuyou"]
  },
  ol_le_zhugeliang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["oljiangwu", "olxinghan"],
    names: "诸葛|亮",
    clans: ["琅琊诸葛氏"]
  },
  meituizhishen: {
    sex: "male",
    group: "shen",
    hp: 3,
    skills: ["dcshentui", "dcxurui"],
    names: "null|null"
  },
  gongbaiwan: {
    sex: "female",
    group: "qun",
    hp: 4,
    skills: ["dchaoshi"]
  },
  nizhuanzhishen: {
    sex: "male",
    group: "shen",
    hp: 4,
    maxHp: 5,
    skills: ["dcfanzhuan", "dcniyun"],
    names: "null|null"
  },
  shuimianzhishen: {
    sex: "male",
    group: "shen",
    hp: 3,
    skills: ["dckeshui"],
    names: "null|null"
  },
  bianhuanzhishen: {
    sex: "male",
    group: "shen",
    hp: 3,
    skills: ["dcbaibian"],
    names: "null|null"
  },
  juezezhishen: {
    sex: "female",
    group: "shen",
    hp: 4,
    skills: ["dchuibian"],
    names: "null|null"
  },
  weiquzhishen: {
    sex: "female",
    group: "shen",
    hp: 3,
    skills: ["dcweiqu"],
    names: "null|null"
  },
  keaizhishen: {
    sex: "female",
    group: "shen",
    hp: 3,
    skills: ["dcmaimeng"],
    names: "null|null"
  },
  tizhongzhishen: {
    sex: "female",
    group: "shen",
    hp: 5,
    skills: ["dcgunyuan", "dczuandai"],
    names: "null|null"
  },
  mb_chitu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["mbjunkui", "mbchiyuan"]
  },
  mb_jueying: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["mbjiguan", "mbzhengpeng"]
  },
  mb_dilu: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["mbjiguan", "mbyuetan"]
  },
  mb_muniu: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["mbshezi", "mbyixing"]
  },
  jm_yuanshu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["mbjimi", "mbmaodie"]
  },
  tw_dm_quyi: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["retieji", "dmchongqi", "dmfanquan"]
  },
  ol_le_caohong: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["olmojin", "oldingbao"]
  },
  ol_le_liushan: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["oltuoquan", "olxianglv", "olanle", "oldianzan"]
  },
  you_zhugeliang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["dcyingyou"]
  },
  bigsb_dengai: {
    sex: "male",
    group: "wei",
    hp: 3,
    maxHp: 5,
    skills: ["olandu", "olqiqi"]
  },
  wild_liru: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olhuaquan", "olsanou"]
  },
  ren_jiangwei: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["renhuoluan", "renguxing"]
  },
  ren_dengai: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["renneyan", "renqianyao"]
  },
  strong_caochong: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["strongduanti", "stronglianwu", "olchengxiang"]
  },
  taipingsangong: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["oltiangong", "oldigong", "olrengong"],
    names: "张|角-张|宝-张|梁"
  },
  yuanshaoyuanshu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dclieti", "dcshigong", "dcluankui"],
    names: "袁|绍-袁|术"
  },
  tianji: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcweiji", "dcsaima"]
  },
  ol_xiahouen: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["olyinfeng", "olfulu"],
    names: "夏侯|恩"
  },
  hanshiwuhu: {
    sex: "male",
    group: "wei",
    hp: 5,
    skills: ["oljuejue", "olpimi"],
    initFilters: ["noZhuHp"],
    names: "韩|德‌-韩|瑛-韩|瑶-韩|琼-韩|琪"
  },
  shi_cenhun: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["dcxinggong", "dcbaoshi"],
    names: "岑|昏"
  },
  ol_zishu: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["olzishu"]
  },
  ol_chouniu: {
    sex: "male",
    group: "qun",
    hp: 1,
    maxHp: 5,
    skills: ["olchouniu"]
  },
  ol_yinhu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olyinhu"]
  },
  ol_maotu: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["olmaotu"]
  },
  ol_chenlong: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olchenlong"]
  },
  ol_sishe: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["olsishe"]
  },
  ol_wuma: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olwuma"]
  },
  ol_weiyang: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["olweiyang"]
  },
  ol_shenhou: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["olshenhou"]
  },
  ol_youji: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["olyouji"]
  },
  ol_xugou: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olxugou"]
  },
  ol_haizhu: {
    sex: "male",
    group: "qun",
    hp: 5,
    skills: ["olhaizhu"]
  },
  ol_nianshou: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["olsuichong", "olshouhun"]
  },
  ol_jsrg_lvbu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olfengzhu", "olyuyu", "ollbzhiji", "oljiejiu"],
    img: "image/character/jsrg_lvbu.jpg",
    names: "吕|布"
  },
  weiqing: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcbeijin"]
  },
  liuxiecaojie: {
    sex: "male",
    group: "qun",
    hp: 2,
    skills: ["dcjuanlv", "dcqixin"],
    names: "刘|协-曹|节"
  },
  dc_zhaoyun: {
    sex: "male",
    group: "shen",
    hp: 1,
    skills: ["boss_juejing", "dclonghun", "dczhanjiang"],
    groupInGuozhan: "shu",
    initFilters: ["noZhuHp", "noZhuSkill"]
  },
  dc_sunce: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["dcshuangbi"]
  },
  nezha: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcsantou", "dcfaqi"],
    initFilters: ["noZhuHp"],
    names: "李|哪吒"
  },
  dc_caocao: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["dcjianxiong"]
  },
  dc_liubei: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["dcrende"]
  },
  dc_sunquan: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["dczhiheng"]
  },
  zhutiexiong: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcbianzhuang"],
    dieAudios: ["2"]
  },
  xiaoyuehankehan: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dctongliao", "dcwudao"],
    dieAudios: ["3"],
    names: "null|null"
  },
  libai: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dclbjiuxian", "dcshixian"],
    dieAudios: ["2"]
  },
  sunwukong: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcjinjing", "dccibei", "dcruyi"]
  },
  longwang: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dclonggong", "dcsitian"],
    names: "敖|广"
  },
  taoshen: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcnutao"],
    names: "伍|子胥"
  },
  sunyang: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["clbshuijian"]
  },
  yeshiwen: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["clbjisu", "clbshuiyong"]
  },
  sp_jiben: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["spduanzhi", "spduyi"]
  },
  sp_fuhuanghou: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["spcangni", "spmixin"]
  },
  sp_fuwan: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["spfengyin", "spchizhong"]
  },
  old_lingju: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["jieyuan", "fenxin_old"],
    names: "吕|null"
  },
  sp_mushun: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["moukui"]
  },
  dc_wuyi: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["dcbenxi"],
    clans: ["陈留吴氏"]
  },
  quyuan: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcqiusuo", "dclisao"],
    names: "芈|原"
  },
  xin_sunquan: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["dchuiwan", "dchuanli"]
  },
  wuhujiang: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["olhuyi"],
    names: "关|羽-张|飞-赵|云-马|超-黄|忠",
    dieAudios: ["5"]
  },
  dc_noname: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcchushan"],
    names: "null|null"
  },
  ol_jsrg_caocao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["oldingxi", "olnengchen", "olhuojie"],
    img: "image/character/jsrg_caocao.jpg"
  },
  jiangziya: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["xingzhou", "lieshen"],
    names: "姜|尚"
  },
  shengongbao: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["zhuzhou", "yaoxian"]
  },
  nanjixianweng: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["xwshoufa", "fuzhao"],
    names: "null|null"
  },
  bozai: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["quanjia"],
    names: "耄|耋"
  },
  xiangjiaoduanwu: {
    sex: "female",
    group: "qun",
    hp: 4,
    skills: ["xuyuan", "xiaomian"],
    names: "耄|耋"
  }
};
const cards = {
  bachiqionggouyu: {
    fullskin: true,
    type: "equip",
    subtype: "equip5",
    ai: {
      equipValue(card, player) {
        const lose = player.maxHp - player.getHp();
        if (_status.currentPhase !== player) {
          return 4 - lose * 2;
        }
        if (_status.currentPhase) {
          const phase = get.event().getParent("phase");
          const nexts = phase?.phaseList.slice(phase.num);
          if (nexts.includes("phaseUse") && !player.isDamaged()) {
            return 2;
          }
        }
        return 0;
      }
    },
    skills: ["bachiqionggouyu_skill"]
  },
  bazhijing: {
    fullskin: true,
    type: "equip",
    subtype: "equip2",
    async onLose({ player }) {
      player.unmarkAuto("bazhing", player.getStorage("bazhijing"));
    },
    ai: {
      equipValue(card, player) {
        return 10 - player.getStorage("bazhijing").length;
      }
    },
    skills: ["bazhijing_skill"]
  },
  luoyangchan: {
    fullskin: true,
    type: "equip",
    subtype: "equip1",
    destroy: true,
    derivation: "ol_le_caohong",
    distance: {
      attackFrom: -1
    },
    skills: ["luoyangchan_skill"]
  },
  real_zhuge: {
    derivation: "you_zhugeliang",
    cardimage: "zhuge",
    fullskin: true,
    type: "equip",
    subtype: "equip1",
    distance: {
      attackFrom: -98
    },
    destroy: true,
    ai: {
      order() {
        return get.order({ name: "sha" }) + 0.1;
      },
      equipValue(card, player) {
        if (player._zhuge_temp) {
          return 1;
        }
        player._zhuge_temp = true;
        const result = (() => {
          if (!game.hasPlayer((current) => get.distance(player, current) <= 1 && player.canUse("sha", current) && get.effect(current, { name: "sha" }, player, player) > 0)) {
            return 1;
          }
          if (player.hasSha() && _status.currentPhase === player) {
            if (player.getEquip("zhuge") && player.countUsed("sha") || player.getCardUsable("sha") === 0) {
              return 10;
            }
          }
          const num = player.countCards("h", "sha");
          if (num > 1) {
            return 6 + num;
          }
          return 3 + num;
        })();
        delete player._zhuge_temp;
        return result;
      },
      basic: {
        equipValue: 5
      },
      tag: {
        valueswap: 1
      }
    },
    skills: ["real_zhuge_skill"]
  },
  olhuaquan_heavy: {
    fullskin: true,
    noname: true
  },
  olhuaquan_light: {
    fullskin: true,
    noname: true
  },
  ruyijingubang: {
    fullskin: true,
    derivation: "sunwukong",
    type: "equip",
    subtype: "equip1",
    cardcolor: "heart",
    skills: ["ruyijingubang_skill", "ruyijingubang_effect"],
    equipDelay: false,
    distance: {
      attackFrom: -2,
      attackRange: (card, player) => player.storage.ruyijingubang_skill || 3
    },
    async onEquip({ card, player }) {
      if (!card.storage.ruyijingubang_skill) {
        card.storage.ruyijingubang_skill = 3;
      }
      player.storage.ruyijingubang_skill = card.storage.ruyijingubang_skill;
      player.markSkill("ruyijingubang_skill");
    },
    async onLose({ player }) {
      if (!player.getStat().skill.ruyijingubang_skill) {
        return;
      }
      delete player.getStat().skill.ruyijingubang_skill;
    }
  }
};
const pinyins = {
  大宛: ["dà yuān"]
};
const skills = {
  //OL牛马
  oldianbu: {
    audio: 2
  },
  oljuhun: {
    audio: 5
  },
  //博学曹冲
  boxue: {
    audio: 3,
    enable: "chooseToUse",
    canUseCards(event, player) {
      const discards = Array.from(ui.discardPile.childNodes);
      return get.inpileVCardList((info) => {
        if (discards.some((card) => card.name == info[2])) {
          return false;
        }
        if (!["basic", "trick"].includes(info[0])) {
          return false;
        }
        const infox = get.info({ name: info[2] });
        if (!infox || infox.notarget || !infox.filterTarget) {
          return false;
        }
        return event.filterCard(
          get.autoViewAs(
            {
              name: info[2],
              nature: info[3]
            },
            "unsure"
          ),
          player,
          event
        );
      });
    },
    filter(event, player) {
      if (player.hasSkill("boxue_round")) {
        return false;
      }
      const discards = Array.from(ui.discardPile.childNodes);
      return player.hasDiscardableCards(player, "h", (card) => discards.some((cardx) => cardx.name == card.name)) && get.info("boxue").canUseCards(event, player).length;
    },
    chooseButton: {
      dialog(event, player) {
        const list = get.info("boxue").canUseCards(event, player);
        return ui.create.dialog("博学", [list, "vcard"]);
      },
      filter(button, player) {
        return _status.event.getParent().filterCard(
          {
            name: button.link[2]
          },
          player,
          _status.event.getParent()
        );
      },
      check(button) {
        if (_status.event.getParent().type != "phase") {
          return 1;
        }
        const player = get.player();
        if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) {
          return 0;
        }
        return player.getUseValue({
          name: button.link[2],
          nature: button.link[3]
        });
      },
      backup(links, player) {
        return {
          filterCard(card, player2) {
            const discards = Array.from(ui.discardPile.childNodes);
            return discards.some((cardx) => cardx.name == card.name) && lib.filter.cardDiscardable(card, player2, "boxue_backup");
          },
          selectCard: -1,
          audio: "boxue",
          popname: true,
          ignoreMod: true,
          check(card) {
            return 8 - get.value(card);
          },
          selectCard() {
            if (!ui.selected.cards?.length) {
              return 1;
            }
            return -1;
          },
          position: "h",
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            suit: "none",
            color: "none",
            number: null,
            isCard: true
          },
          async precontent(event, trigger, player2) {
            const { cards: cards2 } = event.result;
            player2.addTempSkill("boxue_round", "roundStart");
            event.result.cards = [];
            await player2.modedDiscard({ cards: cards2 });
          }
        };
      },
      prompt(links, player) {
        return "弃置所有弃牌堆中有的牌名的手牌视为使用一张" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
      }
    },
    hiddenCard(player, name) {
      if (!lib.inpile.includes(name)) {
        return false;
      }
      if (player.hasSkill("boxue_round")) {
        return false;
      }
      const infox = get.info({ name });
      if (!infox || infox.notarget || !infox.filterTarget) {
        return false;
      }
      const type = get.type(name);
      const discards = Array.from(ui.discardPile.childNodes);
      return ["basic", "trick"].includes(type) && player.hasCards("h", (card) => discards.some((cardx) => cardx.name == card.name)) && !discards.some((cardx) => cardx.name == name);
    },
    ai: {
      fireAttack: true,
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        if (arg == "respond" || player.hasSkill("boxue_round")) {
          return false;
        }
        const name = tag == "respondSha" ? "sha" : "shan";
        return lib.skill["boxue"].hiddenCard(player, name);
      },
      order: 7,
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
      backup: {},
      round: { charlotte: true }
    }
  },
  zhizhong: {
    audio: 3,
    logAudio: (index) => typeof index == "number" ? `zhizhong${index}.mp3` : 2,
    enable: "phaseUse",
    usable: 1,
    manualConfirm: true,
    filter(event, player) {
      return game.hasPlayer((current) => get.info("zhizhong").filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return player != target && target.hasCards("h");
    },
    selectTarget: -1,
    multiline: true,
    multitarget: true,
    async content(event, trigger, player) {
      const targets = event.targets.sortBySeat();
      const num = player.getCards("h").reduce((sum, card) => sum + (get.number(card) ?? 0), 0);
      const createDialog = [`置重：获得牌的点数之和须小于等于${num}`];
      for (const target of targets) {
        if (target.hasCards("h")) {
          createDialog.push(`<div class="text center">${get.translation(target)}的手牌</div>`);
          createDialog.push([target.getCards("h"), "vcard"]);
        }
      }
      const result = await player.chooseButton({
        createDialog,
        forced: true,
        filterButton(button) {
          const cards2 = (ui.selected.buttons ?? []).map((button2) => button2.link);
          const card = button.link;
          const numx = cards2.reduce((sum, card2) => sum + (get.number(card2) ?? 0), 0);
          const { num: num2 } = get.event();
          return typeof get.number(card) == "number" && get.number(card) > 0 && numx + get.number(card) <= num2;
        },
        selectButton: [0, Infinity],
        complexSelect: true,
        ai(button) {
          const card = button.link;
          const player2 = get.player();
          const target = get.owner(card);
          if (get.attitude(player2, target) > 0) {
            return 0;
          }
          return get.value(card);
        }
      }).set("num", num).forResult();
      if (result?.bool) {
        const cards2 = result.links;
        if (cards2.length) {
          await player.gain({ cards: cards2, animate: "gain2" });
        }
        const numx = cards2.reduce((sum, card) => sum + (get.number(card) ?? 0), 0);
        const disnum = Math.abs(num - numx);
        if (disnum > 0 && player.hasDiscardableCards(player, "he")) {
          player.logSkill(event.name, null, null, null, [3]);
          await player.chooseToDiscard({ forced: true, position: "he", selectCard: disnum });
        }
      }
    },
    ai: {
      order: 9,
      result: {
        player(player) {
          if (!player.hasCards("he")) {
            return 1;
          }
          const num = game.filterPlayer((current) => current != player && current.hasCards("h") && get.attitude(player, current) < 0).reduce((sum, current) => sum + current.countCards("h"), 0);
          if (num >= player.countCards("h")) {
            return 2;
          }
          return -1;
        }
      }
    }
  },
  //好学吕蒙
  haoxue: {
    audio: 4,
    logAudio: (event, player) => player.isPhaseUsing() ? 2 : ["haoxue3.mp3", "haoxue4.mp3"],
    forced: true,
    trigger: {
      player: ["loseAfter", "gainAfter"],
      global: "loseAsyncAfter"
    },
    filter(event, player) {
      if (player.isPhaseUsing()) {
        return event.getg?.(player)?.length && player.isDamaged();
      } else {
        if (event.type != "discard") {
          return false;
        }
        return event.getl?.(player)?.cards2?.length;
      }
    },
    async content(event, trigger, player) {
      if (player.isPhaseUsing()) {
        await player.recover();
      } else {
        await player.loseHp();
      }
    }
  },
  qiongshe: {
    audio: 2,
    isPrime(num) {
      if (typeof num != "number" || num <= 1) return false;
      for (let i = 2; i < num; i++) {
        if (num % i === 0) return false;
      }
      return true;
    },
    enable: "phaseUse",
    manualConfirm: true,
    init(player, skill) {
      const num = player.getAllHistory("gain", (evt) => evt.getParent().name == "qiongshe" && evt.cards?.length).reduce((sum, evt) => sum + evt.cards.length, 0);
      if (num > 0) {
        player.addMark(skill, num, false);
      }
    },
    intro: { content: "因此获得牌数为：$" },
    onremove: true,
    trigger: {
      player: ["phaseDrawBegin", "phaseDiscardEnd"]
    },
    filter(event, player) {
      const num = player.getAllHistory("gain", (evt) => evt.getParent().name == "qiongshe" && evt.cards?.length).reduce((sum, evt) => sum + evt.cards.length, 0);
      return get.info("qiongshe").isPrime(event.name == "phaseDraw" ? player.countCards("h") : event.name == "phaseDiscard" ? player.getHp(true) : num);
    },
    async content(event, trigger, player) {
      let cards2 = get.cards(8, true);
      await player.showCards(cards2, `${get.translation(player)}发动了〖${get.translation(event.name)}〗`, true).set("delay_time", 4);
      cards2 = cards2.filter((card) => get.info(event.name).isPrime(get.number(card)));
      if (cards2.length) {
        await player.gain({ cards: cards2, animate: "gain2" });
        player.addMark(event.name, cards2.length, false);
      }
    },
    ai: {
      order: 114514,
      result: {
        player: 1
      }
    }
  },
  //想学刘禅
  xiangxue: {
    audio: 5,
    logAudio: (index) => typeof index == "number" ? `xiangxue${index}.mp3` : 2,
    init(player, skill) {
      player.addSkill(skill + "_mark");
    },
    onremove(player, skill) {
      player.removeSkill(skill + "_mark");
    },
    forced: true,
    trigger: { player: "useCard" },
    filter(event, player) {
      const names = player.getAllHistory("useCard", (evt) => evt != event).flatMap((evt) => evt.card.name).unique();
      const bool1 = !!player.storage.xiangxue2 === names.includes(event.card.name);
      const bool2 = player.storage.xiangxue1 || player.getStorage("xiangxue_mark").length % 2 === 0;
      return bool1 && bool2;
    },
    async content(event, trigger, player) {
      const num = player.storage.xiangxue1 ? 2 : 1;
      player.addMark(event.name, player.storage.xiangxue1 ? 1 : 2);
      await player.draw({ num });
      if (player.countMark(event.name) == 6) {
        player.logSkill(event.name, null, null, null, [3]);
        player.setStorage(event.name + "1", true, true);
      }
      if (player.countMark(event.name) == 9) {
        player.logSkill(event.name, null, null, null, [4]);
        player.setStorage(event.name + "2", true, true);
      }
      if (player.countMark(event.name) == 12) {
        player.logSkill(event.name, null, null, null, [5]);
        await player.removeSkills(event.name);
      }
    },
    marktext: "惘",
    intro: {
      name: "惘",
      content: "mark"
    },
    subSkill: {
      mark: {
        charlotte: true,
        silent: true,
        popup: false,
        firstDo: true,
        init(player, skill) {
          const names = player.getAllHistory("useCard").flatMap((evt) => evt.card.name).unique();
          if (names.length) {
            player.setStorage(skill, names, true);
          }
        },
        onremove: true,
        intro: {
          content: "本局游戏已使用过：$"
        },
        trigger: { player: "useCard" },
        filter(event, player) {
          return !player.getStorage("xiangxue_mark").includes(event.card.name);
        },
        async content(event, trigger, player) {
          player.markAuto(event.name, [trigger.card.name]);
        }
      }
    }
  },
  zhiyong: {
    audio: 2,
    enable: "chooseToUse",
    filter(event, player) {
      const nums = [];
      if (!player.getStorage("zhiyong").includes("hs")) {
        nums.push(player.countCards("h"));
      }
      if (!player.getStorage("zhiyong").includes("2")) {
        nums.push(2);
      }
      if (!player.getStorage("zhiyong").includes("wang")) {
        nums.push(player.countMark("xiangxue"));
      }
      const card = get.autoViewAs({ name: "sha", isCard: true }, "unsure");
      return player.countCards("he") >= Math.min(...nums) && event.filterCard(card, player, event);
    },
    filterCard: lib.filter.cardDiscardable,
    position: "he",
    ignoreMod: true,
    check(card) {
      return 5 - get.value(card);
    },
    selectCard() {
      const nums = [], player = get.player();
      if (!player.getStorage("zhiyong").includes("hs")) {
        nums.push(player.countCards("h"));
      }
      if (!player.getStorage("zhiyong").includes("2")) {
        nums.push(2);
      }
      if (!player.getStorage("zhiyong").includes("wang")) {
        nums.push(player.countMark("xiangxue"));
      }
      return [Math.min(...nums), Math.max(...nums)];
    },
    complexCard: true,
    filterOk() {
      const nums = [], player = get.player();
      if (!player.getStorage("zhiyong").includes("hs")) {
        nums.push(player.countCards("h"));
      }
      if (!player.getStorage("zhiyong").includes("2")) {
        nums.push(2);
      }
      if (!player.getStorage("zhiyong").includes("wang")) {
        nums.push(player.countMark("xiangxue"));
      }
      return nums.includes(ui.selected.cards.length);
    },
    viewAs: {
      name: "sha",
      isCard: true,
      suit: "none",
      number: null,
      color: "none"
    },
    async precontent(event, trigger, player) {
      const { cards: cards2 } = event.result;
      const num = cards2?.length ?? 0;
      const skill = "zhiyong";
      event.result.cards = [];
      if (num == player.countCards("h")) {
        player.markAuto(skill, "hs");
      }
      if (num == 2) {
        player.markAuto(skill, "2");
      }
      if (num == player.countMark("xiangxue")) {
        player.markAuto(skill, "wang");
      }
      if ([1, 2, 3].includes(num)) {
        const result = await player.chooseTarget({
          prompt: `致用：弃置一名其他角色${get.cnNumber(num)}张牌或点“取消”摸${get.cnNumber(num)}张牌`,
          filterTarget(card, player2, target) {
            return player2 != target && target.hasCards("he");
          },
          ai(target) {
            const { num: num2, player: player2 } = get.event();
            return get.effect(target, { name: "guohe_copy", position: "he" }, player2, player2) * num2 - get.effect(player2, { name: "draw" }, player2, player2) * num2;
          }
        }).set("num", num).forResult();
        if (result?.bool && result.targets?.length) {
          const target = result.targets[0];
          player.line(target);
          await player.discardPlayerCard({ target, forced: true, position: "he", selectButton: num });
        } else {
          await player.draw({ num });
        }
      } else {
        if (cards2?.length) {
          await player.modedDiscard({ cards: cards2 });
        }
      }
    },
    intro: {
      content(storage, player) {
        let str = "本局游戏已触发过：";
        if (storage.includes("hs")) {
          str += "[手牌数]";
        }
        if (storage.includes("2")) {
          str += "[2]";
        }
        if (storage.includes("wang")) {
          str += "[“惘”数]";
        }
        return str;
      }
    },
    hiddenCard(player, name) {
      const nums = [];
      if (!player.getStorage("zhiyong").includes("hs")) {
        nums.push(player.countCards("h"));
      }
      if (!player.getStorage("zhiyong").includes("2")) {
        nums.push(2);
      }
      if (!player.getStorage("zhiyong").includes("wang")) {
        nums.push(player.countMark("xiangxue"));
      }
      return name == "sha" && player.countCards("he") >= Math.min(...nums);
    },
    ai: {
      order: 5,
      respondSha: true,
      skillTagFilter(player, tag, arg) {
        if (arg == "respond") {
          return false;
        }
        const name = "sha";
        return lib.skill["zhiyong"].hiddenCard(player, name);
      },
      result: {
        player: 1
      }
    }
  },
  //那兔
  natulie: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter(event, player) {
      if (get.type(event.card) != "basic") {
        return false;
      }
      Math.min(5, player.countHistory("useSkill", (evt) => evt.skill == "natulie") + 1);
      return true;
    },
    prompt2(event, player) {
      const num = Math.min(5, player.countHistory("useSkill", (evt) => evt.skill == "natulie") + 1);
      return `将手牌调整至${num}，若你因此弃置了牌，你可对一名角色造成1点伤害`;
    },
    check(event, player) {
      const num = Math.min(5, player.countHistory("useSkill", (evt) => evt.skill == "natulie") + 1);
      return player.countCards("h") < num || player.countCards("h") - num <= 2 && game.hasPlayer((current) => get.damageEffect(current, player, player));
    },
    async content(event, trigger, player) {
      const num = Math.min(
        5,
        player.countHistory("useSkill", (evt) => evt.skill == "natulie")
      );
      if (player.countCards("h") < num) {
        await player.drawTo(num);
      } else if (player.countCards("h") > num) {
        const result = await player.chooseToDiscard({ forced: true, position: "h", selectCard: player.countCards("h") - num }).forResult();
        if (result?.bool && result.cards?.length) {
          const result2 = await player.chooseTarget({
            prompt: "烈：你可对一名角色造成1点伤害",
            ai(target) {
              return get.damageEffect(target, get.player(), get.player());
            }
          }).forResult();
          if (result2?.bool && result2.targets?.length) {
            const target = result2.targets[0];
            player.line(target);
            await target.damage();
          }
        }
      }
    }
  },
  natuheng: {
    audio: 2,
    enable: ["chooseToUse", "chooseToRespond"],
    locked: false,
    mod: {
      cardUsable(card) {
        if (card?.storage?.natuheng) {
          return Infinity;
        }
      }
    },
    filter(event, player) {
      if (player.hasSkill("natuheng_round")) {
        return false;
      }
      return !player.hasCards("h", (card) => !get.is.damageCard(card)) && event.filterCard(get.autoViewAs({ name: "shan", isCard: true }, "unsure"), player, event) || !player.hasCards("h", (card) => get.is.damageCard(card)) && event.filterCard(get.autoViewAs({ name: "sha", isCard: true, storage: { natuheng: true } }, "unsure"), player, event);
    },
    chooseButton: {
      dialog(event, player) {
        const list = get.inpileVCardList((info) => {
          if (!["sha", "shan"].includes(info[2])) {
            return false;
          }
          if (info[2] == "sha" && player.hasCards("h", (card) => get.is.damageCard(card))) {
            return false;
          }
          if (info[2] == "shan" && player.hasCards("h", (card) => !get.is.damageCard(card))) {
            return false;
          }
          return event.filterCard(
            get.autoViewAs(
              {
                name: info[2],
                nature: info[3],
                storage: { natuheng: true }
              },
              "unsure"
            ),
            player,
            event
          );
        });
        return ui.create.dialog("恒", [list, "vcard"]);
      },
      filter(button, player) {
        return _status.event.getParent().filterCard(
          {
            name: button.link[2],
            storage: { natuheng: true }
          },
          player,
          _status.event.getParent()
        );
      },
      check(button) {
        if (_status.event.getParent().type != "phase") {
          return 1;
        }
        const player = get.player();
        return player.getUseValue({
          name: button.link[2],
          nature: button.link[3],
          storage: { natuheng: true }
        });
      },
      backup(links, player) {
        return {
          audio: "natuheng",
          filterCard: () => false,
          selectCard: -1,
          popname: true,
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            storage: { natuheng: true }
          },
          log: false,
          async precontent(event, trigger, player2) {
            player2.logSkill("natuheng");
            event.getParent().addCount = false;
            player2.addTempSkill("natuheng_round", "roundStart");
          }
        };
      },
      prompt(links, player) {
        return "视为使用一张" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
      }
    },
    hiddenCard(player, name) {
      if (!lib.inpile.includes(name) || player.hasSkill("natuheng_round")) {
        return false;
      }
      return name == "shan" && !player.hasCards("h", (card) => !get.is.damageCard(card)) || name == "sha" && !player.hasCards("h", (card) => get.is.damageCard(card));
    },
    subSkill: {
      round: { charlotte: true, mark: true, intro: { content: "本轮已使用" } },
      backup: {}
    },
    ai: {
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag) {
        const name = tag == "respondSha" ? "sha" : "shan";
        return get.info("natuheng").hiddenCard(player, name);
      },
      order: 1,
      result: {
        player: 1
      }
    }
  },
  natuxing: {
    audio: 2,
    locked: false,
    forced: true,
    trigger: {
      player: ["enterGame", "useCard"],
      global: "phaseBefore"
    },
    isXing(card) {
      const info = lib.card[card.name];
      if (!info || info.type != "trick" && info.type != "delay") {
        return false;
      }
      if (info.notarget) {
        return false;
      }
      return info.selectTarget != void 0;
    },
    filter(event, player) {
      if (event.name == "useCard") {
        return !player.hasCards("h", (card) => card.hasGaintag("natuxing"));
      }
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      if (trigger.name == "useCard") {
        trigger.directHit.addArray(game.players);
        game.log(trigger.card, "不可被响应");
      } else {
        const cards2 = [];
        for (let i = 0; i < ui.cardPile.childNodes.length; i++) {
          const card = ui.cardPile.childNodes[i];
          if (get.info(event.name).isXing(card) && !cards2.map((card2) => get.name(card2)).includes(card.name)) {
            cards2.push(card);
          }
        }
        if (cards2.length) {
          await player.gain({ cards: cards2, animate: "draw", gaintag: [event.name] });
        }
      }
    },
    mod: {
      ignoredHandcard(card, player) {
        if (card.hasGaintag("natuxing")) {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (card.hasGaintag("natuxing")) {
          return false;
        }
      },
      cardEnabled(card, player) {
        const cards2 = [card];
        if (Array.isArray(card.cards)) {
          cards2.addArray(card.cards);
        }
        if (cards2?.some((card2) => card2.hasGaintag("natuxing"))) {
          return false;
        }
      },
      cardUsable(card, player) {
        if (!player.hasCards("h", (card2) => card2.hasGaintag("natuxing"))) {
          return Infinity;
        }
      },
      targetInRange(card, player) {
        if (!player.hasCards("h", (card2) => card2.hasGaintag("natuxing"))) {
          return true;
        }
      }
    },
    group: "natuxing_clear",
    subSkill: {
      clear: {
        audio: "natuxing",
        forced: true,
        trigger: { source: "damageSource" },
        usable(skill, player) {
          return player.countHistory("useCard", (evt) => get.is.damageCard(evt.card));
        },
        filter(event, player) {
          return player.hasCards("h", (card) => card.hasGaintag("natuxing"));
        },
        async content(event, trigger, player) {
          const card = player.getCards("h", (card2) => card2.hasGaintag("natuxing")).randomGet();
          player.removeGaintag("natuxing", card);
        }
      }
    }
  },
  natufu: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter(event, player) {
      if (get.type2(event.card) != "trick") {
        return false;
      }
      const bool1 = !player.hasCards("h", (card) => card.hasGaintag("natuxing") && card.name == event.card.name) && game.hasPlayer((current) => current.isMinHp(true) && current.isDamaged());
      const bool2 = !game.hasPlayer((current) => {
        if (current == player) {
          return false;
        }
        return current.hasHistory("useCard", (evt) => evt.card.name == event.card.name);
      });
      return bool1 || bool2;
    },
    prompt2(event, player) {
      let str = "", num = 1;
      const bool11 = !player.hasCards("h", (card) => card.hasGaintag("natuxing") && card.name == event.card.name);
      const bool1 = bool11 && game.hasPlayer((current) => current.isMinHp(true) && current.isDamaged());
      const bool2 = !game.hasPlayer((current) => {
        if (current == player) {
          return false;
        }
        return current.hasHistory("useCard", (evt) => evt.card.name == event.card.name);
      });
      if (bool11 && bool2) {
        num++;
      }
      if (bool1) {
        str += `令体力值唯一最小的角色回复${num}点体力`;
      }
      if (bool2) {
        str += `对一名角色造成${num}点火焰伤害`;
      }
      return str;
    },
    check(event, player) {
      let num = 1;
      let effect = 0;
      const bool11 = !player.hasCards("h", (card) => card.hasGaintag("natuxing") && card.name == event.card.name);
      const bool1 = bool11 && game.hasPlayer((current) => current.isMinHp(true) && current.isDamaged());
      const bool2 = !game.hasPlayer((current) => {
        if (current == player) {
          return false;
        }
        return current.hasHistory("useCard", (evt) => evt.card.name == event.card.name);
      });
      if (bool11 && bool2) {
        num++;
      }
      if (bool1) {
        const target = game.findPlayer((current) => current.isMinHp(true) && current.isDamaged());
        effect += get.recoverEffect(target, player, player) * num;
      }
      if (bool2) {
        const nums = game.filterPlayer().map((current) => get.damageEffect(current, player, player, "fire") * 2);
        nums.sort((a, b) => b - a);
        effect += nums[0];
      }
      return effect;
    },
    async content(event, trigger, player) {
      let num = 1;
      const bool11 = !player.hasCards("h", (card) => card.hasGaintag("natuxing") && card.name == trigger.card.name);
      const bool1 = bool11 && game.hasPlayer((current) => current.isMinHp(true) && current.isDamaged());
      const bool2 = !game.hasPlayer((current) => {
        if (current == player) {
          return false;
        }
        return current.hasHistory("useCard", (evt) => evt.card.name == trigger.card.name);
      });
      if (bool11 && bool2) {
        player.popup("乘势");
        num++;
      }
      if (bool1) {
        const target = game.findPlayer((current) => current.isMinHp(true) && current.isDamaged());
        if (target?.isIn()) {
          await target.recover(num);
        }
      }
      if (bool2) {
        const result = await player.chooseTarget({
          forced: true,
          prompt: `抚：对一名角色造成${num}点伤害`,
          ai(target) {
            const player2 = get.player();
            return get.event().num * get.damageEffect(target, player2, player2, "fire");
          }
        }).set("num", num).forResult();
        if (result?.bool && result.targets?.length) {
          const target = result.targets[0];
          player.line(target);
          await target.damage(num, "fire");
        }
      }
    }
  },
  natuyi: {
    audio: 2,
    logAudio: (index) => typeof index == "number" ? `natuyi${index}.mp3` : 1,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => get.info("natuyi").filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return target.hasCards("he") && target != player;
    },
    selectTarget: [1, 2],
    multiline: true,
    multitarget: true,
    async content(event, trigger, player) {
      const targets = event.targets;
      let cardx = [];
      await game.doAsyncInOrder(targets, async (target) => {
        if (target.hasCards("he")) {
          const result2 = await target.chooseToGive({
            target: player,
            forced: true,
            position: "he",
            prompt: `${get.translation(player)}对你发动了【义】：请交给其一张牌`,
            ai(card2) {
              const { player: player2, target: target2 } = get.event();
              if (get.attitude(player2, target2) > 0) {
                return 8 - get.value(card2);
              }
              return -get.value(card2);
            }
          }).set("target", player).forResult();
          if (result2?.bool && result2.cards?.length) {
            const cards2 = result2.cards;
            cardx.addArray(cards2);
          }
        }
      });
      cardx = player.getCards("he").filter((card2) => cardx.includes(card2));
      if (!cardx.length) {
        return;
      }
      game.broadcastAll((cardx2) => {
        cardx2.forEach((card2) => card2.addGaintag("natuyi"));
      }, cardx);
      let result;
      const colors = cardx.map((card2) => get.color(card2)).unique();
      const list = [];
      let card = get.autoViewAs({ name: "sha", storage: { natuyi: true } }, cardx);
      if (targets.some((target) => player.canUse(card, target, false, false))) {
        list.push("使用杀");
      }
      if (game.hasPlayer((current) => !targets.includes(current))) {
        list.push("分配牌");
      }
      if (!list.length) {
        return;
      }
      result = list.length > 1 ? await player.chooseControl({
        controls: list,
        prompt: "义：请选择一项",
        ai() {
          return get.event().controls.slice().randomGet();
        }
      }).forResult() : { control: list[0] };
      player.logSkill(event.name, null, null, null, [2]);
      if (result?.control == "使用杀") {
        const list2 = get.inpileVCardList((info) => {
          if (info[2] != "sha") {
            return false;
          }
          const card2 = get.autoViewAs({ name: info[2], nature: info[3], storage: { natuyi: true } }, cardx);
          return targets.some((target) => player.canUse(card2, target, false, false));
        });
        if (!list2.length) {
          return;
        }
        result = await player.chooseButton({
          createDialog: [`义：选择一张【杀】对${get.translation(targets)}使用`, [list2, "vcard"]],
          forced: true,
          ai(button) {
            const card2 = get.autoViewAs({ name: button.link[2], nature: button.link[3], storage: { natuyi: true } }, get.event().cardx);
            return player.getUseValue(card2);
          }
        }).set("cardx", cardx).forResult();
        if (!result?.bool || !result.links?.length) {
          return;
        }
        card = get.autoViewAs({ name: result.links[0][2], nature: result.links[0][3], storage: { natuyi: true } }, cardx);
        const next = player.chooseUseTarget(card, true, false, "nodistance", cardx, `请选择【杀】的目标（${get.translation(cardx)}）`).set("filterTarget", (card2, player2, target) => {
          return player2.canUse(card2, target, false, false) && get.event().targets.includes(target);
        }).set("targets", targets).set("oncard", () => {
          const targetx = _status.event.targets.filter((target) => get.event().targets.includes(target));
          targetx.forEach((target) => {
            target.addTempSkill(event.name + "_nouse");
            target.markAuto(event.name + "_nouse", colors);
          });
        });
        player.when({ global: ["useCardAfter", "useCardToExcluded", "eventNeutralized", "shaMiss", "useCardToEnd"] }).filter((evt) => evt.card?.storage?.natuyi).step(async (event2, trigger2, player2) => {
          game.countPlayer((current) => {
            current.removeSkill("natuyi_nouse");
          });
        });
        await next.forResult();
      }
      if (result?.control == "分配牌") {
        if (!game.hasPlayer((current) => !targets.includes(current) && player != current)) {
          player.addSkill(event.name + "_effect");
          return;
        }
        if (_status.connectMode) {
          game.broadcastAll(function() {
            _status.noclearcountdown = true;
          });
        }
        const given_map = {};
        while (cardx.some((card2) => !card2.hasGaintag("qiaoli_given"))) {
          result = await player.chooseCardTarget({
            filterCard(card2) {
              return get.event().cardx.includes(card2) && !card2.hasGaintag("qiaoli_given");
            },
            filterTarget(card2, player2, target) {
              return !get.event().targets.includes(target);
            },
            selectCard: [1, cardx.length],
            prompt: "义：请分配这些牌",
            forced: true,
            complexCard: true,
            ai1(card2) {
              if (!ui.selected.cards?.length) {
                return get.value(card2);
              }
              return 0;
            },
            ai2(target) {
              const player2 = get.player();
              if (!ui.selected.cards?.length) {
                return 0;
              }
              if (ui.selected.cards[0].name == "du") {
                return -get.attitude(player2, target);
              }
              return get.attitude(player2, target);
            }
          }).set("cardx", cardx).set("targets", targets).forResult();
          if (result.bool && result.cards?.length && result.targets?.length) {
            const {
              cards: cards2,
              targets: [target]
            } = result;
            player.addGaintag(cards2, "qiaoli_given");
            const id = target.playerid;
            given_map[id] ??= [];
            given_map[id].addArray(cards2);
          } else {
            break;
          }
        }
        if (_status.connectMode) {
          game.broadcastAll(function() {
            delete _status.noclearcountdown;
          });
          game.stopCountChoose();
        }
        const list2 = [];
        const loseCards = [];
        for (const i in given_map) {
          const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
          const gain = given_map[source.playerid];
          player.line(source, "green");
          list2.push([source, gain]);
          loseCards.push(...gain);
          source.addSkill(event.name + "_effect");
        }
        await game.loseAsync({
          gain_list: list2,
          player,
          cards: loseCards,
          giver: player,
          animate: "giveAuto",
          gaintag: ["natuyi"]
        }).setContent("gaincardMultiple");
      }
    },
    ai: {
      order: 6,
      result: {
        player: 1,
        target: -1
      }
    },
    subSkill: {
      effect: {
        silent: true,
        popup: false,
        charlotte: true,
        trigger: { player: "useCardToPlayered" },
        filter(event, player) {
          if (!event.cards?.length || !event.cards.some((card) => get.color(card) == "black") || event.target == player) {
            return false;
          }
          return player.hasHistory("lose", (evt) => {
            if ((evt.relatedEvent || evt.getParent()) !== event.getParent()) {
              return false;
            }
            return Object.values(evt.gaintag_map).flat().includes("natuyi");
          });
        },
        logTarget: "target",
        async content(event, trigger, player) {
          const target = event.targets[0];
          target.addTempSkill("natuyi_fengyin");
          if (!player.hasCards("h", (card) => card.hasGaintag("natuyi"))) {
            player.removeSkill(event.name);
          }
        }
      },
      fengyin: {
        charlotte: true,
        inherit: "fengyin"
      },
      nouse: {
        charlotte: true,
        onremove: true,
        intro: { content: "不能使用$牌" },
        mod: {
          cardEnabled(card, player) {
            const cards2 = [card];
            if (Array.isArray(card.cards)) {
              cards2.addArray(card.cards);
            }
            if (cards2.length) {
              if (cards2.map((card2) => get.color(card2)).unique().containsSome(...player.getStorage("natuyi_nouse"))) {
                return false;
              }
            }
          },
          cardSavable(card, player) {
            const cards2 = [card];
            if (Array.isArray(card.cards)) {
              cards2.addArray(card.cards);
            }
            if (cards2.length) {
              if (cards2.map((card2) => get.color(card2)).unique().containsSome(...player.getStorage("natuyi_nouse"))) {
                return false;
              }
            }
          }
        }
      }
    }
  },
  //乐曹丕
  olweidai: {
    audio: 2,
    forced: true,
    trigger: { global: "useCardAfter" },
    filter(event, player) {
      return event.player.group == "wei" && event.targets?.includes(player);
    },
    async content(event, trigger, player) {
      await player.gainMaxHp();
      if (player.isMaxMaxHp()) {
        const num = player.maxHp - player.getHp();
        if (num > 0) {
          await player.loseMaxHp(num);
          await player.draw({ num });
          if (num >= game.players.length && game.hasPlayer((current) => current.group !== "wei")) {
            const result = await player.chooseTarget({
              prompt: "魏代：将一名角色的势力变更为魏",
              forced: true,
              filterTarget(card, player2, target) {
                return target.group !== "wei";
              },
              ai(target) {
                return 1 + Math.random();
              }
            }).forResult();
            if (result?.bool && result.targets?.length) {
              const target = result.targets[0];
              player.line(target);
              await target.changeGroup("wei");
            }
          }
        }
      }
    }
  },
  olliangzi: {
    audio: 2,
    forced: true,
    mod: {
      cardEnabled(card, player) {
        if (get.name(card) === "jiu") {
          return;
        }
        const hs = player.getCards("he", (card2) => get.type(card2) == "equip");
        if (get.type(card) == "equip" && "cards" in card && Array.isArray(card.cards) && card.cards.containsSome(...hs)) {
          return false;
        }
      },
      cardSavable(card, player) {
        if (get.name(card) === "jiu") {
          return;
        }
        const hs = player.getCards("he", (card2) => get.type(card2) == "equip");
        if (get.type(card) == "equip" && "cards" in card && Array.isArray(card.cards) && card.cards.containsSome(...hs)) {
          return false;
        }
      }
    },
    enable: "chooseToUse",
    filterCard(card) {
      return get.type(card) == "equip";
    },
    viewAsFilter(player) {
      return player.countCards("he", (card) => get.type(card) == "equip") > 0;
    },
    viewAs: {
      name: "jiu"
    },
    position: "he",
    prompt: "将一张装备牌当做【酒】使用",
    check(card) {
      return 114514 - get.value(card);
    },
    ai: {
      order: 8,
      result: {
        player: 1
      }
    },
    group: "olliangzi_use",
    subSkill: {
      use: {
        forced: true,
        audio: "olliangzi",
        trigger: { player: "useCard" },
        filter(event, player) {
          if (get.name(event.card) !== "jiu") {
            return false;
          }
          const index = player.getHistory("useCard", (evt) => get.name(evt.card) == "jiu").indexOf(event);
          const num = game.countPlayer((current) => current.group === "wei");
          return index < num && event.addCount !== false;
        },
        async content(event, trigger, player) {
          trigger.addCount = false;
          const stat = trigger.player.getStat("card"), name = trigger.card.name;
          if (typeof stat[name] == "number" && stat[name] > 0) {
            stat[name]--;
          }
        }
      }
    }
  },
  // 魔周瑜
  yiran: {
    audio: 2,
    trigger: { player: "damageBegin3" },
    forced: true,
    filter(event, player) {
      return event.hasNature("fire");
    },
    async content(event, trigger, player) {
      trigger.num++;
    },
    ai: {
      neg: true,
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "fireDamage") && current < 0) {
            return 2;
          }
        }
      }
    }
  },
  //粘兽
  olsuizhong: {
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return player.getHp() <= 1 && player.getHistory("damage").indexOf(event) === 0;
    },
    forced: true,
    async content(event, trigger, player) {
      lib.skill.olsuizhong?.changeSkin(player, event.name);
      await player.recover();
      const targets = game.filterPlayer((target) => {
        if (target === player) return false;
        return get.mode() === "identity" || player.getEnemies().includes(target);
      }).sortBySeat();
      if (targets.length > 0) {
        player.line(targets);
        for (const target of targets) {
          await player.discardPlayerCard(target, "h", true);
        }
      }
    },
    changeSkin(player, name) {
      player.storage[name] = true;
      const num = player.storage.olsuizhong + player.storage.olsuizhong + player.storage.olfuyou - 1;
      if (num > 0) {
        player.changeSkin({ characterName: "ol_re_nianshou" }, `ol_re_nianshou_level${num}`);
      }
    }
  },
  olnianyi: {
    mod: {
      targetInRange(card, player) {
        if (card) {
          return true;
        }
      }
    },
    trigger: {
      player: "phaseZhunbeiBegin",
      global: "phaseAfter"
    },
    filter(event, player) {
      if (event.name === "phaseZhunbei") {
        return player.countDiscardableCards(player, "j") > 0;
      }
      if (event.player === player || !game.hasPlayer((target) => {
        if (target === player) return false;
        return get.mode() === "identity" || player.getEnemies().includes(target);
      })) {
        return false;
      }
      let num = 0;
      player.getHistory("lose", (evt) => {
        num += evt.cards2.length;
      });
      return num >= 3;
    },
    logTarget(event, player) {
      return event.name === "phase" ? game.filterPlayer((target) => {
        if (target === player) return false;
        return get.mode() === "identity" || player.getEnemies().includes(target);
      }).sortBySeat() : [player];
    },
    forced: true,
    async content(event, trigger, player) {
      lib.skill.olsuizhong?.changeSkin(player, event.name);
      if (trigger.name === "phaseZhunbei") {
        await player.discard(player.getDiscardableCards(player, "j").randomGets(2));
      } else {
        for (const target of event.targets) {
          await target.damage();
        }
      }
    }
  },
  olfuyou: {
    trigger: {
      player: "useCard",
      source: "damageSource"
    },
    filter(event, player) {
      if (event.name === "damage" && event.getParent().type !== "card") {
        return false;
      }
      if (get.color(event.card) !== "red" || get.type(event.card) !== "trick") {
        return false;
      }
      return event.name === "useCard" ? lib.skill.dcshixian?.filterx(event) : !player.hasSkill("olfuyou_used");
    },
    forced: true,
    async content(event, trigger, player) {
      lib.skill.olsuizhong?.changeSkin(player, event.name);
      if (trigger.name === "useCard") {
        trigger.effectCount++;
        game.log(trigger.card, "额外结算一次");
      } else {
        player.addTempSkill("olfuyou_used");
        await player.draw();
      }
    },
    subSkill: {
      used: { charlotte: true }
    }
  },
  //乐诸葛亮
  oljiangwu: {
    audio: 2,
    forced: true,
    //要自定义战法池子的可以改这个（）
    zhanfaMap: (() => {
      const list = lib.zhanfa.getList();
      const map = Object.groupBy(list, (i) => lib.zhanfa.getRarity(i, true));
      return map;
    })(),
    trigger: { global: ["roundStart", "roundEnd"] },
    filter(event, player) {
      if (event.name == "phase") {
        return game.roundNumber == 1;
      }
      return true;
    },
    async content(event, trigger, player) {
      const isFirst = trigger.name == "phase";
      const targets = [player];
      const locals = targets.slice();
      const humans = targets.filter((current) => current === game.me || current.isOnline());
      locals.removeArray(humans);
      const map = get.info(event.name).zhanfaMap;
      const shopMap = /* @__PURE__ */ new Map();
      targets.forEach((target) => {
        shopMap.set(target, {
          rare: map["rare"].concat(map["common"]).filter((i) => !player.hasZhanfa(i)).randomGets(2),
          epic: map["epic"].filter((i) => !player.hasZhanfa(i)).randomGets(2),
          legend: map["legend"].filter((i) => !player.hasZhanfa(i)).randomGets(2)
        });
      });
      const videoId = lib.status.videoId++;
      const chooseButton = (player2, shopMap2, isFirst2, videoId2) => {
        const map2 = shopMap2.get(player2);
        const dialog = ui.create.dialog(
          ...[
            [[`讲武：${isFirst2 ? "获得三个不同价值的战法" : "请选择要购买的战法"}`], "addNewRow"],
            [
              (dialog2) => {
                const getCost2 = (rarity) => {
                  return { rare: 1, epic: 2, legend: 3 }[rarity];
                };
                const column = 6;
                const contentx = ui.create.div(".content", dialog2.content);
                contentx.css({
                  width: "fit-content",
                  margin: "auto",
                  //grid布局
                  display: "grid",
                  gridTemplateColumns: `repeat(${column}, 1fr)`
                  //flex布局
                  /*display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",*/
                });
                for (const rarity in map2) {
                  for (const id of map2[rarity]) {
                    const div = ui.create.div(".buttons", contentx);
                    const button = ui.create.button([`zf_${rarity}`, null, id], "vcard", div);
                    div.css({
                      //flex布局要加上这个width
                      //width: "fit-content",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    });
                    button.style.setProperty("opacity", "1");
                    const cost = getCost2(rarity);
                    const purchase = ui.create.button([[cost, rarity, id, button], `${cost}虎符`], "tdnodes", div);
                    dialog2.buttons = dialog2.buttons.concat([purchase]);
                  }
                }
              },
              "handle"
            ]
          ]
        );
        dialog.videoId = videoId2;
        if (player2 != game.me) {
          dialog.style.display = "none";
        }
        const next = player2.chooseButton({
          dialog,
          filterButton(button) {
            const { isFirst: isFirst3, player: player3, selectedZhanfa } = get.event();
            const [cost, rarity, id] = button.link;
            if (isFirst3) {
              return !selectedZhanfa.some((i) => i.link[1] == rarity);
            } else if (player3.hasMark("olxinghan_nocost")) {
              return true;
            } else {
              return player3.countMark("danqi_hufu") >= cost;
            }
          },
          ai(button) {
            const val = get.value({ name: button.link[2] });
            if (get.event().isFirst) {
              return val;
            }
            return val - 6;
          },
          processAI() {
            const { dialog: dialog2 } = get.event();
            let result = { bool: false, links: [] };
            game.check();
            while (ai.basic.chooseButton(get.event().ai)) {
              ui.click.ok();
              if (get.selectableButtons().length) {
                game.check();
              } else {
                break;
              }
            }
            const { selectedZhanfa } = get.event();
            if (selectedZhanfa.length) {
              result = { buttons: selectedZhanfa, confirm: "ok", bool: true, links: selectedZhanfa.map((i) => i.link.slice(1, 3)) };
            }
            return result;
          },
          selectButton: 1,
          forced: isFirst2
        });
        next.set("closeDialog", false);
        next.set("goon", !isFirst2 ? () => true : (event2) => event2.selectedZhanfa.length < 3);
        next.set("_global_waiting", true);
        next.set("isFirst", isFirst2);
        next.set("selectedZhanfa", []);
        next.set("custom", {
          //覆盖点击逻辑实现一个chooseButton事件多次点击确认
          replace: {
            window() {
            },
            button(button) {
              if (!_status.event.isMine()) {
                return;
              }
              if (button.classList.contains("selectable") == false) {
                return;
              }
              if (button.classList.contains("selected")) {
                ui.selected.buttons.remove(button);
                button.classList.remove("selected");
              } else {
                button.classList.add("selected");
                ui.selected.buttons.add(button);
              }
              game.check();
            },
            confirm(bool) {
              const event2 = get.event();
              const resume = () => {
                if (ui.confirm) {
                  ui.confirm.close();
                }
                event2.result = {
                  buttons: event2.selectedZhanfa.slice(),
                  /*cards: ui.selected.cards.slice(),
                  targets: ui.selected.targets.slice(),*/
                  confirm: "ok",
                  bool: true,
                  links: event2.selectedZhanfa.map((i) => i.link.slice(1, 3))
                };
                game.uncheck();
                game.resume();
              };
              if (bool == true) {
                const { player: player3, goon, dialog: dialog2, isFirst: isFirst3 } = event2;
                const button = ui.selected.buttons.slice().reverse()[0];
                if (button && !event2.selectedZhanfa.includes(button)) {
                  const [cost, rarity, id, buttonx] = button.link;
                  event2.selectedZhanfa.add(button);
                  dialog2.buttons.remove(button);
                  ui.selected.buttons.remove(button);
                  button.classList.add("unselectable");
                  button.classList.remove("selectable");
                  button.classList.add("selected");
                  button.innerHTML = "<span>已购买</span>";
                  buttonx.style.setProperty("opacity", "0.5");
                  if (game.online) {
                    game.send("tempResult", button.link.slice(1, 3));
                  } else {
                    if (!isFirst3) {
                      if (player3.hasMark("olxinghan_nocost")) {
                        player3.removeMark("olxinghan_nocost", 1, false);
                      } else {
                        player3.removeMark("danqi_hufu", cost);
                      }
                    }
                    player3.addZhanfa(id);
                  }
                }
                if (!goon(event2) || !button) {
                  resume();
                } else {
                  if (ui.confirm) {
                    ui.confirm.close();
                  }
                  game.check();
                }
              } else {
                resume();
              }
            }
          },
          add: {}
        });
        return next;
      };
      const send = (chooseButton2, ...args2) => {
        chooseButton2(...args2);
        game.resume();
      };
      event._global_waiting = true;
      let time = 1e4;
      if (lib.configOL && lib.configOL.choose_timeout) {
        time = parseInt(lib.configOL.choose_timeout) * 1e3;
      }
      targets.forEach((current) => current.showTimer(time));
      const gainMap = /* @__PURE__ */ new Map();
      const args = [shopMap, isFirst, videoId];
      const getCost = (rarity) => {
        return { rare: 1, epic: 2, legend: 3 }[rarity];
      };
      const solve = function(resolve, reject) {
        return (result, player2) => {
          if (Array.isArray(result)) {
            const [rarity, id] = result;
            if (!isFirst) {
              if (player2.hasMark("olxinghan_nocost")) {
                player2.removeMark("olxinghan_nocost", 1, false);
              } else {
                player2.removeMark("danqi_hufu", getCost(rarity));
              }
            }
            gainMap.set(player2, (gainMap.get(player2) || []).concat([result]));
            player2.addZhanfa(id);
          } else if (result == "ai") {
            if (isFirst) {
              const unselected = ["rare", "epic", "legend"].removeArray(gainMap.get(player2).map((i) => i[0]));
              const map2 = shopMap.get(player2);
              if (unselected.length) {
                unselected.forEach((i) => {
                  const id = map2[i].randomGet();
                  gainMap.set(player2, (gainMap.get(player2) || []).concat([[lib.zhanfa.getRarity(id)], id]));
                  player2.addZhanfa(id);
                });
              }
            }
            resolve();
          } else {
            gainMap.set(player2, result.links);
            resolve();
          }
        };
      };
      await Promise.all(
        //人机先行
        locals.randomSort().concat(humans).map((current) => {
          return new Promise((resolve, reject) => {
            const solver = solve(resolve);
            if (current.isOnline()) {
              current.send(send, chooseButton, current, ...args);
              current.wait(solver);
            } else {
              const next = chooseButton(current, ...args);
              if (current == game.me) {
                if (_status.connectMode) {
                  game.me.wait(solver);
                }
                return next.forResult().then((result) => {
                  if (_status.connectMode) {
                    game.me.unwait(result);
                  } else {
                    solver(result, current);
                  }
                });
              } else {
                return next.forResult().then((result) => solver(result, current));
              }
            }
          });
        })
      ).catch(() => {
      });
      game.broadcastAll("closeDialog", videoId);
      delete event._global_waiting;
      targets.forEach((current) => current.hideTimer());
    },
    //多个chooseButton的写法
    /*async content(event, trigger, player) {
    	const isFirst = trigger.name != "phase";
    	const map = get.info(event.name).zhanfaMap;
    	const gainMap = {
    		rare: map["rare"]
    			.concat(map["common"])
    			.filter(i => !player.hasZhanfa(i))
    			.randomGets(2),
    		epic: map["epic"].filter(i => !player.hasZhanfa(i)).randomGets(2),
    		legend: map["legend"].filter(i => !player.hasZhanfa(i)).randomGets(2),
    	};
    	//适配单人控制（）
    	if (player.isUnderControl()) {
    		game.swapPlayerAuto(player);
    	}
    	const videoId = lib.status.videoId++;
    	const createDialog = (player, isFirst, gainMap, videoId) => {
    		const dialog = ui.create.dialog(
    			...[
    				[[`讲武：${!isFirst ? "获得三个不同价值的战法" : "请选择要购买的战法"}`], "addNewRow"],
    				[
    					dialog => {
    						const getCost = rarity => {
    							return { rare: 1, epic: 2, legend: 3 }[rarity];
    						};
    						const column = 6;
    						const contentx = ui.create.div(".content", dialog.content);
    						contentx.css({
    							display: "grid",
    							gridTemplateColumns: `repeat(${column}, 1fr)`,
    							width: "fit-content",
    							margin: "0 auto",
    							justifyItems: "center",
    							alignItems: "start",
    						});
    						for (const i in gainMap) {
    							for (const j of gainMap[i]) {
    								const div = ui.create.div(".buttons", contentx);
    								const button = ui.create.button([`zf_${i}`, null, j], "vcard", div);
    								div.css({
    									display: "flex",
    									flexDirection: "column",
    									alignItems: "center",
    								});
    								button.style.setProperty("opacity", "1");
    								const cost = getCost(i);
    								const purchase = ui.create.button([[cost, i, j, button], `${cost}虎符`], "tdnodes", div);
    								dialog.buttons = dialog.buttons.concat([purchase]);
    							}
    						}
    					},
    					"handle",
    				],
    			]
    		);
    		dialog.videoId = videoId;
    		if (player != game.me) {
    			dialog.style.display = "none";
    		}
    		return dialog;
    	};
    	if (player.isOnline2()) {
    		player.send(createDialog, player, isFirst, gainMap, videoId);
    	} else {
    		createDialog(player, isFirst, gainMap, videoId);
    	}
    	const selectedRarity = [];
    	while (true) {
    		const result = await player
    			.chooseButton({
    				forced: !isFirst,
    				filterButton(button) {
    					const { isFirst, player, selectedRarity } = get.event();
    					const [cost, rarity] = button.link;
    					if (!isFirst) {
    						return !selectedRarity.includes(rarity);
    					} else if (player.hasMark("olxinghan_nocost")) {
    						return true;
    					} else {
    						return player.countMark("danqi_hufu") >= cost;
    					}
    				},
    				ai(button) {
    					const val = get.value({ name: button.link[2] });
    					if (!get.event().isFirst) {
    						return val;
    					}
    					return val - 6;
    				},
    			})
    			.set("dialog", videoId)
    			.set("closeDialog", false)
    			.set("selectedRarity", selectedRarity)
    			.set("isFirst", isFirst)
    			.set("custom", {
    				add: {
    					confirm(bool) {
    						const event = get.event();
    						const { dialog, result } = event;
    						if (bool && result.buttons?.length) {
    							const button = result.buttons[0];
    							const [cost, rarity, id, buttonx] = button.link;
    							dialog.buttons.remove(button);
    							button.classList.add("selected");
    							button.innerHTML = "<span>已购买</span>";
    							buttonx.style.setProperty("opacity", "0.5");
    						}
    					},
    				},
    				replace: {
    					window() {},
    				},
    			})
    			.forResult();
    		if (result.bool && result.links?.length) {
    			const { links } = result;
    			const [cost, rarity, id] = result.links[0];
    			if (!isFirst) {
    				selectedRarity.add(rarity);
    			} else if (player.hasMark("olxinghan_nocost")) {
    				player.removeMark("olxinghan_nocost", 1, false);
    			} else {
    				player.removeMark("danqi_hufu", cost);
    			}
    			player.addZhanfa(id);
    			if (selectedRarity.length >= 3) {
    				break;
    			}
    		} else {
    			break;
    		}
    	}
    	game.broadcastAll("closeDialog", videoId);
    },*/
    group: ["oljiangwu_hufu"],
    subSkill: {
      hufu: {
        audio: "oljiangwu",
        forced: true,
        trigger: { global: "phaseEnd" },
        async content(event, trigger, player) {
          player.addMark("danqi_hufu");
        }
      }
    }
  },
  olxinghan: {
    audio: 2,
    limited: true,
    enable: "phaseUse",
    filter(event, player) {
      return player.getStorage("zhanfa").length > 0;
    },
    chooseButton: {
      dialog(event, player) {
        const dialog = ui.create.dialog("兴汉：请选择要移去的战法", "hidden");
        dialog.add([player.getStorage("zhanfa").map((i) => [lib.zhanfa.getRarity(i), null, i]), "vcard"]);
        return dialog;
      },
      select: [1, Infinity],
      check(button) {
        const card = { name: button.link[2] };
        if (ui.selected.buttons.length < 2) {
          return 7.5 - get.value(card);
        } else {
          return 6 - get.value(card);
        }
      },
      backup(links, player) {
        return {
          links: links.map((i) => i[2]),
          audio: "olxinghan",
          skillAnimation: true,
          animationColor: "orange",
          async content(event, trigger, player2) {
            player2.awakenSkill("olxinghan");
            const { links: links2 } = get.info(event.name);
            links2.forEach((i) => player2.removeZhanfa(i));
            player2.addMark("olxinghan_nocost", links2.length, false);
            ["zf_dongfeng", "zf_qiaoqi"].slice(0, links2.length).forEach((i) => player2.addZhanfa(i));
          }
        };
      }
    },
    ai: {
      combo: "oljiangwu",
      order: 10,
      result: {
        player: 1
      }
    },
    subSkill: {
      nocost: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "购买的下#个战法无消耗"
        }
      },
      backup: {}
    }
  },
  //宫百万
  dchaoshi: {
    trigger: {
      global: ["phaseEnd"]
    },
    forced: true,
    filter(event, player) {
      return player.getExpansions("dchaoshi").reduce((num, card) => {
        return num + get.number(card);
      }, 0) >= 100;
    },
    async content(event, trigger, player) {
      const cards2 = player.getExpansions(event.name);
      await player.gain(cards2, "gain2");
      player.insertPhase();
    },
    intro: {
      markcount(storage, player, skill) {
        const cards2 = player.getExpansions(skill);
        return cards2.reduce((num, card) => {
          return num + get.number(card);
        }, 0);
      },
      content: "expansion"
    },
    group: ["dchaoshi_effect"],
    subSkill: {
      effect: {
        trigger: {
          player: ["damageEnd"],
          source: ["damageSource"]
        },
        forced: true,
        async content(event, trigger, player) {
          await player.draw();
          const { cards: cards2 } = await player.chooseCard("he", "将一张牌置于武将牌上", true).forResult();
          const next = player.addToExpansion(cards2, "give", player);
          next.gaintag.add("dchaoshi");
          await next;
        }
      }
    }
  },
  //美腿之神
  dcshentui: {
    mod: {
      attackRange(player, num) {
        return num + player.countMark("dcshentui");
      },
      targetInRange(card, player) {
        if (get.name(card, false) == "sha" && get.number(card, false) > player.getAttackRange()) {
          return true;
        }
      },
      cardUsable(card, player) {
        if (get.name(card, false) == "sha" && get.number(card, false) < player.getAttackRange()) {
          return Infinity;
        }
      }
    },
    intro: {
      markcount: "mark",
      content: "攻击范围+#"
    },
    markimage: "image/card/attackRange.png",
    usable: 1,
    enable: "phaseUse",
    async content(event, trigger, player) {
      player.addMark(event.name, 1, false);
      const card = get.autoViewAs({ name: "sha", isCard: true });
      if (player.hasUseTarget(card, void 0, false)) {
        await player.chooseUseTarget(card, true, false);
      }
    },
    ai: {
      order: 4,
      result: {
        player(player, target) {
          return player.hasValueTarget({ name: "sha", isCard: true }, void 0, false) ? 1 : 0;
        }
      }
    },
    group: ["dcshentui_effect"],
    subSkill: {
      effect: {
        trigger: {
          player: "useCard1"
        },
        forced: true,
        locked: false,
        filter(event, player) {
          const num = get.number(event.card);
          return event.card.name == "sha" && typeof num == "number" && num != player.getAttackRange();
        },
        async content(event, trigger, player) {
          const num = player.getAttackRange();
          const number = get.number(trigger.card);
          if (number < num) {
            trigger.directHit.addArray(game.players);
            if (trigger.addCount !== false) {
              trigger.addCount = false;
              const stat = player.getStat().card, name = trigger.card.name;
              if (typeof stat[name] == "number") {
                stat[name]--;
              }
              game.log(trigger.card, "不计入次数");
            }
          } else if (number > num) {
            trigger.baseDamage += 1;
          }
        }
      }
    }
  },
  dcxurui: {
    trigger: {
      player: "phaseEnd"
    },
    forced: true,
    filter(event, player) {
      return !player.hasHistory("sourceDamage");
    },
    async content(event, trigger, player) {
      await player.draw(Math.min(5, player.getAttackRange()));
    }
  },
  //逆转之神
  dcfanzhuan: {
    audio: 1,
    trigger: {
      global: ["phaseBegin"]
    },
    round: 1,
    check: (event, player) => player.getHp() < player.getDamagedHp(),
    async content(event, trigger, player) {
      let hp = player.hp;
      let damageHp = player.getDamagedHp();
      let num = hp - damageHp;
      if (num != 0) {
        const numx = Math.abs(num);
        await player[num > 0 ? "loseHp" : "recover"](numx);
        await player.draw(numx);
      }
    }
  },
  dcniyun: {
    audio: 1,
    mod: {
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return num + player.getDamagedHp();
        }
      },
      attackRange(player, num) {
        return num + player.getDamagedHp();
      }
    }
  },
  //睡眠之神
  dckeshui: {
    trigger: {
      player: ["phaseAnyBefore"]
    },
    usable: 1,
    check(event, player) {
      if (event.name == "phaseJudge") {
        return player.countCards("j") > 0;
      }
      if (event.name == "phaseDiscard") {
        return player.needsToDiscard();
      }
      return false;
    },
    filter(event, player) {
      return !["phaseZhunbei", "phaseJieshu"].includes(event.name) && !event.skipped;
    },
    prompt2(event, player) {
      return `跳过${get.translation(event.name)}，然后你使用牌堆顶一张牌，此牌结算后对随机一个目标额外结算一次，若此牌不可使用，你获得此牌并跳过本回合你的下个阶段且可再次发动此技能`;
    },
    async content(event, trigger, player) {
      trigger.cancel();
      let card = get.cards(1, true)[0];
      if (player.hasUseTarget(card, void 0, false) || get.info(card).notarget && lib.filter.cardEnabled(card, player)) {
        let next = player.chooseUseTarget(card, true, false);
        await next;
        let cardx = get.autoViewAs({ name: card.name });
        let useEvent = player.getHistory("useCard", (evt) => evt.getParent() == next)?.[0];
        if (useEvent?.targets?.length && ["basic", "trick"].includes(get.type(card))) {
          let useNext = player.useCard(cardx, useEvent.targets.slice().randomGet(), false).set("animate", false).set("throw", false);
          useNext.set("_triggered", null);
          await useNext;
        }
      } else {
        await player.gain(card, "draw");
        player.addTempSkill("dckeshui_effect");
        player.getStat().triggerSkill.dckeshui--;
      }
    },
    subSkill: {
      effect: {
        trigger: {
          player: ["phaseAnyBefore"]
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          player.removeSkill(event.name);
          trigger.cancel();
        }
      }
    }
  },
  //变幻之神
  dcbaibian: {
    trigger: {
      player: ["damageEnd", "phaseBegin"]
    },
    forced: true,
    skillList: ["dcshentui", "dcxurui", "dchaoshi", "dcniyun", "dcfanzhuan", "dckeshui", "dchuibian", "dcweiqu", "dcmaimeng", "dczuandai", "dcgunyuan", "quanjia", "xuyuan", "xiaomian"],
    filter(event, player) {
      return get.info("dcbaibian").skillList.some((skill) => !player.hasSkill(skill, null, false, false));
    },
    async content(event, trigger, player) {
      let skill = get.info("dcbaibian").skillList.filter((skill2) => !player.hasSkill(skill2, null, false, false)).randomGet();
      await player.addTempSkills(skill, { player: "phaseAfter" });
    }
  },
  //抉择之神
  dchuibian: {
    audio: 2,
    enable: "phaseUse",
    filterTarget: (card, player, target) => {
      return target.countCards("h") > 0;
    },
    selectTarget: 2,
    multitarget: true,
    multiline: true,
    filter(event, player) {
      return game.countPlayer((curr) => curr.countCards("h") > 0) > 1;
    },
    async content(event, trigger, player) {
      let cards2 = [];
      await game.doAsyncInOrder(
        event.targets,
        async (target, index) => {
          if (index > 0 && cards2.length == 0) {
            return;
          }
          let result = await player.choosePlayerCard("h", target, true).forResult();
          if (result.bool) {
            cards2.push(result.cards[0]);
          }
        },
        () => 0
      );
      if (cards2.length > 1) {
        let bool = get.color(cards2[0]) == get.color(cards2[1]);
        let result = await player.chooseControl(["一样", "不一样"]).set("prompt", "猜测两张牌颜色是否一样").forResult();
        if (result.control == "一样" && bool || result.control == "不一样" && !bool) {
          get.owner(cards2[0])?.$giveAuto(cards2[0], player);
          get.owner(cards2[1])?.$giveAuto(cards2[1], player);
          await player.gain(cards2);
          await player.showCards(cards2);
        } else {
          player.tempBanSkill(event.name);
          await game.loseAsync({
            lose_list: [
              [event.targets[0], [cards2[0]]],
              [event.targets[1], [cards2[1]]]
            ],
            discarder: player
          }).setContent("discardMultiple");
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
  //委屈之神
  dcweiqu: {
    audio: 2,
    trigger: {
      target: "useCardToTarget"
    },
    filter(event, player) {
      return event.targets.length == 1 && event.cards.length > 0 && player.countCards("he") > 0;
    },
    async cost(event, trigger, player) {
      let result = await player.chooseButton([
        "选择一项",
        [
          [
            ["e", "弃置装备区所有牌并令此牌无效"],
            ["h", "弃置所有手牌并摸等量牌"]
          ],
          "textbutton"
        ]
      ]).set("filterButton", (button) => {
        return player.countCards(button.link) > 0;
      }).set("ai", (button) => {
        let player2 = get.player();
        if (button.link == "e") {
          return player2.getCards("e").reduce((value, card) => {
            return value += get.equipValue(card, player2);
          }, 0);
        }
        return 10 - player2.getCards("h").reduce((value, card) => {
          return value += get.value(card, player2);
        }, 0);
      }).forResult();
      event.result = {
        bool: result.bool,
        cost_data: result.links
      };
    },
    usable: 2,
    async content(event, trigger, player) {
      if (event.cost_data[0] == "e") {
        let cards2 = player.getCards("e");
        await player.modedDiscard(cards2);
        game.log(trigger.card, "被无效了");
        trigger.getParent().all_excluded = true;
        player.addTempSkill("dcweiqu_e");
      } else {
        let cards2 = player.getCards("h");
        const result = await player.modedDiscard(cards2).forResult();
        if (result.cards?.length) {
          await player.draw(result.cards.length);
        }
        player.addTempSkill("dcweiqu_h");
      }
      if (player.hasSkill("dcweiqu_e") && player.hasSkill("dcweiqu_h")) {
        await player.draw(2);
      }
    },
    subSkill: {
      e: { charlotte: true },
      h: { charlotte: true }
    }
  },
  //可爱之神
  dcmaimeng: {
    trigger: { player: "changeHpAfter" },
    filter(event, player) {
      return event.changedHp != 0;
    },
    async cost(event, trigger, player) {
      let num = player.getHistory("useSkill", (evt) => evt.skill == event.skill).length + 1;
      let result = await player.chooseButton([
        "选择一项",
        [
          [
            ["draw", `摸${num}张牌并防止本回合你下次受到的伤害`],
            ["give", `令一名其他角色交给你${num}张牌且其本回合使用的下一张牌无效`]
          ],
          "textbutton"
        ]
      ]).set("ai", (button) => {
        let event2 = get.event();
        let player2 = get.player();
        let give = game.hasPlayer((curr) => curr.countCards("he") >= event2.num && get.attitude(player2, curr) < 0);
        if (button.link == "give" && give) {
          return 2;
        }
        return 1;
      }).forResult();
      event.result = {
        bool: result.bool,
        cost_data: result.links
      };
    },
    async content(event, trigger, player) {
      let num = player.getHistory("useSkill", (evt) => evt.skill == event.name).length;
      if (event.cost_data[0] == "draw") {
        await player.draw(num);
        player.addTempSkill("dcmaimeng_effect");
      } else {
        let result = await player.chooseTarget(`卖萌：令一名其他角色交给你${num}张牌`).set("filterTarget", lib.filter.notMe).forResult();
        let target = result.targets?.[0];
        if (target) {
          player.line(target);
          await target.chooseToGive(player, num, true, "he");
          await target.addTempSkill("dcmaimeng_deEffect");
        }
      }
    },
    subSkill: {
      effect: {
        trigger: { player: "damageBegin4" },
        marktext: "萌",
        intro: { content: "防止本回合下一次受到的伤害" },
        onremove: true,
        charlotte: true,
        forced: true,
        mark: true,
        async content(event, trigger, player) {
          player.removeSkill(event.name);
          trigger.cancel();
        }
      },
      deEffect: {
        trigger: { player: "useCard" },
        forced: true,
        mark: true,
        marktext: "萌",
        intro: { content: "本回合使用的下一张牌无效" },
        charlotte: true,
        onremove: true,
        async content(event, trigger, player) {
          player.removeSkill(event.name);
          game.log(trigger.card, "被无效了");
          trigger.all_excluded = true;
        }
      }
    }
  },
  //体重之神
  dcgunyuan: {
    trigger: {
      player: "dying"
    },
    forced: true,
    mod: {
      maxHandcardBase(player) {
        return player.maxHp;
      }
    },
    filter(event, player) {
      return game.getRoundHistory("everything", (evt) => evt.player == player && evt.name == "dying").indexOf(event) == 0;
    },
    async content(event, trigger, player) {
      await player.recoverTo(1);
      if (player.countMark("dcgunyuan") < 3) {
        player.addMark("dcgunyuan", 1, false);
        await player.gainMaxHp();
      }
    }
  },
  dczuandai: {
    trigger: {
      player: "phaseUseBegin"
    },
    filter(event, player) {
      if (!get.cardPile((card) => get.type(card) == "equip" && player.hasUseTarget(card))) {
        return false;
      }
      return true;
    },
    check(event, player) {
      const hs = player.getCards("h");
      return hs.length < 3 && hs.every((card) => !player.hasUseTarget(card));
    },
    async content(event, trigger, player) {
      let card = get.cardPile((card2) => get.type(card2) == "equip" && player.hasUseTarget(card2));
      await player.chooseUseTarget(card, true);
      await player.draw();
      trigger.goto(5);
    }
  },
  //赤兔
  mbjunkui: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      const cards2 = ["cardPile", "discardPile"].flatMap((pos) => Array.from(ui[pos].childNodes));
      const filter = (card) => ["equip3", "equip4", "equip6"].includes(get.subtype(card));
      const cardx = cards2.filter(filter);
      if (cardx.length) {
        await game.cardsGotoSpecial(cardx);
        game.log(cardx, "被移出了游戏");
      }
      for (const target of game.filterPlayer()) {
        const cards3 = target.getCards("hej", filter);
        if (cards3.length) {
          target.$throw(cards3, 1e3);
          game.log(cards3, "被移出了游戏");
          await target.lose(cards3, ui.special);
        }
      }
    },
    mod: {
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return num + 1;
        }
      }
    }
  },
  mbchiyuan: {
    group: "mbchiyuan_draw",
    getnum() {
      const arr = game.getAllGlobalHistory("everything", (evt) => evt.name == "useCard" && get.color(evt.card)).map((evt) => get.color(evt.card)).reverse();
      const firstIndex = arr.indexOf("red");
      if (firstIndex == -1 || arr[0] != "red") {
        return 0;
      }
      const restArr = arr.slice(firstIndex);
      const breakIndex = restArr.findIndex((val) => val !== "red");
      return breakIndex === -1 ? restArr.length : restArr.slice(0, breakIndex).length;
    },
    trigger: {
      player: "useCard"
    },
    audio: 2,
    forced: true,
    locked: false,
    filter(event, player) {
      return player.getHistory("useCard", (evt) => evt.card.name == "sha").indexOf(event) == 0;
    },
    async content(event, trigger, player) {
      game.filterPlayer2(() => true, void 0, true).forEach((target) => {
        const id = target.playerid;
        const map = trigger.customArgs;
        if (!map[id]) {
          map[id] = {};
        }
        if (typeof map[id].shanRequired == "number") {
          map[id].shanRequired++;
        } else {
          map[id].shanRequired = 2;
        }
      });
    },
    mod: {
      targetInRange(card, player, target, now) {
        if (card.name != "sha") {
          return;
        }
        if (game.online) {
          if (!player.countUsed("sha")) {
            return true;
          }
        } else {
          const evt = _status.event.getParent("phase");
          if (evt && evt.name == "phase" && player.getHistory("useCard", (evt2) => {
            return evt2.getParent("phase") == evt;
          }).length == 0) {
            return true;
          }
        }
      }
    },
    subSkill: {
      draw: {
        audio: "mbchiyuan",
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
          return get.info("mbchiyuan").getnum() ?? 0 > 0;
        },
        prompt() {
          return `你可摸${get.cnNumber(get.info("mbchiyuan").getnum())}张牌`;
        },
        manualConfirm: true,
        async content(event, trigger, player) {
          const num = get.info("mbchiyuan").getnum();
          if (num) {
            await player.draw(num);
          }
        },
        ai: {
          order: 8,
          result: {
            player(player) {
              return get.info("mbchiyuan").getnum() * get.effect(player, { name: "draw" }, player, player);
            }
          }
        }
      }
    }
  },
  //绝影
  mbjiguan: {
    audio: 2,
    audioname: ["mb_dilu"],
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      const cards2 = ["cardPile", "discardPile"].map((pos) => Array.from(ui[pos].childNodes)).flat();
      const filter = (card) => ["equip3", "equip4"].includes(get.subtype(card));
      const cardx = cards2.filter(filter);
      if (cardx.length) {
        await game.cardsGotoSpecial(cardx);
        game.log(cardx, "被移出了游戏");
      }
      for (const target of game.filterPlayer()) {
        const cards3 = target.getCards("hej", filter);
        if (cards3.length) {
          target.$throw(cards3, 1e3);
          game.log(cards3, "被移出了游戏");
          await target.lose(cards3, ui.special);
        }
      }
    },
    mod: {
      maxHandcard(player, num) {
        return num + 2;
      }
    }
  },
  mbzhengpeng: {
    judge(player) {
      let num = 0;
      if (player.hasHistory("damage")) {
        num++;
      }
      if (player.hasHistory("lose", (evt) => {
        return evt.cards2?.some((card) => get?.type(card) == "equip");
      })) {
        num++;
      }
      if (_status.currentPhase != player && player.hasHistory("gain", (evt) => {
        return evt?.cards?.length;
      })) {
        num++;
      }
      return num;
    },
    audio: 2,
    onremove: true,
    trigger: {
      global: "phaseAfter"
    },
    filter(event, player) {
      return game.hasPlayer((current) => get.info("mbzhengpeng").judge(current) > 0);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return get.event().targets.includes(target);
      }).set(
        "targets",
        game.filterPlayer((current) => get.info(event.skill).judge(current) > 0)
      ).set("ai", (target) => {
        const player2 = get.player();
        return get.info("mbzhengpeng").judge(target) * get.effect(player2, { name: "draw" }, player2, player2) + get.effect(player2, { name: "losehp" }, player2, player2) * player2.countMark("mbzhengpeng");
      }).forResult();
    },
    async content(event, trigger, player) {
      const skill = event.name;
      player.addMark(skill, 1, false);
      player.when({ global: ["roundStart"] }).step(async () => player.clearMark("mbzhengpeng", false));
      await player.loseHp(player.countMark(skill) - 1);
      const num = get.info(skill).judge(event.targets[0]);
      if (num > 0) {
        await player.draw(num);
      }
      if (num == 3) {
        player.clearMark(skill, false);
        let cards2 = [];
        for (let type of ["basic", "trick", "equip"]) {
          const card = get.discardPile((card2) => get.type2(card2) == type);
          if (card) {
            cards2.push(card);
          }
        }
        if (cards2.length) {
          await player.gain(cards2, "gain2");
        }
      }
    },
    intro: {
      content: "当前X为：#"
    }
  },
  //的卢
  mbyuetan: {
    group: "mbyuetan_recover",
    audio: 2,
    trigger: {
      global: "useCardToTargeted"
    },
    filter: function(event, player) {
      return get.is.damageCard(event.card, true) && get.distance(player, event.target) <= 1;
    },
    check: function(event, player) {
      return get.attitude(player, event.target) >= 0;
    },
    logTarget: "target",
    async cost(event, trigger, player) {
      const target = trigger.target;
      if (target == player) {
        event.result = await player.chooseBool(`###${get.prompt(event.skill, target)}###此牌结算结束后若其未受到伤害，你摸一张牌。`).set("choice", true).forResult();
      } else {
        event.result = await player.chooseCard("he", `###${get.prompt(event.skill, target)}###你可交给其一张牌且此牌结算结束后若其未受到伤害，你摸一张牌。`).set("ai", (card) => {
          if (get.attitude(player, get.event().target) < 0) {
            return 0;
          }
          return 6 - get.value(card);
        }).set("target", target).forResult();
      }
    },
    async content(event, trigger, player) {
      const {
        targets: [target],
        cards: cards2
      } = event;
      if (cards2?.length) {
        await player.give(cards2, target);
        await game.delay();
      }
      player.when({ global: "useCardAfter" }).filter((evt) => evt.card == trigger.card).step(async (event2, trigger2, player2) => {
        if (!target.hasHistory("damage", (evt) => evt.card == trigger2.card)) {
          await player2.draw();
        }
      });
    },
    subSkill: {
      recover: {
        audio: "mbyuetan",
        trigger: {
          global: ["gainAfter"]
        },
        locked: false,
        forced: true,
        filter(event, player) {
          const evt = event.getl?.(player);
          const evtx = event.getParent();
          if (!evt?.cards2?.length || evtx?.name != "mbyuetan" || evt?.cards2[0] != evtx?.cards[0]) {
            return false;
          }
          return player.isDamaged() && (player.getAllHistory("lose", (evt2) => {
            return evt2.cards2?.length && evt2.getParent().name == "gain" && evt2.getParent(2).name == "mbyuetan";
          }).map((evt2) => evt2.getParent()).indexOf(event) + 1) % 2 == 0;
        },
        async content(event, trigger, player) {
          await player.recover();
        }
      }
    }
  },
  //高达木牛流马
  mbshezi: {
    audio: 2,
    trigger: {
      player: ["phaseZhunbeiBegin"]
    },
    forced: true,
    filter(event, player) {
      return game.hasPlayer((current) => current.countCards("hej"));
    },
    async content(event, trigger, player) {
      const result = await player.chooseTarget(
        get.prompt2(event.name),
        (card, player2, target) => {
          return target.countCards("hej");
        },
        true
      ).set("ai", (target) => {
        const player2 = get.player();
        return -get.attitude(player2, target);
      }).forResult();
      if (result?.bool && result?.targets?.length) {
        const target = result.targets[0];
        player.line(target);
        const control = await player.chooseControl("手牌区", "装备区", "判定区", true).set("ai", function() {
          const target2 = get.event().target;
          if (target2.countCards("h") > target2.countCards("e")) {
            return 0;
          }
          return 1;
        }).set("target", target).set("prompt", `请选择${get.translation(target)}的一个区域`).forResult();
        const choice = {
          手牌区: "h",
          装备区: "e",
          判定区: "j"
        }[control.control];
        if (target.countCards(choice, (card) => get.type(card) == "equip")) {
          await player.gain(target.getGainableCards(player, choice), target, "giveAuto");
        } else {
          target.chat("沒有！没有！没有！");
        }
      }
    }
  },
  mbyixing: {
    group: "mbyixing_update",
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    locked: false,
    manualConfirm: true,
    async content(event, trigger, player) {
      const cards2 = player.getExpansions(event.name);
      if (cards2?.length) {
        await player.loseToDiscardpile(cards2);
        await player.draw(cards2.length);
      }
      if (!player.countCards("he", (card) => get.type(card) == "equip")) {
        return;
      }
      const result = await player.chooseCard("he", "你可将任意张装备牌置于武将牌上，称为“器”", [1, Infinity], (card) => get.type(card) == "equip").set("ai", (card) => {
        return 6 - get.value(card);
      }).forResult();
      if (result.bool) {
        const next = player.addToExpansion(result.cards, player, "give");
        next.gaintag.add(event.name);
        await next;
      }
    },
    marktext: "器",
    intro: {
      name: "易型（器）",
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
        player.removeAdditionalSkill(skill);
      }
    },
    mod: {
      globalFrom(from, to, distance) {
        return distance + from.getExpansions("mbyixing").reduce((sum, card) => sum + (lib.card[get.name(card)]?.distance?.globalFrom || 0), 0);
      },
      globalTo(from, to, distance) {
        return distance + to.getExpansions("mbyixing").reduce((sum, card) => sum + (lib.card[get.name(card)]?.distance?.globalTo || 0), 0);
      },
      attackRange(from, distance) {
        return distance - from.getExpansions("mbyixing").reduce((sum, card) => sum + (lib.card[get.name(card)]?.distance?.attackFrom || 0), 0);
      },
      attackTo(from, to, distance) {
        return distance + to.getExpansions("mbyixing").reduce((sum, card) => sum + (lib.card[get.name(card)]?.distance?.attackTo || 0), 0);
      }
    },
    ai: {
      result: {
        player(player) {
          if (player.hp < 3) {
            return 5;
          }
          return 1;
        }
      }
    },
    subSkill: {
      update: {
        trigger: {
          player: ["loseAfter"],
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        charlotte: true,
        popup: false,
        forced: true,
        filter(event, player) {
          const skill = "mbyixing";
          if (event?.gaintag?.includes(skill)) {
            return event.name == "loseAsync" ? event.type == "addToExpansion" : event.name == "addToExpansion";
          }
          const evt = event?.getl(player);
          return evt?.xs?.length && evt?.xs?.some((card) => evt?.gaintag_map[card.cardid]?.includes(skill));
        },
        async content(event, trigger, player) {
          const cards2 = player.getExpansions("mbyixing");
          player.addAdditionalSkill("mbyixing", get.skillsFromEquips(cards2));
        }
      }
    }
  },
  //哈基术
  mbjimi: {
    audio: 4,
    forced: true,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    logTarget: () => game.players,
    logAudio: () => 2,
    async content(event, trigger, player) {
      const { targets } = event;
      const map = /* @__PURE__ */ new Map();
      targets.forEach(
        (target) => map.set(
          target,
          target.getCards("h", (card) => !["tao", "jiu"].includes(get.name(card)))
        )
      );
      await game.loseAsync({ lose_list: Array.from(map.entries()) }).setContent("chooseToCompareLose");
      await game.doAsyncInOrder(
        targets.sortBySeat(game.findPlayer((i) => i.getSeatNum() == 1)),
        async (target) => {
          const cards2 = [];
          const list = [[], []];
          const hs = map.get(target);
          while (cards2.length < hs.length) {
            const card = get.cardPile((card2) => ["tao", "jiu"].includes(get.name(card2)) && !cards2.includes(card2));
            if (card) {
              cards2.push(card);
              if (get.position(card) == "c") {
                list[0].push(hs[list[0].length]);
                list[1].push(card);
              }
            } else {
              break;
            }
          }
          if (list[0].length) {
            await game.cardsGotoPile(list[0], (event2, card) => event2.list[1][event2.list[0].indexOf(card)]).set("list", list);
          }
          if (cards2.length) {
            target._start_cards = target.getCards("h").concat(cards2);
            return target.gain(cards2, "draw").set("delay", false);
          }
        },
        () => false
      );
    },
    group: "mbjimi_gain",
    subSkill: {
      gain: {
        audio: ["mbjimi3.mp3", "mbjimi4.mp3"],
        forced: true,
        trigger: {
          global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"]
        },
        filter(event, player) {
          if (event.name == "cardsDiscard") {
            const evt = event.getParent();
            if ((evt.relatedEvent || evt.getParent()).name == "useCard") {
              return false;
            }
          }
          return event.getd?.().some((card) => ["tao", "jiu"].includes(get.name(card)));
        },
        async content(event, trigger, player) {
          const num = get.discarded().filter((card2) => ["tao", "jiu"].includes(get.name(card2))).length;
          const card = get.cardPile((card2) => get.is.damageCard(card2) && get.cardNameLength(card2) == num);
          if (card) {
            await player.gain(card, "gain2");
          } else {
            player.chat("哈基米哦南北路多");
          }
        }
      }
    }
  },
  mbmaodie: {
    audio: 4,
    forced: true,
    trigger: { player: "useCardAfter" },
    filter(event, player) {
      if (player.hasHistory("sourceDamage", (evt) => evt.card == event.card)) {
        return true;
      }
      return player.countMark(`mbmaodie_used`) < 2 && get.info("mbmaodie").getCards(player, event.targets || []).length > 0;
    },
    getCards(player, targets) {
      return targets.flatMap((target) => (target._start_cards || []).filter((card) => "cdhej".includes(get.position(card)) && get.owner(card) !== player));
    },
    logAudio: (event, player) => player.hasHistory("sourceDamage", (evt) => evt.card == event.card) ? 2 : ["mbmaodie3.mp3", "mbmaodie4.mp3"],
    async content(event, trigger, player) {
      if (player.hasHistory("sourceDamage", (evt) => evt.card == trigger.card)) {
        player.addTempSkill(`${event.name}_limit`);
        player.setStorage(`${event.name}_limit`, get.cardNameLength(trigger.card), true);
      } else {
        player.addTempSkill(`${event.name}_used`);
        player.addMark(`${event.name}_used`, 1, false);
        const card = get.info(event.name).getCards(player, trigger.targets).randomGet();
        if (card) {
          let animate = ["gain2"];
          if (get.owner(card)) {
            animate = [get.owner(card), "giveAuto"];
          }
          await player.gain(card, ...animate);
          return;
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      },
      limit: {
        charlotte: true,
        onremove: true,
        silent: true,
        trigger: { player: "useCard1" },
        filter(event, player) {
          return get.is.damageCard(event.card);
        },
        async content(event, trigger, player) {
          player.removeSkill(event.name);
        },
        mod: {
          cardEnabled(card, player) {
            const storage = player.storage.mbmaodie_limit;
            if (!storage || typeof storage != "number" || !get.is.damageCard(card)) {
              return;
            }
            return get.cardNameLength(card) > storage;
          }
        },
        intro: {
          markcount: (storage) => storage,
          content: "下一次使用的伤害牌字数需大于#"
        }
      }
    }
  },
  //魔白马
  dmchongqi: {
    audio: 2,
    trigger: {
      player: "useCardToPlayered"
    },
    usable: 1,
    filter(event, player) {
      return event.card.name == "sha" && event.target.countDiscardableCards(player, "he");
    },
    check(event, player) {
      return get.effect(event.target, { name: "guohe_copy2" }, player, player) > 0;
    },
    logTarget: "target",
    async content(event, trigger, player) {
      const target = event.targets[0];
      if (target.countDiscardableCards(player, "he")) {
        await player.discardPlayerCard(target, "he", true);
      }
      if (player.inRange(target) && !target.inRange(player)) {
        game.log(player, "触发了", "#y游击", "效果");
        player.popup("游击", "fire");
        const evt = trigger.getParent();
        evt.baseDamage ??= 1;
        evt.baseDamage++;
      }
    }
  },
  dmfanquan: {
    audio: 2,
    trigger: {
      player: "damageEnd"
    },
    filter(event, player) {
      return game.hasPlayer((current) => current != player);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), lib.filter.notMe).set("ai", (target) => {
        const player2 = get.player();
        const eff = get.damageEffect(target, player2, player2);
        if (player2.inRange(target) && target.inRange(player2)) {
          return eff * 2;
        }
        return eff;
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await target.damage();
      if (player.inRange(target) && target.inRange(player)) {
        game.log(player, "触发了", "#y搏击", "效果");
        player.popup("搏击", "fire");
        if (trigger.num > 0) {
          await target.damage(trigger.num);
        }
        const skill = "dmfanquan_range";
        player.addTempSkill(skill);
        player.addMark(skill, 1, false);
      }
    },
    subSkill: {
      range: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "计算与其他角色的距离+#"
        },
        mod: {
          globalFrom(from, to, distance) {
            return distance + from.countMark("dmfanquan_range");
          }
        }
      }
    }
  },
  bachiqionggouyu_skill: {
    trigger: {
      player: ["phaseUseEnd", "phaseDrawBegin"]
    },
    forced: true,
    equipSkill: true,
    filter(event, player) {
      const damageed = player.isDamaged();
      if (event.name == "phaseUSe") {
        return damageed;
      } else {
        return !damageed && !event.numFixed;
      }
    },
    async content(event, trigger, player) {
      if (trigger.name == "phaseUse") {
        await player.recover();
      } else {
        trigger.num += 2;
      }
    }
  },
  bazhijing_skill: {
    trigger: {
      player: ["damageAfter", "damageBegin"]
    },
    equipSkill: true,
    forced: true,
    init(player) {
      player.setStorage("bazhijing", []);
    },
    filter(event, player, triggername) {
      if (player.hasSkillTag("unequip2")) {
        return false;
      }
      if (event.source && event.source.hasSkillTag("unequip", false, {
        name: event.card ? event.card.name : null,
        target: player,
        card: event.card
      })) {
        return false;
      }
      const bool = player.getStorage("bazhijing").includes(event.card.name);
      if (triggername == "damageAfter") {
        return !bool;
      } else {
        return bool;
      }
    },
    async content(event, trigger, player) {
      if (event.triggername == "damageAfter") {
        player.markAuto("bazhijing", trigger.card.name);
      } else {
        trigger.cancel();
      }
    }
  },
  olmojin: {
    audio: 2,
    trigger: {
      player: ["enterGame", "mojinSucces"],
      global: ["phaseBefore"]
    },
    extraCards: ["bintieshuangji", "wuxinghelingshan", "wutiesuolian", "wushuangfangtianji", "chixueqingfeng", "guilongzhanyuedao", "huxinjing", "heiguangkai", "linglongshimandai", "hongmianbaihuapao", "qimenbagua", "guofengyupao", "zhaogujing", "sanlve", "tianjitu", "taigongyinfu", "shufazijinguan", "xuwangzhimian", "huntianyi", "bachiqionggouyu", "bazhijing", "changandajian_equip1", "changandajian_equip2", "changandajian_equip3", "changandajian_equip4", "changandajian_equip5"],
    init(player, skill) {
      const mojinMap = [
        [
          "使用至少三张非基本牌",
          { player: ["useCard"] },
          (evt, player2) => {
            const history = player2.getAllHistory("useCard", (evt2) => get.type(evt2.card, null, false) != "basic" && !player2.getStorage("immojin").includes(evt2));
            return history.length >= 3;
          },
          (player2) => {
            const history = player2.getAllHistory("useCard", (evt) => get.type(evt.card, null, false) != "basic");
            player2.setStorage("immojin", history);
          }
        ],
        [
          "本回合因弃置失去至少两张牌",
          { player: ["loseAfter"], global: ["loseAsyncAfter"] },
          (evt, player2) => {
            if (evt.type != "discard") {
              return false;
            }
            const count = player2.getHistory("lose", (evt2) => evt2.type == "discard" && !player2.getStorage("immojin").includes(evt2)).reduce((num, evt2) => num += evt2.cards2.length, 0);
            return count >= 2;
          },
          (player2) => {
            const history = player2.getAllHistory("lose", (evt) => evt.type == "discard");
            player2.setStorage("immojin", history);
          }
        ],
        [
          "使用至少两张装备牌",
          { player: ["useCard"] },
          (evt, player2) => {
            const history = player2.getAllHistory("useCard", (evt2) => get.type(evt2.card, null, false) == "equip" && !player2.getStorage("immojin").includes(evt2));
            return history.length >= 2;
          },
          (player2) => {
            const history = player2.getAllHistory("useCard", (evt) => get.type(evt.card, null, false) == "equip");
            player2.setStorage("immojin", history);
          }
        ],
        [
          "使用三张基本牌",
          { player: ["useCard"] },
          (evt, player2) => {
            const history = player2.getAllHistory("useCard", (evt2) => get.type(evt2.card, null, false) == "basic" && !player2.getStorage("immojin").includes(evt2));
            return history.length >= 3;
          },
          (player2) => {
            const history = player2.getAllHistory("useCard", (evt) => get.type(evt.card, null, false) == "basic");
            player2.setStorage("immojin", history);
          }
        ],
        [
          "使用两张锦囊牌",
          { player: ["useCard"] },
          (evt, player2) => {
            const history = player2.getAllHistory("useCard", (evt2) => get.type(evt2.card, "trick", false) == "trick" && !player2.getStorage("immojin").includes(evt2));
            return history.length >= 2;
          },
          (player2) => {
            const history = player2.getAllHistory("useCard", (evt) => get.type(evt.card, "trick", false) == "trick");
            player2.setStorage("immojin", history);
          }
        ],
        [
          "单次造成至少2点伤害",
          { source: ["damageSource"] },
          (evt, player2) => {
            const history = player2.getAllHistory("sourceDamage", (evt2) => evt2.num >= 2 && !player2.getStorage("immojin").includes(evt2));
            return history.length >= 1;
          },
          (player2) => {
            const history = player2.getAllHistory("sourceDamage", (evt) => evt.num >= 2);
            player2.setStorage("immojin", history);
          }
        ],
        [
          "令一名角色进入濒死",
          { source: ["dying"] },
          (evt, player2) => {
            return true;
          }
        ],
        [
          "造成1点属性伤害",
          { source: ["damageSource"] },
          (evt, player2) => {
            return evt.hasNature();
          }
        ],
        [
          "获得一名角色至少一张牌",
          { player: ["gainAfter"] },
          (evt, player2) => {
            return evt.source && evt.source != player2;
          }
        ],
        [
          "使用【酒】【杀】",
          { player: ["useCard"] },
          (evt, player2) => {
            return evt.card.name == "sha" && evt.jiu;
          }
        ],
        [
          "连续使用牌指定同一角色为目标",
          { player: ["useCardToPlayered"] },
          (evt, player2) => {
            const last = player2.getAllHistory("useCard").at(-2);
            return last?.targets?.includes(evt.target);
          }
        ],
        [
          "本回合获得至少四张牌",
          { player: ["gainAfter"] },
          (evt, player2) => {
            const count = player2.getHistory("gain", (evt2) => !player2.getStorage("immojin").includes(evt2)).reduce((num, evt2) => num += evt2.cards.length, 0);
            return count >= 4;
          },
          (player2) => {
            const history = player2.getAllHistory("gain");
            player2.setStorage("immojin", history);
          }
        ],
        [
          "装备区牌数变化后最多",
          { player: "loseAfter", global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
          (evt, player2) => {
            if ((() => {
              if (evt.name == "equip" && evt.player == player2) {
                return false;
              }
              const evtx = evt.getl(player2);
              if (evtx?.es?.length) {
                return false;
              }
              return true;
            })()) {
              return false;
            }
            return !evt.immojin && player2.isMaxEquip();
          }
        ],
        [
          "使用至少一张延时锦囊牌",
          { player: ["useCard"] },
          (evt, player2) => {
            const history = player2.getAllHistory("useCard", (evt2) => get.type(evt2.card, null, false) == "delay" && !player2.getStorage("immojin").includes(evt2));
            return history.length >= 1;
          },
          (player2) => {
            const history = player2.getAllHistory("useCard", (evt) => get.type(evt.card, null, false) == "delay");
            player2.setStorage("immojin", history);
          }
        ],
        [
          "一名其他角色失去最后手牌",
          { global: ["loseAfter", "loseAsyncAfter", "gainAfter", "addToExpansionAfter", "equipAfter", "addJudgeAfter"] },
          (evt, player2) => {
            return game.hasPlayer((current) => {
              if (current == player2 || current.countCards("h")) {
                return false;
              }
              return evt.getl?.(current)?.hs?.length;
            });
          }
        ]
      ];
      const list = get.info(skill).extraCards;
      for (let pack in lib.cardPack) {
        if (!["standard", "extra", "yingbian", "mode_boss_card"].includes(pack)) {
          continue;
        }
        const cards2 = lib.cardPack[pack].filter((card) => {
          if (card.destroy) {
            return false;
          }
          return pack != "mode_boss_card" || card.type == "equip";
        });
        list.addArray(cards2);
      }
      game.loadModeAsync("boss", function(mode) {
        for (let i in mode.translate) {
          if (lib.translate[i]) {
            continue;
          }
          lib.translate[i] = mode.translate[i];
        }
        lib.cardPack["mode_boss_card"] ??= Object.keys(mode.card);
        for (let i in mode.card) {
          if (lib.card[i]) {
            continue;
          }
          lib.card[i] = mode.card[i];
        }
        for (let i in mode.skill) {
          if (lib.skill[i]) {
            continue;
          }
          lib.skill[i] = mode.skill[i];
        }
        Object.keys(mode.card).forEach((i) => game.finishCard(i));
        Object.keys(mode.skill).forEach((i) => game.finishSkill(i));
        const list2 = [];
        for (let pack in lib.cardPack) {
          if (!["standard", "extra", "yingbian", "mode_boss_card"].includes(pack)) {
            continue;
          }
          const cards2 = lib.cardPack[pack].filter((card) => {
            const info = lib.card[card];
            if (info.destroy) {
              return false;
            }
            return pack != "mode_boss_card" || info.type == "equip";
          });
          list2.addArray(cards2);
        }
        game.countPlayer((current) => {
          if (current.hasSkill("olmojin", null, null, false)) {
            current.markAuto("mojinAward", list2);
          }
        });
      });
      player.setStorage("mojinMap", mojinMap);
      player.setStorage("mojinAward", list);
    },
    marktext: "摸金",
    intro: {
      content(storage) {
        return storage;
      }
    },
    filter(event, player, triggername) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async cost(event, trigger, player) {
      const list = player.getStorage("mojinMap").randomGets(3);
      const buttons = list.map((info) => [info, info[0]]);
      const result = await player.chooseButton(["选择一项进行摸金", [buttons, "textbutton"]]).set("forced", true).forResult();
      event.result = {
        bool: result.bool,
        confirm: result.confirm,
        cost_data: result.links[0]
      };
    },
    async content(event, trigger, player) {
      const data = event.cost_data;
      if (data[3]) {
        game.broadcastAll((player2, data2) => data2[3](player2), player, data);
      }
      player.setStorage("olmojin", data[0]);
      player.markSkill(event.name);
      player.when(data[1]).filter(data[2]).step(async (event2, trigger2, player2) => {
        if (data[3]) {
          game.broadcastAll((player3, data2) => data2[3](player3), player2, data);
        }
        const type = ["basic", "trick", "equip"].randomGet();
        const info = [
          player2.getStorage("mojinAward").filter((name) => get.type2(name) == type).randomGet(),
          lib.suit.randomGet(),
          get.rand(1, 13)
        ];
        if (info[0] == "sha") {
          info[3] = ["ice", "thunder", "fire", void 0].randomGet();
        }
        const card = game.createCard(...info);
        const next = player2.gain(card, "draw");
        next.set("immojin", true);
        if (["basic", "trick"].includes(get.type2(card.name, false))) {
          let gaintag = "olmojin_directHit";
          if (get.tag(card, "recover") && Math.random() > 0.5) {
            gaintag = "olmojin_baseDamage";
          }
          next.gaintag.add(gaintag);
        }
        await next;
        event2.trigger("mojinSucces");
      });
    },
    group: ["olmojin_equip", "olmojin_effect"],
    subSkill: {
      equip: {
        audio: "olmojin",
        trigger: {
          player: ["phaseBegin"]
        },
        filter(event, player) {
          return player.hasEquipableSlot(1);
        },
        forced: true,
        async content(event, trigger, player) {
          const card = game.createCard("luoyangchan", "spade", 13);
          await player.equip(card, "gain2");
        }
      },
      effect: {
        audio: "olmojin",
        trigger: {
          player: "useCard",
          global: "recoverBegin"
        },
        filter(event, player) {
          const useCard = event.getParent("useCard", true, true);
          return useCard?.player == player && player.hasHistory("lose", (evt) => {
            const evtx = evt.relatedEvent || evt.getParent();
            if (evtx != useCard) {
              return false;
            }
            const list = Object.values(evt.gaintag_map).flat();
            if (event.name == "useCard") {
              return list.includes("olmojin_directHit");
            }
            return list.includes("olmojin_baseDamage");
          });
        },
        forced: true,
        async content(event, trigger, player) {
          if (trigger.name == "useCard") {
            trigger.directHit.addArray(game.players);
          } else {
            trigger.num++;
          }
        }
      }
    }
  },
  oldingbao: {
    audio: 2,
    enable: ["phaseUse"],
    filterTarget: () => false,
    limited: true,
    selectTarget: -1,
    filterCArd: () => false,
    selectCard: -1,
    filter(event, player) {
      return player.storage.olmojin;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const phase = get.event().getParent("phaseUse");
      if (phase?.name == "phaseUse") {
        phase.skipped = true;
      }
      const data = player.getStorage("mojinMap").find((data2) => player.getStorage("olmojin") == data2[0]);
      if (data?.[3]) {
        game.broadcastAll((player2, data2) => data2[3](player2), player, data);
      }
      const type = ["basic", "trick", "equip"].randomGet();
      const info = [
        player.getStorage("mojinAward").filter((name) => get.type2(name) == type).randomGet(),
        lib.suit.randomGet(),
        get.rand(1, 13)
      ];
      if (info[0] == "sha") {
        info[3] = ["ice", "thunder", "fire", void 0].randomGet();
      }
      const card = game.createCard(...info);
      const next = player.gain(card, "draw");
      next.set("immojin", true);
      if (["basic", "trick"].includes(get.type2(card.name, false))) {
        let gaintag = "olmojin_directHit";
        if (get.tag(card, "recover") && Math.random() > 0.5) {
          gaintag = "olmojin_baseDamage";
        }
        next.gaintag.add(gaintag);
      }
      await next;
      event.trigger("mojinSucces");
    }
  },
  luoyangchan_skill: {
    enable: ["phaseUse"],
    usable: 1,
    equipSkill: true,
    filterCard(card, player) {
      if (!player.hasSkill("luoyangchan_skill", null, false)) {
        const cards2 = player.getCards("e", (cardx) => get.name(cardx) == "luoyangchan");
        if (cards2.every((cardx) => cardx == card)) {
          return false;
        }
      }
      return get.color(card, player) == "black" && lib.filter.cardDiscardable(card, player, "luoyangchan_skill");
    },
    filter(event, player) {
      return player.countCards("he", (card) => {
        if (!player.hasSkill("luoyangchan_skill", null, false)) {
          const cards2 = player.getCards("e", (cardx) => get.name(cardx) == "luoyangchan");
          if (cards2.every((cardx) => cardx == card)) {
            return false;
          }
        }
        return get.color(card, player) == "black" && lib.filter.cardDiscardable(card, player, "luoyangchan_skill");
      });
    },
    position: "he",
    discard: false,
    lose: false,
    async content(event, trigger, player) {
      await player.modedDiscard(event.cards);
      const cards2 = player.getCards("h");
      await player.loseToDiscardpile(cards2);
      await player.draw(cards2.length);
    }
  },
  //乐刘禅 ————蜀十头
  oltuoquan: {
    audio: 2,
    init(player, skill) {
      player.setStorage(skill, get.info(skill).fuchens.slice(0), true);
    },
    onremove(player, skill) {
      player.setStorage(skill, null);
      player.setStorage(`${skill}_current`, null);
      game.broadcastAll(
        (player2, names) => {
          if (Array.isArray(player2.tempname)) {
            player2.tempname.removeArray(names);
          }
        },
        player,
        player.getStorage(`${skill}_current2`)
      );
      player.setStorage(`${skill}_current2`, null);
    },
    mark: true,
    intro: {
      mark(dialog, storage, player) {
        dialog.addText(`剩余辅臣（蒋琬费祎${player._gainJiangFei ? "已" : "未"}出阵）`);
        dialog.addSmall([storage, "character"]);
        if (player.storage.oltuoquan_current2?.length && player.isIn()) {
          dialog.addText(`当前辅臣${player.getStorage("oltuoquan_current").length ? "" : "（已败阵）"}`);
          dialog.addSmall([player.storage.oltuoquan_current2, "character"]);
        }
      }
    },
    fuchens: ["guanyu", "zhangfei", "zhaoyun", "re_huangzhong", "jiangwei", "ol_weiyan", "ol_zhangyì", "xin_masu"],
    trigger: {
      player: ["enterGame", "phaseZhunbeiBegin"],
      global: "phaseBefore"
    },
    filter(event, player) {
      if (event.name == "phaseZhunbei") {
        return player.getStorage("oltuoquan").length || player.additionalSkills["oltuoquan"]?.length;
      }
      if (!game.hasPlayer((current) => {
        if (get.mode() == "doudizhu") {
          return current.identity == "fan";
        }
        return current != player;
      })) {
        return false;
      }
      return event.name != "phase" || game.phaseNumber == 0;
    },
    locked: true,
    async cost(event, trigger, player) {
      event.result = { bool: true };
      if (trigger.name != "phaseZhunbei") {
        event.result.targets = game.filterPlayer((current) => {
          if (get.mode() == "doudizhu") {
            return current.identity == "fan";
          }
          return current != player;
        }).sortBySeat();
      } else if (player.getStorage(event.skill).length == 1) {
        event.result.cost_data = true;
      }
    },
    logAudio(_1, _2, _3, _4, costResult) {
      if (costResult.cost_data === true) {
        return "shoucheng1.mp3";
      }
      return 2;
    },
    async content(event, trigger, player) {
      if (trigger.name != "phaseZhunbei") {
        const func = async (target) => {
          if (!target.hasSkill("oldianzan", null, null, false)) {
            await target.addSkills("oldianzan");
          }
          target.markAuto("oldianzan", player);
        };
        await game.doAsyncInOrder(event.targets, func);
        return;
      }
      const nows = player.getStorage(`${event.name}_current2`);
      if (nows.length) {
        player.setStorage(`${event.name}_current2`, null);
        await player.addAdditionalSkills(event.name, []);
        game.broadcastAll(
          (player2, names2) => {
            player2.tempname.removeArray(names2);
          },
          player,
          nows
        );
      }
      if (!player.getStorage(event.name).length && !player._gainJiangFei) {
        player._gainJiangFei = true;
        const jiangfei = Math.random() > 0.99 ? ["jiangfei"] : ["ol_jiangwan", "ol_feiyi"];
        player.markAuto(event.name, jiangfei);
      }
      const names = player.getStorage(event.name).randomGets(4);
      if (!names.length) {
        player.unmarkSkill(event.name);
        return;
      }
      const result = await player.chooseButton(["托权", [names, "character"]], Math.min(2, names.length), true).set("ai", () => Math.random()).forResult();
      if (result?.bool && result.links?.length) {
        const fuchens = result.links;
        const skills2 = fuchens.reduce((arr, name) => {
          const skills3 = get.character(name, 3).filter((skill) => {
            const info = get.info(skill);
            return info && !info.charlotte && !info.limited && !info.juexingji;
          });
          arr.addArray(skills3);
          return arr;
        }, []);
        await player.addAdditionalSkills(event.name, skills2);
        game.broadcastAll(
          (player2, names2) => {
            player2.tempname.addArray(names2);
          },
          player,
          fuchens
        );
        player.setStorage(`${event.name}_current`, [...fuchens]);
        player.setStorage(`${event.name}_current2`, [...fuchens]);
        const next = game.createEvent("gainFuchen", false);
        next.player = player;
        next.fuchens = fuchens;
        next.setContent("emptyEvent");
        await next;
      }
    }
  },
  oldianzan: {
    clickableFilter(player) {
      const targets = player.getStorage("oldianzan");
      return targets.some((target) => target?.isIn());
    },
    init(player, skill) {
      if (get.nameList(player).some((name) => get.character(name)?.skills?.includes(skill))) {
        player.markAuto(skill, player);
      }
      if (!_status._click_throwFlower) {
        game.broadcastAll(() => {
          _status._click_throwFlower = function() {
            const target = this, player2 = game.me;
            if (!player2?._click_throwFlower?.includes(target)) {
              return;
            }
            player2._click_throwFlower = [];
            if (game.online) {
              game.requestSkillData("oldianzan", "throwEmotion", 5e3, target);
            } else {
              player2.throwEmotion(target, ["flower", "wine", "egg", "shoe"].randomGet());
            }
          };
          game.countPlayer2((current) => {
            current.addEventListener("click", _status._click_throwFlower);
          }, true);
        });
      }
    },
    sync: {
      throwEmotion(player, target) {
        player.throwEmotion(target, ["flower", "wine", "egg", "shoe"].randomGet());
        return;
      }
    },
    clickable(player) {
      if (player.isUnderControl(true)) {
        const targets = player.getStorage("oldianzan").filter((current) => current?.isIn());
        if (targets.length === 1) {
          player.throwEmotion(targets[0], ["flower", "wine", "egg", "shoe"].randomGet());
        } else {
          player._click_throwFlower = targets;
        }
      }
    },
    onremove: true
  },
  olxianglv: {
    audio: 2,
    trigger: {
      player: ["enterGame", "gainFuchen"],
      global: "phaseBefore"
    },
    filter(event, player) {
      if (event.name == "gainFuchen") {
        return event.fuchens?.length && player.hasExpansions("olxianglv");
      }
      return event.name != "phase" || game.phaseNumber == 0;
    },
    forced: true,
    async content(event, trigger, player) {
      if (trigger.name == "gainFuchen") {
        const cards3 = player.getExpansions(event.name).randomGets(trigger.fuchens.length);
        if (cards3.length) {
          await player.gain(cards3, "gain2");
        }
        return;
      }
      const cards2 = [];
      while (true) {
        const card = get.cardPile2((card2) => get.type(card2) == "basic" && cards2.every((cardx) => cardx.name != card2.name));
        if (card) {
          cards2.add(card);
        } else {
          break;
        }
      }
      const next = player.addToExpansion(cards2, "gain2");
      next.gaintag.add(event.name);
      await next;
    },
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    ai: { combo: "oltuoquan" }
  },
  olanle: {
    audio: 2,
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return player.getStorage("oltuoquan_current").length > 0;
    },
    init(player, skill) {
      if (!player.getStorage("oltuoquan_current").length) {
        player.addAdditionalSkill(skill, "xiangle");
      }
      player.addSkill("olanle_viewas");
    },
    onremove(player, skill) {
      player.removeAdditionalSkill(skill);
      player.removeSkill("olanle_viewas");
    },
    forced: true,
    async content(event, trigger, player) {
      const removes = [...player.getStorage("oltuoquan_current")];
      player.unmarkAuto("oltuoquan", removes);
      player.unmarkAuto("oltuoquan_current", removes);
      const next = game.createEvent("removeFuchen", false);
      next.player = player;
      next.fuchens = removes;
      next.setContent("emptyEvent");
      await next;
      const targets = [player];
      if (_status.currentPhase?.isIn()) {
        targets.push(_status.currentPhase);
      }
      await game.asyncDraw(targets);
    },
    derivation: "xiangle",
    subSkill: {
      viewas: {
        trigger: { player: ["gainFuchen", "removeFuchen"] },
        charlotte: true,
        firstDo: true,
        async cost(event, trigger, player) {
          const bool = player.getStorage("oltuoquan_current").length === 0;
          if (bool) {
            player.addAdditionalSkill("olanle", "xiangle");
          } else {
            player.removeAdditionalSkill("olanle");
          }
        }
      }
    }
  },
  //有诸葛亮 ————我才是奶龙！
  dcyingyou: {
    trigger: {
      player: ["phaseBegin", "phaseJieshuBegin", "damageEnd"]
    },
    async cost(event, trigger, player) {
      const list = [
        ["skill", "随机获得一个五虎将持有的技能"],
        ["card", "将【真·诸葛连弩】置入装备区"],
        ["mantou", "获得10吨馒头"]
      ];
      const result = await player.chooseButton([`###${get.prompt("dcyingyou")}###选择一项并摸一张牌`, [list, "textbutton"]]).set("filterButton", ({ link }) => {
        const player2 = get.player();
        return link != "card" || player2.hasEquipableSlot(1) && !player2.getEquip("real_zhuge");
      }).set("ai", ({ link }) => {
        return link == "skill" ? 2 : 1;
      }).forResult();
      if (result.bool) {
        event.result = {
          bool: true,
          cost_data: result.links[0]
        };
      }
    },
    marktext: "馒",
    intro: {
      name: "馒头",
      content: "你有$吨馒头"
    },
    getList() {
      let list, skills2 = [];
      if (get.mode() == "guozhan") {
        list = [];
        for (const i in lib.characterPack.mode_guozhan) {
          if (lib.character[i]) {
            list.push(i);
          }
        }
      } else if (_status.connectMode) {
        list = get.charactersOL();
      } else {
        list = [];
        for (const i in lib.character) {
          if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) {
            continue;
          }
          list.push(i);
        }
      }
      const wuhu = ["关羽", "张飞", "赵云", "马超", "黄忠"], wuhuList = list.filter((character) => {
        const names = get.characterSurname(character).map((name) => name.join(""));
        return names.containsSome(...wuhu);
      });
      for (const i of wuhuList) {
        const skillsx = (lib.character[i][3] || []).filter((skill) => {
          const info = get.info(skill);
          return info && !info.hiddenSkill && !info.charlotte;
        }).map((skill) => [skill, i]);
        skills2.addArray(skillsx);
      }
      return skills2;
    },
    async content(event, trigger, player) {
      switch (event.cost_data) {
        case "skill": {
          const skills2 = get.info(event.name).getList().filter((skill) => !player.hasSkill(skill[0], null, null, false));
          if (skills2?.length) {
            const skill = skills2.randomGet();
            player.flashAvatar(event.name, skill[1]);
            await player.addAdditionalSkills(event.name, skill[0], true);
          }
          break;
        }
        case "card": {
          const card = game.createCard("real_zhuge", "club", 1);
          if (player.canEquip(card, true)) {
            await player.equip(card, "gain2");
          }
          break;
        }
        default: {
          player.addMark(event.name, 10, false);
          game.log(player, "获得了10吨", "#y馒头");
          break;
        }
      }
      await player.draw();
    },
    group: "dcyingyou_eat",
    subSkill: {
      eat: {
        trigger: {
          player: "useCard"
        },
        filter(event, player) {
          if (!player.hasHistory("lose", (evt) => {
            if (!evt?.hs?.length) {
              return false;
            }
            const evtx = evt.relatedEvent || evt.getParent();
            return evtx == event;
          })) {
            return false;
          }
          if (!get.info("dcshixian").filterx(event)) {
            return false;
          }
          const num = get.number(event.card);
          return typeof num == "number" && num > 0 && num <= player.countMark("dcyingyou");
        },
        prompt2(event, player) {
          const num = get.number(event.card);
          return `吃掉${num}吨馒头，令${get.translation(event.card)}额外结算一次`;
        },
        async content(event, trigger, player) {
          const num = get.number(trigger.card);
          player.removeMark("dcyingyou", num, false);
          game.log(player, `吃掉了${num}吨`, "#y馒头");
          trigger.effectCount++;
        }
      }
    }
  },
  real_zhuge_skill: {
    equipSkill: true,
    audio: "zhuge_skill",
    firstDo: true,
    trigger: { player: "useCard1" },
    forced: true,
    filter(event, player) {
      if (event.card.name === "sha") {
        const num = get.number(event.card);
        if (typeof num == "number" && num < 7) {
          return true;
        }
      }
      return !event.audioed && event.card.name === "sha" && player.countUsed("sha", true) > 1 && event.getParent().type === "phase";
    },
    async content(event, trigger, player) {
      const num = get.number(trigger.card);
      if (typeof num == "number" && num < 7) {
        trigger.directHit.addArray(game.players);
      }
      trigger.audioed = true;
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (arg?.card?.name == "sha") {
          const num = get.number(arg.card);
          if (typeof num == "number" && num < 7) {
            return true;
          }
        }
      }
    },
    mod: {
      cardUsable(card, player, num) {
        var cards2 = player.getCards("e", (card2) => get.name(card2) == "zhuge");
        if (card.name === "sha") {
          if (!cards2.length || player.hasSkill("real_zhuge_skill", null, false) || cards2.some((card2) => card2 !== _status.zhuge_temp && !ui.selected.cards.includes(card2))) {
            if (get.is.versus() || get.is.changban()) {
              return num + 3;
            }
            return Infinity;
          }
        }
      },
      cardEnabled2(card, player) {
        if (!_status.event.addCount_extra || player.hasSkill("real_zhuge_skill", null, false)) {
          return;
        }
        var cards2 = player.getCards("e", (card2) => get.name(card2) == "real_zhuge");
        if (card && cards2.includes(card)) {
          try {
            var cardz = get.card();
          } catch (e) {
            return;
          }
          if (!cardz || cardz.name !== "sha") {
            return;
          }
          _status.zhuge_temp = card;
          var bool = lib.filter.cardUsable(get.autoViewAs(cardz, ui.selected.cards.concat([card])), player);
          delete _status.zhuge_temp;
          if (!bool) {
            return false;
          }
        }
      }
    }
  },
  //谋谋邓艾
  olandu: {
    audio: 2,
    init(player, skill) {
      player.addSkill("olandu_mark");
    },
    onremove(player, skill) {
      player.removeSkill("olandu_mark");
    },
    isYinping(card) {
      const actualCardName = new Map([
        ...lib.actualCardName,
        ["借刀杀人", "借刀"]
        //给OL借刀开门
      ]), name = get.translation(typeof card == "string" ? card : get.name(card, false));
      const trueName = actualCardName.has(name) ? actualCardName.get(name) : name, pinyins2 = get.pinyin(trueName);
      if (!pinyins2.length) {
        return false;
      }
      const check = (pinyin) => {
        const yunmu = get.yunmu(pinyin);
        if (!yunmu?.length) {
          return false;
        }
        return yunmu.split("").containsSome("ā", "ē", "ī", "ō", "ū", "ǖ");
      };
      return check(pinyins2[0]) || check(pinyins2[pinyins2.length - 1]);
    },
    trigger: {
      player: "useCardAfter"
    },
    filter(event, player, name, card) {
      if (!get.info("olandu").isYinping(card)) {
        return false;
      }
      return game.hasPlayer((current) => current != player && current.countCards("h", (card2) => get.info("olandu").isYinping(card2)));
    },
    locked: true,
    getIndex(event, player) {
      return event.cards ?? [];
    },
    async cost(event, trigger, player) {
      const cards2 = game.filterPlayer((current) => current != player).reduce((cards3, current) => {
        return [...cards3, ...current.getCards("h", (card) => get.info(event.skill).isYinping(card))];
      }, []);
      if (cards2?.length) {
        const card = cards2.randomGet();
        event.result = {
          bool: true,
          targets: [get.owner(card)],
          cost_data: card
        };
      }
    },
    async content(event, trigger, player) {
      const { cost_data: card } = event;
      await player.gain(card, "giveAuto");
    },
    subSkill: {
      mark: {
        init(player, skill) {
          get.info(skill).initTag(player, skill, player.getCards("h"));
        },
        initTag(player, skill, cards2) {
          cards2 = cards2.filter((card) => {
            return get.info("olandu").isYinping(card) && !card.hasGaintag(skill);
          });
          if (cards2?.length) {
            player.addGaintag(cards2, skill);
          }
        },
        onremove(player, skill) {
          player.removeGaintag(skill);
        },
        trigger: {
          player: "gainAfter",
          global: ["loseAfter", "loseAsyncAfter", "gameDrawAfter"]
        },
        filter(event, player) {
          if (event.name == "gameDraw") {
            return true;
          }
          return event.getg?.(player)?.length;
        },
        charlotte: true,
        async cost(event, trigger, player) {
          const cards2 = trigger.name == "gameDraw" ? player.getCards("h") : trigger.getg(player);
          get.info(event.skill).initTag(player, event.skill, cards2);
        }
      }
    }
  },
  olqiqi: {
    audio: 2,
    trigger: {
      player: "useCardToPlayer"
    },
    round: 1,
    filter(event, player) {
      return event.isFirstTarget && get.cardNameLength(event.card) >= player.hp;
    },
    async content(event, trigger, player) {
      await player.draw(2);
      trigger.getParent().effectCount++;
      player.when({ player: "useCardAfter" }).filter((evt) => evt.card == trigger.card).step(async (event2, trigger2, player2) => {
        game.broadcastAll(
          (skill1, skill2) => {
            lib.translate[skill1] = lib.translate[skill2];
          },
          event2.name,
          event.name
        );
        const result = await player2.judge((card) => {
          return get.suit(card) == "heart" ? -2 : 2;
        }).forResult();
        if (result.suit == "heart") {
          await player2.loseMaxHp();
        }
      });
    }
  },
  //狂李儒
  olhuaquan: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return event.targets.some((target) => target != player) && event.isFirstTarget;
    },
    forced: true,
    async content(event, trigger, player) {
      const list = [
        ["", "", "olhuaquan_heavy"],
        ["", "", "olhuaquan_light"]
      ];
      const result = await player.chooseButton([`###花拳###${get.skillInfoTranslation(event.name, null, false)}`, [list, "vcard"]], true).set("ai", (button) => {
        const card = get.event().card;
        const bool = button.link == "olhuaquan_heavy";
        if (get.tag(card, "damage") && get.type(card) != "delay") {
          return bool ? 1 + Math.random() : 0.5 + Math.random();
        }
        return bool ? 0.5 + Math.random() : 1 + Math.random();
      }).set("card", trigger.card).forResult();
      if (!result?.links?.length) {
        return;
      }
      const choice = result.links[0][2];
      if (choice == "olhuaquan_heavy") {
        trigger.getParent().baseDamage++;
      } else {
        player.when("useCardAfter").filter((evt) => evt == trigger.getParent()).step(async () => {
          await player.draw();
        });
      }
      const targets = trigger.targets.filter((target) => target != player);
      player.line(targets);
      const chooseButton = async (target) => {
        event.target = target;
        const result2 = await target.chooseButton([`###花拳###猜测${get.translation(player)}选择的效果`, [list, "vcard"]], true).set("ai", (button) => {
          const card = get.event().card;
          const bool = button.link == "olhuaquan_heavy";
          if (get.tag(card, "damage") && get.type(card) != "delay") {
            return bool ? 1 + Math.random() : 0.5 + Math.random();
          }
          return bool ? 0.5 + Math.random() : 1 + Math.random();
        }).set("card", trigger.card).forResult();
        if (result2?.links?.[0]?.[2] != choice) {
          await event.trigger("olhuaquan_wrong");
        }
      };
      await game.doAsyncInOrder(targets, chooseButton);
    }
  },
  olsanou: {
    audio: 2,
    marktext: "👊",
    intro: {
      name: "击倒",
      name2: "击倒",
      content: "mark",
      markcount: "mark"
    },
    trigger: {
      global: ["damageEnd", "olhuaquan_wrong"]
    },
    forced: true,
    filter(event, player) {
      if (event.name == "damage") {
        return event.source == player && event.player != player && event.player.isIn();
      }
      return event.target.isIn();
    },
    logTarget(event, player) {
      if (event.name == "damage") {
        return event.player;
      }
      return event.target;
    },
    async content(event, trigger, player) {
      const [target] = event.targets;
      await player.draw();
      target.addMark(event.name);
      if (target.countMark(event.name) >= 3 && !target.hasSkill(event.name + "_debuff")) {
        target.clearMark(event.name);
        target.addSkill(event.name + "_debuff");
        game.log(target, "被击倒，简直毫无还手之力");
      }
    },
    subSkill: {
      debuff: {
        charlotte: true,
        forced: true,
        popup: false,
        trigger: {
          player: "phaseUseBefore",
          get global() {
            const list = ["lose", "cardsDiscard", "cardsGotoOrdering", "gain", "addJudge", "equip", "addToExpansion"];
            const listx = list.map((i) => [`${i}End`, `${i}Begin`]).flat();
            return listx.concat(list.slice(0, 2).map((i) => `${i}After`));
          }
        },
        firstDo: true,
        filter(event, player, name) {
          if (event.name == "phaseUse") {
            return true;
          }
          if (name.endsWith("End")) {
            return event.olsanou_debuff?.length;
          }
          if (name.endsWith("Begin")) {
            return event.cards.some((card) => lib.skill.olsanou_debuff.filterCardx(card, event));
          }
          return event.name == "lose" ? event.position == ui.discardPile : true;
        },
        filterCardx(card, event) {
          if (event.name == "gain") {
            if ((event.getParent().name == "draw" || !get.owner(card)) && card.original == "c") {
              return true;
            }
          }
          return get.position(card) == "c";
        },
        async content(event, trigger, player) {
          if (trigger.name == "phaseUse") {
            trigger.cancel();
          } else {
            const name = event.triggername;
            let num = 0;
            if (name.endsWith("End")) {
              num += trigger[event.name]?.filter((card) => trigger.cards.includes(card)).length;
            } else if (name.endsWith("Begin")) {
              trigger.set(
                event.name,
                trigger.cards.filter((card) => lib.skill[event.name].filterCardx(card, trigger))
              );
              return;
            } else {
              num += trigger.cards.length;
            }
            player.removeMark(event.name, num, false);
            if (!player.hasMark(event.name)) {
              player.removeSkill(event.name);
            }
          }
        },
        init(player, skill) {
          player.addMark(skill, 10, false);
        },
        onremove(player, skill) {
          delete player.storage[skill];
          game.log("读秒结束，", player, "站立了过来");
        },
        marktext: "💫",
        intro: {
          name: "击倒状态",
          content: "距离脱离击倒状态还差#“秒”"
        }
      }
    }
  },
  //忍邓艾&姜维
  renhuoluan: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => player.canCompare(current));
    },
    intro: {
      mark(dialog, storage, player) {
        if (!storage || get.itemtype(storage) != "cards") {
          return "未记录";
        }
        dialog.addText("当前〖惑乱〗记录牌");
        dialog.addSmall(storage);
      }
    },
    onremove: true,
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("惑乱", "是否修改你拼点牌的点数？", "hidden");
      },
      chooseControl(event, player) {
        const list = Array.from(Array(13)).map((p, i) => i + 1);
        return [...list, "不修改", "cancel2"];
      },
      check() {
        return 12;
      },
      backup(result, player) {
        return {
          audio: "renhuoluan",
          number: result.control,
          filterTarget(card, player2, target) {
            return player2.canCompare(target);
          },
          selectTarget: [1, 2],
          multitarget: true,
          multiline: true,
          async content(event, trigger, player2) {
            const num = get.info(event.name)?.number;
            if (typeof num == "number") {
              player2.when("compare", false).filter((evt, player3) => {
                if (!evt.getParent(event.name, true)) {
                  return false;
                }
                return [event.player, event.target].includes(player3);
              }).assign({
                firstDo: true
              }).step(async (event2, trigger2, player3) => {
                for (const [role, ind] of [
                  ["player", 1],
                  ["target", 2]
                ]) {
                  const current = trigger2[role];
                  if (current == player3) {
                    player3.logSkill("renhuoluan");
                    game.log(current, "拼点牌点数视为", `#y${get.strNumber(num, true)}`);
                    trigger2[`num${ind}`] = num;
                  }
                }
              }).finish();
            }
            const next = player2.chooseToCompare(event.targets, (card2) => {
              return get.number(card2);
            }).setContent("chooseToCompareMeanwhile");
            const { player: card, num2 } = await next.forResult();
            const { targets, num1 } = next;
            player2.markAuto("renhuoluan", card);
            let max = 0, min = 14, maxPlayer, minPlayer, players = [player2, ...targets], nums = [num1, ...num2];
            for (let i = 0; i < nums.length; i++) {
              const num3 = nums[i];
              if (num3 >= max) {
                if (num3 == max) {
                  maxPlayer = null;
                } else {
                  max = num3;
                  maxPlayer = players[i];
                }
              }
              if (num3 <= min) {
                if (num3 == min) {
                  minPlayer = null;
                } else {
                  min = num3;
                  minPlayer = players[i];
                }
              }
            }
            if (minPlayer) {
              for (let target of players) {
                if (target == minPlayer || !minPlayer.isIn() || !target.isIn()) {
                  continue;
                }
                const sha = new lib.element.VCard({ name: "sha", isCard: true });
                if (target.canUse(sha, minPlayer, false)) {
                  await target.useCard(sha, minPlayer, false);
                }
              }
            }
            if (maxPlayer) {
              if (maxPlayer.isIn() && maxPlayer.hp > 0) {
                await maxPlayer.draw(maxPlayer.hp);
              }
            }
            if (minPlayer != player2 && maxPlayer != player2) {
              if (player2.getStat("skill")["renhuoluan"]) {
                delete player2.getStat("skill")["renhuoluan"];
                game.log(player2, "重置了", "#g【惑乱】");
              }
            }
          },
          ai1(card) {
            return 1;
          },
          ai2(target) {
            return -get.attitude(get.player(), target);
          }
        };
      },
      prompt(result, player) {
        const num = result.control;
        let str = `###${get.prompt("renhuoluan")}###与至多两名其他角色共同拼点`;
        if (typeof num == "number") {
          str += `且你的拼点牌点数视为${get.strNumber(num, true)}`;
        }
        return str;
      }
    },
    ai: {
      order: 7,
      result: {
        player: 1
      }
    },
    subSkill: {
      backup: {}
    }
  },
  renguxing: {
    audio: 2,
    trigger: {
      player: "phaseBegin"
    },
    filter(event, player) {
      const num = game.roundNumber, cards2 = player.getStorage("renhuoluan");
      if (typeof num != "number" || num <= 0) {
        return false;
      }
      return cards2 && get.itemtype(cards2) == "cards";
    },
    prompt2(event, player) {
      const num = Math.min(3, game.roundNumber), cards2 = player.getStorage("renhuoluan");
      let str = "从牌堆或弃牌堆中获得：";
      if (num >= 1) {
        str += get.translation(cards2);
      }
      if (num >= 2) {
        const list = cards2.map((card) => `${get.translation(get.suit(card))}${get.translation(get.number(card))}`).toUniqued();
        str += `；点数花色组合为${list.join("、")}的所有牌`;
      }
      if (num >= 3) {
        const list = cards2.map((card) => get.translation(get.name(card))).toUniqued();
        str += `；牌名为${list.join("、")}的所有牌`;
      }
      return `${str}（同名牌至多获得五张）`;
    },
    check(event, player) {
      return game.roundNumber >= 3 || player.hp <= 1;
    },
    limited: true,
    skillAnimation: true,
    animationColor: "fire",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const num = Math.min(3, game.roundNumber), cardsx = player.getStorage("renhuoluan"), filter = [
        (cardx, card, cards3) => {
          if (cards3.includes(cardx) || cards3.filter((cardxx) => get.name(cardxx) == get.name(cardx)).length >= 5) {
            return false;
          }
          return cardx == card;
        },
        (cardx, card, cards3) => {
          if (cards3.includes(cardx) || cards3.filter((cardxx) => get.name(cardxx) == get.name(cardx)).length >= 5) {
            return false;
          }
          return get.number(cardx) == get.number(card) && get.suit(cardx) == get.suit(card);
        },
        (cardx, card, cards3) => {
          if (cards3.includes(cardx) || cards3.filter((cardxx) => get.name(cardxx) == get.name(cardx)).length >= 5) {
            return false;
          }
          return get.name(cardx) == get.name(card);
        }
      ];
      let count = 0;
      const cards2 = [];
      while (count < num) {
        for (let card of cardsx) {
          while (true) {
            const cardx = get.cardPile((cardx2) => filter[count](cardx2, card, cards2), null, "bottom");
            if (cardx) {
              cards2.push(cardx);
            } else {
              break;
            }
          }
        }
        count++;
      }
      if (cards2.length) {
        await player.gain(cards2, "gain2");
      }
    },
    ai: {
      combo: "renhuoluan"
    }
  },
  renneyan: {
    audio: 2,
    trigger: {
      player: "useCard1"
    },
    filter(event, player) {
      return get.type(event.card) != "equip";
    },
    forced: true,
    zhuanhuanji: true,
    marktext: "☯",
    mark: true,
    intro: {
      content(storage, player) {
        return `你使用非装备牌时，${storage ? "此牌无次数限制" : "须弃置一张同类型牌并令此牌额外结算一次，否则此牌无效"}。`;
      }
    },
    async content(event, trigger, player) {
      const bool = player.getStorage(event.name, false);
      player.changeZhuanhuanji(event.name);
      if (bool) {
        if (trigger.addCount !== false) {
          trigger.addCount = false;
          const stat = player.getStat().card, name = trigger.card.name;
          if (typeof stat[name] == "number") {
            stat[name]--;
          }
        }
      } else {
        const prompt = `弃置一张${get.translation(get.type2(trigger.card, player))}牌令${get.translation(trigger.card)}额外结算一次，否则无效`;
        const result = await player.chooseToDiscard(prompt, "he", (card, player2) => {
          return get.type2(card, player2) == get.event().cardType;
        }).set("cardType", get.type2(trigger.card, player)).set("ai", (card) => {
          return 9 - get.value(card);
        }).forResult();
        if (result?.bool) {
          if (get.info("dcshixian")?.filterx(trigger)) {
            trigger.effectCount++;
            game.log(trigger.card, "额外结算一次");
          }
        } else {
          trigger.targets.length = 0;
          trigger.all_excluded = true;
          game.log(trigger.card, "被无效了");
        }
      }
    },
    mod: {
      aiOrder(player, card, order) {
        if (get.type(card) == "equip") {
          return order;
        }
        const bool = player.getStorage("renneyan", false);
        if (bool && card.name == "sha") {
          order += 7;
        }
        if (!bool) {
          if (player.countCards("he", (cardx) => {
            const type = get.type(card, player);
            return type == get.type(cardx, player) && cardx != card;
          })) {
            if (get.tag(card, "gain") || get.tag(card, "draw")) {
              order += 9;
            }
          } else {
            order = 0;
          }
        }
        return order;
      },
      cardUsable(card, player, num) {
        const bool = player.getStorage("renneyan", false), type = get.type2(card, player);
        if (bool && type != "equip") {
          return Infinity;
        }
      }
    }
  },
  renqianyao: {
    audio: 2,
    trigger: {
      player: "phaseBegin"
    },
    filter(event, player) {
      const num = game.roundNumber;
      if (typeof num != "number" || num <= 0) {
        return false;
      }
      return true;
    },
    check(event, player) {
      return game.roundNumber >= 3 || player.hp <= 2;
    },
    limited: true,
    skillAnimation: true,
    animationColor: "thunder",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const num = game.roundNumber, card = new lib.element.VCard({ name: "sha", isCard: true });
      await player.draw(num);
      if (!player.hasUseTarget(card)) {
        return;
      }
      const next = player.chooseUseTarget(card, true);
      if (num >= 1) {
        player.when({
          player: "useCard2"
        }).filter((evt, player2) => {
          if (evt.card.name != "sha" || evt.getParent(event.name) != event) {
            return false;
          }
          return evt.targets && game.hasPlayer((current) => {
            return !evt.targets.includes(current) && lib.filter.targetEnabled2(evt.card, player2, current) && lib.filter.targetInRange(evt.card, player2, current);
          });
        }).step(async (event2, trigger2, player2) => {
          const result = await player2.chooseTarget(
            "潜曜：为此【杀】额外指定一个目标",
            (cardx, player3, target) => {
              const { targets, card: card2 } = get.event();
              if (targets.includes(target)) {
                return false;
              }
              return lib.filter.targetEnabled2(card2, player3, target) && lib.filter.targetInRange(card2, player3, target);
            },
            true
          ).set("autodelay", true).set("ai", (target) => {
            const event3 = get.event(), player3 = get.player(), trigger3 = event3.getTrigger();
            return get.effect(target, trigger3.card, player3, player3);
          }).set("targets", trigger2.targets).set("card", trigger2.card).forResult();
          if (result.bool && result.targets?.length) {
            player2.line(result.targets, "green");
            game.log(result.targets, "成为了", trigger2.card, "的目标");
            trigger2.targets.addArray(result.targets);
          }
        });
      }
      if (num >= 2) {
        player.when({
          player: "useCard1"
        }).filter((evt, player2) => {
          if (evt.card.name != "sha" || evt.getParent(event.name) != event) {
            return false;
          }
          return true;
        }).step(async (event2, trigger2, player2) => {
          if (typeof trigger2.baseDamage != "number") {
            trigger2.baseDamage = 1;
          }
          trigger2.baseDamage++;
          game.log(trigger2.card, "伤害+1");
        });
      }
      if (num >= 3) {
        next.set("oncard", () => {
          const evt = get.event();
          evt.directHit.addArray(game.players);
          game.log(evt.card, "不可被响应");
        });
      }
      await next;
    }
  },
  //健美圈冲儿
  strongduanti: {
    audio: 2,
    trigger: {
      player: ["chengxiangShowBegin", "drawAfter"]
    },
    filter(event, player) {
      if (event.name == "draw") {
        return true;
      }
      return player.isMaxHp() || player.isMinHp();
    },
    forced: true,
    async content(event, trigger, player) {
      if (trigger.name == "draw") {
        await player.damage("nosource");
      } else {
        if (!trigger.showCards) {
          trigger.showCards = [];
        }
        if (player.isMaxHp()) {
          let card = get.cardPile2((card2) => {
            return get.subtype(card2) == "equip1" || get.is.damageCard(card2);
          });
          if (card) {
            trigger.showCards.add(card);
            await game.cardsGotoOrdering(card).set("relatedEvent", trigger);
          }
        }
        if (player.isMinHp()) {
          let card = get.cardPile2((card2) => {
            return card2.name == "tao" || card2.name == "jiu";
          });
          if (card) {
            trigger.showCards.add(card);
            await game.cardsGotoOrdering(card).set("relatedEvent", trigger);
          }
        }
      }
    },
    derivation: "olchengxiang",
    ai: {
      halfneg: true
    }
  },
  stronglianwu: {
    audio: 2,
    trigger: {
      player: "useCardToPlayered",
      target: "useCardToTargeted"
    },
    filter(event, player) {
      if (event.card?.name != "sha" || event.targets.length != 1) {
        return false;
      }
      if (!event.target.countCards("he")) {
        return false;
      }
      return event.player.getEquips(1).length || event.getParent().jiu;
    },
    async cost(event, trigger, player) {
      let num = 0;
      if (trigger.player.getEquips(1).length) {
        num++;
      }
      if (trigger.getParent().jiu) {
        num++;
      }
      event.result = await trigger.player.choosePlayerCard(get.prompt2(event.skill, trigger.target, trigger.player), [1, num], "he", trigger.target).set("ai", (button) => {
        let val = get.buttonValue(button);
        if (get.attitude(_status.event.player, get.owner(button.link)) > 0) {
          return -val;
        }
        return val;
      }).forResult();
      event.result.targets = [trigger[player == trigger.player ? "target" : "player"]];
    },
    async content(event, trigger, player) {
      await trigger.target.modedDiscard(event.cards, trigger.player);
    }
  },
  //张角三兄弟
  oltiangong: {
    audio: 2,
    forced: true,
    trigger: {
      player: ["phaseBegin", "phaseEnd"],
      global: ["judgeAfter"]
    },
    filter(event, player) {
      if (event.name == "judge") {
        return event.result.suit == "spade";
      }
      return true;
    },
    async content(event, trigger, player) {
      if (trigger.name == "phase") {
        const name = event.triggername == "phaseBegin" ? "leigong" : "younan", card = get.autoViewAs({ name, isCard: true });
        if (player.hasUseTarget(card, false, false)) {
          await player.chooseUseTarget(card, true, false);
        }
      } else {
        const result = await player.chooseTarget(`天公：对一名不为${get.translation(trigger.player)}的角色造成1点雷电伤害`, true, (card, player2, target) => {
          return get.event().sourcex != target;
        }).set("sourcex", trigger.player).set("ai", (target) => get.damageEffect(target, get.player(), get.player(), "thunder")).forResult();
        if (result?.targets) {
          const target = result.targets[0];
          player.line(target, "thunder");
          await target.damage("nocard", "thunder");
        }
      }
    }
  },
  oldigong: {
    init(player) {
      player.storage.oldigongCount = 0;
    },
    audio: 2,
    trigger: { player: "useCard" },
    forced: true,
    filter(event, player) {
      return game.hasPlayer2((target) => {
        return target.hasHistory("lose", (evt) => {
          const evtx = evt.relatedEvent || evt.getParent();
          if (evtx != event) {
            return false;
          }
          return !Object.values(evt.gaintag_map).flat().includes("oldigong_tag");
        });
      });
    },
    async content(event, trigger, player) {
      if (player.storage.oldigongCount < 4) {
        player.storage.oldigongCount++;
        if (player.storage.oldigongCount == 4) {
          player.changeSkin({ characterName: "taipingsangong" }, "taipingsangong_ultimate");
        }
      }
      if (get.is.damageCard(trigger.card)) {
        trigger.baseDamage++;
      } else {
        player.when("useCardAfter").filter((evt) => evt == trigger).step(async (event2, trigger2, player2) => {
          const target = _status.currentPhase;
          if (!target?.isIn()) {
            return;
          }
          const result = await target.judge("oldigong", function(card) {
            if (get.color(card) == "red") {
              return 1;
            }
            return 0;
          }).forResult();
          if (result.color == "red") {
            await player2.draw();
          }
        });
      }
    },
    group: ["oldigong_tag"],
    subSkill: {
      tag: {
        charlotte: true,
        silent: true,
        firstDo: true,
        trigger: { player: "gainBegin" },
        filter(event, player) {
          return event.cards?.length;
        },
        async content(event, trigger, player) {
          if (!trigger.gaintag) {
            trigger.gaintag = [];
          }
          trigger.gaintag.add("oldigong_tag");
          player.addTempSkill("oldigong_remove", "roundEnd");
        }
      },
      remove: {
        charlotte: true,
        onremove(player) {
          player.removeGaintag("oldigong_tag");
        }
      }
    }
  },
  olrengong: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    forced: true,
    filter(event, player) {
      const last = player.getLastUsed(1);
      if (!last) {
        return false;
      }
      return get.type2(event.card) != get.type2(last.card) && player.countDiscardableCards(player, "he");
    },
    async content(event, trigger, player) {
      const last = player.getLastUsed(1), type = ["basic", "trick", "equip"].removeArray([get.type2(trigger.card), get.type2(last.card)])[0];
      if (!player.countDiscardableCards(player, "he")) {
        return false;
      }
      await player.chooseToDiscard(`人公：请弃置一张牌，然后从牌堆获得一张${get.translation(type)}牌`, "he", true);
      const card = get.cardPile2((card2) => get.type2(card2) == type);
      if (card) {
        await player.gain(card, "gain2");
      } else {
        player.chat(`黄天在上，赐我${get.translation(type)}`);
      }
    },
    init(player) {
      player.addSkill("olrengong_mark");
    },
    onremove(player) {
      player.removeSkill("olrengong_mark");
    },
    subSkill: {
      mark: {
        charlotte: true,
        silent: true,
        init(player, skill) {
          const history = player.getLastUsed();
          if (!history) {
            return;
          }
          const card = history.card;
          player.storage[skill] = get.type2(card);
          player.markSkill(skill);
          game.broadcastAll(
            function(player2, type) {
              if (player2.marks.olrengong_mark) {
                player2.marks.olrengong_mark.firstChild.innerHTML = get.translation(type).slice(0, 1);
              }
            },
            player,
            get.type2(card)
          );
        },
        intro: {
          content: "上次使用：$"
        },
        onremove: true,
        trigger: {
          global: "useCard1"
        },
        async content(event, trigger, player) {
          lib.skill[event.name].init(player, event.name);
        }
      }
    }
  },
  //烈袁绍袁术
  dclieti: {
    trigger: {
      //因为需要兼容联机，所以加上replaceHandcards的时机，该事件是联机时的手气卡事件
      global: ["gameDrawBegin", "replaceHandcardsBegin"]
    },
    forced: true,
    popup: false,
    async content(event, trigger, player) {
      const me = player;
      if (trigger.name == "gameDraw") {
        player.logSkill(event.name);
        const numx = trigger.num;
        trigger.num = typeof numx == "function" ? function(player2) {
          if (player2 == me) {
            return 2 * numx(player2);
          }
          return numx(player2);
        } : function(player2) {
          if (player2 == me) {
            return 2 * numx;
          }
          return numx;
        };
        player.changeSkin({ characterName: "yuanshaoyuanshu" }, "yuanshaoyuanshu_shao");
      }
      if (!trigger.gaintag) {
        trigger.gaintag = {};
      }
      trigger.gaintag[me.playerid] = (num, cards2) => {
        const numy = Math.ceil(num / 2);
        return [
          [cards2.slice(0, numy), "yuanshaoyuanshu_shu"],
          [cards2.slice(numy, num), "yuanshaoyuanshu_shao"]
        ];
      };
    },
    mod: {
      cardEnabled2(card, player) {
        if (get.itemtype(card) != "card" || !player.getCards("h").includes(card)) {
          return;
        }
        if (player.hasSkill("dcshigong", null, false, false) && player.storage.dcshigong_first !== false) {
          return;
        }
        if (!card.hasGaintag(lib.skill.dclieti.getName(player))) {
          return false;
        }
      },
      ignoredHandcard(card, player) {
        if (!card.hasGaintag(lib.skill.dclieti.getName(player))) {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name == "phaseDiscard" && !card.hasGaintag(lib.skill.dclieti.getName(player))) {
          return false;
        }
      }
    },
    getName(player) {
      const name = player.tempname.find((i) => i.indexOf("yuanshaoyuanshu") == 0);
      if (name) {
        return name;
      }
      return player.name1;
    },
    group: "dclieti_mark",
    subSkill: {
      mark: {
        trigger: {
          player: "gainBegin"
        },
        filter(event, player) {
          return event.cards?.length;
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          if (!trigger.gaintag) {
            trigger.gaintag = [];
          }
          const name = lib.skill.dclieti.getName(player);
          trigger.gaintag.add(name);
        }
      }
    }
  },
  dcshigong: {
    locked: true,
    direct: true,
    trigger: { player: "useCard" },
    filter(event, player) {
      return player.getHistory("useCard", (evt) => {
        return player.hasHistory("lose", (evtx) => {
          if ((evtx.relatedEvent || evtx.getParent()) != evt) {
            return false;
          }
          return evtx.getl?.(player)?.hs?.length;
        });
      }).indexOf(event) == 0;
    },
    async content(event, trigger, player) {
      player.storage.dcshigong_first = false;
      player.when({ global: "phaseAfter" }).step(async () => {
        delete player.storage.dcshigong_first;
      });
      if (lib.skill.dclieti.getName(player).indexOf("yuanshaoyuanshu") != 0) {
        return false;
      }
      const gaintag = [];
      player.checkHistory("lose", (evt) => {
        if ((evt.relatedEvent || evt.getParent()) != trigger) {
          return false;
        }
        gaintag.addArray(
          Object.values(evt.gaintag_map).flat().filter((tag) => tag.indexOf("yuanshaoyuanshu") == 0)
        );
      });
      if (gaintag.length == 1 && gaintag[0] != lib.skill.dclieti.getName(player)) {
        const name = gaintag[0];
        player.when({ player: "useCardAfter" }).filter((evt) => evt.card == trigger.card).step(async (event2, trigger2, player2) => {
          player2.logSkill(event2.name);
          player2.changeSkin({ characterName: "yuanshaoyuanshu" }, name);
          if (name == "yuanshaoyuanshu_shao") {
            await player2.chooseUseTarget({ name: "wanjian", isCard: true }, true);
          }
          if (name == "yuanshaoyuanshu_shu") {
            await player2.draw(2);
          }
        });
      }
    },
    ai: {
      combo: "dclieti"
    }
  },
  dcluankui: {
    trigger: {
      source: ["damageSource"],
      player: ["gainAfter"],
      global: ["loseAsyncAfter"]
    },
    filter(event, player) {
      if (event.name == "damage") {
        return player.getHistory("sourceDamage", (evt) => evt.num).indexOf(event) == 1 && player.countDiscardableCards(player, "h", (card) => card.hasGaintag("yuanshaoyuanshu_shao"));
      } else {
        return event.getg?.(player)?.length && player.getHistory("gain", (evt) => evt.cards.length).indexOf(event) == 1 && player.countDiscardableCards(player, "h", (card) => card.hasGaintag("yuanshaoyuanshu_shu"));
      }
    },
    async cost(event, trigger, player) {
      const name = trigger.name, tag = name == "damage" ? "yuanshaoyuanshu_shao" : "yuanshaoyuanshu_shu";
      let str = `###${get.prompt(event.skill)}###`;
      if (name == "damage") {
        str += "弃置一张「袁绍」牌令自己本回合下次造成的伤害翻倍";
      } else {
        str += "弃置一张「袁术」牌令自己本回合下次摸牌翻倍";
      }
      event.result = await player.chooseToDiscard(str, "h", "chooseonly", (card) => card.hasGaintag(get.event().tag)).set("tag", tag).set("ai", (card) => 6 - get.value(card)).forResult();
    },
    async content(event, trigger, player) {
      const cards2 = event.cards, name = trigger.name;
      await player.discard(cards2);
      if (name == "damage") {
        player.addTempSkill(event.name + "_damage");
      } else {
        player.addTempSkill(event.name + "_draw");
      }
    },
    subSkill: {
      damage: {
        audio: "dcluankui",
        mark: true,
        intro: {
          content: "下次造成伤害翻倍"
        },
        charlotte: true,
        forced: true,
        trigger: { source: "damageBegin1" },
        async content(event, trigger, player) {
          trigger.num *= 2;
          player.removeSkill(event.name);
        }
      },
      draw: {
        audio: "dcluankui",
        mark: true,
        intro: {
          content: "下次摸牌翻倍"
        },
        charlotte: true,
        forced: true,
        trigger: { player: "drawBegin" },
        async content(event, trigger, player) {
          trigger.num *= 2;
          player.removeSkill(event.name);
        }
      }
    },
    ai: {
      combo: "dclieti"
    }
  },
  //田忌
  dcweiji: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return event.isFirstTarget && event.targets.some((i) => i !== player);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return target !== player2 && get.event().getTrigger().targets.includes(target);
      }).set("ai", (target) => {
        const player2 = get.player();
        return 2 + Math.sign(get.attitude(player2, target)) + Math.random();
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0], numbers = Array.from({ length: 3 }).map((_, i) => (i + 1).toString());
      const { control: num1 } = await player.chooseControl(numbers).set("ai", () => {
        const { player: player2, target: target2 } = get.event().getParent();
        if (get.attitude(player2, target2) > 0 || get.attitude(target2, player2) > 0) {
          return 2;
        }
        return get.rand(0, 2);
      }).set("prompt", "请选择你给" + get.translation(target) + "设下的难题").forResult();
      game.log(player, "选择了一个数字");
      player.chat("我选的" + [1, 2, 3, 114514, 1919810].randomGet() + "，你信吗");
      await game.delayx();
      const { control: num2 } = await target.chooseControl(numbers).set("ai", () => {
        const { player: player2, target: target2 } = get.event().getParent();
        if (get.attitude(player2, target2) > 0 || get.attitude(target2, player2) > 0) {
          return 0;
        }
        return get.rand(0, 2);
      }).set("prompt", "请猜测" + get.translation(player) + "选择的数字").forResult();
      target.chat("我猜是" + num2 + "！");
      await game.delayx();
      player.chat(num1 === num2 ? "悲" : "喜");
      await game.delayx();
      if (num1 !== num2) {
        player.popup("洗具");
        player.chat("孩子们，这很好笑");
        await player.draw(parseInt(num1));
      } else {
        player.popup("杯具");
        player.chat("孩子们，这不好笑");
      }
    }
  },
  dcsaima: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter(event, player) {
      const card = event.card;
      if (get.type(card) !== "equip" || ![3, 4, 6].map((str) => "equip" + str).some((item) => get.subtypes(card).includes(item))) {
        return false;
      }
      return game.hasPlayer((target) => player.canCompare(target));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return player2.canCompare(target);
      }).set("ai", (target) => {
        const player2 = get.player();
        return get.damageEffect(target, player2, player2) + Math.max(3, target.countCards("h")) * get.effect(target, { name: "guohe_copy", position: "h" }, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      let num = 0, win = 0;
      while (num < 3) {
        num++;
        const { bool } = await player.chooseToCompare(target).forResult();
        if (bool) {
          win++;
          game.log("双方拼点剩余", "#y" + (3 - num), "场，", player, "已赢", "#g" + win, "场");
        }
      }
      if (win >= 2) {
        if (win === 2) {
          player.chat("今以吾之下驷与君上驷，取吾驷与君中驷，取吾中驷与君下驷。则吾一不胜而再胜");
        }
        player.line(target);
        await target.damage();
      }
    }
  },
  //夏侯恩
  olyinfeng: {
    audio: 2,
    trigger: { global: ["gainAfter", "loseAsyncAfter"] },
    getIndex(event, player) {
      return game.filterPlayer((current) => {
        if (current == player) {
          return false;
        }
        const cards2 = event.getg?.(current);
        if (!cards2?.length) {
          return false;
        }
        return event.getl?.(player)?.hs?.some((card) => cards2.includes(card)) && (cards2.some((card) => card.name == "chixueqingfeng") || player.countCards("h", { name: "chixueqingfeng" }));
      }).sortBySeat();
    },
    filter(event, player, name, target) {
      if (event.name === "loseAsync" && event.type !== "gain") {
        return false;
      }
      return target?.isIn();
    },
    forced: true,
    logTarget: (event, player, name, target) => target,
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      if (player.countCards("h", { name: "chixueqingfeng" })) {
        await target.damage();
      }
      if (trigger.getg(target).some((card) => card.name == "chixueqingfeng")) {
        await player.damage(target);
      }
    },
    group: "olyinfeng_gain",
    subSkill: {
      gain: {
        audio: "olyinfeng",
        trigger: {
          global: ["phaseBefore", "loseAfter", "loseAsyncAfter"],
          player: "enterGame"
        },
        forced: true,
        filter(event, player) {
          if (event.name.indexOf("lose") == 0) {
            if (event.type != "discard" || event.getlx === false || event.position != ui.discardPile) {
              return false;
            }
            return event.getd().some((card) => card.name == "chixueqingfeng" && get.position(card, true) == "d");
          }
          return event.name != "phase" || game.phaseNumber == 0;
        },
        async content(event, trigger, player) {
          if (trigger.name.indexOf("lose") == 0) {
            await player.loseHp();
            const cards2 = trigger.getd().filter((card) => card.name == "chixueqingfeng" && get.position(card, true) == "d");
            if (cards2.length) {
              await player.gain(cards2, "gain2");
            }
          } else {
            await player.gain(game.createCard2("chixueqingfeng", "spade", 6), "gain2");
          }
        }
      }
    }
  },
  olfulu: {
    audio: 2,
    trigger: { global: "useCardAfter" },
    filter(event, player) {
      const { card, player: target, targets } = event;
      if (card.name != "sha" || !target.countCards("h")) {
        return false;
      }
      if (player == target) {
        return targets.some((i) => i.isIn());
      }
      return event.olfulu_map?.[player.playerid] && targets.includes(player);
    },
    async cost(event, trigger, player) {
      const { player: target } = trigger;
      if (player == target) {
        event.result = await player.chooseCardTarget({
          prompt: get.prompt(event.skill),
          prompt2: "交给其中一名角色一张手牌，然后获得其至多两张手牌",
          filterCard: true,
          filterTarget(card, player2, target2) {
            return get.event().targets.includes(target2);
          },
          ai1(card) {
            const { player: player2, targets } = get.event();
            if (player2.countCards("h", { name: "chixueqingfeng" }) && player2.hasSkill("olyinfeng") && targets.some((target2) => get.damageEffect(target2, player2, player2) > 0)) {
              if (card.name == "chixueqingfeng") {
                return 0;
              }
              return 6.5 - get.value(card);
            }
            if (targets.some((target2) => get.effect(target2, { name: "shunshou_copy", position: "h" }, player2, player2) > 0)) {
              return 6.5 - get.value(card);
            }
            return 0;
          },
          ai2(target2) {
            const { player: player2, targets } = get.event();
            const cards2 = ui.selected.cards;
            if (!cards2.length) {
              return 0;
            }
            const { name } = cards2[0];
            const eff = get.effect(target2, { name: "shunshou_copy", position: "h" }, player2, player2) * Math.min(2, target2.countCards("h"));
            if (player2.countCards("h", { name: "chixueqingfeng" }) && name != "chixueqingfeng" && player2.hasSkill("olyinfeng")) {
              return get.damageEffect(target2, player2, player2) + eff;
            }
            return eff;
          }
        }).set(
          "targets",
          trigger.targets.filter((i) => i.isIn())
        ).forResult();
      } else {
        event.result = await target.chooseCard("h", get.prompt(event.skill), `交给${get.translation(player)}一张手牌，然后获得其至多两张手牌`).set("ai", (card) => {
          const { player: player2, target: target2 } = get.event();
          const att = get.attitude(player2, target2);
          if (att > 0) {
            const bool = target2.countCards("h", { name: "chixueqingfeng" });
            if (!target2.countCards("h")) {
              return 0;
            }
            return !bool && player2.needsToDiscard() ? 6 - get.value(card) : 0;
          }
          return get.effect(target2, { name: "shunshou_copy", position: "h" }, player2, player2) > 0 ? 6 - get.value(card) : 0;
        }).set("target", player).forResult();
      }
    },
    async content(event, trigger, player) {
      const { player: target } = trigger;
      const { cards: cards2, targets } = event;
      if (player == target) {
        const [target2] = targets;
        await player.give(cards2, target2);
        if (target2.countGainableCards(player, "h")) {
          await player.gainPlayerCard(target2, "h", [1, 2], true);
        }
      } else {
        await target.give(cards2, player);
        if (player.countGainableCards(target, "h")) {
          await target.gainPlayerCard(player, "h", [1, 2], true);
        }
      }
    },
    group: "olfulu_record",
    subSkill: {
      record: {
        trigger: { global: "useCard1" },
        silent: true,
        forced: true,
        popup: false,
        firstDo: true,
        filter(event, player) {
          const { card, player: target } = event;
          if (card.name != "sha") {
            return false;
          }
          return target != player && target.getHp() < player.getHp();
        },
        async content(event, trigger, player) {
          if (!trigger.olfulu_map) {
            trigger.olfulu_map = {};
          }
          trigger.olfulu_map[player.playerid] = true;
        }
      }
    }
  },
  //韩氏芜湖
  oljuejue: {
    audio: 2,
    trigger: {
      player: "useCard"
    },
    forced: true,
    filter(event, player) {
      if (!["sha", "shan", "tao", "jiu"].includes(get.name(event.card))) {
        return false;
      }
      return player.getAllHistory("useCard", (evt) => get.name(evt.card) === get.name(event.card)).indexOf(event) == 0;
    },
    async content(event, trigger, player) {
      if (trigger.card.name != "jiu") {
        trigger.baseDamage++;
      }
      trigger.addCount = false;
      const stat = player.getStat().card;
      const name = trigger.card.name;
      if (typeof stat[name] === "number") {
        stat[name]--;
      }
      trigger.set(event.name, true);
      player.when({ player: "useCardAfter" }).filter((evt) => evt.card === trigger.card && evt.oljuejue).step(async (event2, trigger2, player2) => {
        if (trigger2.cards.filterInD().length) {
          await player2.gain(trigger2.cards.filterInD(), "gain2");
        }
      });
    }
  },
  olpimi: {
    audio: 2,
    trigger: {
      player: "useCardToPlayered",
      target: "useCardToTargeted"
    },
    filter(event, player) {
      if (!event.card || event.targets.length != 1 || !event.player.isIn()) {
        return false;
      }
      return event.player !== player && player === event.targets[0] && event.player.hasCard((card) => lib.filter.canBeDiscarded(card, player, event.player), "he") || event.player === player && player !== event.targets[0] && player.hasCard((card) => lib.filter.cardDiscardable(card, player, "olpimi"), "he");
    },
    async cost(event, trigger, player) {
      let result, str = "的一张牌使此牌伤害或回复值+1，若使用者的手牌最多或最少，你摸一张牌且此技能本回合失效。";
      if (player === trigger.player) {
        result = player.chooseToDiscard("he", get.prompt(event.skill), "弃置" + get.translation(trigger.player) + str, "chooseonly").set("ai", (card) => {
          const player2 = get.player();
          let val = player2.getUseValue(card);
          const evt = get.event().getTrigger();
          const att = get.attitude(player2, evt.targets[0]);
          if (att > 0 && !["tao", "jiu"].includes(get.name(evt.card))) {
            return false;
          }
          if (get.name(card) === "sha" && player2.getUseValue(card) > 0) {
            val += 5;
          }
          return 20 - val;
        });
      } else {
        result = player.discardPlayerCard("he", trigger.player).set("chooseonly", true).set("prompt", get.prompt(event.skill)).set("prompt2", "弃置" + get.translation(trigger.player) + str).set("ai", (button) => {
          const player2 = get.player(), card = button.link;
          const event2 = get.event().getTrigger(), target = event2.player;
          if (get.attitude(player2, target) > 0) {
            return 0;
          }
          let eff = get.effect(target, { name: "guohe_copy2" }, player2, player2);
          if (eff <= 0) {
            return 0;
          }
          if (get.tag(event2.card, "damage")) {
            eff += get.effect(player2, event2.card, target, player2);
          }
          return eff > 0 ? get.value(card) * (1 + Math.random()) : 0;
        });
      }
      event.result = await result.forResult();
    },
    logTarget: "player",
    async content(event, trigger, player) {
      await trigger.player.modedDiscard(event.cards, player);
      trigger.getParent().baseDamage++;
      if (trigger.player.isMinHandcard() || trigger.player.isMaxHandcard()) {
        await player.draw();
        player.tempBanSkill(event.name);
      }
    }
  },
  //食岑昏
  dcbaoshi: {
    trigger: { player: "phaseDrawEnd" },
    async content(event, trigger, player) {
      let cards2 = [];
      while (true) {
        const next = game.cardsGotoOrdering(get.cards(cards2.length > 0 ? 1 : 2));
        await next;
        cards2.addArray(next.cards);
        game.log(player, "亮出了", next.cards);
        await player.showCards(get.translation(player) + "亮出的牌", cards2);
        let numx = cards2.filter((c) => !["tao", "jiu"].includes(get.name(c, player))).reduce((sum, card) => sum + get.cardNameLength(card), 0);
        if (numx > 10) {
          return;
        }
        const result = await player.chooseControlList(get.translation(event.name) + "：请选择一项（已亮出牌名字数之和为" + numx + "）", ["获得" + get.translation(cards2), "再亮出一张牌"], true).set("ai", () => get.event().numx < 7 ? 1 : 0).set("numx", numx).forResult();
        if (result.index == 0) {
          await player.gain(cards2, "gain2");
          break;
        }
      }
    }
  },
  dcxinggong: {
    enable: "phaseUse",
    filter: (event) => event.dcshixinggong_cards?.length,
    onChooseToUse: (event) => {
      if (game.online || event.type !== "phase" || event.dcshixinggong_cards) {
        return;
      }
      event.set("dcshixinggong_cards", _status.discarded);
    },
    usable: 1,
    chooseButton: {
      dialog: (event) => {
        return ui.create.dialog('###兴功###<div class="text center">请选择要从弃牌堆获得的牌</div>', event.dcshixinggong_cards, "hidden");
      },
      select: [1, Infinity],
      allowChooseAll: true,
      check: (button) => {
        const player = get.player();
        if (player.hasSkillTag("filterDamage") || player.hasSkillTag("nodamage")) {
          return get.value(button.link);
        }
        if (ui.selected.buttons.length >= player.getHp() && get.damageEffect(player, player, player) < 0) {
          return 0;
        }
        return get.value(button.link);
      },
      backup: (links) => {
        return {
          audio: "dcshixinggong",
          card: links,
          async content(event, trigger, player) {
            const card = lib.skill.dcxinggong_backup.card;
            await player.gain(card, "gain2");
            const num = card.length - player.getHp();
            if (num > 0) {
              await player.damage(num);
            }
          }
        };
      },
      prompt: (links) => '###兴功###<div class="text center">点击“确定”获得' + get.translation(links) + "</div>"
    },
    ai: {
      order: 1,
      threaten: 2,
      result: { player: 11 }
    },
    subSkill: { backup: {} }
  },
  //年兽
  olsuichong: {
    trigger: {
      global: "phaseBefore",
      player: ["phaseZhunbeiBegin", "enterGame"]
    },
    filter(event, player) {
      if (!get.info("olsuichong").derivation.some((skill) => !player.hasSkill(skill, null, false, false))) {
        return false;
      }
      if (event.name !== "phaseZhunbei") {
        return event.name !== "phase" || game.phaseNumber === 0;
      }
      if (!_status.connectMode && game.changeCoin && lib.config.coin < Math.max(10, game.countPlayer() + 1)) {
        return false;
      }
      return game.getAllGlobalHistory("everything", (evt) => evt.name === "olsuichong" && evt.player === player && evt._trigger?.name === "phaseZhunbei").length < 3;
    },
    prompt2(event, player) {
      const cost = !_status.connectMode && game.changeCoin;
      return (cost ? "消耗" + Math.max(10, game.countPlayer() + 1) + "金币" : "") + "发起拼手气红包，手气最好的角色从三个生肖兽技能中选择一个令你获得";
    },
    logTarget: () => game.filterPlayer(),
    async cost(event, trigger, player) {
      const cost = !_status.connectMode && game.changeCoin;
      if (trigger.name == "phaseZhunbei") {
        event.result = await player.chooseBool({
          prompt: "岁祟：" + (cost ? "消耗" + Math.max(10, game.countPlayer() + 1) + "金币" : "") + "发起拼手气红包，手气最好的角色从三个生肖兽技能中选择一个令你获得",
          ai: () => true
        }).forResult();
      } else {
        event.result = {
          bool: true
        };
      }
    },
    async content(event, trigger, player) {
      const targets = game.filterPlayer().sortBySeat(player);
      let coin = Math.max(10, game.countPlayer() + 1);
      const cost = !_status.connectMode && game.changeCoin;
      if (cost) {
        game.changeCoin(-coin);
      }
      let humans = targets.filter((current) => current === game.me || current.isOnline());
      let locals = targets.slice().removeArray(humans).randomSort(), coinMap = /* @__PURE__ */ new Map([]);
      event._global_waiting = true;
      let time = 1e4, eventId = get.id();
      const send = (current, eventId2) => {
        get.info("olsuichong").chooseOk(current, eventId2);
        game.resume();
      };
      if (lib.configOL && lib.configOL.choose_timeout) {
        time = parseInt(lib.configOL.choose_timeout) * 1e3;
      }
      for (let i of targets) {
        i.showTimer(time);
      }
      if (humans.length > 0) {
        const solve = function(resolve, reject) {
          return function(result2, player2) {
            coinMap.set(player2, get.info("olsuichong").getNum(coin, coinMap, targets.length));
            resolve();
          };
        };
        await Promise.all(
          humans.map((current) => {
            return new Promise((resolve, reject) => {
              if (current.isOnline()) {
                current.send(send, current, eventId);
                current.wait(solve(resolve));
              } else {
                const next = get.info("olsuichong").chooseOk(current, eventId);
                const solver = solve(resolve);
                if (_status.connectMode) {
                  game.me.wait(solver);
                }
                return next.forResult().then((result2) => {
                  if (_status.connectMode) {
                    game.me.unwait(result2, current);
                  } else {
                    solver(result2, current);
                  }
                });
              }
            });
          })
        ).catch(() => {
        });
        game.broadcastAll("cancel", eventId);
      }
      if (locals.length > 0) {
        for (let current of locals) {
          coinMap.set(current, get.info("olsuichong").getNum(coin, coinMap, targets.length));
        }
      }
      delete event._global_waiting;
      for (let i of targets) {
        i.hideTimer();
      }
      const videoId = lib.status.videoId++, list = Array.from(coinMap.entries()).sort((a, b) => b[1] - a[1]), winner = list[0][0];
      if (cost) {
        game.changeCoin(coinMap.get(player));
      }
      game.log(winner, "为本次", "#y拼手气", "中手气最好的角色");
      game.broadcastAll(
        (player2, id, list2, cost2) => {
          const dialog = ui.create.dialog(get.translation(player2) + "发起了拼手气红包");
          dialog.videoId = id;
          dialog.classList.add("fullheight");
          const double = list2.length > 4;
          for (let index = 0; index < list2.length; index++) {
            let newRow = [
              {
                item: [[list2[index][0]]],
                ratio: 2
              },
              {
                item: (index === 0 ? "<font color=#FFA500>" : "") + "抢到" + list2[index][1] + (cost2 ? "金币" : "欢乐豆") + (index === 0 ? "" : "</font>"),
                ratio: 5
              }
            ];
            if (double && index < list2.length - 1) {
              index++;
              newRow.addArray([
                {
                  item: [[list2[index][0]]],
                  ratio: 2
                },
                {
                  item: "抢到" + list2[index][1] + (cost2 ? "金币" : "欢乐豆"),
                  ratio: 5
                }
              ]);
            }
            dialog.addNewRow(...newRow);
          }
        },
        player,
        videoId,
        list,
        cost
      );
      await game.delay(3);
      game.broadcastAll("closeDialog", videoId);
      const skills2 = get.info("olsuichong").derivation.filter((skill2) => !player.hasSkill(skill2, null, false, false)).randomGets(3);
      const result = skills2.length > 1 ? await winner.chooseButton(["岁崇：请选择一个生肖兽技能令" + get.translation(player) + "获得", [skills2.map((skill2) => [skill2, '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + get.translation(skill2) + "】</div><div>" + lib.translate[skill2 + "_info"] + "</div></div>"]), "textbutton"]], true).set("ai", () => 1 + Math.random()).forResult() : { links: skills2 };
      const skill = result?.links?.[0];
      if (skill) {
        winner.line(player);
        await player.addAdditionalSkills("olsuichong", [skill]);
      }
    },
    derivation: ["olzishu", "olchouniu", "olyinhu", "olmaotu", "olchenlong", "olsishe", "olwuma", "olweiyang", "olshenhou", "olyouji", "olxugou", "olhaizhu"],
    /*
    模拟随机抢红包的过程，同时尽量保证公平性。具体思路如下：
    基础分配：每个人至少分配1元，确保每个人都能抢到红包。
    剩余金额分配：将剩余金额随机分配，但尽量保证分配的随机性不会导致先抢的人优势过大。
    随机性与公平性平衡：通过随机分配剩余金额，但限制每次分配的最大值，避免某一个人抢到过多金额。
    */
    getNum(coin, coinMap, max) {
      const remainingCoin = coin - Array.from(coinMap.values()).reduce((sum, num) => sum + num, 0), remainingPeople = max - coinMap.size;
      if (remainingCoin === remainingPeople) {
        return 1;
      }
      if (remainingPeople === 1) {
        return remainingCoin;
      }
      const maxAllocatable = Math.min(remainingCoin - remainingPeople + 1, Math.floor(remainingCoin / remainingPeople) + 1);
      return Math.floor(Math.random() * maxAllocatable) + 1;
    },
    chooseOk(player, eventId) {
      return player.chooseControl("ok").set("prompt", "新年新气象，来拼个手气吧！").set("prompt2", "点击“确定”进行抢红包").set("id", eventId).set("_global_waiting", true);
    }
  },
  olshouhun: {
    trigger: {
      global: "phaseBefore",
      player: ["phaseDrawBegin2", "damageBegin4", "enterGame"]
    },
    filter(event, player) {
      const storage = player.storage?.["olshouhun"];
      if (!storage) {
        return false;
      }
      if (event.name === "damage") {
        return storage.some((num) => num < 4);
      }
      if (event.name === "phaseDraw") {
        return !event.numFixed && storage[0] > 0;
      }
      return storage[2] > 0 && (event.name !== "phase" || game.phaseNumber === 0);
    },
    forced: true,
    async content(event, trigger, player) {
      const skill = event.name, storage = player.getStorage(skill, [0, 1, 2]);
      switch (trigger.name) {
        case "damage": {
          if (!player.storage?.[skill]) {
            return;
          }
          const list = ["摸牌数", "手牌上限", "体力上限"];
          const choices = [0, 1, 2].filter((num) => storage[num] === Math.min(...storage));
          const result = choices.length > 1 ? await player.chooseControl(choices.map((num) => list[num])).set("ai", () => {
            const list2 = ["摸牌数", "体力上限", "手牌上限"];
            return get.event().controls.sort((a, b) => list2.indexOf(a) - list2.indexOf(b))[0];
          }).set("prompt", "兽魂：请选择一个数值项最小的选项，令其数值+1").forResult() : { control: list[choices[0]] };
          const choice = result?.control;
          if (choice) {
            const index = list.indexOf(choice);
            player.popup(choice);
            game.log(player, "令", "#g【" + get.translation(skill) + "】", "的", "#y" + choice + "+1");
            player.storage[skill][index]++;
            player.markSkill(skill);
            player.addTip(skill, [get.translation(skill)].concat(player.storage[skill]).join(" "));
            if (index === 2) {
              await player.gainMaxHp();
            }
          }
          break;
        }
        case "phaseDraw":
          trigger.num += storage[0];
          break;
        default:
          await player.gainMaxHp(storage[2]);
          break;
      }
    },
    init(player, skill) {
      player.storage[skill] = player.storage[skill] || [0, 1, 2];
      player.markSkill(skill);
      player.addTip(skill, [get.translation(skill)].concat(player.storage[skill]).join(" "));
    },
    onremove(player, skill) {
      delete player.storage[skill];
      player.removeTip(skill);
    },
    mark: true,
    intro: {
      markcount: (storage) => (storage || [0, 1, 2]).map((num) => num.toString()).join(""),
      content(storage = [0, 1, 2]) {
        return ["摸牌阶段额外摸" + storage[0] + "张牌", "手牌上限+" + storage[1], "体力上限+" + storage[2]].map((str) => "<li>" + str).join("<br>");
      }
    },
    mod: { maxHandcard: (player, num) => num + (player.getStorage("olshouhun", [0, 1, 2])[1] || 0) }
  },
  //十二生肖
  olzishu: {
    audio: true,
    enable: "phaseUse",
    usable: 1,
    selectTarget: 1,
    filter(event, player) {
      return game.hasPlayer((target) => get.info("olzishu").filterTarget(null, player, target));
    },
    filterTarget(card, player, target) {
      return target !== player && target.countCards("h") > player.countCards("h");
    },
    async content(event, trigger, player) {
      await player.gainPlayerCard(event.target, "h", true);
      while (game.hasPlayer((target) => get.info(event.name).filterTarget(null, player, target)) && !player.isMaxHandcard()) {
        const result = await player.chooseTarget("是否继续获得手牌数大于你的一名角色的一张手牌？", get.info(event.name).filterTarget).set("ai", function(target) {
          const player2 = get.player();
          return get.effect(target, { name: "shunshou_copy", position: "h" }, player2, player2);
        }).forResult();
        if (result.bool) {
          player.line(result.targets[0]);
          await player.gainPlayerCard(result.targets[0], "h", true);
        } else {
          break;
        }
      }
    },
    ai: {
      order: 0.01,
      result: {
        player(player, target) {
          return get.effect(target, { name: "shunshou_copy", position: "h" }, player, player);
        }
      }
    }
  },
  olchouniu: {
    audio: true,
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      return player.isMinHp();
    },
    forced: true,
    async content(event, trigger, player) {
      await player.recover();
    }
  },
  olyinhu: {
    audio: true,
    enable: "phaseUse",
    filter(event, player) {
      return player.hasCard((card) => get.info("olyinhu").filterCard(card, player), "he");
    },
    filterCard(card, player) {
      if (!lib.filter.cardDiscardable(card, player)) {
        return false;
      }
      return !player.getStorage("olyinhu_used").some((cardx) => get.type2(cardx[2]) === get.type2(card));
    },
    filterTarget: lib.filter.notMe,
    check(card) {
      return 8 - get.value(card);
    },
    position: "he",
    async content(event, trigger, player) {
      const [card] = event.cards;
      player.addTempSkill("olyinhu_used", "phaseUseAfter");
      player.markAuto("olyinhu_used", [[get.translation(get.type2(card)), "", card.name]]);
      const next = event.target.damage();
      await next;
      if (game.getGlobalHistory("everything", (evt) => {
        return evt.name === "dying" && evt.getParent(next.name) === next;
      }).length > 0) {
        player.tempBanSkill("olyinhu");
      }
    },
    ai: {
      order: 7,
      result: {
        player(player, target) {
          return get.damageEffect(target, player, player);
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true,
        intro: {
          name: "弃置过的牌",
          mark(dialog, content = []) {
            if (content.length) {
              dialog.addSmall([content, "vcard"]);
            }
          }
        }
      }
    }
  },
  olmaotu: {
    audio: true,
    trigger: { global: "dyingAfter" },
    filter(event, player) {
      return !player.hasSkill("olmaotu_effect", null, false, false);
    },
    forced: true,
    async content(event, trigger, player) {
      player.addTempSkill("olmaotu_effect", { player: "phaseBegin" });
    },
    subSkill: {
      effect: {
        charlotte: true,
        mod: {
          targetEnabled(card, player, target) {
            if (player !== target && player.getHp() >= target.getHp()) {
              return false;
            }
          }
        },
        mark: true,
        intro: { content: "不能成为体力值大于等于你的其他角色使用牌的目标" }
      }
    }
  },
  olchenlong: {
    audio: true,
    enable: "phaseUse",
    filterTarget: lib.filter.notMe,
    usable: 1,
    async content(event, trigger, player) {
      player.addTempSkill("olchenlong_temp");
      const result = await player.chooseNumbers(get.translation(event.name), [{ prompt: "请选择你要失去的体力值", min: 1, max: 2 }], true).set("processAI", () => {
        const player2 = get.player();
        let num2 = Math.min(2, player2.getHp() - 1);
        if (!player2.hasCard((card) => player2.canSaveCard(card, player2), "hs")) {
          num2 = Math.min(2, player2.getHp());
        }
        return [num2];
      }).forResult(), num = result.numbers?.[0];
      if (num) {
        await player.loseHp(num);
        await event.target.damage(num);
      }
    },
    ai: {
      order: 1,
      result: {
        player(player, target) {
          if (player.getHp() + player.countCards("hs", (card) => player.canSaveCard(card, player)) <= 1) {
            return 0;
          }
          return get.damageEffect(target, player, player);
        }
      }
    },
    subSkill: {
      temp: {
        audio: "olchenlong",
        charlotte: true,
        trigger: { player: "dying" },
        filter(event, player) {
          return event.getParent("loseHp").name === "olchenlong";
        },
        async content(event, trigger, player) {
          await player.loseMaxHp();
        }
      }
    }
  },
  olsishe: {
    audio: true,
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return event.source?.isIn();
    },
    check(event, player) {
      return get.damageEffect(event.source, player, player) > 0;
    },
    logTarget: "source",
    async content(event, trigger, player) {
      await trigger.source.damage(trigger.num);
    },
    ai: {
      threaten: 0.6,
      maixie: true,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return [1, -1.5];
          }
          if (target.hasFriend() && get.tag(card, "damage")) {
            return [1, 0, 0, -0.7];
          }
        }
      }
    }
  },
  olwuma: {
    audio: true,
    trigger: { target: "useCardToTargeted" },
    filter(event, player) {
      return event.player !== player && get.type2(event.card) === "trick";
    },
    forced: true,
    async content(event, trigger, player) {
      await player.draw();
    },
    group: ["olwuma_turn", "olwuma_skip"],
    subSkill: {
      turn: {
        audio: "olwuma",
        trigger: { player: "turnOverBefore" },
        filter(event, player) {
          return !player.isTurnedOver();
        },
        forced: true,
        async content(event, trigger, player) {
          trigger.cancel();
        }
      },
      skip: {
        audio: "olwuma",
        trigger: {
          player: ["phaseAnySkipped", "phaseAnyCancelled"]
        },
        forced: true,
        async content(event, trigger, player) {
          game.log(player, "恢复了", trigger.name);
          player[trigger.name]();
        }
      }
    }
  },
  olweiyang: {
    audio: true,
    enable: "phaseUse",
    filter(event, player) {
      if (!player.hasCard((card) => lib.filter.cardDiscardable(card, player), "he")) {
        return false;
      }
      return game.hasPlayer((target) => target.isDamaged());
    },
    filterCard(card, player) {
      if (!lib.filter.cardDiscardable(card, player)) {
        return false;
      }
      return !ui.selected.cards?.some((cardx) => get.type2(card) === get.type2(cardx));
    },
    selectCard: [1, Infinity],
    position: "he",
    complexCard: true,
    check(card) {
      var player = _status.event.player;
      var count = game.filterPlayer(function(current) {
        return current.isDamaged() && get.attitude(player, current) > 2;
      }).length;
      if (ui.selected.cards.length >= count) {
        return -1;
      }
      return 8 - get.value(card);
    },
    filterTarget(card, player, target) {
      return target.isDamaged();
    },
    selectTarget() {
      return ui.selected.cards.length;
    },
    usable: 1,
    async content(event, trigger, player) {
      const { target } = event;
      await target.recover();
    },
    ai: {
      order: 6,
      result: {
        player(player, target) {
          return get.recoverEffect(target, player, player);
        }
      }
    }
  },
  olshenhou: {
    audio: true,
    trigger: { target: "useCardToTargeted" },
    filter(event, player) {
      return event.player !== player && event.card.name === "sha";
    },
    check(event, player) {
      return get.effect(player, event.card, event.player, player) <= 0;
    },
    async content(event, trigger, player) {
      const result = await player.judge((card) => get.color(card) === "red" ? 2 : -2).forResult();
      if (result.bool) {
        trigger.getParent().excluded.add(player);
      }
    },
    ai: {
      effect: {
        target(card) {
          if (card.name === "sha") {
            return [1, 0.4];
          }
        }
      }
    }
  },
  olyouji: {
    audio: true,
    trigger: { player: "phaseDrawBegin2" },
    filter(event, player) {
      return game.roundNumber > 0 && !event.numFixed;
    },
    forced: true,
    async content(event, trigger, player) {
      trigger.num += Math.min(5, game.roundNumber);
    }
  },
  olxugou: {
    mod: {
      targetInRange(card, player, target) {
        if (card.name === "sha" && ["unsure", "red"].includes(get.color(card))) {
          return true;
        }
      }
    },
    audio: true,
    trigger: { player: "useCard" },
    filter(event, player) {
      return event.card.name === "sha" && get.color(event.card) === "red";
    },
    forced: true,
    async content(event, trigger, player) {
      trigger.baseDamage++;
    },
    ai: {
      effect: {
        player(card, player, target) {
          if (card.name === "sha" && get.color(card) === "red") {
            if (get.attitude(player, target) > 0) {
              return [1, -0.5];
            }
            return [1, 0.8];
          }
        }
      }
    },
    group: "olxugou_buff",
    subSkill: {
      buff: {
        audio: "olxugou",
        trigger: { target: "shaBefore" },
        filter(event, player) {
          return get.color(event.card) == "red";
        },
        forced: true,
        async content(event, trigger, player) {
          trigger.cancel();
        },
        ai: {
          effect: {
            target(card, player, target) {
              if (card.name === "sha" && get.color(card) === "red") {
                return "zerotarget";
              }
            }
          }
        }
      }
    }
  },
  olhaizhu: {
    audio: true,
    trigger: {
      player: "phaseZhunbeiBegin",
      global: ["loseAfter", "loseAsyncAfter"]
    },
    filter(event, player) {
      if (event.name === "phaseZhunbei") {
        return player.isMaxHandcard();
      }
      if (event.type !== "discard" || event.getlx === false) {
        return false;
      }
      return game.hasPlayer((target) => {
        if (target === player) {
          return false;
        }
        return event.getl?.(target)?.cards2?.some((card) => get.color(card) === "black" && get.position(card, true) === "d");
      });
    },
    forced: true,
    async content(event, trigger, player) {
      if (trigger.name === "phaseZhunbei") {
        await player.loseHp();
        return event.finish();
      }
      if (trigger.delay === false) {
        await game.delay();
      }
      await player.gain(
        game.filterPlayer((target) => {
          if (target === player) {
            return false;
          }
          return trigger.getl?.(target)?.cards2?.some((card) => get.color(card) === "black" && get.position(card, true) === "d");
        }).reduce((list, target) => {
          return list.addArray(trigger.getl(target).cards2.filter((card) => get.color(card) === "black" && get.position(card, true) === "d"));
        }, []),
        "gain2"
      );
    }
  },
  //战神吕布
  olfengzhu: {
    audio: 1,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => player != current && current.hasSex("male") && !player.getStorage("olfengzhu").includes(current));
    },
    locked: true,
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(
        (card, player2, target) => {
          return player2 != target && target.hasSex("male") && !player2.getStorage("olfengzhu").includes(target);
        },
        "逢主：义父你在哪儿？",
        lib.translate.olfengzhu_info,
        true
      ).set("ai", (target) => {
        const player2 = get.player();
        const att = get.attitude(player2, target), num = target.getHp();
        return (-att + 0.1) * get.effect(player2, { name: "draw" }, player2, player2) * num;
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0], num = target.getHp();
      player.markAuto(event.name, [target]);
      await player.draw(num);
      const [surname] = get.characterSurname(target.name)[0];
      if (surname) {
        game.broadcastAll(
          (player2, surname2) => {
            if (player2.name == "ol_jsrg_lvbu" || player2.name1 == "ol_jsrg_lvbu") {
              player2.node.name.innerHTML = `战神${surname2}布`;
            }
            if (player2.name2 == "ol_jsrg_lvbu") {
              player2.node.name2.innerHTML = `战神${surname2}布`;
            }
            lib.character.ol_jsrg_lvbu.names = lib.character.ol_jsrg_lvbu.names + `-${surname2}|布`;
          },
          player,
          surname
        );
      } else {
        player.chat("不是，连姓也没有？什么罐头我说！");
      }
    },
    intro: { content: "当前的义父有：$" }
  },
  olyuyu: {
    audio: 1,
    trigger: { player: "phaseEnd" },
    filter(event, player) {
      return game.hasPlayer((current) => player.getStorage("olfengzhu").includes(current));
    },
    locked: true,
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(
        get.prompt(event.name.slice(0, -5)),
        (card, player2, target) => {
          return player2.getStorage("olfengzhu").includes(target);
        },
        "选择一名义父，令其饮恨",
        true
      ).set("ai", (target) => {
        const player2 = get.player();
        return -get.attitude(player2, target);
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target],
        name
      } = event;
      target.addMark(name);
      player.addSkill(name + "_effect");
      player.markAuto(name + "_effect", [target]);
    },
    marktext: "恨",
    intro: {
      name: "恨(玉玉)",
      name2: "恨",
      content: "mark"
    },
    ai: { combo: "olfengzhu" },
    subSkill: {
      effect: {
        audio: "olyuyu",
        charlotte: true,
        onremove: true,
        intro: { content: "于$回合内受到1点伤害或失去一张牌后，其获得1枚“恨“标记" },
        trigger: {
          player: ["loseAfter", "damageEnd"],
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          const target = _status.currentPhase;
          if (!target || !player.getStorage("olfengzhu").includes(target) || !target.isIn()) {
            return false;
          }
          if (event.name == "damage") {
            return event.num > 0;
          }
          const evt = event.getl(player);
          return evt?.cards2?.length;
        },
        forced: true,
        logTarget: () => _status.currentPhase,
        async content(event, trigger, player) {
          const num = trigger.name == "damage" ? trigger.num : trigger.getl(player).cards2.length;
          _status.currentPhase.addMark("olyuyu", num);
        }
      }
    }
  },
  ollbzhiji: {
    audio: 2,
    trigger: { player: "useCardToPlayer" },
    filter(event, player) {
      return player.getStorage("olfengzhu").includes(event.target) && event.target.hasMark("olyuyu");
    },
    forced: true,
    logTarget: "target",
    async content(event, trigger, player) {
      const { card, target } = trigger;
      let num = target.countMark("olyuyu");
      if (get.is.damageCard(card)) {
        const evt = trigger.getParent();
        if (typeof evt.baseDamage != "number") {
          evt.baseDamage = 1;
        }
        evt.baseDamage += num;
        game.log(card, "伤害", `#g+${num}`);
        target.clearMark("olyuyu");
      } else {
        while (num--) {
          const judgeEvent = player.judge((card2) => {
            return get.type(card2) == "equip" || ["sha", "juedou"].includes(get.name(card2)) ? 1.5 : -1.5;
          });
          judgeEvent.judge2 = (result) => result.bool;
          judgeEvent.set("callback", async (event2) => {
            const { card: card2 } = event2;
            if (get.type(card2) == "equip" && !player.hasSkill("shenji")) {
              await player.addSkills("shenji");
            }
            if (["sha", "juedou"].includes(get.name(card2))) {
              if (!player.hasSkill("wushuang")) {
                await player.addSkills("wushuang");
              }
              if (get.position(card2, true) == "o") {
                await player.gain(card2, "gain2");
              }
            }
          });
          await judgeEvent;
        }
      }
    },
    derivation: ["shenji", "wushuang"],
    ai: { combo: "olfengzhu" }
  },
  oljiejiu: {
    audio: 1,
    mod: {
      cardEnabled(card, player) {
        if (card.name == "jiu") {
          return false;
        }
      },
      cardSavable(card, player) {
        if (card.name == "jiu") {
          return false;
        }
      }
    },
    enable: "chooseToUse",
    filter(event, player) {
      if (event.type == "wuxie") {
        return false;
      }
      if (!player.hasCard((card) => {
        return _status.connectMode || get.name(card) == "jiu";
      }, "hes")) {
        return false;
      }
      return get.inpileVCardList((info) => {
        if (info[0] != "basic") {
          return false;
        }
        return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
      }).length;
    },
    chooseButton: {
      dialog(event, player) {
        const vcards = get.inpileVCardList((info) => {
          if (info[0] != "basic") {
            return false;
          }
          return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
        });
        return ui.create.dialog("戒酒", [vcards, "vcard"]);
      },
      check(button) {
        if (get.event().getParent().type != "phase") {
          return 1;
        }
        return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
      },
      backup(links, player) {
        return {
          audio: "oljiejiu",
          popname: true,
          viewAs: { name: links[0][2], nature: links[0][3] },
          filterCard(card, player2) {
            return get.name(card) == "jiu";
          },
          check(card) {
            return 7 - get.value(card);
          },
          position: "hes"
        };
      },
      prompt(links, player) {
        return "将一张【酒】当" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
      }
    },
    hiddenCard(player, name) {
      if (get.type(name) !== "basic") {
        return false;
      }
      return lib.inpile.includes(name) && player.hasCard((card) => {
        return _status.connectMode || get.name(card) == "jiu";
      }, "hes");
    },
    ai: {
      respondSha: true,
      respondShan: true,
      skillTagFilter(player) {
        if (!player.hasCard((card) => {
          return _status.connectMode || get.name(card) == "jiu";
        }, "hes")) {
          return false;
        }
      },
      order: 3,
      result: {
        player(player) {
          return get.event().dying ? get.attitude(player, get.event().dying) : 1;
        }
      }
    },
    derivation: "lijian",
    group: "oljiejiu_jiese",
    subSkill: {
      backup: {},
      jiese: {
        audio: "oljiejiu",
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        filter(event, player) {
          if (!get.info("oljiejiu_jiese").logTarget(event, player).length) {
            return false;
          }
          return event.name != "phase" || game.phaseNumber == 0;
        },
        forced: true,
        logTarget: (event, player) => game.filterPlayer((current) => {
          if (!current.hasSex("female") || player == current) {
            return false;
          }
          return current.getStockSkills(true, true).length;
        }),
        async content(event, trigger, player) {
          for (const target of event.targets.sortBySeat()) {
            const skills2 = target.getStockSkills(true, true);
            if (!skills2.length) {
              continue;
            }
            const skill = skills2.randomRemove();
            await target.changeSkills(["lijian"], [skill]);
            game.broadcastAll(
              (target2, skill2) => {
                for (const name of get.nameList(target2)) {
                  if (get.character(name, 3).includes(skill2)) {
                    get.character(name, 3).add("lijian");
                    get.character(name, 3).remove(skill2);
                  }
                }
              },
              target,
              skill
            );
          }
        }
      }
    }
  },
  //卫青
  dcbeijin: {
    enable: "phaseUse",
    manualConfirm: true,
    async content(event, trigger, player) {
      player.addSkill("dcbeijin_effect");
      player.addSkill("dcbeijin_effect2");
      player.addTempSkill("dcbeijin_buff");
      await player.draw({ gaintag: ["dcbeijin_effect"] });
    },
    ai: {
      order: 20,
      result: {
        player(player) {
          return player.hasCard((card) => card.hasGaintag("dcbeijin_effect"), "h") ? 0 : 1;
        }
      }
    },
    locked: false,
    mod: {
      aiValue(player, card, num) {
        if (card.name === "zhangba") {
          return num + 1145141919810;
        }
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        mod: {
          cardUsable(card) {
            if (get.number(card) === "unsure" || card.cards?.some((card2) => card2.hasGaintag("dcbeijin_effect"))) {
              return Infinity;
            }
          },
          aiOrder(player, card, num) {
            const cards2 = (get.itemtype(card) === "card" ? [card] : card.cards) ?? [];
            if (player.getHp() === 1 && player.hasSkill("dcbeijin_buff")) {
              if (player.hasCard((card2) => card2.hasGaintag("dcbeijin_effect") && !cards2.includes(card2), "h") && !player.hasCard((card2) => player.canSaveCard(card2, player) && !cards2.includes(card2), "hs")) {
                return 0;
              }
            }
            if (cards2.some((card2) => card2.hasGaintag("dcbeijin_effect"))) {
              return num + 100;
            }
            return num / (get.tag(card, "recover") ? 1 : 1145141919810);
          }
        },
        trigger: { player: "useCard1" },
        filter(event, player) {
          return event.addCount !== false && player.hasHistory("lose", (evt) => {
            const evtx = evt.relatedEvent || evt.getParent();
            if (evtx !== event) {
              return false;
            }
            return Object.values(evt.gaintag_map).flat().includes("dcbeijin_effect");
          });
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          trigger.addCount = false;
          const stat = player.getStat().card;
          const name = trigger.card.name;
          if (typeof stat[name] === "number") {
            stat[name]--;
          }
        }
      },
      //这是一个永久效果
      effect2: {
        forced: true,
        popup: false,
        charlotte: true,
        trigger: { player: "dcbeijinBegin" },
        filter(event, player) {
          return player.hasCard((card) => card.hasGaintag("dcbeijin_effect"));
        },
        async content(event, trigger, player) {
          await player.loseHp();
        }
      },
      buff: {
        charlotte: true,
        trigger: { player: ["useCard"] },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          player.removeSkill(event.name);
          if (player.hasCard((card) => card.hasGaintag("dcbeijin_effect"))) {
            await player.loseHp();
          }
        },
        mark: true,
        intro: { content: "本回合下次使用牌时，若手牌中有因【北进】得到的牌，你失去1点体力" }
      }
    }
  },
  //姜子牙
  xingzhou: {
    usable: 1,
    trigger: {
      global: "damageEnd"
    },
    filter(event, player) {
      if (!event.source || !event.source.isIn()) {
        return false;
      }
      if (!player.canUse({ name: "sha" }, event.source, false)) {
        return false;
      }
      return player.countCards("h") > 1 && event.player.isMinHandcard();
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard("h", 2, get.prompt2(event.skill, trigger.source)).set("chooseonly", true).set("ai", (card) => {
        const player2 = get.player(), target = get.event().getTrigger().source;
        if (!player2.canUse({ name: "sha" }, target, false)) {
          return 0;
        }
        if (get.effect(target, { name: "sha" }, player2, player2) <= 0) {
          return 0;
        }
        return 6 - get.value(card);
      }).forResult();
      event.result.targets = [trigger.source];
    },
    async content(event, trigger, player) {
      const { cards: cards2, targets } = event;
      await player.discard(cards2);
      const card = { name: "sha", isCard: true };
      if (player.canUse(card, targets[0], false)) {
        await player.useCard(card, targets, false);
      }
      if (game.getGlobalHistory("everything", (evt) => {
        if (evt.name != "die" || evt.player != targets[0]) {
          return false;
        }
        return evt.reason?.getParent(event.name) == event;
      }).length > 0) {
        player.restoreSkill("lieshen");
      }
    }
  },
  lieshen: {
    init(player) {
      player.addSkill("lieshen_init");
    },
    onremove(player) {
      player.removeSkill("lieshen_init");
    },
    enable: "phaseUse",
    mark: true,
    skillAnimation: true,
    animationColor: "gray",
    limited: true,
    onChooseToUse(event) {
      if (game.online) {
        return;
      }
      let list = [];
      if (_status.lieshen_map) {
        let map = _status.lieshen_map;
        for (let key in map) {
          let target = game.findPlayer((current) => current.playerid == key);
          if (target) {
            list.add([target, ...map[key]]);
          }
        }
      }
      event.set("lieshen_list", list);
    },
    filter(event, player) {
      const list = event.lieshen_list;
      if (!list || !list.length) {
        return false;
      }
      return list.some((map) => {
        return map[0].hp != map[1] || map[0].countCards("h") != map[2];
      });
    },
    filterTarget(card, player, target) {
      const list = _status.event.lieshen_list;
      return list.some((map) => {
        if (map[0] != target) {
          return false;
        }
        return map[0].hp != map[1] || map[0].countCards("h") != map[2];
      });
    },
    async content(event, trigger, player) {
      const target = event.target;
      player.awakenSkill(event.name);
      const map = _status.lieshen_map[target.playerid];
      if (map) {
        if (target.hp > map[0]) {
          await target.loseHp(target.hp - map[0]);
        } else if (target.hp < map[0]) {
          await target.recoverTo(map[0]);
        }
        const num = target.countCards("h");
        if (num > map[1]) {
          await target.chooseToDiscard("h", num - map[1], true);
        } else if (num < map[1]) {
          await target.drawTo(map[1]);
        }
      }
    },
    ai: {
      order: 2,
      result: {
        target(player, target) {
          const list = _status.event.lieshen_list;
          if (!list || !list.length) {
            return 0;
          }
          const map = list.find((key) => key[0] == target);
          if (!map) {
            return 0;
          }
          let eff = 0, num1 = target.hp - map[1], num2 = target.countCards("h") - map[2];
          if (num1 > 0) {
            eff += get.effect(target, { name: "losehp" }, target, target) * num1;
          } else if (num1 < 0) {
            eff -= get.recoverEffect(target, target, target) * num1;
          }
          if (num2 > 0) {
            eff += get.effect(target, { name: "guohe_copy2" }, target, target) * num2;
          } else if (num2 < 0) {
            eff -= get.effect(target, { name: "draw" }, target, target) * num2;
          }
          if (Math.abs(eff) <= 5) {
            return 0;
          }
          return eff;
        }
      }
    },
    subSkill: {
      init: {
        trigger: {
          global: ["phaseBefore", "enterGame"]
        },
        filter(event, player) {
          return event.name != "phase" || game.phaseNumber == 0;
        },
        charlotte: true,
        lastDo: true,
        async cost(event, trigger, player) {
          let targets = game.players;
          if (trigger.name != "phase" && trigger.player != player) {
            targets = [trigger.player];
          }
          let bool = targets.some((target) => {
            if (!_status.lieshen_map) {
              return true;
            }
            return !_status.lieshen_map[target.playerid];
          });
          event.result = {
            bool,
            targets,
            skill_popup: false
          };
        },
        async content(event, trigger, player) {
          if (!_status.lieshen_map) {
            _status.lieshen_map = {};
          }
          for (let target of event.targets) {
            if (_status.lieshen_map[target.playerid]) {
              continue;
            }
            _status.lieshen_map[target.playerid] = [target.hp, target.countCards("h")];
          }
        }
      }
    }
  },
  //申公豹
  zhuzhou: {
    usable: 1,
    trigger: {
      global: "damageSource"
    },
    filter(event, player) {
      if (!event.source || event.source == event.player) {
        return false;
      }
      if (!event.source.isIn() || !event.player.isIn()) {
        return false;
      }
      return event.source.isMaxHandcard() && event.player.countCards("h");
    },
    check(event, player) {
      return get.effect(event.player, { name: "shunshou_copy2" }, event.source, player) > 0;
    },
    logTarget: "source",
    prompt2: "令其获得受伤角色的一张手牌",
    async content(event, trigger, player) {
      await trigger.source.gainPlayerCard(trigger.player, "h", true);
    }
  },
  yaoxian: {
    enable: "phaseUse",
    usable: 1,
    selectTarget: 2,
    multitarget: true,
    targetprompt: ["摸牌", "出杀目标"],
    filterTarget(card, player, target) {
      if (ui.selected.targets.length == 0) {
        return true;
      } else {
        return target != player;
      }
    },
    delay: false,
    async content(event, trigger, player) {
      const drawer = event.targets[0], target = event.targets[1];
      await drawer.draw(2);
      const result = await drawer.chooseToUse(
        function(card, player2, event2) {
          if (get.name(card) != "sha") {
            return false;
          }
          return lib.filter.filterCard.apply(this, arguments);
        },
        "邀仙：对" + get.translation(target) + "使用一张杀，否则失去1点体力"
      ).set("targetRequired", true).set("complexTarget", true).set("complexSelect", true).set("filterTarget", function(card, player2, target2) {
        if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
          return false;
        }
        return lib.filter.targetEnabled.apply(this, arguments);
      }).set("sourcex", target).forResult();
      if (!result.bool) {
        await drawer.loseHp();
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
          if (target.hp <= 1) {
            return 0;
          }
          return 1;
        }
      },
      order: 8.5,
      expose: 0.2
    }
  },
  //寿星
  xwshoufa: {
    enable: "phaseUse",
    filter(event, player) {
      return player.countCards("h", (card) => lib.suit.includes(get.suit(card, player)));
    },
    chooseButton: {
      dialog(event, player) {
        const dialog = ui.create.dialog("###授法###请选择要给出的花色");
        return dialog;
      },
      chooseControl(event, player) {
        var list = player.getCards("h").reduce((arr, card) => arr.add(get.suit(card, player)), []);
        list.push("cancel2");
        return list;
      },
      check(event, player) {
        return 1 + Math.random();
      },
      backup(result, player) {
        return {
          audio: "xwshoufa",
          filterCard(card, player2) {
            return get.suit(card, player2) == result.control;
          },
          selectCard: -1,
          position: "h",
          suit: result.control,
          filterTarget: lib.filter.notMe,
          discard: false,
          lose: false,
          async content(event, trigger, player2) {
            const { cards: cards2, target } = event;
            await player2.give(cards2, target);
            let suit = get.info(event.name).suit;
            if (suit) {
              let skill = lib.skill.xwshoufa.derivation[["spade", "heart", "club", "diamond"].indexOf(suit)];
              player2.addSkill("xwshoufa_clear");
              target.addAdditionalSkills(`xwshoufa_${player2.playerid}`, skill, true);
            }
          },
          ai: {
            result: {
              target(player2, target) {
                if (target.hasSkillTag("nogain")) {
                  return 0;
                }
                if (!ui.selected.cards?.length) {
                  return 0;
                }
                return ui.selected.cards.reduce((sum, card) => sum += get.value(card, target), 0);
              }
            }
          }
        };
      },
      prompt(result, player) {
        let skill = lib.skill.xwshoufa.derivation[["spade", "heart", "club", "diamond"].indexOf(result.control)];
        return `将所有${get.translation(result.control)}牌交给一名其他角色并令其获得【${get.translation(skill)}】`;
      }
    },
    ai: {
      order: 2,
      result: { player: 1 }
    },
    derivation: ["tiandu", "retianxiang", "reqingguo", "new_rewusheng"],
    subSkill: {
      clear: {
        trigger: {
          player: "phaseBegin"
        },
        direct: true,
        firstDo: true,
        charlotte: true,
        async content(event, trigger, player) {
          const func = async (current) => {
            await current.removeAdditionalSkills(`xwshoufa_${player.playerid}`);
          };
          await game.doAsyncInOrder(game.players, func);
        }
      },
      backup: {}
    }
  },
  fuzhao: {
    trigger: {
      global: "dying"
    },
    logTarget: "player",
    filter(event, player) {
      return event.player.hp < 1;
    },
    check(event, player) {
      return get.attitude(player, event.player) > 0;
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const result = await target.judge(function(card) {
        if (get.suit(card) == "heart") {
          return 2;
        }
        return 0;
      }).forResult();
      if (result?.suit) {
        if (result.suit == "heart") {
          await target.recover();
        }
      }
    }
  },
  //汉曹操
  //江山如故二代目
  oldingxi: {
    audio: 2,
    trigger: { global: "cardsDiscardAfter" },
    filter(event, player) {
      if (!player.getPrevious() || !event.cards.filterInD("d").some((card) => {
        return get.is.damageCard(card) && player.canUse(card, player.getPrevious());
      })) {
        return false;
      }
      const evt = event.getParent();
      if (evt.name != "orderingDiscard") {
        return false;
      }
      const evtx = evt.relatedEvent || evt.getParent();
      return player.hasHistory("useCard", (evtxx) => {
        if (evtxx.getParent().name === "oldingxi") {
          return false;
        }
        return evtx.getParent() == (evtxx.relatedEvent || evtxx.getParent()) && get.is.damageCard(evtxx.card);
      });
    },
    async cost(event, trigger, player) {
      const target = player.getPrevious();
      const cards2 = trigger.cards.filterInD("d").filter((card) => get.is.damageCard(card));
      event.result = await player.chooseButton([get.prompt2(event.skill, target), cards2]).set("filterButton", (button) => {
        const player2 = get.player(), target2 = get.event().target;
        return player2.canUse(button.link, target2);
      }).set("target", target).set("ai", (button) => {
        const player2 = get.player(), target2 = get.event().target;
        return get.effect(target2, button.link, player2, player2);
      }).forResult();
      if (event.result.bool) {
        event.result.cards = event.result.links;
      }
    },
    logTarget(event, player) {
      return player.getPrevious();
    },
    async content(event, trigger, player) {
      player.$gain2(event.cards, false);
      await game.delayx();
      const useCardEvent = player.useCard(event.cards[0], event.targets[0], false);
      await useCardEvent;
      const cards2 = useCardEvent.cards.filterInD("d");
      if (cards2.length) {
        const next = player.addToExpansion(cards2, "gain2");
        next.gaintag.add("oldingxi");
        await next;
      }
    },
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    group: "oldingxi_biyue",
    subSkill: {
      biyue: {
        audio: "oldingxi",
        trigger: { player: "phaseJieshuBegin" },
        forced: true,
        locked: false,
        filter(event, player) {
          return player.countExpansions("oldingxi") > 0;
        },
        async content(event, trigger, player) {
          await player.draw(player.countExpansions("oldingxi"));
        }
      }
    }
  },
  olnengchen: {
    audio: 2,
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return event.card && player.getExpansions("oldingxi").some((card) => card.name === event.card.name);
    },
    forced: true,
    async content(event, trigger, player) {
      const cards2 = player.getExpansions("oldingxi").filter((card2) => card2.name === trigger.card.name);
      const card = cards2.randomGet();
      if (card) {
        await player.gain(card, player, "give");
      }
    },
    ai: { combo: "oldingxi" }
  },
  olhuojie: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return player.countExpansions("oldingxi") > game.players.length + game.dead.length;
    },
    forced: true,
    async content(event, trigger, player) {
      let num = player.getExpansions("oldingxi").length;
      while (num > 0) {
        num--;
        const next = player.executeDelayCardEffect("shandian");
        await next;
        if (player.hasHistory("damage", (evt) => evt.getParent(2) == next)) {
          const cards2 = player.getExpansions("oldingxi");
          if (cards2.length) {
            await player.gain(cards2, player, "give");
          }
          break;
        }
      }
    },
    ai: {
      combo: "oldingxi",
      neg: true
    }
  },
  //刘协曹节
  //我们意念合一×2
  dcjuanlv: {
    audio: false,
    equipSkill: false,
    inherit: "cixiong_skill",
    filter(event, player) {
      return player.differentSexFrom(event.target);
    }
  },
  dcqixin: {
    enable: "phaseUse",
    filter(event, player) {
      return !player.storage.dcqixin_die;
    },
    manualConfirm: true,
    prompt() {
      const player = get.player();
      return "将性别变更为" + (player.storage["dcqixin"] ? "刘协--男" : "曹节--女");
    },
    async content(event, trigger, player) {
      player.changeZhuanhuanji("dcqixin");
      player.storage.dcqixin_hp[1 - Boolean(player.storage["dcqixin"])] = player.hp;
      const hp = player.storage.dcqixin_hp[0 + Boolean(player.storage["dcqixin"])];
      if (player.hp != hp) {
        await player.changeHp(hp - player.hp);
      }
      player.tempBanSkill(
        "dcqixin",
        {
          player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
          global: ["phaseAfter", "phaseBeforeStart"]
        },
        false
      );
      const sex = player.storage["dcqixin"] ? "female" : "male";
      game.broadcastAll(
        (player2, sex2) => {
          player2.sex = sex2;
        },
        player,
        sex
      );
      game.log(player, "将性别变为了", "#y" + get.translation(sex) + "性");
    },
    mark: true,
    zhuanhuanji: true,
    markimage: "image/character/liuxie.jpg",
    init(player) {
      if (_status.gameStarted && !player.storage.dcqixin_hp) {
        player.storage.dcqixin_hp = [player.maxHp, player.maxHp];
      }
    },
    $zhuanhuanji(skill, player) {
      const image = player.storage[skill] ? "caojie" : "liuxie";
      const mark = player.marks[skill];
      if (mark) {
        mark.setBackground(image, "character");
      }
      player.changeSkin({ characterName: "liuxiecaojie" }, "liuxiecaojie" + (player.storage[skill] ? "_shadow" : ""));
    },
    intro: {
      content(storage, player) {
        const str = "当前性别：" + (!storage ? "刘协--男" : "曹节--女");
        const hp = player.storage.dcqixin_hp || [player.maxHp, player.maxHp];
        return player.storage.dcqixin_die ? str : "<li>" + str + "<br><li>" + (storage ? "刘协" : "曹节") + "体力值：" + hp[1 - Boolean(storage)];
      }
    },
    ai: {
      order: 10,
      result: {
        player(player) {
          const cards2 = player.getCards("hs");
          const target = game.filterPlayer((i) => i != player).sort((a, b) => {
            return cards2.filter((j) => player.canUse(j, b, true, true) && get.effect(b, j, player, player) > 0).reduce((sum, card) => {
              return sum + get.effect(b, card, player, player);
            }, 0) - cards2.filter((j) => player.canUse(j, a, true, true) && get.effect(a, j, player, player) > 0).reduce((sum, card) => {
              return sum + get.effect(a, card, player, player);
            }, 0);
          })[0];
          return player.differentSexFrom(target) ? 0 : 1;
        }
      }
    },
    derivation: "dcqixin_faq",
    group: ["dcqixin_die", "dcqixin_mark"],
    subSkill: {
      die: {
        audio: "dcqixin",
        trigger: { player: "dieBefore" },
        filter(event, player) {
          return !player.storage.dcqixin_die && player.maxHp > 0;
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          trigger.cancel();
          player.storage.dcqixin_die = true;
          player.changeZhuanhuanji("dcqixin");
          const sex = player.storage["dcqixin"] ? "female" : "male";
          game.broadcastAll(
            (player2, sex2) => {
              player2.sex = sex2;
            },
            player,
            sex
          );
          game.log(player, "将性别变为了", "#y" + get.translation(sex) + "性");
          player.storage.dcqixin_hp[1 - Boolean(player.storage["dcqixin"])] = player.hp;
          const hp = player.storage.dcqixin_hp[0 + Boolean(player.storage["dcqixin"])];
          if (player.hp != hp) {
            await player.changeHp(hp - player.hp);
          }
        }
      },
      //双武将牌--梦回橙续缘双面武将
      mark: {
        charlotte: true,
        trigger: { global: "gameStart" },
        filter(event, player) {
          return !player.storage.dcqixin_hp;
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          player.storage.dcqixin_hp = [player.maxHp, player.maxHp];
        }
      }
    }
  },
  //五虎将
  //是的孩子们，我们意念合一
  olhuyi: {
    audio: 5,
    getList() {
      let list, skills2 = [];
      if (get.mode() == "guozhan") {
        list = [];
        for (const i in lib.characterPack.mode_guozhan) {
          if (lib.character[i]) {
            list.push(i);
          }
        }
      } else if (_status.connectMode) {
        list = get.charactersOL();
      } else {
        list = [];
        for (const i in lib.character) {
          if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) {
            continue;
          }
          list.push(i);
        }
      }
      const wuhu = ["关羽", "张飞", "赵云", "马超", "黄忠"], wuhuList = list.filter((character) => {
        const names = get.characterSurname(character).map((name) => name.join(""));
        return names.containsSome(...wuhu);
      });
      for (const i of wuhuList) {
        skills2.addArray(
          (lib.character[i][3] || []).filter((skill) => {
            const info = get.info(skill);
            return info && !info.zhuSkill && !info.hiddenSkill && !info.charlotte && !info.groupSkill && !info.limited && !info.juexingji;
          })
        );
      }
      return skills2;
    },
    getBasic(event, player) {
      const name = event.card.name;
      return get.info("olhuyi").getList().filter((skill) => {
        const translation = get.skillInfoTranslation(skill, player);
        if (!translation) {
          return false;
        }
        const info = get.plainText(translation);
        const reg = `【${get.translation(name)}】`;
        if (name == "sha") {
          for (let nature of lib.inpile_nature) {
            const reg1 = `【${get.translation(nature) + get.translation(name)}】`, reg2 = `${get.translation(nature)}【${get.translation(name)}】`;
            if (info.includes(reg1) || info.includes(reg2)) {
              return true;
            }
          }
        }
        return info.includes(reg);
      });
    },
    prioritySkills: ["boss_juejing", "xinlonghun", "relonghun", "sbwusheng", "jsrgnianen", "jsrgguanjue", "shencai", "sbpaoxiao", "sbliegong", "pshengwu"],
    trigger: {
      global: "phaseBefore",
      player: ["enterGame", "useCardAfter", "respondAfter"]
    },
    keepSkill: true,
    filter(event, player) {
      if (["useCard", "respond"].includes(event.name)) {
        if (get.type(event.card) != "basic") {
          return false;
        }
        if (!get.info("olhuyi").getBasic(event, player).some((skill) => !player.hasSkill(skill, null, null, false))) {
          return false;
        }
        return !player.additionalSkills.olhuyi || player.additionalSkills.olhuyi && player.additionalSkills.olhuyi.length < 5;
      }
      const skills2 = get.info("olhuyi").getList();
      return (event.name != "phase" || game.phaseNumber == 0) && skills2.some((skill) => !player.hasSkill(skill, null, null, false));
    },
    locked: false,
    async cost(event, trigger, player) {
      if (["useCard", "respond"].includes(trigger.name)) {
        event.result = { bool: true };
      } else {
        const skills2 = get.info(event.skill).getList().filter((skill) => !player.hasSkill(skill, null, null, false)).randomGets(3);
        const list = [];
        for (const skill of skills2) {
          list.push([skill, '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + get.translation(skill) + "】</div><div>" + lib.translate[skill + "_info"] + "</div></div>"]);
        }
        const next = player.chooseButton(["虎翼：请选择获得其中一个技能", [list, "textbutton"]]);
        next.set("forced", true);
        next.set("ai", (button) => {
          const skill = button.link, choice = get.event().choice;
          if (get.info("olhuyi").prioritySkills.includes(skill)) {
            return 3;
          }
          if (skill == choice) {
            return 2;
          }
          return 1;
        });
        next.set(
          "choice",
          skills2.sort((a, b) => {
            return get.skillRank(b, "in") - get.skillRank(a, "in");
          })[0]
        );
        const { links } = await next.forResult();
        event.result = { bool: true, cost_data: links };
      }
    },
    async content(event, trigger, player) {
      const skill = ["useCard", "respond"].includes(trigger.name) ? get.info("olhuyi").getBasic(trigger, player).filter((skill2) => !player.hasSkill(skill2, null, null, false)).randomGets(1) : event.cost_data;
      player.addAdditionalSkills("olhuyi", skill, true);
    },
    group: "olhuyi_remove",
    subSkill: {
      remove: {
        audio: "olhuyi",
        trigger: { player: "phaseEnd" },
        filter(event, player) {
          return player.additionalSkills?.olhuyi?.length;
        },
        async cost(event, trigger, player) {
          const skills2 = player.additionalSkills.olhuyi;
          const list = [];
          for (const skill of skills2) {
            list.push([skill, '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + get.translation(skill) + "】</div><div>" + lib.translate[skill + "_info"] + "</div></div>"]);
          }
          const next = player.chooseButton(['###虎翼###<div class="text center">你可以失去其中一个技能，然后观看一名牌堆顶三张牌并获得其中一张</div>', [list, "textbutton"]]);
          next.set("ai", (button) => {
            get.player();
            const skill = button.link;
            let skills3 = get.event().skills.slice(0);
            skills3.removeArray(get.info("olhuyi").prioritySkills);
            if (skills3.length < 4) {
              return 0;
            }
            if (skills3.includes(skill)) {
              return 2;
            }
            return Math.random();
          });
          next.set("skills", skills2);
          const { bool, links } = await next.forResult();
          event.result = {
            bool,
            cost_data: links
          };
        },
        async content(event, trigger, player) {
          player.changeSkills([], event.cost_data).set("$handle", (player2, addSkills, removeSkills) => {
            game.log(
              player2,
              "失去了技能",
              ...removeSkills.map((i) => {
                return "#g【" + get.translation(i) + "】";
              })
            );
            player2.removeSkill(removeSkills);
            const additionalSkills = player2.additionalSkills.olhuyi;
            additionalSkills.removeArray(removeSkills);
            if (!additionalSkills.length) {
              delete player2.additionalSkills.olhuyi;
            }
          });
          const cards2 = get.cards(3, true);
          const { links: gains } = await player.chooseButton(["虎翼：选择获得其中一张牌", cards2], true).set("ai", (button) => get.value(button.link)).forResult();
          if (gains?.length) {
            await player.gain(gains, "draw");
          }
        }
      }
    }
  },
  //无名
  dcchushan: {
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    forced: true,
    async content(event, trigger, player) {
      if (!_status.characterlist) {
        game.initCharacterList();
      }
      _status.characterlist.randomSort();
      let characters2 = [];
      for (let i = 0; i < _status.characterlist.length; i++) {
        if (get.character(_status.characterlist[i], 3).some((skill) => {
          return lib.skill[skill] && !lib.skill[skill].charlotte;
        })) {
          characters2.push(_status.characterlist[i]);
          if (characters2.length >= 6) {
            break;
          }
        }
      }
      if (characters2.length < 2) {
        return;
      }
      const first = characters2.slice(0, characters2.length / 2), last = characters2.slice(characters2.length / 2, 6);
      const skills1 = [], skills2 = [];
      for (let i of first) {
        skills1.push(
          get.character(i, 3).filter((skill) => {
            return lib.skill[skill] && !lib.skill[skill].charlotte;
          }).randomGet()
        );
      }
      for (let i of last) {
        skills2.push(
          get.character(i, 3).filter((skill) => {
            return lib.skill[skill] && !lib.skill[skill].charlotte;
          }).randomGet()
        );
      }
      const result1 = await player.chooseControl(skills1).set("dialog", ["无名：请选择姓氏", [first, "character"]]).forResult();
      const gains = [];
      let surname = first[skills1.indexOf(result1.control)];
      gains.add(result1.control);
      const result2 = await player.chooseControl(skills2).set("dialog", ["无名：请选择名字", [last, "character"]]).forResult();
      let name = last[skills2.indexOf(result2.control)];
      gains.add(result2.control);
      let newname = get.characterSurname(surname).randomGet()[0] + get.characterSurname(name).randomGet()[1];
      if (newname === "某") {
        newname = "无名氏";
        player.chat("终究还是落得藉藉无名...");
      }
      game.broadcastAll(
        (player2, name2, list) => {
          if (player2.name == "dc_noname" || player2.name1 == "dc_noname") {
            player2.node.name.innerHTML = name2;
          }
          if (player2.name2 == "dc_noname") {
            player2.node.name2.innerHTML = name2;
          }
          player2.tempname.addArray(
            list.map((name3) => {
              while (get.character(name3).tempname.length > 0) {
                name3 = get.character(name3).tempname[0];
              }
              return name3;
            })
          );
        },
        player,
        newname,
        [surname, name]
      );
      await player.addSkills(gains);
    }
  },
  //会玩孙权
  dchuiwan: {
    audio: 2,
    trigger: { player: "drawBegin" },
    filter(event, player) {
      return lib.skill.dchuiwan.gainCards(player)?.length;
    },
    gainCards(player) {
      const cards2 = Array.from(ui.cardPile.childNodes).slice(0);
      const list = [];
      for (const card of cards2) {
        const name = get.name(card);
        const type = get.type(card);
        if (type != "basic" && type != "trick") {
          continue;
        }
        if (!player.getStorage("dchuiwan_used").includes(name)) {
          list.add(name);
        }
      }
      return list;
    },
    async cost(event, trigger, player) {
      let result = await player.chooseButton([get.prompt2(event.skill), [get.info(event.skill).gainCards(player), "vcard"]], [1, trigger.num]).set("ai", (button) => {
        if (!get.cardPile2(button.link[2])) {
          return 0;
        }
        return get.value({ name: button.link[2] }, get.event().player);
      }).forResult();
      if (result.bool) {
        result.cost_data = result.links;
      }
      event.result = result;
    },
    async content(event, trigger, player) {
      trigger.num -= event.cost_data.length;
      if (!player.storage.dchuiwan_used) {
        player.when({ global: "phaseAfter" }).step(async () => delete player.storage.dchuiwan_used);
      }
      player.markAuto(
        "dchuiwan_used",
        event.cost_data.map((name) => name[2])
      );
      let list = [];
      for (const name of event.cost_data) {
        const card = get.cardPile2(name[2]);
        if (card) {
          list.push(card);
        }
      }
      if (list.length) {
        await player.gain({ cards: list, animate: "draw" });
      } else {
        player.chat("无牌可得？！");
      }
    }
  },
  dchuanli: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return player.getHistory("useCard", (evt) => {
        return (evt.targets || []).includes(player);
      }).length >= 3 || game.hasPlayer((target) => {
        if (target == player) {
          return false;
        }
        return player.getHistory("useCard", (evt) => {
          return (evt.targets || []).includes(target);
        }).length >= 3;
      });
    },
    direct: true,
    async content(event, trigger, player) {
      let zhangzhang = false, zhouyu = false;
      if (player.getHistory("useCard", (evt) => {
        return (evt.targets || []).includes(player);
      }).length >= 3) {
        const result = await player.chooseTarget(get.prompt("dchuanli"), "令一名其他角色的所有技能失效，然后令其获得〖直谏〗和〖固政〗直到其回合结束", (card, player2, target) => {
          return target != player2 && !target.hasSkill("dchuanli_zhangzhang");
        }).set("ai", (target) => {
          get.event().player;
          return get.rank("zhangzhang", true) - ["name", "name1", "name2"].reduce((sum, name) => {
            if (!target[name] || !lib.character[target[name]] || name == "name1" && target.name1 == target.name) {
              return sum;
            }
            return sum + get.rank(target[name], true);
          }, 0);
        }).forResult();
        if (result.bool) {
          zhangzhang = true;
          const target = result.targets[0];
          await player.logSkill("dchuanli", target);
          target.addTempSkill("dchuanli_zhangzhang", { player: "phaseAfter" });
          target.markSkillCharacter("dchuanli_zhangzhang", "zhangzhang", "唤理-内事", "内事不决问张昭");
          await target.addAdditionalSkills("dchuanli_zhangzhang", ["zhijian", "guzheng"]);
        }
      }
      const targets = game.filterPlayer((target) => {
        if (target == player || target.hasSkill("dchuanli_zhouyu")) {
          return false;
        }
        return player.getHistory("useCard", (evt) => {
          return (evt.targets || []).includes(target);
        }).length >= 3;
      });
      if (targets.length) {
        const result = await player.chooseTarget(get.prompt("dchuanli"), "令一名其他角色的所有技能失效，然后令其获得〖英姿〗和〖反间〗直到其回合结束", (card, player2, target) => {
          return get.event().targets.includes(target);
        }).set("ai", (target) => {
          get.event().player;
          return get.rank("re_zhouyu", true) - ["name", "name1", "name2"].reduce((sum, name) => {
            if (!target[name] || !lib.character[target[name]] || name == "name1" && target.name1 == target.name) {
              return sum;
            }
            return sum + get.rank(target[name], true);
          }, 0);
        }).set("targets", targets).forResult();
        if (result.bool) {
          zhouyu = true;
          const target = result.targets[0];
          await player.logSkill("dchuanli", target);
          target.addTempSkill("dchuanli_zhouyu", { player: "phaseAfter" });
          target.markSkillCharacter("dchuanli_zhouyu", "re_zhouyu", "唤理-外事", "外事不决问周瑜");
          await target.addAdditionalSkills("dchuanli_zhouyu", ["reyingzi", "refanjian"]);
        }
      }
      if (zhangzhang && zhouyu) {
        await player.logSkill("dchuanli");
        if (player.storage.dchuanli_sunquan) {
          delete player.storage.dchuanli_sunquan;
        }
        await player.addAdditionalSkills("dchuanli_sunquan", "rezhiheng");
        player.addSkill("dchuanli_sunquan");
      }
    },
    subSkill: {
      zhangzhang: {
        init(player, skill) {
          player.addSkillBlocker(skill);
        },
        onremove(player, skill) {
          player.removeSkillBlocker(skill);
          player.removeAdditionalSkills(skill);
        },
        charlotte: true,
        skillBlocker(skill) {
          if (lib.skill[skill].persevereSkill) {
            return false;
          }
          return !["zhijian", "guzheng"].includes(skill) && skill != "dchuanli_zhangzhang" && !lib.skill[skill].charlotte;
        }
      },
      zhouyu: {
        init(player, skill) {
          player.addSkillBlocker(skill);
        },
        onremove(player, skill) {
          player.removeSkillBlocker(skill);
          player.removeAdditionalSkills(skill);
        },
        charlotte: true,
        skillBlocker(skill) {
          if (lib.skill[skill].persevereSkill) {
            return false;
          }
          return !["reyingzi", "refanjian"].includes(skill) && skill != "dchuanli_zhouyu" && !lib.skill[skill].charlotte;
        }
      },
      sunquan: {
        charlotte: true,
        onremove(player, skill) {
          delete player.storage[skill];
        },
        trigger: { player: "phaseAfter" },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          if (!player.storage.dchuanli_sunquan) {
            player.storage.dchuanli_sunquan = true;
          } else {
            await player.removeAdditionalSkills("dchuanli_sunquan");
            player.removeSkill("dchuanli_sunquan");
          }
        }
      }
    },
    derivation: ["zhijian", "guzheng", "reyingzi", "refanjian", "rezhiheng"]
  },
  //屈原
  dcqiusuo: {
    audio: 2,
    trigger: {
      source: "damageSource",
      player: "damageEnd"
    },
    frequent: true,
    async content(event, trigger, player) {
      const tiesuo = get.cardPile("tiesuo");
      if (tiesuo) {
        await player.gain(tiesuo, "gain2");
      }
    }
  },
  dclisao: {
    audio: 2,
    enable: "phaseUse",
    filterTarget: true,
    selectTarget: [1, 2],
    usable: 1,
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      let targets = event.targets.sortBySeat();
      let answer_ok = void 0, answered = targets.slice(), gaifa = targets.slice();
      let question = [];
      const sentences = _status.lisao_text.randomGets(2).randomSort();
      const goon = Math.round(Math.random());
      question.addArray(["请回答《离骚》中“" + sentences[0].split("，")[goon] + "”的" + (goon ? "上" : "下") + "句", [sentences[0].split("，")[1 - goon], sentences[1].split("，")[1 - goon]].randomSort()]);
      let humans = targets.filter((current) => current === game.me || current.isOnline());
      let locals = targets.slice(0).randomSort();
      locals.removeArray(humans);
      const eventId = get.id();
      const send = (question2, current, eventId2) => {
        lib.skill.dclisao.chooseControl(question2, current, eventId2);
        game.resume();
      };
      event._global_waiting = true;
      let time = 1e4;
      if (lib.configOL && lib.configOL.choose_timeout) {
        time = parseInt(lib.configOL.choose_timeout) * 1e3;
      }
      targets.forEach((current) => current.showTimer(time));
      if (humans.length > 0) {
        const solve = function(resolve, reject) {
          return function(result, player2) {
            if (result && result.control && !answer_ok) {
              answered.remove(player2);
              if (result.control == sentences[0].split("，")[1 - goon]) {
                resolve();
                player2.popup("回答正确", "wood");
                game.log(player2, "回答正确");
                answer_ok = player2;
                gaifa.remove(player2);
              } else {
                reject();
                player2.popup("回答错误", "fire");
                game.log(player2, "回答错误");
              }
            } else {
              reject();
            }
          };
        };
        await Promise.any(
          humans.map((current) => {
            return new Promise((resolve, reject) => {
              if (current.isOnline()) {
                current.send(send, question, current, eventId);
                current.wait(solve(resolve, reject));
              } else {
                const next = lib.skill.dclisao.chooseControl(question, current, eventId);
                const solver = solve(resolve, reject);
                if (_status.connectMode) {
                  game.me.wait(solver);
                }
                return next.forResult().then((result) => {
                  if (_status.connectMode && !answer_ok) {
                    game.me.unwait(result, current);
                  } else {
                    solver(result, current);
                  }
                });
              }
            });
          })
        ).catch(() => {
        });
        game.broadcastAll("cancel", eventId);
      }
      if (!answer_ok && locals.length > 0) {
        for (const current of locals) {
          const result = await lib.skill.dclisao.chooseControl(question, current).forResult();
          if (result && result.control) {
            answered.remove(current);
            if (result.control == sentences[0].split("，")[1 - goon]) {
              current.popup("回答正确", "wood");
              game.log(current, "回答正确");
              answer_ok = current;
              gaifa.remove(current);
              break;
            } else {
              current.popup("回答错误", "fire");
              game.log(current, "回答错误");
            }
          }
        }
      }
      delete event._global_waiting;
      for (const i of targets) {
        i.hideTimer();
        if (answered.includes(i)) {
          i.popup("未回答");
          game.log(i, "未进行回答");
        }
      }
      await game.delay();
      if (answer_ok && answer_ok.countCards("h")) {
        await answer_ok.showHandcards();
      }
      if (gaifa.length) {
        for (const i of gaifa) {
          i.addTempSkill("dclisao_gaifa");
          i.markAuto("dclisao_gaifa", [player]);
        }
        await game.delay();
      }
    },
    chooseControl(question, current, eventId) {
      const next = current.chooseControl(question[1]);
      next.set("prompt", question[0]);
      next.set("id", eventId);
      next.set("_global_waiting", true);
      next.set("ai", () => Math.round(Math.random()));
      return next;
    },
    init() {
      if (!_status.lisao_text) {
        let text = "长太息以掩涕兮，哀民生之多艰。余虽好修姱以鞿羁兮，謇朝谇而夕替。既替余以蕙纕兮，又申之以揽茝。亦余心之所善兮，虽九死其犹未悔。怨灵修之浩荡兮，终不察夫民心。众女嫉余之蛾眉兮，谣诼谓余以善淫。固时俗之工巧兮，偭规矩而改错。背绳墨以追曲兮，竞周容以为度。忳郁邑余侘傺兮，吾独穷困乎此时也。宁溘死以流亡兮，余不忍为此态也。鸷鸟之不群兮，自前世而固然。何方圜之能周兮，夫孰异道而相安。屈心而抑志兮，忍尤而攘诟。伏清白以死直兮，固前圣之所厚。悔相道之不察兮，延伫乎吾将反。回朕车以复路兮，及行迷之未远。步余马于兰皋兮，驰椒丘且焉止息。进不入以离尤兮，退将复修吾初服。制芰荷以为衣兮，集芙蓉以为裳。不吾知其亦已兮，苟余情其信芳。高余冠之岌岌兮，长余佩之陆离。芳与泽其杂糅兮，唯昭质其犹未亏。忽反顾以游目兮，将往观乎四荒。佩缤纷其繁饰兮，芳菲菲其弥章。民生各有所乐兮，余独好修以为常。虽体解吾犹未变兮，岂余心之可惩。";
        _status.lisao_text = text.slice(0, -1).split("。");
      }
    },
    ai: {
      order: 10,
      result: {
        target(player, target) {
          if (player === target) {
            if (ui.selected.targets.length) {
              return 8;
            }
            return 0;
          }
          if (target.getStorage("dclisao_gaifa").includes(player)) {
            return 0;
          }
          if (get.damageEffect(target, player, player) < 0 && get.attitude(player, target) > 0) {
            return 0;
          }
          let cards2 = player.getCards("hs", (card) => get.tag(card, "damage") && get.effect(target, card, player, player) > 0);
          if (!cards2.length) {
            return 0;
          }
          let cardx = cards2.filter((card) => get.name(card) == "sha");
          cardx.sort((a, b) => get.effect(target, b, player, player) - get.effect(target, a, player, player));
          cardx = cardx.slice(Math.min(cardx.length, player.getCardUsable("sha")), cardx.length);
          cards2.removeArray(cardx);
          return cards2.reduce((sum, card) => {
            if (player.canUse(card, target)) {
              return sum + get.effect(target, card, player, target);
            }
            if (player.canUse(card, target, false)) {
              return sum + get.effect(target, card, player, target) / 10;
            }
            return 0;
          }, 0) - 10;
        }
      }
    },
    subSkill: {
      gaifa: {
        charlotte: true,
        onremove: true,
        trigger: {
          global: "useCard",
          player: "damageBegin3"
        },
        filter(event, player) {
          const targets = player.getStorage("dclisao_gaifa");
          return event.name != "useCard" || targets.includes(event.player);
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const targets = player.getStorage("dclisao_gaifa");
          if (trigger.name == "useCard") {
            trigger.directHit.add(player);
          } else {
            trigger.num = trigger.num * (targets.length + 1);
          }
        },
        mark: true,
        marktext: "江",
        intro: {
          markcount: () => 0,
          content(storage) {
            return "<li>无法响应" + get.translation(storage) + "使用的牌<br><li>受到的伤害翻" + storage.length + "倍";
          }
        }
      }
    }
  },
  //名将吴懿
  dcbenxi: {
    trigger: {
      player: ["loseAfter"],
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    forced: true,
    zhuanhuanji: true,
    filter(event, player) {
      const evt = event.getl(player);
      return evt && evt.hs && evt.hs.length > 0;
    },
    async content(event, trigger, player) {
      player.changeZhuanhuanji("dcbenxi");
      if (player.storage.dcbenxi) {
        const map = lib.skill.dcbenxi.getMap(), list = Object.keys(map);
        if (list.length > 0) {
          const skill = list.randomGet(), voiceMap = get.Audio.skill({ skill, player: map[skill] }).audioList;
          player.storage.dcbenxi_pending = skill;
          findaudio: for (let data of voiceMap) {
            if (!data.text) {
              continue;
            }
            const pinyins2 = get.pinyin(data.text, false);
            for (let i = 0; i < pinyins2.length - 1; i++) {
              if (pinyins2[i] === "wu" && pinyins2[i + 1] === "yi") {
                player.chat(data.text);
                game.broadcastAll((file) => game.playAudio(file), data.file);
                break findaudio;
              }
            }
          }
        }
      } else {
        const skill = player.storage.dcbenxi_pending;
        if (skill) {
          if (player.hasSkill(skill, null, false)) {
            const targets = game.filterPlayer((current) => current != player).sortBySeat();
            player.line(targets, "fire");
            for (let target of targets) {
              if (target.isIn()) {
                await target.damage();
              }
            }
          } else {
            await player.addTempSkills([skill], { player: "phaseBegin" });
          }
          delete player.storage.dcbenxi_pending;
        }
      }
      player.markSkill(event.name);
    },
    onremove(player) {
      delete player.storage.dcbenxi;
      delete player.storage.dcbenxi_pending;
    },
    mark: true,
    marktext: "☯",
    intro: {
      mark(dialog, storage, player) {
        if (storage) {
          const skill = player.storage.dcbenxi_pending;
          if (skill) {
            dialog.addText(`锁定技，当你下次失去手牌后，你获得技能〖${get.translation(skill)}〗直到你的下回合开始。若已获得该技能，则改为对所有其他角色各造成1点伤害。`, false);
            dialog.add('<div><div class="skill">【' + get.translation(lib.translate[skill + "_ab"] || get.translation(skill).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(skill, player, false) + "</div></div>");
          }
        } else {
          return "锁定技。当你下次失去手牌后，你随机念出一句拼音中含有“wu,yi”的台词。";
        }
      }
    },
    getMap() {
      if (!_status.dcbenxi_map) {
        _status.dcbenxi_map = {};
        let list;
        if (_status.connectMode) {
          list = get.charactersOL();
        } else {
          list = get.gainableCharacters();
        }
        list.forEach((name) => {
          if (name !== "dc_wuyi") {
            const skills2 = get.character(name, 3);
            skills2.forEach((skill) => {
              const info = get.info(skill);
              if (!info || info.ai && info.ai.combo) {
                return;
              }
              if (skill in _status.dcbenxi_map) {
                return;
              }
              const voices2 = get.Audio.skill({ skill, name }).textList;
              if (voices2.some((text) => {
                const pinyins2 = get.pinyin(text, false);
                for (let i = 0; i < pinyins2.length - 1; i++) {
                  if (pinyins2[i] === "wu" && pinyins2[i + 1] === "yi") {
                    return true;
                  }
                }
                return false;
              })) {
                _status.dcbenxi_map[skill] = name;
              }
            });
          }
        });
      }
      return _status.dcbenxi_map;
    }
  },
  //新InitFilter测试高达一号
  //打赢复活赛的牢达[哭]
  dclonghun: {
    audio: 2,
    mod: {
      aiOrder(player, card, num) {
        if (num <= 0 || !player.isPhaseUsing() || player.needsToDiscard() < 2) {
          return num;
        }
        let suit = get.suit(card, player);
        if (suit === "heart") {
          return num - 3.6;
        }
      },
      aiValue(player, card, num) {
        if (num <= 0) {
          return num;
        }
        let suit = get.suit(card, player);
        if (suit === "heart") {
          return num + 3.6;
        }
        if (suit === "club") {
          return num + 1;
        }
        if (suit === "spade") {
          return num + 1.8;
        }
      },
      aiUseful(player, card, num) {
        if (num <= 0) {
          return num;
        }
        let suit = get.suit(card, player);
        if (suit === "heart") {
          return num + 3;
        }
        if (suit === "club") {
          return num + 1;
        }
        if (suit === "spade") {
          return num + 1;
        }
      }
    },
    locked: false,
    enable: ["chooseToUse", "chooseToRespond"],
    prompt: "将♦牌当做火【杀】，♥牌当做【桃】，♣牌当做【闪】，♠牌当做【无懈可击】使用或打出",
    viewAs(cards2, player) {
      var name;
      var nature = null;
      switch (get.suit(cards2[0], player)) {
        case "club":
          name = "shan";
          break;
        case "diamond":
          name = "sha";
          nature = "fire";
          break;
        case "spade":
          name = "wuxie";
          break;
        case "heart":
          name = "tao";
          break;
      }
      if (name) {
        return { name, nature };
      }
      return null;
    },
    check(card) {
      var player = _status.event.player;
      if (_status.event.type == "phase") {
        var max = 0;
        var name2;
        var list = ["sha", "tao"];
        var map = { sha: "diamond", tao: "heart" };
        for (var i = 0; i < list.length; i++) {
          var name = list[i];
          if (player.countCards("hes", function(card2) {
            return (name != "sha" || get.value(card2) < 5) && get.suit(card2, player) == map[name];
          }) > 0 && player.getUseValue({
            name,
            nature: name == "sha" ? "fire" : null
          }) > 0) {
            var temp = get.order({
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
          return name2 == "diamond" ? 5 - get.value(card) : 20 - get.value(card);
        }
        return 0;
      }
      return 1;
    },
    position: "hes",
    filterCard(card, player, event) {
      event = event || _status.event;
      var filter = event._backup.filterCard;
      var name = get.suit(card, player);
      if (name == "club" && filter({ name: "shan", cards: [card] }, player, event)) {
        return true;
      }
      if (name == "diamond" && filter({ name: "sha", cards: [card], nature: "fire" }, player, event)) {
        return true;
      }
      if (name == "spade" && filter({ name: "wuxie", cards: [card] }, player, event)) {
        return true;
      }
      if (name == "heart" && filter({ name: "tao", cards: [card] }, player, event)) {
        return true;
      }
      return false;
    },
    filter(event, player) {
      var filter = event.filterCard;
      if (filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event) && player.countCards("hes", { suit: "diamond" })) {
        return true;
      }
      if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hes", { suit: "club" })) {
        return true;
      }
      if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hes", { suit: "heart" })) {
        return true;
      }
      if (filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && player.countCards("hes", { suit: "spade" })) {
        return true;
      }
      return false;
    },
    usable: 20,
    ai: {
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag) {
        if ((player.getStat("skill").dclonghun || 0) >= 20) {
          return false;
        }
        var name;
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
        if (!player.countCards("hes", { suit: name })) {
          return false;
        }
      },
      order(item, player) {
        if (player && _status.event.type == "phase") {
          var max = 0;
          var list = ["sha", "tao"];
          var map = { sha: "diamond", tao: "heart" };
          for (var i = 0; i < list.length; i++) {
            var name = list[i];
            if (player.countCards("hes", function(card) {
              return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
            }) > 0 && player.getUseValue({
              name,
              nature: name == "sha" ? "fire" : null
            }) > 0) {
              var temp = get.order({
                name,
                nature: name == "sha" ? "fire" : null
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
      if ((player.getStat("skill").dclonghun || 0) >= 20) {
        return false;
      }
      if (name == "wuxie" && _status.connectMode && player.countCards("hes") > 0) {
        return true;
      }
      if (name == "wuxie") {
        return player.countCards("hes", { suit: "spade" }) > 0;
      }
      if (name == "tao") {
        return player.countCards("hes", { suit: "heart" }) > 0;
      }
    }
  },
  dczhanjiang: {
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.hasPlayer((target) => {
        return target.countCards("ej", (card) => get.name(card, false) == "qinggang" || get.name(card, get.owner(card)) == "qinggang");
      });
    },
    async content(event, trigger, player) {
      const cards2 = [];
      const targets = game.filterPlayer((target) => {
        return target.countCards("ej", (card) => get.name(card, false) == "qinggang" || get.name(card, get.owner(card)) == "qinggang");
      });
      for (const target of targets) {
        cards2.addArray(target.getCards("ej", (card) => get.name(card, false) == "qinggang" || get.name(card, get.owner(card)) == "qinggang"));
      }
      await player.gain(cards2, "give");
    }
  },
  //孙策
  //双壁=100%技能周瑜+100%原画孙策
  dcshuangbi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    async content(event, trigger, player) {
      var num = game.countPlayer();
      var result = await player.chooseControl().set("choiceList", ["摸" + get.cnNumber(num) + "张牌，本回合手牌上限+" + parseFloat(num), "弃置至多" + get.cnNumber(num) + "张牌，随机对其他角色造成等量火焰伤害", "视为使用至多" + get.cnNumber(num) + "张火【杀】或【火攻】"]).set("ai", () => {
        var player2 = _status.event.player, card2 = { name: "sha", nature: "fire" };
        if (!game.hasPlayer((target2) => player2.canUse(card2, target2) && get.effect(target2, card2, player2, player2) > 0)) {
          return 0;
        }
        return 2;
      }).forResult();
      player.flashAvatar("dcshuangbi", ["re_zhouyu", "shen_zhouyu", "dc_sb_zhouyu"][result.index]);
      switch (result.index) {
        case 0:
          player.draw(num);
          player.addTempSkill("dcshuangbi_effect");
          player.addMark("dcshuangbi_effect", num, false);
          break;
        case 1:
          var result2 = await player.chooseToDiscard("双壁：弃置至多" + get.cnNumber(num) + "张牌，随机对其他角色造成等量火焰伤害", [1, num], "he").set("ai", (card2) => 1 / (get.value(card2) || 0.5)).forResult();
          if (result2.bool) {
            var sum = result2.cards.length;
            var targets = game.filterPlayer((target2) => target2 != player);
            if (targets.length) {
              while (sum) {
                sum--;
                var target = targets.randomGet();
                player.line(target);
                target.damage(1, "fire");
                game.delayx();
              }
            }
          }
          break;
        case 2:
          while (num && game.hasPlayer((target2) => player.canUse({ name: "sha", nature: "fire" }, target2) || player.canUse({ name: "huogong" }, target2))) {
            num--;
            var list = [];
            if (game.hasPlayer((target2) => player.canUse({ name: "sha", nature: "fire" }, target2))) {
              list.push(["基本", "", "sha", "fire"]);
            }
            if (game.hasPlayer((target2) => player.canUse({ name: "huogong" }, target2))) {
              list.push(["锦囊", "", "huogong"]);
            }
            var result2 = await player.chooseButton(["双壁：请选择你要使用的牌", [list, "vcard"]]).set("ai", (button) => button.link[2] == "sha" ? 1 : 0).forResult();
            if (result2?.bool && result2.links?.length) {
              var card = {
                name: result2.links[0][2],
                nature: result2.links[0][3]
              };
              await player.chooseUseTarget(true, card, false);
            } else {
              break;
            }
          }
          break;
      }
    },
    ai: {
      order: 9,
      result: { player: 1 }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        intro: { content: "手牌上限+#" },
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("dcshuangbi_effect");
          }
        }
      }
    }
  },
  //哪吒
  dcsantou: {
    audio: 2,
    trigger: { player: "damageBegin4" },
    forced: true,
    async content(event, trigger, player) {
      var source = trigger.source;
      trigger.cancel();
      var hp = player.getHp();
      var lose = false;
      if (hp >= 3) {
        if (player.hasHistory("useSkill", (evt) => {
          var evtx = evt.event;
          return evt.skill == "dcsantou" && evtx.getTrigger().source == source && evtx.getParent(2) != trigger;
        })) {
          lose = true;
        }
      } else if (hp == 2) {
        if (trigger.hasNature()) {
          lose = true;
        }
      } else if (hp == 1) {
        if (trigger.card && get.color(trigger.card) == "red") {
          lose = true;
        }
      }
      if (lose) {
        player.loseHp();
      }
    },
    ai: {
      filterDamage: true,
      skillTagFilter(player, tag, arg) {
        if (arg && arg.player && arg.player.hasSkillTag("jueqing", false, player)) {
          return false;
        }
      },
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return;
          }
          if (player._dcsantou_temp) {
            return;
          }
          if (get.tag(card, "damage")) {
            const hp = target.getHp();
            player._dcsantou_temp = true;
            const losehp = get.effect(target, { name: "losehp" }, target, target) / get.attitude(target, target);
            delete player._dcsantou_temp;
            if (hp >= 3) {
              if (target.hasHistory("useSkill", (evt) => evt.skill == "dcsantou" && evt.event.getTrigger().source == player)) {
                return [0, losehp, 0, 0];
              } else if (get.attitude(player, target) < 0) {
                let hs = player.getCards("hs", (i) => {
                  return i !== card && (!card.cards || !card.cards.includes(i));
                }), num = player.getCardUsable("sha");
                if (card.name === "sha") {
                  num--;
                }
                hs = hs.filter((i) => {
                  if (!player.canUse(i, target)) {
                    return false;
                  }
                  if (get.tag(card, "damage") && get.name(i, player) !== "sha") {
                    return true;
                  }
                  if (num) {
                    num--;
                    return true;
                  }
                  return false;
                }).length;
                if (player.hasSkillTag("damage", null, {
                  target
                })) {
                  hs++;
                }
                if (!hs) {
                  return "zeroplayertarget";
                }
                num = 1 - 2 / 3 / hs;
                return [num, 0, num, 0];
              }
            }
            if (hp == 2 && get.tag(card, "natureDamage") || hp == 1 && typeof card == "object" && get.color(card) == "red") {
              return [0, losehp, 0, 0];
            }
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  dcfaqi: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter(event, player) {
      if (get.type(event.card) != "equip") {
        return false;
      }
      if (!player.isPhaseUsing()) {
        return false;
      }
      for (const name of lib.inpile) {
        if (get.type(name) != "trick") {
          continue;
        }
        if (!player.hasStorage("dcfaqi", name) && player.hasUseTarget({ name, isCard: true })) {
          return true;
        }
      }
      return false;
    },
    direct: true,
    async content(event, trigger, player) {
      var list = get.inpileVCardList((info) => {
        if (info[0] != "trick") {
          return false;
        }
        var name2 = info[2];
        return !player.hasStorage("dcfaqi", name2) && player.hasUseTarget({ name: name2, isCard: true });
      });
      if (list.length) {
        var result = await player.chooseButton(["法器：视为使用一张普通锦囊牌", [list, "vcard"]]).set("ai", (button) => {
          return get.player().getUseValue({ name: button.link[2] });
        }).forResult();
        if (result.bool) {
          var name = result.links[0][2];
          if (!player.storage.dcfaqi) {
            player.when({ global: "phaseAfter" }).step(async () => delete player.storage.dcfaqi);
          }
          player.markAuto("dcfaqi", name);
          player.chooseUseTarget({ name, isCard: true }, true, false).logSkill = "dcfaqi";
        }
      } else {
        event.finish();
      }
    },
    ai: {
      reverseEquip: true
    }
  },
  //隅泣曹操
  dcjianxiong: {
    audio: "rejianxiong",
    trigger: {
      player: "damageEnd"
    },
    async content(event, trigger, player) {
      if (get.itemtype(trigger.cards) == "cards" && get.position(trigger.cards[0], true) == "o") {
        await player.gain(trigger.cards, "gain2");
      }
      await player.draw(player.countMark("dcjianxiong") + 1, "nodelay");
      if (player.countMark("dcjianxiong") < 4) {
        player.addMark("dcjianxiong", 1, false);
      }
    },
    mark: true,
    marktext: "雄",
    intro: {
      markcount(storage, player) {
        return player.countMark("dcjianxiong") + 1;
      },
      content(storage, player) {
        return "摸牌数为" + (player.countMark("dcjianxiong") + 1);
      }
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage") && player != target) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return [1, -1];
            }
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
                return [1, 2.5 + player.countMark("dcjianxiong") / 2];
              }
            }
            if (get.value(cards2, target) >= 7 - player.countMark("dcjianxiong") / 2 + target.getDamagedHp()) {
              return [1, 1.5 + player.countMark("dcjianxiong") / 2];
            }
            return [1, 0.6 + player.countMark("dcjianxiong") / 2];
          }
        }
      }
    }
  },
  //缺德刘备
  dcrende: {
    audio: "rerende",
    enable: "phaseUse",
    filter(event, player) {
      return game.hasPlayer((current) => {
        return lib.skill.dcrende.filterTarget(null, player, current);
      });
    },
    discard: false,
    lose: false,
    delay: false,
    filterTarget(card, player, target) {
      if (player.getStorage("dcrende_targeted").includes(target)) {
        return false;
      }
      return player != target && target.countGainableCards(player, "h") > 1;
    },
    async content(event, trigger, player) {
      player.addTempSkill("dcrende_targeted", "phaseUseAfter");
      player.markAuto("dcrende_targeted", [event.target]);
      await player.gainPlayerCard(event.target, "h", true, 2);
      const list = get.inpileVCardList((info) => {
        return info[0] == "basic" && player.hasUseTarget(new lib.element.VCard({ name: info[2], nature: info[3], isCard: true }), null, true);
      });
      if (list.length) {
        const result = await player.chooseButton(["仁德：你可以视为使用一张基本牌", [list, "vcard"]]).set("ai", (button) => {
          return get.player().getUseValue({ name: button.link[2], nature: button.link[3], isCard: true });
        }).forResult();
        if (!result?.links?.length) {
          return;
        }
        await player.chooseUseTarget(get.autoViewAs({ name: result.links[0][2], nature: result.links[0][3], isCard: true }), true);
      }
    },
    subSkill: {
      targeted: {
        onremove: true,
        charlotte: true
      }
    },
    ai: {
      fireAttack: true,
      order(skill, player) {
        return 10;
      },
      result: {
        player: 1,
        target(player, target) {
          if (target.hasSkillTag("noh")) {
            return -0.1;
          }
          return -2;
        }
      },
      threaten: 3
    }
  },
  //会玩孙权
  dczhiheng: {
    audio: "rezhiheng",
    init: (player) => {
      player.storage.dczhiheng_hit = [];
    },
    enable: "phaseUse",
    usable(skill, player) {
      return 1 + player.getStorage("dczhiheng_hit").length;
    },
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
    group: "dczhiheng_add",
    async content(event, trigger, player) {
      let num = 1;
      var hs = player.getCards("h");
      if (!hs.length) {
        num = 0;
      } else {
        for (var i = 0; i < hs.length; i++) {
          if (!event.cards.includes(hs[i])) {
            num = 0;
            break;
          }
        }
      }
      await player.discard(event.cards);
      await player.draw(num + event.cards.length);
    },
    subSkill: {
      add: {
        audio: "dczhiheng",
        trigger: {
          source: "damageSource"
        },
        forced: true,
        locked: false,
        filter(event, player) {
          if (event.player == player) {
            return false;
          }
          return !player.getStorage("dczhiheng_hit").includes(event.player);
        },
        logTarget: "player",
        async content(event, trigger, player) {
          player.addTempSkill("dczhiheng_hit");
          player.markAuto("dczhiheng_hit", [trigger.player]);
          game.log(player, "#g【制衡】", "可发动次数", "#y+1");
        }
      },
      hit: {
        charlotte: true,
        onremove: (player) => {
          player.storage.dczhiheng_hit = [];
        },
        mark: true,
        marktext: "衡",
        intro: {
          markcount(storage) {
            if (storage) {
              return storage.length;
            }
            return 0;
          },
          content: "本回合已对$造成过伤害"
        }
      }
    },
    ai: {
      order(item, player) {
        if (player.hasCard((i) => {
          return get.value(i) > Math.max(6, 9 - player.hp);
        }, "he")) {
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
          return (!arg || arg && arg.card && get.name(arg.card) === "tao") && player.isPhaseUsing() && player.countSkill("dczhiheng") < 1 + player.getStorage("dczhiheng_hit").length && player.hasCard((card) => {
            return get.name(card) !== "tao";
          }, "h");
        }
      },
      threaten: 1.55
    }
  },
  //朱铁雄
  dcbianzhuang: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    async content(event, trigger, player) {
      var list = [];
      for (var i in lib.skill.dcbianzhuang.characterMap) {
        if (lib.character[i] && get.is.object(lib.skill[lib.skill.dcbianzhuang.characterMap[i]])) {
          list.push(i);
        }
      }
      var characters2 = list.randomGets(player.storage.dcbianzhuang_inited ? 3 : 2);
      if (!characters2.length) {
        event.finish();
        return;
      }
      var skills2 = characters2.map((i2) => lib.skill.dcbianzhuang.characterMap[i2]);
      const result = await player.chooseControl(skills2).set("dialog", ["选择获得一个技能并“变装”", [characters2, "character"]]).forResult();
      var skill = result.control;
      await player.addTempSkills(skill, "dcbianzhuangAfter");
      for (var i in lib.skill.dcbianzhuang.characterMap) {
        if (lib.skill.dcbianzhuang.characterMap[i] == skill) {
          player.flashAvatar("dcbianzhuang", i);
          game.log(player, "“变装”为了", "#b" + get.translation(i));
          break;
        }
      }
      const card = new lib.element.VCard({ name: "sha", isCard: true });
      if (!player.hasUseTarget(card, false)) {
        return;
      }
      const result2 = await player.chooseUseTarget(card, true, false, "nodistance").forResult();
      if (result2.bool && !player.storage.dcbianzhuang_inited) {
        player.addMark("dcbianzhuang", 1, false);
        if (player.countMark("dcbianzhuang") > 2) {
          player.storage.dcbianzhuang_inited = true;
          player.changeSkin({ characterName: "zhutiexiong" }, "wu_zhutiexiong");
        }
      }
    },
    group: "dcbianzhuang_refresh",
    ai: {
      order: 16,
      result: {
        player(player) {
          if (player.hasValueTarget("sha", false)) {
            return 1;
          }
          return 0;
        }
      },
      effect: {
        target_use(card, player, target, current) {
          if (player == target && player.isPhaseUsing() && get.type(card) == "equip") {
            if (player.hasValueTarget("sha", false) && typeof player.getStat("skill").dcbianzhuang == "number") {
              return [1, 3];
            }
          }
        }
      }
    },
    subSkill: {
      refresh: {
        audio: "dcbianzhuang",
        trigger: { player: "useCardAfter" },
        forced: true,
        filter(event, player) {
          return get.type2(event.card, false) == "equip" && typeof player.getStat("skill").dcbianzhuang == "number";
        },
        async content(event, trigger, player) {
          const stat = player.getStat("skill");
          delete stat.dcbianzhuang;
          game.log(player, "重置了技能", "#g【变装】");
        }
      }
    },
    characterMap: {
      re_zhangchunhua: "rejueqing",
      wangshuang: "spzhuilie",
      re_machao: "retieji",
      ol_weiyan: "xinkuanggu",
      re_lvbu: "wushuang",
      re_huangzhong: "xinliegong",
      ol_pangde: "rejianchu",
      ol_zhurong: "lieren",
      re_masu: "rezhiman",
      re_panzhangmazhong: "reanjian",
      mayunlu: "fengpo",
      re_quyi: "refuqi"
    }
  },
  //小约翰可汗
  dctongliao: {
    audio: 3,
    trigger: { player: "phaseDrawAfter" },
    direct: true,
    locked: false,
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      const result = await player.chooseCard("h", get.prompt("dctongliao"), "选择一张牌标记为“通辽”", function(card, player2) {
        if (card.hasGaintag("dctongliao")) {
          return false;
        }
        var num = get.number(card, player2);
        return !player2.hasCard((card2) => {
          return card != card2 && get.number(card2, player2) < num;
        });
      }).set("ai", function(card) {
        var player2 = _status.event.player;
        return 1 + Math.max(0, player2.getUseValue(card, null, true));
      }).forResult();
      if (result.bool) {
        await player.logSkill("dctongliao");
        player.addGaintag(result.cards, "dctongliao");
        await game.delayx();
      }
    },
    mod: {
      aiOrder(player, card, num) {
        if (get.itemtype(card) == "card" && card.hasGaintag("dctongliao")) {
          return num + 0.6;
        }
      }
    },
    group: "dctongliao_draw",
    subSkill: {
      draw: {
        audio: "dctongliao",
        trigger: {
          player: ["loseAfter"],
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          var evt = event.getl(player);
          if (!evt || !evt.hs || !evt.hs.length) {
            return false;
          }
          if (event.name == "lose") {
            for (var i in event.gaintag_map) {
              if (event.gaintag_map[i].includes("dctongliao")) {
                return true;
              }
            }
            return false;
          }
          return player.hasHistory("lose", function(evt2) {
            if (event != evt2.getParent()) {
              return false;
            }
            for (var i2 in evt2.gaintag_map) {
              if (evt2.gaintag_map[i2].includes("dctongliao")) {
                return true;
              }
            }
            return false;
          });
        },
        forced: true,
        async content(event, trigger, player) {
          let num = 0;
          const cards2 = trigger.getl(player).hs;
          const ids = [];
          if (trigger.name === "lose") {
            for (const key of Object.keys(trigger.gaintag_map)) {
              if (trigger.gaintag_map[key].includes("dctongliao")) {
                ids.push(key);
              }
            }
          } else {
            player.getHistory("lose", (evt) => {
              if (trigger != evt.getParent()) {
                return false;
              }
              for (const key of Object.keys(evt.gaintag_map)) {
                if (evt.gaintag_map[key].includes("dctongliao")) {
                  ids.push(key);
                }
              }
            });
          }
          for (const card of cards2) {
            if (ids.includes(card.cardid)) {
              num += get.number(card, player);
            }
          }
          if (num > 0) {
            await player.draw(num);
          }
        }
      }
    }
  },
  dcwudao: {
    audio: 3,
    trigger: { player: "useCardAfter" },
    frequent: true,
    filter(event, player) {
      if (player.getStorage("dcwudao_effect").includes(get.type2(event.card, false))) {
        return false;
      }
      var history = player.getHistory("useCard"), index = history.indexOf(event);
      if (index < 1) {
        return false;
      }
      var evt = history[index - 1];
      return get.type2(event.card, false) == get.type2(evt.card, false);
    },
    prompt2(event) {
      return "令你本回合使用" + get.translation(get.type2(event.card, false)) + "牌时不可被响应且伤害+1";
    },
    async content(event, trigger, player) {
      player.addTempSkill("dcwudao_effect");
      player.markAuto("dcwudao_effect", [get.type2(trigger.card, false)]);
    },
    subSkill: {
      effect: {
        trigger: { player: "useCard" },
        forced: true,
        popup: false,
        onremove: true,
        filter(event, player) {
          return player.getStorage("dcwudao_effect").includes(get.type2(event.card, false));
        },
        async content(event, trigger, player) {
          if (get.tag(trigger.card, "damage") > 0) {
            trigger.baseDamage++;
          }
          trigger.directHit.addArray(game.filterPlayer());
        },
        intro: { content: "已经悟到了$牌" },
        ai: {
          directHit_ai: true,
          skillTagFilter(player, tag, arg) {
            if (arg && arg.card && player.getStorage("dcwudao_effect").includes(get.type2(arg.card))) {
              return true;
            }
            return false;
          }
        }
      }
    }
  },
  //叶诗文
  clbjisu: {
    trigger: { player: "phaseJudgeBefore" },
    direct: true,
    async content(event, trigger, player) {
      var check = player.countCards("h") > 2;
      const result = await player.chooseTarget(get.prompt("clbjisu"), "跳过判定阶段和摸牌阶段，视为对一名其他角色使用一张【杀】", function(card, player2, target) {
        if (player2 == target) {
          return false;
        }
        return player2.canUse({ name: "sha" }, target, false);
      }).set("check", check).set("ai", function(target) {
        if (!_status.event.check) {
          return 0;
        }
        return get.effect(target, { name: "sha" }, _status.event.player);
      }).setHiddenSkill("clbjisu").forResult();
      if (result.bool) {
        await player.useCard({ name: "sha", isCard: true }, result.targets[0], false, "clbjisu");
        trigger.cancel();
        player.skip("phaseDraw");
      }
    }
  },
  clbshuiyong: {
    trigger: { player: "damageBegin4" },
    filter(event) {
      return event.hasNature("fire");
    },
    forced: true,
    async content(event, trigger, player) {
      trigger.cancel();
    },
    ai: {
      nofire: true,
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "fireDamage")) {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  //孙杨
  clbshuijian: {
    trigger: { player: "phaseDrawBegin2" },
    frequent: true,
    filter(event, player) {
      return !event.numFixed;
    },
    async content(event, trigger, player) {
      const num = 1 + Math.floor(player.countCards("e") / 2);
      trigger.num += num;
    }
  },
  //李白
  dclbjiuxian: {
    audio: 2,
    enable: "chooseToUse",
    locked: false,
    viewAs: { name: "jiu" },
    check: (card) => 6.5 - get.value(card),
    filterCard(card) {
      var info = get.info(card);
      if (!info || info.type != "trick" && info.type != "delay") {
        return false;
      }
      if (info.notarget) {
        return false;
      }
      if (info.selectTarget != void 0) {
        if (Array.isArray(info.selectTarget)) {
          if (info.selectTarget[0] < 0) {
            return !info.toself;
          }
          return info.selectTarget[0] != 1 || info.selectTarget[1] != 1;
        } else {
          if (info.selectTarget < 0) {
            return !info.toself;
          }
          return info.selectTarget != 1;
        }
      }
      return false;
    },
    viewAsFilter(player) {
      if (_status.connectMode && player.countCards("hs") > 0) {
        return true;
      }
      return player.hasCard(lib.skill.dclbjiuxian.filterCard, "hs");
    },
    ai: {
      order: (item, player) => get.order({ name: "jiu" }, player)
    },
    mod: {
      cardUsable(card) {
        if (card.name == "jiu") {
          return Infinity;
        }
      }
    }
  },
  dcshixian: {
    audio: 2,
    trigger: { player: "useCard" },
    //frequent:true,
    //direct:true,
    locked: false,
    filter(event, player) {
      var history = player.getAllHistory("useCard"), index = history.indexOf(event);
      if (index < 1) {
        return false;
      }
      var evt = history[index - 1];
      return get.is.yayun(get.translation(event.card.name), get.translation(evt.card.name));
    },
    filterx(event) {
      if (event.targets.length == 0) {
        return false;
      }
      var type = get.type(event.card);
      if (type != "basic" && type != "trick") {
        return false;
      }
      return true;
    },
    prompt2(event, player) {
      if (lib.skill.dcshixian.filterx(event)) {
        return "摸一张牌并令" + get.translation(event.card) + "额外结算一次？";
      }
      return "摸一张牌。";
    },
    check(event, player) {
      if (lib.skill.dcshixian.filterx(event)) {
        return !get.tag(event.card, "norepeat");
      }
      return true;
    },
    async content(event, trigger, player) {
      await player.draw();
      if (lib.skill.dcshixian.filterx(trigger)) {
        trigger.effectCount++;
        game.log(trigger.card, "额外结算一次");
      }
    },
    mod: {
      aiOrder(player, card, num) {
        if (typeof card == "object" && !get.tag(card, "norepeat")) {
          var history = player.getAllHistory("useCard");
          if (history.length > 0) {
            var cardx = history[history.length - 1].card;
            if (get.is.yayun(get.translation(cardx.name), get.translation(card.name))) {
              return num + 20;
            }
          }
        }
      }
    },
    init(player) {
      player.addSkill("dcshixian_yayun");
      var history = player.getAllHistory("useCard");
      if (history.length) {
        player.addGaintag(
          player.getCards("h", (card) => {
            return get.is.yayun(get.translation(card.name), get.translation(history[history.length - 1].card.name));
          }),
          "dcshixian_yayun"
        );
      }
    },
    onremove(player) {
      player.removeSkill("dcshixian_yayun");
      player.removeGaintag("dcshixian_yayun");
    },
    subSkill: {
      yayun: {
        charlotte: true,
        trigger: { player: "useCard1" },
        filter(event, player) {
          return player.countCards("h") > 0;
        },
        direct: true,
        priority: 11 + 45 + 14 + 19 + 19 + 810,
        async content(event, trigger, player) {
          player.removeGaintag("dcshixian_yayun");
          player.addGaintag(
            player.getCards("h", (card) => {
              return get.is.yayun(get.translation(card.name), get.translation(trigger.card.name));
            }),
            "dcshixian_yayun"
          );
        }
      }
    }
  },
  //龙王
  dclonggong: {
    audio: 2,
    trigger: { player: "damageBegin4" },
    usable: 1,
    filter(event, player) {
      return event.source && event.source.isIn();
    },
    logTarget: "source",
    check(event, player) {
      return get.attitude(player, event.source) >= 0 || player.hp <= Math.max(2, event.num);
    },
    async content(event, trigger, player) {
      trigger.cancel();
      var card = get.cardPile2(function(card2) {
        return get.type(card2, null, false) == "equip";
      }), source = trigger.source;
      if (card && source && source.isIn()) {
        await source.gain(card, "gain2");
      }
    },
    ai: {
      filterDamage: true,
      skillTagFilter(player) {
        return !player.storage.counttrigger || !player.storage.counttrigger.dclonggong;
      }
    }
  },
  dcsitian: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      let colorx = false, hs = player.getCards("he");
      if (hs.length < 2) {
        return false;
      }
      for (const card of hs) {
        if (!lib.filter.cardDiscardable(card, player)) {
          continue;
        }
        const color = get.color(card, player);
        if (color == "none") {
          continue;
        }
        if (!colorx) {
          colorx = color;
        } else if (colorx != color) {
          return true;
        }
      }
      return false;
    },
    filterCard(card, player) {
      const color = get.color(card, player);
      if (color == "none") {
        return false;
      }
      return !ui.selected.cards.length || get.color(ui.selected.cards[0]) != color;
    },
    selectCard: 2,
    complexCard: true,
    prompt: "弃置两张颜色不同的牌并改变天气",
    check: (card) => 4.5 - get.value(card),
    async content(event, trigger, player) {
      const list = ["烈日", "雷电", "大浪", "暴雨", "大雾"].randomGets(2);
      const result = await player.chooseButton(true, ["请选择执行一个天气", [list.map((i) => [i, '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + i + "】</div><div>" + lib.skill.dcsitian.weathers[i].description + "</div></div>"]), "textbutton"]]).set("ai", (button) => {
        return lib.skill.dcsitian.weathers[button.link].ai(_status.event.player);
      }).forResult();
      if (result?.bool) {
        const choice = result.links[0];
        game.log(player, "将当前天气变更为", "#g" + choice);
        const next = game.createEvent("dcsitian_weather", false);
        next.player = player;
        next.setContent(lib.skill.dcsitian.weathers[choice].content);
        await next;
      }
    },
    ai: {
      order: 8,
      result: {
        player(player) {
          let num1 = 0, num2 = 0;
          game.countPlayer((current) => {
            if (player == current) {
              return;
            }
            const att = get.attitude(player, current);
            if (att > 0) {
              num1++;
            } else {
              num2++;
            }
          });
          return num2 - num1;
        }
      }
    },
    subSkill: {
      dawu: {
        trigger: { player: "useCard" },
        forced: true,
        charlotte: true,
        filter(event, player) {
          return get.type2(event.card, false) == "basic";
        },
        async content(event, trigger, player) {
          trigger.targets.length = 0;
          trigger.all_excluded = true;
          player.removeSkill(event.name);
        },
        mark: true,
        marktext: "雾",
        intro: {
          name: "司天 - 大雾",
          content: "使用的下一张基本牌无效"
        }
      }
    },
    weathers: {
      烈日: {
        description: "你对其他角色造成1点火属性伤害。",
        async content(event, trigger, player) {
          const targets = game.filterPlayer((current) => current != player).sortBySeat();
          player.line(targets, "fire");
          for (const target of targets) {
            await target.damage("fire");
          }
        },
        ai(player) {
          let effect = 0;
          game.countPlayer(function(current) {
            if (current == player) {
              return;
            }
            effect += get.damageEffect(current, player, player, "fire");
          });
          return effect;
        }
      },
      雷电: {
        description: "你令其他角色各进行一次判定。若结果为♠2~9，则其受到3点无来源雷属性伤害。",
        async content(event, trigger, player) {
          const targets = game.filterPlayer((current) => current != player).sortBySeat();
          player.line(targets, "thunder");
          for (const target of targets) {
            if (!target.isIn()) {
              continue;
            }
            const result = await target.judge(lib.card.shandian.judge, "司天·雷电").set("judge2", lib.card.shandian.judge2).forResult();
            if (result?.bool == false) {
              await target.damage(3, "thunder", "nosource");
            }
          }
        },
        ai(player) {
          let effect = 0;
          game.countPlayer(function(current) {
            if (current == player) {
              return;
            }
            effect += get.damageEffect(current, current, player, "thunder") / 5;
          });
          return effect;
        }
      },
      大浪: {
        description: "你弃置其他角色装备区内的所有牌（装备区内没有牌的角色改为失去1点体力）。",
        async content(event, trigger, player) {
          const targets = game.filterPlayer((current) => current != player).sortBySeat();
          player.line(targets, "green");
          for (const target of targets) {
            if (target.isIn()) {
              let num = target.countCards("e");
              if (num > 0) {
                await player.discardPlayerCard(target, true, "e", num);
              } else {
                await target.loseHp();
                await game.delayx();
              }
            }
          }
        },
        ai(player) {
          let effect = 0;
          game.countPlayer(function(current) {
            if (current == player) {
              return;
            }
            const es = current.getCards("e");
            if (es.length > 0) {
              const att = get.attitude(player, current), val = get.value(es, current);
              effect -= Math.sqrt(att) * val;
            } else {
              effect += get.effect(current, { name: "losehp" }, player, player);
            }
          });
          return effect;
        }
      },
      暴雨: {
        description: "你弃置一名角色的所有手牌。若其没有手牌，则改为令其失去1点体力。",
        async content(event, trigger, player) {
          const result = await player.chooseTarget("请选择【暴雨】的目标", "令目标角色弃置所有手牌。若其没有手牌，则其改为失去1点体力。").set("ai", (current) => {
            const es = current.getCards("h"), player2 = get.player();
            if (es.length > 0) {
              const att = get.attitude(player2, current), val = get.value(es, current);
              return -Math.sqrt(att) * val;
            }
            return get.effect(current, { name: "losehp" }, player2, player2);
          }).forResult();
          if (result?.bool) {
            const target = result.targets[0];
            player.line(target, "green");
            const num = target.countCards("h");
            if (num > 0) {
              await player.discardPlayerCard(target, true, "h", num);
            } else {
              await target.loseHp();
              await game.delayex();
            }
          }
        },
        ai(player) {
          return Math.max.apply(
            Math,
            game.filterPlayer(function(current) {
              return current != player;
            }).map(function(current) {
              const es = current.getCards("h");
              if (es.length > 0) {
                const att = get.attitude(player, current), val = get.value(es, current);
                return -Math.sqrt(att) * val;
              }
              return get.effect(current, { name: "losehp" }, player, player);
            })
          );
        }
      },
      大雾: {
        description: "你令所有其他角色获得如下效果：当其使用下一张基本牌时，取消之。",
        async content(event, trigger, player) {
          const targets = game.filterPlayer((current) => current != player).sortBySeat();
          player.line(targets);
          for (const target of targets) {
            target.addSkill("dcsitian_dawu");
          }
        },
        ai(player) {
          let effect = 0;
          game.countPlayer(function(current) {
            if (current == player || current.hasSkill("dcsitian_dawu")) {
              return;
            }
            effect -= 0.5 * get.attitude(player, current);
          });
          return effect;
        }
      }
    }
  },
  //美猴王
  dcjinjing: {
    audio: 2,
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
  dccibei: {
    audio: 2,
    trigger: { source: "damageBegin2" },
    logTarget: "player",
    filter(event, player) {
      return player != event.player && !player.hasHistory("useSkill", function(evt) {
        return evt.skill == "dccibei" && evt.targets.includes(event.player);
      });
    },
    check(event, player) {
      var target = event.player;
      if (get.attitude(player, target) >= 0) {
        return true;
      }
      return !player.getStat("skill").ruyijingubang_skill || player.storage.ruyijingubang_skill == 1;
    },
    async content(event, trigger, player) {
      trigger.cancel();
      await player.draw(5);
    },
    ai: {
      threaten: 4.5
    }
  },
  dcruyi: {
    audio: 2,
    derivation: "ruyijingubang_skill",
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter(event, player) {
      return (event.name != "phase" || game.phaseNumber == 0) && player.hasEquipableSlot(1) && !player.getEquips("ruyijingubang").length;
    },
    async content(event, trigger, player) {
      const card = game.createCard2("ruyijingubang", "heart", 9);
      player.$gain2(card, false);
      await game.delayx();
      await player.equip(card);
    },
    mod: {
      canBeGained(card, source, player) {
        if (player.getEquips("ruyijingubang").includes(card)) {
          return false;
        }
      },
      canBeDiscarded(card, source, player) {
        if (player.getEquips("ruyijingubang").includes(card)) {
          return false;
        }
      },
      canBeReplaced(card, player) {
        if (player.getVEquips("ruyijingubang").includes(card)) {
          return false;
        }
      },
      cardname(card) {
        if (get.subtype(card, false) == "equip1") {
          return "sha";
        }
      },
      cardnature(card) {
        if (get.subtypes(card, false).includes("equip1")) {
          return false;
        }
      },
      cardDiscardable(card, player) {
        if (player.getEquips("ruyijingubang").includes(card)) {
          return false;
        }
      },
      cardEnabled2(card, player) {
        if (player.getEquips("ruyijingubang").includes(card)) {
          return false;
        }
      }
    },
    group: "dcruyi_blocker",
    subSkill: {
      blocker: {
        audio: "dcruyi",
        trigger: {
          player: ["loseBefore", "disableEquipBefore"]
        },
        forced: true,
        filter(event, player) {
          if (event.name == "disableEquip") {
            return event.slots.includes("equip1");
          }
          var cards2 = player.getEquips("ruyijingubang");
          return event.cards.some((card) => cards2.includes(card));
        },
        async content(event, trigger, player) {
          if (trigger.name == "lose") {
            trigger.cards.removeArray(player.getEquips("ruyijingubang"));
          } else {
            while (trigger.slots.includes("equip1")) {
              trigger.slots.remove("equip1");
            }
          }
        }
      }
    }
  },
  ruyijingubang_skill: {
    equipSkill: true,
    enable: "phaseUse",
    usable: 1,
    chooseButton: {
      dialog() {
        var dialog = ui.create.dialog(
          "如意金箍棒：选择变化攻击范围",
          [
            [
              [1, "　　　⒈【杀】无次数限制　　　"],
              [2, "　　　⒉【杀】的伤害值+1　　　"]
            ],
            "tdnodes"
          ],
          [
            [
              [3, "　　　⒊【杀】不可被响应　　　"],
              [4, "　　　⒋【杀】的目标数+1　　　"]
            ],
            "tdnodes"
          ]
        );
        return dialog;
      },
      filter(button, player) {
        return button.link != player.storage.ruyijingubang_skill;
      },
      check(button) {
        if (button.link == 1 || button.link == 3) {
          return 1;
        }
        return 0;
      },
      backup(links, player) {
        return {
          audio: "dcruyi",
          num: links[0],
          popup: "如意金箍棒",
          async content(event, trigger, player2) {
            const num = lib.skill.ruyijingubang_skill_backup.num;
            player2.storage.ruyijingubang_skill = num;
            const cards2 = player2.getEquips(1);
            for (const card of cards2) {
              if (card && card.name == "ruyijingubang") {
                card.storage.ruyijingubang_skill = num;
                game.log(player2, "将", card, "的攻击范围改为" + num);
              }
            }
            player2.markSkill("ruyijingubang_skill");
          }
        };
      }
    },
    mod: {
      cardUsable(card, player, num) {
        if (player.storage.ruyijingubang_skill == 1 && card.name == "sha") {
          return Infinity;
        }
      }
    },
    ai: {
      order: 1,
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        return player.storage.ruyijingubang_skill == 3;
      },
      effect: {
        player(card, player, target, current) {
          if (get.tag(card, "damage") > 0 && player != target) {
            if (player.getStat("skill").ruyijingubang_skill && player.storage.ruyijingubang_skill != 1) {
              return;
            }
            if (player.hasSkill("dccibei") && !player.hasHistory("useSkill", function(evt) {
              return evt.skill == "dccibei" && evt.targets.includes(target);
            })) {
              return [1, 3];
            }
          }
        }
      },
      result: {
        player(player) {
          if (player.storage.ruyijingubang_skill == 1) {
            if (!player.hasSha()) {
              return 1;
            }
            return 0;
          } else {
            if (player.hasSha() && player.getCardUsable("sha") <= 0) {
              return 1;
            }
            return 0;
          }
        }
      }
    },
    intro: {
      name: "如意金箍棒",
      content(storage) {
        if (!storage) {
          storage = 3;
        }
        return "<li>攻击范围：" + storage + "<br><li>" + ["你使用【杀】无次数限制。", "你使用的【杀】伤害+1。", "你使用的【杀】不可被响应。", "你使用【杀】选择目标后，可以增加一个额外目标。"][storage - 1];
      }
    },
    subSkill: {
      backup: {}
    }
  },
  ruyijingubang_effect: {
    equipSkill: true,
    trigger: { player: "useCard2" },
    direct: true,
    locked: true,
    filter(event, player) {
      if (event.card.name != "sha") {
        return false;
      }
      var num = player.storage.ruyijingubang_skill;
      if (!num || num == 1) {
        return false;
      }
      if (num != 4) {
        return true;
      }
      var card = event.card;
      if (game.hasPlayer(function(current) {
        return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && lib.filter.targetInRange(card, player, current);
      })) {
        return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      var num = player.storage.ruyijingubang_skill;
      if (num == 4) {
        const result = await player.chooseTarget(get.prompt("ruyijingubang_effect"), "为" + get.translation(trigger.card) + "额外指定一个目标", function(card, player2, target) {
          return !_status.event.sourcex.includes(target) && player2.canUse(_status.event.card, target, false);
        }).set("sourcex", trigger.targets).set("ai", function(target) {
          var player2 = _status.event.player;
          return get.effect(target, _status.event.card, player2, player2);
        }).set("card", trigger.card).forResult();
        if (result.bool) {
          if (!event.isMine() && !event.isOnline()) {
            await game.delayx();
          }
          await player.logSkill("ruyijingubang_effect", result.targets);
          trigger.targets.addArray(result.targets);
        }
      } else {
        await player.logSkill("ruyijingubang_effect");
        if (num == 2) {
          trigger.baseDamage++;
          game.log(trigger.card, "的伤害+1");
        } else if (num == 3) {
          trigger.directHit.addArray(game.filterPlayer());
          game.log(trigger.card, "不可被响应");
        }
        return;
      }
    }
  },
  //涛神
  dcnutao: {
    audio: 4,
    trigger: { player: "useCardToPlayer" },
    forced: true,
    group: "dcnutao_add",
    filter(event, player) {
      if (get.type2(event.card) != "trick") {
        return false;
      }
      return event.isFirstTarget && event.targets.some((i) => i != player);
    },
    async content(event, trigger, player) {
      const target = trigger.targets.filter((i) => i != player).randomGet();
      player.line(target, "thunder");
      await target.damage("thunder");
    },
    ai: {
      effect: {
        player_use(card, player, target) {
          if (player !== target && get.type2(card) === "trick") {
            let tars = [target];
            if (ui.selected.targets.length) {
              tars.addArray(ui.selected.targets.filter((i) => i !== player && i !== target));
            }
            if (tars.length < 2) {
              return [1, 0, 1, -2];
            }
            return [1, 0, 1, -2 / tars.length];
          }
        }
      }
    },
    subSkill: {
      add: {
        audio: "dcnutao",
        trigger: { source: "damageSource" },
        filter(event, player) {
          return event.nature == "thunder" && player.isPhaseUsing();
        },
        forced: true,
        async content(event, trigger, player) {
          player.addTempSkill("dcnutao_sha", "phaseUseAfter");
          player.addMark("dcnutao_sha", 1, false);
        }
      },
      sha: {
        charlotte: true,
        onremove: true,
        marktext: "涛",
        intro: {
          content: "此阶段使用【杀】的次数上限+#"
        },
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.countMark("dcnutao_sha");
            }
          }
        }
      }
    }
  },
  //铜雀台
  spduanzhi: {
    trigger: { target: "useCardToTargeted" },
    logTarget: "player",
    check(event, player) {
      var target = event.player;
      if (get.attitude(player, target) >= -2 || target.countCards("he", function(card) {
        return get.value(card, target) > 5;
      }) < 2) {
        return false;
      }
      if (player.hp > 2) {
        return true;
      }
      if (player.hp == 1) {
        if (get.tag(event.card, "respondSha")) {
          if (player.countCards("h", { name: "sha" }) == 0) {
            return true;
          }
        } else if (get.tag(event.card, "respondShan")) {
          if (player.countCards("h", { name: "shan" }) == 0) {
            return true;
          }
        } else if (get.tag(event.card, "damage")) {
          if (event.card.name == "shuiyanqijunx") {
            return player.countCards("e") == 0;
          }
          return true;
        }
      }
      return false;
    },
    filter(event, player) {
      return player != event.player && event.player.hasDiscardableCards(player, "he");
    },
    async content(event, trigger, player) {
      await player.discardPlayerCard(trigger.player, true, "he", [1, 2]);
      await player.loseHp();
    }
  },
  spduyi: {
    enable: "phaseUse",
    usable: 1,
    async content(event, trigger, player) {
      const card = get.cards()[0];
      await game.cardsGotoOrdering(card);
      await player.showCards(card);
      const result = await player.chooseTarget("令一名角色获得" + get.translation(card), true).set("ai", function(target2) {
        var att = get.attitude(_status.event.player, target2);
        if (_status.event.du) {
          if (target2.hasSkillTag("nodu")) {
            return 0;
          }
          return -att;
        }
        if (att > 0) {
          if (target2 == player) {
            att *= 0.6;
          }
          return att + Math.sqrt(Math.max(0, 5 - target2.countCards("h")));
        }
        return att;
      }).set("du", card.name == "du").forResult();
      if (result.bool) {
        var target = result.targets[0];
        target.gain(card, "gain2");
        if (get.color(card, false) == "black") {
          target.addTempSkill("spduyi2");
        }
      }
    },
    ai: {
      order: 0.1,
      result: {
        player: 1
      }
    }
  },
  spduyi2: {
    mod: {
      cardEnabled2(card) {
        if (get.position(card) == "h") {
          return false;
        }
      }
    },
    mark: true,
    intro: {
      content: "不能使用或打出手牌"
    }
  },
  spcangni: {
    audio: "zhuikong",
    trigger: { player: "phaseDiscardBegin" },
    direct: true,
    async content(event, trigger, player) {
      const result = await player.chooseDrawRecover("###" + get.prompt("spcangni") + "###摸两张牌或回复1点体力，然后将武将牌翻面", 2).set("logSkill", "spcangni").forResult();
      if (result.control != "cancel2") {
        await player.turnOver();
      }
    },
    group: ["spcangni_gain", "spcangni_lose"],
    subSkill: {
      gain: {
        audio: "zhuikong",
        trigger: {
          player: "gainAfter",
          global: "loseAsyncAfter"
        },
        usable: 1,
        filter(event, player) {
          if (!_status.currentPhase?.isIn()) {
            return false;
          }
          return player.isTurnedOver() && player != _status.currentPhase && event.getg?.(player)?.length > 0;
        },
        check(event, player) {
          return get.attitude(player, _status.currentPhase) > 0;
        },
        logTarget() {
          return _status.currentPhase;
        },
        prompt2: "令该角色摸一张牌",
        async content(event, trigger, player) {
          _status.currentPhase.draw();
        }
      },
      lose: {
        audio: "zhuikong",
        trigger: {
          player: "loseAfter",
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          if (!_status.currentPhase?.isIn()) {
            return false;
          }
          if (event.name == "gain" && player == event.player) {
            return false;
          }
          if (!event.getl?.(player)?.cards2?.length) {
            return false;
          }
          return player.isTurnedOver() && player != _status.currentPhase && _status.currentPhase.countCards("he") > 0;
        },
        check(event, player) {
          const target = _status.currentPhase;
          const att = get.attitude(player, target);
          if (target.countCards("e", (card) => get.value(card, target) <= 0)) {
            return att > 0;
          }
          return att < 0;
        },
        logTarget() {
          return _status.currentPhase;
        },
        prompt2: "令该角色弃置一张牌",
        async content(event, trigger, player) {
          _status.currentPhase.chooseToDiscard("he", true);
        }
      }
    }
  },
  spmixin: {
    audio: "qiuyuan",
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h") > 0 && game.countPlayer() > 2;
    },
    filterCard: true,
    filterTarget: lib.filter.notMe,
    position: "h",
    selectTarget: 2,
    targetprompt: ["拿牌打人", "被打"],
    multitarget: true,
    delay: false,
    discard: false,
    lose: false,
    check(card) {
      if (card.name == "sha") {
        return 4;
      }
      return 4 - get.value(card);
    },
    async content(event, trigger, player) {
      const targets = event.targets;
      await player.give(event.cards, targets[0]);
      if (!targets[0].isIn() || !targets[1].isIn()) {
        return;
      }
      const result = await targets[0].chooseToUse(
        function(card, player2, event2) {
          if (get.name(card) != "sha") {
            return false;
          }
          return lib.filter.filterCard.apply(this, arguments);
        },
        "密信：对" + get.translation(targets[1]) + "使用一张【杀】，或令其观看并获得你的一张手牌"
      ).set("complexSelect", true).set("filterTarget", function(card, player2, target) {
        if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
          return false;
        }
        return lib.filter.targetEnabled.apply(this, arguments);
      }).set("sourcex", targets[1]).forResult();
      if (!result.bool && targets[0].countCards("h")) {
        await targets[1].gainPlayerCard(targets[0], "visible", "h", true);
      }
    },
    ai: {
      order: 1,
      expose: 0.1,
      result: {
        target(player, target) {
          var card = ui.selected.cards[0];
          if (!card) {
            return 0;
          }
          if (ui.selected.targets.length == 0) {
            if (card.name == "sha" || target.hasSha()) {
              return 2;
            }
            if (get.value(card, target) < 0) {
              return -2;
            }
            return 0;
          }
          var target1 = ui.selected.targets[0];
          if ((card.name == "sha" || target1.hasSha()) && get.effect(target, { name: "sha" }, target1, target1) > 0) {
            return get.effect(target, { name: "sha" }, target1, target);
          }
          return 1.5;
        }
      }
    }
  },
  spfengyin: {
    audio: "moukui",
    trigger: { global: "phaseZhunbeiBegin" },
    direct: true,
    filter(event, player) {
      return player != event.player && event.player.hp >= player.hp && player.countCards("h", function(card) {
        if (_status.connectMode) {
          return true;
        }
        return get.name(card, player) == "sha";
      }) > 0;
    },
    async content(event, trigger, player) {
      const result = await player.chooseCard("h", get.prompt("spfengyin", trigger.player), "交给该角色一张【杀】并令其跳过出牌阶段和弃牌阶段", function(card, player2) {
        return get.name(card, player2) == "sha";
      }).set("ai", function(card) {
        if (_status.event.goon) {
          return 5 - get.value(card);
        }
        return 0;
      }).set(
        "goon",
        (function() {
          if (get.attitude(player, trigger.player) >= 0) {
            return false;
          }
          if (trigger.player.countCards("hs") < trigger.player.hp) {
            return false;
          }
          return true;
        })()
      ).forResult();
      if (result.bool) {
        var target = trigger.player;
        player.logSkill("spfengyin", target);
        player.give(result.cards, target, "give");
        target.skip("phaseUse");
        target.skip("phaseDiscard");
      }
    }
  },
  spchizhong: {
    mod: {
      maxHandcardBase(player, num) {
        return player.maxHp;
      }
    },
    trigger: { global: "dieAfter" },
    forced: true,
    async content(event, trigger, player) {
      await player.gainMaxHp();
    }
  },
  fenxin_old: {
    mode: ["identity"],
    trigger: { source: "dieBegin" },
    init(player) {
      player.storage.fenxin = false;
    },
    intro: {
      content: "limited"
    },
    skillAnimation: "epic",
    animationColor: "fire",
    unique: true,
    limited: true,
    audio: "fenxin",
    mark: true,
    filter(event, player) {
      if (player.storage.fenxin) {
        return false;
      }
      return event.player.identity != "zhu" && player.identity != "zhu" && player.identity != "mingzhong" && event.player.identity != "mingzhong";
    },
    check(event, player) {
      if (player.identity == event.player.identity) {
        return Math.random() < 0.5;
      }
      var stat = get.situation();
      switch (player.identity) {
        case "fan":
          if (stat < 0) {
            return false;
          }
          if (stat == 0) {
            return Math.random() < 0.6;
          }
          return true;
        case "zhong":
          if (stat > 0) {
            return false;
          }
          if (stat == 0) {
            return Math.random() < 0.6;
          }
          return true;
        case "nei":
          if (event.player.identity == "fan" && stat < 0) {
            return true;
          }
          if (event.player.identity == "zhong" && stat > 0) {
            return true;
          }
          if (stat == 0) {
            return Math.random() < 0.7;
          }
          return false;
      }
      return false;
    },
    prompt(event, player) {
      return "焚心：是否与" + get.translation(event.player) + "交换身份？";
    },
    async content(event, trigger, player) {
      game.broadcastAll(
        function(player2, target, shown) {
          const identity = player2.identity;
          player2.identity = target.identity;
          if (shown || player2 == game.me) {
            player2.setIdentity();
          }
          target.identity = identity;
        },
        player,
        trigger.player,
        trigger.player.identityShown
      );
      player.line(trigger.player, "green");
      player.storage.fenxin = true;
      player.awakenSkill(event.name);
    }
  },
  //波仔
  quanjia: {
    audio: 2,
    intro: {
      markcount(storage, player) {
        return storage || 0;
      },
      content(storage) {
        return `下次多看${storage || 0}张牌`;
      }
    },
    trigger: {
      global: "damageSource"
    },
    filter(event, player) {
      if (!event.source || event.source == player || !event.player || event.player == event.source || _status.currentPhase != event.source) {
        return false;
      }
      if (!event.source.isIn()) {
        return false;
      }
      return event.source.countCards("h") > 0;
    },
    logTarget: "source",
    prompt2(event, player) {
      return `随机观看其${2 + player.countMark("quanjia")}张手牌，若没有【杀】，下次多看一张`;
    },
    check(event, player) {
      return get.attitude(player, event.source) < 0;
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      const skill = event.name;
      const num = 2 + player.countMark(skill);
      const cards2 = target.getCards("h").randomGets(num);
      player.clearMark(skill, false);
      if (cards2.length) {
        await player.viewCards(get.translation(target) + "的手牌", cards2);
        const shaCards = cards2.filter((card) => {
          return get.name(card, target) == "sha";
        });
        if (shaCards.length) {
          while (shaCards.length) {
            const card = shaCards.shift();
            if (player.canUse(card, target, false, false)) {
              await player.useCard(card, target, false);
            }
          }
          return;
        }
      }
      player.chat("(小猫骂骂咧咧)");
      player.addMark(skill, 1, false);
    }
  },
  //香蕉端午
  xiaomian: {
    trigger: { player: "useCard" },
    filter(event, player) {
      const suit = get.suit(event.card);
      return player.countCards("e", { suit }) > 0;
    },
    check: () => true,
    async content(event, trigger, player) {
      const suit = get.suit(trigger.card);
      const num = player.countCards("e", { suit });
      if (!num) {
        return;
      }
      await player.draw(num);
      await player.chooseToDiscard(true, "e");
    }
  },
  xuyuan: {
    trigger: { player: "phaseUseBegin" },
    async cost(event, trigger, player) {
      const result = await player.chooseButton([get.prompt2(event.skill), [lib.suit.map((i) => [i, get.translation(i)]), "tdnodes"], [Array.from({ length: 5 }).map((val, i) => [`equip${i + 1}`, get.translation(`equip${i + 1}`)]), "tdnodes"]], 2).set("filterButton", (button) => {
        const { buttons } = ui.selected;
        if (!buttons?.length) {
          return true;
        }
        return lib.suit.includes(button.link) != lib.suit.includes(buttons[0].link);
      }).set("ai", (button) => Math.random()).forResult();
      if (result?.bool && result.links?.length) {
        const { links } = result;
        if (!lib.suit.includes(links[0])) {
          links.reverse();
        }
        event.result = {
          bool: true,
          cost_data: links
        };
      }
    },
    async content(event, trigger, player) {
      const {
        cost_data: [suit, subtype]
      } = event;
      const card = get.cardPile2((card2) => {
        return get.suit(card2) == suit && get.subtype(card2) == subtype && player.canEquip(card2, true);
      }, "random");
      if (card) {
        player.chat("Happy Happy Happy");
        await player.equip(card);
      } else {
        player.chat("呜呜呜...");
      }
    }
  }
};
const translates = {
  ol_chitu: "OL赤兔",
  ol_chitu_prefix: "OL",
  ol_le_menghuo: "OL乐孟获",
  ol_le_menghuo_prefix: "OL乐",
  ol_niuma: "OL牛头马面",
  ol_niuma_prefix: "OL",
  oldianbu: "点簿",
  oldianbu_info: "锁定技，你的首个回合开始时，你获得十三张牌。当你每个回合内首次打出一种“拘魂”组合后，你视为使用一张【无中生有】，且因此获得的牌不计入手牌上限。若为炸弹，刷新此技能。",
  oljuhun: "拘魂",
  oljuhun_info: "出牌阶段开始时，将你的手牌变为扑克牌（仅点数可见，随机赋予花色），直到此回合结束。你可根据以下组合打出扑克牌并执行效果：对子：视为使用一张基本牌（不计入次数）；三条：获得相邻角色各一张牌；炸弹：造成2点伤害；顺子：你将一名角色随机两张牌变为扑克牌。",
  xiangxue_liushan: "刘禅",
  xiangxue_liushan_ab: "想学刘禅",
  xiangxue: "想学",
  xiangxue_info: "锁定技，你每使用两张未使用过的牌名的牌，获得等量个“惘”标记并摸一张牌，然后若“惘”数为：6，交换上文中的两个数字；9，删除上文中的未；12，失去此技能。",
  zhiyong: "致用",
  zhiyong_info: "每局游戏每项限一次，你可弃置对应数量张牌，视为使用一张普通【杀】：1.手牌数；2.2；3.“惘”数。若弃置牌数等于序号数，改为弃置一名其他角色对应数量张牌或摸等量张牌。",
  haoxue_lvmeng: "吕蒙",
  haoxue_lvmeng_ab: "好学吕蒙",
  haoxue: "好学",
  haoxue_info: "锁定技，你于：出牌阶段外弃置牌时，失去1点体力；出牌阶段内获得牌时，回复1点体力。",
  qiongshe: "穷涉",
  qiongshe_info: "若以下值为质数，你可于对应时机亮出牌堆顶的八张牌，获得其中点数为质数的牌：手牌数，摸牌阶段开始时；因此获得牌数，出牌阶段；体力值，弃牌阶段结束时。",
  boxue_caochong: "曹冲",
  boxue_caochong_ab: "博学曹冲",
  boxue: "博学",
  boxue_info: "每轮限一次，你可弃置所有弃牌堆中有的牌名的手牌，视为使用一张弃牌堆中没有且能指定目标的基本牌或普通锦囊牌。",
  zhizhong: "置重",
  zhizhong_info: "出牌阶段限一次，你可观看所有其他角色的手牌，选择并获得这些牌中点数和小于等于你手牌的牌，然后你弃置X张牌（X为本次获得牌与原手牌的点数和之差）。",
  natu_guanyu: "那兔关羽",
  natu_guanyu_prefix: "那兔",
  natu_zhugeliang: "那兔诸葛亮",
  natu_zhugeliang_prefix: "那兔",
  natu_zhaoyun: "那兔赵云",
  natu_zhaoyun_prefix: "那兔",
  natuyi: "义",
  natuyi_info: "出牌阶段限一次，你可以令至多两名其他角色交给你一张牌，然后你选择一项：1.将这些牌当做无距离次数限制的任意【杀】对其中一名角色使用。此【杀】结算中，其不能使用与此【杀】转化前的牌相同颜色的手牌；2.将这些牌分配给未成为目标的角色，其使用因此获得的黑色牌指定其他角色为目标后，目标本回合非锁定技失效。",
  natuxing: "兴",
  natuxing_info: "游戏开始时，你获得牌堆中所有牌名的能够指定目标的锦囊牌各一张，称为“兴”（不可使用或弃置且不计入手牌上限）。每回合限X次（X为你本回合使用伤害牌数），你造成伤害后，随机令一张“兴”可使用。若你的手牌中没有不可使用的“兴”，你使用牌无距离次数限制且不可被响应。",
  natufu: "抚",
  natufu_info: `你使用锦囊牌后，可发动此技能。若此牌：1.与你手牌中的“兴”牌名均不同，你令体力值唯一最小的角色回复1点体力；2.本局游戏仅你使用过此牌名的牌，你对一名角色造成1点火属性伤害。${get.poptip("rule_chengshi")}：本次执行效果中所有数字+1。`,
  natulie: "烈",
  natulie_info: "你使用基本牌后，你可将手牌数调整至X张（X为本回合本技能发动次数+1且至多为5），若你因此弃置了牌，你可对一名角色造成1点伤害。",
  natuheng: "恒",
  natuheng_info: "每轮限一次，若你的手牌中没有：1.非伤害牌，你可视为使用或打出一张【闪】；2.伤害牌，你可视为使用或打出一张无次数限制的任意【杀】。",
  ol_le_caopi: "OL乐曹丕",
  ol_le_caopi_prefix: "OL乐",
  olweidai: "魏代",
  olweidai_info: "锁定技，当魏势力角色对你使用牌后，你加1点体力上限，然后若你的体力上限为全场最大，你将体力上限调整至体力值并摸减少体力上限张牌；若摸牌数大于等于存活角色数，你令一名角色变更势力为魏。",
  olliangzi: "梁姿",
  olliangzi_info: "锁定技，你的装备牌只能当【酒】使用。你每回合使用前X张【酒】无次数限制（X为魏势力角色数）。",
  bachiqionggouyu: "八尺琼勾玉",
  bachiqionggouyu_info: "锁定技，出牌阶段结束时回复1点体力；摸牌阶段开始时，若你的体力为满，则摸牌数+2。",
  bachiqionggouyu_skill: "八尺琼勾玉",
  bachiqionggouyu_skill_info: "锁定技，出牌阶段结束时回复1点体力；摸牌阶段开始时，若你的体力为满，则摸牌数+2。",
  bazhijing: "八咫鏡",
  bazhijing_info: "锁定技，在你受到一张锦囊牌伤害后，防止同名锦囊牌对你造成的伤害，失去此装备后清除记录。",
  bazhijing_skill: "八咫鏡",
  bazhijing_skill_info: "锁定技，在你受到一张锦囊牌伤害后，防止同名锦囊牌对你造成的伤害，失去此装备后清除记录。",
  ol_le_caohong: "OL乐曹洪",
  ol_le_caohong_prefix: "OL乐",
  olmojin: "摸金",
  olmojin_info: `锁定技，游戏开始时，你进行一次${get.poptip({
    id: "olmojin_tip",
    name: "摸金",
    type: "character",
    info: "从随机的三个操作中选择一个(对其他角色可见)。摸金成功会获得奖励，然后继续“摸金”。"
  })}。每当${get.poptip("olmojin_tip")}成功后，你获得奖励并重新进行一次${get.poptip("olmojin_tip")}。回合开始时，将${get.poptip("luoyangchan")}置入你的武器栏。`,
  olmojin_directHit: "不可响应",
  olmojin_baseDamage: "回复+1",
  oldingbao: "定宝",
  oldingbao_info: `限定技，出牌阶段，你可以直接完成一次${get.poptip("olmojin_tip")}并结束此阶段。`,
  luoyangchan: "洛阳铲",
  luoyangchan_info: "出牌阶段限一次，你可以弃置一张黑色牌，执行一次手气卡效果(不消耗手气卡)。",
  luoyangchan_skill: "洛阳铲",
  luoyangchan_skill_info: "出牌阶段限一次，你可以弃置一张黑色牌，执行一次手气卡效果(不消耗手气卡)。",
  old_lingju: "SP灵雎",
  old_lingju_prefix: "SP",
  fenxin_old: "焚心",
  fenxin_old_info: "限定技，当你杀死一名非主公角色时，你可以与其交换未翻开的身份牌。（你的身份为主公时不能发动此技能）",
  sp_fuwan: "SP伏完",
  sp_fuwan_prefix: "SP",
  spfengyin: "奉印",
  spfengyin_info: "其他角色的回合开始时，若其体力值不少于你，你可以交给其一张【杀】，令其跳过出牌阶段和弃牌阶段。",
  spchizhong: "持重",
  spchizhong_info: "锁定技，你的手牌上限等于体力上限；其他角色死亡时，你加1点体力上限。",
  sp_fuhuanghou: "SP伏寿",
  sp_fuhuanghou_prefix: "SP",
  spcangni: "藏匿",
  spcangni_info: "弃牌阶段开始时，你可以回复1点体力或摸两张牌，然后将你的武将牌翻面；其他角色的回合内，当你获得（每回合限一次）/失去一次牌时，若你的武将牌背面朝上，你可以令该角色摸/弃置一张牌。",
  spmixin: "密信",
  spmixin_info: "出牌阶段限一次，你可以将一张手牌交给一名其他角色，该角色须对你选择的另一名角色使用一张无距离限制的【杀】，否则你选择的角色观看其手牌并获得其中一张。",
  sp_jiben: "SP吉本",
  sp_jiben_prefix: "SP",
  spduanzhi: "断指",
  spduanzhi_info: "当你成为其他角色使用的牌的目标后，你可以弃置其至多两张牌，然后失去1点体力。",
  spduyi: "毒医",
  spduyi2: "毒医",
  spduyi_info: "出牌阶段限一次，你可以亮出牌堆顶的一张牌并交给一名角色，若此牌为黑色，该角色不能使用或打出手牌，直到回到结束。",
  sp_mushun: "SP穆顺",
  sp_mushun_prefix: "SP",
  libai: "李白",
  dclbjiuxian: "酒仙",
  dclbjiuxian_info: "①你可以将额定目标数大于1的锦囊牌当做【酒】使用。②你使用【酒】无次数限制。",
  dcshixian: "诗仙",
  dcshixian_yayun: "押韵",
  dcshixian_info: "当你使用一张牌时，若此牌的牌名与你于本局游戏使用的上一张牌的牌名押韵，则你可以摸一张牌，并令此牌额外结算一次。",
  taoshen: "涛神",
  dcnutao: "怒涛",
  dcnutao_info: "锁定技。①当你使用锦囊牌指定第一个目标时，若目标角色包含其他角色，你随机对其中一名其他目标角色造成1点雷电伤害。②当你于出牌阶段造成雷电伤害后，你于此阶段使用【杀】的次数上限+1。",
  sunwukong: "孙悟空",
  dcjinjing: "金睛",
  dcjinjing_info: "锁定技。其他角色的手牌对你可见。",
  dccibei: "慈悲",
  dccibei_info: "每回合每名角色限一次。当你对其他角色造成伤害时，你可以防止此伤害，然后摸五张牌。",
  dcruyi: "如意",
  dcruyi_info: `锁定技。①游戏开始时，你将${get.poptip("ruyijingubang")}置入装备区。②你手牌区内的武器牌均视为【杀】，且你不是武器牌的合法目标。③当你即将失去${get.poptip("ruyijingubang")}或即将废除武器栏时，取消之。④你不能将装备区内的${get.poptip("ruyijingubang")}当做其他牌使用或打出。`,
  ruyijingubang: "如意金箍棒",
  // ruyijingubang_skill:'如意',
  ruyijingubang_skill: "金箍棒",
  ruyijingubang_effect: "金箍棒",
  ruyijingubang_info: "出牌阶段限一次。你可以将此牌的实际攻击范围调整为1~4内的任意整数。你根据此牌的实际攻击范围拥有对应的效果：<br><li>⑴你使用【杀】无次数限制。<br><li>⑵你使用的【杀】伤害+1。<br><li>⑶你使用的【杀】不可被响应。<br><li>⑷你使用【杀】选择目标后，可以增加一个额外目标。",
  ruyijingubang_skill_info: "出牌阶段限一次。你可以将此牌的实际攻击范围调整为1~4内的任意整数。你根据此牌的实际攻击范围拥有对应的效果：<br><li>⑴你使用【杀】无次数限制。<br><li>⑵你使用的【杀】伤害+1。<br><li>⑶你使用的【杀】不可被响应。<br><li>⑷你使用【杀】选择目标后，可以增加一个额外目标。",
  longwang: "龙王",
  dclonggong: "龙宫",
  dclonggong_info: "每回合限一次。当你受到伤害时，你可以防止此伤害，然后令伤害来源从牌堆中获得一张装备牌。",
  dcsitian: "司天",
  dcsitian_info: `出牌阶段，你可以弃置两张颜色不同的手牌。系统从所有${get.poptip({
    id: "sitian_tianqi",
    name: "天气",
    type: "character",
    info: "<li>烈日：你对其他角色依次造成1点火属性伤害。<br><li>雷电：你令其他角色各进行一次判定。若结果为♠2~9，则其受到3点无来源雷属性伤害。<br><li>大浪：你弃置其他角色装备区内的所有牌（装备区内没有牌的角色改为失去1点体力）。<br><li>暴雨：你弃置一名角色的所有手牌。若其没有手牌，则改为令其失去1点体力。<br><li>大雾：你令所有其他角色获得如下效果：当其使用下一张基本牌时，取消之。"
  })}中随机选择两个，你观看这些${get.poptip("sitian_tianqi")}并选择一个执行。`,
  sunyang: "孙杨",
  clbshuijian: "水箭",
  clbshuijian_info: "摸牌阶段开始时，你可以令额定摸牌数+X（X为你装备区内牌数的一半+1，且向下取整）。",
  yeshiwen: "叶诗文",
  clbjisu: "急速",
  clbjisu_info: "判定阶段开始前，你可以跳过本回合的判定阶段和摸牌阶段，视为对一名其他角色使用一张【杀】。",
  clbshuiyong: "水泳",
  clbshuiyong_info: "锁定技。当你受到火属性伤害时，取消之。",
  xiaoyuehankehan: "小约翰可汗",
  dctongliao: "通辽",
  dctongliao_info: "①摸牌阶段结束时，你可以选择一张点数最小的手牌，将此牌标记为“通辽”。②当你失去一张具有“通辽”标签的牌时，你摸X张牌（X为此牌点数）。",
  dcwudao: "悟道",
  dcwudao_info: "当你使用牌结算结束后，若你本回合使用的上一张牌与此牌类型相同，则你可以于本回合内获得如下效果：当你于回合内使用该类型的牌时，你令此牌不可被响应且伤害值基数+1。",
  zhutiexiong: "朱铁雄",
  wu_zhutiexiong: "朱铁雄",
  dcbianzhuang: "变装",
  dcbianzhuang_info: "①出牌阶段限一次，你可以从系统随机选择的两个技能中获得一个，并视为使用一张【杀】（无距离次数限制），然后失去以此法获得的技能。②当你使用装备牌后，你清空此技能的发动次数记录。③当你发动〖变装①〗后，若你发动〖变装①〗的次数大于2，则你换肤为武·朱铁雄，并将系统选择的技能数改为三个。",
  dc_caocao: "经典曹操",
  dc_caocao_prefix: "经典",
  dcjianxiong: "奸雄",
  dcjianxiong_info: "当你受到伤害后，你可以摸一张牌并获得对你造成伤害的牌，然后你令此技能摸牌数+1（至多为5）。",
  dc_liubei: "经典刘备",
  dc_liubei_prefix: "经典",
  dcrende: "仁德",
  dcrende_info: "出牌阶段每名角色限一次。你可以获得一名其他角色两张手牌，然后视为使用一张基本牌。",
  dc_sunquan: "经典孙权",
  dc_sunquan_prefix: "经典",
  dczhiheng: "制衡",
  dczhiheng_info: "①出牌阶段限一次。你可以弃置任意张牌并摸等量的牌，若你在发动〖制衡〗时弃置了所有手牌，则你多摸一张牌。②每回合每名角色限一次。当你对其他角色造成伤害后，你令〖制衡①〗于此回合发动次数上限+1。",
  nezha: "哪吒",
  dcsantou: "三头",
  dcsantou_info: "锁定技，当你受到伤害时，防止之，然后若以下有条件成立，你失去1点体力：1.你于本回合此前以此法防止过该伤害来源的伤害，且你的体力值不小于3；2.本次伤害为属性伤害，且你的体力值为2；3.本次伤害的渠道为红色的牌，且你的体力值为1。",
  dcfaqi: "法器",
  dcfaqi_info: "当你于出牌阶段使用装备牌结算结束后，你可以视为使用一张本回合未以此法使用过的普通锦囊牌。",
  dc_sunce: "经典孙策",
  dc_sunce_prefix: "经典",
  dcshuangbi: "双璧",
  dcshuangbi_info: "出牌阶段限一次，你可以选择一项：①摸X张牌，本回合手牌上限+X；②弃置至多X张牌，随机对其他角色造成等量火焰伤害；③视为使用至多X张火【杀】或【火攻】（X为场上存活角色数）。",
  dc_zhaoyun: "经典神赵云",
  dc_zhaoyun_prefix: "经典神",
  dclonghun: "龙魂",
  dclonghun_info: "每回合限20次，你可以将你的牌按下列规则使用或打出：红桃当【桃】，方块当火【杀】，梅花当【闪】，黑桃当【无懈可击】。",
  dczhanjiang: "斩将",
  dczhanjiang_info: "准备阶段，若场上有【青釭剑】，则你可以获得之。",
  dc_wuyi: "经典吴懿",
  dc_wuyi_prefix: "经典",
  dcbenxi: "奔袭",
  dcbenxi_info: "转换技，锁定技。当你失去手牌后，阳：系统随机检索出一句转换为拼音后包含“wu,yi”的技能台词，然后你念出此台词。阴：你获得上次所念出的台词对应的技能直到你的下个回合开始；若你已拥有该技能，则改为对其他角色各造成1点伤害。",
  quyuan: "屈原",
  dcqiusuo: "求索",
  dcqiusuo_info: "当你造成或受到伤害后，你可以从牌堆或弃牌堆中获得一张【铁索连环】。",
  dclisao: "离骚",
  dclisao_info: "出牌阶段限一次，你可以选择至多两名角色，这些角色须同时回答《离骚》的句段填空（抢答题，一名角色回答正确后结束答题）。回答正确的角色展示所有手牌，其余角色本回合不能响应你使用的牌且受到的伤害翻倍。",
  xin_sunquan: "会玩孙权",
  xin_sunquan_ab: "孙权",
  dchuiwan: "会玩",
  dchuiwan_info: "每回合每种牌名限一次，当你摸牌时，你可以选择至多等同于摸牌数的基本牌或普通锦囊牌的牌名并从牌堆中获得，然后你少摸等量张牌。",
  dchuanli: "唤理",
  dchuanli_info: `结束阶段，若你本回合：使用牌至少指定三次自己为目标，则你可以令一名其他角色的所有技能失效，然后其获得${get.poptip("zhijian")}和${get.poptip("guzheng")}，直到其下回合结束；使用牌至少指定三次一名其他角色为目标，则你可以令其所有技能失效，然后其获得${get.poptip("reyingzi")}和${get.poptip("refanjian")}，直到其下回合结束。然后若你两项均执行，你获得${get.poptip("rezhiheng")}直到你的下个回合结束。`,
  dc_noname: "无名",
  dcchushan: "出山",
  dcchushan_info: "锁定技，游戏开始时，你获得两个武将的各一个技能，并将你的武将名改为这两个武将的名字组合。",
  wuhujiang: "五虎",
  wuhujiang_ab: "魂五虎",
  wuhujiang_prefix: "魂",
  olhuyi: "虎翼",
  olhuyi_info: "①游戏开始时，你从随机三个五虎将技能中选择一个获得。②当你使用或打出一张基本牌后，若你因此技能获得的技能数小于5，你随机获得一个技能描述中包含此牌名的五虎将技能。③回合结束时，你可以失去一个以此法获得的技能，然后你观看牌堆顶三张牌并获得其中一张。",
  liuxiecaojie: "刘协曹节",
  dcjuanlv: "眷侣",
  dcjuanlv_info: "当你使用牌指定异性角色为目标后，你可以令其选择一项：①弃置一张手牌；②令你摸一张牌。",
  dcqixin: "齐心",
  dcqixin_info: "转换技。①出牌阶段，你可以将性别变更为：阳，曹节--女；阴，刘协--男。②当你即将死亡时，你取消之并将性别变更为〖齐心①〗的转换状态，将体力调整至此状态的体力，然后你本局游戏不能发动〖齐心〗。",
  dcqixin_faq: "关于齐心",
  dcqixin_faq_info: "<br>〖齐心①〗的两种状态各拥有初始体力上限的体力值，初始状态为“刘协--男”，且两种状态的体力值分别计算。",
  ol_jsrg_caocao: "汉曹操",
  ol_jsrg_caocao_prefix: "汉",
  oldingxi: "定西",
  oldingxi_info: "当你不因〖定西〗使用伤害牌进入弃牌堆后，你可以对上家使用其中一张伤害牌，然后将使用的牌置于武将牌上。结束阶段，你摸X张牌（X为你的“定西”牌数）。",
  olnengchen: "能臣",
  olnengchen_info: "锁定技，当你受到牌造成的伤害后，若你拥有与此牌牌名相同的“定西”牌，则你随机获得其中一张。",
  olhuojie: "祸结",
  olhuojie_info: "锁定技，出牌阶段开始时，若X大于游戏人数，则你进行X次【闪电】判定直到以此法受到伤害（X为你的“定西”牌数）；然后若你因此受到了伤害，则你获得所有“定西”牌。",
  jiangziya: "姜子牙",
  xingzhou: "兴周",
  xingzhou_info: "每回合限一次，手牌数最少的角色受到伤害后，你可以弃置两张手牌，视为对伤害来源使用一张【杀】；若其因此死亡，你令〖列神〗视为未发动过。",
  lieshen: "列神",
  lieshen_info: "限定技，出牌阶段，你可以令一名角色将体力值和手牌数调整至游戏开始时。",
  shengongbao: "申公豹",
  zhuzhou: "助纣",
  zhuzhou_info: "每回合限一次，手牌数最多的角色造成伤害后，你可以令其获得受伤角色的一张手牌。",
  yaoxian: "邀仙",
  yaoxian_info: "出牌阶段限一次，你可以令一名角色摸两张牌，然后其须对你指定的另一名其他角色使用【杀】，否则其失去1点体力。",
  nanjixianweng: "南极仙翁",
  xwshoufa: "授法",
  xwshoufa_info: `出牌阶段，你可以展示并将所有♠/♥/♣/♦花色的手牌交给一名其他角色，令其获得${get.poptip("tiandu")}/${get.poptip("retianxiang")}/${get.poptip("reqingguo")}/${get.poptip("new_rewusheng")}直到你的下个回合开始。`,
  fuzhao: "福照",
  fuzhao_info: "一名角色进入濒死状态时，你可以令其进行一次判定，若结果为♥，其回复1点体力。",
  weiqing: "卫青",
  dcbeijin: "北进",
  dcbeijin_info: "出牌阶段，你可以摸一张牌（此牌使用时无次数限制）。若如此做，本回合你下次使用牌或发动此技能时，若你的手牌中有以此法得到的牌，则你失去1点体力。",
  ol_jsrg_lvbu: "吕布",
  ol_jsrg_lvbu_ab: "战神吕布",
  olfengzhu: "逢主",
  olfengzhu_info: "锁定技。准备阶段，你选择一名未记录的其他男性角色，记录其为“义父”。然后摸其体力值张牌。",
  olyuyu: "郁郁",
  olyuyu_info: "锁定技，回合结束时，你令一名“义父”角色获得1枚“恨”标记。你于其回合内受到1点伤害或失去一张牌后，其获得1枚“恨“标记。",
  ollbzhiji: "掷戟",
  ollbzhiji_info: `锁定技。当你使用牌指定“义父”角色为目标时，若此牌为非伤害牌，你进行X次判定，若判定结果为：装备牌，你获得${get.poptip("shenji")}；【杀】或【决斗】，你获得${get.poptip("wushuang")}和判定牌。否则，此牌伤害+X并移除其所有“恨”标记（X为其“恨”标记数）。`,
  oljiejiu: "戒酒",
  oljiejiu_info: `锁定技。①你不能使用【酒】。②你可以将【酒】当作除【酒】外的任意基本牌使用。③游戏开始时，你令所有其他女性角色将其武将牌上随机一个技能替换为${get.poptip("lijian")}。`,
  shi_cenhun: "岑昏",
  shi_cenhun_ab: "食岑昏",
  dcbaoshi: "暴食",
  dcbaoshi_info: "摸牌阶段结束时，你可以亮出牌堆顶的两张牌。若亮出牌的牌名字数之和小于等于10（【桃】或【酒】不计入牌名字数统计），你选择一项: 1、获得所有亮出的牌; 2、再亮出一张。",
  dcxinggong: "兴功",
  dcxinggong_info: "出牌阶段限一次，你可以选择本回合进入弃牌堆的任意张牌获得。然后若X大于0，则你受到X点伤害（X为你本次获得的牌数-你的体力值）。",
  ol_nianshou: "普通年兽",
  ol_nianshou_ab: "年兽",
  ol_zishu: "子鼠",
  ol_chouniu: "丑牛",
  ol_yinhu: "寅虎",
  ol_maotu: "卯兔",
  ol_chenlong: "辰龙",
  ol_sishe: "巳蛇",
  ol_wuma: "午马",
  ol_weiyang: "未羊",
  ol_shenhou: "申猴",
  ol_youji: "酉鸡",
  ol_xugou: "戌狗",
  ol_haizhu: "亥猪",
  olsuichong: "岁祟",
  get olsuichong_info() {
    let cost;
    try {
      cost = !_status?.connectMode && game?.changeCoin;
    } catch (error) {
      cost = void 0;
    }
    return "①游戏开始时，你发起一次“拼手气”红包；②每局游戏限三次，准备阶段，你可以" + (cost ? "消耗10金币并" : "") + "发起一次“拼手气”红包。运气最好的角色从三个生肖兽技能中选择一个令你获得（覆盖之前你以此法获得的生肖兽技能）。";
  },
  olshouhun: "兽魂",
  olshouhun_info: "锁定技。①摸牌阶段你额外摸[0]张牌，你的手牌上限+[1]，你的体力上限+[2]。②当你受到伤害时，你令此技能数值最低的一项数值+1（每项数值至多为4）。",
  olzishu: "子鼠",
  olzishu_info: "出牌阶段限一次，你可以获得手牌数大于你的其他角色一张手牌，然后你可以重复此流程直到你的手牌数为全场最多。",
  olchouniu: "丑牛",
  olchouniu_info: "锁定技，一名角色的结束阶段，若你的体力值为全场最低，则你回复1点体力。",
  olyinhu: "寅虎",
  olyinhu_info: "出牌阶段每种类别限一次，你可以弃置一张牌，然后对一名其他角色造成1点伤害。若有角色因此进入濒死状态，则此技能于本回合失效。",
  olmaotu: "卯兔",
  olmaotu_info: "锁定技，一名角色的濒死状态结算完毕后，你不能成为体力值大于等于你的其他角色使用牌的目标直到下个回合开始。",
  olchenlong: "辰龙",
  olchenlong_info: "出牌阶段限一次，你可以失去至多2点体力，对一名其他角色造成等量伤害。若你因此进入濒死状态，则你减1点体力上限。",
  olsishe: "巳蛇",
  olsishe_info: "当你受到伤害后，你可以对伤害来源造成等量伤害。",
  olwuma: "午马",
  olwuma_info: "锁定技。①你不能被翻面。②你的阶段不会被跳过。③当你成为其他角色使用锦囊牌的目标后，你摸一张牌。",
  olweiyang: "未羊",
  olweiyang_info: "出牌阶段限一次，你可以弃置任意张不同类型的牌，然后令至多等量角色回复1点体力。",
  olshenhou: "申猴",
  olshenhou_info: "当你成为【杀】的目标时，你可以进行判定，若结果为红色，则此【杀】对你无效。",
  olyouji: "酉鸡",
  olyouji_info: "锁定技，摸牌阶段，你多摸X张牌（X为游戏轮数且至多为5）。",
  olxugou: "戌狗",
  olxugou_info: "锁定技。①红色【杀】对你无效。②你使用红色【杀】无距离限制且造成的伤害+1。",
  olhaizhu: "亥猪",
  olhaizhu_info: "锁定技。①其他角色的黑色牌因弃置而置入弃牌堆后，你获得这些牌。②准备阶段，若你的手牌数为全场最多，你失去1点体力。",
  hanshiwuhu: "五虎",
  hanshiwuhu_ab: "韩氏五虎",
  hanshiwuhu_prefix: "韩氏",
  oljuejue: "玨玨",
  oljuejue_info: "锁定技，你本局游戏首次使用【杀】/【闪】/【桃】/【酒】时，此牌伤害或回复值+1且不计入次数限制，结算后，你获得此牌。",
  olpimi: "披靡",
  olpimi_info: "你使用牌指定其他角色为唯一目标后，或成为其他角色使用牌的唯一目标后，你可以弃置使用者一张牌，令此牌伤害或回复值+1。然后若使用者的手牌最多或最少，你摸一张牌且此技能本回合失效。",
  ol_xiahouen: "OL夏侯恩",
  ol_xiahouen_prefix: "OL",
  olyinfeng: "引锋",
  olyinfeng_info: `锁定技。①游戏开始时，你获得一张${get.poptip("chixueqingfeng")}。②当${get.poptip("chixueqingfeng")}因弃置进入弃牌堆后，你失去1点体力并获得之。③当你的手牌被其他角色获得后，若你的手牌中有${get.poptip("chixueqingfeng")}，你对其造成1点伤害；若其本次获得的牌中有${get.poptip("chixueqingfeng")}，其对你造成1点伤害。`,
  olfulu: "负掳",
  olfulu_info: "①你使用【杀】结算后，你可以交给其中一名目标角色一张手牌，然后获得其至多两张手牌。②体力小于你的角色使用【杀】结算后，若此【杀】的目标包括你，其可以交给你一张手牌，然后获得你至多两张手牌。",
  tianji: "田忌",
  dcweiji: "围计",
  dcweiji_info: "当你使用牌指定其他角色为目标后，你可以从1-3中选择一个数字，然后令一名其他目标角色从1-3中选择一个数字，若你与其选择的数字不同，则你摸你选择数字张牌。",
  dcsaima: "赛马",
  dcsaima_info: "当你使用坐骑牌后，你可以选择一名其他角色，与其进行三次拼点，若你至少赢两次，则你对其造成1点伤害。",
  yuanshaoyuanshu: "烈袁绍袁术",
  yuanshaoyuanshu_prefix: "烈",
  yuanshaoyuanshu_shao: "袁绍",
  yuanshaoyuanshu_shu: "袁术",
  dclieti: "烈悌",
  dclieti_info: "锁定技，游戏开始时，你获得两组初始手牌并增加武将名称标记；当你获得手牌时，根据当前武将为手牌增加武将名标记。你只能使用或打出当前武将标记的手牌。非当前武将标记的手牌不计手牌上限。",
  dcshigong: "世公",
  dcshigong_info: "锁定技，你每回合使用的第一张手牌不受〖烈悌〗限制，然后此牌结算后你切换为对应标记的武将。若你因此切换为袁绍，你视为使用一张【万箭齐发】；若你因此切换为袁术，你摸两张牌。",
  dcluankui: "乱魁",
  dcluankui_info: "你每回合第二次造成伤害后，可以弃置一张「袁绍」牌令自己本回合下次造成的伤害翻倍；你每回合第二次获得牌后，可以弃置一张「袁术」牌令自己本回合下次摸牌翻倍。",
  taipingsangong: "张角三兄弟",
  oltiangong: "天公",
  oltiangong_info: `锁定技，回合开始时，你视为使用一张${get.poptip("leigong")}；回合结束时，你视为使用一张${get.poptip("younan")}。一名角色判定后，若为黑桃，你对另一名角色造成1点雷电伤害。`,
  oldigong: "地公",
  oldigong_info: "锁定技，你使用没有「地公」的牌时，若为伤害牌，此牌伤害+1，若不为伤害牌，结算后当前回合角色判定，若为红色，你摸一张牌。你获得牌时，标记为「地公」，本轮结束时移去此标记。",
  olrengong: "人公",
  olrengong_info: "锁定技，若你连续使用了两张类型不同的牌，此牌结算后，你弃置一张牌，然后从牌堆获得一张其余类型的牌。",
  strong_caochong: "曹冲",
  strong_caochong_ab: "冲儿",
  strongduanti: "锻体",
  strongduanti_info: "锁定技，①你从牌堆摸牌后，受到1点无来源伤害。②当你发动〖称象〗时，若你的体力值为全场最低，必定亮出一张【桃】或【酒】；若你的体力值为全场最高，必定亮出一张伤害牌或武器牌。",
  strongduanti_append: "<span class='text' style='font-family: yuanli'>我要验牌！</span>",
  stronglianwu: "练武",
  stronglianwu_info: "你使用【杀】指定唯一目标或成为【杀】的唯一目标后，使用者每满足一项便可弃置目标角色的一张牌：1.装备了武器牌；2.此【杀】受到了【酒】的影响。",
  ren_jiangwei: "忍姜维",
  ren_jiangwei_prefix: "忍",
  ren_dengai: "忍邓艾",
  ren_dengai_prefix: "忍",
  renneyan: "讷言",
  renneyan_info: "转换技，锁定技，你使用非装备牌时，阳：弃置一张牌并令此牌额外结算一次，否则此牌无效；阴：此牌无次数限制。",
  renqianyao: "潜曜",
  renqianyao_info: "限定技，回合开始时，你可以摸X张牌，视为使用一张【杀】并依次执行前X项：1.此【杀】额外指定一个目标；2.此【杀】伤害+1；3.此【杀】不可被响应。（X为游戏轮数）",
  renhuoluan: "惑乱",
  renhuoluan_info: `出牌阶段限一次，你可以与至多两名其他角色${get.poptip("rule_gongtongpindian")}并记录你的拼点牌，你可将拼点牌更改为任意点数。点数唯一最小的角色视为被参与拼点的其余角色各使用一张【杀】，点数唯一最大的角色摸体力值张牌，若均不为你，你重置〖惑乱〗。`,
  renguxing: "孤星",
  renguxing_info: "限定技，回合开始时，你可以依次执行前X项，从牌堆或弃牌堆中：1.获得〖惑乱〗记录的牌；2.获得与〖惑乱〗记录牌点数花色均相同的所有牌；3.获得与〖惑乱〗记录牌牌名相同的牌。（X为游戏轮数，相同牌名的牌至多获得五张）",
  wild_liru: "狂李儒",
  wild_liru_prefix: "狂",
  olhuaquan: "花拳",
  olhuaquan_info: "锁定技，你使用牌指定其他角色后，为此牌秘密选择一个效果：1.重拳，造成的伤害+1；2.轻拳，使用后你摸一张牌。然后其他目标角色依次猜测你选择的效果。",
  olhuaquan_heavy: "重拳",
  olhuaquan_heavy_bg: "重拳",
  olhuaquan_heavy_info: "造成的伤害+1",
  olhuaquan_light: "轻拳",
  olhuaquan_light_bg: "轻拳",
  olhuaquan_light_info: "使用后你摸一张牌",
  olsanou: "三殴",
  olsanou_info: "锁定技，其他角色受到你的伤害后或猜错〖花拳〗的效果后，你摸一张牌并令其获得一个「击倒」标记。一名角色获得至少3个「击倒」标记后移除此标记并进入“击倒”状态。“击倒”状态的角色始终跳过出牌阶段。角色于“击倒”状态时，有10张牌离开牌堆或进入弃牌堆后，其脱离“击倒”状态。",
  bigsb_dengai: "OL乐邓艾",
  bigsb_dengai_prefix: "OL乐",
  olandu: "暗度",
  olandu_info: `锁定技，你使用一张“${get.poptip({
    id: "andu_yinping",
    name: "阴平",
    type: "character",
    info: "若一张牌的牌名中，第一个字或最后一个字的读音为阴平（一声，如ā、ē、ī），此牌称为“阴平”牌"
  })}”牌结算后，随机获得一名其他角色手牌中的“${get.poptip("andu_yinping")}”牌。`,
  olandu_mark: "阴平",
  olqiqi: "期期",
  olqiqi_info: "每轮限一次，你使用牌指定目标时，若牌名字数不小于你的体力值，你可以摸两张牌并令此牌额外结算一次，然后此牌结算后进行判定：若结果为♥，你减少1点体力上限。",
  you_zhugeliang: "有诸葛亮",
  you_zhugeliang_prefix: "有",
  dcyingyou: "应有",
  dcyingyou_info: `①你的回合开始时、结束阶段、受到伤害后可选择一项执行并摸一张牌：1.随机获得一个五虎将持有的技能；2.将${get.poptip("real_zhuge")}置入装备区；3.获得10吨馒头。②你使用手牌时，可消耗此牌点数吨馒头，令此牌额外结算一次。`,
  real_zhuge: "真·诸葛连弩",
  real_zhuge_info: "你使用【杀】无次数限制，若此【杀】点数小于7，不可被响应。此牌离开装备区后销毁。",
  real_zhuge_skill: "真·诸葛连弩",
  real_zhuge_skill_info: "你使用【杀】无次数限制，若此【杀】点数小于7，不可被响应。",
  ol_le_liushan: "OL乐刘禅",
  ol_le_liushan_prefix: "OL乐",
  oltuoquan: "托权",
  oltuoquan_info: `锁定技，游戏开始时，你令所有其他角色获得${get.poptip("oldianzan")}。准备阶段，你沉迷享乐，失去因〖托权〗获得的技能，然后从“${get.poptip({
    id: "tuoquan_fuchen",
    name: "季汉辅臣",
    type: "character",
    info: "初始为关羽、张飞、赵云、黄忠、姜维、魏延、马谡、张翼。全部移去后获得蒋琬、费祎。"
  })}”中选择两位上阵，获得这些武将牌上的所有技能（觉醒技、限定技除外）。`,
  oltuoquan_info_doudizhu: `锁定技，游戏开始时，你令所有农民获得${get.poptip("oldianzan")}。准备阶段，你沉迷享乐，失去因〖托权〗获得的技能，然后从“${get.poptip({
    id: "tuoquan_fuchen",
    name: "季汉辅臣",
    type: "character",
    info: "初始为关羽、张飞、赵云、黄忠、姜维、魏延、马谡、张翼。全部移去后获得蒋琬、费祎。"
  })}”中选择两位上阵，获得这些武将牌上的所有技能（觉醒技、限定技除外）。`,
  oldianzan: "点赞",
  oldianzan_info: "点击此技能为刘禅助力。",
  olxianglv: "相旅",
  olxianglv_info: `锁定技，游戏开始时，你将牌堆中不同牌名的基本牌各一张置于武将牌上。你每上阵一名“${get.poptip("tuoquan_fuchen")}”，随机获得其中一张基本牌。`,
  olanle: "安乐",
  olanle_info: `锁定技，你受到伤害后，移去上阵的“${get.poptip("tuoquan_fuchen")}”，然后与当前回合角色各摸一张牌。若你没有上阵的“${get.poptip("tuoquan_fuchen")}”，你视为拥有${get.poptip("xiangle")}。`,
  bozai: "波仔",
  quanjia: "劝架",
  quanjia_info: "其他角色于其回合内对另一名角色造成伤害后，你可以随机观看伤害来源两张手牌。若其中有【杀】，你对其使用之；若没有【杀】，则下次发动〖劝架〗时观看牌数+1。",
  xiangjiaoduanwu: "香蕉端午",
  xuyuan: "许愿",
  xuyuan_info: "出牌阶段开始时，你可选择一个花色和一个装备的副类别，然后从牌堆中随机将一张满足要求的装备牌置入你的装备区。",
  xiaomian: "笑面",
  xiaomian_info: "当你使用牌时，可以摸X张牌(X为你装备区里与此牌花色相同的牌数）。若如此做，你弃置装备区里的一张牌。",
  tw_dm_quyi: "TW魔麴义",
  tw_dm_quyi_prefix: "TW|魔",
  dmchongqi: "冲骑",
  dmchongqi_info: `每回合限一次，你使用【杀】指定目标后，可以弃置目标角色一张牌。${get.poptip("rule_youji")}：此【杀】伤害+1。`,
  dmfanquan: "反拳",
  dmfanquan_info: `你受到伤害后，可以选择一名其他角色，令其受到1点伤害。${get.poptip("rule_boji")}：其受到X点伤害，本回合你计算与其他角色距离+1（X为你受到的伤害值）。`,
  jm_yuanshu: "集蜜袁术",
  jm_yuanshu_prefix: "集蜜",
  mbjimi: "集蜜",
  mbjimi_info: "锁定技，游戏开始时，所有角色将所有手牌替换为等量张【桃】或【酒】。当有【桃】或【酒】不因使用进入弃牌堆后，你获得一张字数为X的伤害牌(X为本回合【桃】、【酒】进入弃牌堆的张数)。",
  mbmaodie: "冒迭",
  mbmaodie_info: "锁定技，你使用牌后，若造成伤害，你本回合下一次使用的伤害牌需大于此牌字数；每回合限两次，若未造成伤害，你获得一张目标角色的初始手牌。",
  mb_muniu: "手杀木牛流马",
  mb_muniu_prefix: "手杀",
  mbshezi: "摄梓",
  mbshezi_info: "锁定技，准备阶段，你选择一名角色并选择其一个区域，若其此区域里有装备牌，你获得其此区域里的所有牌。",
  mbyixing: "易型",
  mbyixing_info: "出牌阶段限一次，你可将所有“器”置入弃牌堆并摸等量的牌，然后你可将任意张装备牌置于你的武将牌上，称为“器”。你拥有“器”的所有效果。",
  mb_dilu_prefix: "手杀",
  mb_dilu: "手杀的卢",
  mbyuetan: "跃檀",
  mbyuetan_info: "与你距离1以内的角色成为伤害牌的目标后，你可交给其一张牌，此牌结算结束后，若其未受到伤害，你摸一张牌。你每以此法失去两张牌，你回复1点体力。",
  mb_jueying_prefix: "手杀",
  mb_jueying: "手杀绝影",
  mbjiguan: "骥冠",
  mbjiguan_info: "锁定技，游戏开始时，你将所有坐骑牌移出游戏；你的手牌上限+2。",
  mbzhengpeng: "征蓬",
  mbzhengpeng_info: "一名角色的回合结束后，你可选择一名符合条件的角色并失去X点体力（X为此前本轮本技能发动次数），其于本回合内每满足一项，你摸一张牌：受到过伤害，失去过装备牌，非当前回合角色且获得过牌。乘势：重置本技能的X，然后你获得弃牌堆中每种类型的牌各一张。",
  mb_chitu_prefix: "手杀",
  mb_chitu: "手杀赤兔",
  mbjunkui: "骏魁",
  mbjunkui_info: "锁定技，游戏开始时，你将所有坐骑牌移出游戏；你使用【杀】的次数上限+1。",
  mbchiyuan: "驰原",
  mbchiyuan_info: "你每回合使用的第一张【杀】无距离限制且需要额外使用一张【闪】响应。出牌阶段限一次，你可摸X张牌（X为当前连续被使用的红色牌数）。",
  tizhongzhishen: "体重之神",
  dcgunyuan: "滚圆",
  dcgunyuan_info: "锁定技，①你每轮首次进入濒死时将体力值回复至1点并增加1点体力上限（至多+3）；②你的手牌上限等于你的体力上限。",
  dczuandai: "钻袋",
  dczuandai_info: "你的出牌阶段开始时，你可以从牌堆或弃牌堆随机使用一张装备牌并摸一张牌，然后立即结束出牌阶段。",
  keaizhishen: "可爱之神",
  dcmaimeng: "卖萌",
  dcmaimeng_info: "你的体力值变化后，你可选择一项执行：1.摸X张牌并防止你本回合下次受到的伤害；2.令一名其他角色交给你X张牌且其本回合使用的下一张牌无效（X为本回合此技能发动次数）。",
  weiquzhishen: "委屈之神",
  dcweiqu: "委屈",
  dcweiqu_info: "每回合限两次，你成为实体牌的唯一目标时，可选择一项执行：1.弃置装备区所有牌并令此牌无效，2.弃置所有手牌并摸等量牌。（当你在一回合内执行过不同的两项结算完成时，你摸两张牌）。",
  juezezhishen: "抉择之神",
  dchuibian: "慧辨",
  dchuibian_info: "出牌阶段，你可选择两名角色各一张手牌并猜测这两张牌颜色是否相同，若你猜对，你获得并展示这两张牌；若你猜错，你弃置这两张牌且此技能失效至本回合结束。",
  bianhuanzhishen: "变幻之神",
  dcbaibian: "百变",
  dcbaibian_info: "你的回合开始或受到伤害后，随机获得一个喵喵杀中的武将技能直到你的回合结束。",
  shuimianzhishen: "睡眠之神",
  dckeshui: "瞌睡",
  dckeshui_info: "你的回合限一次，你的每个阶段开始时你可跳过此阶段（准备与结束阶段除外），然后你使用牌堆顶一张牌，此牌结算后对随机一个目标额外结算一次，若此牌不可使用，你获得此牌并跳过本回合你的下个阶段且可再次发动此技能。",
  nizhuanzhishen: "逆转之神",
  dcfanzhuan: "反转",
  dcfanzhuan_info: "每轮限一次，每个回合开始时，你可以将你的体力值调整为已损失体力值并摸变化值张牌。",
  dcniyun: "逆运",
  dcniyun_info: "锁定技，你的攻击范围，使用杀次数均+X（X为你已损失体力值）。",
  meituizhishen: "美腿之神",
  dcshentui: "伸腿",
  dcshentui_info: "出牌阶段限一次，你可令你的攻击范围+1并视为使用一张【杀】，你使用点数小于攻击范围的【杀】不限次数且不可响应，使用点数大于攻击范围的【杀】不限距离且伤害+1。",
  dcxurui: "蓄锐",
  dcxurui_info: "锁定技，你的回合结束时，若你本回合未造成伤害，你摸攻击范围张牌（至多为5）。",
  gongbaiwan: "宫百万",
  dchaoshi: "好食",
  dchaoshi_info: "你造成或受到伤害后，你摸一张牌并将一张牌置于武将牌上，每回合结束时，若你武将牌上的牌点数总计大于等于100，你获得一个额外回合并获得这些牌。",
  ol_le_zhugeliang: "乐诸葛亮",
  ol_le_zhugeliang_prefix: "乐",
  oljiangwu: "讲武",
  oljiangwu_info: "锁定技，首轮开始时，你选择三个价值不同的“战法”获得。若如此做，接下来的每轮结束后，你进行一次消耗“虎符”的“战法”选择。每名角色的回合结束时，你获得1枚“虎符”。",
  olxinghan: "兴汉",
  olxinghan_info: `限定技，出牌阶段，你可失去任意个战法，然后你购买的下等量个战法不消耗虎符，且你每以此法失去一个战法，依次获得以下一个专属战法：${get.poptip("zf_dongfeng")}、${get.poptip("zf_qiaoqi")}。`,
  ol_re_nianshou: "年兽",
  olsuizhong: "岁终",
  ...(() => {
    const info = "锁定技，当你每回合首次受到伤害后，若你的体力值小于等于1，则你回复1点体力，然后弃置所有敌方角色一张牌。";
    return {
      olsuizhong_info: info,
      olsuizhong_info_identity: info.replace("敌方", "其他")
    };
  })(),
  olnianyi: "年裔",
  ...(() => {
    const info = "锁定技。①你使用牌无距离限制。②准备阶段，你随机弃置判定区的两张牌。③其他角色的回合结束后，若你本回合失去过至少三张牌，则你对所有敌方角色各造成1点伤害。";
    return {
      olnianyi_info: info,
      olnianyi_info_identity: info.replace("敌方", "其他")
    };
  })(),
  olfuyou: "福佑",
  olfuyou_info: "锁定技。①你使用红色普通锦囊牌额外结算一次。②每回合限一次，你使用红色普通锦囊牌造成伤害后，你摸一张牌。",
  tw_dm_zhouyu: "TW魔周瑜",
  tw_dm_zhouyu_prefix: "TW|魔",
  yiran: "易燃",
  yiran_info: "锁定技，你受到的火焰伤害+1。"
};
const characterTitles = {
  //注：此包武将称号多取自于线下制图，可能存在版本差异，线上暂无较统一的版本称号或暂缺）
  ol_niuma: "天选牛马",
  xiangxue_liushan: "学海无涯",
  haoxue_lvmeng: "学海无涯",
  boxue_caochong: "学海无涯",
  natu_guanyu: "义薄云天",
  natu_zhaoyun: "长坂救主",
  natu_zhugeliang: "鞠躬尽瘁",
  tw_dm_zhouyu: "魔气纵横",
  jm_yuanshu: "基米",
  //我说得有基米精神
  mb_muniu: "自行奇甲",
  mb_chitu: "烈火流霞",
  mb_dilu: "绝境飞虹",
  mb_jueying: "逐电无痕",
  ol_le_zhugeliang: "大汉荣光",
  ol_le_caopi: "大胃袋",
  meituizhishen: "气球",
  gongbaiwan: "孟加拉白虎",
  nizhuanzhishen: "奶米",
  shuimianzhishen: "七七",
  bianhuanzhishen: "五花肉",
  juezezhishen: "超级无敌大开门",
  weiquzhishen: "咣当",
  keaizhishen: "泡芙",
  tizhongzhishen: "唠唠叨叨",
  bozai: "哈基米",
  xiangjiaoduanwu: "南北绿豆",
  tw_dm_quyi: "暗月魔潮",
  old_lingju: "艳艳无双",
  //铜雀台用的皮肤称号
  sp_fuwan: "如蹈汤火",
  sp_fuhuanghou: "暗夜密见",
  sp_jiben: "疴龙如鸩",
  sp_mushun: "罹刑不屈",
  libai: "青莲居士",
  sunwukong: "斗战胜佛",
  longwang: "群龙之首",
  taoshen: "怒涛惊天",
  sunyang: "逐浪追风",
  yeshiwen: "出水青莲",
  xiaoyuehankehan: "硬核狠人",
  zhutiexiong: "国风变装",
  wu_zhutiexiong: "国风变装",
  dc_caocao: "魏武帝",
  dc_liubei: "乱世的枭雄",
  dc_sunquan: "年轻的贤君",
  nezha: "三壇海会大神",
  dc_sunce: "双剑合璧",
  dc_zhaoyun: "高达一号",
  dc_wuyi: "吴懿不在此地",
  quyuan: "楚辞之祖",
  xin_sunquan: "牌堆的掌控者",
  wuhujiang: "蜀汉之魂",
  liuxiecaojie: "缘夜同心",
  ol_jsrg_caocao: "汉征西将军",
  jiangziya: "武庙主祭",
  shengongbao: "道友留步",
  nanjixianweng: "阐教真君",
  weiqing: "决北锋驰",
  ol_jsrg_lvbu: "双戟镇斗",
  shi_cenhun: "锁北别西",
  ol_nianshou: "凶兽",
  ol_re_nianshou: "凶兽",
  ol_zishu: "十二生肖",
  ol_chouniu: "十二生肖",
  ol_yinhu: "十二生肖",
  ol_maotu: "十二生肖",
  ol_chenlong: "十二生肖",
  ol_sishe: "十二生肖",
  ol_wuma: "十二生肖",
  ol_weiyang: "十二生肖",
  ol_shenhou: "十二生肖",
  ol_youji: "十二生肖",
  ol_xugou: "十二生肖",
  ol_haizhu: "十二生肖",
  hanshiwuhu: "上阵父子兵",
  ol_xiahouen: "长坂坡剑神",
  dc_noname: "和光同尘",
  tianji: "桂马伏枭",
  yuanshaoyuanshu: "同室操戈",
  taipingsangong: "太平鬼道",
  strong_caochong: "端阳撼象",
  ren_jiangwei: "剑隐麟心",
  ren_dengai: "陇塞衔霜",
  wild_liru: "敕君狂拳"
};
const characterIntro = {
  boxue_caochong: "曹冲生而博学，凤怀慧性；临事持重，不类常童。少擅巧思，明于事理；观物知变，处事宜缓。以舟量象，妙解称重之难；从容论事，深合曹操之意。博闻强识而不骄，智计过人而不傲。处稚子之龄，有成人之量，见称于时，名动左右。",
  haoxue_lvmeng: "吕蒙秉性刚毅，发愤勤学；穷涉经史，焕然改观。弃武夫之浅见，慕圣贤之深谋；昼理军务，夜诵诗书。遍阅史传，胸藏万千韬略；久研兵策，履蕴决胜机谋。向学以诚而不懈，穷涉以广而不疏。易匹夫之刚勇，成国士之风仪，功著荆州，名垂三国。",
  xiangxue_liushan: "刘禅凤怀学志，意欲致用；居尊秉政，行止多疏。早聆相试，常怀治国之念；久处深宫，少明济世之方。徒诵先贤之训，未施治乱之谋；空存守业之心，罕有兴邦之举。想学存志而不笃，致用乏术而难施。继昭烈之遗绪，守巴蜀之旧疆，身托安乐，名留后章。",
  natu_zhaoyun: "白马银枪，一身是胆，赵云兔是蜀兔家最靠谱的王牌。那年长坂坡上，赵云兔拎着本命长枪开启孤勇单刷模式。七次疯狂贴脸输出，最终完成极限护镖。一生执着于割草，物理超度刺猬家无数高手。他用极致的烈，捍卫了蜀兔家的威严！",
  natu_guanyu: "红脸美髯，自带傲娇特效。关羽兔一生最爱唯二：飙车和耍刀。曾骑着赤兔号千里狂飙，一举让五关安全员集体下班；去鼠酱家单刀吃席，转头又给刺猬家送上泡汤全家桶。战功会被岁月磨平，但有些东西不会，比如那份认准了就不回头的义。",
  natu_zhugeliang: "那年乱世，诸葛亮兔手握最弱剧本，却玩出最燃逆袭。摇羽扇，定天下，联合江东鼠酱，一举击碎刺猬家的野心。草船借箭是他的腹黑，六出祁山是他的执念。即便最后一刻血条见底，他也从未放弃。这只傲骨免子，用一生擦亮了蜀兔家的招牌！",
  mb_chitu: "赤兔，并州传奇战斗模板，吕布亲签限定款“赤焰兔兔”！虎牢关单刷三英后激活“无双认证协议”，非武神级斗魂无法开机。布殁后自动转入传奇封存模式，被各路诸侯供为“武力计量原机”。主打人中龙凤，机中赤兔；非神不驭，见驾如晤。",
  mb_dilu: "的卢，荆襄重氪顶配机甲，蜀汉颜值战力双天花板！自带阴间妨主BUG，历任机师必翻车，坠涧遇伏一条龙，无一幸免。全三国机甲榜常年霸榜，却轻易无人敢碰的随机彩蛋款。主打实力封神，全靠命硬；名声在外，有市无驾!",
  mb_jueying: "绝影，曹魏影系SSS级机甲，曹老板私人定制极速护卫款！暗影涂层+闪避挂双开，极限通过宛城地狱副本测试的史诗级绝版机甲。宛城一役，燃命成神，名列曹魏忠烈榜榜首。主打此身如电，光阴逆斩；影系快递，使命必达!",
  mb_muniu: "木牛流马，“诸葛矩阵”首款概念机甲，北伐特供限量款。搭载反重力机核与自适应负重协议，攀岩涉水不在话下。司马懿技术组拆机八百次，无一成功，直接沦为三国军工圈年度笑柄。主打蜀械黑箱，黄牛噩梦；孔明造物，物理超度。",
  jm_yuanshu: "集蜜袁术，淮南纯血干饭哈基米，乱世顶级馋蜜显眼包。出身四世三公豪华配置，手握玉玺王炸底牌，却偏把争霸剧本变成了《败家一百零一式》。打仗？不存在的！正经军阀谁随身带蜜罐啊喂！最终众叛亲离、家底败光，还不忘捶床大叫: “蜜呢！我的蜜呢！”主打一个人菜瘦还大，死了都要甜。",
  taipingsangong: "请分别查看「张角」、「张梁」和「张宝」的武将介绍。",
  yuanshaoyuanshu: "请分别查看「袁绍」和「袁术」的武将介绍。",
  tianji: "田忌，妫姓，田氏，名忌，字子期，陈郡（今河南淮阳县）人。战国时期齐国名将，封地于徐州（今山东滕州市），故又称徐州子期。出身贵族，赏识孙膑的才能，收为门客，参加赛马活动。参加桂陵之战，听从孙膑的参谋，以“围魏救赵”大胜魏军。参加马陵之战，听从孙膑谋略，采用“减灶之计”，诱杀魏将庞涓。屡立军功，受到国相邹忌陷害，逃亡于楚国，受封江南之地。齐宣王即位，返回齐国，恢复官职。",
  hanshiwuhu: "韩德‌，韩家五虎之首，西凉大将，善使开山大斧，有万夫不当之勇。他膝下有四子：韩瑛、韩瑶、韩琼和韩琪‌，一门并称“韩家五虎”。",
  zishu: "子鼠，十二生肖之一。",
  chouniu: "丑牛，十二生肖之一。",
  yinhu: "寅虎，十二生肖之一。",
  maotu: "卯兔，十二生肖之一。",
  chenlong: "辰龙，十二生肖之一。",
  sishe: "巳蛇，十二生肖之一。",
  wuma: "午马，十二生肖之一。",
  weiyang: "未羊，十二生肖之一。",
  shenhou: "申猴，十二生肖之一。",
  youji: "酉鸡，十二生肖之一。",
  xugou: "戌狗，十二生肖之一。",
  haizhu: "亥猪，十二生肖之一。",
  nianshou: "年兽，又名“年”，是中国民俗神话传说中的恶兽，最早出自清末民初的报刊文章《沪壖话旧录》，为天界一只被锁在石柱上的动物，由紫微星君看管。相传古时候，每到新年之夜就会有凶残的怪兽闯入村落吃人，故名年兽。之后人们发现年兽有三怕，即巨响、红色与火光，于是家家户户每年放爆竹、贴春联、点灯火用以吓跑年兽，这些习惯逐渐成为了过年的习俗。据《金刚钻报·说过年》记载，年兽的外形像狮子和狗的混合体，源于紫微高照年画。《铁报·年兽》中有载年兽体型庞大，头生独角。《大公报·年关考》中称年兽有一身雪白的毛，所到之处出现粉白色足印。《新民晚报·年的故事》之中则称年兽长着双头、四耳和八腿。《人民日报·过年的传说和风俗》提及年兽长着血盆大口。",
  weiqing: "卫青（？－前106年），字仲卿。河东郡平阳县（今山西省临汾市）人。中国西汉时期军事家，民族英雄。汉武帝皇后卫子夫之弟、大司马骠骑将军霍去病之舅。卫青从小为牧童，受尽苦楚。成年后，在平阳公主府中为骑奴。后因卫子夫被选入宫，而受到武帝青睐，被提为建章监、侍中。后迁太中大夫。元光六年（前129年），升任车骑将军，在抵抗匈奴入侵的四路汉军三路均遭失利的情况下，于龙城之战大胜而归，得封关内侯。元朔二年（前127年），率军突袭匈奴，发起河南战役，一举收复河套地区，置朔方郡。因功进封为长平侯。元朔五年（前124年），匈奴分三路大举南下，卫青利用匈奴右贤王傲慢轻敌、麻痹大意的弱点，乘夜奔袭，围追堵杀，又获大胜。战后进拜大将军。次年，两度统领公孙敖等六将军出定襄，重创匈奴单于主力。元狩四年（前119年），与霍去病分兵北伐，在大漠遭遇单于主力，力战破敌，并追逐至赵信城，烧其积粟而还。此战后，匈奴远遁，“漠南无王庭”。卫青因功加拜大司马大将军，与霍去病同掌军政。元封五年（前106年），卫青病故。武帝赐谥号“烈”，允许其陪葬茂陵，并按照阴山形状为其修筑墓冢。卫青虽战功卓著，地位尊崇，但不以权势树党，不干预朝政。他勤恤士卒，颇得人心。一生七次出击匈奴，收取河南地，为汉武帝时期汉朝在汉匈战争中所取得的胜利作出巨大的贡献。其指挥骑兵集团进行沙漠作战的军事实践所反映的军事思想，具有创造性，受到后人重视。",
  liuxiecaojie: "请分别查看「刘协」和「曹节」的武将介绍。",
  dc_noname: " ",
  wuhujiang: "请分别查看「关羽」、「张飞」、「赵云」、「马超」和「黄忠」的武将介绍。",
  quyuan: "屈原（约前340年～前278年），芈姓（一作嬭姓），屈氏，名平，字原，又自云名正则，字灵均，出生于楚国丹阳秭归（今湖北省宜昌市），战国时期楚国诗人、政治家。楚武王熊通之子屈瑕的后代（一说屈氏的来源是西周前期的楚国人屈紃）。屈原少年时受过良好的教育，博闻强识，志向远大。早年受楚怀王信任，任左徒、三闾大夫，兼管内政外交大事。提倡“美政”，主张对内举贤任能，修明法度，对外力主联齐抗秦。因遭贵族排挤诽谤，被先后流放至汉北和沅湘流域。前278年，楚国郢都被秦军攻破后，自沉于汨罗江，以身殉楚国。屈原是中国历史上一位伟大的爱国诗人，中国浪漫主义文学的奠基人，“楚辞”的创立者和代表作家，开辟了“香草美人”的传统，被誉为“楚辞之祖”，楚国有名的辞赋家宋玉、唐勒、景差都受到屈原的影响。屈原作品的出现，标志着中国诗歌进入了一个由大雅歌唱到浪漫独创的新时代，其主要作品有《离骚》《九歌》《九章》《天问》等。以屈原作品为主体的《楚辞》是中国浪漫主义文学的源头之一，对后世诗歌产生了深远影响。成为中国文学史上的璀璨明珠，“逸响伟辞，卓绝一世”。“路漫漫其修远兮，吾将上下而求索”，屈原的“求索”精神，成为后世仁人志士所信奉和追求的一种高尚精神。",
  sunwukong: "孙悟空是中国古典小说《西游记》的主人公，也是中国神话中的民俗神祇之一，明代百回本《西游记》书中最为深入人心的形象之一。《西游记》中的孙悟空本是天地生成的一个石猴，率领群猴在花果山水帘洞过着逍遥自在的日子，后来为学习长生的法术而拜菩提祖师为师，学会了七十二变和筋斗云等绝技。后来他前往东海龙宫夺取如意金箍棒，又大闹地府勾了生死簿，惊动天庭，天庭两次派兵征讨花果山，仍然降他不得，只好请西天如来佛祖前来助阵。如来佛祖以五行山将悟空压在山下五百年。五百年后，悟空在观音菩萨的指点下拜唐僧为师，并跟随唐僧前往西天求取真经。路上唐僧又收了猪八戒、沙和尚两个徒弟，众人在途中斩妖除魔、历经磨难，终于取得真经，修成正果。",
  longwang: "东海龙王，名敖广，是中国古代神话传说中的龙族之王，为“四海龙王”之首，亦为所有水族之王。统治东海之洋，主宰着雨水、雷鸣、洪灾、海潮、海啸等。曾下陷东京、水淹陈塘关（影视设定）。在中国以东方为尊位，按周易来说东为阳，故此东海龙王排第一便是理所应当。常记载于《西游记》《封神演义》《三教搜神大全》等文学典籍。东海龙王居于东海的海底水晶宫（花果山瀑布顺流可直抵龙宫）。虽为司雨之神，但其保持着较大的特殊自由性，人间降雨由其它江河湖井龙王完成，很少需要东海龙王亲自降雨。海洋管辖之权为龙王所有，天庭一般任其自治。",
  taoshen: "涛神，是司掌钱塘江的神，传说其原型为春秋战国时期的吴国大臣伍子胥。伍子胥从楚国投奔吴国，为吴国立下了汗马功劳；但吴王夫差听信太宰伯嚭的谗言，逐渐疏远了伍子胥，最后还赐死了他。伍子胥含冤身亡，十分悲愤，做出了吴国灭亡的预言后自杀。暴怒的夫差下令用皮革包裹住伍子胥的尸身，在五月五日这天丢进钱塘江。百姓可怜伍子胥忠于吴王却遭受惨死，因此将五月五日这一天定为节日，以此纪念伍子胥，这也是端午节的来历之一。",
  libai: "李白（701年2月28日—762年12月），字太白，号青莲居士，祖籍陇西成纪（今甘肃省秦安县），出生于蜀郡绵州昌隆县（一说出生于西域碎叶）。唐朝伟大的浪漫主义诗人，凉武昭王李暠九世孙。<br>为人爽朗大方，乐于交友，爱好饮酒作诗，名列“酒中八仙”。曾经得到唐玄宗李隆基赏识，担任翰林学士，赐金放还，游历全国，先后迎娶宰相许圉师、宗楚客的孙女。唐肃宗即位后，卷入永王之乱，流放夜郎，辗转到达当涂县令李阳冰家。上元二年，去世，时年六十二。<br>著有《李太白集》，代表作有《望庐山瀑布》《行路难》《蜀道难》《将进酒》《早发白帝城》等。李白所作词赋，就其开创意义及艺术成就而言，享有极为崇高的地位，后世誉为“诗仙”，与诗圣杜甫并称“李杜”。",
  sunyang: "孙杨，1991年12月1日生于浙江杭州，男子1500米自由泳世界纪录保持者，男子400米自由泳奥运会纪录保持者。年伦敦奥运会男子400米自由泳、男子1500米自由泳冠军；2016年里约奥运会男子200米自由泳冠军。孙杨是世界泳坛历史上唯一一位男子200米自由泳、男子400米自由泳、男子1500米自由泳的奥运会世锦赛大满贯冠军得主，史上唯一一位男子400米自由泳世锦赛四连冠，唯一一位男子800米自由泳世锦赛三连冠，男子自由泳个人单项金牌数居世界第一。",
  yeshiwen: "叶诗文，1996年3月1日生于浙江省杭州市，中国女子游泳队运动员，女子200米混合泳奥运会纪录保持者。叶诗文是中国泳坛首位集奥运会、长池世锦赛、短池世锦赛、游泳世界杯、亚运会、全运会冠军于一身的运动员，成为中国泳坛首个金满贯。2010年广州亚运会女子200米和400米个人混合泳冠军。2011年上海世界游泳锦标赛女子200米混合泳冠军。2012年伦敦奥运会女子200米混合泳、400米混合泳冠军。2012年伊斯坦布尔短池世锦赛女子200米混合泳冠军。2013年辽宁全运会女子200米、400米混合泳冠军。2016年里约奥运会女子200米混合泳第八名。2017年天津全运会女子200米混合泳冠军。2019年光州世界游泳锦标赛女子200米混合泳亚军、女子400米混合泳亚军。2018年1月30日，当选为浙江省出席第十三届全国人民代表大会代表。2019年7月28日，2019年韩国光州游泳世锦赛，叶诗文以4分32秒07获得亚军。2021年9月19日，叶诗文获得第十四届全国运动会游泳女子4×200米混合泳接力金牌。9月22日，叶诗文获得全运会女子200米个人混合泳银牌。",
  jiben: "吉本（？—218年），东汉末年太医令。建安二十三年春正月，时金祎自以世为汉臣，睹汉祚将移，谓可季兴，乃喟然发愤，遂与太医令本、少府耿纪、司直韦晃、本子邈、邈弟穆等结谋攻许，杀曹公长史王必，南援刘备。后必营，必与典农中郎将严匡讨斩之。在《三国演义》中，吉本在此为吉平或吉太，因字称平，故又唤作吉平。曾参与董承等人刺杀曹操的计划，并企图在为曹操治病时毒死曹操，但被曹操识破而遭处刑。之后其子吉邈和吉穆都参与了由耿纪和韦晃等人所发动的反叛曹操的行动，但都失败被杀。",
  xiaoyuehankehan: '小约翰可汗，知乎答主，<style type="text/css">#xiaoyuehankehan_bilibili:link, #xiaoyuehankehan_bilibili:visited {color:white;}</style><a id="xiaoyuehankehan_bilibili" href="https://space.bilibili.com/23947287" target="_blank">bilibili知识区up主</a>，其视频以介绍冷门国家和名人为主，因其视频极具特色的幽默风格而知名。代表作包括《奇葩小国》系列和《硬核狠人》系列。昵称里的“小约翰”来源于《纸牌屋》里的主角弗朗西斯·厄克特的外号Little John。家乡在内蒙古通辽市，在《奇葩小国》系列视频中，介绍小国面积和人口时，常用通辽市的面积和人口作为计量单位，后简化为T。1T=6万平方公里或287万人（如：阿富汗面积约为64万平方公里，超过10T）。此梗成为该系列视频的特色之一，可汗也因此被称为“通辽可汗”。',
  zhutiexiong: "朱铁雄，福建莆田人，1994年出生，短视频创作者。中国魔法少年的英雄梦，国风变装的热血与浪漫。抖音年度高光时刻作者，国风变装现象级人物。创玩节期间化身三国杀武将，来一场热血变身！",
  nezha: "哪吒是中国神话中的民俗神之一，在古典名著《西游记》《封神演义》等及其衍生作品中也多有登场。传说中，哪吒是托塔天王李靖的第三子。哪吒之母怀胎三年，而哪吒出生之时是一个肉球，李靖惊怒之下，用剑劈开了肉球，而哪吒就在肉球中。哪吒广泛流传于道教以及民间传说中，被称为三坛海会大神、威灵显圣大将军、中坛元帅等，民间俗称“三太子”，又常冠其父姓，称为“李哪吒”。哪吒的原型为佛教护法神“那咤”。在不同作品的设定中，哪吒的师承关系有所不同，比如《封神演义》中，哪吒是太乙真人的弟子、元始天尊的徒孙，而《西游记》之中，哪吒则是释迦牟尼（如来佛祖）的弟子。在传说中，哪吒的形象常被形容为可化作三头六臂（封神之中是三头八臂），使用多种武器战斗。比如，《封神演义》中哪吒使用的武器（法宝）为乾坤圈、混天绫、火尖枪和风火轮等，西游记中是斩妖剑、砍妖刀、缚妖索、降妖杵、绣球儿、火轮儿。而哪吒第一次死后被其师父（太乙真人或如来佛祖）以莲花和莲藕复活。",
  jiangziya: "姜太公（？－前1015年或前1036年），姜姓，吕氏，名尚或望，字子牙（或单呼“牙”），后世称姜子牙、齐太公、师尚父、太公望、吕望、吕尚、姜尚等。籍贯有“东海上”（今山东日照）、河内汲县（今河南卫辉）等不同说法。中国商朝末年军事家、政治家、韬略家、思想家，西周开国元勋。",
  shengongbao: "申公豹是明代神魔小说《封神演义》中的人物，昆仑山玉虚宫元始天尊弟子，其随身佩一宝剑，有法宝开天珠，坐骑是白额虎。<br>申公豹与姜子牙、南极仙翁为阐教同门，然而，其本人性格狂妄自大、心胸狭窄，自诩有几千年的修行而违背元始天尊师命，逆势而为，选择保成汤、扶纣王，与以姜子牙为代表的扶周灭纣立场相悖。<br>申公豹作为《封神演义》中的反面人物，以其蛊惑人心、搬弄是非的形象让人熟知。离开昆仑山后，申公豹四处游说三十六路人马与姜子牙为敌，助纣王攻打西岐，最终，申公豹被元始天尊罚去以身体塞了北海眼，封神时，受封为东海分水将军。",
  nanjixianweng: "南极仙翁，为中国古代神话传说中的仙人，是古典小说及电视剧中衍生出来的名称，在道教典籍中暂未发现有南极仙翁称呼的神仙，其原型是道教著名的神仙“寿星老人”。以居南极，故名。常有鹿、鹤二童为其役使；鹿、鹤、灵芝，俱寿之征也。"
};
const characterFilters = {
  old_lingju(mode) {
    return mode == "identity";
  }
};
const characterInitFilters = {
  dc_zhaoyun(tag) {
    if (tag == "noZhuSkill" && (get.mode() != "doudizhu" || _status.mode != "normal")) {
      return false;
    }
  }
};
const dynamicTranslates = {
  xiangxue(player, skill) {
    const bool1 = player.storage.xiangxue1, bool2 = player.storage.xiangxue2;
    return `锁定技，你每使用${bool1 ? "一" : "两"}张${bool2 ? "" : "未"}使用过的牌名的牌，获得等量个“惘”标记并摸${bool1 ? "两" : "一"}张牌，然后若“惘”数为：6，交换上文中的两个数字；9，删除上文中的未；12，失去此技能。`;
  },
  oldianzan(player) {
    const targets = player.getStorage("oldianzan").filter((target) => target?.isIn());
    let str = "刘禅";
    if (targets?.length) {
      str = targets.map((target) => get.rawName(target.name)).join("、");
      if (targets.length > 1) {
        str += "中的一人";
      }
    }
    return `点击此技能为${str}助力。`;
  },
  renneyan(player) {
    const bool = player.getStorage("renneyan", false);
    let yang = "弃置一张牌并令此牌额外结算一次，否则此牌无效", yin = "此牌无次数限制";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技，锁定技，你使用非装备牌时", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  dcjianxiong(player) {
    return "当你受到伤害后，你可以摸" + get.cnNumber(player.countMark("dcjianxiong") + 1) + "张牌并获得对你造成伤害的牌，然后你令此技能摸牌数+1（至多为5）。";
  },
  dcbenxi(player) {
    const bool = player.storage.dcbenxi;
    let yang = "系统随机检索出一句转换为拼音后包含“wu,yi”的技能台词，然后你念出此台词", yin = "你获得上次所念出的台词对应的技能直到你的下个回合开始；若你已拥有该技能，则改为对其他角色各造成1点伤害";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技，锁定技。当你失去手牌后，", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  dcqixin(player) {
    const banned = player.storage.dcqixin_die;
    if (banned) {
      return '<span style="opacity:0.5">' + lib.translate.dcqixin_info + "</span>";
    }
    const bool = player.storage.dcqixin;
    let yang = "女（曹节）", yin = "男（刘协）";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技。①出牌阶段，你可以将性别变更为：", end = "。②当你即将死亡时，你取消之并将性别变更为〖齐心①〗的转换状态，将体力调整至此状态的体力，然后你本局游戏不能发动〖齐心〗。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  olshouhun(player) {
    const storage = player.storage.olshouhun;
    const str = lib.translate.olshouhun_info;
    if (!storage) {
      return str;
    }
    const regex = /\[\d+\]/g;
    let match, result = str, index = 0;
    while ((match = regex.exec(str)) !== null) {
      if (index < storage.length) {
        result = result.replace(match[0], `[${storage[index]}]`);
      }
      index++;
    }
    return result;
  }
};
const voices = {
  "#boxue1": "何须经难历险，书中自有天地。",
  "#boxue2": "五年读书，三年勤习，年少亦为博士。",
  "#zhizhong1": "治学之要，贵在处事也。",
  "#zhizhong2": "尝闻古人亦有此事，吾可依之解矣。",
  "#zhizhong3": "虽涉世未深，吾亦有所思也。",
  "#boxue_caochong:die": "学习真是，劳心费神呐……",
  "#haoxue1": "开卷有益，主公所言甚是啊。",
  "#haoxue2": "五年征战，三年勤学，方为大将之才。",
  "#haoxue3": "因公废读，实吾愚钝未开啊。",
  "#haoxue4": "悔吾见事之晚，未知治学之要。",
  "#qiongshe1": "得时便读，得闲便思，终有所获。",
  "#qiongshe2": "今吾学已晚，又敢不尽时？",
  "#haoxue_lvmeng:die": "还是吃了，没文化的亏……",
  "#xiangxue1": "学而思之，则朕必不罔矣。",
  "#xiangxue2": "五年罔怠，三年思学，朕当为好学之人。",
  "#xiangxue3": "愈思则愈清，愈学则愈明。",
  "#xiangxue4": "此前所学之事，再思当可行之。",
  "#xiangxue5": "朕早有言在先，此生必能学会。",
  "#zhiyong1": "如今学业终成，朕可大显身手。",
  "#zhiyong2": "相父曾言学以致用，今日朕当理事！",
  "#xiangxue_liushan:die": "还是先睡一觉再学吧……",
  "#oldianbu1": "孟婆汤，尽情地享受吧，倒满吧！",
  "#oldianbu2": "生死簿一翻，牛马今天不一般！",
  "#oljuhun1": "啊，我们打张飞？真的假的？",
  "#oljuhun2": "不是我们害了你啊，是这加班害了你！",
  "#oljuhun3": "哥呀，说两句得了，反正阎王爷也听不见。",
  "#oljuhun4": "骑红马的，你可私藏黑厮？",
  "#oljuhun5": "张翼德，你不要给我们哇哇叫！",
  "#ol_niuma:die": "停！不打了，下班先！",
  "#natuxing1": "每一次谋划，都是为了更好的明天。",
  "#natuxing2": "为了汉室兴复，为了天下九州。",
  "#natufu1": "天下百姓安乐，种花家才会太平。",
  "#natufu2": "为了亲们的太平，我愿穷尽此生。",
  "#natu_zhugeliang:die": "美好的明夫，亲们还要更努力呀。",
  "#natuyi1": "在我种花家，自古以义为先！",
  "#natuyi2": "愿这大义，流传千古。",
  "#natu_guanyu:die": "宁死不折吾志！",
  "#natulie1": "奉劝亲们一句，还是闪开点好。",
  "#natulie2": "想打败我，亲们还是一起上吧。",
  "#natuheng1": "一生为了汉室，一心为了主公。",
  "#natuheng2": "纵有千难万险，这颗心也不会变！",
  "#natu_zhaoyun:die": "身后的亲们，为了汉室继续冲啊！",
  "#olweidai1": "今受汉禅，自为魏真祖！",
  "#olweidai2": "朕没篡汉，这是魏代，大魏代！",
  "#olliangzi1": "葡萄美酒甘于鞠，真定御梨大若拳！",
  "#olliangzi2": "天资文藻，朕岂非梁姿？",
  "#ol_le_caopi:die": "哪有八十，哪有，我就四十！",
  "#dcfanzhuan1": "开！",
  "#dcniyun1": "开！",
  "#dchuibian1": "萝卜！",
  "#dchuibian2": "纸巾！",
  "#dcweiqu1": "喵~",
  "#dcweiqu2": "喵~",
  "#quanjia1": "&%$#@!~&()",
  "#quanjia2": "&%$#@!~&()",
  "#oljiangwu1": "金戈耀长安，复光炎汉，当以武德昭日月。",
  "#oljiangwu2": "铁马临洛水，滚滚烽烟，尽是汉家驿马尘！",
  "#olxinghan1": "三兴之业，试问天下谁可阻？",
  "#olxinghan2": "威加海内兮归故乡，今得猛士兮守四方！",
  "#ol_le_zhugeliang:die": "四百年汉祚得续，哈哈哈哈臣可赴草庐旧约。",
  "#mbjunkui1": "凡驹，退场！",
  "#mbjunkui2": "肉骨凡胎，怎比我钢铁之躯！",
  "#mbchiyuan1": "马力全开，红霆裂空！",
  "#mbchiyuan2": "千里疾驰，瞬息之间！",
  "#mb_chitu:die": "敬公之高义，愿与将军同死！",
  "#mbjiguan1": "纵横宇内，追风绝影！",
  "#mbjiguan2": "钢筋铁骨，力负千钧！",
  "#mbzhengpeng1": "铁甲展开，护其周身！",
  "#mbzhengpeng2": "我来为主公荡平前路！",
  "#mb_jueying:die": "主公，奔赴美好的明天吧！",
  "#mbjiguan_mb_dilu1": "凡间之马，怎能翱翔于天际战场？",
  "#mbjiguan_mb_dilu2": "全力启动，必为主公拿下胜利！",
  "#mbyuetan1": "上跃九天之堑，下渡万仞之渊！",
  "#mbyuetan2": "让这一跃，震惊天地！",
  "#mb_dilu:die": "我果然，妨主了吗… ",
  "#mbshezi1": "成为我的一部分吧! ",
  "#mbshezi2": "一切都围着我运行! ",
  "#mbyixing1": "吾即万用之理! ",
  "#mbyixing2": "万势皆顺，万法皆通! ",
  "#mb_muniu:die": "机能有损，不能为丞相，北伐效力了…… ",
  "#mbjimi1": "归附于朕之人，都有蜜吃！",
  "#mbjimi2": "上等之蜜，当配南北绿豆，岂可草草食之？",
  "#mbjimi3": "啊，此蜜甚是甘甜，让朕精力无限呐！",
  "#mbjimi4": "不汲天下之蜜，何显朕天子之威！",
  "#mbmaodie1": "哈！朕，要闹得天翻地覆！",
  "#mbmaodie2": "敢抢朕的蜜？朕看你是不想活了！",
  "#mbmaodie3": "按理来说，汝这个级别，还无权对朕哈气。",
  "#mbmaodie4": "朕未到耄耋之年，又怎会冒跌行事？",
  "#jm_yuanshu:die": "朕集的蜜哪里去了？",
  "#olmojin1": " 此山是我开，此宝是我财，今日从此过，带着兄弟来！哈哈哈哈……",
  "#olmojin2": " 兄弟此来，嘿嘿……只为钱财，不伤人。",
  "#oldingbao1": " 好宝贝，商周的，九成九新稀罕物！",
  "#oldingbao2": " 挖着了！挖着了！一等一的稀世珍宝！",
  "#ol_le_caohong:die": " 往前走哎，莫回头！",
  "#oltuoquan1": "卿等既尽进忠言，自行斟酌损益便是。",
  "#oltuoquan2": "相父羽扇纶巾在侧，朕如磐石高枕无忧。",
  "#olxianglv1": "相父北伐时植柏于此，今枝繁叶茂恰可蔽日。",
  "#olxianglv2": "朕问垂拱而治，诸卿自决便可。",
  "#olanle1": "耳有丝竹之乐，心无案牍之劳，此真乐事。",
  "#olanle2": "烦恼皆自忧，心宽体自胖，朕深谙此道。",
  "#ol_le_liushan:die": "此间乐，不…思蜀……",
  "#olandu1": "关关难过关关过，阳平今已度，当渡阴平！",
  "#olandu2": "学海行舟指阴平，真日上竿头，否去泰来。",
  "#olqiqi1": "凤兮凤兮，故是一凤。",
  "#olqiqi2": "艾虽不善言辞，最信勤能补拙。",
  "#bigsb_dengai:die": "起家寒门而立功立事，我无憾也……",
  "#olhuaquan1": "避无可避，拳从八方来！",
  "#olhuaquan2": "轻拳打脸，重拳取命！",
  "#olsanou1": "初平元年，第一次在洛阳打自由搏击，便一举夺魁！",
  "#olsanou2": "扫腿直拳十字锁，裸绞肘击断头台！",
  "#wild_liru:die": "点到为止，你已经输了！",
  "#strongduanti1": "饭前蹲一蹲，膂力破万均。",
  "#strongduanti2": "饭后练一练，称象不打颤。",
  "#stronglianwu1": "爱笑的人，运气都不会差！",
  "#stronglianwu2": "这是，爱笑的大哥哥！",
  "#strong_caochong:die": "哎呀！闪到腰了……",
  "#olchengxiang_strong_caochong1": "大象，大象，你过来呀。",
  "#olchengxiang_strong_caochong2": "那我问你，象重几何？",
  "#oltiangong1": "此番受天书教化，当你我兄弟显名之时！",
  "#oltiangong2": "天地人本同一元气，分为三体。你我兄弟亦然。",
  "#oldigong1": "太平气出，今为元气纯纯之时！",
  "#oldigong2": "与道召道，以道求道，以道为兄弟。",
  "#olrengong1": "天父地母，人生象天属天，人卒象地属地。",
  "#olrengong2": "三弟谨记，天封人以道，地封人以养德。",
  "#taipingsangong:die": "大哥二哥，为何当生而不生，当养所不养……",
  "#dcweiji1": "哈哈哈哈哈！庞涓当死于此树之下！",
  "#dcweiji2": "围魏救赵，急袭大梁，攻敌所必救。",
  "#dcsaima1": "便依军师之言，以下驷取彼上驷。",
  "#dcsaima2": "驰马重射，三局两胜，买定离手！",
  "#olyinfeng1": "丞相委我以重任，恩必践以剑在人在！",
  "#olyinfeng2": "这叫青釭剑，等闲之辈可背不起！",
  "#olfulu1": "藏什么呢？快拿出来孝敬本将军！",
  "#olfulu2": "好个无礼的家伙，上来就抢人家宝剑！",
  "#ol_xiahouen:die": "丞相！就是他抢咱们东西！",
  "#oljuejue1": "打虎亲兄弟，上阵父子兵！",
  "#oljuejue2": "你伪汉五虎，可敌不过我韩家五虎！",
  "#olpimi1": "什么？赵云大怒，已经打过来啦？！",
  "#olpimi2": "我韩家五虎出手，必定所向披靡！",
  "#hanshiwuhu:die": "我的儿呀！好你个老匹夫！",
  "#olzishu": "这些牌都归我吧！",
  "#ol_zishu:die": "油米全没了……",
  "#olchouniu": "牛角之歌，自保足矣。",
  "#ol_chouniu:die": "请将我……埋于此地吧……",
  "#olyinhu": "尝尝我的厉害吧！",
  "#ol_yinhu:die": "百兽之王，也有终老……",
  "#olmaotu": "想抓到我？不可能！",
  "#ol_maotu:die": "这灾祸，是躲不过了……",
  "#olchenlong": "龙怒的威力，不是你所能承受的。",
  "#ol_chenlong:die": "龙威不在，龙鳞已落……",
  "#olsishe": "伤我者，一一奉还。",
  "#ol_sishe:die": "我的毒液，失效了……",
  "#olwuma": "有我在，必成功！",
  "#ol_wuma:die": "马有失蹄啊……",
  "#olweiyang": "共享绵泽，同甘共苦。",
  "#ol_weiyang:die": "看不到青草翠绿时……",
  "#olshenhou": "百般变化，真假难辨！",
  "#ol_shenhou:die": "这仙桃，无用了……",
  "#olyouji": "鸡豚之息，虽微渐厚。",
  "#ol_youji:die": "杀鸡取卵，不可取呀……",
  "#olxugou": "驱邪吠恶，遇凶斩杀！",
  "#ol_xugou:die": "不能守护家园了……",
  "#olhaizhu": "这些都归我吧！",
  "#ol_haizhu:die": "啊，果然，还是吃太多了……",
  "#olfengzhu1": "吕布飘零半生，只恨未逢明主，公若不弃，布愿拜为义父。",
  "#olyuyu1": "大丈夫生居天地之间，岂能郁郁久居人下！",
  "#ollbzhiji1": "老贼，我与你势不两立！",
  "#ollbzhiji2": "我堂堂大丈夫，安肯为汝之义子！",
  "#oljiejiu1": "我被酒色所伤，竟然如此憔悴。自今日始，戒酒！",
  "#ol_jsrg_lvbu:die": "刘备！奸贼！汝乃天下最无信义之人！",
  "#olhuyi1": "青龙啸赤月，长刀行千里。",
  "#olhuyi2": "谋取敌将首，声震当阳桥。",
  "#olhuyi3": "游龙战长坂，可复七进七出。",
  "#olhuyi4": "身跨白玉鞍，铁骑踏冰河。",
  "#olhuyi5": "满弓望西北，弦惊夜行之虎。",
  "#wuhujiang1:die": "麦城残阳洗长刀……",
  "#wuhujiang2:die": "当阳空余声……",
  "#wuhujiang3:die": "亢龙有悔……",
  "#wuhujiang4:die": "西风寒，冷铁衣……",
  "#wuhujiang5:die": "年老力衰，不复当年勇……",
  "#dcqiusuo1": "驾八龙之婉婉兮，载云旗之委蛇。",
  "#dcqiusuo2": "路漫漫其修远兮，吾将上下而求索。",
  "#dclisao1": "朝饮木兰之坠露，夕餐秋菊之落英。",
  "#dclisao2": "惟草木之零落兮，恐美人之迟暮。",
  "#quyuan:die": "伏清白以死直兮，固前圣之所厚……",
  "#dcjuejing1": "龙翔九天，曳日月于天地，换旧符于新岁。",
  "#dcjuejing2": "御风万里，辟邪祟于宇外，映祥瑞于神州。",
  "#dclonghun1": "龙诞新岁，普天同庆，魂佑宇内，裔泽炎黄。",
  "#dclonghun2": "龙吐息而万物生，今龙临神州，华夏当兴。",
  "#dc_zhaoyun:die": "酒足驱年兽，新岁老一人……",
  "#dcsantou1": "任尔计策奇略，我自随机应对。",
  "#dcsantou2": "三相显圣，何惧雷劫地火？",
  "#dcfaqi1": "脚踏风火轮，金印翻天，剑辟阴阳！",
  "#dcfaqi2": "手执火尖枪，红绫混天，乾坤难困我！",
  "#nezha:die": "莲藕花开，始知三清……",
  "#dcbianzhuang1": "须知少日凌云志，曾许人间第一流。",
  "#dcbianzhuang2": "愿尽绵薄之力，盼国风盛行。",
  "#zhutiexiong1:die": "那些看似很可笑的梦，是我们用尽全力守护的光……",
  "#zhutiexiong2:die": "愿得此身长报国，何须生入玉门关……",
  "#dctongliao1": "发动偷袭。",
  "#dctongliao2": "不够心狠手辣，怎配江山如画。",
  "#dctongliao3": "必须出重拳，而且是物理意义上的出重拳。",
  "#dcwudao1": "众所周知，能力越大，能力也就越大。",
  "#dcwudao2": "龙争虎斗彼岸花，约翰给你一个家。",
  "#dcwudao3": "唯一能够打破命运牢笼的，只有我们自己。",
  "#xiaoyuehankehan1:die": "留得青山在，老天爷饿不死瞎家雀。",
  "#xiaoyuehankehan2:die": "人的肉体必然会泯灭，但精神会永远存在。",
  "#xiaoyuehankehan3:die": "我闭上眼睛就是天黑~~",
  "#dclbjiuxian1": "地若不爱酒，地应无酒泉。",
  "#dclbjiuxian2": "天若不爱酒，酒星不在天。",
  "#dcshixian1": "鱼水三顾合，风云四海生。",
  "#dcshixian2": "武侯立岷蜀，壮志吞咸京。",
  "#libai1:die": "谁识卧龙客，长吟愁鬓斑……",
  "#libai2:die": "再来一杯吧！",
  "#dcjinjing1": "嗯？有妖气！",
  "#dcjinjing2": "融石为甲，披焰成袍，火眼金睛，踏碎凌霄！",
  "#dccibei1": "生亦何欢，死亦何苦。",
  "#dccibei2": "我欲成佛，天下无魔；我欲成魔，佛奈我何？",
  "#dcruyi1": "俺老孙来也！",
  "#dcruyi2": "吃俺老孙一棒！",
  "#sunwukong:die": "曾经有一整片蟠桃园在我面前，失去后才追悔莫及……",
  "#dclonggong1": "停手，大哥！给东西能换条命不？",
  "#dclonggong2": "冤家宜解不宜结，莫要伤了和气。",
  "#dcsitian1": "观众朋友大家好，欢迎收看天气预报！",
  "#dcsitian2": "这一喷嚏，不知要掀起多少狂风暴雨。",
  "#longwang:die": "三年之期已到，哥们要回家啦……",
  "#dcnutao1": "伍胥怒涛，奔流不灭！",
  "#dcnutao2": "波澜逆转，攻守皆可！",
  "#dcnutao3": "智勇深沉，一世之雄！",
  "#dcnutao4": "波涛怒天，神力无边！",
  "#taoshen:die": "马革裹尸，身沉江心……",
  "#dchuiwan1": "金珠弹黄鹂，玉带做秋千，如此游戏人间。",
  "#dchuiwan2": "小爷横行江东，今日走马、明日弄鹰。",
  "#dchuanli1": "金乌当空，汝欲与我辩日否？",
  "#dchuanli2": "童言无忌，童言有理！",
  "#xin_sunquan:die": "阿娘，大哥抢我糖人！",
  "#oldingxi1": "今天，我曹操誓要踏平祁连山！",
  "#oldingxi2": "饮马瀚海，封狼居胥，大丈夫当如此！",
  "#olnengchen1": "当今四海升平，可为治世之能臣。",
  "#olnengchen2": "为大汉江山鞠躬尽瘁，臣死犹生。",
  "#olhuojie1": "国虽大，忘战必危，好战必亡。",
  "#olhuojie2": "这穷兵黩武的罪，让我一人受便可。",
  "#ol_jsrg_caocao:die": "此征西将军曹侯之墓……"
};
const characterSort = {
  collab_olympic: ["sunyang", "yeshiwen"],
  collab_tongque: ["sp_fuwan", "sp_fuhuanghou", "sp_jiben", "old_lingju", "sp_mushun"],
  collab_duanwu_2023: ["sunwukong", "longwang", "taoshen"],
  collab_decade: ["libai", "xiaoyuehankehan", "zhutiexiong", "wu_zhutiexiong"],
  collab_remake: ["dc_caocao", "dc_liubei", "dc_sunquan", "nezha", "dc_sunce", "dc_zhaoyun", "dc_wuyi", "ren_jiangwei", "ren_dengai"],
  collab_duanwu_2024: ["quyuan"],
  collab_dcdoudizhui: ["you_zhugeliang", "yuanshaoyuanshu", "tianji", "dc_noname", "xin_sunquan", "liuxiecaojie", "weiqing", "shi_cenhun"],
  collab_oldoudizhu: ["ol_le_zhugeliang", "ol_le_caohong", "ol_le_liushan", "bigsb_dengai", "wild_liru", "strong_caochong", "taipingsangong", "wuhujiang", "ol_jsrg_caocao", "ol_jsrg_lvbu", "ol_nianshou", "hanshiwuhu", "ol_xiahouen", "ol_le_caopi", "ol_niuma", "ol_le_menghuo", "ol_chitu"],
  collab_shanhetu: ["ol_re_nianshou"],
  collab_mbdoudizhu: ["tw_dm_zhouyu", "tw_dm_quyi", "jm_yuanshu", "mb_muniu", "mb_chitu", "mb_jueying", "mb_dilu", "natu_zhaoyun", "natu_guanyu", "natu_zhugeliang", "xiangxue_liushan", "haoxue_lvmeng", "boxue_caochong"],
  collab_anime: ["jiangziya", "shengongbao", "nanjixianweng"],
  collab_shengxiao: ["ol_zishu", "ol_chouniu", "ol_yinhu", "ol_maotu", "ol_chenlong", "ol_sishe", "ol_wuma", "ol_weiyang", "ol_shenhou", "ol_youji", "ol_xugou", "ol_haizhu"],
  collab_hajimi: ["bozai", "xiangjiaoduanwu", "tizhongzhishen", "keaizhishen", "nizhuanzhishen", "juezezhishen", "weiquzhishen", "bianhuanzhishen", "gongbaiwan", "shuimianzhishen", "meituizhishen"]
};
const characterSortTranslate = {
  collab_olympic: "OL·伦敦奥运会",
  collab_tongque: "OL·铜雀台",
  collab_duanwu_2023: "新服·端午畅玩2023",
  collab_decade: "新服·创玩节",
  collab_remake: "新服·共创武将",
  collab_duanwu_2024: "新服·端午畅玩2024",
  collab_dcdoudizhui: "新服·限时地主",
  collab_oldoudizhu: "OL·限时地主",
  collab_shanhetu: "OL·山河图",
  collab_mbdoudizhu: "移动版·限时地主",
  collab_anime: "三国杀·动画",
  collab_shengxiao: "三国杀·十二生肖",
  collab_hajimi: "三国杀·喵喵杀"
};
game.import("character", function() {
  return {
    name: "collab",
    connect: true,
    character: { ...characters },
    characterSort: {
      collab: characterSort
    },
    characterSubstitute: {
      zhutiexiong: [["wu_zhutiexiong", ["die:zhutiexiong"]]],
      liuxiecaojie: [["liuxiecaojie_shadow", []]],
      yuanshaoyuanshu: [
        ["yuanshaoyuanshu_shao", []],
        ["yuanshaoyuanshu_shu", []]
      ],
      taipingsangong: [["taipingsangong_ultimate", ["die:taipingsangong"]]],
      ol_re_nianshou: [
        ["ol_re_nianshou_level1", []],
        ["ol_re_nianshou_level2", []]
      ]
    },
    characterFilter: { ...characterFilters },
    characterInitFilter: { ...characterInitFilters },
    characterTitle: { ...characterTitles },
    dynamicTranslate: { ...dynamicTranslates },
    characterIntro: { ...characterIntro },
    card: { ...cards },
    skill: { ...skills },
    translate: { ...translates, ...voices, ...characterSortTranslate },
    pinyins: { ...pinyins }
  };
});
