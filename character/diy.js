import { get, lib, _status, game, ui } from "noname";
const characters = {
  huan_noname: {
    sex: "female",
    group: "qun",
    hp: 4,
    skills: ["noname_gongchuang", "huan_duocai", "noname_changeGroup"],
    names: "null|无"
  },
  noname: {
    sex: "female",
    group: "key",
    hp: 3,
    skills: ["noname_zhuyuan", "noname_duocai"],
    names: "null|无"
  },
  ns_shijian: {
    sex: "female",
    group: "key",
    hp: 4,
    skills: ["nspianwu"]
  },
  ns_huangchengyan: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["nslongyue", "nszhenyin"]
  },
  ns_sunchensunjun: {
    sex: "male",
    group: "wu",
    hp: 5,
    skills: ["nsxianhai", "nsxingchu"],
    names: "孙|綝-孙|峻"
  },
  ns_yuanxi: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["nsshengyan", "nsdaizhan"]
  },
  ns_caoshuang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["nsjiquan", "nsfuwei"]
  },
  ns_sunyi: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["nsguolie"]
  },
  ns_huangwudie: {
    sex: "female",
    group: "shu",
    hp: 4,
    skills: ["nsdiewu", "nslingying", "nspojian"]
  },
  ns_chentai: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["nsweiyuan", "nsjuxian"],
    clans: ["颍川陈氏"]
  },
  ns_zhangning: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["nsfuzhou", "nsguidao", "nstaiping"]
  },
  ns_yanghu: {
    sex: "male",
    group: "jin",
    hp: 3,
    skills: ["nsbizhao", "nsqingde", "nsyidi"],
    hasHiddenSkill: true
  },
  ns_zanghong: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["nsshimeng"]
  },
  ns_ruanji: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["nsshizui", "nsxiaoye"]
  },
  ns_limi: {
    sex: "male",
    group: "jin",
    hp: 3,
    skills: ["nstuilun"]
  },
  ns_zhonglimu: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["nskuanhuai", "nsdingbian"],
    names: "钟离|牧"
  },
  prp_zhugeliang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["nsxingyun", "nshanlang"],
    names: "诸葛|亮"
  },
  ns_zhangwei: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["nsqiyue", "nsxuezhu"]
  },
  diy_wenyang: {
    sex: "male",
    group: "wei",
    hp: 4,
    maxHp: 6,
    skills: ["lvli", "choujue"]
  },
  ns_zuoci: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["nsxinsheng", "nsdunxing"]
  },
  ns_lvzhi: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["nsnongquan", "nsdufu"],
    names: "吕|雉"
  },
  ns_wangyun: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["liangji", "jugong", "chengmou"],
    clans: ["太原王氏"]
  },
  ns_nanhua: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["nshuanxian", "nstaiping_nh", "nsshoudao"],
    names: "庄|周"
  },
  ns_nanhua_left: {
    sex: "male",
    group: "qun",
    hp: 2,
    skills: [],
    isUnseen: true,
    names: "null|null"
  },
  ns_nanhua_right: {
    sex: "female",
    group: "qun",
    hp: 2,
    skills: [],
    isUnseen: true,
    names: "null|null"
  },
  ns_huamulan: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["nscongjun", "xiaoji", "gongji"],
    names: "null|null"
  },
  ns_huangzu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["nsjihui", "nsmouyun"]
  },
  ns_jinke: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["nspinmin", "nsshishou"],
    names: "姜|荆轲"
  },
  ns_yanliang: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["nsduijue", "nsshuangxiong", "dualside"],
    dualSideCharacter: "ns_wenchou"
  },
  ns_wenchou: {
    sex: "male",
    group: "qun",
    hp: 2,
    skills: ["nsguanyong", "dualside"],
    isUnseen: true
  },
  ns_caocao: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["nscaiyi", "nsgefa", "nshaoling"]
  },
  ns_caocaosp: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["nsjianxiong", "nsxionglue"]
  },
  ns_zhugeliang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["nsguanxing", "kongcheng", "nsyunxing"],
    names: "诸葛|亮"
  },
  ns_wangyue: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["nsjianshu", "nscangjian"]
  },
  ns_yuji: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["nsyaowang", "nshuanhuo"]
  },
  ns_xinxianying: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["nsdongcha", "nscaijian", "nsgongjian"]
  },
  ns_guanlu: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["nsbugua", "nstuiyan", "nstianji"]
  },
  ns_simazhao: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["nszhaoxin", "nsxiuxin", "nsshijun"],
    names: "司马|昭"
  },
  ns_sunjian: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["nswulie", "nshunyou", "nscangxi"]
  },
  ns_duangui: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["nscuanquan", "nsjianning", "nschangshi", "nsbaquan"]
  },
  ns_zhangbao: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["nsfuhuo", "nswangfeng"]
  },
  ns_masu: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["nstanbing", "nsxinzhan"]
  },
  ns_zhangxiu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["nsbaiming", "nsfuge"]
  },
  ns_lvmeng: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["nsqinxue", "nsbaiyi"]
  },
  ns_shenpei: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["nshunji", "shibei"]
  },
  ns_yujisp: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["nsguhuo"]
  },
  ns_yangyi: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["nsjuanli", "nsyuanchou"]
  },
  ns_liuzhang: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["nsanruo", "nsxunshan", "nskaicheng"]
  },
  ns_xinnanhua: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["ns_xiandao", "ns_xiuzheng", "ns_chuanshu"],
    names: "庄|周"
  },
  ns_caimao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["nsdingzhou"]
  },
  ns_luyusheng: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["nshuaishuang", "nsfengli"],
    clans: ["吴郡陆氏"]
  },
  ns_chengpu: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["decadelihuo", "decadechunlao"]
  },
  ns_sundeng: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["xinkuangbi"]
  },
  ns_duji: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["xinfu_andong", "xinyingshi"]
  },
  ns_mengyou: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["nsmanzhi"]
  },
  junk_zhangrang: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["junktaoluan"],
    trashBin: ["sex:male_castrated"]
  },
  old_bulianshi: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["anxu", "zhuiyi"]
  },
  ol_maliang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["zishu", "xinyingyuan"]
  },
  junk_liubei: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["junkrende", "jijiang"],
    isZhugong: true
  },
  junk_huangyueying: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["junkjizhi", "junkqicai"]
  },
  junk_lidian: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["xunxun", "junkwangxi"]
  },
  junk_duanwei: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["langmie"]
  },
  junk_xuyou: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["nzry_chenglve", "junkshicai", "nzry_cunmu"]
  },
  junk_guanyu: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["olsbfumeng", "olsbguidao"]
  },
  junk_liuyan: {
    sex: "male",
    group: "qun",
    hp: 4,
    maxHp: 6,
    skills: ["olpianan", "olyinji", "olkuisi"]
  },
  zhangren: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["chuanxin", "zfengshi"]
    //xdm我打赢复活赛了，虽然在垃圾桶里
  }
};
const cards = {
  nsfuzhou_card: {
    fullskin: true,
    type: "delay",
    wuxieable: false,
    modTarget(card, player2, target) {
      return lib.filter.judge(card, player2, target);
    },
    enable(card, player2) {
      return player2.canAddJudge(card);
    },
    filterTarget(card, player2, target) {
      return lib.filter.judge(card, player2, target) && player2 == target;
    },
    judge(card) {
      if (get.color(card) == "red") {
        return 0;
      }
      return -4;
    },
    effect() {
      var source = cards[0].storage.nsfuzhou_source;
      if (!source || !source.isIn()) {
        return;
      }
      source.line(player, "thunder");
      switch (result.color) {
        case "black":
          player.damage(source, source.storage.nsfuzhou_damage ? 2 : 1, "thunder");
          player.chooseToDiscard("he", true);
          break;
        case "red":
          source.draw(2);
          if (typeof player.storage.nsfuzhou_num != "number") {
            player.storage.nsfuzhou_num = 0;
          }
          if (source.storage.nsfuzhou_draw) {
            player.recover();
            player.draw();
            player.storage.nsfuzhou_num++;
          } else {
            player.storage.nsfuzhou_num--;
          }
          player.addTempSkill("nsfuzhou_num");
          player.markSkill("nsfuzhou_num");
          break;
      }
    },
    ai: {
      basic: {
        order: 1,
        useful: 0,
        value: 0
      },
      result: {
        target: -1
      },
      tag: {
        damage: 0.5,
        natureDamage: 0.5,
        thunderDamage: 0.5
      }
    }
  }
};
const pinyins = {};
const skills = {
  //幻小无
  noname_gongchuang: {
    forced: true,
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    filter(event, player2) {
      return game.players.length > 0;
    },
    logTarget: () => game.players,
    async content(event, trigger, player2) {
      const { targets } = event;
      await game.doAsyncInOrder(targets, async (target) => {
        const cards3 = target.getCards("he");
        let result2;
        if (!cards3?.length) {
          result2 = { bool: false };
        } else {
          result2 = await target.chooseToGive(player2, "he", `共创：是否交给${get.translation(player2)}一张牌否则令其获得2枚“漏洞”（至多24枚）`).set("ai", (card) => {
            const { sourcex, player: player3 } = get.event();
            const att = get.attitude(player3, sourcex);
            if (sourcex == player3) {
              if (get.position(card) == "e") {
                return -get.value(card, player3);
              }
              return 0;
            }
            if (att > 0) {
              return get.value(card, sourcex) - 4;
            }
            return 5 - get.value(card, player3);
          }).set("sourcex", player2).forResult();
        }
        if (!result2.bool) {
          get.info(event.name).addMark(player2, 2);
          target.chat("不给！");
          await game.delayx();
        }
      });
      const give_map = /* @__PURE__ */ new Map();
      const assigned = [];
      if (_status.connectMode) {
        game.broadcastAll(function() {
          _status.noclearcountdown = true;
        });
      }
      while (assigned.length < 4 && player2.hasCard((card) => !card.hasGaintag("noname_gongchuang_assigned"), "he")) {
        const result2 = await player2.chooseCardTarget({
          prompt: `共创：你可以分配至多四张牌，请选择要分配的卡牌和目标`,
          filterCard(card) {
            if (card.hasGaintag("noname_gongchuang_assigned")) {
              return false;
            }
            return true;
          },
          selectCard: [1, 4 - assigned.length],
          filterTarget: true,
          position: "he",
          ai1: (card) => {
            if (!ui.selected.cards.length) {
              return 1;
            }
            return 0;
          },
          ai2: (target) => {
            const player3 = get.player(), card = ui.selected.cards[0];
            const val = target.getUseValue(card);
            if (val > 0) {
              return val * get.attitude(player3, target) * 2;
            }
            return get.value(card, target) * get.attitude(player3, target);
          }
        }).forResult();
        if (result2?.bool && result2.cards?.length && result2.targets?.length) {
          const {
            cards: cards3,
            targets: [target]
          } = result2;
          player2.addGaintag(cards3, "noname_gongchuang_assigned");
          assigned.addArray(cards3);
          give_map.set(target, (give_map.get(target) || []).concat(cards3));
        } else {
          break;
        }
      }
      if (_status.connectMode) {
        game.broadcastAll(function() {
          delete _status.noclearcountdown;
          game.stopCountChoose();
        });
      }
      player2.line(Array.from(give_map.keys()), "green");
      for (const target of Array.from(give_map.keys()).sortBySeat()) {
        game.log(target, "从", player2, `获得了${get.cnNumber(give_map.get(target).length)}张牌`);
      }
      const cards2 = Array.from(give_map.values()).flat();
      await game.loseAsync({
        gain_list: Array.from(give_map.entries()),
        giver: player2,
        player: player2,
        cards: cards2,
        animate: "giveAuto"
      }).setContent("gaincardMultiple");
      if (cards2.length >= 2) {
        player2.addTempSkill(`${event.name}_directHit`);
      }
      if (cards2.length >= 4) {
        player2.addTempSkill(`${event.name}_draw`);
      }
    },
    addMark(player2, num) {
      num = Math.min(num, 24 - player2.countMark("noname_gongchuang"));
      if (num > 0) {
        player2.addMark("noname_gongchuang", num);
      }
    },
    removeMark(player2, num) {
      player2.removeMark("noname_gongchuang", num);
    },
    markimage: "image/card/noname_bug.png",
    intro: {
      name: "共创（漏洞）",
      name2: "漏洞",
      markcount: "mark",
      content: "mark"
    },
    subSkill: {
      assigned: {
        name: "已分配"
      },
      directHit: {
        charlotte: true,
        priority: 10,
        forced: true,
        popup: false,
        trigger: {
          player: "useCard"
        },
        async content(event, trigger, player2) {
          game.log(trigger.card, "不可响应");
          trigger.directHit.addArray(game.players.concat(game.dead));
        },
        ai: {
          directHit_ai: true,
          skillTagFilter(player2, tag, arg) {
            return;
          }
        }
      },
      draw: {
        charlotte: true,
        trigger: {
          player: "useCard"
        },
        priority: 9,
        forced: true,
        async content(event, trigger, player2) {
          await player2.draw("nodelay");
        }
      }
    }
  },
  huan_duocai: {
    enable: "phaseUse",
    filter(event, player2) {
      return player2.countMark("noname_gongchuang") >= 4;
    },
    getSkills(player2, target) {
      const skills2 = target.getSkills(null, false, false).filter((skill) => {
        const info = get.info(skill);
        if (!info || info.charlotte || info.unique && !info.gainable || player2.hasSkill(skill, null, false, false)) {
          return false;
        }
        return true;
      });
      return skills2;
    },
    filterTarget(card, player2, target) {
      return target != player2 && get.info("huan_duocai").getSkills(player2, target).length;
    },
    async content(event, trigger, player2) {
      get.info("noname_gongchuang").removeMark(player2, 4);
      const { target } = event;
      const skills2 = get.info(event.name).getSkills(player2, target);
      let result2;
      if (skills2.length == 1) {
        result2 = { bool: true, links: skills2 };
      } else {
        result2 = await player2.chooseButton([`多彩：获得${get.translation(target)}的一个技能`, [skills2, "skill"]], true).set("ai", (button) => get.skillRank(button.link, "inout")).forResult();
      }
      const { links } = result2;
      if (links?.length) {
        const [skill] = links;
        player2.flashAvatar(event.name, target.name);
        await player2.addAdditionalSkills(`${event.name}_${target.playerid}`, skill, true);
        if (!get.info(skill).persevereSkill) {
          target.markAuto(`${event.name}_blocker`, skill);
        }
        target.addTempSkill(`${event.name}_blocker`, { player: "phaseAfter" });
      }
    },
    ai: {
      order: 7,
      result: {
        target: -1
      }
    },
    group: ["huan_duocai_target", "huan_duocai_damage"],
    subSkill: {
      target: {
        trigger: {
          target: "useCardToTarget"
        },
        filter(event, player2) {
          return event.player != player2 && player2.countMark("noname_gongchuang") > 0;
        },
        logTarget: "player",
        prompt2: (event, player2) => `移去1枚“漏洞”令${get.translation(event.card)}对你无效`,
        check(event, player2) {
          return get.effect(player2, event.card, event.player, player2) < 0;
        },
        async content(event, trigger, player2) {
          get.info("noname_gongchuang").removeMark(player2, 1);
          game.log(trigger.card, "对", player2, "无效");
          trigger.getParent().excluded.add(player2);
        }
      },
      damage: {
        trigger: {
          player: "damageEnd"
        },
        filter(event, player2) {
          return event.source?.isIn();
        },
        logTarget: "source",
        prompt2(event, player2) {
          return `对其发动一次〖共创〗`;
        },
        check: () => true,
        async content(event, trigger, player2) {
          const next = game.createEvent("noname_gongchuang");
          next.player = player2;
          next.targets = event.targets;
          next.setContent(get.info("noname_gongchuang").content);
          player2.logSkill("noname_gongchuang", event.targets);
          await next;
        }
      },
      blocker: {
        charlotte: true,
        init(player2, skill) {
          player2.addSkillBlocker(skill);
        },
        onremove(player2, skill) {
          delete player2.storage[skill];
          player2.removeSkillBlocker(skill);
          game.players.forEach((target) => target.removeAdditionalSkills(`huan_duocai_${player2.playerid}`));
        },
        skillBlocker(skill, player2) {
          return player2.getStorage("huan_duocai_blocker").includes(skill);
        },
        markimage: "image/card/noname_blocker.png",
        mark: true,
        intro: {
          content: (storage, player2, skill) => storage?.length ? `失效技能：${get.translation(storage)}` : "无失效技能"
        }
      }
    }
  },
  noname_changeGroup: {
    charlotte: true,
    forced: true,
    popup: false,
    trigger: {
      player: ["changeHp", "enterGame"],
      global: "phaseBefore"
    },
    filter(event, player2) {
      if (event.name != "changeHp") {
        return event.name != "phase" || game.phaseNumber == 0;
      }
      return event.player.getHp() > 0;
    },
    async content(event, trigger, player2) {
      const list = ["wu", "wei", "shu", "qun"];
      const hp = player2.getHp();
      if (hp > 0 && hp < 5) {
        const group = list[hp - 1];
        if (player2.group != group) {
          await player2.changeGroup(group);
        }
      }
      if (hp > 4 && player2.group != "shen") {
        await player2.changeGroup("shen");
      }
    }
  },
  //诗笺
  nspianwu: {
    skillTrigger(triggerName, player2, skill) {
      var next = game.createEvent(triggerName, false);
      next.player = player2;
      next.skill = skill;
      next.setContent(async (event, trigger, player3) => {
        event.trigger(event.name);
      });
    },
    init(player2, skill) {
      lib.skill[skill].skillTrigger("shijian_init", player2, skill);
    },
    onremove(player2, skill) {
      lib.skill[skill].skillTrigger("shijian_removeSkill", player2, skill);
    },
    audio: 4,
    trigger: {
      global: "phaseBefore",
      player: ["damageEnd", "phaseJieshuBegin"],
      source: "damageSource"
    },
    forced: true,
    superCharlotte: true,
    charlotte: true,
    fixed: true,
    filter(event, player2, name) {
      if (name == "phaseBefore" && game.phaseNumber != 0) {
        return false;
      }
      if (name == "damageSource" && game.roundNumber > 3) {
        return false;
      }
      return get.is.playerNames(player2, "ns_shijian") || game.ns_shijian?.players?.includes(player2);
    },
    async content(event, trigger, player2) {
      lib.skill[event.name].skillTrigger("shijian_addSkill", player2, event.name);
      player2.chat(["获得技能是随机生成的，请仔细看看。", "是欧皇技能还是非酋技能呢？"].randomGet());
    },
    ai: {
      maixie: true,
      maixie_hp: true
    },
    global: "nspianwu_global",
    subSkill: {
      global: {
        trigger: {
          player: ["shijian_init", "shijian_removeSkill", "shijian_addSkill"]
        },
        filter(event, player2) {
          return event.skill == "nspianwu" && get.is.playerNames(player2, "ns_shijian") || game.ns_shijian?.players?.includes(player2);
        },
        forced: true,
        popup: false,
        async content(event, trigger, player2) {
          switch (event.triggername) {
            case "shijian_init":
              game.ns_shijian = game.ns_shijian || {
                skills: 0,
                players: []
              };
              game.ns_shijian.players.add(player2);
              break;
            case "shijian_removeSkill":
              player2.addSkills(event.skill);
              break;
            case "shijian_addSkill": {
              const newSkill = {
                audio: "nspianwu"
              };
              let newSkillTran = "";
              const skillName = "ns_shijian_createSkill_" + game.ns_shijian.skills++;
              const initList = lib.skill.nspianwu_global.initList;
              let randomInit = null;
              if (Math.random() <= 0.45) {
                randomInit = initList.randomGet();
                newSkillTran += "当你获得此技能时，" + randomInit.translate + "。";
                newSkill.init = randomInit.init;
              }
              let usable = Infinity;
              if (Math.random() <= 0.6) {
                usable = [1, 2, 3].randomGet();
                newSkill.usable = usable;
                newSkillTran += `每回合限${usable}次，`;
              }
              if (Math.random() <= 0.35) {
                newSkill.forced = true;
                newSkillTran += "锁定技，";
              }
              const triggerList = lib.skill.nspianwu_global.triggerList;
              const randomTrigger = triggerList[Math.floor(Math.random() * triggerList.length)];
              if (randomTrigger.noUseable) {
                delete newSkill.usable;
                newSkillTran = newSkillTran.replace(`每回合限${usable}次，`, "");
              }
              const triggerSource = lib.skill.nspianwu_global.triggerSource.filter((v) => {
                if (randomTrigger.noSource && v.target == "source") {
                  return false;
                }
                return true;
              });
              const randomTriggerSource = triggerSource[Math.floor(Math.random() * triggerSource.length)];
              const triggerOpportunity = lib.skill.nspianwu_global.triggerOpportunity.filter((v) => {
                if (randomTrigger.noCancel && Array.isArray(v.trigger) && v.trigger[0] == "Skipped") {
                  return false;
                }
                return true;
              });
              let randomTriggerOpportunity = triggerOpportunity[Math.floor(Math.random() * triggerOpportunity.length)];
              newSkillTran += `当${randomTriggerSource.translate}${randomTrigger.translate}${randomTriggerOpportunity.translate}，`;
              newSkill.trigger = {};
              if (Object.prototype.toString.call(randomTriggerOpportunity.trigger) === "[object Object]") {
                newSkill.trigger = randomTriggerOpportunity.trigger;
              } else if (Array.isArray(randomTriggerOpportunity.trigger)) {
                const triggerArr = [];
                for (const trigger2 of randomTriggerOpportunity.trigger) {
                  triggerArr.push(randomTrigger.trigger + trigger2);
                }
                newSkill.trigger[randomTriggerSource.target] = triggerArr;
              } else {
                newSkill.trigger[randomTriggerSource.target] = randomTrigger.trigger + randomTriggerOpportunity.trigger;
              }
              let randomSkillFilter;
              if (Math.random() <= 0.45) {
                let filterList = lib.skill.nspianwu_global.skillFilterList_onlyPlayer;
                if (randomTriggerSource.target != "player") {
                  filterList = filterList.concat(lib.skill.nspianwu_global.skillFilterList_onlyTarget);
                }
                if (randomTrigger.num) {
                  filterList = filterList.concat(lib.skill.nspianwu_global.skillFilterList_hasNum);
                }
                randomSkillFilter = filterList[Math.floor(Math.random() * filterList.length)];
                if (typeof randomSkillFilter.translate == "string") {
                  newSkillTran += randomSkillFilter.translate + "，";
                } else {
                  newSkillTran += randomSkillFilter.translate(randomTrigger.translate) + "，";
                }
              }
              let contentList = lib.skill.nspianwu_global.skillContentList_onlyPlayer;
              if (randomTriggerSource.target != "player") {
                contentList = contentList.concat(lib.skill.nspianwu_global.skillContentList_onlyTarget);
              }
              if (randomTrigger.num && "End" != randomTriggerOpportunity.trigger && !Array.isArray(randomTriggerOpportunity.trigger)) {
                contentList = contentList.concat(lib.skill.nspianwu_global.skillContentList_hasNum);
              }
              if (!randomTrigger.noCancel && "End" != randomTriggerOpportunity.trigger && !Array.isArray(randomTriggerOpportunity.trigger)) {
                contentList = contentList.concat(lib.skill.nspianwu_global.skillContentList_onlyCancel);
              }
              const exclude = ["摸牌", "伤害", "失去体力", "失去体力上限"];
              const exclude2 = [/摸\S+牌/, /受到\S+伤害/, /失去\S+体力(?!上限)/, /失去\S+体力上限/];
              if (exclude.includes(randomTrigger.translate)) {
                const index = exclude.indexOf(randomTrigger.translate);
                contentList = contentList.filter((list) => exclude2[index].test(list.translate) == false);
              }
              const randomSkillContent = contentList[Math.floor(Math.random() * contentList.length)];
              newSkill.filter = function(event2, player3, name) {
                if (!event2.player.isAlive()) {
                  return false;
                }
                if (typeof randomTrigger.filter == "function") {
                  if (randomTrigger.filter(event2, player3, name) == false) {
                    return false;
                  }
                }
                if (typeof randomSkillContent.filter == "function") {
                  if (randomSkillContent.filter(event2, player3, name) == false) {
                    return false;
                  }
                }
                if (randomSkillFilter) {
                  return randomSkillFilter.filter(event2, player3, name);
                }
                return true;
              };
              newSkillTran += randomSkillContent.translate;
              newSkill.content = randomSkillContent.content;
              if (randomSkillContent.translate == "你额外进行一个回合(每轮限一次)") {
                delete newSkill.usable;
                newSkillTran = newSkillTran.replace(`每回合限${usable}次，`, "");
                newSkill.round = 1;
              }
              newSkill.check = function(event2, player3) {
                let result3 = 0;
                const contentResult = randomSkillContent.result;
                if (randomTrigger.num && lib.skill.nspianwu_global.skillContentList_hasNum.includes(randomSkillContent)) {
                  result3 += contentResult.evtPlayer(event2.player, event2.name);
                } else if (lib.skill.nspianwu_global.skillContentList_onlyCancel.includes(randomSkillContent)) {
                  result3 += contentResult.evtPlayer(event2.player, event2.name);
                } else {
                  if (contentResult.player) {
                    if (typeof contentResult.player == "function") {
                      result3 += contentResult.player(player3, event2.name);
                    } else {
                      result3 += contentResult.player;
                    }
                  } else if (contentResult.evtPlayer) {
                    if (typeof contentResult.evtPlayer == "function") {
                      result3 += contentResult.evtPlayer(event2.player, event2.name);
                    } else {
                      result3 += contentResult.evtPlayer;
                    }
                  }
                }
                if (get.attitude(player3, event2.player) < 0) {
                  const toPlayer = lib.skill.nspianwu_global.skillContentList_onlyPlayer.includes(randomSkillContent);
                  if (!toPlayer) {
                    result3 = -result3;
                  }
                }
                return result3 > 0;
              };
              const skillNameList = [
                "微尘",
                "芷蕊",
                "余念",
                "稚遇",
                "幽殤",
                "代真",
                "淡陌",
                "余念",
                "紫寒",
                "忆伤",
                "酒巷",
                "千兰",
                "之柔",
                "新蕾",
                "稚言",
                "祭心",
                "染尘",
                "未安",
                "奢念",
                "暮兮",
                "曼易",
                "心盲",
                "矜暮",
                "紫蓝",
                "以亦",
                "夏蓉",
                "柒夏",
                "久安",
                "安暖",
                "妙彤",
                "凛然",
                "北觅",
                "晴天",
                "殇忆",
                "卿尘",
                "墨默",
                "拾忆",
                "青琯",
                "黛儿",
                "木槿",
                "初夏",
                "陌然",
                "眸敛",
                "涵双",
                "情寂",
                "陌沫",
                "凉生",
                "暖亦",
                "凉栀",
                "念露",
                "慕青",
                "平蝶",
                "安蕾",
                "如初",
                "挽安",
                "宛海",
                "屿风",
                "幻柏",
                "千寻",
                "妙菡",
                "雨寒",
                "南浔",
                "初雨",
                "梦琪",
                "曼文",
                "栀颜",
                "素笺",
                "哽咽",
                "明眸",
                "陌屿",
                "陌颜",
                "葬情",
                "妄想",
                "断念",
                "惜雪",
                "蝶衣",
                "傲珊",
                "青栀",
                "熙妍",
                "迁心",
                "旧颜",
                "孤音",
                "怜梦",
                "含烟",
                "冷傲",
                "晓灵",
                "浅伤",
                "断城",
                "喜孤",
                "青橙",
                "沦陷",
                "故里",
                "屿暖",
                "紫翠",
                "孤心",
                "淡然",
                "墨兮",
                "南忆",
                "酒笙",
                "归安",
                "暮凉",
                "暖言",
                "亡心",
                "新波",
                "沐兮",
                "非墨",
                "执念",
                "天荷",
                "凡旋",
                "展眉",
                "陌路",
                "顾念",
                "柒安",
                "静枫",
                "泪雨",
                "深碍",
                "如南",
                "拒昧",
                "凡蕾",
                "风吟",
                "冷眸",
                "沛菡",
                "久孤",
                "瘾情",
                "安朵",
                "夏青",
                "凉薄",
                "亦瑶",
                "旧夢",
                "陌若",
                "敬情",
                "雅蕊",
                "厌离",
                "温唇",
                "遇見",
                "妄生",
                "元霜",
                "尔岚",
                "南莲",
                "陌殇",
                "沫忆",
                "若雨",
                "倾忆",
                "芷蕾",
                "呓语",
                "枫溪",
                "凡柔",
                "温瞳",
                "墨轩",
                "花葬",
                "梵心",
                "洛雪",
                "無言",
                "兮颜",
                "清欢"
              ];
              if (!newSkill.trigger.player && !lib.skill.nspianwu_global.skillContentList_onlyPlayer.includes(randomSkillContent)) {
                newSkill.logTarget = (event2) => event2.player;
              }
              if (!newSkill.usable && !newSkill.round) {
                newSkill.usable = 5;
              }
              if (!newSkillTran.endsWith("。")) {
                newSkillTran += "。";
              }
              game.broadcastAll(
                (skill, info, newSkillTranslate, newSkillTran2) => {
                  lib.skill[skill] = info;
                  lib.translate[skill] = newSkillTranslate;
                  lib.translate[skill + "_info"] = newSkillTran2;
                  game.finishSkill(skill);
                },
                skillName,
                newSkill,
                skillNameList.randomGet(),
                newSkillTran
              );
              const next = player2.chooseTarget();
              next.set("filterTarget", lib.filter.notMe);
              next.set("prompt", `是否将【${lib.translate[skillName]}】赠予其他角色？`);
              next.set("prompt2", lib.translate[skillName + "_info"]);
              next.set("ai", (target) => {
                const player3 = _status.event.player;
                const att = get.attitude(player3, target);
                let initResult = 0;
                let initResultOfMe = 0;
                if (randomInit) {
                  if (typeof randomInit.result.player == "function") {
                    initResult += randomInit.result.player(target);
                    initResult += randomInit.result.player(player3);
                  } else if (typeof randomInit.result.player == "number") {
                    initResult += randomInit.result.player;
                    initResultOfMe += randomInit.result.player;
                  }
                }
                if (initResult == -Infinity) {
                  return -att;
                }
                let contentResult = 0, contentResultOfMe = 0, rs = randomSkillContent.result, rp = randomTriggerSource.target, rtr = randomTrigger.result;
                const toTarget = lib.skill.nspianwu_global.skillContentList_onlyPlayer.includes(randomSkillContent);
                if (rtr) {
                  if (typeof rtr.evtPlayer == "function") {
                    rtr = rtr.evtPlayer(target);
                  } else {
                    rtr = rtr.evtPlayer;
                  }
                } else {
                  rtr = 0;
                }
                if (rs.player) {
                  if (typeof rs.player == "function") {
                    contentResult += rs.player(target);
                    contentResultOfMe += rs.player(player3);
                  } else {
                    contentResult += rs.player;
                    contentResultOfMe += rs.player;
                  }
                } else if (rs.evtPlayer) {
                  let result3 = 0;
                  if (typeof rs.evtPlayer == "function") {
                    result3 += rs.evtPlayer(target);
                    if (result3 > 0 && toTarget) {
                      contentResult += result3;
                    } else if (result3 > 0) {
                      contentResult += result3 + 1;
                    } else if (result3 <= 0 && toTarget) {
                      if (lib.skill[skillName].forced) {
                        contentResult += result3 - 3;
                      } else {
                        contentResult += result3 - 2;
                      }
                    } else if (result3 <= 0) {
                      if (lib.skill[skillName].forced) {
                        contentResult += result3 - 3;
                      } else {
                        contentResult -= result3 - 2;
                      }
                    }
                    if (toTarget) {
                      contentResultOfMe += rs.evtPlayer(player3);
                    }
                  } else {
                    if (toTarget) {
                      contentResult += rs.evtPlayer;
                      contentResultOfMe += rs.evtPlayer;
                    } else {
                      if (lib.skill[skillName].forced) {
                        if (rs.evtPlayer > 0) {
                          contentResult += rs.evtPlayer;
                          contentResultOfMe += rs.evtPlayer;
                        } else {
                          contentResult -= rs.evtPlayer;
                          contentResultOfMe -= rs.evtPlayer;
                        }
                      } else {
                        contentResult += rs.evtPlayer;
                        contentResultOfMe += rs.evtPlayer;
                      }
                    }
                  }
                }
                const mySkillLength = player3.skills.filter((skill) => skill.indexOf("ns_shijian_createSkill_") == 0).length;
                if (contentResult > contentResultOfMe && att > 3 && initResult > 0) {
                  return 1e3;
                }
                if (contentResultOfMe > -2 && initResultOfMe > 2) {
                  return 0;
                }
                if (contentResultOfMe > 0 && initResult > -1) {
                  if (mySkillLength < 9) {
                    return 0;
                  }
                  if (game.countPlayer((current) => get.attitude(player3, current) > 3) > 0) {
                    return att;
                  }
                  return 0;
                }
                if (rp != "player") {
                  if (rtr <= 0 && contentResult < 0 && !toTarget) {
                    if (mySkillLength < 9) {
                      return 0;
                    }
                    if (game.countPlayer((current) => get.attitude(player3, current) > 3) > 0) {
                      return att;
                    }
                    return 0;
                  }
                }
                if (contentResult >= 0) {
                  if (mySkillLength < 9) {
                    return 0;
                  }
                  if (game.countPlayer((current) => get.attitude(player3, current) > 3) > 0) {
                    return att;
                  }
                  return 0;
                } else {
                  return 0 - att;
                }
              });
              const result2 = await next.forResult();
              if (result2.bool) {
                player2.line(result2.targets[0]);
                await result2.targets[0].addSkills(skillName);
              } else {
                await player2.addSkills(skillName);
              }
            }
          }
        },
        /**
         * @type skillInit[] 获得技能时的效果列表
         */
        initList: [
          {
            id: "draw",
            init: (player2) => {
              player2.draw();
            },
            translate: "你摸一张牌",
            result: { player: 1 }
          },
          {
            id: "recover",
            init: (player2) => {
              player2.recover();
            },
            translate: "你回复1点体力",
            result: { player: 1 }
          },
          {
            id: "loseHp",
            init: (player2) => {
              player2.loseHp();
            },
            translate: "你失去1点体力",
            result: {
              player: (player2) => player2.hasSkillTag("maihp") ? 1 : -1
            }
          },
          {
            id: "damage",
            init: (player2) => {
              player2.damage(1, "nosource");
            },
            translate: "你受到1点无伤害来源的伤害",
            result: {
              // TODO maixie和maixie_hp的区别
              player: (player2) => player2.hasSkillTag("maixie") ? 1 : -1
            }
          },
          {
            id: "recover",
            init: (player2) => {
              player2.recover(player2.maxHp - player2.hp);
            },
            translate: "你将体力值回复至体力上限",
            result: {
              player: (player2) => player2.maxHp - player2.hp
            }
          },
          {
            id: "chooseToDiscard",
            init: (player2) => {
              player2.countCards("he") && player2.chooseToDiscard("he", true);
            },
            translate: "你需弃置一张牌",
            result: {
              player: (player2) => {
                if (player2.countCards("he") == 0) {
                  return 0;
                }
                if (player2.hasSkillTag("nodiscard")) {
                  return 1;
                }
                return -1;
              }
            }
          },
          {
            id: "link",
            init: (player2) => {
              player2.link(true);
            },
            translate: "你横置",
            result: {
              player: (player2) => {
                if (player2.hasSkillTag("noLink")) {
                  return 0;
                }
                if (player2.hasSkillTag("nofire") && player2.hasSkillTag("nothunder")) {
                  return 0;
                }
                return player2.isLinked() ? 1 : -1;
              }
            }
          },
          {
            id: "gainMaxHp",
            init: (player2) => {
              player2.gainMaxHp();
            },
            translate: "你增加1点体力上限",
            result: { player: 1 }
          },
          {
            id: "loseMaxHp",
            init: (player2) => {
              player2.loseMaxHp();
            },
            translate: "你失去1点体力上限",
            result: { player: -2 }
          },
          {
            id: "getBuff",
            init: (player2) => {
              player2.getBuff();
            },
            translate: "你随机获得一个正面效果",
            result: { player: 1 }
          },
          {
            id: "getDebuff",
            init: (player2) => {
              player2.getDebuff();
            },
            translate: "你随机获得一个负面效果",
            result: { player: -1 }
          },
          {
            id: "tempHide",
            init: (player2) => {
              player2.tempHide();
            },
            translate: "你获得【潜行】到你的回合开始",
            result: { player: 3 }
          },
          {
            id: "gainEquip",
            init: (player2) => {
              const card = get.cardPile2((card2) => get.type(card2) == "equip");
              if (card) {
                player2.equip(card);
              }
            },
            translate: "你随机从牌堆中装备一张装备牌(若有)",
            result: { player: 2 }
          },
          {
            id: "gainBasic",
            init: (player2) => {
              const card = get.cardPile2((card2) => get.type(card2) == "basic");
              if (card) {
                player2.gain(card, "gain2", "log");
              }
            },
            translate: "你随机从牌堆中获得一张基本牌(若有)",
            result: { player: 2 }
          },
          {
            id: "gainTrick",
            init: (player2) => {
              const card = get.cardPile2((card2) => get.type(card2) == "trick");
              if (card) {
                player2.gain(card, "gain2", "log");
              }
            },
            translate: "你随机从牌堆中获得一张普通锦囊牌(若有)",
            result: { player: 2 }
          },
          {
            id: "gainDelay",
            init: (player2) => {
              const card = get.cardPile2((card2) => get.type(card2) == "delay");
              if (card) {
                player2.gain(card, "gain2", "log");
              }
            },
            translate: "你随机从牌堆中获得一张延时锦囊牌(若有)",
            result: { player: 2 }
          },
          {
            id: "die",
            init: (player2) => {
              player2.die();
            },
            translate: "你死亡",
            result: { player: -Infinity }
          }
        ],
        /**
         * @type triggerOpportunity[] 触发技的前，中，后，取消后，跳过后
         */
        triggerOpportunity: [
          {
            trigger: "Before",
            translate: "前"
          },
          {
            trigger: "Begin",
            translate: "时"
          },
          {
            trigger: "End",
            translate: "后"
          },
          {
            trigger: ["Skipped", "Cancelled"],
            translate: "被跳过或取消后"
          }
        ],
        /**
         * @type skillTrigger[] 触发技能的时机
         */
        triggerList: [
          {
            trigger: "damage",
            translate: "受到伤害",
            num: true,
            result: {
              evtPlayer: -1
            }
          },
          {
            trigger: "recover",
            translate: "回复体力",
            num: true,
            result: {
              evtPlayer: 1
            }
          },
          {
            trigger: "loseHp",
            translate: "失去体力",
            num: true,
            noSource: true,
            result: {
              evtPlayer: -1
            }
          },
          {
            trigger: "gainMaxHp",
            translate: "增加体力上限",
            num: true,
            noSource: true,
            result: {
              evtPlayer: 1
            }
          },
          {
            trigger: "loseMaxHp",
            translate: "失去体力上限",
            num: true,
            noSource: true,
            result: {
              evtPlayer: -1
            }
          },
          {
            trigger: {
              player: "loseAfter",
              global: "loseAsyncAfter"
            },
            translate: "失去的牌因弃置而进入弃牌堆后",
            filter(event, player2) {
              if (event.type !== "discard" || event.getlx === false) {
                return false;
              }
              return event.getl?.(player2)?.cards2?.some((card) => get.position(card) === "d");
            },
            noSource: true,
            noCancel: true
          },
          {
            trigger: "phaseDraw",
            translate: "摸牌阶段",
            num: true,
            noSource: true,
            noUseable: true,
            result: {
              evtPlayer: 1
            }
          },
          {
            trigger: "phaseJudge",
            translate: "判定阶段",
            noSource: true,
            noUseable: true,
            result: {
              evtPlayer: 0
            }
          },
          {
            trigger: "phaseDiscard",
            translate: "弃牌阶段",
            noSource: true,
            noUseable: true,
            result: {
              evtPlayer: 0
            }
          },
          {
            trigger: "draw",
            translate: "摸牌",
            noSource: true,
            result: {
              evtPlayer: 1
            }
          },
          {
            trigger: "judge",
            translate: "判定",
            noCancel: true,
            noSource: true
          },
          {
            trigger: "turnOver",
            translate: "翻面",
            noSource: true,
            result: {
              evtPlayer: (player2) => {
                if (player2.hasSkillTag("noturn")) {
                  return 0;
                }
                return player2.isTurnedOver() ? 1 : -1;
              }
            }
          },
          {
            trigger: "link",
            translate: "横置/重置",
            noSource: true,
            result: {
              evtPlayer: (player2) => {
                if (player2.hasSkillTag("noLink")) {
                  return 0;
                }
                if (player2.hasSkillTag("nofire") && player2.hasSkillTag("nothunder")) {
                  return 0;
                }
                return player2.isLinked() ? 1 : -1;
              }
            }
          },
          {
            trigger: "useCard",
            translate: "使用牌",
            noCancel: true,
            noSource: true
          },
          {
            trigger: "useSkill",
            translate: "使用主动技能",
            noCancel: true,
            noSource: true
          },
          {
            trigger: "addJudge",
            translate: "的判定区添加延时锦囊",
            noCancel: true,
            noSource: true,
            result: {
              evtPlayer: (player2) => {
                if (player2.hasSkill("reqianxun") && player2.hasSkillTag("nolose")) {
                  return 1;
                }
                if (player2.hasSkill("xinleiji")) {
                  return 1;
                }
                return -1;
              }
            }
          }
        ],
        /**
         * @type triggerSource[] 时机触发者列表
         */
        triggerSource: [
          {
            target: "player",
            translate: "你"
          },
          {
            target: "source",
            translate: "以你为来源的角色"
          },
          {
            target: "global",
            translate: "一名角色"
          }
        ],
        /**
         * @type skillFilter[] 技能发动条件(仅player)
         */
        skillFilterList_onlyPlayer: [
          {
            filter(event, player2) {
              return player2.hp > 2;
            },
            translate: "若你的体力值大于2"
          },
          {
            filter(event, player2) {
              return player2.hp < 2;
            },
            translate: "若你的体力值小于2"
          },
          {
            filter(event, player2) {
              return player2.countCards("j") > 0;
            },
            translate: "若你的判定区内有牌"
          },
          {
            filter(event, player2) {
              return !player2.countCards("j");
            },
            translate: "若你的判定区内没有牌"
          },
          {
            filter(event, player2) {
              return !player2.countCards("h");
            },
            translate: "若你没有手牌"
          },
          {
            filter(event, player2) {
              return !player2.getHistory("useCard");
            },
            translate: "若你本回合没有使用过牌"
          },
          {
            filter(event, player2) {
              return player2.getHistory("useCard").length > 0;
            },
            translate: "若你本回合使用过牌"
          },
          {
            filter(event, player2) {
              return !player2.getHistory("respond");
            },
            translate: "若你本回合没有打出过牌"
          },
          {
            filter(event, player2) {
              return player2.isDamaged();
            },
            translate: "若你已受伤"
          },
          {
            filter(event, player2) {
              return player2.isHealthy();
            },
            translate: "若你的体力值为满"
          },
          {
            filter(event, player2) {
              return player2.isMaxHp();
            },
            translate: "若你的体力值为全场最多（或之一）"
          },
          {
            filter(event, player2) {
              return player2.isMaxHp(true);
            },
            translate: "若你的体力值为全场最多"
          },
          {
            filter(event, player2) {
              return player2.isMinHp();
            },
            translate: "若你的体力值为全场最少（或之一）"
          },
          {
            filter(event, player2) {
              return player2.isMinHp(true);
            },
            translate: "若你的体力值为全场最少"
          },
          {
            filter(event, player2) {
              return player2.isMaxCard();
            },
            translate: "若你的牌为全场最多（或之一）"
          },
          {
            filter(event, player2) {
              return player2.isMaxCard(true);
            },
            translate: "若你的牌为全场最多"
          },
          {
            filter(event, player2) {
              return player2.isMinCard();
            },
            translate: "若你的牌为全场最少（或之一）"
          },
          {
            filter(event, player2) {
              return player2.isMinCard(true);
            },
            translate: "若你的牌为全场最少"
          },
          {
            filter(event, player2) {
              return player2.isMaxHandcard();
            },
            translate: "若你的手牌为全场最多（或之一）"
          },
          {
            filter(event, player2) {
              return player2.isMaxHandcard(true);
            },
            translate: "若你的手牌为全场最多"
          },
          {
            filter(event, player2) {
              return player2.isMinHandcard();
            },
            translate: "若你的手牌为全场最少（或之一）"
          },
          {
            filter(event, player2) {
              return player2.isMinHandcard(true);
            },
            translate: "若你的手牌为全场最少"
          },
          {
            filter(event, player2) {
              return player2.isMaxEquip();
            },
            translate: "若你装备区的牌为全场最多（或之一）"
          },
          {
            filter(event, player2) {
              return player2.isMaxEquip(true);
            },
            translate: "若你装备区的牌为全场最多"
          },
          {
            filter(event, player2) {
              return player2.isMinEquip();
            },
            translate: "若你装备区的牌为全场最少（或之一）"
          },
          {
            filter(event, player2) {
              return player2.isMinEquip(true);
            },
            translate: "若你装备区的牌为全场最少"
          },
          {
            filter(event, player2) {
              return player2.getPrevious() != player2 && player2.getPrevious().hp > 1;
            },
            translate: "若你的上家（不为自己）的体力值大于1"
          },
          {
            filter(event, player2) {
              return player2.getPrevious() != player2 && player2.getPrevious().hp == 1;
            },
            translate: "若你的上家（不为自己）的体力值等于1"
          },
          {
            filter(event, player2) {
              return player2.getPrevious() != player2 && player2.getPrevious().countCards("h") > 2;
            },
            translate: "若你的上家（不为自己）的手牌数大于2"
          },
          {
            filter(event, player2) {
              return player2.getPrevious() != player2 && !player2.getPrevious().countCards("h");
            },
            translate: "若你的上家（不为自己）没有手牌"
          },
          {
            filter(event, player2) {
              return player2.getPrevious() != player2 && player2.getPrevious().getHistory("useCard").length > 0;
            },
            translate: "若你的上家（不为自己）本回合使用过牌"
          },
          {
            filter(event, player2) {
              return player2.getPrevious() != player2 && !player2.getPrevious().getHistory("respond");
            },
            translate: "若你的上家（不为自己）本回合没有打出过牌"
          },
          {
            filter(event, player2) {
              return player2.getPrevious() != player2 && player2.getPrevious().isDamaged();
            },
            translate: "若你的上家（不为自己）已受伤"
          },
          {
            filter(event, player2) {
              return player2.getPrevious() != player2 && player2.getPrevious().isHealthy();
            },
            translate: "若你的上家（不为自己）的体力值为满"
          },
          {
            filter(event, player2) {
              return player2.getNext() != player2 && player2.getNext().hp > 1;
            },
            translate: "若你的下家（不为自己）的体力值大于1"
          },
          {
            filter(event, player2) {
              return player2.getNext() != player2 && player2.getNext().hp == 1;
            },
            translate: "若你的下家（不为自己）的体力值等于1"
          },
          {
            filter(event, player2) {
              return player2.getNext() != player2 && player2.getNext().countCards("h") > 2;
            },
            translate: "若你的下家（不为自己）的手牌数大于2"
          },
          {
            filter(event, player2) {
              return player2.getNext() != player2 && !player2.getNext().countCards("h");
            },
            translate: "若你的下家（不为自己）没有手牌"
          },
          {
            filter(event, player2) {
              return player2.getNext() != player2 && player2.getNext().getHistory("useCard").length > 0;
            },
            translate: "若你的下家（不为自己）本回合使用过牌"
          },
          {
            filter(event, player2) {
              return player2.getNext() != player2 && !player2.getNext().getHistory("respond");
            },
            translate: "若你的下家（不为自己）本回合没有打出过牌"
          },
          {
            filter(event, player2) {
              return player2.getNext() != player2 && player2.getNext().isDamaged();
            },
            translate: "若你的下家（不为自己）已受伤"
          },
          {
            filter(event, player2) {
              return player2.getNext() != player2 && player2.getNext().isHealthy();
            },
            translate: "若你的下家（不为自己）的体力值为满"
          }
        ],
        /**
         * @type skillFilter[] 技能发动条件(仅trigger.player)
         */
        skillFilterList_onlyTarget: [
          {
            filter(event, player2) {
              return event.player.hp > 1;
            },
            translate: "若其的体力值大于1"
          },
          {
            filter(event, player2) {
              return event.player.countCards("h", "sha") > 0;
            },
            translate: "若其手牌中有【杀】"
          },
          {
            filter(event, player2) {
              return event.player.isDamaged();
            },
            translate: "若其已受伤"
          },
          {
            filter(event, player2) {
              return event.player.isHealthy();
            },
            translate: "若其的体力值为满"
          },
          {
            filter(event, player2) {
              return event.player.isMaxHp();
            },
            translate: "若其的体力值为全场最多（或之一）"
          },
          {
            filter(event, player2) {
              return event.player.isMaxHp(true);
            },
            translate: "若其的体力值为全场最多"
          },
          {
            filter(event, player2) {
              return event.player.isMinHp();
            },
            translate: "若其的体力值为全场最少（或之一）"
          },
          {
            filter(event, player2) {
              return event.player.isMinHp(true);
            },
            translate: "若其的体力值为全场最少"
          },
          {
            filter(event, player2) {
              return event.player.isMaxCard();
            },
            translate: "若其的牌为全场最多（或之一）"
          },
          {
            filter(event, player2) {
              return event.player.isMaxCard(true);
            },
            translate: "若其的牌为全场最多"
          },
          {
            filter(event, player2) {
              return event.player.isMinCard();
            },
            translate: "若其的牌为全场最少（或之一）"
          },
          {
            filter(event, player2) {
              return event.player.isMinCard(true);
            },
            translate: "若其的牌为全场最少"
          },
          {
            filter(event, player2) {
              return event.player.isMaxHandcard();
            },
            translate: "若其的手牌为全场最多（或之一）"
          },
          {
            filter(event, player2) {
              return event.player.isMaxHandcard(true);
            },
            translate: "若其的手牌为全场最多"
          },
          {
            filter(event, player2) {
              return event.player.isMinHandcard();
            },
            translate: "若其的手牌为全场最少（或之一）"
          },
          {
            filter(event, player2) {
              return event.player.isMinHandcard(true);
            },
            translate: "若其的手牌为全场最少"
          },
          {
            filter(event, player2) {
              return event.player.isMaxEquip();
            },
            translate: "若其装备区的牌为全场最多（或之一）"
          },
          {
            filter(event, player2) {
              return event.player.isMaxEquip(true);
            },
            translate: "若其装备区的牌为全场最多"
          },
          {
            filter(event, player2) {
              return event.player.isMinEquip();
            },
            translate: "若其装备区的牌为全场最少（或之一）"
          },
          {
            filter(event, player2) {
              return event.player.isMinEquip(true);
            },
            translate: "若其装备区的牌为全场最少"
          }
        ],
        /**
         * @type skillFilter[] 技能发动条件(仅trigger.num存在)
         */
        skillFilterList_hasNum: [
          {
            filter(event, player2) {
              return event.num && event.num > 1;
            },
            translate: (translate) => `若${translate}的点数大于1`
          },
          {
            filter(event, player2) {
              return event.num && event.num > 2;
            },
            translate: (translate) => `若${translate}的点数大于2`
          }
        ],
        /**
         * @type skillContent[] 技能发动效果(仅player)
         */
        skillContentList_onlyPlayer: [
          {
            async content(event, trigger, player2) {
              player2.insertPhase();
            },
            translate: "你在此回合结束后执行一个额外回合(每轮限一次)",
            result: {
              player: 2
            }
          },
          {
            async content(event, trigger, player2) {
              player2.chat("草，怎么是空技能");
            },
            translate: "undefined",
            result: {
              player: 1
            }
          },
          {
            async content(event, trigger, player2) {
              player2.draw();
            },
            translate: "你摸一张牌",
            result: {
              player: 1
            }
          },
          {
            async content(event, trigger, player2) {
              player2.draw(2);
            },
            translate: "你摸两张牌",
            result: {
              player: 2
            }
          },
          {
            async content(event, trigger, player2) {
              player2.draw(3);
            },
            translate: "你摸三张牌",
            result: {
              player: 3
            }
          },
          {
            async content(event, trigger, player2) {
              player2.recover();
            },
            translate: "你回复1点体力",
            filter: (event, player2) => !player2.isHealthy(),
            result: {
              player: (player2) => player2.isHealthy() ? 0 : 1
            }
          },
          {
            async content(event, trigger, player2) {
              player2.recover(player2.maxHp - player2.hp);
            },
            translate: "你回复体力至体力上限",
            filter: (event, player2) => !player2.isHealthy(),
            result: {
              player: (player2) => player2.isHealthy() ? 0 : player2.maxHp - player2.hp
            }
          },
          {
            async content(event, trigger, player2) {
              player2.damage("nocard", "nosource");
            },
            translate: "你受到1点无来源的伤害",
            result: {
              player: (player2) => player2.hasSkillTag("maixie") ? 1 : -1
            }
          },
          {
            async content(event, trigger, player2) {
              player2.loseHp();
            },
            translate: "你失去1点体力",
            result: {
              player: (player2) => player2.hasSkillTag("maihp") ? 1 : -1
            }
          },
          {
            async content(event, trigger, player2) {
              player2.chooseToDiscard("he", true);
            },
            filter: (event, player2) => player2.countCards("he") > 0,
            translate: "你需弃置一张牌",
            result: {
              player: (player2) => {
                if (player2.countCards("he") == 0) {
                  return 0;
                }
                if (player2.hasSkillTag("nodiscard")) {
                  return 1;
                }
                return -1;
              }
            }
          },
          {
            async content(event, trigger, player2) {
              player2.gainMaxHp();
            },
            translate: "你增加1点体力上限",
            result: {
              player: 1
            }
          },
          {
            async content(event, trigger, player2) {
              player2.loseMaxHp();
            },
            translate: "你减少1点体力上限",
            result: {
              player: (player2) => player2.maxHp == 1 ? -Infinity : -3
            }
          },
          {
            async content(event, trigger, player2) {
              player2.die();
            },
            translate: "你立即阵亡",
            result: {
              player: -Infinity
            }
          },
          {
            async content(event, trigger, player2) {
              player2.turnOver();
            },
            translate: "你翻面",
            result: {
              player: (player2) => {
                if (player2.hasSkillTag("noturn")) {
                  return 0;
                }
                return player2.isTurnedOver() ? 1 : -1;
              }
            }
          },
          {
            async content(event, trigger, player2) {
              player2.link();
            },
            translate: "你横置/重置",
            result: {
              player: (player2) => {
                if (player2.hasSkillTag("noLink")) {
                  return 0;
                }
                if (player2.hasSkillTag("nofire") && player2.hasSkillTag("nothunder")) {
                  return 0;
                }
                return player2.isLinked() ? 1 : -1;
              }
            }
          },
          {
            async content(event, trigger, player2) {
              const next = player2.judge((card) => {
                if (get.color(card) == "red") {
                  return 2;
                }
                return -0.5;
              });
              next.judge2 = (result3) => {
                return result3.bool;
              };
              const result2 = await next.forResult();
              if (result2.bool) {
                const nextx = player2.chooseTarget(lib.filter.notMe);
                next.ai = function(target) {
                  const player3 = _status.event.player;
                  return get.damageEffect(target, player3, player3);
                };
                const resultx = await nextx.forResult();
                if (resultx.bool) {
                  player2.line(resultx.targets);
                  resultx.targets[0].damage(1);
                }
              }
            },
            translate: "你进行一次判定, 若结果为红色，你可以对一名其他角色造成1点伤害",
            result: {
              player: (player2) => player2.hasSkill("tiandu") || player2.hasSkill("xinleiji") ? 3 : 1
            }
          },
          {
            async content(event, trigger, player2) {
              player2.getBuff();
            },
            translate: "你随机获得一个正面效果",
            result: {
              player: 1
            }
          },
          {
            async content(event, trigger, player2) {
              player2.tempHide();
            },
            translate: "你获得【潜行】到你的回合开始",
            result: {
              player: 3
            },
            filter: (event, player2) => !player2.hasSkill("qianxing")
          },
          {
            async content(event, trigger, player2) {
              var card = get.cardPile2((card2) => get.type(card2) == "equip");
              if (card) {
                await player2.equip(card);
              }
            },
            translate: "你随机从牌堆中装备一张装备牌",
            result: {
              player: 2
            }
          },
          {
            async content(event, trigger, player2) {
              var card = get.cardPile2((card2) => get.type(card2) == "basic");
              if (card) {
                await player2.gain(card, "gain2", "log");
              }
            },
            translate: "你随机从牌堆中获得一张基本牌",
            result: {
              player: 2
            }
          },
          {
            async content(event, trigger, player2) {
              var card = get.cardPile2((card2) => get.type(card2) == "trick");
              if (card) {
                await player2.gain(card, "gain2", "log");
              }
            },
            translate: "你随机从牌堆中获得一张普通锦囊牌",
            result: {
              player: 2
            }
          },
          {
            async content(event, trigger, player2) {
              var card = get.cardPile2((card2) => get.type(card2) == "delay");
              if (card) {
                await player2.gain(card, "gain2", "log");
              }
            },
            translate: "你随机从牌堆中获得一张延时锦囊牌",
            result: {
              player: 2
            }
          },
          {
            async content(event, trigger, player2) {
              let cards2 = get.cards(3);
              await game.cardsGotoOrdering(cards2);
              await player2.showCards(cards2);
              var num = 0;
              for (var i = 0; i < cards2.length; i++) {
                if (get.suit(cards2[i]) == "heart") {
                  num++;
                  cards2.splice(i--, 1);
                }
              }
              if (num) {
                await player2.recover(num);
              }
              if (cards2.length) {
                await player2.gain(event.cards, "gain2");
                game.delay();
              }
            },
            translate: "你展示牌堆顶的三张牌，然后回复X点体力（X为其中红桃牌数目），然后你将其中的红桃牌置于弃牌堆，并获得其他牌",
            result: {
              player: 3
            }
          },
          {
            async content(event, trigger, player2) {
              await player2.chooseToUse();
            },
            translate: "你可以立即使用一张牌",
            filter(event, player2) {
              return player2.countCards("h") > 0;
            },
            result: {
              player: (player2) => player2.countCards("h") > 0 ? 1 : 0
            }
          },
          {
            async content(event, trigger, player2) {
              player2.addTempSkill("fengyin");
            },
            translate: "本回合你的非锁定技失效",
            filter: (event, player2) => !player2.hasSkill("fengyin"),
            result: {
              player: -2
            }
          }
        ],
        /**
         * @type skillContent[] 技能发动效果(仅trigger.player)
         */
        skillContentList_onlyTarget: [
          {
            async content(event, trigger, player2) {
              trigger.player.draw();
            },
            translate: "其摸一张牌",
            result: {
              evtPlayer: 1
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.player.draw(2);
            },
            translate: "其摸两张牌",
            result: {
              evtPlayer: 2
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.player.recover();
            },
            translate: "其回复1点体力",
            filter: (event, player2) => !event.player.isHealthy(),
            result: {
              evtPlayer: (player2) => player2.isHealthy() ? 0 : 1
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.player.damage("nocard", player2);
            },
            translate: "其受到1点来自于你的伤害",
            result: {
              evtPlayer: (player2) => player2.hasSkillTag("maixie") ? 1 : -1
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.player.damage(2, "nocard", player2);
            },
            translate: "其受到两点来自于你的伤害",
            result: {
              evtPlayer: (player2) => player2.hasSkillTag("maixie") && player2.hp > 2 ? 2 : -2
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.player.loseHp();
            },
            translate: "其失去1点体力",
            result: {
              evtPlayer: (player2) => player2.hasSkillTag("maihp") ? 1 : -1
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.player.chooseToDiscard("he", true);
            },
            filter: (event, player2) => event.player.countCards("he") > 0,
            translate: "其需弃置一张牌",
            result: {
              evtPlayer: (player2) => {
                if (player2.countCards("he") == 0) {
                  return 0;
                }
                if (player2.hasSkillTag("nodiscard")) {
                  return 1;
                }
                return -1;
              }
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.player.gainMaxHp();
            },
            translate: "其增加1点体力上限",
            result: {
              evtPlayer: 1
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.player.loseMaxHp();
            },
            translate: "其失去1点体力上限",
            result: {
              evtPlayer: (player2) => player2.maxHp == 1 ? -Infinity : -2
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.player.turnOver();
            },
            translate: "其翻面",
            result: {
              evtPlayer: (player2) => {
                if (player2.hasSkillTag("noturn")) {
                  return 0;
                }
                return player2.isTurnedOver() ? 1 : -1;
              }
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.player.link();
            },
            translate: "其横置/重置",
            result: {
              evtPlayer: (player2) => {
                if (player2.hasSkillTag("noLink")) {
                  return 0;
                }
                if (player2.hasSkillTag("nofire") && player2.hasSkillTag("nothunder")) {
                  return 0;
                }
                return player2.isLinked() ? 1 : -1;
              }
            }
          },
          {
            async content(event, trigger, player2) {
              const next = trigger.player.judge((card) => {
                if (get.color(card) == "black") {
                  return 2;
                }
                return -0.5;
              });
              next.judge2 = (result3) => {
                return result3.bool;
              };
              const result2 = next.forResult();
              if (result2.bool) {
                trigger.player.chooseDrawRecover();
              }
            },
            translate: "其进行一次判定，若结果为黑色，其选择摸牌或者回血",
            result: {
              evtPlayer: (player2) => player2.hasSkill("tiandu") || player2.hasSkill("xinleiji") ? 3 : 1
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.player.die();
            },
            translate: "其立即阵亡",
            result: {
              evtPlayer: -Infinity
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.player.getBuff();
            },
            translate: "其随机获得一个正面效果",
            result: {
              evtPlayer: 1
            }
          },
          {
            async content(event, trigger, player2) {
              var card = get.cardPile2((card2) => get.type(card2) == "equip");
              if (card) {
                await trigger.player.equip(card);
              }
            },
            translate: "其随机从牌堆中装备一张装备牌",
            result: {
              evtPlayer: 2
            }
          },
          {
            async content(event, trigger, player2) {
              var card = get.cardPile2((card2) => get.type(card2) == "basic");
              if (card) {
                await trigger.player.gain(card, "gain2", "log");
              }
            },
            translate: "其随机从牌堆中获得一张基本牌",
            result: {
              evtPlayer: 2
            }
          },
          {
            async content(event, trigger, player2) {
              var card = get.cardPile2((card2) => get.type(card2) == "trick");
              if (card) {
                await trigger.player.gain(card, "gain2", "log");
              }
            },
            translate: "其随机从牌堆中获得一张普通锦囊牌",
            result: {
              evtPlayer: 2
            }
          },
          {
            async content(event, trigger, player2) {
              var card = get.cardPile2((card2) => get.type(card2) == "delay");
              if (card) {
                await trigger.player.gain(card, "gain2", "log");
              }
            },
            translate: "其随机从牌堆中获得一张延时锦囊牌",
            result: {
              evtPlayer: 2
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.player.chooseToUse();
            },
            translate: "其可以立即使用一张牌",
            filter(event, player2) {
              return event.player.countCards("h") > 0;
            },
            result: {
              evtPlayer: (player2) => player2.countCards("h") > 0 ? 1 : 0
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.player.addTempSkill("fengyin");
            },
            filter(event, player2) {
              return !event.player.hasSkill("fengyin");
            },
            translate: "本回合其的非锁定技失效",
            result: {
              evtPlayer: -2
            }
          }
        ],
        /**
         * @type skillContent[] 技能发动效果(仅trigger.num存在)
         */
        skillContentList_hasNum: [
          {
            async content(event, trigger, player2) {
              trigger.num++;
            },
            translate: "该数值+1",
            result: {
              evtPlayer(player2, triggerName) {
                if (["damage", "loseHp", "loseMaxHp"].includes(triggerName)) {
                  return -1;
                }
                return 1;
              }
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.num += 2;
            },
            translate: "该数值+2",
            result: {
              evtPlayer(player2, triggerName) {
                if (["damage", "loseHp", "loseMaxHp"].includes(triggerName)) {
                  return -2;
                }
                return 2;
              }
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.num--;
            },
            translate: "该数值-1",
            result: {
              evtPlayer(player2, triggerName) {
                if (["damage", "loseHp", "loseMaxHp"].includes(triggerName)) {
                  return 1;
                }
                return -1;
              }
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.num -= 2;
            },
            translate: "该数值-2",
            result: {
              evtPlayer(player2, triggerName) {
                if (["damage", "loseHp", "loseMaxHp"].includes(triggerName)) {
                  return 2;
                }
                return -2;
              }
            }
          },
          {
            async content(event, trigger, player2) {
              trigger.num *= 2;
            },
            translate: "该数值乘2",
            result: {
              evtPlayer(player2, triggerName) {
                if (["damage", "loseHp", "loseMaxHp"].includes(triggerName)) {
                  return -2;
                }
                return 2;
              }
            }
          }
        ],
        /**
         * @type skillContent[] 技能发动效果(仅可取消的时机可用)
         */
        skillContentList_onlyCancel: [
          {
            async content(event, trigger, player2) {
              trigger.cancel();
            },
            translate: "取消该效果",
            result: {
              evtPlayer(player2, triggerName) {
                if (["damage", "loseHp", "loseMaxHp", "addJudge"].includes(triggerName)) {
                  return 1;
                }
                return -2;
              }
            }
          }
        ]
      }
    }
  },
  //派对浪客
  nsxingyun: {
    audio: 2,
    enable: "chooseToUse",
    getSixiang(card) {
      if (typeof card == "string") {
        card = { name: card };
      }
      if (card.name == "shan") {
        return "玄武";
      }
      var type = get.type(card, null, false);
      if (type == "delay") {
        return "朱雀";
      }
      if (get.tag(card, "damage")) {
        return "白虎";
      }
      if (get.tag(card, "recover")) {
        return "玄武";
      }
      if (type == "trick") {
        return "青龙";
      }
      return false;
    },
    filter(event, player2) {
      if (player2.hasSkill("nsxingyun_round")) {
        return false;
      }
      var list = player2.getStorage("nsxingyun");
      if (list.length >= 4) {
        return false;
      }
      for (var i of lib.inpile) {
        var type = lib.skill.nsxingyun.getSixiang(i);
        if (!type || list.includes(type)) {
          continue;
        }
        if (event.filterCard(get.autoViewAs({ name: i }, "unsure"), player2, event)) {
          return true;
        }
        if (i == "sha") {
          for (var j of lib.inpile_nature) {
            if (event.filterCard(get.autoViewAs({ name: i, nature: j }, "unsure"), player2, event)) {
              return true;
            }
          }
        }
      }
      return false;
    },
    chooseButton: {
      dialog(event, player2) {
        var map = { 青龙: [], 朱雀: [], 白虎: [], 玄武: [] };
        var list = player2.getStorage("nsxingyun");
        for (var i of lib.inpile) {
          var type = lib.skill.nsxingyun.getSixiang(i);
          if (!type || list.includes(type)) {
            continue;
          }
          if (event.filterCard({ name: i }, player2, event)) {
            map[type].push([get.type2(i, false), "", i]);
          }
          if (i == "sha") {
            for (var j of lib.inpile_nature) {
              if (event.filterCard({ name: i, nature: j }, player2, event)) {
                map[type].push([get.type2(i, false), "", i, j]);
              }
            }
          }
        }
        var dialog = ["星陨", "hidden"];
        for (var i in map) {
          if (map[i].length > 0) {
            dialog.push('<div class="text center">' + i + "</div>");
            dialog.push([map[i], "vcard"]);
          }
        }
        return ui.create.dialog.apply(ui.create, dialog);
      },
      filter(button, player2) {
        return _status.event.getParent().filterCard(
          {
            name: button.link[2],
            nature: button.link[3]
          },
          player2,
          _status.event.getParent()
        );
      },
      check(button) {
        if (_status.event.getParent().type != "phase") {
          return 1;
        }
        return _status.event.player.getUseValue(
          {
            name: button.link[2],
            nature: button.link[3]
          },
          false
        );
      },
      backup(links, player2) {
        return {
          selectCard: 1,
          filterCard: true,
          popname: true,
          position: "hs",
          check(card) {
            return 7 - get.value(card);
          },
          viewAs: { name: links[0][2], nature: links[0][3] },
          async precontent(event, trigger, player3) {
            player3.addTempSkill("nsxingyun_round");
          }
        };
      },
      prompt(links, player2) {
        return "将一张手牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
      }
    },
    ai: {
      threaten: 2.6,
      order: 1,
      result: { player: 1 }
    },
    group: "nsxingyun_clear",
    derivation: ["nsxingyun_faq", "bazhen"],
    subSkill: {
      backup: {},
      clear: {
        trigger: { player: "useCardAfter" },
        forced: true,
        popup: false,
        filter(event, player2) {
          return event.skill == "nsxingyun_backup" && event.cards.length == 1 && lib.skill.nsxingyun.getSixiang(event.card) != lib.skill.nsxingyun.getSixiang(event.cards[0]) && !player2.getStorage("nsxingyun").includes(lib.skill.nsxingyun.getSixiang(event.card));
        },
        async content(event, trigger, player2) {
          await player2.draw({ num: 2 });
          player2.markAuto("nsxingyun", [lib.skill.nsxingyun.getSixiang(trigger.card)]);
          if (player2.getStorage("nsxingyun").length >= 4) {
            await player2.addSkills("bazhen");
          }
        }
      },
      round: {
        charlotte: true,
        onremove: true
      }
    }
  },
  nshanlang: {
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player2) {
      return player2.countCards("h") > 0 && game.hasPlayer((current) => player2 != current && player2.canCompare(current));
    },
    async cost(event, trigger, player2) {
      const goon = player2.hasCard(function(card) {
        return get.value(card) <= 7;
      }, "h");
      event.result = await player2.chooseTarget([1, 3], get.prompt(event.skill), "和至多三名角色进行拼点", function(card, player3, target) {
        return target != player3 && player3.canCompare(target);
      }).set("ai", function(target) {
        if (!_status.event.goon) {
          return false;
        }
        var att = get.attitude(_status.event.player, target);
        if (att >= 0) {
          return 0;
        }
        if (target.hasSkillTag("noh")) {
          att /= 3;
        }
        return -att / Math.sqrt(target.countCards("h"));
      }).set("goon", goon).forResult();
    },
    async content(event, trigger, player2) {
      const { targets } = event;
      let result2;
      event.max_num = 0;
      targets.sortBySeat();
      const next = player2.chooseToCompare(targets);
      next.callback = lib.skill.nshanlang.callback;
      await next;
      if (!event.target) {
        return;
      }
      const target = event.target;
      result2 = await player2.chooseBool("是否令" + get.translation(target) + "获得一张牌？").set("goon", get.attitude(player2, target) > 0).set("ai", () => _status.event.goon).forResult();
      if (result2.bool) {
        const card = get.cardPile2((card2) => {
          return !lib.skill.nsxingyun.getSixiang(card2);
        });
        if (card) {
          await target.gain(card, "gain2");
        }
      }
    },
    async callback(event, trigger, player2) {
      const { target } = event;
      var list = [
        [player2, event.num1],
        [target, event.num2]
      ], evt = event.getParent(2);
      for (var i of list) {
        if (i[1] > evt.max_num) {
          evt.max_num = i[1];
          evt.target = i[0];
        } else if (evt.target && i[1] == evt.max_num && i[0] != evt.target) {
          delete evt.target;
        }
      }
    }
  },
  //钟离牧
  nskuanhuai: {
    trigger: { player: "phaseUseBegin" },
    async content(event, trigger, player2) {
      const card = get.discardPile((card2) => get.type(card2) != "basic");
      if (card) {
        await player2.gain({
          cards: [card],
          animate: "gain2"
        });
      }
      player2.addTempSkill("nskuanhuai_blocker", "phaseUseAfter");
      player2.addTempSkill("nskuanhuai_effect");
    },
    subSkill: {
      blocker: {
        charlotte: true,
        mod: {
          cardEnabled(card) {
            if (get.type(card) == "basic") {
              return false;
            }
          },
          cardSavable(card) {
            if (get.type(card) == "basic") {
              return false;
            }
          }
        }
      },
      effect: {
        trigger: { player: "phaseDiscardEnd" },
        charlotte: true,
        popup: false,
        filter(event, player2) {
          return player2.hasHistory("lose", function(evt) {
            if (evt.type != "discard" || evt.getParent("phaseDiscard") != event) {
              return false;
            }
            for (var i of evt.cards2) {
              if (get.type(i, null, false) == "basic" && get.position(i, true) == "d" && player2.hasUseTarget(i)) {
                return true;
              }
            }
            return false;
          });
        },
        async content(event, trigger, player2) {
          let result2;
          const cards2 = player2.getHistory("lose", (evt) => evt.type === "discard" && evt.getParent("phaseDiscard") === trigger).flatMap((evt) => evt.cards2).filter((card) => get.type(card, null, false) === "basic" && get.position(card, true) === "d");
          while (true) {
            const cards22 = cards2.filter((card2) => get.position(card2, true) == "d" && player2.hasUseTarget(card2));
            if (!cards22.length) {
              return;
            }
            result2 = await player2.chooseButton({
              createDialog: ["宽怀：是否使用其中一张牌？", cards22]
            }).forResult();
            if (!result2.bool) {
              return;
            }
            const card = result2.links?.[0];
            const index = cards2.indexOf(card);
            if (index != -1) {
              cards2.splice(index, 1);
            }
            await player2.chooseUseTarget(card, true);
          }
        }
      }
    }
  },
  nsdingbian: {
    trigger: { player: "useCard" },
    forced: true,
    filter(event, player2) {
      if (player2 != _status.currentPhase) {
        return false;
      }
      return get.type(event.card) != "basic";
    },
    async content(event, trigger, player2) {
      let result2;
      player2.addTempSkill("nsdingbian_mark");
      player2.addMark("nsdingbian_mark", 1, false);
      const storage = player2.getStorage("nsdingbian_ignore");
      let goon = false;
      for (const name of lib.inpile) {
        if (get.type(name) == "basic" && !storage.includes(name)) {
          goon = true;
          break;
        }
      }
      if (goon) {
        result2 = await player2.chooseControl().set("choiceList", ["从牌堆中获得一张基本牌", "令一种基本牌于本回合内不计入手牌上限"]).set("prompt", "定边：请选择一项").set("ai", () => {
          const player3 = _status.event.player;
          const list2 = ["tao", "shan"];
          const list22 = player3.getStorage("nsdingbian_ignore");
          list2.removeArray(list22);
          if (!list2.length) {
            return 0;
          }
          const num1 = player3.countCards("hs", (card) => {
            return get.type(card) != "basic" && player3.hasValueTarget(card, null, true);
          });
          const num2 = player3.getHandcardLimit();
          if (player3.countCards("h", list2) <= num2 - num1) {
            return 0;
          }
          return 1;
        }).forResult();
      } else {
        result2 = { index: 0 };
      }
      if (result2.index == 0) {
        const card = get.cardPile2((card2) => get.type(card2, null, false) == "basic");
        if (card) {
          await player2.gain(card, "gain2");
        }
        return;
      }
      const list = [];
      const storage2 = player2.getStorage("nsdingbian_ignore");
      for (const name of lib.inpile) {
        if (get.type(name) == "basic" && !storage2.includes(name)) {
          list.push(name);
        }
      }
      result2 = await player2.chooseButton(["令一种基本牌于本回合内不计入手牌上限", [list, "vcard"]], true).set("ai", (button) => {
        const name = button.link[2];
        const player3 = _status.event.player;
        if (name == "sha") {
          return 0;
        }
        const cards2 = player3.getCards("h", name);
        if (!cards2.length) {
          return 0;
        }
        return get.value(cards2, player3);
      }).forResult();
      if (result2.bool && result2.links?.length) {
        player2.markAuto("nsdingbian_ignore", [result2.links[0][2]]);
      }
    },
    subSkill: {
      mark: {
        onremove(player2) {
          delete player2.storage.nsdingbian_mark;
          delete player2.storage.nsdingbian_ignore;
        },
        mod: {
          maxHandcard: (player2, num) => num - player2.countMark("nsdingbian_mark"),
          ignoredHandcard(card, player2) {
            if (player2.getStorage("nsdingbian_ignore").includes(get.name(card, player2))) {
              return true;
            }
          },
          cardDiscardable(card, player2, name) {
            if (name == "phaseDiscard" && player2.getStorage("nsdingbian_ignore").includes(get.name(card, player2))) {
              return false;
            }
          }
        },
        intro: { content: "手牌上限-#" }
      }
    }
  },
  //李密
  nstuilun: {
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player2) {
      return player2.hp > 1 && player2.countCards("h") > 1 && player2.hasCard(function(card) {
        return lib.filter.cardDiscardable(card, player2, "nstuilun");
      }, "h");
    },
    prompt2: "失去任意点体力（至多失去至1点）并弃置任意张手牌（至多弃置至一张）。",
    check(event, player2) {
      if (game.hasPlayer(function(current) {
        return current != player2 && current.hp >= player2.hp;
      })) {
        return true;
      }
      return false;
    },
    async content(event, trigger, player2) {
      let result2;
      if (player2.hp == 2) {
        result2 = { numbers: [1] };
      } else {
        result2 = await player2.chooseNumbers({
          list: [
            {
              min: 1,
              max: player2.hp - 1,
              prompt: "请选择失去体力的量"
            }
          ],
          processAI() {
            return [Math.floor(get.rand(0, player2.hp - 2)) + 1];
          }
        }).forResult();
      }
      await player2.loseHp(result2.numbers[0]);
      if (player2.countCards("h") > 1 && player2.hasCard((card) => lib.filter.cardDiscardable(card, player2, "nstuilun"), "h")) {
        await player2.chooseToDiscard({
          forced: true,
          position: "h",
          selectCard: [1, player2.countCards("h") - 1],
          allowChooseAll: true
        });
      } else {
        await game.delayx();
      }
      player2.addTempSkill("nstuilun_effect", {
        player: "phaseBeginStart"
      });
    },
    subSkill: {
      effect: {
        charlotte: true,
        trigger: { global: "phaseBegin" },
        forced: true,
        popup: false,
        filter(event, player2) {
          return player2.hp < event.player.hp || player2.hp > 0 && player2.countCards("h") < event.player.countCards("h");
        },
        async content(event, trigger, player2) {
          let result2;
          if (player2.hp < trigger.player.hp) {
            result2 = await player2.chooseTarget("退论：是否令一名角色回复或失去1点体力？").set("ai", (target) => {
              let eff = get.effect(target, { name: "losehp" }, player2, player2);
              if (target.isDamaged()) {
                eff = Math.max(eff, get.recoverEffect(target, player2, player2));
              }
              return eff;
            }).forResult();
            if (result2.bool) {
              const target = result2.targets[0];
              player2.logSkill("nstuilun_effect", target);
              if (target.isHealthy()) {
                result2 = { index: 1 };
              } else {
                result2 = await player2.chooseControl("回复1点体力", "失去1点体力").set("prompt", "令" + get.translation(target) + "…").set("ai", () => {
                  if (get.recoverEffect(target, player2, player2) >= get.effect(target, { name: "losehp" }, player2, player2)) {
                    return 0;
                  }
                  return 1;
                }).forResult();
              }
              if (result2.index == 0) {
                await target.recover();
              } else {
                await target.loseHp();
              }
            }
          }
          if (trigger.player.countCards("h") > player2.countCards("h")) {
            result2 = await player2.chooseTarget("退论：是否令一名角色摸一张牌或弃置一张牌？").set("ai", (target) => {
              const att = get.attitude(player2, target);
              if (att > 0 || target.countCards("he") == 0) {
                return get.effect(target, { name: "draw" }, player2, player2);
              }
              return get.effect(target, { name: "guohe_copy2" }, target, player2);
            }).forResult();
            if (result2.bool) {
              const target = result2.targets[0];
              player2.logSkill("nstuilun_effect", target);
              if (!target.countCards("he")) {
                result2 = { index: 0 };
              } else {
                result2 = await player2.chooseControl("摸一张牌", "弃置一张牌").set("prompt", "令" + get.translation(target) + "…").set("ai", () => get.attitude(player2, target) > 0 ? 0 : 1).forResult();
              }
              if (result2.index == 0) {
                await target.draw();
              } else {
                await target.chooseToDiscard("he", true);
              }
            }
          }
        }
      }
    }
  },
  //阮籍
  nsshizui: {
    trigger: { target: "useCardToTargeted" },
    usable: 1,
    filter(event, player2) {
      var type = get.type(event.card, null, false);
      return (type == "basic" || type == "trick") && player2.countCards("he") > 0 && player2.hasUseTarget({ name: "jiu" }, null, true);
    },
    async cost(event, trigger, player2) {
      var suit = get.suit(trigger.card), cards2 = trigger.cards.filterInD();
      var str = "弃置一张牌并视为使用一张【酒】";
      if (lib.suit.includes(suit)) {
        str += "；若弃置" + get.translation(suit) + "牌，则" + get.translation(trigger.card) + "对你无效";
      }
      if (cards2.length) {
        str += "；若弃置♣牌则获得" + get.translation(cards2);
      }
      str += "。";
      var next = player2.chooseToDiscard("he", get.prompt(event.skill), str, "chooseonly");
      next.set("val1", cards2.length ? get.value(cards2, player2) : 0);
      next.set("val2", -get.effect(player2, trigger.card, trigger.player, player2));
      next.set("suit", suit);
      next.set("ai", function(card) {
        var base = 2, suit2 = get.suit(card);
        if (suit2 == "club") {
          base += _status.event.val1;
        }
        if (suit2 == _status.event.suit) {
          base += _status.event.val2;
        }
        return base - get.value(card);
      });
      event.result = await next.forResult();
    },
    async content(event, trigger, player2) {
      const { cards: cards2 } = event;
      await player2.discard(cards2);
      const suit1 = get.suit(cards2[0], player2);
      await player2.chooseUseTarget("jiu", true);
      const suit2 = get.suit(trigger.card, false);
      if (suit1 == suit2 && lib.suit.includes(suit1)) {
        trigger.excluded.add(player2);
      }
      if (suit1 == "club") {
        const cards3 = trigger.cards.filterInD();
        if (cards3.length > 0) {
          await player2.gain(cards3, "gain2");
        }
      }
    }
  },
  nsxiaoye: {
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player2) {
      return player2.hasHistory("useCard", function(evt) {
        return evt.card.name == "jiu";
      }) && event.player.hasHistory("useCard", function(evt) {
        return (evt.card.name == "sha" || get.type(evt.card) == "trick") && player2.hasUseTarget({
          name: evt.card.name,
          nature: evt.card.nature,
          isCard: true
        });
      });
    },
    async cost(event, trigger, player2) {
      const list = [];
      trigger.player.getHistory("useCard", function(evt) {
        if (evt.card.name != "sha" && get.type(evt.card) != "trick") {
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
      const result2 = await player2.chooseButton([get.prompt(event.skill), [list, "vcard"]]).set("filterButton", function(button) {
        return player2.hasUseTarget({
          name: button.link[2],
          nature: button.link[3],
          isCard: true
        });
      }).set("ai", function(button) {
        return player2.getUseValue({
          name: button.link[2],
          nature: button.link[3],
          isCard: true
        });
      }).forResult();
      if (result2.bool) {
        event.result = {
          bool: true,
          cost_data: {
            card: {
              name: result2.links[0][2],
              nature: result2.links[0][3],
              isCard: true
            }
          }
        };
      }
    },
    async content(event, trigger, player2) {
      player2.chooseUseTarget(true, event.cost_data.card);
    }
  },
  //臧洪
  nsshimeng: {
    enable: "phaseUse",
    usable: 1,
    selectTarget: [1, Infinity],
    filterTarget: true,
    async contentBefore(event, trigger, player2) {
      const parent = event.getParent();
      if (parent == null) {
        return;
      }
      parent._nsshimeng_count = [0, 0];
    },
    async content(event, trigger, player2) {
      const { target } = event;
      let result2;
      if (!target.isIn()) {
        return;
      }
      result2 = await target.chooseToUse("使用一张【杀】，或摸一张牌", function(card, player3) {
        if (get.name(card) != "sha") {
          return false;
        }
        return lib.filter.cardEnabled.apply(this, arguments);
      }).set("addCount", false).forResult();
      const parent = event.getParent();
      if (!parent) {
        return;
      }
      if (result2.bool) {
        parent._nsshimeng_count[0]++;
      } else {
        parent._nsshimeng_count[1]++;
        await target.draw();
      }
    },
    async contentAfter(event, trigger, player2) {
      const list = event.getParent()?._nsshimeng_count;
      if (list[0] < list[1]) {
        await player2.changeHujia(1);
        await player2.loseHp();
      }
    },
    ai: {
      order: 3.05,
      result: {
        player(player2, target) {
          var att = get.attitude(player2, target);
          if (att <= 0) {
            return 0;
          }
          if (player2.hp > 1 || player2.countCards("hs", ["tao", "jiu"])) {
            return 1;
          }
          if (!ui.selected.targets.length) {
            if (target != player2) {
              return 0;
            }
            if (player2.hasSha()) {
              return 1;
            }
            return 0;
          }
          if (ui.selected.targets.length > 1 && !target.hasSha()) {
            return 0;
          }
          return 1;
        }
      }
    }
  },
  nsqiyue: {
    trigger: {
      global: ["turnOverEnd", "linkEnd", "showCharacterEnd", "hideCharacterEnd", "removeCharacterEnd"]
    },
    forced: true,
    async content(event, trigger, player2) {
      await player2.draw();
    }
  },
  nsxuezhu: {
    trigger: { player: "damageEnd", source: "damageSource" },
    filter(event, player2) {
      return event.player.isIn();
    },
    logTarget: "player",
    async content(event, trigger, player2) {
      await trigger.player.draw(2);
      await trigger.player.turnOver();
    },
    check(event, player2) {
      return !event.player.isTurnedOver() || get.attitude(player2, event.player) > 0;
    }
  },
  noname_zhuyuan: {
    charlotte: true,
    enable: "phaseUse",
    position: "he",
    selectCard: 4,
    complexCard: true,
    prompt: "将四张花色各不同的牌交一名角色并令你与其获得【铁骑】和【激昂】直到各自回合结束",
    check(card) {
      if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
        return 0;
      }
      if (!ui.selected.cards.length && card.name == "du") {
        return 20;
      }
      var player2 = get.owner(card);
      if (ui.selected.cards.length >= Math.max(2, player2.countCards("h") - player2.hp)) {
        return 0;
      }
      if (player2.hp == player2.maxHp || player2.countCards("h") <= 1) {
        var players = game.filterPlayer();
        for (var i = 0; i < players.length; i++) {
          if (players[i].hasSkill("haoshi") && !players[i].isTurnedOver() && !players[i].hasJudge("lebu") && get.attitude(player2, players[i]) >= 3 && get.attitude(players[i], player2) >= 3) {
            return 11 - get.value(card);
          }
        }
        if (player2.countCards("h") > player2.hp) {
          return 10 - get.value(card);
        }
        if (player2.countCards("h") > 2) {
          return 6 - get.value(card);
        }
        return -1;
      }
      return 10 - get.value(card);
    },
    filterCard(card, player2) {
      var suit = get.suit(card, player2);
      for (var i = 0; i < ui.selected.cards.length; i++) {
        if (get.suit(ui.selected.cards[i], player2) == suit) {
          return false;
        }
      }
      return true;
    },
    filter(event, player2) {
      var suits = [];
      player2.countCards("he", function(card) {
        if (suits.length < 4) {
          suits.add(get.suit(card, player2));
        }
      });
      if (suits.length < 4) {
        return false;
      }
      var stat = player2.getStat();
      if (!stat.noname_zhuyuan) {
        return true;
      }
      return game.hasPlayer(function(current) {
        return current != player2 && !stat.noname_zhuyuan.includes(current);
      });
    },
    filterTarget(card, player2, target) {
      if (player2 == target) {
        return false;
      }
      var stat = player2.getStat();
      if (!stat.noname_zhuyuan) {
        return true;
      }
      return !stat.noname_zhuyuan.includes(target);
    },
    discard: false,
    lose: false,
    delay: false,
    derivation: ["noname_retieji", "noname_jiang"],
    async content(event, trigger, player2) {
      const stat = player2.getStat();
      stat.noname_zhuyuan ??= [];
      stat.noname_zhuyuan.push(event.target);
      await player2.give(event.cards, event.target, true);
      game.log(player2, "获得了技能", "#g【铁骑】");
      player2.addTempSkill("noname_retieji", {
        player: "phaseAfter"
      });
      game.log(player2, "获得了技能", "#g【激昂】");
      player2.addTempSkill("noname_jiang", {
        player: "phaseAfter"
      });
      game.log(event.target, "获得了技能", "#g【铁骑】");
      event.target.addTempSkill("noname_retieji", {
        player: "phaseAfter"
      });
      game.log(event.target, "获得了技能", "#g【激昂】");
      event.target.addTempSkill("noname_jiang", {
        player: "phaseAfter"
      });
    },
    mod: {
      targetInRange(card, player2) {
        var stat = player2.getStat();
        if (stat.noname_zhuyuan) {
          return true;
        }
      },
      cardUsable(card, player2) {
        var stat = player2.getStat();
        if (!stat.noname_zhuyuan) {
          return Infinity;
        }
      }
    },
    ai: {
      order: 5,
      result: {
        target: 10
      }
    }
  },
  noname_retieji: {
    inherit: "retieji",
    mark: true,
    marktext: "<img style=width:21px src=" + lib.assetURL + "image/character/noname_machao.png>",
    intro: {
      name: "小无·铁骑",
      content: "你使用【杀】指定一名角色为目标后，可以进行一次判定并令该角色的非锁定技失效直到回合结束，除非该角色弃置一张与判定结果花色相同的牌，否则不能使用【闪】抵消此【杀】。"
    }
  },
  noname_jiang: {
    inherit: "jiang",
    mark: true,
    marktext: "<img style=width:21px src=" + lib.assetURL + "image/character/noname_sunce.png>",
    intro: {
      name: "小无·激昂",
      content: "每当你使用（指定目标后）或被使用（成为目标后）一张【决斗】或红色的【杀】时，你可以摸一张牌。"
    }
  },
  noname_duocai: {
    charlotte: true,
    trigger: {
      global: ["loseAfter", "gainAfter", "equipAfter", "addJudgeAfter", "loseAsyncAfter", "addToExpansionAfter", "cardsDiscardAfter"]
    },
    filter(event, player2) {
      return game.hasPlayer2((i) => i !== player2 && event.getd(i, "cards2").length);
    },
    direct: true,
    async content(event, trigger, player2) {
      let result2;
      if (trigger.delay == false && player2 != game.me && !player2.isOnline()) {
        await game.delayx();
      }
      const cards2 = game.filterPlayer2((i) => i !== player2 && trigger.getd(i, "cards2").length).flatMap((target) => trigger.getd(target, "cards2"));
      result2 = await player2.chooseButton({
        createDialog: [get.prompt2("noname_duocai"), cards2],
        selectButton: [1, cards2.length],
        ai(button) {
          return get.value(button.link);
        }
      }).forResult();
      if (!result2.bool) {
        return;
      }
      player2.logSkill("noname_duocai");
      await player2.gain({
        cards: result2.links,
        animate: "gain2"
      });
      if (result2.links?.length && result2.links.length <= 2) {
        if (result2.links.length == 2) {
          await player2.draw();
        } else {
          await player2.recover();
        }
        return;
      }
      const filterTarget = (card, player3, target) => {
        return target !== player3 && target.countDiscardableCards(player3, "hej") > 0;
      };
      if (!game.hasPlayer((current) => filterTarget(null, player2, current))) {
        return;
      }
      result2 = await player2.chooseTarget({
        prompt: "弃置一名其他角色区域内的一张牌",
        forced: true,
        filterTarget,
        ai(target) {
          const player3 = _status.event.player;
          return get.effect(target, { name: "guohe" }, player3, player3);
        }
      }).forResult();
      if (result2.bool && result2.targets?.length) {
        const target = result2.targets[0];
        player2.line(target, "green");
        await player2.discardPlayerCard({
          target,
          position: "hej",
          forced: true
        });
      }
    }
  },
  nsbizhao: {
    trigger: { player: "showCharacterAfter" },
    forced: true,
    hiddenSkill: true,
    filter(event, player2) {
      return event.toShow?.some((name) => {
        return get.character(name, 3).includes("nsbizhao");
      }) && player2 != _status.currentPhase;
    },
    async content(event, trigger, player2) {
      player2.addTempSkill(event.name + "_effect", { player: "phaseBeginStart" });
      player2.addMark(event.name + "_effect", 1, false);
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        intro: { content: "其他角色至自己的距离+#" },
        mod: {
          globalTo(source, player2, distance) {
            return distance + player2.countMark("nsbizhao_effect");
          }
        }
      }
    }
  },
  nsqingde: {
    trigger: {
      player: "damageEnd",
      source: "damageSource"
    },
    usable: 1,
    filter(event, player2) {
      if (!event.card || !event.cards || event.player == event.source || event.card.name != "sha" && get.type(event.card) != "trick" || event.cards.filterInD().length != 1) {
        return false;
      }
      var target = lib.skill.nsqingde.logTarget(event, player2);
      if (player2.hasSkillTag("noCompareSource") || target.hasSkillTag("noCompareTarget")) {
        return false;
      }
      return target.countCards("h") > 0;
    },
    logTarget(event, player2) {
      if (player2 == event.source) {
        return event.player;
      }
      return event.source;
    },
    check(event, player2) {
      var target = lib.skill.nsqingde.logTarget(event, player2);
      return get.attitude(player2, target) <= 0;
    },
    async content(event, trigger, player2) {
      let result2;
      const target = lib.skill.nsqingde.logTarget(trigger, player2);
      const next = player2.chooseToCompare(target);
      if (event.triggername == "damageSource") {
        next.set("small", true);
      }
      next.fixedResult ??= {};
      next.fixedResult[player2.playerid] = trigger.cards.filterInD()[0];
      result2 = await next.forResult();
      if (result2.tie) {
        return;
      }
      let win = result2.bool;
      if (event.triggername == "damageSource") {
        win = !win;
      }
      const target2 = win ? player2 : target;
      if (event.triggername == "damageSource") {
        result2 = await player2.chooseBool("是否令" + get.translation(target2) + "摸两张牌？").set("ai", () => get.attitude(player2, target2) > 0).forResult();
        if (result2.bool) {
          await target2.draw(2);
        }
        return;
      }
      if (!target2.isDamaged()) {
        return;
      }
      result2 = await player2.chooseBool("是否令" + get.translation(target2) + "回复1点体力？").set("ai", () => get.attitude(player2, target2) > 0).forResult();
      if (result2.bool) {
        await target2.recover();
      }
    },
    ai: {
      effect: {
        target(card, player2, target, current) {
          if (target.storage.counttrigger && target.storage.counttrigger.nsqingde) {
            return;
          }
          var num = get.number(card);
          if (typeof num == "number") {
            if (target.hasSkillTag("noCompareSource") || player2.hasSkillTag("noCompareTarget")) {
              return;
            }
            var hs = player2.getCards("h");
            if (card.cards) {
              hs.removeArray(card.cards);
            }
            if (ui.selected.cards) {
              hs.removeArray(ui.selected.cards);
            }
            if (!hs.length) {
              return;
            }
            for (var i of hs) {
              if (get.number(i) >= num) {
                return;
              }
              if (player2.hasSkill("tianbian") && get.suit(card) == "heart") {
                return;
              }
            }
            return "zerotarget";
          }
        }
      }
    }
  },
  nsyidi: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player2) {
      return player2.countCards("h") > 0;
    },
    filterCard: true,
    filterTarget: lib.filter.notMe,
    discard: false,
    lose: false,
    delay: false,
    check(card) {
      var player2 = _status.event.player;
      if (get.type(card) == "basic") {
        if (game.hasPlayer(function(current) {
          return get.attitude(current, player2) > 0 && current.getUseValue(card) > player2.getUseValue(card, null, true);
        })) {
          return 5 + Math.random();
        }
        return 0;
      }
      if (game.hasPlayer(function(current) {
        return get.attitude(current, player2) > 0 && !current.hasJudge("lebu") && current.getUseValue(card) > player2.getUseValue(card);
      })) {
        return 4.7 + Math.random();
      }
      if (card.name == "wuxie" && game.hasPlayer(function(current) {
        return get.attitude(current, player2) > 0;
      })) {
        return 5 + Math.random();
      }
      return 4 - get.value(card);
    },
    async content(event, trigger, player2) {
      const { cards: cards2, target } = event;
      await player2.give(cards2, target, "visible").forResult();
      if (get.type(cards2[0], player2) != "basic") {
        await player2.draw().forResult();
        return;
      }
      if (target.getCards("h").includes(cards2[0]) && target.hasUseTarget(cards2[0])) {
        await target.chooseUseTarget(cards2[0]).forResult();
      }
    },
    ai: {
      order: 7,
      result: {
        player(player2, target) {
          if (!ui.selected.cards.length || get.type(ui.selected.cards[0], player2) == "basic") {
            return 0;
          }
          if (get.value(ui.selected.cards[0]) < 4) {
            return 2;
          }
          return 0.5;
        },
        target: 1
      }
    }
  },
  nsfuzhou: {
    enable: "phaseUse",
    usable: 2,
    filter(event, player2) {
      if (!player2.storage.nstaiping && player2.getStat("skill").nsfuzhou) {
        return false;
      }
      return player2.countCards("he", { color: "black" }) > 0;
    },
    filterCard: { color: "black" },
    filterTarget(card, player2, target) {
      return !target.hasJudge("nsfuzhou_card");
    },
    check(card) {
      return 8 - get.value(card);
    },
    prepare: "give",
    position: "he",
    discard: false,
    lose: false,
    delay: false,
    async content(event, trigger, player2) {
      const { target, cards: cards2 } = event;
      await target.addJudge({ name: "nsfuzhou_card" }, cards2[0]);
      cards2[0].storage.nsfuzhou_source = player2;
      await game.delayx();
    },
    ai: {
      order: 5,
      result: {
        target(player2, target) {
          if (player2.storage.nsfuzhou_draw) {
            if (get.attitude(player2, target) > 0 && player2.countCards("he", function(card) {
              return get.color(card) == "red";
            })) {
              return 1;
            }
            return 0;
          }
          if (player2.storage.nsfuzhou_damage) {
            return -2;
          }
          return -1.5;
        }
      }
    }
  },
  nsfuzhou_num: {
    charlotte: true,
    onremove: true,
    mod: {
      maxHandcard(player2, num) {
        return num + player2.storage.nsfuzhou_num;
      }
    },
    intro: {
      content(num) {
        return "手牌上限" + (num < 0 ? "" : "+") + num;
      }
    }
  },
  nsguidao: {
    trigger: { global: "judge" },
    filter(event, player2) {
      return player2.countCards("hes", function(card) {
        if (player2.storage.nstaiping || _status.connectMode && get.position(card) != "e") {
          return true;
        }
        return get.color(card) == "black";
      }) > 0;
    },
    async cost(event, trigger, player2) {
      event.result = await player2.chooseCard(
        `${get.translation(trigger.player)}的${trigger.judgestr || ""}判定为${get.translation(trigger.player.judging[0])}，${get.prompt(event.skill)}`,
        "hes",
        (card) => {
          const player3 = get.player();
          if (!player3.storage.nstaiping && get.color(card) != "black") {
            return false;
          }
          const mod2 = game.checkMod(card, player3, "unchanged", "cardEnabled2", player3);
          if (mod2 != "unchanged") {
            return mod2;
          }
          const mod = game.checkMod(card, player3, "unchanged", "cardRespondable", player3);
          if (mod != "unchanged") {
            return mod;
          }
          return true;
        }
      ).set("ai", (card) => {
        const trigger2 = get.event().getTrigger();
        const { player: player3, judging } = get.event();
        const result2 = trigger2.judge(card) - trigger2.judge(judging);
        const attitude = get.attitude(player3, trigger2.player);
        let val = get.value(card);
        if (get.subtype(card) == "equip2") {
          val /= 2;
        } else {
          val /= 6;
        }
        if (attitude == 0 || result2 == 0) {
          return 0;
        }
        if (attitude > 0) {
          return result2 - val;
        }
        return -result2 - val;
      }).set("judging", trigger.player.judging[0]).forResult();
    },
    popup: false,
    async content(event, trigger, player2) {
      const next = player2.respond(event.cards, event.name, "highlight", "noOrdering");
      await next;
      const { cards: cards2 } = next;
      if (cards2?.length) {
        player2.$gain2(trigger.player.judging[0]);
        await player2.gain(trigger.player.judging[0]);
        trigger.player.judging[0] = cards2[0];
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
  nstaiping: {
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "thunder",
    filter(event, player2) {
      return player2.getAllHistory("sourceDamage", function(evt) {
        return evt.getParent().name == "nsfuzhou_card";
      }).length > 1 || player2.getAllHistory("gain", function(evt) {
        return evt.getParent(2).name == "nsfuzhou_card";
      }).length > 1;
    },
    async content(event, trigger, player2) {
      player2.awakenSkill(event.name);
      player2.storage.nstaiping = true;
      if (player2.getAllHistory("sourceDamage", function(evt) {
        return evt.getParent().name == "nsfuzhou_card";
      }).length > 1) {
        player2.storage.nsfuzhou_damage = true;
      }
      if (player2.getAllHistory("gain", function(evt) {
        return evt.getParent(2).name == "nsfuzhou_card";
      }).length > 1) {
        player2.storage.nsfuzhou_draw = true;
      }
    },
    ai: {
      combo: "nsfuzhou"
    },
    derivation: ["nsfuzhou_damage", "nsfuzhou_draw"]
  },
  nsweiyuan: {
    trigger: { player: "useCardToTargeted" },
    direct: true,
    filter(event, player2) {
      return player2 != event.target && event.targets && event.targets.length == 1 && event.target.isIn() && player2.isPhaseUsing() && !player2.hasSkill("nsweiyuan2") && game.hasPlayer(function(current) {
        return current != player2 && current != event.target;
      });
    },
    async content(event, trigger, player2) {
      let result2;
      result2 = await player2.chooseTarget(get.prompt2("nsweiyuan"), (card, player3, target2) => {
        return target2 != player3 && target2 != _status.event.getTrigger().target;
      }).set("ai", (target2) => {
        return Math.max(Math.random(), get.attitude(player2, target2));
      }).forResult();
      if (!result2.bool) {
        return;
      }
      player2.addTempSkill("nsweiyuan2", "phaseUseAfter");
      const target = result2.targets[0];
      event.target = target;
      player2.logSkill("nsweiyuan", target);
      result2 = await target.chooseCard(
        "he",
        "交给" + get.translation(trigger.target) + "一张牌并受到1点伤害，或令" + get.translation(player2) + "摸一张牌且可以重复使用牌"
      ).set("ai", (card) => {
        if (_status.event.goon) {
          return Math.random();
        }
        return 0;
      }).set(
        "goon",
        (() => {
          if (get.attitude(target, player2) > 0) {
            return false;
          }
          return Math.random() > 0.5;
        })()
      ).forResult();
      if (result2.bool) {
        await target.gain(result2.cards, trigger.target);
        await target.damage();
      } else {
        player2.addTempSkill("nsweiyuan_use");
        await player2.draw();
      }
    }
  },
  nsweiyuan2: { charlotte: true },
  nsweiyuan_use_backup: {},
  nsweiyuan_use: {
    enable: "phaseUse",
    charlotte: true,
    sourceSkill: "nsweiyuan",
    mod: {
      cardUsable() {
        if (_status.event.skill == "nsweiyuan_use_backup") {
          return Infinity;
        }
      },
      targetInRange() {
        if (_status.event.skill == "nsweiyuan_use_backup") {
          return true;
        }
      }
    },
    onChooseToUse(event) {
      if (game.online || event.type != "phase") {
        return;
      }
      var list = [];
      event.player.getHistory("useCard", function(evt) {
        var name = evt.card.name;
        var type = get.type(name);
        if (type != "basic" && type != "trick") {
          return;
        }
        if (name == "sha") {
          var nature = evt.card.nature;
          switch (nature) {
            case "fire":
              name = "huosha";
              break;
            case "thunder":
              name = "leisha";
              break;
            case "kami":
              name = "kamisha";
              break;
            case "ice":
              name = "icesha";
              break;
          }
        }
        list.add(type + "咕咕" + name);
      });
      event.set("nsweiyuan_list", list);
    },
    filter(event, player2) {
      return player2.countCards("h") > 0 && event.nsweiyuan_list && event.nsweiyuan_list.length > 0;
    },
    chooseButton: {
      dialog(event, player2) {
        return ui.create.dialog("围援", [
          event.nsweiyuan_list.map(function(i) {
            return i.split("咕");
          }),
          "vcard"
        ]);
      },
      filter(button, player2) {
        return lib.filter.cardEnabled(
          {
            name: button.link[2],
            nature: button.link[3]
          },
          player2
        );
      },
      check(button) {
        return _status.event.player.getUseValue(
          {
            name: button.link[2],
            nature: button.link[3]
          },
          false
        );
      },
      backup(links, player2) {
        return {
          popname: true,
          position: "h",
          filterCard: true,
          ai1(card) {
            return 7 - get.value(card);
          },
          viewAs: {
            name: links[0][2],
            nature: links[0][3]
          },
          onuse(links2, player3) {
            player3.removeSkill("nsweiyuan_use");
          }
        };
      },
      prompt(links, player2) {
        return "将一张手牌当做" + get.translation(links[0][3] || "") + get.translation(links[0][2]) + "使用";
      }
    },
    ai: {
      order: 1,
      result: {
        player: 1
      }
    }
  },
  nsjuxian: {
    trigger: { player: "damageBegin2" },
    filter(event, player2) {
      return !player2.hasSkill("nsjuxian2");
    },
    check(event, player2) {
      if (player2.countCards("h") + 2 >= player2.maxHp) {
        return !event.source || !event.source.countCards("he") || get.attitude(player2, event.source) > 0;
      }
      return true;
    },
    async content(event, trigger, player2) {
      player2.addSkill("nsjuxian2");
      await player2.draw(2);
      const target = trigger.source;
      if (player2.countCards("h") >= player2.maxHp && target && target.countCards("he")) {
        player2.line(target, "green");
        await target.chooseToDiscard("he", true);
      }
    }
  },
  nsjuxian2: {
    trigger: { player: "phaseDrawBefore" },
    forced: true,
    charlotte: true,
    sourceSkill: "nsjuxian",
    async content(event, trigger, player2) {
      player2.removeSkill("nsjuxian2");
      trigger.cancel();
      game.log(player2, "跳过了", "#y摸牌阶段");
    }
  },
  nsdiewu: {
    trigger: {
      player: ["damageEnd", "gainAfter"],
      global: "loseAsyncAfter"
    },
    forced: true,
    locked: false,
    filter(event, player2) {
      if (event.name != "damage") {
        return event.getg(player2).length > 1;
      }
      return true;
    },
    async content(event, trigger, player2) {
      player2.addMark("nsdiewu", 1);
    },
    intro: {
      content: "mark"
    },
    group: ["nsdiewu_sha", "nsdiewu_shan", "nsdiewu_draw"],
    subSkill: {
      sha: {
        enable: "chooseToUse",
        viewAs: { name: "sha", isCard: true },
        prompt: "视为使用一张【杀】",
        viewAsFilter(player2) {
          return player2.countMark("nsdiewu") > 0;
        },
        filterCard: () => false,
        selectCard: -1,
        onuse(links, player2) {
          player2.removeMark("nsdiewu", 1);
        },
        ai: {
          order() {
            var player2 = _status.event.player;
            if (!player2.storage.nspojian && player2.countMark("nsdiewu") <= player2.hp) {
              return 0;
            }
            return get.order({ name: "sha" }) + 0.1;
          }
        }
      },
      shan: {
        enable: "chooseToUse",
        viewAs: { name: "shan", isCard: true },
        viewAsFilter(player2) {
          return player2.countMark("nsdiewu") > 0 && !player2.storage.nspojian;
        },
        filterCard: () => false,
        selectCard: -1,
        onuse(links, player2) {
          player2.removeMark("nsdiewu", 1);
        },
        ai: {
          order() {
            var player2 = _status.event.player;
            if (player2.hp > 1 && player2.countMark("nsdiewu") <= player2.hp) {
              return 0;
            }
            return get.order({ name: "shan" }) - 0.2;
          }
        }
      },
      draw: {
        trigger: { source: "damageEnd" },
        forced: true,
        popup: false,
        filter(event, player2) {
          var evt = event.getParent();
          return evt && evt.type == "card" && evt.skill == "nsdiewu_sha";
        },
        async content(event, trigger, player2) {
          await player2.draw();
        }
      }
    },
    ai: {
      respondSha: true,
      respondShan: true,
      skillTagFilter(player2, tag) {
        if (tag == "respondShan" && player2.storage.nspojian) {
          return false;
        }
        return player2.countMark("nsdiewu") > 0;
      }
    }
  },
  nslingying: {
    mod: {
      cardUsable(card, player2, num) {
        if (card.name == "sha") {
          return num + 1;
        }
      },
      targetInRange(card) {
        if (card.name == "sha") {
          return true;
        }
      }
    }
  },
  nspojian: {
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "fire",
    filter(event, player2) {
      return player2.countMark("nsdiewu") >= player2.hp;
    },
    async content(event, trigger, player2) {
      player2.awakenSkill(event.name);
      player2.storage.nspojian = true;
      player2.loseMaxHp();
      player2.draw(2);
      player2.addSkill("nsliegong");
    },
    derivation: "nsliegong",
    ai: {
      combo: "nsdiewu"
    }
  },
  nsliegong: {
    inherit: "xinliegong"
  },
  nsguolie: {
    trigger: { player: "phaseDrawBefore" },
    check(event, player2) {
      var h1 = player2.getUseValue({ name: "sha" }, false);
      var h2 = player2.getUseValue({ name: "guohe" });
      return player2.countCards("h", function(card) {
        if (get.color(card) == "red") {
          return h1 > 0;
        }
        return h2 > 0;
      }) > 2;
    },
    async content(event, trigger, player2) {
      trigger.cancel();
      player2.addTempSkill("nsguolie2");
    }
  },
  nsguolie2: {
    mod: {
      cardname(card, player2) {
        var color = get.color(card, player2);
        if (color == "red") {
          return "sha";
        }
        if (color == "black") {
          return "guohe";
        }
      },
      cardnature() {
        return false;
      },
      cardUsable() {
        return Infinity;
      },
      targetInRange() {
        return true;
      }
    },
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    sourceSkill: "nsguolie",
    filter(event, player2) {
      var cards2 = [];
      game.getGlobalHistory("cardMove", function(evt) {
        if (evt.player == player2) {
          return;
        }
        for (var i of evt.cards) {
          if (get.position(i, true) == "d") {
            cards2.push(i);
          }
        }
      });
      return cards2.length > 0;
    },
    async content(event, trigger, player2) {
      const cards2 = [];
      game.getGlobalHistory("cardMove", function(evt) {
        if (evt.player == player2) {
          return;
        }
        if (evt.name == "cardsDiscard" && evt.parent.name == "orderingDiscard") {
          return;
        }
        for (var i of evt.cards) {
          if (get.position(i, true) == "d") {
            cards2.push(i);
          }
        }
      });
      await player2.gain(cards2, "gain2");
    }
  },
  nslongyue: {
    init: () => {
      game.addGlobalSkill("nslongyue_ai");
    },
    onremove: () => {
      if (!game.hasPlayer((i) => i.hasSkill("nslongyue", null, null, false), true)) {
        game.removeGlobalSkill("nslongyue_ai");
      }
    },
    trigger: { global: "useCard" },
    filter(event, player2) {
      return get.type(event.card, "trick") == "trick" && event.player.getHistory("useCard").indexOf(event) == 0;
    },
    logTarget: "player",
    check(event, player2) {
      return get.attitude(player2, event.player) > 0;
    },
    async content(event, trigger, player2) {
      await trigger.player.draw();
    },
    ai: {
      expose: 0.2
    }
  },
  nslongyue_ai: {
    mod: {
      aiOrder(player2, card, num) {
        if (!player2.getHistory("useCard").length && get.type(card) == "trick" && game.hasPlayer(function(current) {
          return current.hasSkill("nslongyue") && get.attitude(player2, current) >= 0;
        })) {
          return num + 6;
        }
      }
    },
    trigger: { player: "dieAfter" },
    filter: () => {
      return !game.hasPlayer((i) => i.hasSkill("nslongyue", null, null, false), true);
    },
    silent: true,
    forceDie: true,
    content: () => {
      game.removeGlobalSkill("nslongyue_ai");
    }
  },
  nszhenyin: {
    trigger: { global: "judge" },
    usable: 1,
    filter(event, player2) {
      return _status.currentPhase?.countCards("hs") > 0;
    },
    logTarget() {
      return _status.currentPhase;
    },
    check(event, player2) {
      var target = _status.currentPhase;
      var judge = event.judge(event.player.judging[0]);
      var max = 0;
      var hs = target.getCards("h", function(card) {
        var mod2 = game.checkMod(card, target, "unchanged", "cardEnabled2", target);
        if (mod2 != "unchanged") {
          return mod2;
        }
        var mod = game.checkMod(card, target, "unchanged", "cardRespondable", target);
        if (mod != "unchanged") {
          return mod;
        }
        return true;
      });
      for (var i of hs) {
        var num = event.judge(i) - judge;
        if (num > max) {
          max = num;
        }
      }
      var att = get.attitude(player2, target);
      if (att > 0) {
        return max > 0;
      }
      if (att < 0) {
        return max <= 0;
      }
      return false;
    },
    async content(event, trigger, player2) {
      const target = _status.currentPhase;
      if (target?.hasCard((card) => {
        const player3 = _status.currentPhase;
        const mod2 = game.checkMod(card, player3, "unchanged", "cardEnabled2", player3);
        if (mod2 != "unchanged") {
          return mod2;
        }
        const mod = game.checkMod(card, player3, "unchanged", "cardRespondable", player3);
        if (mod != "unchanged") {
          return mod;
        }
        return true;
      }, "hs")) {
        const result2 = await target.chooseCard(
          `${target == trigger.player ? "你" : get.translation(trigger.player)}的${trigger.judgestr || ""}判定为${get.translation(trigger.player.judging[0])}，请打出一张手牌进行改判`,
          "hs",
          (card) => {
            const player3 = get.player();
            const mod2 = game.checkMod(card, player3, "unchanged", "cardEnabled2", player3);
            if (mod2 != "unchanged") {
              return mod2;
            }
            const mod = game.checkMod(card, player3, "unchanged", "cardRespondable", player3);
            if (mod != "unchanged") {
              return mod;
            }
            return true;
          }
        ).set("ai", (card) => {
          const trigger2 = get.event().getTrigger();
          const { player: player3, judging } = get.event();
          const result3 = trigger2.judge(card) - trigger2.judge(judging);
          const attitude = get.attitude(player3, trigger2.player);
          if (attitude == 0 || result3 == 0) {
            return 0;
          }
          if (attitude > 0) {
            return result3 / Math.max(0.1, get.value(card));
          } else {
            return -result3 / Math.max(0.1, get.value(card));
          }
        }).set("judging", trigger.player.judging[0]).forResult();
        if (result2?.cards?.length) {
          const next = target.respond(result2.cards, event.name, "highlight", "noOrdering").set("nopopup", true);
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
              game.addVideo("deletenode", player2, get.cardsInfo([trigger.player.judging[0].clone]));
            }
            await game.cardsDiscard(trigger.player.judging[0]);
            trigger.player.judging[0] = cards2[0];
            trigger.orderingCards.addArray(cards2);
            game.log(trigger.player, "的判定牌改为", cards2);
            await game.delay(2);
          }
        }
      }
    },
    ai: {
      rejudge: true,
      tag: { rejudge: 1 }
    }
  },
  nsxianhai: {
    trigger: { global: "damageSource" },
    filter(event, player2) {
      return event.source && event.source != player2 && event.source.isIn() && event.source == _status.currentPhase && (event.source.getStat("damage") || 0) > (player2.getLastStat("damage") || 0) && !player2.hasSkill("nsxianhai_round");
    },
    check(event, player2) {
      return player2.maxHp > 1 && get.attitude(player2, event.source) < -4;
    },
    logTarget: "source",
    async content(event, trigger, player2) {
      let result2;
      player2.addTempSkill("nsxianhai_round", "roundStart");
      await player2.loseMaxHp();
      const slotSet = /* @__PURE__ */ new Set();
      for (const slot of [1, 2, 3, 4, 5]) {
        if (trigger.source.hasEnabledSlot(slot)) {
          slotSet.add(slot === 3 || slot === 4 ? "equip3_4" : `equip${slot}`);
        }
      }
      const list = Array.from(slotSet);
      if (list.length) {
        result2 = await player2.chooseControl(list).set("prompt", "选择废除" + get.translation(trigger.source) + "的一种装备栏").set("ai", () => {
          const target = _status.event.getTrigger().source;
          if (list.includes("equip6") && target.getEquip("equip3") && target.getEquip("equip4")) {
            return "equip6";
          }
          if (list.includes("equip2") && target.getEquip(2) && get.value(target.getEquip(2), target) > 0) {
            return "equip2";
          }
          if (list.includes("equip5") && target.getEquip(5) && get.value(target.getEquip(5), target) > 0) {
            return "equip5";
          }
          return 0;
        }).forResult();
        if (result2.control !== "equip3_4") {
          trigger.source.disableEquip(result2.control);
        } else {
          trigger.source.disableEquip(3, 4);
        }
      }
      if (player2.awakenedSkills.includes("nsxingchu")) {
        const next = game.createEvent("nsxianhai_clear");
        event.next.remove(next);
        event.getParent("phase").after.push(next);
        next.player = player2;
        next.setContent(function() {
          player2.restoreSkill("nsxingchu");
        });
      }
      if (trigger.source) {
        const hs = trigger.source.getCards("h", "shan");
        if (hs.length) {
          await trigger.source.discard(hs);
        }
      }
    }
  },
  nsxianhai_round: { charlotte: true },
  nsxingchu: {
    trigger: { global: "die" },
    forceDie: true,
    filter(event, player2) {
      return player2 == event.player || player2 == event.source;
    },
    limited: true,
    skillAnimation: true,
    animationColor: "wood",
    direct: true,
    async content(event, trigger, player2) {
      const result2 = await player2.chooseTarget(get.prompt2("nsxingchu")).set("ai", function(target) {
        return get.attitude(_status.event.player, target);
      }).set("forceDie", true).forResult();
      if (result2.bool) {
        const target = result2.targets[0];
        player2.logSkill("nsxingchu", target);
        player2.awakenSkill(event.name);
        const he = trigger.player.getCards("he");
        if (he.length) {
          await target.gain(he, trigger.player, "giveAuto", "bySelf");
        }
        await target.gainMaxHp();
      }
    }
  },
  nsshengyan: {
    trigger: { player: "judgeEnd" },
    forced: true,
    filter(event, player2) {
      const { currentPhase } = _status;
      return currentPhase?.isIn() && !player2.getStorage("nsshengyan_record").includes(event.result.suit);
    },
    logTarget: () => _status.currentPhase,
    async content(event, trigger, player2) {
      const record = event.name + "_record";
      player2.addTempSkill(record);
      player2.markAuto(record, [trigger.result.suit]);
      player2.storage[record].sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
      player2.addTip(record, get.translation(record) + player2.getStorage(record).reduce((str, suit) => str + get.translation(suit), ""));
      const { currentPhase } = _status;
      if (!currentPhase.isIn()) {
        return;
      }
      currentPhase.addTempSkill(event.name + "_effect");
      currentPhase.addMark(event.name + "_effect", 2, false);
    },
    subSkill: {
      record: {
        charlotte: true,
        onremove(player2, skill) {
          delete player2.storage[skill];
          player2.removeTip(skill);
        },
        intro: { content: "本回合已判定花色：$" }
      },
      effect: {
        charlotte: true,
        onremove: true,
        markimage: "image/card/handcard.png",
        intro: { content: "手牌上限+#" },
        mod: {
          maxHandcard(player2, num) {
            return num + player2.countMark("nsshengyan_effect");
          }
        },
        marktext: "筵"
      }
    }
  },
  nsdaizhan: {
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player2) {
      return ["lebu", "bingliang"].some(
        (name) => player2.hasCard((card) => player2.canAddJudge({ name, cards: [card] }) && (_status.connectMode || get.type2(card) != "trick"), "he")
      );
    },
    async cost(event, trigger, player2) {
      const list = ["lebu", "bingliang"].filter(
        (name) => player2.hasCard((card) => player2.canAddJudge({ name, cards: [card] }) && get.type2(card) != "trick", "he")
      );
      const result2 = await player2.chooseButton([get.prompt2(event.skill), [list.map((name) => [get.type(name), "", name]), "vcard"]]).set("ai", (button) => {
        const player3 = get.player();
        if (button.link[2] == "lebu") {
          return 0;
        }
        const delta = player3.getHandcardLimit() + player3.countCards("j") * 2 + 2 - player3.hp;
        if (delta >= 2) {
          return 1 + Math.random();
        }
        if (delta >= 0 && !player3.countCards("h", (card) => player3.hasValueTarget(card))) {
          return Math.random();
        }
        return 0;
      }).forResult();
      event.result = {
        bool: result2?.bool,
        cost_data: result2?.links,
        skill_popup: false
      };
    },
    async content(event, trigger, player2) {
      const { cost_data: links } = event;
      const card = { name: links[0][2] };
      game.broadcastAll((card2) => {
        lib.skill.nsdaizhan_backup.viewAs = card2;
      }, card);
      const next = player2.chooseToUse();
      next.set("openskilldialog", "怠战：是否将一张非锦囊牌当做" + get.translation(card) + "对自己使用？");
      next.set("norestore", true);
      next.set("addCount", false);
      next.set("_backupevent", "nsdaizhan_backup");
      next.set("custom", {
        add: {},
        replace: { window() {
        } }
      });
      next.backup("nsdaizhan_backup");
      await next;
    },
    subSkill: {
      backup: {
        filterCard(card, player2) {
          return get.itemtype(card) == "card" && get.type2(card) != "trick" && player2.canAddJudge({
            name: lib.skill.nsdaizhan_backup.viewAs.name,
            cards: [card]
          });
        },
        filterTarget(card, player2, target) {
          return player2 == target;
        },
        selectTarget: -1,
        check(card) {
          return 8 - get.value(card);
        },
        position: "he",
        async precontent(event, trigger, player2) {
          player2.addTempSkill("nsdaizhan_effect");
        },
        ai: { result: { target: 1 } }
      },
      effect: {
        charlotte: true,
        trigger: { player: "phaseEnd" },
        forced: true,
        popup: false,
        filter(event, player2) {
          return player2.countCards("h") < player2.getHandcardLimit();
        },
        async content(event, trigger, player2) {
          await player2.drawTo(player2.getHandcardLimit());
        },
        ai: { nowuxie_judge: true }
      }
    }
  },
  nsjiquan: {
    trigger: {
      global: ["damageEnd", "damageSource"]
    },
    direct: true,
    filter(event, player2, name) {
      var target = name == "damageSource" ? event.source : event.player;
      return target && target != player2 && get.distance(player2, target) <= 1 && target.countCards("hej") > 0;
    },
    locked(skill, player2) {
      return player2 && player2.storage.nsfuwei;
    },
    async content(event, trigger, player2) {
      let result2;
      const target = event.triggername == "damageSource" ? trigger.source : trigger.player;
      event.target = target;
      result2 = await player2.choosePlayerCard(target, "hej", player2.storage.nsfuwei ? true : 1).set("ai", (button) => {
        const val = get.buttonValue(button);
        if (get.attitude(_status.event.player, get.owner(button.link)) > 0) {
          return -val;
        }
        return val;
      }).forResult();
      if (!result2.bool) {
        return;
      }
      player2.logSkill("nsjiquan", target);
      const next = player2.addToExpansion(result2.cards, target, "give");
      next.gaintag.add("nsjiquan_mark");
      await next;
      await game.delayx();
    },
    mod: {
      cardUsable(card, player2, num) {
        if (card.name == "sha") {
          return num + player2.getExpansions("nsjiquan_mark").length;
        }
      }
    }
  },
  nsjiquan_mark: {
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    marktext: "威"
  },
  nsfuwei: {
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "thunder",
    filter(event, player2) {
      return player2.getExpansions("nsjiquan_mark").length > 4;
    },
    async content(event, trigger, player2) {
      player2.awakenSkill(event.name);
      player2.addSkill("nsdiemou");
      player2.addSkill("nszhihuang");
      player2.gainMaxHp(2);
    },
    derivation: ["nsdiemou", "nszhihuang"],
    ai: { combo: "nsjiquan" }
  },
  nsdiemou: {
    trigger: { player: "phaseUseBegin" },
    forced: true,
    filter(event, player2) {
      return player2.getExpansions("nsjiquan_mark").length > game.players.length;
    },
    async content(event, trigger, player2) {
      const cards2 = player2.getExpansions("nsjiquan_mark");
      player2.draw(cards2.length);
      player2.loseMaxHp();
      player2.loseToDiscardpile(cards2);
      if (cards2.length > 4) {
        player2.turnOver();
      }
    },
    ai: {
      combo: "nsjiquan"
    }
  },
  nszhihuang: {
    available(mode) {
      return mode == "identity" || mode == "versus" && (_status.mode == "four" || _status.mode == "guandu") || mode == "guozhan";
    },
    group: "nszhihuang_damage",
    trigger: { global: "useCard" },
    usable: 1,
    filter(event, player2) {
      return event.player == get.zhu(player2) && player2.getExpansions("nsjiquan_mark").length > 0 && event.cards && event.cards.filterInD().length > 0;
    },
    prompt2(event) {
      return "移去一张“威”并获得" + get.translation(event.cards.filterInD());
    },
    check(event, player2) {
      if (["equip", "delay"].includes(get.type(event.card))) {
        return get.attitude(player2, event.player) < 0;
      }
      return get.value(event.cards.filterInD()) > 0;
    },
    logTarget: "player",
    async content(event, trigger, player2) {
      let result2;
      const cards2 = player2.getExpansions("nsjiquan_mark");
      if (cards2.length === 1) {
        result2 = {
          bool: true,
          links: cards2.slice(0)
        };
      } else {
        result2 = await player2.chooseButton({
          createDialog: ["选择移去一张“威”", cards2],
          forced: true
        }).forResult();
      }
      if (!result2.bool || !result2.links?.length) {
        return;
      }
      await player2.loseToDiscardpile({
        cards: result2.links
      });
      await player2.gain({
        cards: trigger.cards.filterInD(),
        animate: "gain2",
        log: true
      });
    },
    ai: {
      combo: "nsjiquan"
    }
  },
  nszhihuang_damage: {
    trigger: { source: "damageBegin1" },
    forced: true,
    sourceSkill: "nszhihuang",
    filter(event, player2) {
      var zhu = get.zhu(player2);
      return zhu && player2.countCards("h") > zhu.countCards("h") && event.getParent().type == "card";
    },
    async content(event, trigger, player2) {
      trigger.num++;
    }
  },
  //OL神张角
  junksijun: {
    audio: "sijun",
    inherit: "sijun",
    check(event, player2) {
      return ui.cardPile.childNodes.length;
    },
    async content(event, trigger, player2) {
      player2.removeMark("yizhao", player2.countMark("yizhao"));
      const pile = Array.from(ui.cardPile.childNodes);
      if (pile.length) {
        const max = Math.pow(2, Math.min(100, pile.length));
        let bool = false, index, cards2 = [];
        for (let i = 0; i < max; i++) {
          let num = 0;
          index = i.toString(2);
          while (index.length < pile.length) {
            index = "0" + index;
          }
          for (var k = 0; k < index.length; k++) {
            if (index[k] == "1") {
              num += get.number(pile[k]);
            }
            if (num > 36) {
              break;
            }
          }
          if (num == 36) {
            bool = true;
            break;
          }
        }
        if (bool) {
          for (let k2 = 0; k2 < index.length; k2++) {
            if (index[k2] == "1") {
              cards2.push(pile[k2]);
            }
          }
          await player2.gain(cards2, "gain2");
        } else {
          let total = 0;
          for (const card of pile) {
            total += get.number(card);
            cards2.push(card);
            if (total >= 36) {
              break;
            }
          }
        }
        if (cards2.length) {
          await player2.gain(cards2, "gain2");
        }
      }
    }
  },
  //手杀削弱版许攸
  junkshicai: {
    audio: "nzry_shicai_2",
    trigger: { player: "useCardAfter" },
    filter(event, player2) {
      if (!event.cards.filterInD("oe").length) {
        return false;
      }
      return player2.getHistory("useCard", (evt) => get.type2(evt.card) == get.type2(event.card)).indexOf(event) == 0;
    },
    prompt2(event, player2) {
      const cards2 = event.cards.filterInD("oe");
      return "你可以将" + get.translation(cards2) + (cards2.length > 1 ? "以任意顺序" : "") + "置于牌堆顶，然后摸一张牌";
    },
    async content(event, trigger, player2) {
      let result2;
      let cards2 = trigger.cards.filterInD("oe");
      const loseList = [];
      for (const card of cards2) {
        const owner = get.owner(card);
        if (!owner) {
          continue;
        }
        const existed = loseList.find((item) => item[0] == owner);
        if (existed) {
          existed[1].push(card);
        } else {
          loseList.push([owner, [card]]);
        }
      }
      if (loseList.length) {
        await game.loseAsync({
          lose_list: loseList
        }).setContent("chooseToCompareLose");
      }
      if (cards2.length > 1) {
        result2 = await player2.chooseToMove({ prompt: "恃才：将牌按顺序置于牌堆顶" }).set("list", [["牌堆顶", cards2]]).set("reverse", _status.currentPhase?.next ? get.attitude(player2, _status.currentPhase.next) > 0 : false).set("processAI", (list) => {
          const sorted = list[0][1].slice(0);
          sorted.sort((a, b) => {
            return (_status.event.reverse ? 1 : -1) * (get.value(b) - get.value(a));
          });
          return [sorted];
        }).forResult();
        if (result2.bool && result2.moved && result2.moved[0].length) {
          cards2 = result2.moved[0].slice(0);
        }
      }
      cards2.reverse();
      await game.cardsGotoPile(cards2, "insert");
      game.log(player2, "将", cards2, "置于了牌堆顶");
      await player2.draw();
    },
    ai: {
      reverseOrder: true,
      skillTagFilter(player2) {
        if (player2.getHistory("useCard", function(evt) {
          return get.type(evt.card) == "equip";
        }).length > 0) {
          return false;
        }
      }
    }
  },
  //削弱版段煨
  junklangmie: {
    audio: "langmie",
    trigger: { global: "phaseJieshuBegin" },
    direct: true,
    filter(event, player2) {
      if (player2 == event.player || player2.countCards("he") == 0) {
        return false;
      }
      var num = 0;
      if (event.player.hasHistory("sourceDamage", function(evt) {
        num += evt.num;
        return num >= 2;
      })) {
        return true;
      }
      var map = {};
      return event.player.hasHistory("useCard", function(i) {
        var name = get.type2(i.card, false);
        if (!map[name]) {
          map[name] = true;
          return false;
        }
        return true;
      });
    },
    async content(event, trigger, player2) {
      let result2;
      const list = [];
      let num = 0;
      const target = trigger.player;
      event.target = target;
      event.choices = [];
      const map = {};
      if (target.hasHistory("useCard", (i) => {
        const name = get.type2(i.card, false);
        if (!map[name]) {
          map[name] = true;
          return false;
        }
        return true;
      })) {
        list.push("弃置一张牌，然后摸两张牌");
        event.choices.push("draw");
      }
      if (target.hasHistory("sourceDamage", (evt) => {
        num += evt.num;
        return num >= 2;
      })) {
        list.push("弃置一张牌，对" + get.translation(target) + "造成1点伤害");
        event.choices.push("damage");
      }
      result2 = await player2.chooseControl("cancel2").set("choiceList", list).set("ai", function() {
        const player3 = _status.event.player;
        const choices = _status.event.getParent().choices.slice(0);
        choices.push("cancel");
        const choicex = choices.slice(0);
        const getx = function(a) {
          switch (a) {
            case "draw":
              return 2 * get.effect(player3, { name: "draw" }, player3, player3);
            case "damage":
              return get.damageEffect(_status.event.getParent().target, player3, player3);
            default:
              return 0;
          }
        };
        choices.sort(function(a, b) {
          return getx(b) - getx(a);
        });
        return choicex.indexOf(choices[0]);
      }).set("prompt", get.prompt("junklangmie", target)).forResult();
      if (result2.control == "cancel2") {
        return;
      }
      event.choice = event.choices[result2.index];
      result2 = await player2.chooseToDiscard("he").set("ai", (card) => 7 - get.value(card)).set("logSkill", event.choice == "draw" ? "junklangmie" : ["junklangmie", target]).forResult();
      if (result2.bool) {
        if (event.choice == "draw") {
          await player2.draw(2);
        } else {
          await target.damage();
        }
      }
    }
  },
  //李典光速通渠传说
  junkwangxi: {
    audio: "wangxi",
    inherit: "wangxi",
    async content(event, trigger, player2) {
      const target = get.info(event.name).logTarget(trigger, player2);
      const result2 = await player2.draw(2).forResult();
      if (get.itemtype(result2.cards) == "cards" && target.isIn() && player2.hasCard((card) => result2.cards.includes(card), "he")) {
        await player2.chooseToGive(target, "he", true, (card) => get.event().cards?.includes(card)).set("cards", result2.cards);
      }
    }
  },
  //2013标准包双蜀黑
  junkjizhi: {
    audio: "jizhi",
    trigger: { player: "useCard" },
    frequent: true,
    filter(event, player2) {
      return get.type(event.card) == "trick" && event.card.isCard;
    },
    async content(event, trigger, player2) {
      let result2;
      const card = get.cards()[0];
      await game.cardsGotoOrdering(card);
      await player2.showCards(card, get.translation(player2) + "发动了【集智】");
      if (get.type(card) !== "basic") {
        await player2.gain(card, "gain2");
        return;
      }
      if (!player2.countCards("h")) {
        return;
      }
      result2 = await player2.chooseCard(
        "h",
        "是否用一张手牌交换" + get.translation(card) + "？",
        "若选择「取消」，则" + get.translation(card) + "将被置入弃牌堆。"
      ).forResult();
      if (result2.bool && result2.cards?.length) {
        const handcard = result2.cards[0];
        player2.$throw(handcard, 1e3);
        game.log(player2, "将", handcard, "置于牌堆顶");
        await player2.lose(handcard, ui.cardPile, "visible", "insert");
        await player2.gain(card, "gain2");
      }
    }
  },
  junkqicai: {
    mod: {
      targetInRange(card, player2, target, now) {
        var type = get.type(card);
        if (type == "trick" || type == "delay") {
          return true;
        }
      },
      canBeDiscarded(card, player2, target) {
        if (get.position(card) == "e" && !get.subtypes(card).some((subtype) => ["equip3", "equip4", "equip6"].includes(subtype)) && player2 != target) {
          return false;
        }
      }
    }
  },
  junkrende: {
    audio: "rende",
    enable: "phaseUse",
    usable: 1,
    filter(event, player2) {
      return player2.countCards("h") > 0;
    },
    filterTarget: lib.filter.notMe,
    filterCard: true,
    selectCard: [1, Infinity],
    allowChooseAll: true,
    position: "h",
    discard: false,
    lose: false,
    delay: false,
    async content(event, trigger, player2) {
      const { cards: cards2, target, targets } = event;
      const assignedTargets = targets.slice(0);
      let result2;
      event.num = cards2.length;
      event.targets = assignedTargets;
      await player2.give(cards2, target);
      if (event.num > 1) {
        await player2.recover();
      }
      while (player2.countCards("h") > 0 && game.hasPlayer((current) => current != player2 && !assignedTargets.includes(current))) {
        result2 = await player2.chooseCardTarget({
          prompt: "是否继续分配剩余的手牌",
          prompt2: "操作提示：请先选择要分配的手牌，然后再选择一名角色，该角色将获得你选择的所有手牌。",
          filterCard: true,
          selectCard: [1, Infinity],
          filterTarget(card, player3, target2) {
            return target2 != player3 && !assignedTargets.includes(target2);
          }
        }).forResult();
        if (!result2.bool) {
          break;
        }
        const currentTarget = result2.targets[0];
        const selectedCards = result2.cards;
        player2.line(currentTarget, "green");
        await player2.give(selectedCards, currentTarget);
        assignedTargets.push(currentTarget);
        const prevNum = event.num;
        event.num += selectedCards.length;
        if (prevNum < 2 && event.num > 1) {
          await player2.recover();
        }
      }
    }
  },
  //十周年削弱版张让
  junktaoluan: {
    hiddenCard(player2, name) {
      return !player2.getStorage("junktaoluan").includes(name) && player2.countCards("hes", (card) => !player2.getStorage("junktaoluan2").includes(get.suit(card))) > 0 && !player2.hasSkill("junktaoluan3") && lib.inpile.includes(name);
    },
    audio: "taoluan",
    enable: "chooseToUse",
    filter(event, player2) {
      return !player2.hasSkill("junktaoluan3") && player2.countCards("hes", (card) => {
        return lib.inpile.some((name) => {
          if (player2.getStorage("junktaoluan2").includes(get.suit(card))) {
            return false;
          }
          if (player2.getStorage("junktaoluan").includes(name)) {
            return false;
          }
          if (get.type(name) != "basic" && get.type(name) != "trick") {
            return false;
          }
          if (event.filterCard(
            {
              name,
              isCard: true,
              cards: [card]
            },
            player2,
            event
          )) {
            return true;
          }
          if (name == "sha") {
            for (var nature of lib.inpile_nature) {
              if (event.filterCard(
                {
                  name,
                  nature,
                  isCard: true,
                  cards: [card]
                },
                player2,
                event
              )) {
                return true;
              }
            }
          }
          return false;
        });
      }) > 0;
    },
    chooseButton: {
      dialog(event, player2) {
        var list = [];
        for (var name of lib.inpile) {
          if (get.type(name) == "basic" || get.type(name) == "trick") {
            if (player2.getStorage("junktaoluan").includes(name)) {
              continue;
            }
            list.push([get.translation(get.type(name)), "", name]);
            if (name == "sha") {
              for (var j of lib.inpile_nature) {
                list.push(["基本", "", "sha", j]);
              }
            }
          }
        }
        return ui.create.dialog("滔乱", [list, "vcard"]);
      },
      filter(button, player2) {
        return _status.event.getParent().filterCard({ name: button.link[2] }, player2, _status.event.getParent());
      },
      check(button) {
        var player2 = _status.event.player;
        var card = {
          name: button.link[2],
          nature: button.link[3]
        };
        if (player2.countCards("hes", (cardx) => cardx.name == card.name)) {
          return 0;
        }
        return _status.event.getParent().type == "phase" ? player2.getUseValue(card) : 1;
      },
      backup(links, player2) {
        return {
          filterCard(card, player3) {
            return !player3.getStorage("junktaoluan2").includes(get.suit(card));
          },
          audio: "taoluan",
          popname: true,
          check(card) {
            return 7 - get.value(card);
          },
          position: "hse",
          viewAs: { name: links[0][2], nature: links[0][3] },
          onuse(result2, player3) {
            player3.markAuto("junktaoluan2", [get.suit(result2.cards[0], player3)]);
            var evt = _status.event.getParent("phase");
            if (evt && evt.name == "phase" && !evt.junktaoluan) {
              evt.junktaoluan = true;
              var next = game.createEvent("taoluan_clear");
              _status.event.next.remove(next);
              evt.after.push(next);
              next.player = player3;
              next.setContent(function() {
                delete player3.storage.junktaoluan2;
              });
            }
            player3.markAuto("junktaoluan", [result2.card.name]);
          }
        };
      },
      prompt(links, player2) {
        return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
      }
    },
    ai: {
      order: 4,
      save: true,
      respondSha: true,
      respondShan: true,
      skillTagFilter(player2, tag, arg) {
        if (!player2.countCards("hes", (card) => !player2.getStorage("junktaoluan2").includes(get.suit(card))) || player2.hasSkill("taoluan3")) {
          return false;
        }
        if (tag == "respondSha" || tag == "respondShan") {
          if (arg == "respond") {
            return false;
          }
          return !player2.getStorage("taoluan").includes(tag == "respondSha" ? "sha" : "shan");
        }
        return !player2.getStorage("taoluan").includes("tao") || !player2.getStorage("taoluan").includes("jiu") && arg == player2;
      },
      result: {
        player(player2) {
          var players = game.filterPlayer();
          for (var i = 0; i < players.length; i++) {
            if (players[i] != player2 && players[i].countCards("he") && get.attitude(player2, players[i]) > 0) {
              return 1;
            }
          }
          return 0;
        }
      },
      threaten: 1.9
    },
    group: "junktaoluan2"
  },
  junktaoluan2: {
    trigger: { player: ["useCardAfter", "respondAfter"] },
    forced: true,
    popup: false,
    charlotte: true,
    sourceSkill: "junktaoluan",
    filter(event, player2) {
      if (!game.hasPlayer((current) => current != player2)) {
        return false;
      }
      return event.skill == "junktaoluan_backup";
    },
    async content(event, trigger, player2) {
      let result2;
      result2 = await player2.chooseTarget(
        true,
        (card, player3, target2) => {
          return target2 != player3;
        },
        "###滔乱###令一名其他角色选择一项：1.交给你一张与你以此法使用的牌类别不同的牌；2.你失去1点体力"
      ).set("ai", (target2) => {
        const player3 = _status.event.player;
        if (get.attitude(player3, target2) > 0) {
          if (get.attitude(target2, player3) > 0) {
            return target2.countCards("h");
          }
          return target2.countCards("h") / 2;
        }
        return 0;
      }).forResult();
      const target = result2.targets[0];
      player2.line(target, "green");
      const type = get.type(trigger.card, "trick");
      result2 = await target.chooseCard(
        "###滔乱###交给" + get.translation(player2) + "一张不为" + get.translation(type) + "牌的牌，或令其失去1点体力且滔乱无效直到回合结束",
        "he",
        (card, player3, target2) => {
          return get.type(card, "trick") != _status.event.cardType;
        }
      ).set("cardType", type).set("ai", (card) => {
        if (_status.event.att) {
          return 11 - get.value(card);
        }
        return 0;
      }).set("att", get.attitude(target, player2) > 0).forResult();
      if (result2.bool) {
        await target.give(result2.cards, player2, "visible");
      } else {
        player2.addTempSkill("junktaoluan3");
      }
    }
  },
  junktaoluan3: {
    charlotte: true,
    trigger: { player: "phaseEnd" },
    forced: true,
    popup: false,
    sourceSkill: "junktaoluan",
    async content(event, trigger, player2) {
      player2.loseHp();
    }
  },
  junktaoluan_backup: { charlotte: true },
  nshuaishuang: {
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    async content(event, trigger, player2) {
      const card = get.cardPile((card2) => card2.name == "tao");
      if (card) {
        await player2.gain(card, "gain2");
      } else {
        return;
      }
      game.updateRoundNumber();
      await player2.loseHp();
    }
  },
  nsfengli: {
    trigger: { player: "phaseEnd" },
    direct: true,
    filter(event, player2) {
      return player2.countCards("h") > 0 && game.hasPlayer(function(current) {
        return current != player2 && !current.hasSkill("nsfengli_use");
      });
    },
    async content(event, trigger, player2) {
      const result2 = await player2.chooseTarget(get.prompt2("nsfengli"), function(card, player3, target) {
        return target != player3 && !target.hasSkill("nsfengli_use");
      }).set("ai", function(target) {
        return get.attitude(_status.event.player, target) / (5 + target.countCards("h"));
      }).forResult();
      if (result2.bool) {
        const target = result2.targets[0];
        player2.logSkill("nsfengli", target);
        const cards2 = player2.getCards("h");
        player2.addShownCards(cards2, "visible_nsfengli");
        player2.addSkill("nsfengli2");
        target.addSkill("nsfengli_use");
        target.storage.nsfengli_use = player2;
      }
    },
    group: ["nsfengli_draw", "nsfengli_clear"],
    onremove(player2) {
      player2.removeSkill("nsfengli2");
    }
  },
  nsfengli_draw: {
    trigger: {
      player: ["loseAfter", "hideShownCardsAfter"],
      global: ["gainAfter", "equipAfter", "addJudgeAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    direct: true,
    charlotte: true,
    sourceSkill: "nsfengli",
    filter(event, player2, name) {
      if (event.name == "hideShownCards") {
        const hs = player2.countCards("h");
        return game.hasPlayer((current) => current.countCards("h") < hs);
      }
      var num = 0;
      var evt = event.getl(player2);
      if (!evt || !evt.gaintag_map) {
        return false;
      }
      for (var i in evt.gaintag_map) {
        if (evt.gaintag_map[i].some((tag) => tag.indexOf("visible_") == 0)) {
          num++;
        }
      }
      if (event.getg) {
        if (event.name == "gain") {
          if (event.getlx === false && event.gaintag.some((tag) => tag.indexOf("visible_") == 0)) {
            num -= event.cards.length;
          }
        } else {
          player2.checkHistory("gain", function(evt2) {
            if (evt2.parent == event && evt2.gaintag.some((tag) => tag.indexOf("visible_") == 0)) {
              num -= evt2.cards.length;
            }
          });
        }
      }
      if (num > 0) {
        const hs = player2.countCards("h");
        return game.hasPlayer((current) => current.countCards("h") < hs);
      }
    },
    async content(event, trigger, player2) {
      const result2 = await player2.chooseTarget({
        prompt: "奉礼：是否令一名手牌数小于你的其他角色摸一张牌？",
        filterTarget(card, player3, target) {
          return target !== player3 && target.countCards("h") < player3.countCards("h");
        },
        ai(target) {
          const player3 = get.player();
          let att = get.attitude(player3, target) / Math.sqrt(1 + target.countCards("h"));
          if (target.hasSkillTag("nogain")) {
            att /= 10;
          }
          return att;
        }
      }).forResult();
      if (result2.bool && result2.targets?.length) {
        const target = result2.targets[0];
        player2.logSkill("nsfengli", target);
        await target.draw();
      }
    }
  },
  nsfengli_clear: {
    trigger: { player: "phaseBegin" },
    forced: true,
    sourceSkill: "nsfengli",
    filter(event, player2) {
      return player2.hasSkill("nsfengli2");
    },
    async content(event, trigger, player2) {
      const cards2 = player2.getShownCards();
      if (cards2.length > 0) {
        player2.hideShownCards(cards2);
      }
      player2.removeSkill("nsfengli2");
    }
  },
  nsfengli2: {
    onremove(player2) {
      player2.removeGaintag("nsfengli2");
      game.countPlayer(function(current) {
        if (current.storage.nsfengli_use == player2) {
          current.removeSkill("nsfengli_use");
        }
      });
    }
  },
  nsfengli_use: {
    hiddenCard(player2, name) {
      if (player2 == _status.currentPhase) {
        return false;
      }
      var target = player2.storage.nsfengli_use;
      var cards2 = target.getShownCards();
      for (var i of cards2) {
        if (get.name(i, target) == name) {
          return true;
        }
      }
      return false;
    },
    enable: ["chooseToUse", "chooseToRespond"],
    charlotte: true,
    onremove: true,
    sourceSkill: "nsfengli",
    filter(event, player2) {
      if (player2 == _status.currentPhase) {
        return false;
      }
      var target = player2.storage.nsfengli_use;
      var cards2 = target.getShownCards();
      for (var i of cards2) {
        if (event.filterCard(
          {
            name: get.name(i, target),
            nature: get.nature(i, target),
            isCard: true
          },
          player2,
          event
        )) {
          return true;
        }
      }
      return false;
    },
    chooseButton: {
      dialog(event, player2) {
        var target = player2.storage.nsfengli_use;
        var cards2 = target.getShownCards();
        return ui.create.dialog("奉礼", cards2);
      },
      filter(button, player2) {
        var evt = _status.event.getParent();
        var target = player2.storage.nsfengli_use;
        return evt.filterCard(
          {
            name: get.name(button.link, target),
            nature: get.nature(button.link, target),
            isCard: true
          },
          player2,
          evt
        );
      },
      check(button) {
        var player2 = _status.event.player;
        var evt = _status.event.getParent();
        if (evt.dying) {
          return get.attitude(player2, evt.dying);
        }
        return 1;
      },
      backup(links, player2) {
        var target = player2.storage.nsfengli_use;
        return {
          viewAs: {
            name: get.name(links[0], target),
            nature: get.nature(links[0], target),
            isCard: true
          },
          card: links[0],
          filterCard: () => false,
          selectCard: -1,
          log: false,
          async precontent(event, trigger, player3) {
            const card = lib.skill.nsfengli_use_backup.card;
            const target2 = player3.storage.nsfengli_use;
            event.target = target2;
            player3.logSkill("nsfengli", target2);
            player3.showCards(card, get.translation(player3) + "发动了【奉礼】");
            target2.hideShownCards(card);
          }
        };
      },
      ai: {
        respondSha: true,
        respondhan: true,
        skillTagFilter(player2, tag) {
          var name = "s" + tag.slice("respondS".length);
          return lib.skill.nsfengli_use.hiddenCard(player2, name);
        }
      }
    },
    ai: {
      order: 8,
      result: { player: 1 }
    }
  },
  ns_xiandao: {
    audio: ["huashen", 2],
    forced: true,
    noRemove: true,
    trigger: {
      player: "damageBefore"
    },
    filter(event, player2) {
      return event.nature != null;
    },
    async content(event, trigger, player2) {
      trigger.cancel();
    },
    ai: {
      nofire: true,
      nothunder: true,
      effect: {
        target(card, player2, target) {
          if (get.tag(card, "natureDamage")) {
            return "zeroplayertarget";
          }
        }
      }
    },
    group: "ns_xiandao_add",
    subSkill: {
      add: {
        audio: ["huashen", 2],
        forced: true,
        priority: 10,
        trigger: {
          global: "gameStart",
          player: ["phaseEnd", "enterGame"]
        },
        async content(event, trigger, player2) {
          const n = [1, 2].randomGet();
          if (n === 1) {
            player2.addTempSkill("releiji", { player: "phaseUseBegin" });
            player2.markSkill("releiji", { player: "phaseUseBegin" });
          } else {
            player2.addTempSkill("guidao", { player: "phaseUseBegin" });
            player2.markSkill("guidao", { player: "phaseUseBegin" });
          }
        }
      }
    }
  },
  ns_chuanshu: {
    audio: ["xingshuai", 2],
    trigger: { global: "dying" },
    limited: true,
    skillAnimation: true,
    animationColor: "water",
    filter(event, player2) {
      return event.player.hp <= 0 && event.player != player2;
    },
    check(event, player2) {
      return get.attitude(player2, event.player) > 0;
    },
    logTarget: "player",
    async content(event, trigger, player2) {
      const result2 = await trigger.player.chooseControl("releiji", "guidao").set("prompt", "" + get.translation(trigger.player) + "获得一项技能").forResult();
      trigger.player.addSkills(result2.control);
      await trigger.player.recover(1 - trigger.player.hp);
      await trigger.player.draw(2);
      trigger.player.storage.ns_chuanshu2 = player2;
      trigger.player.addSkill("ns_chuanshu2");
      player2.awakenSkill(event.name);
    }
  },
  ns_chuanshu2: {
    audio: ["songwei", 2],
    mark: "character",
    intro: {
      content: "当你造成或受到一次伤害后，$摸一张牌"
    },
    nopop: true,
    trigger: {
      source: "damageEnd",
      player: "damageEnd"
    },
    forced: true,
    popup: false,
    sourceSkill: "ns_chuanshu",
    filter(event, player2) {
      return player2.storage.ns_chuanshu2 && player2.storage.ns_chuanshu2.isIn() && event.num > 0;
    },
    async content(event, trigger, player2) {
      await game.delayx();
      const target = player2.storage.ns_chuanshu2;
      player2.line(target, "green");
      await target.draw();
      await game.delay();
    },
    onremove: true,
    group: "ns_chuanshu3"
  },
  ns_chuanshu3: {
    audio: 1,
    trigger: {
      player: "dieBegin"
    },
    silent: true,
    onremove: true,
    sourceSkill: "ns_chuanshu",
    filter(event, player2) {
      return player2.storage.ns_chuanshu2 && player2.storage.ns_chuanshu2.isIn();
    },
    async content(event, trigger, player2) {
      await game.delayx();
      const target = player2.storage.ns_chuanshu2;
      player2.line(target, "green");
      target.restoreSkill("ns_chuanshu");
      target.update();
    },
    forced: true,
    popup: false
  },
  ns_xiuzheng: {
    audio: ["xinsheng", 2],
    enable: "phaseUse",
    usable: 1,
    priority: 10,
    filter(event, player2) {
      return ui.cardPile.childElementCount + ui.discardPile.childElementCount >= 2;
    },
    filterTarget(card, player2, target) {
      return player2 != target;
    },
    async content(event, trigger, player2) {
      const { target } = event;
      const cards2 = get.cards(2);
      await player2.showCards(cards2);
      const color1 = get.color(cards2[0]);
      const color2 = get.color(cards2[1]);
      if (color1 == "red" && color2 == "red") {
        await target.damage({ nature: "fire" });
      }
      if (color1 != color2) {
        await player2.discardPlayerCard({
          target,
          position: "he",
          forced: true
        });
      }
      if (color1 == "black" && color2 == "black") {
        await target.damage({ nature: "thunder" });
      }
      if (cards2.length) {
        await player2.gain({
          cards: cards2,
          animate: "gain2"
        });
        await game.delay();
      }
      await player2.chooseToDiscard({
        selectCard: 2,
        position: "he",
        prompt: "请弃置两张牌",
        forced: true
      });
    },
    ai: {
      threaten: 0.5,
      order: 13,
      result: {
        target(player2, target) {
          return get.damageEffect(target, player2);
        }
      }
    }
  },
  nsanruo: {
    unique: true,
    locked: true,
    init(player2) {
      if (!player2.node.handcards1.cardMod) {
        player2.node.handcards1.cardMod = {};
      }
      if (!player2.node.handcards2.cardMod) {
        player2.node.handcards2.cardMod = {};
      }
      var cardMod = function(card) {
        if (get.info(card).multitarget) {
          return;
        }
        if (card.name == "sha" || get.type(card) == "trick") {
          return ["暗弱", "杀或普通锦囊牌对你不可见"];
        }
      };
      player2.node.handcards1.cardMod.nsanruo = cardMod;
      player2.node.handcards2.cardMod.nsanruo = cardMod;
      player2.node.handcards1.classList.add("nsanruo");
      player2.node.handcards2.classList.add("nsanruo");
      if (!ui.css.nsanruo) {
        ui.css.nsanruo = lib.init.sheet(
          '.handcards.nsanruo>.card[data-card-type="trick"]:not(*[data-card-multitarget="1"])>*,.handcards.nsanruo>.card[data-card-name="sha"]>*{visibility:hidden !important}'
        );
      }
    },
    onremove(player2) {
      player2.node.handcards1.classList.remove("nsanruo");
      player2.node.handcards2.classList.remove("nsanruo");
      delete player2.node.handcards1.cardMod.nsanruo;
      delete player2.node.handcards2.cardMod.nsanruo;
    },
    ai: {
      neg: true
    }
  },
  nsxunshan: {
    mod: {
      selectTarget(card, player2, range) {
        if (!player2.hasSkill("nsanruo")) {
          return;
        }
        if (_status.auto) {
          return;
        }
        if (get.position(card) != "h" || get.owner(card) != player2) {
          return;
        }
        if (get.info(card).multitarget) {
          return;
        }
        if (card.name == "sha" || get.type(card) == "trick") {
          range[1] = game.countPlayer();
        }
      }
    },
    ai: {
      combo: "nsanruo"
    }
  },
  nskaicheng: {
    enable: "phaseUse",
    usable: 1,
    zhuSkill: true,
    filter(event, player2) {
      if (!player2.hasZhuSkill("nskaicheng")) {
        return false;
      }
      if (!player2.hasCard(function(card) {
        if (get.info(card).multitarget) {
          return false;
        }
        return card.name == "sha" || get.type(card) == "trick";
      })) {
        return false;
      }
      return game.hasPlayer(function(current) {
        return current != player2 && current.group == "qun";
      });
    },
    filterCard(card) {
      if (get.info(card).multitarget) {
        return false;
      }
      return card.name == "sha" || get.type(card) == "trick";
    },
    filterTarget(card, player2, target) {
      return player2 != target && target.group == "qun";
    },
    lose: false,
    async content(event, trigger, player2) {
      const { target, cards: cards2 } = event;
      let result2;
      result2 = await target.chooseBool("是否将" + get.translation(cards2) + "告知" + get.translation(player2)).set("ai", () => get.attitude(target, player2) > 0).forResult();
      if (!player2.hasUseTarget(cards2[0])) {
        if (result2.bool) {
          result2 = await player2.chooseControl("确定").set("prompt", "你展示的手牌为" + get.translation(cards2)).forResult();
        } else {
          event.hidden = true;
          result2 = await player2.chooseControl("确定").set("prompt", get.translation(target) + "拒绝告知你卡牌信息").forResult();
        }
      } else {
        if (result2.bool) {
          result2 = await player2.chooseBool(
            "是否使用展示的牌？",
            "你展示的手牌为" + get.translation(cards2) + "。如果你使用此牌，则在结算后摸一张牌；如果你不使用此牌，则结束出牌阶段"
          ).forResult();
        } else {
          event.hidden = true;
          result2 = await player2.chooseBool(
            "是否使用展示的牌？",
            get.translation(target) + "拒绝告知你卡牌信息。如果你使用此牌，则在结算后摸一张牌；如果你不使用此牌，则结束出牌阶段"
          ).forResult();
        }
      }
      if (result2.bool) {
        await player2.chooseUseTarget(true, cards2[0], event.hidden ? "选择此牌的目标" : null);
      } else {
        const evt = _status.event.getParent("phaseUse");
        if (evt) {
          evt.skipped = true;
        }
        return;
      }
      await player2.draw();
    },
    ai: {
      combo: "nsanruo"
    }
  },
  nsjuanli: {
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player2, target) {
      return target != player2 && target.countCards("h");
    },
    filter(event, player2) {
      return player2.countCards("h");
    },
    init(player2) {
      player2.storage.nsjuanli_win = [];
      player2.storage.nsjuanli_lose = [];
    },
    intro: {
      content(storage, player2) {
        var str = "";
        if (player2.storage.nsjuanli_win.length) {
          str += get.translation(player2.storage.nsjuanli_win) + "与你距离-1直到与你下次赌牌";
        }
        if (player2.storage.nsjuanli_lose.length) {
          if (str.length) {
            str += "；";
          }
          str += get.translation(player2.storage.nsjuanli_lose) + "与你距离+1直到与你下次赌牌";
        }
        return str;
      }
    },
    onremove: ["nsjuanli_win", "nsjuanli_lose"],
    async content(event, trigger, player2) {
      const { target } = event;
      const prompt2 = "赌牌的两名角色分别亮开一张手牌，若花色相同则赌牌平局，若花色不同，则依次亮出牌堆顶的牌直到翻开的牌与其中一人亮出牌的花色相同，则该角色获得赌牌的胜利";
      let result2;
      player2.storage.nsjuanli_win.remove(target);
      player2.storage.nsjuanli_lose.remove(target);
      result2 = await player2.chooseCard("h", true).set("prompt2", prompt2).forResult();
      if (!result2.bool) {
        return;
      }
      const card1 = result2.cards[0];
      result2 = await target.chooseCard("h", true).set("prompt2", prompt2).forResult();
      if (!result2.bool) {
        return;
      }
      const card2 = result2.cards[0];
      player2.$compare(card1, target, card2);
      await game.delay(0, 1500);
      game.log(player2, "亮出的牌为", card1);
      game.log(target, "亮出的牌为", card2);
      const suit1 = get.suit(card1);
      const suit2 = get.suit(card2);
      if (suit1 == suit2) {
        game.broadcastAll(function(str) {
          const dialog = ui.create.dialog(str);
          dialog.classList.add("center");
          setTimeout(function() {
            dialog.close();
          }, 1e3);
        }, "平局");
        await game.delay(2);
        if (!player2.storage.nsjuanli_win.length && !player2.storage.nsjuanli_lose.length) {
          player2.unmarkSkill("nsjuanli");
        }
        return;
      }
      const cards2 = [];
      for (let i = 0; i < 1e3; i++) {
        const drawn = get.cards();
        if (!drawn || !drawn.length) {
          break;
        }
        const current = drawn[0];
        current.discard();
        cards2.push(current);
        const suit = get.suit(current);
        if (suit == suit1) {
          await player2.showCards(cards2, get.translation(player2) + "赌牌获胜");
          player2.storage.nsjuanli_win.add(target);
          await target.loseHp();
          player2.markSkill("nsjuanli");
          break;
        }
        if (suit == suit2) {
          await player2.showCards(cards2, get.translation(target) + "赌牌获胜");
          player2.storage.nsjuanli_lose.add(target);
          await target.recover();
          player2.markSkill("nsjuanli");
          break;
        }
      }
    },
    mod: {
      globalTo(from, to, distance) {
        if (to.storage.nsjuanli_win && to.storage.nsjuanli_win.includes(from)) {
          return distance - 1;
        }
        if (to.storage.nsjuanli_lose && to.storage.nsjuanli_lose.includes(from)) {
          return distance + 1;
        }
      }
    },
    ai: {
      order: 4,
      result: {
        target(player2, target) {
          if (target.isHealthy()) {
            return -1 / (1 + target.hp);
          } else {
            return -0.3 / (1 + target.hp);
          }
        }
      }
    }
  },
  nsyuanchou: {
    trigger: { target: "useCardToBefore" },
    forced: true,
    priority: 15,
    check(event, player2) {
      return get.effect(event.target, event.card, event.player, player2) < 0;
    },
    filter(event, player2) {
      return get.type(event.card, "trick") == "trick" && get.distance(event.player, player2) > 1;
    },
    async content(event, trigger, player2) {
      trigger.cancel();
    },
    ai: {
      effect: {
        target_use(card, player2, target, current) {
          if (get.type(card, "trick") == "trick" && get.distance(player2, target) > 1) {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  nsguhuo: {
    trigger: { player: "useCardAfter" },
    forced: true,
    usable: 2,
    filter(event, player2) {
      if (event.parent.name == "nsguhuo") {
        return false;
      }
      if (event.card == event.cards[0]) {
        var type = get.type(event.card, "trick");
        var names = [];
        if (get.cardPile(function(card) {
          if (get.type(card, "trick") != type) {
            return false;
          }
          if (get.info(card).multitarget) {
            return false;
          }
          if (names.includes(card.name)) {
            return false;
          }
          if (player2.hasUseTarget(card)) {
            return true;
          } else {
            names.add(card.name);
            return false;
          }
        })) {
          return true;
        }
      }
      return true;
    },
    async content(event, trigger, player2) {
      const type = get.type(trigger.card, "trick");
      const names = [];
      const card = get.cardPile((cardx) => {
        if (get.type(cardx, "trick") != type) {
          return false;
        }
        if (get.info(cardx).multitarget) {
          return false;
        }
        if (names.includes(cardx.name)) {
          return false;
        }
        if (player2.hasUseTarget(cardx)) {
          return true;
        }
        names.add(cardx.name);
        return false;
      });
      if (!card) {
        return;
      }
      const info = get.info(card);
      const targets = game.filterPlayer((current) => {
        return lib.filter.filterTarget(card, player2, current);
      });
      if (!targets.length) {
        return;
      }
      targets.sort(lib.sort.seat);
      const select = get.select(info.selectTarget);
      if (select[0] == -1 || select[1] == -1) {
        await player2.useCard(card, targets, "noai");
        return;
      }
      if (targets.length >= select[0]) {
        const num = select[0] + Math.floor(Math.random() * (select[1] - select[0] + 1));
        await player2.useCard(card, targets.randomGets(num), "noai");
      }
    }
  },
  nsbaiyi: {
    trigger: { player: "phaseDiscardBefore" },
    forced: true,
    filter(event, player2) {
      return player2.storage.nsqinxue && player2.storage.nsqinxue.length;
    },
    async content(event, trigger, player2) {
      let result2;
      trigger.cancel();
      const num = player2.storage.nsqinxue.length;
      result2 = await player2.chooseToDiscard("白衣：请弃置" + get.cnNumber(num) + "张牌", "he", true, num).forResult();
      if (!result2.bool || !result2.cards?.length) {
        return;
      }
      let goon = true;
      if (result2.cards.length === 3) {
        const types = /* @__PURE__ */ new Set();
        for (const card of result2.cards) {
          types.add(get.type(card, "trick"));
        }
        if (types.size === 3 && trigger.getParent().skill != "nsbaiyi") {
          goon = false;
          await player2.insertPhase();
        }
      }
      if (!goon) {
        return;
      }
      const cards2 = get.cards(result2.cards.length);
      result2 = await player2.chooseCardButton(cards2, "获得一张牌", true).forResult();
      if (result2.bool && result2.links?.length) {
        await player2.gain(result2.links, "draw");
        for (const card of cards2) {
          if (!result2.links.includes(card)) {
            card.discard();
          }
        }
      }
    },
    ai: {
      threaten: 1.5,
      combo: "nsqinxue"
    }
  },
  nsqinxue: {
    trigger: { player: "useCard" },
    init(player2) {
      player2.storage.nsqinxue = [];
    },
    forced: true,
    filter(event, player2) {
      var type = get.type(event.card, "trick");
      if (player2.storage.nsqinxue.includes(type)) {
        return false;
      }
      return ["basic", "trick", "equip"].includes(type);
    },
    async content(event, trigger, player2) {
      let card;
      const type0 = get.type(trigger.card, "trick");
      let type = null;
      switch (type0) {
        case "basic": {
          type = "trick";
          break;
        }
        case "trick": {
          type = "equip";
          break;
        }
        case "equip": {
          type = "basic";
          break;
        }
      }
      card = get.cardPile((cardx) => {
        return get.type(cardx, "trick") == type;
      });
      if (card) {
        await player2.gain({
          cards: [card],
          animate: "gain2"
        });
        player2.storage.nsqinxue.push(type0);
      }
    },
    group: "nsqinxue_clear",
    subSkill: {
      clear: {
        trigger: { global: "phaseAfter" },
        silent: true,
        async content(event, trigger, player2) {
          player2.storage.nsqinxue = [];
        }
      }
    }
  },
  nsfuge: {
    trigger: { player: "phaseAfter" },
    filter(event, player2) {
      return !player2.storage.nsfuge;
    },
    init(player2) {
      lib.onwash.push(function() {
        delete player2.storage.nsfuge;
      });
    },
    skillAnimation: true,
    check(event, player2) {
      return player2.hp == 1 || player2.maxHp - player2.hp >= 2;
    },
    async content(event, trigger, player2) {
      player2.storage.nsfuge = true;
      player2.insertPhase();
    },
    group: "nsfuge_draw",
    subSkill: {
      draw: {
        trigger: { player: "phaseDrawBegin" },
        silent: true,
        filter(event, player2) {
          var evt = event.getParent("phase");
          return evt && evt.skill == "nsfuge";
        },
        async content(event, trigger, player2) {
          trigger.num += player2.maxHp - player2.hp;
        }
      }
    }
  },
  nsbaiming: {
    trigger: { player: "useCard" },
    filter(event, player2) {
      if (player2.additionalSkills.nsbaiming?.length) {
        return false;
      }
      return event.card?.name == "sha" && player2.storage.nsbaiming?.length;
    },
    group: "nsbaiming_clear",
    init(player2) {
      var check = function(list) {
        for (var i = 0; i < list.length; i++) {
          var info = lib.skill[list[i]];
          if (!info) {
            continue;
          }
          if (info && info.trigger) {
            for (var j in info.trigger) {
              var cond = info.trigger[j];
              if (typeof cond == "string") {
                cond = [cond];
              }
              if (j == "source" || j == "global") {
                if (cond.indexOf("damageBefore") != -1) {
                  return true;
                }
                if (cond.indexOf("damageBegin") != -1) {
                  return true;
                }
                if (cond.indexOf("damageBegin1") != -1) {
                  return true;
                }
                if (cond.indexOf("damageBegin2") != -1) {
                  return true;
                }
                if (cond.indexOf("damageEnd") != -1) {
                  return true;
                }
                if (cond.indexOf("damageSource") != -1) {
                  return true;
                }
                if (cond.indexOf("damageAfter") != -1) {
                  return true;
                }
              }
            }
          }
          if (get.skillInfoTranslation(list[i], player2).includes("【杀】")) {
            return true;
          }
        }
        return false;
      };
      player2.storage.nsbaiming = get.gainableSkills(function(info, skill) {
        var list = [skill];
        game.expandSkills(list);
        return check(list);
      }, player2);
    },
    async cost(event, trigger, player2) {
      const skills2 = player2.storage.nsbaiming.slice(0);
      const list = skills2.map((skill) => [
        skill,
        '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">' + (() => {
          let str = get.translation(skill);
          if (!lib.skill[skill]?.nobracket) {
            str = "【" + str + "】";
          }
          return str;
        })() + "</div><div>" + lib.translate[skill + "_info"] + "</div></div>"
      ]);
      const { bool, links } = await player2.chooseButton([`###百鸣###<div class="text center">你可以获得其中一个技能</div>`, [list, "textbutton"]]).set("displayIndex", false).set("ai", (button) => {
        const { link } = button, { choice } = get.event();
        if (choice.includes(link)) {
          return 2;
        }
        return 1;
      }).set(
        "choice",
        skills2.filter((skill) => {
          const info = get.info(skill) || {};
          if (info.ai?.neg || info.ai?.halfneg || info.ai?.combo) {
            return false;
          }
          return ["使用【杀】时", "使用【杀】指定"].some((str) => get.skillInfoTranslation(skill, player2).includes(str));
        })
      ).forResult();
      event.result = {
        bool,
        cost_data: links
      };
    },
    async content(event, trigger, player2) {
      const { cost_data: links, name } = event;
      player2.addAdditionalSkill(name, links);
      player2.popup(links);
      game.log(player2, "获得了技能", "【" + get.translation(links) + "】");
      await game.delay();
      player2.storage.nsbaiming.remove(links[0]);
      trigger.nsbaiming = true;
    },
    subSkill: {
      clear: {
        trigger: { player: "useCardAfter" },
        silent: true,
        filter(event) {
          return event.nsbaiming == true;
        },
        async content(event, trigger, player2) {
          player2.removeAdditionalSkill("nsbaiming");
        }
      }
    }
  },
  nsxinzhan: {
    enable: "phaseUse",
    filterCard: [1, Infinity],
    filter(event, player2) {
      return player2.countCards("h") > 0;
    },
    usable: 1,
    selectCard: [1, Infinity],
    check(card) {
      var player2 = _status.event.player;
      if (player2.countCards("h") >= 8 && game.hasPlayer(function(current) {
        return current.isDamaged() && get.attitude(player2, current) > 3;
      })) {
        if (ui.selected.cards.length >= 6) {
          return 0;
        }
        return 1;
      } else {
        if (ui.selected.cards.length >= 2) {
          return 0;
        }
        if (player2.countCards("h", function(card2) {
          return get.value(card2) < 0;
        })) {
          return 8 - get.value(card, player2, "raw");
        } else {
          return 4 - get.value(card, player2, "raw");
        }
      }
    },
    discard: false,
    prepare: "give2",
    allowChooseAll: true,
    async content(event, trigger, player2) {
      const { target, cards: cards2 } = event;
      await target.gain({
        cards: cards2,
        source: player2
      });
      const num = Math.floor(cards2.length / 2);
      if (num >= 3) {
        await target.loseMaxHp({
          forced: true
        });
      } else if (num) {
        await target.loseHp(num);
      }
    },
    filterTarget(card, player2, target) {
      return target != player2;
    },
    ai: {
      order: 10,
      result: {
        target(player2, target) {
          if (ui.selected.cards.length >= 6) {
            if (target.isDamaged()) {
              return 2;
            }
            return 1;
          }
          if (ui.selected.cards.length == 1) {
            return 1;
          }
          return -1;
        }
      }
    }
  },
  nstanbing: {
    trigger: { player: "phaseDrawBegin" },
    filter(event, player2) {
      return player2.countCards("h") > 0;
    },
    direct: true,
    async content(event, trigger, player2) {
      let result2;
      result2 = await player2.chooseToDiscard("h", get.prompt2("nstanbing")).set("ai", (card) => {
        if (!player2.needsToDiscard(1)) {
          return get.translation(card.name).length - 1;
        }
        return 0;
      }).set("logSkill", "nstanbing").forResult();
      if (result2.bool) {
        await player2.draw(get.translation(result2.cards[0].name).length);
        player2.addTempSkill("nstanbing_sha");
      }
    },
    subSkill: {
      sha: {
        mod: {
          cardEnabled(card, player2) {
            if (card.name == "sha") {
              return false;
            }
          },
          cardUsable(card, player2) {
            if (card.name == "sha") {
              return false;
            }
          }
        }
      }
    }
  },
  nswangfeng: {
    trigger: { global: "judge" },
    filter(event, player2) {
      return player2.countCards("hes", { color: "red" }) > 0;
    },
    async cost(event, trigger, player2) {
      event.result = await player2.chooseCard(
        `${get.translation(trigger.player)}的${trigger.judgestr || ""}判定为${get.translation(trigger.player.judging[0])}，${get.prompt(event.skill)}`,
        "hes",
        (card) => {
          const player3 = get.player();
          if (get.color(card) !== "red") {
            return false;
          }
          const mod2 = game.checkMod(card, player3, "unchanged", "cardEnabled2", player3);
          if (mod2 != "unchanged") {
            return mod2;
          }
          const mod = game.checkMod(card, player3, "unchanged", "cardRespondable", player3);
          if (mod != "unchanged") {
            return mod;
          }
          return true;
        }
      ).set("ai", (card) => {
        const trigger2 = get.event().getTrigger();
        const { player: player3, judging } = get.event();
        const result2 = trigger2.judge(card) - trigger2.judge(judging);
        const attitude = get.attitude(player3, trigger2.player);
        let val = get.value(card);
        if (get.subtype(card) == "equip2") {
          val /= 2;
        } else {
          val /= 4;
        }
        if (attitude == 0 || result2 == 0) {
          return 0;
        }
        if (attitude > 0) {
          return result2 - val;
        }
        return -result2 - val;
      }).set("judging", trigger.player.judging[0]).forResult();
    },
    popup: false,
    async content(event, trigger, player2) {
      const next = player2.respond(event.cards, event.name, "highlight", "noOrdering");
      await next;
      const { cards: cards2 } = next;
      if (cards2?.length) {
        player2.$gain2(trigger.player.judging[0]);
        await player2.gain(trigger.player.judging[0]);
        trigger.player.judging[0] = cards2[0];
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
  nsfuhuo: {
    enable: "phaseUse",
    usable: 1,
    filterCard: true,
    filterTarget(card, player2, target) {
      return player2 != target && !target.hasSkill("nsfuhuo2");
    },
    prepare: "throw",
    discard: false,
    async content(event, trigger, player2) {
      const { target, cards: cards2 } = event;
      target.$gain2(cards2);
      target.storage.nsfuhuo2 = cards2[0];
      target.addSkill("nsfuhuo2");
      target.storage.nsfuhuo3 = player2;
      ui.special.appendChild(cards2[0]);
      target.syncStorage("nsfuhuo2");
    },
    check(card) {
      return 6 - get.value(card);
    },
    ai: {
      expose: 0.1,
      order: 4,
      result: {
        target(player2, target) {
          if (target.hasSkillTag("maixie")) {
            return 0;
          }
          return -1;
        }
      }
    },
    group: ["nsfuhuo_die", "nsfuhuo_gain"],
    subSkill: {
      die: {
        trigger: { player: "dieBegin" },
        silent: true,
        async content(event, trigger, player2) {
          for (const current of game.players) {
            if (current.hasSkill("nsfuhuo2") && current.storage.nsfuhuo3 === player2) {
              current.removeSkill("nsfuhuo2");
            }
          }
        }
      },
      gain: {
        trigger: { player: "phaseBegin" },
        silent: true,
        async content(event, trigger, player2) {
          for (const target of game.players) {
            if (target.hasSkill("nsfuhuo2") && target.storage.nsfuhuo3 === player2) {
              const card = target.storage.nsfuhuo2;
              target.removeSkill("nsfuhuo2");
              target.$give(card, player2);
              await player2.gain({
                cards: [card]
              });
            }
          }
        }
      }
    }
  },
  nsfuhuo2: {
    trigger: { player: ["respondAfter", "useCardAfter"] },
    forced: true,
    priority: 10,
    mark: "card",
    popup: false,
    sourceSkill: "nsfuhuo",
    filter(event, player2) {
      return event.card && event.card.name == "shan" && player2.storage.nsfuhuo3 && player2.storage.nsfuhuo3.isIn();
    },
    async content(event, trigger, player2) {
      let result2;
      const source = player2.storage.nsfuhuo3;
      source.logSkill("nsfuhuo", player2);
      result2 = await player2.judge({
        judge(card) {
          const suit = get.suit(card);
          if (suit == "heart" || suit == "diamond") {
            return -1;
          }
          return 0;
        }
      }).forResult();
      if (result2.suit == "diamond") {
        await player2.damage("fire", source);
        if (player2.countCards("h")) {
          await player2.randomDiscard("h");
        }
      } else if (result2.suit == "heart") {
        await player2.damage("fire", 2, source);
      }
    },
    intro: {
      content: "card"
    },
    onremove(player2) {
      player2.storage.nsfuhuo2.discard();
      delete player2.storage.nsfuhuo2;
      delete player2.storage.nsfuhuo3;
    },
    ai: {
      noShan: true
    }
  },
  nshunji: {
    enable: "phaseUse",
    viewAs: { name: "wanjian" },
    usable: 1,
    delay: 0,
    selectCard: 0,
    group: ["nshunji_damage", "nshunji_draw"],
    subSkill: {
      draw: {
        trigger: { player: "useCard" },
        silent: true,
        filter(event) {
          return event.skill == "nshunji";
        },
        async content(event, trigger, player2) {
          player2.draw();
        }
      },
      damage: {
        trigger: { global: "damageAfter" },
        silent: true,
        filter(event) {
          return event.getParent(2).skill == "nshunji";
        },
        async content(event, trigger, player2) {
          let result2;
          if (player2.countCards("he")) {
            result2 = await trigger.player.discardPlayerCard(player2, "混击", "he").set("boolline", true).set("prompt2", "弃置" + get.translation(player2) + "的一张牌，或取消并摸一张牌").forResult();
          } else {
            await trigger.player.draw();
            return;
          }
          if (!result2.bool) {
            await trigger.player.draw();
          }
        }
      }
    }
  },
  nsbaquan: {
    trigger: { player: "phaseEnd" },
    filter(event, player2) {
      return player2.countCards("h") > 0;
    },
    check(event, player2) {
      if (player2.hasShan() || player2.hujia > 0) {
        return false;
      }
      var nh = player2.countCards("h");
      if (player2.hp == 1) {
        return nh <= 3;
      }
      if (player2.hp == 2) {
        return nh <= 1;
      }
      return false;
    },
    async content(event, trigger, player2) {
      const cards2 = player2.getCards("h");
      player2.discard(cards2);
      player2.changeHujia(cards2.length);
      player2.storage.nsbaquan = true;
    },
    group: "nsbaquan_clear",
    subSkill: {
      clear: {
        trigger: { player: "phaseBegin" },
        forced: true,
        filter(event, player2) {
          return player2.storage.nsbaquan && player2.hujia > 0;
        },
        async content(event, trigger, player2) {
          player2.changeHujia(-player2.hujia);
          game.log(player2, "失去了所有护甲");
          delete player2.storage.nsbaquan;
        }
      }
    }
  },
  nschangshi: {
    mode: ["identity"],
    enable: "phaseUse",
    usable: 1,
    filter(event, player2) {
      return player2.identity == "fan";
    },
    filterTarget(card, player2, target) {
      if (target == player2) {
        return false;
      }
      if (ui.selected.targets.length) {
        return target.hp != ui.selected.targets[0].hp;
      }
      return true;
    },
    multitarget: true,
    selectTarget: 2,
    async content(event, trigger, player2) {
      game.broadcastAll(
        (player3, targets) => {
          player3.showIdentity();
          var tmp = targets[0].hp;
          targets[0].hp = targets[1].hp;
          targets[1].hp = tmp;
          targets[0].update();
          targets[1].update();
          if (Math.abs(targets[0].hp - targets[1].hp) == 1) {
            player3.loseHp();
          }
        },
        player2,
        event.targets
      );
    },
    ai: {
      order: 10,
      result: {
        player(player2, target) {
          if (ui.selected.targets.length && Math.abs(target.hp - ui.selected.targets[0].hp) === 1) {
            return get.effect(player2, { name: "losehp" }, player2, player2) / 10;
          }
          return 0;
        },
        target(player2, target) {
          let att = get.attitude(player2, target), max;
          if (!ui.selected.targets.length) {
            let search = false;
            game.countPlayer((cur) => {
              if (player2 === cur || target === cur || (cur.hp - target.hp) * (get.attitude(player2, cur) - att) >= 0) {
                return false;
              }
              if (!search) {
                max = Math.min(cur.hp, target.maxHp) - target.hp;
                search = true;
              } else if (att > 0) {
                max = Math.max(max, Math.min(cur.hp, target.maxHp) - target.hp);
              } else {
                max = Math.min(max, Math.min(cur.hp, target.maxHp) - target.hp);
              }
            });
            if (target === get.zhu(player2)) {
              return 2 * max;
            }
            return max;
          }
          max = Math.min(ui.selected.targets[0].hp, target.maxHp) - target.hp;
          if (target === get.zhu(player2)) {
            return 2 * max;
          }
          return max;
        }
      }
    }
  },
  nsjianning: {
    mode: ["identity"],
    enable: "phaseUse",
    usable: 1,
    filter(event, player2) {
      return player2.identity == "nei";
    },
    filterTarget(card, player2, target) {
      return target.countCards("h") < player2.countCards("h");
    },
    async content(event, trigger, player2) {
      if (!player2.identityShown) {
        game.broadcastAll((player3) => {
          player3.showIdentity();
        }, player2);
      }
      await player2.swapHandcards(event.target);
      await event.target.damage();
    },
    ai: {
      order: 10,
      result: {
        target(player2, target) {
          if (!player2.countCards("h", function(card) {
            return get.value(card) >= 8;
          }) && player2.countCards("h") - target.countCards("h") <= 1) {
            if (target.hp == 1 || player2.countCards("h", function(card) {
              return get.value(card) < 0;
            })) {
              return get.damageEffect(target, player2, target);
            }
          }
          return 0;
        }
      }
    }
  },
  nscuanquan: {
    mode: ["identity"],
    init(player2) {
      player2.storage.nscuanquan = 0;
    },
    forced: true,
    unique: true,
    forceunique: true,
    skillAnimation: true,
    animationColor: "thunder",
    trigger: { player: "damageAfter" },
    filter(event, player2) {
      return player2.identity == "zhong" && player2.storage.nscuanquan == 3 && game.zhu && game.zhu.isZhu;
    },
    group: "nscuanquan_count",
    subSkill: {
      count: {
        trigger: { player: "damageEnd" },
        silent: true,
        async content(event, trigger, player2) {
          player2.storage.nscuanquan++;
        }
      }
    },
    logTarget() {
      return [game.zhu];
    },
    async content(event, trigger, player2) {
      player2.awakenSkill(event.name);
      game.broadcastAll((player3) => {
        const tmp = player3.maxHp;
        player3.identity = "zhu";
        player3.maxHp = game.zhu.hp;
        player3.showIdentity();
        player3.update();
        game.zhu.identity = "zhong";
        game.zhu.maxHp = tmp;
        game.zhu.showIdentity();
        game.zhu.update();
        game.zhu = player3;
      }, player2);
      await event.trigger("zhuUpdate");
    }
  },
  nstianji: {
    trigger: { global: "dying" },
    limited: true,
    skillAnimation: true,
    animationColor: "water",
    filter(event, player2) {
      return event.player.hp <= 0 && event.player != player2;
    },
    logTarget: "player",
    check(event, player2) {
      return get.attitude(player2, event.player) > 1;
    },
    async content(event, trigger, player2) {
      player2.awakenSkill(event.name);
      await player2.loseMaxHp();
      await trigger.player.recover({
        num: 1 - trigger.player.hp
      });
      await trigger.player.gainMaxHp();
    }
  },
  nsbugua: {
    group: "nsbugua_use",
    ai: {
      threaten: 1.4
    },
    subSkill: {
      use: {
        enable: "phaseUse",
        usable: 1,
        filterCard: true,
        check(card) {
          return 9 - get.value(card);
        },
        filter(event, player2) {
          return player2.countCards("he");
        },
        position: "he",
        ai: {
          order: 9.5,
          result: {
            player: 1
          }
        },
        async content(event, trigger, player2) {
          let result2;
          await player2.throwDice();
          const cards2 = get.cards(6);
          const cards22 = cards2.slice(0);
          const card = cards22.splice(event.num - 1, 1)[0];
          await player2.showCards(get.translation(player2) + "亮出了" + get.translation(card), cards2).set("hiddencards", cards22);
          card.discard();
          let name = null;
          switch (get.suit(card)) {
            case "club": {
              if (card.number % 2 == 0) {
                name = "guohe";
              } else {
                name = "jiedao";
              }
              break;
            }
            case "spade": {
              if (card.number % 2 == 0) {
                name = "nanman";
              } else {
                name = "juedou";
              }
              break;
            }
            case "diamond": {
              if (card.number % 2 == 0) {
                name = "shunshou";
              } else {
                name = "huogong";
              }
              break;
            }
            case "heart": {
              if (card.number % 2 == 0) {
                name = "wuzhong";
              } else {
                name = "wanjian";
              }
              break;
            }
          }
          const togain = get.cardPile(name, "cardPile", "random");
          if (togain) {
            await player2.gain(togain, "gain2");
          } else {
            await player2.draw();
          }
          event.list = cards22;
          result2 = await player2.chooseCardButton(event.list, true, "按顺序将牌置于牌堆顶（先选择的在上）", event.list.length).forResult();
          const list = result2.links.slice(0);
          while (list.length) {
            ui.cardPile.insertBefore(list.pop(), ui.cardPile.firstChild);
          }
        }
      },
      twice: {}
    }
  },
  nstuiyan: {
    trigger: { player: "useCard" },
    filter(event, player2) {
      return _status.currentPhase == player2 && event.getParent("phaseUse", true) && !player2.hasSkill("nstuiyan_fail") && typeof player2.storage.nstuiyan == "number" && event.card.number > player2.storage.nstuiyan;
    },
    frequent: true,
    priority: 2,
    async content(event, trigger, player2) {
      await player2.draw();
    },
    onremove(player2) {
      delete player2.storage.nstuiyan;
      delete player2.storage.nstuiyan_done;
      delete player2.storage.nstuiyan2;
      delete player2.storage.nstuiyan2_done;
    },
    intro: {
      mark(dialog, content, player2) {
        if (player2.storage.nstuiyan_done) {
          dialog.addText("推演摸牌已结束");
        } else {
          dialog.addText("上一张点数：" + player2.storage.nstuiyan);
        }
        if (player2.storage.nstuiyan2_done) {
          dialog.addText("总点数8的倍数已达成");
        } else {
          dialog.addText("总点数：" + player2.storage.nstuiyan2);
        }
      },
      content(storage, player2) {
        var str = "";
        if (player2.storage.nstuiyan_done) {
          str += "推演摸牌已结束；";
        } else {
          str += "上一张牌点数：" + storage + "；";
        }
        if (player2.storage.nstuiyan2_done) {
          str += "总点数8的倍数已达成";
        } else {
          str += "总点数：" + player2.storage.nstuiyan2;
        }
        return str;
      },
      markcount(storage, player2) {
        if (player2.storage.nstuiyan2_done) {
          if (player2.storage.nstuiyan_done) {
            return 0;
          } else {
            return player2.storage.nstuiyan;
          }
        } else {
          return player2.storage.nstuiyan2;
        }
      }
    },
    group: ["nstuiyan_use", "nstuiyan_clear"],
    subSkill: {
      bugua: {
        trigger: { player: "useCardAfter" },
        direct: true,
        filter(event, player2) {
          return player2.countCards("h") > 0;
        },
        async content(event, trigger, player2) {
          let result2;
          player2.removeSkill("nstuiyan_bugua");
          result2 = await player2.chooseToDiscard({
            prompt: "推演：是否发动一次【卜卦】？",
            position: "he",
            ai(card) {
              return 8 - get.value(card);
            }
          }).set("logSkill", "nstuiyan").forResult();
          if (result2.bool) {
            event.insert(lib.skill.nsbugua.subSkill.use.content, { player: player2 });
          }
        }
      },
      use: {
        trigger: { player: "useCard" },
        silent: true,
        priority: -1,
        filter(event, player2) {
          return _status.currentPhase == player2 && event.getParent("phaseUse", true) && typeof event.card.number == "number";
        },
        async content(event, trigger, player2) {
          if (typeof player2.storage.nstuiyan2 !== "number") {
            player2.storage.nstuiyan2 = 0;
          }
          if (!player2.hasSkill("nstuiyan_fail") && (trigger.card.number <= player2.storage.nstuiyan || typeof trigger.card.number !== "number")) {
            player2.storage.nstuiyan_done = true;
            player2.addTempSkill("nstuiyan_fail");
          }
          player2.storage.nstuiyan = trigger.card.number;
          player2.storage.nstuiyan2 += trigger.card.number;
          if (player2.storage.nstuiyan2 % 8 === 0 && !player2.storage.nstuiyan2_done) {
            player2.storage.nstuiyan2_done = true;
            player2.addTempSkill("nstuiyan_bugua");
          }
          player2.markSkill("nstuiyan");
        }
      },
      clear: {
        trigger: { player: ["phaseUseAfter", "phaseAfter"] },
        silent: true,
        async content(event, trigger, player2) {
          delete player2.storage.nstuiyan;
          delete player2.storage.nstuiyan_done;
          delete player2.storage.nstuiyan2;
          delete player2.storage.nstuiyan2_done;
          player2.unmarkSkill("nstuiyan");
        }
      },
      fail: {}
    },
    ai: {
      threaten: 1.4
    }
  },
  nsshijun: {
    trigger: { source: "damageBegin" },
    forced: true,
    async content(event, trigger, player2) {
      trigger.num++;
      trigger.nsshijun = true;
    },
    subSkill: {
      hp: {
        trigger: { source: "damageAfter" },
        silent: true,
        filter(event) {
          return event.nsshijun;
        },
        async content(event, trigger, player2) {
          await player2.loseHp();
        }
      }
    },
    group: "nsshijun_hp",
    ai: {
      halfneg: true
    }
  },
  nszhaoxin: {
    mark: true,
    intro: {
      mark(dialog, content, player2) {
        var hs = player2.getCards("h");
        if (hs.length) {
          dialog.addSmall(hs);
        } else {
          dialog.addText("无手牌");
        }
      },
      content(content, player2) {
        var hs = player2.getCards("h");
        if (hs.length) {
          return get.translation(hs);
        } else {
          return "无手牌";
        }
      }
    },
    locked: true,
    ai: {
      neg: true
    }
  },
  nsxiuxin: {
    mod: {
      targetEnabled(card, player2, target) {
        var suit = get.suit(card);
        if (suit && !target.countCards("h", { suit })) {
          return false;
        }
      }
    }
  },
  nscangxi: {
    global: "nscangxi2",
    locked: false,
    zhuSkill: true,
    init(player2) {
      player2.storage.nscangxi = 0;
    },
    intro: {
      content: "手牌上限+#"
    },
    mod: {
      maxHandcard(player2, num) {
        return num + player2.storage.nscangxi;
      }
    }
  },
  nscangxi2: {
    trigger: { player: "phaseDiscardEnd" },
    sourceSkill: "nscangxi",
    filter(event, player2) {
      if (!event.cards || event.cards.length <= 1) {
        return false;
      }
      if (player2.group != "wu") {
        return false;
      }
      return game.hasPlayer(function(target) {
        return player2 != target && target.hasZhuSkill("nscangxi", player2);
      });
    },
    direct: true,
    async content(event, trigger, player2) {
      const list = game.filterPlayer((current) => {
        return current != player2 && current.hasZhuSkill("nscangxi", player2);
      }).sortBySeat();
      while (list.length) {
        const current = list.shift();
        let result2 = await player2.chooseBool(get.prompt("nscangxi", current)).set("choice", get.attitude(player2, current) > 0).forResult();
        if (!result2.bool) {
          continue;
        }
        player2.logSkill("nscangxi", current);
        result2 = await player2.judge((card) => {
          return get.event().att * (get.color(card) == "black" ? 1 : 0);
        }).set("att", get.sgnAttitude(player2, current)).forResult();
        if (result2.color != "black") {
          continue;
        }
        const name = get.translation(current.name);
        let att = 0;
        if (current.needsToDiscard()) {
          att = 1;
        }
        result2 = await player2.chooseControlList(
          ["令" + name + "摸一张牌展示", "令" + name + "手牌上永久+1", "弃置一张牌并令" + name + "获得一张本回合进入弃牌堆的牌"],
          () => {
            return _status.event.att;
          }
        ).set("att", att).forResult();
        if (result2.index == 0) {
          await current.draw("visible");
          continue;
        }
        if (result2.index == 1) {
          if (typeof current.storage.nscangxi != "number") {
            current.storage.nscangxi = 0;
          }
          current.storage.nscangxi++;
          current.syncStorage("nscangxi");
          current.markSkill("nscangxi");
          continue;
        }
        if (result2.index == 2) {
          result2 = await player2.chooseToDiscard(true, "he").forResult();
          if (!result2.bool) {
            continue;
          }
          const discarded = _status.discarded;
          if (!discarded.length) {
            continue;
          }
          result2 = await current.chooseCardButton("选择一张获得之", discarded, true).set("ai", (button) => {
            return get.value(button.link);
          }).forResult();
          if (result2.bool && result2.links && result2.links.length) {
            await current.gain(result2.links, "gain2");
          }
        }
      }
    }
  },
  nswulie: {
    trigger: { player: "phaseBegin" },
    limited: true,
    skillAnimation: true,
    animationColor: "metal",
    filter(event, player2) {
      return ui.discardPile.childElementCount > 0;
    },
    async content(event, trigger, player2) {
      let result2;
      player2.awakenSkill(event.name);
      await player2.loseMaxHp();
      result2 = await player2.chooseCardButton(Array.from(ui.discardPile.childNodes), "将至多三张任意顺置于牌堆顶（先选择的在上）", true, [1, 3]).forResult();
      if (result2.bool) {
        const cards2 = result2.links?.toReversed();
        for (const card of cards2) {
          ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
        }
        player2.addTempSkill("nswulie_end");
      }
    },
    subSkill: {
      end: {
        trigger: { player: "phaseEnd" },
        filter(event, player2) {
          return ui.discardPile.childElementCount > 0;
        },
        async content(event, trigger, player2) {
          let result2;
          await player2.loseMaxHp();
          const choices = Array.from(ui.discardPile.childNodes);
          result2 = await player2.chooseCardButton(choices, "将至多三张任意顺置于牌堆顶（先选择的在上）", true, [1, 3]).forResult();
          if (result2.bool) {
            const cards2 = result2.links.slice(0);
            for (const card of cards2.reverse()) {
              ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
            }
          }
        }
      }
    }
  },
  nshunyou: {
    enable: "phaseUse",
    usable: 1,
    filterCard: { type: "basic" },
    filter(event, player2) {
      return player2.countCards("h", { type: "basic" });
    },
    async content(event, trigger, player2) {
      let result2;
      let equip = null;
      let trick = null;
      for (const card of ui.discardPile.childNodes) {
        const type = get.type(card, "trick");
        if (type == "trick") {
          trick = card;
        } else if (type == "equip") {
          equip = card;
        }
        if (trick && equip) {
          break;
        }
      }
      const list = [];
      if (trick) {
        list.push(trick);
      }
      if (equip) {
        list.push(equip);
      }
      if (!list.length) {
        await player2.draw(Math.min(3, 1 + player2.maxHp - player2.hp));
        return;
      }
      await player2.gain(list, "gain2");
      event.equip = equip;
      if (!(event.equip && get.owner(event.equip) == player2)) {
        return;
      }
      result2 = await player2.chooseTarget("是否将" + get.translation(event.equip) + "装备给一其角色？", (card, player3, target2) => {
        return target2 != player3;
      }).set("ai", (target2) => {
        const att = get.attitude(_status.event.player, target2);
        if (att > 1) {
          if (!target2.getEquip(_status.event.subtype)) {
            return att;
          }
        }
        return 0;
      }).set("subtype", get.subtype(event.equip)).forResult();
      if (!result2.bool) {
        return;
      }
      const target = result2.targets[0];
      player2.line(result2.targets, "green");
      player2.$give(event.equip, target);
      await player2.lose(event.equip, ui.special);
      await game.delay(0.5);
      await target.equip(event.equip);
      await game.delay();
    },
    check(card) {
      return 7 - get.value(card);
    },
    ai: {
      order: 7,
      result: {
        player: 1
      }
    }
  },
  nsgongjian: {
    trigger: { player: "phaseDiscardEnd" },
    forced: true,
    filter(event, player2) {
      if (event.cards && event.cards.length > 0) {
        return game.hasPlayer(function(current) {
          return current.hp > player2.hp;
        });
      }
      return false;
    },
    async content(event, trigger, player2) {
      let result2;
      result2 = await player2.chooseTarget("恭俭：将弃置的牌交给一名体力值大于你的角色", (card, player3, target) => {
        return target.hp > player3.hp;
      }).set("ai", (target) => {
        return get.attitude(_status.event.player, target) / Math.sqrt(target.countCards("h") + 1);
      }).forResult();
      if (result2.bool && result2.targets?.length) {
        const target = result2.targets[0];
        player2.line(target, "green");
        await target.gain(trigger.cards, "gain2");
      }
    },
    ai: {
      halfneg: true
    }
  },
  nscaijian: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player2) {
      var nh = player2.countCards("h");
      return nh && nh <= player2.maxHp;
    },
    async content(event, trigger, player2) {
      let result2;
      player2.showHandcards();
      const num = player2.countCards("h");
      player2.directgain(get.cards(num));
      result2 = await player2.chooseCard("将" + get.cnNumber(num) + "张手牌以按顺序置于牌堆顶（先选择的在上）", num, true).set("ai", function(card) {
        return -get.value(card);
      }).forResult();
      if (!result2.bool) {
        return;
      }
      const next = player2.lose(result2.cards, ui.special);
      next._triggered = null;
      await next;
      const cards2 = result2.cards.slice(0);
      if (player2 == game.me && _status.auto) {
        await game.delay();
      }
      while (cards2.length) {
        const current = cards2.pop();
        current.fix();
        ui.cardPile.insertBefore(current, ui.cardPile.firstChild);
      }
    },
    ai: {
      order: 10,
      result: {
        player: 1
      }
    }
  },
  nsdongcha: {
    trigger: { player: "damageBefore" },
    forced: true,
    priority: 15,
    filter(event, player2) {
      if (get.type(event.card, "trick") == "trick") {
        if (event.getParent(2).name == "useCard") {
          return event.getParent(2).targets.length == 1;
        }
        return true;
      }
      return false;
    },
    async content(event, trigger, player2) {
      trigger.cancel();
    },
    ai: {
      notrick: true,
      effect: {
        target(card, player2, target, current) {
          if (get.type(card) == "trick" && get.tag(card, "damage") && !get.tag(card, "multitarget")) {
            return "zeroplayertarget";
          }
        }
      }
    },
    group: "nsdongcha_cancel",
    subSkill: {
      cancel: {
        trigger: { target: "useCardToAfter" },
        silent: true,
        filter(event, player2) {
          return get.type(event.card, "trick") == "trick" && _status.currentPhase == event.player && event.player != player2;
        },
        async content(event, trigger, player2) {
          player2.addTempSkill("nsdongcha_disable");
        }
      },
      disable: {
        trigger: { target: "useCardToBefore" },
        forced: true,
        priority: 15,
        onremove: true,
        filter(event, player2) {
          return event.player == _status.currentPhase && get.type(event.card, "trick") == "trick";
        },
        async content(event, trigger, player2) {
          trigger.cancel();
        },
        ai: {
          effect: {
            target(card, player2, target, current) {
              if (get.type(card, "trick") == "trick" && _status.currentPhase == player2) {
                return "zeroplayertarget";
              }
            }
          }
        }
      }
    }
  },
  nsjianxiong: {
    trigger: { target: "useCardToBefore" },
    direct: true,
    async content(event, trigger, player2) {
      await player2.chooseToUse(
        function(card) {
          return !get.info(card).multitarget;
        },
        get.prompt("nsjianxiong", trigger.player),
        trigger.player,
        -1
      );
      if (event.damaged) {
        trigger.cancel();
        if (get.color(trigger.card) == "black") {
          await player2.draw();
        }
      }
    },
    subSkill: {
      damage: {
        trigger: { source: "damageAfter" },
        silent: true,
        filter(event, player2) {
          return event.getParent(4).name == "nsjianxiong";
        },
        async content(event, trigger, player2) {
          trigger.getParent(4).damaged = true;
        }
      }
    },
    group: "nsjianxiong_damage",
    ai: {
      effect: {
        player(card, player2, target) {
          if (_status.currentPhase != player2) {
            return;
          }
          if (get.tag(card, "damage") && !player2.needsToDiscard(1) && target.hp > 1) {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  nsxionglue: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player2) {
      return player2.countCards("h", { color: "black" });
    },
    check(card) {
      return 7 - get.value(card);
    },
    filterCard: { color: "black" },
    async content(event, trigger, player2) {
      let result2;
      let list = get.inpile("trick");
      list = list.randomGets(3);
      list = list.map((name) => ["锦囊", "", name]);
      const dialog = ui.create.dialog("选择一张锦囊牌加入你的手牌", [list, "vcard"], "hidden");
      result2 = await player2.chooseButton(dialog, true).set("ai", (button) => {
        const card = { name: button.link[2] };
        const value = get.value(card);
        return value;
      }).forResult();
      if (result2 && result2.bool) {
        const choice = result2.links?.[0] || result2.buttons?.[0] && result2.buttons[0].link;
        if (choice) {
          const name = choice[2];
          await player2.gain(game.createCard(name), "draw");
        }
      }
    },
    ai: {
      order: 9,
      result: {
        player: 1
      }
    }
  },
  nshuanhuo: {
    trigger: { player: ["loseHpAfter", "damageAfter"] },
    filter(event, player2) {
      if (game.countPlayer(function(current) {
        return current != player2 && !current.isUnseen(2);
      }) < 2) {
        return false;
      }
      if (event.name == "damage") {
        return event.num > 1;
      }
      return true;
    },
    direct: true,
    skillAnimation: true,
    animationColor: "thunder",
    async content(event, trigger, player2) {
      let result2;
      result2 = await player2.chooseTarget(2, get.prompt2("nshuanhuo"), function(card, p, target) {
        return target != player2 && !target.isUnseen(2);
      }).set("ai", function(target) {
        const att = get.attitude(player2, target);
        if (ui.selected.targets.length) {
          if (att < 0) {
            return get.rank(target, true) - get.rank(ui.selected.targets[0], true);
          }
        } else {
          if (att >= 0) {
            return 1 / (1 + get.rank(target, true));
          }
        }
        return 0;
      }).forResult();
      if (result2.bool) {
        player2.logSkill("nshuanhuo", result2.targets);
      } else {
        event.finish();
        return;
      }
      const name1 = result2.targets[0].name;
      const name2 = result2.targets[1].name;
      result2.targets[0].reinit(name1, name2, false);
      result2.targets[1].reinit(name2, name1, false);
    }
  },
  nsyaowang: {
    trigger: { player: "phaseBegin" },
    filter(event, player2) {
      return game.hasPlayer(
        (current) => player2 != current && current.getSkills(null, false, false).filter((skill) => {
          const info = get.info(skill);
          return info && !info.charlotte;
        }).length
      );
    },
    async cost(event, trigger, player2) {
      event.result = await player2.chooseTarget(get.prompt2(event.skill), (card, player3, target) => {
        return player3 != target && target.getSkills(null, false, false).filter((skill) => {
          const info = get.info(skill);
          return info && !info.charlotte;
        }).length;
      }).set("ai", (target) => {
        if (get.attitude(get.player(), target) > 0) {
          return Math.random();
        }
        return 0;
      }).forResult();
    },
    async content(event, trigger, player2) {
      const {
        targets: [target]
      } = event;
      const skills2 = target.getSkills(null, false, false).filter((skill2) => {
        const info = get.info(skill2);
        return info && !info.charlotte;
      });
      if (!skills2.length) {
        return;
      }
      const list = skills2.map((skill2) => [
        skill2,
        '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">' + (() => {
          let str = get.translation(skill2);
          if (!lib.skill[skill2]?.nobracket) {
            str = "【" + str + "】";
          }
          return str;
        })() + "</div><div>" + lib.translate[skill2 + "_info"] + "</div></div>"
      ]);
      const { links } = await player2.chooseButton(["选择获得一个技能", [list, "textbutton"]]).set("displayIndex", false).set("ai", (button) => {
        get.player();
        let info = get.info(button.link);
        if (info?.ai?.neg || info?.ai?.halfneg) {
          return 0;
        }
        return get.skillRank(button.link, "inout");
      }).forResult();
      if (!links?.length) {
        return;
      }
      await player2.addTempSkills(links[0]);
      const names = game.players.concat(game.dead).reduce((list2, i) => list2.addArray(get.nameList(i)), []);
      const skillList = get.gainableSkills((info, skill2, name) => !names.includes(name));
      if (!skillList.length) {
        return;
      }
      const skill = skillList.randomGet();
      await target.addTempSkills(skill, { player: "phaseAfter" });
    }
  },
  nsjianshu: {
    trigger: { player: "shaBegin" },
    forced: true,
    filter(event, player2) {
      return !event.directHit && player2.getEquip(1);
    },
    priority: -1,
    async content(event, trigger, player2) {
      if (typeof trigger.shanRequired == "number") {
        trigger.shanRequired++;
      } else {
        trigger.shanRequired = 2;
      }
    }
  },
  nscangjian: {
    trigger: { source: "damageEnd" },
    direct: true,
    filter(event) {
      return event.player.isIn() && event.player.countCards("e") > 0;
    },
    async content(event, trigger, player2) {
      await player2.gainPlayerCard({
        prompt: get.prompt("nscangjian", trigger.player),
        target: trigger.player,
        position: "e"
      }).set("logSkill", ["nscangjian", trigger.player]);
    }
  },
  nsyunxing: {
    trigger: { global: "dieAfter" },
    forced: true,
    check(event, player2) {
      return event.player.group == "wei" || event.player.group == "wu" && player2.hp == 1;
    },
    filter(event, player2) {
      return ["wei", "shu", "wu", "qun"].includes(event.player.group);
    },
    async content(event, trigger, player2) {
      let result2;
      switch (trigger.player.group) {
        case "wei": {
          await player2.draw();
          break;
        }
        case "shu": {
          await player2.loseHp();
          break;
        }
        case "wu": {
          await player2.recover();
          break;
        }
        case "qun": {
          const phaseUseEvt = event.getParent("phaseUse");
          if (phaseUseEvt && phaseUseEvt.name == "phaseUse") {
            phaseUseEvt.skipped = true;
          }
          const phaseEvt = event.getParent("phase");
          if (phaseEvt && phaseEvt.name == "phase") {
            phaseEvt.finish();
          }
          break;
        }
      }
      if (trigger.player.group != "wei" || !game.hasPlayer(function(current) {
        return current.countCards("h");
      })) {
        return;
      }
      result2 = await player2.chooseTarget("弃置一名角色的一张手牌", true, function(card, player3, target) {
        return target.countCards("h");
      }).set("ai", function(target) {
        if (target.hasSkillTag("noh")) {
          return 0;
        }
        return -get.attitude(_status.event.player, target);
      }).forResult();
      if (result2.bool) {
        const target = result2.targets[0];
        await player2.discardPlayerCard(target, true, "h");
        player2.line(target, "green");
      }
    },
    group: "nsyunxing_self",
    subSkill: {
      self: {
        trigger: { player: "dieBegin" },
        direct: true,
        async content(event, trigger, player2) {
          let result2;
          result2 = await player2.chooseTarget(get.prompt("nsyunxing"), (card, _player, target) => {
            return target != player2;
          }).set("prompt2", "令一名其他角色翻面").set("ai", (target) => {
            const att = get.attitude(_status.event.player, target);
            if (target.isTurnedOver()) {
              if (att > 2) {
                return att * 2;
              } else {
                return att;
              }
            } else {
              return -att;
            }
          }).forResult();
          if (result2.bool) {
            player2.logSkill("nsyunxing", result2.targets);
            await result2.targets[0].turnOver();
          }
        }
      }
    }
  },
  nsguanxing: {
    trigger: { player: "phaseBegin" },
    forced: true,
    filter(event, player2) {
      return player2.hp > 0;
    },
    async content(event, trigger, player2) {
      let result2;
      const cards2 = get.cards(game.countPlayer());
      const chosen = [];
      let num = player2.hp;
      while (num > 0) {
        const judgeCards2 = player2.getCards("j");
        let pos = 0;
        let choiceIndex = -1;
        const getVal = (card2, position) => {
          if (judgeCards2[position]) {
            return get.judge(judgeCards2[position])(card2);
          }
          return get.value(card2);
        };
        const limit = Math.min(cards2.length, judgeCards2.length + 2);
        for (const [posIndex] of cards2.slice(0, limit).entries()) {
          pos = posIndex;
          let max = getVal(cards2[posIndex], posIndex);
          choiceIndex = -1;
          for (const [jIndex, currentCard] of cards2.entries()) {
            if (jIndex <= posIndex) {
              continue;
            }
            const current = getVal(currentCard, posIndex);
            if (current > max) {
              choiceIndex = jIndex;
              max = current;
            }
          }
          if (choiceIndex !== -1) {
            break;
          }
        }
        result2 = await player2.chooseCardButton(`观星：选择要移动的牌（还能移动${num}张）`, cards2).set("filterButton", (button) => {
          return !_status.event.chosen.includes(button.link);
        }).set("chosen", chosen).set("ai", (button) => {
          return button.link == _status.event.choice ? 1 : 0;
        }).set("choice", cards2[choiceIndex]).forResult();
        if (!result2.bool) {
          break;
        }
        const card = result2.links[0];
        chosen.push(card);
        cards2.remove(card);
        result2 = await player2.chooseControl(() => {
          return _status.event.controlai;
        }).set("controlai", pos || 0).set("sortcard", cards2.slice()).set("tosort", card).forResult();
        if (typeof result2.index !== "number") {
          break;
        }
        if (result2.index > cards2.length) {
          ui.cardPile.appendChild(card);
        } else {
          cards2.splice(result2.index, 0, card);
        }
        num--;
      }
      while (cards2.length) {
        ui.cardPile.insertBefore(cards2.pop(), ui.cardPile.firstChild);
      }
      const judgeCards = player2.getCards("j");
      if (judgeCards.length === 1) {
        if (get.judge(judgeCards[0])(ui.cardPile.firstChild) < 0) {
          player2.addTempSkill("guanxing_fail");
        }
      }
    },
    ai: {
      guanxing: true
    }
  },
  nshaoling: {
    skillAnimation: true,
    animationColor: "water",
    limited: true,
    enable: "phaseUse",
    filterTarget(card, player2, target) {
      return target !== player2;
    },
    async content(event, trigger, player2) {
      player2.awakenSkill(event.name);
      const target = event.target;
      let targets = game.filterPlayer((cur) => {
        return cur !== player2 && cur !== target;
      }).sortBySeat();
      while (targets.length) {
        const current = targets.shift();
        if (target.isAlive() && current.countCards("he")) {
          const result2 = await current.chooseToUse({ name: "sha" }, target, -1, "号令").set(
            "prompt2",
            "选择一项：1. 对" + get.translation(target) + "使用一张【杀】；2. 取消并交给" + get.translation(player2) + "一张牌，然后其视为对你使用一张【杀】"
          ).forResult();
          if (result2.bool) {
            continue;
          }
          if (current.countCards("he")) {
            const { cards: cards2 } = await current.chooseCard("he", true, "交给" + get.translation(player2) + "一张牌").forResult();
            if (cards2) {
              await current.give(cards2, player2);
            }
          }
          await player2.useCard({ name: "sha" }, current, false);
        }
      }
    },
    ai: {
      order: 5,
      result: {
        target(player2, target) {
          var players = game.filterPlayer();
          if (player2.hp > 1) {
            if (game.phaseNumber < game.players.length) {
              return 0;
            }
            if (player2.hasUnknown()) {
              return 0;
            }
          }
          var effect = 0;
          for (var i = 0; i < players.length; i++) {
            if (players[i] != target && players[i] != player2 && players[i].countCards("he")) {
              effect += get.effect(target, { name: "sha" }, players[i], target);
            }
          }
          return effect;
        }
      }
    }
  },
  nsgefa: {
    enable: "chooseToUse",
    filter(event, player2) {
      return player2.hp <= 0;
    },
    filterCard: { suit: "club" },
    position: "hse",
    viewAs: { name: "tao" },
    prompt: "将一张梅花牌当桃使用",
    check(card) {
      return 15 - get.value(card);
    },
    ai: {
      skillTagFilter(player2) {
        return player2.countCards("hes", { suit: "club" }) > 0;
      },
      threaten: 1.5,
      save: true,
      respondTao: true
    }
  },
  nscaiyi: {
    trigger: { global: "drawAfter" },
    check(event, player2) {
      if (get.attitude(player2, event.player) >= 0) {
        return false;
      }
      if (get.effect(event.player, { name: "sha" }, player2, player2) <= 0) {
        return false;
      }
      if (get.effect(player2, { name: "sha" }, event.player, player2) >= 0) {
        return true;
      }
      return player2.hasShan() && player2.hp >= event.player.hp;
    },
    filter(event, player2) {
      return player2 != event.player && Array.isArray(event.result) && event.result.length > 0;
    },
    logTarget: "player",
    async content(event, trigger, player2) {
      await player2.viewCards(get.translation(trigger.player) + "摸到的牌", trigger.result);
      if (!event.isMine()) {
        await game.delayx();
      }
      const list = [];
      for (const card of trigger.result) {
        if (card.name == "sha") {
          list.push(card);
        }
      }
      if (list.length) {
        await player2.useCard({ name: "sha" }, trigger.player);
      } else {
        await trigger.player.useCard({ name: "sha" }, player2);
      }
    }
  },
  nspinmin: {
    trigger: { player: "dieBefore" },
    forced: true,
    filter(event, player2) {
      return player2.maxHp > 0 && event.getParent().name != "giveup";
    },
    async content(event, trigger, player2) {
      trigger.cancel();
      player2.hp = 1;
      player2.update();
      if (_status.currentPhase == player2) {
        const num = 4;
        if (!player2.hasSkill("nspinmin_used") && player2.maxHp < num) {
          player2.gainMaxHp(true);
          player2.addTempSkill("nspinmin_used");
        }
      } else {
        await player2.loseMaxHp(true);
      }
    },
    subSkill: {
      used: {}
    },
    ai: {
      effect: {
        target(card, player2, target) {
          if (get.tag(card, "save")) {
            if (_status.currentPhase == player2) {
              return 0;
            }
            if (target.maxHp > 1 && player2 != target) {
              return 0;
            }
          }
          if (get.tag(card, "recover")) {
            if (_status.currentPhase == player2) {
              return 0;
            }
          }
        }
      }
    }
  },
  nsshishou: {
    trigger: { player: "loseEnd" },
    forced: true,
    filter(event, player2) {
      if (_status.currentPhase != player2) {
        return false;
      }
      for (var i = 0; i < event.cards.length; i++) {
        if (event.cards[i].original == "h") {
          return true;
        }
      }
      return false;
    },
    async content(event, trigger, player2) {
      await player2.loseHp();
      await player2.draw();
    },
    group: "nsshishou_use",
    subSkill: {
      use: {
        mod: {
          cardEnabled(card, player2) {
            if (_status.currentPhase != player2) {
              return;
            }
            if (get.cardCount(true, player2) >= 4) {
              return false;
            }
          }
        }
      }
    },
    ai: {
      neg: true
    }
  },
  nsduijue: {
    trigger: { player: "phaseUseBegin" },
    direct: true,
    filter(event, player2) {
      return player2.countCards("h");
    },
    async content(event, trigger, player2) {
      const color = {
        black: player2.countCards("h", (card) => {
          return get.color(card) == "red" && get.value(card) < 8;
        }),
        red: player2.countCards("h", (card) => {
          return get.color(card) == "black" && get.value(card) < 8;
        })
      };
      let result2;
      result2 = await player2.chooseToDiscard(get.prompt2("nsduijue")).set("ai", function(card) {
        const num = _status.event.color[get.color(card)];
        if (_status.event.goon && num >= 1) {
          return 7 + num - get.value(card);
        }
      }).set(
        "goon",
        game.hasPlayer((current) => {
          return get.effect(current, { name: "juedou" }, player2, player2) > 0;
        })
      ).set("color", color).set("logSkill", "nsduijue").forResult();
      if (result2.bool) {
        player2.addTempSkill("nsduijue_use", "phaseUseAfter");
        player2.storage.nsduijue_use = get.color(result2.cards[0]);
      }
    },
    subSkill: {
      use: {
        enable: "phaseUse",
        viewAs: { name: "juedou" },
        usable: 2,
        filter(event, player2) {
          return player2.hasCard(function(card) {
            return get.color(card) != player2.storage.nsduijue_use;
          }, "hs");
        },
        position: "hs",
        filterCard(card, player2) {
          return get.color(card) != player2.storage.nsduijue_use;
        },
        check(card) {
          return 8 - get.value(card);
        },
        ai: {
          basic: {
            order: 10
          }
        }
      }
    }
  },
  nsshuangxiong: {
    trigger: { player: "juedouBegin", target: "juedouBegin" },
    check(event, player2) {
      return player2.isTurnedOver();
    },
    async content(event, trigger, player2) {
      await player2.turnOver();
    },
    ai: { combo: "nsduijue" }
  },
  nsguanyong: {
    enable: "chooseToRespond",
    filterCard: true,
    viewAs: { name: "sha" },
    viewAsFilter(player2) {
      if (!player2.countCards("hs")) {
        return false;
      }
    },
    position: "hs",
    prompt: "将一张手牌当杀打出",
    check(card) {
      return 7 - get.value(card);
    },
    ai: {
      respondSha: true,
      skillTagFilter(player2, tag, arg) {
        if (arg !== "respond") {
          return false;
        }
        if (!player2.countCards("hs")) {
          return false;
        }
      }
    }
  },
  nsjihui: {
    trigger: { global: "discardAfter" },
    filter(event, player2) {
      return event.cards.length >= 3;
    },
    forced: true,
    async content(event, trigger, player2) {
      player2.insertPhase();
      player2.storage.nsjihui_use = _status.currentPhase;
      player2.addSkill("nsjihui_use");
    },
    subSkill: {
      use: {
        mark: "character",
        intro: {
          content: "使用牌只能指定自己与$为目标"
        },
        trigger: { player: "phaseAfter" },
        forced: true,
        popup: false,
        filter(event, player2) {
          return event.skill == "nsjihui";
        },
        onremove: true,
        async content(event, trigger, player2) {
          player2.removeSkill("nsjihui_use");
        },
        mod: {
          playerEnabled(card, player2, target) {
            if (player2 != target && player2.storage.nsjihui_use != target) {
              return false;
            }
          }
        }
      }
    }
  },
  nsmouyun: {
    enable: "phaseUse",
    round: 2,
    filterTarget(card, player2, target) {
      return target.isMinHp() && target != player2 && target.isDamaged();
    },
    async content(event, trigger, player2) {
      const { target } = event;
      if (target.isDamaged()) {
        await player2.discardPlayerCard(target, "hej", target.maxHp - target.hp, true);
      }
    },
    ai: {
      order: 10,
      result: {
        target(player2, target) {
          return target.hp - target.maxHp;
        }
      }
    }
  },
  nscongjun: {
    forbid: ["guozhan"],
    unique: true,
    forceunique: true,
    locked: true,
    init(player2) {
      if (player2.storage.nscongjun_show || ![player2.name1, player2.name2].includes("ns_huamulan")) {
        return false;
      }
      var change = function(target) {
        if (target == player2) {
          var list;
          if (_status.connectMode) {
            list = get.charactersOL(function(i) {
              return lib.character[i][0] != "male";
            });
          } else {
            list = get.gainableCharacters(function(info) {
              return info[0] == "male";
            });
          }
          var name = list.randomGet();
          target.reinit("ns_huamulan", name, "nosmooth");
          target.storage.nscongjun_show = name;
          target.addSkill("nscongjun_show");
          player2._inits.remove(change);
          player2.hp = player2.maxHp;
          player2.update();
        }
      };
      if (!player2._inits) {
        player2._inits = [];
      }
      player2._inits.push(change);
    },
    subSkill: {
      show: {
        trigger: { global: "useCard" },
        filter(event, player2) {
          return player2.storage.nscongjun_show && event.card.name == "wuxie" && event.getRand() < 0.1 && player2.getEnemies().includes(event.player);
        },
        direct: true,
        skillAnimation: true,
        animationColor: "thunder",
        async content(event, trigger, player2) {
          await game.delay(0.5);
          player2.reinit(player2.storage.nscongjun_show, "ns_huamulan", "nosmooth");
          player2.logSkill("nscongjun_show");
          player2.removeSkill("nscongjun_show");
          player2.line(trigger.player, "green");
          await trigger.player.damage(2);
        }
      }
    }
  },
  nstaiping_nh: {
    trigger: { player: "damageEnd" },
    filter(event, player2) {
      return !event.nshuanxian && player2.getSubPlayers("nshuanxian").length && event.num > 0;
    },
    getIndex: (event) => event.num,
    priority: -0.1,
    async cost(event, trigger, player2) {
      const left = player2.storage.nshuanxian_left;
      const right = player2.storage.nshuanxian_right;
      const list = [];
      let choice = 0;
      let hpleft = 0;
      let maxleft = 0;
      if (left && player2.hasSkill(left)) {
        if (player2.storage[left].hp < player2.storage[left].maxHp) {
          list.push("令幻身·左回复1点体力");
          hpleft = player2.storage[left].hp;
        }
        list.push("令幻身·左增加1点体力上限");
        maxleft = player2.storage[left].hp;
      }
      if (left && player2.hasSkill(right)) {
        if (player2.storage[right].hp < player2.storage[right].maxHp) {
          list.push("令幻身·右回复1点体力");
          if (!hpleft || player2.storage[right].hp < hpleft || player2.storage[right].hp == hpleft && Math.random() < 0.5) {
            choice = list.length - 1;
          }
        }
        list.push("令幻身·右增加1点体力上限");
        if (!hpleft && maxleft && choice == 0) {
          if (player2.storage[right].maxHp < maxleft || player2.storage[right].maxHp == maxleft && Math.random() < 0.5) {
            choice = list.length - 1;
          }
        }
      }
      if (!list.length) {
        return;
      }
      let map = {};
      for (var i = 0; i < list.length; i++) {
        map["选项" + get.cnNumber(i + 1, true)] = list[i];
      }
      const result2 = await player2.chooseControlList(list, () => get.event().choice).set("prompt", get.prompt(event.skill)).set("choice", choice).forResult();
      event.result = {
        bool: result2.control != "cancel2",
        cost_data: {
          control: result2.control,
          map
        }
      };
    },
    async content(event, trigger, player2) {
      const {
        cost_data: { control, map }
      } = event;
      const left = player2.storage.nshuanxian_left;
      const right = player2.storage.nshuanxian_right;
      switch (map[control]) {
        case "令幻身·左回复1点体力":
          player2.storage[left].hp++;
          break;
        case "令幻身·左增加1点体力上限":
          player2.storage[left].maxHp++;
          break;
        case "令幻身·右回复1点体力":
          player2.storage[right].hp++;
          break;
        case "令幻身·右增加1点体力上限":
          player2.storage[right].maxHp++;
          break;
      }
      game.log(player2, map[control].replace(/一/, "了一"));
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      combo: "nshuanxian"
    }
  },
  nsshoudao: {
    group: ["nsshoudao_gain", "nsshoudao_die"],
    subSkill: {
      gain: {
        trigger: { player: "subPlayerDie" },
        forced: true,
        filter(event, player2) {
          const left = player2.storage.nshuanxian_left;
          if (left && player2.hasSkill(left)) {
            return false;
          }
          const right = player2.storage.nshuanxian_right;
          if (right && player2.hasSkill(right)) {
            return false;
          }
          if (!player2.storage.nshuanxian_damage) {
            return false;
          }
          return true;
        },
        async content(event, trigger, player2) {
          await player2.addSkills(["releiji", "guidao"]);
        }
      },
      die: {
        trigger: { player: "die" },
        filter(event, player2) {
          if (!game.hasPlayer((current) => player2 != current && player2 != event.source)) {
            return false;
          }
          const left = player2.storage.nshuanxian_left;
          if (left && player2.hasSkill(left)) {
            return true;
          }
          const right = player2.storage.nshuanxian_right;
          if (right && player2.hasSkill(right)) {
            return true;
          }
          return false;
        },
        skillAnimation: true,
        animationColor: "wood",
        forceDie: true,
        async cost(event, trigger, player2) {
          const { source } = trigger;
          let str;
          const left = player2.storage.nshuanxian_left;
          const right = player2.storage.nshuanxian_right;
          if (left && player2.hasSkill(left) && right && player2.hasSkill(right)) {
            str = "令一名其他角色获得技能【雷击】和【鬼道】";
          } else {
            str = "令一名其他角色获得技能【雷击】或【鬼道】";
          }
          if (source) {
            str += "（" + get.translation(source) + "除外）";
          }
          event.result = await player2.chooseTarget(
            (card, player3, target) => {
              return target != player3 && target != _status.event.source;
            },
            get.prompt(event.name.slice(0, -5))
          ).set("ai", (target) => {
            if (target.hasSkill("releiji")) {
              return 0;
            }
            return get.attitude(get.player(), target);
          }).set("source", source).set("prompt2", str).set("forceDie", true).forResult();
        },
        async content(event, trigger, player2) {
          const {
            targets: [target]
          } = event;
          const left = player2.storage.nshuanxian_left;
          const right = player2.storage.nshuanxian_right;
          if (left && player2.hasSkill(left) && right && player2.hasSkill(right)) {
            await target.addSkills(["releiji", "guidao"]);
          } else {
            const { control } = await player2.chooseControl("releiji", "guidao").set("prompt", `令${get.translation(target)}获得一项技能`).forResult();
            await target.addSkills(control);
          }
        }
      }
    },
    ai: { combo: "nshuanxian" }
  },
  nshuanxian: {
    trigger: { global: "gameStart", player: "enterGame" },
    forced: true,
    nosub: true,
    unique: true,
    group: ["nshuanxian_left", "nshuanxian_right", "nshuanxian_damage", "nshuanxian_swap", "nshuanxian_draw"],
    async content(event, trigger, player2) {
      player2.storage.nshuanxian_right = player2.addSubPlayer({
        name: "ns_nanhua_right",
        skills: ["nshuanxian_left", "nshuanxian_draw", "nshuanxian_swap"],
        hp: 2,
        maxHp: 2,
        hs: get.cards(2),
        skill: "nshuanxian",
        intro: "你的本体回合结束后，切换至此随从并进行一个额外的回合；若你的上家与下家不同，在你的下家的准备阶段，切换至此随从",
        intro2: "当前回合结束后切换回本体",
        onremove(player3) {
          delete player3.storage.nshuanxian_right;
        }
      });
    },
    ai: {
      effect: {
        target(card, player2, target) {
          if (get.tag(card, "damage")) {
            if (!target.hasFriend()) {
              return;
            }
            if (target.hp <= 2) {
              return;
            }
            if (!target.storage.nshuanxian_damage) {
              if (get.attitude(player2, target) < 0 || get.tag(card, "multineg")) {
                return [0, 1];
              }
              return [1, 1];
            }
          }
        }
      }
    },
    subSkill: {
      chosen: {},
      leftdist: {
        mod: {
          globalFrom(from, to, distance) {
          },
          globalTo(from, to, distance) {
          }
        }
      },
      rightdist: {
        mod: {
          globalFrom(from, to, distance) {
          },
          globalTo(from, to, distance) {
          }
        }
      },
      swap: {
        trigger: { global: "phaseBegin" },
        forced: true,
        popup: false,
        filter(event, player2) {
          return event.player != player2;
        },
        priority: 20,
        async content(event, trigger, player2) {
          const { step, source, target, targets, card, cards: cards2, skill, forced, num } = event;
          const next = player2.getNext();
          const prev = player2.getPrevious();
          const left = player2.storage.nshuanxian_left;
          const right = player2.storage.nshuanxian_right;
          if (prev == next || trigger.player != next && trigger.player != prev) {
            if (player2.hasSkill("subplayer")) {
              player2.exitSubPlayer();
            }
          } else if (prev == trigger.player && player2.name != left && left) {
            if (!player2.hasSkill("subplayer")) {
              player2.callSubPlayer(left);
            } else {
              player2.toggleSubPlayer(left);
            }
          } else if (next == trigger.player && player2.name != right && right) {
            if (!player2.hasSkill("subplayer")) {
              player2.callSubPlayer(right);
            } else {
              player2.toggleSubPlayer(right);
            }
          }
        }
      },
      damage: {
        trigger: { player: "damageEnd" },
        forced: true,
        filter(event, player2) {
          return !player2.storage.nshuanxian_damage;
        },
        async content(event, trigger, player2) {
          player2.storage.nshuanxian_damage = true;
          player2.storage.nshuanxian_left = player2.addSubPlayer({
            name: "ns_nanhua_left",
            skills: ["nshuanxian_middle", "nshuanxian_draw", "nshuanxian_swap"],
            hp: 2,
            maxHp: 2,
            hs: get.cards(2),
            skill: "nshuanxian",
            intro: "你的本体回合开始前，切换至此随从并进行一个额外的回合；若你的上家与下家不同，在你的上家的准备阶段，切换至此随从",
            intro2: "当前回合结束后切换回本体",
            onremove(player3) {
              delete player3.storage.nshuanxian_left;
            }
          });
          trigger.nshuanxian = true;
        }
      },
      draw: {
        trigger: { player: "phaseDrawBegin" },
        silent: true,
        filter(event) {
          return event.num > 0;
        },
        async content(event, trigger, player2) {
          trigger.num--;
        }
      },
      left: {
        trigger: { player: "phaseBefore" },
        forced: true,
        popup: false,
        priority: 40,
        filter(event, player2) {
          if (event.skill == "nshuanxian_middle") {
            return false;
          }
          if (event.skill == "nshuanxian_right") {
            return false;
          }
          var left = player2.storage.nshuanxian_left;
          if (player2.hasSkill("subplayer")) {
            if (!left) {
              return player2.name == player2.storage.nshuanxian_right;
            }
            return player2.storage.subplayer.skills.includes(left);
          } else {
            if (!left) {
              return false;
            }
            return player2.hasSkill(left);
          }
        },
        async content(event, trigger, player2) {
          if (player2.hasSkill("subplayer")) {
            var left = player2.storage.nshuanxian_left;
            if (left && player2.storage.subplayer.skills.includes(left)) {
              player2.toggleSubPlayer(player2.storage.nshuanxian_left);
            } else {
              player2.exitSubPlayer();
            }
          } else {
            player2.callSubPlayer(player2.storage.nshuanxian_left);
          }
        }
      },
      middle: {
        trigger: { player: ["phaseAfter", "phaseCancelled"] },
        forced: true,
        popup: false,
        priority: -40,
        filter(event, player2) {
          if (player2.hasSkill("nshuanxian_chosen")) {
            return false;
          }
          return true;
        },
        async content(event, trigger, player2) {
          await player2.exitSubPlayer();
          player2.insertPhase(null, true);
        }
      },
      right: {
        trigger: { player: ["phaseAfter", "phaseCancelled"] },
        forced: true,
        popup: false,
        priority: -40,
        filter(event, player2) {
          if (player2.hasSkill("nshuanxian_chosen")) {
            return false;
          }
          if (player2.hasSkill("subplayer")) {
            return false;
          }
          var right = player2.storage.nshuanxian_right;
          if (!right) {
            return false;
          }
          return player2.hasSkill(right);
        },
        async content(event, trigger, player2) {
          player2.callSubPlayer(player2.storage.nshuanxian_right);
          player2.insertPhase(null, true);
          player2.addTempSkill("nshuanxian_chosen", ["phaseBegin", "phaseCancelled"]);
        }
      },
      end: {
        trigger: { player: ["phaseAfter", "phaseCancelled"] },
        forced: true,
        popup: false,
        priority: -40,
        filter(event, player2) {
          if (player2.hasSkill("nshuanxian_chosen")) {
            return false;
          }
          return true;
        },
        async content(event, trigger, player2) {
          if (player2.hasSkill("subplayer")) {
            player2.exitSubPlayer();
          }
        },
        // 理论上我可以不改，但我不想格式化后还得正则替换，于是交给GPT-5 mini了，因为免费
        async content_old(event, trigger, player2) {
          let result2;
          const controls = ["本体"];
          const left = player2.storage.nshuanxian_left;
          const right = player2.storage.nshuanxian_right;
          if (player2.hasSkill("subplayer")) {
            if (player2.storage.subplayer.skills.includes(left)) {
              controls.unshift("幻身·左");
            }
            if (player2.storage.subplayer.skills.includes(right)) {
              controls.push("幻身·右");
            }
          } else {
            if (player2.hasSkill(left)) {
              controls.unshift("幻身·左");
            }
            if (player2.hasSkill(right)) {
              controls.push("幻身·右");
            }
          }
          if (controls.length > 1) {
            result2 = await player2.chooseControl(controls).set("prompt", "选择一个形态直到下一回合开始").set("ai", () => Math.floor(Math.random() * _status.event.num)).set("num", controls.length).forResult();
          } else {
            return;
          }
          switch (result2.control) {
            case "幻身·左": {
              if (!player2.hasSkill("subplayer")) {
                player2.callSubPlayer(player2.storage.nshuanxian_left);
              } else {
                player2.toggleSubPlayer(player2.storage.nshuanxian_left);
              }
              break;
            }
            case "幻身·右": {
              if (!player2.hasSkill("subplayer")) {
                player2.callSubPlayer(player2.storage.nshuanxian_right);
              }
              break;
            }
            default: {
              if (player2.hasSkill("subplayer")) {
                player2.exitSubPlayer();
              }
              break;
            }
          }
          player2.addTempSkill("nshuanxian_chosen", "phaseBegin");
        }
      }
    }
  },
  nsnongquan: {
    enable: "phaseUse",
    filter(event, player2) {
      return player2.countCards("h") == 1 && player2.canUse("wuzhong", player2);
    },
    direct: true,
    delay: 0,
    async content(event, trigger, player2) {
      player2.useCard({ name: "wuzhong" }, player2.getCards("h"), player2, "nsnongquan");
    },
    ai: {
      order: 10,
      result: {
        player(player2, target) {
          return 10 - get.value(player2.getCards("h")[0]);
        }
      }
    }
  },
  nsdufu: {
    trigger: { source: "damageBefore" },
    check(event, player2) {
      return event.player.hasSkillTag("maixie");
    },
    direct: true,
    async content(event, trigger, player2) {
      let result2;
      result2 = await player2.chooseTarget(get.prompt2("nsdufu"), (card, player3, target) => {
        return target != player3;
      }).set("ai", (target) => {
        if (_status.event.bool) {
          return -get.attitude(_status.event.player, target);
        }
        return 0;
      }).set("bool", trigger.player.hasSkillTag("maixie_defend")).forResult();
      if (result2.bool && result2.targets?.length) {
        player2.logSkill("nsdufu", result2.targets);
        trigger.source = result2.targets[0];
      }
    }
  },
  liangji: {
    audio: ["liangji", 2],
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player2, target) {
      return target != player2 && !target.hasSkill("liangji_1");
    },
    async content(event, trigger, player2) {
      const { target } = event;
      const result2 = await player2.chooseCard("h", "环计：将一张牌置于" + get.translation(target) + "的武将牌上", true).set("ai", function(card) {
        if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) {
          return 7 - get.value(card);
        }
        return -get.value(card);
      }).forResult();
      if (result2.bool) {
        player2.$give(result2.cards, target);
        await player2.lose(result2.cards, ui.special);
        target.storage.liangji_1 = result2.cards;
        target.storage.liangji_1_source = target;
        target.syncStorage("liangji_1");
        target.addSkill("liangji_1");
      }
    },
    ai: {
      order: 1,
      result: {
        target(player2, target) {
          if (get.attitude(player2, target) > 0) {
            return Math.sqrt(target.countCards("he"));
          }
          return 0;
        },
        player: 1
      }
    },
    subSkill: {
      1: {
        trigger: {
          player: "phaseDrawBegin"
        },
        forced: true,
        mark: true,
        intro: {
          content: "cards"
        },
        async content(event, trigger, player2) {
          const cards2 = player2.storage.liangji_1;
          if (cards2) {
            await player2.gain(cards2, "gain2");
          }
          player2.storage.liangji_1 = 0;
          if (player2.sex == "male") {
            player2.addTempSkill("wushuang");
          }
          if (player2.sex == "female") {
            player2.addTempSkill("lijian");
          }
          player2.removeSkill("liangji_1");
        },
        sub: true
      }
    }
  },
  jugong: {
    audio: ["jingong", 2],
    trigger: {
      global: "damageEnd"
    },
    usable: 1,
    frequent: true,
    marktext: "功",
    init(player2) {
      player2.storage.jugong = [];
    },
    filter(event, player2) {
      return event.card && (event.card.name == "sha" || event.card.name == "juedou") && event.notLink() && _status.currentPhase != player2;
    },
    async content(event, trigger, player2) {
      await player2.draw();
      if (!player2.countCards("h")) return;
      const result2 = await player2.chooseCard("将" + get.cnNumber(1) + "张手牌置于武将牌上作为”功”", 1, true).forResult();
      if (result2.cards && result2.cards.length) {
        await player2.lose(result2.cards, ui.special);
        player2.storage.jugong = player2.storage.jugong.concat(result2.cards);
        player2.syncStorage("jugong");
        player2.markSkill("jugong");
        game.log(player2, "将", result2.cards, "置于武将牌上作为”功”");
      }
    },
    intro: {
      content: "cards"
    },
    group: "jugong_1",
    subSkill: {
      1: {
        trigger: {
          player: "damageBegin"
        },
        filter(event, player2) {
          return player2.storage.jugong.length > 1;
        },
        async content(event, trigger, player2) {
          let result2;
          result2 = await player2.chooseCardButton("移去两张“功”", 2, player2.storage.jugong, true).forResult();
          if (event.directresult || result2.bool) {
            player2.logSkill("jugong");
            const links = event.directresult || result2.links;
            for (const link of links) {
              player2.storage.jugong.remove(link);
            }
            player2.syncStorage("jugong");
            if (!player2.storage.jugong.length) {
              player2.unmarkSkill("jugong");
            } else {
              player2.markSkill("jugong");
            }
            player2.$throw(links);
            game.log(player2, "被移去了", links);
            for (const link of links) {
              ui.discardPile.appendChild(link);
            }
          }
          trigger.cancel();
        },
        sub: true
      }
    },
    ai: {
      effect: {
        target(card, player2, target) {
          if (get.tag(card, "damage")) {
            if (player2.hasSkillTag("jueqing", false, target)) {
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
              return [0.5, get.tag(card, "damage") * 0.2];
            }
            if (target.hp == 2) {
              return [0.1, get.tag(card, "damage") * 0.1];
            }
          }
        }
      }
    }
  },
  chengmou: {
    audio: ["moucheng", 2],
    trigger: {
      player: "phaseDrawBegin"
    },
    frequent: true,
    filter(event, player2) {
      return player2.storage.jugong.length > 0;
    },
    async content(event, trigger, player2) {
      if (player2.storage.jugong.length > 2) {
        await player2.loseHp();
      }
      const cards2 = player2.storage.jugong;
      if (cards2) {
        await player2.gain(cards2, "gain2");
      }
      player2.storage.jugong = [];
      trigger.cancel();
    },
    ai: {
      combo: "jugong"
    }
  },
  nsxinsheng: {
    trigger: { source: "damageEnd" },
    frequent: true,
    filter(event, player2) {
      return player2.isHealthy();
    },
    async content(event, trigger, player2) {
      player2.gainMaxHp(trigger.num, true);
      player2.draw(trigger.num);
    }
  },
  nsdunxing: {
    trigger: { player: "damageBefore" },
    filter(event, player2) {
      return player2.isDamaged();
    },
    async content(event, trigger, player2) {
      trigger.cancel();
      player2.loseMaxHp(trigger.num, true);
      player2.draw(trigger.num);
    }
  },
  tiangong: {
    group: ["tiangong2"],
    trigger: { player: "damageBefore" },
    filter(event) {
      if (event.nature == "thunder") {
        return true;
      }
    },
    forced: true,
    async content(event, trigger, player2) {
      trigger.cancel();
    },
    ai: {
      effect: {
        target(card, player2, target, current) {
          if (card.name == "tiesuo") {
            return 0.1;
          }
          if (get.tag(card, "thunderDamage")) {
            return "zeroplayertarget";
          }
        }
      },
      threaten: 0.5
    }
  },
  tiangong2: {
    trigger: { source: "damageAfter" },
    sourceSkill: "tiangong",
    filter(event) {
      if (event.nature == "thunder") {
        return true;
      }
    },
    forced: true,
    popup: false,
    priority: 1,
    async content(event, trigger, player2) {
      player2.draw();
    }
  },
  nsdingzhou: {
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player2, target) {
      return target != player2 && target.countCards("hej") > 0;
    },
    async content(event, trigger, player2) {
      const { target } = event;
      let result2;
      let cards2 = target.getCards("hej");
      if (get.isLuckyStar(player2)) {
        const cardx = ui.cardPile.firstChild;
        if (cardx) {
          const color = get.color(cardx);
          const cardsx = cards2.filter((i) => get.color(i) == color);
          if (cardsx.length > 0) {
            cards2 = cardsx;
          }
        }
      }
      const card = cards2.randomGet();
      event.card = card;
      await player2.gain(card, target, "giveAuto", "bySelf");
      result2 = await player2.draw().forResult();
      if (Array.isArray(result2) && get.color(card) != get.color(result2[0])) {
        await player2.loseHp();
      }
    },
    ai: {
      order: 7,
      result: { target: -1 }
    }
  },
  //比原版更令人难以吐槽的神孙权
  junkyuheng: {
    audio: "yuheng",
    trigger: { player: "phaseBegin" },
    forced: true,
    keepSkill: true,
    filter(event, player2) {
      return player2.hasCard(function(card) {
        return lib.filter.cardDiscardable(card, player2, "junkyuheng");
      }, "he");
    },
    async content(event, trigger, player2) {
      let result2;
      const suits = /* @__PURE__ */ new Set();
      for (const card of player2.iterableGetCards("he")) {
        const suit = get.suit(card, player2);
        suits.add(suit);
      }
      const num = suits.size;
      result2 = await player2.chooseToDiscard({
        forced: true,
        position: "he",
        complexCard: true,
        selectCard: [1, num],
        filterCard(card, player3) {
          if (!ui.selected.cards.length) {
            return true;
          }
          const suit = get.suit(card, player3);
          for (const selectedCard of ui.selected.cards) {
            if (get.suit(selectedCard, player3) == suit) {
              return false;
            }
          }
          return true;
        },
        ai(card) {
          if (!player2.hasValueTarget(card)) {
            return 5;
          }
          return 5 - get.value(card);
        }
      }).forResult();
      if (result2.bool) {
        const skills2 = lib.skill.junkyuheng.derivation.randomGets(result2.cards.length);
        await player2.addAdditionalSkills("junkyuheng", skills2, true);
      }
    },
    group: "junkyuheng_remove",
    derivation: [
      "olbingyi",
      "shenxing",
      "xiashu",
      "old_anxu",
      "rezhiheng",
      "xinanguo",
      "lanjiang",
      "xinfu_guanwei",
      "dimeng",
      "xindiaodu",
      "xingxue",
      "jiexun",
      "olhongyuan",
      "xinfu_youdi",
      "bizheng"
    ],
    subSkill: {
      remove: {
        audio: "yuheng",
        trigger: { player: "phaseEnd" },
        forced: true,
        filter(event, player2) {
          return player2.additionalSkills.junkyuheng && player2.additionalSkills.junkyuheng.length > 0;
        },
        async content(event, trigger, player2) {
          const skillslength = player2.additionalSkills.junkyuheng.length;
          await player2.removeAdditionalSkills("junkyuheng");
          await player2.draw(skillslength);
        }
      }
    }
  },
  junkdili: {
    audio: "dili",
    trigger: { player: "changeSkillsAfter" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "wood",
    filter(event, player2) {
      if (!event.addSkill.length) {
        return false;
      }
      var skills2 = player2.getSkills(null, false, false).filter(function(i) {
        var info = get.info(i);
        return info && !info.charlotte;
      });
      return skills2.length > player2.maxHp;
    },
    async content(event, trigger, player2) {
      let result2;
      player2.awakenSkill(event.name);
      await player2.loseMaxHp();
      const skills2 = player2.getSkills(null, false, false).filter((skill) => {
        if (skill === "junkdili") {
          return false;
        }
        const info = get.info(skill);
        return info && !info.charlotte;
      });
      result2 = await player2.chooseButton(["请选择失去任意个技能", [skills2, "skill"]]).set("forced", true).set("selectButton", [1, skills2.length]).set("skills", skills2).set("ai", (button) => {
        const skill = button.link;
        const skillList = _status.event.skills.slice(0);
        skillList.removeArray(["xinanguo", "lanjiang", "rezhiheng", "junkyuheng"]);
        switch (ui.selected.buttons.length) {
          case 0: {
            if (skillList.includes(skill)) {
              return 2;
            }
            if (skill === "junkyuheng") {
              return 1;
            }
            return Math.random();
          }
          case 1: {
            if (skillList.length < 2) {
              return 0;
            }
            if (skillList.includes(skill)) {
              return 2;
            }
            if (skill === "junkyuheng") {
              return 1;
            }
            return 0;
          }
          case 2: {
            if (skillList.includes(skill)) {
              return 2;
            }
            if (skill === "junkyuheng") {
              return 1;
            }
            return 0;
          }
          default: {
            return 0;
          }
        }
      }).forResult();
      let removeCount = skills2.length;
      if (result2.bool) {
        const removedSkills = result2.links.slice(0);
        removeCount = removedSkills.length;
        await player2.removeSkills(removedSkills);
      }
      const derivation = lib.skill.junkdili.derivation;
      const list = derivation.slice(0, Math.min(removeCount, derivation.length));
      await player2.addSkills(list);
    },
    ai: {
      combo: "junkyuheng"
    },
    derivation: ["junkshengzhi", "junkquandao", "junkchigang"]
  },
  junkshengzhi: {
    audio: "dili_shengzhi",
    trigger: { player: ["logSkill", "useSkillAfter"] },
    forced: true,
    filter(event, player2) {
      if (event.type != "player") {
        return false;
      }
      var skill = get.sourceSkillFor(event);
      if (get.is.locked(skill)) {
        return false;
      }
      var info = get.info(skill);
      return !info.charlotte;
    },
    async content(event, trigger, player2) {
      player2.addTempSkill("junkshengzhi_effect");
    },
    subSkill: {
      effect: {
        mod: {
          cardUsable: () => Infinity,
          targetInRange: () => true
        },
        trigger: { player: "useCard1" },
        forced: true,
        charlotte: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player2) {
          player2.removeSkill(event.name);
          if (trigger.addCount !== false) {
            trigger.addCount = false;
            const stat = player2.getStat().card;
            const name = trigger.card.name;
            if (typeof stat[name] == "number") {
              stat[name]--;
            }
          }
        },
        mark: true,
        intro: { content: "使用下一张牌无距离和次数限制" }
      }
    }
  },
  junkquandao: {
    audio: "dili_quandao",
    trigger: { player: "useCard" },
    forced: true,
    filter(event, player2) {
      return event.card.name == "sha" || get.type(event.card, null, false) == "trick";
    },
    async content(event, trigger, player2) {
      const cards1 = player2.getCards("h", (card) => get.name(card) === "sha"), cards2 = player2.getCards("h", (card) => get.type(card) === "trick");
      if (cards1.length !== cards2.length) {
        const num = cards1.length - cards2.length, cards3 = num > 0 ? cards1 : cards2;
        let i = 0;
        cards3.forEach((card) => {
          if (i < Math.abs(num) && lib.filter.cardDiscardable(card, player2, "junkquandao")) {
            i++;
          }
        });
        if (i > 0) {
          await player2.chooseToDiscard(
            i,
            true,
            `权道：请弃置${get.cnNumber(i)}张${num > 0 ? "杀" : "普通锦囊牌"}`,
            num > 0 ? (card) => get.name(card) === "sha" : (card) => get.type(card) === "trick"
          );
        }
      }
      await player2.draw();
    }
  },
  junkchigang: {
    audio: "dili_chigang",
    trigger: { player: "phaseChange" },
    forced: true,
    zhuanhuanji: true,
    mark: true,
    marktext: "☯",
    filter(event, player2) {
      return event.phaseList[event.num].indexOf("phaseJudge") != -1;
    },
    async content(event, trigger, player2) {
      player2.changeZhuanhuanji(event.name);
      let phase = player2.storage.junkchigang ? "phaseDraw" : "phaseUse";
      trigger.phaseList[trigger.num] = `${phase}|${event.name}`;
      game.delayx();
    },
    ai: {
      effect: {
        target(card, player2, target) {
          if (get.type(card) == "delay") {
            return "zeroplayertarget";
          }
        }
      }
    },
    intro: {
      content(storage) {
        return "转换技，锁定技。判定阶段开始前，你取消此阶段。然后你获得一个额外的" + (storage ? "出牌阶段" : "摸牌阶段") + "。";
      }
    }
  },
  nsmanzhi: {
    audio: "dcmanzhi",
    trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
    direct: true,
    filter(event, player2) {
      var nums = [];
      game.countPlayer((current) => {
        nums.add(current.hp);
        nums.add(current.maxHp);
        nums.add(current.countCards("h"));
        nums.add(current.countCards("e"));
        nums.add(current.countCards("j"));
      });
      for (var a of nums) {
        for (var b of nums) {
          if (0.5 * a * a + 2.5 * b - game.roundNumber == game.countPlayer()) {
            return true;
          }
        }
      }
      return false;
    },
    async content(event, trigger, player2) {
      const nums = [];
      game.countPlayer((current) => {
        nums.add(current.hp);
        nums.add(current.maxHp);
        nums.add(current.countCards("h"));
        nums.add(current.countCards("e"));
        nums.add(current.countCards("j"));
      });
      nums.sort((a2, b2) => a2 - b2);
      const roundNumber = game.roundNumber;
      const playerCount = game.countPlayer();
      let a = null;
      let b = null;
      let goon = false;
      for (const valueA of nums) {
        for (const valueB of nums) {
          if (0.5 * valueA * valueA + 2.5 * valueB - roundNumber == playerCount) {
            a = valueA;
            b = valueB;
            goon = true;
            break;
          }
        }
        if (goon) {
          break;
        }
      }
      const result2 = await player2.chooseButton(2, [
        "蛮智：请选择让下列等式成立的A与B的值",
        '<div class="text center">目标等式</div>',
        `0.5 × A<sup>2</sup> + 2.5 × B - ${roundNumber} = ${playerCount}`,
        '<div class="text center">A的可选值</div>',
        [
          nums.map((i) => {
            return [`A|${i}`, i == a ? `<span class="yellowtext">${i}</span>` : i];
          }),
          "tdnodes"
        ],
        '<div class="text center">B的可选值</div>',
        [
          nums.map((i) => {
            return [`B|${i}`, i == b ? `<span class="yellowtext">${i}</span>` : i];
          }),
          "tdnodes"
        ]
      ]).set("filterButton", (button) => {
        if (!ui.selected.buttons.length) {
          return true;
        }
        return button.link[0] != ui.selected.buttons[0].link[0];
      }).set("filterOk", () => {
        if (ui.selected.buttons.length != 2) {
          return false;
        }
        let selectedA;
        let selectedB;
        for (const selected of ui.selected.buttons) {
          if (selected.link[0] == "A") {
            selectedA = parseInt(selected.link.slice(2));
          } else {
            selectedB = parseInt(selected.link.slice(2));
          }
        }
        return 0.5 * selectedA * selectedA + 2.5 * selectedB - roundNumber == playerCount;
      }).set("choice", [a, b]).set("ai", (button) => {
        const choice = _status.event.choice;
        if (button.link == `A|${choice[0]}` || button.link == `B|${choice[1]}`) {
          return 1;
        }
        return 0;
      }).forResult();
      if (result2.bool) {
        let selectedA;
        let selectedB;
        for (const link of result2.links) {
          if (link[0] == "A") {
            selectedA = parseInt(link.slice(2));
          } else {
            selectedB = parseInt(link.slice(2));
          }
        }
        const equals = `0.5×${selectedA}<sup>2</sup>+2.5×${selectedB}-${roundNumber}=${playerCount}`;
        player2.logSkill("nsmanzhi");
        player2.chat(equals);
        game.log(player2, "的计算结果为", equals);
        await player2.draw(playerCount);
      }
    }
  }
};
const translates = {
  ns_zuoci: "左慈",
  ns_wangyun: "王允",
  ns_lvzhi: "吕后",
  ns_nanhua: "南华",
  ns_nanhua_left: "幻身·左",
  ns_nanhua_right: "幻身·右",
  ns_huamulan: "SP花木兰",
  ns_huamulan_prefix: "SP",
  ns_huangzu: "黄祖",
  ns_yanliang: "颜良",
  ns_wenchou: "文丑",
  ns_jinke: "荆轲",
  ns_caocao: "曹操",
  ns_zhugeliang: "诸葛亮",
  ns_wangyue: "王越",
  ns_yuji: "于吉",
  ns_caocaosp: "SP曹操",
  ns_caocaosp_prefix: "SP",
  ns_xinxianying: "辛宪英",
  ns_sunjian: "孙坚",
  ns_simazhao: "司马昭",
  ns_guanlu: "管辂",
  ns_duangui: "段珪",
  ns_shenpei: "审配",
  ns_zhangbao: "张宝",
  ns_masu: "马谡",
  ns_zhangxiu: "张绣",
  ns_lvmeng: "吕蒙",
  ns_yujisp: "于吉",
  ns_yangyi: "杨仪",
  ns_liuzhang: "刘璋",
  ns_xinnanhua: "南华老仙",
  ns_luyusheng: "陆郁生",
  huan_noname: "幻小无",
  huan_noname_prefix: "幻",
  noname_gongchuang: "共创",
  noname_gongchuang_info: "锁定技，准备阶段，所有角色依次选择：1.交给你一张牌；2.令你获得2枚“漏洞”（至多24枚）。然后你交给任意名角色至多四张牌，若牌数不小于2/4，本回合你使用牌时不可被响应/摸一张牌。",
  huan_duocai: "多彩",
  huan_duocai_info: `出牌阶段，你可弃置4枚“漏洞”，获得一名其他角色的一个技能，其该技能失效，效果直至其下回合结束。当其他角色使用牌指定你为目标时，你可弃置1枚“漏洞”取消之。当你受到伤害后，你可视为对伤害来源发动一次${get.poptip("noname_gongchuang")}。`,
  noname: "小无",
  noname_zhuyuan: "祝愿",
  noname_zhuyuan_info: "①每回合每名角色限一次。出牌阶段，你可以将四张花色各不相同的牌交给一名其他角色。你与其获得技能〖铁骑〗和〖激昂〗至各自的回合结束。②锁定技，若你于当前回合内：未发动过〖祝愿〗，则你使用牌无次数限制；发动过〖祝愿〗，则你使用牌无距离限制。",
  noname_duocai: "多彩",
  noname_duocai_info: "其他角色的牌进入弃牌堆后，你可以获得之。若你以此法得到的牌数：大于2，你弃置一名角色区域内的一张牌；等于2，你摸一张牌；小于2，你回复1点体力。",
  ns_huangchengyan: "黄承彦",
  nslongyue: "龙岳",
  nslongyue_info: "当一名角色使用锦囊牌时，若此牌是其本回合内使用的第一张牌，则你可令其摸一张牌。",
  nszhenyin: "阵引",
  nszhenyin_info: "每回合限一次。一名角色的判定牌生效前，你可令当前回合角色打出一张手牌代替之。",
  ns_sunchensunjun: "孙綝孙峻",
  nsxianhai: "险害",
  nsxianhai_info: "每轮限一次，当一名其他角色于回合内造成伤害后，若其此回合内造成过的伤害总和大于你上一回合内造成的伤害总和，则你可以减1点体力上限，令其废除一种装备栏并弃置手牌中所有的【闪】。若〖兴黜〗已发动，此回合结束后视为该限定技未发动过。",
  nsxingchu: "兴黜",
  nsxingchu_info: "限定技，当你杀死一名角色/你死亡时，你可以令一名角色获得其/你的所有牌并增加1点体力上限。",
  ns_yuanxi: "袁熙",
  nsshengyan: "盛筵",
  nsshengyan_info: "锁定技，你的判定牌生效后，若结果花色与你本回合内其他判定结果的花色均不同，则你令当前回合角色本回合的手牌上限+2。",
  nsdaizhan: "怠战",
  nsdaizhan_info: "准备阶段，你可以将一张非锦囊牌当做【兵粮寸断】或【乐不思蜀】对自己使用。若如此做，回合结束时，你将手牌摸至手牌上限。",
  ns_caoshuang: "曹爽",
  nsjiquan: "集权",
  nsjiquan_mark: "集权",
  nsjiquan_info: "与你距离1以内的其他角色造成或受到伤害后，你可以将其区域内的一张牌置于你的武将牌上（称为“威”）。你使用【杀】的次数上限+X（X为“威”数）。",
  nsfuwei: "附位",
  nsfuwei_info: "觉醒技，结束阶段开始时，若“威”数大于4，则你加2点体力上限，获得〖喋谋〗和〖制皇〗，并将〖集权〗改为锁定技。",
  nsdiemou: "喋谋",
  nsdiemou_info: "锁定技，出牌阶段开始时，若“威”大于全场角色数，你移去所有“威”，减1点体力上限并摸X张牌。若X大于4，你翻面。（X为移去的“威”数）",
  nszhihuang: "制皇",
  nszhihuang_damage: "制皇",
  nszhihuang_info: "每回合限一次，当主公使用牌时，你可以移去一张“威”，然后获得此牌。锁定技，若你的手牌数大于主公，则你使用牌造成的伤害+1。",
  ns_chentai: "陈泰",
  nsweiyuan: "围援",
  nsweiyuan_use: "围援",
  nsweiyuan_use_backup: "围援",
  nsweiyuan_info: "出牌阶段限一次，当你使用牌指定其他角色A为唯一目标后，你可以令一名除该角色外的其他角色B选择一项：①交给A一张牌：然后你对B造成1点伤害；②你摸一张牌，且可以将一张手牌当做本回合使用过的一张基本牌/普通锦囊牌使用（无次数距离限制）。",
  nsjuxian: "据险",
  nsjuxian2: "据险",
  nsjuxian_info: "当你受到伤害时，你可以摸两张并跳过下一个摸牌阶段，且在此之前不能再次发动〖据险〗。然后若你的手牌数不小于体力上限，则伤害来源弃置一张牌。",
  ns_huangwudie: "黄舞蝶",
  nsdiewu: "蝶舞",
  nsdiewu_info: "当你获得两张或更多的牌后/受到伤害后，你获得一个“蝶舞”标记；你可移去一枚“蝶舞”标记，然后视为使用一张【杀】或【闪】。当你以此法使用【杀】造成伤害后，则你摸一张牌。",
  nslingying: "灵影",
  nslingying_info: "锁定技，你使用【杀】无距离限制，且你使用【杀】的次数上限+1。",
  nspojian: "破茧",
  nspojian_info: '觉醒技，准备阶段，若你的"蝶舞"标记的数量不小于你的体力值，则你减1点体力上限并摸两张牌，删除〖蝶舞〗中使用【闪】的部分并获得技能〖烈弓〗。',
  ns_sunyi: "孙翊",
  nsguolie: "果烈",
  nsguolie2: "果烈",
  nsguolie_info: "摸牌阶段开始前，你可跳过此阶段。若如此做，你的红色牌均视为【杀】，黑色牌均视为【过河拆桥】且均无视距离与次数直到回合结束，且结束阶段，你获得本回合从你以外的区域内进入弃牌堆的所有牌。",
  ns_zhangning: "张宁",
  nsfuzhou: "符咒",
  nsfuzhou_card: "符咒",
  nsfuzhou_card_info: "此牌不可被【无懈可击】响应。若判定结果为：黑色，你受到使用者造成的1点雷属性伤害且弃置一张牌；红色，使用者摸两张牌，且你本回合的手牌上限-1。",
  nsfuzhou_num: "符咒",
  nsfuzhou_info: "出牌阶段限一次。你可以将一张黑色牌置于一名角色的判定区内，称为“符”。其于判定阶段进行“符”判定，若判定结果为：黑色，其受到1点雷属性伤害并弃置一张牌；红色，你摸两张牌，且该角色本回合手牌上限减1。",
  nsguidao: "鬼道",
  nsguidao_info: "一名角色的判定牌生效前，你可以打出一张黑色牌替换之。",
  nstaiping: "太平",
  nstaiping_info: "觉醒技。准备阶段，若你：已因〖符咒〗造成了两次或更多的伤害，则你将〖鬼道〗中的“黑色牌”修改为“牌”，将〖符咒〗修改为〖符咒·邪〗；若你已因〖符咒〗摸了两次或更多的牌，则你将〖鬼道〗中的“黑色牌”修改为“牌”，将〖符咒〗修改为〖符咒·正〗。",
  nsfuzhou_damage: "符咒·邪",
  nsfuzhou_damage_info: "出牌阶段限两次。你可以将一张黑色牌置于一名角色的判定区内，称为“符”。其于判定阶段进行“符”判定，若判定结果为：黑色，其受到1点雷属性伤害并弃置一张牌；红色，你摸两张牌，且该角色本回合手牌上限-1。",
  nsfuzhou_draw: "符咒·正",
  nsfuzhou_draw_info: "出牌阶段限两次。你可以将一张黑色牌置于一名角色的判定区内，称为“符”。其于判定阶段进行“符”判定，若判定结果为：黑色，其受到1点雷属性伤害并弃置一张牌；红色，你摸两张牌，该角色回复1点体力并摸一张牌，且本回合的手牌上限+1。",
  ns_yanghu: "羊祜",
  nsbizhao: "避召",
  nsbizhao_info: "隐匿技，锁定技，当你于回合外明置此武将牌后，其他角色计算与你的距离+1直至你的回合开始。",
  nsqingde: "清德",
  nsqingde_info: "每回合限一次，当你使用【杀】或普通锦囊牌对其他角色造成伤害后，你可使用该牌与受到伤害的角色拼点。你可令输的角色摸两张牌；当你受到其他角色使用【杀】或普通锦囊牌造成的伤害后，可使用该牌与伤害来源拼点。你可令赢的角色回复1点体力。",
  nsyidi: "遗敌",
  nsyidi_info: "出牌阶段限一次，你可展示一张手牌，然后将其交给一名其他角色。若为基本牌，该角色可使用此牌；若不为基本牌，你摸一张牌。",
  diy_wenyang: "文鸯",
  ns_zhangwei: "张葳",
  nshuaishuang: "怀霜",
  nshuaishuang_info: "锁定技，结束阶段，你从牌堆/弃牌堆获得一张【桃】，然后失去1点体力。",
  nsfengli: "奉礼",
  nsfengli2: "奉礼",
  nsfengli_draw: "奉礼",
  nsfengli_clear: "奉礼",
  nsfengli_use: "奉礼",
  visible_nsfengli: "奉礼",
  nsfengli_info: "回合结束时，你可以选择一名其他角色并展示所有手牌直到你的下回合开始。当该角色于回合外需要使用或打出牌时，其可暗置你的一张明置手牌，然后视为使用或打出之。当你的明置手牌减少时，你可令一名手牌数小于你的角色摸一张牌。",
  nsqiyue: "骑钺",
  nsqiyue_info: "锁定技，当有角色的武将牌状态改变后，你摸一张牌。",
  nsxuezhu: "血逐",
  nsxuezhu_info: "当你受到伤害或造成伤害后，你可以令受到伤害的角色摸两张牌并翻面。",
  ns_chuanshu: "传术",
  ns_chuanshu_info: "<span class=yellowtext>限定技</span> 当一名其他角色进入濒死状态时，你可以令其选择获得技能〖雷击〗或〖鬼道〗，其回复体力至1并摸两张牌。当该被【传术】的角色造成或受到一次伤害后，你摸一张牌。其阵亡后，你重置技能〖传术〗。",
  ns_xiandao: "仙道",
  ns_xiandao_info: "<font color=#f00>锁定技</font> 游戏开始、你进入游戏时和回合结束阶段，你随机获得技能〖雷击〗或〖鬼道〗，直到下个出牌阶段阶段开始。你防止受到任何属性伤害。",
  ns_xiuzheng: "修真",
  ns_xiuzheng_info: "出牌阶段限一次，你可选择一名其他角色，然后亮出牌堆顶的两张牌，若同为红色，则其受到1点火焰伤害；若同为黑色，其受到1点雷电伤害；若颜色不相同，你弃置其一张牌。然后你获得这两张展示的牌后再弃置两张牌。",
  nsanruo: "暗弱",
  nsanruo_info: "锁定技，你手牌中的【杀】和普通锦囊牌(借刀杀人等带有指向目标的锦囊除外)均对你不可见。但你可以正常使用之。",
  nsxunshan: "循善",
  nsxunshan_info: "锁定技，你使用【暗弱】牌可以为其指定任意名合法目标（托管无效）。",
  nskaicheng: "开城",
  nskaicheng_info: "主公技，你的回合内，你可以将一张【暗弱】牌交给一名群势力其他角色观看，其可以选择是否告诉你此牌的名字。然后你选择一项：使用这张牌并摸一张牌；或结束此回合。",
  nsjuanli: "狷戾",
  nsjuanli_info: "出牌阶段限一次，你可以和一名有手牌的其他角色进行赌牌，若你赢，目标角色失去1点体力且该角色与你距离-1直到与你下次赌牌，若你没赢，目标角色回复1点体力，且该角色与你距离+1直到与你的下次赌牌。（赌牌:赌牌的两名角色分别亮开一张手牌，若花色相同则赌牌平局，若花色不同，则依次亮出牌堆顶的牌直到翻开的牌与其中一人亮出牌的花色相同，则该角色获得赌牌的胜利）",
  nsyuanchou: "远筹",
  nsyuanchou_info: "锁定技，当你成为锦囊牌的目标时，若来源角色与你的距离大于1，则取消之。",
  nsguhuo: "蛊惑",
  nsguhuo_info: "锁定技，你在一个回合中使用前两张牌时，你对一名随机角色从牌堆(牌堆无则从弃牌堆)随机使用一张同类别卡牌。",
  nsqinxue: "勤学",
  nsqinxue_info: "每个效果每回合只能使用一次。①当你使用一张基本牌时，你从牌堆随机获得一张锦囊牌；②当你使用一张锦囊牌时，你从牌堆随机获得一张装备牌；③当你使用一张装备牌时，你从牌堆随机获得一张基本牌。",
  nsbaiyi: "白衣",
  nsbaiyi_info: "锁定技，若你本回合发动过〖勤学〗，你跳过弃牌阶段，改为弃置X张牌（X为本回合发动〖勤学〗的次数）；若你弃置了三张类别不同的牌，你获得一个额外回合（不可连续获得回合），否则你观看牌堆顶的X张牌并获得其中一张。",
  nsbaiming: "百鸣",
  nsbaiming_info: "当你使用【杀】时，你可以获得一项未获得过且与杀或伤害相关的技能，此【杀】结算完毕后，你失去以此法获得的技能。",
  nsfuge: "覆戈",
  nsfuge_info: "你的回合结束后，你可以执行一个额外的回合，此回合的摸牌阶段，你于摸牌阶段额外摸X张牌（X为你已损失的体力值）；若如此做，直到洗牌前，你不能再发动此技能。",
  nstanbing: "谈兵",
  nstanbing_info: "摸牌阶段开始时，你可弃置一张手牌，然后摸X张牌(X为你弃置牌的名称字数)，若如此做，本回合你不可使用或打出【杀】。",
  nsxinzhan: "心战",
  nsxinzhan_info: "出牌阶段限一次，你可将任意张手牌交给一名其他角色，若如此做，该角色失去X点体力(X为你交给其的牌张数的一半，向下取整)，若你给的牌达到六张，则改为该角色失去1点体力上限。",
  nsfuhuo: "符火",
  nsfuhuo2: "符火",
  nsfuhuo_info: "出牌阶段限一次，你可将一张手牌置于一名武将牌上没有“符”的角色的武将牌上，称为“符”，若如此做，其回合外使用或打出【闪】时，你可令其判定，若结果为：红桃，你对其造成2点火焰伤害；方块，你弃置其一张手牌，然后对其造成1点火焰伤害。你的下个回合开始时，你获得其武将牌上的“符”。",
  nswangfeng: "望风",
  nswangfeng_info: "在判定牌生效前，你可以打出一张红色牌替换之。",
  nshunji: "混击",
  nshunji_info: "出牌阶段限一次，你可以摸一张牌，视为使用一张【万箭齐发】。此【万箭齐发】造成伤害时，受伤害角色选择一项：①弃置你一张牌；②摸一张牌。",
  nscuanquan: "篡权",
  nscuanquan_info: "锁定技，如果你的身份为忠臣，则在受伤三次后与主公，互换身份和体力上限。",
  nsjianning: "奸佞",
  nsjianning_info: "出牌阶段限一次，如果你的身份为内奸，你可以与一名手牌数比你少的角色交换手牌，并对其造成1点伤害。",
  nschangshi: "常仕",
  nschangshi_info: "出牌阶段限一次，如果你的身份为反贼，你可以指定两名其他角色互换体力；如果两名角色体力之差等于1，你失去1点体力。",
  nsbaquan: "霸权",
  nsbaquan_info: "回合结束时，你可以弃置所有手牌，并获得相应点数的护甲，你的新一回合开始时清除所有护甲。",
  nsbugua: "卜卦",
  nsbugua_use_info: "弃置一张牌，并将牌堆顶的六张牌反面朝上逐张按先后顺序排放，然后抛骰子，展示牌序号与骰子显示的点数一致的牌，然后你根据这张牌的花色、点数随机获得牌堆中相应的一张牌。",
  nsbugua_info: "出牌阶段限一次，你可以弃置一张牌，并将牌堆顶的六张牌反面朝上逐张按先后顺序排放，然后抛骰子，展示牌序号与骰子显示的点数一致的牌，然后你根据这张牌的花色、点数按以下规则随机获得牌堆中相应的一张牌：乾（红桃偶数）：无中生有；坤（黑桃奇数）：决斗；震（黑桃偶数）：南蛮入侵；巽（红桃奇数）：万箭齐发；坎（梅花偶数）：过河拆桥、兑（梅花奇数）：借刀杀人、艮（方片偶数）：顺手牵羊、离（方片奇数）：火攻。若牌堆中无此牌则摸一张牌，然后你观看未展示的另外五张牌并按任意顺序将其置于牌堆顶。",
  nstuiyan: "推演",
  nstuiyan_info: "出牌阶段，若你使用的牌点数比上一张使用的牌点数大，你可以摸一张牌，反之你本回合不能再以此法摸牌；当你使用的牌点数首次达到8的倍数时，你可以在结算后立即发动一次【卜卦】。",
  nstianji: "天机",
  nstianji_info: "限定技，当一名其他角色进入濒死状态，你可自减1点体力上限，令其回复体力至1并增加1点体力上限。",
  nszhaoxin: "昭心",
  nszhaoxin_info: "锁定技，你始终展示手牌。",
  nsxiuxin: "修穆",
  nsxiuxin_info: "锁定技，若你没有某种花色的手牌，你不能成为这种花色的牌的目标。",
  nsshijun: "弑君",
  nsshijun_info: "锁定技，你造成伤害时，你令此伤害+1，并在结算后失去1点体力。",
  nshunyou: "魂佑",
  nshunyou_info: "出牌阶段限一次，你可以弃置一张基本牌，获得弃牌堆底的一张装备牌和一张锦囊牌，然后你可以将那张装备牌装备给一名角色（允许替换）。如果弃牌堆没有装备以及锦囊牌，则改为摸X张牌，X为你已损失的体力值+1（至多三张）。",
  nswulie: "武烈",
  nswulie_info: "限定技，准备阶段，你可以失去1点体力上限，从弃牌堆选择最多三张牌以任意顺序放置于牌堆顶。若如此做，此回合的结束阶段，你可以重复此操作。",
  nscangxi: "藏玺",
  nscangxi2: "藏玺",
  nscangxi_info: "主公技，其他吴势力角色的弃牌阶段结束时，若其弃置了至少两张牌，则可以选择判定，若是黑色，则其选择一项，1，令主公摸一张并且展示；2，主公手牌上限永久加一；3，额外弃置一张牌，令主公获得本回合进入弃牌堆的一张牌。",
  nsdongcha: "洞察",
  nsdongcha_info: "锁定技，单体锦囊牌无法对你造成伤害。其它角色于其回合内第二次使用锦囊牌指定你为目标时，取消之。",
  nscaijian: "才鉴",
  nscaijian_info: "出牌阶段限一次，若你的手牌数不大于你的体力上限，则你可以展示你的手牌，观看牌堆顶相同数量的牌并以任意方式交换之。",
  nsgongjian: "恭俭",
  nsgongjian_info: "锁定技，弃牌阶段，你须将弃牌交给一名体力值大于你的其它角色。",
  nsjianxiong: "奸雄",
  nsjianxiong_info: "当你成为一名角色牌的目标后你可以对该角色使用一张牌，若此牌对其造成伤害，则该角色的牌失效。若失效的为黑色牌，则你摸一张牌。",
  nsxionglue: "雄略",
  nsxionglue_info: "出牌阶段限一次，你可以弃置一张黑色手牌，然后发现一张锦囊牌。",
  nsyaowang: "妖妄",
  nsyaowang_info: "回合开始时，你可以选择一名其他角色然后获得其一个技能直到回合结束，然后该角色随机获得一项未上场武将的一个技能直到其回合结束。",
  nshuanhuo: "幻惑",
  nshuanhuo_info: "每当你失去1点体力或受到一次大于2的伤害时，你可以交换除你之外的两名角色的武将牌（体力及体力上限不变）。",
  nsjianshu: "剑术",
  nsjianshu_info: "锁定技：每当你的装备区有武器时，你使用【杀】指定一个目标后，该角色需要依次使用两张【闪】才能抵消此【杀】。",
  nscangjian: "藏剑",
  nscangjian_info: "每当你对一名角色造成伤害，你可以获得其装备区一张牌。",
  nsyunxing: "陨星",
  nsyunxing_info: "锁定技，当场上一名角色死亡，若为蜀，你失去1点体力；若为吴，你回复1点体力；若为魏，你摸一张牌并弃置一名角色的手牌；若为群，你强制结束当前回合；若为你，你可以使一名角色翻面。",
  nsguanxing: "观星",
  nsguanxing_info: "锁定技，准备阶段，你观看牌堆的X张牌(X为场上存活人数)并且任意移动Y张牌(Y为你当前体力值)。",
  nscaiyi: "猜疑",
  nscaiyi_info: "其他角色摸牌后，你可以观看其摸到的牌，若其中有【杀】，则视为你对其使用一张【杀】，若其中没有【杀】，则视为其对你使用一张【杀】（计入出杀次数）。",
  nsgefa: "割发",
  nsgefa_info: "当你的体力值等于0或更低时，你可以将任意一张♣牌当【桃】使用。",
  nshaoling: "号令",
  nshaoling_info: "限定技，出牌阶段，你可以指定一名其他角色，令除其外所有其他角色选择一项：1、对该角色使用一张【杀】；2、交给你一张牌，然后视为你对其使用一张【杀】。",
  nspinmin: "拼命",
  nspinmin_info: "锁定技，当你于回合内死亡时，你不死亡并增加1点体力上限（每回合最多增加1点且不能超过4）；当你于回合外死亡时，你不死亡并减少1点体力上限（体力上限为0会导致你死亡）。",
  nsshishou: "失手",
  nsshishou_info: "锁定技，当你于回合内失去手牌时，你失去1点体力并摸一张牌；你回合内使用的牌数不能超过4。",
  nsduijue: "对决",
  nsduijue_info: "出牌阶段开始时，你可以弃置一张手牌，若如此做，此阶段你可以将一张与此牌颜色不同的手牌当作【决斗】使用（限2次）。",
  nsshuangxiong: "双雄",
  nsshuangxiong_info: "当你使用【决斗】或被使用【决斗】时，你可以将武将牌翻面。",
  nsshuangxiong_append: "背面武将：文丑，2体力，你可以将一张牌当【杀】打出。",
  nsguanyong: "冠勇",
  nsguanyong_info: "你可以将一张手牌当【杀】打出。",
  nsjihui: "急恚",
  nsjihui_info: "锁定技，每当一名角色一次弃置了三张或更多的牌，你获得一个额外回合；你的额外回合内，你使用牌只能指定你与上一回合角色为目标。",
  nsmouyun: "谋运",
  nsmouyun_info: "每两轮限一次，你可以弃置场上体力值最少的一名其他角色区域内的X张牌。（X为其损失的体力值）",
  nscongjun: "从军",
  nscongjun_info: "锁定技，游戏开始时，你变身为一名随机男性角色；当一名敌方角色使用无懈可击时，你有小概率亮出此武将并变回花木兰，然后对该角色造成2点伤害。",
  nshuanxian: "幻仙",
  nshuanxian_info: "锁定技，游戏开始时，你获得随从“幻身·右”，当你首次受到伤害时，你获得随从“幻身·左”（体力上限2，初始手牌2）；你与幻身在摸牌阶段均少摸一张牌；在你的回合中（如果有对应幻身），你以【幻身·左-本体-幻身·右】的顺序进行3个连续回合。",
  nstaiping_nh: "太平",
  nstaiping_nh_info: "当你受到1点伤害后（首次伤害除外），你可以选择一项: ①令一个“幻身”增加1点体力上限。②令一个“幻身”回复1点体力。",
  nsshoudao: "授道",
  nsshoudao_info: "当左右“幻身”全部死亡时，你获得技能“雷击”和“鬼道”。当你死亡时，若此时有两个“幻身”，你可以令一名其他角色获得技能“雷击”和“鬼道”。若有一个“幻身”，你可以令一名其他角色获得技能“雷击”或“鬼道”。(杀死你的角色除外)",
  nsnongquan: "弄权",
  nsnongquan_info: "出牌阶段，你可以将最后一张手牌当作【无中生有】使用。",
  nsdufu: "毒妇",
  nsdufu_info: "每当你即将造成一次伤害时，你可以为此伤害重新指定伤害来源。",
  yiesheng: "回雪",
  yiesheng_info: "出牌阶段，你可以弃置任意数量的黑色手牌，然后摸等量的牌。",
  liangji: "环计",
  liangji_info: "出牌阶段限一次，你可以选择一名未以此法放置牌的其他角色并将一张手牌置于其武将牌上。目标角色于摸牌阶段开始时，获得此牌。若其为男性角色，则获得技能〖无双〗，若其为女性角色，则获得技能〖离间〗，直到回合结束。",
  chengmou: "逞谋",
  chengmou_info: "摸牌阶段开始时，若你有“功”牌，你获得之并跳过摸牌阶段，若你所获得的“功”牌多于两张，你须失去1点体力。",
  jugong: "居功",
  jugong_info: "回合外每名角色的回合限一次，每当场上有角色因受到【杀】或【决斗】造成的伤害，你可以摸一张牌并且将一张手牌置于你的武将牌上，称之为“功”。在你即将受到伤害时，你可以弃置两张“功”，防止此伤害。",
  nsxinsheng: "新生",
  nsxinsheng_info: "每当你对其他角色造成伤害后，若你未受伤，则你可以增加X点体力上限并摸X张牌，X为伤害点数。",
  nsdunxing: "遁形",
  nsdunxing_info: "每当你即将受到其他角色造成的伤害时，若你已受伤，则你可以防止此伤害，改为失去X点体力上限并摸X张牌，X为伤害点数。",
  ns_zanghong: "臧洪",
  nsshimeng: "誓盟",
  nsshimeng_info: "出牌阶段限一次，你可以选择任意名角色。这些角色依次选择一项：⒈摸一张牌。⒉使用一张【杀】。然后若选择前者角色数大于选择后者的角色数，则你获得1点护甲并失去1点体力。",
  ns_ruanji: "阮籍",
  nsshizui: "酾醉",
  nsshizui_info: "每回合限一次。当你成为基本牌或普通锦囊牌的目标后，你可以弃置一张牌，然后视为使用一张【酒】。若你弃置的牌与其使用的牌花色相同，则此牌对你无效；若你弃置的牌为♣，则你获得其使用的牌。",
  nsxiaoye: "啸野",
  nsxiaoye_info: "一名角色的结束阶段开始时，若你于当前回合内使用过【酒】，则你可以视为使用一张其于本回合内使用过的【杀】或普通锦囊牌。",
  ns_limi: "李密",
  nstuilun: "退论",
  nstuilun_info: "结束阶段，你可以失去任意点体力（至多失去至1点）并弃置任意张手牌（至多弃置至一张）。若如此做，你获得如下效果直到你下回合开始：其他角色的回合开始时，若你的体力值小于该角色，则你可以令一名角色回复或失去1点体力；若你的手牌数小于该角色，则你可以令一名角色摸一张牌或弃置一张牌。",
  ns_zhonglimu: "钟离牧",
  nskuanhuai: "宽怀",
  nskuanhuai_info: "出牌阶段开始时，你可以从弃牌堆中获得一张非基本牌。若如此做：你本阶段内不能使用基本牌，且本回合的弃牌阶段结束时，你可以依次使用本阶段内弃置的基本牌。",
  nsdingbian: "定边",
  nsdingbian_info: "锁定技。当你于回合内使用锦囊牌或装备牌后，你令自己本回合的手牌上限-1且选择一项：⒈从牌堆获得一张基本牌。⒉令一种基本牌于本回合内不计入手牌上限。",
  prp_zhugeliang_ab: "诸葛亮",
  prp_zhugeliang: "派对浪客",
  nsxingyun: "星陨",
  nsxingyun_info: "每回合限一次。你可以将一张手牌当做任意一张符合“四象天阵”的牌使用。然后若这两张牌的类型不同，则你删除此“四象天阵”并摸两张牌。当你删除“四象天阵”中的最后一个项目后，你获得技能〖八阵〗。",
  nsxingyun_faq: "四象天阵",
  nsxingyun_faq_info: "青龙：无标签普通锦囊牌<br>朱雀：延时锦囊牌<br>白虎：伤害类卡牌<br>玄武：【闪】/回复类卡牌",
  nshanlang: "酣浪",
  nshanlang_info: "准备阶段，你可以和至多三名角色拼点。然后若这些角色中有拼点牌唯一最大的角色，则你可以令该角色从牌堆中获得一张不符合“四象天阵”的牌。",
  junktaoluan: "滔乱",
  junktaoluan_backup: "滔乱",
  junktaoluan_info: "你可将一张牌当做任意一张基本牌或普通锦囊牌使用（此牌不得是本局游戏你以此法使用过的牌，且每回合每种花色限一次），然后你令一名其他角色选择一项：1.交给你一张与“滔乱”声明的牌类别不同的牌；2.本回合“滔乱”失效且回合结束时你失去1点体力。",
  ns_caimao: "蔡瑁",
  nsdingzhou: "定州",
  nsdingzhou_info: "出牌阶段限一次，你可以选择一名区域内有牌的其他角色。你随机获得其区域内的一张牌，然后摸一张牌。若你以此法获得了两张颜色不同的牌，则你失去1点体力。",
  junkyuheng: "驭衡",
  junkyuheng_info: '锁定技。①回合开始时，你须弃置任意张花色不同的牌，从<span style="font-family: yuanli">东吴命运线·改</span>中随机获得等量的技能。②回合结束时，你失去所有因〖驭衡①〗获得的技能，然后摸等量的牌。',
  junkdili: "帝力",
  junkdili_info: `觉醒技。当你获得技能后，若你拥有的技能数大于你的体力上限，则你减1点体力上限，选择失去任意个其他技能，然后获得以下技能中的前等量个：${get.poptip("junkshengzhi")}${get.poptip("junkquandao")}${get.poptip("junkchigang")}。`,
  junkshengzhi: "圣质",
  junkshengzhi_info: "锁定技。当你发动非锁定技后，你令你本回合使用的下一张牌无距离和次数限制。",
  junkquandao: "权道",
  junkquandao_info: "锁定技。当你使用【杀】或普通锦囊牌时，{若你手牌中的【杀】或普通锦囊牌的数量之差X不为0，则你弃置X张数量较多的一种牌}，然后你摸一张牌。",
  junkchigang: "持纲",
  junkchigang_info: "转换技，锁定技。判定阶段开始前，你取消此阶段。然后你获得一个额外的：阴，摸牌阶段；阳，出牌阶段。",
  junkrende: "仁德",
  junkrende_info: "出牌阶段限一次，你可以将任意张手牌交给其他角色。若你给出的牌多于一张，则你回复1点体力。",
  junkjizhi: "集智",
  junkjizhi_info: "当你使用非转化的普通锦囊牌时，你可以亮出牌堆顶的一张牌A。若A不为基本牌，则你获得A。否则你选择一项：⒈将A置入弃牌堆。⒉将一张手牌置于牌堆顶，然后获得A。",
  junkqicai: "奇才",
  junkqicai_info: "锁定技。①你使用锦囊牌无距离限制。②你装备区内的非坐骑牌不能被其他角色弃置。",
  junkwangxi: "忘隙",
  junkwangxi_info: "当你对其他角色造成1点伤害后，或受到其他角色造成的1点伤害后，你可以摸两张牌，然后交给其其中一张牌。",
  junklangmie: "狼灭",
  junklangmie_info: "其他角色的结束阶段开始时，你可以选择一项：⒈若其本回合内使用过某种类型的牌超过一张，则你弃置一张牌并摸两张牌。⒉若其本回合累计造成过的伤害大于1，则你弃置一张牌，然后对其造成1点伤害。",
  junkshicai: "恃才",
  junkshicai_info: "当你使用牌结算完毕后，若此牌与你本回合使用的牌类型均不同，则你可以将此牌置于牌堆顶，然后摸一张牌。",
  junk_zhangrang: "新杀张让",
  junk_zhangrang_prefix: "新杀",
  old_bulianshi: "RE步练师",
  old_bulianshi_prefix: "RE",
  ol_maliang: "OL马良",
  ol_maliang_prefix: "OL",
  junk_lidian: "OL李典",
  junk_lidian_prefix: "OL",
  junk_duanwei: "牢段煨",
  junk_duanwei_prefix: "牢",
  junk_xuyou: "手杀许攸",
  junk_xuyou_prefix: "手杀",
  junk_liubei: "旧界刘备",
  junk_liubei_prefix: "旧界",
  junk_huangyueying: "旧界黄月英",
  junk_huangyueying_prefix: "旧界",
  ns_mengyou: "数学孟优",
  ns_mengyou_prefix: "数学",
  ns_mengyou_ab: "孟优",
  nsmanzhi: "蛮智",
  nsmanzhi_info: "准备阶段或结束阶段开始时，你可以将场上出现的数字代入等式中的A和B。若此等式成立，你摸Y张牌。（等式为Y=0.5A<sup>2</sup>+2.5B-X，其中X为游戏轮数，Y为存活人数）",
  ns_chengpu: "铁索程普",
  ns_chengpu_prefix: "铁索",
  ns_chengpu_ab: "程普",
  ns_sundeng: "画饼孙登",
  ns_sundeng_prefix: "画饼",
  ns_sundeng_ab: "孙登",
  ns_duji: "画饼杜畿",
  ns_duji_prefix: "画饼",
  ns_duji_ab: "杜畿",
  junksijun: "肆军",
  junksijun_info: "准备阶段，若“黄”数大于牌堆的牌数，你可以移去所有“黄”，然后从牌堆中随机获得任意张点数之和为36的牌（若牌堆没有点数和为36的组合则获得牌堆顶点数和刚好超过36的牌组）。",
  junk_guanyu: "旧谋关羽",
  junk_guanyu_prefix: "旧谋",
  junk_liuyan: "OL刘焉",
  junk_liuyan_prefix: "OL",
  ns_shijian: "诗笺",
  nspianwu: "翩舞",
  nspianwu_info: "<font color=red>特殊效果：你的技能不会失效或失去。</font><br>锁定技，你于以下时机创建一个随机的触发技能：游戏开始后；当你受到伤害后；当你造成伤害时（三轮内）；你的回合结束时。然后你令一名角色获得此技能。以此法创建的技能每回合限发动五次。"
};
const characterIntro = {
  huan_noname: "小无全新版本正式登场！<br>感谢大家的共同创作，共同发展，为大家带来多姿多彩的无名杀！<br>特别鸣谢：<br>代码：星语<br>原画，整合：空酱<br>小无形象及技能设计：李玉品(李木子)",
  noname: "无名杀的吉祥物。<br>画师：空城<br>技能设计：李木子",
  ns_zhangwei: "血骑教习·张葳，三国杀集换式卡牌游戏《阵面对决》中的帝畿系列卡牌。游卡桌游官方原创的三国时期女性角色。",
  chentai: "陈泰（200年～260年），字玄伯，颍川许昌（今河南省许昌市）人。三国时期魏国名将，司空陈群之子。陈泰早年起家员外散骑侍郎，其父陈群死后袭封颍阴侯，历任游击将军、并州、雍州刺史、尚书等职，高平陵政变发生时，陈泰力劝大将军曹爽投降，因此得到掌权的司马氏信任，此后为了回避朝廷的争斗，陈泰主动请求外调雍州任职，任内成功防御蜀将姜维的多次进攻。甘露元年（256年），陈泰被调回朝中任尚书右仆射，曾随司马昭两度抵抗东吴的进攻，后改任左仆射。甘露五年（260年），魏帝曹髦被弑杀，陈泰闻讯后悲痛过度，呕血而死，享年六十一岁。追赠司空，赐谥为穆。",
  huangwudie: "黄舞蝶是在现代三国作品中出场的虚拟人物，设定为蜀汉大将黄忠之女，跟随父亲一同投效刘备，在游戏中是一名不错的女将。",
  sunyi: "孙翊（184年～204年），又名孙俨，字叔弼，是孙坚的第三子，孙策、孙权的弟弟。曾被大臣推荐为继承者。孙权继位后，孙翊任丹杨太守，后被身边的人边鸿刺杀。",
  zhangning: "《三国杀·阵面对决》中登场的角色。张角之女，能呼雷掣电。",
  yanghu: "羊祜（221年－278年12月27日），字叔子，泰山郡南城县人。西晋时期杰出的战略家、政治家、文学家，曹魏上党太守羊衜的儿子，名儒蔡邕的女儿蔡文姬的外甥。出身“泰山羊氏”，博学能文，清廉正直。曹魏时期，接受公车征辟，出任中书郎，迁给事黄门侍郎。姐姐嫁给大将军司马师，投靠司马氏家族，仕途平步青云。魏元帝曹奂即位，出任秘书监、相国从事中郎、中领军，统领御林军，兼管内外政事，册封钜平县子，迁。西晋建立后，迁中军将军、散骑常侍、郎中令，册封钜平侯。泰始五年（269年），出任车骑将军、荆州都督，加任开府仪同三司坐镇襄阳，屯田兴学，以德怀柔，深得军民之心；扩充军备，训练士兵，全力准备灭亡孙吴，累迁征南大将军，册封南城侯。咸宁四年，去世，临终前举荐杜预接任职务，获赠侍中、太傅，谥号为“成”。唐宋时期，配享武庙。",
  ns_wangyue: "王越，东汉末年游侠（生卒年不详），乃辽东燕山人士，擅使剑术， 三国时期史阿的师父，曹丕的师公，官职虎贲将军。在史书《典论》中略有记载。"
};
const characterTitles = {
  ns_huangchengyan: "#g竹邀月",
  ns_sunchensunjun: "#gVenusjeu",
  ns_yuanxi: "#g食茸二十四",
  ns_caoshuang: "#g荬庀芬兰",
  ns_chentai: "#g荀彧III荀文若",
  ns_huangwudie: "#g你爸爸来了164",
  ns_sunyi: "#g无民氏4251",
  ns_zhangning: "#g如颍隋行1314",
  ns_yanghu: "#ginCenv",
  ns_ruanji: "#g伯约的崛起",
  ns_zanghong: "#g阿七",
  ns_limi: "#g-心若困兽-",
  ns_zhonglimu: "#gJG赛文♠7",
  prp_zhugeliang: "#g阿开木木W🍀",
  ns_luyusheng: "#g猫咪大院 - 魚と水",
  ns_caimao: "#gP尔号玩家◆",
  diy_wenyang: "#g最粗的梦想XD",
  ns_zuoci: "#bskystarwuwei",
  ns_lvzhi: "#bskystarwuwei",
  ns_wangyun: "#rSukincen",
  ns_guanlu: "#rSukincen",
  ns_xinnanhua: "#rSukincen",
  ns_nanhua: "#g戒除联盟",
  ns_shenpei: "#g戒除联盟",
  ns_huamulan: "#p哎别管我是谁",
  ns_jinke: "#p哎别管我是谁",
  ns_huangzu: "#r小芯儿童鞋",
  ns_yanliang: "#r丶橙续缘",
  ns_wenchou: "#r丶橙续缘",
  ns_caocao: "#r一瞬间丶遗忘",
  ns_caocaosp: "#g希望教主",
  ns_zhugeliang: "#p死不死什么的",
  ns_xinxianying: "#b扶苏公子",
  ns_zhangbao: "#b扶苏公子",
  ns_wangyue: "#p废城君",
  ns_sunjian: "#b兔子两只2",
  ns_lvmeng: "#b兔子两只2",
  ns_yujisp: "#b兔子两只2",
  ns_yuji: "#g蔚屿凉音",
  ns_simazhao: "#r一纸载春秋",
  ns_duangui: "#b宝宝酱紫萌萌哒",
  ns_masu: "#g修女",
  ns_zhangxiu: "#p本因坊神策",
  ns_yangyi: "#p本因坊神策",
  ns_liuzhang: "#r矮子剑薄荷糖",
  ns_mengyou: "#g残昼厄夜"
  //diy_wu_lvmeng: "#g假的别信",
};
const characterFilters = {
  ns_duangui(mode) {
    return mode === "identity" && _status.mode === "normal";
  }
};
const dynamicTranslates = {
  nsjiquan(player2) {
    if (player2.storage.nsfuwei) {
      return "锁定技，与你距离1以内的其他角色造成或受到伤害后，你将其区域内的一张牌置于你的武将牌上（称为“威”）。你使用【杀】的次数上限+X（X为“威”数）。";
    }
    return "与你距离1以内的其他角色造成或受到伤害后，你可以将其区域内的一张牌置于你的武将牌上（称为“威”）。你使用【杀】的次数上限+X（X为“威”数）。";
  },
  abyusa_jueqing(player2) {
    if (player2.storage.abyusa_jueqing_rewrite) {
      return "锁定技，你即将造成的伤害均视为失去体力。";
    }
    return "当你对其他角色造成伤害时，你可以令此伤害值+X。若如此做，你失去X点体力，并于此伤害结算完成后修改〖绝情〗（X为伤害值）。";
  },
  tomoya_shangxian(player2) {
    if (player2.storage.tomoya_shangxian) {
      return "锁定技，你计算与其他角色的距离时始终从顺时针方向计算。出牌阶段开始时，你可摸一张牌，并改变此方向。";
    }
    return "锁定技，你计算与其他角色的距离时始终从逆时针方向计算。出牌阶段开始时，你可摸一张牌，并改变此方向。";
  },
  yui_lieyin(player2) {
    if (player2.storage._ichiban_no_takaramono) {
      return "锁定技，出牌阶段开始时，你可选择一项：①本阶段内的红色牌均视为【杀】；②本阶段内的【杀】均视为【决斗】。";
    }
    return "锁定技，出牌阶段开始时，你选择一项：①本阶段内的红色牌均视为【杀】；②本阶段内的【杀】均视为【决斗】。";
  },
  yuzuru_kunfen(player2) {
    if (player2.storage._yuzuru_sss) {
      return "锁定技，结束阶段，你摸两张牌。然后你可以将两张牌交给一名其他角色。";
    }
    return "锁定技，结束阶段，你失去1点体力并摸两张牌。然后你可以将两张牌交给一名其他角色。";
  },
  yuzuru_quji(player2) {
    if (player2.storage._yuzuru_sss) {
      return "出牌阶段限一次，你可以弃置X张牌并选择至多等量已受伤的其他角色，这些角色各回复1点体力。（X为你已损失的体力值）";
    }
    return "出牌阶段限一次，你可以弃置X张牌并选择至多等量已受伤的其他角色，这些角色各回复1点体力。若你以此法弃置了黑色牌，则你失去1点体力。（X为你已损失的体力值）";
  },
  kamome_jieban(player2) {
    if (player2.storage.kamome_jieban) {
      return '转换技。每回合限一次，当你受到或造成伤害后，阴：你可将两张牌交给一名其他角色，然后其交给你一张牌。<span class="bluetext">阳：你可将一张牌交给一名其他角色，然后其交给你两张牌。</span>';
    }
    return '转换技。每回合限一次，当你受到或造成伤害后，<span class="bluetext">阴：你可将两张牌交给一名其他角色，然后其交给你一张牌。</span>阳：你可将一张牌交给一名其他角色，然后其交给你两张牌。';
  },
  shiroha_guying(player2) {
    var str = "当你受到伤害/对其他角色造成伤害时，你";
    if (!player2.storage.shiroha_jiezhao) {
      str = "锁定技，每回合限一次，" + str;
    }
    if (player2.storage.shiroha_jiezhao) {
      str += "可";
    }
    str += "进行判定。若结果为红色/黑色，此伤害-1/+1。";
    return str;
  },
  nsdiewu(player2) {
    if (player2.storage.nspojian) {
      return "当你获得两张或更多的牌后/受到伤害后，你获得一个“蝶舞”标记；你可移去一枚“蝶舞”标记，然后视为使用一张【杀】。当你以此法使用【杀】造成伤害后，则你摸一张牌。";
    }
    return "当你获得两张或更多的牌后/受到伤害后，你获得一个“蝶舞”标记；你可移去一枚“蝶舞”标记，然后视为使用一张【杀】或【闪】。当你以此法使用【杀】造成伤害后，则你摸一张牌。";
  },
  nsfuzhou(player2) {
    var str = "出牌阶段限";
    str += player2.storage.nstaiping ? "两" : "一";
    str += "次。你可以将一张黑色牌置于一名角色的判定区内，称为“符”。其于判定阶段进行“符”判定，若判定结果为：黑色，其受到";
    str += player2.storage.nsfuzhou_damage ? "两" : "一";
    str += "点雷属性伤害并弃置一张牌；红色，你摸两张牌，";
    str += player2.storage.nsfuzhou_draw ? "该角色回复1点体力并摸一张牌，且本回合的手牌上限+1。" : "且该角色本回合手牌上限减1。";
    return str;
  },
  nsguidao(player2) {
    if (player2.storage.nstaiping) {
      return "一名角色的判定牌生效前，你可以打出一张牌替换之。";
    }
    return "一名角色的判定牌生效前，你可以打出一张黑色牌替换之。";
  },
  junkchigang(player2) {
    if (player2.storage.junkchigang) {
      return '转换技，锁定技。判定阶段开始前，你取消此阶段。然后你获得一个额外的：阴，摸牌阶段；<span class="bluetext">阳，出牌阶段。</span>';
    }
    return '转换技，锁定技。判定阶段开始前，你取消此阶段。然后你获得一个额外的：<span class="bluetext">阴，摸牌阶段</span>；阳，出牌阶段。';
  }
};
const perfectPairs = {};
const voices = {};
const characterSort = {
  diy_yijiang: ["ns_huangchengyan", "ns_sunchensunjun", "ns_yuanxi", "ns_caoshuang"],
  diy_yijiang2: ["ns_chentai", "ns_huangwudie", "ns_sunyi", "ns_zhangning", "ns_yanghu"],
  diy_yijiang3: ["ns_ruanji", "ns_zanghong", "ns_limi", "ns_zhonglimu", "prp_zhugeliang"],
  diy_tieba: ["ns_zuoci", "ns_lvzhi", "ns_wangyun", "ns_nanhua", "ns_nanhua_left", "ns_nanhua_right", "ns_huamulan", "ns_huangzu", "ns_jinke", "ns_yanliang", "ns_wenchou", "ns_caocao", "ns_caocaosp", "ns_zhugeliang", "ns_wangyue", "ns_yuji", "ns_xinxianying", "ns_guanlu", "ns_simazhao", "ns_sunjian", "ns_duangui", "ns_zhangbao", "ns_masu", "ns_zhangxiu", "ns_lvmeng", "ns_shenpei", "ns_yujisp", "ns_yangyi", "ns_liuzhang", "ns_xinnanhua", "ns_luyusheng"],
  diy_fakenews: ["diy_wenyang", "ns_zhangwei", "ns_caimao", "ns_chengpu", "ns_sundeng", "ns_duji", "ns_mengyou"],
  diy_noname: ["huan_noname", "noname", "ns_shijian"],
  diy_trashbin: ["junk_guanyu", "junk_zhangrang", "old_bulianshi", "ol_maliang", "junk_liubei", "junk_huangyueying", "junk_lidian", "junk_duanwei", "junk_xuyou", "junk_liuyan", "zhangren"]
};
const characterSortTranslate = {
  diy_tieba: "吧友设计",
  diy_noname: "无名专属",
  diy_key: "论外",
  diy_yijiang: "设计比赛2020",
  diy_yijiang2: "设计比赛2021",
  diy_yijiang3: "设计比赛2022",
  diy_fakenews: "杀海流言",
  diy_trashbin: "垃圾桶"
};
game.import("character", function() {
  if (lib.config.characters.includes("diy")) {
    lib.group.add("key");
  }
  return {
    name: "diy",
    connect: true,
    connectBanned: ["ns_huamulan", "ns_yuji", "ns_duangui", "ns_liuzhang", "key_yuu"],
    character: { ...characters },
    characterSort: {
      diy: characterSort
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
