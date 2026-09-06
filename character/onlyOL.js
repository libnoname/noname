import { lib, game, get, ui, _status } from "noname";
const characters = {
  ol_zhonghui: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["olquanji", "olzili"]
  },
  ol_shen_huangzhong: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["shenyu", "huaren"],
    groupInGuozhan: "shu"
  },
  ol_sb_zhurong: {
    sex: "female",
    group: "shu",
    hp: 4,
    skills: ["olsbrenche", "olsbyalian"],
    names: "null|null"
  },
  ol_liufeng: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["olxiansi", "olqinling"]
  },
  ol_bulianshi: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["olanxu", "olzhuiyi"]
  },
  ol_quancong: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["olyaoming"]
  },
  ol_caoxiu: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["olqianju", "olqingxi"]
  },
  ol_guanping: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["longyin", "oljieyong"]
  },
  dm_zhangfei: {
    sex: "male",
    group: "shu",
    hp: 5,
    skills: ["olzhuohun", "olchenshi"]
  },
  ol_xiahoushi: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["olqiaoshi", "olyanyu"]
  },
  junk_zhangjiao: {
    sex: "male",
    group: "shen",
    hp: 3,
    skills: ["yizhao", "junksijun", "tianjie"],
    groupInGuozhan: "qun",
    dieAudios: ["shen_zhangjiao"]
  },
  shen_sunquan: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["junkyuheng", "junkdili"],
    groupInGuozhan: "wu"
  },
  shen_dianwei: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["juanjia", "qiexie", "cuijue"],
    groupInGuozhan: "wei"
  },
  ol_zhangliao: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["olduorui", "olzhiti"],
    groupInGuozhan: "wei",
    dieAudios: ["shen_zhangliao"]
  },
  shen_caopi: {
    sex: "male",
    group: "shen",
    hp: 5,
    skills: ["chuyuan", "dengji"],
    groupInGuozhan: "wei"
  },
  shen_zhenji: {
    sex: "female",
    group: "shen",
    hp: 3,
    skills: ["shenfu", "qixian"],
    groupInGuozhan: "wei"
  },
  ol_zhangsong: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["olqiangzhi", "olxiantu"]
  },
  ol_jsrg_zhanghe: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olqiongtu", "olxianzhu"],
    doubleGroup: ["wei", "qun"],
    dieAudios: ["jsrg_zhanghe"]
  },
  ol_caojie: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["olshouxi", "olhuimin"]
  },
  ol_re_xinxianying: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["olcaishi", "olzhongjian"]
  },
  ol_sb_dongzhao: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["olsbshunji", "olsbyishi"]
  },
  ol_sb_chengyu: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["olsbliduan", "olsbdanchi"]
  },
  dm_caocao: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["olbachao", "olfuzai"]
  },
  ol_sb_xizhicai: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["olsbxinchuan", "olsbjinjin"]
  },
  dm_sunquan: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["olquanyu", "oltianen", "olqiangang"]
  },
  ol_sb_guojia: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["olsbdinglun", "olsbjieli"]
  },
  ol_re_yujin: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["ol_zhenjun", "ol_yizhong"]
  },
  ol_jsrg_zhujun: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olfendi", "oljuxiang"]
  },
  ol_jsrg_sunjian: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olpingtao", "oljuelie"],
    img: "image/character/jsrg_sunjian.jpg"
  },
  ol_jsrg_zhangliao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olzhengbing", "jsrgtuwei"],
    doubleGroup: ["wei", "qun"],
    dieAudios: ["jsrg_zhangliao"]
  },
  ol_sb_xuyou: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["olsbqianfu", "olsbyushi", "olsbfenchao"]
  },
  ol_sb_lusu: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["olsbduduan", "olsbyinglve", "olsbmengshi"]
  },
  ol_sb_zhugeliang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["olsbzhitian", "olsbwujing", "olsbzhijue"],
    names: "诸葛|亮",
    clans: ["琅琊诸葛氏"]
  },
  ol_sunluban: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["olzenhui", "oljiaojin"]
  },
  dm_lvbu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olduoqi", "olkuangmo", "olgangquan"]
  },
  dm_diaochan: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["olhuanhuo", "olqingshi"],
    names: "null|null"
  },
  ol_guohuanghou: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["oljiaozhao", "oldanxin"],
    names: "郭|null"
  },
  ol_sb_xiaoqiao: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["olmiluo", "oljueyan"],
    names: "桥|null"
  },
  dm_simayi: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["olguifu", "olmoubian"],
    //,"olzhouxi"
    name: "司马|懿"
  },
  ol_madai: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["mashu", "olqianxi"]
  },
  ol_sb_yl_luzhi: {
    sex: "male",
    group: "qun",
    hp: 3,
    maxHp: 4,
    skills: ["olsibing", "olliance"]
  },
  ol_guanzhang: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["olfuhun"],
    names: "关|兴-张|苞"
  },
  ol_jsrg_liuhong: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olchaozheng", "olshenchong", "oljulian"],
    isZhugong: true,
    img: "image/character/jsrg_liuhong.jpg",
    dieAudios: ["jsrg_liuhong"]
  },
  ol_jsrg_zhaoyun: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["ollonglin", "olzhendan"],
    img: "image/character/jsrg_zhaoyun.jpg",
    dieAudios: ["jsrg_zhaoyun"]
  },
  ol_sb_jiaxu: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["olsbwance", "olsbchenzhi", "olsbluanchao"]
  },
  ol_sb_wenchou: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olsblunzhan", "olsbjuejue"]
  },
  ol_sb_zhangrang: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["olsblucun", "olsbtuisheng"],
    trashBin: ["sex:male_castrated"],
    dieAudios: ["3"]
  },
  ol_fuhuanghou: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["rezhuikong", "olqiuyuan"]
  },
  ol_guohuai: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["oljingce"]
  },
  ol_sunxiu: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["reyanzhu", "rexingxue", "xinzhaofu"],
    isZhugong: true
  },
  ol_sb_zhangxiu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olsbchoulie", "olsbzhuijiao"]
  },
  ol_sb_zhaoyun: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["olsbnilan", "olsbjueya"]
  },
  ol_sb_zhangfei: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["olsbjingxian", "olsbxieyong"]
  },
  ol_sb_huangyueying: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["olsblixian", "olsbbingcai"]
  },
  ol_sb_jushou: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["olsbguliang", "olsbxutu"]
  },
  ol_sb_gongsunzan: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olsbjiaodi", "olsbbaojing"],
    names: "公孙|瓒"
  },
  ol_sb_dengai: {
    sex: "male",
    group: "wei",
    hp: 4,
    maxHp: 5,
    skills: ["olsbjigu", "olsbjiewan"]
  },
  ol_sb_dongzhuo: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olguanbian", "olxiongni", "olfengshang", "olzhibin"],
    isZhugong: true,
    dieAudios: ["3"]
  },
  ol_sb_huaxiong: {
    sex: "male",
    group: "qun",
    hp: 6,
    skills: ["olsbbojue", "olsbyangwei"]
  },
  ol_sb_yuanshu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olsbjinming", "olsbxiaoshi", "olsbyanliang"],
    isZhugong: true
  },
  ol_sb_sunjian: {
    sex: "male",
    group: "wu",
    hp: 4,
    maxHp: 5,
    skills: ["olsbhulie", "olsbyipo"]
  },
  ol_sb_jiangwei: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["olsbzhuri", "olsbranji"]
  },
  ol_caozhang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["oljiangchi"],
    dieAudios: ["xin_caozhang"]
  },
  ol_jianyong: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["olqiaoshui", "jyzongshi"],
    tempname: ["re_jianyong"],
    dieAudios: ["re_jianyong"]
  },
  ol_lingtong: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["olxuanfeng"],
    tempname: ["re_lingtong"],
    dieAudios: ["re_lingtong"]
  },
  ol_sb_guanyu: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["olsbweilin", "olsbduoshou"]
  },
  ol_sb_taishici: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["olsbdulie", "olsbdouchan"],
    names: "太史|慈"
  },
  ol_gaoshun: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olxianzhen", "decadejinjiu"],
    dieAudios: ["re_gaoshun"]
  },
  ol_sb_yuanshao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olsbhetao", "olsbshenli", "olsbyufeng", "olsbshishou"],
    dieAudios: ["2"],
    isZhugong: true
  },
  ol_yufan: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["olzongxuan", "olzhiyan"]
  },
  ol_chengpu: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["dclihuo", "olchunlao"],
    tempname: ["xin_chengpu"],
    dieAudios: ["xin_chengpu"]
  },
  ol_wangyi: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["olzhenlie", "olmiji"]
  },
  ol_sb_pangtong: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["olsbhongtu", "olsbqiwu"],
    dieAudios: ["3"]
  },
  ol_fazheng: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["olxuanhuo", "olenyuan"]
  },
  ol_caifuren: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["olqieting", "xianzhou"],
    names: "蔡|null"
  },
  ol_liru: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["oljuece", "olmieji", "dcfencheng"]
  },
  ol_liubiao: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["olzishou", "olzongshi"]
  },
  ol_wuguotai: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["olganlu", "olbuyi"],
    names: "丁|null"
  },
  ol_sb_kongrong: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["olsbliwen", "olsbzhengyi"]
  },
  ol_zhangchunhua: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["jueqing", "shangshi", "oljianmie"]
  },
  ol_caochong: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["olchengxiang", "olrenxin"]
  },
  ol_caozhi: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["reluoying", "oljiushi"]
  },
  ol_liaohua: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["oldangxian", "olfuli"]
  }
};
const cards = {
  chixueren: {
    derivation: "ol_shen_huangzhong",
    cardcolor: "heart",
    type: "equip",
    subtype: "equip1",
    distance: {
      attackFrom: -2,
      attackRange(card, player) {
        if (!player.hasSkill("shenyu", null, false, false)) {
          return 0;
        }
        return 3;
      }
    },
    loseDelay: false,
    cardPrompt(card, player) {
      let str = lib.translate[card.name + "_info"];
      const vcard = card[card.cardSymbol];
      const storage = vcard.storage?.chixueren;
      if (storage?.length) {
        str += `<br><span class="yellowtext"><li>已吞噬技能：${storage.map((i) => get.poptip(i)).join("、")}</span>`;
      }
      return str;
    },
    async onEquip(event, trigger, player) {
      const { card } = event;
      const cards2 = card.cards;
      if (get.is.ordinaryCard(card) && cards2[0].storage?.chixueren?.length) {
        return;
      }
      const lose = player.getHistory("lose", (evt) => {
        return evt.getlx == false && evt.type == "equip" && evt.getParent() == event.getParent() && evt.es?.length > 0;
      })[0];
      const allLose = game.getAllGlobalHistory("cardMove", (evt) => {
        return evt.name == "lose" && evt.getlx == false && evt.type == "equip" && evt.getParent().card.name == "chixueren" && evt.es?.length > 0;
      });
      if (lose && allLose.indexOf(lose) == 0) {
        const skills2 = get.skillsFromEquips(lose.es.filter((card2) => get.subtype(card2) == "equip1"));
        if (!skills2?.length) {
          return;
        }
        const addSkill = (card2) => {
          game.broadcastAll(
            (card3, skills3) => {
              card3.storage ??= {};
              card3.storage.chixueren = skills3;
              if (!Array.isArray(card3.skills)) {
                card3.skills = [...get.info(card3).skills, ...skills3];
              } else {
                card3.skills.addArray(skills3);
              }
            },
            card2,
            skills2
          );
        };
        addSkill(card);
        if (get.is.ordinaryCard(card)) {
          addSkill(cards2[0]);
        }
        player.addEquipTrigger(card);
      }
    },
    async onLose(event, trigger, player) {
      const { cards: cards2 } = event;
      if ((!event.getParent(2) || event.getParent(2).name != "swapEquip") && (event.getParent().type != "equip" || event.getParent().swapEquip)) {
        game.log(cards2, "被销毁");
        await game.cardsGotoSpecial(cards2, false);
        if (event.getParent().type == "gain") {
          event.getParent(2).cards.removeArray(cards2);
        }
      }
    },
    ai: {
      equipValue(card, player) {
        if (!player.hasSkill("shenyu", null, false, false)) {
          return 0;
        }
        return 5;
      },
      basic: { equipValue: 5 }
    },
    skills: ["chixueren_skill"]
  },
  lusu_phaseZhunbei: {
    fullskin: true,
    noname: true
  },
  lusu_phaseJudge: {
    fullskin: true,
    noname: true
  },
  lusu_phaseDraw: {
    fullskin: true,
    noname: true
  },
  lusu_phaseUse: {
    fullskin: true,
    noname: true
  },
  lusu_phaseDiscard: {
    fullskin: true,
    noname: true
  },
  lusu_phaseJieshu: {
    fullskin: true,
    noname: true
  },
  sizhaojian: {
    derivation: "ol_sb_yuanshao",
    cardcolor: "diamond",
    fullskin: true,
    type: "equip",
    subtype: "equip1",
    async onLose(event, trigger, player) {
      const { cards: cards2 } = event;
      if (!lib.card.sizhaojian.inShanShanFestival() && (!event.getParent(2) || event.getParent(2).name != "swapEquip") && (event.getParent().type != "equip" || event.getParent().swapEquip)) {
        cards2.forEach((card) => {
          card.fix();
          card.remove();
          card.destroyed = true;
          game.log(card, "被销毁了");
        });
      }
    },
    inShanShanFestival() {
      const date = /* @__PURE__ */ new Date();
      return date.getMonth() + 1 == 3 && date.getDate() >= 2 && date.getDate() <= 15;
    },
    distance: { attackFrom: -1 },
    ai: { basic: { equipValue: 7 } },
    skills: ["sizhaojian_skill"]
  }
};
const pinyins = {};
const skills = {
  //界钟会
  olquanji: {
    audio: 2,
    trigger: {
      player: "damageEnd",
      source: "damageSource"
    },
    frequent: true,
    locked: false,
    filter(event) {
      return event.num > 0;
    },
    getIndex: (event) => event.num,
    async content(event, trigger, player) {
      await player.draw();
      const target = _status.currentPhase;
      if (!target?.isIn()) {
        return;
      }
      const hs = target.getCards("h");
      if (!hs.length) {
        return;
      }
      const result = hs.length == 1 ? { bool: true, cards: hs } : await target.chooseCard({
        position: "h",
        forced: true,
        prompt: `权计：将一张牌作为“权”置于${get.translation(player)}武将牌上`
      }).forResult();
      if (result?.bool && result?.cards?.length) {
        await player.addToExpansion({ cards: result.cards, source: target, animate: "give", gaintag: [event.name] });
      }
    },
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
    mod: {
      maxHandcard(player, num) {
        return num + player.countExpansions("olquanji");
      }
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      notemp: true,
      threaten: 0.8,
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage") && (player.hasSkill("paiyi") || player.hasSkill("zili"))) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return [1, -2];
            }
            if (!target.hasFriend()) {
              return;
            }
            if (target.hp >= 4) {
              return [0.5, get.tag(card, "damage") * 2];
            }
            if (!target.hasSkill("paiyi") && target.hp > 1) {
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
  olzili: {
    skillAnimation: true,
    animationColor: "thunder",
    audio: 2,
    juexingji: true,
    trigger: {
      global: "phaseZhunbeiBegin"
    },
    forced: true,
    derivation: "olpaiyi",
    filter(event, player) {
      return player.countExpansions("olquanji") >= 3;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.chooseDrawRecover({
        num1: 2,
        num2: 1,
        forced: true,
        ai(event2, player2) {
          if (player2.hp == 1 && player2.getDamagedHp() > 1) {
            return "recover_hp";
          }
          return "draw_card";
        }
      });
      await player.loseMaxHp();
      await player.addSkills("olpaiyi");
    },
    ai: {
      combo: "olquanji"
    }
  },
  olpaiyi: {
    enable: "phaseUse",
    audio: 2,
    usable(skill, player) {
      return player.hasSkill("olpaiyi_twice") ? 2 : 1;
    },
    filter(event, player) {
      return player.countExpansions("olquanji") > 0;
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("排异", player.getExpansions("olquanji"), "hidden");
      },
      backup(links, player) {
        return {
          audio: "olpaiyi",
          filterTarget: true,
          filterCard() {
            return false;
          },
          selectCard: -1,
          card: links[0],
          delay: false,
          content: lib.skill.olpaiyi.contentx,
          ai: {
            order: 10,
            result: {
              target(player2, target) {
                if (player2 != target) {
                  return 0;
                }
                if (player2.countCards("h") + 2 <= player2.hp + player2.countExpansions("olquanji")) {
                  return 1;
                }
                return 0;
              }
            }
          }
        };
      },
      prompt() {
        return "请选择〖排异〗的目标";
      }
    },
    async contentx(event, trigger, player) {
      const { target } = event;
      const card = lib.skill.olpaiyi_backup.card;
      await player.loseToDiscardpile(card);
      const result = await player.chooseControl({
        prompt: `权计：令${get.translation(target)}摸两张牌或对其造成一点伤害`,
        controls: ["摸牌", "伤害"],
        choice: get.damageEffect(target, player, player) > 0 ? 1 : 0
      }).forResult();
      if (typeof result.index == "number") {
        if (result.index == 0) {
          await target.draw({ num: 2 });
        } else {
          await target.damage();
        }
        if (target.countCards("h") > player.countCards("h")) {
          if (result.index == 0) {
            await target.damage();
          } else {
            await target.draw({ num: 2 });
          }
          player.addTempSkill("olpaiyi_twice", "phaseChange");
        }
      }
    },
    subSkill: {
      twice: { charlotte: true },
      backup: {}
    },
    ai: {
      order: 1,
      combo: "olquanji",
      result: {
        player: 1
      }
    }
  },
  //神黄忠
  shenyu: {
    audio: 2,
    trigger: {
      player: "phaseUseBegin"
    },
    filter(event, player) {
      const vcard = get.autoViewAs({ name: "sha", isCard: true });
      return game.hasPlayer((target) => player.canUse(vcard, target, false, false));
    },
    direct: true,
    async content(event, trigger, player) {
      const vcard = get.autoViewAs({ name: "sha", isCard: true });
      const next = player.chooseUseTarget({
        card: vcard,
        nodistance: true,
        addCount: false,
        prompt: get.prompt2(event.name, player)
      }).set("logSkill", event.name).set("oncard", () => {
        const evt2 = get.event();
        evt2?.getParent?.()?.set("useCardEvent", evt2);
      });
      const result = await next.forResult();
      const evt = next.useCardEvent;
      if (result?.bool && evt.targets?.length == 1) {
        const {
          targets: [target]
        } = evt;
        if (!target.isIn()) {
          return;
        }
        let card = _status[event.name];
        if (!card) {
          card = game.createCard2("chixueren", "heart", 13);
          _status[event.name] = card;
        }
        if (!card._selfDestroyed && card.destoryed !== true && target.canEquip(card, true)) {
          await target.equip(card);
        }
      }
    },
    group: "shenyu_jieshu",
    subSkill: {
      jieshu: {
        audio: "shenyu",
        trigger: {
          global: "phaseJieshuBegin"
        },
        filter(event, player) {
          const card = _status.shenyu;
          if (!card || card._selfDestroyed || card.destoryed || get.position(card) !== "e" || get.owner(card) == player || !get.owner(card)?.isIn()) {
            return false;
          }
          return (player.hasHistory("sourceDamage") || player.getHistory("useCard", (evt) => get.is.damageCard(evt.card)).length >= 2) && player.canEquip(card, true);
        },
        async cost(event, trigger, player) {
          const card = _status.shenyu;
          const choices = [];
          const { skill } = event;
          const target = get.owner(card);
          if (!target?.isIn()) {
            return;
          }
          const [left, right, left2, right2] = get.info("saodi").getTargets(player, target);
          if (target == left2) {
            choices.push("↖顺时针");
          }
          if (target == right2) {
            choices.push("逆时针↗");
          }
          choices.push("cancel2");
          const str = get.translation(target);
          const { control } = await player.chooseControl({
            controls: choices,
            prompt: get.prompt(skill, target),
            prompt2: `将${get.translation(card)}移动至你的装备区（替换原装备），获得${str}和${str}与你之间角色各随机一张牌`,
            ai() {
              const evt = get.event();
              const { player: player2, target: target2 } = evt;
              let left3 = false, right3 = false;
              let eff_left = 0, eff_right = 0;
              const [left4, right4, left22, right22] = get.info("saodi").getTargets(player2, target2);
              if (target2 == left22) {
                for (const i of left4) {
                  if (i.countGainableCards(player2, "he")) {
                    left3 = true;
                    eff_left += get.effect(i, { name: "shunshou_copy2" }, player2, player2);
                  }
                }
              }
              if (target2 == right22) {
                for (const i of right4) {
                  if (i.countGainableCards(player2, "he")) {
                    right3 = true;
                    eff_right += get.effect(i, { name: "shunshou_copy2" }, player2, player2);
                  }
                }
              }
              let bool = true;
              if (left3 && right3) {
                if (eff_left > Math.max(0, eff_right)) {
                  return "↖顺时针";
                }
                if (eff_right > Math.max(0, eff_left)) {
                  return "逆时针↗";
                }
                return "cancel2";
              } else if (left3) {
                {
                  return eff_left > 0 ? "↖顺时针" : "cancel2";
                }
              } else if (right3) {
                {
                  return eff_right > 0 ? "逆时针↗" : "cancel2";
                }
              } else {
                return bool ? "cancel2" : 0;
              }
            }
          }).set("target", target).forResult();
          if (control === "cancel2") {
            return;
          }
          const targets = [target];
          game.log(player, "选择了", "#g" + control);
          if (control == "逆时针↗") {
            let current = target.getPrevious();
            while (current != player && current) {
              if (current.countGainableCards(player, "he")) {
                targets.push(current);
              }
              current = current.getPrevious();
            }
          } else {
            let current = target.getNext();
            while (current != player && current) {
              if (current.countGainableCards(player, "he")) {
                targets.push(current);
              }
              current = current.getNext();
            }
          }
          event.result = {
            bool: true,
            targets,
            cards: [card]
          };
        },
        async content(event, trigger, player) {
          const {
            cards: [card],
            targets
          } = event;
          await player.equip(card);
          await game.doAsyncInOrder(
            targets,
            async (target) => {
              return player.randomGain({ target, position: "he" });
            },
            () => 0
          );
        }
      }
    }
  },
  huaren: {
    audio: 2,
    limited: true,
    animationColor: "metal",
    skillAnimation: true,
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    filter(event, player) {
      const check = (card) => get.subtype(card) == "equip1";
      return game.hasPlayer((target) => target == player ? target.hasCards("he", check) : target.hasCards("e", check));
    },
    async cost(event, trigger, player) {
      const check = (card) => get.subtype(card) == "equip1";
      const cards2 = game.filterPlayer().reduce((cards3, target) => {
        return [...cards3, ...target == player ? target.getCards("he", check) : target.getCards("e", check)];
      }, []);
      const result = await player.chooseButton({
        createDialog: [
          get.prompt2(event.skill),
          cards2,
          [
            (dialog) => {
              const buttons = dialog.buttons;
              buttons.forEach((button) => {
                game.createButtonCardsetion(get.translation(get.owner(button.link)), button);
              });
            },
            "handle"
          ]
        ],
        ai(button) {
          if (get.name(button.link) == "chixueren") {
            return 0;
          }
          return Math.random() - 0.5;
        }
      }).forResult();
      if (result?.bool && result.links?.length) {
        event.result = {
          bool: true,
          cards: result.links,
          targets: [get.owner(result.links[0])]
        };
      }
    },
    keepSkill: true,
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const {
        cards: [card],
        targets: [target]
      } = event;
      const skills2 = get.skillsFromEquips([card]);
      const num = target.getEquipRange([card]);
      card.destroyed = true;
      await target.lose({ cards: [card], position: ui.special }).set("notrigger", true);
      player.markAuto(event.name + "_mark", skills2);
      player.addAdditionalSkill(event.name, skills2, true);
      await player.draw({ num });
    },
    subSkill: {
      mark: {
        charlotte: true,
        intro: {
          content(storage, player, skill) {
            return `已视为拥有技能：${get.translation(storage)}`;
          }
        }
      }
    }
  },
  chixueren_skill: {
    equipSkill: true,
    forced: true,
    trigger: {
      source: "damageBegin1"
    },
    filter(event, player) {
      event.player;
      return event.card?.name == "sha" && event.checkChixueren && game.getGlobalHistory("everything", (evt) => evt.name == "damage" && evt.source == player && evt.card?.name == "sha" && evt.checkChixueren).indexOf(event) == 0;
    },
    async content(event, trigger, player) {
      trigger.num++;
    }
  },
  //谋祝融
  olsbrenche: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.countDiscardableCards(player, "he") >= get.info("olsbrenche").getShaLength() && game.hasPlayer((current) => current != player && current.hasCards("he"));
    },
    getShaLength() {
      return Math.max(
        1,
        get.discarded().filter((card) => card.name == "sha").filterInD("d").length
      );
    },
    usable(skill, player) {
      return get.info(skill).getShaLength();
    },
    filterCard: lib.filter.cardDiscardable,
    position: "he",
    discard: false,
    lose: false,
    delay: false,
    selectCard() {
      return get.info("olsbrenche").getShaLength();
    },
    check(card) {
      if (card.name == "sha") {
        return 4 - get.value(card);
      }
      return 8 - get.value(card);
    },
    filterTarget(card, player, target) {
      return target != player && target.hasCards("he");
    },
    selectTarget() {
      return [1, get.info("olsbrenche").getShaLength()];
    },
    multiline: true,
    multitarget: true,
    async content(event, trigger, player) {
      const targets = event.targets.sortBySeat();
      const { cards: cards2 } = await player.modedDiscard(event.cards).forResult();
      if (cards2?.some((card) => card.name != "sha")) {
        await player.draw();
      }
      await game.doAsyncInOrder(targets, async (target) => {
        const result = await target.chooseToDiscard({
          forced: true,
          prompt: `${get.translation(player)}对你发动了〖刃掣〗：请弃置一张牌，若不为【杀】，其摸一张牌`,
          position: "he",
          ai(card) {
            return 8 - get.value(card);
          }
        }).forResult();
        if (result?.bool && result.cards?.length) {
          const cards3 = result.cards;
          if (cards3?.some((card) => card.name != "sha")) {
            await player.draw();
          }
        }
      });
    },
    ai: {
      order: 13,
      result: {
        player: 1,
        target: -1
      }
    }
  },
  olsbyalian: {
    audio: 2,
    trigger: { player: "phaseAnyEnd" },
    filter(event, player) {
      const card = get.autoViewAs({ name: "sha", nature: "fire", isCard: true }, "unsure");
      const num = get.info("olsbrenche").getShaLength();
      const bool = game.hasPlayer((current) => current.countCards("h") <= num && player.canUse(card, current, false, false));
      return bool && player.hasHistory("lose", (evt) => {
        const evt2 = evt.relatedEvent || evt.getParent();
        if (evt2.name == "useCard" && evt2.player == player && evt2.card.name == "sha") {
          return;
        }
        return evt.cards2?.length && evt.cards2.some((card2) => card2.name == "sha") && evt.getParent(event.name) == event;
      });
    },
    async cost(event, trigger, player) {
      const card = get.autoViewAs({ name: "sha", nature: "fire", isCard: true }, "unsure");
      const num = get.info("olsbrenche").getShaLength();
      event.result = await player.chooseTarget({
        prompt: get.prompt(event.skill),
        prompt2: `对任意名手牌数小于等于${num}的角色使用一张火【杀】`,
        filterTarget(card2, player2, target) {
          const { num: num2, cardx } = get.event();
          return target.countCards("h") <= num2 && player2.canUse(cardx, target, false, false);
        },
        selectTarget: [1, Infinity],
        ai(target) {
          const { player: player2, cardx } = get.event();
          return get.effect(target, cardx, player2, player2);
        }
      }).set("num", num).set("cardx", card).forResult();
    },
    async content(event, trigger, player) {
      const targets = event.targets;
      const card = get.autoViewAs({ name: "sha", nature: "fire", isCard: true }, "unsure");
      await player.useCard({ card, targets });
    }
  },
  //界步练师
  olanxu: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.countPlayer((current) => get.info("olanxu").filterTarget(null, player, current)) > 1;
    },
    filterTarget(card, player, target) {
      if (player == target) {
        return target.hasGainableCards(player, "e");
      }
      return target.hasGainableCards(player, "he");
    },
    selectTarget: 2,
    multiline: true,
    multitarget: true,
    async content(event, trigger, player) {
      const { targets } = event;
      for (const target2 of targets.sortBySeat()) {
        await player.gainPlayerCard({ target: target2, position: player == target2 ? "e" : "he", forced: true });
      }
      if (targets[0].countCards("h") === targets[1].countCards("h")) {
        return;
      }
      const target = targets[0].countCards("h") > targets[1].countCards("h") ? targets[1] : targets[0];
      if (player.hasCards("he") && target?.isIn()) {
        const result = await player.chooseCard({
          prompt: `安恤：展示一张牌并将其交给${get.translation(target)}`,
          position: "he",
          forced: true,
          ai(card) {
            const { player: player2, target: target2 } = get.event();
            if (get.attitude(player2, target2) > 0) {
              return get.value(card) * (get.suit(card) !== "spade" ? 2 : 1);
            }
            return -get.value(card);
          }
        }).set("target", target).forResult();
        if (result?.bool && result.cards?.length) {
          const card = result.cards[0];
          await player.showCards(card, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
          if (player != target) {
            await player.give(card, target);
          }
          if (get.suit(card) != "spade") {
            await player.draw({ num: 1 });
          }
        }
      }
    },
    ai: {
      order: 5,
      result: {
        player: 1,
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
              if (att2 >= 0 && num2 < num) {
                return -1;
              }
            }
            return 0;
          } else {
            return 1;
          }
        }
      }
    }
  },
  olzhuiyi: {
    audio: 2,
    limited: true,
    skillAnimation: true,
    animationColor: "wood",
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return game.players.length > 1;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt(event.skill),
        prompt2: "令一名其他角色摸三张牌并回复1点体力",
        filterTarget: lib.filter.notMe,
        ai(target) {
          const player2 = get.player();
          let num = get.attitude(player2, target);
          if (num > 0) {
            if (target.getHp() == 1) {
              num += 2;
            }
            if (target.isDamaged()) {
              num += 2;
            }
          }
          return num;
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const {
        targets: [target]
      } = event;
      await target.draw({ num: 3 });
      await target.recover();
      player.addSkill(event.name + "_die");
      player.markAuto(event.name + "_die", [target]);
    },
    subSkill: {
      die: {
        charlotte: true,
        onremove: true,
        forceDie: true,
        audio: "olzhuiyi",
        skillAnimation: true,
        animationColor: "wood",
        trigger: { player: "die" },
        filter(event, player) {
          return player.getStorage("olzhuiyi_die").some((target) => target.isIn());
        },
        prompt2(event, player) {
          const targets = player.getStorage("olzhuiyi_die").filter((target) => target.isIn());
          return `令${get.translation(targets)}摸三张牌并回复1点体力`;
        },
        logTarget(event, player) {
          return player.getStorage("olzhuiyi_die").filter((target) => target.isIn()).sortBySeat();
        },
        async content(event, trigger, player) {
          const targets = event.targets;
          await game.doAsyncInOrder(targets, async (target) => {
            await target.draw({ num: 3 });
            await target.recover();
          });
        }
      }
    }
  },
  //界刘封
  olxiansi: {
    audio: 4,
    logAudio: () => 2,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => current.hasCards("he"));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt(event.skill),
        prompt2: "选择至多两名角色将其共计至多两张牌置于你的武将牌上",
        selectTarget: [1, 2],
        filterTarget(card, player2, target) {
          return target.hasCards("he");
        },
        ai(target) {
          return get.effect(target, { name: "guohe_copy", position: "he" }, target, get.player());
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const targets = event.targets.sortBySeat();
      const prompt = `将${get.translation(targets)}至多两张牌置于你的武将牌上`;
      let dialog = ["陷嗣：" + prompt];
      for (const target of targets) {
        if (target.hasCards("h")) {
          const cards2 = target.getCards("h");
          dialog.push(`<div class="text center">${get.translation(target)}的手牌</div>`);
          if (player.hasSkillTag("viewHandcard", null, target, true)) {
            dialog.push(cards2);
          } else {
            dialog.push([cards2.slice(0).randomSort(), "blank"]);
          }
        }
        if (target.hasCards("e")) {
          const cards2 = target.getCards("e");
          dialog.push(`<div class="text center">${get.translation(target)}的装备</div>`);
          dialog.push(cards2);
        }
      }
      const result = await player.chooseButton({
        createDialog: dialog,
        selectButton: [1, 2],
        ai(button) {
          const card = button.link;
          return get.value(card);
        }
      }).forResult();
      if (result?.bool && result.links?.length) {
        const cards2 = result.links;
        let cardx = cards2.slice(0), owner = get.owner(cards2[0]);
        if (owner == get.owner(cards2[1])) {
          await player.addToExpansion({
            cards: cardx,
            source: owner,
            animate: "give",
            gaintag: ["olxiansi"]
          });
        } else {
          for (const card of cards2) {
            owner = get.owner(card);
            await player.addToExpansion({
              cards: [card],
              source: owner,
              animate: "give",
              gaintag: ["olxiansi"]
            });
          }
        }
      }
    },
    global: "olxiansi_sha",
    group: "olxiansi_x",
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    ai: {
      threaten: 2
    },
    subSkill: {
      x: {},
      sha: {
        audio: "olxiansi",
        logAudio: () => ["olxiansi3.mp3", "olxiansi4.mp3"],
        enable: "chooseToUse",
        viewAs: {
          name: "sha",
          isCard: true
        },
        filter(event, player) {
          return game.hasPlayer((current) => current.hasSkill("olxiansi_x") && current.getExpansions("olxiansi").length > 1 && event.filterTarget({ name: "sha" }, player, current));
        },
        filterTarget(card, player, target) {
          let bool = false;
          const players = ui.selected.targets.slice(0);
          for (const current of players) {
            if (current.hasSkill("olxiansi_x") && current.getExpansions("olxiansi").length > 1) {
              bool = true;
            }
          }
          if (!bool && (!target.hasSkill("olxiansi_x") || target.getExpansions("olxiansi").length <= 1)) {
            return false;
          }
          return _status.event._backup.filterTarget.apply(this, arguments);
        },
        filterCard() {
          return false;
        },
        selectCard: -1,
        complexSelect: true,
        forceaudio: true,
        prompt: "弃置一名有【逆】的角色的两张【逆】，然后视为对包含其在内的角色使用【杀】。",
        delay: false,
        log: false,
        async precontent(event, trigger, player) {
          const targets = event.result.targets.filter((current) => current.getExpansions("olxiansi").length > 1 && current.hasSkill("olxiansi_x"));
          if (!targets.length) {
            return;
          }
          let target;
          if (targets.length == 1) {
            target = targets[0];
          } else {
            const result = await player.chooseTarget({
              prompt: "选择弃置【陷嗣】牌的目标",
              filterTarget(card, player2, target2) {
                return get.event().list.includes(target2);
              },
              forced: true,
              ai(target2) {
                const player2 = get.player();
                return get.attitude(player2, target2);
              }
            }).set("list", targets).forResult();
            if (!result.bool || !result.targets.length) {
              return;
            }
            target = result.targets[0];
          }
          let links;
          if (target.getExpansions("olxiansi").length == 2) {
            links = target.getExpansions("olxiansi").slice(0);
          } else {
            const result = await player.chooseCardButton("移去两张“逆”", 2, target.getExpansions("olxiansi"), true).forResult();
            if (!result.bool) {
              return;
            }
            links = result.links;
          }
          player.logSkill("olxiansi_sha", target);
          await target.loseToDiscardpile(links);
        },
        ai: {
          order() {
            return get.order({ name: "sha" }) + 0.05;
          }
        }
      }
    }
  },
  olqinling: {
    audio: 2,
    enable: "chooseToUse",
    usable: 1,
    locked: false,
    mod: {
      cardUsable(card) {
        if (card.storage?.olqinling) {
          return Infinity;
        }
      }
    },
    filter(event, player) {
      if (!player.hasDiscardableCards(player, "he")) {
        return false;
      }
      return get.inpileVCardList((info) => {
        if (info[2] != "sha") {
          return false;
        }
        return event.filterCard(
          get.autoViewAs(
            {
              name: info[2],
              nature: info[3],
              isCard: true,
              storage: { olqinling: true }
            },
            "unsure"
          ),
          player,
          event
        );
      }).length;
    },
    chooseButton: {
      dialog(event, player) {
        const list = get.inpileVCardList((info) => {
          if (info[2] != "sha") {
            return false;
          }
          return event.filterCard(
            get.autoViewAs(
              {
                name: info[2],
                nature: info[3],
                storage: { olqinling: true }
              },
              "unsure"
            ),
            player,
            event
          );
        });
        return ui.create.dialog("侵凌", [list, "vcard"]);
      },
      filter(button, player) {
        return _status.event.getParent().filterCard(
          {
            name: button.link[2],
            nature: button.link[3],
            storage: { olqinling: true }
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
          nature: button.link[3]
        });
      },
      backup(links, player) {
        return {
          filterCard: lib.filter.cardDiscardable,
          audio: "olqinling",
          popname: true,
          check(card) {
            return 8 - get.value(card);
          },
          position: "he",
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            isCard: true,
            suit: "none",
            color: "none",
            number: null
          },
          log: false,
          ignoreMod: true,
          async precontent(event, trigger, player2) {
            player2.logSkill("olqinling");
            event.getParent().addCount = false;
            const { cards: cards2 } = event.result;
            await player2.modedDiscard(cards2);
            event.result.cards = [];
            player2.when({ player: "useCardAfter" }).filter((evt) => evt.getParent() == event.getParent()).step(async (event2, trigger2, player3) => {
              if (player3.hasHistory("sourceDamage", (evt) => evt.card == trigger2.card)) {
                await player3.draw({ num: 1 });
              } else {
                await player3.addToExpansion({
                  cards: cards2,
                  source: player3,
                  animate: "give",
                  gaintag: ["olxiansi"]
                });
              }
            });
          }
        };
      },
      prompt(links, player) {
        return "弃置一张牌并视为使用" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
      }
    },
    hiddenCard(player, name2) {
      return name2 == "sha" && player.hasDiscardableCards(player, "he");
    },
    ai: {
      fireAttack: true,
      respondSha: true,
      skillTagFilter(player) {
        if (!player.hasDiscardableCards(player, "he")) {
          return false;
        }
      },
      order: 3,
      result: {
        player: 1
      }
    }
  },
  //界全琮
  olyaoming: {
    audio: 2,
    derivation: ["olzhenshan"],
    trigger: {
      player: "damageEnd",
      source: "damageSource"
    },
    usable: 1,
    async cost(event, trigger, player) {
      const next = player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget(card, player2, target) {
          let bool = false;
          if (player2.countCards("h") <= target.countCards("h")) {
            bool = target.hasDiscardableCards(player2, "he");
          }
          if (player2.countCards("h") >= target.countCards("h")) {
            bool = true;
          }
          return bool;
        },
        ai(target) {
          let eff = 0;
          const player2 = get.player();
          if (player2.countCards("h") >= target.countCards("h")) {
            eff += get.effect(target, { name: "draw" }, player2, player2);
          }
          if (player2.countCards("h") <= target.countCards("h")) {
            eff += get.effect(target, { name: "guohe_copy2" }, player2, player2);
          }
          if (!player2.getStorage("olyaoming_effect").includes(target)) {
            eff += 2;
          }
          return eff;
        }
      });
      next.targetprompt2.add((target) => {
        if (!target.classList.contains("selectable")) {
          return;
        }
        let str = "";
        const player2 = get.player();
        if (player2.countCards("h") >= target.countCards("h")) {
          str += "摸牌";
        }
        if (player2.countCards("h") <= target.countCards("h")) {
          str += "弃牌";
        }
        return str;
      });
      event.result = await next.forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      if (player.countCards("h") <= target.countCards("h")) {
        await player.discardPlayerCard({ target, position: "he", forced: true });
      }
      if (player.countCards("h") >= target.countCards("h")) {
        await target.draw();
      }
      if (_status.currentPhase == target) {
        player.addTempSkill("olzhenshan");
      }
      player.addSkill(event.name + "_effect");
      player.markAuto(event.name + "_effect", target);
    },
    subSkill: {
      effect: {
        forced: true,
        charlotte: true,
        popup: false,
        trigger: {
          global: ["phaseBeginStart"]
        },
        intro: {
          content: `$的回合内，你视为拥有技能${get.poptip("olzhenshan")}。`
        },
        filter(event, player) {
          return player.getStorage("olyaoming_effect").includes(event.player);
        },
        async content(event, trigger, player) {
          player.addTempSkill("olzhenshan");
        }
      }
    }
  },
  olzhenshan: {
    audio: 2,
    enable: ["chooseToUse", "chooseToRespond"],
    filter(event, player) {
      if (event.type == "wuxie") {
        return false;
      }
      const nh = player.countCards("h");
      if (!game.hasPlayer(function(current) {
        return current != player && current.countCards("h") < nh;
      })) {
        return false;
      }
      for (const i of lib.inpile) {
        if (get.type(i) != "basic") {
          continue;
        }
        const card = { name: i, isCard: true };
        if (event.filterCard(card, player, event)) {
          return true;
        }
        if (i == "sha") {
          for (const j of lib.inpile_nature) {
            card.nature = j;
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
        const list = [];
        for (const i of lib.inpile) {
          if (get.type(i) != "basic") {
            continue;
          }
          const card = { name: i, isCard: true };
          if (event.filterCard(card, player, event)) {
            list.push(["基本", "", i]);
          }
          if (i == "sha") {
            for (const j of lib.inpile_nature) {
              card.nature = j;
              if (event.filterCard(card, player, event)) {
                list.push(["基本", "", i, j]);
              }
            }
          }
        }
        return ui.create.dialog("振赡", [list, "vcard"], "hidden");
      },
      check(button) {
        const player = _status.event.player;
        const card = { name: button.link[2], nature: button.link[3] };
        if (card.name == "jiu") {
          return 0;
        }
        if (game.hasPlayer(function(current) {
          return get.effect(current, card, player, player) > 0;
        })) {
          if (card.name == "sha") {
            const eff = player.getUseValue(card);
            if (eff > 0) {
              return 2.9 + eff / 10;
            }
            return 0;
          } else if (card.name == "tao" || card.name == "shan") {
            return 4;
          }
        }
        return 0;
      },
      backup(links, player) {
        return {
          filterCard: () => false,
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            isCard: true,
            storage: {
              olzhenshan: player
            }
          },
          selectCard: -1,
          log: false,
          async precontent(event, trigger, player2) {
            const result = await player2.chooseTarget({
              prompt: "赈赡：选择一名手牌数小于你的角色交换手牌",
              filterTarget(card, player3, target) {
                return target != player3 && target.countCards("h") < player3.countCards("h");
              },
              forced: true,
              ai(target) {
                return get.attitude(get.player(), target) * Math.sqrt(target.countCards("h") + 1);
              }
            }).forResult();
            if (result?.bool) {
              player2.logSkill("olzhenshan", result.targets);
              await player2.swapHandcards(result.targets[0]);
              player2.addTempSkill("olzhenshan_restore");
            } else {
              event.result.cancel = true;
            }
          }
        };
      },
      prompt(links, player) {
        return "选择" + get.translation(links[0][3] || "") + "【" + get.translation(links[0][2]) + "】的目标";
      }
    },
    ai: {
      order() {
        const player = _status.event.player;
        const event = _status.event;
        const nh = player.countCards("h");
        if (game.hasPlayer(function(current) {
          return get.attitude(player, current) > 0 && current.countCards("h") < nh;
        })) {
          if (event.type == "dying") {
            if (event.filterCard({ name: "tao" }, player, event)) {
              return 0.5;
            }
          } else {
            if (event.filterCard({ name: "tao" }, player, event) || event.filterCard({ name: "shan" }, player, event)) {
              return 4;
            }
            if (event.filterCard({ name: "sha" }, player, event)) {
              return 2.9;
            }
          }
        }
        return 0;
      },
      save: true,
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        if (player.getStat().skill.olzhenshan > 0) {
          return false;
        }
        const nh = player.countCards("h");
        return game.hasPlayer(function(current) {
          return current != player && current.countCards("h") < nh;
        });
      },
      result: {
        player(player) {
          if (_status.event.type == "dying") {
            return get.attitude(player, _status.event.dying);
          }
          return 1;
        }
      }
    },
    subSkill: {
      restore: {
        charlotte: true,
        trigger: {
          global: ["useCardAfter", "respondAfter"]
        },
        filter(event, player) {
          return event.card?.storage?.olzhenshan == player;
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          player.refreshSkill("olyaoming");
        }
      }
    }
  },
  //界曹休
  olqianju: {
    audio: 2,
    mod: {
      globalFrom(from, to, distance) {
        return distance - from.getDamagedHp();
      },
      cardUsable(card, player, num) {
        if (card.name == "sha" && !game.hasPlayer((target) => target != player && !player.inRange(target))) {
          return num + 1;
        }
      }
    }
  },
  olqingxi: {
    audio: 2,
    trigger: {
      source: "damageBegin1"
    },
    filter(event, player) {
      return event.card?.name == "sha" && event.getParent((evt) => evt.name == "useCard" && evt.card == event.card, true)?.targets?.includes(event.player);
    },
    logTarget: "player",
    check(event, player) {
      return get.damageEffect(event.player, player, player) > 0;
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      let result;
      if (player.getEquips(1).length > 0) {
        result = { index: 2 };
      } else if (!target.hasDiscardableCards(target, "he") || !player.getAttackRange()) {
        result = { index: 1 };
      } else {
        result = await target.chooseControl({
          choiceList: [`弃置${get.cnNumber(player.getAttackRange())}张牌`, `此次伤害+1`],
          choice: (() => {
            if (target.hp == 1) {
              return 0;
            }
            if (player.getAttackRange() > 2) {
              return 1;
            }
            return 0;
          })(),
          prompt: `${get.translation(player)}对你发动了【倾袭】，请选择一项`
        }).forResult();
      }
      if (typeof result.index !== "number") {
        return;
      }
      if (result.index % 2 == 0) {
        await target.chooseToDiscard({
          forced: true,
          position: "he",
          selectCard: player.getAttackRange()
        }).forResult();
      }
      if (result.index > 0) {
        trigger.num++;
      }
      if (result.index == 2) {
        await player.modedDiscard({ cards: player.getEquips(1) });
      }
    }
  },
  //界关平
  oljieyong: {
    audio: 2,
    enable: ["chooseToUse", "chooseToRespond"],
    viewAsFilter(player) {
      return player.countCards("h", { color: "red" }) == 1;
    },
    viewAs: {
      name: "sha"
    },
    filterCard(card, player) {
      return get.color(card) == "red";
    },
    selectCard: -1
  },
  //魔张飞
  olzhuohun: {
    audio: 6,
    forced: true,
    mod: {
      cardname(card, player) {
        if (_status.currentPhase == player && card.name == "shan") {
          return "sha";
        }
      }
    },
    trigger: {
      global: ["changeHpAfter", "loseMaxHpAfter", "gainMaxHpAfter"]
    },
    filter(event, player) {
      if (_status.currentPhase != player) {
        return false;
      }
      const curColor = get.hpColor(event.player);
      const prevColor = get.hpColor({ hp: event.originalHp, maxHp: event.originalMaxHp });
      if (curColor == prevColor) {
        return false;
      }
      const list = [];
      for (const evt of _status.globalHistory[_status.globalHistory.length - 1]["everything"]) {
        if (!["changeHp", "gainMaxHp", "loseMaxHp"].includes(evt.name)) {
          continue;
        }
        if (evt.player != event.player) {
          continue;
        }
        const { originalHp, originalMaxHp, changedHp, changedMaxHp } = evt;
        const cur = get.hpColor({ hp: originalHp + changedHp, maxHp: originalMaxHp + changedMaxHp });
        const prev = get.hpColor({ hp: originalHp, maxHp: originalMaxHp });
        if (cur == prev || list.includes(cur)) {
          continue;
        }
        list.add(cur);
        if (cur == curColor && evt == event) {
          return true;
        }
      }
      return false;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const {
        targets: [target],
        name: name2
      } = event;
      const bool = player.storage[name2];
      if (!bool) {
        await player.draw();
      } else {
        await player.drawTo(player.maxHp);
        const color = get.hpColor(trigger.player);
        switch (color) {
          case "green":
            target.addTempSkill(`${name2}_draw`);
            break;
          case "yellow":
            target.addTempSkill("fengyin");
            break;
          case "red":
            if (!game.hasPlayer2((i) => i.isDying())) {
              await target.loseHp(target.getHp());
            }
            break;
        }
      }
    },
    subSkill: {
      draw: {
        charlotte: true,
        forced: true,
        mark: true,
        intro: {
          content: "本回合摸牌改为从牌堆获得等量【杀】"
        },
        trigger: {
          player: "drawBefore"
        },
        async content(event, trigger, player) {
          trigger.cancel();
          const { num } = trigger;
          const cards2 = [];
          for (let i = 0; i < num; i++) {
            const card = get.cardPile2((card2) => get.name(card2) == "sha" && !cards2.includes(card2));
            if (card) {
              cards2.push(card);
            } else {
              break;
            }
          }
          if (cards2.length) {
            await player.gain({ cards: cards2, animate: "gain2" });
          } else {
            player.chat("是啊，摸什么");
          }
        }
      }
    }
  },
  olchenshi: {
    audio: 3,
    forced: true,
    trigger: {
      source: "damageSource",
      player: "damageEnd"
    },
    filter(event, player, name2) {
      const { card } = event;
      const checkCard = (card2) => {
        return ["sha", "juedou"].includes(get.name(card2));
      };
      if (!card || !checkCard(card) || player.hasSkill("olrumo", null, false, false)) {
        return false;
      }
      return player.getAllHistory(name2 == "damageSource" ? "sourceDamage" : "damage", (evt) => {
        return evt.card && checkCard(evt.card);
      }).reduce((sum, evt) => sum + evt.num, 0) >= 3;
    },
    skillAnimation: true,
    animationColor: "red",
    async content(event, trigger, player) {
      await player.recover();
      player.setStorage("olzhuohun", true);
      game.log(player, "修改了〖灼魂〗");
      player.addSkill("olrumo");
    },
    group: ["olchenshi_useCard"],
    subSkill: {
      useCard: {
        audio: "olchenshi",
        forced: true,
        trigger: {
          player: ["useCard2"],
          global: ["useCard0"]
        },
        filter(event, player, name2) {
          const { card, targets } = event;
          if (get.name(card) != "sha" || get.color(card) != "black") {
            return false;
          }
          if (name2 == "useCard2") {
            return game.hasPlayer((target) => {
              return !targets.includes(target) && get.hpColor(target) != get.hpColor(player) && lib.filter.targetEnabled2(card, player, target);
            });
          }
          return event.player == player ? targets.some((target) => get.hpColor(target) == get.hpColor(player)) : get.hpColor(event.player) == get.hpColor(player) && targets.includes(player);
        },
        async content(event, trigger, player) {
          const { card, targets, cards: cards2 } = trigger;
          if (event.triggername == "useCard2") {
            const result = await player.chooseTarget({
              prompt: `瞋视：为${get.translation(card)}增加任意个目标`,
              selectTarget: [1, Infinity],
              filterTarget(card2, player2, target) {
                return !get.event().targets.includes(target) && get.hpColor(target) != get.hpColor(player2) && lib.filter.targetEnabled2(get.event().card, player2, target);
              },
              ai(target) {
                return get.effect(target, get.event().card, get.player(), get.player());
              }
            }).set("targets", targets).set("card", card).forResult();
            if (result.bool && result.targets?.length) {
              const { targets: targets2 } = result;
              player.line(targets2);
              trigger.targets.addArray(targets2);
              game.log(targets2, "成为", card, "的额外目标");
            }
          } else {
            if (trigger.addCount !== false) {
              trigger.addCount = false;
              const stat = trigger.player.getStat().card, name2 = card.name;
              if (typeof stat[name2] == "number") {
                stat[name2]--;
              }
            }
            trigger.card.name = "juedou";
            delete trigger.card.nature;
            for (const node of cards2) {
              const clone = node.clone;
              if (clone) {
                ui.create.cardTempName(card, clone);
              }
            }
          }
        }
      }
    }
  },
  //界夏侯氏
  olqiaoshi: {
    audio: 2,
    trigger: {
      global: "phaseJieshuBegin"
    },
    logTarget: () => _status.currentPhase,
    filter(event, player) {
      return _status.currentPhase?.isIn();
    },
    check(event, player) {
      return get.attitude(player, _status.currentPhase) > 0;
    },
    async content(event, trigger, player) {
      let { targets } = event;
      targets = [player, ...targets];
      await game.asyncDraw(targets);
      if (targets[0].countCards("h") != targets[1].countCards("h")) {
        player.tempBanSkill(event.name, "roundStart");
      }
    },
    ai: {
      expose: 0.25,
      tag: {
        draw: 1
      }
    }
  },
  olyanyu: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.hasCard((card) => get.name(card) == "sha" && player.canRecast(card), "h");
    },
    filterCard: (card, player) => get.name(card) == "sha" && player.canRecast(card),
    discard: false,
    lose: false,
    delay: false,
    async content(event, trigger, player) {
      await player.recast(event.cards);
    },
    ai: {
      order: 1,
      result: {
        player: 1
      }
    },
    group: ["olyanyu_draw"],
    subSkill: {
      draw: {
        audio: "olyanyu",
        trigger: {
          player: "phaseUseEnd"
        },
        filter(event, player) {
          return player.getHistory("lose", (evt) => evt.getParent("phaseUse") == event).reduce((list, evt) => list.addArray(evt.cards2.filter((card) => get.name(card) == "sha")), []).length >= 2 && game.hasPlayer((target) => target.sex == "male");
        },
        async cost(event, trigger, player) {
          event.result = await player.chooseTarget({
            prompt: get.prompt(event.skill),
            prompt2: "令一名男性角色摸两张牌",
            filterTarget(card, player2, target) {
              return target.sex == "male";
            },
            ai(target) {
              return get.effect(target, { name: "draw" }, get.player(), get.player());
            }
          }).forResult();
        },
        async content(event, trigger, player) {
          const {
            targets: [target]
          } = event;
          await target.draw({ num: 2 });
        }
      }
    }
  },
  //神典韦
  juanjia: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter(event, player) {
      return (event.name != "phase" || game.phaseNumber == 0) && player.hasEnabledSlot(2);
    },
    async content(event, trigger, player) {
      await player.disableEquip(2);
      await player.expandEquip(1);
    }
  },
  qiexie: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      return player.countEmptySlot(1) > 0;
    },
    async content(event, trigger, player) {
      if (!_status.characterlist) {
        game.initCharacterList();
      }
      _status.characterlist.randomSort();
      const list = [];
      for (const name2 of _status.characterlist) {
        if (get.character(name2, 3).some((skill) => {
          const info = get.plainText(get.skillInfoTranslation(skill));
          if (!info.includes("【杀】")) {
            return false;
          }
          const list2 = get.skillCategoriesOf(skill, player);
          list2.remove("锁定技");
          return list2.length == 0;
        })) {
          list.push(name2);
          if (list.length >= 5) {
            break;
          }
        }
      }
      const num = player.countEmptySlot(1);
      if (!list.length || !num) {
        return;
      }
      const result = await player.chooseButton(
        [
          "挈挟：选择" + (num > 1 ? "至多" : "") + get.cnNumber(num) + "张武将置入武器栏",
          [
            list,
            (item, type, position, noclick, node) => {
              return lib.skill.qiexie.$createButton(item, type, position, noclick, node);
            }
          ]
        ],
        [1, num],
        true
      ).set("ai", (button) => {
        const name2 = button.link;
        const skills2 = get.character(name2, 3).filter((skill) => {
          const info = get.plainText(get.skillInfoTranslation(skill));
          if (!info.includes("【杀】")) {
            return false;
          }
          const list2 = get.skillCategoriesOf(skill, get.player());
          list2.remove("锁定技");
          return list2.length == 0;
        });
        let eff = 0.2;
        for (const skill of skills2) {
          eff += get.skillRank(skill, "in");
        }
        return eff;
      }).forResult();
      if (result?.bool) {
        const list2 = result.links;
        game.addVideo("skill", player, [event.name, [list2]]);
        _status.characterlist.removeArray(list2);
        game.broadcastAll(
          (player2, list3) => {
            player2.tempname.addArray(list3);
            for (var name2 of list3) {
              lib.skill.qiexie.createCard(name2);
            }
          },
          player,
          list2
        );
        const cards2 = list2.map((name2) => {
          const card = game.createCard(`qiexie_${name2}`, "none", "none");
          return card;
        });
        player.$gain2(cards2);
        await game.delayx();
        for (const card of cards2) {
          await player.equip(card);
        }
      }
    },
    $createButton(item, type, position, noclick, node) {
      node = ui.create.buttonPresets.character(item, "character", position, noclick);
      const info = lib.character[item];
      const skills2 = info[3].filter(function(skill) {
        var info2 = get.skillInfoTranslation(skill);
        if (!info2.includes("【杀】")) {
          return false;
        }
        var list = get.skillCategoriesOf(skill, get.player());
        list.remove("锁定技");
        return list.length == 0;
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
          const infoHp = get.infoMaxHp(characterInfo[2]);
          capt += `&nbsp;&nbsp;范围：${infoHp}`;
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
    video(player, info) {
      for (var name2 of info[0]) {
        lib.skill.qiexie.createCard(name2);
      }
    },
    createCard(name2) {
      if (!_status.postReconnect.qiexie) {
        _status.postReconnect.qiexie = [
          function(list) {
            for (var name3 of list) {
              lib.skill.qiexie.createCard(name3);
            }
          },
          []
        ];
      }
      _status.postReconnect.qiexie[1].add(name2);
      if (!lib.card["qiexie_" + name2]) {
        if (lib.translate[name2 + "_ab"]) {
          lib.translate["qiexie_" + name2] = lib.translate[name2 + "_ab"];
        } else {
          lib.translate["qiexie_" + name2] = lib.translate[name2];
        }
        var info = lib.character[name2];
        var card = {
          fullimage: true,
          image: "character:" + name2,
          type: "equip",
          subtype: "equip1",
          enable: true,
          selectTarget: -1,
          filterTarget(card2, player, target) {
            if (player != target) {
              return false;
            }
            return target.canEquip(card2, true);
          },
          modTarget: true,
          allowMultiple: false,
          content: lib.element.content.equipCard,
          toself: true,
          ai: {},
          skills: ["qiexie_destroy"]
        };
        var maxHp = get.infoMaxHp(info[2]);
        if (maxHp != 1) {
          card.distance = { attackFrom: 1 - maxHp };
        }
        var skills2 = info[3].filter(function(skill2) {
          var info2 = get.skillInfoTranslation(skill2);
          if (!info2.includes("【杀】")) {
            return false;
          }
          var list = get.skillCategoriesOf(skill2, get.player());
          list.remove("锁定技");
          return list.length == 0;
        });
        var str = "锁定技。";
        if (skills2.length) {
          card.skills.addArray(skills2);
          str += "你视为拥有技能";
          for (var skill of skills2) {
            str += "〖" + get.translation(skill) + "〗";
            str += "、";
          }
          str = str.slice(0, str.length - 1);
          str += "；";
          card.ai.equipValue = function(card2, player) {
            let val = maxHp;
            if (player.hasSkill("qiexie")) {
              val *= 0.4;
            } else {
              val *= 0.6;
            }
            return val += skills2.length;
          };
        }
        str += "此牌离开你的装备区后，改为置入剩余武将牌牌堆。";
        lib.translate["qiexie_" + name2 + "_info"] = str;
        var append = "";
        if (skills2.length) {
          for (var skill of skills2) {
            if (lib.skill[skill].nobracket) {
              append += '<div class="skilln">' + get.translation(skill) + '</div><div><span style="font-family: yuanli">' + get.skillInfoTranslation(skill) + "</span></div><br><br>";
            } else {
              var translation = lib.translate[skill + "_ab"] || get.translation(skill).slice(0, 2);
              append += '<div class="skill">【' + translation + '】</div><div><span style="font-family: yuanli">' + get.skillInfoTranslation(skill) + "</span></div><br><br>";
            }
          }
          str = str.slice(0, str.length - 8);
        }
        lib.translate["qiexie_" + name2 + "_append"] = append;
        lib.card["qiexie_" + name2] = card;
        game.finishCard("qiexie_" + name2);
      }
    },
    subSkill: {
      destroy: {
        trigger: { player: "loseBegin" },
        equipSkill: true,
        forceDie: true,
        charlotte: true,
        forced: true,
        popup: false,
        filter(event, player) {
          return event.cards.some((card) => card.name.indexOf("qiexie_") == 0);
        },
        async content(event, trigger, player) {
          for (const card of trigger.cards) {
            if (card.name.indexOf("qiexie_") == 0) {
              card._destroy = true;
              game.log(card, "被放回武将牌堆");
              const name2 = card.name.slice(7);
              if (player.tempname && player.tempname.includes(name2)) {
                game.broadcastAll(
                  (player2, name3) => {
                    player2.tempname.remove(name3);
                  },
                  player,
                  name2
                );
              }
              if (lib.character[name2]) {
                _status.characterlist.add(name2);
              }
            }
          }
        }
      }
    }
  },
  cuijue: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    filterCard: true,
    filterTarget(card, player, target) {
      if (player.getStorage("cuijue_used").includes(target) || !player.inRange(target)) {
        return false;
      }
      var distance = get.distance(player, target);
      return !game.hasPlayer((current) => current != target && player.inRange(current) && get.distance(player, current) > distance);
    },
    selectTarget: [0, 1],
    filterOk() {
      var player = _status.event.player;
      if (game.hasPlayer((target) => lib.skill.cuijue.filterTarget("SB", player, target))) {
        return ui.selected.targets.length > 0;
      }
      return true;
    },
    position: "he",
    complexTarget: true,
    check: (card) => {
      var player = _status.event.player, goon = 0;
      try {
        ui.selected.cards.add(card);
        if (game.hasPlayer((target) => {
          return lib.skill.cuijue.filterTarget("SB", player, target);
        })) {
          goon = 6;
        }
      } catch (e) {
        console.trace(e);
      }
      ui.selected.cards.remove(card);
      return goon - get.value(card);
    },
    async content(event, trigger, player) {
      const { target } = event;
      if (target) {
        player.addTempSkill("cuijue_used", "phaseUseAfter");
        player.markAuto("cuijue_used", [target]);
        target.damage("nocard");
      }
    },
    ai: {
      order: 2,
      result: {
        target: -1.5
      },
      tag: {
        damage: 1
      }
    },
    subSkill: {
      used: {
        onremove: true,
        charlotte: true
      }
    }
  },
  //神曹丕 神甄姬 OL神张辽
  caopi_xingdong: {
    audio: true,
    subSkill: {
      mark: {
        mark: true,
        marktext: "令",
        intro: {
          content: "跳过下个回合的判定阶段和摸牌阶段"
        }
      }
    },
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h", lib.skill.caopi_xingdong.filterCard) > 0;
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
          game.filterPlayer((current) => current !== player),
          "请使用得到的牌，或者跳过下回合的判定阶段和摸牌阶段"
        ).forResult();
      }
      if (result.bool) {
        await game.asyncDraw([player, target]);
        await game.delay();
      } else {
        target.addTempSkill("caopi_xingdong_mark", "phaseJudgeSkipped");
        target.skip("phaseJudge");
        target.skip("phaseDraw");
      }
    },
    ai: {
      order: 12,
      result: {
        target(player, target) {
          var card = ui.selected.cards[0];
          if (target.hasSkill("pingkou")) {
            return 1;
          }
          if (!card) {
            return 0;
          }
          var info = get.info(card);
          if (info.selectTarget == -1) {
            var eff = 0;
            game.countPlayer(function(current) {
              if (current != player && target.canUse(card, current)) {
                eff += get.effect(current, card, target, target) > 0;
              }
            });
            if (eff > 0 || get.value(card) < 3) {
              return eff;
            }
            return 0;
          } else if (game.hasPlayer(function(current) {
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
  shenfu: {
    audio: 2,
    trigger: { player: "phaseEnd" },
    direct: true,
    async content(event, trigger, player) {
      let logged = false;
      const chosen = /* @__PURE__ */ new Set(), odd = player.countCards("h") % 2 === 1;
      event.chosen = chosen;
      while (true) {
        if (odd) {
          const result = await player.chooseTarget(get.prompt("shenfu"), "对一名其他角色造成1点雷属性伤害", (card, player2, target2) => {
            return target2 !== player2 && !get.event().getParent().chosen.has(target2);
          }).set("ai", (target2) => {
            const player2 = get.player();
            return get.damageEffect(target2, player2, player2, "thunder") * (target2.hp == 1 ? 2 : 1);
          }).forResult();
          if (!result.bool) {
            return;
          }
          const target = result.targets[0];
          if (!logged) {
            logged = true;
            player.logSkill("shenfu", target, "thunder");
          } else {
            player.line(target, "thunder");
          }
          chosen.add(target);
          await target.damage("thunder");
          if (!target.getHistory("damage", (evt) => evt.getParent("shenfu") === event && evt._dyinged).length) {
            return;
          }
        } else {
          let result = await player.chooseTarget(get.prompt("shenfu"), "令一名角色摸一张牌或弃置其一张手牌", (card, player2, target2) => {
            return !get.event().getParent().chosen.has(target2);
          }).set("ai", (target2) => {
            const att = get.attitude(_status.event.player, target2);
            const delta = target2.hp - target2.countCards("h");
            if (Math.abs(delta) == 1 && get.sgn(delta) == get.sgn(att)) {
              return 3 * Math.abs(att);
            }
            if (att > 0 || target2.countCards("h") > 0) {
              return Math.abs(att);
            }
            return 0;
          }).forResult();
          if (!result) {
            return;
          }
          const target = result.targets[0];
          if (!logged) {
            logged = true;
            player.logSkill("shenfu", target);
          } else {
            player.line(target, "green");
          }
          chosen.add(target);
          if (target.countCards("h") === 0) {
            result = { index: 0 };
          } else {
            result = await player.chooseControl("摸一张牌", "弃置一张手牌").set("prompt", "选择一项令" + get.translation(target) + "执行…").set("goon", get.attitude(player, target) > 0 ? 0 : 1).set("ai", () => _status.event.goon).forResult();
          }
          if (result.index == 0) {
            await target.draw();
          } else {
            await target.chooseToDiscard("h", true);
          }
          if (target.hp !== target.countCards("h")) {
            return;
          }
        }
      }
    },
    ai: { expose: 0.25 }
  },
  qixian: {
    mod: {
      maxHandcardBase(player, num) {
        return 7;
      }
    }
  },
  chuyuan: {
    audio: 2,
    trigger: { global: "damageEnd" },
    filter(event, player) {
      return event.player.isIn() && player.getExpansions("chuyuan").length < player.maxHp;
    },
    logTarget: "player",
    locked: false,
    async content(event, trigger, player) {
      await trigger.player.draw();
      if (!trigger.player.countCards("h")) {
        return;
      }
      const result = await trigger.player.chooseCard("h", true, "选择一张牌置于" + get.translation(player) + "的武将牌上作为「储」").forResult();
      player.addToExpansion(result.cards, trigger.player, "give").gaintag.add("chuyuan");
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
    ai: {
      notemp: true
    }
  },
  dengji: {
    audio: 2,
    derivation: ["tianxing", "new_rejianxiong", "rerende", "rezhiheng", "olluanji", "caopi_xingdong"],
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "water",
    filter(event, player) {
      return player.getExpansions("chuyuan").length >= 3;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.addSkills(["tianxing", "new_rejianxiong"]);
      await player.loseMaxHp();
      await player.gain(player.getExpansions("chuyuan"), "gain2", "fromStorage");
    },
    ai: {
      combo: "chuyuan"
    }
  },
  tianxing: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "thunder",
    filter(event, player) {
      return player.getExpansions("chuyuan").length >= 3;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.loseMaxHp();
      await player.gain(player.getExpansions("chuyuan"), "gain2", "fromStorage");
      await player.removeSkills("chuyuan");
      const result = await player.chooseControl("rerende", "rezhiheng", "olluanji", "caopi_xingdong").set("prompt", "选择获得一个技能").set("ai", processAI).forResult();
      await player.addSkills(result.control);
      return;
      function processAI() {
        const player2 = get.player();
        if (!player2.hasSkill("luanji") && !player2.hasSkill("olluanji") && player2.getUseValue({ name: "wanjian" }) > 4) {
          return "olluanji";
        }
        if (!player2.hasSkill("rezhiheng")) {
          return "rezhiheng";
        }
        if (!player2.hasSkill("caopi_xingdong")) {
          return "caopi_xingdong";
        }
        return "rerende";
      }
    },
    ai: {
      combo: "chuyuan"
    }
  },
  rerende_shen_caopi: { audio: 1 },
  rezhiheng_shen_caopi: { audio: 1 },
  olluanji_shen_caopi: { audio: 1 },
  olzhiti: {
    audio: "drlt_zhiti",
    global: "olzhiti2",
    mod: {
      maxHandcard(player, num) {
        if (game.hasPlayer(function(current) {
          return current.isDamaged();
        })) {
          return num + 1;
        }
      }
    },
    trigger: { player: ["phaseDrawBegin2", "phaseEnd"] },
    forced: true,
    filter(event, player) {
      var num = event.name == "phase" ? 5 : 3;
      if (num == 3 ? event.numFixed : !game.hasPlayer(function(current) {
        return current.hasEnabledSlot();
      })) {
        return false;
      }
      return game.countPlayer(function(current) {
        return current.isDamaged();
      }) >= num;
    },
    direct: true,
    async content(event, trigger, player) {
      if (trigger.name == "phaseDraw") {
        player.logSkill("olzhiti");
        trigger.num++;
        return;
      }
      const result = await player.chooseTarget(get.prompt("olzhiti"), "废除一名角色的一个随机装备栏", (card, player2, target) => {
        return target.hasEnabledSlot();
      }).set("ai", (target) => {
        return -get.attitude(_status.event.player, target) * (target.countCards("e") + 1);
      }).forResult();
      if (result.bool) {
        const target = result.targets[0];
        player.logSkill("olzhiti", target);
        const list = [];
        for (let i = 1; i < 6; i++) {
          if (target.hasEnabledSlot(i)) {
            list.add(i == 3 || i == 4 ? 6 : i);
          }
        }
        const num = list.randomGet();
        if (num != 6) {
          await target.disableEquip(num);
        } else {
          await target.disableEquip(3, 4);
        }
      }
    }
  },
  olzhiti2: {
    mod: {
      maxHandcard(player, num) {
        if (player.isDamaged()) {
          return num - game.countPlayer(function(current) {
            return current.hasSkill("olzhiti") && current.inRange(player);
          });
        }
      }
    }
  },
  olduorui: {
    audio: "drlt_duorui",
    trigger: { source: "damageSource" },
    filter(event, player) {
      const target = event.player;
      if (!player.isPhaseUsing() || target.isDead()) {
        return false;
      }
      if (Object.keys(target.disabledSkills).some((key) => target.disabledSkills[key].includes("olduorui_effect"))) {
        return false;
      }
      const skills2 = target.getStockSkills(false, true).filter((skill) => {
        const info = get.info(skill);
        return !info.charlotte || !info.persevereSkill;
      });
      return skills2.length > 0;
    },
    check(event, player) {
      if (get.attitude(player, event.player) >= 0) {
        return false;
      }
      if (event.getParent("phaseUse").skipped) {
        return true;
      }
      const nd = player.needsToDiscard();
      return player.countCards("h", function(card) {
        return player.getUseValue(card, null, true) > 0 && (nd ? true : get.tag(card, "damage") > 0);
      }) == 0;
    },
    async cost(event, trigger, player) {
      const target = trigger.player;
      const skills2 = target.getStockSkills(false, true).filter((skill) => {
        const info = get.info(skill);
        return !info.charlotte || !info.persevereSkill;
      });
      const list = skills2.map((skill) => [
        skill,
        `<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">${(() => {
          let str = get.translation(skill);
          if (!lib.skill[skill]?.nobracket) {
            str = `【${str}】`;
          }
          return str;
        })()}</div><div>${get.translation(skill, "info")}</div></div>`
      ]);
      const result = await player.chooseButton([`选择${get.translation(target)}武将牌上的一个技能并令其失效`, [list, "textbutton"]]).set("ai", (button) => {
        if (!get.event().check) {
          return 0;
        }
        const { link } = button;
        return get.skillRank(link, "inout");
      }).set("displayIndex", false).set("check", get.info(event.skill).check(trigger, player)).forResult();
      event.result = {
        bool: result?.bool,
        cost_data: result?.links
      };
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const {
        targets: [target],
        cost_data: [skill]
      } = event;
      target.disableSkill(event.name + "_effect", skill);
      target.addTempSkill(event.name + "_effect", { player: "phaseAfter" });
      game.log(player, "选择了", target, "的技能", `#g【${get.translation(skill)}】`);
      event.getParent("phaseUse").skipped = true;
    },
    subSkill: {
      effect: {
        onremove(player, skill) {
          player.enableSkill(skill);
        },
        locked: true,
        mark: true,
        charlotte: true,
        intro: {
          content(storage, player, skill) {
            const list = Object.keys(player.disabledSkills).filter((key) => player.disabledSkills[key].includes(skill)).flatMap((key) => {
              return lib.translate[key + "_info"] ? [get.translation(key)] : [];
            });
            if (list.length) {
              return `失效技能：${list.join("、")}`;
            }
          }
        }
      }
    }
  },
  //界张松
  olqiangzhi: {
    audio: 2,
    trigger: {
      player: "phaseUseBegin"
    },
    filter(event, player) {
      return game.hasPlayer(function(current) {
        return current != player && current.countCards("h") > 0;
      });
    },
    subfrequent: ["draw"],
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget(card, player2, target) {
          return target != player2 && target.countCards("h") > 0;
        },
        ai: () => Math.random()
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      await player.viewHandcards(target);
      const check = (card) => player.hasUseTarget(card, void 0, true) || get.info(card).notarget && lib.filter.cardEnabled(card, player);
      const hs = player.getCards("h", (card) => check(card));
      const map = Object.groupBy(hs, (card) => get.type2(card));
      const types = Object.keys(map).sort((a, b) => map[a] - map[b]);
      const result = await player.choosePlayerCard({
        prompt: "强识：请选择要展示的牌",
        visible: true,
        target,
        forced: true,
        position: "h",
        ai(button) {
          const { types: types2 } = get.event();
          return types2.indexOf(get.type2(button.link)) + 2;
        }
      }).set("types", types).forResult();
      if (result.cards?.length) {
        const {
          cards: [card]
        } = result;
        await player.showCards(card, `${get.translation(player)}发动了【强识】`);
        player.addTempSkill(`${event.name}_draw`, "phaseChange");
        player.markAuto(`${event.name}_draw`, get.type2(card));
      }
    },
    subSkill: {
      draw: {
        trigger: {
          player: "useCard"
        },
        frequent: true,
        popup: false,
        charlotte: true,
        prompt: "是否执行【强识】的效果摸一张牌？",
        filter(event, player) {
          return player.getStorage("olqiangzhi_draw").includes(get.type2(event.card));
        },
        async content(event, trigger, player) {
          await player.draw({ nodelay: true });
        },
        onremove: true,
        mark: true,
        intro: {
          content: "使用$牌时，可以摸一张牌"
        }
      }
    }
  },
  olxiantu: {
    audio: 2,
    trigger: {
      global: "phaseUseBegin"
    },
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
    async cost(event, trigger, player) {
      const target = trigger.player;
      const result = await player.chooseControl({
        prompt: get.prompt2(event.skill, target),
        controls: ["一张", "两张", "cancel2"],
        choice: (() => {
          if (get.attitude(player, target) < 1) {
            return 2;
          }
          if (player.hp > 1 || player.hasCard((card) => (get.name(card) === "tao" || get.name(card) === "jiu") && lib.filter.cardEnabled(card, player), "hs")) {
            return 1;
          }
          return 2;
        })()
      }).forResult();
      event.result = {
        bool: result.control != "cancel2",
        cost_data: { num: result.index + 1 }
      };
    },
    async content(event, trigger, player) {
      const {
        targets: [target],
        cost_data: { num }
      } = event;
      await player.draw({ num });
      await player.chooseToGive({
        target,
        selectCard: num,
        position: "he",
        forced: true,
        ai(card) {
          if (ui.selected.cards.length && card.name == ui.selected.cards[0].name) {
            return -1;
          }
          if (get.is.damageCard(card)) {
            return 1;
          }
          if (get.type(card) == "equip") {
            return 1;
          }
          return 0;
        }
      });
      player.when({ global: "phaseAnyEnd" }).filter((evt) => evt == trigger).then(async (event2, trigger2, player2) => {
        const numx = target.getHistory("sourceDamage", (evt) => evt.num > 0).reduce((sum, evt) => sum + evt.num, 0);
        if (numx < num) {
          player2.popup("杯具");
          await player2.loseHp();
        }
      });
    },
    ai: {
      threaten(player, target) {
        return 1 + game.countPlayer((current) => {
          if (current != target && get.attitude(target, current) > 0) {
            return true;
          }
          return false;
        });
      },
      expose: 0.3
    }
  },
  //闪张郃
  olqiongtu: {
    audio: "jsrgqiongtu",
    enable: "chooseToUse",
    groupSkill: "qun",
    viewAs: {
      name: "wuxie",
      isCard: true
    },
    viewAsFilter(player) {
      return player.group == "qun";
    },
    filterCard: () => false,
    selectCard: 0,
    usable: 1,
    log: false,
    async precontent(event, trigger, player) {
      player.logSkill("olqiongtu");
      player.addTempSkill("olqiongtu_effect");
    },
    intro: {
      markcount: "expansion",
      content: "expansion"
    },
    subSkill: {
      effect: {
        charlotte: true,
        forced: true,
        popup: false,
        trigger: { player: ["useCard", "useCardAfter"] },
        filter(event, player) {
          return event.skill == "olqiongtu";
        },
        async content(event, trigger, player) {
          if (event.triggername == "useCard") {
            await player.draw();
          } else {
            const skill = "olqiongtu";
            let result;
            if (!player.hasCard((card) => get.type(card) != "basic", "he")) {
              result = { bool: false };
            } else {
              result = await player.chooseCard({
                prompt: "穷途：将一张非基本牌置于武将牌上",
                forced: true,
                position: "he",
                filterCard(card) {
                  return get.type(card) != "basic";
                },
                ai(card) {
                  return -get.value(card);
                }
              }).forResult();
            }
            if (result.bool && result.cards?.length) {
              const { cards: cards2 } = result;
              await player.addToExpansion({ cards: cards2, gaintag: [skill], animate: "give", source: player });
            } else {
              const cards2 = player.getExpansions(skill);
              if (cards2.length) {
                await player.gain({ cards: cards2, animate: "give", source: player });
              }
              await player.changeGroup("wei");
            }
          }
        }
      }
    }
  },
  olxianzhu: {
    audio: "jsrgxianzhu",
    enable: "phaseUse",
    filter(event, player) {
      const types = ["equip", "trick"].removeArray(player.getStorage("olxianzhu_used"));
      return player.group == "wei" && types.length > 0 && player.countDiscardableCards(player, "he", (card) => {
        const type = get.type2(card);
        return types.includes(type);
      }) > 0;
    },
    groupSkill: "wei",
    locked: false,
    viewAs: {
      name: "sha",
      isCard: true,
      cards: [],
      storage: {
        olxianzhu: true
      }
    },
    ignoreMod: true,
    log: false,
    position: "he",
    filterCard(card, player) {
      const types = ["equip", "trick"].removeArray(player.getStorage("olxianzhu_used"));
      return types.includes(get.type2(card)) && lib.filter.cardDiscardable(card, player, "olxianzhu");
    },
    check(card) {
      const player = _status.event.player;
      const cardx = get.info("olxianzhu").viewAs;
      if (game.hasPlayer((current) => {
        return player.canUse(cardx, current) && get.effect(current, card, player, player) > 0 && get.effect(current, cardx, player, player) > 0;
      })) {
        return 15 - get.value(card);
      }
      return 0;
    },
    async precontent(event, trigger, player) {
      const skill = "olxianzhu";
      const { cards: cards2 } = event.result;
      player.logSkill(skill);
      player.addTempSkill(`${skill}_used`, "phaseChange");
      player.markAuto(`${skill}_used`, get.type2(cards2?.[0]));
      await player.discard({ cards: cards2 });
      event.result.cards = [];
      event.getParent().oncard = () => {
        const { card, player: player2 } = get.event();
        player2.when("useCardAfter").filter((evt) => evt.card == card).then(async (event2, trigger2, player3) => {
          if (game.hasPlayer2((target) => target.hasHistory("damage", (evt) => evt.card == trigger2.card))) {
            await player3.chooseUseTarget({ card: cards2?.[0], addCount: false });
          }
        });
      };
      event.getParent().addCount = false;
    },
    mod: {
      cardUsable(card) {
        if (card.storage && card.storage.olxianzhu) {
          return Infinity;
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "已弃置过： $"
        }
      }
    }
  },
  //界曹节
  olshouxi: {
    audio: 2,
    trigger: {
      target: "useCardToTargeted"
    },
    usable: 1,
    filter(event, player) {
      return get.is.damageCard(event.card) && player.countDiscardableCards(player, "he", (card) => get.is.damageCard(card)) > 0;
    },
    async cost(event, trigger, player) {
      const { player: source, card } = trigger;
      event.result = await player.chooseToDiscard({
        prompt: get.prompt2(event.skill, source),
        selectCard: [1, Infinity],
        position: "he",
        chooseonly: true,
        filterCard: (card2) => get.is.damageCard(card2),
        ai(card2) {
          const { sourcex, cardx, player: player2 } = get.event();
          if (get.effect(player2, cardx, sourcex, player2) >= 0 || get.damageEffect(sourcex, player2, player2) <= 0) {
            return 0;
          }
          return 7 - get.value(card2);
        }
      }).set("sourcex", source).set("cardx", card).forResult();
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const {
        cards: cards2,
        targets: [target]
      } = event;
      await player.modedDiscard(cards2);
      await target.damage();
      player.when({ global: "useCardAfter" }).filter((evt) => evt.card == trigger.card).step(async (event2, trigger2, player2) => {
        if (!player2.hasHistory("damage", (evt) => evt.card == trigger2.card)) {
          await player2.drawTo(player2.getHandcardLimit());
        }
      });
    }
  },
  olhuimin: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((target) => get.info("olhuimin").filterTarget(void 0, player, target));
    },
    selectTarget: [1, Infinity],
    filterTarget(card, player, target) {
      return target.countCards("h") <= target.getHp();
    },
    multiline: true,
    multitarget: true,
    async content(event, trigger, player) {
      const { targets } = event;
      await game.asyncDraw(targets.sortBySeat());
      const num = targets.filter((target) => target.countCards("h") > target.getHp()).length;
      if (num > 0) {
        player.addTempSkill(`${event.name}_effect`, { player: "phaseBeforeStart" });
        player.addMark(`${event.name}_effect`, num, false);
      }
    },
    ai: {
      order: 3,
      result: {
        target: 1
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "手牌上限+#"
        },
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("olhuimin_effect");
          }
        }
      }
    }
  },
  //界辛宪英
  olcaishi: {
    audio: 2,
    forced: true,
    locked: false,
    trigger: {
      player: "useCardAfter"
    },
    filter(event, player) {
      const type = get.type2(event.card);
      return player.getRoundHistory("useCard", (evt) => get.type2(evt.card) == type).indexOf(event) == 0;
    },
    async content(event, trigger, player) {
      player.addTempSkill(`${event.name}_effect`, "roundStart");
      player.addMark(`${event.name}_effect`, 1, false);
      if (!get.info("clanmuyin").isMax(player) && game.hasPlayer((target) => target.isDamaged())) {
        const result = await player.chooseTarget({
          prompt: "才识：你可以令一名角色回复1点体力，然后此技能本回合失效",
          filterTarget(card, player2, target) {
            return target.isDamaged();
          },
          ai(target) {
            return get.recoverEffect(target, get.player(), get.player());
          }
        }).forResult();
        if (result?.bool && result.targets?.length) {
          const {
            targets: [target]
          } = result;
          player.line(target, "green");
          await target.recover();
          player.tempBanSkill(event.name);
        }
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        markimage: "image/card/handcard.png",
        intro: {
          content: "手牌上限+#"
        },
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("olcaishi_effect");
          }
        }
      }
    }
  },
  olzhongjian: {
    audio: 2,
    enable: "phaseUse",
    usable(skill, player) {
      return 1 + player.countMark(skill);
    },
    filterTarget(card, player, target) {
      return player != target && target.countCards("h") > 0 && target.getHp() > 0;
    },
    async content(event, trigger, player) {
      const { target, name: name2 } = event;
      const result = await player.choosePlayerCard(target, "h", target.getHp(), true).forResult();
      const { cards: shown } = result;
      await player.showCards(shown, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
      if (!player.countCards("h")) {
        return;
      }
      const result2 = await player.chooseCard(`忠鉴：请你展示一张手牌`, "h", true).set("shown", shown).set("ai", (card2) => {
        let val = 0;
        const { shown: shown2 } = get.event();
        if (shown2.some((i) => get.color(i) == get.color(card2))) {
          val += 1;
        }
        if (shown2.some((i) => get.name(i) == get.name(card2))) {
          val += 2;
        }
        return val;
      }).forResult();
      const {
        cards: [card]
      } = result2;
      await player.showCards(card);
      if (shown.some((i) => get.color(i) == get.color(card))) {
        const result3 = await player.discardPlayerCard({
          prompt: `忠鉴：弃置${get.translation(target)}一张牌或取消你摸一张牌`,
          target,
          position: "he"
        }).forResult();
        if (!result3?.bool) {
          await player.draw();
        }
      }
      if (shown.some((i) => get.name(i) == get.name(card)) && !player.hasMark(name2)) {
        player.addMark(name2, 1, false);
        player.when({ global: "phaseChange" }).step(async (event2, trigger2, player2) => {
          player2.clearMark(name2, false);
        });
      }
    },
    ai: {
      order: 7,
      result: {
        target(player, target) {
          return -Math.min(target.getHp(), target.countCards("h"));
        }
      }
    }
  },
  //谋程昱
  olsbliduan: {
    audio: 2,
    forced: true,
    locked: false,
    mod: {
      aiOrder(player, card, num) {
        if (player.hasSkill("olsbliduan_trick") && get.type(card) == "trick" && get.info(card).allowMultiple !== false) {
          return num + 5;
        }
        if (player.hasSkill("olsbliduan_sha") && get.name(card) == "sha") {
          return num + 5;
        }
      }
    },
    trigger: {
      player: "useCardAfter"
    },
    filter(event, player) {
      return event.card.name == "sha" || get.type2(event.card) == "trick";
    },
    async content(event, trigger, player) {
      if (trigger.card.name == "sha") {
        player.addSkill("olsbliduan_trick");
        player.addMark("olsbliduan_trick", 1, false);
      }
      if (get.type2(trigger.card) == "trick") {
        player.addSkill("olsbliduan_sha");
        player.addMark("olsbliduan_sha", 1, false);
      }
    },
    subSkill: {
      sha: {
        charlotte: true,
        forced: true,
        popup: false,
        trigger: {
          player: "useCard2"
        },
        filter(event, player) {
          return event.card.name == "sha";
        },
        onremove: true,
        async content(event, trigger, player) {
          const num = player.countMark(event.name);
          player.removeSkill(event.name);
          const { card, targets } = trigger;
          const info = get.info(card);
          if (info.allowMultiple == false) {
            return;
          }
          if (targets?.length && !info.multitarget) {
            if (game.hasPlayer(function(target) {
              return !targets.includes(target) && lib.filter.targetEnabled2(card, player, target) && lib.filter.targetInRange(card, player, target);
            })) {
              const result = await player.chooseTarget(`戾断：可以为${get.translation(card)}额外选择至多${num}个目标`, [1, num], (_, player2, target) => {
                const { card: card2, targets: targets2 } = get.event();
                return !targets2.includes(target) && lib.filter.targetEnabled2(card2, player2, target) && lib.filter.targetInRange(card2, player2, target);
              }).set("card", card).set("targets", targets).set("ai", (target) => {
                return get.effect(target, get.event().card, get.player(), get.player());
              }).forResult();
              if (result?.bool && result.targets?.length) {
                const { targets: targets2 } = result;
                player.line(targets2);
                trigger.targets.addArray(targets2);
                game.log(targets2, "成为了", trigger.card, "的额外目标");
              }
            }
          }
        },
        mark: true,
        marktext: "杀",
        intro: {
          content: "你使用的下张【杀】目标+#"
        }
      },
      trick: {
        inherit: "olsbliduan_sha",
        filter(event, player) {
          return get.type2(event.card) == "trick";
        },
        marktext: "锦",
        intro: {
          content: "你使用的下张锦囊牌目标+#"
        }
      }
    }
  },
  olsbdanchi: {
    audio: 2,
    usable: 1,
    trigger: {
      global: "damageEnd"
    },
    logTarget: "player",
    check(event, player) {
      return event.source?.isIn() && event.source.isPhaseUsing();
    },
    filter(event, player) {
      return get.distance(player, event.player) <= 1;
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      const result = await target.chooseButton([`胆持：请选择一种类型`, [["basic", "trick", "equip"].map((i) => `caoying_${i}`), "vcard"]], true).set("ai", () => Math.random()).forResult();
      if (result.links?.length) {
        const type = result.links[0][2].slice(8);
        game.log(target, "选择了", `#g${get.translation(type)}`);
        target.popup(get.translation(type));
        const { source } = trigger;
        if (source?.isIn()) {
          const last = source.getHistory("useCard").length;
          player.when({
            global: ["useCardAfter", "phaseAfter", "phaseBeforeStart"]
          }).filter((evt) => {
            if (evt.name == "phase") {
              return true;
            }
            return evt.player == source && evt.player.getHistory("useCard").indexOf(evt) == last;
          }).step(async (event2, trigger2, player2) => {
            if (trigger2.name == "phase") {
              return;
            }
            const typex = get.type2(trigger2.card);
            await player2.chooseUseTarget({ card: get.autoViewAs({ name: "wuzhong", isCard: true }), forced: true });
            if (typex != type) {
              await player2.chooseUseTarget({ card: get.autoViewAs({ name: "sha", isCard: true }), addCount: false });
            }
          });
        }
      }
    }
  },
  old_olsbdanchi: {
    audio: 2,
    trigger: {
      source: "damageSource",
      player: "damageEnd"
    },
    filter(event, player, name2) {
      if (!event.card) {
        return false;
      }
      const evt = event.getParent((evtx) => evtx.name == "useCard" && evtx.card == event.card, true);
      if (!evt || !evt.targets?.some((target) => target.isIn())) {
        return false;
      }
      if (name2 == "damageSource") {
        return player.getHistory("sourceDamage", (evt2) => !!evt2.card).indexOf(event) == 0;
      }
      return player.getHistory("damage", (evt2) => !!evt2.card).indexOf(event) == 0;
    },
    check: () => true,
    logTarget(event, player) {
      const evt = event.getParent((evtx) => evtx.name == "useCard" && evtx.card == event.card, true);
      return evt.targets?.filter((target) => target.isIn()).sortBySeat();
    },
    chooseControl(player, source, eventId) {
      return player.chooseControl(["杀", "锦囊牌"]).set("prompt", `胆持：猜测${get.translation(source)}本回合下次使用的牌`).set("choice", Math.random() > 0.5 ? 0 : 1).set("id", eventId).set("_global_waiting", true);
    },
    async content(event, trigger, player) {
      const { targets } = event;
      const { source, card } = trigger;
      const map = await game.chooseAnyOL(targets, get.info(event.name).chooseControl, [source]).forResult();
      const list = [];
      for (const target of targets.sortBySeat()) {
        const { index, control } = map.get(target);
        list.push(index);
        target.popup(control);
        game.log(target, "猜测了", "#y" + control);
      }
      const sourcex = player;
      source.when({
        global: ["phaseBeforeStart", "phaseAfter", "phaseEnd"],
        player: "useCard"
      }).filter((evt) => true).step(async (event2, trigger2, player2) => {
        if (trigger2.name == "useCard") {
          const { card: cardx } = trigger2;
          sourcex.when({ global: "phaseEnd" }).step(async (event3, trigger3, player3) => {
            const action = [
              () => player3.draw(2),
              () => {
                const sha = get.autoViewAs({ name: "sha", isCard: true });
                if (player3.hasUseTarget(sha, true, false)) {
                  return player3.chooseUseTarget(sha, true, false);
                }
              }
            ];
            if (get.name(cardx) == "sha") {
              if (list.some((i) => i == 0)) {
                await action[0]();
              }
              if (list.some((i) => i != 0)) {
                await action[1]();
              }
            } else if (get.type2(cardx) == "trick") {
              if (list.some((i) => i == 1)) {
                await action[0]();
              }
              if (list.some((i) => i != 1)) {
                await action[1]();
              }
            } else {
              await action[1]();
            }
          });
        } else if (event2.triggername == "phaseEnd") {
          const sha = get.autoViewAs({ name: "sha", isCard: true });
          if (player2.hasUseTarget(sha, true, false)) {
            await player2.chooseUseTarget(sha, true, false);
          }
        }
      });
    }
  },
  //谋董昭
  olsbshunji: {
    audio: 3,
    trigger: {
      global: "damageEnd"
    },
    filter(event, player) {
      return !player.getStorage("olsbshunji_used").includes(event.player) && event.player?.isIn();
    },
    logTarget: "player",
    check(event, player) {
      const target = event.player;
      if (target == player) {
        return true;
      }
      const att = get.attitude(player, target);
      const hs = player.getCards("he", (card) => !player.hasCard((cardx) => cardx != card && get.name(cardx) == get.name(card) && !player.getStorage(`olsbshunji_damaged`).includes(get.name(card)), "he"));
      if (hs.length && att <= 0 && get.damageEffect(target, player, player) > 0) {
        return true;
      }
      if (att > 0 && player.hasCard((card) => !hs.includes(card), "he")) {
        return true;
      }
      return false;
    },
    async cost(event, trigger, player) {
      const result = await player.chooseControl("一张", "两张", "cancel2").set("prompt", get.prompt2(event.skill, trigger.player)).set("ai", () => {
        const { resultx, att } = get.event();
        if (!resultx) {
          return "cancel2";
        }
        return att > 0 ? 1 : 0;
      }).set("att", get.attitude(player, trigger.player)).set("resultx", get.info(event.skill).check(trigger, player)).forResult();
      if (result.control != "cancel2") {
        event.result = {
          bool: true,
          cost_data: result.index + 1
        };
      }
    },
    async content(event, trigger, player) {
      const {
        targets: [target],
        cost_data: num
      } = event;
      player.addTempSkill(`${event.name}_used`, "roundStart");
      player.markAuto(`${event.name}_used`, target);
      await player.draw(num);
      if (player == target) {
        return;
      }
      const damaged = player.getStorage(`${event.name}_damaged`);
      const hs = player.getCards("he", (card) => !damaged.includes(get.name(card), "he"));
      if (hs.length) {
        player.addGaintag(hs, `${event.name}_tag`);
      }
      const result = await player.chooseToGive(target, "he", true, num).set("hs", hs).set("custom", {
        add: {
          confirm(bool) {
            get.player().removeGaintag(`olsbshunji_tag`);
          }
        },
        replace: {}
      }).set("ai", (card) => {
        const { player: player2, target: target2, hs: hs2 } = get.event();
        const att = get.attitude(player2, target2);
        if (att > 0) {
          if (hs2.includes(card)) {
            return 0;
          }
          return get.value(card);
        } else {
          if (hs2.includes(card)) {
            return 7.5 - get.value(card);
          }
          return 5 - get.value(card);
        }
      }).forResult();
      player.removeGaintag(`${event.name}_tag`);
      if (result?.bool && result.cards?.length) {
        const { cards: cards2 } = result;
        const names = cards2.filter((card) => {
          const name2 = get.name(card);
          return !player.hasCard((i) => get.name(i) == name2, "he") && !damaged.includes(name2);
        }).map((card) => get.name(card)).toUniqued();
        if (names?.length) {
          player.markAuto(`${event.name}_damaged`, names);
          await target.damage();
        }
      }
    },
    subSkill: {
      used: {
        intro: {
          content: "本轮已触发：$"
        },
        charlotte: true,
        onremove: true
      },
      tag: {
        name: "可伤害"
      }
    }
  },
  olsbyishi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterCard(card, player) {
      const { cards: cards2 } = ui.selected;
      if (!cards2?.length) {
        return true;
      }
      return !cards2.some((cardx) => get.suit(cardx) == get.suit(card));
    },
    filterOk() {
      const { cards: cards2 } = ui.selected;
      if (cards2?.length) {
        const player = get.player();
        const suits = player.getCards("h").map((card) => get.suit(card)).unique();
        return cards2.map((card) => get.suit(card)).unique().length == suits.length;
      }
      return false;
    },
    complexCard: true,
    selectCard: [1, Infinity],
    lose: false,
    discard: false,
    delay: false,
    check(card) {
      return get.value(card);
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      await player.showCards(cards2, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
      let discard = player.getCards("h", (card) => !cards2.includes(card));
      if (discard.length) {
        await player.loseToDiscardpile(discard);
      }
      if (player.canMoveCard()) {
        const result = await player.moveCard(true).forResult();
        if (result?.card && !discard?.length) {
          const { card } = result;
          player.addTempSkill(`${event.name}_draw`, { player: "phaseBeginStart" });
          player.markAuto(`${event.name}_draw`, get.suit(card));
        }
      }
    },
    subSkill: {
      draw: {
        audio: "olsbyishi",
        charlotte: true,
        onremove: true,
        forced: true,
        intro: {
          content: "不因使用失去$牌后，摸一张牌"
        },
        trigger: {
          player: "loseAfter",
          global: ["loseAsyncAfter", "gainAfter", "addToExpansionAfter", "equipAfter", "addJudgeAfter"]
        },
        filter(event, player) {
          if (event.name.startsWith("lose")) {
            const evt = event.relatedEvent || event.getParent();
            if (evt.name == "useCard") {
              return false;
            }
          }
          const suits = player.getStorage("olsbyishi_draw");
          return event.getl?.(player)?.cards2?.some((card) => suits.includes(get.suit(card)));
        },
        async content(event, trigger, player) {
          await player.draw();
        }
      }
    },
    ai: {
      order: 2,
      result: {
        player(player, target) {
          const suits = player.getCards("h").map((card) => get.suit(card)).unique();
          const num = player.needsToDiscard();
          if (player.canMoveCard(true) && num >= player.countCards("h") - suits.length) {
            return 1;
          }
          return 0;
        }
      }
    }
  },
  //魔曹操
  olbachao: {
    audio: 5,
    trigger: {
      player: "phaseUseBegin"
    },
    filter(event, player) {
      return game.hasPlayer((current) => current != player);
    },
    logTarget(event, player) {
      return game.filterPlayer((current) => current != player);
    },
    check(event, player) {
      if (player.hp > 1) {
        return true;
      }
      return game.countPlayer((current) => current != player) > 1;
    },
    chooseToGive(target, player) {
      const next = target.chooseCard(`霸朝：是否交给${get.translation(player)}一张牌`, "he");
      next.set("sourcex", player);
      next.set("att", get.attitude(target, player));
      next.set("ai", (card) => {
        const { player: player2, att, sourcex } = get.event();
        if (att > 0) {
          return 15 - get.value(card);
        }
        if (game.countPlayer((current) => current != sourcex) <= 3) {
          return (get.type(card) != "basic" ? 10 : 8) - get.value(card);
        }
        return 0;
      });
      return next;
    },
    async content(event, trigger, player) {
      const map = await game.chooseAnyOL(event.targets, get.info(event.name).chooseToGive, [player]).forResult();
      if (!map.size) {
        return;
      }
      const cards2 = [];
      for (const target of Array.from(map.keys())) {
        const result2 = map.get(target);
        if (result2?.bool && result2.cards?.length) {
          cards2.addArray(result2.cards);
        }
      }
      let next;
      if (cards2.length) {
        next = player.gain(cards2, "giveAuto");
        await next;
      }
      const targets = game.filterPlayer((current) => {
        return !current.hasHistory("lose", (evt) => evt.getParent() == next && get.type(evt.cards[0]) != "basic");
      });
      if (!targets.length) {
        return;
      }
      const result = await player.chooseTarget("霸朝：是否对一名未交给你非基本牌的角色造成1点伤害", (card, player2, target) => {
        return get.event().targetx.includes(target);
      }).set("targetx", targets).set("ai", (target) => {
        const player2 = get.player();
        return get.damageEffect(target, player2, player2);
      }).forResult();
      if (result?.bool && result.targets?.length) {
        const target = result.targets[0];
        player.line(target, "green");
        await target.damage(player);
        if (target == player) {
          player.addTempSkill("olbachao_effect", { global: "phaseAnyAfter" });
          player.addGaintag(player.getCards("h"), "olbachao_effect");
          if (!player.hasSkill("olrumo", null, null, false)) {
            player.addSkill("olrumo");
          }
        }
      }
    },
    subSkill: {
      effect: {
        onremove(player, skill) {
          player.removeGaintag(skill);
        },
        trigger: {
          player: "useCard1"
        },
        firstDo: true,
        charlotte: true,
        filter(event, player) {
          if (event.addCount === false) {
            return false;
          }
          return player.hasHistory("lose", (evt) => {
            const evtx = evt.relatedEvent || evt.getParent();
            if (evtx != event) {
              return false;
            }
            return Object.values(evt.gaintag_map)?.flat()?.includes("olbachao_effect");
          });
        },
        async cost(event, trigger, player) {
          trigger.addCount = false;
          const stat = player.getStat("card"), name2 = trigger.card.name;
          if (typeof stat[name2] == "number" && stat[name2] > 0) {
            stat[name2]--;
          }
        },
        mod: {
          targetInRange(card, player) {
            if (get.number(card) === "unsure" || card.cards?.some((card2) => card2.hasGaintag("olbachao_effect"))) {
              return true;
            }
          },
          cardUsable(card, player) {
            if (get.number(card) === "unsure" || card.cards?.some((card2) => card2.hasGaintag("olbachao_effect"))) {
              return Infinity;
            }
          }
        }
      }
    }
  },
  olfuzai: {
    audio: 5,
    enable: "chooseToUse",
    locked: true,
    filter(event, player) {
      const hs = player.getCards("he", (card) => get.type(card) == "equip");
      if (!hs.length) {
        return false;
      }
      return ["jiedao", "wuzhong"].some((name2) => {
        return hs.some((card) => {
          const vcard = get.autoViewAs({ name: name2 }, [card]);
          return event.filterCard(vcard, player, event) && player.hasUseTarget(vcard);
        });
      });
    },
    chooseButton: {
      dialog(event, player) {
        const hs = player.getCards("he", (card) => get.type(card) == "equip");
        const list = ["jiedao", "wuzhong"].filter((name2) => {
          return hs.some((card) => {
            const vcard = get.autoViewAs({ name: name2 }, [card]);
            return event.filterCard(vcard, player, event) && player.hasUseTarget(vcard);
          });
        });
        const dialog = ui.create.dialog("覆载", [list, "vcard"], "hidden");
        dialog.direct = true;
        return dialog;
      },
      check(button) {
        const player = get.player(), card = get.autoViewAs({ name: button.link[2] }, "unsure");
        return player.getUseValue(card);
      },
      backup(links, player) {
        return {
          viewAs: {
            name: links[0][2]
          },
          position: "he",
          filterCard(card, player2) {
            return get.type(card) == "equip";
          },
          async precontent(event, trigger, player2) {
            event.result.skill = "olfuzai";
          }
        };
      },
      prompt(links, player) {
        return "将一张装备牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
      }
    },
    hiddenCard(player, name2) {
      if (!["jiedao", "wuzhong"].includes(name2)) {
        return false;
      }
      return player.countCards("he", (card) => get.type(card) == "equip") > 0;
    },
    mod: {
      cardEnabled(card, player) {
        if (["jiedao", "wuzhong"].includes(get.name(card))) {
          return;
        }
        const hs = player.getCards("he", (card2) => get.type(card2) == "equip");
        if (get.type(card) == "equip" && "cards" in card && Array.isArray(card.cards) && card.cards.containsSome(...hs)) {
          return false;
        }
      },
      cardSavable(card, player) {
        if (["jiedao", "wuzhong"].includes(get.name(card))) {
          return;
        }
        const hs = player.getCards("he", (card2) => get.type(card2) == "equip");
        if (get.type(card) == "equip" && "cards" in card && Array.isArray(card.cards) && card.cards.containsSome(...hs)) {
          return false;
        }
      }
    },
    ai: {
      order: 8,
      result: {
        player: 1
      }
    },
    intro: {
      content: "视为装备着：$"
    },
    onremove(player, skill) {
      player.removeAdditionalSkill(skill);
      player.setStorage(skill, null, true);
    },
    group: "olfuzai_equip",
    subSkill: {
      equip: {
        audio: "olfuzai",
        trigger: {
          global: ["phaseBefore", "loseAfter", "loseAsyncAfter", "equipAfter", "addToExpansionAfter", "addJudgeAfter", "gainAfter"],
          player: ["enterGame", "expandEquipAfter", "disableEquipAfter", "enableEquipAfter", "changeHpAfter", "changeSkillsAfter"]
        },
        filter(event, player) {
          if (player.countCards("e")) {
            return player.getStorage("olfuzai").length;
          }
          if (event.name == "phase" && game.phaseNumber !== 0) {
            return false;
          }
          if (event.name == "changeSkills" && !event.addSkill?.includes("olfuzai")) {
            return false;
          }
          if (event.name.indexOf("Equip") > 0) {
            if (event.name == "disableEquip") {
              return player.getStorage("olfuzai").some((name2) => {
                const slot = get.subtype(name2);
                return event.slots.includes(slot) && !player.hasEmptySlot(slot);
              });
            }
            return ["equip1", "equip2"].some((slot) => {
              if (!event.slots.includes(slot) || !player.hasEmptySlot(slot)) {
                return false;
              }
              return !player.getStorage("olfuzai").some((name2) => get.subtype(name2) == slot);
            });
          }
          if (event.name != "changeHp" && player.getStorage("olfuzai").length) {
            return false;
          }
          return player.hasEmptySlot(1) || player.hasEmptySlot(2);
        },
        forced: true,
        async content(event, trigger, player) {
          if (player.getStorage("olfuzai").length) {
            let list = [];
            if (trigger.name == "disableEquip") {
              list = player.getStorage("olfuzai").filter((name2) => {
                return player.hasEmptySlot(get.subtype(name2));
              });
            }
            if (list.length) {
              player.setStorage("olfuzai", list, true);
              const skills3 = [];
              for (const name2 of list) {
                const info = lib.card[name2];
                if (info?.skills && Array.isArray(info.skills)) {
                  skills3.addArray(info.skills);
                }
              }
              player.addExtraEquip(`olfuzai`, list, true);
              if (skills3.length) {
                player.addAdditionalSkill("olfuzai", skills3);
              }
            } else {
              player.removeExtraEquip("olfuzai");
              player.setStorage("olfuzai", [], true);
              player.removeAdditionalSkill("olfuzai");
            }
          }
          if (player.countCards("e")) {
            return;
          }
          const cards2 = [];
          const check = (slot) => {
            if (!player.hasEmptySlot(slot)) {
              return false;
            }
            return player.getStorage("olfuzai").every((name2) => get.subtype(name2) != slot);
          };
          if (check("equip1")) {
            const equip1 = lib.inpile.filter((name2) => get.subtype(name2) == "equip1").concat(["qibaodao", "baipidao"]).randomSort();
            let card = equip1.find((name2) => {
              const info = lib.card[name2];
              let range = 1;
              if (info?.distance?.attackFrom) {
                range -= info.distance.attackFrom;
              }
              return range == player.getHp();
            });
            if (!card) {
              card = equip1.randomGet();
            }
            cards2.push(card);
          }
          if (check("equip2")) {
            const equip2 = lib.inpile.filter((name2) => get.subtype(name2) == "equip2").randomSort();
            let card = equip2.find((name2) => {
              const num = get.cardNameLength(name2);
              return num == player.getHp();
            });
            if (!card) {
              card = equip2.randomGet();
            }
            cards2.push(card);
          }
          if (!cards2.length) {
            return;
          }
          const skills2 = [];
          for (const name2 of cards2) {
            const info = lib.card[name2];
            if (info?.skills && Array.isArray(info.skills)) {
              skills2.addArray(info.skills);
            }
          }
          player.addExtraEquip(`olfuzai`, cards2, true);
          if (skills2.length) {
            player.addAdditionalSkill("olfuzai", skills2);
          }
          player.setStorage("olfuzai", cards2, true);
        },
        mod: {
          attackRangeBase(player) {
            const equips = player.getStorage("olfuzai");
            let range = 1;
            for (const card of equips) {
              const info = lib.card[card];
              if (info?.distance?.attackFrom) {
                range -= info.distance.attackFrom;
              }
            }
            return Math.max(player.getEquipRange(player.getCards("e")), range);
          }
        }
      }
    }
  },
  //谋戏子
  olsbxinchuan: {
    audio: 2,
    trigger: {
      global: "cardsDiscardAfter"
    },
    getSuits() {
      const suits = [];
      game.getGlobalHistory("cardMove", (evt) => {
        if (suits.length >= 4) {
          return;
        }
        if (evt.name == "lose") {
          if (evt.position == ui.discardPile) {
            for (let i of evt.cards) {
              if (get.position(i) == "d") {
                const suit = get.suit(i, false);
                if (suit && lib.suit.includes(suit)) {
                  suits.add(suit);
                }
              }
            }
          }
        } else {
          if (evt.name == "cardsDiscard") {
            for (let i of evt.cards) {
              if (get.position(i) == "d") {
                const suit = get.suit(i, false);
                if (suit && lib.suit.includes(suit)) {
                  suits.add(suit);
                }
              }
            }
          }
        }
      });
      return suits;
    },
    filter(event, player) {
      const evt = event.getParent();
      if (evt.name != "orderingDiscard") {
        return false;
      }
      const suits = get.info("olsbxinchuan").getSuits();
      if (suits.length >= 4) {
        return false;
      }
      const evtx = evt.relatedEvent || evt.getParent();
      return player.hasHistory("useCard", (evtxx) => {
        if (get.type2(evtxx.card) != "trick") {
          return false;
        }
        return evtx.getParent() == (evtxx.relatedEvent || evtxx.getParent());
      });
    },
    async cost(event, trigger, player) {
      const suits = get.info(event.skill).getSuits(), num = 4 - suits.length;
      let prompt = get.prompt2(event.skill).replaceAll("为本回合弃牌堆缺少的花色数", `目前为${num}`);
      event.result = await player.chooseTarget(prompt).set("numx", num).set("ai", (target) => {
        const { player: player2, numx: num2 } = get.event();
        let list = [1, -1].map((key) => Array.from(Array(num2)).map((i) => key)).flat(), current = target, map = /* @__PURE__ */ new Map(), att = get.sgnAttitude(player2, current), val = 0.4 * att;
        while (list.length) {
          let count = list.shift();
          map.set(current, (map.has(current) ? map.get(current) : 0) + count);
          val += att * count;
          if (current.countCards("h") + map.get(current) == current.getHp()) {
            current = current.getNext();
            att = get.sgnAttitude(player2, current);
          }
        }
        return val;
      }).forResult();
    },
    async content(event, trigger, player) {
      const draw = async (current2) => await current2.draw(), discard = async (current2) => {
        if (current2.countDiscardableCards(current2, "he")) {
          await current2.chooseToDiscard("he", true);
        }
      };
      let num = 4 - get.info(event.name).getSuits().length, count = 0, current = event.targets[0];
      while (count < num) {
        if (!current) {
          break;
        }
        count++;
        await draw(current);
        if (current.countCards("h") == current.getHp()) {
          current = current.getNext();
          while (!current?.isIn()) {
            current = current.getNext();
          }
        }
        num = 4 - get.info(event.name).getSuits().length;
      }
      count = 0;
      while (count < num) {
        if (!current) {
          break;
        }
        count++;
        await discard(current);
        if (current.countCards("h") == current.getHp()) {
          current = current.getNext();
          while (!current?.isIn()) {
            current = current.getNext();
          }
        }
        num = 4 - get.info(event.name).getSuits().length;
      }
    }
  },
  olsbjinjin: {
    audio: 2,
    enable: "chooseToUse",
    onChooseToUse(event) {
      if (game.online) {
        return;
      }
      event.set("olsbjinjin", get.discarded().filterInD("d"));
    },
    filter(event, player) {
      if (!event.olsbjinjin?.length) {
        return false;
      }
      return get.inpileVCardList((info) => {
        if (info[0] !== "trick") {
          return false;
        }
        const card = new lib.element.VCard({ name: info[2], isCard: true });
        return event.filterCard(card, player, event);
      }).length;
    },
    chooseButton: {
      dialog(event, player) {
        const cards2 = get.inpileVCardList((info) => {
          if (info[0] !== "trick") {
            return false;
          }
          const card = new lib.element.VCard({ name: info[2], isCard: true });
          return event.filterCard(card, player, event);
        });
        return ui.create.dialog("金烬", [cards2, "vcard"]);
      },
      check(button) {
        const player = get.player(), link = button.link;
        const card = new lib.element.VCard({ name: link[2], isCard: true });
        return player.getUseValue(card);
      },
      backup(links, player) {
        return {
          audio: "olsbjinjin",
          filterCard: () => false,
          selectCard: -1,
          popname: true,
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            isCard: true
          },
          log: false,
          async precontent(event, trigger, player2) {
            const skill = "olsbjinjin";
            player2.logSkill(skill);
            const cards2 = get.discarded().filterInD("d");
            if (cards2.length) {
              const num = cards2.reduce((list, card) => list.add(get.suit(card, false)), []).length;
              const result = cards2.length == 1 ? { bool: true, links: cards2 } : await player2.chooseButton(["金烬：移出任意张花色各不相同的牌", cards2], [1, num], true).set("filterButton", (button) => {
                const suit = get.suit(button.link, false);
                return ui.selected.buttons?.every((buttonx) => get.suit(buttonx.link, false) !== suit);
              }).set("complexSelect", true).forResult();
              if (result?.bool && result.links?.length) {
                const next = player2.addToExpansion(result.links, "draw2");
                next.gaintag.add(skill);
                await next;
                game.log(player2, "将", result.links, "移出了游戏");
              }
            }
            await player2.removeSkills(skill);
            player2.markSkill(skill);
            player2.when({
              global: "phaseEnd"
            }).filter((evt) => player2.hasHistory("damage")).step(async (event2, trigger2, player3) => {
              const result = await player3.chooseTarget(`###金烬###令一名角色获得〖金烬〗${player3.countExpansions(skill) ? `和${get.translation(player3.getExpansions(skill))}` : ""}`, true).set("ai", (target) => {
                return get.attitude(get.player(), target);
              }).forResult();
              if (result?.bool && result.targets?.length) {
                const target = result.targets[0];
                player3.line(target, "green");
                const cards3 = player3.getExpansions(skill);
                if (cards3?.length) {
                  await target.gain(cards3, "give", player3);
                }
                await target.addSkills(skill);
              }
            }).assign({ audio: "olsbjinjin", popup: true }).translation("金烬");
          }
        };
      },
      prompt(links, player) {
        return `###金烬###选择${get.translation(links[0][2])}的目标`;
      }
    },
    marktext: "烬",
    intro: {
      mark(dialog, storage, player) {
        const cards2 = player.getExpansions("olsbjinjin");
        if (player.isUnderControl(true)) {
          dialog.addAuto(cards2);
        } else {
          return "共有" + get.cnNumber(cards2.length) + "张牌";
        }
      },
      markcount: "expansion"
    },
    hiddenCard(player, name2) {
      if (get.type(name2) != "trick") {
        return false;
      }
      return get.discarded().filterInD("d").length;
    },
    ai: {
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
    subSkill: { backup: {} }
  },
  //闪朱儁
  olfendi: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return event.targets.length == 1 && event.card.name == "sha" && event.targets[0].countCards("h") > 0;
    },
    logTarget: "target",
    async cost(event, trigger, player) {
      const { target } = trigger;
      event.result = await player.choosePlayerCard(target, "h", [1, player.maxHp], `分敌：展示${get.translation(target)}至多${get.cnNumber(player.maxHp, true)}张手牌`, "allowChooseAll").set("ai", (button) => {
        if (_status.event.all) {
          return 1;
        }
        if (ui.selected.buttons.length) {
          return 0;
        }
        return Math.random();
      }).set("all", !target.mayHaveShan(player, "use") && Math.random() < 0.75).set("forceAuto", true).forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2, name: name2 } = event, { target } = trigger;
      await target.showCards(cards2, get.translation(player) + "对" + get.translation(target) + "发动了【分敌】");
      target.addTempSkill("olfendi_tag");
      target.addGaintag(cards2, "olfendi_tag");
      target.markAuto("olfendi_tag", [trigger.getParent()]);
      player.when({
        source: "damageSource",
        player: "useCardAfter"
      }).filter((evt) => {
        if (evt.name == "useCard") {
          return evt == trigger.getParent();
        }
        return evt.getParent((evtx) => evtx == trigger.getParent(), true) && evt.player == target;
      }).step(async (event2, trigger2, player2) => {
        if (trigger2.name == "useCard") {
          return;
        }
        player2.logSkill(name2, [target]);
        const cardsx = [...target.getCards("h"), ...Array.from(ui.discardPile)].filter((card) => cards2.includes(card));
        if (cardsx.length) {
          await player2.gain(cardsx, "give");
        }
      });
    },
    subSkill: {
      tag: {
        charlotte: true,
        onremove(player, skill) {
          player.removeGaintag(skill);
          delete player.storage[skill];
        },
        trigger: { global: "useCardAfter" },
        filter(event, player) {
          return player.getStorage("olfendi_tag").includes(event);
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const { name: name2 } = event;
          player.unmarkAuto(name2, [trigger]);
          if (!player.getStorage(name2).length) {
            player.removeSkill(name2);
          }
        },
        mod: {
          cardEnabled(card, player) {
            if (!card?.cards?.length || card.cards?.some((i) => !i.hasGaintag("olfendi_tag"))) {
              return false;
            }
            if (get.itemtype(card) == "card") {
              if (!card.hasGaintag("olfendi_tag")) {
                return false;
              }
            }
          },
          cardRespondable(card, player) {
            return lib.skill.olfendi_tag.mod.cardEnabled.apply(this, arguments);
          },
          cardSavable(card, player) {
            return lib.skill.olfendi_tag.mod.cardEnabled.apply(this, arguments);
          }
        }
      }
    }
  },
  oljuxiang: {
    audio: 2,
    trigger: {
      player: "gainAfter",
      global: "loseAsyncAfter"
    },
    usable: 1,
    filter(event, player) {
      const evt = event.getParent("phaseDraw");
      if (evt?.name == "phaseDraw") {
        return false;
      }
      const hs = player.getCards("h"), cards2 = event.getg(player).filter((i) => hs.includes(i));
      return cards2.length && cards2.every((card) => lib.filter.cardDiscardable(card, player, "oljuxiang"));
    },
    check(event, player) {
      const target = _status.currentPhase;
      if (!target || get.attitude(player, target) <= 0) {
        return false;
      }
      const evt = event.getParent("phase");
      if (!evt || !evt.phaseList.some((phase, index) => index >= evt.num && phase.startsWith("phaseUse"))) {
        return false;
      }
      if (target.getCardUsable({ name: "sha" }) >= target.countCards("hs", "sha")) {
        return false;
      }
      if (!target.hasValueTarget({ name: "sha" })) {
        return false;
      }
      const hs = player.getCards("h"), cards2 = event.getg(player).filter((i) => hs.includes(i));
      return cards2.reduce((val, card) => val + get.value(card), 0) < 10;
    },
    prompt2(event, player) {
      const hs = player.getCards("h"), cards2 = event.getg(player).filter((i) => hs.includes(i)), target = _status.currentPhase;
      let str = `弃置${get.translation(cards2)}`;
      if (target?.isIn()) {
        str = `${str}，然后令${get.translation(target)}本回合出杀次数+${cards2.length}`;
      }
      return str;
    },
    async content(event, trigger, player) {
      const hs = player.getCards("h"), cards2 = trigger.getg(player).filter((i) => hs.includes(i));
      await player.modedDiscard(cards2);
      const target = _status.currentPhase;
      if (target?.isIn()) {
        player.line(target);
        target.addTempSkill("oljuxiang_sha");
        target.addMark("oljuxiang_sha", cards2.length, false);
      }
    },
    subSkill: {
      sha: {
        charlotte: true,
        intro: { content: "使用【杀】的次数上限+#" },
        onremove: true,
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.countMark("oljuxiang_sha");
            }
          }
        }
      }
    }
  },
  //闪孙坚
  olpingtao: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const { target } = event;
      const att = get.attitude(target, player);
      const card = new lib.element.VCard({ name: "sha", isCard: true });
      const bool = player.canUse(card, target, false, true);
      if (!bool && !target.hasCards("he")) {
        return;
      }
      const result = await target.chooseToGive(player, `${get.translation(player)}对你发动了【平讨】`, `交给其一张牌并令其本回合获得一个“讨”标记${bool ? "；或点击“取消”令其视为对你使用一张【杀】" : ""}`, "he").set("ai", (card2) => {
        const { give, att: att2 } = get.event();
        if (give) {
          if (card2.name == "tao" || card2.name == "jiu") {
            return 0;
          }
          return 8 - get.value(card2);
        }
        if (att2 < 0 && card2.name == "sha") {
          return -1;
        }
        return 6 - get.value(card2);
      }).set("forced", !bool).set("give", !bool || (att >= 0 || target.hp == 1 && target.countCards("hs", "shan") <= 1) && get.effect(target, { name: "sha" }, player, target) < 0).set("att", att).forResult();
      if (result?.bool && result.cards?.length) {
        player.addTempSkill(event.name + "_sha");
        player.addMark(event.name + "_sha", 1);
      } else if (player.canUse(card, target, false, true)) {
        await player.useCard(card, target);
      }
    },
    ai: {
      expose: 0.15,
      order: 8,
      result: {
        target(player, target) {
          if (get.attitude(player, target) >= 0) {
            return Math.sqrt(target.countCards("he"));
          }
          if (player.countCards("hs", "sha")) {
            return -0.2;
          }
          return get.effect(target, { name: "sha", isCard: true }, player, target);
        }
      }
    },
    subSkill: {
      sha: {
        audio: "olpingtao",
        charlotte: true,
        onremove: true,
        marktext: "讨",
        intro: { content: "本回合使用的【杀】可弃置一枚“讨”并额外指定一个目标" },
        trigger: {
          player: "useCard1"
        },
        filter(event, player) {
          return event.card?.name == "sha" && player.hasMark("olpingtao_sha");
        },
        async cost(event, trigger, player) {
          const targets = game.filterPlayer((current) => {
            return !trigger.targets?.includes(current) && lib.filter.targetEnabled2(trigger.card, trigger.player, current) && lib.filter.targetInRange(trigger.card, trigger.player, current);
          }), num = Math.min(player.countMark(event.skill), targets.length);
          if (num <= 0) {
            return;
          }
          event.result = await player.chooseTarget(`平讨：弃置一枚“讨”并为此杀额外指定一个目标`, (card, player2, target) => {
            return get.event().targetx.includes(target);
          }).set("targetx", targets).set("ai", (target) => {
            const trigger2 = get.event().getTrigger();
            return get.effect(target, trigger2.card, trigger2.player, trigger2.player);
          }).forResult();
        },
        async content(event, trigger, player) {
          player.removeMark(event.name, 1);
          trigger.targets.addArray(event.targets);
        }
      }
    }
  },
  oljuelie: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return player.hasCard((card) => {
        if (get.position(card) === "h" && _status.connectMode) {
          return true;
        }
        return lib.filter.cardDiscardable(card, player);
      }, "he") && event.card.name == "sha" && player.getHp() > 0 && event.isFirstTarget;
    },
    logTarget: "targets",
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard(get.prompt(event.skill, trigger.targets), [1, player.getHp()], "he").set("allowChooseAll", true).set("ai", (card) => {
        if (ui.selected.cards.length >= _status.event.max) {
          return 0;
        }
        if (_status.event.goon) {
          return 4.5 - get.value(card);
        }
        return 0;
      }).set(
        "max",
        trigger.targets.reduce((sum, target) => sum + target.countDiscardableCards(player, "he"), 0)
      ).set(
        "goon",
        trigger.targets.every((target) => get.attitude(player, target) < 0)
      ).set("chooseonly", true).forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      await player.discard(cards2);
      let num = cards2.length;
      const targets = [...trigger.targets].sortBySeat();
      for (let index = 0; index < targets.length; index++) {
        const next = targets[index].chooseToDiscard("he");
        next.forced = index === targets.length - 1;
        next.selectCard = next.forced ? num : [1, num];
        const result = await next.forResult();
        if (result?.bool && result.cards?.length) {
          num -= result.cards.length;
          if (num <= 0) {
            break;
          }
        }
      }
      player.addTempSkill("oljuelie_draw");
      const evt = trigger.getParent();
      evt.card.storage ??= {};
      evt.card.storage.oljuelie = true;
      if (player.isMinHandcard() || player.isMinHp()) {
        evt.baseDamage ??= 1;
        evt.baseDamage++;
      }
    },
    group: "oljuelie_draw",
    subSkill: {
      draw: {
        charlotte: true,
        audio: "oljuelie",
        trigger: { source: "dieAfter" },
        filter(event, player) {
          return event.reason?.getParent((evt) => evt.name == "useCard" && evt.card.storage?.oljuelie, true);
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          await player.drawTo(player.maxHp);
        }
      }
    },
    ai: {
      unequip_ai: true,
      skillTagFilter(player, tag, arg) {
        if (!arg || !arg.name || arg.name != "sha") {
          return false;
        }
        if (!arg.target) {
          return false;
        }
        var card = arg.target.getEquip(2);
        return card && get.value(card) > 0 && player.hasCard((cardx) => {
          return lib.filter.cardDiscardable(cardx, player, "oljuelie") && get.value(cardx) < 5;
        });
      }
    }
  },
  //魔孙权
  olquanyu: {
    init(player, skill) {
      player.storage[skill] ??= /* @__PURE__ */ new Map([]);
    },
    audio: 2,
    trigger: {
      global: "roundStart",
      player: "useCardToPlayer"
    },
    filter(event, player) {
      if (event.name === "useCardToPlayer") {
        if (event.card.name !== "sha" || !event.isFirstTarget || event.targets.length > 1) return false;
        const storage = player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(player) ?? [[], void 0];
        const choice = storage[1], filter = lib.skill[choice]?.filter;
        if (!choice) return false;
        return filter ? filter(event, player) : true;
      }
      return game.hasPlayer((target) => (player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(target) ?? [[], void 0])[0].length < 6);
    },
    forced: true,
    logTarget(event, player) {
      if (event.name === "useCardToPlayer") return event.target;
      return game.filterPlayer((target) => (player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(target) ?? [[], void 0])[0].length < 6).sortBySeat(player);
    },
    async content(event, trigger, player) {
      if (trigger.name === "useCardToPlayer") {
        const choice = player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(player)?.[1];
        if (choice) await lib.skill[choice].contentx(trigger, player);
        return;
      }
      const result = await game.chooseAnyOL(
        event.targets,
        (target, player2) => {
          const choosed = (player2.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(target) ?? [[], void 0])[0];
          const choices = ["baihong", "qingming", "bixie", "zidian", "baili", "liuxing"].map((i) => `olquanyu_${i}`);
          return target.chooseButton(
            [
              '###权御###<div class="text center">请选择一项“权御”效果</div>',
              [choices.slice(0, 3).map((i) => [i, lib.skill[i].description]), "tdnodes"],
              [choices.slice(3).map((i) => [i, lib.skill[i].description]), "tdnodes"],
              [
                (dialog) => {
                  dialog.buttons.forEach((i) => {
                    i.style.setProperty("width", "120px", "important");
                    i.style.setProperty("text-align", "center", "important");
                  });
                },
                "handle"
              ]
            ],
            true
          ).set("choosed", choosed).set("filterButton", (button) => {
            return !get.event().choosed?.includes(button.link);
          }).set("ai", () => 1 + Math.random()).set("_global_waiting", true);
        },
        [player]
      ).forResult();
      if (result) {
        player.addTempSkill("olquanyu_clear", "roundStart");
        let num = 0, choice = result.get(player)?.links?.[0];
        for (const [target, result2] of result.entries()) {
          const choice2 = result2.links?.[0];
          if (!choice2) continue;
          player.storage.olquanyu ??= /* @__PURE__ */ new Map([]);
          const choosed = (player.storage.olquanyu.get(target) ?? [[], void 0])[0];
          const choices = [...choosed, choice2];
          player.storage.olquanyu.set(target, [choices, choice2]);
          game.broadcast((player2, storage) => player2.storage.olquanyu = storage, player, player.storage.olquanyu);
          const rumo = player.hasSkill("olqiangang_effect") && target !== player;
          for (const i of choices) {
            if (!rumo) target.removeTip(i);
            target.unmarkSkill(i);
          }
          const func = (target2, choices2, choice3) => {
            for (const i of choices2) target2.addTip(i, lib.skill[i].description, false, { width: "fit-content" }, true);
            target2.markSkill(choice3, null, null, true);
            if (target2.marks[choice3]?.firstChild.innerHTML) {
              target2.marks[choice3].firstChild.innerHTML = lib.skill[choice3].intro.name.slice(0, target2.marks[choice3].firstChild.innerHTML.length);
            }
          };
          if (player === game.me) func(target, rumo ? choices : [choice2], choice2);
          else if (player.isOnline2()) player.send(func, target, rumo ? choices : [choice2], choice2);
          if (target === game.me) func(target, rumo ? choices : [choice2], choice2);
          else if (target.isOnline2()) target.send(func, target, rumo ? choices : [choice2], choice2);
          if (choice2 === (choice || player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(player)?.[1]) && num < 3) num++;
        }
        if (num > 0) await player.draw(num);
      }
    },
    mod: {
      cardUsableTarget(card, player, target) {
        const storage = player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(player) ?? [[], void 0];
        if (storage[1] === "olquanyu_liuxing" && card.name === "sha" && ![...ui.selected.targets].remove(target).length) return true;
      }
    },
    ai: {
      unequip_ai: true,
      skillTagFilter(player, tag, arg) {
        if (!arg?.card || !arg.target || arg.card.name !== "sha" || !![...ui.selected.targets].remove(arg.target).length) return false;
        const storage = player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(player) ?? [[], void 0];
        return storage[1] === "olquanyu_bixie";
      }
    },
    subSkill: {
      clear: {
        charlotte: true,
        onremove(player) {
          for (const target of game.filterPlayer()) {
            if (!player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).has(target)) return;
            const [choices, choice] = player.storage.olquanyu.get(target);
            if (!player.hasSkill("olqiangang_effect") || target === player) target.removeTip(choice);
            target.unmarkSkill(choice);
            player.storage.olquanyu.set(target, [choices, void 0]);
            game.broadcast((player2, storage) => player2.storage.olquanyu = storage, player, player.storage.olquanyu);
          }
        }
      },
      baihong: {
        description: "伤害+1",
        intro: {
          name: "白虹",
          content: ["伤害+1", '<span style="font-family:yuanli">“白虹贯苍穹，挥刃血溅宫”</span>'].join("<br><br>")
        },
        async contentx(trigger, player) {
          trigger.getParent().baseDamage++;
          game.log(trigger.card, "造成的伤害+1");
        }
      },
      qingming: {
        description: "目标+1",
        intro: {
          name: "青冥",
          content: ["目标+1", '<span style="font-family:yuanli">“刃似寒潭水，剑出搠空明”</span>'].join("<br><br>")
        },
        filter(evt, player) {
          const event = evt.getParent();
          return game.hasPlayer((target) => {
            if (event.targets.includes(target)) return false;
            return lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
          });
        },
        async contentx(evt, player) {
          const trigger = evt.getParent();
          const targets = game.filterPlayer((target) => {
            if (trigger.targets.includes(target)) return false;
            return lib.filter.targetEnabled2(trigger.card, player, target) && lib.filter.targetInRange(trigger.card, player, target);
          });
          if (!targets.length) return;
          const result = targets.length > 1 ? await player.chooseTarget(
            `权御：为${get.translation(trigger.card)}额外选择一个目标`,
            (card, player2, target) => {
              const trigger2 = get.event().triggerx;
              if (trigger2.targets?.includes(target)) return false;
              return lib.filter.targetEnabled2(trigger2.card, player2, target) && lib.filter.targetInRange(trigger2.card, player2, target);
            },
            true
          ).set("triggerx", trigger).set("ai", (target) => {
            const { player: player2, triggerx: trigger2 } = get.event();
            return get.effect(target, trigger2.card, player2, player2);
          }).forResult() : { bool: true, targets };
          if (result?.bool && result.targets?.length) {
            const targets2 = result.targets.sortBySeat();
            player.line(targets2);
            trigger.targets.addArray(targets2);
            game.log(targets2, "成为了", trigger.card, "的额外目标");
          }
        }
      },
      bixie: {
        description: "无视防具",
        intro: {
          name: "辟邪",
          content: ["无视防具", '<span style="font-family:yuanli">“神锋所向诛邪恶，利刃飞出鬼魅惊”</span>'].join("<br><br>")
        },
        async contentx(trigger, player) {
          trigger.target.addTempSkill("qinggang2");
          trigger.target.storage.qinggang2.add(trigger.card);
          trigger.target.markSkill("qinggang2");
        }
      },
      zidian: {
        description: "不可响应",
        intro: {
          name: "紫电",
          content: ["不可响应", '<span style="font-family:yuanli">“恰似明空紫电生，神兵舞起快如风”</span>'].join("<br><br>")
        },
        filter(event, player) {
          return !event.getParent().directHit.includes(event.target);
        },
        async contentx(trigger, player) {
          trigger.getParent().directHit.add(trigger.target);
          game.log(trigger.target, "不可响应", trigger.card);
        }
      },
      baili: {
        description: "额外结算",
        intro: {
          name: "百里",
          content: ["额外结算", '<span style="font-family:yuanli">“锋芒震四方，可息天下兵”</span>'].join("<br><br>")
        },
        async contentx(trigger, player) {
          trigger.getParent().effectCount++;
          game.log(trigger.card, "额外结算一次");
        }
      },
      liuxing: {
        description: "无次数",
        intro: {
          name: "流星",
          content: ["无次数限制", '<span style="font-family:yuanli">“流行飞玉弹，破阵清边尘”</span>'].join("<br><br>")
        },
        filter(event, player) {
          return event.getParent().addCount !== false;
        },
        async contentx(trigger, player) {
          trigger.getParent().addCount = false;
          const stat = player.getStat().card, name2 = trigger.card.name;
          if (typeof stat[name2] === "number") stat[name2]--;
          game.log(trigger.card, "不计入次数");
        }
      }
    }
  },
  oltianen: {
    audio: 3,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      if (!event.isFirstTarget || event.targets.length > 1) return false;
      const playerChoice = (player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(player) ?? [[], void 0])[1];
      const targetChoice = (player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(event.target) ?? [[], void 0])[1];
      if (!playerChoice || !targetChoice) return false;
      return !player.getStorage("oltianen_used").includes(playerChoice === targetChoice);
    },
    forced: true,
    logTarget: "target",
    async content(event, trigger, player) {
      const target = trigger.target;
      player.addTempSkill("oltianen_used");
      const playerChoice = player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(player)?.[1];
      const targetChoice = player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(target)?.[1];
      player.markAuto("oltianen_used", [playerChoice === targetChoice]);
      if (playerChoice === targetChoice) {
        const card = get.cardPile("sha");
        if (card) {
          player.addSkill("oltianen_effect");
          const next = player.gain(card, "gain2");
          next.gaintag.add("oltianen_effect");
          await next;
        }
      } else {
        const cards2 = target.getDiscardableCards(player, "he");
        if (cards2.length) {
          const next = target.discard(cards2.randomGet());
          next.discarder = player;
          await next;
        }
        if (player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(target)?.[0]?.length < 6) {
          player.logSkill("olquanyu", target);
          const next = game.createEvent("olquanyu");
          next.player = player;
          next.targets = [target];
          next._trigger = event;
          next.setContent(lib.skill.olquanyu.content);
          await next;
        }
      }
    },
    ai: { combo: "olquanyu" },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      },
      effect: {
        charlotte: true,
        mod: {
          ignoredHandcard(card, player) {
            if (card.hasGaintag("oltianen_effect")) return true;
          },
          cardDiscardable(card, player, name2) {
            if (name2 === "phaseDiscard" && card.hasGaintag("oltianen_effect")) return false;
          }
        }
      }
    }
  },
  olqiangang: {
    audio: 3,
    enable: "phaseUse",
    filter(event, player) {
      return !player.hasSkill("olrumo", null, false, false) && player.hasSkill("oltianen", null, false, false);
    },
    skillAnimation: true,
    animationColor: "wood",
    manualConfirm: true,
    async content(event, trigger, player) {
      player.addSkill("olrumo");
      await player.removeSkills("oltianen");
      player.addSkill(`${event.name}_effect`);
    },
    ai: {
      combo: "olquanyu",
      order(item, player) {
        return get.order({ name: "sha" }, player) + 0.1;
      },
      result: {
        player(player) {
          const playerChoice = (player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(player) ?? [[], void 0])[1];
          return player.countCards("hs", (card) => {
            if (card.name !== "sha" || !player.hasUseTarget(card)) return false;
            return game.hasPlayer((target) => {
              if (!player.canUse(card, target) || get.effect(target, card, player, player) < 0) return false;
              const targetChoices = (player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(target) ?? [[], void 0])[0];
              return [playerChoice, ...targetChoices].unique().length > 3;
            });
          });
        }
      }
    },
    derivation: "olrumo",
    subSkill: {
      effect: {
        charlotte: true,
        init(player) {
          for (const target of game.filterPlayer()) {
            if (target === player) continue;
            const choices = (player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(target) ?? [[], void 0])[0];
            if (!choices.length) continue;
            const func = (player2, target2, choices2) => {
              for (const i of choices2) target2.addTip(i, lib.skill[i].description, false, { width: "fit-content" }, true);
            };
            if (player === game.me) func(player, target, choices);
            else if (player.isOnline2()) player.send(func, player, target, choices);
            if (target === game.me) func(player, target, choices);
            else if (target.isOnline2()) target.send(func, player, target, choices);
          }
        },
        onChooseToUse(event) {
          event.targetprompt2.add((target) => {
            const player = get.player(), card = get.card();
            if (!card || card.name !== "sha" || !target.classList.contains("selectable")) return false;
            const choices = (player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(target) ?? [[], void 0])[0];
            if (choices.length) return `<span class='bluetext'>${choices.map((i) => lib.skill[i].intro.name[0]).join("")}</span>`;
          });
        },
        audio: "olqiangang",
        trigger: { player: "useCardToPlayer" },
        filter(event, player) {
          if (event.card.name !== "sha" || !event.isFirstTarget || event.targets.length > 1) return false;
          const storage = player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(event.target);
          return storage?.[0]?.some((choice) => {
            const filter = lib.skill[choice]?.filter;
            return filter ? filter(event, player) : true;
          });
        },
        forced: true,
        logTarget: "target",
        async content(event, trigger, player) {
          const storage = player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(trigger.target);
          for (const choice of storage?.[0] || []) {
            const filter = lib.skill[choice]?.filter;
            if (filter ? filter(trigger, player) : true) await lib.skill[choice].contentx(trigger, player);
          }
        },
        mod: {
          cardUsableTarget(card, player, target) {
            const storage = player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(target) ?? [[], void 0];
            if (storage[1] === "olquanyu_liuxing" && card.name === "sha" && ![...ui.selected.targets].remove(target).length) return true;
          }
        },
        ai: {
          unequip_ai: true,
          skillTagFilter(player, tag, arg) {
            if (!arg?.card || !arg.target || arg.card.name !== "sha" || !![...ui.selected.targets].remove(arg.target).length) return false;
            const storage = player.getStorage("olquanyu", /* @__PURE__ */ new Map([])).get(arg.target) ?? [[], void 0];
            return storage[1] === "olquanyu_bixie";
          }
        }
      }
    }
  },
  //谋郭嘉
  olsbdinglun: {
    audio: 2,
    derivation: ["olsbquxi"],
    enable: "phaseUse",
    usable: 1,
    filterTarget: true,
    selectTarget() {
      return [1, Math.ceil(game.countPlayer() / 2)];
    },
    multiline: true,
    multitarget: true,
    async content(event, trigger, player) {
      const { targets } = event;
      let num1 = 0, num2 = 0;
      game.filterPlayer().forEach((target) => {
        const num = target.countCards("h");
        if (targets.includes(target)) {
          num1 += num;
        } else {
          num2 += num;
        }
      });
      if (num1 > num2) {
        player.popup("洗具");
        player.addSkill(`${event.name}_clear`);
        player.markAuto(`${event.name}_clear`, targets);
        await game.doAsyncInOrder(targets, async (target, index) => {
          await target.addAdditionalSkills(`${event.name}_${player.playerid}`, "olsbquxi");
          await target.draw();
        });
      } else {
        player.popup("杯具");
      }
    },
    ai: {
      order: 10,
      result: {
        target(player, target) {
          const targets = game.filterPlayer((i) => get.attitude(player, i) > 0);
          let num1 = 0, num2 = 0;
          game.filterPlayer().forEach((i) => {
            const num = i.countCards("h");
            if (targets.includes(i)) {
              num1 += num;
            } else {
              num2 += num;
            }
          });
          if (num1 > num2) {
            return 1;
          }
          return 0;
        }
      }
    },
    subSkill: {
      clear: {
        charlotte: true,
        onremove: true,
        forceDie: true,
        forced: true,
        popup: false,
        trigger: {
          global: "die",
          player: "phaseZhunbeiBegin"
        },
        filter(event, player) {
          if (event.name == "die") {
            return player == event.player || player.getStorage("olsbdinglun_clear").includes(event.player);
          }
          return player.getStorage("olsbdinglun_clear").length > 0;
        },
        async content(event, trigger, player) {
          let targets = [];
          if (trigger.name == "die" && trigger.player !== player) {
            targets = [trigger.player];
          } else {
            targets = player.getStorage(event.name).slice();
          }
          await game.doAsyncInOrder(targets, async (target, index) => {
            player.unmarkAuto(event.name, target);
            await target.removeAdditionalSkills(`olsbdinglun_${player.playerid}`);
          });
          if (!player.getStorage(event.name).length) {
            player.removeSkill(event.name);
          }
        }
      }
    }
  },
  olsbquxi: {
    audio: 2,
    enable: "phaseUse",
    list: [
      ["guohe", "shan"],
      ["shunshou", "tao"]
    ],
    filter(event, player) {
      const list = get.info("olsbquxi").list;
      const storage = player.getStorage("olsbquxi_used");
      return list.some((arr) => !storage.includes(arr[0]) && player.hasCard(arr[1], "hes") && event.filterCard(get.autoViewAs({ name: arr[0] }, "unsure"), player, event));
    },
    chooseButton: {
      dialog(event, player) {
        const list = get.info("olsbquxi").list.map((arr) => ["trick", "", arr[0]]);
        return ui.create.dialog("趋袭", [list, "vcard"], "hidden");
      },
      filter(button) {
        const player = get.player();
        const name2 = get.info("olsbquxi").list.find((arr) => arr[0] == button.link[2])[1];
        return !player.getStorage("olsbquxi_used").includes(button.link[2]) && player.hasCard(name2, "hes") && get.event().getParent().filterCard(get.autoViewAs({ name: button.link[2] }, "unsure"), player, get.event().getParent());
      },
      check(button) {
        return get.player().getUseValue(get.autoViewAs({ name: button.link[2] }, "unsure"));
      },
      backup(links, player) {
        const name2 = get.info("olsbquxi").list.find((arr) => arr[0] == links[0][2])[1];
        return {
          filterCard: { name: name2 },
          position: "hes",
          viewAs: {
            name: links[0][2]
          },
          log: false,
          check(card) {
            return 7 - get.value(card);
          },
          async precontent(event, trigger, player2) {
            player2.logSkill("olsbquxi");
            player2.addTempSkill("olsbquxi_used", "phaseChange");
            player2.markAuto("olsbquxi_used", event.result.card.name);
          }
        };
      },
      prompt(links, player) {
        const name2 = get.info("olsbquxi").list.find((arr) => arr[0] == links[0][2])[1];
        return `将一张【${get.translation(name2)}】当作【${get.translation(links[0][2])}】使用`;
      }
    },
    ai: {
      order: 8,
      result: {
        player: 1
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "已转化：$"
        }
      }
    }
  },
  olsbjieli: {
    audio: 2,
    round: 1,
    trigger: { target: "useCardToTarget" },
    filter(event, player) {
      return event.targets?.length == 1;
    },
    async cost(event, trigger, player) {
      const list = [`由你重新选择${get.translation(trigger.card)}的目标`, `观看一名其他角色的所有手牌，获得其中与${get.translation(trigger.card)}花色相同的牌`];
      const canChangeTarget = game.hasPlayer((target) => trigger.player.canUse(trigger.card, target) && get.effect(target, trigger.card, trigger.player, player) > get.effect(trigger.target, trigger.card, trigger.player, player));
      if (!game.hasPlayer((target) => target != player && target.countCards("h"))) {
        const result = await player.chooseBool(get.prompt(event.skill), list[0]).set("choice", canChangeTarget).forResult();
        if (result?.bool) {
          event.result = { bool: true, cost_data: 0 };
        }
      } else {
        let choice = 0;
        if (get.suit(trigger.card) != "none" && game.hasPlayer((target) => get.attitude(player, target) < 0 && target.countCards("h") > 5)) {
          choice = 1;
        } else if (canChangeTarget) {
          choice = 0;
        } else {
          choice = 2;
        }
        const result = await player.chooseControl("cancel2").set("choiceList", list).set("prompt", get.prompt2(event.skill)).set("choice", choice).forResult();
        if (result?.control != "cancel2") {
          event.result = { bool: true, cost_data: result.index };
        }
      }
    },
    async content(event, trigger, player) {
      const { cost_data: index } = event;
      if (index == 0) {
        const next = player.chooseTarget(`解罹：为${get.translation(trigger.card)}重新指定目标`, true, (card, player2, target) => {
          return get.event().getTrigger().player.canUse(card, target);
        }).set("_get_card", trigger.card).set("ai", (target) => get.effect(target, get.event().getTrigger().card, get.event().getTrigger().player, get.player()));
        next.targetprompt2.add((target) => {
          if (!target.isIn() || target != get.event().getTrigger().target) {
            return false;
          }
          return "原目标";
        });
        const result = await next.forResult();
        if (result?.targets?.length) {
          const { targets } = result;
          player.line(targets, "yellow");
          const evt = trigger.getParent();
          evt.targets.length = 0;
          evt.targets.addArray(targets);
          game.log(targets, "成为了", trigger.card, "的新目标");
        }
      } else {
        const result = await player.chooseTarget(`解罹：请选择要观看手牌的角色`, true, lib.filter.notMe).set("ai", (target) => -get.attitude(get.player(), target) * target.countCards("h")).forResult();
        if (result?.targets?.length) {
          const {
            targets: [target]
          } = result;
          player.line(target, "yellow");
          await player.viewHandcards(target);
          const cards2 = target.getGainableCards(player, "h", { suit: get.suit(trigger.card) });
          if (cards2.length) {
            await player.gain(cards2, target, "give", "bySelf");
          }
        }
      }
    }
  },
  //界于禁
  ol_zhenjun: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => current.countDiscardableCards(player, "he"));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill)).set("filterTarget", (_, player2, target) => target.countDiscardableCards(player2, "he")).set("ai", (target) => -get.attitude(get.player(), target) * (target.countCards("e") + 1)).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const result = await player.discardPlayerCard(true, target, "he", Math.max(target.countCards("h") - target.hp, 1), "allowChooseAll").forResult();
      if (result?.bool && result.cards?.length) {
        const num = result.cards.filter((card) => get.type(card) != "equip").length;
        if (num == 0) {
          return;
        }
        let resultx;
        if (num > player.countDiscardableCards(player, "he")) {
          resultx = { bool: false, cards: [] };
        } else {
          let prompt = `弃置${get.cnNumber(num)}张牌，或令${get.translation(target)}于你结束阶段摸${get.cnNumber(num)}张牌`;
          resultx = await player.chooseToDiscard(prompt, num, "he", "allowChooseAll").set("ai", (card) => {
            const event2 = get.event();
            const phase = event2.getTrigger().getParent("phase");
            if (phase?.name == "phase" && phase.phaseList?.length) {
              const phaseJieshu = phase.phaseList.find((v, i) => i > phase.num && v.startsWith("phaseJieshu"));
              if (!phaseJieshu) {
                return 0;
              }
            }
            return 6 - get.value(card);
          }).forResult();
        }
        if (!resultx?.bool) {
          target.when({ global: "phaseJieshuBegin" }).filter((evt) => {
            return evt.player == player;
          }).step(async function(event2, trigger2, player2) {
            await player2.draw(num);
          });
        }
      }
    }
  },
  ol_yizhong: {
    audio: 2,
    trigger: {
      player: "useCard",
      target: "useCardToBefore"
    },
    forced: true,
    filter(event, player) {
      if (event.card.name != "sha" || get.color(event.card) != "black") {
        return false;
      }
      if (event.player == player) {
        const num = player.countCards("h");
        return event.targets.some((target) => target.countCards("h") <= num);
      }
      return event.player.getHp() >= player.getHp();
    },
    logTarget(event, player) {
      if (event.player == player) {
        const num = player.countCards("h");
        return event.targets.filter((target) => target.countCards("h") <= num).sortBySeat(_status.currentPhase);
      }
      return null;
    },
    async content(event, trigger, player) {
      if (trigger.player == player) {
        trigger.directHit.addArray(event.targets);
        game.log(event.targets, "不可响应", trigger.card);
      } else {
        trigger.cancel();
      }
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        return arg?.card?.name == "sha" && get.color(arg?.card, player) == "black" && arg?.target?.countCards("h") < player.countCards("h");
      },
      effect: {
        target(card, player, target) {
          if (card.name != "sha" && get.color(card) != "black") {
            return;
          }
          if (player.getHp() > target.getHp()) {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  //闪张辽
  olzhengbing: {
    audio: "jsrgzhengbing",
    enable: "phaseUse",
    usable: 3,
    filter(event, player) {
      return player.group == "qun" && player.countCards("he");
    },
    filterCard: lib.filter.cardRecastable,
    check(card) {
      var player = _status.event.player, val = 5 + ["shan", "tao"].includes(get.name(card)) * 1.5;
      if (player.needsToDiscard() > 2 && get.name(card) == "sha" && player.countCards("hs", "sha") > 1) {
        val += 0.5;
      }
      return val - get.value(card);
    },
    position: "he",
    groupSkill: "qun",
    lose: false,
    discard: false,
    delay: false,
    async content(event, trigger, player) {
      const { cards: cards2, name: name2 } = event;
      await player.recast(cards2);
      let type;
      switch (get.name(cards2[0])) {
        case "sha":
          type = "sha";
          player.addSkill("olzhengbing_sha");
          player.addMark("olzhengbing_sha", 1, false);
          break;
        case "shan":
          type = "shan";
          await player.draw();
          break;
        case "tao":
        case "jiu":
          type = "tao/jiu";
          player.addTempSkill("olzhengbing_dianjun", { global: ["phaseAfter", "phaseBeforeStart"] });
          break;
      }
      if (type) {
        player.getHistory("custom").push({ skill: name2, type });
      }
      if (player.getAllHistory("custom", (evt) => {
        return evt.skill == name2;
      }).map((evt) => evt.type).toUniqued().length >= 3) {
        await player.changeGroup("wei");
      }
    },
    ai: {
      order: 7,
      result: { player: 1 }
    },
    subSkill: {
      dianjun: {
        audio: "jsrgzhengbing",
        charlotte: true,
        trigger: { player: "phaseEnd" },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
        }
      },
      sha: {
        charlotte: true,
        onremove: true,
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("olzhengbing_sha");
          }
        },
        intro: {
          content: "手牌上限+#"
        }
      }
    }
  },
  //谋许攸
  olsbqianfu: {
    audio: 2,
    zhuanhuanji: true,
    marktext: "☯",
    mark: true,
    intro: {
      content(storage, player) {
        if (!storage) {
          return `转换技，出牌阶段，你可以将一张黑色牌当【过河拆桥】使用。结算后，你可将因此弃置的牌置于牌堆顶。`;
        }
        return `转换技，出牌阶段，你可以将一张红色牌当【火攻】使用。结算后，你可将因此弃置的牌置于牌堆顶。`;
      }
    },
    group: "olsbqianfu_put",
    enable: "phaseUse",
    filter(event, player) {
      const bool = player.storage.olsbqianfu;
      return player.countCards("hes", (card) => get.color(card, player) == (!bool ? "black" : "red")) && event.filterCard(get.autoViewAs({ name: !bool ? "guohe" : "huogong" }, "unsure"), player, event) && (player.hasSkill("olsbqianfu_remove") ? !player.getStorage("olsbqianfu_used").includes(!bool ? "guohe" : "huogong") : true);
    },
    filterCard(card, player) {
      return get.color(card, player) === (!player.storage[get.event().skill] ? "black" : "red");
    },
    position: "hes",
    check(card) {
      return 7 - get.value(card);
    },
    viewAs(cards2, player) {
      const filter = get.event()._backup.filterCard;
      const viewAs = { name: !player.storage[get.event().skill] ? "guohe" : "huogong" };
      if (!filter(get.autoViewAs(viewAs, "unsure"))) {
        return null;
      }
      return viewAs;
    },
    prompt(event) {
      const name2 = !event.player.storage[event.skill] ? "guohe" : "huogong";
      const color = !event.player.storage[event.skill] ? "black" : "red";
      return `将一张${get.translation(color)}牌当作${get.translation(name2)}使用`;
    },
    async precontent(event, trigger, player) {
      player.changeZhuanhuanji(event.name.slice(4));
      if (player.hasSkill(event.name.slice(4) + "_remove")) {
        player.addTempSkill(event.name.slice(4) + "_used", "phaseChange");
        player.markAuto(event.name.slice(4) + "_used", event.result.card.name);
      }
    },
    ai: {
      order: 6,
      result: {
        player: 1
      }
    },
    subSkill: {
      put: {
        audio: "olsbqianfu",
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          return event.skill == "olsbqianfu" && get.info("olsbqianfu_put").getCards(event).length;
        },
        getCards(event) {
          const cards2 = game.players.reduce((list, target) => {
            const history = target.getHistory("lose", (evt) => {
              return evt.type == "discard" && evt.getlx !== false && evt.getParent(4) === event;
            });
            if (!history.length) {
              return list;
            }
            return list.addArray(history.reduce((listx, evt) => [...listx, ...evt.cards], []));
          }, []);
          return cards2.filterInD("d");
        },
        prompt2(event, player) {
          return `将${get.translation(get.info("olsbqianfu_put").getCards(event))}置于牌堆顶`;
        },
        async content(event, trigger, player) {
          const cards2 = get.info("olsbqianfu_put").getCards(trigger);
          game.log(player, "将", cards2, "置于牌堆顶");
          await game.cardsGotoPile(cards2, "insert");
        }
      },
      used: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "已转化：$"
        }
      },
      remove: {
        charlotte: true,
        forced: true,
        popup: false,
        trigger: {
          player: "loseAfter",
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          if (player.countCards("h")) {
            return false;
          }
          var evt = event.getl(player);
          return evt && evt.hs && evt.hs.length;
        },
        async content(event, trigger, player) {
          player.removeSkill(event.name);
          await player.removeSkills("olsbqianfu");
        }
      }
    }
  },
  olsbyushi: {
    audio: 2,
    trigger: {
      source: "damageSource",
      player: "damageEnd"
    },
    getSkills(target) {
      return target.getSkills(null, false, false).filter((skill) => get.is.zhuanhuanji(skill, target));
    },
    async cost(event, trigger, player) {
      const next = player.chooseTarget(get.prompt2(event.skill)).set("ai", (target) => {
        const bool = !!get.info("olsbyushi").getSkills(target).length;
        const att = get.attitude(get.player(), target);
        if (!bool) {
          return att;
        }
        return false;
      });
      next.set(
        "targetprompt2",
        next.targetprompt2.concat([
          (target) => {
            if (!target?.isIn() || !target.classList.contains("selectable")) {
              return;
            }
            return get.info("olsbyushi").getSkills(target).length ? "有转换技" : "无转换技";
          }
        ])
      );
      event.result = await next.forResult();
    },
    async content(event, trigger, player) {
      const [target] = event.targets;
      const skills2 = get.info("olsbyushi").getSkills(target);
      if (!skills2.length) {
        target.addSkill("olsbqianfu_remove");
        await target.addSkills("olsbqianfu");
      } else {
        const result = await player.chooseButton([`驭势：选择变更${get.translation(target)}一个技能的状态`, [skills2, "skill"]], true).forResult();
        if (result?.links?.length) {
          const skill = result.links[0];
          game.log(target, "的", "#g【" + get.translation(skill) + "】", "发生了状态变更");
          target.popup(skill, "wood");
          target.changeZhuanhuanji(skill);
        }
      }
    },
    group: ["olsbyushi_draw"],
    subSkill: {
      draw: {
        audio: "olsbyushi",
        forced: true,
        locked: false,
        trigger: { global: "changeZhuanhuanji" },
        filter(event, player) {
          const index = game.getRoundHistory("everything", (evt) => evt.name == "changeZhuanhuanji").indexOf(event);
          return index >= 0 && index < player.maxHp;
        },
        async content(event, trigger, player) {
          await player.draw();
        }
      }
    }
  },
  olsbfenchao: {
    audio: 2,
    limited: true,
    skillAnimation: true,
    animationColor: "metal",
    trigger: { player: "phaseJieshuBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill)).set("ai", (target) => get.attitude(get.player(), target)).forResult();
    },
    async content(event, trigger, player) {
      const [target] = event.targets;
      player.awakenSkill(event.name);
      let cards2 = Array.from(ui.discardPile.childNodes).filter((card) => get.is.damageCard(card));
      if (cards2.length > game.players.length) {
        cards2 = cards2.randomGets(game.players.length);
      }
      target.addSkill(event.name + "_fire");
      if (cards2.length) {
        const next = target.gain(cards2, "gain2");
        next.gaintag.add(event.name + "_fire");
        await next;
      }
    },
    subSkill: {
      fire: {
        charlotte: true,
        forced: true,
        trigger: {
          global: "damageBegin1"
        },
        filter(event, player) {
          return event.card && player.hasHistory("lose", (evt) => {
            const evtx = evt.relatedEvent || evt.getParent();
            if (evtx.card !== event.card) {
              return false;
            }
            return Object.values(evt.gaintag_map).flat().includes("olsbfenchao_fire");
          });
        },
        async content(event, trigger, player) {
          game.setNature(trigger, "fire");
        }
      }
    }
  },
  //谋鲁肃
  olsbduduan: {
    audio: 2,
    phasename: ["phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard"],
    trigger: {
      player: "phaseBegin"
    },
    //frequent: true,
    check: () => true,
    async content(event, trigger, player) {
      await player.draw();
      const phasename = get.info(event.name).phasename, isPhase = (name2) => phasename.includes(name2.split("|")[0]);
      const list = trigger.phaseList.map((name2, index) => [index + 1, "", name2.split("|")[0]]);
      if (list?.some((info) => isPhase(info[2]) && !player.getStorage(event.name + "_used").includes(info[2]))) {
        const result = await player.chooseButton(
          [
            "独断：请选择一个阶段于本回合跳过",
            [
              list.filter((info) => {
                return isPhase(info[2]) && !player.getStorage(event.name + "_used").includes(info[2]);
              }),
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
          ],
          true
        ).set("forceAuto", true).forResult();
        let choice = result?.links[0];
        player.addSkill(event.name + "_used");
        player.markAuto(event.name + "_used", choice[2]);
        let phase = trigger.phaseList[choice[0] - 1].replace(choice[2], `skip${choice[2].slice(5)}-${event.name}`);
        trigger.phaseList[choice[0] - 1] = phase;
        const list2 = trigger.phaseList.filter((name2, index) => isPhase(name2) && index != choice[0] - 1);
        if (list2.length > 1) {
          if (list2.length == 2) {
            const indexList2 = list2.map((name2) => trigger.phaseList.indexOf(name2));
            [trigger.phaseList[indexList2[0]], trigger.phaseList[indexList2[1]]] = [trigger.phaseList[indexList2[1]], trigger.phaseList[indexList2[0]]];
            return;
          }
          const choices = trigger.phaseList.reduce((list3, name2, index) => index != choice[0] - 1 && isPhase(name2) ? [...list3, [index + 1, "", name2.split("|")[0]]] : list3, []);
          const indexList = choices.map((i) => i[0] - 1);
          const result2 = await player.chooseToMove("独断：交换另外两个阶段", true).set("checkMove", (moved) => {
            const { choices: choices2 } = get.event();
            const list3 = moved[0].reduce((list4, i, index) => choices2[index][0] != i[0] ? [...list4, i[0]] : list4, []).sort();
            return list3;
          }).set("choices", choices).set("list", [
            [
              "剩余阶段",
              [
                choices,
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
            return get.event().checkMove(moved).length == 2;
          }).set("filterMove", (from, to, moved) => {
            if (!to?.link || !from?.link) {
              return false;
            }
            const list3 = get.event().checkMove(moved);
            if (list3.length < 2) {
              return true;
            }
            if (list3.length == 2) {
              if ([from.link[0], to.link[0]].sort().every((num, i) => num == list3[i])) {
                return true;
              }
            }
            return false;
          }).set("processAI", (list3) => {
            let moved = list3[0][1][0].slice(0);
            return [[moved.at(-1), ...moved.slice(1, -1), moved.at(0)]];
          }).forResult();
          if (!result2?.bool) {
            return;
          }
          indexList.forEach((i, index) => {
            trigger.phaseList[i] = result2.moved[0][index][2];
          });
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "已跳过 $"
        }
      },
      skip: {
        trigger: {
          player: ["phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard"].map((i) => i + "Before")
        },
        charlotte: true,
        popup: false,
        forced: true,
        onremove: true,
        filter(event, player) {
          if (!player.getStorage("olsbduduan_skip").includes(event.name)) {
            return false;
          }
          return !event._extraPhaseReason;
        },
        async content(event, trigger, player) {
          trigger.cancel();
        }
      }
    }
  },
  olsbyinglve: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.getStorage("olsbyinglve_used").length < 2;
    },
    position: "he",
    chooseButton: {
      dialog(_, player) {
        const dialog = ui.create.dialog("英略：请选择一项", "hidden");
        const list = [];
        if (!player.getStorage("olsbyinglve_used").includes(0)) {
          list.push([0, "令一名角色失去1点体力，其下个摸牌阶段摸牌数+2"]);
        }
        if (!player.getStorage("olsbyinglve_used").includes(1)) {
          list.push([1, "令一名角色摸两张牌，其下个弃牌阶段内手牌上限-2"]);
        }
        dialog.add([list, "textbutton"]);
        dialog.direct = true;
        return dialog;
      },
      check(button) {
        return 1;
      },
      backup(links, player) {
        return {
          audio: "olsbyinglve",
          choice: links[0],
          filterTarget: true,
          async content(event, trigger, player2) {
            const choice = get.info(event.name).choice;
            const target = event.targets[0];
            player2.addTempSkill("olsbyinglve_used", "phaseUseAfter");
            player2.markAuto("olsbyinglve_used", [choice]);
            if (choice == 0) {
              await target.loseHp();
              target.when({ player: "phaseDrawBegin2" }).filter((evt) => !evt.numFixed).step(async (event2, trigger2, player3) => {
                trigger2.num += 2;
              });
            } else {
              await target.draw(2);
              target.when({ player: "phaseDiscardBegin" }).step(async (event2, trigger2, player3) => {
                player3.addTempSkill("olsbyinglve_debuff", ["phaseBeforeStart", "phaseChange", "phaseAfter"]);
                player3.addMark("olsbyinglve_debuff", 2, false);
              });
            }
          },
          ai: {
            result: {
              target(player2, target) {
                const choice = get.info("olsbyinglve_backup");
                if (choice === 0) {
                  return get.effect(target, { name: "losehp" }, player2, player2);
                } else {
                  return get.effect(target, { name: "draw" }, player2, player2);
                }
              }
            }
          }
        };
      },
      prompt(links, player) {
        const choice = links[0];
        let str;
        if (choice == 0) {
          str = "令一名角色失去1点体力，下个摸牌阶段摸牌数+2";
        } else {
          str = "令一名角色摸两张牌，其下个弃牌阶段内手牌上限-2";
        }
        return `###英略###<div class="text center">${str}</div>`;
      }
    },
    ai: {
      order: 9,
      result: {
        player: 1
      }
    },
    subSkill: {
      backup: {},
      used: {
        onremove: true,
        charlotte: true
      },
      debuff: {
        onremove: true,
        charlotte: true,
        markimage: "image/card/handcard.png",
        intro: {
          content: "手牌上限-#"
        },
        mod: {
          maxHandcard(player, num) {
            return num - player.countMark("olsbyinglve_debuff");
          }
        }
      }
    }
  },
  olsbmengshi: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    skillAnimation: true,
    limited: true,
    animationColor: "wood",
    filter(event, player) {
      return game.filterPlayer((target) => target !== player).map((current) => {
        return current.getHp();
      }).toUniqued().length >= 2;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        if (target == player2) {
          return false;
        }
        return ui.selected.targets.every((current) => current.getHp() != target.getHp());
      }).set("selectTarget", 2).set("multitarget", true).set("ai", (target) => {
        const player2 = get.player();
        const trigger2 = _status.event.getTrigger();
        const getCache = (trigger3, player3) => {
          let cache2 = trigger3.getTempCache("olsbmengshi", player3.playerid);
          if (Array.isArray(cache2)) {
            return cache2;
          }
          const hp = player3.getHp();
          const save = player3.countCards("hs", (card) => player3.canSaveCard(card, player3));
          const others = game.filterPlayer((current) => current !== player3);
          const list = [];
          for (let i = 0; i < others.length; i++) {
            for (let j = i + 1; j < others.length; j++) {
              const target1 = others[i];
              const target2 = others[j];
              if (target1.getHp() == target2.getHp()) {
                continue;
              }
              const diff = target1.getHp() - target2.getHp();
              const num = Math.abs(diff);
              if (num >= save + hp) {
                continue;
              }
              const targets = diff > 0 ? [target2, target1] : [target1, target2];
              const att1 = get.attitude(player3, targets[0]);
              const att2 = get.attitude(player3, targets[1]);
              let type = "";
              if (att1 < 0 && att2 < 0) {
                type = "敌敌";
              } else if (att1 > 0 && att2 < 0) {
                type = "敌友";
              } else if (att1 == 0 && att2 < 0) {
                type = "敌中";
              } else if (att1 > 0 && att2 > 0) {
                type = "友友";
              } else if (att1 == 0 && att2 > 0) {
                type = "友中";
              } else if (att1 == 0 && att2 == 0) {
                type = "中中";
              }
              if (!type) {
                continue;
              }
              list.push({
                targets,
                type,
                diff: num
              });
            }
          }
          const scoredList = list.map((item, index, array) => {
            const { targets, type, diff } = item;
            let score = 0;
            switch (type) {
              case "敌敌":
                if (["友", "中"].every((str) => !array.some((item2) => item2.type.startsWith(str)))) {
                  if (diff <= 2) {
                    score = 2 + Math.random() - diff;
                  } else {
                    score = 0;
                  }
                }
                break;
              case "敌友":
                score = (diff + 1) * 20 + get.recoverEffect(targets[0], player3, player3) + get.effect(targets[1], { name: "losehp" }, player3, player3);
                break;
              case "敌中":
                score = diff * 20 + get.recoverEffect(targets[0], player3, player3) + get.effect(targets[1], { name: "losehp" }, player3, player3);
                break;
              case "友友":
                if (!array.some((item2) => item2.type.startsWith("敌"))) {
                  if (diff <= 2) {
                    score = 3 + Math.random() - diff + Math.max(0, get.effect(targets[1], { name: "losehp" }, targets[1], targets[1])) / 2;
                  } else {
                    score = 0;
                  }
                }
                break;
              case "友中":
                if (!array.some((item2) => item2.type.startsWith("敌"))) {
                  if (diff <= 2) {
                    score = 4 + Math.random() - diff;
                  } else {
                    score = 0;
                  }
                }
                break;
              case "中中":
                if (["敌", "友"].every((str) => !array.some((item2) => item2.type.startsWith(str)))) {
                  if (diff <= 2) {
                    score = 2 + Math.random() - diff;
                  } else {
                    score = 0;
                  }
                }
                break;
            }
            return { ...item, score };
          });
          scoredList.sort((a, b) => b.score - a.score);
          trigger3.putTempCache("olsbmengshi", player3.playerid, scoredList);
          return scoredList;
        };
        const cache = getCache(trigger2, player2);
        if (!cache?.length || !cache[0].targets.includes(target)) {
          return 0;
        }
        return 1;
      }).forResult();
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const [target1, target2] = event.targets.sortBySeat();
      if ([target1, target2].some((target) => !target.isIn())) {
        player.chat("怎么肘了");
        return;
      }
      const num = Math.abs(target1.getHp() - target2.getHp());
      if (num) {
        await player.loseHp(num);
        const num1 = target1.getHp();
        const num2 = target2.getHp();
        if (num1 > num2) {
          await target1.loseHp(Math.abs(num1 - num2));
          await target2.recoverTo(num1);
        } else if (num2 > num1) {
          await target1.recoverTo(num2);
          await target2.loseHp(Math.abs(num1 - num2));
        }
      }
      player.addTempSkill("olsbmengshi_effect", { player: "dieAfter" });
      player.markAuto("olsbmengshi_effect", event.targets);
    },
    subSkill: {
      effect: {
        audio: "olsbmengshi",
        trigger: { global: ["dieAfter", "phaseEnd"] },
        charlotte: true,
        popup: false,
        forced: true,
        filter(event, player) {
          const storage = player.getStorage("olsbmengshi_effect");
          if (event.name == "die") {
            return storage.includes(event.player);
          }
          return storage.length;
        },
        async content(event, trigger, player) {
          if (trigger.name == "die") {
            player.removeSkill(event.name);
          } else {
            await player.draw();
            await player.recover();
          }
        },
        onremove: true,
        intro: { content: "每个回合结束时，摸一张牌并回复1点体力，直到$中的一名角色死亡" }
      }
    }
  },
  //界大虎
  olzenhui: {
    audio: 2,
    trigger: { player: "useCardToPlayer" },
    filter(event, player) {
      if (!event.targets.length || !event.isFirstTarget) {
        return false;
      }
      const card = event.card, info = get.info(card);
      if (card.name != "sha" && info.type != "trick" || info.singleCard) {
        return false;
      }
      if (!player.isPhaseUsing() || player.getStorage("olzenhui_used")?.length > 1) {
        return false;
      }
      return game.hasPlayer(function(current) {
        return current != player && !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && lib.filter.targetInRange(card, player, current);
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), function(card, player2, target) {
        if (player2 == target) {
          return false;
        }
        const evt = _status.event.getTrigger();
        return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player2, target) && lib.filter.targetInRange(evt.card, player2, target);
      }).set("ai", function(target) {
        const trigger2 = _status.event.getTrigger(), player2 = _status.event.player;
        return Math.max(target.countGainableCards(player2, "he") ? get.effect(target, { name: "shunshou_copy2" }, player2, player2) : 0, get.effect(target, trigger2.card, player2, player2));
      }).forResult();
    },
    async content(event, trigger, player) {
      player.addTempSkill("olzenhui_used", "phaseUseAfter");
      const target = event.targets[0];
      const result = player.getStorage("olzenhui_used").length ? {
        index: 1 - player.getStorage("olzenhui_used")[0]
      } : target.countGainableCards(player, "he") ? await target.chooseControl().set("choiceList", [`交给${get.translation(player)}一张牌，然后代替其成为${get.translation(trigger.card)}的使用者`, `成为${get.translation(trigger.card)}的额外目标`]).set("ai", function() {
        const trigger2 = _status.event.getTrigger(), { player: player2, source } = get.event();
        if (!player2.countGainableCards(source, "he")) {
          return 0;
        }
        const eff = get.effect(player2, trigger2.card, source, source);
        if (get.attitude(player2, source) > 0 && eff < 0) {
          return 0;
        }
        return get.effect(player2, { name: "shunshou_copy2" }, source, source) > eff ? 1 : 0;
      }).set("source", player).forResult() : {
        index: 1
      };
      player.markAuto("olzenhui_used", [result.index]);
      const evt = trigger.getParent();
      if (result.index == 0) {
        trigger.untrigger();
        if (evt.addCount !== false) {
          evt.addCount = false;
          const stat = evt.player.getStat().card, name2 = trigger.card.name;
          if (typeof stat[name2] === "number") {
            stat[name2]--;
          }
        }
        evt.player = target;
        game.log(target, "成为了", trigger.card, "的使用者");
        await target.chooseToGive(player, "he", true);
      } else {
        game.log(target, "成为了", trigger.card, "的额外目标");
        evt.targets.push(target);
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  oljiaojin: {
    audio: 2,
    trigger: { player: "damageBegin4" },
    filter(event, player) {
      return player.countCards("he", (card) => !get.is.damageCard(card) && get.type2(card) == "trick" || get.type(card) == "equip") > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard({
        position: "he",
        prompt: get.prompt2(event.skill),
        filterCard(card, player2) {
          return !get.is.damageCard(card) && get.type2(card) == "trick" || get.type(card) == "equip";
        },
        ai(card) {
          let player2 = _status.event.player;
          if (player2.hp == 1 || _status.event.getTrigger().num > 1) {
            return 9 - get.value(card);
          }
          if (player2.hp == 2) {
            return 8 - get.value(card);
          }
          return 7 - get.value(card);
        },
        chooseonly: true
      }).forResult();
    },
    async content(event, trigger, player) {
      await player.modedDiscard({ cards: event.cards });
      await game.delay(0.5);
      trigger.cancel();
      if (trigger.cards?.someInD("od")) {
        await player.gain({ cards: trigger.cards.filterInD("od"), animate: "gain2" });
      }
    }
  },
  //谋诸葛亮
  olsbzhitian: {
    audio: 2,
    clickableFilter(player) {
      return player.hasSkill("olsbzhitian") && player.hasSkill("olsbzhitian_viewTop");
    },
    init(player, skill) {
      if (player.isPhaseUsing()) {
        player.addTempSkill(`${skill}_viewTop`, { global: ["phaseChange", "phaseAfter", "phaseBeforeStart"] });
      }
    },
    forced: true,
    locked: false,
    trigger: { player: "phaseUseBegin" },
    async content(event, trigger, player) {
      player.addTempSkill(`${event.name}_viewTop`, { global: ["phaseChange", "phaseAfter", "phaseBeforeStart"] });
    },
    clickable(player) {
      if (player.isUnderControl(true)) {
        let createDialogWithControl = function(result) {
          const dialog = ui.create.dialog("知天", "peaceDialog");
          result.length > 0 ? dialog.add(result, true) : dialog.addText("牌堆顶无牌");
          const control = ui.create.control("确定", () => dialog.close());
          dialog._close = dialog.close;
          dialog.hide = dialog.close = function(...args) {
            control.close();
            return dialog._close(...args);
          };
          if (_status.olsbzhitian_clickable) {
            _status.olsbzhitian_clickable.close();
          }
          _status.olsbzhitian_clickable = dialog;
          dialog.open();
        };
        const cards2 = lib.skill.olsbzhitian.getCards(player);
        if (cards2 instanceof Promise) {
          cards2.then(([ok, result]) => createDialogWithControl(result));
        } else {
          createDialogWithControl(cards2);
        }
      }
    },
    getCards(player) {
      let cards2 = [];
      const num = Math.max(1, 7 - player.countMark("olsbzhitian"));
      if (game.online) {
        return game.requestSkillData("olsbzhitian", "getTopCards", 1e4);
      } else {
        if (ui.cardPile.hasChildNodes !== false) {
          cards2 = Array.from(ui.cardPile.childNodes).slice(0, num);
        }
      }
      return cards2;
    },
    sync: {
      getTopCards(client) {
        if (ui.cardPile.hasChildNodes !== false) {
          return Array.from(ui.cardPile.childNodes).slice(0, Math.max(1, 7 - client.countMark("olsbzhitian")));
        }
        return [];
      }
    },
    mark: true,
    marktext: "牌",
    intro: {
      markcount(storage = 0, player) {
        return Math.max(1, 7 - storage);
      },
      mark(dialog, count = 0, player, event, skill) {
        const intronode = ui.create.div(".menubutton.pointerdiv", "点击发动", function() {
          if (!this.classList.contains("disabled")) {
            this.classList.add("disabled");
            this.style.opacity = 0.5;
            lib.skill[skill].clickable(player);
          }
        });
        if (!_status.gameStarted || !player.isUnderControl(true) || !lib.skill[skill].clickableFilter(player)) {
          intronode.classList.add("disabled");
          intronode.style.opacity = 0.5;
        }
        dialog.addText(`观看牌数-${count}`);
        dialog.add(intronode);
      }
    },
    group: ["olsbzhitian_huogong"],
    subSkill: {
      viewTop: {
        charlotte: true
      },
      huogong: {
        enable: "chooseToDiscard",
        filter(event, player) {
          return event.getParent().name == "huogong" && get.itemtype(_status.pileTop) == "card" && !event.olsbzhitian_huogong;
        },
        async precontent(event, trigger, player) {
          const evt = event.getParent();
          const cards2 = await get.info("olsbzhitian").getCards(player);
          const result = await player.chooseButton([`知天：请选择一张牌作为此次“火攻”需要弃置的牌`, cards2]).set("filterButton", (button) => {
            return get.event().links.includes(button.link);
          }).set(
            "links",
            cards2.filter((card) => evt.filterCard(card, player))
          ).set("ai", (button) => Math.random()).forResult();
          if (result?.links?.length) {
            const cards3 = result.links;
            event.result.bool = result.bool;
            event.result.cards = cards3;
            player.logSkill("olsbzhitian");
            player.when("discardBegin").filter((evtx) => evtx.getParent() == evt).step(async (event2, trigger2, player2) => {
              trigger2.setContent(async (event3, trigger3, player3) => {
                const { cards: cards4 } = event3;
                player3.$throw(cards4, 1e3);
                game.log(player3, "弃置了", "#g牌堆", "的", cards4);
                await game.cardsDiscard(cards4);
              });
            });
          } else {
            evt.set(event.name.slice(4), true);
            evt.goto(0);
          }
        }
      },
      tag: {}
    }
  },
  olsbwujing: {
    audio: 2,
    trigger: {
      global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"]
    },
    forced: true,
    priority: 10,
    filter(event, player) {
      if (player !== _status.currentPhase) {
        return false;
      }
      if (event.name.indexOf("lose") == 0) {
        if (event.getlx === false || event.position != ui.discardPile) {
          return false;
        }
      } else if (event.name == "cardsDiscard") {
        const evt = event.getParent();
        if (evt.relatedEvent?.name == "useCard") {
          return false;
        }
      }
      return event.getd?.()?.length;
    },
    async content(event, trigger, player) {
      player.addSkill(event.name + "_effect");
    },
    group: ["olsbwujing_draw"],
    subSkill: {
      draw: {
        audio: "olsbwujing",
        trigger: {
          global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"]
        },
        forced: true,
        priority: 9,
        filter(event, player) {
          return get.info("olsbwujing_draw").getEvents().indexOf(event) == 0;
        },
        getEvents() {
          return game.getGlobalHistory("cardMove", (event) => {
            if (event.name == "lose") {
              if (event.position != ui.discardPile) {
                return false;
              }
              return event.cards?.some((card) => !event.hs?.includes(card));
            } else if (event.name == "cardsDiscard") {
              const evt = event.getParent();
              if (evt.name !== "orderingDiscard") {
                return true;
              }
              const evt2 = evt.relatedEvent || evt.getParent();
              if (evt2) {
                const hs = game.filterPlayer2().reduce((list, target) => {
                  const cards2 = [];
                  target.checkHistory("lose", (evtx) => {
                    const evtx2 = evtx.relatedEvent || evtx.getParent();
                    if (evtx2 !== evt2) {
                      return false;
                    }
                    cards2.addArray(evtx.hs);
                  });
                  return list.addArray(cards2);
                }, []);
                return event.cards?.some((card) => !hs.includes(card));
              }
            }
            return false;
          });
        },
        async content(event, trigger, player) {
          await player.draw();
        }
      },
      effect: {
        mod: {
          cardUsable: () => Infinity
        },
        trigger: {
          player: "useCard1"
        },
        forced: true,
        charlotte: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          player.removeSkill(event.name);
          if (trigger.addCount !== false) {
            trigger.addCount = false;
            const stat = player.getStat().card;
            const name2 = trigger.card.name;
            if (typeof stat[name2] === "number") {
              stat[name2]--;
            }
          }
        },
        mark: true,
        intro: {
          content: "使用下一张牌无次数限制"
        }
      }
    }
  },
  olsbzhijue: {
    audio: 5,
    zhuanhuanji: true,
    marktext: "☯",
    mark: true,
    intro: {
      content(storage, player) {
        if (!storage) {
          return `出牌阶段，你可将牌堆顶的一张牌当【火攻】使用，若你以此法未造成伤害，你令〖知天〗可见牌与观看牌数-1（至少减至1），然后你摸两张牌。`;
        }
        return `出牌阶段，你可将一种颜色的手牌置入弃牌堆（每种颜色每回合限一次），然后可视为使用其中一张基本牌或普通锦囊牌，若你以此法未造成伤害，你令〖知天〗可见牌与观看牌数-1（至少减至1），然后你摸两张牌。`;
      }
    },
    enable: "phaseUse",
    filter(event, player) {
      const bool = player.storage.olsbzhijue;
      if (!bool) {
        return event.filterCard(get.autoViewAs({ name: "huogong" }, "unsure"), player, event);
      }
      if (bool) {
        const used = player.getStorage("olsbzhijue_used");
        return player.hasCard((card) => !used.includes(get.color(card, player)), "h");
      }
      return false;
    },
    chooseButton: {
      dialog(event, player) {
        const bool = player.storage.olsbzhijue;
        const dialog = ui.create.dialog("智绝", "hidden");
        if (!bool) {
          dialog.add([["huogong"], "vcard"]);
          dialog.direct = true;
        } else {
          const colors = player.getCards("h").map((card) => get.color(card, player)).unique();
          dialog.addText("请将一种颜色的手牌置入弃牌堆");
          dialog.add([colors.map((i) => [i, get.translation(i)]), "tdnodes"]);
        }
        return dialog;
      },
      filter(button, player) {
        if (button.link == "huogong") {
          return true;
        }
        return !player.getStorage("olsbzhijue_used").includes(button.link);
      },
      check(button) {
        if (button.link == "huogong") {
          return true;
        }
        const player = get.player();
        return 114514 - player.countCards("h", (card) => get.color(card, player) == button.link);
      },
      backup(links, player) {
        const bool = player.storage.olsbzhijue;
        const backup = get.copy(lib.skill[`olsbzhijue_${!bool ? "yang" : "yin"}`]);
        if (bool) {
          backup.filterCard = function(card, player2) {
            return get.color(card, player2) == links[0];
          };
          backup.link = links[0];
        }
        return backup;
      },
      prompt(links, player) {
        const link = links[0];
        if (!player.storage.olsbzhijue) {
          return `将牌堆顶的${get.translation(_status.pileTop)}当火攻使用`;
        } else {
          return `将${get.translation(link)}手牌置入弃牌堆`;
        }
      }
    },
    ai: {
      order: 5,
      result: {
        player: 1
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "已置入过的颜色：$"
        }
      },
      backup: {},
      yang: {
        audio: "olsbzhijue",
        logAudio: () => ["olsbzhijue", 3],
        filterCard: () => false,
        selectCard: -1,
        viewAs(cards2, player) {
          const event = get.event(), filter = event._backup.filterCard;
          const viewAs = {
            name: "huogong",
            cards: [_status.pileTop]
          };
          if (filter(get.autoViewAs(viewAs, _status.pileTop), player, event)) {
            return viewAs;
          }
          return null;
        },
        async precontent(event, trigger, player) {
          player.changeZhuanhuanji("olsbzhijue");
          event.result.cards = get.cards(1, true);
          player.addTempSkill("olsbzhijue_effect");
        }
      },
      yin: {
        audio: "olsbzhijue",
        logAudio: () => ["olsbzhijue4.mp3", "olsbzhijue5.mp3"],
        position: "h",
        selectCard: -1,
        lose: false,
        discard: false,
        delay: false,
        async content(event, trigger, player) {
          player.changeZhuanhuanji("olsbzhijue");
          player.addTempSkill("olsbzhijue_used");
          player.markAuto("olsbzhijue_used", get.info(event.name).link);
          const { cards: cards2 } = event;
          await player.loseToDiscardpile(cards2);
          let noDamage = true;
          const viewAs = (card) => new lib.element.VCard({ name: card.name, nature: card.nature, isCard: true });
          const cardsx = cards2.filter((card) => ["basic", "trick"].includes(get.type(card)) && player.hasUseTarget(viewAs(card)));
          if (cardsx.length) {
            const result = await player.chooseButton([`智绝：你可视为使用其中一张基本牌或普通锦囊牌`, cards2]).set("cards", cardsx).set("filterButton", (button) => get.event().cards.includes(button.link)).set("ai", (button) => {
              const player2 = get.player(), card = button.link;
              return player2.getUseValue({ name: card.name, nature: card.nature, isCard: true });
            }).forResult();
            if (result?.links?.length) {
              const card = viewAs(result.links[0]);
              const next = player.chooseUseTarget(card, true);
              await next;
              if (game.hasPlayer2(
                (target) => target.hasHistory("damage", (evt) => {
                  return evt.getParent("useCard", true)?.getParent() == next;
                }),
                true
              )) {
                noDamage = false;
              }
            }
          }
          if (noDamage && player.countMark("olsbzhitian") < 6) {
            await player.useResult({ skill: "olsbzhijue_effect" }, event);
          }
        }
      },
      effect: {
        audio: "olsbzhijue",
        logAudio(event, player) {
          const bool = player.getStorage("olsbzhijue", false);
          if (bool) {
            return ["olsbzhijue4.mp3", "olsbzhijue5.mp3"];
          }
          return ["olsbzhijue", 3];
        },
        forced: true,
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          return event.skill == "olsbzhijue_backup" && !game.hasPlayer2((target) => target.hasHistory("damage", (evt) => evt.card == event.card), true) && player.countMark("olsbzhitian") < 6;
        },
        async content(event, trigger, player) {
          player.addMark("olsbzhitian", 1, false);
          await player.draw(2);
        }
      }
    }
  },
  //魔吕布
  olduoqi: {
    audio: 2,
    group: ["olduoqi_gain", "olduoqi_mark"],
    trigger: { global: "phaseBeforeEnd" },
    forced: true,
    cardslist(player, target, killGain = false) {
      const filterCard = (card) => card.hasGaintag("eternal_olduoqi_tag") && target._start_cards?.includes(card);
      let cards2 = [...ui.cardPile.childNodes, ...ui.discardPile.childNodes].filter(filterCard);
      const lose_list = [];
      const targets = game.filterPlayer();
      targets.forEach((targetx) => {
        const pos = "ej" + (targetx !== player ? "h" : "");
        const cardsx = targetx.getCards(pos, filterCard);
        if (cardsx.length) {
          cards2 = cards2.concat(cardsx);
          if (killGain) {
            targetx.$throw(cards2, 1e3);
            lose_list.push([targetx, cards2]);
          }
        }
      });
      return killGain ? [cards2, lose_list] : cards2;
    },
    filter(event, player) {
      if (event.player.getSeatNum() != 1 || _status?.olduoqi_record?.includes(player) || event.finished) {
        return false;
      }
      let history = event.player.actionHistory;
      if (history.length > 1) {
        for (let i = 0; i < history.length - 2; i++) {
          if (!history[i].isMe || history[i].isSkipped) {
            continue;
          }
          return false;
        }
      }
      return !player.isTurnedOver() || event._noTurnOver;
    },
    onRound(event) {
      return !event.olduoqi_phase;
    },
    async content(event, trigger, player) {
      if (!_status.olduoqi_record) {
        _status.olduoqi_record = [];
      }
      _status.olduoqi_record.add(player);
      game.broadcastAll((record) => {
        _status.olduoqi_record = record;
      }, _status.olduoqi_record);
      const next = player.insertPhase();
      next._noTurnOver = true;
      next.set("phaseList", ["phaseUse"]);
      player.when({ player: "phaseBegin" }, false).assign({ firstDo: true }).filter((evt) => evt.skill == "olduoqi").step(async () => {
        player.addTempSkill("olduoqi_limit");
      }).finish();
      if (!trigger._finished) {
        trigger.finish();
        trigger._finished = true;
        trigger.untrigger(true);
        trigger._triggered = 5;
        if (!lib.onround.includes(get.info("olduoqi").onRound)) {
          lib.onround.push(get.info("olduoqi").onRound);
        }
        const evt = trigger.player.insertPhase();
        evt.set("olduoqi_phase", true);
        evt.relatedEvent = trigger.relatedEvent || trigger.getParent(2);
        evt.skill = trigger.skill;
        evt._noTurnOver = trigger._noTurnOver;
        evt.set("phaseList", trigger.phaseList);
        evt.pushHandler("olduoqi_phase", (event2, option) => {
          if (event2.step === 0 && option.state === "begin") {
            event2.step = 4;
            _status.globalHistory.push({
              cardMove: [],
              custom: [],
              useCard: [],
              changeHp: [],
              everything: []
            });
            let players = game.players.slice(0).concat(game.dead);
            for (let i = 0; i < players.length; i++) {
              let current = players[i];
              current.actionHistory.push({
                useCard: [],
                respond: [],
                skipped: [],
                lose: [],
                gain: [],
                sourceDamage: [],
                damage: [],
                custom: [],
                useSkill: []
              });
              current.stat.push({ card: {}, skill: {} });
            }
          }
        });
      }
      const nexts = trigger.getParent()?.next;
      if (nexts?.length) {
        for (let evt of nexts.slice(0)) {
          if (evt.finished) {
            continue;
          }
          if (evt == next) {
            break;
          }
          nexts.remove(evt);
          nexts.push(evt);
        }
      }
    },
    subSkill: {
      gain: {
        audio: "olduoqi",
        trigger: { source: "damageSource" },
        forced: true,
        filter(event, player) {
          const cards2 = get.info("olduoqi").cardslist(player, event.player);
          return player.getHistory("sourceDamage", (evt) => {
            return evt.player === event.player;
          }).indexOf(event) == 0 && event.player?._start_cards?.some((card) => cards2.includes(card));
        },
        async content(event, trigger, player) {
          const cards2 = get.info("olduoqi").cardslist(player, trigger.player);
          if (cards2.length) {
            const card = cards2.randomGet();
            if (get.owner(card)) {
              await player.gain(card, "give", get.owner(card));
            } else {
              await player.gain(card, "gain2");
            }
          }
        }
      },
      mark: {
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        forced: true,
        popup: false,
        filter(event, player) {
          return (event.name != "phase" || game.phaseNumber == 0) && game.hasPlayer((target) => target._start_cards?.length);
        },
        async content(event, trigger, player) {
          game.filterPlayer().forEach((target) => target.addGaintag(target._start_cards || [], "eternal_olduoqi_tag"));
        }
      },
      tag: {},
      limit: {
        charlotte: true,
        mod: {
          cardEnabled(card, player) {
            if (get.type(card) == "delay") {
              return false;
            }
          },
          cardSavable(card, player) {
            if (get.type(card) == "delay") {
              return false;
            }
          }
        }
      }
    }
  },
  olkuangmo: {
    group: "olkuangmo_point",
    audio: 3,
    enable: "phaseUse",
    skillAnimation: "epic",
    animationColor: "metal",
    filter(event, player) {
      return game.hasPlayer((current) => player !== current) && !player.hasSkill("olrumo");
    },
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      player.addSkill("olrumo");
      const target = event.targets[0];
      const name2 = event.name + "_effect";
      player.markAuto(name2, target);
      target.markAuto(name2, player);
      player.addTip(name2, "狂 " + player.getStorage(name2).map((targetx) => get.translation(targetx)));
      target.addTip(name2, "狂 " + target.getStorage(name2).map((targetx) => get.translation(targetx)));
      target.addSkill(name2);
      player.addSkill(name2);
    },
    ai: {
      order: 8,
      result: {
        player: 8,
        target(player, target) {
          return get.damageEffect(target, player, target);
        }
      }
    },
    subSkill: {
      point: {
        trigger: {
          global: "dieAfter"
        },
        forced: true,
        lastDo: true,
        skillAnimation: "epic",
        animationColor: "metal",
        filter(event, player) {
          return player.getStorage("olkuangmo_effect").includes(event.player) && game.hasPlayer((current) => player !== current && !player.getStorage("olkuangmo_effect").includes(current));
        },
        async content(event, trigger, player) {
          const result = await player.chooseTarget(get.prompt("olkuangmo"), "重新指定一名角色，你与其成为“狂”角色", lib.filter.notMe, true).set("ai", (target2) => {
            const player2 = get.player();
            return get.damageEffect(target2, player2, player2);
          }).forResult();
          if (!result?.targets?.[0]?.isIn()) {
            return;
          }
          const target = result.targets[0];
          player.line(target, "fire");
          const name2 = "olkuangmo_effect";
          player.unmarkAuto(name2, trigger.player);
          player.markAuto(name2, target);
          target.markAuto(name2, player);
          player.addTip(name2, "狂 " + player.getStorage(name2).map((targetx) => get.translation(targetx)));
          target.addTip(name2, "狂 " + target.getStorage(name2).map((targetx) => get.translation(targetx)));
          target.addSkill(name2);
          player.addSkill(name2);
        }
      },
      effect: {
        mark: true,
        marktext: "狂",
        intro: {
          content: "跟$魔怔上了"
        },
        trigger: {
          source: ["damageBegin1", "dieAfter"]
        },
        charlotte: true,
        popup: false,
        forced: true,
        filter(event, player) {
          if (event.name == "damage" && game.getGlobalHistory("everything", (evt) => {
            return evt.name == "damage" && evt.source == player && event.player == evt.player;
          }).indexOf(event) != 0) {
            return false;
          }
          return player.getStorage("olkuangmo_effect").includes(event.player);
        },
        async content(event, trigger, player) {
          if (trigger.name == "damage") {
            trigger.num++;
          } else {
            const target = trigger.player;
            const list = get.info("olduoqi").cardslist(player, target, true);
            const cards2 = list[0];
            const lose_list = list[1];
            await game.loseAsync({ lose_list }).setContent("chooseToCompareLose");
            await game.delayx();
            await player.gain(cards2, "gain2");
          }
        },
        ai: {
          presha: true
        }
      }
    }
  },
  olgangquan: {
    audio: 2,
    init(player, skill) {
      player.addSkill(skill + "_mark");
    },
    onremove(player, skill) {
      player.removeSkill(skill + "_mark");
    },
    enable: "chooseToUse",
    filter(event, player) {
      const bool = event.olgangquan, type = bool ? "equip" : "trick", viewAs = bool ? { name: "sha", nature: "fire" } : { name: "juedou" }, card = get.autoViewAs(viewAs, "unsure");
      return event.filterCard(card, player, event) && player.hasCard((card2) => get.type2(card2) == type, "hes");
    },
    hiddenCard(player, name2) {
      return name2 == "juedou" && player.hasCard((card) => get.type2(card) == "trick", "hes") || name2 == "sha" && player.hasCard((card) => get.type2(card) == "equip", "hes");
    },
    /*locked: false,
    mod: {
    	playerEnabled(card, player, target) {
    		if (!card.storage?.olgangquan || get.name(card) != "sha" || player._olgangquanCheck) {
    			return;
    		}
    		player._olgangquanCheck = true;
    		const bool = [player.getNext(), player.getPrevious()].some(target => {
    			return target?.isIn() && !player.canUse(get.card(), target, null, true);
    		});
    		delete player._olgangquanCheck;
    		if (bool) {
    			return false;
    		}
    	},
    },*/
    onChooseToUse(event) {
      if (game.online || event?.olgangquan) {
        return;
      }
      const evt = get.info("dcjianying").getLastUsed(event.player);
      event.set(
        "olgangquan",
        evt.cards?.some((card) => card.hasGaintag("eternal_olduoqi_tag"))
      );
    },
    chooseButton: {
      dialog(event, player) {
        const list = get.inpileVCardList((info) => {
          return event.olgangquan ? info[2] == "sha" && info[3] === "fire" : info[2] == "juedou";
        });
        const dialog = ui.create.dialog("罡拳", [list, "vcard"]);
        dialog.direct = true;
        return dialog;
      },
      check(button) {
        return get.player().getUseValue({
          name: button.link[2],
          nature: button?.link[3]
        });
      },
      backup(links, player) {
        return {
          audio: "olgangquan",
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            storage: {
              olgangquan: true
            }
          },
          choice: links[0][2],
          filterCard(card) {
            if (get.info("olgangquan_backup").choice == "sha") {
              return get.type2(card) == "equip";
            }
            return get.type2(card) == "trick";
          },
          position: "hes",
          selectCard: 1,
          filterTarget(card, player2, target) {
            if (get.info("olgangquan_backup").choice == "sha") {
              if (![player2.getPrevious(), player2.getNext()].includes(target)) {
                return false;
              }
              return lib.filter.targetEnabled.apply(this, arguments);
            }
            return lib.filter.filterTarget.apply(this, arguments);
          },
          selectTarget() {
            return get.info("olgangquan_backup").choice != "sha" ? 1 : -1;
          },
          filterOk() {
            return ui.selected.targets?.length > 0;
          },
          popname: true
        };
      },
      prompt(links, player) {
        const card = `${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}`;
        return `###罡拳###将一张${links[0][2] === "sha" ? "装备" : "锦囊"}牌当做${card}使用`;
      }
    },
    ai: {
      order: 9,
      result: {
        player: 8
      }
    },
    subSkill: {
      backup: {},
      mark: {
        charlotte: true,
        silent: true,
        markColor: ["rgba(72, 118, 255, 1)", "rgba(255, 69, 0, 1)"],
        init(player, skill) {
          const evt = get.info("dcjianying").getLastUsed(player);
          const bool = evt.cards?.some((card) => card.hasGaintag("eternal_olduoqi_tag"));
          player.markSkill(skill);
          game.broadcastAll(
            function(index, player2) {
              const name2 = "olgangquan_mark";
              const bgColor = get.info(name2).markColor[index], text = `<span style = "color:#000000;font-weight:bold">${index ? "杀" : "斗"}</span>`;
              if (player2.marks[name2]) {
                player2.marks[name2].firstChild.style.backgroundColor = bgColor;
                player2.marks[name2].firstChild.innerHTML = text;
              }
              player2.update();
            },
            Number(!!bool),
            player
          );
        },
        trigger: {
          player: "useCard1"
        },
        async content(event, trigger, player) {
          get.info(event.name).init(player, event.name);
        },
        intro: {
          content: "图标的文字就是【罡拳】能印的牌"
        }
      }
    }
  },
  //魔貂蝉
  olhuanhuo: {
    audio: 2,
    trigger: { global: "roundStart" },
    forced: true,
    locked: false,
    async content(event, trigger, player) {
      await player.draw(2);
      const num = Math.min(
        2,
        game.countPlayer((target) => target != player)
      );
      if (!num) {
        return;
      }
      const result = await player.chooseCardTarget({
        prompt: get.prompt(event.name),
        prompt2: `弃置至多两张牌并选择等量其他角色，这些角色下回合出牌阶段强制选中一张可以使用的手牌，且使用一张牌后随机弃置一张牌，直到其使用了两张牌`,
        filterCard: lib.filter.cardDiscardable,
        selectCard: [1, num],
        filterTarget: lib.filter.notMe,
        selectTarget: [1, num],
        complexCard: true,
        position: "he",
        filterOk() {
          if (!ui.selected.cards.length) {
            return false;
          }
          return ui.selected.cards.length == ui.selected.targets.length;
        },
        ai1(card) {
          return get.event().resultAI.cards.includes(card);
        },
        ai2(target) {
          return get.event().resultAI.targets.includes(target);
        }
      }).set(
        "resultAI",
        (function() {
          let cards2 = player.getDiscardableCards(player, "he", (card) => get.value(card) < 7.5).sort((a, b) => get.value(a) - get.value(b)), targets = game.filterPlayer((current) => current != player && -get.attitude(player, current) * current.countCards("hs") > 0).sort((a, b) => {
            let num1 = -get.attitude(get.player(), a) * a.countCards("hs"), num22 = -get.attitude(get.player(), b) * b.countCards("hs");
            return num22 - num1;
          });
          const num2 = Math.min(cards2.length, targets.length, num);
          cards2 = cards2.slice(0, num2);
          targets = targets.slice(0, num2);
          return { cards: cards2, targets };
        })()
      ).forResult();
      if (result?.cards?.length && result.targets?.length) {
        const { cards: cards2, targets } = result;
        await player.discard(cards2);
        player.line(targets);
        targets.forEach((target) => target.addSkill(event.name + "_mark"));
      }
    },
    subSkill: {
      backup: {
        filterCard(card, player, event) {
          return get.itemtype(card) == "card" && card == get.event().olhuanhuo_debuff;
        },
        viewAs(cards2, player) {
          if (cards2.length) {
            const card = get.event().olhuanhuo_debuff;
            return {
              name: get.name(card, player),
              nature: get.nature(card, player),
              cards: [card],
              isCard: true
            };
          }
          return null;
        },
        popname: true,
        log: false
      },
      mark: {
        charlotte: true,
        mark: true,
        intro: { content: "下回合出牌阶段强制选中一张可以使用的手牌，且使用一张牌后随机弃置一张牌，直到使用了两张牌" },
        trigger: { player: "phaseBegin" },
        firstDo: true,
        silent: true,
        async content(event, trigger, player) {
          player.removeSkill(event.name);
          player.addTempSkill("olhuanhuo_limit");
        }
      },
      limit: {
        charlotte: true,
        trigger: { player: "phaseUseBegin" },
        silent: true,
        async content(event, trigger, player) {
          player.addTempSkill("olhuanhuo_debuff", "phaseUseAfter");
          player.addMark("olhuanhuo_debuff", 2, false);
        }
      },
      debuff: {
        charlotte: true,
        onremove: true,
        intro: { content: "当前“幻惑”剩余次数：#" },
        trigger: { player: ["chooseToUseBegin", "useCardAfter"] },
        filter(event, player) {
          if (event.name == "chooseToUse") {
            return event.type == "phase";
          }
          return event.isPhaseUsing(player);
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          if (trigger.name == "useCard") {
            player.removeMark(event.name, 1, false);
            const hs = player.getDiscardableCards(player, "h"), es = player.getDiscardableCards(player, "e");
            const card = hs.length ? hs.randomGet() : es?.randomGet();
            if (card) {
              await player.discard(card);
            }
            if (!player.hasMark(event.name)) {
              player.removeSkill(event.name);
            }
          } else {
            game.broadcastAll(() => _status._olhuanhuo_debuff_check = true);
            const cards2 = player.getCards("h", (card2) => player.hasUseTarget(card2, null, trigger));
            game.broadcastAll(() => delete _status._olhuanhuo_debuff_check);
            if (!cards2.length) {
              return;
            }
            const card = cards2.randomGet();
            trigger.set(event.name, card);
            const name2 = "olhuanhuo_backup";
            trigger.set("openskilldialog", `受【${get.translation(event.name)}】影响，须使用${get.translation(card)}`);
            trigger.set("norestore", true);
            trigger.set("_backupevent", name2);
            trigger.set("custom", {
              add: {},
              replace: { window() {
              } }
            });
            trigger.backup(name2);
          }
        }
      }
    }
  },
  olqingshi: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return !player.hasSkill("olrumo") || !game.hasPlayer((target) => target.countCards("h", (card) => card.hasGaintag("olqingshi_tag")));
    },
    async cost(event, trigger, player) {
      let result;
      if (!player.hasSkill("olrumo")) {
        result = await player.chooseBool(get.prompt2(event.skill)).set("choice", true).forResult();
      } else {
        result = { bool: true };
      }
      if (result.bool) {
        event.result = {
          bool: true,
          targets: game.filterPlayer().sortBySeat()
        };
      }
    },
    async content(event, trigger, player) {
      if (!player.hasSkill("olrumo")) {
        const name2 = event.name + "_animate";
        player.trySkillAnimate(name2, name2, player.checkShow(name2));
        player.addSkill("olrumo");
      }
      const { targets } = event;
      const effect = async (target) => {
        const card = get.cardPile((card2) => {
          const info = get.info(card2);
          return get.is.damageCard(card2) && info.selectTarget && get.select(info.selectTarget).every((num) => num == 1);
        });
        if (card) {
          const next = target.gain(card, "draw");
          next.gaintag.add("olqingshi_tag");
          await next;
        } else {
          target.chat("无牌可拿");
        }
      };
      await game.doAsyncInOrder(targets, effect);
    },
    group: ["olqingshi_effect"],
    subSkill: {
      tag: {},
      animate: {
        skillAnimation: true,
        animationColor: "metal"
      },
      effect: {
        audio: "olqingshi",
        trigger: {
          global: ["damageSource", "loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "useCardToPlayer"]
        },
        filter(event, player, name2) {
          const tag = "olqingshi_tag";
          if (name2 == "useCardToPlayer") {
            const evtx = event.getParent();
            return event.targets.length == 1 && event.player != player && event.isFirstTarget && game.hasPlayer2((target) => {
              return target.hasHistory("lose", (evt2) => {
                if ((evt2.relatedEvent || evt2.getParent()) != evtx) {
                  return false;
                }
                return Object.values(evt2.gaintag_map || {}).flat().includes(tag);
              });
            });
          } else if (event.name == "damage") {
            return event.card && event.cards && game.hasPlayer2((target) => {
              return target.hasHistory("lose", (evt2) => {
                if (evt2.getParent().card != event.card || evt2.relatedEvent?.card == event.card) {
                  return false;
                }
                return Object.values(evt2.gaintag_map || {}).flat().includes(tag);
              });
            });
          }
          if (event.name.indexOf("lose") == 0) {
            if (event.getlx === false || event.position != ui.discardPile) {
              return false;
            }
          } else {
            var evt = event.getParent();
            if (evt.relatedEvent?.name == "useCard") {
              return false;
            }
          }
          return lib.skill.olqingshi_effect.getCards(event, tag).length;
        },
        getCards(event, tag) {
          const cards2 = [];
          const targets = game.filterPlayer2();
          for (const target of targets) {
            if (event.name.startsWith("lose")) {
              const evt = event.getl(target);
              cards2.addArray(evt.cards2.filter((card) => evt.gaintag_map?.[card.cardid]?.includes(tag) && get.position(card) == "d"));
            } else {
              game.checkGlobalHistory("cardMove", (evt) => {
                if (evt.name != "cardsDiscard" || evt != event) {
                  return false;
                }
                const evtx = evt.getParent();
                if (evtx.name != "orderingDiscard") {
                  return false;
                }
                const evt2 = evtx.relatedEvent || evtx.getParent();
                target.checkHistory("lose", (evt3) => {
                  const evt4 = evt3.relatedEvent || evt3.getParent();
                  if (evt2 != evt4) {
                    return false;
                  }
                  cards2.addArray(evt3.getl(target).cards2.filter((card) => evt3.gaintag_map?.[card.cardid]?.includes(tag) && get.position(card) == "d"));
                });
              });
            }
          }
          return cards2;
        },
        async cost(event, trigger, player) {
          const name2 = event.triggername;
          if (name2 == "useCardToPlayer") {
            const targets = game.filterPlayer((target) => lib.filter.targetEnabled2(trigger.card, trigger.player, target));
            const next = player.chooseCardTarget({
              prompt: `###${get.prompt(event.skill, trigger.player)}###弃置一张牌，为${get.translation(trigger.card)}重新指定目标（无距离限制）`,
              filterCard: lib.filter.cardDiscardable,
              position: "he",
              filterTarget(card, player2, target) {
                return get.event().targets.includes(target);
              },
              ai1(card) {
                if (get.event().goon) {
                  return 7 - get.value(card);
                }
                return 0;
              },
              ai2(target) {
                return get.effect(target, get.event().getTrigger().card, get.event().getTrigger().player, get.player());
              },
              targets,
              goon: Math.max(...targets.filter((target) => target != trigger.target).map((target) => get.effect(target, trigger.card, trigger.player, player))) > get.effect(trigger.target, trigger.card, trigger.player, player)
            });
            next.targetprompt2.add((target) => {
              if (!target.isIn() || target != get.event().getTrigger().target) {
                return false;
              }
              return "原目标";
            });
            event.result = await next.forResult();
          } else {
            event.result = {
              bool: true
            };
          }
        },
        async content(event, trigger, player) {
          const name2 = event.triggername;
          if (name2 == "useCardToPlayer") {
            const { cards: cards2, targets } = event;
            await player.discard(cards2);
            const evt = trigger.getParent();
            player.line(targets);
            evt.targets.length = 0;
            evt.targets.addArray(targets);
            game.log(targets, "成为了", trigger.card, "的新目标");
          } else if (trigger.name == "damage") {
            await player.draw();
          } else {
            const cards2 = lib.skill[event.name].getCards(trigger, "olqingshi_tag");
            await player.gain(cards2, "gain2");
          }
        }
      }
    }
  },
  //界郭皇后 ——by 阿巴阿巴
  oljiaozhao: {
    audio: 2,
    derivation: ["oljiaozhao_lv1", "oljiaozhao_lv2"],
    onChooseToUse(event) {
      if (!game.online && event.type == "phase" && !event.oljiaozhao_list && !event.player.countMark("oldanxin")) {
        event.set(
          "oljiaozhao_list",
          game.getRoundHistory("useCard").map((evt) => get.name(evt.card)).unique()
        );
      }
    },
    hiddenCard(player, name2) {
      const event = get.event();
      if (!lib.inpile.includes(name2) || !["basic", "trick"].includes(get.type(name2)) || player.hasSkill("oljiaozhao_used")) {
        return false;
      }
      const num = player.countMark("oldanxin");
      if (!num) {
        return event.type == "phase" && player.countCards("hes") > 0 && !event.oljiaozhao_list?.includes(name2);
      }
      return num == 1 ? player.countCards("hes") > 0 : true;
    },
    enable: ["chooseToUse"],
    getList(event, player) {
      const num = player.countMark("oldanxin");
      const exclude = event.oljiaozhao_list || [];
      return get.inpileVCardList((info) => {
        if (!["basic", "trick"].includes(info[0]) || exclude.includes(info[2])) {
          return false;
        }
        let vcard = [{ name: info[2], nature: info[3] }];
        if (num < 2) {
          vcard = [...vcard, "unsure"];
        } else {
          vcard[0].isCard = true;
        }
        return event.filterCard(get.autoViewAs(...vcard), player, event);
      });
    },
    filter(event, player) {
      const num = player.countMark("oldanxin");
      if (!num && event.type != "phase") {
        return false;
      }
      if (player.hasSkill("oljiaozhao_used")) {
        return false;
      }
      return get.info("oljiaozhao").getList(event, player).length > 0 && (num < 2 ? player.countCards("hes") > 0 : true);
    },
    chooseButton: {
      dialog(event, player) {
        const dialog = ui.create.dialog("矫诏", [get.info("oljiaozhao").getList(event, player), "vcard"], "hidden");
        return dialog;
      },
      check(button) {
        return get.player().getUseValue({
          name: button.link[2],
          nature: button?.link[2]
        }) || 0.1;
      },
      backup(links, player) {
        const num = player.countMark("oldanxin");
        const viewAs = { name: links[0][2], nature: links[0][3] };
        if (num == 2) {
          viewAs.isCard = true;
        }
        return {
          log: false,
          viewAs,
          selectCard: num < 2 ? 1 : 0,
          filterCard: num < 2 ? true : () => false,
          position: "hes",
          async precontent(event, trigger, player2) {
            const num2 = player2.countMark("oldanxin");
            player2.logSkill("oljiaozhao");
            player2.addTempSkill("oljiaozhao_used", !num2 ? "phaseChange" : "roundStart");
          }
        };
      },
      prompt(links, player) {
        const num = player.countMark("oldanxin");
        const card = `${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}`;
        if (num < 2) {
          return `###矫诏###将一张牌当作${card}使用`;
        }
        return `###矫诏###视为使用${card}`;
      }
    },
    ai: {
      order: 9,
      fireAttack: true,
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        if (arg === "respond") {
          return false;
        }
        return player.countMark("oldanxin") > 0 && (() => {
          switch (tag) {
            case "fireAttack":
              return ["sha"];
            default:
              return [tag.slice("respond".length).toLowerCase()];
          }
        })().some((name2) => get.info("oljiaozhao").hiddenCard(player, name2));
      },
      result: {
        player(player) {
          if (_status.event.dying && player.countMark("oldanxin") > 0) {
            return get.attitude(player, _status.event.dying);
          }
          return 1;
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true
      },
      lv1: {
        nopop: true
      },
      lv2: {
        nopop: true
      },
      backup: {}
    }
  },
  oldanxin: {
    audio: 2,
    trigger: {
      player: "damageEnd"
    },
    frequent: true,
    intro: { content: "当前升级等级：Lv#" },
    async content(event, trigger, player) {
      const num = player.countMark("oldanxin");
      if (num > 0) {
        await player.draw({ num });
      }
      if (num < 2) {
        player.addMark("oldanxin", 1, false);
        if (num == 1) {
          player.removeSkill("oljiaozhao_used");
        }
      }
    },
    ai: {
      maixie: true,
      effect: {
        target: (card, player, target) => {
          if (!get.tag(card, "damage") || !game.hasPlayer((targetx) => targetx != target && targetx.isFriendsOf(target))) {
            return;
          }
          if (target.hp + target.hujia < 2 || player.hasSkillTag("jueqing", false, target)) {
            return 2;
          }
          if (!target.hasSkill("oljiaozhao")) {
            return [1, 1];
          }
          return [1, 0.8 * target.hp - 0.4 * target.countMark("oldanxin")];
        }
      }
    }
  },
  old_oljiaozhao: {
    audio: "oljiaozhao",
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return get.inpileVCardList((info) => {
        if (!["basic", "trick"].includes(info[0])) {
          return false;
        }
        if (player.countMark("old_oldanxin") > 1) {
          return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3], storage: { old_oljiaozhao: player } }), player, event);
        }
        return player.countMark("old_oldanxin") || !player.getStorage("old_oljiaozhao_used").includes(info[2]);
      }).length > 0;
    },
    chooseButton: {
      dialog(event, player) {
        const list = get.inpileVCardList((info) => {
          if (!["basic", "trick"].includes(info[0])) {
            return false;
          }
          if (player.countMark("old_oldanxin") > 1) {
            return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3], storage: { old_oljiaozhao: player } }), player, event);
          }
          return player.countMark("old_oldanxin") || !player.getStorage("old_oljiaozhao_used").includes(info[2]);
        });
        const dialog = ui.create.dialog("矫诏", [list, "vcard"]);
        dialog.direct = true;
        return dialog;
      },
      check(button) {
        return get.player().getUseValue({
          name: button.link[2],
          nature: button?.link[2],
          storage: { old_oljiaozhao: get.player() }
        }) || 0.1;
      },
      backup(links, player) {
        if (player.countMark("old_oldanxin") > 1) {
          return {
            audio: "old_oljiaozhao",
            viewAs: {
              name: links[0][2],
              nature: links[0][3],
              storage: { old_oljiaozhao: player },
              isCard: true
            },
            filterCard: () => false,
            selectCard: -1,
            popname: true
          };
        } else {
          return {
            ai1(card) {
              return 8 - get.value(card);
            },
            viewasCard: {
              name: links[0][2],
              nature: links[0][3],
              storage: { old_oljiaozhao: player }
            },
            filterCard: true,
            discard: false,
            lose: false,
            delay: false,
            async content(event, trigger, player2) {
              const card = event.cards[0];
              await player2.showCards(card);
              const fakecard = get.info(event.name)?.viewasCard;
              game.broadcastAll((card2) => {
                card2.addGaintag("old_oljiaozhao");
              }, card);
              player2.addSkill("old_oljiaozhao_used");
              player2.markAuto("old_oljiaozhao_used", fakecard.name);
              player2.chat(get.translation(fakecard));
              game.log(player2, "声明了", "#g" + get.translation(fakecard));
              player2.addTempSkill("old_oljiaozhao_viewas");
              const map = player2.getStorage("old_oljiaozhao_viewas", /* @__PURE__ */ new Map());
              map.set(card, (map.get(card) || []).concat([fakecard]));
              player2.setStorage("old_oljiaozhao_viewas", map);
            },
            ai: {
              order: 9,
              result: {
                player: 8
              }
            }
          };
        }
      },
      prompt(links, player) {
        let card = `${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}`;
        if (player.countMark("old_oldanxin") > 1) {
          return `###矫诏###视为使用一张${card}（你不是此牌的合法目标）`;
        }
        return `###矫诏###展示一张手牌，本回合你可将此牌当做${card}使用（你不是此牌的合法目标）。`;
      }
    },
    ai: {
      order: 9,
      result: {
        player: 8
      }
    },
    locked: false,
    mod: {
      targetEnabled(card, player, target) {
        if (card.storage?.old_oljiaozhao == target) {
          return false;
        }
      }
    },
    derivation: ["old_oljiaozhao_lv1", "old_oljiaozhao_lv2"],
    subSkill: {
      lv1: {
        nopop: true
      },
      lv2: {
        nopop: true
      },
      backup: {},
      viewas_backup: {},
      used: {
        onremove: true,
        charlotte: true
      },
      viewas: {
        enable: "chooseToUse",
        charlotte: true,
        locked: false,
        mod: {
          targetEnabled(card, player, target) {
            if (card.storage?.old_oljiaozhao == target) {
              return false;
            }
          }
        },
        onChooseToUse(event) {
          if (game.online || event.old_oljiaozhao_record) {
            return;
          }
          event.set("old_oljiaozhao_record", event.player.getStorage("old_oljiaozhao_viewas", /* @__PURE__ */ new Map()));
        },
        filter(event, player) {
          const map = event.old_oljiaozhao_record;
          return map && player.countCards("h", (card) => {
            if (!map.has(card)) {
              return false;
            }
            return map.get(card)?.some((vcard) => {
              return event.filterCard(get.autoViewAs(vcard, [card]), player, event);
            });
          });
        },
        chooseButton: {
          dialog(event, player) {
            const map = event.old_oljiaozhao_record, list = [], names = [];
            map.forEach((vcards, card) => {
              if (!player.getCards("h").includes(card)) {
                return false;
              }
              for (let vcard of vcards) {
                if (event.filterCard(get.autoViewAs(vcard, [card]), player, event)) {
                  list.push(vcard);
                  names.push(card);
                }
              }
            });
            const dialog = ui.create.dialog("矫诏", [list, "vcard"]);
            for (let i = 0; i < dialog.buttons?.length; i++) {
              dialog.buttons[i].node.gaintag.innerHTML = get.translation(names[i]);
            }
            dialog.direct = true;
            return dialog;
          },
          check(button) {
            return get.player().getUseValue({
              name: button.link[2],
              nature: button.link[3],
              storage: { old_oljiaozhao: get.player() }
            });
          },
          backup(links, player) {
            return {
              audio: "old_oljiaozhao",
              viewAs: links[0],
              record: get.event().old_oljiaozhao_record,
              filterCard(card) {
                const { viewAs, record } = get.info("old_oljiaozhao_viewas_backup");
                return card.hasGaintag("old_oljiaozhao") && record?.has(card) && record.get(card)?.includes(viewAs);
              },
              popname: true
            };
          },
          prompt(links, player) {
            return `###矫诏###将对应“矫诏”牌当做${get.translation(get.translation(links[0]))}使用`;
          }
        },
        hiddenCard(player, name2) {
          if (!lib.inpile.includes(name2)) {
            return false;
          }
          const map = player.getStorage("old_oljiaozhao_viewas", /* @__PURE__ */ new Map());
          return map.some((vcards, card) => {
            return player.getCards("h").includes(card) && vcards.some((vcard) => vcard.name == name2);
          });
        },
        onremove(player, skill) {
          player.removeGaintag("old_oljiaozhao");
          player.removeStorage(skill);
        },
        ai: {
          order: 8,
          result: {
            player: 1
          }
        }
      }
    }
  },
  old_oldanxin: {
    audio: "oldanxin",
    trigger: {
      player: "damageEnd"
    },
    frequent: true,
    intro: { content: "当前升级等级：Lv#" },
    async content(event, trigger, player) {
      await player.draw();
      if (player.countMark("old_oldanxin") < 2) {
        player.addMark("old_oldanxin", 1, false);
      }
    },
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
          if (!target.hasSkill("old_oljiaozhao") || target.countMark("old_oldanxin") > 1) {
            return [1, 1];
          }
          return [1, 0.8 * target.hp - 0.4];
        }
      }
    }
  },
  //谋小乔
  //洗脚女将，再添一员（？）
  olmiluo: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h") && game.hasPlayer((target) => target != player);
    },
    filterCard: true,
    position: "he",
    selectCard: () => [1, 2],
    filterTarget: lib.filter.notMe,
    selectTarget: () => ui.selected.cards.length,
    targetprompt() {
      const links = ui.selected.cards;
      return ["获得", get.translation(links[ui.selected.targets.length - 1])].join("<br>");
    },
    check(card) {
      const player = get.player();
      if (ui.selected.cards.length >= game.countPlayer((current) => {
        return current != player && get.attitude(player, current) > 0;
      })) {
        return 0;
      }
      return 6 - get.value(card);
    },
    multiline: true,
    multitarget: true,
    complexSelect: true,
    lose: false,
    discard: false,
    delay: false,
    async content(event, trigger, player) {
      const { targets, cards: links } = event;
      await player.showCards(links, get.translation(player) + "发动了【" + get.translation(event.name) + "】");
      const gain_list = targets.reduce((list, target, i) => {
        const card = links[i];
        if (get.owner(card) == player && "he".includes(get.position(card))) {
          return [...list, [target, card]];
        }
        return list;
      }, []);
      await game.loseAsync({
        gain_list,
        player,
        cards: links,
        giver: player,
        animate: "give",
        gaintag: ["olmiluo"]
      }).setContent("gaincardMultiple");
      player.addTempSkill(event.name + "_clear", "roundStart");
      player.markAuto(event.name + "_clear", targets);
    },
    group: ["olmiluo_end"],
    subSkill: {
      clear: {
        charlotte: true,
        onremove(player, skill) {
          player.storage[skill].forEach((target) => {
            target.removeGaintag("olmiluo");
          });
          delete player.storage[skill];
        }
      },
      end: {
        audio: "olmiluo",
        trigger: {
          global: "roundEnd"
        },
        filter(event, player) {
          return player.getStorage("olmiluo_clear").some((target) => target.isIn());
        },
        async cost(event, trigger, player) {
          const next = player.chooseTarget(`###${get.prompt(event.skill)}###令一名没有“迷落”牌的角色失去1点体力，或令一名有“迷落”牌的角色回复1点体力。`, (card, player2, target) => {
            return player2.getStorage("olmiluo_clear").includes(target);
          }).set("ai", (target) => {
            const player2 = get.player();
            if (target.countCards("h", (card) => card.hasGaintag("olmiluo"))) {
              return get.recoverEffect(target, player2, player2);
            }
            return get.effect(target, { name: "losehp" }, player2, player2);
          });
          next.set(
            "targetprompt2",
            next.targetprompt2.concat([
              (target) => {
                if (!target.isIn() || !get.event().filterTarget(null, get.player(), target)) {
                  return false;
                }
                return target.countCards("h", (card) => card.hasGaintag("olmiluo")) ? "回复体力" : "失去体力";
              }
            ])
          );
          event.result = await next.forResult();
        },
        async content(event, trigger, player) {
          const target = event.targets[0];
          if (target.countCards("h", (card) => card.hasGaintag("olmiluo"))) {
            if (target.isDamaged()) {
              await target.recover();
            }
          } else {
            await target.loseHp();
          }
        }
      }
    },
    ai: {
      order: 5,
      result: {
        player: 1
      }
    }
  },
  oljueyan: {
    audio: 2,
    enable: "chooseToUse",
    hiddenCard(player, name2) {
      const storage = player.getStorage("oljueyan_round");
      return player.hasCard((card) => {
        const type = get.type(card, player);
        const color = get.color(card, player);
        if (type == "trick" || type == "basic" && color == "red") {
          return !storage.includes(type) && get.name(card, player) == name2;
        }
        return false;
      }, "h");
    },
    filter(event, player) {
      const storage = player.getStorage("oljueyan_round");
      return player.hasCard((card) => {
        const type = get.type(card, player);
        const color = get.color(card, player);
        if (type == "trick" || type == "basic" && color == "red") {
          return event.filterCard(
            get.autoViewAs({
              name: get.name(card, player),
              suit: "none",
              nature: get.nature(card, player),
              number: null,
              isCard: true
            }),
            player,
            event
          ) && !storage.includes(type);
        }
        return false;
      }, "h");
    },
    filterCard(card, player, event) {
      event = event || _status.event;
      const storage = player.getStorage("oljueyan_round");
      const type = get.type(card, player);
      if (type == "trick" || type == "basic" && get.color(card, player) == "red") {
        return event._backup.filterCard(
          get.autoViewAs({
            name: get.name(card, player),
            suit: "none",
            nature: get.nature(card, player),
            number: null,
            isCard: true
          }),
          player,
          event
        ) && !storage.includes(type);
      }
      return false;
    },
    ignoreMod: true,
    position: "h",
    viewAs(cards2, player) {
      if (cards2.length) {
        const card = cards2[0];
        return {
          name: get.name(card, player),
          suit: "none",
          nature: get.nature(card, player),
          number: null,
          isCard: true
        };
      }
      return null;
    },
    prompt: "展示并视为使用手牌中一张普通锦囊牌或红色基本牌",
    async precontent(event, trigger, player) {
      const cards2 = event.result.cards;
      const type = get.type(event.result.card);
      player.addTempSkill("oljueyan_round", "roundStart");
      player.markAuto("oljueyan_round", type);
      await player.showCards(cards2, `${get.translation(player)}发动了【绝颜】`);
      delete event.result.cards;
    },
    ai: {
      order: 7,
      result: {
        player: 1
      }
    },
    group: ["oljueyan_draw"],
    subSkill: {
      round: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "已使用过 $"
        }
      },
      draw: {
        audio: "oljueyan",
        trigger: {
          player: "showCardsAfter"
        },
        filter(event, player) {
          const map = lib.skill.oljueyan_draw.getFirstShow(player);
          return event.getShown(player)?.hs?.length && Object.values(map).flat().some((evt) => evt == event);
        },
        getFirstShow(player) {
          const history = game.getAllGlobalHistory(), map = {};
          if (history.length <= 1) {
            return map;
          }
          for (let i = history.length - 1; i >= 0; i--) {
            history[i]["everything"].slice().reverse().forEach((evt) => {
              if (evt.name !== "showCards") {
                return false;
              }
              const cards2 = evt.getShown(player).hs;
              if (cards2.length) {
                cards2.map((card) => get.suit(card)).unique().forEach((suit) => map[suit] = evt);
              }
            });
            if (history[i].isRound) {
              break;
            }
          }
          return map;
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          const map = lib.skill.oljueyan_draw.getFirstShow(player), num = Object.values(map).flat().filter((evt) => evt == trigger).length, skill = "oljueyan", str = Object.keys(map).sort((a, b) => lib.suit.indexOf(a) - lib.suit.indexOf(b)).map((i) => get.translation(i)).join("");
          player.addTip(skill, `${get.translation(skill)} ${str}`, "roundStart");
          await player.draw(num);
        }
      }
    }
  },
  //魔司马懿
  //舍身入魔，佛奈我何！
  olguifu: {
    audio: 2,
    trigger: {
      global: "roundStart",
      player: "changeHpAfter"
    },
    filter(event, player) {
      return event.name != "changeHp" || event.changedHp != 0;
    },
    check: () => true,
    frequent: true,
    prompt2: "随机从牌堆或弃牌堆获得一张不计入手牌上限的【闪】",
    async content(event, trigger, player) {
      const card = get.cardPile("shan", null, "random");
      if (!card) {
        player.chat("桀桀桀，居然没闪了吗");
        return;
      }
      const next = player.gain(card, "gain2");
      next.gaintag.add(event.name);
      await next;
    },
    group: ["olguifu_viewAs", "olguifu_record"],
    locked: false,
    mod: {
      ignoredHandcard(card, player) {
        if (card.hasGaintag("olguifu")) {
          return true;
        }
      },
      cardDiscardable(card, player, name2) {
        if (name2 == "phaseDiscard" && card.hasGaintag("olguifu")) {
          return false;
        }
      },
      cardUsable(card, player) {
        if (card.storage?.olguifu_viewAs) {
          return Infinity;
        }
      }
    },
    subSkill: {
      viewAs: {
        enable: "chooseToUse",
        hiddenCard(player, name2) {
          if (player.storage.olguifu_record?.card?.includes(name2) && !player.getStorage("olguifu_used").includes(name2) && player.hasCard((card) => card.hasGaintag("olguifu"), "h")) {
            return true;
          }
        },
        filter(event, player) {
          const names = (player.storage.olguifu_record?.card || []).slice(0).removeArray(player.getStorage("olguifu_used"));
          return player.hasCard((card) => card.hasGaintag("olguifu"), "h") && names.some((name2) => event.filterCard(get.autoViewAs({ name: name2, storage: { olguifu_viewAs: true } }, "unsure"), player, event));
        },
        chooseButton: {
          dialog(event, player) {
            const list = [];
            for (const name2 of player.storage.olguifu_record.card) {
              list.push([get.type(name2), "", name2]);
            }
            return ui.create.dialog("诡伏", [list, "vcard"], "hidden");
          },
          filter(button, player) {
            if (player.getStorage("olguifu_used").includes(button.link[2])) {
              return false;
            }
            return get.event().getParent().filterCard(get.autoViewAs({ name: button.link[2], nature: button.link[3], storage: { olguifu_viewAs: true } }, "unsure"), player, get.event().getParent());
          },
          check(button) {
            return get.player().getUseValue(get.autoViewAs({ name: button.link[2], nature: button.link[3] }, "unsure"));
          },
          backup(links, player) {
            return {
              audio: "olguifu",
              filterCard(card, player2) {
                return get.itemtype(card) == "card" && card.hasGaintag("olguifu");
              },
              viewAs: {
                name: links[0][2],
                nature: links[0][3],
                storage: {
                  olguifu_viewAs: true
                }
              },
              position: "h",
              check(card) {
                return 8 - get.value(card);
              },
              log: false,
              async precontent(event, trigger, player2) {
                const skill = "olguifu";
                const card = event.result.card;
                player2.logSkill(skill);
                player2.addTempSkill(skill + "_used");
                player2.markAuto(skill + "_used", card.name);
                event.getParent().addCount = false;
              }
            };
          },
          prompt(links, player) {
            const name2 = links[0][2], nature = links[0][3];
            return "将一张「诡伏」牌当作" + (get.translation(nature) || "") + get.translation(name2) + "使用";
          }
        },
        ai: {
          order: 7,
          result: {
            player: 1
          }
        }
      },
      used: {
        charlotte: true,
        onremove: true,
        intro: { content: "已转化过$" }
      },
      record: {
        audio: "olguifu",
        init(player, skill) {
          player.storage[skill] = { card: [], skill: [] };
        },
        trigger: { global: "damageSource" },
        filter(event, player) {
          const storage = player.storage.olguifu_record;
          if (event.card?.name) {
            return !storage.card.includes(event.card.name);
          }
          const skill = game.findSkill(event);
          return skill && !storage.skill.includes(skill);
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          let storage = player.storage[event.name];
          const skill = game.findSkill(trigger);
          if (trigger.card) {
            storage["card"].add(trigger.card.name);
          } else if (skill) {
            storage["skill"].add(skill);
          }
          player.markSkill(event.name);
        },
        intro: {
          markcount(storage, player) {
            if (!storage) {
              return "当前暂无记录";
            }
            return Object.values(storage).flat().length;
          },
          content(storage, player) {
            if (!storage) {
              return "当前暂无记录";
            }
            const cards2 = storage["card"], skills2 = storage["skill"];
            let str = "";
            if (cards2.length) {
              str += `<li>记录的牌：${cards2.map((card) => get.poptip(card)).join("、")}<br>`;
            }
            if (skills2.length) {
              str += `<li>记录的技能：${skills2.map((skill) => get.poptip(skill)).join("、")}`;
            }
            if (!str) {
              return "无记录的牌或技能";
            }
            return str;
          }
        },
        onremove: true
      }
    }
  },
  olmoubian: {
    audio: 4,
    derivation: ["olzhouxi"],
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      const storage = player.storage.olguifu_record;
      if (!storage) {
        return false;
      }
      return Object.values(storage).flat().length >= 3 && !player.hasSkill("olrumo");
    },
    skillAnimation: "epic",
    animationColor: "thunder",
    check: () => true,
    async content(event, trigger, player) {
      player.addSkill("olrumo");
      const skills2 = player.storage.olguifu_record?.skill;
      if (skills2?.length) {
        await player.addSkills(skills2);
      }
      await player.addSkills(["olzhouxi"]);
    },
    ai: {
      combo: "olguifu"
    }
  },
  olzhouxi: {
    audio: 2,
    damageSkills: ["oljuece", "reganglie", "nzry_kuizhu", "zhefu", "tianjie", "xinleiji", "zhendu", "olqiangxi", "duwu", "olsanyao", "oljianhe", "clanlieshi", "xueji", "quhu", "olshuzi"],
    initList() {
      if (!_status.characterlist) {
        game.initCharacterList();
      }
      const skills2 = _status.characterlist.map((i) => get.character(i, 3)).flat().unique();
      game.expandSkills(skills2, true);
      const list = [];
      for (let skill of skills2) {
        let info = get.info(skill);
        info = info.content || info.chooseButton?.backup;
        const str = info?.toString();
        if (str?.includes(".damage(")) {
          skill = get.sourceSkillFor(skill);
          info = get.info(skill);
          if (!skill || !get.skillInfoTranslation(skill).includes("伤害")) {
            continue;
          }
          if (!info || info.silent || info.juexingji || info.hiddenSkill || info.groupSkill || info.zhuSkill) {
            continue;
          }
          if (info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) {
            continue;
          }
          list.add(skill);
        }
      }
      _status.damageSkills = list;
    },
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    locked: false,
    async content(event, trigger, player) {
      if (!_status.damageSkills) {
        lib.skill.olzhouxi.initList();
      }
      const skills2 = _status.damageSkills.filter((skill2) => !player.hasSkill(skill2, null, null, false)).randomGets(3);
      if (!skills2.length) {
        return;
      }
      const result = await player.chooseButton([`###${get.translation(event.name)}###你从三个可造成伤害的技能中选择一个获得直到你的下回合开始。`, [skills2, "skill"]], true).set("ai", () => 1 + Math.random()).forResult();
      if (!result?.links) {
        return;
      }
      const skill = result.links[0];
      await player.addTempSkills(skill, { player: "phaseBegin" });
    },
    group: ["olzhouxi_tiaoxin"],
    subSkill: {
      tiaoxin: {
        audio: "olzhouxi",
        trigger: { global: "roundEnd" },
        filter(event, player) {
          return lib.skill.olzhouxi_tiaoxin.logTarget(event, player).length > 0;
        },
        forced: true,
        logTarget(event, player) {
          return player.getRoundHistory("sourceDamage", (evt) => evt.num > 0)?.map((evt) => evt.player).unique().filter((target) => target.isIn() && target.canUse({ name: "sha", isCard: true }, player, false, false)).sortBySeat();
        },
        async content(event, trigger, player) {
          const targets = lib.skill.olzhouxi_tiaoxin.logTarget(trigger, player);
          if (!targets.length) {
            return;
          }
          const card = get.autoViewAs({ name: "sha", isCard: true });
          for (const target of targets) {
            if (target.canUse(card, player, false, false)) {
              await target.useCard(card, player, false);
            }
          }
        }
      }
    }
  },
  olrumo: {
    charlotte: true,
    trigger: { global: "roundEnd" },
    filter(event, player) {
      return !player.getRoundHistory("sourceDamage", (evt) => evt.num > 0).length;
    },
    forced: true,
    popup: false,
    async content(event, trigger, player) {
      await player.loseHp();
    },
    nopop: true,
    mark: true,
    marktext: "魔",
    intro: { content: "你已入魔" }
  },
  //OL界马岱
  olqianxi: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard(get.prompt2(event.skill), "he").set("ai", (card) => {
        const player2 = get.player();
        let value = 0;
        if (get.tag(card, "damage") && get.type(card) != "delay") {
          value += player2.getUseValue(card);
        }
        value += get.color(card, player2) == "red" ? 7 - get.value(card, player2) : 6 - get.value(card, player2);
        return value;
      }).forResult();
    },
    async content(event, trigger, player) {
      const card = event.cards[0], color = get.color(card, player);
      await player.showCards(card, `${get.translation(player)}发动了〖${get.translation(event.name)}〗`);
      player.addTempSkill(event.name + "_damage");
      player.addGaintag(card, event.name + "_damage");
      const targets = game.filterPlayer((target) => {
        return player != target && get.distance(player, target) == 1;
      }).sortBySeat();
      if (targets.length) {
        player.line(targets, "green");
        targets.forEach((target) => {
          target.addTempSkill(event.name + "_effect");
          target.markAuto(event.name + "_effect", [color]);
        });
      }
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (tag !== "directHit_ai" || !arg.target.hasSkill("olqianxi_effect")) {
          return false;
        }
        if (arg.card.name == "sha") {
          return arg.target.getStorage("olqianxi_effect").includes("red") && (!arg.target.hasSkillTag(
            "freeShan",
            false,
            {
              player,
              card: arg.card,
              type: "use"
            },
            true
          ) || player.hasSkillTag("unequip", false, {
            name: arg.card ? arg.card.name : null,
            target: arg.target,
            card: arg.card
          }) || player.hasSkillTag("unequip_ai", false, {
            name: arg.card ? arg.card.name : null,
            target: arg.target,
            card: arg.card
          }));
        }
        return arg.target.getStorage("olqianxi_effect").includes("black");
      }
    },
    subSkill: {
      damage: {
        audio: "olqianxi",
        charlotte: true,
        forced: true,
        onremove(player, skill) {
          player.removeGaintag(skill);
        },
        trigger: { source: "damageBegin1" },
        filter(event, player) {
          return event.card && player.hasHistory("lose", (evt) => {
            return evt.getParent() == event.getParent("useCard") && Object.values(evt.gaintag_map).flat().includes("olqianxi_damage");
          });
        },
        async content(event, trigger, player) {
          trigger.num++;
        },
        mod: {
          aiOrder(player, card, num) {
            if (get.itemtype(card) == "card" && card.hasGaintag("olqianxi_damage") && get.event().name == "chooseToUse") {
              return num + 0.5;
            }
          }
        }
      },
      effect: {
        charlotte: true,
        onremove: true,
        mod: {
          cardEnabled2(card, player) {
            if (player.getStorage("olqianxi_effect").includes(get.color(card, player)) && get.position(card) == "h") {
              return false;
            }
          }
        },
        intro: {
          markcount: () => 0,
          content(storage) {
            return "不能使用或打出" + get.translation(storage) + "的手牌";
          }
        }
      }
    }
  },
  //OL谋卢植
  olsibing: {
    audio: 2,
    trigger: {
      player: "useCardToPlayer",
      global: "useCardAfter"
    },
    filter(event, player, name2) {
      if (name2 == "useCardToPlayer") {
        return get.is.damageCard(event.card) && event.targets.length == 1 && player.countDiscardableCards(player, "he", (card) => get.color(card, player) == "red") && !player.hasSkill("olsibing_used");
      }
      return get.is.damageCard(event.card) && event.targets?.includes(player) && !player.hasHistory("damage", (evt) => evt.getParent("useCard") == event) && player.countDiscardableCards(player, "he", (card) => get.color(card, player) == "black") && player.hasUseTarget({ name: "sha", isCard: true }, false, false);
    },
    usable: 1,
    async cost(event, trigger, player) {
      const name2 = event.triggername;
      if (name2 == "useCardToPlayer") {
        event.result = await player.chooseToDiscard(`###${get.prompt(event.skill, trigger.target)}###弃置任意张红色牌并令其弃置等量红色手牌，否则不能响应该牌`, [1, Infinity], "he", "chooseonly", (card, player2) => get.color(card, player2) == "red", "allowChooseAll").set("ai", (card) => {
          const player2 = get.player(), target = get.event().getTrigger().target, cardx = get.event().getTrigger().card;
          if (get.effect(target, cardx, player2, player2) < 0 || cardx.name == "huogong") {
            return 0;
          }
          if (ui.selected.cards?.length == target.countCards("h", { color: "red" })) {
            return 0;
          }
          return 7 - get.value(card);
        }).forResult();
        if (event.result.bool) {
          event.result.targets = [trigger.target];
        }
      } else {
        event.result = await player.chooseToDiscard(`###${get.prompt(event.skill)}###弃置一张黑色牌并视为使用一张【杀】`, "he", "chooseonly", (card, player2) => get.color(card, player2) == "black").set("ai", (card) => {
          if (!get.player().hasValueTarget({ name: "sha", isCard: true }, false, false)) {
            return 0;
          }
          return 6 - get.value(card);
        }).forResult();
      }
    },
    async content(event, trigger, player) {
      const cards2 = event.cards, name2 = event.triggername;
      await player.discard(cards2);
      if (name2 == "useCardToPlayer") {
        const target = trigger.target;
        const result = await target.chooseToDiscard(`司兵：请弃置${cards2.length}张红色手牌，或取消令你不可响应${get.translation(trigger.card)}`, cards2.length, (card) => {
          return get.color(card, get.player()) == "red";
        }).set("ai", (card) => {
          const trigger2 = get.event().getTrigger(), player2 = get.player();
          if (get.event().num > 2 || !player2.canRespond(trigger2) || trigger2.card.name == "huogong") {
            return 0;
          }
          if (player2.canRespond(trigger2, card)) {
            return 6 - get.value(card);
          }
          return 7 - get.value(card);
        }).set("num", cards2.length).forResult();
        if (result?.bool === false) {
          trigger.getParent().directHit.add(target);
          target.popup("不可响应");
          game.log(target, "不可响应", trigger.card);
        }
      } else {
        const card = get.autoViewAs({ name: "sha", isCard: true });
        await player.chooseUseTarget(card, true, false, "nodistance");
      }
    },
    subSkill: { used: { charlotte: true } }
  },
  olliance: {
    audio: 2,
    trigger: {
      player: "loseAfter",
      global: ["loseAsyncAfter", "equipAfter", "addToExpansionAfter", "gainAfter", "addJudgeAfter"]
    },
    usable: 1,
    filter(event, player) {
      const bool1 = event.getg && event.getg(player)?.length, bool2 = event.getl && event.getl(player)?.hs?.length;
      return (bool1 || bool2) && player.isMinHandcard() && player.countCards("h") < player.maxHp && !player.getStorage("olliance_used").length;
    },
    check(event, player) {
      return player.countCards("h") < player.maxHp;
    },
    async content(event, trigger, player) {
      player.addTempSkill(event.name + "_used", "roundStart");
      player.markAuto(event.name + "_used", _status.currentPhase == player ? "isMe" : "notMe");
      await player.drawTo(player.maxHp);
      player.addTempSkill(event.name + "_damage");
      player.addMark(event.name + "_damage", 1, false);
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      },
      damage: {
        audio: "olliance",
        charlotte: true,
        forced: true,
        forceDie: true,
        onremove: true,
        trigger: { global: "damageBegin1" },
        async content(event, trigger, player) {
          trigger.num += player.countMark(event.name);
          player.removeSkill(event.name);
        },
        mark: true,
        intro: {
          content: "本回合下一次有角色造成的伤害+#"
        }
      }
    }
  },
  //OL界关兴张苞
  olfuhun: {
    inherit: "fuhun",
    position: "hes",
    global: ["olfuhun_block"],
    group: ["olfuhun_effect"],
    prompt: "将两张牌当杀使用或打出",
    viewAsFilter(player) {
      return player.countCards("hes") > 1;
    },
    subSkill: {
      effect: {
        audio: "olfuhun",
        trigger: {
          source: "damageSource"
        },
        forced: true,
        filter(event, player) {
          if (["new_rewusheng", "olpaoxiao"].every((skill) => player.hasSkill(skill, null, false, false))) {
            return false;
          }
          return player.isPhaseUsing() && event.card?.name == "sha";
        },
        async content(event, trigger, player) {
          player.addTempSkills(["new_rewusheng", "olpaoxiao"]);
        }
      },
      //根据思召剑和谋韩当的弓骑修改
      block: {
        mod: {
          cardEnabled(card, player) {
            let evt = get.event();
            if (evt.name != "chooseToUse") {
              evt = evt.getParent("chooseToUse");
            }
            if (!evt?.respondTo || !evt.respondTo[0].hasSkill("olfuhun") || !get.is.convertedCard(evt.respondTo[1])) {
              return;
            }
            const color1 = get.color(card), color2 = get.color(evt.respondTo[1]), hs = player.getCards("h"), cards2 = [card];
            if (color1 === "unsure") {
              return;
            }
            if (Array.isArray(card.cards)) {
              cards2.addArray(card.cards);
            } else {
              return false;
            }
            if (color1 != color2 || !cards2.containsSome(...hs)) {
              return false;
            }
          }
        },
        charlotte: true
      }
    }
  },
  //闪刘宏
  olchaozheng: {
    audio: "jsrgchaozheng",
    logAudio: (index) => typeof index === "number" ? "jsrgchaozheng" + index + ".mp3" : ["jsrgchaozheng1.mp3", "jsrgchaozheng2.mp3"],
    inherit: "jsrgchaozheng",
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      if (!player.hasCards("h")) {
        return false;
      }
      return game.hasPlayer((current) => current !== player && current.hasCards("h"));
    },
    logTarget(event, player) {
      return game.filterPlayer((current) => current !== player && current.hasCards("h"));
    },
    prompt2() {
      return lib.translate["olchaozheng_info"].split("②")[0].slice(1);
    },
    async content(event, trigger, player) {
      await player.chooseToDebate({
        list: game.filterPlayer((current) => current.hasCards("h")),
        args: []
      }).set("callback", async (event2, trigger2, player2) => {
        const { debateResult: result } = event2;
        const { bool, opinion, targets, opinions } = result;
        if (bool && opinion) {
          if (opinion && ["red", "black"].includes(opinion)) {
            player2.logSkill("olchaozheng", targets, null, null, [opinion == "red" ? 3 : 4]);
            for (const target of result.red.map((i) => i[0]).unique().sortBySeat()) {
              if (target === player2 && opinion !== "red") {
                continue;
              }
              await target[opinion == "red" ? "recover" : "loseHp"]();
            }
          }
        }
        const ops = opinions.filter((i) => result[i].flat().includes(player2));
        if (ops) {
          await player2.draw(
            Math.min(
              2,
              ops.reduce((sum, op) => sum + result[op].map((i) => i[0]).unique().length, 0)
            )
          );
        }
      });
    },
    group: "olchaozheng_debate",
    subSkill: {
      debate: {
        audio: "olchaozheng",
        trigger: { global: "debateShowOpinion" },
        filter(event, player) {
          return event.targets.includes(player) && event.opinions.some((i) => event[i].flat().includes(player));
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          const ops = trigger.opinions.filter((i) => trigger[i].flat().includes(player));
          for (const op of ops) {
            for (const list of trigger[op]) {
              if (list[0] === player) {
                const color = typeof list[1] == "string" ? list[1] : get.color(list[1], list[0]);
                trigger[op].push([player, color]);
                game.log(player, "的", "#g" + get.translation(color) + "意见+1");
                break;
              }
            }
          }
        }
      }
    }
  },
  olshenchong: {
    limited: true,
    audio: "jsrgshenchong",
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.hasPlayer((target) => {
        return target !== player && lib.skill.olshenchong.derivation.some((i) => !target.hasSkill(i, null, false, false));
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return target !== player2 && lib.skill.olshenchong.derivation.some((i) => !target.hasSkill(i, null, false, false));
      }).set("ai", (target) => {
        if (player.hasUnknown()) {
          return 0;
        }
        return get.effect(target, "jsrgshenchong", player, player);
      }).forResult();
    },
    skillAnimation: true,
    animationColor: "soil",
    async content(event, trigger, player) {
      const {
        targets: [target],
        name: skillName
      } = event;
      player.awakenSkill(skillName);
      await target.addSkills(get.info(skillName).derivation);
      player.addSkill(skillName + "_die");
      player.markAuto(skillName + "_die", [target]);
    },
    derivation: ["olrefeiyang", "jsrgbahu"],
    subSkill: {
      die: {
        charlotte: true,
        audio: "jsrgshenchong",
        trigger: { player: "die" },
        filter(event, player) {
          return event.source?.isIn() && event.source.countCards("h") || player.getStorage("olshenchong_die").some((current) => current.isIn());
        },
        forced: true,
        forceDie: true,
        async content(event, trigger, player) {
          const source = trigger.source;
          if (source?.isIn() && source.countCards("h")) {
            player.line(source);
            await source.chooseToDiscard(source.countCards("h"), "h", true);
            await game.delayx();
          }
          const targets = player.getStorage("olshenchong_die").filter((current) => current.isIn()).sortBySeat();
          if (targets.length > 0) {
            player.line(targets);
            for (const current of targets) {
              await current.removeSkills(current.getSkills(null, false, false));
            }
            await game.delayx();
          }
        }
      }
    }
  },
  olrefeiyang: {
    trigger: { player: "phaseJudgeBegin" },
    filter(event, player) {
      return player.countCards("j") && player.countCards("he", (card) => {
        if (get.position(card) === "h" && _status.connectMode) {
          return false;
        }
        return lib.filter.cardDiscardable(card, player);
      }) > 1;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard("he", 2, get.prompt(event.skill), "弃置两张牌，然后弃置判定区里的所有牌").set("logSkill", event.skill).set("ai", (card) => {
        return _status.event.goon ? 9 - get.value(card) : 0;
      }).set(
        "goon",
        (() => {
          if (player.hasSkillTag("rejudge") && player.countCards("j") < 2) {
            return false;
          }
          if (player.hasSkill("dckanyu", null, false, false) && !player.hasCards("j", (card) => card.name == "lebu")) {
            return false;
          }
          return player.hasCard(function(card) {
            if (get.tag(card, "damage") && get.damageEffect(player, player, _status.event.player, get.natureList(card)) >= 0) {
              return false;
            }
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
        })()
      ).forResult();
      event.result.skill_popup = false;
    },
    async content(event, trigger, player) {
      await player.discardPlayerCard(player, "j", true, player.countCards("j"));
    }
  },
  oljulian: {
    audio: "jsrgjulian",
    inherit: "jsrgjulian",
    filter(event, player) {
      const { player: source } = event;
      const skill = "oljulian";
      if (source == player || source.group != "qun" || source.countMark(`${skill}_count`) >= lib.skill[skill].maxNum) {
        return false;
      }
      const evt = event.getParent("phaseDraw");
      return (!evt || evt.player != source) && event.getParent().name == "draw" && event.getParent(2).name != skill && player.hasZhuSkill(skill, event.player);
    },
    maxNum: 1,
    group: "oljulian_gain",
    subSkill: {
      gain: {
        audio: ["jsrgjulian3.mp3", "jsrgjulian4.mp3"],
        trigger: { player: "phaseJieshuBegin" },
        filter(event, player) {
          return lib.skill["oljulian_gain"].logTarget(null, player).length;
        },
        prompt: "是否发动【聚敛】？",
        prompt2: "获得其他所有群势力角色的各一张手牌",
        logTarget(event, player) {
          return game.filterPlayer((current) => {
            return current.group == "qun" && current.hasGainableCards(player, "h") && current != player;
          }).sortBySeat();
        },
        async content(event, trigger, player) {
          for (const target of event.targets) {
            await player.gainPlayerCard({ target, position: "h", forced: true });
          }
        }
      },
      count: {
        charlotte: true,
        onremove: true
      }
    }
  },
  //闪赵云
  ollonglin: {
    audio: "jsrglonglin",
    inherit: "jsrglonglin",
    async content(event, trigger, player) {
      const juedou = new lib.element.VCard({ name: "juedou", storage: { ollonglin: true }, isCard: true });
      const result = await player.chooseToDiscard(get.prompt2("ollonglin"), "he").set("ai", (card) => {
        if (get.event().goon) {
          return 5 - get.value(card);
        }
        return 0;
      }).set(
        "goon",
        (trigger.player.canUse(juedou, player) ? Math.max(0, get.effect(player, juedou, trigger.player, trigger.player)) : 0) + trigger.targets.map((target) => {
          return get.effect(target, trigger.card, trigger.player, player);
        }).reduce((p, c) => {
          return p + c;
        }, 0) < -4
      ).set("logSkill", ["ollonglin", trigger.player]).forResult();
      if (result.bool) {
        trigger.excluded.addArray(trigger.targets);
        await game.delayx();
        if (trigger.player.canUse(juedou, player)) {
          const result2 = await trigger.player.chooseBool(`是否视为对${get.translation(player)}使用一张【决斗】？`).set("choice", get.effect(player, juedou, trigger.player, trigger.player) >= 0).forResult();
          if (result2.bool) {
            player.addTempSkill("ollonglin_source");
            trigger.player.useCard(juedou, player);
          }
        }
      }
    },
    subSkill: {
      source: {
        charlotte: true,
        trigger: { source: "damageSource" },
        filter(event, player) {
          return event.card?.storage?.ollonglin;
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          player.line(trigger.player);
          trigger.player.addTempSkill("ollonglin_forbid", {
            player: "useCard1",
            global: "phaseUseAfter"
          });
        }
      },
      forbid: {
        charlotte: true,
        mark: true,
        intro: { content: "不能指定其他角色为目标" },
        mod: {
          playerEnabled(card, player, target) {
            if (target !== player) {
              return false;
            }
          }
        }
      }
    }
  },
  olzhendan: {
    audio: "jsrgzhendan",
    enable: ["chooseToUse", "chooseToRespond"],
    onChooseToUse(event) {
      if (!game.online && !event.onzhendan) {
        event.set("olzhendan", get.info("olzhendan").getUsed(event.player));
      }
    },
    onChooseToRespond(event) {
      if (!game.online && !event.onzhendan) {
        event.set("olzhendan", get.info("olzhendan").getUsed(event.player));
      }
    },
    filter(event, player) {
      if (event.type === "wuxie") {
        return false;
      }
      if (!player.hasCard((card) => {
        return _status.connectMode || get.type(card) !== "basic";
      }, "hs")) {
        return false;
      }
      return get.inpileVCardList((info) => {
        if (info[0] !== "basic" || event.olzhendan?.includes(info[2])) {
          return false;
        }
        return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
      }).length;
    },
    chooseButton: {
      dialog(event, player) {
        const vcards = get.inpileVCardList((info) => {
          if (info[0] !== "basic" || event.olzhendan?.includes(info[2])) {
            return false;
          }
          return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
        });
        return ui.create.dialog("镇胆", [vcards, "vcard"]);
      },
      check(button) {
        if (get.event().getParent().type !== "phase") {
          return 1;
        }
        return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
      },
      backup(links, player) {
        return {
          audio: "jsrgzhendan",
          popname: true,
          viewAs: { name: links[0][2], nature: links[0][3] },
          filterCard(card, player2) {
            return get.type2(card) !== "basic";
          },
          position: "hs"
        };
      },
      prompt(links, player) {
        return "将一张非基本手牌当作" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用或打出";
      }
    },
    hiddenCard(player, name2) {
      if (!lib.inpile.includes(name2) || get.type(name2) !== "basic" || player.isTempBanned("olzhendan")) {
        return false;
      }
      return !get.info("olzhendan").getUsed(player).includes(name2) && player.hasCard((card) => {
        return _status.connectMode || get.type(card) !== "basic";
      }, "hs");
    },
    ai: {
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        return get.info("olzhendan").hiddenCard(player, name.slice("respond".length).toLowerCase());
      },
      order: 0.5,
      result: {
        player(player) {
          if (get.event().dying) {
            return get.attitude(player, get.event().dying);
          }
          return 1;
        }
      }
    },
    getUsed: (player) => player.getRoundHistory("useCard", (evt) => get.type(evt.card) === "basic").map((evt) => evt.card.name).unique(),
    group: "olzhendan_damage",
    subSkill: {
      backup: {},
      damage: {
        audio: "jsrgzhendan",
        trigger: {
          player: "damageEnd",
          global: "roundEnd"
        },
        filter(event, player) {
          if (event.name === "damage" && !player.isTempBanned("olzhendan")) {
            return true;
          }
          const history = _status.globalHistory;
          if (event.name !== "damage" || !history[history.length - 1].isRound) {
            for (let i = history.length - (event.name === "damage" ? 2 : 1); i >= 0; i--) {
              if (game.hasPlayer2((current) => {
                const actionHistory = current.actionHistory[i];
                return actionHistory.isMe && !actionHistory.isSkipped;
              })) {
                return true;
              }
              if (history[i].isRound) {
                break;
              }
            }
          }
          return false;
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          const history = _status.globalHistory;
          let num = 0;
          if (trigger.name !== "damage" || !history[history.length - 1].isRound) {
            for (let i = history.length - (trigger.name === "damage" ? 2 : 1); i >= 0; i--) {
              game.hasPlayer2((current) => {
                const actionHistory = current.actionHistory[i];
                return actionHistory.isMe && !actionHistory.isSkipped;
              }) && num++;
              if (num === 5 || history[i].isRound) {
                break;
              }
            }
          }
          num > 0 && await player.draw(num);
          trigger.name === "damage" && player.tempBanSkill("olzhendan", "roundStart");
        }
      }
    }
  },
  //OL谋贾诩
  olsbwance: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      if (!game.hasPlayer((target) => target.countCards("h"))) {
        return false;
      }
      return lib.inpile.some((name2) => {
        if (name2 == "jiedao") {
          return false;
        }
        const info = get.info({ name: name2 });
        return info && info.type === "trick" && !info.notarget && (info.toself || info.singleCard || !info.selectTarget || info.selectTarget === 1);
      });
    },
    filterTarget(card, player, target) {
      return target.countCards("h");
    },
    usable: 1,
    async content(event, trigger, player) {
      const names = lib.inpile.filter((name3) => {
        if (name3 == "jiedao") {
          return false;
        }
        const info = get.info({ name: name3 });
        return info && info.type === "trick" && !info.notarget && (info.toself || info.singleCard || !info.selectTarget || info.selectTarget === 1);
      }), target = event.target;
      const name2 = names.length > 1 ? ((await player.chooseButton([get.translation(event.name) + "：请选择一个单目标普通锦囊牌牌名", [names, "vcard"]], true).set("ai", (button) => {
        const player2 = get.player();
        const target2 = get.event().getParent().target;
        const effectCard = (cardx) => {
          const card = get.autoViewAs({ name: button.link[2] }, [cardx]);
          let targets = game.filterPlayer((current) => target2.canUse(card, current));
          if (!targets.length) {
            return 0;
          }
          targets.sort((a, b) => get.effect(b, card, target2, target2) - get.effect(a, card, target2, target2));
          let sum = get.effect(target2, { name: "guohe_copy", position: "h" }, player2, player2);
          const effect = get.effect(targets[0], card, target2, player2);
          if (effect < 0) {
            let targets2 = game.filterPlayer((current) => lib.filter.targetEnabled2(card, target2, current) && lib.filter.targetInRange(card, target2, current));
            if (targets2.length) {
              targets2.sort((a, b) => get.effect(b, card, target2, player2) - get.effect(a, card, target2, player2));
              const effect2 = get.effect(targets2[0], card, target2, player2);
              if (effect2 > 0) {
                sum += get.effect(player2, { name: "guohe_copy2" }, player2, player2);
                sum += effect2;
              }
            } else {
              sum += effect;
            }
          } else {
            sum += effect;
          }
          return sum;
        };
        let cards2 = target2.getCards("h");
        return cards2.sort((a, b) => effectCard(b) - effectCard(a)).slice(0, Math.min(3, game.roundNumber)).reduce((num, card) => num + effectCard(card), 0);
      }).forResult()).links ?? [])[0][2] : names[0];
      if (name2) {
        player.popup(name2);
        game.log(player, "声明了", "#y" + get.translation(name2));
        let sum = Math.min(3, game.roundNumber);
        player.addTempSkill("olsbwance_effect");
        while (sum > 0 && target.hasCard((card) => target.hasUseTarget(get.autoViewAs({ name: name2 }, [card])), "h")) {
          sum--;
          game.broadcastAll((viewAs) => lib.skill.olsbwance_backup.viewAs = viewAs, { name: name2 });
          const next = target.chooseToUse();
          next.set("openskilldialog", get.translation(event.name) + "：将一张手牌当作【" + get.translation(name2) + "】使用");
          next.set("forced", true);
          next.set("norestore", true);
          next.set("addCount", false);
          next.set("_backupevent", "olsbwance_backup");
          next.set("custom", {
            add: {},
            replace: { window() {
            } }
          });
          next.backup("olsbwance_backup");
          await next;
        }
      }
    },
    ai: {
      order: 10,
      result: {
        player(player, target) {
          const names = lib.inpile.filter((name2) => {
            const info = get.info({ name: name2 });
            return info && info.type === "trick" && !info.notarget && (info.toself || info.singleCard || !info.selectTarget || info.selectTarget === 1);
          });
          return Math.max(
            ...names.map((name2) => {
              const effectCard = (cardx) => {
                const card = get.autoViewAs({ name: name2 }, [cardx]);
                let targets = game.filterPlayer((current) => target.canUse(card, current));
                if (!targets.length) {
                  return 0;
                }
                targets.sort((a, b) => get.effect(b, card, target, target) - get.effect(a, card, target, target));
                let sum = get.effect(target, { name: "guohe_copy", position: "h" }, player, player);
                const effect = get.effect(targets[0], card, target, player);
                if (effect < 0) {
                  let targets2 = game.filterPlayer((current) => lib.filter.targetEnabled2(card, target, current) && lib.filter.targetInRange(card, target, current));
                  if (targets2.length) {
                    targets2.sort((a, b) => get.effect(b, card, target, player) - get.effect(a, card, target, player));
                    const effect2 = get.effect(targets2[0], card, target, player);
                    if (effect2 > 0) {
                      sum += get.effect(player, { name: "guohe_copy2" }, player, player);
                      sum += effect2;
                    }
                  } else {
                    sum += effect;
                  }
                } else {
                  sum += effect;
                }
                return sum;
              };
              let cards2 = target.getCards("h");
              return cards2.sort((a, b) => effectCard(b) - effectCard(a)).slice(0, Math.min(3, game.roundNumber)).reduce((num, card) => num + effectCard(card), 0);
            })
          );
        }
      }
    },
    subSkill: {
      backup: {
        filterCard(card, player) {
          return get.itemtype(card) === "card";
        },
        position: "h",
        filterTarget: lib.filter.filterTarget,
        check: (card) => 8 - get.value(card),
        log: false
      },
      effect: {
        charlotte: true,
        audio: "olsbwance",
        trigger: { global: "useCardToPlayer" },
        filter(event, player) {
          if (!player.hasCard((card) => {
            if (get.position(card) === "h" && _status.connectMode) {
              return true;
            }
            return lib.filter.cardDiscardable(card, player);
          }, "he")) {
            return false;
          }
          return event.isFirstTarget && event.getParent(3).name === "olsbwance" && event.getParent(3).player === player;
        },
        async cost(event, trigger, player) {
          event.result = await player.chooseCardTarget({
            prompt: get.prompt(event.skill),
            prompt2: '<div class="text center">弃置一张牌并重新为' + get.translation(trigger.card) + "指定目标（原目标为" + get.translation(trigger.targets) + "）</div>",
            filterCard: lib.filter.cardDiscardable,
            position: "he",
            filterTarget(card, player2, target) {
              const evt = get.event().getTrigger();
              if (evt.targets.length === 1 && evt.targets[0] === target) {
                return false;
              }
              return lib.filter.targetEnabled2(evt.card, evt.player, target) && lib.filter.targetInRange(evt.card, evt.player, target);
            },
            selectTarget: trigger.targets.length,
            filterOk() {
              const evt = get.event().getTrigger();
              return ui.selected.targets.some((target) => !evt.targets.includes(target));
            },
            ai1(card) {
              return 7.5 - get.value(card);
            },
            ai2(target) {
              const player2 = get.player(), evt = get.event().getTrigger();
              if (evt.targets.every((aim) => get.effect(aim, evt.card, evt.player, player2) > 0)) {
                return 0;
              }
              return get.effect(target, evt.card, evt.player, player2);
            }
          }).forResult();
        },
        async content(event, trigger, player) {
          await player.discard(event.cards);
          const targets = event.targets.sortBySeat();
          trigger.targets = targets;
          trigger.getParent().targets = targets;
          trigger.getParent().triggeredTargets1 = targets;
          game.log(targets, "成为了", trigger.card, "的新目标");
        }
      }
    }
  },
  olsbchenzhi: {
    audio: 2,
    //加个标记
    init(player, skill) {
      player.addSkill(skill + "_mark");
    },
    onremove(player, skill) {
      player.removeSkill(skill + "_mark");
      player.removeSkill(skill + "_mark2");
    },
    trigger: { player: "damageBegin4" },
    filter(event, player) {
      return player.getRoundHistory("damage").length >= Math.min(3, game.roundNumber) && player.hasDiscardableCards(player, "he");
    },
    forced: true,
    locked: false,
    async content(event, trigger, player) {
      await player.chooseToDiscard({ position: "he", forced: true });
      trigger.cancel();
    },
    ai: {
      nothunder: true,
      nofire: true,
      nodamage: true,
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage")) {
            if (target.getRoundHistory("damage").length >= Math.min(3, game.roundNumber)) {
              return "zeroplayertarget";
            }
          }
        }
      }
    },
    group: "olsbchenzhi_effect",
    subSkill: {
      mark: {
        charlotte: true,
        silent: true,
        popup: false,
        trigger: { player: "damageEnd" },
        filter(event, player) {
          return player.getRoundHistory("damage").length >= Math.min(3, game.roundNumber) && !player.hasSkill("olsbchenzhi_mark2");
        },
        async content(event, trigger, player) {
          player.addTempSkill(event.name + "2", "roundStart");
        }
      },
      mark2: { charlotte: true, mark: true, intro: { content: "沉智①已激活" } },
      effect: {
        audio: "olsbchenzhi",
        trigger: { global: "roundEnd" },
        filter(event, player) {
          if (player.getRoundHistory("useSkill", (evt) => evt.skill === "olsbchenzhi").length > 0) {
            return false;
          }
          return game.hasPlayer((target) => {
            return target.getSkills(null, false, false).some((skill) => {
              const info = get.info(skill);
              if (!info || info.charlotte) {
                return false;
              }
              return info.limited && target.awakenedSkills.includes(skill);
            });
          });
        },
        firstDo: true,
        skillAnimation: true,
        animationColor: "thunder",
        async cost(event, trigger, player) {
          const func = (event2, player2) => {
            game.countPlayer((target) => {
              const skills2 = target.getSkills(null, false, false).filter((skill) => {
                const info = get.info(skill);
                if (!info || info.charlotte) {
                  return false;
                }
                return info.limited && target.awakenedSkills.includes(skill);
              });
              if (skills2.length) {
                target.prompt(skills2.map((skill) => get.translation(skill)).join("<br>"));
              }
            });
          };
          if (event.player == game.me) {
            func();
          } else if (event.isOnline()) {
            player.send(func, event, player);
          }
          event.result = await player.chooseTarget(
            (card, player2, target) => {
              return target.getSkills(null, false, false).some((skill) => {
                const info = get.info(skill);
                if (!info || info.charlotte) {
                  return false;
                }
                return info.limited && target.awakenedSkills.includes(skill);
              });
            },
            get.prompt(event.skill),
            "复原一名角色的一个限定技"
          ).set("ai", (target) => {
            const player2 = get.player();
            if (player2.hasUnknown()) {
              return 0;
            }
            return Math.sign(get.attitude(player2, target)) * Math.max(
              target.getSkills(null, false, false).filter((skill) => {
                const info = get.info(skill);
                if (!info || info.charlotte) {
                  return false;
                }
                return info.limited && target.awakenedSkills.includes(skill);
              }).map((skill) => {
                _status.event.skillRankPlayer = target;
                const num = get.skillRank(skill);
                delete _status.event.skillRankPlayer;
                return num;
              })
            );
          }).forResult();
        },
        async content(event, trigger, player) {
          player.tempBanSkill(event.name, "forever", false);
          const target = event.targets[0];
          const skills2 = target.getSkills(null, false, false).filter((skill2) => {
            const info = get.info(skill2);
            if (!info || info.charlotte) {
              return false;
            }
            return info.limited && target.awakenedSkills.includes(skill2);
          });
          const skill = skills2.length > 1 ? (await player.chooseControl(skills2).set(
            "choiceList",
            skills2.map((i) => {
              return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, target, false) + "</div>";
            })
          ).set("displayIndex", false).set("ai", () => {
            let { player: player2, target: target2, controls } = get.event();
            return controls.sort((a, b) => {
              _status.event.skillRankPlayer = target2;
              const limit = get.skillRank(b) - get.skillRank(a);
              delete _status.event.skillRankPlayer;
              return limit * Math.sign(get.attitude(player2, target2));
            })[0];
          }).set("prompt", get.translation(event.name) + "：请选择你要获得的技能").set("target", target).forResult()).control : skills2[0];
          if (skill) {
            player.line(target);
            game.log(player, "选择了技能", "#g【" + get.translation(skill) + "】");
            target.popup(skill);
            target.restoreSkill(skill);
          }
        }
      }
    }
  },
  olsbluanchao: {
    limited: true,
    audio: 2,
    trigger: { global: "roundStart" },
    check(event, player) {
      if (player.hasUnknown()) {
        return false;
      }
      return game.countPlayer((target) => Math.sign(get.attitude(player, target))) > 0;
    },
    skillAnimation: true,
    animationColor: "thunder",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const targets = game.filterPlayer().sortBySeat();
      player.line(targets);
      for (const target of targets) {
        const { control: choice } = await target.chooseControl("sha", "shan").set("ai", () => {
          const { player: player2, controls } = get.event();
          const choices = controls.filter((choice2) => get.cardPile2({ name: choice2 }));
          if (choices.length === 1) {
            return choices[0];
          }
          return player2.hasValueTarget("sha") ? "sha" : "shan";
        }).set("prompt", "选择从牌堆中获得一张【杀】或【闪】。若选择获得【杀】，则本轮首次造成的伤害+1").forResult();
        const card = get.cardPile2({ name: choice });
        if (card) {
          await target.gain(card, "gain2");
        }
        if (choice === "sha") {
          target.addTempSkill("olsbluanchao_effect", "roundStart");
          target.addMark("olsbluanchao_effect", 1, false);
        }
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        intro: { content: "本轮首次造成的伤害+#" },
        trigger: { source: "damageBegin1" },
        forced: true,
        logTarget: "player",
        async content(event, trigger, player) {
          const num = player.countMark(event.name);
          player.removeSkill(event.name);
          trigger.num += num;
        }
      }
    }
  },
  //OL谋文丑
  olsblunzhan: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      const nums = Array.from({ length: 5 }).map((_, i) => i + 1).removeArray(player.getStorage("olsblunzhan_used"));
      return nums.length > 0 && player.countCards("hes") >= Math.min(...nums);
    },
    onChooseToUse(event) {
      if (!game.online && !event.olsblunzhan) {
        const player = get.player();
        event.set("olsblunzhan", player.getHistory("useCard"));
      }
      event.targetprompt2.add((target) => {
        if (!target.isIn() || get.event().skill != "olsblunzhan" || !get.event().filterTarget(get.card(), get.player(), target)) {
          return false;
        }
        get.player();
        const history = get.event().olsblunzhan;
        const num = history?.filter((evt) => evt.targets?.includes(target)).length;
        return `轮战${num}`;
      });
    },
    filterCard: true,
    selectCard: () => [1, 5],
    position: "hes",
    filterOk: () => !get.player().getStorage("olsblunzhan_used").includes(ui.selected.cards.length),
    viewAs: { name: "juedou", storage: { olsblunzhan: true } },
    allowChooseAll: true,
    async precontent(event, trigger, player) {
      player.addTempSkill("olsblunzhan_used");
      player.markAuto("olsblunzhan_used", event.result.cards.length);
      player.addTempSkill("olsblunzhan_effect");
    },
    ai: {
      order(item, player) {
        return get.order({ name: "juedou" }, player) - 0.1;
      }
    },
    locked: false,
    mod: {
      playerEnabled(card, player, target) {
        if (card.storage?.olsblunzhan && player.getStorage("olsblunzhan_ban").includes(target)) {
          return false;
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      },
      ban: {
        charlotte: true,
        onremove: true
      },
      effect: {
        charlottte: true,
        audio: "olsblunzhan",
        trigger: { source: "damageSource" },
        filter(event, player) {
          const evt = event.getParent(2);
          if (!evt || evt.name !== "useCard" || evt.player !== player || !evt.card?.storage?.olsblunzhan) {
            return false;
          }
          return evt.targets?.length === 1 && evt.targets[0] === event.player;
        },
        prompt2(event, player) {
          const num = player.getHistory("useCard", (evt) => evt.targets?.includes(event.player)).length;
          return "摸" + get.cnNumber(num) + "张牌，本回合不能再对其发动〖轮战〗";
        },
        logTarget: "player",
        async content(event, trigger, player) {
          await player.draw(player.getHistory("useCard", (evt) => evt.targets?.includes(trigger.player)).length);
          player.addTempSkill("olsblunzhan_ban");
          player.markAuto("olsblunzhan_ban", [trigger.player]);
        }
      }
    }
  },
  olsbjuejue: {
    audio: 2,
    trigger: { player: "useCardToPlayer" },
    filter(event, player) {
      if (_status.currentPhase !== player) {
        return false;
      }
      if (!event.isFirstTarget || event.targets.length !== 1 || event.target === player) {
        return false;
      }
      return player.getHistory("useCard", (evt) => {
        if (!evt.olsbjuejue) {
          return false;
        }
        return (evt.targets ?? []).length === 1 && evt.targets[0] !== player;
      }).indexOf(event.getParent()) === 0;
    },
    forced: true,
    logTarget: "target",
    async content(event, trigger, player) {
      const { target } = trigger;
      target.chooseToDiscard("he", true, player.getHistory("useCard", (evt) => evt.targets?.includes(target)).length);
    },
    init(player, skill) {
      player.addSkill(skill + "_mark");
    },
    onremove(player, skill) {
      player.removeSkill(skill + "_mark");
    },
    subSkill: {
      mark: {
        charlotte: true,
        trigger: {
          player: "loseEnd",
          global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"]
        },
        filter(event, player) {
          if (_status.currentPhase !== player) {
            return false;
          }
          if (player.countCards("h") || event.getParent().name !== "useCard") {
            return false;
          }
          const evt = event.getl(player);
          return evt?.player == player && evt.hs?.length > 0 && evt.hs.length === evt.cards.length;
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          trigger.getParent().set("olsbjuejue", true);
        }
      }
    }
  },
  //OL谋张让
  olsblucun: {
    audio: 6,
    enable: "chooseToUse",
    filter(event, player) {
      const types = ["basic", "trick"].removeArray(player.getStorage("olsblucun_round"));
      return get.inpileVCardList((info) => {
        const name2 = info[2];
        if (!types.includes(get.type(name2))) {
          return false;
        }
        const infox = get.info({ name: name2 });
        if (!infox || infox.notarget || !infox.filterTarget) {
          return false;
        }
        return !player.getStorage("olsblucun_used").some((item) => item.name === info[2] && item.nature === info[3]);
      }).some((info) => event.filterCard(get.autoViewAs({ name: info[2], nature: info[3], isCard: true }, "unsure"), player, event));
    },
    chooseButton: {
      dialog(event, player) {
        const types = ["basic", "trick"].removeArray(player.getStorage("olsblucun_round"));
        const vcards = get.inpileVCardList((info) => {
          const name2 = info[2];
          if (!types.includes(get.type(name2))) {
            return false;
          }
          const infox = get.info({ name: name2 });
          if (!infox || infox.notarget || !infox.filterTarget) {
            return false;
          }
          if (player.getStorage("olsblucun_used").some((item) => item.name === info[2] && item.nature === info[3])) {
            return false;
          }
          return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3], isCard: true }, "unsure"), player, event);
        });
        return ui.create.dialog("赂存", [vcards, "vcard"]);
      },
      check(button) {
        const event = get.event().getParent();
        if (event.type !== "phase") {
          return 1;
        }
        return get.player().getUseValue(new lib.element.VCard({ name: button.link[2], nature: button.link[3], isCard: true }));
      },
      prompt(links) {
        return '###赂存###<div class="text center">视为使用' + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】</div>";
      },
      backup(links) {
        return {
          audio: "olsblucun",
          filterCard: () => false,
          selectCard: -1,
          popname: true,
          log: false,
          viewAs: { name: links[0][2], nature: links[0][3], isCard: true },
          async precontent(event, trigger, player) {
            player.logSkill("olsblucun");
            const name2 = "ol_sb_zhangrang";
            const key = ["name", "name2"].find((i) => player[i] == name2);
            if (key) {
              player.changeSkin({ characterName: name2 }, `${name2}${player.skin[key] == name2 ? "_shadow" : ""}`);
            }
            player.addTempSkill("olsblucun_round", "roundStart");
            player.markAuto("olsblucun_round", [get.type(event.result.card.name)]);
            player.addSkill("olsblucun_used");
            player.markAuto("olsblucun_used", [event.result.card]);
            player.addTempSkill("olsblucun_effect");
          }
        };
      }
    },
    hiddenCard(player, name2) {
      const type = get.type(name2);
      if (player.getStorage("olsblucun_round").includes(type) || !["basic", "trick"].includes(type)) {
        return false;
      }
      const info = get.info({ name: name2 });
      if (!info || info.notarget || !info.filterTarget) {
        return false;
      }
      if (get.inpileVCardList().some((info2) => info2[2] === name2 && player.getStorage("olsblucun_used").some((item) => item.name === info2[2] && item.nature === info2[3]))) {
        return false;
      }
      return true;
    },
    marktext: "赂",
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
    ai: {
      fireAttack: true,
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        if (arg === "respond") {
          return false;
        }
        return (() => {
          switch (tag) {
            case "fireAttack":
              return ["sha", "huogong"];
            default:
              return [tag.slice("respond".length).toLowerCase()];
          }
        })().some((name2) => get.info("olsblucun").hiddenCard(player, name2));
      },
      order(item, player) {
        if (player && _status.event.type === "phase") {
          let max = 0, names = get.inpileVCardList((info) => {
            const name2 = info[2];
            if (!["basic", "trick"].includes(get.type(name2))) {
              return false;
            }
            const infox = get.info({ name: name2 });
            if (!infox || infox.notarget || !infox.filterTarget) {
              return false;
            }
            return !player.getStorage("olsblucun_used").some((item2) => item2.name === info[2] && item2.nature === info[3]);
          });
          names = names.map((namex) => new lib.element.VCard({ name: namex[2], nature: namex[3] }));
          names.forEach((card) => {
            if (player.getUseValue(card) > 0) {
              let temp = get.order(card);
              if (temp > max) {
                max = temp;
              }
            }
          });
          return max + (max > 0 ? 0.2 : 0);
        }
        return 10;
      },
      result: {
        player(player) {
          if (_status.event.dying) {
            return get.attitude(player, _status.event.dying);
          }
          return 1;
        }
      }
    },
    group: ["olsblucun_draw"],
    subSkill: {
      round: {
        charlotte: true,
        onremove: true
      },
      backup: {},
      used: {
        charlotte: true,
        onremove: true,
        intro: {
          mark(dialog, storage = []) {
            if (!storage.length) {
              return "当前未因【赂存】视为使用牌";
            }
            dialog.addText("已因【赂存】视为使用牌");
            dialog.addSmall([storage, "vcard"]);
          }
        }
      },
      draw: {
        audio: "olsblucun",
        forced: true,
        popup: false,
        trigger: { global: "phaseEnd" },
        async content(event, trigger, player) {
          const name2 = "ol_sb_zhangrang";
          if (player.countExpansions("olsblucun") > 0) {
            player.logSkill(event.name);
            player.changeSkin({ characterName: name2 }, `${name2}_shadow`);
            const cards2 = player.getExpansions("olsblucun").randomGets(1);
            await player.loseToDiscardpile({ cards: cards2 });
            await player.draw();
          }
          player.changeSkin({ characterName: name2 }, name2);
        }
      },
      effect: {
        charlotte: true,
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          return event.skill === "olsblucun_backup" && event.targets?.some((target) => target.isIn() && !event.targets.some((targetx) => targetx.countCards("h") > target.countCards("h")));
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const target = trigger.targets.filter((target2) => target2.isIn() && !trigger.targets.some((targetx) => targetx.countCards("h") > target2.countCards("h"))).randomGet();
          if (!target) {
            return;
          }
          player.line(target);
          const result = await target.chooseCard({
            prompt: "赂存：将一张手牌置于" + get.translation(player) + "的武将牌",
            position: "h",
            forced: true
          }).forResult();
          if (result?.cards?.length) {
            const name2 = "ol_sb_zhangrang";
            player.changeSkin({ characterName: name2 }, `${name2}_shadow`);
            await player.addToExpansion({
              cards: result.cards,
              source: target,
              animate: "give",
              gaintag: ["olsblucun"]
            });
          }
        }
      }
    }
  },
  olsbtuisheng: {
    limited: true,
    audio: 6,
    trigger: { player: ["phaseZhunbeiBegin", "dying"] },
    filter(event, player) {
      return player.getStorage("olsblucun_used").length > 0;
    },
    check(event, player) {
      if (event.name === "dying") {
        return true;
      }
      return player.isDamaged() && player.getExpansions("olsblucun").length >= 5;
    },
    skillAnimation: true,
    animationColor: "water",
    //笑点解析——以水蜕生
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const names = player.getStorage("olsblucun_used").map((item) => item.name).toUniqued().slice();
      player.removeSkill("olsblucun_used");
      const goon = player.countCards("h") > 0;
      let result;
      const discard = Array.from(ui.discardPile.childNodes).filter((i) => names.includes(get.name(i)));
      if (!goon) {
        result = { index: 1 };
      } else {
        const num = get.cnNumber(game.roundNumber);
        result = await player.chooseControl({
          choiceList: ["将所有手牌置于武将牌上，称为“赂”", `随机从弃牌堆中获得${num}张牌（${get.translation(names)}）`],
          prompt: "蜕生：请选择一项执行并回复1点体力",
          ai: () => {
            const { player: player2, discard: discard2 } = get.event();
            return Math.min(discard2.length, game.roundNumber) >= player2.countCards("h") ? 1 : 0;
          }
        }).set("discard", discard).forResult();
      }
      if (result?.index === 0) {
        await player.addToExpansion({
          cards: player.getCards("h"),
          source: player,
          animate: "give",
          gaintag: ["olsblucun"]
        });
      } else {
        const cards2 = discard.randomGets(game.roundNumber);
        if (cards2.length) {
          await player.gain({ cards: cards2, animate: "gain2" });
        } else {
          player.popup("杯具");
        }
      }
      await player.recover();
    },
    ai: { combo: "olsblucun" }
  },
  //OL界伏皇后
  olqiuyuan: {
    inherit: "qiuyuan",
    filter(event, player) {
      const { card } = event;
      return (card.name == "sha" || get.type(card) == "trick" && get.tag(card, "damage") && get.type(card) != "delay") && game.hasPlayer((current) => {
        return current != player && !event.targets.includes(current) && lib.filter.targetEnabled(card, event.player, current);
      });
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      const { card } = trigger;
      const name2 = get.name(card), type = get.type2(card);
      const result = await target.chooseToGive(
        (card2, player2) => {
          const name3 = get.name(card2, player2);
          return name3 != get.event().namex && get.type2(name3) == get.event().type;
        },
        `交给${get.translation(player)}一张不为【${get.translation(name2)}】的${get.translation(type)}牌，或成为${get.translation(card)}的额外目标`,
        player
      ).set("ai", (card2) => {
        const { player: player2, target: target2 } = get.event();
        return Math.sign(Math.sign(get.attitude(player2, target2)) - 0.5) * get.value(card2);
      }).set("namex", name2).set("type", type).forResult();
      if (!result?.bool) {
        trigger.getParent().targets.push(target);
        trigger.getParent().triggeredTargets2.push(target);
        game.log(target, "成为了", card, "的额外目标");
      }
    }
  },
  //OL界郭淮
  oljingce: {
    audio: 2,
    inherit: "rejingce",
    trigger: { global: "phaseUseEnd" },
    group: "oljingce_add",
    subSkill: {
      add: {
        trigger: { player: "loseEnd" },
        silent: true,
        firstDo: true,
        filter(event, player) {
          if (_status.currentPhase !== player) {
            return false;
          }
          if (event.getParent().name != "useCard") {
            return false;
          }
          const list = player.getStorage("oljingce_effect");
          return event.cards.some((card) => !list.includes(get.suit(card, player)));
        },
        async content(event, trigger, player) {
          const effect = "oljingce_effect";
          player.addTempSkill(effect);
          player.markAuto(
            effect,
            trigger.cards.map((card) => get.suit(card, player))
          );
          player.storage[effect].sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
          player.addTip(effect, get.translation(effect) + player.getStorage(effect).reduce((str, suit) => str + get.translation(suit), ""));
        }
      },
      effect: {
        charlotte: true,
        onremove(player, skill) {
          delete player.storage[skill];
          player.removeTip(skill);
        },
        intro: { content: "当前已使用花色：$" },
        mod: {
          maxHandcard(player, num) {
            return num + player.getStorage("oljingce_effect").length;
          }
        }
      }
    }
  },
  //OL谋张绣
  olsbchoulie: {
    audio: 2,
    trigger: { player: "phaseBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => current != player);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(lib.filter.notMe, get.prompt2(event.skill)).set("ai", (target) => {
        const player2 = get.player();
        return player2.countDiscardableCards(player2, "he") * get.effect(target, { name: "sha" }, player2);
      }).forResult();
    },
    limited: true,
    skillAnimation: true,
    animationColor: "fire",
    async content(event, trigger, player) {
      const { targets } = event;
      player.awakenSkill(event.name);
      player.addTempSkill(["olsbchoulie_buff", "olsbchoulie_excluded"]);
      player.markAuto("olsbchoulie_buff", targets);
    },
    subSkill: {
      buff: {
        audio: "olsbchoulie",
        charlotte: true,
        onremove: true,
        trigger: { player: "phaseAnyBegin" },
        getIndex(event, player) {
          const storage = player.getStorage("olsbchoulie_buff");
          const vcard = new lib.element.VCard({ name: "sha", isCard: true });
          return storage.filter((current) => player.canUse(vcard, current, false)).sortBySeat();
        },
        filter(event, player) {
          return player.hasCard((card) => {
            if (get.position(card) === "h" && _status.connectMode) {
              return true;
            }
            return lib.filter.cardDiscardable(card, player);
          }, "he");
        },
        async cost(event, trigger, player) {
          const target = event.indexedData;
          const list = [event.skill, target];
          event.result = await player.chooseToDiscard("he", "chooseonly").set("prompt", get.prompt2(...list)).set("prompt2", `弃置一张牌，视为对${get.translation(target)}使用一张【杀】（当前为${get.translation(trigger.name)}）`).set("ai", (card) => {
            const player2 = get.player(), target2 = get.event().getParent().indexedData;
            const vcard = new lib.element.VCard({ name: "sha", isCard: true });
            if (get.effect(target2, vcard, player2, player2) > 0) {
              return 7 - get.value(card);
            }
            return 0;
          }).set("logSkill", list).forResult();
        },
        popup: false,
        async content(event, trigger, player) {
          const target = event.indexedData;
          await player.discard(event.cards);
          const vcard = new lib.element.VCard({ name: "sha", isCard: true });
          if (player.canUse(vcard, target, false)) {
            await player.useCard(vcard, target, false);
          }
        }
      },
      excluded: {
        charlotte: true,
        trigger: { global: "useCardToTargeted" },
        filter(event, player) {
          return event.getParent(2).name == "olsbchoulie_buff" && player.getStorage("olsbchoulie_buff").includes(event.target);
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const { target } = trigger;
          const result = await target.chooseToDiscard(`仇猎：你可以弃置一张基本牌或武器牌，令${get.translation(trigger.card)}对你无效`, "he").set("filterCard", (card) => {
            return get.type(card) == "basic" || get.subtypes(card).includes("equip1");
          }).set("ai", (card) => {
            const player2 = get.player(), trigger2 = get.event().getTrigger();
            return -get.effect(player2, trigger2.card, trigger2.player, player2) - get.value(card);
          }).forResult();
          if (result?.bool) {
            trigger.excluded.add(target);
            game.log(trigger.card, "对", target, "无效");
            await game.delayx();
          }
        }
      }
    }
  },
  olsbzhuijiao: {
    audio: 2,
    trigger: { player: "useCard" },
    filter(event, player) {
      if (event.card.name != "sha") {
        return false;
      }
      const evtx = get.info("dcjianying").getLastUsed(player, event);
      if (!evtx) {
        return false;
      }
      return !player.hasHistory("sourceDamage", (evt) => evt.card == evtx.card);
    },
    forced: true,
    async content(event, trigger, player) {
      await player.draw();
      trigger.baseDamage++;
      player.addTempSkill("olsbzhuijiao_debuff");
      trigger.olsbzhuijiao = true;
    },
    subSkill: {
      debuff: {
        charlotte: true,
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          if (!event.olsbzhuijiao) {
            return false;
          }
          return !player.hasHistory("sourceDamage", (evt) => evt.card == event.card);
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          player.chooseToDiscard("he", true);
        }
      }
    }
  },
  //OL谋赵云
  olsbnilan: {
    audio: 2,
    trigger: { source: "damageSource" },
    filter(event, player) {
      return !event.getParent().name?.startsWith("olsbnilan");
    },
    async cost(event, trigger, player) {
      const result = await player.chooseButton([
        get.prompt(event.skill),
        [
          [
            ["discard", "弃置所有手牌"],
            ["draw", "摸两张牌"]
          ],
          "textbutton"
        ]
      ]).set("filterButton", (button) => {
        if (button.link == "discard") {
          const player2 = get.player();
          return player2.countCards("h") && !player2.hasCard((card) => !lib.filter.cardDiscardable(card, player2, "olsbnilan"), "h");
        }
        return true;
      }).set("ai", (button) => {
        const player2 = get.player();
        const { link } = button;
        if (link == "discard") {
          return player2.countCards("h") < 4 && game.hasPlayer((current) => current != player2 && get.damageEffect(current, player2, player2) > 0) && player2.countCards("h", "sha");
        }
        if (link == "draw") {
          return 1;
        }
        return 0;
      }).forResult();
      event.result = {
        bool: result?.bool,
        cost_data: result?.links?.[0]
      };
    },
    choice: {
      async discard(player) {
        const cards2 = player.getCards("h");
        if (cards2.length) {
          await player.discard(cards2);
          if (cards2.some((card) => get.name(card) == "sha")) {
            const result = await player.chooseTarget("对一名其他角色造成1点伤害", lib.filter.notMe).set("ai", (target) => {
              const player2 = get.player();
              return get.damageEffect(target, player2, player2);
            }).forResult();
            if (result?.bool && result?.targets?.length) {
              player.line(result.targets);
              await result.targets[0].damage();
            }
          }
        }
      },
      async draw(player) {
        await player.draw(2);
      }
    },
    async content(event, trigger, player) {
      const { cost_data } = event;
      player.addSkill("olsbnilan_buff");
      if (cost_data == "discard") {
        player.markAuto("olsbnilan_buff", ["draw"]);
        await lib.skill.olsbnilan.choice.discard(player);
      } else {
        player.markAuto("olsbnilan_buff", ["discard"]);
        await lib.skill.olsbnilan.choice.draw(player);
      }
    },
    subSkill: {
      buff: {
        audio: "olsbnilan",
        charlotte: true,
        onremove: true,
        trigger: { player: "damageEnd" },
        prompt2(event, player) {
          const list = player.getStorage("olsbnilan_buff").toUniqued();
          return `你可以${list.length > 0 ? "依次" : ""}执行：<br>${list.map((type) => {
            if (type == "draw") {
              return "摸两张牌";
            }
            return "弃置所有手牌，然后若其中有【杀】，你可以对一名其他角色造成1点伤害";
          }).join("；<br>")}。`;
        },
        async content(event, trigger, player) {
          const list = player.getStorage(event.name);
          player.removeSkill(event.name);
          for (const i of list) {
            await lib.skill.olsbnilan.choice[i](player);
          }
        }
      }
    }
  },
  olsbjueya: {
    audio: 2,
    enable: "chooseToUse",
    // "chooseToRespond", // 没有打出喵
    hiddenCard(player, name2) {
      return get.type(name2) == "basic" && !player.countCards("h") && !player.getStorage("olsbjueya").includes(name2);
    },
    marktext: "崖",
    onremove: true,
    intro: { content: "已以此法使用过$" },
    filter(event, player) {
      if (event.type == "wuxie" || player.countCards("h")) {
        return false;
      }
      return get.inpileVCardList((info) => {
        if (info[0] != "basic" || player.getStorage("olsbjueya").includes(info[2])) {
          return false;
        }
        return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
      }).length;
    },
    chooseButton: {
      dialog(event, player) {
        const list = get.inpileVCardList((info) => {
          if (info[0] != "basic" || player.getStorage("olsbjueya").includes(info[2])) {
            return false;
          }
          return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
        });
        return ui.create.dialog("绝崖", [list, "vcard"], "hidden");
      },
      check(button) {
        if (get.event().getParent().type != "phase") {
          return 1;
        }
        return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
      },
      backup(links, player) {
        return {
          audio: "olsbjueya",
          filterCard: () => false,
          selectCard: -1,
          popname: true,
          viewAs: { name: links[0][2], nature: links[0][3], isCard: true },
          async precontent(event, trigger, player2) {
            player2.markAuto("olsbjueya", event.result.card.name);
          }
        };
      },
      prompt(links, player) {
        return "选择【" + get.translation(links[0][2]) + "】的目标";
      }
    },
    ai: {
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        if (arg == "respond") {
          return false;
        }
        const name2 = tag == "respondSha" ? "sha" : "shan";
        return get.info("olsbjueya").hiddenCard(player, name2);
      },
      order: 2,
      result: {
        player(player) {
          if (get.event().dying) {
            return get.attitude(player, get.event().dying);
          }
          return 1;
        }
      }
    },
    subSkill: { backup: {} }
  },
  //OL谋张飞
  olsbjingxian: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      if (!player.countCards("he", (card) => get.type(card) != "basic")) {
        return false;
      }
      return game.hasPlayer((target) => {
        if (target.hasSkill("olsbjingxian_used")) {
          return false;
        }
        return player != target;
      });
    },
    filterTarget(card, player, target) {
      if (target.hasSkill("olsbjingxian_used")) {
        return false;
      }
      return player != target;
    },
    filterCard(card) {
      return get.type(card) != "basic";
    },
    selectCard: [1, 2],
    position: "he",
    lose: false,
    discard: false,
    delay: false,
    async content(event, trigger, player) {
      const { cards: cards2, targets } = event;
      const target = targets[0];
      player.give(cards2, target);
      if (event.cards.length != 2) {
        const result = await target.chooseButton(
          [
            "请选择一项",
            [
              [
                ["draw", `你与${get.translation(player)}各摸一张牌`],
                ["gain", `令${get.translation(player)}从牌堆中获得一张【杀】`]
              ],
              "textbutton"
            ]
          ],
          true
        ).forResult();
        for (const i of result.links) {
          if (i == "draw") {
            await game.asyncDraw([player, target]);
          } else if (i == "gain") {
            const card = get.cardPile(function(card2) {
              return card2.name == "sha";
            });
            if (card) {
              await player.gain(card, "draw");
            } else {
              player.chat("不是哥们，杀呢");
            }
          }
        }
      } else {
        await game.asyncDraw([player, target]);
        const card = get.cardPile(function(card2) {
          return card2.name == "sha";
        });
        if (card) {
          await player.gain(card, "draw");
        } else {
          player.chat("不是哥们，杀呢");
        }
      }
      target.addTempSkill("olsbjingxian_used");
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  olsbxieyong: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      player.addSkill(["olsbxieyong_jiu", "olsbxieyong_buff"]);
      player.markAuto("olsbxieyong_jiu", event.targets);
      if (!player.storage.jiu) {
        player.storage.jiu = 0;
      }
      player.storage.jiu += 1;
      game.broadcastAll(function(player2) {
        player2.addSkill("jiu");
        if (!player2.node.jiu && lib.config.jiu_effect) {
          player2.node.jiu = ui.create.div(".playerjiu", player2.node.avatar);
          player2.node.jiu2 = ui.create.div(".playerjiu", player2.node.avatar2);
        }
      }, player);
    },
    subSkill: {
      jiu: {
        charlotte: true,
        silent: true,
        trigger: {
          global: ["phaseAfter", "die"]
        },
        filter(event, player) {
          return player.getStorage("olsbxieyong_jiu").includes(event.player);
        },
        async content(event, trigger, player) {
          game.broadcastAll(function(player2) {
            player2.removeSkill(["olsbxieyong_jiu", "olsbxieyong_buff"]);
            player2.removeSkill("jiu");
          }, player);
          game.addVideo("jiuNode", player, false);
        },
        ai: {
          jiuSustain: true
        },
        onremove: true,
        intro: {
          content: "已选择$"
        }
      },
      buff: {
        charlotte: true,
        trigger: {
          global: "useCardAfter"
        },
        filter(event, player) {
          if (!player.getStorage("olsbxieyong_jiu").includes(event.player)) {
            return false;
          }
          return !event.targets?.includes(event.player);
        },
        direct: true,
        clearTime: true,
        async content(event, trigger, player) {
          const target = trigger.player;
          const next = player.chooseToUse();
          next.set("prompt", `狭勇：是否对${get.translation(target)}使用一张【杀】？`);
          next.set("targetx", target);
          next.set("filterCard", function(card) {
            return get.name(card) == "sha";
          });
          next.set("filterTarget", function(card, player2, target2) {
            const evt = get.event();
            return evt.targetx == target2 && lib.filter.filterTarget.apply(this, arguments);
          });
          next.set("oncard", () => {
            const evt = get.event();
            const { targets } = evt;
            for (const target2 of targets) {
              target2.addTempSkill("qinggang2");
              target2.storage.qinggang2.add(evt.card);
              target2.markSkill("qinggang2");
            }
          });
          next.set("addCount", false);
          next.set("logSkill", event.name);
          await next;
        }
      }
    }
  },
  //OL界廖化
  oldangxian: {
    audio: 2,
    audioname2: { guansuo: "dangxian_guansuo" },
    trigger: { player: "phaseBegin" },
    forced: true,
    async content(event, trigger, player) {
      player.addSkill(`${event.name}_effect`);
      trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
    },
    subSkill: {
      effect: {
        mod: {
          targetInRange(card) {
            if ((card.cards ?? []).length === 1) {
              const card2 = card.cards[0];
              if (get.itemtype(card2) === "card" && card2.hasGaintag("oldangxian")) {
                return true;
              }
            }
          }
        },
        charlotte: true,
        audio: "oldangxian",
        audioname2: { guansuo: "dangxian_guansuo" },
        trigger: { player: ["phaseUseBegin", "phaseUseEnd"] },
        filter(event, player, name2) {
          if (event._extraPhaseReason !== "oldangxian") {
            return false;
          }
          return name2.endsWith("Begin") || event.oldangxian_draw && !player.hasHistory("sourceDamage", (evt) => evt.getParent(event.name) === event);
        },
        async cost(event, trigger, player) {
          if (event.triggername.endsWith("Begin")) {
            event.result = await player.chooseBool("当先：是否从牌堆或弃牌堆获得一张无距离限制的【杀】？").set("prompt2", '<div class="text center">若如此做，此阶段结束时，若你未于此阶段造成过伤害，则你对自己造成1点伤害</div>').set(
              "choice",
              get.cardPile((card) => card.name === "sha" && player.hasUseTarget(card, false))
            ).forResult();
          } else {
            event.result = { bool: true };
          }
        },
        async content(event, trigger, player) {
          if (event.triggername.endsWith("Begin")) {
            trigger.set("oldangxian_draw", true);
            const card = get.cardPile({ name: "sha" });
            if (card) {
              await player.gain(card, "draw").gaintag.add("oldangxian");
            }
          } else {
            await player.damage();
          }
        }
      }
    }
  },
  olfuli: {
    limited: true,
    audio: 2,
    enable: "chooseToUse",
    filter(event, player) {
      return event.type === "dying" && player == event.dying;
    },
    skillAnimation: true,
    animationColor: "soil",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const sum = game.countGroup();
      await player.recoverTo(sum);
      await player.drawTo(sum);
      const maxDamage = player.getAllHistory("sourceDamage").reduce((num, evt) => num + evt.num, 0);
      if (maxDamage < sum) {
        await player.turnOver();
      }
    },
    ai: {
      save: true,
      skillTagFilter(player, arg, target) {
        return player == target && player.storage.olfuli != true;
      },
      result: {
        player: 10
      },
      threaten(player, target) {
        if (!target.storage.olfuli) {
          return 0.9;
        }
      }
    }
  },
  //OL谋黄月英
  olsblixian: {
    audio: 2,
    trigger: {
      player: ["damageEnd", "phaseZhunbeiBegin", "phaseJieshuBegin"]
    },
    filter(event, player) {
      if (!player.countCards("hes")) {
        return false;
      }
      if (event.name == "damage") {
        return event.num;
      }
      return player.getStorage("olsblixian_triggers").includes(event.name);
    },
    async cost(event, trigger, player) {
      const list = ["wuzhong", ...player.getStorage("olsblixian_names")].map((name2) => ["", "", name2]);
      if (!list.length) {
        return;
      }
      const result = await player.chooseButton([get.prompt2(event.skill), [list, "vcard"]]).set("viewAs", (button, cards2) => get.autoViewAs({ name: button.link[2] }, cards2 ? cards2 : "unsure")).set("filterButton", (button) => {
        const player2 = get.player();
        const cards2 = player2.getCards("hes");
        return cards2.some((card) => player2.hasUseTarget(get.event().viewAs(button, [card]), true, false));
      }).set("ai", (button) => get.player().getUseValue(get.event().viewAs(button))).forResult();
      if (result?.links?.length) {
        event.result = {
          bool: true,
          cost_data: result.links[0][2]
        };
      }
    },
    async content(event, trigger, player) {
      const name2 = event.cost_data;
      game.broadcastAll((name3) => {
        lib.skill.olsblixian_backup.viewAs = { name: name3 };
      }, name2);
      await player.chooseToUse(true).set("openskilldialog", `将一张牌当作【${get.translation(name2)}】使用`).set("norestore", true).set("_backupevent", `${event.name}_backup`).set("custom", {
        add: {},
        replace: { window() {
        } }
      }).backup(`${event.name}_backup`).set("targetRequired", true).set("complexTarget", true).set("complexSelect", true).set("addCount", false);
    },
    group: ["olsblixian_addTrigger"],
    subSkill: {
      addTrigger: {
        audio: "olsblixian",
        forced: true,
        locked: false,
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          return event.skill == "olsblixian_backup" && !player.getStorage("olsblixian_triggers").includes("phaseJieshu") && player.getAllHistory("useCard", (evt) => evt.skill == event.skill).map((evt) => evt.card.name).unique().length >= 3;
        },
        async content(event, trigger, player) {
          player.markAuto("olsblixian_triggers", "phaseJieshu");
          game.log(player, "的", "#g【理贤】", "于", "#y结束阶段", "也可发动");
        }
      },
      backup: {
        log: false,
        filterCard(card) {
          return get.itemtype(card) == "card";
        },
        position: "hes",
        check(card) {
          return 7 - get.value(card);
        }
      }
    }
  },
  olsbbingcai: {
    audio: 2,
    trigger: {
      global: "useCard"
    },
    filter(event, player) {
      if (!player.countCards("he")) {
        return false;
      }
      return game.getGlobalHistory("everything", (evt) => evt.name === "useCard" && get.type(evt.card) === "basic").indexOf(event) === 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard("he").set("prompt", get.prompt(event.name.slice(0, -5))).set("prompt2", "你可重铸一张牌。若重铸牌为" + (get.tag(trigger.card, "damage") ? "" : "非") + "伤害类，则" + get.translation(trigger.card) + "对相同目标再结算一次。").set("ai", (card) => {
        const eff = get.event().eff;
        if (get.tag(card, "damage") === Boolean(eff[0])) {
          return 6 - get.value(card) + eff[1];
        }
        return 6 - get.value(card);
      }).set("eff", [
        Boolean(get.tag(trigger.card, "damage")),
        trigger.targets.reduce((acc, target) => {
          if (trigger.card.name === "tao" && target.getDamagedHp() < 2) {
            return acc;
          }
          return acc + get.effect(target, trigger.card, trigger.player, player);
        }, 0)
      ]).forResult();
    },
    async content(event, trigger, player) {
      await player.recast(event.cards);
      const card = event.cards[0];
      if (Boolean(get.tag(card, "damage")) === Boolean(get.tag(trigger.card, "damage"))) {
        trigger.effectCount++;
        if ((get.mode() !== "identity" || player.identity !== "nei") && trigger.targets.reduce((acc, target) => {
          if (trigger.card.name === "tao" && target.getDamagedHp() < 2) {
            return acc;
          }
          return acc + get.effect(target, trigger.card, trigger.player, player);
        }, 0) > 6) {
          player.addExpose(0.16);
        }
      }
      if (get.type2(card, player) == "trick" && player.getStorage("olsblixian_names").length < 3) {
        const list = ["shunshou", "guohe", "tiesuo"].removeArray(player.getStorage("olsblixian_names")).map((i) => ["trick", "", i]);
        let result;
        list.length == 1 ? result = { bool: true, links: list } : result = await player.chooseButton([`并才：为【理贤】添加一个牌名`, [list, "vcard"]], true).set("ai", (button) => get.player().getUseValue(get.autoViewAs({ name: button.link[2] }))).forResult();
        if (result?.links?.length) {
          const name2 = result.links[0][2];
          player.markAuto("olsblixian_names", name2);
          game.log(player, "的", "#g【理贤】", "增加牌名", "#y" + get.translation(name2));
          if (player.getStorage("olsblixian_names").length >= 3) {
            player.markAuto("olsblixian_triggers", "phaseZhunbei");
            game.log(player, "的", "#g【理贤】", "于", "#y准备阶段", "也可发动");
          }
        }
      }
    }
  },
  old_olsblixian: {
    mod: {
      cardEnabled(card, player, result) {
        const evt = get.event();
        if (get.itemtype(card) == "vcard" && Array.isArray(card.cards)) {
          if (card.cards.some((c) => c.hasGaintag("old_olsblixian")) && !["old_olsblixian_sha", "old_olsblixian_shan"].includes(evt.skill)) {
            return false;
          }
        }
        if (card.hasGaintag("old_olsblixian") && !["old_olsblixian_sha", "old_olsblixian_shan"].includes(evt.skill)) {
          return false;
        }
      }
    },
    group: ["old_olsblixian_gain", "old_olsblixian_sha", "old_olsblixian_shan"],
    subSkill: {
      gain: {
        audio: "old_olsblixian",
        trigger: {
          global: "phaseJieshuBegin"
        },
        forced: true,
        filter(event, player) {
          const gain = [];
          game.getGlobalHistory("useCard").forEach((evt) => {
            if (get.type2(evt.card) != "trick" || get.position(evt.card) != "d") {
              return false;
            }
            if (!evt.targets || !evt.targets.includes(player)) {
              return false;
            }
            gain.addArray(evt.cards);
          });
          return gain.length;
        },
        async content(event, trigger, player) {
          const gain = [];
          game.getGlobalHistory("useCard").forEach((evt) => {
            if (get.type2(evt.card) != "trick" || get.position(evt.card) != "d") {
              return false;
            }
            if (!evt.targets || !evt.targets.includes(player)) {
              return false;
            }
            gain.addArray(evt.cards);
          });
          await player.gain(gain, "draw").gaintag.add("old_olsblixian");
        }
      },
      sha: {
        audio: "old_olsblixian",
        enable: ["chooseToUse", "chooseToRespond"],
        filterCard(card) {
          return card.hasGaintag("old_olsblixian");
        },
        viewAs: {
          name: "sha"
        },
        viewAsFilter(player) {
          if (!player.countCards("hs", lib.skill["old_olsblixian_sha"].filterCard)) {
            return false;
          }
        },
        position: "hs",
        prompt: "将一张“理贤”牌当杀使用或打出",
        check() {
          return 1;
        },
        ai: {
          respondSha: true,
          skillTagFilter(player) {
            if (!player.countCards("hs", lib.skill["old_olsblixian_sha"].filterCard)) {
              return false;
            }
          },
          order() {
            return get.order({ name: "sha" }) - 0.1;
          }
        }
      },
      shan: {
        audio: "old_olsblixian",
        enable: ["chooseToRespond", "chooseToUse"],
        filterCard(card) {
          return card.hasGaintag("old_olsblixian");
        },
        viewAs: {
          name: "shan"
        },
        prompt: "将一张“理贤”牌当闪打出",
        check() {
          return 1;
        },
        viewAsFilter(player) {
          if (!player.countCards("hs", lib.skill["old_olsblixian_sha"].filterCard)) {
            return false;
          }
        },
        position: "hs",
        ai: {
          respondShan: true,
          skillTagFilter(player) {
            if (!player.countCards("hs", lib.skill["old_olsblixian_sha"].filterCard)) {
              return false;
            }
          }
        }
      }
    }
  },
  //OL谋沮授
  olsbguliang: {
    audio: 2,
    trigger: { target: "useCardToPlayer" },
    filter(event, player) {
      return event.player != player;
    },
    usable: 1,
    check(event, player) {
      return get.effect(player, event.card, event.player, player) < 0;
    },
    async content(event, trigger, player) {
      trigger.getParent().excluded.add(player);
      player.addTempSkill("olsbguliang_debuff");
      player.markAuto("olsbguliang_debuff", trigger.player);
    },
    subSkill: {
      debuff: {
        charlotte: true,
        onremove: true,
        trigger: { target: "useCardToPlayer" },
        silent: true,
        filter(event, player) {
          return player.getStorage("olsbguliang_debuff").includes(event.player);
        },
        async content(event, trigger, player) {
          trigger.getParent().directHit.add(player);
        }
      }
    }
  },
  olsbxutu: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    marktext: "资",
    mark: true,
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      const cards2 = get.cards(3);
      const next = player.addToExpansion(cards2, player, "giveAuto");
      next.gaintag.add(event.name);
      await next;
    },
    group: ["olsbxutu_exchange"],
    subSkill: {
      exchange: {
        audio: "olsbxutu",
        trigger: { global: "phaseJieshuBegin" },
        filter(event, player) {
          return get.discarded().someInD("d") && player.countExpansions("olsbxutu");
        },
        async cost(event, trigger, player) {
          const cards2 = player.getExpansions("olsbxutu");
          const discardPile = get.discarded().filterInD("d");
          const dialog = ["徐图：选择要交换的牌", '<div class="text center">“资”</div>', cards2, '<div class="text center">弃牌堆</div>', discardPile];
          const result = await player.chooseButton(dialog, 2).set("filterButton", (button) => {
            if (ui.selected.buttons.length) {
              return get.position(button.link) != get.position(ui.selected.buttons[0].link);
            }
            return true;
          }).set("cards1", cards2).set("cards2", discardPile).set("ai", (button) => {
            get.player();
            const { link } = button;
            let cards1 = get.event().cards1.slice(0), cards22 = get.event().cards2.slice(0);
            if (!ui.selected.buttons.length) {
              if (!cards22.includes(link)) {
                return 0;
              }
              cards22.remove(link);
              const suits = cards1.filter((card) => get.suit(card) == get.suit(link));
              const numbers = cards1.filter((card) => get.number(card) == get.number(link));
              if (suits.length > 2 || numbers.length > 2) {
                return 20 + get.value(link);
              }
              return get.value(link);
            }
            cards1.push(ui.selected.buttons[0].link);
            cards1.remove(link);
            const bool = cards1.every((card) => get.suit(card) == get.suit(cards1[0])) || cards1.every((card) => get.number(card) == get.number(cards1[0]));
            if (bool) {
              return 20 - get.value(link);
            }
            return get.value(ui.selected.buttons[0].link) - get.value(link);
          }).forResult();
          event.result = {
            bool: result.bool,
            cost_data: result.links
          };
        },
        async content(event, trigger, player) {
          const { cost_data } = event;
          const cards2 = cost_data;
          if (get.position(cards2[0]) != "x") {
            cards2.reverse();
          }
          const next = player.addToExpansion(cards2[1], player, "giveAuto");
          next.gaintag.add("olsbxutu");
          await next;
          await player.loseToDiscardpile(cards2[0]);
          const expansion = player.getExpansions("olsbxutu");
          if (!expansion.length) {
            return;
          }
          const bool = expansion.every((card) => get.suit(card) == get.suit(expansion[0])) || expansion.every((card) => get.number(card) == get.number(expansion[0]));
          if (!bool) {
            return;
          }
          const result = await player.chooseTarget(true).set("prompt", `将${get.translation(expansion)}交给一名角色`).forResult();
          if (result?.bool && result?.targets?.length) {
            await result.targets[0].gain(expansion, "draw");
            const num = 3 - player.countExpansions("olsbxutu");
            if (num > 0) {
              const next2 = player.addToExpansion(get.cards(num), player, "giveAuto");
              next2.gaintag.add("olsbxutu");
              await next2;
            }
          }
        }
      }
    }
  },
  //OL谋公孙
  olsbjiaodi: {
    audio: 3,
    trigger: { player: "useCardToPlayer" },
    filter(event, player) {
      return event.card.name === "sha" && event.isFirstTarget && event.targets.length === 1;
    },
    forced: true,
    logTarget: "target",
    async content(event, trigger, player) {
      const { target } = trigger, num = target.getAttackRange() - player.getAttackRange();
      if (num <= 0) {
        trigger.getParent().baseDamage++;
        await player.gainPlayerCard(target, "h", true);
      }
      if (num >= 0) {
        await player.discardPlayerCard(target, "hej", true);
        const evt = trigger.getParent();
        if (game.hasPlayer((target2) => {
          return !evt.targets.includes(target2) && lib.filter.targetEnabled2(evt.card, player, target2) && lib.filter.targetInRange(evt.card, player, target2);
        })) {
          const result = await player.chooseTarget(
            (card, player2, target2) => {
              const { evt: evt2 } = get.event();
              return !evt2.targets.includes(target2) && lib.filter.targetEnabled2(evt2.card, player2, target2) && lib.filter.targetInRange(evt2.card, player2, target2);
            },
            get.translation(event.name) + "：为" + get.translation(trigger.card) + "额外指定一个目标",
            true
          ).set("evt", evt).set("ai", (target2) => {
            const player2 = get.player(), { evt: evt2 } = get.event();
            return get.effect(target2, evt2.card, evt2.player, player2);
          }).forResult();
          if (result?.bool && result.targets?.length) {
            const { targets } = result;
            player.line(targets, "yellow");
            trigger.targets.addArray(targets);
            trigger.getParent().triggeredTargets1.addArray(targets);
            game.log(targets, "成为了", trigger.card, "的额外目标");
          }
        }
      }
    },
    mod: { attackRange: (player) => player.getHp() }
  },
  olsbbaojing: {
    audio: 3,
    enable: "phaseUse",
    filter(event, player) {
      return game.hasPlayer((target) => target !== player);
    },
    usable: 1,
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const { target } = event;
      let { index } = await player.chooseControl(" +1 ", "-1").set("ai", () => {
        const player2 = get.player(), { target: target2 } = get.event().getParent();
        return get.attitude(player2, target2) > 0 ? 0 : 1;
      }).set("prompt", "令" + get.translation(target) + "的攻击范围+1或-1").forResult();
      if (typeof index === "number") {
        index = Math.sign(0.5 - index);
        player.popup((index > 0 ? "+" : "") + index);
        target.addSkill("olsbbaojing_effect");
        if (!target.storage["olsbbaojing_effect"][player.playerid]) {
          target.storage["olsbbaojing_effect"][player.playerid] = 0;
        }
        target.storage["olsbbaojing_effect"][player.playerid] += index;
        target.markSkill("olsbbaojing_effect");
      }
    },
    ai: {
      order: 10,
      result: {
        player(player, target) {
          if (get.attitude(player, target) < 0) {
            return 1 / (target.getAttackRange() + 1);
          }
          return target.getAttackRange();
        }
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        init: (player, skill) => player.storage[skill] = player.storage[skill] || {},
        onremove: true,
        intro: {
          markcount(storage = {}) {
            const num = Object.keys(storage).reduce((sum, i) => sum + storage[i], 0);
            if (!num) {
              return num;
            }
            return (num > 0 ? "+" : "") + num.toString();
          },
          content(storage = {}) {
            const num = Object.keys(storage).reduce((sum, i) => sum + storage[i], 0);
            if (!num) {
              return "攻击范围无变化";
            }
            return "攻击范围" + (num > 0 ? "+" : "") + num;
          }
        },
        mod: {
          attackRange(player, num) {
            const storage = player.storage["olsbbaojing_effect"] || {};
            const numx = Object.keys(storage).reduce((sum2, i) => sum2 + storage[i], 0);
            if (!numx) {
              return;
            }
            const sum = num + numx;
            if (numx > 0 || sum >= 1) {
              return sum;
            }
          }
        },
        trigger: { global: "phaseUseBegin" },
        filter(event, player) {
          return player.storage?.["olsbbaojing_effect"]?.[event.player.playerid];
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const target = trigger.player;
          delete player.storage[event.name][target.playerid];
          player[Object.keys(player.storage[event.name]).length ? "markSkill" : "removeSkill"](event.name);
        }
      }
    }
  },
  //谋邓艾
  olsbjigu: {
    audio: 2,
    trigger: { global: ["cardsDiscardAfter", "phaseBegin"] },
    filter(event, player) {
      const num1 = player.maxHp, num2 = player.countExpansions("olsbjigu");
      if (event.name == "cardsDiscard") {
        if (num2 >= num1) {
          return false;
        }
        if (!event.cards.filterInD("d").some((card) => get.suit(card) != "heart")) {
          return false;
        }
        const evtx = event.getParent();
        if (evtx.name !== "orderingDiscard") {
          return false;
        }
        const evt2 = evtx.relatedEvent || evtx.getParent();
        return evt2.name == "useCard" && evt2.player != event.getParent("phaseUse")?.player;
      }
      return event.player.maxHp == num1 && num2 && player.countCards("h");
    },
    locked: true,
    async cost(event, trigger, player) {
      if (trigger.name == "cardsDiscard") {
        event.result = {
          bool: true
        };
      } else {
        const next = player.chooseToMove("积谷：是否交换“谷”和手牌？");
        next.set("list", [
          [get.translation(player) + "（你）的“谷”", player.getExpansions("olsbjigu")],
          ["手牌区", player.getCards("h")]
        ]);
        next.set("filterMove", (from, to) => {
          return typeof to != "number";
        });
        next.set("processAI", (list) => {
          let player2 = get.player(), cards2 = list[0][1].concat(list[1][1]).sort((a, b) => get.useful(a) - get.useful(b)), cards22 = cards2.splice(0, player2.getExpansions("olsbjigu").length);
          return [cards22, cards2];
        });
        const { bool, moved } = await next.forResult();
        event.result = {
          bool,
          cost_data: moved
        };
      }
    },
    async content(event, trigger, player) {
      if (trigger.name == "cardsDiscard") {
        const cards2 = trigger.cards.filter((card) => get.position(card, true) == "d" && get.suit(card) != "heart");
        const next = player.addToExpansion(cards2, "gain2");
        next.gaintag.add(event.name);
        await next;
      } else {
        const { cost_data: moved } = event;
        const pushs = moved[0], gains = moved[1];
        pushs.removeArray(player.getExpansions(event.name));
        gains.removeArray(player.getCards("h"));
        if (!pushs.length || pushs.length != gains.length) {
          return;
        }
        const next = player.addToExpansion(pushs);
        next.gaintag.add(event.name);
        await next;
        await player.gain(gains, "draw");
      }
    },
    marktext: "谷",
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    }
  },
  olsbjiewan: {
    audio: 2,
    trigger: { global: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
    filter(event, player) {
      const num1 = player.maxHp, num2 = player.countExpansions("olsbjigu");
      if (event.name == "phaseZhunbei") {
        if (!num1 && num2 < 1) {
          return false;
        }
        return player.countCards("hs", (card) => player.hasUseTarget(get.autoViewAs({ name: "shunshou", storage: { olsbjiewan: true } }, [card]), false, false));
      }
      return player.countCards("h") == num2 && !player.isMaxMaxHp(true);
    },
    async cost(event, trigger, player) {
      if (trigger.name == "phaseJieshu") {
        event.result = {
          bool: true
        };
      } else {
        const next = player.chooseButton([
          "解腕：是否选择一项执行？",
          [
            [
              ["lose", "减少1点体力上限"],
              ["discard", "移去两张“谷”"]
            ],
            "textbutton"
          ]
        ]);
        next.set("filterButton", (button) => {
          const { link } = button, player2 = get.player();
          return link == "lose" && player2.maxHp > 0 || link == "discard" && player2.countExpansions("olsbjigu") > 1;
        });
        next.set("ai", (button) => {
          const { link } = button, player2 = get.player();
          if (player2.getUseValue({} <= 0)) {
            return 0;
          }
          let num1 = player2.maxHp, num2 = player2.countExpansions("olsbjigu"), num3 = player2.countCards("h");
          if (num3 == num2 - 1 && link == "discard") {
            return 3;
          }
          if ((num3 == num2 + 1 || player2.maxHp > 3) && (player2.isDamaged() || event.getRand() < 0.5) && !game.hasPlayer((current) => {
            if (player2 == current) {
              return false;
            }
            return current.maxHp <= num1 - 1 && num1 - 1 < 3;
          }) && link == "lose") {
            return 2;
          }
          return 0;
        });
        const { bool, links } = await next.forResult();
        event.result = {
          bool,
          cost_data: links
        };
      }
    },
    async content(event, trigger, player) {
      if (trigger.name == "phaseJieshu") {
        await player.gainMaxHp();
      } else {
        const { cost_data: links } = event;
        if (links.includes("lose")) {
          await player.loseMaxHp();
        } else {
          const result = await player.chooseButton([`解腕：移去两张“谷”`, player.getExpansions("olsbjigu")], 2, true).set("ai", (button) => 6 - get.value(button.link)).set("direct", true).forResult();
          if (result?.links?.length) {
            await player.loseToDiscardpile(result.links);
          }
        }
        if (!player.countCards("hs", (card) => player.hasUseTarget(get.autoViewAs({ name: "shunshou", storage: { olsbjiewan: true } }, [card]), void 0, false))) {
          return;
        }
        const next = player.chooseToUse();
        next.set("openskilldialog", `###${get.prompt(event.name)}###将一张手牌当距离限制为${Math.max(1, player.countExpansions("olsbjigu"))}的【顺手牵羊】使用`);
        next.set("norestore", true);
        next.set("_backupevent", `${event.name}_backup`);
        next.set("forced", true);
        next.set("custom", {
          add: {},
          replace: { window() {
          } }
        });
        next.set("targetRequired", true);
        next.set("complexSelect", true);
        next.backup(`${event.name}_backup`);
        await next;
      }
    },
    locked: false,
    mod: {
      targetInRange(card, player, target) {
        if (card?.storage?.olsbjiewan) {
          return 1 - Math.max(1, player.countExpansions("olsbjigu"));
        }
      }
    },
    subSkill: {
      backup: {
        audio: "olsbjiewan",
        filterCard(card) {
          return get.itemtype(card) == "card";
        },
        viewAs: {
          name: "shunshou",
          storage: {
            olsbjiewan: true
          }
        },
        position: "hs",
        ai1(card) {
          const player = get.player();
          if (player.hasSkill("olsbjigu") && get.suit(card) != "heart") {
            return 10;
          }
          return 6 - get.value(card);
        }
      }
    }
  },
  //谋董卓
  olguanbian: {
    audio: 2,
    trigger: {
      global: ["phaseBefore", "roundEnd"],
      player: ["enterGame", "olxiongniAfter", "olfengshangAfter"]
    },
    filter(event, player, name2) {
      if (name2 == "roundEnd") {
        return game.roundNumber == 1;
      }
      return event.name != "phase" || game.phaseNumber == 0;
    },
    forced: true,
    async content(event, trigger, player) {
      if (event.triggername == "roundEnd" || ["olxiongni", "olfengshang"].includes(trigger.name)) {
        await player.removeSkills(event.name);
      } else {
        player.addMark(event.name, game.players.length + game.dead.length, false);
      }
    },
    mod: {
      maxHandcard(player, num) {
        return num + player.countMark("olguanbian");
      },
      globalFrom(from, to, current) {
        return current + from.countMark("olguanbian");
      },
      globalTo(from, to, current) {
        return current + to.countMark("olguanbian");
      }
    },
    intro: {
      content: "<li>手牌上限+#<br><li>计算与其他角色的距离+#<br><li>其他角色计算与你的距离+#"
    }
  },
  olxiongni: {
    audio: 6,
    trigger: {
      player: "phaseUseBegin"
    },
    filter(event, player) {
      if (!game.hasPlayer((target) => target != player)) {
        return false;
      }
      return player.countCards("he", (card) => _status.connectMode || lib.filter.cardDiscardable(card, player));
    },
    async cost(event, trigger, player) {
      const skillName = event.name.slice(0, -5);
      event.result = await player.chooseToDiscard(get.prompt2(skillName), "he").set("ai", (card) => {
        const player2 = get.player();
        if (!game.hasPlayer((target) => player2 != target && get.damageEffect(target, player2, player2) > 0)) {
          return 0;
        }
        if (get.suit(card, player2) == "heart") {
          return 8 - get.value(card);
        }
        return 7.5 - get.value(card);
      }).set("logSkill", [skillName, get.info(skillName).logTarget(trigger, player)]).forResult();
    },
    popup: false,
    logTarget: (event, player) => game.filterPlayer((target) => target != player).sortBySeat(),
    async content(event, trigger, player) {
      player.changeSkin({ characterName: "ol_sb_dongzhuo" }, "ol_sb_dongzhuo_shadow1");
      const suit = get.suit(event.cards[0]);
      for (const target of event.targets) {
        const { bool } = await target.chooseToDiscard(`弃置一张${get.translation(suit)}牌，否则${get.translation(player)}对你造成1点伤害`, "he", (card, player2) => {
          return get.event().suit == get.suit(card);
        }).set("ai", (card) => {
          const player2 = get.player(), target2 = get.event().getParent().player;
          if (get.damageEffect(player2, target2, player2) > 0) {
            return 0;
          }
          return 7.5 - get.value(card);
        }).set("suit", suit).forResult();
        if (!bool) {
          await target.damage();
        }
      }
    }
  },
  olfengshang: {
    audio: 6,
    getCards(player) {
      const cards2 = [];
      game.checkGlobalHistory("cardMove", (evt) => {
        if (evt.name != "cardsDiscard" && (evt.name != "lose" || evt.position != ui.discardPile)) {
          return;
        }
        cards2.addArray(evt.cards.filter((card) => !player.getStorage("olfengshang_clear").includes(get.suit(card))));
      });
      return cards2.filterInD("d");
    },
    enable: "phaseUse",
    trigger: { global: "dying" },
    filter(event, player) {
      const cards2 = event.name == "chooseToUse" ? event.olfengshang_cards || [] : get.info("olfengshang").getCards(player);
      if (!cards2.map((i) => get.suit(i)).unique().some((suit) => cards2.filter((card) => get.suit(card) == suit).length > 1)) {
        return false;
      }
      return !player.hasSkill("olfengshang_" + (event.name === "chooseToUse" ? "used" : "round"), null, null, false);
    },
    onChooseToUse(event) {
      if (!game.online && !event.olfengshang_cards) {
        event.set("olfengshang_cards", get.info("olfengshang").getCards(event.player));
      }
    },
    prompt: (event) => event.name === "chooseToUse" ? get.info("olfengshang").prompt2() : get.prompt("olfengshang"),
    prompt2: () => lib.translate["olfengshang_info"].split("你可以")[1],
    async content(event, trigger, player) {
      player.addTempSkill(event.name + (trigger ? "_round" : "_used"), trigger ? "phaseAfter" : "phaseUseAfter");
      if (_status.connectMode) {
        game.broadcastAll(() => _status.noclearcountdown = true);
      }
      player.changeSkin({ characterName: "ol_sb_dongzhuo" }, "ol_sb_dongzhuo_shadow2");
      const cards2 = !trigger ? event.getParent(2).olfengshang_cards : get.info(event.name).getCards(player);
      const result = await player.chooseButtonTarget({
        createDialog: ["封赏：选择两张牌依次分配给两名角色", cards2],
        forced: true,
        selectButton: 2,
        cardx: cards2,
        filterButton(button) {
          const { link } = button;
          if (!ui.selected.buttons?.length) {
            return get.event().cardx.filter((card) => get.suit(card) == get.suit(link)).length > 1;
          }
          return get.suit(link) == get.suit(ui.selected.buttons[0].link);
        },
        ai1(button) {
          return get.buttonValue(button);
        },
        complexSelect: true,
        filterTarget: true,
        selectTarget: 2,
        ai2(target) {
          const player2 = get.player(), att = get.attitude(player2, target);
          let button = ui.selected.buttons[ui.selected.targets.length];
          if (!button?.link) {
            return 0;
          }
          if (get.value(button.link, player2, "raw") < 0) {
            return Math.max(0.01, 100 - att);
          } else if (att > 0) {
            if (player2.getUseValue({ name: "jiu" }) && player2 != target) {
              return 10;
            }
            return Math.max(0.1, att / Math.sqrt(1 + target.countCards("h")));
          } else {
            return Math.max(0.01, (100 + att) / 200);
          }
        }
      }).forResult();
      if (_status.connectMode) {
        game.broadcastAll(() => {
          delete _status.noclearcountdown;
          game.stopCountChoose();
        });
      }
      player.addTempSkill("olfengshang_clear", "roundStart");
      player.markAuto("olfengshang_clear", [get.suit(result.links[0])]);
      player.storage["olfengshang_clear"].sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
      player.addTip("olfengshang_clear", ["olfengshang", ...player.getStorage("olfengshang_clear")].map((i) => get.translation(i)).join(""));
      const gain_list = [];
      for (let i = 0; i < result.links.length; i++) {
        const source = result.targets[i];
        player.line(source, "green");
        game.log(source, "获得了", result.links[i]);
        gain_list.push([source, result.links[i]]);
      }
      await game.loseAsync({
        gain_list,
        giver: player,
        animate: "gain2"
      }).setContent("gaincardMultiple");
      await game.delayx();
      if (!player.hasHistory("gain", (evt) => evt.getParent(2) == event) && player.hasUseTarget({ name: "jiu", isCard: true }, true, false)) {
        await player.chooseUseTarget({ name: "jiu", isCard: true }, true, false);
      }
    },
    ai: {
      order: 7,
      result: { player: 1 }
    },
    subSkill: {
      used: { charlotte: true },
      round: { charlotte: true },
      clear: {
        marktext: "赏",
        charlotte: true,
        onremove(player, skill) {
          player.removeTip(skill);
          delete player.storage[skill];
        },
        intro: { content: "本轮已赏赐过$花色的牌" }
      }
    }
  },
  olzhibin: {
    audio: 6,
    getNum(player) {
      let num = 0;
      game.countPlayer2((current) => {
        if (current != player && current.group == "qun") {
          num += current.getAllHistory("useCard", (evt) => get.color(evt.card) == "black").length;
        }
      });
      return num;
    },
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    filter(event, player) {
      const num = get.info("olzhibin").getNum(player);
      return get.info("olzhibin").filterx(player, num) || get.info("olzhibin").filtery(player, num) || get.info("olzhibin").filterz(player, num);
    },
    filterx(player, num) {
      return num >= 3 && !game.getAllGlobalHistory("everything", (evt) => evt.name == "gainMaxHp" && evt.player == player && evt.getParent().name == "olzhibin").length;
    },
    filtery(player, num) {
      return num >= 6 && !player.hasSkill("dcfencheng", null, null, false) && !game.getAllGlobalHistory("everything", (evt) => evt.name == "changeSkills" && evt.player == player && evt.getParent().name == "olzhibin" && evt.addSkill.includes("dcfencheng")).length;
    },
    filterz(player, num) {
      return num >= 9 && !player.hasSkill("benghuai", null, null, false) && !game.getAllGlobalHistory("everything", (evt) => evt.name == "changeSkills" && evt.player == player && evt.getParent().name == "olzhibin" && evt.addSkill.includes("benghuai")).length;
    },
    zhuSkill: true,
    forced: true,
    async content(event, trigger, player) {
      const skillName = event.name, num = get.info(skillName).getNum(player);
      if (get.info(skillName).filterx(player, num)) {
        await player.gainMaxHp();
        await player.recover();
      }
      if (get.info(skillName).filtery(player, num)) {
        await player.addSkills("dcfencheng");
      }
      if (get.info(skillName).filterz(player, num)) {
        await player.addSkills("benghuai");
      }
    },
    derivation: ["dcfencheng", "benghuai"]
  },
  //谋华雄
  olsbbojue: {
    audio: 2,
    enable: "phaseUse",
    filterTarget: lib.filter.notMe,
    usable: 2,
    async content(event, trigger, player) {
      const target = event.target, targets = [player, target], total = player.countCards("h") + target.countCards("h");
      const map = await game.chooseAnyOL(targets, get.info(event.name).chooseCard, [targets]).forResult();
      let count = 0;
      for (const i of targets) {
        const result = map.get(i);
        i.popup(result.bool ? "弃牌" : "摸牌");
        if (result.bool) {
          count++;
        }
      }
      switch (count) {
        case 0:
          await player.draw("nodelay");
          await target.draw();
          break;
        case 2:
          await game.loseAsync({
            lose_list: [
              [player, map.get(player).cards],
              [target, map.get(target).cards]
            ]
          }).setContent("discardMultiple");
          break;
        default:
          for (const current of [player, target]) {
            if (map.get(current).bool) {
              await current.discard(map.get(current).cards);
            } else {
              await current.draw();
            }
          }
          break;
      }
      await game.delay(0.5);
      switch (Math.abs(total - player.countCards("h") - target.countCards("h"))) {
        case 0:
          for (const current of [player, target]) {
            const aim = current === player ? target : player;
            if (current.isIn()) {
              current.line(aim);
              await current.discardPlayerCard(aim, "he", true);
            }
          }
          break;
        case 2:
          for (const current of [player, target]) {
            const aim = current === player ? target : player;
            const sha = new lib.element.VCard({ name: "sha", isCard: true });
            if (current.isIn() && current.canUse(sha, aim, false)) {
              current.line(aim);
              await current.useCard(sha, aim, false, "noai");
            }
          }
          break;
      }
    },
    ai: {
      order: 4,
      result: {
        player(player, target) {
          return get.effect(player, { name: "guohe" }, target, player) + get.effect(player, { name: "sha" }, target, player);
        },
        target(player, target) {
          return get.effect(target, { name: "guohe" }, player, target) + get.effect(target, { name: "sha" }, player, target);
        }
      }
    },
    chooseCard(player, targets, eventId) {
      const str = get.translation(targets[0] == player ? targets[1] : targets[0]);
      return player.chooseCard("he", (card, player2) => {
        return lib.filter.cardDiscardable(card, player2, "olsbbojue");
      }).set("prompt", "搏决：弃置一张牌，或点击“取消”摸一张牌").set("prompt2", "若你与" + str + "的手牌数之和的变化值为：0，你与其依次弃置对方一张牌；2，你与其依次视为对对方使用一张【杀】").set("ai", (card) => {
        return 0;
      }).set("id", eventId).set("_global_waiting", true);
    }
  },
  olsbyangwei: {
    audio: 2,
    trigger: { player: "gainAfter" },
    filter(event, player) {
      if (event.getParent().name !== "draw" || event.getParent("phaseDraw").player === player) {
        return false;
      }
      let history = player.getHistory(
        "gain",
        (evt) => {
          return evt.getParent().name === "draw" && evt.getParent("phaseDraw").player !== player;
        },
        event
      );
      history = history.slice().map((evt) => evt.cards).flat();
      return history.length >= 2 && event.cards.includes(history[1]);
    },
    forced: true,
    usable: 1,
    async content(event, trigger, player) {
      player.addSkill("olsbyangwei_attack");
      player.addMark("olsbyangwei_attack", 1, false);
    },
    group: "olsbyangwei_discard",
    subSkill: {
      discard: {
        audio: "olsbyangwei",
        trigger: {
          player: "loseAfter",
          global: "loseAsyncAfter"
        },
        filter(event, player) {
          if (player.countSkill("olsbyangwei_discard")) {
            return false;
          }
          if (event.type != "discard" || event.getlx === false || event.getParent("phaseDiscard").player === player) {
            return false;
          }
          if (!event.getl(player)?.cards2?.length) {
            return false;
          }
          let history = game.getGlobalHistory(
            "everything",
            (evt) => {
              if (evt.name !== "loseAsync" && (event.name !== "lose" || evt.player !== player)) {
                return false;
              }
              if (evt.type != "discard" || evt.getlx === false || evt.getParent("phaseDiscard").player === player) {
                return false;
              }
              return evt.getl(player)?.cards2?.length > 0;
            },
            event
          );
          history = history.slice().map((evt) => evt.getl(player).cards2).flat();
          return history.length >= 2 && event.getl(player).cards2.includes(history[1]);
        },
        forced: true,
        usable: 1,
        async content(event, trigger, player) {
          player.addSkill("olsbyangwei_defend");
          player.addMark("olsbyangwei_defend", 1, false);
        }
      },
      attack: {
        audio: "olsbyangwei",
        charlotte: true,
        onremove: true,
        trigger: { source: "damageBegin1" },
        forced: true,
        async content(event, trigger, player) {
          trigger.num += player.countMark(event.name);
          player.removeSkill(event.name);
        },
        markimage: "image/card/pss_stone.png",
        intro: {
          name: "扬威 - 增伤",
          content: "下次造成的伤害+#"
        },
        ai: {
          damageBonus: true,
          effect: {
            player(card, player, target) {
              if (get.tag(card, "damage")) {
                return [1, 0, 2, 0];
              }
            }
          }
        }
      },
      defend: {
        audio: "olsbyangwei",
        charlotte: true,
        onremove: true,
        trigger: { player: "damageBegin2" },
        forced: true,
        async content(event, trigger, player) {
          trigger.num += player.countMark(event.name);
          player.removeSkill(event.name);
        },
        markimage: "image/card/pss_paper.png",
        intro: {
          name: "扬威 - 受伤",
          content: "下次受到的伤害+#"
        },
        ai: {
          effect: {
            target(card, player, target) {
              if (get.tag(card, "damage")) {
                return 2;
              }
            }
          }
        }
      }
    }
  },
  //界曹植
  oljiushi: {
    audio: 2,
    trigger: {
      player: "useCard"
    },
    filter(event, player) {
      if (!player.isTurnedOver()) {
        return false;
      }
      return event.player.hasHistory("lose", function(evt) {
        const evtx = evt.relatedEvent || evt.getParent();
        if (evtx != event) {
          return false;
        }
        for (var i in evt.gaintag_map) {
          if (evt.gaintag_map[i].includes("reluoying")) {
            return true;
          }
        }
        return false;
      });
    },
    async content(event, trigger, player) {
      trigger.directHit.addArray(game.players);
    },
    forced: true,
    locked: false,
    mod: {
      targetInRange(card, player, target) {
        if (!player.isTurnedOver()) {
          return;
        }
        if (!card.cards) {
          return;
        }
        for (var i of card.cards) {
          if (i.hasGaintag("reluoying")) {
            return true;
          }
        }
      }
    },
    init(player) {
      player.addSkill("oljiushi_gain");
    },
    onremove(player) {
      player.removeSkill("oljiushi_gain");
    },
    group: ["oljiushi_use", "oljiushi_damage"],
    subSkill: {
      gain: {
        audio: "oljiushi",
        trigger: {
          player: ["gainAfter", "turnOverAfter"]
        },
        onremove: true,
        content(storage, player) {
          return `已获得了${storage.length}张牌`;
        },
        filter(event, player) {
          if (event.name == "turnOver") {
            return !player.isTurnedOver();
          }
          return event.getParent().name.indexOf("reluoying") != -1;
        },
        charlotte: true,
        async cost(event, trigger, player) {
          event.result = { bool: false };
          if (trigger.name != "turnOver") {
            player.addGaintag(trigger.cards, "reluoying");
            let bool = player.isTurnedOver() && player != _status.currentPhase && player.hasSkill("oljiushi", null, false);
            player.markAuto("oljiushi_gain", trigger.cards);
            if (bool && player.getStorage("oljiushi_gain").length >= player.maxHp) {
              const result = await player.chooseBool("是否发动【酒诗】，将武将牌翻面？").forResult();
              event.result = result;
            }
          } else {
            player.setStorage("oljiushi_gain", [], true);
          }
        },
        async content(event, trigger, player) {
          await player.turnOver();
        }
      },
      use: {
        audio: "oljiushi",
        enable: "chooseToUse",
        hiddenCard(player, name2) {
          if (name2 == "jiu") {
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
        audio: "oljiushi",
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
          player.turnOver();
        }
      }
    }
  },
  //谋袁术
  olsbjinming: {
    audio: 2,
    trigger: { player: "phaseBegin" },
    init(player, skill) {
      player.storage[skill] = [1, 2, 3, 4];
    },
    onremove: true,
    locked: true,
    filter(event, player) {
      return player.getStorage("olsbjinming").length;
    },
    async cost(event, trigger, player) {
      let choiceList = ["1.回复过1点体力", "2.弃置过两张牌", "3.使用过三种类型的牌", "4.造成过4点伤害"];
      for (let i = 0; i < choiceList.length; i++) {
        if (!player.getStorage("olsbjinming").includes(i + 1)) {
          choiceList[i] = `<span style="text-decoration: line-through;">${choiceList[i]}</span>`;
        }
      }
      const result = event.result = await player.chooseButton([`###矜名：请选择一项###<div class='text center'>本回合结束时你摸X张牌，若未满足选择的条件，则删除此选项（X为你最后一次发动〖矜名〗选择的选项序号）</div>`, [choiceList.slice(0, 2), "tdnodes"], [choiceList.slice(2, 4), "tdnodes"]]).set(
        "filterButton",
        (button) => {
          const player2 = get.player();
          return player2.getStorage("olsbjinming").includes(parseInt(button.link.slice(0, 1)));
        },
        true
      ).set("ai", (button) => parseInt(button.link.slice(0, 1))).forResult();
      if (result?.links?.length) {
        event.result = {
          bool: true,
          cost_data: result.links[0]
        };
      }
    },
    async content(event, trigger, player) {
      const choice = event.cost_data;
      player.addSkill("olsbjinming_used");
      player.addTempSkill("olsbjinming_target");
      player.storage.olsbjinming_used = player.storage.olsbjinming_target = choice;
      player.markSkill("olsbjinming_used");
      player.markSkill("olsbjinming_target");
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove(player, skill) {
          delete player.storage[skill];
          player.removeSkill("olsbjinming_target");
        },
        marktext: "玺",
        intro: {
          name: "玉玺",
          markcount(storage, player) {
            if (!storage) {
              return null;
            }
            return parseInt(storage.slice(0, 1));
          },
          content(storage, player) {
            if (!storage) {
              return "当前未发动过〖矜名〗";
            }
            return `最后一次发动〖矜名〗所选选项为${storage.slice(0, 1)}`;
          }
        }
      },
      target: {
        charlotte: true,
        onremove: true,
        audio: "olsbjinming",
        trigger: { player: "phaseEnd" },
        forced: true,
        async content(event, trigger, player) {
          const choice = player.storage[event.name], num = parseInt(choice.slice(0, 1));
          await player.draw(num);
          if (lib.skill.olsbjinming_target.checkTarget(player, num)) {
            player.popup("成功", "wood");
            return;
          }
          player.popup("失败", "fire");
          player.storage.olsbjinming?.remove(num);
          game.log(player, "删除了", "#g【矜名】", "的选项", `#y${choice.slice(2)}`);
        },
        intro: {
          markcount: () => null,
          content(storage) {
            if (!storage) {
              return "本回合没有〖矜名〗目标";
            }
            return `本回合需要${storage.slice(2)}`;
          }
        },
        checkTarget(player, key) {
          let num = 0;
          switch (key) {
            case 1: {
              game.getGlobalHistory("everything", (evt) => {
                if (evt.name == "recover" && evt.player == player && evt.num > 0) {
                  num += evt.num;
                }
              });
              break;
            }
            case 2: {
              player.getHistory("lose", (evt) => {
                if (evt.type == "discard" && evt.cards2?.length) {
                  num += evt.cards2.length;
                }
              });
              break;
            }
            case 3: {
              let types = [];
              player.getHistory("useCard", (evt) => {
                let type = get.type2(evt.card);
                if (!types.includes(type)) {
                  types.add(type);
                }
              });
              num = types.length;
              break;
            }
            case 4: {
              player.getHistory("sourceDamage", (evt) => {
                if (evt.num > 0) {
                  num += evt.num;
                }
              });
              break;
            }
          }
          return num >= key;
        }
      }
    }
  },
  olsbxiaoshi: {
    audio: 2,
    trigger: { player: "useCard2" },
    filter(event, player) {
      if (!player.isPhaseUsing() || player.getStorage("olsbxiaoshi_used").includes(event.getParent("phaseUse"))) {
        return false;
      }
      if (!["trick", "basic"].includes(get.type(event.card))) {
        return false;
      }
      return game.hasPlayer((current) => !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current));
    },
    async cost(event, trigger, player) {
      const num = player.storage.olsbjinming_used ? parseInt(player.storage.olsbjinming_used.slice(0, 1)) : 0;
      event.result = await player.chooseTarget(get.prompt2(event.skill), function(card, player2, target) {
        const trigger2 = get.event().getTrigger();
        if (trigger2.targets.includes(target)) {
          return false;
        }
        return lib.filter.targetEnabled2(trigger2.card, get.player(), target);
      }).set("num", num).set("ai", (target) => {
        const trigger2 = get.event().getTrigger();
        const eff1 = get.effect(target, trigger2.card, trigger2.player, get.player());
        const eff2 = get.effect(target, { name: "draw" }, get.player(), get.player());
        return eff1 + eff2 * get.event().num;
      }).forResult();
    },
    async content(event, trigger, player) {
      player.addTempSkill("olsbxiaoshi_used");
      player.markAuto("olsbxiaoshi_used", [trigger.getParent("phaseUse")]);
      player.addTempSkill("olsbxiaoshi_effect");
      player.markAuto("olsbxiaoshi_effect", [trigger]);
      trigger.targets.addArray(event.targets);
      game.log(event.targets, "成为了", trigger.card, "的额外目标");
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      },
      effect: {
        charlotte: true,
        onremove: true,
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          return player.getStorage("olsbxiaoshi_effect").includes(event) && !player.hasHistory("sourceDamage", (evt) => evt.card === event.card);
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const num = player.storage.olsbjinming_used ? parseInt(player.storage.olsbjinming_used.slice(0, 1)) : 0;
          const result = !num ? {} : await player.chooseTarget(
            get.translation("olsbxiaoshi") + "：请选择一项",
            (card, player2, target) => {
              const trigger2 = get.event().getTrigger();
              return trigger2.targets?.includes(target);
            },
            "令其中一个目标摸" + get.cnNumber(num) + "张牌，或失去1点体力"
          ).set("ai", (target) => {
            const { finalTarget } = get.event();
            return finalTarget == target;
          }).set(
            "finalTarget",
            (function() {
              const [finalTarget, drawEff] = trigger.targets.reduce(([targetx, effx = 0], target) => {
                if (!targetx?.isIn()) {
                  return [target, 0];
                }
                const eff = get.effect(target, { name: "draw" }, player, player);
                return eff > effx ? [target, eff] : [targetx, effx];
              }, []);
              if (drawEff <= 0) {
                const losehpEff = get.effect(player, { name: "losehp" }, player, player);
                if (losehpEff >= 0) {
                  return 0;
                }
                return drawEff * num - losehpEff > 0 ? finalTarget : 0;
              }
              return finalTarget;
            })()
          ).set("num", num).forResult();
          if (result?.targets?.length) {
            await result.targets[0].draw(parseInt(player.storage.olsbjinming_used.slice(0, 1)));
          } else {
            await player.loseHp();
          }
        }
      }
    },
    derivation: ["olsbjinming"]
  },
  olsbyanliang: {
    audio: 2,
    zhuSkill: true,
    global: "olsbyanliang_give",
    subSkill: {
      used: {
        charlotte: true
      },
      give: {
        audio: "olsbyanliang",
        enable: "phaseUse",
        discard: false,
        lose: false,
        delay: false,
        line: true,
        prepare(cards2, player, targets) {
          targets[0].logSkill("olsbyanliang");
        },
        prompt() {
          let player = _status.event.player;
          let list = game.filterPlayer((target) => {
            return target != player && target.hasZhuSkill("olsbyanliang", player) && !target.hasSkill("olsbyanliang_used");
          });
          let str = "将一张装备牌交给" + get.translation(list);
          if (list.length > 1) {
            str += "中的一人";
          }
          str += "，然后视为使用一张【酒】";
          return str;
        },
        filter(event, player) {
          if (player.group != "qun") {
            return false;
          }
          if (!game.hasPlayer((target) => {
            return target != player && target.hasZhuSkill("olsbyanliang", player) && !target.hasSkill("olsbyanliang_used");
          })) {
            return false;
          }
          if (!player.canUse({ name: "jiu", isCard: true }, player, true, true)) {
            return false;
          }
          return player.hasCard((card) => {
            return lib.skill.olsbyanliang_give.filterCard(card, player);
          }, "he");
        },
        filterCard(card, player) {
          return get.type(card) == "equip";
        },
        position: "he",
        log: false,
        visible: true,
        filterTarget(card, player, target) {
          return target != player && target.hasZhuSkill("olsbyanliang", player) && !target.hasSkill("olsbyanliang_used");
        },
        async content(event, trigger, player) {
          player.give(event.cards, event.target);
          await player.useCard({ name: "jiu", isCard: true }, player);
          event.target.addTempSkill("olsbyanliang_used", "phaseUseEnd");
        },
        ai: {
          expose: 0.3,
          order() {
            return get.order({ name: "jiu" }) + 0.2;
          },
          result: {
            target: 5
          }
        }
      }
    }
  },
  //谋孙坚
  olsbhulie: {
    audio: 3,
    trigger: {
      player: "useCardToPlayered"
    },
    filter(event, player) {
      if (event.targets.length != 1 || !["sha", "juedou"].includes(event.card.name)) {
        return false;
      }
      return !player.getStorage("olsbhulie_used").includes(event.card.name);
    },
    check(event, player) {
      return get.attitude(player, event.targets[0]) <= 0;
    },
    logTarget: (event) => event.targets[0],
    async content(event, trigger, player) {
      const evt = trigger.getParent();
      if (typeof evt.baseDamage != "number") {
        evt.baseDamage = 1;
      }
      evt.baseDamage++;
      player.addTempSkill("olsbhulie_used");
      player.markAuto("olsbhulie_used", trigger.card.name);
      const target = trigger.targets[0], sha = get.autoViewAs({ name: "sha", isCard: true });
      player.when("useCardAfter").filter(
        (evt2) => evt2 == trigger.getParent() && target.canUse(sha, player, false) && target.isIn() && !game.hasPlayer2((current) => {
          return current.hasHistory("damage", (evtx) => evtx.card === evt2.card);
        })
      ).step(async (event2, trigger2, player2) => {
        const { bool } = await player2.chooseBool("虎烈", `是否令${get.translation(target)}视为对你使用一张杀？`).set("choice", get.effect(player2, sha, target, player2) > 0).forResult();
        if (bool) {
          await target.useCard(sha, player2, false);
        }
      });
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  olsbyipo: {
    audio: 3,
    trigger: { player: "changeHpAfter" },
    filter(event, player) {
      const hp = player.getHp();
      if (hp <= 0 || event.changedHp == 0) {
        return false;
      }
      return !player.getAllHistory("custom", (evt) => evt.olsbyipo_num).map((evt) => evt.olsbyipo_num).includes(hp);
    },
    async cost(event, trigger, player) {
      player.getHistory("custom").push({
        olsbyipo_num: player.getHp()
      });
      event.result = await player.chooseTarget(get.prompt2(event.name.slice(0, -5))).set("ai", (target) => {
        const player2 = get.player();
        if (player2.getDamagedHp() == 1 && target.countCards("he") == 0) {
          return 0;
        }
        if (get.attitude(player2, target) > 0) {
          return 10 + get.attitude(player2, target);
        }
        if (player2.getDamagedHp() == 1) {
          return -1;
        }
        return 1;
      }).forResult();
    },
    async content(event, trigger, player) {
      const num = Math.max(player.getDamagedHp(), 1);
      const [target] = event.targets;
      let directcontrol = num == 1;
      if (!directcontrol) {
        const str1 = "摸" + get.cnNumber(num, true) + "弃一";
        const str2 = "摸一弃" + get.cnNumber(num, true);
        directcontrol = str1 == (await player.chooseControl(str1, str2, function(event2, player2) {
          return _status.event.choice;
        }).set("choice", get.attitude(player, target) > 0 ? str1 : str2).set("prompt", "毅魄：请选择一项").forResult()).control;
      }
      if (directcontrol) {
        await target.draw(num);
        await target.chooseToDiscard(true, "he");
      } else {
        await target.draw();
        await target.chooseToDiscard(num, true, "he", "allowChooseAll");
      }
    }
  },
  //OL界曹冲
  olchengxiang: {
    audioname: ["strong_caochong"],
    inherit: "chengxiang",
    getIndex(event, player) {
      return event.num;
    },
    getNum(player, num) {
      const mark = player.countMark("olchengxiang");
      player.clearMark("olchengxiang", false);
      return num + mark;
    },
    async callback(event, trigger, player) {
      if (event.cards2?.length && event.cards2.map((card) => {
        return get.number(card);
      }).reduce((sum, num) => {
        return sum += num;
      }, 0) == 13) {
        player.addMark(event.name, 1, false);
      }
    },
    intro: { content: "下次发动【称象】多亮出$张牌" }
  },
  olrenxin: {
    audio: 2,
    trigger: {
      global: "dying"
    },
    filter(event, player) {
      return event.player != player && player.countCards("he", { type: "equip" }) > 0;
    },
    logTarget: "player",
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard(get.prompt(event.name.slice(0, -5), trigger.player), `弃置一张装备牌并将武将牌翻面，然后${get.translation(trigger.player)}回复至1点体力`, { type: "equip" }, "he").set("ai", (card) => {
        const player2 = get.player();
        if (get.attitude(player2, get.event().getTrigger().player) > 3) {
          return 11 - get.value(card);
        }
        return -1;
      }).forResult();
    },
    async content(event, trigger, player) {
      await player.turnOver();
      await trigger.player.recoverTo(1);
    },
    ai: {
      expose: 0.5
    }
  },
  //OL张春华
  oljianmie: {
    audio: 2,
    enable: "phaseUse",
    filterTarget: lib.filter.notMe,
    usable: 1,
    async content(event, trigger, player) {
      const target = event.target, targets = [player, target];
      const map = await game.chooseAnyOL(targets, get.info(event.name).chooseControl, [targets]).forResult();
      const getColor = (result) => {
        return result.control == "none2" ? "none" : result.control;
      }, cards_player = player.getDiscardableCards(player, "h", (card) => get.color(card) == getColor(map.get(player))), cards_target = target.getDiscardableCards(target, "h", (card) => get.color(card) == getColor(map.get(target)));
      if (cards_player.length && cards_target.length) {
        await game.loseAsync({
          lose_list: [
            [player, cards_player],
            [target, cards_target]
          ]
        }).setContent("discardMultiple");
      } else if (cards_player.length) {
        await player.discard(cards_player);
      } else if (cards_target.length) {
        await target.discard(cards_target);
      }
      if (cards_player.length != cards_target.length) {
        const user = cards_player.length > cards_target.length ? player : target;
        const aim = user == player ? target : player;
        const juedou = new lib.element.VCard({ name: "juedou", isCard: true });
        if (user.canUse(juedou, aim, false)) {
          await user.useCard(juedou, aim, false);
        }
      }
    },
    ai: {
      order: 1,
      result: {
        player(player, target) {
          let num = (player.hasSkill("shangshi") ? Math.max(0, player.getDamagedHp() - player.countCards("h") / 2) : 0) - player.countDiscardableCards(player, "h") / 2;
          return get.effect(player, { name: "juedou" }, target, player) + get.effect(player, { name: "draw" }, player, player) * num;
        },
        target(player, target) {
          return get.effect(target, { name: "juedou" }, player, target) - get.effect(target, { name: "draw" }, target, target) * target.countDiscardableCards(target, "h") / 2;
        }
      }
    },
    chooseControl(player, targets, eventId) {
      let colors = ["red", "black"];
      if (player.getDiscardableCards(player, "h").some((card) => get.color(card) == "none")) {
        colors.push("none2");
      }
      const str = get.translation(targets[0] == player ? targets[1] : targets[0]);
      return player.chooseControl(colors).set("prompt", "翦灭：请选择一个颜色").set("prompt2", "弃置选择颜色的手牌，然后若你/" + str + "弃置的牌更多，则你/" + str + "视为对" + str + "/你使用【决斗】").set("ai", () => {
        const player2 = get.event().player;
        let controls = get.event().controls.slice();
        return controls.sort((a, b) => {
          return player2.getDiscardableCards(player2, "h").filter((card) => {
            return get.color(card) == (a == "none2" ? "none" : a);
          }).reduce((sum, card) => sum + get.value(card, player2), 0) - player2.getDiscardableCards(player2, "h").filter((card) => {
            return get.color(card) == (b == "none2" ? "none" : b);
          }).reduce((sum, card) => sum + get.value(card, player2), 0);
        })[0];
      }).set("id", eventId).set("_global_waiting", true);
    }
  },
  //OL谋孔融
  olsbliwen: {
    audio: 2,
    mod: {
      aiOrder(player, card, num) {
        if (typeof card == "object" && _status.currentPhase === player) {
          const evt = player.getLastUsed(1);
          if (evt && evt.card && (get.suit(evt.card) && get.suit(evt.card) == get.suit(card) || get.type2(evt.card) == get.type2(card))) {
            return num + 10;
          }
        }
      }
    },
    trigger: {
      global: "phaseBefore",
      player: ["phaseEnd", "useCardAfter", "respondAfter", "enterGame"]
    },
    filter(event, player, name2) {
      if (name2 == "phaseEnd") {
        return game.hasPlayer((current) => current !== player && current.countMark("olsbliwen") < 5) && player.hasMark("olsbliwen");
      }
      if (player.countMark("olsbliwen") >= 5) {
        return false;
      }
      if (!["respond", "useCard"].includes(event.name)) {
        return event.name !== "phase" || game.phaseNumber === 0;
      }
      const evts = game.getAllGlobalHistory("everything", (evt) => ["useCard", "respond"].includes(evt.name) && evt.player == player && evt != event);
      if (!evts.length) {
        return false;
      }
      const {
        lastItem: { card }
      } = evts;
      return get.suit(card) == get.suit(event.card) || get.type2(card) == get.type2(event.card);
    },
    forced: true,
    locked: false,
    async content(event, trigger, player) {
      if (event.triggername == "phaseEnd") {
        const list = game.filterPlayer((current) => current !== player && current.countMark("olsbliwen") < 5);
        const num = Math.min(player.countMark("olsbliwen"), list.length);
        if (num > 0) {
          const result = await player.chooseTarget(
            "是否发动【立文】？",
            "将任意枚“贤”标记分配给等量任意其他角色",
            (card, player2, target) => {
              return target !== player2 && target.countMark("olsbliwen") < 5;
            },
            [1, num]
          ).set("ai", (target) => get.attitude(get.event().player, target) * (target.countCards("h") + 1)).forResult();
          if (result?.bool) {
            player.line(result.targets);
            player.removeMark("olsbliwen", result.targets.length);
            for (const target of result.targets.sortBySeat()) {
              target.addMark("olsbliwen", 1);
            }
          }
        }
        const targets = game.filterPlayer((target) => target.hasMark("olsbliwen")).sort((a, b) => b.countMark("olsbliwen") - a.countMark("olsbliwen"));
        if (!targets.length) {
          return;
        }
        player.line(targets);
        for (const target of targets) {
          const result = await target.chooseToUse(
            function(card) {
              const evt = _status.event;
              if (!lib.filter.cardEnabled(card, evt.player, evt)) {
                return false;
              }
              return get.position(card) == "h";
            },
            '###立文###<div class="text center">使用一张手牌，或移去所有“贤”标记并令' + get.translation(player) + "摸等量的牌</div>"
          ).set("addCount", false).forResult();
          if (!result?.bool) {
            const num2 = target.countMark("olsbliwen");
            target.clearMark("olsbliwen");
            await player.draw(num2);
          }
        }
      } else {
        player.addMark("olsbliwen", ["useCard", "respond"].includes(trigger.name) ? 1 : Math.min(3, 5 - player.countMark("olsbliwen")));
      }
    },
    intro: {
      name2: "贤",
      content: "mark"
    },
    marktext: "贤",
    ai: { threaten: 3 }
  },
  olsbzhengyi: {
    audio: 2,
    trigger: { global: "damageBegin4" },
    filter(event, player) {
      if (event.hasNature() || !event.player.hasMark("olsbliwen")) {
        return false;
      }
      return game.hasPlayer((target) => target != event.player && target.hasMark("olsbliwen"));
    },
    logTarget(event, player) {
      return game.filterPlayer((target) => target != event.player && target.hasMark("olsbliwen"));
    },
    forced: true,
    locked: false,
    async content(event, trigger, player) {
      const targets = game.filterPlayer((target) => target != trigger.player && target.hasMark("olsbliwen"));
      const choices = [];
      const map = await game.chooseAnyOL(targets, get.info(event.name).chooseBool, [trigger]).forResult();
      for (const current of targets) {
        const { bool } = map.get(current);
        if (bool) {
          choices.add(current);
        }
        current.chat(bool ? "同意" : "拒绝");
      }
      if (!choices.length) {
        trigger.player.chat("杯具");
      } else {
        trigger.cancel();
        trigger.player.chat("洗具");
        game.log(choices, "响应了", trigger.player, "的号召");
        const max = Math.max(...choices.slice().map((current) => current.getHp()));
        const target = choices.find((current) => current.getHp() == max);
        if (target) {
          await target.loseHp(trigger.num);
        }
      }
    },
    chooseBool(player, trigger, eventId) {
      return player.chooseBool().set("prompt", "是否失去" + trigger.num + "点体力，为" + get.translation(trigger.player) + "取消此次伤害？").set(
        "choice",
        (function(player2, trigger2) {
          const target = trigger2.player;
          let eff1 = get.damageEffect(target, trigger2.source, player2);
          if (trigger2.num > 1) {
            eff1 = Math.min(-1, eff1) * trigger2.num;
          }
          const eff2 = get.effect(player2, { name: "losehp" }, player2, player2) * trigger2.num;
          return eff2 > eff1;
        })(player, trigger)
      ).set("id", eventId).set("_global_waiting", true);
    },
    ai: { combo: "olsbliwen" }
  },
  //OL界吴国太
  olganlu: {
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
      if (!ui.selected.targets[0].hasCards("e") && !target.hasCards("e")) {
        return false;
      }
      const num = Math.abs(ui.selected.targets[0].countCards("e") - target.countCards("e"));
      return player.getDamagedHp() >= num || player.countDiscardableCards(player, "h") >= num;
    },
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      const { targets } = event;
      const num = Math.abs(targets[0].countCards("e") - targets[1].countCards("e"));
      if (player.getDamagedHp() < num && player.hasDiscardableCards(player, "h")) {
        await player.chooseToDiscard({ position: "h", selectCard: num, forced: true });
      }
      await targets[0].swapEquip(targets[1]);
      await game.delayx();
    }
  },
  olbuyi: {
    audio: 2,
    trigger: {
      global: "dying"
    },
    filter(event, player) {
      return event.player.hp <= 0 && event.player.countCards("he") > 0;
    },
    logTarget: "player",
    async cost(event, trigger, player) {
      const target = trigger.player;
      let check;
      if (trigger.player.isUnderControl(true, player)) {
        check = player.hasCard((card) => {
          return get.type(card) != "basic";
        }, "he");
      } else {
        check = get.attitude(player, target) > 0;
      }
      event.result = await player.choosePlayerCard(target, get.prompt(event.name.slice(0, -5), target), "he").set("ai", (button) => {
        if (!get.event().check) {
          return 0;
        }
        if (get.event().target.isUnderControl(true, get.player())) {
          if (get.type(button.link) != "basic") {
            return 10 - get.value(button.link);
          }
          return 0;
        } else {
          return Math.random();
        }
      }).set("check", check).set("filterButton", (button) => {
        if (get.player() == get.event().target) {
          return lib.filter.cardDiscardable(button.link, get.player());
        }
        return true;
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      await player.showCards(event.cards, get.translation(player) + "对" + (player == target ? "自己" : get.translation(target)) + "发动了【补益】");
      if (get.type(event.cards[0]) != "basic") {
        await target.discard(event.cards[0]);
        await target.recover();
      }
    }
  },
  //OL界刘表（袁术
  olzishou: {
    audio: 2,
    trigger: { player: "phaseDrawBegin2" },
    filter(event, player) {
      return !event.numFixed;
    },
    check(event, player) {
      return player.countCards("h") <= (player.hasSkill("olzongshi") ? player.maxHp : player.hp - 2) || player.skipList.includes("phaseUse") || !player.countCards("h", function(card) {
        return get.tag(card, "damage") && player.hasUseTarget(card);
      });
    },
    async content(event, trigger, player) {
      trigger.num += game.countGroup();
      player.when("phaseJieshuBegin").filter((evt) => evt.getParent() == trigger.getParent()).step(async () => {
        if (player.hasHistory("useCard", (evtx) => get.is.damageCard(evtx.card)) && player.countDiscardableCards(player, "he")) {
          await player.chooseToDiscard("he", game.countGroup(), true);
        }
      });
    },
    ai: { threaten: 1.5 }
  },
  olzongshi: {
    mod: {
      maxHandcard(player, num) {
        return num + game.countGroup();
      }
    },
    audio: 2,
    trigger: {
      player: "damageBegin4"
    },
    filter(event, player) {
      const source = event.source;
      if (!source || source == player || !source.isIn()) {
        return false;
      }
      return !player.getStorage("olzongshi_record").includes(source.group);
    },
    forced: true,
    logTarget: "source",
    async content(event, trigger, player) {
      const target = trigger.source;
      trigger.cancel();
      player.addSkill("olzongshi_record");
      player.markAuto("olzongshi_record", [target.group]);
      if (player.countGainableCards(target, "hej")) {
        await target.gainPlayerCard(player, "hej", true);
      }
    },
    ai: {
      filterDamage: true,
      skillTagFilter(player, tag, arg) {
        if (arg && arg.player && player.getStorage("olzongshi_record").includes(arg.player.group)) {
          return true;
        }
        return false;
      }
    },
    subSkill: {
      record: {
        charlotte: true,
        intro: {
          content: (storage, player) => `已记录势力：${get.translation(storage)}`
        }
      }
    }
  },
  //OL界李儒
  oljuece: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return game.hasPlayer((target) => target !== player && player.countCards("h") >= target.countCards("h"));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), function(card, player2, target) {
        return target !== player2 && player2.countCards("h") >= target.countCards("h");
      }).set("ai", (target) => {
        const player2 = get.player();
        return get.damageEffect(target, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      await event.targets[0].damage();
    }
  },
  olmieji: {
    audio: 2,
    inherit: "xinmieji",
    filter(event, player) {
      return player.countCards("h", { type: ["trick", "delay"] });
    },
    filterCard(card) {
      return get.type2(card) == "trick";
    },
    async content(event, trigger, player) {
      const { target, cards: cards2 } = event;
      player.$throw(cards2.length, 1e3);
      if (!target.countCards("he", (card) => lib.filter.cardDiscardable(card, target))) {
        return;
      }
      const result = await target.chooseToDiscard("he", true).set("prompt", "请弃置一张锦囊牌，或依次弃置两张牌。").forResult();
      if ((!result.cards || get.type(result.cards[0], "trick", result.cards[0].original == "h" ? target : false) != "trick") && target.countCards("he", (card) => lib.filter.cardDiscardable(card, target))) {
        await target.chooseToDiscard("he", true).set("prompt", "请弃置第二张牌");
      }
    }
  },
  //OL界蔡夫人
  olqieting: {
    audio: 2,
    trigger: {
      global: "phaseEnd"
    },
    filter(event, player) {
      const target = event.player;
      if (target == player || !target.isIn()) {
        return false;
      }
      return !target.hasHistory("sourceDamage", (evt) => evt.player != target) || !target.hasHistory("useCard", (evt) => evt.targets && evt.targets.some((i) => i != target));
    },
    async cost(event, trigger, player) {
      const target = trigger.player;
      let num = 0;
      if (!target.hasHistory("useCard", (evt) => evt.targets && evt.targets.some((i) => i != target))) {
        num += 2;
      }
      if (!target.hasHistory("sourceDamage", (evt) => evt.player != target)) {
        num += 1;
      }
      const next = player.chooseButton([
        "窃听：请选择" + (num > 1 ? "一至两" : "一") + "项",
        [
          [
            ["move", "将" + get.translation(target) + "装备区的一张牌置于你的装备区"],
            ["draw", "摸一张牌"]
          ],
          "textbutton"
        ]
      ]);
      next.set("selectButton", [1, num]);
      next.set("filterButton", (button) => {
        if (button.link == "move" && !get.event().getTrigger().player.countCards("e", (card) => {
          return get.player().canEquip(card);
        })) {
          return false;
        }
        return true;
      });
      next.set("ai", (button) => {
        const target2 = get.event().getTrigger().player, val = target2.hasSkillTag("noe") ? 6 : 0, player2 = get.player();
        if (button.link == "move" && (get.attitude(player2, target2) > 0 || !target2.countCards("e", function(card) {
          return player2.canEquip(card) && get.value(card, target2) > val && get.effect(player2, card, player2, player2) > 0;
        }))) {
          return 0;
        }
        return 1;
      });
      const { bool, links } = await next.forResult();
      event.result = {
        bool,
        cost_data: links
      };
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const target = trigger.player, choices = event.cost_data;
      if (choices.includes("move")) {
        const { cards: cards2 } = await player.choosePlayerCard(target, "e", true).set("filterButton", (button) => {
          return get.player().canEquip(button.link);
        }).set("ai", (button) => {
          const player2 = get.player();
          return get.effect(player2, button.link, player2, player2);
        }).forResult();
        const card = cards2[0];
        target.$give(card, player, false);
        await game.delay(0.5);
        await player.equip(card);
      }
      if (choices.includes("draw")) {
        await player.draw();
      }
    }
  },
  //谋庞统
  olsbhongtu: {
    audio: 6,
    trigger: {
      global: "phaseAnyEnd"
    },
    filter(event, player) {
      let count = 0;
      player.checkHistory("gain", (evt) => {
        if (evt.getParent(event.name) !== event) {
          return;
        }
        count += evt.cards.length;
      });
      return count >= 2;
    },
    derivation: ["nzry_feijun", "qianxi"],
    check(event, player) {
      if (game.hasPlayer((current) => {
        return current !== player && get.attitude(player, current) > 0;
      })) {
        return true;
      }
      const eff = get.damageEffect(player, player, player, "fire");
      if (game.hasPlayer((current) => {
        return get.damageEffect(current, player, player, "fire") > eff && player.countCards("h", (card) => {
          return !current.hasUseTarget(card);
        }) >= 2 + (player.getHp() > 1);
      })) {
        return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      await player.draw(3);
      if (player.countCards("h") < 3 || !game.hasPlayer((current) => player != current)) {
        return;
      }
      let result = await player.chooseCardTarget({
        prompt: "鸿图：请展示三张手牌并选择一名角色",
        prompt2: "你选择的角色须选择是否使用其中的一张牌，并令你随机弃置其中的另一张牌",
        position: "h",
        filterCard: true,
        selectCard: 3,
        filterTarget: lib.filter.notMe,
        forced: true,
        hasFriend: game.hasPlayer((current) => {
          return current !== player && get.attitude(player, current) > 0;
        }),
        ai1(card) {
          const player2 = get.player(), val = player2.getUseValue(card);
          if (get.event().hasFriend) {
            if (ui.selected.cards.some((cardx) => {
              return player2.getUseValue(cardx) > 5;
            })) {
              return -val - get.value(card);
            }
            return val - 5;
          }
          if (game.hasPlayer((current) => {
            return get.attitude(get.player(), current) < 0 && !current.hasUseTarget(card);
          })) {
            return 100 - val;
          }
          return -val;
        },
        ai2(target2) {
          const att = get.attitude(get.player(), target2);
          if (!ui.selected.cards.length) {
            return 0;
          }
          if (ui.selected.cards.every((card) => !target2.hasUseTarget(card))) {
            return 10 * (get.damageEffect(target2, player, player, "fire") - get.damageEffect(player, player, player, "fire"));
          }
          return Math.max(...ui.selected.cards.map((card) => target2.getUseValue(card) * att));
        }
      }).forResult();
      if (!result?.cards?.length || !result.targets?.length) {
        return;
      }
      const {
        targets: [target],
        cards: cards2
      } = result;
      player.line(target, "green");
      await player.showCards(cards2, `${get.translation(player)}对${get.translation(target)}发动了【鸿图】`);
      const numbers = cards2.map((card) => get.number(card, player)).toUniqued();
      const min = Math.min(...numbers);
      const max = Math.max(...numbers);
      result = await target.chooseButton([
        `鸿图：是否使用${get.translation(player)}展示的其中一张牌？`,
        [
          cards2.map((card) => [
            card,
            (() => {
              const num = get.number(card, player);
              if (cards2.every((cardx) => {
                return cardx === card || get.number(cardx) < num;
              })) {
                return get.translation("nzry_feijun");
              } else if (cards2.every((cardx) => {
                return cardx === card || get.number(cardx) > num;
              })) {
                return "手牌上限";
              } else if (num != min && num != max) {
                return get.translation("qianxi");
              } else {
                return "";
              }
            })()
          ]),
          (item, type, position, noclick, node) => {
            node = ui.create.buttonPresets.card(item[0], type, position, noclick);
            game.createButtonCardsetion(item[1], node);
            return node;
          }
        ]
      ]).set("filterButton", (button) => {
        const player2 = get.player(), card = button.link;
        const cardx = get.autoViewAs(
          {
            name: get.name(card),
            nature: get.nature(card)
          },
          [card]
        );
        return player2.hasUseTarget(cardx, null, false);
      }).set("ai", (button) => {
        return get.player().getUseValue(button.link);
      }).forResult();
      if (!result?.links?.length) {
        for (const current of [target, player]) {
          if (!current.isIn()) {
            continue;
          }
          player.line(current, "fire");
          await current.damage("fire");
        }
      } else {
        const {
          links: [card]
        } = result;
        cards2.remove(card);
        const cardx = get.autoViewAs(
          {
            name: get.name(card),
            nature: get.nature(card)
          },
          [card]
        );
        const next = target.chooseUseTarget(cardx, [card], true, false);
        if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) {
          next.set("viewAs", false);
        }
        await next;
        const restCards = cards2.filter((card2) => {
          return get.owner(card2) === player && get.position(card2) === "h" && lib.filter.cardDiscardable(card2, player, "olsbhongtu");
        });
        if (restCards.length) {
          await player.discard(restCards.randomGet());
        }
        const num = get.number(card, player);
        let skill = null;
        if (cards2.every((cardx2) => {
          if (cardx2 === card) {
            return true;
          }
          return get.number(cardx2) < num;
        })) {
          skill = "nzry_feijun";
        } else if (cards2.every((cardx2) => {
          if (cardx2 === card) {
            return true;
          }
          return get.number(cardx2) > num;
        })) {
          target.addSkill("olsbhongtu_limit");
          if (!target.storage.olsbhongtu_limit) {
            target.storage.olsbhongtu_limit = [0, 0];
          }
          target.storage.olsbhongtu_limit[0] += 2;
          target.markSkill("olsbhongtu_limit");
        } else if (num != min && num != max) {
          skill = "qianxi";
        }
        if (skill) {
          let skillName = `olsbhongtu_${player.playerid}`;
          await target.addAdditionalSkills(skillName, [skill], true);
          delete target.storage.olsbhongtu_phased;
          target.when({ player: "phaseBegin" }).step(async () => {
            target.storage.olsbhongtu_phased = true;
          });
          target.when({ player: "phaseEnd" }, false).filter(() => {
            return target.storage.olsbhongtu_phased;
          }).assign({
            firstDo: true,
            priority: Infinity
          }).step(async () => {
            delete target.storage.olsbhongtu_phased;
            target.removeAdditionalSkills(skillName);
          }).finish();
        }
      }
    },
    subSkill: {
      limit: {
        markimage: "image/card/handcard.png",
        intro: {
          content(storage, player) {
            return "手牌上限+" + storage[0];
          }
        },
        charlotte: true,
        mod: {
          maxHandcard(player, num) {
            return num + player.storage.olsbhongtu_limit[0];
          }
        },
        trigger: { player: "phaseEnd" },
        silent: true,
        lastDo: true,
        async content(event, trigger, player) {
          const skillName = event.name;
          player.storage[skillName] = [player.storage[skillName][1], 0];
          if (!player.storage[skillName][0]) {
            player.removeSkill(skillName);
          }
        }
      }
    }
  },
  olsbqiwu: {
    audio: 6,
    trigger: { player: "damageBegin4" },
    filter(event, player) {
      if (!event.source) {
        return false;
      }
      if (event.source !== player && !event.source.inRangeOf(player)) {
        return false;
      }
      return game.getGlobalHistory(
        "everything",
        (evt) => {
          return evt.name == "damage" && evt.player == player;
        },
        event
      ).indexOf(event) === 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard(get.prompt(event.skill), `你可以弃置一张红色牌，防止${get.translation(trigger.source)}对你造成的${trigger.num}点伤害。`, "chooseonly", { color: "red" }, "he").set("ai", (card) => {
        if (get.event().goon) {
          return 6 - get.value(card);
        }
        return 0;
      }).set("goon", get.damageEffect(player, trigger.source, player) < 0).forResult();
    },
    async content(event, trigger, player) {
      await player.discard(event.cards);
      trigger.cancel();
    }
  },
  //法正
  olxuanhuo: {
    audio: 2,
    trigger: { player: "phaseDrawEnd" },
    filter(event, player) {
      return player.countCards("he") > 1 && game.hasPlayer((target) => target != player);
    },
    async cost(event, trigger, player) {
      const ai2 = function(target) {
        const player2 = _status.event.player;
        if (!game.hasPlayer((current) => {
          return current != player2 && current != target;
        })) {
          return get.effect(target, new lib.element.VCard({ name: "shunshou_copy2" }), player2, player2);
        }
        if (get.attitude(player2, target) <= 0) {
          return 0;
        }
        let num = target.getUseValue(new lib.element.VCard({ name: "sha", isCard: true }), false);
        if (target.hasSkillTag("nogain")) {
          num /= 4;
        }
        return num;
      };
      event.result = await player.chooseCardTarget({
        prompt: get.prompt2(event.skill),
        filterCard: true,
        selectCard: 2,
        position: "he",
        filterTarget: lib.filter.notMe,
        goon: game.hasPlayer(function(current) {
          return current != player && ai2(player) > 0;
        }),
        ai1(card) {
          if (!_status.event.goon && game.countPlayer((target) => target != _status.event.player) > 1) {
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
      if (game.hasPlayer(function(current) {
        return current != player && current != target;
      })) {
        const result2 = await player.chooseTarget(
          function(card, player2, target2) {
            return target2 != player2 && target2 != _status.event.target;
          },
          "请选择" + get.translation(target) + "使用【杀】的目标",
          true
        ).set("target", target).set("ai", function(target2) {
          const evt = _status.event, card = new lib.element.VCard({ name: "sha", isCard: true });
          if (!evt.target.canUse(card, target2, false)) {
            return 0;
          }
          return get.effect(target2, card, evt.target, evt.player);
        }).set("target", target).forResult();
        if (result2.bool) {
          const target2 = result2.targets[0];
          player.line(target2);
          const result = await target.chooseToUse(
            function(card, player2, event2) {
              if (get.name(card) != "sha") {
                return false;
              }
              return lib.filter.filterCard.apply(this, arguments);
            },
            "眩惑：对" + get.translation(target2) + "使用一张【杀】，或令" + get.translation(player) + "观看并获得你的两张牌"
          ).set("filterTarget", function(card, player2, target3) {
            if (target3 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
              return false;
            }
            return lib.filter.targetEnabled.apply(this, arguments);
          }).set("targetRequired", true).set("complexTarget", true).set("complexSelect", true).set("sourcex", target2).forResult();
          if (result.bool) {
            return;
          }
        }
      }
      await player.gainPlayerCard(target, 2, "he", true, "visible");
    },
    ai: { expose: 0.15 }
  },
  olenyuan: {
    audio: 2,
    group: ["olenyuan1", "olenyuan2"]
  },
  olenyuan1: {
    inherit: "xinenyuan1",
    sourceSkill: "olenyuan"
  },
  olenyuan2: {
    inherit: "xinenyuan2",
    sourceSkill: "olenyuan",
    prompt2: (event) => "令" + get.translation(event.source) + "交给你一张红色手牌或失去1点体力",
    async content(event, trigger, player) {
      const result = await trigger.source.chooseToGive(
        "恩怨：交给" + get.translation(player) + "一张红色手牌，或失去1点体力",
        (card, player2) => {
          return get.color(card) == "red";
        },
        "h",
        player
      ).set("ai", (card) => {
        const { player: player2, target } = get.event();
        if (get.effect(player2, { name: "losehp" }, player2, player2) >= 0) {
          return 0;
        }
        if (get.attitude(target, player2) > 0) {
          return 11 - get.value(card);
        }
        return 7 - get.value(card);
      }).forResult();
      if (!result?.bool) {
        await trigger.source.loseHp();
      }
    }
  },
  //王异
  olzhenlie: {
    audio: 2,
    inherit: "zhenlie",
    async content(event, trigger, player) {
      const target = trigger.player;
      if (get.attitude(player, target) < 0 && target.countDiscardableCards(player, "he")) {
        player.addTempSkill("zhenlie_lose");
      }
      await player.loseHp();
      player.removeSkill("zhenlie_lose");
      trigger.getParent().excluded.add(player);
      if (!player.isIn()) {
        return;
      }
      const goon = target.hasCard((card) => {
        if (get.position(card) == "h") {
          return true;
        }
        return lib.filter.canBeGained(card, player, target);
      }, "he");
      if (goon || !player.hasSkill("olzhenlie_effect")) {
        let result;
        if (goon && !player.hasSkill("olzhenlie_effect")) {
          result = await player.chooseControl().set("choiceList", ["获得" + get.translation(target) + "的一张牌", "于本回合的结束阶段发动一次〖秘计〗"]).set("ai", () => {
            const player2 = get.event().player, target2 = get.event().getTrigger().player;
            return get.effect(target2, { name: "shunshou_copy2" }, player2, player2) > get.effect(player2, { name: "draw" }, player2, player2) * player2.getDamagedHp() ? 0 : 1;
          }).forResult();
        } else {
          result = { index: goon ? 0 : 1 };
        }
        if (result.index == 0) {
          await player.gainPlayerCard({ target, position: "he", forced: true });
        } else {
          player.addTempSkill("olzhenlie_effect");
          player.addMark("olzhenlie_effect", 1, false);
        }
      }
    },
    subSkill: {
      effect: {
        audio: "olzhenlie",
        charlotte: true,
        onremove: true,
        intro: { content: "本回合的结束阶段额外发动一次〖秘计〗" },
        trigger: { global: "phaseJieshuBegin" },
        filter(event, player) {
          if (player.isHealthy()) {
            return false;
          }
          return player.hasMark("olzhenlie_effect");
        },
        forced: true,
        inherit: "olmiji"
      }
    },
    derivation: "olmiji"
  },
  olmiji: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return player.isDamaged();
    },
    async content(event, trigger, player) {
      if (!player.isDamaged()) return;
      let num = player.getDamagedHp();
      await player.draw(num);
      if (player.countCards("he") && game.hasPlayer((target) => target != player)) {
        if (_status.connectMode) {
          game.broadcastAll(() => _status.noclearcountdown = true);
        }
        let given_map = [];
        while (num > 0 && player.hasCard((card) => !card.hasGaintag("olsujian_given"), "he") && game.hasPlayer((current) => current != player)) {
          const result = await player.chooseCardTarget({
            filterCard(card, player2) {
              return !card.hasGaintag("olsujian_given");
            },
            selectCard: [1, num],
            position: "he",
            filterTarget: lib.filter.notMe,
            prompt: "秘计：请选择要分配的卡牌和目标",
            prompt2: "（还可分配" + num + "张）",
            ai1(card) {
              return !ui.selected.cards.length && card.name == "du" ? 1 : 0;
            },
            ai2(target) {
              const player2 = get.event().player;
              const card = ui.selected.cards[0];
              if (card) {
                return get.value(card, target) * get.attitude(player2, target);
              }
              return 0;
            },
            allowChooseAll: true
          }).forResult();
          if (result?.cards?.length && result.targets?.length) {
            const {
              cards: cards2,
              targets: [target]
            } = result;
            num -= cards2.length;
            if (given_map.some((i) => i[0] == target)) {
              given_map[given_map.indexOf(given_map.find((i) => i[0] == target))][1].addArray(cards2);
            } else {
              given_map.push([target, cards2]);
            }
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
        if (given_map.length) {
          await game.loseAsync({
            gain_list: given_map,
            player,
            cards: given_map.slice().flatMap((list) => list[1]),
            giver: player,
            animate: "giveAuto"
          }).setContent("gaincardMultiple");
        }
      }
    }
  },
  //程普
  dclihuo: {
    audio: "relihuo",
    trigger: { player: "useCard1" },
    filter(event, player) {
      return event.card.name == "sha" && !game.hasNature(event.card, "fire");
    },
    check(event, player) {
      let card = new lib.element.VCard(get.copy(event.card));
      game.setNature(card, "fire");
      const eff1 = event.targets.reduce((sum, target) => {
        return sum + get.effect(target, event.card, player, player);
      }, 0);
      let targets = event.targets.slice();
      if (get.info("lihuo2").filter(event, player)) {
        let targetx = game.filterPlayer((target) => {
          return !targets.includes(target) && player.canUse(card, target) && get.effect(target, card, player, player) > 0;
        });
        if (targetx.length) {
          targets.add(
            targetx.sort((a, b) => {
              return get.effect(b, card, player, player) - get.effect(a, card, player, player);
            })[0]
          );
        }
      }
      const eff2 = targets.reduce((sum, target) => {
        return sum + get.effect(target, card, player, player);
      }, 0);
      return eff2 > eff1;
    },
    async content(event, trigger, player) {
      game.log(player, "将", trigger.card, "改为了火属性");
      game.setNature(trigger.card, "fire");
      player.when("useCardAfter").filter((evt) => evt == trigger).step(async (event2, trigger2, player2) => {
        if (game.hasPlayer2((target) => {
          return target.getHistory("damage", (evt) => evt.card && evt.card == trigger2.card).length;
        })) {
          const result = await player2.chooseToDiscard("he", "疠火：弃置一张牌，或失去1点体力").set("ai", (card) => {
            const player3 = get.event().player, cards2 = player3.getCards("h");
            if ((get.name(card) == "tao" || get.name(card) == "jiu") && lib.filter.cardSavable(card, player3, player3)) {
              return -1;
            }
            if (player3.hp <= 1) {
              if (cards2.length < player3.getEnemies().length && player3.hasCard((cardx) => {
                return (get.name(cardx) == "tao" || get.name(cardx) == "jiu") && lib.filter.cardSavable(cardx, player3, player3);
              }, "hs")) {
                return 7 - get.value(card);
              }
              return -1;
            }
            return 24 - 5 * cards2.length - 2 * Math.min(4, player3.getHp()) - get.value(card);
          }).forResult();
          if (!result.bool) {
            await player2.loseHp();
          }
        }
      });
    },
    ai: { fireAttack: true },
    group: "dclihuo_add",
    subSkill: {
      add: {
        inherit: "lihuo2",
        sourceSkill: "dclihuo",
        audio: "dclihuo"
      }
    }
  },
  olchunlao: {
    audio: "chunlao",
    audioname: ["xin_chengpu"],
    trigger: { global: ["loseAfter", "loseAsyncAfter"] },
    filter(event, player) {
      if (event.type != "discard" || event.getlx === false) {
        return false;
      }
      if (player.getExpansions("olchunlao").length >= 9) {
        return false;
      }
      return game.hasPlayer((target) => {
        if (![player.getPrevious(), player, player.getNext()].includes(target)) {
          return false;
        }
        return event.getl(target)?.cards2?.some((i) => i.name == "sha" && get.position(i) == "d");
      });
    },
    forced: true,
    locked: false,
    async content(event, trigger, player) {
      const cards2 = game.filterPlayer((target) => {
        if (![player.getPrevious(), player, player.getNext()].includes(target)) {
          return false;
        }
        return trigger.getl(target)?.cards2?.some((i) => i.name == "sha" && get.position(i) == "d");
      }).map((target) => {
        return trigger.getl(target).cards2.filter((i) => i.name == "sha" && get.position(i) == "d");
      }).flat().unique();
      const gain = cards2.slice(0, Math.min(cards2.length, 9 - player.getExpansions("olchunlao").length));
      if (gain.length) {
        const gainEvent = player.addToExpansion(gain, "gain2");
        gainEvent.gaintag.add("olchunlao");
        await gainEvent;
      }
    },
    ai: {
      effect: {
        player_use(card, player, target) {
          if (_status.currentPhase != player) {
            return;
          }
          if (card.name == "sha" && !player.getExpansions("olchunlao").length && target.hp > 1) {
            return "zeroplayertarget";
          }
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
    group: ["olchunlao_save"],
    subSkill: {
      save: {
        inherit: "chunlao2",
        filter(event, player) {
          const num = player.getRoundHistory("useCard", (evt) => {
            return evt.card?.name == "jiu" && evt.card?.storage?.olchunlao;
          }).length + 1;
          return event.type == "dying" && event.dying && event.dying.hp <= 0 && player.getExpansions("olchunlao").length >= num;
        },
        async content(event, trigger, player) {
          const target = event.targets[0];
          const num = player.getRoundHistory("useCard", (evt) => {
            return evt.card?.name == "jiu" && evt.card?.storage?.olchunlao;
          }).length + 1;
          const { bool, links } = await player.chooseCardButton(get.translation("olchunlao"), player.getExpansions("olchunlao"), num).forResult();
          if (bool) {
            player.logSkill("olchunlao", target);
            await player.loseToDiscardpile(links);
            event.type = "dying";
            await target.useCard({ name: "jiu", isCard: true, storage: { olchunlao: true } }, target);
          }
        },
        ai: {
          save: true,
          skillTagFilter(player) {
            const num = player.getRoundHistory("useCard", (evt) => {
              return evt.card?.name == "jiu" && evt.card?.storage?.olchunlao;
            }).length + 1;
            return player.getExpansions("olchunlao").length >= num;
          },
          order: 6,
          result: { target: 1 }
        }
      },
      gain: {
        audio: "chunlao",
        audioname: ["xin_chengpu"],
        trigger: { global: "loseHpEnd" },
        filter(event, player) {
          return player.getExpansions("olchunlao").length;
        },
        async cost(event, trigger, player) {
          const cards2 = player.getExpansions("olchunlao");
          event.result = await player.chooseButton(["###" + get.prompt("olchunlao") + "###获得至多两张“醇”？", cards2], [1, 2]).set("ai", (button) => {
            const player2 = get.event().player;
            return player2.hasSha() ? 0 : get.value(button.link);
          }).forResult();
          if (event.result.bool) {
            event.result.cards = event.result.links;
          }
        },
        async content(event, trigger, player) {
          await player.gain(event.cards, player, "give");
        }
      }
    }
  },
  //虞翻
  olzongxuan: {
    audio: 2,
    trigger: { global: ["loseAfter", "loseAsyncAfter"] },
    filter(event, player) {
      if (event.type != "discard" || event.getlx === false) {
        return false;
      }
      return get.info("olzongxuan").getCards(event, player).length;
    },
    check(event, player) {
      if (event.getParent(3).name != "phaseDiscard") {
        return false;
      }
      const cards2 = get.info("olzongxuan").getCards(event, player);
      return game.hasPlayer((target) => {
        if (cards2.some((i) => get.type(i, null, target) == "equip") && (get.attitude(player, target) > 0 || get.recoverEffect(target, player, player) > 0)) {
          return true;
        }
        if (cards2.some((i) => get.type(i, null, target) != "equip") && target.getHp() >= player.getHp() && get.effect(target, { name: "losehp" }, player, player) > 0) {
          return true;
        }
        return false;
      });
    },
    async content(event, trigger, player) {
      const { bool, moved } = await player.chooseToMove("纵玄：将任意张牌置于牌堆顶", true).set("list", [["本次弃置的牌", get.info("olzongxuan").getCards(trigger, player)], ["牌堆顶"]]).set("filterOk", (moved2) => moved2[1].length).set("processAI", (list) => {
        const player2 = get.event().player;
        const cards2 = list[0][1].slice(), cards22 = cards2.filter((card) => {
          return game.hasPlayer((target) => {
            if (get.type(card, null, target) == "equip" && (get.attitude(player2, target) > 0 || get.recoverEffect(target, player2, player2) > 0)) {
              return true;
            }
            if (get.type(card, null, target) != "equip" && target.getHp() >= player2.getHp() && get.effect(target, { name: "losehp" }, player2, player2) > 0) {
              return true;
            }
            return false;
          });
        }), cards3 = cards22.length ? cards22.randomGet() : cards2.randomGet();
        return [[], [cards3]];
      }).forResult();
      if (bool) {
        let cards2 = moved[1].slice();
        game.log(player, "将", cards2, "置于了牌堆顶");
        await game.cardsGotoPile(cards2.reverse(), "insert");
      }
    },
    getCards(event, player) {
      let cards2 = [];
      for (const target of [player, player.getPrevious()]) {
        const evt = event.getl(target);
        if (evt && evt.cards2 && evt.cards2.some((i) => get.position(i) == "d")) {
          if (target == player || target.getHistory("lose", (evt2) => {
            return evt2.type == "discard" && evt2.getlx !== false;
          }).indexOf(event) == 0) {
            cards2.addArray(evt.cards2.filter((i) => get.position(i) == "d"));
          }
        }
      }
      return cards2;
    }
  },
  olzhiyan: {
    audio: 2,
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      return event.player == player || event.player == player.getPrevious();
    },
    direct: true,
    async content(event, trigger, player) {
      const { bool, targets } = await player.chooseTarget(get.prompt2("olzhiyan")).set("ai", (target) => {
        const player2 = get.event().player, cards2 = get.event().cards;
        if (!cards2.length) {
          return 0;
        }
        const card = cards2[0], att = get.attitude(player2, target);
        if (get.type(card, null, target) == "equip" && (get.attitude(player2, target) > 0 || get.recoverEffect(target, player2, player2) > 0)) {
          return get.recoverEffect(target, player2, player2) * 20 + att / 114514;
        }
        if (get.type(card, null, target) != "equip") {
          if (target.getHp() !== player2.getHp()) {
            return get.effect(target, { name: "losehp" }, player2, player2) * 20 - att / 114514;
          }
          return get.effect(target, { name: "draw" }, player2, player2);
        }
        return 0;
      }).set("cards", Array.from(ui.cardPile.childNodes || []) || []).forResult();
      if (bool) {
        const target = targets[0];
        player.logSkill("olzhiyan", target);
        const result = (await target.draw("visible").forResult()).cards;
        if (result) {
          const card = result[0];
          if (get.type(card, null, target) == "equip") {
            if (target.getCards("h").includes(card) && target.hasUseTarget(card)) {
              const { bool: bool2 } = await target.chooseUseTarget(card, true, "nopopup").forResult();
              if (bool2) {
                await target.recover();
              }
            }
          } else if (target.getHp() !== player.getHp()) {
            await target.loseHp();
          }
        }
      }
    },
    ai: { expose: 0.2 }
  },
  //OL谋袁绍
  //真·四世三公——袁神，启动
  olsbhetao: {
    audio: 6,
    trigger: { global: "useCardToPlayered" },
    filter(event, player) {
      return event.player != player && event.isFirstTarget && event.targets.length > 1 && player.countCards("he", (card) => {
        if (get.position(card) == "h" && _status.connectMode) {
          return true;
        }
        return get.color(card) == get.color(event.card) && lib.filter.cardDiscardable(card, player);
      });
    },
    direct: true,
    async content(event, trigger, player) {
      const { bool, cards: cards2, targets } = await player.chooseCardTarget({
        prompt: get.prompt("olsbhetao"),
        filterCard(card, player2) {
          return get.color(card) == get.color(get.event().getTrigger().card) && lib.filter.cardDiscardable(card, player2);
        },
        position: "he",
        filterTarget(card, player2, target) {
          return get.event().getTrigger().targets.includes(target);
        },
        ai1(card) {
          return 7.5 - get.value(card);
        },
        ai2(target) {
          const player2 = get.event().player, trigger2 = get.event().getTrigger();
          const att = get.attitude(player2, target), eff = get.effect(target, trigger2.card, trigger2.player, player2);
          if (trigger2.card.name == "tiesuo") {
            return eff > 0 ? 0 : get.sgn(att) * (2 + get.sgn(att));
          }
          const sum = trigger2.targets.reduce((i, j) => i + get.effect(j, trigger2.card, trigger2.player, player2), 0);
          return eff * 2 - sum;
        }
      }).set("prompt2", "弃置一张" + get.translation(get.color(trigger.card)) + "牌，令" + get.translation(trigger.card) + "改为对其中一个目标结算两次").forResult();
      if (bool) {
        const target = targets[0];
        player.logSkill("olsbhetao", target);
        player.changeSkin({ characterName: "ol_sb_yuanshao" }, "ol_sb_yuanshao");
        player.discard(cards2);
        trigger.getParent().effectCount++;
        trigger.getParent().excluded.addArray(game.filterPlayer((i) => trigger.targets.includes(i) && target != i));
      }
    },
    ai: { threaten: 3.5 },
    global: "olsbhetao_ai",
    subSkill: {
      ai: {
        ai: {
          effect: {
            player_use(card, player) {
              if (typeof card != "object" || !game.hasPlayer((target) => {
                return target.hasSkill("olsbhetao") && (get.attitude(player, target) < 0 || get.attitude(target, player) < 0);
              }) || game.countPlayer((target) => {
                return player.canUse(card, target);
              }) < 2) {
                return;
              }
              const select = get.info(card).selectTarget;
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
              if (range[1] == -1 || range[1] > 1 && ui.selected.targets && ui.selected.targets.length) {
                return "zeroplayertarget";
              }
            }
          }
        }
      }
    }
  },
  olsbshenli: {
    audio: 6,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      if (!player.isPhaseUsing() || player.hasSkill("olsbshenli_used")) {
        return false;
      }
      return event.card.name == "sha" && game.hasPlayer((target) => {
        return !event.targets.includes(target) && player.canUse(event.card, target, false);
      }) && event.isFirstTarget;
    },
    check(event, player) {
      const targets = game.filterPlayer((target) => player.canUse(event.card, target, false));
      const num1 = event.targets.reduce((sum2, target) => sum2 + get.effect(target, event.card, player, player), 0);
      const num2 = targets.reduce((sum2, target) => sum2 + get.effect(target, event.card, player, player), 0);
      if (num2 >= num1) {
        return true;
      }
      let num = event.baseDamage || 1;
      if (event.extraDamage) {
        num += event.extraDamage;
      }
      let extra_num = 0;
      for (const target of targets) {
        if (target.mayHaveShan(player, "use") && !player.hasSkillTag(
          "directHit_ai",
          true,
          {
            target,
            card: event.card
          },
          true
        )) {
          if (player.hasSkillTag("jueqing", false, target)) {
            extra_num--;
          } else if (target.hasSkillTag("filterDamage", null, {
            player: event.player,
            card: event.card
          })) {
            extra_num++;
          }
        } else {
          extra_num += num;
        }
      }
      const sum = targets.length + extra_num;
      return num2 + (sum > player.countCards("h") ? Math.min(5, sum) : 0) + (sum > player.getHp() ? num2 : 0) >= num1;
    },
    async content(event, trigger, player) {
      player.changeSkin({ characterName: "ol_sb_yuanshao" }, "ol_sb_yuanshao_shadow");
      player.addTempSkill(event.name + "_used", "phaseUseAfter");
      trigger.getParent().targets.addArray(
        game.filterPlayer((target) => {
          return !trigger.targets.includes(target) && player.canUse(trigger.card, target, false);
        })
      );
      player.when("useCardAfter").filter((evt) => evt == trigger.getParent()).step(async (event2, trigger2, player2) => {
        const sum = player2.getHistory("sourceDamage", (evt) => evt.card && evt.card == trigger2.card).reduce((num, evt) => {
          return num + evt.num;
        }, 0);
        const bool = sum > player2.countCards("h"), goon = sum > player2.getHp();
        if (bool) {
          await player2.draw(Math.min(5, sum));
        }
        if (goon) {
          const targets = game.filterPlayer((target) => trigger2.targets.includes(target) && player2.canUse(trigger2.card, target, false));
          if (targets.length && (!trigger2.cards || !trigger2.cards.length || trigger2.cards.every((card) => {
            return !get.owner(card);
          }))) {
            await player2.useCard(trigger2.card, trigger2.cards, targets, false);
          }
        }
      });
    },
    ai: { threaten: 3.5 },
    subSkill: { used: { charlotte: true } }
  },
  olsbyufeng: {
    audio: 3,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    filter(event, player) {
      const card = get.cardPile("sizhaojian", "field") || game.createCard2("sizhaojian", "diamond", 6);
      return (event.name != "phase" || game.phaseNumber == 0) && player.canEquip(card, true);
    },
    forced: true,
    locked: false,
    async content(event, trigger, player) {
      if (lib.card.sizhaojian.inShanShanFestival()) {
        game.broadcastAll(() => lib.inpile.add("sizhaojian"));
      }
      const card = get.cardPile("sizhaojian", "field") || game.createCard2("sizhaojian", "diamond", 6);
      if (get.owner(card)) {
        get.owner(card).$give(card, player, false);
      } else {
        player.$gain2(card, false);
        await game.delayx();
      }
      player.equip(card);
    },
    subSkill: {
      block: {
        mod: {
          cardEnabled(card, player) {
            if (!player.storage.olsbyufeng_block) {
              return;
            }
            const storage = player.getStorage("olsbyufeng_block");
            let evt = get.event();
            if (evt.name != "chooseToUse") {
              evt = evt.getParent("chooseToUse");
            }
            if (!evt || !evt.respondTo || !storage.some((i) => i.cardid == evt.respondTo[1].cardid)) {
              return;
            }
            const num = get.number(card);
            if (num != "unsure" && typeof num == "number" && num < get.number(evt.respondTo[1])) {
              return false;
            }
          }
        },
        onremove(player) {
          delete player.storage.olsbyufeng_block;
        },
        charlotte: true,
        trigger: {
          player: ["damageBefore", "damageCancelled", "damageZero"],
          target: ["shaMiss", "useCardToExcluded", "useCardToEnd"],
          global: ["useCardEnd"]
        },
        filter(event, player) {
          const evt = event.getParent("useCard", true, true);
          if (evt && evt.effectedCount < evt.effectCount) {
            return false;
          }
          if (!event.card || !player.storage.olsbyufeng_block) {
            return false;
          }
          return player.getStorage("olsbyufeng_block").includes(event.card);
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          player.unmarkAuto(event.name, [trigger.card]);
          if (!player.getStorage(event.name).length) {
            player.removeSkill(event.name);
          }
        }
      }
    }
  },
  sizhaojian_skill: {
    equipSkill: true,
    mod: {
      aiOrder(player, card, num) {
        if (card.name == "sha" && typeof get.number(card) == "number") {
          return num + get.number(card) / 114514;
        }
      }
    },
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return event.card.name == "sha" && typeof get.number(event.card) == "number";
    },
    forced: true,
    locked: false,
    logTarget: "target",
    async content(event, trigger, player) {
      const target = trigger.target;
      target.addTempSkill("olsbyufeng_block");
      target.markAuto("olsbyufeng_block", [trigger.card]);
    }
  },
  olsbshishou: {
    audio: 6,
    trigger: {
      global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    filter(event, player) {
      if (player.getEquip(1)) {
        return false;
      }
      const card = get.cardPile("sizhaojian", "field") || game.createCard2("sizhaojian", "diamond", 6);
      if (!player.canEquip(card, true)) {
        return false;
      }
      return game.hasPlayer((target) => {
        if (target == player || target.group != "qun") {
          return false;
        }
        const evt = event.getl(target);
        return evt && evt.player == target && evt.es && evt.es.length > 0;
      });
    },
    direct: true,
    zhuSkill: true,
    async content(event, trigger, player) {
      const targets = game.filterPlayer((target) => {
        if (target == player || target.group != "qun") {
          return false;
        }
        const evt = trigger.getl(target);
        return evt && evt.player == target && evt.es && evt.es.length > 0;
      }).sortBySeat();
      const card = get.cardPile("sizhaojian", "field") || game.createCard2("sizhaojian", "diamond", 6);
      for (const target of targets) {
        const { bool } = await target.chooseBool(get.prompt("olsbshishou", player), "将" + get.translation(card) + "置入" + get.translation(player) + "的装备区中").set("choice", get.attitude(target, player) > 0).forResult();
        if (bool) {
          target.logSkill("olsbshishou", player);
          if (get.owner(card)) {
            get.owner(card).$give(card, player, false);
          } else {
            player.$gain2(card, false);
            await game.delayx();
          }
          player.equip(card);
          break;
        }
      }
    }
  },
  //界高顺
  olxianzhen: {
    audio: "rexianzhen",
    inherit: "xianzhen",
    async content(event, trigger, player) {
      const target = event.target;
      const { bool } = await player.chooseToCompare(target).forResult();
      if (bool) {
        player.markAuto("olxianzhen_effect", [target]);
        player.addTempSkill("olxianzhen_effect");
      } else {
        player.markAuto("olxianzhen_buff", [target]);
        player.addTempSkill("olxianzhen_buff");
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        audio: "rexianzhen",
        mod: {
          targetInRange(card, player, target) {
            if (player.getStorage("olxianzhen_effect").includes(target)) {
              return true;
            }
          },
          cardUsableTarget(card, player, target) {
            if (player.getStorage("olxianzhen_effect").includes(target)) {
              return true;
            }
          }
        },
        trigger: { player: "useCard2" },
        filter(event, player) {
          if (event.card.name != "sha" && get.type(event.card) != "trick") {
            return false;
          }
          if (!Array.isArray(event.targets)) {
            return false;
          }
          return game.hasPlayer((target) => {
            if (!player.getStorage("olxianzhen_effect").includes(target)) {
              return false;
            }
            return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target);
          });
        },
        async cost(event, trigger, player) {
          const targets = game.filterPlayer((target) => {
            if (!player.getStorage("olxianzhen_effect").includes(target)) {
              return false;
            }
            return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target);
          });
          if (targets.length == 1) {
            const target = targets[0];
            const { bool } = await player.chooseBool(get.prompt(event.skill, target), "令" + get.translation(target) + "也成为" + get.translation(trigger.card) + "的目标").forResult();
            event.result = { bool, targets };
          } else {
            event.result = await player.chooseTarget(get.prompt(event.skill), "令任意名【陷阵】拼点成功的目标角色也成为" + get.translation(trigger.card) + "的目标", (card, player2, target) => {
              const trigger2 = get.event().getTrigger();
              if (!player2.getStorage("olxianzhen_effect").includes(target)) {
                return false;
              }
              return !trigger2.targets.includes(target) && lib.filter.targetEnabled2(trigger2.card, player2, target);
            }).set("ai", (target) => {
              const player2 = get.event().player, trigger2 = get.event().getTrigger();
              return get.effect(target, trigger2.card, player2, player2);
            }).forResult();
          }
        },
        async content(event, trigger, player) {
          trigger.targets.addArray(event.targets);
          game.log(event.targets, "成为了", trigger.card, "的额外目标");
        },
        ai: {
          unequip: true,
          skillTagFilter(player, tag, arg) {
            if (!arg || !arg.target || !player.getStorage("olxianzhen_effect").includes(arg.target)) {
              return false;
            }
          },
          effect: {
            player_use(card, player, target, current, isLink) {
              if (isLink || !target || player._olxianzhen_effect_temp) {
                return;
              }
              if (!player.getStorage("olxianzhen_effect").includes(target) && ["sha", "guohe", "shunshou", "huogong", "juedou"].includes(card.name)) {
                player._olxianzhen_effect_temp = true;
                let eff = get.effect(target, card, player, player);
                delete player._olxianzhen_effect_temp;
                if (eff > 0) {
                  return [1, 2];
                }
              }
            }
          }
        }
      },
      buff: {
        charlotte: true,
        onremove: true,
        mod: {
          playerEnabled(card, player, target) {
            if (get.name(card, player) == "sha" && player.getStorage("olxianzhen_buff").includes(target)) {
              return false;
            }
          },
          ignoredHandcard(card, player) {
            if (get.name(card, player) == "sha") {
              return true;
            }
          },
          cardDiscardable(card, player, name2) {
            if (name2 == "phaseDiscard" && get.name(card, player) == "sha") {
              return false;
            }
          }
        }
      }
    }
  },
  //新OL谋关羽
  olsbweilin: {
    audio: 2,
    enable: "chooseToUse",
    filter(event, player) {
      return get.inpileVCardList((info) => {
        const name2 = info[2];
        if (name2 != "sha" && name2 != "jiu") {
          return false;
        }
        return get.type(name2) == "basic";
      }).some((card) => player.hasCard((cardx) => event.filterCard({ name: card[2], nature: card[3], cards: [cardx] }, player, event), "hes"));
    },
    usable: 1,
    chooseButton: {
      dialog(event, player) {
        const list = get.inpileVCardList((info) => {
          const name2 = info[2];
          if (name2 != "sha" && name2 != "jiu") {
            return false;
          }
          return get.type(name2) == "basic";
        }).filter((card) => player.hasCard((cardx) => event.filterCard({ name: card[2], nature: card[3], cards: [cardx] }, player, event), "hes"));
        return ui.create.dialog("威临", [list, "vcard"]);
      },
      filter(button, player) {
        return _status.event.getParent().filterCard(get.autoViewAs({ name: button.link[2], nature: button.link[3] }, "unsure"), player, _status.event.getParent());
      },
      check(button) {
        if (_status.event.getParent().type != "phase") {
          return 1;
        }
        const player = get.event().player, value = player.getUseValue({ name: button.link[2], nature: button.link[3] });
        if (button.link[2] == "sha" && !player.getHistory("useCard", (evt) => get.type(evt.card) == "basic").length) {
          if (value > 0) {
            return value + 20;
          }
        }
        return value;
      },
      backup(links, player) {
        return {
          audio: "olsbweilin",
          filterCard: true,
          popname: true,
          check(card) {
            const name2 = lib.skill.olsbweilin_backup.viewAs.name, color = get.color(card);
            const phase = _status.event.getParent().type == "phase";
            if (phase && name2 == "sha" && color == "red") {
              return 10 - get.value(card);
            }
            if (name2 == "tao") {
              return 7 + [-2, 0, 2][["black", "red", "none"].indexOf(color)] - get.value(card);
            }
            return 6 - get.value(card);
          },
          position: "hse",
          viewAs: { name: links[0][2], nature: links[0][3] },
          async precontent(event, trigger, player2) {
            player2.addTempSkill("olsbweilin_effect");
          },
          ai: {
            directHit_ai: true,
            skillTagFilter(player2, tag, arg) {
              if (get.event().skill != "olsbweilin_backup") {
                return false;
              }
              return arg && arg.card && arg.card.name == "sha" && get.color(arg.card) == "red";
            }
          }
        };
      },
      prompt(links, player) {
        return "将一张牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用";
      }
    },
    hiddenCard(player, name2) {
      if (!lib.inpile.includes(name2) || name2 != "jiu") {
        return false;
      }
      return get.type(name2) == "basic" && !player.getStat("skill").olsbweilin && player.countCards("hes");
    },
    ai: {
      fireAttack: true,
      respondSha: true,
      skillTagFilter(player, tag, arg) {
        if (arg == "respond") {
          return false;
        }
        if (player.getStat("skill").olsbweilin || !player.countCards("hes")) {
          return false;
        }
      },
      order(item, player) {
        if (player && _status.event.type == "phase" && player.hasValueTarget({ name: "sha" }, true, true)) {
          let max = 0, names = get.inpileVCardList((info) => {
            const name2 = info[2];
            if (name2 != "sha" && name2 != "jiu") {
              return false;
            }
            return get.type(name2) == "basic";
          });
          names = names.map((namex) => {
            return { name: namex[2], nature: namex[3] };
          });
          names.forEach((card) => {
            if (player.getUseValue(card) > 0) {
              let temp = get.order(card);
              if (card.name == "jiu") {
                let cards2 = player.getCards("hs", (cardx) => get.value(cardx) < 8);
                cards2.sort((a, b) => get.value(a) - get.value(b));
                if (!cards2.some((cardx) => get.name(cardx) == "sha" && !cards2.slice(0, 2).includes(cardx))) {
                  temp = 0;
                }
              }
              if (temp > max) {
                max = temp;
              }
            }
          });
          if (max > 0) {
            max += 15;
          }
          return max;
        }
        return 0.5;
      },
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
      effect: {
        charlotte: true,
        trigger: { player: "useCardToBegin" },
        filter(event, player) {
          return event.target?.isIn() && event.skill === "olsbweilin_backup";
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const target = trigger.target;
          target.addTempSkill("olsbweilin_wusheng");
          target.markAuto("olsbweilin_wusheng", [get.color(trigger.card)]);
        }
      },
      wusheng: {
        charlotte: true,
        onremove: true,
        mod: {
          cardname(card, player) {
            if (player.getStorage("olsbweilin_wusheng").includes(get.color(card))) {
              return "sha";
            }
          }
        },
        intro: { content: "手牌中所有$牌均视为【杀】" }
      }
    }
  },
  olsbduoshou: {
    init(player) {
      if (player.getHistory("useCard", (evt) => get.color(evt.card) == "red").length) {
        player.addTempSkill("olsbduoshou_used");
      }
    },
    mod: {
      targetInRange(card, player, target) {
        if (get.color(card) == "red" && !player.hasSkill("olsbduoshou_used")) {
          return true;
        }
      }
    },
    audio: 2,
    trigger: {
      player: "useCard",
      source: "damageSource"
    },
    filter(event, player) {
      if (event.name == "damage") {
        return player.getHistory("sourceDamage").indexOf(event) == 0;
      }
      if (get.color(event.card) == "red" && !player.hasSkill("olsbduoshou_used")) {
        return true;
      }
      return get.type(event.card) == "basic" && player.getHistory("useCard", (evt) => get.type(evt.card) == "basic").indexOf(event) == 0;
    },
    forced: true,
    async content(event, trigger, player) {
      if (trigger.name == "damage") {
        player.draw();
      } else {
        if (get.color(trigger.card) == "red" && !player.hasSkill("olsbduoshou_used")) {
          game.log(trigger.card, "无距离限制");
          player.addTempSkill("olsbduoshou_used");
        }
        if (get.type(trigger.card) == "basic" && player.getHistory("useCard", (evt) => get.type(evt.card) == "basic").indexOf(trigger) == 0) {
          game.log(trigger.card, "不计入次数上限");
          if (trigger.addCount !== false) {
            trigger.addCount = false;
            const stat = player.stat[player.stat.length - 1].card;
            if (typeof stat[trigger.card.name] === "number") {
              stat[trigger.card.name]--;
            }
          }
        }
      }
    },
    subSkill: { used: { charlotte: true } }
  },
  //OL谋太史慈
  olsbdulie: {
    audio: 2,
    trigger: { target: "useCardToTarget" },
    filter(event, player) {
      if (event.player == player || !event.isFirstTarget || event.targets.length != 1) {
        return false;
      }
      if (player.getAttackRange() <= 0) {
        return;
      }
      return ["basic", "trick"].includes(get.type(event.card));
    },
    prompt2(event, player) {
      return "令" + get.translation(event.card) + "额外结算一次，此牌结算完毕后，你摸等同于你攻击范围的牌";
    },
    check(event, player) {
      const num = Math.min(5, player.getAttackRange());
      if (get.effect(player, event.card, event.player, player) > 0) {
        return true;
      }
      if (event.card.name == "guohe" || event.card.name == "shunshou" || event.card.name == "zhujinqiyuan") {
        return num > (event.effectCount || 0);
      }
      if (!get.tag(event.card, "damage")) {
        return true;
      }
      return num > 1;
    },
    usable: 1,
    async content(event, trigger, player) {
      trigger.getParent().effectCount++;
      player.when({ global: "useCardAfter" }).filter((evt) => evt == trigger.getParent()).step(async () => {
        const num = Math.min(5, player.getAttackRange());
        if (num > 0) {
          await player.draw(num);
        }
      });
    }
  },
  olsbdouchan: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    async content(event, trigger, player) {
      const card = get.cardPile2((card2) => card2.name == "juedou");
      if (card) {
        player.gain(card, "gain2");
      } else if (player.countMark("olsbdouchan") < game.players.length + game.dead.length) {
        player.addMark("olsbdouchan", 1, false);
      }
    },
    mod: {
      attackRange(player, num) {
        return num + player.countMark("olsbdouchan");
      },
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return num + player.countMark("olsbdouchan");
        }
      }
    },
    intro: { content: "<li>攻击距离+#<br><li>使用【杀】的次数上限+#" }
  },
  //OL谋关羽
  //可以和手杀谋关羽组成卧龙凤雏了
  olsbfumeng: {
    audio: 2,
    trigger: { global: "roundStart" },
    filter(event, player) {
      return player.countCards("h", (card) => {
        if (_status.connectMode) {
          return true;
        }
        return get.name(card, player) != "sha";
      });
    },
    direct: true,
    async content(event, trigger, player) {
      const { bool, cards: cards2 } = await player.chooseCard(
        get.prompt2("olsbfumeng"),
        [1, Infinity],
        (card, player2) => {
          return get.name(card, player2) != "sha";
        },
        "allowChooseAll"
      ).set("ai", (card) => {
        const player2 = get.event().player;
        if (player2.hasSkill("olsbfumeng")) {
          return 7 - get.value(card);
        }
        return 4.5 - get.value(card);
      }).forResult();
      if (!bool) {
        return;
      }
      player.logSkill("olsbfumeng");
      player.addSkill("olsbfumeng_buff");
      player.addGaintag(cards2, "olsbfumeng_buff");
    },
    subSkill: {
      buff: {
        charlotte: true,
        mod: {
          cardname(card) {
            if (get.itemtype(card) == "card" && card.hasGaintag("olsbfumeng_buff")) {
              return "sha";
            }
          }
        }
      }
    }
  },
  olsbguidao: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      if (event.olsbguidao_num > 2) {
        return false;
      }
      const card = new lib.element.VCard({ name: "juedou", storage: { olsbguidao: true }, isCard: true });
      return game.hasPlayer((target) => {
        return player.canUse(card, target, false);
      }) && player.countCards("he", (cardx) => {
        return player.canRecast(cardx);
      }) >= 2 && player.countCards("he", (cardx) => {
        return get.name(cardx, player) == "sha" && player.canRecast(cardx);
      }) >= event.olsbguidao_num;
    },
    onChooseToUse(event) {
      if (!game.online && !event.olsbguidao_num) {
        const player = event.player, history = player.getHistory("custom", (evt) => evt.olsbguidao_num);
        if (!history.length) {
          event.set("olsbguidao_num", 1);
        } else {
          const evt = history[history.length - 1];
          event.set("olsbguidao_num", evt.olsbguidao_num);
        }
      }
    },
    filterCard(card, player) {
      const num = get.event().olsbguidao_num;
      if (ui.selected.cards.filter((cardx) => get.name(cardx, player) == "sha").length < num && get.name(card, player) != "sha") {
        return false;
      }
      return player.canRecast(card);
    },
    selectCard: 2,
    position: "he",
    check(card) {
      const player = get.event().player;
      if (get.name(card, player) == "sha") {
        return 1 / (get.value(card) || 0.5);
      }
      return 7 - get.value(card);
    },
    complexCard: true,
    lose: false,
    discard: false,
    delay: 0,
    filterTarget(card, player, target) {
      const cardx = new lib.element.VCard({ name: "juedou", storage: { olsbguidao: true }, isCard: true });
      return player.canUse(cardx, target, false);
    },
    prompt() {
      let str = "重铸两张牌";
      const num = get.event().olsbguidao_num;
      if (num > 0) {
        str += "（至少重铸" + get.cnNumber(num) + "张【杀】）";
      }
      str += "并视为使用【决斗】";
      return str;
    },
    async content(event, trigger, player) {
      const target = event.target, cards2 = event.cards;
      player.getHistory("custom").push({
        olsbguidao_num: cards2.filter((card2) => get.name(card2, player) == "sha").length + 1
      });
      const card = new lib.element.VCard({ name: "juedou", storage: { olsbguidao: true }, isCard: true });
      await player.recast(cards2);
      player.addTempSkill("olsbguidao_buff");
      if (player.canUse(card, target, false)) {
        player.useCard(card, target, false);
      }
    },
    ai: {
      order(item, player) {
        const card = new lib.element.VCard({ name: "juedou", storage: { olsbguidao: true }, isCard: true });
        const order = get.order(card, player);
        if (order <= 0) {
          return 0;
        }
        return order + 0.1;
      },
      result: {
        target(player, target) {
          const card = new lib.element.VCard({
            name: "juedou",
            storage: { olsbguidao: true },
            isCard: true
          });
          return get.sgn(get.attitude(player, target)) * get.effect(target, card, player, player);
        }
      }
    },
    subSkill: {
      buff: {
        charlotte: true,
        trigger: { global: "damageBegin3" },
        filter(event, player) {
          if (!event.card || !event.card.storage || !event.card.storage.olsbguidao) {
            return false;
          }
          if (!event.source || event.source != player) {
            return false;
          }
          const evt = event.getParent("useCard");
          return evt.player == player && evt.targets.includes(event.player);
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const target = trigger.player;
          const { control } = await target.chooseControl("【杀】更多", "非【杀】更多").set("prompt", "归刀：请猜测" + get.translation(player) + "手牌中【杀】与非【杀】牌数哪个更多").set("prompt2", "若猜错，则" + get.translation(trigger.card) + "对你造成的伤害+1").set("ai", () => _status.event.controls.randomGet()).forResult();
          const goon1 = player.countCards("h", (card) => get.name(card, player) == "sha") >= player.countCards("h", (card) => get.name(card, player) != "sha");
          const goon2 = player.countCards("h", (card) => get.name(card, player) != "sha") >= player.countCards("h", (card) => get.name(card, player) == "sha");
          if (goon1 && control == "【杀】更多" || goon2 && control == "非【杀】更多") {
            target.popup("洗具");
            game.log(target, "猜测", "#g正确");
          } else {
            target.popup("杯具");
            game.log(target, "猜测", "#y错误");
            trigger.num++;
          }
        }
      }
    }
  },
  //OL谋姜维
  olsbzhuri: {
    audio: 2,
    trigger: {
      player: "phaseAnyEnd"
    },
    filter(event, player) {
      if (!game.hasPlayer((target) => player.canCompare(target))) {
        return false;
      }
      return player.getHistory("gain", (evt) => evt.getParent(event.name) == event).length + player.getHistory("lose", (evt) => evt.getParent(event.name) == event && evt.hs.length).length;
    },
    direct: true,
    async content(event, trigger, player) {
      var result = await player.chooseTarget(get.prompt2("olsbzhuri"), (card2, player2, target2) => {
        return player2.canCompare(target2);
      }).set("ai", (target2) => {
        var player2 = _status.event.player;
        var ts = target2.getCards("h").sort((a, b) => get.number(a) - get.number(b));
        if (get.attitude(player2, target2) < 0) {
          var hs = player2.getCards("h").sort((a, b) => get.number(b) - get.number(a));
          var ts = target2.getCards("h").sort((a, b) => get.number(b) - get.number(a));
          if (get.number(hs[0]) > get.number(ts[0])) {
            return 1;
          }
          if (get.effect(player2, { name: "losehp" }, player2, player2) > 0) {
            return Math.random() + 0.2;
          }
          if (player2.getHp() > 2) {
            return Math.random() - 0.5;
          }
          return 0;
        }
        return 0;
      }).forResult();
      if (result.bool) {
        var target = result.targets[0];
        player.logSkill("olsbzhuri", target);
        var result2 = await player.chooseToCompare(target).forResult();
        if (result2.bool) {
          var cards2 = [result2.player, result2.target].filterInD("d");
          cards2 = cards2.filter((card2) => player.hasUseTarget(card2));
          if (cards2.length) {
            var result3 = await player.chooseButton(["是否使用其中的牌？", cards2]).set("ai", (button) => _status.event.player.getUseValue(button.link)).forResult();
            if (result3.bool) {
              var card = result3.links[0];
              player.$gain2(card, false);
              await game.delayx();
              await player.chooseUseTarget(true, card, false);
            }
          }
        } else {
          var list = lib.skill.olsbranji.getList(trigger);
          var result3 = await player.chooseControl("失去体力", "技能失效").set("prompt", "逐日：失去1点体力，或令此技能于本回合失效").set("ai", () => {
            var player2 = _status.event.player;
            if (player2.getHp() > 2) {
              var list2 = _status.event.list;
              list2.removeArray(player2.skipList);
              if (list2.includes("phaseDraw") || list2.includes("phaseUse")) {
                return "失去体力";
              }
            }
            if (get.effect(player2, { name: "losehp" }, player2, player2) > 0) {
              return "失去体力";
            }
            return "技能失效";
          }).set("list", list.slice(trigger.getParent().num, list.length)).forResult();
          if (result3.control == "失去体力") {
            player.loseHp(1);
          } else {
            player.addTempSkill("olsbzhuri_block");
            player.tempBanSkill("olsbzhuri");
          }
        }
      }
    },
    subSkill: {
      block: {
        charlotte: true,
        mark: true,
        marktext: '<span style="text-decoration: line-through;">日</span>',
        intro: { content: "追不动太阳了" }
      }
    }
  },
  olsbranji: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    prompt2(event, player) {
      var str = "获得技能";
      var num = lib.skill.olsbranji.getNum(player);
      if (num >= player.getHp()) {
        str += "【困奋】";
      }
      if (num == player.getHp()) {
        str += "和";
      }
      if (num <= player.getHp()) {
        str += "【诈降】";
      }
      str += "，然后";
      var num1 = player.countCards("h") - player.getHandcardLimit();
      if (num1 || player.isDamaged()) {
        if (num1) {
          str += num1 < 0 ? "摸" + get.cnNumber(-num1) + "张牌" : "弃置" + get.cnNumber(num1) + "张牌";
        }
        if (num1 && player.isDamaged()) {
          str += "或";
        }
        if (player.isDamaged()) {
          str += "回复" + player.getDamagedHp() + "点体力";
        }
        str += "，最后";
      }
      str += "你不能回复体力直到你杀死角色。";
      return str;
    },
    check(event, player) {
      var num = lib.skill.olsbranji.getNum(player);
      if (num == player.getHp()) {
        return true;
      }
      return player.getHandcardLimit() - player.countCards("h") >= 3 || player.getDamagedHp() >= 2;
    },
    limited: true,
    skillAnimation: true,
    animationColor: "fire",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      var num = lib.skill.olsbranji.getNum(player);
      const skills2 = [];
      if (num >= player.getHp()) {
        skills2.push("kunfen");
        player.storage.kunfen = true;
      }
      if (num <= player.getHp()) {
        skills2.push("zhaxiang");
      }
      player.addSkills(skills2);
      if (player.countCards("h") != player.getHandcardLimit() || player.isDamaged()) {
        var result, num1 = player.countCards("h") - player.getHandcardLimit();
        if (!num1) {
          result = { index: 1 };
        } else if (player.isHealthy()) {
          result = { index: 0 };
        } else {
          result = await player.chooseControl("手牌数", "体力值").set("choiceList", [num1 < 0 ? "摸" + get.cnNumber(-num1) + "张牌" : "弃置" + get.cnNumber(num1) + "张牌", "回复" + player.getDamagedHp() + "点体力"]).set("ai", () => {
            var player2 = _status.event.player;
            var list = _status.event.list;
            var num12 = get.effect(player2, { name: "draw" }, player2, player2);
            var num2 = get.recoverEffect(player2, player2, player2);
            return num12 * list[0] > num2 * list[1] ? 0 : 1;
          }).set("list", [-num1, player.getDamagedHp()]).forResult();
        }
        if (result.index == 0) {
          if (num1 < 0) {
            await player.drawTo(player.getHandcardLimit());
          } else {
            await player.chooseToDiscard(num1, "h", true, "allowChooseAll");
          }
        } else {
          await player.recover(player.maxHp - player.hp);
        }
      }
      player.addSkill("olsbranji_norecover");
      player.when({ source: "dieAfter" }).step(async () => player.removeSkill("olsbranji_norecover"));
    },
    derivation: ["kunfenx", "zhaxiang"],
    getList(event) {
      return event.getParent().phaseList.map((list) => list.split("|")[0]);
    },
    getNum(player) {
      return player.getHistory("useCard", (evt) => {
        return lib.phaseName.some((name2) => {
          return evt.getParent(name2).name == name2;
        });
      }).reduce((list, evt) => {
        return list.add(evt.getParent(lib.phaseName.find((name2) => evt.getParent(name2).name == name2)));
      }, []).length;
    },
    subSkill: {
      norecover: {
        audio: "olsbranji",
        charlotte: true,
        mark: true,
        intro: { content: "不能回复体力" },
        trigger: { player: "recoverBefore" },
        forced: true,
        firstDo: true,
        async content(event, trigger, player) {
          trigger.cancel();
        },
        ai: {
          effect: {
            target(card, player, target) {
              if (get.tag(card, "recover")) {
                return "zeroplayertarget";
              }
            }
          }
        }
      }
    }
  },
  kunfenx: {
    audio: "kunfen",
    audioname2: { ol_sb_jiangwei: "kunfen_ol_sb_jiangwei" }
  },
  kunfen_ol_sb_jiangwei: { audio: 1 },
  zhaxiang_ol_sb_jiangwei: { audio: 1 },
  //界曹彰
  oljiangchi: {
    audio: "rejiangchi",
    trigger: { player: "phaseDrawEnd" },
    direct: true,
    logAudio: (index) => typeof index === "number" ? "rejiangchi" + index + ".mp3" : 2,
    async content(event, trigger, player) {
      var choiceList = ["摸一张牌，本回合使用【杀】的次数上限-1，且【杀】不计入手牌上限。", "重铸一张牌，本回合使用【杀】无距离限制，且使用【杀】的次数上限+1。"], list = ["cancel2"];
      if (player.countCards("he", (card) => player.canRecast(card))) {
        list.unshift("重铸，+1");
      } else {
        choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
      }
      list.unshift("摸牌，-1");
      var result = await player.chooseControl(list).set("ai", () => {
        var player2 = _status.event.player;
        var controls = _status.event.controls.slice();
        if (controls.includes("重铸，+1") && player2.countCards("hs", (card) => get.name(card) == "sha" && player2.hasValueTarget(card)) >= 2) {
          return "重铸，+1";
        }
        return "摸牌，-1";
      }).set("choiceList", choiceList).set("prompt", get.prompt("oljiangchi")).forResult();
      if (result.control != "cancel2") {
        player.logSkill("oljiangchi", null, null, null, [result.control == "摸牌，-1" ? 1 : 2]);
        if (result.control == "摸牌，-1") {
          player.draw();
          player.addTempSkill("oljiangchi_less");
          player.addMark("oljiangchi_less", 1, false);
        } else {
          var result2 = await player.chooseCard("he", "将驰：请重铸一张牌", true, (card, player2) => player2.canRecast(card)).forResult();
          if (result2.bool) {
            player.recast(result2.cards);
            player.addTempSkill("oljiangchi_more");
            player.addMark("oljiangchi_more", 1, false);
          }
        }
      }
    },
    subSkill: {
      less: {
        charlotte: true,
        onremove: true,
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num - player.countMark("oljiangchi_less");
            }
          },
          ignoredHandcard(card, player) {
            if (card.name == "sha") {
              return true;
            }
          },
          cardDiscardable(card, player, name2) {
            if (name2 == "phaseDiscard" && card.name == "sha") {
              return false;
            }
          }
        }
      },
      more: {
        charlotte: true,
        onremove: true,
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.countMark("oljiangchi_more");
            }
          },
          targetInRange(card, player) {
            if (card.name == "sha") {
              return true;
            }
          }
        }
      }
    }
  },
  //界简雍
  olqiaoshui: {
    audio: "reqiaoshui",
    inherit: "reqiaoshui",
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      const target = event.target;
      const result = await player.chooseToCompare(target).forResult();
      if (result.bool) {
        player.addTempSkill("olqiaoshui_target", { player: "phaseUseAfter" });
      } else {
        player.addTempSkill("qiaoshui2");
        player.addTempSkill("olqiaoshui_used");
        player.tempBanSkill("olqiaoshui");
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        mark: true,
        marktext: '<span style="text-decoration: line-through;">说</span>',
        intro: { content: "被迫闭嘴" }
      },
      target: {
        audio: "olqiaoshui",
        inherit: "qiaoshui3",
        sourceSkill: "olqiaoshui"
      }
    }
  },
  //界凌统
  olxuanfeng: {
    audio: "xuanfeng",
    audioname: ["boss_lvbu3", "re_lingtong"],
    trigger: {
      player: ["loseAfter"],
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    filter(event, player) {
      const evt = event.getl(player);
      return evt && (evt.es.length || evt.cards2.length > 1) && game.hasPlayer((current) => current != player && current.countDiscardableCards(player, "he"));
    },
    getIndex: () => 2,
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "弃置一名其他角色的一张牌", (card, player2, target) => {
        if (player2 == target) {
          return false;
        }
        return target.countDiscardableCards(player2, "he");
      }).set("ai", (target) => {
        const player2 = get.event().player;
        return get.effect(target, { name: "guohe_copy2" }, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await player.discardPlayerCard(target, "he", true);
    },
    ai: {
      reverseEquip: true,
      noe: true,
      effect: {
        target(card, player, target, current) {
          if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) {
            return [1, 3];
          }
        }
      }
    }
  }
};
const translates = {
  ol_zhonghui: "OL界钟会",
  ol_zhonghui_prefix: "OL|界",
  olquanji: "权计",
  olquanji_info: "当你造成或受到1点伤害后，你可以摸一张牌，然后令当前回合角色将一张手牌置于你的武将牌上，称为“权”。你每有一张“权”，你的手牌上限便+1。",
  olzili: "自立",
  olzili_info: `觉醒技，每个准备阶段，若你“权”的数里大于等于3，你回复1点体力或摸两张牌，然后减少1点体力上限，获得${get.poptip("olpaiyi")}。`,
  olpaiyi: "排异",
  olpaiyi_info: "出牌阶段限一次，你可以移去一张“权”，指定一名角色并选择：1.其摸两张牌；2.你对其造成1点伤害。然后若其手牌数大于你，执行另一项，本阶段此技能改为限两次。",
  ol_shen_huangzhong: "OL神黄忠",
  ol_shen_huangzhong_prefix: "OL神",
  shenyu: "神御",
  shenyu_info: `出牌阶段开始时，你可视为使用一张无距离限制的【杀】，然后将${get.poptip("chixueren")}置入唯一目标角色的装备区（替换原装备）。每个结束阶段，若你本回合造成过伤害或使用过至少两张伤害牌，且${get.poptip("chixueren")}在其他角色装备区，你可将其移动至你的装备区（替换原装备），获得其和其与你之间角色各随机一张牌。`,
  huaren: "化刃",
  huaren_info: "限定技，准备阶段，你可将场上或你的一张武器牌永久移出游戏，摸等同于其攻击范围数里的牌，视为拥有其技能。",
  chixueren: "赤血刃",
  chixueren_info: "锁定技，每回合首次你的【杀】对攻击范围内最远角色造成伤害时，此伤害+1。此牌首次替换其他武器牌后，获得该武器牌的技能。",
  chixueren_skill: "赤血刃",
  chixueren_skill_info: "锁定技，每回合首次你的【杀】对攻击范围内最远角色造成伤害时，此伤害+1。此牌首次替换其他武器牌后，获得该武器牌的技能。",
  ol_sb_zhurong: "OL谋祝融",
  ol_sb_zhurong_prefix: "OL谋",
  olsbrenche: "刃掣",
  olsbrenche_info: "出牌阶段限X次，你可弃置X张牌并令至多X名其s他角色各弃置一张牌（X为本回合弃牌堆中【杀】的数量且至少为1）。每有角色因此弃置牌不为【杀】，你便摸一张牌。",
  olsbyalian: "牙镰",
  olsbyalian_info: "每阶段结束时，若你此阶段不因使用失去过【杀】，你可以视为对任意名手牌数小于等于X的角色使用一张火【杀】（X为本回合弃牌堆中【杀】的数量且至少为1）。",
  ol_liufeng: "OL界刘封",
  ol_liufeng_prefix: "OL界",
  olxiansi: "陷嗣",
  olxiansi_info: "准备阶段，你可以将至多两名角色共计至多两张牌置于你的武将牌上，称为“逆”。其他角色可以移去两张“逆”视为对你使用一张【杀】。",
  olqinling: "侵凌",
  olqinling_info: "每回合限一次，你可以弃置一张牌，视为使用一张【杀】。若此【杀】造成了伤害，你摸一张牌，否则你将你弃置的牌置为“逆”。",
  ol_bulianshi: "OL界步练师",
  ol_bulianshi_prefix: "OL界",
  olanxu: "安恤",
  olanxu_info: "出牌阶段限一次，你可以获得两名角色各一张牌。然后你展示一张牌并交给其中手牌较少的角色，若不为黑桃，你摸一张牌。",
  olzhuiyi: "追忆",
  olzhuiyi_info: "限定技，结束阶段，你可令一名其他角色摸三张牌并回复1点体力。然后你死亡时，可以对其再次发动此技能。",
  ol_quancong: "OL界全琮",
  ol_quancong_prefix: "OL界",
  olyaoming: "邀名",
  olyaoming_info: `每回合限一次，当你造成或受到伤害后，你可以选择一名角色，若其手牌数: 大于等于你，你弃置其一张牌； 小于等于你，其摸一张牌。然后其回合内，你视为拥有技能${get.poptip("olzhenshan")}。`,
  olzhenshan: "赈赡",
  olzhenshan_info: `每回合限一次，当你需要使用或打出基本牌时，你可以与手数小于你的一名角色交换手牌，视为使用或打出之，然后${get.poptip("olyaoming")}视为未发动过。`,
  ol_caoxiu: "OL界曹休",
  ol_caoxiu_prefix: "OL界",
  olqianju: "千驹",
  olqianju_info: "锁定技，你每损失1点体力，你计算与其他角色的距离便-1。若全场角色均在你的攻击范围内，你出牌阶段使用【杀】的次数+1。",
  olqingxi: "倾袭",
  olqingxi_info: "当你使用杀对目标角色造成伤害时，你可令其选择一项：1.弃置你攻击范围张牌；2.此【杀】对其伤害+1。若你的装备区有武器牌，则改为其依次执行这两项，然后弃置此牌。",
  ol_guanping: "OL界关平",
  ol_guanping_prefix: "OL界",
  oljieyong: "竭勇",
  oljieyong_info: "你可将手牌中最后一张红色牌当【杀】使用或打出",
  dm_zhangfei: "魔张飞",
  dm_zhangfei_prefix: "魔",
  olzhuohun: "灼魂",
  olzhuohun_info: "锁定技，你的回合内：你的【闪】均视为【杀】；一名角色的勾玉首次变为一个颜色后，你摸一张牌。",
  olchenshi: "瞋视",
  olchenshi_info: `锁定技，若其他角色的勾玉颜色与你：不同，你使用黑色【杀】能额外指定其为目标；相同，你对其，或其对你使用的黑色【杀】改为【决斗】。你因【杀】和【决斗】首次造成了或受到了至少3点伤害后，你回复1点体力，${get.poptip({
    id: "olzhuohun_rewrite",
    name: "修改〖灼魂〗",
    type: "character",
    info: "你的回合内：你的【闪】均视为【杀】；一名角色的勾玉首次变为一个颜色后，你将手牌摸至体力上限，并执行对应效果：绿色，其本回合摸牌改为从牌堆获得等量【杀】；黄色，其本回合非锁定技失效；红色，若无角色处于濒死状态，其失去所有体力。"
  })}并${get.poptip("olrumo")}。`,
  ol_xiahoushi: "OL界夏侯氏",
  ol_xiahoushi_prefix: "OL界",
  olqiaoshi: "樵拾",
  olqiaoshi_info: "每个结束阶段，你可以与当前回合角色各摸一张牌。然后若其与你手牌数不相等，此技能本轮失效。",
  olyanyu: "燕语",
  olyanyu_info: "出牌阶段，你可以重铸【杀】。出牌阶段结束时，若你本阶段失去过至少两张【杀】，你可以令一名男性角色摸两张牌。",
  ol_zhangliao: "OL神张辽",
  ol_zhangliao_prefix: "OL神",
  olduorui: "夺锐",
  olduorui_info: "当你于出牌阶段内对一名角色造成伤害后，你可以选择该角色武将牌上的一个技能。若如此做，你结束出牌阶段，且你令此技能于其下个回合结束之前无效。",
  olzhiti: "止啼",
  olzhiti_info: "锁定技，你攻击范围内已受伤角色的手牌上限-1。若场上已受伤的角色数：不小于1，你的手牌上限+1；不小于3，你于摸牌阶段开始时令额定摸牌数+1；不小于5，回合结束时，你废除一名角色的一个随机装备栏。",
  shen_caopi: "神曹丕",
  shen_caopi_prefix: "神",
  chuyuan: "储元",
  chuyuan_info: "一名角色受到伤害后，若你武将牌上「储」的数量小于体力上限，你可以令其摸一张牌。然后其将一张手牌置于你的武将牌上，称为「储」。",
  dengji: "登极",
  dengji_info: `觉醒技，准备阶段，若你武将牌上的「储」数不小于3，则你减1点体力上限并获得所有「储」，然后获得技能${get.poptip("tianxing")}和${get.poptip("new_rejianxiong")}。`,
  tianxing: "天行",
  tianxing_info: `觉醒技，准备阶段，若你武将牌上的「储」数不小于3，则你减1点体力上限并获得所有「储」，然后失去技能〖储元〗，选择获得以下技能中的一个：${get.poptip("rerende")}/${get.poptip("rezhiheng")}/${get.poptip("olluanji")}/${get.poptip("caopi_xingdong")}。`,
  shen_zhenji: "神甄宓",
  shen_zhenji_prefix: "神",
  shenfu: "神赋",
  shenfu_info: "回合结束时，若你的手牌数为：奇数，你可对一名其他角色造成1点雷属性伤害。若其因此进入过濒死状态，你可重复此流程（不能选择本次已选择过的角色）。偶数，你可选择一名角色，你令其摸一张牌或弃置一张手牌。若其手牌数等于体力值，你可重复此流程（不能选择本次已选择过的角色）。",
  qixian: "七弦",
  qixian_info: "锁定技，你的手牌上限视为7。",
  caopi_xingdong: "行动",
  caopi_xingdong_info: "出牌阶段限一次，你可以将一张【杀】或普通锦囊牌交给一名其他角色，然后该角色选择一项：对除你以外的角色使用此牌并在此牌结算完成后和你各摸一张牌；或跳过下回合的判定阶段和摸牌阶段。",
  shen_dianwei: "神典韦",
  shen_dianwei_prefix: "神",
  juanjia: "捐甲",
  juanjia_info: "锁定技。游戏开始时，你废除一个防具栏，然后获得一个额外的武器栏。",
  qiexie: "挈挟",
  qiexie_info: `锁定技。准备阶段，你在剩余武将牌堆中随机观看五张牌，选择其中的任意张，将其转化为${get.poptip({
    id: "qiexie_equip1",
    name: "武器牌",
    type: "character",
    info: "1.此牌不具有花色和点数，且其攻击范围等于此武将牌的体力上限。<br>2.此武器牌的技能为该武将牌上所有描述中包含“【杀】”且不具有锁定技以外的标签的技能。<br>3.此武器牌离开你的装备区时，改为放回武将牌堆。"
  })}置入你的武器栏。`,
  cuijue: "摧决",
  cuijue_info: "每回合每名角色限一次。出牌阶段，你可以弃置一张牌，然后对攻击范围内距离最远的一名其他角色造成1点伤害（没有则不选）。",
  shen_sunquan: "神孙权",
  shen_sunquan_prefix: "神",
  junk_zhangjiao: "OL神张角",
  junk_zhangjiao_prefix: "OL神",
  ol_zhangsong: "OL界张松",
  ol_zhangsong_prefix: "OL界",
  olqiangzhi: "强识",
  olqiangzhi_info: "出牌阶段开始时，你可观看并展示一名其他角色的一张手牌，然后你本阶段使用此类别的牌后可摸一张牌。",
  olxiantu: "献图",
  olxiantu_info: "其他角色出牌阶段开始时，你可以摸至多两张牌然后交给其等量牌。此阶段结束时，若其造成伤害小于你以此法交给其的牌数，你失去1点体力。",
  ol_jsrg_zhanghe: "闪张郃",
  ol_jsrg_zhanghe_prefix: "闪",
  olqiongtu: "穷途",
  olqiongtu_info: "群势力技，每回合限一次，你可视为使用一张【无懈可击】并摸一张牌，然后你须将一张非基本牌置于你的武将牌上。若你未因此放置牌，你获得武将牌上的所有牌，并变更势力为魏。",
  olxianzhu: "先著",
  olxianzhu_info: "魏势力技，出牌阶段各限一次，你可以弃置一张锦囊牌或装备牌，视为使用一张无次数限制的【杀】。若此【杀】造成伤害，你可使用本次弃置的牌。",
  ol_caojie: "OL界曹节",
  ol_caojie_prefix: "OL界",
  olshouxi: "守玺",
  olshouxi_info: "每回合限一次，当你成为伤害牌的目标后，你可弃置至少一张伤害牌，对使用者造成1点伤害。然后若此牌未对你造成伤害，你摸牌至手牌上限。",
  olhuimin: "惠民",
  olhuimin_info: "出牌阶段限一次，你可令任意手牌数小于等于体力值的角色摸一张牌，然后你的手牌上限+X至你的下个回合开始（X为这些角色中手牌数大于体力值的角色数）。",
  ol_re_xinxianying: "OL界辛宪英",
  ol_re_xinxianying_prefix: "OL界",
  olcaishi: "才识",
  olcaishi_info: "当你每轮首次使用一种类型的牌后，本轮你的手牌上限+1，若你的手牌上限不为全场最大，你可以令一名角色回复1点体力，然后本回合此技能失效。",
  olzhongjian: "忠鉴",
  olzhongjian_info: "出牌阶段限一次，你可展示一名其他角色X张手牌（X为其体力值），然后你展示一张手牌。若展示其的牌包含与你展示牌：颜色相同的牌，你摸一张牌或弃置其一张牌；牌名相同的牌，本阶段此技能改为限两次。",
  ol_sb_chengyu: "OL谋程昱",
  ol_sb_chengyu_prefix: "OL谋",
  olsbliduan: "戾断",
  olsbliduan_info: "你使用【杀】后，令你使用的下一张锦囊牌可以多指定一个目标；你使用锦囊牌后，令你使用的下一张【杀】可以多指定一个目标。",
  olsbdanchi: "胆持",
  olsbdanchi_info: "每回合限一次，与你距离1以内的角色受到伤害后，你可令受到伤害的角色选择一个类型。然后伤害来源本回合使用下一张牌后，你视为使用一张【无中生有】，若与”胆持”选择的类型不同，你可额外视为使用一张【杀】。",
  old_olsbdanchi: "胆持",
  old_olsbdanchi_info: "你每回合首次因牌造成伤害或受到伤害后，你可令此牌目标角色同时猜测，伤害来源本回合使用的下一张牌为【杀】或锦囊牌。此回合结束时，若有角色猜对，你摸两张牌；若有角色猜错，你视为使用一张【杀】。",
  ol_sb_dongzhao: "OL谋董昭",
  ol_sb_dongzhao_prefix: "OL谋",
  olsbshunji: "顺机",
  olsbshunji_info: "每轮每名角色限一次，当一名角色受到伤害后，你可摸至多两张牌，然后交给其等量张牌。若你因此失去了一个牌名的所有牌（每个牌名限一次），你对其造成1点伤害。",
  olsbyishi: "移势",
  olsbyishi_info: "出牌阶段限一次，你可保留手牌中每个花色各一张牌并展示，将其余牌置入弃牌堆，然后移动场上的一张牌。若你未因此失去手牌，直到你的下个回合开始，你不因使用而失去与移动牌花色相同的牌后，摸一张牌。",
  ol_sb_xizhicai: "OL谋戏志才",
  ol_sb_xizhicai_prefix: "OL谋",
  olsbxinchuan: "薪传",
  olsbxinchuan_info: "你使用的锦囊牌进入弃牌堆后，你可以令一名角色依次执行X次摸一张牌和X次弃置一张牌（X为本回合弃牌堆缺少的花色数），然后若其手牌数变为体力值，令其下家执行剩余流程。",
  olsbjinjin: "金烬",
  olsbjinjin_info: "你需要使用普通锦囊牌时，可以将本回合进入弃牌堆的任意张花色各不相同的牌移出游戏并失去〖金烬〗，视为使用之；然后你于下个受到过伤害的回合结束时令一名角色获得移出游戏的牌和〖金烬〗。",
  ol_jsrg_zhujun: "闪朱儁",
  ol_jsrg_zhujun_prefix: "闪",
  olfendi: "分敌",
  olfendi_info: "你使用【杀】指定唯一目标后，可以展示其至多X张手牌（X为你的体力上限）。若如此做，直到此【杀】结算结束，其只能使用或打出对应实体牌全为这些牌的牌，且此【杀】对其造成伤害后，你获得其手牌或弃牌堆中的这些牌。",
  oljuxiang: "拒降",
  oljuxiang_info: "每回合限一次，你于摸牌阶段外获得牌后，可以弃置这些牌，令当前回合角色本回合出【杀】次数+X（X为你以此法弃置的牌数）。",
  ol_jsrg_sunjian: "闪孙坚",
  ol_jsrg_sunjian_prefix: "闪",
  olpingtao: "平讨",
  olpingtao_info: "出牌阶段限一次，你可令一名其他角色选择一项：1.交给你一张牌，你本回合获得一个“讨”标记；2.你视为对其使用一张有次数限制的【杀】。你使用【杀】可弃置一枚“讨”标记并额外指定一个目标。",
  oljuelie: "绝烈",
  oljuelie_info: "你使用【杀】指定第一个目标后，可以弃置至多X张牌（X为你的体力值），然后令目标角色共弃置等量的牌；然后若你的手牌数或体力值为全场最小，此【杀】基础伤害+1。你因此【杀】杀死一名角色后，将手牌摸至体力上限。",
  dm_sunquan: "魔孙权",
  dm_sunquan_prefix: "魔",
  olquanyu: "权御",
  olquanyu_info: `锁定技，每轮开始时，你令所有角色同时选择一项其本局未选择过的“${get.poptip({
    id: "quanyu_effect",
    name: "权御",
    type: "character",
    info: "<li>白虹：伤害+1<br><li>青冥：目标+1<br><li>辟邪：无视防具<br><li>紫电：不可响应<br><li>百里：额外结算<br><li>流星：无次数"
  })}”效果，然后你摸X张牌（X为与你选择效果相同的角色数且至多为3）。你使用的指定唯一目标的【杀】附带你本轮所选的“权御”效果。`,
  oltianen: "天恩",
  oltianen_effect: "不计上限",
  oltianen_info: `锁定技，每回合各限一次，你使用牌指定唯一目标后：若本轮你与其选择的“权御”效果不同，你随机弃置其一张牌，对其发动一次${get.poptip("olquanyu")}；若与你相同，你从牌堆获得一张不计入手牌上限的【杀】。`,
  olqiangang: "乾纲",
  olqiangang_info: `出牌阶段，你可${get.poptip("rule_rumo")}，失去${get.poptip("oltianen")}，然后本局你使用指定唯一目标的【杀】均执行目标所选择过的所有“权御”效果。`,
  ol_sb_guojia: "OL谋郭嘉",
  ol_sb_guojia_prefix: "OL谋",
  olsbdinglun: "定论",
  olsbdinglun_info: `出牌阶段限一次，你可选择至多半数角色（向上取整），若这些角色的手牌数之和大于其他角色的手牌数之和，这些角色获得${get.poptip("olsbquxi")}至你下个准备阶段并摸一张牌。`,
  olsbquxi: "趋袭",
  olsbquxi_info: "出牌阶段各限一次，你的【闪】/【桃】可以当做【过河拆桥】/【顺手牵羊】使用。",
  olsbjieli: "解罹",
  olsbjieli_info: "每轮限一次，当你成为一张牌的唯一目标时，你可以选择一项：1.由你重新选择此牌的目标；2观看一名其他角色的所有手牌，获得其中与此牌花色相同的牌。",
  ol_re_yujin: "OL界于禁",
  ol_re_yujin_prefix: "OL|界",
  ol_zhenjun: "镇军",
  ol_zhenjun_info: "准备阶段，你可弃置一名角色X张牌（X为其手牌数减体力值且至少为1），然后你选择一项：1.你弃置与其中非装备牌数等量的牌：2.结束阶段，其摸与其中非装备牌数等量的牌。",
  ol_yizhong: "毅重",
  ol_yizhong_info: "锁定技，体力值大于等于你的角色对你使用的黑色【杀】无效，手牌数小于等于你的角色无法响应你使用的黑色【杀】。",
  ol_sb_xuyou: "OL谋许攸",
  ol_sb_xuyou_prefix: "OL谋",
  olsbqianfu: "迁附",
  olsbqianfu_info: "转换技，出牌阶段，阳：你可以将一张黑色牌当【过河拆桥】使用：阴：你可以将一张红色牌当【火攻】使用。结算后，你可将因此弃置的牌置于牌堆顶。",
  olsbyushi: "驭势",
  olsbyushi_info: `你造成或受到伤害后，你可令一名：有转换技的角色切换其一个转换技的状态：无转换技的角色获得出牌阶段各限一次的${get.poptip("olsbqianfu")}，直到其失去最后的手牌。每轮前X次，有转换技切换状态后，你摸一张牌（X为你的体力上限）。`,
  olsbfenchao: "焚巢",
  olsbfenchao_info: "限定技，结束阶段，你可以令一名角色获得弃牌堆中的伤害牌（不超过存活人数）且令这些牌造成伤害时改为火焰伤害。",
  ol_sb_lusu: "OL谋鲁肃",
  ol_sb_lusu_prefix: "OL谋",
  lusu_phaseZhunbei: "准备阶段",
  lusu_phaseZhunbei_info: "准备阶段",
  lusu_phaseJudge: "判定阶段",
  lusu_phaseJudge_info: "判定阶段",
  lusu_phaseDraw: "摸牌阶段",
  lusu_phaseDraw_info: "摸牌阶段",
  lusu_phaseUse: "出牌阶段",
  lusu_phaseUse_info: "出牌阶段",
  lusu_phaseDiscard: "弃牌阶段",
  lusu_phaseDiscard_info: "弃牌阶段",
  lusu_phaseJieshu: "结束阶段",
  lusu_phaseJieshu_info: "结束阶段",
  olsbduduan: "独断",
  olsbduduan_info: "回合开始时，你可以摸一张牌，跳过本回合判定、摸牌、出牌和弃牌阶段中的一个阶段（每阶段限一次），并交换其中另外两个阶段。",
  olsbyinglve: "英略",
  olsbyinglve_info: "出牌阶段各限一次，你可以令一名角色：1.失去1点体力，下个摸牌阶段摸牌数+2；2.摸两张牌，下个弃牌阶段手牌上限-2。",
  olsbmengshi: "盟势",
  olsbmengshi_info: "限定技，结束阶段，你可以选择两名其他角色并失去X点体力（X为这两名角色体力值之差且不能为0），令这两名角色交换体力值。然后直到其中一名角色死亡，每回合结束时，你摸一张牌并回复1点体力。",
  ol_sb_zhugeliang: "OL谋诸葛亮",
  ol_sb_zhugeliang_prefix: "OL谋",
  olsbzhitian: "知天",
  olsbzhitian_info: "出牌阶段，牌堆顶的七张牌对你可见。你的【火攻】结算中，你可观看并选择牌堆顶七张牌中的一张牌代替【火攻】弃牌。",
  olsbwujing: "武靖",
  olsbwujing_info: "锁定技，你的回合内，有牌不因使用而进入弃牌堆后，你使用的下一张牌无次数限制；每回合首次有不为手牌的牌进入弃牌堆后，你摸一张牌。",
  olsbzhijue: "智绝",
  olsbzhijue_info: "转换技，阳：出牌阶段，你可将牌堆顶的一张牌当【火攻】使用；阴：将一种颜色的手牌置入弃牌堆（每种颜色每回合限一次），然后可视为使用其中一张基本牌或普通锦囊牌。若你以此法未造成伤害，你令〖知天〗可见牌与观看牌数-1（至多减至1），然后你摸两张牌。",
  ol_madai: "OL界马岱",
  ol_madai_prefix: "OL界",
  olqianxi: "潜袭",
  olqianxi_info: "出牌阶段开始时，你可以展示一张牌，本回合距离为1的其他角色不能使用或打出与此牌颜色相同的手牌，且你本回合使用此牌造成的伤害+1。",
  ol_sb_yl_luzhi: "OL谋卢植",
  ol_sb_yl_luzhi_prefix: "OL谋",
  olsibing: "司兵",
  olsibing_info: "每回合限一次。①当你使用伤害牌指定唯一目标时，你可以弃置任意张红色牌令目标弃置等量红色手牌，否则不能响应该牌；②以你为目标的伤害牌结算完成后，若未对你造成伤害，你可以弃置一张黑色牌并视为使用一张【杀】。",
  olliance: "敛策",
  olliance_info: "每轮限一次，当你的手牌数变化后，若为全场最少，你可将手牌摸至体力上限，然后本回合下一次有角色造成伤害时，此伤害+1。",
  ol_guanzhang: "OL界关兴张苞",
  ol_guanzhang_prefix: "OL界",
  olfuhun: "父魂",
  olfuhun_info: `你可将两张牌当【杀】使用或打出。你使用的转化【杀】目标角色只能使用颜色相同的手牌响应；你于出牌阶段使用【杀】造成伤害后，你本回合获得${get.poptip("new_rewusheng")}和${get.poptip("olpaoxiao")}。`,
  ol_sunxiu: "OL界孙休",
  ol_sunxiu_prefix: "OL界",
  ol_sb_zhangxiu: "OL谋张绣",
  ol_sb_zhangxiu_prefix: "OL谋",
  olsbchoulie: "仇猎",
  olsbchoulie_info: "限定技，回合开始时，你可选择一名其他角色。本回合你的每个阶段开始时，你可弃置一张牌视为对其使用一张【杀】。当其成为此【杀】的目标后，其可弃置一张基本牌或武器牌令此【杀】无效。",
  olsbzhuijiao: "追剿",
  olsbzhuijiao_info: "锁定技。你使用【杀】时，若你使用的上一张牌未造成伤害，则你摸一张牌并令此【杀】伤害+1。此【杀】结算后，若仍未造成伤害，你弃置一张牌。",
  ol_sb_zhaoyun: "OL谋赵云",
  ol_sb_zhaoyun_prefix: "OL谋",
  olsbnilan: "逆澜",
  olsbnilan_info: "当你不因此技能造成伤害后，你可以选择一项：1.弃置所有手牌，若其中有【杀】，你可对一名其他角色造成1点伤害；2.摸两张牌。若如此做，你下次受到伤害后可以执行另一项。",
  olsbjueya: "绝崖",
  olsbjueya_info: "当你需要使用一张你未以此法使用过的基本牌时，若你没有手牌，你可以视为使用之。",
  ol_sb_zhangfei: "OL谋张飞",
  ol_sb_zhangfei_prefix: "OL谋",
  olsbjingxian: "敬贤",
  olsbjingxian_info: "出牌阶段每名角色限一次，你可以交给其至多两张非基本牌，然后其选择等量项：1.其与你各摸一张牌；2.令你从牌堆中获得一张【杀】。",
  olsbxieyong: "狭勇",
  olsbxieyong_info: "出牌阶段限一次，你可以选择一名其他角色，直至其下个回合结束，你处于【酒】的状态。其于此期间使用一张牌后（目标不为其自己），你可以对其使用一张无视防具的【杀】。",
  ol_liaohua: "OL界廖化",
  ol_liaohua_prefix: "OL界",
  oldangxian: "当先",
  oldangxian_info: "回合开始时，你执行一个额外的出牌阶段。此阶段开始时，你可以从牌堆或弃牌堆获得一张无距离限制的【杀】，若如此做，此阶段结束时，若你未于此阶段造成过伤害，则你对自己造成1点伤害。",
  olfuli: "伏枥",
  olfuli_info: "限定技，当你处于濒死状态时，你可将体力回复至X点，将手牌摸至X张。若你本局游戏造成的伤害数小于X，则你将武将牌翻面（X为存活势力数）。",
  ol_sb_huangyueying: "OL谋黄月英",
  ol_sb_huangyueying_prefix: "OL谋",
  olsblixian: "理贤",
  olsblixian_info: "当你受到伤害后，你可将一张牌当【无中生有】使用。当你以此法使用过三种不同牌名的锦囊牌后，此技能于你的结束阶段也可发动。",
  olsbbingcai: "并才",
  olsbbingcai_info: "每回合第一张基本牌被使用时，你可重铸一张牌。若两张牌均为伤害类或非伤害类，则此牌额外结算一次。然后若重铸的牌为锦囊牌，你为〖理贤〗添加一个牌名：【顺手牵羊】；【过河拆桥】；【铁索连环】。以上牌名均添加后，〖理贤〗于你的准备阶段也可发动。",
  old_olsblixian: "理贤",
  old_olsblixian_info: "锁定技，每个结束阶段，你获得弃牌堆中所有本回合目标包含你的锦囊牌。你以此法获得的牌仅可当作【杀】或【闪】使用。",
  ol_sb_jushou: "OL谋沮授",
  ol_sb_jushou_prefix: "OL谋",
  olsbguliang: "固粮",
  olsbguliang_info: "每回合限一次，其他角色对你使用牌时，你可令此牌对你无效，若如此做，你无法响应其对你使用的牌直到回合结束。",
  olsbxutu: "徐图",
  olsbxutu_info: "锁定技，游戏开始时，你将牌堆顶三张牌置于你的武将牌上，称为“资”。每个结束阶段，你将本回合弃牌堆的一张牌与一张“资”交换，令一名角色获得三张花色或点数相同的“资”，然后将“资”补至三张。",
  ol_lingtong: "OL界凌统",
  ol_lingtong_prefix: "OL界",
  olxuanfeng: "旋风",
  olxuanfeng_info: "当你一次性失去至少两张牌后，或失去装备区的牌后，你可以依次弃置一至两名其他角色的共计两张牌。",
  ol_jianyong: "OL界简雍",
  ol_jianyong_prefix: "OL界",
  olqiaoshui: "巧说",
  olqiaoshui_info: "出牌阶段，你可与一名其他角色拼点。若你赢，你本回合使用下一张基本牌或普通锦囊牌时，可以为此牌增加或减少一个目标；若你没赢，此技能于本回合失效且本回合你不能使用锦囊牌。",
  ol_caozhang: "OL界曹彰",
  ol_caozhang_prefix: "OL界",
  oljiangchi: "将驰",
  oljiangchi_info: "摸牌阶段结束时，你可以选择一项：①摸一张牌，本回合使用【杀】的次数上限-1，且【杀】不计入手牌上限。②重铸一张牌，本回合使用【杀】无距离限制，且使用【杀】的次数上限+1。",
  ol_sb_jiangwei: "OL谋姜维",
  ol_sb_jiangwei_prefix: "OL谋",
  olsbzhuri: "逐日",
  olsbzhuri_info: "你的阶段结束时，若你本阶段失去过手牌或得到过牌，则你可以与一名角色拼点。若你赢，你可以使用其中一张拼点牌；若你没赢，你失去1点体力或令此技能于本回合无效。",
  olsbranji: "燃己",
  olsbranji_info: `限定技，结束阶段。若你本回合使用过牌的阶段数大于等于/小于等于体力值，你可以获得技能${get.poptip("kunfenx")}/${get.poptip("zhaxiang")}（同时满足则都获得，以此法获得的〖困奋〗直接修改为非锁定技）。若如此做，你将手牌数调整至手牌上限或将体力值回复至体力上限，然后你不能回复体力直到你杀死角色。`,
  kunfenx: "困奋",
  kunfenx_info: "结束阶段开始时，你可以失去1点体力，然后摸两张牌。",
  ol_sb_guanyu: "OL谋关羽",
  ol_sb_guanyu_prefix: "OL谋",
  olsbfumeng: "赴梦",
  olsbfumeng_info: "每轮开始时，你可以令任意张手牌的牌名视为【杀】。",
  olsbguidao: "归刀",
  olsbguidao_info: "出牌阶段，你可以重铸两张牌并视为使用一张【决斗】（重铸的【杀】数须比本回合上次发动〖归刀〗重铸的【杀】数多）。目标角色受到此牌伤害时，其须猜测你手牌中牌名为【杀】的牌数量多还是牌名不为【杀】的牌数多，若其猜错，则此【决斗】对其造成的伤害+1。",
  ol_sb_taishici: "OL谋太史慈",
  ol_sb_taishici_prefix: "OL谋",
  olsbdulie: "笃烈",
  olsbdulie_info: "每回合限一次，当你成为其他角色使用基本牌或普通锦囊牌的唯一目标时，你可以令此牌额外结算一次。若如此做，此牌结算完毕后，你摸X张牌（X为你的攻击范围且至多为5）。",
  olsbdouchan: "斗缠",
  olsbdouchan_info: "锁定技，准备阶段，你从牌堆中获得一张【决斗】，若牌堆没有【决斗】，则你的攻击范围和出牌阶段使用【杀】的次数上限+1（增加次数不超过本局游戏人数）。",
  olsbweilin: "威临",
  olsbweilin_info: "每回合限一次，你可以将一张牌当作任意【杀】或【酒】使用，且目标角色本回合与此牌颜色相同的手牌均视为【杀】。",
  olsbduoshou: "夺首",
  olsbduoshou_info: "锁定技。①你每回合使用的第一张红色牌无距离限制。②你每回合使用的第一张基本牌不计入使用次数。③你每回合第一次造成伤害后，你摸一张牌。",
  ol_gaoshun: "OL界高顺",
  ol_gaoshun_prefix: "OL界",
  olxianzhen: "陷阵",
  olxianzhen_info: "出牌阶段限一次，你可以与一名角色拼点。若你赢，本回合你无视该角色的防具且对其使用牌没有次数和距离限制，且当你使用【杀】或普通锦囊牌指定目标时，可以令该角色也成为此牌的目标；若你没赢，本回合你不能对其使用【杀】且你的【杀】不计入手牌上限。",
  ol_sb_yuanshao: "OL谋袁绍",
  ol_sb_yuanshao_prefix: "OL谋",
  olsbhetao: "合讨",
  olsbhetao_info: "其他角色使用牌指定第一个目标后，若此牌指定的目标数大于1，则你可以弃置一张与此牌颜色相同的牌并令此牌改为对其中一名目标角色结算两次。",
  olsbshenli: "神离",
  olsbshenli_info: "出牌阶段限一次，当你使用【杀】指定目标后，你可以令所有可成为此牌目标的其他角色均成为此牌目标，此牌结算完毕后，若你因此牌造成的伤害值X：大于你的手牌数，你摸X张牌（至多摸五张）；大于你的体力值，你再次对所有目标角色中可以成为此牌目标的角色使用此牌。",
  olsbyufeng: "玉锋",
  olsbyufeng_block: "思召剑",
  olsbyufeng_info: `游戏开始时，你将${get.poptip("sizhaojian")}置入装备区。`,
  sizhaojian: "思召剑",
  sizhaojian_info: "当你使用有点数的【杀】指定目标后，你令目标角色只能使用无点数或点数大于等于此【杀】的【闪】响应此牌。",
  sizhaojian_append: '<span class="text" style="font-family: yuanli">【思召剑】于闪闪节（3月2日-3月15日）外离开装备区后，销毁此牌</span>',
  sizhaojian_skill: "思召剑",
  sizhaojian_skill_info: "当你使用有点数的【杀】指定目标后，你令目标角色只能使用无点数或点数大于等于此【杀】的【闪】响应此牌。",
  olsbshishou: "士首",
  olsbshishou_info: `主公技，其他群势力角色失去装备区的牌后，若你的装备区中没有武器牌，其可将${get.poptip("sizhaojian")}置入你的装备区。`,
  ol_yufan: "OL界虞翻",
  ol_yufan_prefix: "OL界",
  olzongxuan: "纵玄",
  olzongxuan_info: "当你弃置而失去牌后，或你的上家每回合因弃置首次失去牌后，你可以将位于弃牌堆的这些牌中的任意牌以任意顺序置于牌堆顶。",
  olzhiyan: "直言",
  olzhiyan_info: "你或你的上家的结束阶段，你可以令一名角色正面朝上摸一张牌，然后若此牌：为装备牌，则其使用此牌并回复1点体力；不为装备牌且其体力值不等于你，则其失去1点体力。",
  ol_chengpu: "OL界程普",
  ol_chengpu_prefix: "OL界",
  dclihuo: "疠火",
  dclihuo_info: "①你使用的非火【杀】可以改为火【杀】，若如此做，此牌结算完毕后，若此牌造成过伤害，则你弃置一张牌或失去1点体力。②你使用火【杀】可以额外指定一个目标。",
  olchunlao: "醇醪",
  olchunlao_info: "①当你或你的上下家的【杀】因弃置进入弃牌堆后，你将位于弃牌堆的这些牌称为“醇”置于武将牌上（最多为9）。②一名角色处于濒死状态时，你可以将X张“醇”置入弃牌堆，然后令其视为使用一张【酒】（X为你本轮以此法使用【酒】的次数）。",
  ol_wangyi: "OL界王异",
  ol_wangyi_prefix: "OL界",
  olzhenlie: "贞烈",
  olzhenlie_info: `当你成为其他角色使用【杀】或普通锦囊牌的目标后，你可以失去1点体力并令此牌对你无效，然后你选择一项：①获得使用者的一张牌；②于本回合的结束阶段发动一次${get.poptip("olmiji")}（每回合限一次）。`,
  olzhenlie_effect: "秘计",
  olmiji: "秘计",
  olmiji_info: "结束阶段，若你已受伤，则你可以摸X张牌，然后你可以将至多X张牌任意分配给其他角色（X为你已损失的体力值）。",
  ol_sb_pangtong: "OL谋庞统",
  ol_sb_pangtong_prefix: "OL谋",
  olsbhongtu: "鸿图",
  olsbhongtu_info: `一名角色的阶段结束时，若你于此阶段得到过至少两张牌，你可以摸三张牌，展示三张手牌，令一名其他角色选择是否使用其中一张牌并令你随机弃置其中另一张牌。若使用牌的点数于三张牌中满足以下条件，其获得如下技能或效果直到其下一个回合的回合结束：唯一最大，其获得${get.poptip("nzry_feijun")}；不为最大且不为最小，其获得${get.poptip("qianxi")}；唯一最小，其手牌上限+2。若其未以此法使用牌，你对其与你各造成1点火焰伤害。`,
  olsbqiwu: "栖梧",
  olsbqiwu_info: "当你每回合首次受到伤害时，若伤害来源为你或在你的攻击范围内，你可以弃置一张红色牌，防止此伤害。",
  ol_fazheng: "OL界法正",
  ol_fazheng_prefix: "OL界",
  olxuanhuo: "眩惑",
  olxuanhuo_info: "摸牌阶段结束时，你可以交给一名其他角色两张牌，然后其选择一项：1.对你选择的另一名其他角色使用一张【杀】，2.令你观看并获得其两张牌。",
  olenyuan: "恩怨",
  olenyuan1: "恩怨",
  olenyuan2: "恩怨",
  olenyuan_info: "①当你一次性获得一名其他角色超过一张牌后，你可以令其摸一张牌。②当你受到1点伤害后，你可以令伤害来源选择一项：1.将一张红色手牌交给你；2.失去1点体力。",
  ol_caifuren: "OL界蔡夫人",
  ol_caifuren_prefix: "OL界",
  olqieting: "窃听",
  olqieting_info: "其他角色的回合结束后，若其本回合未对其他角色造成伤害/使用过牌，你可以选择一项/至多两项：1.将其装备区的一张牌置入你的装备区；2.摸一张牌。",
  ol_liru: "OL界李儒",
  ol_liru_prefix: "OL界",
  oljuece: "绝策",
  oljuece_info: "结束阶段，你可以对一名手牌数不大于你的其他角色造成1点伤害。",
  olmieji: "灭计",
  olmieji_info: "出牌阶段限一次，你可以将一张锦囊牌置于牌堆顶，然后令一名有手牌的其他角色弃置一张锦囊牌或依次弃置两张牌。",
  ol_liubiao: "OL界刘表",
  ol_liubiao_prefix: "OL界",
  olzishou: "自守",
  olzishou_info: "摸牌阶段，你可以多摸X张牌，你以此法摸牌的结束阶段，若你本回合使用过伤害牌，你弃置X张牌（X为全场势力数）。",
  olzongshi: "宗室",
  olzongshi_info: "锁定技。①你的手牌上限+X（X为全场势力数）。②每种势力限一次，当其他角色对你造成伤害时，你防止此伤害并令其获得你区域内一张牌。",
  ol_wuguotai: "OL界吴国太",
  ol_wuguotai_prefix: "OL界",
  olganlu: "甘露",
  olganlu_info: "出牌阶段限一次，你可以交换两名角色装备区内的牌，然后若你的已损失体力值小于X，你弃置X张手牌（X为交换前两者装备区牌数之差）。",
  olbuyi: "补益",
  olbuyi_info: "一名角色进入濒死状态时，你可展示其一张牌。若此牌不为基本牌，则其弃置此牌并回复1点体力。",
  ol_sb_kongrong: "OL谋孔融",
  ol_sb_kongrong_prefix: "OL谋",
  olsbliwen: "立文",
  olsbliwen_info: (() => {
    let list = ["游戏开始时，你获得3枚“贤”标记（一名角色的“贤”标记上限为5）", "当你使用或打出牌后，若此牌与你使用或打出的上一张牌的花色或类型相同，则你获得1枚“贤”标记", "回合结束时，你依次执行：⒈你可以将任意枚“贤”标记分配给等量其他角色；⒉场上所有有“贤”标记的角色按照“贤”标记由大到小的顺序（“贤”标记数相同的角色按座次逆时针排序）依次选择是否使用一张手牌，若不选择使用，则其移去所有“贤”标记，然后你摸等量的牌"];
    return list.map((item, i) => ["①", "②", "③"][i] + item).join("。") + "。";
  })(),
  olsbzhengyi: "争义",
  olsbzhengyi_info: "当一名有“贤”标记的角色受到非属性伤害时，其以外所有有“贤”标记的角色同时选择是否取消此伤害，所有角色选择完毕后，若有角色选择是，则取消此伤害，然后选择是的角色中体力值最大的一名角色依次失去X点体力（X为伤害值）。",
  ol_zhangchunhua: "OL界张春华",
  ol_zhangchunhua_prefix: "OL界",
  oljianmie: "翦灭",
  oljianmie_info: "出牌阶段限一次，你可以选择一名其他角色，你与其同时选择一个颜色，然后弃置各自选择颜色的手牌，若你/其以此法弃置了更多手牌，则你/其视为对其/你使用一张【决斗】。",
  ol_caochong: "OL界曹冲",
  ol_caochong_prefix: "OL界",
  olchengxiang: "称象",
  olchengxiang_info: "当你受到1点伤害后，你可以亮出牌堆顶的四张牌，然后获得其中任意张点数之和不大于13的牌；若获得的牌点数之和刚好为13，下次发动〖称象〗额外亮出一张牌。",
  olrenxin: "仁心",
  olrenxin_info: "当一名其他角色进入濒死状态时，你可以翻面并弃置一张装备牌，然后令该角色回复体力至1点。",
  ol_sb_sunjian: "OL谋孙坚",
  ol_sb_sunjian_prefix: "OL谋",
  olsbhulie: "虎烈",
  olsbhulie_info: "每回合各限一次，当你使用【杀】或【决斗】指定唯一目标后，你可以令此牌伤害值基数+1。若此牌未造成伤害，你可以令目标角色视为对你使用一张【杀】。",
  olsbyipo: "毅魄",
  olsbyipo_info: "你的体力值变化后，若你体力值大于0且为你首次达到，你可以选择一名角色并选择一项：1.令其摸X张牌，然后弃置一张牌；2.令其摸一张牌，然后其弃置X张牌（X为你已损失体力值且至少为1）。",
  ol_sb_yuanshu: "OL谋袁术",
  ol_sb_yuanshu_prefix: "OL谋",
  olsbjinming: "矜名",
  olsbjinming_info: "锁定技，回合开始时，你选择一项：1.回复过1点体力；2.弃置过两张牌；3.使用过三种类型的牌；4.造成过4点伤害。然后本回合结束时你摸X张牌，若未满足选择的条件，则删除此选项（X为你最后一次发动〖矜名〗选择的选项序号）。",
  olsbxiaoshi: "枭噬",
  olsbxiaoshi_info: `出牌阶段限一次，你使用牌可以额外指定一个目标（无距离限制）。此牌结算完毕后，若此牌未造成过伤害，你失去1点体力或令其中一个目标摸X张牌（X为你最后一次发动${get.poptip("olsbjinming")}选择的选项序号）。`,
  olsbyanliang: "厌粱",
  olsbyanliang_info: "主公技，其他群势力角色的出牌阶段限一次，其可以交给你一张装备牌，视为使用一张【酒】。",
  ol_caozhi: "OL界曹植",
  ol_caozhi_prefix: "OL界",
  oljiushi: "酒诗",
  oljiushi_info: "①当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。②当你受到伤害后，若你的武将牌于受到伤害时背面向上，或当你于回合外累计因〖落英〗获取至少X张牌（X为你的体力上限）后，若你的武将牌背面向上，你可以翻面。③若你的武将牌背面向上，你使用因〖落英〗获得的牌无距离限制且不可被响应。",
  ol_sb_huaxiong: "OL谋华雄",
  ol_sb_huaxiong_prefix: "OL谋",
  olsbbojue: "搏决",
  olsbbojue_info: "出牌阶段限两次，你可以选择一名其他角色，然后同时与其选择摸一张牌或弃置一张牌，然后若你与其的手牌数之和的变化值为：0，你与其依次弃置对方一张牌；2，你与其依次视为对对方使用一张【杀】。",
  olsbyangwei: "扬威",
  olsbyangwei_info: "锁定技。当你于摸牌/弃牌阶段外摸/弃置了本回合的第二张牌后，你下一次造成/受到的伤害+1。",
  ol_sb_dongzhuo: "OL谋董卓",
  ol_sb_dongzhuo_prefix: "OL谋",
  olguanbian: "观变",
  olguanbian_info: "锁定技。①游戏开始时，你的手牌上限、其他角色计算与你的距离、你计算与其他角色的距离+X（X为游戏人数）。②首轮结束时，或当你发动〖凶逆〗或〖封赏〗后，你失去〖观变〗。",
  olxiongni: "凶逆",
  olxiongni_info: "出牌阶段开始时，你可以弃置一张牌，然后所有其他角色选择一项：1.弃置一张与此牌花色相同的牌；2.受到你的1点伤害。",
  olfengshang: "封赏",
  olfengshang_info: "出牌阶段限一次或有角色进入濒死状态时（每回合限一次），你可以将两张本回合进入弃牌堆中的本轮未以此法选择过的相同花色的牌分配给等量角色。若你未以此法获得牌，你视为使用一张不计入次数的【酒】。",
  olzhibin: "执柄",
  olzhibin_info: `主公技，锁定技。准备阶段，若其他群势力角色累计使用黑色牌的次数达到：三张，你增加1点体力上限并回复1点体力；六张，你获得${get.poptip("dcfencheng")}；九张：你获得${get.poptip("benghuai")}。`,
  ol_sb_dengai: "OL谋邓艾",
  ol_sb_dengai_prefix: "OL谋",
  olsbjigu: "积谷",
  olsbjigu_info: "锁定技。一名角色于其出牌阶段外使用的牌进入弃牌堆后，若“谷”的数量小于你的体力上限，你将其中的非♥牌置于你的武将牌上，称为“谷”。体力上限与你相同的角色的回合开始时，你可以用任意张手牌替换等量“谷”。",
  olsbjiewan: "解腕",
  olsbjiewan_info: "①每个准备阶段，你可以减少1点体力上限或移去两张“谷”，然后将一张手牌当距离限制为X的【顺手牵羊】使用（X为你的“谷”数且至少为1）。②每个结束阶段，若你的手牌数与“谷”的数量相同且你的体力上限不为全场唯一最高，你增加1点体力上限。",
  ol_sb_gongsunzan: "OL谋公孙瓒",
  ol_sb_gongsunzan_prefix: "OL谋",
  olsbjiaodi: "剿狄",
  olsbjiaodi_info: "锁定技。①你的攻击范围视为你的体力值。②当你使用【杀】指定唯一目标时，若其攻击范围：小于等于你，你令此牌造成的伤害+1，获得其一张手牌；大于等于你，你弃置其区域一张牌，选择一名角色作为此牌的额外目标。",
  olsbbaojing: "保京",
  olsbbaojing_info: "出牌阶段限一次，你可以令一名其他角色的攻击范围+1或-1（至多减至1）直到你的下个出牌阶段开始。",
  ol_guohuai: "OL界郭淮",
  ol_guohuai_prefix: "OL界",
  oljingce: "精策",
  oljingce_info: "当你于回合内首次使用某种花色的手牌时，你的手牌上限+1。一名角色的出牌阶段结束时，你可以摸X张牌（X为你本阶段内使用过的牌的类型数）。",
  ol_fuhuanghou: "OL界伏寿",
  ol_fuhuanghou_prefix: "OL界",
  olqiuyuan: "求援",
  olqiuyuan_info: "当你成为【杀】或伤害锦囊牌的目标时，你可以令另一名其他角色选择一项：1.交给你一张与此牌同类型且不同牌名的牌；2.成为此牌的额外目标。",
  ol_sb_zhangrang: "OL谋张让",
  ol_sb_zhangrang_prefix: "OL谋",
  olsblucun: "赂存",
  olsblucun_info: "①每轮每项各限一次，你可以视为使用一张未以此法使用过的有目标的基本牌或普通锦囊牌，然后目标中手牌最多的随机一名角色将一张手牌置于你的武将牌上，称为“赂”。②每个回合结束时，你随机移去一张“赂”，然后摸一张牌。",
  olsbtuisheng: "蜕生",
  olsbtuisheng_info: `限定技，准备阶段或当你进入濒死状态时，你可以重置本局${get.poptip("olsblucun")}使用过的牌名，然后你选择一项并回复1点体力：①将所有手牌置于你的武将牌上，称为“赂”；②你随机从弃牌堆中获得游戏轮数张重置前“赂存”使用牌名的牌。`,
  ol_sb_wenchou: "OL谋文丑",
  ol_sb_wenchou_prefix: "OL谋",
  olsblunzhan: "轮战",
  olsblunzhan_info: "出牌阶段，你可将任意张牌当作【决斗】使用（至多五张，且选择的转化牌数不得为你本回合发动〖轮战〗已经转化过的牌数）。若你因此对唯一目标造成了伤害，你可以摸X张牌，然后你本回合不能再对其发动此技能（X为本回合你使用牌指定其为目标的次数）。",
  olsbjuejue: "决绝",
  olsbjuejue_info: "锁定技，当你于回合内首次仅使用所有手牌指定仅一名其他角色为目标时，你令其弃置X张牌（X为本回合你使用牌指定其为目标的次数）。",
  ol_sb_jiaxu: "OL谋贾诩",
  ol_sb_jiaxu_prefix: "OL谋",
  olsbwance: "完策",
  olsbwance_info: "出牌阶段限一次，你可以选择一名有手牌的角色并选择一个单目标普通锦囊牌牌名，其依次将X张手牌当作此普通锦囊牌使用（X为游戏轮数且至多为3）。其以此法使用的牌指定目标时，你可以弃置一张牌并修改此牌的目标。",
  olsbchenzhi: "沉智",
  olsbchenzhi_info: "①你每轮受到第X次以后的伤害时，你弃置一张牌防止之（X为游戏轮数且至多为3)。②每局游戏限一次，每轮结束时，若你本轮未发动过〖沉智①〗，则你可以复原一名角色的一个限定技。",
  olsbluanchao: "乱朝",
  olsbluanchao_info: "限定技，每轮开始时，你可以令所有角色依次选择从牌堆中获得一张【杀】或【闪】。选择获得【杀】的角色本轮首次造成的伤害+1。",
  ol_jsrg_zhaoyun: "闪赵云",
  ol_jsrg_zhaoyun_prefix: "闪",
  ollonglin: "龙临",
  ollonglin_info: "其他角色于其出牌阶段内首次使用【杀】指定目标后，你可以弃置一张牌令此【杀】无效，然后其可以视为对你使用一张【决斗】，你以此法造成伤害后，其本阶段使用的下一张牌不能指定其他角色为目标。",
  olzhendan: "镇胆",
  olzhendan_info: "①你可以将一张非基本手牌当作你本轮未使用过的任意基本牌使用或打出。②当你受到伤害后或每轮结束时，你摸X张牌并令该技能本轮失效（X为本轮所有角色执行过的回合数且至多为5）。",
  ol_jsrg_liuhong: "闪刘宏",
  ol_jsrg_liuhong_prefix: "闪",
  olchaozheng: "朝争",
  olchaozheng_info: "①出牌阶段开始时，你可以与所有其他角色议事。若结果为：红色，意见为红色的角色各回复1点体力；黑色，意见为红色的其他角色各失去1点体力。然后你摸X张牌（X为此次议事意见与你相同的角色数且至多为2）。②当你参与的议事展示意见时，你的意见权重+1。",
  olshenchong: "甚宠",
  olshenchong_info: `限定技。准备阶段，你可以令一名其他角色获得${get.poptip("olrefeiyang")}和${get.poptip("jsrgbahu")}。若如此做，当你死亡时，杀死你的角色弃置所有手牌，其失去所有技能。`,
  oljulian: "聚敛",
  oljulian_info: "主公技。①其他群势力角色每回合限一次。当其不于摸牌阶段且不因〖聚敛〗摸牌后，其可以摸一张牌。②结束阶段，你可以获得所有其他群势力角色各一张手牌。",
  olrefeiyang: "飞扬",
  olrefeiyang_info: "判定阶段开始时，若你的判定区有牌，则你可以弃置两张牌，然后弃置你判定区的所有牌。",
  dm_simayi: "魔司马懿",
  dm_simayi_prefix: "魔",
  olguifu: "诡伏",
  olguifu_info: "①每轮开始时或当你的体力值变化后，你可以随机从牌堆或弃牌堆获得一张不计入手牌上限的【闪】。②本局游戏中牌或技能直接造成伤害后，你记录此牌名或技能。③每回合每种牌名限一次，你可以将因此技能获得的【闪】当做不计入次数限制的〖诡伏②〗记录过的牌名使用。",
  olmoubian: "谋变",
  olmoubian_info: `准备阶段，若你记录的牌名和技能之和大于等于3，你可以${get.poptip("rule_rumo")}，获得记录的全部技能，然后获得${get.poptip("olzhouxi")}。`,
  //olmoubian_append: `<span style="font-family:yuanli"><li>入魔：每局游戏限一次，当你满足条件后，可入魔。入魔后，每轮结束时，若本轮你未造成过伤害，你失去1点体力。</span>`,
  olzhouxi: "骤袭",
  olzhouxi_info: "①准备阶段，你从三个可造成伤害的技能中选择一个获得直到你的下回合开始。②本轮受到你伤害的角色于本轮结束时视为对你使用一张【杀】。",
  olrumo: "入魔",
  olrumo_info: "每局游戏限一次，当你满足条件后，可入魔。入魔后，每轮结束时，若本轮你未造成过伤害，你失去1点体力。",
  ol_sb_xiaoqiao: "OL谋小乔",
  ol_sb_xiaoqiao_prefix: "OL谋",
  olmiluo: "迷落",
  olmiluo_info: "出牌阶段限一次，你可展示并交给至多两名其他角色各一张牌，这些牌本轮称为“迷落”牌。每轮结束时，你可令其中一名手牌中没有/有“迷落”牌的角色失去/回复1点体力。",
  oljueyan: "绝颜",
  oljueyan_info: "每轮各限一次，当你需要使用手牌中一张普通锦囊牌或红色基本牌时，可改为展示并视为使用之；你每轮首次展示一种花色的手牌后摸一张牌。",
  ol_guohuanghou: "OL界郭皇后",
  ol_guohuanghou_prefix: "OL界",
  oljiaozhao: "矫诏",
  oljiaozhao_info: "出牌阶段限一次，你可将一张牌当本轮未有角色使用过的基本或普通锦囊牌使用。",
  oljiaozhao_lv1: "矫诏·升级lv1",
  oljiaozhao_lv1_info: "每轮限一次，你可将一张牌当任意基本牌或普通锦囊牌使用。",
  oljiaozhao_lv2: "矫诏·升级lv2",
  oljiaozhao_lv2_info: "每轮限一次，你可视为使用一张基本牌或普通锦囊。",
  oldanxin: "殚心",
  oldanxin_info: `当你受到伤害后，你可摸X张牌，然后修改${get.poptip("oljiaozhao")}（X为你修改${get.poptip("oljiaozhao")}的次数）。`,
  old_oljiaozhao: "矫诏",
  old_oljiaozhao_info: "出牌阶段限一次，你可以展示一张手牌并声明一种未以此法声明过的基本牌或普通锦囊牌，你本回合可以将展示牌当声明的牌使用（不能对自己使用）。",
  old_oljiaozhao_lv1: "矫诏·升级lv1",
  old_oljiaozhao_lv1_info: "出牌阶段限一次，你可以展示一张手牌并声明一种基本牌或普通锦囊牌，你本回合可以将展示牌当声明的牌使用（不能对自己使用）。",
  old_oljiaozhao_lv2: "矫诏·升级lv2",
  old_oljiaozhao_lv2_info: "出牌阶段限一次，你可以视为使用一张基本牌或普通锦囊牌（不能对自己使用）。",
  old_oldanxin: "殚心",
  old_oldanxin_info: `当你受到伤害后，你可以摸一张牌并升级〖矫诏〗。`,
  ol_sunluban: "OL界孙鲁班",
  ol_sunluban_prefix: "OL界",
  olzenhui: "谮毁",
  olzenhui_info: "出牌阶段各限一次，你使用【杀】或普通锦囊牌（【借刀杀人】等带有指向性目标的牌除外）指定目标时，可以令一名能成为此牌目标的角色选择一项：1.交给你一张牌并代替你成为此牌使用者（不计次数）；2.成为此牌的额外目标。",
  oljiaojin: "骄矜",
  oljiaojin_info: "你受到伤害时，可以弃置一张非伤害锦囊牌或装备牌并防止此伤害，然后获得造成伤害的牌。",
  dm_diaochan: "魔貂蝉",
  dm_diaochan_prefix: "魔",
  olhuanhuo: "幻惑",
  olhuanhuo_info: "每轮开始时，你摸两张牌，然后弃置至多两张牌并选择等量其他角色。其下回合出牌阶段获得以下效果直到其本阶段使用了两张牌：①若其有可用的手牌，其不能使用主动技能且当其需要使用牌时，其强制使用其中随机的一张牌。②其使用一张牌后随机弃一张牌。",
  olqingshi: "倾世",
  olqingshi_info: `准备阶段，你可${get.poptip("rule_rumo")}，令所有角色获得一张单目标伤害牌。其他角色使用此牌指定唯一目标时，你可弃置一张牌，重新指定牌的目标（无距离限制)。这些牌：造成伤害后，你摸一张牌；未因使用进入弃牌堆后，你获得之。（准备阶段，若这些牌均离开其手牌区，你再令所有角色获得牌。）`,
  dm_lvbu: "魔吕布",
  dm_lvbu_prefix: "魔",
  olduoqi: "夺炁",
  olduoqi_info: "锁定技。①所有角色的初始手牌称为“炁”。②一号位首个回合开始前，你执行一个不能使用延时锦囊牌的出牌阶段。③你每回合对一名角色首次造成伤害后，你从弃牌堆、牌堆、场上角色的区域内中获得其一张“炁”。",
  olduoqi_tag: "炁",
  olkuangmo: "狂魔",
  olkuangmo_info: `出牌阶段，你可以${get.poptip("rule_rumo")}并选择一名其他角色，你与其成为“狂”角色，每回合对彼此首次造成的伤害+1；杀死对方后，获得对方所有“炁”。“狂”角色死亡后，你重新指定。`,
  olgangquan: "罡拳",
  olgangquan_info: "若你使用的上一张牌为“炁”，你可以将一张装备牌当指定相邻角色为目标的火【杀】使用；否则，你可以将一张锦囊牌当【决斗】使用。",
  ol_jsrg_zhangliao: "闪张辽",
  ol_jsrg_zhangliao_prefix: "闪",
  olzhengbing: "整兵",
  olzhengbing_info: "群势力技。出牌阶段限三次。你可以重铸一张牌，若此牌为：【杀】，你的手牌上限+1；【闪】，你摸一张牌；【桃】/【酒】，你于此回合结束时执行一个出牌阶段。然后若你以此法触发过所有选项，变更势力为魏。",
  dm_caocao: "OL魔曹操",
  dm_caocao_prefix: "OL|魔",
  olbachao: "霸朝",
  olbachao_info: `出牌阶段开始时，你可以令所有其他角色同时选择是否交给你一张牌，然后你可对一名未以此法交给你非基本牌的角色造成1点伤害；若该角色为你，本阶段你使用当前手牌无距离次数限制并${get.poptip("rule_rumo")}。`,
  olfuzai: "覆载",
  olfuzai_info: "锁定技，①你的装备牌只能当【借刀杀人】或【无中生有】使用。②若你的装备区没有牌，你视为装备着随机武器和防具各一件（优先装备攻击距离/牌名字数与你的体力值相同的武器/防具）。"
};
const characterTitles = {
  //ol_zhonghui: "",
  ol_shen_huangzhong: "血刃斩穹",
  ol_sb_zhurong: "见放崇山",
  ol_bulianshi: "无冕之后",
  //ol_liufeng: "",
  ol_quancong: "其时声明",
  ol_caoxiu: "千里骐骥",
  ol_guanping: "威灵显化",
  dm_zhangfei: "祭命的战神",
  ol_xiahoushi: "疾冲之恋",
  shen_sunquan: "坐断东南",
  shen_dianwei: "襢裼暴虎",
  ol_shen_dianwei: "襢裼暴虎",
  ol_shen_zhangjiao: "驭道震泽",
  junk_zhangjiao: "驭道震泽",
  ol_zhangliao: "散敌擒孙",
  shen_caopi: "诰天仰颂",
  shen_zhenji: "洛水凌波",
  ol_zhangsong: "跻路踌躇",
  ol_jsrg_zhanghe: "微子去殷",
  ol_caojie: "明殿掷玺",
  ol_re_xinxianying: "识人读心",
  ol_sb_dongzhao: "天阶登志",
  ol_sb_chengyu: "岁聿责谋",
  ol_sb_yl_luzhi: "人之望",
  //ol_sunxiu: "弥殇的景君", //暂无称号，先取别的称号顶替一下
  //ol_sb_zhaoyun: "七进七出", //暂无称号，先取别的称号顶替一下
  //ol_sb_zhangfei: "义付桃园", //暂无称号，先取别的称号顶替一下
  //ol_sb_jushou: "忠不逢时", //暂无称号，先取别的称号顶替一下
  //ol_re_yujin: "",
  dm_sunquan: "隳堕的英谋",
  dm_caocao: "逆溯的帝魔",
  ol_jsrg_zhujun: "征无遗虑",
  ol_jsrg_sunjian: "拔定烈志",
  ol_sb_xizhicai: "薪火相传",
  ol_sb_guojia: "纵才扬军",
  ol_re_yujin: "治法御人",
  ol_sb_xuyou: "帷幄擎炬",
  ol_sb_lusu: "渊谟肇石城",
  ol_sb_zhugeliang: "武侯",
  ol_madai: "临危受命",
  ol_guanzhang: "父魂子魄",
  ol_sb_zhangxiu: "枪啸风吟",
  ol_liaohua: "果敢刚直",
  ol_sb_huangyueying: "才惠双绝",
  ol_lingtong: "豪情烈胆",
  ol_jianyong: "悠游风议",
  ol_caozhang: "黄须儿",
  ol_sb_jiangwei: "炎志灼心",
  ol_sb_guanyu: "威震华夏",
  ol_sb_taishici: "矢志全忠孝",
  ol_gaoshun: "攻无不克",
  ol_sb_yuanshao: "席卷八荒",
  ol_yufan: "狂直之士",
  ol_chengpu: "三朝虎臣",
  ol_wangyi: "翳月之夷光",
  ol_sb_pangtong: "定鼎巴蜀",
  ol_fazheng: "蜀汉的辅翼",
  ol_caifuren: "襄江的蒲苇",
  ol_liru: "魔仕",
  ol_liubiao: "儁才秀拔",
  ol_wuguotai: "武烈皇后",
  ol_sb_kongrong: "豪气贯长虹",
  ol_zhangchunhua: "翦草除根",
  ol_caochong: "仁爱的神童",
  ol_sb_sunjian: "乌程侯",
  ol_sb_yuanshu: "画脂镂冰",
  ol_caozhi: "酒虎诗龙",
  ol_sb_huaxiong: "汜水关死神",
  ol_sb_dongzhuo: "翦覆四海",
  ol_sb_dengai: "曜威奋武",
  ol_sb_gongsunzan: "辽海龙吟",
  ol_guohuai: "垂问秦雍",
  ol_fuhuanghou: "巾帼拚生",
  ol_sb_zhangrang: "侵威乱天常",
  ol_sb_wenchou: "万夫之勇",
  ol_sb_jiaxu: "计深似海",
  //暂无称号，先取别的称号顶替一下
  ol_jsrg_zhaoyun: "北伐之柱",
  ol_jsrg_liuhong: "轧庭焚礼",
  ol_jsrg_zhangliao: "利刃风骑",
  dm_simayi: "无天的魔狼",
  ol_sb_xiaoqiao: "醉月迷花",
  ol_guohuanghou: "月华驱霾",
  ol_sunluban: "为虎作伥",
  dm_diaochan: "倾世的魅影",
  dm_lvbu: "荡宇的捷拳",
  junk_lidian: "离狐太守",
  ol_le_liushan: "寡人祭之",
  you_zhugeliang: "谢邀草庐",
  bigsb_dengai: "谋谋凿巅"
};
const characterIntro = {};
const characterFilters = {};
const dynamicTranslates = {
  olzhuohun(player, skill) {
    const bool = player.storage[skill];
    if (bool) {
      return `你的回合内：你的【闪】均视为【杀】；一名角色的勾玉首次变为一个颜色后，你将手牌摸至体力上限，并执行对应效果：绿色，其本回合摸牌改为从牌堆获得等量【杀】；黄色，其本回合非锁定技失效；红色，若无角色处于濒死状态，其失去所有体力。`;
    }
    return lib.translate[skill + "_info"];
  },
  olsblixian(player) {
    let names = player.getStorage("olsblixian_names").map((name2, i, arr) => `${i == arr.length - 1 ? "或" : "、"}【${get.translation(name2)}】`).join("") || "";
    let triggers = player.getStorage("olsblixian_triggers").map((i) => get.translation(i)).join("、") + "或";
    if (triggers.length < 2) {
      triggers = "";
    }
    return `${triggers}当你受到伤害后，你可将一张牌当【无中生有】${names}使用。当你以此法使用过三种不同牌名的锦囊牌后，此技能于你的结束阶段也可发动。`;
  },
  olsbqianfu(player) {
    const bool = player.storage.olsbqianfu;
    let yang = "你可以将一张黑色牌当【过河拆桥】使用", yin = "你可以将一张红色牌当【火攻】使用";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = `转换技，出牌阶段${player.hasSkill("olsbqianfu_remove") ? "各限一次" : ""}，`, end = "。结算后，你可将因此弃置的牌置于牌堆顶。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  olsbzhijue(player) {
    const bool = player.storage.olsbzhijue;
    let yang = "出牌阶段，你可将牌堆顶的一张牌当【火攻】使用", yin = "将一种颜色的手牌置入弃牌堆（每种颜色每回合限一次），然后可视为使用其中一张基本牌或普通锦囊牌";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技，", end = "。若你以此法未造成伤害，你令〖知天〗可见牌与观看牌数-1（至少减至1），然后你摸两张牌。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  olsbjinming(player) {
    let str = "回合开始时，你可以选择一项：";
    for (let i of ["1.回复过1点体力；", "2.弃置过两张牌；", "3.使用过三种类型的牌；", "4.造成过4点伤害。"]) {
      if (!player.getStorage("olsbjinming").includes(parseInt(i.slice(0, 1)))) {
        i = `<span style="text-decoration: line-through;">${i}</span>`;
      }
      str += i;
    }
    str += "然后本回合结束时你摸X张牌，若未满足选择的条件，则删除此选项（X为你最后一次发动〖矜名〗选择的选项序号）。";
    return str;
  },
  old_oljiaozhao(player) {
    if (player.countMark("old_oldanxin")) {
      return lib.translate[`old_oljiaozhao_lv${player.countMark("old_oldanxin")}_info`];
    }
    return lib.translate["old_oljiaozhao_info"];
  },
  oljiaozhao(player) {
    if (player.countMark("oldanxin")) {
      return lib.translate[`oljiaozhao_lv${player.countMark("oldanxin")}_info`];
    }
    return lib.translate["oljiaozhao_info"];
  }
};
const voices = {
  "#shenyu1": "神兵应召，万里归鞘。",
  "#shenyu2": "赠你神兵，你可受得住？",
  "#huaren1": "从今往后，我便是刀，刀便是我。",
  "#huaren2": "无刀一一亦无处不是刀！",
  "#ol_shen_huangzhong:die": "萤惑归天，吾亦往矣……",
  "#puji1": "悬壶济世，普渡众生。",
  "#puji2": "祛病除魔，妙手回春。",
  "#olsbrenche1": "风驰电掣，例无虚发！",
  "#olsbrenche2": "害怕了吗？我南中的战刃飞刀！",
  "#olsbyalian1": "我这圣火巨镰，你吃得消吗！",
  "#olsbyalian2": "喜欢吗，这招很痛吧？",
  "#ol_sb_zhurong:die": "圣火……熄灭了……",
  "#olqingxi1": "策马倾出，奔袭破敌。",
  "#olqingxi2": "尽遣骁锐，倾袭敌军。",
  "#ol_caoxiu:die": "贾梁道，汝何迟也！",
  "#olanxu1": "施仁以济恤，清心而安神。",
  "#olanxu2": "写心之舒悦，展容之解颐。",
  "#olzhuiyi1": "夜阑听呓语，凉风慰相思。",
  "#olzhuiyi2": "朱颜随流水，一忆一段愁。",
  "#ol_bulianshi:die": "朔风如解意，容易莫摧残…… ",
  "#olsbliduan1": "持专断之勇，兼详择之智！",
  "#olsbliduan2": "呼吸之间，即息天下之乱。",
  "#olsbdanchi1": "敌军势大，必轻易不来攻。",
  "#olsbdanchi2": "两军相持，从来有胆者胜，无胆者亡。",
  "#ol_sb_chengyu:die": "军粮……味儿还是不对…… ",
  "#olsbluanchao1": "这天下的火，我便再替你们添一把！",
  "#olsbluanchao2": "诸君……是要束手待毙，还是放手一搏？",
  "#olsbwance1": "你……看得清这局势吗？",
  "#olsbwance2": "你越是挣脱，便陷得越深。",
  "#olsbchenzhi1": "沉得住气，才守得住最后的底牌。",
  "#olsbchenzhi2": "这桌上留到最后的人，一定是我！",
  "#ol_sb_jiaxu:die": "愿赌……服输。",
  "#olshouxi1": "皇天在上，必不佑尔佞臣贼子。",
  "#olshouxi2": "昔父执鞭以安天下，今兄何功得御九州？",
  "#olhuimin1": "百姓饥馑，吾岂安心见之？",
  "#olhuimin2": "汉泽惠布，分赈仓廪以济民乏。",
  "#ol_caojie:die": "父子溘然，此为天罚！",
  "#olcaishi1": "入则致孝於亲，出则致节於国。",
  "#olcaishi2": "在职思其所司，在义思其所立。",
  "#olzhongjian1": "见微知著，观其行可窥其心。",
  "#olzhongjian2": "一叶知秋，查其言而觉其志。",
  "#ol_re_xinxianying:die": "虽无文景之惠，后亦不至天下慜怀。",
  "#longyin_ol_guanping1": "鼠辈怎敢？",
  "#longyin_ol_guanping2": "吴狗何在！",
  "#oljieyong1": "杀！杀！杀！",
  "#oljieyong2": "退！退！退！",
  "#ol_guanping:die": "父亲……",
  "#olzhuohun1": "炼狱灼魂虽痛，不及丧兄之痛！",
  "#olzhuohun2": "前方游魂，可曾见过红面长髯之人！",
  "#olzhuohun3": "既已身堕在此，再无退路！",
  "#olzhuohun4": "无论往哪看，眼里只剩下肃杀！",
  "#olzhuohun5": "逃得出地狱，逃不出困锁！",
  "#olzhuohun6": "纵是永堕地狱，此恨，难忘难解！",
  "#olchenshi1": "来来，与我练练身手！",
  "#olchenshi2": "阻我复仇，那便一齐受死！",
  "#olchenshi3": "复仇之怒，为蛇矛淬火！",
  "#dm_zhangfei:die": "夙仇得报，魂飞魄散又何妨！",
  "#olqiaoshi1": "穿林觅干柴，满目松竹梅兰。",
  "#olqiaoshi2": "晚凉抬担归，艳艳野花插鬓。",
  "#olyanyu1": "默听莺儿啼，云林一叚松花满。",
  "#olyanyu2": "闲看燕子归，耳畔不闻干戈声。",
  "#ol_xiahoushi:die": "好似听得，那日伐木丁声……",
  "#olquanyu1": "百川奔流入海，却尽入朕之彀中。",
  "#olquanyu2": "恩威予取，功过皆在朕心。",
  "#oltianen1": "臣是薪，恩是火，莫让朕寒了心。",
  "#oltianen2": "雷霆雨露，俱是朕赏你的。",
  "#oltianen3": "庙堂之上，贤良忠臣独汝一人？",
  "#olqiangang1": "清浊之分，朕说无用便是无用。",
  "#olqiangang2": "这天下欠朕的，该还了。",
  "#olqiangang3": "朕心即天意，卿当跪听天怒！",
  "#dm_sunquan:die": "朕非朕，天下皆朕！",
  "#ol_jsrg_zhanghe:die": "公天威难抵，郃必效死力。",
  "#olqiangzhi1": "今观丞相之威，可比当年董卓英雄十倍。",
  "#olqiangzhi2": "丞相有情有义，吾等西川陋人岂敢鄙之？",
  "#olxiantu1": "即入汉中，皇叔得川乃是天意。",
  "#olxiantu2": "入川在即，皇叔何惧吾等仁义之见？",
  "#ol_zhangsong:die": "在下真是庄松啊！",
  "#olsbshunji1": "人臣匡世，岂处今日之功而能久者？",
  "#olsbshunji2": "公复间之，可使两贼相持，坐待其弊。",
  "#olsbshunji3": "吾但顺时而行，自得其所成也。",
  "#olsbyishi1": "迎天子驾万乘，都许，使天下有归心。",
  "#olsbyishi2": "兴义兵诛暴乱，势过五伯，魏公之议复何虑哉？",
  "#ol_sb_dongzhao:die": "昔小吏得凭天阶而登志，足矣。",
  "#juanjia1": "尚攻者弃守，其提双刃，斩万敌！",
  "#juanjia2": "舍衣事力，提兵驱敌！",
  "#qiexie1": "今挟双戟搏战，定护主公太平！",
  "#qiexie2": "吾乃典韦是也，谁敢向前，谁敢向前！",
  "#cuijue1": "当锋摧决，贯遐洞坚！",
  "#cuijue2": "殒身不恤，死战成仁！",
  "#shen_dianwei:die": "战死沙场，快哉快哉！",
  "#yuheng1": "权术妙用，存乎一心。",
  "#yuheng2": "威权之道，皆在于衡。",
  "#dili1": "身处巅峰，览天下大事。",
  "#dili2": "位居至尊，掌至高之权。",
  "#shen_sunquan:die": "困居江东，枉称至尊……",
  "#chuyuan1": "储君之位，囊中之物。",
  "#chuyuan2": "此役，我之胜。",
  "#dengji1": "登高位，享极乐。",
  "#dengji2": "今日，便是我称帝之时。",
  "#tianxing1": "孤之行，天之意。",
  "#tianxing2": "我做的决定，便是天的旨意。",
  "#rejianxiong_shen_caopi1": "孤之所长，继父之所长。",
  "#rejianxiong_shen_caopi2": "乱世枭雄，哼，孤亦是。",
  "#rerende_shen_caopi1": "这些都是孤赏赐给你的。",
  "#rezhiheng_shen_caopi1": "有些事情，还需多加思索。",
  "#olluanji_shen_caopi1": "违逆我的，都该处罚。",
  "#caopi_xingdong": "此等小事，你们处理即可。",
  "#shen_caopi:die": "曹魏锦绣，孤还未看尽……",
  "#shenfu1": "河洛之神，诗赋可抒。",
  "#shenfu2": "云神鱼游，罗扇掩面。",
  "#shen_zhenji:die": "众口铄金，难证吾清……",
  "#olzenhui1": "父疾，而子不侍，此为不孝。",
  "#olzenhui2": "君患，而臣不忧，是为不忠。",
  "#oljiaojin1": "天家贵胄，岂是汝诏可收？",
  "#oljiaojin2": "同泽无怨，哼，惟心不自安。",
  "#ol_sunluban:die": "此皆熊、损所白，我实不知。",
  "#olpingtao1": "二贼作乱日久，该以时进讨！",
  "#olpingtao2": "王师天兵已至，贼徒还不速降！",
  "#oljuelie1": "此战，当立千秋之功烈，绝万世之祸危！",
  "#oljuelie2": "坚固以躯命，与贼争生死！",
  "#ol_jsrg_sunjian:die": "罪逆董卓，该杀该杀。",
  "#olfendi1": "善攻者，敌不知其所守，是以围师必阙！",
  "#olfendi2": "我若撤围以回城，贼必自出而意散。",
  "#oljuxiang1": "非讨之无以惩恶，岂容逆辈乞降？",
  "#oljuxiang2": "利则进战，钝则乞降，逆贼此可行邪？",
  "#ol_jsrg_zhujun:die": "郭多竖子，恨不能悬头见你殁亡之日……",
  "#oljiaozhao1": "此诏予卿，愿不负帝室之望。",
  "#oljiaozhao2": "幸有先帝遗诏，保家族俱荣。",
  "#oldanxin1": "据府库，戮忠良，此命臣之所为？",
  "#oldanxin2": "有子不孝，今岂复成人主邪。",
  "#ol_guohuanghou:die": "五刑之罪，莫大于不孝。",
  "#olbachao1": "众卿，别来无恙。",
  "#olbachao2": "改弦更张，乾坤倒转，待我重整江山。",
  "#olbachao3": "豺狼聚野，万民皆唤我，魂归来兮！",
  "#olbachao4": "钝劣无能者，跪服便罢。",
  "#olbachao5": "天下离孤久矣，此来当还黎庶以太明！",
  "#olfuzai1": "舍去慈悲苦，目中唯蕴帝王志！",
  "#olfuzai2": "葬尽衣冠旧，魔气聚化绣龙袍。",
  "#olfuzai3": "万化归一，开以阴阳，持以纯相。",
  "#olfuzai4": "天子剑在心，何凭刀兵胄甲。",
  "#olfuzai5": "凡俗兵刃，何胆与神器争锋？",
  "#dm_caocao:die": "身登帝座，也救不了大魏江山。",
  "#olsbjiaodi1": "犯强汉者，虽远必诛！",
  "#olsbjiaodi2": "非我族类，其心必异！",
  "#olsbjiaodi3": "异族贼寇，安敢犯我汉家疆土！",
  "#olsbbaojing1": "凭你袁本初，还破不了这易京城！",
  "#olsbbaojing2": "人在城在，吾誓与此城共存亡！",
  "#olsbbaojing3": "众志为城，白马为垛，必让尔等有犯无回！",
  "#ol_sb_gongsunzan:die": "将军离魂灭，白马啸西风……",
  "#ol_zhenjun1": "奉令无犯，当敌制决，靡有遗失！",
  "#ol_zhenjun2": "军令在此，围而后降者皆不赦。",
  "#ol_yizhong1": "在乱能整，讨暴克坚，此毅重也。",
  "#ol_yizhong2": "质忠性一，守执节义，自当无坚不陷。",
  "#ol_re_yujin:die": "这漫天大雨，终究是忘不掉吗？",
  "#olsbxinchuan1": "火光虽微，但火种不灭。",
  "#olsbxinchuan2": "此身虽朽，未竟之谋当付来人。",
  "#olsbjinjin1": "当燃至最后一刻，照亮前路。",
  "#olsbjinjin2": "余下的，便交给你了。",
  "#ol_sb_xizhicai:die": "望主公寻得那继我薪火之人……",
  "#oljingce1": "此地薄弱，当加强防御。",
  "#oljingce2": "诸葛小计，吾早已预料。",
  "#ol_guohuai:die": "无五子，亦无淮也……",
  "#olsbjigu1": "积五谷以供六军，战则大胜。",
  "#olsbjigu2": "粮草先于兵马而行，无谷则不胜。",
  "#olsbjiewan1": "断一腕而存全身，为之何妨。",
  "#olsbjiewan2": "壮士解腕求存，绝境孤注一掷。",
  "#ol_sb_dengai:die": "钟会小儿得志，必遭天谴！",
  "#olsbduduan1": "图高帝之业，观曹操凶衅，不患贫而患不安。",
  "#olsbduduan2": "坐东南吴会，望九州离乱，不患寡而患不均。",
  "#olsbyinglve1": "商人趋利，察，虽万难必蹈。",
  "#olsbyinglve2": "商人择良，用，虽一布必慎。",
  "#olsbmengshi1": "盟堪市肆，近宅兴家，醉宾客而能贵东主。",
  "#olsbmengshi2": "势如明渠，决川拒海，活支流然尽注五湖。",
  "#ol_sb_lusu:die": "利来利往，黄泉路上熙攘…",
  "#olsbqianfu1": "今从孟德，定能助其成霸业。",
  "#olsbqianfu2": "良臣，当为明主筹谋。",
  "#olsbyushi1": "势者，非由天定，乃凭人谋。",
  "#olsbyushi2": "袁曹相争，乱中取利。",
  "#olsbfenchao1": "袁本初，你一生的心血就此付之一炬吧！",
  "#olsbfenchao2": "这一把火起，定叫他军心大乱！",
  "#ol_sb_xuyou:die": "孟德小儿，你…你过河拆桥！",
  "#olmiluo1": "曲终人不见，菱花镜里，看灯忽明灭。",
  "#olmiluo2": "一曲相酬，纵离别未肯衔忧。",
  "#oljueyan1": "引弦铮铮作兵戈，阿姊，莫回头。",
  "#oljueyan2": "筝声纷纷花雨下，沾湿皖城月。",
  "#ol_sb_xiaoqiao:die": "曲终不成调，知己终零落。",
  "#olzhenlie1": "女子有节，宁死不折！",
  "#olzhenlie2": "伤在我身，痛在谁心？",
  "#olmiji1": "身入虎穴，但谋虎子。",
  "#olmiji2": "以身为饵，必擒马儿。",
  "#ol_wangyi:die": "匹夫，还我儿命来！",
  "#olduoqi1": "你的脊梁，不堪一击！",
  "#olduoqi2": "你的胆气，一文不值！",
  "#olkuangmo1": "草芥，也配呼吸？",
  "#olkuangmo2": "哼，蝼蚁，杀了解闷。",
  "#olkuangmo3": "骄狂纵意，天地唯我！",
  "#olgangquan1": "罡风贯耳，为我战歌！",
  "#olgangquan2": "用这拳头，打破一切！",
  "#dm_lvbu:die": "人间无敌，该去地狱挑战了。",
  "#olhuanhuo1": "你们的争斗，不过是我指间的傀儡戏。",
  "#olhuanhuo2": "我动动指尖，便能让山河变色，群雄皆醉。",
  "#olqingshi1": "看你们为我疯魔厮杀，才是这世间最美的风景。",
  "#olqingshi2": "血流成河，方不负我倾世的容颜。",
  "#dm_diaochan:die": "待我归来，定让这天下再为我癫狂！",
  "#olfuhun1": "东吴锦帆何处寻，且到我兄弟刀下问亡魂！",
  "#olfuhun2": "青龙啸西川，蛇矛震祁山，此刃当饮仇雠血！",
  "#wusheng_ol_guanzhang1": "水淹七军犹在目，今化陇上断后锋！",
  "#paoxiao_ol_guanzhang1": "当阳桥头雷未绝，祁山阵前再显威！",
  "#ol_guanzhang:die": "兴/苞死无碍，唯汉志长存！",
  "#olzishou1": "九州烽烟起，此地犹姓刘。",
  "#olzishou2": "守一方水土，定乱世太平。",
  "#olzongshi1": "非刘姓者，不可为王。",
  "#olzongshi2": "万千志士，皆为一姓天下。",
  "#ol_liubiao:die": "乱世无义，尽是失德之徒。",
  "#oldangxian1": "老将临战，亦可一马当先。",
  "#oldangxian2": "我乃昭烈旧将，岂能居小辈之后！",
  "#olfuli1": "廉颇尚能古稀挂帅，我如何不能？",
  "#olfuli2": "吾虽老，然能食饭三斗、开弓五石！",
  "#ol_liaohua:die": "国破家亡，老卒死有余辜。",
  "#reluoying_ol_caozhi1": "花落白宣上，秉笔有天工。",
  "#reluoying_ol_caozhi2": "泼墨染秋意，落花亦有情。",
  "#oljiushi1": "绿蚁洗墨锋，入喉酒香浓。",
  "#oljiushi2": "新酒赋旧词，墨香正醉人。",
  "#ol_caozhi:die": "酒醉不知归路，唯见星河漫天。",
  "#olguifu1": "天命在我，何须急于一时。",
  "#olguifu2": "天数已定，如渊潜龙！",
  "#olmoubian1": "别跟我谈什么对错！我的灵魂，即是我的正义！",
  "#olmoubian2": "我这把剑，该见见血了！",
  "#olmoubian3": "无天无界，我就是天命！",
  "#olmoubian4": "自今日起，我剑由我不由人！",
  "#olzhouxi1": "你降，不降，都得死！",
  "#olzhouxi2": "我就像这夜，终将吞噬一切！",
  "#dm_simayi:die": "哈哈哈哈哈哈，天数……我还是输给了天数？",
  "#rezhuikong_ol_fuhuanghou1": "曹贼一日不除，旦夕如不终日。",
  "#rezhuikong_ol_fuhuanghou2": "见许田曹瞒骖乘，叫人如芒在背。",
  "#olqiuyuan1": "我父伏完常有杀操之心，今当修书一封，秘密图之。",
  "#olqiuyuan2": "中朝能称忠义者，莫当黄门穆顺。",
  "#ol_fuhuanghou:die": "只恨邪风不静，不能杀了老贼……",
  "#olsblunzhan1": "杀!尽歼贼败军之众!",
  "#olsblunzhan2": "白马公孙?哼，不过吾一合之敌!",
  "#olsbjuejue1": "冠绝河北，威震冀幽，一勇可当万夫!",
  "#olsbjuejue2": "今丑单骑独往，必绝曹军之威!",
  "#ol_sb_wenchou:die": "何人…杀吾兄弟………",
  "#olsbchoulie1": "匹夫欺我太甚，此仇不死不休！",
  "#olsbchoulie2": "唯有那曹操项上人头，方能解我心头之恨。",
  "#olsbzhuijiao1": "曹阿瞒，这次看你往哪里逃！",
  "#olsbzhuijiao2": "我倒要看看，你曹孟德有几个儿子！",
  "#ol_sb_zhangxiu:die": "文和，可有良计救我？",
  "#olsbjinming1": "士举义或举利，吾，当举大名耳！",
  "#olsbjinming2": "人生百代，我欲垂名于青史。",
  "#olsbxiaoshi1": "胸有欲壑，泰山难填、息壤难掩。",
  "#olsbxiaoshi2": "子欲奉汝之骨肉为宴否？",
  "#olsbyanliang1": "此酒酸涩，快去取我的金浆酒来。",
  "#olsbyanliang2": "诸君且饮此杯，待明日沙场建功！",
  "#ol_sb_yuanshu:die": "谋事在人，奈何成事不在人。",
  "#olguanbian1": "今日，老夫也想尝尝这鹿血的滋味！",
  "#olguanbian2": "这水搅的越浑，这鱼便越好捉！",
  "#olxiongni1": "不愿做我殿上宾客？哼哼！那便做我刀下鬼！",
  "#olxiongni2": "尔等，要试试我宝剑锋利否！",
  "#olxiongni3": "皇帝？哼！不过是老夫掌中玩物罢了！",
  "#olxiongni4": "人心隔肚皮，只有剖腹观心，方能辨其忠奸。",
  "#olxiongni5": "顺吾意者生，逆吾意者死！",
  "#olxiongni6": "总有人，不愿吃这敬酒，反去讨罚酒吃！",
  "#olfengshang1": "干了这杯酒，你便是老夫生死弟兄！",
  "#olfengshang2": "来来来，金杯共汝饮，荣华共汝享！",
  "#olfengshang3": "老夫身登大宝、位居尚父，人人皆有封赏！",
  "#olfengshang4": "顺我意者，当金玉加身，为人上人！",
  "#olfengshang5": "我以天地为酒爵，汝欲与我同醉否？",
  "#olfengshang6": "我与汝等共享天地繁华，岂不快哉！",
  "#olzhibin1": "老夫为这大汉江山，是操碎了心呐！",
  "#olzhibin2": "老夫言尽于此，哪个敢说半个不字！",
  "#olzhibin3": "什么礼制纲常？我说的，就是纲常！",
  "#olzhibin4": "天大地大，我董卓最大！",
  "#olzhibin5": "我为天下计，岂惜小民哉！",
  "#olzhibin6": "醉卧美人膝，醒掌天下权！",
  "#dcfencheng_ol_sb_dongzhuo1": "焚城为焰，炙脍犒三军。",
  "#ol_sb_dongzhuo1:die": "关东鼠辈，怎敢忤逆天命？",
  "#ol_sb_dongzhuo2:die": "悔不该踌躇不前呐……",
  "#ol_sb_dongzhuo3:die": "孟德举刀，意欲何为？",
  "#oljuece1": "汝为孤家寡人，生死自当由我。",
  "#oljuece2": "我以拳殴帝，帝可有还手之力？",
  "#olmieji1": "喝了这杯酒，别再理这世间事！",
  "#olmieji2": "我欲借陛下性命一用。",
  "#dcfencheng_ol_liru1": "愿这火光，照亮董公西行之路！",
  "#dcfencheng_ol_liru2": "诸公且看，此火可戏天下诸侯否？",
  "#ol_liru:die": "火熄人亡，都结束了。",
  "#olsbbojue1": "匹夫，今日便让你尝尝我大刀之利！",
  "#olsbbojue2": "孙坚！你若有胆，便与我一对一！",
  "#olsbyangwei1": "本将军刀下，不分强弱，只问生死！",
  "#olsbyangwei2": "敌将何在，速来受死！",
  "#ol_sb_huaxiong:die": "我已连战三场，匹夫胜之不武……",
  "#olzongxuan1": "易字从日下月，此乃自然之理。",
  "#olzongxuan2": "笔著太玄十四卷，继往圣之学。",
  "#olzhiyan1": "尔降虏，何敢与吾君齐马首乎！",
  "#olzhiyan2": "当闭反开，当开反闭，匹夫何故反复？",
  "#ol_yufan:die": "彼皆死人，何语神仙？",
  "#olsbliwen1": "伐竹筑学宫，大庇天下士子。",
  "#olsbliwen2": "学而不厌，诲人不倦，何有于我哉。",
  "#olsbzhengyi1": "保纳舍藏者，融也，当坐之。",
  "#olsbzhengyi2": "子曰当仁不让，当义，亦不能让。",
  "#ol_sb_kongrong:die": "为父将去，子何以不辞？",
  "#olsbhulie1": "匹夫犯我，吾必斩之！",
  "#olsbhulie2": "鼠辈！这一刀下去定让你看不到明天的太阳。",
  "#olsbhulie3": "这大汉，就是我江东子弟的天下！",
  "#olsbyipo1": "乱臣贼子，天地不容！",
  "#olsbyipo2": "身既死兮神以灵，魂魄毅兮为鬼雄！",
  "#olsbyipo3": "年少束发从羽林，纵死不改报国志。",
  "#ol_sb_sunjian:die": "江东子弟们，我先走一步了……",
  "#olbuyi1": "今植桑芜，可荫来者。",
  "#olbuyi2": "补气凝神，百邪不侵。",
  "#olganlu1": "吾家有女，当择良婿。",
  "#olganlu2": "今见玄德，真佳婿也。",
  "#ol_wuguotai:die": "竖子，何以胞妹为饵乎？",
  "#jueqing_ol_zhangchunhua1": "情丝如雪，难当暖阳。",
  "#jueqing_ol_zhangchunhua2": "有情总被无情负，绝情方无软肋生。",
  "#shangshi_ol_zhangchunhua1": "伤我最深的，竟是你司马懿。",
  "#shangshi_ol_zhangchunhua2": "世间刀剑数万，何以情字伤人？",
  "#oljianmie1": "莫说是你，天潢贵胄亦可杀得！",
  "#oljianmie2": "你我不到黄泉，不复相见！",
  "#ol_zhangchunhua:die": "我不负懿，懿负我。",
  "#olchengxiang1": "谁知道称大象需要几步？",
  "#olchengxiang2": "象虽大，然可并舟称之。",
  "#olrenxin1": "待三日中，然后自归。",
  "#olrenxin2": "王者仁心，尚性善之本。",
  "#ol_caochong:die": "性慧早夭，为之奈何？",
  "#olxuanhuo1": "眩惑之术，非为迷惑，乃为明辨贤愚。",
  "#olxuanhuo2": "以眩惑试人心，以真情待贤才，方能得天下。",
  "#olenyuan1": "恩重如山，必报之以雷霆之势！",
  "#olenyuan2": "怨深似海，必还之以烈火之怒！",
  "#ol_fazheng:die": "孝直不忠，不能佑主公复汉室了……",
  "#olqieting1": "好你个刘玄德，敢坏我儿大事。",
  "#olqieting2": "两个大男人窃窃私语，定没有好事。",
  "#xianzhou_ol_caifuren1": "今献州以降，请丞相善待我孤儿寡母。",
  "#xianzhou_ol_caifuren2": "我儿志短才疏，只求方寸之地安享富贵。",
  "#ol_caifuren:die": "这哪里是青州，分明是黄泉……",
  "#olsbhongtu1": "当下春风正好，君可扶摇而上。",
  "#olsbhongtu2": "得卧龙凤雏相助，主公大业可成。",
  "#olsbhongtu3": "我有一计，管教刘璋拱手来降。",
  "#olsbhongtu4": "我有一计，可定千里蜀川。",
  "#olsbhongtu5": "我有一计，可使主公大展鸿图。",
  "#olsbhongtu6": "我有一计，请诸位倾耳静听。",
  "#olsbqiwu1": "哎~没打着~",
  "#olsbqiwu2": "除了飞来的暗箭，无物可伤我。",
  "#olsbqiwu3": "凤栖梧桐，不为虫蚁所伤。",
  "#olsbqiwu4": "既有冲天之心，何惧风霜之寒。",
  "#olsbqiwu5": "食腐鼠之狸，安敢觊觎枝上之凤？",
  "#olsbqiwu6": "坐高处观月，远虫鸣之扰。",
  "#ol_sb_pangtong1:die": "未与孔明把酒锦官城，恨也，恨也……",
  "#ol_sb_pangtong2:die": "卧龙凤雏，只可得其一……",
  "#ol_sb_pangtong3:die": "主公大业未成，统如何瞑目……",
  "#olsbzhuri1": "效逐日之夸父，怀忠志而长存。",
  "#olsbzhuri2": "知天命而不顺，履穷途而强为。",
  "#olsbranji1": "此身为薪，炬成灰亦昭大汉长明！",
  "#olsbranji2": "维之一腔骨血，可驱驰来北马否？",
  "#kunfen_ol_sb_jiangwei1": "虽千万人，吾往矣！",
  "#zhaxiang_ol_sb_jiangwei1": "亡国之将姜维，请明公驱驰。",
  "#ol_sb_jiangwei:die": "姜维姜维……又将何为？",
  "#xuanfeng_re_lingtong1": "短兵相接，让敌人丢盔弃甲！",
  "#xuanfeng_re_lingtong2": "攻敌不备，看他们闻风而逃！",
  "#olsbweilin1": "汝等鼠辈，岂敢与某相抗！",
  "#olsbweilin2": "义襄千里，威震华夏！",
  "#olsbduoshou1": "今日之敌，必死于我刀下！",
  "#olsbduoshou2": "青龙所向，战无不胜！",
  "#ol_sb_guanyu:die": "玉碎不改白，竹焚不毁节……",
  "#olsbdulie1": "秉同难共患之义，莫敢辞也。",
  "#olsbdulie2": "慈赴府君之急，死又何惧尔？",
  "#olsbdouchan1": "此时不捉孙策，更待何时！",
  "#olsbdouchan2": "有胆气者，都随我来！",
  "#ol_sb_taishici:die": "人生得遇知己，死又何憾……",
  "#olsbhetao1": "合诸侯之群力，扶大汉之将倾。",
  "#olsbhetao2": "猛虎啸于山野，群士执戈相待。",
  "#olsbhetao3": "合兵讨贼，其利断金！",
  "#olsbhetao4": "众将一心，战无不胜！",
  "#olsbhetao5": "秣马厉兵，今乃报国之时！",
  "#olsbhetao6": "齐心协力，缔三造大汉之举！",
  "#olsbshenli1": "沧海之水难覆，将倾之厦难扶。",
  "#olsbshenli2": "诸君心怀苟且，安能并力西向？",
  "#olsbshenli3": "联军离心，各逐其利。",
  "#olsbshenli4": "什么国恩大义，不过蔽履而已！",
  "#olsbshenli5": "本盟主的话，你是听还是不听？",
  "#olsbshenli6": "尔等皆为墙头草，随风而摆。",
  "#olsbyufeng1": "梦神人授剑，怀神兵济世。",
  "#olsbyufeng2": "哼！我剑也未尝不利！",
  "#olsbyufeng3": "士者，怎可徒手而战！",
  "#olsbshishou1": "今执牛耳，当为天下之先。",
  "#olsbshishou2": "士者不徒手而战，况其首乎。",
  "#olsbshishou3": "吾居群士之首，可配剑履否？",
  "#olsbshishou4": "剑来！",
  "#olsbshishou5": "今秉七尺之躯，不负三尺之剑！",
  "#olsbshishou6": "拔剑四顾，诸位识得我袁本初？",
  "#ol_sb_yuanshao1:die": "众人合而无力，徒负大义也……",
  "#ol_sb_yuanshao2:die": "袁氏凋零，皆我一人之罪……",
  "#olsbbingcai1": "举案并肩，良缘天定。",
  "#olsbbingcai2": "愿得一心人，白首不相离。",
  "#olsblixian1": "柴米油盐也是家国大事，马虎不得。",
  "#olsblixian2": "军师大人，妾身这步棋走得如何？",
  "#ol_sb_huangyueying:die": "五丈原上寒风起，从此不见夜归人。",
  "#olsbzhitian1": "天火熊熊，再兴炎汉国祚。",
  "#olsbzhitian2": "地火愔愔，燎尽不臣之贼。",
  "#olsbwujing1": "天地协力，止戈为武，九鼎合归凤云台。",
  "#olsbwujing2": "王师北定，山河重整，万民争迎汉家来。",
  "#olsbzhijue1": "依天时，居地利，此计当兴人和。",
  "#olsbzhijue2": "知天意，胜人谋，此战定还旧都。",
  "#olsbzhijue3": "摇此羽扇，立唤东风。",
  "#olsbzhijue4": "亮素以谋制人，岂为人谋所制？",
  "#olsbzhijue5": "天下事将了，功成还做陇亩民。",
  "#ol_sb_zhugeliang:die": "今败乃计拙，非天不惜汉。",
  "#olsblucun1": "汉家长城？老糊涂，这殿上哪来的什么长城！",
  "#olsblucun2": "入物者补官，出货者罪除，咱家向来公正。",
  "#olsblucun3": "饰貂带玉，配绶怀金，今日之贵皆赖帝恩。",
  "#olsblucun4": "手握王爵，口含天宪，今非复廷巷小宦。",
  "#olsblucun5": "头戴进贤，腰佩绶带，哈哈，好一个狗官！",
  "#olsblucun6": "啧啧啧，百里奚才值五张羊皮，汝这庸奴要什么钱？",
  "#olsbtuisheng1": "陛下明鉴，此王侯所为，吾等实不知。",
  "#olsbtuisheng2": "宫内污秽？敢问公卿以下忠清者为谁？",
  "#olsbtuisheng3": "奸臣胁国，当伏其罪，我等共图之。",
  "#olsbtuisheng4": "前儿个奉侍我等的奴才，今儿就想要反主吗？",
  "#olsbtuisheng5": "我等愿尽献家财，唯乞太后怜悯。",
  "#olsbtuisheng6": "众常侍如缚豕待宰，惟待大将军……前来。",
  "#ol_sb_zhangrang1:die": "尔以此始，必以此终。",
  "#ol_sb_zhangrang2:die": "天下愦愦，非独我罪。",
  "#ol_sb_zhangrang3:die": "我等虽死，却也享尽这富贵荣华！",
  "#olsibing1": "钲鼓鸣，山河动。老夫定为天子荡平逆乱。",
  "#olsibing2": "筑围凿堑合而不攻，待以时日贼自生变。",
  "#olliance1": "持军合势，贼聚而不出，哼，惟险势可图。",
  "#olliance2": "日晦月见，此军政缓策，非谨略能安。",
  "#ol_sb_yl_luzhi:die": "昔卫霍灭匈奴尚不筑京观，况乎汉家子民？",
  "#olqianxi1": "藏锋弑血头上刀，须臾剑影斩麒麟！",
  "#olqianxi2": "长史为其外，余暗为其内，魏延足定！",
  "#ol_madai:die": "文…文长，君何兀自回头？"
};
const characterSort = {
  extra_ol: ["shen_dianwei", "ol_zhangliao", "shen_caopi", "shen_zhenji", "shen_sunquan", "junk_zhangjiao", "ol_shen_huangzhong"],
  onlyOL_yijiang1: ["ol_zhangchunhua", "ol_lingtong", "ol_gaoshun", "ol_fazheng", "ol_wuguotai", "ol_caozhi", "ol_re_yujin"],
  onlyOL_yijiang2: ["ol_zhonghui", "ol_liaohua", "ol_caozhang", "ol_chengpu", "ol_wangyi", "ol_liubiao", "ol_guanzhang", "ol_madai", "ol_bulianshi"],
  onlyOL_yijiang3: ["ol_jianyong", "ol_guohuai", "ol_fuhuanghou", "ol_yufan", "ol_liru", "ol_caochong", "ol_guanping", "ol_liufeng"],
  onlyOL_yijiang4: ["ol_zhangsong", "ol_caifuren", "ol_sunluban"],
  onlyOL_yijiang5: ["ol_xiahoushi", "ol_sunxiu", "ol_quancong", "ol_caoxiu"],
  onlyOL_yijiang6: ["ol_guohuanghou"],
  onlyOL_yijiang7: ["ol_caojie", "ol_re_xinxianying"],
  onlyOL_ol_jsrg: ["ol_jsrg_zhanghe", "ol_jsrg_zhaoyun", "ol_jsrg_liuhong", "ol_jsrg_zhangliao", "ol_jsrg_zhujun", "ol_jsrg_sunjian"],
  onlyOL_sb_mouding: ["ol_sb_lusu", "ol_sb_zhugeliang", "ol_sb_jiangwei", "ol_sb_pangtong", "ol_sb_jiaxu", "ol_sb_guojia"],
  onlyOL_sb_wudong: ["ol_sb_zhaoyun", "ol_sb_zhangfei", "ol_sb_guanyu", "ol_sb_dongzhuo"],
  onlyOL_sb_fenwu: ["ol_sb_gongsunzan", "ol_sb_zhangxiu", "ol_sb_dengai", "ol_sb_taishici", "ol_sb_yuanshao", "ol_sb_sunjian", "ol_sb_huaxiong", "ol_sb_wenchou"],
  onlyOL_sb_shiren: ["ol_sb_kongrong", "ol_sb_yl_luzhi"],
  onlyOL_sb_daquan: ["ol_sb_dongzhao", "ol_sb_xuyou", "ol_sb_jushou", "ol_sb_yuanshu", "ol_sb_zhangrang"],
  onlyOL_sb_jichu: ["ol_sb_chengyu", "ol_sb_xizhicai"],
  onlyOL_sb_huahao: ["ol_sb_xiaoqiao", "ol_sb_huangyueying", "ol_sb_zhurong"],
  onlyOL_demonized: ["dm_simayi", "dm_diaochan", "dm_lvbu", "dm_sunquan", "dm_caocao", "dm_zhangfei"],
  onlyOL_waitingforsort: []
};
const characterSortTranslate = {
  onlyOL_yijiang1: "OL专属·将1",
  onlyOL_yijiang2: "OL专属·将2",
  onlyOL_yijiang3: "OL专属·将3",
  onlyOL_yijiang4: "OL专属·将4",
  onlyOL_yijiang5: "OL专属·将5",
  onlyOL_yijiang6: "OL专属·原6",
  onlyOL_yijiang7: "OL专属·原7",
  onlyOL_ol_jsrg: "闪耀星河·江山如故",
  onlyOL_sb_mouding: "上兵伐谋·谋定天下",
  onlyOL_sb_wudong: "上兵伐谋·武动乾坤",
  onlyOL_sb_fenwu: "上兵伐谋·奋勇扬威",
  onlyOL_sb_shiren: "上兵伐谋·施仁布德",
  onlyOL_sb_daquan: "上兵伐谋·达权通变",
  onlyOL_sb_jichu: "上兵伐谋·计出万全",
  onlyOL_sb_huahao: "上兵伐谋·花好月圆",
  onlyOL_demonized: "OL·魔",
  onlyOL_waitingforsort: "等待分包",
  extra_ol: "神将异构·OL"
};
game.import("character", function() {
  return {
    name: "onlyOL",
    connect: true,
    character: { ...characters },
    characterSort: {
      onlyOL: characterSort
    },
    characterFilter: { ...characterFilters },
    characterTitle: { ...characterTitles },
    dynamicTranslate: { ...dynamicTranslates },
    characterIntro: { ...characterIntro },
    characterSubstitute: {
      ol_sb_yuanshao: [["ol_sb_yuanshao_shadow", ["die:ol_sb_yuanshao"]]],
      ol_sb_dongzhuo: [
        ["ol_sb_dongzhuo_shadow1", ["die:ol_sb_dongzhuo", "tempname:ol_sb_dongzhuo"]],
        ["ol_sb_dongzhuo_shadow2", ["die:ol_sb_dongzhuo", "tempname:ol_sb_dongzhuo"]]
      ],
      ol_sb_zhangrang: [["ol_sb_zhangrang_shadow", ["die:ol_sb_zhangrang"]]]
    },
    card: { ...cards },
    skill: { ...skills },
    translate: { ...translates, ...voices, ...characterSortTranslate },
    pinyins: { ...pinyins }
  };
});
