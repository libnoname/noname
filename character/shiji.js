import { lib, ui, _status, get, game } from "noname";
const characters = {
  shen_lusu: {
    sex: "male",
    group: "shen",
    hp: 3,
    skills: ["tamo", "dingzhou", "zhimeng"],
    groupInGuozhan: "wu"
  },
  shen_huatuo: {
    sex: "male",
    group: "shen",
    hp: 3,
    skills: ["wuling", "youyi"],
    groupInGuozhan: "qun"
  },
  shen_sunce: {
    sex: "male",
    group: "shen",
    hp: 1,
    maxHp: 6,
    skills: ["yingba", "scfuhai", "pinghe"],
    groupInGuozhan: "wu"
  },
  shen_taishici: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["dulie", "tspowei"],
    groupInGuozhan: "wu",
    names: "太史|慈"
  },
  shen_xunyu: {
    sex: "male",
    group: "shen",
    hp: 3,
    skills: ["tianzuo", "lingce", "dinghan"],
    groupInGuozhan: "wei",
    clans: ["颍川荀氏"]
  },
  shen_guojia: {
    sex: "male",
    group: "shen",
    hp: 3,
    skills: ["reshuishi", "stianyi", "resghuishi"],
    groupInGuozhan: "wei"
  },
  mb_shen_machao: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["yuli", "tingwei", "jimie"]
  },
  mb_shen_jiangwei: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["mbtiantao", "mbxinghun", "mbshenpei"]
  },
  liuba: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["duanbi", "tongduo"]
  },
  sp_zhujun: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xinyangjie", "xinjuxiang", "houfeng"]
  },
  sp_huangfusong: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["spzhengjun", "spshiji", "sptaoluan"],
    names: "皇甫|嵩"
  },
  sp_lvfan: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["mbdiaodu", "mbdiancai", "spyanji"]
  },
  sp_jiangqing: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["spjianyi", "spshangyi"]
  },
  sp_jiangwan: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["spzhenting", "spjincui"]
  },
  sp_zhangchangpu: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["spdifei", "spyanjiao"]
  },
  sp_cuiyan: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["spyajun", "spzundi"]
  },
  sp_huaman: {
    sex: "female",
    group: "shu",
    hp: 4,
    skills: ["spxiangzhen", "spfangzong", "spxizhan"],
    names: "孟|null"
  },
  sp_gaolan: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["spjungong", "spdengli"]
  },
  sunyi: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["zaoli"]
  },
  sp_wangshuang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["yiyong", "shanxie"]
  },
  sp_zongyu: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["zhibian", "yuyan"]
  },
  yuanhuan: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["qingjue", "fengjie"]
  },
  sp_chendong: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["spyilie", "spfenming"],
    names: "陈|武-董|袭"
  },
  db_wenyang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["dbquedi", "dbzhuifeng", "dbchongjian", "dbchoujue"],
    doubleGroup: ["wei", "wu"]
  },
  sp_yanghu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["mingfa", "rongbei"],
    groupBorder: "jin"
  },
  qiaogong: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["yizhu", "luanchou"],
    names: "桥|null"
  },
  liuzhang: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["jutu", "yaohu", "rehuaibi"],
    isZhugong: true
  },
  sp_zhangwen: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["gebo", "spsongshu"]
  },
  zhangzhongjing: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["jishi", "xinliaoyi", "binglun"]
  },
  sp_xujing: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["boming", "ejian"]
  },
  sp_huaxin: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["yuanqing", "shuchen"]
  },
  xiangchong: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["guying", "muzhen"]
  },
  caizhenji: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["sheyi", "tianyin"],
    names: "蔡|null"
  },
  sp_kongrong: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["xinlirang", "xinmingshi"]
  },
  zhouchu: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["xianghai", "rechuhai"]
  },
  wangfuzhaolei: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["xunyi"],
    names: "王|甫-赵|累"
  },
  wangling: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["xingqi", "xinzifu", "mibei"],
    clans: ["太原王氏"]
  },
  wujing: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["heji", "liubing"]
  },
  sp_mifuren: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["xinguixiu", "qingyu"],
    names: "糜|null"
  },
  sp_xinpi: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["spyinju", "spchijie"]
  },
  feiyi: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["mjshengxi", "fyjianyu"]
  },
  sp_bianfuren: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["spwanwei", "spyuejian"],
    names: "卞|null"
  },
  sp_duyu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["spwuku", "spsanchen"],
    groupBorder: "jin"
  },
  luotong: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["qinzheng"]
  },
  sp_wangcan: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["spqiai", "spshanxi"]
  },
  sp_chenzhen: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["shameng"]
  },
  sp_sunshao: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["mbdingyi", "mbzuici", "mbfubi"]
  },
  sp_xunchen: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["mjweipo", "mjchenshi", "mjmouzhi"],
    clans: ["颍川荀氏"]
  }
};
const cards = {
  qizhengxiangsheng: {
    enable: true,
    type: "trick",
    fullskin: true,
    derivation: "shen_xunyu",
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const { card, target } = event;
      if (!event.qizheng_name) {
        if (!player.isIn()) {
          return;
        }
        const e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
        let e2 = 0;
        if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
          e2 = -1;
        }
        const es = target.getGainableCards(player, "e");
        if (es.length) {
          let max = 0;
          for (const current of es) {
            max = Math.max(max, get.value(current, target));
          }
          e2 = Math.min(e2, -max / 4);
        }
        let choice = "正兵";
        if (Math.abs(e1 - e2) <= 0.3) {
          choice = Math.random() < 0.5 ? "奇兵" : "正兵";
        } else if (e1 < e2) {
          choice = "奇兵";
        }
        const controlResult = await player.chooseControl({
          controls: ["奇兵", "正兵"],
          prompt: `请选择${get.translation(target)}的标记`
        }).set("choice", choice).set("ai", () => _status.event.choice).forResult();
        if (controlResult.control) {
          event.qizheng_name = controlResult.control;
        }
      }
      let responseResult = { bool: false };
      if (!event.directHit) {
        const responseChoice = (() => {
          if (target.hasSkillTag("useShan")) {
            return "shan";
          }
          if (typeof event.qizheng_aibuff === "boolean") {
            const shas = target.getCards("h", "sha");
            const shans = target.getCards("h", "shan");
            if (event.qizheng_aibuff) {
              if (shas.length >= Math.max(1, shans.length)) {
                return "shan";
              }
              if (shans.length > shas.length) {
                return "sha";
              }
              return false;
            }
            if (!shas.length || !shans.length) {
              return false;
            }
          }
          const e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
          let e2 = 0;
          if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
            e2 = -1;
          }
          const es = target.getGainableCards(player, "e");
          if (es.length) {
            let max = 0;
            for (const current of es) {
              max = Math.max(max, get.value(current, target));
            }
            e2 = Math.min(e2, -max / 4);
          }
          if (e1 - e2 >= 0.3) {
            return "shan";
          }
          if (e2 - e1 >= 0.3) {
            return "sha";
          }
          return "all";
        })();
        responseResult = await target.chooseToRespond({
          prompt: "请打出一张杀或闪响应奇正相生",
          filterCard: (card2) => {
            const name2 = get.name(card2);
            return name2 === "sha" || name2 === "shan";
          },
          ai: (card2) => {
            if (_status.event.choice === "all") {
              const rand = get.rand("qizhengxiangsheng");
              if (rand > 0.5) {
                return 0;
              }
              return 1 + Math.random();
            }
            if (get.name(card2) === _status.event.choice) {
              return get.order(card2);
            }
            return 0;
          }
        }).set("respondTo", [player, card]).set("choice", responseChoice).forResult();
      }
      const name = responseResult.bool ? responseResult.card.name : null;
      const require2 = event.qizheng_name;
      if (require2 === "奇兵" && name !== "sha") {
        await target.damage();
      } else if (require2 === "正兵" && name !== "shan" && target.countGainableCards(player, "he") > 0) {
        await player.gainPlayerCard({ target, forced: true, position: "he" });
      }
    },
    ai: {
      order: 5,
      tag: {
        damage: 0.6,
        gain: 0.5,
        loseCard: 1,
        respondShan: 1,
        respondSha: 1
      },
      result: {
        target(player, target) {
          const e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
          let e2 = 0;
          if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
            e2 = -1;
          }
          const es = target.getGainableCards(player, "e");
          if (es.length) {
            let max = 0;
            for (const current of es) {
              max = Math.max(max, get.value(current, target));
            }
            e2 = Math.min(e2, -max / 4);
          }
          if (game.hasPlayer((current) => current.hasSkill("tianzuo") && get.attitude(current, player) <= 0)) {
            return Math.max(e1, e2);
          }
          return Math.min(e1, e2);
        }
      }
    }
  },
  binglinchengxiax: {
    enable: true,
    type: "trick",
    derivation: "sp_xunchen",
    fullskin: true,
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const { target } = event;
      if (!player.isIn() || !target.isIn()) {
        return;
      }
      event.showCards = get.cards(4, true);
      await game.cardsGotoOrdering(event.showCards);
      await player.showCards(event.showCards, `${get.translation(player)}使用了【${get.translation(event.card)}】`, true).set("clearArena", false);
      if (player.isIn() && target.isIn() && event.showCards.length) {
        for (const card of event.showCards.slice()) {
          if (get.name(card) === "sha" && player.canUse(card, target, false)) {
            event.showCards.remove(card);
            await player.useCard({ card, targets: [target], addCount: false });
          }
        }
      }
      game.broadcastAll(ui.clear);
      if (event.showCards.length) {
        await game.cardsGotoPile(event.showCards.reverse(), "insert");
      }
    },
    ai: {
      basic: {
        useful: 4,
        value: 3
      },
      order: 4,
      result: {
        target(player, target, card, isLink) {
          if (get.effect(target, { name: "sha" }, player, target) === 0) {
            return 0;
          }
          return -2.5;
        }
      },
      tag: {
        respond: 1,
        respondShan: 1,
        damage: 1
      }
    }
  },
  tiaojiyanmei: {
    enable: true,
    type: "trick",
    derivation: "feiyi",
    fullskin: true,
    filterTarget(card, player, target) {
      const targets = [];
      if (ui.selected.targets.length) {
        targets.addArray(ui.selected.targets);
      }
      const evt = _status.event.getParent("useCard");
      if (evt && evt.card === card) {
        targets.addArray(evt.targets);
      }
      if (targets.length) {
        const hs = target.countCards("h");
        for (const current of targets) {
          if (current.countCards("h") !== hs) {
            return true;
          }
        }
        return false;
      }
      return true;
    },
    recastable: true,
    selectTarget: 2,
    postAi: () => true,
    async contentBefore(event) {
      const { targets } = event;
      if (!targets.length) {
        return;
      }
      const map = {};
      event.getParent().customArgs.default.tiaojiyanmei_map = map;
      let average = 0;
      for (const target of targets) {
        const hs = target.countCards("h");
        map[target.playerid] = hs;
        average += hs;
      }
      map.average = average / targets.length;
    },
    async content(event) {
      const { target } = event;
      const map = event.tiaojiyanmei_map;
      const num1 = map.average;
      let num2 = map[target.playerid];
      if (typeof num2 !== "number") {
        num2 = target.countCards("h");
      }
      if (num2 > num1) {
        target.chooseToDiscard({ position: "he", forced: true });
      } else if (num2 < num1) {
        target.draw();
      }
    },
    async contentAfter(event, trigger, player) {
      const { card, targets } = event;
      if (!player.isIn() || targets.length < 2) {
        return;
      }
      const num = targets[0].countCards("h");
      for (const target2 of targets.slice(1)) {
        if (target2.countCards("h") !== num) {
          return;
        }
      }
      let discardedCards = [];
      game.getGlobalHistory("cardMove", (evt) => {
        if (evt.name === "lose" && evt.type === "discard" && evt.getParent(3).card === card) {
          discardedCards.addArray(evt.cards);
        }
      });
      discardedCards = discardedCards.filterInD("d");
      if (!discardedCards.length) {
        return;
      }
      event.tiaojiyanmei_cards = discardedCards;
      const result2 = await player.chooseTarget({
        prompt: `是否令一名角色获得${get.translation(discardedCards)}？`,
        ai: (target2) => {
          const evt = _status.event.getParent();
          return get.attitude(evt.player, target2) * get.value(evt.tiaojiyanmei_cards, target2) * (target2.hasSkillTag("nogain") ? 0.1 : 1);
        }
      }).forResult();
      if (!result2.bool) {
        return;
      }
      const target = result2.targets[0];
      player.line(target, "thunder");
      await target.gain({ cards: discardedCards, animate: "gain2" });
    },
    ai: {
      order: 6.1,
      basic: {
        useful: 4,
        value: 3
      },
      result: {
        target(player, target, card, isLink) {
          const targets = [];
          if (ui.selected.targets.length) {
            targets.addArray(ui.selected.targets);
          }
          const evt = _status.event.getParent("useCard");
          if (evt && evt.card === card) {
            targets.addArray(evt.targets);
          }
          if (evt && evt.card === card && evt.customArgs && evt.customArgs.tiaojiyanmei_map) {
            const map = evt.customArgs.tiaojiyanmei_map;
            const num1 = map.average;
            let num2 = map[target.playerid];
            if (typeof num2 !== "number") {
              num2 = target.countCards("h");
            }
            if (num2 > num1) {
              if (target.countCards("e", (card2) => get.value(card2) <= 0)) {
                return 1;
              }
              return -1;
            }
            if (num2 < num1) {
              return 1;
            }
            return 0;
          }
          const cards2 = [card];
          if (card.cards) {
            cards2.addArray(card.cards);
          }
          const fh = (card2) => !cards2.includes(card2);
          if (!targets.length) {
            if (get.attitude(player, target) < 0) {
              if (target.countCards("e", (card2) => get.value(card2, target) <= 0)) {
                return 1;
              }
              if (game.hasPlayer((current) => current.countCards("h", fh) === target.countCards("h", fh) - 2)) {
                return -2;
              }
              if (game.hasPlayer((current) => current.countCards("h", fh) < target.countCards("h", fh))) {
                return -1;
              }
            }
            if (target.countCards("e", (card2) => get.value(card2, target) <= 0) && game.hasPlayer((current) => current.countCards("h", fh) < target.countCards("h", fh))) {
              return 1;
            }
            return 0;
          }
          let average = 0;
          for (const current of targets) {
            average += current.countCards("h", fh);
          }
          let th;
          if (!targets.includes(target)) {
            th = target.countCards("h", fh);
            average += th;
            average /= targets.length + 1;
            if (th === average) {
              return 0;
            }
            if (th < average) {
              return th === average - 1 ? 2 : 1;
            }
            if (th > average) {
              if (target.countCards("e", (card2) => get.value(card2) <= 0)) {
                return 1;
              }
              return -0.5;
            }
            return 0;
          }
          average /= targets.length;
          if (th < average) {
            return 1;
          }
          if (th > average) {
            if (target.countCards("e", (card2) => get.value(card2) <= 0)) {
              return 1;
            }
            return -1;
          }
          return 0;
        }
      }
    }
  }
};
const pinyins = {};
const skills = {
  //孙邵重置
  mbdingyi: {
    audio: "mjdingyi",
    forced: true,
    trigger: {
      player: "enterGame",
      global: "phaseBefore"
    },
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      const result2 = await player.chooseButtonTarget({
        createDialog: [
          "定仪：选择一项效果令任意名角色获得",
          [
            [
              ["draw", "摸牌阶段摸牌数+1"],
              ["maxhand", "手牌上限+2"],
              ["attack", "攻击范围+1"],
              ["dying", "脱离濒死状态时回复1点体力"]
            ],
            "textbutton"
          ]
        ],
        forced: true,
        selectTarget: [1, Infinity],
        ai1(button) {
          return button.link == ["draw", "dying"].randomGet();
        },
        ai2(target) {
          return get.attitude(get.player(), target);
        }
      }).forResult();
      if (result2?.bool && result2.targets?.length && result2.links?.length) {
        const targets = result2.targets.sortBySeat();
        player.line(targets);
        const link = result2.links[0];
        for (const target of targets) {
          target.addSkill(event.name + "_buff");
          if (!target.storage.mbdingyi_buff) {
            target.storage.mbdingyi_buff = [0, 0, 0, 0];
          }
          const storage = target.storage.mbdingyi_buff;
          switch (link) {
            case "draw":
              storage[0]++;
              break;
            case "maxhand":
              storage[1] += 2;
              break;
            case "attack":
              storage[2]++;
              break;
            case "dying":
              storage[3]++;
              break;
          }
          target.setStorage(event.name + "_buff", storage, true);
        }
      }
    },
    subSkill: {
      buff: {
        charlotte: true,
        forced: true,
        init(player, skill) {
          if (!player.storage[skill]) {
            player.storage[skill] = [0, 0, 0, 0];
          }
        },
        onremove: true,
        intro: {
          markcount: () => 0,
          content(storage, player) {
            storage ??= [0, 0, 0, 0];
            let str = "定仪已获得效果：";
            if (!storage.some((i) => i > 0)) {
              return "当前无定仪效果";
            }
            if (storage[0] > 0) {
              str += `<li>摸牌阶段摸牌数+${storage[0]}`;
            }
            if (storage[1] > 0) {
              str += `<li>手牌上限+${storage[1]}`;
            }
            if (storage[2] > 0) {
              str += `<li>攻击范围+${storage[2]}`;
            }
            if (storage[3] > 0) {
              str += `<li>脱离濒死状态时回复+${storage[3]}点体力`;
            }
            return str;
          }
        },
        mod: {
          maxHandcard(player, num) {
            player.storage.mbdingyi_buff ??= [0, 0, 0, 0];
            return num + player.storage.mbdingyi_buff[1];
          },
          attackRange(player, num) {
            player.storage.mbdingyi_buff ??= [0, 0, 0, 0];
            return num + player.storage.mbdingyi_buff[2];
          }
        },
        trigger: { player: ["phaseDrawBegin2", "dyingAfter"] },
        filter(event, player) {
          player.storage.mbdingyi_buff ??= [0, 0, 0, 0];
          if (event.name == "phaseDraw") {
            return !event.numFixed && player.storage.mbdingyi_buff[0] > 0;
          }
          return player.storage.mbdingyi_buff[3] > 0 && player.isDamaged();
        },
        async content(event, trigger, player) {
          player.storage.mbdingyi ??= [0, 0, 0, 0];
          if (trigger.name == "phaseDraw") {
            trigger.num += player.storage.mbdingyi_buff[0];
          } else {
            await player.recover(player.storage.mbdingyi_buff[3]);
          }
        }
      }
    }
  },
  mbzuici: {
    audio: "zuici",
    usable: 1,
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return game.hasPlayer((current) => current.storage?.mbdingyi_buff?.some((i) => i > 0));
    },
    async cost(event, trigger, player) {
      const list = get.zhinangs();
      const result2 = await player.chooseButtonTarget({
        createDialog: ["令一名有“定仪”效果的角色获得一张“智囊”牌然后移去其“定仪”效果", [list, "vcard"]],
        filterTarget(card, player2, target) {
          return target.storage?.mbdingyi_buff?.some((i) => i > 0);
        },
        ai1(button) {
          return 0;
        },
        ai2(target) {
          return get.attitude(get.player(), target);
        }
      }).forResult();
      if (result2?.bool && result2.targets?.length && result2.links?.length) {
        event.result = {
          bool: true,
          targets: result2.targets,
          cost_data: result2.links
        };
      }
    },
    async content(event, trigger, player) {
      const {
        targets: [target],
        cost_data: links
      } = event;
      const card = get.cardPile((card2) => card2.name == links[0][2]);
      if (card) {
        await target.gain({ cards: [card], animate: "gain2" });
      }
      target.removeSkill("mbdingyi_buff");
      player.unmarkAuto(event.name + "_clear", [target]);
    },
    ai: { combo: ["mbdingyi", "mbfubi"] }
  },
  mbfubi: {
    audio: "fubi",
    enable: "phaseUse",
    usable: 1,
    filterTarget: true,
    async content(event, trigger, player) {
      const { target } = event;
      const storage = target.storage.mbdingyi_buff ?? [0, 0, 0, 0];
      const result2 = await player.chooseButton({
        createDialog: [
          `辅弼：令${get.translation(target)}获得一个“定仪”效果或令其所有“定仪”效果翻倍`,
          [
            [
              ["draw", "摸牌阶段摸牌数+1"],
              ["maxhand", "手牌上限+2"],
              ["attack", "攻击范围+1"],
              ["dying", "脱离濒死状态时回复1点体力"],
              ["double", `令${get.translation(target)}所有“定仪”效果翻倍`]
            ],
            "textbutton"
          ]
        ],
        filterButton(button) {
          const { storage: storage2 } = get.event();
          const link = button.link;
          switch (link) {
            case "draw":
              return storage2[0] == 0;
            case "maxhand":
              return storage2[1] == 0;
            case "attack":
              return storage2[2] == 0;
            case "dying":
              return storage2[3] == 0;
            default:
              return storage2.some((i) => i > 0);
          }
        },
        forced: true,
        ai(button) {
          const link = button.link;
          switch (link) {
            case "draw":
              return 10;
            case "maxhand":
              return 8;
            case "attack":
              return 3;
            case "dying":
              return 5;
            default:
              return 2;
          }
        }
      }).set("storage", storage).forResult();
      if (result2?.bool && result2.links?.length) {
        const link = result2.links[0];
        target.addSkill("mbdingyi_buff");
        switch (link) {
          case "draw":
            storage[0]++;
            break;
          case "maxhand":
            storage[1] += 2;
            break;
          case "attack":
            storage[2]++;
            break;
          case "dying":
            storage[3]++;
            break;
          default:
            storage[0] *= 2;
            storage[1] *= 2;
            storage[2] *= 2;
            storage[3] *= 2;
        }
        target.setStorage("mbdingyi_buff", storage, true);
        if (link == "double") {
          game.log(player, "令", target, "的“定仪”效果翻倍");
          player.addSkill(event.name + "_clear");
          player.markAuto(event.name + "_clear", [target]);
        }
      }
    },
    ai: {
      order: 5,
      result: {
        player: 1,
        target: 1
      }
    },
    subSkill: {
      clear: {
        charlotte: true,
        silent: true,
        popup: false,
        trigger: { player: "phaseUseBegin" },
        onremove: true,
        async content(event, trigger, player) {
          const targets = player.getStorage(event.name);
          for (const target of targets) {
            const storage = target.storage.mbdingyi_buff ?? [0, 0, 0, 0];
            if (storage.some((i) => i > 1)) {
              for (let i = 0; i < 4; i++) {
                if (storage[i] > 1) {
                  const num = Math.ceil(storage[i] / 2);
                  storage[i] -= num;
                }
              }
              target.setStorage("mbdingyi_buff", storage, true);
            }
          }
          player.removeSkill(event.name);
        }
      }
    }
  },
  //神孙策
  yingba: {
    audio: 2,
    mod: {
      aiOrder(player, card, num) {
        if (num > 0 && _status.event && _status.event.type === "phase" && get.tag(card, "recover")) {
          if (player.needsToDiscard()) {
            return num / 3;
          }
          return 0;
        }
      },
      targetInRange(card, player, target) {
        if (target.hasMark("yingba_mark")) {
          return true;
        }
      },
      cardUsableTarget(card, player, target) {
        if (target.hasMark("yingba_mark")) {
          return Infinity;
        }
      }
    },
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => get.info("yingba").filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return target !== player && target.maxHp > 1;
    },
    async content(event, trigger, player) {
      const { target } = event;
      await target.loseHp();
      if (target?.isIn()) {
        await target.loseMaxHp();
        target.addSkill("yingba_mark");
        target.addMark("yingba_mark", 1);
      }
      await player.loseMaxHp();
    },
    locked: false,
    group: ["yingba_limit"],
    ai: {
      threaten(player, target) {
        if (player === target || player.isDamaged() || get.attitude(player, target) > 0) {
          return 1;
        }
        return 8 / player.maxHp;
      },
      order: 11,
      result: {
        player(player, target) {
          if (player.maxHp === 1) {
            return -2.5;
          }
          return -0.25;
        },
        target(player, target) {
          if (target.isHealthy()) {
            return -2;
          }
          if (!target.hasMark("yingba_mark")) {
            return -1;
          }
          return -0.2;
        }
      }
    },
    subSkill: {
      limit: {
        silent: true,
        trigger: { player: "useCard1" },
        filter(event, player) {
          return event.targets?.some((target) => target.hasMark("yingba_mark")) && event.addCount != false;
        },
        async content(event, trigger, player) {
          trigger.addCount = false;
          const stat = player.getStat().card, name = trigger.card.name;
          if (typeof stat[name] === "number") {
            stat[name]--;
          }
        }
      },
      mark: {
        marktext: "定",
        intro: {
          name: "平定",
          content(storage, player) {
            const num = player.countHistory("useCard");
            return `<li>当前拥有${storage}个平定标记且每回合使用的前${storage}张牌不能指定拥有〖英霸〗的角色<li>本回合已使用${num}张牌`;
          },
          onunmark: true
        },
        charlotte: true,
        countUseCard(player) {
          return player.countHistory("useCard");
        },
        mod: {
          playerEnabled(card, player, target) {
            if (!target.hasSkill("yingba", null, false, false) || !player.hasMark("yingba_mark")) {
              return;
            }
            const num = get.info("yingba_mark").countUseCard(player);
            if (num < player.countMark("yingba_mark")) {
              return false;
            }
          }
        }
      }
    }
  },
  scfuhai: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    forced: true,
    filter(event, player) {
      return event.target.hasMark("yingba_mark");
    },
    logTarget: "target",
    async content(event, trigger, player) {
      trigger.getParent().directHit.add(trigger.target);
      if (player.getHistory("gain", (evt) => evt.getParent(2).name === "scfuhai").length < 2) {
        await player.draw();
      }
    },
    group: ["scfuhai_die"],
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        return arg && arg.target && arg.target.hasMark("yingba_mark");
      },
      combo: "yingba"
    },
    subSkill: {
      usea: {
        audio: "scfuhai",
        trigger: { player: "useCardAfter" },
        forced: true,
        filter(event, player) {
          return lib.skill.scfuhai_usea.logTarget(event, player).length > 0;
        },
        logTarget(event, player) {
          return event.targets.filter((target) => target.hasMark("yingba_mark")).sortBySeat();
        },
        async content(event, trigger, player) {
          let num = 0;
          for (const target of trigger.targets) {
            const numx = target.countMark("yingba_mark");
            if (numx) {
              num += numx;
              target.clearMark("yingba_mark");
            }
          }
          if (num) {
            await player.gainMaxHp(num);
          }
        }
      },
      die: {
        audio: "scfuhai",
        trigger: { global: "die" },
        forced: true,
        filter(event, player) {
          return event.player.hasMark("yingba_mark");
        },
        async content(event, trigger, player) {
          const num = trigger.player.countMark("yingba_mark");
          await player.gainMaxHp(num);
          await player.draw(num);
        }
      }
    }
  },
  pinghe: {
    derivation: "yingba",
    audio: 2,
    mod: {
      maxHandcardBase(player) {
        return player.maxHp;
      }
    },
    trigger: { player: "damageBegin4" },
    forced: true,
    filter(event, player) {
      return event.source && event.source !== player && player.maxHp > 1 && player.hasCards("he");
    },
    async content(event, trigger, player) {
      trigger.cancel();
      await player.loseMaxHp();
      if (!player.hasCards("he")) {
        return;
      }
      const controls = [], choiceList = ["交给其他角色一张牌", "重铸一张牌"];
      if (game.hasPlayer((current) => current != player)) {
        controls.push("给牌");
      } else {
        choiceList[0] = `<span style="opacity:0.5">` + choiceList[0] + "</span>";
      }
      controls.push("重铸牌");
      let result2;
      result2 = controls.length > 1 ? await player.chooseControl({
        prompt: "冯河：请选择一项",
        controls,
        choiceList,
        ai() {
          const player2 = get.player();
          if (game.hasPlayer((current) => current != player2 && get.attitude(player2, current) > 0) && player2.countCards("h") > 3) {
            return "给牌";
          }
          return "重铸牌";
        }
      }).forResult() : { control: controls[0] };
      if (typeof result2?.control == "string") {
        const control = result2.control;
        if (control == "给牌") {
          result2 = await player.chooseCardTarget({
            prompt: "冯河：将一张牌交给一名其他角色",
            filterCard: true,
            forced: true,
            filterTarget: lib.filter.notMe,
            position: "he",
            ai1(card) {
              const player2 = get.player();
              if (get.tag(card, "recover") && !game.hasPlayer((current) => get.attitude(current, player2) > 0 && !current.hasSkillTag("nogain"))) {
                return 0;
              }
              return 1 / Math.max(0.1, get.value(card));
            },
            ai2(target) {
              const player2 = get.player();
              let att = get.attitude(player2, target);
              if (target.hasSkillTag("nogain")) {
                att /= 9;
              }
              return 4 + att;
            }
          }).forResult();
        } else {
          result2 = await player.chooseCard({
            prompt: "冯河：请重铸一张牌",
            filterCard(card, player2) {
              return lib.filter.cardRecastable(card, player2);
            },
            forced: true,
            position: "he",
            ai(card) {
              return 5 - get.value(card);
            }
          }).forResult();
        }
        if (result2?.bool && result2.cards?.length) {
          const { targets, cards: cards2 } = result2;
          if (targets?.length) {
            player.line(targets, "green");
            await player.give(cards2, targets[0]);
          } else {
            await player.recast(cards2);
          }
          if (trigger.source?.isIn() && player.hasSkill("yingba")) {
            trigger.source.addSkill("yingba_mark");
            trigger.source.addMark("yingba_mark", 1);
          }
        }
      }
    },
    ai: {
      maixie_defend: true,
      effect: {
        target(card, player, target) {
          if (player !== target && target.maxHp > 1 && target.countCards("h") > 0) {
            if (get.tag(card, "damage") && target.hasSkill("yingba")) {
              let damage = 1.6;
              if (target.isHealthy()) {
                damage += 1.6;
              }
              if (game.hasPlayer((cur) => cur !== target && get.attitude(target, cur) > 0)) {
                damage -= 0.9;
              }
              return [0, -damage, 0, -0.4];
            }
            if (card.name === "tiesuo") {
              return 0.4;
            }
          }
          if (get.tag(card, "recover") && _status.event.type === "phase" && !player.needsToDiscard()) {
            return 0;
          }
        }
      }
    }
  },
  tianzuo: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter(event, player) {
      return (event.name !== "phase" || game.phaseNumber === 0) && !lib.inpile.includes("qizhengxiangsheng");
    },
    async content(event, trigger, player) {
      game.addGlobalSkill("tianzuo_global");
      const cards2 = [];
      for (let i = 2; i < 10; i++) {
        cards2.push(game.createCard2("qizhengxiangsheng", i % 2 ? "club" : "spade", i));
      }
      game.broadcastAll(() => void lib.inpile.add("qizhengxiangsheng"));
      game.cardsGotoPile(cards2, () => ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)]);
    },
    group: "tianzuo_remove",
    subSkill: {
      remove: {
        audio: "tianzuo",
        trigger: { target: "useCardToBefore" },
        forced: true,
        priority: 15,
        filter(event, player) {
          return event.card && event.card.name === "qizhengxiangsheng";
        },
        async content(event, trigger, player) {
          trigger.cancel();
        },
        ai: {
          effect: {
            target(card, player, target) {
              if (card && card.name === "qizhengxiangsheng") {
                return "zeroplayertarget";
              }
            }
          }
        }
      },
      global: {
        trigger: { player: "useCardToPlayered" },
        forced: true,
        popup: false,
        filter(event, player) {
          return event.card.name === "qizhengxiangsheng";
        },
        async content(event, trigger, player) {
          const target = trigger.target;
          event.target = target;
          let result2 = await player.chooseControl("奇兵", "正兵").set("prompt", `请选择${get.translation(target)}的标记`).set(
            "choice",
            (() => {
              let e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
              let e2 = 0;
              if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
                e2 = -1;
              }
              let es = target.getGainableCards(player, "e");
              if (es.length) {
                e2 = Math.min(
                  e2,
                  (() => {
                    let max = 0;
                    for (const i of es) {
                      max = Math.max(max, get.value(i, target));
                    }
                    return -max / 4;
                  })()
                );
              }
              if (Math.abs(e1 - e2) <= 0.3) {
                return Math.random() < 0.5 ? "奇兵" : "正兵";
              }
              if (e1 < e2) {
                return "奇兵";
              }
              return "正兵";
            })()
          ).set("ai", () => _status.event.choice).forResult();
          let map = trigger.getParent().customArgs;
          let id = target.playerid;
          if (!map[id]) {
            map[id] = {};
          }
          map[id].qizheng_name = result2.control;
        }
      },
      rewrite: {
        audio: "tianzuo",
        trigger: { global: "useCardToTargeted" },
        filter(event, player) {
          return event.card.name === "qizhengxiangsheng";
        },
        logTarget: "target",
        prompt2: "观看其手牌并修改“奇正相生”标记",
        async content(event, trigger, player) {
          let target = trigger.target;
          event.target = target;
          if (player !== target && target.countCards("h") > 0) {
            await player.viewHandcards(target);
          }
          let result2 = await player.chooseControl("奇兵", "正兵").set("prompt", `请选择${get.translation(target)}的标记`).set(
            "choice",
            (() => {
              let shas = target.getCards("h", "sha");
              let shans = target.getCards("h", "shan");
              let e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
              let e2 = 0;
              if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
                e2 = -1;
              }
              let es = target.getGainableCards(player, "e");
              if (es.length) {
                e2 = Math.min(
                  e2,
                  (() => {
                    let max = 0;
                    for (const i of es) {
                      max = Math.max(max, get.value(i, target));
                    }
                    return -max / 4;
                  })()
                );
              }
              if (get.attitude(player, target) > 0) {
                if (shas.length >= Math.max(1, shans.length)) {
                  return "奇兵";
                }
                if (shans.length > shas.length) {
                  return "正兵";
                }
                return e1 > e2 ? "奇兵" : "正兵";
              }
              if (shas.length) {
                e1 = -0.5;
              }
              if (shans.length) {
                e2 = -0.7;
              }
              if (Math.abs(e1 - e2) <= 0.3) {
                return Math.random() < 0.5 ? "奇兵" : "正兵";
              }
              let rand = Math.random();
              if (e1 < e2) {
                return rand < 0.1 ? "奇兵" : "正兵";
              }
              return rand < 0.1 ? "正兵" : "奇兵";
            })()
          ).set("ai", () => _status.event.choice).forResult();
          let map = trigger.getParent().customArgs;
          let id = target.playerid;
          if (!map[id]) {
            map[id] = {};
          }
          map[id].qizheng_name = result2.control;
          map[id].qizheng_aibuff = get.attitude(player, target) > 0;
        }
      }
    }
  },
  lingce: {
    audio: 2,
    init: (player) => {
      game.addGlobalSkill("lingce_global");
    },
    trigger: { global: "useCard" },
    forced: true,
    filter(event, player) {
      if (!event.card.isCard || !event.cards || event.cards.length !== 1) {
        return false;
      }
      return event.card.name === "qizhengxiangsheng" || get.zhinangs().includes(event.card.name) || player.getStorage("dinghan").includes(event.card.name);
    },
    async content(event, trigger, player) {
      await player.draw();
    },
    subSkill: {
      global: {
        ai: {
          effect: {
            player_use(card, player, target) {
              if (typeof card !== "object") {
                return;
              }
              let num = 0;
              let nohave = true;
              game.countPlayer((i) => {
                if (i.hasSkill("lingce", null, null, false)) {
                  nohave = false;
                  if (i.isIn() && lib.skill.lingce.filter(
                    {
                      card,
                      cards: card.cards ? card.cards : [card]
                    },
                    i
                  )) {
                    num += get.sgnAttitude(player, i);
                  }
                }
              }, true);
              if (nohave) {
                game.removeGlobalSkill("lingce_global");
              } else {
                return [1, 0.8 * num];
              }
            }
          }
        }
      }
    }
  },
  dinghan: {
    audio: 2,
    trigger: {
      target: "useCardToTarget",
      player: "addJudgeBefore"
    },
    forced: true,
    locked: false,
    filter(event, player) {
      if (event.name === "useCardToTarget" && get.type(event.card, null, false) !== "trick") {
        return false;
      }
      return !player.getStorage("dinghan").includes(event.card.name);
    },
    async content(event, trigger, player) {
      player.markAuto("dinghan", [trigger.card.name]);
      if (trigger.name === "addJudge") {
        trigger.cancel();
        if (trigger.card?.cards?.length) {
          const map = /* @__PURE__ */ new Map();
          const targets = [];
          for (const card of trigger.card.cards) {
            const owner = get.owner(card);
            if (owner) {
              targets.add(owner);
              map.set(owner, (map.get(owner) ?? []).concat([card]));
            }
          }
          if (targets.length) {
            await game.loseAsync({
              map,
              targets,
              cards: trigger.card.cards
            }).setContent(async (event2, trigger2, player2) => {
              const { map: map2, targets: targets2, cards: cards2 } = event2;
              for (const target of targets2) {
                const lose = map2.get(target);
                const next = target.lose(lose, ui.discardPile);
                next.getlx = false;
                await next;
              }
              game.log(cards2, "进入了弃牌堆");
            });
          }
        }
      } else {
        trigger.targets.remove(player);
        trigger.getParent().triggeredTargets2.remove(player);
        trigger.untrigger();
      }
    },
    onremove: true,
    intro: { content: "已记录牌名：$" },
    group: "dinghan_add",
    subSkill: {
      add: {
        trigger: { player: "phaseBegin" },
        direct: true,
        async content(event, trigger, player) {
          let dialog = [get.prompt("dinghan")];
          let list1 = player.getStorage("dinghan");
          let list2 = lib.inpile.filter((i) => get.type2(i, false) === "trick" && !list1.includes(i));
          if (list1.length) {
            dialog.push('<div class="text center">已记录</div>');
            dialog.push([list1, "vcard"]);
          }
          if (list2.length) {
            dialog.push('<div class="text center">未记录</div>');
            dialog.push([list2, "vcard"]);
          }
          let result2 = await player.chooseButton(dialog).set("ai", (button) => {
            let player2 = _status.event.player;
            let name = button.link[2];
            if (player2.getStorage("dinghan").includes(name)) {
              return -get.effect(player2, { name }, player2, player2);
            }
            return get.effect(player2, { name }, player2, player2) * (1 + player2.countCards("hs", name));
          }).forResult();
          if (result2.bool) {
            player.logSkill("dinghan");
            let name = result2.links[0][2];
            if (player.getStorage("dinghan").includes(name)) {
              player.unmarkAuto("dinghan", [name]);
              game.log(player, "从定汉记录中移除了", `#y${get.translation(name)}`);
            } else {
              player.markAuto("dinghan", [name]);
              game.log(player, "向定汉记录中添加了", `#y${get.translation(name)}`);
            }
            await game.delayx();
          }
        }
      }
    }
  },
  dulie: {
    audio: 2,
    trigger: { target: "useCardToTarget" },
    forced: true,
    logTarget: "player",
    filter(event, player) {
      return event.card.name === "sha" && event.player.hp > player.hp;
    },
    async content(event, trigger, player) {
      const next = player.judge((result3) => get.suit(result3) === "heart" ? 2 : -1);
      next.set("judge2", (result3) => result3.bool);
      const result2 = await next.forResult();
      if (result2.bool) {
        trigger.targets.remove(player);
        trigger.getParent().triggeredTargets2.remove(player);
        trigger.untrigger();
      }
    },
    ai: {
      effect: {
        target_use(card, player, target, current, isLink) {
          if (card.name === "sha" && !isLink && player.hp > target.hp) {
            return 0.5;
          }
        }
      }
    },
    marktext: "围",
    intro: {
      name: "破围(围)",
      name2: "围",
      content: "mark"
    }
  },
  tspowei: {
    audio: 3,
    dutySkill: true,
    derivation: "shenzhu",
    group: ["tspowei_init", "tspowei_move", "tspowei_achieve", "tspowei_fail", "tspowei_use", "tspowei_remove"],
    subSkill: {
      remove: {
        audio: "tspowei3.mp3",
        trigger: { global: "damageEnd" },
        filter(event, player) {
          return event.player && event.player.isIn() && event.player.hasMark("dulie");
        },
        forced: true,
        logTarget: "player",
        async content(event, trigger, player) {
          trigger.player.removeMark("dulie", trigger.player.countMark("dulie"));
        }
      },
      use: {
        audio: "tspowei3.mp3",
        trigger: { global: "phaseBegin" },
        direct: true,
        filter(event, player) {
          return event.player !== player && event.player.hasMark("dulie") && (player.countCards("h") > 0 || player.hp >= event.player.hp && event.player.countCards("h") > 0);
        },
        async content(event, trigger, player) {
          let list = [];
          let target = trigger.player;
          let choiceList = ["弃置一张牌并对其造成1点伤害", "获得其一张手牌"];
          event.target = target;
          if (player.hasCard((card) => lib.filter.cardDiscardable(card, player, "tspowei_use"), "h")) {
            list.push("选项一");
          } else {
            choiceList[0] = `<span style="opacity:0.5">${choiceList[0]}</span>`;
          }
          if (player.hp >= target.hp && target.countCards("h") > 0) {
            list.push("选项二");
          } else {
            choiceList[1] = `<span style="opacity:0.5">${choiceList[1]}</span>`;
          }
          let result2 = await player.chooseControl(list, "cancel2").set("prompt", get.prompt("tspowei", target)).set("choiceList", choiceList).set("ai", () => {
            let evt = _status.event.getParent();
            if (evt.player.hasCard((card) => lib.filter.cardDiscardable(card, evt.player, "tspowei_use") && get.value(card, evt.player) < 7, "h") && get.damageEffect(evt.target, evt.player, evt.player) > 0) {
              return "选项一";
            }
            if (evt.player.hp >= evt.target.hp && evt.target.countCards("h") > 0 && get.attitude(evt.player, evt.target) <= 0 && !evt.target.hasSkillTag("noh")) {
              return "选项二";
            }
            return "cancel2";
          }).forResult();
          if (result2.control !== "cancel2") {
            if (result2.control === "选项二") {
              player.logSkill("tspowei_use", target);
              await player.gainPlayerCard(target, "h", true);
            } else if (result2.control === "选项一") {
              await player.chooseToDiscard("h", true).set("logSkill", ["tspowei_use", target]);
              if (get.mode() !== "identity" || player.identity !== "nei") {
                player.addExpose(0.2);
              }
              await target.damage();
            }
            player.addTempSkill("tspowei_inRange");
          } else {
            return;
          }
        },
        ai: { expose: 0.2 }
      },
      inRange: {
        charlotte: true,
        mod: {
          inRangeOf(from, to) {
            if (from === _status.currentPhase) {
              return true;
            }
          }
        }
      },
      init: {
        audio: "tspowei3.mp3",
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        forced: true,
        filter(event, player) {
          return event.name !== "phase" || game.phaseNumber === 0;
        },
        logTarget(event, player) {
          return game.filterPlayer((current) => current !== player && !current.hasMark("dulie"));
        },
        async content(event, trigger, player) {
          const list = game.filterPlayer((current) => current !== player && !current.hasMark("dulie")).sortBySeat();
          for (const current of list) {
            current.addMark("dulie", 1, false);
          }
        }
      },
      move: {
        audio: "tspowei3.mp3",
        trigger: { player: "phaseBegin" },
        forced: true,
        filter(event, player) {
          return game.hasPlayer((current) => current !== player && current.hasMark("dulie"));
        },
        async content(event, trigger, player) {
          const list = game.filterPlayer((current) => current !== player && current.hasMark("dulie")).sortBySeat();
          const map = {};
          for (const current of list) {
            const num = current.countMark("dulie");
            current.removeMark("dulie", num);
            map[current.playerid] = num;
          }
          for (const current of list) {
            let next = current.next;
            if (next === player) {
              next = next.next;
            }
            next.addMark("dulie", map[current.playerid]);
          }
        }
      },
      achieve: {
        audio: "tspowei1.mp3",
        trigger: { player: "phaseBegin" },
        forced: true,
        skillAnimation: true,
        animationColor: "metal",
        filter(event, player) {
          return !game.hasPlayer((current) => current.hasMark("dulie"));
        },
        async content(event, trigger, player) {
          game.log(player, "成功完成使命");
          player.awakenSkill("tspowei");
          player.addSkills("shenzhu");
        }
      },
      fail: {
        audio: "tspowei2.mp3",
        trigger: { player: "dying" },
        forced: true,
        async content(event, trigger, player) {
          game.log(player, "使命失败");
          player.awakenSkill("tspowei");
          if (player.hp < 1) {
            await player.recover(1 - player.hp);
          }
          const num = player.countCards("e");
          if (num > 0) {
            await player.chooseToDiscard("e", true, num);
          }
        }
      }
    }
  },
  shenzhu: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    forced: true,
    filter(event, player) {
      return event.card.name === "sha" && event.card.isCard && event.cards.length === 1;
    },
    async content(event, trigger, player) {
      const result2 = await player.chooseControl().set("choiceList", ["摸一张牌，且本回合使用【杀】的次数上限+1", "摸三张牌，且本回合不能再使用【杀】"]).set("ai", () => _status.event.player.hasSha() ? 0 : 1).forResult();
      if (result2.index === 0) {
        await player.draw();
        player.addTempSkill("shenzhu_more");
        player.addMark("shenzhu_more", 1, false);
      } else {
        await player.draw(3);
        player.addTempSkill("shenzhu_less");
      }
    },
    subSkill: {
      more: {
        charlotte: true,
        onremove: true,
        mod: {
          cardUsable(card, player, num) {
            if (card.name === "sha") {
              return num + player.countMark("shenzhu_more");
            }
          }
        }
      },
      less: {
        charlotte: true,
        mod: {
          cardEnabled(card) {
            if (card.name === "sha") {
              return false;
            }
          }
        }
      }
    }
  },
  dangmo: {
    audio: 2,
    trigger: { player: "useCard2" },
    direct: true,
    filter(event, player) {
      if (event.card.name !== "sha" || player.hp <= 1) {
        return false;
      }
      let evt = event.getParent("phaseUse");
      return evt && evt.player === player && player.getHistory("useCard", (evtx) => evtx.card.name === "sha" && evtx.getParent("phaseUse") === evt)[0] === event && game.hasPlayer((current) => !event.targets.includes(current) && lib.filter.filterTarget(event.card, player, current));
    },
    async content(event, trigger, player) {
      let num = Math.min(
        player.hp - 1,
        game.countPlayer((current) => !trigger.targets.includes(current) && lib.filter.filterTarget(trigger.card, player, current))
      );
      let result2 = await player.chooseTarget(get.prompt("dangmo"), `为${get.translation(trigger.card)}增加至多${get.translation(num)}个目标`, [1, num], (card, player2, target) => {
        let evt = _status.event.getTrigger();
        return !evt.targets.includes(target) && lib.filter.filterTarget(evt.card, player2, target);
      }).set("ai", (target) => {
        let evt = _status.event.getTrigger();
        let eff = get.effect(target, evt.card, evt.player, evt.player);
        if (player.hasSkill("tspowei") && target.hasMark("dulie")) {
          return 4 * eff;
        }
        return eff;
      }).forResult();
      if (result2.bool) {
        if (player !== game.me && !player.isOnline()) {
          game.delayx();
        }
        event.targets = result2.targets;
      } else {
        return;
      }
      player.logSkill("dangmo", event.targets);
      trigger.targets.addArray(event.targets);
    }
  },
  reshuishi: {
    audio: "shuishi",
    enable: "phaseUse",
    usable: 1,
    frequent: true,
    manualConfirm: true,
    filter(event, player) {
      return player.maxHp < 10;
    },
    async content(event, trigger, player) {
      event.cards = [];
      event.suits = [];
      event.again = true;
      while (event.again) {
        event.again = false;
        await player.judge((result3) => {
          let evt = _status.event.getParent("reshuishi");
          if (evt && evt.suits && evt.suits.includes(get.suit(result3))) {
            return 0;
          }
          return 1;
        }).set("callback", lib.skill.reshuishi.callback).set("judge2", (result3) => result3.bool);
      }
      const cards2 = event.cards.filterInD();
      if (!cards2.length) {
        return;
      }
      const result2 = await player.chooseTarget(`将${get.translation(cards2)}交给一名角色`, true).set("ai", (target2) => {
        let player2 = _status.event.player;
        let att = get.attitude(player2, target2);
        if (att <= 0) {
          return att;
        }
        if (target2.countCards("h") + _status.event.num >= _status.event.max) {
          att /= 3;
        }
        if (target2.hasSkillTag("nogain")) {
          att /= 10;
        }
        return att;
      }).set("num", cards2.length).set(
        "max",
        game.filterPlayer().reduce((num, i) => Math.max(num, i.countCards("h")), 0)
      ).forResult();
      if (!result2.bool) {
        return;
      }
      const target = result2.targets[0];
      event.target = target;
      player.line(target, "green");
      await target.gain(cards2, "gain2").set("giver", player);
      if (target.isMaxHandcard()) {
        await player.loseMaxHp();
      }
    },
    async callback(event, trigger, player) {
      const evt = event.getParent(2);
      event.getParent().orderingCards.remove(event.judgeResult.card);
      evt.cards.push(event.judgeResult.card);
      if (!event.getParent().result.bool || player.maxHp >= 10) {
        return;
      }
      evt.suits.push(event.getParent().result.suit);
      await player.gainMaxHp();
      const result2 = await player.chooseBool("是否继续发动【慧识】？").set("frequentSkill", "reshuishi").forResult();
      if (result2.bool) {
        event.getParent(2).again = true;
      }
    },
    ai: {
      order: 9,
      result: {
        player: 1
      }
    }
  },
  shuishi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.maxHp < 10;
    },
    filterTarget: true,
    async content(event, trigger, player) {
      const { target } = event;
      while (true) {
        let result2 = await target.draw().forResult();
        if (!result2.bool || !Array.isArray(result2.cards) || result2.cards.length !== 1 || get.itemtype(result2.cards[0]) !== "card") {
          return;
        }
        const card = result2.cards[0];
        const suit = get.suit(card);
        const hs = target.getCards("h");
        if (hs.some((cardx) => cardx !== card && get.suit(cardx, target) === suit)) {
          await player.loseMaxHp();
          await target.showHandcards();
          return;
        }
        await player.gainMaxHp();
        if (player.maxHp >= 10) {
          return;
        }
        result2 = await player.chooseBool("是否继续发动【慧识】？").forResult();
        if (!result2.bool) {
          return;
        }
      }
    },
    ai: {
      order: 0.5,
      result: {
        target: 0.2,
        player(player, target) {
          let list = [];
          let hs = target.getCards("h");
          for (const i of hs) {
            list.add(get.suit(i, target));
          }
          if (list.length === 0) {
            return 0;
          }
          if (list.length === 1) {
            return player.maxHp > 2 ? 0 : -2;
          }
          if (list.length === 2) {
            return player.maxHp > 3 ? 0 : -2;
          }
          return -2;
        }
      }
    }
  },
  stianyi: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "gray",
    filter(event, player) {
      return !game.hasPlayer((current) => current.getAllHistory("damage").length === 0);
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.gainMaxHp(2);
      await player.recover();
      const next = player.chooseTarget(true, "令一名角色获得技能〖佐幸〗");
      next.set("ai", (target) => get.attitude(_status.event.player, target));
      const result2 = await next.forResult();
      if (result2.bool) {
        const target = result2.targets[0];
        player.line(target, "green");
        target.storage.zuoxing = player;
        await target.addSkills("zuoxing");
      }
    },
    derivation: "zuoxing"
  },
  zuoxing: {
    audio: 3,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      let target = player.storage.zuoxing;
      if (!target || !target.isIn() || target.maxHp < 2) {
        return false;
      }
      for (const i of lib.inpile) {
        if (get.type(i) === "trick" && event.filterCard({ name: i, isCard: true }, player, event)) {
          return true;
        }
      }
      return false;
    },
    chooseButton: {
      dialog(event, player) {
        let list = [];
        for (const i of lib.inpile) {
          if (get.type(i) === "trick" && event.filterCard({ name: i, isCard: true }, player, event)) {
            list.push(["锦囊", "", i]);
          }
        }
        return ui.create.dialog("佐幸", [list, "vcard"]);
      },
      check(button) {
        return _status.event.player.getUseValue({ name: button.link[2], isCard: true });
      },
      backup(links, player) {
        return {
          viewAs: {
            name: links[0][2],
            isCard: true
          },
          filterCard: () => false,
          selectCard: -1,
          popname: true,
          log: false,
          async precontent(event, trigger, player2) {
            player2.logSkill("zuoxing");
            const target = player2.storage.zuoxing;
            await target.loseMaxHp();
          }
        };
      },
      prompt(links, player) {
        return `请选择${get.translation(links[0][2])}的目标`;
      }
    },
    ai: { order: 1, result: { player: 1 } }
  },
  resghuishi: {
    onChooseToUse(event) {
      event.targetprompt2.add((target) => {
        if (event.skill !== "resghuishi" || !target.classList.contains("selectable")) {
          return;
        }
        if (event.player.maxHp >= game.players.length && target.getSkills(null, false, false).some((skill) => {
          const info = get.info(skill);
          return info?.juexingji && !target.awakenedSkills.includes(skill);
        })) {
          return "觉醒";
        }
        return "摸牌";
      });
    },
    audio: "sghuishi",
    enable: "phaseUse",
    filterTarget: true,
    limited: true,
    skillAnimation: true,
    animationColor: "water",
    prompt() {
      const player = get.player();
      if (player.maxHp >= game.players.length) {
        return "选择一名角色。若其拥有未发动过的觉醒技，则你解除其中一个觉醒技的发动限制；否则其摸四张牌。然后你减2点体力上限。";
      }
      return "令一名角色摸四张牌，然后你减2点体力上限。";
    },
    async content(event, trigger, player) {
      const { target } = event;
      player.awakenSkill(event.name);
      const list = target.getSkills(null, false, false).filter((skill) => {
        const info = get.info(skill);
        return info?.juexingji && !target.awakenedSkills.includes(skill);
      });
      if (player.maxHp >= game.players.length && list.length > 0) {
        const result2 = list.length === 1 ? { bool: true, links: list } : await player.chooseButton([`辉逝：选择一个觉醒技，令${get.translation(target)}可无视条件发动该技能`, [list, "skill"]], true).set("displayIndex", false).forResult();
        if (result2?.bool && result2.links?.length) {
          const [skill] = result2.links;
          target.storage.resghuishi_mark = skill;
          target.markSkill("resghuishi_mark");
          const info = get.info(skill);
          if (info.filter && !info.charlotte && !info.resghuishi_filter) {
            info.resghuishi_filter = info.filter;
            info.filter = (event2, player2, ...args) => {
              if (player2.storage.resghuishi_mark) {
                return true;
              }
              return info.resghuishi_filter(event2, player2, ...args);
            };
          }
        }
      } else {
        await target.draw(4);
      }
      await player.loseMaxHp(2);
    },
    ai: {
      order: 0.1,
      expose: 0.2,
      result: {
        target(player, target) {
          if (target !== player && player.hasUnknown() || player.maxHp < (player.getDamagedHp() > 1 ? 5 : 6)) {
            return 0;
          }
          if (target === player && player.hasSkill("resghuishi") && game.hasPlayer((current) => current.getAllHistory("damage").length === 0)) {
            return 4;
          }
          let list = target.getSkills(null, false, false).filter((skill) => {
            let info = lib.skill[skill];
            return info && info.juexingji && !target.awakenedSkills.includes(skill);
          });
          if (list.length || target.hasJudge("lebu") || target.hasSkillTag("nogain")) {
            return 0;
          }
          return 4;
        }
      }
    },
    subSkill: { mark: { charlotte: true, intro: { content: "发动【$】时无视条件" } } }
  },
  sghuishi: {
    onChooseToUse(event) {
      event.targetprompt2.add((target) => {
        if (event.skill !== "sghuishi" || !target.classList.contains("selectable")) {
          return;
        }
        if (target.getSkills(null, false, false).some((skill) => {
          const info = get.info(skill);
          return info?.juexingji && !target.awakenedSkills.includes(skill);
        })) {
          return "觉醒";
        }
        return "摸牌";
      });
    },
    audio: 2,
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "water",
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const { target } = event;
      player.awakenSkill(event.name);
      const list = target.getSkills(null, false, false).filter((skill) => {
        const info = get.info(skill);
        return info?.juexingji && !target.awakenedSkills.includes(skill);
      });
      if (list.length) {
        target.addMark(event.name, 1, false);
        for (const skill of list) {
          const info = get.info(skill);
          if (info.filter && !info.charlotte && !info.sghuishi_filter) {
            info.sghuishi_filter = info.filter;
            info.filter = (event2, player2, ...args) => {
              if (player2.hasMark("sghuishi")) {
                return true;
              }
              return info.sghuishi_filter(event2, player2, ...args);
            };
          }
        }
      } else {
        await target.draw(4);
      }
      await player.loseMaxHp(2);
    },
    intro: { content: "发动非Charlotte觉醒技时无视条件" },
    ai: {
      order: 0.1,
      expose: 0.2,
      result: {
        target(player, target) {
          if (player.hasUnknown() || player.maxHp < 5) {
            return 0;
          }
          let list = target.getSkills(null, false, false).filter((skill) => {
            let info = lib.skill[skill];
            return info && info.juexingji;
          });
          if (list.length || target.hasJudge("lebu") || target.hasSkillTag("nogain")) {
            return 0;
          }
          return 4;
        }
      }
    }
  },
  //神鲁肃
  dingzhou: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      const num = player.countCards("he");
      return game.hasPlayer((current) => {
        if (current === player) {
          return false;
        }
        const total = current.countCards("ej");
        return total > 0 && num >= total;
      });
    },
    filterCard: true,
    selectCard() {
      return [1, Math.max(...game.filterPlayer((i) => i !== get.player()).map((i) => i.countCards("ej")))];
    },
    check(card) {
      return 7 - get.value(card);
    },
    filterTarget(card, player, target) {
      const num = target.countCards("ej");
      if (!num) {
        return false;
      }
      return ui.selected.cards.length === num && player !== target;
    },
    filterOk() {
      return ui.selected.cards.length === ui.selected.targets[0].countCards("ej");
    },
    position: "he",
    lose: false,
    discard: false,
    delay: false,
    async content(event, trigger, player) {
      const target = event.targets[0];
      await player.give(event.cards, target);
      const cards2 = target.getGainableCards(player, "ej");
      if (cards2.length) {
        player.gain(cards2, "give", target);
      }
    },
    ai: {
      order: 9,
      result: {
        target(player, target) {
          let eff = 0;
          if (ui.selected.cards.length) {
            eff = ui.selected.cards.map((card) => get.value(card)).reduce((p, c) => p + c, 0);
          }
          if (player.hasSkill("zhimeng") && (get.mode() === "identity" || player.countCards("h") - target.countCards("h") > 2 * ui.selected.cards.length)) {
            eff *= 1 + get.sgnAttitude(player, target) * 0.15;
          }
          const es = target.getCards("e");
          const js = target.getCards("j");
          es.forEach((card) => {
            eff -= get.value(card, target);
          });
          js.forEach((card) => {
            eff -= get.effect(
              target,
              {
                name: card.viewAs || card.name,
                cards: [card]
              },
              target,
              target
            );
          });
          return eff;
        }
      }
    }
  },
  tamo: {
    available(mode) {
      if (["boss", "stone", "tafang"].includes(mode) || ["jiange", "standard", "three", "leader"].includes(_status.mode) || get.config("seat_order") === "指定") {
        return false;
      }
    },
    getTargets() {
      return game.filterPlayer((current) => !current.isZhu2() && (get.mode() !== "doudizhu" || current.getSeatNum() !== 3));
    },
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    filter(event, player) {
      return (event.name !== "phase" || game.phaseNumber === 0) && get.info("tamo").getTargets().length > 1;
    },
    seatRelated: "changeSeat",
    derivation: "tamo_faq",
    frequent: true,
    async content(event, trigger, player) {
      const toSortPlayers = get.info(event.name).getTargets();
      toSortPlayers.sortBySeat(game.findPlayer2((current) => current.getSeatNum() === 1, true));
      const next = player.chooseToMove(lib.translate[`${event.name}_info`]);
      next.set("list", [["（以下排列的顺序即为发动技能后角色的座次顺序）", [toSortPlayers.map((i) => `${i.getSeatNum()}|${i.name}`), lib.skill.tamo.$createButton]]]);
      next.set("toSortPlayers", toSortPlayers.slice(0));
      next.set("processAI", () => {
        const players = get.event().toSortPlayers;
        const player2 = get.player();
        players.randomSort().sort((a, b) => get.attitude(player2, b) - get.attitude(player2, a));
        return [players.map((i) => `${i.getSeatNum()}|${i.name}`)];
      });
      const result2 = await next.forResult();
      const moved = result2?.moved;
      const resultList = moved[0].map((info) => parseInt(info.split("|")[0]));
      const toSwapList = [];
      const cmp = (a, b) => resultList.indexOf(a) - resultList.indexOf(b);
      for (let i = 0; i < toSortPlayers.length; i++) {
        for (let j = 0; j < toSortPlayers.length; j++) {
          if (cmp(toSortPlayers[i].getSeatNum(), toSortPlayers[j].getSeatNum()) < 0) {
            toSwapList.push([toSortPlayers[i], toSortPlayers[j]]);
            [toSortPlayers[i], toSortPlayers[j]] = [toSortPlayers[j], toSortPlayers[i]];
          }
        }
      }
      game.broadcastAll((toSwapList2) => {
        for (const list of toSwapList2) {
          game.swapSeat(list[0], list[1], false);
        }
      }, toSwapList);
      if (trigger.name === "phase" && !trigger.player.isZhu2() && trigger.player !== toSortPlayers[0] && !trigger._finished) {
        trigger.finish();
        trigger._triggered = 5;
        const evt = toSortPlayers[0].insertPhase();
        delete evt.skill;
        const evt2 = trigger.getParent();
        if (evt2.name === "phaseLoop" && evt2._isStandardLoop) {
          evt2.player = toSortPlayers[0];
        }
        evt.pushHandler("onPhase", (event2, option) => {
          if (event2.step === 0 && option.state === "begin") {
            event2.step = 1;
          }
        });
      }
      await game.delay();
    },
    $createButton(item, type, position, noclick, node) {
      const info = item.split("|");
      const _item = item;
      const seat = parseInt(info[0]);
      item = info[1];
      if (node) {
        node.classList.add("button");
        node.classList.add("character");
        node.style.display = "";
      } else {
        node = ui.create.div(".button.character", position);
      }
      node._link = item;
      node.link = item;
      const func = (node2, item2) => {
        const currentPlayer = game.findPlayer((current) => current.getSeatNum() === seat);
        if (currentPlayer.classList.contains("unseen_show")) {
          node2.setBackground("hidden_image", "character");
        } else if (item2 !== "unknown") {
          node2.setBackground(item2, "character");
        }
        if (node2.node) {
          node2.node.name.remove();
          node2.node.hp.remove();
          node2.node.group.remove();
          node2.node.intro.remove();
          if (node2.node.replaceButton) {
            node2.node.replaceButton.remove();
          }
        }
        node2.node = {
          name: ui.create.div(".name", node2),
          group: ui.create.div(".identity", node2),
          intro: ui.create.div(".intro", node2)
        };
        const infoitem = [currentPlayer.sex, currentPlayer.group, `${currentPlayer.hp}/${currentPlayer.maxHp}/${currentPlayer.hujia}`];
        node2.node.name.innerHTML = get.slimName(item2);
        if (lib.config.buttoncharacter_style === "default" || lib.config.buttoncharacter_style === "simple") {
          if (lib.config.buttoncharacter_style === "simple") {
            node2.node.group.style.display = "none";
          }
          node2.classList.add("newstyle");
          node2.node.name.dataset.nature = get.groupnature(get.bordergroup(infoitem));
          node2.node.group.dataset.nature = get.groupnature(get.bordergroup(infoitem), "raw");
        }
        node2.node.name.style.top = "8px";
        if (node2.node.name.querySelectorAll("br").length >= 4) {
          node2.node.name.classList.add("long");
          if (lib.config.buttoncharacter_style === "old") {
            node2.addEventListener("mouseenter", ui.click.buttonnameenter);
            node2.addEventListener("mouseleave", ui.click.buttonnameleave);
          }
        }
        node2.node.intro.innerHTML = lib.config.intro;
        if (!noclick) {
          lib.setIntro(node2);
        }
        node2.node.group.innerHTML = `<div>${get.cnNumber(seat, true)}号</div>`;
        node2.node.group.style.backgroundColor = get.translation(`${get.bordergroup(infoitem)}Color`);
      };
      node.refresh = func;
      node.refresh(node, item);
      node.link = _item;
      node.seatNumber = seat;
      node._customintro = (uiintro) => {
        uiintro.add(`${get.translation(node._link)}(原${get.cnNumber(node.seatNumber, true)}号位)`);
      };
      return node;
    }
  },
  //什么均贫卡
  zhimeng: {
    audio: 2,
    trigger: { player: "phaseAfter" },
    filter(event, player) {
      return game.hasPlayer((target) => {
        if (target === player || target.countCards("h") + player.countCards("h") === 0) {
          return false;
        }
        return true;
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "与一名其他角色平分手牌", (card, player2, target) => {
        if (target === player2 || target.countCards("h") + player2.countCards("h") === 0) {
          return false;
        }
        return true;
      }).set("ai", (target) => {
        const player2 = get.player();
        const pvalue = -player2.getCards("h").map((card) => get.value(card, player2)).reduce((p, c) => p + c, 0);
        const tvalue = -target.getCards("h").map((card) => get.value(card, target)).reduce((p, c) => p + c, 0) * get.sgnAttitude(player2, target);
        return (pvalue + tvalue) / 2;
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const lose_list = [];
      let cards2 = [];
      [player, target].forEach((current) => {
        const hs = current.getCards("h");
        if (hs.length) {
          cards2.addArray(hs);
          current.$throw(hs.length, 500);
          game.log(current, "将", get.cnNumber(hs.length), "张牌置入了处理区");
          lose_list.push([current, hs]);
        }
      });
      if (lose_list.length) {
        await game.loseAsync({
          lose_list
        }).setContent("chooseToCompareLose");
      }
      await game.delay();
      cards2 = cards2.filterInD();
      const pcards = cards2.randomGets(Math.ceil(cards2.length / 2));
      const tcards = cards2.removeArray(pcards);
      const list = [];
      if (pcards.length) {
        list.push([player, pcards]);
        game.log(player, "获得了", get.cnNumber(pcards.length), "张牌");
      }
      if (tcards.length) {
        list.push([target, tcards]);
        game.log(target, "获得了", get.cnNumber(tcards.length), "张牌");
      }
      await game.loseAsync({
        gain_list: list,
        player,
        animate: "draw"
      }).setContent("gaincardMultiple");
    },
    ai: { threaten: 4 }
  },
  //神华佗
  wuling: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return game.hasPlayer((target) => lib.skill.wuling.filterTarget(null, player, target));
    },
    filterTarget(card, player, target) {
      return !target.hasSkill("wuling_wuqinxi");
    },
    usable: 2,
    prompt: "选择一名角色，向其传授“五禽戏”",
    group: "wuling_die",
    async content(event, trigger, player) {
      const { target } = event;
      target.addAdditionalSkill(`wuling_${player.playerid}`, "wuling_wuqinxi");
      const next = player.chooseToMove(`五灵：调整向${get.translation(target)}传授的“五禽戏”顺序`);
      const cards2 = [lib.skill.wuling.wuqinxi, createCard];
      next.set("list", [["", cards2]]);
      next.set("processAI", processAI);
      const result2 = await next.forResult();
      const sortedWuqinxi = result2.moved[0].map((card) => card[2]);
      game.log(target, "习得的五禽戏顺序为", `#g${sortedWuqinxi.join("、")}`);
      sortedWuqinxi.unshift(sortedWuqinxi[0]);
      target.storage.wuling_wuqinxi = sortedWuqinxi;
      lib.skill.wuling.updateMark(target);
      return;
      function createCard(item, type, position, noclick, node) {
        node = ui.create.buttonPresets.vcard(lib.skill.wuling.wuqinxiMap2[item][0], type, position, noclick);
        node.node.range.innerHTML = lib.skill.wuling.wuqinxiMap2[item][1];
        node.node.range.style.bottom = "2.5px";
        node.node.range.style.width = "100%";
        node.node.range.style.right = "0%";
        node.node.range.style.textAlign = "center";
        node._link = node.link = [null, null, item];
        node._customintro = [(node2) => `五禽戏：${node2.link[2]}`, (node2) => lib.skill.wuling.wuqinxiMap[lib.skill.wuling.wuqinxi.indexOf(node2.link[2])].slice(2)];
        return node;
      }
      function processAI() {
        const event2 = get.event().getParent();
        const { player: player2, target: target2 } = event2;
        const spirits = [];
        let nextPlayer = player2;
        do {
          nextPlayer = nextPlayer.getNext();
          if (get.attitude(player2, nextPlayer) < 0) {
            spirits.add("熊");
            break;
          }
        } while (nextPlayer !== target2);
        if (!spirits.length) {
          spirits.add("猿");
        }
        const effectOk = get.recoverEffect(target2, player2, player2) > 0;
        const hasBadCards = target2.hasCard((card) => {
          const vcard = {
            name: card.viewAs || card.name,
            cards: [card]
          };
          return get.effect(target2, vcard, target2, target2) < -1;
        }, "j");
        if (effectOk || hasBadCards) {
          spirits.add("鹿");
        }
        const others = lib.skill.wuling.wuqinxi.slice().removeArray(spirits);
        do {
          others.randomSort();
        } while (others.length > 1 && others[0] === "鹿");
        return [spirits.concat(others).map((i) => ["", "", i])];
      }
    },
    wuqinxi: ["虎", "鹿", "熊", "猿", "鹤"],
    wuqinxiMap: ["虎：当你使用指定唯一目标的牌对目标角色造成伤害时，此伤害+1。", "鹿：①当你获得此效果时，你回复1点体力并弃置判定区的所有牌。②你不能成为延时锦囊牌的目标。", "熊：每回合限一次，当你受到伤害时，此伤害-1。", "猿：当你获得此效果时，你选择一名其他角色，获得其装备区里的一张牌。", "鹤：当你获得此效果时，你摸三张牌。"],
    wuqinxiMap2: {
      虎: ["wuqinxi_hu", "用牌加伤"],
      鹿: ["wuqinxi_lu", "弃判定回血"],
      熊: ["wuqinxi_xiong", "减伤"],
      猿: ["wuqinxi_yuan", "偷装备牌"],
      鹤: ["wuqinxi_he", "摸三张牌"]
    },
    updateMark(player) {
      let wuqinxi = player.storage.wuling_wuqinxi;
      if (!wuqinxi) {
        return;
      }
      wuqinxi.shift();
      let curMark = wuqinxi[0];
      if (!curMark) {
        for (const skill in player.additionalSkills) {
          if (!skill.startsWith("wuling_")) {
            continue;
          }
          player.removeAdditionalSkill(skill);
        }
        game.log(player, "完成了五禽戏的操练");
        return;
      }
      game.log(player, "获得了", `#g【${curMark}】`, "标记");
      player.markSkill("wuling_wuqinxi");
      game.broadcastAll(
        (player2, curMark2) => {
          if (player2.marks.wuling_wuqinxi) {
            player2.marks.wuling_wuqinxi.firstChild.innerHTML = curMark2;
          }
        },
        player,
        curMark
      );
      let next = game.createEvent("wuling_change");
      next.player = player;
      next.setContent("emptyEvent");
    },
    ai: {
      order: 7,
      threaten: 5,
      result: { target: 1 }
    },
    derivation: "wuling_wuqinxi",
    subSkill: {
      wuqinxi: {
        nopop: true,
        charlotte: true,
        intro: {
          markcount: () => 0,
          mark(dialog, storage) {
            const wuqinxiMap = lib.skill.wuling.wuqinxiMap;
            const str = `<li>当前效果：${storage[0]}<br><li>${wuqinxiMap.find((str3) => storage[0] === str3[0]).slice(2)}<br>`;
            dialog.addText(str, false);
            const str2 = `<div class="text center">“五禽戏”顺序：<br>${storage.join(" ")}</div>`;
            dialog.addText(str2);
            if (storage.length > 1) {
              const str3 = `<div class="text" style="font-size:10px; ">[下一效果] ${wuqinxiMap.find((str4) => storage[1] === str4[0])}<br></div>`;
              dialog.add(str3);
            }
          }
        },
        mod: {
          targetEnabled(card, player, target) {
            if (get.type(card) === "delay" && target.storage.wuling_wuqinxi && target.storage.wuling_wuqinxi[0] === "鹿") {
              return false;
            }
          }
        },
        trigger: {
          source: "damageBegin1",
          player: ["phaseZhunbeiBegin", "damageBegin4", "wuling_change"]
        },
        filter(event, player, name) {
          const wuqinxi = player.storage.wuling_wuqinxi && player.storage.wuling_wuqinxi[0];
          if (!wuqinxi) {
            return false;
          }
          if (event.name === "phaseZhunbei") {
            return true;
          }
          switch (name) {
            case "damageBegin1": {
              if (wuqinxi !== "虎" || !event.card) {
                return false;
              }
              const evt = event.getParent("useCard");
              return evt?.targets.length === 1 && evt.targets.includes(event.player);
            }
            case "damageBegin4":
              return wuqinxi === "熊" && !player.hasSkill("wuling_xiong");
            default:
              switch (wuqinxi) {
                case "鹿":
                  return player.isDamaged() || player.countCards("j") > 0;
                case "鹤":
                  return true;
                case "猿":
                  return game.hasPlayer((target) => target !== player && target.hasGainableCards(player, "e"));
                default:
                  return false;
              }
          }
        },
        forced: true,
        onremove: true,
        async content(event, trigger, player) {
          let wuqinxi = player.storage.wuling_wuqinxi[0];
          if (trigger.name === "phaseZhunbei") {
            lib.skill.wuling.updateMark(player);
            return;
          }
          let name = event.triggername;
          switch (name) {
            case "damageBegin1":
              player.line(trigger.player);
              trigger.num++;
              break;
            case "damageBegin4":
              player.addTempSkill("wuling_xiong");
              trigger.num--;
              break;
            default:
              switch (wuqinxi) {
                case "鹿":
                  await player.recover();
                  await player.discard(player.getCards("j"), player);
                  break;
                case "鹤":
                  await player.draw(3);
                  break;
                case "猿": {
                  const { targets } = await player.chooseTarget("五禽戏：获得一名其他角色装备区里的一张装备牌", (card, player2, target) => target !== player2 && target.hasGainableCards(player2, "e"), true).set("ai", (target) => {
                    let player2 = _status.event.player;
                    let att = get.attitude(player2, target);
                    let eff = 0;
                    target.getCards("e", (card) => {
                      let val = get.value(card, target);
                      eff = Math.max(eff, -val * att);
                    });
                    return eff;
                  }).forResult();
                  if (targets?.length) {
                    player.line(targets, "green");
                    await player.gainPlayerCard(targets[0], "e", true);
                  }
                  break;
                }
              }
              break;
          }
        },
        ai: {
          effect: {
            target(card, player, target) {
              const wuqinxi = target.storage.wuling_wuqinxi;
              if (!wuqinxi || !wuqinxi.length) {
                return;
              }
              const curWuqinxi = wuqinxi[0];
              const nextWuqinxi = wuqinxi[1];
              if (nextWuqinxi === "鹿" && get.type(card) === "delay") {
                return "zerotarget";
              }
              if (curWuqinxi !== "熊" || player.hasSkill("wuling_xiong")) {
                return;
              }
              if (player.hasSkillTag("jueqing", false, target)) {
                return;
              }
              let num = get.tag(card, "damage");
              if (num) {
                if (num > 1) {
                  return 0.5;
                }
                return 0;
              }
            }
          }
        }
      },
      xiong: { charlotte: true },
      die: {
        trigger: { player: "die" },
        filter(event, player) {
          return game.hasPlayer((current) => current.additionalSkills[`wuling_${player.playerid}`]);
        },
        forced: true,
        locked: false,
        forceDie: true,
        async content(event, trigger, player) {
          const targets = game.filterPlayer((current) => Reflect.has(current.additionalSkills, `wuling_${player.playerid}`));
          player.line(targets);
          targets.forEach((current) => current.removeAdditionalSkill(`wuling_${player.playerid}`));
        }
      }
    }
  },
  youyi: {
    init(player) {
      player.storage.renku = true;
    },
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return _status.renku.length > 0;
    },
    prompt: "将仁区所有牌置入弃牌堆，令所有角色各回复1点体力",
    async content(event, trigger, player) {
      const cards2 = _status.renku.slice();
      const next = game.cardsDiscard(cards2);
      next.fromRenku = true;
      await next;
      player.$throw(cards2, 1e3);
      game.log(cards2, "从仁库进入了弃牌堆");
      const targets = game.filterPlayer(() => true);
      player.line(targets);
      await Promise.all(targets.map((target) => target.recover()));
    },
    ai: {
      order(item, player) {
        return get.order({ name: "taoyuan" }, player);
      },
      result: {
        player(player) {
          return Math.max(
            0,
            game.filterPlayer().reduce((num, target) => num + get.recoverEffect(target, player, player), 0)
          );
        }
      }
    },
    group: "youyi_put",
    subSkill: {
      put: {
        audio: "youyi",
        trigger: { player: "phaseDiscardEnd" },
        filter(event, player) {
          return lib.skill.twlijian.getCards(event).length;
        },
        prompt2(event, player) {
          return `将${get.translation(lib.skill.twlijian.getCards(event))}置入仁区`;
        },
        async content(event, trigger, player) {
          const cards2 = lib.skill.twlijian.getCards(trigger);
          game.log(player, "将", cards2, "置于了仁库");
          game.cardsGotoSpecial(cards2, "toRenku");
        }
      }
    }
  },
  // 手杀神马超
  yuli: {
    audio: 6,
    trigger: {
      source: "damageBegin1",
      player: "damageBegin4"
    },
    filter(event, player, name) {
      return name === "damageBegin1" || event.hasNature("thunder");
    },
    forced: true,
    direct: true,
    logAudio(event) {
      if (typeof event === "number") {
        return `yuli${event}.mp3`;
      }
      return 2;
    },
    async content(event, trigger, player) {
      switch (event.triggername) {
        case "damageBegin1":
          if (!trigger.hasNature("thunder")) {
            player.logSkill("yuli");
            game.setNature(trigger, "thunder");
          } else {
            player.logSkill("yuli", null, null, null, [get.rand(3, 4)]);
            trigger.num++;
          }
          updateState(player, "atk");
          break;
        case "damageBegin4":
          player.logSkill("yuli", null, null, null, [get.rand(5, 6)]);
          trigger.cancel();
          await player.draw(trigger.num);
          updateState(player, "def");
          break;
      }
      return;
      function updateState(player2, type) {
        if (!player2.awakenedSkills.includes("jimie")) {
          return;
        }
        switch (type) {
          case "atk":
            player2.markAuto("yuli", ["atk"]);
            game.log(player2, "触发了", "#g【驭雳】", "的第一项");
            break;
          case "def":
            player2.markAuto("yuli", ["def"]);
            game.log(player2, "触发了", "#g【驭雳】", "的第二项");
            break;
        }
        if (["atk", "def"].every((item) => player2.getStorage("yuli").includes(item)) && player2.hasSkill("jimie", null, false, false)) {
          player2.logSkill("jimie", null, null, null, [get.rand(3, 4)]);
          player2.refreshSkill("jimie");
          player2.setStorage("yuli", [], true);
        }
      }
    },
    onremove: true,
    intro: {
      content(storage = [], player) {
        if (!storage?.length) {
          return "尚未触发【驭雳】的任一项";
        }
        let str = "已触发【驭雳】的";
        if (storage.includes("atk")) {
          str += "第一项";
          if (storage.includes("def")) {
            str += "和";
          }
        }
        if (storage.includes("def")) {
          str += "第二项";
        }
        return str;
      }
    },
    ai: {
      nothunder: true,
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "thunderDamage")) {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  tingwei: {
    audio: 4,
    trigger: { player: "useCardToPlayered" },
    filter(event) {
      return event.isFirstTarget && event.card?.name === "sha";
    },
    logAudio(event) {
      if (typeof event === "number") {
        return `tingwei${event}.mp3`;
      }
      return 2;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget(_card, _player, target) {
          const event2 = get.event();
          return event2.targets.includes(target);
        },
        ai(target) {
          const player2 = get.player();
          const trigger2 = get.event().getTrigger();
          const att = get.attitude(player2, target);
          if (att >= 0) {
            return -1;
          }
          let score = 0;
          const nature = get.nature(trigger2.card);
          const damage = get.damageEffect(target, player2, player2, nature);
          if (damage > 0) {
            score += damage * 1.8;
            if (target.hp <= 2) {
              score += 2;
            }
          }
          const skills2 = target.getSkills(null, false, false).filter((skill) => {
            const info = get.info(skill);
            return info && !info.locked && !info.charlotte;
          });
          score += skills2.length * 1.2;
          const equips1 = target.getGainableCards(player2, "e");
          const equips2 = target.getGainableCards(player2, "h", (card) => card.isKnownBy(player2) && get.type(card) === "equip");
          const equips = equips1.concat(equips2);
          if (equips.length) {
            const values = equips.reduce((sum, card) => sum + get.value(card, target), 0) / equips.length;
            score += Math.min(3, values);
          }
          const cards2 = target.countDiscardableCards(target, "he");
          if (cards2) {
            score += Math.min(3, 1 + 4 / cards2);
          }
          if (!target.isLinked()) {
            score += 0.8;
            if (game.hasPlayer((current) => current !== target && current.isLinked())) {
              score += 0.8;
            }
            if (nature) {
              score += 0.6;
            }
          }
          score *= Math.max(1, -att / 3);
          return score;
        }
      }).set("targets", trigger.targets).forResult();
    },
    logTarget: "targets",
    async content(event, trigger, player) {
      player.addMark("tingwei", 4);
      const target = event.targets[0];
      const result2 = await target.chooseButton({
        createDialog: [
          "霆威：请选择任意项，若点击“取消”，则你横置",
          [
            [
              ["fengyin", "非锁定技失效至下个回合结束"],
              ["equip", `交给${get.translation(player)}一张装备牌`],
              ["damage", `${get.translation(trigger.card)}对你造成伤害+1`],
              ["discard", "随机弃两张牌"]
            ],
            "textbutton"
          ]
        ],
        filterButton(button, player2) {
          const source = get.event().source;
          const link = button.link;
          const selected = ui.selected.buttons.map((button2) => button2.link);
          switch (link) {
            case "fengyin":
              return !player2.hasSkill("tingwei_fengyin");
            case "equip": {
              const hasEquip = player2.hasGainableCards(source, "he", { type: "equip" });
              if (!hasEquip) {
                return false;
              }
              if (!selected.includes("discard")) {
                return true;
              }
              return player2.hasGainableCards(source, "he", (card) => get.type(card) === "equip" && player2.hasDiscardableCards(player2, "he", (cardx) => cardx !== card));
            }
            case "discard": {
              const hasCard = player2.hasDiscardableCards(player2, "he");
              if (!hasCard) {
                return false;
              }
              if (!selected.includes("equip")) {
                return true;
              }
              return player2.hasGainableCards(source, "he", (card) => get.type(card) === "equip" && player2.hasDiscardableCards(player2, "he", (cardx) => cardx !== card));
            }
            default:
              return true;
          }
        },
        selectButton: [1, 4],
        processAI() {
          const event2 = get.event();
          const target2 = event2.player;
          const player2 = event2.source;
          const parent = event2.getParent();
          if (parent == null) {
            return {
              bool: false
            };
          }
          const trigger2 = parent.getTrigger();
          const resultLinks = [];
          const removeMarkValue = getTingValue(player2, target2);
          const costs = Array(4).fill(0);
          if (target2.hasSkill("tingwei_fengyin")) {
            costs[0] = Infinity;
          } else {
            const skills2 = target2.getSkills(null, false, false).filter((skill) => {
              const info = get.info(skill);
              return info && !info.locked && !info.charlotte;
            });
            costs[0] = skills2.length * 1.2;
            if (skills2.length >= 2) {
              costs[0] += 1;
            }
          }
          const equips = target2.getGainableCards(player2, "he", { type: "equip" });
          if (equips.length) {
            costs[1] = Math.min(4, equips.reduce((sum, card2) => sum + get.value(card2, target2), 0) / equips.length);
          } else {
            costs[1] = Infinity;
          }
          const card = trigger2.card;
          const damageEff = get.damageEffect(target2, player2, target2, get.nature(card));
          if (damageEff < 0) {
            costs[2] = -damageEff * 1.8;
            if (target2.hp <= 2) {
              costs[2] += 3;
            }
            if (target2.hp <= 1) {
              costs[2] += 5;
            }
          } else {
            costs[2] = -damageEff;
          }
          const cards2 = target2.getDiscardableCards(target2, "he");
          if (cards2.length) {
            const values = cards2.reduce((sum, card2) => sum + get.value(card2, target2), 0) / cards2.length;
            costs[3] = Math.min(4, 1 + 4 / values);
            if (cards2.length <= 3) {
              costs[3] += 2;
            }
          } else {
            costs[3] = Infinity;
          }
          const links2 = ["fengyin", "equip", "damage", "discard"];
          for (const [i, cost] of costs.entries()) {
            if (removeMarkValue > cost) {
              resultLinks.push(links2[i]);
            }
          }
          if (resultLinks.includes("equip") && resultLinks.includes("discard")) {
            if (!equips.some((card2) => cards2.some((cardx) => cardx !== card2))) {
              const att = get.attitude(target2, player2);
              if (att > 0) {
                resultLinks.remove("discard");
              } else {
                resultLinks.remove("equip");
              }
            }
          }
          if (!resultLinks.length && !target2.isLinked()) {
            let linkCost = 1;
            if (game.hasPlayer((current) => current !== target2 && get.attitude(target2, current) > 0 && current.isLinked())) {
              linkCost += 1;
            }
            if (get.nature(trigger2.card)) {
              linkCost += 1;
            }
            if (get.damageEffect(target2, player2, target2, "fire") < 0) {
              linkCost += 0.8;
            }
            if (get.damageEffect(target2, player2, target2, "thunder") < 0) {
              linkCost += 0.8;
            }
            const minCost = Math.min(...costs);
            const index = costs.indexOf(minCost);
            if (linkCost > minCost) {
              resultLinks.push(links2[index]);
            }
          }
          if (resultLinks.length) {
            return {
              bool: true,
              links: resultLinks
            };
          }
          return {
            bool: false
          };
          function getTingValue(player3, target3) {
            if (!player3.hasSkill("jimie")) {
              return 0;
            }
            if (player3.awakenedSkills.includes("jimie") && !player3.hasSkill("yuli")) {
              return 0;
            }
            if (get.attitude(target3, player3) > 0) {
              return -1;
            }
            const mark = player3.countMark("tingwei");
            let value = 1;
            if (mark >= 5) {
              value += 7;
            } else if (mark === 4) {
              value += 4;
            } else if (mark === 3) {
              value += 2.5;
            } else if (mark === 2) {
              value += 1.5;
            }
            if (_status.currentPhase === player3) {
              value += 2;
            }
            value += Math.min(5, getTingThreat(player3, target3));
            return value;
          }
          function getTingThreat(player3, target3) {
            let threat = 0;
            for (const current of game.filterPlayer((current2) => current2 === target3 || get.attitude(target3, current2) > 0)) {
              const damage = get.damageEffect(current, player3, target3);
              if (damage < 0) {
                threat = Math.max(threat, -damage * Math.max(1, current.maxHp / 2));
              }
            }
            return threat;
          }
        }
      }).set("source", player).forResult();
      if (!result2?.bool || !result2.links?.length) {
        player.logSkill("tingwei", null, null, null, [get.rand(3, 4)]);
        await target.link(true);
        return;
      }
      const links = ["fengyin", "equip", "damage", "discard"];
      player.removeMark("tingwei", result2.links.length);
      for (const link of links) {
        if (!result2.links.includes(link)) {
          continue;
        }
        switch (link) {
          case "fengyin":
            target.addTempSkill("tingwei_fengyin", { player: "phaseEnd" });
            break;
          case "equip": {
            await target.chooseToGive({
              prompt: `请选择要交给${get.translation(player)}的装备牌`,
              target: player,
              filterCard(card) {
                const event2 = get.event();
                const target2 = get.player();
                if (get.type(card) !== "equip") {
                  return false;
                }
                if (!event2.discarding) {
                  return true;
                }
                return target2.hasDiscardableCards(target2, "he", (cardx) => cardx !== card);
              },
              position: "he",
              forced: true
            }).set("discarding", result2.links.includes("discard"));
            break;
          }
          case "damage": {
            const id = target.playerid;
            if (id == null) {
              break;
            }
            const map = trigger.getParent()?.customArgs;
            if (map == null) {
              break;
            }
            if (!map[id]) {
              map[id] = {};
            }
            if (typeof map[id].extraDamage !== "number") {
              map[id].extraDamage = 0;
            }
            map[id].extraDamage++;
            break;
          }
          case "discard": {
            await target.randomDiscard({ position: "he", num: 2 });
            break;
          }
        }
      }
      return;
    },
    marktext: "霆",
    intro: {
      name: "霆",
      content: "mark"
    },
    subSkill: {
      fengyin: {
        inherit: "fengyin"
      }
    }
  },
  jimie: {
    audio: 4,
    trigger: { player: "phaseUseEnd" },
    limited: true,
    skillAnimation: true,
    filter(_event, player) {
      return player.countMark("tingwei") >= 6;
    },
    logAudio(event) {
      if (typeof event === "number") {
        return `jimie${event}.mp3`;
      }
      return 2;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt(event.skill),
        prompt2: "弃置6枚“霆”标记，对一名角色造成等于其体力上限的伤害",
        ai(target) {
          const player2 = get.player();
          return get.damageEffect(target, player2, player2);
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      player.awakenSkill("jimie");
      player.removeMark("tingwei", 6);
      const target = event.targets[0];
      await target.damage({ num: target.maxHp });
      player.setStorage("yuli", [], true);
    }
  },
  //手杀神姜维
  mbtiantao: {
    audio: 2,
    trigger: {
      player: "phaseJieshuBegin"
    },
    forced: true,
    async content(event, trigger, player) {
      const position = ["h", "e", "j"];
      const map = { h: "手牌区", e: "装备区", j: "判定区" };
      let list = position.map((i) => map[i]);
      let result2;
      result2 = await player.chooseControl({ controls: list }).set("prompt", `###${get.translation(event.name)}：选择一个区域并弃置其中所有牌###然后选择弃置任意名其他角色对应区域内的各一张牌。`).set("ai", (event2, player2) => {
        const targets = game.filterPlayer((current) => current !== player2);
        const { position: position2, controls } = get.event();
        const list2 = {};
        for (const pos2 of position2) {
          let info = targets.filter((target) => target.countDiscardableCards(player2, pos2)).reduce((sum, target) => {
            const eff = get.effect(target, { name: "guohe_copy", position: pos2 }, player2, player2);
            return eff > 0 ? sum + eff : sum;
          }, 0);
          list2[pos2] = info - (pos2 === "j" ? -1 : 1) * get.value(player2.getDiscardableCards(player2, pos2));
        }
        let choice = Object.entries(list2).sort((a, b) => b[1] - a[1])[0];
        return { h: "手牌区", e: "装备区", j: "判定区" }[choice[0]];
      }).set("position", position).forResult();
      if (!result2?.control || result2.control === "cancel2") {
        return;
      }
      const pos = { 手牌区: "h", 装备区: "e", 判定区: "j" }[result2.control];
      let doneList = /* @__PURE__ */ new Map();
      result2 = await player.modedDiscard(player.getCards(pos)).forResult();
      if (result2?.cards?.length) {
        doneList.set(player, result2.cards);
      }
      if (game.hasPlayer((current) => current != player && current.hasDiscardableCards(player, pos))) {
        result2 = await player.chooseTarget({
          prompt: `天涛：选择任意名其他角色，弃置其${{ h: "手牌区", e: "装备区", j: "判定区" }[pos]}内的一张牌`,
          filterTarget(card, player2, target) {
            return player2 != target && target.hasDiscardableCards(player2, get.event().pos);
          },
          selectTarget: [1, Infinity],
          ai(target) {
            const { pos: pos2, player: player2 } = get.event();
            return get.effect(target, { name: "guohe_copy", position: pos2 }, player2, player2);
          },
          forced: true
        }).set("pos", pos).forResult();
        if (result2?.bool && result2.targets?.length) {
          const targets = result2.targets;
          player.line(targets);
          for (const target of targets) {
            result2 = await player.discardPlayerCard({ target, position: pos, forced: true }).forResult();
            if (result2?.bool && result2.links?.length) {
              doneList.set(target, result2.links);
            }
          }
        }
      }
      if ([...doneList.keys()].length) {
        const targets = [...doneList.entries()].filter(([_, cards2]) => !cards2.some((card) => get.name(card) === "sha")).map(([target]) => target);
        await game.doAsyncInOrder(targets.sortBySeat(), async (target) => target.loseHp());
      }
    }
  },
  mbxinghun: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    manualConfirm: true,
    async content(event, trigger, player) {
      const num = 5;
      const cards2 = get.cards(num, true);
      let result2 = await player.chooseToMove_new("星魂：选择任意张手牌进行交换", true).set("list", [
        ["牌堆顶的牌", cards2],
        ["你的手牌", player.getCards("h")]
      ]).set("filterMove", (from, to, moved) => typeof to !== "number").set("processAI", (list) => {
        const player2 = get.player();
        let cards3 = list.map((i) => i[1]).flat().sort((a, b) => get.value(b, player2) - get.value(a, player2));
        let sha = cards3.filter((card) => get.name(card, player2) === "sha");
        cards3.removeArray(sha);
        const hs = [];
        let num2 = Math.ceil(sha.length / 2);
        if (num2 <= player2.countCards("h")) {
          hs.addArray(sha.slice(0, num2));
          sha.removeArray(hs);
        }
        if (hs.length < player2.countCards("h")) {
          hs.addArray(cards3.slice(0, player2.countCards("h") - hs.length));
          cards3.removeArray(hs);
        }
        const top = sha.concat(cards3);
        return [top, hs];
      }).forResult();
      if (result2?.bool) {
        await game.loseAsync({
          player,
          cards: result2.moved.flat(),
          moved: result2.moved
        }).setContent(async (event2, trigger2, player2) => {
          const { cards: cards3, moved } = event2;
          const hs = player2.getCards("h");
          const gain = moved[1].filter((card) => !hs.includes(card));
          const puts = moved[0].filter((card) => hs.includes(card));
          const originPile = cards3.slice().removeArray(hs);
          if (puts.length) {
            player2.$throw(puts.length, 1e3);
            await player2.lose(puts, ui.ordering).set("getlx", false);
          }
          await game.cardsGotoOrdering(originPile);
          if (gain.length) {
            await player2.gain(gain, "draw").set("getlx", false);
          }
          await game.cardsGotoPile(moved[0].slice().reverse(), ["insert_card", true]);
          game.addCardKnower(moved[0], player2);
        });
      }
      if (!game.hasPlayer((current) => current !== player)) {
        return;
      }
      result2 = await player.chooseTarget(`星魂：选择一名其他角色，令其展示牌堆顶和你的手牌共计${get.cnNumber(num)}张牌`, true).set("filterTarget", (_, player2, target) => target !== player2).set("ai", (target) => {
        const { player: player2 } = get.event();
        return get.effect(target, { name: "sha" }, player2, player2);
      }).forResult();
      if (result2?.bool && result2.targets?.length) {
        const [target] = result2.targets;
        player.line(target, "thunder");
        let showCards = [];
        const top = get.cards(5, true);
        if (player.countCards("h")) {
          const dialog = [];
          dialog.push("星魂：请选择五张牌");
          dialog.add(`<div class="text center">${get.translation(player)}的手牌</div>`);
          if (target.hasSkillTag("viewHandcard", null, player, true)) {
            dialog.push(player.getCards("h"));
          } else {
            dialog.push([player.getCards("h"), "blank"]);
          }
          dialog.addArray([`<div class="text center">牌堆顶</div>`, [top, "blank"]]);
          const result3 = await target.chooseButton(5, true).set("createDialog", dialog).set("top", top).set("target", player).set("ai", () => Math.random()).forResult();
          showCards = result3?.links || [];
        } else {
          showCards = top;
        }
        await target.showCards(showCards, `${get.translation(target)}因【${get.translation(event.name)}】展示`).set("customButton", (button, event2) => {
          if (event2.top?.includes(button.link)) {
            game.createButtonCardsetion("牌堆顶", button);
          }
        }).set("top", top).set("delay_time", 5);
        if (showCards.some((card) => get.name(card) === "sha")) {
          let sha = showCards.filter((card) => get.name(card) === "sha");
          while (sha.length) {
            let card = sha.shift();
            if (player.canUse(card, target, false, false)) {
              if (top.includes(card)) {
                top.remove(card);
              }
              await player.useCard(card, target, false);
            }
          }
        }
      }
    },
    ai: {
      order(item, player) {
        if (player.countCards("hs", (card) => get.tag(card, "draw"))) {
          return 1;
        }
        return 20;
      },
      result: {
        player(player) {
          if (!game.hasPlayer((current) => current !== player && get.effect(current, { name: "sha" }, player, player) > 0)) {
            return 0;
          }
          return 1;
        }
      }
    }
  },
  mbshenpei: {
    audio: 2,
    limited: true,
    skillAnimation: true,
    animationColor: "metal",
    derivation: ["mbhuitian"],
    trigger: {
      player: "dying"
    },
    check(event, player) {
      return !player.canSave(player) || player.countCards("hs", (card) => get.tag(card, "save")) <= -player.hp;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const num = game.getAllGlobalHistory("everything", (evt) => {
        if (evt.name !== "dying" || evt.player !== player) {
          return false;
        }
        return true;
      }).length;
      if (num > 0) {
        await player.recover(num);
        const result2 = await player.chooseTarget(`神霈：选择一名角色对其造成${num}点雷电伤害`, true).set("ai", (target) => {
          const { player: player2 } = get.event();
          return get.damageEffect(target, player2, player2, "thunder");
        }).forResult();
        if (result2?.bool && result2.targets?.length) {
          player.line(result2.targets, "thunder");
          await result2.targets[0].damage(num, "thunder");
        }
      }
      await player.addSkills("mbhuitian");
    }
  },
  mbhuitian: {
    audio: 4,
    trigger: {
      global: ["roundStart", "phaseEnd"]
    },
    filter(event, player, name) {
      if (name === "roundStart") {
        return player.hasAllHistory("useSkill", (evt) => evt.skill === "mbhuitian");
      }
      return event.player.getHp() > player.getHp();
    },
    async cost(event, trigger, player) {
      if (event.triggername === "roundStart") {
        event.result = {
          bool: true,
          die: true
        };
      } else {
        event.result = await player.chooseBool(get.prompt2(event.skill)).set(
          "choice",
          (() => {
            if (player.hasAllHistory("useSkill", (evt) => evt.skill === "mbhuitian")) {
              return true;
            }
            let targets = game.filterPlayer((current) => current !== player, void 0, true);
            if (!targets.length) {
              return false;
            }
            if (!trigger.player.getHistory().isRound) {
              return false;
            }
            return targets.every((current) => {
              let att = get.attitude(player, current);
              return att < -1 || att > 1;
            });
          })()
        ).forResult();
      }
    },
    logAudio: (a, b, c, d, costResult) => costResult.die ? ["mbhuitian3.mp3", "mbhuitian4.mp3"] : 2,
    async content(event, tigger, player) {
      if (event.triggername === "roundStart") {
        await player.die();
      } else {
        await player.draw();
        player.insertPhase(event.name);
      }
    }
  },
  //刘巴
  duanbi: {
    limited: true,
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      let num1 = 0;
      let num2 = 0;
      const count = game.countPlayer((current) => {
        num1 += current.countCards("h");
        num2++;
        return current !== player;
      });
      return count > 0 && num1 > num2 * 2;
    },
    filterTarget: true,
    selectTarget: -1,
    multitarget: true,
    multiline: true,
    skillAnimation: true,
    animationColor: "orange",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const cards2 = [];
      const targets = event.targets.sortBySeat();
      targets.remove(player);
      for (const target2 of targets) {
        const num = Math.min(3, Math.floor(target2.countCards("h") / 2));
        if (num <= 0) {
          continue;
        }
        const result3 = await target2.chooseToDiscard({
          selectCard: num,
          position: "h",
          forced: true
        }).forResult();
        if (result3.bool && Array.isArray(result3.cards)) {
          cards2.addArray(result3.cards);
        }
      }
      const cards22 = cards2.filter((card) => get.position(card, true) === "d");
      if (!cards22.length) {
        return;
      }
      const gainText = cards22.length > 3 ? "随机获得三" : `获得${get.cnNumber(cards22.length)}`;
      const result2 = await player.chooseTarget({
        prompt: `是否令一名角色${gainText}张被弃置的牌？`,
        ai(target2) {
          const player2 = get.player();
          let att = get.attitude(player2, target2);
          if (target2.hasSkillTag("nogain")) {
            att /= 10;
          }
          if (target2.hasJudge("lebu")) {
            att /= 4;
          }
          return att * Math.sqrt(Math.max(1, 5 - target2.countCards("h")));
        }
      }).forResult();
      if (!result2?.bool || !result2.targets?.length) {
        return;
      }
      const target = result2.targets[0];
      player.line(target, "fire");
      await target.gain({
        cards: cards22.randomGets(3),
        animate: "gain2"
      });
    },
    ai: {
      order: 10,
      result: {
        target(player, target) {
          if (player === target) {
            return 3;
          }
          return -Math.min(3, Math.floor(target.countCards("h") / 2));
        }
      }
    }
  },
  tongduo: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    usable: 1,
    filter(event, player) {
      return player !== event.player && event.targets.length === 1 && game.hasPlayer((current) => current.countCards("he") > 0);
    },
    async cost(event, trigger, player) {
      event.result = await await player.chooseTarget({
        prompt: get.prompt("tongduo"),
        prompt2: "令一名角色重铸一张牌",
        filterTarget(card, player2, target) {
          return target.hasCards("he", lib.filter.cardRecastable);
        },
        ai(target) {
          return get.attitude(_status.event.player, target) * Math.min(3, Math.floor(target.countCards("h", lib.filter.cardRecastable) / 2));
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      if (!target.hasCards("he", lib.filter.cardRecastable)) {
        return;
      }
      const result2 = await target.chooseCard({
        prompt: "请重铸一张牌",
        filterCard(card, player2) {
          return lib.filter.cardRecastable(card, player2);
        },
        position: "he",
        forced: true
      }).forResult();
      if (!result2?.bool || !result2.cards?.length) {
        return;
      }
      await target.recast(result2.cards);
    }
  },
  //朱儁
  yangjie: {
    audio: 2,
    group: ["yangjie_add"],
    enable: "phaseUse",
    prompt: "摸一张牌并与一名其他角色进行拼点",
    usable: 1,
    filter(event, player) {
      return !player.hasSkillTag("noCompareSource");
    },
    filterTarget(card, player, target) {
      return target !== player && target.hasCards("h") && !target.hasSkillTag("noCompareTarget");
    },
    async content(event, trigger, player) {
      const target = event.target;
      await player.draw();
      if (!player.canCompare(target)) {
        return;
      }
      const result2 = await player.chooseToCompare(target).set("small", true).forResult();
      if (result2.bool) {
        return;
      }
      const cards2 = [result2.player, result2.target].filterInD("d");
      if (!cards2.length || !game.hasPlayer((current) => current !== player && current !== target)) {
        return;
      }
      event.cards = cards2;
      const result22 = await player.chooseTarget({
        prompt: "请选择一名角色",
        prompt2: `令其获得${get.translation(cards2)}，且视为对${get.translation(target)}使用一张火【杀】`,
        filterTarget(card2, player2, target2) {
          return target2 !== player2 && target2 !== get.event().getParent()?.target;
        },
        ai(target2) {
          const player2 = get.player();
          const evt = get.event().getParent();
          if (evt == null) {
            return 0;
          }
          const cards3 = evt.cards;
          const target22 = evt.target;
          const val = get.value(cards3, target2) * get.attitude(player2, target2);
          if (val <= 0) {
            return 0;
          }
          return val + (target2.canUse({ name: "sha", nature: "fire", isCard: true }, target22, false) ? get.effect(target22, { name: "sha", nature: "fire", isCard: true }, target2, player2) : 0);
        }
      }).forResult();
      if (!result22?.bool || !result22.targets?.length) {
        return;
      }
      const source = result22.targets[0];
      event.source = source;
      player.line(source);
      await source.gain({
        cards: cards2,
        animate: "gain2"
      });
      const card = get.autoViewAs({ name: "sha", nature: "fire", isCard: true });
      if (target.isIn() && source.isIn() && source.canUse(card, target, false)) {
        await source.useCard({
          card,
          targets: [target],
          addCount: false
        });
      }
    },
    subSkill: {
      add: {
        trigger: { player: "compare" },
        forced: true,
        popup: false,
        filter(event, player) {
          return event.getParent()?.name === "yangjie" && event.num1 > 1 && player.isDamaged();
        },
        async content(event, trigger, player) {
          const num = player.getDamagedHp();
          game.log(player, "的拼点牌点数-", num);
          trigger.num1 = Math.max(1, trigger.num1 - num);
        }
      }
    },
    ai: {
      order: 3,
      result: { target: -1.5 }
    }
  },
  zjjuxiang: {
    audio: 2,
    trigger: { global: "dyingAfter" },
    logTarget: "player",
    limited: true,
    skillAnimation: true,
    animationColor: "thunder",
    filter(event, player) {
      return event.player !== player && event.player.isIn();
    },
    check(event, player) {
      return get.damageEffect(event.player, player, player) > 0;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await trigger.player.damage();
      if (trigger.player.maxHp > 0) {
        await player.draw(trigger.player.maxHp);
      }
    },
    ai: { expose: 10 }
  },
  xinyangjie: {
    audio: "yangjie",
    enable: "phaseUse",
    filter(event, player) {
      return game.hasPlayer((target) => player.canCompare(target));
    },
    filterTarget(card, player, target) {
      return player.canCompare(target);
    },
    usable: 1,
    async content(event, trigger, player) {
      const target = event.target;
      const result2 = await player.chooseToCompare(target).set("small", true).forResult();
      if (result2.bool) {
        return;
      }
      if (!game.hasPlayer((current) => current !== player && current !== target && current.canUse({ name: "sha", nature: "fire", isCard: true }, target, false))) {
        return;
      }
      const result22 = await player.chooseTarget({
        prompt: "佯解：是否选择另一名其他角色？",
        prompt2: `令其视为对${get.translation(target)}使用一张火【杀】`,
        filterTarget(card2, player2, target2) {
          const evt = get.event().getParent();
          if (evt == null) {
            return false;
          }
          return target2 !== player2 && target2 !== evt.target;
        },
        ai(target2) {
          const player2 = get.player();
          const evt = get.event().getParent();
          if (evt == null) {
            return 0;
          }
          const target22 = evt.target;
          return get.effect(target22, { name: "sha", nature: "fire", isCard: true }, target2, player2);
        }
      }).set("ai", (target2) => {
        const player2 = _status.event.player;
        const target22 = _status.event.getParent().target;
        return get.effect(target22, { name: "sha", nature: "fire", isCard: true }, target2, player2);
      }).forResult();
      if (!result22.bool || !result22.targets?.length) {
        return;
      }
      const source = result22.targets[0];
      player.line(source);
      game.log(player, "选择了", source);
      const card = get.autoViewAs({ name: "sha", nature: "fire", isCard: true });
      if (!target.isIn() || !source.isIn() || !source.canUse(card, target, false)) {
        return;
      }
      await source.useCard({
        card,
        targets: [target],
        addCount: false,
        noai: true
      });
    },
    ai: {
      order: 3,
      result: {
        target(player, target) {
          const hs = player.getCards("h").sort((a, b) => a.number - b.number);
          const ts = target.getCards("h").sort((a, b) => a.number - b.number);
          if (!hs.length || !ts.length) {
            return 0;
          }
          if (hs[0].number <= ts[0].number) {
            return -3;
          }
          if (player.countCards("h") >= target.countCards("h")) {
            return -10;
          }
          return -1;
        }
      }
    }
  },
  xinjuxiang: {
    audio: "zjjuxiang",
    inherit: "zjjuxiang",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await trigger.player.damage();
    }
  },
  houfeng: {
    audio: 3,
    trigger: { global: "phaseUseBegin" },
    filter(event, player) {
      if (!["zhengsu_leijin", "zhengsu_bianzhen", "zhengsu_mingzhi"].some((i) => !event.player.hasSkill(i))) {
        return false;
      }
      return player.inRange(event.player);
    },
    check(event, player) {
      return get.attitude(player, event.player) > 0;
    },
    round: 1,
    logAudio: () => 1,
    logTarget: "player",
    async content(event, trigger, player) {
      const target = trigger.player;
      const result2 = await player.chooseButton({
        createDialog: [`选择${get.translation(target)}要进行的整肃类型`, [["zhengsu_leijin", "zhengsu_bianzhen", "zhengsu_mingzhi"].filter((i) => !target.hasSkill(i)), "vcard"]],
        forced: true,
        ai() {
          return Math.random();
        }
      }).forResult();
      if (!result2.bool || !result2.links?.length) {
        return;
      }
      const name = result2.links[0][2];
      target.addTempSkill("houfeng_share", {
        player: ["phaseDiscardAfter", "phaseAfter"]
      });
      target.markAuto("houfeng_share", [[player, name]]);
      target.addTempSkill(name, { player: ["phaseDiscardAfter", "phaseAfter"] });
      target.markAuto("houfeng", name);
      target.popup(name, "thunder");
      await game.delayx();
    },
    subSkill: {
      share: {
        audio: "houfeng",
        charlotte: true,
        onremove: ["houfeng", "houfeng_share"],
        trigger: { player: "phaseDiscardEnd" },
        forced: true,
        getIndex(event, player) {
          return player.getStorage("houfeng");
        },
        logAudio(event, player, _3, data) {
          if (!player.storage[data]) {
            return "houfeng3.mp3";
          }
          return "houfeng2.mp3";
        },
        async content(event, trigger, player) {
          player.unmarkAuto("houfeng", event.indexedData);
          if (!player.storage[event.indexedData]) {
            player.popup("整肃失败", "fire");
            game.log(player, "整肃失败");
            return;
          }
          player.popup("整肃成功", "wood");
          game.log(player, "整肃成功");
          const list = player.getStorage("houfeng_share").filter((entry) => entry[1] === event.indexedData && entry[0].isIn()).map((entry) => entry[0]);
          list.unshift(player);
          let control;
          if (list.some((i) => i.isDamaged())) {
            let drawEffect = 0;
            let recoverEffect = 0;
            for (const target of list) {
              drawEffect += 2 * get.effect(target, { name: "draw" }, player, player);
              recoverEffect += get.recoverEffect(target, player, player);
            }
            control = (await trigger.player.chooseControl({
              prompt: `整肃奖励：请选择${get.translation(list)}的整肃奖励`,
              controls: ["摸两张牌", "回复体力"],
              ai() {
                const evt = get.event();
                return ["摸两张牌", "回复体力"][evt.goon.indexOf(Math.max(...evt.goon))];
              }
            }).set("goon", [drawEffect, recoverEffect]).forResult()).control;
          } else {
            control = "摸两张牌";
          }
          if (control === "摸两张牌") {
            await game.asyncDraw(list, 2);
          } else {
            for (const target of list) {
              await target.recover();
            }
          }
          await game.delayx();
        }
      }
    }
  },
  houfeng1: { audio: true },
  //手杀皇甫嵩
  spzhengjun: {
    audio: 3,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return ["zhengsu_leijin", "zhengsu_bianzhen", "zhengsu_mingzhi"].some((i) => !player.hasSkill(i));
    },
    async cost(event, trigger, player) {
      const result2 = await player.chooseButton([get.prompt(event.skill), [["zhengsu_leijin", "zhengsu_bianzhen", "zhengsu_mingzhi"].filter((i) => !player.hasSkill(i)), "vcard"]]).set("ai", () => Math.random()).forResult();
      event.result = {
        bool: result2.bool,
        cost_data: result2.links?.[0][2]
      };
    },
    onremove: true,
    logAudio: () => 1,
    async content(event, trigger, player) {
      const name = event.cost_data;
      player.addTempSkill("spzhengjun_share", {
        player: ["phaseDiscardAfter", "phaseAfter"]
      });
      player.addTempSkill(name, { player: ["phaseDiscardAfter", "phaseAfter"] });
      player.markAuto("spzhengjun", name);
      player.popup(name, "thunder");
      await game.delayx();
    },
    subSkill: {
      share: {
        audio: "spzhengjun",
        charlotte: true,
        trigger: { player: "phaseDiscardEnd" },
        forced: true,
        getIndex(event, player) {
          return player.getStorage("spzhengjun");
        },
        logAudio(event, player, _3, data) {
          if (!player.storage[data]) {
            return "spzhengjun3.mp3";
          }
          return "spzhengjun2.mp3";
        },
        async content(event, trigger, player) {
          player.unmarkAuto("spzhengjun", event.indexedData);
          if (!player.storage[event.indexedData]) {
            player.popup("整肃失败", "fire");
            game.log(player, "整肃失败");
            return;
          }
          player.popup("整肃成功", "wood");
          game.log(player, "整肃成功");
          await player.chooseDrawRecover(2, "整肃奖励：摸两张牌或回复1点体力", true);
          let result2 = await player.chooseTarget("整军：是否令一名其他角色也获得整肃奖励？", lib.filter.notMe).set("ai", (target2) => {
            const player2 = _status.event.player;
            return Math.max(2 * get.effect(target2, { name: "draw" }, target2, player2), get.recoverEffect(target2, target2, player2));
          }).forResult();
          if (!result2.bool) {
            return;
          }
          const target = result2.targets[0];
          player.line(target);
          if (target.isHealthy()) {
            result2.index = 0;
          } else {
            result2 = await player.chooseControl("摸牌", "回血").set("prompt", `整肃奖励：令${get.translation(target)}摸两张牌或回复1点体力`).set("ai", () => _status.event.goon ? 1 : 0).set("goon", 2 * get.effect(target, { name: "draw" }, target, player) < get.recoverEffect(target, target, player)).forResult();
          }
          if (result2.index) {
            await target.recover();
          } else {
            await target.draw(2);
          }
        }
      }
    }
  },
  spshiji: {
    audio: 2,
    trigger: { source: "damageBegin2" },
    logTarget: "player",
    filter(event, player) {
      return player !== event.player && event.hasNature("linked") && event.player.countCards("h") > 0 && !player.isMaxHandcard(true);
    },
    check(event, player) {
      return get.attitude(player, event.player) <= 0;
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      await player.viewHandcards(target);
      const hs = target.getCards("h", { color: "red" });
      if (hs.length) {
        await target.discard(hs);
        await player.draw(hs.length);
      }
    }
  },
  sptaoluan: {
    audio: 2,
    trigger: { global: "judgeFixing" },
    usable: 1,
    filter(event, player) {
      return event.result && event.result.suit === "spade";
    },
    check(event, player) {
      return event.result.judge * get.attitude(player, event.player) <= 0;
    },
    async content(event, trigger, player) {
      const evt = trigger.getParent();
      if (evt != null) {
        if (evt.name === "phaseJudge") {
          evt.excluded = true;
        } else {
          evt.finish();
          evt._triggered = null;
          if (evt.name.startsWith("pre_")) {
            const parent = evt.getParent();
            if (parent != null) {
              parent.finish();
              parent._triggered = null;
            }
          }
          const nexts = trigger.next.slice();
          for (const next of nexts) {
            if (next.name === "judgeCallback") {
              trigger.next.remove(next);
            }
          }
          const events = game.getGlobalHistory("cardMove", (current) => current.getParent(2) === trigger.getParent());
          const cards2 = [];
          for (const current of events.slice().reverse()) {
            for (const card of current.cards) {
              if (get.position(card, true) === "o") {
                cards2.push(card);
              }
            }
          }
          trigger.orderingCards.addArray(cards2);
        }
      }
      const list = [];
      if (get.position(trigger.result.card) === "d") {
        list.push(0);
      }
      if (trigger.player.isIn() && player.canUse({ name: "sha", nature: "fire", isCard: true }, trigger.player, false)) {
        list.push(1);
      }
      if (!list.length) {
        return;
      }
      let index = list[0];
      if (list.length === 2) {
        const result2 = await player.chooseControl({
          choiceList: [`获得${get.translation(trigger.result.card)}`, `视为对${get.translation(trigger.player)}使用一张火【杀】`],
          choice: get.effect(trigger.player, { name: "sha" }, player, player) > 0 ? 1 : 0
        }).forResult();
        if (result2.index != null) {
          index = result2.index;
        }
      }
      if (index === 0) {
        await player.gain({
          cards: [trigger.result.card],
          animate: "gain2"
        });
      } else {
        await player.useCard({
          card: get.autoViewAs({ name: "sha", nature: "fire", isCard: true }),
          targets: [trigger.player],
          addCount: false
        });
      }
    }
  },
  //吕范
  spdiaodu: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt("spdiaodu"),
        prompt2: "令一名角色摸一张牌，然后移动其装备区内的一张牌",
        ai(target) {
          const player2 = _status.event.player;
          const att = get.attitude(player2, target);
          if (att > 0) {
            if (target.hasCards("e", (card) => get.value(card, target) <= 0 && game.hasPlayer((current) => current !== target && current.canEquip(card, false) && get.effect(current, card, player2, player2) > 0))) {
              return 2 * att;
            }
            if (!target.hasCards("e", (card) => game.hasPlayer((current) => current !== target && current.canEquip(card)))) {
              return 1;
            }
            return 0;
          }
          if (att >= 0) {
            return 0;
          }
          if (target.hasCards("e", (card) => get.value(card, target) >= 4.5 && game.hasPlayer((current) => current !== target && current.canEquip(card) && get.effect(current, card, player2, player2) > 0))) {
            return -att;
          }
          return 0;
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      event.target = target;
      await target.draw();
      const es = target.getCards("e", (card2) => game.hasPlayer((current) => current !== target && current.canEquip(card2)));
      if (!es.length) {
        return;
      }
      let card;
      if (es.length === 1) {
        card = es[0];
      } else {
        const result3 = await player.chooseButton({
          createDialog: [`移动${get.translation(target)}的一张装备牌`, es],
          forced: true,
          ai(button) {
            const player2 = get.player();
            const evt = get.event().getParent();
            if (evt == null) {
              return 0;
            }
            const target3 = evt.target;
            const card2 = button.link;
            if (!game.hasPlayer((current) => current !== target3 && current.canEquip(card2) && get.effect(current, card2, player2, player2) > 0)) {
              return 0;
            }
            return -get.value(card2, target3) * get.attitude(player2, target3);
          }
        }).forResult();
        if (!result3?.bool || !result3.links?.length) {
          return;
        }
        card = result3.links[0];
      }
      const result2 = await player.chooseTarget({
        prompt: `选择${get.translation(card)}的移动目标`,
        filterTarget(card2, player2, target3) {
          return target3.canEquip(get.event().card);
        },
        forced: true,
        ai(target3) {
          const evt = get.event();
          return get.effect(target3, evt.card, evt.player, evt.player);
        }
      }).set("card", card).forResult();
      if (!result2?.bool || !result2.targets?.length) {
        return;
      }
      const target2 = result2.targets[0];
      target.line(target2);
      target.$give(card, target2);
      await game.delay(0.5);
      await target2.equip(card);
    }
  },
  spdiancai: {
    audio: 2,
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      return player !== event.player && player.hasHistory("lose", (evt) => evt.hs && evt.hs.length > 0);
    },
    async cost(event, trigger, player) {
      let num = player.getHistory("lose", (evt) => evt.hs).map((evt) => evt.hs.length).reduce((a, b) => a + b);
      num = Math.min(num, game.countPlayer());
      event.result = await player.chooseTarget({
        prompt: get.prompt("spdiancai"),
        prompt2: `令至多${get.cnNumber(num)}名角色各摸一张牌`,
        selectTarget: [1, num],
        ai(target) {
          const player2 = get.player();
          return get.attitude(player2, target);
        }
      }).forResult();
      if (event.result.targets?.length) {
        event.result.targets.sortBySeat(trigger.player);
      }
    },
    async content(event, trigger, player) {
      const targets = event.targets;
      if (targets.length === 1) {
        await targets[0].draw();
        return;
      }
      await game.asyncDraw(targets);
      await game.delayx();
    }
  },
  mbdiaodu: {
    audio: "spdiaodu",
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.hasPlayer((target) => target.hasCards("e", (card) => game.hasPlayer((current) => current !== player && current !== target && current.canEquip(card))));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2("mbdiaodu"),
        filterTarget(card, player2, target) {
          return target.hasCards("e", (card2) => game.hasPlayer((current) => current !== player2 && current !== target && current.canEquip(card2)));
        },
        ai(target) {
          const player2 = get.player();
          const att = get.attitude(player2, target);
          if (att > 0 && target.hasCard((card) => get.value(card, target) <= 0 && game.hasPlayer((current) => current !== player2 && current !== target && current.canEquip(card, false) && get.effect(current, card, player2, player2) > 0), "e")) {
            return 2 * att;
          }
          if (att < 0 && target.hasCard((card) => get.value(card, target) >= 4.5 && game.hasPlayer((current) => current !== player2 && current !== target && current.canEquip(card) && get.effect(current, card, player2, player2) > 0), "e")) {
            return -att;
          }
          return 0;
        }
      }).forResult();
    },
    logTarget: "targets",
    async content(event, trigger, player) {
      const target = event.targets[0];
      const es = target.getCards("e", (card2) => game.hasPlayer((current) => current !== target && current.canEquip(card2)));
      const result2 = es.length === 1 ? { bool: true, links: es } : await player.chooseButton({
        createDialog: [`移动${get.translation(target)}的一张装备牌`, es],
        forced: true,
        ai(button) {
          const { player: player2, target: target3 } = get.event();
          const card2 = button.link;
          if (game.hasPlayer((current) => current !== player2 && current !== target3 && current.canEquip(card2) && get.effect(current, card2, player2, player2) > 0)) {
            return -get.value(card2, target3) * get.attitude(player2, target3);
          }
          return 0;
        }
      }).set("target", target).forResult();
      if (!result2?.bool || !result2.links?.length) {
        return;
      }
      const card = result2.links[0];
      const result22 = await player.chooseTarget({
        prompt: `请选择${get.translation(card)}的移动目标`,
        filterTarget(card2, player2, target3) {
          const { card2: card22 } = get.event();
          return target3 !== player2 && target3.canEquip(card22);
        },
        forced: true,
        ai(target3) {
          const { player: player2, card: card2 } = get.event();
          return get.effect(target3, card2, player2, player2);
        }
      }).set("card", card).forResult();
      if (!result22?.bool || !result22.targets?.length) {
        return;
      }
      const target2 = result22.targets[0];
      target.line(target2);
      target.$give(card, target2);
      await game.delay(0.5);
      await target2.equip(card);
      await target.draw();
    }
  },
  mbdiancai: {
    audio: "spdiancai",
    trigger: { global: "phaseUseEnd" },
    filter(event, player) {
      if (_status.currentPhase === player) {
        return false;
      }
      let num = 0;
      player.getHistory("lose", (evt) => {
        if (evt.cards2 && evt.getParent("phaseUse") === event) {
          num += evt.cards2.length;
        }
      });
      return num >= player.hp && player.countCards("h") < player.maxHp;
    },
    frequent: true,
    async content(event, trigger, player) {
      const num = player.maxHp - player.countCards("h");
      if (num > 0) {
        await player.draw(num);
      }
    }
  },
  spyanji: {
    audio: 3,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return ["zhengsu_leijin", "zhengsu_bianzhen", "zhengsu_mingzhi"].some((i) => !player.hasSkill(i));
    },
    onremove: true,
    logAudio: () => 1,
    async cost(event, trigger, player) {
      const result2 = await player.chooseButton([get.prompt(event.skill), [["zhengsu_leijin", "zhengsu_bianzhen", "zhengsu_mingzhi"].filter((i) => !player.hasSkill(i)), "vcard"]]).set("ai", () => Math.random()).forResult();
      event.result = {
        bool: result2.bool,
        cost_data: result2.links?.[0][2]
      };
    },
    async content(event, trigger, player) {
      const name = event.cost_data;
      player.addTempSkill("spyanji_share", {
        player: ["phaseDiscardAfter", "phaseAfter"]
      });
      player.addTempSkill(name, { player: ["phaseDiscardAfter", "phaseAfter"] });
      player.markAuto("spyanji", name);
      player.popup(name, "thunder");
      await game.delayx();
    },
    subSkill: {
      share: {
        audio: "spyanji",
        charlotte: true,
        trigger: { player: "phaseDiscardEnd" },
        forced: true,
        getIndex(event, player) {
          return player.getStorage("spyanji");
        },
        logAudio(event, player, _3, data) {
          if (!player.storage[data]) {
            return "spyanji3.mp3";
          }
          return "spyanji2.mp3";
        },
        async content(event, trigger, player) {
          player.unmarkAuto("spyanji", event.indexedData);
          if (!player.storage[event.indexedData]) {
            player.popup("整肃失败", "fire");
            game.log(player, "整肃失败");
            return;
          }
          player.popup("整肃成功", "wood");
          game.log(player, "整肃成功");
          await player.chooseDrawRecover(2, "整肃奖励：摸两张牌或回复1点体力", true);
        }
      }
    }
  },
  //蒋钦
  spjianyi: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    forced: true,
    filter(event, player) {
      return player !== event.player && game.getGlobalHistory("cardMove", (evt) => evt.name === "lose" && evt.type === "discard" && evt.cards.some((card) => get.subtype(card, false) === "equip2" && get.position(card, true) === "d")).length > 0;
    },
    async content(event, trigger, player) {
      const cards2 = [];
      for (const evt of game.getGlobalHistory("cardMove")) {
        if (evt.name !== "lose" || evt.type !== "discard") {
          continue;
        }
        for (const card of evt.cards) {
          if (get.subtype(card, false) === "equip2" && get.position(card, true) === "d") {
            cards2.push(card);
          }
        }
      }
      const result2 = await player.chooseButton({
        createDialog: ["俭衣：获得一张防具牌", cards2],
        forced: true,
        ai(button) {
          const player2 = get.player();
          return get.value(button.link, player2);
        }
      }).forResult();
      if (!result2.bool || !result2.links?.length) {
        return;
      }
      await player.gain({
        cards: result2.links,
        animate: "gain2"
      });
    }
  },
  spshangyi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hasCards("he") && game.hasPlayer((current) => lib.skill.spshangyi.filterTarget(null, player, current));
    },
    filterCard: true,
    position: "he",
    check(card) {
      return 6 - get.value(card);
    },
    filterTarget(card, player, target) {
      return target !== player && target.hasCards("h");
    },
    async content(event, trigger, player) {
      const target = event.target;
      await target.viewHandcards(player);
      await player.gainPlayerCard({ target, position: "h", forced: true, visible: true });
    },
    ai: {
      order: 6,
      result: {
        player: 0.5,
        target(player, target) {
          if (target.hasSkillTag("noh")) {
            return 0;
          }
          return -1;
        }
      }
    }
  },
  //蒋琬
  spzhenting: {
    audio: 4,
    logAudio(_1, _2, _3, _4, costResult) {
      if (costResult?.cost_data === "all") {
        return ["spzhenting3.mp3", "spzhenting4.mp3"];
      }
      return 2;
    },
    trigger: { global: "useCardToTarget" },
    usable: 1,
    filter(event, player) {
      if (event.card.name !== "sha" && get.type(event.card, null, false) !== "delay") {
        return false;
      }
      return event.player !== player && (event.target === player || player.inRange(event.target));
    },
    async cost(event, trigger, player) {
      let list = [
        ["discard", `弃置${get.translation(trigger.player)}一张手牌`],
        ["draw", "摸一张牌"],
        ["all", "背水！代替其成为此牌目标"]
      ];
      if (player.hasSkill("spjincui_delete")) {
        list = list.slice(0, 2);
      }
      const result2 = await player.chooseButton([get.prompt(event.skill, trigger.target), [list, "textbutton"]]).set("filterButton", (button) => {
        const user = get.event().getTrigger().player;
        const player2 = get.player();
        return button.link !== "discard" || user.countDiscardableCards(player2, "h");
      }).set("ai", (button) => {
        const trigger2 = get.event().getTrigger();
        const player2 = get.player();
        const { target, player: user, card } = trigger2;
        let eff1 = get.effect(user, { name: "guohe_copy2" }, player2, player2);
        let eff2 = get.effect(player2, { name: "draw" }, player2, player2);
        if (button.link === "discard") {
          return eff1;
        }
        if (button.link === "draw") {
          return eff2;
        }
        const getV = (current) => get.effect(current, card, user, player2);
        let eff = getV(player2) - getV(target) + eff2;
        if (user.countDiscardableCards(player2, "h")) {
          eff += eff1;
        }
        return eff;
      }).forResult();
      if (result2?.bool && result2.links?.length) {
        event.result = {
          bool: true,
          cost_data: result2.links[0]
        };
      }
    },
    logTarget: "target",
    async content(event, trigger, player) {
      const { cost_data: link } = event;
      const { target, player: user } = trigger;
      if (link !== "draw" && user.countDiscardableCards(player, "h")) {
        player.line(user, "fire");
        await player.discardPlayerCard(user, "h", true);
      }
      if (link !== "discard") {
        await player.draw();
      }
      if (link !== "all") {
        return;
      }
      const evt = trigger.getParent();
      if (evt.targets?.includes(player)) {
        return;
      }
      evt.triggeredTargets2.remove(target);
      evt.targets.remove(target);
      evt.triggeredTargets2.add(player);
      evt.targets.add(player);
      game.log(trigger.card, "的目标被改为了", player);
      trigger.untrigger();
    },
    ai: {
      threaten: 1.4
    }
  },
  spjincui: {
    audio: 4,
    enable: "phaseUse",
    usable: 1,
    seatRelated: "changeSeat",
    limited: true,
    skillAnimation: true,
    animationColor: "orange",
    filterTarget: lib.filter.notMe,
    prompt() {
      const player = get.player();
      const num = player.hp - player.getAllHistory("useSkill", (evt) => evt.skill === "spzhenting").length;
      let str = "与一名其他角色交换座次";
      if (num > 0) {
        str = `${str}并失去${num}点体力`;
      }
      return str;
    },
    async content(event, trigger, player) {
      const { name, target } = event;
      player.awakenSkill(name);
      game.broadcastAll(
        (target1, target2) => {
          game.swapSeat(target1, target2);
        },
        player,
        target
      );
      const num = player.hp - player.getAllHistory("useSkill", (evt) => evt.skill === "spzhenting").length;
      if (num > 0) {
        await player.loseHp(num);
      }
      if (game.hasGlobalHistory("changeHp", (evt) => {
        if (evt.player !== player || !evt.num) {
          return false;
        }
        return evt.getParent().name === "loseHp" && evt.getParent(2) === event;
      })) {
        return;
      }
      await player.gainMaxHp();
      player.addSkill("spjincui_delete");
    },
    ai: {
      order: 5,
      result: {
        player(player, target) {
          if (player.hasUnknown()) {
            return 0;
          }
          let num = 0;
          let current = player.next;
          while (true) {
            num -= get.sgnAttitude(player, current);
            if (current === target) {
              break;
            }
            current = current.next;
          }
          while (true) {
            if (current === player) {
              break;
            }
            num += get.sgnAttitude(player, current) * 1.1;
            current = current.next;
          }
          const count = Math.max(0, player.hp - player.getAllHistory("useSkill", (evt) => evt.skill === "spzhenting").length);
          return num + 1 - count;
        }
      }
    },
    subSkill: {
      delete: {
        charlotte: true
      }
    }
  },
  //张昌蒲
  spdifei: {
    audio: 2,
    trigger: { player: "damageEnd" },
    forced: true,
    usable: 1,
    async content(event, trigger, player) {
      const next = player.chooseToDiscard({
        prompt: "抵诽：弃置一张手牌或摸一张牌",
        position: "h",
        ai(card) {
          return -get.value(card);
        }
      });
      if (trigger.card) {
        const suit = get.suit(trigger.card, false);
        if (suit != null && lib.suit.includes(suit)) {
          next.set("suit", suit);
          next.set("prompt2", `然后若没有${get.translation(suit)}手牌则回复1点体力`);
          next.set("ai", (card) => {
            const player2 = get.player();
            const suit2 = get.event().suit;
            if (player2.hasCard((cardx) => cardx !== card && get.suit(cardx) === suit2, "h")) {
              return 0;
            }
            if (get.name(card) !== "tao" && (get.position(card) === "h" && get.suit(card) === suit2 || player2.hp === 1)) {
              return 8 - get.value(card);
            }
            return 5 - get.value(card);
          });
        }
      }
      const result2 = await next.forResult();
      if (!result2.bool) {
        await player.draw();
      }
      await player.showHandcards();
      if (trigger.card) {
        const suit = get.suit(trigger.card, false);
        if (suit != null && !lib.suit.includes(suit) || !player.hasCards("h", { suit })) {
          await player.recover();
        }
      }
    }
  },
  spyanjiao: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    chooseButton: {
      dialog(event, player) {
        const list = get.addNewRowList(player.getCards("h"), "suit", player);
        const dialog = ui.create.dialog();
        dialog.add([
          [[`###严教###<div class="text center">${get.translation("spyanjiao", "info")}</div>`], "addNewRow"],
          [
            (dialog2) => {
              dialog2.classList.add("fullheight");
              dialog2.forcebutton = false;
              dialog2._scrollset = false;
            },
            "handle"
          ],
          list.map((item) => [Array.isArray(item) ? item : [item], "addNewRow"])
        ]);
        return dialog;
      },
      filter(button, player) {
        return button.links.length;
      },
      check(button) {
        const player = get.player();
        let map = {};
        let hs = player.getCards("h");
        let min = Infinity;
        let min_suit = null;
        for (const card of hs) {
          const suit = get.suit(card, player);
          if (!map[suit]) {
            map[suit] = 0;
          }
          map[suit] += get.value(card);
        }
        for (const suit in map) {
          if (map[suit] < min) {
            min = map[suit];
            min_suit = suit;
          }
        }
        if (get.suit(button.links[0], player) === min_suit) {
          return 1;
        }
        return 0;
      },
      backup(links, player) {
        return {
          audio: "spyanjiao",
          filterCard: { suit: links[0] },
          selectCard: -1,
          position: "h",
          filterTarget: lib.filter.notMe,
          discard: false,
          lose: false,
          delay: false,
          async content(event, trigger, player2) {
            const { cards: cards2, target } = event;
            player2.addSkill("spyanjiao_draw");
            player2.addMark("spyanjiao_draw", cards2.length, false);
            await player2.give(cards2, target);
            await target.damage("nocard");
          },
          ai: {
            result: {
              target(player2, target) {
                if (!ui.selected.cards.length) {
                  return 0;
                }
                const val = get.value(ui.selected.cards, target);
                if (val < 0) {
                  return val + get.damageEffect(target, player2, target);
                }
                if (val > 5 || get.value(ui.selected.cards, player2) > 5) {
                  return 0;
                }
                return get.damageEffect(target, player2, target);
              }
            }
          }
        };
      },
      prompt: () => "请选择【严教】的目标"
    },
    subSkill: {
      draw: {
        audio: "spyanjiao",
        charlotte: true,
        onremove: true,
        trigger: { player: "phaseBegin" },
        forced: true,
        async content(event, trigger, player) {
          const num = player.countMark(event.name);
          player.removeSkill(event.name);
          await player.draw(num);
        },
        mark: true,
        intro: { content: "下回合开始时摸#张牌" }
      },
      backup: { audio: "spyanjiao" }
    },
    ai: {
      order: 1,
      result: { player: 1 }
    }
  },
  //崔琰
  spyajun: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      let hs = player.getCards("h");
      return hs.length > 0 && !player.hasSkillTag("noCompareSource") && player.hasHistory("gain", (evt) => {
        for (const i of evt.cards) {
          if (hs.includes(i)) {
            return true;
          }
        }
        return false;
      }) && game.hasPlayer((current) => current !== player && player.canCompare(current));
    },
    async cost(event, trigger, player) {
      let cards2 = [];
      const hs = player.getCards("h");
      player.getHistory("gain", (evt) => {
        cards2.addArray(evt.cards);
      });
      cards2 = cards2.filter((i) => hs.includes(i));
      event.result = await player.chooseCardTarget({
        prompt: get.prompt("spyajun"),
        prompt2: "操作提示：选择一张本回合新得到的牌作为拼点牌，然后选择一名拼点目标",
        cards: cards2,
        filterCard(card) {
          return _status.event.cards.includes(card);
        },
        filterTarget(card, player2, target) {
          return player2.canCompare(target);
        },
        ai1(card) {
          return get.number(card) - get.value(card);
        },
        ai2(target) {
          return -get.attitude(_status.event.player, target) * Math.sqrt(5 - Math.min(4, target.countCards("h"))) * (target.hasSkillTag("noh") ? 0.5 : 1);
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        cards: [card],
        targets: [target]
      } = event;
      const next = player.chooseToCompare(target);
      next.fixedResult ??= {};
      next.fixedResult[player.playerid] = card;
      const result2 = await next.forResult();
      if (result2.bool) {
        const cards2 = [result2.player, result2.target].filterInD("d");
        if (cards2.length) {
          const result22 = await player.chooseButton(["雅俊：是否将一张牌置于牌堆顶？", cards2]).set("ai", (button) => {
            if (get.color(button.link) === "black") {
              return 1;
            }
            return 0;
          }).forResult();
          if (result22.bool && result22.links?.length) {
            const { links } = result22;
            game.log(player, "将", links, "置于牌堆顶");
            await game.cardsGotoPile(links, "insert");
          }
        }
      } else {
        player.addMark("spyajun_less", 1, false);
        player.addTempSkill("spyajun_less");
      }
    },
    group: "spyajun_draw",
    subSkill: {
      draw: {
        audio: "spyajun",
        trigger: { player: "phaseDrawBegin2" },
        forced: true,
        locked: false,
        filter(event, player) {
          return !event.numFixed;
        },
        async content(event, trigger, player) {
          trigger.num++;
        }
      },
      less: {
        onremove: true,
        charlotte: true,
        intro: { content: "手牌上限-#" },
        mod: {
          maxHandcard(player, num) {
            return num - player.countMark("spyajun_less");
          }
        }
      }
    }
  },
  spzundi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    filterCard: true,
    filterTarget: true,
    check(card) {
      return 7 - get.value(card);
    },
    async content(event, trigger, player) {
      const { target } = event;
      const result2 = await player.judge().forResult();
      if (result2.color) {
        switch (result2.color) {
          case "black":
            await target.draw(3);
            break;
          case "red":
            await target.moveCard();
            break;
        }
      }
    },
    ai: {
      order: 10,
      result: {
        target(player, target) {
          if (target.canMoveCard(true)) {
            return 3;
          }
          return 1;
        }
      }
    }
  },
  //花蔓
  spxiangzhen: {
    trigger: { target: "useCardToBefore" },
    forced: true,
    audio: 2,
    filter(event, player) {
      return event.card.name === "nanman";
    },
    async content(event, trigger, player) {
      trigger.cancel();
    },
    group: "spxiangzhen_draw",
    subSkill: {
      draw: {
        audio: "spxiangzhen",
        trigger: { global: "useCardAfter" },
        forced: true,
        filter(event, player) {
          return event.card.name === "nanman" && game.hasPlayer2((current) => current.hasHistory("damage", (evt) => evt.card === event.card));
        },
        async content(event, trigger, player) {
          let sources = game.filterPlayer((cur) => cur.hasHistory("sourceDamage", (evt) => evt.card === trigger.card));
          sources.push(player);
          await game.asyncDraw(sources.sortBySeat());
          game.delayx();
        }
      }
    }
  },
  spfangzong: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    filter(event, player) {
      return player.countCards("h") < Math.min(8, game.countPlayer());
    },
    async content(event, trigger, player) {
      await player.drawTo(Math.min(8, game.countPlayer()));
    },
    mod: {
      playerEnabled(card, player, target) {
        if (player.isPhaseUsing() && get.tag(card, "damage") > 0 && !player.isTempBanned("spfangzong") && player.inRange(target)) {
          return false;
        }
      },
      targetEnabled(card, player, target) {
        if (get.tag(card, "damage") > 0 && !target.isTempBanned("spfangzong") && player.inRange(target)) {
          return false;
        }
      }
    },
    ai: {
      combo: "spxizhan",
      halfneg: true
    }
  },
  spxizhan: {
    audio: 5,
    trigger: { global: "phaseBegin" },
    filter(event, player) {
      return player !== event.player;
    },
    logAudio(event, player, name, indexedData, costResult) {
      if (!costResult.cards.length) {
        return "spxizhan2.mp3";
      }
      let suit = get.suit(costResult.cards[0]);
      return `spxizhan${[null, "spade", null, "heart", "club", "diamond"].indexOf(suit)}.mp3`;
    },
    async cost(event, trigger, player) {
      const result2 = await player.chooseToDiscard("he", "嬉战：弃置一张牌或失去1点体力", `根据弃置的牌对${get.translation(trigger.player)}视为使用如下牌：<br>♠，其使用【酒】；♥，你使用【无中生有】<br>♣，对其使用【铁索连环】；♦：对其使用火【杀】`).set("ai", (card) => {
        let player2 = _status.event.player;
        let target = _status.event.getTrigger().player;
        let suit = get.suit(card, player2);
        let list;
        switch (suit) {
          case "spade":
            list = [{ name: "jiu" }, target, target];
            break;
          case "heart":
            list = [{ name: "wuzhong" }, player2, player2];
            break;
          case "club":
            list = [{ name: "tiesuo" }, player2, target];
            break;
          case "diamond":
            list = [{ name: "sha", nature: "fire" }, player2, target];
            break;
          default:
            return 0;
        }
        list[0].isCard = true;
        let eff = 0;
        if (list[1].canUse(list[0], list[2], false)) {
          eff = get.effect(list[2], list[0], list[1], player2);
        }
        if (eff >= 0 || suit === "club") {
          eff = Math.max(eff, 5);
        }
        return eff * 1.5 - get.value(card);
      }).set("chooseonly", true).forResult();
      event.result = {
        bool: true,
        cards: result2.cards || [],
        targets: [trigger.player]
      };
    },
    async content(event, trigger, player) {
      if (event.cards && event.cards.length) {
        await player.discard(event.cards);
        player.tempBanSkill("spfangzong");
        let target = trigger.player;
        let card = event.cards[0];
        let suit = get.suit(card, player);
        if (!lib.suit.includes(suit) || (!target || !target.isIn()) && suit !== "heart") {
          return;
        }
        switch (suit) {
          case "spade":
            await target.chooseUseTarget("jiu", true);
            break;
          case "heart":
            await player.chooseUseTarget("wuzhong", true);
            break;
          case "club":
            if (player.canUse("tiesuo", target)) {
              await player.useCard({ name: "tiesuo", isCard: true }, target);
            }
            break;
          case "diamond":
            if (player.canUse({ name: "sha", isCard: true, nature: "fire" }, target, false)) {
              await player.useCard({ name: "sha", isCard: true, nature: "fire" }, target, false);
            }
            break;
        }
      } else {
        await player.loseHp();
      }
    },
    ai: {
      halfneg: true
    }
  },
  //高览
  spjungong: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      const num = player.countMark("spjungong_used");
      return num < player.hp || num <= player.countCards("he");
    },
    filterTarget(card, player, target) {
      return target !== player && player.canUse("sha", target, false);
    },
    filterCard: true,
    position: "he",
    selectCard() {
      const player = get.player();
      const num = player.countMark("spjungong_used") + 1;
      if (ui.selected.cards.length || num > player.hp) {
        return num;
      }
      return [0, num];
    },
    check(card) {
      return 6 - get.value(card);
    },
    prompt() {
      const player = get.player();
      const num = get.cnNumber(player.countMark("spjungong_used") + 1);
      return `弃置${num}张牌或失去${num}点体力，视为使用杀`;
    },
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      player.addTempSkill("spjungong_used");
      player.addMark("spjungong_used", 1, false);
      if (!cards2.length) {
        await player.loseHp(player.countMark("spjungong_used"));
      }
      await player.useCard({
        card: get.autoViewAs({ name: "sha", isCard: true }),
        targets: [target],
        addCount: false
      });
      if (player.hasHistory("sourceDamage", (evt) => {
        const card = evt.card;
        if (!card || card.name !== "sha") {
          return false;
        }
        const useEvent = evt.getParent("useCard");
        return useEvent != null && useEvent.card === card && useEvent.getParent() === event;
      })) {
        player.tempBanSkill("spjungong");
      }
    },
    ai: {
      order(item, player) {
        return get.order({ name: "sha" }, player) + 1;
      },
      result: {
        target(player, target) {
          if (!ui.selected.cards.length) {
            return 0;
          }
          return get.effect(target, { name: "sha" }, player, target);
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true,
        intro: { content: "已发动过#次" }
      }
    }
  },
  spdengli: {
    audio: 2,
    trigger: {
      player: "useCardToPlayered",
      target: "useCardToTargeted"
    },
    frequent: true,
    filter(event, player) {
      return event.card.name === "sha" && event.player.hp === event.target.hp;
    },
    async content(event, trigger, player) {
      await player.draw();
    },
    ai: {
      effect: {
        player_use(card, player, target) {
          let hp = player.hp;
          let evt = _status.event;
          if (evt.name === "chooseToUse" && evt.player === player && evt.skill === "spjungong" && !ui.selected.cards.length) {
            hp -= (player.getStat("skill").spjungong || 0) + 1;
          }
          if (card && card.name === "sha" && hp === target.hp) {
            return [1, 0.3];
          }
        },
        target_use(card, player, target) {
          if (card && card.name === "sha" && player.hp === target.hp) {
            return [1, 0.3];
          }
        }
      }
    }
  },
  //孙翊
  zaoli: {
    trigger: { player: "phaseBegin" },
    audio: 2,
    forced: true,
    filter(event, player) {
      return player.hasMark("zaoli");
    },
    async content(event, trigger, player) {
      const num = player.storage.zaoli;
      player.removeMark("zaoli", num);
      const result2 = player.hasCards("he") ? await player.chooseToDiscard({
        prompt: "躁厉：弃置至少一张牌",
        selectCard: [1, Infinity],
        position: "he",
        forced: true,
        allowChooseAll: true,
        ai(card) {
          return card.hasGaintag("zaoli") ? 1 : 5 - get.value(card);
        }
      }).forResult() : { bool: false, cards: [] };
      await player.draw(num + (result2.bool ? result2.cards?.length : 0));
      if (num > 2) {
        await player.loseHp();
      }
    },
    mod: {
      cardEnabled2(card, player) {
        if (player.isPhaseUsing() && get.itemtype(card) === "card" && card.hasGaintag("zaoli")) {
          return false;
        }
      }
    },
    group: ["zaoli_add", "zaoli_count"],
    init(player) {
      if (player === _status.currentPhase) {
        const gains = player.getHistory("gain").flatMap((evt) => evt.cards);
        const hs = player.getCards("h", (card) => !gains.includes(card));
        if (hs.length) {
          player.addGaintag(hs, "zaoli");
        }
      }
    },
    onremove(player) {
      player.removeGaintag("zaoli");
      delete player.storage.zaoli;
    },
    intro: { content: "mark" },
    subSkill: {
      add: {
        audio: "zaoli",
        trigger: { player: ["useCard", "respond"] },
        forced: true,
        filter(event, player) {
          return player.countMark("zaoli") < 4 && player.hasHistory("lose", (evt) => {
            const evtx = evt.relatedEvent || evt.getParent();
            return evt.hs && evt.hs.length > 0 && evtx === event;
          });
        },
        async content(event, trigger, player) {
          player.addMark("zaoli", 1);
        }
      },
      count: {
        trigger: { global: "phaseBeginStart" },
        forced: true,
        firstDo: true,
        silent: true,
        filter(event, player) {
          if (player === event.player) {
            return player.hasCards("h");
          }
          return player.hasCard((card) => card.hasGaintag("zaoli"));
        },
        async content(event, trigger, player) {
          if (player === trigger.player) {
            player.addGaintag(player.getCards("h"), "zaoli");
          } else {
            player.removeGaintag("zaoli");
          }
        }
      }
    }
  },
  //王双
  yiyong: {
    audio: 2,
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return event.card && event.card.name === "sha" && event.source && event.source.isIn() && player !== event.source && event.cards.filterInD().length > 0 && player.getEquips(1).length > 0;
    },
    check(event, player) {
      const card = {
        name: "sha",
        cards: event.cards.filterInD()
      };
      const target = event.source;
      return !player.canUse(card, target, false) || get.effect(target, card, player, player) > 0;
    },
    async content(event, trigger, player) {
      const cards2 = trigger.cards.filterInD();
      await player.gain({
        cards: cards2,
        animate: "gain2"
      });
      const target = trigger.source;
      const handcards = player.getCards("h");
      if (!target || !target.isIn() || handcards.length < cards2.length || !cards2.every((card) => handcards.includes(card)) || !player.canUse({ name: "sha", cards: cards2 }, target, false)) {
        return;
      }
      const useCardEvent = player.useCard({
        card: get.autoViewAs({ name: "sha" }),
        cards: cards2,
        targets: [target],
        addCount: false
      });
      if (!target.getEquips(1).length) {
        useCardEvent.baseDamage = 2;
      }
      await useCardEvent;
    }
  },
  shanxie: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    async content(event, trigger, player) {
      const card = get.cardPile2((card2) => get.subtype(card2) === "equip1");
      if (card) {
        await player.gain({
          cards: [card],
          animate: "gain2"
        });
        return;
      }
      const targets = game.filterPlayer((current) => current.getEquips(1).length > 0);
      if (!targets.length) {
        return;
      }
      const target = targets.randomGet();
      await player.gain({
        cards: target.getEquips(1),
        source: target,
        animate: "give",
        bySelf: true
      });
    },
    ai: {
      order: 9,
      result: { player: 1 }
    },
    group: ["shanxie_exclude", "shanxie_shan"],
    subSkill: {
      exclude: {
        trigger: { global: "useCard" },
        forced: true,
        locked: false,
        filter(event, player) {
          if (event.card.name !== "shan" || event.getParent(2)?.player !== player) {
            return false;
          }
          const num = get.number(event.card);
          return typeof num !== "number" || num <= player.getAttackRange() * 2;
        },
        logTarget: "player",
        async content(event, trigger, player) {
          trigger.all_excluded = true;
        },
        sub: true
      },
      shan: {
        trigger: { player: "useCardToPlayered" },
        filter(event, player) {
          return event.target.isAlive() && event.card.name === "sha";
        },
        silent: true,
        async content(event, trigger, player) {
          trigger.target.addTempSkill("shanxie_banned");
          trigger.target.storage.shanxie_banned = {
            card: trigger.card,
            num: player.getAttackRange() * 2
          };
        },
        sub: true
      },
      banned: {
        init(player) {
          player.storage.shanxie_banned = {};
        },
        onremove(player) {
          delete player.storage.shanxie_banned;
        },
        trigger: { global: "useCardEnd" },
        filter(event, player) {
          return event.card === player.storage.shanxie_banned.card;
        },
        silent: true,
        async content(event, trigger, player) {
          player.removeSkill("shanxie_banned");
        },
        ai: {
          effect: {
            player(card, player, target) {
              if (get.name(card) === "shan") {
                const num = get.number(card);
                if (!num || num <= player.storage.shanxie_banned.num) {
                  return "zeroplayertarget";
                }
              }
            }
          }
        }
      }
    }
  },
  //吴景流兵
  liubing: {
    audio: 2,
    trigger: { player: "useCard1" },
    forced: true,
    filter(event, player) {
      if (event.card.name !== "sha" || !event.cards || !event.cards.length) {
        return false;
      }
      let evt = event.getParent("phaseUse");
      return evt && evt.player === player && player.getHistory("useCard", (evt2) => evt2.card.name === "sha" && evt2.cards && evt2.cards.length && evt2.getParent("phaseUse") === evt).indexOf(event) === 0;
    },
    async content(event, trigger, player) {
      game.log(player, "将", trigger.card, "的花色改为", "#y♦");
      trigger.card.suit = "diamond";
      trigger.card.color = "red";
    },
    group: "liubing_gain",
    subSkill: {
      gain: {
        trigger: { global: "useCardAfter" },
        forced: true,
        audio: "liubing",
        filter(event, player) {
          return event.player !== player && event.card.isCard && event.card.name === "sha" && get.color(event.card) === "black" && event.cards.filterInD().length > 0 && event.player.isPhaseUsing() && !event.player.hasHistory("sourceDamage", (evt) => evt.card === event.card);
        },
        logTarget: "player",
        async content(event, trigger, player) {
          await player.gain(trigger.cards.filterInD(), "gain2");
        }
      }
    }
  },
  //新刘璋
  jutu: {
    audio: "xiusheng",
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      return player.storage.yaohu && game.hasPlayer((current) => current.group === player.storage.yaohu);
    },
    async content(event, trigger, player) {
      const cards2 = player.getExpansions("jutu");
      if (cards2.length > 0) {
        await player.gain({
          cards: cards2,
          animate: "gain2"
        });
      }
      const num = game.countPlayer((current) => current.group === player.storage.yaohu);
      await player.draw(num + 1);
      if (!num) {
        return;
      }
      const he = player.getCards("he");
      if (!he.length) {
        return;
      }
      let cards22 = he;
      if (he.length >= num) {
        const result2 = await player.chooseCard({
          prompt: `选择${get.cnNumber(num)}张牌作为“生”`,
          selectCard: num,
          position: "he",
          forced: true,
          allowChooseAll: true
        }).forResult();
        if (result2.bool && result2.cards?.length) {
          cards22 = result2.cards;
        }
      }
      if (cards22) {
        await player.addToExpansion({
          cards: cards22,
          source: player,
          animate: "give",
          gaintag: ["jutu"]
        });
      }
      await game.delayx();
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
    ai: {
      combo: "yaohu"
    }
  },
  yaohu: {
    audio: "yinlang",
    trigger: { player: "phaseBegin" },
    locked: false,
    filter(event, player) {
      return !player.hasSkill("yaohu_round") && game.hasPlayer((current) => current.group && current.group !== "unknown");
    },
    async cost(event, trigger, player) {
      const list = game.filterPlayer((current) => current.group != null && current.group !== "unknown").map((current) => current.group).unique();
      list.sort((a, b) => lib.group.indexOf(a) - lib.group.indexOf(b));
      if (!player.hasSkill("yaohu")) {
        list.push("cancel2");
      }
      const getn = (group) => game.countPlayer((current) => {
        if (current.group !== group) {
          return false;
        }
        if (player === current) {
          return 2;
        }
        if (get.attitude(current, player) > 0) {
          return 1;
        }
        return 1.3;
      });
      const list2 = list.toSorted((a, b) => getn(b) - getn(a));
      const choice = list2[0];
      const result2 = await player.chooseControl({
        prompt: "邀虎：请选择一个势力",
        controls: list,
        ai() {
          return get.event().choice;
        }
      }).set("choice", choice).forResult();
      event.result = {
        bool: result2.control !== "cancel2",
        targets: game.filterPlayer((current) => current.group === result2.control),
        cost_data: {
          group: result2.control
        }
      };
    },
    async content(event, trigger, player) {
      const group = event.cost_data.group;
      game.log(player, "选择了", `#y${get.translation(`${group}2`)}`);
      player.storage.yaohu = group;
      player.markSkill("yaohu");
    },
    ai: {
      combo: "jutu"
    },
    intro: { content: "已选择了$势力" },
    group: "yaohu_gain",
    subSkill: {
      round: {},
      gain: {
        audio: "yinlang",
        trigger: { global: "phaseUseBegin" },
        filter(event, player) {
          return event.player !== player && event.player.group === player.storage.yaohu && event.player.isIn() && player.hasExpansions("jutu");
        },
        forced: true,
        locked: false,
        logTarget: "player",
        async content(event, trigger, player) {
          const target = trigger.player;
          if (!player.hasExpansions("jutu")) {
            return;
          }
          const result2 = await target.chooseButton({
            createDialog: ["选择获得一张“生”", player.getExpansions("jutu")],
            direct: true,
            forced: true,
            ai(button) {
              const player2 = get.player();
              return get.value(button.link, player2);
            }
          }).forResult();
          if (result2?.bool && result2.links?.length) {
            await target.gain({
              cards: result2.links,
              source: player,
              animate: "give",
              bySelf: true
            });
          }
          let useSha = true;
          if (game.hasPlayer((current) => current !== player && current !== target)) {
            let result3 = await player.chooseTarget({
              prompt: `选择${get.translation(target)}使用【杀】的目标`,
              filterTarget(card, player2, target2) {
                return target2 !== player2 && target2 !== _status.event.source;
              },
              forced: true,
              ai(target2) {
                const evt = get.event();
                return get.effect(target2, { name: "sha" }, evt.source, evt.player);
              }
            }).set("source", target).forResult();
            if (!result3?.bool || !result3.targets?.length) {
              useSha = false;
            } else {
              const target2 = result3.targets[0];
              result3 = await target.chooseToUse({
                prompt: `你可以对${get.translation(target2)}使用一张杀，否则本阶段你对${get.translation(player)}使用牌时，须交给其两张牌`,
                filterCard(card, player2, event2) {
                  if (get.name(card) !== "sha") {
                    return false;
                  }
                  return lib.filter.filterCard(card, player2, event2);
                },
                filterTarget(card, player2, target3) {
                  if (target3 !== _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
                    return false;
                  }
                  return lib.filter.targetEnabled(card, player2, target3);
                },
                complexTarget: true
              }).set("targetRequired", true).set("complexSelect", true).set("sourcex", target2).set("addCount", false).forResult();
              if (!result3?.bool) {
                useSha = false;
              }
            }
          } else {
            useSha = false;
          }
          if (!useSha) {
            player.addTempSkill("yaohu_give", "phaseUseAfter");
            player.markAuto("yaohu_give", [target]);
          }
        }
      },
      give: {
        charlotte: true,
        onremove: true,
        audio: "yinlang",
        trigger: { target: "useCardToPlayer" },
        filter(event, player) {
          return player.getStorage("yaohu_give").includes(event.player) && get.is.damageCard(event.card);
        },
        forced: true,
        logTarget: "player",
        async content(event, trigger, player) {
          const target = event.targets[0];
          const result2 = target.countCards("he") < 2 ? { bool: false } : await target.chooseToGive({
            prompt: `交给${get.translation(player)}两张牌，或点击“取消”取消其为${get.translation(trigger.card)}的目标`,
            selectCard: 2,
            position: "he",
            target: player,
            ai(card) {
              const { player: player2, target: target2 } = get.event();
              const att = get.attitude(player2, target2);
              if (att > 0) {
                return 7 - get.value(card);
              }
              if (player2.countCards("he") <= 4) {
                return 0;
              }
              return 6 - get.value(card);
            }
          }).forResult();
          if (!result2?.bool) {
            trigger.targets.remove(player);
            trigger.getParent().triggeredTargets1.remove(player);
            trigger.untrigger();
          }
        },
        intro: { content: "本阶段$使用伤害牌指定你为目标时，除非交给你两张牌，否则取消之" },
        ai: {
          effect: {
            target(card, player, target) {
              if (target.getStorage("yaohu_give").includes(player) && player.countCards("he") < 3 && get.tag(card, "damage")) {
                return "zerotarget";
              }
            }
          }
        }
      }
    }
  },
  rehuaibi: {
    audio: "huaibi",
    zhuSkill: true,
    mod: {
      maxHandcard(player, num) {
        if (player.storage.yaohu && player.hasZhuSkill("rehuaibi")) {
          return num + game.countPlayer((current) => current.group === player.storage.yaohu);
        }
      }
    },
    ai: { combo: "yaohu" }
  },
  //宗预
  zhibian: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => current !== player && player.canCompare(current));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt("zhibian"),
        prompt2: "与一名其他角色进行拼点",
        filterTarget(card, player2, target) {
          return target !== player2 && player2.canCompare(target);
        },
        ai(target) {
          const { player: player2, goon } = get.event();
          if (!goon) {
            return false;
          }
          const att = get.attitude(player2, target);
          if (att < 0 && target.hasCards("e", (card) => player2.canEquip(card) && get.effect(player2, card, target, player2) > 0)) {
            return -att / Math.sqrt(target.countCards("h"));
          }
          if (!player2.isDamaged()) {
            return false;
          }
          if (att <= 0) {
            return (1 - att) / Math.sqrt(target.countCards("h"));
          }
          return Math.sqrt(2 / att * Math.sqrt(target.countCards("h")));
        }
      }).set(
        "goon",
        player.hasCard((card) => card.number >= 14 - player.hp && get.value(card) <= 5)
      ).forResult();
    },
    logTarget: "targets",
    async content(event, trigger, player) {
      const target = event.targets[0];
      const result2 = await player.chooseToCompare(target).forResult();
      if (!result2?.bool) {
        await player.loseHp();
        return;
      }
      const list = [];
      const list2 = [`将${get.translation(target)}装备区/判定区中的一张牌移动到你的区域内`, "回复1点体力", "背水！跳过摸牌阶段，并依次执行上述所有选项"];
      if (target.hasCard((card) => player.canEquip(card), "e") || target.hasCard((card) => player.canAddJudge(card), "j")) {
        list.push("选项一");
      }
      if (player.isDamaged()) {
        list.push("选项二");
      }
      if (list.includes("选项一")) {
        list.push("背水！");
      }
      list.push("cancel2");
      const resultx = !player.isDamaged() ? 0 : player.hp <= 2 || target.hasCards("e", (card) => player.canEquip(card) && get.value(card, target) >= 4 + player.getDamagedHp()) ? 1 : 0;
      const result22 = await player.chooseControl({
        controls: list,
        choiceList: list2,
        ai() {
          return get.event().resultx;
        }
      }).set("resultx", resultx).forResult();
      if (result22.control === "cancel2") {
        return;
      }
      const control = result22.control;
      if (control === "选项一" || control === "背水！") {
        const result3 = await player.choosePlayerCard({
          target,
          position: "ej",
          forced: true,
          ai(button) {
            return get.buttonValue(button);
          }
        }).forResult();
        if (result3.bool) {
          const card = result3.cards[0];
          target.$give(card, player, false);
          await game.delayx();
          if (get.position(card) === "e") {
            await player.equip(card);
          } else {
            await player.addJudge(card);
          }
        }
      }
      if (control === "选项二" || control === "背水！") {
        await player.recover();
      }
      if (control === "背水！") {
        player.skip("phaseDraw");
      }
    }
  },
  yuyan: {
    audio: 2,
    trigger: { target: "useCardToTarget" },
    forced: true,
    logTarget: "player",
    filter(event, player) {
      return event.card.name === "sha" && event.card.isCard && typeof get.number(event.card) === "number" && player.hp < event.player.hp;
    },
    async content(event, trigger, player) {
      const num = get.number(trigger.card);
      let result2 = { bool: false };
      if (typeof num === "number" && num < 13 && trigger.player.hasCards("he", (card) => {
        if (_status.connectMode && get.position(card) === "h") {
          return true;
        }
        const numx = get.number(card);
        return typeof numx === "number" && numx > num;
      })) {
        result2 = await trigger.player.chooseCard({
          prompt: `交给${get.translation(player)}一张点数大于${get.cnNumber(num)}的牌，或令${get.translation(trigger.card)}对其无效`,
          filterCard(card) {
            const { number } = get.event();
            const numx = get.number(card);
            return typeof numx === "number" && numx > number;
          },
          position: "he",
          ai(card) {
            if (["shan", "tao", "jiu"].includes(card.name)) {
              return 0;
            }
            return 6 - get.value(card);
          }
        }).set("number", num).forResult();
      }
      if (result2.bool && result2.cards?.length) {
        await trigger.player.give(result2.cards, player);
        return;
      }
      trigger.targets.remove(player);
      trigger.getParent()?.triggeredTargets2.remove(player);
      trigger.untrigger();
    },
    ai: {
      effect: {
        target(card, player, target, current) {
          if (card.name === "sha" && player.hp > target.hp && get.attitude(player, target) < 0) {
            const num = get.number(card);
            if (typeof num !== "number") {
              return false;
            }
            const bs = player.getCards("h", (cardx) => get.number(cardx) > num && !["", "", ""].includes(cardx.name));
            if (bs.length < 2) {
              return 0;
            }
            if (player.hasSkill("jiu") || player.hasSkill("tianxianjiu")) {
              return;
            }
            if (bs.length <= 2) {
              for (const cardx of bs) {
                if (get.value(cardx) < 6) {
                  return [1, 0, 1, -0.5];
                }
              }
              return 0;
            }
            return [1, 0, 1, -0.5];
          }
        }
      }
    }
  },
  //袁涣
  qingjue: {
    audio: 2,
    trigger: { global: "useCardToPlayer" },
    logTarget: "player",
    round: 1,
    filter(event, player) {
      return event.player !== player && event.target !== player && event.player !== event.target && event.player.hp > event.target.hp && event.targets.length === 1 && event.player.hasCards("h") && !event.target.isDying() && !event.player.hasSkillTag("noCompareTarget") && !player.hasSkillTag("noCompareSource");
    },
    check(event, player) {
      const target = event.target;
      const source = event.player;
      const eff1 = get.effect(target, event.card, source, player);
      if (eff1 >= 0) {
        return false;
      }
      const eff2 = get.effect(player, event.card, source, player);
      if (eff2 >= 0) {
        return true;
      }
      if (eff2 > eff1 / 3) {
        return player.hasCard((card) => card.number >= 9 && get.value(card) <= 5 || get.value(card) <= 3);
      }
      if (eff2 > eff1 / 2) {
        return player.hasCard((card) => card.number > 10 && get.value(card) <= 5);
      }
      return player.hasCard((card) => card.number > 11 && get.value(card) <= 5);
    },
    async content(event, trigger, player) {
      await player.draw();
      if (!player.canCompare(trigger.player)) {
        return;
      }
      const result2 = await player.chooseToCompare(trigger.player).forResult();
      trigger.targets.remove(trigger.target);
      trigger.getParent()?.triggeredTargets1.remove(trigger.target);
      trigger.untrigger();
      if (!result2.bool) {
        trigger.targets.push(player);
      }
    }
  },
  fengjie: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      return game.hasPlayer((current) => current !== player);
    },
    async content(event, trigger, player) {
      const result2 = await player.chooseTarget({
        prompt: "请选择【奉节】的目标",
        prompt2: "选择一名其他角色并获得如下效果直到你下回合开始：一名角色的结束阶段开始时，你将手牌摸至（至多摸至四张）或弃置至与其体力值相等。",
        filterTarget: lib.filter.notMe,
        forced: true,
        ai(target2) {
          return (target2.hp - player.countCards("h")) / get.threaten(target2);
        }
      }).forResult();
      if (!result2.bool || !result2.targets?.length) {
        return;
      }
      const target = result2.targets[0];
      player.line(target, "green");
      game.log(player, "选择了", target);
      player.storage.fengjie2 = target;
      player.addTempSkill("fengjie2", { player: "phaseBegin" });
      await game.delayx();
    }
  },
  fengjie2: {
    audio: "fengjie",
    trigger: { global: "phaseJieshuBegin" },
    forced: true,
    charlotte: true,
    onremove: true,
    sourceSkill: "fengjie",
    filter(event, player) {
      if (!player.storage.fengjie2 || !player.storage.fengjie2.isIn()) {
        return false;
      }
      const num1 = player.countCards("h");
      const num2 = player.storage.fengjie2.hp;
      return num1 !== num2;
    },
    logTarget(event, player) {
      return player?.storage.fengjie2;
    },
    async content(event, trigger, player) {
      const num1 = player.countCards("h");
      const num2 = player.storage.fengjie2.hp;
      if (num1 > num2) {
        await player.chooseToDiscard({
          selectCard: num1 - num2,
          position: "h",
          forced: true,
          allowChooseAll: true
        });
        return;
      }
      await player.drawTo(Math.min(4, num2));
    }
  },
  //陈武董袭
  spyilie: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    async cost(event, trigger, player) {
      const result2 = await player.chooseControl({
        controls: ["选项一", "选项二", "背水！", "cancel2"],
        choiceList: ["本阶段内使用【杀】的次数上限+1", "本回合内使用【杀】被【闪】抵消时摸一张牌", "背水！失去1点体力并依次执行上述所有选项"],
        ai() {
          if (player.countCards("hs", (card) => get.name(card) === "sha" && player.hasValueTarget(card)) > player.getCardUsable({ name: "sha" })) {
            return 0;
          }
          return 1;
        }
      }).forResult();
      event.result = {
        bool: result2.control !== "cancel2",
        cost_data: {
          index: result2.index,
          control: result2.control
        }
      };
    },
    async content(event, trigger, player) {
      const { index, control } = event.cost_data;
      game.log(player, "选择了", "#g【毅烈】", "的", `#y${control}`);
      if (index % 2 === 0) {
        player.addTempSkill("spyilie_add", "phaseUseEnd");
      }
      if (index > 0) {
        player.addTempSkill("spyilie_miss");
      }
      if (index === 2) {
        await player.loseHp();
      }
    },
    subSkill: {
      add: {
        charlotte: true,
        mod: {
          cardUsable(card, player, num) {
            if (card.name === "sha") {
              return num + 1;
            }
          }
        }
      },
      miss: {
        charlotte: true,
        audio: "spyilie",
        trigger: { player: "shaMiss" },
        forced: true,
        async content(event, trigger, player) {
          await player.draw();
        }
      }
    }
  },
  spfenming: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter: (event, player) => game.hasPlayer((current) => lib.skill.spfenming.filterTarget(null, player, current)),
    filterTarget(card, player, target) {
      if (target.hp > player.hp) {
        return false;
      }
      return !target.isLinked() || target.hasCard((card2) => lib.filter.canBeGained(card2, player, target), target === player ? "e" : "he");
    },
    async content(event, trigger, player) {
      const target = event.target;
      if (!target.isLinked()) {
        await target.link();
        return;
      }
      await player.gainPlayerCard(target, target === player ? "e" : "he", true);
    },
    ai: {
      order: 10,
      result: {
        player: 1,
        target(player, target) {
          if (!target.isLinked()) {
            return get.sgnAttitude(player, target) * get.effect(target, { name: "tiesuo" }, player, player);
          }
          return get.sgnAttitude(player, target) * get.effect(target, { name: "shunshou_copy2" }, player, player);
        }
      }
    }
  },
  //周处
  rechuhai: {
    audio: "chuhai",
    dutySkill: true,
    locked: false,
    group: ["rechuhai_add", "rechuhai_achieve", "rechuhai_fail", "rechuhai_chuhai"],
    derivation: "zhangming",
    subSkill: {
      chuhai: {
        audio: "chuhai1.mp3",
        inherit: "chuhai",
        prompt: "与一名其他角色进行拼点"
      },
      add: {
        trigger: { player: "compare" },
        forced: true,
        popup: false,
        filter(event, player) {
          return event.getParent().name === "rechuhai_chuhai" && event.num1 < 13 && player.countCards("e") < 4;
        },
        async content(event, trigger, player) {
          const num = 4 - player.countCards("e");
          game.log(player, "的拼点牌点数+", num);
          trigger.num1 = Math.min(13, trigger.num1 + num);
        }
      },
      achieve: {
        audio: "chuhai2.mp3",
        trigger: { player: "equipAfter" },
        forced: true,
        skillAnimation: true,
        animationColor: "wood",
        filter(event, player) {
          return player.countCards("e") > 2;
        },
        async content(event, trigger, player) {
          player.awakenSkill("rechuhai");
          game.log(player, "成功完成使命");
          if (player.isDamaged()) {
            await player.recover(player.maxHp - player.hp);
          }
          player.changeSkills(["zhangming"], ["xianghai"]);
        }
      },
      fail: {
        audio: "chuhai3.mp3",
        trigger: { player: "chooseToCompareAfter" },
        forced: true,
        filter(event, player) {
          return event.getParent().name === "rechuhai_chuhai" && event.num1 < 7 && !event.result.bool;
        },
        async content(event, trigger, player) {
          player.awakenSkill("rechuhai");
          game.log(player, "使命失败");
        }
      }
    }
  },
  zhangming: {
    audio: 2,
    trigger: { player: "useCard" },
    forced: true,
    filter(event, player) {
      return get.suit(event.card) === "club";
    },
    async content(event, trigger, player) {
      trigger.directHit.addArray(game.filterPlayer());
    },
    group: "zhangming_damage",
    subSkill: {
      damage: {
        audio: "zhangming",
        trigger: { source: "damageEnd" },
        forced: true,
        usable: 1,
        filter(event, player) {
          return player !== event.player;
        },
        logTarget: "player",
        async content(event, trigger, player) {
          let list = [];
          let cards2 = [];
          let target = trigger.player;
          let hs = target.getCards("h");
          let card;
          if (hs.length > 0) {
            card = hs.randomGet();
            list.push(get.type2(card, target));
            player.showCards(card, `${get.translation(player)}对${get.translation(target)}发动了【彰名】`);
          }
          target.discard(card);
          for (const pileCard of ui.cardPile.childNodes) {
            let type = get.type2(pileCard, false);
            if (!list.includes(type)) {
              list.push(type);
              cards2.push(pileCard);
            }
          }
          player.gain(cards2, "gain2").gaintag.add("zhangming");
          player.addTempSkill("zhangming_keep");
        }
      },
      keep: {
        charlotte: true,
        onremove(player) {
          player.removeGaintag("zhangming");
        },
        mod: {
          ignoredHandcard(card, player) {
            if (card.hasGaintag("zhangming")) {
              return true;
            }
          },
          cardDiscardable(card, player, name) {
            if (name === "phaseDiscard" && card.hasGaintag("zhangming")) {
              return false;
            }
          }
        }
      }
    }
  },
  xianghai: {
    audio: 2,
    global: "xianghai_g",
    mod: {
      cardname(card) {
        if (get.type(card, null, false) === "equip") {
          return "jiu";
        }
      }
    },
    ai: {
      threaten: 2
    }
  },
  xianghai_g: {
    mod: {
      maxHandcard(player, num) {
        return num - game.countPlayer((current) => current !== player && current.hasSkill("xianghai"));
      }
    }
  },
  chuhai: {
    audio: 3,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((target) => player.canCompare(target, true));
    },
    filterTarget(card, player, target) {
      return player.canCompare(target, true);
    },
    async content(event, trigger, player) {
      const { target } = event;
      await player.draw();
      if (!player.canCompare(target)) {
        return;
      }
      const result2 = await player.chooseToCompare(target).forResult();
      if (result2.bool) {
        player.storage.chuhai2 = target;
        player.addTempSkill("chuhai2", "phaseUseEnd");
        if (target.hasCards("h")) {
          player.viewHandcards(target);
          const types = [];
          const cards2 = [];
          const hs = target.getCards("h");
          for (const i of hs) {
            types.add(get.type2(i, target));
          }
          for (const i of types) {
            const card = get.cardPile((card2) => get.type2(card2, false) === i);
            if (card) {
              cards2.push(card);
            }
          }
          if (cards2.length) {
            await player.gain({
              cards: cards2,
              animate: "gain2",
              log: true
            });
          }
        }
      }
    },
    ai: {
      order: 9,
      result: {
        target(player, target) {
          if (player.hasCards("hs", (card) => get.tag(card, "damage") > 0 && player.canUse(card, target, null, true) && get.effect(target, card, player, player) > 0 && player.hasValueTarget(card, null, true))) {
            return -3;
          }
          return -1;
        }
      }
    }
  },
  chuhai2: {
    trigger: { source: "damageSource" },
    forced: true,
    charlotte: true,
    onremove: true,
    sourceSkill: "chuhai",
    filter(event, player) {
      if (event.player !== player.storage.chuhai2) {
        return false;
      }
      for (const i of [1, 2, 3, 4, 5]) {
        if (player.hasEmptySlot(i)) {
          return true;
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      for (const i of [1, 2, 3, 4, 5, 6]) {
        if (player.hasEmptySlot(i)) {
          const sub = `equip${i}`;
          const card = get.cardPile((card2) => get.subtype(card2, false) === sub && !get.cardtag(card2, "gifts") && player.canEquip(card2));
          if (card) {
            player.$gain2(card);
            await game.delayx();
            await player.equip(card);
            break;
          }
        }
      }
    }
  },
  //文鸯
  dbquedi: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    usable(skill, player) {
      return 1 + player.countMark("dbchoujue_add");
    },
    filter(event, player) {
      const { card, targets, target } = event;
      return ["sha", "juedou"].includes(card.name) && targets.length === 1 && (target.countGainableCards(player, "h") > 0 || player.hasCard((card2) => _status.connectMode || get.type(card2, null, player) === "basic" && lib.filter.cardDiscardable(card2, player, "dbquedi"), "h"));
    },
    async cost(event, trigger, player) {
      const { target } = trigger;
      const list = [];
      if (target.countGainableCards(player, "h") > 0) {
        list.push("选项一");
      }
      if (player.hasCard((card) => get.type(card, null, player) === "basic" && lib.filter.cardDiscardable(card, player, "dbquedi"), "h")) {
        list.push("选项二");
      }
      list.push("背水！");
      list.push("cancel2");
      const result2 = await player.chooseControl(list).set("choiceList", [`获得${get.translation(target)}的一张手牌`, `弃置一张基本牌并令${get.translation(trigger.card)}伤害+1`, "背水！减1点体力上限并执行所有选项"]).set("prompt", get.prompt(event.skill, target)).set("ai", () => {
        const evt = _status.event.getTrigger();
        const player2 = evt.player;
        const target2 = evt.target;
        const card = evt.card;
        if (get.attitude(player2, target2) > 0) {
          return "cancel2";
        }
        const bool1 = target2.countGainableCards(player2, "h") > 0;
        const bool2 = player2.hasCard((cardx) => get.type(cardx, null, player2) === "basic" && lib.filter.cardDiscardable(cardx, player2, "dbquedi") && get.value(card, player2) < 5, "h") && !target2.hasSkillTag("filterDamage", null, {
          player: player2,
          card
        });
        if (bool1 && bool2 && player2.isDamaged() && player2.maxHp > 1) {
          return "背水！";
        }
        if (bool1) {
          return "选项一";
        }
        if (bool2) {
          return "选项二";
        }
        return "cancel2";
      }).forResult();
      if (typeof result2?.control == "string" && result2.control != "cancel2") {
        event.result = {
          bool: true,
          cost_data: result2.control
        };
      }
    },
    logTarget: "target",
    async content(event, trigger, player) {
      const { cost_data: control } = event;
      const { target } = trigger;
      if (["选项一", "背水！"].includes(control) && target.countGainableCards(player, "h") > 0) {
        await player.gainPlayerCard(target, true, "h");
      }
      if (["选项二", "背水！"].includes(control) && player.hasCard((card) => get.type(card, null, player) === "basic" && lib.filter.cardDiscardable(card, player, "dbquedi"), "h")) {
        const { bool } = await player.chooseToDiscard("h", "弃置一张基本牌", { type: "basic" }).forResult();
        if (bool) {
          trigger.getParent().baseDamage++;
        }
      }
      if (control === "背水！") {
        await player.loseMaxHp();
      }
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (tag !== "directHit_ai" || !arg || !arg.card || !arg.target || arg.card.name !== "sha" && arg.card.name !== "juedou") {
          return false;
        }
        if (player.storage.counttrigger?.dbquedi > 0) {
          return false;
        }
        if (arg.target.countCards("h") === 1 && (arg.card.name !== "sha" || !arg.target.hasSkillTag("freeShan", false, {
          player,
          card: arg.card,
          type: "use"
        }) || player.hasSkillTag("unequip", false, {
          name: arg.card ? arg.card.name : null,
          target: arg.target,
          card: arg.card
        }) || player.hasSkillTag("unequip_ai", false, {
          name: arg.card ? arg.card.name : null,
          target: arg.target,
          card: arg.card
        }))) {
          return true;
        }
        return false;
      }
    }
  },
  dbzhuifeng: {
    audio: 2,
    groupSkill: "wei",
    enable: "chooseToUse",
    usable: 2,
    viewAsFilter(player) {
      return player.group === "wei" && player.hp > 0;
    },
    viewAs: { name: "juedou", isCard: true },
    filterCard: () => false,
    selectCard: -1,
    log: false,
    async precontent(event, trigger, player) {
      player.logSkill("dbzhuifeng");
      const loseHpEvent = player.loseHp();
      event.forceDie = true;
      await loseHpEvent;
      if (player.isDead()) {
        const result2 = player.useResult(event.result, event.getParent());
        if (result2 != null) {
          result2.forceDie = true;
        }
      }
    },
    ai: {
      order() {
        return get.order({ name: "juedou" }) - 0.5;
      }
    },
    group: "dbzhuifeng_self",
    subSkill: {
      self: {
        audio: "dbzhuifeng",
        trigger: { player: "damageBegin2" },
        forced: true,
        filter(event, player) {
          const evt = event.getParent();
          return evt?.skill === "dbzhuifeng" && evt.player === player;
        },
        async content(event, trigger, player) {
          trigger.cancel();
          player.tempBanSkill("dbzhuifeng", { player: "phaseUseEnd" });
        }
      }
    }
  },
  dbchongjian: {
    audio: 2,
    groupSkill: "wu",
    hiddenCard(player, name) {
      if (player.group === "wu" && (name === "sha" || name === "jiu") && player.hasCard((card) => get.type(card) === "equip", "hes")) {
        return true;
      }
      return false;
    },
    enable: "chooseToUse",
    filter(event, player) {
      return player.group === "wu" && player.hasCard((card) => get.type(card) === "equip", "hes") && (event.filterCard({ name: "sha" }, player, event) || event.filterCard({ name: "jiu" }, player, event));
    },
    locked: false,
    mod: {
      targetInRange(card) {
        if (card?.storage?.dbchongjian) {
          return true;
        }
      }
    },
    chooseButton: {
      dialog() {
        let list = [];
        list.push(["基本", "", "sha"]);
        for (const i of lib.inpile_nature) {
          list.push(["基本", "", "sha", i]);
        }
        list.push(["基本", "", "jiu"]);
        return ui.create.dialog("冲坚", [list, "vcard"]);
      },
      filter(button, player) {
        let evt = _status.event.getParent();
        return evt.filterCard({ name: button.link[2], nature: button.link[3], isCard: true }, player, evt);
      },
      check(button) {
        if (_status.event.getParent().type !== "phase") {
          return 1;
        }
        let player = _status.event.player;
        if (button.link[2] === "jiu" && (player.hasCard((card) => get.name(card) === "sha", "hs") || player.countCards("hes", (card) => {
          if (get.type(card) !== "equip") {
            return false;
          }
          if (get.position(card) === "e") {
            if (player.hasSkillTag("noe")) {
              return 10 - get.value(card) > 0;
            }
            let sub = get.subtype(card);
            if (player.hasCard((card2) => get.subtype(card2) === sub && player.canUse(card2, player) && get.effect(player, card2, player, player) > 0, "hs")) {
              return 10 - get.value(card) > 0;
            }
          }
          return 5 - get.value(card) > 0;
        }) > 1)) {
          return player.getUseValue({ name: "jiu" }) * 4;
        }
        return player.getUseValue({ name: button.link[2], nature: button.link[3] }, false);
      },
      backup(links, player) {
        return {
          audio: "dbchongjian",
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            storage: { dbchongjian: true }
          },
          filterCard: { type: "equip" },
          position: "hes",
          popname: true,
          async precontent(event, trigger, player2) {
            player2.addTempSkill("dbchongjian_effect");
          },
          check(card) {
            let player2 = _status.event.player;
            if (get.position(card) === "e") {
              if (player2.hasSkillTag("noe")) {
                return 10 - get.value(card);
              }
              let sub = get.subtype(card);
              if (player2.hasCard((card2) => get.subtype(card2) === sub && player2.canUse(card2, player2) && get.effect(player2, card2, player2, player2) > 0, "hs")) {
                return 10 - get.value(card);
              }
            }
            return 5 - get.value(card);
          }
        };
      },
      prompt(links) {
        return `将一张装备牌当做${links[0][3] ? get.translation(links[0][3]) : ""}【${get.translation(links[0][2])}】使用`;
      }
    },
    ai: {
      respondSha: true,
      unequip_ai: true,
      skillTagFilter(player, tag, arg) {
        if (arg === "respond" || player.group !== "wu") {
          return false;
        }
        if (tag == "unequip_ai") {
          return arg?.card?.storage?.dbchongjian;
        }
        return player.hasCard({ type: "equip" }, "hes");
      },
      order(item, player) {
        if (_status.event.type !== "phase") {
          return 1;
        }
        player = _status.event.player;
        if (player.hasCard((card) => {
          if (get.value(card, player) < 0) {
            return true;
          }
          let sub = get.subtype(card);
          return player.hasCard((card2) => get.subtype(card2) === sub && player.canUse(card2, player) && get.effect(player, card2, player, player) > 0, "hs") > 0;
        }, "e")) {
          return 10;
        }
        if (player.countCards("hs", "sha") || player.countCards("he", (card) => get.type(card) === "equip" && get.value(card, player) < 5) > 1) {
          return get.order({ name: "jiu" }) - 0.1;
        }
        return get.order({ name: "sha" }) - 0.1;
      },
      result: { player: 1 }
    },
    subSkill: {
      effect: {
        audio: "dbchongjian",
        charlotte: true,
        mod: {
          targetInRange(card) {
            if (card?.storage?.dbchongjian) {
              return true;
            }
          }
        },
        trigger: {
          source: "damageSource",
          player: "useCardToPlayer"
        },
        forced: true,
        logTarget(event, player) {
          return event.name == "damage" ? event.player : event.target;
        },
        filter(event, player, name) {
          if (!event.card?.name === "sha" || !event.card.storage?.dbchongjian) {
            return false;
          }
          return event.player.hasGainableCards(player, "e") || name == "useCardToPlayer";
        },
        async content(event, trigger, player) {
          const target = event.targets[0];
          if (trigger.name == "damage") {
            await player.gainPlayerCard({ target, position: "e", forced: true, selectButton: trigger.num });
          } else {
            target.addTempSkill("qinggang2");
            target.storage.qinggang2.add(trigger.card);
            target.markSkill("qinggang2");
          }
        }
      }
    }
  },
  dbchoujue: {
    audio: 2,
    trigger: { source: "dieAfter" },
    forced: true,
    async content(event, trigger, player) {
      await player.gainMaxHp();
      await player.draw(2);
      player.addTempSkill(`${event.name}_add`);
      player.addMark(`${event.name}_add`, 1, false);
    },
    subSkill: {
      add: {
        charlotte: true,
        onremove: true,
        mark: true,
        intro: {
          markcount: (storage, player) => storage || 0,
          content: (storage, player) => `本回合〖却敌〗可发动次数+${storage || 0}`
        }
      }
    }
  },
  //王凌
  xingqi: {
    audio: 2,
    trigger: { player: "useCard" },
    forced: true,
    locked: false,
    filter(event, player) {
      return get.type(event.card, null, false) !== "delay" && !player.getStorage("xingqi").includes(event.card.name);
    },
    async content(event, trigger, player) {
      player.markAuto("xingqi", [trigger.card.name]);
      game.log(player, "获得了一个", `#g【备(${get.translation(trigger.card.name)})】`);
    },
    marktext: "备",
    intro: {
      content: "$",
      onunmark(storage, player) {
        delete player.storage.xingqi;
      }
    },
    group: "xingqi_gain",
    subSkill: {
      gain: {
        trigger: { player: "phaseJieshuBegin" },
        direct: true,
        filter(event, player) {
          return player.getStorage("xingqi").length > 0;
        },
        async content(event, trigger, player) {
          player.removeSkill("mibei_mark");
          const result2 = await player.chooseButton({
            createDialog: ["星启：是否获得一张牌？", [player.getStorage("xingqi"), "vcard"]],
            ai(button) {
              const card2 = { name: button.link[2] };
              const player2 = get.player();
              if (!get.cardPile2((cardx) => cardx.name === card2.name)) {
                return 0;
              }
              return get.value(card2, player2) * player2.getUseValue(card2);
            }
          }).forResult();
          if (!result2.bool || !result2.links?.length) {
            return;
          }
          player.logSkill("xingqi");
          const name = result2.links[0][2];
          game.log(player, "移去了一个", `#g【备(${get.translation(name)})】`);
          player.unmarkAuto("xingqi", [name]);
          const card = get.cardPile2((cardx) => cardx.name === name);
          if (card) {
            await player.gain({
              cards: [card],
              animate: "gain2"
            });
          }
        }
      }
    }
  },
  xinzifu: {
    audio: "zifu",
    trigger: { player: "phaseUseEnd" },
    forced: true,
    filter(event, player) {
      return player.getStorage("xingqi").length > 0 && !player.hasHistory("useCard", (evt) => evt.getParent("phaseUse") === event);
    },
    async content(event, trigger, player) {
      game.log(player, "移去了所有", "#g【备】");
      player.unmarkSkill("xingqi");
      player.addTempSkill("xinzifu_limit");
      player.addMark("xinzifu_limit", 1, false);
    },
    ai: {
      neg: true,
      combo: "xingqi"
    },
    subSkill: {
      limit: {
        charlotte: true,
        onremove: true,
        markimage: "image/card/handcard.png",
        intro: {
          content(storage, player) {
            let num = -player.countMark("xinzifu_limit");
            return `手牌上限${num}`;
          }
        },
        mod: {
          maxHandcard(player, num) {
            return num - player.countMark("xinzifu_limit");
          }
        }
      }
    }
  },
  mibei: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    dutySkill: true,
    forced: true,
    locked: false,
    filter(event, player) {
      if (!player.storage.xingqi || !player.storage.xingqi.length) {
        return false;
      }
      const map = { basic: 0, trick: 0, equip: 0 };
      for (const name of player.storage.xingqi) {
        const type = get.type(name);
        if (typeof map[type] === "number") {
          map[type]++;
        }
      }
      return Object.values(map).every((num) => num >= 2);
    },
    logAudio: () => 1,
    skillAnimation: true,
    animationColor: "water",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      game.log(player, "成功完成使命");
      const types = ["basic", "equip", "trick"];
      const cards2 = [];
      for (const type of types) {
        const card = get.cardPile2((card2) => get.type(card2) === type);
        if (card) {
          cards2.push(card);
        }
      }
      if (cards2.length) {
        await player.gain({
          cards: cards2,
          animate: "gain2"
        });
      }
      player.addSkills("xinmouli");
    },
    ai: {
      combo: "xingqi"
    },
    group: ["mibei_fail", "mibei_silent"],
    derivation: "xinmouli",
    subSkill: {
      silent: {
        charlotte: true,
        trigger: { player: "phaseZhunbeiBegin" },
        silent: true,
        lastDo: true,
        filter(event, player) {
          return !player.getStorage("xingqi").length;
        },
        async content(event, trigger, player) {
          player.addTempSkill("mibei_mark");
        }
      },
      mark: { charlotte: true },
      fail: {
        audio: "mibei2.mp3",
        trigger: { player: "phaseJieshuBegin" },
        filter(event, player) {
          return !player.getStorage("xingqi").length && player.hasSkill("mibei_mark");
        },
        forced: true,
        async content(event, trigger, player) {
          game.log(player, "使命失败");
          player.awakenSkill("mibei");
          await player.loseMaxHp();
        }
      }
    }
  },
  xinmouli: {
    audio: "mouli",
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.getStorage("xingqi").length > 0;
    },
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const { target } = event;
      const result2 = await target.chooseButton({
        createDialog: ["谋立：是否获得一张牌？", [player.getStorage("xingqi"), "vcard"]],
        forced: true,
        ai(button) {
          const card2 = { name: button.link[2] };
          const currentPlayer = _status.event.player;
          return get.value(card2, currentPlayer);
        }
      }).forResult();
      if (!result2.bool || !result2.links?.length) {
        return;
      }
      const name = result2.links[0][2];
      game.log(player, "移去了一个", `#g【备(${get.translation(name)})】`);
      player.unmarkAuto("xingqi", [name]);
      const card = get.cardPile2((cardx) => cardx.name === name);
      if (card) {
        await target.gain({
          cards: [card],
          animate: "gain2"
        });
      }
    },
    ai: {
      combo: "xingqi",
      order: 1,
      result: {
        target(player, target) {
          if (target.hasSkillTag("nogain")) {
            return 0;
          }
          return 1;
        }
      }
    }
  },
  mouli: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    filterCard: true,
    position: "h",
    filterTarget: lib.filter.notMe,
    discard: false,
    lose: false,
    delay: false,
    check(card) {
      return 8 - get.value(card);
    },
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      player.give(cards2, target);
      if (!target.storage.mouli2) {
        target.storage.mouli2 = [];
      }
      if (!target.storage.mouli3) {
        target.storage.mouli3 = [];
      }
      target.storage.mouli2.add(player);
      target.storage.mouli3.push(player);
      target.addSkill("mouli_effect");
    },
    ai: {
      threaten: 1.2,
      order: 4,
      result: {
        target: 1
      }
    },
    subSkill: {
      effect: {
        trigger: { player: "useCard" },
        forced: true,
        charlotte: true,
        filter(event, player) {
          if (event.card.name !== "sha" && event.card.name !== "shan") {
            return false;
          }
          for (const target of player.storage.mouli3) {
            if (target.isIn()) {
              return true;
            }
          }
          return false;
        },
        logTarget(event, player) {
          return player?.storage.mouli3;
        },
        async content(event, trigger, player) {
          const delay = game.delayx();
          const targets = player.storage.mouli3;
          targets.sortBySeat();
          if (targets.length === 1) {
            const target = targets[0];
            const draw2 = target.draw(3);
            targets.length = 0;
            await delay;
            await draw2;
            return;
          }
          const draw = game.asyncDraw(targets, 3);
          await delay;
          await draw;
          targets.length = 0;
          await game.delayx();
        },
        group: ["mouli_sha", "mouli_shan", "mouli_clear"],
        mark: true,
        intro: {
          content: "已因$获得“谋立”效果"
        }
      },
      sha: {
        enable: "chooseToUse",
        viewAs: { name: "sha" },
        filterCard: { color: "black" },
        position: "he",
        prompt: "将一张黑色牌当做杀使用",
        check(card) {
          return 6 - get.value(card);
        },
        viewAsFilter(player) {
          return player.countCards("he", { color: "black" }) > 0;
        },
        ai: {
          respondSha: true,
          skillTagFilter(player) {
            return player.countCards("he", { color: "black" }) > 0;
          }
        }
      },
      shan: {
        enable: "chooseToUse",
        viewAs: { name: "shan" },
        filterCard: { color: "red" },
        position: "he",
        prompt: "将一张红色牌当做闪使用",
        check(card) {
          return 7 - get.value(card);
        },
        viewAsFilter(player) {
          return player.countCards("he", { color: "red" }) > 0;
        },
        ai: {
          respondShan: true,
          skillTagFilter(player) {
            return player.countCards("he", { color: "red" }) > 0;
          }
        }
      },
      clear: {
        trigger: { global: ["phaseBegin", "dieAfter"] },
        forced: true,
        silent: true,
        popup: false,
        lastDo: true,
        forceDie: true,
        filter(event, player) {
          if (event.name === "die" && player === event.player) {
            return true;
          }
          return player.storage.mouli2.includes(event.player);
        },
        async content(event, trigger, player) {
          if (trigger.name === "die" && player === trigger.player) {
            player.removeSkill("mouli_effect");
            delete player.storage.mouli2;
            delete player.storage.mouli3;
            return;
          }
          player.storage.mouli2.remove(trigger.player);
          while (player.storage.mouli3.includes(trigger.player)) {
            player.storage.mouli3.remove(trigger.player);
          }
          if (!player.storage.mouli2.length) {
            player.removeSkill("mouli_effect");
          }
        }
      }
    }
  },
  zifu: {
    audio: 2,
    trigger: { global: "dieAfter" },
    forced: true,
    filter(event, player) {
      return event.player.storage.mouli2 && event.player.storage.mouli2.includes(player);
    },
    async content(event, trigger, player) {
      await player.loseMaxHp(2);
    },
    ai: {
      combo: "mouli",
      neg: true
    }
  },
  //孔融
  xinlirang: {
    audio: "splirang",
    trigger: { global: "phaseDrawBegin2" },
    logTarget: "player",
    filter(event, player) {
      return !event.numFixed && event.player !== player && !player.hasMark("xinlirang");
    },
    prompt2: "获得一枚“谦”并令其多摸两张牌",
    check(event, player) {
      return get.attitude(player, event.player) > 0;
    },
    async content(event, trigger, player) {
      trigger.num += 2;
      player.addMark("xinlirang", 1);
      player.addTempSkill("xinlirang_gain");
    },
    marktext: "谦",
    intro: {
      name: "谦",
      content: "mark"
    },
    group: "xinlirang_skip",
    subSkill: {
      gain: {
        audio: "splirang",
        trigger: { global: "phaseDiscardEnd" },
        filter(event, player) {
          return event.player.hasHistory("lose", (evt) => evt.type === "discard" && evt.cards2.filterInD("d").length > 0 && evt.getParent("phaseDiscard") === event);
        },
        async cost(event, trigger, player) {
          const cards2 = trigger.player.getHistory("lose", (evt) => evt.type === "discard" && evt.getParent("phaseDiscard") === trigger).flatMap((evt) => evt.cards2.filterInD("d")).toUniqued();
          const result2 = await player.chooseButton({
            createDialog: ["礼让：是否获得其中至多两张牌？", cards2],
            selectButton: [1, 2],
            ai(button) {
              return get.value(button.link);
            }
          }).forResult();
          if (result2?.bool && result2.links?.length) {
            event.result = {
              bool: result2.bool,
              cards: result2.links
            };
          }
        },
        logTarget: "player",
        async content(event, trigger, player) {
          await player.gain({ cards: event.cards, animate: "gain2" });
        }
      },
      skip: {
        audio: "splirang",
        trigger: { player: "phaseBegin" },
        forced: true,
        filter(event, player) {
          return player.hasMark("xinlirang");
        },
        async content(event, trigger, player) {
          player.skip("phaseDraw");
          player.clearMark("xinlirang");
        }
      }
    }
  },
  xinmingshi: {
    audio: "spmingshi",
    trigger: { player: "damageEnd" },
    forced: true,
    logTarget: "source",
    filter(event, player) {
      return event.source && event.source.isIn() && player.hasMark("xinlirang") && event.source.hasCards("hej");
    },
    async content(event, trigger, player) {
      const result2 = await trigger.source.discardPlayerCard({
        target: trigger.source,
        position: "hej",
        forced: true,
        ai(card2) {
          return (get.color(card2.link) === get.event().color ? 4 : 0) - get.value(card2.link);
        }
      }).set("color", get.attitude(trigger.source, player) > 0 ? "red" : "black").forResult();
      if (!result2.bool || !result2.cards?.length) {
        return;
      }
      const card = result2.cards[0];
      if (get.color(card, trigger.source) === "red") {
        await player.recover();
        return;
      }
      if (get.position(card, true) === "d") {
        await player.gain({
          cards: [card],
          animate: "gain2"
        });
      }
    },
    ai: {
      combo: "xinlirang",
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage") && target.hasMark("xinlirang")) {
            const cards2 = [card];
            if (card.cards && card.cards.length) {
              cards2.addArray(card.cards);
            }
            if (ui.selected.cards.length) {
              cards2.addArray(ui.selected.cards);
            }
            if (!player.countCards("he", (current) => !cards2.includes(current))) {
              return;
            }
            if (!player.countCards("h", (current) => !cards2.includes(current) && get.color(current) === "black" && get.value(current, player) < 6)) {
              return "zerotarget";
            }
            return 0.5;
          }
        }
      }
    }
  },
  spmingshi: {
    audio: 2,
    trigger: { player: "damageEnd" },
    forced: true,
    logTarget: "source",
    filter(event, player) {
      return event.source && player !== event.source && event.source.hasDiscardableCards(event.source, "he");
    },
    getIndex: (event) => event.num,
    async content(event, trigger, player) {
      const { source } = trigger;
      if (source.countDiscardableCards(source, "he")) {
        await source.chooseToDiscard("he", true);
      }
    },
    ai: {
      threaten: 0.8,
      maixie: true,
      maixie_defend: true
    }
  },
  splirang: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      const hs = player.getCards("h");
      if (!hs.length) {
        return false;
      }
      for (const card of hs) {
        if (!lib.filter.cardDiscardable(card, player, "splirang")) {
          return false;
        }
      }
      return true;
    },
    filterCard: true,
    selectCard: -1,
    async content(event, trigger, player) {
      const cards2 = event.cards.filterInD("d");
      if (cards2.length && player.hp > 0) {
        const result2 = await player.chooseButton({
          createDialog: ["将任意张牌交给一名其他角色", cards2],
          selectButton: [1, Math.min(cards2.length, player.hp)],
          ai(button) {
            return get.value(button.link);
          }
        }).forResult();
        if (result2.bool && result2.links?.length) {
          const cards22 = result2.links;
          const result22 = await player.chooseTarget({
            prompt: `令一名角色获得${get.translation(event.cards)}`,
            filterTarget: lib.filter.notMe,
            forced: true,
            ai(target) {
              const player2 = get.player();
              let att = get.attitude(player2, target);
              if (target.hasSkillTag("nogain")) {
                att /= 10;
              }
              if (target.hasJudge("lebu")) {
                att /= 5;
              }
              return att;
            }
          }).forResult();
          if (result22.targets?.length) {
            const target = result22.targets[0];
            player.line(target, "green");
            await target.gain({
              cards2: cards22,
              animate: "gain2"
            });
          }
        }
      }
      await player.draw();
    },
    ai: {
      order: 0.1,
      result: {
        player(player) {
          const hs = player.getCards("h");
          if (hs.length <= player.hp && game.hasPlayer((current) => current !== player && get.attitude(player, current) > 0 && !current.hasJudge("lebu") && !current.hasSkillTag("nogain"))) {
            return 1;
          }
          if (get.value(hs, player) < 6) {
            return 1;
          }
          return 0;
        }
      }
    }
  },
  //糜夫人
  xinguixiu: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    filter(event, player) {
      return player.hp % 2 === 1 || player.isDamaged();
    },
    async content(event, trigger, player) {
      if (player.hp % 2 === 1) {
        await player.draw();
        return;
      }
      await player.recover();
    }
  },
  qingyu: {
    audio: 3,
    dutySkill: true,
    locked: true,
    group: ["qingyu_achieve", "qingyu_fail", "qingyu_defend"],
    subSkill: {
      defend: {
        audio: "qingyu1.mp3",
        trigger: { player: "damageBegin2" },
        filter(event, player) {
          return player.countCards("he", (card) => lib.filter.cardDiscardable(card, player, "qingyu_defend")) > 1;
        },
        forced: true,
        async content(event, trigger, player) {
          trigger.cancel();
          await player.chooseToDiscard(2, "he", true);
        }
      },
      achieve: {
        audio: "qingyu3.mp3",
        trigger: { player: "phaseZhunbeiBegin" },
        forced: true,
        skillAnimation: true,
        animationColor: "fire",
        filter(event, player) {
          return player.isHealthy() && player.countCards("h") < game.roundNumber;
        },
        async content(event, trigger, player) {
          game.log(player, "成功完成使命");
          player.awakenSkill("qingyu");
          player.addSkills("xuancun");
        }
      },
      fail: {
        audio: "qingyu2.mp3",
        trigger: { player: "dying" },
        forced: true,
        async content(event, trigger, player) {
          game.log(player, "使命失败");
          player.awakenSkill("qingyu");
          await player.loseMaxHp();
          const targets = game.filterPlayer((current) => current !== player);
          if (!targets.length) {
            return;
          }
          const result2 = targets.length > 1 ? await player.chooseTarget(`令一名其他角色获得${get.poptip("mbyongjue")}`, true, lib.filter.notMe).set("ai", (target) => get.attitude(get.player(), target)).forResult() : {
            bool: true,
            targets
          };
          if (result2?.bool && result2.targets?.length) {
            const target = result2.targets[0];
            player.line(target);
            await target.addSkills("mbyongjue");
          }
        }
      }
    },
    derivation: ["xuancun", "mbyongjue"]
  },
  xuancun: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      return player !== event.player && player.countCards("h") < player.hp;
    },
    logTarget: "player",
    check(event, player) {
      return get.attitude(player, event.player) > 0;
    },
    prompt2(event, player) {
      return `令其摸${get.cnNumber(Math.min(2, player.hp - player.countCards("h")))}张牌`;
    },
    async content(event, trigger, player) {
      await trigger.player.draw(Math.min(2, player.hp - player.countCards("h")));
    }
  },
  mbyongjue: {
    audio: "yongjue",
    trigger: {
      global: "useCard"
    },
    filter(event, player) {
      if (event.player !== _status.currentPhase || event.card.name !== "sha") {
        return false;
      }
      return event.player.getHistory("useCard").indexOf(event) === 0;
    },
    forced: true,
    logTarget: "player",
    async content(event, trigger, player) {
      player.when({
        global: "useCardAfter"
      }).filter((evt) => evt === trigger).step(async (event2, trigger2, player2) => {
        const cards2 = trigger2.cards.filterInD("od");
        if (cards2.length) {
          await player2.gain(cards2, "gain2");
        }
      });
    }
  },
  //羊祜
  mingfa: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    direct: true,
    filter(event, player) {
      return player.storage.mingfa && player.hasCards("h") && player.getCards("he").includes(player.storage.mingfa) && !player.hasSkillTag("noCompareSource") && game.hasPlayer((current) => current !== player && player.canCompare(current));
    },
    async content(event, trigger, player) {
      event.card = player.storage.mingfa;
      delete player.storage.mingfa;
      const result2 = await player.chooseTarget({
        prompt: get.prompt("mingfa"),
        prompt2: `用${get.translation(event.card)}和一名其他角色拼点`,
        filterTarget(card2, player2, target2) {
          return player2.canCompare(target2);
        },
        ai(target2) {
          const player2 = get.player();
          const evt = get.event().getParent();
          if (evt == null) {
            return 0;
          }
          const card2 = evt.card;
          if (card2.number > 9 || !target2.hasCards("h", (cardx) => cardx.number >= card2.number + 2)) {
            return -get.attitude(player2, target2) / Math.sqrt(target2.countCards("h"));
          }
          return 0;
        }
      }).forResult();
      if (!result2?.bool | !result2.targets?.length) {
        player.removeGaintag("mingfa");
        return;
      }
      const target = result2.targets[0];
      player.logSkill("mingfa", target);
      const next = player.chooseToCompare(target);
      if (!next.fixedResult) {
        next.fixedResult = {};
      }
      next.fixedResult[player.playerid] = event.card;
      const result22 = await next.forResult();
      if (!result22.bool) {
        player.addTempSkill("mingfa_block");
        return;
      }
      await player.gainPlayerCard({
        target,
        position: "he",
        forced: true
      });
      if (event.card.number === 1) {
        return;
      }
      const card = get.cardPile2((card2) => card2.number === event.card.number - 1);
      if (card) {
        await player.gain({
          cards: [card],
          animate: "gain2"
        });
      }
    },
    group: ["mingfa_choose", "mingfa_add", "mingfa_mark"],
    subSkill: {
      block: {
        mod: {
          playerEnabled(card, player, target) {
            if (player !== target) {
              return false;
            }
          }
        }
      },
      choose: {
        trigger: { player: "phaseJieshuBegin" },
        direct: true,
        filter(event, player) {
          return player.countCards("he") > 0;
        },
        async content(event, trigger, player) {
          const result2 = await player.chooseCard({
            prompt: get.prompt("mingfa"),
            prompt2: "选择展示自己的一张牌",
            position: "he",
            ai(card2) {
              return Math.min(13, get.number(card2) + 2) / Math.pow(Math.min(2, get.value(card2)), 0.25);
            }
          }).forResult();
          if (!result2.bool || !result2.cards?.length) {
            return;
          }
          const card = result2.cards[0];
          player.logSkill("mingfa");
          player.removeGaintag("mingfa");
          player.addGaintag(card, "mingfa");
          player.storage.mingfa = card;
          await player.showCards(card, `${get.translation(player)}发动了【明伐】`);
        }
      },
      add: {
        audio: "mingfa",
        trigger: { player: "compare", target: "compare" },
        filter(event, player) {
          if (event.player === player) {
            return !event.iwhile;
          }
          return true;
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          if (player === trigger.player) {
            trigger.num1 = Math.min(13, trigger.num1 + 2);
          } else {
            trigger.num2 = Math.min(13, trigger.num2 + 2);
          }
          game.log(player, "的拼点牌点数+2");
        }
      },
      mark: {
        trigger: { player: "gainEnd" },
        silent: true,
        firstDo: true,
        filter(event, player) {
          return player.storage.mingfa && event.cards.includes(player.storage.mingfa) && player.getCards("h").includes(player.storage.mingfa);
        },
        async content(event, trigger, player) {
          player.addGaintag(player.storage.mingfa, "mingfa");
        }
      }
    }
  },
  rongbei: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "thunder",
    filter(event, player) {
      return game.hasPlayer((current) => lib.skill.rongbei.filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      for (const i of [1, 2, 3, 4, 5]) {
        if (target.hasEmptySlot(i)) {
          return true;
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      const { target } = event;
      player.awakenSkill(event.name);
      for (const num of [1, 2, 3, 4, 5]) {
        if (!target.hasEmptySlot(num)) {
          continue;
        }
        const card = get.cardPile2((card2) => get.subtype(card2) === `equip${num}` && target.canUse(card2, target));
        if (card) {
          await target.chooseUseTarget({
            card,
            forced: true,
            nopopup: true
          });
        }
      }
    },
    ai: {
      order: 5,
      result: {
        target(player, target) {
          return (target.hasSkillTag("noe") ? 2 : 1) * (5 - target.countCards("e") - target.countDisabled());
        }
      }
    }
  },
  //桥公
  yizhu: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    locked: false,
    async content(event, trigger, player) {
      await player.draw(2);
      const hs = player.getCards("he");
      if (!hs.length) {
        return;
      }
      let cards2;
      if (hs.length <= 2) {
        cards2 = hs;
      } else {
        const result2 = await player.chooseCard({
          prompt: "选择两张牌洗入牌堆",
          selectCard: 2,
          position: "he",
          forced: true
        }).forResult();
        if (!result2.bool || !result2.cards?.length) {
          return;
        }
        cards2 = result2.cards;
      }
      player.$throw(cards2.length, 1e3);
      const loseEvent = player.lose({
        cards: cards2,
        position: ui.cardPile
      });
      loseEvent.insert_index = () => ui.cardPile.childNodes[get.rand(0, game.players.length * 2 - 2)];
      player.markAuto("yizhu", cards2);
      await loseEvent;
      game.updateRoundNumber();
      await game.delayx();
    },
    intro: {
      mark(dialog, content, player) {
        if (player === game.me || player.isUnderControl()) {
          dialog.addAuto(content);
        } else {
          const names = [];
          for (const card of content) {
            names.add(card.name);
          }
          return get.translation(names);
        }
      }
    },
    group: ["yizhu_use", "yizhu_clear"],
    subSkill: {
      use: {
        audio: "yizhu",
        trigger: { global: "useCardToPlayer" },
        filter(event, player) {
          return player.storage.yizhu?.length && event.player !== player && event.targets.length === 1 && event.cards?.some((card) => player.storage.yizhu.includes(card));
        },
        logTarget: "player",
        check(event, player) {
          return get.effect(event.targets[0], event.card, event.player, player) < 0;
        },
        prompt2(event, player) {
          return `令${get.translation(event.card)}无效`;
        },
        async content(event, trigger, player) {
          trigger.cancel();
          trigger.targets.length = 0;
          trigger.getParent().triggeredTargets1.length = 0;
          const list = trigger.cards.filter((card) => player.storage.yizhu.includes(card));
          player.unmarkAuto("yizhu", list);
          await game.delayx();
        }
      },
      clear: {
        forced: true,
        locked: false,
        audio: "yizhu",
        trigger: {
          global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"]
        },
        filter(event, player) {
          if (event.name !== "cardsDiscard") {
            if (event.position !== ui.discardPile) {
              return false;
            }
            if (!game.hasPlayer((current) => {
              const evt = event.getl?.(current);
              return evt?.cards?.filterInD("od").some((card) => (player.storage.yizhu ?? []).includes(card));
            })) {
              return false;
            }
          } else {
            const evt = event.getParent();
            if (evt?.relatedEvent?.name === "useCard") {
              return false;
            }
          }
          return true;
        },
        async content(event, trigger, player) {
          const cards2 = trigger.cards.filterInD("od").slice();
          player.unmarkAuto("yizhu", cards2);
        }
      }
    }
  },
  luanchou: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    selectTarget: 2,
    filterTarget: true,
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      const targets = event.targets;
      game.countPlayer((current) => {
        const num = current.countMark("luanchou");
        if (num) {
          current.removeMark("luanchou", num);
        }
      });
      targets.sortBySeat();
      for (const i of targets) {
        i.addMark("luanchou", 1);
      }
    },
    global: ["gonghuan", "gonghuan_clear"],
    derivation: "gonghuan",
    marktext: "姻",
    intro: {
      name: "共患",
      content: () => lib.translate.gonghuan_info,
      onunmark: true
    },
    ai: {
      order: 10,
      expose: 0.2,
      result: {
        target(player, target) {
          if (!ui.selected.targets.length) {
            return -Math.pow(target.hp, 3);
          }
          if (target.hp >= ui.selected.targets[0].hp) {
            return 0;
          }
          return Math.pow(ui.selected.targets[0].hp - target.hp, 3);
        }
      }
    }
  },
  gonghuan: {
    audio: 2,
    forceaudio: true,
    trigger: { global: "damageBegin4" },
    usable: 1,
    forced: true,
    logTarget: "player",
    filter(event, player) {
      return event.player.hp < player.hp && player.hasMark("luanchou") && event.player.hasMark("luanchou") && game.hasPlayer((current) => current.hasSkill("luanchou"));
    },
    async content(event, trigger, player) {
      trigger._gonghuan_player = trigger.player;
      trigger.player = player;
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (_status.luanchou_judging) {
            return;
          }
          if (get.tag(card, "damage") && target.hasMark("luanchou")) {
            let other = game.findPlayer((current) => current !== target && current.hasMark("luanchou") && current.hp > target.hp && (!current.storage.counttrigger || !current.storage.counttrigger.gonghuan));
            if (!other) {
              return;
            }
            _status.luanchou_judging = true;
            let eff = [0, 0, 0, get.damageEffect(other, player, player, get.nature(card)) / get.attitude(player, player)];
            delete _status.luanchou_judging;
            return eff;
          }
        }
      }
    },
    subSkill: {
      clear: {
        trigger: { player: "damageEnd" },
        forced: true,
        popup: false,
        filter(event, player) {
          return event._gonghuan_player;
        },
        async content(event, trigger, player) {
          player.removeMark("luanchou", player.countMark("luanchou"));
          trigger._gonghuan_player.removeMark("luanchou", trigger._gonghuan_player.countMark("luanchou"));
        }
      }
    }
  },
  //刘璋
  xiusheng: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      return player.storage.yinlang && game.hasPlayer((current) => current.group === player.storage.yinlang);
    },
    async content(event, trigger, player) {
      if (player.storage.xiusheng && player.storage.xiusheng.length > 0) {
        player.unmarkSkill("xiusheng");
      }
      const num = game.countPlayer((current) => current.group === player.storage.yinlang);
      if (num <= 0) {
        return;
      }
      await player.draw(num);
      const he = player.getCards("he");
      if (!he.length) {
        return;
      }
      let cards2 = he;
      if (he.length >= num) {
        const result2 = await player.chooseCard({
          prompt: `选择${get.cnNumber(num)}张牌作为“生”`,
          selectCard: num,
          position: "he",
          forced: true,
          allowChooseAll: true
        }).forResult();
        if (!result2?.bool || !result2.cards?.length) {
          await game.delayx();
          return;
        }
        cards2 = result2.cards;
      }
      player.markAuto("xiusheng", cards2);
      game.log(player, "将", cards2, "放在了武将牌上");
      await player.lose({
        cards: cards2,
        position: ui.special,
        toStorage: true
      });
      await game.delayx();
    },
    intro: {
      content: "cards",
      onunmark: "throw"
    },
    ai: { combo: "yinlang" }
  },
  yinlang: {
    audio: 2,
    trigger: { player: "phaseBegin" },
    filter(event, player) {
      return !player.hasSkill("yinlang_round") && game.hasPlayer((current) => current.group && current.group !== "unknown");
    },
    async cost(event, trigger, player) {
      const list = game.filterPlayer((current) => current.group && current.group !== "unknown").map((current) => current.group).toUniqued();
      list.sort((a, b) => lib.group.indexOf(a) - lib.group.indexOf(b));
      if (!player.hasSkill("yinlang")) {
        list.push("cancel2");
      }
      const getn = (group) => game.countPlayer((current) => {
        if (current.group !== group) {
          return false;
        }
        if (get.attitude(current, player) > 0) {
          return 1.5;
        }
        if (!current.inRange(player)) {
          return 1;
        }
        return 0.6;
      });
      const choice = list.toSorted((a, b) => getn(b) - getn(a))[0];
      const result2 = await player.chooseControl({
        prompt: "引狼：请选择一个势力",
        controls: list,
        ai() {
          return get.event().choice;
        }
      }).set("choice", choice).forResult();
      event.result = {
        bool: result2.control !== "cancel2",
        targets: game.filterPlayer((current) => current.group === result2.control),
        cost_data: {
          group: result2.control
        }
      };
    },
    async content(event, trigger, player) {
      const group = event.cost_data.group;
      game.log(player, "选择了", `#y${get.translation(`${group}2`)}`);
      player.storage.yinlang = group;
      player.markSkill("yinlang");
    },
    ai: { combo: "xiusheng" },
    intro: { content: "已选择了$势力" },
    group: "yinlang_gain",
    subSkill: {
      round: {},
      gain: {
        audio: "yinlang",
        trigger: { global: "phaseUseBegin" },
        forced: true,
        locked: false,
        filter(event, player) {
          return event.player.group === player.storage.yinlang && event.player.isIn() && player.getStorage("xiusheng").length > 0;
        },
        logTarget: "player",
        async content(event, trigger, player) {
          const str = get.translation(player);
          const target = trigger.player;
          const result2 = await target.chooseControl({
            choiceList: [`获得${str}的一张“生”，然后本阶段使用牌时只能指定其为目标`, `令${str}获得一张“生”`],
            ai() {
              const { player: player2, target: target2 } = get.event();
              if (get.attitude(player2, target2) > 0) {
                return 1;
              }
              if (!player2.hasCards("hs", (card) => player2.hasValueTarget(card, null, true) && (!player2.canUse(card, target2, null, true) || get.effect(target2, card, player2, player2) < 0))) {
                return 0;
              }
              return 1;
            }
          }).set("target", target).forResult();
          if (typeof result2?.index !== "number") {
            return;
          }
          const gainner = result2.index === 0 ? target : player;
          if (player.getStorage("xiusheng").length) {
            const result22 = await gainner.chooseButton({
              createDialog: ["选择获得一张“生”", player.storage.xiusheng],
              forced: true
            }).forResult();
            if (result22?.links?.length) {
              player.unmarkAuto("xiusheng", result22.links);
              await gainner.gain(result22.links, "gain2");
            }
          }
          if (result2.index === 0) {
            target.markAuto("yinlang_block", [player]);
            target.addTempSkill("yinlang_block", "phaseUseAfter");
          }
        }
      },
      block: {
        mod: {
          playerEnabled(card, player, target) {
            const info = get.info(card);
            if (info && info.singleCard && ui.selected.cards.length) {
              return;
            }
            if (!player.getStorage("yinlang_block").includes(target)) {
              return false;
            }
          }
        },
        onremove: true
      }
    }
  },
  huaibi: {
    audio: 2,
    zhuSkill: true,
    mod: {
      maxHandcard(player, num) {
        if (player.storage.yinlang && player.hasZhuSkill("huaibi")) {
          return num + game.countPlayer((current) => current.group === player.storage.yinlang);
        }
      }
    },
    ai: { combo: "yinlang" }
  },
  //张温
  gebo: {
    audio: 2,
    trigger: { global: "recoverAfter" },
    forced: true,
    async content(event, trigger, player) {
      await game.cardsGotoSpecial(get.cards(), "toRenku");
    },
    ai: {
      combo: "spsongshu"
    }
  },
  spsongshu: {
    audio: 2,
    trigger: { global: "phaseDrawBegin1" },
    logTarget: "player",
    filter(event, player) {
      return event.player.hp > player.hp && player.hp > 0 && !event.numFixed && _status.renku.length > 0;
    },
    check(event, player) {
      const num = Math.min(5, player.hp, _status.renku.length);
      if (num <= event.num) {
        return get.attitude(player, event.player) < 0;
      }
      return false;
    },
    async content(event, trigger, player) {
      trigger.changeToZero();
      const num = Math.min(5, player.hp, _status.renku.length);
      const target = trigger.player;
      const result2 = await target.chooseButton({
        createDialog: [`选择获得${get.cnNumber(num)}张牌`, _status.renku],
        selectButton: num,
        forced: true
      }).forResult();
      if (!result2.bool || !result2.links?.length) {
        return;
      }
      const cards2 = result2.links;
      const gainEvent = target.gain({
        cards: cards2,
        animate: "gain2",
        areaNames: ["fromRenku"]
      });
      target.addTempSkill("spsongshu_block");
      await gainEvent;
    },
    init(player) {
      player.storage.renku = true;
    },
    subSkill: {
      block: {
        mod: {
          playerEnabled(card, player, target) {
            if (player !== target) {
              return false;
            }
          }
        },
        mark: true,
        intro: { content: "不能对其他角色使用牌" }
      }
    },
    ai: {
      combo: "gebo"
    }
  },
  //张机
  jishi: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    forced: true,
    filter(event, player) {
      return event.cards.filterInD().length > 0 && !player.getHistory("sourceDamage", (evt) => evt.card === event.card).length;
    },
    async content(event, trigger, player) {
      const cards2 = trigger.cards.filterInD();
      game.log(player, "将", cards2, "置于了仁库");
      await game.cardsGotoSpecial(cards2, "toRenku");
    },
    init(player) {
      player.storage.renku = true;
    },
    group: "jishi_draw",
    subSkill: {
      draw: {
        audio: "jishi",
        trigger: {
          global: ["gainAfter", "cardsDiscardAfter"]
        },
        forced: true,
        filter(event, player) {
          return event.fromRenku === true && !event.outRange;
        },
        async content(event, trigger, player) {
          await player.draw();
        }
      }
    },
    ai: {
      combo: "binglun"
    }
  },
  xinliaoyi: {
    audio: "liaoyi",
    trigger: { global: "phaseBegin" },
    filter(event, player) {
      if (player === event.player) {
        return false;
      }
      if (_status.renku.length) {
        return true;
      }
      return event.player.countCards("h") > event.player.getHp();
    },
    async cost(event, trigger, player) {
      const target = trigger.player;
      const num = Math.max(0, target.countCards("h") - target.getHp());
      const choiceList = ["令其从仁库中获得一张牌", `令其将${get.cnNumber(num)}张手牌置入仁库`];
      const choices = [];
      if (_status.renku.length) {
        choices.push("选项一");
      } else {
        choiceList[0] = `<span style="opacity:0.5">${choiceList[0]}</span>`;
      }
      if (target.countCards("h") > target.getHp()) {
        choices.push("选项二");
      } else {
        choiceList[1] = `<span style="opacity:0.5">${choiceList[1]}</span>`;
      }
      if (!choices.length) {
        return;
      }
      const result2 = await player.chooseControl(choices, "cancel2").set("prompt", get.prompt("xinliaoyi", target)).set("choiceList", choiceList).set("ai", () => {
        const { player: player2, target: target2, controls } = get.event();
        const att = get.attitude(player2, target2);
        if (att > 0) {
          if (controls.includes("选项一")) {
            return "选项一";
          }
          return "cancel2";
        }
        if (controls.includes("选项二")) {
          return "选项二";
        }
        return "cancel2";
      }).set("target", target).forResult();
      event.result = {
        bool: result2.control !== "cancel2",
        cost_data: result2.control
      };
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const target = event.targets[0];
      const control = event.cost_data;
      if (control === "选项一") {
        if (!_status.renku.length) {
          return;
        }
        const result2 = await target.chooseButton(true, ["选择获得一张牌", _status.renku]).set("ai", (button) => get.value(button.link, get.player())).set("direct", true).forResult();
        if (result2?.bool) {
          await target.gain(result2.links, "gain2", "fromRenku");
        }
      } else {
        const hs = target.getCards("h");
        const num = Math.max(0, target.countCards("h") - target.getHp());
        if (!hs.length) {
          return;
        }
        const result2 = hs.length <= num ? { bool: true, cards: hs } : await target.chooseCard("h", true, `将${get.cnNumber(num)}张手牌置于仁库中`, num).forResult();
        if (result2?.bool) {
          target.$throw(result2.cards, 1e3);
          game.log(target, "将", result2.cards, "置入了仁库");
          await target.lose(result2.cards, ui.special, "toRenku");
          await game.delayx();
        }
      }
    },
    init(player) {
      player.storage.renku = true;
    },
    ai: { threaten: 3.4 }
  },
  liaoyi: {
    audio: 2,
    trigger: { global: "phaseBegin" },
    filter(event, player) {
      if (player === event.player) {
        return false;
      }
      const num = event.player.getHp() - event.player.countCards("h");
      if (num < 0) {
        return true;
      }
      return num > 0 && _status.renku.length >= Math.min(4, num);
    },
    logTarget: "player",
    prompt2(event, player) {
      const target = event.player;
      const num = target.getHp() - target.countCards("h");
      if (num < 0) {
        return `令${get.translation(target)}将${get.cnNumber(Math.min(4, -num))}张牌置入仁库`;
      }
      return `令${get.translation(target)}从仁库中获得${get.cnNumber(Math.min(4, num))}张牌`;
    },
    check(event, player) {
      const target = event.player;
      const num = target.getHp() - target.countCards("h");
      const att = get.attitude(player, target);
      if (num < 0) {
        if (target.countCards("e", (card) => get.value(card, target) <= 0) >= -num / 2) {
          return att > 0;
        }
        return att <= 0;
      }
      return att > 0;
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      let num = target.getHp() - target.countCards("h");
      if (num < 0) {
        num = Math.min(4, -num);
        const hs = target.getCards("he");
        if (!hs.length) {
          return;
        }
        const result2 = hs.length <= num ? { bool: true, cards: hs } : await target.chooseCard("he", true, `将${get.cnNumber(num)}张牌置于仁库中`, num).forResult();
        if (result2?.bool) {
          target.$throw(result2.cards, 1e3);
          game.log(target, "将", result2.cards, "置入了仁库");
          await target.lose(result2.cards, ui.special, "toRenku");
          await game.delayx();
        }
      } else {
        num = Math.min(4, num);
        if (!_status.renku.length) {
          return;
        }
        const result2 = await target.chooseButton([`选择获得${get.cnNumber(num)}张牌`, _status.renku], num, true).set("ai", (button) => get.value(button.link, get.player())).set("direct", true).forResult();
        if (result2?.bool) {
          await target.gain(result2.links, "gain2", "fromRenku");
        }
      }
    }
  },
  binglun: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return _status.renku.length > 0;
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("病论", _status.renku);
      },
      backup(links, player) {
        const obj = lib.skill.binglun_backup;
        obj.card = links[0];
        return obj;
      },
      prompt: () => "请选择【病论】的目标"
    },
    subSkill: {
      backup: {
        audio: "binglun",
        filterCard: () => false,
        selectCard: -1,
        filterTarget: true,
        delay: false,
        async content(event, trigger, player) {
          const card = lib.skill.binglun_backup.card;
          const { target } = event;
          game.log(card, "从仁库进入了弃牌堆");
          player.$throw(card, 1e3);
          await game.delayx();
          const discard = game.cardsDiscard(card);
          discard.fromRenku = true;
          await discard;
          const control = await target.chooseControl().set("choiceList", ["摸一张牌", "于自己的下回合结束后回复1点体力"]).set("ai", () => _status.event.player.isHealthy() ? 0 : 1).forResult();
          if (control.index === 0) {
            await target.draw();
          } else {
            target.addSkill("binglun_recover");
            target.addMark("binglun_recover", 1, false);
          }
        },
        ai: {
          result: {
            target(player, target) {
              if (target.isDamaged()) {
                return 1.5;
              }
              return 1;
            }
          }
        }
      },
      recover: {
        trigger: { player: "phaseEnd" },
        forced: true,
        popup: false,
        onremove: true,
        charlotte: true,
        async content(event, trigger, player) {
          if (player.isDamaged()) {
            player.logSkill("binglun_recover");
            player.recover({ num: player.countMark("binglun_recover") });
          }
          player.removeSkill("binglun_recover");
        },
        intro: {
          content: "下回合结束时回复#点体力"
        },
        ai: { threaten: 1.7 }
      }
    },
    ai: {
      combo: "jishi",
      order: 2,
      result: {
        player: 1
      }
    }
  },
  mjweipo: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      if (player.hasSkill("mjweipo_used")) {
        return false;
      }
      return game.hasPlayer((current) => !current.hasSkill("mjweipo_effect"));
    },
    filterTarget(card, player, target) {
      return !target.hasSkill("mjweipo_effect");
    },
    async content(event, trigger, player) {
      player.addTempSkill("mjweipo_used");
      const list = ["binglinchengxiax"];
      list.addArray(get.zhinangs());
      const result2 = await player.chooseButton({
        createDialog: ["危迫：选择一个智囊", [list, "vcard"]],
        forced: true,
        ai(button) {
          return get.event().getParent()?.target.getUseValue({ name: button.link[2] }) ?? 0;
        }
      }).forResult();
      if (!result2.bool || !result2.links?.length) {
        return;
      }
      const name = result2.links[0][2];
      const { target } = event;
      game.log(player, "选择了", `#y${get.translation(name)}`);
      target.storage.mjweipo_effect = name;
      target.storage.mjweipo_source = player;
      target.addSkill("mjweipo_effect");
      await game.delayx();
    },
    subSkill: {
      used: {
        charlotte: true
      }
    },
    ai: {
      order: 7.1,
      result: {
        target(player, target) {
          if (target === player) {
            return player.hasCards("hs", "sha") ? 10 : 0.01;
          }
          return (target.countCards("hs", "sha") + 0.5) * Math.sqrt(Math.max(1, target.hp));
        }
      }
    }
  },
  mjweipo_effect: {
    audio: "mjweipo",
    enable: "phaseUse",
    sourceSkill: "mjweipo",
    filter(event, player) {
      return player.hasCards("h", "sha");
    },
    prompt() {
      return `弃置一张【杀】并获得一张${get.translation(_status.event.player.storage.mjweipo_effect)}`;
    },
    filterCard: { name: "sha" },
    check(card) {
      return 6 - get.value(card);
    },
    position: "h",
    popname: true,
    async content(event, trigger, player) {
      const name = player.storage.mjweipo_effect;
      let card = null;
      if (name === "binglinchengxiax") {
        if (!_status.binglinchengxiax) {
          _status.binglinchengxiax = [
            ["spade", 7],
            ["club", 7],
            ["club", 13]
          ];
          game.broadcastAll(() => {
            lib.inpile.add("binglinchengxiax");
          });
        }
        if (_status.binglinchengxiax.length) {
          let info = _status.binglinchengxiax.randomRemove();
          card = game.createCard2("binglinchengxiax", info[0], info[1]);
        }
      }
      if (!card) {
        card = get.cardPile2(name);
      }
      if (card) {
        await player.gain({
          cards: [card],
          animate: "gain2"
        });
      }
      player.removeSkill("mjweipo_effect");
    },
    ai: {
      order: 7,
      result: { player: 1 }
    },
    mark: true,
    marktext: "迫",
    intro: { content: "可弃置一张【杀】并获得【$】" },
    group: "mjweipo_remove"
  },
  mjweipo_remove: {
    trigger: { global: ["phaseBegin", "die"] },
    forced: true,
    firstDo: true,
    popup: false,
    sourceSkill: "mjweipo",
    filter(event, player) {
      return event.player === player.storage.mjweipo_source;
    },
    async content(event, trigger, player) {
      player.removeSkill("mjweipo_effect");
    }
  },
  mjchenshi: {
    audio: 2,
    global: ["mjchenshi_player", "mjchenshi_target"],
    ai: { combo: "mjweipo" }
  },
  mjchenshi_player: {
    trigger: { player: "useCardToPlayered" },
    sourceSkill: "mjchenshi",
    filter(event, player) {
      if (!event.card || event.card.name !== "binglinchengxiax" || !event.isFirstTarget) {
        return false;
      }
      return player.countCards("he") > 0 && game.hasPlayer((current) => current !== player && current.hasSkill("mjchenshi"));
    },
    async cost(event, trigger, player) {
      const list = game.filterPlayer((current) => current !== player && current.hasSkill("mjchenshi"));
      event.result = await player.chooseCardTarget({
        prompt: `是否交给${get.translation(list)}一张牌，将牌堆顶三张牌中不为【杀】的牌置于弃牌堆？`,
        filterCard: true,
        position: "he",
        filterTarget(card, player2, target) {
          return _status.event.list.includes(target);
        },
        list,
        selectTarget: list.length > 1 ? 1 : -1,
        goon: (() => {
          for (const i of list) {
            if (get.attitude(player, i) > 0) {
              return 1;
            }
            return -1;
          }
        })(),
        ai1(card) {
          if (_status.event.goon > 0) {
            return 7 - get.value(card);
          }
          return 0.01 - get.value(card);
        },
        ai2(target) {
          let card = ui.selected.cards[0];
          return get.value(card, target) * get.attitude(_status.event.player, target);
        }
      }).forResult();
    },
    popup: false,
    async content(event, trigger, player) {
      const {
        cards: cards2,
        targets: [target]
      } = event;
      target.logSkill("mjchenshi");
      player.line(target, "green");
      trigger.getParent().mjchenshi_ai = true;
      await player.give(cards2, target);
      const top = get.cards(3, true).filter((card) => get.name(card) !== "sha");
      if (top.length) {
        game.log(top, "进入了弃牌堆");
        player.$throw(top, 1e3);
        await game.cardsDiscard(top);
        await game.delayx();
      }
    }
  },
  mjchenshi_target: {
    trigger: { target: "useCardToTargeted" },
    sourceSkill: "mjchenshi",
    filter(event, player) {
      if (!event.card || event.card.name !== "binglinchengxiax") {
        return false;
      }
      return player.countCards("he") > 0 && game.hasPlayer((current) => current !== player && current.hasSkill("mjchenshi"));
    },
    async cost(event, trigger, player) {
      const list = game.filterPlayer((current) => current !== player && current.hasSkill("mjchenshi"));
      event.result = await player.chooseCardTarget({
        prompt: `是否交给${get.translation(list)}一张牌，将牌堆顶三张牌中的【杀】置于弃牌堆？`,
        filterCard: true,
        position: "he",
        filterTarget(card, player2, target) {
          return _status.event.list.includes(target);
        },
        list,
        selectTarget: list.length > 1 ? 1 : -1,
        goon: (() => {
          if (trigger.getParent().chenshi_ai) {
            return 1;
          }
          for (const i of list) {
            if (get.attitude(player, i) > 0) {
              return 1;
            }
            return -1;
          }
        })(),
        ai1(card) {
          if (_status.event.goon > 0) {
            return 7 - get.value(card);
          }
          return 3 - get.value(card);
        },
        ai2(target) {
          let card = ui.selected.cards[0];
          return Math.max(0.1, get.value(card, target) * get.attitude(_status.event.player, target));
        }
      }).forResult();
    },
    popup: false,
    async content(event, trigger, player) {
      const {
        cards: cards2,
        targets: [target]
      } = event;
      target.logSkill("mjchenshi");
      player.line(target, "green");
      await player.give(cards2, target);
      const top = get.cards(3, true).filter((card) => get.name(card) === "sha");
      if (top.length) {
        game.log(top, "进入了弃牌堆");
        player.$throw(top, 1e3);
        await game.cardsDiscard(top);
        await game.delayx();
      }
    }
  },
  mjmouzhi: {
    audio: 2,
    trigger: { player: "damageBegin2" },
    forced: true,
    filter(event, player) {
      if (!event.card || get.suit(event.card) === "none") {
        return false;
      }
      let all = player.getAllHistory("damage");
      if (!all.length) {
        return false;
      }
      return all[all.length - 1].card && get.suit(all[all.length - 1].card) === get.suit(event.card);
    },
    async content(event, trigger, player) {
      trigger.cancel();
    },
    group: "mjmouzhi_mark",
    intro: { content: "上次受到伤害的花色：$" },
    ai: {
      effect: {
        target: (card, player, target) => {
          if (typeof card === "object" && get.tag(card, "damage")) {
            let suit = get.suit(card);
            if (suit === "none") {
              return;
            }
            let all = target.getAllHistory("damage");
            if (!all.length || !all[all.length - 1].card) {
              return;
            }
            if (get.suit(all[all.length - 1].card) === suit) {
              return "zeroplayertarget";
            }
          }
        }
      }
    },
    subSkill: {
      mark: {
        trigger: { player: "damage" },
        silent: true,
        firstDo: true,
        async content(event, trigger, player) {
          if (!trigger.card || get.suit(trigger.card) === "none") {
            player.unmarkSkill("mjmouzhi");
          } else {
            player.markSkill("mjmouzhi");
            game.broadcastAll(
              (player2, suit) => {
                if (player2.marks.mjmouzhi) {
                  player2.marks.mjmouzhi.firstChild.innerHTML = get.translation(suit);
                }
                player2.storage.mjmouzhi = suit;
              },
              player,
              get.suit(trigger.card)
            );
          }
        }
      }
    }
  },
  mjshengxi: {
    audio: "shengxi",
    audioname: ["feiyi"],
    trigger: { player: "phaseJieshuBegin" },
    direct: true,
    filter(event, player) {
      return player.hasHistory("useCard") && !player.hasHistory("sourceDamage");
    },
    async content(event, trigger, player) {
      const list = get.zhinangs();
      const { bool, links } = await player.chooseButton({
        createDialog: [`###${get.prompt("mjshengxi")}###获得一张智囊或摸一张牌`, [list, "vcard"], [["摸一张牌", "取消"], "tdnodes"]],
        forced: true,
        ai(card2) {
          if (card2.link[2]) {
            if (!get.cardPile2((cardx) => cardx.name === card2.link[2])) {
              return 0;
            }
            return (Math.random() + 1.5) * get.value({ name: card2.link[2] }, _status.event.player);
          }
          if (card2.link === "摸一张牌") {
            return 1;
          }
          return 0;
        }
      }).forResult();
      if (!bool || !links?.length || links[0] === "取消") {
        return;
      }
      player.logSkill("mjshengxi");
      if (links[0] === "摸一张牌") {
        await player.draw();
        return;
      }
      const card = get.cardPile2((card2) => card2.name === links[0][2]);
      if (card) {
        await player.gain({
          cards: [card],
          animate: "gain2"
        });
      }
    },
    group: "mjshengxi_zhunbei",
    subfrequent: ["zhunbei"],
    subSkill: {
      zhunbei: {
        audio: "shengxi",
        audioname: ["feiyi"],
        trigger: { player: "phaseZhunbeiBegin" },
        frequent: true,
        prompt2: "从游戏外或牌堆中获得一张【调剂盐梅】",
        async content(event, trigger, player) {
          if (!_status.tiaojiyanmei_suits || _status.tiaojiyanmei_suits.length > 0) {
            if (!lib.inpile.includes("tiaojiyanmei")) {
              lib.inpile.add("tiaojiyanmei");
            }
            if (!_status.tiaojiyanmei_suits) {
              _status.tiaojiyanmei_suits = lib.suit.slice(0);
            }
            await player.gain(game.createCard2("tiaojiyanmei", _status.tiaojiyanmei_suits.randomRemove(), 6), "gain2");
            return;
          }
          const card = get.cardPile2((card2) => card2.name === "tiaojiyanmei");
          if (card) {
            await player.gain({
              cards: [card],
              animate: "gain2"
            });
          }
        }
      }
    }
  },
  mjkuanji: {
    audio: "fyjianyu",
    usable: 1,
    trigger: {
      player: "loseAfter",
      global: "loseAsyncAfter"
    },
    filter(event, player) {
      if (event.type !== "discard") {
        return false;
      }
      const evt = event.getl(player);
      return evt?.cards2?.filterInD("d").length > 0 && game.hasPlayer((current) => player !== current);
    },
    async cost(event, trigger, player) {
      const cards2 = trigger.getl(player).cards2;
      const { links } = await player.chooseButton(["宽济：是否将一张牌交给一名其他角色？", cards2.filterInD("d")]).set("ai", (button) => {
        const player2 = get.player();
        if (game.hasPlayer((current) => current !== player2 && get.attitude(player2, current) > 0)) {
          return Math.abs(get.value(button.link, "raw")) + 1;
        }
        return -get.value(button.link, "raw");
      }).forResult();
      if (!links?.length) {
        return;
      }
      const card = links[0];
      event.card = card;
      const { bool, targets } = await player.chooseTarget(`将${get.translation(card)}交给一名其他角色并摸一张牌`, lib.filter.notMe, true).set("ai", (target) => {
        const evt = _status.event.getParent();
        return get.attitude(evt.player, target) * get.value(evt.card, target) * (target.hasSkillTag("nogain") ? 0.1 : 1);
      }).forResult();
      event.result = {
        bool,
        targets,
        cost_data: card
      };
    },
    async content(event, trigger, player) {
      await event.targets[0].gain(event.cost_data, "gain2");
      await player.draw();
    }
  },
  mjdingyi: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    locked: false,
    filter(event, player) {
      return event.name !== "phase" || game.phaseNumber === 0;
    },
    logTarget() {
      return game.players;
    },
    async content(event, trigger, player) {
      const list = [];
      for (const i of [0, 1, 2, 3]) {
        list.push(lib.skill[`mjdingyi_${i}`].title);
      }
      const { index } = await player.chooseControl({
        prompt: "定仪：请选择一个全局效果",
        choiceList: list,
        ai() {
          const list1 = player.getEnemies().length;
          const list2 = game.players.length - list1;
          if (list2 - list1 > 1) {
            return 0;
          }
          if (game.players.length < 6) {
            return 2;
          }
          return 3;
        }
      }).forResult();
      if (typeof index !== "number") {
        return;
      }
      const skill = `mjdingyi_${index}`;
      game.log(player, "选择了", `#g${lib.skill[skill].title}`);
      for (const target of game.players) {
        target.addSkill(skill);
      }
      await game.delayx();
    },
    subSkill: {
      0: {
        title: "摸牌阶段的额定摸牌数+1",
        charlotte: true,
        mark: true,
        marktext: "仪",
        trigger: { player: "phaseDrawBegin" },
        forced: true,
        filter(event, player) {
          return !event.numFixed;
        },
        async content(event, trigger, player) {
          trigger.num += (player.storage.mjdingyi_plus || 0) + 1;
        },
        intro: {
          content(storage, player) {
            return `摸牌阶段的额定摸牌数+${1 * ((player.storage.mjdingyi_plus || 0) + 1)}`;
          }
        }
      },
      1: {
        title: "手牌上限+2",
        charlotte: true,
        mark: true,
        marktext: "仪",
        mod: {
          maxHandcard(player, num) {
            return num + 2 * ((player.storage.mjdingyi_plus || 0) + 1);
          }
        },
        intro: {
          content(storage, player) {
            return `手牌上限+${2 * ((player.storage.mjdingyi_plus || 0) + 1)}`;
          }
        }
      },
      2: {
        title: "攻击范围+1",
        charlotte: true,
        mark: true,
        marktext: "仪",
        mod: {
          attackRange(player, num) {
            return num + ((player.storage.mjdingyi_plus || 0) + 1);
          }
        },
        intro: {
          content(storage, player) {
            return `攻击范围+${(player.storage.mjdingyi_plus || 0) + 1}`;
          }
        }
      },
      3: {
        title: "脱离濒死状态后回复1点体力",
        charlotte: true,
        mark: true,
        marktext: "仪",
        trigger: { player: "dyingAfter" },
        forced: true,
        filter(event, player) {
          return player.isDamaged();
        },
        async content(event, trigger, player) {
          await player.recover((player.storage.mjdingyi_plus || 0) + 1);
        },
        intro: {
          content(storage, player) {
            return `脱离濒死状态后回复${(player.storage.mjdingyi_plus || 0) + 1}点体力`;
          }
        }
      }
    }
  },
  mjzuici: {
    audio: "zuici",
    trigger: { player: "damageEnd" },
    filter(event, player) {
      if (!event.source || !event.source.isIn()) {
        return false;
      }
      for (const i of [0, 1, 2, 3]) {
        if (event.source.hasSkill(`mjdingyi_${i}`)) {
          return true;
        }
      }
      return false;
    },
    logTarget: "source",
    check: () => false,
    async content(event, trigger, player) {
      const target = trigger.source;
      for (const i of [0, 1, 2, 3]) {
        if (target.hasSkill(`mjdingyi_${i}`)) {
          target.removeSkill(`mjdingyi_${i}`);
        }
      }
      const list = get.zhinangs();
      if (!list.length) {
        return;
      }
      const result2 = await player.chooseButton({
        createDialog: [`选择要令${get.translation(target)}获得的智囊`, [list, "vcard"]],
        forced: true
      }).forResult();
      if (result2.bool) {
        const card = get.cardPile2((card2) => card2.name === result2.links[0][2]);
        if (card) {
          await target.gain({
            cards: [card],
            animate: "gain2"
          });
        }
      }
    },
    ai: {
      combo: "mjdingyi"
    }
  },
  mjfubi: {
    audio: "fubi",
    enable: "phaseUse",
    filter(event, player) {
      if (player.hasSkill("mjfubi_round")) {
        return false;
      }
      return game.hasPlayer((current) => {
        for (const i of [0, 1, 2, 3]) {
          if (current.hasSkill(`mjdingyi_${i}`)) {
            return true;
          }
        }
        return false;
      });
    },
    filterCard: true,
    selectCard: [0, 1],
    filterTarget(card, player, target) {
      if (ui.selected.cards.length) {
        for (const i of [0, 1, 2, 3]) {
          if (target.hasSkill(`mjdingyi_${i}`)) {
            return true;
          }
        }
      }
      const num = 0;
      for (const i of [0, 1, 2, 3]) {
        if (target.hasSkill(`mjdingyi_${i}`)) {
          return true;
        }
      }
      return num > 1 && num < 4;
    },
    check: () => false,
    position: "he",
    async content(event, trigger, player) {
      const cards2 = event.cards;
      const target = event.target;
      player.addTempSkill("mjfubi_round", "roundStart");
      if (cards2.length) {
        player.addSkill("mjfubi_clear");
        player.markAuto("mjfubi_clear", [target]);
        target.addMark("mjdingyi_plus", 1, false);
        game.log(target, "的", "#g【定仪】", "效果增加一倍");
        return;
      }
      const list = [];
      const nums = [];
      for (const i of [0, 1, 2, 3]) {
        if (!target.hasSkill(`mjdingyi_${i}`)) {
          list.push(lib.skill[`mjdingyi_${i}`].title);
          nums.push(i);
        }
      }
      if (!list.length) {
        return;
      }
      const result2 = await player.chooseControl({
        prompt: `辅弼：请选择为${get.translation(target)}更换的〖定仪〗效果`,
        choiceList: list,
        ai() {
          const currentPlayer = _status.event.player;
          const currentTarget = _status.event.getParent()?.target;
          if (get.attitude(currentPlayer, currentTarget) > 0 && !currentTarget?.hasSkill("mjdingyi_0")) {
            return 0;
          }
          return nums.length - 1;
        }
      }).forResult();
      for (const i of [0, 1, 2, 3]) {
        if (target.hasSkill(`mjdingyi_${i}`)) {
          target.removeSkill(`mjdingyi_${i}`);
        }
      }
      const skill = `mjdingyi_${nums[result2.index]}`;
      target.addSkill(skill);
      game.log(target, "的效果被改为", `#g${lib.skill[skill].title}`);
    },
    ai: {
      order: 10,
      expose: 0,
      result: {
        target(player, target) {
          if (target.hasSkill("mjdingyi_0")) {
            return -1;
          }
          return 2;
        }
      },
      combo: "mjdingyi"
    },
    subSkill: {
      round: {},
      clear: {
        trigger: { player: ["phaseBegin", "dieBegin"] },
        forced: true,
        popup: false,
        charlotte: true,
        async content(event, trigger, player) {
          for (const target of player.storage.mjfubi_clear || []) {
            if (target.hasMark("mjdingyi_plus")) {
              target.removeMark("mjdingyi_plus", 1, false);
            }
          }
          delete player.storage.mjfubi_clear;
          player.removeSkill("mjfubi_clear");
        }
      }
    }
  },
  boming: {
    audio: 2,
    enable: "phaseUse",
    usable: 2,
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    filterCard: true,
    position: "he",
    filterTarget: lib.filter.notMe,
    discard: false,
    lose: false,
    delay: false,
    async content(event, trigger, player) {
      const cards2 = event.cards;
      const target = event.target;
      await player.give(cards2, target);
    },
    check(card) {
      return 5 - get.value(card);
    },
    ai: {
      order: 10,
      result: {
        target(player, target) {
          if (!ui.selected.cards.length) {
            return 0;
          }
          let card = ui.selected.cards[0];
          if (player.hasSkill("ejian") && !player.getStorage("ejian").includes(target)) {
            let dam = get.damageEffect(target, player, target);
            if (dam > 0) {
              return dam;
            }
            let type = get.type(card, null, target);
            let ts = target.getCards("he", (card2) => get.type(card2) === type);
            if (ts.length) {
              let val = get.value(ts, target);
              if (val > get.value(card)) {
                return -Math.max(1, val);
              }
              return 0;
            }
          }
          return get.value(card, target) / 1.5;
        }
      }
    },
    group: "boming_draw",
    subSkill: {
      draw: {
        audio: "boming",
        trigger: { player: "phaseJieshuBegin" },
        forced: true,
        locked: false,
        filter(event, player) {
          return player.getHistory("lose", (evt) => evt.getParent(2).name === "boming").length > 1;
        },
        async content(event, trigger, player) {
          await player.draw();
        }
      }
    }
  },
  ejian: {
    audio: 2,
    trigger: { global: "gainAfter" },
    forced: true,
    filter(event, player) {
      const evt = event.getParent();
      const target = event.player;
      if (evt.name !== "boming" || evt.player !== player || player.getStorage("ejian").includes(target) || !target.isIn()) {
        return false;
      }
      const he = target.getCards("he");
      const card = event.cards[0];
      if (!he.includes(card)) {
        return false;
      }
      const type = get.type2(card);
      for (const current of he) {
        if (current !== card && get.type2(current) === type) {
          return true;
        }
      }
      return false;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const cardType = get.type2(trigger.cards[0]);
      const target = trigger.player;
      player.markAuto("ejian", [target]);
      const result2 = await target.chooseControl({
        choiceList: ["受到1点伤害", `展示手牌并弃置所有${get.translation(cardType)}牌`],
        ai(evt, current) {
          if (get.damageEffect(current, evt.getParent().player, current) >= 0) {
            return 0;
          }
          const type = evt.cardType;
          const cards2 = current.getCards("he", (card) => get.type2(card) === type);
          if (cards2.length === 1) {
            return 1;
          }
          if (cards2.length >= 2) {
            for (const card of cards2) {
              if (get.tag(card, "save")) {
                return 0;
              }
            }
          }
          if (current.hp === 1) {
            return 1;
          }
          for (const card of cards2) {
            if (get.value(card) >= 8) {
              return 0;
            }
          }
          if (cards2.length > 2 && current.hp > 2) {
            return 0;
          }
          if (cards2.length > 3) {
            return 0;
          }
          return 1;
        }
      }).set("cardType", cardType).forResult();
      if (result2.index !== 1) {
        await target.damage();
        return;
      }
      if (target.hasCards("h")) {
        await target.showHandcards();
      }
      await target.discard({
        cards: target.getCards("he", (card) => get.type2(card) === cardType)
      });
    },
    ai: { combo: "boming", halfneg: true },
    onremove: true,
    intro: { content: "已对$发动过此技能" }
  },
  yuanqing: {
    audio: 2,
    trigger: { player: "phaseUseEnd" },
    forced: true,
    filter(event, player) {
      return player.hasHistory("useCard", (evt) => evt.getParent("phaseUse") === event);
    },
    async content(event, trigger, player) {
      const map = {};
      const cards2 = [];
      player.getHistory("useCard", (evt) => {
        let type = get.type2(evt.card, false);
        if (!map[type]) {
          map[type] = [];
        }
      });
      for (const card of ui.discardPile.childNodes) {
        let type = get.type2(card, false);
        if (map[type]) {
          map[type].push(card);
        }
      }
      for (const i in map) {
        if (map[i].length) {
          cards2.push(map[i].randomGet());
        }
      }
      if (cards2.length) {
        player.$gain2(cards2, false);
        game.cardsGotoSpecial(cards2, "toRenku");
        game.log(player, "将", cards2, "置入了仁库");
        game.delayx();
      }
    },
    init(player) {
      player.storage.renku = true;
    },
    ai: {
      combo: "shuchen"
    }
  },
  shuchen: {
    audio: 2,
    init(player) {
      player.storage.renku = true;
    },
    trigger: { global: "dying" },
    forced: true,
    filter(event, player) {
      return _status.renku.length > 3;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      await player.gain(_status.renku, "gain2", "fromRenku");
      await trigger.player.recover();
    },
    ai: {
      combo: "yuanqing"
    }
  },
  hxrenshi: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.countCards("h") > 0 && (!player.storage.hxrenshi2 || game.hasPlayer((current) => !player.storage.hxrenshi2.includes(current)));
    },
    filterCard: true,
    filterTarget(card, player, target) {
      return !player.storage.hxrenshi2 || !player.storage.hxrenshi2.includes(target);
    },
    position: "h",
    discard: false,
    lose: false,
    delay: false,
    check(cardx) {
      let player = _status.event.player;
      if (player.getStorage("debao").length === 1 && (!game.hasPlayer((current) => get.attitude(player, current) > 0 && current.hp * 1.5 + current.countCards("h") < 4) || game.hasPlayer((current) => get.attitude(player, current) <= 0 && current.hp * 1.5 + current.countCards("h") < 4))) {
        return 0;
      }
      return 5 - get.value(cardx);
    },
    async content(event, trigger, player) {
      const cards2 = event.cards;
      const target = event.target;
      const targets = event.targets;
      player.addTempSkill("hxrenshi2", "phaseUseEnd");
      player.markAuto("hxrenshi2", targets);
      await player.give(cards2, target);
    },
    ai: {
      order: 1,
      result: {
        target(player, target) {
          if (ui.selected.cards.length) {
            return get.value(ui.selected.cards[0], target) + 0.1;
          }
          return 0;
        }
      }
    }
  },
  hxrenshi2: {
    onremove: true
  },
  debao: {
    audio: 2,
    trigger: { global: "gainAfter" },
    forced: true,
    filter(event, player) {
      if (player === event.player || player.getStorage("debao").length >= player.maxHp) {
        return false;
      }
      let evt = event.getl(player);
      return evt && evt.cards2 && evt.cards2.length > 0;
    },
    async content(event, trigger, player) {
      const cards2 = get.cards();
      player.markAuto("debao", cards2);
      player.$gain2(cards2[0], false);
      await game.cardsGotoSpecial(cards2);
      game.log(player, "将", cards2[0], "放在了武将牌上");
      await game.delayx();
    },
    marktext: "仁",
    intro: { content: "cards", onunmark: "throw" },
    group: "debao_gain",
    subSkill: {
      gain: {
        audio: "debao",
        trigger: { player: "phaseZhunbeiBegin" },
        forced: true,
        filter(event, player) {
          return player.getStorage("debao").length > 0;
        },
        async content(event, trigger, player) {
          const cards2 = player.storage.debao;
          await player.gain(cards2, "gain2", "fromStorage");
          cards2.length = 0;
          player.unmarkSkill("debao");
        }
      }
    }
  },
  buqi: {
    audio: 2,
    trigger: { global: "dying" },
    forced: true,
    filter(event, player) {
      return player.getStorage("debao").length > 1;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const storageCards = player.getStorage("debao");
      const result2 = storageCards.length === 2 ? { bool: true, links: storageCards.slice() } : await player.chooseButton({
        createDialog: ["不弃：请选择移去两张“仁”", storageCards],
        selectButton: 2,
        forced: true
      }).forResult();
      if (!result2.bool) {
        return;
      }
      const cards2 = result2.links;
      player.unmarkAuto("debao", cards2);
      player.$throw(cards2, 1e3);
      game.log(player, "将", cards2, "置入了弃牌堆");
      await game.delayx();
      await game.cardsDiscard(cards2);
      if (trigger.player.isIn() && trigger.player.isDamaged()) {
        await trigger.player.recover();
      }
    },
    group: "buqi_die",
    subSkill: {
      die: {
        audio: "buqi",
        trigger: { global: "dieAfter" },
        forced: true,
        filter(event, player) {
          return player.getStorage("debao").length > 0;
        },
        async content(event, trigger, player) {
          player.unmarkSkill("debao");
        }
      }
    },
    ai: {
      neg: true,
      combo: "debao"
    }
  },
  guying: {
    audio: 2,
    trigger: {
      player: "loseAfter",
      global: ["loseAsyncAfter", "gainAfter"]
    },
    forced: true,
    usable: 1,
    filter(event, player) {
      const target = _status.currentPhase;
      const evt = event.getl?.(player);
      if (!evt?.cards2 || evt.cards2?.length !== 1 || !target || target === player || !target.isIn()) {
        return false;
      }
      return get.position(evt.cards2[0]) === "d" || target.getCards("h").includes(evt.cards2[0]) || target.hasCards("he");
    },
    logTarget() {
      return _status.currentPhase;
    },
    async content(event, trigger, player) {
      if (trigger.delay === false) {
        await game.delayx();
      }
      const target = _status.currentPhase;
      const card = trigger.getl(player).cards2[0];
      player.addMark(event.name, 1, false);
      const choiceList = [];
      const str = get.translation(player);
      let addIndex = 0;
      if (target.hasGainableCards(player, "he")) {
        choiceList.push(`随机交给${str}一张牌`);
      } else {
        addIndex++;
      }
      if (get.position(card) === "d" || target.getCards("h").includes(card)) {
        choiceList.push(`令${str}收回${get.translation(card)}`);
      }
      let result2;
      if (choiceList.length === 1) {
        result2 = { index: 0 };
      } else {
        result2 = await target.chooseControl().set("choiceList", choiceList).set("sourcex", player).set("card", card).set("ai", () => {
          const player2 = get.player();
          const { sourcex, card: card2 } = get.event();
          if (get.value(card2, sourcex) * get.attitude(player2, sourcex) > 0) {
            return 0;
          }
          return Math.random() > get.value(card2, sourcex) / 6 ? 1 : 0;
        }).forResult();
      }
      if (typeof result2?.index !== "number") {
        return;
      }
      if (result2.index + addIndex === 0) {
        await target.give(target.getGainableCards(player, "he").randomGet(), player);
      } else {
        if (get.position(card) === "d") {
          await player.gain({ cards: [card], animate: "gain2" });
        } else {
          await player.gain({ cards: [card], animate: "giveAuto", source: player, bySelf: true });
        }
        if (player.isIn() && player.getCards("h").includes(card) && get.type(card, null, player) === "equip") {
          await player.chooseUseTarget(card, true, "nopopup");
        }
      }
    },
    onremove: true,
    intro: { content: "已发动过#次" },
    group: "guying_discard",
    subSkill: {
      discard: {
        audio: "guying",
        trigger: { player: "phaseZhunbeiBegin" },
        forced: true,
        filter(event, player) {
          return player.countMark("guying") > 0;
        },
        async content(event, trigger, player) {
          const num = player.countMark("guying");
          player.clearMark("guying", false);
          if (num > 0) {
            await player.chooseToDiscard("he", num, true, "allowChooseAll");
          }
        }
      }
    }
  },
  muzhen: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      const list = player.getStorage("muzhen_used");
      if (!list.includes("gain") && player.hasCard((i) => get.type(i) === "equip", "he") && game.hasPlayer((current) => current !== player)) {
        return true;
      }
      if (!list.includes("give") && player.hasCards("he") && game.hasPlayer((current) => current !== player && current.hasCards("e"))) {
        return true;
      }
      return !list.includes("draw") && game.hasPlayer((current) => current !== player);
    },
    chooseButton: {
      dialog(event, player) {
        const list = [
          ["gain", "将一张装备牌置于其他角色的装备区内并获得其一张手牌"],
          ["give", "将至多两张牌交给一名其他角色并获得其装备区内的一张牌"],
          ["draw", "你可以选择任意名其他角色，这些角色手牌数和装备区牌数每有一项与你相同，其摸一张牌，若这些角色均摸了两张牌，你摸选择角色数张牌"]
        ];
        return ui.create.dialog("睦阵：请选择一项", [list, "textbutton"], "hidden");
      },
      filter(button, player) {
        const list = player.getStorage("muzhen_used");
        if (list.includes(button.link)) {
          return false;
        }
        if (button.link === "gain") {
          return player.hasCard((i) => get.type(i) === "equip", "he") && game.hasPlayer((current) => current !== player && current.hasCards("h"));
        }
        if (button.link === "give") {
          return player.hasCards("he") && game.hasPlayer((current) => current !== player && current.hasCards("e"));
        }
        return game.hasPlayer((current) => current !== player);
      },
      backup(links) {
        const index = ["gain", "give", "draw"].indexOf(links[0]);
        return {
          audio: "muzhen",
          filterTarget: [
            (card, player, target) => {
              if (target === player) {
                return false;
              }
              return target.canEquip(ui.selected.cards[0]);
            },
            (card, player, target) => {
              if (target === player) {
                return false;
              }
              return target.hasCards("e");
            },
            lib.filter.notMe
          ][index],
          selectTarget: [1, 1, [1, Infinity]][index],
          filterCard: [
            (card, player) => {
              if (get.type(card) !== "equip") {
                return false;
              }
              if (ui.selected.targets.length) {
                return ui.selected.targets[0].canEquip(card);
              }
              return game.hasPlayer((current) => current.canEquip(card));
            },
            true,
            () => false
          ][index],
          selectCard: [1, [1, 2], -1][index],
          ai1(card) {
            return 8 - get.value(card);
          },
          ai2: [
            (target) => {
              const player = get.player();
              return get.attitude(player, target);
            },
            (target) => {
              const player = get.player();
              return get.attitude(player, target);
            },
            (target) => {
              const player = get.player();
              let cache = _status.event.getTempCache("muzhen", "targets");
              if (!Array.isArray(cache)) {
                let extras = [];
                let draws = game.filterPlayer((current) => {
                  if (current === player || get.attitude(player, current) <= 0) {
                    return false;
                  }
                  let num = 0;
                  for (const pos of ["h", "e"]) {
                    if (current.countCards(pos) === player.countCards(pos)) {
                      num++;
                    }
                  }
                  if (num === 2) {
                    extras.add(current);
                  }
                  return num === 1;
                });
                if (draws.length > extras.length) {
                  extras.addArray(draws);
                }
                _status.event.putTempCache("muzhen", "targets", extras);
                cache = extras;
              }
              if (cache.length) {
                return cache.includes(target) ? 2 : 0;
              }
              return get.attitude(player, target) > 0;
            }
          ][index],
          position: "he",
          discard: false,
          lose: false,
          delay: false,
          link: links[0],
          multiline: true,
          multitarget: true,
          async content(event, trigger, player) {
            const { cards: cards2, targets } = event;
            const target = targets[0];
            const { link } = get.info(event.name);
            player.addTempSkill("muzhen_used", "phaseUseEnd");
            player.markAuto("muzhen_used", link);
            switch (link) {
              case "gain": {
                player.$giveAuto(cards2[0], target);
                await game.delayx();
                await target.equip(cards2[0]);
                if (target.hasGainableCards(player, "h")) {
                  await player.gainPlayerCard(target, "h", true);
                }
                break;
              }
              case "give": {
                await player.give(cards2, target);
                if (target.hasGainableCards(player, "e")) {
                  await player.gainPlayerCard(target, "e", true);
                }
                break;
              }
              default: {
                targets.sortBySeat();
                let draw = true;
                await Promise.all(
                  targets.map((target2) => {
                    let num = 0;
                    for (const pos of ["h", "e"]) {
                      if (target2.countCards(pos) === player.countCards(pos)) {
                        num++;
                      }
                    }
                    if (num !== 2) {
                      draw = false;
                    }
                    if (num > 0) {
                      target2.draw(num, "nodelay");
                    }
                    return target2;
                  })
                );
                if (draw) {
                  await player.draw(targets.length);
                }
                break;
              }
            }
          }
        };
      },
      prompt() {
        return "请选择【睦阵】的牌和目标";
      }
    },
    ai: {
      order: 6,
      result: {
        player: 1
      }
    },
    subSkill: {
      used: {
        onremove: true,
        charlotte: true
      }
    }
  },
  sheyi: {
    audio: 2,
    trigger: { global: "damageBegin4" },
    filter(event, player) {
      return player !== event.player && event.player.hp < player.hp && player.countCards("he") >= Math.max(1, player.hp);
    },
    round: 1,
    async cost(event, trigger, player) {
      const num = Math.max(1, player.hp);
      const { player: target } = trigger;
      event.result = await player.chooseCard("he", get.prompt(event.skill, target), `交给其至少${get.cnNumber(num)}张牌，防止即将受到的伤害（${trigger.num}点）`, [num, player.countCards("he")], "allowChooseAll").set(
        "goon",
        (() => {
          if (get.attitude(player, target) < 0) {
            return false;
          }
          if (trigger.num < target.hp && get.damageEffect(target, trigger.source, player, trigger.nature) >= 0) {
            return false;
          }
          if (trigger.num < 2 && target.hp > trigger.num) {
            return 6 / Math.sqrt(num);
          }
          if (target === get.zhu(player)) {
            return 9;
          }
          return 8 / Math.sqrt(num);
        })()
      ).set("ai", (card) => {
        const { player: player2, goon } = get.event();
        if (ui.selected.cards.length >= Math.max(1, player2.hp)) {
          return 0;
        }
        if (typeof goon === "number") {
          return goon - get.value(card);
        }
        return 0;
      }).forResult();
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const { player: target } = trigger;
      await player.give(event.cards, target);
      trigger.cancel();
    }
  },
  tianyin: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    filter(event, player) {
      let list = [];
      player.getHistory("useCard", (evt) => {
        list.add(get.type2(evt.card, false));
      });
      for (const card of ui.cardPile.childNodes) {
        if (!list.includes(get.type2(card, false))) {
          return true;
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      const list = [];
      const cards2 = [];
      player.getHistory("useCard", (evt) => {
        list.add(get.type2(evt.card, false));
      });
      for (const card of ui.cardPile.childNodes) {
        let type = get.type2(card, false);
        if (!list.includes(type)) {
          list.push(type);
          cards2.push(card);
        }
      }
      player.gain(cards2, "gain2");
    }
  },
  //王甫赵累
  xunyi: {
    audio: 2,
    trigger: {
      global: ["phaseBefore", "dieAfter"],
      player: "enterGame"
    },
    intro: { content: "效果目标：$" },
    filter(event, player) {
      if (event.name === "die") {
        return player.getStorage("xunyi").includes(event.player);
      }
      return !player.getStorage("xunyi").length && (event.name !== "phase" || game.phaseNumber === 0);
    },
    async cost(event, trigger, player) {
      player.removeSkill("xunyi_effect");
      let prompt = trigger.name === "die" ? "是否令一名其他角色获得“义”？" : "令一名其他角色获得“义”";
      event.result = await player.chooseTarget(lib.filter.notMe, "殉义", prompt, trigger.name !== "die").set("ai", (target) => {
        let player2 = _status.event.player;
        return Math.max(1 + get.attitude(player2, target) * get.threaten(target), Math.random());
      }).forResult();
    },
    async content(event, trigger, player) {
      player.markAuto("xunyi", event.targets);
      player.addSkill("xunyi_effect");
    },
    subSkill: {
      effect: {
        audio: "xunyi",
        trigger: {
          global: ["damageSource", "damageEnd"]
        },
        forced: true,
        charlotte: true,
        onremove(player) {
          player.unmarkAuto("xunyi", player.getStorage("xunyi"));
        },
        getIndex(event) {
          return event.num;
        },
        filter(event, player, name) {
          if (!player.getStorage("xunyi").length) {
            return false;
          }
          let viewer = event[name === "damageEnd" ? "player" : "source"];
          let list = player.getStorage("xunyi").concat([player]);
          if (!list.includes(viewer)) {
            return false;
          }
          let target = list.find((current) => current !== viewer);
          if (!target || name === "damageEnd" && !target.countCards("he")) {
            return false;
          }
          return target.isIn() && target !== event[name !== "damageEnd" ? "player" : "source"];
        },
        logTarget(event, player, name) {
          return player.getStorage("xunyi")[0];
        },
        async content(event, trigger, player) {
          const bool = event.triggername === "damageEnd";
          let viewer = trigger[bool ? "player" : "source"];
          let target = viewer === player ? event.targets[0] : player;
          if (bool) {
            await target.chooseToDiscard("he", true);
          } else {
            await target.draw();
          }
        }
      }
    }
  },
  //狗剩
  reduoji: {
    audio: "duoji",
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hasCards("he");
    },
    filterCard: true,
    position: "he",
    filterTarget: lib.filter.notMe,
    discard: false,
    toStorage: true,
    delay: false,
    check(card) {
      return 3 - get.value(card);
    },
    async content(event, trigger, player) {
      const cards2 = event.cards;
      const target = event.target;
      player.$give(cards2[0], target, false);
      target.markAuto("reduoji", cards2);
      game.log(player, "将", cards2[0], "放在了", target, "的武将牌上");
      await game.delay();
    },
    group: ["reduoji_equip", "reduoji_gain"],
    intro: {
      content: "cards",
      onunmark: "throw"
    },
    ai: {
      order: 1,
      result: { target: -1 }
    },
    subSkill: {
      equip: {
        audio: "duoji",
        trigger: { global: "equipAfter" },
        forced: true,
        filter(event, player) {
          if (player === event.player || !event.player.getStorage("reduoji").length || !event.player.getCards("e").includes(event.card)) {
            return false;
          }
          const evt = event.getParent(2);
          return evt?.name === "useCard" && evt.player === event.player;
        },
        logTarget: "player",
        async content(event, trigger, player) {
          await player.gain(trigger.card, trigger.player, "give", "bySelf");
          const target = trigger.player;
          const storage = target.getStorage("reduoji");
          if (storage.length) {
            const card = storage[0];
            target.$throw(card, 1e3);
            target.unmarkAuto("reduoji", [card]);
            game.log(target, "移去了", card);
            await game.cardsDiscard(card);
            await target.draw();
          }
        }
      },
      gain: {
        audio: "duoji",
        trigger: { global: "phaseEnd" },
        forced: true,
        filter(event, player) {
          return event.player.getStorage("reduoji").length > 0;
        },
        logTarget: "player",
        async content(event, trigger, player) {
          const target = trigger.player;
          const cards2 = target.storage.reduoji;
          target.$give(cards2, player);
          await player.gain(cards2, "fromStorage");
          cards2.length = 0;
          target.unmarkSkill("reduoji");
          await game.delay();
        }
      }
    }
  },
  //SP辛毗
  spyinju: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const target = event.target;
      const result2 = await target.chooseToUse({
        prompt: `引裾：对${get.translation(player)}使用一张杀，或跳过下回合的出牌阶段和弃牌阶段`,
        filterCard(card, player2, event2) {
          if (get.name(card) !== "sha") {
            return false;
          }
          return lib.filter.filterCard(card, player2, event2);
        },
        filterTarget(card, player2, target2) {
          if (target2 !== _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
            return false;
          }
          return lib.filter.targetEnabled(card, player2, target2);
        }
      }).set("targetRequired", true).set("complexSelect", true).set("complexTarget", true).set("sourcex", player).forResult();
      if (result2.bool) {
        return;
      }
      target.addSkill("spyinju2");
    },
    ai: {
      order: 1,
      expose: 0.2,
      result: {
        target: -1.5,
        player(player, target) {
          if (!target.canUse("sha", player)) {
            return 0;
          }
          if (target.countCards("h") === 0) {
            return 0;
          }
          if (target.countCards("h") === 1) {
            return -0.1;
          }
          if (player.countCards("h", "shan") === 0) {
            return -1;
          }
          if (player.hp < 2) {
            return -2;
          }
          return -0.5;
        }
      },
      threaten: 1.1
    }
  },
  spyinju2: {
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    charlotte: true,
    sourceSkill: "spyinju",
    async content(event, trigger, player) {
      player.skip("phaseUse");
      player.skip("phaseDiscard");
      player.removeSkill("spyinju2");
      game.log(player, "跳过了出牌阶段");
      game.log(player, "跳过了弃牌阶段");
    },
    mark: true,
    intro: { content: "衣襟被拽住了，下个准备阶段开始时跳过出牌阶段和弃牌阶段" }
  },
  spchijie: {
    audio: 2,
    trigger: { target: "useCardToTarget" },
    usable: 1,
    filter(event, player) {
      return event.player !== player && event.targets.length === 1;
    },
    check(event, player) {
      return get.effect(player, event.card, event.player, player) < 0;
    },
    async content(event, trigger, player) {
      const result2 = await player.judge({
        judge(card) {
          return get.number(card) > 6 ? 2 : 0;
        },
        judge2(result3) {
          return result3.bool;
        }
      }).forResult();
      if (!result2.bool) {
        return;
      }
      trigger.targets.length = 0;
      trigger.getParent().triggeredTargets2.length = 0;
      trigger.cancel();
    }
  },
  //糜夫人
  spcunsi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return !player.isTurnedOver();
    },
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const { target } = event;
      await player.turnOver();
      const card = get.cardPile((card2) => card2.name === "sha");
      if (card) {
        await target.gain({
          cards: [card],
          animate: "gain2"
        });
      }
      target.addSkill("spcunsi2");
      target.addMark("spcunsi2", 1, false);
    },
    ai: {
      order: 1,
      result: {
        target(player, target) {
          const card = { name: "sha", isCard: true };
          if (!target.hasSkillTag("nogain") && game.hasPlayer(
            (current) => get.attitude(target, current) < 0 && !current.hasShan() && target.canUse(card, current) && !current.hasSkillTag("filterDamage", null, {
              player: target,
              card,
              jiu: true
            }) && get.effect(current, card, target) > 0
          )) {
            return 4;
          }
          return 0;
        }
      }
    }
  },
  spcunsi2: {
    charlotte: true,
    trigger: { player: "useCard1" },
    firstDo: true,
    forced: true,
    popup: false,
    onremove: true,
    sourceSkill: "spcunsi",
    filter(event, player) {
      return event.card.name === "sha";
    },
    async content(event, trigger, player) {
      trigger.baseDamage += player.countMark("spcunsi2");
      player.removeSkill("spcunsi2");
    },
    marktext: "嗣",
    intro: {
      content: "下一张【杀】的伤害+#"
    }
  },
  spguixiu: {
    trigger: { player: "damageEnd" },
    forced: true,
    filter(event, player) {
      if (typeof event.spguixiu === "boolean" && !event.spguixiu) {
        return false;
      }
      return player.isTurnedOver();
    },
    async content(event, trigger, player) {
      await player.turnOver();
    },
    group: ["spguixiu_draw", "spguixiu_count"],
    subSkill: {
      count: {
        trigger: { player: "damageBegin2" },
        lastDo: true,
        silent: true,
        async content(event, trigger, player) {
          event.spguixiu = player.isTurnedOver();
        }
      },
      draw: {
        trigger: { player: "turnOverAfter" },
        forced: true,
        filter(event, player) {
          return !player.isTurnedOver();
        },
        async content(event, trigger, player) {
          await player.draw();
        }
      }
    }
  },
  //那个男人的舅舅
  heji: {
    audio: 2,
    trigger: { global: "useCardAfter" },
    direct: true,
    locked: false,
    filter(event, player) {
      if (event.targets.length !== 1 || event.targets[0] === player || event.targets[0].isDead()) {
        return false;
      }
      if (event.card.name !== "juedou" && (event.card.name !== "sha" || get.color(event.card) !== "red")) {
        return false;
      }
      if (_status.connectMode && player.countCards("h") > 0) {
        return true;
      }
      return player.hasSha() || player.hasUsableCard("juedou");
    },
    clearTime: true,
    async content(event, trigger, player) {
      await player.chooseToUse(
        (card, player2, event2, ...args) => {
          let name = get.name(card);
          if (name !== "sha" && name !== "juedou") {
            return false;
          }
          return lib.filter.cardEnabled(card, player2, event2, ...args);
        },
        `合击：是否对${get.translation(trigger.targets[0])}使用一张【杀】或【决斗】？`
      ).set("logSkill", "heji").set("complexSelect", true).set("filterTarget", (card, player2, target, ...args) => {
        if (target !== _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
          return false;
        }
        return lib.filter.targetEnabled(card, player2, target, ...args);
      }).set("sourcex", trigger.targets[0]).set("addCount", false);
    },
    group: "heji_gain",
    subSkill: {
      gain: {
        trigger: { player: "useCard" },
        forced: true,
        popup: false,
        filter(event, player) {
          return event.card.isCard && event.getParent(2).name === "heji";
        },
        async content(event, trigger, player) {
          const card = get.cardPile2((card2) => get.color(card2, false) === "red", "random");
          if (card) {
            await player.gain(card, "gain2");
          }
        }
      }
    },
    mod: {
      aiOrder(player, card, num) {
        if (get.name(card, player) === "sha" && get.color(card, player) === "red") {
          return num + 0.6 * (_status.event.name === "chooseToUse" && player.hasHistory("useCard", (evt) => evt.card.name === "sha" && evt.cards.length === 1) ? 1 : -1);
        }
      }
    }
  },
  //始计篇·智
  refubi: {
    audio: "fubi",
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    filter(event, player) {
      return event.name !== "phase" || game.phaseNumber === 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2("refubi"),
        filterTarget: lib.filter.notMe,
        ai(target) {
          return 1 + get.attitude(_status.event.player, target);
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      target.addMark("refubi", 1);
    },
    intro: {
      content(info, player) {
        let str = "已获得“辅弼”标记";
        if (player.storage.refubi_effect0) {
          str = `${str}；本回合使用【杀】的次数上限+${player.storage.refubi_effect0}`;
        }
        if (player.storage.refubi_effect1) {
          str = `${str}；本回合的0手牌上限+${player.storage.refubi_effect1 * 3}`;
        }
        return str;
      }
    },
    marktext: "弼",
    group: "refubi_buff",
    subSkill: {
      buff: {
        trigger: { global: "phaseZhunbeiBegin" },
        filter(event, player) {
          return event.player !== player && event.player.hasMark("refubi");
        },
        async cost(event, trigger, player) {
          const target = trigger.player;
          const name = get.translation(target);
          const result2 = await player.chooseControl({
            controls: ["cancel2"],
            choiceList: [`令${name}本回合使用【杀】的次数上限+1`, `令${name}本回合的手牌上限+3`],
            ai() {
              const player2 = _status.event.player;
              const target2 = _status.event.getTrigger().player;
              if (get.attitude(player2, target2) <= 0) {
                return "cancel2";
              }
              if (!target2.hasJudge("lebu") && target2.countCards("h", (card) => get.name(card, target2) === "sha" && target2.hasValueTarget(card)) > target2.getCardUsable("sha")) {
                return 0;
              }
              return 1;
            }
          }).forResult();
          event.result = {
            bool: result2.control !== "cancel2",
            targets: [target],
            cost_data: {
              skill: `refubi_effect${result2.index}`
            }
          };
        },
        async content(event, trigger, player) {
          const target = trigger.player;
          const { skill } = event.cost_data;
          target.addTempSkill(skill);
          target.addMark(skill, 1, false);
          game.log(target, ["本回合使用【杀】的次数上限+1", "本回合的手牌上限+3"][result.index]);
        }
      },
      effect0: {
        onremove: true,
        mod: {
          cardUsable(card, player, num) {
            if (card.name === "sha") {
              return num + player.countMark("refubi_effect0");
            }
          }
        }
      },
      effect1: {
        onremove: true,
        mod: {
          maxHandcard(player, num) {
            return num + 3 * player.countMark("refubi_effect1");
          }
        }
      }
    }
  },
  rezuici: {
    audio: "zuici",
    enable: "chooseToUse",
    filter(event, player) {
      if (event.type === "phase" || event.type === "dying" && player === event.dying) {
        return player.isDamaged() && player.hasCards("e");
      }
      return false;
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("###罪辞###选择废除一个有牌的装备栏，然后回复2点体力，并可移动“辅弼”标记。");
      },
      chooseControl(event, player) {
        const list = [];
        for (let i = 1; i < 6; i++) {
          if (player.getEquips(i).length > 0) {
            list.push(`equip${i}`);
          }
        }
        list.push("cancel2");
        return list;
      },
      check(event, player) {
        if (player.hp > 1 && player.getDamagedHp() < 2) {
          return "cancel2";
        }
        const cards2 = player.getCards("e").sort((a, b) => get.value(a) - get.value(b));
        const sub = get.subtype(cards2[0], false);
        if (player.hp < 1) {
          return sub;
        }
        const val = get.value(cards2[0]);
        if (val < 0) {
          return sub;
        }
        return val < 4 ? sub : "cancel2";
      },
      backup(result2) {
        const next = get.copy(lib.skill.rezuicix);
        next.position = result2.control;
        return next;
      }
    },
    ai: {
      order: 2.7,
      result: {
        player: 1
      },
      save: true,
      skillTagFilter(player, tag, arg) {
        return player === arg;
      }
    }
  },
  rezuicix: {
    audio: "zuici",
    sourceSkill: "rezuici",
    async content(event, trigger, player) {
      await player.disableEquip(lib.skill.rezuici_backup.position);
      await player.recover(2);
      let hasRefubi = false;
      let hasTarget = false;
      for (const current of game.players) {
        if (current.hasMark("refubi")) {
          hasRefubi = true;
        } else if (current !== player) {
          hasTarget = true;
        }
        if (hasRefubi && hasTarget) {
          break;
        }
      }
      if (!hasRefubi || !hasTarget) {
        return;
      }
      const result2 = await player.chooseTarget({
        prompt: "是否转移“辅弼”标记？",
        filterTarget(card, player2, target2) {
          return target2 !== player2 && !target2.hasMark("refubi");
        },
        ai(target2) {
          const player2 = get.player();
          const attitude = get.attitude(player2, target2);
          return Math.min(attitude, attitude - get.event().preatt);
        }
      }).set(
        "preatt",
        get.attitude(
          player,
          game.findPlayer((current) => current.hasMark("refubi"))
        )
      ).forResult();
      if (!result2.bool) {
        return;
      }
      const target = result2.targets[0];
      player.line(target, "group");
      for (const current of game.filterPlayer()) {
        const num = current.countMark("refubi");
        if (num) {
          current.removeMark("refubi", 1, false);
        }
      }
      target.addMark("refubi", 1);
    },
    ai: {
      result: {
        player: 1
      }
    }
  },
  reshengxi: {
    audio: "shengxi",
    audioname: ["feiyi"],
    trigger: { player: "phaseJieshuBegin" },
    frequent: true,
    preHidden: true,
    filter(event, player) {
      return !player.getHistory("sourceDamage").length;
    },
    async content(event, trigger, player) {
      await player.draw(2);
    }
  },
  fyjianyu: {
    initSkill(skill) {
      if (!lib.skill[skill]) {
        lib.skill[skill] = {
          marktext: "喻",
          intro: {
            markcount: () => 1,
            content: "指定另一名有“喻”的角色为目标时，其摸一张牌"
          }
        };
        lib.translate[skill] = "谏喻";
        lib.translate[`${skill}_bg`] = "喻";
      }
    },
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return game.countPlayer((current) => !current.hasMark(`fyjianyu_${player.playerid}`)) > 1;
    },
    round: 1,
    filterTarget(card, player, target) {
      return !target.hasMark(`fyjianyu_${player.playerid}`);
    },
    selectTarget: 2,
    async content(event, trigger, player) {
      const target = event.target;
      const skill = `fyjianyu_${player.playerid}`;
      game.broadcastAll(lib.skill.fyjianyu.initSkill, skill);
      player.addTempSkill("fyjianyu_draw", { player: "phaseBegin" });
      target.addMark(skill, 1);
    },
    ai: {
      order: 0.1,
      result: {
        target(player, target) {
          if (!ui.selected.targets.length) {
            return target === player ? 1 : 0;
          }
          if (get.attitude(player, target) < 0) {
            return -1.6 * (1 + target.countCards("h", (card) => target.hasValueTarget(card) && get.effect(player, card, target, target) > 0) * Math.sqrt(target.countCards("h")));
          }
          return 0.3 * (1 + target.countCards("h", (card) => target.hasValueTarget(card) && get.effect(player, card, target, target) > 0) * Math.sqrt(target.countCards("h")));
        }
      }
    },
    subSkill: {
      draw: {
        audio: "fyjianyu",
        charlotte: true,
        trigger: { global: "useCardToPlayer" },
        filter(event, player) {
          if (!event.player.isPhaseUsing()) {
            return false;
          }
          return event.player !== event.target && event.player.hasMark(`fyjianyu_${player.playerid}`) && event.target.hasMark(`fyjianyu_${player.playerid}`) && event.target.isIn();
        },
        forced: true,
        logTarget: "target",
        async content(event, trigger, player) {
          await trigger.target.draw();
        },
        onremove(player) {
          game.countPlayer((current) => {
            let num = current.countMark(`fyjianyu_${player.playerid}`);
            if (num) {
              current.removeMark(`fyjianyu_${player.playerid}`);
            }
          });
        }
      }
    }
  },
  spwanwei: {
    audio: 2,
    enable: "chooseToUse",
    round: 1,
    filter(event, player) {
      if (player.hp < 1) {
        return false;
      }
      if (event.type === "dying") {
        return event.dying !== player;
      }
      if (event.type !== "phase") {
        return false;
      }
      return game.hasPlayer((current) => current !== player && current.isDamaged());
    },
    filterTarget(card, player, target) {
      if (_status.event.type === "dying") {
        return target === _status.event.dying;
      }
      return player !== target && target.isDamaged();
    },
    selectTarget() {
      if (_status.event.type === "dying") {
        return -1;
      }
      return 1;
    },
    prompt(event, player) {
      const num = player.getHp();
      if (event.type === "dying") {
        const target = event.dying;
        return `令${get.translation(target)}回复${Math.max(num + 1, 1 - target.hp)}点体力，然后你失去${num}点体力`;
      }
      return `令一名其他角色回复${num + 1}点体力（至少回复至1），然后你失去${num}点体力`;
    },
    manualConfirm: true,
    async content(event, trigger, player) {
      const target = event.targets[0];
      const num = player.getHp();
      await target.recover(Math.max(num + 1, 1 - target.hp));
      await player.loseHp(num);
    },
    ai: {
      save: true,
      skillTagFilter(player, tag, target) {
        return player !== target;
      },
      expose: 0.5,
      order: 6,
      result: {
        target(player, target) {
          if (get.attitude(player, target) < 4) {
            return 0;
          }
          if ((!player.hasSkill("spyuejian") || player.countCards("he") < 2) && !player.hasCards("hs", (card) => player.canSaveCard(card, player))) {
            return 0;
          }
          if (_status.event.type !== "dying") {
            const num = player.getHp();
            if (target.getDamagedHp() < 2) {
              return 0;
            }
            return Math.max(num + 1, 1 - target.hp);
          }
          return 1;
        }
      }
    }
  },
  spyuejian: {
    mod: {
      maxHandcardBase(player) {
        return player.maxHp;
      }
    },
    locked: false,
    audio: 2,
    trigger: { player: "dying" },
    filter(event, player) {
      return player.countCards("he") > 1;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard("he", 2, get.prompt(event.skill), "弃置两张牌，然后回复1点体力", "chooseonly").set("ai", (card) => 1 / Math.max(0.1, get.value(card))).forResult();
    },
    async content(event, trigger, player) {
      await player.discard(event.cards);
      await player.recover();
    }
  },
  spwuku: {
    audio: 2,
    trigger: { global: "useCard" },
    forced: true,
    preHidden: true,
    filter(event, player) {
      if (get.type(event.card) !== "equip") {
        return false;
      }
      let gz = get.mode() === "guozhan";
      if (gz && event.player.isFriendOf(player)) {
        return false;
      }
      return player.countMark("spwuku") < (gz ? 2 : 3);
    },
    async content(event, trigger, player) {
      player.addMark("spwuku", 1);
    },
    marktext: "库",
    intro: {
      content: "mark"
    },
    ai: {
      combo: "spmiewu",
      threaten: 3.6
    }
  },
  spsanchen: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "gray",
    filter(event, player) {
      return player.countMark("spwuku") > 2;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.gainMaxHp();
      await player.recover();
      player.addSkills("spmiewu");
    },
    ai: {
      combo: "spwuku"
    },
    derivation: "spmiewu"
  },
  spmiewu: {
    audio: 2,
    enable: ["chooseToUse", "chooseToRespond"],
    filter(event, player) {
      if (!player.countMark("spwuku") || !player.countCards("hse") || player.hasSkill("spmiewu_used")) {
        return false;
      }
      return get.inpileVCardList((info) => {
        if (!["basic", "trick", "delay"].includes(info[0])) {
          return false;
        }
        return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
      }).length;
    },
    chooseButton: {
      dialog(event, player) {
        const list = get.inpileVCardList((info) => {
          if (!["basic", "trick", "delay"].includes(info[0])) {
            return false;
          }
          return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
        });
        return ui.create.dialog("灭吴", [list, "vcard"]);
      },
      check(button) {
        if (_status.event.getParent().type !== "phase") {
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
          filterCard: true,
          audio: "spmiewu",
          popname: true,
          check(card) {
            return 8 - get.value(card);
          },
          position: "hse",
          viewAs: { name: links[0][2], nature: links[0][3] },
          log: false,
          async precontent(event, trigger, player2) {
            player2.when({ player: ["useCardAfter", "respondAfter"] }).filter((evt) => evt.getParent() === event.getParent()).step(async (event2, trigger2, player3) => {
              await player3.draw();
            });
            player2.addTempSkill("spmiewu_used");
            player2.logSkill("spmiewu");
            player2.removeMark("spwuku", 1);
          }
        };
      },
      prompt(links, player) {
        return `将一张牌当做${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}使用`;
      }
    },
    hiddenCard(player, name) {
      if (!lib.inpile.includes(name)) {
        return false;
      }
      const type = get.type2(name);
      return ["basic", "trick"].includes(type) && player.countMark("spwuku") > 0 && !player.hasSkill("spmiewu_used");
    },
    ai: {
      combo: "spwuku",
      fireAttack: true,
      respondSha: true,
      respondShan: true,
      skillTagFilter(player) {
        if (!player.countMark("spwuku") || !player.countCards("hse") || player.hasSkill("spmiewu_used")) {
          return false;
        }
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
      used: { charlotte: true }
    }
  },
  qinzheng: {
    audio: 2,
    trigger: { player: ["useCard", "respond"] },
    forced: true,
    filter(event, player) {
      let num = player.getAllHistory("useCard").length + player.getAllHistory("respond").length;
      return num % 3 === 0 || num % 5 === 0 || num % 8 === 0;
    },
    async content(event, trigger, player) {
      let num = player.getAllHistory("useCard").length + player.getAllHistory("respond").length;
      let cards2 = [];
      if (num % 3 === 0) {
        const card = get.cardPile2((card2) => card2.name === "sha" || card2.name === "shan");
        if (card) {
          cards2.push(card);
        }
      }
      if (num % 5 === 0) {
        const card = get.cardPile2((card2) => ["tao", "jiu", "zong", "xionghuangjiu"].includes(card2.name));
        if (card) {
          cards2.push(card);
        }
      }
      if (num % 8 === 0) {
        const card = get.cardPile2((card2) => ["juedou", "wuzhong", "zengbin", "sadouchengbing", "dongzhuxianji", "tongzhougongji"].includes(card2.name));
        if (card) {
          cards2.push(card);
        }
      }
      if (cards2.length) {
        player.gain(cards2, "gain2");
      }
    },
    group: "qinzheng_count",
    intro: {
      content(num) {
        let str = "<li>总次数：";
        str += num;
        str += "<br><li>杀/闪：";
        str += num % 3;
        str += "/3<br><li>桃/酒：";
        str += num % 5;
        str += "/5<br><li>决斗/无中生有：";
        str += num % 8;
        str += "/8";
        return str;
      }
    }
  },
  qinzheng_count: {
    trigger: { player: ["useCard1", "respond"] },
    silent: true,
    firstDo: true,
    noHidden: true,
    sourceSkill: "qinzheng",
    async content(event, trigger, player) {
      player.storage.qinzheng = player.getAllHistory("useCard").length + player.getAllHistory("respond").length;
      player.markSkill("qinzheng");
    }
  },
  spqiai: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hasCards("he", (card) => get.type(card) !== "basic");
    },
    filterCard(card) {
      return get.type(card) !== "basic";
    },
    position: "he",
    filterTarget: lib.filter.notMe,
    delay: false,
    discard: false,
    lose: false,
    check(card) {
      const player = _status.event.player;
      if (get.position(card) === "e" && card.name === "jinhe") {
        return 10;
      }
      if (player.isHealthy()) {
        return 7 - get.value(card);
      }
      return 9 - get.value(card);
    },
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      await player.give(cards2, target, true);
      if (!target.isIn()) {
        return;
      }
      if (player.isHealthy()) {
        await player.draw(2);
        return;
      }
      const result2 = await target.chooseControl({
        choiceList: [`令${get.translation(player)}回复1点体力`, `令${get.translation(player)}摸两张牌`]
      }).forResult();
      if (result2.index === 0) {
        await player.recover();
        return;
      }
      await player.draw(2);
    },
    ai: {
      order: 8,
      result: {
        player: 1,
        target(player, target) {
          if (ui.selected.cards.length) {
            const card = ui.selected.cards[0];
            const val = get.value(card, target);
            if (val < 0) {
              return -1;
            }
            if (target.hasSkillTag("nogain")) {
              return 0;
            }
            const useval = target.getUseValue(card);
            if (val < 1 || useval <= 0) {
              return 0.1;
            }
            return Math.sqrt(useval);
          }
          return 0;
        }
      }
    }
  },
  spshanxi: {
    audio: 2,
    init(player) {
      game.addGlobalSkill("spshanxi_bj");
    },
    onremove(player) {
      if (!game.hasPlayer((current) => current.hasSkill("spshanxi", null, null, false), true)) {
        game.removeGlobalSkill("spshanxi_bj");
      }
    },
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => current !== player && !current.hasMark("spshanxi"));
    },
    async cost(event, trigger, player) {
      let eff = 0;
      const target = game.findPlayer((current) => current !== player && current.hasMark("spshanxi"));
      if (target) {
        eff = -get.attitude(player, target) / Math.sqrt(Math.max(1, target.hp));
      }
      event.result = await player.chooseTarget({
        prompt: get.prompt("spshanxi"),
        prompt2: "令一名其他角色获得“檄”",
        filterTarget(card, player2, target2) {
          return target2 !== player2 && !target2.hasMark("spshanxi");
        },
        ai(target2) {
          return -get.attitude(_status.event.player, target2) / Math.sqrt(Math.max(1, target2.hp)) - eff;
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      for (const current of game.filterPlayer()) {
        if (current === target) {
          current.addMark("spshanxi", 1);
          continue;
        }
        const num = current.countMark("spshanxi");
        if (num > 0) {
          current.removeMark("spshanxi", num);
        }
      }
    },
    marktext: "檄",
    intro: {
      name2: "檄",
      content: "已被设下索命檄文"
    },
    group: "spshanxi_suoming",
    ai: { threaten: 3.3 }
  },
  spshanxi_suoming: {
    audio: "spshanxi",
    trigger: { global: "recoverAfter" },
    forced: true,
    sourceSkill: "spshanxi",
    filter(event, player) {
      return event.player.hasMark("spshanxi") && event.player.hp > 0;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const target = trigger.player;
      if (target.countCards("he") < 2) {
        await target.loseHp();
        return;
      }
      const result2 = await target.chooseCard({
        prompt: `交给${get.translation(player)}两张牌，或失去1点体力`,
        selectCard: 2,
        position: "he",
        ai(card) {
          return 9 - get.value(card);
        }
      }).forResult();
      if (!result2.bool || !result2.cards?.length) {
        await target.loseHp();
        return;
      }
      await target.give(result2.cards, player);
    }
  },
  spshanxi_bj: {
    trigger: { player: "dieAfter" },
    sourceSkill: "spshanxi",
    filter(event, player) {
      for (const i of game.players) {
        if (i.hasSkill("spshanxi_suoming", null, null, false)) {
          return false;
        }
      }
      return true;
    },
    silent: true,
    forceDie: true,
    charlotte: true,
    async content(event, trigger, player) {
      game.removeGlobalSkill("spshanxi_bj");
    },
    ai: {
      effect: {
        target(card, player, target) {
          const suoming = game.findPlayer((current) => current.hasSkill("spshanxi_suoming"));
          if (suoming && _status.event && target === _status.event.dying && target.hasMark("spshanxi")) {
            if (target.countCards("he") < 2) {
              return "zerotarget";
            }
            return [1, get.attitude(target, suoming) > 0 ? 0 : -1.2];
          }
        }
      }
    }
  },
  shameng: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      let hs = player.getCards("h");
      if (hs.length < 2) {
        return false;
      }
      let red = 0;
      let black = 0;
      for (const i of hs) {
        if (get.color(i, player) === "red") {
          red++;
        } else {
          black++;
        }
        if (red > 1 || black > 1) {
          return true;
        }
      }
      return false;
    },
    complexCard: true,
    selectCard: 2,
    filterCard(card, player) {
      if (ui.selected.cards.length) {
        return get.color(card, player) === get.color(ui.selected.cards[0], player);
      }
      let color = get.color(card, player);
      return player.countCards("h", (cardx) => cardx !== card && color === get.color(cardx, player)) > 0;
    },
    filterTarget: lib.filter.notMe,
    check(card) {
      return 7 - get.value(card);
    },
    position: "h",
    async content(event, trigger, player) {
      const target = event.target;
      await target.draw(2);
      await player.draw(3);
    },
    ai: {
      order: 6,
      result: { target: 2 }
    }
  },
  fubi: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    skillAnimation: true,
    animationColor: "wood",
    filter(event, player) {
      return event.name !== "phase" || game.phaseNumber === 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2("fubi"),
        filterTarget: lib.filter.notMe,
        ai(target) {
          return get.attitude(_status.event.player, target);
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      target.addSkill("fubi2");
      target.storage.fubi2.push(player);
    }
  },
  fubi2: {
    init(player, skill) {
      if (!player.storage[skill]) {
        player.storage[skill] = [];
      }
    },
    mod: {
      maxHandcard(player, num) {
        const list = player.getStorage("fubi2");
        for (const i of list) {
          if (i.isIn()) {
            num += 3;
          }
        }
        return num;
      }
    },
    mark: true,
    intro: { content: "若$存活，则手牌上限+3" }
  },
  zuici: {
    audio: 2,
    trigger: { player: "dying" },
    filter(event, player) {
      return player.hasCards("e");
    },
    async cost(event, trigger, player) {
      const types = player.getCards("e").map((card) => get.subtype(card)).toUniqued();
      types.push("cancel2");
      const result2 = await player.chooseControl({
        prompt: get.prompt2("zuici"),
        controls: types
      }).forResult();
      event.result = {
        bool: result2.control !== "cancel2",
        cost_data: {
          type: result2.control
        }
      };
    },
    async content(event, trigger, player) {
      const { type } = event.cost_data;
      await player.disableEquip(type);
      if (player.hp < 1) {
        await player.recover(1 - player.hp);
      }
    }
  },
  jianzhan: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => lib.skill.jianzhan.filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      if (target === player) {
        return false;
      }
      if (ui.selected.targets.length) {
        const targetx = ui.selected.targets[0];
        return targetx !== target && targetx.countCards("h") > target.countCards("h") && targetx.inRange(target);
      }
      const num = target.countCards("h");
      return game.hasPlayer((current) => current !== target && current !== player && current.countCards("h") < num && target.inRange(current));
    },
    selectTarget: 2,
    complexTarget: true,
    targetprompt: ["出杀", "被出杀"],
    multitarget: true,
    async content(event, trigger, player) {
      const targets = event.targets;
      if (!targets[0].canUse("sha", targets[1])) {
        await player.draw();
        return;
      }
      const result2 = await targets[0].chooseControl({
        choiceList: [`视为对${get.translation(targets[1])}使用一张【杀】`, `令${get.translation(player)}摸一张牌`],
        ai() {
          const effect = get.effect(targets[1], { name: "sha", isCard: true }, targets[0], targets[0]);
          if (effect > 0) {
            return 0;
          }
          if (effect < 0 || get.attitude(targets[0], player) > 1) {
            return 1;
          }
          return 0;
        }
      }).forResult();
      if (result2.index === 0) {
        await targets[0].useCard({
          card: get.autoViewAs({ name: "sha", isCard: true }),
          targets: [targets[1]],
          addCount: false
        });
        return;
      }
      await player.draw();
    },
    ai: {
      result: {
        target(player, target) {
          if (ui.selected.targets.length) {
            const from = ui.selected.targets[0];
            return get.effect(target, { name: "sha" }, from, target);
          }
          const effs = [0, 0];
          for (const current of game.filterPlayer()) {
            if (current !== target && target.canUse("sha", current)) {
              const effect = get.effect(current, { name: "sha" }, target, target);
              if (effect > effs[0]) {
                effs[0] = effect;
              }
              if (effect < effs[1]) {
                effs[1] = effect;
              }
            }
          }
          return effs[get.attitude(player, target) > 0 ? 0 : 1];
        }
      },
      order: 8.5,
      expose: 0.2
    }
  },
  duoji: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    filter(event, player) {
      return player.countCards("h") > 1 && game.hasPlayer((current) => current !== player && current.countGainableCards(player, "e") > 0);
    },
    filterCard: true,
    selectCard: 2,
    filterTarget(card, player, target) {
      return target !== player && target.countGainableCards(player, "e") > 0;
    },
    check(card) {
      return 8 - get.value(card);
    },
    position: "h",
    skillAnimation: true,
    animationColor: "metal",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const target = event.target;
      const cards2 = target.getGainableCards(player, "e");
      await player.gain(cards2, target, "give", "bySelf");
    },
    ai: {
      order: 1,
      result: {
        target(player, target) {
          let num = 0;
          let es = target.getCards("e");
          let val = 0;
          for (const i of es) {
            num += get.value(i, target);
          }
          for (const i of ui.selected.cards) {
            val += get.value(i, player);
          }
          if (Math.abs(num) > val) {
            return -num;
          }
          return 0;
        }
      }
    }
  }
};
const translates = {
  mbdingyi: "定仪",
  mbdingyi_info: "锁定技，游戏开始时，你选择一项并令任意名角色获得对应效果：1.摸牌阶段摸牌数+1；2.手牌上限+2；3.攻击范围+1；4.脱离濒死状态时回复1点体力。",
  mbzuici: "罪辞",
  mbzuici_info: `每回合限一次，你受到伤害后，可令一名有“定仪”效果的角色从牌堆获得一个你指定的${get.poptip("rule_zhinang")}，然后移去其所有“定仪”效果。`,
  mbfubi: "辅弼",
  mbfubi_info: "出牌阶段限一次，你可选择一名角色并选择一项：1.令其获得一个其未拥有的“定仪”效果；2.令其全部“定仪”效果翻倍至你的下个出牌阶段开始。",
  sp_dongzhao_prefix: "手杀",
  liuba_prefix: "手杀",
  sp_zhujun_prefix: "手杀",
  sp_huangfusong_prefix: "手杀",
  sp_zhangchangpu_prefix: "手杀",
  sp_cuiyan_prefix: "手杀",
  sp_huaman_prefix: "手杀",
  sp_gaolan_prefix: "手杀",
  sunyi_prefix: "手杀",
  sp_wangshuang_prefix: "手杀",
  sp_zongyu_prefix: "手杀",
  db_wenyang_prefix: "手杀",
  sp_yanghu_prefix: "手杀",
  sp_zhangwen_prefix: "手杀",
  sp_xujing_prefix: "手杀",
  sp_huaxin_prefix: "手杀",
  zhouchu_prefix: "手杀",
  sp_mifuren_prefix: "手杀",
  sp_xinpi_prefix: "手杀",
  sp_bianfuren_prefix: "手杀",
  sp_duyu_prefix: "手杀",
  luotong_prefix: "手杀",
  sp_wangcan_prefix: "手杀",
  sp_sunshao_prefix: "手杀",
  sp_xunchen_prefix: "手杀",
  sp_kongrong_prefix: "手杀",
  sp_wangcan: "手杀王粲",
  spqiai: "七哀",
  spqiai_info: "出牌阶段限一次，你可以将一张非基本牌交给一名其他角色。然后其选择一项：①你回复1点体力。②你摸两张牌。",
  spshanxi: "善檄",
  spshanxi_suoming: "善檄",
  spshanxi_info: "出牌阶段开始时，你可令一名其他角色获得“檄”标记并清除场上已有的其他“檄”标记（若有）。有“檄”标记的角色回复体力时，若其体力值大于0，则其需选择一项：①交给你两张牌。②失去1点体力。",
  sp_chenzhen: "陈震",
  shameng: "歃盟",
  shameng_info: "出牌阶段限一次，你可弃置两张颜色相同的手牌并选择一名其他角色。其摸两张牌，然后你摸三张牌。",
  sp_sunshao: "手杀孙邵",
  fubi: "辅弼",
  fubi2: "辅弼",
  fubi_info: "游戏开始时，你可选择一名其他角色。该角色的手牌上限于你死亡前+3。",
  zuici: "罪辞",
  zuici_info: "当你进入濒死状态时，你可废除你的一个不为空的装备栏，然后将体力值回复至1点。",
  sp_xunchen: "手杀荀谌",
  jianzhan: "谏战",
  jianzhan_info: "出牌阶段限一次，你可选择一名其他角色A和其攻击范围内的另一名手牌数小于其的角色B。A选择一项：①视为对B使用一张【杀】。②令你摸一张牌。",
  duoji: "夺冀",
  duoji_info: "限定技，出牌阶段，你可弃置两张手牌并选择一名装备区有牌的其他角色。你获得其装备区里的所有牌。",
  binglinchengxiax: "兵临城下",
  binglinchengxiax_info: "出牌阶段，对一名其他角色使用。你亮出牌堆顶的四张牌，依次对其使用其中所有的【杀】，然后将剩余的牌置于牌堆顶。",
  mjweipo: "危迫",
  mjweipo_effect: "危迫",
  mjweipo_remove: "危迫",
  mjweipo_info: "每回合限一次，出牌阶段，你可以选择一个智囊或【兵临城下】，令一名没有〖危迫〗效果的角色获得如下一次性效果直到你下回合开始：其可于出牌阶段弃置一张【杀】，并获得一张你选择的牌。",
  mjchenshi: "陈势",
  mjchenshi_player: "陈势",
  mjchenshi_target: "陈势",
  mjchenshi_info: "一名其他角色使用【兵临城下】指定第一个目标后，其可交给你一张牌，并将牌堆顶三张牌中所有不为【杀】的牌置入弃牌堆；一名其他角色成为【兵临城下】的目标后，其可交给你一张牌，然后将牌堆顶三张牌中所有的【杀】置入弃牌堆。",
  mjmouzhi: "谋识",
  mjmouzhi_info: "锁定技，当你受到伤害时，若伤害渠道对应的牌和你上次受到的伤害花色相同，则你防止此伤害。",
  luotong: "手杀骆统",
  qinzheng: "勤政",
  qinzheng_info: "锁定技，当你使用或打出牌时，若你本局游戏内使用或打出过的牌数和：为3的倍数，你从牌堆中获得一张【杀】或【闪】；为5的倍数，你从牌堆中获得一张【桃】或【酒】；为8的倍数，你从牌堆中获得一张【决斗】或【无中生有】（可获得对应的衍生替换牌）。",
  sp_duyu: "手杀杜预",
  spwuku: "武库",
  spwuku_info: "锁定技，当有角色使用装备牌时，若你的“武库”数小于3，则你获得一个“武库”。",
  spwuku_info_guozhan: "锁定技，当有其他势力的角色使用装备牌时，若你的“武库”数小于2，则你获得一个“武库”。",
  spsanchen: "三陈",
  spsanchen_info: `觉醒技，结束阶段，若你的“武库”数大于2，则你加1点体力上限并回复1点体力，然后获得${get.poptip("spmiewu")}。`,
  spmiewu: "灭吴",
  spmiewu_info: "每回合限一次。你可弃置一枚“武库”并将一张牌当做任意基本牌或锦囊牌使用，然后摸一张牌。",
  sp_bianfuren: "手杀卞夫人",
  spwanwei: "挽危",
  spwanwei_info: "每轮累计限一次。①出牌阶段，你可选择一名其他角色。②当有其他角色处于濒死状态时。你可令该角色回复X+1点体力（至少回复至1），然后你失去X点体力。（X为你的体力值）",
  spyuejian: "约俭",
  spyuejian_info: "你的手牌上限基数等于你的体力上限。当你进入濒死状态时，你可以弃置两张牌，然后回复1点体力。",
  feiyi: "手杀费祎",
  feiyi_prefix: "手杀",
  reshengxi: "生息",
  reshengxi_info: "结束阶段，若你于本回合内未造成过伤害，则你可摸两张牌。",
  fyjianyu: "谏喻",
  fyjianyu_info: "每轮限一次。出牌阶段，你可选择两名角色，令这些角色获得“喻”直到你的下回合开始。当一名有“喻”的角色A于其出牌阶段内使用牌指定另一名有“喻”的角色B为目标时，你令B摸一张牌。",
  mjshengxi: "生息",
  mjshengxi_info: "准备阶段，你可以获得一张【调剂盐梅】；结束阶段，若你本回合使用过牌且未造成伤害，则你可以获得一张智囊或摸一张牌。",
  mjkuanji: "宽济",
  mjkuanji_info: "每回合限一次。当你因弃置而失去牌后，你可令一名其他角色获得其中的一张牌，然后你摸一张牌。",
  tiaojiyanmei: "调剂盐梅",
  tiaojiyanmei_info: "出牌阶段，对两名手牌数不均相同的其他角色使用。若目标角色于此牌使用准备工作结束时的手牌数大于此时所有目标的平均手牌数，其弃置一张牌。若小于则其摸一张牌。此牌使用结束后，若所有目标角色的手牌数均相等，则你可令一名角色获得所有因执行此牌效果而弃置的牌。",
  refubi: "辅弼",
  refubi_info: "游戏开始时，你可令一名其他角色获得“辅弼”标记。有“辅弼”标记的角色的准备阶段开始时，你可选择一项：①令其本回合使用【杀】的次数上限+1。②令其本回合的手牌上限+3。",
  rezuici: "罪辞",
  rezuici_backup: "罪辞",
  rezuici_info: "出牌阶段，或当你处于濒死状态时，你可以废除一个有牌的装备栏并回复2点体力，然后可以移动“辅弼”标记。",
  mjdingyi: "定仪",
  mjdingyi_info: "游戏开始时，你选择一个效果（相同效果不可叠加）并令全场角色获得之：①摸牌阶段额定摸牌数+1。②手牌上限+2。③攻击范围+1。④脱离濒死状态时回复1点体力。",
  mjzuici: "罪辞",
  mjzuici_info: "当你受到伤害后，你可令伤害来源失去〖定仪〗效果，然后令其从牌堆中获得一张由你选择的智囊。",
  mjfubi: "辅弼",
  mjfubi_info: "每轮限一次。出牌阶段，你可选择一项：①更换一名角色的〖定仪〗效果。②弃置一张牌并令一名角色的〖定仪〗效果翻倍直到你的下回合开始。",
  wujing: "吴景",
  heji: "合击",
  heji_info: "当有角色使用的【决斗】或红色【杀】结算完成后，若此牌对应的目标数为1，则你可以对相同的目标使用一张【杀】或【决斗】（无距离和次数限制）。若你以此法使用的牌不为转化牌，则你从牌堆中随机获得一张红色牌。",
  liubing: "流兵",
  liubing_info: "锁定技。①你于出牌阶段使用的第一张非虚拟【杀】的花色视为♦。②其他角色于其出牌阶段内使用的非转化黑色【杀】结算结束后，若此【杀】未造成伤害，则你获得之。",
  sp_mifuren: "手杀糜夫人",
  spcunsi: "存嗣",
  spcunsi2: "存嗣",
  spcunsi_info: "出牌阶段限一次，你可将武将牌翻至背面并选择一名其他角色。其从牌堆或弃牌堆中获得一张【杀】，且下一张【杀】的伤害值基数+1。",
  spguixiu: "闺秀",
  spguixiu_info: "锁定技，当你受到伤害后，若你的武将牌背面朝上，则你将武将牌翻至正面。当你的武将牌从背面翻至正面时，你摸一张牌。",
  qingyu: "清玉",
  qingyu_info: `使命技，锁定技。①当你受到伤害时，你弃置两张牌，然后防止此伤害。②使命：准备阶段，若你的体力值等于体力上限且你的手牌数小于游戏轮数，则你获得${get.poptip("xuancun")}。③失败：当你进入濒死状态时，你减1点体力上限，令一名其他角色获得${get.poptip("mbyongjue")}。`,
  xuancun: "悬存",
  xuancun_info: "其他角色的回合结束时，若你的手牌数小于体力值，则你可以令其摸X张牌（X为你的体力值与手牌数之差且至多为2）。",
  mbyongjue: "勇决",
  mbyongjue_info: "锁定技，若一名角色于其回合内使用的首张牌为【杀】，你于此【杀】结算结束后获得之。",
  xinlirang: "礼让",
  xinlirang_info: "①其他角色的摸牌阶段开始时，若你没有“谦”标记，则你可以获得一枚“谦”标记。若如此做，其额定摸牌数+2，且本回合的弃牌阶段结束时，你可以获得其弃置的至多两张牌。②准备阶段，若你有“谦”标记，则你跳过下个摸牌阶段并移除“谦”标记。",
  xinmingshi: "名仕",
  xinmingshi_info: "锁定技，当你受到伤害后，若你有“谦”标记，则伤害来源弃置其区域内的一张牌。若此牌为：黑色：你获得之。红色，你回复1点体力。",
  sp_xinpi: "手杀辛毗",
  spyinju: "引裾",
  spyinju2: "引裾",
  spyinju_info: "出牌阶段限一次，你可令一名其他角色选择一项：①对你使用一张【杀】（无距离限制）。②其下个回合的准备阶段开始时，跳过出牌阶段和弃牌阶段。",
  spchijie: "持节",
  spchijie_info: "每回合限一次。当你成为其他角色使用牌的唯一目标时，你可判定。若结果大于6，则你取消此牌的所有目标。",
  reduoji: "夺冀",
  reduoji_info: "出牌阶段限一次，你可将一张牌置于其他角色的武将牌上，称为“冀”。当有装备牌因使用而进入一名角色的装备区后，若该角色有“冀”且其为使用者，则你获得此装备牌，其移去一个“冀”并摸一张牌。一名其他角色的回合结束后，若其有“冀”，则你获得其的所有“冀”。",
  wangling: "王凌",
  mouli: "谋立",
  mouli_info: "出牌阶段限一次，你可以将一张手牌交给一名其他角色，其获得如下效果直到你的下回合开始：其可以将黑色牌当做【杀】，红色牌当做【闪】使用。其第一次触发“使用【杀】/【闪】结算完成后”的时机时，你摸三张牌。",
  zifu: "自缚",
  zifu_info: "锁定技，当有角色死亡时，若其因你获得的“谋立”效果未过期，则你减2点体力上限。",
  xingqi: "星启",
  xingqi_info: "①当你使用牌时，若此牌不为延时锦囊牌且你没有同名的“备”，则你获得一枚与此牌名称相同的“备”。②结束阶段，你可移去一枚“备”，然后从牌堆中获得一张与此“备”名称相同的牌。",
  xinzifu: "自缚",
  xinzifu_info: "锁定技。出牌阶段结束时，若你本阶段内未使用牌，则你移去所有“备”且本回合的手牌上限-1。",
  mibei: "秘备",
  mibei_info: `使命技。①使命：当你使用的牌结算完成后，若你的“备”中包含的基本牌，锦囊牌，装备牌数量均大于1，则你从牌堆中获得这三种类型的牌各一张并获得技能${get.poptip("xinmouli")}。②失败：结束阶段开始时，若你没有“备”，且你于本回合的准备阶段开始时也没有“备”，则你减1点体力上限。`,
  xinmouli: "谋立",
  xinmouli_info: "出牌阶段限一次，你可以指定一名其他角色。其移去你的一个“备”，然后从牌堆中获得一张与此“备”名称相同的牌。",
  wangfuzhaolei: "王甫赵累",
  xunyi: "殉义",
  xunyi2: "殉义",
  xunyi3: "殉义",
  xunyi_info: "①游戏开始时，你令一名其他角色获得“义”；拥有“义”效果的角色死亡后，你可以令另一名其他角色获得“义”。②当你或“义”角色造成/受到1点伤害后，若受伤角色/伤害来源不为另一方，令另一方摸一张牌/弃置一张牌。",
  zhouchu: "手杀周处",
  xianghai: "乡害",
  xianghai_info: "锁定技，其他角色的手牌上限-1。你手牌区的装备牌均视为【酒】。",
  chuhai: "除害",
  chuhai_info: "出牌阶段限一次，你可以摸一张牌，然后和一名其他角色拼点。若你赢，则你观看其手牌，并从牌堆/弃牌堆中获得其手牌中包含的类型的牌各一张，且当你于此阶段内对其造成伤害后，你将牌堆/弃牌堆中的一张装备牌置于你的一个空置装备栏内。",
  rechuhai: "除害",
  rechuhai_info: `使命技。①出牌阶段限一次，你可以摸一张牌，然后和一名其他角色拼点。若你赢，则你观看其手牌，并从牌堆/弃牌堆中获得其手牌中包含的类型的牌各一张，且当你于此阶段内对其造成伤害后，你将牌堆/弃牌堆中的一张装备牌置于你的一个空置装备栏内。②当你因发动〖除害①〗而展示拼点牌时，你令此牌的点数+X（X=(4-你装备区的牌数)）。③使命：当有装备牌进入你的装备区后，若你的装备区内有至少三张牌，则你将体力值回复至上限，失去〖乡害〗并获得${get.poptip("zhangming")}。④失败：当你因发动〖除害①〗发起的拼点没赢时，若你的最终点数不大于6，则你触发使命失败分支。`,
  zhangming: "彰名",
  zhangming_info: "锁定技。①你使用的♣牌不能被响应。②每回合限一次，当你对其他角色造成伤害后，你随机弃置其一张手牌，然后你从牌堆或弃牌堆中获得与其弃置牌类型不同类型的牌各一张（若其没有手牌，则你改为从牌堆或弃牌堆中获得所有类型牌各一张），且以此法得到的牌不计入本回合的手牌上限。",
  sp_kongrong: "手杀孔融",
  spmingshi: "名士",
  spmingshi_info: "锁定技，当你受到1点伤害后，伤害来源弃置一张牌。",
  splirang: "礼让",
  splirang_info: "出牌阶段限一次，你可以弃置所有手牌，然后将其中的至多X张牌交给一名其他角色（X为你的体力值），之后摸一张牌。",
  caizhenji: "蔡贞姬",
  sheyi: "舍裔",
  sheyi_info: "每轮限一次。当有体力值小于你的其他角色受到伤害时，你可以交给其至少X张牌并防止此伤害（X为你的体力值）。",
  tianyin: "天音",
  tianyin_info: "锁定技，结束阶段开始时，你从牌堆中获得每种本回合未使用过的类型的牌各一张。",
  xiangchong: "向宠",
  guying: "固营",
  guying_info: "锁定技。每回合限一次，当你于回合外失去牌后，若牌数为1，则你获得1枚“固”并令当前回合角色选择一项：①随机交给你一张牌。②令你获得本次失去的牌，若为装备牌，则你使用之。准备阶段开始时，你移去所有“固”并弃置等量的牌。",
  muzhen: "睦阵",
  muzhen_backup: "睦阵",
  muzhen_info: "出牌阶段各限一次。①你可以将至多两张牌交给一名装备区内有牌的其他角色，然后获得其装备区内的一张牌。②你可以将一张装备牌置于其他角色的装备区内，然后获得其一张手牌。③你可以选择任意名其他角色，这些角色手牌数和装备区牌数每有一项与你相同，其摸一张牌，若这些角色均摸了两张牌，你摸选择角色数张牌。",
  sp_huaxin: "手杀华歆",
  hxrenshi: "仁仕",
  hxrenshi_info: "出牌阶段每名角色限一次。你可以将一张手牌交给一名其他角色。",
  debao: "德保",
  debao_info: "锁定技，当其他角色获得你的牌后，若你的“仁”数小于你的体力上限，则你将牌堆顶的一张牌置于你的武将牌上，称为“仁”。准备阶段，你获得所有“仁”。",
  buqi: "不弃",
  buqi_info: "锁定技，当有角色进入濒死状态时，若你的“仁”数大于1，则你移去两张“仁”并令其回复1点体力。一名角色死亡后，你将所有“仁”置入弃牌堆。",
  yuanqing: "渊清",
  yuanqing_info: "锁定技，出牌阶段结束时，你随机将弃牌堆中你本回合使用过的牌类型的各一张牌置于仁库中。",
  shuchen: "疏陈",
  shuchen_info: "锁定技，当有角色进入濒死状态时，若仁库中的牌数大于三，则你获得仁库中的所有牌，然后其回复1点体力。",
  sp_xujing: "手杀许靖",
  boming: "博名",
  boming_info: "出牌阶段限两次，你可以将一张牌交给一名其他角色。结束阶段，若你本回合以此法失去了至少两张牌，则你摸一张牌。",
  ejian: "恶荐",
  ejian_info: "锁定技，每名角色限一次。当有其他角色因〖博名〗而得到了你的牌后，若其拥有与此牌类型相同的其他牌，则你令其选择一项：①受到1点伤害。②展示所有手牌，并弃置所有与此牌类别相同的牌。",
  zhangzhongjing: "张机",
  jishi: "济世",
  jishi_info: "锁定技。①当你使用的牌结算完成后，若你未因此牌造成过伤害，则你将此牌对应的所有实体牌置于仁库中。②当有牌不因溢出而离开仁库时，你摸一张牌。",
  liaoyi: "疗疫",
  liaoyi_info: "其他角色的回合开始时，若其：①手牌数小于体力值且仁库内牌数大于等于X，则你可令其从仁库中获得X张牌；②手牌数大于体力值，则你可以令其将X张牌置于仁库中（X为其手牌数与体力值之差且至多为4）。",
  xinliaoyi: "疗疫",
  xinliaoyi_info: "其他角色的回合开始时，你可选择一项：①令其从仁库中获得一张牌。②若其手牌数大于体力值，则令其将X张手牌置入仁库（X为其手牌数与体力值之差）。",
  binglun: "病论",
  binglun_info: "出牌阶段限一次，你可以将仁库中的一张牌置于弃牌堆并选择一名角色。该角色选择一项：①摸一张牌。②于其下回合结束时回复1点体力。",
  sp_zhangwen: "手杀张温",
  gebo: "戈帛",
  gebo_info: "锁定技，当有角色回复体力后，你将牌堆顶的一张牌置入仁库。",
  spsongshu: "颂蜀",
  spsongshu_info: "其他角色的摸牌阶段开始时，若其体力值大于你且仁库内有牌，则你可以令其放弃摸牌。其改为获得X张仁（X为你的体力值且至多为5），且本回合内不能使用牌指定其他角色为目标。",
  liuzhang: "刘璋",
  xiusheng: "休生",
  xiusheng_info: `锁定技。准备阶段，你将所有“生”置入弃牌堆，然后摸X张牌，并将等量的牌置于武将牌上，称为“生”（X为你因${get.poptip("yinlang")}而选择的势力的存活角色数）。`,
  yinlang: "引狼",
  yinlang_info: "①每轮限一次。回合开始时，你选择场上的一个势力。②一名角色的出牌阶段开始时，若其势力与你选择的势力相同，则其选择一项：1.获得你的一张“生”，然后其本回合使用牌时不能指定你以外的角色为目标。2.你获得一张“生”。",
  huaibi: "怀璧",
  huaibi_info: `主公技，锁定技。你的手牌上限+X（X为你因${get.poptip("yinlang")}而选择的势力的存活角色数）。`,
  jutu: "据土",
  jutu_info: `锁定技，准备阶段，你获得所有你武将牌上的“生”，然后摸X+1张牌，然后将X张牌置于你的武将牌上，称为“生”（X为你因${get.poptip("yaohu")}选择势力的角色数量)。`,
  yaohu: "邀虎",
  yaohu_info: "每轮限一次，你的回合开始时，你须选择场上一个势力。该势力其他角色的出牌阶段开始时，其获得你的一张“生”，然后其须选择一项：①对你指定的另一名的其他角色使用一张【杀】（无距离和次数限制）；②直到本阶段结束，其使用伤害牌指定你为目标时，除非交给你两张牌，否则取消之。",
  rehuaibi: "怀璧",
  rehuaibi_info: `主公技，锁定技，你的手牌上限+X（X为你因${get.poptip("yaohu")}选择势力的角色数量)。`,
  qiaogong: "桥公",
  yizhu: "遗珠",
  yizhu_info: "①结束阶段，你摸两张牌，然后将两张牌随机插入牌堆前2X张牌的位置中（X为角色数，选择牌的牌名对其他角色可见）。②其他角色使用“遗珠”牌指定唯一目标时，你可以取消此目标，然后你清除对应的“遗珠”标记。③当“遗珠”牌不因使用而进入弃牌堆后，你清除对应的“遗珠”标记。",
  luanchou: "鸾俦",
  luanchou_info: "出牌阶段限一次，你可令两名角色获得“姻”标记并清除原有标记。拥有“姻”标记的角色视为拥有技能〖共患〗。",
  gonghuan: "共患",
  gonghuan_info: "锁定技。每回合限一次，一名其他角色受到伤害时，若其拥有“姻”标记且其体力值小于你，则你将伤害转移给自己。此伤害结算结束后，你与其移去“姻”标记。",
  sp_yanghu: "手杀羊祜",
  mingfa: "明伐",
  mingfa_info: "①结束阶段，你可展示一张牌并记录为“明伐”。②出牌阶段开始时，若“明伐”牌在你的手牌区或装备区，则你可以使用“明伐”牌与一名其他角色拼点。若你赢：你获得对方一张牌并从牌堆中获得一张点数等于“明伐”牌牌面点数-1的牌。若你没赢：你本回合不能使用牌指定其他角色为目标。③你的拼点牌亮出后，你令此牌的点数+2。",
  rongbei: "戎备",
  rongbei_info: "限定技。出牌阶段，你可选择一名有空装备栏的角色。系统为该角色的每个空装备栏选择一张装备牌，然后该角色使用之。",
  db_wenyang: "手杀文鸯",
  dbquedi: "却敌",
  dbquedi_info: `每回合限一次。当你使用【杀】或【决斗】指定唯一目标后，你可选择：①获得目标角色的一张手牌。②弃置一张基本牌，并令此牌的伤害值基数+1。③${get.poptip("rule_beishui")}：减1点体力上限。`,
  dbzhuifeng: "椎锋",
  dbzhuifeng_info: "魏势力技。每回合限两次，你可以失去1点体力并视为使用一张【决斗】（你死亡后仍然结算）。当你因此【决斗】而受到伤害时，你防止此伤害并令此技能失效直到出牌阶段结束。",
  dbchongjian: "冲坚",
  dbchongjian_backup: "冲坚",
  dbchongjian_info: "吴势力技。你可以将一张装备牌当做一种【杀】（无距离限制且无视防具）或【酒】使用。当你以此法使用【杀】造成伤害后，你获得目标角色装备区内的X张牌（X为伤害值）。",
  dbchoujue: "仇决",
  dbchoujue_info: "锁定技。当你杀死其他角色后，你加1点体力上限并摸两张牌，然后你本回合发动〖却敌〗的次数上限+1。",
  sp_chendong: "手杀陈武董袭",
  sp_chendong_prefix: "手杀",
  spyilie: "毅烈",
  spyilie_info: `出牌阶段开始时，你可选择：①本阶段内使用【杀】的次数上限+1。②本回合内使用【杀】被【闪】抵消时，摸一张牌。③${get.poptip("rule_beishui")}：失去1点体力。`,
  spfenming: "奋命",
  spfenming_info: "出牌阶段限一次，你可以选择一名体力值不大于你的角色。若其：未横置，其横置；已横置，你获得其一张牌。",
  yuanhuan: "袁涣",
  qingjue: "请决",
  qingjue_info: "每轮限一次。当有其他角色A使用牌指定另一名体力值小于A且不处于濒死状态的其他角色B为唯一目标时，你可以摸一张牌，然后与A拼点。若你赢，你取消此目标。若你没赢，你将此牌的目标改为自己。",
  fengjie: "奉节",
  fengjie2: "奉节",
  fengjie_info: "锁定技，准备阶段开始时，你选择一名其他角色并获得如下效果直到你下回合开始：一名角色的结束阶段开始时，你将手牌摸至（至多摸至四张）或弃置至与其体力值相等。",
  sp_zongyu: "手杀宗预",
  zhibian: "直辩",
  zhibian_info: `准备阶段，你可以和一名其他角色拼点。若你赢，你可选择：①将其装备区/判定区内的一张牌移动到你的对应区域。②回复1点体力。③${get.poptip("rule_beishui")}：跳过下个摸牌阶段；若你没赢，你失去1点体力。`,
  yuyan: "御严",
  yuyan_info: "锁定技。当你成为非转换的【杀】的目标时，若使用者的体力值大于你且此【杀】有点数，则你令使用者选择一项：①交给你一张点数大于此【杀】的牌。②取消此目标。",
  sp_wangshuang: "手杀王双",
  yiyong: "异勇",
  yiyong_info: "当你受到其他角色造成的渠道为【杀】的伤害后，若你的装备区内有武器牌，则你可以获得此【杀】对应的所有实体牌，然后将这些牌当做【杀】对伤害来源使用（无距离限制）。若其装备区内没有武器牌，则此伤害+1。",
  shanxie: "擅械",
  shanxie_info: "①出牌阶段限一次，你可从牌堆中获得一张武器牌。若牌堆中没有武器牌，则你改为随机获得一名角色装备区内的一张武器牌。②当其他角色使用【闪】响应你使用的【杀】时，若此【闪】没有点数或点数不大于你攻击范围的二倍，则你令此【闪】无效。",
  shanxie_info_old: "①出牌阶段限一次，你可选择一项：⒈从牌堆中获得一张武器牌。⒉获得一名其他角色装备区内的一张武器牌并使用，然后其将一张手牌当做【杀】对你使用。②当其他角色使用【闪】响应你使用的【杀】时，若此【闪】没有点数或点数不大于你攻击范围的二倍，则你令此【闪】无效。",
  sunyi: "手杀孙翊",
  zaoli: "躁厉",
  zaoli_info: "锁定技。①你不能于出牌阶段使用或打出你手牌中不为本回合得到的牌。②当你使用或打出手牌时，你获得一个“厉”（至多4个）。③回合开始时，若你有“厉”，则你移去所有“厉”并弃置任意张牌，然后摸X+Y张牌。若X大于2，你失去1点体力（X为你移去的标记数，Y为你弃置的牌数）。",
  sp_gaolan: "手杀高览",
  spjungong: "峻攻",
  spjungong_info: "出牌阶段，你可失去X+1点体力或弃置X+1张牌，视为对一名其他角色使用【杀】（不计入次数和距离限制，X为你本回合内发动过〖峻攻〗的次数）。若你因此【杀】造成了伤害，则你令此技能失效直到回合结束。",
  spdengli: "等力",
  spdengli_info: "当你使用【杀】指定目标后，或成为【杀】的目标后，若使用者和目标的体力值相等，则你摸一张牌。",
  sp_huaman: "手杀花鬘",
  spxiangzhen: "象阵",
  spxiangzhen_info: "锁定技。①【南蛮入侵】对你无效。②当有角色使用的【南蛮入侵】结算结束后，若有角色因此牌受到过伤害，则你与伤害来源各摸一张牌。",
  spfangzong: "芳踪",
  spfangzong_info: "锁定技。①你不能于出牌阶段使用具有伤害标签的牌指定攻击范围内的角色为目标。②攻击范围内包含你的角色不能使用具有伤害标签的牌指定你为目标。③结束阶段，你将手牌摸至X张（X为场上存活人数且至多为8）。",
  spxizhan: "嬉战",
  spxizhan_info: "其他角色的回合开始时，你须选择一项：①失去1点体力。②弃置一张牌并令〖芳踪〗于本回合失效，然后若此牌的花色为：♠，其视为使用一张【酒】；♥，你视为使用一张【无中生有】；♣，你视为对其使用【铁索连环】；♦：你视为对其使用火【杀】（无距离限制）。",
  sp_cuiyan: "手杀崔琰",
  spyajun: "雅俊",
  spyajun_info: "①摸牌阶段，你令额定摸牌数+1。②出牌阶段开始时，你可以用一张本回合得到的牌与其他角色拼点。若你赢，则你可将其中一张拼点牌置于牌堆顶。若你没赢，你本回合的手牌上限-1。",
  spzundi: "尊嫡",
  spzundi_info: "出牌阶段限一次，你可以弃置一张手牌并选择一名角色，然后你进行判定。若结果为：黑色，其摸三张牌；红色，其可以移动场上的一张牌。",
  sp_zhangchangpu: "手杀张昌蒲",
  spdifei: "抵诽",
  spdifei_info: "锁定技。每回合限一次，当你受到伤害后，你摸一张牌或弃置一张手牌，然后展示所有手牌。若此伤害的渠道为没有花色的牌或你的手牌中没有与此牌花色相同的牌，则你回复1点体力。",
  spyanjiao: "严教",
  spyanjiao_info: "出牌阶段限一次。你可以将手牌中一种花色的所有牌交给一名其他角色，对其造成1点伤害。然后你于自己的下回合开始时摸等量的牌。",
  sp_jiangwan: "手杀蒋琬",
  sp_jiangwan_prefix: "手杀",
  spzhenting: "镇庭",
  spzhenting_info: `每回合限一次。当你或你攻击范围内的角色成为【杀】或延时锦囊的目标时，若你不是此牌的使用者，你可选择一项：①弃置使用者的一张手牌；②摸一张牌；③${get.poptip("rule_beishui")}：代替其成为此牌目标。`,
  spjincui: "尽瘁",
  spjincui_info: "限定技。出牌阶段，你可以和一名其他角色交换位置，然后失去X点体力（X为你的体力值-你发动过〖镇庭〗的次数）；若你未以此法失去体力，你增加1点体力上限并失去〖镇庭〗的背水选项。",
  sp_jiangqing: "蒋钦",
  spjianyi: "俭衣",
  spjianyi_info: "锁定技。其他角色的回合结束时，若弃牌堆中有于本回合内因弃置而进入弃牌堆的防具牌，则你获得其中一张。",
  spshangyi: "尚义",
  spshangyi_info: "出牌阶段限一次。你可以弃置一张牌并选择一名有手牌的其他角色。其观看你的手牌，然后你观看其手牌并获得其中的一张。",
  sp_lvfan: "手杀吕范",
  sp_lvfan_prefix: "手杀",
  spdiaodu: "调度",
  spdiaodu_info: "准备阶段，你可令一名角色摸一张牌，然后移动其装备区内的一张牌。",
  spdiancai: "典财",
  spdiancai_info: "其他角色的结束阶段开始时，你可以令至多X名角色各摸一张牌（X为你本回合失去的手牌数）。",
  mbdiaodu: "调度",
  mbdiaodu_info: "准备阶段，你可以移动一名角色装备区内的一张牌（不能移动给自己），然后其摸一张牌。",
  mbdiancai: "典财",
  mbdiancai_info: "其他角色的出牌阶段阶段结束后，若你本阶段失去的牌数不小于你的体力值，则你可将手牌数补至体力上限。",
  spyanji: "严纪",
  spyanji_info: `出牌阶段开始时，你可以进行“${get.poptip("rule_zhengsu")}”。`,
  sp_huangfusong: "手杀皇甫嵩",
  spzhengjun: "整军",
  spzhengjun_info: `出牌阶段开始时，你可进行“${get.poptip("rule_zhengsu")}”。你因此获得整肃奖励后，你可令一名其他角色获得整肃奖励。`,
  spshiji: "势击",
  spshiji_info: "当你对其他角色造成属性伤害时，若你的手牌数不为全场唯一最多，则你可以观看其手牌。你令其弃置其中的所有红色牌，然后摸等量的牌。",
  sptaoluan: "讨乱",
  sptaoluan_info: "每回合限一次。一名角色的判定结果确定时，若结果的花色为♠，则你可以终止导致此判定发生的上级事件。然后选择一项：①获得判定牌对应的实体牌。②视为对判定角色使用一张火【杀】（无距离和次数限制）。",
  sp_zhujun: "手杀朱儁",
  yangjie: "佯解",
  yangjie_info: "出牌阶段限一次，你可以摸一张牌并和一名其他角色A拼点。当你以此法展示你的拼点牌时，你令此牌点数-X（X为你已损失的体力值）。若你没赢，则你可以令另一名其他角色B获得两张拼点牌，然后其视为对A使用一张火【杀】。",
  zjjuxiang: "拒降",
  zjjuxiang_info: "限定技。一名其他角色脱离濒死状态时，你可以对其造成1点伤害，然后摸X张牌（X为其体力上限且至多为5）。",
  xinyangjie: "佯解",
  xinyangjie_info: "出牌阶段限一次，你可以与一名其他角色A拼点。若你没赢，则你可以令另一名其他角色B视为对A使用一张火【杀】。",
  xinjuxiang: "拒降",
  xinjuxiang_info: "限定技，一名其他角色脱离濒死状态时，你可以对其造成1点伤害。",
  houfeng: "厚俸",
  houfeng_info: `每轮限一次。一名其他角色的出牌阶段开始时，若其在你的攻击范围内，则你可以令其进行“${get.poptip("rule_zhengsu")}”。其因此获得整肃奖励后，你获得相同的整肃奖励。`,
  liuba: "手杀刘巴",
  duanbi: "锻币",
  duanbi_info: "限定技。出牌阶段，若场上所有角色的手牌数之和大于角色数之和的二倍，则你可以令所有其他角色各弃置X张手牌（X为该角色手牌数的一半且向下取整且至多为3）。然后你可选择一名角色，令其随机获得三张以此法被弃置的牌。",
  tongduo: "统度",
  tongduo_info: "每回合限一次。当你成为其他角色使用牌的唯一目标后，你可令一名角色重铸一张牌。",
  shen_huatuo: "手杀神华佗",
  shen_huatuo_prefix: "手杀神",
  wuling: "五灵",
  wuling_info: `①出牌阶段限两次。你可以选择一名没有“${get.poptip({
    id: "wl_wuqinxi",
    name: "五禽戏",
    type: "character",
    info: `“五禽戏”分为“虎、鹿、熊、猿、鹤”五个不同的效果：<span style='font-family: yuanli'>
				<br><li>虎：当你使用指定唯一目标的牌对目标角色造成伤害时，此伤害+1。
				<br><li>鹿：①当你获得此效果时，你回复1点体力并弃置判定区的所有牌。②你不能成为延时锦囊牌的目标。
				<br><li>熊：每回合限一次，当你受到伤害时，此伤害-1。
				<br><li>猿：当你获得此效果时，你选择一名其他角色，获得其装备区里的一张牌。
				<br><li>鹤：当你获得此效果时，你摸三张牌。
			</span>`
  })}”的角色，按照你选择的顺序向其传授“${get.poptip("wl_wuqinxi")}”，且其获得如下效果：其获得你选择的第一种“${get.poptip("wl_wuqinxi")}”的效果，并在其每个准备阶段移除当前“${get.poptip("wl_wuqinxi")}”的效果并切换为下一种。②当你死亡时，你令场上的角色失去你传授的“${get.poptip("wl_wuqinxi")}”。`,
  wuling_wuqinxi: "五禽戏",
  get wuling_wuqinxi_info() {
    return lib.poptip.getInfo("wl_wuqinxi");
  },
  youyi: "游医",
  youyi_info: "①弃牌阶段结束时，你可以将所有于此阶段弃置的牌置入仁区。②出牌阶段限一次。你可以将仁区的所有牌置入弃牌堆，令所有角色各回复1点体力。",
  wuqinxi_hu: "虎",
  wuqinxi_hu_bg: "虎",
  wuqinxi_hu_info: "当你使用指定唯一目标的牌对目标角色造成伤害时，此伤害+1。",
  wuqinxi_lu: "鹿",
  wuqinxi_lu_bg: "鹿",
  wuqinxi_lu_info: "①当你获得此效果时，你回复1点体力并弃置判定区的所有牌。②你不能成为延时锦囊牌的目标。",
  wuqinxi_xiong: "熊",
  wuqinxi_xiong_bg: "熊",
  wuqinxi_xiong_info: "每回合限一次，当你受到伤害时，此伤害-1。",
  wuqinxi_yuan: "猿",
  wuqinxi_yuan_bg: "猿",
  wuqinxi_yuan_info: "当你获得此效果时，你选择一名其他角色，获得其装备区里的一张牌。",
  wuqinxi_he: "鹤",
  wuqinxi_he_bg: "鹤",
  wuqinxi_he_info: "当你获得此效果时，你摸三张牌。",
  shen_lusu: "神鲁肃",
  shen_lusu_prefix: "神",
  dingzhou: "定州",
  dingzhou_info: "出牌阶段限一次。你可以将X张牌交给一名场上有牌的角色，然后你获得其场上的所有牌（X为其场上的牌数）。",
  tamo: "榻谟",
  tamo_info: "游戏开始时，你可以重新分配除主公外所有角色的座次。",
  tamo_info_doudizhu: "游戏开始时，你可以重新分配除三号位外所有角色的座次。",
  tamo_faq: "FAQ",
  tamo_faq_info: "<br><li>Q：在一号位不为主公的情况下，〖榻谟〗如何结算？</li><li>A：该角色可以正常进行座次交换。若受此技能影响导致一号位角色发生了变化，则以排列后的一号位角色为起始角色开始本局游戏。</li>",
  zhimeng: "智盟",
  zhimeng_info: "回合结束后，你可以选择一名其他角色。若如此做，你与其将各自所有手牌置于处理区，然后你随机获得这些牌中的一半（向上取整），其获得剩余的牌。",
  mb_shen_machao_prefix: "手杀神",
  //子右：再这样写"手杀|神"的通通吃我m87光线，炸死你
  mb_shen_machao: "手杀神马超",
  yuli: "驭雳",
  yuli_info: "锁定技。①你造成的伤害改为雷电伤害，已是雷电伤害则伤害+1；②你受到雷电伤害时，防止之并摸等量牌。",
  tingwei: "霆威",
  tingwei_info: "你使用【杀】指定目标后，可获得4枚“霆”标记并选择一名目标角色，其选择任意项并令你弃等量的“霆”标记：1.非锁定技失效至其下个回合结束；2.交给你一张装备牌；3.此牌对其造成伤害+1；4.随机弃两张牌。若其均未选择，其横置。",
  jimie: "寂灭",
  jimie_info: `限定技，出牌阶段结束时，你可以弃6枚“霆”标记，对一名角色造成等于其体力上限的伤害。然后当你${get.poptip("yuli")}的两项均执行后，此技能视为未发动过。`,
  mb_shen_jiangwei: "手杀神姜维",
  mb_shen_jiangwei_prefix: "手杀神",
  mbtiantao: "天涛",
  mbtiantao_info: "锁定技，结束阶段，你选择一个区域并弃置其中所有牌，然后依次弃置任意名其他角色相同区域各一张牌，因此弃置牌且未弃置【杀】的角色失去1点体力。",
  mbxinghun: "星魂",
  mbxinghun_info: "出牌阶段限一次，你可以观看牌堆顶五张牌，用任意张手牌与其中的等量张牌进行交换并任意排序，然后你令一名其他角色展示你的手牌与牌堆顶的共计五张牌，你对其依次使用其中的【杀】。",
  mbshenpei: "神霈",
  mbshenpei_info: `限定技，当你进入濒死状态时，你可以回复X点体力(X为你本局游戏进入过濒死状态的次数)，然后对一名角色造成等量点雷电伤害并获得${get.poptip("mbhuitian")}。`,
  mbhuitian: "回天",
  mbhuitian_info: "一名角色的回合结束时，若其体力值大于你，你可以摸一张牌并执行一个额外的回合。每轮开始时，若你发动过此技能，你死亡。",
  shen_guojia: "神郭嘉",
  shen_guojia_prefix: "神",
  shuishi: "慧识",
  shuishi_info: "出牌阶段限一次，若你的体力上限小于10，则你可选择一名角色。你令其摸一张牌，若其以此法得到的牌：与该角色的其他手牌花色均不相同，则你加1点体力上限，若你的体力上限小于10，则你可以重复此流程；否则你减1点体力上限，且其展示所有手牌。",
  stianyi: "天翊",
  stianyi_info: `觉醒技，准备阶段，若场上的所有存活角色均于本局游戏内受到过伤害，则你加2点体力上限并回复1点体力，然后令一名角色获得技能${get.poptip("zuoxing")}。`,
  zuoxing: "佐幸",
  zuoxing2: "佐幸",
  zuoxing_info: "出牌阶段限一次，若令你获得〖佐幸〗的角色存活且体力上限大于1，则你可以令其减1点体力上限，并视为使用一张普通锦囊牌。",
  sghuishi: "辉逝",
  sghuishi_info: "限定技，出牌阶段，你可以选择一名其他角色：若其有未发动过的觉醒技，则你令其发动这些觉醒技时无视原有条件；否则其摸四张牌。然后你减2点体力上限。",
  shen_taishici: "神太史慈",
  shen_taishici_prefix: "神",
  dulie: "笃烈",
  dulie_info: "锁定技。当你成为【杀】的目标时，若使用者的体力值大于你，则你进行判定。若结果为红桃，则取消此目标。",
  tspowei: "破围",
  tspowei_info: `使命技。①游戏开始时，你令所有其他角色获得一个“围”。②一名角色受到伤害后，若其有“围”，则其移去“围”。③回合开始时，你选择所有有“围”的角色。这些角色失去“围”，然后这些角色的第一个不为你的下家获得等量的“围”。④一名其他角色的回合开始时，若其有“围”，则你可以选择一项：⒈弃置一张手牌并对其造成1点伤害。⒉若其体力值不大于你，则你获得其一张手牌。选择完成后，你视为在其攻击范围内直到回合结束。⑤使命：回合开始时，若场上没有“围”，则你获得技能${get.poptip("shenzhu")}。⑥失败：当你进入濒死状态时，你将体力值回复至1点，然后弃置装备区的所有牌。`,
  shenzhu: "神著",
  shenzhu_info: "锁定技，当你使用有对应实体牌的非转化【杀】结算结束后，你选择一项：①摸一张牌，且本回合使用【杀】的次数上限+1。②摸三张牌，且本回合不能再使用【杀】。",
  dangmo: "荡魔",
  dangmo_info: "当你于出牌阶段内使用第一张【杀】选择目标后，你可以为此牌增加至多Y-1个目标（Y为你的体力值）。",
  reshuishi: "慧识",
  reshuishi_info: "出牌阶段限一次。若你的体力上限小于10，你可进行判定牌不置入弃牌堆的判定。若判定结果与本次发动技能时的其他判定结果的花色均不相同且你的体力上限小于10，则你加1点体力上限，且可以重复此流程。然后你将所有位于处理区的判定牌交给一名角色。若其手牌数为全场最多，则你减1点体力上限。",
  resghuishi: "辉逝",
  resghuishi_info: "限定技，出牌阶段，你可选择一名角色。若你的体力上限不小于存活人数且其有未发动的觉醒技，则你令其中一个技能无视发动条件；否则其摸四张牌。然后你减2点体力上限。",
  qizhengxiangsheng: "奇正相生",
  qizhengxiangsheng_info: "出牌阶段，对一名其他角色使用。你将目标角色标记为“奇兵”或“正兵”（对其他角色不可见）。然后目标角色可以打出一张【杀】或【闪】。若其是“奇兵”且未打出【杀】，则你对其造成1点伤害；若其是“正兵”且未打出【闪】，则你获得其一张牌。",
  shen_xunyu: "神荀彧",
  shen_xunyu_prefix: "神",
  tianzuo: "天佐",
  tianzuo_info: `锁定技。①游戏开始时，你将八张${get.poptip("qizhengxiangsheng")}加入牌堆。②${get.poptip("qizhengxiangsheng")}对你无效。`,
  lingce: "灵策",
  lingce_info: `锁定技。当有${get.poptip("qizhengxiangsheng")}或智囊或〖定汉①〗记录过的锦囊牌被使用时，若此牌不为转化牌且对应实体牌数量为1，则你摸一张牌。`,
  dinghan: "定汉",
  dinghan_info: "①当你成为未记录过的普通锦囊牌的目标时，或有未记录过的延时锦囊牌进入你的判定区时，你记录此牌名并取消之。②回合开始时，你可在〖定汉①〗的记录中添加或减少一种锦囊牌的牌名。",
  shen_sunce: "神孙策",
  shen_sunce_prefix: "神",
  yingba: "英霸",
  yingba_info: "①出牌阶段限一次，你可令一名体力上限大于1的其他角色，令其失去1点体力、减少1点体力上限并获得1枚“平定”标记，然后你减少1点体力上限。②你对拥有“平定”标记的角色使用牌没有次数/距离限制。拥有“平定”标记的角色每回合前X张牌不能指定你为目标（X为其拥有的“平定”标记数）。",
  scfuhai: "覆海",
  scfuhai_info: "锁定技。①当你使用牌指定目标后，若目标角色有“平定”标记，则其不可响应此牌。若你本回合内以此法得到的牌数小于2，则你摸一张牌。②拥有“平定”标记的角色死亡时，你增加X点体力上限并摸X张牌（X为其拥有的“平定”标记数）。",
  pinghe: "冯河",
  pinghe_info: `锁定技。①你的手牌上限基数等于体力上限。②当你受到其他角色造成的伤害时，若你有牌且你的体力上限大于1，则你防止此伤害，减1点体力上限并选择一项：1.将1张牌交给一名其他角色；2.重铸1张牌。然后若你拥有技能${get.poptip("yingba")}，令伤害来源获得1个“平定”标记。`
};
const characterTitles = {
  mb_shen_jiangwei: "万民承霖",
  //烟雨济世即为神！
  mb_shen_machao: "势震九天",
  shen_huatuo: "悬壶济世",
  shen_lusu: "兴吴之邓禹",
  shen_guojia: "星月奇佐",
  shen_xunyu: "洞心先识",
  shen_taishici: "义信天武",
  shen_sunce: "踞江鬼雄",
  sp_wangcan: "词章纵横",
  sp_chenzhen: "歃盟使节",
  sp_sunshao: "创基抉政",
  sp_xunchen: "谋刃略锋",
  luotong: "力政人臣",
  sp_duyu: "文成武德",
  sp_bianfuren: "内助贤后",
  feiyi: "洞世权相",
  wangling: "风节格尚",
  sp_mifuren: "乱世沉香",
  sp_xinpi: "一节肃六军",
  wangfuzhaolei: "忱忠不移",
  zhouchu: "英情天逸",
  wujing: "助吴征战",
  sp_kongrong: "凛然重义",
  caizhenji: "舍心顾复",
  xiangchong: "镇军之岳",
  sp_huaxin: "清素拂蚀",
  sp_xujing: "篡贤取良",
  zhangzhongjing: "医理圣哲",
  sp_zhangwen: "报德炀和",
  liuzhang: "半生黯然",
  qiaogong: "高风顾望",
  sp_yanghu: "鹤德璋声",
  db_wenyang: "独骑破军",
  sp_chendong: "殒身不恤",
  yuanhuan: "随车致雨",
  sp_zongyu: "御严无惧",
  sp_wangshuang: "边城猛兵",
  sunyi: "骁悍激躁",
  sp_gaolan: "绝击坚营",
  sp_huaman: "数泽清影",
  sp_cuiyan: "伯夷之风",
  sp_zhangchangpu: "厉色严教",
  sp_jiangwan: "方整威重",
  sp_jiangqing: "折节尚义",
  sp_lvfan: "持筹廉悍",
  sp_huangfusong: "铁血柔肠",
  sp_zhujun: "功成师克",
  liuba: "撰科行律"
};
const characterIntro = {
  yuanhuan: "袁涣，字曜卿，陈郡扶乐（今河南省周口市太康县）人。东汉末年官员，出身陈郡袁氏，为东汉司徒袁滂之子。袁涣早年曾任郡功曹，后被公府征辟，相继被举为高第、秀才。汉末战乱时，袁涣流寓江淮一带，初为袁术所用，后投吕布。建安三年（198年），曹操率兵剿灭了吕布，袁涣又转投曹操，拜沛南部都尉，后又任谏议大夫、郎中令等职，在任上尽心尽责，以敢谏直言称名。袁涣恕思而后行，外表温柔而内心能断，处危难则勇气极大。汉末三国时期，唯有程昱、曹仁、袁涣三人被评价为勇冠贲育。",
  qiaogong: "桥公，亦作“乔公”，名字不详，是中国汉末三国时期的长者，江东二乔的父亲，三国时期庐江郡皖县（今安徽潜山）人，中国长篇古典名著《三国演义》中称之为“乔国老”。",
  liuzhang: "刘璋（生卒年不详），字季玉，江夏竟陵（今湖北省天门市）人。东汉末年宗室、军阀，益州牧刘焉幼子，在父亲刘焉死后继任益州牧。刘璋为人懦弱多疑。汉中张鲁骄纵，不听刘璋号令，于是刘璋杀张鲁母弟，双方成为仇敌，刘璋派庞羲攻击张鲁，战败。后益州内乱，平定后，又有曹操将前来袭击的消息。在内外交逼之下，刘璋听信手下张松、法正之言，迎接刘备入益州，想借刘备之力，抵抗曹操。不料此举乃引狼入室，刘备反手攻击刘璋，又有法正为内应，进至成都。成都吏民都想抵抗刘备，但刘璋为百姓计而开城出降，群下莫不流涕。刘备占据成都后，刘璋以振威将军的身份被迁往荆州居住，关羽失荆州后，刘璋归属东吴，被孙权任命为益州牧，不久后去世，卒年不详。",
  zhangzhongjing: "张仲景（约公元150～154年—约公元215～219年），名机，字仲景，南阳涅阳县（今河南省邓州市穰东镇张寨村）人。东汉末年著名医学家，被后人尊称为“医圣”。张仲景广泛收集医方，写出了传世巨著《伤寒杂病论》。它确立的“辨证论治”原则，是中医临床的基本原则，是中医的灵魂所在。在方剂学方面，《伤寒杂病论》也做出了巨大贡献，创造了很多剂型，记载了大量有效的方剂。其所确立的六经辨证的治疗原则，受到历代医学家的推崇。这是中国第一部从理论到实践、确立辨证论治法则的医学专著，是中国医学史上影响最大的著作之一，是后学者研习中医必备的经典著作，广泛受到医学生和临床大夫的重视。",
  xiangchong: "向宠（？～240年），左将军向朗之侄，蜀汉重要将领。具有谦和公允的性格品行，对军事通晓畅达，被汉昭烈帝刘备称赞。刘备时，历任牙门将（类似于主将帐下的偏将），诸葛亮北伐时，以向宠为中领军，封都亭侯。诸葛亮北行汉中前，特意在《出师表》中向刘禅推荐向宠。延熙三年（公元240年），南征汉嘉（今四川省雅安市）蛮夷时，遇害，尸体被其部下夺回，送回成都安葬。",
  caizhenji: "蔡贞姬，生卒年不详，汉末大儒蔡邕之女。其父蔡邕精于天文数理，妙解音律，是曹操的挚友和老师。生在书香门第的家庭的蔡贞姬，自小耳濡目染，精通书法与音律。后来，其父为避宦竖迫害，便随父亲来泰山依付羊衜一族，在羊衜的元配孔氏死后，便在父亲的做主下与之成亲。夫妻二人婚后生有两子一女：羊承、羊徽瑜、羊祜。在与羊衜成亲之前，羊衜和孔氏生有一子羊发。后来羊发、羊承同时生病，蔡贞姬知道不能两全，就专心照顾羊发，最后羊发痊愈，羊承病死。",
  zhouchu: "周处（236—297年），字子隐，吴郡阳羡（今江苏宜兴）人。西晋大臣、将领，东吴鄱阳太守周鲂之子。少时纵情肆欲，为祸乡里。后来改过自新，拜访名人陆机和陆云，浪子回头，发奋读书，留下“周处除三害”的传说，拜东观左丞，迁无难都督，功业胜过父亲。吴国灭亡后，出仕西晋，拜新平太守，转广汉太守，治境有方。入为散骑常侍，迁御史中丞，刚正不阿。得罪梁孝王司马肜。元康七年，出任建威将军，前往关中，讨伐氐羌齐万年叛乱，遇害于沙场。追赠平西将军，谥号为孝。",
  wangfuzhaolei: "王甫（？—222年），字国山，广汉郪（今四川三台县）人，三国时期蜀汉重臣。刘璋时，为益州书佐，之后归降刘备，先后担任绵竹令、荆州议曹从事，并在夷陵之战中阵亡。其子王祐，官至尚书右选郎。赵累，蜀汉大将关羽部下都督。后来吴将吕蒙袭取荆州，赵累被吴将潘璋等在临沮擒获。",
  wangling: "王凌（172年～251年6月15日），字彦云，太原郡祁县（今山西省祁县）人，三国时期曹魏将领，东汉司徒王允之侄。王凌出身太原王氏祁县房。举孝廉出身，授发干县令，迁中山太守。颇有政绩，迁司空（曹操）掾属。魏文帝曹丕即位，拜散骑常侍、兖州刺史。参加洞口之战，跟从张辽击败吴将吕范，加号建武将军，封宜城亭侯。太和二年（228年），王凌参与石亭之战，跟从曹休征伐东吴，力挽狂澜，历任扬豫二州刺史，治境有方。齐王曹芳继位，拜征东将军，联合孙礼击败吴将全琮，进封南乡侯，授车骑将军、仪同三司，正始九年（248年），代高柔为司空。嘉平元年（249年），代蒋济为太尉。嘉平三年（251年），不满太傅司马懿专擅朝政，联合兖州刺史令狐愚谋立楚王曹彪为帝，事泄自尽，时年八十岁，夷灭三族。",
  wujing: "吴景，本吴郡吴县（今江苏苏州）人，后迁居吴郡钱塘（今浙江杭州），孙坚妻子吴夫人（武烈皇后）之弟，孙策和孙权的舅舅，东汉末年将领。吴景因追随孙坚征伐有功，被任命为骑都尉。袁术上表举荐吴景兼任丹杨太守，讨伐前任太守周昕，占据丹杨。后遭扬州刺史刘繇逼迫，再度依附袁术，袁术任用他为督军中郎将，与孙贲共同进击樊能等人。又在秣陵攻打笮融、薛礼。袁术与刘备争夺徐州时，任吴景为广陵太守。建安二年（197年），吴景放弃广陵东归孙策，孙策任他为丹杨太守。朝廷使者吴景为扬武将军，郡守之职照旧。建安八年（203年），吴景死于任上。",
  feiyi: "费祎（？～253年2月），字文伟，江夏鄳县（今河南省罗山县）人，三国时期蜀汉名臣，与诸葛亮、蒋琬、董允并称为蜀汉四相。深得诸葛亮器重，屡次出使东吴，孙权、诸葛恪、羊茞等人以辞锋刁难，而费祎据理以答，辞义兼备，始终不为所屈。孙权非常惊异于他的才能，加以礼遇。北伐时为中护军，又转为司马。当时魏延与杨仪不和，经常争论，费祎常为二人谏喻，两相匡护，以尽其用。诸葛亮死后，初为后军师，再为尚书令，官至大将军，封成乡侯。费祎主政时，与姜维北伐的主张相左，执行休养生息的政策，为蜀汉的发展尽心竭力。费祎性格谦恭真诚，颇为廉洁，家无余财。后为魏降将郭循（一作郭脩）行刺身死。葬于今广元市昭化古城城西。",
  luotong: "骆统（193年－228年），字公绪。会稽郡乌伤县（今浙江义乌）人。东汉末年至三国时期吴国将领、学者，陈国相骆俊之子。骆统二十岁时已任乌程国相，任内有政绩，使得国中民户过万。又迁为功曹，行骑都尉。曾劝孙权尊贤纳士，省役息民。后出任为建忠中郎将。将军凌统逝世后，统领其部曲。因战功迁偏将军，封新阳亭侯，任濡须督。黄武七年（228年），骆统去世，年仅三十六岁。有集十卷，今已佚。"
};
const characterFilters = {};
const dynamicTranslates = {
  spzhenting(player, skill) {
    if (player.hasSkill("spjincui_delete")) {
      return "每回合限一次。当你或你攻击范围内的角色成为【杀】或延时锦囊的目标时，若你不是此牌的使用者，你可选择一项：①弃置使用者的一张手牌；②摸一张牌。";
    }
    return lib.translate[`${skill}_info`];
  }
};
const perfectPairs = {};
const voices = {
  "#yuli1": "驭元始之用，执生杀之机！",
  "#yuli2": "号令雷霆，上照天心！",
  "#yuli3": "抗我神威者，俱为齑粉！",
  "#yuli4": "万钧所压，再无生还！",
  "#yuli5": "惊霆九殛，锻我神魂！",
  "#yuli6": "玄雷淬锋，砺我神威！",
  "#tingwei1": "尔可再问汝心，岂欲与天一战？",
  "#tingwei2": "望我者惧怖，闻我者悚骇！",
  "#tingwei3": "雷敕已传，三界难逃！",
  "#tingwei4": "跪下！迎接你的神罚！",
  "#jimie1": "万物重归于寂，天地唯颂我名！",
  "#jimie2": "赐万物寂然，赐万界终灭！",
  "#jimie3": "此世终末之时，我将再度照临！",
  "#jimie4": "我乃万法之法，戮神之神！",
  "#mb_shen_machao:die": "我裁万世，何以裁我……",
  "#mbxinghun1": "仰观紫微知兴替，俯察将星照铁衣。",
  "#mbxinghun2": "既晓九星所向，傲破万难独前。",
  "#mbtiantao1": "以此天穹之水，涤瑕荡秽。",
  "#mbtiantao2": "心怀浊恶之徒，岂能成神雨之清？",
  "#mbshenpei1": "雄山峻壑终踏过，须信寒过总是春。",
  "#mbshenpei2": "世有云霓之望，维必借天馈之！",
  "#mbhuitian1": "胸怀赤义，敢问苍天争命数！",
  "#mbhuitian2": "但凭天数，偏立腹地逆乾坤！",
  "#mbhuitian3": "何妨后人评说，维自无愧苍生。",
  "#mbhuitian4": "山河依在，碧血长流！",
  "#mb_shen_jiangwei:die": "身陨何妨作星斗，与日同天卫九州。",
  "#dingzhou1": "今肃亲往，主公何愁不定！",
  "#dingzhou2": "肃之所至，万事皆平！",
  "#tamo1": "天下分崩，乱之已极，肃竭浅智，窃为君计。",
  "#tamo2": "天下易主，已为大势，君当据此，以待其时。",
  "#zhimeng1": "豫州何图远窜，而不投吾雄略之主乎？",
  "#zhimeng2": "吾主英明神武，曹众虽百万亦无所惧！",
  "#shen_lusu:die": "常计小利，何成大局……",
  "#wuling1": "吾创五禽之戏，君可作以除疾。",
  "#wuling2": "欲解万般苦，驱身仿五灵。",
  "#youyi1": "此身行医，志济万千百姓。",
  "#youyi2": "普济众生，永免疾患之苦。",
  "#shen_huatuo:die": "人间诸疾未解，老夫怎入轮回……",
  "#yingba1": "从我者可免，拒我者难容！",
  "#yingba2": "卧榻之侧，岂容他人鼾睡！",
  "#scfuhai1": "翻江复蹈海，六合定乾坤！",
  "#scfuhai2": "力攻平江东，威名扬天下！",
  "#pinghe1": "不过胆小鼠辈，吾等有何惧哉！",
  "#pinghe2": "只可得胜而返，岂能败战而归！",
  "#shen_sunce:die": "无耻小人！竟敢暗算于我……",
  "#tianzuo1": "此时进之多弊，守之多利，愿主公熟虑。",
  "#tianzuo2": "主公若不时定，待四方生心，则无及矣。",
  "#lingce1": "绍士卒虽众，其实难用，必无为也。",
  "#lingce2": "袁军不过一盘砂砾，主公用奇则散。",
  "#dinghan1": "杀身有地，报国有时。",
  "#dinghan2": "益国之事，虽死弗避。",
  "#shen_xunyu:die": "宁鸣而死，不默而生……",
  "#dulie1": "素来言出必践，成吾信义昭彰！",
  "#dulie2": "小信如若不成，大信将以何立？",
  "#tspowei1": "弓马骑射洒热血，突破重围显英豪！",
  "#tspowei2": "敌军尚犹严防，有待明日再看！",
  "#tspowei3": "君且城中等候，待吾探敌虚实。",
  "#shenzhu1": "力引强弓百斤，矢除贯手著棼！",
  "#shenzhu2": "箭既已在弦上，吾又岂能不发！",
  "#shen_taishici:die": "魂归……天地……",
  "#shuishi1": "聪以知远，明以察微。",
  "#shuishi2": "见微知著，识人心志。",
  "#stianyi1": "天命靡常，惟德是辅。",
  "#stianyi2": "可成吾志者，必此人也！",
  "#sghuishi1": "丧家之犬，主公实不足虑也。",
  "#sghuishi2": "时势兼备，主公复有何忧？",
  "#zuoxing1": "以聪虑难，悉咨于上。",
  "#zuoxing2": "身计国谋，不可两遂。",
  "#zuoxing3": "奉孝不才，愿献勤心。",
  "#shen_guojia:die": "可叹桢干命也迂……",
  "#duanbi1": "收缴故币，以旧铸新，使民有余财。",
  "#duanbi2": "今，若能统一蜀地币制，则利在千秋。",
  "#tongduo1": "辎重调拨，乃国之要务，岂可儿戏！",
  "#tongduo2": "府库充盈，民有余财，主公师出有名矣。",
  "#liuba:die": "孔明，大汉的重担，就全系于你一人之身了……",
  "#yangjie1": "全军彻围，待其出城迎敌，再攻敌自散矣！",
  "#yangjie2": "佯解敌围，而后城外击之，此为易破之道！",
  "#zjjuxiang1": "今非秦项之际，如若受之，徒增逆意！",
  "#zjjuxiang2": "兵有形同而势异者，此次乞降断不可受！",
  "#houfeng1": "交汝统领，勿负我望！",
  "#houfeng2": "有功自当行赏，来人呈上！",
  "#houfeng3": "叉出去！罚其二十军杖！",
  "#sp_zhujun:die": "郭汜小竖！气煞我也！嗯……",
  "#spzhengjun1": "众将平日随心，战则务尽死力！",
  "#spzhengjun2": "汝等不怀余力，皆有平贼之功！",
  "#spzhengjun3": "仁恕之道，终非治军良策！",
  "#spshiji1": "乱民桀逆，非威不服！",
  "#spshiji2": "欲定黄巾，必赖兵革之利！",
  "#sptaoluan1": "敌军依草结营，正犯兵家大忌！",
  "#sptaoluan2": "兵法所云火攻之计，正合此时之势！",
  "#sp_huangfusong:die": "力有所能，臣必为也……",
  "#spdiaodu1": "兵甲统一分配，不可私自易之！",
  "#spdiaodu2": "兵器调度已定，忤者军法从事！",
  "#spdiancai1": "国无九年之蓄，为政安敢奢靡！",
  "#spdiancai2": "上下尚俭戒奢，以足天下之用！",
  "#spyanji1": "料覆之日已到，帐簿速速呈来！",
  "#spyanji2": "所记无有纰漏，余财尚可维持！",
  "#spyanji3": "帐簿收支不符，何人敢做假账！",
  "#sp_lvfan:die": "今日朝事，可有……",
  "#spjianyi1": "今虽富贵，亦不可浪费。",
  "#spjianyi2": "缩衣克俭，才是兴家之道。",
  "#spshangyi1": "国士，当以义为先！",
  "#spshangyi2": "豪侠尚义，何拘俗礼！",
  "#sp_jiangqing:die": "奋敌护主，成吾忠名……",
  "#spzhenting1": "政为安民之本，不以修饰为先。",
  "#spzhenting2": "镇外息内，邦家合一，方堪社稷之器。",
  "#spzhenting3": "而今大局为重，诸君且共筹谋！",
  "#spzhenting4": "吾但在一日，汉室绝无倾危！",
  "#spjincui1": "伐魏虽俯仰惟艰，臣甘愿效死于前！",
  "#spjincui2": "臣敢竭股肱之力，誓死为陛下前驱！",
  "#spjincui3": "汉室兴衰，只系吾等之身！",
  "#spjincui4": "此法若行，大汉生机可续！",
  "#sp_jiangwan:die": "臣即将一死，辅国之事文伟可继……",
  "#spdifei1": "称病不见，待其自露马脚。",
  "#spdifei2": "孙氏之诽，伤不到我分毫。",
  "#spyanjiao1": "此篇未记，会儿便不可嬉戏。",
  "#spyanjiao2": "母亲虽严，却皆为汝好。",
  "#sp_zhangchangpu:die": "钟氏门楣，待我儿光耀……",
  "#spyajun1": "君子如珩，缨绂有容！",
  "#spyajun2": "仁声未闻，岂可先计后兵！",
  "#spzundi1": "盖闻春秋之义，立子自当立长。",
  "#spzundi2": "五官将才德兼备，是以宜承正统。",
  "#sp_cuiyan:die": "生当如君子，死当追竹德……",
  "#spxiangzhen1": "象兵便可退敌，何劳本姑娘亲往？",
  "#spxiangzhen2": "哼！象阵所至，尽皆纷乱之师。",
  "#spfangzong1": "一战结缘难再许，痛为大义斩此情！",
  "#spfangzong2": "将军处处留情，小女芳心暗许。",
  "#spxizhan1": "哎呀~母亲放心，鬘儿不会捣乱的。",
  "#spxizhan2": "本姑娘只是戏耍一番，尔等怎下如此重手！",
  "#spxizhan3": "战场纵非玩乐之所，尔等又能奈我何？",
  "#spxizhan4": "嘻嘻，这样才好玩嘛。",
  "#spxizhan5": "哼！让你瞧瞧本姑娘的厉害！",
  "#sp_huaman:die": "战事已定，吾愿终亦得偿……",
  "#spjungong1": "曹军营守，不能野战，此乃攻敌之机！",
  "#spjungong2": "若此营攻之不下，览何颜面见袁公！",
  "#spdengli1": "纵尔勇冠天下，吾亦不退半分！",
  "#spdengli2": "虚名何足夸口，败吾休得再提！",
  "#sp_gaolan:die": "满腹忠肝，难抵一句谮言……唉！",
  "#zaoli1": "喜怒不形于色，诈伪要明之徒。",
  "#zaoli2": "摇舌鼓唇，竖子是之也！",
  "#sunyi:die": "叛我贼子，虽死亦不饶之……",
  "#yiyong1": "这么着急回营？哼！那我就送你一程！",
  "#yiyong2": "你的兵器，本大爷还给你！哈哈哈哈！",
  "#shanxie1": "快快取我兵器，与我上阵杀敌！",
  "#shanxie2": "哈哈！还是自己的兵器用着趁手！",
  "#sp_wangshuang:die": "啊？速回主营！啊！",
  "#zhibian1": "两国各增守将，皆事势宜然，何足相问。",
  "#zhibian2": "固边大计，乃立国之本，岂有不设之理。",
  "#yuyan1": "正直敢言，不惧圣怒。",
  "#yuyan2": "威武不能屈，方为大丈夫。",
  "#sp_zongyu:die": "此次出使，终不负陛下期望……",
  "#qingjue1": "兵者，凶器也，宜不得已而用之。",
  "#qingjue2": "鼓之以道德，征之以仁义，才可得百姓之心。",
  "#fengjie1": "见贤思齐，内自省也。",
  "#fengjie2": "立本于道，置身于正。",
  "#yuanhuan:die": "乱世之中，有礼无用啊……",
  "#spyilie1": "哈哈哈哈！来吧！",
  "#spyilie2": "哼！都来受死！",
  "#spfenming1": "合肥一役，吾等必拼死效力！",
  "#spfenming2": "主公勿忧，待吾等上前一战！",
  "#sp_chendong:die": "陛下速退！",
  "#dbquedi1": "力摧敌阵，如视天光破云！",
  "#dbquedi2": "让尔等有命追，无命回！",
  "#dbzhuifeng1": "率军冲锋，不惧刀枪所阻！",
  "#dbzhuifeng2": "登锋履刃，何妨马革裹尸！",
  "#dbchongjian1": "尔等良将，于我不堪一击！",
  "#dbchongjian2": "此等残兵，破之何其易也！",
  "#dbchoujue1": "血海深仇，便在今日来报！",
  "#dbchoujue2": "取汝之头，以祭先父！",
  "#db_wenyang:die": "半生功业，而见疑于一家之言，岂能无怨！",
  "#mingfa1": "明日即为交兵之时，望尔等早做准备。",
  "#mingfa2": "吾行明伐之策，不为掩袭之计。",
  "#rongbei1": "我军虽以德感民，亦不可废弛武备。",
  "#rongbei2": "缮甲训卒，广为戎备，不失伐吴之机。",
  "#sp_yanghu:die": "此生所憾，唯未克东吴也……",
  "#yizhu1": "老夫有二女，视之如明珠。",
  "#yizhu2": "将军若得遇小女，万望护送而归。",
  "#luanchou1": "愿汝永结鸾俦，以期共盟鸳蝶。",
  "#luanchou2": "夫妻相濡以沫，方可百年偕老。",
  "#qiaogong:die": "为父所念，为汝二人啊……",
  "#xiusheng1": "百姓安乐足矣，穷兵黩武实不可取啊。",
  "#xiusheng2": "内乱初定，更应休养生息。",
  "#yinlang1": "益州疲敝，还望贤兄相助。",
  "#yinlang2": "内讨米贼，外拒强曹，璋无宗兄，万万不可啊。",
  "#huaibi1": "哎！吾本无罪，怀璧其罪啊。",
  "#huaibi2": "粮草尽皆在此，宗兄可自取之。",
  "#liuzhang:die": "引狼入室，噬脐莫及啊！",
  "#gebo1": "握手言和，永罢刀兵。",
  "#gebo2": "重归于好，摒弃前仇。",
  "#spsongshu1": "称美蜀政，祛其疑贰之心。",
  "#spsongshu2": "蜀地君明民乐，实乃太平之治。",
  "#sp_zhangwen:die": "自招罪谴，诚可悲疚……",
  "#jishi1": "勤求古训，常怀济人之志。",
  "#jishi2": "博采众方，不随趋势之徒。",
  "#liaoyi1": "麻黄之汤，或可疗伤寒之疫。",
  "#liaoyi2": "望闻问切，因病施治。",
  "#binglun1": "受病有深浅，使药有重轻。",
  "#binglun2": "三分需外治，七分靠内养。",
  "#zhangzhongjing:die": "得人不传，恐成坠绪……",
  "#boming1": "先载附从，吾后行即可。",
  "#boming2": "诸位速速上船，靖随后便至。",
  "#ejian1": "为政者当沙汰秽浊，显拔幽滞，以顺民心。",
  "#ejian2": "此所谓寡助之至，天下叛之矣。",
  "#sp_xujing:die": "吾……必秉德无怠，以称帝心……",
  "#yuanqing1": "怀瑾瑜，握兰桂，而心若芷萱。",
  "#yuanqing2": "嘉言懿行，如渊之清，如玉之洁。",
  "#shuchen1": "陛下应先留心于治道，以征伐为后事也。",
  "#shuchen2": "陛下若修文德，察民疾苦，则天下幸甚。",
  "#sp_huaxin:die": "为虑国计，身损可矣……",
  "#guying1": "我军之营，犹如磐石之固！",
  "#guying2": "深壁固垒，敌军莫敢来侵！",
  "#muzhen1": "行阵和睦，方可优劣得所。",
  "#muzhen2": "识时达务，才可上和下睦。",
  "#xiangchong:die": "蛮夷怀异，战乱难平……",
  "#sheyi1": "二子不可兼顾，妾身唯保其一。",
  "#sheyi2": "吾子虽弃亦可，前遗万勿有失。",
  "#tianyin1": "抚琴体清心远，方成自然之趣。",
  "#tianyin2": "心怀雅正，天音自得。",
  "#caizhenji:die": "世誉吾为贤妻，吾愧终不为良母……",
  "#splirang1": "人之所至，礼之所及。",
  "#splirang2": "施之以礼，还之以德。",
  "#spmingshi1": "纵有强权在侧，亦不可失吾风骨。",
  "#spmingshi2": "黜邪崇正，何惧之有？",
  "#sp_kongrong:die": "不遵朝仪？诬害之词也！",
  "#xianghai1": "快快闪开，伤到你们可就不好了，哈哈哈！",
  "#xianghai2": "你自己撞上来的，这可怪不得小爷我！",
  "#chuhai1": "有我在此，安敢为害？！",
  "#chuhai2": "小小孽畜，还不伏诛？！",
  "#chuhai3": "此番不成，明日再战！",
  "#zhouchu:die": "改励自砥，誓除三害……",
  "#xunyi1": "古有死恩之士，今有殉义之人！",
  "#xunyi2": "舍身殉义，为君效死！",
  "#wangfuzhaolei:die": "誓死……追随将军左右！",
  "#xingqi1": "司马氏虽权尊势重，吾等徐图亦无不可！",
  "#xingqi2": "先谋后事者昌，先事后谋者亡！",
  "#zifu1": "有心无力，请罪愿降。",
  "#zifu2": "舆榇自缚，只求太傅开恩！",
  "#mibei1": "密为之备，不可有失。",
  "#mibei2": "事以密成，语以泄败！",
  "#wangling:die": "一生尽忠事魏，不料今日晚节尽毁啊！",
  "#heji1": "你我合势而击之，区区贼寇岂会费力？",
  "#heji2": "伯符！今日之战，务必全力攻之！",
  "#liubing1": "尔等流寇，亦可展吾军之勇。",
  "#liubing2": "流寇不堪大用，勤加操练可为精兵。",
  "#wujing:die": "贼寇未除，奈何吾身先丧……",
  "#xinguixiu1": "身陷绝境，亦须秉端庄之姿。",
  "#xinguixiu2": "纵吾身罹乱，焉能隳节败名。",
  "#qingyu1": "大家之韵，不可失之。",
  "#qingyu2": "朱沉玉没，桂殒兰凋。",
  "#qingyu3": "冰清玉粹，岂可有污！",
  "#sp_mifuren:die": "妾命数已至，惟愿阿斗顺利归蜀……",
  "#spyinju1": "伐吴者，兴师劳民，徒而无功，万望陛下三思！",
  "#spyinju2": "今当屯田罢兵，徐图吴蜀，安能急躁冒进乎？",
  "#spchijie1": "节度在此，诸将莫要轻进。",
  "#spchijie2": "吾奉天子明诏，整肃六军。",
  "#sp_xinpi:die": "生而立于朝堂，亡而留名青史，我，已无憾矣……",
  "#fyjianyu1": "功以才成，业由才广，弃才不用，非长计也。",
  "#fyjianyu2": "舍此不任而防后患，是备风波而废舟楫也。",
  "#feiyi:die": "臣请告陛下，宦权日盛，必乱社稷也……",
  "#spwanwei1": "梁、沛之间，无子廉焉有今日？",
  "#spwanwei2": "汝兄弟皆为手足，何必苦苦相逼？",
  "#spyuejian1": "吾母仪天下，于节俭处当率先垂范。",
  "#spyuejian2": "取上为贪，取下为伪，妾则取其中者。",
  "#sp_bianfuren:die": "夫君，妾身终于要随您而去了……",
  "#spwuku1": "损益万枢，竭世运机。",
  "#spwuku2": "胸藏万卷，充盈如库。",
  "#spsanchen1": "贼计已穷，陈兵吴地，可一鼓而下也。",
  "#spsanchen2": "伐吴此举，十有九利，惟陛下察之。",
  "#sp_duyu:die": "洛水圆石，遂道向南，吾将以俭自完耳……",
  "#qinzheng1": "夫国之有民，犹水之有舟，停则以安，扰则以危。",
  "#qinzheng2": "治疾及其未笃，除患贵其莫深。",
  "#luotong:die": "臣统之大愿，足以死而不朽矣……",
  "#spqiai1": "恨我无时谋，譬诸具官臣。",
  "#spqiai2": "鞠躬中坚内，微画无所陈。",
  "#spshanxi1": "连舫逾万艘，带甲千万人。",
  "#spshanxi2": "率彼东南路，将定一举勋。",
  "#sp_wangcan:die": "虽无铅刀用，庶几奋薄身……",
  "#shameng1": "歃血盟誓，以告神明。",
  "#shameng2": "戮力一心，同讨魏贼。",
  "#sp_chenzhen:die": "震不负丞相所托……",
  "#mjdingyi1": "经国序民，还需制礼定仪。",
  "#mjdingyi2": "无礼而治世，欲使国泰，安可得哉？",
  "#zuici1": "既为朝堂宁定，吾请辞便是。",
  "#zuici2": "国事为先，何惧清名有损！",
  "#fubi1": "辅君弼主，士之所志也。",
  "#fubi2": "献策思计，佐定江山。",
  "#sp_sunshao:die": "江东将相各有所能，奈何心向不一……",
  "#mjweipo1": "想必……将军心中已有所计较。",
  "#mjweipo2": "谌言尽于此，采纳与否还凭将军。",
  "#mjchenshi1": "将军已为此二者所围，形势实不容乐观。",
  "#mjchenshi2": "此二人若合力攻之，则将军危矣。",
  "#mjmouzhi1": "潜谋于无形，胜于不争不费。",
  "#mjmouzhi2": "欲思其成，必虑其败也。",
  "#sp_xunchen:die": "袁公不济，吾自当以死继之……",
  "#gonghuan1": "曹魏势大，吴蜀当共拒之。",
  "#gonghuan2": "两国得此联姻，邦交更当稳固。",
  "#mouli1": "澄汰王室，迎立宗子！",
  "#mouli2": "僣孽为害，吾岂可谋而不行？",
  "#xuancun1": "阿斗年幼，望子龙将军仔细！",
  "#xuancun2": "今得见将军，此儿有望生矣。",
  "#spmiewu1": "倾荡之势已成，石城尽在眼下。",
  "#spmiewu2": "吾军势如破竹，江东六郡唾手可得。"
};
const characterSort = {
  mobile_shijizhi: ["sp_wangcan", "sp_chenzhen", "sp_sunshao", "sp_xunchen", "luotong", "sp_duyu", "sp_bianfuren", "feiyi", "shen_guojia", "shen_xunyu"],
  mobile_shijixin: ["wujing", "sp_mifuren", "sp_xinpi", "wangling", "wangfuzhaolei", "zhouchu", "sp_kongrong", "sp_yanghu", "shen_taishici", "shen_sunce"],
  mobile_shijiren: ["caizhenji", "xiangchong", "sp_huaxin", "sp_xujing", "zhangzhongjing", "sp_zhangwen", "liuzhang", "qiaogong", "shen_huatuo", "shen_lusu"],
  mobile_shijiyong: ["db_wenyang", "sp_chendong", "yuanhuan", "sp_zongyu", "sp_wangshuang", "sunyi", "sp_gaolan", "sp_huaman", "mb_shen_machao"],
  mobile_shijiyan: ["sp_cuiyan", "sp_zhangchangpu", "sp_jiangwan", "sp_jiangqing", "sp_lvfan", "sp_huangfusong", "sp_zhujun", "liuba", "mb_shen_jiangwei"]
};
const characterSortTranslate = {
  mobile_shijiren: "始计篇·仁",
  mobile_shijizhi: "始计篇·智",
  mobile_shijixin: "始计篇·信",
  mobile_shijiyong: "始计篇·勇",
  mobile_shijiyan: "始计篇·严"
};
game.import("character", function() {
  return {
    name: "shiji",
    connect: true,
    character: { ...characters },
    characterSort: {
      shiji: characterSort
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
