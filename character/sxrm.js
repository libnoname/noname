import { lib, game, get, ui, _status } from "noname";
const characters = {
  //慢
  sxrm_guanyu: {
    sex: "male",
    group: "devil",
    hp: 5,
    skills: ["sxrmhanguo", "sxrmweiwo"],
    groupInGuozhan: "shu"
  },
  sxrm_guanyinping: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["sxrmyinmou", "sxrmquchi"]
  },
  sxrm_yujin: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["sxrmsuwu", "sxrmrenwang"]
  },
  sxrm_mifang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["sxrmhuoe", "sxrmtanduo"]
  },
  sxrm_liufeng: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["sxrmhuaibing"],
    names: "刘|封"
  },
  sxrm_luxun: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["sxrmchanyu", "sxrmcongfeng"],
    clans: ["吴郡陆氏"]
  },
  sxrm_lvmeng: {
    sex: "male",
    group: "wu",
    hp: 3,
    maxHp: 4,
    skills: ["sxrmkongzhi", "sxrmbizha"]
  },
  sxrm_pangde: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["sxrmnuozhan"]
  },
  sxrm_yanwen: {
    sex: "male",
    group: "qun",
    hp: 5,
    skills: ["sxrmhaibian", "sxrmqiewang"],
    names: "颜|良-文|丑"
  },
  //疑
  sxrm_caocao: {
    sex: "male",
    group: "devil",
    hp: 3,
    skills: ["sxrmkuxin", "sxrmsigu"],
    groupInGuozhan: "wei"
  },
  sxrm_caopi: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["sxrmzhengsi", "sxrmchengming"]
  },
  sxrm_wanghou: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["sxrmjugu"]
  },
  sxrm_liubei: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["sxrmchengbian"]
  },
  sxrm_jianggan: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["sxrmzongheng", "sxrmduibian"]
  },
  sxrm_huatuo: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["sxrmmiehai"]
  },
  sxrm_lvboshe: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["sxrmqingjun"]
  },
  sxrm_fuhuanghou: {
    sex: "female",
    group: "qun",
    hp: 3,
    maxHp: 4,
    skills: ["sxrmmitu", "sxrmqianliu"]
  },
  sxrm_xunyu: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["sxrmhuice", "sxrmyihe", "sxrmjizhi"],
    clans: ["颍川荀氏"]
  }
};
const cards = {};
const pinyins = {};
const skills = {
  //曼巴
  //关羽
  sxrmhanguo: {
    audio: 2,
    trigger: {
      global: "roundStart"
    },
    filter(event, player) {
      const targets = get.info("sxrmhanguo").getSelected(player);
      return game.hasPlayer((current) => !targets.includes(current));
    },
    async cost(event, trigger, player) {
      const targets = get.info(event.skill).getSelected(player);
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return target != player2 && !get.event().usedTarget.includes(target);
      }).set("usedTarget", targets).set("ai", (target) => {
        const player2 = get.player();
        return -get.attitude(player2, target);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0], skill = "sxrmhanguo_hujia";
      target.markAuto(skill, player);
      target.getStorage(skill).forEach((current) => {
        target.addTip(`${skill}_${current.playerid}`, `撼国 ${get.translation(current)}`);
      });
      target.addTempSkill(skill, "roundEnd");
      const cards2 = target.getCards("he");
      if (!cards2.length) {
        return;
      }
      const next = target.addToExpansion(cards2, "giveAuto", target);
      next.gaintag.add(skill);
      await next;
    },
    getSelected(player) {
      const historys = game.getRoundHistory(
        "everything",
        (evt) => {
          return evt.player == player && evt.name == "sxrmhanguo";
        },
        void 0,
        1
      );
      if (!historys.length) {
        return [];
      }
      return historys.map((evt) => evt.targets || []).flat();
    },
    init(player, skill) {
      player.addSkill("sxrmhanguo_effect");
    },
    derivation: "hujia",
    subSkill: {
      effect: {
        charlotte: true,
        audio: "sxrmhanguo",
        trigger: {
          source: "damageSource"
        },
        filter(event, player) {
          if (event.card?.name != "sha" || !event.player?.isIn()) {
            return false;
          }
          return event.player.getStorage("sxrmhanguo_hujia")?.includes(player);
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          await trigger.player.die({ source: player });
        },
        ai: {
          jueqing: true,
          skillTagFilter(player, tag, arg) {
            return arg?.getStorage("sxrmhanguo_hujia")?.includes(player);
          }
        }
      },
      hujia: {
        inherit: "hujia",
        charlotte: true,
        sourceSkill: "hujia",
        name: "护驾",
        nopop: true,
        audio: "hujia",
        filter(event, player) {
          if (event.responded) {
            return false;
          }
          if (player.storage.hujiaing) {
            return false;
          }
          if (!event.filterCard(get.autoViewAs({ name: "shan", isCard: true }), player, event)) {
            return false;
          }
          return game.hasPlayer((current) => current != player);
        },
        async content(event, trigger, player) {
          const start = _status.currentPhase == player ? _status.currentPhase.getNext() : _status.currentPhase || player;
          while (true) {
            let bool;
            if (!event.current) {
              event.current = start;
            } else if (event.current == start) {
              return;
            }
            if (event.current == player) {
              event.current = event.current.getNext();
              continue;
            }
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
              const targets = player.getStorage(event.name).filter((current) => current.countGainableCards(event.current, "he"));
              if (!targets.length) {
                return;
              }
              const result = targets.length > 1 ? await event.current.chooseTarget(`撼国：获得${get.translation(targets)}中的一名角色一张牌`, true, (card, player2, target) => {
                return get.event().selectTargets.includes(target);
              }).set("selectTargets", targets).set("ai", (target) => {
                const player2 = get.player();
                return get.effect(target, { name: "shunshou_copy2" }, player2, player2);
              }).forResult() : {
                bool: true,
                targets
              };
              if (result?.bool) {
                const target = result.targets[0];
                await event.current.gainPlayerCard(target, "he", true);
              }
              return;
            } else {
              event.current = event.current.getNext();
            }
          }
        },
        ai: {
          respondShan: true,
          skillTagFilter(player) {
            if (player.storage.hujiaing) {
              return false;
            }
            return game.hasPlayer((current) => current != player);
          }
        },
        marktext: "标",
        intro: {
          name: "撼国",
          markcount: "expansion",
          mark(dialog, storage, player) {
            const cards2 = player.getExpansions("sxrmhanguo_hujia");
            if (player.isUnderControl(true)) {
              dialog.addAuto(cards2);
            } else {
              return "共有" + get.cnNumber(cards2.length) + "张牌";
            }
          }
        },
        onremove(player, skill) {
          const targets = player.getStorage(skill);
          if (targets.length) {
            targets.forEach((current) => {
              player.removeTip(`${skill}_${current.playerid}`);
            });
          }
          const cards2 = player.getExpansions(skill);
          if (cards2.length) {
            if (_status.event.name == "die") {
              player.loseToDiscardpile(cards2);
            } else {
              player.gain(cards2, "draw");
              game.log(player, "收回了" + get.cnNumber(cards2.length) + "张“撼国”牌");
            }
          }
          player.setStorage(skill, null);
        }
      }
    }
  },
  sxrmweiwo: {
    audio: 2,
    trigger: {
      player: "phaseJieshuBegin"
    },
    limited: true,
    skillAnimation: true,
    animationColor: "fire",
    async cost(event, trigger, player) {
      const result = await player.chooseButtonTarget({
        createDialog: [get.prompt2(event.skill), [["rende", "qingnang", "longyin"], "skill"]],
        selectButton: [1, 3],
        filterTarget: lib.filter.notMe,
        selectTarget() {
          return ui.selected?.buttons?.length;
        },
        complexSelect: true,
        complexTarget: true,
        targetprompt(target) {
          const index = ui.selected.targets?.indexOf(target);
          if (index >= 0) {
            return get.translation(ui.selected.buttons[index]);
          }
          return "";
        },
        ai1: () => Math.random(),
        ai2(target) {
          return Math.max(0.1, get.attitude(get.player(), target));
        }
      }).forResult();
      if (result.bool) {
        event.result = {
          bool: true,
          targets: result.targets,
          cost_data: result.links
        };
      }
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const { targets, cost_data: skills2 } = event;
      for (let i = 0; i < targets.length; i++) {
        const skill = `${event.name}_${skills2[i]}`;
        targets[i].markAuto(skill, player);
        await targets[i].addSkills(skill);
        get.info(skill).init(targets[i], skill);
      }
      await player.addSkills("old_wushen");
    },
    derivation: ["rende", "qingnang", "longyin", "old_wushen"],
    subSkill: {
      rende: {
        inherit: "rende",
        sourceSkill: "rende",
        duplicatePrefix(player, skill) {
          const targets = player.getStorage(skill);
          if (targets.length == 1) {
            return `${get.translation(targets)}·`;
          }
          return "魔";
        },
        name: "仁德",
        audio: "rende",
        init(player, skill) {
          player.getStorage(skill).forEach((current) => {
            player.addTip(`${skill}_${current.playerid}`, `${get.translation(skill)} ${get.translation(current)}`);
          });
        },
        onremove(player, skill) {
          player.getStorage(skill).forEach((current) => {
            player.removeTip(`${skill}_${current.playerid}`);
          });
          player.setStorage(skill, null);
        },
        filterTarget(card, player, target) {
          if (!player.getStorage("sxrmweiwo_rende").length) {
            return player != target;
          }
          return player != target && player.getStorage("sxrmweiwo_rende").includes(target);
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
            if (evt.getParent().skill == "sxrmweiwo_rende" && evt.getParent(3) == evt2) {
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
            if (evt.getParent(2).name == "sxrmweiwo_rende" && evt.getParent(5) == evt2) {
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
      qingnang: {
        inherit: "qingnang",
        sourceSkill: "qingnang",
        duplicatePrefix(player, skill) {
          const targets = player.getStorage(skill);
          if (targets.length == 1) {
            return `${get.translation(targets)}·`;
          }
          return "魔";
        },
        name: "青囊",
        audio: "qingnang",
        init(player, skill) {
          player.getStorage(skill).forEach((current) => {
            player.addTip(`${skill}_${current.playerid}`, `${get.translation(skill)} ${get.translation(current)}`);
          });
        },
        onremove(player, skill) {
          player.getStorage(skill).forEach((current) => {
            player.removeTip(`${skill}_${current.playerid}`);
          });
          player.setStorage(skill, null);
        },
        filterTarget(card, player, target) {
          if (target.hp >= target.maxHp) {
            return false;
          }
          if (!player.getStorage("sxrmweiwo_qingnang").length) {
            return true;
          }
          return player.getStorage("sxrmweiwo_qingnang").includes(target);
        }
      },
      longyin: {
        inherit: "longyin",
        sourceSkill: "longyin",
        duplicatePrefix(player, skill) {
          const targets = player.getStorage(skill);
          if (targets.length == 1) {
            return `${get.translation(targets)}·`;
          }
          return "魔";
        },
        name: "龙吟",
        audio: "longyin",
        init(player, skill) {
          player.getStorage(skill).forEach((current) => {
            player.addTip(`${skill}_${current.playerid}`, `${get.translation(skill)} ${get.translation(current)}`);
          });
        },
        onremove(player, skill) {
          player.getStorage(skill).forEach((current) => {
            player.removeTip(`${skill}_${current.playerid}`);
          });
          player.setStorage(skill, null);
        },
        filter(event, player) {
          if (player.getStorage("sxrmweiwo_longyin").length && !player.getStorage("sxrmweiwo_longyin").includes(event.player)) {
            return false;
          }
          return event.card.name == "sha" && player.countCards("he") > 0 && event.player.isPhaseUsing();
        }
      }
    }
  },
  old_wushen: {
    mod: {
      cardname(card, player, name) {
        if (get.suit(card) == "heart") {
          return "sha";
        }
      },
      cardnature(card, player) {
        if (get.suit(card) == "heart") {
          return false;
        }
      },
      targetInRange(card) {
        if (card.name === "sha") {
          const suit = get.suit(card);
          if (suit === "heart" || suit === "unsure") {
            return true;
          }
        }
      }
    },
    audio: "wushen",
    trigger: {
      player: "useCard"
    },
    forced: true,
    filter(event, player) {
      return !event.audioed && event.card.name == "sha" && get.suit(event.card) == "heart";
    },
    async content(event, trigger, player) {
      trigger.audioed = true;
    },
    ai: {
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "respondSha") && current < 0) {
            return 0.6;
          }
        }
      }
    }
  },
  //关银屏
  sxrmyinmou: {
    audio: 2,
    trigger: {
      global: ["loseAfter", "loseAsyncAfter", "equipAfter", "addJudgeAfter", "addToExpansionAfter", "gainAfter"]
    },
    filter(event, player) {
      const evts = game.getGlobalHistory("everything", (evt) => {
        return evt?.sxrmConnectCardsMap?.has?.(player);
      });
      return evts.indexOf(event) == 0;
    },
    forced: true,
    locked: false,
    logTarget(event, player) {
      const map = event.sxrmConnectCardsMap;
      return Array.from(map.keys()).sortBySeat();
    },
    async content(event, trigger, player) {
      const targets = event.targets;
      const func = async (target) => {
        await target.draw(Math.min(5, targets.length));
      };
      await game.doAsyncInOrder(targets, func);
    },
    global: "sxrmyinmou_global",
    subSkill: {
      global: {
        trigger: { player: "phaseJieshuBegin" },
        filter(event, player) {
          if (!player.hasSex("male") || !player.countCards("h", (card) => !get.is.connectedCard(card))) {
            return false;
          }
          return game.hasPlayer((current) => {
            return current.hasSkill("sxrmyinmou") && current.countCards("h", (card) => !get.is.connectedCard(card));
          });
        },
        async cost(event, trigger, player) {
          event.result = await player.chooseTarget(get.prompt("sxrmyinmou"), "连接你与一名拥有〖姻谋〗的角色各一张未连接的手牌", (card, player2, target) => {
            return target.hasSkill("sxrmyinmou") && target.countCards("h", (card2) => !get.is.connectedCard(card2));
          }).set("ai", (target) => {
            return get.attitude(get.player(), target) / (1 + target.countConnectedCards());
          }).forResult();
        },
        async content(event, trigger, player) {
          const target = event.targets[0], connects = /* @__PURE__ */ new Map();
          for (const current of [target, player].sortBySeat().toUniqued()) {
            const cards2 = current.getCards("h", (card) => !get.is.connectedCard(card));
            if (!current.isIn() || !cards2.length) {
              continue;
            }
            const result = cards2.length == 1 ? { bool: true, links: cards2 } : await player.choosePlayerCard(current, "h", true).set("filterButton", (button) => {
              return !get.is.connectedCard(button.link);
            }).forResult();
            if (result?.bool) {
              connects.set(current, result.links);
            }
          }
          for (const [current, cards2] of connects) {
            await current.connectCards(cards2);
          }
        }
      }
    }
  },
  sxrmquchi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: true,
    async content(event, trigger, player) {
      const { target } = event;
      const cards2 = target.getConnectedCards();
      let num = cards2.length ? 2 : 1;
      if (cards2.length) {
        await target.resetConnectedCards(cards2);
      }
      const next = target.damage("fire");
      next.num = num;
      await next;
    },
    ai: {
      order: 8,
      result: {
        target(player, target) {
          return get.damageEffect(target, player, target, "fire");
        }
      }
    }
  },
  //于禁
  sxrmsuwu: {
    audio: 2,
    trigger: {
      player: "phaseZhunbeiBegin",
      global: "useCard"
    },
    filter(event, player) {
      if (event.name == "useCard") {
        if ([player, event.player].some((current) => {
          return !current.hasConnectedCards();
        })) {
          return false;
        }
        const evts = event.player.getHistory("useCard", (evt) => get.is.damageCard(evt.card));
        return evts.indexOf(event) == 0;
      }
      return game.hasPlayer((current) => current.countCards("h"));
    },
    async cost(event, trigger, player) {
      if (trigger.name == "useCard") {
        event.result = {
          bool: true,
          targets: [trigger.player]
        };
      } else {
        event.result = await player.chooseTarget(get.prompt(event.skill), "连接至多四名角色各一张手牌", [1, 4], (card, player2, target) => {
          return target.countCards("h");
        }).set("ai", (target) => {
          const player2 = get.player();
          const att = get.sgnAttitude(player2, target);
          if (!ui.selected.targets.length) {
            if (player2 == target && (player2.isDamaged() && player2.hasValueTarget({ name: "tao" }) || player2 == _status.currentPhase)) {
              return 12;
            }
            if (att > 0 && target == _status.currentPhase?.getNext()) {
              return 10;
            }
            return -att / (1 + target.countConnectedCards());
          }
          return -att / (1 + target.countConnectedCards());
        }).forResult();
      }
    },
    async content(event, trigger, player) {
      if (trigger.name == "useCard") {
        trigger.directHit.addArray(game.players);
        trigger.player.when("useCardAfter").filter((evt) => evt == trigger).step(async (event2, trigger2, player2) => {
          await player2.draw(2);
        });
      } else {
        const targets = event.targets, connects = /* @__PURE__ */ new Map();
        for (const current of targets.sortBySeat()) {
          const cards2 = current.getCards("h");
          if (!current.isIn() || !cards2.length) {
            continue;
          }
          const result = cards2.length == 1 ? { links: cards2 } : await player.choosePlayerCard(current, "h", true).set("ai", (button) => {
            const { player: player2, target } = get.event();
            const { link } = button;
            const att = get.attitude(player2, target);
            let val = get.value(link, target);
            if (att > 0) {
              if (player2 == target && player2 == _status.currentPhase) {
                const num = target.countConnectedCards();
                if (num > 0) {
                  if (get.is.connectedCard(link)) {
                    val += 3;
                  }
                  return val;
                } else if (!get.is.connectedCard(link) && !get.tag(link, "damage")) {
                  return 6.5 - val;
                }
                return 6 - val;
              }
              if (get.is.connectedCard(link)) {
                val += 3;
              }
              return val;
            }
            if (!get.is.connectedCard(link)) {
              val += 3;
            }
            return val;
          }).forResult();
          if (result?.links?.length) {
            connects.set(current, result.links);
          }
        }
        for (const [current, cards2] of connects) {
          await current.connectCards(cards2);
        }
      }
    }
  },
  sxrmrenwang: {
    audio: 2,
    enable: "chooseToUse",
    viewAsFilter(player) {
      return player.hasConnectedCards();
    },
    filterCard(card) {
      return get.is.connectedCard(card);
    },
    position: "h",
    viewAs: { name: "tao" },
    prompt: "将一张连接牌当桃使用",
    check(card) {
      return 15 - get.value(card);
    },
    ai: {
      save: true,
      order(item, player) {
        const num = game.filterPlayer((current) => player != current).reduce((sum, current) => sum + current.countConnectedCards() * -get.sgnAttitude(player, current), 0);
        if (num > 0) {
          return 10;
        }
        return get.order({ name: "tao" }) + 0.1;
      }
    }
  },
  //糜芳
  sxrmhuoe: {
    audio: 2,
    trigger: {
      player: "phaseJieshuBegin"
    },
    filter(event, player) {
      const card = new lib.element.VCard({ name: "huogong", isCard: true });
      return game.hasPlayer((current) => current != player && player.canUse(card, current));
    },
    async cost(event, trigger, player) {
      const card = new lib.element.VCard({ name: "huogong", isCard: true });
      event.result = await player.chooseTarget(
        get.prompt2(event.skill),
        (card2, player2, target) => {
          const { huogong } = get.event();
          return target != player2 && player2.canUse(huogong, target);
        },
        [1, 4]
      ).set("huogong", card).set("ai", (target) => {
        const { huogong, player: player2 } = get.event();
        return get.effect(target, huogong, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const card = new lib.element.VCard({ name: "huogong", isCard: true, storage: { huoe: true } }), targets = event.targets;
      player.addTempSkill("sxrmhuoe_effect");
      const next = player.useCard(card, targets);
      await next;
      player.removeSkill("sxrmhuoe_effect");
      const cards2 = game.getGlobalHistory("everything", (evt) => {
        return evt.name == "showCards" && evt.getParent((evtx) => evtx == next, true);
      }).reduce((arr, evt) => arr.concat(evt.cards ?? []), []);
      if (!cards2.length) {
        return;
      }
      let num = 0;
      while (cards2.length) {
        const card2 = cards2.shift();
        num += get.number(card2);
        const result = await player.chooseTarget(`火厄：分配${get.translation(card2)}给一名角色`, true).set("ai", (target) => {
          const { cardx, player: player2 } = get.event();
          return get.value(cardx, target) * get.attitude(player2, target);
        }).set("cardx", card2).forResult();
        if (result?.bool) {
          const target = result.targets[0], owner = get.owner(card2);
          if (!owner) {
            await target.gain(card2, "gain2");
          } else if (target != owner) {
            await owner.give(card2, target, true);
          }
        }
      }
      if (num < 13) {
        await player.loseHp();
      }
    },
    subSkill: {
      effect: {
        trigger: {
          player: "chooseToDiscardBegin"
        },
        charlotte: true,
        filter(event, player) {
          const evt = event.getParent();
          return evt.name == "huogong" && evt.card?.storage?.huoe;
        },
        async cost(event, trigger, player) {
          if (player.countCards(trigger.position, (card) => {
            if (!lib.filter.cardDiscardable(card, player, trigger)) {
              return false;
            }
            return trigger.filterCard(card, player);
          })) {
            trigger.forced = true;
            const evt = trigger.getParent(2);
            evt.targets.splice(evt.num + 1);
          } else if (player.countCards("h")) {
            const evt = trigger.getParent();
            const next = evt.target.viewHandcards(player);
            event.next.remove(next);
            trigger.next.push(next);
          }
        }
      }
    }
  },
  sxrmtanduo: {
    audio: 2,
    trigger: { player: "phaseChange" },
    forced: true,
    filter(event, player) {
      if (!event.phaseList[event.num].startsWith("phaseDiscard")) {
        return false;
      }
      return player.needsToDiscard();
    },
    async content(event, trigger, player) {
      trigger.phaseList[trigger.num] = `phaseDraw|${event.name}`;
      await game.delayx();
    }
  },
  //寇封
  sxrmhuaibing: {
    audio: 2,
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    filter(event, player) {
      return game.countPlayer((current) => current.countCards("h")) >= 2;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), 2, (card, player2, target) => {
        return target.countCards("h");
      }).set("ai", (target) => {
        const player2 = get.player();
        let eff = get.effect(target, { name: "shunshou_copy2" }, player2, player2), count = player2.countCards("h", { color: "red" }) - 2;
        if (ui.selected.targets.length) {
          const first = ui.selected.targets[0];
          if (first.hp != target.hp) {
            const current = first.hp > target.hp ? target : first;
            return eff + get.effect(current, { name: "wuzhong" }, current, player2) * count;
          }
        }
        return eff;
      }).forResult();
    },
    async content(event, trigger, player) {
      const gains = event.targets.filter((current2) => current2 != player && current2.countCards("h"));
      if (gains.length) {
        await player.gainMultiple(gains, "h");
      }
      await player.showHandcards(`${get.translation(player)}发动了【怀兵】`);
      const num = event.targets.reduce((sum, current2) => sum + current2.getHp(), 0) / 2, current = event.targets.find((current2) => current2.getHp() < num);
      if (!current) {
        return;
      }
      const red = player.countCards("h", { color: "red" });
      for (const key of ["Draw", "Use", "Discard"]) {
        current.addTempSkill(`${event.name}_${key}`, { player: `phase${key}After` });
        current.setStorage(`${event.name}_${key}`, red);
        current.markSkill(`${event.name}_${key}`);
      }
    },
    subSkill: {
      Draw: {
        charlotte: true,
        marktext: "摸",
        intro: {
          content: "下个摸牌阶段摸牌数改为#"
        },
        onremove: true,
        trigger: {
          player: "phaseDrawBegin2"
        },
        filter(event, player) {
          const storage = player.getStorage("sxrmhuaibing_Draw", 0);
          return !event.numFixed && typeof storage == "number";
        },
        firstDo: true,
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          trigger.num = player.getStorage(event.name, 0);
          trigger.numFixed = true;
        }
      },
      Use: {
        charlotte: true,
        marktext: "杀",
        intro: {
          content: "下个出牌阶段出【杀】次数改为#"
        },
        onremove: true,
        trigger: {
          player: "phaseUseBegin"
        },
        filter(event, player) {
          const storage = player.getStorage("sxrmhuaibing_Use", 0);
          return typeof storage == "number";
        },
        firstDo: true,
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          player.when("phaseUseAfter").step(async () => {
          }).assign({
            mod: {
              cardUsable(card, player2, num) {
                const storage = player2.getStorage("sxrmhuaibing_Use", 0);
                if (typeof storage != "number" || card.name != "sha") {
                  return;
                }
                return storage;
              }
            }
          });
        }
      },
      Discard: {
        charlotte: true,
        marktext: "弃",
        intro: {
          content: "下个弃牌阶段手牌上限改为#"
        },
        onremove: true,
        trigger: {
          player: "phaseDiscardBegin"
        },
        filter(event, player) {
          const storage = player.getStorage("sxrmhuaibing_Discard", 0);
          return typeof storage == "number";
        },
        firstDo: true,
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          player.when("phaseDiscardAfter").step(async () => {
          }).assign({
            mod: {
              maxHandcardFinal(player2, num) {
                const storage = player2.getStorage("sxrmhuaibing_Discard", 0);
                if (typeof storage != "number") {
                  return;
                }
                return storage;
              }
            }
          });
        }
      }
    }
  },
  //陆逊
  sxrmchanyu: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => current != player);
    },
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const target = event.target;
      if (target.getHp() > 0) {
        await target.draw(target.getHp());
      }
      [player, target].forEach((current) => {
        const num = Math.min(...current.getCards("h").map((card) => get.number(card, current)));
        current.addGaintag(
          current.getCards("h", (card) => get.number(card, current) <= num),
          "sxrmchanyu_tag"
        );
      });
      const next = player.chooseToCompare(target);
      next.set("filterCard", (card, player2) => {
        const bool = (cardx) => cardx.hasGaintag("sxrmchanyu_tag");
        return !player2?.countCards("h", bool) || bool(card);
      });
      const result = await next.forResult();
      const func = async (current) => {
        current.removeGaintag("sxrmchanyu_tag");
        await current.showHandcards();
      };
      await game.doAsyncInOrder([player, target], func);
      if (result?.winner) {
        const winner = result.winner, loser = [player, target].find((current) => current != winner);
        const dialog = ui.create.dialog("谄谀：是否交换其中一种颜色或类别的所有手牌？", "你的手牌", winner.getCards("h"), `${get.translation(loser)}的手牌`, loser.getCards("h"));
        const result2 = await winner.chooseControl("red", "black", "basic", "equip", "trick", "cancel2").set("dialog", dialog).set("ai", () => get.event().resultx).set(
          "resultx",
          (() => {
            const getFilter = (card, key) => {
              if (["red", "black"].includes(key)) {
                return get.color(card) == key;
              }
              return get.type2(card) == key;
            };
            const getV = (key) => {
              if (key === "cancel2") {
                return 0;
              }
              const cards1 = winner.getCards("h", (card) => getFilter(card, key)), cards2 = loser.getCards("h", (card) => getFilter(card, key));
              let sum1 = cards1.reduce((sum, card) => {
                sum += get.value(card, winner);
                return sum;
              }, 0);
              let sum2 = cards2.reduce((sum, card) => {
                sum += get.value(card, loser);
                return sum;
              }, 0);
              if (get.attitude(winner, loser) > 0) {
                return Math.abs(sum1 - sum2);
              }
              return sum2 - sum1;
            };
            return ["red", "black", "basic", "equip", "trick", "cancel2"].maxBy(getV);
          })()
        ).forResult();
        if (result2?.control != "cancel2") {
          const control = result2.control, getC = (current) => {
            return current.getCards("h", (card) => {
              if (["red", "black"].includes(control)) {
                return get.color(card) == control;
              }
              return get.type2(card) == control;
            });
          };
          await winner.swapHandcards(loser, getC(winner), getC(loser));
        }
      }
    },
    ai: {
      order: 9,
      result: {
        player: -1,
        target(player, target) {
          return target.getHp() - 1;
        }
      }
    }
  },
  sxrmcongfeng: {
    audio: 2,
    mark: true,
    zhuanhuanji: true,
    marktext: "☯",
    intro: {
      content(storage, player, skill) {
        const bool = player.getStorage(skill, false);
        return `转换技，你使用牌或成为牌的目标后，你可以${bool ? "弃置使用者两张牌" : "与使用者各摸一张牌"}`;
      }
    },
    trigger: {
      player: "useCard",
      target: "useCardToTargeted"
    },
    filter(event, player) {
      if (!event.player?.isIn()) {
        return false;
      }
      const bool = player.getStorage("sxrmcongfeng", false);
      return !bool || event.player.countDiscardableCards(player, "he");
    },
    logTarget: "player",
    check(event, player) {
      const bool = player.getStorage("sxrmcongfeng", false), getV = (current, name) => get.effect(current, { name }, player, player);
      if (bool) {
        return getV(event.player, "guohe_copy2") > 0;
      }
      return getV(event.player, "draw") + getV(player, "draw") > 0;
    },
    async content(event, trigger, player) {
      const bool = player.getStorage(event.name, false);
      player.changeZhuanhuanji(event.name);
      if (bool) {
        const num = Math.min(2, trigger.player.countDiscardableCards(player, "he"));
        if (num > 0) {
          await player.discardPlayerCard(trigger.player, "he", num, true);
        }
      } else {
        await game.asyncDraw([player, trigger.player]);
      }
    }
  },
  //吕蒙
  sxrmkongzhi: {
    audio: 2,
    trigger: {
      player: "useCardToPlayered",
      global: "useCard"
    },
    filter(event, player, name) {
      if (name == "useCard") {
        return player.isDamaged() && get.type(event.card) == "trick" && event.targets?.includes(player);
      }
      return event.card?.name == "sha" && event.targets?.length === 1 && event.target.countGainableCards(player, "he");
    },
    forced: true,
    async content(event, trigger, player) {
      if (event.triggername == "useCard") {
        trigger.excluded.add(player);
        await game.delayx();
      } else {
        await player.gainPlayerCard(trigger.target, "he", [1, 3], true);
      }
    },
    mod: {
      cardname(card, player) {
        if (player.isDamaged() && lib.card[card.name].type == "basic") {
          return "shan";
        }
      }
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (!target.isDamaged()) {
            return;
          }
          if (get.type(card) == "trick") {
            return "zeroplayertarget";
          }
          if (get.name(card) == "sha") {
            return 0.3;
          }
        }
      }
    }
  },
  sxrmbizha: {
    audio: 2,
    trigger: {
      player: "phaseJieshuBegin"
    },
    async content(event, trigger, player) {
      await player.draw();
      const targets = game.filterPlayer((current) => player.canCompare(current));
      if (!targets.length) {
        return;
      }
      const result = targets.length > 1 ? await player.chooseTarget("鄙诈：与一名角色拼点", true, (card, player2, target) => player2.canCompare(target)).set("ai", (target) => {
        return -get.attitude(get.player(), target);
      }).forResult() : {
        bool: true,
        targets
      };
      if (result?.bool) {
        const target = result.targets[0];
        const result2 = await player.chooseToCompare(target).forResult();
        if (result2?.winner != target) {
          await target.loseHp(2);
          let num = 0;
          while (num < 2 && target?.isIn() && target.countCards("h")) {
            const result3 = await player.chooseButton([`鄙诈：是否使用其中一张点数小于${result2.num2}的牌？（${num}/2）`, target.getCards("h")]).set("filterButton", (button) => {
              const { player: player2, maxNum } = get.event(), card = button.link;
              if (get.number(card) >= maxNum) {
                return false;
              }
              return player2.hasUseTarget(card);
            }).set("maxNum", result2.num2).set("ai", (button) => {
              const { player: player2 } = get.event();
              return player2.getUseValue(button.link);
            }).forResult();
            if (result3?.bool) {
              await player.chooseUseTarget(result3.links[0], true);
            } else {
              break;
            }
            num++;
          }
        }
        if (result2?.winner != player) {
          await player.loseMaxHp();
        }
      }
    }
  },
  //庞德
  sxrmnuozhan: {
    audio: 2,
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    filter(event, player) {
      return game.hasPlayer((current) => current != player);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), lib.filter.notMe).set("ai", (target) => get.damageEffect(target, get.player(), get.player())).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      while (target?.isIn()) {
        await player.draw();
        const names = get.inpileVCardList((info) => {
          if (info[0] == "delay") {
            return false;
          }
          const card2 = new lib.element.VCard({ name: info[2], nature: info[3], isCard: true });
          return get.tag(card2, "damage");
        });
        if (!names.length) {
          return;
        }
        const result = await target.chooseButton(["声明一种伤害类牌", [names, "vcard"]], true).set("ai", (button) => {
          const { player: player2, kuangtu } = get.event(), card2 = new lib.element.VCard({ name: button.link[2], nature: button.link[3], isCard: true });
          let eff = Math.max(get.effect(player2, card2, kuangtu, kuangtu), get.effect(kuangtu, card2, player2, kuangtu));
          return eff;
        }).set("kuangtu", player).forResult();
        if (!result?.bool) {
          return;
        }
        const card = new lib.element.VCard({ name: result.links[0][2], nature: result.links[0][3], isCard: true });
        const targets = [player, target].filter((current) => current.canUse(card, current == player ? target : player, false));
        if (!targets?.length) {
          return;
        }
        const result2 = targets.length > 1 ? await player.chooseTarget(
          `选择${get.translation(card)}的使用者`,
          (card2, player2, target2) => {
            return get.event().canUse.includes(target2);
          },
          true
        ).set("canUse", targets).set("targetx", target).set("willUse", card).set("ai", (target2) => {
          const { player: player2, targetx: targetx2, willUse } = get.event();
          if (target2 == player2) {
            return get.effect(targetx2, willUse, target2, player2);
          }
          return get.effect(player2, willUse, target2, player2);
        }).forResult() : {
          bool: true,
          targets
        };
        if (!result2?.bool) {
          return;
        }
        const user = result2.targets[0], targetx = [player, target].remove(user)[0];
        const next = user.useCard(card, targetx);
        next.baseDamage ??= 1;
        next.baseDamage++;
        await next;
        if (next.targets?.length && next.targets.some((current) => {
          return current.hasHistory("damage", (evt) => evt.card == next.card);
        })) {
          break;
        }
        await user.loseHp();
        if (!player?.isIn() || !target?.isIn()) {
          return;
        }
        const { bool } = await player.chooseBool(`是否继续对${get.translation(target)}搦战？`).set("choice", player.hp > 1).forResult();
        if (!bool) {
          break;
        }
      }
    }
  },
  //颜良文丑
  sxrmhaibian: {
    audio: 2,
    trigger: {
      global: "phaseBegin"
    },
    filter(event, player) {
      const historys = player.actionHistory;
      if (historys.length <= 1) {
        return false;
      }
      const { useCard, lose } = historys[historys.length - 2];
      return useCard.some(
        (evt) => lose.some((evtx) => {
          const evtxx = evtx.relatedEvent || evtx.getParent();
          return evtx.hs.length > 0 && evtxx == evt;
        })
      );
    },
    forced: true,
    locked: false,
    async content(event, trigger, player) {
      const historys = _status.globalHistory;
      if (historys.length <= 1) {
        return;
      }
      const { useCard } = historys[historys.length - 2];
      let black, red;
      for (let i = useCard.length - 1; i >= 0; i--) {
        const evt = useCard[i], color = get.color(evt.card);
        if (color === "black" && !black) {
          black = evt.player;
        }
        if (color === "red" && !red) {
          red = evt.player;
        }
        if (black && red) {
          break;
        }
      }
      for (const current of [black, red]) {
        if (current?.isIn()) {
          const card = new lib.element.VCard({ name: "juedou", isCard: true });
          if (current.hasUseTarget(card)) {
            await current.chooseUseTarget(card, "是否使用【决斗】？");
          }
        }
      }
    }
  },
  sxrmqiewang: {
    audio: 2,
    trigger: {
      global: "damageEnd"
    },
    filter(event, player) {
      return event.player?.isIn() && get.distance(player, event.player) <= 1;
    },
    forced: true,
    async content(event, trigger, player) {
      await player.draw();
      player.when({
        global: ["phaseAfter", "phaseBeforeStart"]
      }).step(async () => {
      }).assign({
        mod: {
          cardname(card, player2) {
            if (get.position(card) == "h") {
              return "wuxie";
            }
          }
        }
      });
    }
  },
  //疑包
  //曹操 -by.柴油鹿鹿
  sxrmkuxin: {
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return game.hasPlayer((current) => {
        return current !== player && current.countCards("h") > 0;
      });
    },
    check(event, player) {
      if (player.isTurnedOver()) {
        return true;
      }
      if (game.countPlayer((current) => {
        if (current === player) {
          return 0;
        }
        if (get.attitude(player, current) > 0) {
          return current.countCards("h") >= 4;
        }
        return current.countCards("h");
      }) < 4 / (1 + player.getHp())) {
        return false;
      }
      return true;
    },
    logTarget(event, player) {
      return game.filterPlayer((current) => current !== player).sortBySeat(_status.currentPhase);
    },
    async content(event, trigger, player) {
      const { targets } = event, list = [];
      for (const target of targets) {
        if (!target.countCards("h")) {
          continue;
        }
        const result2 = await target.chooseCard("枯心：展示任意张手牌", "h", [1, Infinity], true, "allowChooseAll").set("targetx", player).set("ai", (card) => {
          const { player: player2, targetx } = get.event();
          let att = get.attitude(player2, targetx);
          let val = get.value(card);
          if (get.suit(card, false) === "heart") {
            return att * 10086 - val;
          }
          if (att < 0) {
            val = -val;
          } else if (att > 0) {
            val = get.value(card, targetx) - val;
          }
          return val;
        }).forResult();
        if (!result2?.cards?.length) {
          continue;
        }
        list.push([result2.cards, target]);
        await target.showCards(result2.cards);
        await game.delay();
      }
      let result, gains = [];
      if (list.length) {
        result = await player.chooseButtonTarget({
          createDialog: [
            "枯心：请选择一项执行",
            [
              list.flatMap(([cards2, target]) => {
                return cards2.map((card) => [card, target]);
              }),
              (item, type, position, noclick, node) => {
                node = ui.create.buttonPresets.card(item[0], type, position, noclick);
                game.createButtonCardsetion(item[1].getName(true), node);
                return node;
              }
            ],
            [
              ["获得所有角色的展示牌", "获得一名角色的未展示牌"].map((item, i) => {
                return [i, item];
              }),
              "tdnodes"
            ],
            [
              (dialog) => {
                dialog.css({ top: get.is.phoneLayout() ? "20%" : "40%" });
                dialog.buttons.forEach((button) => {
                  if (typeof button.link == "number") {
                    button.style.setProperty("width", "200px", "important");
                    button.style.setProperty("text-align", "left", "important");
                  } else {
                    button.style.setProperty("opacity", "1", "important");
                  }
                });
                dialog.buttons = dialog.buttons.filter((button) => typeof button.link == "number");
              },
              "handle"
            ]
          ],
          forced: true,
          filterTarget: lib.filter.notMe,
          selectTarget() {
            if (ui.selected.buttons.length) {
              const { link: link2 } = ui.selected.buttons[0];
              if (link2 == 1) {
                return 1;
              }
              return 0;
            }
            return 0;
          },
          filterOk() {
            if (ui.selected.buttons.length) {
              const { link: link2 } = ui.selected.buttons[0];
              if (link2 == 1) {
                return ui.selected.targets.length == 1;
              }
              return link2 == 0;
            }
            return false;
          },
          list,
          ai1(button) {
            const player2 = get.player();
            const cards2 = get.event().list?.map((i) => i[0]).flat() || [];
            const { num } = get.event().getTrigger();
            const { link: link2 } = button;
            if (typeof link2 !== "number") {
              return 0;
            }
            if (link2 == 1) {
              if (player2.isTurnedOver() && cards2.some((card) => get.suit(card, false) === "heart")) {
                return 2;
              }
              if (cards2.length <= num * 2 && game.hasPlayer((current) => current != player2 && current.countCards("h", (cardx) => !cards2?.includes(cardx)) > cards2.length && get.attitude(player2, current) < 0)) {
                return 2;
              }
            }
            if (link2 == 0 && cards2.some((card) => get.suit(card, false) === "heart")) {
              return 1;
            }
            return 1;
          },
          ai2(target) {
            if (ui.selected.buttons[0].link == 0) {
              return 1;
            }
            const player2 = get.player();
            const cards2 = get.event().list?.map((i) => i[0]).flat();
            return -get.attitude(player2, target) * target.countCards("h", (cardx) => !cards2?.includes(cardx));
          }
        }).forResult();
        if (!result?.links?.length) {
          return;
        }
        const [link] = result.links;
        if (link == 0) {
          game.log(player, "选择了", "#g【枯心】", "的", "#y选项一");
          gains = list.flatMap(([cards2, target]) => {
            return cards2.filter((card) => lib.filter.canBeGained(card, target, player));
          });
        } else if (link == 1 && result?.targets?.length) {
          game.log(player, "选择了", "#g【枯心】", "的", "#y选项二");
          const [target] = result.targets;
          player.line(target);
          gains = target.getCards("h", (card) => !list.flatMap((i) => i[0]).includes(card) && lib.filter.canBeGained(card, target, player));
        }
      } else if (game.hasPlayer((target) => target != player)) {
        const targets2 = game.filterPlayer((target) => target != player);
        result = targets2.length == 1 ? { bool: true, targets: targets2 } : await player.chooseTarget("枯心：选择一名其他角色获得其未展示的手牌", true, lib.filter.notMe).set("ai", (target) => {
          const player2 = get.player();
          return -get.attitude(player2, target) * target.countCards("h");
        }).forResult();
        if (result?.targets?.length) {
          game.log(player, "选择了", "#g【枯心】", "的", "#y选项二");
          const [target] = result.targets;
          player.line(target);
          gains = target.getCards("h", (card) => lib.filter.canBeGained(card, target, player));
        }
      }
      if (gains.length) {
        await player.gain(gains, "gain2");
        await player.showCards(gains);
      }
      if (!gains.some((card) => get.suit(card, false) === "heart")) {
        if (gains.length) {
          await player.discard(gains);
        }
        await player.turnOver();
      }
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      threaten(player, target) {
        if (target.getHp() == 1) {
          return 2.5;
        }
        return 0.5;
      },
      effect: {
        target(card, player, target) {
          if (!target._dekuxin_eff && get.tag(card, "damage") && target.getHp() > (player.hasSkillTag("damageBonus", true, {
            card,
            target
          }) ? 2 : 1)) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return [1, -2];
            }
            target._dekuxin_eff = true;
            let gain = game.countPlayer((current) => {
              if (target == current) {
                return 0;
              }
              if (get.attitude(target, current) > 0) {
                return 0;
              }
              if (current.hasCard((cardx) => lib.filter.canBeGained(cardx, target, current, "sxrmkuxin"), "h")) {
                return 0.9;
              }
              return 0;
            });
            if (target.isTurnedOver()) {
              gain += 2.3;
            } else {
              gain -= 2.3;
            }
            delete target._dekuxin_eff;
            return [1, Math.max(0, gain)];
          }
        }
      }
    }
  },
  sxrmsigu: {
    enable: "phaseUse",
    usable: 1,
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const target = event.targets[0];
      const result = await target.judge().forResult();
      if (!result.number) {
        return;
      }
      const name = get.info(event.name).pasts[result.number - 1], skill = get.info(event.name).derivation[result.number - 1];
      const mark = `desigu_${player.playerid}`;
      if (name) {
        await target.addAdditionalSkills(mark, [skill], true);
        target.addTip(mark, `似故 ${get.translation(skill)}`);
        target.setAvatar(target.name, name);
      } else {
        player.chat("孩子你是谁？");
      }
      await target.damage();
      await target.damage();
      if (name) {
        target.removeAdditionalSkills(mark);
        target.removeTip(mark);
        target.setAvatar(target.name, target.name);
      }
    },
    //不太会写ai，随便写了点简单的情况
    ai: {
      order: 1,
      result: {
        target(player, target) {
          if ((target.hasSkillTag("maixie") || target.hasSkillTag("maixie_hp")) && get.attitude(player, target) < 0) {
            return 0;
          }
          if (get.attitude(player, target) < 0 && target.getHp() + target.hujia <= 1) {
            return -1;
          }
          if ((target.hasSkillTag("maixie") || target.hasSkillTag("maixie_hp")) && get.attitude(player, target) > 0 && target.getHp() + target.hujia >= 3) {
            return 2;
          }
          if (get.attitude(player, target) > 0 && target.getHp() + target.hujia >= 4) {
            return 1;
          }
          if (get.attitude(player, target) == 0 && target.getHp() + target.hujia >= 2) {
            return 1;
          }
          return 0;
        }
      },
      tag: {
        damage: 1
      }
    },
    pasts: ["chengong", "re_xiahoudun", "re_simayi", "re_guojia", "ol_xunyu", "sb_caopi", "shenpei", "re_caochong", "re_xunyou", "yangxiu", "chengyu", "xizhicai", "shen_guanyu"],
    derivation: ["zhichi", "reganglie", "refankui", "new_reyiji", "oljieming", "fangzhu", "shibei", "rechengxiang", "zhiyu", "jilei", "benyu", "chouce", "new_wuhun"]
  },
  //刘备
  sxrmchengbian: {
    trigger: {
      player: ["phaseZhunbeiBegin", "phaseJieshuBegin"]
    },
    filter(event, player) {
      return game.hasPlayer((current) => player.canCompare(current));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return player2.canCompare(target);
      }).set("ai", (target) => {
        const player2 = get.player();
        return get.effect(target, { name: "juedou" }, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const next = player.chooseToCompare(target).set("isDelay", true);
      await next;
      await game.delay();
      const card = new lib.element.VCard({ name: "juedou", isCard: true });
      if (player.canUse(card, target)) {
        const next2 = player.useCard(card, target);
        player.when({
          player: "useCardAfter"
        }).filter((evt) => evt === next2).step(async (event2, trigger2, player2) => {
          player2.removeSkill("sxrmchengbian_sha");
          target.removeSkill("sxrmchengbian_sha");
          const result = await game.createEvent("chooseToCompare", false).set("player", player2).set("parentEvent", next).setContent("chooseToCompareEffect").forResult();
          if (result?.winner) {
            await result.winner.drawTo(result.winner.maxHp);
          }
        });
        player.addTempSkill("sxrmchengbian_sha");
        target.addTempSkill("sxrmchengbian_sha");
        await next2;
        player.removeSkill("sxrmchengbian_sha");
        target.removeSkill("sxrmchengbian_sha");
      }
    },
    subSkill: {
      sha: {
        audio: "sxrmchengbian",
        enable: "chooseToRespond",
        filterCard: true,
        selectCard() {
          const player = get.player(), num = Math.ceil(player.countCards("h") / 2);
          return [num, Infinity];
        },
        position: "h",
        viewAs: { name: "sha" },
        viewAsFilter(player) {
          if (!player.countCards("h")) {
            return false;
          }
        },
        prompt: "将至少半数手牌当杀打出",
        allowChooseAll: true,
        check(card) {
          const player = get.player(), num = Math.ceil(player.countCards("h") / 2), val = get.value(card);
          if (ui.selected.cards.length >= num) {
            return 0;
          }
          return 1 / Math.max(0.1, val);
        },
        ai: {
          skillTagFilter(player) {
            if (!player.countCards("h")) {
              return false;
            }
          },
          respondSha: true
        }
      }
    }
  },
  //蒋干
  sxrmzongheng: {
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    filter(event, player) {
      return game.countPlayer((current) => current.countCards("h") && current != player) > 1;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), 2, (card, player2, target) => {
        return target.countCards("h") && target != player2;
      }).set("ai", (target) => {
        const player2 = get.player();
        return get.effect(target, { name: "guohe_copy2" }, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const targets = event.targets;
      const result = await player.chooseButton(["纵横：展示并获得其中一张", `###${get.translation(targets[0])}的手牌###`, targets[0].getCards("h"), `###${get.translation(targets[1])}的手牌###`, targets[1].getCards("h")], true).set("targets", targets).set("ai", (button) => {
        const { player: player2, targets: targets2 } = get.event(), owner2 = get.owner(button.link), other2 = targets2.find((i) => i != owner2);
        let eff1 = get.value(button.link), eff2 = other2 ? get.effect(other2, { name: "guohe_copy2" }, player2, player2) : 0;
        if (other2) {
          eff2 *= Math.min(
            3,
            other2.countCards("h", (card2) => {
              return ["suit", "type2", "number"].some((key) => {
                return get[key](card2, other2) == get[key](button.link, owner2);
              });
            })
          );
        }
        return eff1 + eff2;
      }).forResult();
      const card = result.links[0], owner = get.owner(card), other = targets.find((i) => i != owner), suit = get.suit(card, owner), num = get.number(card, owner), type = get.type2(card, owner);
      await owner.give(card, player);
      if (other) {
        if (!other.countCards("h", (cardx) => {
          return get.suit(cardx) == suit || get.number(cardx) == num || get.type2(cardx) == type;
        })) {
          return;
        }
        const result2 = await player.chooseToMove_new("纵横：弃置符合要求的牌各一张", true).set("list", [
          [get.translation(other) + "的手牌", other.getCards("h")],
          [[`花色为${get.translation(suit)}`], [`点数为${get.translation(num)}`], [`类型为${get.translation(type)}`]]
        ]).set("filterOk", (moved) => {
          let list = [null, "suit", "number", "type2"];
          for (let i = 1; i < 4; i++) {
            let key = list[i];
            if (moved[i].some((card2) => get[key](card2) != get.event()[key]) || moved[i].length > 1) {
              return false;
            }
          }
          return moved[1].length + moved[2].length + moved[3].length;
        }).set("filterMove", (from, to, moved) => {
          let list = [null, "suit", "number", "type2"];
          if (typeof to == "number") {
            if (to != 0) {
              return moved[to].length < 1 && get[list[to]](from.link) == get.event()[list[to]];
            }
            return true;
          }
          let num1 = [0, 1, 2, 3].find((i) => moved[i].includes(from.link)), num2 = [0, 1, 2, 3].find((i) => moved[i].includes(to.link));
          if (num1 != 0 && get[list[num1]](to.link) != get.event()[list[num1]]) {
            return false;
          }
          if (num2 != 0 && get[list[num2]](from.link) != get.event()[list[num2]]) {
            return false;
          }
          return true;
        }).set("processAI", (list) => {
          let cards2 = [], cardx = list[0][1].slice().sort((a, b) => get.value(b) - get.value(a)), discards = [[], [], []], keys = ["suit", "number", "type2"];
          for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let card2 = cardx.find((j) => !cards2.includes(j) && get[key](j) == get.event()[key]);
            if (card2) {
              cards2.add(card2);
              discards[i].add(card2);
            }
          }
          return [cardx.removeArray(cards2), ...discards];
        }).set("suit", suit).set("number", num).set("type2", type).forResult();
        if (result2.bool) {
          const cards2 = result2.moved.slice(1).flat();
          await other.modedDiscard(cards2, player);
        }
      }
    }
  },
  sxrmduibian: {
    trigger: {
      player: "damageBegin4"
    },
    filter(event, player) {
      if (!event.source || event.source == player) {
        return false;
      }
      if (!player.canCompare(event.source)) {
        return false;
      }
      return game.getGlobalHistory(
        "everything",
        (evt) => {
          return evt.name == "damage" && evt.player == player;
        },
        event
      ).indexOf(event) == 0;
    },
    logTarget: "source",
    async content(event, trigger, player) {
      const target = event.targets[0];
      const next = player.chooseToCompare(target).set("isDelay", true);
      await next;
      trigger.cancel();
      let bool = get.damageEffect(player, target, target) + get.effect(target, { name: "guohe_copy2" }, player, target) > 0;
      bool = Math.random() > 0.4 ? bool : false;
      const result = await target.chooseBool(`对辩：是否令${get.translation(player)}弃置你一张牌，然后揭示拼点结果？`).set("choice", bool).forResult();
      if (result.bool) {
        await player.discardPlayerCard(target, "he", true);
        const result2 = await game.createEvent("chooseToCompare", false).set("player", player).set("parentEvent", next).setContent("chooseToCompareEffect").forResult();
        if (result2?.winner == target) {
          await player.loseHp();
        }
      } else {
        await game.delayx();
      }
    }
  },
  //华佗
  sxrmmiehai: {
    enable: "chooseToUse",
    filterCard: true,
    selectCard: 2,
    position: "hes",
    viewAs: {
      name: "sha",
      nature: "stab",
      storage: {
        miehai: true
      }
    },
    complexCard: true,
    filter(event, player) {
      return player.countCards("hes") >= 2;
    },
    audio: true,
    prompt: "将两张牌当刺【杀】使用或打出",
    async precontent(event, trigger, player) {
      player.when("useCardAfter").filter((evt) => evt.getParent() == event.getParent()).step(async (event2, trigger2, player2) => {
        const targets = game.filterPlayer((current) => {
          return current.getHistory("lose", (evt) => {
            const cards2 = evt.cards2;
            if (!evt.getParent((evt2) => evt2 == trigger2, true, true) || !cards2.some((card) => get.suit(card) == "spade")) {
              return false;
            }
            return evt.visible;
          }).length;
        });
        if (!targets?.length) {
          return;
        }
        for (let target of targets) {
          if (target.isDamaged()) {
            await target.draw(2);
            await target.recover();
          }
        }
      });
    },
    check(card) {
      let player = _status.event.player;
      let val = get.value(card);
      if (get.suit(card) == "spade" && player.isDamaged()) {
        val *= 0.6;
      }
      return Math.max(5, 8 - 0.7 * player.hp) - val;
    },
    ai: {
      order(item, player) {
        return get.order({ name: "sha" }) + 0.1;
      }
    },
    locked: false,
    mod: {
      targetInRange(card) {
        if (card?.storage?.miehai) {
          return true;
        }
      },
      cardUsable(card, player, num) {
        if (card?.storage?.miehai) {
          return Infinity;
        }
      }
    }
  },
  sxrmqingjun: {
    trigger: {
      global: "roundEnd"
    },
    filter(event, player) {
      return game.hasPlayer((current) => current != player);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), lib.filter.notMe).set("ai", (target) => {
        const player2 = get.player();
        let eff = 5 * get.sgnAttitude(player2, target);
        let targets = game.filterPlayer((current) => {
          return current == player2 || current.inRange(target);
        });
        for (let targetx of targets) {
          eff += get.effect(targetx, { name: "wuzhong" }, targetx, player2);
          eff += get.effect(target, { name: "sha" }, targetx, player2);
        }
        return eff;
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0], targets = game.filterPlayer((current) => {
        return current == player || current.inRange(target);
      });
      for (let targetx of targets) {
        await targetx.draw(2);
        let skillName = `${event.name}_${player.playerid}`;
        targetx.addAdditionalSkill(skillName, ["sxrmshefu_effect"], true);
        targetx.when({
          global: "phaseEnd"
        }).filter((evt) => evt.skill == event.name).step(async (event2, trigger2, player2) => {
          player2.removeAdditionalSkill(skillName);
          let cards2 = player2.getExpansions("sxrmshefu_effect");
          if (cards2.length) {
            await player2.loseToDiscardpile(cards2);
          }
        });
        if (targetx.countCards("he")) {
          const result = await targetx.chooseCard(get.prompt2("sxrmshefu"), "he", true).set("ai", (card) => {
            let val = get.value(card);
            if (get.type(card) == "basic") {
              val *= 0.5;
            }
            if (get.color(card) == "black") {
              val *= 0.8;
            }
            return 6 - val;
          }).forResult();
          if (result.bool) {
            await targetx.useSkill("sxrmshefu", result.cards);
          }
        }
      }
      target.when({
        player: "phaseEnd"
      }, false).assign({
        lastDo: true
      }).filter((evt) => evt.skill == event.name).step(async (event2, trigger2, player2) => {
        for (let targetx of targets) {
          if (!targetx.getHistory("damage").length) {
            const card = new lib.element.VCard({ name: "sha", isCard: true });
            if (targetx.canUse(card, player2, false)) {
              await targetx.useCard(card, player2, false);
            }
          }
        }
      }).finish();
      target.insertPhase(event.name);
    },
    derivation: "sxrmshefu"
  },
  sxrmshefu: {
    audio: "shefu",
    trigger: {
      player: "phaseJieshuBegin"
    },
    filter(event, player) {
      return player.countCards("he");
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard(get.prompt2(event.skill), "he").set("ai", (card) => {
        let val = get.value(card);
        if (get.type(card) == "basic") {
          val *= 0.5;
        }
        if (get.color(card) == "black") {
          val *= 0.8;
        }
        return 6 - val;
      }).forResult();
    },
    async content(event, trigger, player) {
      const next = player.addToExpansion(event.cards, player, "giveAuto");
      next.gaintag.add("sxrmshefu_effect");
      await next;
    },
    onremove(player) {
      let cards2 = player.getExpansions("sxrmshefu_effect");
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    group: "sxrmshefu_effect",
    subSkill: {
      effect: {
        trigger: {
          global: ["useCard"]
        },
        filter(event, player) {
          if (_status.currentPhase == player || event.player == player || event.all_excluded) {
            return false;
          }
          return player.getExpansions("sxrmshefu_effect").some((card) => {
            return get.color(card) == get.color(event.card) && get.type2(card) == get.type2(event.card);
          }) && event.player.getHistory("lose", function(evt) {
            return (evt.relatedEvent || evt.getParent()) == event && evt.hs && evt.hs.length == event.cards.length;
          }).length;
        },
        async cost(event, trigger, player) {
          let effect = 0;
          if (trigger.card.name == "wuxie" || trigger.card.name == "shan") {
            if (get.attitude(player, trigger.player) < -1) {
              effect = -1;
            }
          } else if (trigger.targets?.length) {
            for (let i = 0; i < trigger.targets.length; i++) {
              effect += get.effect(trigger.targets[i], trigger.card, trigger.player, player);
            }
          }
          let str = "设伏：是否令" + get.translation(trigger.player);
          if (trigger.targets && trigger.targets.length) {
            str += "对" + get.translation(trigger.targets);
          }
          str += "使用的" + get.translation(trigger.card) + "失效？";
          const result = await player.chooseButton([str, player.getExpansions("sxrmshefu_effect")]).set("filterButton", (button) => {
            const { used } = get.event();
            return get.color(button.link) == get.color(used) && get.type2(button.link) == get.type2(used);
          }).set("ai", (button) => {
            const { choice } = get.event();
            if (choice) {
              return Math.random();
            }
            return 0;
          }).set("used", trigger.card).set("choice", effect < 0).forResult();
          event.result = {
            bool: result.bool,
            targets: [trigger.player],
            cards: result.bool ? result.links : []
          };
        },
        async content(event, trigger, player) {
          await player.loseToDiscardpile(event.cards);
          trigger.targets.length = 0;
          trigger.all_excluded = true;
        },
        ai: {
          threaten: 1.8,
          expose: 0.3
        },
        intro: {
          mark(dialog, storage, player) {
            var cards2 = player.getExpansions("sxrmshefu_effect");
            if (player.isUnderControl(true)) {
              dialog.addAuto(cards2);
            } else {
              return "共有" + get.cnNumber(cards2.length) + "张牌";
            }
          },
          markcount: "expansion"
        }
      }
    }
  },
  //伏寿
  sxrmmitu: {
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    filter(event, player) {
      return game.hasPlayer((current) => current.isDamaged());
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), [1, 3], (card, player2, target) => {
        return target.isDamaged();
      }).set("ai", (target) => {
        return get.attitude(get.player(), target);
      }).forResult();
    },
    async content(event, trigger, player) {
      event.targets.sortBySeat();
      for (const target of event.targets) {
        const next = target.draw();
        next.gaintag.add("sxrmmitu");
        const result = (await next.forResult()).cards;
        if (result?.length) {
          await target.showCards(result, "密图");
          event[target.playerid] = result[0];
        }
        target.addTempSkill("sxrmmitu_ai", "phaseChange");
      }
      for (const target of event.targets) {
        if (!game.hasPlayer((current) => target.canCompare(current))) {
          continue;
        }
        const result = await player.chooseTarget(
          `为${get.translation(target)}指定拼点目标`,
          (card, player2, target2) => {
            return get.event().comparer.canCompare(target2);
          },
          true
        ).set("comparer", target).set("ai", (target2) => {
          const { player: player2, comparer } = get.event();
          return get.effect(target2, { name: "sha" }, comparer, player2);
        }).forResult();
        if (result.bool) {
          const targetx = result.targets[0], card = target.getCards("h").find((card2) => card2.hasGaintag("sxrmmitu"));
          let bool = get.attitude(target, player) >= 0 ? get.effect(targetx, { name: "sha" }, target, target) > 0 : false;
          if (card && get.number(card) < 7 && get.attitude(target, player) > 0) {
            bool = false;
          }
          const result2 = await target.chooseBool(`是否与${get.translation(targetx)}进行拼点？`, "赢的角色视为对没赢的角色使用一张【杀】").set("choice", bool).forResult();
          if (result2.bool) {
            const result3 = await target.chooseToCompare(targetx).forResult();
            if (result3.winner) {
              const loser = [target, targetx].find((i) => i != result3.winner), sha = new lib.element.VCard({ name: "sha", isCard: true });
              if (loser && result3.winner.canUse(sha, loser, false)) {
                await result3.winner.useCard(sha, loser, false);
              }
            }
          }
        }
      }
    },
    group: "sxrmmitu_benghuai",
    subSkill: {
      ai: {
        charlotte: true,
        onremove(player) {
          player.removeGaintag("sxrmmitu");
        },
        mod: {
          aiValue: (player, card, num) => {
            let evt = _status.event.getParent("sxrmmitu", true);
            if (!evt || !evt.player || get.attitude(player, evt.player) <= 0) {
              return;
            }
            if (num > 0 && get.itemtype(card) === "card" && card.hasGaintag("sxrmmitu")) {
              return -114514;
            }
          }
        }
      },
      benghuai: {
        trigger: {
          global: "compare"
        },
        getIndex(event, player) {
          const evt = event.getParent("sxrmmitu", true);
          if (!evt) {
            return [];
          }
          return [event.player, event.target].filter((current) => {
            if (!evt.targets.includes(current)) {
              return false;
            }
            const card = event[event.player == current ? "card1" : "card2"], showed = evt[current.playerid];
            return showed && get.itemtype(showed) == "card" && showed != card;
          });
        },
        logTarget(event, player, name, index) {
          return index;
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          await player.loseMaxHp();
        }
      }
    }
  },
  sxrmqianliu: {
    trigger: {
      global: "useCardToTargeted"
    },
    filter(event, player) {
      return get.distance(player, event.target) <= 1 && event.card?.name == "sha";
    },
    frequent: true,
    logTarget: "target",
    async content(event, trigger, player) {
      const cards2 = get.bottomCards(4);
      await game.cardsGotoOrdering(cards2);
      if (cards2.map((i) => get.suit(i)).toUniqued().length > 3) {
        const result2 = await player.chooseBool(`是否展示并获得${get.translation(cards2)}？`).set("frequentSkill", event.name).forResult();
        if (result2.bool) {
          await player.showCards(cards2);
          await player.gain(cards2, "gain2");
          return;
        }
      }
      const result = await player.chooseToMove().set("list", [["牌堆顶"], ["牌堆底", cards2]]).set("prompt", "点击或拖动将牌移动到牌堆顶或牌堆底").set("processAI", (list) => {
        let cards3 = list[1][1], player2 = _status.event.player, target = _status.currentPhase || player2, name = _status.event.getTrigger()?.name, countWuxie = (current) => {
          let num = current.getKnownCards(player2, (card) => {
            return get.name(card, current) === "wuxie";
          });
          if (num && current !== player2) {
            return num;
          }
          let skills2 = current.getSkills("invisible").concat(lib.skill.global);
          game.expandSkills(skills2);
          for (let i = 0; i < skills2.length; i++) {
            let ifo = get.info(skills2[i]);
            if (!ifo) {
              continue;
            }
            if (ifo.viewAs && typeof ifo.viewAs != "function" && ifo.viewAs.name == "wuxie") {
              if (!ifo.viewAsFilter || ifo.viewAsFilter(current)) {
                num++;
                break;
              }
            } else {
              let hiddenCard = ifo.hiddenCard;
              if (typeof hiddenCard == "function" && hiddenCard(current, "wuxie")) {
                num++;
                break;
              }
            }
          }
          return num;
        }, top2 = [];
        switch (name) {
          case "phaseJieshu": {
            target = target.next;
            cards3.sort((a, b) => {
              return get.value(b, target) - get.value(a, target);
            });
            while (cards3.length) {
              if (get.value(cards3[0], target) > 6) {
                top2.push(cards3.shift());
              } else {
                break;
              }
            }
            return [top2, cards3];
          }
          case "phaseZhunbei": {
            let att = get.sgn(get.attitude(player2, target)), judges = target.getCards("j"), needs = 0, wuxie = countWuxie(target);
            for (let i = Math.min(cards3.length, judges.length) - 1; i >= 0; i--) {
              let j = judges[i];
              j.viewAs ? { name: j.viewAs, cards: j.cards || [j] } : j;
              if (wuxie > 0 && get.effect(target, j, target, target) < 0) {
                wuxie--;
                continue;
              }
              let judge = get.judge(j);
              cards3.sort((a, b) => {
                return (judge(b) - judge(a)) * att;
              });
              if (judge(cards3[0]) * att < 0) {
                needs++;
                continue;
              } else {
                top2.unshift(cards3.shift());
              }
            }
            if (needs > 0 && needs >= judges.length) {
              return [top2, cards3];
            }
            cards3.sort((a, b) => {
              return (get.value(b, target) - get.value(a, target)) * att;
            });
            while (needs--) {
              top2.unshift(cards3.shift());
            }
            while (cards3.length) {
              if (get.value(cards3[0], target) > 6 == att > 0) {
                top2.push(cards3.shift());
              } else {
                break;
              }
            }
            return [top2, cards3];
          }
          default:
            cards3.sort((a, b) => {
              return get.value(b, target) - get.value(a, target);
            });
            while (cards3.length) {
              if (get.value(cards3[0], target) > 6) {
                top2.push(cards3.shift());
              } else {
                break;
              }
            }
            return [top2, cards3];
        }
      }).forResult();
      let top = result.moved[0], bottom = result.moved[1];
      top.reverse();
      await game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event2, card) => {
        if (event2.top_cards.includes(card)) {
          return ui.cardPile.firstChild;
        }
        return null;
      });
      game.addCardKnower(top, player);
      game.addCardKnower(bottom, player);
      player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
      game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
      game.updateRoundNumber();
      await game.delayx();
    }
  },
  //荀彧
  sxrmhuice: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => player.canCompare(current));
    },
    filterTarget(card, player, target) {
      return player.canCompare(target);
    },
    async content(event, trigger, player) {
      const result1 = await player.chooseToCompare(event.target).forResult();
      if (game.hasPlayer((current) => current != event.target && player.canCompare(current))) {
        const result = await player.chooseTarget("迴策：与另一名角色进行拼点", true, (card, player2, target) => {
          return get.event().first != target && player2.canCompare(target);
        }).set("first", event.target).set("ai", (target) => {
          return get.damageEffect(target, get.player());
        }).forResult();
        if (!result.bool) {
          return;
        }
        const result2 = await player.chooseToCompare(result.targets[0]).forResult();
        if (result1 && result2) {
          if (result1.winner) {
            for (const target of [player, result.targets[0]]) {
              if (target != result2.winner) {
                result1.winner.line(target, "green");
                await target.damage(result1.winner);
              }
            }
          }
          if (result2.winner) {
            for (const target of [player, event.target]) {
              if (target != result1.winner) {
                result2.winner.line(target, "green");
                await target.damage(result2.winner);
              }
            }
          }
        }
      }
    },
    ai: {
      order: 7,
      result: {
        target: -1,
        player(player, target) {
          const targets = game.filterPlayer((current) => {
            return player.canCompare(current) && get.damageEffect(current, current, player) > 0;
          });
          return targets.length > 1 ? 1 : -2;
        }
      }
    }
  },
  sxrmyihe: {
    trigger: {
      global: "damageBegin1"
    },
    filter(event, player) {
      if (player != _status.currentPhase || !event.source) {
        return false;
      }
      let bool1 = get.sgn(event.source.hp - event.source.countCards("h")), bool2 = get.sgn(event.player.hp - event.player.countCards("h"));
      return !player.getStorage("sxrmyihe_used").includes(bool1 == bool2);
    },
    forced: true,
    logTarget: "player",
    check(event, player) {
      let bool1 = get.sgn(event.source.hp - event.source.countCards("h")), bool2 = get.sgn(event.player.hp - event.player.countCards("h"));
      if (get.attitude(player, event.player) > 0) {
        return bool1 == bool2 && get.attitude(player, event.source) >= 0;
      }
      return bool1 != bool2;
    },
    prompt2(event, player) {
      let bool1 = get.sgn(event.source.hp - event.source.countCards("h")), bool2 = get.sgn(event.player.hp - event.player.countCards("h"));
      if (bool1 == bool2) {
        return `令其和${get.translation(event.source)}依次摸两张牌`;
      }
      return "令此伤害+1";
    },
    async content(event, trigger, player) {
      let bool1 = get.sgn(trigger.source.hp - trigger.source.countCards("h")), bool2 = get.sgn(trigger.player.hp - trigger.player.countCards("h"));
      player.addTempSkill("sxrmyihe_used");
      player.markAuto("sxrmyihe_used", bool1 == bool2);
      if (bool1 == bool2) {
        await trigger.player.draw(2);
        await trigger.source.draw(2);
      } else {
        trigger.num++;
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  sxrmjizhi: {
    trigger: {
      player: "dying"
    },
    filter(event, player) {
      if (game.getGlobalHistory(
        "everything",
        (evt) => {
          return evt.name == "dying" && evt.player == player;
        },
        event
      ).indexOf(event) != 0) {
        return false;
      }
      return player.hp <= 0;
    },
    forced: true,
    async content(event, trigger, player) {
      await player.recover();
    },
    mod: {
      targetEnabled(card, player, target) {
        if (card.name == "tao" && target != player) {
          return false;
        }
      }
    }
  },
  //曹丕
  sxrmzhengsi: {
    enable: "phaseUse",
    filterTarget(card, player, target) {
      if (ui.selected.targets.length > 1 && !ui.selected.targets.includes(player)) {
        if (target != player) {
          return false;
        }
      }
      return target.countCards("h");
    },
    selectTarget: 3,
    complexSelect: true,
    targetprompt: ["首先展示", "随后展示"],
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      const target = event.targets[0], targets = event.targets.slice(0).remove(target);
      const result = await target.chooseCard("争嗣：展示一张手牌", true, "h").set("ai", (card) => {
        return 10 - Math.abs(7 - get.number(card));
      }).forResult();
      if (!result.bool) {
        return;
      }
      let cards2 = result.cards.slice(0, 1);
      await target.showCards(result.cards);
      const next = player.chooseCardOL(targets, "h", true, "争嗣：展示一张手牌");
      next._args.remove("glow_result");
      const result2 = await next.forResult();
      if (!result2) {
        return;
      }
      await targets[0].showCards(result2[0].cards);
      await targets[1].showCards(result2[1].cards);
      await game.delayx();
      cards2.addArray(result2[0].cards).addArray(result2[1].cards);
      const targetx = [target, ...targets];
      game.log(cards2, targetx);
      let max = cards2.map((i) => get.number(i)).maxBy((i) => i), min = cards2.map((i) => get.number(i)).minBy((i) => i);
      for (let i = 0; i < cards2.length; i++) {
        if (get.number(cards2[i]) == max) {
          await targetx[i].chooseToDiscard(2, true, "h");
        }
      }
      for (let i = 0; i < cards2.length; i++) {
        if (get.number(cards2[i]) == min) {
          await targetx[i].loseHp();
        }
      }
    },
    ai: {
      order: 3,
      result: {
        target(player, target) {
          if (target == player) {
            return 0.1;
          }
          return -2;
        },
        player(player, target) {
          if (player.hp > 2 && player.countCards("h") > 2) {
            return 1;
          }
          return 0;
        }
      }
    }
  },
  sxrmchengming: {
    trigger: {
      player: "phaseUseEnd"
    },
    getIndex(event, player) {
      let targets = [], bool = false;
      game.filterPlayer((current) => {
        current.checkHistory("useSkill", (evt) => {
          if (evt.skill != "sxrmzhengsi" || evt?.event?.getParent("phaseUse") != event) {
            return false;
          }
          if (current == player) {
            bool = true;
          }
          targets.addArray(evt.targets || []);
        });
      });
      let result = [];
      if (bool && player.countCards("h") == targets.map((i) => i.countCards("h")).maxBy((i) => i)) {
        result.push("recover");
      }
      if (bool && player.hp == targets.map((i) => i.hp).maxBy((i) => i)) {
        result.push(targets.filter((i) => i != player));
      }
      return result;
    },
    filter(event, player, name, data) {
      if (data == "recover") {
        return player.isDamaged();
      }
      return data.some((i) => i != player && i.countGainableCards(player, "he"));
    },
    logTarget(event, player, name, data) {
      if (data == "recover") {
        return player;
      }
      return data;
    },
    prompt2(event, player, name, data) {
      if (data == "recover") {
        return "回复2点体力";
      }
      return `获得这些角色各一张牌`;
    },
    async content(event, trigger, player) {
      const data = event.indexedData;
      if (data == "recover") {
        await player.recover(2);
      } else {
        await player.gainMultiple(event.targets, "he");
      }
    },
    ai: {
      combo: "sxrmzhengsi"
    }
  },
  //王垕
  sxrmjugu: {
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    filter(event, player) {
      return game.hasPlayer((current) => current.countCards("he"));
    },
    async cost(event, trigger, player) {
      const lose_list = [], selected = [];
      let forced = false;
      do {
        const result = await player.chooseTarget(forced ? "聚谷：是否继续选择牌？" : get.prompt2(event.skill)).set("filterTarget", (card, player2, target2) => {
          const { selected: selected2, lose_list: list } = get.event(), num2 = list.map((i) => i[0]).indexOf(target2);
          if (num2 != -1) {
            target2.prompt(`已选择 ${list[num2][1].length}张`);
          }
          return target2.countCards("he", (card2) => !selected2.includes(card2));
        }).set("lose_list", lose_list).set("selected", selected).set("ai", (target2) => {
          const { player: player2, selected: selected2 } = get.event();
          if (selected2.length >= 3) {
            return 0;
          }
          return get.effect(target2, { name: "guohe_copy2" }, player2, player2);
        }).forResult();
        if (!result.bool) {
          break;
        }
        forced = true;
        const target = result.targets[0], num = lose_list.map((i) => i[0]).indexOf(target);
        const result2 = await player.choosePlayerCard(target, "he", [1, 5 - selected.length], true, "选择要明置于牌堆顶的牌").set("filterButton", (button) => {
          return !get.event().selected.includes(button.link);
        }).set("selected", selected).set("ai", (button) => {
          const { player: player2, selected: selected2 } = get.event();
          if (selected2.length + ui.selected.buttons.length >= 3) {
            return 0;
          }
          return get.buttonValue(button);
        }).forResult();
        if (!result2.bool) {
          break;
        }
        const cards2 = result2.links;
        if (num != -1) {
          lose_list[num][1].addArray(cards2);
        } else {
          lose_list.add([target, cards2]);
        }
        selected.addArray(cards2);
      } while (selected.length < 5);
      event.result = {
        bool: forced,
        targets: lose_list.map((i) => i[0]),
        cards: selected,
        cost_data: lose_list
      };
    },
    async content(event, trigger, player) {
      let cards2 = event.cards;
      while (cards2.length) {
        const card = cards2.shift(), owner = get.owner(card);
        owner.$throw(card, 1e3);
        game.log(player, "将", owner, "的", card, "置于了牌堆顶");
        await owner.lose([card], ui.cardPile, "insert", "visible");
        if (!trigger.getParent().jugu) {
          trigger.getParent().jugu = [];
        }
        trigger.getParent().jugu.push([owner, card]);
      }
      game.addGlobalSkill("sxrmjugu_log");
    },
    group: "sxrmjugu_return",
    subSkill: {
      return: {
        trigger: {
          player: "phaseEnd"
        },
        filter(event, player) {
          return event?.jugu?.length;
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          for (let i of trigger.jugu) {
            let card = get.cardPile2((card2) => card2 == i[1]);
            if (card) {
              await i[0].gain(card, "gain2");
            }
          }
          const targets = trigger.jugu.map((i) => i[0]).filter((i) => i.isIn()).toUniqued();
          if (targets.length) {
            await game.asyncDraw(targets);
          }
        }
      },
      log: {
        charlotte: true,
        direct: true,
        trigger: {
          player: "gainAfter",
          global: "loseAsyncAfter"
        },
        filter(event, player) {
          if (!event.getg || !event.getg(player).length || event.getParent("sxrmjugu_return", true)) {
            return false;
          }
          let evt = event.getParent("phase", true);
          return evt?.jugu?.map((i) => i[1]).some((i) => event.getg(player).includes(i));
        },
        async content(event, trigger, player) {
          let evt = trigger.getParent("phase", true), cards2 = trigger.getg(player), log = [];
          for (let i = evt.jugu.length - 1; i >= 0; i--) {
            if (cards2.includes(evt.jugu[i][1])) {
              log.add(evt.jugu[i][1]);
            }
          }
          if (!trigger.visible) {
            game.log(player, "获得的牌中有明置牌", log);
          }
        }
      }
    }
  }
};
const translates = {
  sxrm: "蚀心入魔",
  //蚀心入魔·疑
  sxrm_caocao: "魔曹操",
  sxrm_caocao_prefix: "魔",
  sxrmkuxin: "枯心",
  sxrmkuxin_info: "你受到伤害后，可以令所有其他角色依次选择展示任意张手牌，然后你获得所有角色展示的牌或一名角色未展示的手牌并展示之，若你未以此法获得♥牌，你弃置这些牌并翻面。",
  sxrmsigu: "似故",
  sxrmsigu_info: `出牌阶段限一次，你可令一名其他角色进行判定，令其获得${["zhichi", "reganglie", "refankui", "new_reyiji", "oljieming", "fangzhu", "shibei", "rechengxiang", "zhiyu", "jilei", "benyu", "chouce", "new_wuhun"].map((skill) => get.poptip(skill)).join("")}中的第X个技能（X为判定点数）。若如此做，你对其造成两次1点伤害，然后其失去以此法获得的技能。`,
  sxrm_liubei: "疑刘备",
  sxrm_liubei_prefix: "疑",
  sxrmchengbian: "乘变",
  sxrmchengbian_info: `准备阶段和结束阶段，你可以与一名角色进行${get.poptip("sxrm_compare")}，然后视为对其使用一张【决斗】，你与其可以将至少一半的手牌当【杀】打出直到此【决斗】结算完成。此【决斗】结算结束后，揭示拼点结果，赢的角色摸至体力上限。`,
  sxrm_jianggan: "疑蒋干",
  sxrm_jianggan_prefix: "疑",
  sxrmzongheng: "纵横",
  sxrmzongheng_info: "准备阶段，你可以观看两名其他角色的手牌，展示并获得其中一张，然后你弃置另一名角色与你此法展示牌花色、点数、类型相同的手牌各一张。",
  sxrmduibian: "对辩",
  sxrmduibian_info: `你每回合首次受到伤害时，你可以与伤害来源${get.poptip("sxrm_compare")}并防止此伤害，然后其可以令你弃置其一张牌并揭示拼点结果，若其赢则你失去1点体力。`,
  sxrm_huatuo: "疑华佗",
  sxrm_huatuo_prefix: "疑",
  sxrmmiehai: "灭害",
  sxrmmiehai_info: "你可以将两张牌当作无距离次数限制的刺【杀】使用。此【杀】结算完成后，此过程中正面失去♠牌且已受伤的角色摸两张牌并回复1点体力。",
  sxrm_lvboshe: "疑吕伯奢",
  sxrm_lvboshe_prefix: "疑",
  sxrmqingjun: "请君",
  sxrmqingjun_info: `每轮结束时，你可以选择一名其他角色，令你和攻击范围含有其的其他角色各摸两张牌并发动${get.poptip("sxrmshefu")}；若如此做，其执行一个额外回合，此回合结束时，以此法发动〖设伏〗的角色移去“伏兵”，然后其中此回合未受伤的角色各视为对其使用一张【杀】。`,
  sxrmshefu: "设伏",
  sxrmshefu_info: "结束阶段，你可以扣置一张牌为“伏兵”；其他角色于你的回合外使用手牌时，你可以移去一张颜色与类别均与此牌相同的“伏兵”，令此牌无效。",
  sxrm_fuhuanghou: "疑伏寿",
  sxrm_fuhuanghou_prefix: "疑",
  sxrmmitu: "密图",
  sxrmmitu_info: "准备阶段，你可以令至多三名已受伤角色各摸一张牌并展示之，然后令这些角色依次选择是否与你指定的另一名角色拼点，拼点赢的角色视为对没赢的角色使用一张【杀】。每有一名角色未用以此法展示的牌进行拼点，你减少1点体力上限。",
  sxrmqianliu: "潜流",
  sxrmqianliu_info: "与你距离1以内的角色成为【杀】的目标后，你可以观看牌堆底四张牌并以任意顺序置于牌堆顶或牌堆底；若这些牌花色均不相同，你可以展示并获得这些牌。",
  sxrm_xunyu: "疑荀彧",
  sxrm_xunyu_prefix: "疑",
  sxrmhuice: "迴策",
  sxrmhuice_info: "出牌阶段限一次，你可以依次与两名角色拼点，于一次拼点中赢的角色对另一次拼点中没赢的角色各造成1点伤害。",
  sxrmyihe: "异合",
  sxrmyihe_info: "锁定技，你的回合内各限一次，一名角色受到伤害时，若其与伤害来源的手牌数与体力值大小关系：相同，其与伤害来源各摸两张牌；不同，此伤害+1。",
  sxrmjizhi: "赍志",
  sxrmjizhi_info: "锁定技，其他角色不能对你使用【桃】；你每回合首次进入濒死时，回复1点体力。",
  sxrm_caopi: "疑曹丕",
  sxrm_caopi_prefix: "疑",
  sxrmzhengsi: "争嗣",
  sxrmzhengsi_info: "出牌阶段，你可以选择包括你在内的三名有手牌的角色，令其中一名角色先展示一张手牌，然后其余角色同时展示一张手牌。以此法展示牌点数最大的角色弃置两张手牌，以此法展示牌点数最小的角色失去1点体力。",
  sxrmchengming: "承命",
  sxrmchengming_info: "出牌阶段结束时，若你此阶段发动过〖争嗣〗，且你在此阶段成为过〖争嗣〗目标的角色中：手牌数最大，你可以回复2点体力；体力值最大，你可以获得这些角色各一张牌。",
  sxrm_wanghou: "疑王垕",
  sxrm_wanghou_prefix: "疑",
  sxrmjugu: "聚谷",
  sxrmjugu_info: "准备阶段，你可以依次选择任意名角色至多共计五张牌，将这些牌正面向上置于牌堆顶；此回合结束时，这些角色获得牌堆顶各自以此法放置的牌（没有则跳过），然后各摸一张牌。",
  //蚀心入魔·慢
  sxrm_guanyu: "魔关羽",
  sxrm_guanyu_prefix: "魔",
  sxrmhanguo: "撼国",
  sxrmhanguo_info: `每轮开始时，你可以选择一名上轮未以此法选择过的其他角色，扣置其所有牌直到本轮结束，且本轮内：你对其使用【杀】造成伤害后，其死亡；其可以发动无势力限制的${get.poptip("hujia")}且响应其的角色获得你一张牌。`,
  sxrmweiwo: "唯我",
  sxrmweiwo_info: `限定技，结束阶段，你可以令至多三名其他角色各获得${get.poptip("rende")}${get.poptip("qingnang")}${get.poptip("longyin")}中的一个不同技能（仅能对你发动），然后你获得${get.poptip("old_wushen")}。`,
  old_wushen: "武神",
  old_wushen_info: "锁定技，你的♥手牌视为无距离限制的【杀】。",
  sxrm_guanyinping: "慢关银屏",
  sxrm_guanyinping_prefix: "慢",
  sxrmyinmou: "姻谋",
  sxrmyinmou_info: `一名男性角色的结束阶段，其可以连接你与其各一张未被${get.poptip("sxrm_connect")}的手牌。你每回合首次失去${get.poptip("sxrm_connect")}牌后，本次同时失去${get.poptip("sxrm_connect")}牌的角色依次摸X张牌（X为这些角色数且至多为5）。`,
  sxrmquchi: "驱斥",
  sxrmquchi_info: `出牌阶段限一次，你可以对一名角色造成1点火焰伤害，若其有${get.poptip("sxrm_connect")}牌，重置这些牌并令此伤害+1。`,
  sxrm_yujin: "慢于禁",
  sxrm_yujin_prefix: "慢",
  sxrmsuwu: "肃伍",
  sxrmsuwu_info: `准备阶段，你可以${get.poptip("sxrm_connect")}至多四名角色各一张手牌；若你有${get.poptip("sxrm_connect")}牌，有${get.poptip("sxrm_connect")}牌的角色每回合使用的首张伤害牌不可被响应且结算后其摸两张牌。`,
  sxrmrenwang: "仁王",
  sxrmrenwang_info: `每回合限一次，你可以将一张${get.poptip("sxrm_connect")}牌当作【桃】使用。`,
  sxrm_mifang: "慢糜芳",
  sxrm_mifang_prefix: "慢",
  sxrmhuoe: "火厄",
  sxrmhuoe_info: "结束阶段，你可以视为对至多四名其他角色使用一张【火攻】，若你有可弃置的牌，须弃置之并取消剩余目标，否则其观看你的手牌。结算结束后你分配因此展示的牌，若点数之和小于13，你失去1点体力。",
  sxrmtanduo: "贪惰",
  sxrmtanduo_info: "锁定技，你需要弃牌的弃牌阶段改为摸牌阶段。",
  sxrm_liufeng: "慢寇封",
  sxrm_liufeng_prefix: "慢",
  sxrmhuaibing: "怀兵",
  sxrmhuaibing_info: "准备阶段，你可选择两名有牌的角色，获得这些角色各一张手牌（为你则跳过），然后你展示手牌，令其中体力值较少的角色下个摸牌阶段摸牌数、出牌阶段出【杀】次数、弃牌阶段手牌上限改为其中红色牌的数量。",
  sxrm_luxun: "慢陆逊",
  sxrm_luxun_prefix: "慢",
  sxrmchanyu: "谄谀",
  sxrmchanyu_info: "出牌阶段限一次，你可以令一名其他角色摸其体力值张牌并与其用各自点数最小的牌拼点，然后双方展示手牌：赢的角色可以交换双方一种颜色或类别的所有手牌。",
  sxrmchanyu_tag: "invisible",
  sxrmcongfeng: "从风",
  sxrmcongfeng_info: "转换技，你使用牌或成为牌的目标后，你可以阳：与使用者各摸一张牌；阴：弃置使用者两张牌。",
  sxrm_lvmeng: "慢吕蒙",
  sxrm_lvmeng_prefix: "慢",
  sxrmkongzhi: "空志",
  sxrmkongzhi_info: "锁定技，你使用【杀】指定唯一目标后，获得其至多三张牌；若你已受伤，普通锦囊牌对你无效且你的基本牌均视为【闪】。",
  sxrmbizha: "鄙诈",
  sxrmbizha_info: "结束阶段，你可以摸一张牌并拼点：若其没赢，其失去2点体力并令你观看其手牌，你可使用其中至多两张点数小于其拼点牌的牌；若你没赢，你减少1点体力上限。",
  sxrm_pangde: "慢庞德",
  sxrm_pangde_prefix: "慢",
  sxrmnuozhan: "搦战",
  sxrmnuozhan_info: "准备阶段，你可摸一张牌并令一名其他角色声明一个伤害类牌的牌名，然后你令你或其视为对对方使用此牌且伤害+1；若此牌未对目标造成伤害，使用者失去1点体力且你可以对相同角色重复此流程。",
  sxrm_yanwen: "慢颜良文丑",
  sxrm_yanwen_prefix: "慢",
  sxrmhaibian: "骇变",
  sxrmhaibian_info: "一名角色的回合开始时，若你上回合使用过手牌，则上回合最后一张黑色牌和红色牌的使用者可以依次视为使用一张【决斗】。",
  sxrmqiewang: "怯亡",
  sxrmqiewang_info: "锁定技，你距离1以内的角色受到伤害后，你摸一张牌，令你的手牌本回合均视为【无懈可击】。"
};
const characterTitles = {
  sxrm_guanyu: "四海仰鼻息",
  sxrm_guanyinping: "天骄虎女",
  sxrm_yujin: "立地成佛",
  sxrm_mifang: "负荆之臣",
  sxrm_liufeng: "不动如山",
  sxrm_luxun: "孺子为将",
  sxrm_lvmeng: "病入膏肓",
  sxrm_pangde: "狂徒",
  sxrm_yanwen: "土鸡瓦犬",
  sxrm_caocao: "一目窥九州",
  sxrm_liubei: "潜隐波涛",
  sxrm_jianggan: "舌锁千帆",
  sxrm_huatuo: "上医医国",
  sxrm_lvboshe: "碧血东流",
  sxrm_fuhuanghou: "白绫蔽月",
  sxrm_xunyu: "末路见疑",
  sxrm_caopi: "兄友弟恭",
  sxrm_wanghou: "一刀斩讫"
};
const characterIntro = {
  sxrm_wanghou: "王垕是罗贯中创作的小说《三国演义》及其衍生作品中的角色，于小说第十七回登场，为曹操征讨袁术时管粮官任峻部下仓官，后被曹操冤杀。人名不见于正史记载，事件原型源于《三国志》裴松之注引的《曹瞒传》。",
  sxrm_caocao: "&ensp;“将军，魏王邀你去回忆中一叙。”&ensp;<br>“眼见未必为真，请务必保持清醒。”",
  sxrm_guanyu: "&ensp;“曹孟德，重逢之期指日可待。”&ensp;<br>“彼时当与君共话此途之宵小————君亦居此。”"
};
const characterFilters = {};
const dynamicTranslates = {
  sxrmcongfeng(player, skill) {
    const bool = player.getStorage(skill, false);
    let yang = "与使用者各摸一张牌", yin = "弃置使用者两张牌";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技，你使用牌或成为牌的目标后，你可以", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  sxrmweiwo_rende(player, skill) {
    const targets = player.getStorage(skill);
    let info = lib.translate[`${skill}_info`];
    if (!targets?.length) {
      return info;
    }
    let str = `${get.translation(targets)}${targets.length > 1 ? "中的一人" : ""}`;
    return info.replace("其他角色", str);
  },
  sxrmweiwo_qingnang(player, skill) {
    const targets = player.getStorage(skill);
    let info = lib.translate[`${skill}_info`];
    if (!targets?.length) {
      return info;
    }
    let str = `${get.translation(targets)}${targets.length > 1 ? "中的一人" : ""}`;
    return info.replace("一名角色", str);
  },
  sxrmweiwo_longyin(player, skill) {
    const targets = player.getStorage(skill);
    let info = lib.translate[`${skill}_info`];
    if (!targets?.length) {
      return info;
    }
    let str = `${get.translation(targets)}${targets.length > 1 ? "中的一人" : ""}`;
    return info.replace("一名角色", str);
  }
};
const voices = {};
const characterSort = {
  shixinrumo_yi: ["sxrm_caocao", "sxrm_liubei", "sxrm_jianggan", "sxrm_huatuo", "sxrm_lvboshe", "sxrm_fuhuanghou", "sxrm_xunyu", "sxrm_caopi", "sxrm_wanghou"],
  shixinrumo_man: ["sxrm_guanyu", "sxrm_guanyinping", "sxrm_yujin", "sxrm_mifang", "sxrm_liufeng", "sxrm_luxun", "sxrm_lvmeng", "sxrm_pangde", "sxrm_yanwen"]
};
const characterSortTranslate = {
  shixinrumo_yi: "蚀心入魔·疑",
  shixinrumo_man: "蚀心入魔·慢"
};
game.import("character", function() {
  return {
    name: "sxrm",
    connect: true,
    character: { ...characters },
    characterSort: {
      sxrm: characterSort
    },
    characterSubstitute: {},
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
