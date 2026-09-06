import { lib, get, _status, ui, game } from "noname";
const characters = {
  chengjichengcui: {
    sex: "male",
    group: "wei",
    hp: 6,
    skills: ["oltousui", "olchuming"],
    names: "成|济-成|倅",
    groupBorder: "jin"
  },
  wangxiang: {
    sex: "male",
    group: "jin",
    hp: 3,
    skills: ["bingxin"]
  },
  jin_jiachong: {
    sex: "male",
    group: "jin",
    hp: 3,
    skills: ["xiongshu", "jianhui"]
  },
  xuangongzhu: {
    sex: "female",
    group: "jin",
    hp: 3,
    skills: ["gaoling", "qimei", "ybzhuiji"],
    hasHiddenSkill: true,
    names: "司马|null"
  },
  xinchang: {
    sex: "male",
    group: "jin",
    hp: 3,
    skills: ["canmou", "congjian"]
  },
  yangzhi: {
    sex: "female",
    group: "jin",
    hp: 3,
    skills: ["xinwanyi", "maihuo"],
    clans: ["弘农杨氏"]
  },
  yangyan: {
    sex: "female",
    group: "jin",
    hp: 3,
    skills: ["xinxuanbei", "xianwan"],
    clans: ["弘农杨氏"]
  },
  ol_huaxin: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["caozhao", "olxibing"]
  },
  zhongyan: {
    sex: "female",
    group: "jin",
    hp: 3,
    skills: ["bolan", "yifa"],
    clans: ["颍川钟氏"]
  },
  weiguan: {
    sex: "male",
    group: "jin",
    hp: 3,
    skills: ["zhongyun", "shenpin"]
  },
  cheliji: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["chexuan", "qiangshou"],
    names: "null|null"
  },
  simazhou: {
    sex: "male",
    group: "jin",
    hp: 4,
    skills: ["recaiwang", "naxiang"],
    names: "司马|伷"
  },
  ol_lisu: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["qiaoyan", "xianzhu"]
  },
  jin_yanghuiyu: {
    sex: "female",
    group: "jin",
    hp: 3,
    skills: ["huirong", "ciwei", "caiyuan"],
    hasHiddenSkill: true
  },
  shibao: {
    sex: "male",
    group: "jin",
    hp: 4,
    skills: ["zhuosheng"]
  },
  jin_zhangchunhua: {
    sex: "female",
    group: "jin",
    hp: 3,
    skills: ["huishi", "qingleng", "xuanmu"],
    hasHiddenSkill: true
  },
  jin_simayi: {
    sex: "male",
    group: "jin",
    hp: 3,
    skills: ["buchen", "smyyingshi", "xiongzhi", "xinquanbian"],
    hasHiddenSkill: true,
    names: "司马|懿"
  },
  jin_wangyuanji: {
    sex: "female",
    group: "jin",
    hp: 3,
    skills: ["shiren", "yanxi"],
    hasHiddenSkill: true
  },
  jin_simazhao: {
    sex: "male",
    group: "jin",
    hp: 3,
    skills: ["tuishi", "xinchoufa", "zhaoran", "chengwu"],
    isZhugong: true,
    hasHiddenSkill: true,
    names: "司马|昭"
  },
  jin_xiahouhui: {
    sex: "female",
    group: "jin",
    hp: 3,
    skills: ["baoqie", "jyishi", "shiduo"],
    hasHiddenSkill: true,
    names: "夏侯|徽"
  },
  jin_simashi: {
    sex: "male",
    group: "jin",
    hp: 3,
    maxHp: 4,
    skills: ["taoyin", "yimie", "ruilve", "tairan"],
    hasHiddenSkill: true,
    isZhugong: true,
    names: "司马|师"
  },
  zhanghuyuechen: {
    sex: "male",
    group: "jin",
    hp: 4,
    skills: ["xijue"],
    names: "张|虎-乐|綝"
  },
  duyu: {
    sex: "male",
    group: "jin",
    hp: 4,
    skills: ["sanchen", "zhaotao"]
  }
};
const cards = {
  cheliji_sichengliangyu: {
    fullskin: true,
    vanish: true,
    derivation: "cheliji",
    destroy: "chexuan",
    type: "equip",
    subtype: "equip5",
    cardcolor: "heart",
    skills: ["cheliji_sichengliangyu"]
  },
  cheliji_tiejixuanyu: {
    fullskin: true,
    vanish: true,
    derivation: "cheliji",
    destroy: "chexuan",
    type: "equip",
    subtype: "equip5",
    cardcolor: "club",
    skills: ["cheliji_tiejixuanyu"]
  },
  cheliji_feilunzhanyu: {
    fullskin: true,
    vanish: true,
    derivation: "cheliji",
    destroy: "chexuan",
    type: "equip",
    subtype: "equip5",
    cardcolor: "spade",
    skills: ["cheliji_feilunzhanyu"]
  }
};
const pinyins = {};
const skills = {
  //二成
  oltousui: {
    audio: 2,
    enable: "chooseToUse",
    viewAsFilter(player) {
      return player.countCards("he") > 0;
    },
    viewAs: {
      name: "sha",
      /*suit: "none",
      number: null,*/
      cards: [],
      isCard: true
    },
    filterCard: true,
    selectCard: [1, Infinity],
    position: "he",
    check(card) {
      const player = get.player();
      return 4.5 + (player.hasSkill("olchuming") ? 1 : 0) - 1.5 * ui.selected.cards.length - get.value(card);
    },
    popname: true,
    ignoreMod: true,
    log: false,
    allowChooseAll: true,
    async precontent(event, trigger, player) {
      var evt = event.getParent();
      if (evt.dialog && typeof evt.dialog == "object") {
        evt.dialog.close();
      }
      player.logSkill("oltousui");
      var cards2 = event.result.cards;
      await player.loseToDiscardpile(cards2, ui.cardPile, false, "blank").set("log", false);
      var shownCards = cards2.filter((i) => get.position(i) == "e"), handcardsLength = cards2.length - shownCards.length;
      if (shownCards.length) {
        player.$throw(shownCards, null);
        game.log(player, "将", shownCards, "置于了牌堆底");
      }
      if (handcardsLength > 0) {
        player.$throw(handcardsLength, null);
        game.log(player, "将", get.cnNumber(handcardsLength), "张牌置于了牌堆底");
      }
      await game.delayex();
      var viewAs = new lib.element.VCard({ name: event.result.card.name, isCard: true });
      event.result.card = viewAs;
      event.result.cards = [];
      event.result._apply_args = {
        shanReq: cards2.length,
        oncard: () => {
          var evt2 = get.event();
          for (var target of game.filterPlayer(null, null, true)) {
            var id = target.playerid;
            var map = evt2.customArgs;
            if (!map[id]) {
              map[id] = {};
            }
            map[id].shanRequired = evt2.shanReq;
          }
        }
      };
    },
    ai: {
      order(item, player) {
        return get.order({ name: "sha" }) + 0.1;
      },
      result: { player: 1 },
      keepdu: true,
      respondSha: true,
      skillTagFilter: (player, tag, arg) => {
        if (tag == "respondSha" && arg === "respond") {
          return false;
        }
      }
    }
  },
  olchuming: {
    audio: 2,
    trigger: {
      source: "damageBegin1",
      player: "damageBegin3"
    },
    filter(event, player) {
      if (event.source === event.player) {
        return false;
      }
      if (!event.card || !event.cards || !event.cards.length) {
        return true;
      }
      let target = event[player === event.source ? "player" : "source"];
      return target && target.isIn();
    },
    forced: true,
    async content(event, trigger, player) {
      if (!trigger.card || !trigger.cards || !trigger.cards.length) {
        trigger.num++;
        event.finish();
        return;
      } else {
        var target = trigger[trigger.source == player ? "player" : "source"];
        trigger._olchuming = true;
        target.addTempSkill("olchuming_effect");
      }
    },
    ai: {
      effect: {
        player(card, player, target) {
          if (!get.tag(card, "damage")) {
            return;
          }
          if (!lib.card[card.name] || !card.cards || !card.cards.length) {
            return [1, 0, 2, 0];
          }
          return [1, -1];
        },
        target(card, player, target) {
          if (!get.tag(card, "damage")) {
            return;
          }
          if (!lib.card[card.name] || !card.cards || !card.cards.length) {
            return 2;
          }
          return [1, -1];
        }
      },
      combo: "oltousui",
      halfneg: true
    },
    subSkill: {
      effect: {
        charlotte: true,
        trigger: { global: "phaseEnd" },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          var mapx = {};
          var history = player.getHistory("damage").concat(player.getHistory("sourceDamage"));
          history.forEach((evt) => {
            if (!evt._olchuming) {
              return;
            }
            var target = evt[evt.source == player ? "player" : "source"];
            if (!target.isIn()) {
              return;
            }
            var cards3 = evt.cards.filterInD("d");
            if (!cards3.length) {
              return;
            }
            if (!mapx[target.playerid]) {
              mapx[target.playerid] = [];
            }
            mapx[target.playerid].addArray(cards3);
          });
          var entries = Object.entries(mapx).map((entry2) => {
            return [(_status.connectMode ? lib.playerOL : game.playerMap)[entry2[0]], entry2[1]];
          });
          if (!entries.length) {
            event.finish();
            return;
          }
          player.logSkill(
            "olchuming_effect",
            entries.map((i) => i[0])
          );
          entries.sort((a, b) => lib.sort.seat(a[0], b[0]));
          for (var entry of entries) {
            var current = entry[0], cards2 = entry[1];
            var list = ["jiedao", "guohe"].filter((i) => player.canUse(new lib.element.VCard({ name: i, cards: cards2 }), current, false));
            if (!list.length) {
              return;
            }
            var result = {};
            if (list.length == 1) {
              result = { bool: true, links: [["", "", list[0]]] };
            } else {
              result = await player.chooseButton([`畜鸣：请选择要对${get.translation(current)}使用的牌`, [list, "vcard"]], true).set("ai", (button) => {
                var player2 = get.player();
                return get.effect(get.event().currentTarget, { name: button.link[2] }, player2, player2);
              }).set("currentTarget", current).forResult();
            }
            if (result.bool) {
              var card = get.autoViewAs({ name: result.links[0][2] }, cards2);
              if (player.canUse(card, current, false)) {
                player.useCard(card, cards2, current, false);
              }
            }
          }
        }
      }
    }
  },
  bingxin: {
    audio: 2,
    enable: "chooseToUse",
    hiddenCard(player, name) {
      if (get.type(name) == "basic" && lib.inpile.includes(name) && !player.getStorage("bingxin_count").includes(name)) {
        return true;
      }
    },
    filter(event, player) {
      if (event.type == "wuxie") {
        return false;
      }
      var hs = player.getCards("h");
      if (hs.length != Math.max(0, player.hp)) {
        return false;
      }
      if (hs.length > 1) {
        var color = get.color(hs[0], player);
        for (var i = 1; i < hs.length; i++) {
          if (get.color(hs[i], player) != color) {
            return false;
          }
        }
      }
      var storage = player.storage.bingxin_count;
      for (var i of lib.inpile) {
        if (get.type(i) != "basic") {
          continue;
        }
        if (storage && storage.includes(i)) {
          continue;
        }
        var card = { name: i, isCard: true };
        if (event.filterCard(card, player, event)) {
          return true;
        }
        if (i == "sha") {
          for (var j of lib.inpile_nature) {
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
        var list = [];
        var storage = player.storage.bingxin_count;
        for (var i of lib.inpile) {
          if (get.type(i) != "basic") {
            continue;
          }
          if (storage && storage.includes(i)) {
            continue;
          }
          var card = { name: i, isCard: true };
          if (event.filterCard(card, player, event)) {
            list.push(["基本", "", i]);
          }
          if (i == "sha") {
            for (var j of lib.inpile_nature) {
              card.nature = j;
              if (event.filterCard(card, player, event)) {
                list.push(["基本", "", i, j]);
              }
            }
          }
        }
        return ui.create.dialog("冰心", [list, "vcard"], "hidden");
      },
      check(button) {
        if (button.link[2] == "shan") {
          return 3;
        }
        var player = _status.event.player;
        if (button.link[2] == "jiu") {
          if (player.getUseValue({ name: "jiu" }) <= 0) {
            return 0;
          }
          if (player.countCards("h", "sha")) {
            return player.getUseValue({ name: "jiu" });
          }
          return 0;
        }
        return player.getUseValue({ name: button.link[2], nature: button.link[3] }) / 4;
      },
      backup(links, player) {
        return {
          selectCard: -1,
          filterCard: () => false,
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            isCard: true
          },
          log: false,
          async precontent(event, trigger, player2) {
            player2.logSkill("bingxin");
            await player2.draw();
            const name = event.result.card?.name;
            player2.addTempSkill("bingxin_count");
            player2.markAuto("bingxin_count", [name]);
          }
        };
      },
      prompt(links, player) {
        var name = links[0][2];
        var nature = links[0][3];
        return "摸一张并视为使用" + (get.translation(nature) || "") + get.translation(name);
      }
    },
    ai: {
      order: 10,
      respondShan: true,
      respondSha: true,
      skillTagFilter(player, tag, arg) {
        if (arg == "respond") {
          return false;
        }
        var hs = player.getCards("h");
        if (hs.length != Math.max(0, hs.length)) {
          return false;
        }
        if (hs.length > 1) {
          var color = get.color(hs[0], player);
          for (var i = 1; i < hs.length; i++) {
            if (get.color(hs[i], player) != color) {
              return false;
            }
          }
        }
        var storage = player.storage.bingxin_count;
        if (storage && storage.includes("s" + tag.slice(8))) {
          return false;
        }
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
    subSkill: { count: { charlotte: true, onremove: true } }
  },
  zhefu: {
    audio: 2,
    trigger: { player: ["useCardAfter", "respondAfter"] },
    filter(event, player) {
      return player != _status.currentPhase && game.hasPlayer((current) => current != player && current.countCards("h"));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "令一名有手牌的其他角色弃置一张【" + get.translation(trigger.card.name) + "】，否则受到你造成的1点伤害。", (card, player2, target) => {
        return target != player2 && target.countCards("h") > 0;
      }).set("ai", (target) => {
        const player2 = get.player();
        return get.damageEffect(target, player2, player2) / Math.sqrt(target.countCards("h"));
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      const { name } = trigger.card;
      const { bool } = await target.chooseToDiscard({
        prompt: "弃置一张【" + get.translation(name) + "】或受到1点伤害",
        filterCard(card, player2) {
          return get.name(card) === get.event().namex;
        },
        position: "he",
        ai(card) {
          const { player: player2, take } = get.event();
          if (take || get.name(card) == "tao" && !player2.hasJudge("lebu")) return 0;
          return 8 - get.value(card);
        },
        namex: name,
        take: get.damageEffect(target, player, target) >= 0
      }).forResult();
      if (!bool) await target.damage();
    }
  },
  yidu: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter(event, player) {
      return (event.card.name == "sha" || get.type(event.card, null, false) == "trick" && get.tag(event.card, "damage")) && event.targets.some((target) => {
        return target.countCards("h") > 0 && !target.hasHistory("damage", (evt) => evt.card == event.card);
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return get.event().targets.includes(target);
      }).set(
        "targets",
        trigger.targets.filter((target) => {
          return target.countCards("h") > 0 && !target.hasHistory("damage", (evt) => evt.card == trigger.card);
        })
      ).set("ai", (target) => {
        const player2 = get.player();
        if (target.hasSkillTag("noh")) {
          return 0;
        }
        return -get.attitude(player2, target);
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      if (!target.countCards("h")) {
        return;
      }
      const { cards: cards2 } = await player.choosePlayerCard(target, "遗毒：展示" + get.translation(target) + "的至多三张手牌", true, "h", [1, Math.min(3, target.countCards("h"))]).set("forceAuto", true).set("ai", (button) => {
        if (ui.selected.buttons.length) {
          return 0;
        }
        return 1 + Math.random();
      }).forResult();
      if (!cards2?.length) {
        return;
      }
      await player.showCards(cards2, get.translation(player) + "对" + get.translation(target) + "发动了【遗毒】");
      const color = get.color(cards2[0], target);
      if (cards2.every((card) => get.color(card, target) == color)) {
        await target.modedDiscard(cards2, player);
      }
    }
  },
  xinwanyi: {
    audio: "wanyi",
    trigger: { player: "useCardToTargeted" },
    filter(event, player) {
      return player !== event.target && event.targets.length === 1 && (event.card.name === "sha" || get.type(event.card, null, false) === "trick") && event.target.countCards("he") > 0;
    },
    locked: false,
    logTarget: "target",
    check(event, player) {
      return get.effect(event.target, { name: "guohe_copy2" }, player, player) > 0;
    },
    prompt2: "将该角色的一张牌置于武将牌上作为“嫕”",
    async content(event, trigger, player) {
      const target = trigger.target;
      const result = await player.choosePlayerCard({
        target,
        position: "he",
        forced: true
      }).forResult();
      if (!result.bool || !result.cards?.length) {
        return;
      }
      await player.addToExpansion({
        cards: result.cards,
        source: target,
        animate: "give",
        gaintag: ["xinwanyi"]
      });
    },
    mod: {
      cardEnabled(card, player) {
        const cards2 = player.getExpansions("xinwanyi");
        if (cards2.length) {
          const suit = get.suit(card);
          if (suit === "none") {
            return;
          }
          for (const expansionCard of cards2) {
            if (get.suit(expansionCard, player) === suit) {
              return false;
            }
          }
        }
      },
      cardRespondable(card, player) {
        const cards2 = player.getExpansions("xinwanyi");
        if (cards2.length) {
          const suit = get.suit(card);
          if (suit === "none") {
            return;
          }
          for (const expansionCard of cards2) {
            if (get.suit(expansionCard, player) === suit) {
              return false;
            }
          }
        }
      },
      cardSavable(card, player) {
        const cards2 = player.getExpansions("xinwanyi");
        if (cards2.length) {
          const suit = get.suit(card);
          if (suit === "none") {
            return;
          }
          for (const expansionCard of cards2) {
            if (get.suit(expansionCard, player) === suit) {
              return false;
            }
          }
        }
      },
      cardDiscardable(card, player) {
        const cards2 = player.getExpansions("xinwanyi");
        if (cards2.length) {
          const suit = get.suit(card);
          if (suit === "none") {
            return;
          }
          for (const expansionCard of cards2) {
            if (get.suit(expansionCard, player) === suit) {
              return false;
            }
          }
        }
      }
    },
    marktext: "嫕",
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
    group: "xinwanyi_give",
    subSkill: {
      give: {
        audio: "wanyi",
        trigger: { player: ["phaseJieshuBegin", "damageEnd"] },
        forced: true,
        locked: false,
        filter(event, player) {
          return player.hasExpansions("xinwanyi");
        },
        async content(event, trigger, player) {
          const result = await player.chooseTarget({
            prompt: "婉嫕：令一名角色获得一张“嫕”",
            forced: true,
            ai(target2) {
              const player2 = get.player();
              return get.attitude(player2, target2);
            }
          }).forResult();
          if (!result.bool || !result.targets?.length) {
            return;
          }
          const [target] = result.targets;
          player.line(target, "green");
          const cards2 = player.getExpansions("xinwanyi");
          if (cards2.length === 1) {
            await player.give(cards2, target, true);
            return;
          }
          const result2 = await player.chooseButton({
            createDialog: [`令${get.translation(target)}获得一张“嫕”`, cards2],
            forced: true
          }).forResult();
          if (!result2.bool || !result2.links?.length) {
            return;
          }
          await player.give(result2.links, target, true);
        }
      }
    }
  },
  xinxuanbei: {
    audio: "xuanbei",
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => lib.skill.xinxuanbei.filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return target !== player && target.hasCards("hej");
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const result = await player.choosePlayerCard({
        target,
        position: "hej",
        forced: true
      }).forResult();
      if (!result.bool || !result.cards?.length) {
        return;
      }
      const card = result.cards[0];
      const cardx = get.autoViewAs({ name: "sha" }, [card]);
      if (get.position(card) !== "j" && !game.checkMod(card, target, "unchanged", "cardEnabled2", target) || !target.canUse(cardx, player, false)) {
        return;
      }
      const next = target.useCard({
        card: cardx,
        cards: [card],
        targets: [player],
        addCount: false
      });
      await next;
      const num = player.hasHistory("damage", (evt) => evt.card === next.card) ? 2 : 1;
      await player.draw(num);
    },
    ai: {
      order: 7,
      result: {
        player(player, target) {
          return get.effect(target, { name: "guohe_copy" }, player, player) + get.effect(player, { name: "sha" }, target, player);
        }
      }
    }
  },
  xiongshu: {
    audio: 2,
    trigger: { global: "phaseUseBegin" },
    filter(event, player) {
      return player != event.player && event.player.countCards("h") > 0 && player.countCards("he") >= player.countMark("xiongshu_count");
    },
    logTarget: "player",
    async cost(event, trigger, player) {
      const { player: target } = trigger;
      const num = player.countMark("xiongshu_count");
      const goon = get.attitude(player, target) < 0;
      let next;
      if (num > 0) {
        next = player.chooseToDiscard("he", num, get.prompt(event.skill, target), `弃置${get.cnNumber(num)}张牌并展示其一张手牌`, "chooseonly").set("goon", goon).set("ai", (card) => {
          const { player: player2, goon: goon2 } = get.event();
          if (!goon2) {
            return 0;
          }
          return 6 - player2.countMark("xiongshu_count") - get.value(card);
        });
      } else {
        next = player.chooseBool(get.prompt(event.skill, target), "展示其一张牌").set("goon", goon).set("ai", () => {
          return get.event().goon;
        });
      }
      event.result = await next.forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target],
        cards: cards2,
        name: skillName
      } = event;
      player.addTempSkill(skillName + "_count", "roundStart");
      player.addMark(skillName + "_count", 1, false);
      if (get.itemtype(cards2) == "cards") {
        await player.discard(cards2);
      }
      if (!target.countCards("h")) {
        return;
      }
      let result = await player.choosePlayerCard(target, true, "h").forResult();
      if (!result?.cards?.length) {
        return;
      }
      const [card] = result.cards, name = get.name(card), str = get.translation(target);
      await player.showCards(card, get.translation(player) + "对" + str + "发动了【凶竖】");
      result = await player.chooseControl("会使用", "不会使用").set("prompt", "预测：" + str + "是否会使用" + get.translation(name) + "？").set(
        "choice",
        (() => {
          if (!target.hasValueTarget(card)) {
            return 1;
          }
          return Math.random() < 0.5 ? 0 : 1;
        })()
      ).set("ai", () => get.event().choice).forResult();
      if (typeof result?.index != "number") {
        return;
      }
      const { index } = result;
      if (Math.random() < 0.5) {
        target.storage.xiongshu_ai = name;
        target.addTempSkill("xiongshu_ai", "phaseUseAfter");
      }
      player.when({ global: "phaseUseEnd" }).filter((evt) => evt == trigger).step(async () => {
        if (target.hasHistory("useCard", (evt) => evt.card.name == name && evt.getParent("phaseUse") == trigger) == (index == 0)) {
          if (target.isIn()) {
            await target.damage();
          }
        } else {
          if (target.getCards("hej").includes(card)) {
            await player.gain(card, target, "give");
          } else if (get.position(card, true) == "d") {
            await player.gain(card, "gain2");
          }
        }
      }).assign({ audio: "xiongshu", popup: true }).translation("凶竖");
    },
    ai: { expose: 0.35 },
    subSkill: {
      ai: {
        charlotte: true,
        onremove: true,
        ai: {
          effect: {
            player_use(card, player, target) {
              if (card.name == player.storage.xiongshu_ai) {
                return "zeroplayertarget";
              }
            }
          }
        }
      },
      count: {
        charlotte: true,
        onremove: true
      }
    }
  },
  jianhui: {
    init(player, skill) {
      player.addSkill(skill + "_record");
      const source = player.getAllHistory("damage", (evt) => evt.source && evt.source != player).lastItem?.source;
      if (source) {
        player.storage[skill] = source;
        player.markSkillCharacter(skill, source, "奸回", "这仇我记下了");
        player.addTip(skill, `${get.translation(skill)} ${get.translation(source)}`);
      }
    },
    onremove(player, skill) {
      delete player.storage[skill];
      player.removeSkill(skill + "_record");
      player.removeTip(skill);
    },
    audio: 2,
    getLastPlayer(evt, player) {
      var history = player.getAllHistory("damage");
      if (!history.length) {
        return null;
      }
      var i = history.indexOf(evt);
      if (i == -1) {
        i = history.length - 1;
      } else {
        i--;
      }
      for (i; i >= 0; i--) {
        if (history[i].source && history[i].source != player) {
          return history[i].source;
        }
      }
      return null;
    },
    trigger: { player: "damageEnd" },
    forced: true,
    filter(event, player) {
      return event.source?.isIn() && event.source == lib.skill.jianhui.getLastPlayer(event, player) && event.source.countCards("he") > 0;
    },
    async content(event, trigger, player) {
      await trigger.source.chooseToDiscard("he", true);
    },
    group: "jianhui_draw",
    subSkill: {
      draw: {
        audio: "jianhui",
        trigger: { source: "damageSource" },
        forced: true,
        logTarget: "player",
        filter(event, player) {
          return event.player == lib.skill.jianhui.getLastPlayer(event, player);
        },
        async content(event, trigger, player) {
          await player.draw();
        }
      },
      record: {
        charlotte: true,
        trigger: { player: "damageEnd" },
        filter(event, player) {
          return event.source && event.source !== player.storage.jianhui && (player.getAllHistory("damage", (evt) => evt.source && evt.source != player).indexOf(event) == 0 || event.source == lib.skill.jianhui.getLastPlayer(event, player));
        },
        firstDo: true,
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const { source } = trigger;
          player.storage.jianhui = source;
          player.markSkillCharacter("jianhui", source, "奸回", "这仇我记下了");
          player.addTip("jianhui", `${get.translation("jianhui")} ${get.translation(source)}`);
        }
      }
    }
  },
  huaiyuan: {
    audio: 2,
    trigger: {
      player: "loseAfter",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    getIndex(event, player) {
      if (!event.getl?.(player)?.hs?.length) {
        return false;
      }
      let num = 0;
      if (event.name == "lose") {
        Object.values(event.gaintag_map).flat().forEach((tags) => {
          if (tags.includes("huaiyuanx")) {
            num++;
          }
        });
      } else {
        player.checkHistory("lose", (evt) => {
          if (event != evt.getParent()) {
            return;
          }
          Object.values(evt.gaintag_map).flat().forEach((tags) => {
            if (tags.includes("huaiyuanx")) {
              num++;
            }
          });
        });
      }
      return num;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(true, "请选择【怀远】的目标", "令一名角色执行一项：⒈其的手牌上限+1。⒉其的攻击范围+1。⒊其摸一张牌。").set("ai", (target) => {
        const player2 = get.player();
        let att = get.attitude(player2, target);
        if (att <= 0) {
          return 0;
        }
        if (target.hasValueTarget({ name: "sha" }, false) && !target.hasValueTarget({ name: "sha" })) {
          att *= 2.2;
        }
        if (target.needsToDiscard()) {
          att *= 1.3;
        }
        return att * Math.sqrt(Math.max(1, 4 - target.countCards("h")));
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      player.line(target, "green");
      const str = get.translation(target);
      const result = await player.chooseControl().set("choiceList", [`令${str}的手牌上限+1`, `令${str}的攻击范围+1`, `令${str}摸一张牌`]).set("ai", () => {
        const { player: player2, target: target2 } = get.event();
        if (target2.hasValueTarget({ name: "sha" }, false) && !target2.hasValueTarget({ name: "sha" })) {
          return 1;
        }
        if (target2.needsToDiscard()) {
          return 0;
        }
        return 2;
      }).set("target", target).forResult();
      if (result?.index == 2) {
        await target.draw();
      } else if ([0, 1].includes(result?.index)) {
        target.addSkill("huaiyuan_effect" + result.index);
        target.addMark("huaiyuan_effect" + result.index, 1, false);
        game.log(target, "的", "#g" + ["手牌上限", "攻击范围"][result.index], "+1");
        await game.delayx();
      }
    },
    group: ["huaiyuan_init", "huaiyuan_die"],
    subSkill: {
      init: {
        audio: "huaiyuan",
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        forced: true,
        locked: false,
        filter(event, player) {
          return (event.name != "phase" || game.phaseNumber == 0) && player.countCards("h") > 0;
        },
        async content(event, trigger, player) {
          const hs = player.getCards("h");
          if (hs.length) {
            player.addGaintag(hs, "huaiyuanx");
          }
        }
      },
      die: {
        audio: "huaiyuan",
        trigger: { player: "die" },
        forceDie: true,
        skillAnimation: true,
        animationColor: "water",
        filter(event, player) {
          if (!game.hasPlayer((current) => player != current)) {
            return false;
          }
          return player.hasMark("huaiyuan_effect0") || player.hasMark("huaiyuan_effect1");
        },
        async cost(event, trigger, player) {
          let str = "令一名其他角色", num1 = player.countMark("huaiyuan_effect0"), num2 = player.countMark("huaiyuan_effect1");
          if (num1 > 0) {
            str += "手牌上限+";
            str += num1;
            if (num2 > 0) {
              str += "且";
            }
          }
          if (num2 > 0) {
            str += "攻击范围+";
            str += num2;
          }
          event.result = await player.chooseTarget(lib.filter.notMe, get.prompt(event.skill), str).set("forceDie", true).set("ai", (target) => {
            const player2 = get.player();
            return get.attitude(player2, target) + 114514;
          }).forResult();
        },
        async content(event, trigger, player) {
          const {
            targets: [target]
          } = event;
          const effect = "huaiyuan_effect0", effect1 = "huaiyuan_effect1";
          const num1 = player.countMark(effect), num2 = player.countMark(effect1);
          if (num1 > 0) {
            target.addSkill(effect);
            target.addMark(effect, num1, false);
          }
          if (num2 > 0) {
            target.addSkill(effect1);
            target.addMark(effect1, num2, false);
          }
          await game.delayx();
        }
      },
      effect0: {
        charlotte: true,
        onremove: true,
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("huaiyuan_effect0");
          }
        },
        marktext: "怀",
        intro: { content: "手牌上限+#" }
      },
      effect1: {
        charlotte: true,
        onremove: true,
        mod: {
          attackRange(player, num) {
            return num + player.countMark("huaiyuan_effect1");
          }
        },
        marktext: "远",
        intro: { content: "攻击范围+#" }
      }
    }
  },
  chongxin: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hasCard(lib.filter.cardRecastable, "he") && game.hasPlayer((current) => get.info("chongxin").filterTarget(null, player, current));
    },
    filterCard: lib.filter.cardRecastable,
    filterTarget(card, player, target) {
      return target != player && target.countCards("h");
    },
    check(card) {
      return 6 - get.value(card);
    },
    discard: false,
    lose: false,
    delay: false,
    position: "he",
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      await player.recast(cards2);
      if (!target.hasCard(lib.filter.cardRecastable, "he")) {
        return;
      }
      const result = await target.chooseCard("he", true, "请重铸一张牌", lib.filter.cardRecastable).forResult();
      if (result?.bool && result?.cards?.length) {
        await target.recast(result.cards);
      }
    },
    ai: {
      order: 6,
      result: {
        player: 1,
        target(player, target) {
          return 0.5 * Math.sqrt(Math.min(3, target.countCards("h")));
        }
      }
    }
  },
  dezhang: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    derivation: "weishu",
    juexingji: true,
    forced: true,
    skillAnimation: true,
    animationColor: "thunder",
    filter(event, player) {
      return !player.hasCard((card) => {
        return card.hasGaintag("huaiyuanx");
      }, "h");
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.loseMaxHp();
      await player.addSkills("weishu");
    }
  },
  weishu: {
    audio: 2,
    trigger: { player: "gainAfter" },
    forced: true,
    filter(event, player) {
      const evt = event.getParent();
      const evt2 = event.getParent(2);
      const drawEvt = event.getParent("phaseDraw");
      if (evt == null || evt2 == null || drawEvt == null) {
        return false;
      }
      return evt.name === "draw" && evt2.name !== "weishu" && drawEvt.player !== player;
    },
    async content(event, trigger, player) {
      const result = await player.chooseTarget({
        prompt: "请选择【卫戍】的目标",
        prompt2: "令一名角色摸一张牌",
        forced: true,
        ai(target2) {
          return get.attitude(_status.event.player, target2) * Math.sqrt(Math.max(1, 4 - target2.countCards("h")));
        }
      }).forResult();
      if (!result.bool || !result.targets?.length) {
        return;
      }
      const target = result.targets[0];
      player.line(target, "green");
      await target.draw();
    },
    group: "weishu_discard",
    subSkill: {
      discard: {
        audio: "weishu",
        trigger: {
          player: "loseAfter",
          global: "loseAsyncAfter"
        },
        forced: true,
        filter(event, player) {
          const evt3 = event.getParent(3);
          const discardEvt = event.getParent("phaseDiscard");
          if (evt3 == null || discardEvt == null) {
            return false;
          }
          return event.type === "discard" && evt3.name !== "weishu_discard" && discardEvt.player !== player && event.getl(player).cards2.length > 0 && game.hasPlayer((target) => target !== player && target.hasDiscardableCards(player, "he"));
        },
        async content(event, trigger, player) {
          const result = await player.chooseTarget({
            prompt: "请选择【卫戍】的目标",
            prompt2: "弃置一名其他角色的一张牌",
            filterTarget(card, player2, target2) {
              return target2 !== player2 && target2.hasDiscardableCards(player2, "he");
            },
            forced: true,
            ai(target2) {
              const player2 = get.player();
              return get.effect(target2, { name: "guohe_copy2" }, player2, player2);
            }
          }).forResult();
          if (!result.bool || !result.targets?.length) {
            return;
          }
          const target = result.targets[0];
          player.line(target, "green");
          await player.discardPlayerCard({
            target,
            position: "he",
            forced: true
          });
        }
      }
    }
  },
  gaoling: {
    audio: 2,
    trigger: { player: "showCharacterAfter" },
    hiddenSkill: true,
    filter(event, player) {
      return event.toShow?.some((i) => get.character(i).skills?.includes("gaoling")) && player !== _status.currentPhase && game.hasPlayer((current) => current.isDamaged());
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return target.isDamaged();
      }).set("ai", (target) => {
        const player2 = get.player();
        return get.recoverEffect(target, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      await event.targets[0].recover();
    }
  },
  qimei: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => current != player);
    },
    preHidden: true,
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "选择一名其他角色并获得“齐眉”效果", lib.filter.notMe).set("ai", (target) => {
        const player2 = get.player();
        return get.attitude(player2, target) / (Math.abs(player2.countCards("h") + 2 - target.countCards("h")) + 1);
      }).setHiddenSkill(event.skill).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.storage.qimei_draw = target;
      player.addTempSkill("qimei_draw", { player: "phaseBegin" });
      await game.delayx();
    },
    subSkill: {
      draw: {
        audio: "qimei",
        charlotte: true,
        forced: true,
        popup: false,
        trigger: { global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "loseAfter", "addToExpansionAfter"] },
        usable: 1,
        filter(event, player) {
          const target = player.storage.qimei_draw;
          if (!target || !target.isIn()) {
            return false;
          }
          if (player.countCards("h") != target.countCards("h")) {
            return false;
          }
          const hasChange = function(event2, player2) {
            let gain = 0, lose = 0;
            if (event2.getg) {
              gain = event2.getg(player2).length;
            }
            if (event2.getl) {
              lose = event2.getl(player2).hs.length;
            }
            return gain != lose;
          };
          return hasChange(event, player) || hasChange(event, target);
        },
        logTarget(event, player) {
          return player.storage.qimei_draw;
        },
        async content(event, trigger, player) {
          if (trigger.delay === false) {
            await game.delayx();
          }
          const target = event.targets[0];
          const drawer = [];
          const hasChange = function(event2, player2) {
            let gain = 0, lose = 0;
            if (event2.getg) {
              gain = event2.getg(player2).length;
            }
            if (event2.getl) {
              lose = event2.getl(player2).hs.length;
            }
            return gain != lose;
          };
          if (hasChange(trigger, player)) {
            drawer.push(target);
          }
          if (hasChange(trigger, target)) {
            drawer.push(player);
          }
          if (drawer.length == 1) {
            await drawer[0].draw();
          } else {
            await game.asyncDraw(drawer.sortBySeat());
            await game.delayex();
          }
        },
        group: "qimei_hp",
        onremove: true,
        mark: "character",
        intro: { content: "已和$组成齐眉组合" }
      },
      hp: {
        audio: "qimei",
        trigger: { global: "changeHpAfter" },
        charlotte: true,
        forced: true,
        logTarget(event, player) {
          return player.storage.qimei_draw;
        },
        usable: 1,
        filter(event, player) {
          if (event.changedHp == 0) {
            return false;
          }
          const target = player.storage.qimei_draw;
          if (!target || !target.isIn()) {
            return false;
          }
          if (player != event.player && target != event.player) {
            return false;
          }
          return player.hp == target.hp;
        },
        async content(event, trigger, player) {
          const current = player == trigger.player ? player.storage.qimei_draw : player;
          const next = current.draw();
          await game.delayx();
          await next;
        }
      }
    }
  },
  ybzhuiji: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    direct: true,
    preHidden: true,
    async content(event, trigger, player) {
      const list = ["摸两张牌，并于出牌阶段结束时失去1点体力"];
      if (player.isDamaged()) {
        list.push("回复1点体力，并于出牌阶段结束时弃置两张牌");
      }
      const result = await player.chooseControl({ controls: ["cancel2"] }).set("choiceList", list).set("prompt", get.prompt("ybzhuiji")).set("ai", () => {
        const currentPlayer = _status.event.player;
        if (currentPlayer.isDamaged() && currentPlayer.countCards("h", "tao") < currentPlayer.getDamagedHp()) {
          return 1;
        }
        return "cancel2";
      }).setHiddenSkill("ybzhuiji").forResult();
      if (result.control === "cancel2") {
        return;
      }
      player.logSkill("ybzhuiji");
      if (result.index === 0) {
        await player.draw(2);
      } else {
        await player.recover();
      }
      player.addTempSkill(`ybzhuiji_${result.index}`, "phaseUseAfter");
    },
    subSkill: {
      0: {
        audio: "ybzhuiji",
        trigger: { player: "phaseUseEnd" },
        forced: true,
        charlotte: true,
        async content(event, trigger, player) {
          await player.loseHp();
        }
      },
      1: {
        audio: "ybzhuiji",
        trigger: { player: "phaseUseEnd" },
        forced: true,
        charlotte: true,
        async content(event, trigger, player) {
          await player.chooseToDiscard({
            selectCard: 2,
            position: "he",
            forced: true
          });
        }
      }
    }
  },
  canmou: {
    audio: 2,
    trigger: { global: "useCardToPlayer" },
    filter(event, player) {
      if (!event.player.isMaxHandcard(true) || !event.isFirstTarget || get.type(event.card, null, false) !== "trick") {
        return false;
      }
      const info = get.info(event.card);
      if (info.allowMultiple === false) {
        return false;
      }
      if (event.targets && !info.multitarget) {
        if (game.hasPlayer((current) => !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, event.player, current))) {
          return true;
        }
      }
      return false;
    },
    preHidden: true,
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt("canmou"),
        prompt2: `为${get.translation(trigger.card)}增加一个目标`,
        filterTarget(_card, player2, target) {
          const { card, source, targets } = get.event();
          return !targets.includes(target) && lib.filter.targetEnabled2(card, source, target);
        },
        ai(target) {
          const { card, source, player: player2 } = get.event();
          return get.effect(target, card, source, player2);
        }
      }).set("targets", trigger.targets).set("card", trigger.card).set("source", trigger.player).setHiddenSkill(event.name).forResult();
    },
    logTarget: "targets",
    async content(event, trigger, player) {
      if (!event.isMine() && !event.isOnline()) {
        await game.delayx();
      }
      trigger.targets.addArray(event.targets);
      game.log(event.targets, "也成为了", trigger.card, "的目标");
    }
  },
  congjian: {
    audio: 2,
    trigger: { global: "useCardToTarget" },
    logTarget: "target",
    filter(event, player) {
      return event.target !== player && event.targets.length === 1 && get.type(event.card, null, false) === "trick" && event.target.isMaxHp(true) && lib.filter.targetEnabled2(event.card, event.player, player);
    },
    check(event, player) {
      return get.effect(player, event.card, event.player, player) > 0;
    },
    preHidden: true,
    async content(event, trigger, player) {
      trigger.targets.push(player);
      game.log(player, "也成为了", trigger.card, "的目标");
      const next = game.createEvent("congjian_draw", false);
      next.player = player;
      event.next.remove(next);
      trigger.getParent()?.after.push(next);
      next.setContent(async (event2, _trigger, player2) => {
        if (!player2.hasHistory("damage", (evt) => evt.card === event2.parent.card)) {
          return;
        }
        await player2.draw(2);
      });
    }
  },
  wanyi: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.getStorage("wanyi_used").length < 4 && player.hasCard((card) => get.is.yingbian(card), "hs");
    },
    chooseButton: {
      dialog(event, player) {
        var list = ["zhujinqiyuan", "chuqibuyi", "shuiyanqijunx", "dongzhuxianji"];
        list.removeArray(player.getStorage("wanyi_used"));
        return ui.create.dialog("婉嫕", [list, "vcard"], "hidden");
      },
      filter(button, player) {
        return lib.filter.filterCard({ name: button.link[2] }, player, _status.event.getParent());
      },
      check(button) {
        return _status.event.player.getUseValue({ name: button.link[2] });
      },
      backup(links) {
        return {
          audio: "wanyi",
          popname: true,
          viewAs: {
            name: links[0][2]
          },
          filterCard(card) {
            return get.is.yingbian(card);
          },
          check(card) {
            return 1 / Math.max(1, get.value(card));
          },
          position: "hs",
          onuse(links2, player) {
            player.addTempSkill("wanyi_used");
            player.markAuto("wanyi_used", [links2.card.name]);
          }
        };
      },
      prompt(links) {
        return "将一张应变牌当做" + get.translation(links[0][2]) + "使用";
      }
    },
    ai: { order: 8, result: { player: 1 } },
    subSkill: {
      backup: {},
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  maihuo: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    logTarget: "player",
    filter(event, player) {
      const evt2 = event.getParent(2);
      if (evt2 == null) {
        return false;
      }
      return event.card.name === "sha" && event.card.isCard && evt2.name !== "maihuo_effect" && event.cards.filterInD().length > 0 && event.targets.length === 1 && event.player.isIn() && !event.player.hasExpansions("maihuo_effect");
    },
    prompt2(event) {
      return `令${get.translation(event.card)}暂时对你无效`;
    },
    check(event, player) {
      return get.effect(player, event.card, event.player, player) < 0;
    },
    async content(event, trigger, player) {
      trigger.excluded.add(player);
      const target = trigger.player;
      const cards2 = trigger.cards.filterInD();
      target.storage.maihuo_target = player;
      target.addSkill("maihuo_effect");
      await target.addToExpansion({
        cards: cards2,
        animate: "gain2",
        gaintag: ["maihuo_effect"]
      });
    },
    group: "maihuo_damage",
    subSkill: {
      effect: {
        trigger: { player: "phaseUseBegin" },
        forced: true,
        charlotte: true,
        filter(event, player) {
          return player.getExpansions("maihuo_effect").length > 0;
        },
        async content(event, trigger, player) {
          const cards2 = player.getExpansions("maihuo_effect");
          let card = cards2[0];
          if (card.name !== "sha") {
            card = get.autoViewAs(
              {
                name: "sha",
                isCard: true
              },
              cards2
            );
          }
          const target = player.storage.maihuo_target;
          player.removeSkill("maihuo_effect");
          if (target.isIn() && player.canUse(card, target, null, true)) {
            await player.useCard({
              card,
              cards: cards2,
              targets: [target]
            });
          }
        },
        marktext: "祸",
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
        ai: { threaten: 1.05 }
      },
      damage: {
        trigger: { source: "damageSource" },
        forced: true,
        locked: false,
        filter(event, player) {
          return event.player.hasSkill("maihuo_effect") && event.player.getExpansions("maihuo_effect").length > 0;
        },
        async content(event, trigger, player) {
          trigger.player.removeSkill("maihuo_effect");
        }
      }
    }
  },
  xuanbei: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: ["enterGame", "useCardAfter"]
    },
    filter(event, player) {
      if (event.name == "useCard") {
        return !player.hasSkill("xuanbei_used", null, null, false) && (event.card.yingbian || get.is.yingbian(event.card)) && event.cards.someInD() && game.hasPlayer((current) => player != current);
      }
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async cost(event, trigger, player) {
      if (trigger.name == "useCard") {
        const cards2 = trigger.cards.filterInD();
        const { bool, targets } = await player.chooseTarget(get.prompt(event.name.slice(0, -5)), `令一名其他角色获得${get.translation(cards2)}`, lib.filter.notMe).set("ai", (target) => {
          let att = get.attitude(get.player(), target);
          if (att < 3) {
            return 0;
          }
          if (target.hasJudge("lebu")) {
            att /= 2;
          }
          if (target.hasSkillTag("nogain")) {
            att /= 10;
          }
          return att / (1 + get.distance(player, target, "absolute"));
        }).forResult();
        event.result = {
          bool,
          targets,
          cost_data: cards2
        };
      } else {
        event.result = {
          bool: true
        };
      }
    },
    async content(event, trigger, player) {
      if (trigger.name == "useCard") {
        player.addTempSkill(event.name + "_used");
        const next = event.targets[0].gain(event.cost_data, "gain2");
        next.giver = player;
        await next;
      } else {
        const cards2 = [];
        while (cards2.length < 2) {
          const card = get.cardPile2((i) => get.is.yingbian(i) && !cards2.includes(i));
          if (!card) {
            break;
          } else {
            cards2.push(card);
          }
        }
        if (cards2.length) {
          await player.gain(cards2, "gain2");
        }
      }
    },
    subSkill: { used: { charlotte: true } }
  },
  xianwan: {
    audio: 2,
    enable: "chooseToUse",
    filter(event, player) {
      return event.filterCard && event.filterCard(
        {
          name: "sha" + (player.isLinked() ? "" : "n"),
          isCard: true
        },
        player,
        event
      );
    },
    viewAs(cards2, player) {
      return {
        name: "sha" + (player.isLinked() ? "" : "n"),
        isCard: true
      };
    },
    filterCard: () => false,
    selectCard: -1,
    prompt: "将武将牌重置并视为使用【杀】",
    log: false,
    check: () => 1,
    async precontent(event, trigger, player) {
      player.logSkill("xianwan");
      await player.link();
    },
    ai: {
      order: 3.4,
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag) {
        return tag == "respondSha" + (player.isLinked() ? "" : "n");
      },
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "respondShan") && current < 0 && !player.isLinked()) {
            return 0.4;
          }
        }
      }
    }
  },
  recaiwang: {
    audio: "caiwang",
    inherit: "caiwang",
    group: ["recaiwang_hand", "recaiwang_equip", "recaiwang_judge"]
  },
  recaiwang_hand: {
    audio: "caiwang",
    enable: ["chooseToUse", "chooseToRespond"],
    sourceSkill: "recaiwang",
    viewAsFilter(player) {
      var js = player.getCards("h");
      return js.length == 1 && game.checkMod(js[0], player, "unchanged", "cardEnabled2", player);
    },
    selectCard: -1,
    filterCard: true,
    position: "h",
    prompt: "将全部手牌当做【闪】使用",
    viewAs: { name: "shan" },
    check: (card) => 10 - get.value(card),
    ai: {
      order: 1,
      respondShan: true,
      skillTagFilter(player) {
        return player.countCards("h") == 1;
      }
    }
  },
  recaiwang_equip: {
    audio: "caiwang",
    enable: ["chooseToUse", "chooseToRespond"],
    sourceSkill: "recaiwang",
    viewAsFilter(player) {
      var js = player.getCards("e");
      return js.length == 1 && game.checkMod(js[0], player, "unchanged", "cardEnabled2", player);
    },
    selectCard: -1,
    filterCard: true,
    check: (card) => 9 - get.value(card),
    position: "e",
    prompt: "将装备区的牌当做【无懈可击】使用",
    viewAs: { name: "wuxie" },
    ai: {
      order: 1
    }
  },
  recaiwang_judge: {
    audio: "caiwang",
    enable: ["chooseToUse", "chooseToRespond"],
    sourceSkill: "recaiwang",
    viewAsFilter(player) {
      var js = player.getCards("j");
      return js.length == 1 && game.checkMod(js[0], player, "unchanged", "cardEnabled2", player);
    },
    selectCard: -1,
    filterCard: true,
    position: "j",
    prompt: "将判定区的牌当做【杀】使用",
    viewAs: { name: "sha" },
    check: (card) => 1,
    locked: false,
    ai: {
      order: 10,
      respondSha: true,
      skillTagFilter(player) {
        return player.countCards("j") == 1;
      },
      effect: {
        target_use(card, player, target, current) {
          if (card && (card.name == "shandian" || card.name == "fulei") && player == target && !target.countCards("j") && target.isPhaseUsing() && target.hasValueTarget({ name: "sha" }, null, true)) {
            return [1, 2];
          }
        }
      }
    },
    mod: {
      aiOrder(player, card, num) {
        if (card.name == "shandian" || card.name == "fulei") {
          return num + 3;
        }
      }
    }
  },
  caozhao: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      if (!player.hasCards() || !game.hasPlayer((current) => current !== player && current.hp <= player.hp)) {
        return false;
      }
      const cardNames = player.getStorage("caozhao");
      for (const name of lib.inpile) {
        if (!cardNames.includes(name) && ["basic", "trick"].includes(get.type(name))) {
          return true;
        }
      }
      return false;
    },
    chooseButton: {
      dialog(event, player) {
        const cardNames = player.getStorage("caozhao");
        const vcards = [];
        for (const name of lib.inpile) {
          if (!cardNames.includes(name)) {
            const type = get.type(name);
            if (type == "basic" || type == "trick") {
              vcards.push([type, "", name]);
            }
          }
        }
        return ui.create.dialog("草诏", [vcards, "vcard"]);
      },
      check(button) {
        return _status.event.player.getUseValue({ name: button.link[2], isCard: true }, void 0, true);
      },
      backup(links, player) {
        return {
          audio: "caozhao",
          cardname: links[0][2],
          filterCard: true,
          position: "h",
          check(card) {
            return player.getUseValue({ name: lib.skill.caozhao_backup.cardname }) - (player.getUseValue(card, void 0, true) + 0.1) / (get.value(card) / 6);
          },
          filterTarget(card, player2, target) {
            return target != player2 && target.hp <= player2.hp;
          },
          discard: false,
          lose: false,
          async content(event, trigger, player2) {
            const { cards: cards2, target } = event;
            if (cards2[0].cardid == null) {
              return;
            }
            await player2.showCards(cards2, `${get.translation(player2)}发动【草诏】，声明${get.translation(lib.skill.caozhao_backup.cardname)}`);
            player2.storage.caozhao ??= [];
            player2.storage.caozhao.push(lib.skill.caozhao_backup.cardname);
            const controlResult = await target.chooseControl({
              choiceList: [`令${get.translation(player2)}将${get.translation(cards2[0])}的牌名改为${get.translation(lib.skill.caozhao_backup.cardname)}`, "失去1点体力"],
              ai(event2, player3) {
                const evt = get.event().getParent();
                if (evt == null) {
                  return 0;
                }
                const target2 = evt.player;
                if (get.attitude(player3, target2) > 0) {
                  return 0;
                }
                if (player3.hp > 3 || player3.hp > 1 && player3.hasSkill("zhaxiang")) {
                  return 1;
                }
                if (player3.hp > 2) {
                  return [0, 1].randomGet();
                }
                return 0;
              }
            }).forResult();
            if (controlResult.index == 1) {
              target.addExpose(0.2);
              await target.loseHp();
              return;
            }
            const targetResult = await player2.chooseTarget({
              prompt: `是否将${get.translation(lib.skill.caozhao_backup.cardname)}（${get.translation(cards2[0])}）交给一名其他角色？`,
              filterTarget: lib.filter.notMe,
              ai() {
                return -1;
              }
            }).forResult();
            if (targetResult.bool && targetResult.targets?.length) {
              const target2 = targetResult.targets[0];
              player2.line(target2, "green");
              target2.storage.caozhao_info ??= {};
              target2.storage.caozhao_info[cards2[0].cardid] = lib.skill.caozhao_backup.cardname;
              target2.addSkill("caozhao_info");
              const next = player2.give(cards2, target2, true);
              next.gaintag.add("caozhao");
              await next;
            } else {
              player2.storage.caozhao_info ??= {};
              player2.storage.caozhao_info[cards2[0].cardid] = lib.skill.caozhao_backup.cardname;
              player2.addGaintag(cards2, "caozhao");
              player2.addSkill("caozhao_info");
            }
          },
          ai: {
            result: {
              player: 2,
              target: 0.1
            }
          }
        };
      },
      prompt(links, player) {
        return `将一张手牌声明为${get.translation(links[0][2])}`;
      }
    },
    ai: {
      order: 1,
      result: {
        player: 1
      }
    }
  },
  caozhao_info: {
    charlotte: true,
    mod: {
      cardname(card, player) {
        if (card.cardid == null) {
          return;
        }
        const map = player.storage.caozhao_info;
        if (map && map[card.cardid] && get.itemtype(card) === "card" && card.hasGaintag("caozhao")) {
          return map[card.cardid];
        }
      },
      cardnature(card, player) {
        if (card.cardid == null) {
          return;
        }
        const map = player.storage.caozhao_info;
        if (map && map[card.cardid] && get.itemtype(card) === "card" && card.hasGaintag("caozhao")) {
          return false;
        }
      }
    }
  },
  olxibing: {
    audio: 2,
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return event.player && event.source && event.player !== event.source && event.player.isAlive() && event.source.isAlive() && (event.player.countCards("he") > 0 || event.source.countCards("he") > 0);
    },
    async cost(event, trigger, player) {
      const source = trigger.source;
      event.result = await player.chooseTarget({
        prompt: get.prompt("olxibing"),
        prompt2: `弃置自己或${get.translation(source)}的两张牌，然后手牌数较少的角色摸两张牌且不能对你使用牌直到回合结束`,
        filterTarget(card, player2, target) {
          const source2 = get.event().source;
          if (target !== player2 && target !== source2) {
            return false;
          }
          return target.hasCards("he");
        },
        ai(target) {
          const { player: player2, source: source2 } = get.event();
          if (source2 === target) {
            if (get.attitude(player2, source2) > 0) {
              return 0;
            }
            const cards3 = source2.iterableGetCards("he", (card) => lib.filter.canBeDiscarded(card, player2, source2)).map((card) => ({ link: card })).toArray().sort((a, b) => get.buttonValue(b) - get.buttonValue(a)).map((button) => button.link);
            if (source2.countCards("h") - player2.countCards("h") >= Math.max(
              0,
              Math.min(2, cards3.length) - source2.countCards("e", (card) => {
                const index = cards3.indexOf(card);
                return index !== -1 && index < 2;
              })
            )) {
              return 1;
            }
            return 0;
          }
          const cards2 = player2.getCards("he", (card) => lib.filter.cardDiscardable(card, player2, "olxibing")).sort((a, b) => get.useful(a) - get.useful(b));
          if (player2.countCards("h") - source2.countCards("h") < Math.max(
            0,
            Math.min(cards2.length, 2) - player2.countCards("e", (card) => {
              const index = cards2.indexOf(card);
              return index !== -1 && index < 2;
            })
          ) && (cards2.length < 2 || get.value(cards2[1]) < 5.5)) {
            return 0.8;
          }
          return 0;
        }
      }).set("source", source).forResult();
    },
    logTarget: "source",
    async content(event, trigger, player) {
      const source = trigger.source;
      const target = event.targets[0];
      if (target === player) {
        await player.chooseToDiscard({
          selectCard: 2,
          position: "he",
          forced: true
        });
      } else {
        await player.discardPlayerCard({
          target,
          selectButton: 2,
          position: "he",
          forced: true
        });
      }
      if (!player.isIn() || !source.isIn()) {
        return;
      }
      const playerHandCount = player.countCards("h");
      const sourceHandCount = source.countCards("h");
      if (playerHandCount === sourceHandCount) {
        return;
      }
      const drawer = playerHandCount > sourceHandCount ? source : player;
      await drawer.draw(2);
      player.addTempSkill("olxibing2");
      player.markAuto("olxibing2", [drawer]);
    }
  },
  olxibing2: {
    mod: {
      targetEnabled(card, player, target) {
        if (target.getStorage("olxibing2").includes(player)) {
          return false;
        }
      },
      cardSavable(card, player, target) {
        if (target.getStorage("olxibing2").includes(player)) {
          return false;
        }
      }
    },
    onremove: true
  },
  bolan: {
    audio: 2,
    banned: ["kotomi_chuanxiang"],
    global: "bolan_g",
    initList(player) {
      let list;
      const skills2 = [];
      if (get.mode() === "guozhan") {
        list = [];
        for (const characterName in lib.characterPack.mode_guozhan) {
          if (lib.character[characterName]) {
            list.push(characterName);
          }
        }
      } else if (_status.connectMode) {
        list = get.charactersOL();
      } else {
        list = [];
        for (const characterName in lib.character) {
          if (lib.filter.characterDisabled2(characterName) || lib.filter.characterDisabled(characterName)) {
            continue;
          }
          list.push(characterName);
        }
      }
      for (const characterName of list) {
        if (characterName.indexOf("gz_jun") === 0) {
          continue;
        }
        for (const skillName of lib.character[characterName][3]) {
          if (skillName === "bolan") {
            continue;
          }
          const skill = lib.skill[skillName];
          if (!skill || skill.juexingji || skill.hiddenSkill || skill.zhuSkill || skill.dutySkill || skill.chargeSkill || lib.skill.bolan.banned.includes(skillName)) {
            continue;
          }
          if (skill.init || skill.ai && (skill.ai.combo || skill.ai.notemp || skill.ai.neg)) {
            continue;
          }
          const info = lib.translate[`${skillName}_info`];
          if (info && get.plainText(info).indexOf("出牌阶段限一次") !== -1) {
            skills2.add(skillName);
          }
        }
      }
      player.storage.bolan = skills2;
    },
    check(event, player) {
      return true;
    },
    trigger: { player: "phaseUseBegin" },
    frequent: true,
    preHidden: true,
    async content(event, trigger, player) {
      if (!player.isIn()) {
        return;
      }
      if (!player.storage.bolan) {
        lib.skill.bolan.initList(player);
      }
      const list = player.storage.bolan.randomGets(3);
      if (!list.length) {
        return;
      }
      const result = await player.chooseControl(list).set(
        "choiceList",
        list.map((skillName) => {
          return `<div class="skill">【${get.translation(lib.translate[`${skillName}_ab`] || get.translation(skillName).slice(0, 2))}】</div><div>${get.skillInfoTranslation(skillName, player, false)}</div>`;
        })
      ).set("displayIndex", false).set("prompt", "博览：请选择你要获得的技能").set("ai", () => {
        const controls = _status.event.controls.slice();
        return controls.sort((a, b) => {
          return get.skillRank(b, "in") - get.skillRank(a, "in");
        })[0];
      }).forResult();
      if (!result.control) {
        return;
      }
      player.addTempSkills(result.control, "phaseUseEnd");
      player.popup(result.control);
    },
    ai: { threaten: 0.9 },
    subSkill: {
      g: {
        audio: "bolan",
        forceaudio: true,
        enable: "phaseUse",
        usable: 1,
        prompt: "出牌阶段限一次。你可以令一名有〖博览〗的角色从三个描述中包含“出牌阶段限一次”的技能中选择一个，你获得此技能直到此阶段结束。",
        chessForceAll: true,
        filter(event, player) {
          return game.hasPlayer((current) => current !== player && current.hasSkill("bolan"));
        },
        filterTarget(card, player, target) {
          return player !== target && target.hasSkill("bolan");
        },
        selectTarget() {
          if (game.countPlayer((current) => lib.skill.bolan_g.filterTarget(null, _status.event.player, current)) === 1) {
            return -1;
          }
          return 1;
        },
        async content(event, trigger, player) {
          await player.loseHp();
          const target = event.targets[0];
          if (!target.isIn() || !player.isIn()) {
            return;
          }
          if (!target.storage.bolan) {
            lib.skill.bolan.initList(target);
          }
          const list = target.storage.bolan.randomGets(3);
          if (!list.length) {
            return;
          }
          const result = await target.chooseControl(list).set(
            "choiceList",
            list.map((skillName) => {
              return `<div class="skill">【${get.translation(lib.translate[`${skillName}_ab`] || get.translation(skillName).slice(0, 2))}】</div><div>${get.skillInfoTranslation(skillName, player, false)}</div>`;
            })
          ).set("displayIndex", false).set("prompt", `博览：请选择令${get.translation(player)}获得的技能`).set("ai", () => {
            const controls = _status.event.controls.slice();
            return controls.sort((a, b) => {
              return (get.skillRank(b, "in") - get.skillRank(a, "in")) * get.attitude(_status.event.player, _status.event.getParent().player);
            })[0];
          }).forResult();
          if (!result.control) {
            return;
          }
          target.line(player);
          player.addTempSkills(result.control, "phaseUseEnd");
        },
        ai: {
          order(item, player) {
            if (player.hp >= 5 || player.countCards("h") >= 10) {
              return 10;
            }
            const list = game.filterPlayer((current) => lib.skill.bolan_g.filterTarget(null, player, current));
            for (const target of list) {
              if (get.attitude(target, player) > 0) {
                return 10;
              }
            }
            return 4;
          },
          result: {
            player(player, target) {
              if (player.hasUnknown()) {
                return player.hp + player.countCards("h") / 4 - 5 > 0 ? 1 : 0;
              }
              const tao = player.countCards("h", "tao");
              if (player.hp + tao > 4) {
                return 4 + get.attitude(player, target);
              }
              if (player.hp + tao > 3) {
                return get.attitude(player, target) - 2;
              }
              return 0;
            }
          }
        }
      }
    }
  },
  yifa: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    forced: true,
    logTarget: "player",
    filter(event, player) {
      return player != event.player && (event.card.name == "sha" || get.color(event.card) == "black" && get.type(event.card) == "trick");
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      target.addTempSkill("yifa2", { player: "phaseEnd" });
      target.addMark("yifa2", 1, false);
    },
    ai: { threaten: 0.8 }
  },
  yifa2: {
    charlotte: true,
    onremove: true,
    intro: { content: "手牌上限-#" },
    mod: {
      maxHandcard(player, num) {
        return num - player.countMark("yifa2");
      }
    }
  },
  buchen: {
    audio: 2,
    trigger: { player: "showCharacterAfter" },
    hiddenSkill: true,
    filter(event, player) {
      var target = _status.currentPhase;
      return event.toShow?.some((i) => get.character(i).skills?.includes("buchen")) && target?.isIn() && target != player && target.countGainableCards(player, "he") > 0;
    },
    direct: true,
    async content(event, trigger, player) {
      const target = _status.currentPhase;
      player.gainPlayerCard(target, "he", get.prompt("buchen", target)).set("logSkill", ["buchen", target]);
    }
  },
  smyyingshi: {
    audio: 2,
    locked: true,
    clickableFilter(player) {
      return player.hasSkill("smyyingshi") && player.hasSkill("smyyingshi_viewTop");
    },
    init(player, skill) {
      if (player.isPhaseUsing()) {
        player.addTempSkill(`${skill}_viewTop`, { global: ["phaseChange", "phaseAfter", "phaseBeforeStart"] });
      }
    },
    forced: true,
    trigger: { player: "phaseUseBegin" },
    async content(event, trigger, player) {
      player.addTempSkill(`${event.name}_viewTop`, { global: ["phaseChange", "phaseAfter", "phaseBeforeStart"] });
    },
    clickable(player) {
      if (player.isUnderControl(true)) {
        let createDialogWithControl = function(result) {
          const dialog = ui.create.dialog("鹰视", "peaceDialog");
          result.length > 0 ? dialog.add(result, true) : dialog.addText("牌堆顶无牌");
          const control = ui.create.control("确定", () => dialog.close());
          dialog._close = dialog.close;
          dialog.hide = dialog.close = function(...args) {
            control.close();
            return dialog._close(...args);
          };
          if (_status.smyyingshi_clickable) {
            _status.smyyingshi_clickable.close();
          }
          _status.smyyingshi_clickable = dialog;
          dialog.open();
        };
        const cards2 = lib.skill.smyyingshi.getCards(player);
        if (cards2 instanceof Promise) {
          cards2.then(([ok, result]) => createDialogWithControl(result));
        } else {
          createDialogWithControl(cards2);
        }
      }
    },
    getCards(player) {
      const num = player.maxHp;
      if (num > 0) {
        if (game.online) {
          return game.requestSkillData("smyyingshi", "getTopCards", 1e4);
        } else {
          if (ui.cardPile.hasChildNodes !== false) {
            return Array.from(ui.cardPile.childNodes).slice(0, num);
          }
        }
      }
      return [];
    },
    sync: {
      getTopCards(client) {
        if (ui.cardPile.hasChildNodes !== false) {
          return Array.from(ui.cardPile.childNodes).slice(0, client.maxHp);
        }
        return [];
      }
    },
    mark: true,
    marktext: "牌",
    intro: {
      mark(dialog, content, player, event, skill) {
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
        dialog.add(intronode);
      }
    },
    subSkill: {
      viewTop: {
        charlotte: true
      }
    }
  },
  xiongzhi: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "thunder",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      while (true) {
        const card = get.cards()[0];
        const content = ["牌堆顶", [card]];
        game.log(player, "观看了牌堆顶的一张牌");
        await player.chooseControl("ok").set("dialog", content);
        if (player.hasUseTarget(card, null, card.name === "sha") || get.info(card).notarget && lib.filter.cardEnabled(card, player)) {
          const result = await player.chooseUseTarget(card, true).forResult();
          if (result?.bool) {
            continue;
          }
        }
        break;
      }
    },
    ai: {
      order: 1,
      result: {
        player(player) {
          if (!player.hasSkill("smyyingshi")) {
            return 1;
          }
          for (var i = 0; i < Math.min(2, player.maxHp); i++) {
            var card = ui.cardPile.childNodes[i];
            if (card) {
              if (!player.hasValueTarget(card)) {
                return 0;
              }
            } else {
              break;
            }
          }
          return 1;
        }
      }
    }
  },
  quanbian: {
    audio: 2,
    trigger: { player: ["useCard", "respond"] },
    hasHand(event) {
      const evts = event.player.getHistory("lose", (evt) => (evt.relatedEvent || evt.getParent()) === event);
      return evts && evts.length === 1 && evts[0].hs.length > 0;
    },
    filter(event, player) {
      const phase = event.getParent("phaseUse");
      if (phase == null || phase.player !== player) {
        return false;
      }
      const suit = get.suit(event.card);
      if (suit == null || !lib.suit.includes(suit) || !lib.skill.quanbian.hasHand(event)) {
        return false;
      }
      return player.getHistory("useCard", (evt) => evt !== event && get.suit(evt.card) === suit && lib.skill.quanbian.hasHand(evt) && evt.getParent("phaseUse") === phase).length + player.getHistory("respond", (evt) => evt !== event && get.suit(evt.card) === suit && lib.skill.quanbian.hasHand(evt) && evt.getParent("phaseUse") === phase).length === 0;
    },
    async cost(event, trigger, player) {
      const result = await player.chooseControl({
        prompt: get.prompt("quanbian"),
        controls: ["cancel2"],
        choiceList: [`摸一张牌`, `观看牌堆顶的${get.cnNumber(player.maxHp)}张牌并将其中一张置于牌堆底`],
        ai() {
          const event2 = get.event();
          const player2 = event2.player;
          const trigger2 = event2.getTrigger();
          const suit = get.suit(trigger2.card);
          if (player2.hasCards("h", (card) => get.suit(card) === suit && player2.hasValueTarget(card, null, true))) {
            return "cancel2";
          }
          return 0;
        }
      }).forResult();
      event.result = {
        bool: result.control !== "cancel2",
        cost_data: {
          index: result.index
        }
      };
    },
    async content(event, trigger, player) {
      const { index } = event.cost_data;
      player.addTempSkill("quanbian2");
      player.storage.quanbian2.add(get.suit(trigger.card));
      player.markSkill("quanbian2");
      if (index === 0) {
        await player.draw();
        return;
      }
      const cards2 = get.cards(player.maxHp);
      const result = await player.chooseButton({
        createDialog: ["将一张牌置于牌堆底", cards2],
        forced: true
      }).forResult();
      if (!result.bool || !result.links?.length) {
        return;
      }
      const [bottomCard] = result.links;
      for (const card of cards2.slice().reverse()) {
        card.fix();
        if (card === bottomCard) {
          ui.cardPile.appendChild(card);
        } else {
          ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
        }
      }
      game.updateRoundNumber();
    }
  },
  quanbian2: {
    init(player, skill) {
      if (!player.storage[skill]) {
        player.storage[skill] = [];
      }
    },
    onremove: true,
    mod: {
      cardEnabled2(card, player) {
        if (get.position(card) === "h" && player.storage.quanbian2.includes(get.suit(card))) {
          return false;
        }
      }
    },
    intro: {
      content: "本回合内不能使用$花色的手牌"
    }
  },
  //卫瓘
  zhongyun: {
    audio: 2,
    trigger: { player: ["damageEnd", "recoverEnd"] },
    forced: true,
    filter(event, player) {
      return player.hp === player.countCards("h") && (player.isDamaged() || game.hasPlayer((current) => player.inRange(current)));
    },
    usable: 1,
    preHidden: ["zhongyun2"],
    async content(event, trigger, player) {
      const filterTarget = (card, player2, target2) => player2.inRange(target2);
      if (!game.hasPlayer((current) => filterTarget("L∞pers", player, current))) {
        await player.recover();
        return;
      }
      const bool = player.isHealthy();
      const result = await player.chooseTarget({
        prompt: `忠允：对攻击范围内的一名角色造成1点伤害${bool ? "" : "，或点取消回复1点体力"}`,
        filterTarget,
        forced: bool,
        ai(target2) {
          const player2 = get.player();
          return get.damageEffect(target2, player2, player2);
        }
      }).forResult();
      if (!result.bool || !result.targets?.length) {
        await player.recover();
        return;
      }
      const target = result.targets[0];
      player.line(target, "green");
      await target.damage();
    },
    group: "zhongyun2"
  },
  zhongyun2: {
    audio: "zhongyun",
    trigger: {
      player: ["loseAfter"],
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    forced: true,
    sourceSkill: "zhongyun",
    filter(event, player) {
      const cards1 = event.getl(player).hs;
      let cards2 = [];
      if (event.getg) {
        cards2 = event.getg(player);
      }
      return (cards1.length > 0 || cards2.length > 0) && player.countCards("h") === player.hp;
    },
    usable: 1,
    async content(event, trigger, player) {
      if (trigger.delay === false) {
        await game.delayx();
      }
      const filterTarget = (card, player2, target2) => target2 !== player2 && target2.hasDiscardableCards(player2, "he");
      if (!game.hasPlayer((current) => filterTarget("L∞pers", player, current))) {
        await player.draw();
        return;
      }
      const result = await player.chooseTarget({
        prompt: "忠允：弃置一名其他角色的一张牌，或点取消摸一张牌",
        filterTarget,
        ai(target2) {
          const player2 = get.player();
          const att = get.attitude(player2, target2);
          if (att >= 0) {
            return 0;
          }
          if (target2.hasCards("he", (card) => get.value(card) > 5)) {
            return -att;
          }
          return 0;
        }
      }).forResult();
      if (!result.bool || !result.targets?.length) {
        await player.draw();
        return;
      }
      const target = result.targets[0];
      player.line(target, "green");
      await player.discardPlayerCard(target, true, "he");
    }
  },
  shenpin: {
    audio: 2,
    trigger: { global: "judge" },
    filter(event, player) {
      var color = get.color(event.player.judging[0], event.player);
      return player.countCards("hes", function(card) {
        if (_status.connectMode && get.position(card) != "e") {
          return true;
        }
        return get.color(card) != color;
      }) > 0;
    },
    popup: false,
    preHidden: true,
    async cost(event, trigger, player) {
      const color = get.color(trigger.player.judging[0], trigger.player);
      event.result = await player.chooseCard(`${get.translation(trigger.player)}的${trigger.judgestr || ""}判定为${get.translation(trigger.player.judging[0])}，${get.prompt(event.skill)}`, "hes", (card) => {
        const { player: player2, color: color2 } = get.event();
        if (get.color(card) == color2) {
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
      }).set("ai", (card) => {
        const trigger2 = get.event().getTrigger();
        const { player: player2, judging } = get.event();
        const result = trigger2.judge(card) - trigger2.judge(judging);
        const attitude = get.attitude(player2, trigger2.player);
        if (attitude == 0 || result == 0) {
          return 0;
        }
        if (attitude > 0) {
          return result;
        } else {
          return -result;
        }
      }).set("judging", trigger.player.judging[0]).set("color", color).setHiddenSkill(event.skill).forResult();
    },
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
  //彻里吉
  chexuan: {
    audio: 2,
    enable: "phaseUse",
    derivation: ["cheliji_sichengliangyu", "cheliji_tiejixuanyu", "cheliji_feilunzhanyu"],
    filter(event, player) {
      return !player.getEquips(5).length && player.countCards("he", { color: "black" }) > 0;
    },
    filterCard: { color: "black" },
    position: "he",
    check(card) {
      return 5 - get.value(card);
    },
    async content(event, trigger, player) {
      const result = await player.chooseButton({
        createDialog: ["请选择要装备的宝物", [lib.skill.chexuan.derivation?.map((skillName) => ["宝物", "", skillName]), "vcard"]],
        forced: true,
        ai(button) {
          if (button.link[2] === "cheliji_sichengliangyu" && player.countCards("h") < player.hp) {
            return 1;
          }
          return Math.random();
        }
      }).forResult();
      if (!result.bool || !result.links?.length) {
        return;
      }
      const name = result.links[0][2];
      const card = game.createCard(name, lib.card[name].cardcolor, 5);
      player.$gain2(card);
      await player.equip(card);
      await game.delay();
    },
    group: "chexuan_lose",
    subfrequent: ["lose"],
    ai: {
      order: 6,
      result: {
        player: 1
      }
    },
    subSkill: {
      lose: {
        audio: "chexuan",
        trigger: {
          player: "loseAfter",
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        frequent: true,
        filter(event, player) {
          const evt = event.getl(player);
          if (!evt || !evt.es || !evt.es.length) {
            return false;
          }
          if (event.name === "equip" && event.player === player) {
            return false;
          }
          for (const card of evt.es) {
            if (get.subtype(card, false) === "equip5") {
              return true;
            }
          }
          return false;
        },
        async content(event, trigger, player) {
          const result = await player.judge((card2) => {
            if (get.color(card2) === "black") {
              return 3;
            }
            return 0;
          }).forResult();
          if (!result.bool) {
            return;
          }
          const name = lib.skill.chexuan.derivation?.randomGet();
          const card = game.createCard(name, lib.card[name].cardcolor, 5);
          player.$gain2(card);
          await player.equip(card);
          await game.delay();
        }
      }
    }
  },
  qiangshou: {
    mod: {
      globalFrom(player, target, distance) {
        if (player.getEquips(5).length) {
          return distance - 1;
        }
      }
    },
    ai: {
      combo: "chexuan"
    }
  },
  cheliji_sichengliangyu: {
    trigger: { global: "phaseJieshuBegin" },
    equipSkill: true,
    cardcolor: "heart",
    filter(event, player) {
      return player.countCards("h") < player.hp && player.getEquip("cheliji_sichengliangyu") != null;
    },
    async content(event, trigger, player) {
      await player.draw(2);
      const card = player.getEquip("cheliji_sichengliangyu");
      if (card) {
        await player.discard({ cards: [card] });
      }
    }
  },
  cheliji_tiejixuanyu: {
    trigger: { global: "phaseJieshuBegin" },
    equipSkill: true,
    cardcolor: "club",
    filter(event, player) {
      return player !== event.player && !event.player.hasHistory("sourceDamage") && event.player.hasCards("he") && player.getEquip("cheliji_tiejixuanyu") != null;
    },
    logTarget: "player",
    check(event, player) {
      return get.attitude(player, event.player) < 0;
    },
    async content(event, trigger, player) {
      await trigger.player.chooseToDiscard({
        selectCard: 2,
        position: "he",
        forced: true
      });
      const card = player.getEquip("cheliji_tiejixuanyu");
      if (card) {
        await player.discard({ cards: [card] });
      }
    }
  },
  cheliji_feilunzhanyu: {
    trigger: { global: "phaseJieshuBegin" },
    equipSkill: true,
    cardcolor: "spade",
    filter(event, player) {
      return player !== event.player && event.player.hasHistory("useCard", (card) => get.type(card.card) !== "basic") && event.player.hasCards("he") && player.getEquip("cheliji_feilunzhanyu") != null;
    },
    logTarget: "player",
    check(event, player) {
      return get.attitude(player, event.player) <= 0;
    },
    async content(event, trigger, player) {
      const result = await trigger.player.chooseCard({
        prompt: `将一张牌交给${get.translation(player)}`,
        position: "he",
        forced: true
      }).forResult();
      if (result.bool && result.cards?.length) {
        await trigger.player.give(result.cards, player);
      }
      const card = player.getEquip("cheliji_feilunzhanyu");
      if (card) {
        await player.discard({ cards: [card] });
      }
    }
  },
  //司马伷和黄祖
  caiwang: {
    audio: 2,
    trigger: { global: ["useCard", "respond"] },
    preHidden: true,
    filter(event, player) {
      if (!Array.isArray(event.respondTo) || event.respondTo[0] === event.player || ![event.respondTo[0], event.player].includes(player)) {
        return false;
      }
      const color = get.color(event.card);
      if (color === "none" || get.color(event.respondTo[1]) !== color) {
        return false;
      }
      const target = lib.skill.caiwang.logTarget(event, player);
      return target[player.getStorage("naxiang2").includes(target) ? "countGainableCards" : "countDiscardableCards"](player, "he") > 0;
    },
    logTarget(event, player) {
      return player === event.respondTo[0] ? event.player : event.respondTo[0];
    },
    prompt2(event, player) {
      const target = lib.skill.caiwang.logTarget(event, player);
      return `${player.getStorage("naxiang2").includes(target) ? "获得" : "弃置"}该角色的一张牌`;
    },
    check(event, player) {
      return get.attitude(player, lib.skill.caiwang.logTarget(event, player)) <= 0;
    },
    popup: false,
    async content(event, trigger, player) {
      if (player !== game.me && !player.isOnline()) {
        await game.delayx();
      }
      const target = lib.skill.caiwang.logTarget(trigger, player);
      player.logSkill(event.name, target);
      await player[player.getStorage("naxiang2").includes(target) ? "gainPlayerCard" : "discardPlayerCard"](target, "he", true);
    }
  },
  naxiang: {
    audio: 2,
    trigger: {
      player: "damageEnd",
      source: "damageSource"
    },
    forced: true,
    preHidden: true,
    filter(event, player) {
      const target = lib.skill.naxiang.logTarget(event, player);
      return target && target !== player && target.isAlive();
    },
    logTarget(event, player) {
      if (event == null) {
        return;
      }
      return player === event.player ? event.source : event.player;
    },
    async content(_event, trigger, player) {
      player.addTempSkill("naxiang2", { player: "phaseBegin" });
      if (!player.storage.naxiang2) {
        player.storage.naxiang2 = [];
      }
      player.storage.naxiang2.add(lib.skill.naxiang.logTarget(trigger, player));
      player.markSkill("naxiang2");
    },
    ai: {
      combo: "caiwang"
    }
  },
  naxiang2: {
    onremove: true,
    intro: {
      content: "已接受$的投降；对这些角色发动【才望】时将“弃置”改为“获得”"
    }
  },
  //李肃
  qiaoyan: {
    audio: 2,
    trigger: { player: "damageBegin2" },
    forced: true,
    filter(event, player) {
      return player !== _status.currentPhase && event.source && event.source !== player;
    },
    logTarget: "source",
    async content(event, trigger, player) {
      const expansionCards = player.getExpansions("qiaoyan");
      if (expansionCards.length) {
        const source = trigger.source;
        await source.gain({
          cards: expansionCards,
          source: player,
          animate: "give",
          bySelf: true
        });
        return;
      }
      trigger.cancel();
      await player.draw();
      const handCards = player.getCards("he");
      if (!handCards.length) {
        return;
      }
      const result = handCards.length === 1 ? { bool: true, cards: handCards } : await player.chooseCard({
        prompt: "将一张牌作为“珠”置于武将牌上",
        position: "he",
        forced: true
      }).forResult();
      if (!result.bool || !result.cards?.length) {
        return;
      }
      await player.addToExpansion({
        cards: result.cards,
        source: player,
        animate: "give",
        gaintag: ["qiaoyan"]
      });
    },
    marktext: "珠",
    intro: { content: "expansion", markcount: "expansion" },
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile({ cards: cards2 });
      }
    },
    ai: {
      filterDamage: true,
      skillTagFilter(player, tag, arg) {
        if (!player.getExpansions("qiaoyan").length) {
          return false;
        }
        if (arg && arg.player) {
          if (arg.player.hasSkillTag("jueqing", false, player)) {
            return false;
          }
        }
      }
    }
  },
  xianzhu: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    locked: true,
    filter(event, player) {
      return player.getExpansions("qiaoyan").length > 0;
    },
    async cost(event, trigger, player) {
      event.cards = player.getExpansions("qiaoyan");
      event.result = await player.chooseTarget({
        prompt: "请选择【献珠】的目标",
        prompt2: `将${get.translation(event.cards)}交给一名角色。若该角色不为你自己，则你令其视为对其攻击范围内的另一名角色使用【杀】`,
        forced: true,
        ai(target) {
          const player2 = get.player();
          const evt = get.event().getParent();
          if (evt == null) {
            return 0;
          }
          let eff = get.sgn(get.attitude(player2, target)) * get.value(evt.cards[0], target);
          if (player2 !== target) {
            eff += Math.max(...game.filterPlayer((current) => current !== target && player2.inRange(current) && target.canUse("sha", current, false)).map((current) => get.effect(current, { name: "sha" }, target, player2)));
          }
          return eff;
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const cards2 = player.getExpansions("qiaoyan");
      const target = event.targets[0];
      await player.give(cards2, target, true);
      if (player === target || !target.isIn() || !player.isIn()) {
        return;
      }
      if (!game.hasPlayer((current) => current !== target && player.inRange(current) && target.canUse("sha", current, false))) {
        return;
      }
      const str = get.translation(target);
      const result = await player.chooseTarget({
        prompt: `选择攻击范围内的一名角色，视为${str}对其使用【杀】`,
        filterTarget(card2, player2, current) {
          return player2.inRange(current) && get.event().target.canUse("sha", current, false);
        },
        forced: true,
        ai(current) {
          const { player: player2, target: target2 } = get.event();
          return get.effect(current, { name: "sha" }, target2, player2);
        }
      }).set("target", target).forResult();
      if (!result.bool || !result.targets?.length) {
        return;
      }
      const card = get.autoViewAs({ name: "sha", isCard: true });
      await target.useCard({
        card,
        targets: result.targets,
        addCount: false
      });
    },
    ai: { combo: "qiaoyan" }
  },
  huirong: {
    audio: 2,
    trigger: { player: "showCharacterAfter" },
    filter(event, player) {
      return event.toShow?.some((i) => get.character(i).skills?.includes("huirong")) && game.hasPlayer((target) => {
        const num = target.countCards("h");
        return num > target.hp || num < Math.min(5, target.hp);
      });
    },
    hiddenSkill: true,
    locked: true,
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(
        "请选择【慧容】的目标",
        "令一名角色将手牌数摸至/弃置至与其体力值相同（至多摸至五张）",
        (card, player2, target) => {
          const num = target.countCards("h");
          return num > target.hp || num < Math.min(5, target.hp);
        },
        true
      ).set("ai", (target) => {
        const att = get.attitude(get.player(), target);
        const num = target.countCards("h");
        if (num > target.hp) {
          return -att * (num - target.hp);
        }
        return att * Math.max(0, Math.min(5, target.hp) - target.countCards("h"));
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      if (target.countCards("h") < target.hp) {
        await target.drawTo(Math.min(5, target.hp));
      } else if (target.countCards("h") > target.hp) {
        await target.chooseToDiscard("h", true, target.countCards("h") - target.hp, "allowChooseAll");
      }
    }
  },
  ciwei: {
    init: () => {
      game.addGlobalSkill("ciwei_ai");
    },
    onremove: () => {
      if (!game.hasPlayer((i) => i.hasSkill("ciwei", null, null, false), true)) {
        game.removeGlobalSkill("ciwei_ai");
      }
    },
    audio: 2,
    trigger: { global: "useCard" },
    direct: true,
    preHidden: true,
    filter(event, player) {
      if (event.all_excluded || event.player === player || event.player !== _status.currentPhase || !player.hasCards("he")) {
        return false;
      }
      return event.player.getHistory("useCard").indexOf(event) === 1 && ["basic", "trick"].includes(get.type(event.card));
    },
    async content(event, trigger, player) {
      if (player !== game.me && !player.isOnline()) {
        await game.delayx();
      }
      const next = player.chooseToDiscard({
        prompt: get.prompt("ciwei", trigger.player),
        prompt2: `弃置一张牌，取消${get.translation(trigger.card)}的所有目标`,
        position: "he"
      }).set("ai", (card) => _status.event.goon / 1.4 - get.value(card)).set(
        "goon",
        (() => {
          if (!trigger.targets.length) {
            return -get.attitude(player, trigger.player);
          }
          let num = 0;
          for (const target of trigger.targets) {
            num -= get.effect(target, trigger.card, trigger.player, player);
          }
          return num;
        })()
      ).setHiddenSkill(event.name);
      next.logSkill = ["ciwei", trigger.player];
      const result = await next.forResult();
      if (!result.bool) {
        return;
      }
      trigger.targets.length = 0;
      trigger.all_excluded = true;
    }
  },
  ciwei_ai: {
    mod: {
      aiOrder(player, card, num) {
        if (player != _status.currentPhase || player.getHistory("useCard").length > 1 || !game.hasPlayer(function(current) {
          return current != player && (get.realAttitude || get.attitude)(current, player) < 0 && current.hasSkill("ciwei") && current.countCards("he") > 0;
        })) {
          return;
        }
        if (player.getHistory("useCard").length == 0) {
          if (["basic", "trick"].includes(get.type(card))) {
            return num + 10;
          }
          return;
        }
        if (!["basic", "trick"].includes(get.type(card))) {
          return num + 10;
        }
        if (!player._ciwei_temp) {
          player._ciwei_temp = true;
          num /= Math.max(1, player.getUseValue(card));
        }
        delete player._ciwei_temp;
        return num;
      }
    },
    trigger: { player: "dieAfter" },
    sourceSkill: "ciwei",
    filter() {
      return !game.hasPlayer((current) => current.hasSkill("ciwei", null, null, false), true);
    },
    silent: true,
    forceDie: true,
    async content(_) {
      game.removeGlobalSkill("ciwei_ai");
    }
  },
  caiyuan: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    preHidden: true,
    filter(event, player) {
      if (player.phaseNumber <= 1) {
        return false;
      }
      const history1 = _status.globalHistory, history2 = player.actionHistory;
      for (let i = 0; i < Math.min(history1.length, history2.length); i++) {
        let i1 = history1.length - 1 - i, i2 = history2.length - 1 - i;
        if (i > 0 && history2[i2].isMe) {
          break;
        }
        if (history1[i1].changeHp.some((evt) => evt.player == player && evt.num < 0)) {
          return false;
        }
      }
      return true;
    },
    async content(event, trigger, player) {
      await player.draw(2);
    }
  },
  zhuosheng: {
    audio: 2,
    trigger: { player: "useCard2" },
    locked: false,
    init(player) {
      player.addSkill("zhuosheng_count");
      if (game.phaseNumber > 0) {
        const handCards = player.getCards("h");
        const allHistory = player.getAllHistory();
        let cards2 = [];
        for (let i = allHistory.length - 1; i >= 0; i--) {
          for (const gainEvent of allHistory[i].gain) {
            cards2.addArray(gainEvent.cards);
          }
          if (allHistory[i].isRound) {
            break;
          }
        }
        cards2 = cards2.filter((card) => handCards.includes(card));
        if (cards2.length) {
          player.addGaintag(cards2, "zhuosheng");
        }
      }
    },
    onremove(player) {
      player.removeSkill("zhuosheng_count");
      player.removeGaintag("zhuosheng");
    },
    mod: {
      targetInRange(card, player) {
        if (get.type(card) !== "basic") {
          return;
        }
        if (!(game.online ? player === _status.currentPhase : player.isPhaseUsing())) {
          return;
        }
        if (get.number(card) === "unsure" || card.cards?.every((card2) => card2.hasGaintag("zhuosheng"))) {
          return true;
        }
      },
      cardUsable(card, player) {
        if (get.mode() === "guozhan" || get.type(card) !== "basic") {
          return;
        }
        if (!(game.online ? player === _status.currentPhase : player.isPhaseUsing())) {
          return;
        }
        if (get.number(card) === "unsure" || card.cards?.every((card2) => card2.hasGaintag("zhuosheng"))) {
          return Infinity;
        }
      },
      aiOrder(player, card, num) {
        if (get.itemtype(card) === "card" && card.hasGaintag("zhuosheng") && get.type(card) === "basic") {
          return num - 0.1;
        }
      }
    },
    filter(event, player) {
      if (!lib.skill.zhuosheng.filterx(event, player)) {
        return false;
      }
      if (get.type(event.card) !== "trick") {
        return false;
      }
      if (event.targets && event.targets.length > 0) {
        return true;
      }
      const info = get.info(event.card);
      if (info.allowMultiple === false) {
        return false;
      }
      if (event.targets && !info.multitarget) {
        if (game.hasPlayer((current) => !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current))) {
          return true;
        }
      }
      return false;
    },
    filterx(event, player) {
      if (!player.isPhaseUsing()) {
        return false;
      }
      return player.hasHistory("lose", (evt) => {
        if ((evt.relatedEvent || evt.getParent()) !== event) {
          return false;
        }
        return Object.values(evt.gaintag_map).flat().includes("zhuosheng");
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt("zhuosheng"),
        prompt2: `为${get.translation(trigger.card)}增加或减少一个目标`,
        filterTarget(_card, _player, target) {
          const { player: player2, card, targets } = get.event();
          if (targets.includes(target) && targets.length > 1) {
            return true;
          }
          return !targets.includes(target) && lib.filter.targetEnabled2(card, player2, target);
        },
        ai(target) {
          const event2 = get.event();
          const { player: player2, card, targets } = event2;
          return get.effect(target, card, player2, player2) * (targets.includes(target) ? -1 : 1);
        }
      }).set("card", trigger.card).set("targets", trigger.targets).forResult();
    },
    logTarget: "targets",
    async content(event, trigger, player) {
      if (!event.isMine() && !event.isOnline()) {
        await game.delayx();
      }
      if (trigger.targets.includes(event.targets[0])) {
        trigger.targets.removeArray(event.targets);
      } else {
        trigger.targets.addArray(event.targets);
      }
    },
    group: ["zhuosheng_equip", "zhuosheng_silent"],
    subfrequent: ["equip"],
    subSkill: {
      equip: {
        audio: "zhuosheng",
        trigger: { player: "useCard" },
        filter(event, player) {
          return get.type(event.card) === "equip" && lib.skill.zhuosheng.filterx(event, player);
        },
        frequent: true,
        prompt2: "你可以摸一张牌",
        async content(event, trigger, player) {
          await player.draw();
        }
      },
      silent: {
        trigger: { player: "useCard1" },
        silent: true,
        firstDo: true,
        filter(event, player) {
          return get.mode() !== "guozhan" && get.type(event.card) === "basic" && lib.skill.zhuosheng.filterx(event, player) && event.addCount !== false;
        },
        async content(event, trigger, player) {
          if (trigger.addCount !== false) {
            trigger.addCount = false;
            const stat = trigger.player.getStat().card;
            const name = trigger.card.name;
            if (typeof stat[name] === "number") {
              stat[name]--;
            }
          }
        }
      },
      count: {
        trigger: {
          player: "gainBegin",
          global: "roundStart"
        },
        silent: true,
        filter(event, player) {
          if (event.name === "gain") {
            return event.getParent(2).name !== "zhuosheng_equip";
          }
          return game.roundNumber > 1;
        },
        async content(event, trigger, player) {
          if (trigger.name == "gain") {
            trigger.gaintag.add("zhuosheng");
          } else {
            player.removeGaintag("zhuosheng");
          }
        }
      }
    }
  },
  xinquanbian: {
    audio: "quanbian",
    preHidden: true,
    trigger: { player: ["useCard", "respond"] },
    filter(event, player) {
      var phase = event.getParent("phaseUse");
      if (!phase || phase.player != player) {
        return false;
      }
      var suit = get.suit(event.card);
      if (!lib.suit.includes(suit) || !lib.skill.quanbian.hasHand(event)) {
        return false;
      }
      return player.getHistory("useCard", function(evt) {
        return evt != event && get.suit(evt.card) == suit && lib.skill.quanbian.hasHand(evt) && evt.getParent("phaseUse") == phase;
      }).length + player.getHistory("respond", function(evt) {
        return evt != event && get.suit(evt.card) == suit && lib.skill.quanbian.hasHand(evt) && evt.getParent("phaseUse") == phase;
      }).length == 0;
    },
    async content(event, trigger, player) {
      const cards2 = get.cards(Math.min(5, player.maxHp), true);
      await game.cardsGotoOrdering(cards2);
      const suit = get.suit(trigger.card);
      const result = await player.chooseToMove("权变：获得一张不为" + get.translation(suit) + "花色的牌并排列其他牌").set("suit", suit).set("list", [["牌堆顶", cards2], ["获得"]]).set("filterMove", function(from, to, moved) {
        var suit2 = _status.event.suit;
        if (moved[0].includes(from.link)) {
          if (typeof to == "number") {
            if (to == 1) {
              if (moved[1].length) {
                return false;
              }
              return get.suit(from.link, false) != suit2;
            }
            return true;
          }
          if (moved[1].includes(to.link)) {
            return get.suit(from.link, false) != suit2;
          }
          return true;
        } else {
          if (typeof to == "number") {
            return true;
          }
          return get.suit(to.link, false) != suit2;
        }
      }).set("processAI", function(list) {
        var cards3 = list[0][1].slice(0).sort(function(a, b) {
          return get.value(b) - get.value(a);
        }), gains = [];
        for (var i of cards3) {
          if (get.suit(i, false) != _status.event.suit) {
            cards3.remove(i);
            gains.push(i);
            break;
          }
        }
        return [cards3, gains];
      }).forResult();
      if (result.bool) {
        const list = result.moved;
        if (list[1].length) {
          await player.gain(list[1], "gain2");
        }
        if (list[0].length) {
          await game.cardsGotoPile(list[0].reverse(), "insert");
        }
      }
    },
    //group:'xinquanbian_count',
    init: (player, skill) => player.addSkill("xinquanbian_count"),
    onremove: (player, skill) => player.removeSkill("xinquanbian_count")
  },
  xinquanbian_count: {
    trigger: {
      player: ["useCard0", "phaseUseBefore", "phaseUseAfter"]
    },
    silent: true,
    firstDo: true,
    charlotte: true,
    sourceSkill: "xinquanbian",
    filter(event, player) {
      if (event.name === "phaseUse") {
        return true;
      }
      return player.isPhaseUsing() && lib.skill.quanbian.hasHand(event) && get.type(event.card) != "equip";
    },
    async content(event, trigger, player) {
      const stat = player.getStat("skill");
      if (trigger.name === "phaseUse") {
        delete stat.xinquanbian;
      } else {
        if (!stat.xinquanbian) {
          stat.xinquanbian = 0;
        }
        stat.xinquanbian++;
      }
    },
    mod: {
      cardEnabled2(card, player) {
        var stat = player.getStat("skill");
        if (stat.xinquanbian && stat.xinquanbian >= player.maxHp && get.position(card) == "h" && get.type(card, null, player) != "equip") {
          return false;
        }
      }
    }
  },
  taoyin: {
    audio: 2,
    trigger: { player: "showCharacterAfter" },
    hiddenSkill: true,
    logTarget() {
      return _status.currentPhase;
    },
    filter(event, player) {
      const target = _status.currentPhase;
      return player != target && target?.isAlive() && event.toShow?.some((i) => get.character(i).skills?.includes("taoyin"));
    },
    check(event, player) {
      return get.attitude(player, _status.currentPhase) < 0;
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      target.addTempSkill(event.name + "_effect");
      target.addMark(event.name + "_effect", 2, false);
    },
    ai: { expose: 0.2 },
    subSkill: {
      effect: {
        onremove: true,
        charlotte: true,
        intro: { content: "本回合手牌上限-#" },
        mod: {
          maxHandcard(player, num) {
            return num - player.countMark("taoyin_effect");
          }
        }
      }
    }
  },
  yimie: {
    audio: 2,
    usable: 1,
    preHidden: true,
    trigger: { source: "damageBegin1" },
    filter(event, player) {
      return player != event.player && event.num < event.player.hp;
    },
    check(event, player) {
      if (event.player.hasSkillTag("nodamage", null, {
        source: player,
        card: event.card,
        natures: get.natureList(event)
      })) {
        return false;
      }
      let tj = player.countCards("hs", function(card) {
        return get.name(card) === "tao" || get.name(card) === "jiu";
      }), att = get.attitude(_status.event.player, event.player), eff = get.damageEffect(event.player, player, _status.event.player, get.natureList(event)), fd = event.player.hasSkillTag("filterDamage", null, {
        player,
        card: event.card
      }), hp = player.hp + tj;
      if (player.storage.tairan2) {
        hp -= player.storage.tairan2;
      }
      if (eff <= 0 || fd || att >= -2 || Math.abs(hp) <= 1) {
        return false;
      }
      if (hp > 2 || eff > 0 && event.player.isLinked() && event.hasNature()) {
        return true;
      }
      return !event.player.countCards("hs") || event.player.hp > 2 * event.num && !event.player.hasSkillTag("maixie");
    },
    logTarget: "player",
    async content(event, trigger, player) {
      player.loseHp();
      trigger.player.addTempSkill("yimie2");
      trigger.yimie_num = trigger.player.hp - trigger.num;
      trigger.num = trigger.player.hp;
    },
    ai: {
      damageBonus: true,
      skillTagFilter(player, tag, arg) {
        return arg && arg.target && arg.target.hp > 1 && player.hp > 1 && get.attitude(player, arg.target) < -2;
      }
    }
  },
  yimie2: {
    trigger: { player: "damageEnd" },
    forced: true,
    popup: false,
    charlotte: true,
    sourceSkill: "yimie",
    filter(event, player) {
      return typeof event.yimie_num == "number";
    },
    async content(event, trigger, player) {
      await player.recover(trigger.yimie_num);
    }
  },
  ruilve: {
    audio: 2,
    global: "ruilve2",
    zhuSkill: true
  },
  ruilve2: {
    enable: "phaseUse",
    discard: false,
    lose: false,
    delay: false,
    line: true,
    log: false,
    prepare(cards2, player, targets) {
      targets[0].logSkill("ruilve");
    },
    prompt() {
      var player = _status.event.player;
      var list = game.filterPlayer(function(target) {
        return target != player && target.hasZhuSkill("ruilve", player);
      });
      var str = "将一张具有伤害标签的基本牌或锦囊牌交给" + get.translation(list);
      if (list.length > 1) {
        str += "中的一人";
      }
      return str;
    },
    filter(event, player) {
      if (player.group != "jin") {
        return false;
      }
      if (player.countCards("h", lib.skill.ruilve2.filterCard) == 0) {
        return false;
      }
      return game.hasPlayer(function(target) {
        return target != player && target.hasZhuSkill("ruilve", player) && !target.hasSkill("ruilve3");
      });
    },
    filterCard(card) {
      if (!get.is.damageCard(card)) {
        return false;
      }
      var type = get.type(card);
      return type == "basic" || type == "trick";
    },
    visible: true,
    filterTarget(card, player, target) {
      return target != player && target.hasZhuSkill("ruilve", player) && !target.hasSkill("ruilve3");
    },
    async content(event, trigger, player) {
      player.give(event.cards, event.target);
      event.target.addTempSkill("ruilve3", "phaseUseEnd");
    },
    ai: {
      expose: 0.3,
      order: 1,
      result: {
        target: 5
      }
    }
  },
  ruilve3: {},
  tairan: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    preHidden: true,
    filter(event, player) {
      return player.hp < player.maxHp || player.countCards("h") < player.maxHp;
    },
    async content(_event, _trigger, player) {
      player.addSkill("tairan2");
      if (!player.storage.tairan2) {
        player.storage.tairan2 = 0;
      }
      const num = player.maxHp - player.hp;
      if (num > 0) {
        player.storage.tairan2 = num;
        await player.recover({ num });
      }
      if (player.countCards("h") >= player.maxHp) {
        return;
      }
      const next = player.drawTo(player.maxHp);
      next.gaintag = ["tairan"];
      await next;
    }
  },
  tairan2: {
    mod: {
      aiOrder(player, card, num) {
        if (card.hasGaintag && card.hasGaintag("tairan")) {
          return 10 * num;
        }
      },
      aiValue(player, card, num) {
        if (card.hasGaintag && card.hasGaintag("tairan")) {
          if (card.name !== "wuxie" && (get.type(card) === "basic" || get.type(card, "trick") === "trick")) {
            return num / 64;
          }
          return num / 8;
        }
      },
      aiUseful(player, card, num) {
        return lib.skill.tairan2.mod.aiValue.apply(this, arguments);
      }
    },
    audio: "tairan",
    trigger: { player: "phaseUseBegin" },
    charlotte: true,
    forced: true,
    onremove: true,
    sourceSkill: "tairan",
    async content(_event, _trigger, player) {
      const map = player.storage.tairan2;
      if (map > 0) {
        player.loseHp(map);
      }
      const hs = player.getCards("h", (card) => card.hasGaintag("tairan"));
      if (hs.length) {
        player.discard({ cards: hs });
      }
      player.removeSkill("tairan2");
    }
  },
  baoqie: {
    audio: 2,
    trigger: { player: "showCharacterAfter" },
    forced: true,
    hiddenSkill: true,
    filter(event, player) {
      return event.toShow?.some((i) => get.character(i).skills?.includes("baoqie"));
    },
    async content(event, _trigger, player) {
      const card = get.cardPile((card2) => get.subtype(card2, false) === "equip5" && !get.cardtag(card2, "gifts"));
      if (!card) {
        return;
      }
      await player.gain({
        cards: [card],
        animate: "gain2"
      });
      if (!player.hasCards("h", (cardx) => cardx === card) || get.subtype(card) !== "equip5") {
        return;
      }
      const next = player.chooseUseTarget({ card });
      next.nopopup = true;
      await next;
    }
  },
  jyishi: {
    audio: 2,
    trigger: { global: ["loseAfter", "loseAsyncAfter"] },
    usable: 1,
    preHidden: true,
    filter(event, player) {
      const target = _status.currentPhase;
      if (!target || !target.isIn() || event.type != "discard" || !target.isPhaseUsing()) {
        return false;
      }
      if (target == player) {
        return false;
      }
      const evt = event.getl(target);
      return evt?.hs?.someInD("d");
    },
    async cost(event, trigger, player) {
      const target = _status.currentPhase, cards2 = trigger.getl(target).hs.filterInD("d");
      event.cards = cards2;
      let str = "是否发动【宜室】令" + get.translation(target) + "获得其中一张牌";
      if (cards2.length > 1) {
        str += "，然后获得其余的牌";
      }
      str += "？";
      const { bool, links } = await player.chooseButton([str, cards2]).set("ai", (button) => {
        const card = button.link;
        const { player: player2, source } = get.event();
        if (get.attitude(player2, source) > 0) {
          return Math.max(1, source.getUseValue(card, null, true));
        }
        const cards3 = get.event().getParent().cards.slice(0);
        if (cards3.length == 1) {
          return -get.value(card);
        }
        cards3.remove(card);
        return get.value(cards3) - get.value(card) - 2;
      }).set("source", target).setHiddenSkill(event.skill).forResult();
      event.result = {
        bool,
        targets: [target],
        cost_data: links
      };
    },
    async content(event, trigger, player) {
      const {
        targets: [target],
        cost_data: links
      } = event, cards2 = trigger.getl(target).hs.filterInD("d");
      await target.gain(links, "gain2");
      cards2.remove(links[0]);
      if (cards2.length) {
        await player.gain(cards2, "gain2");
      }
    }
  },
  shiduo: {
    audio: 2,
    usable: 1,
    enable: "phaseUse",
    filter(event, player) {
      return game.hasPlayer((target) => player !== target && player.canCompare(target));
    },
    filterTarget(card, player, target) {
      return player !== target && player.canCompare(target);
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const { bool } = await player.chooseToCompare(target).forResult();
      if (!bool || !target.isAlive()) {
        return;
      }
      const targetHands = target.getCards("h");
      if (targetHands.length) {
        await player.gain({
          cards: targetHands,
          source: target,
          animate: "giveAuto",
          bySelf: true
        });
      }
      const giveCount = Math.floor(player.countCards("h") / 2);
      if (!giveCount || !target.isAlive()) {
        return;
      }
      await player.chooseToGive({
        prompt: `交给${get.translation(target)}${get.cnNumber(giveCount)}张牌`,
        target,
        selectCard: giveCount,
        position: "h",
        forced: true
      });
    },
    ai: {
      order: 1,
      result: {
        target(player, target) {
          const delta = target.countCards("h") - player.countCards("h");
          if (delta < 0) {
            return 0;
          }
          return -1 - delta;
        }
      }
    }
  },
  tuishi: {
    audio: 2,
    trigger: { player: "showCharacterAfter" },
    forced: true,
    locked: false,
    hiddenSkill: true,
    filter(event, player) {
      const target = _status.currentPhase;
      return player !== target && target && target.isAlive() && event.toShow?.some((i) => get.character(i).skills?.includes("tuishi"));
    },
    async content(_event, _trigger, player) {
      player.addTempSkill("tuishi2");
    }
  },
  tuishi2: {
    trigger: { global: "phaseEnd" },
    charlotte: true,
    sourceSkill: "tuishi",
    filter(event, player) {
      const target = _status.currentPhase;
      return target != null && target !== player && target.isAlive() && game.hasPlayer((current) => current !== target && target.inRange(current));
    },
    async cost(event, trigger, player) {
      const targetx = _status.currentPhase;
      event.result = await player.chooseTarget({
        prompt: get.prompt2("tuishi", targetx),
        filterTarget(card, player2, target) {
          const targetx2 = get.event().targetx;
          return targetx2 !== target && targetx2.inRange(target);
        },
        ai(target) {
          const event2 = get.event();
          if (!event2.goon) {
            return 0;
          }
          return get.effect(target, { name: "sha" }, event2.source, event2.player);
        }
      }).set("targetx", targetx).set("goon", get.damageEffect(targetx, player, player) > 0).forResult();
    },
    async content(event, trigger, player) {
      const source = _status.currentPhase;
      const target = event.targets[0];
      player.line2([source, target]);
      await game.delayx();
      const result = await source.chooseToUse({
        prompt: `请对${get.translation(target)}使用一张【杀】，或受到来自${get.translation(player)}的1点伤害`,
        filterCard(card, player2) {
          return get.name(card) === "sha" && lib.filter.filterCard.apply(this, arguments);
        },
        filterTarget(card, player2, current) {
          return current === get.event().preTarget && lib.filter.filterTarget.apply(this, arguments);
        },
        addCount: false
      }).set("preTarget", target).forResult();
      if (!result.bool) {
        await source.damage({ source: player });
      }
    }
  },
  xinchoufa: {
    audio: "choufa",
    inherit: "choufa",
    async content(event, _trigger, player) {
      const target = event.targets[0];
      const result = await player.choosePlayerCard({
        target,
        position: "h",
        forced: true
      }).forResult();
      if (!result?.bool || !result.cards?.length) {
        return;
      }
      await player.showCards(result.cards, `${get.translation(player)}对${get.translation(target)}发动了【筹伐】`);
      const type = get.type2(result.cards[0], target);
      const hs = target.getCards("h", (card) => card !== result.cards?.[0] && get.type2(card, target) !== type);
      if (!hs.length) {
        return;
      }
      target.addGaintag(hs, "xinchoufa");
      target.addTempSkill("xinchoufa2", { player: "phaseAfter" });
    }
  },
  xinchoufa2: {
    charlotte: true,
    onremove(player) {
      player.removeGaintag("xinchoufa");
    },
    mod: {
      cardname(card) {
        if (get.itemtype(card) === "card" && card.hasGaintag("xinchoufa")) {
          return "sha";
        }
      },
      cardnature(card) {
        if (get.itemtype(card) === "card" && card.hasGaintag("xinchoufa")) {
          return false;
        }
      }
    }
  },
  choufa: {
    enable: "phaseUse",
    audio: 2,
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => lib.skill.choufa.filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return target !== player && !target.hasSkill("choufa2") && target.hasCards("h");
    },
    async content(event, _trigger, player) {
      const target = event.targets[0];
      const result = await player.choosePlayerCard({
        target,
        position: "h",
        forced: true
      }).forResult();
      if (!result?.bool || !result.cards?.length) {
        return;
      }
      await player.showCards(result.cards);
      const type = get.type2(result.cards[0], target);
      target.storage.choufa2 = type;
      target.addTempSkill("choufa2", { player: "phaseAfter" });
    },
    ai: {
      order: 9,
      result: {
        target(player, target) {
          return -target.countCards("h");
        }
      }
    }
  },
  choufa2: {
    onremove: true,
    charlotte: true,
    mark: true,
    intro: { content: "手牌中的非$牌均视为杀" },
    mod: {
      cardname(card, player) {
        if (get.type2(card, false) !== player.storage.choufa2) {
          return "sha";
        }
      },
      cardnature(card, player) {
        if (get.type2(card, false) !== player.storage.choufa2) {
          return false;
        }
      }
    }
  },
  zhaoran: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    preHidden: true,
    async content(event, trigger, player) {
      player.addTempSkill("zhaoran2", "phaseUseAfter");
      const cards2 = player.getCards("h");
      if (cards2.length > 0) {
        await player.addShownCards({
          cards: cards2,
          gaintag: ["visible_zhaoran"]
        });
      }
    }
  },
  zhaoran2: {
    audio: "zhaoran",
    group: "zhaoran3",
    sourceSkill: "zhaoran",
    init: (player, skill) => {
      if (!player.storage[skill]) {
        player.storage[skill] = [];
      }
    },
    onremove: true,
    trigger: {
      player: "loseAfter",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    forced: true,
    charlotte: true,
    popup: false,
    filter(event, player, name) {
      if (name === "gainBegin") {
        return true;
      }
      const evt = event.getl(player);
      if (!evt || !evt.hs || !evt.hs.length) {
        return false;
      }
      const list = player.getStorage("zhaoran2");
      for (const card of evt.hs) {
        const suit = get.suit(card, player);
        if (!list.includes(suit) && !player.countCards("h", { suit })) {
          return true;
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      if (trigger.delay === false) {
        await game.delayx();
      }
      const list = [];
      const suits = get.copy(player.storage.zhaoran2);
      suits.addArray(player.getCards("h").map((card) => get.suit(card)));
      const evt = trigger.getl(player);
      for (const card of evt.hs) {
        const suit = get.suit(card, player);
        if (!suits.includes(suit)) {
          list.add(suit);
        }
      }
      player.markAuto("zhaoran2", list);
      const filterTarget = (card, currentPlayer, target) => {
        return target !== currentPlayer && target.countDiscardableCards(currentPlayer, "he") > 0;
      };
      for (let count = list.length; count > 0; count--) {
        if (!game.hasPlayer((current) => filterTarget(null, player, current))) {
          player.logSkill("zhaoran2");
          await player.draw();
          continue;
        }
        const result = await player.chooseTarget({
          prompt: "弃置一名其他角色的一张牌或摸一张牌",
          filterTarget,
          ai(target2) {
            const attitude = get.attitude(player, target2);
            if (attitude >= 0) {
              return 0;
            }
            if (target2.countCards("he", (card) => get.value(card) > 5)) {
              return -attitude;
            }
            return 0;
          }
        }).forResult();
        if (!result.bool || !result.targets?.length) {
          player.logSkill("zhaoran2");
          await player.draw();
          continue;
        }
        const target = result.targets[0];
        player.logSkill("zhaoran2", target);
        await player.discardPlayerCard({
          target,
          position: "he",
          forced: true
        });
      }
    },
    intro: {
      content: "已因$牌触发过效果"
    }
  },
  zhaoran3: {
    trigger: { player: ["phaseUseEnd", "gainBegin"] },
    forced: true,
    charlotte: true,
    firstDo: true,
    silent: true,
    sourceSkill: "zhaoran",
    async content(event, trigger, player) {
      if (event.triggername === "gainBegin") {
        trigger.gaintag.add("visible_zhaoran");
      } else {
        await player.hideShownCards({
          cards: player.getCards("h"),
          gaintag: ["visible_zhaoran"]
        });
      }
    }
  },
  chengwu: {
    audio: 2,
    zhuSkill: true,
    mod: {
      inRange(from, to) {
        if (!from.hasZhuSkill("chengwu") || from._chengwu) {
          return;
        }
        from._chengwu = true;
        const bool = game.hasPlayer((current) => current !== from && current !== to && current.group === "jin" && from.hasZhuSkill("chengwu", current) && current.inRange(to));
        delete from._chengwu;
        if (bool) {
          return true;
        }
      }
    }
  },
  shiren: {
    audio: 2,
    trigger: { player: "showCharacterAfter" },
    hiddenSkill: true,
    logTarget() {
      return _status.currentPhase;
    },
    filter(event, player) {
      if (!event.toShow?.some((i) => get.character(i).skills?.includes("shiren"))) {
        return false;
      }
      var target = _status.currentPhase;
      return target && target != player && target.isAlive() && target.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      const next = game.createEvent("yanxi", false);
      next.player = player;
      next.target = _status.currentPhase;
      next.setContent(lib.skill.yanxi.content);
      await next;
    }
  },
  yanxi: {
    audio: 2,
    usable: 1,
    enable: "phaseUse",
    filter(event, player) {
      return game.hasPlayer((current) => current !== player && current.hasCards());
    },
    filterTarget(card, player, target) {
      return target !== player && target.hasCards();
    },
    async content(event, trigger, player) {
      const target = event.target;
      const card = target.getCards("h").randomGet();
      let pileCards = get.cards(2);
      let cards2 = pileCards.concat(card);
      while (pileCards.length > 0) {
        ui.cardPile.insertBefore(pileCards.pop().fix(), ui.cardPile.firstChild);
      }
      if (get.mode() == "guozhan") {
        const num = ui.cardPile.childElementCount;
        let num1 = get.rand(1, num - 1);
        let num2 = get.rand(1, num - 1);
        if (num1 == num2) {
          if (num1 == 0) {
            num2++;
          } else {
            num1--;
          }
        }
        cards2 = [card, ui.cardPile.childNodes[num1], ui.cardPile.childNodes[num2]];
      }
      game.updateRoundNumber();
      cards2.randomSort();
      game.log(player, "展示了", cards2);
      const videoId = lib.status.videoId++;
      const str = `${get.translation(player)}对${get.translation(target)}发动了【宴戏】`;
      game.broadcastAll(
        (str2, id, cards3) => {
          const dialog = ui.create.dialog(str2, cards3);
          dialog.videoId = id;
        },
        str,
        videoId,
        cards2
      );
      game.addVideo("showCards", player, [str, get.cardsInfo(cards2)]);
      await game.delay(2);
      const updateDialog = (id, target2) => {
        const dialog = get.idDialog(id);
        if (dialog) {
          dialog.content.firstChild.innerHTML = "猜猜哪张是" + get.translation(target2) + "的手牌？";
        }
      };
      if (player == game.me) {
        updateDialog(videoId, target);
      } else if (player.isOnline()) {
        player.send(updateDialog, videoId, target);
      }
      const next = player.chooseButton({
        forced: true,
        ai(button) {
          const evt = get.event();
          if (evt.answer) {
            return button.link == evt.answer ? 1 : 0;
          }
          return get.value(button.link, evt.player);
        }
      });
      next.set("dialog", videoId);
      if (card.isKnownBy(player) || player.hasSkillTag("viewHandcard", null, target, true)) {
        next.set("answer", card);
      }
      const result = await next.forResult();
      game.broadcastAll("closeDialog", videoId);
      player.addTempSkill("yanxi2");
      const card2 = result.links[0];
      if (card2 !== card) {
        player.popup("杯具");
        await player.gain({
          cards: [card2],
          animate: "gain2",
          gaintag: ["yanxi"]
        });
        return;
      }
      player.popup("洗具");
      cards2.remove(card2);
      player.$gain2(cards2);
      await player.gain({
        cards: cards2,
        log: true,
        gaintag: ["yanxi"]
      });
      await player.gain({
        cards: [card],
        source: target,
        bySelf: true,
        animate: "give",
        gaintag: ["yanxi"]
      });
    },
    ai: {
      order: 6,
      result: {
        player: 1,
        target: -0.6
      }
    }
  },
  yanxi2: {
    mod: {
      ignoredHandcard(card, player) {
        if (card.hasGaintag("yanxi")) {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name == "phaseDiscard" && card.hasGaintag("yanxi")) {
          return false;
        }
      }
    },
    onremove(player) {
      player.removeGaintag("yanxi");
    }
  },
  sanchen: {
    audio: 2,
    usable(skill, player) {
      return 1 + player.countMark("sanchen_add");
    },
    enable: "phaseUse",
    filter(event, player) {
      const stat = player.getStat("sanchen");
      return game.hasPlayer((current) => !stat?.includes(current));
    },
    filterTarget(card, player, target) {
      const stat = player.getStat("sanchen");
      return !stat?.includes(target);
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const stat = player.getStat();
      const grantBonus = async () => {
        await target.draw();
        player.addTempSkill(`${event.name}_add`, "phaseUseAfter");
        player.addMark(`${event.name}_add`, 1, false);
        if (get.mode() === "guozhan") {
          player.addTempSkills("pozhu");
        }
      };
      stat.sanchen ??= [];
      stat.sanchen.push(target);
      if (get.mode() !== "guozhan") {
        player.addMark("sanchen", 1, false);
      }
      await target.draw(3);
      if (!target.countCards("he")) {
        await grantBonus();
        return;
      }
      const result = await target.chooseToDiscard({
        selectCard: 3,
        position: "he",
        forced: true,
        ai(card) {
          const list2 = ui.selected.cards.map((card2) => get.type2(card2));
          if (!list2.includes(get.type2(card))) {
            return 7 - get.value(card);
          }
          return -get.value(card);
        }
      }).forResult();
      if (!result.bool || !result.cards?.length) {
        await grantBonus();
        return;
      }
      const list = [];
      for (const card of result.cards) {
        list.add(get.type2(card));
      }
      if (list.length === result.cards.length) {
        await grantBonus();
      }
    },
    ai: {
      order: 9,
      threaten: 1.7,
      result: {
        target(player, target) {
          if (target.hasSkillTag("nogain")) {
            return 0.1;
          }
          return Math.sqrt(target.countCards("he"));
        }
      }
    },
    intro: {
      content: "已发动过#次技能"
    },
    marktext: "陈",
    subSkill: {
      add: {
        charlotte: true,
        onremove: true
      }
    }
  },
  zhaotao: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    juexingji: true,
    forbid: ["guozhan"],
    skillAnimation: true,
    animationColor: "thunder",
    filter(event, player) {
      return player.countMark("sanchen") > 2;
    },
    async content(event, _trigger, player) {
      player.awakenSkill(event.name);
      await player.loseMaxHp();
      await player.addSkills("pozhu");
    },
    derivation: "pozhu",
    ai: {
      combo: "sanchen"
    }
  },
  pozhu: {
    audio: 2,
    enable: "phaseUse",
    viewAs: { name: "chuqibuyi" },
    viewAsFilter(player) {
      return player.hasCards("hs");
    },
    filterCard: true,
    position: "hs",
    check(card) {
      return 7 - get.value(card);
    },
    group: "pozhu2"
  },
  pozhu2: {
    trigger: { player: "useCardAfter" },
    charlotte: true,
    silent: true,
    sourceSkill: "pozhu",
    filter(event, player) {
      return event.skill === "pozhu" && (get.mode() === "guozhan" || !player.hasHistory("sourceDamage", (evt) => evt.card === event.card));
    },
    async content(_event, _trigger, player) {
      player.tempBanSkill("pozhu");
    }
  },
  xijue: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: ["enterGame", "showCharacterAfter"]
    },
    forced: true,
    filter(event, player) {
      if (get.mode() === "guozhan") {
        return game.getAllGlobalHistory("everything", (evt) => evt.name === "showCharacter" && evt.toShow?.some((i) => get.character(i).skills?.includes("xijue"))).indexOf(event) === 0;
      }
      return event.name !== "showCharacter" && (event.name !== "phase" || game.phaseNumber === 0);
    },
    async content(event, trigger, player) {
      player.addMark("xijue", 4);
    },
    intro: {
      name2: "爵",
      content: "mark"
    },
    derivation: ["xijue_tuxi", "xijue_xiaoguo"],
    group: ["xijue_gain", "xijue_tuxi", "xijue_xiaoguo"],
    subSkill: {
      gain: {
        audio: "xijue",
        trigger: { player: "phaseJieshuBegin" },
        forced: true,
        filter(event, player) {
          const stat = player.getStat();
          return stat.damage != null && stat.damage > 0;
        },
        async content(event, trigger, player) {
          player.addMark("xijue", player.getStat().damage);
        }
      },
      tuxi: {
        audio: 2,
        trigger: {
          player: "phaseDrawBegin2"
        },
        filter(event, player) {
          return event.num > 0 && !event.numFixed && player.hasMark("xijue") && game.hasPlayer((target) => player !== target && target.hasCards("h"));
        },
        async cost(event, trigger, player) {
          const num = get.mode() === "guozhan" ? Math.min(trigger.num, 2) : trigger.num;
          event.result = await player.chooseTarget({
            prompt: "是否弃置一枚“爵”发动【突袭】？",
            prompt2: `获得至多${get.translation(num)}名角色的各一张手牌，然后少摸等量的牌`,
            filterTarget(card, player2, target) {
              return target !== player2 && target.hasCards("h");
            },
            selectTarget: [1, num],
            ai(target) {
              const attitude = get.attitude(get.player(), target);
              if (target.hasSkill("tuntian")) {
                return attitude / 10;
              }
              return 1 - attitude;
            }
          }).forResult();
        },
        logTarget: "targets",
        async content(event, trigger, player) {
          event.targets.sortBySeat();
          player.removeMark("xijue", 1);
          await player.gainMultiple(event.targets);
          trigger.num -= event.targets.length;
          if (trigger.num <= 0) {
            await game.delay();
          }
        },
        ai: { expose: 0.2 }
      },
      xiaoguo: {
        audio: 2,
        trigger: { global: "phaseJieshuBegin" },
        filter(event, player) {
          return player.hasMark("xijue") && event.player.isAlive() && event.player !== player && player.hasCards("h", (card) => _status.connectMode || get.mode() !== "guozhan" || get.type(card) === "basic");
        },
        async cost(event, trigger, player) {
          const target = trigger.player;
          let nono = true;
          if (get.damageEffect(target, player, player) > 0) {
            nono = Math.abs(get.attitude(player, target)) < 3 || target.hp > player.countMark("xijue") * 1.5 || target.hasCards("e", (card) => get.value(card, trigger.player) <= 0);
          }
          event.result = await player.chooseToDiscard({
            prompt: `是否弃置一枚“爵”和一张${get.mode() === "guozhan" ? "基本" : "手"}牌，对${get.translation(target)}发动【骁果】？`,
            filterCard(card, player2) {
              return get.mode() !== "guozhan" || get.type2(card, player2) === "basic";
            },
            position: "h",
            chooseonly: true,
            ai(card) {
              const { nono: nono2 } = get.event();
              return nono2 ? 0 : 8 - get.useful(card);
            }
          }).set("nono", nono).forResult();
          event.result.targets = [target];
        },
        logTarget: "targets",
        async content(event, trigger, player) {
          const { cards: cards2, targets } = event;
          const target = targets[0];
          player.removeMark("xijue", 1);
          await player.discard({ cards: event.cards });
          const result = await target.chooseToDiscard({
            prompt: `弃置一张装备牌并令${get.translation(player)}摸一张牌，或受到1点伤害`,
            filterCard: get.filter({ type: "equip" }),
            position: "he",
            ai(card) {
              const { player: player2, nono } = get.event();
              if (nono) {
                return 0;
              }
              if (player2.hp === 1) {
                return 10 - get.value(card);
              }
              return 9 - get.value(card);
            }
          }).set("nono", get.damageEffect(target, player, target) >= 0).forResult();
          if (result.bool) {
            if (get.mode() !== "guozhan") {
              await player.draw();
            }
            return;
          }
          await target.damage();
        },
        ai: {
          expose: 0.3,
          threaten: 1.3
        }
      }
    }
  },
  huishi: {
    audio: 2,
    trigger: { player: "phaseDrawBegin1" },
    filter(event, player) {
      return ui.cardPile.childElementCount % 10 > 0 && !event.numFixed;
    },
    preHidden: true,
    prompt() {
      return get.prompt("huishi") + "（当前牌堆尾数：" + ui.cardPile.childElementCount % 10 + "）";
    },
    check(event, player) {
      return ui.cardPile.childElementCount % 10 > 3;
    },
    async content(event, trigger, player) {
      trigger.changeToZero();
      const cards2 = get.cards(ui.cardPile.childElementCount % 10, true);
      await game.cardsGotoOrdering(cards2);
      const num = Math.ceil(cards2.length / 2);
      const next = player.chooseToMove("慧识：将" + get.cnNumber(num) + "张牌置于牌堆底并获得其余的牌", true);
      next.set("list", [["牌堆顶的展示牌", cards2], ["牌堆底"]]);
      next.set("filterMove", function(from, to, moved) {
        if (moved[0].includes(from) && to == 1) {
          return moved[1].length < _status.event.num;
        }
        return true;
      });
      next.set("filterOk", function(moved) {
        return moved[1].length == _status.event.num;
      });
      next.set("num", num);
      next.set("processAI", function(list) {
        var cards3 = list[0][1].slice(0).sort(function(a, b) {
          return get.value(b) - get.useful(a);
        });
        return [cards3, cards3.splice(cards3.length - _status.event.num)];
      });
      const result = await next.forResult();
      if (result.moved?.length) {
        const {
          moved: [gain, bottom]
        } = result;
        if (gain.length) {
          await player.gain(gain, "gain2");
        }
        if (bottom.length) {
          await game.cardsGotoPile(bottom);
        }
      }
    }
  },
  qingleng: {
    audio: 2,
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      const target = event.player;
      return target != player && target.isIn() && !target.storage.nohp && target.hp + target.countCards("h") >= ui.cardPile.childElementCount % 10 && player.countCards("he") > 0 && player.canUse({ name: "sha", nature: "ice" }, target, false);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard("he", get.prompt(event.skill, trigger.player), "将一张牌当做冰【杀】对其使用", (card, player2, target) => {
        return player2.canUse(get.autoViewAs({ name: "sha", nature: "ice" }, [card]), _status.event.target, false);
      }).set("target", trigger.player).set("ai", (card) => {
        if (get.effect(_status.event.target, get.autoViewAs({ name: "sha", nature: "ice" }, [card]), player) <= 0) {
          return false;
        }
        return 6 - get.value(card);
      }).setHiddenSkill(event.skill).forResult();
    },
    popup: false,
    preHidden: true,
    async content(event, trigger, player) {
      await player.useCard(get.autoViewAs({ name: "sha", nature: "ice" }, event.cards), event.cards, false, trigger.player, event.name);
      if (!player.getStorage(event.name).includes(trigger.player)) {
        player.markAuto(event.name, [trigger.player]);
        await player.draw();
      }
    },
    intro: { content: "已对$发动过此技能" }
  },
  xuanmu: {
    audio: 2,
    trigger: { player: "showCharacterAfter" },
    forced: true,
    hiddenSkill: true,
    filter(event, player) {
      return event.toShow?.some((i) => get.character(i).skills?.includes("xuanmu")) && player != _status.currentPhase;
    },
    async content(event, trigger, player) {
      player.addTempSkill("xuanmu2");
    }
  },
  xuanmu2: {
    trigger: { player: "damageBegin4" },
    forced: true,
    popup: false,
    sourceSkill: "xuanmu",
    async content(event, trigger, player) {
      trigger.cancel();
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage") && !player.hasSkillTag("jueqing", false, target)) {
            return "zerotarget";
          }
        }
      }
    }
  },
  g_hidden_ai: {
    charlotte: true,
    ai: {
      threaten(player, target) {
        if (get.mode() != "guozhan" && target.isUnseen(2)) {
          return 1e-4;
        }
        return 1;
      }
    }
  }
};
const translates = {
  jin_zhangchunhua: "晋张春华",
  jin_zhangchunhua_prefix: "晋",
  huishi: "慧识",
  huishi_info: "摸牌阶段，你可以放弃摸牌，改为观看牌堆顶的X张牌，获得其中的一半（向下取整），然后将其余牌置入牌堆底。（X为牌堆数量的个位数）",
  qingleng: "清冷",
  qingleng_info: "一名角色的结束阶段，若其体力值与手牌数之和不小于X，则你可将一张牌当无距离限制的冰【杀】对其使用（X为牌堆数量的个位数）。若这是你本局游戏内首次对其发动此技能，则你摸一张牌。",
  xuanmu: "宣穆",
  xuanmu2: "宣穆",
  xuanmu_info: "锁定技，隐匿技。你于其他角色的回合登场时，防止你受到的伤害直到回合结束。",
  jin_simayi: "晋司马懿",
  jin_simayi_prefix: "晋",
  zhanghuyuechen: "张虎乐綝",
  xijue: "袭爵",
  xijue_gain: "袭爵",
  xijue_info: "锁定技，游戏开始时，你获得4枚“爵”。结束阶段，你获得X枚“爵”（X为你本回合内造成的伤害数）。你可弃置一枚“爵”并在合适的时机发动〖突袭〗和〖骁果〗。",
  xijue_info_guozhan: "锁定技，当你首次明置此武将牌时，你获得4枚“爵”。结束阶段，你获得X枚“爵”（X为你本回合内造成的伤害数）。你可弃置一枚“爵”并在合适的时机发动〖突袭〗和〖骁果〗。",
  xijue_tuxi: "突袭",
  xijue_tuxi_info: "摸牌阶段摸牌时，你可以少摸任意张牌，然后获得等量的角色的各一张手牌。",
  xijue_tuxi_info_guozhan: "摸牌阶段摸牌时，你可以少摸至多两张牌，然后获得等量的角色的各一张手牌。",
  xijue_xiaoguo: "骁果",
  xijue_xiaoguo_info: "其他角色的结束阶段开始时，你可以弃置一张手牌，令该角色选择一项：1.弃置一张装备牌，然后你摸一张牌；2.受到你对其造成的1点伤害。",
  xijue_xiaoguo_info_guozhan: "其他角色的结束阶段开始时，你可以弃置一张基本牌，令该角色选择一项：1.弃置一张装备牌；2.受到你对其造成的1点伤害。",
  gz_duyu: "杜预",
  duyu: "晋杜预",
  duyu_prefix: "晋",
  sanchen: "三陈",
  sanchen_info: "出牌阶段限一次。你可选择一名本回合内未选择过的角色。其摸三张牌，然后弃置三张牌。若其未以此法弃置牌或以此法弃置的牌的类别均不相同，则其摸一张牌且〖三陈〗于此阶段内使用次数上限+1。",
  sanchen_info_guozhan: "出牌阶段，你可选择一名本回合内未选择过的角色。其摸三张牌，然后弃置三张牌。若其未以此法弃置牌或以此法弃置的牌的类别均不相同，则其摸一张牌且你获得技能〖破竹〗直到回合结束。否则你本阶段内不能再发动〖三陈〗。",
  zhaotao: "昭讨",
  zhaotao_info: "觉醒技，准备阶段，若你本局游戏内发动〖三陈〗的次数大于2，则你减1点体力上限并获得〖破竹〗。",
  pozhu: "破竹",
  pozhu_info: "出牌阶段，你可以将一张手牌当做【出其不意】使用。若你未因此牌造成过伤害，则你不能再发动〖破竹〗直到回合结束。",
  pozhu_info_guozhan: "出牌阶段限一次，你可以将一张手牌当做【出其不意】使用。",
  jin_wangyuanji: "晋王元姬",
  jin_wangyuanji_prefix: "晋",
  shiren: "识人",
  shiren_info: "隐匿技。你于其他角色的回合内登场时，若其有手牌，则你可对其发动〖宴戏〗。",
  yanxi: "宴戏",
  yanxi2: "宴戏",
  yanxi_info: "出牌阶段限一次，你可选择一名有手牌的其他角色。你将该角色的一张随机手牌与牌堆顶的两张牌混合后展示，并选择其中一张。若你以此法选择的是该角色的手牌，则你获得这三张牌。否则你获得选择的牌。你通过〖宴戏〗得到的牌，不计入当前回合的手牌上限。",
  yanxi_info_guozhan: "出牌阶段限一次，你可选择一名有手牌的其他角色。你将该角色的一张随机手牌与牌堆中的两张随机牌混合后展示，并选择其中一张。若你以此法选择的是该角色的手牌，则你获得这三张牌。否则你获得选择的牌。你通过〖宴戏〗得到的牌，不计入当前回合的手牌上限。",
  jin_simazhao: "晋司马昭",
  jin_simazhao_prefix: "晋",
  tuishi: "推弑",
  tuishi_info: "隐匿技，你于其他角色A的回合内登场时，可于此回合结束时选择其攻击范围内的一名角色B。A选择一项：①对B使用一张【杀】。②你对A造成1点伤害。",
  choufa: "筹伐",
  choufa2: "筹伐",
  choufa_info: "出牌阶段限一次，你可展示一名其他角色的一张手牌并记录其类型A。你令其当前原类型不为A的手牌的牌名均视为【杀】且均视为无属性，直到其回合结束。",
  xinchoufa: "筹伐",
  xinchoufa_info: "出牌阶段限一次，你可展示一名其他角色的一张手牌A。你令其当前所有类型与A不同的手牌的牌名均视为【杀】且均视为无属性，直到其回合结束。",
  zhaoran: "昭然",
  zhaoran2: "昭然",
  zhaoran_info: "出牌阶段开始时，你可令你的手牌对其他角色可见直到出牌阶段结束。若如此做，当你于此阶段内失去一张手牌后，若你的手牌里没有与此牌花色相同的牌且你本回合内未因该花色的牌触发过此效果，则你选择一项：①摸一张牌。②弃置一名其他角色的一张牌。",
  visible_zhaoran: "invisible",
  chengwu: "成务",
  chengwu_info: "主公技，锁定技，其他晋势力角色攻击范围内的角色视为在你的攻击范围内。",
  jin_xiahouhui: "晋夏侯徽",
  jin_xiahouhui_prefix: "晋",
  baoqie: "宝箧",
  baoqie_info: "隐匿技，锁定技。你登场后，从牌堆或弃牌堆中获得一张不为赠物的宝物牌。若此牌在你的手牌区内为宝物牌，则你可以使用此牌。",
  jyishi: "宜室",
  jyishi_info: "每回合限一次，当有其他角色于其出牌阶段内因弃置而失去手牌后，你可令其获得这些牌中位于弃牌堆的一张，然后你获得其余位于弃牌堆的牌。",
  shiduo: "识度",
  shiduo_info: "出牌阶段限一次，你可以与一名其他角色拼点。若你赢，你获得其所有手牌。然后你交给其X张手牌（X为你手牌数的一半，向下取整）。",
  jin_simashi: "晋司马师",
  jin_simashi_prefix: "晋",
  taoyin: "韬隐",
  taoyin2: "韬隐",
  taoyin_info: "隐匿技，当你登场后，若当前回合角色存在且不是你，则你可令该角色本回合的手牌上限-2。",
  yimie: "夷灭",
  yimie2: "夷灭",
  yimie_info: "每回合限一次，当你对其他角色造成伤害时，若伤害值X小于Y，则你可失去1点体力，将伤害值改为Y。此伤害结算结束后，其回复(Y-X)点体力（Y为其体力值）。",
  ruilve: "睿略",
  ruilve2: "睿略",
  ruilve_info: "主公技，其他晋势力角色的出牌阶段限一次，该角色可以将一张带有伤害标签的基本牌或锦囊牌交给你。",
  tairan: "泰然",
  tairan2: "泰然",
  tairan_info: "锁定技，结束阶段，你将体力回复至体力上限，并将手牌摸至体力上限（称为“泰然”牌）。然后你的下一个出牌阶段开始时，你失去上一次以此法回复的体力值的体力，弃置所有“泰然”牌。",
  gz_jin_simayi: "司马懿",
  gz_jin_zhangchunhua: "张春华",
  gz_jin_simazhao: "司马昭",
  gz_jin_wangyuanji: "王元姬",
  gz_jin_simashi: "司马师",
  gz_jin_xiahouhui: "夏侯徽",
  xinquanbian: "权变",
  xinquanbian_info: "出牌阶段，每当你首次使用/打出一种花色的手牌时，你可以从牌堆顶的X张牌中获得一张与此牌花色不同的牌，并将其余牌以任意顺序置于牌堆顶。出牌阶段，你至多可使用X张非装备手牌。（X为你的体力上限）",
  shibao: "石苞",
  zhuosheng: "擢升",
  zhuosheng_info: "出牌阶段，①你使用本轮内得到的基本牌时无次数和距离限制。②你使用本轮内获得的普通锦囊牌选择目标后，可令此牌的目标数+1或-1。③你使用本轮内得到的装备牌时可以摸一张牌（以此法得到的牌不能触发〖擢升〗）。",
  zhuosheng_info_guozhan: "出牌阶段，①你使用本轮内得到的基本牌时无距离限制。②你使用本轮内获得的普通锦囊牌选择目标后，可令此牌的目标数+1或-1。③你使用本轮内得到的装备牌时可以摸一张牌（以此法得到的牌不能触发〖擢升〗）。",
  jin_yanghuiyu: "晋羊徽瑜",
  jin_yanghuiyu_prefix: "晋",
  gz_jin_yanghuiyu: "羊徽瑜",
  huirong: "慧容",
  huirong_info: "隐匿技，锁定技。当你登场后，你令一名角色将手牌数摸至/弃至与体力值相同（至多摸至五张）。",
  ciwei: "慈威",
  ciwei_info: "一名角色于其回合内使用第二张牌时，若此牌为基本牌或普通锦囊牌，则你可以弃置一张牌，取消此牌的所有目标。",
  caiyuan: "才媛",
  caiyuan_info: "锁定技。结束阶段，若你于你的上一个回合结束后未扣减过体力，则你摸两张牌。",
  simazhou: "司马伷",
  caiwang: "才望",
  caiwang_info: "当你使用或打出牌响应其他角色使用的牌，或其他角色使用或打出牌响应你使用的牌后，若这两张牌颜色相同，则你可以弃置对方的一张牌。",
  naxiang: "纳降",
  naxiang2: "纳降",
  naxiang_info: "锁定技，当你受到其他角色造成的伤害后，或你对其他角色造成伤害后，你对其发动〖才望①〗时的“弃置”改为“获得”直到你的下回合开始。",
  cheliji: "彻里吉",
  chexuan: "车悬",
  chexuan_info: "出牌阶段，若你的装备区里没有宝物牌，你可弃置一张黑色牌，选择一张【舆】置入你的装备区；当你失去装备区里的宝物牌后，你可进行判定，若结果为黑色，将一张随机的【舆】置入你的装备区。",
  qiangshou: "羌首",
  qiangshou_info: "锁定技，若你的装备区内有宝物牌，你与其他角色的距离-1。",
  cheliji_sichengliangyu: "四乘粮舆",
  cheliji_sichengliangyu_bg: "粮",
  cheliji_sichengliangyu_info: "一名角色的回合结束时，若你的手牌数小于体力值，你可以摸两张牌，然后弃置此牌。",
  cheliji_tiejixuanyu: "铁蒺玄舆",
  cheliji_tiejixuanyu_bg: "蒺",
  cheliji_tiejixuanyu_info: "其他角色的回合结束时，若其本回合未造成过伤害，你可以令其弃置两张牌，然后弃置此牌。",
  cheliji_feilunzhanyu: "飞轮战舆",
  cheliji_feilunzhanyu_bg: "轮",
  cheliji_feilunzhanyu_info: "其他角色的回合结束时，若其本回合使用过非基本牌，你可以令其交给你一张牌，然后弃置此牌。",
  weiguan: "卫瓘",
  zhongyun: "忠允",
  zhongyun2: "忠允",
  zhongyun_info: "锁定技。每名角色的回合限一次，你受伤/回复体力后，若你的体力值与手牌数相等，你回复1点体力或对你攻击范围内的一名角色造成1点伤害；每名角色的回合限一次，你获得手牌或失去手牌后，若你的体力值与手牌数相等，你摸一张牌或弃置一名其他角色一张牌。",
  shenpin: "神品",
  shenpin_info: "当一名角色的判定牌生效前，你可以打出一张与判定牌颜色不同的牌代替之。",
  zhongyan: "钟琰",
  bolan: "博览",
  bolan_info: "①出牌阶段开始时，你可从三个描述中带有“出牌阶段限一次”的技能中选择一个，令当前回合角色获得直至此阶段结束。②其他角色出牌阶段限一次，其可以失去1点体力，令你发动一次〖博览①〗。",
  yifa: "仪法",
  yifa2: "仪法",
  yifa_info: "锁定技，其他角色使用【杀】或黑色普通锦囊牌指定你为目标后，其手牌上限-1直到其回合结束。",
  ol_huaxin: "OL华歆",
  ol_huaxin_prefix: "OL",
  caozhao: "草诏",
  caozhao_backup: "草诏",
  caozhao_info: "出牌阶段限一次，你可展示一张手牌并声明一种未以此法声明过的基本牌或普通锦囊牌，令一名体力不大于你的其他角色选择一项：令此牌视为你声明的牌，或其失去1点体力。然后若此牌声明成功，然后你可将其交给一名其他角色。",
  olxibing: "息兵",
  olxibing_info: "当你受到其他角色造成的伤害后，你可弃置你或该角色两张牌，然后你们中手牌少的角色摸两张牌，以此法摸牌的角色不能使用牌指定你为目标直到回合结束。",
  recaiwang: "才望",
  recaiwang_info: "①当你使用或打出牌响应其他角色使用的牌，或其他角色使用或打出牌响应你使用的牌后，若这两张牌颜色相同，则你可以弃置对方的一张牌。②若你的手牌数为1，则你可以将该手牌当做【闪】使用或打出。③若你的装备区牌数为1，则你可以将该装备当做【无懈可击】使用或打出。④若你的判定区牌数为1，则你可以将该延时锦囊牌当做【杀】使用或打出。",
  recaiwang_hand: "才望",
  recaiwang_equip: "才望",
  recaiwang_judge: "才望",
  yangyan: "杨艳",
  xuanbei: "选备",
  xuanbei_info: "①游戏开始时，你从牌堆中获得两张具有应变标签的牌。②每回合限一次。当你使用的具有应变标签的牌结算结束后，你可将此牌对应的所有实体牌交给一名其他角色。",
  xianwan: "娴婉",
  xianwan_info: "①当你需要使用【闪】时，若你的武将牌未横置，则你可以横置武将牌并视为使用【闪】。②当你需要使用【杀】时，若你的武将牌横置，则你可以重置武将牌并视为使用【杀】。",
  yangzhi: "杨芷",
  wanyi: "婉嫕",
  wanyi_info: "每回合每项限一次。出牌阶段，你可以将一张具有应变效果的牌当做【逐近弃远】/【出其不意】/【水淹七军】/【洞烛先机】使用。",
  maihuo: "埋祸",
  maihuo_info: "①当你成为其他角色使用【杀】的目标后，若此【杀】不为转化牌且有对应的实体牌且其武将牌上没有“祸”且你是此牌的唯一目标，则你可以令此牌对你无效，并将此【杀】置于其武将牌上，称为“祸”。②一名其他角色的出牌阶段开始时，若其武将牌上有“祸”，则其对你使用此“祸”（有距离限制且计入次数限制，若你不是此牌的合法目标，则改为将此“祸”置入弃牌堆）。③当你对有“祸”的其他角色造成伤害后，你移去其“祸”。",
  xinchang: "辛敞",
  canmou: "参谋",
  canmou_info: "一名角色使用普通锦囊牌指定第一个目标时，若其手牌数为全场唯一最多，则你可以为此牌增加一个额外目标。",
  congjian: "从鉴",
  congjian_info: "一名其他角色成为普通锦囊牌的唯一目标时，若其体力值为全场唯一最多，则你也可以成为此牌的目标。此牌结算结束后，若你受到过渠道为此牌的伤害，则你摸两张牌。",
  xuangongzhu: "晋宣公主",
  gz_xuangongzhu: "宣公主",
  xuangongzhu_prefix: "晋",
  gaoling: "高陵",
  gaoling_info: "隐匿技。当你于回合外明置此武将牌时，你可以令一名角色回复1点体力。",
  qimei: "齐眉",
  qimei_info: "准备阶段，你可以选择一名其他角色。你获得如下效果直到下回合开始：①每回合限一次，当你或其获得牌/失去手牌后，若你与其手牌数相等，则另一名角色摸一张牌。②每回合限一次，当你或其的体力值变化后，若你与其体力值相等，则另一名角色摸一张牌。",
  ybzhuiji: "追姬",
  ybzhuiji_info: "出牌阶段开始时，你可选择一项：①摸两张牌，并于出牌阶段结束时失去1点体力；②回复1点体力，并于出牌阶段结束时弃置两张牌。",
  jin_yanghu: "晋羊祜",
  jin_yanghu_prefix: "晋",
  huaiyuan: "怀远",
  huaiyuanx: "绥",
  huaiyuan_info: "①游戏开始时，你将你的手牌标记为“绥”。②当你失去一张“绥”后，你令一名角色执行一项：⒈其的手牌上限+1。⒉其的攻击范围+1。⒊其摸一张牌。③当你死亡时，你可令一名其他角色的手牌上限+X，且攻击范围+Y（X和Y为你自己被执行过〖怀远②〗的选项一和选项二的次数）。",
  chongxin: "崇信",
  chongxin_info: "出牌阶段限一次，你可重铸一张牌，且令一名有手牌的其他角色也重铸一张牌。",
  dezhang: "德彰",
  dezhang_info: "觉醒技。准备阶段，若你没有“绥”，则你减1点体力上限并获得〖卫戍〗。",
  weishu: "卫戍",
  weishu_info: "锁定技。①当你于摸牌阶段外不因〖卫戍①〗而摸牌后，你令一名角色摸一张牌。②当你于弃牌阶段外不因〖卫戍②〗而弃置牌后，你弃置一名其他角色的一张牌。",
  jin_jiachong: "晋贾充",
  jin_jiachong_prefix: "晋",
  xiongshu: "凶竖",
  xiongshu_info: "其他角色的出牌阶段开始时，你可弃置X张牌（X为你本轮内此前已发动过此技能的次数，为0则不弃）并展示其一张手牌，然后你预测“其本阶段内是否会使用与展示牌牌名相同的牌”。此阶段结束时，若你的预测正确，则你对其造成1点伤害；否则你获得展示牌。",
  jianhui: "奸回",
  jianhui_info: "锁定技。你记录上次对你造成伤害的其他角色。当你对其造成伤害后，你摸一张牌；当你受到其造成的伤害后，其弃置一张牌。",
  xinxuanbei: "选备",
  xinxuanbei_info: "出牌阶段限一次。你可选择一名其他角色区域内的一张牌。然后其对你使用对应实体牌为此牌的【杀】。然后若此【杀】，未对你造成过伤害，你摸一张牌；对你造成过伤害，你摸两张牌。",
  xinwanyi: "婉嫕",
  xinwanyi_info: "①当你使用【杀】或普通锦囊牌指定其他角色为唯一目标后，你可将其的一张牌置于你的武将牌上作为“嫕”。②你不能使用/打出/弃置与“嫕”花色相同的牌。③结束阶段或当你受到伤害后，你令一名角色获得你的一张“嫕”。",
  jin_guohuai: "郭槐",
  zhefu: "哲妇",
  zhefu_info: "当你于回合外使用或打出牌后，你可令一名有手牌的其他角色选择一项：⒈弃置一张名称相同的牌。⒉受到你造成的1点伤害。",
  yidu: "遗毒",
  yidu_info: "当你使用的【杀】或伤害性锦囊牌结算结束后，你可以展示一名未受到过渠道为此牌伤害的目标角色的至多三张手牌。若这些牌颜色均相同，则你弃置这些牌。",
  wangxiang: "王祥",
  bingxin: "冰心",
  bingxin_info: "每种牌名每回合限一次。当你需要使用基本牌时，若你的手牌数等于体力值且这些牌的颜色均相同，则你可以摸一张牌，视为使用一张基本牌。",
  ol_lisu: "OL李肃",
  ol_lisu_prefix: "OL",
  qiaoyan: "巧言",
  qiaoyan_info: "锁定技，当你于回合外受到其他角色造成的伤害时，若你：有“珠”，则你令伤害来源获得“珠”；没有“珠”，则你防止此伤害，然后摸一张牌，并将一张牌正面朝上置于武将牌上，称为“珠”。",
  xianzhu: "献珠",
  xianzhu_info: "锁定技，出牌阶段开始时，你令一名角色A获得“珠”。若A不为你自己，则你选择你攻击范围内的一名角色B，视为A对B使用一张【杀】。",
  chengjichengcui: "成济成倅",
  oltousui: "透髓",
  oltousui_info: "你可以将任意张牌置于牌堆底，视为使用一张需使用等量张【闪】抵消的【杀】。",
  olchuming: "畜鸣",
  olchuming_info: "锁定技。当你对其他角色造成伤害时，或当你受到其他角色造成的伤害时，若此伤害的渠道不为牌或没有对应的实体牌，此伤害+1，否则其于本回合结束时将所有以此法造成伤害的牌当【借刀杀人】或【过河拆桥】对你使用。"
};
const characterTitles = {
  jin_zhangchunhua: "宣穆皇后",
  jin_simayi: "通达权变",
  zhanghuyuechen: "不辱门庭",
  duyu: "文成武德",
  gz_duyu: "文成武德",
  gz_jin_simayi: "通达权变",
  gz_jin_zhangchunhua: "宣穆皇后",
  jin_simazhao: "晋文帝",
  gz_jin_simazhao: "晋文帝",
  gz_jin_simashi: "晋景王",
  jin_simashi: "晋景王",
  jin_wangyuanji: "文明皇后",
  gz_jin_wangyuanji: "文明皇后",
  gz_jin_yanghuiyu: "景献皇后",
  jin_yanghuiyu: "景献皇后",
  jin_xiahouhui: "景怀皇后",
  gz_jin_xiahouhui: "景怀皇后",
  shibao: "乐陵郡公",
  ol_lisu: "巧言令色",
  simazhou: "琅琊武王",
  cheliji: "高凉铁骨",
  weiguan: "兰陵郡公",
  zhongyan: "聪慧弘雅",
  ol_huaxin: "渊清玉洁",
  yangyan: "武元皇后",
  yangzhi: "武悼皇后",
  xinchang: "英鉴中铭",
  xuangongzhu: "晋宣公主",
  gz_xuangongzhu: "宣公主",
  jin_yanghu: "执德清劭",
  jin_jiachong: "鲁郡公",
  jin_guohuai: "妒贤嫉能",
  wangxiang: "沂川跃鲤",
  chengjichengcui: "袒忿半瓦"
};
const characterIntro = {
  zhanghuyuechen: "张虎，生卒年不详，雁门马邑（今山西朔城区大夫庄）人。三国时期曹魏将领。名将张辽之子。官至偏将军，袭封晋阳侯，有一子张统。乐綝（195~257年），字号不详，阳平郡卫国县（今河南省清丰县）人。三国时期曹魏将领，右将军乐进的儿子。果毅坚毅，袭封广昌亭侯，累迁扬州刺史。甘露二年，为叛乱的征东大将军诸葛诞所杀，追赠卫尉。",
  duyu: "杜预（222年－285年），字元凯，京兆郡杜陵县（今陕西西安）人，中国魏晋时期军事家、经学家、律学家，曹魏散骑常侍杜恕之子。杜预初仕曹魏，任尚书郎，后成为权臣司马昭的幕僚，封丰乐亭侯。西晋建立后，历任河南尹、安西军司、秦州刺史、度支尚书等职。咸宁四年（278年）接替羊祜出任镇南大将军，镇守荆州。他积极备战，支持晋武帝司马炎对孙吴作战，并在咸宁五年（279年）成为晋灭吴之战的统帅之一。战后因功进封当阳县侯，仍镇荆州。太康五年（285年），杜预被征入朝，拜司隶校尉，途中于邓县逝世，终年六十三岁。获赠征南大将军、开府仪同三司，谥号为成。杜预耽思经籍，博学多通，多有建树，时誉为“杜武库”。著有《春秋左氏传集解》及《春秋释例》等。为明朝之前唯一一个同时进入文庙和武庙之人。",
  xiahouhui: "夏侯徽（211年－234年），字媛容，沛国谯县（今安徽亳州）人，司马师第一任妻子。征南大将军夏侯尚之女，母德阳乡主为大司马曹真之妹。夏侯徽与司马师之间，生有五个女儿。夏侯徽很有见识器度，每当司马师有什么想法时，都由她从旁策划协助。当时司马师之父司马懿位居上将重位，而他的儿子们都有雄才大略。夏侯徽深知司马师绝非曹魏忠臣，而司马师对出身曹魏家族的夏侯徽也非常顾忌。青龙二年（234年），正逢“大疫”、“大病”之年，夏侯徽被司马师毒杀，时年二十四岁，死后葬于峻平陵。西晋建国后，追谥夏侯徽为景怀皇后。",
  shibao: "石苞（？～273年），字仲容，渤海南皮（今河北省南皮县）人。三国时曹魏至西晋重要将领，西晋开国功臣。西晋建立后，历任大司马、侍中、司徒等职，封乐陵郡公，卒后谥号为“武”。",
  simazhou: "司马伷（227年～283年6月12日），字子将，河内郡温县（今河南省温县）人。西晋宗室、将领，晋宣帝司马懿第三子，伏太妃所生。晋景帝司马师、文帝司马昭的同父异母弟，晋武帝司马炎的叔父。司马伷少有才气，在曹魏历任宁朔将军、散骑常侍、征虏将军等职，先后受封南安亭侯、东武乡侯，五等爵制建立后，改封南皮伯。西晋建立后，获封东莞郡王，入朝任尚书右仆射、抚军将军，出外拜镇东大将军。后改封琅邪王，加开府仪同三司。西晋伐吴时，率军出涂中，孙皓向他投降并奉上玉玺。战后因功拜大将军，增邑三千户。太康四年（283年），司马伷去世，享年五十七岁。谥号为武，世称“琅邪武王”。著有《周官宁朔新书》八卷，今已亡佚。",
  huangzu: "黄祖（？－208年），东汉末年将领。刘表任荆州牧时，黄祖出任江夏太守。初平二年（191年），黄祖在与长沙太守孙坚交战时，其部下将孙坚射死，因此与孙家结下仇怨。之后，黄祖多次率部与东吴军队交战，射杀凌操、徐琨等人。建安十三年（208年），在与孙权的交战中，兵败被杀。",
  cheliji: "彻里吉是历史小说《三国演义》中的虚构人物，西羌国王。蜀相诸葛亮伐魏，魏都督曹真驰书赴羌，国王彻里吉即命雅丹丞相与越吉元帅起羌兵一十五万、并战车直扣西平关。后军大败，越吉亡，雅丹被俘，亮将所获羌兵及车马器械，尽给还雅丹，俱放回国。彻里吉感蜀恩义，与之结盟。正史中没有关于彻里吉的记载。",
  weiguan: "卫瓘（220年－291年），字伯玉。河东郡安邑县（今山西省夏县）人。三国曹魏后期至西晋初年重臣、书法家，曹魏尚书卫觊之子。卫瓘出身官宦世家，年轻时仕官于曹魏，历任尚书郎、散骑常侍、侍中、廷尉等职。后以镇西军司、监军身份参与伐蜀战争。蜀汉亡后，与钟会一道逮捕邓艾；钟会谋反时，又成功平息叛乱，命田续杀邓艾父子。回师后转任督徐州诸军事、镇东将军，封菑阳侯。西晋建立后，历任青州、幽州刺史、征东大将军等职，成功化解北方边境威胁，因功进爵菑阳公。后入朝为尚书令、侍中，又升任司空，领太子少傅。后逊位，拜太保。晋惠帝即位后，与贾皇后对立，终在政变中满门遇害，享年七十二岁。卫瓘善隶书及章草。不仅兼工各体，还能学古人之长，是颇有创意的书法家。唐朝张怀瓘《书断》中评其章草为“神品”。",
  zhongyan: " 钟琰 (？—？年）颍川人，王浑之妻。生卒年不详，约魏末晋初间前后在世。王浑的妻子钟琰，是颍川人，为魏太傅钟繇的曾孙女，父亲钟徽，为黄门郎。她平时广泛阅读各种书籍，因此几岁的时候就能撰写文章。她聪慧弘雅，善于啸咏，她的礼仪法度，为中表所推崇，她写有文集五卷。",
  yangyan: "杨艳（238年－274年8月25日），字琼芝，弘农郡华阴县（今陕西省华阴市）人，晋武帝司马炎第一任皇后，曹魏通事郎杨炳之女。自幼父母双亡，为舅舅赵俊所养，跟随继母段氏生活。聪明贤慧，善于书法，天生丽质，娴熟女红，嫁给了世子司马炎。泰始元年（265年），晋武帝即位，建立西晋。泰始二年（266年），杨艳受册为皇后，深得晋武帝宠幸，生下三子三女，包括晋惠帝司马衷。泰始十年（274年），去世，时年三十七，陪葬于峻阳陵，谥号武元皇后。",
  yangzhi: "杨芷（259年－292年3月6日），字季兰，小字男胤，弘农郡华阴县（今陕西省华阴市）人，晋武帝司马炎第二任皇后，东汉太尉杨震幼子杨奉后裔，东汉末年东莱太守、蓩亭侯杨众曾孙女，西晋太傅杨骏与嫡妻庞氏之女，武元皇后杨艳堂妹。咸宁二年（276年），立为皇后，史称“婉嫕有妇德， 美映椒房”，得宠于晋武帝。生渤海殇王，早薨，之后再无生育。其父杨骏擅权引起皇后贾南风忌恨，贾南风联络汝南王司马亮、楚王司马玮发动政变，杀死杨骏，并唆使大臣上书状告杨芷谋反，让晋惠帝司马衷将其贬为庶人，押到金墉城居住。元康二年（292年），杨芷冻饿而死，谥号武悼皇后。",
  xinchang: "辛敞（生卒年不详），字泰雍，陇西人氏，是曹魏时代官员。卫尉辛毗之子，辛宪英之弟。",
  xuangongzhu: "高陵宣公主（？—？）司马氏，晋宣帝司马懿第二女。司马氏下嫁杜预。其侄司马炎登基时，司马氏已经去世。泰始年间（265年—274年）追赠高陵公主。",
  jin_guohuai: "郭槐（237年-296年），字媛韶，太原阳曲（今山西太原）人，魏晋权臣贾充的妻子。父亲是曹魏城阳郡太守郭配，伯父是曹魏名将郭淮。出身太原郭氏。二十一岁时，嫁贾充作继室，生二女二子，长女贾南风，次女贾午，一子贾黎民。贾南风是西晋惠帝司马衷皇后，干预国政，专权误国，直接导致“八王之乱”和西晋亡国。",
  wangxiang: "王祥（184年，一作180年－268年4月30日），字休徵。琅邪临沂（今山东省临沂市西孝友村）人。三国曹魏及西晋时大臣。王祥于东汉末隐居二十年，在曹魏，先后任县令、大司农、司空、太尉等职，封爵睢陵侯。西晋建立，拜太保，进封睢陵公。泰始四年四月戊戌日（268年4月30日）去世，年八十五（一作八十九），谥号“元”。有《训子孙遗令》一文传世。王祥侍奉后母朱氏极孝，为传统文化中二十四孝之一“卧冰求鲤”的主人翁。",
  chengjichengcui: "成倅、成济（？～260年6月21日），扬州丹阳（今安徽省宣城市）人。三国时期曹魏将领。依附于司马氏家族，得到司马昭的心腹贾充指使，刺死魏帝曹髦。司马昭为平息众怒，将成倅、成济兄弟二人杀死。据《魏氏春秋》记载，成济兄弟不服罪，光着身子跑到屋顶，大骂司马昭，被军士从下乱箭射杀。"
};
const characterFilters = {};
const dynamicTranslates = {};
const perfectPairs = {};
const voices = {
  "#oltousui1": "区区黄口孺帝，能有何作为？",
  "#oltousui2": "昔年沙场茹血，今欲饮帝血！",
  "#olchuming1": "明公为何如此待我兄弟？",
  "#olchuming2": "栖佳木之良禽，其鸣亦哀乎？",
  "#chengjichengcui:die": "今为贼子贾充所害！",
  "#bingxin1": "思鸟黄雀至，卧冰鱼自跃。",
  "#bingxin2": "夜静向寒月，卧冰求鲤鱼。",
  "#wangxiang:die": "夫生之有死，自然之理也……",
  "#xiongshu1": "怀志拥权，谁敢不服？",
  "#xiongshu2": "天下凶凶，由我一人。",
  "#jianhui1": "一箭之仇，十年不忘！",
  "#jianhui2": "此仇不报，怨恨难消！",
  "#jin_jiachong:die": "任元褒，吾与汝势不两立！",
  "#gaoling1": "天家贵胄，福泽四海。",
  "#gaoling2": "宣王之女，恩惠八方。",
  "#qimei1": "辅车相依，比翼双飞。",
  "#qimei2": "情投意合，相濡以沫。",
  "#ybzhuiji1": "不过是些微代价罢了。",
  "#ybzhuiji2": "哼，以为这就能难倒我吗？",
  "#xuangongzhu:die": "元凯，我去也……",
  "#canmou1": "兢兢业业，竭心筹划。",
  "#canmou2": "欲设此法，计谋二人。",
  "#congjian1": "为人臣属，安可不随？",
  "#congjian2": "主公有难，吾当从之。",
  "#xinchang:die": "宪英，救我！",
  "#wanyi1": "天性婉嫕，易以道御。",
  "#wanyi2": "婉嫕利珍，为后攸行。",
  "#maihuo1": "祸根未决，转而滋蔓。",
  "#maihuo2": "无德之亲，终为祸根。",
  "#yangzhi:die": "贾氏……构陷……",
  "#xuanbei1": "博选良家，以充后宫。",
  "#xuanbei2": "非良家，不可选也。",
  "#xianwan1": "婉而从物，不竞不争。",
  "#xianwan2": "娴婉恭谨，重贤加礼。",
  "#yangyan:die": "一旦殂损，痛悼伤怀……",
  "#caozhao1": "草诏所宣，密勿从事。",
  "#caozhao2": "惩恶扬功，四方之纲。",
  "#olxibing1": "讲信修睦，息兵不功。",
  "#olxibing2": "天时未至，周武还师。",
  "#ol_huaxin:die": "死国，甚无谓也！",
  "#bolan1": "博览群书，融会贯通。",
  "#bolan2": "博览于文，约之以礼。",
  "#yifa1": "仪法不明，则实不称名。",
  "#yifa2": "仪法明晰，则长治久安。",
  "#zhongyan:die": "嗟尔姜任，邈不我留……",
  "#zhongyun1": "秉公行事，无所亲疏。",
  "#zhongyun2": "明晰法理，通晓人情。",
  "#shenpin1": "考其遗法，肃若神明。",
  "#shenpin2": "气韵生动，出于天成。",
  "#weiguan:die": "辞荣善终，不可求……",
  "#chexuan1": "兵车疾动，以悬敌首！",
  "#chexuan2": "层层布设，以多胜强！",
  "#cheliji:die": "元气已伤，不如归去……",
  "#caiwang1": "才气不俗，声望四海。",
  "#caiwang2": "绥怀之策，监守邺城。",
  "#naxiang1": "奉命伐吴，得胜纳降。",
  "#naxiang2": "进军逼江，震慑吴贼。",
  "#simazhou:die": "恩赐重物，病身难消受……",
  "#qiaoyan1": "此事不宜迟，在于速决。",
  "#qiaoyan2": "公若到彼，贵不可言。",
  "#xianzhu1": "馈珠之恩，望将军莫忘。",
  "#xianzhu2": "愿以珠为礼，与卿交好，而休刀兵。",
  "#ol_lisu:die": "忘恩负义之徒！",
  "#huirong1": "红尘洗练，慧容不改。",
  "#huirong2": "花貌易改，福惠长存。",
  "#ciwei1": "乃家乃邦，是则是效。",
  "#ciwei2": "其慈有威，不舒不暴。",
  "#caiyuan1": "柳絮轻舞，撷芳赋诗。",
  "#caiyuan2": "秀媛才德，知书达理。",
  "#jin_yanghuiyu:die": "韶华易老，佳容不再……",
  "#zhuosheng1": "才经世务，干用之绩。",
  "#zhuosheng2": "器量之远，当至公辅。",
  "#shibao:die": "寒门出身，难以擢升……",
  "#huishi1": "你的想法，我已知晓。",
  "#huishi2": "妾身慧眼，已看透太多。",
  "#qingleng1": "冷冷清清，寂落沉沉。",
  "#qingleng2": "冷月葬情，深雪埋伤。",
  "#xuanmu1": "四门穆穆，八面莹澈。",
  "#xuanmu2": "天色澄穆，心明清静。",
  "#jin_zhangchunhua:die": "冷眸残情，孤苦为一人……",
  "#buchen1": "螟蛉之光，安敢同日月争辉？",
  "#buchen2": "巍巍隐帝，岂可为臣？",
  "#smyyingshi1": "鹰扬千里，明察秋毫。",
  "#smyyingshi2": "鸢飞戾天，目入百川。",
  "#xiongzhi1": "烈士雄心，志存高远。",
  "#xiongzhi2": "乱世之中，唯我司马！",
  "#quanbian1": "筹权谋变，步步为营。",
  "#quanbian2": "随机应变，谋国窃权。",
  "#jin_simayi:die": "虎入骷冢，司马难兴……",
  "#shiren1": "宠过必乱，不可大任。",
  "#shiren2": "开卷有益，识人有法。",
  "#yanxi1": "宴会嬉趣，其乐融融。",
  "#yanxi2": "宴中趣玩，得遇知己。",
  "#jin_wangyuanji:die": "祖父已逝，哀凄悲戚……",
  "#tuishi1": "此僚怀异，召汝讨贼。",
  "#tuishi2": "推令既出，焉敢不从？",
  "#choufa1": "秣马厉兵，筹伐不臣！",
  "#choufa2": "枕戈待旦，秣马征平。",
  "#zhaoran1": "行昭然于世，赦众贼以威。",
  "#zhaoran2": "吾之心思，路人皆知。",
  "#chengwu1": "令行禁止，政通无虞。",
  "#chengwu2": "上下一体，大业可筹。",
  "#jin_simazhao:die": "司马三代，一梦成空……",
  "#baoqie1": "宝箧藏玺，时局变动。",
  "#baoqie2": "曹亡宝箧，尽露锋芒。",
  "#jyishi1": "家庭和顺，夫妻和睦。",
  "#jyishi2": "之子于归，宜其室家。",
  "#shiduo1": "鉴识得体，气度雅涵。",
  "#shiduo2": "宽容体谅，宽人益己。",
  "#jin_xiahouhui:die": "夫君，你怎么对我如此狠心……",
  "#taoyin1": "司马氏善谋、善忍，善置汝于绝境！",
  "#taoyin2": "隐忍数载，亦不坠青云之志！",
  "#yimie1": "汝大逆不道，当死无赦！",
  "#yimie2": "斩草除根，灭其退路！",
  "#ruilve1": "司马当兴，其兴在吾。",
  "#ruilve2": "吾承父志，故知军事、通谋略。",
  "#tairan1": "撼山易，撼我司马氏难。",
  "#tairan2": "云卷云舒，处之泰然。",
  "#jin_simashi:die": "子上，这是为兄给你打下的江山……",
  "#xijue1": "承爵于父，安能辱之！",
  "#xijue2": "虎父安有犬子乎？",
  "#zhanghuyuechen:die": "儿有辱……父亲威名……",
  "#sanchen1": "陈书弼国，当一而再、再而三。",
  "#sanchen2": "勘除弼事，三陈而就。",
  "#zhaotao1": "奉诏伐吴，定鼎东南！",
  "#zhaotao2": "三陈方得诏，一股下孙吴！",
  "#duyu:die": "金瓯尚缺，死难瞑目……",
  "#xijue_tuxi1": "动如霹雳，威震宵小！",
  "#xijue_tuxi2": "行略如风，摧枯拉朽！",
  "#xijue_xiaoguo1": "大丈夫生于世，当沙场效忠！",
  "#xijue_xiaoguo2": "骁勇善战，刚毅果断！",
  "#pozhu1": "攻其不备，摧枯拉朽！",
  "#pozhu2": "势如破竹，铁锁横江亦难挡！"
};
const characterSort = {
  yingbian_pack1: ["jin_simayi", "jin_zhangchunhua", "ol_lisu", "simazhou", "cheliji", "ol_huaxin"],
  yingbian_pack2: ["jin_simashi", "jin_xiahouhui", "zhanghuyuechen", "shibao", "jin_yanghuiyu", "chengjichengcui"],
  yingbian_pack3: ["jin_simazhao", "jin_wangyuanji", "duyu", "weiguan", "xuangongzhu"],
  yingbian_pack4: ["zhongyan", "xinchang", "jin_jiachong", "wangxiang"],
  yingbian_pack5: ["yangyan", "yangzhi"]
};
const characterSortTranslate = {
  yingbian_pack1: "文德武备·理",
  yingbian_pack2: "文德武备·备",
  yingbian_pack3: "文德武备·果",
  yingbian_pack4: "文德武备·戒",
  yingbian_pack5: "文德武备·约"
};
game.import("character", function() {
  return {
    name: "yingbian",
    connect: true,
    character: { ...characters },
    characterSort: {
      yingbian: characterSort
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
