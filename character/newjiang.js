import { ui, game, get, lib, _status } from "noname";
const characters = {
  yj_wanglang: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["fuyu", "zhanshi"]
  },
  yj_x_xunxu: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["diyin", "boqia"]
  },
  yj_fazheng: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["youtan", "ciren", "zhancai"]
  },
  yj_hanbing: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["bingling"],
    names: "null|null"
  },
  yj_tengjia: {
    sex: "male",
    group: "qun",
    hp: 1,
    maxHp: 4,
    skills: ["tenggu", "dunyong"],
    names: "null|null"
  },
  yj_puyuan: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["biancai", "cuiren", "shenfeng"]
  },
  v_sunce: {
    sex: "male",
    group: "wu",
    hp: 5,
    skills: ["dczhifeng", "dcweijing"]
  },
  yao_yuanshu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcwangyao", "dczengua", "dckanghui"]
  },
  yj_zhanghuan: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcyiju", "dcshuguo"]
  },
  yj_zhangyan: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcqiaolve", "dchanjie"]
  },
  wufu: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dczhonge", "dcjuekai"]
  },
  yj_sb_guojia: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["xianmou", "lunshi"]
  },
  xunyuxunyou: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["zhinang", "gouzhu"],
    names: "荀|彧-荀|攸",
    clans: ["颍川荀氏"]
  },
  xiahoumao: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["tongwei", "cuguo"],
    names: "夏侯|楙"
  },
  chenshi: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["qingbei"]
  },
  sunli: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["kangli"]
  },
  feiyao: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["zhenfeng"]
  },
  wuanguo: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["diezhang", "duanwan"]
  },
  hanlong: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["duwang", "cibei"]
  },
  yj_qiaozhou: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["shiming", "jiangxi"]
  },
  yj_sufei: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["shuojian"]
  },
  liwan: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["liandui", "biejun"]
  },
  zhugeshang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["sangu", "yizu"],
    names: "诸葛|尚",
    clans: ["琅琊诸葛氏"]
  },
  kebineng: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["kousheng"],
    names: "科比|罐头"
  },
  lukai: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["lkbushi", "lkzhongzhuang"],
    clans: ["吴郡陆氏"]
  },
  linghuyu: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["xvzhi"],
    names: "令狐|愚"
  },
  yj_simafu: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["beiyu", "duchi"],
    names: "司马|孚",
    groupBorder: "jin"
  },
  yj_xuangongzhu: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["yjqimei", "yjzhuiji"],
    names: "司马|null"
  },
  xukun: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["fazhu"]
  },
  yj_zhangliao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["weifeng"]
  },
  yj_zhanghe: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xinzhilve"]
  },
  yj_xuhuang: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xinxhzhiyan"]
  },
  yj_ganning: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["gnjinfan", "gnsheque"]
  },
  yj_huangzhong: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["spshidi", "spyishi", "spqishe"]
  },
  yj_weiyan: {
    sex: "male",
    group: "qun",
    hp: 4,
    maxHp: 4,
    hujia: 1,
    skills: ["mbguli", "mbaosi"]
  },
  yj_zhoubuyi: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["mbhuiyao", "mbquesong"]
  },
  mp_wangrong: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["mpjianlin", "mpsixiao"]
  },
  mp_liuling: {
    sex: "male",
    group: "jin",
    hp: 3,
    skills: ["mpjiusong", "mpmaotao", "mpbishi"],
    doubleGroup: ["wei", "qun", "jin"]
  },
  mp_xiangxiu: {
    sex: "male",
    group: "jin",
    hp: 3,
    skills: ["mpmiaoxi", "mpsijiu"],
    doubleGroup: ["wei", "jin"]
  },
  yj_majun: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["gongqiao", "jingyi"],
    names: "马|钧"
  },
  new_yj_dongzhuo: {
    sex: "male",
    group: "qun",
    hp: 3,
    maxHp: 5,
    skills: ["xiongjin", "zhenbian", "baoxi"]
  },
  fj_peixiu: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["fjzhitu", "dcfujue"],
    names: "裴|秀"
  }
};
const cards = {
  gongqiao_equip: {
    type: "equip",
    derivation: "yj_majun",
    fullskin: true,
    image: "image/card/majun_gongqiao.png",
    cardPrompt(card) {
      let str = `原本是一张装备牌。`, subtypes = get.subtypes(card);
      if (subtypes?.length) {
        str = `${str.slice(0, -1)}，被置入了${subtypes.map((i) => `${get.translation(i)}栏`).join("、")}。`;
      }
      return str;
    },
    ai: { basic: { equipValue: 0.1 } },
    async onLose(event, trigger, player) {
      event.cards.forEach((card) => {
        card.fix();
        ui.discardPile.appendChild(card);
        game.log(card, "被置入了弃牌堆");
      });
      if (event.getParent(2).name == "gain") {
        const remove = event.getParent(2).cards.filter((card) => card[card.cardSymbol] == event.card);
        event.getParent(2).cards.removeArray(remove);
      }
    }
  },
  gongqiao_trick: {
    type: "trick",
    derivation: "yj_majun",
    fullskin: true,
    image: "image/card/majun_gongqiao.png",
    cardPrompt(card) {
      let str = `原本是一张锦囊牌。`, subtypes = get.subtypes(card);
      if (subtypes?.length) {
        str = `${str.slice(0, -1)}，被置入了${subtypes.map((i) => `${get.translation(i)}栏`).join("、")}。`;
      }
      return str;
    },
    ai: { basic: { equipValue: 4 } },
    async onLose(event, trigger, player) {
      event.cards.forEach((card) => {
        card.fix();
        ui.discardPile.appendChild(card);
        game.log(card, "被置入了弃牌堆");
      });
      if (event.getParent(2).name == "gain") {
        const remove = event.getParent(2).cards.filter((card) => card[card.cardSymbol] == event.card);
        event.getParent(2).cards.removeArray(remove);
      }
    }
  },
  gongqiao_basic: {
    type: "basic",
    derivation: "yj_majun",
    fullskin: true,
    image: "image/card/majun_gongqiao.png",
    cardPrompt(card) {
      let str = `原本是一张基本牌。`, subtypes = get.subtypes(card);
      if (subtypes?.length) {
        str = `${str.slice(0, -1)}，被置入了${subtypes.map((i) => `${get.translation(i)}栏`).join("、")}。`;
      }
      return str;
    },
    ai: { basic: { equipValue: 3 } },
    async onLose(event, trigger, player) {
      event.cards.forEach((card) => {
        card.fix();
        ui.discardPile.appendChild(card);
        game.log(card, "被置入了弃牌堆");
      });
      if (event.getParent(2).name == "gain") {
        const remove = event.getParent(2).cards.filter((card) => card[card.cardSymbol] == event.card);
        event.getParent(2).cards.removeArray(remove);
      }
    }
  },
  lukai_spade: {
    fullskin: true,
    noname: true
  },
  lukai_heart: {
    fullskin: true,
    noname: true
  },
  lukai_diamond: {
    fullskin: true,
    noname: true
  },
  lukai_club: {
    fullskin: true,
    noname: true
  }
};
const pinyins = {};
const skills = {
  //☆王朗
  fuyu: {
    audio: 4,
    logAudio: (index) => typeof index === "number" ? "fuyu" + index + ".mp3" : 2,
    trigger: {
      player: "useCardToPlayer",
      target: "useCardToTarget"
    },
    usable: 2,
    filter(event, player, name) {
      if (event.targets?.length !== 1 || !event.isFirstTarget) {
        return false;
      }
      if (!["basic", "trick"].includes(get.type(event.card))) {
        return false;
      }
      const target = name === "useCardToTarget" ? event.player : event.targets[0];
      if (!player.canCompare(target) || target == player) {
        return false;
      }
      const storage = player.getStorage("fuyu_used", {});
      return !storage[name];
    },
    logTarget(event, player, name) {
      return name === "useCardToTarget" ? event?.player : event?.targets[0];
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      const result = await player.chooseToCompare(target).forResult();
      const cardUserWon = !result.tie && result.winner === trigger.player;
      if (cardUserWon) {
        game.log(trigger.card, "额外结算一次");
        trigger.getParent().effectCount++;
      } else {
        game.log(trigger.card, "被无效了");
        trigger.getParent().all_excluded = true;
      }
      const playerResult = result.bool;
      const lastResult = player.storage[event.name + "_last"];
      if (playerResult === lastResult) {
        player.logSkill(event.name, null, null, null, [get.rand(3, 4)]);
        await player.draw(2);
      }
      player.setStorage(event.name + "_last", playerResult);
      const storage = player.getStorage(event.name + "_used", {});
      storage[event.triggername] = true;
      player.setStorage(event.name + "_used", storage);
      player.addTempSkill(event.name + "_used");
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  zhanshi: {
    audio: 4,
    logAudio: (index) => typeof index === "number" ? "zhanshi" + index + ".mp3" : 2,
    trigger: { global: "compareCardShowBefore" },
    filter(event, player) {
      return player.hasDiscardableCards(player, "he");
    },
    async cost(event, trigger, player) {
      const participants = [trigger.player, ...trigger.targets?.length ? trigger.targets : [trigger.target]];
      event.result = await player.chooseCardTarget({
        prompt: get.prompt2(event.skill),
        filterTarget(card, player2, target) {
          return get.event().targets.includes(target);
        },
        selectTarget() {
          return ui.selected.cards.length;
        },
        filterCard: lib.filter.cardDiscardable,
        position: "he",
        selectCard: [1, participants.length]
      }).set("targets", participants).forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2, targets } = event;
      await player.discard({ cards: cards2 });
      player.addTempSkill(event.name + "_draw");
      player.markAuto(event.name + "_draw", [[trigger, targets]]);
    },
    subSkill: {
      draw: {
        charlotte: true,
        forced: true,
        popup: false,
        onremove: true,
        trigger: { global: ["chooseToCompareAfter", "compareMultipleAfter"] },
        filter(event, player) {
          if (event.preserve || event.compareMultiple) {
            return false;
          }
          const bool = event.name == "compareMultiple";
          return player.getStorage("zhanshi_draw").find((arr) => !bool ? event == arr[0] : event.getParent() == arr[0]);
        },
        async content(event, trigger, player) {
          const bool = trigger.name == "compareMultiple";
          const list = player.getStorage("zhanshi_draw").find((arr) => !bool ? trigger == arr[0] : trigger.getParent() == arr[0]);
          const targets = list[1];
          const winner = trigger.winner || trigger.result?.winner;
          const winCount = targets.filter((t) => t === winner).length;
          if (winCount > 0) {
            player.logSkill("zhanshi", null, null, null, [get.rand(3, 4)]);
            await player.draw(winCount * 3);
          }
        }
      }
    }
  },
  //威孙策
  dczhifeng: {
    audio: 2,
    locked: false,
    mod: {
      cardUsable(card, player, num) {
        if (card.storage?.dczhifeng && card.name == "jiu") {
          return Infinity;
        }
      },
      targetInRange(card, player) {
        if (card.storage?.dczhifeng && card.name == "sha") {
          return true;
        }
      }
    },
    hiddenCard(player, name) {
      if ((player.getStat().skill.dczhifeng || 0) >= game.players.length + game.dead.length) {
        return false;
      }
      const [cards2, bool] = get.info("dczhifeng").getFilter(player);
      if (_status.event.name == "chooseToRespond" && !["sha"].includes(name)) {
        return false;
      }
      return cards2.some((namex) => namex == name) && bool;
    },
    onChooseToUse(event) {
      if (game.online) {
        return;
      }
      event.set("dczhifeng", get.info("dczhifeng").getFilter(event.player));
    },
    onChooseToRespond(event) {
      if (game.online) {
        return;
      }
      event.set("dczhifeng", get.info("dczhifeng").getFilter(event.player));
    },
    enable: ["chooseToUse", "chooseToRespond"],
    usable() {
      return game.players.length + game.dead.length;
    },
    filter(event, player) {
      if (!event.dczhifeng?.length) {
        return false;
      }
      const [cards2, bool] = event.dczhifeng;
      if (!bool || event.name == "chooseToRespond" && cards2.some((name) => !["sha"].includes(name))) {
        return false;
      }
      return get.inpileVCardList(([_, __, name, nature]) => {
        if (!cards2.some((namex) => namex == name)) {
          return false;
        }
        const card = get.autoViewAs({ name, nature, storage: { dczhifeng: true } }, "unsure");
        return event.filterCard(card, player, event);
      }).length > 0;
    },
    chooseButton: {
      dialog(event, player) {
        const [cards2] = event.dczhifeng;
        const vcards = get.inpileVCardList(([_, __, name, nature]) => {
          if (!cards2.some((namex) => namex == name)) {
            return false;
          }
          const card = get.autoViewAs({ name, nature, storage: { dczhifeng: true } }, "unsure");
          return event.filterCard(card, player, event);
        });
        const dialog = ui.create.dialog("猘锋", [vcards, "vcard"]);
        dialog.direct = true;
        return dialog;
      },
      check({ link: [_, __, name] }) {
        return get.order({ name }, get.player());
      },
      backup(links) {
        const backup = get.info("dczhifeng_backup");
        backup.audio = "dczhifeng";
        backup.viewAs = { name: links[0][2], nature: links[0][3], storage: { dczhifeng: true } };
        return backup;
      },
      prompt(links) {
        let str;
        if (["sha"].includes(links[0][2])) {
          str = "一张红色";
        } else if (links[0][2] == "jiu") {
          str = "至少一张黑色";
        } else {
          str = "任意张";
        }
        return `###猘锋###将${str}牌当做${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}使用`;
      }
    },
    getFilter(player, toOther) {
      const hp = player.getHp(), num = player.countCards("h") - (toOther ? 1 : 0);
      if (num > hp) {
        return [["jiu"], player.countCards("hes", { color: "black" }) >= 1];
      } else if (num == hp) {
        return [["juedou"], player.countCards("hes")];
      }
      return [["sha"], player.countCards("hes", { color: "red" })];
    },
    ai: {
      //respondShan: true,
      respondSha: true,
      skillTagFilter(player) {
        if ((player.getStat().skill.dczhifeng || 0) >= game.players.length + game.dead.length) {
          return false;
        }
        return player.getHp() > player.countCards("h") && player.hasCard((card) => {
          if (get.position(card) === "h" && _status.connectMode) {
            return true;
          }
          return get.color(card) === "red";
        }, "hes");
      },
      order(item, player) {
        player = player || get.player();
        const cards2 = get.info("dczhifeng").getFilter(player)[0].map((name) => get.order({ name }, player));
        return Math.max(...cards2) + 0.5;
      },
      result: {
        player: 1
      }
    },
    subSkill: {
      backup: {
        position: "hes",
        selectCard() {
          const choice = get.info("dczhifeng_backup").viewAs.name;
          if (["sha"].includes(choice)) {
            return [1, 1];
          } else if (choice == "jiu") {
            return [1, Infinity];
          }
          return [1, Infinity];
        },
        filterCard(card, player) {
          const choice = get.info("dczhifeng_backup").viewAs.name;
          if (["sha"].includes(choice)) {
            return get.color(card, player) == "red";
          } else if (choice == "jiu") {
            return get.color(card, player) == "black";
          }
          return true;
        },
        selectTarget() {
          const card = get.card();
          if (card.name == "juedou") {
            return [1, 2];
          }
          const info = get.info(card);
          return get.select(get.copy(info.selectTarget));
        },
        popname: true,
        allowChooseAll: true,
        log: false,
        async precontent(event, trigger, player) {
          player.logSkill("dczhifeng");
          const name = event.result.card.name;
          if (["sha"].includes(name)) {
            player.addTempSkill("dczhifeng_draw");
          } else if (name == "jiu") {
            event.getParent().addCount = false;
          }
        },
        ai1(card) {
          const player = get.player(), name = get.info("dczhifeng_backup").viewAs.name, num = ui.selected.cards.length;
          if (num) {
            if (name == "jiu" && num > 1) {
              return 0;
            } else if (name == "juedou") {
              return 0;
            }
          }
          return 7 - get.value(card, player);
        }
      },
      draw: {
        charlotte: true,
        trigger: { player: ["useCard", "respond"] },
        filter(event) {
          return ["sha"].includes(event.card.name) && event.skill == "dczhifeng_backup";
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          await player.drawTo(player.maxHp);
          player.removeSkill(event.name);
        }
      }
    }
  },
  dcweijing: {
    audio: 2,
    trigger: { global: "phaseBegin" },
    derivation: "dczhifeng",
    filter(event, player) {
      return event.player != player && event.player.group === "wu" && event.player.isIn();
    },
    async cost(event, trigger, player) {
      const choiceList = [`对${get.translation(trigger.player)}造成1点伤害`, `令${get.translation(trigger.player)}交给你一张牌然后其可发动一次〖猘锋〗`], choice = ["选项一", "选项二"];
      if (!trigger.player.countGainableCards(player, "he")) {
        choiceList[1] = `<span style="opacity:0.5">${choiceList[1]}</span>`;
        choice.remove("选项二");
      }
      const { control } = await player.chooseControl(choice, "cancel2").set("choiceList", choiceList).set("ai", (event2, player2) => {
        const target = event2.getTrigger().player;
        if (get.damageEffect(target, player2, player2) > 0) {
          return 0;
        } else if (get.event().controls.includes("选项二")) {
          const cards2 = get.info("dczhifeng").getFilter(player2, target != player2)[0].flatMap((name) => {
            const card = get.autoViewAs({ name, storage: { dczhifeng: name == "jiu" } }, "unsure");
            return target.hasUseTarget(card) ? [card] : [];
          });
          if (cards2.some((card) => target.getUseValue(card) * get.sgnAttitude(player2, target) > 0)) {
            return 1;
          } else if (get.attitude(player2, target) < 0 && !cards2.length) {
            return 1;
          }
        }
        return "cancel2";
      }).forResult();
      event.result = {
        bool: control != "cancel2",
        targets: [trigger.player],
        cost_data: control
      };
    },
    async content(event, trigger, player) {
      const {
        targets: [target],
        cost_data: control
      } = event;
      if (control == "选项一") {
        await target.damage();
      } else {
        if (player !== target) {
          await target.chooseToGive(`威靖：交给${get.translation(player)}一张牌然后可发动一次【猘锋】`, player, "he", true);
        }
        const info = get.info("dczhifeng");
        const [cards2, bool] = info.getFilter(target);
        const vcards = get.inpileVCardList(([_, __, name, nature]) => {
          if (nature || !cards2.some((namex) => namex == name)) {
            return false;
          }
          return target.hasUseTarget(get.autoViewAs({ name }, "unsure"));
        });
        if (!bool || !vcards.length) {
          return;
        }
        const choice = vcards[0][2];
        game.broadcastAll(
          function(skill, name) {
            lib.skill[skill].viewAs = { name };
            lib.skill[skill].prompt = lib.skill.dczhifeng.chooseButton.prompt([[null, null, name]]);
          },
          "dczhifeng_backup",
          choice
        );
        await target.chooseToUse().set("openskilldialog", info.chooseButton.prompt([[null, null, choice]])).set("norestore", true).set("_backupevent", "dczhifeng_backup").set("custom", {
          add: {},
          replace: { window() {
          } }
        }).set("filterTarget", (card, player2, target2) => {
          if (card.name == "sha") {
            return lib.filter.targetEnabled.call(this, card, player2, target2);
          }
          return lib.filter.filterTarget.call(this, card, player2, target2);
        }).set("addCount", choice != "jiu").backup("dczhifeng_backup");
      }
    }
  },
  //笛音荀勖
  diyin: {
    audio: 2,
    forced: true,
    trigger: {
      global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"]
    },
    filter(event, player) {
      return player.countMark("diyin") >= 7 && event.getd()?.filterInD("d")?.length > 0;
    },
    async content(event, trigger, player) {
      const cards2 = trigger.getd().filterInD("d");
      player.setMark(event.name, 0, false);
      await player.gain({ cards: cards2, animate: "gain2" });
    },
    init(player, skill) {
      player.addSkill(`${skill}_mark`);
    },
    onremove(player, skill) {
      delete player.storage[skill];
      player.removeSkill(`${skill}_mark`);
    },
    intro: {
      markcount: "mark",
      content: "当前已失去：#/7"
    },
    group: ["diyin_damage"],
    subSkill: {
      mark: {
        charlotte: true,
        forced: true,
        popup: false,
        trigger: {
          global: ["loseEnd", "loseAsyncEnd", "equipEnd", "gainEnd", "addJudgeEnd", "addToExpansionEnd"]
        },
        filter(event, player) {
          return event.getl?.(player)?.cards2?.length > 0 && player.countMark("diyin") < 7;
        },
        async content(event, trigger, player) {
          const skill = "diyin";
          player.addMark(skill, 1, false);
        }
      },
      damage: {
        audio: "diyin",
        forced: true,
        trigger: {
          player: "damageEnd"
        },
        logTarget(event, player) {
          return game.filterPlayer((target) => target.hp == player?.hp).sortBySeat();
        },
        async content(event, trigger, player) {
          const { targets } = event;
          await game.asyncDraw(targets);
        }
      }
    }
  },
  boqia: {
    audio: 2,
    usable: 1,
    hiddenCard(player, name) {
      if (player.getStat().skill?.boqia >= 0 || player.countCards("hes") < 3 || player.getStorage("boqia_used").includes(name)) {
        return false;
      }
      return get.type(name) == "basic" || get.type(name) == "trick" && !get.tag({ name }, "damage");
    },
    enable: "chooseToUse",
    getList(event, player) {
      return get.inpileVCardList((info) => {
        if (player.getStorage("boqia_used").includes(info[2])) {
          return false;
        }
        return (info[0] == "basic" || info[0] == "trick" && !get.tag({ name: info[2] }, "damage")) && event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
      });
    },
    filter(event, player) {
      return player.countCards("hes") >= 3 && get.info("boqia").getList(event, player).length > 0;
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("博洽", [get.info("boqia").getList(event, player), "vcard"], "hidden");
      },
      check(button) {
        const event = get.event().getParent();
        if (event.type !== "phase") {
          return 1;
        }
        return get.player().getUseValue(get.autoViewAs({ name: button.link[2], nature: button.link[3] }, "unsure"));
      },
      prompt(links) {
        return '###博洽###<div class="text center">将三张牌当作' + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用</div>";
      },
      backup(links) {
        return {
          audio: "boqia",
          filterCard: true,
          selectCard: 3,
          position: "hes",
          popname: true,
          log: false,
          viewAs: { name: links[0][2], nature: links[0][3] },
          check(card) {
            const selected = ui.selected.cards.slice();
            if (selected.length) {
              const types = selected.concat([card]).map((card2) => get.type2(card2)).unique();
              const suits = selected.concat([card]).map((card2) => get.suit(card2)).unique();
              if (types.length == selected.length + 1 || suits.length == selected.length + 1) {
                return 8 - get.value(card);
              }
              return 6 - get.value(card);
            }
            return 6.5 - get.value(card);
          },
          async precontent(event, trigger, player) {
            player.logSkill("boqia");
            player.addTempSkill("boqia_used");
            player.markAuto("boqia_used", [event.result.card.name]);
            const { cards: cards2 } = event.result;
            if (["type2", "suit"].some((key) => cards2?.map((card) => get[key](card)).unique().length == 3)) {
              event.getParent().oncard = () => {
                const { card } = get.event();
                player.when("useCardAfter").filter((evt) => evt.card == card).then(async (event2, trigger2, player2) => {
                  const result = await player2.chooseTarget({
                    prompt: `博洽：令一名角色将手牌调整至体力上限`,
                    filterTarget: lib.filter.all,
                    ai(target) {
                      const player3 = get.player();
                      const num = target.maxHp - target.countCards("h");
                      if (num > 0) {
                        return get.effect(target, { name: "draw" }, player3, player3) * num;
                      } else if (num < 0) {
                        return get.effect(target, { name: "guohe_copy2", position: "h" }, target, player3) * -num;
                      }
                      return 0;
                    },
                    forced: true
                  }).forResult();
                  if (result.targets?.length) {
                    const {
                      targets: [target]
                    } = result;
                    player2.line(target);
                    const num = target.maxHp - target.countCards("h");
                    if (num > 0) {
                      await target.draw({ num });
                    } else if (num < 0) {
                      await target.chooseToDiscard({ position: "h", selectCard: -num, forced: true });
                    }
                  }
                  const stat = player2.getStat().skill;
                  if (typeof stat.boqia == "number") {
                    delete stat.boqia;
                  }
                });
              };
            }
          }
        };
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
              return ["sha"];
            default:
              return [tag.slice("respond".length).toLowerCase()];
          }
        })().some((name) => get.info("boqia").hiddenCard(player, name));
      },
      order() {
        const player = get.player();
        if (player.hasSkill("diyin")) {
          const mark = player.countMark("boqia_mark");
          if (mark + 3 >= 7) {
            return 8;
          }
          return 6;
        }
        return 5;
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
      used: { charlotte: true, onremove: true }
    }
  },
  //☆法正
  youtan: {
    audio: 4,
    trigger: {
      player: "gainAfter",
      global: "loseAsyncAfter"
    },
    filter(event, player, name) {
      const evt = event.getParent("phaseUse", true);
      if (evt && evt.player == player) {
        return false;
      }
      const cards2 = event.getg(player);
      return cards2?.length && cards2.some((card) => !player.getStorage("youtan").includes(get.suit(card)));
    },
    intro: { content: "已记录花色：$" },
    forced: true,
    onremove(player, skill) {
      player.removeTip(skill);
      player.setStorage(skill, []);
    },
    async content(event, trigger, player) {
      const suits = trigger.getg(player).map((card) => get.suit(card)).removeArray(player.getStorage(event.name));
      if (suits?.length) {
        player.markAuto(event.name, suits);
        player.addTip(
          event.name,
          `藏铗${player.getStorage(event.name).sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a)).map((i) => get.translation(i)).join("")}`
        );
      }
    },
    mod: {
      cardEnabled(card, player) {
        if (!player.isPhaseUsing() || get.suit(card) == "unsure") {
          return;
        }
        if (!player.getStorage("youtan").includes(get.suit(card))) {
          return false;
        }
      },
      cardSavable(card, player) {
        if (!player.isPhaseUsing() || get.suit(card) == "unsure") {
          return;
        }
        if (!player.getStorage("youtan").includes(get.suit(card))) {
          return false;
        }
      }
    }
  },
  ciren: {
    audio: 2,
    global: "ciren_global",
    subSkill: {
      global: {
        trigger: {
          player: "phaseZhunbeiBegin"
        },
        filter(event, player) {
          if (!player.countCards("he")) {
            return false;
          }
          return game.hasPlayer((current) => {
            return current != player && current.hasSkill("ciren");
          });
        },
        async cost(event, trigger, player) {
          const targets = game.filterPlayer((current) => current != player && current.hasSkill("ciren"));
          event.result = await player.chooseCardTarget({
            prompt: get.prompt("ciren"),
            prompt2: `将一张牌交给${get.translation(targets)}${targets.length > 1 ? "中的一人" : ""}，令其交给你另一张同花色牌，或你摸一张牌`,
            position: "he",
            filterCard: true,
            filterTarget(card, player2, target) {
              return get.event().targetx.includes(target);
            },
            targetx: targets,
            ai1(card) {
              return 6 - get.value(card);
            },
            ai2(target) {
              const player2 = get.player();
              return get.attitude(player2, target);
            }
          }).forResult();
          event.result.skill_popup = false;
        },
        async content(event, trigger, player) {
          const {
            cards: cards2,
            targets: [target]
          } = event, suit = get.suit(cards2[0]);
          await target.logSkill("ciren", player);
          await player.give(cards2, target);
          const result = await target.chooseToGive(player, `交给${get.translation(player)}另一张${get.translation(suit)}牌，否则其摸一张牌`, "he").set("filterCard", (card) => {
            const { player: player2, preCards, suit: suit2 } = get.event();
            return !preCards.includes(card) && get.suit(card) == suit2;
          }).set("ai", (card) => {
            const { player: player2, att } = get.event(), value = get.value(card);
            if (value <= 0 && att <= 0) {
              return 10;
            }
            if (value > 15 && att > 0) {
              return 10;
            }
            return 0;
          }).set("att", get.attitude(target, player)).set("preCards", cards2).set("suit", suit).forResult();
          if (!result?.bool) {
            await player.draw();
          }
        }
      }
    }
  },
  zhancai: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.getStorage("youtan").length;
    },
    prompt() {
      const num = get.player().getStorage("youtan").length;
      return `摸${get.cnNumber(num)}张牌，然后移去一个记录的花色`;
    },
    manualConfirm: true,
    async content(event, trigger, player) {
      const skill = "youtan";
      await player.draw(player.getStorage(skill).length);
      const list = player.getStorage(skill);
      if (!list?.length) {
        return;
      }
      const result = await player.chooseButton(["跃渊：移去一个花色", [list.map((suit) => ["", "", `lukai_${suit}`]), "vcard"]], true).set("ai", (button) => {
        const player2 = get.player(), suit = button.link[2].slice(6);
        const num = player2.countCards("hs", (card) => {
          return get.suit(card) == suit && player2.hasValueTarget(card);
        });
        if (num > 0) {
          return 1 / num;
        }
        return 2;
      }).forResult();
      if (result?.bool && result.links?.length) {
        player.unmarkAuto(
          skill,
          result.links.map((i) => i[2].slice(6))
        );
        player.addTip(
          skill,
          `藏铗${player.getStorage(skill).map((i) => get.translation(i)).join("")}`
        );
      }
    },
    ai: {
      order: 9,
      combo: "youtan",
      result: {
        player(player) {
          return player.getStorage("youtan").filter((suit) => {
            return player.countCards("hs", (card) => {
              return get.suit(card) == suit && player.hasValueTarget(card);
            }) === 0;
          }).length;
        }
      }
    }
  },
  tenggu: {
    audio: 2,
    trigger: {
      player: "dying"
    },
    init(player, skill) {
      player.addExtraEquip(skill, "tengjia", true, (player2) => lib.card.tengjia);
    },
    onremove(player, skill) {
      player.removeExtraEquip(skill);
    },
    filter(event, player) {
      if (!event.reason || player.maxHp < 2) {
        return false;
      }
      const reason = event.reason;
      return reason.name == "damage" && !reason.hasNature("fire");
    },
    forced: true,
    async content(event, trigger, player) {
      await player.loseMaxHp();
      await player.recoverTo(player.maxHp);
    },
    mod: {
      targetEnabled(card, player, target) {
        if (get.subtypes(card)?.includes("equip2")) {
          return false;
        }
      }
    },
    group: ["tenggu_tengjia", "tenggu_noequip"],
    subSkill: {
      noequip: {
        audio: "tenggu",
        trigger: {
          player: "equipBefore"
        },
        filter(event, player) {
          return get.subtypes(event.card)?.includes("equip2");
        },
        forced: true,
        async content(event, trigger, player) {
          trigger.cancel();
          if (trigger.cards?.length) {
            const map = /* @__PURE__ */ new Map(), targets = [];
            for (const card of trigger.cards) {
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
                cards: trigger.cards
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
        }
      },
      tengjia: {
        trigger: {
          target: ["useCardToBefore", "shaBefore"],
          player: "damageBegin3"
        },
        equipSkill: true,
        forced: true,
        priority: 6,
        audio: "tenggu",
        logAudio(event) {
          return `tengjia${event.name == "damage" ? 2 : 1}.mp3`;
        },
        filter(event, player, name) {
          if (player.hasSkillTag("unequip2")) {
            return false;
          }
          const owner = event[event.name == "damage" ? "source" : "player"];
          if (owner?.hasSkillTag("unequip", false, {
            name: event.card ? event.card.name : null,
            target: player,
            card: event.card
          })) {
            return false;
          }
          if (name == "shaBefore") {
            return event.card.name == "sha" && !game.hasNature(event.card);
          }
          if (event.name == "damage") {
            return game.hasNature(event, "fire");
          }
          return ["wanjian", "nanman"].includes(event.card.name);
        },
        async content(event, trigger, player) {
          if (trigger.name == "damage") {
            trigger.num++;
          } else {
            trigger.cancel();
          }
        },
        ai: {
          effect: {
            target(card, player, target, current) {
              if (target.hasSkillTag("unequip2")) {
                return;
              }
              if (player.hasSkillTag("unequip", false, {
                name: card ? card.name : null,
                target,
                card
              }) || player.hasSkillTag("unequip_ai", false, {
                name: card ? card.name : null,
                target,
                card
              })) {
                return;
              }
              if (card.name == "nanman" || card.name == "wanjian") {
                return "zeroplayertarget";
              }
              if (card.name == "sha") {
                if (game.hasNature(card, "fire")) {
                  return 2;
                }
                if (player.hasSkill("zhuque_skill")) {
                  return 1.9;
                }
                if (!game.hasNature(card)) {
                  return "zeroplayertarget";
                }
              }
              if (get.tag(card, "fireDamage") && current < 0) {
                return 2;
              }
            }
          }
        }
      }
    }
  },
  dunyong: {
    audio: 2,
    trigger: {
      source: "damageBegin4",
      global: "dying"
    },
    filter(event, player) {
      if (event.name == "damage") {
        if (event.player == player || player.isMinMaxHp(true)) {
          return false;
        }
        return true;
      }
      return event.player.maxHp > 0;
    },
    priority: 1,
    forced: true,
    locked: false,
    logTarget: "player",
    async content(event, trigger, player) {
      const name = event.name;
      if (trigger.name == "damage") {
        await player.damage(trigger.num, "nosource", "nocard");
      } else {
        await player.draw(trigger.player.maxHp);
        player.addTip(name, "钝勇 无限制");
        player.when({
          global: ["phaseBefore", "phaseAfter"]
        }).step(async (event2, trigger2, player2) => {
          player2.removeTip(name);
        }).assign({
          mod: {
            cardUsable: () => Infinity,
            targetInRange: () => true
          }
        });
      }
    }
  },
  bingling: {
    audio: 2,
    trigger: { player: ["useCardToPlayer"] },
    filter(event, player) {
      return event.card.name == "sha" && event.target.countDiscardableCards(player, "he") >= 2;
    },
    logTarget: "target",
    async cost(event, trigger, player) {
      const target = trigger.target;
      event.result = await player.discardPlayerCard(target, "he", get.prompt2(event.skill), 2).set("chooseonly", true).forResult();
    },
    async content(event, trigger, player) {
      await trigger.target.modedDiscard(event.cards, player);
      if (event.cards.length > 1) {
        const card = event.cards[0], cardx = event.cards[1];
        let num = 0;
        if (get.type2(card, false) == get.type2(cardx, false)) {
          await player.gain(event.cards, "gain2");
          num++;
        }
        if (get.suit(card, false) == get.suit(cardx, false)) {
          await player.recover();
          num++;
        }
        if (get.cardNameLength(card, false) == get.cardNameLength(cardx, false)) {
          await player.draw(get.cardNameLength(card));
          num++;
        }
        if (get.number(card, false) == get.number(cardx, false)) {
          await trigger.target.loseHp(trigger.target.getHp());
          num++;
        }
        if (num == 0) {
          await player.damage(1, "fire", "nosource");
        }
      }
    }
  },
  renjia: {
    trigger: {
      player: ["damageBegin3", "damageAfter"],
      source: ["damageSource"]
    },
    forced: true,
    filter(event, player, triggername) {
      if (triggername == "damageBegin3") {
        if (!event.hasNature()) {
          return game.getRoundHistory(
            "everything",
            (evt) => {
              return evt.name == "damage" && evt.player == player && !evt.hasNature();
            },
            0,
            false,
            event
          ).indexOf(event) < 2;
        }
        return event.hasNature("fire");
      }
      return event.hasNature();
    },
    async content(event, trigger, player) {
      if (event.triggername == "damageBegin3") {
        if (trigger.hasNature("fire")) {
          trigger.num++;
        } else {
          trigger.num--;
        }
      } else if (trigger.hasNature()) {
        await player.draw();
      }
    },
    group: ["renjia_gain"],
    subSkill: {
      gain: {
        trigger: { player: ["expandEquipBegin", "enableEquipBegin"] },
        forced: true,
        init(player, skill) {
          player.disableEquip(2);
        },
        onremove(player, skill) {
          player.enableEquip(2);
        },
        filter(event, player) {
          return event.slots.includes("equip2");
        },
        async content(event, trigger, player) {
          trigger.slots.remove("equip2");
          if (trigger.slots.length == 0) {
            trigger.cancel();
          }
        }
      }
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (get.tag(card, "fireDamage")) {
            return [1, 0, 1, -3];
          }
          if (!get.natureList(card).length && target.getRoundHistory("damage", (evt) => evt.hasNature()).length < 2) {
            return [1, -1];
          }
        }
      }
    }
  },
  yj_yanyu: {
    enable: ["phaseUse"],
    limited: true,
    lose: false,
    discard: false,
    selectCard: 2,
    check(card) {
      if (ui.selected.cards.some((cardx) => get.suit(cardx) == get.suit(card))) {
        return 0;
      }
      return 1;
    },
    filterCard: () => true,
    filter(event, player) {
      return player.countCards("h") >= 2;
    },
    filterTarget(card, player, target) {
      return target != player;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.showCards(event.cards);
      const card = get.cardPile2("tengjia"), suits = event.cards.map((card2) => get.suit(card2));
      if (card && event.targets[0].canEquip("tengjia", true)) {
        await event.targets[0].equip(card);
      } else {
        player.popup("杯具");
      }
      player.addSkill("yj_yanyu_use");
      const targets = game.filterPlayer((curr) => curr != event.targets[0]);
      targets.forEach((curr) => {
        curr.markAuto("yj_yanyu_fire", suits);
        const list = curr.getStorage("yj_yanyu_source");
        list.add(player);
        curr.setStorage("yj_yanyu_source", list);
        curr.addSkill("yj_yanyu_fire");
      });
    },
    subSkill: {
      use: {
        forced: true,
        charlotte: true,
        trigger: { global: ["useCardAfter"] },
        filter(event, player) {
          if (!event.player.getStorage("yj_yanyu_source").includes(player)) {
            return false;
          }
          const suits = event.cards.map((card) => get.suit(card, false));
          return event.player.getStorage("yj_yanyu_fire").some((suit) => suits.includes(suit)) && ["basic", "trick", "equip"].includes(get.type2(event.card, false));
        },
        async content(event, trigger, player) {
          await player.draw();
        }
      },
      fire: {
        marktext: "焰",
        charlotte: true,
        intro: {
          name: "焰狱",
          mark(dialog, storage, player) {
            const str = get.translation(storage).split("、"), sources = get.translation(player.getStorage("yj_yanyu_source")).split("、");
            dialog.addText(`${str}花色的手牌遵循:基本牌:火【杀】,锦囊牌:火攻,装备牌:铁索连环且使用后${sources}摸一张牌`);
          }
        },
        mod: {
          cardname(card, player, name) {
            const suits = player.getStorage("yj_yanyu_fire"), suit = get.suit(card);
            if (!suits.includes(suit)) {
              return;
            }
            if (get.type(name, null, false) == "basic") {
              return "sha";
            } else if (get.type2(name, false) == "trick") {
              return "huogong";
            } else if (get.type(name, null, false) == "equip") {
              return "tiesuo";
            }
          },
          cardnature(card, player) {
            const suits = player.getStorage("yj_yanyu_fire"), suit = get.suit(card, false);
            if (suits.includes(suit) && get.type(card, null, false) == "basic") {
              return "fire";
            }
          }
        }
      }
    },
    ai: {
      order: 10,
      result: {
        player: 1,
        target: -1
      }
    }
  },
  biancai: {
    trigger: { global: "phaseBegin" },
    async content(event, trigger, player) {
      const result = await player.judge().forResult();
      if (get.position(result?.card, true) == "d") {
        await player.gain(result.card, "gain2");
      }
      if (result?.color == "red") {
        const card = get.cardPile((card2) => get.type(card2) == "equip", "cardPile");
        await player.gain(card, "gain2");
      } else if (result?.color == "black") {
        const card = get.cardPile((card2) => get.type(card2) == "equip", "discardPile");
        await player.gain(card, "gain2");
      } else {
        player.popup("杯具");
      }
    }
  },
  cuiren: {
    enable: "phaseUse",
    usable: 1,
    position: "he",
    filterCard(card, player) {
      return get.type(card) == "equip" && lib.filter.cardDiscardable(card, player, "cuiren");
    },
    filter(event, player) {
      return player.hasCards("he", (card) => get.type(card) == "equip");
    },
    check(card) {
      if (["equip1", "equip2", "equip3", "equip4"].every((subtype) => get.subtypes(card).includes(subtype))) {
        return 0;
      }
      return 20 - get.value(card);
    },
    async content(event, trigger, player) {
      const types = get.subtypes(event.cards[0]);
      if (types.includes("equip1")) {
        player.addTempSkill("cuiren_effect1");
      }
      if (types.includes("equip2")) {
        player.addTempSkill("cuiren_effect2");
      }
      if (["equip3", "equip4"].some((subtype) => types.includes(subtype))) {
        player.addTempSkill("cuiren_effect3");
      }
    },
    ai: {
      order: 10,
      result: { player: 1 }
    },
    subSkill: {
      effect1: {
        charlotte: true,
        mark: true,
        intro: { content: "本回合你使用牌无距离和次数限制" },
        mod: {
          targetInRange(card, player) {
            return true;
          },
          cardUsable(card, player) {
            return Infinity;
          }
        }
      },
      effect2: {
        charlotte: true,
        mark: true,
        intro: { content: "本回合你使用牌无法被响应" },
        targetprompt2: (target) => {
          get.player();
          const card = get.card();
          if (get.type(card) == "trick" || get.type(card) == "basic" && !["shan", "tao", "jiu", "du"].includes(card.name)) {
            return "不可响应";
          }
        },
        onChooseToUse(event) {
          event.targetprompt2.add(lib.skill.cuiren_effect2.targetprompt2);
        },
        onChooseTarget(event) {
          event.targetprompt2.add(lib.skill.cuiren_effect2.targetprompt2);
        },
        trigger: { player: "useCard" },
        forced: true,
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.players);
        },
        ai: {
          directHit_ai: true
        }
      },
      effect3: {
        intro: { content: "本回合你使用牌指定目标时，可以多指定任意个目标" },
        trigger: { player: "useCard2" },
        filter(event, player) {
          if (!["basic", "trick"].includes(get.type(event.card)) || !event.targets?.length) {
            return false;
          }
          return game.hasPlayer((current) => {
            if (event.targets.includes(current)) {
              return false;
            }
            return lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
          });
        },
        async cost(event, trigger, player) {
          const targets = game.filterPlayer((current) => {
            if (trigger.targets.includes(current)) {
              return false;
            }
            return lib.filter.targetEnabled2(trigger.card, player, current) && lib.filter.targetInRange(trigger.card, player, current);
          });
          if (!targets?.length) {
            return;
          }
          event.result = await player.chooseTarget(`为${get.translation(trigger.card)}额外指定任意目标`).set("ai", (target) => {
            const player2 = get.player(), trigger2 = get.event().getTrigger();
            return get.effect(target, trigger2.card, player2, player2);
          }).set("targetx", targets).set("filterTarget", (card, player2, target) => {
            return get.event().targetx.includes(target);
          }).set("selectTarget", [1, Infinity]).forResult();
        },
        async content(event, trigger, player) {
          trigger.targets.addArray(event.targets);
        }
      }
    }
  },
  shenfeng: {
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return get.name(event.card) == "sha" && player.hasCards("he", (card) => get.type(card) == "equip") && event.target.isIn();
    },
    async cost(event, trigger, player) {
      const { target } = trigger;
      event.result = await player.chooseToDiscard(get.prompt2(event.skill, target), "he", (card) => {
        return get.type(card) == "equip";
      }).set("ai", (card) => {
        const { player: player2, goon } = get.event();
        if (!goon) {
          return 0;
        }
        if (get.name(card) == "muniu" && player2.countCards("h") > 3) {
          return 0;
        }
        return 6 - get.value(card);
      }).set("chooseonly", true).set("goon", get.attitude(player, target) <= 0).forResult();
    },
    logTarget: "target",
    async content(event, trigger, player) {
      await player.discard(event.cards);
      const target = event.targets[0];
      const { card } = trigger;
      const result = await player.chooseButton([
        "神锋：请选择一项",
        [
          [
            ["damage", `令${get.translation(card)}对${get.translation(target)}伤害+1`],
            ["losehp", `令${get.translation(card)}对${get.translation(target)}造成的伤害视为失去体力`],
            ["discard", `令${get.translation(target)}弃置两张牌`]
          ],
          "textbutton"
        ]
      ]).set("forced", true).set("filterButton", (button) => {
        const { target: target2 } = get.event();
        if (button.link == "discard") {
          return target2.hasCards("he");
        }
        return true;
      }).set("target", target).set("ai", (button) => {
        const { player: player2, target: target2 } = get.event();
        if (button.link == "discard") {
          return target2.hasCards("he") ? 2 : 0;
        }
        if (button.link == "damage") {
          return !target2.hasCards("he") ? 2.5 : 0.5;
        }
        return 1;
      }).forResult();
      if (!result?.links?.length) {
        return;
      }
      if (result.links[0] == "damage") {
        const id = target.playerid;
        const map = trigger.customArgs;
        map[id] ??= {};
        map[id].extraDamage ??= 0;
        map[id].extraDamage++;
      } else if (result.links[0] == "losehp") {
        player.addTempSkill(event.name + "_effect");
        player.markAuto(event.name + "_effect", [[card, target]]);
      } else {
        await target.chooseToDiscard(2, "he", true);
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        trigger: { source: "damageBefore" },
        forced: true,
        popup: false,
        filter(event, player) {
          if (!event.card) {
            return false;
          }
          return player.getStorage("shenfeng_effect").some(([card, target]) => event.card == card && target == event.player);
        },
        async content(event, trigger, player) {
          let list = player.getStorage(event.name).filter(([card, target]) => trigger.card == card && target == trigger.player);
          player.unmarkAuto(event.name, list);
          if (!player.getStorage(event.name).length) {
            player.removeSkill(event.name);
          }
          trigger.cancel();
          await trigger.player.loseHp(trigger.num);
        }
      }
    }
  },
  pyhuanling: {
    trigger: { player: ["phaseUseBegin", "damageEnd"] },
    filter(event, player) {
      return player.countCards("hes") > 0;
    },
    check(event, player) {
      return true;
    },
    init(player, skill) {
      if (!_status.bingzhuSkill) {
        const bingzhuSkill = {};
        Object.keys(lib.card).filter((name) => get.type(name) == "equip" && get.bingzhu(name).length).map((name) => get.bingzhu(name)).flat().forEach((name) => bingzhuSkill[name] = []);
        if (!_status.characterlist) {
          game.initCharacterList();
        }
        _status.characterlist.map((character) => {
          const names = get.characterSurname(character).map((info) => info.join("")).concat([get.rawName(character)]), skills2 = get.character(character, 3);
          names.forEach((name) => {
            if (bingzhuSkill[name]) {
              bingzhuSkill[name].addArray(skills2);
            }
          });
        });
        for (let name in bingzhuSkill) {
          bingzhuSkill[name] = bingzhuSkill[name].randomSort();
        }
        game.broadcastAll((bingzhuSkill2) => _status.bingzhuSkill = bingzhuSkill2, new Map(Object.entries(bingzhuSkill)));
      }
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard(get.prompt2(event.skill), lib.filter.cardRecastable, "he").set("ai", (card) => 10 - get.value(card)).forResult();
    },
    async content(event, trigger, player) {
      await player.recast(event.cards);
      const suitx = get.suit(event.cards[0]);
      const card = get.cardPile((card2) => get.suit(card2) == suitx && get.type(card2) == "equip", "field");
      if (!card) {
        player.chat("谁偷走了我的装备牌！");
        return;
      }
      await player.gain(card, "gain2");
      const result = await player.chooseTarget("选择一名角色获得技能").set("ai", (target2) => {
        const player2 = get.player();
        return get.attitude(player2, target2);
      }).set("forced", true).forResult();
      get.bingzhu(card).randomGet();
      if (!result?.targets?.length) {
        return;
      }
      const [target] = result.targets;
      const skills2 = get.bingzhu(card).map((name) => _status.bingzhuSkill.get(name)).flat().filter((skill) => !target.hasSkill(skill, null, false, false)).randomGets(3);
      if (!skills2.length) {
        player.chat("没有技能喵");
      } else {
        const result2 = await player.chooseButton([`选择一个技能令${get.translation(target)}获得`, [skills2, "skill"]]).set("ai", (button) => {
          return get.priority(button.link);
        }).set("forced", true).forResult();
        if (result2?.links?.length) {
          await target.addSkills(result2.links[0]);
        }
      }
      if (target != player) {
        await player.draw(
          target.getSkills(null, false, false).filter((skill) => {
            const info = get.info(skill);
            return info && !info.charlotte && get.skillInfoTranslation(skill, target).length;
          }).length
        );
      }
    }
  },
  pyshenduan: {
    trigger: {
      player: "useCardAfter"
    },
    init(player, skill) {
      player.storage.pyshenduan_effect = /* @__PURE__ */ new Map([
        [
          "equip1",
          async (player2) => {
            const card = get.autoViewAs({
              name: "sha",
              isCard: true
            });
            await player2.chooseUseTarget(card, false);
          }
        ],
        [
          "equip2",
          async (player2) => {
            await player2.gainMaxHp();
            await player2.recover();
          }
        ],
        [
          "equip3",
          async (player2) => {
            await player2.draw();
            player2.addMark("pyshenduan_max", 1, false);
          }
        ],
        [
          "equip4",
          async (player2) => {
            const targets = game.filterPlayer((curr) => curr != player2);
            await game.doAsyncInOrder(targets, async (target) => {
              await player2.discardPlayerCard(target, true, "he");
            });
          }
        ]
      ]);
      player.addSkill("pyshenduan_max");
    },
    check(event, player) {
      if (get.subtypes(event.card)?.includes("equip4") && game.countPlayer((curr) => curr != player && get.attitude(player, curr) > 0) - game.countPlayer((curr) => get.attitude(player, curr) < 0) > 0) {
        return false;
      }
      return true;
    },
    filter(event, player) {
      if (get.type(event.card) != "equip" || get.subtype(event.card) == "equip5") {
        return false;
      }
      const subtypes = player.getStorage("pyshenduan_used");
      return !get.subtypes(event.card).every((type) => subtypes.includes(type));
    },
    forced: true,
    async content(event, trigger, player) {
      const types = get.subtypes(trigger.card);
      const subtypes = (player.getStorage("pyshenduan_used") || []).addArray(types);
      player.markAuto("pyshenduan_used", subtypes);
      if (!player.hasSkill("pyshenduan_used", null, false, false)) {
        player.addTempSkill("pyshenduan_used");
      }
      for (let type of types) {
        await player.storage.pyshenduan_effect.get(type)(player);
      }
    },
    subSkill: {
      max: {
        charlotte: true,
        marktext: "神锻",
        mark: true,
        intro: {
          name: "神锻",
          mark(dialog, storage) {
            if (!storage) {
              dialog.addText("手牌上限+0");
            } else {
              dialog.addText(`手牌上限+${storage}`);
            }
          }
        },
        mod: {
          maxHandcard: function(player, num) {
            return num + player.countMark("pyshenduan_max");
          }
        }
      },
      used: {
        charlotte: true,
        marktext: "神锻",
        onremove: true,
        intro: {
          name: "神锻",
          mark(dialog, storage) {
            const text = storage.map((type) => `${get.translation(type)}`).join("、");
            dialog.addText("神锻使用过的类型:<br>");
            dialog.addText(text);
          }
        }
      }
    }
  },
  //爻袁术
  dcwangyao: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame",
      target: "useCardToTargeted"
    },
    filter(event, player) {
      if (event.name.startsWith("useCard")) {
        if (event.player == player) {
          return false;
        }
        if (event.card?.name != "sha" && get.type(event.card) != "trick") {
          return false;
        }
        return ["dcwangyao_marka", "dcwangyao_markb"].every((mark) => player.hasSkill(mark));
      }
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async cost(event, trigger, player) {
      if (trigger.name.startsWith("useCard")) {
        const list = ["dcwangyao_marka", "dcwangyao_markb"].map((mark) => {
          const type = player.getStorage(mark, false);
          return [mark, "", type ? "阳" : "阴"];
        });
        const result = await player.chooseButton([
          "妄爻：是否翻转一枚爻？",
          [
            list,
            (item, type, position, noclick, node) => {
              node = ui.create.buttonPresets.vcard(item, "vcard", position, noclick, node);
              node.owner = get.player();
              node._customintro = function(uiintro, evt) {
                const yao = node.owner?.getStorage(node.link[2], false);
                uiintro.add(`${yao ? "阳" : "阴"}爻`);
              };
              return node;
            }
          ]
        ]).set("ai", (button) => {
          if (button.link[2] == true) {
            return 1;
          }
          return 2;
        }).forResult();
        if (result.bool) {
          event.result = {
            bool: true,
            cost_data: result.links[0]
          };
        }
      } else {
        event.result = {
          bool: true
        };
      }
    },
    async content(event, trigger, player) {
      if (trigger.name.startsWith("useCard")) {
        const [mark, trash, type] = event.cost_data;
        game.log(player, "翻转了一枚", type, "爻");
        get.info(event.name).setType(player, mark, type != "阳");
        const list = ["dcwangyao_marka", "dcwangyao_markb"];
        if (player.getStorage(list[0], false) == player.getStorage(list[1], false)) {
          await player.draw();
        }
        return;
      }
      player.addSkill("dcwangyao_marka");
      player.addSkill("dcwangyao_markb");
    },
    setType(player, skill, type) {
      player.setStorage(skill, type);
      player.markSkill(skill);
      game.broadcastAll(
        (player2, skill2, type2) => {
          const color = type2 ? "black" : "white", bgColor = type2 ? "rgb(255, 255, 255)" : "rgba(1, 1, 1, 0.9)";
          const text = `<span style="color: ${color}">爻</span>`;
          if (player2.marks[skill2]) {
            player2.marks[skill2].firstChild.style.backgroundColor = bgColor;
            player2.marks[skill2].firstChild.innerHTML = text;
          }
        },
        player,
        skill,
        type
      );
    },
    subSkill: {
      marka: {
        init(player, skill) {
          get.info("dcwangyao").setType(player, skill, true);
        },
        mark: true,
        marktext: "爻",
        intro: {
          content(storage, player) {
            const color = storage ? "gold" : "gray", name = storage ? "阳" : "阴";
            return `此爻为<span style="color: ${color}">${name}爻</span>`;
          }
        },
        onremove: true
      },
      markb: {
        init(player, skill) {
          get.info("dcwangyao").setType(player, skill, false);
        },
        mark: true,
        marktext: "爻",
        intro: {
          content(storage, player) {
            const color = storage ? "gold" : "gray", name = storage ? "阳" : "阴";
            return `此爻为<span style="color:${color}">${name}爻</span>`;
          }
        },
        onremove: true
      }
    }
  },
  dczengua: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: lib.filter.notMe,
    filterCard: true,
    async content(event, trigger, player) {
      const target = event.target;
      const result = await player.chooseButton(
        [
          `猜测${get.translation(target)}手牌中某种类型的牌是否为全场最多`,
          [
            ["basic", "trick", "equip"].map((type2) => {
              return ["", "", `caoying_${type2}`];
            }),
            "vcard"
          ],
          [
            [
              ["isMax", "全场最多"],
              ["notMax", "不为最多"]
            ],
            "tdnodes"
          ]
        ],
        2,
        true
      ).set("filterButton", (button) => {
        if (ui.selected.buttons?.length) {
          return typeof button.link == "string";
        }
        return typeof button.link != "string";
      }).set("complexSelect", true).set("ai", (button) => {
        return Math.random();
      }).forResult();
      if (!result.bool) {
        return;
      }
      const type = result.links[0][2].slice(8), isMax = result.links[1] == "isMax";
      const count = (current) => current.countCards("h", (card) => get.type2(card) == type), bool = !game.hasPlayer((current) => {
        return count(current) > count(target);
      });
      if (isMax == bool) {
        player.popup("洗具", "wood");
        if (!target.countGainableCards(player, "h", (card) => get.type2(card) == type)) {
          return;
        }
        await player.gainPlayerCard(target, "h", true).set("filterButton", (button) => {
          return get.type2(button.link) == get.event().cardType;
        }).set("cardType", type);
      } else {
        player.popup("杯具", "fire");
        await target.draw();
        const list = ["dcwangyao_marka", "dcwangyao_markb"].map((mark) => {
          const type2 = player.getStorage(mark, false);
          return [mark, "", type2 ? "阳" : "阴"];
        });
        if (!list.every((info) => {
          return typeof player.storage[info[0]] == "boolean";
        })) {
          return;
        }
        const result2 = await player.chooseButton(
          [
            "谮卦：翻转一枚爻",
            [
              list,
              (item, type2, position, noclick, node) => {
                node = ui.create.buttonPresets.vcard(item, "vcard", position, noclick, node);
                node.owner = get.player();
                node._customintro = function(uiintro, evt) {
                  const yao = node.owner?.getStorage(node.link[2], false);
                  uiintro.add(`${yao ? "阳" : "阴"}爻`);
                };
                return node;
              }
            ]
          ],
          true
        ).set("ai", (button) => {
          if (button.link[2] == true) {
            return 1;
          }
          return 2;
        }).forResult();
        if (result2.bool) {
          const [mark, trash, type2] = result2.links[0];
          game.log(player, "翻转了一枚", type2, "爻");
          get.info("dcwangyao").setType(player, mark, type2 != "阳");
        }
      }
    },
    ai: {
      order: 5,
      result: {
        target(player, target) {
          if (target.countCards("h") < 2 || !game.hasPlayer((current) => {
            return current != target && current.countCards("h") > target.countCards("h") / 2;
          })) {
            return 2 * get.sgnAttitude(player, target);
          }
          return 0;
        },
        player: -1
      }
    }
  },
  dckanghui: {
    audio: 2,
    forced: true,
    trigger: {
      player: "damageBegin3"
    },
    filter(event, player) {
      if (event.source == player) {
        return false;
      }
      const list = ["dcwangyao_marka", "dcwangyao_markb"];
      return list.every((mark) => {
        if (typeof player.storage[mark] != "boolean") {
          return false;
        }
        return player.getStorage(mark, false) == false;
      });
    },
    async content(event, trigger, player) {
      trigger.num++;
    },
    mod: {
      maxHandcard(player, num) {
        const list = ["dcwangyao_marka", "dcwangyao_markb"];
        if (list.every((mark) => player.getStorage(mark, false))) {
          return num + 2;
        }
      }
    },
    ai: {
      combo: "dcwangyao"
    }
  },
  //张奂
  dcyiju: {
    audio: 2,
    trigger: { target: "useCardToPlayered" },
    forced: true,
    filter(event, player) {
      return event.player != player && event.targets.length == 1 && player.countDiscardableCards(player, "he");
    },
    async content(event, trigger, player) {
      await player.chooseToDiscard(`义拒：请弃置一张牌`, "he", true).set("ai", (card) => {
        const player2 = get.player();
        if (player2.hasSkill("dcshuguo", null, false, false)) {
          return Math.max(...game.filterPlayer2((target) => player2.canUse(card, target, true, false)).map((target) => get.effect_use(target, card, player2, player2)));
        }
        return 6 - get.value(card);
      });
    },
    ai: {
      neg: true,
      combo: "dcshuguo"
    }
  },
  dcshuguo: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      return game.hasGlobalHistory("cardMove", (evt) => {
        if (evt.type !== "discard") {
          return false;
        }
        return evt.cards2.someInD("d");
      });
    },
    async content(event, trigger, player) {
      const cards2 = [], cards22 = [];
      game.checkGlobalHistory("cardMove", (evt) => {
        if (evt.type !== "discard") {
          return false;
        }
        const cardsx = evt.cards2.filterInD("d");
        if (cardsx.length) {
          cards2.addArray(cardsx);
          if (evt.player !== player) {
            cards22.addArray(cardsx);
          }
        }
      });
      const goon = () => cards2.some((card) => player.hasUseTarget(card) && get.position(card) == "d");
      while (goon()) {
        const result = await player.chooseButton([
          "戍国：请选择要使用的牌",
          [
            cards2.map((card) => [
              card,
              (() => {
                return cards22.includes(card) ? "其他角色" : "";
              })()
            ]),
            (item, type, position, noclick, node) => {
              node = ui.create.buttonPresets.card(item[0], type, position, noclick);
              game.createButtonCardsetion(item[1], node);
              return node;
            }
          ]
        ]).set("filterButton", (button) => {
          return get.event().canUse.includes(button.link);
        }).set("ai", (button) => {
          return get.player().getUseValue(button.link);
        }).set(
          "canUse",
          cards2.filter((card) => player.hasUseTarget(card) && get.position(card) == "d")
        ).forResult();
        if (result?.bool && result.links?.length) {
          const card = result.links[0];
          cards2.remove(card);
          await player.chooseUseTarget(card, true);
          if (cards22.includes(card)) {
            break;
          }
        } else {
          break;
        }
      }
      if (!player.isMaxHandcard(true)) {
        await player.draw(Math.min(cards2.length, 5));
      }
    }
  },
  //张燕
  dcqiaolve: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      if (!event.targets?.length || !event.isFirstTarget) {
        return false;
      }
      return event.targets.some((target) => {
        if (target == player || !target.countGainableCards(player, "he")) {
          return false;
        }
        return game.getAllGlobalHistory("useCard", (evt) => evt.targets.includes(target) && evt.card.name == event.card.name).indexOf(event.getParent()) == 0;
      });
    },
    async cost(event, trigger, player) {
      const targets = trigger.targets.filter((target) => {
        if (target == player || !target.countGainableCards(player, "he")) {
          return false;
        }
        return game.getAllGlobalHistory("useCard", (evt) => evt.targets.includes(target) && evt.card.name == trigger.card.name).indexOf(trigger.getParent()) == 0;
      });
      if (targets.length > 1) {
        event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
          const { targets: targets2 } = get.event();
          return targets2?.includes(target);
        }).set("targets", targets).set("ai", (target) => {
          const player2 = get.player();
          return get.effect(target, { name: "shunshou_copy2" }, player2, player2);
        }).forResult();
      } else {
        event.result = await player.chooseBool(get.prompt2(event.skill, targets)).set("choice", get.effect(targets[0], { name: "shunshou_copy2" }, player, player) > 0).forResult();
        event.result.targets = targets;
      }
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      await player.gainPlayerCard(target, "he", true);
    }
  },
  dchanjie: {
    audio: 2,
    trigger: { global: "phaseBegin" },
    filter(event, player) {
      return player != event.player && event.player.hp >= player.hp && player.countCards("hs", { color: "black" });
    },
    direct: true,
    clearTime: true,
    async content(event, trigger, player) {
      const list = get.inpileVCardList((info) => {
        if (info[0] == "delay") {
          return false;
        }
        return get.tag({ name: info[2] }, "damage") && player.countCards("hs", (card2) => {
          if (get.color(card2) != "black") {
            return false;
          }
          const vcard = get.autoViewAs({ name: info[2], nature: info[3] }, [card2]);
          return player.canUse(vcard, trigger.player, false);
        }) > 0;
      });
      if (!list.length) {
        return;
      }
      const result = await player.chooseButton([get.prompt2(event.name, trigger.player), [list, "vcard"]]).set("ai", (button) => {
        const { player: player2, sourcex: target } = get.event();
        const card2 = player2.getCards("hs", { color: "black" }).maxBy((card3) => {
          const vcard = get.autoViewAs({ name: button.link[2], nature: button.link[3] }, [card3]);
          if (player2.canUse(vcard, target, false)) {
            return get.effect_use(target, vcard, player2, player2);
          }
          return 0;
        });
        if (!card2) {
          return 0;
        }
        return get.effect_use(target, card2, player2, player2);
      }).set("sourcex", trigger.player).forResult();
      if (!result?.links?.length) {
        return;
      }
      const card = {
        name: result.links[0][2],
        nature: result.links[0][3]
      };
      const prompt = `撼捷：是否将一张黑色手牌当做${get.translation(card)}对${get.translation(trigger.player)}使用？`;
      game.broadcastAll(
        (card2, prompt2) => {
          lib.skill.dchanjie_backup.viewAs = card2;
          lib.skill.dchanjie_backup.prompt = prompt2;
        },
        card,
        prompt
      );
      const next = player.chooseToUse();
      next.set("openskilldialog", prompt);
      next.set("norestore", true);
      next.set("addCount", false);
      next.set("onlyTarget", trigger.player);
      next.set("_backupevent", "dchanjie_backup");
      next.set("custom", {
        add: {},
        replace: { window() {
        } }
      });
      next.set("logSkill", event.name);
      next.backup("dchanjie_backup");
      event.result = await next.forResult();
    },
    subSkill: {
      backup: {
        filterCard(card) {
          return get.itemtype(card) == "card" && get.color(card) == "black";
        },
        position: "hs",
        selectCard: 1,
        check: (card) => 7 - get.value(card),
        filterTarget(card, player, target) {
          const { onlyTarget } = get.event();
          return target == onlyTarget && lib.filter.targetEnabled.apply(this, arguments);
        },
        async precontent(event) {
          delete event.result.skill;
        },
        log: false,
        popname: true
      }
    }
  },
  //伍孚
  dchuairen: {
    audio: 2,
    enable: "chooseToUse",
    filter(event, player) {
      return get.inpileVCardList((info) => {
        return get.type(info[2]) == "basic";
      }).some((card) => {
        return player.hasCard((cardx) => {
          if (get.type(cardx) !== "equip") {
            return false;
          }
          return event.filterCard({ name: card[2], nature: card[3], storage: { dchuairen: true }, cards: [cardx] }, player, event);
        }, "e");
      });
    },
    chooseButton: {
      dialog(event, player) {
        const list = get.inpileVCardList((info) => {
          return get.type(info[2]) == "basic";
        }).filter((card) => {
          return player.hasCard((cardx) => {
            if (get.type(cardx) !== "equip") {
              return false;
            }
            return event.filterCard({ name: card[2], nature: card[3], storage: { dchuairen: true }, cards: [cardx] }, player, event);
          }, "e");
        });
        return ui.create.dialog("怀刃", [list, "vcard"]);
      },
      filter(button, player) {
        const evt = get.event().getParent();
        return evt.filterCard({ name: button.link[2], nature: button.link[3], storage: { dchuairen: true } }, player, evt);
      },
      check(button) {
        if (get.event().type != "phase") {
          return 1;
        }
        return _status.event.player.getUseValue({ name: button.link[2], nature: button.link[3], storage: { dchuairen: true } });
      },
      backup(links, player) {
        return {
          audio: "dchuairen",
          filterCard: { type: "equip" },
          popname: true,
          check(card) {
            return 6 - get.value(card);
          },
          position: "e",
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            storage: { dchuairen: true }
          },
          async precontent(event, trigger, player2) {
            const cards2 = event.result.cards, card = event.result.card, strs = cards2.map((i) => get.cardDescription(i, player2));
            event.getParent().addCount = false;
            if (strs.some((str) => str.includes(`【${get.translation(card.name)}】`))) {
              await player2.draw(2);
            }
            if (!player2.countCards("e", (card2) => !cards2.includes(card2))) {
              event.getParent().set("oncard", () => {
                _status.event.baseDamage++;
              });
            }
          }
        };
      },
      prompt(links, player) {
        return "###怀刃###将一张装备牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用";
      }
    },
    mod: {
      cardUsable(card, player, num) {
        if (card.storage?.dchuairen) {
          return Infinity;
        }
      }
    },
    locked: false,
    hiddenCard(player, name) {
      return lib.inpile.includes(name) && get.type(name) == "basic" && player.countCards("e");
    },
    ai: {
      fireAttack: true,
      respondSha: true,
      skillTagFilter(player, tag, arg) {
        if (arg == "respond" || !player.countCards("e")) {
          return false;
        }
      },
      order(item, player = _status.event.player) {
        if (player && get.event().type == "phase") {
          let max = 0, names = get.inpileVCardList((info) => {
            return get.type(info[2]) == "basic";
          });
          names = names.map((namex) => {
            return { name: namex[2], nature: namex[3], storage: { dchuairen: true } };
          });
          names.forEach((card) => {
            if (player.getUseValue(card) > 0) {
              let temp = get.order(card);
              max = temp > max ? temp : max;
            }
          });
          if (max > 0) {
            max *= 0.9;
          }
          return max;
        }
        return 0.5;
      },
      result: {
        player(player) {
          if (get.event().dying) {
            return get.attitude(player, get.event().dying);
          }
          return 1;
        }
      }
    },
    subSkill: {
      backup: {}
    }
  },
  dcchizei: {
    audio: 2,
    trigger: {
      player: "damageBegin3"
    },
    filter(event, player) {
      return event.source?.isIn() && player.canCompare(event.source, true);
    },
    logTarget: "source",
    check(event, player) {
      return get.attitude(player, event.source) < 0;
    },
    async content(event, trigger, player) {
      let num = 0;
      while (true) {
        const next = player.chooseToCompare(trigger.source);
        if (!next.fixedResult) {
          next.fixedResult = {};
        }
        next.fixedResult[player.playerid] = get.cards()[0];
        const result = await next.forResult();
        if (result.bool) {
          if (!player.canCompare(trigger.source, true)) {
            return;
          }
          num++;
          const result2 = await player.chooseBool(`是否继续与${get.translation(trigger.source)}拼点？（已赢${num}次）`).set("choice", Math.random() > 0.7).forResult();
          if (!result2.bool) {
            return;
          }
        } else {
          if (num > 0) {
            await player.chooseToDiscard("he", num, true);
          }
          return;
        }
      }
    }
  },
  dczhonge: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: lib.filter.notMe,
    filterCard(card, player) {
      return player.countCards("h") > player.maxHp;
    },
    selectCard() {
      const player = get.player();
      if (player.countCards("h") <= player.maxHp) {
        return [0, 1];
      }
      return player.countCards("h") - player.maxHp;
    },
    allowChooseAll: true,
    async content(event, trigger, player) {
      if (!event.cards?.length) {
        await player.drawTo(player.maxHp);
      }
      const target = event.target, targets = [player, target];
      const map = await game.chooseAnyOL(targets, get.info(event.name).chooseControl, [targets]).forResult();
      let list = [];
      for (const i of targets) {
        const result = map.get(i);
        i.popup(result.control);
        list.push(result.control);
      }
      list.sort((a, b) => a === "摸牌" ? -1 : 1);
      const bool = list[0] != list[1];
      for (const i of list) {
        for (const current of targets) {
          if (i == "摸牌") {
            await current.draw();
            if (bool && current == player) {
              await current.draw();
            }
          } else {
            const sha = new lib.element.VCard({ name: "sha", isCard: true }), aim = current === player ? target : player;
            if (current.isIn() && current.canUse(sha, aim, false)) {
              current.line(aim);
              await current.useCard(sha, aim, false, "noai");
            }
            if (bool && current == player) {
              const sha2 = new lib.element.VCard({ name: "sha", isCard: true });
              if (current.isIn() && current.canUse(sha2, aim, false)) {
                current.line(aim);
                await current.useCard(sha2, aim, false, "noai");
              }
            }
          }
        }
      }
    },
    chooseControl(player, targets, eventId) {
      const str = get.translation(targets[0] == player ? targets[1] : targets[0]);
      return player.chooseControl("摸牌", "出杀").set("prompt", `忠锷：请选择一项与${str}依次执行`).set("prompt2", `若你与其选择的选项不同，${get.translation(targets[0])}执行时额外执行一遍`).set("ai", () => {
        if (get.event().att > 0) {
          return "摸牌";
        }
        return Math.random() > 0.3 ? "出杀" : "摸牌";
      }).set("att", Math.max(get.attitude(targets[0], targets[1]), get.attitude(targets[1], targets[0]))).set("id", eventId).set("_global_waiting", true);
    },
    ai: {
      order: 3,
      result: {
        target(player, target) {
          return get.effect(target, { name: "sha" }, player, target) + 1;
        },
        player(player, target) {
          return player.maxHp - player.countCards("h");
        }
      }
    }
  },
  dcjuekai: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "fire",
    manualConfirm: true,
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      if (typeof get.skillCount("dczhonge") == "number" && get.skillCount("dczhonge") >= 1) {
        delete player.getStat("skill")["dczhonge"];
        game.log(player, "重置了技能", "#g【忠锷】");
      }
      player.addTempSkill("dcjuekai_effect", "phaseChange");
      for (const target of game.players) {
        if (target.getHistory("gain", (evt) => {
          return evt.getParent("phaseUse") == event.getParent("phaseUse", true);
        }).length) {
          player.line(target, "green");
          target.addTempSkill("dcjuekai_fengyin", "phaseChange");
        }
      }
    },
    ai: {
      combo: "dczhonge",
      order: 1,
      result: {
        player(player) {
          if (!player.getStat("skill")?.["dczhonge"]) {
            return 0;
          }
          return 1;
        }
      }
    },
    subSkill: {
      effect: {
        trigger: {
          global: ["gainAfter", "loseAsyncAfter"]
        },
        charlotte: true,
        direct: true,
        async content(event, trigger, player) {
          for (const target of game.players) {
            if (!target.hasSkill("dcjuekai_fengyin") && trigger.getg && trigger.getg(target)?.length) {
              player.line(target, "green");
              target.addTempSkill("dcjuekai_fengyin", "phaseChange");
            }
          }
        }
      },
      fengyin: {
        charlotte: true,
        onremove: true,
        mark: true,
        marktext: "忾",
        intro: {
          content: "本阶段无法使用手牌"
        },
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
  //修爵裴秀
  xjzhitu: {
    mod: {
      targetInRange(card, player, target) {
        if (player.getStorage("xjzhitu").includes(get.number(card))) {
          return true;
        }
      }
    },
    trigger: {
      target: "useCardToTarget",
      player: "useCard"
    },
    forced: true,
    locked: false,
    filter(event, player) {
      const number = get.number(event.card);
      if (typeof number !== "number") {
        return false;
      }
      const storage = player.getStorage("xjzhitu"), bool = !storage.includes(number);
      if (event.name == "useCard") {
        return bool || storage.filter((num) => num > 0).length >= 13;
      }
      return bool;
    },
    async content(event, trigger, player) {
      const storage = player.getStorage(event.name), { card } = trigger, number = get.number(card);
      if (trigger.name == "useCard" && storage.filter((num) => num > 0).length >= 13) {
        trigger.directHit.addArray(game.players);
        game.log(card, "不能被响应");
      }
      if (!storage.includes(number)) {
        player.markAuto(event.name, [number]);
        player.storage[event.name].sort((a, b) => a - b);
        player.markSkill(event.name);
        await player.draw();
      }
    },
    onremove: true,
    intro: { content: "已记录点数：$" }
  },
  dcxiujue: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => get.info("dcxiujue").filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return player.canCompare(target);
    },
    async content(event, trigger, player) {
      const { target } = event;
      const result = await player.chooseToCompare(target).forResult();
      const { winner } = result;
      if (winner) {
        const cards2 = [result.player, result.target].filterInD("d").filter((card) => winner.hasUseTarget(card));
        while (cards2.length) {
          const card = cards2.shift();
          await game.delayx();
          const { bool } = await winner.chooseUseTarget(true, card, false).set("filterTarget", function(card2, player2, target2) {
            let evt = _status.event;
            if (_status.event.name == "chooseTarget") {
              evt = evt.getParent();
            }
            if (!evt.dcxiujue_target.includes(target2)) {
              return false;
            }
            return lib.filter.targetEnabledx(card2, player2, target2);
          }).set("dcxiujue_target", [player, target]).forResult();
          if (!bool) {
            break;
          }
        }
      } else {
        await game.asyncDraw([player, target]);
      }
    },
    ai: {
      order: 6.5,
      result: {
        target(player, target) {
          const hs = player.getCards("h").sort((a, b) => {
            return get.number(b) - get.number(a);
          });
          const ts = target.getCards("h").sort((a, b) => {
            return get.number(b) - get.number(a);
          });
          if (!hs.length || !ts.length) {
            return 0;
          }
          if (get.number(hs[0]) > get.number(ts[0]) || get.number(hs[0]) - ts.length >= 9 + Math.min(2, player.hp / 2)) {
            return get.sgnAttitude(player, target);
          }
          return 0;
        }
      }
    }
  },
  //复爵裴秀
  fjzhitu: {
    audio: 2,
    trigger: {
      player: "useCard2"
    },
    filter(event, player) {
      const { card, targets } = event;
      if (!["basic", "trick"].includes(get.type(card)) || lib.skill.xunshi.isXunshi(card)) {
        return false;
      }
      const info = get.info(card);
      if (info.allowMultiple == false) {
        return false;
      }
      if (targets && targets.length == 1) {
        return game.hasPlayer((current) => !targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && (get.distance(player, current) == get.distance(player, targets[0]) || get.distance(player, current) <= 1 && targets.includes(player)));
      }
      return false;
    },
    async cost(event, trigger, player) {
      const { card, targets } = trigger;
      const prompt2 = `为${get.translation(card)}增加任意个你与其距离为${!targets.includes(player) ? get.distance(player, targets[0]) : 1}的目标`;
      event.result = await player.chooseTarget(
        get.prompt(event.skill),
        (card2, player2, target) => {
          const { card: cardx, targets: targets2 } = get.event();
          return !targets2.includes(target) && lib.filter.targetEnabled2(cardx, player2, target) && (get.distance(player2, target) == get.distance(player2, targets2[0]) || get.distance(player2, target) <= 1 && targets2.includes(player2));
        },
        [1, Infinity]
      ).set("prompt2", prompt2).set("ai", (target) => {
        const { card: card2, player: player2 } = get.event();
        return get.effect(target, card2, player2, player2);
      }).set("card", card).set("targets", targets).forResult();
    },
    async content(event, trigger, player) {
      trigger.targets.addArray(event.targets);
      game.log(event.targets, "也成为了", trigger.card, "的目标");
    }
  },
  dcfujue: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return true;
    },
    manualConfirm: true,
    async content(event, trigger, player) {
      const num = player.countCards("h") - 5;
      if (num > 0) {
        await player.chooseToDiscard({ position: "h", selectCard: num, forced: true, allowChooseAll: true });
      } else if (num < 0) {
        await player.draw({ num: -num });
      }
      if (player.canMoveCard()) {
        await player.moveCard();
      }
      const lose = player.hasHistory("lose", (evt) => evt.getParent(3) == event);
      const bool1 = lose && player.hasHistory("gain", (evt) => evt.getParent(2) == event);
      const bool2 = game.getGlobalHistory("everything", (evt) => evt.name == "equip" && evt.player == player && evt.getParent(2) == event).length && lose;
      if (bool1 || bool2) {
        player.addTempSkill(event.name + "_effect");
        player.addMark(event.name + "_effect", 1, false);
        player.addTempSkill(event.name + "_effect2");
      }
    },
    ai: {
      expose: 0.2,
      order(item, player) {
        if (player.countCards("he") > 4) {
          return 0.5;
        }
        return 9;
      },
      result: {
        player: 1
      }
    },
    subSkill: {
      effect2: {
        charlotte: true,
        mark: true,
        forced: true,
        trigger: { player: "useCard" },
        intro: { content: "使用下一张牌不可被响应" },
        async content(event, trigger, player) {
          player.removeSkill(event.name);
          trigger.directHit.addArray(game.players);
          game.log(trigger.card, "不可被响应");
        }
      },
      effect: {
        charlotte: true,
        onremove: true,
        intro: {
          content: `本回合计算与其他角色的距离-#`
        },
        mod: {
          globalFrom(from, to, current) {
            return current - from.countMark("dcfujue_effect");
          }
        }
      }
    }
  },
  //传械马钧
  chuanxie: {
    trigger: { global: "useCard" },
    filter(event, player) {
      return player.getStorage("chuanxie")[0] === get.suit(event.card);
    },
    forced: true,
    async content(event, trigger, player) {
      const [suit, current, gain] = Array.from({ length: 3 }).map((_, num) => player.getStorage("chuanxie")[num]);
      player.unmarkAuto("chuanxie", [suit]);
      player.markAuto("chuanxie", [suit]);
      player.popup(current);
      game.log(player, "将", "#g【传械】", "的首个花色改为了", "#y" + get.translation(current));
      const card = get.cardPile2((card2) => get.suit(card2) === gain);
      if (gain) {
        player.gain(card, "gain2");
      }
    },
    mod: {
      aiOrder(player, card, num) {
        if (get.suit(card) === player.getStorage("chuanxie")[0]) {
          return num + 10;
        }
      }
    },
    group: "chuanxie_init",
    subSkill: {
      init: {
        audio: "chuanxie",
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        filter(event, player) {
          return event.name !== "phase" || game.phaseNumber === 0;
        },
        forced: true,
        async content(event, trigger, player) {
          let suits = ["spade", "heart", "diamond", "club"];
          const result = await player.chooseButton(
            [
              '###传械：请选择一个花色###<div class="text center">传械花色顺序：' + suits.slice().map((suit) => get.translation(suit)).join("|") + "</div>",
              [suits.map((i) => ["", "", "lukai_" + i]), "vcard"]
            ],
            true
          ).set("ai", () => 1 + Math.random()).forResult();
          if (result.bool) {
            const suitx = result.links[0][2].slice("lukai_".length);
            player.popup(suitx);
            game.log(player, "将", "#g【传械】", "的首个花色改为了", "#y" + get.translation(suitx));
            while (suits[0] !== suitx) {
              const suit = suits[0];
              suits.remove(suit);
              suits.push(suit);
            }
            player.markAuto("chuanxie", suits);
          }
        }
      }
    },
    intro: {
      markcount: (suits) => get.translation(suits[0]),
      content: (suits) => "当前顺序：" + suits.map((suit) => get.translation(suit)).join("|")
    }
  },
  yjqiaosi: {
    trigger: {
      source: "damageSource",
      player: "damageEnd"
    },
    filter(event, player) {
      return player.getStorage("chuanxie").length > 2;
    },
    usable: 1,
    async cost(event, trigger, player) {
      const result = await player.chooseButton([get.prompt2(event.skill), [[3, 1].map((i) => ["", "", "lukai_" + player.getStorage("chuanxie")[i]]), "vcard"]]).set("ai", () => 1 + Math.random()).forResult();
      if (result.bool) {
        result.cost_data = result.links[0][2].slice("lukai_".length);
      }
      event.result = result;
    },
    async content(event, trigger, player) {
      player.popup(event.cost_data);
      game.log(player, "将", "#g【传械】", "的首个花色改为了", "#y" + get.translation(event.cost_data));
      while (player.getStorage("chuanxie").indexOf(event.cost_data) !== 0) {
        const suit = player.getStorage("chuanxie")[0];
        player.unmarkAuto("chuanxie", [suit]);
        player.markAuto("chuanxie", [suit]);
      }
    },
    ai: { combo: "chuanxie" }
  },
  //奇巧马钧
  yuliao: {
    trigger: { global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"] },
    filter(event, player) {
      if (player.hasSkill("yuliao_used") || player.getExpansions("yuliao").length >= 8) {
        return false;
      }
      return event.getd()?.someInD("od");
    },
    async cost(event, trigger, player) {
      const result = await player.chooseButton(["###" + get.prompt(event.skill) + '###<div class="text center">将其中一张牌置于武将牌上', trigger.getd().filterInD("od")]).set("ai", (button) => get.value(button.link)).forResult();
      if (result.bool) {
        result.cards = result.links;
      }
      event.result = result;
    },
    async content(event, trigger, player) {
      player.addTempSkill("yuliao_used", ["phaseBefore", "phaseChange", "phaseAfter"]);
      const next = player.addToExpansion(event.cards, "gain2");
      next.gaintag.add("yuliao");
      await next;
    },
    marktext: "材",
    intro: {
      name2: "材",
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill) {
      var cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    group: "yuliao_dying",
    subSkill: {
      used: { charlotte: true },
      dying: {
        audio: "yuliao",
        trigger: { player: "dying" },
        filter(event, player) {
          return player.getExpansions("yuliao").length > 0;
        },
        prompt2(event, player) {
          const cards2 = player.getExpansions("yuliao");
          return "将" + get.translation(cards2) + "置入弃牌堆，然后摸" + get.cnNumber(cards2.length) + "张牌";
        },
        async content(event, trigger, player) {
          const cards2 = player.getExpansions("yuliao");
          await player.loseToDiscardpile({ cards: cards2 });
          await player.draw(cards2.length);
        }
      }
    }
  },
  qiqiao: {
    enable: "phaseUse",
    filter(event, player) {
      if (player.getExpansions("yuliao").filter((card) => ["basic", "trick", "equip"].includes(get.type2(card))).length < 2) {
        return false;
      }
      return game.hasPlayer((target) => lib.skill.qiqiao.filterTarget(null, player, target));
    },
    filterTarget(card, player, target) {
      return target.getVCards("e").length;
    },
    chooseButton: {
      dialog(event, player) {
        const [target] = event.result.targets;
        const dialog = ui.create.dialog("奇巧：请选择" + get.translation(target) + "装备区的一张牌和你要移去的“材”");
        dialog.add('<div class="text center">' + get.translation(target) + "的装备区</div>");
        dialog.add([target.getVCards("e"), "vcard"]);
        dialog.add('<div class="text center">你的“材”</div>');
        dialog.add(player.getExpansions("yuliao"));
        return dialog;
      },
      filter(button, player) {
        const bool = Boolean(ui.selected.buttons.length);
        if (bool !== player.getExpansions("yuliao").includes(button.link)) {
          return false;
        }
        return !bool || ["basic", "trick", "equip"].includes(get.type2(button.link));
      },
      check(button) {
        const player = get.player(), [target] = get.event().getParent().result.targets;
        return 114514 + get.attitude(player, target) * get.value(button.link.cards || [], target);
      },
      select: 3,
      backup(links, player) {
        return {
          audio: "qiqiao",
          target: get.event().result.targets[0],
          filterTarget(card, player2, target) {
            return target === lib.skill.qiqiao_backup.target;
          },
          delay: 0,
          effect: links,
          selectTarget: -1,
          async content(event, trigger, player2) {
            const [card, ...lose] = lib.skill.qiqiao_backup.effect;
            await player2.loseToDiscardpile(lose);
            const target = event.target, types = lose.slice().map((i) => get.type2(i)), typeList = ["basic", "trick", "equip"];
            target.addSkill("qiqiao_effect");
            const listx = target.storage["qiqiao_effect"].find((list) => list[0] === card);
            if (listx) {
              for (let i = 0; i < typeList.length; i++) {
                if (types.includes(typeList[i])) {
                  listx[1][i] += lose.filter((j) => get.type2(j) === typeList[i]).length;
                }
              }
            } else {
              let list = [0, 0, 0];
              for (let i = 0; i < typeList.length; i++) {
                if (types.includes(typeList[i])) {
                  list[i] += lose.filter((j) => get.type2(j) === typeList[i]).length;
                }
              }
              target.storage["qiqiao_effect"].push([card, list]);
            }
            target.markSkill("qiqiao_effect");
          }
        };
      },
      prompt(links) {
        const [card, ...lose] = links, str = get.translation(get.event().result.targets[0]);
        return "###奇巧：令" + str + "直到" + get.translation(card) + '离开装备区前###<span class="text left">' + [
          ["basic", "使用【杀】的次数上限+1"],
          ["trick", "使用锦囊牌不可被响应"],
          ["equip", get.translation(card) + "离开装备区后摸两张牌"]
        ].filter((list) => {
          return lose.map((i) => get.type2(i)).includes(list[0]);
        }).map((list) => "※" + list[1]) + "</span>";
      }
    },
    ai: {
      combo: "yuliao",
      order: 10,
      result: {
        player(player, target) {
          if (target.hasSkill("qiqiao_effect")) {
            return 0;
          }
          return get.attitude(player, target) * Math.max(0, ...target.getVCards("e").map((card) => (card.cards || []).reduce((sum, i) => sum + get.value(i))));
        }
      }
    },
    subSkill: {
      backup: {},
      effect: {
        charlotte: true,
        onremove: true,
        init: (player, skill) => player.storage[skill] = player.storage[skill] || [],
        intro: {
          content(storage) {
            return storage.map((map) => {
              const [card, list] = map;
              return "※" + get.translation(card) + "离开装备区前：<br>" + [
                [list[0], "使用【杀】的次数上限+" + list[0]],
                [list[1], "使用锦囊牌不可被响应"],
                [list[2], get.translation(card) + "离开装备区后摸" + get.cnNumber(list[2] * 2) + "张牌"]
              ].filter((listx) => listx[0] > 0).map((listx) => "<li>" + listx[1]).join("<br>");
            }).join("<br>");
          }
        },
        audio: "qiqiao",
        trigger: {
          player: ["useCard", "loseAfter"],
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          const storage = player.storage["qiqiao_effect"];
          if (!storage?.length) {
            return false;
          }
          if (event.name === "useCard") {
            return get.type2(event.card) === "trick" && storage.some((list) => list[1][1] > 0);
          }
          const evt = event.getl(player);
          return evt?.es?.some((card) => storage.some((list) => evt.vcard_map.get(card)?.cardid === list[0].cardid));
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          if (trigger.name === "useCard") {
            player.logSkill(event.name);
            game.log(trigger.card, "不可被响应");
            trigger.directHit.addArray(game.players);
          } else {
            const storage = player.storage[event.name], evt = trigger.getl(player);
            const lists = storage.filter((list) => evt.es.some((card) => evt.vcard_map.get(card)?.cardid === list[0].cardid));
            const sum = lists.reduce((sum2, list) => sum2 + list[1][2] * 2, 0);
            if (sum > 0) {
              player.logSkill(event.name);
              await player.draw(sum);
            }
            player.unmarkAuto(event.name, lists);
            if (!player.storage[event.name].length) {
              player.removeSkill(event.name);
            }
          }
        },
        mod: {
          cardUsable(card, player, num) {
            if (card.name === "sha") {
              return num += player.storage["qiqiao_effect"].reduce((sum, list) => sum + list[1][0], 0);
            }
          }
        },
        ai: {
          directHit_ai: true,
          skillTagFilter(player, tag, arg) {
            const storage = player.storage["qiqiao_effect"];
            return arg?.card && get.type2(arg.card) === "trick" && storage?.some((list) => list[1][1] > 0);
          }
        }
      }
    }
  },
  yanxie: {
    enable: "phaseUse",
    filter(event, player) {
      const cards2 = player.getExpansions("yuliao").map((i) => get.type2(i));
      return cards2.length > 1 && cards2.length !== cards2.unique().length;
    },
    chooseButton: {
      dialog(event, player) {
        const [target] = event.result.targets;
        const dialog = ui.create.dialog("研械：请选择要重铸的“料”");
        dialog.add(player.getExpansions("yuliao"));
        return dialog;
      },
      filter(button) {
        return !ui.selected.buttons.length || get.type2(button.link) === get.type2(ui.selected.buttons[0].link);
      },
      check(button) {
        return 1 + Math.random();
      },
      select: 2,
      backup(links, player) {
        return {
          audio: "yanxie",
          delay: 0,
          effect: links,
          async content(event, trigger, player2) {
            const cards2 = lib.skill.yanxie_backup.effect;
            await player2.loseToDiscardpile(cards2);
            await player2.draw(cards2.length);
            const card = get.cardPile2((card2) => get.type(card2) === "equip", "random");
            if (card) {
              await player2.gain(card, "gain2");
            }
          }
        };
      },
      prompt(links) {
        return '###研械###<div class="text center">重铸' + get.translation(links) + "，从牌堆中获得一张装备牌</div>";
      }
    },
    ai: {
      combo: "yuliao",
      order: 7,
      result: { player: 1 }
    },
    group: "yanxie_zhijian",
    subSkill: {
      backup: {},
      zhijian: {
        audio: "yanxie",
        inherit: "zhijian",
        prompt: "将一张装备牌置入一名其他角色的装备区",
        async content(event, trigger, player) {
          event.target.equip(event.cards[0]);
        },
        filter(event, player) {
          return player.hasCards("he", { type: "equip" });
        },
        position: "he"
      }
    }
  },
  //星董卓
  xiongjin: {
    audio: 2,
    trigger: { global: "phaseUseBegin" },
    filter(event, player) {
      return !player.getStorage("xiongjin_used").includes((event.player === player).toString());
    },
    logTarget: "player",
    prompt2(event, player) {
      const goon = event.player === player;
      return (goon ? "" : "令其") + "摸" + get.cnNumber(Math.min(4, Math.max(1, player.getDamagedHp()))) + "张牌，本回合的弃牌阶段开始时，" + (goon ? "弃置所有非基本牌" : "其弃置所有基本牌");
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      const goon = target === player;
      player.addTempSkill("xiongjin_used", "roundStart");
      player.markAuto("xiongjin_used", [goon.toString()]);
      player.addTempSkill("xiongjin_effect");
      player.storage.xiongjin_effect_target ??= [];
      player.storage.xiongjin_effect_target.add(target);
      target.markAuto("xiongjin_effect", [goon ? "nobasic" : "basic"]);
      target.draw(Math.min(4, Math.max(1, player.getDamagedHp())));
      if (target != player) {
        player.addExpose(0.2);
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      },
      effect: {
        charlotte: true,
        onremove(player, skill) {
          player.storage.xiongjin_effect_target.forEach((target) => {
            target.unmarkAuto(skill, target.storage[skill]);
          });
          delete player.storage.xiongjin_effect_target;
        },
        intro: {
          markcount: () => 0,
          content(storage) {
            if (storage.length > 1) {
              return "弃牌阶段开始时，弃置所有牌";
            }
            return "弃牌阶段开始时，弃置所有" + (storage[0] === "basic" ? "基本" : "非基本") + "牌";
          }
        },
        trigger: { global: "phaseDiscardBegin" },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const targets = player.storage.xiongjin_effect_target;
          if (targets?.length) {
            for (const target of targets.sortBySeat()) {
              const storage = target.getStorage("xiongjin_effect");
              const cards2 = target.getCards("he", (card) => {
                if (!lib.filter.cardDiscardable(card, target)) {
                  return false;
                }
                const type = get.type(card);
                return type === "basic" && storage.includes("basic") || type !== "basic" && storage.includes("nobasic");
              });
              if (cards2.length) {
                target.discard(cards2);
              }
            }
          }
        }
      }
    }
  },
  zhenbian: {
    audio: 2,
    trigger: { global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter"] },
    filter(event, player) {
      if (event.name.indexOf("lose") === 0) {
        if (event.getlx === false || event.position !== ui.discardPile) {
          return false;
        }
      } else if (event.getParent()?.relatedEvent?.name == "useCard") {
        return false;
      }
      return event.cards.length;
    },
    forced: true,
    async content(event, trigger, player) {
      if (trigger.cards.some((card) => !player.getStorage("zhenbian").includes(get.suit(card, false)))) {
        player.markAuto(
          "zhenbian",
          trigger.cards.reduce((list, card) => list.add(get.suit(card, false)), [])
        );
        player.storage.zhenbian.sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
        player.addTip("zhenbian", get.translation("zhenbian") + player.getStorage("zhenbian").reduce((str, suit) => str + get.translation(suit), ""));
      }
      if (player.getStorage("zhenbian").length >= 4 && player.maxHp < 8) {
        player.unmarkSkill("zhenbian");
        await player.gainMaxHp();
        await player.draw();
      }
    },
    intro: {
      content: "已记录花色$",
      onunmark(storage, player) {
        delete player.storage.zhenbian;
        player.removeTip("zhenbian");
      }
    },
    mod: { maxHandcardBase: (player) => player.maxHp },
    onremove: (player, skill) => player.removeTip(skill)
  },
  baoxi: {
    audio: 2,
    group: ["baoxi_juedou", "baoxi_sha"],
    //同时机沟槽技能改个翻译方便区分
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      },
      backup: {
        filterCard: (card) => get.itemtype(card) === "card",
        filterTarget: lib.filter.targetEnabled,
        check(card) {
          const player = get.player();
          if (player.maxHp <= 1) {
            return 0;
          }
          return player.getUseValue(get.autoViewAs(get.info("baoxi_backup").viewAs, [card]), false) - get.value(card);
        },
        log: false,
        async precontent(event, trigger, player) {
          player.logSkill("baoxi");
          player.loseMaxHp();
          player.addTempSkill("baoxi_used", "roundStart");
          player.markAuto("baoxi_used", [event.result.card.name]);
        }
      },
      juedou: {
        trigger: { global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter"] },
        filter(event, player) {
          if (player.getStorage("baoxi_used").includes("juedou")) {
            return false;
          }
          if (event.name.indexOf("lose") === 0 && (event.getlx === false || event.position !== ui.discardPile)) {
            return false;
          }
          return event.cards.filter((card) => get.type(card) === "basic").length > 1 && player.hasCard((card) => {
            return _status.connectMode || player.hasUseTarget(get.autoViewAs({ name: "juedou" }, [card]), false);
          }, "h");
        },
        direct: true,
        async content(event, trigger, player) {
          game.broadcastAll(() => lib.skill.baoxi_backup.viewAs = { name: "juedou" });
          const next = player.chooseToUse();
          next.set("openskilldialog", "暴袭：是否将一张手牌当作【决斗】使用？");
          next.set("norestore", true);
          next.set("_backupevent", "baoxi_backup");
          next.set("custom", {
            add: {},
            replace: { window: function() {
            } }
          });
          next.backup("baoxi_backup");
          next.set("addCount", false);
        }
      },
      sha: {
        trigger: { global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter"] },
        filter(event, player) {
          if (player.getStorage("baoxi_used").includes("sha")) {
            return false;
          }
          if (event.name.indexOf("lose") === 0 && (event.getlx === false || event.position !== ui.discardPile)) {
            return false;
          }
          return event.cards.filter((card) => get.type(card) !== "basic").length > 1 && player.hasCard((card) => {
            return _status.connectMode || player.hasUseTarget(get.autoViewAs({ name: "sha" }, [card]), false);
          }, "h");
        },
        direct: true,
        async content(event, trigger, player) {
          game.broadcastAll(() => lib.skill.baoxi_backup.viewAs = { name: "sha" });
          const next = player.chooseToUse();
          next.set("openskilldialog", "暴袭：是否将一张手牌当作【杀】使用？");
          next.set("norestore", true);
          next.set("_backupevent", "baoxi_backup");
          next.set("custom", {
            add: {},
            replace: { window: function() {
            } }
          });
          next.backup("baoxi_backup");
          next.set("addCount", false);
        }
      }
    }
  },
  //向秀
  mpmiaoxi: {
    audio: 2,
    enable: "phaseUse",
    usable(skill, player) {
      return 1 + (player.hasSkill(skill + "_rewrite", null, null, false) ? 1 : 0);
    },
    filterCard: true,
    position: "h",
    filterTarget(card, player, target) {
      return target.countCards("h") && target != player;
    },
    discard: false,
    lose: false,
    delay: false,
    async content(event, trigger, player) {
      const target = event.target;
      const carda = event.cards[0];
      const result = await player.choosePlayerCard(target, "h", true).forResult();
      if (result.bool) {
        const cardb = result.cards[0];
        player.$throw(carda);
        target.$throw(cardb);
        game.log(player, "展示了", player, "的", carda, "和", target, "的", cardb);
        await player.showCards([carda, cardb], get.translation(player) + "发动了【妙析】");
        if (get.color(carda) == get.color(cardb)) {
          await player.gain(cardb, "gain2");
        }
        if (get.suit(carda) == get.suit(cardb)) {
          await target.loseHp();
        }
        if (get.number(carda) == get.number(cardb) && !player.hasSkill("mpmiaoxi_rewrite", null, null, false)) {
          player.addTempSkill("mpmiaoxi_rewrite");
        }
      }
    },
    ai: {
      order: 5,
      result: {
        target: -1
      }
    },
    subSkill: { rewrite: { charlotte: true } }
  },
  mpsijiu: {
    audio: 2,
    trigger: {
      player: "phaseEnd"
    },
    filter(event, player) {
      return game.hasPlayer((current) => {
        if (current == player) {
          return false;
        }
        return current.getHistory("lose", (evt) => {
          let evtx = evt.getParent();
          if (!evtx.getg) {
            return false;
          }
          var cards2 = evtx.getg(player);
          if (!cards2.length) {
            return false;
          }
          var cards22 = evt.cards2;
          for (var card of cards22) {
            if (cards2.includes(card)) {
              return true;
            }
          }
          return false;
        }).length > 0;
      });
    },
    frequent: true,
    async content(event, trigger, player) {
      await player.draw();
      const result = await player.chooseTarget("是否观看一名角色的手牌？", function(card, player2, target) {
        return target != player2 && target.countCards("h");
      }).set("ai", (target) => {
        return 11 - get.attitude(get.player(), target);
      }).forResult();
      if (result.bool) {
        const target = result.targets[0];
        await player.viewHandcards(target);
      }
    }
  },
  //马钧
  gongqiao: {
    createCard(type) {
      if (!_status.postReconnect.gongqiao) {
        _status.postReconnect.gongqiao = [
          function(list) {
            for (const type2 of list) {
              lib.skill.gongqiao.createCard(type2);
            }
          },
          []
        ];
      }
      _status.postReconnect.gongqiao[1].add(type);
      if (!lib.card[`gongqiao_${type}`]) {
        lib.translate[`gongqiao_${type}`] = "工巧";
        const card = {
          derivation: "yj_majun",
          fullskin: true,
          image: "image/card/majun_gongqiao.png",
          type,
          ai: { basic: { equipValue: 2 } },
          originalType: type,
          cardPrompt(card2) {
            let str = `原本是一张${get.translation(this.originalType)}牌。`, subtypes = get.subtypes(card2);
            if (subtypes?.length) {
              str = `${str.slice(0, -1)}，被置入了${subtypes.map((i) => `${get.translation(i)}栏`).join("、")}。`;
            }
            return str;
          },
          async onLose(event, trigger, player) {
            event.cards.forEach((card2) => {
              card2.fix();
              ui.discardPile.appendChild(card2);
              game.log(card2, "被置入了弃牌堆");
            });
            if (event.getParent(2).name == "gain") {
              const remove = event.getParent(2).cards.filter((card2) => card2[card2.cardSymbol] == event.card);
              event.getParent(2).cards.removeArray(remove);
            }
          }
        };
        lib.translate[`gongqiao_${type}_info`] = `原本是一张${get.translation(type)}牌。`;
        lib.card[`gongqiao_${type}`] = card;
        game.finishCard(`gongqiao_${type}`);
      }
    },
    video(player, info) {
      for (const type of info[0]) {
        lib.skill.gongqiao.createCard(type);
      }
    },
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    locked: false,
    filter(event, player) {
      if (!player.countCards("h")) {
        return false;
      }
      for (let i = 0; i <= 5; i++) {
        if (player.hasEquipableSlot(i)) {
          return true;
        }
      }
      return false;
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("###工巧###你可将一张手牌置于你的任意装备栏内（可替换原装备牌）");
      },
      chooseControl(event, player) {
        const choices = [];
        for (let i = 0; i <= 5; i++) {
          if (player.hasEquipableSlot(i)) {
            choices.push(`equip${i}`);
          }
        }
        choices.push("cancel2");
        return choices;
      },
      check() {
        const player = get.player(), num = [5, 3, 4, 1, 2].find((index) => player.hasEmptySlot(index));
        if (num) {
          return `equip${num}`;
        }
        return "cancel2";
      },
      backup(result, player) {
        return {
          audio: "gongqiao",
          slot: result.control,
          filterCard: true,
          position: "h",
          discard: false,
          lose: false,
          delay: false,
          prepare: "throw",
          async content(event, trigger, player2) {
            const type = get.type2(event.cards[0]);
            const list = [type];
            game.addVideo("skill", player2, ["gongqiao", [list]]);
            game.broadcastAll(
              (player3, list2) => {
                for (const type2 of list2) {
                  lib.skill.gongqiao.createCard(type2);
                }
              },
              player2,
              list
            );
            const card = get.autoViewAs({ name: `gongqiao_${type}` }, event.cards);
            card.subtypes = [lib.skill.gongqiao_backup.slot];
            await player2.equip(card);
          },
          ai1(card) {
            const player2 = get.player();
            if (player2.hasCard((cardx) => {
              return get.type2(cardx, false) === get.type2(card, false);
            }, "e")) {
              return 7 - get.value(card);
            }
            return 15 - get.value(card);
          },
          ai2: () => 1
        };
      },
      prompt(result, player) {
        return `选择一张手牌置入${get.translation(result.control)}栏`;
      }
    },
    mod: {
      maxHandcard(player, num) {
        if (player.hasCard((card) => {
          return get.type2(card, false) === "equip";
        }, "e")) {
          return num + 3;
        }
      }
    },
    ai: {
      order: 10,
      result: {
        player: 1
      }
    },
    group: ["gongqiao_basic", "gongqiao_trick"],
    subSkill: {
      backup: {},
      basic: {
        trigger: { player: "useCard1" },
        forced: true,
        popup: false,
        filter(event, player) {
          return get.type2(event.card, false) === "basic" && player.hasCard((card) => {
            return get.type2(card, false) === "basic";
          }, "e");
        },
        async content(event, trigger, player) {
          trigger.baseDamage++;
          game.log(player, "使用的", trigger.card, "牌面数值+1");
        }
      },
      trick: {
        audio: "gongqiao",
        trigger: { player: "useCardAfter" },
        forced: true,
        filter(event, player) {
          const type = get.type2(event.card, false);
          if (player.hasHistory(
            "useCard",
            (evt) => {
              return evt !== event && get.type2(evt.card, false) === type;
            },
            event
          )) {
            return false;
          }
          return player.hasCard((card) => {
            return get.type2(card, false) === "trick";
          }, "e");
        },
        async content(event, trigger, player) {
          await player.draw();
        }
      }
    }
  },
  jingyi: {
    audio: 2,
    trigger: { player: "equipAfter" },
    forced: true,
    filter(event, player, name, card) {
      const subtypes = get.subtypes(card);
      return !player.getStorage("jingyi_used").some((i) => subtypes.includes(i));
    },
    getIndex(event, player) {
      return event.cards ?? [];
    },
    async content(event, trigger, player) {
      const card = event.indexedData, subtypes = get.subtypes(card);
      player.addTempSkill(event.name + "_used");
      if (subtypes?.length) {
        player.markAuto(event.name + "_used", subtypes);
      }
      const num = player.getCards("e").reduce((sum, card2) => {
        const num2 = card2.viewAs ? card2.cards.length : 1;
        return sum + num2;
      }, 0);
      if (num > 0) {
        await player.draw(num);
      }
      if (player.countCards("he") > 0) {
        await player.chooseToDiscard(2, "he", true);
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  //新谋郭嘉
  xianmou: {
    mark: true,
    marktext: "☯",
    zhuanhuanji(player, skill) {
      player.storage[skill] = !player.storage[skill];
      player.changeSkin({ characterName: "yj_sb_guojia" }, "yj_sb_guojia" + (player.storage[skill] ? "_shadow" : ""));
    },
    intro: {
      content(storage) {
        if (!storage) {
          return "你失去过牌的回合结束时，你可以观看牌堆顶五张牌并获得至多X张牌，若未获得X张牌则获得〖遗计〗直到再发动此项（X为你本回合失去牌数）";
        }
        return "你失去过牌的回合结束时，你可以观看一名角色手牌并弃置其中至多X张牌，若弃置X张牌则你进行一次【闪电】判定（X为你本回合失去牌数）";
      }
    },
    audio: 2,
    audioname: ["yj_sb_guojia_shadow"],
    trigger: {
      global: "phaseEnd"
    },
    filter(event, player) {
      return player.getHistory("lose", (evt) => evt.cards2 && evt.cards2.length).length;
    },
    getNum(player) {
      let num = 0;
      player.getHistory("lose", (evt) => {
        if (evt.cards2) {
          num += evt.cards2.length;
        }
      });
      return num;
    },
    async cost(event, trigger, player) {
      let num = get.info(event.skill)?.getNum(player);
      if (player.storage[event.skill]) {
        event.result = await player.chooseTarget(get.prompt(event.skill), `观看一名角色手牌并弃置其中至多${num}张牌`, function(card, player2, target) {
          return target.countCards("h");
        }).set("ai", function(target) {
          const player2 = _status.event.player;
          return get.effect(target, { name: "guohe_copy2" }, player2, player2);
        }).forResult();
      } else {
        event.result = await player.chooseBool(get.prompt(event.skill), `观看牌堆顶五张牌并获得至多${num}张牌`).forResult();
      }
      event.result.cost_data = num;
    },
    async content(event, trigger, player) {
      let num = event.cost_data;
      player.changeZhuanhuanji(event.name);
      if (player.storage[event.name]) {
        player.addAdditionalSkills(event.name, []);
        let cards2 = game.cardsGotoOrdering(get.cards(5)).cards;
        const result = await player.chooseButton([`是否获得至多${num}张牌？`, cards2], [1, num]).set("ai", function(button) {
          if (ui.selected.buttons.length + 1 >= _status.event.maxNum) {
            return 0;
          }
          return get.value(button.link);
        }).set("maxNum", num).forResult();
        if (result.bool) {
          await player.gain(result.links, "gain2");
          cards2.removeArray(result.links);
        }
        await game.cardsGotoPile(cards2.reverse(), "insert");
        if (!result.bool || result.links.length < num) {
          await player.addAdditionalSkills(event.name, get.info(event.name)?.derivation);
        }
      } else {
        const target = event.targets[0];
        const result = await player.discardPlayerCard(target, "h", `是否弃置${get.translation(target)}至多${num}张牌?`, [1, num], "visible").set("ai", function(button) {
          if (ui.selected.buttons.length + 1 >= _status.event.maxNum) {
            return 5 - get.value(button.link);
          }
          return get.value(button.link);
        }).set("maxNum", num).forResult();
        if (result?.bool && result.links?.length >= num) {
          await player.executeDelayCardEffect("shandian");
        }
      }
    },
    derivation: "new_reyiji",
    group: "xianmou_change",
    subSkill: {
      change: {
        audio: "xianmou",
        audioname: ["yj_sb_guojia_shadow"],
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        filter(event, player) {
          return event.name != "phase" || game.phaseNumber == 0;
        },
        prompt2(event, player) {
          return "切换【先谋】为状态" + (player.storage.xianmou ? "阳" : "阴");
        },
        check: () => Math.random() > 0.5,
        async content(event, trigger, player) {
          player.changeZhuanhuanji("xianmou");
        }
      }
    }
  },
  lunshi: {
    audio: 2,
    audioname: ["yj_sb_guojia_shadow"],
    position: "hs",
    enable: "chooseToUse",
    filter(event, player) {
      if (!player.countCards("hs")) {
        return false;
      }
      if (player.countCards("h", { color: "black" }) != player.countCards("h", { color: "red" })) {
        return false;
      }
      if (event.type != "wuxie") {
        return false;
      }
      let info = event.info_map;
      if (!info || get.type(info.card) != "trick") {
        return false;
      }
      return info.player != info.target;
    },
    filterCard: true,
    viewAs: {
      name: "wuxie"
    },
    viewAsFilter(player) {
      if (!player.countCards("hs")) {
        return false;
      }
      if (player.countCards("h", { color: "black" }) != player.countCards("h", { color: "red" })) {
        return false;
      }
      return true;
    },
    prompt: "将一张手牌当无懈可击使用",
    check(card) {
      return 8 - get.value(card);
    },
    group: "lunshi_nowuxie",
    subSkill: {
      nowuxie: {
        trigger: {
          player: "useCard"
        },
        forced: true,
        locked: false,
        popup: false,
        filter(event, player) {
          return event.card.name == "wuxie" && event.skill == "lunshi";
        },
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.players);
        }
      }
    }
  },
  //荀彧荀攸 - 想你了
  zhinang: {
    getMap() {
      if (!_status.zhinang_map) {
        _status.zhinang_map = {
          name: {},
          info: {}
        };
        let list;
        if (_status.connectMode) {
          list = get.charactersOL();
        } else {
          list = get.gainableCharacters();
        }
        list.forEach((name) => {
          if (name !== "xunyuxunyou") {
            const skills2 = get.character(name, 3);
            skills2.forEach((skill) => {
              const info = get.info(skill);
              if (!info || info.ai && info.ai.combo) {
                return;
              }
              if (skill in _status.zhinang_map) {
                return;
              }
              if (get.translation(skill).includes("谋")) {
                _status.zhinang_map.name[skill] = name;
              }
              const voices2 = get.Audio.skill({ skill, name }).textList;
              if (voices2.some((data) => data.includes("谋"))) {
                _status.zhinang_map.info[skill] = name;
              }
            });
          }
        });
      }
      return _status.zhinang_map;
    },
    trigger: {
      player: "useCardAfter"
    },
    filter(event, player) {
      return ["trick", "equip"].includes(get.type2(event.card));
    },
    prompt2(event, player) {
      const type = get.type2(event.card), name = `zhinang_${type}`, skills2 = player.getRemovableAdditionalSkills(name);
      let str = `获得一个技能${type == "trick" ? "台词" : "名"}包含“谋”的技能`;
      if (skills2.length) {
        str = `失去${skills2.map((skill) => `【${get.translation(skill)}】`)}并${str}`;
      }
      return str;
    },
    keepSkill: true,
    async content(event, trigger, player) {
      const map = lib.skill.zhinang.getMap(), type = get.type2(trigger.card) == "equip" ? "name" : "info", list = Object.keys(map[type]);
      if (list.length > 0) {
        const skill = list.randomGet(), voiceMap = get.Audio.skill({ skill, player: map[type][skill] }).audioList;
        if (type == "info") {
          findaudio: for (let data of voiceMap) {
            if (!data.text) {
              continue;
            }
            if (data.text.includes("谋")) {
              player.chat(data.text);
              game.broadcastAll((file) => game.playAudio(file), data.file);
              break findaudio;
            }
          }
        } else {
          player.flashAvatar("zhinang", map[type][skill]);
        }
        await player.addAdditionalSkills(`zhinang_${get.type2(trigger.card)}`, skill);
      }
    },
    init(player, skill) {
      player.addSkill(["zhinang_equip", "zhinang_trick"]);
    },
    onremove(player, skill) {
      player.removeSkill(["zhinang_equip", "zhinang_trick"]);
    },
    subSkill: {
      equip: {},
      trick: {}
    }
  },
  gouzhu: {
    trigger: {
      player: "changeSkillsAfter"
    },
    filter(_1, player, _3, skill) {
      let list = get.skillCategoriesOf(skill, player);
      return list.length && list.some((item) => item in lib.skill.gouzhu.effectMap);
    },
    getIndex(event, player) {
      if (!event.removeSkill.length) {
        return false;
      }
      return event.removeSkill;
    },
    prompt(_1, _2, _3, skill) {
      return `失去了技能【${get.translation(skill)}】，是否发动【苟渚】？`;
    },
    frequent: true,
    effectMap: {
      锁定技: async function() {
        let player = _status.event.player;
        if (player.isDamaged()) {
          await player.recover();
        }
      },
      觉醒技: async function() {
        let player = _status.event.player;
        let card = get.cardPile((card2) => get.type(card2) == "basic");
        if (card) {
          await player.gain(card, "gain2");
        }
      },
      限定技: async function() {
        let player = _status.event.player;
        let target = game.filterPlayer((current) => current != player).randomGet();
        if (target) {
          player.line(target, "green");
          await target.damage(player);
        }
      },
      转换技: async function() {
        let player = _status.event.player;
        player.addMark("gouzhu", 1, false);
        game.log(player, "手牌上限+1");
        await game.delay();
      },
      主公技: async function() {
        let player = _status.event.player;
        await player.gainMaxHp();
      }
    },
    mod: {
      maxHandcard(player, num) {
        return num + player.countMark("gouzhu");
      }
    },
    intro: {
      content: "手牌上限+#"
    },
    locked: false,
    onremove: true,
    async content(event, trigger, player) {
      let skill = event.indexedData;
      let list = get.skillCategoriesOf(skill, player);
      for (const item of list) {
        if (item in lib.skill.gouzhu.effectMap) {
          const next = game.createEvent("gouzhu_effect", false);
          next.player = player;
          next.setContent(lib.skill.gouzhu.effectMap[item]);
          await next;
        }
      }
    }
  },
  //一将2024
  //令狐愚
  xvzhi: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return game.countPlayer((target) => {
        return lib.skill.xvzhi.filterTarget(null, player, target);
      }) > 1;
    },
    filterTarget(card, player, target) {
      const stat = player.getStat("xvzhi");
      return target.countCards("h") && (!stat || !stat.includes(target));
    },
    selectTarget: 2,
    usable: 1,
    multiline: true,
    multitarget: true,
    async content(event, trigger, player) {
      const targets = event.targets;
      if (!player.getStat().xvzhi) {
        player.getStat().xvzhi = [];
      }
      player.getStat().xvzhi.addArray(targets);
      if (targets.some((i) => !i.countCards("h"))) {
        return;
      }
      const next = player.chooseCardOL(targets, "h", true, [1, Infinity], "蓄志：选择任意张手牌并与对方交换", "allowChooseAll").set("ai", (card) => {
        const player2 = get.event().player, target = get.event().getParent(2).targets.find((i) => i != player2);
        const sha = new lib.element.VCard({ name: "sha", isCard: true });
        const playerEffect = player2.hasUseTarget(sha, false) ? Math.max(
          ...game.filterPlayer((current) => player2.canUse(sha, current, false)).map((current) => {
            return get.effect(current, sha, player2, player2);
          })
        ) : 0;
        const targetEffect = target.hasUseTarget(sha, false) ? Math.max(
          ...game.filterPlayer((current) => target.canUse(sha, current, false)).map((current) => {
            return get.effect(current, sha, player2, player2);
          })
        ) : 0;
        return 5 + 2 * get.sgn(playerEffect - targetEffect) - get.value(card);
      });
      next._args.remove("glow_result");
      const result = await next.forResult();
      await targets[0].swapHandcards(targets[1], result[0].cards, result[1].cards);
      if (result[0].cards.length == result[1].cards.length) {
        await player.draw(2);
        player.getStat("skill").xvzhi--;
      } else {
        const aim = targets[result[0].cards.length > result[1].cards.length ? 0 : 1];
        const sha = new lib.element.VCard({ name: "sha", isCard: true });
        if (aim.hasUseTarget(sha, false)) {
          await aim.chooseUseTarget(sha, true, false, "nodistance");
        }
      }
    },
    ai: {
      order: 5,
      result: {
        target(player, target) {
          return get.sgn(get.attitude(player, target)) * target.countCards("h");
        }
      }
    }
  },
  //司马孚
  beiyu: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    manualConfirm: true,
    async content(event, trigger, player) {
      await player.drawTo(player.maxHp);
      if (!player.countCards("h")) {
        return;
      }
      const list = get.addNewRowList(player.getCards("h"), "suit", player);
      const result = await player.chooseButton(
        [
          [
            [[`备预：将一种花色的手牌置于牌堆底`], "addNewRow"],
            [
              (dialog) => {
                dialog.classList.add("fullheight");
                dialog.forcebutton = false;
                dialog._scrollset = false;
              },
              "handle"
            ],
            list.map((item) => [Array.isArray(item) ? item : [item], "addNewRow"])
          ]
        ],
        true
      ).set("filterButton", (button) => {
        return button.links.length > 0;
      }).set("ai", (button) => {
        get.player();
        const { links } = button;
        return Math.max(1, 5 - links.length);
      }).forResult();
      if (result?.links?.length) {
        const [suit] = result.links, cards2 = player.getCards("h", (card) => get.suit(card, player) == suit).randomSort();
        if (cards2.length) {
          game.log(player, "将", cards2, "置于牌堆底");
          await player.lose(cards2, ui.cardPile);
        }
      }
    },
    ai: {
      order(item, player) {
        if (player.maxHp - player.countCards("h") >= 2 && player.countCards("h") <= 2) {
          return 10;
        }
        return 1;
      },
      result: { player: 1 }
    }
  },
  duchi: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    filter(event, player) {
      return event.player != player;
    },
    usable: 1,
    logTarget: "player",
    check(event, player) {
      return get.effect(player, event.card, event.player, player) <= 0;
    },
    async content(event, trigger, player) {
      await player.draw().set("bottom", true);
      if (player.countCards("h")) {
        await player.showHandcards(get.translation(player) + "发动了【督持】");
        const colors = player.getCards("h").reduce((list, card) => list.add(get.color(card)), []);
        if (colors.length == 1) {
          player.popup("洗具");
          trigger.getParent().excluded.add(player);
          return;
        }
      }
      player.popup("杯具");
    },
    ai: { threaten: 0.8 }
  },
  //宣公主
  yjqimei: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const { target } = event;
      await player.draw(2, "nodelay");
      await target.draw(2);
      const targets = [player, target].filter((current) => current.countCards("h") > 1);
      if (targets.length) {
        const next = player.chooseCardOL(targets, "h", true, 2, "齐眉：请展示两张手牌");
        next._args.remove("glow_result");
        const result = await next.forResult();
        const videoId = lib.status.videoId++;
        game.broadcastAll(
          (targets2, result2, id, player2) => {
            const dialog = ui.create.dialog(get.translation(player2) + "发动了【齐眉】");
            dialog.videoId = id;
            for (let i = 0; i < result2.length; i++) {
              dialog.add('<div class="text center">' + get.translation(targets2[i]) + "展示</div>");
              dialog.add(result2[i].cards);
            }
          },
          targets,
          result,
          videoId,
          player
        );
        let cards2 = result.reduce((list, evt) => {
          list.addArray(evt.cards);
          return list;
        }, []);
        await player.showCards(cards2).set("dialog", videoId).set("delay_time", 4).set("multipleShow", true);
        const suits = cards2.reduce((list, card) => list.add(get.suit(card)), []);
        switch (suits.length) {
          case 1:
            while (cards2.length) {
              const card = cards2.shift();
              if (player.hasUseTarget(card)) {
                player.$gain2(card, false);
                await game.delayx();
                await player.chooseUseTarget(true, card, false);
              }
            }
            break;
          case 2:
            for (const current of [player, target]) {
              if (!current.isIn()) {
                continue;
              }
              if (current.isLinked()) {
                await current.link(false);
              }
              if (current.isTurnedOver()) {
                await current.turnOver(false);
              }
            }
            break;
          case 3:
            for (let i = 0; i < result.length; i++) {
              const current = targets[i], cards3 = result[i].cards.filter((card) => {
                return get.owner(card) === current && current.canRecast(card);
              });
              if (cards3.length) {
                await current.recast(cards3);
              }
            }
            break;
          case 4:
            await player.draw("nodelay");
            await target.draw();
            break;
        }
      }
    },
    ai: {
      order: 9,
      result: {
        target: 1
      }
    }
  },
  yjzhuiji: {
    audio: 2,
    trigger: { player: "die" },
    filter(event, player) {
      return game.hasPlayer((target) => {
        return target != player && Array.from({ length: 5 }).map((_, i) => i + 1).some((i) => target.hasEmptySlot(i));
      });
    },
    forceDie: true,
    skillAnimation: true,
    animationColor: "water",
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return target != player2 && Array.from({ length: 5 }).map((_, i) => i + 1).some((i) => target.hasEmptySlot(i));
      }).set("ai", (target) => {
        const player2 = get.event().player;
        return get.sgn(get.attitude(player2, target)) * Array.from({ length: 5 }).map((_, i) => i + 1).reduce((sum, i) => sum + target.countEmptySlot(i), 0);
      }).set("forceDie", true).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      let num = 1, cards2 = [];
      while (num <= 5) {
        while (target.hasEmptySlot(num)) {
          const card = get.cardPile2((card2) => {
            return !cards2.includes(card2) && get.subtype(card2) == "equip" + num && target.canUse(card2, target);
          }, "random");
          if (card) {
            cards2.push(card);
            target.$gain2(card, false);
            await game.delayx();
            await target.chooseUseTarget(card, true, "nopopup");
          } else {
            break;
          }
        }
        num++;
      }
      if (cards2.length) {
        target.addSkill("yjzhuiji_buff");
        target.markAuto("yjzhuiji_buff", cards2);
      }
    },
    subSkill: {
      buff: {
        charlotte: true,
        mod: {
          aiValue(player, card, num) {
            if (player.getStorage("yjzhuiji_buff").includes(card)) {
              return num + 100;
            }
          },
          aiUseful(player, card, num) {
            if (player.getStorage("yjzhuiji_buff").includes(card)) {
              return num / 114514;
            }
          }
        },
        trigger: {
          player: "loseAfter",
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          const evt = event.getl(player);
          return evt && evt.es && evt.es.some((i) => player.getStorage("yjzhuiji_buff").includes(i));
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          const evt = trigger.getl(player);
          const cards2 = evt.es.filter((i) => player.getStorage("yjzhuiji_buff").includes(i));
          player.unmarkAuto("yjzhuiji_buff", cards2);
          for (const card of cards2) {
            player.disableEquip({ slots: [get.subtype(card)] });
          }
        },
        intro: {
          mark(dialog, storage) {
            if (storage && storage.length) {
              dialog.addSmall([storage, "vcard"]);
            } else {
              return "暂无装备";
            }
          }
        }
      }
    }
  },
  //徐琨（菜不菜我不知道）
  fazhu: {
    audio: 3,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return player.hasCard((card) => !get.is.damageCard(card) && player.canRecast(card), "hej");
    },
    async cost(event, trigger, player) {
      event.result = await player.choosePlayerCard(get.prompt(event.name.slice(0, -5)), player, "hej", [1, Infinity], "allowChooseAll").set("ai", (button) => {
        const card = button.link;
        if (get.position(card) == "j") {
          return 10;
        }
        return 6 - get.value(card);
      }).set("filterButton", (button) => {
        const card = button.link, player2 = get.player();
        return !get.is.damageCard(card) && player2.canRecast(card);
      }).forResult();
    },
    async content(event, trigger, player) {
      await player.recast(event.cards);
      const cards2 = player.getHistory("gain", (evt) => evt.getParent(3) == event).reduce((list2, evt) => {
        list2.addArray(evt.cards);
        return list2;
      }, []);
      let num = Math.min(cards2.length, game.countPlayer()), list = [];
      if (!num) {
        return;
      }
      if (_status.connectMode) {
        game.broadcastAll(() => _status.noclearcountdown = true);
      }
      while (num - list.length > 0 && cards2.some((i) => get.owner(i) == player && get.position(i) == "h" && !i.hasGaintag("olsujian_given"))) {
        const result = await player.chooseCardTarget({
          prompt: "筏铸：将以此法获得的牌交给任意角色各一张",
          position: "he",
          animate: false,
          filterCard(card, player2) {
            if (!get.event().cards.includes(card)) {
              return false;
            }
            return !get.event().list.some((list2) => list2[1] == card);
          },
          filterTarget(card, player2, target) {
            return !get.event().list.some((list2) => list2[0] == target);
          },
          ai1(card) {
            if (card.name == "sha") {
              return 2.5;
            }
            return 1 + Math.random();
          },
          ai2(target) {
            return get.attitude(get.event().player, target);
          }
        }).set("forced", !list.length).set("list", list).set("cards", cards2).forResult();
        if (result.bool) {
          list.push([result.targets[0], result.cards[0]]);
          player.addGaintag(result.cards, "olsujian_given");
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
        const targets = list.slice().map((list2) => list2[0]);
        await game.loseAsync({
          gain_list: list,
          player,
          cards: list.slice().flatMap((list2) => list2[1]),
          giver: player,
          animate: "giveAuto"
        }).setContent("gaincardMultiple");
        for (const target of targets) {
          await target.chooseToUse(function(card, player2, event2) {
            if (get.name(card) != "sha") {
              return false;
            }
            return lib.filter.cardEnabled.apply(this, arguments);
          }).set("openskilldialog", "筏铸：是否使用一张【杀】（无距离限制）？").set("norestore", true).set("custom", {
            add: {},
            replace: { window() {
            } }
          }).set("targetRequired", true).set("complexSelect", true).set("filterTarget", function(card, player2, target2) {
            return lib.filter.targetEnabled.apply(this, arguments);
          }).set("addCount", false);
        }
      }
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (!card || get.type(card) != "delay") {
            return;
          }
          if (!get.tag(card, "damage") && target.canRecast(card)) {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  //一将2023
  //孙礼
  kangli: {
    audio: 2,
    trigger: {
      player: "damageEnd",
      source: "damageSource"
    },
    frequent: true,
    async content(event, trigger, player) {
      await player.draw({ num: 2, gaintag: ["kangli"] });
      player.when({ source: "damageBegin1" }).step(async (event2, trigger2, player2) => {
        const cards2 = player2.getCards("h", (card) => card.hasGaintag("kangli") && lib.filter.cardDiscardable(card, player2, "kangli"));
        if (cards2.length) {
          await player2.discard({ cards: cards2 });
        }
      });
    },
    ai: {
      maixie: true
    }
  },
  //夏侯楙
  tongwei: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("he", (card) => lib.skill.tongwei.filterCard(card, player)) > 1 && game.hasPlayer((i) => i !== player);
    },
    filterTarget: lib.filter.notMe,
    filterCard: lib.filter.cardRecastable,
    selectCard: 2,
    position: "he",
    discard: false,
    lose: false,
    delay: false,
    popname: true,
    check(card) {
      let num = 6.5;
      if (ui.selected.cards.length) {
        const cardx = ui.selected.cards[0];
        num = get.number(cardx);
      }
      const del = Math.abs(get.number(card) - num);
      return 5 + del / 5 - get.value(card);
    },
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      await player.recast(cards2);
      const numbers = cards2.map((c) => get.number(c, player)).sort((a, b) => a - b);
      target.when("useCard1").step(async (event2, trigger2, player2) => {
        trigger2._tongwei_checked = true;
      });
      const playerx = player;
      target.when("useCardAfter").assign({
        mod: {
          aiOrder(player2, card, num) {
            const number = get.number(card);
            if (typeof number !== "number" || number < numbers[0] || number > numbers[1]) {
              return num + 10;
            }
          }
        }
      }).filter((event2, player2) => event2._tongwei_checked).step(async (event2, trigger2, player2) => {
        const number = get.number(trigger2.card);
        if (typeof number !== "number" || number < numbers[0] || number > numbers[1]) {
          return;
        }
        const names = ["sha", "guohe"].filter((name2) => playerx.canUse({ name: name2, isCard: true }, player2, false));
        let result;
        if (!names.length) {
          return;
        }
        if (names.length === 1) {
          result = { links: [[null, null, names[0]]] };
        } else {
          const choice = names.map((name2) => [name2, get.effect(player2, { name: name2, isCard: true }, playerx, playerx)]).sort((a, b) => b[1] - a[1])[0][0];
          result = await playerx.chooseButton({
            createDialog: [`请选择要视为对${get.translation(player2)}使用的牌`, [names, "vcard"]],
            forced: true,
            ai(button) {
              return button.link[0][2] === _status.event.choice;
            }
          }).set("choice", choice).forResult();
        }
        const name = result.links[0][2];
        const card = { name, isCard: true };
        if (playerx.canUse(card, player2, false)) {
          await playerx.useCard(card, player2, "tongwei");
        }
      });
    },
    ai: {
      expose: 0.2,
      order: 7,
      threaten: 2.2,
      result: {
        target: -1
      }
    }
  },
  cuguo: {
    audio: 2,
    trigger: { player: ["shaMiss", "eventNeutralized"] },
    filter(event, player) {
      if (event.type != "card" && event.name != "_wuxie") {
        return false;
      }
      if (!event.target || !event.target.isIn() || !player.canUse(
        {
          name: event.card.name,
          nature: event.card.nature,
          isCard: true
        },
        event.target,
        false
      )) {
        return false;
      }
      if (!player.hasCard((card) => lib.filter.cardDiscardable(card, player), "he")) {
        return false;
      }
      const history = game.getGlobalHistory("everything", (evt) => {
        if (evt._neutralized || evt.responded && (!evt.result || !evt.result.bool)) {
          var evtx = evt.getParent();
          return evtx.name == "useCard" && evtx.player == player;
        }
      });
      return history.length == 1;
    },
    locked: true,
    async cost(event, trigger, player) {
      const card = {
        name: trigger.card.name,
        nature: trigger.card.nature
      };
      event.result = await player.chooseToDiscard("蹙国：请弃置一张牌", `视为你对${get.translation(trigger.target)}使用一张${get.translation(card.nature || "")}【${get.translation(card.name)}】`, "he", true).set("logSkill", [event.skill, trigger.target]).forResult();
    },
    async content(event, trigger, player) {
      const card = {
        name: trigger.card.name,
        nature: trigger.card.nature,
        isCard: true,
        storage: { cuguo: true }
      };
      if (player.canUse(card, trigger.target, false)) {
        const next = player.useCard(card, trigger.target);
        player.when("useCardAfter").filter((event2) => {
          return event2.card.storage?.cuguo && event2 == next;
        }).step(async (event2, trigger2, player2) => {
          if (game.hasGlobalHistory("everything", (evt) => {
            if (evt._neutralized || evt.responded && (!evt.result || !evt.result.bool)) {
              if (evt.getParent() == trigger2) {
                return true;
              }
            }
            return false;
          })) {
            await player2.loseHp();
          }
        });
        await next;
      }
    }
  },
  //陈式
  qingbei: {
    audio: 2,
    trigger: {
      global: "roundStart",
      player: "useCardAfter"
    },
    filter(event, player) {
      if (event.name != "useCard") {
        return true;
      }
      if (!player.getStorage("qingbei_effect").length) {
        return false;
      }
      const suit = get.suit(event.card);
      if (!suit) {
        return false;
      }
      return suit !== "none";
    },
    async cost(event, trigger, player) {
      if (trigger.name == "useCard") {
        event.result = {
          bool: true
        };
        return;
      }
      const result = await player.chooseButton([`###${get.prompt(event.skill)}###<div class='text center'>选择任意个花色，令你本轮不能使用这些花色的牌</div>`, [lib.suit.map((i) => ["", "", "lukai_" + i]), "vcard"]], [1, 4]).set("ai", (button) => {
        const player2 = get.player(), suit = button.link[2].slice(6), val = player2.getCards("hs", { suit }).map((card) => {
          return get.value(card) + player2.getUseValue(card) / 3;
        }).reduce((sum, value) => {
          return sum + value;
        }, 0);
        if (val > 10 && ui.selected.buttons.length > 0) {
          return -1;
        }
        if (val > 6 && ui.selected.buttons.length == 2) {
          return -1;
        }
        if (ui.selected.buttons.length == 3) {
          return -1;
        }
        return 1 + 1 / val;
      }).forResult();
      if (result?.bool && result.links?.length) {
        event.result = {
          bool: true,
          cost_data: result.links
        };
      }
    },
    async content(event, trigger, player) {
      if (trigger.name == "useCard") {
        await player.draw(player.getStorage("qingbei_effect").length, "nodelay");
        return;
      }
      const { name, cost_data: links } = event;
      const suits = links.map((i) => i[2].slice(6)).sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
      const skill = `${name}_effect`;
      player.addTempSkill(skill, "roundStart");
      player.setStorage(skill, suits, true);
      player.addTip(skill, `${get.translation(skill)}${suits.map((i) => get.translation(i)).join("")}`);
    },
    ai: {
      threaten: 2.3
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove(player, skill) {
          delete player.storage[skill];
          player.removeTip(skill);
        },
        mark: true,
        intro: {
          content: `本轮内不能使用$花色的牌`
        },
        mod: {
          cardEnabled(card, player) {
            if (player.getStorage("qingbei_effect").includes(get.suit(card))) {
              return false;
            }
          },
          cardSavable(card, player) {
            if (player.getStorage("qingbei_effect").includes(get.suit(card))) {
              return false;
            }
          }
        }
      }
    }
  },
  //费曜
  zhenfeng: {
    audio: 2,
    trigger: { global: "useCard" },
    usable: 1,
    filter(event, player) {
      return event.player != player && event.player == _status.currentPhase && event.player.countCards("h") <= event.player.getHp();
    },
    check(event, player) {
      const target = event.player;
      get.type2(event.card, target);
      const att = get.attitude(player, target);
      if (att <= 0) {
        return true;
      }
      if (target.isAllCardsKnown(player) && (target.getHp() >= 3 || get.effect(target, { name: "sha" }, player, player) > 0 || target.hasShan())) {
        return true;
      }
      if (1.5 * target.getHp() + 0.8 * target.countCards("h") > 6 - player.countMark("zhenfeng")) {
        return true;
      }
      return false;
    },
    async cost(event, trigger, player) {
      const target = trigger.player;
      const choices = Array.from({ length: target.countCards("h") + 1 }).map((_, i) => get.cnNumber(i, true));
      const type = get.type2(trigger.card, target);
      const result = await player.chooseControl(choices, "cancel2").set("prompt", `镇锋：猜测其手牌中的${get.translation(type)}牌数`).set("ai", () => {
        return _status.event.choice;
      }).set(
        "choice",
        (function() {
          if (!get.info("zhenfeng").check(trigger, player)) {
            return "cancel2";
          }
          const num = target.countCards("h");
          const knownNum = target.countKnownCards(player, (card) => get.type2(card) == type);
          if (target.isAllCardsKnown(player)) {
            return knownNum;
          }
          const restNum = num - knownNum;
          let numx;
          if (type == "basic") {
            numx = knownNum + Math.floor(Math.random() * (restNum + 1));
          } else if (type == "trick") {
            if (num > 2) {
              numx = 2;
            } else {
              numx = 1;
            }
            if (Math.random() < 0.5) {
              numx += Math.random() > 0.5 ? 1 : -1;
            }
          } else {
            numx = Math.random() < 0.4 ? 1 : 0;
          }
          if (numx < knownNum) {
            numx = knownNum;
          } else if (numx >= choices.length) {
            numx = choices.length - 1;
          }
          return numx;
        })()
      ).forResult();
      event.result = {
        bool: result?.control != "cancel2",
        cost_data: result.index
      };
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const target = event.targets[0];
      const guessedNum = event.cost_data;
      const type = get.type2(trigger.card, target);
      player.chat("我猜" + get.cnNumber(guessedNum) + "张");
      game.log(player, "猜测", target, "有", get.cnNumber(guessedNum) + "张" + get.translation(type) + "牌");
      await game.delay();
      const count = target.countCards("h", (card) => get.type2(card) == type);
      if (count == guessedNum) {
        player.popup("洗具");
        game.log(player, "猜测", "#g正确");
        if (player.countMark("zhenfeng") < 5) {
          player.addMark("zhenfeng", 1, false);
        }
        await player.draw(player.countMark("zhenfeng"));
        if (player.canUse("sha", target, false)) {
          await player.useCard({ name: "sha", isCard: true }, target);
        }
      } else {
        player.popup("杯具");
        game.log(player, "猜测", "#y错误");
        player.clearMark("zhenfeng");
        if (Math.abs(count - guessedNum) > 1 && target.canUse("sha", player, false)) {
          await target.useCard({ name: "sha", isCard: true }, player, false, "noai");
        }
      }
    },
    onremove: true,
    intro: { content: "已连续猜对#次" }
  },
  //新杀小加强 李严
  dcduliang: {
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return player != target && target.countCards("he") > 0;
    },
    audio: "duliang",
    async content(event, trigger, player) {
      const { target } = event;
      await player.gainPlayerCard(target, "he", true);
      const name = get.translation(target);
      const result = await player.chooseControl(function() {
        return Math.random() < 0.5 ? "选项一" : "选项二";
      }).set("prompt", "督粮：请选择一项").set("choiceList", ["你观看牌堆顶的两张牌，然后令" + name + "获得其中的一或两张基本牌", "令" + name + "于下回合的摸牌阶段额外摸一张牌"]).forResult();
      if (result.control == "选项一") {
        const cards2 = get.cards(2, true);
        let bool = false;
        await game.cardsGotoOrdering(cards2);
        for (const card of cards2) {
          if (get.type(card) == "basic") {
            bool = true;
            break;
          }
        }
        const result2 = await player.chooseButton(["督粮：选择令" + get.translation(target) + "获得的牌", cards2], [1, 2], bool).set("filterButton", (button) => {
          return get.type(button.link) == "basic";
        }).set("ai", (button) => {
          return _status.event.sgn * get.value(button.link);
        }).set("sgn", get.sgnAttitude(player, target) > 0).forResult();
        if (result2.links?.length) {
          const cardsx = result2.links;
          await target.gain(cardsx, "draw");
          game.log(target, "获得了" + get.cnNumber(cardsx.length) + "张牌");
          cards2.removeArray(cardsx);
          await game.cardsGotoPile(cards2.reverse(), "insert");
        }
      } else {
        target.addTempSkill("dcduliang2", { player: "phaseAfter" });
        target.addMark("dcduliang2", 1, false);
      }
    },
    ai: {
      order: 4,
      result: {
        target: -1,
        player: 0.1
      }
    }
  },
  dcduliang2: {
    trigger: { player: "phaseDrawBegin" },
    forced: true,
    mark: true,
    audio: false,
    onremove: true,
    charlotte: true,
    intro: {
      content: "下回合的摸牌阶段额外摸#张牌"
    },
    sourceSkill: "dcduliang",
    async content(event, trigger, player) {
      trigger.num += player.countMark("dcduliang2");
    }
  },
  //苏飞
  shuojian: {
    audio: 2,
    enable: "phaseUse",
    usable: 3,
    filterTarget: lib.filter.notMe,
    filterCard: true,
    position: "he",
    discard: false,
    lose: false,
    delay: false,
    check(card, player) {
      return 6 - get.value(card);
    },
    async content(event, trigger, player) {
      const cards2 = event.cards;
      const target = event.target;
      await player.give(cards2, target);
      const num = 3 - get.skillCount("shuojian") + 1;
      if (num === 0) {
        return;
      }
      const playerName = get.translation(player);
      const numText = get.cnNumber(num);
      for (let num2 = num; num2 > 0; num2--) {
        const forced = num !== num2;
        const prompt = `###${playerName}对你发动了【数谏】###视为使用${numText}张【过河拆桥】${forced ? "" : `且${playerName}此技能本回合失效，或点击“取消”令其摸${numText}张牌`}`;
        const result = target.hasUseTarget({ name: "guohe" }) ? await target.chooseUseTarget({
          prompt,
          card: get.autoViewAs({ name: "guohe", isCard: true }),
          forced,
          ai(...args) {
            let evt = _status.event;
            if (evt.name === "chooseTarget") {
              const parent = evt.getParent();
              if (parent == null) {
                return 0;
              }
              evt = parent;
            }
            if (!evt.goon) {
              return 0;
            }
            return get.effect_use(...args);
          }
        }).set("goon", target.getUseValue({ name: "guohe" }) > get.sgnAttitude(target, player) * player.getUseValue({ name: "wuzhong" }) / (2 - num * 0.4)).forResult() : { bool: false };
        if (result.bool) {
          continue;
        }
        await player.draw(num);
        if (num > 1) {
          await player.chooseToDiscard({
            selectCard: num - 1,
            position: "he",
            forced: true
          });
        }
        return;
      }
      player.tempBanSkill("shuojian");
    },
    ai: {
      expose: 0.15,
      order: 8,
      result: { target: 1 }
    }
  },
  //谯周
  shiming: {
    audio: 2,
    trigger: { global: "phaseDrawBegin1" },
    round: 1,
    check(event, player) {
      return true;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      const cards2 = get.cards(3, true);
      let result = await player.chooseButton(["识命：是否将其中一张置于牌堆底？", cards2.slice(0)]).set("ai", (button) => {
        const { att, damage, player: player2 } = get.event();
        const val = get.value(button.link, player2);
        if (att > 0 && damage < 0 || att <= 0 && damage > 0) {
          return 6 - val;
        }
        return val - 5.99;
      }).set("att", get.attitude(player, target)).set("damage", get.damageEffect(target, target, player) > 0 && target.hp <= 3 ? 1 : -1).forResult();
      if (result?.bool && result.links?.length) {
        const { links: cards3 } = result;
        player.popup("一下", "wood");
        game.log(player, "将一张牌置于了牌堆底");
        await game.cardsGotoPile(cards3);
      }
      result = await target.chooseBool("是否跳过摸牌阶段并对自己造成1点伤害，然后从牌堆底摸三张牌？").set("ai", () => _status.event.bool).set("bool", get.damageEffect(target, target) >= -6 || target.hp > 3).forResult();
      if (result?.bool) {
        trigger.cancel();
        await target.damage(target);
        await target.draw(3, "bottom");
      }
    }
  },
  jiangxi: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      const zhu = game.findPlayer((current) => current.getSeatNum() == 1);
      return zhu && player.storage["shiming_roundcount"] && (game.getGlobalHistory("changeHp", (evt) => {
        return evt.player == zhu && evt._dyinged;
      }).length > 0 || zhu.getHistory("damage").length == 0) || !game.hasPlayer2((current) => current.getHistory("damage").length > 0);
    },
    direct: true,
    seatRelated: true,
    async content(event, trigger, player) {
      const zhu = game.findPlayer((current) => current.getSeatNum() == 1);
      if (zhu && player.storage["shiming_roundcount"]) {
        if (game.getGlobalHistory("changeHp", (evt) => {
          return evt.player == zhu && evt._dyinged;
        }).length > 0 || zhu.getHistory("damage").length == 0) {
          const result = await player.chooseBool(get.prompt(event.name), "重置〖识命〗").forResult();
          if (result?.bool) {
            player.logSkill(event.name);
            event.logged = true;
            player.refreshSkill("shiming");
            await player.draw();
          }
        }
      }
      if (!game.hasPlayer2((current) => current.getHistory("damage").length > 0)) {
        const result = await player.chooseBool(get.prompt(event.name), `与${get.translation(trigger.player)}各摸一张牌`).set(
          "choice",
          (() => {
            let eff = (current) => get.effect(current, { name: "draw" }, player, player);
            return eff(trigger.player) + eff(player) > 0;
          })()
        ).forResult();
        if (result?.bool) {
          if (!event.logged) {
            player.logSkill(event.name);
          }
          await trigger.player.draw("nodelay");
          await player.draw();
        }
      }
    }
  },
  //韩龙
  duwang: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter(event, player) {
      return event.name !== "phase" || game.phaseNumber === 0;
    },
    async content(event, trigger, player) {
      const cards2 = [];
      for (const card of ui.cardPile.childNodes) {
        if (card.name === "sha") {
          continue;
        }
        cards2.push(card);
        if (cards2.length >= 5) {
          break;
        }
      }
      if (!cards2.length) {
        return;
      }
      const next = player.addToExpansion(cards2, "gain2");
      next.gaintag.add("duwang");
      await next;
    },
    marktext: "刺",
    intro: {
      name: "刺",
      name2: "刺",
      content: "expansion",
      markcount: "expansion"
    },
    mod: {
      globalFrom(from, to, distance) {
        return distance + Math.min(1, from.getExpansions("duwang").filter((i) => i.name !== "sha").length);
      },
      globalTo(from, to, distance) {
        return distance + Math.min(1, to.getExpansions("duwang").filter((i) => i.name !== "sha").length);
      }
    }
  },
  cibei: {
    audio: 2,
    trigger: { global: "cardsDiscardAfter" },
    filter(event, player) {
      if (!player.getExpansions("duwang").filter((card) => card.name !== "sha").length) {
        return false;
      }
      const evt = event.getParent();
      if (evt.name !== "orderingDiscard") {
        return false;
      }
      const evtx = evt.relatedEvent || evt.getParent();
      return evtx.name === "useCard" && evtx.card.name === "sha" && evtx.card.isCard && event.cards.filterInD("d").length && game.hasPlayer2((current) => current.hasHistory("sourceDamage", (evtxx) => evtxx.card === evtx.card));
    },
    group: "cibei_fullyReady",
    async cost(event, trigger, player) {
      event.result = await player.chooseButton({
        createDialog: [`###${get.prompt(event.skill)}###<div class="text center">将一张“刺”置入弃牌堆，并将${get.translation(trigger.cards.filterInD("d"))}置入“刺”</div>`, player.getExpansions("duwang")],
        filterButton(button) {
          return button.link.name !== "sha";
        }
      }).set("filterButton", (button) => button.link.name !== "sha").forResult();
      event.result.cards = event.result.links;
    },
    async content(event, trigger, player) {
      const cards2 = event.cards;
      const loseEvent = player.loseToDiscardpile({ cards: cards2 });
      const expansionEvent = player.addToExpansion({
        cards: trigger.cards.filterInD("d"),
        animate: "gain2",
        gaintag: ["duwang"]
      });
      await loseEvent;
      await expansionEvent;
      if (!game.hasPlayer((current) => current.hasDiscardableCards(player, "hej"))) {
        return;
      }
      const result = await player.chooseTarget({
        prompt: "刺北：弃置一名角色区域内的一张牌",
        filterTarget(card, player2, target2) {
          return target2.hasDiscardableCards(player2, "hej");
        },
        forced: true,
        ai(target2) {
          return get.effect(target2, { name: "guohe" }, get.player());
        }
      }).forResult();
      if (!result.bool || !result.targets?.length) {
        return;
      }
      const target = result.targets[0];
      player.line(target);
      const discardEvent = player.discardPlayerCard({
        target,
        position: "hej",
        forced: true
      });
      player.addExpose(0.1);
      await discardEvent;
    },
    ai: {
      combo: "duwang"
    },
    subSkill: {
      fullyReady: {
        audio: "cibei",
        trigger: { global: "phaseEnd" },
        forced: true,
        locked: false,
        filter(event, player) {
          const storage = player.getExpansions("duwang");
          return storage.length > 0 && storage.every((i) => i.name === "sha");
        },
        async content(event, trigger, player) {
          const next = player.gain({
            cards: player.getExpansions("duwang"),
            animate: "gain2",
            gaintag: ["cibei_mark"]
          });
          player.addSkill("cibei_mark");
          await next;
        }
      },
      mark: {
        trigger: { player: "useCard1" },
        onremove: true,
        charlotte: true,
        silent: true,
        firstDo: true,
        filter(event, player) {
          return player.hasHistory("lose", (evt) => {
            const evtx = evt.relatedEvent || evt.getParent();
            if (evtx !== event) {
              return false;
            }
            return Object.values(evt.gaintag_map).some((tags) => tags.includes("cibei_mark"));
          });
        },
        async content(event, trigger, player) {
          if (trigger.addCount !== false) {
            trigger.addCount = false;
            const stat = player.getStat().card;
            const name = trigger.card.name;
            if (typeof stat[name] === "number") {
              stat[name]--;
            }
          }
        },
        mod: {
          ignoredHandcard(card, player) {
            if (card.hasGaintag("cibei_mark")) {
              return true;
            }
          },
          cardDiscardable(card, player, name) {
            if (card.hasGaintag("cibei_mark")) {
              return false;
            }
          },
          canBeDiscarded(card) {
            if (card.hasGaintag("cibei_mark")) {
              return false;
            }
          },
          targetInRange(card, player, target) {
            if (!card.cards) {
              return;
            }
            if (card.cards.some((i) => i.hasGaintag("cibei_mark"))) {
              return true;
            }
          },
          cardUsable(card, player) {
            if (!card.cards) {
              return;
            }
            if (card.cards.some((i) => i.hasGaintag("cibei_mark"))) {
              return true;
            }
          }
        }
      }
    }
  },
  //武安国
  diezhang: {
    audio: 2,
    locked: false,
    zhuanhuanji(player, skill) {
      if (!player.storage.duanwan) {
        player.storage[skill] = !player.storage[skill];
      }
    },
    trigger: { global: ["eventNeutralized", "shaMiss"] },
    filter(event, player) {
      if (player.hasSkill("diezhang_used")) {
        return false;
      }
      if (event.type !== "card") {
        return false;
      }
      const evt = event._neutralize_event;
      const user = event.player;
      let responder;
      if (event.name === "sha") {
        responder = event.target;
      } else {
        if (evt.type !== "card") {
          return false;
        }
        responder = evt.player;
      }
      if (!player.storage.diezhang) {
        if (user !== player || responder === player) {
          return false;
        }
        return player.countDiscardableCards(player, "he") > 0 && player.canUse("sha", responder, false);
      }
      if (user === player || responder !== player) {
        return false;
      }
      return player.canUse("sha", user, false);
    },
    async cost(event, trigger, player) {
      const evt = trigger._neutralize_event;
      const user = trigger.player;
      const responder = trigger.name === "sha" ? trigger.target : evt.player;
      const num = player.storage.duanwan ? 2 : 1;
      const target = player.storage.diezhang ? user : responder;
      const next = player.storage.diezhang ? player.chooseBool({
        prompt: get.prompt("diezhang", target),
        prompt2: `摸${get.cnNumber(num)}张牌，视为对其使用一张【杀】`,
        ai() {
          return get.event().goon;
        }
      }) : player.chooseToDiscard({
        prompt: get.prompt("diezhang", target),
        prompt2: `弃置一张牌，视为对其使用${get.cnNumber(num)}张【杀】`,
        position: "he",
        ai(card) {
          return get.event().goon ? 6 - get.value(card) : 0;
        }
      }).set("chooseonly", true);
      next.set("goon", get.effect(target, { name: "sha" }, player, player) > 0);
      event.result = await next.forResult();
      event.result.targets = [target];
      event.result.cost_data = {
        num
      };
    },
    logTarget: "targets",
    async content(event, trigger, player) {
      if (player.storage.duanwan) {
        player.addTempSkill("diezhang_used");
      }
      player.changeZhuanhuanji("diezhang");
      const target = event.targets[0];
      const num = event.cost_data.num;
      if (!event.cards?.length) {
        await player.draw({
          num,
          nodelay: true
        });
        await player.useCard({
          card: get.autoViewAs({ name: "sha", isCard: true }),
          targets: [target],
          addCount: false
        });
        return;
      }
      await player.discard({ cards: event.cards });
      for (let i = 0; i < num; ++i) {
        await player.useCard({
          card: get.autoViewAs({ name: "sha", isCard: true }),
          targets: [target],
          addCount: false
        });
      }
    },
    marktext: "☯",
    mark: true,
    intro: {
      content(storage, player) {
        const cnNum = get.cnNumber(player.storage.duanwan ? 2 : 1);
        if (storage) {
          return `当其他角色使用牌被你抵消后，你可以摸${cnNum}张牌，视为对其使用一张【杀】。`;
        }
        return `当你使用牌被其他角色抵消后，你可以弃置一张牌，视为对其使用${cnNum}张【杀】。`;
      }
    },
    mod: {
      cardUsable(card, player, num) {
        if (!player.storage.duanwan && card.name === "sha") {
          return num + 1;
        }
      }
    },
    subSkill: { used: { charlotte: true } }
  },
  duanwan: {
    audio: 2,
    enable: "chooseToUse",
    skillAnimation: true,
    animationColor: "soil",
    limited: true,
    filter(event, player) {
      return event.type === "dying" && player === event.dying;
    },
    async content(event, trigger, player) {
      player.changeZhuanhuanji("diezhang");
      player.awakenSkill(event.name);
      const num = 2 - player.hp;
      if (num > 0) {
        await player.recover({ num });
      }
    },
    ai: {
      save: true,
      skillTagFilter(player, tag, target) {
        return player === target;
      },
      result: { player: 1 }
    }
  },
  //李婉
  liandui: {
    audio: 2,
    trigger: { global: "useCard" },
    filter(event, player) {
      const history = game.getAllGlobalHistory("useCard");
      const index = history.indexOf(event);
      if (index <= 0) {
        return false;
      }
      const previous = history[index - 1].player;
      if (event.player == player && previous != player && previous.isIn()) {
        return true;
      }
      if (event.player != player && previous == player) {
        return true;
      }
      return false;
    },
    async cost(event, trigger, player) {
      if (!trigger.player) {
        return;
      }
      const history = game.getAllGlobalHistory("useCard");
      const index = history.indexOf(trigger);
      const previous = history[index - 1].player;
      const result = await trigger.player.chooseBool("是否对" + get.translation(previous) + "发动【联对】？", "令" + get.translation(previous) + "摸两张牌").set("ai", () => _status.event.bool).set("bool", get.effect(previous, { name: "draw" }, trigger.player, trigger.player) > 0).forResult();
      if (result.bool) {
        event.result = { bool: true, cost_data: previous };
      }
    },
    async content(event, trigger, player) {
      const { cost_data: previous } = event;
      previous.draw(2);
    }
  },
  biejun: {
    audio: 2,
    global: "biejun_give",
    trigger: { player: "damageBegin4" },
    filter(event, player) {
      return !player.hasSkill("biejun_used") && player.countCards("h", (card) => {
        return card.hasGaintag("biejun");
      }) == 0;
    },
    prompt2: "翻面并防止此伤害",
    check(event, player) {
      return player.isTurnedOver() || event.num >= player.hp || get.distance(_status.currentPhase, player, "absolute") >= 3;
    },
    async content(event, trigger, player) {
      player.addTempSkill("biejun_used");
      player.turnOver();
      trigger.cancel();
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return [1, -2];
          }
          if (get.tag(card, "damage")) {
            if (lib.skill.biejun.filter(null, target) && target.isTurnedOver()) {
              return [0, 1];
            }
          }
        }
      }
    },
    subSkill: {
      used: { charlotte: true },
      give: {
        audio: 2,
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
          if (!player.countCards("h")) {
            return false;
          }
          var targets = game.filterPlayer(function(current) {
            return current != player && current.hasSkill("biejun");
          });
          if (!targets.length) {
            return false;
          }
          return true;
        },
        selectCard: 1,
        filterCard: true,
        chessForceAll: true,
        filterTarget(card, player, target) {
          return target.hasSkill("biejun");
        },
        selectTarget() {
          var player = _status.event.player;
          var targets = game.filterPlayer(function(current) {
            return current != player && current.hasSkill("biejun");
          });
          return targets.length > 1 ? 1 : -1;
        },
        complexSelect: true,
        prompt() {
          var player = _status.event.player;
          var targets = game.filterPlayer(function(current) {
            return current != player && current.hasSkill("biejun");
          });
          return "将一张手牌交给" + get.translation(targets) + (targets.length > 1 ? "中的一人" : "");
        },
        position: "h",
        discard: false,
        lose: false,
        delay: false,
        check(card) {
          const player = _status.event.player;
          if (game.hasPlayer((current) => lib.skill.biejun_give.filterTarget(null, player, current) && get.attitude(player, current) > 0)) {
            return 5 - get.value(card);
          }
          return -get.value(card);
        },
        async content(event, trigger, player) {
          game.trySkillAudio("biejun", event.target);
          player.give(event.cards, event.target).gaintag.add("biejun");
          event.target.addTempSkill("biejun_tag");
        },
        ai: {
          order: 2,
          result: { target: 1 }
        }
      },
      tag: {
        charlotte: true,
        forced: true,
        onremove(player) {
          player.removeGaintag("biejun");
        }
      }
    }
  },
  //诸葛尚
  sangu: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    direct: true,
    getEffect(player, target, event, list1, list2) {
      const att = get.attitude(player, target);
      if (att === 0) {
        return 0;
      }
      const getv = (name, player2, arg) => {
        let v = event.getTempCache("sangu", `${player2.playerid}${name}`);
        if (typeof v === "number") {
          return v;
        }
        v = player2.getUseValue({ name, storage: { sangu: true } }, arg);
        event.putTempCache("sangu", `${player2.playerid}${name}`, v);
        return v;
      };
      if (att < 0) {
        for (const name of list1) {
          if (getv(name, target) <= 0) {
            return -att * Math.sqrt(get.threaten(target)) * 2;
          }
        }
        return 0;
      }
      let list = list1.concat(player.hp > 1 ? list2 : []);
      let eff = 0;
      list.sort((a, b) => getv(b, target) - getv(a, target));
      list = list.slice(3);
      for (const name of list) {
        const res = getv(name, target);
        if (res <= 5) {
          break;
        }
        eff += res;
      }
      return Math.sqrt(eff / 1.5) * att;
    },
    async content(event, trigger, player) {
      const list1 = [];
      const list2 = [];
      const used = player.iterHistory("useCard").map((evt) => evt.card.name).toArray();
      for (const name of lib.inpile) {
        if (name !== "sha") {
          const type = get.type(name);
          if (type !== "trick") {
            continue;
          }
          const info = lib.card[name];
          if (!info || info.singleCard || info.notarget) {
            continue;
          }
        }
        if (used.includes(name)) {
          list1.push(name);
        } else {
          list2.push(name);
        }
      }
      if (!list1.length && !list2.length) {
        return;
      }
      const targetResult = await player.chooseTarget({
        prompt: get.prompt2("sangu"),
        filterTarget: lib.filter.notMe,
        ai(target2) {
          return lib.skill.sangu.getEffect(_status.event.player, target2, _status.event.getTrigger(), _status.event.list1, _status.event.list2);
        }
      }).set("list1", list1).set("list2", list2).forResult();
      if (!targetResult.bool || !targetResult.targets?.length) {
        return;
      }
      const target = targetResult.targets[0];
      player.logSkill("sangu", target);
      event.target = target;
      const dialog = [`为${get.translation(target)}选择至多三个牌名`];
      if (list1.length) {
        dialog.push('<div class="text center">本回合已使用过的牌</div>');
        dialog.push([list1.map((i) => [get.type(i), "", i]), "vcard"]);
      }
      if (list2.length) {
        dialog.push('<div class="text center">本回合未使用过的牌</div>');
        dialog.push([list2.map((i) => [get.type(i), "", i]), "vcard"]);
      }
      const buttonResult = await player.chooseButton({
        createDialog: dialog,
        selectButton: [1, 3],
        forced: true,
        ai(button) {
          const name = button.link[2];
          const list = _status.event.list;
          const player2 = _status.event.player;
          const target2 = _status.event.getParent()?.target;
          const triggerEvent = _status.event.getTrigger();
          const getv = (name2, player3) => {
            let v = triggerEvent.getTempCache("sangu", `${player3.playerid}${name2}`);
            if (typeof v === "number") {
              return v;
            }
            v = player3.getUseValue({ name: name2, storage: { sangu: true } });
            triggerEvent.putTempCache("sangu", `${player3.playerid}${name2}`, v);
            return v;
          };
          if (get.attitude(player2, target2) < 0) {
            if (!list.includes(name)) {
              return 0;
            }
            return -getv(name, target2);
          }
          if (player2.hp < 2 && !list.includes(name)) {
            return 0;
          }
          let val = getv(name, target2);
          const base = 5;
          val = Math.min(15, val - base);
          if (name === "wuzhong" || name === "dongzhuxianji") {
            val += 15;
          } else if (name === "shunshou") {
            val += 6;
          }
          return val;
        }
      }).set("list", list1).forResult();
      if (!buttonResult.bool || !buttonResult.links?.length) {
        return;
      }
      const names = buttonResult.links.map((i) => i[2]);
      if (!target.storage.sangu_effect) {
        target.storage.sangu_effect = [];
      }
      target.storage.sangu_effect = target.storage.sangu_effect.concat(names);
      game.log(player, "为", target, "选择了", `#y${get.translation(names)}`);
      target.addTempSkill("sangu_effect", { player: "phaseUseAfter" });
      target.markSkill("sangu_effect");
      const allUsed = names.every((name) => used.includes(name));
      if (allUsed) {
        target.addTempSkill("sangu_prevent", { player: "phaseUseAfter" });
        target.markAuto("sangu_prevent", [player]);
      }
    },
    ai: {
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "damage") && card.storage && card.storage.sangu) {
            return "zeroplayertarget";
          }
        }
      }
    },
    subSkill: {
      effect: {
        trigger: { player: "phaseUseBegin" },
        charlotte: true,
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          player.addTempSkill("sangu_viewas");
        },
        onremove: true,
        intro: {
          mark(dialog, storage, player) {
            if (!storage || !storage.length) {
              return "当前无可用牌";
            }
            dialog.add([[storage[0]], "vcard"]);
            if (storage.length > 1) {
              dialog.addSmall([storage.slice(1), "vcard"]);
            }
          },
          content: "$"
        }
      },
      viewas: {
        hiddenCard(player, name) {
          const storage = player.getStorage("sangu_effect");
          if (!storage.length) {
            return;
          }
          return name === storage[0];
        },
        mod: {
          cardname(card, player) {
            if (_status.event.name !== "chooseToUse" || _status.event.skill) {
              return;
            }
            const storage = player.getStorage("sangu_effect");
            if (!storage.length) {
              return;
            }
            return storage[0];
          },
          cardnature(card, player) {
            if (_status.event.name !== "chooseToUse" || _status.event.skill) {
              return;
            }
            const storage = player.getStorage("sangu_effect");
            if (!storage.length) {
              return;
            }
            return false;
          }
        },
        trigger: { player: ["useCard", "respond"] },
        forced: true,
        charlotte: true,
        filter(event, player) {
          return event.cards.length > 0 && player.getStorage("sangu_effect").length > 0;
        },
        async content(event, trigger, player) {
          if (!trigger.card.storage) {
            trigger.card.storage = {};
          }
          trigger.card.storage.sangu = true;
          player.unmarkAuto("sangu_effect", [player.getStorage("sangu_effect")[0]]);
        }
      },
      prevent: {
        trigger: { source: "damageBegin2" },
        forced: true,
        charlotte: true,
        onremove: true,
        filter(event, player) {
          return event.card && event.card.storage && event.card.storage.sangu && player.getStorage("sangu_prevent").includes(event.player);
        },
        async content(event, trigger, player) {
          trigger.cancel();
        }
      }
    }
  },
  yizu: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    forced: true,
    usable: 1,
    filter(event, player) {
      return player.isDamaged() && player.hp <= event.player.hp && (event.card.name == "sha" || event.card.name == "juedou");
    },
    async content(event, trigger, player) {
      await player.recover();
    },
    ai: {
      effect: {
        target_use(card, player, target, current) {
          if (target.isHealthy() || card.name != "sha" && card.name != "juedou") {
            return;
          }
          if (target.storage.counttrigger && target.storage.counttrigger.yizu && current < 0) {
            return 5;
          }
          if (player.hp < target.hp) {
            return;
          }
          if (current > 0) {
            return 1.2;
          }
          if (get.attitude(player, target) >= 0) {
            return;
          }
          var copy = get.effect(target, { name: "shacopy" }, player, player);
          if (copy > 0 && player.isPhaseUsing() && Math.min(
            player.getCardUsable("sha"),
            player.countCards("hs", function(card2) {
              return get.name(card2) == "sha" && player.canUse(card2, target, null, true);
            })
          ) >= 2) {
            return;
          }
          return [0, 2];
        }
      }
    }
  },
  //轲比能
  kousheng: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return player.hasCards("h");
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard({
        prompt: get.prompt("kousheng"),
        prompt2: "你可以选择任意张手牌，这些手牌于本回合内视为无次数限制的【杀】。但当有角色受到这些【杀】的伤害后，其可以用所有手牌交换剩余的牌。",
        selectCard: [1, player.countCards("h")],
        position: "h",
        allowChooseAll: true,
        ai(card) {
          const player2 = _status.event.player;
          const standard = _status.event.standard;
          if (standard <= 0) {
            return 0;
          }
          const eff = player2.getUseValue(card, null, true);
          if (eff <= standard) {
            return standard - eff + 0.1;
          }
          return 0;
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      player.addGaintag(event.cards, "kousheng");
      player.addTempSkill("kousheng_effect");
      await game.delayx();
    },
    subSkill: {
      effect: {
        audio: "kousheng",
        trigger: { player: "useCard1" },
        forced: true,
        charlotte: true,
        firstDo: true,
        filter(event, player) {
          if (event.card.name !== "sha") {
            return false;
          }
          return player.hasHistory("lose", (evt) => {
            const evtx = evt.relatedEvent || evt.getParent();
            if (evtx !== event) {
              return false;
            }
            return Object.values(evt.gaintag_map).some((tags) => tags.includes("kousheng"));
          });
        },
        async content(event, trigger, player) {
          if (!trigger.card.storage) {
            trigger.card.storage = {};
          }
          trigger.card.storage.kousheng = true;
          if (trigger.addCount !== false) {
            trigger.addCount = false;
            const stat = player.getStat().card;
            const name = trigger.card.name;
            if (typeof stat[name] === "number") {
              stat[name]--;
            }
          }
        },
        onremove(player) {
          player.removeGaintag("kousheng");
        },
        mod: {
          cardUsable(card, player, target) {
            if (card.name !== "sha" || !card.cards) {
              return;
            }
            if (card.cards.some((i) => i.hasGaintag("kousheng"))) {
              return Infinity;
            }
          },
          cardname(card) {
            if (get.itemtype(card) === "card" && card.hasGaintag("kousheng")) {
              return "sha";
            }
          },
          cardnature(card) {
            if (get.itemtype(card) === "card" && card.hasGaintag("kousheng")) {
              return false;
            }
          }
        },
        group: "kousheng_damage"
      },
      damage: {
        audio: "kousheng",
        trigger: { source: "damageSource" },
        forced: true,
        filter(event, player) {
          if (!event.card || !event.card.storage || !event.card.storage.kousheng || event.getParent()?.type !== "card") {
            return false;
          }
          const target = event.player;
          return target.isIn() && player.hasCard((card) => card.hasGaintag("kousheng"), "h");
        },
        async content(event, trigger, player) {
          const target = trigger.player;
          const cards2 = player.getCards("h", (card) => card.hasGaintag("kousheng"));
          event.cards = cards2;
          const str = get.translation(player);
          await player.showCards(cards2, `${str}的【寇旌】牌`);
          if (!target.hasCards("h")) {
            return;
          }
          const result = await target.chooseBool({
            prompt: "是否交换“寇旌”牌？",
            prompt2: `用你的所有手牌交换${str}的下列“寇旌”牌：${get.translation(cards2)}`,
            ai() {
              const player2 = _status.event.player;
              const target2 = _status.event.getParent()?.player;
              if (player2.hasShan() || player2.hasCards("hs", { name: ["tao", "jiu"] }) || get.attitude(player2, target2) >= 0) {
                return false;
              }
              const hs1 = player2.getCards("h");
              const hs2 = _status.event.getParent()?.cards || [];
              if (hs2?.length >= player2.hp) {
                return true;
              }
              if (get.value(hs1, player2) >= get.value(hs2, target2)) {
                return false;
              }
              return true;
            }
          }).forResult();
          if (!result.bool) {
            return;
          }
          await player.swapHandcards(target, cards2, target.getCards("h"));
        }
      }
    }
  },
  //陆凯
  lkbushi: {
    audio: 2,
    getBushi(player) {
      if (!player.storage.lkbushi) {
        return ["spade", "heart", "club", "diamond"];
      }
      return player.storage.lkbushi;
    },
    init(player, skill) {
      player.addTip(
        skill,
        `${get.translation(skill)}${lib.skill.lkbushi.getBushi(player).map((i) => get.translation(i)).join("")}`
      );
    },
    onremove(player, skill) {
      delete player.storage[skill];
      player.removeTip(skill);
    },
    trigger: { player: "phaseZhunbeiBegin" },
    direct: true,
    locked: false,
    async content(event, trigger, player) {
      const list = lib.skill.lkbushi.getBushi(player).map((i) => ["", "", `lukai_${i}`]);
      const result = await player.chooseToMove({
        prompt: "卜筮：是否调整〖卜筮〗的花色顺序？",
        list: [
          [
            "无次数限制/使用打出摸牌<br>可弃牌无效/结束阶段获得",
            [list, "vcard"],
            (list3) => {
              const list22 = list3.map((i) => get.translation(i[2].slice(6)));
              return `你使用${list22[0]}牌时无次数限制；使用或打出${list22[1]}时，摸一张牌；<br>成为${list22[2]}牌目标后可弃一张牌无效；结束阶段从牌堆获得一张${list22[3]}牌`;
            }
          ]
        ],
        processAI() {
          const player2 = _status.event.player;
          const list3 = lib.skill.lkbushi.getBushi(player2);
          const list22 = [];
          let hs = player2.getCards("hs", (card) => player2.hasValueTarget(card));
          list3.sort((a, b) => hs.filter((i) => get.suit(i) === b).length - hs.filter((i) => get.suit(i) === a).length);
          list22.push(list3.shift());
          hs = player2.getCards("hs", "sha");
          list3.sort((a, b) => hs.filter((i) => get.suit(i) === b).length - hs.filter((i) => get.suit(i) === a).length);
          list22.unshift(list3.shift());
          list3.randomSort();
          list22.addArray(list3);
          return [list22.map((i) => ["", "", `lukai_${i}`])];
        }
      }).forResult();
      if (!result.bool) {
        return;
      }
      const oldList = lib.skill.lkbushi.getBushi(player);
      const list2 = result.moved[0].map((i) => i[2].slice(6));
      if (oldList.every((suit, index) => suit === list2[index])) {
        return;
      }
      player.logSkill("lkbushi");
      player.storage.lkbushi = list2;
      player.addTip(
        "lkbushi",
        `${get.translation("lkbushi")}${lib.skill.lkbushi.getBushi(player).map((i) => get.translation(i)).join("")}`
      );
      const str = `#g${list2.map((i) => get.translation(i)).join("/")}`;
      game.log(player, "将", "#g【卜筮】", "的花色序列改为", str);
      await game.delayx();
    },
    mark: true,
    marktext: "筮",
    intro: {
      content(storage, player) {
        const list = lib.skill.lkbushi.getBushi(player).map((i) => get.translation(i));
        return `①你使用${list[0]}牌无次数限制。②当你使用或打出${list[1]}牌后，你摸一张牌。③当你成为${list[2]}牌的目标后，你可以弃置一张牌，令此牌对你无效。④结束阶段开始时，你从牌堆获得一张${list[3]}牌。⑤准备阶段开始时，你可调整此技能中四种花色的对应顺序。`;
      }
    },
    group: ["lkbushi_unlimit", "lkbushi_draw", "lkbushi_defend", "lkbushi_gain"],
    subSkill: {
      unlimit: {
        mod: {
          cardUsable(card, player) {
            const list = lib.skill.lkbushi.getBushi(player);
            const suit = get.suit(card);
            if (suit === "unsure" || list[0] === suit) {
              return Infinity;
            }
          }
        },
        trigger: { player: "useCard1" },
        forced: true,
        popup: false,
        silent: true,
        firstDo: true,
        filter(event, player) {
          if (event.addCount === false) {
            return false;
          }
          const list = lib.skill.lkbushi.getBushi(player);
          return list[0] === get.suit(event.card);
        },
        async content(event, trigger, player) {
          trigger.addCount = false;
          const stat = player.getStat().card;
          const name = trigger.card.name;
          if (stat[name] && typeof stat[name] === "number") {
            stat[name]--;
          }
        }
      },
      draw: {
        audio: "lkbushi",
        trigger: { player: ["useCardAfter", "respondAfter"] },
        forced: true,
        locked: false,
        filter(event, player) {
          const list = lib.skill.lkbushi.getBushi(player);
          return list[1] === get.suit(event.card);
        },
        async content(event, trigger, player) {
          await player.draw();
        }
      },
      defend: {
        audio: "lkbushi",
        trigger: { target: "useCardToTargeted" },
        direct: true,
        filter(event, player) {
          const list = lib.skill.lkbushi.getBushi(player);
          return list[2] === get.suit(event.card) && !event.excluded.includes(player) && player.countCards("he") > 0;
        },
        async content(event, trigger, player) {
          const next = player.chooseToDiscard({
            prompt: get.prompt("lkbushi"),
            prompt2: `弃置一张牌，令${get.translation(trigger.card)}对你无效`,
            position: "he",
            ai(card) {
              if (_status.event.eff >= 0) {
                return 0;
              }
              return -_status.event.eff * 1.1 - get.value(card);
            }
          }).set("eff", get.effect(player, trigger.card, trigger.player, player));
          next.logSkill = ["lkbushi_defend", trigger.player];
          const result = await next.forResult();
          if (result.bool) {
            trigger.excluded.add(player);
          }
        }
      },
      gain: {
        audio: "lkbushi",
        trigger: { player: "phaseJieshuBegin" },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          const list = lib.skill.lkbushi.getBushi(player);
          const card = get.cardPile2((card2) => get.suit(card2, false) === list[3]);
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
  lkzhongzhuang: {
    audio: 2,
    trigger: { source: ["damageBegin1", "damageBegin4"] },
    forced: true,
    filter(event, player, name) {
      if (!event.card || event.card.name !== "sha" || event.getParent().type !== "card") {
        return false;
      }
      const range = player.getAttackRange();
      if (name === "damageBegin1") {
        return range > 3;
      }
      return range < 3 && event.num > 1;
    },
    async content(event, trigger) {
      if (event.triggername === "damageBegin1") {
        trigger.num++;
      } else {
        trigger.num = 1;
      }
    },
    global: "lkzhongzhuang_ai",
    subSkill: {
      ai: {
        ai: {
          filterDamage: true,
          skillTagFilter(player, tag, arg) {
            if (!arg || !arg.card || arg.card.name !== "sha") {
              return false;
            }
            return Boolean(arg.player && arg.player.hasSkill("lkzhongzhuang") && arg.player.getAttackRange() < 3);
          }
        }
      }
    }
  },
  //将星独具
  xinzhilve: {
    enable: "phaseUse",
    audio: "zhilve",
    usable: 1,
    chooseButton: {
      dialog(event, player) {
        const list = ["移动场上的一张牌", "摸一张牌并视为使用一张【杀】"];
        const choiceList = ui.create.dialog("知略：失去1点体力并...", "forcebutton", "hidden");
        choiceList.add([
          list.map((item, i) => {
            return [i, item];
          }),
          "textbutton"
        ]);
        return choiceList;
      },
      filter(button, player) {
        if (button.link == 0) {
          return player.canMoveCard();
        }
        return player.hasUseTarget({ name: "sha", isCard: true }, false);
      },
      check(button) {
        const player = get.player();
        const link = button.link;
        if (link == 0) {
          return player.canMoveCard(true);
        }
        return player.hasValueTarget({ name: "sha", isCard: true }, false);
      },
      backup(links) {
        return lib.skill["xinzhilve_" + ["move", "use"][links[0]]];
      },
      prompt(links, player) {
        return links[0] == 0 ? "点击“确定”以移动场上一张牌" : "请选择【杀】的目标";
      }
    },
    ai: {
      order(item, player) {
        return get.order({ name: "sha" }) + 0.1;
      },
      result: {
        player(player) {
          if (player.hp > 2 && (player.hasValueTarget({ name: "sha", isCard: true }, false) || player.canMoveCard(true))) {
            return 1;
          }
          return 0;
        }
      }
    },
    subSkill: {
      backup: {},
      move: {
        audio: "zhilve",
        filterCard: () => false,
        selectCard: -1,
        delay: false,
        async content(event, trigger, player) {
          await player.loseHp();
          if (player.canMoveCard()) {
            await player.moveCard(true);
          }
          player.addTempSkill("xinzhilve_mark");
          player.addMark("xinzhilve_mark", 1, false);
        }
      },
      use: {
        audio: "zhilve",
        filterCard: () => false,
        selectCard: -1,
        delay: false,
        filterTarget(card, player, target) {
          return player.canUse({ name: "sha", isCard: true }, target, false);
        },
        async content(event, trigger, player) {
          await player.loseHp();
          await player.draw();
          const next = player.useCard({ name: "sha", isCard: true }, false, event.target);
          next.forceDie = true;
          await next;
          player.addTempSkill("xinzhilve_mark");
          player.addMark("xinzhilve_mark", 1, false);
        },
        ai: {
          result: {
            target(player, target) {
              return get.effect(target, { name: "sha" }, player, target);
            }
          }
        }
      },
      mark: {
        markimage: "image/card/handcard.png",
        charlotte: true,
        onremove: true,
        intro: { content: "本回合手牌上限+#" },
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("xinzhilve_mark");
          }
        }
      }
    }
  },
  xinxhzhiyan: {
    audio: "xhzhiyan",
    enable: "phaseUse",
    filter(event, player) {
      const list = player.getStorage("xinxhzhiyan_used");
      return !list.includes("give") && player.countCards("h") > player.hp || !list.includes("draw") && player.countCards("h") < player.maxHp;
    },
    filterCard: true,
    selectCard() {
      var player = _status.event.player;
      const list = player.getStorage("xinxhzhiyan_used");
      if (list.includes("give")) {
        return 0;
      }
      var num = Math.max(0, player.countCards("h") - player.hp);
      if (ui.selected.cards.length || !list.includes("draw") || player.countCards("h") >= player.maxHp) {
        return [num, num];
      }
      return [0, num];
    },
    filterTarget: lib.filter.notMe,
    selectTarget() {
      if (ui.selected.cards.length) {
        return [1, 1];
      }
      return [0, 0];
    },
    check(card) {
      var player = _status.event.player;
      var checkx = function(card2) {
        if (player.getUseValue(card2, null, true) <= 0 && game.hasPlayer(function(current) {
          return current != player && get.value(card2, current) > 0 && get.attitude(player, current) > 0;
        })) {
          return 2;
        }
        return 1;
      };
      if (player.countCards("h", function(card2) {
        return checkx(card2) > 0;
      }) < player.countCards("h") - player.hp) {
        return 0;
      }
      return checkx(card);
    },
    delay: false,
    discard: false,
    lose: false,
    allowChooseAll: true,
    async content(event, trigger, player) {
      const bool = event.cards?.length > 0;
      player.addTempSkill("xinxhzhiyan_used", "phaseUseEnd");
      if (!bool) {
        player.markAuto("xinxhzhiyan_used", "draw");
        player.addTempSkill("xinxhzhiyan_false", "phaseUseEnd");
        player.draw(player.maxHp - player.countCards("h"));
      } else {
        player.markAuto("xinxhzhiyan_used", "give");
        player.give(event.cards, event.target);
      }
    },
    ai: {
      order(obj, player) {
        if (player.countCards("h") > player.hp) {
          return 10;
        }
        return 0.5;
      },
      result: {
        player(player, target) {
          if (!ui.selected.cards.length && player.countCards("h") < player.maxHp) {
            return 1;
          }
          return 0;
        },
        target: 1
      }
    }
  },
  xinxhzhiyan_used: {
    charlotte: true,
    onremove: true
  },
  xinxhzhiyan_false: {
    mod: {
      playerEnabled(card, player, target) {
        if (player != target && (!get.info(card) || !get.info(card).singleCard || !ui.selected.targets.length)) {
          return false;
        }
      }
    },
    charlotte: true,
    mark: true,
    intro: {
      content: "不能对其他角色使用牌"
    }
  },
  weifeng: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    forced: true,
    filter(event, player) {
      if (!event.targets?.some((target) => target !== player && !target.storage.weifeng2)) {
        return false;
      }
      const evt = event.getParent("phaseUse");
      if (evt?.player !== player) {
        return false;
      }
      if (!get.tag(event.card, "damage")) {
        return false;
      }
      if (!["basic", "trick"].includes(get.type(event.card))) {
        return false;
      }
      return player.getHistory("useCard", (ev) => ev.getParent("phaseUse") === evt && get.tag(ev.card, "damage") && ["basic", "trick"].includes(get.type(ev.card))).indexOf(event) === 0 && game.hasPlayer((current) => current !== player && !current.storage.weifeng2 && event.targets.includes(current));
    },
    async content(event, trigger, player) {
      const result = await player.chooseTarget({
        prompt: `威风：请选择一个目标，令其获得一个【惧(${get.translation(trigger.card.name)})】标记`,
        filterTarget(_card, player2, target2) {
          return player2 !== target2 && !target2.storage.weifeng2 && _status.event.getTrigger().targets.includes(target2);
        },
        forced: true,
        ai(target2) {
          return -get.attitude(_status.event.player, target2);
        }
      }).forResult();
      if (!result.bool || !result.targets?.length) {
        return;
      }
      const target = result.targets[0];
      target.storage.weifeng2 = trigger.card.name;
      player.line(target, "green");
      game.log(target, "获得了一个", `#g【惧(${get.translation(trigger.card.name)})】`, "标记");
      target.markSkill("weifeng2");
      player.addSkill("weifeng3");
    }
  },
  weifeng2: {
    intro: {
      content: "当前“惧”标记名称：$",
      onunmark(storage, player) {
        if (!player.storage.weifeng2) {
          return;
        }
        game.log(player, "移去了一个", `#g【惧(${get.translation(player.storage.weifeng2)})】`, "标记");
        delete player.storage.weifeng2;
      }
    },
    marktext: "惧"
  },
  weifeng3: {
    trigger: {
      global: "damageBegin3",
      player: ["phaseZhunbeiBegin", "dieBegin"]
    },
    forced: true,
    popup: false,
    sourceSkill: "weifeng",
    filter(event, player) {
      if (event.name !== "damage") {
        return true;
      }
      return event.player !== player && typeof event.player.storage.weifeng2 === "string";
    },
    async content(event, trigger, player) {
      if (trigger.name !== "damage") {
        for (const current of game.filterPlayer((current2) => current2.storage.weifeng2)) {
          current.unmarkSkill("weifeng2");
        }
        player.removeSkill("weifeng3");
        return;
      }
      player.logSkill("weifeng", trigger.player);
      let gainEvent;
      if (trigger.card && trigger.card.name === trigger.player.storage.weifeng2) {
        trigger.num++;
      } else if (trigger.player.countGainableCards(player, "he") > 0) {
        gainEvent = player.gainPlayerCard({
          target: trigger.player,
          position: "he",
          forced: true
        });
      }
      trigger.player.unmarkSkill("weifeng2");
      if (gainEvent) {
        await gainEvent;
      }
    }
  },
  gnjinfan: {
    trigger: { player: "phaseDiscardBegin" },
    locked: false,
    audio: 2,
    filter(event, player) {
      const list = player.iterableGetCards("s", (card) => card.hasGaintag("gnjinfan")).map((card) => get.suit(card)).toArray();
      if (list.length >= lib.suit.length) {
        return false;
      }
      return _status.connectMode || player.hasCards("h", (card) => !list.includes(get.suit(card)));
    },
    async cost(event, trigger, player) {
      const max = (() => {
        const list = new Set(player.iterableGetCards("s", (card) => card.hasGaintag("gnjinfan")).map((card) => get.suit(card)));
        const list2 = new Set(player.iterableGetCards("h").map((card) => get.suit(card)));
        return Math.max(1, list2.difference(list).size);
      })();
      event.result = await player.chooseCard({
        prompt: get.prompt("gnjinfan"),
        prompt2: "将任意张手牌当做“铃”置于武将牌上",
        filterCard(card, player2) {
          const suit = get.suit(card, player2);
          return !player2.countCards("s", (cardx) => cardx.hasGaintag("gnjinfan") && get.suit(cardx, false) === suit) && !ui.selected.cards.some((cardx) => get.suit(cardx, player2) === suit);
        },
        selectCard: [1, max],
        position: "h",
        complexCard: true,
        ai(card) {
          const player2 = _status.event.player;
          if (player2.hasUseTarget(card) && !player2.hasValueTarget(card)) {
            return 0;
          }
          if (["sha", "shan", "wuxie", "caochuan"].includes(card.name)) {
            return 2 + Math.random();
          }
          return 1 + Math.random();
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      game.log(player, "将", event.cards, "放到了武将牌上");
      const next = player.loseToSpecial(event.cards, "gnjinfan");
      next.visible = true;
      await next;
      player.markSkill("gnjinfan");
    },
    group: ["gnjinfan_gain"],
    marktext: "铃",
    intro: {
      mark(dialog, storage, player) {
        dialog.addAuto(player.getCards("s", (card) => card.hasGaintag("gnjinfan")));
      },
      markcount(storage, player) {
        return player.getCards("s", (card) => card.hasGaintag("gnjinfan")).length;
      },
      onunmark(storage, player) {
        const cards2 = player.getCards("s", (card) => card.hasGaintag("gnjinfan"));
        if (cards2.length) {
          player.lose({
            cards: cards2,
            position: ui.discardPile
          });
          player.$throw(cards2, 1e3);
          game.log(cards2, "进入了弃牌堆");
        }
      }
    },
    mod: {
      aiOrder(player, card, num) {
        if (get.itemtype(card) === "card" && card.hasGaintag("gnjinfan")) {
          return num + 0.5;
        }
      }
    },
    init(player, skill) {
      player.addSkill("gnjinfan_nouse");
    },
    onremove(player, skill) {
      player.removeSkill("gnjinfan_nouse");
    },
    subSkill: {
      nouse: {
        charlotte: true,
        locked: true,
        mod: {
          cardEnabled2(card, player) {
            if (get.itemtype(card) !== "card" || !card.hasGaintag("gnjinfan")) {
              return;
            }
            if (!player.hasSkill("gnjinfan")) {
              return false;
            }
          }
        }
      }
    }
  },
  gnjinfan_gain: {
    audio: "gnjinfan",
    trigger: { player: "loseAfter" },
    forced: true,
    sourceSkill: "gnjinfan",
    filter(event, player) {
      if (!event.ss || !event.ss.length) {
        return false;
      }
      for (const i in event.gaintag_map) {
        if (event.gaintag_map[i].includes("gnjinfan")) {
          return true;
        }
        return false;
      }
    },
    async content(event, trigger, player) {
      const cards2 = [];
      for (const i of trigger.ss) {
        if (!trigger.gaintag_map[i.cardid] || !trigger.gaintag_map[i.cardid].includes("gnjinfan")) {
          continue;
        }
        const suit = get.suit(i, false);
        const card = get.cardPile2((card2) => !cards2.includes(card2) && get.suit(card2, false) === suit);
        if (card) {
          cards2.push(card);
        }
      }
      const next = cards2.length ? player.gain({ cards: cards2, animate: "gain2" }) : null;
      const num = player.countCards("s", (card) => card.hasGaintag("gnjinfan"));
      if (num) {
        player.markSkill("gnjinfan");
      } else {
        player.unmarkSkill("gnjinfan");
      }
      if (cards2.length) {
        await next;
      }
      game.updateRoundNumber();
    }
  },
  gnsheque: {
    audio: 2,
    trigger: { global: "phaseZhunbeiBegin" },
    direct: true,
    filter(event, player) {
      return event.player.isIn() && event.player.countCards("e") > 0 && lib.filter.targetEnabled({ name: "sha" }, player, event.player) && (player.hasSha() || _status.connectMode && player.countCards("h") > 0);
    },
    clearTime: true,
    async content(event, trigger, player) {
      await player.chooseToUse({
        prompt: "射却：是否对" + get.translation(trigger.player) + "使用一张杀？",
        filterCard(card, player2, event2) {
          if (get.name(card) != "sha") {
            return false;
          }
          return lib.filter.filterCard.call(this, card, player2, event2);
        },
        filterTarget(card, player2, target) {
          if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
            return false;
          }
          return lib.filter.targetEnabled.call(this, card, player2, target) ?? false;
        }
      }).set("logSkill", "gnsheque").set("complexSelect", true).set("sourcex", trigger.player).set("oncard", (card) => {
        try {
          card.gnsheque_tag = true;
        } catch (e) {
          alert("发生了一个导致【射却】无法正常触发无视防具效果的错误。请关闭十周年UI/手杀ui等扩展以解决");
        }
      });
    },
    ai: {
      unequip: true,
      unequip_ai: true,
      skillTagFilter(player, tag, arg) {
        if (tag == "unequip_ai") {
          if (_status.event.getParent().name != "gnsheque") {
            return false;
          }
        } else if (!arg || !arg.card || !arg.card.gnsheque_tag) {
          return false;
        }
      }
    }
  },
  //猩黄忠
  spshidi: {
    audio: 2,
    trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
    zhuanhuanji: "number",
    filter(event, player) {
      return player.countMark("spshidi") % 2 == ["phaseJieshu", "phaseZhunbei"].indexOf(event.name);
    },
    logAudio(event, player) {
      return "spshidi" + (2 - player.countMark("spshidi") % 2) + ".mp3";
    },
    forced: true,
    async content(event, trigger, player) {
      player.changeZhuanhuanji("spshidi");
    },
    mod: {
      globalFrom(from, to, distance) {
        if (from.countMark("spshidi") % 2 == 0) {
          return distance - 1;
        }
      },
      globalTo(from, to, distance) {
        if (to.countMark("spshidi") % 2 == 1) {
          return distance + 1;
        }
      },
      aiOrder(player, card, num) {
        if (player.countMark("spshidi") % 2 == 0 && card.name == "sha" && get.color(card) == "black") {
          return num + 0.1;
        }
      }
    },
    mark: true,
    marktext: "☯",
    intro: {
      content(storage, player) {
        return "已转换过" + (storage || 0) + "次";
      }
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (!arg || !arg.card || !arg.target || arg.card.name != "sha") {
          return false;
        }
        return player.countMark("spshidi") % 2 == 0 && get.color(arg.card) == "black";
      }
    },
    group: ["spshidi_use", "spshidi_beused"],
    subSkill: {
      use: {
        audio: "spshidi1.mp3",
        trigger: { player: "useCard" },
        forced: true,
        filter(event, player) {
          return event.card.name == "sha" && player.countMark("spshidi") % 2 == 0 && get.color(event.card, false) == "black";
        },
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.players);
        }
      },
      beused: {
        audio: "spshidi2.mp3",
        trigger: { target: "useCardToTargeted" },
        forced: true,
        filter(event, player) {
          return event.card.name == "sha" && player.countMark("spshidi") % 2 == 1 && get.color(event.card, false) == "red";
        },
        async content(event, trigger, player) {
          trigger.directHit.add(player);
        }
      }
    }
  },
  spyishi: {
    audio: 2,
    trigger: { source: "damageBegin2" },
    filter(event, player) {
      return player != event.player && event.player.countCards("e") > 0;
    },
    check(event, player) {
      return get.damageEffect(event.player, player, player) <= 0 || get.attitude(player, event.player) <= 0 && !event.player.hasSkillTag("noe") && event.player.hasCard(function(card) {
        return get.value(card) > 9 - event.player.hp;
      }, "e");
    },
    logTarget: "player",
    async content(event, trigger, player) {
      trigger.num--;
      await player.gainPlayerCard({
        target: trigger.player,
        position: "e",
        forced: true
      });
    }
  },
  spqishe: {
    audio: 2,
    enable: "chooseToUse",
    viewAs: { name: "jiu" },
    filterCard: { type: "equip" },
    position: "hes",
    viewAsFilter(player) {
      return player.hasCard({ type: "equip" }, "ehs");
    },
    check(card) {
      if (_status.event.type == "dying") {
        return 1 / (get.value(card) || 0.5);
      }
      return 5 - get.value(card);
    },
    locked: false,
    mod: {
      maxHandcard(player, num) {
        return num + player.countCards("e");
      }
    }
  },
  //☆胃炎
  mbguli: {
    audio: 2,
    enable: "phaseUse",
    filterCard: true,
    selectCard: -1,
    position: "h",
    usable: 1,
    filter(event, player) {
      var hs = player.getCards("h");
      if (!hs.length) {
        return false;
      }
      for (var card of hs) {
        var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
        if (mod2 === false) {
          return false;
        }
      }
      return event.filterCard(get.autoViewAs({ name: "sha" }, hs));
    },
    viewAs: {
      name: "sha",
      storage: { mbguli: true }
    },
    onuse(links, player) {
      player.addTempSkill("mbguli_effect", "phaseUseAfter");
    },
    locked: false,
    mod: {
      cardUsable(card, player) {
        if (card?.storage?.mbguli) {
          return Infinity;
        }
      }
    },
    ai: {
      order(item, player) {
        player ??= get.player();
        if (player?.countCards("h") == 1) {
          return 114514;
        }
        return 1;
      },
      threaten: 1.14514,
      unequip_ai: true,
      skillTagFilter(player, tag, arg) {
        if (arg && arg.name == "sha" && arg.card && arg.card.storage && arg.card.storage.mbguli) {
          return true;
        }
        return false;
      }
    },
    subSkill: {
      effect: {
        audio: "mbguli",
        trigger: { global: "useCardAfter" },
        charlotte: true,
        prompt2: "将手牌摸至体力上限，然后若此牌未造成过伤害，你失去1点体力",
        check(event, player) {
          const bool = game.hasPlayer2((current) => {
            return current.hasHistory("damage", (evt) => evt.card == event.card);
          }, true);
          if (bool) {
            return true;
          }
          const num = player.maxHp - player.countCards("h");
          return num >= 3 && player.hp >= 2 || num >= 2 && player.hp >= 3;
        },
        filter(event, player) {
          return event.card.storage?.mbguli;
        },
        async content(event, trigger, player) {
          await player.drawTo(player.maxHp);
          if (game.hasPlayer2((current) => {
            return current.hasHistory("damage", (evt) => evt.card == trigger.card);
          }, true)) {
            return;
          }
          await player.loseHp();
        },
        group: "mbguli_unequip"
      },
      unequip: {
        trigger: {
          player: "useCardToPlayered"
        },
        filter({ card }) {
          return card.name == "sha" && card.storage && card.storage.mbguli;
        },
        forced: true,
        popup: false,
        logTarget: "target",
        async content(event, trigger, player) {
          trigger.target.addTempSkill("qinggang2");
          trigger.target.storage.qinggang2.add(trigger.card);
          trigger.target.markSkill("qinggang2");
        }
      }
    }
  },
  mbaosi: {
    audio: 2,
    trigger: { source: "damageSource" },
    forced: true,
    filter(event, player) {
      return player.inRange(event.player) && player.isPhaseUsing() && event.player.isIn() && !player.getStorage("mbaosi_inf").includes(event.player);
    },
    logTarget: "player",
    async content(event, trigger, player) {
      player.addTempSkill("mbaosi_inf", "phaseUseAfter");
      player.markAuto("mbaosi_inf", [trigger.player]);
    },
    group: ["mbaosi_directHit"],
    subSkill: {
      directHit: {
        forced: true,
        trigger: { player: "useCard" },
        filter(event, player) {
          const evt = event.getParent("phaseUse");
          return evt?.player == player && player.getHistory("useCard", (evtx) => evtx.getParent("phaseUse") == evt).indexOf(event) == game.roundNumber - 1;
        },
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.players);
          game.log(trigger.card, "不可被响应");
        }
      },
      inf: {
        charlotte: true,
        onremove: true,
        forced: true,
        intro: { content: "对$使用牌无次数限制" },
        mod: {
          cardUsableTarget(card, player, target) {
            if (player.getStorage("mbaosi_inf").includes(target)) {
              return true;
            }
          }
        }
      }
    }
  },
  //☆周不疑
  mbhuiyao: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    // filterTarget:lib.filter.notMe,
    async content(event, trigger, player) {
      await player.damage("nosource");
      const players = game.filterPlayer((current) => current !== player);
      if (players.length < 1) {
        return;
      }
      const result = players.length === 1 ? { bool: true, targets: [players[0], player] } : await player.chooseTarget({
        prompt: `慧夭：请选择两名角色`,
        prompt2: `令不为你的第一名角色视为对第二名角色造成过1点伤害。`,
        filterTarget(card, player2, target) {
          return ui.selected.targets.length > 0 || player2 !== target;
        },
        selectTarget: 2,
        forced: true,
        ai(target) {
          return target === get.event().aiTargets[ui.selected.targets.length] ? 10 : 0;
        }
      }).set("multitarget", true).set("targetprompt", ["伤害来源", "受伤角色"]).set("aiTargets", lib.skill.mbhuiyao.getUnrealDamageTargets(player, [players, [...players, player]], true)).forResult();
      if (!result.bool || !result.targets?.length) {
        return;
      }
      const targets = result.targets;
      player.line2(targets, "green");
      await game.delaye();
      await targets[1].damage({
        source: targets[0],
        unreal: true
      });
    },
    getUnrealDamageTargets(player, lists, forced) {
      const targets = [null, null];
      let sourceList;
      let targetList;
      if (lists.length === 2 && lists.every((l) => Array.isArray(l))) {
        sourceList = lists[0];
        targetList = lists[1];
      } else {
        sourceList = lists.slice();
        targetList = lists.slice();
      }
      const list = targetList.map((current) => {
        const hp = current.hp;
        const maxHp = current.maxHp;
        current.hp = 100;
        current.maxHp = 100;
        const att = -get.sgnAttitude(player, current);
        let val = get.damageEffect(current, player, current) * att;
        current.getSkills(null, false, false).forEach((skill) => {
          const info = get.info(skill);
          if (info && info.ai && (info.ai.maixie || info.ai.maixie_hp || info.ai.maixie_defend)) {
            val = Math[val > 0 ? "max" : "min"](val > 0 ? 0.1 : -0.1, val + 2 * att);
          }
        });
        const eff = 100 / val + 15;
        current.hp = hp;
        current.maxHp = maxHp;
        return [current, eff];
      }).sort((a, b) => b[1] - a[1])[0];
      if (list[1] < 0 && !forced) {
        return targets;
      }
      const targetx = list[0];
      targets[1] = targetx;
      const list2 = sourceList.filter((i) => i !== targetx).map((current) => {
        const hp = targetx.hp;
        const maxHp = targetx.maxHp;
        targetx.hp = 100;
        targetx.maxHp = 100;
        const att = -get.sgnAttitude(player, current);
        const eff = get.damageEffect(targetx, current, current) * att;
        targetx.hp = hp;
        targetx.maxHp = maxHp;
        return [current, eff];
      }).sort((a, b) => b[1] - a[1])[0];
      if (!list2) {
        return targets;
      }
      targets[0] = list2[0];
      return targets;
    },
    ai: {
      order: 6,
      result: {
        player(player) {
          if (player.getHp() + player.countCards("hs", (card) => player.canSaveCard(card, player)) <= 1) {
            return 0;
          }
          let limit = 25;
          const quesong = player.hasSkill("mbquesong") && !player.getStat().damaged;
          if (quesong) {
            limit -= 7.5;
          }
          if (quesong && game.hasPlayer((target) => {
            const att = get.attitude(player, target);
            if (att < 0) {
              return false;
            }
            return att * Math.sqrt(
              Math.max(
                1,
                [1, 2, 3, 4].reduce((p, c) => p + target.countEmptySlot(c), 0)
              )
            ) >= 10 || target.getHp() <= 2;
          })) {
            return 1;
          }
          if (!quesong && game.hasPlayer((target) => {
            if (target === player) {
              return false;
            }
            const hp = target.hp;
            const maxHp = target.maxHp;
            target.hp = 100;
            target.maxHp = 100;
            const att = -get.sgnAttitude(player, target);
            let val = get.damageEffect(target, player, target) * att;
            target.getSkills(null, false, false).forEach((skill) => {
              const info = get.info(skill);
              if (info && info.ai && (info.ai.maixie || info.ai.maixie_hp || info.ai.maixie_defend)) {
                val = Math[val > 0 ? "max" : "min"](val > 0 ? 0.1 : -0.1, val + 2 * att);
              }
            });
            const eff = 100 / val;
            target.hp = hp;
            target.maxHp = maxHp;
            if (eff < limit) {
              return false;
            }
            return true;
          })) {
            return 1;
          }
          return 0;
        }
      },
      combo: "mbquesong",
      halfneg: true
    }
  },
  mbquesong: {
    audio: 2,
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      return player.hasHistory("damage");
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), [1, 3]).set("ai", (target) => {
        const player2 = get.player();
        if (get.attitude(player2, target) <= 0) {
          return 0;
        }
        var len = 4 - (ui.selected.targets.length + 1), hp = target.getHp();
        return len + target.isTurnedOver() * 2 + 1.5 * Math.min(4, target.getDamagedHp()) / (hp + 1);
      }).forResult();
    },
    async content(event, trigger, player) {
      const { targets } = event;
      const num = targets.length;
      await game.doAsyncInOrder(targets, async (target) => {
        const bool = num > 1 ? target.countDiscardableCards(target, "he") >= num - 1 : target.isDamaged();
        const list = [`摸${get.cnNumber(4 - num)}张牌并复原武将牌`];
        if (bool) {
          list.push(`${num > 1 ? `弃置${get.cnNumber(num - 1)}张牌，然后` : ""}回复1点体力`);
          if (player.getHistory("damage").length > num) {
            list.push(`依次执行以上两项，然后非锁定失效直到你下个回合开始`);
          }
        }
        const result = list.length == 1 ? { index: 0 } : await target.chooseControl().set("choiceList", list).set("prompt", "雀颂：请选择一项").set("ai", () => {
          const { num: num2, player: player2 } = get.event();
          return get.effect(player2, { name: "draw" }, player2, player2) * (4 - num2) >= get.effect(player2, { name: "guohe_copy2" }, player2, player2) + get.recoverEffect(player2, player2, player2) ? 0 : 1;
        }).set("num", num).forResult();
        if (typeof result?.index == "number") {
          const { index } = result;
          if (index % 2 == 0) {
            await target.draw(4 - num);
            await target.link(false);
            await target.turnOver(false);
          }
          if (index > 0) {
            if (num > 1) {
              await target.chooseToDiscard(num - 1, "he", true);
            }
            await target.recover();
          }
          if (index == 2) {
            target.addTempSkill("fengyin", { player: "phaseBeforeStart" });
          }
        }
      });
    },
    ai: {
      expose: 0.2,
      maixie: true,
      skillTagFilter(player, tag) {
        if (player.getStat().damaged) {
          return false;
        }
      }
    }
  },
  old_mbquesong: {
    audio: "mbquesong",
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      return player.hasHistory("damage");
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2("mbquesong"),
        ai(target) {
          const player2 = get.player();
          if (get.attitude(player2, target) <= 0) {
            return 0;
          }
          const len = lib.skill.old_mbquesong.getNum(target);
          const hp = target.getHp();
          return len + target.isTurnedOver() * 2 + 1.5 * Math.min(4, target.getDamagedHp()) / (hp + 1);
        }
      }).forResult();
    },
    logTarget: "targets",
    async content(event, trigger, player) {
      const target = event.targets[0];
      const len = lib.skill.old_mbquesong.getNum(target);
      const choice = target.isHealthy() ? { index: 0 } : await target.chooseControl({
        prompt: "雀颂：请选择一项",
        choiceList: [`摸${get.cnNumber(len)}张牌并复原武将牌`, "回复1点体力"],
        ai() {
          const { player: player2, len: len2 } = get.event();
          return get.effect(player2, { name: "draw" }, player2, player2) * len2 >= get.recoverEffect(player2, player2, player2) ? 0 : 1;
        }
      }).set("len", len).forResult();
      if (choice.index == 1) {
        await target.recover();
        return;
      }
      await target.draw(lib.skill.old_mbquesong.getNum(target));
      await target.link(false);
      await target.turnOver(false);
    },
    getNum(player) {
      return player.countCards("e", (card) => get.subtype(card) !== "equip5") >= 3 ? 2 : 3;
    },
    ai: {
      expose: 0.2,
      maixie: true,
      skillTagFilter(player, tag) {
        if (player.getStat().damaged) {
          return false;
        }
      }
    }
  },
  //王戎
  mpjianlin: {
    audio: 2,
    trigger: {
      global: "phaseAfter"
    },
    getCards(player) {
      const cards2 = [];
      game.checkGlobalHistory("cardMove", (evt) => {
        if (evt.name == "lose") {
          if (evt.position !== ui.discardPile) {
            return false;
          }
        } else if (evt.name !== "cardsDiscard") {
          return false;
        }
        if (get.info("mpjianlin").isUseOrRespond(evt, player)) {
          cards2.addArray(
            evt.cards.filter((card) => {
              return get.type(card) == "basic" && get.position(card) === "d";
            })
          );
        }
      });
      player.checkHistory("lose", (evt) => {
        if (evt.type == "discard") {
          cards2.addArray(
            evt.cards2.filter((card) => {
              return get.type(card) == "basic" && get.position(card) === "d";
            })
          );
        }
      });
      return cards2;
    },
    isUseOrRespond(event, player) {
      if (event.name !== "cardsDiscard") {
        return false;
      }
      const evtx = event.getParent();
      if (evtx.name !== "orderingDiscard") {
        return false;
      }
      const evt2 = evtx.relatedEvent || evtx.getParent();
      return ["useCard", "respond"].includes(evt2.name) && evt2.player == player;
    },
    filter(event, player) {
      return get.info("mpjianlin").getCards(player).length;
    },
    async cost(event, trigger, player) {
      const cards2 = get.info(event.skill).getCards(player);
      const { bool, links } = await player.chooseButton(["俭吝：你可以获得其中一张牌", cards2]).set("ai", get.buttonValue).forResult();
      event.result = {
        bool,
        cost_data: links
      };
    },
    async content(event, trigger, player) {
      player.gain(event.cost_data, "gain2");
    }
  },
  mpsixiao: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    locked: true,
    filter(event, player) {
      return (event.name != "phase" || game.phaseNumber == 0) && game.hasPlayer((current) => current != player);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(true, lib.filter.notMe, "死孝：请选择一名角色当其孝子", lib.translate.mpsixiao_info).set("ai", (target) => {
        return get.attitude(get.player(), target);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      game.log(player, "成为了", target, "的孝子");
      target.storage.mpsixiao_use = player;
      target.addSkill("mpsixiao_use");
    },
    subSkill: {
      use: {
        charlotte: true,
        mark: "character",
        intro: {
          content: "当你需要使用或打出牌时，你可以观看$的手牌并可以使用或打出其中一张牌，然后$摸一张牌"
        },
        hiddenCard(player, name) {
          if (!lib.inpile.includes(name) || player.hasSkill("mpsixiao_used", null, null, false)) {
            return false;
          }
          const target = player.storage.mpsixiao_use;
          const cards2 = target.getCards("h");
          for (var i of cards2) {
            if (get.name(i, target) == name) {
              return true;
            }
          }
          return false;
        },
        enable: ["chooseToUse", "chooseToRespond"],
        filter(event, player) {
          const target = player.storage.mpsixiao_use;
          const cards2 = target.getCards("h");
          if (player.hasSkill("mpsixiao_used", null, null, false)) {
            return false;
          }
          return cards2.some(
            (i) => event.filterCard(
              {
                name: get.name(i, target),
                nature: get.nature(i, target),
                isCard: true
              },
              player,
              event
            )
          );
        },
        chooseButton: {
          dialog(event, player) {
            const target = player.storage.mpsixiao_use;
            const cards2 = target.getCards("h");
            return ui.create.dialog("死孝", cards2);
          },
          filter(button, player) {
            const evt = _status.event.getParent();
            const target = player.storage.mpsixiao_use;
            return evt.filterCard(
              {
                name: get.name(button.link, target),
                nature: get.nature(button.link, target),
                isCard: true
              },
              player,
              evt
            );
          },
          check(button) {
            const player = get.player();
            const evt = _status.event.getParent();
            if (evt.dying) {
              return get.attitude(player, evt.dying);
            }
            if (_status.event.getParent().type != "phase") {
              return 1;
            }
            return player.getUseValue(get.autoViewAs(button.link), null, true);
          },
          backup(links, player) {
            const target = player.storage.mpsixiao_use;
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
              async precontent(event, trigger, player2) {
                const card = lib.skill.mpsixiao_use_backup.card, target2 = player2.storage.mpsixiao_use;
                event.result.card = card;
                event.result.cards = [card];
                player2.logSkill("mpsixiao_use", target2);
                player2.addTempSkill("mpsixiao_used");
                target2.when({ global: ["useCardAfter", "respondAfter"] }).filter((evt) => evt.player == player2 && evt.skill == "mpsixiao_use_backup").step(async () => {
                  await target2.draw();
                });
              }
            };
          },
          ai: {
            respondSha: true,
            respondShan: true,
            skillTagFilter(player, tag) {
              const name = "s" + tag.slice("respondS".length);
              return lib.skill.mpsixiao_use.hiddenCard(player, name);
            }
          }
        },
        ai: {
          order: 8,
          result: {
            player: 1
          }
        }
      },
      used: {}
    }
  },
  //小程序刘伶
  mpjiusong: {
    audio: 2,
    enable: "chooseToUse",
    trigger: { global: "useCard" },
    filterCard(card) {
      return get.type2(card) == "trick";
    },
    viewAs: { name: "jiu" },
    position: "hs",
    viewAsFilter(player) {
      return player.hasCard((card) => get.type2(card) == "trick", "hs");
    },
    check(card) {
      if (get.itemtype(card) !== "card") {
        return true;
      }
      if (get.event().type == "dying") {
        return 1 / Math.max(0.1, get.value(card));
      }
      return 4 - get.value(card);
    },
    prompt: "将一张锦囊牌当【酒】使用",
    filter(event, player) {
      if (event.name == "chooseToUse") {
        return player.hasCard((card) => get.type2(card) == "trick", "hs");
      }
      return event.card?.name == "jiu" && player.countMark("mpjiusong") < 3;
    },
    forced: true,
    locked: false,
    async content(event, trigger, player) {
      player.addMark("mpjiusong");
    },
    marktext: "醉",
    intro: {
      name: "醉(酒颂/酕醄)",
      name2: "醉",
      content: "mark"
    }
  },
  mpmaotao: {
    audio: 2,
    trigger: { global: "useCardToPlayer" },
    filter(event, player) {
      if (event.targets.length != 1 || !event.isFirstTarget) {
        return false;
      }
      if (!["basic", "trick"].includes(get.type(event.card))) {
        return false;
      }
      return event.player != player && player.hasMark("mpjiusong");
    },
    prompt2(event, player) {
      event.target;
      const card = event.card;
      const source = event.player;
      let list;
      if (get.type(card) != "delay") {
        list = game.filterPlayer((current) => {
          return lib.filter.targetEnabled2(card, source, current);
        });
      } else {
        list = game.filterPlayer((current) => lib.filter.judge(card, source, current));
      }
      const gainText = `${list.length > 1 && !player.storage.mpmaotao_gained ? `若新目标与原目标相同，你` : ""}${!player.storage.mpmaotao_gained ? "获得牌堆中的一张锦囊牌。" : ""}`;
      return `移去1枚“醉”${list.length > 1 ? `，令${get.translation(card)}目标改为${get.translation(list)}中的一名随机角色` : ""}。${gainText}`;
    },
    check(event, player) {
      const target = event.target;
      const card = event.card;
      const source = event.player;
      const eff = get.effect(target, card, source, player);
      let list;
      if (get.type(card) != "delay") {
        list = game.filterPlayer((current) => {
          return lib.filter.targetEnabled2(card, source, current);
        });
      } else {
        list = game.filterPlayer((current) => lib.filter.judge(card, source, current));
      }
      if (list.length == 1 && !player.storage.mpmaotao_gained) {
        return true;
      }
      if (eff > 0) {
        return false;
      }
      let list2 = list.filter((current) => get.effect(current, card, source, player) > eff);
      let list3 = list.filter((current) => get.effect(current, card, source, player) > 0);
      return list2.length >= list.length / 2 || player.countMark("mpjiusong") >= 2 && list3.length >= list.length / 2;
    },
    async content(event, trigger, player) {
      player.removeMark("mpjiusong", 1);
      const card = trigger.card;
      const source = trigger.player;
      let target = trigger.target;
      let list, oriTarget = trigger.target;
      trigger.targets.remove(oriTarget);
      trigger.getParent().triggeredTargets1.remove(oriTarget);
      trigger.untrigger();
      await game.delayx();
      if (get.type(trigger.card) != "delay") {
        list = game.filterPlayer((current) => {
          return lib.filter.targetEnabled2(card, source, current);
        });
      } else {
        list = game.filterPlayer((current) => lib.filter.judge(card, source, current));
      }
      if (list.length) {
        target = list.randomGet();
      }
      trigger.targets.push(target);
      source.line(target, "thunder");
      game.log(card, "的目标被改为", target);
      if (target == oriTarget && !player.storage.mpmaotao_gained) {
        const card2 = get.cardPile2((card3) => get.type2(card3) == "trick");
        if (card2) {
          player.addTempSkill("mpmaotao_gained");
          await player.gain(card2, "gain2");
        } else {
          player.chat("没牌了！");
          game.log("但是牌堆中已经没有", "#y锦囊牌", "了!");
        }
      }
    },
    ai: { combo: "mpjiusong" },
    subSkill: {
      gained: {
        charlotte: true,
        init(player, skill) {
          player.storage[skill] ??= true;
        },
        onremove: true,
        mark: true,
        intro: { content: "本回合已因【酕醄】获得过锦囊牌" }
      }
    }
  },
  mpbishi: {
    audio: 2,
    forced: true,
    trigger: { global: "useCard1" },
    filter(event, player) {
      if (get.type2(event.card) != "trick" || !get.tag(event.card, "damage")) {
        return false;
      }
      if (!lib.skill.xunshi.isXunshi(event.card)) {
        return false;
      }
      const targets = event.targets.slice();
      targets.remove(event.player);
      return targets.length == game.countPlayer() - 2;
    },
    async content(event, trigger, player) {
    },
    mod: {
      targetEnabled(card) {
        if (get.type2(card) == "trick" && get.tag(card, "damage") > 0) {
          return false;
        }
      }
    }
  }
};
const translates = {
  yj_wanglang: "☆王朗",
  yj_wanglang_prefix: "☆",
  fuyu: "负隅",
  fuyu_info: "每回合每项各限一次，当你成为其他角色使用基本牌或普通锦囊牌的唯一目标时，或你使用基本牌或普通锦囊牌指定其他角色为唯一目标时，你可与其拼点：若此牌的使用者赢，此牌额外结算一次；若此牌的使用者没赢，此牌无效。若你的拼点结果与上一次发动此技能时相同，你摸两张牌。",
  zhanshi: "瞻势",
  zhanshi_info: "当有角色进行拼点时，你可选择此次拼点中的任意名角色并弃置等量张牌，此次拼点结算后，你选择的角色中每有一名角色赢，你摸三张牌。",
  v_sunce: "威孙策",
  v_sunce_prefix: "威",
  dczhifeng: "猘锋",
  dczhifeng_info: "每回合限X次（X为游戏人数）。当你的手牌数：大于体力值时，你可将至少一张黑色牌当作不计入次数的【酒】使用；小于体力值时，你可将一张红色牌当作无距离限制的任意【杀】使用或打出，然后将手牌摸至体力上限；等于体力值时，你可将任意张牌当作【决斗】对至多两名角色使用。",
  dcweijing: "威靖",
  dcweijing_info: `其他吴势力角色的回合开始时，你可令其执行一项：1、受到你造成的1点伤害；2、交给你一张牌，然后其可发动一次对应条件的${get.poptip("dczhifeng")}。`,
  yj_zhanghe: "☆张郃",
  yj_zhanghe_prefix: "☆",
  yj_zhangliao: "☆张辽",
  yj_zhangliao_prefix: "☆",
  yj_xuhuang: "☆徐晃",
  yj_xuhuang_prefix: "☆",
  yj_ganning: "☆甘宁",
  yj_ganning_prefix: "☆",
  xhzhiyan: "治严",
  xhzhiyan_info: "出牌阶段，若你的手牌数不等于体力上限，则你可以将手牌摸至/弃至手牌上限，然后本回合不能对其他角色使用牌/可以将弃置的一张牌交给一名其他角色。",
  zhilve: "知略",
  zhilve_info: "锁定技，准备阶段，你选择一项：1.移动场上装备区的一张牌并失去1点体力。2.移动场上判定区的一张牌并令本回合手牌上限-1。3.本回合摸牌阶段多摸一张牌且使用的第一张【杀】无距离限制且不计入次数限制。",
  xinzhilve: "知略",
  xinzhilve_info: "出牌阶段限一次，你可以失去1点体力并选择一项：1.移动场上的一张牌；2.视为使用一张无距离限制且不计入次数限制的【杀】并摸一张牌。然后你本回合的手牌上限+1。",
  xinxhzhiyan: "治严",
  xinxhzhiyan_false: "治严",
  xinxhzhiyan_info: "出牌阶段每项各限一次，若你的手牌数：大于体力值，则你可以将X张手牌交给一名其他角色（X为你的手牌数与体力值之差）；小于体力上限，则你可以摸X张牌且本阶段内不能再对其他角色使用牌。（X为你的手牌数与体力上限之差）",
  weifeng: "威风",
  weifeng2: "威风",
  weifeng3: "威风",
  weifeng_info: "锁定技，当你于出牌阶段内使用第一张伤害性基本牌或普通锦囊牌后，你令此牌的一名没有“惧”的其他目标角色获得一枚名称为此牌牌名的“惧”。有“惧”的角色受到伤害时，其移去“惧”，然后若造成伤害的牌名称和“惧”：相同，此伤害+1；不同，你获得该角色的一张牌。准备阶段开始时或你死亡时，你移去场上的所有“惧”。",
  gnjinfan: "锦帆",
  gnjinfan_gain: "锦帆",
  gnjinfan_info: "弃牌阶段开始时，你可将任意张手牌置于武将牌上，称为“铃”（每种花色的“铃”限一张）。你可以如手牌般使用或打出“铃”。当有“铃”移动到处理区后，你从牌堆中获得与“铃”花色相同的一张牌。",
  gnsheque: "射却",
  gnsheque_info: "一名其他角色的准备阶段开始时，若其装备区内有牌，则你可以对其使用一张【杀】（无距离关系的限制且无视防具）。",
  yj_huangzhong: "☆黄忠",
  yj_huangzhong_prefix: "☆",
  spshidi: "势敌",
  spshidi_info: "转换技，锁定技。①准备阶段/结束阶段开始时，若你发动此分支的累计次数为奇数/偶数，则你获得一个“☯”。②若你的“☯”数为偶数，则你至其他角色的距离-1，且你使用的黑色【杀】不可被响应。③若你的“☯”数为奇数，则其他角色至你的距离+1，且你不可响应红色【杀】。",
  spyishi: "义释",
  spyishi_info: "当你对装备区有牌的其他角色造成伤害时，你可令此伤害-1，然后获得其装备区内的一张牌。",
  spqishe: "骑射",
  spqishe_info: "你可以将一张装备牌当做【酒】使用。你的手牌上限+X（X为你装备区内的牌数）。",
  yj_weiyan: "☆魏延",
  yj_weiyan_prefix: "☆",
  mbguli: "孤厉",
  mbguli_info: "出牌阶段限一次。你可以将所有手牌当做一张无视防具且无次数限制的【杀】使用。此牌结算结束后，你可以将手牌摸至X张（X为你的体力上限），然后若此牌未造成过伤害，你失去1点体力。",
  mbaosi: "骜肆",
  mbaosi_info: "锁定技。当你于出牌阶段对一名攻击范围内的角色造成伤害后，你于此阶段对其使用牌无次数限制。你于出牌阶段使用的第X张牌不可被响应（X为游戏轮数）。",
  yj_zhoubuyi: "☆周不疑",
  yj_zhoubuyi_prefix: "☆",
  mbhuiyao: "慧夭",
  mbhuiyao_info: "出牌阶段限一次。你可以受到1点无来源伤害，然后你选择一名其他角色，令其视为对另一名角色造成过1点伤害。",
  mbquesong: "雀颂",
  mbquesong_info: "一名角色的结束阶段，若你于本回合受到过伤害，你可以令至多三名角色选择一项：1.摸4-X张牌并复原武将牌；2.弃置X-1张牌然后回复1点体力（X为此次选择的角色数）。若你本回合受到过伤害的次数大于X，被选择的角色可以依次执行两项，然后其非锁定技失效直到其下个回合开始。",
  old_mbquesong: "雀颂",
  old_mbquesong_info: "一名角色的结束阶段，若你于本回合受到过伤害，你可以令一名角色选择一项：1.摸X张牌并复原武将牌（X为3，若其装备区非宝物牌牌数不小于三张则X为2）；2.回复1点体力。",
  lukai: "陆凯",
  lukai_spade: "♠",
  lukai_spade_bg: "♠️",
  lukai_heart: "♥",
  lukai_heart_bg: "♥️",
  lukai_club: "♣",
  lukai_club_bg: "♣",
  lukai_diamond: "♦",
  lukai_diamond_bg: "♦️️",
  lkbushi: "卜筮",
  lkbushi_info: "①你使用♠牌无次数限制。②当你使用或打出♥牌后，你摸一张牌。③当你成为♣牌的目标后，你可以弃置一张牌，令此牌对你无效。④结束阶段开始时，你从牌堆获得一张♦牌。⑤准备阶段开始时，你可调整此技能中四种花色的对应顺序。",
  lkzhongzhuang: "忠壮",
  lkzhongzhuang_info: "锁定技。①当你因执行【杀】的效果而造成伤害时，若你的攻击范围大于3，则此伤害+1。②当一名角色受到你因执行【杀】的效果而造成的伤害时，若你的攻击范围小于3，则此伤害改为1。",
  kebineng: "轲比能",
  kousheng: "寇旌",
  kousheng_info: "①出牌阶段开始时，你可以选择任意张手牌，这些牌称为“寇旌”直到回合结束。②你的“寇旌”均视为【杀】且无次数限制。③当你因执行对应实体牌包含“寇旌”的【杀】的效果而造成伤害后，你展示所有“寇旌”牌，然后目标角色可以用所有手牌交换这些牌。",
  zhugeshang: "诸葛尚",
  sangu: "三顾",
  sangu_info: "结束阶段，你可以选择至多三个{【杀】或不为notarget或singleCard的普通锦囊牌}中的牌名，然后令一名其他角色记录这些牌名。该角色的下个出牌阶段开始时，其的手牌于其需要使用牌时均视为其记录中的第一张牌直到此阶段结束，且当其使用或打出有对应实体牌的牌时，移除这些牌中的第一张牌。若你以此法选择过的牌名均为你本回合内使用过的牌名，则防止你因其以此法使用牌造成的伤害。",
  yizu: "轶祖",
  yizu_info: "锁定技。每回合限一次，当你成为【杀】或【决斗】的目标后，若你的体力值不大于使用者的体力值，则你回复1点体力。",
  liwan: "李婉",
  liandui: "联对",
  liandui_info: "①当你使用牌时，若本局游戏内上一张被使用的牌的使用者不为你，你可以令其摸两张牌。②其他角色使用牌时，若本局游戏内上一张被使用的牌的使用者为你，其可以令你摸两张牌。",
  biejun: "别君",
  biejun_info: "①其他角色的出牌阶段限一次。其可以将一张手牌交给你。②每回合限一次。当你受到伤害时，若你手牌中没有本回合因〖别君①〗得到的牌，你可以翻面并防止此伤害。",
  yj_sufei: "苏飞",
  shuojian: "数荐",
  shuojian_info: "出牌阶段限三次。你可以交给一名其他角色一张牌，其选择一项：1.令你摸X张牌并弃置X-1张牌；2.视为使用X张【过河拆桥】，然后此技能本回合失效（X为此技能本阶段剩余发动次数+1）。",
  yj_qiaozhou: "谯周",
  shiming: "识命",
  shiming_info: "每轮限一次。一名角色的摸牌阶段，你可以观看牌堆顶的三张牌，并可以将其中一张置于牌堆底。然后该角色可以改为对自己造成1点伤害，然后从牌堆底摸三张牌。",
  jiangxi: "将息",
  jiangxi_info: `一名角色的回合结束时，若一号位于此回合内进入过濒死状态或未受到过伤害，你可以重置${get.poptip("shiming")}并摸一张牌；若所有角色均未受到过伤害，你可以与当前回合角色各摸一张牌。`,
  hanlong: "韩龙",
  duwang: "独往",
  duwang_info: "锁定技。①游戏开始时，你从牌堆顶将五张不为【杀】的牌置于武将牌上，称为“刺”。②若你有牌名不为【杀】的“刺”，你至其他角色或其他角色至你的距离+1。",
  cibei: "刺北",
  cibei_info: "①当一名角色使用非转化【杀】造成伤害且此牌对应的实体牌进入弃牌堆后，你可以将一张不为【杀】的“刺”置入弃牌堆，并将这些牌置入“刺”，然后弃置一名角色区域里的一张牌。②一名角色的回合结束时，若你的“刺”均为【杀】，你获得所有“刺”，且这些牌不能被弃置，不计入手牌上限，且当你使用对应实体牌包含这些牌的牌时无次数和距离限制。",
  wuanguo: "武安国",
  diezhang: "叠嶂",
  diezhang_info: "转换技。①出牌阶段，你使用【杀】的次数上限+1。②阳：当你使用牌被其他角色抵消后，你可以弃置一张牌，视为对其使用X张【杀】；阴：当其他角色使用牌被你抵消后，你可以摸X张牌，视为对其使用一张【杀】（X为1）。",
  duanwan: "断腕",
  duanwan_info: "限定技。当你处于濒死状态时，你可以将体力回复至2点，然后删除〖叠嶂①〗和当前转换技状态的〖叠嶂②〗分支，并将〖叠嶂〗修改为“每回合限一次”且将X修改为2。",
  dcduliang: "督粮",
  dcduliang2: "督粮",
  dcduliang_info: "出牌阶段限一次。你可以获得一名其他角色的一张牌，然后选择一项：1.你观看牌堆顶的两张牌，然后令其获得其中的一或两张基本牌；2.令其于下回合的摸牌阶段额外摸一张牌。",
  sunli: "孙礼",
  kangli: "伉厉",
  kangli_info: "当你造成或受到伤害后，你可以摸两张牌。然后你下次造成伤害时弃置这些牌。",
  xiahoumao: "夏侯楙",
  tongwei: "统围",
  tongwei_info: "出牌阶段限一次。你可以重铸两张牌并指定一名其他角色，当其使用的下一张牌结算结束后，若此牌点数在你上次以此法重铸的牌的点数之间，你视为对其使用一张【杀】或【过河拆桥】。",
  cuguo: "蹙国",
  cuguo_info: "锁定技。当你于一回合使用牌首次被抵消后，你弃置一张牌，视为对此牌的目标角色使用一张该被抵消的牌。此牌结算结束后，若此牌被抵消，你失去1点体力。",
  chenshi: "陈式",
  qingbei: "擎北",
  qingbei_info: "①每轮开始时，你可以选择任意种花色，你不能于本轮内使用这些花色的牌。②你使用有花色的牌结算结束后，你摸X张牌（X为你本轮〖擎北①〗选择的花色数）。",
  feiyao: "费曜",
  zhenfeng: "镇锋",
  zhenfeng_info: "每回合限一次。当其他角色于其回合内使用牌时，若其手牌数不大于其体力值，你可以猜测其手牌中与此牌类别相同的牌数。若你猜对，你摸X张牌并视为对其使用一张【杀】（X为你连续猜对的次数且至多为5）；若你猜错且差值大于1，其视为对你使用一张【杀】。",
  linghuyu: "令狐愚",
  yj_simafu: "司马孚",
  yj_xuangongzhu: "宣公主",
  xukun: "徐琨",
  xvzhi: "蓄志",
  xvzhi_info: "出牌阶段限一次，你可令两名角色各选择任意张手牌并交换这些牌，然后获得牌数较少的角色视为使用无视距离的【杀】；若获得牌数相等，你摸两张牌且可以对此阶段未以此法选择过的角色再发动一次〖蓄志〗。",
  beiyu: "备预",
  beiyu_info: "出牌阶段限一次，你可将手牌摸至体力上限并将一种花色的所有手牌置于牌堆底。",
  duchi: "督持",
  duchi_info: "每回合限一次，当你成为其他角色使用牌的目标后，你可从牌堆底摸一张牌并展示所有手牌，若颜色均相同，则此牌对你无效。",
  yjqimei: "齐眉",
  yjqimei_info: "出牌阶段限一次，你可以选择一名其他角色，你与其各摸两张牌并展示两张手牌，然后你根据你与其展示牌的花色总数执行以下效果：1、你依次使用这些展示的牌中可以使用的牌；2、你与其复原武将牌；3、你与其重铸展示牌；4、你与其各摸一张牌。",
  yjzhuiji: "追姬",
  yjzhuiji_info: "当你死亡时，你可以令一名角色从牌堆和弃牌堆中的随机使用任意装备牌直至其没有空置的装备栏。若如此做，当其失去以此法使用的装备牌后，其废除对应的装备栏。",
  fazhu: "筏铸",
  fazhu_info: "准备阶段，你可以重铸你的区域内任意张非伤害牌，然后将以此法获得的牌交给至多等量名角色各一张，这些角色可以依次使用一张无距离限制的【杀】。",
  xunyuxunyou: "荀彧荀攸",
  zhinang: "智囊",
  zhinang_info: "①当你使用锦囊牌后，你可以获得一个技能台词包含“谋”的技能直到再发动此项；②当你使用装备牌后，你可以获得一个技能名包含“谋”的技能直到再发动此项。",
  gouzhu: "苟渚",
  gouzhu_info: "你失去技能后，若此技能为：锁定技，回复1点体力；觉醒技，获得一张基本牌；限定技，对随机一名其他角色造成1点伤害；转换技，手牌上限+1；主公技，增加1点体力上限。",
  yj_sb_guojia: "新杀谋郭嘉",
  yj_sb_guojia_prefix: "新杀谋",
  xianmou: "先谋",
  xianmou_info: "转换技。①游戏开始时，你可以转换此技能状态；②你失去过牌的回合结束时，你可以：阳，观看牌堆顶五张牌并获得至多X张牌，若未获得X张牌则获得〖遗计〗直到再发动此项；阴，观看一名角色手牌并弃置其中至多X张牌，若弃置X张牌则你进行一次【闪电】判定。（X为你本回合失去牌数）",
  lunshi: "论势",
  lunshi_info: "其他角色对其以外的角色使用普通锦囊牌的结算中，若你手牌中两种颜色的牌数量相同，你可将一张手牌当作不可被响应的【无懈可击】使用。",
  mp_liuling: "刘伶",
  mpjiusong: "酒颂",
  mpjiusong_info: "①你可以将一张锦囊牌当【酒】使用。②当一名角色使用【酒】时，你获得1枚“醉”标记（“醉”数至多为3）。",
  mpmaotao: "酕醄",
  mpmaotao_info: "当其他角色使用基本牌或普通锦囊牌指定唯一目标时，你可以移去1枚“醉”，令此牌的目标改为随机一名合法角色（无距离限制）。若目标角色与原目标相同且你本回合未以此法获得过牌，你从牌堆中随机获得一张锦囊牌。",
  mpbishi: "避世",
  mpbishi_info: "锁定技。你不能成为伤害类锦囊牌的目标。",
  mp_wangrong: "王戎",
  mpjianlin: "俭吝",
  mpjianlin_info: "每回合结束后，若本回合你有基本牌因使用、打出或弃置而进入弃牌堆，则你可以选择其中一张牌获得之。",
  mpsixiao: "死孝",
  mpsixiao_info: "锁定技，游戏开始时，你选择一名其他角色。每回合限一次，当该角色需要使用或打出牌时，其可以观看你的手牌并可以使用或打出其中一张牌，然后你摸一张牌。",
  yj_majun: "马钧",
  gongqiao: "工巧",
  gongqiao_info: "①出牌阶段限一次。你可以将一张手牌置于你的任意装备栏内（可替换原装备牌）。②若你装备区内的实体牌有：⒈基本牌，当你使用基本牌时，你令此牌的牌面数值+1；⒉锦囊牌，当你于一回合内首次使用一种类型的牌后，你摸一张牌；⒊装备牌，你的手牌上限+3。",
  gongqiao_equip: "工巧",
  gongqiao_equip_info: "原本是一张装备牌。",
  gongqiao_trick: "工巧",
  gongqiao_trick_info: "原本是一张锦囊牌。",
  gongqiao_basic: "工巧",
  gongqiao_basic_info: "原本是一张基本牌。",
  jingyi: "精益",
  jingyi_info: "锁定技。每回合每个副类别限一次，当有实体牌进入你的装备区后，你摸X张牌，然后弃置两张牌（X为你装备区内实体牌的数量）。",
  chuanxie: "传械",
  chuanxie_info: "锁定技。①游戏开始时，你选择一个花色。②一名角色使用〖传械①〗花色时，你将〖传械①〗记录的花色改为下一个花色，然后从牌堆中获得一张再下一个花色的牌（顺序：♠/♥/♣/♦）。",
  yjqiaosi: "巧思",
  yjqiaosi_info: "每回合限一次，当你造成或受到伤害后，你可以将〖传械①〗记录的花色改为上一个或下一个花色。",
  yuliao: "余料",
  yuliao_info: "①每阶段限一次，有牌进入弃牌堆后，你可以将其中一张牌置于武将牌上，称为“材”（至多八张）。②当你进入濒死状态时，你可以将所有“材”置入弃牌堆，然后摸等量的牌。",
  qiqiao: "奇巧",
  qiqiao_info: "出牌阶段，你可以将两张“材”置入弃牌堆并选择一名角色装备区里的一张牌，其根据你移去的“材”获得以下效果直到此牌离开其装备区：基本牌：其使用【杀】的次数上限+1；锦囊牌，其使用锦囊牌不可被响应；装备牌，此牌离开其装备区时其摸两张牌。",
  yanxie: "研械",
  yanxie_info: "出牌阶段。①你可以将两张类别相同的“材”置入弃牌堆并摸等量的牌，然后随机从牌堆中获得一张装备牌。②你可以将一张装备牌置入一名其他角色的装备区中。",
  mp_xiangxiu: "向秀",
  mpmiaoxi: "妙析",
  mpmiaoxi_info: "出牌阶段限一次，你可以同时展示你和一名其他角色的一张手牌，若这两张牌：颜色相同，获得对方的展示牌；花色相同，令其失去1点体力；点数相同，本回合〖妙析〗发动次数+1，然后此项本回合失效。",
  mpsijiu: "思旧",
  mpsijiu_info: "回合结束时，若你本回合获得过其他角色的牌，你可以摸一张牌并观看一名角色的手牌。",
  new_yj_dongzhuo: "☆董卓",
  new_yj_dongzhuo_prefix: "☆",
  xiongjin: "雄进",
  xiongjin_info: "每轮每项各限一次。①出牌阶段开始时，你可以摸X张牌，然后本回合的弃牌阶段开始时，你弃置所有非基本牌。②其他角色的出牌阶段开始时，你可以令其摸X张牌，然后本回合的弃牌阶段开始时，其弃置所有基本牌。（X为你已损失的体力值，至少为1，至多为4）",
  zhenbian: "镇边",
  zhenbian_info: "锁定技。①你的手牌上限等于体力上限。②有牌非因使用进入弃牌堆后，你记录这些牌的花色，然后若你因此记录了至少四种花色且你的体力上限小于8，则你清除记录，增加1点体力上限并摸一张牌。",
  baoxi: "暴袭",
  baoxi_sha: "暴袭-杀",
  baoxi_juedou: "暴袭-决斗",
  baoxi_info: "每轮每项各限一次，当一次性至少有两张基本牌/非基本牌进入弃牌堆后，你可以减1点体力上限，将一张手牌当作无距离和次数限制的【决斗】/【杀】使用。",
  fj_peixiu: "裴秀",
  fjzhitu: "制图",
  fjzhitu_info: "当你使用基本牌或单目标普通锦囊牌指定唯一目标时，你可以令任意名你与其距离等于你与目标角色距离的角色也成为此牌的目标，若目标角色为你，则改为你可以令任意你与其距离为1的角色也成为此牌的目标。",
  dcfujue: "复爵",
  dcfujue_info: "出牌阶段限一次。你可以将你的手牌调整至五张，然后你可以移动场上一张牌。若你于此流程中获得且失去过牌，本回合你计算与其他角色的距离-1且你下次使用的牌不可被响应。",
  xjzhitu: "制图",
  xjzhitu_info: "①当你使用牌或成为牌的目标，若你未记录此牌的点数，你记录之并摸一张牌。②你使用已记录点数的牌无距离限制。③若你已记录所有点数，你使用牌不能被响应。",
  dcxiujue: "修爵",
  dcxiujue_info: "出牌阶段限一次，你可以与一名其他角色拼点。赢的角色可以依次使用双方的拼点牌（拼点角色外角色不是此牌的合法目标）。若平局，你与其各摸一张牌。",
  dchuairen: "怀刃",
  dchuairen_info: "你可以将装备区里的牌当无次数限制的基本牌使用。若此牌：牌面信息包含此基本牌，你摸两张牌；为装备区最后的牌，造成伤害值或回复量+1。",
  dcchizei: "斥贼",
  dcchizei_info: "你受到伤害时，可以用牌堆顶的牌与伤害来源拼点，若你：赢，你可重复此流程；没赢，你弃置X张牌（X为你本次赢的次数）。",
  wufu: "伍孚",
  dczhonge: "忠锷",
  dczhonge_info: "出牌阶段限一次，你可以将手牌调整至体力上限，与一名其他角色同时选择一项：1.你与其依次摸一张牌；2.你与其依次视为对对方使用一张【杀】。若其选择的项与你不同，你执行每项操作时额外执行一次。",
  dcjuekai: "绝忾",
  dcjuekai_info: `限定技，出牌阶段，你可以重置${get.poptip("dczhonge")}，然后直到出牌阶段结束，此阶段获得过牌的角色无法再使用手牌。`,
  yj_zhanghuan: "新杀张奂",
  yj_zhanghuan_prefix: "新杀",
  dcyiju: "义拒",
  dcyiju_info: "锁定技，其他角色使用牌指定你为唯一目标后，你弃置一张牌。",
  dcshuguo: "戍国",
  dcshuguo_info: "每回合结束时，你可以依次使用本回合因弃置而置入弃牌堆的牌直到你使用了其他角色弃置的牌。若你的手牌数不为全场唯一最多，每有一张本回合弃置的牌没有使用，你摸一张牌（至多摸5）。",
  yj_zhangyan: "新杀张燕",
  yj_zhangyan_prefix: "新杀",
  dcqiaolve: "趫掠",
  dcqiaolve_info: "你使用牌指定首个目标后，若包含了其他角色为目标且其本局游戏第一次成为该牌名的目标，你可以获得其一张牌。",
  dchanjie: "悍捷",
  dchanjie_info: "其他角色的回合开始时，若其体力值不小于你，你可以将一张黑色手牌当一张伤害牌对其使用。",
  yao_yuanshu: "爻袁术",
  yao_yuanshu_prefix: "爻",
  dcwangyao: "妄爻",
  dcwangyao_info: "游戏开始时，你获得阳“爻”、阴“爻”各一枚。你成为其他角色使用【杀】或普通锦囊牌的目标后，可以翻转一枚“爻”，然后若两枚“爻”阴阳相同，你摸一张牌。",
  dczengua: "谮卦",
  dczengua_info: "出牌阶段限一次，你可弃置一张手牌并选择一名其他角色，猜测其手牌中某种类型的牌是否为全场最多。若猜对，你获得其一张此类别的手牌；否则，其摸一张牌，你翻转一枚“爻”。",
  dckanghui: "亢悔",
  dckanghui_info: "锁定技，若你的“爻”均为：阳，你的手牌上限+2；阴：其他角色对你造成的伤害+1。",
  yj_puyuan_prefix: "SP",
  yj_puyuan: "SP蒲元",
  biancai: "辨材",
  biancai_info: "每回合开始时，你可以进行判定并获得判定牌，若结果为红色/黑色，你从牌堆/弃牌堆中获得一张装备牌。",
  cuiren: "淬刃",
  cuiren_info: "出牌阶段限一次，你可以弃置一张装备牌，并根据弃置牌的类别获得以下效果直到回合结束；武器：你使用牌无距离和次数限制；防具：你使用牌无法被响应；坐骑：你使用牌指定目标时，可以多指定任意个目标。",
  shenfeng: "神锋",
  shenfeng_info: "当你使用【杀】指定一名角色为目标后，你可以弃置一张装备牌，然后选择一项：1.令此【杀】伤害+1；2.令此【杀】造成的伤害视为失去体力；3.令其弃置两张牌。",
  pyhuanling: "唤灵",
  pyhuanling_info: "出牌阶段开始时或当你受到伤害后，你可以重铸一张牌，然后获得场上、弃牌堆或牌堆一张花色相同的装备牌，并从随机出现该装备的三个兵主技能选择其中一个令一名角色获得。若该角色不为你，你摸X张牌（X为其技能数）。",
  pyshenduan: "神锻",
  pyshenduan_info: "锁定技，每个副类别每回合限一次，你使用一张装备牌后，根据副类别执行对应效果：武器：视为使用一张【杀】；防具：增加1点体力上限并回复1点体力；进攻马：弃置每名其他角色各一张牌；防御马：摸一张牌且本局手牌上限+1。",
  yj_hanbing: "寒冰剑少女",
  bingling: "冰伶",
  bingling_info: "当你使用【杀】指定目标时，你可弃置目标角色两张牌。若这两张牌类别/花色/牌名字数/点数相同，则你获得这两张牌/回复1点体力/摸X张牌/令其失去所有体力（X为其中一张牌的牌名字数）；若皆不同，则你受到1点无来源的火焰伤害。",
  yj_tengjia: "藤甲男孩",
  tenggu: "藤固",
  tenggu_info: `锁定技，你不能装备防具牌，你视为装备着${get.poptip("tengjia")}；你因非火焰伤害而进入濒死时，若你的体力上限大于1，你减少1点体力上限并回复全部体力。`,
  dunyong: "钝勇",
  dunyong_info: "你对其他角色造成伤害时，若你的体力上限不为全场唯一最低，你受到等量伤害；有角色进入濒死时，你摸X张牌，令你本回合使用牌无距离次数限制（X为濒死角色的体力上限）。",
  renjia: "韧甲",
  renjia_info: "锁定技，你没有防具区；你每轮前两次受到的非属性伤害-1，受到的火焰伤害+1，且你造成或受到属性伤害后摸一张牌。",
  yj_yanyu: "焰狱",
  yj_yanyu_info: "限定技。出牌阶段，你可以展示两张手牌然后选择一名其他角色A，将牌堆中的一张【藤甲】置入其防具区内（顶替原装备），若如此做，你与所有其他不为A的角色手牌中与这两张牌花色相同的基本牌视为火【杀】、锦囊牌视为【火攻】、装备牌视为【铁索连环】，且这些牌被使用后你摸一张牌。",
  yj_fazheng: "☆法正",
  yj_fazheng_prefix: "☆",
  youtan: "藏铗",
  youtan_info: "锁定技，你于出牌阶段外获得牌时，记录此牌花色；你于出牌阶段内不能使用此技能未记录的花色的牌。",
  ciren: "堕洄",
  ciren_info: "其他角色的准备阶段，其可以交给你一张牌，然后你须选择一项：1.交给其另一张同花色牌；2.令其摸一张牌。",
  zhancai: "跃渊",
  zhancai_info: `出牌阶段限一次，你可以摸${get.poptip("youtan")}记录花色数张牌，然后清除一个记录的花色。`,
  yj_x_xunxu: "荀勖",
  diyin: "笛音",
  diyin_info: "锁定技，你每失去七次牌后，你获得下一次进入弃牌堆的牌；当你受到伤害后，所有体力与你相同的角色各摸一张牌。",
  boqia: "博洽",
  boqia_info: "每回合限一次，你可以将三张牌当一张基本牌或非伤害普通锦囊牌使用，若这三张牌的花色或类型均不同，此牌结算后你令一名角色将手牌调整至其体力上限，然后此技能可再次发动（每回合每种牌名限一次）。"
};
const characterIntro = {
  xunxu: "荀勖（？—289年），字公曾，颍川颍阴（今河南许昌）人，三国至西晋时期音律学家、文学家、藏书家，西晋开国功臣。出身名门，为东汉司空荀爽曾孙。少年聪慧，博学多闻。初仕于魏，为大将军曹爽掾属，后迁中书通事郎。曹爽诛后，历任安阳令、骠骑从事中郎、廷尉正等职，治理有方，百姓为之立祠。后任大将军司马昭记室，屡进策谋，深见信任，与裴秀、羊祜共掌机密。西晋建立后，封济北郡侯，拜中书监，加侍中，领著作，与贾充共定律令。后进位光禄大夫，领秘书监，与张华一同整理典籍，并按《别录》校理汲郡古墓出土的《竹书纪年》等文献，撰成《中经》。荀勖博学多才，尤通音律，曾依古尺铸造铜律吕以校音律，所制笛律行于当世。又善绘画，时人评其画作与张墨同品。然而其为人亦善逢迎，为保权势，依附宠臣贾充，曾极力促成晋太子司马衷娶贾南风，并屡为贾氏说情，为时论所讥，被视为倾覆国家、搅乱时局的贰臣。但他为人谨慎，每参大政，终不言于人前。太康十年（289年），荀勖去世，追赠司徒，谥号为成。",
  wufu: "伍孚（？-约191年），字德瑜，汝南吴房（今河南遂平）人，东汉末年人物。少有大节，为郡门下书佐。后大将军何进辟为东曹属，再迁侍中、河南尹、越骑校尉。董卓作乱时，伍孚内怀佩刀见董卓，欲图行刺，不中，为董卓所杀，并被族诛。",
  xiangxiu: "向秀（约227年－272年），字子期，河内怀县（今河南武陟）人。魏晋时期的文学家，竹林七贤之一。向秀雅好读书，与嵇康、吕安等人相善，隐居不仕。景元四年（263年）嵇康、吕安被司马昭害死后，向秀应本郡的郡上计到洛阳，受司马昭接见，后官至黄门侍郎、散骑常侍。泰始八年（272年）去世。",
  liuling: "刘伶（约221年-约300年），字伯伦，西晋沛国（治今安徽濉溪县西北）人，竹林七贤之一，中国魏晋时期作家，名士。<br>刘伶自幼便失去了父爱，因其父亲身材矮小，及至长大成人后，刘伶身高也不过六尺。魏齐王曹芳正始之末（249年），刘伶已成为当世名重一时的名士，并且常与嵇康、阮籍、阮咸集会于山阳竹林之下，饮酒赋诗，弹琴作歌。晋武帝司马炎泰始初年（265年）前后，曾做过一段时间的建威参军，不久朝廷下诏，入宫中策问。他大谈老庄，强调无为而治，非但没有得到重用，反而连参军之职也被罢免了，从此再无仕进。晋惠帝司马衷永康元年（300年）前后，以寿而终。<br>刘伶有“品酒第一人”的美称，也被酒行业传颂至今，后人以古瀑河边上的井水酿酒，还取刘伶墓地的黄土垒成窖池酿酒，为了纪念刘伶，当地百姓也将“润泉涌”更名为“刘伶醉”。其传世作品仅有《酒德颂》《北芒客舍》两篇，其中《酒德颂》所表现出的藐视一切存在的气概，敌视礼教之士的反抗精神，既高扬了人格的力量，批判了当时的黑暗政治，同时也抒发了压抑的愤世之情，充满了浪漫色彩，气魄豪迈，用辞又骈偶间行，有无意追求而自至的特点，对后代影响极大。",
  mp_wangrong: "王戎（234年－305年7月11日），字濬冲。琅玡郡临沂县（今山东省临沂市白沙埠镇诸葛村）人。祖父为三国魏幽州刺史王雄，曹魏凉州刺史王浑的儿子。三国至西晋时期名士、官员，“竹林七贤”之一。<br>王戎出身琅玡王氏。自少神采秀美，长于清谈，以精辟的品评与识鉴而著称，以聪颖知名，为父辈好友、名士阮籍器重，后人视之为玄学名士。初袭父爵贞陵亭侯，被大将军司马昭辟为掾属。累官豫州刺史、建威将军，参与晋灭吴之战。战后以功进封安丰县侯，故人称“王安丰”。治理荆州时，他拉拢士人，颇有成效。后历任侍中、光禄勋、吏部尚书、太子太傅、中书令、尚书左仆射等职。元康七年（296年），升任司徒，位列三公。王戎认为天下将乱，于是不理世事，以山水游玩为乐。赵王司马伦发动政变时，王戎被牵连免官。之后被起用为尚书令，再迁司徒。右将军张方劫持晋惠帝入长安后，王戎逃奔郏县。<br>永兴二年（305年），王戎去世，时年七十二，谥号为“元”。",
  xunyuxunyou: "请分别查看「荀彧」和「荀攸」的武将介绍。",
  linghuyu: "令狐愚（？－249年），字公治，太原人。曹魏时期将领， 原名浚。太尉王凌的外甥，弘农太守令狐邵之侄。黄初年间出任和戎护军，后任曹爽府长史、兖州刺史。嘉平年间，与王凌一起密谋废除曹芳，共立楚王曹彪，事未行而病卒。嘉平三年（251年），事泄，王凌服毒自尽，与此事相连者，皆夷三族。王凌及令狐愚被开棺暴尸三日， 亲土埋之。",
  xukun: "徐琨，字号不详，吴郡富春县（今浙江省杭州市富阳区）人。三国时期吴国开国功臣，武烈皇帝孙坚的外甥，吴大帝孙权的表兄弟，徐夫人的生父。出身吴郡豪门，最初担任郡吏。投靠舅舅孙坚，参与征伐董卓有功，拜偏将军。孙坚逝后，追随孙策，攻讨扬州刺史刘繇，采取奇袭作战方式，占领丹阳郡，为孙策开拓江东事业奠定基础，领丹杨太守。适逢吴景归附江东，改授督军中郎将。孙权嗣位后，平定庐江太守李术叛乱，击破皖城，册封广德侯，加号平虏将军。后来，随孙权征讨黄祖，身中流矢，不治而亡。",
  sunli: "孙礼（？—250年），字德达，涿郡容城县人。三国时期曹魏名将。曹操平定幽州后，孙礼被征召为司空军谋掾。后被任命为河间郡丞，升至荥阳都尉。后孙礼被调为鲁国相。历任山阳、平原、平昌、琅邪郡太守。从大司马曹休在夹石征吴，孙礼谏其不可深入作战，曹休不听遂战败。后孙礼调任阳平郡太守。明帝时入为尚书，受遗诏拜大将军长史，加散骑常侍。曹爽令孙礼出任扬州刺史，加管伏波将军，赐爵关内侯。孙礼率兵御东吴军队，奋不顾身，贼众乃退。朝廷赐绢七百匹，孙礼皆以绢付亡者家，无以入身。后征拜少府，出为荆州刺史，迁冀州牧。爽见礼奏，大怒，劾礼怨望，结刑五岁。在家期年，众人多以为言，除城门校尉。出为并州刺史，加振武将军，使持节，护匈奴中郎将。爽诛后，入为司隶校尉。迁司空，封大利亭侯，邑一百户。嘉平二年（250年），孙礼去世，谥号景侯。其孙孙元继承爵位。《全三国文》录有孙礼文一篇《清河平原争界案图宜属平原疏》。陈寿评曰“孙礼刚断伉厉”。",
  xiahoumao: "夏侯楙，字子林，沛国谯县（今安徽省亳州市）人，曹魏名将夏侯惇之子，三国时期魏国官员、将领，其妻为曹操之女清河公主。在魏国历任侍中、尚书、安西将军、镇东将军，假节，封列侯。曾一度驻守曹魏都城长安，但蜀汉北伐后就被调离。",
  chenshi: "陈式，生卒年不详，三国时期蜀汉将领。最初为刘备军中重要的基层指挥官，后成长为高级将领。在诸葛亮第三次北伐期间，在诸葛亮的军事指挥下攻克了魏国的武都、阴平二郡。",
  feiyao: "费曜（生卒年不详），又作费瑶、费繇，三国时期曹魏将领。魏初，参与平河西之乱。明帝时官任后将军，跟随曹真、司马懿多次对抗蜀汉。《三国演义》中作“费耀”，随曹真和诸葛亮的第二次北伐军作战。怀疑姜维作内应是假，自告奋勇替曹真出征，结果被事先埋伏的姜维包围，自尽而死。",
  wuanguo: "武安国，历史小说《三国演义》中人物，是北海太守孔融的部将，兵器为一把长柄铁锤，重五十余斤。诸侯伐董时，双方于虎牢关相峙，吕布撰战，一合而斩穆顺，关东军大惊。北海太守孔融部将武安国，使铁锤飞马而出，吕布挥戟拍马来迎，战到十余合，一戟砍断安国手腕，安国弃锤于地而走，八路军兵齐出，这才救了他性命。",
  hanlong: "韩龙，汉末三国时期刺客。韩龙使得魏国北方边得到数十年的安宁，减少魏国的军政压力，得以休养生息。太和二年，豫遣译夏舍诣比能女婿郁筑鞬部，舍为鞬所杀。其秋，豫将西部鲜卑蒲头、泄归泥出塞讨郁筑鞬，大破之。还至马城，比能自将三万骑围豫七日。上谷太守阎志，阎柔之弟也，素为鲜卑所信。志往解喻，即解围去。后幽州刺史王雄并领校尉，抚以恩信。比能数款塞，诣州奉贡献。至青龙元年，比能诱纳步度根，使叛并州，与结和亲，自勒万骑迎其累重於陉北。并州刺史毕轨遣将军苏尚、董弼等击之，比能遣子将骑与尚等会战於楼烦，临陈害尚、弼。至三年中，雄遣勇士韩龙刺杀比能，更立其弟。",
  liwan: "李婉（生卒年不详），字淑文，里居不详，贾充之妻，魏晋时期才女，约景元年间（260年前后）在世。著有《典戒》。《隋书·经籍志》载李婉有文集一卷，今失传。",
  zhugeshang: "诸葛尚（244年2月－263年11月），琅琊阳都（今山东沂南）人，诸葛瞻长子，诸葛亮之孙。诸葛尚博览兵书且精通武艺。炎兴元年（公元263年），出任先锋，抗拒魏国大将邓艾，与其父诸葛瞻同战死于绵竹，时年十九岁。",
  kebineng: "轲比能（？～235年），为中国三国时期的鲜卑首领之一。轲比能出身鲜卑支部，因他作战勇敢，执法公平，不贪财物，所以被鲜卑民众推举为大人。轲比能因其部落近塞，所以他抓住有利条件积极学习汉族先进技术和文化，促进了鲜卑族的进步和北方的民族融合。轲比能统率下的部众，战守有法，战斗力相当强大。自曹操北征后向曹氏进贡表示效忠。魏文帝时，轲比能受封附义王。轲比能在进行部落统一战争时，受魏国干涉，受沉重打击，于是对魏怀贰，献书魏帝表忠，以麻痹魏庭，使之放松警惕。此后，轲比能的部众变得强盛，控弦十余万骑，为害魏国边境。每次钞略得财物，轲比能都公开透明地均平分配，所以得部众死力，各部大人都敬畏之。实力强大后，他继续部落统一战争，于是威行诸部落，建立起强大的鲜卑族政权。深感威胁的魏国幽州刺史王雄派刺客韩龙将其刺杀，其政权立刻崩溃，鲜卑民族再次陷入混战。",
  lukai: "陆凯（198－269年），字敬风，吴郡吴县（今江苏省苏州市）人。三国时期吴国重臣，丞相陆逊的族侄，大司马陆抗的族兄。黄武年间，举孝廉出身，曾任永兴县长、诸暨县长，颇有治绩。拜建武都尉、儋耳太守，与聂友率军讨伐朱崖和儋耳，迁建武校尉。五凤二年（255年），讨斩零陵山贼陈毖，拜偏将军、巴丘督，册封都乡侯。迁武昌右部督，随军进入寿春。后拜荡魏将军，加号绥远将军。吴景帝孙休继位，拜征北将军、假节、领豫州牧。孙皓即位，迁任镇西大将军，都督巴丘，又领荆州牧，进封嘉兴侯。宝鼎元年（266年），迁左丞相。以正直及屡次劝谏孙皓而闻名。建衡元年（269年），去世，时年七十二。",
  yj_hanbing: "轻挥寒光冷，踽闻叶落声。",
  yj_tengjia: "穿在身上，渡江不沉，经水不湿，刀箭皆不能入。"
};
const characterFilters = {};
const characterTitles = {
  yj_wanglang: "负固不服",
  //yj_puyuan: "",
  //yao_yuanshu: "",
  yj_fazheng: "弹铗待试",
  //yj_hanbing: "",
  //yj_tengjia: "",
  yj_zhanghe: "宁国中郎将",
  yj_zhangliao: "蹈锋饮血",
  yj_xuhuang: "沉详性严",
  yj_ganning: "铃震没羽",
  kebineng: "瀚海鲸波",
  zhugeshang: "尚节殉义",
  liwan: "遐雁归迩",
  yj_sufei: "义荐恩还",
  yj_qiaozhou: "谶星沉祚",
  lukai: "青辞宰辅",
  yj_zhoubuyi: "稚雀清声",
  yj_weiyan: "骜勇孤战",
  yj_huangzhong: "强挚烈弓",
  hanlong: "冯河易水",
  wuanguo: "虎口折腕",
  sunli: "百炼公才",
  xiahoumao: "束甲之鸟",
  chenshi: "裨将可期",
  feiyao: "后将军",
  linghuyu: "名愚性浚",
  yj_simafu: "仁孝忠德",
  yj_xuangongzhu: "高陵翩蝶",
  xukun: "平虏击逆",
  xunyuxunyou: "谋定天下",
  yj_sb_guojia: "翼谋奇佐",
  mp_liuling: "醉侯",
  mp_wangrong: "间竹觅幽",
  //暂且未拥有正式称号,本称号取自武将制图作品
  yj_majun: "名巧天下",
  mp_xiangxiu: "出尘窥冥",
  //暂且未拥有正式称号,本称号取自武将制图作品
  new_yj_dongzhuo: "破羌安边",
  fj_peixiu: "玄静守真",
  wufu: "忠虹贯日",
  yj_zhanghuan: "正身洁己",
  yj_zhangyan: "黑山飞燕",
  v_sunce: "勇冠三江势",
  yj_x_xunxu: "博律明识"
};
const dynamicTranslates = {
  lkbushi(player) {
    var list = lib.skill.lkbushi.getBushi(player).map((i) => get.translation(i));
    return "①你使用" + list[0] + "牌无次数限制。②当你使用或打出" + list[1] + "牌后，你摸一张牌。③当你成为" + list[2] + "牌的目标后，你可以弃置一张牌，令此牌对你无效。④结束阶段开始时，你从牌堆获得一张" + list[3] + "牌。⑤准备阶段开始时，你可调整此技能中四种花色的对应顺序。";
  },
  diezhang(player) {
    const bool = player.storage.diezhang;
    let cnNum = get.cnNumber(player.storage.duanwan ? 2 : 1);
    let yang = "当你使用牌被其他角色抵消后，你可以弃置一张牌，视为对其使用" + cnNum + "张【杀】", yin = "当其他角色使用牌被你抵消后，你可以摸" + cnNum + "张牌，视为对其使用一张【杀】";
    if (bool) {
      if (player.storage.duanwan) {
        yang = `<span style="text-decoration: line-through; ">${yang}</span>`;
      }
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      if (player.storage.duanwan) {
        yin = `<span style="text-decoration: line-through; ">${yin}</span>`;
      }
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = player.storage.duanwan ? "" : "①出牌阶段，你使用【杀】的次数上限+1。②", end = "。";
    start += "转换技。" + (player.storage.duanwan ? "每回合限一次，" : "");
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  spshidi(player) {
    const bool = player.countMark("spshidi") % 2 != 0;
    let yang = "②若你的“☯”数为偶数，则你至其他角色的距离-1，且你使用的黑色【杀】不可被响应", yin = "③若你的“☯”数为奇数，则其他角色至你的距离+1，且你不可响应红色【杀】";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技，锁定技。①准备阶段/结束阶段开始时，若你发动此分支的累计次数为奇数/偶数，则你获得一个“☯”。", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  xianmou(player) {
    const bool = player.storage.xianmou;
    let yang = "观看牌堆顶五张牌并获得至多X张牌，若未获得X张牌则获得〖遗计〗直到再发动此项", yin = "观看一名角色手牌并弃置其中至多X张牌，若弃置X张牌则你进行一次【闪电】判定";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技，①游戏开始时，你可以转换此技能状态；②你失去过牌的回合结束时，你可以：", end = "（X为你本回合失去牌数）。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  }
};
const perfectPairs = {};
const voices = {
  "#fuyu1": "吾为汉吏，当保城安民，岂可避之",
  "#fuyu2": "吾上能驰戈、下可走马，何言力不能拒？",
  "#fuyu3": "吾等有地势之力，量孙策攻之不得。",
  "#fuyu4": "此乃朝廷疆土，吾必以死守之。",
  "#zhanshi1": "今观其兵寡，吾等未必无胜战之机。",
  "#zhanshi2": "吾等只需城门不失，便有回转之力。",
  "#zhanshi3": "如今优势尚存，吾等还需死守。",
  "#zhanshi4": "待孙策粮草有缺，其军必退。",
  "#yj_wanglang:die": "朗不能死节，愧对汉室英烈！",
  "#diyin1": "五声十二律，一管纳乾坤。",
  "#diyin2": "昆山采蓝玉，裂石穿云，不若此间笛响。",
  "#boqia1": "夫金石丝竹之音，发自器而通于天。",
  "#boqia2": "天下之理，虽万变而卒归乎中。",
  "#yj_x_xunxu:die": "夺我凤皇池，诸君贺我邪！",
  "#bingling1": "身如冰上雪，剑如雪上霜。",
  "#bingling2": "一点霜痕，万里寒生。",
  "#yj_hanbing:die": "山中无甲子，寒尽不知年。",
  "#tenggu1": "好个无礼蛮将，险些给我藤甲踹开线！",
  "#tenggu2": "我没有肚子，这是胃袋。",
  "#dunyong1": "多了不说、少了不唠，开造！",
  "#dunyong2": "你不懂打人这一块，要以德服人。",
  "#yj_tengjia:die": "慢！我当何辞？",
  "#dczhifeng1": "千里江东地，谁敢独槊相向！",
  "#dczhifeng2": "饮江为酿，看我醉挑山河！",
  "#dcweijing1": "既称吴臣，方可免死！",
  "#dcweijing2": "天无二日，虎犬安能并列！",
  "#v_sunce:die": "恨，不见九鼎，尽刻吴纹。",
  "#youtan1": "满腹韬略，说与谁闻？",
  "#youtan2": "明珠暗投，乃至于此。",
  "#youtan3": "唉，空有经纬之才，却无施展之地。",
  "#youtan4": "非吾才智不足，实乃时运不济。",
  "#ciren1": "为使须有辩才，正实非良选。",
  "#ciren2": "愿为益州守于内，不欲辩于外。",
  "#zhancai1": "凤非梧不栖，士非主不依。",
  "#zhancai2": "刘璋暗弱，士民不附，此将军之机也。",
  "#yj_fazheng:die": "将军今若不取，必为他人所图。",
  "#dcqiaolve1": "冀州千里膏腴，尽是我黑山食邑！",
  "#dcqiaolve2": "小的们，放开手脚，抢他个一干二净！",
  "#dchanjie1": "某家让汝三更死，谁敢留命到五更！",
  "#dchanjie2": "飞燕喋血无数，今日便再饮几条亡魂！",
  "#yj_zhangyan:die": "要杀便杀，休要饶舌！",
  "#dczhonge1": "殿陛群臣数万，岂无诛贼之人！",
  "#dczhonge2": "汉有忠，天不绝！",
  "#dcjuekai1": "吾当与贼同死此刀下！",
  "#dcjuekai2": "吾誓不与贼同立于皇天后土！",
  "#wufu:die": "人终死，杀贼而亡，可乎！",
  "#dcyiju1": "公欲以子之腐鼠而饲我邪？",
  "#dcyiju2": "绢帛染了脂血，恐污了清白。",
  "#dcshuguo1": "大丈夫处世，当为国家立功边境。",
  "#dcshuguo2": "但教一息尚存，必横长槊于阴山！",
  "#yj_zhanghuan:die": "通塞命也，始终常也。",
  "#gongqiao1": "怀兼爱之心，琢世间百器。",
  "#gongqiao2": "机巧用尽，方化腐朽为神奇！",
  "#jingyi1": "精益求精，工如道，途无穷。",
  "#jingyi2": "木可伐，石可破，技不可失。",
  "#yj_majun:die": "龙骨坍夜陌，水尽百戏枯。",
  "#yjqimei1": "此生愿作比翼鸟，双宿双飞不分离。",
  "#yjqimei2": "与君共度晨昏，此生之所愿。",
  "#yjzhuiji1": "此生与君相遇，足以含笑九泉。",
  "#yjzhuiji2": "夫君珍重，万望保重身体。",
  "#yj_xuangongzhu:die": "夫君，妾身先行一步。",
  "#beiyu1": "备预不虞，善之大者也。",
  "#beiyu2": "宜选步骑二万，为讨贼之备。",
  "#duchi1": "今督众将临战，当使敌入寇无功。",
  "#duchi2": "吴军远道而来，彼疲军也。",
  "#yj_simafu:die": "臣死之日，固大魏之纯臣也。",
  "#xiongjin1": "将者当有勇有谋，屡战屡胜。",
  "#xiongjin2": "逆贼造乱，此吾等建功之时。",
  "#zhenbian1": "有吾在此，胡人何虑。",
  "#zhenbian2": "某功甚大，当有此赏。",
  "#baoxi1": "哈哈哈哈，我要看到遍地血海。",
  "#baoxi2": "大好的军功，岂能放过。",
  "#new_yj_dongzhuo:die": "本欲坐观时变，奈何天不遂我啊。",
  "#mpmiaoxi1": "物各自造而无所待焉，此天地之正也。",
  "#mpmiaoxi2": "天性所受，各有本分，不可逃，亦不可加。",
  "#mpsijiu1": "悼嵇生之永辞兮，顾日影而弹琴。",
  "#mpsijiu2": "托运遇于领会兮，寄余命于寸阴。",
  "#mp_xiangxiu:die": "无为民自化，丧我与物齐。",
  "#fjzhitu1": "辨广轮之度，正彼此之体，远近无所隐其形。",
  "#fjzhitu2": "地有六合，图有六体，可校其经纬。",
  "#dcfujue1": "《周礼》有言，爵分公、侯、伯、子、男。",
  "#dcfujue2": "复五等之爵，明尊卑之序。",
  "#fj_peixiu:die": "这酒，是冷的。",
  "#xvzhi1": "鹿复现于野，孰不可射乎？",
  "#xvzhi2": "天下之士合纵，欲复攻于秦。",
  "#linghuyu:die": "咳咳……我欲谋大事，奈何命不由己。",
  "#xianmou1": "绸缪于未雨，手握胜机，雨落何妨高歌？",
  "#xianmou2": "此帆济沧海，彼岸日边，任他风雨飘摇。",
  "#xianmou_yj_sb_guojia_shadow1": "嘉不受此劫，安能以凡人之躯窥得天机？",
  "#xianmou_yj_sb_guojia_shadow2": "九州为觞，风雨为酿，谁与我共饮此杯？",
  "#lunshi1": "曹公济天下大难，必定霸王之业。",
  "#lunshi2": "智者审于良主，袁公未知用人之机。",
  "#lunshi_yj_sb_guojia_shadow1": "公有此十胜，败绍非难事尔。",
  "#lunshi_yj_sb_guojia_shadow2": "嘉窃料之，绍有十败，公有十胜。",
  "#yj_sb_guojia:die": "生如夏花，死亦何憾？",
  "#yj_sb_guojia_shadow:die": "江湖路远，诸君，某先行一步。",
  "#zhenfeng1": "河西诸贼作乱，吾当驱万里之远。",
  "#zhenfeng2": "可折诸葛之锋而御者，独我其谁。",
  "#feiyao:die": "姜维，你果然是蜀军内应！",
  // 击、逆、泰、每，懂？
  "#fazhu1": "击风雨于共济，逆流亦溯千帆。",
  "#fazhu2": "泰山轻于大义，每思志士、何惧临渊。",
  "#fazhu3": "大江潮起，伐苇成舟，载江南春风。",
  "#xukun:die": "何处射来的流矢？",
  "#kangli1": "地界纷争皋陶难断，然图藏天府，坐上可明。",
  "#kangli2": "正至歉岁，难征百姓于役，望陛下明鉴。",
  "#sunli:die": "国无矩不立，何谓之方圆？",
  "#tongwei1": "今统虎贲十万，必困金龙于斯。",
  "#tongwei2": "昔年将军七出长坂，今尚能饭否？",
  "#cuguo1": "本欲开疆拓土，奈何丧师辱国。",
  "#cuguo2": "千里锦绣之地，皆亡逆贼之手。",
  "#xiahoumao:die": "志大才疏，以致今日之祸。",
  "#qingbei1": "待追上那司马懿，定教他没好果子吃！",
  "#qingbei2": "身若不周，吾一人可作擎北之柱。",
  "#chenshi:die": "丞相、丞相！是魏延指使我的！",
  "#diezhang1": "某家这大锤，舞起来那叫一个万夫莫敌。",
  "#diezhang2": "贼吕布何在？某家来取汝性命了！",
  "#duanwan1": "好你个吕奉先，竟敢卸我膀子！",
  "#duanwan2": "汝这匹夫，为何往手腕上招呼？",
  "#wuanguo:die": "吕奉先，你给某家等着！",
  "#duwang1": "此去，欲诛敌莽、杀单于。",
  "#duwang2": "风萧萧兮易水寒，壮士一去兮不复还！",
  "#cibei1": "匹夫一怒，流血二人，天下缟素。",
  "#cibei2": "我欲效专诸、聂政之旧事，逐天狼于西北。",
  "#hanlong:die": "杀轲比能者，韩龙也！",
  "#shiming1": "今天命在北，我等已尽人事。",
  "#shiming2": "益州国疲民敝，非人力可续之。",
  "#jiangxi1": "典午忽兮，月酉没兮。",
  "#jiangxi2": "周慕孔子遗风，可与刘、扬同轨。",
  "#yj_qiaozhou:die": "炎汉百年之业，吾一言毁之……",
  "#shuojian1": "我数荐卿而祖不用，其之失也。",
  "#shuojian2": "兴霸乃当世豪杰，何患无爵。",
  "#yj_sufei:die": "兴霸何在？吾命休矣……",
  "#liandui1": "以句相联，抒离散之苦。",
  "#liandui2": "以诗相对，颂哀怨之情。",
  "#biejun1": "彼岸荼蘼远，落寞北风凉。",
  "#biejun2": "此去经年，不知何时能归？",
  "#liwan:die": "生不能同寝，死亦难同穴……",
  "#sangu1": "思报君恩，尽父子之忠。",
  "#sangu2": "欲酬三顾，竭三代之力。",
  "#yizu1": "仿祖父行事，可阻敌袭。",
  "#yizu2": "习先人故智，可御寇侵。",
  "#zhugeshang:die": "父子荷国重恩，当尽忠以报！",
  "#kousheng1": "驰马掠野，塞外称雄。",
  "#kousheng2": "控弦十万，纵横漠南。",
  "#kebineng:die": "草原雄鹰，折翼于此……",
  "#lkbushi1": "论演玄意，以筮辄验。",
  "#lkbushi2": "手不释书，好研经卷。",
  "#lkzhongzhuang1": "秽尘天听，卿有不测之祸！",
  "#lkzhongzhuang2": "倾乱国政，安得寿终正寝？",
  "#lukai:die": "不听忠言，国将亡矣……",
  "#mbhuiyao1": "幸有仓舒为伴，吾不至居高寡寒。",
  "#mbhuiyao2": "通悟而无笃学之念，则必盈天下之叹也。",
  "#mbquesong1": "承白雀之瑞，显周公之德。",
  "#mbquesong2": "挽汉室于危亡，继光武之中兴。",
  "#yj_zhoubuyi:die": "慧童亡，天下伤……",
  "#mbguli1": "今若弑此昏聩主，纵蒙恶名又如何？",
  "#mbguli2": "韩玄少谋多忌，吾今当诛之！",
  "#mbaosi1": "凶慢骜肆，天生狂骨！",
  "#mbaosi2": "暴戾恣睢，傲视诸雄！",
  "#yj_weiyan:die": "使君为何弃我而去……呃啊！",
  "#spshidi1": "诈败以射之，其必死矣！",
  "#spshidi2": "呃啊，中其拖刀计矣！",
  "#spyishi1": "昨日释忠之恩，今吾虚射以报。",
  "#spyishi2": "君刀不砍头颅，吾箭只射盔缨。",
  "#spqishe1": "诱敌之计已成，吾且拈弓搭箭！",
  "#spqishe2": "关羽即至吊桥，既已控弦，如何是好？",
  "#yj_huangzhong:die": "关云长义释黄某，吾又安忍射之……",
  "#weifeng1": "广散惧义，尽泄敌之斗志。",
  "#weifeng2": "哼哼，若尔等惧我，自当卷甲以降！",
  "#yj_zhangliao:die": "惑于女子而尽失战机，庸主误我啊……",
  "#zhilve1": "将者，上不治天，下不治地，中不治人。",
  "#zhilve2": "料敌之计，明敌之意，因况反制。",
  "#yj_zhanghe:die": "若非小人作梗，何至官渡之败……",
  "#xhzhiyan1": "治军严谨，方得精锐之师。",
  "#xhzhiyan2": "精兵当严于律己，束身自修。",
  "#yj_xuhuang:die": "唉，明主未遇，大功未成……",
  "#gnjinfan1": "扬锦帆，劫四方，快意逍遥！",
  "#gnjinfan2": "铃声所至之处，再无安宁！",
  "#gnsheque1": "看我此箭，取那轻舟冒进之人性命！",
  "#gnsheque2": "纵有劲甲良盾，也难挡我神射之威！",
  "#yj_ganning:die": "铜铃声……怕是听不到了……"
};
const characterSort = {
  yijiang_2020: ["yj_zhanghe", "yj_zhangliao", "yj_xuhuang", "yj_ganning"],
  yijiang_2022: ["yj_huangzhong", "lukai", "kebineng", "zhugeshang", "liwan", "wuanguo", "hanlong", "yj_sufei", "yj_qiaozhou"],
  yijiang_2023: ["yj_majun", "mp_liuling", "yj_weiyan", "xiahoumao", "chenshi", "sunli", "feiyao"],
  yijiang_2024: ["fj_peixiu", "new_yj_dongzhuo", "mp_wangrong", "yj_zhoubuyi", "linghuyu", "yj_simafu", "yj_xuangongzhu", "xukun", "xunyuxunyou", "yj_sb_guojia", "mp_xiangxiu"],
  yijiang_2025: ["wufu", "yao_yuanshu", "yj_zhanghuan", "yj_zhangyan", "yj_puyuan", "v_sunce", "yj_hanbing", "yj_tengjia", "yj_fazheng"],
  yijiang_2026: ["yj_x_xunxu", "yj_wanglang"]
};
const characterSortTranslate = {
  yijiang_2020: "一将成名2020",
  yijiang_2022: "一将成名2022",
  yijiang_2023: "一将成名2023",
  yijiang_2024: "一将成名2024",
  yijiang_2025: "一将成名2025",
  yijiang_2026: "一将成名2026"
};
game.import("character", function() {
  return {
    name: "newjiang",
    connect: true,
    character: { ...characters },
    characterSort: {
      newjiang: characterSort
    },
    characterSubstitute: {
      yj_sb_guojia: [["yj_sb_guojia_shadow", []]]
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
