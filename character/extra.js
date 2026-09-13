import { game, lib, get, _status, ui } from "noname";
const characters = {
  shen_guanyu: {
    sex: "male",
    group: "shen",
    hp: 5,
    skills: ["wushen", "new_wuhun"],
    groupInGuozhan: "shu"
  },
  shen_zhaoyun: {
    sex: "male",
    group: "shen",
    hp: 2,
    skills: ["xinjuejing", "relonghun"],
    groupInGuozhan: "shu"
  },
  shen_zhugeliang: {
    sex: "male",
    group: "shen",
    hp: 3,
    skills: ["qixing", "kuangfeng", "dawu"],
    groupInGuozhan: "shu",
    names: "诸葛|亮",
    clans: ["琅琊诸葛氏"]
  },
  shen_lvmeng: {
    sex: "male",
    group: "shen",
    hp: 3,
    skills: ["shelie", "gongxin"],
    groupInGuozhan: "wu"
  },
  shen_zhouyu: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["yeyan", "qinyin"],
    groupInGuozhan: "wu"
  },
  shen_simayi: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["renjie", "sbaiyin", "lianpo"],
    groupInGuozhan: "wei",
    names: "司马|懿"
  },
  shen_caocao: {
    sex: "male",
    group: "shen",
    hp: 3,
    skills: ["new_guixin", "feiying"],
    groupInGuozhan: "wei"
  },
  shen_lvbu: {
    sex: "male",
    group: "shen",
    hp: 5,
    skills: ["baonu", "wumou", "ol_wuqian", "ol_shenfen"],
    groupInGuozhan: "qun"
  },
  shen_liubei: {
    sex: "male",
    group: "shen",
    hp: 6,
    skills: ["nzry_longnu", "nzry_jieying"],
    groupInGuozhan: "shu"
  },
  shen_luxun: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["nzry_junlve", "nzry_cuike", "nzry_dinghuo"],
    groupInGuozhan: "wu",
    clans: ["吴郡陆氏"]
  },
  shen_zhangliao: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["drlt_duorui", "drlt_zhiti"],
    groupInGuozhan: "wei"
  },
  shen_ganning: {
    sex: "male",
    group: "shen",
    hp: 3,
    maxHp: 6,
    skills: ["drlt_poxi", "drlt_jieying"],
    groupInGuozhan: "wu"
  }
};
const cards = {
  changandajian_equip1: {
    fullskin: true,
    derivation: "shen_sunquan",
    type: "equip",
    subtype: "equip1",
    distance: { attackFrom: -5 },
    async onLose({ cards: cards2, player }) {
      cards2.forEach((card) => {
        card.fix();
        card.remove();
        card.destroyed = true;
        game.log(card, "被销毁了");
      });
      player.addTempSkill("changandajian_destroy");
    },
    ai: {
      value(card, player) {
        if (game.hasPlayer((current) => lib.skill.changandajian_destroy.getEffect(player, current) > 0)) {
          return 0;
        }
        return 8;
      },
      equipValue(card, player) {
        if (game.hasPlayer((current) => lib.skill.changandajian_destroy.getEffect(player, current) > 0)) {
          return 0;
        }
        return 8;
      },
      basic: {
        equipValue: 2
      }
    }
  },
  changandajian_equip2: {
    fullskin: true,
    cardimage: "changandajian_equip1",
    derivation: "shen_sunquan",
    type: "equip",
    subtype: "equip2",
    async onLose({ cards: cards2, player }) {
      cards2.forEach((card) => {
        card.fix();
        card.remove();
        card.destroyed = true;
        game.log(card, "被销毁了");
      });
      player.addTempSkill("changandajian_destroy");
    },
    ai: {
      value(card, player) {
        if (game.hasPlayer((current) => lib.skill.changandajian_destroy.getEffect(player, current) > 0)) {
          return 0;
        }
        return 8;
      },
      equipValue(card, player) {
        if (game.hasPlayer((current) => lib.skill.changandajian_destroy.getEffect(player, current) > 0)) {
          return 0;
        }
        return 8;
      },
      basic: {
        equipValue: 2
      }
    }
  },
  changandajian_equip3: {
    fullskin: true,
    cardimage: "changandajian_equip1",
    derivation: "shen_sunquan",
    type: "equip",
    subtype: "equip3",
    distance: { globalTo: 2 },
    async onLose({ cards: cards2, player }) {
      cards2.forEach((card) => {
        card.fix();
        card.remove();
        card.destroyed = true;
        game.log(card, "被销毁了");
      });
      player.addTempSkill("changandajian_destroy");
    },
    ai: {
      value(card, player) {
        if (game.hasPlayer((current) => lib.skill.changandajian_destroy.getEffect(player, current) > 0)) {
          return 0;
        }
        return 8;
      },
      equipValue(card, player) {
        if (game.hasPlayer((current) => lib.skill.changandajian_destroy.getEffect(player, current) > 0)) {
          return 0;
        }
        return 8;
      },
      basic: {
        equipValue: 2
      }
    }
  },
  changandajian_equip4: {
    fullskin: true,
    cardimage: "changandajian_equip1",
    derivation: "shen_sunquan",
    type: "equip",
    subtype: "equip4",
    distance: { globalFrom: -2 },
    async onLose({ cards: cards2, player }) {
      cards2.forEach((card) => {
        card.fix();
        card.remove();
        card.destroyed = true;
        game.log(card, "被销毁了");
      });
      player.addTempSkill("changandajian_destroy");
    },
    ai: {
      value(card, player) {
        if (game.hasPlayer((current) => lib.skill.changandajian_destroy.getEffect(player, current) > 0)) {
          return 0;
        }
        return 8;
      },
      equipValue(card, player) {
        if (game.hasPlayer((current) => lib.skill.changandajian_destroy.getEffect(player, current) > 0)) {
          return 0;
        }
        return 8;
      },
      basic: {
        equipValue: 2
      }
    }
  },
  changandajian_equip5: {
    fullskin: true,
    cardimage: "changandajian_equip1",
    derivation: "shen_sunquan",
    type: "equip",
    subtype: "equip5",
    skills: ["changandajian_equip5"],
    async onLose({ cards: cards2, player }) {
      cards2.forEach((card) => {
        card.fix();
        card.remove();
        card.destroyed = true;
        game.log(card, "被销毁了");
      });
      player.addTempSkill("changandajian_destroy");
    },
    ai: {
      value(card, player) {
        if (game.hasPlayer((current) => lib.skill.changandajian_destroy.getEffect(player, current) > 0)) {
          return 0;
        }
        return 8;
      },
      equipValue(card, player) {
        if (game.hasPlayer((current) => lib.skill.changandajian_destroy.getEffect(player, current) > 0)) {
          return 0;
        }
        return 8;
      },
      basic: {
        equipValue: 2
      }
    }
  },
  changandajian_equip6: {
    fullskin: true,
    cardimage: "changandajian_equip1",
    derivation: "shen_sunquan",
    type: "equip",
    subtype: "equip6",
    distance: { globalTo: 2, globalFrom: -2 },
    async onLose({ cards: cards2, player }) {
      cards2.forEach((card) => {
        card.fix();
        card.remove();
        card.destroyed = true;
        game.log(card, "被销毁了");
      });
      player.addTempSkill("changandajian_destroy");
    },
    ai: {
      value(card, player) {
        if (game.hasPlayer((current) => lib.skill.changandajian_destroy.getEffect(player, current) > 0)) {
          return 0;
        }
        return 8;
      },
      equipValue(card, player) {
        if (game.hasPlayer((current) => lib.skill.changandajian_destroy.getEffect(player, current) > 0)) {
          return 0;
        }
        return 8;
      },
      basic: {
        equipValue: 2
      }
    }
  }
};
const pinyins = {};
const skills = {
  //应天司马懿！别肘
  jilin: {
    audio: 5,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    forced: true,
    locked: false,
    logAudio: () => 1,
    async content(event, trigger, player) {
      const cards2 = get.cards(2);
      const next = player.addToExpansion(cards2, "draw");
      next.gaintag.add(event.name);
      await next;
    },
    marktext: "志",
    intro: {
      markcount: "expansion",
      mark(dialog, content, player) {
        const cards2 = player.getExpansions("jilin"), mingzhi = cards2.filter((card) => card.storage.jilin), hidden = cards2.removeArray(mingzhi);
        if (mingzhi.length) {
          dialog.addText("已明之志");
          dialog.addSmall(mingzhi);
        }
        if (hidden.length) {
          if (player == game.me || player.isUnderControl()) {
            dialog.addText("未明之志");
            dialog.addSmall(hidden);
          } else {
            return "共有" + get.cnNumber(hidden.length) + "张暗“志”";
          }
        }
      }
      /*
      ???
      content(content, player) {
      	const cards = player.getExpansions("jilin"),
      		mingzhi = cards.filter(card => card.storage.jilin),
      		hidden = cards.removeArray(mingzhi);
      	if (mingzhi.length) {
      		dialog.addText("已明之志");
      		dialog.addSmall(mingzhi);
      	}
      	if (hidden.length) {
      		if (player == game.me || player.isUnderControl()) {
      			dialog.addText("未明之志");
      			dialog.addSmall(hidden);
      		} else {
      			return "共有" + get.cnNumber(hidden.length) + "张暗“志”";
      		}
      	}
      },
      */
    },
    group: ["jilin_kanpo", "jilin_change"],
    subSkill: {
      kanpo: {
        audio: ["jilin2.mp3", "jilin3.mp3"],
        trigger: {
          target: "useCardToTarget"
        },
        filter(event, player) {
          return event.player != player && player.getExpansions("jilin").some((card) => !card.storage.jilin);
        },
        async cost(event, trigger, player) {
          const hidden = player.getExpansions("jilin").filter((card) => !card.storage.jilin);
          const goon = get.effect(player, trigger.card, trigger.player, player) < 0;
          const suits = player.getExpansions("jilin").filter((card) => card.storage.jilin).map((card) => get.suit(card)).toUniqued();
          if (hidden.length == 1) {
            const { bool } = await player.chooseBool("戢鳞：明置一张“志”", `令${get.translation(trigger.card)}对你无效`).set("choice", goon).forResult();
            event.result = {
              bool,
              cost_data: hidden
            };
          } else {
            const { bool, links } = await player.chooseButton(["戢鳞：明置一张“志”", hidden]).set("ai", (button) => {
              get.player();
              const card = button.link, suits2 = get.event().suits;
              if (!get.event().goon) {
                return 0;
              }
              if (!suits2.includes(get.suit(card))) {
                return 10;
              }
              return 6 - get.value(card);
            }).set("suits", suits).set("goon", goon).forResult();
            event.result = {
              bool,
              cost_data: links
            };
          }
        },
        async content(event, trigger, player) {
          await player.showCards(event.cost_data, get.translation(player) + "发动了【戢鳞】");
          event.cost_data[0].storage.jilin = true;
          trigger.getParent().excluded.add(player);
        }
      },
      change: {
        audio: ["jilin4.mp3", "jilin5.mp3"],
        trigger: {
          player: "phaseBegin"
        },
        filter(event, player) {
          return player.countCards("h") && player.getExpansions("jilin").some((card) => !card.storage.jilin);
        },
        async cost(event, trigger, player) {
          const hidden = player.getExpansions("jilin").filter((card) => !card.storage.jilin);
          const next = player.chooseToMove("戢鳞：是否交换“志”和手牌？");
          next.set("list", [
            [get.translation(player) + "（你）的未明之“志”", hidden],
            ["手牌区", player.getCards("h")]
          ]);
          next.set("filterMove", (from, to) => {
            return typeof to != "number";
          });
          next.set("processAI", (list) => {
            let player2 = get.player(), cards2 = list[0][1].concat(list[1][1]).sort(function(a, b) {
              return get.useful(a) - get.useful(b);
            }), cards22 = cards2.splice(0, player2.getExpansions("jilin").length);
            return [cards22, cards2];
          });
          const { bool, moved } = await next.forResult();
          event.result = {
            bool,
            cost_data: moved
          };
        },
        async content(event, trigger, player) {
          const moved = event.cost_data;
          const pushs = moved[0], gains = moved[1];
          pushs.removeArray(player.getExpansions("jilin"));
          gains.removeArray(player.getCards("h"));
          if (!pushs.length || pushs.length != gains.length) {
            return;
          }
          const next = player.addToExpansion(pushs);
          next.gaintag.add("jilin");
          await next;
          await player.gain(gains, "draw");
        }
      }
    }
  },
  yingyou: {
    audio: 4,
    trigger: {
      player: "phaseUseBegin"
    },
    filter(event, player) {
      return player.countCards("h") && player.getExpansions("jilin").some((card) => !card.storage.jilin);
    },
    async cost(event, trigger, player) {
      const hidden = player.getExpansions("jilin").filter((card) => !card.storage.jilin);
      const suits = player.getExpansions("jilin").filter((card) => card.storage.jilin).map((card) => get.suit(card)).toUniqued();
      const { bool, links } = await player.chooseButton(["英猷：你可以明志", hidden]).set("ai", (button) => {
        const player2 = get.player(), card = button.link, suits2 = get.event().suits;
        const getNum = (player3) => {
          var list = [];
          for (var i of lib.suit) {
            list.push(player3.countCards("h", { suit: i }) + 3);
          }
          return list.sort((a, b) => b - a)[0];
        };
        if (!suits2.includes(get.suit(card))) {
          return 10;
        }
        if (get.suit(card) == getNum(player2)) {
          return 5;
        }
        return 0;
      }).set("suits", suits).forResult();
      event.result = {
        bool,
        cost_data: links
      };
    },
    logAudio: () => 2,
    async content(event, trigger, player) {
      await player.showCards(event.cost_data, get.translation(player) + "发动了【英猷】");
      event.cost_data[0].storage.jilin = true;
      const num = player.getExpansions("jilin").filter((card) => card.storage.jilin).length;
      await player.draw(num);
    },
    ai: {
      combo: "jilin"
    },
    group: "yingyou_draw",
    subSkill: {
      draw: {
        audio: ["yingyou3.mp3", "yingyou4.mp3"],
        trigger: {
          player: "loseAfter",
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          const suits = player.getExpansions("jilin").filter((card) => card.storage.jilin).map((card) => get.suit(card)).toUniqued();
          const evt = event.getl(player);
          if (!evt || !evt.cards2 || !evt.cards2.length) {
            return false;
          }
          return evt.cards2.some((card) => {
            return suits.includes(get.suit(card, player));
          });
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          const suits = player.getExpansions("jilin").filter((card) => card.storage.jilin).map((card) => get.suit(card)).toUniqued();
          const num = trigger.getl(player).cards2.filter((card) => {
            return suits.includes(get.suit(card, player));
          }).length;
          await player.draw(num);
        }
      }
    }
  },
  yingtian: {
    audio: 2,
    trigger: { global: "dieAfter" },
    filter(event, player) {
      return game.countGroup() < 3;
    },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "gray",
    async content(event, trigger, player) {
      const skill = event.name;
      player.awakenSkill(skill);
      await player.changeSkills(get.info(skill).derivation, ["yingyou"]);
      player.addSkill(skill + "_effect");
    },
    derivation: ["reguicai", "rewansha", "lianpo"],
    subSkill: {
      effect: {
        mod: {
          targetInRange: () => true
        }
      }
    }
  },
  changandajian_equip5: {
    equipSkill: true,
    mod: { maxHandcard: (player, num) => num + 2 }
  },
  changandajian_destroy: {
    trigger: {
      player: "loseAfter",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    forced: true,
    charlotte: true,
    equipSkill: true,
    filter(event, player) {
      var evt = event.getl(player);
      if (!evt || !evt.es || !evt.es.length) {
        return false;
      }
      for (var i of evt.es) {
        if (i.name.indexOf("changandajian_equip") == 0) {
          return true;
        }
      }
      return false;
    },
    getEffect(player, target) {
      if (player == target) {
        return 0;
      }
      var getRaw = function() {
        var att = get.attitude(player, target);
        if (att > 0) {
          if (target.countCards("j", function(card) {
            var cardj = card.viewAs ? { name: card.viewAs } : card;
            return get.effect(target, cardj, target, player) < 0;
          }) > 0) {
            return 3;
          }
          if (target.getEquip("baiyin") && target.isDamaged() && get.recoverEffect(target, player, player) > 0) {
            if (target.hp == 1 && !target.hujia) {
              return 1.6;
            }
          }
          if (target.countCards("e", function(card) {
            if (get.position(card) == "e") {
              return get.value(card, target) < 0;
            }
          }) > 0) {
            return 1;
          }
        }
        var es = target.getCards("e");
        var noe = es.length == 0 || target.hasSkillTag("noe");
        var noe2 = es.filter(function(esx) {
          return get.value(esx, target) > 0;
        }).length == 0;
        if (noe || noe2) {
          return 0;
        }
        if (att <= 0 && !target.countCards("e")) {
          return 1.5;
        }
        return -1.5;
      };
      return getRaw() * get.attitude(player, target);
    },
    async content(event, trigger, player) {
      let time = 0;
      let recover = 0;
      const evt = trigger.getl(player);
      for (const card of evt.es) {
        if (card.name.indexOf("changandajian_equip") === 0) {
          time++;
        }
        if (card.name === "changandajian_equip2") {
          recover++;
        }
      }
      if (recover > 0) {
        await player.recover(recover);
      }
      for (let i = 0; i < time && game.hasPlayer((current) => current.countCards("ej") > 0); i++) {
        let result = await player.chooseTarget(true, "选择一名装备区或判定区有牌的角色", (card2, player2, target2) => target2.countCards("ej") > 0).set("ai", (target2) => lib.skill.changandajian_destroy.getEffect(_status.event.player, target2)).forResult();
        if (!result.bool) {
          return;
        }
        const target = result.targets[0];
        player.line(target, "green");
        result = await player.choosePlayerCard(target, true, "ej").forResult();
        if (!result.bool) {
          return;
        }
        const card = result.cards[0];
        const num = get.number(card);
        if (typeof get.strNumber(num, false) === "string") {
          if (lib.filter.canBeGained(card, player, target)) {
            await player.gain(card, target, "give", "bySelf");
          }
        } else if (lib.filter.canBeDiscarded(card, player, target)) {
          await target.discard(card);
        }
      }
    }
  },
  dili: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter(event, player) {
      if (player.storage.dili) {
        return false;
      }
      if (event.name != "phase") {
        return true;
      }
      if (game.phaseNumber == 0) {
        return true;
      }
      return player.name == "key_shiki";
    },
    async content(event, trigger, player) {
      player.storage.dili = true;
      const skill = ["dili_shengzhi", "dili_chigang", "dili_qionglan", "dili_quandao", "dili_jiaohui", "dili_yuanlv"].randomGet();
      player.addSkill(skill);
      game.log(player, '解锁了<span style="font-family: yuanli">东吴命运线</span>：', "#g【" + get.translation(skill) + "】");
    },
    derivation: ["dili_shengzhi", "dili_chigang", "dili_qionglan", "dili_quandao", "dili_jiaohui", "dili_yuanlv", "gzyinghun", "hongde", "rebingyi", "xinfu_guanwei", "bizheng", "xinanguo", "shelie", "wengua", "rebotu", "rezhiheng", "jiexun", "reanxu", "xiashu", "rejieyin", "oldimeng", "xinfu_guanchao", "drlt_jueyan", "lanjiang"],
    subSkill: {
      shengzhi: {
        audio: 2,
        trigger: { player: "useCard" },
        forced: true,
        filter(event, player) {
          var num = get.number(event.card);
          if (typeof num != "number") {
            return false;
          }
          if (num <= 1) {
            return false;
          }
          for (var i = 2; i <= Math.sqrt(num); i++) {
            if (num % i == 0) {
              return false;
            }
          }
          if (!player.storage.yuheng) {
            return false;
          }
          var list = ["gzyinghun", "hongde", "rebingyi"];
          for (var i of list) {
            if (!player.storage.yuheng.includes(i)) {
              return false;
            }
          }
          return true;
        },
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.filterPlayer((current) => current != player));
        },
        init(player, skill) {
          player.markAuto("yuheng_current", ["gzyinghun", "hongde", "rebingyi"]);
        },
        mark: true,
        ai: {
          directHit_ai: true,
          skillTagFilter(player, tag, arg) {
            if (arg && arg.card) {
              var num = get.number(arg.card);
              if (typeof num != "number") {
                return false;
              }
              if (num <= 1) {
                return false;
              }
              for (var i = 2; i <= Math.sqrt(num); i++) {
                if (num % i == 0) {
                  return false;
                }
              }
              return true;
            }
            return false;
          }
        },
        intro: {
          name: "命运线：圣质",
          content(storage, player) {
            var finished = [], unfinished = ["gzyinghun", "hongde", "rebingyi"];
            if (player.storage.yuheng) {
              for (var i = 0; i < unfinished.length; i++) {
                if (player.storage.yuheng.includes(unfinished[i])) {
                  finished.push(unfinished[i]);
                  unfinished.splice(i--, 1);
                }
              }
            }
            var str = "";
            if (unfinished.length) {
              str += "<li>未获得：" + get.translation(unfinished) + "<br>";
            }
            if (finished.length) {
              str += "<li>已获得过：" + get.translation(finished) + "<br>";
            }
            str += "<li>锁定技。若你因〖驭衡〗获得过〖英魂〗〖弘德〗〖秉壹〗，则当你使用点数为质数的牌时，此牌不可被响应。";
            return str;
          }
        }
      },
      chigang: {
        audio: 2,
        trigger: { player: "phaseChange" },
        forced: true,
        filter(event, player) {
          if (!player.storage.yuheng?.length) {
            return false;
          }
          const list = ["xinfu_guanwei", "bizheng", "xinanguo"];
          if (list.some((skill) => !player.storage.yuheng.includes(skill))) {
            return false;
          }
          return event.phaseList[event.num].indexOf("phaseJudge") != -1;
        },
        async content(event, trigger, player) {
          trigger.phaseList[trigger.num] = `phaseDraw|${event.name}`;
          await game.delayx();
        },
        init(player, skill) {
          player.markAuto("yuheng_current", ["xinfu_guanwei", "bizheng", "xinanguo"]);
        },
        ai: {
          effect: {
            target(card) {
              if (get.type(card) == "delay") {
                return "zeroplayertarget";
              }
            }
          }
        },
        mark: true,
        intro: {
          name: "命运线：持纲",
          content(storage, player) {
            var finished = [], unfinished = ["xinfu_guanwei", "bizheng", "xinanguo"];
            if (player.storage.yuheng) {
              for (var i = 0; i < unfinished.length; i++) {
                if (player.storage.yuheng.includes(unfinished[i])) {
                  finished.push(unfinished[i]);
                  unfinished.splice(i--, 1);
                }
              }
            }
            var str = "";
            if (unfinished.length) {
              str += "<li>未获得：" + get.translation(unfinished) + "<br>";
            }
            if (finished.length) {
              str += "<li>已获得过：" + get.translation(finished) + "<br>";
            }
            str += "<li>锁定技。若你因〖驭衡〗获得过〖观微〗〖弼政〗〖安国〗，则当你的判定阶段开始前，你跳过此阶段并获得一个额外的摸牌阶段。";
            return str;
          }
        }
      },
      qionglan: {
        audio: 2,
        init(player, skill) {
          player.markAuto("yuheng_current", ["shelie", "wengua", "rebotu"]);
        },
        trigger: { player: "useSkillAfter" },
        forced: true,
        limited: true,
        filter(event, player) {
          if (!player.storage.yuheng || event.skill != "yuheng") {
            return false;
          }
          var list = ["shelie", "wengua", "rebotu"];
          for (var i of list) {
            if (!player.storage.yuheng.includes(i)) {
              return false;
            }
          }
          return true;
        },
        async content(event, trigger, player) {
          player.awakenSkill(event.name);
          const list = ["dili_shengzhi", "dili_chigang", "dili_quandao", "dili_jiaohui", "dili_yuanlv"];
          const list2 = list.randomRemove(2);
          if (list2.includes("dili_quandao") && list2.includes("dili_jiaohui")) {
            list2.randomRemove(1);
            list2.push(list.randomGet());
          }
          for (const skill of list2) {
            player.addSkill(skill);
            game.log(player, '解锁了<span style="font-family: yuanli">东吴命运线</span>：', "#g【" + get.translation(skill) + "】");
          }
        },
        mark: true,
        intro: {
          name: "命运线：穹览",
          content(storage, player) {
            var finished = [], unfinished = ["shelie", "wengua", "rebotu"];
            if (player.storage.yuheng) {
              for (var i = 0; i < unfinished.length; i++) {
                if (player.storage.yuheng.includes(unfinished[i])) {
                  finished.push(unfinished[i]);
                  unfinished.splice(i--, 1);
                }
              }
            }
            var str = "";
            if (unfinished.length) {
              str += "<li>未获得：" + get.translation(unfinished) + "<br>";
            }
            if (finished.length) {
              str += "<li>已获得过：" + get.translation(finished) + "<br>";
            }
            str += '<li>锁定技，限定技。若你因〖驭衡〗获得过〖涉猎〗〖问卦〗〖博图〗，则当你发动的〖驭衡〗结算结束后，你随机获得两条其他<span style="font-family: yuanli">东吴命运线</span>。';
            return str;
          }
        }
      },
      quandao: {
        audio: 2,
        mod: {
          cardname(card, player) {
            if (player.storage.yuheng && typeof get.strNumber(card.number, false) === "string") {
              var list = ["rezhiheng", "jiexun", "reanxu"];
              for (var i of list) {
                if (!player.storage.yuheng.includes(i)) {
                  return;
                }
              }
              return "tiaojiyanmei";
            }
          }
        },
        init(player, skill) {
          player.markAuto("yuheng_current", ["rezhiheng", "jiexun", "reanxu"]);
        },
        mark: true,
        intro: {
          name: "命运线：权道",
          content(storage, player) {
            var finished = [], unfinished = ["rezhiheng", "jiexun", "reanxu"];
            if (player.storage.yuheng) {
              for (var i = 0; i < unfinished.length; i++) {
                if (player.storage.yuheng.includes(unfinished[i])) {
                  finished.push(unfinished[i]);
                  unfinished.splice(i--, 1);
                }
              }
            }
            var str = "";
            if (unfinished.length) {
              str += "<li>未获得：" + get.translation(unfinished) + "<br>";
            }
            if (finished.length) {
              str += "<li>已获得过：" + get.translation(finished) + "<br>";
            }
            str += "<li>锁定技。若你因〖驭衡〗获得过〖制衡〗〖诫训〗〖安恤〗，则你手牌区内点数为字母的牌的牌名视为【调剂盐梅】。";
            return str;
          }
        }
      },
      jiaohui: {
        audio: 2,
        mod: {
          cardname(card, player) {
            if (player.countCards("h") == 1 && player.storage.yuheng) {
              var list = ["xiashu", "rejieyin", "oldimeng"];
              for (var i of list) {
                if (!player.storage.yuheng.includes(i)) {
                  return;
                }
              }
              return "yuanjiao";
            }
          }
        },
        init(player, skill) {
          player.markAuto("yuheng_current", ["xiashu", "rejieyin", "oldimeng"]);
        },
        mark: true,
        intro: {
          name: "命运线：交辉",
          content(storage, player) {
            var finished = [], unfinished = ["xiashu", "rejieyin", "oldimeng"];
            if (player.storage.yuheng) {
              for (var i = 0; i < unfinished.length; i++) {
                if (player.storage.yuheng.includes(unfinished[i])) {
                  finished.push(unfinished[i]);
                  unfinished.splice(i--, 1);
                }
              }
            }
            var str = "";
            if (unfinished.length) {
              str += "<li>未获得：" + get.translation(unfinished) + "<br>";
            }
            if (finished.length) {
              str += "<li>已获得过：" + get.translation(finished) + "<br>";
            }
            str += "<li>锁定技。若你因〖驭衡〗获得过〖下书〗〖结姻〗〖缔盟〗，且你的手牌数为1，则此牌的牌名视为【远交近攻】。";
            return str;
          }
        }
      },
      yuanlv: {
        audio: 2,
        init(player, skill) {
          _status.changandajian_cardcolor = 0;
          player.markAuto("yuheng_current", ["xinfu_guanchao", "drlt_jueyan", "lanjiang"]);
        },
        trigger: { player: "useCardToTargeted" },
        forced: true,
        filter(event, player) {
          if (get.type(event.card, null, false) != "equip" || player != event.target || event.card.name.indexOf("changandajian_equip") == 0) {
            return false;
          }
          if (!player.storage.yuheng) {
            return false;
          }
          var list = ["xinfu_guanchao", "drlt_jueyan", "lanjiang"];
          for (var i of list) {
            if (!player.storage.yuheng.includes(i)) {
              return false;
            }
          }
          var type = get.subtype(event.card);
          if (lib.card["changandajian_" + type] && player.hasEquipableSlot(type)) {
            return true;
          }
          return false;
        },
        async content(event, trigger, player) {
          const cards2 = trigger.cards.filterInD();
          if (cards2.length > 0) {
            await game.cardsDiscard(cards2);
          }
          const type = get.subtype(trigger.card);
          const card = game.createCard("changandajian_" + type, _status.changandajian_cardcolor++ % 2 ? "spade" : "heart", 10);
          await player.useCard(card, player);
        },
        mark: true,
        intro: {
          name: "命运线：渊虑",
          content(storage, player) {
            var finished = [], unfinished = ["xinfu_guanchao", "drlt_jueyan", "lanjiang"];
            if (player.storage.yuheng) {
              for (var i = 0; i < unfinished.length; i++) {
                if (player.storage.yuheng.includes(unfinished[i])) {
                  finished.push(unfinished[i]);
                  unfinished.splice(i--, 1);
                }
              }
            }
            var str = "";
            if (unfinished.length) {
              str += "<li>未获得：" + get.translation(unfinished) + "<br>";
            }
            if (finished.length) {
              str += "<li>已获得过：" + get.translation(finished) + "<br>";
            }
            str += "<li>锁定技。若你因〖驭衡〗获得过〖观潮〗〖决堰〗〖澜疆〗，则当你成为自己使用的装备牌的目标后，你将此牌置于弃牌堆，然后使用一张与此装备牌副类别相同的【长安大舰】。";
            return str;
          }
        }
      }
    },
    ai: {
      combo: "yuheng"
    }
  },
  yuheng: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    async content(event, trigger, player) {
      let skills2 = player.getSkills(null, false, false).filter((skill) => {
        if (skill == "yuheng") {
          return false;
        }
        const info = get.info(skill);
        return info && !info.charlotte && !get.is.locked(skill);
      });
      if (skills2.length) {
        player.removeSkills(skills2);
      }
      const list1 = ["dili_shengzhi", "dili_chigang", "dili_qionglan", "dili_quandao", "dili_jiaohui", "dili_yuanlv"];
      const list2 = ["gzyinghun", "hongde", "rebingyi", "xinfu_guanwei", "bizheng", "xinanguo", "shelie", "wengua", "rebotu", "rezhiheng", "jiexun", "reanxu", "xiashu", "rejieyin", "oldimeng", "xinfu_guanchao", "drlt_jueyan", "lanjiang"];
      const list3 = [];
      if (!player.storage.yuheng_full) {
        player.storage.yuheng_full = list2.slice(0);
      }
      if (player.getStorage("yuheng_current").length == 0) {
        for (let i = 0; i < list1.length; i++) {
          if (player.hasSkill(list1[i])) {
            for (var j = 0; j < 3; j++) {
              list3.add(list2[i * 3 + j]);
            }
          }
        }
        if (!player.storage.yuheng_current) {
          player.storage.yuheng_current = list3.slice(0);
        }
      }
      let fullskills, currentskills;
      if (player.storage.yuheng_full && player.storage.yuheng_full.length) {
        fullskills = player.storage.yuheng_full;
      } else {
        fullskills = list2.slice(0);
      }
      if (player.storage.yuheng_current && player.storage.yuheng_current.length) {
        currentskills = player.storage.yuheng_current;
      } else {
        currentskills = list3.slice(0);
      }
      skills2 = [];
      const evtx = event.getParent("phaseUse");
      if (currentskills.length > 0 && !player.hasHistory("useSkill", (evt) => {
        if (evt.skill == "yuheng" || evt.type != "player" || !evt.sourceSkill) {
          return false;
        }
        const info1 = get.info(evt.skill);
        if (info1.charlotte) {
          return false;
        }
        const info = get.info(evt.sourceSkill);
        if (info.charlotte || get.is.locked(evt.skill)) {
          return false;
        }
        return evt.event.getParent("phaseUse") == evtx;
      })) {
        fullskills.randomSort();
        currentskills.randomSort();
        for (let i = 0; i < fullskills.length; i++) {
          for (let j2 = 0; j2 < currentskills.length; j2++) {
            if (fullskills[i] != currentskills[j2] || i == fullskills.length - 1 && j2 == currentskills.length - 1) {
              skills2.add(fullskills.splice(i--, 1)[0]);
              skills2.add(currentskills.splice(j2--, 1)[0]);
              break;
            }
          }
          if (skills2.length > 0) {
            break;
          }
        }
      } else {
        skills2.add(fullskills.randomRemove(1)[0]);
      }
      for (const skill of skills2) {
        player.addSkills(skill);
      }
      player.markAuto("yuheng", skills2);
    },
    ai: {
      order(item, player) {
        var evtx = _status.event.getParent("phaseUse");
        if (!player.hasHistory("useSkill", function(evt) {
          if (evt.skill == "yuheng" || evt.type != "player" || !evt.sourceSkill) {
            return false;
          }
          var info1 = get.info(evt.skill);
          if (info1.charlotte) {
            return false;
          }
          var info = get.info(evt.sourceSkill);
          if (info.charlotte || get.is.locked(evt.skill)) {
            return false;
          }
          return evt.event.getParent("phaseUse") == evtx;
        })) {
          return 11;
        }
        return 0.8;
      },
      result: { player: 1 }
    },
    group: "yuheng_losehp",
    subSkill: {
      losehp: {
        audio: "yuheng",
        trigger: { player: "phaseUseEnd" },
        forced: true,
        locked: false,
        filter(event, player) {
          return !player.hasHistory("useSkill", function(evt) {
            if (evt.skill != "yuheng") {
              return false;
            }
            return evt.event.getParent("phaseUse") == event;
          });
        },
        async content(event, trigger, player) {
          await player.loseHp();
        }
      }
    }
  },
  wuhun2: { audio: 2 },
  new_wuhun: {
    audio: "wuhun2",
    audioname2: { sxrm_caocao: "wuhun_sxrm_caocao", tw_sxrm_caocao: "wuhun_sxrm_caocao" },
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return event.source && event.source.isIn();
    },
    forced: true,
    logTarget: "source",
    async content(event, trigger, player) {
      trigger.source.addMark("new_wuhun", trigger.num);
    },
    group: "new_wuhun_die",
    ai: {
      notemp: true,
      effect: {
        target: (card, player, target) => {
          if (!target.hasFriend()) {
            return;
          }
          let rec = get.tag(card, "recover"), damage = get.tag(card, "damage");
          if (!rec && !damage) {
            return;
          }
          if (damage && player.hasSkillTag("jueqing", false, target)) {
            return 1.7;
          }
          let die = [null, 1], temp;
          game.filterPlayer((i) => {
            temp = i.countMark("new_wuhun");
            if (i === player && target.hp + target.hujia > 1) {
              temp++;
            }
            if (temp > die[1]) {
              die = [i, temp];
            } else if (temp === die[1]) {
              if (!die[0]) {
                die = [i, temp];
              } else if (get.attitude(target, i) < get.attitude(target, die[0])) {
                die = [i, temp];
              }
            }
          });
          if (die[0]) {
            if (damage) {
              return [1, 0, 1, -6 * get.sgnAttitude(player, die[0]) / Math.max(1, target.hp)];
            }
            return [1, 6 * get.sgnAttitude(player, die[0]) / Math.max(1, target.hp)];
          }
        }
      }
    },
    marktext: "魇",
    intro: {
      name: "梦魇",
      content: "mark",
      onunmark: true
    },
    subSkill: {
      die: {
        audio: "wuhun2",
        trigger: { player: "die" },
        filter(event, player) {
          return game.hasPlayer(function(current) {
            return current != player && current.hasMark("new_wuhun");
          });
        },
        forced: true,
        direct: true,
        forceDie: true,
        skillAnimation: true,
        animationColor: "soil",
        async content(event, trigger, player) {
          let maxNum = 0;
          for (const current of game.players) {
            if (current === player) {
              continue;
            }
            const markNum = current.countMark("new_wuhun");
            maxNum = Math.max(maxNum, markNum);
          }
          const num = maxNum;
          let result = await player.chooseTarget(true, "请选择【武魂】的目标", "令其进行判定，若判定结果不为【桃】或【桃园结义】，则其死亡", (card, player2, target2) => {
            return target2 != player2 && target2.countMark("new_wuhun") == _status.event.num;
          }).set("ai", (target2) => -get.attitude(_status.event.player, target2)).set("forceDie", true).set("num", num).forResult();
          if (!result.bool) {
            return;
          }
          const target = result.targets[0];
          event.target = target;
          player.logSkill("new_wuhun_die", target);
          player.line(target, { color: [255, 255, 0] });
          await game.delay(2);
          result = await target.judge((card) => ["tao", "taoyuan"].includes(card.name) ? 10 : -10).set("judge2", (result2) => !result2.bool).forResult();
          if (!result.bool) {
            await target.die();
          }
        }
      }
    }
  },
  new_guixin: {
    audio: "guixin",
    trigger: {
      player: "damageEnd"
    },
    filter(event, player) {
      return game.hasPlayer((cur) => {
        return cur !== player && cur.countCards("hej") > 0;
      });
    },
    check(event, player) {
      if (player.isTurnedOver() || event.num > 1) {
        return true;
      }
      var num = game.countPlayer(function(current) {
        if (current.countCards("he") && current != player && get.attitude(player, current) <= 0) {
          return true;
        }
        if (current.countCards("j") && current != player && get.attitude(player, current) > 0) {
          return true;
        }
      });
      return num >= 2;
    },
    getIndex(event, player) {
      return event.num;
    },
    async content(event, trigger, player) {
      let targets = game.filterPlayer();
      targets.remove(player);
      targets.sort(lib.sort.seat);
      player.line(targets, "green");
      const control = await player.chooseControl("手牌区", "装备区", "判定区").set("ai", function() {
        if (game.hasPlayer(function(current) {
          return current.countCards("j") && current != player && get.attitude(player, current) > 0;
        })) {
          return 2;
        }
        return Math.floor(Math.random() * 3);
      }).set("prompt", "请选择优先获得的区域").forResult();
      const range = {
        手牌区: ["h", "e", "j"],
        装备区: ["e", "h", "j"],
        判定区: ["j", "h", "e"]
      }[control.control || "手牌区"];
      while (targets.length > 0) {
        const target = targets.shift();
        for (var i = 0; i < range.length; i++) {
          var cards2 = target.getCards(range[i]);
          if (cards2.length) {
            var card = cards2.randomGet();
            await player.gain(card, target, "giveAuto", "bySelf");
            break;
          }
        }
      }
      await player.turnOver();
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      threaten(player, target) {
        if (target.hp == 1) {
          return 2.5;
        }
        return 1;
      },
      effect: {
        target(card, player, target) {
          if (!target._new_guixin_eff && get.tag(card, "damage") && target.hp > (player.hasSkillTag("damageBonus", true, {
            card,
            target
          }) ? 2 : 1)) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return [1, -2];
            }
            target._new_guixin_eff = true;
            let gain = game.countPlayer(function(current) {
              if (target == current) {
                return 0;
              }
              if (get.attitude(target, current) > 0) {
                if (current.hasCard((cardx) => lib.filter.canBeGained(cardx, target, current, "new_guixin") && get.effect(current, cardx, current, current) < 0, "j")) {
                  return 1.3;
                }
                return 0;
              }
              if (current.hasCard((cardx) => lib.filter.canBeGained(cardx, target, current, "new_guixin") && get.effect(current, cardx, current, current) > 0, "e")) {
                return 1.1;
              }
              if (current.hasCard((cardx) => lib.filter.canBeGained(cardx, target, current, "new_guixin"), "h")) {
                return 0.9;
              }
              return 0;
            });
            if (target.isTurnedOver()) {
              gain += 2.3;
            } else {
              gain -= 2.3;
            }
            delete target._new_guixin_eff;
            return [1, Math.max(0, gain)];
          }
        }
      }
    }
  },
  ol_shenfen: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.countMark("baonu") >= 6;
    },
    usable: 1,
    skillAnimation: true,
    animationColor: "metal",
    async content(event, trigger, player) {
      player.removeMark("baonu", 6);
      const targets = game.filterPlayer((target) => target !== player);
      player.line(targets, "green");
      await game.doAsyncInOrder(targets, (target) => target.damage("nocard"));
      await game.doAsyncInOrder(targets, async (target) => {
        const cards2 = target.getCards("e");
        await target.discard(cards2).set("delay", false);
        if (cards2.length) {
          await game.delay(0.5);
        }
      });
      await game.doAsyncInOrder(targets, async (target) => {
        const num = target.countCards("h");
        await target.chooseToDiscard(4, "h", true).set("delay", false);
        if (num > 0) {
          await game.delay(0.5);
        }
      });
      await player.turnOver();
    },
    ai: {
      combo: "baonu",
      order: 10,
      result: {
        player(player) {
          return game.countPlayer(function(current) {
            if (current != player) {
              return get.sgn(get.damageEffect(current, player, player));
            }
          });
        }
      }
    }
  },
  ol_wuqian: {
    audio: 2,
    enable: "phaseUse",
    derivation: "wushuang",
    filter(event, player) {
      return player.countMark("baonu") >= 2 && game.hasPlayer((target) => lib.skill.ol_wuqian.filterTarget(null, player, target));
    },
    filterTarget(card, player, target) {
      return target != player && !target.hasSkill("ol_wuqian_targeted");
    },
    async content(event, trigger, player) {
      const { target } = event;
      player.removeMark("baonu", 2);
      await player.addTempSkills("wushuang");
      player.popup("无双");
      target.addTempSkill("ol_wuqian_targeted");
    },
    ai: {
      order: 9,
      result: {
        target(player, target) {
          if (player.countCards("hs", (card) => {
            if (!player.getCardUsable({ name: card.name })) {
              return false;
            }
            if (!player.canUse(card, target)) {
              return false;
            }
            var eff1 = get.effect(target, card, player, player);
            _status.baonuCheck = true;
            var eff2 = get.effect(target, card, player, player);
            delete _status.baonuCheck;
            return eff2 > Math.max(0, eff1);
          })) {
            return -1;
          }
          return 0;
        }
      },
      combo: "baonu"
    },
    global: "ol_wuqian_ai",
    subSkill: {
      targeted: {
        charlotte: true,
        ai: { unequip2: true }
      },
      ai: {
        ai: {
          unequip2: true,
          skillTagFilter(player) {
            if (!_status.baonuCheck) {
              return false;
            }
          }
        }
      }
    }
  },
  wumou: {
    audio: 2,
    trigger: { player: "useCard" },
    forced: true,
    filter(event) {
      return get.type(event.card) == "trick";
    },
    async content(event, trigger, player) {
      if (!player.hasMark("baonu")) {
        await player.loseHp();
        return;
      }
      const result = await player.chooseControlList(["移去一枚【暴怒】标记", "失去1点体力"], true).set("ai", (event2, player2) => {
        if (get.effect(player2, { name: "losehp" }, player2, player2) >= 0) {
          return 1;
        }
        if (player2.countMark("baonu") > 6) {
          return 0;
        }
        if (player2.hp + player2.countCards("h", "tao") > 3) {
          return 1;
        }
        return 0;
      }).forResult();
      if (result.index == 0) {
        player.removeMark("baonu", 1);
      } else {
        await player.loseHp();
      }
    },
    ai: {
      effect: {
        player_use(card, player) {
          if (get.type(card) == "trick" && get.value(card) < 6) {
            return [0, -2];
          }
        }
      },
      neg: true
    }
  },
  qinyin: {
    audio: 2,
    audioname: ["mb_zhouyu"],
    trigger: { player: "phaseDiscardEnd" },
    direct: true,
    logAudio: (index) => typeof index === "number" ? "qinyin" + index + ".mp3" : 2,
    logAudio2: {
      mb_zhouyu: (index) => typeof index === "number" ? `qinyin_mb_zhouyu${index}.mp3` : 2
    },
    filter(event, player) {
      var cards2 = [];
      player.getHistory("lose", function(evt) {
        if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) {
          cards2.addArray(evt.cards2);
        }
      });
      return cards2.length > 1;
    },
    async content(event, trigger, player) {
      event.forceDie = true;
      if (typeof event.count !== "number") {
        event.count = 1;
      }
      for (let time = event.count; time > 0; time--) {
        let recover = 0;
        let lose = 0;
        const players = game.filterPlayer();
        for (const current of players) {
          if (current.hp < current.maxHp) {
            if (get.attitude(player, current) > 0) {
              if (current.hp < 2) {
                lose--;
                recover += 0.5;
              }
              lose--;
              recover++;
            } else if (get.attitude(player, current) < 0) {
              if (current.hp < 2) {
                lose++;
                recover -= 0.5;
              }
              lose++;
              recover--;
            }
          } else {
            if (get.attitude(player, current) > 0) {
              lose--;
            } else if (get.attitude(player, current) < 0) {
              lose++;
            }
          }
        }
        get.prompt("qinyin") + "（剩余" + get.cnNumber(time) + "次）";
        const next = player.chooseControl("失去体力", "回复体力", "cancel2", ui.create.dialog(get.prompt("qinyin"), "hidden"));
        next.set("ai", () => {
          if (lose > recover && lose > 0) {
            return 0;
          }
          if (lose < recover && recover > 0) {
            return 1;
          }
          return 2;
        });
        const result = await next.forResult();
        if (result.control === "cancel2") {
          return;
        }
        player.logSkill("qinyin", null, null, null, [result.control == "回复体力" ? 2 : 1]);
        const bool = result.control === "回复体力";
        await game.doAsyncInOrder(game.filterPlayer(), async (target) => {
          if (bool) {
            await target.recover();
          } else {
            await target.loseHp();
          }
        });
      }
    },
    ai: {
      expose: 0.1,
      threaten: 2
    }
  },
  lianpo: {
    audio: 2,
    audioname: ["new_simayi"],
    trigger: { global: "phaseAfter" },
    frequent: true,
    filter(event, player) {
      return player.getStat("kill") > 0;
    },
    async content(event, trigger, player) {
      player.insertPhase();
    }
  },
  baonu: {
    audio: 2,
    marktext: "暴",
    trigger: {
      source: "damageSource",
      player: ["damageEnd", "enterGame"],
      global: "phaseBefore"
    },
    forced: true,
    filter(event) {
      return event.name != "damage" && (event.name != "phase" || game.phaseNumber == 0) || event.num > 0;
    },
    async content(event, trigger, player) {
      player.addMark("baonu", trigger.name == "damage" ? trigger.num : 2);
    },
    intro: {
      name: "暴怒",
      content: "mark"
    },
    ai: {
      combo: "ol_shenfen",
      maixie: true,
      maixie_hp: true
    }
  },
  shenfen: {
    audio: 2,
    unique: true,
    enable: "phaseUse",
    filter(event, player) {
      return player.storage.baonu >= 6;
    },
    skillAnimation: true,
    animationColor: "metal",
    limited: true,
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      player.storage.baonu -= 6;
      player.markSkill("baonu");
      player.syncStorage("baonu");
      event.targets = game.filterPlayer();
      event.targets.remove(player);
      event.targets2 = event.targets.slice(0);
      player.line(event.targets, "green");
      await game.doAsyncInOrder(event.targets, (target) => target.damage());
      await game.doAsyncInOrder(event.targets2, async (target) => {
        if (target && target.countCards("he")) {
          await target.chooseToDiscard("he", true, 4);
        }
      });
    },
    ai: {
      order: 10,
      result: {
        player(player) {
          return game.countPlayer(function(current) {
            if (current != player) {
              return get.sgn(get.damageEffect(current, player, player));
            }
          });
        }
      },
      combo: "baonu"
    }
  },
  wuqian: {
    audio: 2,
    enable: "phaseUse",
    derivation: "wushuang",
    filter(event, player) {
      return player.storage.baonu >= 2 && !player.hasSkill("wushuang");
    },
    async content(event, trigger, player) {
      player.storage.baonu -= 2;
      player.addTempSkill("wushuang");
    },
    ai: {
      order: 5,
      result: {
        player(player) {
          if (!player.storage.shenfen) {
            return 0;
          }
          var cards2 = player.getCards("h", "sha");
          if (cards2.length) {
            if (game.hasPlayer(function(current) {
              return player.canUse("sha", current) && get.effect(current, cards2[0], player, player) > 0 && current.hasShan();
            })) {
              return 1;
            }
          }
          return 0;
        }
      },
      combo: "baonu"
    }
  },
  renjie: {
    audio: "renjie2",
    trigger: { player: "damageEnd" },
    forced: true,
    group: "renjie2",
    filter(event) {
      return event.num > 0;
    },
    async content(event, trigger, player) {
      player.addMark("renjie", trigger.num);
    },
    intro: {
      name2: "忍",
      content: "mark"
    },
    marktext: "忍",
    ai: {
      maixie: true,
      maixie_hp: true,
      combo: "jilue",
      effect: {
        target(card, player, target) {
          if (!target.hasSkill("sbaiyin") && !target.hasSkill("jilue") || !target.hasFriend()) {
            return;
          }
          if (player.hasSkillTag("jueqing", false, target)) {
            return [1, -2];
          }
          if (get.tag(card, "damage")) {
            if (target.isHealthy() && target.getHp() > 2) {
              if (!target.hasSkill("jilue")) {
                return [0, 1];
              }
              return [0.7, 1];
            }
            return 0.7;
          }
        }
      }
    }
  },
  renjie2: {
    audio: 2,
    mod: {
      aiOrder: (player, card, num) => {
        if (num <= 0 || typeof card !== "object" || !player.isPhaseUsing() || player.isDying()) {
          return num;
        }
        if (player.hasSkill("sbaiyin")) {
          if (player.countMark("renjie") < 4 && player.getUseValue(card) < Math.min(4, player.hp * player.hp / 4)) {
            return 0;
          }
        } else if (player.hasSkill("jilue")) {
          if (player.countMark("renjie") < 3 && player.getUseValue(card) < Math.min(1.8, 0.18 * player.hp * player.hp)) {
            return 0;
          }
        }
      }
    },
    trigger: {
      player: "loseAfter",
      global: "loseAsyncAfter"
    },
    forced: true,
    sourceSkill: "renjie",
    filter(event, player) {
      if (event.type != "discard" || event.getlx === false) {
        return false;
      }
      var evt = event.getParent("phaseDiscard"), evt2 = event.getl(player);
      return evt && evt2 && evt.name == "phaseDiscard" && evt.player == player && evt2.cards2 && evt2.cards2.length > 0;
    },
    async content(event, trigger, player) {
      player.addMark("renjie", trigger.getl(player).cards2.length);
    }
  },
  sbaiyin: {
    skillAnimation: "epic",
    animationColor: "thunder",
    juexingji: true,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    audio: 2,
    filter(event, player) {
      return player.countMark("renjie") >= 4;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.loseMaxHp();
      await player.addSkills("jilue");
    },
    derivation: ["jilue", "jilue_guicai", "jilue_fangzhu", "jilue_jizhi", "jilue_zhiheng", "jilue_wansha"],
    ai: { combo: "renjie" }
  },
  jilue: {
    audio: 2,
    group: ["jilue_guicai", "jilue_fangzhu", "jilue_wansha", "jilue_zhiheng", "jilue_jizhi"],
    ai: { combo: "renjie" }
  },
  jilue_guicai: {
    audio: 1,
    trigger: { global: "judge" },
    filter(event, player) {
      return player.countCards("hes") > 0 && player.hasMark("renjie");
    },
    async cost(event, trigger, player) {
      const next = player.chooseCard("是否弃置一枚“忍”，并发动〖鬼才〗？", "hes", filterCard);
      next.set("ai", processAI);
      event.result = await next.forResult();
      return;
      function filterCard(card) {
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
      }
      function processAI(card) {
        const trigger2 = get.event().parent._trigger;
        const player2 = get.event().player;
        const result = trigger2.judge(card) - trigger2.judge(trigger2.player.judging[0]);
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
      }
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      const [card] = cards2;
      player.removeMark("renjie", 1);
      await player.respond(cards2, "highlight", "noOrdering");
      if (trigger.player.judging[0].clone) {
        trigger.player.judging[0].clone.delete();
        game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
      }
      await game.cardsDiscard(trigger.player.judging[0]);
      trigger.player.judging[0] = card;
      trigger.orderingCards.addArray(cards2);
      game.log(trigger.player, "的判定牌改为", card);
      await game.delay(2);
    },
    ai: {
      rejudge: true,
      tag: {
        rejudge: 1
      }
    }
  },
  jilue_fangzhu: {
    audio: 1,
    trigger: { player: "damageEnd" },
    //priority:-1,
    filter(event, player) {
      return player.hasMark("renjie");
    },
    async cost(event, trigger, player) {
      const next = player.chooseTarget("是否弃置一枚“忍”，并发动【放逐】？", (card, player2, target) => player2 !== target);
      next.set("ai", processAI);
      event.result = await next.forResult();
      return;
      function processAI(target) {
        if (target.hasSkillTag("noturn")) {
          return 0;
        }
        const player2 = get.player();
        const current = _status.currentPhase;
        const dis = current ? get.distance(current, target, "absolute") : 1;
        const draw = player2.getDamagedHp();
        const att = get.attitude(player2, target);
        if (att == 0) {
          return target.hasJudge("lebu") ? Math.random() / 3 : Math.sqrt(get.threaten(target)) / 5 + Math.random() / 2;
        }
        if (att > 0) {
          if (target.isTurnedOver()) {
            return att + draw;
          }
          if (draw < 4) {
            return -1;
          }
          if (current && target.getSeatNum() > current.getSeatNum()) {
            return att + draw / 3;
          }
          return 10 * Math.sqrt(Math.max(0.01, get.threaten(target))) / (3.5 - draw) + dis / (2 * game.countPlayer());
        } else {
          if (target.isTurnedOver()) {
            return att - draw;
          }
          if (draw >= 5) {
            return -1;
          }
          if (current && target.getSeatNum() <= current.getSeatNum()) {
            return -att + draw / 3;
          }
          return (4.25 - draw) * 10 * Math.sqrt(Math.max(0.01, get.threaten(target))) + 2 * game.countPlayer() / dis;
        }
      }
    },
    logTarget: "targets",
    async content(event, trigger, player) {
      const { targets } = event;
      const [target] = targets;
      player.removeMark("renjie", 1);
      await target.draw(player.maxHp - player.hp);
      await target.turnOver();
    }
  },
  jilue_wansha: {
    audio: 1,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hasMark("renjie");
    },
    async content(event, trigger, player) {
      player.removeMark("renjie", 1);
      player.addTempSkill("rewansha");
    },
    ai: {
      order: () => {
        let player = _status.event.player;
        if (game.hasPlayer((current) => {
          if (player === current || current.hp > 1 || get.attitude(player, current) >= 0) {
            return false;
          }
          return player.inRange(current) && player.countCards("hs", "sha") && player.getCardUsable("sha") || player.countCards("hs", (card) => get.name(card) !== "sha" && get.tag(card, "damage")) > 1;
        })) {
          return 9.2;
        }
        return 0;
      },
      result: {
        player: 1
      },
      effect: {
        player(card, player, target) {
          if (target && player.hasSkill("rewansha") && target.hp <= 1 && get.tag(card, "damage")) {
            return [1, 0, 1.5, -1.5];
          }
        }
      }
    }
  },
  jilue_zhiheng: {
    audio: 1,
    audioname2: {},
    inherit: "rezhiheng",
    filter(event, player) {
      return player.hasMark("renjie");
    },
    prompt: "弃置一枚“忍”，然后弃置任意张牌并摸等量的牌。若弃置了所有的手牌，则可以多摸一张牌。",
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      player.removeMark("renjie", 1);
      const hs = player.getCards("h");
      const num = hs.length > 0 && hs.every((card) => cards2.includes(card)) ? 1 : 0;
      await player.discard({ cards: cards2 });
      await player.draw(num + cards2.length);
    },
    ai: {
      order(item, player) {
        if (player.hasCard((i) => get.value(i) > Math.max(6, 9 - player.hp), "he")) {
          return 1;
        }
        return 10;
      },
      result: {
        player(player) {
          var cards2 = player.getCards("he");
          for (var i = 0; i < cards2.length; i++) {
            if (get.value(cards2[i]) < 6) ;
          }
          if (cards2.length > 2) {
            return 1;
          }
          return 0;
        }
      },
      nokeep: true,
      skillTagFilter(player, tag, arg) {
        if (tag === "nokeep") {
          return player.isPhaseUsing() && !player.getStat().skill.jilue_zhiheng && player.hasCard((card) => get.name(card) !== "tao", "h");
        }
      }
    }
  },
  jilue_jizhi: {
    audio: 1,
    trigger: { player: "useCard" },
    filter(event, player) {
      return get.type(event.card, "trick") == "trick" && event.card.isCard && player.hasMark("renjie");
    },
    async content(event, trigger, player) {
      player.removeMark("renjie", 1);
      const result = await player.draw("nodelay").forResult();
      event.card = result.cards[0];
      if (get.type(event.card) !== "basic") {
        return;
      }
      const result2 = await player.chooseBool(`是否弃置${get.translation(event.card)}并令本回合手牌上限+1？`).set("ai", (evt, player2) => _status.currentPhase === player2 && player2.needsToDiscard(-3) && _status.event.value < 6).set("value", get.value(event.card, player)).forResult();
      if (result2.bool) {
        await player.discard(event.card);
        player.addTempSkill("jilue_jizhi_clear");
        player.addMark("jilue_jizhi_clear", 1, false);
      }
    },
    subSkill: {
      clear: {
        charlotte: true,
        onremove: true,
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("jilue_jizhi_clear");
          }
        },
        intro: { content: "手牌上限+#" }
      }
    }
  },
  wushen: {
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
      },
      cardUsable(card) {
        if (card.name === "sha") {
          const suit = get.suit(card);
          if (suit === "heart" || suit === "unsure") {
            return Infinity;
          }
        }
      }
    },
    audio: 2,
    trigger: { player: "useCard" },
    forced: true,
    filter(event, player) {
      return event.card.name == "sha" && get.suit(event.card) == "heart";
    },
    async content(event, trigger, player) {
      trigger.directHit.addArray(game.players);
      if (trigger.addCount !== false) {
        trigger.addCount = false;
        if (player.stat[player.stat.length - 1].card.sha > 0) {
          player.stat[player.stat.length - 1].card.sha--;
        }
      }
    },
    ai: {
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "respondSha") && current < 0) {
            return 0.6;
          }
        }
      },
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        return arg.card.name == "sha" && get.suit(arg.card) == "heart";
      }
    }
  },
  wuhun: {
    audio: "wuhun2",
    trigger: { player: "die" },
    filter(event) {
      return event.source && event.source.isIn();
    },
    forced: true,
    forceDie: true,
    skillAnimation: true,
    animationColor: "soil",
    logTarget: "source",
    async content(event, trigger, player) {
      const num = trigger.source.getHp();
      if (num > 0) {
        await trigger.source.loseHp(num);
      }
    },
    ai: {
      threaten(player, target) {
        if (target.hp == 1) {
          if (player.getHp() <= 0) {
            return 100;
          }
          return 0.2;
        }
        return 0.8;
      },
      effect: {
        target(card, player, target, current) {
          if (player.getHp() <= 0) {
            return;
          }
          if (!target.hasFriend()) {
            return;
          }
          if (target.hp <= 1 && get.tag(card, "damage")) {
            return [1, 0, 0, -2 * player.getHp()];
          }
        }
      }
    }
  },
  guixin: {
    audio: 2,
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return game.hasPlayer((cur) => {
        return cur !== player && cur.countCards("hej") > 0;
      });
    },
    check(event, player) {
      if (player.isTurnedOver() || event.num > 1) {
        return true;
      }
      var num = game.countPlayer(function(current) {
        if (current.countCards("he") && current != player && get.attitude(player, current) <= 0) {
          return true;
        }
        if (current.countCards("j") && current != player && get.attitude(player, current) > 0) {
          return true;
        }
      });
      return num >= 2;
    },
    getIndex(event, player) {
      return event.num;
    },
    async content(event, trigger, player) {
      let targets = game.filterPlayer((current) => current != player).sortBySeat();
      player.line(targets, "green");
      await player.gainMultiple(targets, "hej");
      await player.turnOver();
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      threaten(player, target) {
        if (target.hp == 1) {
          return 2.5;
        }
        return 0.5;
      },
      effect: {
        target(card, player, target) {
          if (!target._guixin_eff && get.tag(card, "damage") && target.hp > (player.hasSkillTag("damageBonus", true, {
            card,
            target
          }) ? 2 : 1)) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return [1, -2];
            }
            target._guixin_eff = true;
            let gain = game.countPlayer(function(current) {
              if (target == current) {
                return 0;
              }
              if (get.attitude(target, current) > 0) {
                if (current.hasCard((cardx) => lib.filter.canBeGained(cardx, target, current, "guixin") && get.effect(current, cardx, current, current) < 0, "ej")) {
                  return 1.3;
                }
                return 0;
              }
              if (current.hasCard((cardx) => lib.filter.canBeGained(cardx, target, current, "guixin") && get.effect(current, cardx, current, current) > 0, "ej")) {
                return 1.1;
              }
              if (current.hasCard((cardx) => lib.filter.canBeGained(cardx, target, current, "guixin"), "h")) {
                return 0.9;
              }
              return 0;
            });
            if (target.isTurnedOver()) {
              gain += 2.3;
            } else {
              gain -= 2.3;
            }
            delete target._guixin_eff;
            return [1, Math.max(0, gain)];
          }
        }
      }
    }
  },
  qixing: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    locked: false,
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      const getStars = player.addToExpansion(get.cards(7), "draw");
      getStars.gaintag.add("qixing");
      await getStars;
      const expansions = player.getExpansions("qixing");
      const cards2 = player.getCards("h");
      if (!expansions.length || !cards2.length) {
        return;
      }
      const next = player.chooseToMove("七星：是否交换“星”和手牌？");
      next.set("list", [
        [`${get.translation(player)}（你）的星`, expansions],
        ["手牌区", cards2]
      ]);
      next.set("filterMove", (from, to) => typeof to != "number");
      next.set("processAI", processAI);
      const result = await next.forResult();
      if (result.bool) {
        const pushs = result.moved[0];
        const gains = result.moved[1];
        pushs.removeArray(expansions);
        gains.removeArray(cards2);
        if (!pushs.length || pushs.length !== gains.length) {
          return;
        }
        player.logSkill("qixing2");
        const addStars = player.addToExpansion(pushs, player, "giveAuto");
        addStars.gaintag.add("qixing");
        await addStars;
        await player.gain(gains, "draw");
      }
      return;
      function processAI(list) {
        const player2 = get.player();
        const cards3 = list[0][1].concat(list[1][1]).sort((a, b) => get.useful(a) - get.useful(b));
        const cards22 = cards3.splice(0, player2.getExpansions("qixing").length);
        return [cards22, cards3];
      }
    },
    intro: {
      markcount: "expansion",
      mark(dialog, content, player) {
        var content = player.getExpansions("qixing");
        if (content && content.length) {
          if (player == game.me || player.isUnderControl()) {
            dialog.addAuto(content);
          } else {
            return "共有" + get.cnNumber(content.length) + "张星";
          }
        }
      },
      content(content, player) {
        var content = player.getExpansions("qixing");
        if (content && content.length) {
          if (player == game.me || player.isUnderControl()) {
            return get.translation(content);
          }
          return "共有" + get.cnNumber(content.length) + "张星";
        }
      }
    },
    group: ["qixing2"],
    ai: {
      notemp: true
    }
  },
  qixing2: {
    trigger: { player: "phaseDrawAfter" },
    direct: true,
    sourceSkill: "qixing",
    filter(event, player) {
      return player.getExpansions("qixing").length > 0 && player.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      const expansions = player.getExpansions("qixing");
      const cards2 = player.getCards("h");
      if (!expansions.length || !cards2.length) {
        return;
      }
      const next = player.chooseToMove("七星：是否交换“星”和手牌？");
      next.set("list", [
        [`${get.translation(player)}（你）的星`, expansions],
        ["手牌区", cards2]
      ]);
      next.set("filterMove", (from, to) => typeof to != "number");
      next.set("processAI", processAI);
      const result = await next.forResult();
      if (result.bool) {
        const pushs = result.moved[0];
        const gains = result.moved[1];
        pushs.removeArray(expansions);
        gains.removeArray(cards2);
        if (!pushs.length || pushs.length !== gains.length) {
          return;
        }
        player.logSkill("qixing2");
        const addStars = player.addToExpansion(pushs, player, "giveAuto");
        addStars.gaintag.add("qixing");
        await addStars;
        await player.gain(gains, "draw");
      }
      return;
      function processAI(list) {
        const player2 = get.player();
        const cards3 = list[0][1].concat(list[1][1]).sort((a, b) => get.value(a) - get.value(b));
        const cards22 = cards3.splice(0, player2.getExpansions("qixing").length);
        return [cards22, cards3];
      }
    }
  },
  dawu: {
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return player.getExpansions("qixing").length;
    },
    audio: 2,
    async cost(event, trigger, player) {
      const {
        bool,
        targets,
        links: cost_data
      } = await player.chooseButtonTarget({
        createDialog: [get.prompt2(event.skill), player.getExpansions("qixing")],
        selectButton: [1, game.countPlayer()],
        filterTarget: true,
        selectTarget() {
          return ui.selected.buttons.length;
        },
        complexSelect: true,
        ai1(button) {
          const { player: player2, allUse } = get.event();
          const targets2 = game.filterPlayer((target) => {
            if (target.isMin() || target.hasSkill("biantian2") || target.hasSkill("dawu2")) {
              return false;
            }
            let att = get.attitude(player2, target);
            if (att >= 4) {
              if (target.hp > 2 && (target.isHealthy() || target.hasSkillTag("maixie"))) {
                return false;
              }
              if (allUse || target.hp == 1) {
                return true;
              }
              if (target.hp == 2 && target.countCards("he") <= 2) {
                return true;
              }
            }
            return false;
          });
          if (ui.selected.buttons.length < targets2.length) {
            return 1;
          }
          return 0;
        },
        ai2(target) {
          const { player: player2, allUse } = get.event();
          if (target.isMin() || target.hasSkill("biantian2") || target.hasSkill("dawu2")) {
            return 0;
          }
          let att = get.attitude(player2, target);
          if (att >= 4) {
            if (target.hp > 2 && (target.isHealthy() || target.hasSkillTag("maixie"))) {
              return 0;
            }
            if (allUse || target.hp == 1) {
              return att;
            }
            if (target.hp == 2 && target.countCards("he") <= 2) {
              return att * 0.7;
            }
            return 0;
          }
          return -1;
        }
      }).set("allUse", player.getExpansions("qixing").length >= game.countPlayer((current) => get.attitude(player, current) > 4) * 2).forResult();
      event.result = {
        bool,
        targets: targets?.sortBySeat(),
        cost_data
      };
    },
    async content(event, trigger, player) {
      const { targets, cost_data: cards2 } = event;
      targets.forEach((target) => {
        target.addAdditionalSkill(`dawu_${player.playerid}`, "dawu2");
        target.markAuto("dawu2", [player]);
      });
      player.addTempSkill("dawu3", { player: "phaseBeginStart" });
      await player.loseToDiscardpile(cards2);
    },
    ai: {
      combo: "qixing"
    }
  },
  dawu2: {
    charlotte: true,
    ai: {
      nofire: true,
      nodamage: true,
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "damage") && !get.tag(card, "thunderDamage")) {
            return "zeroplayertarget";
          }
        }
      }
    },
    intro: {
      content(storage) {
        return `共有${storage.length}枚标记`;
      }
    }
  },
  dawu3: {
    trigger: { global: "damageBegin4" },
    sourceSkill: "dawu",
    filter(event, player) {
      return !event.hasNature("thunder") && event.player.getStorage("dawu2").includes(player);
    },
    forced: true,
    charlotte: true,
    logTarget: "player",
    async content(event, trigger, player) {
      trigger.cancel();
    },
    onremove(player) {
      game.countPlayer2((current) => {
        if (current.getStorage("dawu2").includes(player)) {
          current.unmarkAuto("dawu2", [player]);
          current.removeAdditionalSkill(`dawu_${player.playerid}`);
        }
      }, true);
    }
  },
  kuangfeng: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return player.getExpansions("qixing").length;
    },
    async cost(event, trigger, player) {
      const {
        bool,
        targets,
        links: cost_data
      } = await player.chooseButtonTarget({
        createDialog: [get.prompt2(event.skill), player.getExpansions("qixing")],
        selectButton: 1,
        filterTarget: true,
        ai1(button) {
          const player2 = get.player();
          if (game.hasPlayer((target) => {
            return get.attitude(player2, target) < 0;
          }) && game.hasPlayer((target) => {
            return player2 != target && get.attitude(player2, target) > 0;
          })) {
            return 1;
          }
          return 0;
        },
        ai2(target) {
          return -get.attitude(get.player(), target);
        }
      }).forResult();
      event.result = {
        bool,
        targets: targets?.sortBySeat(),
        cost_data
      };
    },
    async content(event, trigger, player) {
      const { targets, cost_data: cards2 } = event;
      targets.forEach((target) => {
        target.addAdditionalSkill(`kuangfeng_${player.playerid}`, "kuangfeng2");
        target.markAuto("kuangfeng2", [player]);
      });
      player.addTempSkill("kuangfeng3", { player: "phaseBeginStart" });
      await player.loseToDiscardpile(cards2);
    },
    ai: {
      combo: "qixing"
    }
  },
  kuangfeng2: {
    charlotte: true,
    intro: {
      content(storage) {
        return `共有${storage.length}枚标记`;
      }
    },
    ai: {
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "fireDamage") && current < 0) {
            return 1.5;
          }
        }
      }
    }
  },
  kuangfeng3: {
    trigger: { global: "damageBegin3" },
    sourceSkill: "kuangfeng",
    filter(event, player) {
      return event.hasNature("fire") && event.player.getStorage("kuangfeng2").includes(player);
    },
    charlotte: true,
    forced: true,
    logTarget: "player",
    async content(event, trigger, player) {
      trigger.num++;
    },
    onremove(player) {
      game.countPlayer2((current) => {
        if (current.getStorage("kuangfeng2").includes(player)) {
          current.unmarkAuto("kuangfeng2", player);
          current.removeAdditionalSkill(`kuangfeng_${player.playerid}`);
        }
      }, true);
    }
  },
  yeyan: {
    limited: true,
    audio: 2,
    enable: "phaseUse",
    filterCard(card, player) {
      return !ui.selected.cards.some((cardx) => get.suit(cardx, player) == get.suit(card, player));
    },
    selectCard: [0, 4],
    filterTarget(card, player, target) {
      var length = ui.selected.cards.length;
      return length == 0 || length == 4;
    },
    selectTarget() {
      if (ui.selected.cards.length == 4) {
        return [1, 2];
      }
      if (ui.selected.cards.length == 0) {
        return [1, 3];
      }
      game.uncheck("target");
      return [1, 3];
    },
    complexCard: true,
    complexSelect: true,
    line: "fire",
    forceDie: true,
    animationColor: "metal",
    skillAnimation: "legend",
    check(card) {
      if (!lib.skill.yeyan.getBigFire(get.event().player)) {
        return -1;
      }
      return 1 / (get.value(card) || 0.5);
    },
    multitarget: true,
    multiline: true,
    async contentBefore(event, trigger, player) {
      player.awakenSkill(event.skill);
    },
    async content(event, trigger, player) {
      const { cards: cards2, targets } = event;
      if (cards2.length !== 4) {
        await game.doAsyncInOrder(
          targets,
          (target) => target.damage({
            num: 1,
            nature: "fire",
            nocard: true
          })
        );
        return;
      }
      await player.loseHp(3);
      if (targets.length === 1) {
        const result = await player.chooseControl("2点", "3点").set("prompt", "请选择伤害点数").set("ai", () => "3点").set("forceDie", true).forResult();
        await targets[0].damage({
          num: result.control === "2点" ? 2 : 3,
          nature: "fire",
          nocard: true
        });
      } else {
        const result = await player.chooseTarget("请选择受到2点伤害的角色", true, (card, player2, target) => {
          return get.event().targets.includes(target);
        }).set("ai", () => 1).set("forceDie", true).set("targets", targets).forResult();
        const target2 = result.targets[0];
        targets.sortBySeat();
        for (const target of targets) {
          let damageNum = 1;
          if (target === target2) {
            damageNum = 2;
          }
          await target.damage({
            num: damageNum,
            nature: "fire",
            nocard: true
          });
        }
      }
    },
    ai: {
      order(item, player) {
        return lib.skill.yeyan.getBigFire(player) ? 10 : 1;
      },
      fireAttack: true,
      result: {
        target(player, target) {
          if (player.hasUnknown()) {
            return 0;
          }
          const att = get.sgn(get.attitude(player, target));
          const targets = game.filterPlayer((target2) => get.damageEffect(target2, player, player, "fire") && (!lib.skill.yeyan.getBigFire(player) || target2.hp <= 3 && !target2.hasSkillTag("filterDamage", null, { player })));
          if (!targets.includes(target)) {
            return 0;
          }
          if (lib.skill.yeyan.getBigFire(player)) {
            if (ui.selected.targets.length) {
              return 0;
            }
            if (!(targets.length == 1 || att < 0 && target.identity && target.identity.indexOf("zhu") != -1)) {
              return 0;
            }
          }
          return att * get.damageEffect(target, player, player, "fire");
        }
      }
    },
    getBigFire(player) {
      if (player.getDiscardableCards(player, "h").reduce((list, card) => list.add(get.suit(card, player)), []).length < 4) {
        return false;
      }
      const targets = game.filterPlayer((target) => get.damageEffect(target, player, player, "fire") && target.hp <= 3 && !target.hasSkillTag("filterDamage", null, { player }));
      if (!targets.length) {
        return false;
      }
      if (targets.length == 1 || targets.some((target) => get.attitude(player, target) < 0 && target.identity && target.identity.indexOf("zhu") != -1)) {
        let suits = player.getDiscardableCards(player, "h").reduce((map, card) => {
          const suit = get.suit(card, player);
          if (!map[suit]) {
            map[suit] = [];
          }
          return map;
        }, {}), cards2 = [];
        Object.keys(suits).forEach((i) => {
          suits[i].addArray(player.getDiscardableCards(player, "h").filter((card) => get.suit(card) == i));
          cards2.add(suits[i].sort((a, b) => get.value(a) - get.value(b))[0]);
        });
        return player.hp + player.countCards("h", (card) => !cards2.includes(card) && player.canSaveCard(card, player)) - 3 > 0;
      }
      return false;
    }
  },
  longhun: {
    audio: 4,
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
    group: ["longhun1", "longhun2", "longhun3", "longhun4"],
    ai: {
      fireAttack: true,
      skillTagFilter(player, tag) {
        switch (tag) {
          case "respondSha": {
            if (player.countCards("he", { suit: "diamond" }) < Math.max(1, player.hp)) {
              return false;
            }
            break;
          }
          case "respondShan": {
            if (player.countCards("he", { suit: "club" }) < Math.max(1, player.hp)) {
              return false;
            }
            break;
          }
          case "save": {
            if (player.countCards("he", { suit: "heart" }) < Math.max(1, player.hp)) {
              return false;
            }
            break;
          }
          default:
            return true;
        }
      },
      maixie: true,
      respondSha: true,
      respondShan: true,
      effect: {
        target(card, player, target) {
          if (get.tag(card, "recover") && target.hp >= 1) {
            return [0, 0];
          }
          if (!target.hasFriend()) {
            return;
          }
          if ((get.tag(card, "damage") == 1 || get.tag(card, "loseHp")) && target.hp > 1) {
            return [0, 1];
          }
        }
      },
      threaten(player, target) {
        if (target.hp == 1) {
          return 2;
        }
        return 0.5;
      }
    }
  },
  longhun1: {
    audio: true,
    enable: ["chooseToUse", "chooseToRespond"],
    sourceSkill: "longhun",
    prompt() {
      return "将" + get.cnNumber(Math.max(1, _status.event.player.hp)) + "张红桃牌当作桃使用";
    },
    position: "hes",
    check(card, event) {
      if (_status.event.player.hp > 1) {
        return 0;
      }
      return 10 - get.value(card);
    },
    selectCard() {
      return Math.max(1, _status.event.player.hp);
    },
    viewAs: { name: "tao" },
    viewAsFilter(player) {
      return player.countCards("hes", { suit: "heart" }) >= player.hp;
    },
    filterCard(card) {
      return get.suit(card) == "heart";
    }
  },
  longhun2: {
    audio: true,
    enable: ["chooseToUse", "chooseToRespond"],
    sourceSkill: "longhun",
    prompt() {
      return "将" + get.cnNumber(Math.max(1, _status.event.player.hp)) + "张方片当作火【杀】使用或打出";
    },
    position: "hes",
    check(card, event) {
      if (_status.event.player.hp > 1) {
        return 0;
      }
      return 10 - get.value(card);
    },
    selectCard() {
      return Math.max(1, _status.event.player.hp);
    },
    viewAs: { name: "sha", nature: "fire" },
    viewAsFilter(player) {
      return player.countCards("hes", { suit: "diamond" }) >= player.hp;
    },
    filterCard(card) {
      return get.suit(card) == "diamond";
    }
  },
  longhun3: {
    audio: true,
    enable: ["chooseToUse", "chooseToRespond"],
    sourceSkill: "longhun",
    prompt() {
      return "将" + get.cnNumber(Math.max(1, _status.event.player.hp)) + "张黑桃牌当作无懈可击使用";
    },
    position: "hes",
    check(card, event) {
      if (_status.event.player.hp > 1) {
        return 0;
      }
      return 7 - get.value(card);
    },
    selectCard() {
      return Math.max(1, _status.event.player.hp);
    },
    viewAs: { name: "wuxie" },
    viewAsFilter(player) {
      return player.countCards("hes", { suit: "spade" }) >= player.hp;
    },
    filterCard(card) {
      return get.suit(card) == "spade";
    }
  },
  longhun4: {
    audio: true,
    enable: ["chooseToUse", "chooseToRespond"],
    sourceSkill: "longhun",
    prompt() {
      return "将" + get.cnNumber(Math.max(1, _status.event.player.hp)) + "张梅花牌当作闪使用或打出";
    },
    position: "hes",
    check(card, event) {
      if (_status.event.player.hp > 1) {
        return 0;
      }
      return 10 - get.value(card);
    },
    selectCard() {
      return Math.max(1, _status.event.player.hp);
    },
    viewAsFilter(player) {
      return player.countCards("hes", { suit: "club" }) >= player.hp;
    },
    viewAs: { name: "shan" },
    filterCard(card) {
      return get.suit(card) == "club";
    }
  },
  juejing: {
    mod: {
      maxHandcard(player, num) {
        return 2 + num;
      },
      aiOrder(player, card, num) {
        if (num <= 0 || !player.isPhaseUsing() || !get.tag(card, "recover")) {
          return num;
        }
        if (player.needsToDiscard() > 1) {
          return num;
        }
        return 0;
      }
    },
    audio: true,
    trigger: { player: "phaseDrawBegin2" },
    //priority:-5,
    filter(event, player) {
      return !event.numFixed && player.hp < player.maxHp;
    },
    forced: true,
    async content(event, trigger, player) {
      trigger.num += player.getDamagedHp();
    }
  },
  relonghun: {
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
    //技能发动时机
    enable: ["chooseToUse", "chooseToRespond"],
    //发动时提示的技能描述
    prompt: "将♦牌当做杀，♥牌当做桃，♣牌当做闪，♠牌当做无懈可击使用或打出",
    //动态的viewAs
    viewAs(cards2, player) {
      if (cards2.length) {
        var name = false, nature = null;
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
      }
      return null;
    },
    //AI选牌思路
    check(card) {
      if (ui.selected.cards.length) {
        return 0;
      }
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
          }) > 0 && player.getUseValue({ name, nature: name == "sha" ? "fire" : null }) > 0) {
            var temp = get.order({ name, nature: name == "sha" ? "fire" : null });
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
    //选牌数量
    selectCard: [1, 2],
    //确保选择第一张牌后 重新检测第二张牌的合法性 避免选择两张花色不同的牌
    complexCard: true,
    //选牌范围：手牌区和装备区和木马
    position: "hes",
    //选牌合法性判断
    filterCard(card, player, event) {
      if (ui.selected.cards.length) {
        return get.suit(card, player) == get.suit(ui.selected.cards[0], player);
      }
      event = event || _status.event;
      var filter = event._backup.filterCard;
      var name = get.suit(card, player);
      if (name == "club" && filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event)) {
        return true;
      }
      if (name == "diamond" && filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event)) {
        return true;
      }
      if (name == "spade" && filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event)) {
        return true;
      }
      if (name == "heart" && filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event)) {
        return true;
      }
      return false;
    },
    //判断当前时机能否发动技能
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
    ai: {
      respondSha: true,
      respondShan: true,
      //让系统知道角色“有杀”“有闪”
      skillTagFilter(player, tag) {
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
      //AI牌序
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
    //让系统知道玩家“有无懈”“有桃”
    hiddenCard(player, name) {
      if (name == "wuxie" && _status.connectMode && player.countCards("hs") > 0) {
        return true;
      }
      if (name == "wuxie") {
        return player.countCards("hes", { suit: "spade" }) > 0;
      }
      if (name == "tao") {
        return player.countCards("hes", { suit: "heart" }) > 0;
      }
    },
    group: ["relonghun_num", "relonghun_discard"],
    subSkill: {
      num: {
        trigger: { player: "useCard" },
        forced: true,
        popup: false,
        filter(event) {
          var evt = event;
          return ["sha", "tao"].includes(evt.card.name) && evt.skill == "relonghun" && evt.cards && evt.cards.length == 2;
        },
        async content(event, trigger, player) {
          trigger.baseDamage++;
        }
      },
      discard: {
        trigger: { player: ["useCardAfter", "respondAfter"] },
        forced: true,
        popup: false,
        logTarget() {
          return _status.currentPhase;
        },
        autodelay(event) {
          return event.name == "respond" ? 0.5 : false;
        },
        filter(evt, player) {
          return ["shan", "wuxie"].includes(evt.card.name) && evt.skill == "relonghun" && evt.cards && evt.cards.length == 2 && _status.currentPhase && _status.currentPhase != player && _status.currentPhase.countDiscardableCards(player, "he");
        },
        async content(event, trigger, player) {
          player.line(_status.currentPhase, "green");
          await player.discardPlayerCard(_status.currentPhase, "he", true);
        }
      }
    }
  },
  xinjuejing: {
    mod: {
      maxHandcard(player, num) {
        return 2 + num;
      },
      aiOrder(player, card, num) {
        if (num <= 0 || !player.isPhaseUsing() || !get.tag(card, "recover")) {
          return num;
        }
        if (player.needsToDiscard() > 1) {
          return num;
        }
        return 0;
      }
    },
    audio: 2,
    trigger: { player: ["dying", "dyingAfter"] },
    forced: true,
    async content(event, trigger, player) {
      await player.draw();
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (target.getHp() > 1) {
            return;
          }
          if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
            return [1, 1];
          }
        }
      }
    }
  },
  shelie: {
    audio: 2,
    trigger: { player: "phaseDrawBegin1" },
    filter(event, player) {
      return !event.numFixed;
    },
    async content(event, trigger, player) {
      trigger.changeToZero();
      const cards2 = get.cards(5, true);
      await player.showCards(cards2, `${get.translation(player)}发动了【${get.translation(event.name)}】`, true).set("clearArena", false);
      const list = cards2.map((card) => get.suit(card)).unique();
      const result = await player.chooseCardButton(`涉猎：获取花色各不相同的牌`, cards2, list.length, true).set("filterButton", function(button) {
        for (let i = 0; i < ui.selected.buttons.length; i++) {
          if (get.suit(ui.selected.buttons[i].link) == get.suit(button.link)) {
            return false;
          }
        }
        return true;
      }).set("ai", function(button) {
        return get.value(button.link, _status.event.player);
      }).forResult();
      game.broadcastAll(ui.clear);
      if (result?.links?.length) {
        await player.gain(result.links, "gain2");
      }
    },
    ai: {
      threaten: 1.2
    }
  },
  gongxin: {
    audio: 2,
    audioname: ["re_lvmeng"],
    audioname2: { gexuan: "gongxin_gexuan" },
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target != player && target.countCards("h");
    },
    async content(event, trigger, player) {
      const { target } = event;
      const cards2 = target.getCards("h");
      const result = await player.chooseToMove_new("攻心").set("list", [
        [get.translation(target) + "的手牌", cards2],
        [["弃置"], ["置于牌堆顶"]]
      ]).set("filterOk", (moved) => {
        return moved[1].slice().concat(moved[2]).filter((card) => get.suit(card) == "heart").length == 1;
      }).set("filterMove", (from, to, moved) => {
        if (moved[0].includes(from.link) && moved[1].length + moved[2].length >= 1 && [1, 2].includes(to)) {
          return false;
        }
        return get.suit(from) == "heart";
      }).set("processAI", (list) => {
        let card = list[0][1].slice().filter((card2) => {
          return get.suit(card2) == "heart";
        }).sort((a, b) => {
          return get.value(b) - get.value(a);
        })[0];
        if (!card) {
          return false;
        }
        return [list[0][1].slice().remove(card), [card], []];
      }).forResult();
      if (result.bool) {
        if (result.moved[1].length) {
          await target.discard(result.moved[1]);
        } else {
          await player.showCards(result.moved[2], get.translation(player) + "对" + get.translation(target) + "发动了【攻心】");
          await target.lose(result.moved[2], ui.cardPile, "visible", "insert");
        }
      }
    },
    ai: {
      threaten: 1.5,
      result: {
        target(player, target) {
          return -target.countCards("h");
        }
      },
      order: 10,
      expose: 0.4
    }
  },
  //神刘备
  nzry_longnu: {
    audio: 2,
    zhuanhuanji: true,
    mark: true,
    marktext: "☯",
    intro: {
      content(storage, player, skill) {
        if (storage) {
          return "锁定技，出牌阶段开始时，你减1点体力上限并摸体力值张牌，然后本阶段内你的锦囊牌均视为雷【杀】（无次数限制且不计入次数限制）";
        }
        return "锁定技，出牌阶段开始时，你失去1点体力并摸已损失体力值张牌，然后本阶段内你的红色手牌均视为火【杀】（无距离限制）";
      }
    },
    trigger: {
      player: "phaseUseBegin"
    },
    forced: true,
    async content(event, trigger, player) {
      const storage = player.getStorage(event.name, false);
      player.changeZhuanhuanji(event.name);
      let num;
      if (storage) {
        await player.loseMaxHp();
        num = player.getHp();
      } else {
        await player.loseHp();
        num = player.getDamagedHp();
      }
      if (num > 0) {
        await player.draw({ num });
      }
      if (storage) {
        player.addTempSkill("nzry_longnu_2", "phaseUseAfter");
      } else {
        player.addTempSkill("nzry_longnu_1", "phaseUseAfter");
      }
    },
    subSkill: {
      1: {
        charlotte: true,
        mod: {
          cardname(card, player) {
            if (get.color(card) === "red") {
              return "sha";
            }
          },
          cardnature(card, player) {
            if (get.color(card) === "red") {
              return "fire";
            }
          },
          targetInRange(card) {
            if (get.color(card) === "red") {
              return true;
            }
          }
        },
        ai: {
          effect: {
            target(card, player, target, current) {
              if (get.tag(card, "respondSha") && current < 0) {
                return 0.6;
              }
            }
          },
          respondSha: true
        }
      },
      2: {
        charlotte: true,
        mod: {
          cardname(card, player) {
            if (["trick", "delay"].includes(lib.card[card.name].type)) {
              return "sha";
            }
          },
          cardnature(card, player) {
            if (["trick", "delay"].includes(lib.card[card.name].type)) {
              return "thunder";
            }
          },
          cardUsable(card, player) {
            if (card.name == "sha" && game.hasNature(card, "thunder")) {
              return Infinity;
            }
          }
        },
        trigger: {
          player: "useCard"
        },
        filter(event, player) {
          return event.card.name === "sha" && game.hasNature(event.card, "thunder") && event.addCount !== false;
        },
        forced: true,
        silent: true,
        async content(event, trigger, player) {
          trigger.addCount = false;
          if (player.stat[player.stat.length - 1].card.sha > 0) {
            player.stat[player.stat.length - 1].card.sha--;
          }
        },
        ai: {
          effect: {
            target(card, player, target, current) {
              if (get.tag(card, "respondSha") && current < 0) {
                return 0.6;
              }
            }
          },
          respondSha: true
        }
      }
    },
    ai: {
      fireAttack: true,
      halfneg: true,
      threaten: 1.05
    }
  },
  nzry_jieying: {
    audio: 2,
    trigger: {
      player: ["linkBefore", "enterGame"],
      global: "phaseBefore"
    },
    forced: true,
    filter(event, player) {
      if (event.name === "link") {
        return player.isLinked();
      }
      return (event.name != "phase" || game.phaseNumber === 0) && !player.isLinked();
    },
    async content(event, trigger, player) {
      if (trigger.name != "link") {
        await player.link(true);
      } else {
        trigger.cancel();
      }
    },
    group: "nzry_jieying_phaseJieshu",
    global: "nzry_jieying_global",
    subSkill: {
      phaseJieshu: {
        audio: "nzry_jieying",
        trigger: {
          player: "phaseJieshuBegin"
        },
        filter(event, player) {
          return game.hasPlayer(function(current) {
            return current != player && !current.isLinked();
          });
        },
        async cost(event, trigger, player) {
          event.result = await player.chooseTarget({
            prompt: "结营：请选择横置的目标",
            forced: true,
            filterTarget(card, player2, target) {
              return target != player2 && !target.isLinked();
            },
            ai(target) {
              return get.effect(target, { name: "tiesuo" }, player, player);
            }
          }).forResult();
        },
        async content(event, trigger, player) {
          const { targets } = event;
          await targets[0].link(true);
          const result = await player.chooseTarget({
            prompt: "结营：请选择摸牌的目标",
            forced: true,
            selectTarget: [1, Infinity],
            filterTarget(card, player2, target) {
              return target.isLinked();
            },
            ai(target) {
              return get.effect(target, { name: "draw" }, player, player);
            }
          }).forResult();
          if (result?.bool && result.targets?.length) {
            result.targets.sortBySeat(player);
            player.logSkill(event.name, result.targets);
            player.line(result.targets);
            await game.asyncDraw(result.targets);
          }
        }
      },
      global: {
        charlotte: true,
        mod: {
          maxHandcard(player, num) {
            if (game.hasPlayer(function(current) {
              return current.hasSkill("nzry_jieying");
            }) && player.isLinked()) {
              return num + 2;
            }
          }
        }
      }
    },
    ai: {
      noLink: true,
      effect: {
        target(card) {
          if (card.name === "tiesuo") {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  nzry_junlve: {
    audio: 2,
    intro: { content: "当前有#个标记" },
    trigger: {
      player: "damageEnd",
      source: "damageSource"
    },
    filter(event, player) {
      return event.num > 0;
    },
    forced: true,
    async content(event, trigger, player) {
      player.addMark(event.name, trigger.num);
    },
    ai: { combo: "nzry_cuike" }
  },
  nzry_cuike: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    async cost(event, trigger, player) {
      const str = player.countMark("nzry_junlve") % 2 == 1 ? "对一名角色造成1点伤害" : "横置一名角色并弃置其区域内的一张牌";
      event.result = await player.chooseTarget(get.prompt(event.skill), str).set("ai", (target) => {
        const player2 = get.player();
        const num = player2.countMark("nzry_junlve") % 2;
        if (num == 1) {
          return get.damageEffect(target, player2, player2);
        }
        return get.effect(target, { name: "guohe_copy" }, player2, player2) + (!target.isLinked() ? 2 : 0);
      }).forResult();
    },
    async content(event, trigger, player) {
      const { targets } = event;
      const [target] = targets;
      if (player.countMark("nzry_junlve") % 2 == 1) {
        await target.damage();
      } else {
        await target.link(true);
        await player.discardPlayerCard(target, 1, "hej", true);
      }
      if (player.countMark("nzry_junlve") <= 7) {
        return;
      }
      const targetsx = game.filterPlayer((target2) => target2 !== player);
      const result = await player.chooseBool(`是否弃置所有“军略”标记${targetsx.length ? `并对${get.translation(targetsx)}造成1点伤害` : ""}？`).set("choice", targetsx.reduce((num, target2) => num + get.damageEffect(target2, player, player), 0) > 0).forResult();
      if (result?.bool) {
        player.line(targetsx);
        player.clearMark("nzry_junlve");
        await game.doAsyncInOrder(targetsx, (target2) => target2.damage());
      }
    },
    ai: {
      notemp: true
    }
  },
  nzry_dinghuo: {
    audio: 2,
    limited: true,
    skillAnimation: true,
    animationColor: "metal",
    enable: "phaseUse",
    filter(event, player) {
      return player.countMark("nzry_junlve") > 0 && game.hasPlayer((current) => current.isLinked());
    },
    check(event, player) {
      const targets = game.filterPlayer((current) => get.attitude(player, current) < 0 && current.isLinked());
      const num = targets.length;
      return player.countMark("nzry_junlve") >= num && (num == game.countPlayer((current) => get.attitude(player, current) < 0) || num <= 2 && targets.filter((current) => current.countCards("e") > 0).length > 0);
    },
    filterTarget(card, player, target) {
      return target.isLinked();
    },
    selectTarget() {
      return [1, _status.event.player.countMark("nzry_junlve")];
    },
    multiline: true,
    multitarget: true,
    async content(event, trigger, player) {
      let { targets } = event;
      player.awakenSkill(event.name);
      player.clearMark("nzry_junlve");
      for (const target of targets.sortBySeat()) {
        await target.discard(target.getCards("e"));
      }
      targets = targets.filter((current) => current.isIn());
      if (!targets.length) {
        return;
      }
      const result = await player.chooseTarget(true, "对一名目标角色造成1点火焰伤害", (card, player2, target) => {
        return _status.event.targets.includes(target);
      }).set("targets", targets).set("ai", (target) => {
        const player2 = get.player();
        return get.damageEffect(target, player2, player2, "fire");
      }).forResult();
      if (result?.bool) {
        await result.targets[0].damage("fire");
      }
    },
    ai: {
      order: 1,
      fireAttack: true,
      combo: "nzry_junlve",
      result: {
        target(player, target) {
          if (target.hasSkillTag("nofire")) {
            return 0;
          }
          if (lib.config.mode == "versus") {
            return -1;
          }
          if (player.hasUnknown()) {
            return 0;
          }
          return get.damageEffect(target, player) - target.countCards("e");
        }
      }
    }
  },
  drlt_duorui: {
    audio: 2,
    init(player, skill) {
      if (!player.storage.drlt_duorui) {
        player.storage.drlt_duorui = [];
      }
    },
    trigger: {
      source: "damageSource"
    },
    filter(event, player) {
      if (player.storage.drlt_duorui.length || event.player === player) {
        return false;
      }
      return event.player.isIn() && _status.currentPhase == player;
    },
    check(event, player) {
      if (get.attitude(_status.event.player, event.player) >= 0) {
        return false;
      }
      if (player.hasEnabledSlot() && !player.hasEnabledSlot(5)) {
        return false;
      }
      return true;
    },
    bannedList: ["bifa", "buqu", "gzbuqu", "songci", "funan", "xinfu_guhuo", "reguhuo", "huashen", "rehuashen", "old_guhuo", "shouxi", "xinpojun", "taoluan", "xintaoluan", "xinfu_yingshi", "zhenwei", "zhengnan", "xinzhengnan"],
    logTarget: "player",
    async content(event, trigger, player) {
      const skills2 = getFilteredSkills(trigger.player);
      event.skills = skills2;
      if (player.hasEnabledSlot()) {
        const next = player.chooseToDisable();
        next.set("ai", (event2, player2, list) => {
          if (list.includes("equip5")) {
            return "equip5";
          }
          return list.randomGet();
        });
        await next;
      }
      if (!skills2.length) {
        return;
      }
      const result = await player.chooseButton(["请选择要获得的技能", [skills2, "skill"]], true).set("ai", () => Math.random()).forResult();
      player.addTempSkills(result.links, { player: "dieAfter" });
      player.storage.drlt_duorui = result.links;
      player.storage.drlt_duorui_player = trigger.player;
      trigger.player.storage.drlt_duorui = result.links;
      trigger.player.addTempSkill("drlt_duorui1", { player: "phaseAfter" });
      return;
      function getFilteredSkills(player2) {
        const result2 = [];
        if (player2.name1 != null) {
          result2.push(...lib.character[player2.name1][3]);
        } else {
          result2.push(...lib.character[player2.name][3]);
        }
        if (player2.name2 != null) {
          result2.push(...lib.character[player2.name2][3]);
        }
        return result2.filter((skill) => {
          const info = get.info(skill);
          return info && !info.charlotte && !info.persevereSkill && !info.hiddenSkill && !info.zhuSkill && !info.juexingji && !info.limited && !info.dutySkill && !(info.unique && !info.gainable) && !lib.skill.drlt_duorui.bannedList.includes(skill);
        });
      }
    },
    group: ["duorui_clear"]
  },
  duorui_clear: {
    trigger: { global: ["phaseAfter", "dieAfter"] },
    filter(event, player) {
      if (!player.storage.drlt_duorui_player || !player.storage.drlt_duorui) {
        return false;
      }
      return player.storage.drlt_duorui_player == event.player && player.storage.drlt_duorui.length;
    },
    silent: true,
    forced: true,
    popup: false,
    async content(event, trigger, player) {
      player.removeSkills(player.storage.drlt_duorui[0]);
      delete player.storage.drlt_duorui_player;
      player.storage.drlt_duorui = [];
    }
  },
  drlt_duorui1: {
    init(player, skill) {
      player.disableSkill(skill, player.storage.drlt_duorui);
    },
    onremove(player, skill) {
      player.enableSkill(skill);
    },
    locked: true,
    mark: true,
    charlotte: true,
    intro: {
      content(storage, player, skill) {
        var list = [];
        for (var i in player.disabledSkills) {
          if (player.disabledSkills[i].includes(skill)) {
            list.push(i);
          }
        }
        if (list.length) {
          var str = "失效技能：";
          for (var i = 0; i < list.length; i++) {
            if (lib.translate[list[i] + "_info"]) {
              str += get.translation(list[i]) + "、";
            }
          }
          return str.slice(0, str.length - 1);
        }
      }
    }
  },
  drlt_zhiti: {
    audio: 2,
    trigger: {
      global: ["juedouAfter", "chooseToCompareAfter", "compareMultipleAfter"],
      player: "damageEnd"
    },
    filter(event, player) {
      if (!player.hasDisabledSlot()) {
        return false;
      }
      if (event.name == "juedou") {
        if (![event.player, event.target].includes(player)) {
          return false;
        }
        if (!event.turn || event.turn === player) {
          return false;
        }
        const opposite = event.player === player ? event.target : event.player;
        return opposite?.isIn() && opposite.inRangeOf(player) && opposite.isDamaged();
      } else if (event.name == "damage") {
        const opposite = event.source;
        return opposite?.isIn() && opposite.inRangeOf(player) && opposite.isDamaged();
      } else {
        if (![event.player, event.target].includes(player)) {
          return false;
        }
        if (event.preserve) {
          return false;
        }
        let opposite;
        if (player === event.player) {
          if (event.num1 > event.num2) {
            opposite = event.target;
          } else {
            return false;
          }
        } else {
          if (event.num1 < event.num2) {
            opposite = event.player;
          } else {
            return false;
          }
        }
        return opposite?.isIn() && opposite.inRangeOf(player) && opposite.isDamaged();
      }
    },
    forced: true,
    async content(event, trigger, player) {
      await player.chooseToEnable();
    },
    global: "g_drlt_zhiti"
  },
  g_drlt_zhiti: {
    mod: {
      maxHandcard(player, num) {
        if (player.isDamaged()) {
          return num - game.countPlayer(function(current) {
            return current != player && current.hasSkill("drlt_zhiti") && current.inRange(player);
          });
        }
      }
    }
  },
  drlt_poxi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target != player && target.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      const { target } = event;
      const playerCards = player.getCards("h");
      const targetCards = target.getCards("h");
      const playerDiscarding = [];
      const targetDiscarding = [];
      event.list1 = playerDiscarding;
      event.list2 = targetDiscarding;
      let next;
      if (playerCards.length > 0) {
        next = player.chooseButton(4, ["你的手牌", playerCards, `${get.translation(target.name)}的手牌`, targetCards]);
      } else {
        next = player.chooseButton(4, [`${get.translation(target.name)}的手牌`, target.getCards("h")]);
      }
      next.set("target", target);
      next.set("filterButton", filterButton);
      next.set("ai", processAI);
      const result = await next.forResult();
      if (!result.bool) {
        return;
      }
      const cards2 = result.links;
      for (const card of cards2) {
        if (get.owner(card) === player) {
          playerDiscarding.push(card);
        } else {
          targetDiscarding.push(card);
        }
      }
      await discardMultiples([
        [player, playerDiscarding],
        [target, targetDiscarding]
      ]);
      switch (playerDiscarding.length) {
        case 0:
          await player.loseMaxHp();
          break;
        case 1: {
          let evt = get.event();
          const records = /* @__PURE__ */ new Set();
          while (true) {
            if (records.has(evt)) {
              break;
            }
            if (evt && evt.getParent) {
              records.add(evt);
              evt = evt.getParent();
            }
            if (evt.name === "phaseUse") {
              evt.skipped = true;
              break;
            }
          }
          player.addTempSkill("drlt_poxi1", { player: "phaseAfter" });
          break;
        }
        case 3:
          await player.recover();
          break;
        case 4:
          await player.draw(4);
          break;
      }
      return;
      function filterButton(button) {
        const player2 = get.player();
        if (get.owner(button.link) && !lib.filter.canBeDiscarded(button.link, get.owner(button.link), player2)) {
          return false;
        }
        return ui.selected.buttons.every((other) => get.suit(button.link) !== get.suit(other.link));
      }
      function processAI(button) {
        const { player: player2, target: target2 } = get.event();
        const targetCards2 = target2.getCards("h");
        const chosenCards = ui.selected.buttons.map((buttonx) => buttonx.link);
        const targetChosen = chosenCards.filter((card2) => targetCards2.includes(card2));
        const card = button.link;
        const owner = get.owner(card);
        const val = get.value(card) || 1;
        if (owner == target2) {
          if (targetChosen.length > 1) {
            return 0;
          }
          if (targetChosen.length == 0 || player2.hp > 3) {
            return val;
          }
          return 2 * val;
        }
        return 7 - val;
      }
      async function discardMultiples(items) {
        const losingList = items.filter(([_, cards3]) => cards3.length);
        if (losingList.length > 1) {
          return game.loseAsync({
            lose_list: losingList,
            discarder: losingList[0][0]
          }).setContent("discardMultiple");
        } else if (losingList.length === 1) {
          const [loser, cards3] = losingList[0];
          return loser.discard(cards3);
        } else {
          return null;
        }
      }
    },
    ai: {
      order: 6,
      result: {
        target(target, player) {
          return -1;
        }
      }
    }
  },
  drlt_poxi1: {
    mod: {
      maxHandcard(player, num) {
        return num - 1;
      }
    }
  },
  drlt_jieying: {
    audio: 2,
    trigger: { global: "phaseDrawBegin2" },
    filter(event, player) {
      return !event.numFixed && event.player.hasMark("drlt_jieying_mark");
    },
    forced: true,
    locked: false,
    logTarget: "player",
    async content(event, trigger, player) {
      trigger.num++;
    },
    global: "drlt_jieying_mark",
    group: ["drlt_jieying_1", "drlt_jieying_2", "drlt_jieying_3"],
    subSkill: {
      1: {
        audio: "drlt_jieying",
        trigger: { player: "phaseBegin" },
        filter(event, player) {
          return !game.hasPlayer((current) => current.hasMark("drlt_jieying_mark"));
        },
        forced: true,
        async content(event, trigger, player) {
          player.addMark("drlt_jieying_mark", 1);
        }
      },
      2: {
        audio: "drlt_jieying",
        trigger: { player: "phaseJieshuBegin" },
        filter(event, player) {
          return player.hasMark("drlt_jieying_mark") && game.hasPlayer((target) => {
            return target != player && !target.hasMark("drlt_jieying_mark");
          });
        },
        async cost(event, trigger, player) {
          const prompt = get.prompt("drlt_jieying");
          const prompt2 = "将“营”交给一名角色；其摸牌阶段多摸一张牌，出牌阶段使用【杀】的次数上限+1且手牌上限+1。该角色回合结束后，其移去“营”标记，然后你获得其所有手牌。";
          const filterTarget = (card, player2, target) => target !== player2 && !target.hasMark("drlt_jieying_mark");
          const next = player.chooseTarget(prompt, prompt2, filterTarget);
          next.set("ai", processAI);
          event.result = await next.forResult();
          return;
          function processAI(target) {
            const th = target.countCards("h");
            const att = get.attitude(_status.event.player, target);
            for (const skill in target.skills) {
              const info = get.info(skill);
              if (!info) {
                continue;
              }
              if (get.skillInfoTranslation(skill, target).includes("【杀】")) {
                return Math.abs(att);
              }
            }
            if (att > 0) {
              if (th > 3 && target.hp > 2) {
                return 0.6 * th;
              }
            }
            if (att < 1) {
              if (target.countCards("j", { name: "lebu" })) {
                return 1 + Math.min((1.5 + th) * 0.8, target.getHandcardLimit() * 0.7);
              }
              if (!th || target.getEquip("zhangba") || target.getEquip("guanshi")) {
                return 0;
              }
              if (!target.inRange(player) || player.countCards("hs", { name: "shan" }) > 1) {
                return Math.min((1 + th) * 0.3, target.getHandcardLimit() * 0.2);
              }
            }
            return 0;
          }
        },
        async content(event, trigger, player) {
          const { targets } = event;
          const [target] = targets;
          const mark = player.countMark("drlt_jieying_mark");
          player.removeMark("drlt_jieying_mark", mark);
          target.addMark("drlt_jieying_mark", mark);
        },
        ai: {
          effect: {
            player(card, player, target) {
              if (get.name(card) === "lebu" && get.attitude(player, target) < 0) {
                return 1 + Math.min((target.countCards("h") + 1.5) * 0.8, target.getHandcardLimit() * 0.7);
              }
            }
          }
        }
      },
      3: {
        audio: "drlt_jieying",
        trigger: { global: "phaseEnd" },
        filter(event, player) {
          return player != event.player && event.player.hasMark("drlt_jieying_mark") && event.player.isIn();
        },
        forced: true,
        logTarget: "player",
        async content(event, trigger, player) {
          let next = null;
          if (trigger.player.countCards("h") > 0) {
            next = trigger.player.give(trigger.player.getCards("h"), player);
          }
          trigger.player.clearMark("drlt_jieying_mark");
          if (next) {
            await next;
          }
        }
      },
      mark: {
        marktext: "营",
        intro: {
          name2: "营",
          content: "mark"
        },
        mod: {
          cardUsable(card, player, num) {
            if (player.hasMark("drlt_jieying_mark") && card.name == "sha") {
              return num + game.countPlayer(function(current) {
                return current.hasSkill("drlt_jieying");
              });
            }
          },
          maxHandcard(player, num) {
            if (player.hasMark("drlt_jieying_mark")) {
              return num + game.countPlayer(function(current) {
                return current.hasSkill("drlt_jieying");
              });
            }
          },
          aiOrder(player, card, num) {
            if (player.hasMark("drlt_jieying_mark") && game.hasPlayer((current) => {
              return current.hasSkill("drlt_jieying") && current != player && get.attitude(player, current) <= 0;
            })) {
              return Math.max(num, 0) + 1;
            }
          }
        },
        ai: {
          nokeep: true,
          skillTagFilter(player) {
            return player.hasMark("drlt_jieying_mark") && game.hasPlayer((current) => {
              return current.hasSkill("drlt_jieying") && current != player;
            });
          }
        }
      }
    }
  }
};
const translates = {
  jilin: "戢鳞",
  jilin_info: "①游戏开始时，你将牌堆顶两张牌暗置于你的武将牌上，称为“志”。②当你成为其他角色使用牌的目标时，你可以明置一张暗置的“志”令此牌对你无效。③回合开始时，你可用任意张手牌替换等量暗置的“志”。",
  //孩子，让牢神司马下去陪牢大吧
  yingyou: "英猷",
  yingyou_info: "①出牌阶段开始时，你可明置一张“志”然后摸X张牌（X为明置的“志”的数量）。②当你失去与明置的“志”其中一张花色相同的牌时，你摸一张牌。",
  yingtian: "应天",
  yingtian_info: `觉醒技。一名角色死亡后，若场上势力数不大于2，则你获得${get.poptip("reguicai")}、${get.poptip("rewansha")}、${get.poptip("lianpo")}并失去〖英猷〗且你本局游戏使用牌没有距离限制。`,
  shen_luxun: "神陆逊",
  shen_luxun_prefix: "神",
  nzry_junlve: "军略",
  nzry_junlve_info: "锁定技，当你受到或造成伤害后，你获得X个“军略”标记(X为伤害点数)。",
  nzry_cuike: "摧克",
  nzry_cuike_info: "出牌阶段开始时，若“军略”标记的数量为奇数，你可以对一名角色造成1点伤害；若“军略”标记的数量为偶数，你可以横置一名角色并弃置其区域内的一张牌。然后，若“军略”标记的数量超过7个，你可以移去全部“军略”标记并对所有其他角色造成1点伤害。",
  nzry_dinghuo: "绽火",
  nzry_dinghuo_info: "限定技，出牌阶段，你可以移去全部“军略”标记，令至多等量的已横置角色弃置所有装备区内的牌。然后，你对其中一名角色造成1点火焰伤害。",
  shen_liubei: "神刘备",
  shen_liubei_prefix: "神",
  nzry_longnu: "龙怒",
  nzry_longnu_info: "转换技，锁定技，出牌阶段开始时，阳：你失去1点体力并摸等同于你损失体力值张牌，然后本回合你的红色手牌均视为火【杀】（无距离限制）；阴：你减1点体力上限并摸等同于你体力值张牌，然后本回合你的锦囊牌均视为雷【杀】（无次数限制且不计入次数限制）。",
  nzry_jieying: "结营",
  nzry_jieying_info: "锁定技，你始终处于横置状态；已横置的角色手牌上限+2；结束阶段，你横置一名其他角色，然后令任意已横置的角色各摸一张牌。",
  shen_ganning: "神甘宁",
  shen_ganning_prefix: "神",
  shen_zhangliao: "神张辽",
  shen_zhangliao_prefix: "神",
  drlt_poxi: "魄袭",
  drlt_poxi_info: "出牌阶段限一次，你可以观看一名其他角色的手牌，然后你可以弃置你与其手牌中的四张花色不同的牌。若如此做，根据此次弃置你的牌的数量执行以下效果：零张，扣减1点体力上限；一张，你结束出牌阶段且本回合手牌上限-1；三张，你回复1点体力；四张，你摸四张牌。",
  drlt_jieying: "劫营",
  drlt_jieying_info: "回合开始时，若场上没有拥有“营”标记的角色，你获得1个“营”标记；结束阶段，你可以将你的一个“营”标记交给一名角色；有“营”标记的角色摸牌阶段多摸一张牌，出牌阶段使用【杀】的次数上限+1，手牌上限+1。有“营”的其他角色回合结束时，其移去“营”标记，然后你获得其所有手牌。",
  drlt_duorui1: "失效技能",
  drlt_duorui1_bg: "锐",
  drlt_duorui: "夺锐",
  drlt_duorui_info: "当你于出牌阶段内对一名其他角色造成伤害后，你可以废除你装备区内的一个装备栏（若已全部废除则可以跳过此步骤），然后获得该角色的一个技能直到其的下回合结束或其死亡(觉醒技，限定技，主公技，隐匿技，使命技等特殊技能除外)。若如此做，该角色该技能失效且你不能再发动〖夺锐〗直到你失去以此法获得的技能。",
  drlt_zhiti: "止啼",
  drlt_zhiti_info: "锁定技。①你攻击范围内已受伤的其他角色手牌上限-1；②当你和已受伤的角色拼点或【决斗】胜利/受到已受伤角色造成的伤害后，若对方/伤害来源在你的攻击范围内，则你恢复一个装备栏。",
  shen_zhaoyun: "神赵云",
  shen_zhaoyun_prefix: "神",
  shen_guanyu: "神关羽",
  shen_guanyu_prefix: "神",
  shen_lvmeng: "神吕蒙",
  shen_lvmeng_prefix: "神",
  shen_simayi: "神司马懿",
  shen_simayi_prefix: "神",
  shen_caocao: "神曹操",
  shen_caocao_prefix: "神",
  shen_zhugeliang: "神诸葛亮",
  shen_zhugeliang_prefix: "神",
  shen_zhouyu: "神周瑜",
  shen_zhouyu_prefix: "神",
  shen_lvbu: "神吕布",
  shen_lvbu_prefix: "神",
  xinjuejing: "绝境",
  xinjuejing_info: "锁定技。①你的手牌上限+2。②当你进入或脱离濒死状态时，你摸一张牌。",
  relonghun: "龙魂",
  relonghun_info: "你可以将同花色的一至两张牌按下列规则使用或打出：红桃当【桃】，方块当火【杀】，梅花当【闪】，黑桃当【无懈可击】。若你以此法转化了两张：红色牌，则此牌回复值或伤害值+1；黑色牌，则你弃置当前回合角色一张牌。",
  xinlonghun: "龙魂",
  xinlonghun_info: "你可以将你的手牌按下列规则使用或打出：红桃当【桃】，方块当火【杀】，梅花当【闪】，黑桃当【无懈可击】。",
  longhun: "龙魂",
  longhun1: "龙魂♥︎",
  longhun2: "龙魂♦︎",
  longhun3: "龙魂♠︎",
  longhun4: "龙魂♣︎",
  juejing: "绝境",
  longhun_info: "你可以将同花色的X张牌按下列规则使用或打出：红桃当【桃】，方块当具火焰伤害的【杀】，梅花当【闪】，黑桃当【无懈可击】（X为你当前的体力值且至少为1）。",
  juejing_info: "锁定技。①摸牌阶段，你令额定摸牌数+X（X为你已损失的体力值）。②你的手牌上限+2。",
  wushen: "武神",
  wushen_info: "锁定技。①你的红桃手牌均视为【杀】。②你使用红桃【杀】无距离和次数限制且不可被响应。",
  wuhun: "武魂",
  wuhun_info: "锁定技，杀死你的角色立即进入濒死状态。",
  shelie: "涉猎",
  gongxin: "攻心",
  gongxin_discard: "弃置",
  gongxin_top: "牌堆顶",
  renjie: "忍戒",
  renjie2: "忍戒",
  renjie_info: "锁定技，当你受到1点伤害后，你获得一枚“忍”标记；当你于弃牌阶段内弃置牌后，你获得等同于失去的牌数量的“忍”标记。",
  sbaiyin: "拜印",
  sbaiyin_info: `觉醒技，准备阶段开始时，若你的“忍”标记数不小于4，你减1点体力上限，然后获得${get.poptip("jilue")}。`,
  jilue: "极略",
  jilue_info: `当一名角色的判定牌生效前，你可以弃1枚“忍”标记并发动${get.poptip("jilue_guicai")}；每当你受到伤害后，你可以弃1枚“忍”标记并发动${get.poptip("jilue_fangzhu")}；当你使用锦囊牌时，你可以弃1枚“忍”标记并发动${get.poptip("jilue_jizhi")}；出牌阶段限一次，你可以弃1枚“忍”标记并发动${get.poptip("jilue_zhiheng")}；出牌阶段，你可以弃1枚“忍”标记并获得${get.poptip("jilue_wansha")}直到回合结束。`,
  jilue_guicai: "鬼才",
  jilue_fangzhu: "放逐",
  jilue_wansha: "完杀",
  jilue_zhiheng: "制衡",
  jilue_jizhi: "集智",
  jilue_guicai_info: "在任意角色的判定牌生效前，你可以打出一张牌代替之。",
  jilue_fangzhu_info: "当你受到伤害后，你可令一名其他角色摸X张牌（X为你已损失的体力值），然后该角色将武将牌翻面。",
  jilue_wansha_info: "锁定技。①你的回合内，不处于濒死状态的其他角色不能使用【桃】。②当有角色于你的回合内进入濒死状态时，你令其以外的所有其他角色的非锁定技失效直到此濒死状态结算结束。",
  jilue_zhiheng_info: "出牌阶段限一次，你可以弃置任意张牌并摸等量的牌，若你在发动〖制衡〗时弃置了所有手牌，则你多摸一张牌。",
  jilue_jizhi_info: "当你使用锦囊牌时，你可以摸一张牌。若此牌为基本牌，则你可以弃置之，然后令本回合手牌上限+1。",
  lianpo: "连破",
  lianpo_info: "一名角色的回合结束时，若你本回合内杀死过角色，则你可以进行一个额外的回合。",
  guixin: "归心",
  qinyin: "琴音",
  yeyan: "业炎",
  shelie_info: "摸牌阶段，你可以改为从牌堆顶亮出五张牌，然后选择获得不同花色的牌各一张。",
  gongxin_info: "出牌阶段限一次，你可以观看一名其他角色的手牌，并可以展示其中一张红桃牌，然后将其弃置或置于牌堆顶。",
  guixin_info: "当你受到1点伤害后，你可以获得每名其他角色区域里的一张牌，然后你翻面。",
  qinyin_info: "弃牌阶段结束时，若你于此阶段内弃置过两张或更多的牌，则你可以选择一项：1. 令所有角色各回复1点体力；2. 令所有角色各失去1点体力。",
  yeyan_info: "限定技，出牌阶段，你可以对一至三名角色造成至多共3点火焰伤害（你可以任意分配每名目标角色受到的伤害点数），若你将对一名角色分配2点或更多的火焰伤害，你须先弃置四张不同花色的手牌再失去3点体力。",
  qixing: "七星",
  qixing_bg: "星",
  qixing2: "七星",
  qixing3: "七星",
  qixing_info: "游戏开始时，你将牌堆顶的七张牌置于你的武将牌上，称之为“星”。然后/摸牌阶段结束后，你可用任意数量的手牌等量交换这些“星”。",
  dawu: "大雾",
  dawu2_bg: "雾",
  dawu2: "大雾",
  dawu3: "大雾",
  dawu_info: "结束阶段，你可以弃置X张“星”并指定等量的角色：直到你的下回合开始，当这些角色受到非雷电伤害时，防止此伤害。",
  kuangfeng: "狂风",
  kuangfeng2: "狂风",
  kuangfeng2_bg: "风",
  kuangfeng3: "狂风",
  kuangfeng_info: "结束阶段，你可以弃置一张“星”并指定一名角色：直到你的下回合开始，该角色受到火焰伤害时，此伤害+1。",
  baonu: "狂暴",
  baonu_bg: "暴",
  baonu_info: "锁定技，游戏开始时，你获得两枚“暴怒”标记；当你造成/受到1点伤害后，你获得1枚“暴怒”标记。",
  shenfen: "神愤",
  shenfen_info: "限定技，出牌阶段，你可以弃置6枚暴怒标记，对场上所有其他角色造成1点伤害，然后令其弃置四张牌。",
  wuqian: "无前",
  wuqian_info: `出牌阶段，你可以弃置两枚暴怒标记并获得技能${get.poptip("wushuang")}直到回合结束。`,
  wumou: "无谋",
  wumou_info: "锁定技，当你使用普通锦囊牌时，你选择一项：1.弃置1枚“暴怒”标记；2.失去1点体力。",
  ol_wuqian: "无前",
  ol_wuqian_info: `出牌阶段，你可以弃置2枚“暴怒”标记并选择一名本回合内未选择过的其他角色，你获得技能${get.poptip("wushuang")}并令其防具无效直到回合结束。`,
  ol_shenfen: "神愤",
  ol_shenfen_info: "出牌阶段限一次，你可以弃置6枚“暴怒”标记并选择所有其他角色，对这些角色各造成1点伤害。然后这些角色先各弃置其装备区里的牌，再各弃置四张手牌。最后你将你的武将牌翻面。",
  new_wuhun: "武魂",
  new_wuhun_info: "锁定技，当你受到伤害后，伤害来源获得X个“梦魇”标记（X为伤害点数）。当你死亡时，你选择一名“梦魇”标记数量最多的其他角色。该角色进行判定：若判定结果不为【桃】或【桃园结义】，则该角色死亡。",
  new_guixin: "归心",
  new_guixin_info: "当你受到1点伤害后，你可以按照你选择的区域优先度随机获得每名其他角色区域里的一张牌，然后你翻面。",
  dili: "帝力",
  dili_info: '锁定技。游戏开始时，你随机获得一条<span style="font-family: yuanli">东吴命运线</span>。',
  yuheng: "驭衡",
  yuheng_info: '①出牌阶段限一次。你可以失去所有不为〖驭衡〗的非锁定技，然后随机获得全部<span style="font-family: yuanli">东吴命运线</span>涉及的一个技能。若你本阶段内没有发动过其他非锁定技，则你随机获得当前<span style="font-family: yuanli">东吴命运线</span>涉及的一个内容。②出牌阶段结束时，若你未于本阶段内发动过〖驭衡①〗，则你失去1点体力。',
  yuheng_append: '<span style="font-family: yuanli">天下英雄谁敌手？曹刘。生子当如孙仲谋！</span>',
  dili_shengzhi: "圣质",
  dili_shengzhi_info: "锁定技。若你因〖驭衡〗获得过〖英魂〗〖弘德〗〖秉壹〗，则当你使用点数为质数的牌时，此牌不可被响应。",
  dili_chigang: "持纲",
  dili_chigang_info: "锁定技。若你因〖驭衡〗获得过〖观微〗〖弼政〗〖安国〗，则当你的判定阶段开始前，你跳过此阶段并获得一个额外的摸牌阶段。",
  dili_qionglan: "穹览",
  dili_qionglan_info: '锁定技，限定技。若你因〖驭衡〗获得过〖涉猎〗〖问卦〗〖博图〗，则当你发动的〖驭衡〗结算结束后，你随机获得两条其他<span style="font-family: yuanli">东吴命运线</span>。',
  dili_quandao: "权道",
  dili_quandao_info: "锁定技。若你因〖驭衡〗获得过〖制衡〗〖诫训〗〖安恤〗，则你手牌区内点数为字母的牌的牌名视为【调剂盐梅】。",
  dili_jiaohui: "交辉",
  dili_jiaohui_info: "锁定技。若你因〖驭衡〗获得过〖下书〗〖结姻〗〖缔盟〗，且你的手牌数为1，则此牌的牌名视为【远交近攻】。",
  dili_yuanlv: "渊虑",
  dili_yuanlv_info: "锁定技。若你因〖驭衡〗获得过〖观潮〗〖决堰〗〖澜疆〗，则当你成为自己使用的不为【长安大舰】的装备牌的目标后，你将此牌置于弃牌堆，然后使用一张与此装备牌副类别相同的【长安大舰】。",
  changandajian_equip1: "长安大舰",
  changandajian_equip2: "长安大舰",
  changandajian_equip3: "长安大舰",
  changandajian_equip4: "长安大舰",
  changandajian_equip5: "长安大舰",
  changandajian_equip6: "长安大舰",
  changandajian_destroy: "长安大舰",
  changandajian_equip1_info: "锁定技。当你失去装备区内的【长安大舰】后，你销毁之。然后你选择场上的一张牌。若此牌点数为字母，则你获得之，否则弃置之。",
  changandajian_equip2_info: "锁定技。当你失去装备区内的【长安大舰】后，你销毁之并回复1点体力。然后你选择场上的一张牌。若此牌点数为字母，则你获得之，否则弃置之。",
  changandajian_equip3_info: "锁定技。其他角色至你的距离+2。当你失去装备区内的【长安大舰】后，你销毁之。然后你选择场上的一张牌。若此牌点数为字母，则你获得之，否则弃置之。",
  changandajian_equip4_info: "锁定技。你至其他角色的距离-2。当你失去装备区内的【长安大舰】后，你销毁之。然后你选择场上的一张牌。若此牌点数为字母，则你获得之，否则弃置之。",
  changandajian_equip5_info: "锁定技。你的手牌上限+2。当你失去装备区内的【长安大舰】后，你销毁之。然后你选择场上的一张牌。若此牌点数为字母，则你获得之，否则弃置之。",
  changandajian_equip6_info: "锁定技。你至其他角色的距离-2，其他角色至你的距离+2。当你失去装备区内的【长安大舰】后，你销毁之。然后你选择场上的一张牌。若此牌点数为字母，则你获得之，否则弃置之。"
};
const characterTitles = {
  shen_liubei: "誓守桃园义",
  shen_luxun: "红莲业火",
  shen_ganning: "江表之力牧",
  shen_zhangliao: "雁门之刑天",
  shen_zhaoyun: "神威如龙",
  shen_guanyu: "鬼神再临",
  shen_lvmeng: "圣光之国士",
  shen_simayi: "晋国之祖",
  shen_caocao: "超世之英杰",
  shen_zhugeliang: "赤壁的妖术师",
  shen_zhouyu: "赤壁的火神",
  shen_lvbu: "修罗之道"
};
const characterIntro = {
  lijueguosi: "请分别查看「李傕」和「郭汜」的武将介绍。",
  shen_guanyu: "关羽，字云长。曾水淹七军、擒于禁、斩庞德、威震华夏，吓得曹操差点迁都躲避，但是东吴偷袭荆州，关羽兵败被害。后传说吕蒙因关羽之魂索命而死。",
  shen_lvmeng: "吕蒙，字子明，汝南富陂人，东吴名将，原有“吴下阿蒙”之贬称，后受孙权劝说，奋发读书，最终成就一代名将。",
  shen_zhouyu: "字公瑾，庐江舒县人。东汉末年名将。有姿貌、精音律，江东有“曲有误，周郎顾”之语。周瑜少与孙策交好，后孙策遇刺身亡，孙权继任。周瑜将兵赴丧，以中护军的身份与长史张昭共掌众事，建安十三年（208年），周瑜率东吴军与刘备军联合，在赤壁击败曹操。此战也奠定了三分天下的基础。",
  shen_zhugeliang: "字孔明、号卧龙，汉族，琅琊阳都人，三国时期蜀汉丞相、杰出的政治家、军事家、发明家、文学家。在世时被封为武乡侯，死后追谥忠武侯，后来东晋政权推崇诸葛亮军事才能，特追封他为武兴王。诸葛亮为匡扶蜀汉政权，呕心沥血、鞠躬尽瘁、死而后已。其代表作有《前出师表》、《后出师表》、《诫子书》等。曾发明木牛流马等，并改造连弩，可一弩十矢俱发。于234年在宝鸡五丈原逝世。"
};
const characterFilters = {};
const dynamicTranslates = {
  nzry_longnu(player) {
    const bool = player.hasSkill("nzry_longnu_2") || player.storage.nzry_longnu;
    let yang = "你失去1点体力并摸等同于你损失体力值张牌，然后本回合你的红色手牌均视为【火【杀】】（无距离限制）", yin = "你减1点体力上限并摸等同于你体力值张牌，然后本回合你的锦囊牌均视为【雷【杀】】（无次数限制且不计入次数限制）";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技，锁定技。出牌阶段开始时，", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  }
};
const voices = {
  "#jilin1": "戢鳞潜翼，蓄志待时！",
  "#jilin2": "老臣一心为国，还望陛下明鉴。",
  "#jilin3": "年老意荒，无力朝事。",
  "#jilin4": "坐观潮起潮落，笑谈云卷云舒。",
  "#jilin5": "数载春去秋来，静看大江东流！",
  "#yingyou1": "吞吴克蜀，老臣毕生之志也！",
  "#yingyou2": "臣当总领西事，不负陛下所托！",
  "#yingyou3": "积谷屯田，以为灭贼之要！",
  "#yingyou4": "轻骑神速，八日足解新城之叛！",
  "#yingtian1": "太白袭月知何故，天狼掩日欲吞天！",
  "#yingtian2": "藏锋四十载，终昭吾亮剑之时！",
  "#wushen1": "取汝狗头，犹如探囊取物。",
  "#wushen2": "还不速速领死！",
  "#shelie1": "略懂，略懂。",
  "#shelie2": "什么都略懂一点，生活更多彩一些。",
  "#gongxin1": "攻城为下，攻心为上。",
  "#gongxin2": "我替施主把把脉。",
  "#wuhun21": "拿命来！",
  "#wuhun22": "谁来与我同去？！",
  "#shen_guanyu:die": "大仇得报，可以离开了……",
  "#xinjuejing1": "背水一战，不胜便死！",
  "#xinjuejing2": "置于死地，方能后生！",
  "#relonghun1": "能屈能伸，才是大丈夫！",
  "#relonghun2": "常山赵子龙在此！",
  "#shen_zhaoyun:die": "龙身虽死，魂魄不灭！",
  "#qixing1": "伏望天恩，誓讨汉贼！",
  "#qixing2": "祈星辰之力，佑我蜀汉！",
  "#kuangfeng1": "万事俱备，只欠业火。",
  "#kuangfeng2": "风~~起~~",
  "#dawu1": "此计可保你一时平安。",
  "#dawu2": "此非万全之策，唯惧天雷。",
  "#shen_zhugeliang:die": "今当远离，临表涕零，不知所言……",
  "#shen_lvmeng:die": "劫数难逃，我们别无选择……",
  "#yeyan1": "（燃烧声）让这熊熊业火，焚尽你的罪恶！",
  "#yeyan2": "（燃烧声）聆听吧，这献给你的镇魂曲！",
  "#qinyin1": "（急促的琴声、燃烧声）",
  "#qinyin2": "（舒缓的琴声）",
  "#shen_zhouyu:die": "逝者不死，浴火……重生……",
  "#renjie21": "忍一时，风平浪静。",
  "#renjie22": "退一步，海阔天空。",
  "#sbaiyin1": "老骥伏枥，志在千里！",
  "#sbaiyin2": "烈士暮年，壮心不已！",
  "#lianpo1": "受命于天，既寿永昌！",
  "#lianpo2": "一鼓作气，破敌致胜！",
  "#shen_simayi:die": "鼎足三分已成梦，一切都结束了……",
  "#guixin1": "山不厌高，海不厌深！",
  "#guixin2": "周公吐哺，天下归心！",
  "#shen_caocao:die": "腾蛇乘雾，终为土灰……",
  "#baonu1": "嗯~~~~~！",
  "#baonu2": "哼！",
  "#wumou1": "哪个说我有勇无谋？！",
  "#wumou2": "不管这些了！",
  "#ol_wuqian1": "看我神威，无坚不摧！",
  "#ol_wuqian2": "天王老子也保不住你！",
  "#ol_shenfen1": "凡人们，颤抖吧！这是神之怒火！",
  "#ol_shenfen2": "这，才是活生生的地狱！",
  "#shen_lvbu:die": "我在修罗炼狱，等着你们，呃哈哈哈哈哈~",
  "#nzry_longnu1": "龙怒降临，岂是尔等凡人可抗？",
  "#nzry_longnu2": "龙意怒火，汝皆不能逃脱。",
  "#nzry_jieying1": "桃园结义，营一世之交。",
  "#nzry_jieying2": "结草衔环，报兄弟大恩。",
  "#shen_liubei:die": "桃园依旧，来世再结……",
  "#nzry_junlve1": "文韬武略兼备，方可破敌如破竹。",
  "#nzry_junlve2": "军略绵腹，制敌千里。",
  "#nzry_cuike1": "摧敌心神，克敌计谋。",
  "#nzry_cuike2": "克险摧难，军略当先。",
  "#nzry_dinghuo1": "绽东吴业火，烧敌军数千！",
  "#nzry_dinghuo2": "业火映东水，吴志绽敌营！",
  "#shen_luxun:die": "东吴业火，终究熄灭……",
  "#drlt_duorui1": "夺敌军锐气，杀敌方士气。",
  "#drlt_duorui2": "尖锐之势，吾亦可一人夺之！",
  "#drlt_zhiti1": "娃闻名止啼，孙损十万休。",
  "#drlt_zhiti2": "江东小儿，安敢啼哭？",
  "#shen_zhangliao:die": "我也有……被孙仲谋所伤之时？",
  "#drlt_poxi1": "夜袭敌军，挫其锐气。",
  "#drlt_poxi2": "受主知遇，袭敌不惧。",
  "#drlt_jieying1": "劫营速战，措手不及。",
  "#drlt_jieying2": "裹甲衔枚，劫营如入无人之境。",
  "#shen_ganning:die": "吾不能奉主，谁辅主基业？",
  "#boss_zhaoyun:die": "血染鳞甲，龙坠九天……",
  "#dili_shengzhi1": "位继父兄，承弘德以继往。",
  "#dili_shengzhi2": "英魂犹在，履功业而开来。",
  "#dili_chigang1": "秉承伦常，扶树纲纪。",
  "#dili_chigang2": "至尊临位，则朝野自肃。",
  "#dili_qionglan1": "事无巨细，咸即问询。",
  "#dili_qionglan2": "纵览全局，以小见大。",
  "#dili_quandao1": "继策掌权，符令吴会。",
  "#dili_quandao2": "以权驭衡，谋定天下。",
  "#dili_jiaohui1": "日月交辉，天下大白。",
  "#dili_jiaohui2": "雄鸡引颈，生民白也。",
  "#dili_yuanlv1": "临江而眺，静观江水东流。",
  "#dili_yuanlv2": "屹立山巅，笑看大江潮来。",
  "#jilue_guicai1": "老夫，即是天命！",
  "#jilue_fangzhu1": "赦你死罪，你去吧！",
  "#jilue_wansha1": "天要亡你，谁人能救？",
  "#jilue_zhiheng1": "天之道，轮回也。",
  "#jilue_jizhi1": "顺应天意，得道多助。",
  "#wushuang_shen_lvbu1": "燎原千里，凶名远扬！",
  "#wushuang_shen_lvbu2": "铁蹄奋进，所向披靡！"
};
const characterSort = {
  extra_feng: ["shen_guanyu", "shen_lvmeng"],
  extra_huo: ["shen_zhugeliang", "shen_zhouyu"],
  extra_lin: ["shen_caocao", "shen_lvbu"],
  extra_shan: ["shen_zhaoyun", "shen_simayi"],
  extra_yin: ["shen_liubei", "shen_luxun"],
  extra_lei: ["shen_ganning", "shen_zhangliao"]
};
const characterSortTranslate = {
  extra_feng: "神话再临·风",
  extra_huo: "神话再临·火",
  extra_lin: "神话再临·林",
  extra_shan: "神话再临·山",
  extra_yin: "神话再临·阴",
  extra_lei: "神话再临·雷",
  extra_key: "论外",
  extra_offlineDecade: "神·武·线下"
};
game.import("character", function() {
  return {
    name: "extra",
    connect: true,
    connectBanned: ["shen_diaochan"],
    character: { ...characters },
    characterSort: {
      extra: characterSort
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
