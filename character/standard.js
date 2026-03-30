import { get, game, _status, ui, lib } from "noname";
const characters = {
  std_yuejin: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["stdxiaoguo"],
    dieAudios: ["yuejin"],
    img: "image/character/gz_yuejin.jpg"
  },
  old_re_lidian: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["xunxun", "wangxi"],
    dieAudios: ["lidian"]
  },
  ganfuren: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["stdshushen", "shenzhi"],
    names: "甘|null"
  },
  std_panfeng: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["stdkuangfu"],
    dieAudios: ["re_panfeng"]
  },
  caocao: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["jianxiong", "hujia"],
    isZhugong: true
  },
  simayi: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["fankui", "guicai"],
    names: "司马|懿"
  },
  xiahoudun: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["ganglie"],
    names: "夏侯|惇"
  },
  zhangliao: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["tuxi"]
  },
  xuzhu: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["luoyi"]
  },
  guojia: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["tiandu", "yiji"]
  },
  zhenji: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["luoshen", "qingguo"]
  },
  liubei: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["rende", "jijiang"],
    isZhugong: true
  },
  guanyu: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["wusheng"]
  },
  zhangfei: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["paoxiao"]
  },
  zhugeliang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["guanxing", "kongcheng"],
    names: "诸葛|亮"
  },
  zhaoyun: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["longdan"]
  },
  machao: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["mashu", "tieji"]
  },
  huangyueying: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["jizhi", "qicai"]
  },
  sunquan: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["zhiheng", "jiuyuan"],
    isZhugong: true
  },
  ganning: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["qixi"]
  },
  lvmeng: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["keji"]
  },
  huanggai: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["kurou"]
  },
  zhouyu: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["yingzi", "fanjian"]
  },
  daqiao: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["guose", "liuli"],
    names: "桥|null"
  },
  luxun: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["qianxun", "lianying"],
    clans: ["吴郡陆氏"]
  },
  sunshangxiang: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["xiaoji", "jieyin"]
  },
  huatuo: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["qingnang", "jijiu"]
  },
  lvbu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["wushuang"]
  },
  diaochan: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["lijian", "biyue"],
    names: "null|null"
  },
  huaxiong: {
    sex: "male",
    group: "qun",
    hp: 6,
    skills: ["yaowu"]
  },
  gongsunzan: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["reyicong"],
    names: "公孙|瓒"
  },
  xf_yiji: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["xinfu_jijie", "xinfu_jiyuan"]
  },
  re_yuanshu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["rewangzun", "retongji"]
  }
};
const cards = {};
const pinyins = {};
const skills = {
  //主公吕布
  stdqingjiao: {
    audio: 2,
    trigger: {
      player: "phaseJieshuBegin"
    },
    zhuSkill: true,
    filter(event, player) {
      return player.hasHistory("sourceDamage", (evt) => {
        return evt.player != player && evt.player?.group == "qun";
      });
    },
    forced: true,
    async content(event, trigger, player) {
      await player.draw();
    }
  },
  //标准版乐进
  stdxiaoguo: {
    audio: "xiaoguo",
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      return event.player.isIn() && event.player != player && player.countCards("h", (card) => {
        if (_status.connectMode) {
          return true;
        }
        return get.type(card) == "basic" && lib.filter.cardDiscardable(card, player);
      });
    },
    async cost(event, trigger, player) {
      const target = trigger.player;
      const next = player.chooseToDiscard(get.prompt(event.name.slice(0, -5)), (card, player2) => {
        return get.type(card) == "basic";
      });
      next.set("ai", (card) => {
        return get.event().eff - get.useful(card);
      });
      next.set(
        "eff",
        (function() {
          if (target.hasSkillTag("noe")) {
            return get.attitude(_status.event.player, target);
          }
          return get.damageEffect(target, player, _status.event.player);
        })()
      );
      next.set("logSkill", [event.name.slice(0, -5), target]);
      event.result = await next.forResult();
    },
    popup: false,
    async content(event, trigger, player) {
      const target = trigger.player;
      const { bool } = await target.chooseToDiscard("he", "弃置一张装备牌，或受到1点伤害", { type: "equip" }).set("ai", (card) => {
        if (get.event().damage > 0) {
          return 0;
        }
        if (get.event().noe) {
          return 12 - get.value(card);
        }
        return -get.event().damage - get.value(card);
      }).set("damage", get.damageEffect(target, player, target)).set("noe", target.hasSkillTag("noe")).forResult();
      if (!bool) {
        await target.damage();
      }
    }
  },
  //标准版甘夫人
  stdshushen: {
    audio: "shushen",
    trigger: { player: "recoverEnd" },
    getIndex(event) {
      return event.num || 1;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), lib.filter.notMe).set("ai", (target) => get.attitude(_status.event.player, target)).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await target.draw(target.countCards("h") > 0 ? 1 : 2);
    },
    ai: { threaten: 0.8, expose: 0.1 }
  },
  stdkuangfu: {
    audio: "xinkuangfu",
    trigger: { source: "damageSource" },
    forced: true,
    filter(event, player) {
      if (player.hasSkill("stdkuangfu_used")) {
        return false;
      }
      return player.isPhaseUsing() && event.card && event.card.name == "sha" && event.player != player && event.player.isIn();
    },
    async content(event, trigger, player) {
      player.addTempSkill("stdkuangfu_used", "phaseChange");
      if (trigger.player.hp < player.hp) {
        player.draw(2);
      } else {
        player.loseHp();
      }
    },
    ai: {
      halfneg: true
    },
    subSkill: {
      used: {
        charlotte: true
      }
    }
  },
  rewangzun: {
    trigger: { global: "phaseZhunbeiBegin" },
    forced: true,
    audio: "wangzun",
    filter(event, player) {
      return event.player.hp > player.hp;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      player.draw();
      let zhu = false;
      const target = trigger.player;
      switch (get.mode()) {
        case "identity": {
          zhu = target.isZhu;
          break;
        }
        case "guozhan": {
          zhu = get.is.jun(target);
          break;
        }
        case "versus": {
          zhu = target.identity == "zhu";
          break;
        }
        case "doudizhu": {
          zhu = target == game.zhu;
          break;
        }
      }
      if (zhu) {
        player.draw();
        target.addTempSkill("rewangzun2");
        target.addMark("rewangzun2", 1, false);
      }
    }
  },
  rewangzun2: {
    onremove: true,
    mod: {
      maxHandcard(player, num) {
        return num - player.countMark("rewangzun2");
      }
    },
    intro: { content: "手牌上限-#" }
  },
  retongji: {
    trigger: { global: "useCardToTarget" },
    logTarget: "target",
    audio: "tongji",
    filter(event, player) {
      return event.card.name == "sha" && event.player != player && !event.targets.includes(player) && event.target.inRange(player) && event.target.countCards("he") > 0;
    },
    async cost(event, trigger, player) {
      const result = await trigger.target.chooseCard("he", "是否对" + get.translation(player) + "发动【同疾】？", "弃置一张牌，将" + get.translation(trigger.card) + "转移给" + get.translation(player), lib.filter.cardDiscardable).set("ai", (card) => {
        if (!_status.event.check) {
          return -1;
        }
        return get.unuseful(card) + 9;
      }).set(
        "check",
        (() => {
          if (trigger.target.countCards("h", "shan")) {
            return -get.attitude(trigger.target, player);
          }
          if (get.attitude(trigger.target, player) < 5) {
            return 6 - get.attitude(trigger.target, player);
          }
          if (trigger.target.hp == 1 && player.countCards("h", "shan") == 0) {
            return 10 - get.attitude(trigger.target, player);
          }
          if (trigger.target.hp == 2 && player.countCards("h", "shan") == 0) {
            return 8 - get.attitude(trigger.target, player);
          }
          return -1;
        })() > 0
      ).forResult();
      if (result.bool) {
        event.result = {
          bool: true,
          cost_data: {
            cards: result.cards
          }
        };
      }
    },
    async content(event, trigger, player) {
      trigger.target.discard(event.cost_data.cards);
      const evt = trigger.getParent();
      evt.triggeredTargets2.remove(trigger.target);
      evt.targets.remove(trigger.target);
      evt.targets.push(player);
    },
    ai: {
      neg: true
    }
  },
  hujia: {
    audio: 2,
    audioname: ["re_caocao"],
    audioname2: {
      pe_jun_caocao: "sbhujia"
    },
    zhuSkill: true,
    trigger: { player: ["chooseToRespondBefore", "chooseToUseBefore"] },
    filter(event, player) {
      if (event.responded) {
        return false;
      }
      if (player.storage.hujiaing) {
        return false;
      }
      if (!player.hasZhuSkill("hujia")) {
        return false;
      }
      if (!event.filterCard({ name: "shan", isCard: true }, player, event)) {
        return false;
      }
      return game.hasPlayer((current) => current != player && current.group == "wei");
    },
    check(event, player) {
      if (get.damageEffect(player, event.player, player) >= 0) {
        return false;
      }
      return true;
    },
    async content(event, trigger, player) {
      while (true) {
        let bool;
        if (!event.current) {
          event.current = player.next;
        }
        if (event.current == player) {
          return;
        } else if (event.current.group == "wei") {
          if (event.current == game.me && !_status.auto || get.attitude(event.current, player) > 2 || event.current.isOnline()) {
            player.storage.hujiaing = true;
            const next = event.current.chooseToRespond("是否替" + get.translation(player) + "打出一张闪？", { name: "shan" });
            next.set("ai", () => {
              const event2 = _status.event;
              return get.attitude(event2.player, event2.source) - 2;
            });
            next.set("skillwarn", "替" + get.translation(player) + "打出一张闪");
            next.autochoose = lib.filter.autoRespondShan;
            next.set("source", player);
            bool = (await next.forResult()).bool;
          }
        }
        player.storage.hujiaing = false;
        if (bool) {
          trigger.result = { bool: true, card: { name: "shan", isCard: true } };
          trigger.responded = true;
          trigger.animate = false;
          if (typeof event.current.ai.shown == "number" && event.current.ai.shown < 0.95) {
            event.current.ai.shown += 0.3;
            if (event.current.ai.shown > 0.95) {
              event.current.ai.shown = 0.95;
            }
          }
          return;
        } else {
          event.current = event.current.next;
        }
      }
    },
    ai: {
      respondShan: true,
      skillTagFilter(player) {
        if (player.storage.hujiaing) {
          return false;
        }
        if (!player.hasZhuSkill("hujia")) {
          return false;
        }
        return game.hasPlayer((current) => current != player && current.group == "wei");
      }
    }
  },
  jianxiong: {
    audio: 2,
    audioname2: { caoying: "lingren_jianxiong" },
    preHidden: true,
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return get.itemtype(event.cards) == "cards" && get.position(event.cards[0], true) == "o";
    },
    async content(event, trigger, player) {
      player.gain(trigger.cards, "gain2");
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
  fankui: {
    audio: 2,
    trigger: { player: "damageEnd" },
    logTarget: "source",
    preHidden: true,
    filter(event, player) {
      return event.source && event.source.countGainableCards(player, event.source != player ? "he" : "e") > 0 && event.num > 0;
    },
    async content(event, trigger, player) {
      player.gainPlayerCard(true, trigger.source, trigger.source != player ? "he" : "e");
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
  guicai: {
    audio: 2,
    audioname2: { xin_simayi: "jilue_guicai" },
    trigger: { global: "judge" },
    preHidden: true,
    filter(event, player) {
      return player.countCards(get.mode() == "guozhan" ? "hes" : "hs") > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard(`${get.translation(trigger.player)}的${trigger.judgestr || ""}判定为${get.translation(trigger.player.judging[0])}，${get.prompt(event.skill)}`, get.mode() == "guozhan" ? "hes" : "hs", (card) => {
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
    //技能的logSkill跟着打出牌走 不进行logSkill
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
    }
  },
  ganglie: {
    audio: 2,
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return event.source?.isIn();
    },
    check(event, player) {
      return get.attitude(player, event.source) <= 0;
    },
    logTarget: "source",
    async content(event, trigger, player) {
      const { source } = trigger;
      const judgeEvent = player.judge((card) => {
        if (get.suit(card) == "heart") {
          return -2;
        }
        return 2;
      });
      judgeEvent.judge2 = (result2) => result2.bool;
      let result;
      result = await judgeEvent.forResult();
      if (!result?.bool) {
        return;
      }
      result = source.countCards("h") < 2 ? { bool: false } : await source.chooseToDiscard(2, `弃置两张手牌，否则${get.translation(player)}对你造成1点伤害`).set("ai", (card) => {
        if (card.name == "tao") {
          return -10;
        }
        if (card.name == "jiu" && get.player().hp == 1) {
          return -10;
        }
        return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
      }).forResult();
      if (!result?.bool) {
        await source.damage();
      }
    },
    ai: {
      maixie_defend: true,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return [1, -1];
          }
          return 0.8;
        }
      }
    }
  },
  ganglie_three: {
    audio: "ganglie",
    trigger: { player: "damageEnd" },
    async cost(event, trigger, player) {
      const result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return target.isEnemyOf(player2);
      }).set("ai", (target) => {
        return -get.attitude(_status.event.player, target) / Math.sqrt(1 + target.countCards("h"));
      }).forResult();
      event.result = result;
    },
    async content(event, trigger, player) {
      event.target = event.targets[0];
      const judgeEvent = player.judge((card) => {
        if (get.suit(card) == "heart") {
          return -2;
        }
        return 2;
      });
      judgeEvent.judge2 = (result) => result.bool;
      const { judge } = await judgeEvent.forResult();
      if (judge < 2) {
        return;
      }
      const { bool: chooseToDiscardResultBool } = await event.target.chooseToDiscard(2).set("ai", (card) => {
        if (card.name == "tao") {
          return -10;
        }
        if (card.name == "jiu" && _status.event.player.hp == 1) {
          return -10;
        }
        return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
      }).forResult();
      if (chooseToDiscardResultBool === false) {
        event.target.damage();
      }
    },
    ai: {
      maixie_defend: true,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return [1, -1];
          }
          return 0.8;
        }
      }
    }
  },
  tuxi: {
    audio: 2,
    trigger: { player: "phaseDrawBegin1" },
    filter(event, player) {
      return !event.numFixed;
    },
    async cost(event, trigger, player) {
      let num = game.countPlayer((current) => current != player && current.countCards("h") > 0 && get.attitude(player, current) <= 0);
      let check = num >= 2;
      const result = await player.chooseTarget(
        get.prompt(event.skill),
        "获得其他一至两名角色的各一张手牌",
        [1, 2],
        (card, player2, target) => {
          return target.countCards("h") > 0 && player2 != target;
        },
        (target) => {
          if (!_status.event.aicheck) {
            return 0;
          }
          const att = get.attitude(_status.event.player, target);
          if (target.hasSkill("tuntian")) {
            return att / 10;
          }
          return 1 - att;
        }
      ).set("aicheck", check).forResult();
      event.result = result;
    },
    async content(event, trigger, player) {
      player.gainMultiple(event.targets);
      trigger.changeToZero();
      await game.delay();
    },
    ai: {
      threaten: 2,
      expose: 0.3
    }
  },
  luoyi: {
    audio: 2,
    trigger: { player: "phaseDrawBegin2" },
    check(event, player) {
      if (player.skipList.includes("phaseUse") || player.countCards("h") < 3) {
        return false;
      }
      if (!player.hasSha()) {
        return false;
      }
      return game.hasPlayer((current) => get.attitude(player, current) < 0 && player.canUse("sha", current));
    },
    preHidden: true,
    filter(event, player) {
      return !event.numFixed && event.num > 0;
    },
    async content(event, trigger, player) {
      player.addTempSkill("luoyi2", "phaseJieshuBegin");
      trigger.num--;
    }
  },
  luoyi2: {
    trigger: { source: "damageBegin1" },
    sourceSkill: "luoyi",
    filter(event) {
      return event.card && (event.card.name == "sha" || event.card.name == "juedou") && event.notLink();
    },
    charlotte: true,
    forced: true,
    async content(event, trigger, player) {
      trigger.num++;
    },
    ai: {
      damageBonus: true
    }
  },
  tiandu: {
    audio: 2,
    audioname: ["re_guojia", "xizhicai", "gz_nagisa"],
    trigger: { player: "judgeEnd" },
    preHidden: true,
    frequent(event) {
      return event.result.card.name !== "du";
    },
    check(event) {
      return event.result.card.name !== "du";
    },
    filter(event, player) {
      return get.position(event.result.card, true) == "o";
    },
    async content(event, trigger, player) {
      player.gain(trigger.result.card, "gain2");
    }
  },
  yiji: {
    audio: 2,
    trigger: { player: "damageEnd" },
    frequent: true,
    filter(event) {
      return event.num > 0;
    },
    getIndex(event, player, triggername) {
      return event.num;
    },
    async content(event, trigger, player) {
      const cards2 = get.cards(2);
      await game.cardsGotoOrdering(cards2);
      if (_status.connectMode) {
        game.broadcastAll(function() {
          _status.noclearcountdown = true;
        });
      }
      event.given_map = {};
      if (!cards2.length) {
        return;
      }
      do {
        const { bool, links } = cards2.length == 1 ? { links: cards2.slice(0), bool: true } : await player.chooseCardButton("遗计：请选择要分配的牌", true, cards2, [1, cards2.length]).set("ai", () => {
          if (ui.selected.buttons.length == 0) {
            return 1;
          }
          return 0;
        }).forResult();
        if (!bool) {
          return;
        }
        cards2.removeArray(links);
        event.togive = links.slice(0);
        const { targets } = await player.chooseTarget("选择一名角色获得" + get.translation(links), true).set("ai", (target) => {
          const att = get.attitude(_status.event.player, target);
          if (_status.event.enemy) {
            return -att;
          } else if (att > 0) {
            return att / (1 + target.countCards("h"));
          } else {
            return att / 100;
          }
        }).set("enemy", get.value(event.togive[0], player, "raw") < 0).forResult();
        if (targets.length) {
          const id = targets[0].playerid, map = event.given_map;
          if (!map[id]) {
            map[id] = [];
          }
          map[id].addArray(event.togive);
        }
      } while (cards2.length > 0);
      if (_status.connectMode) {
        game.broadcastAll(function() {
          delete _status.noclearcountdown;
          game.stopCountChoose();
        });
      }
      const list = [];
      for (const i in event.given_map) {
        const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
        player.line(source, "green");
        if (player !== source && (get.mode() !== "identity" || player.identity !== "nei")) {
          player.addExpose(0.2);
        }
        list.push([source, event.given_map[i]]);
      }
      game.loseAsync({
        gain_list: list,
        giver: player,
        animate: "draw"
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
      }
    }
  },
  luoshen: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    frequent: true,
    preHidden: true,
    async content(event, trigger, player) {
      event.cards ??= [];
      while (true) {
        const judgeEvent = player.judge((card) => {
          if (get.color(card) == "black") {
            return 1.5;
          }
          return -1.5;
        });
        judgeEvent.judge2 = (result2) => result2.bool;
        if (get.mode() != "guozhan" && !player.hasSkillTag("rejudge")) {
          judgeEvent.set("callback", async (event2) => {
            if (event2.judgeResult.color == "black" && get.position(event2.card, true) == "o") {
              await player.gain(event2.card, "gain2");
            }
          });
        } else {
          judgeEvent.set("callback", async (event2) => {
            if (event2.judgeResult.color == "black") {
              event2.getParent().orderingCards.remove(event2.card);
            }
          });
        }
        let result;
        result = await judgeEvent.forResult();
        if (result?.bool && result?.card) {
          event.cards.push(result.card);
          result = await player.chooseBool("是否再次发动【洛神】？").set("frequentSkill", "luoshen").forResult();
          if (!result?.bool) {
            break;
          }
        } else {
          break;
        }
      }
      if (event.cards.someInD()) {
        await player.gain(event.cards.filterInD(), "gain2");
      }
    }
  },
  qingguo: {
    mod: {
      aiValue(player, card, num) {
        if (get.name(card) != "shan" && get.color(card) != "black") {
          return;
        }
        const cards2 = player.getCards("hs", (card2) => get.name(card2) == "shan" || get.color(card2) == "black");
        cards2.sort((a, b) => {
          return (get.name(b) == "shan" ? 1 : 2) - (get.name(a) == "shan" ? 1 : 2);
        });
        const geti = () => {
          if (cards2.includes(card)) {
            cards2.indexOf(card);
          }
          return cards2.length;
        };
        if (get.name(card) == "shan") {
          return Math.min(num, [6, 4, 3][Math.min(geti(), 2)]) * 0.6;
        }
        return Math.max(num, [6.5, 4, 3][Math.min(geti(), 2)]);
      },
      aiUseful() {
        return lib.skill.qingguo.mod.aiValue.apply(this, arguments);
      }
    },
    locked: false,
    audio: 2,
    audioname: ["sb_zhenji"],
    audioname2: {
      re_zhenji: "reqingguo"
    },
    enable: ["chooseToRespond", "chooseToUse"],
    filterCard(card) {
      return get.color(card) == "black";
    },
    viewAs: { name: "shan" },
    viewAsFilter(player) {
      if (!player.countCards("hs", { color: "black" })) {
        return false;
      }
    },
    position: "hs",
    prompt: "将一张黑色手牌当闪使用或打出",
    check() {
      return 1;
    },
    ai: {
      order: 3,
      respondShan: true,
      skillTagFilter(player) {
        if (!player.countCards("hs", { color: "black" })) {
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
  rende: {
    audio: 2,
    enable: "phaseUse",
    filterCard: true,
    selectCard: [1, Infinity],
    allowChooseAll: true,
    discard: false,
    lose: false,
    delay: 0,
    filterTarget(card, player, target) {
      return player != target;
    },
    check(card) {
      if (ui.selected.cards.length > 1) {
        return 0;
      }
      if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
        return 0;
      }
      if (!ui.selected.cards.length && card.name == "du") {
        return 20;
      }
      const player = get.owner(card);
      let num = 0;
      const evt2 = _status.event.getParent();
      player.getHistory("lose", (evt) => {
        if (evt.getParent().skill == "rende" && evt.getParent(3) == evt2) {
          num += evt.cards.length;
        }
      });
      if (player.hp == player.maxHp || num > 1 || player.countCards("h") <= 1) {
        if (ui.selected.cards.length) {
          return -1;
        }
        const players = game.filterPlayer();
        for (let i = 0; i < players.length; i++) {
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
      const evt2 = event.getParent(3);
      let num = 0;
      player.getHistory("lose", (evt) => {
        if (evt.getParent(2).name == "rende" && evt.getParent(5) == evt2) {
          num += evt.cards.length;
        }
      });
      await player.give(event.cards, event.target);
      if (num < 2 && num + event.cards.length > 1) {
        await player.recover();
      }
    },
    ai: {
      order(skill, player) {
        if (player.hp < player.maxHp && player.storage.rende < 2 && player.countCards("h") > 1) {
          return 10;
        }
        return 1;
      },
      result: {
        target(player, target) {
          if (target.hasSkillTag("nogain")) {
            return 0;
          }
          if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
            return target.hasSkillTag("nodu") ? 0 : -10;
          }
          if (target.hasJudge("lebu")) {
            return 0;
          }
          const nh = target.countCards("h");
          const np = player.countCards("h");
          if (player.hp == player.maxHp || player.storage.rende < 0 || player.countCards("h") <= 1) {
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
              const players = game.filterPlayer();
              for (let i = 0; i < players.length; i++) {
                if (players[i] != player && get.attitude(player, players[i]) > 0) {
                  return 0;
                }
              }
            }
          }
        }
      },
      threaten: 0.8
    }
  },
  rende1: {
    trigger: { player: "phaseUseBegin" },
    silent: true,
    sourceSkill: "rende",
    async content(event, trigger, player) {
      player.storage.rende = 0;
    }
  },
  jijiang: {
    audio: "jijiang1",
    audioname: ["liushan", "re_liubei", "re_liushan", "ol_liushan"],
    audioname2: {
      pe_jun_liubei: "sbjijiang"
    },
    group: ["jijiang1"],
    zhuSkill: true,
    filter(event, player) {
      if (!player.hasZhuSkill("jijiang") || !game.hasPlayer((current) => current != player && current.group == "shu")) {
        return false;
      }
      return !event.jijiang && (event.type != "phase" || !player.hasSkill("jijiang3"));
    },
    enable: ["chooseToUse", "chooseToRespond"],
    viewAs: { name: "sha" },
    filterCard() {
      return false;
    },
    selectCard: -1,
    ai: {
      order() {
        return get.order({ name: "sha" }) + 0.3;
      },
      respondSha: true,
      skillTagFilter(player) {
        if (!player.hasZhuSkill("jijiang") || !game.hasPlayer((current) => current != player && current.group == "shu")) {
          return false;
        }
      }
    }
  },
  jijiang1: {
    audio: 2,
    audioname: ["liushan", "re_liubei", "re_liushan", "ol_liushan"],
    audioname2: {
      pe_jun_liubei: "sbjijiang"
    },
    trigger: { player: ["useCardBegin", "respondBegin"] },
    logTarget: "targets",
    sourceSkill: "jijiang",
    filter(event, player) {
      return event.skill == "jijiang";
    },
    forced: true,
    async content(event, trigger, player) {
      delete trigger.skill;
      trigger.getParent().set("jijiang", true);
      while (true) {
        if (event.current == void 0) {
          event.current = player.next;
        }
        if (event.current == player) {
          player.addTempSkill("jijiang3");
          trigger.cancel();
          trigger.getParent().goto(0);
          return;
        } else if (event.current.group == "shu") {
          const chooseToRespondEvent = event.current.chooseToRespond("是否替" + get.translation(player) + "打出一张杀？", { name: "sha" });
          chooseToRespondEvent.set("ai", () => {
            const event2 = _status.event;
            return get.attitude(event2.player, event2.source) - 2;
          });
          chooseToRespondEvent.set("source", player);
          chooseToRespondEvent.set("jijiang", true);
          chooseToRespondEvent.set("skillwarn", "替" + get.translation(player) + "打出一张杀");
          chooseToRespondEvent.noOrdering = true;
          chooseToRespondEvent.autochoose = lib.filter.autoRespondSha;
          const { bool, card, cards: cards2 } = await chooseToRespondEvent.forResult();
          if (bool) {
            trigger.card = card;
            trigger.cards = cards2;
            trigger.throw = false;
            if (typeof event.current.ai.shown == "number" && event.current.ai.shown < 0.95) {
              event.current.ai.shown += 0.3;
              if (event.current.ai.shown > 0.95) {
                event.current.ai.shown = 0.95;
              }
            }
            return;
          } else {
            event.current = event.current.next;
          }
        } else {
          event.current = event.current.next;
        }
      }
    }
  },
  jijiang3: {
    trigger: { global: ["useCardAfter", "useSkillAfter", "phaseAfter"] },
    silent: true,
    charlotte: true,
    sourceSkill: "jijiang",
    filter(event) {
      return event.skill != "jijiang" && event.skill != "qinwang";
    },
    async content(event, trigger, player) {
      player.removeSkill("jijiang3");
    }
  },
  wusheng: {
    audio: 2,
    audioname2: {
      old_guanzhang: "wusheng_old_guanzhang",
      old_guanyu: "wusheng_re_guanyu",
      guanzhang: "wusheng_guanzhang",
      guansuo: "wusheng_guansuo"
    },
    audioname: ["re_guanyu", "jsp_guanyu", "re_guanzhang", "dc_jsp_guanyu"],
    enable: ["chooseToRespond", "chooseToUse"],
    filterCard(card, player) {
      if (get.zhu(player, "shouyue")) {
        return true;
      }
      return get.color(card) == "red";
    },
    position: "hes",
    viewAs: { name: "sha" },
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
      const val = get.value(card);
      if (_status.event.name == "chooseToRespond") {
        return 1 / Math.max(0.1, val);
      }
      return 5 - val;
    },
    ai: {
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
      },
      respondSha: true
    }
  },
  wusheng_re_guanyu: { audio: 2 },
  zhongyi: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "orange",
    filterCard: true,
    position: "he",
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    discard: false,
    lose: false,
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      player.addTempSkill("zhongyi2", "roundStart");
      player.addToExpansion(player, "give", event.cards).gaintag.add("zhongyi2");
    }
  },
  zhongyi2: {
    trigger: { global: "damageBegin1" },
    forced: true,
    popup: false,
    logTarget: "source",
    sourceSkill: "zhongyi",
    filter(event, player) {
      return event.getParent().name == "sha" && event.source && event.source.isFriendOf(player);
    },
    async content(event, trigger, player) {
      trigger.num++;
    },
    intro: { content: "expansion", markcount: "expansion" },
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    }
  },
  paoxiao: {
    audio: 2,
    firstDo: true,
    audioname: ["re_zhangfei", "xiahouba"],
    audioname2: {
      old_guanzhang: "paoxiao_old_guanzhang",
      guanzhang: "paoxiao_guanzhang"
    },
    trigger: { player: "useCard1" },
    forced: true,
    filter(event, player) {
      return !event.audioed && event.card.name == "sha" && player.countUsed("sha", true) > 1 && event.getParent().type == "phase";
    },
    async content(event, trigger, player) {
      trigger.audioed = true;
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
  paoxiao_xiahouba: { audio: 2 },
  guanxing_fail: {},
  guanxing: {
    audio: 2,
    audioname: ["jiangwei", "re_jiangwei", "re_zhugeliang", "ol_jiangwei"],
    trigger: { player: "phaseZhunbeiBegin" },
    frequent: true,
    preHidden: true,
    async content(event, trigger, player) {
      const num = player.hasSkill("yizhi") && player.hasSkill("guanxing") ? 5 : Math.min(5, game.countPlayer());
      const result = await player.chooseToGuanxing(num).set("prompt", "观星：点击或拖动将牌移动到牌堆顶或牌堆底").forResult();
      if (!result.bool || !result.moved[0].length) {
        player.addTempSkill("guanxing_fail");
      }
    },
    ai: {
      threaten: 1.2,
      guanxing: true
    }
  },
  kongcheng: {
    mod: {
      targetEnabled(card, player, target, now) {
        if (target.countCards("h") == 0) {
          if (card.name == "sha" || card.name == "juedou") {
            return false;
          }
        }
      }
    },
    group: "kongcheng1",
    audio: "kongcheng1",
    audioname: ["re_zhugeliang"],
    ai: {
      noh: true,
      skillTagFilter(player, tag) {
        if (tag == "noh") {
          if (player.countCards("h") != 1) {
            return false;
          }
        }
      }
    }
  },
  kongcheng1: {
    audio: 2,
    trigger: { player: "loseEnd" },
    forced: true,
    firstDo: true,
    audioname: ["re_zhugeliang"],
    sourceSkill: "kongcheng",
    filter(event, player) {
      if (player.countCards("h")) {
        return false;
      }
      for (let i = 0; i < event.cards.length; i++) {
        if (event.cards[i].original == "h") {
          return true;
        }
      }
      return false;
    },
    async content() {
    }
  },
  longdan: {
    audio: "longdan_sha",
    audioname: ["re_zhaoyun"],
    audioname2: { old_zhaoyun: "longdan_sha_re_zhaoyun" },
    group: ["longdan_sha", "longdan_shan", "longdan_draw"],
    subSkill: {
      draw: {
        trigger: { player: ["useCard", "respond"] },
        forced: true,
        popup: false,
        filter(event, player) {
          if (!get.zhu(player, "shouyue")) {
            return false;
          }
          return event.skill == "longdan_sha" || event.skill == "longdan_shan";
        },
        async content(event, trigger, player) {
          player.draw();
          player.storage.fanghun2++;
        }
      },
      sha: {
        audio: 2,
        audioname: ["re_zhaoyun"],
        audioname2: { old_zhaoyun: "longdan_sha_re_zhaoyun" },
        enable: ["chooseToUse", "chooseToRespond"],
        filterCard: { name: "shan" },
        viewAs: { name: "sha" },
        viewAsFilter(player) {
          if (!player.countCards("hs", "shan")) {
            return false;
          }
        },
        position: "hs",
        prompt: "将一张闪当杀使用或打出",
        check() {
          return 1;
        },
        ai: {
          effect: {
            target(card, player, target, current) {
              if (get.tag(card, "respondSha") && current < 0) {
                return 0.6;
              }
            }
          },
          respondSha: true,
          skillTagFilter(player) {
            if (!player.countCards("hs", "shan")) {
              return false;
            }
          },
          order() {
            return get.order({ name: "sha" }) + 0.1;
          },
          useful: -1,
          value: -1
        }
      },
      shan: {
        audio: "longdan_sha",
        audioname: ["re_zhaoyun"],
        audioname2: { old_zhaoyun: "longdan_sha_re_zhaoyun" },
        enable: ["chooseToRespond", "chooseToUse"],
        filterCard: { name: "sha" },
        viewAs: { name: "shan" },
        prompt: "将一张杀当闪使用或打出",
        check() {
          return 1;
        },
        position: "hs",
        viewAsFilter(player) {
          if (!player.countCards("hs", "sha")) {
            return false;
          }
        },
        ai: {
          respondShan: true,
          skillTagFilter(player) {
            if (!player.countCards("hs", "sha")) {
              return false;
            }
          },
          effect: {
            target(card, player, target, current) {
              if (get.tag(card, "respondShan") && current < 0) {
                return 0.6;
              }
            }
          },
          order: 4,
          useful: -1,
          value: -1
        }
      }
    }
  },
  longdan_sha_re_zhaoyun: { audio: 2 },
  mashu: {
    mod: {
      globalFrom(from, to, distance) {
        return distance - 1;
      }
    }
  },
  feiying: {
    mod: {
      globalTo(from, to, distance) {
        return distance + 1;
      }
    }
  },
  tieji: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    check(event, player) {
      return get.attitude(player, event.target) <= 0;
    },
    filter(event, player) {
      return event.card.name == "sha";
    },
    logTarget: "target",
    preHidden: true,
    async content(event, trigger, player) {
      const judgeEvent = player.judge((card) => {
        if (get.zhu(_status.event.player, "shouyue")) {
          if (get.suit(card) != "spade") {
            return 2;
          }
        } else {
          if (get.color(card) == "red") {
            return 2;
          }
        }
        return -0.5;
      });
      judgeEvent.judge2 = (result) => result.bool;
      const { bool } = await judgeEvent.forResult();
      if (bool) {
        trigger.getParent().directHit.add(trigger.target);
      }
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (get.attitude(player, arg.target) > 0 || arg.card.name != "sha" || !ui.cardPile.firstChild || get.color(ui.cardPile.firstChild, player) != "red") {
          return false;
        }
      }
    }
  },
  jizhi: {
    audio: 2,
    audioname: ["jianyong"],
    audioname2: {
      xin_simayi: "jilue_jizhi"
    },
    trigger: { player: "useCard" },
    frequent: true,
    preHidden: true,
    filter(event) {
      return get.type(event.card) == "trick";
    },
    async content(event, trigger, player) {
      player.draw("nodelay");
    },
    ai: {
      threaten: 1.4,
      noautowuxie: true
    }
  },
  qicai: {
    mod: {
      targetInRange(card, player, target, now) {
        if (["trick", "delay"].includes(get.type(card))) {
          return true;
        }
      }
    }
  },
  zhiheng: {
    audio: 2,
    audioname: ["gz_jun_sunquan"],
    audioname2: {
      xin_simayi: "jilue_zhiheng"
    },
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
    filterCard: true,
    selectCard: [1, Infinity],
    allowChooseAll: true,
    prompt: "弃置任意张牌并摸等量的牌",
    check(card) {
      let player = _status.event.player;
      if (get.position(card) == "e") {
        let subs = get.subtypes(card);
        if (subs.includes("equip2") || subs.includes("equip3")) {
          return player.getHp() - get.value(card);
        }
      }
      return 6 - get.value(card);
    },
    async content(event, trigger, player) {
      player.draw(event.cards.length);
    },
    ai: {
      order: 1,
      result: {
        player: 1
      },
      threaten: 1.5
    }
  },
  jiuyuan: {
    audio: 2,
    trigger: { target: "taoBegin" },
    zhuSkill: true,
    forced: true,
    filter(event, player) {
      if (event.player == player) {
        return false;
      }
      if (!player.hasZhuSkill("jiuyuan")) {
        return false;
      }
      if (event.player.group != "wu") {
        return false;
      }
      return true;
    },
    async content(event, trigger, player) {
      trigger.baseDamage++;
    }
  },
  qixi: {
    audio: 2,
    audioname: ["re_ganning"],
    audioname2: { re_heqi: "duanbing_heqi" },
    enable: "chooseToUse",
    filterCard(card) {
      return get.color(card) == "black";
    },
    position: "hes",
    viewAs: { name: "guohe" },
    viewAsFilter(player) {
      if (!player.countCards("hes", { color: "black" })) {
        return false;
      }
    },
    prompt: "将一张黑色牌当过河拆桥使用",
    check(card) {
      return 4 - get.value(card);
    }
  },
  keji: {
    audio: 2,
    audioname: ["re_lvmeng", "sp_lvmeng"],
    trigger: { player: "phaseDiscardBefore" },
    frequent(event, player) {
      return player.needsToDiscard();
    },
    filter(event, player) {
      if (player.getHistory("skipped").includes("phaseUse")) {
        return true;
      }
      const history = player.getHistory("useCard").concat(player.getHistory("respond"));
      for (let i = 0; i < history.length; i++) {
        if (history[i].card.name == "sha" && history[i].isPhaseUsing()) {
          return false;
        }
      }
      return true;
    },
    async content(event, trigger, player) {
      trigger.cancel();
    }
  },
  kurou: {
    audio: 2,
    enable: "phaseUse",
    prompt: "失去1点体力并摸两张牌",
    delay: false,
    async content(event, trigger, player) {
      player.loseHp(1);
      player.draw(2, "nodelay");
    },
    ai: {
      basic: {
        order: 1
      },
      result: {
        player(player) {
          if (player.needsToDiscard(3) && !player.hasValueTarget({ name: "sha" }, false)) {
            return -1;
          }
          if (player.countCards("h") >= player.hp - 1) {
            return -1;
          }
          if (player.hp < 3) {
            return -1;
          }
          return 1;
        }
      }
    }
  },
  yingzi: {
    audio: 2,
    audioname: ["sp_lvmeng"],
    trigger: { player: "phaseDrawBegin2" },
    frequent: true,
    filter(event, player) {
      return !event.numFixed;
    },
    async content(event, trigger, player) {
      trigger.num++;
    },
    ai: {
      threaten: 1.3
    }
  },
  fanjian: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    filterTarget(card, player, target) {
      return player != target;
    },
    async content(event, trigger, player) {
      const target = event.target;
      const { control } = await target.chooseControl("heart2", "diamond2", "club2", "spade2").set("ai", (event2) => {
        switch (Math.floor(Math.random() * 6)) {
          case 0:
            return "heart2";
          case 1:
          case 4:
          case 5:
            return "diamond2";
          case 2:
            return "club2";
          case 3:
            return "spade2";
        }
      }).forResult();
      game.log(target, "选择了" + get.translation(control));
      event.choice = control;
      target.chat("我选" + get.translation(event.choice));
      const { bool, cards: cards2 } = await target.gainPlayerCard(player, true, "h").forResult();
      if (bool && get.suit(cards2[0], player) + "2" != event.choice) {
        target.damage("nocard");
      }
    },
    ai: {
      order: 1,
      result: {
        target(player, target) {
          const eff = get.damageEffect(target, player);
          if (eff >= 0) {
            return 1 + eff;
          }
          let value = 0, i;
          const cards2 = player.getCards("h");
          for (i = 0; i < cards2.length; i++) {
            value += get.value(cards2[i]);
          }
          value /= player.countCards("h");
          if (target.hp == 1) {
            return Math.min(0, value - 7);
          }
          return Math.min(0, value - 5);
        }
      }
    }
  },
  guose: {
    audio: 2,
    filter(event, player) {
      return player.countCards("hes", { suit: "diamond" }) > 0;
    },
    enable: "chooseToUse",
    filterCard(card) {
      return get.suit(card) == "diamond";
    },
    position: "hes",
    viewAs: { name: "lebu" },
    prompt: "将一张方片牌当乐不思蜀使用",
    check(card) {
      return 6 - get.value(card);
    },
    ai: {
      threaten: 1.5
    }
  },
  liuli: {
    audio: 2,
    audioname: ["re_daqiao", "daxiaoqiao"],
    trigger: { target: "useCardToTarget" },
    preHidden: true,
    filter(event, player) {
      if (event.card.name != "sha") {
        return false;
      }
      if (player.countCards("he") == 0) {
        return false;
      }
      return game.hasPlayer((current) => {
        return player.inRange(current) && current != event.player && current != player && lib.filter.targetEnabled(event.card, event.player, current);
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        position: "he",
        filterCard: lib.filter.cardDiscardable,
        filterTarget: (card, player2, target) => {
          const trigger2 = _status.event;
          if (player2.inRange(target) && target != trigger2.source) {
            if (lib.filter.targetEnabled(trigger2.card, trigger2.source, target)) {
              return true;
            }
          }
          return false;
        },
        ai1: (card) => get.unuseful(card) + 9,
        ai2: (target) => {
          const player2 = get.player();
          if (player2.countCards("h", "shan")) {
            return -get.attitude(player2, target);
          }
          if (get.attitude(player2, target) < 5) {
            return 6 - get.attitude(player2, target);
          }
          if (player2.hp == 1 && player2.countCards("h", "shan") == 0) {
            return 10 - get.attitude(player2, target);
          }
          if (player2.hp == 2 && player2.countCards("h", "shan") == 0) {
            return 8 - get.attitude(player2, target);
          }
          return -1;
        },
        prompt: get.prompt(event.skill),
        prompt2: "弃置一张牌，将此【杀】转移给攻击范围内的一名其他角色",
        source: trigger.player,
        card: trigger.card
      }).setHiddenSkill(event.name.slice(0, -5)).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.discard(event.cards);
      const evt = trigger.getParent();
      evt.triggeredTargets2.remove(player);
      evt.targets.remove(player);
      evt.targets.push(target);
    },
    ai: {
      effect: {
        target_use(card, player, target) {
          if (target.countCards("he") == 0) {
            return;
          }
          if (card.name != "sha") {
            return;
          }
          let min = 1;
          const friend = get.attitude(player, target) > 0;
          const vcard = { name: "shacopy", nature: card.nature, suit: card.suit };
          const players = game.filterPlayer();
          for (let i = 0; i < players.length; i++) {
            if (player != players[i] && get.attitude(target, players[i]) < 0 && target.canUse(card, players[i])) {
              if (!friend) {
                return 0;
              }
              if (get.effect(players[i], vcard, player, player) > 0) {
                if (!player.canUse(card, players[0])) {
                  return [0, 0.1];
                }
                min = 0;
              }
            }
          }
          return min;
        }
      }
    }
  },
  qianxun: {
    mod: {
      targetEnabled(card, player, target, now) {
        if (card.name == "shunshou" || card.name == "lebu") {
          return false;
        }
      }
    },
    audio: 2
  },
  lianying: {
    audio: 2,
    trigger: {
      player: "loseAfter",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    frequent: true,
    filter(event, player) {
      if (player.countCards("h")) {
        return false;
      }
      const evt = event.getl(player);
      return evt && evt.player == player && evt.hs && evt.hs.length > 0;
    },
    async content(event, trigger, player) {
      player.draw();
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
      skillTagFilter(player, tag) {
        if (player.countCards("h") !== 1) {
          return false;
        }
      }
    }
  },
  xiaoji: {
    audio: 2,
    audioname: ["sp_sunshangxiang", "re_sunshangxiang"],
    trigger: {
      player: "loseAfter",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    frequent: true,
    getIndex(event, player) {
      const evt = event.getl(player);
      if (evt && evt.player === player && evt.es) {
        return evt.es.length;
      }
      return false;
    },
    async content(event, trigger, player) {
      player.draw(2);
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
  jieyin: {
    audio: 2,
    enable: "phaseUse",
    filterCard: true,
    usable: 1,
    selectCard: 2,
    check(card) {
      const player = get.owner(card);
      if (player.countCards("h") > player.hp) {
        return 8 - get.value(card);
      }
      if (player.hp < player.maxHp) {
        return 6 - get.value(card);
      }
      return 4 - get.value(card);
    },
    filterTarget(card, player, target) {
      if (!target.hasSex("male")) {
        return false;
      }
      if (target.hp >= target.maxHp) {
        return false;
      }
      if (target == player) {
        return false;
      }
      return true;
    },
    async content(event, trigger, player) {
      player.recover();
      event.target.recover();
    },
    ai: {
      order: 5.5,
      result: {
        player(player) {
          if (player.hp < player.maxHp) {
            return 4;
          }
          if (player.countCards("h") > player.hp) {
            return 0;
          }
          return -1;
        },
        target: 4
      },
      threaten: 2
    }
  },
  qingnang: {
    audio: 2,
    enable: "phaseUse",
    filterCard: true,
    usable: 1,
    check(card) {
      return 9 - get.value(card);
    },
    filterTarget(card, player, target) {
      if (target.hp >= target.maxHp) {
        return false;
      }
      return true;
    },
    async content(event, trigger, player) {
      event.target.recover();
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
  jijiu: {
    mod: {
      aiValue(player, card, num) {
        if (get.name(card) != "tao" && get.color(card) != "red") {
          return;
        }
        const cards2 = player.getCards("hs", (card2) => get.name(card2) == "tao" || get.color(card2) == "red");
        cards2.sort((a, b) => (get.name(a) == "tao" ? 1 : 2) - (get.name(b) == "tao" ? 1 : 2));
        var geti = () => {
          if (cards2.includes(card)) {
            cards2.indexOf(card);
          }
          return cards2.length;
        };
        return Math.max(num, [6.5, 4, 3, 2][Math.min(geti(), 2)]);
      },
      aiUseful() {
        return lib.skill.jijiu.mod.aiValue.apply(this, arguments);
      }
    },
    locked: false,
    audio: 2,
    audioname: ["re_huatuo"],
    audioname2: { old_huatuo: "jijiu_re_huatuo" },
    enable: "chooseToUse",
    viewAsFilter(player) {
      return player != _status.currentPhase && player.countCards("hes", { color: "red" }) > 0;
    },
    filterCard(card) {
      return get.color(card) == "red";
    },
    position: "hes",
    viewAs: { name: "tao" },
    prompt: "将一张红色牌当桃使用",
    check(card) {
      return 15 - get.value(card);
    },
    ai: {
      threaten: 1.5
    }
  },
  jijiu_re_huatuo: { audio: 2 },
  wushuang: {
    audio: 2,
    audioname: ["re_lvbu", "shen_lvbu", "lvlingqi"],
    audioname2: { sb_lvbu: "sbliyu_effect" },
    forced: true,
    locked: true,
    group: ["wushuang1", "wushuang2"],
    preHidden: ["wushuang1", "wushuang2"]
  },
  wushuang1: {
    audio: "wushuang",
    audioname: ["re_lvbu", "shen_lvbu", "lvlingqi"],
    audioname2: {
      sb_lvbu: "sbliyu_effect",
      gz_lvlingqi: "wushuang_lvlingqi"
    },
    trigger: { player: "useCardToPlayered" },
    forced: true,
    sourceSkill: "wushuang",
    filter(event, player) {
      return event.card.name == "sha" && !event.getParent().directHit.includes(event.target);
    },
    //priority:-1,
    logTarget: "target",
    async content(event, trigger, player) {
      const id = trigger.target.playerid;
      const map = trigger.getParent().customArgs;
      if (!map[id]) {
        map[id] = {};
      }
      if (typeof map[id].shanRequired == "number") {
        map[id].shanRequired++;
      } else {
        map[id].shanRequired = 2;
      }
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1) {
          return false;
        }
      }
    }
  },
  wushuang2: {
    audio: "wushuang",
    audioname: ["re_lvbu", "shen_lvbu", "lvlingqi"],
    audioname2: {
      sb_lvbu: "sbliyu_effect",
      gz_lvlingqi: "wushuang_lvlingqi"
    },
    trigger: { player: "useCardToPlayered", target: "useCardToTargeted" },
    forced: true,
    sourceSkill: "wushuang",
    logTarget(trigger, player) {
      return player == trigger.player ? trigger.target : trigger.player;
    },
    filter(event, player) {
      return event.card.name == "juedou";
    },
    //priority:-1,
    async content(event, trigger, player) {
      const id = (player == trigger.player ? trigger.target : trigger.player)["playerid"];
      const idt = trigger.target.playerid;
      const map = trigger.getParent().customArgs;
      if (!map[idt]) {
        map[idt] = {};
      }
      if (!map[idt].shaReq) {
        map[idt].shaReq = {};
      }
      if (!map[idt].shaReq[id]) {
        map[idt].shaReq[id] = 1;
      }
      map[idt].shaReq[id]++;
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (arg.card.name != "juedou" || Math.floor(arg.target.countCards("h", "sha") / 2) > player.countCards("h", "sha")) {
          return false;
        }
      }
    }
  },
  zhanshen: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "gray",
    filter(event, player) {
      return player.isDamaged() && game.dead.filter((target) => target.isFriendOf(player)).length > 0;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const cards2 = player.getEquips(1);
      if (cards2.length) {
        player.discard(cards2);
      }
      player.loseMaxHp();
      player.addSkills(["mashu", "shenji"]);
    },
    derivation: ["mashu", "shenji"]
  },
  shenji: {
    audio: 2,
    mod: {
      selectTarget(card, player, range) {
        if (range[1] == -1) {
          return;
        }
        if (card.name == "sha") {
          range[1] += 2;
        }
      },
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return num + 1;
        }
      }
    }
  },
  lijian: {
    audio: 2,
    audioname: ["re_diaochan"],
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.countPlayer((current) => current != player && current.hasSex("male")) > 1;
    },
    check(card) {
      return 10 - get.value(card);
    },
    filterCard: true,
    position: "he",
    filterTarget(card, player, target) {
      if (player == target) {
        return false;
      }
      if (!target.hasSex("male")) {
        return false;
      }
      if (ui.selected.targets.length == 1) {
        return target.canUse({ name: "juedou" }, ui.selected.targets[0]);
      }
      return true;
    },
    targetprompt: ["先出杀", "后出杀"],
    selectTarget: 2,
    multitarget: true,
    async content(event, trigger, player) {
      const useCardEvent = event.targets[1].useCard({ name: "juedou", isCard: true }, "nowuxie", event.targets[0], "noai");
      useCardEvent.animate = false;
      await game.delay(0.5);
    },
    ai: {
      order: 8,
      result: {
        target(player, target) {
          if (ui.selected.targets.length == 0) {
            return -3;
          } else {
            return get.effect(target, { name: "juedou" }, ui.selected.targets[0], target);
          }
        }
      },
      expose: 0.4,
      threaten: 3
    }
  },
  biyue: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    frequent: true,
    preHidden: true,
    async content(event, trigger, player) {
      player.draw();
    }
  },
  yaowu: {
    trigger: { player: "damageBegin3" },
    audio: 2,
    filter(event, player) {
      return event.card?.name == "sha" && get.color(event.card) == "red" && event.source?.isIn();
    },
    forced: true,
    check() {
      return false;
    },
    async content(event, trigger, player) {
      await trigger.source.chooseDrawRecover(true);
    },
    ai: {
      neg: true,
      effect: {
        target(card, player, target, current) {
          if (card.name == "sha" && get.color(card) == "red") {
            return [1, -2];
          }
        }
      }
    }
  },
  new_jiangchi: {
    audio: 2,
    trigger: {
      player: "phaseDrawEnd"
    },
    logAudio: (event, player, name, indexedData, costResult) => costResult.cost_data == "弃牌" ? "new_jiangchi1.mp3" : "new_jiangchi2.mp3",
    async cost(event, trigger, player) {
      const list = ["弃牌", "摸牌", "cancel2"];
      if (!player.countCards("he")) {
        list.remove("弃牌");
      }
      const { control } = await player.chooseControl(list, () => {
        const player2 = _status.event.player;
        if (list.includes("弃牌")) {
          if (player2.countCards("h") > 3 && player2.countCards("h", "sha") > 1) {
            return "弃牌";
          }
          if (player2.countCards("h", "sha") > 2) {
            return "弃牌";
          }
        }
        if (!player2.countCards("h", "sha")) {
          return "摸牌";
        }
        return "cancel2";
      }).set("prompt", get.prompt2(event.skill)).forResult();
      if (control === "cancel2") {
        event.result = { bool: false };
      } else {
        event.result = {
          bool: true,
          cost_data: control
        };
      }
    },
    async content(event, trigger, player) {
      const control = event.cost_data;
      if (control == "弃牌") {
        player.chooseToDiscard(true, "he");
        player.addTempSkill("jiangchi2", "phaseUseEnd");
      } else if (control == "摸牌") {
        player.draw();
        player.addTempSkill("new_jiangchi3", "phaseEnd");
      }
    }
  },
  new_jiangchi3: {
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
  xinfu_jijie: {
    enable: "phaseUse",
    usable: 1,
    audio: 2,
    async content(event, trigger, player) {
      const card = get.bottomCards()[0];
      game.cardsGotoOrdering(card);
      event.card = card;
      const { bool, targets } = await player.chooseTarget(true).set("ai", (target) => {
        let att = get.attitude(_status.event.player, target);
        if (_status.event.du) {
          if (target.hasSkillTag("nodu")) {
            return 0.5;
          }
          return -att;
        }
        if (att > 0) {
          if (_status.event.player != target) {
            att += 2;
          }
          return att + Math.max(0, 5 - target.countCards("h"));
        }
        return att;
      }).set("du", event.card.name == "du").set("createDialog", ["机捷：选择一名角色获得此牌", [card]]).forResult();
      if (bool) {
        const target = targets[0];
        player.line(target, "green");
        const gainEvent = target.gain(card, "draw");
        gainEvent.giver = player;
      }
    },
    ai: {
      order: 7.2,
      result: {
        player: 1
      }
    }
  },
  xinfu_jiyuan: {
    trigger: {
      global: ["dying", "gainAfter", "loseAsyncAfter"]
    },
    audio: 2,
    getIndex(event, player) {
      if (event.name !== "loseAsync") {
        return [event.player];
      } else {
        return game.filterPlayer((current) => current != player && event.getg(current).length > 0).sortBySeat();
      }
    },
    filter(event, player, triggername, target) {
      if (!target.isIn()) {
        return false;
      }
      if (event.name === "dying") {
        return true;
      }
      if (event.giver !== player) {
        return false;
      }
      if (event.name === "gain") {
        return event.player != player && event.getg(target).length > 0;
      }
      return game.hasPlayer((current) => current != player && event.getg(current).length > 0);
    },
    logTarget(event, player, triggername, target) {
      return target;
    },
    check(event, player, triggername, target) {
      return get.attitude(player, target) > 0;
    },
    async content(event, trigger, player) {
      event.targets[0].draw();
    }
  }
};
const translates = {
  caocao: "曹操",
  hujia: "护驾",
  hujia_info: "主公技，当你需要使用或打出一张【闪】时，你可以令其他魏势力角色选择是否打出一张【闪】。若有角色响应，则你视为使用或打出了一张【闪】。",
  jianxiong: "奸雄",
  jianxiong_info: "当你受到伤害后，你可以获得对你造成伤害的牌。",
  simayi: "司马懿",
  fankui: "反馈",
  fankui_info: "当你受到伤害后，你可以获得伤害来源的一张牌。",
  guicai: "鬼才",
  guicai_info: "一名角色的判定牌生效前，你可以打出一张手牌代替之。",
  guicai_info_guozhan: "一名角色的判定牌生效前，你可以打出一张牌代替之。",
  xiahoudun: "夏侯惇",
  zhangliao: "张辽",
  xuzhu: "许褚",
  guojia: "郭嘉",
  zhenji: "甄宓",
  liubei: "刘备",
  guanyu: "关羽",
  zhangfei: "张飞",
  zhugeliang: "诸葛亮",
  zhaoyun: "赵云",
  machao: "马超",
  huangyueying: "黄月英",
  sunquan: "孙权",
  ganning: "甘宁",
  lvmeng: "吕蒙",
  huanggai: "黄盖",
  zhouyu: "周瑜",
  daqiao: "大乔",
  luxun: "陆逊",
  sunshangxiang: "孙尚香",
  huatuo: "华佗",
  lvbu: "吕布",
  diaochan: "貂蝉",
  huaxiong: "华雄",
  xf_yiji: "伊籍",
  re_yuanshu: "袁术",
  caozhang: "曹彰",
  ganglie: "刚烈",
  tuxi: "突袭",
  luoyi: "裸衣",
  luoyi2: "裸衣",
  tiandu: "天妒",
  yiji: "遗计",
  luoshen: "洛神",
  qingguo: "倾国",
  rende: "仁德",
  jijiang: "激将",
  jijiang1: "激将",
  jijiang2: "激将",
  wusheng: "武圣",
  paoxiao: "咆哮",
  guanxing: "观星",
  kongcheng: "空城",
  kongcheng1: "空城",
  longdan: "龙胆",
  longdan1: "龙胆",
  longdan2: "龙胆",
  mashu: "马术",
  feiying: "飞影",
  tieji: "铁骑",
  jizhi: "集智",
  qicai: "奇才",
  zhiheng: "制衡",
  jiuyuan: "救援",
  qixi: "奇袭",
  keji: "克己",
  kurou: "苦肉",
  yingzi: "英姿",
  fanjian: "反间",
  guose: "国色",
  liuli: "流离",
  qianxun: "谦逊",
  lianying: "连营",
  xiaoji: "枭姬",
  jieyin: "结姻",
  qingnang: "青囊",
  jijiu: "急救",
  wushuang: "无双",
  wushuang1: "无双",
  wushuang2: "无双",
  lijian: "离间",
  biyue: "闭月",
  pileTop: "牌堆顶",
  pileBottom: "牌堆底",
  ganglie_info: "当你受到伤害后，你可以判定。若结果不为红桃，则伤害来源须弃置两张手牌，否则受到来自你的1点伤害。",
  tuxi_info: "摸牌阶段，你可以改为获得至多两名其他角色的各一张手牌。",
  luoyi_info: "摸牌阶段，你可以少摸一张牌。若如此做，当你本回合内使用【杀】或【决斗】造成伤害时，此伤害+1。",
  tiandu_info: "当你的判定牌生效后，你可以获得之。",
  yiji_info: "当你受到1点伤害后，你可以观看牌堆顶的两张牌，然后将其分配给任意角色。",
  luoshen_info: "准备阶段，你可以判定。若结果为黑色，你获得判定牌。你可重复此流程，直到出现红色的判定结果。",
  luoshen_info_guozhan: "准备阶段，你可以判定。若结果为黑色，则可以继续判定，直到出现红色的判定牌。然后你获得所有黑色的判定牌。（判定结果为黑色的牌在此过程中不会进入弃牌堆）",
  qingguo_info: "你可以将一张黑色手牌当做【闪】使用或打出。",
  rende_info: "出牌阶段，你可以将任意张手牌交给其他角色。当你以此法于一回合内给出第二张牌时，你回复1点体力。",
  jijiang_info: "主公技，当你需要使用或打出【杀】时，你可以令其他蜀势力角色依次选择是否打出一张【杀】。若有角色响应，则你视为使用或打出了此【杀】。",
  wusheng_info: "你可以将一张红色牌当做【杀】使用或打出。",
  paoxiao_info: "锁定技，出牌阶段，你使用【杀】没有数量限制。",
  guanxing_info: "准备阶段，你可以观看牌堆顶的X张牌，并将其以任意顺序置于牌堆顶或牌堆底。（X为存活角色数且至多为5）",
  kongcheng_info: "锁定技，当你没有手牌时，你不能成为【杀】或【决斗】的目标。",
  longdan_info: "你可以将【杀】当做【闪】，或将【闪】当做【杀】使用或打出。",
  mashu_info: "锁定技，你计算与其他角色的距离时-1。",
  feiying_info: "锁定技，其他角色计算与你的距离时+1。",
  tieji_info: "当你使用【杀】指定目标后，你可以进行判定。若结果为红色，则此【杀】不可被闪避。",
  jizhi_info: "当你使用普通锦囊牌时，你可以摸一张牌。",
  qicai_info: "锁定技，你使用锦囊牌无距离限制。",
  zhiheng_info: "出牌阶段限一次，你可以弃置任意张牌，然后摸等量的牌。",
  jiuyuan_info: "主公技，锁定技，其他吴势力角色对你使用的【桃】的回复值+1。",
  qixi_info: "你可以将一张黑色牌当做【过河拆桥】使用。",
  keji_info: "弃牌阶段开始时，若你于本回合的出牌阶段内没有使用或打出过【杀】，则你可以跳过此阶段。",
  kurou_info: "出牌阶段，你可以失去1点体力，然后摸两张牌。",
  yingzi_info: "摸牌阶段，你可以多摸一张牌。",
  fanjian_info: "出牌阶段限一次。你可以令一名角色选择一种花色，然后其获得你的一张手牌。若其以此法选择的花色与其得到的牌花色不同，则你对其造成1点伤害。",
  guose_info: "你可以将一张方片牌当做【乐不思蜀】使用。",
  liuli_info: "当你成为【杀】的目标时，你可以弃置一张牌并将此【杀】转移给攻击范围内的一名其他角色（不能是此【杀】的使用者）。",
  qianxun_info: "锁定技，你不能成为【顺手牵羊】和【乐不思蜀】的目标。",
  lianying_info: "当你失去最后的手牌时，你可以摸一张牌。",
  xiaoji_info: "当你失去一张装备区内的牌后，你可以摸两张牌。",
  jieyin_info: "出牌阶段限一次，你可以弃置两张手牌并选择一名已经受伤的男性角色。你与其各回复1点体力。",
  qingnang_info: "出牌阶段限一次，你可以弃置一张手牌并令一名角色回复1点体力。",
  jijiu_info: "你的回合外，你可以将一张红色牌当做【桃】使用。",
  wushuang_info: "锁定技，①当你使用【杀】指定一名角色为目标后，其需使用两张【闪】才能抵消；②当你使用【决斗】指定其他角色为目标后，或成为其他角色使用【决斗】的目标后，其每次响应需打出两张【杀】。",
  lijian_info: "出牌阶段限一次，你可以弃置一张牌，视为一名男性角色对另一名男性角色使用一张【决斗】（不可被【无懈可击】响应）。",
  biyue_info: "结束阶段，你可以摸一张牌。",
  yaowu: "耀武",
  yaowu_info: "锁定技，一名角色使用红色【杀】对你造成伤害时，该角色回复1点体力或摸一张牌。",
  new_jiangchi: "将驰",
  new_jiangchi_info: "摸牌阶段结束时，你可以选择一项：1、摸一张牌，若如此做，你本回合内不能使用或打出【杀】且【杀】不计入手牌上限。 2、弃置一张牌，若如此做，出牌阶段你使用【杀】无距离限制且你可以额外使用一张【杀】，直到回合结束。",
  xinfu_jijie: "机捷",
  xinfu_jijie_info: "出牌阶段限一次。你可以观看牌堆底的一张牌，然后将其交给一名角色。",
  xinfu_jiyuan: "急援",
  xinfu_jiyuan_info: "当有角色进入濒死状态时，或你将牌交给一名其他角色后，你可以令该角色摸一张牌。",
  ganglie_three: "刚烈",
  ganglie_three_info: "当你受到伤害后，你可令一名敌方角色判定。若结果不为♥，其弃置两张牌或受到来自你的1点伤害。",
  zhongyi: "忠义",
  zhongyi2: "忠义",
  zhongyi_info: "限定技，出牌阶段，你可以将一张牌置于武将牌上。你的武将牌上有〖忠义〗牌时，己方角色使用【杀】造成的伤害+1。下轮游戏开始时，你将〖忠义〗牌置入弃牌堆。",
  zhanshen: "战神",
  zhanshen_info: "觉醒技，准备阶段，若场上有已死亡的其他己方角色且你已受伤，则你弃置装备区的武器牌，减1点体力上限，获得技能〖马术〗和〖神戟〗。",
  shenji: "神戟",
  shenji_info: "锁定技，你使用【杀】指定的目标数上限+2，次数上限+1。",
  rewangzun: "妄尊",
  rewangzun2: "妄尊",
  rewangzun_info: "锁定技，一名其他角色的准备阶段开始时，若其体力值大于你，你摸一张牌。然后若其身份为主公/主帅/君主/地主且明置，则你摸一张牌，且其本回合的手牌上限-1。",
  retongji: "同疾",
  retongji_info: "攻击范围内包含你的角色成为【杀】的目标时，若你不是此【杀】的使用者或目标，其可弃置一张牌，然后将此【杀】转移给你。",
  std_panfeng: "标潘凤",
  std_panfeng_prefix: "标",
  stdkuangfu: "狂斧",
  stdkuangfu_info: "锁定技。出牌阶段限一次。当你使用【杀】对其他角色造成伤害后，若其体力值：小于你，你摸两张牌；不小于你，你失去1点体力。",
  ganfuren: "标甘夫人",
  ganfuren_prefix: "标",
  stdshushen: "淑慎",
  stdshushen_info: "当你回复1点体力时，你可以令一名其他角色摸一张牌（若其没有手牌则改为摸两张牌）。",
  old_re_lidian: "李典",
  std_yuejin: "标乐进",
  std_yuejin_prefix: "标",
  stdxiaoguo: "骁果",
  stdxiaoguo_info: "其他角色的结束阶段开始时，你可以弃置一张基本牌，令该角色选择一项：1.弃置一张装备牌；2.受到你对其造成的1点伤害。",
  stdqingjiao: "轻狡",
  stdqingjiao_info: "主公技，锁定技，结束阶段，若你本回合对其他群势力角色造成过伤害，你摸一张牌。"
};
const characterTitles = {
  caocao: "魏武帝",
  simayi: "狼顾之鬼",
  xiahoudun: "独眼的罗刹",
  zhangliao: "前将军",
  xuzhu: "虎痴",
  guojia: "早终的先知",
  zhenji: "薄幸的美人",
  liubei: "乱世的枭雄",
  guanyu: "美髯公",
  zhangfei: "万夫不当",
  zhugeliang: "迟暮的丞相",
  zhaoyun: "少年将军",
  machao: "一骑当千",
  huangyueying: "归隐的杰女",
  sunquan: "年轻的贤君",
  ganning: "锦帆游侠",
  lvmeng: "白衣渡江",
  huanggai: "轻身为国",
  zhouyu: "大都督",
  daqiao: "矜持之花",
  luxun: "儒生雄才",
  sunshangxiang: "弓腰姬",
  huatuo: "神医",
  lvbu: "武的化身",
  diaochan: "绝世的舞姬",
  huaxiong: "飞扬跋扈",
  xf_yiji: "礼仁同渡",
  re_yuanshu: "野心渐增",
  gongsunzan: "白马义从",
  caozhang: "黄须儿",
  std_panfeng: "桀骜不驯",
  ganfuren: "昭烈皇后",
  old_re_lidian: "学而不厌",
  std_yuejin: "奋强突固"
};
const characterIntro = {
  liubei: "先主姓刘，讳备，字玄德，涿郡涿县人，汉景帝子中山靖王胜之后也。以仁德治天下。",
  guanyu: "字云长，本字长生，并州河东解州人。五虎上将之首，爵至汉寿亭侯，谥曰“壮缪侯”。被奉为“关圣帝君”，崇为“武圣”。",
  zhangfei: "字翼德，涿郡人，燕颔虎须，豹头环眼。有诗云：“长坂坡头杀气生，横枪立马眼圆睁。一声好似轰雷震，独退曹家百万兵”。",
  zhugeliang: "字孔明，号卧龙，琅琊阳都人，蜀汉丞相。在世时被封为武乡侯，谥曰忠武侯。著有《出师表》、《诫子书》等。怀不世之才，以空城戏司马，能观星象而通鬼神。",
  zhaoyun: "字子龙，常山真定人。身长八尺，姿颜雄伟。长坂坡单骑救阿斗，先主云：“子龙一身都是胆也。”",
  machao: "字孟起，扶风茂陵人。面如冠玉，目如流星，虎体猿臂，彪腹狼腰，声雄力猛。因衣着讲究，举止非凡，故人称“锦马超”。麾铁骑，捻金枪。",
  huangyueying: "荆州沔南白水人，沔阳名士黄承彦之女，诸葛亮之妻，诸葛瞻之母。容貌甚丑，而有奇才：上通天文，下察地理，韬略近于诸书无所不晓，诸葛亮在南阳闻其贤而迎娶。",
  sunquan: "吴大帝，字仲谋，吴郡富春县人。统领吴与蜀魏三足鼎立，制衡天下。",
  ganning: "字兴霸，巴郡临江人，祖籍荆州南阳郡。为人勇猛刚强，忠心耿耿，勇往无前。曾带兵百人于二更奇袭曹营，大挫其锐气。",
  lvmeng: "字子明，汝南富陂人。陈寿评曰：“吕蒙勇而有谋断，识军计，谲郝普，擒关羽，最其妙者。初虽轻果妄杀，终于克己，有国士之量，岂徒武将而已乎！”",
  huanggai: "字公覆，零陵郡泉陵县人。官至偏将军、武陵太守。以苦肉计骗曹孟德，亲往诈降，火烧战船，重创敌军。",
  zhouyu: "字公瑾，庐江舒县人，任东吴三军大都督，雄姿英发，人称“美周郎”。赤壁之战前，巧用反间计杀了精通水战的叛将蔡瑁、张允。",
  daqiao: "庐江皖县人，为乔公长女，孙策之妻，小乔之姊。与小乔并称为“江东二乔”，容貌国色流离。",
  luxun: "本名陆议，字伯言，吴郡吴县人。历任东吴大都督、丞相。吴大帝孙权兄孙策之婿，世代为江东大族。以谦逊之书麻痹关羽，夺取荆州，又有火烧连营大破蜀军。",
  sunshangxiang: "孙夫人，乃孙权之妹。刘备定荆州，孙权进妹与其结姻，重固盟好。孙夫人才捷刚猛，有诸兄之风。后人为其立庙，号曰“枭姬庙”。",
  caocao: "魏武帝曹操，字孟德，小名阿瞒、吉利，沛国谯人。精兵法，善诗歌，乃治世之能臣，乱世之奸雄也。",
  simayi: "晋宣帝，字仲达，河内温人。曾任职过曹魏的大都督，太尉，太傅。少有奇节，聪明多大略，博学洽闻，伏膺儒教，世之鬼才也。",
  xiahoudun: "字元让，沛国谯人。有拔矢啖睛之勇，性格勇猛刚烈。",
  zhangliao: "字文远，魏雁门马邑人。官至前将军、征东将军、晋阳侯。武功高强，又谋略过人，多次建立奇功，以800人突袭孙权十万大军，皆望风披靡。",
  xuzhu: "字仲康，谯国谯县人。和典韦一同统率着曹操的亲卫队“虎卫军”。因为他十分勇猛，所以有“虎痴”的绰号。曾有裸衣斗马超之举。",
  guojia: "字奉孝，颍川阳翟人，官至军师祭酒。惜天妒英才，英年早逝。有诗云：“良计环环不遗策，每临制变满座惊”。",
  zhenji: "中山无极人，别称甄洛或甄宓，谥号文昭甄皇后。魏文帝曹丕的正室。懂诗文，有倾国倾城之貌，《洛神赋》即是曹植为她所作。",
  huatuo: "字元化，一名旉，沛国谯人，“建安三神医”之一。集平生之所得著《青囊经》，现已失传。",
  lvbu: "字奉先，五原郡九原县人。三国第一猛将，曾独力战刘关张三人，其武力世之无双。时人语曰：“人中有吕布，马中有赤兔。”",
  diaochan: "中国古代四大美女之一，有闭月羞花之貌。司徒王允之义女，由王允授意施行连环计，离间董卓、吕布，借布手除卓。后貂蝉成为吕布的妾。",
  huaxiong: "董卓旗下名将，自荐抵抗山东地区反对董卓的诸侯联军于汜水关前，他先后斩杀济北相鲍信之弟鲍忠和孙坚部将祖茂、以及袁术部将俞涉和韩馥手下潘凤等人，最后关东联军派出关羽与之一对一决斗而被杀。",
  xf_yiji: "伊籍，字机伯，生卒年不详，兖州山阳郡（今山东金乡县）人，三国时期蜀汉官员。年少时依附于同乡刘表。刘备落难到荆州时，伊籍时常拜访，托请刘备照顾。建安十三年（208年），刘表病死，伊籍便转投刘备，一起渡江南下。建安十六年（211年），刘备入蜀帮助刘璋，伊籍亦有跟随。随后刘备和刘璋双方决裂。建安十九年（214年），刘备平定益州，任命伊籍为左将军从事中郎，其待遇次于简雍、孙乾等。后升任昭文将军，并与诸葛亮、法正、刘巴、李严共同编制《蜀科》。"
};
const characterFilters = {};
const dynamicTranslates = {};
const perfectPairs = {};
const voices = {
  "#ganfuren:die": "请替我照顾好阿斗……",
  "#jianxiong1": "宁教我负天下人，休教天下人负我！",
  "#jianxiong2": "吾好梦中杀人！",
  "#hujia1": "魏将何在？",
  "#hujia2": "来人！护驾！",
  "#caocao:die": "霸业未成未成啊！",
  "#fankui1": "出来混，早晚要还的。",
  "#fankui2": "下次注意点。",
  "#guicai1": "天命？哈哈哈哈……",
  "#guicai2": "吾乃天命之子！",
  "#simayi:die": "难道真是天意难违？",
  "#ganglie1": "鼠辈，竟敢伤我！",
  "#ganglie2": "以彼之道，还施彼身！",
  "#xiahoudun:die": "两，两边都看不见了……",
  "#tuxi1": "哼，没想到吧！",
  "#tuxi2": "拿来吧！",
  "#zhangliao:die": "真的没想到……",
  "#luoyi1": "脱！",
  "#luoyi2": "谁来与我大战三百回合？",
  "#xuzhu:die": "冷，好冷啊……",
  "#tiandu1": "罢了。",
  "#tiandu2": "也好。",
  "#yiji1": "就这样吧。",
  "#yiji2": "哦？",
  "#guojia:die": "咳，咳……",
  "#luoshen1": "髣髴兮若轻云之蔽月。",
  "#luoshen2": "飘飖兮若流风之回雪。",
  "#qingguo1": "凌波微步，罗袜生尘。",
  "#qingguo2": "体迅飞凫，飘忽若神。",
  "#zhenji:die": "悼良会之永绝兮，哀一逝而异乡……",
  "#rende1": "以德服人。",
  "#rende2": "唯贤唯德，能服于人。",
  "#jijiang11": "蜀将何在？",
  "#jijiang12": "尔等敢应战否？",
  "#liubei:die": "这就是桃园吗？",
  "#wusheng1": "关羽在此，尔等受死！",
  "#wusheng2": "看尔乃插标卖首！",
  "#guanyu:die": "什么？此地名叫麦城？",
  "#paoxiao1": "燕人张飞在此！",
  "#paoxiao2": "啊~~~！",
  "#zhangfei:die": "实在是，杀不动了……",
  "#guanxing1": "观今夜天象，知天下大事。",
  "#guanxing2": "知天易，逆天难。",
  "#kongcheng11": "（抚琴声）",
  "#kongcheng12": "（抚琴声）",
  "#zhugeliang:die": "将星陨落，天命难违……",
  "#longdan_sha1": "能进能退，乃真正法器！",
  "#longdan_sha2": "吾乃常山赵子龙也！",
  "#longdan_sha_sp_zhaoyun1": "大将军，岂可有勇无谋？",
  "#longdan_sha_sp_zhaoyun2": "一技闯天下，何有所惧!",
  "#zhaoyun:die": "这，就是失败的滋味吗？",
  "#tieji1": "全军突击！",
  "#tieji2": "（马蹄声，马叫声）",
  "#machao:die": "（马蹄声远去……）",
  "#jizhi1": "哼哼~",
  "#jizhi2": "哼~",
  "#huangyueying:die": "亮……",
  "#zhiheng1": "容我三思。",
  "#zhiheng2": "且慢。",
  "#jiuyuan1": "有汝辅佐，甚好！",
  "#jiuyuan2": "好舒服啊。",
  "#sunquan:die": "父亲，大哥，仲谋愧矣……",
  "#qixi1": "接招吧！",
  "#qixi2": "你的牌太多啦！",
  "#ganning:die": "二十年后，又是一条好汉……",
  "#keji1": "不是不报，时候未到！",
  "#keji2": "留得青山在，不怕没柴烧！",
  "#lvmeng:die": "被看穿了吗……",
  "#kurou1": "请鞭笞我吧，公瑾！",
  "#kurou2": "赴汤蹈火，在所不辞。",
  "#huanggai:die": "失血……过多了……",
  "#yingzi1": "哈哈哈哈！",
  "#yingzi2": "汝等看好了！",
  "#fanjian1": "痛苦吧，在仇与恨的地狱中！",
  "#fanjian2": "挣扎吧，在血和暗的深渊里！",
  "#zhouyu:die": "既生瑜，何生……",
  "#guose1": "请休息吧。",
  "#guose2": "你累了。",
  "#liuli1": "交给你了~",
  "#liuli2": "你来嘛~",
  "#daqiao:die": "伯符，我去了……",
  "#qianxun1": "儒生脱尘，不为贪逸淫乐之事。",
  "#qianxun2": "谦谦君子，不饮盗泉之水。",
  "#lianying1": "牌不是万能的，但是没牌是万万不能的。",
  "#lianying2": "旧的不去，新的不来。",
  "#luxun:die": "我还是太年轻了……",
  "#xiaoji1": "哼！",
  "#xiaoji2": "看我的厉害！",
  "#jieyin1": "夫君，身体要紧。",
  "#jieyin2": "他好，我也好。",
  "#sunshangxiang:die": "不！还不可以死！",
  "#qingnang1": "早睡早起，方能养生。",
  "#qingnang2": "越老越要补啊。",
  "#jijiu1": "别紧张，有老夫呢。",
  "#jijiu2": "救人一命，胜造七级浮屠。",
  "#huatuo:die": "医者……不能自医啊……",
  "#wushuang1": "谁能挡我！",
  "#wushuang2": "神挡杀神，佛挡杀佛！",
  "#lvbu:die": "不可能！",
  "#lijian1": "嗯呵呵~~呵呵~~",
  "#lijian2": "夫君，你要替妾身做主啊……",
  "#biyue1": "失礼了~",
  "#biyue2": "羡慕吧~",
  "#diaochan:die": "父亲大人，对不起……",
  "#yaowu1": "大人有大量，不和你计较！",
  "#yaowu2": "哼，先让你尝点甜头！",
  "#huaxiong:die": "这，怎么可能……",
  "#yicong1": "冲啊！",
  "#yicong2": "众将听令，排好阵势，御敌！",
  "#gongsunzan:die": "我军将败，我已无颜苟活于世……",
  "#xinfu_jijie1": "一拜一起，未足为劳。",
  "#xinfu_jijie2": "识言观行，方能雍容风议。",
  "#xinfu_jiyuan1": "公若辞，必遭蔡瑁之害矣。",
  "#xinfu_jiyuan2": "形势危急，还请速行。",
  "#xf_yiji:die": "未能，救得刘公脱险……",
  "#wangzun1": "真命天子，八方拜服。",
  "#wangzun2": "归顺于我，封爵赏地！",
  "#tongji1": "弑君之罪，当诛九族！",
  "#tongji2": "你，你这是反啦！",
  "#re_yuanshu:die": "把玉玺，还给我……"
};
const characterSort = {
  standard_2008: ["caocao", "simayi", "xiahoudun", "zhangliao", "xuzhu", "guojia", "zhenji", "liubei", "guanyu", "zhangfei", "zhugeliang", "zhaoyun", "machao", "huangyueying", "sunquan", "ganning", "lvmeng", "huanggai", "zhouyu", "daqiao", "luxun", "sunshangxiang", "huatuo", "lvbu", "diaochan"],
  standard_2013: ["old_re_lidian", "huaxiong", "re_yuanshu"],
  standard_2019: ["gongsunzan", "xf_yiji"],
  standard_2023: ["std_panfeng", "ganfuren", "std_yuejin"]
};
const characterSortTranslate = {
  standard_2008: "2008版标准包",
  standard_2013: "2013版标准包",
  standard_2019: "2019版标准包",
  standard_2023: "2023版标准包"
};
game.import("character", function() {
  return {
    name: "standard",
    connect: true,
    character: { ...characters },
    characterSort: {
      standard: characterSort
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
