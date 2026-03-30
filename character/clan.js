import { game, lib, get, _status, ui } from "noname";
const characters = {
  clan_xunshi: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["clanqingjue", "clanxsyingxiang", "clandaojie"],
    clans: ["颍川荀氏"]
  },
  clan_chentai: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["clanfenjian", "clandongxu", "clanshize"],
    clans: ["颍川陈氏"]
  },
  clan_chenqun: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["clangezhi", "clanmingdian", "clanshize"],
    clans: ["颍川陈氏"]
  },
  clan_xunyu: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["clandingan", "clanfuning", "clandaojie"],
    clans: ["颍川荀氏"]
  },
  clan_hanfu: {
    sex: "male",
    group: "qun",
    hp: 3,
    maxHp: 4,
    skills: ["clanheta", "clanyingxiang", "clanxumin"],
    clans: ["颍川韩氏"]
  },
  clan_luji: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["clangailan", "clanfennu", "clanzelie"],
    clans: ["吴郡陆氏"]
  },
  clan_lujing: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["clantanfeng", "clanjuewei", "clanzelie"],
    clans: ["吴郡陆氏"]
  },
  clan_yangbiao: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["clanjiannan", "clanyichi", "clanquhuo"],
    clans: ["弘农杨氏"]
  },
  clan_wuyi: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["clangaojin", "clanmuyin"],
    clans: ["陈留吴氏"]
  },
  clan_wuxian: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["clanyirong", "clanguixiang", "clanmuyin"],
    clans: ["陈留吴氏"]
  },
  clan_wuban: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["clanzhanding", "clanmuyin"],
    clans: ["陈留吴氏"]
  },
  clan_xunshu: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["clanshenjun", "clanbalong", "clandaojie"],
    clans: ["颍川荀氏"]
  },
  clan_xunchen: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["clansankuang", "clanbeishi", "clandaojie"],
    clans: ["颍川荀氏"]
  },
  clan_xuncai: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["clanlieshi", "clandianzhan", "clanhuanyin", "clandaojie"],
    clans: ["颍川荀氏"]
  },
  clan_xuncan: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["clanyunshen", "clanshangshen", "clanfenchai", "clandaojie"],
    clans: ["颍川荀氏"]
  },
  clan_hanshao: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["clanfangzhen", "clanliuju", "clanxumin"],
    clans: ["颍川韩氏"]
  },
  clan_hanrong: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["clanlianhe", "clanhuanjia", "clanxumin"],
    clans: ["颍川韩氏"]
  },
  clan_wukuang: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["clanlianzhu", "clanmuyin"],
    clans: ["陈留吴氏"]
  },
  clan_wangling: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["clanbolong", "clanzhongliu"],
    clans: ["太原王氏"]
  },
  clan_zhongyan: {
    sex: "female",
    group: "jin",
    hp: 3,
    skills: ["clanguangu", "clanxiaoyong", "clanbaozu"],
    clans: ["颍川钟氏"]
  },
  clan_wangyun: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["clanjiexuan", "clanmingjie", "clanzhongliu"],
    clans: ["太原王氏"]
  },
  clan_wanghun: {
    sex: "male",
    group: "jin",
    hp: 3,
    skills: ["clanfuxun", "clanchenya", "clanzhongliu"],
    clans: ["太原王氏"]
  },
  clan_zhonghui: {
    sex: "male",
    group: "wei",
    hp: 3,
    maxHp: 4,
    skills: ["clanyuzhi", "clanxieshu", "clanbaozu"],
    clans: ["颍川钟氏"],
    dieAudios: ["3"]
  },
  clan_zhongyu: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["clanjiejian", "clanhuanghan", "clanbaozu"],
    clans: ["颍川钟氏"]
  },
  clan_wanglun: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["clanqiuxin", "clanjianyuan", "clanzhongliu"],
    clans: ["太原王氏"],
    groupBorder: "jin"
  },
  clan_xunyou: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["clanbaichu", "clandaojie"],
    clans: ["颍川荀氏"]
  },
  clan_wuqiao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["clanqiajue", "clanmuyin"],
    clans: ["陈留吴氏"],
    groupBorder: "jin"
  },
  clan_wangguang: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["clanlilun", "clanjianji", "clanzhongliu"],
    clans: ["太原王氏"]
  },
  clan_wangmingshan: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["clantanque", "clanshengmo", "clanzhongliu"],
    clans: ["太原王氏"]
  },
  clan_zhongyao: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["clanchengqi", "clanjieli", "clanbaozu"],
    clans: ["颍川钟氏"]
  },
  clan_wangchang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["clankaiji", "clanzhongliu"],
    clans: ["太原王氏"]
  },
  clan_wangshen: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["clananran", "clangaobian", "clanzhongliu"],
    clans: ["太原王氏"]
  },
  clan_yangci: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["clanqieyi", "clanjianzhi", "clanquhuo"],
    clans: ["弘农杨氏"]
  },
  clan_yangxiu: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["clanjiewu", "clangaoshi", "clanquhuo"],
    clans: ["弘农杨氏"]
  },
  clan_xunshuang: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["clanyangji", "clandandao", "clanqingli", "clandaojie"],
    clans: ["颍川荀氏"]
  },
  clan_yangzhong: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["clanjuetu", "clankudu", "clanquhuo"],
    clans: ["弘农杨氏"]
  }
};
const cards = {
  huntianyi: {
    fullskin: true,
    type: "equip",
    subtype: "equip5",
    derivation: "clan_luji",
    cardcolor: "diamond",
    ai: {
      order: 9.5,
      equipValue(card, player2) {
        if (player2.hp == 1) {
          return 5;
        }
        return 0;
      },
      basic: {
        equipValue: 2
      }
    },
    onLose() {
      player.addTempSkill("huntianyi_skill_lose");
      if (event.getParent(2)?.name == "huntianyi_skill") {
        cards.forEach((card) => {
          card.fix();
          card.remove();
          card.destroyed = true;
          game.log(card, "被销毁了");
        });
      }
    },
    skills: ["huntianyi_skill"]
  }
};
const pinyins = {};
const skills = {
  //族荀莳（族荀肘）
  clanqingjue: {
    audio: 2,
    forced: true,
    trigger: {
      player: "changeHpAfter"
    },
    isOnlySuit(card, player2) {
      return !player2.hasCard((cardx) => cardx != card && get.suit(cardx) == get.suit(card), "h");
    },
    init(player2, skill) {
      player2.addSkill(`${skill}_mark`);
    },
    onremove(player2, skill) {
      player2.removeSkill(`${skill}_mark`);
    },
    filter(event2, player2) {
      player2.getCards("h");
      return game.getGlobalHistory("changeHp", (evt) => evt.player == player2).indexOf(event2) == 0 && player2.countDiscardableCards(player2, "h", (card) => !get.info("clanqingjue").isOnlySuit(card, player2)) > 0;
    },
    async content(event2, trigger, player2) {
      const result = await player2.chooseToDiscard(`###${get.translation(event2.name)}###弃置手牌中任意张花色数量不为一的牌，并执行等量项`, "h", [1, Infinity], true, "allowChooseAll").set("filterCard", (card, player3) => !get.info("clanqingjue").isOnlySuit(card, player3)).forResult();
      const { cards: cards2 } = result;
      const resultx = cards2.length > 1 ? { links: ["give", "gain"] } : await player2.chooseButton(
        [
          `清绝：执行${get.cnNumber(Math.min(cards2.length, 2))}项`,
          [
            [
              ["give", `将${get.translation(cards2)}交给其他角色`],
              ["gain", `获得未拥有花色的牌各一张（${get.translation(lib.suit.filter((suit) => !player2.hasCard({ suit }, "h")))}）`]
            ],
            "textbutton"
          ]
        ],
        true
      ).set("ai", (button) => {
        if (button.link == "give") {
          if (game.hasPlayer((target) => target != get.player() && get.attitude(get.player(), target) > 0)) {
            return 2;
          }
          return 0.5;
        }
        return 1;
      }).forResult();
      const { links } = resultx;
      if (links?.includes("give") && game.hasPlayer((target) => target != player2) && cards2?.someInD("d")) {
        const toGive = cards2?.filterInD("d");
        const result2 = await player2.chooseTarget(true, lib.filter.notMe).set("createDialog", [`清绝：将这些牌交给一名其他角色`, toGive, [(dialog) => dialog.buttons.forEach((button) => button.style.setProperty("opacity", "1", "important")), "handle"]]).set("toGive", toGive).set("ai", (target2) => get.attitude(get.player(), target2) * get.value(get.event().toGive, target2)).forResult();
        const {
          targets: [target]
        } = result2;
        player2.line(target);
        const next = target.gain(toGive, "gain2");
        next.giver = player2;
        await next;
      }
      if (links?.includes("gain")) {
        const hs = player2.getCards("h").map((i) => get.suit(i));
        const suits = lib.suit.slice().removeArray(hs);
        if (suits?.length) {
          const cards3 = [];
          for (const suit of suits) {
            const card = get.cardPile((i) => get.suit(i) == suit);
            if (card) {
              cards3.push(card);
            }
          }
          if (cards3.length) {
            await player2.gain(cards3, "gain2");
          }
        }
      }
    },
    mod: {
      ignoredHandcard(card, player2) {
        if (get.info("clanqingjue").isOnlySuit(card, player2)) {
          return true;
        }
      },
      cardDiscardable(card, player2, name) {
        if (name == "phaseDiscard") {
          if (get.info("clanqingjue").isOnlySuit(card, player2)) {
            return false;
          }
        }
      }
    },
    subSkill: {
      mark: {
        //太棒了，是宝宝标记，我们有救了！
        charlotte: true,
        init(player2, skill) {
          player2.removeGaintag(skill);
          player2.addGaintag(
            player2.getCards("h", (card) => get.info("clanqingjue").isOnlySuit(card, player2)),
            skill
          );
        },
        onremove(player2, skill) {
          player2.removeGaintag(skill);
        },
        trigger: {
          player: ["loseEnd", "enterGame"],
          global: ["gainEnd", "equipEnd", "addJudgeEnd", "loseAsyncEnd", "addToExpansionEnd", "phaseBefore"]
        },
        silent: true,
        filter(event2, player2, name) {
          if (event2.name == "phase") {
            return game.phaseNumber == 0;
          }
          return name == "enterGame" || event2.getg?.(player2)?.length || event2.getl?.(player2)?.hs?.length;
        },
        async content(event2, trigger, player2) {
          get.info(event2.name).init(player2, event2.name);
        }
      }
    }
  },
  clanxsyingxiang: {
    audio: 2,
    trigger: {
      global: ["useCardAfter", "loseAfter", "loseAsyncAfter", "gainAfter", "equipAfter", "addJudgeAfter", "addToExpansionAfter"]
    },
    filter(event2, player2) {
      if (event2.name === "useCard") {
        return event2.player.hasHistory("lose", (evt) => {
          if ((evt.relatedEvent || evt.getParent()) != event2) {
            return false;
          }
          return Object.values(evt.gaintag_map).flat().includes("clanxsyingxiang");
        });
      }
      if (player2.hasSkill("clanxsyingxiang_used") || !player2.countDiscardableCards(player2, "h", (card) => !get.info("clanqingjue").isOnlySuit(card, player2))) {
        return false;
      }
      if (event2.name === "lose" && event2.getParent().name === "useCard") {
        return false;
      }
      return game.hasPlayer((target) => {
        const evt = event2.getl?.(target);
        return evt?.hs?.some((card) => evt.gaintag_map?.[card.cardid]?.includes("clanxsyingxiang"));
      });
    },
    logTarget(event2, player2) {
      if (event2.name === "useCard") {
        return game.filterPlayer((i) => {
          if (i === event2.player) {
            return true;
          }
          return i.hasCard((card) => card.hasGaintag("clanxsyingxiang"), "h");
        }).sortBySeat();
      }
      return player2;
    },
    forced: true,
    async content(event2, trigger, player2) {
      if (trigger.name === "useCard") {
        await game.asyncDraw([player2, ...event2.targets].sortBySeat());
        await game.delayx();
      } else {
        const skill = "clanqingjue";
        player2.logSkill(skill);
        player2.addTempSkill(`${event2.name}_used`, "roundStart");
        const next = game.createEvent(skill);
        next.player = player2;
        next.setContent(get.info(skill).content);
        await next;
      }
    },
    group: "clanxsyingxiang_mark",
    subSkill: {
      used: {
        charlotte: true,
        init(player2, skill) {
          player2.addTip(skill, `${get.translation(skill)} 已${get.translation("clanqingjue")}`);
        },
        onremove(player2, skill) {
          player2.removeTip(skill);
        }
      },
      mark: {
        audio: "clanxsyingxiang",
        forced: true,
        trigger: {
          global: ["gainEnd", "loseAsyncEnd"]
        },
        getIndex(event2, player2) {
          return game.filterPlayer((target) => {
            if (target == player2) {
              return false;
            }
            const gain = event2.getg?.(target) ?? [];
            const lose = event2.getl?.(player2)?.cards2 ?? [];
            return gain.length > 0 && (event2.giver === player2 || lose.some((i) => gain.includes(i)));
          }).sortBySeat();
        },
        filter(event2, player2, name, target) {
          return target?.isIn();
        },
        logTarget(event2, player2, name, target) {
          return target;
        },
        async content(event2, trigger, player2) {
          const target = event2.indexedData;
          const gain = trigger.getg?.(target);
          const lose = trigger.getl?.(player2)?.cards2;
          target.addGaintag(
            gain.filter((i) => trigger.giver === player2 || lose.includes(i)),
            "clanxsyingxiang"
          );
        }
      }
    }
  },
  //族陈泰
  clanfenjian: {
    audio: 2,
    onChooseToUse(event2) {
      const { player: player2 } = event2;
      if (!game.online && !event2.clanfenjian) {
        event2.set("clanfenjian", true);
        event2.targetprompt2.push((target) => {
          if (!target.classList.contains("selectable") || event2.skill !== "clanfenjian") {
            return false;
          }
          const num = target.getAttackRange() - get.event().player.getAttackRange();
          if (num < 0) {
            return "小于你";
          } else if (num > 0) {
            return "大于你";
          } else {
            return "等于你";
          }
        });
      }
    },
    enable: "phaseUse",
    filter(event2, player2) {
      const name = "clanfenjian_used";
      return game.hasPlayer((target) => {
        return !player2.getStorage(name).includes(Math.sign(target.getAttackRange() - player2.getAttackRange())) && target.countDiscardableCards(target, "he") > 0;
      });
    },
    filterTarget(card, player2, target) {
      return !player2.getStorage("clanfenjian_used").includes(Math.sign(target.getAttackRange() - player2.getAttackRange())) && target.countDiscardableCards(target, "he") > 0;
    },
    async content(event2, trigger, player2) {
      const { target } = event2;
      const num = Math.sign(target.getAttackRange() - player2.getAttackRange());
      player2.addTempSkill(`${event2.name}_used`, "phaseChange");
      player2.markAuto(`${event2.name}_used`, num);
      const result = await target.chooseToDiscard(`奋剑：你须弃置一张牌，若为【闪】，${get.translation(player2)}摸一张牌，否则其本回合攻击范围-1`, "he", true).forResult();
      const {
        cards: [card]
      } = result;
      if (get.name(card) == "shan") {
        await player2.draw();
      } else {
        player2.addTempSkill(`${event2.name}_debuff`);
        player2.addMark(`${event2.name}_debuff`, 1, false);
      }
    },
    ai: {
      order: 3,
      result: {
        target(player2, target) {
          return -get.effect(target, { name: "guohe_copy2" }, target, player2);
        }
      }
    },
    subSkill: {
      debuff: {
        charlotte: true,
        onremove: true,
        intro: {
          markcount: (storage) => -storage,
          content: "攻击范围-#"
        },
        mod: {
          attackRange(player2, num) {
            return num - player2.countMark("clanfenjian_debuff");
          }
        }
      },
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  clandongxu: {
    audio: 2,
    zhuanhuanji: true,
    mark: true,
    marktext: "☯",
    intro: {
      content(storage) {
        return !storage ? "你可以将你装备区里的一张牌置于其他角色装备区（替换原装备），视为对其使用一张【杀】" : "你可以将手牌摸至X（X为你的攻击范围且至多为5），视为使用一张【闪】";
      }
    },
    group: ["clandongxu_yang", "clandongxu_yin"],
    subSkill: {
      yang: {
        log: false,
        enable: "chooseToUse",
        hiddenCard(player2, name) {
          return name == "sha" && !player2.storage.clandongxu && player2.countCards("e") > 0;
        },
        filter(event2, player2) {
          return event2.filterCard(get.autoViewAs({ name: "sha", isCard: true }), player2, event2) && !player2.storage.clandongxu && player2.countCards("e") > 0;
        },
        prompt: "将装备区里的一张牌置于其他角色装备区（替换原装备），视为对其使用一张【杀】",
        ignoreMod: true,
        viewAs: {
          name: "sha",
          cards: [],
          isCard: true
        },
        filterCard: true,
        position: "e",
        filterTarget(card, player2, target) {
          const {
            cards: [cardx]
          } = ui.selected;
          if (!cardx) {
            return;
          }
          return target.canEquip(cardx, true) && lib.filter.filterTarget(get.autoViewAs(get.info("clandongxu_yang").viewAs), player2, target);
        },
        async precontent(event2, trigger, player2) {
          player2.logSkill("clandongxu");
          player2.changeZhuanhuanji("clandongxu");
          const [card] = event2.result.cards;
          const [target] = event2.result.targets;
          event2.result.cards = [];
          event2.result.card = { name: "sha", isCard: true };
          player2.$give(card, target, false);
          await target.equip(card);
          await game.delayx(2);
        },
        ai: {
          respondSha: true,
          skillTagFilter(player2, tag, arg) {
            if (tag == "respond") {
              return false;
            }
            if (tag == "respondSha" && (player2.storage.clandongxu || !player2.countCards("e"))) {
              return false;
            }
          }
        }
      },
      yin: {
        log: false,
        enable: "chooseToUse",
        hiddenCard(player2, name) {
          return name == "shan" && !player2.storage.clandongxu && player2.countCards("h") < Math.min(player2.getAttackRange(), 5);
        },
        filter(event2, player2) {
          return event2.filterCard(get.autoViewAs({ name: "shan", isCard: true }), player2, event2) && player2.storage.clandongxu && player2.countCards("h") < Math.min(player2.getAttackRange(), 5);
        },
        viewAs: {
          name: "shan",
          isCard: true
        },
        filterCard: () => false,
        selectCard: 0,
        async precontent(event2, trigger, player2) {
          player2.logSkill("clandongxu");
          player2.changeZhuanhuanji("clandongxu");
          await player2.drawTo(Math.min(player2.getAttackRange(), 5));
        },
        ai: {
          respondShan: true,
          skillTagFilter(player2, tag, arg) {
            if (tag == "respond") {
              return false;
            }
            if (tag == "respondShan" && (!player2.storage.clandongxu || player2.countCards("h") >= Math.min(player2.getAttackRange(), 5))) {
              return false;
            }
          }
        }
      }
    }
  },
  //族陈群
  clangezhi: {
    audio: 2,
    usable: 1,
    trigger: {
      global: "damageEnd"
    },
    filter(event2, player2) {
      return (event2.player == player2 || player2.inRange(event2.player)) && event2.source && event2.source != player2 && (player2.countDiscardableCards(player2, "he") > 0 || event2.source.countDiscardableCards(player2, "he") > 0);
    },
    check: (event2, player2) => get.effect(event2.source, { name: "guohe_copy2" }, player2, player2) > 0,
    logTarget: "source",
    async assignCards(event2, trigger, player2) {
      let { cards: cards2, goon, filterCard, filterButton, filterTarget, forced, position, complexCard, prompt, ai1, ai2, selectCard, selectButton, chooseonly, gaintag } = event2;
      if (!cards2.length) {
        return;
      }
      if (cards2.some((card) => get.owner(card) != player2 || !"he".includes(get.position(card)))) {
        event2.type = "button";
      } else {
        event2.type = "card";
      }
      goon ??= () => true;
      filterCard ??= () => true;
      filterButton ??= () => true;
      filterTarget ??= () => true;
      forced ??= false;
      position ??= "h";
      complexCard ??= false;
      prompt ??= "请选择要分配的卡牌和目标";
      ai1 ??= event2.type == "card" ? (card) => {
        if (!ui.selected.cards.length) {
          return 1;
        }
        return 0;
      } : (button) => {
        if (!ui.selected.buttons.length) {
          return 1;
        }
        return 0;
      };
      ai2 ??= (target) => {
        const player3 = get.player(), card = get.event().name == "chooseCardTarget" ? ui.selected.cards[0] : ui.selected.buttons[0].link;
        const val = target.getUseValue(card);
        if (val > 0) {
          return val * get.attitude(player3, target) * 2;
        }
        return get.value(card, target) * get.attitude(player3, target);
      };
      selectCard ??= [1, Infinity];
      selectButton ??= [1, Infinity];
      const give_map = /* @__PURE__ */ new Map();
      event2.give_map = give_map;
      if (_status.connectMode) {
        game.broadcastAll(function() {
          _status.noclearcountdown = true;
        });
      }
      const assigned = [];
      event2.assigned = assigned;
      if (event2.type == "card") {
        while (assigned.length < cards2.length && goon(event2)) {
          const result = await player2.chooseCardTarget({
            prompt,
            forced: typeof forced == "boolean" ? forced : forced(event2),
            filterCardx: filterCard,
            filterCard(card, ...args) {
              if (card.hasGaintag("assigned_tag")) {
                return false;
              }
              return get.event().filterCardx.call(this, card, ...args);
            },
            selectCard,
            filterTarget,
            position,
            complexCard,
            ai1,
            ai2
          }).forResult();
          if (result?.bool && result.cards?.length && result.targets?.length) {
            const {
              cards: cards3,
              targets: [target]
            } = result;
            player2.addGaintag(cards3, "assigned_tag");
            assigned.addArray(cards3);
            give_map.set(target, (give_map.get(target) || []).concat(cards3));
          } else {
            break;
          }
        }
      } else {
        while (assigned.length < cards2.length && goon(event2)) {
          const result = await player2.chooseButtonTarget({
            createDialog: [prompt, cards2.filter((i) => !assigned.includes(i))],
            forced: typeof forced == "boolean" ? forced : forced(event2),
            filterButton,
            filterTarget,
            selectButton,
            ai1,
            ai2
          }).forResult();
          if (result?.bool && result.links?.length && result.targets?.length) {
            const {
              links,
              targets: [target]
            } = result;
            assigned.addArray(links);
            give_map.set(target, (give_map.get(target) || []).concat(links));
          } else {
            break;
          }
        }
      }
      event2.result = give_map;
      if (_status.connectMode) {
        game.broadcastAll(function() {
          delete _status.noclearcountdown;
          game.stopCountChoose();
        });
      }
      if (!chooseonly) {
        player2.line(Array.from(give_map.keys()));
        if (event2.type == "button") {
          for (const target of Array.from(give_map.keys()).sortBySeat()) {
            game.log(target, "获得了", give_map.get(target));
          }
        }
        event2.done ??= game.loseAsync({
          gain_list: Array.from(give_map.entries()),
          giver: player2,
          player: event2.type == "card" ? player2 : null,
          cards: Array.from(give_map.values()).flat(),
          animate: event2.type == "card" ? "giveAuto" : "gain2",
          gaintag: gaintag || []
        }).setContent("gaincardMultiple");
        await event2.done;
      }
    },
    async content(event2, trigger, player2) {
      const {
        targets: [target]
      } = event2;
      let cards2 = [];
      if (player2.countDiscardableCards(player2, "he")) {
        const result = await player2.chooseToDiscard("he", true).forResult();
        if (result?.cards?.length) {
          cards2.addArray(result.cards);
        }
      }
      if (target.countDiscardableCards(player2, "he")) {
        const result = await player2.discardPlayerCard(target, "he", true).forResult();
        if (result?.cards?.length) {
          cards2.addArray(result.cards);
        }
      }
      const cardsx = cards2.filterInD("d");
      if (cardsx.length) {
        const next = game.createEvent("assignCards");
        next.set("player", player2);
        next.set("cards", cardsx);
        next.setContent(get.info(event2.name).assignCards);
        await next;
      }
      const types = cards2.map((card) => get.type2(card)).unique();
      if (types.length != 1) {
        [player2, target].forEach((i) => {
          i.addTempSkill(`${event2.name}_debuff`);
          i.setStorage(`${event2.name}_debuff`, types);
          i.markSkill(`${event2.name}_debuff`);
        });
      }
    },
    subSkill: {
      debuff: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "只能使用：$"
        },
        mod: {
          cardEnabled(card, player2) {
            if (!player2.getStorage("clangezhi_debuff").includes(get.type2(card))) {
              return false;
            }
          },
          cardSavable(card, player2) {
            if (!player2.getStorage("clangezhi_debuff").includes(get.type2(card))) {
              return false;
            }
          }
        }
      }
    }
  },
  clanmingdian: {
    audio: 2,
    enable: "phaseUse",
    trigger: { player: "damageEnd" },
    filter(event2, player2) {
      return player2.hasCard((card) => get.type(card) == "basic" && player2.canRecast(card) && !player2.getStorage("clanmingdian_used").includes(get.name(card)), "he");
    },
    filterCard(card) {
      const player2 = get.player();
      return get.type(card) == "basic" && player2.canRecast(card) && !player2.getStorage("clanmingdian_used").includes(get.name(card));
    },
    selectCard: [1, Infinity],
    position: "he",
    check(card) {
      return 7 - get.value(card);
    },
    lose: false,
    discard: false,
    delay: false,
    async cost(event2, trigger, player2) {
      event2.result = await player2.chooseCard(get.prompt2(event2.skill), [1, Infinity], "he", get.info(event2.skill).filterCard).set("ai", (card) => 7.5 - get.value(card)).forResult();
    },
    async content(event2, trigger, player2) {
      const { cards: cards2 } = event2;
      const names = cards2.map((card) => get.name(card)).unique();
      player2.addTempSkill(`${event2.name}_used`, "roundStart");
      player2.markAuto(`${event2.name}_used`, names);
      await player2.recast(cards2);
      if (player2.hasHistory("useCard", (evt) => names.includes(get.name(evt.card)))) {
        const list = player2.getCards("h").map((card2) => get.name(card2)).unique();
        const card = get.cardPile((card2) => get.type(card2) == "basic" && !list.includes(get.name(card2)), void 0, "random");
        if (card) {
          await player2.gain(card, "gain2");
        } else {
          player2.chat("碰！");
        }
      }
    },
    ai: {
      order: 4,
      result: {
        player: 1
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "已重铸：$"
        }
      }
    }
  },
  clanshize: {
    audio: 2,
    clanSkill: true,
    audioname: ["clan_chenqun"],
    trigger: {
      global: ["useCard", "respond"]
    },
    locked: true,
    filter(event2, player2) {
      if (_status.currentPhase !== player2) {
        return false;
      }
      const history = game.getGlobalHistory("everything", (evt) => {
        if (!["useCard", "respond"].includes(evt.name)) {
          return false;
        }
        return evt.respondTo?.[0] == player2;
      });
      return history.indexOf(event2) == 0 && game.hasPlayer((target) => target.hasClan("颍川陈氏") || target == player2);
    },
    async cost(event2, trigger, player2) {
      event2.result = await player2.chooseTarget(`###${get.translation(event2.skill)}###${get.skillInfoTranslation(event2.skill, player2)}`, true, (card, player3, target) => {
        return target.hasClan("颍川陈氏") || target == player3;
      }).set("ai", (target) => {
        const player3 = get.player();
        const att = get.attitude(player3, target);
        if (att > 0) {
          return game.countPlayer((i) => !i.inRangeOf(target)) + 1;
        }
        return 0;
      }).forResult();
    },
    async content(event2, trigger, player2) {
      const [target] = event2.targets;
      game.log(target, "的攻击范围", "#g+1");
      target.addSkill(`${event2.name}_effect`);
      target.addMark(`${event2.name}_effect`, 1, false);
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        trigger: { player: "damage" },
        filter(event2, player2) {
          return player2.hasMark("clanshize_effect");
        },
        silent: true,
        async content(event2, trigger, player2) {
          player2.removeSkill(event2.name);
        },
        mod: {
          attackRange(player2, num) {
            return num + player2.countMark("clanshize_effect");
          }
        },
        markimage: "image/card/attackRange.png",
        intro: {
          content(num, player2) {
            let str = "<li>攻击范围+";
            str += num;
            str += "<br><li>当前攻击范围：";
            str += player2.getAttackRange(false);
            return str;
          }
        }
      }
    }
  },
  //族荀彧
  clandingan: {
    audio: 2,
    trigger: {
      global: "useCardAfter"
    },
    filter(event2, player2) {
      return game.getGlobalHistory("useCard", (evt) => evt.card.name == event2.card.name).indexOf(event2) == 1 && game.hasPlayer((target) => !event2.targets.includes(target) && !player2.getStorage("clandingan_used").includes(target));
    },
    forced: true,
    async content(event2, trigger, player2) {
      const skill = `${event2.name}_used`;
      const pre_targets = game.filterPlayer((target) => {
        return !trigger.targets.includes(target) && !player2.getStorage(skill).includes(target);
      });
      const result = pre_targets.length > 1 ? await player2.chooseTarget(
        `定安：与一名不为此牌目标的其他角色各摸一张牌`,
        (card, player3, target) => {
          return get.event().targetx.includes(target);
        },
        true
      ).set("targetx", pre_targets).set("prompt2", "然后你令手牌最多的其他角色执行一项：1.受到你造成的1点伤害；2.弃置手牌中最多的同名牌。").set("ai", (target) => {
        const { player: player3, targetx } = get.event(), getD = (current) => get.effect(current, { name: "draw" }, player3, player3);
        const eff = getD(target);
        if (eff > 0) {
          return 2;
        }
        if (ui.selected.targets.every((current) => getD(current) > 0 && current.countCards("h") < target.countCards("h"))) {
          return -eff;
        }
        return 0;
      }).forResult() : {
        bool: true,
        targets: pre_targets
      };
      if (!result?.bool || !result.targets) {
        return;
      }
      player2.addTempSkill(skill);
      player2.markAuto(skill, result.targets);
      const targets = [player2, ...result.targets.sortBySeat()];
      await game.asyncDraw(targets);
      const currents = game.filterPlayer((target) => target != player2 && target.isMaxHandcard(false, (current) => current != player2));
      if (!currents?.length) {
        return;
      }
      const func = async (target) => {
        const result2 = await player2.chooseButton(
          [
            `定安：选择一项令${get.translation(target)}执行`,
            [
              [
                ["damage", "受到你造成的1点伤害"],
                ["discard", "随机弃置手牌中最多的同名牌"]
              ],
              "textbutton"
            ]
          ],
          true
        ).set("targetx", target).set("ai", (button) => {
          const { player: player3, targetx: target2 } = get.event();
          if (button.link == "damage") {
            return get.damageEffect(target2, player3, player3);
          }
          return get.sgnAttitude(player3, target2) * Math.sqrt(target2.countCards("h"));
        }).forResult();
        if (result2?.bool && result2.links?.length) {
          player2.line(target);
          if (result2.links[0] == "damage") {
            await target.damage(player2);
          } else {
            const cards2 = target.getCards("h"), names = cards2.map((card) => get.name(card)), maxName = names.toUniqued().maxBy((name2) => get.numOf(names, name2));
            const num = get.numOf(names, maxName);
            const name = names.toUniqued().filter((name2) => get.numOf(names, name2) == num).randomGet();
            if (name) {
              const discards = cards2.filter((card) => get.name(card) == name);
              if (discards?.length) {
                await target.modedDiscard(discards);
              }
            }
          }
        }
      };
      await game.doAsyncInOrder(currents, func);
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  clanfuning: {
    audio: 2,
    trigger: {
      player: "changeHpAfter"
    },
    filter(event2, player2) {
      const evts = game.getRoundHistory("changeHp", (evt) => evt.player == player2 && evt.num != 0);
      if (evts.indexOf(event2) !== 0) {
        return false;
      }
      if (!game.hasPlayer((current) => current != player2)) {
        return false;
      }
      const num = Math.max(1, player2.getDamagedHp());
      return player2.countCards("he") >= num;
    },
    async cost(event2, trigger, player2) {
      const num = Math.max(1, player2.getDamagedHp()), count = game.countPlayer2((current) => current.hasHistory("damage"), true);
      event2.result = await player2.chooseCardTarget({
        prompt: get.prompt2(event2.skill),
        filterCard: true,
        position: "he",
        selectCard: [num, Infinity],
        filterTarget: lib.filter.notMe,
        complexCard: true,
        count,
        ai1(card) {
          const color = get.color(card), { player: player3, count: count2 } = get.event();
          if (!player3.isDamaged() || ui.selected.cards.every((cardx) => get.color(cardx) == color)) {
            const num2 = ui.selected.cards.length, num22 = player3.countCards("h", (cardx) => !ui.selected.cards.includes(cardx));
            if (count2 <= num2 && num22 > player3.maxHp) {
              return 15 - get.value(card);
            }
            return 10 - get.value(card);
          }
          return 3 - get.value(card);
        },
        ai2(target) {
          const player3 = get.player();
          return get.attitude(player3, target);
        }
      }).forResult();
    },
    async content(event2, trigger, player2) {
      const {
        cards: cards2,
        targets: [target]
      } = event2;
      const bool1 = cards2.map((card) => get.color(card)).toUniqued().length == 1, bool2 = cards2.length > game.countPlayer2((current) => current.hasHistory("damage"), true);
      await player2.give(cards2, target);
      if (bool1) {
        await player2.recover();
      }
      if (bool2) {
        const num = player2.countCards("h") - player2.maxHp;
        if (num > 0) {
          const count = Math.min(num, player2.countDiscardableCards(player2, "h"));
          if (count > 0) {
            await player2.chooseToDiscard("h", count, true);
          }
        } else if (num < 0) {
          await player2.draw(-num);
        }
      }
    }
  },
  //族韩馥
  clanheta: {
    audio: 2,
    trigger: {
      player: "phaseUseBegin"
    },
    filter(event2, player2) {
      return !player2.isLinked();
    },
    async content(event2, trigger, player2) {
      await player2.link(true);
      player2.addTempSkill("clanheta_effect");
    },
    subSkill: {
      effect: {
        trigger: {
          player: "useCard1"
        },
        filter(event2, player2) {
          if (!player2.isLinked() || ["equip", "delay"].includes(get.type(event2.card))) {
            return false;
          }
          if (get.info(event2.card)?.multitarget) {
            return false;
          }
          const targets = player2.getHistory(
            "useCard",
            (evt) => {
              return evt?.targets?.length && evt != event2;
            },
            event2
          ).map((evt) => evt.targets ?? []).flat().toUniqued();
          return targets.some((target) => {
            if (event2.targets?.includes(target)) {
              return true;
            }
            return lib.filter.targetEnabled2(event2.card, player2, target);
          });
        },
        charlotte: true,
        async cost(event2, trigger, player2) {
          const targets = player2.getHistory(
            "useCard",
            (evt) => {
              return evt?.targets?.length && evt != trigger;
            },
            trigger
          ).map((evt) => evt.targets ?? []).flat().toUniqued();
          event2.result = await player2.chooseTarget(
            (card, player3, target) => {
              const { targetx, targety, cardx } = get.event();
              if (!targetx.includes(target)) {
                return false;
              }
              if (ui.selected.targets?.length) {
                const first = ui.selected.targets[0];
                if (targety.includes(first) !== targety.includes(target)) {
                  return false;
                }
              }
              return targety.includes(target) || lib.filter.targetEnabled2(cardx, player3, target);
            },
            [1, Infinity]
          ).set("targetx", targets).set("targety", trigger.targets).set("cardx", trigger.card).set("complexTarget", true).set("targetprompt", (target) => {
            const { targety } = get.event();
            return targety.includes(target) ? "取消目标" : "成为目标";
          }).set("prompt", get.translation(event2.skill)).set("prompt2", "为此牌增加或减少任意个目标").set("ai", (target) => {
            const { targety, cardx, player: player3 } = get.event(), eff = get.effect(target, cardx, player3, player3);
            if (targety.includes(target)) {
              return -eff * get.attitude(player3, target);
            }
            return eff * get.attitude(player3, target);
          }).forResult();
        },
        async content(event2, trigger, player2) {
          await player2.link(false);
          const bool = trigger.targets.containsSome(...event2.targets);
          trigger.targets[bool ? "removeArray" : "addArray"](event2.targets);
          await game.delay();
        }
      }
    }
  },
  clanyingxiang: {
    audio: 3,
    trigger: {
      player: "phaseUseEnd"
    },
    filter(event2, player2) {
      return game.hasPlayer((current) => player2.canCompare(current));
    },
    async cost(event2, trigger, player2) {
      const list = get.inpileVCardList((info) => {
        if (info[0] == "basic" && !info[3]) {
          return true;
        }
        if (info[0] != "trick") {
          return false;
        }
        const infox = lib.card[info[2]];
        if (infox.notarget || info.selectTarget && infox.selectTarget != 1) {
          return false;
        }
        return infox.type == "trick";
      });
      if (!list.length) {
        return;
      }
      const result = await player2.chooseButtonTarget({
        createDialog: [get.prompt2(event2.skill), [list, "vcard"]],
        filterTarget(card, player3, target) {
          return player3.canCompare(target);
        },
        ai1(button) {
          const card = player2.getCards("h").maxBy(
            (card2) => {
              return get.number(card2);
            },
            (card2) => card2.name == button.link[2]
          );
          if (card) {
            return get.number(card);
          }
          return 0;
        },
        ai2(target) {
          return -get.attitude(get.player(), target);
        }
      }).forResult();
      if (result.bool) {
        event2.result = {
          bool: true,
          targets: result.targets,
          cost_data: result.links[0][2]
        };
      }
    },
    async content(event2, trigger, player2) {
      const {
        targets: [target],
        cost_data: name
      } = event2;
      game.log(player2, "声明的牌名为", `#y${get.translation(name)}`);
      player2.chat(get.translation(name));
      const result = await player2.chooseToCompare(target).forResult();
      if (!result.tie) {
        const winner = result.bool ? player2 : target, card = new lib.element.VCard({ name, isCard: true });
        if (winner.hasUseTarget(card)) {
          await winner.chooseUseTarget(card, true);
        }
      }
      const cards2 = [result.player, result.target];
      if (cards2.some((card) => card.name == name)) {
        if (player2.hasSkill("clanxumin", null, null, false) && !player2.hasSkill("clanxumin")) {
          player2.restoreSkill("clanxumin");
          game.log(player2, "重置了", "【恤民】");
        }
      } else {
        if (cards2.someInD("od")) {
          await player2.gain(cards2.filterInD("od"), "gain2");
        }
        const skills2 = player2.getSkills(null, false, false).filter((skill) => {
          let info = get.info(skill);
          if (!info || info.charlotte || get.skillInfoTranslation(skill, player2).length == 0) {
            return false;
          }
          return true;
        });
        const result2 = skills2.length > 1 ? await player2.chooseButton(["迎乡：失去一个技能", [skills2, "skill"]], true).set("ai", (button) => {
          const { link } = button;
          const info = get.info(link);
          if (info?.ai?.neg || info?.ai?.halfneg) {
            return 3;
          }
          return ["clanyingxiang", "clanxumin"].indexOf(link) + 1;
        }).forResult() : {
          bool: true,
          links: skills2
        };
        if (result2?.bool && result2?.links?.length) {
          await player2.removeSkills(result2.links);
        }
      }
    }
  },
  //族陆绩
  clangailan: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter(event2, player2) {
      return (event2.name != "phase" || game.phaseNumber == 0) && !lib.inpile.includes("huntianyi");
    },
    async content(event2, trigger, player2) {
      const cards2 = [];
      for (const i of [1, 3, 10, 12]) {
        cards2.push(game.createCard2("huntianyi", "diamond", i));
      }
      game.broadcastAll(function() {
        lib.inpile.add("huntianyi");
      });
      await game.cardsGotoPile(cards2, () => {
        return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
      });
    },
    group: "clangailan_equip",
    subSkill: {
      equip: {
        audio: "clangailan",
        trigger: {
          player: "phaseBegin"
        },
        filter(event2, player2) {
          return lib.inpile.includes("huntianyi");
        },
        forced: true,
        async content(event2, trigger, player2) {
          const card = get.cardPile((card2) => card2.name == "huntianyi");
          if (card && player2.canEquip(card, true)) {
            player2.$gain2(card);
            await game.delayx();
            await player2.equip(card);
          }
        }
      }
    }
  },
  huntianyi_skill: {
    equipSkill: true,
    trigger: { player: "damageBegin2" },
    filter(event2, player2) {
      if (player2.hasSkillTag("unequip2")) {
        return false;
      }
      if (event2.source?.hasSkillTag("unequip", false, {
        name: event2.card ? event2.card.name : null,
        target: player2,
        card: event2.card
      })) {
        return false;
      }
      return player2.getEquip("huntianyi");
    },
    forced: true,
    async content(event2, trigger, player2) {
      const card = player2.getEquip("huntianyi");
      await player2.lose(card, "visible", ui.ordering);
      trigger.cancel();
    },
    subSkill: {
      lose: {
        audio: "huntianyi_skill",
        forced: true,
        charlotte: true,
        equipSkill: true,
        trigger: {
          player: "loseAfter",
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter: (event2, player2, name, card) => {
          if (!card || card.name != "huntianyi") {
            return false;
          }
          return !player2.hasSkillTag("unequip2");
        },
        getIndex(event2, player2) {
          const evt = event2.getl(player2);
          const lostCards = [];
          evt.es.forEach((card) => {
            const VEquip = evt.vcard_map.get(card);
            if (VEquip?.name === "huntianyi") {
              lostCards.add(VEquip);
            }
          });
          return lostCards;
        },
        async content(event2, trigger, player2) {
          const num = get.number(event2.indexedData, false), cards2 = [];
          while (cards2.length < 2) {
            const cardx = get.cardPile2((card) => {
              return get.number(card, false) == num && !cards2.includes(card) && get.type2(card, false) == "trick";
            });
            if (cardx) {
              cards2.push(cardx);
            } else {
              break;
            }
          }
          if (cards2.length) {
            await player2.gain(cards2, "gain2");
          }
        }
      }
    }
  },
  clanfennu: {
    audio: 2,
    trigger: {
      player: "phaseUseBegin"
    },
    filter(event2, player2) {
      return game.hasPlayer((current) => current.countCards("he"));
    },
    async cost(event2, trigger, player2) {
      event2.result = await player2.chooseTarget(get.prompt2(event2.skill), [1, player2.hp]).set("filterTarget", (card, player3, target) => {
        return target.countCards("he");
      }).set("ai", (target) => {
        const player3 = get.player();
        if (target.hasSkill("clanzelie") && target.countCards("e") == 1 && !target.countCards("j")) {
          return get.attitude(player3, target);
        }
        return get.effect(target, { name: "guohe_copy2" }, player3, player3);
      }).forResult();
    },
    async content(event2, trigger, player2) {
      const targets = event2.targets.filter((target) => target.countDiscardableCards(target, "he"));
      if (!targets?.length) {
        return;
      }
      if (!event2.isMine() && !event2.isOnline()) {
        await game.delayx();
      }
      const nextx = player2.chooseCardOL(targets, "he", true, 1, "奋驽：弃置一张牌", (card, player3, target) => {
        return lib.filter.cardDiscardable(card, player3, "clanfennu");
      }).set("ai", (card) => {
        return 7 - get.value(card);
      });
      nextx._args.remove("glow_result");
      const result = await nextx.forResult();
      const cards2 = [];
      for (let i = 0; i < result.length; i++) {
        const current = targets[i], cards22 = result[i].cards;
        cards2.addArray(cards22);
        await current.modedDiscard(cards22);
      }
      const next = player2.addToExpansion(cards2, "gain2");
      next.gaintag.add("clanfennu");
      await next;
    },
    marktext: "逸",
    intro: {
      name: "逸",
      mark(dialog, storage, player2) {
        const list = player2.getExpansions("clanfennu");
        if (!list.length) {
          return "没有记录";
        }
        const num1 = list.reduce((sum, card) => sum + get.number(card, false), 0);
        dialog.addText(`“逸”牌总点数：${num1}`);
        dialog.addSmall(list);
        const num2 = player2.countMark("clanfennu_record");
        dialog.addText(`已记录点数：${num2}`);
      },
      markcount(storage, player2) {
        const num = player2.countMark("clanfennu_record");
        return num || null;
      }
    },
    onremove(player2, skill) {
      const cards2 = player2.getExpansions(skill);
      if (cards2.length) {
        player2.loseToDiscardpile(cards2);
      }
      player2.clearMark(`${skill}_record`, false);
    },
    group: ["clanfennu_record", "clanfennu_gain"],
    subSkill: {
      record: {
        trigger: {
          player: "useCardToPlayer"
        },
        filter(event2, player2) {
          if (!player2.getExpansions("clanfennu").length || !event2.isFirstTarget) {
            return false;
          }
          const num = get.number(event2.card, false);
          return num && typeof num == "number";
        },
        direct: true,
        async content(event2, trigger, player2) {
          player2.addMark(event2.name, get.number(trigger.card), false);
          player2.markSkill("clanfennu");
        }
      },
      gain: {
        audio: "clanfennu",
        trigger: {
          player: "phaseZhunbeiBegin"
        },
        filter(event2, player2) {
          if (!player2.getExpansions("clanfennu").length || !player2.countMark("clanfennu_record")) {
            return false;
          }
          const num1 = player2.getExpansions("clanfennu").reduce((sum, card) => sum + get.number(card, false), 0), num2 = player2.countMark("clanfennu_record");
          return num1 < num2;
        },
        forced: true,
        locked: false,
        async content(event2, trigger, player2) {
          player2.clearMark("clanfennu_record", false);
          await player2.gain(player2.getExpansions("clanfennu"), "gain2");
        }
      }
    }
  },
  clanzelie: {
    audio: 2,
    audioname: ["clan_lujing"],
    trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
    getIndex(event2, player2) {
      return game.filterPlayer((current) => {
        if (current.countCards("ej") || !current.hasClan("吴郡陆氏") && current != player2) {
          return false;
        }
        const evt = event2.getl(current);
        return evt?.es?.length || evt?.js?.length;
      }).sortBySeat(_status.currentPhase);
    },
    filter: (event2, player2, name, target) => target?.isIn(),
    clanSkill: true,
    async cost(event2, trigger, player2) {
      event2.result = await player2.chooseTarget(get.prompt2(event2.skill)).set("ai", (target) => {
        const player3 = get.player(), att = get.attitude(player3, target);
        return att;
      }).forResult();
    },
    async content(event2, trigger, player2) {
      const target = event2.targets[0];
      target.addTempSkill("clanzelie_effect");
      target.addMark("clanzelie_effect", 1, false);
    },
    ai: {
      noe: true,
      skillTagFilter(player2, tag, arg) {
        return player2.countCards("ej") == 1;
      }
    },
    subSkill: {
      effect: {
        trigger: {
          player: ["gainAfter", "loseAfter"],
          global: "loseAsyncAfter"
        },
        charlotte: true,
        direct: true,
        firstDo: true,
        onremove: true,
        getIndex(event2, player2) {
          return player2.countMark("clanzelie_effect");
        },
        filter(event2, player2) {
          if (!player2.hasMark("clanzelie_effect")) {
            return false;
          }
          if (event2.name == "gain") {
            return event2.getParent().name == "draw";
          }
          return event2.type == "discard" && event2.getl(player2).cards2.length && player2.countCards("he");
        },
        intro: {
          content: "本回合下$次摸牌/弃置牌后，摸一张牌/弃置一张牌"
        },
        async content(event2, trigger, player2) {
          player2.removeMark("clanzelie_effect", 1, false);
          if (trigger.name == "gain") {
            await player2.draw();
          } else {
            await player2.chooseToDiscard("he", true);
          }
        }
      }
    }
  },
  //族陆景
  clantanfeng: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    viewAs: {
      name: "sha",
      isCard: true,
      storage: {
        tanfeng: true
      }
    },
    async precontent(event2, trigger, player2) {
      if (event2.getParent().addCount !== false) {
        event2.getParent().addCount = false;
      }
      const target = event2.result.targets[0];
      player2.when({ player: "useCardAfter" }).filter((evt) => evt.getParent() == event2.getParent()).assign({
        ai: {
          unequip: true,
          unequip_ai: true,
          skillTagFilter(player3, tag, arg) {
            const card = tag == "unequip_ai" ? arg : arg?.card;
            if (!card?.storage?.tanfeng) {
              return false;
            }
          }
        }
      }).step(async (event3, trigger2, player3) => {
        if (player3.getHistory("sourceDamage", (evt) => evt.card == trigger2.card).length) {
          const num = Math.abs(player3.countCards("e") - target.countCards("e"));
          if (num > 0) {
            await player3.draw(num);
          }
        } else {
          const sha = get.autoViewAs({ name: "sha", isCard: true });
          if (!target.canUse(sha, player3, false)) {
            return;
          }
          const { bool } = await target.chooseBool("探锋", `是否视为对${get.translation(player3)}使用一张【杀】？`).set("choice", get.effect(player3, sha, target, target) > 0).forResult();
          if (bool) {
            await target.useCard(sha, player3, false);
          }
        }
      });
    },
    selectCard: -1,
    filterCard: () => false,
    selectTarget: 1,
    ai: {
      order() {
        return get.order({ name: "sha" }) + 0.1;
      }
    }
  },
  clanjuewei: {
    audio: 2,
    trigger: {
      player: "useCardToPlayered",
      target: "useCardToTargeted"
    },
    filter(event2, player2, name) {
      if (!event2.card || !get.is.damageCard(event2.card)) {
        return false;
      }
      if (name == "useCardToPlayered" && !event2.isFirstTarget) {
        return false;
      }
      return player2.countCards("he", (card) => {
        if (get.type(card, player2) != "equip") {
          return false;
        }
        return lib.filter.cardDiscardable(card, player2, "clanjuewei") || lib.filter.cardRecastable(card, player2);
      });
    },
    usable: 1,
    async cost(event2, trigger, player2) {
      const prompt1 = `重铸一张装备牌，于${get.translation(trigger.card)}结算完成后视为对一名不为你的角色使用此牌`, prompt2 = `弃置一张装备牌，令${get.translation(trigger.card)}无效`;
      const result = await player2.chooseButton([
        get.prompt(event2.skill),
        [
          [
            ["Recast", prompt1],
            ["Discard", prompt2]
          ],
          "textbutton"
        ]
      ]).set("filterButton", (button) => {
        const player3 = get.player(), source = button.link == "Recast" ? null : "clanjuewei";
        return player3.countCards("he", (card) => {
          if (get.type(card, player3) != "equip") {
            return false;
          }
          return lib.filter[`card${button.link}able`](card, player3, source);
        });
      }).set("ai", (button) => {
        const player3 = get.player(), trigger2 = get.event().getTrigger();
        if (button.link == "Recast") {
          if (!trigger2.targets || trigger2.targets.every((target2) => target2 == player3)) {
            return 0;
          }
          const target = trigger2.targets.maxBy(
            (target2) => {
              return get.effect(target2, trigger2.card, player3, player3);
            },
            (target2) => target2 != player3
          );
          return get.effect(target, trigger2.card, player3, player3);
        }
        return trigger2.targets.reduce((sum, target) => {
          sum -= get.effect(target, trigger2.card, trigger2.player, player3);
        }, 0) - 2;
      }).forResult();
      if (!result.bool) {
        return;
      }
      const link = result.links[0], type = `card${link}able`;
      event2.result = await player2.chooseCard(
        "绝围",
        link == "Recast" ? prompt1 : prompt2,
        (card) => {
          const { player: player3, actType: type2 } = get.event(), source = type2 == "Recast" ? null : "clanjuewei";
          return get.type(card, player3) == "equip" && lib.filter[type2](card, player3, source);
        },
        "he"
      ).set("actType", type).set("ai", (card) => {
        return 8 - get.value(card);
      }).forResult();
      event2.result.cost_data = link;
    },
    async content(event2, trigger, player2) {
      if (event2.cost_data == "Recast") {
        await player2.recast(event2.cards);
        player2.when({ global: "useCardAfter" }).filter((evt) => evt == trigger.getParent()).step(async (event3, trigger2, player3) => {
          const targets = trigger2.targets.filter((target) => target != player3 && target.isIn());
          if (targets?.length) {
            await player3.chooseUseTarget(trigger2.card, false, true, targets, 1);
          }
        });
      } else {
        await player2.discard(event2.cards);
        trigger.getParent().all_excluded = true;
        trigger.getParent().targets.length = 0;
      }
    }
  },
  //族杨彪
  clanjiannan: {
    audio: 2,
    trigger: {
      player: "phaseUseBegin"
    },
    frequent: true,
    async content(event2, trigger, player2) {
      const next = player2.draw(2);
      next.gaintag = [event2.name];
      await next;
      player2.addTempSkill("clanjiannan_effect", "phaseChange");
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true,
        sub: true
      },
      effect: {
        audio: "clanjiannan",
        trigger: {
          global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        onremove(player2) {
          game.filterPlayer().forEach((target) => target.removeGaintag("clanjiannan"));
        },
        charlotte: true,
        filter(event2, player2, triggername, target) {
          if (_status?.dying?.length || player2.getStorage("clanjiannan_used").length > 3) {
            return false;
          }
          return true;
        },
        getIndex(event2, player2, triggername) {
          const targets = game.filterPlayer((target) => {
            const evt = event2.getl(target);
            if (!target.countCards("h") && evt?.hs?.length) {
              return true;
            }
            if (!evt?.cards2?.length || target.countCards("h", (card) => card.hasGaintag("clanjiannan"))) {
              return false;
            }
            if (event2.name == "lose") {
              return Object.values(event2.gaintag_map).flat().includes("clanjiannan");
            }
            return target.hasHistory("lose", (evtx) => {
              if (event2 != evtx.getParent()) {
                return false;
              }
              return Object.values(evtx.gaintag_map).flat().includes("clanjiannan");
            });
          });
          return targets.length;
        },
        async cost(event2, trigger, player2) {
          event2.result = await player2.chooseButtonTarget({
            createDialog: [
              "间难：令一名角色执行本回合未执行过的一项",
              [
                [
                  ["discard", "弃置两张牌"],
                  ["draw", "摸两张牌"],
                  ["recast", "重铸所有装备牌"],
                  ["put", "将一张锦囊牌置于牌堆顶或失去1点体力"]
                ],
                "textbutton"
              ]
            ],
            forced: true,
            chooseds: player2.getStorage("clanjiannan_used"),
            filterButton: (button) => {
              const link = button.link;
              return !get.event().chooseds.includes(link);
            },
            filterTarget: true,
            ai1: (button) => {
              const player3 = get.player();
              switch (button.link) {
                case "discard": {
                  if (game.hasPlayer((target) => {
                    const att = get.attitude(player3, target);
                    return att < 0 && target.countCards("he");
                  })) {
                    return 2;
                  }
                  break;
                }
                case "draw": {
                  return 4;
                }
                case "recast": {
                  if (player3.hasCard((card) => get.type(card) == "equip", "he")) {
                    return 3;
                  }
                  break;
                }
                case "put": {
                  if (game.hasPlayer((target) => {
                    const att = get.attitude(player3, target);
                    return att < 0 && target.hp <= 1 && target.countCards("h") <= 3;
                  })) {
                    return 5;
                  }
                  break;
                }
              }
              return 1;
            },
            ai2: (target) => {
              const link = ui.selected.buttons[0]?.link, player3 = get.player(), att = get.attitude(player3, target);
              if (!link) {
                return 0;
              }
              if (["draw", "recast"].includes(link)) {
                if (target == player3) {
                  return att * 3;
                }
                return att;
              }
              return -att;
            }
          }).forResult();
          if (event2.result.bool) {
            event2.result.cost_data = { link: event2.result.links[0] };
          }
        },
        async content(event2, trigger, player2) {
          const target = event2.targets[0];
          player2.addTempSkill("clanjiannan_used");
          const link = event2.cost_data.link;
          player2.markAuto("clanjiannan_used", link);
          switch (link) {
            case "discard": {
              await target.chooseToDiscard("he", 2, true);
              break;
            }
            case "draw": {
              const next = target.draw(2);
              next.gaintag = ["clanjiannan"];
              await next;
              break;
            }
            case "recast": {
              await target.recast(
                target.getCards("he", (card) => target.canRecast(card) && get.type(card, player2) == "equip"),
                null,
                (player3, cards2) => {
                  let next = player3.draw(cards2.length);
                  next.log = false;
                  next.gaintag = ["clanjiannan"];
                }
              );
              break;
            }
            case "put": {
              const result2 = await target.chooseCard(
                "将一张锦囊牌置于牌堆顶，或失去1点体力",
                (card) => {
                  return get.type2(card) == "trick";
                },
                "h"
              ).set("ai", function(card) {
                return 7 - get.value(card);
              }).forResult();
              if (result2.bool) {
                target.$throw(result2.cards.length);
                game.log(target, "将", result2.cards, "置于牌堆顶");
                await target.lose(result2.cards, ui.cardPile, "insert");
              } else {
                await target.loseHp();
              }
              break;
            }
          }
        }
      }
    }
  },
  clanyichi: {
    audio: 2,
    trigger: {
      player: "phaseJieshuBegin"
    },
    filter(event2, player2) {
      return game.hasPlayer((target) => player2.canCompare(target));
    },
    async cost(event2, trigger, player2) {
      event2.result = await player2.chooseTarget(get.prompt2(event2.skill), (card, player3, target) => player3.canCompare(target)).set("ai", (target) => {
        const player3 = get.player(), num = player3.getHistory("useSkill", (evt) => ["clanjiannan", "clanjiannan_effect"].includes(evt.skill)).length;
        return num > 1 ? get.attitude(player3, target) : -get.attitude(player3, target);
      }).forResult();
    },
    async content(event2, trigger, player2) {
      const target = event2.targets[0], { bool } = await player2.chooseToCompare(target).forResult(), num = player2.getHistory("useSkill", (evt) => ["clanjiannan", "clanjiannan_effect"].includes(evt.skill)).length;
      if (bool && num > 0) {
        let count = 1;
        while (count < 5) {
          switch (count) {
            case 1: {
              if (target.countDiscardableCards(target, "he")) {
                await target.chooseToDiscard("he", 2, true);
              }
              break;
            }
            case 2: {
              await target.draw(2);
              break;
            }
            case 3: {
              await target.recast(target.getCards("he", (card) => target.canRecast(card) && get.type(card, player2) == "equip"));
              break;
            }
            case 4: {
              const result2 = await target.chooseCard(
                "将一张锦囊牌置于牌堆顶，或失去1点体力",
                (card) => {
                  return get.type2(card) == "trick";
                },
                "h"
              ).set("ai", function(card) {
                return 7 - get.value(card);
              }).forResult();
              if (result2.bool) {
                await target.lose(result2.cards, ui.cardPile, "insert");
                target.$throw(result2.cards.length);
                game.updateRoundNumber();
                game.log(target, "将", result2.cards, "置于牌堆顶");
              } else {
                await target.loseHp();
              }
              break;
            }
          }
          count++;
          if (count > num) {
            break;
          }
        }
      }
    }
  },
  //族杨众 —— by 星の语
  clanjuetu: {
    audio: 2,
    trigger: { player: "phaseDiscardBegin" },
    forced: true,
    async content(event2, trigger, player2) {
      trigger.setContent(lib.skill[event2.name].phaseDiscard);
    },
    phaseDiscard: [
      async (event2, trigger, player2) => {
        game.log(player2, "进入了弃牌阶段");
        game.broadcastAll(function(player3) {
          if (lib.config.show_phase_prompt) {
            player3.popup("弃牌阶段", null, false);
          }
        }, player2);
        event2.trigger("phaseDiscard");
      },
      async (event2, trigger, player2) => {
        const cards2 = player2.getCards("h"), suits = cards2.map((card) => get.suit(card, player2));
        if (!cards2.length) {
          event2.finish();
          return;
        }
        if (lib.suits.some((suit) => suits.filter((suitx) => suitx == suit).length > 1)) {
          const result = await player2.chooseCard("请保留每种花色的手牌各一张，将其余手牌置入弃牌堆", [1, Infinity], true, (card, player3) => {
            const selected = ui.selected.cards;
            if (!selected?.length) {
              return true;
            }
            return !selected.some((cardx) => get.suit(cardx, player3) == get.suit(card, player3));
          }).set("complexCard", true).set("suits", suits).set("ai", (card) => get.value(card)).forResult();
          if (!result?.cards?.length) {
            event2.finish();
            return;
          }
          const discard = cards2.removeArray(result.cards);
          await player2.loseToDiscardpile(discard);
        }
        if (game.hasPlayer((target) => target.countDiscardableCards(target, "h"))) {
          const result2 = await player2.chooseTarget(`绝途：令一名角色弃置一张手牌`, true, (card, player3, target2) => {
            return target2.countDiscardableCards(target2, "h");
          }).set("ai", (target2) => {
            return get.effect(target2, { name: "guohe_copy", position: "h" }, target2, get.player());
          }).forResult();
          if (!result2?.targets?.length) {
            event2.finish();
            return;
          }
          const target = result2.targets[0];
          player2.line(target);
          const next = game.createEvent("clanjuetu_discard", false);
          next.player = player2;
          next.target = target;
          next.setContent(async (event3, trigger2, player3) => {
            const result = await target.chooseToDiscard("绝途：请弃置一张手牌", true, "h").forResult();
            if (!result?.cards?.length) {
              event3.finish();
              return;
            }
            const suit = get.suit(result.cards[0], target);
            if (!player3.hasCard((cardx) => get.suit(cardx, player3) == suit, "h")) {
              await target.damage();
            }
          });
          await next;
        }
      }
    ]
  },
  clankudu: {
    audio: 2,
    limited: true,
    trigger: { player: "phaseJieshuBegin" },
    filter(event2, player2) {
      return player2.countCards("h", (card) => player2.canRecast(card)) > 1;
    },
    async cost(event2, trigger, player2) {
      event2.result = await player2.chooseCardTarget({
        prompt: get.prompt2(event2.skill),
        filterCard: (card, player3) => player3.canRecast(card),
        selectCard: 2,
        filterTarget: true,
        position: "he",
        ai1(card) {
          return 6 - get.value(card);
        },
        ai2(target) {
          return get.attitude(get.player(), target);
        }
      }).forResult();
    },
    async content(event2, trigger, player2) {
      player2.awakenSkill(event2.name);
      const cards2 = event2.cards, num = Math.min(5, Math.abs(get.number(cards2[0]) - get.number(cards2[1]))), target = event2.targets[0], skill = event2.name + "_effect";
      await player2.recast(cards2);
      if (num > 0) {
        target.addSkill(skill);
        target.addMark(skill, num, false);
      }
    },
    subSkill: {
      effect: {
        intro: {
          content: "<li>下#个回合结束时摸一张牌<br><li>第#个回合后执行一个额外回合"
        },
        onremove: true,
        charlotte: true,
        forced: true,
        popup: false,
        trigger: { global: "phaseEnd" },
        async content(event2, trigger, player2) {
          player2.removeMark(event2.name, 1, false);
          player2.draw();
          if (!player2.hasMark(event2.name)) {
            player2.insertPhase();
            player2.removeSkill(event2.name);
          }
        }
      }
    }
  },
  //族荀爽 —— by 刘巴
  clanyangji: {
    audio: 2,
    trigger: {
      player: "phaseZhunbeiBegin",
      global: "phaseAnyEnd"
    },
    filter(event2, player2, name) {
      if (name !== "phaseZhunbeiBegin" && !game.hasGlobalHistory("changeHp", (evt) => evt.player === player2 && evt.num !== 0 && evt.getParent(event2.name) === event2)) {
        return false;
      }
      return true;
    },
    direct: true,
    clearTime: true,
    async content(event2, trigger, player2) {
      const next = player2.chooseToUse(get.prompt2(event2.name)).set("logSkill", event2.name);
      const result = await next.forResult();
      if (!result?.bool) {
        return;
      }
      const target = _status.currentPhase;
      if (!player2.hasHistory("sourceDamage", (evt) => evt.getParent(next.name) == next) && target?.canAddJudge("lebu")) {
        await player2.chooseToUse().set("openskilldialog", `佯疾：是否将一张黑桃牌当作【乐不思蜀】对${get.translation(target)}使用？`).set("norestore", true).set("_backupevent", `${event2.name}_backup`).set("custom", {
          add: {},
          replace: { window() {
          } }
        }).backup(`${event2.name}_backup`).set("targetRequired", true).set("complexTarget", true).set("complexSelect", true).set("addCount", false).set("targetx", target);
      }
    },
    subSkill: {
      backup: {
        filterCard(card, player2) {
          if (get.itemtype(card) !== "card") {
            return;
          }
          return get.suit(card, player2) == "spade";
        },
        filterTarget(card, player2, target) {
          return lib.filter.judge(card, player2, target) && target === get.event().targetx;
        },
        filterOk() {
          return ui.selected.targets.length === 1;
        },
        selectTarget: -1,
        viewAs: {
          name: "lebu"
        },
        selectCard: 1,
        position: "hes",
        ai1(card) {
          return 7 - get.value(card);
        },
        ai2(target) {
          if (target == get.player() && get.player().hasSkill("clandandao")) {
            return true;
          }
          return get.effect_use.apply(this, arguments);
        },
        log: false
      }
    }
  },
  clandandao: {
    audio: 2,
    trigger: { player: "judgeAfter" },
    forced: true,
    filter(event2, player2) {
      return _status.currentPhase?.isIn() && game.getGlobalHistory("everything", (evt) => evt.name == "judge" && evt.player == player2).indexOf(event2) == 0;
    },
    async content(event2, trigger, player2) {
      const target = _status.currentPhase;
      if (!target?.isIn()) {
        return;
      }
      target.addSkill(event2.name + "_add");
      target.addMark(event2.name + "_add", 1, false);
    },
    subSkill: {
      add: {
        charlotte: true,
        onremove: true,
        mark: true,
        markimage: "image/card/handcard.png",
        intro: {
          content: "手牌上限+#"
        },
        mod: { maxHandcard: (player2, num) => num + player2.countMark("clandandao_add") }
      }
    }
  },
  clanqingli: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    forced: true,
    filter(event2, player2) {
      return player2.countCards("h") < Math.min(5, player2.getHandcardLimit());
    },
    async content(event2, trigger, player2) {
      await player2.drawTo(Math.min(player2.getHandcardLimit(), 5));
    }
  },
  //族杨修 —— by 刘巴
  clanjiewu: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    async cost(event2, trigger, player2) {
      event2.result = await player2.chooseTarget(get.prompt(event2.skill), "令一名角色的手牌在本阶段对你可见").set("ai", (target) => {
        let items = target.getCards("h");
        let count = [...new Set(items.map((item) => get.suit(item, target)))].length;
        const player3 = get.player();
        return get.effect(target, { name: "draw" }, target, player3) * items / (count + 1);
      }).forResult();
    },
    async content(event2, trigger, player2) {
      const target = event2.targets[0];
      player2.markAuto(event2.name + "_effect", target);
      player2.addSkill(event2.name + "_effect");
      target.addSkill(event2.name + "_view");
      const func = (target2) => target2.markSkill("clanjiewu_view", null, null, true);
      event2.isMine() ? func(target) : player2.isOnline2() && player2.send(func, target);
      player2.when({ global: "phaseUseAfter" }).filter((evt) => evt === trigger).step(async () => player2.removeSkill("clanjiewu_effect"));
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove(player2, skill) {
          if (player2.storage[skill]) {
            Array.isArray(player2.storage[skill]) && player2.storage[skill].forEach((i) => i.removeSkill("clanjiewu_view"));
            delete player2.storage[skill];
          }
        },
        audio: "clanjiewu",
        trigger: { player: "useCardToPlayered" },
        filter: (event2, player2) => event2.isFirstTarget && event2.targets.some((target) => target != player2),
        async cost(event2, trigger, player2) {
          event2.result = await player2.chooseTarget(get.prompt(event2.skill), "选择一名「捷悟」角色展示其一张手牌").set("filterTarget", (card, player3, target) => target.hasCard(true, "h") && player3.getStorage("clanjiewu_effect").includes(target)).set("ai", (target) => {
            let items = target.getCards("h");
            let count = [...new Set(items.map((item) => get.suit(item, target)))].length;
            const player3 = get.player();
            return (4 - count) * get.effect(target, { name: "draw" }, target, player3);
          }).forResult();
        },
        async content(event2, trigger, player2) {
          const target = event2.targets[0];
          let cards2;
          if (target === player2) {
            cards2 = (await player2.chooseCard("h", true, `捷悟：展示你的一张手牌`).forResult()).cards;
          } else {
            cards2 = (await player2.choosePlayerCard(target, true, "h", `捷悟：展示${get.translation(target)}的一张手牌`).forResult()).cards;
          }
          if (!cards2?.length) {
            return;
          }
          const card = cards2[0];
          await player2.showCards(card, `${get.translation(player2)}对${get.translation(target)}发动了【捷悟】`).set("clanjiewu", true);
          if (get.suit(trigger.card, player2) === get.suit(card, target)) {
            await player2.draw();
          }
          if (game.getGlobalHistory("everything", (evt) => {
            return evt.name === "showCards" && evt.cards.length && evt.cards.some((c) => c === card) && evt?.clanjiewu;
          }).length > 1) {
            let cardsx;
            if (target.countCards("h") !== player2.countCards("h")) {
              const putee = player2.countCards("h") > target.countCards("h") ? player2 : target;
              if (!putee.countCards("he")) {
                return;
              }
              if (player2 !== putee) {
                cardsx = (await player2.choosePlayerCard(putee, true, "he", "捷悟：将" + get.translation(putee) + "的一张牌置于牌堆顶").forResult()).cards;
              } else {
                cardsx = (await player2.chooseCard("he", true, "捷悟：将你的一张牌置于牌堆顶").forResult()).cards;
              }
              const card2 = cardsx[0];
              putee.$throw(get.position(card2) == "h" ? 1 : card2, 1e3);
              game.log(player2, "将", putee === player2 ? "" : get.translation(putee) + "的", get.position(card2) == "h" ? "一张牌" : card2, "置于牌堆顶");
              await putee.lose(card2, ui.cardPile, "insert");
            }
          }
        },
        ai: {
          viewHandcard: true,
          skillTagFilter(player2, tag, arg) {
            if (!player2.getStorage("clanjiewu_effect").includes(arg)) {
              return false;
            }
          }
        }
      },
      view: {
        charlotte: true,
        intro: {
          markcount: (content, player2) => player2.countCards("h").toString(),
          mark(dialog, content, player2) {
            const hs = player2.getCards("h");
            hs.length > 0 ? dialog.addSmall(hs) : dialog.addText("没有手牌");
          }
        }
      }
    }
  },
  clangaoshi: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    frequent: true,
    filter: (event2, player2) => player2.hasHistory("useSkill", (evt) => ["clanjiewu", "clanjiewu_effect"].includes(evt.skill)),
    prompt(event2, player2) {
      return get.prompt("clangaoshi") + "（可亮出" + get.cnNumber(player2.getHistory("useSkill", (evt) => ["clanjiewu", "clanjiewu_effect"].includes(evt.skill)).length) + "张牌）";
    },
    async content(event2, trigger, player2) {
      const num = player2.getHistory("useSkill", (evt) => {
        return ["clanjiewu", "clanjiewu_effect"].includes(evt.skill);
      }).length;
      const names = player2.getHistory("useCard").map((evt) => evt.card.name), cards2 = [];
      event2.forceDie = true;
      event2.includeOut = true;
      while (cards2.length < num) {
        const judgestr = get.translation(player2) + "展示的第" + get.cnNumber(cards2.length + 1, true) + "张【高视】牌";
        event2.videoId = lib.status.videoId++;
        const card = get.cards()[0];
        cards2.add(card);
        await game.cardsGotoOrdering(card);
        game.addVideo("judge1", player2, [get.cardInfo(card), judgestr, event2.videoId]);
        game.broadcastAll(
          function(player3, card2, str, id, cardid) {
            let event3;
            if (game.online) {
              event3 = {};
            } else {
              event3 = _status.event;
            }
            if (game.chess) {
              event3.node = card2.copy("thrown", "center", ui.arena).addTempClass("start");
            } else {
              event3.node = player3.$throwordered(card2.copy(), true);
            }
            if (lib.cardOL) {
              lib.cardOL[cardid] = event3.node;
            }
            event3.node.cardid = cardid;
            event3.node.classList.add("thrownhighlight");
            ui.arena.classList.add("thrownhighlight");
            event3.dialog = ui.create.dialog(str);
            event3.dialog.classList.add("center");
            event3.dialog.videoId = id;
          },
          player2,
          card,
          judgestr,
          event2.videoId,
          get.id()
        );
        game.log(player2, "展示了牌堆顶的", card);
        await game.delay(2);
        game.broadcastAll(function(id) {
          var dialog = get.idDialog(id);
          if (dialog) {
            dialog.close();
          }
          ui.arena.classList.remove("thrownhighlight");
        }, event2.videoId);
        game.addVideo("judge2", null, event2.videoId);
        if (names.includes(card.name)) {
          break;
        }
      }
      game.broadcastAll(function() {
        ui.clear();
      });
      if (!cards2.length) {
        return;
      }
      while (cards2.some((card) => player2.hasUseTarget(card))) {
        const { links } = await player2.chooseButton([`高视：是否使用其中一张牌？`, cards2]).set("filterButton", (button) => {
          const player3 = get.player(), card = button.link;
          return player3.hasUseTarget(card);
        }).set("ai", (button) => {
          return get.player().getUseValue(button.link);
        }).forResult();
        if (!links?.length) {
          break;
        }
        cards2.remove(links[0]);
        player2.$gain2(links[0], false);
        await player2.chooseUseTarget(links[0], true, false);
      }
      if (!cards2.length) {
        await player2.draw(2);
      }
    },
    ai: {
      combo: "clanjiewu"
    }
  },
  //族杨赐
  clanqieyi: {
    audio: 2,
    trigger: { player: ["phaseUseBegin", "useCardAfter"] },
    filter(event2, player2) {
      if (event2.name == "useCard") {
        if (!player2.hasSkill("clanqieyi_effect") || !lib.suits.includes(get.suit(event2.card))) {
          return false;
        }
        const history = player2.getHistory("useCard", (evt) => get.suit(evt.card) == get.suit(event2.card));
        return history.indexOf(event2) == 0;
      }
      return true;
    },
    async cost(event2, trigger, player2) {
      if (trigger.name == "phaseUse") {
        event2.result = await player2.chooseBool(get.prompt2(event2.skill)).set("ai", () => true).forResult();
      } else {
        event2.result = { bool: true };
      }
    },
    async content(event2, trigger, player2) {
      if (trigger.name == "phaseUse") {
        player2.addTempSkill(event2.name + "_effect");
        const cards2 = get.cards(2, true);
        await player2.viewCards("切议", cards2);
      } else {
        const card = get.cards(1, true)[0];
        await player2.showCards([card]);
        if (get.color(card) == get.color(trigger.card) || get.type2(card) == get.type2(trigger.card)) {
          await player2.gain(card, "gain2");
        } else {
          if (!player2.countCards("he")) {
            return;
          }
          const result = await player2.chooseCard(`切议：将一张牌置于牌堆顶`, "he", true).forResult();
          const card2 = result.cards[0];
          player2.$throw(get.position(card2) == "h" ? 1 : card2, 1e3);
          game.log(player2, "将", get.position(card2) == "h" ? "一张牌" : card2, "置于牌堆顶");
          await player2.lose(card2, ui.cardPile, "insert");
          await game.delayx();
        }
      }
    },
    subSkill: {
      effect: {
        init(player2, skill) {
          const suits = player2.getHistory("useCard", (evt) => lib.suits.includes(get.suit(evt.card))).map((evt) => get.suit(evt.card)).unique().sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
          player2.markAuto(skill, suits);
          if (suits.length) {
            player2.addTip(skill, get.translation(skill) + suits.reduce((str, i) => str + get.translation(i), ""));
          }
        },
        onremove(player2, skill) {
          delete player2.storage[skill];
          player2.removeTip(skill);
        },
        mark: true,
        intro: {
          content: "已使用过的花色：$",
          onunmark(storage, player2) {
            player2.removeTip("clanqieyi_effect");
          }
        },
        silent: true,
        charlotte: true,
        trigger: { player: "useCard" },
        async content(event2, trigger, player2) {
          lib.skill.clanqieyi_effect.init?.(player2, event2.name);
        }
      }
    }
  },
  clanjianzhi: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    filter(event2, player2) {
      const num = player2.getHistory("useSkill", (evt) => evt.skill == "clanqieyi").length;
      return num > 0;
    },
    async content(event2, trigger, player2) {
      const list = Array.from({
        length: player2.getHistory("useSkill", (evt) => evt.skill == "clanqieyi").length
      }).map((_, i) => get.cnNumber(i + 1, true));
      const result = await player2.chooseControl(list).set("prompt", `###谏直###进行至多${get.cnNumber(list.length)}次判定，并执行后续效果`).set("ai", () => get.event().list.length - 1).set("list", list).forResult();
      if (typeof result?.index !== "number") {
        return;
      }
      let num = result.index + 1, judge = [];
      while (num--) {
        const judgeEvent = player2.judge();
        judgeEvent.judge2 = (result3) => result3.bool;
        judgeEvent.set("callback", async (event3) => {
          event3.getParent().orderingCards.remove(event3.card);
        });
        const result2 = await judgeEvent.forResult();
        if (!result2?.card) {
          break;
        } else {
          judge.push(result2.card);
        }
      }
      const suits = player2.getHistory("useCard").map((evt) => get.suit(evt.card)).unique();
      const cards2 = judge.filter((card) => suits.includes(get.suit(card, false)));
      if (cards2.length) {
        if (_status.connectMode) {
          game.broadcastAll(() => {
            _status.noclearcountdown = true;
          });
        }
        const given_map = /* @__PURE__ */ new Map();
        let result2;
        while (cards2.length) {
          if (cards2.length > 1) {
            result2 = await player2.chooseButtonTarget({
              createDialog: ["谏直：请选择要分配的牌", cards2],
              forced: true,
              selectButton: [1, Infinity],
              ai1(button) {
                if (ui.selected.buttons.length) {
                  return 0;
                }
                return get.buttonValue(button);
              },
              ai2(target) {
                const { player: player3, given_map: map } = get.event(), att = get.attitude(player3, target), card = ui.selected.buttons?.[0]?.link;
                if (!card) {
                  return 0;
                }
                if (get.value(card, player3, "raw") < 0) {
                  return Math.max(0.01, 100 - att);
                } else if (att > 0) {
                  const cards3 = map.has(target) ? map.get(target) : [];
                  return Math.max(0.1, att / Math.sqrt(1 + target.countCards("h") + cards3.length));
                } else {
                  return 0;
                }
              },
              given_map
            }).forResult();
          } else if (cards2.length === 1) {
            result2 = await player2.chooseTarget(`选择一名角色获得${get.translation(cards2)}`, true).set("ai", (target) => {
              const { player: player3, given_map: map, toGive: card } = get.event(), att = get.attitude(player3, target);
              if (!card) {
                return 0;
              }
              if (get.value(card, player3, "raw") < 0) {
                return Math.max(0.01, 100 - att);
              } else if (att > 0) {
                const cards3 = map.has(target) ? map.get(target) : [];
                return Math.max(0.1, att / Math.sqrt(1 + target.countCards("h") + cards3.length));
              } else {
                return 0;
              }
            }).set("given_map", given_map).set("toGive", cards2[0]).forResult();
            result2.links = cards2.slice(0);
          } else {
            break;
          }
          if (result2.bool) {
            const {
              links: toGive,
              targets: [target]
            } = result2;
            cards2.removeArray(toGive);
            const given = (given_map.get(target) ?? []).concat(toGive);
            given_map.set(target, given);
            if (!cards2.length) {
              break;
            }
          }
        }
        if (_status.connectMode) {
          game.broadcastAll(() => {
            delete _status.noclearcountdown;
            game.stopCountChoose();
          });
        }
        const gain_list = Array.from(given_map.entries());
        for (const info of gain_list) {
          player2.line(info[0], "green");
          game.log(info[0], "获得了", info[1]);
        }
        await game.loseAsync({
          gain_list,
          giver: player2,
          animate: "gain2"
        }).setContent("gaincardMultiple");
      }
      if (judge.some((card) => !suits.includes(get.suit(card, false)))) {
        await player2.damage("nosource", "thunder");
      }
    },
    ai: { combo: "clanqieyi" }
  },
  clanquhuo: {
    audio: 2,
    clanSkill: true,
    audioname: ["clan_yangci", "clan_yangxiu", "clan_yangbiao", "clan_yangzhong"],
    trigger: {
      player: "loseAfter",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    filter(event2, player2) {
      const evt = event2.getl(player2);
      if (!evt?.hs?.length) {
        return false;
      }
      const hs = evt.hs;
      if (!hs.some((card) => get.type(card) == "equip" || get.name(card) == "jiu")) {
        return false;
      }
      if (event2.name.indexOf("lose") == 0) {
        if (event2.type === "discard") {
          return false;
        }
        if (["useCard", "respond"].includes(event2.getParent()?.name)) {
          return false;
        }
      }
      const history = player2.getHistory("lose", (evtx) => {
        if (evtx.type == "discard") {
          return false;
        }
        const evt2 = evtx.relatedEvent || evtx.getParent();
        if (["useCard", "respond"].includes(evt2?.name)) {
          return false;
        }
        return evtx?.hs.some((card) => get.type(card) == "equip" || get.name(card) == "jiu");
      }).map((evtx) => event2.name == "lose" ? evtx : evtx.getParent());
      return history.indexOf(event2) == 0 && game.hasPlayer((target) => {
        return target.isDamaged() && (target.hasClan("弘农杨氏") || target == player2);
      });
    },
    async cost(event2, trigger, player2) {
      const targets = game.filterPlayer((target) => {
        return target.isDamaged() && (target.hasClan("弘农杨氏") || target == player2);
      });
      if (!targets.length) {
        return;
      }
      if (targets.length == 1) {
        const result = await player2.chooseBool(get.prompt2(event2.skill, targets)).set("ai", () => {
          return get.attitude(get.player(), get.event().target) > 0;
        }).set("target", targets[0]).forResult();
        if (result.bool) {
          event2.result = {
            bool: true,
            targets
          };
        }
      } else {
        event2.result = await player2.chooseTarget(get.prompt2(event2.skill), (card, player3, target) => {
          return target.isDamaged() && (target.hasClan("弘农杨氏") || target == player3);
        }).set("ai", (target) => {
          return get.recoverEffect(target, get.player());
        }).forResult();
      }
    },
    async content(event2, trigger, player2) {
      const target = event2.targets[0];
      await target.recover();
    }
  },
  //族吴懿
  clangaojin: {
    audio: 2,
    trigger: { player: "useCard" },
    filter(event2, player2) {
      return player2.getHistory("useCard", (evt) => evt.card).indexOf(event2) == player2.getHandcardLimit() - 1;
    },
    async content(event2, trigger, player2) {
      player2.addTempSkill(event2.name + "_effect");
      const result = await player2.chooseButton([
        `高劲：你可以选择至多两项`,
        [
          [
            [0, "手牌上限-1"],
            [1, `摸${player2.getHp()}张牌`],
            [2, `手牌上限+1`]
          ],
          "tdnodes"
        ]
      ]).set("selectButton", [1, 2]).set("ai", (button) => {
        if (button.link == 1) {
          return get.player().getHp();
        }
        return 0;
      }).forResult();
      if (result?.links?.length) {
        const links = result.links;
        if (links.includes(0)) {
          lib.skill.chenliuwushi.change(player2, -1);
        }
        if (links.includes(1)) {
          await player2.draw(player2.getHp());
        }
        if (links.includes(2)) {
          lib.skill.chenliuwushi.change(player2, 1);
        }
        if (links.length > 1 && Math.abs(links[0] - links[1]) == 1) {
          await player2.chooseToDiscard("he", player2.getHandcardLimit(), true);
        }
      }
    },
    subSkill: {
      effect: {
        mod: {
          cardUsable: () => Infinity,
          targetInRange: () => true
        },
        trigger: {
          player: "useCard1"
        },
        forced: true,
        charlotte: true,
        popup: false,
        firstDo: true,
        async content(event2, trigger, player2) {
          const { name: skillName } = event2;
          player2.removeSkill(skillName);
          if (trigger.addCount !== false) {
            trigger.addCount = false;
            const stat = player2.getStat().card;
            const name = trigger.card.name;
            if (typeof stat[name] === "number") {
              stat[name]--;
            }
          }
        },
        mark: true,
        intro: {
          content: "使用下一张牌无距离和次数限制"
        }
      }
    }
  },
  //距离变化后神将
  old_clangaojin: {
    audio: 2,
    updateDistanceMap() {
      const obj = {};
      for (const i of game.players) {
        if (!obj[i.playerid]) {
          obj[i.playerid] = {};
        }
        for (const j of game.players) {
          obj[i.playerid][j.playerid] = get.distance(i, j);
        }
      }
      _status.playerDistanceMap = obj;
    },
    hasDistanceChanged(player2) {
      const map = _status.playerDistanceMap;
      if (!map) {
        lib.skill.old_clangaojin.updateDistanceMap();
      }
      let bool = false;
      for (const i of game.players) {
        if (map[player2.playerid][i.playerid] != get.distance(player2, i)) {
          bool = true;
        }
      }
      lib.skill.old_clangaojin.updateDistanceMap();
      return bool;
    },
    init: () => lib.skill.old_clangaojin.updateDistanceMap(),
    trigger: {
      global: ["logSkill", "useSkillAfter", "dieAfter", "changeHp", "equipAfter", "changeSkillsAfter"]
    },
    forced: true,
    filter(event2, player2) {
      return lib.skill.old_clangaojin.hasDistanceChanged(player2);
    },
    async content(event2, trigger, player2) {
      await player2.draw();
    },
    group: "old_clangaojin_buff",
    subSkill: {
      buff: {
        audio: "old_clangaojin",
        trigger: {
          global: ["phaseBefore", "roundStart"],
          player: ["enterGame"]
        },
        filter(event2, player2, name) {
          return event2.name != "phase" || game.phaseNumber == 0;
        },
        forced: true,
        async content(event2, trigger, player2) {
          player2.addMark(event2.name, player2.getHandcardLimit(), false);
        },
        mod: {
          globalFrom(from, to, current) {
            return current - from.countMark("old_clangaojin_buff");
          }
        },
        intro: {
          content: "计算与其他角色的距离-#"
        }
      }
    }
  },
  clanpoxi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(_, player2, target) {
      if (target.countDiscardableCards("he") <= 0) {
        return false;
      }
      return get.distance(player2, target) <= 1;
    },
    mod: {
      globalFrom(from, to, current) {
        return current + from.countMark("clanpoxi");
      }
    },
    intro: {
      content: "计算与其他角色的距离+#"
    },
    async content(event2, trigger, player2) {
      const { target } = event2;
      const { cards: cards2 } = await player2.discardPlayerCard(target, true).set("ai", function(button) {
        if (!["basic", "equip"].includes(get.type(button.link))) {
          return 0;
        }
        return Math.random();
      }).forResult();
      if (["basic", "equip"].includes(get.type(cards2[0]))) {
        await player2.chooseUseTarget({ name: "sha", isCard: true }, cards2);
      }
    },
    group: ["clanpoxi_directHit", "clanpoxi_check"],
    subSkill: {
      directHit: {
        direct: true,
        trigger: {
          player: "useCard"
        },
        filter(event2, player2) {
          return event2.getParent(2).name == "clanpoxi";
        },
        async content(event2, trigger, player2) {
          const { bool } = await player2.chooseBool("破袭：是否令此牌不可被响应？").forResult();
          if (bool) {
            trigger.directHit.addArray(trigger.targets);
          }
        }
      },
      check: {
        silent: true,
        trigger: {
          source: "damageSource"
        },
        filter(event2, player2) {
          return event2.getParent(4).name == "clanpoxi";
        },
        async content(event2, trigger, player2) {
          player2.addMark("clanpoxi", 1, false);
        }
      }
    },
    ai: {
      order: 7,
      result: {
        player: 2,
        target: -1
      }
    }
  },
  //族王沈
  clananran: {
    audio: 2,
    trigger: { player: ["phaseUseBegin", "damageEnd"] },
    async cost(event2, trigger, player2) {
      const count = Math.min(4, player2.countMark("clananran_used") + 1);
      const result = await player2.chooseButton([
        get.prompt2(event2.skill),
        [
          [
            ["draw", `摸${get.cnNumber(count)}张牌`],
            ["asyncDraw", `令至多${get.cnNumber(count)}名角色摸一张牌`]
          ],
          "textbutton"
        ]
      ]).set("ai", (button) => {
        const player3 = get.player(), count2 = Math.min(4, player3.countMark("clananran_used") + 1);
        if (button.link === "draw") {
          return get.effect(player3, { name: "draw" }, player3, player3) * count2;
        }
        return game.filterPlayer((target) => get.effect(target, { name: "draw" }, player3, player3) > 0).sort((a, b) => {
          return get.effect(b, { name: "draw" }, player3, player3) - get.effect(a, { name: "draw" }, player3, player3);
        }).slice(0, count2).reduce((sum, target) => sum + get.effect(target, { name: "draw" }, player3, player3), 0);
      }).forResult();
      event2.result = {
        bool: result.bool,
        cost_data: result.links?.[0]
      };
    },
    async content(event2, trigger, player2) {
      const tag = "clananran_tag", mark = "clananran_used";
      player2.addSkill(mark);
      if (player2.countMark(mark) < 4) {
        player2.addMark(mark, 1, false);
      }
      const count = player2.countMark(mark);
      const { cost_data } = event2, map = { player: "useCard1", global: "phaseAfter" };
      if (cost_data == "draw") {
        player2.addTempSkill(tag, map);
        await player2.draw(count).set("gaintag", [tag]);
      } else {
        const result = await player2.chooseTarget(`岸然：令至多${get.cnNumber(count)}名角色各摸一张牌`, [1, count], true).forResult();
        if (result.targets?.length) {
          for (const i of result.targets.sortBySeat()) {
            i.addTempSkill(tag, map);
            await i.draw("nodelay").set("gaintag", [tag]);
          }
          await game.delayx();
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true,
        intro: { content: "当前【岸然】X为#" }
      },
      tag: {
        charlotte: true,
        onremove(player2, skill) {
          player2.removeGaintag(skill);
        },
        mod: {
          cardEnabled(card) {
            if ([card].concat(card.cards || []).some((c) => get.itemtype(c) === "card" && c.hasGaintag("clananran_tag"))) {
              return false;
            }
          },
          cardSavable(card) {
            if ([card].concat(card.cards || []).some((c) => get.itemtype(c) === "card" && c.hasGaintag("clananran_tag"))) {
              return false;
            }
          }
        }
      }
    }
  },
  clangaobian: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    filter(event2, player2) {
      if (event2.player == player2) {
        return false;
      }
      const targets = game.filterPlayer2((target) => target.hasHistory("damage"));
      return targets.length == 1 && targets[0]?.isIn();
    },
    forced: true,
    logTarget(event2, player2) {
      return game.findPlayer2((target) => target.hasHistory("damage"));
    },
    async content(event2, trigger, player2) {
      const target = game.findPlayer2((target2) => target2.hasHistory("damage"));
      const discarded = _status.discarded.filter((c) => c.name == "sha");
      const bool = discarded.some((c) => target.hasUseTarget(c));
      const result = bool ? await target.chooseButton(
        [
          "告变：请选择一项",
          [
            [
              ["sha", "使用本回合进入弃牌堆的一张【杀】"],
              ["loseHp", "失去1点体力"]
            ],
            "textbutton"
          ]
        ],
        true
      ).set(
        "discarded",
        discarded.filter((c) => target.hasUseTarget(c))
      ).set("ai", (button) => {
        const { player: player3, discarded: cards2 } = get.event();
        return {
          sha: Math.max(...cards2.map((card) => player3.getUseValue(card))),
          loseHp: get.effect(player3, { name: "losehp" }, player3, player3)
        }[button.link];
      }).forResult() : { links: ["loseHp"] };
      if (result.links[0] == "sha") {
        const result2 = await target.chooseCardButton("告变：请选择其中一张【杀】使用", discarded, true).set("filterButton", (button) => {
          return get.player().hasUseTarget(button.link);
        }).forResult();
        if (result2?.bool && result2.links?.length) {
          await target.chooseUseTarget(result2.links[0], true, false);
        }
      } else {
        await target.loseHp();
      }
    }
  },
  // 族王昶
  clankaiji: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event2, player2) {
      if (!event2.clankaiji_enabledTargets) {
        return false;
      }
      return game.hasPlayer((current) => get.info("clankaiji").filterTarget(null, player2, current));
    },
    onChooseToUse(event2) {
      if (game.online || event2.type !== "phase") {
        return;
      }
      const player2 = event2.player;
      const chosen = player2.getRoundHistory("useSkill", (evt) => evt.skill === "clankaiji").reduce((list, evt) => list.add(evt.targets[0]), []);
      event2.set("clankaiji_enabledTargets", chosen);
    },
    filterTarget(card, player2, target) {
      return !get.event().clankaiji_enabledTargets.includes(target) && player2.countDiscardableCards(target, "h");
    },
    async content(event2, trigger, player2) {
      const { target } = event2;
      const { links: cards2 } = await target.discardPlayerCard(player2, "h", true).set("ai", (button) => {
        const { player: player3, target: target2 } = get.event(), { link } = button;
        if (get.attitude(player3, target2) > 0) {
          if (target2.hasUseTarget(link)) {
            return 10;
          }
          return 6 - get.value(link);
        }
        if (player3.hasSkillTag("viewHandcard", null, target2, true)) {
          if (!target2.hasUseTarget(link)) {
            return 10;
          }
          return get.value(link);
        }
        if (get.is.shownCard(link) && !target2.hasUseTarget(link)) {
          return 10;
        }
        return 1;
      }).forResult();
      if (!cards2 || !cards2.someInD("d")) {
        return;
      }
      const card = cards2.filterInD("d");
      await game.delayx();
      const { bool } = await player2.chooseUseTarget(`你可以使用${get.translation(card)}然后摸一张牌`, card, false).forResult();
      if (bool) {
        await player2.draw();
      }
    },
    ai: {
      order: 3,
      result: {
        player(player2, target) {
          if (!player2.hasCard((card) => player2.hasUseTarget(card, void 0, true), "h")) {
            return -1;
          }
          if (player2 == target || get.attitude(player2, target) > 0) {
            return 1;
          }
          if (player2.countCards("h", (card) => player2.hasUseTarget(card, void 0, true)) >= player2.countCards("h", (card) => !player2.hasUseTarget(card, void 0, true))) {
            return -0.5 + Math.random();
          }
          return -1;
        }
      }
    }
  },
  //族钟繇
  clanchengqi: {
    getUsed: (player2) => player2.getHistory("useCard", (evt) => ["basic", "trick"].includes(get.type(evt.card, null, false))).map((evt) => get.name(evt.card)).toUniqued(),
    hiddenCard(player2, name) {
      if (get.type(name) != "basic" && get.type(name) != "trick") {
        return false;
      }
      if (get.info("clanchengqi").getUsed(player2).includes(name)) {
        return false;
      }
      return player2.countCards("hs") > 1 && lib.inpile.includes(name);
    },
    audio: 2,
    enable: "chooseToUse",
    filter(event2, player2) {
      if (player2.countCards("hs") < 2) {
        return false;
      }
      return get.inpileVCardList((info) => {
        const name = info[2];
        if (get.type(name) != "basic" && get.type(name) != "trick") {
          return false;
        }
        return !(event2.clanchengqi || []).includes(name);
      }).some((card) => event2.filterCard(get.autoViewAs({ name: card[2], nature: card[3] }, "unsure"), player2, event2));
    },
    onChooseToUse(event2) {
      if (!game.online && !event2.clanchengqi) {
        const player2 = event2.player;
        event2.set("clanchengqi", get.info("clanchengqi").getUsed(player2));
      }
    },
    chooseButton: {
      dialog(event2, player2) {
        const list = get.inpileVCardList((info) => {
          const name = info[2];
          if (get.type(name) != "basic" && get.type(name) != "trick") {
            return false;
          }
          return !(event2.clanchengqi || []).includes(name);
        }).filter((card) => event2.filterCard(get.autoViewAs({ name: card[2], nature: card[3] }, "unsure"), player2, event2));
        return ui.create.dialog("承启", [list, "vcard"]);
      },
      check(button) {
        if (get.event().getParent().type != "phase") {
          return 1;
        }
        return get.event().player.getUseValue({
          name: button.link[2],
          nature: button.link[3]
        });
      },
      backup(links, player2) {
        return {
          audio: "clanchengqi",
          filterCard: true,
          complexCard: true,
          selectCard: [2, Infinity],
          popname: true,
          viewAs: {
            name: links[0][2],
            nature: links[0][3]
          },
          filterOk() {
            return (ui.selected.cards || []).reduce((sum, card) => {
              return sum + get.cardNameLength(card);
            }, 0) >= get.cardNameLength(lib.skill.clanchengqi_backup.viewAs.name);
          },
          ai1(card) {
            const player3 = get.event().player;
            const name = lib.skill.clanchengqi_backup.viewAs.name;
            if (ui.selected.cards.length > 1 || card.name == name) {
              return 0;
            }
            if (ui.selected.cards.length && game.hasPlayer((target) => {
              return get.effect(target, { name: "draw" }, player3, player3) > 0;
            })) {
              if (get.cardNameLength(name) <= get.cardNameLength(card) + get.cardNameLength(ui.selected.cards[0])) {
                return 10 / (get.value(card) || 0.5);
              }
            }
            return 1 / (get.value(card) || 0.5);
          },
          position: "hs",
          async precontent(event2, trigger, player3) {
            player3.addTempSkill("clanchengqi_effect");
          }
        };
      },
      prompt(links, player2) {
        return "将至少两张手牌当作" + get.translation(links[0][3] || "") + "【" + get.translation(links[0][2]) + "】使用";
      }
    },
    ai: {
      order(item, player2) {
        if (player2 && get.event().type == "phase") {
          let list = get.inpileVCardList((info) => {
            const name = info[2];
            if (get.type(name) != "basic" && get.type(name) != "trick") {
              return false;
            }
            return !get.info("clanchengqi").getUsed(player2).includes(name);
          }).map((card) => {
            return { name: card[2], nature: card[3] };
          }).filter((card) => player2.getUseValue(card, true, true) > 0);
          if (!list.length) {
            return 0;
          }
          list.sort((a, b) => (player2.getUseValue(b, true, true) || 0) - (player2.getUseValue(a, true, true) || 0));
          return get.order(list[0], player2) * 0.99;
        }
        return 1e-3;
      },
      respondSha: true,
      respondShan: true,
      skillTagFilter(player2, tag, arg) {
        if (arg == "respond") {
          return false;
        }
        const name = tag == "respondSha" ? "sha" : "shan";
        return get.info("clanchengqi").hiddenCard(player2, name);
      },
      result: {
        player(player2) {
          if (_status.event?.dying) {
            return get.attitude(player2, _status.event.dying);
          }
          return 1;
        }
      }
    },
    subSkill: {
      backup: { audio: "clanchengqi" },
      effect: {
        charlotte: true,
        trigger: { player: "useCard" },
        filter(event2, player2) {
          return event2.skill == "clanchengqi_backup" && get.cardNameLength(event2.card) == (event2.cards || []).reduce((sum, card) => {
            return sum + get.cardNameLength(card);
          }, 0);
        },
        async cost(event2, trigger, player2) {
          event2.result = await player2.chooseTarget("承启：是否令一名角色摸一张牌？").set("ai", (target) => {
            const player3 = get.event().player;
            return get.effect(target, { name: "draw" }, player3, player3);
          }).forResult();
        },
        popup: false,
        async content(event2, trigger, player2) {
          player2.line(event2.targets);
          event2.targets[0].draw();
        }
      }
    }
  },
  clanjieli: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event2, player2) {
      return game.hasPlayer((target) => {
        return target.countCards("h");
      });
    },
    async cost(event2, trigger, player2) {
      const num = player2.getHistory("useCard").length > 0 ? Math.max(...player2.getHistory("useCard").map((history) => get.cardNameLength(history.card))) : 0;
      const str = num > 0 ? "并观看牌堆顶" + get.cnNumber(num) + "张牌，然后你可以交换其中任意张牌" : "";
      event2.result = await player2.chooseTarget(get.prompt(event2.skill), "观看一名角色的牌名字数最多的手牌" + str, (card, player3, target) => {
        return target.countCards("h");
      }).set("ai", (target) => {
        const player3 = get.event().player;
        const num2 = Math.max(...target.getCards("h").map((card) => get.cardNameLength(card)));
        return num2 + 1e-4 * get.attitude(player3, target);
      }).forResult();
    },
    async content(event2, trigger, player2) {
      const target = event2.targets[0];
      const num = player2.getHistory("useCard").length > 0 ? Math.max(...player2.getHistory("useCard").map((history) => get.cardNameLength(history.card))) : 0;
      const limit = Math.max(...target.getCards("h").map((card) => get.cardNameLength(card)));
      const cards2 = target.getCards("h", (card) => get.cardNameLength(card) == limit);
      if (num > 0) {
        const topCards = get.cards(num);
        await game.cardsGotoOrdering(topCards);
        const result = await player2.chooseToMove("诫厉：交换其中任意张牌").set("list", [
          [get.translation(target) + "牌名字数最多的手牌", cards2, "dcsushou_tag"],
          ["牌堆顶", topCards]
        ]).set("filterMove", (from, to) => {
          return typeof to != "number";
        }).set("filterOk", (moved) => {
          return moved[1].some((card) => get.owner(card));
        }).set("processAI", (list) => {
          const num2 = Math.min(list[0][1].length, list[1][1].length);
          const player3 = get.event().player, target2 = get.event().getParent().targets[0];
          const sgn = get.sgn(get.sgn(get.attitude(player3, target2)) - 0.5);
          const cards1 = list[0][1].slice().sort((a, b) => get.value(a, "raw") * sgn - get.value(b, "raw") * sgn);
          const cards22 = list[1][1].slice().sort((a, b) => get.value(b, "raw") * sgn - get.value(a, "raw") * sgn);
          return [cards1.slice().addArray(cards22.slice(0, num2)), cards22.slice().addArray(cards1.slice(0, num2))];
        }).forResult();
        if (result.bool) {
          const lose = result.moved[1].slice();
          const gain = result.moved[0].slice().filter((i) => !get.owner(i));
          if (lose.some((i) => get.owner(i))) {
            await game.cardsGotoOrdering(lose.filter((i) => get.owner(i)));
          }
          await game.cardsGotoPile(lose.reverse(), "insert");
          game.updateRoundNumber();
          if (gain.length) {
            await target.gain(gain, "draw");
          }
        } else {
          await game.cardsGotoPile(topCards.slice().reverse(), "insert");
          game.updateRoundNumber();
        }
      } else {
        const content = ['###诫厉###<div class="text center">' + get.translation(target) + "牌名字数最多的手牌</div>", cards2];
        await player2.chooseControl("ok").set("dialog", content);
      }
    }
  },
  //族王明山
  clantanque: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    usable: 1,
    filter(event2, player2) {
      const evt = lib.skill.dcjianying.getLastUsed(player2, event2);
      if (!evt || !evt.card) {
        return false;
      }
      const curCard = event2.card, prevCard = evt.card;
      const curNum = get.number(curCard), prevNum = get.number(prevCard);
      if (typeof curNum != "number" || typeof prevNum != "number") {
        return false;
      }
      const delNum = Math.abs(curNum - prevNum);
      if (delNum === 0) {
        return false;
      }
      return game.hasPlayer((current) => {
        return current.getHp() === delNum || current.countCards("h") == delNum;
      });
    },
    locked: false,
    async cost(event2, trigger, player2) {
      const evt = lib.skill.dcjianying.getLastUsed(player2, trigger);
      const curCard = trigger.card, prevCard = evt.card;
      const curNum = get.number(curCard), prevNum = get.number(prevCard);
      const delNum = Math.abs(curNum - prevNum);
      event2.result = await player2.chooseTarget(get.prompt(event2.skill), `对一名体力值或手牌数为${delNum}的角色造成1点伤害`, (card, player3, target) => {
        return target.getHp() === get.event().delNum || target.countCards("h") == get.event().delNum;
      }).set("delNum", delNum).set("ai", (target) => {
        return get.damageEffect(target, get.player(), get.player());
      }).forResult();
    },
    async content(event2, trigger, player2) {
      const target = event2.targets[0];
      await target.damage();
      await game.delayx();
    },
    mod: {
      aiOrder(player2, card, num) {
        if (typeof card != "object") {
          return;
        }
        const evt = lib.skill.dcjianying.getLastUsed(player2);
        if (!evt || !evt.card) {
          return;
        }
        const curNum = get.number(card), prevNum = get.number(evt.card);
        if (typeof curNum != "number" || typeof prevNum != "number") {
          return;
        }
        const pairs = game.filterPlayer().map((current) => {
          return [current.getHp(), get.damageEffect(current, player2, player2)];
        }).filter((pair) => pair[1] > 0);
        if (!pairs.length) {
          return;
        }
        const delNum = Math.abs(curNum - prevNum);
        for (const [hp, eff] of pairs) {
          if (hp != delNum) {
            continue;
          }
          return num + 10 + pairs.filter((pair) => pair[0] === hp).sort((a, b) => b[1] - a[1])[0][1] / 20;
        }
      }
    },
    group: "clantanque_mark",
    init(player2) {
      var history = player2.getAllHistory("useCard");
      if (history.length) {
        var trigger = history[history.length - 1];
        if (typeof get.number(trigger.card, player2) != "number") {
          return;
        }
        player2.storage.clantanque_mark = trigger.card;
        player2.markSkill("clantanque_mark");
      }
    },
    onremove(player2) {
      player2.unmarkSkill("clantanque_mark");
      delete player2.storage.clantanque_mark;
    },
    subSkill: {
      mark: {
        charlotte: true,
        trigger: { player: "useCard1" },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event2, trigger, player2) {
          if (typeof get.number(trigger.card, player2) != "number") {
            player2.unmarkSkill("clantanque_mark");
          } else {
            player2.storage.clantanque_mark = trigger.card;
            player2.markSkill("clantanque_mark");
          }
        },
        intro: {
          markcount(card, player2) {
            return get.strNumber(get.number(card, player2));
          },
          content(card, player2) {
            return "上一张牌的点数：" + get.strNumber(get.number(card, player2));
          }
        }
      }
    }
  },
  clanshengmo: {
    audio: 2,
    enable: "chooseToUse",
    round: 1,
    hiddenCard(player2, name) {
      if (get.type(name) != "basic") {
        return false;
      }
      if (!player2.getStorage("clanshengmo").includes(name) && (get.event().clanshengmo_cards || []).length > 0) {
        return true;
      }
    },
    filter(event2, player2) {
      if (event2.responded) {
        return false;
      }
      const names = lib.inpile.filter((name) => get.type(name) == "basic"), cards2 = get.event().clanshengmo_cards || [];
      return cards2.length > 0 && cards2.some((card) => !player2.getStorage("clanshengmo_num").includes(get.number(card, false))) && names.some((name) => {
        return event2.filterCard({ name, isCard: true }, player2, event2);
      });
    },
    onChooseToUse(event2) {
      if (game.online) {
        return;
      }
      if (!event2.clanshengmo_cards) {
        let cards2 = [];
        game.checkGlobalHistory("cardMove", (evt) => {
          if (evt.name != "cardsDiscard" && (evt.name != "lose" || evt.position != ui.discardPile)) {
            return;
          }
          cards2.addArray(evt.cards.filter((card) => get.position(card, true) == "d"));
        });
        event2.set("clanshengmo_cards", cards2);
      }
    },
    async content(event2, trigger, player2) {
      const evt = event2.getParent(2);
      const names = lib.inpile.filter((name) => get.type(name) == "basic" && !player2.getStorage("clanshengmo").includes(name)), cards2 = evt.clanshengmo_cards.sort((a, b) => get.number(a, false) - get.number(b, false)), canChoose = cards2.filter((card) => !player2.getStorage("clanshengmo_num").includes(get.number(card, false)));
      const { links } = await player2.chooseButton(["剩墨：获得其中一张牌", cards2], true).set("filterButton", (button) => {
        return get.event().canChoose.includes(button.link);
      }).set("canChoose", canChoose).set("ai", (button) => {
        return get.value(button.link);
      }).forResult();
      if (links?.length) {
        await player2.gain(links, "gain2");
        player2.markAuto("clanshengmo_num", links.map((card) => get.number(card, false)).toUniqued());
        const numbers = cards2.map((card) => get.number(card, false)).unique();
        const [min, max] = [Math.min(...numbers), Math.max(...numbers)], num = get.number(links[0], false);
        if (num > min && num < max) {
          const list = [];
          for (const name of names) {
            const card = { name, isCard: true };
            if (evt.filterCard(card, player2, evt)) {
              list.push(["基本", "", name]);
            }
            if (name == "sha") {
              for (const nature of lib.inpile_nature) {
                card.nature = nature;
                if (evt.filterCard(card, player2, evt)) {
                  list.push(["基本", "", name, nature]);
                }
              }
            }
          }
          if (list.length) {
            const { links: links2 } = await player2.chooseButton(["视为使用一张未以此法使用过的基本牌", [list, "vcard"]], true).set("ai", (button) => {
              return get.player().getUseValue(button.link) + 1;
            }).forResult();
            const name = links2[0][2], nature = links2[0][3];
            game.broadcastAll(
              (name2, nature2) => {
                lib.skill.clanshengmo_backup.viewAs = {
                  name: name2,
                  nature: nature2,
                  isCard: true
                };
                lib.skill.clanshengmo_backup.prompt = `选择${get.translation(nature2)}【${get.translation(name2)}】的目标`;
              },
              name,
              nature
            );
            evt.set("_backupevent", "clanshengmo_backup");
            evt.backup("clanshengmo_backup");
            evt.set("openskilldialog", `选择${get.translation(nature)}【${get.translation(name)}】的目标`);
            evt.set("norestore", true);
            evt.set("custom", {
              add: {},
              replace: { window() {
              } }
            });
          }
        }
      }
      evt.goto(0);
    },
    marktext: "墨",
    intro: {
      content: "已以此法使用过$"
    },
    subSkill: {
      backup: {
        async precontent(event2, trigger, player2) {
          event2.result.card.storage.clanshengmo = true;
          player2.markAuto("clanshengmo", event2.result.card.name);
        },
        filterCard: () => false,
        selectCard: -1,
        log: false
      }
    },
    ai: {
      order: 3,
      result: {
        player(player2) {
          if (get.event().dying) {
            return get.attitude(player2, get.event().dying);
          }
          if (get.event().type != "phase") {
            return 1;
          }
          const names = lib.inpile.filter((name) => get.type(name) == "basic" && !player2.getStorage("clanshengmo").includes(name));
          if (Array.isArray(names)) {
            return names.some((name) => {
              return player2.getUseValue({ name }) > 0;
            });
          }
          return 0;
        }
      },
      tag: {
        recover: 1,
        save: 1
      }
    }
  },
  //族贝斯塔[doge]
  clanlilun: {
    audio: 2,
    enable: "phaseUse",
    filter(event2, player2) {
      return player2.hasCard((card) => get.info("clanlilun").filterCard(card, player2), "he");
    },
    filterCard(card, player2) {
      if (player2.getStorage("clanlilun").includes(card.name)) {
        return false;
      }
      if (ui.selected.cards.length && ui.selected.cards[0].name != card.name) {
        return false;
      }
      const cards2 = player2.getCards("he", (cardx) => player2.canRecast(cardx));
      return cards2.includes(card) && cards2.filter((i) => i.name == card.name).length > 1;
    },
    selectCard: 2,
    position: "he",
    check(card) {
      const player2 = get.event().player;
      const value = function(card2, player3) {
        const num = player3.getUseValue(card2);
        return num > 0 ? num + 1 / (get.value(card2) || 0.5) + 7 : 7 - get.value(card2);
      };
      if (ui.selected.cards.length && value(card, player2) < value(ui.selected.cards[0], player2)) {
        return 20 - get.value(card);
      }
      return value(card, player2);
    },
    complexCard: true,
    discard: false,
    lose: false,
    delay: 0,
    usable: 1,
    async content(event2, trigger, player2) {
      await player2.recast(event2.cards);
      if (!player2.storage.clanlilun) {
        player2.when({ global: "phaseAfter" }).step(async () => {
          player2.unmarkSkill("clanlilun");
          delete player2.storage.clanlilun;
        });
      }
      player2.markAuto(
        "clanlilun",
        event2.cards.slice().map((card) => card.name)
      );
      const cards2 = event2.cards.filterInD("d");
      if (cards2.some((card) => player2.hasUseTarget(card))) {
        const { bool, links } = await player2.chooseButton(["离论：是否使用其中的一张牌？", cards2]).set("filterButton", (button) => {
          return get.event().player.hasUseTarget(button.link);
        }).set("ai", (button) => {
          return get.event().player.getUseValue(button.link);
        }).forResult();
        if (bool) {
          const card = links[0];
          player2.$gain2(card, false);
          await game.delayx();
          await player2.chooseUseTarget(true, card, false);
        }
      }
    },
    onremove: true,
    intro: { content: "本回合已重铸过$" },
    ai: {
      order(item, player2) {
        let cards2 = player2.getCards("h", (card) => get.info("clanlilun").filterCard(card, player2) && player2.getUseValue(card) > 0);
        cards2 = cards2.filter((card) => cards2.filter((i) => i.name == card.name).length > 1);
        if (!cards2.length) {
          return 1;
        }
        cards2.sort((a, b) => get.order(b) - get.order(a));
        return get.order(cards2[0]) - 1e-3;
      },
      result: { player: 1 }
    }
  },
  clanjianji: {
    getBool(event2, player2) {
      const card = new lib.element.VCard({ name: "sha", isCard: true });
      const targets = game.filterPlayer((target) => {
        return event2.player.getPrevious() == target || event2.player.getNext() == target;
      });
      const bool = !targets.some((target) => {
        return target.getHistory("useCard").length;
      });
      const goon = player2.hasUseTarget(card) && !game.getGlobalHistory("useCard", (evt) => {
        return evt.targets?.some((target) => targets.includes(target));
      }).length;
      return [bool, goon];
    },
    limited: true,
    audio: 2,
    trigger: { global: "phaseJieshuBegin" },
    filter(event2, player2) {
      if (!event2.player.isIn()) {
        return false;
      }
      const targets = game.filterPlayer((target) => {
        return event2.player.getPrevious() == target || event2.player.getNext() == target;
      });
      if (!targets.length) {
        return false;
      }
      const [bool, goon] = get.info("clanjianji").getBool(event2, player2);
      return bool || goon;
    },
    skillAnimation: true,
    animationColor: "watar",
    prompt2(event2, player2) {
      let str = "";
      const [bool, goon] = get.info("clanjianji").getBool(event2, player2);
      if (bool) {
        if (goon) {
          str += "你可以";
        }
        str += "与" + get.translation(get.translation(event2.player)) + "各摸一张牌";
      }
      if (goon) {
        if (bool) {
          str += "，然后你可以";
        }
        str += "视为使用一张【杀】";
      }
      return str;
    },
    check(event2, player2) {
      const card = new lib.element.VCard({ name: "sha", isCard: true });
      const [bool, goon] = get.info("clanjianji").getBool(event2, player2);
      if (player2.hasSkill("clanzhongliu")) {
        return goon && player2.hasValueTarget(card);
      }
      return bool && (get.attitude(player2, event2.player) > 0 || event2.player.countCards("h") > player2.countCards("h")) || goon && player2.hasValueTarget(card);
    },
    logTarget: "player",
    async content(event2, trigger, player2) {
      player2.awakenSkill(event2.name);
      const card = new lib.element.VCard({ name: "sha", isCard: true });
      const [boolx, goon] = get.info(event2.name).getBool(trigger, player2);
      if (boolx) {
        let draw = false;
        if (goon) {
          const result = await player2.chooseBool("是否与" + get.translation(trigger.player) + "各摸一张牌？").set("choice", get.attitude(player2, trigger.player) > 0 || trigger.player.countCards("h") > player2.countCards("h")).forResult();
          if (result?.bool) {
            draw = true;
          }
        } else {
          draw = true;
        }
        if (draw) {
          await player2.draw("nodelay");
          await trigger.player.draw();
        }
      }
      if (goon) {
        await player2.chooseUseTarget(card, false, !boolx);
      }
    }
  },
  //族吴乔
  clanqiajue: {
    audio: 2,
    trigger: { player: "phaseDrawBegin" },
    filter(event2, player2) {
      return player2.countCards("he", (card) => {
        if (_status.connectMode && get.position(card) == "h") {
          return true;
        }
        return get.color(card, player2) == "black" && lib.filter.cardDiscardable(card, player2);
      }) > 0;
    },
    direct: true,
    async content(event2, trigger, player2) {
      const { bool } = await player2.chooseToDiscard((card, player3) => {
        return get.color(card, player3) == "black" && lib.filter.cardDiscardable(card, player3);
      }, "he").set("prompt", "当前手牌点数和为" + player2.getCards("h").reduce((sum, card) => sum + get.number(card), 0) + "，" + get.prompt("clanqiajue")).set("prompt2", lib.translate.clanqiajue_info.slice(lib.translate.clanqiajue_info.indexOf("弃置")).slice(0, -1)).set("ai", (card) => {
        const player3 = get.event().player, goon = get.position(card) == "h";
        let num = player3.getCards("h").reduce((sum, card2) => sum + get.number(card2), 0);
        if (num - (goon ? get.number(card) : 0) > 30) {
          return 0;
        }
        return goon ? get.number(card) : 1 / (get.value(card) || 0.5);
      }).set("logSkill", "clanqiajue").forResult();
      if (bool) {
        player2.when({
          player: ["phaseDrawEnd", "phaseDrawCancelled", "phaseUseSkipped"]
        }).filter((evt) => evt == trigger).step(async (event3, trigger2, player3) => {
          const cards2 = player3.getCards("h"), num = cards2.reduce((sum, card) => sum + get.number(card), 0);
          if (cards2.length) {
            player3.showCards(cards2, get.translation(player3) + "【跒倔】展示");
          }
          if (num > 30) {
            player3.popup("杯具");
            lib.skill.chenliuwushi.change(player3, -2);
          } else {
            player3.popup("洗具");
            const evt = trigger2.getParent("phase", true, true);
            if (evt?.phaseList) {
              evt.phaseList.splice(evt.num + 1, 0, "phaseDraw|clanqiajue");
            }
          }
        });
      }
    }
  },
  //族荀攸
  clanbaichu: {
    derivation: "qice",
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter(event2, player2) {
      const storage = player2.storage.clanbaichu || {};
      if (Object.values(storage).includes(event2.card.name)) {
        return true;
      }
      const suit = get.suit(event2.card);
      if (suit == "none") {
        return false;
      }
      if (!player2.hasSkill("qice")) {
        return true;
      }
      const key = `${suit}+${get.type2(event2.card)}`;
      return !(key in storage);
    },
    forced: true,
    async content(event2, trigger, player2) {
      const storage = player2.storage.clanbaichu || {}, suit = get.suit(trigger.card);
      if (suit != "none") {
        const key = `${suit}+${get.type2(trigger.card)}`;
        if (key in storage) {
          if (!player2.hasSkill("qice", null, false, false)) {
            await player2.addTempSkills("qice", "roundStart");
          }
        } else {
          const list = lib.inpile.filter((name) => get.type(name) == "trick");
          list.removeArray(Object.values(storage));
          if (list.length) {
            const dialog = ["百出：选择记录一种普通锦囊牌", [list, "vcard"]];
            const result = await player2.chooseButton(dialog, true).set("ai", function(button) {
              const player3 = get.player(), name = button.link[2];
              if (name == get.event().getTrigger().card.name) {
                return 1919810;
              }
              if (name == "wuxie") {
                return 114514;
              }
              return get.effect(player3, { name }, player3, player3) * (1 + player3.countCards("hs", name));
            }).forResult();
            if (result?.bool && result?.links?.length) {
              const key2 = `${get.suit(trigger.card)}+${get.type2(trigger.card)}`, name = result.links[0][2];
              player2.storage.clanbaichu ??= {};
              player2.storage.clanbaichu[key2] = name;
              player2.markSkill("clanbaichu");
              game.log(player2, "记录了", "#y" + get.translation(name));
              await event2.trigger("clanbaichu");
              await game.delayx();
            }
          }
        }
      }
      if (Object.values(player2.getStorage("clanbaichu")).includes(trigger.card.name)) {
        await player2.chooseDrawRecover(true);
      }
    },
    mark: true,
    intro: {
      markcount(storage = {}) {
        if (!storage) {
          return 0;
        }
        return Object.keys(storage).length;
      },
      mark(dialog, storage = {}) {
        if (!storage) {
          return "当前暂无记录";
        }
        const addNewRow = lib.element.dialog.addNewRow.bind(dialog);
        dialog.css({ width: "50%" });
        if (get.is.phoneLayout()) {
          dialog.classList.add("fullheight");
        }
        let types = ["basic", "trick", "equip"].concat(Object.keys(storage).map((list) => list.split("+")[1])).toUniqued();
        let suits = lib.suit.slice().reverse().concat(Object.keys(storage).map((list) => list.split("+")[0])).toUniqued();
        addNewRow(
          ...["花色"].concat(types.map((i) => get.translation(i))).map((type) => {
            return { item: type, ratio: type == "花色" ? 1 : 2 };
          })
        );
        for (const suit of suits) {
          let list = [{ item: get.translation(suit), ratio: 1 }];
          for (const type of types) {
            list.add({
              item: ((suit2, type2, storage2) => {
                if (storage2[suit2 + "+" + type2]) {
                  return get.translation(storage2[suit2 + "+" + type2]);
                }
                return null;
              })(suit, type, storage),
              ratio: 2
            });
          }
          addNewRow(...list);
        }
      }
    },
    init(player2, skill) {
      player2.addSkill(skill + "_count");
    },
    onremove(player2, skill) {
      player2.removeSkill(skill + "_count");
    },
    subSkill: {
      count: {
        charlotte: true,
        init(player2) {
          const storage = player2.storage.clanbaichu || {};
          const cards_old = player2.getCards("h", (card) => {
            const suit = get.suit(card, false);
            return (suit === "none" || `${suit}+${get.type2(card, false)}` in storage) && card.hasGaintag("clanbaichu_new");
          });
          if (cards_old.length) {
            player2.removeGaintag("clanbaichu_new", cards_old);
          }
          const cards_new = player2.getCards("h", (card) => {
            const suit = get.suit(card, false);
            return suit !== "none" && !(`${suit}+${get.type2(card, false)}` in storage) && !card.hasGaintag("clanbaichu_new");
          });
          if (cards_new.length) {
            player2.addGaintag(cards_new, "clanbaichu_new");
          }
          const cards_trick = player2.getCards("h", (card) => Object.values(storage).includes(get.name(card, false)) && !card.hasGaintag("clanbaichu_trick"));
          if (cards_trick.length) {
            player2.addGaintag(cards_trick, "clanbaichu_trick");
          }
        },
        onremove(player2) {
          player2.removeGaintag("clanbaichu_new");
          player2.removeGaintag("clanbaichu_trick");
        },
        trigger: {
          player: ["gainEnd", "clanbaichu", "enterGame"],
          global: ["loseAsyncEnd", "gameDrawEnd", "phaseBefore"]
        },
        filter(event2, player2) {
          if (["gain", "loseAsync"].includes(event2.name) && !event2.getg?.(player2)?.length) {
            return false;
          }
          const storage = player2.storage.clanbaichu || {};
          return player2.hasCard((card) => {
            const suit = get.suit(card, false);
            const old = (suit === "none" || `${suit}+${get.type2(card, false)}` in storage) && card.hasGaintag("clanbaichu_new");
            const newx = suit !== "none" && !(`${suit}+${get.type2(card, false)}` in storage) && !card.hasGaintag("clanbaichu_new");
            const load = Object.values(storage).includes(get.name(card, false)) && !card.hasGaintag("clanbaichu_trick");
            return old || newx || load;
          }, "h");
        },
        silent: true,
        firstDo: true,
        async content(event2, trigger, player2) {
          get.info(event2.name).init?.(player2);
        }
      },
      new: {},
      trick: {}
    }
  },
  //族王沦
  clanqiuxin: {
    audio: 2,
    enable: "phaseUse",
    filterTarget: lib.filter.notMe,
    usable: 1,
    async content(event2, trigger, player2) {
      const { target } = event2;
      const str = get.translation(player2);
      const result = await target.chooseControl().set("choiceList", [str + "下次对你使用【杀】后，其视为对你使用任意普通锦囊牌", str + "下次对你使用任意普通锦囊牌后，其视为对你使用【杀】"]).set("ai", function() {
        const target2 = _status.event.player;
        const player3 = _status.event.target;
        let num1 = get.effect(target2, get.autoViewAs({ name: "sha" }, []), player3, player3);
        if (!player3.canUse(get.autoViewAs({ name: "sha" }, []), target2)) {
          num1 = 0;
        }
        let num2 = 0;
        for (const name of lib.inpile) {
          if (get.type(name) != "trick") {
            continue;
          }
          if (!player3.canUse(get.autoViewAs({ name }, []), target2)) {
            continue;
          }
          const eff = get.effect(target2, get.autoViewAs({ name }, []), player3, player3);
          if (num2 < eff) {
            num2 = eff;
          }
        }
        return num1 >= num2 ? 1 : 0;
      }).set("target", player2).forResult();
      player2.addSkill("clanqiuxin_effect");
      player2.markAuto("clanqiuxin_effect", [[target, result.index]]);
    },
    ai: {
      order: 9,
      result: {
        target(player2, target) {
          var cards2 = player2.getCards("hs", (card) => {
            if (get.name(card, player2) != "sha" && get.type(card, null, player2) != "trick") {
              return false;
            }
            return player2.hasValueTarget(card);
          });
          if (cards2.some((card) => player2.canUse(card, target) && get.effect(target, card, player2, player2) > 0)) {
            var att = get.attitude(player2, target);
            if (att > 0) {
              return 9;
            }
            if (att < 0) {
              return -6;
            }
            return 0;
          } else {
            var att = get.attitude(player2, target);
            if (att < 0) {
              return -3;
            }
            if (att > 0) {
              return 1;
            }
            return 2;
          }
        }
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        intro: {
          content(storage, player2) {
            var infos = [];
            for (var i = 0; i < storage.length; i++) {
              var list = storage[i];
              var strx = ["【杀】", "任意普通锦囊牌"];
              if (list[1]) {
                strx.reverse();
              }
              infos.add("对" + get.translation(list[0]) + "使用" + strx[0] + "后，视为对其使用" + strx[1]);
            }
            return infos.join("<br>");
          }
        },
        trigger: { player: "useCardAfter" },
        filter(event2, player2) {
          if (!event2.targets || !event2.targets.length) {
            return false;
          }
          if (event2.card.name == "sha") {
            return event2.targets.some((target) => {
              return player2.getStorage("clanqiuxin_effect").some((list) => list[0] == target && list[1] == 0);
            });
          }
          if (get.type(event2.card) == "trick") {
            return event2.targets.some((target) => {
              return player2.getStorage("clanqiuxin_effect").some((list) => list[0] == target && list[1] == 1);
            });
          }
          return false;
        },
        forced: true,
        popup: false,
        async content(event2, trigger, player2) {
          let matchedList;
          if (trigger.card.name == "sha") {
            matchedList = player2.getStorage("clanqiuxin_effect").filter((item) => trigger.targets.includes(item[0]) && item[1] == 0);
          }
          if (get.type(trigger.card) == "trick") {
            matchedList = player2.getStorage("clanqiuxin_effect").filter((item) => trigger.targets.includes(item[0]) && item[1] == 1);
          }
          player2.unmarkAuto("clanqiuxin_effect", matchedList);
          const targets = matchedList.map((item) => item[0]);
          for (const target of targets) {
            event2.target = target;
            const options = [];
            const nameFilter = trigger.card.name == "sha" ? (name) => get.type(name) == "trick" : (name) => name == "sha";
            for (const name of lib.inpile) {
              if (name != "sha" && get.type(name) != "trick") {
                continue;
              }
              if (!nameFilter(name)) {
                continue;
              }
              if (!player2.canUse(get.autoViewAs({ name }, []), target)) {
                continue;
              }
              options.push([get.translation(get.type(name)), "", name]);
            }
            if (!options.length) {
              continue;
            }
            const result = await player2.chooseButton({
              forced: true,
              createDialog: ["求心：视为对" + get.translation(target) + "使用一张牌", [options, "vcard"]]
            }).set("ai", function(button) {
              const player3 = _status.event.player;
              const target2 = _status.event.target;
              return get.effect(
                target2,
                {
                  name: button.link[2],
                  nature: button.link[3]
                },
                player3,
                player3
              );
            }).set("target", target).forResult();
            if (result.bool) {
              const card = get.autoViewAs({
                name: result.links?.[0][2],
                nature: result.links?.[0][3]
              });
              await player2.useCard({
                card,
                targets: [target],
                addCount: false
              });
            }
          }
          if (!player2.getStorage("clanqiuxin_effect").length) {
            player2.removeSkill("clanqiuxin_effect");
          }
        }
      }
    }
  },
  clanjianyuan: {
    inherit: "clanchenya",
    filter(event2, player2) {
      if (event2.type != "player") {
        return false;
      }
      var skill = get.sourceSkillFor(event2);
      var info = get.info(skill);
      if (info.charlotte) {
        return false;
      }
      var translation = get.skillInfoTranslation(skill, event2.player);
      if (!translation) {
        return false;
      }
      var match = get.plainText(translation).match(/“?出牌阶段限一次/g);
      if (!match || match.every((value) => value != "出牌阶段限一次") || !event2.player.countCards("he")) {
        return false;
      }
      for (var phase of lib.phaseName) {
        var evt = event2.getParent(phase);
        if (evt && evt.name == phase) {
          if (event2.player.getHistory("useCard", (evtx) => evtx.getParent(phase) == evt).length) {
            return true;
          }
        }
      }
      return false;
    },
    async content(event2, trigger, player2) {
      let num = 0;
      for (const phase of lib.phaseName) {
        const evt = trigger.getParent(phase);
        if (evt && evt.name == phase) {
          num += trigger.player.getHistory("useCard", (evtx) => evtx.getParent(phase) == evt).length;
        }
      }
      const result = await trigger.player.chooseCard("是否重铸任意张牌名字数为" + num + "的牌？", [1, Infinity], "he", (card, player3) => _status.event.cards.includes(card) && player3.canRecast(card), "allowChooseAll").set("ai", (card) => {
        const val = get.value(card);
        return 6 - val;
      }).set(
        "cards",
        trigger.player.getCards("he", (card) => {
          return get.cardNameLength(card) == num;
        })
      ).forResult();
      if (result.bool) {
        await trigger.player.recast(result.cards);
      }
    }
  },
  //族钟毓
  clanjiejian: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter(event2, player2) {
      if (!event2.isFirstTarget || get.type(event2.card) == "equip") {
        return false;
      }
      return get.cardNameLength(event2.card) == player2.getHistory("useCard").indexOf(event2.getParent()) + 1;
    },
    direct: true,
    locked: false,
    async content(event2, trigger, player2) {
      const num = get.cardNameLength(trigger.card);
      const result = await player2.chooseTarget(get.prompt("clanjiejian"), `令一名目标角色摸${get.cnNumber(num)}张牌`, (card, player3, target) => {
        return trigger.targets.includes(target);
      }).set("ai", (target) => get.attitude(player2, target)).forResult();
      if (result.bool) {
        const [target] = result.targets;
        player2.logSkill("clanjiejian", target);
        await target.draw(num);
      }
    },
    ai: {
      threaten: 3,
      effect: {
        player_use(card, player2, target) {
          if (!target || typeof card !== "object" || player2._clanjiejian_mod_temp || get.type(card) === "equip" || get.attitude(player2, target) <= 0 || get.cardNameLength(card) !== player2.getHistory("useCard").length + 1) {
            return;
          }
          let targets = [target], evt = _status.event.getParent("useCard");
          targets.addArray(ui.selected.targets);
          if (evt && evt.card == card) {
            targets.addArray(evt.targets);
          }
          return [1, 0.8 * get.cardNameLength(card) / targets.length];
        }
      }
    },
    mod: {
      aiOrder(player2, card, num) {
        if (typeof card == "object" && get.type(card) !== "equip") {
          let cs = get.cardNameLength(card) - player2.getHistory("useCard").length - 1;
          if (cs < 0) {
            return num;
          }
          if (cs > 0) {
            return num / 3;
          }
          player2._clanjiejian_mod_temp = true;
          let bool = game.hasPlayer((target) => {
            if (get.attitude(player2, target) <= 0 || !player2.canUse(card, target, null, true)) {
              return false;
            }
            return get.effect(target, card, player2, player2) + get.effect(target, { name: "draw" }, player2, player2) > 0;
          });
          delete player2._clanjiejian_mod_temp;
          if (bool) {
            return num + 15;
          }
        }
      }
    }
  },
  clanhuanghan: {
    audio: 2,
    trigger: { player: "damageEnd" },
    filter(event2, player2) {
      if (!event2.card) {
        return false;
      }
      var num = get.cardNameLength(event2.card);
      return typeof num == "number" && num > 0;
    },
    check(event2, player2) {
      let num = get.cardNameLength(event2.card) - player2.getDamagedHp();
      if (num >= 0) {
        return true;
      }
      if (num < -1) {
        return false;
      }
      if (player2.hasSkill("clanbaozu", null, false, false) && player2.awakenedSkills.includes("clanbaozu") && player2.getHistory("useSkill", (evt) => {
        return evt.skill == "clanhuanghan";
      }).length) {
        return true;
      }
      return false;
    },
    async content(event2, trigger, player2) {
      player2.addTempSkill("clanhuanghan_used");
      player2.addMark("clanhuanghan_used");
      const num = player2.countMark("clanhuanghan_used");
      await player2.draw(get.cardNameLength(trigger.card));
      if (player2.isDamaged()) {
        await player2.chooseToDiscard(player2.getDamagedHp(), "he", true);
      }
      if (num > 1 && player2.hasSkill("clanbaozu", null, false, false) && player2.awakenedSkills.includes("clanbaozu")) {
        player2.restoreSkill("clanbaozu");
        player2.popup("保族");
        game.log(player2, "恢复了技能", "#g【保族】");
      }
    },
    ai: {
      threaten: 3,
      effect: {
        target(card, player2, target) {
          if (!lib.translate[card.name] || !get.tag(card, "damage") || player2.hasSkillTag("jueqing", false, target)) {
            return;
          }
          let num = get.cardNameLength(card) - target.getDamagedHp();
          if (num > 0) {
            return [1, 0.8 * num + 0.1];
          }
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  //族钟会
  clanyuzhi: {
    mod: {
      aiOrder(player2, card, num) {
        if (card.name == "tao") {
          return num / 114514;
        }
      }
    },
    audio: 6,
    trigger: { global: ["roundStart", "roundEnd"] },
    filter(event2, player2, name) {
      if (name === "roundStart") {
        return player2.countCards("h");
      }
      if (player2.hasCard((card) => card.hasGaintag("clanyuzhi") && lib.filter.cardDiscardable(card, player2), "h")) {
        return true;
      }
      const num1 = player2.getRoundHistory("gain", (evt) => evt.getParent().name == "draw" && evt.getParent(2).name == "clanyuzhi").reduce((sum, evt) => sum + evt.cards.length, 0);
      const num2 = player2.getRoundHistory("gain", (evt) => evt.getParent().name == "draw" && evt.getParent(2).name == "clanyuzhi", 1).reduce((sum, evt) => sum + evt.cards.length, 0);
      const num3 = player2.getRoundHistory("useCard").length;
      return num1 > 0 && num2 > 0 && num1 > num2 || num1 > num3;
    },
    forced: true,
    async content(event2, trigger, player2) {
      const name = event2.triggername;
      const num1 = player2.getRoundHistory("gain", (evt) => evt.getParent().name == "draw" && evt.getParent(2).name == "clanyuzhi", name === "roundStart" ? 1 : 0).reduce((sum, evt) => sum + evt.cards.length, 0);
      switch (name) {
        case "roundStart": {
          const result = await player2.chooseCard(
            "迂志：请展示一张手牌",
            "摸此牌牌名字数的牌。本轮结束时弃置此牌，若本轮你使用的牌数或上一轮你以此法摸的牌数小于此牌牌名字数，则你受到1点雷属性伤害或失去〖保族〗。",
            (card, player3) => {
              const num = get.cardNameLength(card);
              return typeof num == "number" && num > 0;
            },
            true
          ).set("ai", (card) => {
            const { dying, num } = get.event();
            if (dying && num > 0 && get.cardNameLength(card) > num) {
              return 1 / get.cardNameLength(card);
            }
            return get.cardNameLength(card);
          }).set(
            "dying",
            player2.hp + player2.countCards("hs", {
              name: ["tao", "jiu"]
            }) < 1
          ).set("num", num1).forResult();
          if (result?.bool && result.cards?.length) {
            await player2.showCards(result.cards, get.translation(player2) + "发动了【迂志】");
            player2.addGaintag(result.cards, "clanyuzhi");
            await player2.draw(get.cardNameLength(result.cards[0]));
            player2.storage.clanyuzhi_mark = get.cardNameLength(result.cards[0]);
            player2.addTempSkill("clanyuzhi_mark", "roundStart");
          }
          break;
        }
        case "roundEnd": {
          const cards2 = player2.getCards("h", (card) => card.hasGaintag("clanyuzhi") && lib.filter.cardDiscardable(card, player2));
          if (cards2.length) {
            await player2.discard(cards2);
          }
          const num2 = player2.getRoundHistory("gain", (evt) => evt.getParent().name == "draw" && evt.getParent(2).name == "clanyuzhi", 1).reduce((sum, evt) => sum + evt.cards.length, 0);
          const num3 = player2.getRoundHistory("useCard").length;
          if (num1 > 0 && num2 > 0 && num1 > num2 || num1 > num3) {
            let result;
            if (num2 > 0 && num1 > num2) {
              game.log(player2, "的野心已开始膨胀", "#y(" + num1 + "张>" + num2 + "张)");
            }
            if (num1 > num3) {
              game.log(player2, "的行动未达到野心", "#y(" + num3 + "张<" + num1 + "张)");
            }
            if (player2.hasSkill("clanbaozu", null, false, false)) {
              result = await player2.chooseBool("迂志：是否失去〖保族〗？", "若选择“否”，则你受到1点雷属性伤害").set("choice", player2.awakenedSkills.includes("clanbaozu")).forResult();
            } else {
              result = { bool: false };
            }
            if (result?.bool) {
              await player2.removeSkills("clanbaozu");
            } else {
              await player2.damage(1, "thunder");
            }
          }
        }
      }
    },
    ai: {
      threaten: 3,
      nokeep: true
    },
    onremove(player2, skill) {
      player2.removeGaintag(skill);
      player2.removeSkill(skill + "_mark");
    },
    subSkill: {
      mark: {
        charlotte: true,
        onremove: true,
        mark: true,
        intro: { content: "本轮野心：#张" }
      }
    }
  },
  clanxieshu: {
    audio: 6,
    trigger: { player: "damageEnd", source: "damageSource" },
    filter(event2, player2) {
      if (!event2.card || player2.isLinked()) {
        return false;
      }
      var num = get.cardNameLength(event2.card);
      return typeof num == "number" && num > 0 && player2.countCards("he") > 0;
    },
    async cost(event2, trigger, player2) {
      var num = get.cardNameLength(trigger.card), str = "";
      if (player2.getDamagedHp() > 0) {
        str += "，然后摸" + get.cnNumber(player2.getDamagedHp()) + "张牌";
      }
      event2.result = await player2.chooseToDiscard(get.prompt(event2.skill), "横置武将牌并弃置" + get.cnNumber(num) + "张牌" + str, "he", num, "chooseonly").set("ai", function(card) {
        var player3 = _status.event.player;
        var num2 = _status.event.num;
        var num22 = player3.getDamagedHp();
        if (!num22) {
          return 0;
        }
        if (num2 < num22) {
          return 8 - get.value(card);
        }
        if (num2 == num22 || num22 >= 2 + num2 - num22) {
          return lib.skill.zhiheng.check(card);
        }
        return 0;
      }).set("num", num).forResult();
    },
    //popup: false,
    async content(event2, trigger, player2) {
      await player2.discard(event2.cards);
      await player2.link(true);
      if (player2.getDamagedHp() > 0) {
        await player2.draw(player2.getDamagedHp());
      }
      if (game.getGlobalHistory("everything", (evt) => {
        return evt.name == "dying";
      }).length) {
        player2.tempBanSkill("clanxieshu");
      }
    },
    ai: { threaten: 3 }
  },
  //族王浑
  clanfuxun: {
    mod: {
      aiOrder(player2, card, num) {
        if (player2.isPhaseUsing() && get.type(card) == "equip" && get.equipValue(card, player2) > 0) {
          return num + 3;
        }
      },
      cardUsable(card) {
        if (card.storage?.clanfuxun) {
          return Infinity;
        }
      }
    },
    locked: false,
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterCard: true,
    position: "h",
    discard: false,
    lose: false,
    delay: false,
    selectCard() {
      var player2 = _status.event.player;
      if (ui.selected.targets.length && !ui.selected.targets[0].countGainableCards(player2, "h")) {
        return 1;
      }
      return [0, 1];
    },
    filterTarget(card, player2, target) {
      if (player2 == target) {
        return false;
      }
      if (!ui.selected.cards.length) {
        return target.countGainableCards(player2, "h") > 0;
      }
      return true;
    },
    check(card) {
      var player2 = _status.event.player;
      var evtx = _status.event.getParent("phaseUse");
      var targets = game.filterPlayer((target2) => target2 != player2 && lib.skill.clanfuxun.ai.result.target(player2, target2) != 0);
      targets.sort((a, b) => Math.abs(lib.skill.clanfuxun.ai.result.target(player2, b)) - Math.abs(lib.skill.clanfuxun.ai.result.target(player2, a)));
      if (evtx && targets.length) {
        var target = targets[0];
        if (!target.hasHistory("lose", (evt) => {
          return evt.getParent(3).name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards2.length;
        }) && !target.hasHistory("gain", (evt) => {
          return evt.getParent().name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards.length;
        }) && Math.abs(player2.countCards("h") - target.countCards("h")) == 2) {
          if (player2.countCards("h") > target.countCards("h")) {
            return 1 / (get.value(card) || 0.5);
          }
          return -1;
        }
        if (card.name == "du") {
          return 20;
        }
        return -1;
      }
      if (card.name == "du") {
        return 20;
      }
      return -1;
    },
    async content(event2, trigger, player2) {
      const { cards: cards2, target } = event2;
      let result;
      if (cards2.length) {
        await player2.give(cards2, target);
      } else {
        await player2.gainPlayerCard(target, "h", true);
      }
      const evtx = event2.getParent("phaseUse");
      if (player2.countCards("h") == target.countCards("h") && evtx && !target.hasHistory("lose", (evt) => {
        return evt.getParent(3).name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards2.length;
      }) && !target.hasHistory("gain", (evt) => {
        return evt.getParent().name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards.length;
      }) && player2.countCards("he")) {
        const list = [];
        for (const name of lib.inpile) {
          if (get.type(name) != "basic") {
            continue;
          }
          if (player2.hasUseTarget({ name })) {
            list.push(["基本", "", name]);
          }
          if (name == "sha") {
            for (const nature of lib.inpile_nature) {
              if (player2.hasUseTarget({
                name,
                nature
              })) {
                list.push(["基本", "", name, nature]);
              }
            }
          }
        }
        if (!list.length) {
          return;
        }
        result = await player2.chooseButton(["是否将一张牌当做一种基本牌使用？", [list, "vcard"]]).set("ai", (button) => {
          return _status.event.player.getUseValue({
            name: button.link[2],
            nature: button.link[3]
          });
        }).forResult();
      } else {
        return;
      }
      if (result.bool) {
        const card = {
          name: result.links[0][2],
          nature: result.links[0][3],
          storage: { clanfuxun: true }
        };
        game.broadcastAll(function(card2) {
          lib.skill.clanfuxun_backup.viewAs = card2;
        }, card);
        const next = player2.chooseToUse();
        next.set("openskilldialog", "将一张牌当做" + get.translation(card) + "使用");
        next.set("norestore", true);
        next.set("addCount", false);
        next.set("_backupevent", "clanfuxun_backup");
        next.set("custom", {
          add: {},
          replace: { window() {
          } }
        });
        next.backup("clanfuxun_backup");
        await next;
      }
    },
    ai: {
      order(item, player2) {
        var evtx = _status.event.getParent("phaseUse");
        if (game.hasPlayer((current) => {
          if (current == player2 || !evtx || get.attitude(player2, current) == 0) {
            return false;
          }
          return !current.hasHistory("lose", (evt) => {
            return evt.getParent(3).name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards2.length;
          }) && !current.hasHistory("gain", (evt) => {
            return evt.getParent().name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards.length;
          }) && Math.abs(player2.countCards("h") - current.countCards("h")) == 2;
        })) {
          return 5;
        }
        return 1;
      },
      result: {
        target(player2, target) {
          var evtx = _status.event.getParent("phaseUse");
          var num = get.sgn(get.attitude(player2, target));
          var targets = game.filterPlayer((current) => {
            if (current == player2 || !evtx || get.attitude(player2, current) == 0) {
              return false;
            }
            return !current.hasHistory("lose", (evt) => {
              return evt.getParent(3).name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards2.length;
            }) && !current.hasHistory("gain", (evt) => {
              return evt.getParent().name != "clanfuxun" && evt.getParent("phaseUse") == evtx && evt.cards.length;
            }) && Math.abs(player2.countCards("h") - current.countCards("h")) == 2;
          });
          if (targets.includes(target)) {
            if (player2.countCards("h") < target.countCards("h")) {
              return get.sgn(num + 0.5) * Math.sqrt(2 - num);
            } else {
              return num * (2 + num);
            }
          }
          return get.sgn(num + 0.5) * (1 - num) * 0.25;
        }
      }
    },
    subSkill: {
      backup: {
        filterCard(card) {
          return get.itemtype(card) == "card";
        },
        position: "hes",
        filterTarget: lib.filter.filterTarget,
        selectCard: 1,
        check(card) {
          var player2 = _status.event.player;
          if (player2.hasSkill("clanzhongliu") && get.position(card) != "h") {
            return 10 - get.value(card);
          }
          return 5 - get.value(card);
        },
        log: false
      }
    }
  },
  clanchenya: {
    audio: 2,
    trigger: {
      global: ["useSkillAfter", "logSkill"]
    },
    filter(event2, player2) {
      if (event2.type != "player") {
        return false;
      }
      var skill = get.sourceSkillFor(event2);
      var info = get.info(skill);
      if (info.charlotte) {
        return false;
      }
      var translation = get.skillInfoTranslation(skill, event2.player);
      if (!translation) {
        return false;
      }
      var match = get.plainText(translation).match(/“?出牌阶段限一次/g);
      if (!match || match.every((value) => value != "出牌阶段限一次")) {
        return false;
      }
      return event2.player.countCards("h") > 0;
    },
    check(event2, player2) {
      return get.attitude(player2, event2.player) > 0;
    },
    logTarget: "player",
    async content(event2, trigger, player2) {
      const num = trigger.player.countCards("h");
      const result = await trigger.player.chooseCard("是否重铸任意张牌名字数为" + num + "的牌？", [1, Infinity], "he", (card, player3) => _status.event.cards.includes(card) && player3.canRecast(card), "allowChooseAll").set("ai", (card) => {
        const val = get.value(card);
        return 6 - val;
      }).set(
        "cards",
        trigger.player.getCards("he", (card) => {
          return get.cardNameLength(card) == num;
        })
      ).forResult();
      if (result.bool) {
        await trigger.player.recast(result.cards);
      }
    }
  },
  //族王允
  clanjiexuan: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    zhuanhuanji: "number",
    mark: true,
    marktext: "☯",
    intro: {
      markcount: () => 0,
      content(storage) {
        return "限定技，转换技。你可以将一张" + ((storage || 0) % 2 ? "黑色牌当【过河拆桥】" : "红色牌当【顺手牵羊】") + "使用。";
      }
    },
    viewAs(cards2, player2) {
      var storage = player2.storage.clanjiexuan;
      var name = (storage || 0) % 2 ? "guohe" : "shunshou";
      return { name };
    },
    check(card) {
      var player2 = _status.event.player;
      var storage = player2.storage.clanjiexuan;
      var name = (storage || 0) % 2 ? "guohe" : "shunshou";
      var fix = player2.hasSkill("clanzhongliu") && (get.position(card) != "h" || get.suit(card) == "spade") ? 2 : 1;
      return (get.value({ name }, player2) - get.value(card)) * fix;
    },
    position: "hes",
    filterCard(card, player2) {
      var storage = player2.storage.clanjiexuan;
      return get.color(card) == ((storage || 0) % 2 ? "black" : "red");
    },
    prompt() {
      var storage = _status.event.player.storage.clanjiexuan;
      if ((storage || 0) % 2) {
        return "将一张黑色牌当【过河拆桥】使用";
      }
      return "将一张红色牌当【顺手牵羊】使用";
    },
    skillAnimation: true,
    animationColor: "thunder",
    log: false,
    async precontent(event2, trigger, player2) {
      const skill = "clanjiexuan";
      player2.logSkill(skill);
      player2.changeZhuanhuanji(skill);
      player2.awakenSkill(skill, true);
    },
    ai: {
      order(item, player2) {
        player2 = player2 || _status.event.player;
        var storage = _status.event.player.storage.clanjiexuan;
        var name = (storage || 0) % 2 ? "guohe" : "shunshou";
        return get.order({ name }) + 0.1;
      }
    }
  },
  clanmingjie: {
    init(player2) {
      player2.addSkill("clanmingjie_record");
    },
    initSkill(skill) {
      if (!lib.skill[skill]) {
        lib.skill[skill] = {
          charlotte: true,
          onremove: true,
          mark: true,
          marktext: "戒",
          intro: {
            markcount: () => 0,
            content: (storage) => "已被" + get.translation(storage[1]) + "指定为【铭戒】目标"
          },
          group: "clanmingjie_clear"
        };
        lib.translate[skill] = "铭戒";
        lib.translate[skill + "_bg"] = "戒";
      }
    },
    onremove(player2) {
      player2.removeSkill("clanmingjie_record");
    },
    audio: 2,
    enable: "phaseUse",
    limited: true,
    filterTarget(card, player2, target) {
      return !Object.keys(target.storage).some((skill) => {
        return skill.startsWith("clanmingjiex_" + player2.playerid + "_") && target.storage[skill][0] === 1 + (_status.currentPhase === target);
      });
    },
    skillAnimation: true,
    animationColor: "thunder",
    async content(event2, trigger, player2) {
      const target = event2.targets[0];
      player2.awakenSkill(event2.name);
      player2.addSkill("clanmingjie_effect");
      let skill;
      do {
        skill = "clanmingjiex_" + player2.playerid + "_" + Math.random().toString(36).slice(-8);
      } while (lib.skill[skill] != null);
      game.broadcastAll(lib.skill.clanmingjie.initSkill, skill);
      target.addSkill(skill);
      target.storage[skill] = [_status.currentPhase === target ? 2 : 1, player2];
      target.markSkill(skill);
    },
    ai: {
      order: 10,
      result: {
        target(player2, target) {
          if (player2.hasSkill("clanzhongliu") || player2.hp == 1) {
            if (!player2.hasCard((card) => {
              var info = get.info(card);
              if (info.allowMultiple == false) {
                return false;
              }
              if (!lib.filter.targetEnabled2(card, player2, target)) {
                return false;
              }
              return game.hasPlayer((current) => {
                return player2.canUse(card, current) && get.effect(current, card, player2, player2) > 0 && current != target && get.effect(target, card, player2, player2) > 0;
              });
            }, "hs")) {
              return 0;
            }
          } else {
            if (player2.countCards("hs", (card) => {
              var info = get.info(card);
              if (info.allowMultiple == false) {
                return false;
              }
              if (!lib.filter.targetEnabled2(card, player2, target)) {
                return false;
              }
              return game.hasPlayer((current) => {
                return player2.canUse(card, current) && get.effect(current, card, player2, player2) > 0 && current != target && get.effect(target, card, player2, player2) > 0;
              });
            }) < 3) {
              return 0;
            }
          }
          return get.sgnAttitude(player2, target);
        }
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        audio: "clanmingjie",
        mod: {
          aiOrder(player2, card, num) {
            if (get.suit(card) == "spade") {
              return num + 3;
            }
          }
        },
        trigger: { player: "useCard2" },
        filter(event2, player2) {
          const { card } = event2;
          const info = get.info(card);
          if (info.allowMultiple == false) {
            return false;
          }
          if (event2.targets && !info.multitarget) {
            return game.filterPlayer().some((current) => {
              if (!Object.keys(current.storage).some((skill) => skill.startsWith("clanmingjiex_" + player2.playerid + "_"))) {
                return false;
              }
              return !event2.targets.includes(current) && lib.filter.targetEnabled2(card, player2, current) && lib.filter.targetInRange(card, player2, current);
            });
          }
          return false;
        },
        async cost(event2, trigger, player2) {
          event2.result = await player2.chooseTarget(
            get.prompt(event2.skill),
            "令任意【铭戒】目标角色成为" + get.translation(trigger.card) + "的目标",
            (card, player3, target) => {
              const trigger2 = get.event().getTrigger();
              if (trigger2.targets.includes(target) || !Object.keys(target.storage).some((skill) => skill.startsWith("clanmingjiex_" + player3.playerid + "_"))) {
                return false;
              }
              return lib.filter.targetEnabled2(trigger2.card, player3, target) && lib.filter.targetInRange(trigger2.card, player3, target);
            },
            [1, Infinity]
          ).set("ai", (target) => {
            const player3 = get.player();
            const trigger2 = get.event().getTrigger();
            return get.effect(target, trigger2.card, player3, player3);
          }).forResult();
        },
        async content(event2, trigger, player2) {
          const targets = event2.targets.sortBySeat();
          trigger.targets.addArray(targets);
          game.log(targets, "成为了", trigger.card, "的额外目标");
        },
        group: "clanmingjie_targeted"
      },
      clear: {
        charlotte: true,
        trigger: { player: "phaseAfter" },
        filter(event2, player2) {
          return Object.keys(player2.storage).some((i) => i.startsWith("clanmingjiex_"));
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event2, trigger, player2) {
          const storages = Object.keys(player2.storage).filter((i) => i.startsWith("clanmingjiex_"));
          for (const skill of storages) {
            player2.storage[skill][0]--;
            if (!player2.storage[skill][0]) {
              player2.removeSkill(skill);
            }
          }
        }
      },
      targeted: {
        charlotte: true,
        trigger: { global: "phaseEnd" },
        filter(event2, player2) {
          if (!Object.keys(event2.player.storage).some((skill) => {
            return skill.startsWith("clanmingjiex_" + player2.playerid + "_") && event2.player.storage[skill][0] == 1;
          })) {
            return false;
          }
          return player2.getStorage("clanmingjie_record").someInD("d");
        },
        forced: true,
        popup: false,
        async content(event2, trigger, player2) {
          let cards2 = player2.getStorage("clanmingjie_record").slice().filterInD("d");
          while (cards2.some((card) => get.position(card, true) == "d" && player2.hasUseTarget(card))) {
            const result = await player2.chooseButton(["铭戒：是否使用这些牌？", cards2]).set("filterButton", (button) => {
              return get.player().hasUseTarget(button.link);
            }).set("ai", (button) => {
              return get.player().getUseValue(button.link);
            }).forResult();
            if (result.bool) {
              const card = result.links[0];
              cards2.remove(card);
              player2.$gain2(card, false);
              await game.delayx();
              await player2.chooseUseTarget(card, true);
            } else {
              break;
            }
          }
        }
      },
      record: {
        charlotte: true,
        trigger: { global: ["useCard", "respond", "useCard1", "phaseAfter"] },
        filter(event2, player2, name) {
          if (name == "useCard1") {
            return get.suit(event2.card) == "spade";
          }
          if (event2.name == "phase") {
            return true;
          }
          if (!Array.isArray(event2.respondTo)) {
            return false;
          }
          return get.type(event2.respondTo[1]) != "trick" || ["caochuan", "wuxie"].includes(event2.card.name);
        },
        silent: true,
        forced: true,
        async content(event2, trigger, player2) {
          const { storage } = player2;
          if (trigger.name == "phase") {
            delete storage.clanmingjie_record;
          } else {
            const history = game.getGlobalHistory("everything", (evt) => {
              if (event2.triggername == "useCard1") {
                return evt == trigger;
              }
              return evt.name == "useCard" && evt.card == trigger.respondTo[1];
            });
            if (history?.length) {
              player2.markAuto("clanmingjie_record", history[0].cards);
            }
          }
        }
      }
    }
  },
  //族钟琰
  clanguangu: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    zhuanhuanji: true,
    mark: true,
    marktext: "☯",
    intro: {
      content(storage) {
        return "转换技。出牌阶段限一次，你可以观看" + (storage ? "一名角色的至多四张手" : "牌堆顶的至多四张") + "牌，然后可以使用其中的一张牌。";
      }
    },
    filter(event2, player2) {
      if (player2.storage.clanguangu) {
        return game.hasPlayer((current) => {
          return current.countCards("h");
        });
      }
      return true;
    },
    chooseButton: {
      dialog(event2, player2) {
        var dialog = ui.create.dialog("观骨：选择观看牌堆的牌数", "hidden");
        if (player2.storage.clanguangu) {
          dialog.forceDirect = true;
        }
        return dialog;
      },
      chooseControl(event2, player2) {
        var list = [1, 2, 3, 4].map((i) => {
          return get.cnNumber(i, true);
        });
        list.push("cancel2");
        return list;
      },
      check(button, player2) {
        var ret;
        if (!player2.hasSkill("clanxiaoyong")) {
          ret = 4;
        } else {
          var list = [4, 3, 2, 1];
          player2.getHistory("useCard", (evt) => {
            var len = get.cardNameLength(evt.card);
            list.remove(len);
          });
          if (list.length) {
            ret = list[0];
          } else {
            ret = 4;
          }
        }
        return get.cnNumber(ret, true);
      },
      backup(result, player2) {
        return {
          audio: "clanguangu",
          filterCard: () => false,
          selectCard: -1,
          filterTarget(card, player3, target) {
            if (player3.storage.clanguangu) {
              return true;
            }
            return false;
          },
          selectTarget() {
            var player3 = _status.event.player;
            if (player3.storage.clanguangu) {
              return 1;
            }
            return -1;
          },
          num: result.index + 1,
          async content(event2, trigger, player3) {
            const { targets } = event2;
            player3.changeZhuanhuanji("clanguangu");
            let cards2;
            if (!targets?.length) {
              const num = lib.skill["clanguangu_backup"].num;
              cards2 = get.cards(num, true);
            } else {
              const [target] = targets;
              let ret;
              if (!player3.hasSkill("clanxiaoyong")) {
                ret = 4;
              } else {
                const list = [4, 3, 2, 1];
                player3.getHistory("useCard", (evt) => {
                  var len = get.cardNameLength(evt.card);
                  list.remove(len);
                });
                if (list.length) {
                  ret = list[0];
                } else {
                  ret = 4;
                }
              }
              const result2 = await player3.choosePlayerCard(target, "h", true, [1, 4]).set("prompt", "观骨：观看" + get.translation(target) + "的至多四张牌").set("ai", (button) => {
                if (ui.selected.buttons.length >= _status.event.num) {
                  return 0;
                }
                return Math.random();
              }).set("num", ret).forResult();
              cards2 = result2.cards;
            }
            if (cards2?.length) {
              const count = cards2.length;
              event2.getParent().viewedCount = count;
              const result2 = await player3.chooseButton(["观骨：是否使用其中一张牌？", cards2]).set("filterButton", (button) => {
                var player4 = _status.event.player;
                var card = button.link;
                var cardx = {
                  name: get.name(card, get.owner(card)),
                  nature: get.nature(card, get.owner(card)),
                  cards: [card]
                };
                return player4.hasUseTarget(cardx, null, false);
              }).set("ai", (button) => {
                var len = _status.event.len;
                var card = button.link;
                var fix = 1;
                if (get.cardNameLength(card) == len) {
                  fix = 2;
                }
                return fix * _status.event.player.getUseValue(card);
              }).set(
                "len",
                (function() {
                  if (!player3.hasSkill("clanxiaoyong")) {
                    return 0;
                  }
                  var list = [];
                  player3.getHistory("useCard", (evt) => {
                    var len = get.cardNameLength(evt.card);
                    list.add(len);
                  });
                  if (!list.includes(count)) {
                    return count;
                  }
                  if (list.length) {
                    return list.randomGet();
                  }
                  return 4;
                })()
              ).forResult();
              if (result2.bool && result2.links?.length) {
                const {
                  links: [card]
                } = result2;
                cards2.remove(card);
                const cardx = {
                  name: get.name(card, get.owner(card)),
                  nature: get.nature(card, get.owner(card)),
                  cards: [card]
                };
                const next = player3.chooseUseTarget(cardx, [card], true, false);
                if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) {
                  next.viewAs = false;
                }
                await next;
              }
            }
          },
          ai: {
            order: 10,
            result: {
              target(player3, target) {
                return -Math.min(target.countCards("h"), 4) / 2;
              }
            }
          }
        };
      },
      prompt(result, player2) {
        if (!player2.storage.clanguangu) {
          return "点击“确定”以观看牌堆顶牌";
        }
        return "观骨：选择观看牌的目标";
      }
    },
    subSkill: {
      backup: {}
    },
    ai: {
      order: 10,
      result: {
        player: 1
      }
    }
  },
  clanxiaoyong: {
    audio: 2,
    trigger: {
      player: "useCard"
    },
    filter(event2, player2) {
      var len = get.cardNameLength(event2.card);
      if (player2.hasHistory(
        "useCard",
        function(evt2) {
          return evt2 != event2 && get.cardNameLength(evt2.card) == len;
        },
        event2
      )) {
        return false;
      }
      if (!player2.getStat().skill.clanguangu) {
        return false;
      }
      var history = player2.getAllHistory("useSkill", (evt2) => {
        return evt2.skill == "clanguangu_backup";
      }).map((evt2) => evt2.event);
      if (!history.length) {
        return false;
      }
      var num = 0;
      for (var i = history.length - 1; i >= 0; i--) {
        var evt = history[i];
        if (evt.viewedCount) {
          num = evt.viewedCount;
          break;
        }
      }
      if (num && len == num) {
        return true;
      }
      return false;
    },
    forced: true,
    async content(event2, trigger, player2) {
      delete player2.getStat().skill.clanguangu;
      game.log(player2, "重置了", "#g【观骨】");
    },
    ai: {
      combo: "clanguangu"
    },
    mod: {
      aiOrder(player2, card, num) {
        if (!player2.hasSkill("clanguangu") || !player2.getStat().skill.clanguangu) {
          return;
        }
        var history = player2.getAllHistory("useSkill", (evt2) => {
          return evt2.skill == "clanguangu_backup";
        }).map((evt2) => evt2.event);
        if (!history.length) {
          return;
        }
        var numx = 0;
        for (var i = history.length - 1; i >= 0; i--) {
          var evt = history[i];
          if (evt.viewedCount) {
            numx = evt.viewedCount;
            break;
          }
        }
        if (numx == get.cardNameLength(card)) {
          if (!player2.hasHistory("useCard", (evt2) => {
            return numx == get.cardNameLength(evt2.card);
          })) {
            return num + 9;
          }
        }
      }
    }
  },
  clanbaozu: {
    audio: 2,
    audioname: ["clan_zhongyan", "clan_zhongyu", "clan_zhongyao"],
    audioname2: { clan_zhonghui: "clanbaozu_clan_zhonghui" },
    trigger: { global: "dying" },
    clanSkill: true,
    limited: true,
    skillAnimation: true,
    animationColor: "water",
    filter(event2, player2) {
      return (event2.player == player2 || event2.player.hasClan("颍川钟氏")) && event2.player.hp <= 0 && !event2.player.isLinked();
    },
    logTarget: "player",
    check(event2, player2) {
      return lib.skill.wanlan.check(event2, player2);
    },
    async content(event2, trigger, player2) {
      player2.awakenSkill(event2.name);
      await trigger.player.link(true);
      await trigger.player.recover();
    },
    subSkill: { clan_zhonghui: { audio: 6 } }
  },
  //族王凌
  clanbolong: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event2, player2) {
      return player2.countCards("he") > 0;
    },
    filterTarget: lib.filter.notMe,
    async content(event2, trigger, player2) {
      const { target } = event2;
      let result;
      const num = player2.countCards("h");
      const str = "是否交给其" + get.cnNumber(num) + "张牌，然后视为你对其使用一张【酒】？或者点击“取消”，令其交给你一张牌，然后其视为对你使用一张雷【杀】。";
      if (!num || target.countCards("he") < num) {
        result = { bool: false };
      } else {
        result = await target.chooseCard(get.translation(player2) + "对你发动了【驳龙】", str, num, "he").set("ai", (card) => {
          if (_status.event.canGive) {
            return 5 + Math.max(0, 3 - _status.event.player.hp) / 1.5 - get.value(card);
          }
          return 0;
        }).set(
          "canGive",
          (() => {
            if (get.attitude(target, player2) > 1) {
              return true;
            }
            if (!player2.hasSha() && player2.countCards("h") <= 4) {
              return true;
            }
            const sha = {
              name: "sha",
              nature: "thunder",
              isCard: true
            };
            if (game.hasPlayer((current) => {
              return player2.canUse(sha, current, true, true) && get.effect(current, sha, player2, target) < 0 && !current.countCards("hs", ["shan", "caochuan"]);
            })) {
              return false;
            }
            return true;
          })()
        ).forResult();
      }
      if (result.bool) {
        const cards2 = result.cards;
        await target.give(cards2, player2);
        if (lib.filter.targetEnabled2({ name: "jiu", isCard: true }, target, player2)) {
          await target.useCard({ name: "jiu", isCard: true }, player2, false);
        }
        return;
      }
      result = await player2.chooseCard("驳龙：交给" + get.translation(target) + "一张牌", get.translation(target) + "拒绝给牌，请交给其一张牌然后视为对其使用一张雷【杀】", true, "he").forResult();
      if (result.bool) {
        const cards2 = result.cards;
        await player2.give(cards2, target);
        const sha = {
          name: "sha",
          nature: "thunder",
          isCard: true
        };
        if (player2.canUse(sha, target, false, false)) {
          await player2.useCard(sha, target, false);
        }
      }
    },
    ai: {
      order(item, player2) {
        return get.order({ name: "jiu" }) + 0.01;
      },
      threaten: 2,
      result: {
        target(player2, target) {
          if (player2.hasCard((card) => {
            return get.value(card) < 5 && !["shan", "tao", "jiu", "wuxie", "caochuan"].includes(get.name(card));
          }, "he")) {
            return -1;
          }
          return 0;
        }
      }
    }
  },
  clanzhongliu: {
    audio: 2,
    audioname: ["clan_wangling", "clan_wangyun", "clan_wanghun", "clan_wanglun", "clan_wangguang", "clan_wangmingshan", "clan_wangchang", "clan_wangshen"],
    trigger: { player: "useCard" },
    forced: true,
    clanSkill: true,
    filter(event2, player2) {
      if (!event2.cards.length) {
        return true;
      }
      return !game.hasPlayer2((current) => {
        if (!current.hasClan("太原王氏") && current != player2) {
          return false;
        }
        return current.hasHistory("lose", (evt) => {
          const evtx = evt.relatedEvent || evt.getParent();
          return evtx == event2 && evt.hs.length > 0;
        });
      });
    },
    async content(event2, trigger, player2) {
      player2.refreshSkill();
    }
  },
  //族吴匡
  clanlianzhu: {
    audio: 2,
    zhuanhuanji: true,
    mark: true,
    marktext: "☯",
    intro: {
      content(storage) {
        var str = "转换技。每名角色Ａ的出牌阶段限一次。";
        if (!storage) {
          str += "Ａ可以重铸一张牌，然后你可以重铸一张牌。若这两张牌颜色不同，则你的手牌上限-1。";
        } else {
          str += "Ａ可以令你选择一名在你或Ａ攻击范围内的另一名其他角色Ｂ，然后Ａ和你可依次选择是否对Ｂ使用一张【杀】。若这两张【杀】颜色相同，则你的手牌上限+1";
        }
        return str;
      }
    },
    global: "clanlianzhu_global",
    subSkill: {
      global: {
        forceaudio: true,
        audio: "clanlianzhu",
        enable: "phaseUse",
        filter: (event2, player2) => game.hasPlayer((current) => lib.skill.clanlianzhu_global.filterTarget(null, player2, current)),
        filterCard: (card, player2) => game.hasPlayer((current) => current.hasSkill("clanlianzhu") && !current.hasSkill("clanlianzhu_targeted") && !current.storage.clanlianzhu) && player2.canRecast(card),
        selectCard: [0, 1],
        check(card) {
          return 5 - get.value(card);
        },
        filterTarget(card, player2, target) {
          return target.hasSkill("clanlianzhu") && !target.hasSkill("clanlianzhu_targeted") && (!target.storage.clanlianzhu || target.storage.clanlianzhu && game.hasPlayer((current) => {
            if (current == player2 || current == target) {
              return false;
            }
            return current.inRangeOf(player2) || current.inRangeOf(target);
          }));
        },
        selectTarget() {
          var player2 = _status.event.player;
          var count = game.countPlayer((current) => lib.skill.clanlianzhu_global.filterTarget(null, player2, current));
          return count == 1 ? -1 : 1;
        },
        filterOk() {
          var target = ui.selected.targets[0];
          if (!target) {
            return false;
          }
          if (!target.storage.clanlianzhu) {
            return ui.selected.cards.length == 1;
          }
          return ui.selected.cards.length == 0;
        },
        position: "he",
        discard: false,
        lose: false,
        delay: false,
        prompt() {
          var player2 = _status.event.player;
          var bocchi = [], kita = [];
          game.countPlayer(function(target) {
            if (target.hasSkill("clanlianzhu") && !target.hasSkill("clanlianzhu_targeted")) {
              if (target.storage.clanlianzhu) {
                if (game.hasPlayer((current) => {
                  if (current == player2 || current == target) {
                    return false;
                  }
                  return current.inRangeOf(player2) || current.inRangeOf(target);
                })) {
                  kita.add(target);
                }
              } else {
                if (player2.countCards("he") > 0) {
                  bocchi.add(target);
                }
              }
            }
          });
          bocchi.sortBySeat();
          kita.sortBySeat();
          var str = "";
          if (bocchi.length) {
            str += "重铸一张牌，然后令";
            bocchi.forEach((current, i) => {
              str += get.translation(current);
              if (i < bocchi.length - 1) {
                str += "或";
              }
            });
            str += "选择是否重铸一张牌";
            if (kita.length) {
              str += "。<br>或者";
            }
          }
          if (kita.length) {
            str += "令";
            kita.forEach((current, i) => {
              str += get.translation(current);
              if (i < kita.length - 1) {
                str += "或";
              }
            });
            str += "选择一名目标，然后对其进行集火";
          }
          str += "。";
          return str;
        },
        async content(event2, trigger, player2) {
          const { cards: cards2, target } = event2;
          let result;
          target.addTempSkill("clanlianzhu_targeted", "phaseUseAfter");
          if (!target.storage.clanlianzhu) {
            target.changeZhuanhuanji("clanlianzhu");
            await player2.recast(cards2);
            if (!target.countCards("he") && !_status.connectMode) {
              result = { bool: false };
            } else {
              result = await target.chooseCard("he", "联诛：是否重铸一张牌？", lib.filter.cardRecastable).forResult();
            }
            if (result.bool) {
              await target.recast(result.cards);
              if (get.color(cards2[0]) === get.color(result.cards[0])) {
                lib.skill.chenliuwushi.change(target, 1);
              }
            }
            return;
          }
          result = await target.chooseTarget("联诛：选择其与你使用【杀】的目标", true, (card, player3, target2) => {
            if (target2 == player3 || target2 == _status.event.sourcex) {
              return false;
            }
            return target2.inRangeOf(player3) || target2.inRangeOf(_status.event.sourcex);
          }).set("ai", (target2) => {
            return get.effect(target2, { name: "sha" }, _status.event.player, _status.event.player);
          }).set("sourcex", player2).forResult();
          if (!result.bool) {
            return;
          }
          const targetx = result.targets[0];
          target.line(targetx);
          if (!event2.isMine() && !event2.isOnline()) {
            await game.delayx();
          }
          const users = [player2, target];
          const usedCards = [];
          for (const current of users) {
            result = await current.chooseToUse(
              function(card, player3, event3) {
                if (get.name(card) != "sha") {
                  return false;
                }
                return lib.filter.filterCard.apply(this, arguments);
              },
              "联诛：是否对" + get.translation(targetx) + "使用一张杀？"
            ).set("targetRequired", true).set("complexSelect", true).set("complexTarget", true).set("filterTarget", function(card, player3, target2) {
              if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
                return false;
              }
              return lib.filter.targetEnabled.apply(this, arguments);
            }).set("sourcex", targetx).set("addCount", false).forResult();
            if (result.bool) {
              usedCards.push(result.card);
            }
          }
          if (usedCards.length > 1) {
            const color = get.color(usedCards[0], false);
            if (color != "none") {
              for (const card of usedCards.slice(1)) {
                const color2 = get.color(card, false);
                if (color !== color2 && color2 !== "none") {
                  lib.skill.chenliuwushi.change(target, -1);
                  break;
                }
              }
            }
          }
        },
        ai: {
          order: 4.1,
          result: {
            player(player2, target) {
              if (!target.storage.clanlianzhu && player2.hasCard((card) => get.value(card) < 5, "he")) {
                return 1;
              }
              return 0;
            },
            target(player2, target) {
              if (target.storage.clanlianzhu && player2.hasSha()) {
                return 1;
              }
              return 0;
            }
          }
        }
      },
      targeted: { charlotte: true }
    }
  },
  //族韩韶
  clanfangzhen: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event2, player2) {
      return game.hasPlayer((current) => !current.isLinked());
    },
    direct: true,
    seatRelated: true,
    async content(event2, trigger, player2) {
      let result;
      let target;
      result = await player2.chooseTarget(get.prompt2("clanfangzhen"), (card, player3, target2) => {
        return !target2.isLinked();
      }).set("ai", (target2) => {
        const player3 = _status.event.player;
        if (_status.event.goon && target2 != player3) {
          let cards2 = [];
          target2.classList.add("linked");
          target2.classList.add("linked2");
          try {
            cards2 = player3.getCards("hs", (cardx) => {
              if (get.name(cardx) != "sha") {
                return false;
              }
              return game.hasNature(cardx, "linked");
            });
            cards2 = cards2.map((i) => [i, get.effect(target2, i, player3, player3)]);
            cards2.sort((a, b) => b[1] - a[1]);
          } catch (e) {
            target2.classList.remove("linked");
            target2.classList.remove("linked2");
          }
          target2.classList.remove("linked");
          target2.classList.remove("linked2");
          const eff = cards2[0]?.[1];
          if (eff > 0) {
            return eff;
          }
          return Math.max(2 * get.effect(target2, { name: "draw" }, player3, player3) + 0.6 * get.effect(player3, { name: "draw" }, player3, player3), get.recoverEffect(target2, player3, player3));
        }
        return Math.max(2 * get.effect(target2, { name: "draw" }, player3, player3) + 0.6 * get.effect(player3, { name: "draw" }, player3, player3), get.recoverEffect(target2, player3, player3));
      }).set(
        "goon",
        player2.countCards("hs", (card) => {
          return get.name(card) == "jiu" && player2.hasUseTarget(card);
        }) && player2.countCards("hs", (card) => {
          if (get.name(card) != "sha") {
            return false;
          }
          return game.hasNature(card, "linked");
        })
      ).forResult();
      if (!result.bool) {
        return;
      }
      [target] = result.targets;
      event2.target = target;
      player2.logSkill("clanfangzhen", target);
      player2.addSkill("clanfangzhen_remove");
      player2.markAuto("clanfangzhen_remove", [target.getSeatNum()]);
      await target.link(true);
      const choices = ["选项一"];
      const choiceList = ["摸两张牌，然后交给" + get.translation(target) + "两张牌", "令" + get.translation(target) + "回复1点体力"];
      if (target.isDamaged()) {
        choices.push("选项二");
      } else {
        choiceList[1] = '<span style="opacity:0.5; ">' + choiceList[1] + "</span>";
      }
      result = await player2.chooseControl(choices).set("prompt", "放赈：请选择一项").set("choiceList", choiceList).set("ai", () => {
        const player3 = _status.event.player;
        const target2 = _status.event.getParent().target;
        if (!target2.isDamaged()) {
          return 0;
        }
        if (get.attitude(player3, target2) <= 0 && player3.countCards("he", (card) => get.value(card) < 0) >= 2) {
          return 0;
        }
        return 2 * get.effect(target2, { name: "draw" }, player3, player3) + 0.6 * get.effect(player3, { name: "draw" }, player3, player3) > get.recoverEffect(target2, player3, player3) ? 0 : 1;
      }).forResult();
      if (result.control == "选项一") {
        await player2.draw(2);
        if (player2 == target) {
          return;
        }
      } else {
        await target.recover();
        return;
      }
      if (!player2.countCards("he")) {
        return;
      }
      if (player2.countCards("he") <= 2) {
        result = {
          bool: true,
          cards: player2.getCards("he")
        };
      } else {
        result = await player2.chooseCard("放赈：交给" + get.translation(target) + "两张牌", "he", 2, true).forResult();
      }
      if (result.bool) {
        await player2.give(result.cards, target);
      }
    },
    ai: {
      expose: 0.2
    },
    subSkill: {
      remove: {
        audio: "clanfangzhen",
        trigger: { global: "roundStart" },
        onremove: true,
        forced: true,
        locked: false,
        charlotte: true,
        filter(event2, player2) {
          return player2.getStorage("clanfangzhen_remove").includes(game.roundNumber);
        },
        async content(event2, trigger, player2) {
          player2.removeSkills("clanfangzhen");
        }
      }
    }
  },
  clanliuju: {
    audio: 2,
    trigger: { player: "phaseUseEnd" },
    filter(event2, player2) {
      return game.hasPlayer((current) => player2.canCompare(current));
    },
    async cost(event2, trigger, player2) {
      event2.result = await player2.chooseTarget(get.prompt(event2.skill), "与一名其他角色拼点，输的角色可以使用任意张拼点牌中的非基本牌", (card, player3, target) => {
        return player3.canCompare(target);
      }).set("ai", (target) => {
        var player3 = _status.event.player;
        var ts = target.getCards("h").sort((a, b) => get.number(a) - get.number(b));
        if (get.attitude(player3, target) < 0) {
          var hs = player3.getCards("h").sort((a, b) => get.number(a) - get.number(b));
          if (!hs.length || !ts.length) {
            return 0;
          }
          if (get.type(hs[0], null, false) == "basic" && get.value(hs[0]) > 6) {
            return 0;
          }
          if (get.number(hs[0]) < get.number(ts[0]) || get.type(hs[0], null, false) == "basic") {
            return 1;
          }
          return Math.random() - 0.7;
        }
        return get.type(ts[0]) != "basic";
      }).forResult();
    },
    async content(event2, trigger, player2) {
      const { targets } = event2;
      const target = targets[0];
      event2.target = target;
      let result = await player2.chooseToCompare(target).set("small", true).forResult();
      if (result.tie) {
        return;
      }
      const loser = result.bool ? target : player2;
      event2.loser = loser;
      const distanceFromPlayer = get.distance(player2, target);
      const distanceFromTarget = get.distance(target, player2);
      event2.distance = [distanceFromPlayer, distanceFromTarget];
      const cards2 = [];
      game.getGlobalHistory("cardMove", (evt) => {
        if (evt.getParent(2).name === "chooseToCompare" && evt.getParent(3) === event2) {
          cards2.addArray(
            evt.cards.filter((i) => {
              return get.position(i, true) == "d" && get.type(i, null, false) != "basic";
            })
          );
        }
      });
      if (!cards2.length) {
        return;
      }
      event2.cards = cards2;
      let shouldCheckDistance = false;
      while (true) {
        const cardsx = cards2.filter((i) => get.position(i, true) == "d" && loser.hasUseTarget(i));
        if (!cardsx.length) {
          break;
        }
        shouldCheckDistance = true;
        result = await loser.chooseButton(["留驹：是否使用其中的一张牌？", cardsx]).set("filterButton", (button) => {
          return _status.event.player.hasUseTarget(button.link);
        }).set("ai", (button) => {
          return _status.event.player.getUseValue(button.link) + 0.1;
        }).forResult();
        if (!result.bool) {
          break;
        }
        const card = result.links[0];
        cards2.remove(card);
        loser.$gain2(card, false);
        await game.delayx();
        await loser.chooseUseTarget(true, card, false);
      }
      if (shouldCheckDistance && (get.distance(player2, target) != distanceFromPlayer || get.distance(target, player2) != distanceFromTarget)) {
        player2.restoreSkill("clanxumin");
        game.log(player2, "重置了", "#g【恤民】");
      }
    }
  },
  clanxumin: {
    audio: 2,
    audioname: ["clan_hanshao", "clan_hanrong", "clan_hanfu"],
    enable: "phaseUse",
    viewAs: { name: "wugu" },
    filterCard: true,
    filterTarget(card, player2, target) {
      if (player2 == target) {
        return false;
      }
      return player2.canUse(card, target);
    },
    selectTarget: [1, Infinity],
    check(card) {
      return 6 - get.value(card);
    },
    position: "he",
    limited: true,
    clanSkill: true,
    skillAnimation: true,
    animationColor: "soil",
    log: false,
    async precontent(event2, trigger, player2) {
      player2.logSkill("clanxumin");
      player2.awakenSkill("clanxumin");
    },
    ai: {
      order: 7,
      result: { target: 1 }
    }
  },
  //族韩融
  //我们连和！（？）
  clanlianhe: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event2, player2) {
      return game.hasPlayer((current) => !current.isLinked());
    },
    direct: true,
    async content(event2, trigger, player2) {
      let result;
      result = await player2.chooseTarget(get.prompt2("clanlianhe"), 2, (card, player3, target) => {
        return !target.isLinked();
      }).set("ai", (target) => {
        let att = get.attitude(_status.event.player, target);
        if (att > 0) {
          att /= 1.2;
        }
        return Math.abs(att);
      }).forResult();
      if (result.bool && result.targets?.length) {
        const targets = result.targets;
        await game.doAsyncInOrder(targets, (target) => target.link(true));
        player2.logSkill("clanlianhe", targets);
        player2.addSkill("clanlianhe_effect");
        player2.markAuto("clanlianhe_effect", targets);
      }
    },
    subSkill: {
      effect: {
        audio: "clanlianhe",
        trigger: { global: ["phaseUseEnd", "die"] },
        charlotte: true,
        forced: true,
        locked: false,
        popup: false,
        onremove: true,
        filter(event2, player2) {
          return player2.getStorage("clanlianhe_effect").includes(event2.player);
        },
        marktext: "连",
        intro: { content: "已选择目标：$" },
        async content(event2, trigger, player2) {
          player2.unmarkAuto("clanlianhe_effect", [trigger.player]);
          if (trigger.name == "die") {
            return;
          }
          if (trigger.player.hasHistory((evt) => {
            return evt.getParent().name == "draw" && evt.getParent("phaseUse") == trigger;
          })) {
            return;
          }
          player2.logSkill("clanlianhe_effect", trigger.player);
          let num = 0;
          trigger.player.getHistory("gain", (evt) => {
            if (evt.getParent("phaseUse") != trigger) {
              return false;
            }
            num += evt.cards.length;
            return false;
          });
          num = Math.min(num, 3);
          let result;
          if (num <= 1) {
            result = { bool: false };
          } else {
            const pos = player2 == trigger.player ? "e" : "he";
            result = await trigger.player.chooseCard(`连和：交给${get.translation(player2)}${get.cnNumber(num - 1)}张牌，或点“取消”令其摸${get.cnNumber(num + 1)}张牌`, num - 1, pos).set("ai", (card) => {
              if (get.event().draw) {
                return 0;
              }
              return 5 - get.value(card);
            }).set("draw", get.attitude(trigger.player, player2) >= 0).forResult();
          }
          if (result.bool) {
            await trigger.player.give(result.cards, player2);
          } else {
            await player2.draw(num + 1);
          }
        }
      }
    }
  },
  clanhuanjia: {
    audio: 2,
    trigger: { player: "phaseUseEnd" },
    filter(event2, player2) {
      return game.hasPlayer((current) => player2.canCompare(current));
    },
    direct: true,
    async content(event2, trigger, player2) {
      let result;
      let target;
      let winner;
      let cards2 = [];
      let card;
      result = await player2.chooseTarget(get.prompt("clanhuanjia"), "与一名其他角色拼点，赢的角色可以使用一张拼点牌。若此牌未造成过伤害，你获得另一张拼点牌，否则你失去一个技能", (card2, player3, target2) => {
        return player3.canCompare(target2);
      }).set("ai", (target2) => {
        const player3 = _status.event.player;
        if (get.attitude(player3, target2) <= 0) {
          const hs = player3.getCards("h").sort((a, b) => get.number(b) - get.number(a));
          const ts = target2.getCards("h").sort((a, b) => get.number(b) - get.number(a));
          if (!hs.length || !ts.length) {
            return 0;
          }
          if (get.number(hs[0]) > get.number(ts[0]) && !get.tag(hs[0], "damage") && player3.hasValueTarget(hs[0])) {
            return 1;
          }
          return Math.random() - 0.4;
        }
        return 0;
      }).forResult();
      if (!result.bool) {
        return;
      }
      [target] = result.targets;
      event2.target = target;
      player2.logSkill("clanhuanjia", target);
      result = await player2.chooseToCompare(target).forResult();
      if (result.tie) {
        return;
      }
      winner = result.bool ? player2 : target;
      event2.winner = winner;
      game.getGlobalHistory("cardMove", (evt) => {
        if (evt.getParent(3) == event2) {
          cards2.addArray(evt.cards.filterInD("d"));
        }
      });
      if (!cards2.length) {
        return;
      }
      event2.cards = cards2;
      const cardsx = cards2.filter((i) => get.position(i, true) == "d" && winner.hasUseTarget(i));
      if (cardsx.length) {
        result = await winner.chooseButton(["缓颊：是否使用其中的一张牌？", cardsx]).set("filterButton", (button) => {
          return _status.event.player.hasUseTarget(button.link);
        }).set("ai", (button) => {
          let damage = 1;
          if (_status.event.att > 2 && get.tag(button.link, "damage")) {
            damage *= 2;
          }
          return _status.event.player.getUseValue(button.link) * damage + 0.1;
        }).set("att", get.attitude(winner, player2)).forResult();
        if (result.bool) {
          [card] = result.links;
          event2.card = card;
          cards2.remove(card);
          winner.$gain2(card, false);
          await game.delayx();
          await winner.chooseUseTarget(true, card, false);
        }
      }
      if (game.hasPlayer2((current) => {
        return current.hasHistory("sourceDamage", (evt) => evt.cards && evt.cards[0] == card);
      })) {
        const skills2 = player2.getSkills(null, false, false).filter((skill) => {
          const info = get.info(skill);
          if (!info || get.is.empty(info) || info.charlotte) {
            return false;
          }
          return true;
        });
        result = await player2.chooseControl(skills2).set(
          "choiceList",
          skills2.map((i) => {
            return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player2, false) + "</div>";
          })
        ).set("displayIndex", false).set("prompt", "恤民：失去一个技能").set("ai", () => {
          let choices = _status.event.controls.slice();
          const value = (skill) => get.skillRank(skill, "in") + get.skillRank(skill, "out");
          choices = choices.map((skill) => [skill, value(skill)]);
          const list = choices.sort((a, b) => a[1] - b[1])[0];
          if (list[1] < 2) {
            return list[0];
          }
          if (_status.event.controls.includes("clanxumin")) {
            return "clanxumin";
          }
          return list[0];
        }).forResult();
        if (result.control) {
          await player2.removeSkills(result.control);
        }
      } else {
        await player2.gain(cards2, "gain2");
      }
    },
    ai: {
      expose: 0.1
    }
  },
  //族荀谌
  clansankuang: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    locked: true,
    filter(event2, player2) {
      if (!game.hasPlayer((current) => current != player2)) {
        return false;
      }
      const type = get.type2(event2.card);
      return player2.getRoundHistory("useCard", (evt) => get.type2(evt.card) == type).indexOf(event2) == 0;
    },
    getNum(player2) {
      return (player2.countCards("ej") > 0) + player2.isDamaged() + (Math.max(0, player2.hp) < player2.countCards("h"));
    },
    async cost(event2, trigger, player2) {
      const func = (event3, player3) => {
        const name = event3.skill;
        game.countPlayer((target) => {
          if (target != player3) {
            target.prompt(get.translation(name) + get.info(name).getNum(target));
          }
        });
      };
      if (event2.player == game.me) {
        func(event2, player2);
      } else if (event2.isOnline()) {
        player2.send(func, event2, player2);
      }
      const cards2 = trigger.cards.filterInD("oe");
      event2.result = await player2.chooseTarget("三恇：选择一名其他角色", "令其交给你至少X张牌" + (cards2.length ? "，然后其获得" + get.translation(cards2) : "") + "（X为以下条件中其满足的项数：场上有牌、已受伤、体力值小于手牌数）", true, lib.filter.notMe).set("ai", (target) => {
        const { player: player3, goon } = get.event();
        const att = get.attitude(player3, target), num = lib.skill.clansankuang.getNum(target);
        if (num == 0) {
          return att;
        }
        if (goon) {
          return -att;
        }
        return -Math.sqrt(Math.abs(att)) - lib.skill.clansankuang.getNum(target);
      }).set(
        "goon",
        Math.max.apply(
          Math,
          trigger.cards.map((i) => get.value(i))
        ) <= 5 || trigger.cards.filterInD("oe").length == 0
      ).forResult();
    },
    async content(event2, trigger, player2) {
      const {
        targets: [target]
      } = event2;
      const num = lib.skill.clansankuang.getNum(target), num2 = target.countCards("he");
      const cards2 = trigger.cards.filterInD("oe");
      const result = num2 == 0 ? { bool: false } : await target.chooseToGive(player2, "he", num > 0, [Math.min(num2, num), Infinity], "allowChooseAll").set("ai", get.unuseful).set("prompt", num > 0 ? "是否交给" + get.translation(player2) + "任意张牌" + (cards2.length ? "并获得" + get.translation(cards2) : "") + "？" : "交给" + get.translation(player2) + "至少" + get.cnNumber(num) + "张牌").forResult();
      if (!result?.bool || !result.cards?.length || !cards2.length) {
        return;
      }
      await game.delayx();
      if (trigger.cards.filterInD().length) {
        await target.gain(trigger.cards.filterInD(), "gain2", "bySelf");
      } else if (trigger.cards.filterInD("e").length) {
        await target.gain(trigger.cards.filterInD("e"), get.owner(trigger.cards.filterInD("e")[0]), "give");
      }
    },
    ai: {
      reverseOrder: true,
      skillTagFilter(player2) {
        if (player2.getHistory("useCard", (evt) => get.type(evt.card) == "equip").length > 0) {
          return false;
        }
      },
      effect: {
        target_use(card, player2, target) {
          if (player2 == target && get.type(card) == "equip" && !player2.getHistory("useCard", (evt) => get.type(evt.card) == "equip").length == 0) {
            return [1, 3];
          }
        }
      },
      threaten: 1.6
    }
  },
  clanbeishi: {
    audio: 2,
    trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
    forced: true,
    filter(event2, player2) {
      if (player2.isHealthy()) {
        return false;
      }
      const history = player2.getAllHistory("useSkill", (evt2) => evt2.skill == "clansankuang");
      if (!history.length) {
        return false;
      }
      const target = history[0].targets[0];
      if (target.countCards("h")) {
        return false;
      }
      const evt = event2.getl(target);
      return evt?.hs?.length;
    },
    async content(event2, trigger, player2) {
      await player2.recover();
    },
    ai: { combo: "clansankuang" }
  },
  //族荀淑
  clanshenjun: {
    audio: 2,
    trigger: { global: "useCard" },
    forced: true,
    locked: false,
    filter(event2, player2) {
      return (event2.card.name == "sha" || get.type(event2.card) == "trick") && player2.countCards("h", event2.card.name) > 0;
    },
    async content(event2, trigger, player2) {
      const cards2 = player2.getCards("h", trigger.card.name);
      await player2.showCards(cards2, get.translation(player2) + "发动了【神君】");
      player2.markSkill("clanshenjun");
      player2.addGaintag(cards2, "clanshenjun");
      for (const name of lib.phaseName) {
        const evt = _status.event.getParent(name);
        if (!evt || evt.name != name) {
          continue;
        }
        player2.addTempSkill("clanshenjun_viewAs", name + "After");
        break;
      }
    },
    marktext: "君",
    intro: {
      markcount(storage, player2) {
        return player2.countCards("h", (card) => card.hasGaintag("clanshenjun"));
      },
      mark(dialog, content, player2) {
        var cards2 = player2.getCards("h", (card) => card.hasGaintag("clanshenjun"));
        if (cards2.length) {
          dialog.addAuto(cards2);
        } else {
          return "无展示牌";
        }
      }
    },
    subSkill: {
      viewAs: {
        audio: "clanshenjun",
        trigger: { global: ["phaseZhunbeiEnd", "phaseJudgeEnd", "phaseDrawEnd", "phaseUseEnd", "phaseDiscardEnd", "phaseJieshuEnd"] },
        filter(event2, player2) {
          return player2.countCards("h", (card) => card.hasGaintag("clanshenjun")) > 0;
        },
        forced: true,
        charlotte: true,
        async content(event2, trigger, player2) {
          let result;
          const markedCards = player2.getCards("h", (card) => card.hasGaintag("clanshenjun"));
          const list = [];
          const names = [];
          for (const card of markedCards) {
            const name = get.name(card);
            const nature = get.nature(card);
            let namex = name;
            if (nature && nature.length) {
              namex += nature;
              if (names.includes(namex)) {
                continue;
              }
              list.push([get.type(card), "", name, nature]);
            } else {
              if (names.includes(namex)) {
                continue;
              }
              list.push([get.type(card), "", name]);
            }
            names.push(namex);
          }
          list.sort((a, b) => {
            const del1 = lib.inpile.indexOf(a[2]) - lib.inpile.indexOf(b[2]);
            if (del1 !== 0) {
              return del1;
            }
            let a1 = 0;
            let b1 = 0;
            if (a.length > 3) {
              a1 = lib.nature.get(a) || 0;
            }
            if (b.length > 3) {
              b1 = lib.nature.get(b) || 0;
            }
            return a1 - b1;
          });
          result = await player2.chooseButton(["是否将" + get.cnNumber(markedCards.length) + "张牌当下列一张牌使用？", [list, "vcard"]]).set("ai", (button) => {
            return get.event().player.getUseValue({
              name: button.link[2],
              nature: button.link[3]
            });
          }).forResult();
          if (result.bool) {
            const name = result.links[0][2];
            const nature = result.links[0][3];
            const cards2 = player2.getCards("h", (card) => card.hasGaintag("clanshenjun"));
            game.broadcastAll(
              (num, card) => {
                lib.skill.clanshenjun_backup.selectCard = num;
                lib.skill.clanshenjun_backup.viewAs = card;
              },
              cards2.length,
              { name, nature }
            );
            const next = player2.chooseToUse();
            next.set("openskilldialog", "将" + get.cnNumber(cards2.length) + "张牌当做" + (get.translation(nature) || "") + "【" + get.translation(name) + "】使用");
            next.set("norestore", true);
            next.set("addCount", false);
            next.set("_backupevent", "clanshenjun_backup");
            next.set("custom", {
              add: {},
              replace: { window() {
              } }
            });
            next.backup("clanshenjun_backup");
            await next;
          }
        }
      },
      backup: {
        filterCard(card) {
          return get.itemtype(card) == "card";
        },
        position: "hes",
        filterTarget: lib.filter.filterTarget,
        check: (card) => 6 - get.value(card),
        log: false
      }
    }
  },
  clanbalong: {
    audio: 2,
    trigger: {
      player: ["damageEnd", "recoverEnd", "loseHpEnd"]
    },
    forced: true,
    filter(event2, player2) {
      if (game.getGlobalHistory("changeHp", (evt) => evt.player == player2).length != 1) {
        return false;
      }
      var cards2 = player2.getCards("h"), map = {};
      if (!cards2.length) {
        return false;
      }
      for (var card of cards2) {
        var type = get.type2(card);
        if (typeof map[type] != "number") {
          map[type] = 0;
        }
        map[type]++;
      }
      var list = [];
      for (var i in map) {
        if (map[i] > 0) {
          list.push([i, map[i]]);
        }
      }
      list.sort((a, b) => b[1] - a[1]);
      return list[0][0] == "trick" && (list.length == 1 || list[0][1] > list[1][1]);
    },
    async content(event2, trigger, player2) {
      player2.showHandcards(get.translation(player2) + "发动了【八龙】");
      player2.drawTo(game.countPlayer());
    }
  },
  //族荀粲
  clanyunshen: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player2, target) {
      return player2 != target && target.isDamaged();
    },
    async content(event2, trigger, player2) {
      const { target } = event2;
      await target.recover();
      const name = get.translation(target);
      const card = new lib.element.VCard({ name: "sha", nature: "ice", isCard: true });
      const result = await player2.chooseControl().set("choiceList", [`${name}视为对你使用一张冰【杀】`, `你视为对${name}使用一张冰【杀】`]).set("prompt", "熨身：请选择一项").set("ai", () => _status.event.choice).set(
        "choice",
        (() => {
          const eff = get.effect(player2, card, target, player2);
          const eff2 = get.effect(target, card, player2, player2);
          return eff > eff2 ? "选项一" : "选项二";
        })()
      ).forResult();
      const players = result.control == "选项二" ? [player2, target] : [target, player2];
      if (players[0].canUse(card, players[1], false)) {
        await players[0].useCard(card, players[1], false, "noai");
      }
    },
    ai: {
      order: 10,
      expose: 0.2,
      result: {
        player(player2, target) {
          const card = new lib.element.VCard({ name: "sha", nature: "ice", isCard: true });
          let list = [];
          if (player2.canUse(card, target, false)) {
            list.push(get.effect(target, card, player2, player2));
          }
          if (target.canUse(card, player2, false)) {
            list.push(get.effect(player2, card, target, player2));
          }
          if (!list.length) {
            list.push(0);
          }
          return get.recoverEffect(target, player2, player2) + Math.max(...list);
        }
      }
    }
  },
  clanshangshen: {
    audio: 2,
    trigger: { global: "damageEnd" },
    filter(event2, player2) {
      if (!event2.hasNature() || !event2.player.isIn()) {
        return false;
      }
      return game.countPlayer2((current) => {
        return current.hasHistory("damage", (evt) => {
          return evt.hasNature() && evt != event2;
        });
      }) == 0;
    },
    logTarget: "player",
    check(event2, player2) {
      if (get.attitude(player2, event2.player) <= 2) {
        return false;
      }
      if (event2.player.countCards("h") >= 4) {
        return false;
      }
      return true;
    },
    async content(event2, trigger, player2) {
      await player2.executeDelayCardEffect("shandian");
      await trigger.player.drawTo(4);
    },
    ai: { expose: 0.25 }
  },
  clanfenchai: {
    audio: 2,
    init(player2) {
      if (player2.getStorage("clanfenchai").length > 0) {
        return;
      }
      var history = player2.getHistory("useSkill", (evt2) => {
        if (evt2.type != "player") {
          return false;
        }
        var skill = get.sourceSkillFor(evt2), targets2 = evt2.targets;
        var info = get.info(skill);
        if (!info || info.charlotte) {
          return false;
        }
        if (targets2 && targets2.length) {
          if (targets2.filter((i) => player2.differentSexFrom(i)).length > 0) {
            return true;
          }
        }
        return false;
      });
      if (history.length) {
        var evt = history[0], targets = evt.targets;
        player2.markAuto(
          "clanfenchai",
          targets.filter((i) => player2.differentSexFrom(i))
        );
      }
    },
    trigger: {
      player: ["logSkillBegin", "useSkill"]
    },
    forced: true,
    silent: true,
    onremove: true,
    marktext: "钗",
    intro: {
      content: (storage, player2) => "对象：" + get.translation(storage)
    },
    group: "clanfenchai_audio",
    filter(event2, player2) {
      if (event2.type != "player") {
        return false;
      }
      var targets = event2.targets;
      if (!targets || !targets.length) {
        return false;
      }
      var info = get.info(get.sourceSkillFor(event2));
      if (!info || info.charlotte) {
        return false;
      }
      if (player2.getStorage("clanfenchai").length != 0) {
        return false;
      }
      return targets.filter((i) => player2.differentSexFrom(i)).length > 0;
    },
    async content(event2, trigger, player2) {
      player2.markAuto(
        "clanfenchai",
        trigger.targets.filter((i) => player2.differentSexFrom(i))
      );
    },
    subSkill: {
      audio: {
        audio: "clanfenchai",
        forced: true,
        trigger: { player: "judge" },
        filter(event2, player2) {
          return player2.getStorage("clanfenchai").length;
        },
        async content(event2, trigger, player2) {
        }
      }
    },
    mod: {
      suit(card, suit) {
        var player2 = get.owner(card) || _status.event.player;
        if (!player2 || !player2.judging || player2.judging[0] != card) {
          return;
        }
        var storage = player2.getStorage("clanfenchai");
        if (!storage.length) {
          return;
        }
        return storage.filter((i) => i.isIn()).length > 0 ? "heart" : "spade";
      }
    }
  },
  //族荀采
  clanlieshi: {
    audio: 2,
    enable: "phaseUse",
    filter(event2, player2) {
      return !player2.isDisabledJudge() || player2.countCards("h", (card) => ["sha", "shan"].includes(get.name(card))) > 0;
    },
    chooseButton: {
      dialog(event2, player2) {
        var dialog = ui.create.dialog("烈誓：选择一项", "hidden");
        dialog.add([lib.skill.clanlieshi.choices.slice(), "textbutton"]);
        return dialog;
      },
      filter(button, player2) {
        var link = button.link;
        if (link == "damage") {
          return !player2.isDisabledJudge();
        }
        var num = player2.countCards("h", link);
        return num > 0 && num == player2.getDiscardableCards(player2, "h").filter((i) => get.name(i) == link).length;
      },
      check(button) {
        var player2 = _status.event.player;
        switch (button.link) {
          case "damage":
            if (get.damageEffect(player2, player2, player2, "fire") >= 0) {
              return 10;
            }
            if (player2.hp >= Math.max(2, 3 - player2.getFriends().length) && game.countPlayer((current) => get.attitude(player2, current) < 0 && current.countCards("h", (card) => ["sha", "shan"].includes(get.name(card))))) {
              return 0.8 + Math.random();
            }
            return 0;
          case "shan":
            if (player2.countCards("h", "shan") == 1) {
              return 8 + Math.random();
            }
            return 1 + Math.random();
          case "sha":
            if (player2.countCards("h", "sha") == 1) {
              return 8 + Math.random();
            }
            return 0.9 + Math.random();
        }
      },
      backup(links) {
        var next = get.copy(lib.skill["clanlieshi_backupx"]);
        next.choice = links[0];
        return next;
      },
      prompt(links) {
        if (links[0] == "damage") {
          return "废除判定区并受到1点火焰伤害";
        }
        return "弃置所有【" + get.translation(links[0]) + "】";
      }
    },
    choices: [
      ["damage", "废除判定区并受到1点火焰伤害"],
      ["shan", "弃置所有【闪】"],
      ["sha", "弃置所有【杀】"]
    ],
    ai: {
      order(item, player2) {
        if (!player2) {
          return;
        }
        var eff = get.damageEffect(player2, player2, player2, "fire"), disabled = !player2.isDisabledJudge();
        if ((player2.countCards("h", "sha") == 1 || player2.countCards("h", "shan") == 1) && eff < 0 && !disabled) {
          return 8;
        } else if (eff >= 0 && !disabled) {
          return 5.8;
        }
        if (!disabled && !player2.countCards("h", (card) => ["sha", "shan"].includes(get.name(card)))) {
          if ((!player2.hasSkill("clanhuanyin") || !player2.canSave(player2)) && player2.hp <= 1) {
            return 0;
          }
          if (player2.canSave(player2) && player2.hp == 1 && player2.countCards("h") <= 1) {
            return 2.6;
          }
          if (player2.hp < Math.max(2, 3 - player2.getFriends().length) || !game.countPlayer((current) => get.attitude(player2, current) < 0 && current.countCards("h", (card) => ["sha", "shan"].includes(get.name(card))))) {
            return 0;
          }
        }
        return 2.5;
      },
      expose: 0.2,
      result: { player: 1 }
    },
    subSkill: {
      backup: {},
      backupx: {
        audio: "clanlieshi",
        selectCard: -1,
        selectTarget: -1,
        filterCard: () => false,
        filterTarget: () => false,
        multitarget: true,
        async content(event2, trigger, player2) {
          const choice = lib.skill.clanlieshi_backup.choice;
          if (choice == "damage") {
            await player2.damage("fire");
            if (!player2.isDisabledJudge()) {
              player2.disableJudge();
            }
          } else {
            const cards2 = player2.getCards("h", choice);
            if (cards2.length) {
              await player2.discard(cards2);
            }
          }
          if (!player2.isIn() || !game.hasPlayer((current) => current != player2)) {
            return;
          }
          let result = await player2.chooseTarget("烈誓：令一名其他角色选择另一项", lib.filter.notMe, true).set("ai", (target2) => {
            const player3 = _status.event.player;
            const chosen = _status.event.getParent().choice;
            const att = get.attitude(player3, target2);
            if (chosen == "damage") {
              if (att > 0) {
                return 0;
              }
              return -att / 2 + target2.countCards("h", (card) => ["sha", "shan"].includes(get.name(card)));
            }
            return get.damageEffect(target2, player3, player3, "fire");
          }).set("choice", choice).forResult();
          if (!result.bool) {
            return;
          }
          const target = result.targets[0];
          player2.line(target, "fire");
          const list = [];
          let choiceList = lib.skill.clanlieshi.choices.slice();
          choiceList = choiceList.map((link, ind, arr) => {
            let text = link[1];
            let ok = true;
            if (arr[ind][0] == choice) {
              text += "（" + get.translation(player2) + "已选）";
              ok = false;
            }
            if (ind == 0) {
              if (target.isDisabledJudge()) {
                ok = false;
              }
            } else if (ind > 0) {
              const name = ind == 1 ? "shan" : "sha";
              if (!target.countCards("h", name)) {
                ok = false;
              }
            }
            if (!ok) {
              text = '<span style="opacity:0.5">' + text + "</span>";
            } else {
              list.push("选项" + get.cnNumber(ind + 1, true));
            }
            return text;
          });
          if (!list.length) {
            game.log(target, "没有能执行的选项");
            return;
          }
          result = await target.chooseControl(list).set("choiceList", choiceList).set("ai", () => {
            const controls = _status.event.controls.slice();
            const player3 = _status.event.player;
            const user = _status.event.getParent().player;
            if (controls.length == 1) {
              return controls[0];
            }
            if (controls.includes("选项一") && get.damageEffect(player3, user, player3, "fire") >= 0) {
              return "选项一";
            }
            if (controls.includes("选项一") && player3.hp <= 2 && player3.countCards("h", (card) => ["sha", "shan"].includes(get.name(card))) <= 3) {
              controls.remove("选项一");
            }
            if (controls.length == 1) {
              return controls[0];
            }
            if (player3.getCards("h", "sha").reduce((p, c) => p + get.value(c, player3), 0) > player3.getCards("h", "sha").reduce((p, c) => p + get.value(c, player3), 0)) {
              if (controls.includes("选项三")) {
                return "选项三";
              }
            } else if (controls.includes("选项二")) {
              return "选项二";
            }
            return controls.randomGet();
          }).forResult();
          if (result.control == "选项一") {
            if (!target.isDisabledJudge()) {
              target.disableJudge();
            }
            await target.damage("fire");
          } else {
            const cards2 = target.getCards("h", result.control == "选项二" ? "shan" : "sha");
            if (cards2.length) {
              await target.discard(cards2);
            }
          }
        }
      }
    }
  },
  clandianzhan: {
    audio: 2,
    intro: {
      content: "已使用过的花色：$",
      onunmark: true
    },
    trigger: { player: "useCardAfter" },
    forced: true,
    filter(event2, player2) {
      if (!lib.suit.includes(get.suit(event2.card))) {
        return false;
      }
      const suit = get.suit(event2.card);
      if (player2.getRoundHistory("useCard", (evt) => get.suit(evt.card) == suit).indexOf(event2) != 0) {
        return false;
      }
      return event2.targets && event2.targets.length == 1 && !event2.targets[0].isLinked() || player2.hasCard((card) => get.suit(card) == get.suit(event2.card) && player2.canRecast(card), "h");
    },
    async content(event2, trigger, player2) {
      let linked = false;
      let recasted = false;
      if (trigger.targets && trigger.targets.length === 1 && !trigger.targets[0].isLinked()) {
        await trigger.targets[0].link(true);
        linked = true;
      }
      const cards2 = player2.getCards("h", (card) => get.suit(card) === get.suit(trigger.card) && player2.canRecast(card));
      if (cards2.length > 0) {
        await player2.recast(cards2);
        recasted = true;
      }
      if (linked && recasted) {
        await player2.draw();
      }
    },
    group: "clandianzhan_count",
    subSkill: {
      count: {
        charlotte: true,
        trigger: { player: "useCardAfter" },
        filter(event2, player2) {
          let suit = get.suit(event2.card);
          return lib.suits.includes(suit) && !player2.getStorage("clandianzhan").includes(suit);
        },
        forced: true,
        silent: true,
        async content(event2, trigger, player2) {
          const suits = player2.getRoundHistory("useCard", (evt) => {
            return lib.suits.includes(get.suit(evt.card));
          }).reduce((list, evt) => {
            return list.add(get.suit(evt.card));
          }, []).sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
          if (!player2.storage.clandianzhan) {
            player2.when({ global: "roundStart" }).step(async () => {
              delete player2.storage.clandianzhan;
              player2.unmarkSkill("clandianzhan");
            });
          }
          player2.storage.clandianzhan = suits;
          player2.markSkill("clandianzhan");
        }
      }
    },
    init(player2) {
      let suits = player2.getRoundHistory("useCard", (evt) => {
        return lib.suits.includes(get.suit(evt.card));
      }).reduce((list, evt) => {
        return list.add(get.suit(evt.card));
      }, []).sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
      if (suits.length) {
        if (!player2.storage.clandianzhan) {
          player2.when({ global: "roundStart" }).step(async () => {
            delete player2.storage.clandianzhan;
            player2.unmarkSkill("clandianzhan");
          });
        }
        player2.storage.clandianzhan = suits;
        player2.markSkill("clandianzhan");
      }
    }
  },
  clanhuanyin: {
    audio: 2,
    trigger: { player: "dying" },
    forced: true,
    check: () => true,
    filter(event2) {
      return event2.player.countCards("h") < 4;
    },
    async content(event2, trigger, player2) {
      await player2.drawTo(4);
    }
  },
  clandaojie: {
    audio: 2,
    audioname: ["clan_xunshu", "clan_xunchen", "clan_xuncai", "clan_xuncan", "clan_xunyou", "clan_xunyu", "clan_xunshuang", "clan_xunshi"],
    trigger: { player: "useCardAfter" },
    filter(event2, player2) {
      return get.type(event2.card, null, false) == "trick" && !get.tag(event2.card, "damage") && event2.cards.filterInD().length > 0 && player2.getHistory("useCard", (evt) => {
        return get.type(evt.card, null, false) == "trick" && !get.tag(evt.card, "damage");
      }).indexOf(event2) == 0;
    },
    forced: true,
    clanSkill: true,
    async content(event2, trigger, player2) {
      const skills2 = player2.getSkills(null, false, false).filter((skill) => {
        let info = get.info(skill);
        if (!info || info.charlotte || !get.is.locked(skill) || get.skillInfoTranslation(skill, player2).length == 0) {
          return false;
        }
        return true;
      });
      let result;
      if (!skills2.length) {
        result = { bool: false };
      } else {
        result = await player2.chooseButton(["蹈节：失去一个锁定技，或点“取消”失去1点体力", [skills2, "skill"]]).set("displayIndex", false).set("ai", (button) => {
          const player3 = get.player();
          const skills3 = get.event().listx.slice();
          skills3.removeArray(["clanbaichu"]);
          const { link } = button;
          if (!skills3.includes(link)) {
            return 0;
          }
          const info = get.info(link);
          if (info?.ai?.neg || info?.ai?.halfneg) {
            return 3;
          }
          if (get.effect(player3, { name: "losehp" }, player3, player3) >= 0 || player3.hp > 3 || player3.countCards("hs", (card) => player3.canSaveCard(card, player3))) {
            return 0;
          }
          if (Math.random() < 0.75 && link == "clandaojie") {
            if (player3.hasSkill("clanbaichu")) return 0;
            return 2;
          } else if (get.event().removeSkillCheck) {
            return 100 - get.skillRank(link);
          }
          return 0;
        }).set("listx", skills2).set("removeSkillCheck", player2.hp < 2 && !player2.countCards("hs", (card) => get.tag(card, "save"))).forResult();
      }
      if (result?.bool && result?.links?.length) {
        await player2.removeSkills(result.links);
      } else {
        await player2.loseHp();
      }
      const targets = game.filterPlayer((current) => current == player2 || current.hasClan("颍川荀氏"));
      if (!targets.length || !trigger.cards.someInD()) {
        return;
      }
      result = targets.length == 1 ? { bool: true, targets } : await player2.chooseTarget("蹈节：将" + get.translation(trigger.cards.filterInD()) + "交给一名颍川荀氏角色", true, (card, player3, target) => {
        return target == player3 || target.hasClan("颍川荀氏");
      }).set("ai", (target) => get.attitude(get.player(), target)).forResult();
      if (result?.bool && result?.targets?.length) {
        const target = result.targets[0];
        player2.line(target, "green");
        if (trigger.cards.someInD()) {
          await target.gain(trigger.cards.filterInD(), player2, "gain2");
        }
      }
    }
  },
  //族吴班
  clanzhanding: {
    audio: 2,
    enable: "chooseToUse",
    viewAsFilter(player2) {
      return player2.countCards("hes") > 0;
    },
    viewAs: { name: "sha" },
    filterCard: true,
    position: "hes",
    selectCard: [1, Infinity],
    check(card) {
      return 6 - ui.selected.cards.length - get.value(card);
    },
    allowChooseAll: true,
    onuse(links, player2) {
      lib.skill.chenliuwushi.change(player2, -1);
      player2.addTempSkill("clanzhanding_effect");
    },
    ai: {
      order: 1,
      respondSha: true,
      skillTagFilter(player2) {
        return player2.countCards("hes") > 0;
      }
    },
    subSkill: {
      effect: {
        trigger: { player: "useCardAfter" },
        forced: true,
        popup: false,
        filter(event2, player2) {
          return event2.skill == "clanzhanding";
        },
        async content(event2, trigger, player2) {
          if (player2.hasHistory("sourceDamage", (evt) => {
            return evt.card == trigger.card;
          })) {
            const num1 = player2.countCards("h");
            const num2 = player2.getHandcardLimit();
            if (num1 < num2) {
              await player2.draw({ num: num2 - num1 });
            }
          } else if (trigger.addCount !== false) {
            trigger.addCount = false;
            const stat = player2.getStat().card;
            const name = trigger.card.name;
            if (typeof stat[name] == "number") {
              stat[name]--;
            }
          }
        }
      }
    }
  },
  //族吴苋
  clanyirong: {
    audio: 2,
    enable: "phaseUse",
    usable: 2,
    filter(event2, player2) {
      var num1 = player2.countCards("h"), num2 = player2.getHandcardLimit();
      return num1 != num2;
    },
    selectCard() {
      var player2 = _status.event.player;
      var num1 = player2.countCards("h"), num2 = player2.getHandcardLimit();
      if (num1 > num2) {
        return num1 - num2;
      }
      return [0, 1];
    },
    filterCard(card, player2) {
      var num1 = player2.countCards("h"), num2 = player2.getHandcardLimit();
      return num1 > num2;
    },
    check(card) {
      var player2 = _status.event.player;
      if (player2.countCards("h", function(card2) {
        return lib.skill.clanyirong.checkx(card2) > 0;
      }) + 1 < player2.countCards("h") - player2.getHandcardLimit()) {
        return 0;
      }
      return lib.skill.clanyirong.checkx(card);
    },
    checkx(card) {
      var num = 1;
      if (_status.event.player.getUseValue(card, null, true) <= 0) {
        num = 1.5;
      }
      return (15 - get.value(card)) * num;
    },
    prompt() {
      var player2 = _status.event.player;
      var num1 = player2.countCards("h"), num2 = player2.getHandcardLimit();
      var str = '<span class="text center">';
      if (num1 > num2) {
        str += "弃置" + get.cnNumber(num1 - num2) + "张牌，然后手牌上限+1。";
      } else {
        str += "摸" + get.cnNumber(num2 - num1) + "张牌，然后手牌上限-1。";
      }
      str += "<br>※当前手牌上限：" + num2;
      var num3 = (_status.event.getParent().phaseIndex || 0) + 1;
      if (num3 > 0) {
        str += "；阶段数：" + num3;
      }
      str += "</span>";
      return str;
    },
    async content(event2, trigger, player2) {
      const { cards: cards2 } = event2;
      if (cards2.length) {
        lib.skill.chenliuwushi.change(player2, 1);
        return;
      }
      const num1 = player2.countCards("h");
      const num2 = player2.getHandcardLimit();
      if (num1 < num2) {
        await player2.draw(num2 - num1);
      }
      lib.skill.chenliuwushi.change(player2, -1);
    },
    ai: {
      order(item, player2) {
        var num = player2.getHandcardLimit(), numx = (_status.event.getParent().phaseIndex || 0) + 1;
        if (num == 5 && numx == 4 && player2.getStat("skill").clanyirong) {
          return 0;
        }
        if (player2.countCards("h") == num + 1 && num != 2 && (num <= 4 || num > 4 && numx > 4)) {
          return 10;
        }
        return 0.5;
      },
      result: { player: 1 },
      threaten: 5
    }
  },
  clanguixiang: {
    audio: 2,
    trigger: { player: "phaseChange" },
    forced: true,
    filter(event2, player2) {
      if (event2.phaseList[event2.num].startsWith("phaseUse")) {
        return false;
      }
      const num1 = player2.getHandcardLimit() - 1, num2 = event2.num - player2.getHistory("skipped").length;
      return num1 == num2;
    },
    async content(event2, trigger, player2) {
      trigger.phaseList[trigger.num] = `phaseUse|${event2.name}`;
      await game.delayx();
    }
  },
  clanmuyin: {
    audio: 2,
    clanSkill: true,
    audioname: ["clan_wuxian", "clan_wuban", "clan_wukuang", "clan_wuqiao"],
    trigger: { player: "phaseBegin" },
    isMax(player2) {
      var num = player2.getHandcardLimit();
      return !game.hasPlayer(function(current) {
        return current != player2 && current.getHandcardLimit() > num;
      });
    },
    filter(event2, player2) {
      return game.hasPlayer(function(current) {
        return (current == player2 || current.hasClan("陈留吴氏")) && !lib.skill.clanmuyin.isMax(current);
      });
    },
    direct: true,
    async content(event2, trigger, player2) {
      const result = await player2.chooseTarget(get.prompt("clanmuyin"), "令一名陈留吴氏角色的手牌上限+1", (card, player3, current) => {
        return (current == player3 || current.hasClan("陈留吴氏")) && !lib.skill.clanmuyin.isMax(current);
      }).set("ai", (target) => {
        return get.attitude(_status.event.player, target);
      }).forResult();
      if (result.bool) {
        const target = result.targets[0];
        player2.logSkill("clanmuyin", target);
        lib.skill.chenliuwushi.change(target, 1);
        await game.delayx();
      }
    }
  },
  chenliuwushi: {
    charlotte: true,
    change(player2, num) {
      player2.addSkill("chenliuwushi");
      var info = player2.storage;
      if (typeof info.chenliuwushi != "number") {
        info.chenliuwushi = 0;
      }
      info.chenliuwushi += num;
      if (info.chenliuwushi == 0) {
        player2.unmarkSkill("chenliuwushi");
      } else {
        player2.markSkill("chenliuwushi");
      }
      if (num >= 0) {
        game.log(player2, "的手牌上限", "#y+" + num);
      } else {
        game.log(player2, "的手牌上限", "#g" + num);
      }
    },
    mod: {
      maxHandcard(player2, num) {
        var add = player2.storage.chenliuwushi;
        if (typeof add == "number") {
          return num + add;
        }
      }
    },
    markimage: "image/card/handcard.png",
    intro: {
      content(num, player2) {
        var str = "<li>手牌上限";
        if (num >= 0) {
          str += "+";
        }
        str += num;
        str += "<br><li>当前手牌上限：";
        str += player2.getHandcardLimit();
        return str;
      }
    }
  }
};
const translates = {
  clan_wuxian_prefix: "族",
  clan_wuban_prefix: "族",
  clan_xunshu_prefix: "族",
  clan_xunchen_prefix: "族",
  clan_xuncai_prefix: "族",
  clan_xuncan_prefix: "族",
  clan_hanshao_prefix: "族",
  clan_hanrong_prefix: "族",
  clan_wukuang_prefix: "族",
  clan_wangling_prefix: "族",
  clan_zhongyan_prefix: "族",
  clan_wangyun_prefix: "族",
  clan_wanghun_prefix: "族",
  clan_zhonghui_prefix: "族",
  clan_zhongyu_prefix: "族",
  clan_wanglun_prefix: "族",
  clan_xunyou_prefix: "族",
  clan_wuqiao_prefix: "族",
  clan_wangshen_prefix: "族",
  clan_wangshen: "族王沈",
  clananran: "岸然",
  clananran_info: "出牌阶段开始时或当你受到伤害后，你可以选择一项：①摸X张牌；②令至多X名角色各摸一张牌。以此法获得牌的角色本回合使用的下一张牌不能为这些牌。（X为此技能发动次数且至多为4）",
  clangaobian: "告变",
  clangaobian_info: "锁定技，其他角色的回合结束时，若本回合仅有一名角色受伤，则令其选择一项：①使用本回合进入弃牌堆的一张【杀】；②失去1点体力。",
  clan_wuxian: "族吴苋",
  clanyirong: "移荣",
  clanyirong_info: "出牌阶段限两次。若你的手牌数：小于X，则你可以将手牌摸至X张，然后X-1；大于X，则你可以将手牌弃置至X张，然后X+1。（X为你的手牌上限）",
  clanguixiang: "贵相",
  clanguixiang_info: "锁定技。你本回合的第X个阶段开始前（X为你的手牌上限），若此阶段不为出牌阶段，则你终止此阶段，改为进行一个出牌阶段。",
  clanmuyin: "穆荫",
  clanmuyin_info: "宗族技。回合开始时，你可以选择一名手牌上限不为全场最多的陈留吴氏角色。该角色的手牌上限+1。",
  chenliuwushi: "陈留·吴氏",
  clan_wuban: "族吴班",
  clanzhanding: "斩钉",
  clanzhanding_info: "你可以将任意张牌当做【杀】使用并你令你的手牌上限-1。你以此法使用的【杀】结算结束后，若你因此【杀】造成过伤害，则你将手牌摸至手牌上限，否则你令此【杀】不计入次数限制。",
  clan_xunshu: "族荀淑",
  clanshenjun: "神君",
  clanshenjun_info: "当一名角色使用【杀】或普通锦囊牌时，若你手牌中有该牌名的牌，你展示之，且这些牌称为“神君”。然后本阶段结束时，你可以将等同于你“神君”数张牌当做一张“神君”牌使用。",
  clanbalong: "八龙",
  clanbalong_info: "锁定技。当你于一回合内首次{回复体力后或受到伤害后或失去体力后}，若你手牌中唯一最多的类别为锦囊牌，你展示所有手牌并摸至角色数张。",
  clandaojie: "蹈节",
  clandaojie_info: "宗族技，锁定技。当你每回合第一次使用非伤害类普通锦囊牌后，你须失去一个锁定技或失去1点体力，令一名颍川荀氏角色获得此牌对应的所有实体牌。",
  clan_xuncai: "族荀采",
  clanlieshi: "烈誓",
  clanlieshi_info: "出牌阶段，你可以选择一项：1.废除判定区并受到你造成的1点火焰伤害；2.弃置所有【闪】；3.弃置所有【杀】。然后令一名其他角色从你未选择的选项中选择一项。",
  clandianzhan: "点盏",
  clandianzhan_info: "锁定技。当你每轮第一次使用一种花色的牌后：若此牌的目标数为1且目标未横置，你横置此牌目标；若你有此花色的手牌，你重铸这些牌。均执行后你摸一张牌。",
  clanhuanyin: "还阴",
  clanhuanyin_info: "锁定技。当你进入濒死状态时，将手牌补至四张。",
  clan_xunchen: "族荀谌",
  clansankuang: "三恇",
  clansankuang_info: "锁定技。当你每轮第一次使用一种类别的牌后，你令一名其他角色交给你至少X张牌，然后于装备区或处理区内获得你使用的牌对应的所有实体牌（X为以下条件中其满足的项数：场上有牌、已受伤、体力值小于手牌数）。",
  clanbeishi: "卑势",
  clanbeishi_info: "锁定技。当一名角色失去最后的手牌后，若其是你首次发动〖三恇〗的目标角色，你回复1点体力。",
  clan_xuncan: "族荀粲",
  clanyunshen: "熨身",
  clanyunshen_info: "出牌阶段限一次。你可以令一名其他角色回复1点体力，然后选择一项：1.你视为对其使用一张冰【杀】；2.其视为对你使用一张冰【杀】。",
  clanshangshen: "伤神",
  clanshangshen_info: "当一名角色受到属性伤害后，若本回合此前没有角色或已死亡的角色受到过属性伤害，你可以执行目标角色为你的【闪电】效果，然后其将手牌摸至四张。",
  clanfenchai: "分钗",
  clanfenchai_info: "锁定技。若你首次发动技能指定的异性目标角色中：存在存活角色，你的判定牌视为♥；不存在存活角色，你的判定牌视为♠。",
  clan_hanshao: "族韩韶",
  clanfangzhen: "放赈",
  clanfangzhen_info: "出牌阶段开始时，你可以横置一名角色并选择一项：1.摸两张牌，然后交给其两张牌；2.令其回复1点体力。然后第X轮游戏开始时，你失去〖放赈〗（X为其座位号）。",
  clanliuju: "留驹",
  clanliuju_info: "出牌阶段结束时，你可以与一名角色A拼点，输的角色可以使用任意张拼点牌中的非基本牌。然后若你至A的距离或A至你的距离发生了变化，你重置〖恤民〗。",
  clanxumin: "恤民",
  clanxumin_info: "宗族技，限定技。你可以将一张牌当做【五谷丰登】对任意名其他角色使用。",
  clan_hanrong: "族韩融",
  clanlianhe: "连和",
  clanlianhe_info: "出牌阶段开始时，你可以横置两名角色。这些角色于自己的下个出牌阶段结束时，若其此阶段未摸牌，其令你摸X+1张牌或交给你X-1张牌（X为其此阶段获得的牌数且至多为3）。",
  clanhuanjia: "缓颊",
  clanhuanjia_info: "出牌阶段结束时，你可以与一名角色拼点。赢的角色可以使用一张拼点牌。然后若此牌：未造成过伤害，你获得另一张拼点牌；造成过伤害，你失去一个技能。",
  clan_wukuang: "族吴匡",
  clanlianzhu: "联诛",
  clanlianzhu_info: "转换技。每名角色Ａ的出牌阶段限一次。阳：Ａ可以重铸一张牌，然后你可以重铸一张牌。若这两张牌颜色相同，则你的手牌上限+1；阴：Ａ可以令你选择一名在你或Ａ攻击范围内的另一名其他角色Ｂ，然后Ａ和你可依次选择是否对Ｂ使用一张【杀】。若这两张【杀】颜色不同，则你的手牌上限-1。",
  clan_wangling: "族王凌",
  clanbolong: "驳龙",
  clanbolong_info: "出牌阶段限一次。你可以令一名其他角色选择一项：1.你交给其一张牌，然后视为对其使用一张雷【杀】；2.交给你等同于你手牌数的牌，然后视为对你使用一张【酒】。",
  clanzhongliu: "中流",
  clanzhongliu_info: "宗族技，锁定技。当你使用牌时，若此牌对应的实体牌均不为太原王氏角色的手牌，你重置武将牌上的技能。",
  clan_zhongyan: "族钟琰",
  clanguangu: "观骨",
  clanguangu_info: "转换技，出牌阶段限一次。阳：你可以观看牌堆顶的至多四张牌；阴：你可以观看一名角色的至多四张手牌。然后你可以使用其中的一张牌。",
  clanxiaoyong: "啸咏",
  clanxiaoyong_info: "锁定技。当你于回合内首次使用字数为X的牌时，你重置〖观骨〗（X为你上次发动〖观骨〗观看的牌数）。",
  clanbaozu: "保族",
  clanbaozu_info: "宗族技，限定技。当一名颍川钟氏角色进入濒死状态时，你可以令其横置并回复1点体力。",
  clan_wangyun: "族王允",
  clanjiexuan: "解悬",
  clanjiexuan_info: "限定技，转换技。阳：你可以将一张红色牌当【顺手牵羊】使用；阴：你可以将一张黑色牌当【过河拆桥】使用。",
  clanmingjie: "铭戒",
  clanmingjie_info: "限定技。出牌阶段，你可以选择一名角色，然后你获得此下效果：①你使用牌时你可以指定其为额外目标直到其下个回合结束。②其下个回合结束时，你可以使用本回合使用过的黑桃牌和被抵消过的牌。",
  clan_wanghun: "族王浑",
  clanfuxun: "抚循",
  clanfuxun_info: "出牌阶段限一次。你可以获得或交给一名其他角色一张手牌，然后若其手牌数与你相等且于此阶段仅以此法获得或失去过牌，你可以将一张牌当任意基本牌使用。",
  clanchenya: "沉雅",
  clanchenya_info: "当一名角色发动“出牌阶段限一次”的技能后，你可以令其重铸任意张牌名字数为X的牌（X为其手牌数）。",
  clan_zhonghui: "族钟会",
  clanyuzhi: "迂志",
  clanyuzhi_info: "锁定技。①每轮开始时，你展示一张手牌，然后摸X张牌（X为此牌牌名字数）。②每轮结束时，你弃置本轮因〖迂志〗展示的手牌，然后若你本轮使用的牌数或你上一轮因〖迂志〗摸的牌数小于你本轮因〖迂志〗摸的牌数，你受到1点雷属性伤害或失去〖保族〗。",
  clanxieshu: "挟术",
  clanxieshu_info: "当你因牌造成或受到伤害后，你可以横置武将牌并弃置Y张牌，然后摸你已损失体力值张牌（Y为此牌牌名字数）。若本回合有角色进入过濒死状态，则〖挟术〗于本回合失效。",
  clan_zhongyu: "族钟毓",
  clanjiejian: "捷谏",
  clanjiejian_info: "当你于一回合使用第X张牌指定第一个目标后，若此牌不为装备牌，则你可以令一名目标角色摸X张牌。（X为此牌牌名字数）",
  clanhuanghan: "惶汗",
  clanhuanghan_info: "当你受到牌造成的伤害后，你可以摸X张牌并弃置Y张牌（X为此牌牌名字数，Y为你已损失的体力值），然后若此次技能发动不为你本回合首次发动此技能，你重置技能〖保族〗。",
  clan_wanglun: "族王沦",
  clanqiuxin: "求心",
  clanqiuxin_info: "出牌阶段限一次，你可以令一名其他角色选择一项：当你对其使用的下一张〔1.【杀】；2.普通锦囊牌〕结算结束后，你视为对其使用一张〔1.普通锦囊牌；2.【杀】〕。",
  clanjianyuan: "简远",
  clanjianyuan_info: "当一名角色发动“出牌阶段限一次”的技能后，你可以令其重铸任意张牌名字数为X的牌（X为其本阶段的使用牌数）。",
  clan_xunyou: "族荀攸",
  clanbaichu: "百出",
  clanbaichu_new: "新组合",
  clanbaichu_trick: "已记录",
  clanbaichu_info: `锁定技，当你使用一张牌结算完毕后，若你：未记录过此牌的花色和类型组合，则你记录此组合并记录一个普通锦囊牌名，否则你于本轮获得技能${get.poptip("qice")}；已记录此牌牌名，你回复1点体力或摸一张牌。`,
  clan_wuqiao: "族吴乔",
  clanqiajue: "跒倔",
  clanqiajue_info: "摸牌阶段开始时，你可以弃置一张黑色牌。若如此做，此阶段结束时，你展示手牌，若这些牌的点数和大于30，你的手牌上限-2，否则你执行一个额外的摸牌阶段。",
  clan_wangguang: "族王广",
  clan_wangguang_prefix: "族",
  clanlilun: "离论",
  clanlilun_info: "出牌阶段限一次，你可以重铸两张牌名相同的牌（不能是你本回合以此法重铸过的牌名的牌），然后使用其中的一张牌。",
  clanjianji: "见机",
  clanjianji_info: "限定技，一名角色的结束阶段，若其上下家均未于本回合：使用过牌，则你可以与其各摸一张牌；成为过牌的目标，则你可以视为使用一张【杀】。",
  clan_wangmingshan: "族王明山",
  clan_wangmingshan_prefix: "族",
  clantanque: "弹雀",
  clantanque_info: "每回合限一次。当你使用牌结算结束后，你可以对一名体力值或手牌数为X且不为0的角色造成1点伤害（X为此牌点数与你上一张使用的牌的点数之差）。",
  clanshengmo: "剩墨",
  clanshengmo_info: "每轮限一次，当你需要使用基本牌时，你可以获得一张于本回合进入弃牌堆的牌（每种点数限一次），然后若此牌点数不为这些牌中最大且不为这些牌中最小，你视为使用未以此法使用过的基本牌。",
  clan_zhongyao: "族钟繇",
  clan_zhongyao_prefix: "族",
  clanchengqi: "承启",
  clanchengqi_info: "你可以将至少两张手牌当作本回合未使用过的基本牌或普通锦囊牌使用，且你以此法转化的牌名字数须不大于以此法转化的所有实体牌牌名字数之和，若你以此法转化的牌名字数等于以此法转化的所有实体牌牌名字数之和，则你使用此牌时可以令一名角色摸一张牌。",
  clanjieli: "诫厉",
  clanjieli_info: "结束阶段，你可以选择一名角色，你观看其手牌中牌名字数最多的牌和牌堆顶的X张牌，然后你可以交换其中的任意张牌（X为你本回合使用过的牌中的牌名字数最大值）。",
  clan_wangchang: "族王昶",
  clan_wangchang_prefix: "族",
  clankaiji: "开济",
  clankaiji_info: "出牌阶段限一次。你可以令一名本轮未以此法选择过的角色弃置你一张手牌，然后你可以使用位于弃牌堆的此牌，若如此做，你摸一张牌。",
  clan_wuyi: "族吴懿",
  clan_wuyi_prefix: "族",
  clangaojin: "高劲",
  clangaojin_info: "当你于一回合内使用第X张牌时(X为你的手牌上限)，你可令你本回合使用的下一张牌无距离和次数限制，然后你可以选择至多两项：1.手牌上限-1；2.摸体力值数张牌；3.手牌上限+1；若选项相邻，你弃置×张牌。",
  old_clangaojin: "高劲",
  old_clangaojin_info: "锁定技，游戏开始时你计算与其他角色的距离-X，当你计算与其他角色的距离发生变化后，你摸一张牌（X为你的手牌上限）。",
  old_clangaojin_append: `<span style="font-family: yuanli"><li><span style="text-decoration: line-through;">补丁×</span>注意事项：<br>真正意义上的距离变化后时机在无名杀现有框架无法实现，请不要反馈在某些情况距离变化后此技能不发动的问题。</span>`,
  clanpoxi: "破袭",
  clanpoxi_info: "出牌阶段限一次，你可以弃置距离不大于1的一名角色的一张牌，若弃置的牌为装备牌/基本牌，则你可以将此牌当做【杀】使用，且可令目标角色不能响应此【杀】，若以此法造成伤害则你计算与其他角色的距离+1。",
  clan_yangci: "族杨赐",
  clan_yangci_prefix: "族",
  clanqieyi: "切议",
  clanqieyi_info: "出牌阶段开始时，你可观看牌堆顶两张牌。若如此做，本回合你使用每个花色的第一张牌结算完成后，展示牌堆顶的一张牌，若这两张牌颜色或类别：相同，你获得展示牌；均不同，你将一张牌置于牌堆顶。",
  clanjianzhi: "谏直",
  clanjianzhi_info: "锁定技，结束阶段，你进行至多X次判定（X为你本回合〖切议〗的发动次数）。你将与你本回合使用过的花色相同的判定牌分配给任意角色；若判定牌中有你本回合未使用过的花色，你受到1点无来源雷电伤害。",
  clanquhuo: "去惑",
  clanquhuo_info: "宗族技，你每回合不因使用、打出或弃置而首次失去手牌中的【酒】或装备牌后，你可以令一名弘农杨氏角色回复1点体力。",
  clan_yangxiu: "族杨修",
  clan_yangxiu_prefix: "族",
  clanjiewu: "捷悟",
  clanjiewu_info: "出牌阶段开始时，你可以令一名角色的手牌此阶段始终对你可见。然后你此阶段使用牌指定其他角色为目标后，你可以展示「捷悟」角色一张手牌，若：两张牌花色相同，你摸一张牌，若此牌本回合以此法展示过的次数大于1，你将你与其之中手牌较多的角色一张牌置于牌堆顶。",
  clangaoshi: "高视",
  clangaoshi_info: "结束阶段，你可以依次亮出牌堆顶的牌，直到你亮出了你本回合使用过的牌名，或亮出了至少X张牌（X为本回合你发动〖捷悟〗的次数），然后你可以使用亮出的牌，若你因此使用了所有亮出牌，你摸两张牌。",
  clan_xunshuang: "族荀爽",
  clan_xunshuang_prefix: "族",
  clanyangji: "佯疾",
  clanyangji_info: "准备阶段，或你体力值变化过的阶段结束时，你可以使用一张牌。若此牌未造成伤害，你可以将一张黑桃牌当作【乐不思蜀】对当前回合角色使用。",
  clandandao: "耽道",
  clandandao_info: "锁定技，你每回合首次判定后，当前回合角色手牌上限+1。",
  clanqingli: "清励",
  clanqingli_info: "锁定技，每回合结束时，你将手牌摸至手牌上限（至多摸至5）。",
  clan_yangzhong: "族杨众",
  clan_yangzhong_prefix: "族",
  clanjuetu: "绝途",
  clanjuetu_info: "锁定技，弃牌阶段开始前，你将此阶段执行的效果改为：保留手牌中每个花色各一张，将其余手牌置入弃牌堆，然后你令一名角色弃置一张手牌，若你手牌中没有此花色的牌，你对其造成1点伤害。",
  clankudu: "苦渡",
  clankudu_info: "限定技，结束阶段，你可以重铸两张牌，令一名角色下X个回合结束时摸一张牌，第X个回合后其执行一个额外回合（X为你重铸牌点数差且至多为5）。",
  clan_yangbiao: "族杨彪",
  clan_yangbiao_prefix: "族",
  clanjiannan: "间难",
  clanjiannan_info: "出牌阶段开始时，你可以摸两张牌。若如此做，此阶段一名角色失去所有“间难”牌或最后的手牌后，若没有角色处于濒死状态，你令一名角色执行一项：1.弃置两张牌；2.摸两张牌；3.重铸所有装备牌；4.将一张锦囊牌置于牌堆顶或失去1点体力（每回合每项各限一次）。",
  clanyichi: "义叱",
  clanyichi_info: "结束阶段，你可以拼点。若你赢，没赢的角色依次执行〖间难〗的前X个选项（X为你本回合发动〖间难〗的次数）。",
  clan_luji: "族陆绩",
  clan_luji_prefix: "族",
  clangailan: "该览",
  clangailan_info: `锁定技，游戏开始时，你将四张${get.poptip("huntianyi")}洗入牌堆。回合开始时，你将牌堆或弃牌堆中的一张${get.poptip("huntianyi")}置入装备区。`,
  huntianyi: "浑天仪",
  huntianyi_info: "锁定技，你从装备区失去此牌时，从牌堆中随机获得两张与此牌点数相同的锦囊牌。你受到伤害时，销毁此牌并防止之。",
  huntianyi_skill: "浑天仪",
  huntianyi_skill_info: "锁定技，你从装备区失去此牌时，从牌堆中随机获得两张与此牌点数相同的锦囊牌。你受到伤害时，销毁此牌并防止之。",
  clanfennu: "奋驽",
  clanfennu_info: "①出牌阶段开始时，你可以令至多体力值名角色各弃置一张牌，将这些牌置于你的武将牌上，称为“逸”。②若你的武将牌上有“逸”，你使用牌指定目标时记录此牌点数。③准备阶段，若记录点数大于“逸”的点数和，你清除记录并获得所有“逸”。",
  clanzelie: "泽烈",
  clanzelie_info: "宗族技，当吴郡陆氏角色失去其场上的所有牌后，你可令一名角色本回合下次摸牌/弃置牌后，其摸一张牌/弃置一张牌。",
  clan_lujing: "族陆景",
  clan_lujing_prefix: "族",
  clantanfeng: "探锋",
  clantanfeng_info: "出牌阶段限一次，你可以视为对一名角色使用一张无视防具且不计次数的【杀】。若此【杀】造成伤害，你摸X张牌（X为你与其装备区牌数之差）；否则其可视为对你使用一张【杀】。",
  clanjuewei: "绝围",
  clanjuewei_info: "每回合限一次，你使用伤害牌指定目标后，或你成为伤害牌的目标后，你可选择一项：1.重铸一张装备牌，于此牌结算完成后视为对一名不为你的目标角色使用此牌；2.弃置一张装备牌，令此牌无效。",
  clan_hanfu: "族韩馥",
  clan_hanfu_prefix: "族",
  clanheta: "和他",
  clanheta_info: "出牌阶段开始时，你可以进入连环状态。然后本回合你使用牌时，可以解除连环状态并为此牌增加或减少任意名目标（无距离限制，仅能选择本回合你此前对其使用过牌的角色）。",
  clanyingxiang: "迎乡",
  clanyingxiang_info: `出牌阶段结束时，你可以声明一张基本牌或单目标锦囊牌的牌名并拼点，赢的角色视为使用你声明的牌。若声明的牌名与任意拼点牌：牌名相同，你视为未发动${get.poptip("clanxumin")}；牌名均不同，你获得所有拼点牌并失去一个技能。`,
  clan_xunyu: "族荀彧",
  clan_xunyu_prefix: "族",
  clandingan: "定安",
  clandingan_info: "锁定技，当一个牌名的牌每回合第二次被使用后，你与一名非目标角色各摸一张牌（每回合每名角色限一次），然后你对手牌最多的其他角色造成1点伤害，或令其随机弃置手牌中最多的同名牌。",
  clanfuning: "抚宁",
  clanfuning_info: "每轮你的体力值首次变化后，可以将至少X张牌交给一名其他角色（X为你已损失体力值），若你交出的牌：颜色均相同，你回复1点体力；数量大于本回合受到过伤害的角色数，你将手牌调整至体力上限。",
  clan_chenqun: "族陈群",
  clan_chenqun_prefix: "族",
  clangezhi: "革制",
  clangezhi_info: "每回合限一次，当你或你攻击范围内的角色受到伤害后，若伤害来源不为你，你可弃置你与伤害来源各一张牌，且可分配这些牌。若因此弃置牌的类别不同，你与伤害来源本回合只能使用这些类别的牌。",
  clanmingdian: "明典",
  clanmingdian_info: "出牌阶段或当你受到伤害后，你可重铸任意张基本牌（每轮每个牌名限一次）。若你重铸了你本回合使用过的牌名，你获得一张手牌中未拥有牌名的基本牌。",
  clanshize: "士则",
  clanshize_info: "宗族技，锁定技，你于回合内使用牌首次被响应后，你令一名颍川陈氏角色攻击范围+1，直到其下次受到伤害。",
  clan_chentai: "族陈泰",
  clan_chentai_prefix: "族",
  clanfenjian: "奋剑",
  clanfenjian_info: "出牌阶段每项限一次，你可以选择一名攻击范围：1.小于你；2.等于你；3.大于你的角色。其须弃置一张牌，若弃置的牌为【闪】，你摸一张牌，否则你本回合攻击范围-1（至多减至0）。",
  clandongxu: "动虚",
  clandongxu_info: "转换技，阳：你可以将你装备区里的一张牌置于其他角色装备区（替换原装备），视为对其使用一张【杀】；阴：你可以将手牌摸至X（X为你的攻击范围且至多为5），视为使用一张【闪】。",
  clan_xunshi: "族荀莳",
  clan_xunshi_prefix: "族",
  clanqingjue: "清绝",
  clanqingjue_info: "锁定技，你手牌中每个花色仅一张的牌不计入手牌上限。当你每回合体力值首次变化后，你弃置手牌中任意张花色数量不为一的牌，并执行以下等量项：1.将这些牌交给一名其他角色；2.获得手牌中未拥有花色的牌各一张。",
  clanxsyingxiang: "萦香",
  clanxsyingxiang_info: "锁定技，当其他角色获得你的牌后，将此牌称为“萦香”牌。“萦香”牌被使用后，你和手牌中有“萦香”牌的角色各摸一张牌。若“萦香”牌不因使用而失去，你发动一次〖清绝〗（每轮限一次）。"
};
const characterTitles = {
  //clan_xunyu: "",
  clan_xunshi: "屏后点香谱",
  clan_chentai: "弘济简至",
  clan_yangzhong: "岐路也汤汤",
  clan_chenqun: "片言折狱",
  clan_wangshen: "崇虎田光",
  clan_wuxian: "庄姝晏晏",
  clan_wuban: "豪侠督进",
  clan_xunshu: "长儒赡宗",
  clan_xuncai: "怀刃自誓",
  clan_xunchen: "挚怯恇恇",
  clan_xuncan: "分钗断带",
  clan_hanshao: "分投急所",
  clan_hanrong: "虎口扳渡",
  clan_wukuang: "诛绝宦竖",
  clan_wangling: "荧惑守斗",
  clan_zhongyan: "紫闼飞莺",
  clan_wangyun: "曷丧偕亡",
  clan_wanghun: "献捷横江",
  clan_zhonghui: "百巧惎",
  clan_zhongyu: "础润殷忧",
  clan_wanglun: "半缘修道",
  clan_xunyou: "慨然入幕",
  clan_wuqiao: "孤节卅岁",
  clan_wangguang: "才性离异",
  clan_wangmingshan: "擅书多艺",
  clan_zhongyao: "开达理干",
  clan_wangchang: "治论识度",
  clan_wuyi: "仞锋矢勇",
  clan_yangci: "固世笃忠贞",
  clan_yangxiu: "皓首邀终始",
  //clan_xunshuang: "",
  clan_yangbiao: "负荷履崎岖",
  clan_luji: "探赜执道",
  //clan_lujing: ""
  clan_hanfu: "挈瓶之知"
};
const characterIntro = {
  xunshi: "荀莳（生卒年不详），颍川荀氏，荀彧之女，嫁与曹魏司空陈群为妻。出身汉末顶级士族，联姻巩固颍川荀、陈两大望族联盟，为曹魏士族政治重要纽带，生子陈泰，后为曹魏名将重臣。",
  yangzhong: "杨众，弘农华阴（今陕西省华阴市）人，太尉杨震曾孙，杨奉之孙，杨敷之子。兴平二年，汉献帝率公卿东返，十二月庚申晚上，汉献帝与皇后伏寿、董贵人、郭氏赵氏两宫人、太尉杨彪、宗正刘艾、执金吾伏完、侍中种辑、罗邵、尚书文祯、郭浦、中丞杨众、侍郎赵泳、尚书郎冯硕、中官仆射伏德、侍郎王稠、羽林郎侯折、卫将军董承、南郡太守左灵以及数十属吏乘坐同一条船逃过黄河，渡河后，杨众率领官员们的属吏步行跟随汉献帝到太阳县，被任命为侍中。建安元年八月辛亥，汉献帝追论东莱太守杨众之前的功劳，封他为蓩亭侯。",
  lujing: "陆景（250年—280年3月23日/280年3月25日），字士仁，吴郡吴县（今苏州）人，东吴丞相陆逊之孙，大司马陆抗次子。陆机、陆云之仲兄。生于吴大帝赤乌十三年（250年），天纪四年（280年）晋伐吴，陆景于二月癸亥（一说乙丑）遇害，年三十一岁。陆景著书数十篇，《隋书·经籍志》注有《陆景集》一卷，已亡佚。",
  xunshuang: "荀爽（128年～190年），一名谞，字慈明。颍川颍阴（今河南省许昌市）人。东汉末年官员、经学家，名士荀淑第六子。荀爽出身“颍川荀氏”，其兄弟八人俱有才名，有“荀氏八龙”之称。荀爽排名第六，更有“荀氏八龙，慈明无双”之评。他自幼聪敏好学，潜心经籍，刻苦勤奋。汉桓帝在位时曾被太常赵典举为至孝，拜郎中，对策上奏见解后，弃官离去。为了躲避第二次党锢之祸，他隐遁汉滨达十余年，专以著述为事，号为“硕儒”。黄巾起义爆发后，党禁解除，荀爽相继被举荐，但都未应命。董卓掌权后，强征荀爽为官。他在九十三日内，接连升至司空，位列台司。荀爽见董卓残暴，便暗中与司徒王允等谋除董卓。但在举事前，荀爽便于初平元年（190年）病逝，享年六十三岁。",
  yangci: "杨赐（？－185年），字伯献（一作伯钦、子献）。弘农郡华阴县（今陕西省华阴市）人。东汉时期名臣，杨秉之子，杨彪之父。灵帝帝师，曾多次就天象异变上书，因言辞恳切被罢免。杨赐被罢免前，就黄巾起义作出预言，后来因此受封为临晋侯。杨赐去世后，灵帝为之治丧，为其议定谥号“文烈”。",
  wangshen: "王沈（？—266年），字处道，太原晋阳（今山西省太原市）人，东汉护匈奴中郎将王柔之孙，东郡太守王机之子，司空王昶之侄。三国时期曹魏大臣、史学家。王沈少年失去父母，被叔叔王昶收养，王沈善写文章，最初被大将军曹爽辟为掾属，后升任中书门下侍郎，高平陵政变后，王沈因为是曹爽的故吏被免职。曹髦即位之后历任侍中、散骑常侍，甘露五年（260年）五月初六，曹髦欲起兵讨伐司马昭，召王经、王沈、王业商议，王沈、王业向司马昭告密，导致曹髦被杀。王沈因告密之功封安平侯，接连迁任尚书、豫州刺史等职。又整理贾逵以来的法制禁令，使得九郡之士移风易俗。后来，都督江北诸军事，镇守魏吴边境。西晋建立后，拜骠骑将军。次年去世，谥号元公。",
  xunshu: "荀淑（83年～149年），字季和，为郎陵侯相，颍川颍阴人（今河南省许昌市）人。汉和帝至汉桓帝时人物，以品行高洁著称。有子八人，号八龙。年轻时有高尚的德行，学问渊博，不喜欢雕章琢句，徒在文字上用功，不注重实际的学识。因此，常常被俗儒看不起。但州里却称他有知人之明。安帝时，征召任为郎中，后来再升当涂长。离职还乡里。他的孙子荀彧是曹操部下著名的谋士。",
  xuncai: "荀采（生卒年不详），字女荀，颍川人，东汉名士荀爽之女。荀采聪慧敏捷而有才艺。十七岁时，荀采嫁给阴瑜。两年后阴瑜去世。荀采不愿意改嫁，但荀爽答应把荀采嫁给同郡人郭奕。荀采趁着旁人没有防备，用粉在门上写下：“尸还阴”，而后自缢而死。",
  xuncan: "荀粲（210年—238年），字奉倩，颍川郡颍阴县（今河南省许昌市）人。三国时期曹魏大臣、玄学家，太尉荀彧幼子。个性简贵，不轻易交接常人，所交之辈皆一时俊杰。聪颖过人，善谈玄理，名噪一时。娶大将军曹洪之女为妻，生活美满。景初二年，面对妻子去世，悲痛过度而死，时年二十九，成语“荀令伤神”与之有关。",
  hanshao: "韩韶（生卒年不详），字仲黄，颍川舞阳（今河南省漯河市）人，东汉桓帝时出仕。任郡吏，有政绩，继而被征入司徒府。他公正廉明，尽心民事，视民苦如在己身，政绩卓著。汉永寿二年（公元156年），泰山贼公孙举率流寇数千骚扰嬴县，守令因不能拒敌安民，多受制裁，朝廷命尚书府从三府（司徒、司马、司空）属员中，选择能治理民事，又能拒寇入侵的官员，前往镇守。韩韶被封为“嬴长”到嬴县上任，他是莱芜历史上唯一的一位“嬴长”。",
  hanrong: "韩融（127年～196年），字元长，颍川舞阳（今属河南省漯河市）人。赢长韩韶子，献帝时大臣。中平五年（188年），融与荀爽、陈纪等十四人并博士征，不至。董卓废立，融等复俱公车征。初平元年（190年）六月，融为大鸿胪，奉命与执金吾胡母班等出使关东。献帝东迁，为李傕、郭汜等所败，融为太仆，奉命至弘农与傕、汜连和，使其放遣公卿百官及宫女妇人。",
  wukuang: "吴匡（生卒年不详），兖州陈留（今河南开封市）人。东汉末年大臣，大将军何进部将。光熹元年（公元189年），汉灵帝死后，十常侍干预朝政，大将军何进谋诛宦官，但失败被杀，吴匡联合曹操、袁绍等杀尽宦官，攻杀车骑将军何苗。兴平二年（公元195年）十月，李傕、郭汜后悔放汉献帝东归洛阳，于是联合起来追击，曹操遂起兵平乱，但在回朝后，曹操挟天子以令诸侯，实行专权，但遭到吴匡反对。",
  wanghun: "王浑（223年～297年），字玄冲，太原郡晋阳县（今山西省太原市）人。魏晋时期名臣，曹魏司空王昶的儿子。王浑早年为大将军曹爽的掾吏，高平陵政变后，循例免官，出任怀县县令、散骑侍郎等职，袭封京陵县侯。西晋王朝建立后，加号扬烈将军，历任征虏将军、东中郎将、豫州刺史等职，积极筹划伐吴方略。咸宁五年（279年），配合镇南将军杜预灭亡吴国，迁征东大将军、左仆射、司徒公，晋爵京陵县公。晋惠帝司马衷即位，加任侍中衔。楚王司马玮发动政变，有意寻求支持，遭到严词拒绝。楚王司马玮死后，复任司徒、录尚书事。元康七年（297年），王浑去世，享年七十五岁，谥号为元。《唐会要》尊为“魏晋八君子”之一。",
  zhongyu: "钟毓（？-263年），字稚叔，颍川长社（今河南长葛市）人。三国时期魏国大臣，太傅钟繇之子、司徒钟会之兄。出身颍川钟氏，机灵敏捷，有其父之遗风。十四岁时，起家散骑侍郎。太和初年，迁黄门侍郎，袭封定陵县侯。正始年间，拜散骑常侍，迁魏郡太守，入为侍中、御史中丞、廷尉。随平诸葛诞的淮南叛乱，拜青州刺史、后将军，都督徐州、荆州诸军事。景元四年（263年），去世，追赠车骑将军，谥号为惠，著有文集五卷（见《隋书·经籍志》及《两唐书·经籍志》），传于世。",
  wanglun: "王沦（233年－257年）字太冲，出身太原晋阳王姓世族（今山西省太原市），王昶三子，王浑、王深之弟，王湛之兄。醇粹简远，崇尚老庄之学，心思平淡。二十多时被举荐为孝廉，没有前往，后任大将军参军。257年，诸葛诞不满司马氏篡权而在寿春起义，王沦跟随司马昭征讨，遭遇疾疫去世，时年二十五，时人惜之，司马昭为他流泪。其兄著诔文《表德论》，表述其德行，说“因为畏惧帝王的典章制度，不能写墓志铭，于是撰写过往的事迹，刻在墓的背面。”",
  wuqiao: "吴乔，西晋人物，蜀车骑将军吴懿之孙。李雄建立成汉政权，他沦落益州，长达三十年，始终不向李雄屈服。",
  wangguang: "王广，三国时期曹魏太原祁县人，哲学家。东汉司徒王允从孙，魏太尉王凌之子。有志尚学，官至尚书。魏时随父亲在朝作官，屯骑校尉，机智有谋。当得知司马懿篡夺曹魏政权时，王凌与外甥令狐愚合谋立楚王为魏主，王广劝其父不可，王凌没有接受儿子的谏言，结果计谋泄而被害。",
  wangmingshan: "王明山，王凌的小儿子，太原祁（今山西省祁县）人，三国魏书法家，最知名善画，多技艺，人得其书，皆以为法。太尉王凌参与谋划废立，事情泄露，被太傅司马懿领兵平定。"
};
const characterFilters = {};
const dynamicTranslates = {
  clandongxu(player2, skill) {
    const bool = player2.storage[skill];
    let yang = "你可以将你装备区里的一张牌置于其他角色装备区（替换原装备），视为对其使用一张【杀】", yin = "你可以将手牌摸至X（X为你的攻击范围且至多为5），视为使用一张【闪】";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技,", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  clanlianzhu(player2) {
    const bool = player2.storage.clanlianzhu;
    let yang = "Ａ可以重铸一张牌，然后你可以重铸一张牌。若这两张牌颜色相同，则你的手牌上限-1", yin = "Ａ可以令你选择一名在你或Ａ攻击范围内的另一名其他角色Ｂ，然后Ａ和你可依次选择是否对Ｂ使用一张【杀】。若这两张【杀】颜色不同，则你的手牌上限+1";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技。每名角色Ａ的出牌阶段限一次，", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  clanguangu(player2) {
    const bool = player2.storage.clanguangu;
    let yang = "你可以观看牌堆顶的至多四张牌", yin = "你可以观看一名角色的至多四张手牌";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技。出牌阶段限一次，", end = "，然后你可以使用其中的一张牌。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  clanjiexuan(player2) {
    const bool = (player2.storage?.clanjiexuan || 0) % 2;
    let yang = "你可以将一张红色牌当【顺手牵羊】使用", yin = "你可以将一张黑色牌当【过河拆桥】使用";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "限定技，转换技。", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  }
};
const voices = {
  "#clandingan1": "今人心思动，非天子无以讨不臣。",
  "#clandingan2": "现大乱将起，非英杰无以定海内。",
  "#clanfuning1": "内外协一，方定天下社稷。",
  "#clanfuning2": "屯田养战，此为乱世良方。",
  "#clandaojie_clan_xunyu1": "魏公之意，恕宁死不从！",
  "#clandaojie_clan_xunyu2": "荀氏家风，唯忠节二字。",
  "#clan_xunyu:die": "生无救于时，今唯死矣！",
  "#clanqingjue1": "节草长于绝涯，唯得清寒而自立。",
  "#clanqingjue2": "芷兰生深林，非以无人而不芳。",
  "#clanxsyingxiang1": "风丝寸缕清柔肠，夜雨把盏，屏后萦香。",
  "#clanxsyingxiang2": "白马簪缨缄数语，明明公议，空留荀香。",
  "#clandaojie_clan_xunshi1": "不慕荣华，唯守初心之节。",
  "#clandaojie_clan_xunshi2": "寒梅立雪，守此一身清贵。",
  "#clan_xunshi:die": "空奁满尘埃，闲愁旧恨一番新。",
  "#clangezhi1": "天下十分君有其九，群生皆盼，此天人之应。",
  "#clangezhi2": "夏不以谦辞，周不吝诛放，畏知天命，无所与让。",
  "#clanmingdian1": "谄员蔽信，心利锥刀，岂居台府之任！",
  "#clanmingdian2": "陛列庸夫，智昏麦菽，何当机衡之重？",
  "#clanshize_clan_chenqun1": "敬五行，承三德，惩恶息杀，甘率时臣矣。",
  "#clanshize_clan_chenqun2": "建九品，定八议，彰德行法，足万世表也。",
  "#clan_chenqun:die": "匆碌二十载，惟愿后人曰“陈尚书在，不成此殿”。",
  "#clantanque1": "挽弓射营雀，试惊执刀人。",
  "#clantanque2": "吾可射落山雀，亦可毙汝性命！",
  "#clanshengmo1": "挥毫纵墨，诸君可见砚底之春秋。",
  "#clanshengmo2": "余墨染青山，墨尽颜色存。",
  "#clanzhongliu_clan_wangmingshan1": "既敢居于中流，何惧水漫之厄。",
  "#clanzhongliu_clan_wangmingshan2": "往昔门庭若洪，府内俱藏乾坤。",
  "#clan_wangmingshan:die": "一人之罪，王门何辜？",
  "#clan_hanfu:die": "动则门生，行必故吏，此馥何主也。",
  "#clanheta1": "兵者不可为首，待他州发动再和之不迟。",
  "#clanheta2": "学从袁，职自董，当助袁氏乎？当助董氏乎？",
  "#clanyingxiang1": "颖川冲要，不捍大难，冀州虽鄙，堪留余谷。",
  "#clanyingxiang2": "西山冷冷，众卿莫怀守土依依。",
  "#clanyingxiang3": "遣骑迎乡人，则韩氏不来唯荀姓独往。",
  "#clanxumin_clan_hanfu1": "不恤袁门恩举，馥无以至今日，况牧一州之民乎？",
  "#clanxumin_clan_hanfu2": "民尽主兴袁氏，我又怎能不恤此民意？",
  "#clan_wangguang:die": "父过盈渊，子愿代父偿……",
  "#clanlilun1": "明胆异气，不能相生。",
  "#clanlilun2": "心之与声，明为二物。",
  "#clanjianji1": "夫谋大事者，非见利而行。",
  "#clanjianji2": "今爽咎由自取，民心自失尔。",
  "#clanzhongliu_clan_wangguang1": "潮有信，民有心，当依大势而为。",
  "#clanzhongliu_clan_wangguang2": "中流之水不可逆，唯顺尔。",
  "#clangailan1": "春秋几梦聃周事，遘难而今注子云。",
  "#clangailan2": "顽石哪比经籍重，满船学问压川河。",
  "#clanfennu1": "殚意儒学，功在不舍。",
  "#clanfennu2": "驽牛致远，驽马逸足，赖凤雏之前翱。",
  "#clanzelie1": "遍览日月星辰，泽其光，沐其烈。",
  "#clanzelie2": "为政以德，如北宸之烈烈。",
  "#clan_luji:die": "郁林远花开正茂，何日魂归吴郡家……",
  "#clanjiannan1": "上既临危遘难，臣当尽节卫主。",
  "#clanjiannan2": "事君不避难，凛身危困间。",
  "#clanyichi1": "黎民重迁，动易安难，遑论宗庙社稷！",
  "#clanyichi2": "捐宗庙，弃园陵，岂是为国事者所为！",
  "#clanquhuo_clan_yangbiao1": "君子曰，臣治烦去惑者，是以伏死而争。",
  "#clanquhuo_clan_yangbiao2": "杨氏累世清德，当守家风，去三惑。",
  "#clan_yangbiao:die": "见华岳松枯，闻五色鸟啼。",
  "#clanqieyi1": "张角将成祸患，何不庙胜先分之弱之。",
  "#clanqieyi2": "昔授《尚书》于华光，今剖时弊于朝堂！",
  "#clanjianzhi1": "昔虹贯牛山，管仲谏桓公无近妃宫。",
  "#clanjianzhi2": "老臣三尺讲席未冷，岂容佞言惑君！",
  "#clanquhuo_clan_yangci1": "为师为傅，所在授业解惑。",
  "#clanquhuo_clan_yangci2": "荧惑守心，宋景退殿，惟德可去蛇变。",
  "#clan_yangci:die": "泰山颓，梁木坏，哲人萎……",
  "#clanjiewu1": "只此四字，绝、妙、好、辞。",
  "#clanjiewu2": "君侯，他日君若乘上高轩，我当为君揽辔策马！",
  "#clangaoshi1": "听风仰德，省览建安辞章。",
  "#clangaoshi2": "杨宗显迹，高视魏京群英。",
  "#clanquhuo_clan_yangxiu1": "非鱼非我，惟知君侯心意而已。",
  "#clanquhuo_clan_yangxiu2": "依我所教，答记方能无有疑惑。",
  "#clan_yangxiu:die": "空晓事而未见老，枉少作而愧对君……",
  "#clananran1": "此身伟岸，何惧悠悠之口。",
  "#clananran2": "天时在彼，何故抱残守缺。",
  "#clangaobian1": "帝髦召甲士带兵，欲图不轨。",
  "#clangaobian2": "晋公何在？君上欲谋反作乱！",
  "#clanzhongliu_clan_wangshen1": "活水驱沧海，天下大势不可违。",
  "#clanzhongliu_clan_wangshen2": "志随中流之水，可济沧海之云帆。",
  "#clan_wangshen:die": "我有从龙之志，何惧万世骂名。",
  "#clankaiji1": "开济国朝之心，可曰昭昭。",
  "#clankaiji2": "开大胜之世，匡大魏之朝。",
  "#clanzhongliu_clan_wangchang1": "吾族以国为重，故可为之中流。",
  "#clanzhongliu_clan_wangchang2": "柱国之重担，击水之中流。",
  "#clan_wangchang:die": "大任未济，如何长眠九泉？",
  "#clanyirong1": "花开彼岸，繁荣不减当年。",
  "#clanyirong2": "移花接木，花容更胜从前。",
  "#clanguixiang1": "女相显贵，凤仪从龙。",
  "#clanguixiang2": "正官七杀，天生富贵。",
  "#clanmuyin_clan_wuxian1": "吴门隆盛，闻钟而鼎食。",
  "#clanmuyin_clan_wuxian2": "吴氏一族，感明君青睐。",
  "#clan_wuxian:die": "玄德东征，何日归还？",
  "#clanzhanding1": "汝颈硬，比之金铁何如？",
  "#clanzhanding2": "魍魉鼠辈，速速系颈伏首！",
  "#clanmuyin_clan_wuban1": "世代佐忠义，子孙何绝焉？",
  "#clanmuyin_clan_wuban2": "祖训秉心，其荫何能薄也？",
  "#clan_wuban:die": "无胆鼠辈，安敢暗箭伤人……",
  "#clanshenjun1": "区区障眼之法，难遮神人之目。",
  "#clanshenjun2": "我以天地为师，自可道法自然。",
  "#clanbalong1": "八龙之蜿蜿，云旗之委蛇。",
  "#clanbalong2": "穆王乘八牡，天地恣遨游。",
  "#clandaojie_clan_xunshu1": "荀人如玉，向节而生。",
  "#clandaojie_clan_xunshu2": "竹有其节，焚之不改。",
  "#clan_xunshu:die": "天下陆沉，荀氏难支……",
  "#clansankuang1": "人言可畏，宜常辟之。",
  "#clansankuang2": "天地可敬，可常惧之。",
  "#clanbeishi1": "虎卑其势，将有所逮。",
  "#clanbeishi2": "至山穷水尽，复柳暗花明。",
  "#clandaojie_clan_xunchen1": "此生所重者，慷慨之节也。",
  "#clandaojie_clan_xunchen2": "愿以此身，全清尚之节。",
  "#clan_xunchen:die": "行二臣之为，羞见列祖……",
  "#clanlieshi1": "拭刃为誓，女无二夫。",
  "#clanlieshi2": "霜刃证言，宁死不贰。",
  "#clandianzhan1": "此灯如我，独向光明。",
  "#clandianzhan2": "此间皆暗，唯灯瞩明。",
  "#clanhuanyin1": "且将此身，还于阴氏。",
  "#clanhuanyin2": "生不得同户，死可葬同穴乎？",
  "#clandaojie_clan_xuncai1": "女子有节，宁死蹈之。",
  "#clandaojie_clan_xuncai2": "荀氏三纲，死不贰嫁。",
  "#clan_xuncai:die": "苦难已过，世间大好……",
  "#clanyunshen1": "此心恋卿，尽融三九之冰。",
  "#clanyunshen2": "寒梅傲雪，馥郁三尺之香。",
  "#clanshangshen1": "识字数万，此痛无字可言。",
  "#clanshangshen2": "吾妻已逝，吾心悲怆。",
  "#clanfenchai1": "钗同我心，奈何分之？",
  "#clanfenchai2": "夫妻分钗，天涯陌路。",
  "#clandaojie_clan_xuncan1": "君子持节，何移情乎？",
  "#clandaojie_clan_xuncan2": "我心慕鸳，从一而终。",
  "#clan_xuncan:die": "此钗，今日可合乎？",
  "#clanfangzhen1": "百姓罹灾，当施粮以赈。",
  "#clanfangzhen2": "开仓放粮，以赈灾民。",
  "#clanliuju1": "乡老十里相送，此驹可彰吾情。",
  "#clanliuju2": "当逐千里之驹，情深可留嬴城。",
  "#clanxumin_clan_hanshao1": "民者，居野而多艰，不可不恤。",
  "#clanxumin_clan_hanshao2": "天下之本，上为君，下为民。",
  "#clan_hanshao:die": "天地不仁，万物何辜……",
  "#clanlianhe1": "枯草难存于劲风，唯抱簇得生。",
  "#clanlianhe2": "吾所来之由，一为好，二为和。",
  "#clanhuanjia1": "我之所言，皆为君好。",
  "#clanhuanjia2": "吾言之切切，请君听之。",
  "#clanxumin_clan_hanrong1": "江海陆沉，皆为黎庶之泪。",
  "#clanxumin_clan_hanrong2": "天下汹汹，百姓何辜？",
  "#clan_hanrong:die": "天下兴亡，皆苦百姓……",
  "#clanlianzhu1": "奸宦作乱，当联兵伐之。",
  "#clanlianzhu2": "尽诛贼常侍，正在此时。",
  "#clanmuyin_clan_wukuang1": "家有贵女，其德泽三代。",
  "#clanmuyin_clan_wukuang2": "吾家当以此女而兴之。",
  "#clan_wukuang:die": "孟德何在？本初何在？",
  "#clanbolong1": "驳者，食虎之兽焉，可摄冢虎。",
  "#clanbolong2": "主上暗弱，当另择明主侍之。",
  "#clanzhongliu_clan_wangling1": "王门世代骨鲠，皆为国之柱石。",
  "#clanzhongliu_clan_wangling2": "行舟至中流而遇浪，大风起兮。",
  "#clan_wangling:die": "淩忠心可鉴，死亦未悔……",
  "#clanguangu1": "此才拔萃，然观其形骨，恐早夭。",
  "#clanguangu2": "绯衣者，汝所拔乎？",
  "#clanxiaoyong1": "凉风萧条，露沾我衣。",
  "#clanxiaoyong2": "忧来多方，慨然永怀。",
  "#clanbaozu_clan_zhongyan1": "好女宜家，可度大厄。",
  "#clanbaozu_clan_zhongyan2": "宗族有难，当施以援手。",
  "#clan_zhongyan:die": "此间天下人，皆分一斗之才……",
  "#clanjiexuan1": "允不才，愿以天下苍生为己任。",
  "#clanjiexuan2": "愿以此躯为膳，饲天下以太平。",
  "#clanmingjie1": "大公至正，恪忠义于国。",
  "#clanmingjie2": "此生柱国之志，铭恪于胸。",
  "#clanzhongliu_clan_wangyun1": "国朝汹汹如涌，当如柱石镇之。",
  "#clanzhongliu_clan_wangyun2": "砥中流之柱，其舍我复谁？",
  "#clan_wangyun:die": "获罪于君，当伏大辟以谢天下……",
  "#clanfuxun1": "东吴遗民惶惶，宜抚而不宜罚。",
  "#clanfuxun2": "江东新附，不可以严法度之。",
  "#clanchenya1": "喜怒不现于形，此为执中之道。",
  "#clanchenya2": "胸有万丈之海，故而波澜不惊。",
  "#clanzhongliu_clan_wanghun1": "国潮汹涌，当为中流之砥柱。",
  "#clanzhongliu_clan_wanghun2": "执剑斩巨浪，息风波者出我辈。",
  "#clan_wanghun:die": "灭国之功本属我，奈何枉作他人衣……",
  "#clanyuzhi1": "风水轮流转，轮到我钟某问鼎重几何了。",
  "#clanyuzhi2": "空将宝地赠他人，某怎会心甘情愿？",
  "#clanyuzhi3": "入宝山而空手回，其与匹夫何异？",
  "#clanyuzhi4": "天降大任于斯，不受必遭其殃。",
  "#clanyuzhi5": "汉鹿已失，魏牛犹在，吾欲执其耳。",
  "#clanyuzhi6": "我欲行夏禹旧事，为天下人。",
  "#clanxieshu1": "大丈夫胸怀四海，有提携玉龙之术。",
  "#clanxieshu2": "王霸之志在胸，我岂池中之物？",
  "#clanxieshu3": "历经风浪至此，会不可止步于龙门。",
  "#clanxieshu4": "我若束手无策，诸位又有何施为？",
  "#clanxieshu5": "今长缨在手，欲问鼎九州。",
  "#clanxieshu6": "我有佐国之术，可缚苍龙。",
  "#clanbaozu_clan_zhonghui1": "动我钟家的人，哼，你长了几个脑袋？",
  "#clanbaozu_clan_zhonghui2": "有我在一日，谁也动不得吾族分毫。",
  "#clanbaozu_clan_zhonghui3": "钟门欲屹万年，当先居万人之上。",
  "#clanbaozu_clan_zhonghui4": "诸位同门，随我钟会赌一遭如何？",
  "#clanbaozu_clan_zhonghui5": "不为刀下脍，且做俎上刀。",
  "#clanbaozu_clan_zhonghui6": "吾族恒大，谁敢欺之？",
  "#clan_zhonghui1:die": "兵来似欲作恶，当云何？",
  "#clan_zhonghui2:die": "伯约误我！",
  "#clan_zhonghui3:die": "谋事在人，成事在天……",
  "#clanjiejian1": "庙胜之策，不临矢石。",
  "#clanjiejian2": "王者之兵，有征无战。",
  "#clanhuanghan1": "居天子阶下，故诚惶诚恐。",
  "#clanhuanghan2": "战战惶惶，汗出如浆。",
  "#clanbaozu_clan_zhongyu1": "弟会腹有恶谋，不可不防。",
  "#clanbaozu_clan_zhongyu2": "会期大祸将至，请晋公恕之。",
  "#clan_zhongyu:die": "百年钟氏，一朝为尘矣……",
  "#clanqiuxin1": "此生所求者，顺心意尔。",
  "#clanqiuxin2": "羡孔丘知天命之岁，叹吾生之不达。",
  "#clanjianyuan1": "我视天地为三，其为众妙之门。",
  "#clanjianyuan2": "昔年孔明有言，宁静方能致远。",
  "#clanzhongliu_clan_wanglun1": "上善若水，中流而引全局。",
  "#clanzhongliu_clan_wanglun2": "泽物无声，此真名士风流。",
  "#clan_wanglun:die": "人间多锦绣，奈何我云不喜……",
  "#clanbaichu1": "腹有经纶，到用时施无穷之计。",
  "#clanbaichu2": "胸纳甲兵，烽烟起可靖疆晏海。",
  "#clandaojie_clan_xunyou1": "秉忠正之心，可抚宁内外。",
  "#clandaojie_clan_xunyou2": "贤者，温良恭俭让以得之。",
  "#clan_xunyou:die": "吾知命之寿，明知命之节……",
  "#clanqiajue1": "汉旗未复，此生不居檐下。",
  "#clanqiajue2": "蜀川大好，皆可为家。",
  "#clanmuyin_clan_wuqiao1": "生继汉泽于身，死效忠义于行。",
  "#clanmuyin_clan_wuqiao2": "吾祖彰汉室之荣，今子孙未敢忘。",
  "#clan_wuqiao:die": "蜀川万里，孤身伶仃……",
  "#clanchengqi1": "世有十万字形，亦当有十万字体。",
  "#clanchengqi2": "笔画如骨，不可拘于一形。",
  "#clanjieli1": "子不学难成其材，子不教难筑其器。",
  "#clanjieli2": "此子顽劣如斯，必当严加管教。",
  "#clanbaozu_clan_zhongyao1": "立规定矩，教习钟门之材。",
  "#clanbaozu_clan_zhongyao2": "放任纨绔，于族是祸非福。",
  "#clan_zhongyao:die": "幼子得宠而无忌，恐生无妄之祸……",
  "#qice_clan_xunyou1": "二袁相争，此曹公得利之时。",
  "#qice_clan_xunyou2": "穷寇宜追，需防死蛇之不僵。",
  "#clanjuetu1": "此天子銮驾，尔可有异心耶？",
  "#clanjuetu2": "断途绝路，莫使凉州人追来。",
  "#clankudu1": "大河汤汤，行路艰难辛苦。",
  "#clankudu2": "羁途苦旅，终见月明花开。",
  "#clanquhuo_clan_yangzhong1": "莫愁前路漫漫，脚下便是归途。",
  "#clanquhuo_clan_yangzhong2": "多疑离情无用，长歌可以当哭。",
  "#clan_yangzhong:die": "为之奈何，为之奈何！",
  "#clantanfeng1": "轻身涉险地，探敌锋芒，利刃出鞘斩乱局。",
  "#clantanfeng2": "仗剑探虎穴，寻其破绽，当凭此刃破万军。",
  "#clanjuewei1": "今老贼入彀，徒做困兽而斗。",
  "#clanjuewei2": "围虽固，然凭吾之勇毅可决。",
  "#clanzelie_clan_lujing1": "曹贼之强，跨险南北，终止濡须铁壁。",
  "#clanzelie_clan_lujing2": "伪备之盛，泽身白帝，胆裂江东风雷。",
  "#clan_lujing:die": "阿童复阿童，不畏岸兽，畏蛟龙……"
};
const characterSort = {
  clan_wu: ["clan_wuyi", "clan_wuxian", "clan_wuban", "clan_wukuang", "clan_wuqiao"],
  clan_xun: ["clan_xunshi", "clan_xunshu", "clan_xunchen", "clan_xuncai", "clan_xuncan", "clan_xunyou", "clan_xunshuang", "clan_xunyu"],
  clan_han: ["clan_hanshao", "clan_hanrong", "clan_hanfu"],
  clan_wang: ["clan_wangshen", "clan_wangling", "clan_wangyun", "clan_wanghun", "clan_wanglun", "clan_wangguang", "clan_wangmingshan", "clan_wangchang"],
  clan_zhong: ["clan_zhongyan", "clan_zhonghui", "clan_zhongyu", "clan_zhongyao"],
  clan_yang: ["clan_yangci", "clan_yangxiu", "clan_yangzhong", "clan_yangbiao"],
  clan_lu: ["clan_luji", "clan_lujing"],
  clan_chen: ["clan_chenqun", "clan_chentai"]
};
const characterSortTranslate = {
  clan_wu: "陈留·吴氏",
  clan_xun: "颍川·荀氏",
  clan_han: "颍川·韩氏",
  clan_wang: "太原·王氏",
  clan_zhong: "颍川·钟氏",
  clan_yang: "弘农·杨氏",
  clan_lu: "吴郡·陆氏",
  clan_chen: "颍川·陈氏"
};
game.import("character", function() {
  return {
    name: "clan",
    connect: true,
    character: { ...characters },
    characterSort: {
      clan: characterSort
    },
    characterFilter: { ...characterFilters },
    characterTitle: { ...characterTitles },
    dynamicTranslate: { ...dynamicTranslates },
    characterIntro: { ...characterIntro },
    card: { ...cards },
    skill: { ...skills },
    translate: { ...translates, ...voices, ...characterSortTranslate },
    pinyins: { ...pinyins }
  };
});
