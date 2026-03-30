import { lib, get, ui, game, _status } from "noname";
const characters = {
  re_huangzhong: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["xinliegong"]
  },
  old_zhoutai: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["gzbuqu"]
  },
  old_caoren: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["jushou"],
    dieAudios: ["new_caoren"]
  },
  re_xuhuang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["duanliang", "jiezi"]
  },
  re_pangde: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["mashu", "jianchu"]
  },
  re_xiahouyuan: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["xinshensu"],
    names: "夏侯|渊"
  },
  re_weiyan: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["xinkuanggu", "qimou"]
  },
  xiaoqiao: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["retianxiang", "hongyan"],
    names: "桥|null"
  },
  sp_zhangjiao: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["releiji", "guidao", "huangtian"],
    isZhugong: true
  },
  re_yuji: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["xinfu_guhuo"]
  },
  sp_zhugeliang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["bazhen", "huoji", "kanpo"],
    names: "诸葛|亮"
  },
  pangtong: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["lianhuan", "oldniepan"]
  },
  xunyu: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["quhu", "jieming"],
    clans: ["颍川荀氏"]
  },
  dianwei: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["qiangxix"]
  },
  taishici: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["tianyi"],
    names: "太史|慈"
  },
  yanwen: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["shuangxiong"],
    names: "颜|良-文|丑"
  },
  re_yuanshao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["luanji", "xueyi"],
    isZhugong: true,
    dieAudios: ["yuanshao"]
  },
  menghuo: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["huoshou", "zaiqixx", "twqiushou"],
    isZhugong: true,
    doubleGroup: ["shu", "qun"]
  },
  zhurong: {
    sex: "female",
    group: "shu",
    hp: 4,
    skills: ["juxiang", "lieren"],
    doubleGroup: ["shu", "qun"],
    names: "null|null"
  },
  caopi: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["xingshang", "fangzhu", "songwei"],
    isZhugong: true
  },
  re_lusu: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["haoshi", "dimeng"]
  },
  sunjian: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["gzyinghun"]
  },
  dongzhuo: {
    sex: "male",
    group: "qun",
    hp: 8,
    skills: ["jiuchi", "roulin", "benghuai", "baonue"],
    isZhugong: true
  },
  jiaxu: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["luanwu", "wansha", "weimu"]
  },
  jiangwei: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["tiaoxin", "zhiji"]
  },
  liushan: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["xiangle", "fangquan", "ruoyu"],
    isZhugong: true
  },
  zhanghe: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["qiaobian"]
  },
  dengai: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["tuntian", "zaoxian"]
  },
  sunce: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["jiang", "hunzi", "zhiba"],
    isZhugong: true
  },
  zhangzhang: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["zhijian", "guzheng"],
    names: "张|昭-张|纮"
  },
  caiwenji: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["beige", "duanchang"]
  },
  zuoci: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["huashen", "xinsheng"]
  },
  wangji: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["qizhi", "jinqu"]
  },
  yanyan: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["nzry_juzhan"]
  },
  wangping: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["nzry_feijun", "nzry_binglve"]
  },
  luji: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["nzry_huaiju", "nzry_yili", "nzry_zhenglun"],
    clans: ["吴郡陆氏"]
  },
  sunliang: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["nzry_kuizhu", "nzry_zhizheng", "nzry_lijun"],
    isZhugong: true
  },
  xuyou: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["nzry_chenglve", "nzry_shicai", "nzry_cunmu"]
  },
  yl_luzhi: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["nzry_mingren", "nzry_zhenliang"]
  },
  kuailiangkuaiyue: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["nzry_jianxiang", "nzry_shenshi"],
    names: "蒯|良-蒯|越"
  },
  guanqiujian: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["zhengrong", "hongju"],
    names: "毌丘|俭"
  },
  haozhao: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["drlt_zhengu"]
  },
  zhugezhan: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["xinfu_zuilun", "xinfu_fuyin"],
    names: "诸葛|瞻"
  },
  lukang: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["drlt_qianjie", "drlt_jueyan", "drlt_poshi"],
    clans: ["吴郡陆氏"]
  },
  yl_yuanshu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["drlt_yongsi", "drlt_weidi"],
    isZhugong: true
  },
  zhangxiu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["drlt_xiongluan", "drlt_congjian", "twjuxiang"],
    isZhugong: true
  },
  chendao: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["dcwanglie"]
  },
  zhoufei: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["olliangyin", "olkongsheng"],
    names: "周|null"
  }
};
const cards = {};
const pinyins = {};
const skills = {
  //庞统写法修改
  lianhuan: {
    audio: 2,
    hiddenCard(player, name) {
      return name == "tiesuo" && player.hasCard((card) => get.suit(card) == "club", "sh");
    },
    enable: "chooseToUse",
    filter(event, player) {
      if (!player.hasCard((card) => get.suit(card) == "club", "sh")) {
        return false;
      }
      return event.type == "phase" || event.filterCard(get.autoViewAs({ name: "tiesuo" }, "unsure"), player, event);
    },
    position: "hs",
    filterCard(card, player, event) {
      if (!event) {
        event = _status.event;
      }
      if (get.suit(card) != "club") {
        return false;
      }
      if (event.type == "phase" && get.position(card) != "s" && player.canRecast(card)) {
        return true;
      } else {
        if (game.checkMod(card, player, "unchanged", "cardEnabled2", player) === false) {
          return false;
        }
        const cardx = get.autoViewAs({ name: "tiesuo" }, [card]);
        return event._backup.filterCard(cardx, player, event);
      }
    },
    filterTarget(fuck, player, target) {
      const card = ui.selected.cards[0], event = _status.event, backup = event._backup;
      if (!card || game.checkMod(card, player, "unchanged", "cardEnabled2", player) === false) {
        return false;
      }
      const cardx = get.autoViewAs({ name: "tiesuo" }, [card]);
      return backup.filterCard(cardx, player, event) && backup.filterTarget(cardx, player, target);
    },
    selectTarget() {
      const card = ui.selected.cards[0], event = _status.event, player = event.player, backup = event._backup;
      let recast = false, use = false;
      const cardx = get.autoViewAs({ name: "tiesuo" }, [card]);
      if (event.type == "phase" && player.canRecast(card)) {
        recast = true;
      }
      if (card && game.checkMod(card, player, "unchanged", "cardEnabled2", player) !== false) {
        if (backup.filterCard(cardx, player, event)) {
          use = true;
        }
      }
      if (!use) {
        return [0, 0];
      } else {
        const select = backup.selectTarget(cardx, player);
        if (recast && select[0] > 0) {
          select[0] = 0;
        }
        return select;
      }
    },
    filterOk() {
      const card = ui.selected.cards[0], event = _status.event, player = event.player, backup = event._backup;
      const selected = ui.selected.targets.length;
      let recast = false, use = false;
      const cardx = get.autoViewAs({ name: "tiesuo" }, [card]);
      if (event.type == "phase" && player.canRecast(card)) {
        recast = true;
      }
      if (card && game.checkMod(card, player, "unchanged", "cardEnabled2", player) !== false) {
        if (backup.filterCard(cardx, player, event)) {
          use = true;
        }
      }
      if (recast && selected == 0) {
        return true;
      } else if (use) {
        const select = backup.selectTarget(cardx, player);
        if (select[0] <= -1) {
          return true;
        }
        return selected >= select[0] && selected <= select[1];
      }
    },
    ai1(card) {
      return 6 - get.value(card);
    },
    ai2(target) {
      const player = get.player();
      return get.effect(target, { name: "tiesuo" }, player, player);
    },
    discard: false,
    lose: false,
    delay: false,
    viewAs(cards2, player) {
      return {
        name: "tiesuo"
      };
    },
    prepare: () => true,
    async precontent(event, trigger, player) {
      const result = event.result;
      if (!result?.targets?.length) {
        delete result.card;
      }
    },
    async content(event, trigger, player) {
      await player.recast(event.cards);
    },
    ai: {
      order(item, player) {
        if (game.hasPlayer((current) => get.effect(current, { name: "tiesuo" }, player, player) > 0) || player.hasCard((card) => get.suit(card) == "club" && player.canRecast(card), "h")) {
          return 8;
        }
        return 1;
      },
      result: { player: 1 }
    }
  },
  //新杀小加强 陈到
  dcwanglie: {
    audio: "drlt_wanglie",
    locked: false,
    mod: {
      targetInRange(card, player, target) {
        if (player.hasSkill("dcwanglie_effect", null, null, false)) {
          return true;
        }
      }
    },
    trigger: {
      player: "useCard"
    },
    filter(event, player) {
      return player.isPhaseUsing() && (event.card.name == "sha" || get.type(event.card) == "trick");
    },
    preHidden: true,
    check(event, player) {
      if (player.hasSkill("dcwanglie2", null, null, false)) {
        return true;
      }
      if (["wuzhong", "kaihua", "dongzhuxianji"].includes(event.card.name)) {
        return false;
      }
      player._wanglie_temp = true;
      let eff = 0;
      for (const i2 of event.targets) {
        eff += get.effect(i2, event.card, player, player);
      }
      delete player._wanglie_temp;
      if (eff < 0) {
        return true;
      }
      if (!player.countCards("h", function(card) {
        return player.hasValueTarget(card, null, true);
      })) {
        return true;
      }
      if (get.tag(event.card, "damage") && !player.needsToDiscard() && !player.countCards("h", function(card) {
        return get.tag(card, "damage") && player.hasValueTarget(card, null, true);
      })) {
        return true;
      }
      return false;
    },
    prompt2(event) {
      return "令" + get.translation(event.card) + "不能被响应，然后本阶段你使用牌只能指定自己为目标";
    },
    group: "dcwanglie_startup",
    async content(event, trigger, player) {
      trigger.nowuxie = true;
      trigger.directHit.addArray(game.players);
      player.addTempSkill("dcwanglie2", "phaseUseAfter");
    },
    subSkill: {
      startup: {
        trigger: { player: "phaseUseBegin" },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          player.addTempSkill("dcwanglie_effect", "phaseUseAfter");
        }
      },
      effect: {
        forced: true,
        charlotte: true,
        firstDo: true,
        popup: false,
        trigger: { player: "useCard1" },
        filter(event, player) {
          return event.targets.some((target) => target != player);
        },
        async content(event, trigger, player) {
          player.addMark("dcwanglie_effect", 1, false);
          if (player.countMark("dcwanglie_effect") >= 2) {
            player.removeSkill("dcwanglie_effect");
          }
        },
        onremove: true
      }
    },
    ai: {
      //pretao:true,
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (player._wanglie_temp) {
          return false;
        }
        player._wanglie_temp = true;
        const bool = (function() {
          if (["wuzhong", "kaihua", "dongzhuxianji"].includes(arg.card.name)) {
            return false;
          }
          if (get.attitude(player, arg.target) > 0 || !player.isPhaseUsing()) {
            return false;
          }
          let cards2 = player.getCards("h", function(card) {
            return card != arg.card && (!arg.card.cards || !arg.card.cards.includes(card));
          });
          let sha = player.getCardUsable("sha");
          if (arg.card.name == "sha") {
            sha--;
          }
          cards2 = cards2.filter(function(card) {
            if (card.name == "sha" && sha <= 0) {
              return false;
            }
            return player.hasValueTarget(card, null, true);
          });
          if (!cards2.length) {
            return true;
          }
          if (!get.tag(arg.card, "damage")) {
            return false;
          }
          if (!player.needsToDiscard() && !cards2.filter(function(card) {
            return get.tag(card, "damage");
          }).length) {
            return true;
          }
          return false;
        })();
        delete player._wanglie_temp;
        return bool;
      }
    }
  },
  dcwanglie2: {
    charlotte: true,
    mod: {
      playerEnabled(card, player, target) {
        if (player != target) {
          return false;
        }
      }
    }
  },
  //周妃
  olliangyin: {
    audio: "liangyin",
    trigger: {
      global: ["loseAfter", "addToExpansionAfter", "cardsGotoSpecialAfter", "loseAsyncAfter"]
    },
    filter(event, player, name) {
      if (event.name == "lose" || event.name == "loseAsync") {
        return event.getlx !== false && event.toStorage == true;
      }
      if (event.name == "cardsGotoSpecial") {
        return !event.notrigger;
      }
      return true;
    },
    usable: 1,
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "选择一名其他角色，你与其各摸一张牌", lib.filter.notMe).set("ai", function(target) {
        const player2 = _status.event.player, num = player2.getExpansions("olkongsheng").length - 1;
        const att = get.attitude(player2, target);
        if (att <= 0) {
          return 0;
        }
        if (target.countCards("h") == num && target.isDamaged() && get.recoverEffect(target, player2, player2) > 0) {
          return 3 * att;
        }
        return att;
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await game.asyncDraw([player, target].sortBySeat());
      await game.delayx();
      let num = player.getExpansions("olkongsheng").length;
      let check = (player2) => {
        if (!player2.isIn() || player2.isHealthy()) {
          return false;
        }
        return player2.countCards("h") == num;
      };
      if (check(player) || check(target)) {
        const choiceList = ["令自己回复1点体力", "令" + get.translation(target) + "回复1点体力"];
        const choices = [];
        if (check(player)) {
          choices.push("选项一");
        } else {
          choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
        }
        if (check(target)) {
          choices.push("选项二");
        } else {
          choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
        }
        choices.push("cancel2");
        const { control } = await player.chooseControl(choices).set("choiceList", choiceList).set("prompt", "良姻：是否令一名角色回复体力？").set("ai", function() {
          const player2 = _status.event.player, target2 = _status.event.getParent().targets[0];
          let list = _status.event.controls.slice(0), eff1 = 0, eff2 = 0;
          if (list.includes("选项一")) {
            eff1 = get.recoverEffect(player2, player2, player2);
          }
          if (list.includes("选项二")) {
            eff2 = get.recoverEffect(target2, player2, player2);
          }
          if (eff1 > Math.max(0, eff2)) {
            return "选项一";
          }
          if (eff2 > 0) {
            return "选项二";
          }
          return "cancel2";
        }).forResult();
        if (control == "选项一") {
          await player.recover();
        } else if (control == "选项二") {
          await target.recover();
        }
      }
    },
    group: "olliangyin_gain",
    subSkill: {
      gain: {
        audio: "liangyin",
        trigger: {
          global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          return game.hasPlayer(function(current) {
            const evt = event.getl(current);
            return evt && (evt.xs.length > 0 || evt.ss.length > 0);
          });
        },
        usable: 1,
        async cost(event, trigger, player) {
          if (!player.countCards("he") || !game.hasPlayer((current) => current != player && current.countCards("he") > 0)) {
            return;
          }
          event.result = await player.chooseCardTarget({
            prompt: get.prompt("olliangyin"),
            prompt2: "弃置一张牌，并令一名其他角色也弃置一张牌",
            position: "he",
            filterCard: lib.filter.cardDiscardable,
            filterTarget(card, player2, target) {
              return target != player2 && target.countCards("he") > 0;
            },
            ai1(card) {
              let player2 = _status.event.player;
              if (_status.event.me) {
                if (get.position(card) === _status.event.me) {
                  return 12 - player2.hp - get.value(card);
                }
                return 0;
              }
              return 5 - get.value(card);
            },
            ai2(target) {
              let player2 = _status.event.player, att = get.attitude(player2, target);
              if (att > 0 && (_status.event.me || target.isHealthy())) {
                return -att;
              }
              if (att > 0 && (target.countCards("he") > target.hp || target.hasCard(function(card) {
                return get.value(card, target) <= 0;
              }, "e"))) {
                return att;
              }
              return -att;
            },
            me: (() => {
              if (player.isHealthy() || get.recoverEffect(player, player, _status.event.player) <= 0) {
                return false;
              }
              let ph = player.countCards("h"), num = player.getExpansions("olkongsheng").length;
              if (ph === num) {
                if (player.hasSkillTag("noh")) {
                  return "h";
                }
                return "e";
              }
              if (ph - 1 === num) {
                return "h";
              }
              return false;
            })()
          }).forResult();
        },
        async content(event, trigger, player) {
          const target = event.targets[0];
          await player.discard(event.cards);
          await target.chooseToDiscard("he", true);
          await game.delayx();
          const num = player.getExpansions("olkongsheng").length;
          const check = (player2) => {
            if (!player2.isIn() || player2.isHealthy()) {
              return false;
            }
            return player2.countCards("h") == num;
          };
          if (check(player) || check(target)) {
            const choiceList = ["令自己回复1点体力", "令" + get.translation(target) + "回复1点体力"];
            const choices = [];
            if (check(player)) {
              choices.push("选项一");
            } else {
              choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
            }
            if (check(target)) {
              choices.push("选项二");
            } else {
              choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
            }
            choices.push("cancel2");
            const { control } = await player.chooseControl(choices).set("choiceList", choiceList).set("prompt", "良姻：是否令一名角色回复体力？").set("ai", function() {
              const player2 = _status.event.player, target2 = _status.event.getParent().targets[0];
              let list = _status.event.controls.slice(0), eff1 = 0, eff2 = 0;
              if (list.includes("选项一")) {
                eff1 = get.recoverEffect(player2, player2, player2);
              }
              if (list.includes("选项二")) {
                eff2 = get.recoverEffect(target2, player2, player2);
              }
              if (eff1 > Math.max(0, eff2)) {
                return "选项一";
              }
              if (eff2 > 0) {
                return "选项二";
              }
              return "cancel2";
            }).forResult();
            if (control == "选项一") {
              await player.recover();
            } else if (control == "选项二") {
              await target.recover();
            }
          }
        }
      }
    }
  },
  olkongsheng: {
    audio: "kongsheng",
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard("he", [1, player.countCards("he")], get.prompt(event.skill), "将任意张牌作为“箜”置于武将牌上", "allowChooseAll").set("ai", function(card) {
        const player2 = _status.event.player, num = player2.getExpansions("olkongsheng") + ui.selected.cards.length;
        if (ui.selected.cards.length > 0 && game.hasPlayer(function(current) {
          if (current.isHealthy() || get.recoverEffect(current, player2, player2) <= 0) {
            return false;
          }
          const num2 = current.countCards("h", function(card2) {
            if (current != player2) {
              return true;
            }
            return !ui.selected.cards.includes(card2);
          }) + 1;
          return num == num2;
        })) {
          return 0;
        }
        if (get.type(card, null, false) == "equip") {
          for (const i2 of ui.selected.cards) {
            if (get.type(i2, null, false) == "equip") {
              return 0;
            }
          }
          return 5 - get.value(card);
        }
        if (!player2.hasValueTarget(card)) {
          return 1;
        }
        return 0;
      }).forResult();
    },
    async content(event, trigger, player) {
      const next = player.addToExpansion(event.cards, player, "give");
      next.gaintag.add("olkongsheng");
      await next;
    },
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    group: "olkongsheng_kessoku",
    subSkill: {
      kessoku: {
        audio: "kongsheng",
        trigger: { player: "phaseJieshuBegin" },
        forced: true,
        locked: false,
        filter(event, player) {
          return player.getExpansions("olkongsheng").filter(function(card) {
            return get.type(card, null, false) != "equip";
          }).length > 0;
        },
        async content(event, trigger, player) {
          let cards2 = player.getExpansions("olkongsheng").filter(function(card) {
            return get.type(card, null, false) != "equip";
          });
          if (cards2.length) {
            await player.gain(cards2, "gain2");
          }
          cards2 = player.getExpansions("olkongsheng");
          if (cards2.length <= 0) {
            return;
          }
          const result = await player.chooseTarget(true, "令一名角色使用以下装备牌", get.translation(cards2)).set("ai", function(target2) {
            const player2 = _status.event.player;
            return get.effect(target2, { name: "losehp" }, player2, player2);
          }).forResult();
          const target = result.targets[0];
          player.line(target, "green");
          while (true) {
            const cards3 = player.getExpansions("olkongsheng").filter(function(i2) {
              return target.hasUseTarget(i2);
            });
            if (cards3.length) {
              let card = cards3[0];
              if (cards3.length > 1) {
                const result2 = await target.chooseButton(true, ["选择要使用的装备牌", cards3]).set("ai", function(button) {
                  return get.order(button.link);
                }).forResult();
                if (!result2.bool) {
                  break;
                }
                card = result2.links[0];
              }
              await target.chooseUseTarget(card, true);
            } else {
              break;
            }
          }
          await target.loseHp();
        }
      }
    }
  },
  //新毌丘俭
  zhengrong: {
    trigger: { player: "useCardToPlayered" },
    audio: "drlt_zhenrong",
    filter(event, player) {
      if (!event.isFirstTarget) {
        return false;
      }
      if (!["basic", "trick"].includes(get.type(event.card))) {
        return false;
      }
      if (get.tag(event.card, "damage")) {
        return game.hasPlayer(function(current) {
          return event.targets.includes(current) && current.countCards("h") >= player.countCards("h") && current.countCards("he") > 0;
        });
      }
      return false;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "将一名手牌数不小于你的目标角色的一张牌置于你的武将牌上，成为「荣」", function(card, player2, target) {
        return _status.event.targets.includes(target) && target.countCards("h") >= player2.countCards("h") && target.countCards("he") > 0;
      }).set("ai", function(target) {
        return (1 - get.attitude(_status.event.player, target)) / target.countCards("he");
      }).set("targets", trigger.targets).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const next = player.choosePlayerCard(target, "he", true);
      next.ai = get.buttonValue;
      const result = await next.forResult();
      if (result.bool) {
        const card = result.links[0];
        const next2 = player.addToExpansion(card, "give", "log", target);
        next2.gaintag.add("zhengrong");
        await next2;
      }
    },
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    marktext: "荣",
    intro: {
      content: "expansion",
      markcount: "expansion"
    }
  },
  hongju: {
    trigger: { player: "phaseZhunbeiBegin" },
    audio: "drlt_hongju",
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "thunder",
    derivation: "qingce",
    filter(event, player) {
      return player.getExpansions("zhengrong").length >= 3;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const cards2 = player.getExpansions("zhengrong");
      if (cards2.length && player.countCards("h")) {
        const next = player.chooseToMove("征荣：是否交换“荣”和手牌？");
        next.set("list", [
          [get.translation(player) + "（你）的“荣”", cards2],
          ["手牌区", player.getCards("h")]
        ]);
        next.set("filterMove", function(from, to) {
          return typeof to != "number";
        });
        next.set("processAI", function(list) {
          const player2 = _status.event.player, cards3 = list[0][1].concat(list[1][1]).sort(function(a, b) {
            return get.value(a) - get.value(b);
          }), cards22 = cards3.splice(0, player2.getExpansions("zhengrong").length);
          return [cards22, cards3];
        });
        const result = await next.forResult();
        if (result.bool) {
          const pushs = result.moved[0], gains = result.moved[1];
          pushs.removeArray(player.getExpansions("zhengrong"));
          gains.removeArray(player.getCards("h"));
          if (pushs.length && pushs.length == gains.length) {
            const next2 = player.addToExpansion(pushs);
            next2.gaintag.add("zhengrong");
            await next2;
            await player.gain(gains, "gain2", "log");
          }
        }
      }
      await player.addSkills("qingce");
      game.log(player, "获得了技能", "#g【清侧】");
      await player.loseMaxHp();
    },
    ai: { combo: "zhengrong" }
  },
  qingce: {
    enable: "phaseUse",
    audio: "drlt_qingce",
    filter(event, player) {
      return player.getExpansions("zhengrong").length > 0 && player.countCards("h") > 0;
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("请选择要获得的「荣」", player.getExpansions("zhengrong"), "hidden");
      },
      backup(links, player) {
        return {
          card: links[0],
          filterCard: true,
          position: "h",
          filterTarget(card, player2, target) {
            return target.countDiscardableCards(player2, "ej") > 0;
          },
          delay: false,
          audio: "drlt_qingce",
          content: lib.skill.qingce.contentx,
          ai: {
            result: {
              target(player2, target) {
                const att = get.attitude(player2, target);
                if (att > 0 && (target.countCards("j") > 0 || target.countCards("e", function(card) {
                  return get.value(card, target) < 0;
                }))) {
                  return 2;
                }
                if (att < 0 && target.countCards("e") > 0 && !target.hasSkillTag("noe")) {
                  return -1;
                }
                return 0;
              }
            }
          }
        };
      },
      prompt(links, player) {
        return "选择弃置一张手牌，获得" + get.translation(links[0]) + "并弃置一名角色装备区或判定区内的一张牌";
      }
    },
    async contentx(event, trigger, player) {
      const card = lib.skill.qingce_backup.card;
      await player.gain(card, "gain2", "log");
      if (event.target.countDiscardableCards(player, "ej") > 0) {
        await player.discardPlayerCard("ej", true, event.target);
      }
    },
    ai: {
      combo: "zhengrong",
      order: 8,
      result: {
        player(player) {
          if (game.hasPlayer(function(current) {
            const att = get.attitude(player, current);
            if (att > 0 && current.countCards("j") > 0 || att < 0 && current.countCards("e") > 0) {
              return true;
            }
            return false;
          })) {
            return 1;
          }
          return 0;
        }
      }
    }
  },
  //阴雷
  drlt_zhenrong: {
    marktext: "荣",
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    audio: 2,
    trigger: { source: "damageSource" },
    filter(event, player) {
      return event.player != player && event.player.countCards("h") > player.countCards("h");
    },
    async cost(event, trigger, player) {
      const result = await player.choosePlayerCard("hej", get.prompt(event.skill), trigger.player).set("ai", function(button) {
        const { player: player2, target } = get.event();
        return -get.attitude(player2, target) + 1;
      }).forResult();
      if (result?.bool && result.links?.length) {
        event.result = result;
        event.result.cards = result.links;
      }
    },
    async content(event, trigger, player) {
      const next = player.addToExpansion(event.cards, trigger.player, "give", "log");
      next.gaintag.add("drlt_zhenrong");
      await next;
    }
  },
  drlt_hongju: {
    skillAnimation: true,
    animationColor: "thunder",
    audio: 2,
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    forced: true,
    unique: true,
    juexingji: true,
    derivation: ["drlt_qingce"],
    filter(event, player) {
      return player.getExpansions("drlt_zhenrong").length >= 3 && game.dead.length > 0;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const cards2 = player.getExpansions("drlt_zhenrong");
      if (cards2.length && player.countCards("h")) {
        const next = player.chooseToMove("征荣：是否交换“荣”和手牌？");
        next.set("list", [
          [get.translation(player) + "（你）的“荣”", cards2],
          ["手牌区", player.getCards("h")]
        ]);
        next.set("filterMove", function(from, to) {
          return typeof to != "number";
        });
        next.set("processAI", function(list) {
          const player2 = _status.event.player, cards3 = list[0][1].concat(list[1][1]).sort(function(a, b) {
            return get.value(a) - get.value(b);
          }), cards22 = cards3.splice(0, player2.getExpansions("drlt_zhenrong").length);
          return [cards22, cards3];
        });
        const result = await next.forResult();
        if (result.bool) {
          const pushs = result.moved[0], gains = result.moved[1];
          pushs.removeArray(player.getExpansions("drlt_zhenrong"));
          gains.removeArray(player.getCards("h"));
          if (pushs.length && pushs.length == gains.length) {
            const next2 = player.addToExpansion(pushs);
            next2.gaintag.add("drlt_zhenrong");
            await next2;
            await player.gain(gains, "gain2", "log");
          }
        }
      }
      await player.addSkills("drlt_qingce");
      await player.loseMaxHp();
    },
    ai: {
      combo: "drlt_zhenrong"
    }
  },
  drlt_qingce: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.getExpansions("drlt_zhenrong").length > 0;
    },
    filterTarget(card, player, target) {
      return target.countDiscardableCards(player, "ej") > 0;
    },
    async content(event, trigger, player) {
      const next = player.chooseCardButton(player.getExpansions("drlt_zhenrong"), 1, "请选择需要弃置的“荣”", true);
      next.ai = (button) => 6 - get.value(button.link);
      const result = await next.forResult();
      if (result.bool) {
        const cards2 = result.links;
        await player.loseToDiscardpile(cards2);
        await player.discardPlayerCard(event.target, "ej", 1, true);
      }
    },
    ai: {
      combo: "drlt_zhenrong",
      order: 13,
      result: {
        target(player, target) {
          if (get.attitude(player, target) > 0 && target.countCards("j") > 0) {
            return 1;
          }
          return -1;
        }
      }
    }
  },
  drlt_zhengu: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), function(card, player2, target) {
        return target != player2;
      }).set("ai", function(target) {
        const player2 = _status.event.player;
        const num = Math.min(5, player2.countCards("h")) - target.countCards("h");
        const att = get.attitude(player2, target);
        return num * att;
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.addSkill("drlt_zhengu2");
      target.addSkill("drlt_zhengu_mark");
      target.storage.drlt_zhengu_mark.push(player);
      target.markSkill("drlt_zhengu_mark");
      lib.skill.drlt_zhengu.sync(player, target);
    },
    sync(player, target) {
      const num = player.countCards("h");
      const num2 = target.countCards("h");
      if (num < num2) {
        target.chooseToDiscard(num2 - num, true, "h", "allowChooseAll");
      } else {
        target.drawTo(Math.min(5, num));
      }
    }
  },
  drlt_zhengu2: {
    audio: "drlt_zhengu",
    trigger: {
      global: "phaseEnd"
    },
    forced: true,
    charlotte: true,
    logTarget: "player",
    sourceSkill: "drlt_zhengu",
    filter(event, player) {
      return event.player.storage.drlt_zhengu_mark && event.player.storage.drlt_zhengu_mark.includes(player);
    },
    async content(event, trigger, player) {
      while (trigger.player.storage.drlt_zhengu_mark.includes(player)) {
        trigger.player.storage.drlt_zhengu_mark.remove(player);
      }
      if (trigger.player.storage.drlt_zhengu_mark.length == 0) {
        trigger.player.unmarkSkill("drlt_zhengu_mark");
      }
      lib.skill.drlt_zhengu.sync(player, trigger.player);
    }
  },
  drlt_zhengu_mark: {
    charlotte: true,
    init(player, skill) {
      if (!player.storage[skill]) {
        player.storage[skill] = [];
      }
    },
    marktext: "镇",
    intro: {
      name: "镇骨",
      content: "已成为$〖镇骨〗的目标"
    }
  },
  xinfu_zuilun: {
    audio: 2,
    trigger: {
      player: "phaseJieshuBegin"
    },
    check(event, player) {
      let num = 0;
      if (player.hasHistory("lose", function(evt) {
        return evt.type == "discard";
      })) {
        num++;
      }
      if (!player.isMinHandcard()) {
        num++;
      }
      if (!player.getStat("damage")) {
        num++;
      }
      if (num == 3) {
        return player.hp >= 2;
      }
      return true;
    },
    prompt(event, player) {
      let num = 3;
      if (player.hasHistory("lose", function(evt) {
        return evt.type == "discard";
      })) {
        num--;
      }
      if (!player.isMinHandcard()) {
        num--;
      }
      if (!player.getStat("damage")) {
        num--;
      }
      return get.prompt("xinfu_zuilun") + "（可获得" + get.cnNumber(num) + "张牌）";
    },
    async content(event, trigger, player) {
      let num = 0;
      const cards2 = get.cards(3);
      await game.cardsGotoOrdering(cards2);
      if (player.hasHistory("lose", function(evt) {
        return evt.type == "discard";
      })) {
        num++;
      }
      if (!player.isMinHandcard()) {
        num++;
      }
      if (!player.getStat("damage")) {
        num++;
      }
      if (num == 0) {
        await player.gain(cards2, "draw");
        return;
      }
      let prompt = "罪论：将" + get.cnNumber(num) + "张牌置于牌堆顶";
      if (num < 3) {
        prompt += "并获得其余的牌";
      }
      const chooseToMove = player.chooseToMove(prompt, true);
      if (num < 3) {
        chooseToMove.set("list", [["牌堆顶", cards2], ["获得"]]);
        chooseToMove.set("filterMove", function(from, to, moved) {
          if (to == 1 && moved[0].length <= _status.event.num) {
            return false;
          }
          return true;
        });
        chooseToMove.set("filterOk", function(moved) {
          return moved[0].length == _status.event.num;
        });
      } else {
        chooseToMove.set("list", [["牌堆顶", cards2]]);
      }
      chooseToMove.set("num", num);
      chooseToMove.set("processAI", function(list) {
        const check = function(card) {
          const player2 = _status.event.player;
          const next = player2.next;
          const att = get.attitude(player2, next);
          const judge = next.getCards("j")[tops.length];
          if (judge) {
            return get.judge(judge)(card) * att;
          }
          return next.getUseValue(card) * att;
        };
        const cards3 = list[0][1].slice(0), tops = [];
        while (tops.length < _status.event.num) {
          list.sort(function(a, b) {
            return check(b) - check(a);
          });
          tops.push(cards3.shift());
        }
        return [tops, cards3];
      });
      let result = await chooseToMove.forResult();
      if (result.bool) {
        const list = result.moved[0];
        cards2.removeArray(list);
        await game.cardsGotoPile(list.reverse(), "insert");
      }
      game.updateRoundNumber();
      if (cards2.length) {
        await player.gain(cards2, "draw");
        return;
      }
      const chooseTarget = player.chooseTarget("请选择一名角色，与其一同失去1点体力", true, function(card, player2, target) {
        return target != player2;
      });
      chooseTarget.ai = function(target) {
        return -get.attitude(_status.event.player, target);
      };
      result = await chooseTarget.forResult();
      player.line(result.targets[0], "fire");
      await player.loseHp();
      await result.targets[0].loseHp();
    }
  },
  xinfu_fuyin: {
    trigger: {
      target: "useCardToTargeted"
    },
    forced: true,
    audio: 2,
    filter(event, player) {
      if (event.player.countCards("h") < player.countCards("h")) {
        return false;
      }
      if (event.card.name != "sha" && event.card.name != "juedou") {
        return false;
      }
      return !game.hasPlayer2(function(current) {
        return current.getHistory("useCard", function(evt) {
          return evt != event.getParent() && evt.card && ["sha", "juedou"].includes(evt.card.name) && evt.targets.includes(player);
        }).length > 0;
      });
    },
    async content(event, trigger, player) {
      trigger.getParent().excluded.add(player);
    },
    ai: {
      effect: {
        target(card, player, target) {
          let hs = player.getCards("h", (i2) => i2 !== card && (!card.cards || !card.cards.includes(i2))), num = player.getCardUsable("sha");
          if (card.name !== "sha" && card.name !== "juedou" || hs.length < target.countCards("h")) {
            return 1;
          }
          if (game.hasPlayer2(function(current) {
            return current.getHistory("useCard", function(evt) {
              return evt.card && ["sha", "juedou"].includes(evt.card.name) && evt.targets.includes(player);
            }).length > 0;
          })) {
            return 1;
          }
          if (card.name === "sha") {
            num--;
          }
          hs = hs.filter((i2) => {
            if (!player.canUse(i2, target)) {
              return false;
            }
            if (i2.name === "juedou") {
              return true;
            }
            if (num && i2.name === "sha") {
              num--;
              return true;
            }
            return false;
          });
          if (!hs.length) {
            return "zeroplayertarget";
          }
          num = 1 - 2 / 3 / hs.length;
          return [num, 0, num, 0];
        }
      }
    }
  },
  drlt_qianjie: {
    audio: 2,
    group: ["drlt_qianjie_1", "drlt_qianjie_2", "drlt_qianjie_3"],
    locked: true,
    ai: {
      effect: {
        target(card) {
          if (card.name == "tiesuo") {
            return "zeroplayertarget";
          }
        }
      }
    },
    subSkill: {
      1: {
        audio: "drlt_qianjie",
        trigger: {
          player: "linkBegin"
        },
        forced: true,
        filter(event, player) {
          return !player.isLinked();
        },
        async content(event, trigger, player) {
          trigger.cancel();
        },
        ai: {
          noLink: true
        }
      },
      2: {
        mod: {
          targetEnabled(card, player, target) {
            if (get.type(card) == "delay") {
              return false;
            }
          }
        }
      },
      3: {
        ai: { noCompareTarget: true }
      }
    }
  },
  drlt_jueyan: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hasEnabledSlot(1) || player.hasEnabledSlot(2) || player.hasEnabledSlot(5) || player.hasEnabledSlot("horse");
    },
    async content(event, trigger, player) {
      const { control } = await player.chooseToDisable(true).set("ai", function(event2, player2, list) {
        if (list.includes("equip5") && !player2.hasSkill("drlt_jueyan_effect")) {
          return "equip5";
        }
        if (list.includes("equip2")) {
          return "equip2";
        }
        if (list.includes("equip1") && player2.countCards("h", function(card) {
          return get.name(card, player2) == "sha" && player2.hasUseTarget(card);
        }) - player2.getCardUsable("sha") > 1) {
          return "equip1";
        }
        if (list.includes("equip5") && player2.countCards("h", function(card) {
          return get.type2(card, player2) == "trick" && player2.hasUseTarget(card);
        }) > 1) {
          return "equip5";
        }
      }).forResult();
      const bool = !player.hasSkill("drlt_jueyan_effect");
      switch (control) {
        case "equip1":
          player.addTempSkill("drlt_jueyan1");
          if (bool) {
            player.addSkill("drlt_jueyan_sha");
          }
          break;
        case "equip2":
          await player.draw(3);
          player[bool ? "addSkill" : "addTempSkill"]("drlt_jueyan3");
          break;
        case "equip3_4":
          player[bool ? "addSkill" : "addTempSkill"]("drlt_jueyan2");
          break;
        case "equip5":
          await player[bool ? "addSkills" : "addTempSkills"]("rejizhi");
          break;
      }
      if (bool) {
        player.addSkill("drlt_jueyan_effect");
      }
    },
    ai: {
      order: 13,
      result: {
        player(player) {
          if (player.hasEnabledSlot("equip2")) {
            return 1;
          }
          if (player.hasEnabledSlot("equip1") && player.countCards("h", function(card) {
            return get.name(card, player) == "sha" && player.hasValueTarget(card);
          }) - player.getCardUsable("sha") > 1) {
            return 1;
          }
          if (player.hasEnabledSlot("equip5") && player.countCards("h", function(card) {
            return get.type2(card, player) == "trick" && player.hasUseTarget(card);
          }) > 1) {
            return 1;
          }
          return -1;
        }
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true
      },
      sha: {
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + 1;
            }
          }
        },
        mark: true,
        marktext: "决",
        charlotte: true,
        locked: false,
        intro: { name: "决堰 - 武器", content: "本局游戏可以多使用一张【杀】" }
      }
    },
    derivation: ["drlt_jueyan_rewrite", "rejizhi"]
  },
  rejizhi_lukang: { audio: 1 },
  drlt_jueyan1: {
    mod: {
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return num + 3;
        }
      }
    },
    mark: true,
    marktext: "决",
    charlotte: true,
    locked: false,
    intro: { name: "决堰 - 武器", content: "本回合内可以多使用三张【杀】" }
  },
  drlt_jueyan2: {
    mod: {
      targetInRange(card, player, target, now) {
        return true;
      }
    },
    mark: true,
    marktext: "决",
    charlotte: true,
    locked: false,
    intro: { name: "决堰 - 坐骑", content: "使用牌没有距离限制" }
  },
  drlt_jueyan3: {
    mod: {
      maxHandcard(player, num) {
        return num + 3;
      }
    },
    mark: true,
    marktext: "决",
    charlotte: true,
    locked: false,
    intro: { name: "决堰 - 防具", content: "手牌上限+3" }
  },
  drlt_poshi: {
    audio: 2,
    skillAnimation: true,
    animationColor: "wood",
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    juexingji: true,
    derivation: ["drlt_huairou"],
    filter(event, player) {
      return !player.hasEnabledSlot() || player.hp == 1;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.loseMaxHp();
      const num = player.maxHp - player.countCards("h");
      if (num > 0) {
        await player.draw(num);
      }
      await player.changeSkills(["drlt_huairou"], ["drlt_jueyan"]);
    }
  },
  drlt_huairou: {
    audio: 2,
    enable: "phaseUse",
    position: "he",
    filter: (event, player) => player.hasCard((card) => lib.skill.drlt_huairou.filterCard(card, player), lib.skill.drlt_huairou.position),
    filterCard: (card, player) => get.type(card) == "equip" && player.canRecast(card),
    check(card) {
      if (get.position(card) == "e") {
        return 0.5 - get.value(card, get.player());
      }
      if (!get.player().canEquip(card)) {
        return 5;
      }
      return 3 - get.value(card);
    },
    async content(event, trigger, player) {
      await player.recast(event.cards);
    },
    discard: false,
    lose: false,
    delay: false,
    prompt: "重铸一张装备牌",
    ai: {
      order: 10,
      result: {
        player: 1
      }
    }
  },
  drlt_yongsi: {
    audio: 2,
    group: ["drlt_yongsi_1", "drlt_yongsi_2"],
    locked: true,
    subSkill: {
      1: {
        audio: "drlt_yongsi",
        trigger: {
          player: "phaseDrawBegin2"
        },
        forced: true,
        filter(event, player) {
          return !event.numFixed;
        },
        async content(event, trigger, player) {
          trigger.num = game.countGroup();
        }
      },
      2: {
        audio: "drlt_yongsi",
        trigger: {
          player: "phaseUseEnd"
        },
        forced: true,
        filter(event, player) {
          let num = 0;
          player.getHistory("sourceDamage", function(evt) {
            if (evt.getParent("phaseUse") == event) {
              num += evt.num;
            }
          });
          return !num || num > 1;
        },
        async content(event, trigger, player) {
          let numx = 0;
          player.getHistory("sourceDamage", function(evt) {
            if (evt.getParent("phaseUse") == trigger) {
              numx += evt.num;
            }
          });
          if (!numx) {
            const num = player.hp - player.countCards("h");
            if (num > 0) {
              await player.draw(num);
            }
          } else {
            player.addTempSkill("drlt_yongsi1", { player: "phaseDiscardAfter" });
          }
        }
      }
    }
  },
  drlt_yongsi1: {
    mod: {
      maxHandcard(player, num) {
        return num + player.maxHp - 2 * Math.max(0, player.hp);
      }
    }
  },
  drlt_weidi: {
    audio: 2,
    forceaudio: true,
    zhuSkill: true,
    trigger: { player: "phaseDiscardBegin" },
    filter(event, player) {
      if (!player.hasZhuSkill("drlt_weidi")) {
        return false;
      }
      return player.needsToDiscard() > 0 && game.countPlayer(function(current) {
        return current != player && current.group == "qun";
      }) > 0;
    },
    async cost(event, trigger, player) {
      const num = Math.min(
        player.needsToDiscard(),
        game.countPlayer(function(target) {
          return target != player && target.group == "qun";
        })
      );
      if (!num) {
        return;
      }
      event.result = await player.chooseCardTarget({
        prompt: get.prompt(event.skill),
        prompt2: "你可以将" + (num > 1 ? "至多" : "") + get.cnNumber(num) + "张手牌交给等量的其他群势力角色。先按顺序选中所有要给出的手牌，然后再按顺序选择等量的目标角色",
        selectCard: [1, num],
        selectTarget() {
          return ui.selected.cards.length;
        },
        filterTarget(card, player2, target) {
          return target != player2 && target.group == "qun";
        },
        complexSelect: true,
        filterOk() {
          return ui.selected.cards.length == ui.selected.targets.length;
        },
        ai1(card) {
          const player2 = _status.event.player;
          const value = get.value(card, player2, "raw");
          if (game.hasPlayer(function(target) {
            return target != player2 && target.group == "qun" && !ui.selected.targets.includes(target) && get.sgn(value) == get.sgn(get.attitude(player2, target));
          })) {
            return 1 / Math.max(1, get.useful(card));
          }
          return -1;
        },
        ai2(target) {
          const player2 = _status.event.player;
          const card = ui.selected.cards[ui.selected.targets.length];
          if (card && get.value(card, player2, "raw") < 0) {
            return -get.attitude(player2, target);
          }
          return get.attitude(player2, target);
        }
      }).forResult();
      if (event.result.bool) {
        event.result.bool = event.result.cards.length > 0;
      }
    },
    async content(event, trigger, player) {
      const list = [];
      for (let i2 = 0; i2 < event.targets.length; i2++) {
        const target = event.targets[i2];
        const card = event.cards[i2];
        list.push([target, card]);
      }
      await game.loseAsync({
        gain_list: list,
        player,
        cards: event.cards,
        giver: player,
        animate: "giveAuto"
      }).setContent("gaincardMultiple");
    }
  },
  drlt_xiongluan: {
    audio: 2,
    mod: {
      aiOrder(player, card, num) {
        if (num <= 0 || !player.isPhaseUsing() || player.needsToDiscard() || !get.tag(card, "damage")) {
          return;
        }
        return 0;
      },
      aiUseful(player, card, num) {
        if (num <= 0 || !get.tag(card, "damage")) {
          return;
        }
        return num * player.getHp();
      }
    },
    locked: false,
    enable: "phaseUse",
    skillAnimation: true,
    animationColor: "gray",
    limited: true,
    filter(event, player) {
      return !player.isDisabledJudge() || player.hasEnabledSlot();
    },
    filterTarget(card, player, target) {
      return target != player;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const disables = [];
      for (let i2 = 1; i2 <= 5; i2++) {
        for (let j = 0; j < player.countEnabledSlot(i2); j++) {
          disables.push(i2);
        }
      }
      if (disables.length > 0) {
        await player.disableEquip(disables);
      }
      await player.disableJudge();
      const { target } = event;
      player.addTempSkill(event.name + "_effect");
      player.markAuto(event.name + "_effect", [target]);
      target.addTempSkill(event.name + "_ban");
    },
    ai: {
      order: 13,
      result: {
        target: (player, target) => {
          let hs = player.countCards("h", (card) => {
            if (!get.tag(card, "damage") || get.effect(target, card, player, player) <= 0) {
              return 0;
            }
            if (get.name(card, player) === "sha") {
              if (target.getEquip("bagua")) {
                return 0.5;
              }
              if (target.getEquip("rewrite_bagua")) {
                return 0.25;
              }
            }
            return 1;
          }), ts = target.hp + target.hujia + game.countPlayer((current) => {
            if (get.attitude(current, target) > 0) {
              return current.countCards("hs") / 8;
            }
            return 0;
          });
          if (hs >= ts) {
            return -hs;
          }
          return 0;
        }
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        mod: {
          targetInRange(card, player, target) {
            if (player.getStorage("drlt_xiongluan_effect").includes(target)) {
              return true;
            }
          },
          cardUsableTarget(card, player, target) {
            if (player.getStorage("drlt_xiongluan_effect").includes(target)) {
              return true;
            }
          }
        },
        intro: { content: "本回合对$使用牌无距离和次数限制且其不能使用和打出手牌" }
      },
      ban: {
        charlotte: true,
        mark: true,
        mod: {
          cardEnabled2(card, player) {
            if (get.position(card) == "h") {
              return false;
            }
          }
        },
        intro: { content: "本回合不能使用或打出手牌" },
        ai: {
          effect: {
            target(card, player, target) {
              if (!target._drlt_xiongluan2_effect && get.tag(card, "damage")) {
                target._drlt_xiongluan2_effect = true;
                const eff = get.effect(target, card, player, target);
                delete target._drlt_xiongluan2_effect;
                if (eff > 0) {
                  return [1, -999999];
                }
                if (eff < 0) {
                  return 114514;
                }
              }
            }
          }
        }
      }
    }
  },
  drlt_congjian: {
    audio: 2,
    audioname2: { tongyuan: "ocongjian_tongyuan" },
    trigger: { target: "useCardToTargeted" },
    filter(event, player) {
      return get.type(event.card) == "trick" && event.targets.length > 1 && player.countCards("he") > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        filterCard: true,
        position: "he",
        filterTarget(card, player2, target) {
          return player2 != target && _status.event.targets.includes(target);
        },
        ai1(card) {
          const player2 = get.player();
          if (card.name == "du") {
            return 20;
          }
          if (player2.storage.drlt_xiongluan && get.type(card) == "equip") {
            return 15;
          }
          return 6 - get.value(card);
        },
        ai2(target) {
          const player2 = get.player();
          const att = get.attitude(player2, target);
          if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
            if (target.hasSkillTag("nodu")) {
              return 0.1;
            }
            return 1 - att;
          }
          return att - 3;
        },
        prompt: get.prompt2(event.skill),
        targets: trigger.targets
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await player.give(event.cards, target, "give");
      const num = get.type(event.cards[0]) == "equip" ? 2 : 1;
      await player.draw(num);
    }
  },
  drlt_wanglie: {
    locked: false,
    mod: {
      targetInRange(card, player, target, now) {
        if (game.online) {
          if (!player.countUsed()) {
            return true;
          }
        } else {
          const evt = _status.event.getParent("phaseUse");
          if (evt && evt.name == "phaseUse" && player.getHistory("useCard", function(evt2) {
            return evt2.getParent("phaseUse") == evt;
          }).length == 0) {
            return true;
          }
        }
      }
    },
    audio: 2,
    trigger: {
      player: "useCard"
    },
    filter(event, player) {
      return player.isPhaseUsing() && (event.card.name == "sha" || get.type(event.card) == "trick");
    },
    preHidden: true,
    check(event, player) {
      if (["wuzhong", "kaihua", "dongzhuxianji"].includes(event.card.name)) {
        return false;
      }
      player._wanglie_temp = true;
      let eff = 0;
      for (const i2 of event.targets) {
        eff += get.effect(i2, event.card, player, player);
      }
      delete player._wanglie_temp;
      if (eff < 0) {
        return true;
      }
      if (!player.countCards("h", function(card) {
        return player.hasValueTarget(card, null, true);
      })) {
        return true;
      }
      if (get.tag(event.card, "damage") && !player.needsToDiscard() && !player.countCards("h", function(card) {
        return get.tag(card, "damage") && player.hasValueTarget(card, null, true);
      })) {
        return true;
      }
      return false;
    },
    prompt2(event) {
      return "令" + get.translation(event.card) + "不能被响应，然后本阶段不能再使用牌";
    },
    async content(event, trigger, player) {
      trigger.nowuxie = true;
      trigger.directHit.addArray(game.players);
      player.addTempSkill("drlt_wanglie2", "phaseUseAfter");
    },
    ai: {
      pretao: true,
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (tag == "pretao") {
          return true;
        }
        if (player._wanglie_temp) {
          return false;
        }
        player._wanglie_temp = true;
        const bool = (function() {
          if (["wuzhong", "kaihua", "dongzhuxianji"].includes(arg.card.name)) {
            return false;
          }
          if (get.attitude(player, arg.target) > 0 || !player.isPhaseUsing()) {
            return false;
          }
          let cards2 = player.getCards("h", function(card) {
            return card != arg.card && (!arg.card.cards || !arg.card.cards.includes(card));
          });
          let sha = player.getCardUsable("sha");
          if (arg.card.name == "sha") {
            sha--;
          }
          cards2 = cards2.filter(function(card) {
            if (card.name == "sha" && sha <= 0) {
              return false;
            }
            return player.hasValueTarget(card, null, true);
          });
          if (!cards2.length) {
            return true;
          }
          if (!get.tag(arg.card, "damage")) {
            return false;
          }
          if (!player.needsToDiscard() && !cards2.filter(function(card) {
            return get.tag(card, "damage");
          }).length) {
            return true;
          }
          return false;
        })();
        delete player._wanglie_temp;
        return bool;
      }
    }
  },
  drlt_wanglie2: {
    mod: {
      cardEnabled(card, player) {
        return false;
      }
    }
  },
  liangyin: {
    audio: 2,
    group: ["liangyin_1", "liangyin_2"],
    subSkill: {
      1: {
        audio: "liangyin",
        trigger: {
          global: ["loseAfter", "addToExpansionAfter", "cardsGotoSpecialAfter", "loseAsyncAfter"]
        },
        filter(event, player, name) {
          if (event.name == "lose" || event.name == "loseAsync") {
            return event.getlx !== false && event.toStorage == true;
          }
          if (event.name == "cardsGotoSpecial") {
            return !event.notrigger;
          }
          return true;
        },
        async cost(event, trigger, player) {
          const next = player.chooseTarget("是否发动【良姻】令手牌数大于你的一名角色摸一张牌？", function(card, player2, target) {
            return target != player2 && target.countCards("h") > player2.countCards("h");
          });
          next.ai = function(target) {
            const player2 = get.player();
            return get.attitude(player2, target);
          };
          event.result = await next.forResult();
        },
        async content(event, trigger, player) {
          await event.targets[0].draw();
        }
      },
      2: {
        audio: "liangyin",
        trigger: {
          global: "gainAfter"
        },
        filter(event, player) {
          return event.fromStorage == true || game.hasPlayer2(function(current) {
            const evt = event.getl(current);
            return evt && evt.xs && evt.xs.length > 0;
          });
        },
        async cost(event, trigger, player) {
          const next = player.chooseTarget("是否发动【良姻】令手牌数小于你的一名角色弃置一张牌？", function(card, player2, target) {
            return target != player2 && target.countCards("h") < player2.countCards("h") && target.countCards("he") > 0;
          });
          next.ai = function(target) {
            const player2 = get.player();
            return -get.attitude(player2, target);
          };
          event.result = await next.forResult();
        },
        async content(event, trigger, player) {
          await event.targets[0].chooseToDiscard("he", 1, true);
        }
      }
    }
  },
  kongsheng: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard(get.prompt(event.skill), "将任意张牌置于武将牌上", "he", [1, player.countCards("he")], "allowChooseAll").set("ai", function(card) {
        const player2 = get.player();
        if (get.position(card) == "e") {
          return 1 - get.value(card);
        }
        if (card.name == "shan" || card.name == "du" || !player2.hasValueTarget(card)) {
          return 1;
        }
        return 4 - get.value(card);
      }).forResult();
    },
    async content(event, trigger, player) {
      player.addSkill("kongsheng2");
      const next = player.addToExpansion(event.cards, "log", "give", player);
      next.gaintag.add("kongsheng2");
      await next;
    }
  },
  kongsheng_ai: { ai: { reverseOrder: true } },
  kongsheng2: {
    audio: "kongsheng",
    marktext: "箜",
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    trigger: {
      player: "phaseJieshuBegin"
    },
    sourceSkill: "kongsheng",
    filter(event, player) {
      return player.getExpansions("kongsheng2").length > 0;
    },
    forced: true,
    charlotte: true,
    async content(event, trigger, player) {
      player.addTempSkill("kongsheng_ai", "kongsheng2After");
      while (true) {
        const cards3 = player.getExpansions("kongsheng2").filter(function(i2) {
          return get.type(i2, null, false) == "equip" && player.hasUseTarget(i2);
        });
        if (cards3.length > 0) {
          let [card] = cards3;
          if (cards3.length > 1) {
            const result = await player.chooseButton(true, ["选择要使用的装备牌", cards3]).set("ai", function(button) {
              return get.order(button.link);
            }).forResult();
            if (!result.bool) {
              continue;
            }
            [card] = result.links;
          }
          await player.chooseUseTarget(card, true);
        } else {
          break;
        }
      }
      const cards2 = player.getExpansions("kongsheng2");
      if (cards2.length) {
        await player.gain(cards2, "gain2");
      }
    }
  },
  nzry_juzhan: {
    audio: ["nzry_juzhan_11.mp3", "nzry_juzhan_12.mp3"],
    mark: true,
    zhuanhuanji: true,
    marktext: "☯",
    intro: {
      content(storage, player, skill) {
        if (storage) {
          return "当你使用【杀】指定一名角色为目标后，你可以获得其一张牌，然后你本回合内不能再对其使用牌";
        }
        return "当你成为其他角色【杀】的目标后，你可以与其各摸一张牌，然后其本回合内不能再对你使用牌";
      }
    },
    trigger: {
      player: "useCardToPlayered",
      target: "useCardToTargeted"
    },
    filter(event, player) {
      if (event.card.name != "sha") {
        return false;
      }
      if (!player.storage.nzry_juzhan) {
        return player != event.player;
      }
      return player == event.player && event.target.countGainableCards(player, "he");
    },
    logTarget(event, player) {
      return player.storage.nzry_juzhan ? event.target : event.player;
    },
    check(event, player) {
      const target = get.info("nzry_juzhan").logTarget(event, player);
      return get.attitude(player, target) < 0;
    },
    prompt2(event, player) {
      const target = get.info("nzry_juzhan").logTarget(event, player);
      return player.storage.nzry_juzhan ? `获得${get.translation(target)}一张牌，然后你本回合内不能再对其使用牌` : `与${get.translation(target)}各摸一张牌，然后其本回合内不能再对你使用牌`;
    },
    async content(event, trigger, player) {
      const { name: skill } = event, target = get.info(skill).logTarget(trigger, player);
      player.changeZhuanhuanji(skill);
      const storage = player.storage[skill];
      const list = [player, target];
      if (storage) {
        await game.asyncDraw([player, target].sortBySeat());
        await game.delayx();
        list.reverse();
      } else {
        await player.gainPlayerCard(target, "he", true);
      }
      list[0].addTempSkill(skill + "_effect");
      list[0].markAuto(skill + "_effect", [list[1]]);
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        mod: {
          playerEnabled(card, player, target) {
            if (player.getStorage("nzry_juzhan_effect").includes(target)) {
              return false;
            }
          }
        },
        intro: { content: "本回合不能对$使用牌" }
      }
    }
  },
  nzry_feijun: {
    init: (player) => {
      if (!Array.isArray(player.storage.nzry_feijun)) {
        player.storage.nzry_feijun = [];
      }
    },
    intro: {
      content(storage) {
        if (!storage || !storage.length) {
          return "尚未发动";
        }
        const str = get.translation(storage);
        return "已对" + str + "发动过〖飞军〗";
      }
    },
    mark: true,
    enable: "phaseUse",
    usable: 1,
    position: "he",
    audio: 2,
    filter(event, player) {
      return game.hasPlayer(function(current) {
        return current.countCards("h") >= player.countCards("h");
      }) || game.hasPlayer(function(current) {
        return current.countCards("e") >= player.countCards("e");
      }) > 0;
    },
    filterCard: true,
    check(card) {
      return 5 - get.value(card);
    },
    async content(event, trigger, player) {
      const list = [];
      if (game.hasPlayer(function(current) {
        return current.countCards("h") > player.countCards("h");
      })) {
        list.push("令一名手牌数大于你的角色交给你一张牌");
      }
      if (game.hasPlayer(function(current) {
        return current.countCards("e") > player.countCards("e");
      }) > 0) {
        list.push("令一名装备区内牌数大于你的角色弃置一张装备牌");
      }
      if (list.length == 0) {
        return;
      }
      let index;
      if (list.length < 2) {
        if (game.hasPlayer(function(current) {
          return current.countCards("h") > player.countCards("h");
        })) {
          index = 0;
        } else {
          index = 1;
        }
      } else {
        ({ index } = await player.chooseControl().set("ai", function() {
          if (game.hasPlayer(function(current) {
            return current.countCards("h") > player.countCards("h") && get.attitude(player, current) < 0;
          })) {
            return 0;
          }
          return 1;
        }).set("choiceList", list).forResult());
      }
      let result;
      if (index == 0) {
        result = await player.chooseTarget(function(card, player2, target2) {
          return target2 != player2 && target2.countCards("h") > player2.countCards("h");
        }, "选择一名手牌数大于你的角色").set("ai", function(target2) {
          return -get.attitude(player, target2);
        }).forResult();
      } else {
        const next = player.chooseTarget(function(card, player2, target2) {
          return target2.countCards("e") > player2.countCards("e") && target2 != player2;
        }, "选择一名装备区里牌数大于你的角色");
        next.ai = function(target2) {
          return -get.attitude(player, target2);
        };
        result = await next.forResult();
      }
      if (!result.bool) {
        return;
      }
      const target = result.targets[0];
      const list2 = player.getStorage("nzry_feijun");
      if (!list2.includes(target)) {
        event._nzry_binglve = true;
        player.markAuto("nzry_feijun", [target]);
      }
      player.line(target, "green");
      if (index == 0) {
        const result2 = await target.chooseCard("he", true, "选择一张牌交给" + get.translation(player)).set("ai", function(card) {
          return 6 - get.value(card);
        }).forResult();
        if (result2.bool) {
          target.give(result2.cards, player);
        }
      } else {
        await target.chooseToDiscard("he", true, { type: "equip" }, "请弃置一张装备牌");
      }
    },
    ai: {
      order: 11,
      result: {
        player(player) {
          if (game.hasPlayer(function(current) {
            return (current.countCards("h") > player.countCards("h") || current.countCards("e") > player.countCards("e")) && get.attitude(player, current) < 0 && player.getStorage("nzry_feijun").includes(current);
          }) || game.hasPlayer(function(current) {
            return current.countCards("h") > player.countCards("h") && get.attitude(player, current) < 0;
          }) || player.countCards("h") >= 2 && game.hasPlayer(function(current) {
            return current.countCards("e") > player.countCards("e") && get.attitude(player, current) < 0;
          })) {
            return 1;
          }
        }
      }
    }
  },
  nzry_binglve: {
    audio: 2,
    trigger: { player: "nzry_feijunAfter" },
    forced: true,
    filter(event, player) {
      return event._nzry_binglve == true;
    },
    async content(event, trigger, player) {
      await player.draw(2);
    },
    ai: { combo: "nzry_feijun" }
  },
  nzry_huaiju_ai: {
    charlotte: true,
    ai: {
      filterDamage: true,
      skillTagFilter(player, tag, arg) {
        if (!player.hasMark("nzry_huaiju")) {
          return false;
        }
        if (!game.hasPlayer(function(current) {
          return current.hasSkill("tachibana_effect");
        })) {
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
  nzry_huaiju: {
    marktext: "橘",
    intro: {
      name: "怀橘",
      name2: "橘",
      content: "当前有#个“橘”"
    },
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
      player.addMark("nzry_huaiju", 3);
      player.addSkill("nzry_huaiju_ai");
    },
    group: ["tachibana_effect"]
  },
  //没错 这是个橘
  tachibana_effect: {
    audio: "nzry_huaiju",
    sourceSkill: "nzry_huaiju",
    trigger: {
      global: ["damageBegin4", "phaseDrawBegin2"]
    },
    forced: true,
    filter(event, player) {
      return event.player.hasMark("nzry_huaiju") && (event.name == "damage" || !event.numFixed);
    },
    async content(event, trigger, player) {
      player.line(trigger.player, "green");
      if (trigger.name == "damage") {
        trigger.cancel();
        trigger.player.removeMark("nzry_huaiju", 1);
      } else {
        trigger.num++;
      }
    }
  },
  nzry_yili: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    async cost(event, trigger, player) {
      const next = player.chooseTarget(get.prompt(event.skill), "移去一个【橘】或失去1点体力，然后令一名其他角色获得一个【橘】", function(card, player2, target) {
        return target != player2;
      });
      next.ai = function(target) {
        const player2 = _status.event.player;
        if (player2.storage.nzry_huaiju > 2 || player2.hp > 2) {
          return get.attitude(player2, target);
        }
        return -1;
      };
      event.result = await next.forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      let index = 0;
      if (player.hasMark("nzry_huaiju")) {
        ({ index } = await player.chooseControl().set("choiceList", ["失去1点体力", "移去一个“橘”"]).set("ai", function() {
          if (player.hp > 2) {
            return 0;
          }
          return 1;
        }).forResult());
      }
      if (index == 1) {
        player.removeMark("nzry_huaiju", 1);
      } else {
        await player.loseHp();
      }
      target.addMark("nzry_huaiju", 1);
      target.addSkill("nzry_huaiju_ai");
    },
    ai: {
      combo: "nzry_huaiju"
    }
  },
  nzry_zhenglun: {
    audio: 2,
    trigger: {
      player: "phaseDrawBefore"
    },
    filter(event, player) {
      return !player.hasMark("nzry_huaiju");
    },
    check(event, player) {
      return player.countCards("h") >= 2 || player.skipList.includes("phaseUse");
    },
    async content(event, trigger, player) {
      trigger.cancel();
      player.addMark("nzry_huaiju", 1);
    },
    ai: {
      combo: "nzry_huaiju"
    }
  },
  nzry_kuizhu: {
    audio: 2,
    trigger: {
      player: "phaseDiscardAfter"
    },
    filter(event, player) {
      const cards2 = [];
      player.getHistory("lose", function(evt) {
        if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) {
          cards2.addArray(evt.cards2);
        }
      });
      return cards2.length > 0;
    },
    async cost(event, trigger, player) {
      const cards2 = [];
      player.getHistory("lose", function(evt) {
        if (evt.type == "discard" && evt.getParent("phaseDiscard") == trigger) {
          cards2.addArray(evt.cards2);
        }
      });
      event.num = cards2.length;
      event.str1 = "令至多" + event.num + "名角色摸一张牌";
      event.str2 = "对任意名体力值之和为" + event.num + "的角色造成1点伤害";
      const result = await player.chooseControl("cancel2").set("ai", function() {
        const player2 = get.player();
        const { num } = get.event().getParent();
        if (game.countPlayer(function(current) {
          return get.attitude(player2, current) < 0 && current.hp == num;
        }) > 0 && num <= 3) {
          return 1;
        }
        return 0;
      }).set("choiceList", [event.str1, event.str2]).set("prompt", "是否发动【溃诛】？").forResult();
      if (result.control == "cancel2") {
        return;
      }
      if (result.index == 1) {
        event.result = await player.chooseTarget("请选择〖溃诛〗造成伤害的目标", function(card, player2, target) {
          const num = ui.selected.targets.map((t) => t.hp).reduce((a, b) => a + b, 0);
          return num + target.hp <= _status.event.num;
        }).set("filterOk", function() {
          const num = ui.selected.targets.map((t) => t.hp).reduce((a, b) => a + b);
          return num == _status.event.num;
        }).set("ai", function(target) {
          const player2 = get.player();
          if (ui.selected.targets[0] != void 0) {
            return -1;
          }
          return get.attitude(player2, target) < 0;
        }).set("complexTarget", true).set("promptbar", "none").set("num", event.num).set("selectTarget", [1, Infinity]).forResult();
        event.result.cost_data = "damage";
      } else {
        const next = player.chooseTarget("请选择〖溃诛〗摸牌的目标", [1, event.num]);
        next.ai = function(target) {
          const player2 = get.player();
          return get.attitude(player2, target);
        };
        event.result = await next.forResult();
      }
    },
    async content(event, trigger, player) {
      const targets = event.targets.sortBySeat();
      if (event.cost_data == "damage") {
        await Promise.all(targets.map((target) => target.damage()));
      } else {
        game.asyncDraw(targets);
      }
    }
  },
  rechezheng: {
    audio: "nzry_zhizheng",
    trigger: { source: "damageBegin2" },
    filter(event, player) {
      return player.isPhaseUsing() && !player.inRangeOf(event.player);
    },
    forced: true,
    logTarget: "player",
    async content(event, trigger, player) {
      trigger.cancel();
    },
    ai: {
      effect: {
        player(card, player, target) {
          if (target && get.tag(card, "damage") && !player.inRangeOf(target)) {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  nzry_zhizheng: {
    audio: 2,
    //mod:{
    //	playerEnabled:function(card,player,target){
    //		const info=get.info(card);
    //		if(target!=player&&(!info||!info.singleCard||!ui.selected.targets.length)&&player.isPhaseUsing()&&!target.inRange(player)) return false;
    //	},
    //},
    trigger: {
      player: "phaseUseEnd"
    },
    forced: true,
    filter(event, player) {
      return player.getHistory("useCard", function(evt) {
        return evt.getParent("phaseUse") == event;
      }).length < game.countPlayer(function(current) {
        return current != player && !current.inRange(player);
      }) && game.hasPlayer(function(target) {
        return target != player && !target.inRange(player) && target.countDiscardableCards(player, "he");
      });
    },
    async content(event, trigger, player) {
      const next = player.chooseTarget("请选择〖掣政〗的目标", "弃置一名攻击范围内不包含你的角色的一张牌", true, function(card, player2, target) {
        return target != player2 && !target.inRange(player2) && target.countDiscardableCards(player2, "he");
      });
      next.ai = function(target) {
        return -get.attitude(player, target);
      };
      const result = await next.forResult();
      if (result.bool) {
        player.line(result.targets);
        player.discardPlayerCard(result.targets[0], "he", 1, true);
      }
    },
    group: "rechezheng"
  },
  nzry_lijun: {
    global: "nzry_lijun1",
    audio: "nzry_lijun1",
    zhuSkill: true
  },
  nzry_lijun2: {
    mod: {
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return num + player.countMark("nzry_lijun2");
        }
      }
    },
    charlotte: true,
    onremove: true
  },
  nzry_lijun1: {
    audio: 2,
    //forceaudio:true,
    trigger: {
      player: "useCardAfter"
    },
    log: false,
    // 实际发动者是主公，所以给牌的人不log喵
    filter(event, player) {
      if (event.card.name != "sha" || player.group != "wu") {
        return false;
      }
      if (player.hasSkill("nzry_lijun2")) {
        return false;
      }
      if (!player.isPhaseUsing()) {
        return false;
      }
      if (!game.hasPlayer(function(target) {
        return player != target && target.hasZhuSkill("nzry_lijun", player);
      })) {
        return false;
      }
      for (let i2 = 0; i2 < event.cards.length; i2++) {
        if (get.position(event.cards[i2], true) == "o") {
          return true;
        }
      }
      return false;
    },
    async cost(event, trigger, player) {
      const list = game.filterPlayer(function(target) {
        return player != target && target.hasZhuSkill("nzry_lijun", player);
      });
      const next = player.chooseTarget(get.prompt("nzry_lijun"), "将" + get.translation(trigger.cards) + "交给" + get.translation(list) + (list.length > 1 ? "中的一人" : ""), function(card, player2, target) {
        return player2 != target && target.hasZhuSkill("nzry_lijun", player2);
      });
      next.ai = function(target) {
        return get.attitude(_status.event.player, target);
      };
      event.result = await next.forResult();
    },
    async content(event, trigger, player) {
      player.addTempSkill("nzry_lijun2", "phaseUseEnd");
      const [zhu] = event.targets;
      player.line(zhu, "green");
      zhu.logSkill("nzry_lijun");
      const list = trigger.cards.filter(function(card) {
        return get.position(card, true) == "o";
      });
      const next = zhu.gain(list, "gain2");
      next.giver = player;
      await next;
      const result = await zhu.chooseBool().set("ai", function() {
        if (get.attitude(zhu, player) > 0) {
          return true;
        }
        return false;
      }).set("prompt", "是否令" + get.translation(player) + "摸一张牌？").forResult();
      if (!result.bool) {
        return;
      }
      await player.draw();
      player.addMark("nzry_lijun2", 1, false);
    }
  },
  nzry_chenglve: {
    audio: 2,
    mark: true,
    zhuanhuanji: true,
    marktext: "☯",
    intro: {
      content(storage, player, skill) {
        const num = storage ? 2 : 1;
        return `出牌阶段限一次，你可以摸${get.cnNumber(num)}张牌，然后弃置${get.cnNumber(3 - num)}张手牌。若如此做，直到本回合结束，你使用与弃置牌花色相同的牌无距离和次数限制`;
      }
    },
    enable: "phaseUse",
    usable: 1,
    async content(event, trigger, player) {
      player.changeZhuanhuanji("nzry_chenglve");
      const num = player.storage.nzry_chenglve ? 1 : 2;
      await player.draw(num);
      if (!player.hasCard((card) => lib.filter.cardDiscardable(card, player, "nzry_chenglve"), "h")) {
        return;
      }
      await game.delayx();
      const { bool, cards: cards2 } = await player.chooseToDiscard(true, "h", 3 - num).set("ai", (card) => {
        const player2 = get.player(), effect = player2.getStorage("nzry_chenglve_effect");
        const cards3 = player2.getCards("h").filter((i2) => get.tag(i2, "damage") && get.type(i2) != "delay" && player2.hasValueTarget(i2, true, false)), map = {};
        for (const cardx of cards3) {
          const suit = get.suit(cardx, player2);
          if (typeof map[suit] != "number") {
            map[suit] = 0;
          }
          map[suit]++;
        }
        const list = [];
        for (let i2 in map) {
          if (map[i2] > 0) {
            list.push([i2, map[i2]]);
          }
        }
        list.sort((a, b) => b[1] - a[1]);
        if (effect.includes(get.suit(card, player2))) {
          return 0;
        }
        if (list.some((i2) => i2[0] == get.suit(card, player2)) && !player2.hasUseTarget(card, false)) {
          return 10;
        }
        if (player2.storage.nzry_chenglve && ui.selected.cards.length && !ui.selected.cards.some((i2) => get.suit(i2) == get.suit(card, player2))) {
          return 2;
        }
        return 6 - get.value(card);
      }).forResult();
      if (bool) {
        const effect = "nzry_chenglve_effect";
        player.addTempSkill(effect);
        player.markAuto(effect, cards2.map((card) => get.suit(card, player)).unique());
        player.storage[effect].sort((a, b) => lib.suits.indexOf(b) - lib.suits.indexOf(a));
        player.addTip(effect, get.translation(effect) + player.getStorage(effect).reduce((str, suit) => str + get.translation(suit), ""));
      }
    },
    ai: {
      order(item, player) {
        if (player.countCards("h", (card) => get.tag(card, "damage") && get.type(card) != "delay" && player.hasValueTarget(card, true, false)) > 2) {
          return get.order({ name: "sha" }) + 0.14;
        }
        return 2.7;
      },
      result: {
        player(player) {
          if (!player.storage.nzry_chenglve && player.countCards("h") < 3) {
            return 0;
          }
          return 1;
        }
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove(player, skill) {
          delete player.storage[skill];
          player.removeTip(skill);
        },
        mod: {
          cardUsable(card, player) {
            const suit = get.suit(card);
            if (suit == "unsure" || player.getStorage("nzry_chenglve_effect").includes(suit)) {
              return Infinity;
            }
          },
          targetInRange(card, player) {
            const suit = get.suit(card);
            if (suit == "unsure" || player.getStorage("nzry_chenglve_effect").includes(suit)) {
              return true;
            }
          }
        },
        marktext: "略",
        intro: { content: `本回合使用$花色的牌无距离和次数限制` }
      }
    }
  },
  nzry_shicai: {
    audio: "nzry_shicai_2",
    locked: false,
    mod: {
      aiOrder(player, card, num) {
        if (num <= 0 || player.nzry_shicai_aiOrder || get.itemtype(card) !== "card" || player.hasSkillTag("abnormalDraw")) {
          return num;
        }
        let type = get.type2(card, false);
        if (player.hasHistory("useCard", (evt) => {
          return get.type2(evt.card, false) == type;
        })) {
          return num;
        }
        player.nzry_shicai_aiOrder = true;
        let val = player.getUseValue(card, true, true);
        delete player.nzry_shicai_aiOrder;
        return 20 * val;
      }
    },
    trigger: { player: ["useCardAfter", "useCardToTargeted"] },
    prompt2(event, player) {
      const cards2 = event.cards.filterInD("oe");
      return "你可以将" + get.translation(cards2) + (cards2.length > 1 ? "以任意顺序" : "") + "置于牌堆顶，然后摸一张牌";
    },
    filter(event, player) {
      if (!event.cards.someInD()) {
        return false;
      }
      let evt = event, type = get.type2(evt.card, false);
      if (event.name == "useCardToTargeted") {
        if (type != "equip" || player != event.target) {
          return false;
        }
        evt = evt.getParent();
      } else {
        if (type == "equip") {
          return false;
        }
      }
      return !player.hasHistory(
        "useCard",
        (evtx) => {
          return evtx != evt && get.type2(evtx.card, false) == type;
        },
        evt
      );
    },
    check(event, player) {
      if (get.type(event.card) == "equip") {
        if (get.subtype(event.card) == "equip6") {
          return true;
        }
        if (get.equipResult(player, player, event.card) <= 0) {
          return true;
        }
        const eff1 = player.getUseValue(event.card);
        const subtype = get.subtype(event.card);
        return player.countCards("h", function(card) {
          return get.subtype(card) == subtype && player.getUseValue(card) >= eff1;
        }) > 0;
      }
      return true;
    },
    async content(event, trigger, player) {
      let cards2 = trigger.cards.filterInD();
      if (cards2.length > 1) {
        const result = await player.chooseToMove("恃才：将牌按顺序置于牌堆顶", true).set("list", [["牌堆顶", cards2]]).set("reverse", _status.currentPhase?.next && get.attitude(player, _status.currentPhase.next) > 0).set("processAI", function(list) {
          const cards3 = list[0][1].slice(0);
          cards3.sort(function(a, b) {
            return (_status.event.reverse ? 1 : -1) * (get.value(b) - get.value(a));
          });
          return [cards3];
        }).forResult();
        if (!result.bool) {
          return;
        }
        cards2 = result.moved[0];
      }
      cards2.reverse();
      await game.cardsGotoPile(cards2, "insert");
      game.log(player, "将", cards2, "置于了牌堆顶");
      await player.draw();
    },
    subSkill: { 2: { audio: 2 } },
    ai: {
      reverseOrder: true,
      skillTagFilter(player) {
        if (player.getHistory("useCard", function(evt) {
          return get.type(evt.card) == "equip";
        }).length > 0) {
          return false;
        }
      },
      effect: {
        target_use(card, player, target) {
          if (player == target && get.type(card) == "equip" && !player.getHistory("useCard", function(evt) {
            return get.type(evt.card) == "equip";
          }).length) {
            return [1, 3];
          }
        }
      }
    }
  },
  nzry_cunmu: {
    audio: 2,
    audioname: ["ol_pengyang"],
    trigger: {
      player: "drawBegin"
    },
    forced: true,
    async content(event, trigger, player) {
      trigger.bottom = true;
    },
    ai: {
      abnormalDraw: true,
      skillTagFilter(player, tag, arg) {
        if (tag === "abnormalDraw") {
          return !arg || arg === "bottom";
        }
      }
    }
  },
  nzry_mingren: {
    audio: "nzry_mingren_1",
    drawNum: 2,
    audioname: ["sb_yl_luzhi"],
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    locked: false,
    filter(event, player) {
      return (event.name != "phase" || game.phaseNumber == 0) && !player.getExpansions("nzry_mingren").length;
    },
    async content(event, trigger, player) {
      await player.draw(get.info(event.name).drawNum || 2);
      if (!player.countCards("h")) {
        return;
      }
      const result = await player.chooseCard("h", "将一张手牌置于武将牌上，称为“任”", true).set("ai", function(card) {
        return 6 - get.value(card);
      }).forResult();
      if (result.bool) {
        const next = player.addToExpansion(result.cards[0], player, "give", "log");
        next.gaintag.add("nzry_mingren");
        await next;
      }
    },
    marktext: "任",
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
    group: ["nzry_mingren_1"],
    ai: { notemp: true },
    subSkill: {
      1: {
        audio: 2,
        audioname: ["sb_yl_luzhi"],
        trigger: { player: "phaseJieshuBegin" },
        filter(event, player) {
          return player.countCards("h") > 0 && player.getExpansions("nzry_mingren").length > 0;
        },
        async cost(event, trigger, player) {
          event.result = await player.chooseCard("h", get.prompt(event.skill), "选择一张手牌替换“任”（" + get.translation(player.getExpansions("nzry_mingren")[0]) + "）").set("ai", function(card) {
            const player2 = _status.event.player;
            const color = get.color(card);
            if (color == get.color(player2.getExpansions("nzry_mingren")[0])) {
              return false;
            }
            let num = 0;
            const list = [];
            player2.countCards("h", function(cardx) {
              if (cardx != card || get.color(cardx) != color) {
                return false;
              }
              if (list.includes(cardx.name)) {
                return false;
              }
              list.push(cardx.name);
              switch (cardx.name) {
                case "wuxie":
                  num += game.countPlayer() / 2.2;
                  break;
                case "caochuan":
                  num += 1.1;
                  break;
                case "shan":
                  num += 1;
                  break;
              }
            });
            return num * (30 - get.value(card));
          }).forResult();
        },
        async content(event, trigger, player) {
          const card = player.getExpansions("nzry_mingren")[0];
          const next = player.addToExpansion(event.cards[0], "log", "give", player);
          next.gaintag.add("nzry_mingren");
          await next;
          if (card) {
            await player.gain(card, "gain2");
          }
        }
      }
    }
  },
  nzry_zhenliang: {
    audio: ["nzry_zhenliang_11.mp3", "nzry_zhenliang_12.mp3"],
    drawNum: 1,
    mark: true,
    zhuanhuanji: true,
    marktext: "☯",
    intro: {
      content(storage) {
        if (storage) {
          return "当你于回合外使用或打出的牌结算完成后，若此牌与“任”颜色相同，则你可以令一名角色摸一张牌。";
        }
        return "出牌阶段限一次，你可以弃置一张与“任”颜色相同的牌并对攻击范围内的一名角色造成1点伤害。";
      }
    },
    enable: "phaseUse",
    trigger: {
      player: ["useCardAfter", "respondAfter"]
    },
    filter(event, player) {
      const cards2 = player.getExpansions("nzry_mingren");
      if (!cards2.length) {
        return false;
      }
      if (event.name == "chooseToUse") {
        if (player.storage.nzry_zhenliang || player.hasSkill("nzry_zhenliang_used", null, null, false)) {
          return false;
        }
        const color = get.color(cards2[0]);
        if (!player.countCards("he", (card) => get.color(card) == color)) {
          return false;
        }
        return game.hasPlayer((current) => player.inRange(current));
      } else {
        if (_status.currentPhase == player || !player.storage.nzry_zhenliang) {
          return false;
        }
        return get.color(event.card) == get.color(cards2[0]);
      }
    },
    position: "he",
    filterCard(card, player) {
      return get.color(card) == get.color(player.getExpansions("nzry_mingren")[0]);
    },
    filterTarget(card, player, target) {
      return player.inRange(target);
    },
    check(card) {
      return 6.5 - get.value(card);
    },
    prompt: "弃置一张与“任”颜色相同的牌，并对攻击范围内的一名角色造成1点伤害。",
    async cost(event, trigger, player) {
      const skillName = event.name.slice(0, -5), num = get.info(skillName).drawNum;
      event.result = await player.chooseTarget(get.prompt(skillName), `令${(num > 1 ? "至多" : "") + get.cnNumber(num)}名角色${num > 1 ? "各" : ""}摸${get.cnNumber(num)}张牌`).set("selectTarget", [1, num]).set("ai", (target) => {
        const player2 = get.player();
        return get.effect(target, { name: "draw" }, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const skill = event.name;
      player.changeZhuanhuanji(skill);
      if (!trigger) {
        const target = event.target;
        player.addTempSkill(skill + "_used", "phaseUseAfter");
        await target.damage("nocard");
      } else {
        const targets = event.targets;
        if (targets.length === 1) {
          await targets[0].draw(get.info(skill).drawNum);
        } else {
          await game.asyncDraw(targets, get.info(skill).drawNum);
          await game.delayx();
        }
      }
    },
    ai: {
      order: 5,
      result: {
        player(player, target) {
          return get.damageEffect(target, player, player);
        }
      },
      combo: "nzry_mingren"
    },
    subSkill: { used: { charlotte: true } }
  },
  nzry_jianxiang: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    filter(event, player) {
      return event.player != player && game.hasPlayer((current) => current.isMinHandcard());
    },
    async cost(event, trigger, player) {
      const next = player.chooseTarget(get.prompt(event.skill), "令场上手牌数最少的一名角色摸一张牌", function(card, player2, target) {
        return target.isMinHandcard();
      });
      next.ai = function(target) {
        const player2 = get.player();
        return get.attitude(player2, target);
      };
      event.result = await next.forResult();
    },
    async content(event, trigger, player) {
      await event.targets[0].draw();
    }
  },
  nzry_shenshi: {
    audio: ["nzry_shenshi_11.mp3", "nzry_shenshi_12.mp3"],
    mark: true,
    locked: false,
    zhuanhuanji: true,
    marktext: "☯",
    intro: {
      content(storage, player, skill) {
        if (storage) {
          return "其他角色对你造成伤害后，你可以观看该角色的手牌，然后交给其一张牌，当前角色回合结束时，若此牌仍在该角色的手牌区或装备区，你将手牌摸至四张";
        }
        return "出牌阶段限一次，你可以将一张牌交给一名手牌数最多的角色，然后对其造成1点伤害，若该角色因此死亡，则你可以令一名角色将手牌摸至四张";
      }
    },
    enable: "phaseUse",
    trigger: { global: "damageSource" },
    filter(event, player) {
      if (!player.countCards("he")) {
        return false;
      }
      if (event.name == "chooseToUse") {
        return !player.storage.nzry_shenshi && !player.hasSkill("nzry_shenshi_used", null, null, false) && game.hasPlayer((current) => get.info("nzry_shenshi").filterTarget(null, player, current));
      }
      return event.source?.isIn() && event.source != player && event.player == player && player.storage.nzry_shenshi;
    },
    discard: false,
    line: true,
    lose: false,
    delay: false,
    position: "he",
    filterCard: true,
    filterTarget(card, player, target) {
      return target != player && !game.hasPlayer((current) => current != player && current.countCards("h") > target.countCards("h"));
    },
    check(card) {
      if (get.position(card) == "h") {
        return 1;
      }
      return 5 - get.value(card);
    },
    async cost(event, trigger, player) {
      const { source } = trigger;
      const { bool } = await player.chooseBool(get.prompt(event.name.slice(0, -5), source)).set("choice", source.countCards("h") <= source.getHp() && player.countCards("h") < 4 && !source.hasSkillTag("nogain") || get.attitude(player, source) > 0).set("prompt2", "其他角色对你造成伤害后，你可以观看该角色的手牌，然后交给其一张牌，当前角色回合结束时，若此牌仍在该角色的手牌区或装备区，你将手牌摸至四张").forResult();
      event.result = {
        bool,
        targets: [source]
      };
    },
    prompt: "出牌阶段限一次，你可以将一张牌交给一名手牌数最多的角色，然后对其造成1点伤害，若该角色因此死亡，则你可以令一名角色将手牌摸至四张",
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.changeZhuanhuanji(event.name);
      if (!trigger) {
        player.addTempSkill(event.name + "_used", "phaseUseAfter");
        await player.give(event.cards, target);
        await target.damage("nocard");
        if (!game.getGlobalHistory("everything", (evt) => {
          if (evt.name != "die" || evt.player != target) {
            return false;
          }
          return evt.reason?.getParent() == event;
        }).length || !game.hasPlayer((current) => current.countCards("h") < 4)) {
          return;
        }
        const result = await player.chooseTarget("令一名角色将手牌摸至四张", (card, player2, target2) => {
          return target2.countCards("h") < 4;
        }).set("ai", (target2) => {
          return get.attitude(player, target2);
        }).forResult();
        if (result.bool) {
          player.line(result.targets);
          await result.targets[0].drawTo(4);
        }
      } else {
        await player.viewHandcards(target);
        const result = await player.chooseToGive(target, "he", true, `交给${get.translation(target)}一张牌`).set("ai", (card) => {
          return 5 - get.value(card);
        }).forResult();
        if (result.bool) {
          const card = result.cards[0];
          target.addGaintag(result.cards, event.name);
          player.when({ global: "phaseJieshuBegin" }).filter((evt) => evt.getParent() == trigger.getParent("phase", true) && target.getCards("he").includes(card) && player.countCards("h") < 4).step(async () => {
            target.removeGaintag(event.name);
            await player.drawTo(4);
          });
        }
      }
    },
    ai: {
      order: 1,
      result: {
        target(player, target) {
          return get.damageEffect(target, player, target);
        }
      }
    },
    subSkill: { used: { charlotte: true } }
  },
  xinjushou: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    async content(event, trigger, player) {
      await player.draw(4);
      await player.turnOver();
      const result = await player.chooseCard("h", true, "弃置一张手牌，若以此法弃置的是装备牌，则你改为使用之").set("ai", function(card) {
        if (get.type(card) == "equip") {
          return 5 - get.value(card);
        }
        return -get.value(card);
      }).set("filterCard", lib.filter.cardDiscardable).forResult();
      if (result.bool && result.cards.length) {
        const card = result.cards[0];
        if (get.type(card) == "equip" && player.hasUseTarget(card)) {
          player.chooseUseTarget(card, true, "nopopup");
        } else {
          player.discard(card);
        }
      }
    }
  },
  xinjiewei: {
    audio: 2,
    enable: "chooseToUse",
    filterCard: true,
    position: "e",
    viewAs: { name: "wuxie" },
    filter(event, player) {
      return player.countCards("e") > 0;
    },
    viewAsFilter(player) {
      return player.countCards("e") > 0;
    },
    prompt: "将一张装备区内的牌当无懈可击使用",
    check(card) {
      return 8 - get.equipValue(card);
    },
    threaten: 1.2,
    group: "xinjiewei_move",
    subSkill: {
      move: {
        trigger: { player: "turnOverEnd" },
        audio: "jiewei",
        filter(event, player) {
          return !player.isTurnedOver() && player.canMoveCard();
        },
        async cost(event, trigger, player) {
          event.result = await player.chooseToDiscard("he", get.prompt("xinjiewei"), "弃置一张牌并移动场上的一张牌", lib.filter.cardDiscardable).set("ai", function(card) {
            if (!_status.event.check) {
              return 0;
            }
            return 7 - get.value(card);
          }).set("check", player.canMoveCard(true)).forResult();
        },
        async content(event, trigger, player) {
          await player.moveCard(true);
        }
      }
    }
  },
  jianchu: {
    audio: 2,
    audioname: ["re_pangde"],
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return event.card.name == "sha" && event.target.countDiscardableCards(player, "he") > 0;
    },
    preHidden: true,
    check(event, player) {
      return get.attitude(player, event.target) <= 0;
    },
    logTarget: "target",
    async content(event, trigger, player) {
      const result = await player.discardPlayerCard(trigger.target, get.prompt("jianchu", trigger.target), true).set("ai", function(button) {
        if (!_status.event.att) {
          return 0;
        }
        if (get.position(button.link) == "e") {
          if (get.subtype(button.link) == "equip2") {
            return 5 * get.value(button.link);
          }
          return get.value(button.link);
        }
        return 1;
      }).set("att", get.attitude(player, trigger.target) <= 0).forResult();
      if (result.bool && result.links && result.links.length) {
        if (get.type(result.links[0], null, result.links[0].original == "h" ? player : false) == "equip") {
          trigger.getParent().directHit.add(trigger.target);
        } else if (trigger.cards) {
          const list = [];
          for (let i2 = 0; i2 < trigger.cards.length; i2++) {
            if (get.position(trigger.cards[i2], true) == "o") {
              list.push(trigger.cards[i2]);
            }
          }
          if (list.length) {
            trigger.target.gain(list, "gain2", "log");
          }
        }
      }
    },
    ai: {
      unequip_ai: true,
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (tag == "directHit_ai") {
          return arg.card.name == "sha" && arg.target.countCards("e", function(card) {
            return get.value(card) > 1;
          }) > 0;
        }
        if (arg && arg.name == "sha" && arg.target.getEquip(2)) {
          return true;
        }
        return false;
      }
    }
  },
  redimeng: {
    audio: "dimeng",
    enable: "phaseUse",
    usable: 1,
    position: "he",
    filterCard() {
      if (ui.selected.targets.length == 2) {
        return false;
      }
      return true;
    },
    selectCard: [0, Infinity],
    selectTarget: 2,
    complexCard: true,
    complexSelect: true,
    filterTarget(card, player, target) {
      if (player == target) {
        return false;
      }
      if (ui.selected.targets.length == 0) {
        return true;
      }
      return Math.abs(ui.selected.targets[0].countCards("h") - target.countCards("h")) == ui.selected.cards.length;
    },
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      const [target, target1] = event.targets;
      const cards2 = target.getCards("h").concat(target1.getCards("h"));
      event.dialogRef = true;
      const videoId = lib.status.videoId++;
      game.broadcastAll(
        function(cards3, id, player2, targets) {
          const dialog2 = ui.create.dialog("缔盟", true);
          if (player2.isUnderControl(true) || targets[0].isUnderControl(true) || targets[1].isUnderControl(true)) {
            dialog2.add(cards3);
            dialog2.seeing = true;
          } else {
            dialog2.add([cards3, "blank"]);
          }
          _status.dieClose.push(dialog2);
          dialog2.videoId = id;
          if (_status.event.dialogRef) {
            _status.event.dialog = dialog2;
          }
        },
        cards2,
        videoId,
        player,
        event.targets
      );
      game.addVideo("cardDialog", null, ["缔盟", get.cardsInfo(cards2), videoId]);
      delete event.dialogRef;
      const dialog = event.dialog;
      let current = target;
      let num1 = 0;
      let num2 = 0;
      await game.delay();
      while (dialog.buttons.length) {
        let card;
        if (dialog.buttons.length > 1) {
          const next = current.chooseButton(true, function(button2) {
            return get.value(button2.link, _status.event.player);
          });
          next.set("dialog", get.idDialog(videoId));
          next.set("closeDialog", false);
          next.set("dialogdisplay", true);
          const result = await next.forResult();
          if (!result.bool) {
            return;
          }
          card = result.links[0];
        } else {
          card = dialog.buttons[0].link;
        }
        const button = dialog.buttons.find((button2) => button2.link == card);
        if (button) {
          if (dialog.seeing) {
            button.querySelector(".info").innerHTML = get.translation(current.name);
            if (!_status.connectMode) {
              game.log(current, "选择了", button.link);
            }
          }
          dialog.buttons.remove(button);
        }
        if (card) {
          await current.gain(card);
          if (dialog.seeing) {
            current.$draw(card, "nobroadcast");
          } else {
            current.$draw(1, "nobroadcast");
          }
          game.broadcast(
            function(card2, id, current2) {
              const dialog2 = get.idDialog(id);
              if (dialog2 && dialog2.seeing) {
                const button2 = dialog2.buttons.find((button3) => button3.link == card2);
                if (button2) {
                  button2.querySelector(".info").innerHTML = get.translation(current2.name);
                  dialog2.buttons.remove(button2);
                }
                current2.$draw(card2, "nobroadcast");
              } else {
                current2.$draw(1, "nobroadcast");
              }
            },
            card,
            videoId,
            current
          );
        }
        if (current == target) {
          num1++;
          current = target1;
        } else {
          num2++;
          current = target;
        }
        await game.delay(2);
      }
      if (!_status.connectMode) {
        game.log(event.targets[0], "获得了" + get.cnNumber(num1) + "张牌");
        game.log(event.targets[1], "获得了" + get.cnNumber(num2) + "张牌");
      }
      dialog.close();
      _status.dieClose.remove(dialog);
      game.broadcast(function(id) {
        const dialog2 = get.idDialog(id);
        if (dialog2) {
          dialog2.close();
          _status.dieClose.remove(dialog2);
        }
      }, videoId);
      game.addVideo("cardDialog", null, videoId);
    },
    targetprompt: ["先拿牌", "后拿牌"],
    find(type) {
      const player = _status.event.player;
      let list = game.filterPlayer((current) => current != player && get.attitude(player, current) > 3);
      const num = player.countCards("he", (card) => get.value(card) < 7);
      let count = null, from, nh;
      if (list.length == 0) {
        return null;
      }
      list.sort((a, b) => a.countCards("h") - b.countCards("h"));
      if (type == 1) {
        return list[0];
      }
      from = list[0];
      nh = from.countCards("h");
      list = game.filterPlayer((current) => current != player && get.attitude(player, current) < 1);
      if (!list.length) {
        return null;
      }
      list.sort((a, b) => b.countCards("h") - a.countCards("h"));
      for (let i2 = 0; i2 < list.length; i2++) {
        const nh2 = list[i2].countCards("h");
        if (nh2 - nh <= num) {
          count = nh2 - nh;
          break;
        }
      }
      if (count == null || count < 0) {
        return null;
      }
      if (type == 3) {
        return count;
      }
      return list[i];
    },
    check(card) {
      const count = lib.skill.redimeng.find(3);
      if (count == null) {
        return -1;
      }
      if (ui.selected.cards.length < count) {
        return 7 - get.value(card);
      }
      return -1;
    },
    ai: {
      order: 8,
      threaten: 1.6,
      expose: 0.5,
      result: {
        player(player, target) {
          if (ui.selected.targets.length == 0) {
            if (target == lib.skill.redimeng.find(1)) {
              return 1;
            }
            return 0;
          } else {
            if (target == lib.skill.redimeng.find(2)) {
              return 1;
            }
            return 0;
          }
        }
      }
    }
  },
  reluanji: {
    audio: 2,
    enable: "phaseUse",
    viewAs: { name: "wanjian" },
    filterCard(card, player) {
      if (!player.storage.reluanji) {
        return true;
      }
      return !player.storage.reluanji.includes(get.suit(card));
    },
    position: "hs",
    selectCard: 2,
    check(card) {
      const player = _status.event.player;
      const targets = game.filterPlayer(function(current) {
        return player.canUse("wanjian", current);
      });
      let num = 0;
      for (let i2 = 0; i2 < targets.length; i2++) {
        let eff = get.sgn(get.effect(targets[i2], { name: "wanjian" }, player, player));
        if (targets[i2].hp == 1) {
          eff *= 1.5;
        }
        num += eff;
      }
      if (!player.needsToDiscard(-1)) {
        if (targets.length >= 7) {
          if (num < 2) {
            return 0;
          }
        } else if (targets.length >= 5) {
          if (num < 1.5) {
            return 0;
          }
        }
      }
      return 6 - get.value(card);
    },
    ai: {
      basic: {
        order: 8.9
      }
    },
    group: ["reluanji_count", "reluanji_reset", "reluanji_respond", "reluanji_damage", "reluanji_draw"],
    subSkill: {
      reset: {
        trigger: { player: "phaseAfter" },
        silent: true,
        async content(event, trigger, player) {
          delete player.storage.reluanji;
          delete player.storage.reluanji2;
        }
      },
      count: {
        trigger: { player: "useCard" },
        silent: true,
        filter(event) {
          return event.skill == "reluanji";
        },
        async content(event, trigger, player) {
          player.storage.reluanji2 = trigger.card;
          if (!player.storage.reluanji) {
            player.storage.reluanji = [];
          }
          player.storage.reluanji.addArray(trigger.cards.map((c) => get.suit(c)));
        }
      },
      respond: {
        trigger: { global: "respond" },
        silent: true,
        filter(event) {
          return event.getParent(2).skill == "reluanji";
        },
        async content(event, trigger, player) {
          await trigger.player.draw();
        }
      },
      damage: {
        trigger: { source: "damage" },
        forced: true,
        silent: true,
        popup: false,
        filter(event, player) {
          return player.storage.reluanji2 && event.card == player.storage.reluanji2;
        },
        async content(event, trigger, player) {
          delete player.storage.reluanji2;
        }
      },
      draw: {
        trigger: { player: "useCardAfter" },
        forced: true,
        silent: true,
        popup: false,
        filter(event, player) {
          return player.storage.reluanji2 && event.card == player.storage.reluanji2;
        },
        async content(event, trigger, player) {
          await player.draw(trigger.targets.length);
          delete player.storage.reluanji2;
        }
      }
    }
  },
  qimou: {
    limited: true,
    audio: 2,
    enable: "phaseUse",
    skillAnimation: true,
    animationColor: "orange",
    async content(event, trigger, player) {
      const shas = player.getCards("h", "sha");
      let num;
      if (player.hp >= 4 && shas.length >= 3) {
        num = 3;
      } else if (player.hp >= 3 && shas.length >= 2) {
        num = 2;
      } else {
        num = 1;
      }
      const map = {};
      const list = [];
      for (let i2 = 1; i2 <= player.hp; i2++) {
        const cn = get.cnNumber(i2, true);
        map[cn] = i2;
        list.push(cn);
      }
      player.awakenSkill(event.name);
      player.storage.qimou = true;
      const result = await player.chooseControl(list, function() {
        return get.cnNumber(_status.event.goon, true);
      }).set("prompt", "失去任意点体力").set("goon", num).forResult();
      num = map[result.control] || 1;
      player.storage.qimou2 = num;
      player.addTempSkill("qimou2");
      await player.loseHp(num);
    },
    ai: {
      order: 2,
      result: {
        player(player) {
          if (player.hp == 1) {
            return 0;
          }
          const shas = player.getCards("h", "sha");
          if (!shas.length) {
            return 0;
          }
          const card = shas[0];
          if (!lib.filter.cardEnabled(card, player)) {
            return 0;
          }
          if (lib.filter.cardUsable(card, player)) {
            return 0;
          }
          let mindist;
          if (player.hp >= 4 && shas.length >= 3) {
            mindist = 4;
          } else if (player.hp >= 3 && shas.length >= 2) {
            mindist = 3;
          } else {
            mindist = 2;
          }
          if (game.hasPlayer(function(current) {
            return current.hp <= mindist - 1 && get.distance(player, current, "attack") <= mindist && player.canUse(card, current, false) && get.effect(current, card, player, player) > 0;
          })) {
            return 1;
          }
          return 0;
        }
      }
    }
  },
  qimou2: {
    onremove: true,
    mod: {
      cardUsable(card, player, num) {
        if (typeof player.storage.qimou2 == "number" && card.name == "sha") {
          return num + player.storage.qimou2;
        }
      },
      globalFrom(from, to, distance) {
        if (typeof from.storage.qimou2 == "number") {
          return distance - from.storage.qimou2;
        }
      }
    }
  },
  xinkuanggu: {
    audio: "kuanggu",
    audioname: ["re_weiyan", "ol_weiyan"],
    trigger: { source: "damageSource" },
    filter(event, player) {
      return event.checkKuanggu && event.num > 0;
    },
    getIndex(event, player, triggername) {
      return event.num;
    },
    preHidden: true,
    async cost(event, trigger, player) {
      let choice;
      if (player.isDamaged() && get.recoverEffect(player) > 0 && player.countCards("hs", function(card) {
        return card.name == "sha" && player.hasValueTarget(card);
      }) >= player.getCardUsable("sha")) {
        choice = "recover_hp";
      } else {
        choice = "draw_card";
      }
      const next = player.chooseDrawRecover("###" + get.prompt(event.skill) + "###摸一张牌或回复1点体力");
      next.set("choice", choice);
      next.set("ai", function() {
        return _status.event.getParent().choice;
      });
      next.set("logSkill", event.skill);
      next.setHiddenSkill(event.skill);
      const { control } = await next.forResult();
      if (control == "cancel2") {
        return;
      }
      event.result = { bool: true, skill_popup: false };
    },
    async content(event, trigger, player) {
    }
  },
  xinliegong: {
    mod: {
      aiOrder(player, card, num) {
        if (num > 0 && (card.name === "sha" || get.tag(card, "draw"))) {
          return num + 6;
        }
      },
      targetInRange(card, player, target) {
        if (card.name == "sha" && typeof get.number(card) == "number") {
          if (get.distance(player, target) <= get.number(card)) {
            return true;
          }
        }
      }
    },
    targetprompt2: (target) => {
      const player = get.player(), card = get.card(), list = [];
      if (card?.name != "sha" || !target.classList.contains("selectable")) {
        return list;
      }
      const num = card.cards?.length ?? 0;
      if (target.countCards("h") <= player.countCards("h") - num) {
        list.add("不可响应");
      }
      if (target.hp >= player.hp) {
        list.add("加伤");
      }
      return list;
    },
    onChooseToUse(event) {
      event.targetprompt2.add(lib.skill.xinliegong.targetprompt2);
    },
    onChooseTarget(event) {
      event.targetprompt2.add(lib.skill.xinliegong.targetprompt2);
    },
    audio: "liegong",
    audioname: ["re_huangzhong", "ol_huangzhong"],
    trigger: { player: "useCardToTargeted" },
    logTarget: "target",
    locked: false,
    check(event, player) {
      return get.attitude(player, event.target) <= 0;
    },
    filter(event, player) {
      if (event.card.name != "sha") {
        return false;
      }
      if (event.target.countCards("h") <= player.countCards("h")) {
        return true;
      }
      if (event.target.hp >= player.hp) {
        return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      if (trigger.target.countCards("h") <= player.countCards("h")) {
        trigger.getParent().directHit.push(trigger.target);
      }
      if (trigger.target.hp >= player.hp) {
        const id = trigger.target.playerid;
        const map = trigger.getParent().customArgs;
        if (!map[id]) {
          map[id] = {};
        }
        if (typeof map[id].extraDamage != "number") {
          map[id].extraDamage = 0;
        }
        map[id].extraDamage++;
      }
    },
    ai: {
      threaten: 0.5,
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (arg?.target && arg?.card && get.attitude(player, arg.target) <= 0 && arg.card.name == "sha" && player.countCards("h", function(card) {
          return card != arg.card && (!arg.card.cards || !arg.card.cards.includes(card));
        }) >= arg.target.countCards("h")) {
          return true;
        }
        return false;
      }
    }
  },
  tiaoxin: {
    audio: 2,
    audioname: ["sp_jiangwei", "xiahouba", "re_jiangwei", "gz_jiangwei", "ol_jiangwei"],
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target != player && target.inRange(player) && target.countCards("he") > 0;
    },
    async content(event, trigger, player) {
      const target = event.target;
      const result = await target.chooseToUse(
        function(card, player2, event2) {
          if (get.name(card) != "sha") {
            return false;
          }
          return lib.filter.filterCard.apply(this, arguments);
        },
        "挑衅：对" + get.translation(player) + "使用一张杀，或令其弃置你的一张牌"
      ).set("targetRequired", true).set("complexSelect", true).set("complexTarget", true).set("filterTarget", function(card, player2, target2) {
        if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
          return false;
        }
        return lib.filter.filterTarget.apply(this, arguments);
      }).set("sourcex", player).forResult();
      if (result.bool == false && target.countCards("he") > 0) {
        player.discardPlayerCard(target, "he", true);
      }
    },
    ai: {
      order: 4,
      expose: 0.2,
      result: {
        target: -1,
        player(player, target) {
          if (target.countCards("h") == 0) {
            return 0;
          }
          if (target.countCards("h") == 1) {
            return -0.1;
          }
          if (player.hp <= 2) {
            return -2;
          }
          if (player.countCards("h", "shan") == 0) {
            return -1;
          }
          return -0.5;
        }
      },
      threaten: 1.1
    }
  },
  tiaoxin_xiahouba: { audio: 2 },
  zhiji: {
    skillAnimation: true,
    animationColor: "fire",
    audio: 2,
    audioname: ["re_jiangwei"],
    juexingji: true,
    derivation: "reguanxing",
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      if (player.storage.zhiji) {
        return false;
      }
      return player.countCards("h") == 0;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.chooseDrawRecover(2, true);
      await player.loseMaxHp();
      await player.addSkills("reguanxing");
    }
  },
  xiangle: {
    audio: 2,
    audioname: ["re_liushan", "ol_liushan"],
    trigger: { target: "useCardToTargeted" },
    forced: true,
    preHidden: true,
    filter(event, player) {
      return event.card.name == "sha";
    },
    async content(event, trigger, player) {
      const eff = get.effect(player, trigger.card, trigger.player, trigger.player);
      const result = await trigger.player.chooseToDiscard("享乐：弃置一张基本牌，否则杀对" + get.translation(player) + "无效", function(card) {
        return get.type(card) == "basic";
      }).set("ai", function(card) {
        if (_status.event.eff > 0) {
          return 10 - get.value(card);
        }
        return 0;
      }).set("eff", eff).forResult();
      if (!result?.bool) {
        trigger.getParent().excluded.add(player);
      }
    },
    ai: {
      effect: {
        target(card, player, target, current) {
          if (card.name == "sha" && get.attitude(player, target) < 0) {
            if (_status.event.name == "xiangle") {
              return;
            }
            if (get.attitude(player, target) > 0 && current < 0) {
              return "zerotarget";
            }
            const bs = player.getCards("h", { type: "basic" });
            bs.remove(card);
            if (card.cards) {
              bs.removeArray(card.cards);
            } else {
              bs.removeArray(ui.selected.cards);
            }
            if (!bs.length) {
              return "zerotarget";
            }
            if (player.hasSkill("jiu") || player.hasSkill("tianxianjiu")) {
              return;
            }
            if (bs.length <= 2) {
              for (let i2 = 0; i2 < bs.length; i2++) {
                if (get.value(bs[i2]) < 7) {
                  return [1, 0, 1, -0.5];
                }
              }
              return [1, 0, 0.3, 0];
            }
            return [1, 0, 1, -0.5];
          }
        }
      }
    }
  },
  fangquan: {
    audio: 2,
    trigger: { player: "phaseUseBefore" },
    filter(event, player) {
      return player.countCards("h") > 0 && !player.hasSkill("fangquan3");
    },
    preHidden: true,
    async cost(event, trigger, player) {
      const fang = player.countMark("fangquan2") == 0 && player.hp >= 2 && player.countCards("h") <= player.hp + 1;
      event.result = await player.chooseBool(get.prompt2(event.skill)).set("ai", function() {
        const player2 = get.player();
        if (!_status.event.fang) {
          return false;
        }
        return game.hasPlayer(function(target) {
          if (target.hasJudge("lebu") || target == player2) {
            return false;
          }
          if (get.attitude(player2, target) > 4) {
            return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1) > 0;
          }
          return false;
        });
      }).set("fang", fang).setHiddenSkill(event.name.slice(0, -5)).forResult();
    },
    async content(event, trigger, player) {
      trigger.cancel();
      player.addTempSkill("fangquan2");
      player.addMark("fangquan2", 1, false);
    }
  },
  fangquan2: {
    trigger: { player: "phaseEnd" },
    locked: true,
    log: false,
    audio: false,
    //priority:-50,
    onremove: true,
    sourceSkill: "fangquan",
    getIndex(event, player) {
      return player.countMark("fangquan2") || 1;
    },
    async cost(event, trigger, player) {
      const chooseToDiscard = player.chooseToDiscard("是否弃置一张手牌并令一名其他角色进行一个额外回合？");
      chooseToDiscard.ai = function(card) {
        return 20 - get.value(card);
      };
      if (!(await chooseToDiscard.forResult()).bool) {
        return;
      }
      const chooseTarget = player.chooseTarget(true, "请选择进行额外回合的目标角色", lib.filter.notMe);
      chooseTarget.ai = function(target) {
        const player2 = get.player();
        if (target.hasJudge("lebu") || get.attitude(player2, target) <= 0) {
          return -1;
        }
        if (target.isTurnedOver()) {
          return 0.18;
        }
        return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1);
      };
      event.result = await chooseTarget.forResult();
    },
    async content(event, trigger, player) {
      const [target] = event.targets;
      player.logSkill(player.name == "re_liushan" ? "refangquan" : "fangquan", event.targets, "fire");
      target.markSkillCharacter("fangquan", player, "放权", "进行一个额外回合");
      target.insertPhase();
      player.removeMark("fangquan2");
      target.addSkill("fangquan3");
    }
  },
  fangquan3: {
    trigger: { player: ["phaseAfter", "phaseCancelled"] },
    forced: true,
    popup: false,
    audio: false,
    sourceSkill: "fangquan",
    async content(event, trigger, player) {
      player.unmarkSkill("fangquan");
      player.removeSkill("fangquan3");
    }
  },
  ruoyu: {
    skillAnimation: true,
    animationColor: "fire",
    audio: 2,
    audioname: ["re_liushan"],
    juexingji: true,
    zhuSkill: true,
    keepSkill: true,
    derivation: "rejijiang",
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      return player.isMinHp();
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.gainMaxHp();
      await player.recover();
      await player.addSkills("rejijiang");
    }
  },
  qiaobian: {
    audio: 2,
    audioname2: { gz_jun_caocao: "jianan_qiaobian" },
    trigger: {
      player: ["phaseJudgeBefore", "phaseDrawBefore", "phaseUseBefore", "phaseDiscardBefore"]
    },
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    preHidden: true,
    async cost(event, trigger, player) {
      let check, str = "弃置一张手牌并跳过";
      str += ["判定", "摸牌", "出牌", "弃牌"][lib.skill.qiaobian.trigger.player.indexOf(event.triggername)];
      str += "阶段";
      if (trigger.name == "phaseDraw") {
        str += "，然后可以获得至多两名角色各一张手牌";
      }
      if (trigger.name == "phaseUse") {
        str += "，然后可以移动场上的一张牌";
      }
      switch (trigger.name) {
        case "phaseJudge":
          check = player.countCards("j");
          break;
        case "phaseDraw": {
          let i2, num = 0, num2 = 0;
          const players = game.filterPlayer();
          for (i2 = 0; i2 < players.length; i2++) {
            if (player != players[i2] && players[i2].countCards("h")) {
              const att = get.attitude(player, players[i2]);
              if (att <= 0) {
                num++;
              }
              if (att < 0) {
                num2++;
              }
            }
          }
          check = num >= 2 && num2 > 0;
          break;
        }
        case "phaseUse":
          if (!player.canMoveCard(true)) {
            check = false;
          } else {
            check = game.hasPlayer(function(current) {
              return get.attitude(player, current) > 0 && current.countCards("j");
            });
            if (!check) {
              if (player.countCards("h") > player.hp + 1) {
                check = false;
              } else if (player.countCards("h", { name: "wuzhong" })) {
                check = false;
              } else {
                check = true;
              }
            }
          }
          break;
        case "phaseDiscard":
          check = player.needsToDiscard();
          break;
      }
      event.result = await player.chooseToDiscard(get.prompt(event.skill), str, lib.filter.cardDiscardable).set("ai", (card) => {
        if (!_status.event.check) {
          return -1;
        }
        return 7 - get.value(card);
      }).set("check", check).setHiddenSkill(event.skill).forResult();
    },
    async content(event, trigger, player) {
      trigger.cancel();
      game.log(player, "跳过了", "#y" + ["判定", "摸牌", "出牌", "弃牌"][lib.skill.qiaobian.trigger.player.indexOf(event.triggername)] + "阶段");
      if (trigger.name == "phaseUse") {
        if (player.canMoveCard()) {
          await player.moveCard();
        }
      } else if (trigger.name == "phaseDraw") {
        const result = await player.chooseTarget([1, 2], "获得至多两名角色各一张手牌", function(card, player2, target) {
          return target != player2 && target.countCards("h");
        }).set("ai", function(target) {
          return 1 - get.attitude(_status.event.player, target);
        }).forResult();
        if (!result.bool) {
          return;
        }
        result.targets.sortBySeat();
        player.line(result.targets, "green");
        if (!result.targets.length) {
          return;
        }
        await player.gainMultiple(result.targets);
        await game.delay();
      }
    },
    ai: { threaten: 3 }
  },
  tuntian: {
    audio: 2,
    audioname: ["gz_dengai"],
    trigger: {
      player: "loseAfter",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    frequent: true,
    preHidden: true,
    filter(event, player) {
      if (player == _status.currentPhase) {
        return false;
      }
      if (event.name == "gain" && event.player == player) {
        return false;
      }
      const evt = event.getl(player);
      return evt && evt.cards2 && evt.cards2.length > 0;
    },
    async content(event, trigger, player) {
      const judge = player.judge(function(card2) {
        if (get.suit(card2) == "heart") {
          return -1;
        }
        return 1;
      });
      judge.judge2 = function(result2) {
        return result2.bool;
      };
      if (get.mode() != "guozhan") {
        judge.callback = lib.skill.tuntian.callback;
        return void await judge;
      }
      const result = await judge.forResult();
      if (!result.bool || get.position(result.card) != "d") {
        return;
      }
      const card = result.card;
      const chooseBool = player.chooseBool("是否将" + get.translation(card) + "作为“田”置于武将牌上？");
      chooseBool.ai = function() {
        return true;
      };
      const { bool } = await chooseBool.forResult();
      if (!bool) {
        return;
      }
      const addToExpansion = player.addToExpansion(card, "gain2");
      addToExpansion.gaintag.add("tuntian");
      await addToExpansion;
    },
    async callback(event, trigger, player) {
      if (!event.judgeResult.bool) {
        return;
      }
      const next = player.addToExpansion(event.judgeResult.card, "gain2");
      next.gaintag.add("tuntian");
      await next;
    },
    marktext: "田",
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
    group: "tuntian_dist",
    locked: false,
    subSkill: {
      dist: {
        locked: false,
        mod: {
          globalFrom(from, to, distance) {
            let num = distance - from.getExpansions("tuntian").length;
            if (_status.event.skill == "jixi_backup" || _status.event.skill == "gz_jixi_backup") {
              num++;
            }
            return num;
          }
        }
      }
    },
    ai: {
      effect: {
        target(card, player, target, current) {
          if (typeof card === "object" && get.name(card) === "sha" && target.mayHaveShan(player, "use")) {
            return [0.6, 0.75];
          }
          if (!target.hasFriend() && !player.hasUnknown()) {
            return;
          }
          if (_status.currentPhase == target || get.type(card) === "delay") {
            return;
          }
          if (card.name != "shuiyanqijunx" && get.tag(card, "loseCard") && target.countCards("he")) {
            if (target.hasSkill("ziliang")) {
              return 0.7;
            }
            return [0.5, Math.max(2, target.countCards("h"))];
          }
          if (target.isUnderControl(true, player)) {
            if (get.tag(card, "respondSha") && target.countCards("h", "sha") || get.tag(card, "respondShan") && target.countCards("h", "shan")) {
              if (target.hasSkill("ziliang")) {
                return 0.7;
              }
              return [0.5, 1];
            }
          } else if (get.tag(card, "respondSha") || get.tag(card, "respondShan")) {
            if (get.attitude(player, target) > 0 && card.name == "juedou") {
              return;
            }
            if (get.tag(card, "damage") && target.hasSkillTag("maixie")) {
              return;
            }
            if (target.countCards("h") == 0) {
              return 2;
            }
            if (target.hasSkill("ziliang")) {
              return 0.7;
            }
            if (get.mode() == "guozhan") {
              return 0.5;
            }
            return [0.5, Math.max(target.countCards("h") / 4, target.countCards("h", "sha") + target.countCards("h", "shan"))];
          }
        }
      },
      threaten(player, target) {
        if (target.countCards("h") == 0) {
          return 2;
        }
        return 0.5;
      },
      nodiscard: true,
      nolose: true,
      notemp: true
    }
  },
  zaoxian: {
    skillAnimation: true,
    animationColor: "thunder",
    audio: 2,
    audioname: ["re_dengai"],
    juexingji: true,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      return player.getExpansions("tuntian").length >= 3;
    },
    derivation: "jixi",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.loseMaxHp();
      await player.addSkills("jixi");
    },
    ai: {
      combo: "tuntian"
    }
  },
  jixi: {
    audio: 2,
    audioname: ["re_dengai", "gz_dengai", "ol_dengai"],
    enable: "phaseUse",
    filter(event, player) {
      return player.getExpansions("tuntian").length > 0 && event.filterCard({ name: "shunshou" }, player, event);
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("急袭", player.getExpansions("tuntian"), "hidden");
      },
      filter(button, player) {
        const card = button.link;
        if (!game.checkMod(card, player, "unchanged", "cardEnabled2", player)) {
          return false;
        }
        const evt = _status.event.getParent();
        return evt.filterCard(get.autoViewAs({ name: "shunshou" }, [card]), player, evt);
      },
      backup(links, player) {
        const skill = _status.event.buttoned;
        return {
          audio: "jixi",
          audioname: ["re_dengai", "gz_dengai", "ol_dengai"],
          selectCard: -1,
          position: "x",
          filterCard: skill == "jixi" ? (card) => card == lib.skill.jixi_backup.card : (card) => card == lib.skill.gz_jixi_backup.card,
          viewAs: { name: "shunshou" },
          card: links[0]
        };
      },
      prompt(links, player) {
        return "选择 顺手牵羊（" + get.translation(links[0]) + "）的目标";
      }
    },
    subSkill: {
      backup: {}
    },
    ai: {
      order: 10,
      result: {
        player(player) {
          return player.getExpansions("tuntian").length - 1;
        }
      },
      combo: "tuntian"
    }
  },
  jiang: {
    audio: 2,
    preHidden: true,
    audioname: ["sp_lvmeng", "re_sunben", "re_sunce"],
    mod: {
      aiOrder(player, card, num) {
        if (get.color(card) === "red" && get.name(card) === "sha") {
          return get.order({ name: "sha" }) + 0.15;
        }
      }
    },
    trigger: {
      player: "useCardToPlayered",
      target: "useCardToTargeted"
    },
    filter(event, player) {
      if (!(event.card.name == "juedou" || event.card.name == "sha" && get.color(event.card) == "red")) {
        return false;
      }
      return player == event.target || event.getParent().triggeredTargets3.length == 1;
    },
    locked: false,
    frequent: true,
    async content(event, trigger, player) {
      player.draw();
    },
    ai: {
      effect: {
        target_use(card, player, target) {
          if (card.name == "sha" && get.color(card) == "red") {
            return [1, 0.6];
          }
        },
        player_use(card, player, target) {
          if (card.name == "sha" && get.color(card) == "red") {
            return [1, 1];
          }
        }
      }
    }
  },
  hunzi: {
    //audioname:['re_sunben'],
    skillAnimation: true,
    animationColor: "wood",
    audio: 2,
    juexingji: true,
    derivation: ["reyingzi", "gzyinghun"],
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return player.hp <= 1 && !player.storage.hunzi;
    },
    forced: true,
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.loseMaxHp();
      await player.addSkills(["reyingzi", "gzyinghun"]);
    },
    ai: {
      threaten(player, target) {
        if (target.hp == 1) {
          return 2;
        }
        return 0.5;
      },
      maixie: true,
      effect: {
        target(card, player, target) {
          if (!target.hasFriend()) {
            return;
          }
          if (target.hp === 2 && get.tag(card, "damage") == 1 && !target.isTurnedOver() && _status.currentPhase !== target && get.distance(_status.currentPhase, target, "absolute") <= 3) {
            return [0.5, 1];
          }
          if (target.hp === 1 && get.tag(card, "recover") && !target.isTurnedOver() && _status.currentPhase !== target && get.distance(_status.currentPhase, target, "absolute") <= 3) {
            return [1, -3];
          }
        }
      }
    }
  },
  zhiba: {
    global: "zhiba_global",
    audioname: ["re_sunben"],
    audioname2: {
      pe_jun_sunce: "olzhiba"
    },
    audio: 2,
    zhuSkill: true,
    subSkill: {
      global: {
        enable: "phaseUse",
        prompt() {
          const player = get.player();
          const list = game.filterPlayer((target) => target.hasZhuSkill("zhiba", player) && player.canCompare(target));
          let str = "和" + get.translation(list);
          if (list.length > 1) {
            str += "中的一人";
          }
          str += "进行拼点。若你没赢，其可以获得两张拼点牌。";
          return str;
        },
        filter(event, player) {
          if (player.group != "wu") {
            return false;
          }
          return game.hasPlayer((target) => target.hasZhuSkill("zhiba", player) && player.canCompare(target));
        },
        filterTarget(card, player, target) {
          return target.hasZhuSkill("zhiba", player) && player.canCompare(target);
        },
        log: false,
        prepare(cards2, player, targets) {
          targets[0].logSkill("zhiba");
        },
        usable: 1,
        async content(event, trigger, player) {
          const { target } = event;
          if (["hunzi", "rehunzi"].some((skill) => target.storage[skill])) {
            const { bool } = await target.chooseBool("是否拒绝〖制霸〗拼点？").set("choice", get.attitude(target, player) <= 0).forResult();
            if (bool) {
              game.log(target, "拒绝了拼点");
              target.chat("拒绝");
              return;
            }
          }
          if (!player.canCompare(target)) {
            return;
          }
          const result = await player.chooseToCompare(target, (card) => {
            if (card.name == "du") {
              return 20;
            }
            const player2 = get.owner(card);
            const target2 = get.event().getParent().target;
            if (player2 != target2 && get.attitude(player2, target2) > 0) {
              return -get.number(card);
            }
            return get.number(card);
          }).set("preserve", "lose").forResult();
          if (result.bool == false) {
            const list = [result.player, result.target].filterInD("d");
            if (!list.length) {
              return;
            }
            const next = target.chooseBool("是否获得" + get.translation(list) + "？").set("ai", () => get.value(list) > 0);
            if ((await next.forResult()).bool) {
              await target.gain(list, "gain2");
            }
          }
        },
        ai: {
          basic: {
            order: 1
          },
          expose: 0.2,
          result: {
            target(player, target) {
              if (player.countCards("h", "du") && get.attitude(player, target) < 0) {
                return -1;
              }
              if (player.countCards("h") <= player.hp) {
                return 0;
              }
              let maxnum = 0;
              const cards2 = target.getCards("h");
              for (let i2 = 0; i2 < cards2.length; i2++) {
                if (get.number(cards2[i2]) > maxnum) {
                  maxnum = get.number(cards2[i2]);
                }
              }
              if (maxnum > 10) {
                maxnum = 10;
              }
              if (maxnum < 5 && cards2.length > 1) {
                maxnum = 5;
              }
              const cards3 = player.getCards("h");
              for (let i2 = 0; i2 < cards3.length; i2++) {
                if (get.number(cards3[i2]) < maxnum) {
                  return 1;
                }
              }
              return 0;
            }
          }
        }
      }
    }
  },
  zhijian: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.countCards("h", { type: "equip" }) > 0;
    },
    filterCard(card) {
      return get.type(card) == "equip";
    },
    check(card) {
      const player = _status.currentPhase;
      if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
        return 11 - get.equipValue(card);
      }
      return 6 - get.value(card);
    },
    filterTarget(card, player, target) {
      if (target.isMin()) {
        return false;
      }
      return player != target && target.canEquip(card);
    },
    async content(event, trigger, player) {
      await event.target.equip(event.cards[0]);
      await player.draw();
    },
    discard: false,
    lose: false,
    prepare(cards2, player, targets) {
      player.$give(cards2, targets[0], false);
    },
    ai: {
      basic: {
        order: 10
      },
      result: {
        target(player, target) {
          const card = ui.selected.cards[0];
          if (card) {
            return get.effect(target, card, target, target);
          }
          return 0;
        }
      },
      threaten: 1.3
    }
  },
  guzheng: {
    audio: 2,
    audioname: ["re_zhangzhang"],
    trigger: { global: "phaseDiscardAfter" },
    filter(event, player) {
      if (event.player != player && event.player.isIn()) {
        return event.player.getHistory("lose", function(evt) {
          return evt.type == "discard" && evt.getParent("phaseDiscard") == event && evt.hs.someInD("d");
        }).length > 0;
      }
      return false;
    },
    checkx(event, player, cards2, cards22) {
      if (cards2.length > 2 || get.attitude(player, event.player) > 0) {
        return true;
      }
      for (let i2 = 0; i2 < cards22.length; i2++) {
        if (get.value(cards22[i2], event.player, "raw") < 0) {
          return true;
        }
      }
      return false;
    },
    preHidden: true,
    async cost(event, trigger, player) {
      const cards2 = [], cards22 = [];
      const target = trigger.player;
      game.getGlobalHistory("cardMove", function(evt) {
        if (evt.name == "cardsDiscard") {
          if (evt.getParent("phaseDiscard") == trigger) {
            const moves = evt.cards.filterInD("d");
            cards2.addArray(moves);
            cards22.removeArray(moves);
          }
        }
        if (evt.name == "lose") {
          if (evt.type != "discard" || evt.position != ui.discardPile || evt.getParent("phaseDiscard") != trigger) {
            return;
          }
          const moves = evt.cards.filterInD("d");
          cards2.addArray(moves);
          if (evt.player == target) {
            cards22.addArray(moves);
          } else {
            cards22.removeArray(moves);
          }
        }
      });
      if (!cards22.length) {
        return;
      }
      if (cards2.length == 1) {
        event.card = cards2[0];
        event.result = await player.chooseBool().set("createDialog", [get.prompt(event.skill, target), '<span class="text center">点击“确认”以令其收回此牌</span>', cards2]).set("choice", lib.skill.guzheng.checkx(trigger, player, cards2, cards22)).set("ai", function() {
          return _status.event.choice;
        }).setHiddenSkill(event.skill).forResult();
        event.result.cost_data = {
          action: "single",
          cards: cards2
        };
      } else {
        event.result = await player.chooseButton(2, [get.prompt(event.skill, target), '<span class="text center">被选择的牌将成为对方收回的牌</span>', cards2, [["获得剩余的牌", "放弃剩余的牌"], "tdnodes"]]).set("filterButton", function(button) {
          const type = typeof button.link;
          if (ui.selected.buttons.length && type == typeof ui.selected.buttons[0].link) {
            return false;
          }
          return type == "string" || _status.event.allowed.includes(button.link);
        }).set("allowed", cards22).set("check", lib.skill.guzheng.checkx(trigger, player, cards2, cards22)).set("ai", function(button) {
          if (typeof button.link == "string") {
            return button.link == "获得剩余的牌" ? 1 : 0;
          }
          if (_status.event.check) {
            return 20 - get.value(button.link, _status.event.getTrigger().player);
          }
          return 0;
        }).setHiddenSkill(event.skill).forResult();
        event.result.cost_data = {
          action: "multiple",
          cards: event.result.links
        };
      }
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const target = trigger.player;
      const action = event.cost_data.action;
      const cards2 = event.cost_data.cards;
      if (action != "multiple") {
        const gain = target.gain(cards2[0], "gain2");
        gain.giver = player;
        await gain;
      } else {
        if (typeof cards2[0] != "string") {
          cards2.reverse();
        }
        const [, card] = cards2;
        const gain = target.gain(card, "gain2");
        gain.giver = player;
        await gain;
        if (cards2[0] != "获得剩余的牌") {
          return;
        }
      }
      cards2.length = 0;
      game.getGlobalHistory("cardMove", function(evt) {
        if (evt.name == "cardsDiscard") {
          if (evt.getParent("phaseDiscard") == trigger) {
            const moves = evt.cards.filterInD("d");
            cards2.addArray(moves);
          }
        }
        if (evt.name == "lose") {
          if (evt.type != "discard" || evt.position != ui.discardPile || evt.getParent("phaseDiscard") != trigger) {
            return;
          }
          const moves = evt.cards.filterInD("d");
          cards2.addArray(moves);
        }
      });
      if (cards2.length > 0) {
        await player.gain(cards2, "gain2");
      }
    },
    ai: {
      threaten: 1.3,
      expose: 0.2
    }
  },
  beige: {
    audio: 2,
    audioname: ["re_caiwenji", "ol_caiwenji"],
    trigger: { global: "damageEnd" },
    filter(event, player) {
      return event.card && event.card.name == "sha" && event.source && event.player.isIn() && player.countCards("he");
    },
    checkx(event, player) {
      const att1 = get.attitude(player, event.player);
      const att2 = get.attitude(player, event.source);
      return att1 > 0 && att2 <= 0;
    },
    preHidden: true,
    async cost(event, trigger, player) {
      const next = player.chooseToDiscard("he", get.prompt2(event.skill, trigger.player));
      const check = lib.skill.beige.checkx(trigger, player);
      next.set("ai", function(card) {
        if (_status.event.goon) {
          return 8 - get.value(card);
        }
        return 0;
      });
      next.set("goon", check);
      next.setHiddenSkill(event.skill);
      event.result = await next.forResult();
    },
    async content(event, trigger, player) {
      const result = await trigger.player.judge().forResult();
      switch (result.suit) {
        case "heart":
          await trigger.player.recover();
          break;
        case "diamond":
          await trigger.player.draw(2);
          break;
        case "club":
          await trigger.source.chooseToDiscard("he", 2, true);
          break;
        case "spade":
          await trigger.source.turnOver();
          break;
      }
    },
    ai: {
      expose: 0.3
    }
  },
  duanchang: {
    audio: 2,
    audioname: ["re_caiwenji", "ol_caiwenji"],
    forbid: ["boss"],
    trigger: { player: "die" },
    forced: true,
    forceDie: true,
    skillAnimation: true,
    animationColor: "gray",
    filter(event) {
      return event.source && event.source.isIn();
    },
    async content(event, trigger, player) {
      trigger.source.clearSkills();
    },
    logTarget: "source",
    ai: {
      maixie_defend: true,
      threaten(player, target) {
        if (target.hp == 1) {
          return 0.2;
        }
        return 1.5;
      },
      effect: {
        target(card, player, target, current) {
          if (!target.hasFriend()) {
            return;
          }
          if (target.hp <= 1 && get.tag(card, "damage")) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return 3;
            }
            return [1, 0, 0, -3 * get.threaten(player)];
          }
        }
      }
    }
  },
  // ---------- 本次分界线喵 ----------
  huashen: {
    audio: "huashen2",
    unique: true,
    init(player) {
      if (!player.storage.huashen) {
        player.storage.huashen = { owned: {}, choosed: [] };
      }
    },
    intro: {
      content(storage, player) {
        let str = "";
        const list = Object.keys(storage.owned);
        if (list.length) {
          str += get.translation(list[0]);
          for (let i2 = 1; i2 < list.length; i2++) {
            str += "、" + get.translation(list[i2]);
          }
        }
        const skill = player.storage.huashen.current2;
        if (skill) {
          str += "<p>当前技能：" + get.translation(skill);
        }
        return str;
      },
      onunmark(storage, player) {
        _status.characterlist.addArray(Object.keys(storage.owned));
        storage.owned = [];
        const name = player.name ? player.name : player.name1;
        if (name) {
          const sex = get.character(name).sex;
          const group = get.character(name).group;
          if (player.sex !== sex) {
            game.broadcastAll(
              (player2, sex2) => {
                player2.sex = sex2;
              },
              player,
              sex
            );
            game.log(player, "将性别变为了", "#y" + get.translation(sex) + "性");
          }
          if (player.group !== group) {
            game.broadcastAll(
              (player2, group2) => {
                player2.group = group2;
                player2.node.name.dataset.nature = get.groupnature(group2);
              },
              player,
              group
            );
            game.log(player, "将势力变为了", "#y" + get.translation(group + 2));
          }
        }
      },
      mark(dialog, content, player) {
        const list = Object.keys(content.owned);
        if (list.length) {
          const skill = player.storage.huashen.current2;
          const character = player.storage.huashen.current;
          if (skill && character) {
            dialog.addSmall([[character], (item, type, position, noclick, node) => lib.skill.rehuashen.$createButton(item, type, position, noclick, node)]);
            dialog.add('<div><div class="skill">【' + get.translation(lib.translate[skill + "_ab"] || get.translation(skill).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(skill, player, false) + "</div></div>");
          }
          if (player.isUnderControl(true)) {
            dialog.addSmall([list, (item, type, position, noclick, node) => lib.skill.rehuashen.$createButton(item, type, position, noclick, node)]);
          } else {
            dialog.addText("共有" + get.cnNumber(list.length) + "张“化身”");
          }
        } else {
          return "没有化身";
        }
      },
      markcount(storage = {}) {
        return Object.keys(storage.owned).length;
      }
    },
    addHuashen(player) {
      if (!player.storage.huashen) {
        return;
      }
      if (!_status.characterlist) {
        game.initCharacterList();
      }
      _status.characterlist.randomSort();
      for (let i2 = 0; i2 < _status.characterlist.length; i2++) {
        let name = _status.characterlist[i2];
        if (name.indexOf("zuoci") != -1 || name.indexOf("key_") == 0 || name.indexOf("sp_key_") == 0 || lib.skill.rehuashen.banned.includes(name) || player.storage.huashen.owned[name]) {
          continue;
        }
        let skills2 = lib.character[name][3].filter((skill) => {
          const categories = get.skillCategoriesOf(skill, player);
          return !categories.some((type) => lib.skill.rehuashen.bannedType.includes(type));
        });
        if (skills2.length) {
          player.storage.huashen.owned[name] = skills2;
          _status.characterlist.remove(name);
          return name;
        }
      }
    },
    addHuashens(player, num) {
      const list = [];
      for (let i2 = 0; i2 < num; i2++) {
        const name = lib.skill.huashen.addHuashen(player);
        if (name) {
          list.push(name);
        }
      }
      if (list.length) {
        player.syncStorage("huashen");
        player.markSkill("huashen");
        game.log(player, "获得了", get.cnNumber(list.length) + "张", "#g化身");
        lib.skill.rehuashen.drawCharacter(player, list);
      }
    },
    trigger: {
      global: "phaseBefore",
      player: ["enterGame", "phaseBegin", "phaseEnd"]
    },
    filter(event, player, name) {
      if (event.name != "phase") {
        return true;
      }
      if (name == "phaseBefore") {
        return game.phaseNumber == 0;
      }
      return !get.is.empty(player.storage.huashen.owned);
    },
    log: false,
    async cost(event, trigger, player) {
      const name = event.triggername;
      if (trigger.name != "phase" || name == "phaseBefore" && game.phaseNumber == 0) {
        player.logSkill("huashen");
        lib.skill.huashen.addHuashens(player, 2);
        event.logged = true;
      }
      await Promise.all(event.next);
      const cards2 = [];
      const skills2 = [];
      for (const i2 in player.storage.huashen.owned) {
        cards2.push(i2);
        skills2.addArray(player.storage.huashen.owned[i2]);
      }
      const cond = event.triggername == "phaseBegin" ? "in" : "out";
      skills2.randomSort();
      skills2.sort(function(a, b) {
        return get.skillRank(b, cond) - get.skillRank(a, cond);
      });
      if (player.isUnderControl()) {
        game.swapPlayerAuto(player);
      }
      const switchToAuto = function() {
        _status.imchoosing = false;
        let skill = skills2[0], character;
        for (const i2 in player.storage.huashen.owned) {
          if (player.storage.huashen.owned[i2].includes(skill)) {
            character = i2;
            break;
          }
        }
        if (event.dialog) {
          event.dialog.close();
        }
        if (event.control) {
          event.control.close();
        }
        return Promise.resolve({
          bool: true,
          skill,
          character
        });
      };
      const chooseButton = function(player2, list, forced) {
        const { promise, resolve } = Promise.withResolvers();
        const event2 = _status.event;
        player2 = player2 || event2.player;
        if (!event2._result) {
          event2._result = {};
        }
        const prompt = forced ? "化身：选择获得一项技能" : get.prompt("huashen");
        const dialog = ui.create.dialog(prompt, [list, (item, type, position, noclick, node) => lib.skill.rehuashen.$createButton(item, type, position, noclick, node)]);
        event2.dialog = dialog;
        event2.forceMine = true;
        event2.button = null;
        for (let i2 = 0; i2 < event2.dialog.buttons.length; i2++) {
          event2.dialog.buttons[i2].classList.add("pointerdiv");
          event2.dialog.buttons[i2].classList.add("selectable");
        }
        const buttons = dialog.content.querySelector(".buttons");
        const array = dialog.buttons.filter((item) => !item.classList.contains("nodisplay") && item.style.display !== "none");
        const choosed = player2.storage.huashen.choosed;
        const groups = array.map((i2) => get.character(i2.link).group).unique().sort((a, b) => {
          const getNum = (g) => lib.group.includes(g) ? lib.group.indexOf(g) : lib.group.length;
          return getNum(a) - getNum(b);
        });
        if (choosed.length > 0 || groups.length > 1) {
          event2.dialog.style.bottom = (parseInt(event2.dialog.style.top || "0", 10) + get.is.phoneLayout() ? 230 : 220) + "px";
          event2.dialog.addPagination({
            data: array,
            totalPageCount: groups.length + Math.sign(choosed.length),
            container: dialog.content,
            insertAfter: buttons,
            onPageChange(state) {
              const { pageNumber, data, pageElement } = state;
              const { groups: groups2, choosed: choosed2 } = pageElement;
              data.forEach((item) => {
                item.classList[(() => {
                  const name2 = item.link, goon = choosed2.length > 0;
                  if (goon && pageNumber === 1) {
                    return choosed2.includes(name2);
                  }
                  const group = get.character(name2).group;
                  return groups2.indexOf(group) + (1 + goon) === pageNumber;
                })() ? "remove" : "add"]("nodisplay");
              });
              ui.update();
            },
            pageLimitForCN: ["←", "→"],
            pageNumberForCN: (choosed.length > 0 ? ["常用"] : []).concat(
              groups.map((i2) => {
                const isChineseChar = (char) => {
                  const regex = /[\u4e00-\u9fff\u3400-\u4dbf\ud840-\ud86f\udc00-\udfff\ud870-\ud87f\udc00-\udfff\ud880-\ud88f\udc00-\udfff\ud890-\ud8af\udc00-\udfff\ud8b0-\ud8bf\udc00-\udfff\ud8c0-\ud8df\udc00-\udfff\ud8e0-\ud8ff\udc00-\udfff\ud900-\ud91f\udc00-\udfff\ud920-\ud93f\udc00-\udfff\ud940-\ud97f\udc00-\udfff\ud980-\ud9bf\udc00-\udfff\ud9c0-\ud9ff\udc00-\udfff]/u;
                  return regex.test(char);
                };
                const str = get.plainText(lib.translate[i2 + "2"] || lib.translate[i2] || "无");
                return isChineseChar(str.slice(0, 1)) ? str.slice(0, 1) : str;
              })
            ),
            changePageEvent: "click",
            pageElement: {
              groups,
              choosed
            }
          });
        }
        event2.dialog.open();
        event2.custom.replace.button = function(button) {
          const paginationInstance = event2.dialog.paginationMap?.get(event2.dialog.content.querySelector(".buttons"));
          if (!event2.dialog.contains(button.parentNode)) {
            return;
          }
          if (event2.control) {
            event2.control.style.opacity = 1;
          }
          if (button.classList.contains("selectedx")) {
            if (paginationInstance?.state) {
              paginationInstance.state.pageRefuseChanged = false;
            }
            event2.button = null;
            button.classList.remove("selectedx");
            if (event2.control) {
              event2.control.replacex(["cancel2"]);
            }
          } else {
            if (paginationInstance?.state) {
              paginationInstance.state.pageRefuseChanged = true;
            }
            if (event2.button) {
              event2.button.classList.remove("selectedx");
            }
            button.classList.add("selectedx");
            event2.button = button;
            if (event2.control && button.link) {
              event2.control.replacex(player2.storage.huashen.owned[button.link]);
            }
          }
          game.check();
        };
        event2.custom.replace.window = function() {
          const paginationInstance = event2.dialog.paginationMap?.get(event2.dialog.content.querySelector(".buttons"));
          if (paginationInstance?.state) {
            paginationInstance.state.pageRefuseChanged = false;
          }
          if (event2.button) {
            event2.button.classList.remove("selectedx");
            event2.button = null;
          }
          if (event2.control) {
            event2.control.replacex(["cancel2"]);
          }
        };
        event2.switchToAuto = function() {
          const skills3 = [];
          for (const i2 in player2.storage.huashen.owned) {
            skills3.addArray(player2.storage.huashen.owned[i2]);
          }
          const cond2 = event2.triggername == "phaseBegin" ? "in" : "out";
          skills3.randomSort();
          skills3.sort(function(a, b) {
            return get.skillRank(b, cond2) - get.skillRank(a, cond2);
          });
          _status.imchoosing = false;
          let skill = skills3[0], character;
          for (const i2 in player2.storage.huashen.owned) {
            if (player2.storage.huashen.owned[i2].includes(skill)) {
              character = i2;
              break;
            }
          }
          resolve({
            bool: true,
            skill,
            character
          });
          if (event2.dialog) {
            event2.dialog.close();
          }
          if (event2.control) {
            event2.control.close();
          }
        };
        const controls = [];
        event2.control = ui.create.control();
        event2.control.replacex = function() {
          const args = Array.from(arguments)[0];
          if (args.includes("cancel2") && forced) {
            args.remove("cancel2");
            this.style.opacity = "";
          }
          args.push(function(link) {
            const result2 = event2._result;
            if (link == "cancel2") {
              result2.bool = false;
            } else {
              if (!event2.button) {
                return;
              }
              result2.bool = true;
              result2.skill = link;
              result2.character = event2.button.link;
            }
            event2.dialog.close();
            event2.control.close();
            game.resume();
            _status.imchoosing = false;
            resolve(result2);
          });
          return this.replace.apply(this, args);
        };
        if (!forced) {
          controls.push("cancel2");
          event2.control.style.opacity = 1;
        }
        event2.control.replacex(controls);
        game.pause();
        game.countChoose();
        return promise;
      };
      let next;
      if (event.isMine()) {
        next = chooseButton(player, cards2, event.logged);
      } else if (event.isOnline()) {
        const { promise, resolve } = Promise.withResolvers();
        event.player.send(chooseButton, event.player, cards2, event.logged);
        event.player.wait(async (result2) => {
          if (result2 == "ai") {
            result2 = await switchToAuto();
          }
          resolve(result2);
        });
        game.pause();
        next = promise;
      } else {
        next = switchToAuto();
      }
      const result = await next;
      game.resume();
      result.logged = event.logged;
      event.result = {
        bool: result.bool,
        cost_data: result
      };
    },
    async content(event, trigger, player) {
      const map = event.cost_data;
      if (!map.logged) {
        player.logSkill("huashen");
      }
      const skill = map.skill, character = map.character;
      player.storage.huashen.choosed.add(character);
      if (character != player.storage.huashen.current) {
        const old = player.storage.huashen.current;
        player.storage.huashen.current = character;
        player.markSkill("huashen");
        game.broadcastAll(
          function(player2, character2, old2) {
            player2.tempname.remove(old2);
            player2.tempname.add(character2);
            player2.sex = lib.character[character2].sex;
          },
          player,
          character,
          old
        );
        get.character().group;
        game.log(player, "将性别变为了", "#y" + get.translation(get.character(character).sex) + "性");
        await player.changeGroup(get.character(character).group);
      }
      player.storage.huashen.current2 = skill;
      if (!player.additionalSkills.huashen || !player.additionalSkills.huashen.includes(skill)) {
        player.flashAvatar("huashen", character);
        player.syncStorage("huashen");
        player.updateMarks("huashen");
        await player.addAdditionalSkills("huashen", skill);
      }
    }
  },
  huashen2: { audio: 2 },
  xinsheng: {
    audio: 2,
    unique: true,
    trigger: { player: "damageEnd" },
    frequent: true,
    getIndex: (event) => event.num,
    filter(event) {
      return event.num;
    },
    async content(event, trigger, player) {
      lib.skill.huashen.addHuashens(player, 1);
    },
    ai: { combo: "huashen" }
  },
  huoshou: {
    audio: "huoshou1",
    audioname: ["re_menghuo"],
    locked: true,
    group: ["huoshou1", "huoshou2"],
    preHidden: ["huoshou1", "huoshou2"],
    ai: {
      halfneg: true,
      effect: {
        target(card, player, target) {
          if (card.name == "nanman") {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  huoshou1: {
    audio: 2,
    audioname: ["re_menghuo"],
    trigger: { target: "useCardToBefore" },
    forced: true,
    priority: 15,
    sourceSkill: "huoshou",
    filter(event, player) {
      return event.card.name == "nanman";
    },
    async content(event, trigger, player) {
      trigger.cancel();
    }
  },
  huoshou2: {
    audio: "huoshou1",
    audioname: ["re_menghuo"],
    trigger: { global: "useCard" },
    forced: true,
    sourceSkill: "huoshou",
    filter(event, player) {
      return event.card && event.card.name == "nanman" && event.player != player;
    },
    async content(event, trigger, player) {
      trigger.customArgs.default.customSource = player;
    }
  },
  zaiqixx: {
    audio: "zaiqi",
    inherit: "zaiqi"
  },
  zaiqi: {
    audio: 2,
    trigger: { player: "phaseDrawBegin1" },
    filter(event, player) {
      return !event.numFixed && player.isDamaged();
    },
    check(event, player) {
      if (player.getDamagedHp() < 2) {
        return false;
      } else if (player.getDamagedHp() == 2) {
        return player.countCards("h") >= 2;
      }
      return true;
    },
    async content(event, trigger, player) {
      trigger.changeToZero();
      let cards2 = get.cards(player.getDamagedHp() + (event.name == "zaiqi" ? 0 : 1), true);
      cards2 = (await player.showCards(cards2, `${get.translation(player)}发动了〖${get.translation(event.name)}〗`, true).set("delay_time", Math.min(4, cards2.length)).forResult()).cards;
      let num = 0;
      for (let i2 = 0; i2 < cards2.length; i2++) {
        if (get.suit(cards2[i2]) == "heart") {
          num++;
          cards2.splice(i2--, 1);
        }
      }
      if (num) {
        await player.recover(num);
      }
      if (cards2.length) {
        await player.gain(cards2, "gain2");
      }
    },
    ai: {
      threaten(player, target) {
        if (target.hp == 1) {
          return 2;
        }
        if (target.hp == 2) {
          return 1.5;
        }
        return 1;
      }
    }
  },
  juxiang: {
    //unique:true,
    locked: true,
    audio: "juxiang1",
    audioname: ["re_zhurong", "ol_zhurong"],
    group: ["juxiang1", "juxiang2"],
    preHidden: ["juxiang1", "juxiang2"],
    ai: {
      effect: {
        target(card) {
          if (card.name == "nanman") {
            return [0, 1, 0, 0];
          }
        }
      }
    }
  },
  juxiang1: {
    audio: 2,
    audioname: ["re_zhurong", "ol_zhurong"],
    trigger: { target: "useCardToBefore" },
    forced: true,
    priority: 15,
    sourceSkill: "juxiang",
    filter(event, player) {
      return event.card.name == "nanman";
    },
    async content(event, trigger, player) {
      trigger.cancel();
    }
  },
  juxiang2: {
    audio: "juxiang1",
    audioname: ["re_zhurong", "ol_zhurong"],
    trigger: { global: "useCardAfter" },
    forced: true,
    sourceSkill: "juxiang",
    filter(event, player) {
      return event.card.name == "nanman" && event.player != player && event.cards.someInD();
    },
    async content(event, trigger, player) {
      await player.gain(trigger.cards.filterInD(), "gain2");
    }
  },
  lieren: {
    audio: 2,
    audioname: ["boss_lvbu3", "ol_zhurong"],
    trigger: { source: "damageSource" },
    filter(event, player) {
      if (event._notrigger.includes(event.player)) {
        return false;
      }
      return event.card && event.card.name == "sha" && event.getParent().name == "sha" && event.player.isIn() && player.canCompare(event.player);
    },
    check(event, player) {
      return get.attitude(player, event.player) < 0 && player.countCards("h") > 1;
    },
    //priority:5,
    async content(event, trigger, player) {
      const result = await player.chooseToCompare(trigger.player).forResult();
      if (result.bool && trigger.player.countGainableCards(player, "he")) {
        await player.gainPlayerCard(trigger.player, true, "he");
      }
    }
  },
  xingshang: {
    audio: 2,
    audioname2: { caoying: "lingren_xingshang" },
    trigger: { global: "die" },
    preHidden: true,
    filter(event) {
      return event.player.countCards("he") > 0;
    },
    async content(event, trigger, player) {
      event.togain = trigger.player.getCards("he");
      await player.gain(event.togain, trigger.player, "giveAuto", "bySelf");
    }
  },
  fangzhu: {
    audio: 2,
    audioname2: { new_simayi: "fangzhu_new_simayi" },
    trigger: { player: "damageEnd" },
    preHidden: true,
    async cost(event, trigger, player) {
      const draw = player.getDamagedHp();
      event.result = await player.chooseTarget(get.prompt(event.skill), "令一名其他角色翻面" + (draw > 0 ? "并摸" + get.cnNumber(draw) + "张牌" : ""), function(card, player2, target) {
        return player2 != target;
      }).setHiddenSkill(event.skill).set("ai", (target) => {
        if (target.hasSkillTag("noturn")) {
          return 0;
        }
        const player2 = _status.event.player;
        const current = _status.currentPhase;
        const dis = current ? get.distance(current, target, "absolute") : 1;
        const draw2 = player2.getDamagedHp();
        const att = get.attitude(player2, target);
        if (att == 0) {
          return target.hasJudge("lebu") ? Math.random() / 3 : Math.sqrt(get.threaten(target)) / 5 + Math.random() / 2;
        }
        if (att > 0) {
          if (target.isTurnedOver()) {
            return att + draw2;
          }
          if (draw2 < 4) {
            return -1;
          }
          if (current && target.getSeatNum() > current.getSeatNum()) {
            return att + draw2 / 3;
          }
          return 10 * Math.sqrt(Math.max(0.01, get.threaten(target))) / (3.5 - draw2) + dis / (2 * game.countPlayer());
        } else {
          if (target.isTurnedOver()) {
            return att - draw2;
          }
          if (draw2 >= 5) {
            return -1;
          }
          if (current && target.getSeatNum() <= current.getSeatNum()) {
            return -att + draw2 / 3;
          }
          return (4.25 - draw2) * 10 * Math.sqrt(Math.max(0.01, get.threaten(target))) + 2 * game.countPlayer() / dis;
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const draw = player.getDamagedHp();
      if (draw > 0) {
        await event.targets[0].draw(draw);
      }
      await event.targets[0].turnOver();
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
            if (target.hp <= 1) {
              return;
            }
            if (!target.hasFriend()) {
              return;
            }
            let hastarget = false;
            let turnfriend = false;
            const players = game.filterPlayer();
            for (let i2 = 0; i2 < players.length; i2++) {
              if (get.attitude(target, players[i2]) < 0 && !players[i2].isTurnedOver()) {
                hastarget = true;
              }
              if (get.attitude(target, players[i2]) > 0 && players[i2].isTurnedOver()) {
                hastarget = true;
                turnfriend = true;
              }
            }
            if (get.attitude(player, target) > 0 && !hastarget) {
              return;
            }
            if (turnfriend || target.hp == target.maxHp) {
              return [0.5, 1];
            }
            if (target.hp > 1) {
              return [1, 0.5];
            }
          }
        }
      }
    }
  },
  fangzhu_new_simayi: { audio: 1 },
  songwei: {
    group: "songwei2",
    audioname: ["re_caopi"],
    audio: "songwei2",
    zhuSkill: true
  },
  songwei2: {
    audio: 2,
    audioname: ["re_caopi"],
    audioname2: {
      pe_jun_caopi: "sbsongwei"
    },
    forceaudio: true,
    trigger: { global: "judgeEnd" },
    sourceSkill: "songwei",
    filter(event, player) {
      if (event.player == player || event.player.group != "wei") {
        return false;
      }
      if (event.result.color != "black") {
        return false;
      }
      return player.hasZhuSkill("songwei", event.player);
    },
    async cost(event, trigger, player) {
      event.result = await trigger.player.chooseBool("是否发动【颂威】，令" + get.translation(player) + "摸一张牌？").set("choice", get.attitude(trigger.player, player) > 0).forResult();
    },
    async content(event, trigger, player) {
      trigger.player.line(player, "green");
      player.draw();
    }
  },
  jiezi: {
    trigger: { global: ["phaseDrawSkipped", "phaseDrawCancelled"] },
    audio: 2,
    forced: true,
    filter(event, player) {
      return event.player != player;
    },
    async content(event, trigger, player) {
      await player.draw();
    }
  },
  gzduanliang: {
    audio: "duanliang1",
    audioname: ["re_xuhuang"],
    group: ["duanliang1", "duanliang2"],
    ai: {
      threaten: 1.2
    }
  },
  duanliang: {
    audio: "duanliang1",
    audioname: ["re_xuhuang"],
    group: ["duanliang1", "duanliang3"],
    ai: {
      threaten: 1.2
    }
  },
  duanliang1: {
    audio: 2,
    audioname: ["re_xuhuang"],
    enable: "chooseToUse",
    sourceSkill: "duanliang",
    filterCard(card) {
      if (get.type(card) != "basic" && get.type(card) != "equip") {
        return false;
      }
      return get.color(card) == "black";
    },
    filter(event, player) {
      return player.countCards("hes", { type: ["basic", "equip"], color: "black" });
    },
    position: "hes",
    viewAs: { name: "bingliang" },
    prompt: "将一黑色的基本牌或装备牌当兵粮寸断使用",
    check(card) {
      return 6 - get.value(card);
    },
    ai: {
      order: 9
    }
  },
  duanliang2: {
    mod: {
      targetInRange(card, player, target) {
        if (card.name == "bingliang") {
          if (get.distance(player, target) <= 2) {
            return true;
          }
        }
      }
    }
  },
  duanliang3: {
    mod: {
      targetInRange(card, player, target) {
        if (card.name == "bingliang") {
          if (target.countCards("h") >= player.countCards("h")) {
            return true;
          }
        }
      }
    }
  },
  haoshi: {
    audio: 2,
    trigger: { player: "phaseDrawBegin2" },
    filter(event, player) {
      return !event.numFixed;
    },
    preHidden: true,
    check(event, player) {
      return player.countCards("h") + 2 + event.num <= 5 || game.hasPlayer(function(target) {
        return player !== target && !game.hasPlayer(function(current) {
          return current !== player && current !== target && current.countCards("h") < target.countCards("h");
        }) && get.attitude(player, target) > 0;
      });
    },
    async content(event, trigger, player) {
      trigger.num += 2;
      player.addSkill("haoshi2");
    },
    ai: {
      threaten: 2,
      noh: true,
      skillTagFilter(player, tag) {
        if (tag == "noh") {
          if (player.countCards("h") != 2) {
            return false;
          }
        }
      }
    }
  },
  haoshi2: {
    trigger: { player: "phaseDrawEnd" },
    forced: true,
    popup: false,
    audio: false,
    sourceSkill: "haoshi",
    async content(event, trigger, player) {
      player.removeSkill("haoshi2");
      if (player.countCards("h") <= 5) {
        return;
      }
      const result = await player.chooseCardTarget({
        selectCard: Math.floor(player.countCards("h") / 2),
        filterTarget(card, player2, target) {
          return target.isMinHandcard();
        },
        prompt: "将一半的手牌交给场上手牌数最少的一名角色",
        forced: true,
        ai2(target) {
          return get.attitude(_status.event.player, target);
        }
      }).forResult();
      if (result.targets && result.targets[0]) {
        await player.give(result.cards, result.targets[0]);
      }
    }
  },
  dimeng: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    position: "he",
    filterCard() {
      const targets = ui.selected.targets;
      if (targets.length == 2) {
        if (Math.abs(targets[0].countCards("h") - targets[1].countCards("h")) <= ui.selected.cards.length) {
          return false;
        }
      }
      return true;
    },
    selectCard: [0, Infinity],
    selectTarget: 2,
    complexCard: true,
    complexTarget: true,
    filterTarget(card, player, target) {
      if (player == target) {
        return false;
      }
      const targets = ui.selected.targets;
      if (!targets?.length) {
        return true;
      } else if (targets.concat([target]).every((target2) => !target2.countCards("h"))) {
        return false;
      }
      return Math.abs(targets[0].countCards("h") - target.countCards("h")) == ui.selected.cards.length;
    },
    /*filterOk() {
    	if (targets.length != 2) {
    		return false;
    	}
    	return Math.abs(targets[0].countCards("h") - targets[1].countCards("h")) == ui.selected.cards.length;
    },*/
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      event.targets[0].swapHandcards(event.targets[1]);
    },
    check(card) {
      const list = [], player = _status.event.player;
      const num = player.countCards("he");
      const players = game.filterPlayer();
      let count;
      for (let i2 = 0; i2 < players.length; i2++) {
        if (players[i2] != player && get.attitude(player, players[i2]) > 3) {
          list.push(players[i2]);
        }
      }
      list.sort(function(a, b) {
        return a.countCards("h") - b.countCards("h");
      });
      if (list.length == 0) {
        return -1;
      }
      const from = list[0];
      list.length = 0;
      for (let i2 = 0; i2 < players.length; i2++) {
        if (players[i2] != player && get.attitude(player, players[i2]) < 1) {
          list.push(players[i2]);
        }
      }
      if (list.length == 0) {
        return -1;
      }
      list.sort(function(a, b) {
        return b.countCards("h") - a.countCards("h");
      });
      if (from.countCards("h") >= list[0].countCards("h")) {
        return -1;
      }
      for (let i2 = 0; i2 < list.length && from.countCards("h") < list[i2].countCards("h"); i2++) {
        if (list[i2].countCards("h") - from.countCards("h") <= num) {
          count = list[i2].countCards("h") - from.countCards("h");
          break;
        }
      }
      if (count < 2 && from.countCards("h") >= 2) {
        return -1;
      }
      if (ui.selected.cards.length < count) {
        return 11 - get.value(card);
      }
      return -1;
    },
    ai: {
      order: 6,
      threaten: 3,
      expose: 0.9,
      result: {
        target(player, target) {
          const list = [];
          const num = player.countCards("he");
          const players = game.filterPlayer();
          if (ui.selected.targets.length == 0) {
            for (let i2 = 0; i2 < players.length; i2++) {
              if (players[i2] != player && get.attitude(player, players[i2]) > 3) {
                list.push(players[i2]);
              }
            }
            list.sort(function(a, b) {
              return a.countCards("h") - b.countCards("h");
            });
            if (target == list[0]) {
              return get.attitude(player, target);
            }
            return -get.attitude(player, target);
          } else {
            const from = ui.selected.targets[0];
            for (let i2 = 0; i2 < players.length; i2++) {
              if (players[i2] != player && get.attitude(player, players[i2]) < 1) {
                list.push(players[i2]);
              }
            }
            list.sort(function(a, b) {
              return b.countCards("h") - a.countCards("h");
            });
            if (from.countCards("h") >= list[0].countCards("h")) {
              return -get.attitude(player, target);
            }
            for (let i2 = 0; i2 < list.length && from.countCards("h") < list[i2].countCards("h"); i2++) {
              if (list[i2].countCards("h") - from.countCards("h") <= num) {
                const count = list[i2].countCards("h") - from.countCards("h");
                if (count < 2 && from.countCards("h") >= 2) {
                  return -get.attitude(player, target);
                }
                if (target == list[i2]) {
                  return get.attitude(player, target);
                }
                return -get.attitude(player, target);
              }
            }
          }
        }
      }
    }
  },
  yinghun: {
    audio: 2,
    audioname: ["re_sunjian", "sunce", "re_sunben", "re_sunce", "ol_sunjian"],
    audioname2: {
      re_sunyi: "gzyinghun_re_sunyi",
      boss_sunce: "yinghun_sunce"
    },
    mod: {
      aiOrder(player, card, num) {
        if (num > 0 && _status.event && _status.event.type == "phase" && get.tag(card, "recover")) {
          if (player.needsToDiscard()) {
            return num / 3;
          }
          return 0;
        }
      }
    },
    locked: false,
    trigger: { player: "phaseZhunbeiBegin" },
    preHidden: true,
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), function(card, player2, target) {
        return player2 != target;
      }).set("ai", function(target) {
        const player2 = _status.event.player;
        if (player2.getDamagedHp() == 1 && target.countCards("he") == 0) {
          return 0;
        }
        if (get.attitude(_status.event.player, target) > 0) {
          return 10 + get.attitude(_status.event.player, target);
        }
        if (player2.getDamagedHp() == 1) {
          return -1;
        }
        return 1;
      }).setHiddenSkill(event.name.slice(0, -5)).forResult();
    },
    async content(event, trigger, player) {
      const num = player.getDamagedHp();
      const [target] = event.targets;
      let directcontrol = num == 1;
      if (!directcontrol) {
        const str1 = "摸" + get.cnNumber(num, true) + "弃一";
        const str2 = "摸一弃" + get.cnNumber(num, true);
        directcontrol = str1 == (await player.chooseControl(str1, str2, function(event2, player2) {
          if (player2.isHealthy()) {
            return 1 - _status.event.choice;
          }
          return _status.event.choice;
        }).set("choice", get.attitude(player, target) > 0 ? 0 : 1).forResult()).control;
      }
      if (directcontrol) {
        if (num > 0) {
          await target.draw(num);
        }
        await target.chooseToDiscard(true, "he");
      } else {
        await target.draw();
        if (num > 0) {
          await target.chooseToDiscard(num, true, "he", "allowChooseAll");
        }
      }
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage") && get.itemtype(player) === "player" && target.hp > (player.hasSkillTag("damageBonus", true, {
            target,
            card
          }) ? 2 : 1)) {
            return [1, 0.5];
          }
        }
      },
      threaten(player, target) {
        return Math.max(0.5, target.getDamagedHp() / 2);
      },
      maixie: true
    }
  },
  gzyinghun: {
    audio: "yinghun",
    audioname: ["re_sunjian", "sunce", "re_sunben", "re_sunce", "ol_sunjian", "sb_sunce"],
    audioname2: {
      re_sunyi: "gzyinghun_re_sunyi"
    },
    mod: {
      aiOrder(player, card, num) {
        if (num > 0 && _status.event && _status.event.type == "phase" && get.tag(card, "recover")) {
          if (player.needsToDiscard()) {
            return num / 3;
          }
          return 0;
        }
      }
    },
    locked: false,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return player.getDamagedHp() > 0;
    },
    preHidden: true,
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), function(card, player2, target) {
        return player2 != target;
      }).set("ai", function(target) {
        const player2 = _status.event.player;
        if (player2.getDamagedHp() == 1 && target.countCards("he") == 0) {
          return 0;
        }
        if (get.attitude(_status.event.player, target) > 0) {
          return 10 + get.attitude(_status.event.player, target);
        }
        if (player2.getDamagedHp() == 1) {
          return -1;
        }
        return 1;
      }).setHiddenSkill(event.name.slice(0, -5)).forResult();
    },
    async content(event, trigger, player) {
      const num = player.getDamagedHp();
      const [target] = event.targets;
      let directcontrol = num == 1;
      if (!directcontrol) {
        const str1 = "摸" + get.cnNumber(num, true) + "弃一";
        const str2 = "摸一弃" + get.cnNumber(num, true);
        directcontrol = str1 == (await player.chooseControl(str1, str2, function(event2, player2) {
          return _status.event.choice;
        }).set("choice", get.attitude(player, target) > 0 ? str1 : str2).forResult()).control;
      }
      if (directcontrol) {
        await target.draw(num);
        await target.chooseToDiscard(true, "he");
      } else {
        await target.draw();
        await target.chooseToDiscard(num, true, "he");
      }
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage") && get.itemtype(player) === "player" && target.hp > (player.hasSkillTag("damageBonus", true, {
            target,
            card
          }) ? 2 : 1)) {
            return [1, 0.5];
          }
        }
      },
      threaten(player, target) {
        return Math.max(0.5, target.getDamagedHp() / 2);
      },
      maixie: true
    }
  },
  yinghun_ol_sunjian: { audio: 2 },
  jiuchi: {
    audio: 2,
    audioname: ["re_dongzhuo"],
    enable: "chooseToUse",
    filterCard(card) {
      return get.suit(card) == "spade";
    },
    viewAs: { name: "jiu" },
    viewAsFilter(player) {
      if (!player.countCards("hs", { suit: "spade" })) {
        return false;
      }
      return true;
    },
    prompt: "将一张黑桃手牌当酒使用",
    check(card) {
      if (_status.event.type == "dying") {
        return 1 / Math.max(0.1, get.value(card));
      }
      return 4 - get.value(card);
    },
    ai: {
      threaten: 1.5
    }
  },
  roulin: {
    audio: 2,
    audioname: ["re_dongzhuo", "ol_dongzhuo"],
    trigger: { player: "useCardToPlayered", target: "useCardToTargeted" },
    forced: true,
    filter(event, player) {
      if (event.card.name != "sha") {
        return false;
      }
      if (player == event.player) {
        return event.target.hasSex("female");
      }
      return event.player.hasSex("female");
    },
    check(event, player) {
      return player == event.player;
    },
    async content(event, trigger, player) {
      const id = (player == trigger.player ? trigger.target : player).playerid;
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
      halfneg: true,
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (tag === "directHit_ai") {
          return;
        }
        if (arg.card.name != "sha" || !arg.target.hasSex("female") || arg.target.countCards("h", "shan") > 1) {
          return false;
        }
      }
    }
  },
  benghuai: {
    audio: 2,
    audioname: ["re_dongzhuo", "ol_dongzhuo"],
    audioname2: {
      zhugedan: "benghuai_zhugedan",
      re_zhugedan: "benghuai_re_zhugedan"
    },
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    check() {
      return false;
    },
    filter(event, player) {
      return !player.isMinHp();
    },
    async content(event, trigger, player) {
      const { control } = await player.chooseControl("baonue_hp", "baonue_maxHp", function(event2, player2) {
        if (player2.hp == player2.maxHp) {
          return "baonue_hp";
        }
        if (player2.hp < player2.maxHp - 1 || player2.hp <= 2) {
          return "baonue_maxHp";
        }
        return "baonue_hp";
      }).set("prompt", "崩坏：失去1点体力或减1点体力上限").forResult();
      if (control == "baonue_hp") {
        await player.loseHp();
      } else {
        await player.loseMaxHp(true);
      }
    },
    ai: {
      threaten: 0.5,
      neg: true
    }
  },
  baonue: {
    group: "baonue2",
    audioname: ["re_dongzhuo"],
    audio: "baonue2",
    zhuSkill: true
  },
  baonue2: {
    audio: 2,
    audioname: ["re_dongzhuo"],
    //forceaudio:true,
    trigger: { global: "damageSource" },
    sourceSkill: "baonue",
    filter(event, player) {
      if (player == event.source || !event.source || event.source.group != "qun") {
        return false;
      }
      return player.hasZhuSkill("baonue", event.source);
    },
    async cost(event, trigger, player) {
      event.result = await trigger.source.chooseBool("是否对" + get.translation(player) + "发动【暴虐】？").set("choice", get.attitude(trigger.source, player) > 0).forResult();
    },
    async content(event, trigger, player) {
      trigger.source.line(player, "green");
      const next = trigger.source.judge(function(card) {
        if (get.suit(card) == "spade") {
          return 4;
        }
        return 0;
      });
      next.judge2 = function(result2) {
        return result2.bool ? true : false;
      };
      const result = await next.forResult();
      if (result.suit == "spade") {
        await player.recover();
      }
    }
  },
  luanwu: {
    audio: 2,
    audioname: ["re_jiaxu"],
    enable: "phaseUse",
    filter(event, player) {
      return game.hasPlayer((current) => player != current);
    },
    limited: true,
    skillAnimation: "epic",
    animationColor: "thunder",
    filterTarget: lib.filter.notMe,
    selectTarget: -1,
    multiline: true,
    async contentBefore(event, trigger, player) {
      player.awakenSkill(event.skill);
    },
    async content(event, trigger, player) {
      const { target } = event;
      const result = await target.chooseToUse(
        "乱武：使用一张【杀】或失去1点体力",
        function(card) {
          if (get.name(card) != "sha") {
            return false;
          }
          return lib.filter.filterCard.apply(this, arguments);
        },
        function(card, player2, target2) {
          if (player2 == target2) {
            return false;
          }
          var dist = get.distance(player2, target2);
          if (dist > 1) {
            if (game.hasPlayer(function(current) {
              return current != player2 && get.distance(player2, current) < dist;
            })) {
              return false;
            }
          }
          return lib.filter.filterTarget.apply(this, arguments);
        }
      ).set("ai2", function() {
        return get.effect_use.apply(this, arguments) - get.event().effect;
      }).set("effect", get.effect(target, { name: "losehp" }, target, target)).set("addCount", false).forResult();
      if (!result?.bool) {
        await target.loseHp();
      }
    },
    ai: {
      order: 1,
      result: {
        player(player) {
          if (lib.config.mode == "identity" && game.zhu.isZhu && player.identity == "fan") {
            if (game.zhu.hp == 1 && game.zhu.countCards("h") <= 2) {
              return 1;
            }
          }
          const players = game.filterPlayer();
          let num = 0;
          for (let i2 = 0; i2 < players.length; i2++) {
            let att = get.attitude(player, players[i2]);
            if (att > 0) {
              att = 1;
            }
            if (att < 0) {
              att = -1;
            }
            if (players[i2] != player && players[i2].hp <= 3) {
              const hs = players[i2].countCards("hs");
              if (hs === 0) {
                num += att / players[i2].hp;
              } else if (hs === 1) {
                num += att / 2 / players[i2].hp;
              } else if (hs === 2) {
                num += att / 4 / players[i2].hp;
              }
            }
            if (players[i2].hp == 1) {
              num += att * 1.5;
            }
          }
          if (player.hp == 1) {
            return -num;
          }
          if (player.hp == 2) {
            return -game.players.length / 4 - num;
          }
          return -game.players.length / 3 - num;
        }
      }
    }
  },
  wansha: {
    locked: true,
    audio: 2,
    audioname: ["re_jiaxu", "boss_lvbu3", "new_simayi"],
    audioname2: { shen_simayi: "jilue_wansha" },
    global: "wansha2",
    trigger: { global: "dying" },
    priority: 15,
    forced: true,
    preHidden: true,
    filter(event, player, name) {
      return _status.currentPhase == player && event.player != player;
    },
    async content() {
    }
  },
  wansha2: {
    mod: {
      cardSavable(card, player) {
        if (card.name == "tao" && _status.currentPhase?.isIn() && _status.currentPhase.hasSkill("wansha") && _status.currentPhase != player) {
          if (!player.isDying()) {
            return false;
          }
        }
      },
      cardEnabled(card, player) {
        if (card.name == "tao" && _status.currentPhase?.isIn() && _status.currentPhase.hasSkill("wansha") && _status.currentPhase != player) {
          if (!player.isDying()) {
            return false;
          }
        }
      }
    }
  },
  weimu: {
    trigger: { global: "useCard1" },
    audio: 2,
    audioname2: {
      wangyuanji: "qc_weimu",
      boss_chujiangwang: "boss_chujiangwang_weimu"
    },
    forced: true,
    firstDo: true,
    filter(event, player) {
      if (event.player == player) {
        return false;
      }
      if (get.color(event.card) != "black" || get.type(event.card) != "trick") {
        return false;
      }
      var info = lib.card[event.card.name];
      return info && info.selectTarget && info.selectTarget == -1 && !info.toself;
    },
    async content(event, trigger, player) {
    },
    mod: {
      targetEnabled(card) {
        if ((get.type(card) == "trick" || get.type(card) == "delay") && get.color(card) == "black") {
          return false;
        }
      }
    }
  },
  huoji: {
    audio: 2,
    enable: "chooseToUse",
    filterCard(card) {
      return get.color(card) == "red";
    },
    viewAs: { name: "huogong" },
    viewAsFilter(player) {
      if (!player.countCards("hs", { color: "red" })) {
        return false;
      }
    },
    position: "hs",
    prompt: "将一张红色牌当火攻使用",
    check(card) {
      const player = get.player();
      if (player.countCards("h") > player.hp) {
        return 6 - get.value(card);
      }
      return 3 - get.value(card);
    },
    ai: {
      fireAttack: true
    }
  },
  bazhen: {
    audio: 2,
    audioname: ["re_sp_zhugeliang", "ol_sp_zhugeliang", "ol_pangtong"],
    group: "bazhen_bagua",
    locked: true,
    init(player, skill) {
      player.addExtraEquip(skill, "bagua", true, (player2) => player2.hasEmptySlot(2) && lib.card.bagua);
    },
    onremove(player, skill) {
      player.removeExtraEquip(skill);
    }
  },
  bazhen_bagua: {
    audio: "bazhen",
    audioname: ["re_sp_zhugeliang", "ol_sp_zhugeliang", "ol_pangtong"],
    equipSkill: true,
    noHidden: true,
    inherit: "bagua_skill",
    sourceSkill: "bazhen",
    filter(event, player) {
      if (!lib.skill.bagua_skill.filter(event, player)) {
        return false;
      }
      if (!player.hasEmptySlot(2)) {
        return false;
      }
      return true;
    },
    ai: {
      respondShan: true,
      freeShan: true,
      skillTagFilter(player, tag, arg) {
        if (tag !== "respondShan" && tag !== "freeShan") {
          return;
        }
        if (!player.hasEmptySlot(2) || player.hasSkillTag("unequip2")) {
          return false;
        }
        if (!arg || !arg.player) {
          return true;
        }
        if (arg.player.hasSkillTag("unequip", false, {
          target: player
        })) {
          return false;
        }
        return true;
      },
      effect: {
        target(card, player, target) {
          if (player == target && get.subtype(card) == "equip2") {
            if (get.equipValue(card) <= 7.5) {
              return 0;
            }
          }
          if (!target.hasEmptySlot(2)) {
            return;
          }
          return lib.skill.bagua_skill.ai.effect.target.apply(this, arguments);
        }
      }
    }
  },
  kanpo: {
    mod: {
      aiValue(player, card, num) {
        if (get.name(card) != "wuxie" && get.color(card) != "black") {
          return;
        }
        const cards2 = player.getCards("hs", function(card2) {
          return get.name(card2) == "wuxie" || get.color(card2) == "black";
        });
        cards2.sort(function(a, b) {
          return (get.name(b) == "wuxie" ? 1 : 2) - (get.name(a) == "wuxie" ? 1 : 2);
        });
        const geti = function() {
          if (cards2.includes(card)) {
            return cards2.indexOf(card);
          }
          return cards2.length;
        };
        if (get.name(card) == "wuxie") {
          return Math.min(num, [6, 4, 3][Math.min(geti(), 2)]) * 0.6;
        }
        return Math.max(num, [6, 4, 3][Math.min(geti(), 2)]);
      },
      aiUseful() {
        return lib.skill.kanpo.mod.aiValue.apply(this, arguments);
      }
    },
    locked: false,
    audio: 2,
    enable: "chooseToUse",
    filterCard(card) {
      return get.color(card) == "black";
    },
    viewAsFilter(player) {
      return player.countCards("hs", { color: "black" }) > 0;
    },
    viewAs: { name: "wuxie" },
    position: "hs",
    prompt: "将一张黑色手牌当无懈可击使用",
    check(card) {
      const tri = _status.event.getTrigger();
      if (tri && tri.card && tri.card.name == "chiling") {
        return -1;
      }
      return 8 - get.value(card);
    },
    threaten: 1.2
  },
  niepan: {
    audio: 2,
    audioname: ["re_pangtong"],
    audioname2: { sb_pangtong: "sbniepan" },
    enable: "chooseToUse",
    limited: true,
    skillAnimation: true,
    animationColor: "fire",
    filter(event, player) {
      if (event.type == "dying") {
        if (player != event.dying) {
          return false;
        }
        return true;
      } else if (event.getParent().name == "phaseUse") {
        return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      player.storage.niepan = true;
      await player.discard(player.getCards("hej"));
      await player.link(false);
      await player.turnOver(false);
      await player.draw(3);
      if (player.hp < 3) {
        await player.recover(3 - player.hp);
      }
    },
    ai: {
      order: 0.5,
      skillTagFilter(player, tag, target) {
        if (player != target || player.storage.niepan) {
          return false;
        }
      },
      save: true,
      result: {
        player(player) {
          if (player.hp <= 0) {
            return 10;
          }
          if (player.hp <= 1 && player.countCards("he") <= 1) {
            return 10;
          }
          return 0;
        }
      },
      threaten(player, target) {
        if (!target.storage.niepan) {
          return 0.6;
        }
      }
    }
  },
  oldniepan: {
    audio: "niepan",
    audioname2: { sb_pangtong: "sbniepan" },
    enable: "chooseToUse",
    skillAnimation: true,
    limited: true,
    animationColor: "orange",
    filter(event, player) {
      if (event.type == "dying") {
        if (player != event.dying) {
          return false;
        }
        return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      player.storage.oldniepan = true;
      await player.discard(player.getCards("hej"));
      await player.link(false);
      await player.turnOver(false);
      await player.draw(3);
      if (player.hp < 3) {
        await player.recover(3 - player.hp);
      }
    },
    ai: {
      order: 1,
      skillTagFilter(player, arg, target) {
        if (player != target || player.storage.oldniepan) {
          return false;
        }
      },
      save: true,
      result: {
        player(player) {
          if (player.hp <= 0) {
            return 10;
          }
          if (player.hp <= 2 && player.countCards("he") <= 1) {
            return 10;
          }
          return 0;
        }
      },
      threaten(player, target) {
        if (!target.storage.oldniepan) {
          return 0.6;
        }
      }
    }
  },
  quhu: {
    audio: 2,
    audioname: ["re_xunyu", "ol_xunyu"],
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      if (player.countCards("h") == 0) {
        return false;
      }
      return game.hasPlayer(function(current) {
        return current.hp > player.hp && player.canCompare(current);
      });
    },
    filterTarget(card, player, target) {
      return target.hp > player.hp && player.canCompare(target);
    },
    async content(event, trigger, player) {
      const target = event.target;
      const { bool } = await player.chooseToCompare(target).forResult();
      if (!bool) {
        return void await player.damage(target);
      }
      if (!game.hasPlayer(function(player2) {
        return player2 != target && target.inRange(player2);
      })) {
        return;
      }
      const result = await player.chooseTarget(function(card, player2, target2) {
        const source = _status.event.source;
        return target2 != source && source.inRange(target2);
      }, true).set("ai", function(target2) {
        return get.damageEffect(target2, _status.event.source, player);
      }).set("source", target).forResult();
      if (!result.bool || !result.targets || !result.targets.length) {
        return;
      }
      target.line(result.targets[0], "green");
      await result.targets[0].damage(target);
    },
    ai: {
      order: 0.5,
      result: {
        target(player, target) {
          const att = get.attitude(player, target);
          const oc = target.countCards("h") == 1;
          if (att > 0 && oc) {
            return 0;
          }
          const players = game.filterPlayer();
          for (let i2 = 0; i2 < players.length; i2++) {
            if (players[i2] != target && players[i2] != player && target.inRange(players[i2])) {
              if (get.damageEffect(players[i2], target, player) > 0) {
                return att > 0 ? att / 2 : att - (oc ? 5 : 0);
              }
            }
          }
          return 0;
        },
        player(player, target) {
          if (target.hasSkillTag("jueqing", false, target)) {
            return -10;
          }
          const hs = player.getCards("h");
          let mn = 1;
          for (let i2 = 0; i2 < hs.length; i2++) {
            mn = Math.max(mn, get.number(hs[i2]));
          }
          if (mn <= 11 && player.hp < 2) {
            return -20;
          }
          let max = player.maxHp - hs.length;
          const players = game.filterPlayer();
          for (let i2 = 0; i2 < players.length; i2++) {
            if (get.attitude(player, players[i2]) > 2) {
              max = Math.max(Math.min(5, players[i2].hp) - players[i2].countCards("h"), max);
            }
          }
          switch (max) {
            case 0:
              return mn == 13 ? 0 : -20;
            case 1:
              return mn >= 12 ? 0 : -15;
            case 2:
              return 0;
            case 3:
              return 1;
            default:
              return max;
          }
        }
      },
      expose: 0.2
    }
  },
  jieming: {
    audio: 2,
    trigger: { player: "damageEnd" },
    getIndex(event) {
      return event.num;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), function(card, player2, target) {
        return true;
      }).set("ai", function(target) {
        let att = get.attitude(_status.event.player, target);
        if (target.hasSkillTag("nogain")) {
          att /= 6;
        }
        if (att > 2) {
          return Math.max(0, Math.min(5, target.maxHp) - target.countCards("h"));
        }
        return att / 3;
      }).forResult();
    },
    async content(event, trigger, player) {
      for (const target of event.targets) {
        await target.drawTo(Math.min(5, target.maxHp));
      }
    },
    ai: {
      maixie: true,
      maixie_hp: true,
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "damage") && target.hp > 1) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return [1, -2];
            }
            const players = game.filterPlayer();
            let max = 0;
            for (let i2 = 0; i2 < players.length; i2++) {
              if (get.attitude(target, players[i2]) > 0) {
                max = Math.max(Math.min(5, players[i2].hp) - players[i2].countCards("h"), max);
              }
            }
            switch (max) {
              case 0:
                return 2;
              case 1:
                return 1.5;
              case 2:
                return [1, 2];
              default:
                return [0, max];
            }
          }
          if ((card.name == "tao" || card.name == "caoyao") && target.hp > 1 && target.countCards("h") <= target.hp) {
            return [0, 0];
          }
        }
      }
    }
  },
  qiangxix: {
    audio: "qiangxi",
    audioname: ["boss_lvbu3"],
    mod: {
      aiOrder(player, card, num) {
        if (player.getEquips(1).length || get.subtype(card, player) !== "equip1" || !player.hasSkillTag("noe")) {
          return num;
        }
        return 10;
      }
    },
    enable: "phaseUse",
    usable: 2,
    locked: false,
    filter(event, player) {
      if (player.hp < 1 && !player.hasCard((card) => lib.skill.qiangxix.filterCard(card), "he")) {
        return false;
      }
      return game.hasPlayer((current) => lib.skill.qiangxix.filterTarget(null, player, current));
    },
    filterCard(card) {
      return get.subtype(card) == "equip1";
    },
    position: "he",
    filterTarget(card, player, target) {
      if (target == player) {
        return false;
      }
      var stat = player.getStat()._qiangxix;
      return !stat || !stat.includes(target);
    },
    selectCard() {
      if (_status.event.player.hp < 1) {
        return 1;
      }
      return [0, 1];
    },
    async content(event, trigger, player) {
      const { target, cards: cards2 } = event;
      const stat = player.getStat();
      stat._qiangxix ??= [];
      stat._qiangxix.push(target);
      if (!cards2?.length) {
        await player.loseHp();
      }
      await target.damage("nocard");
    },
    ai: {
      damage: true,
      order: 8,
      result: {
        player(player, target) {
          if (ui.selected.cards.length) {
            return 0;
          }
          if (player.hp >= target.hp) {
            return -0.9;
          }
          if (player.hp <= 2) {
            return -10;
          }
          return get.effect(player, { name: "losehp" }, player, player);
        },
        target(player, target) {
          if (!ui.selected.cards.length) {
            if (player.hp < 2) {
              return 0;
            }
            if (player.hp == 2 && target.hp >= 2) {
              return 0;
            }
            if (target.hp > player.hp) {
              return 0;
            }
          }
          return get.damageEffect(target, player, target);
        }
      },
      threaten: 1.5
    }
  },
  qiangxi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    audioname: ["boss_lvbu3"],
    filterCard(card) {
      return get.subtype(card) == "equip1";
    },
    selectCard: [0, 1],
    filterTarget(card, player, target) {
      if (player == target) {
        return false;
      }
      return player.inRange(target);
    },
    async content(event, trigger, player) {
      if (event.cards.length == 0) {
        await player.loseHp();
      }
      await event.target.damage("nocard");
    },
    check(card) {
      return 10 - get.value(card);
    },
    position: "he",
    ai: {
      damage: true,
      order: 8,
      result: {
        player(player, target) {
          if (ui.selected.cards.length) {
            return 0;
          }
          if (player.hp >= target.hp) {
            return -0.9;
          }
          if (player.hp <= 2) {
            return -10;
          }
          return -2;
        },
        target(player, target) {
          if (!ui.selected.cards.length) {
            if (player.hp < 2) {
              return 0;
            }
            if (player.hp == 2 && target.hp >= 2) {
              return 0;
            }
            if (target.hp > player.hp) {
              return 0;
            }
          }
          return get.damageEffect(target, player);
        }
      },
      threaten: 1.3
    }
  },
  xinqiangxi: {
    audio: "qiangxi",
    enable: "phaseUse",
    filter(event, player) {
      const list = player.getStorage("xinqiangxi_used");
      if (list.includes("discard")) {
        return !list.includes("losehp");
      } else if (list.includes("losehp")) {
        return !list.includes("discard") && player.countCards("he", { type: "equip" }) > 0;
      } else {
        return true;
      }
    },
    filterCard(card) {
      const player = _status.event.player;
      if (player.getStorage("xinqiangxi_used").includes("discard")) {
        return false;
      }
      return get.type(card) == "equip";
    },
    selectCard() {
      const player = _status.event.player;
      if (player.getStorage("xinqiangxi_used").includes("discard")) {
        return -1;
      }
      if (player.getStorage("xinqiangxi_used").includes("losehp")) {
        return [1, 1];
      }
      return [0, 1];
    },
    filterTarget(card, player, target) {
      if (player == target) {
        return false;
      }
      return player.inRange(target);
    },
    async content(event, trigger, player) {
      player.addTempSkill("xinqiangxi_used");
      if (event.cards.length == 0) {
        player.markAuto("xinqiangxi_used", "losehp");
        await player.loseHp();
      } else {
        player.markAuto("xinqiangxi_used", "discard");
      }
      await event.target.damage("nocard");
    },
    check(card) {
      return 10 - get.value(card);
    },
    position: "he",
    ai: {
      order: 8.5,
      result: {
        target(player, target) {
          if (!ui.selected.cards.length) {
            if (player.hp < 2) {
              return 0;
            }
            if (target.hp >= player.hp) {
              return 0;
            }
          }
          return get.damageEffect(target, player);
        }
      }
    },
    threaten: 1.5,
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  tianyi: {
    audio: 2,
    audioname: ["re_taishici"],
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return player.canCompare(target);
    },
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      const { bool } = await player.chooseToCompare(event.target).forResult();
      if (bool) {
        player.addTempSkill("tianyi2");
      } else {
        player.addTempSkill("tianyi3");
      }
    },
    ai: {
      order(name, player) {
        const cards2 = player.getCards("h");
        if (player.countCards("h", "sha") == 0) {
          return 1;
        }
        for (let i2 = 0; i2 < cards2.length; i2++) {
          if (cards2[i2].name != "sha" && get.number(cards2[i2]) > 11 && get.value(cards2[i2]) < 7) {
            return 9;
          }
        }
        return get.order({ name: "sha" }) - 1;
      },
      result: {
        player(player) {
          if (player.countCards("h", "sha") > 0) {
            return 0.6;
          }
          const num = player.countCards("h");
          if (num > player.hp) {
            return 0;
          }
          if (num == 1) {
            return -2;
          }
          if (num == 2) {
            return -1;
          }
          return -0.7;
        },
        target(player, target) {
          const num = target.countCards("h");
          if (num == 1) {
            return -1;
          }
          if (num == 2) {
            return -0.7;
          }
          return -0.5;
        }
      },
      threaten: 1.3
    }
  },
  tianyi2: {
    mod: {
      targetInRange(card, player, target, now) {
        if (card.name == "sha") {
          return true;
        }
      },
      selectTarget(card, player, range) {
        if (card.name == "sha" && range[1] != -1) {
          range[1]++;
        }
      },
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return num + 1;
        }
      }
    },
    charlotte: true
  },
  tianyi3: {
    mod: {
      cardEnabled(card) {
        if (card.name == "sha") {
          return false;
        }
      }
    },
    charlotte: true
  },
  shuangxiong: {
    audio: 2,
    audioname: ["re_yanwen"],
    group: "shuangxiong_judge",
    subSkill: {
      judge: {
        audio: "shuangxiong",
        logAudio: () => 1,
        trigger: { player: "phaseDrawBegin1" },
        check(event, player) {
          if (player.countCards("h") > player.hp) {
            return true;
          }
          if (player.countCards("h") > 3) {
            return true;
          }
          return false;
        },
        filter(event, player) {
          return !event.numFixed;
        },
        preHidden: true,
        prompt2: () => "进行一次判定，本回合可以将一张与此牌颜色不同的手牌当作【决斗】使用",
        async content(event, trigger, player) {
          trigger.changeToZero();
          await player.judge().set("callback", lib.skill.shuangxiong_judge.callback);
        },
        async callback(event, trigger, player) {
          await player.gain(event.card, "gain2");
          player.addTempSkill("shuangxiong_viewas");
          player.markAuto("shuangxiong_viewas", [event.judgeResult.color]);
        }
      },
      viewas: {
        charlotte: true,
        onremove: true,
        audio: "shuangxiong",
        logAudio: () => "shuangxiong2.mp3",
        enable: "chooseToUse",
        viewAs: { name: "juedou" },
        position: "hs",
        viewAsFilter(player) {
          return player.hasCard((card) => lib.skill.shuangxiong_viewas.filterCard(card, player), "hs");
        },
        filterCard(card, player) {
          const color = get.color(card), colors = player.getStorage("shuangxiong_viewas");
          for (const i2 of colors) {
            if (color != i2) {
              return true;
            }
          }
          return false;
        },
        prompt() {
          const colors = _status.event.player.getStorage("shuangxiong_viewas");
          let str = "将一张颜色";
          for (let i2 = 0; i2 < colors.length; i2++) {
            if (i2 > 0) {
              str += "或";
            }
            str += "不为";
            str += get.translation(colors[i2]);
          }
          str += "的手牌当做【决斗】使用";
          return str;
        },
        check(card) {
          const player = _status.event.player;
          const raw = player.getUseValue(card, null, true);
          const eff = player.getUseValue(get.autoViewAs({ name: "juedou" }, [card]));
          return eff - raw;
        },
        ai: { order: 7 }
      },
      re_yanwen1: { audio: true },
      re_yanwen2: { audio: true }
    }
  },
  shuangxiong1: {
    audio: true,
    trigger: { player: "phaseDrawBegin1" },
    sourceSkill: "shuangxiong",
    check(event, player) {
      if (player.countCards("h") > player.hp) {
        return true;
      }
      if (player.countCards("h") > 3) {
        return true;
      }
      return false;
    },
    filter(event, player) {
      return !event.numFixed;
    },
    preHidden: true,
    prompt2: () => "进行一次判定，本回合可以将一张与此牌颜色不同的手牌当作【决斗】使用",
    async content(event, trigger, player) {
      trigger.changeToZero();
      await player.judge().set("callback", lib.skill.shuangxiong1.callback);
    },
    async callback(event, trigger, player) {
      await player.gain(event.card, "gain2");
      player.addTempSkill("shuangxiong2");
      player.markAuto("shuangxiong2", [event.judgeResult.color]);
    }
  },
  shuangxiong2: {
    charlotte: true,
    onremove: true,
    audio: true,
    audioname2: {
      re_yanwen: "shuangxiong_re_yanwen2"
    },
    enable: "chooseToUse",
    viewAs: { name: "juedou" },
    position: "hs",
    sourceSkill: "shuangxiong",
    viewAsFilter(player) {
      return player.hasCard((card) => lib.skill.shuangxiong2.filterCard(card, player), "hs");
    },
    filterCard(card, player) {
      const color = get.color(card), colors = player.getStorage("shuangxiong2");
      for (const i2 of colors) {
        if (color != i2) {
          return true;
        }
      }
      return false;
    },
    prompt() {
      const colors = _status.event.player.getStorage("shuangxiong2");
      let str = "将一张颜色";
      for (let i2 = 0; i2 < colors.length; i2++) {
        if (i2 > 0) {
          str += "或";
        }
        str += "不为";
        str += get.translation(colors[i2]);
      }
      str += "的手牌当做【决斗】使用";
      return str;
    },
    check(card) {
      const player = _status.event.player;
      const raw = player.getUseValue(card, null, true);
      const eff = player.getUseValue(get.autoViewAs({ name: "juedou" }, [card]));
      return eff - raw;
    },
    ai: { order: 7 }
  },
  luanji: {
    audio: 2,
    enable: "phaseUse",
    position: "hs",
    viewAs: { name: "wanjian" },
    filterCard(card, player) {
      if (ui.selected.cards.length) {
        return get.suit(card) == get.suit(ui.selected.cards[0]);
      }
      const cards2 = player.getCards("hs");
      for (let i2 = 0; i2 < cards2.length; i2++) {
        if (card != cards2[i2]) {
          if (get.suit(card) == get.suit(cards2[i2])) {
            return true;
          }
        }
      }
      return false;
    },
    selectCard: 2,
    complexCard: true,
    check(card) {
      const player = _status.event.player;
      const targets = game.filterPlayer(function(current) {
        return player.canUse("wanjian", current);
      });
      let num = 0;
      for (let i2 = 0; i2 < targets.length; i2++) {
        let eff = get.sgn(get.effect(targets[i2], { name: "wanjian" }, player, player));
        if (targets[i2].hp == 1) {
          eff *= 1.5;
        }
        num += eff;
      }
      if (!player.needsToDiscard(-1)) {
        if (targets.length >= 7) {
          if (num < 2) {
            return 0;
          }
        } else if (targets.length >= 5) {
          if (num < 1.5) {
            return 0;
          }
        }
      }
      return 6 - get.value(card);
    },
    ai: {
      basic: {
        order: 8.5
      }
    }
  },
  xueyi: {
    trigger: { player: "phaseDiscardBefore" },
    audio: 2,
    audioname: ["re_yuanshao"],
    audioname2: {
      pe_jun_yuanshao: ["xueyi_re_yuanshao1.mp3", "xueyi_re_yuanshao2.mp3"]
    },
    forced: true,
    firstDo: true,
    filter(event, player) {
      return player.hasZhuSkill("xueyi") && game.hasPlayer(function(current) {
        return current != player && current.group == "qun";
      }) && player.countCards("h") > player.hp;
    },
    async content() {
    },
    mod: {
      maxHandcard(player, num) {
        if (player.hasZhuSkill("xueyi")) {
          return num + game.countPlayer(function(current) {
            if (player != current && current.group == "qun") {
              return 2;
            }
          });
        }
        return num;
      }
    },
    zhuSkill: true
  },
  mengjin: {
    audio: 2,
    trigger: { player: "shaMiss" },
    //priority:-1,
    filter(event) {
      return event.target.countCards("he") > 0;
    },
    check(event, player) {
      return get.attitude(player, event.target) < 0;
    },
    logTarget: "target",
    async content(event, trigger, player) {
      await player.discardPlayerCard("he", trigger.target, true);
    }
  },
  jiewei: {
    trigger: { player: "turnOverEnd" },
    //direct:true,
    frequent: true,
    audio: "xinjiewei",
    async content(event, trigger, player) {
      await player.draw();
      const result = await player.chooseToUse(function(card) {
        if (!lib.filter.cardEnabled(card, _status.event.player, _status.event)) {
          return false;
        }
        const type2 = get.type(card, "trick");
        return type2 == "trick" || type2 == "equip";
      }, "是否使用一张锦囊牌或装备牌？").forResult();
      if (!result.bool) {
        return;
      }
      const type = get.type(result.card || result.cards[0]);
      if (!game.hasPlayer(function(current) {
        if (type == "equip") {
          return current.countCards("e");
        } else {
          return current.countCards("j");
        }
      })) {
        return;
      }
      const next = player.chooseTarget("是否弃置场上的一张" + get.translation(type) + "牌？", function(card, player2, target) {
        if (_status.event.type == "equip") {
          return target.countCards("e") > 0;
        } else {
          return target.countCards("j") > 0;
        }
      });
      next.set("ai", function(target) {
        if (type == "equip") {
          return -get.attitude(player, target);
        } else {
          return get.attitude(player, target);
        }
      });
      next.set("type", type);
      event.type = type;
      const result2 = await next.forResult();
      if (type && result2.bool && result2.targets && result2.targets.length) {
        player.line(result2.targets, "green");
        if (type == "equip") {
          player.discardPlayerCard(result2.targets[0], "e", true);
        } else {
          player.discardPlayerCard(result2.targets[0], "j", true);
        }
      }
    },
    ai: {
      combo: "moon_jushou"
    }
  },
  releiji: {
    audio: 2,
    audioname: ["boss_qinglong"],
    trigger: { player: ["useCard", "respond"] },
    filter(event, player) {
      return event.card.name == "shan";
    },
    line: "thunder",
    async cost(event, trigger, player) {
      const next = player.chooseTarget(get.prompt2(event.skill), function(card, player2, target) {
        return target != player2;
      });
      next.ai = function(target) {
        if (target.hasSkill("hongyan")) {
          return 0;
        }
        return get.damageEffect(target, _status.event.player, _status.event.player, "thunder");
      };
      event.result = await next.forResult();
    },
    async content(event, trigger, player) {
      const [target] = event.targets;
      const next = target.judge(function(card) {
        const suit2 = get.suit(card);
        if (suit2 == "spade") {
          return -4;
        }
        if (suit2 == "club") {
          return -2;
        }
        return 0;
      });
      next.judge2 = function(result) {
        return result.bool == false;
      };
      const { suit } = await next.forResult();
      if (suit == "club") {
        await player.recover();
        await target.damage("thunder");
      } else if (suit == "spade") {
        await target.damage(2, "thunder");
      }
    },
    ai: {
      useShan: true,
      effect: {
        target_use(card, player, target, current) {
          if (get.tag(card, "respondShan") && !player.hasSkillTag(
            "directHit_ai",
            true,
            {
              target,
              card
            },
            true
          )) {
            let club = 0, spade = 0;
            if (game.hasPlayer(function(current2) {
              return get.attitude(target, current2) < 0 && get.damageEffect(current2, target, target, "thunder") > 0;
            })) {
              club = 2;
              spade = 4;
            }
            if (!target.isHealthy()) {
              club += 2;
            }
            if (!club && !spade) {
              return 1;
            }
            if (card.name === "sha") {
              if (!target.mayHaveShan(player, "use")) {
                return;
              }
            } else if (!target.mayHaveShan(player)) {
              return 1 - 0.1 * Math.min(5, target.countCards("hs"));
            }
            if (!target.hasSkillTag("rejudge")) {
              return [1, (club + spade) / 4];
            }
            let pos = player.hasSkillTag("viewHandcard", null, target, true) ? "hes" : "e", better = club > spade ? "club" : "spade", max = 0;
            target.hasCard(function(cardx) {
              if (get.suit(cardx) === better) {
                max = 2;
                return true;
              }
              if (spade && get.color(cardx) === "black") {
                max = 1;
              }
            }, pos);
            if (max === 2) {
              return [1, Math.max(club, spade)];
            }
            if (max === 1) {
              return [1, Math.min(club, spade)];
            }
            if (pos === "e") {
              return [1, Math.min(Math.max(1, target.countCards("hs")) * (club + spade) / 4, Math.max(club, spade))];
            }
            return [1, (club + spade) / 4];
          }
        }
      }
    }
  },
  shensu: {
    audio: "shensu1",
    audioname: ["xiahouba", "re_xiahouyuan", "ol_xiahouyuan"],
    group: ["shensu1", "shensu2"],
    preHidden: ["shensu1", "shensu2"]
  },
  xinshensu: {
    audio: "shensu1",
    audioname: ["xiahouba", "re_xiahouyuan", "ol_xiahouyuan"],
    group: ["xinshensu_1", "xinshensu_2", "shensu4"],
    preHidden: ["xinshensu_1", "xinshensu_2", "shensu4"],
    subSkill: {
      1: {
        audio: "shensu1",
        inherit: "shensu1",
        sourceSkill: "xinshensu"
      },
      2: {
        inherit: "shensu2",
        sourceSkill: "xinshensu"
      }
    }
  },
  shensu1_xiahouba: { audio: 2 },
  shensu1: {
    audio: 2,
    audioname: ["xiahouba", "re_xiahouyuan", "ol_xiahouyuan"],
    trigger: { player: "phaseJudgeBefore" },
    sourceSkill: "shensu",
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "跳过判定阶段和摸牌阶段，视为对一名其他角色使用一张【杀】", function(card, player2, target) {
        if (player2 == target) {
          return false;
        }
        return player2.canUse({ name: "sha" }, target, false);
      }).set("check", player.countCards("h") > 2).set("ai", function(target) {
        if (!_status.event.check) {
          return 0;
        }
        return get.effect(target, { name: "sha" }, _status.event.player);
      }).setHiddenSkill(event.skill).forResult();
    },
    async content(event, trigger, player) {
      trigger.cancel();
      player.skip("phaseDraw");
      await player.useCard({ name: "sha", isCard: true }, event.targets[0], false);
    }
  },
  shensu2: {
    audio: "shensu1",
    audioname: ["xiahouba", "re_xiahouyuan", "ol_xiahouyuan"],
    trigger: { player: "phaseUseBefore" },
    sourceSkill: "shensu",
    filter(event, player) {
      return player.countCards("he", function(card) {
        if (_status.connectMode) {
          return true;
        }
        return get.type(card) == "equip";
      }) > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        prompt: get.prompt(event.skill),
        prompt2: "弃置一张装备牌并跳过出牌阶段，视为对一名其他角色使用一张【杀】",
        filterCard(card, player2) {
          return get.type(card) == "equip" && lib.filter.cardDiscardable(card, player2);
        },
        position: "he",
        filterTarget(card, player2, target) {
          if (player2 == target) {
            return false;
          }
          return player2.canUse({ name: "sha" }, target, false);
        },
        ai1(card) {
          if (_status.event.check) {
            return 0;
          }
          return 6 - get.value(card);
        },
        ai2(target) {
          if (_status.event.check) {
            return 0;
          }
          return get.effect(target, { name: "sha" }, _status.event.player);
        },
        check: player.countCards("hs", (i2) => {
          return player.hasValueTarget(i2, null, true);
        }) > player.hp - 1
      }).setHiddenSkill(event.skill).forResult();
    },
    async content(event, trigger, player) {
      trigger.cancel();
      await player.discard(event.cards[0]);
      await player.useCard({ name: "sha", isCard: true }, event.targets[0], false);
    }
  },
  shensu4: {
    audio: "shensu1",
    audioname: ["xiahouba", "re_xiahouyuan", "ol_xiahouyuan"],
    trigger: { player: "phaseDiscardBefore" },
    sourceSkill: "xinshensu",
    async cost(event, trigger, player) {
      const check = player.needsToDiscard() || player.isTurnedOver() || player.hasSkill("shebian") && player.canMoveCard(true, true);
      event.result = await player.chooseTarget(get.prompt(event.skill), "跳过弃牌阶段并将武将牌翻面，视为对一名其他角色使用一张【杀】", function(card, player2, target) {
        if (player2 == target) {
          return false;
        }
        return player2.canUse({ name: "sha" }, target, false);
      }).set("check", check).set("ai", function(target) {
        if (!_status.event.check) {
          return 0;
        }
        return get.effect(target, { name: "sha" }, _status.event.player, _status.event.player);
      }).setHiddenSkill(event.skill).forResult();
    },
    async content(event, trigger, player) {
      trigger.cancel();
      await player.turnOver();
      await player.useCard({ name: "sha", isCard: true }, event.targets[0], false);
    }
  },
  jushou: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    check(event, player) {
      return event.player.hp + player.countCards("h") < 4;
    },
    async content(event, trigger, player) {
      await player.draw(3);
      await player.turnOver();
    }
  },
  moon_jushou: {
    audio: "xinjushou",
    trigger: { player: "phaseJieshuBegin" },
    check(event, player) {
      return event.player.hp + player.countCards("h") < 4;
    },
    async content(event, trigger, player) {
      await player.draw();
      await player.turnOver();
    }
  },
  liegong: {
    audio: 2,
    audioname: ["re_huangzhong"],
    trigger: { player: "useCardToPlayered" },
    check(event, player) {
      return get.attitude(player, event.target) <= 0;
    },
    logTarget: "target",
    filter(event, player) {
      if (event.card.name != "sha") {
        return false;
      }
      const length = event.target.countCards("h");
      return length >= player.hp || length <= player.getAttackRange();
    },
    preHidden: true,
    async content(event, trigger, player) {
      trigger.getParent().directHit.push(trigger.target);
    },
    locked: false,
    mod: {
      attackRange(player, distance) {
        if (get.zhu(player, "shouyue")) {
          return distance + 1;
        }
      }
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (get.attitude(player, arg.target) > 0 || arg.card.name != "sha") {
          return false;
        }
        const length = arg.target.countCards("h");
        return length >= player.hp || length <= player.getAttackRange();
      }
    }
  },
  kuanggu: {
    audio: 2,
    audioname: ["re_weiyan", "ol_weiyan"],
    trigger: { source: "damageSource" },
    forced: true,
    filter(event, player) {
      return event.checkKuanggu && player.isDamaged();
    },
    async content(event, trigger, player) {
      await player.recover(trigger.num);
    }
  },
  tianxiang: {
    audio: 2,
    audioname: ["daxiaoqiao", "re_xiaoqiao", "ol_xiaoqiao"],
    trigger: { player: "damageBegin3" },
    filter(event, player) {
      return player.countCards("h", { suit: "heart" }) > 0 && event.num > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        filterCard(card, player2) {
          return get.suit(card) == "heart" && lib.filter.cardDiscardable(card, player2);
        },
        filterTarget(card, player2, target) {
          return player2 != target;
        },
        ai1(card) {
          return 10 - get.value(card);
        },
        ai2(target) {
          const att = get.attitude(_status.event.player, target);
          const trigger2 = _status.event.getTrigger();
          let da = 0;
          if (_status.event.player.hp == 1) {
            da = 10;
          }
          if (trigger2.num > 1) {
            if (target.maxHp > 5 && target.hp > 1) {
              return -att / 10 + da;
            }
            return -att + da;
          }
          const eff = get.damageEffect(target, trigger2.source, target, trigger2.nature);
          if (att == 0) {
            return 0.1 + da;
          }
          if (eff >= 0 && trigger2.num == 1) {
            return att + da;
          }
          if (target.hp == target.maxHp) {
            return -att + da;
          }
          if (target.hp == 1) {
            if (target.maxHp <= 4 && !target.hasSkillTag("maixie")) {
              if (target.maxHp <= 3) {
                return -att + da;
              }
              return -att / 2 + da;
            }
            return da;
          }
          if (target.hp == target.maxHp - 1) {
            if (target.hp > 2 || target.hasSkillTag("maixie")) {
              return att / 5 + da;
            }
            if (att > 0) {
              return 0.02 + da;
            }
            return 0.05 + da;
          }
          return att / 2 + da;
        },
        prompt: get.prompt2(event.skill)
      }).forResult();
    },
    async content(event, trigger, player) {
      trigger.player = event.targets[0];
      trigger.player.addSkill("tianxiang2");
      await player.discard(event.cards[0]);
    },
    ai: {
      maixie_defend: true,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return;
          }
          if (get.tag(card, "damage") && target.countCards("h") > 1) {
            return 0.7;
          }
        }
      },
      threaten(player, target) {
        if (target.countCards("h") == 0) {
          return 2;
        }
      }
    }
  },
  tianxiang2: {
    trigger: { player: ["damageAfter", "damageCancelled", "damageZero"] },
    forced: true,
    popup: false,
    audio: false,
    vanish: true,
    charlotte: true,
    sourceSkill: "tianxiang",
    async content(event, trigger, player) {
      player.removeSkill("tianxiang2");
      player.popup("tianxiang");
      if (player.getDamagedHp()) {
        await player.draw(player.getDamagedHp());
      }
    }
  },
  retianxiang: {
    audio: "tianxiang",
    audioname: ["daxiaoqiao", "re_xiaoqiao", "ol_xiaoqiao"],
    trigger: { player: "damageBegin4" },
    preHidden: true,
    filter(event, player) {
      return player.countCards("h", function(card) {
        return _status.connectMode || get.suit(card, player) == "heart";
      }) > 0 && event.num > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        filterCard(card, player2) {
          return get.suit(card) == "heart" && lib.filter.cardDiscardable(card, player2);
        },
        filterTarget(card, player2, target) {
          return player2 != target;
        },
        ai1(card) {
          return 10 - get.value(card);
        },
        ai2(target) {
          const att = get.attitude(_status.event.player, target);
          const trigger2 = _status.event.getTrigger();
          let da = 0;
          if (_status.event.player.hp == 1) {
            da = 10;
          }
          const eff = get.damageEffect(target, trigger2.source, target);
          if (att == 0) {
            return 0.1 + da;
          }
          if (eff >= 0 && att > 0) {
            return att + da;
          }
          if (att > 0 && target.hp > 1) {
            if (target.maxHp - target.hp >= 3) {
              return att * 1.1 + da;
            }
            if (target.maxHp - target.hp >= 2) {
              return att * 0.9 + da;
            }
          }
          return -att + da;
        },
        prompt: get.prompt(event.skill),
        prompt2: lib.translate[`${event.skill}_info`]
      }).setHiddenSkill(event.name.slice(0, -5)).forResult();
    },
    async content(event, trigger, player) {
      const [target] = event.targets;
      const [card] = event.cards;
      trigger.cancel();
      await player.discard(event.cards);
      const result = await player.chooseControlList(
        true,
        function(event2, player2) {
          const target2 = _status.event.target;
          let att = get.attitude(player2, target2);
          if (target2.hasSkillTag("maihp")) {
            att = -att;
          }
          if (att > 0) {
            return 0;
          } else {
            return 1;
          }
        },
        ["令" + get.translation(target) + "受到伤害来源对其造成的1点伤害，然后摸X张牌（X为其已损失体力值且至多为5）", "令" + get.translation(target) + "失去1点体力，然后获得" + get.translation(event.cards)]
      ).set("target", target).forResult();
      if (typeof result.index != "number") {
        return;
      }
      if (result.index) {
        event.related = target.loseHp();
      } else {
        event.related = target.damage(trigger.source || "nosource", "nocard");
      }
      await event.related;
      if (result.index && card.isInPile()) {
        await target.gain(card, "gain2");
      } else if (target.getDamagedHp()) {
        await target.draw(Math.min(5, target.getDamagedHp()));
      }
    },
    ai: {
      maixie_defend: true,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return;
          }
          if (get.tag(card, "damage") && target.countCards("he") > 1) {
            return 0.7;
          }
        }
      }
    }
  },
  retianxiang3: {
    trigger: { player: "loseHpAfter" },
    forced: true,
    popup: false,
    sourceSkill: "retianxiang",
    filter(event) {
      return event.type == "retianxiang";
    },
    vanish: true,
    async content(event, trigger, player) {
      await player.gain(player.storage.retianxiang3, "gain2");
      player.removeSkill("retianxiang3");
    },
    onremove(player) {
      const card = player.storage.retianxiang3;
      if (get.position(card) == "s") {
        game.cardsDiscard(card);
      }
      delete player.storage.retianxiang3;
    }
  },
  retianxiang2: {
    trigger: { player: "damageAfter" },
    forced: true,
    popup: false,
    sourceSkill: "retianxiang",
    filter(event) {
      return event.type == "retianxiang";
    },
    vanish: true,
    async content(event, trigger, player) {
      if (player.isDamaged()) {
        await player.draw(player.getDamagedHp());
      }
      player.removeSkill("retianxiang2");
    }
  },
  xintianxiang: {
    audio: "tianxiang",
    trigger: { player: "damageBefore" },
    filter(event, player) {
      return player.countCards("he", { suit: "heart" }) > 0 && event.num > 0 && !player.hasSkill("xintianxiang3");
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        filterCard(card, player2) {
          return get.suit(card) == "heart" && lib.filter.cardDiscardable(card, player2);
        },
        filterTarget(card, player2, target) {
          return player2 != target;
        },
        position: "he",
        ai1(card) {
          return 10 - get.value(card);
        },
        ai2(target) {
          const att = get.attitude(_status.event.player, target);
          const trigger2 = _status.event.getTrigger();
          let da = 0;
          if (_status.event.player.hp == 1) {
            da = 10;
          }
          if (trigger2.num > 1) {
            if (target.maxHp > 5 && target.hp > 1) {
              return -att / 10 + da;
            }
            return -att + da;
          }
          const eff = get.damageEffect(target, trigger2.source, target, trigger2.nature);
          if (att == 0) {
            return 0.1 + da;
          }
          if (eff >= 0 && trigger2.num == 1) {
            return att + da;
          }
          if (target.hp == target.maxHp) {
            return -att + da;
          }
          if (target.hp == 1) {
            if (target.maxHp <= 4 && !target.hasSkillTag("maixie")) {
              if (target.maxHp <= 3) {
                return -att + da;
              }
              return -att / 2 + da;
            }
            return da;
          }
          if (target.hp == target.maxHp - 1) {
            if (target.hp > 2 || target.hasSkillTag("maixie")) {
              return att / 5 + da;
            }
            if (att > 0) {
              return 0.02 + da;
            }
            return 0.05 + da;
          }
          return att / 2 + da;
        },
        prompt: get.prompt2(event.skill)
      }).forResult();
    },
    async content(event, trigger, player) {
      trigger.player = event.targets[0];
      trigger.player.addSkill("xintianxiang2");
      trigger.player.storage.xintianxiang = player;
      await player.discard(event.cards[0]);
    },
    ai: {
      maixie_defend: true,
      effect: {
        target(card, player, target) {
          if (player.hasSkillTag("jueqing", false, target)) {
            return;
          }
          if (get.tag(card, "damage") && target.countCards("he") > 1) {
            return 0.7;
          }
        }
      }
    }
  },
  xintianxiang2: {
    trigger: { player: ["damageAfter", "damageCancelled", "damageZero"] },
    forced: true,
    popup: false,
    audio: false,
    vanish: true,
    sourceSkill: "xintianxiang",
    async content(event, trigger, player) {
      const source = player.storage.xintianxiang;
      if (source.isDead()) {
        return;
      }
      const num = player.maxHp - player.hp || 0;
      const str1 = "令" + get.translation(player) + "摸" + get.cnNumber(num) + "张牌";
      const str2 = "令" + get.translation(player) + "防止造成和受到的所有伤害且天香失效直到你下一回合开始";
      const att = get.attitude(source, player);
      let choice = "选项一";
      if (att < 0) {
        if (num >= 2) {
          choice = "选项二";
        }
      } else if (att > 0) {
        if (num < 2 && !player.hasSkillTag("maixie")) {
          choice = "选项二";
        }
      }
      const { control } = await source.chooseControl(function() {
        return _status.event.choice;
      }).set("choiceList", [str1, str2]).set("choice", choice).forResult();
      if (control == "选项一") {
        if (player.isDamaged()) {
          await player.draw(player.maxHp - player.hp);
        }
      } else {
        player.storage.xintianxiang.addSkill("xintianxiang3");
        player.storage.xintianxiang.storage.xintianxiang3 = player;
        player.addSkill("xintianxiang4");
      }
      player.removeSkill("xintianxiang2");
      delete player.storage.xintianxiang;
    }
  },
  xintianxiang3: {
    trigger: { player: ["phaseZhunbeiBegin", "dieBegin"] },
    silent: true,
    sourceSkill: "xintianxiang",
    async content(event, trigger, player) {
      if (player.storage.xintianxiang3) {
        player.storage.xintianxiang3.removeSkill("xintianxiang4");
        delete player.storage.xintianxiang3;
      }
      player.removeSkill("xintianxiang3");
    }
  },
  xintianxiang4: {
    trigger: { source: "damageBefore", player: "damageBefore" },
    forced: true,
    mark: true,
    intro: {
      content: "防止造成和受到的一切伤害"
    },
    priority: 15,
    sourceSkill: "xintianxiang",
    async content(event, trigger, player) {
      trigger.cancel();
    },
    ai: {
      nofire: true,
      nothunder: true,
      nodamage: true,
      notrick: true,
      notricksource: true,
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "damage")) {
            return "zeroplayertarget";
          }
        },
        player(card, player, target, current) {
          if (get.tag(card, "damage")) {
            return "zeroplayertarget";
          }
        }
      }
    }
  },
  hongyan: {
    audio: true,
    mod: {
      suit(card, suit) {
        if (suit == "spade") {
          return "heart";
        }
      }
    }
  },
  xinhongyan: {
    audio: "hongyan",
    mod: {
      suit(card, suit) {
        if (suit == "spade") {
          return "heart";
        }
      }
    },
    trigger: { global: "judge" },
    filter(event, player) {
      if (event.fixedResult && event.fixedResult.suit) {
        return event.fixedResult.suit == "heart";
      }
      return get.suit(event.player.judging[0], event.player) == "heart";
    },
    async cost(event, trigger, player) {
      const str = "红颜：" + get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，请将其改为一种花色";
      const { control } = await player.chooseControl("spade", "heart", "diamond", "club").set("prompt", str).set("ai", function() {
        const player2 = get.player();
        const judging = _status.event.judging;
        const trigger2 = _status.event.getTrigger();
        const list = lib.suit.slice(0);
        const attitude = get.attitude(player2, trigger2.player);
        if (attitude == 0) {
          return 0;
        }
        const getj = function(suit) {
          return trigger2.judge({
            name: get.name(judging),
            nature: get.nature(judging),
            suit,
            number: get.number(judging)
          });
        };
        list.sort(function(a, b) {
          return (getj(b) - getj(a)) * get.sgn(attitude);
        });
        return list[0];
      }).set("judging", trigger.player.judging[0]).forResult();
      event.result = {
        bool: control != "cancel2",
        cost_data: control
      };
    },
    async content(event, trigger, player) {
      const control = event.cost_data;
      player.addExpose(0.25);
      player.popup(control);
      game.log(player, "将判定结果改为了", "#y" + get.translation(control + 2));
      if (!trigger.fixedResult) {
        trigger.fixedResult = {};
      }
      trigger.fixedResult.suit = control;
      trigger.fixedResult.color = get.color({ suit: control });
    },
    ai: {
      rejudge: true,
      tag: {
        rejudge: 0.4
      },
      expose: 0.5
    }
  },
  gzbuqu: {
    audio: 2,
    trigger: { player: "changeHp" },
    filter(event, player) {
      return player.hp <= 0 && event.num < 0;
    },
    marktext: "创",
    intro: {
      markcount: "expansion",
      content: "expansion"
    },
    group: "gzbuqu_recover",
    frequent: true,
    ondisable: true,
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
        if (player.hp <= 0) {
          player.dying({});
        }
      }
    },
    process(player) {
      const nums = [];
      const cards2 = player.getExpansions("gzbuqu");
      for (let i2 = 0; i2 < cards2.length; i2++) {
        if (nums.includes(get.number(cards2[i2]))) {
          return false;
        } else {
          nums.push(get.number(cards2[i2]));
        }
      }
      return true;
    },
    subSkill: {
      recover: {
        trigger: { player: "recoverAfter" },
        filter(event, player) {
          return player.getExpansions("gzbuqu").length > 0 && event.num > 0;
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          for (let i2 = trigger.num; i2 > 0; i2--) {
            let cards2 = player.getExpansions("gzbuqu");
            const count = cards2.length;
            if (count <= 0 || player.hp + count <= 1) {
              return;
            }
            if (count > 1) {
              cards2 = (await player.chooseCardButton("不屈：移去一张“创”", true, cards2).set("ai", function(button) {
                const buttons = get.selectableButtons();
                for (let i3 = 0; i3 < buttons.length; i3++) {
                  if (buttons[i3] != button && get.number(buttons[i3].link) == get.number(button.link) && !ui.selected.buttons.includes(buttons[i3])) {
                    return 1;
                  }
                }
                return 0;
              }).forResult()).links;
            }
            await player.loseToDiscardpile(cards2);
          }
          if (lib.skill.gzbuqu.process(player)) {
            if (player.isDying()) {
              const histories = [event];
              let evt = event;
              while (true) {
                evt = event.getParent("dying");
                if (!evt || evt.name != "dying" || histories.includes(evt)) {
                  break;
                }
                histories.push(evt);
                if (evt.player == player) {
                  evt.nodying = true;
                }
              }
            }
          }
        }
      }
    },
    async content(event, trigger, player) {
      const num = -trigger.num - Math.max(player.hp - trigger.num, 1) + 1;
      const next = player.addToExpansion(get.cards(num), "gain2");
      next.gaintag.add("gzbuqu");
      await next;
      await player.showCards(get.translation(player) + "的不屈牌", player.getExpansions("gzbuqu"));
      if (lib.skill.gzbuqu.process(player)) {
        const evt = trigger.getParent();
        if (evt.name == "damage" || evt.name == "loseHp") {
          evt.nodying = true;
        }
      }
    },
    ai: {
      mingzhi: true,
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
            let num = target.getExpansions("gzbuqu").length || target.getHp();
            return (num + 1) / 5;
          }
        }
      }
    }
  },
  buqu: {
    audio: 2,
    audioname: ["key_yuri"],
    trigger: { player: "chooseToUseBefore" },
    forced: true,
    preHidden: true,
    filter(event, player) {
      return event.type == "dying" && player.isDying() && event.dying == player && !event.getParent()._buqu;
    },
    async content(event, trigger, player) {
      trigger.getParent()._buqu = true;
      const [card] = get.cards();
      const next = player.addToExpansion(card, "gain2");
      next.gaintag.add("buqu");
      await next;
      const cards2 = player.getExpansions("buqu"), num = get.number(card);
      player.showCards(cards2, "不屈");
      for (let i2 = 0; i2 < cards2.length; i2++) {
        if (cards2[i2] != card && get.number(cards2[i2]) == num) {
          await player.loseToDiscardpile(card);
          return;
        }
      }
      trigger.cancel();
      trigger.result = { bool: true };
      if (player.hp <= 0) {
        await player.recover(1 - player.hp);
      }
    },
    mod: {
      maxHandcardBase(player, num) {
        if (get.mode() != "guozhan" && player.getExpansions("buqu").length) {
          return player.getExpansions("buqu").length;
        }
      }
    },
    ai: {
      save: true,
      mingzhi: true,
      skillTagFilter(player, tag, target) {
        if (player != target) {
          return false;
        }
      },
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage") || get.tag(card, "loseHp")) {
            let num = target.getExpansions("buqu").length || target.getHp();
            return (num + 1) / 5;
          }
        }
      }
    },
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    intro: {
      content: "expansion",
      markcount: "expansion"
    }
  },
  fenji: {
    audio: 2,
    trigger: { global: ["gainAfter", "loseAfter", "loseAsyncAfter"] },
    filter(event, player) {
      if (event.name == "lose") {
        if (event.type != "discard" || !event.player.isIn()) {
          return false;
        }
        if ((event.discarder || event.getParent(2).player) == event.player) {
          return false;
        }
        if (!event.getl(event.player).hs.length) {
          return false;
        }
        return true;
      } else if (event.name == "gain") {
        if (event.giver || event.getParent().name == "gift") {
          return false;
        }
        const cards2 = event.getg(event.player);
        if (!cards2.length) {
          return false;
        }
        return game.hasPlayer((current) => {
          if (current == event.player) {
            return false;
          }
          const hs = event.getl(current).hs;
          for (const i2 of hs) {
            if (cards2.includes(i2)) {
              return true;
            }
          }
          return false;
        });
      } else if (event.type == "gain") {
        if (event.giver || !event.player || !event.player.isIn()) {
          return false;
        }
        const hs = event.getl(event.player);
        return game.hasPlayer((current) => {
          if (current == event.player) {
            return false;
          }
          const cards2 = event.getg(current);
          for (const i2 of cards2) {
            if (hs.includes(i2)) {
              return true;
            }
          }
        });
      } else if (event.type == "discard") {
        if (!event.discarder) {
          return false;
        }
        return game.hasPlayer((current) => {
          return current != event.discarder && event.getl(current).hs.length > 0;
        });
      }
      return false;
    },
    getIndex(event) {
      const targets = [];
      if (event.name == "gain") {
        const cards2 = event.getg(event.player);
        targets.addArray(
          game.filterPlayer((current) => {
            if (current == event.player) {
              return false;
            }
            const hs = event.getl(current).hs;
            for (const i2 of hs) {
              if (cards2.includes(i2)) {
                return true;
              }
            }
            return false;
          })
        );
      } else if (event.name == "loseAsync" && event.type == "discard") {
        targets.addArray(
          game.filterPlayer((current) => {
            return current != event.discarder && event.getl(current).hs.length > 0;
          })
        );
      } else {
        targets.push(event.player);
      }
      return targets;
    },
    logTarget: (event, player, triggername, target) => target,
    check(event, player, triggername, target) {
      if (get.attitude(player, target) <= 0) {
        return false;
      }
      return 2 * get.effect(target, { name: "draw" }, player, player) + get.effect(player, { name: "losehp" }, player, player) > 0;
    },
    async content(event, trigger, player) {
      const [target] = event.targets;
      await player.loseHp();
      await target.draw(2);
    }
  },
  new_fenji: {
    audio: "fenji",
    trigger: {
      global: "phaseJieshuBegin"
    },
    filter(event, player) {
      if (event.player.countCards("h") == 0 && event.player.isIn()) {
        return true;
      }
      return false;
    },
    preHidden: true,
    check(event, player) {
      if (get.attitude(get.event().player, event.player) <= 0) {
        return false;
      }
      return 2 * get.effect(event.player, { name: "draw" }, player, get.event().player) + get.effect(player, { name: "losehp" }, player, get.event().player) > 0;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      player.line(trigger.player, "green");
      await trigger.player.draw(2);
      await player.loseHp();
    }
  },
  leiji: {
    audio: 2,
    trigger: { player: ["useCard", "respond"] },
    filter(event, player) {
      return event.card.name == "shan";
    },
    preHidden: true,
    line: "thunder",
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill)).set("ai", (target) => {
        const player2 = get.player();
        if (target.hasSkill("hongyan")) {
          return 0;
        }
        return get.damageEffect(target, player2, player2, "thunder");
      }).setHiddenSkill(event.skill).forResult();
    },
    async content(event, trigger, player) {
      const [target] = event.targets;
      const next = target.judge((card) => {
        if (get.suit(card) == "spade") {
          return -4;
        }
        return 4;
      });
      next.judge2 = (result2) => !result2.bool;
      const result = await next.forResult();
      if (!result?.bool) {
        await target.damage(2, "thunder");
      }
    },
    ai: {
      mingzhi: false,
      useShan: true,
      effect: {
        target_use(card, player, target, current) {
          if (get.tag(card, "respondShan") && !player.hasSkillTag(
            "directHit_ai",
            true,
            {
              target,
              card
            },
            true
          ) && game.hasPlayer(function(current2) {
            return get.attitude(target, current2) < 0 && get.damageEffect(current2, target, target, "thunder") > 0;
          })) {
            if (card.name === "sha") {
              if (!target.mayHaveShan(player, "use")) {
                return;
              }
            } else if (!target.mayHaveShan(player)) {
              return 1 - 0.1 * Math.min(5, target.countCards("hs"));
            }
            if (!target.hasSkillTag("rejudge")) {
              return [1, 1];
            }
            let pos = player.hasSkillTag("viewHandcard", null, target, true) ? "hes" : "e";
            if (target.hasCard(function(cardx) {
              return get.suit(cardx) === "spade";
            }, pos)) {
              return [1, 4];
            }
            if (pos === "e") {
              return [1, Math.min(4, 1 + 0.75 * Math.max(1, target.countCards("hs")))];
            }
            return [1, 1];
          }
        }
      }
    }
  },
  guidao: {
    audio: 2,
    audioname: ["sp_zhangjiao"],
    trigger: { global: "judge" },
    filter(event, player) {
      return player.countCards("hes", { color: "black" }) > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard(`${get.translation(trigger.player)}的${trigger.judgestr || ""}判定为${get.translation(trigger.player.judging[0])}，${get.prompt(event.skill)}`, "hes", (card) => {
        const player2 = get.player();
        if (get.color(card) !== "black") {
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
        let val = get.value(card);
        if (get.subtype(card) == "equip2") {
          val /= 2;
        } else {
          val /= 6;
        }
        if (attitude == 0 || result == 0) {
          return 0;
        }
        if (attitude > 0) {
          return result - val;
        }
        return -result - val;
      }).set("judging", trigger.player.judging[0]).forResult();
    },
    popup: false,
    async content(event, trigger, player) {
      const next = player.respond(event.cards, event.name, "highlight", "noOrdering");
      await next;
      const { cards: cards2 } = next;
      if (cards2?.length) {
        player.$gain2(trigger.player.judging[0]);
        await player.gain(trigger.player.judging[0]);
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
  // 蛊惑（guhuo）技能错误，请勿引用
  /*
  guhuo:{
  	enable:'phaseUse',
  	usable:1,
  	audio:2,
  	filter:function(event,player){
  		return player.countCards('hs')>0
  	},
  	chooseButton:{
  		dialog:function(){
  			const list=['sha','tao','jiu','taoyuan','wugu','juedou','huogong','jiedao','tiesuo','guohe','shunshou','wuzhong','wanjian','nanman'];
  			for(let i=0;i<list.length;i++){
  				if(i<3){
  					list[i]=['基本','',list[i]];
  				}
  				else{
  					list[i]=['锦囊','',list[i]];
  				}
  			}
  			return ui.create.dialog([list,'vcard']);
  		},
  		filter:function(button,player){
  			return lib.filter.filterCard({name:button.link[2]},player,_status.event.getParent());
  		},
  		check:function(button){
  			const player=_status.event.player;
  			if(player.countCards('h','wuzhong')){
  				if(player.hp==1&&player.countCards('h','tao')){
  					return button.link=='tao'?1:0;
  				}
  				return button.link=='wuzhong'?1:0;
  			}
  			if(player.hp<player.maxHp){
  				if(player.countCards('h','tao')){
  					return button.link=='tao'?1:0;
  				}
  			}
  		},
  		backup:function(links,player){
  			return {
  				filterCard:true,
  				selectCard:-1,
  				audio:2,
  				popname:true,
  				viewAs:{name:links[0][2]},
  			}
  		},
  		prompt:function(links,player){
  			return '将全部手牌当'+get.translation(links[0][2])+'使用';
  		}
  	},
  	ai:{
  		order:1,
  		result:{
  			player:function(player){
  				const cards=player.getCards('h');
  				let num=0;
  				if(cards.length>=3&&player.hp>=3) return 0;
  				for(let i=0;i<cards.length;i++){
  					num+=Math.max(0,get.value(cards[i],player,'raw'));
  				}
  				num/=cards.length;
  				num*=Math.min(cards.length,player.hp);
  				return 12-num;
  			}
  		},
  		threaten:1.6,
  	}
  },
  */
  huangtian: {
    audio: "huangtian2",
    audioname: ["zhangjiao", "re_zhangjiao"],
    audioname2: {
      pe_jun_zhangjiao: ["xinhuangtian2_re_zhangjiao1.mp3", "xinhuangtian2_re_zhangjiao2.mp3"]
    },
    global: "huangtian2",
    zhuSkill: true
  },
  huangtian2: {
    audio: 2,
    enable: "phaseUse",
    discard: false,
    lose: false,
    delay: false,
    line: true,
    prepare(cards2, player, targets) {
      targets[0].logSkill("huangtian");
    },
    prompt() {
      const player = _status.event.player;
      const list = game.filterPlayer(function(target) {
        return target != player && target.hasZhuSkill("huangtian", player);
      });
      let str = "将一张【闪】或【闪电】交给" + get.translation(list);
      if (list.length > 1) {
        str += "中的一人";
      }
      return str;
    },
    filter(event, player) {
      if (player.group != "qun") {
        return false;
      }
      if (player.countCards("h", "shan") + player.countCards("h", "shandian") == 0) {
        return 0;
      }
      return game.hasPlayer(function(target) {
        return target != player && target.hasZhuSkill("huangtian", player) && !target.hasSkill("huangtian3");
      });
    },
    filterCard(card) {
      return card.name == "shan" || card.name == "shandian";
    },
    log: false,
    visible: true,
    filterTarget(card, player, target) {
      return target != player && target.hasZhuSkill("huangtian", player) && !target.hasSkill("huangtian3");
    },
    //usable:1,
    //forceaudio:true,
    async content(event, trigger, player) {
      await player.give(event.cards, event.target);
      event.target.addTempSkill("huangtian3", "phaseUseEnd");
    },
    ai: {
      expose: 0.3,
      order: 10,
      result: {
        target: 5
      }
    }
  },
  huangtian3: {},
  xinfu_guhuo: {
    audio: "guhuo_guess",
    derivation: ["chanyuan"],
    enable: ["chooseToUse", "chooseToRespond"],
    hiddenCard(player, name) {
      return lib.inpile.includes(name) && player.countCards("hs") > 0 && !player.hasSkill("guhuo_phase");
    },
    filter(event, player) {
      if (player.hasSkill("guhuo_phase")) {
        return false;
      }
      if (!player.countCards("hs")) {
        return false;
      }
      for (const i2 of lib.inpile) {
        const type = get.type(i2);
        if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i2 }, "unsure"), player, event)) {
          return true;
        }
        if (i2 == "sha") {
          for (const j of lib.inpile_nature) {
            if (event.filterCard(get.autoViewAs({ name: i2, nature: j }, "unsure"), player, event)) {
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
        for (const i2 of lib.inpile) {
          if (event.type != "phase") {
            if (!event.filterCard(get.autoViewAs({ name: i2 }, "unsure"), player, event)) {
              continue;
            }
          }
          const type = get.type(i2);
          if (type == "basic" || type == "trick") {
            list.push([type, "", i2]);
          }
          if (i2 == "sha") {
            for (const j of lib.inpile_nature) {
              if (event.type != "phase") {
                if (!event.filterCard(get.autoViewAs({ name: i2, nature: j }, "unsure"), player, event)) {
                  continue;
                }
              }
              list.push(["基本", "", "sha", j]);
            }
          }
        }
        return ui.create.dialog("蛊惑", [list, "vcard"]);
      },
      filter(button, player) {
        const evt = _status.event.getParent();
        return evt.filterCard({ name: button.link[2], nature: button.link[3] }, player, evt);
      },
      check(button) {
        const player = _status.event.player;
        const enemyNum = game.countPlayer(function(current) {
          return current != player && !current.hasSkill("chanyuan") && (get.realAttitude || get.attitude)(current, player) < 0;
        });
        const card = { name: button.link[2], nature: button.link[3] };
        const val = _status.event.getParent().type == "phase" ? player.getUseValue(card) : 1;
        if (val <= 0) {
          return 0;
        }
        if (enemyNum) {
          if (!player.hasCard(function(cardx) {
            if (card.name == cardx.name) {
              if (card.name != "sha") {
                return true;
              }
              return get.is.sameNature(card, cardx);
            }
            return false;
          }, "hs")) {
            if (get.value(card, player, "raw") < 6) {
              return Math.sqrt(val) * (0.25 + Math.random() / 1.5);
            }
            if (enemyNum <= 2) {
              return Math.sqrt(val) / 1.5;
            }
            return 0;
          }
          return 3 * val;
        }
        return val;
      },
      backup(links, player) {
        return {
          filterCard(card, player2, target) {
            let result = true;
            const suit = card.suit, number = card.number;
            card.suit = "none";
            card.number = null;
            const mod = game.checkMod(card, player2, "unchanged", "cardEnabled2", player2);
            if (mod != "unchanged") {
              result = mod;
            }
            card.suit = suit;
            card.number = number;
            return result;
          },
          selectCard: 1,
          position: "hs",
          ignoreMod: true,
          aiUse: Math.random(),
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            suit: "none",
            number: null
          },
          ai1(card) {
            const player2 = _status.event.player;
            const enemyNum = game.countPlayer(function(current) {
              return current != player2 && !current.hasSkill("chanyuan") && (get.realAttitude || get.attitude)(current, player2) < 0;
            });
            const cardx = lib.skill.xinfu_guhuo_backup.viewAs;
            if (enemyNum) {
              if (card.name == cardx.name && (card.name != "sha" || get.is.sameNature(card, cardx))) {
                return 2 + Math.random() * 3;
              } else if (lib.skill.xinfu_guhuo_backup.aiUse < 0.5 && !player2.isDying()) {
                return 0;
              }
            }
            return 6 - get.value(card);
          },
          async precontent(event, trigger, player2) {
            player2.logSkill("xinfu_guhuo");
            player2.addTempSkill("guhuo_guess");
            const [card] = event.result.cards;
            event.result.card.suit = get.suit(card);
            event.result.card.number = get.number(card);
          }
        };
      },
      prompt(links, player) {
        return "将一张手牌当做" + get.translation(links[0][2]) + (_status.event.name == "chooseToRespond" ? "打出" : "使用");
      }
    },
    ai: {
      save: true,
      respondSha: true,
      respondShan: true,
      fireAttack: true,
      skillTagFilter(player) {
        if (!player.countCards("hs") || player.hasSkill("guhuo_phase")) {
          return false;
        }
      },
      threaten: 1.2,
      order: 8.1,
      result: { player: 1 }
    }
  },
  guhuo_guess: {
    audio: 2,
    trigger: {
      player: ["useCardBefore", "respondBefore"]
    },
    forced: true,
    silent: true,
    popup: false,
    firstDo: true,
    charlotte: true,
    filter(event, player) {
      return event.skill && (event.skill.indexOf("guhuo_") == 0 || event.skill.indexOf("xinfu_guhuo_") == 0);
    },
    async content(event, trigger, player) {
      player.addTempSkill("guhuo_phase");
      event.fake = false;
      event.betrayer = null;
      const [card] = trigger.cards;
      if (card.name != trigger.card.name || card.name == "sha" && !get.is.sameNature(trigger.card, card)) {
        event.fake = true;
      }
      player.popup(trigger.card.name, "metal");
      const next = player.lose(card, ui.ordering);
      next.relatedEvent = trigger;
      await next;
      trigger.throw = false;
      trigger.skill = "xinfu_guhuo_backup";
      game.log(player, "声明", trigger.targets && trigger.targets.length ? "对" : "", trigger.targets || "", trigger.name == "useCard" ? "使用" : "打出", trigger.card);
      event.prompt = get.translation(player) + "声明" + (trigger.targets && trigger.targets.length ? "对" + get.translation(trigger.targets) : "") + (trigger.name == "useCard" ? "使用" : "打出") + (get.translation(trigger.card.nature) || "") + get.translation(trigger.card.name) + "，是否质疑？";
      event.targets = game.filterPlayer(function(current) {
        return current != player && !current.hasSkill("chanyuan");
      }).sortBySeat(_status.currentPhase);
      game.broadcastAll(
        function(card2, player2) {
          _status.guhuoNode = card2.copy("thrown");
          if (lib.config.cardback_style != "default") {
            _status.guhuoNode.style.transitionProperty = "none";
            ui.refresh(_status.guhuoNode);
            _status.guhuoNode.classList.add("infohidden");
            ui.refresh(_status.guhuoNode);
            _status.guhuoNode.style.transitionProperty = "";
          } else {
            _status.guhuoNode.classList.add("infohidden");
          }
          _status.guhuoNode.style.transform = "perspective(600px) rotateY(180deg) translateX(0)";
          player2.$throwordered2(_status.guhuoNode);
        },
        trigger.cards[0],
        player
      );
      event.onEnd01 = function() {
        _status.guhuoNode.removeEventListener("webkitTransitionEnd", _status.event.onEnd01);
        setTimeout(function() {
          _status.guhuoNode.style.transition = "all ease-in 0.3s";
          _status.guhuoNode.style.transform = "perspective(600px) rotateY(270deg)";
          const onEnd = function() {
            _status.guhuoNode.classList.remove("infohidden");
            _status.guhuoNode.style.transition = "all 0s";
            ui.refresh(_status.guhuoNode);
            _status.guhuoNode.style.transform = "perspective(600px) rotateY(-90deg)";
            ui.refresh(_status.guhuoNode);
            _status.guhuoNode.style.transition = "";
            ui.refresh(_status.guhuoNode);
            _status.guhuoNode.style.transform = "";
            _status.guhuoNode.removeEventListener("webkitTransitionEnd", onEnd);
          };
          _status.guhuoNode.listenTransition(onEnd);
        }, 300);
      };
      for (const target of event.targets) {
        const { links } = await target.chooseButton([event.prompt, [["reguhuo_ally", "reguhuo_betray"], "vcard"]], true).set("ai", function(button) {
          const player2 = _status.event.player;
          const evt = _status.event.getParent("guhuo_guess"), evtx = evt.getTrigger();
          if (!evt) {
            return Math.random();
          }
          const card2 = { name: evtx.card.name, nature: evtx.card.nature, isCard: true };
          const ally = button.link[2] == "reguhuo_ally";
          if (ally && (player2.hp <= 1 || get.attitude(player2, evt.player) >= 0)) {
            return 1.1;
          }
          if (!ally && get.attitude(player2, evt.player) < 0 && evtx.name == "useCard") {
            let eff = 0;
            const targetsx = evtx.targets || [];
            for (const target2 of targetsx) {
              const isMe = target2 == evt.player;
              eff += get.effect(target2, card2, evt.player, player2) / (isMe ? 1.5 : 1);
            }
            eff /= 1.5 * targetsx.length || 1;
            if (eff > 0) {
              return 0;
            }
            if (eff < -7) {
              return Math.random() + Math.pow(-(eff + 7) / 8, 2);
            }
            return Math.pow((get.value(card2, evt.player, "raw") - 4) / (eff == 0 ? 5 : 10), 2);
          }
          return Math.random();
        }).forResult();
        if (links[0][2] == "reguhuo_betray") {
          target.addExpose(0.2);
          game.log(target, "#y质疑");
          target.popup("质疑！", "fire");
          event.betrayer = target;
          break;
        } else {
          game.log(target, "#g不质疑");
          target.popup("不质疑", "wood");
        }
      }
      await game.delayx();
      game.broadcastAll(function(onEnd) {
        _status.event.onEnd01 = onEnd;
        if (_status.guhuoNode) {
          _status.guhuoNode.listenTransition(onEnd, 300);
        }
      }, event.onEnd01);
      await game.delay(2);
      if (!event.betrayer) {
        return;
      }
      if (event.fake) {
        event.betrayer.popup("质疑正确", "wood");
        game.log(player, "声明的", trigger.card, "作废了");
        trigger.cancel();
        trigger.getParent().goto(0);
        trigger.line = false;
      } else {
        event.betrayer.popup("质疑错误", "fire");
        await event.betrayer.addSkills("chanyuan");
      }
      await game.delay(2);
      if (event.fake) {
        game.broadcastAll(() => ui.clear());
      }
    }
  },
  chanyuan: {
    init(player, skill) {
      if (player.hp == 1) {
        player.logSkill(skill);
      }
      player.addSkillBlocker(skill);
    },
    onremove(player, skill) {
      player.removeSkillBlocker(skill);
    },
    skillBlocker(skill, player) {
      return skill != "chanyuan" && skill != "rechanyuan" && !lib.skill[skill].charlotte && !lib.skill[skill].persevereSkill && player.hp == 1;
    },
    mark: true,
    intro: {
      content(storage, player, skill) {
        let str = "<li>锁定技。你不能于〖蛊惑〗的结算流程中进行质疑。当你的体力值为1时，你的其他技能失效。";
        const list = player.getSkills(null, false, false).filter(function(i2) {
          return lib.skill.rechanyuan.skillBlocker(i2, player);
        });
        if (list.length) {
          str += "<br><li>失效技能：" + get.translation(list);
        }
        return str;
      }
    },
    audio: 2,
    trigger: { player: "changeHp" },
    filter(event, player) {
      return player.hp == 1;
    },
    forced: true,
    async content(event, trigger, player) {
    }
  },
  guhuo_phase: {}
};
const translates = {
  re_yuanshao: "袁绍",
  re_lusu: "鲁肃",
  re_yuji: "于吉",
  wangji: "王基",
  kuailiangkuaiyue: "蒯良蒯越",
  sunliang: "孙亮",
  yl_luzhi: "卢植",
  xuyou: "许攸",
  luji: "陆绩",
  wangping: "王平",
  yanyan: "严颜",
  zhugezhan: "诸葛瞻",
  lukang: "陆抗",
  haozhao: "郝昭",
  yl_yuanshu: "新杀袁术",
  yl_yuanshu_prefix: "新杀",
  zhangxiu: "张绣",
  chendao: "陈到",
  guanqiujian: "毌丘俭",
  zhoufei: "周妃",
  nzry_jianxiang: "荐降",
  nzry_jianxiang_info: "当你成为其他角色使用牌的目标时，你可令手牌数最少的一名角色摸一张牌。",
  nzry_shenshi: "审时",
  nzry_shenshi_info: "转换技，阳：出牌阶段限一次，你可以将一张牌交给一名除你外手牌数最多的角色，然后对其造成1点伤害，若该角色因此死亡，则你可以令一名角色将手牌摸至四张。阴：其他角色对你造成伤害后，你可以观看该角色的手牌，然后交给其一张牌，当前角色回合结束时，若此牌仍在该角色的手牌区或装备区，你将手牌摸至四张。",
  nzry_mingren: "明任",
  nzry_mingren_info: "①游戏开始时，你摸两张牌，然后将一张手牌置于你的武将牌上，称为“任”。②结束阶段，你可以用一张手牌替换“任”。",
  nzry_zhenliang: "贞良",
  nzry_zhenliang_info: "转换技，阳：出牌阶段限一次，你可以弃置一张与“任”颜色相同的牌并对攻击范围内的一名角色造成1点伤害。阴：当你于回合外使用或打出的牌结算完成后，若此牌与“任”颜色相同，则你可以令一名角色摸一张牌。",
  nzry_chenglve: "成略",
  nzry_chenglve_info: "转换技，出牌阶段限一次，阳：你可以摸一张牌，然后弃置两张手牌。阴：你可以摸两张牌，然后弃置一张手牌。若如此做，直到本回合结束，你使用与弃置牌花色相同的牌无距离和次数限制。",
  nzry_cunmu: "寸目",
  nzry_cunmu_info: "锁定技，当你摸牌时，改为从牌堆底摸牌。",
  nzry_kuizhu: "溃诛",
  nzry_kuizhu_info: "弃牌阶段结束后，你可以选择一项：①令至多X名角色各摸一张牌。②对任意名体力值之和为X的角色造成1点伤害。（X为你此阶段弃置的牌数）",
  nzry_zhizheng: "掣政",
  rechezheng: "掣政",
  nzry_zhizheng_info: "锁定技，你的出牌阶段内，当你对攻击范围内不包含你的其他角色造成伤害时，防止此伤害。出牌阶段结束时，若你本阶段内使用的牌数小于这些角色的数量，则你弃置其中一名角色的一张牌。",
  nzry_lijun1: "立军",
  nzry_lijun: "立军",
  nzry_lijun_info: "主公技，其他吴势力角色的出牌阶段限一次，其使用【杀】结算后，可以将此【杀】对应的实体牌交给你，然后你可以令其摸一张牌且本阶段内使用【杀】的次数上限+1。",
  nzry_huaiju: "怀橘",
  nzry_huaiju_info: "锁定技，游戏开始时，你获得3个“橘”标记。（有“橘”的角色受到伤害时，防止此伤害，然后移去一个“橘”；有“橘”的角色摸牌阶段额外摸一张牌）",
  tachibana_effect: "怀橘",
  nzry_yili: "遗礼",
  nzry_yili_info: "出牌阶段开始时，你可以失去1点体力或移去一个“橘”，然后令一名其他角色获得一个“橘”。",
  nzry_zhenglun: "整论",
  nzry_zhenglun_info: "若你没有“橘”，你可以跳过摸牌阶段然后获得一个“橘”。",
  nzry_feijun: "飞军",
  nzry_feijun_info: "出牌阶段限一次。你可以弃置一张牌，然后选择一项：⒈令一名手牌数大于你的角色交给你一张牌；⒉令一名装备区里牌数大于你的角色弃置一张装备牌。",
  nzry_binglve: "兵略",
  nzry_binglve_info: "锁定技，当你发动“飞军”时，若目标与你之前指定的目标均不相同，则你摸两张牌。",
  nzry_juzhan: "拒战",
  nzry_juzhan_info: "转换技，阳：当你成为其他角色【杀】的目标后，你可以与其各摸一张牌，然后其本回合内不能再对你使用牌。阴：当你使用【杀】指定一名角色为目标后，你可以获得其一张牌，然后你本回合内不能再对其使用牌。",
  liangyin: "良姻",
  liangyin_info: "当有牌移至游戏外时，你可以令手牌数大于你的一名角色摸一张牌；当有牌从游戏外加入任意角色的手牌时，你可以令手牌数小于你的一名角色弃置一张牌。",
  kongsheng: "箜声",
  kongsheng_info: "准备阶段，你可以将任意张牌置于你的武将牌上；结束阶段，你使用武将牌上的装备牌，并获得武将牌上的其他牌。",
  kongsheng2: "箜声",
  kongsheng2_info: "",
  xinfu_zuilun: "罪论",
  xinfu_zuilun_info: "结束阶段，你可以观看牌堆顶三张牌，你每满足以下一项便保留一张，然后以任意顺序放回其余的牌：1.你于此回合内造成过伤害；2.你于此回合内未弃置过牌；3.手牌数为全场最少。若均不满足，你与一名其他角色失去1点体力。",
  xinfu_fuyin: "父荫",
  xinfu_fuyin_info: "锁定技，你每回合第一次成为【杀】或【决斗】的目标后，若你的手牌数小于等于该角色，此牌对你无效。",
  drlt_wanglie: "往烈",
  drlt_wanglie_info: "①出牌阶段，你使用的第一张牌无距离限制。②当你于出牌阶段内使用牌时，你可以令此牌不能被响应，然后你于本阶段内不能再使用牌。",
  drlt_xiongluan: "雄乱",
  drlt_xiongluan_info: "限定技，出牌阶段，你可以废除你的判定区和装备区，然后指定一名其他角色。直到回合结束，你对其使用牌无距离和次数限制，其不能使用和打出手牌。",
  drlt_congjian: "从谏",
  drlt_congjian_info: "当你成为锦囊牌的目标时，若此牌的目标数大于1，则你可以交给其中一名其他目标角色一张牌，然后摸一张牌，若你给出的是装备牌，改为摸两张牌。",
  drlt_yongsi: "庸肆",
  drlt_yongsi_info: "锁定技，摸牌阶段，你改为摸X张牌（X为存活势力数）；出牌阶段结束时，若你本回合：1.没有造成伤害，将手牌摸至当前体力值；2.造成的伤害超过1点，本回合手牌上限改为已损失体力值。",
  drlt_weidi: "伪帝",
  weidi_tag: "伪帝",
  drlt_weidi_info: "主公技，弃牌阶段开始时，若你的手牌数大于手牌上限，则你可以将至多X张手牌分别交给等量的其他群雄角色（X为你的手牌数与手牌上限之差）。",
  drlt_qianjie: "谦节",
  drlt_qianjie_info: "锁定技，当你横置时，取消之。你不能成为延时类锦囊的目标。你不能成为其他角色拼点的目标。",
  drlt_jueyan: "决堰",
  drlt_jueyan_info: `出牌阶段限一次，你可以废除一种装备栏，然后执行对应一项：武器栏，你本回合内使用【杀】的次数上限+3且本局游戏使用【杀】的次数上限+1；防具栏，你摸三张牌，且本局游戏手牌上限+3；坐骑栏，你本局游戏使用牌无距离限制；宝物栏，你获得${get.poptip("rejizhi")}。然后修改〖决堰〗。`,
  drlt_jueyan_rewrite: "决堰·改",
  drlt_jueyan_rewrite_info: `出牌阶段限一次，你可以废除一种装备栏，然后执行对应一项：武器栏，你本回合内使用【杀】的次数上限+3；防具栏，你摸三张牌，且本回合手牌上限+3；坐骑栏，你本回合内使用牌无距离限制；宝物栏，你获得${get.poptip("rejizhi")}直到回合结束。`,
  drlt_poshi: "破势",
  drlt_poshi_info: `觉醒技，准备阶段开始时，若你的装备栏均已被废除或体力值为1，则你减1点体力上限，将手牌摸至体力上限，失去〖决堰〗并获得${get.poptip("drlt_huairou")}。`,
  drlt_huairou: "怀柔",
  drlt_huairou_info: "出牌阶段，你可以重铸装备牌。",
  drlt_zhengu: "镇骨",
  drlt_zhengu2: "镇骨",
  drlt_zhengu_info: "结束阶段，你可以选择一名其他角色，你的回合结束后和该角色的下个回合结束时，其将手牌摸至或弃至X张。（X为你的手牌数且至多为5）",
  drlt_zhenrong: "征荣",
  drlt_zhenrong_info: "当你对其他角色造成伤害后，若其手牌比你多，你可以将其一张牌置于你的武将牌上，称为“荣”。",
  drlt_hongju: "鸿举",
  drlt_hongju_info: `觉醒技，准备阶段，若“荣”的数量大于或等于3且场上有角色死亡，则你可以用任意张手牌替换等量的“荣”，然后减1点体力上限并获得${get.poptip("drlt_qingce")}。`,
  drlt_qingce: "清侧",
  drlt_qingce_info: "出牌阶段，你可以移去一张“荣”，然后弃置一名角色装备区或判定区内的一张牌。",
  zhengrong: "征荣",
  hongju: "鸿举",
  qingce: "清侧",
  qingce_backup: "清侧",
  zhengrong_info: "当你使用带有「伤害」标签的基本牌或锦囊牌指定目标后，你可以将一名手牌数不小于你的目标角色的一张牌置于你的武将牌上，称为「荣」。",
  hongju_info: `觉醒技，准备阶段，若你武将牌上「荣」的数量不小于3，则你触发此技能。你可以用任意数量的手牌交换等量的「荣」。你减1点体力上限并获得技能${get.poptip("qingce")}。`,
  qingce_info: "出牌阶段，你可以获得一张「荣」并弃置一张手牌，然后弃置场上的一张牌。",
  jianchu: "鞬出",
  jianchu_info: "当你使用【杀】指定一名角色为目标后，你可以弃置其一张牌，若以此法弃置的牌为装备牌，此【杀】不可被【闪】响应，若不为装备牌，该角色获得此【杀】。",
  redimeng: "缔盟",
  redimeng_info: "出牌阶段限一次，你可以弃置X张牌选择两名其他角色（X为这两名角色的手牌差），你混合他们的手牌，然后令其中一名角色获得其中的一张牌，并令另一名角色获得其中的一张牌，然后重复此流程，直到这些牌均被获得为止。",
  reluanji: "乱击",
  reluanji_info: "你可以将两张与你本回合以此法转化的花色均不相同的手牌当【万箭齐发】使用，然后当一名角色因响应此牌而打出【闪】时，该角色摸一张牌。若你以此法使用的【万箭齐发】未造成伤害，则你可以在此牌结算完成后摸X张牌。(X为此牌的目标数)",
  xintianxiang: "天香",
  xintianxiang2: "天香",
  xintianxiang3: "天香",
  xintianxiang4: "天香",
  xintianxiang_bg: "香",
  xintianxiang_info: "当你受到伤害时，你可以弃置一张♥牌，将此伤害转移给一名其他角色，然后你选择一项：令该角色摸X张牌（X为其已损失的体力值）；或防止其造成与受到的所有伤害，且此技能失效直到你的下回合开始。",
  xinshensu: "神速",
  xinshensu_info: "你可以选择一至三项：1. 跳过判定阶段和摸牌阶段；2. 跳过出牌阶段并弃置一张装备牌；3. 跳过弃牌阶段并将你的武将牌翻面。你每选择一项，视为你对一名其他角色使用一张没有距离限制的【杀】。",
  yinghun: "英魂",
  yinghun_info: "准备阶段开始时，你可令一名其他角色执行一项：摸X张牌，然后弃置一张牌；或摸一张牌，然后弃置X张牌（X为你已损失的体力值）。",
  gzyinghun: "英魂",
  gzyinghun_info: "准备阶段开始时，若你已受伤，你可令一名其他角色执行一项：摸X张牌，然后弃置一张牌；或摸一张牌，然后弃置X张牌（X为你已损失的体力值）。",
  tiaoxin: "挑衅",
  zhiji: "志继",
  zhiji_draw: "摸牌",
  zhiji_recover: "回血",
  xiangle: "享乐",
  fangquan: "放权",
  ruoyu: "若愚",
  qiaobian: "巧变",
  tuntian: "屯田",
  tuntian_bg: "田",
  zaoxian: "凿险",
  jixi: "急袭",
  jiang: "激昂",
  hunzi: "魂姿",
  zhiba: "制霸",
  zhiba2: "制霸",
  zhijian: "直谏",
  guzheng: "固政",
  beige: "悲歌",
  duanchang: "断肠",
  // fushen:'附身',
  huashen: "化身",
  xinsheng: "新生",
  qimou: "奇谋",
  xinqiangxi: "强袭",
  xinjushou: "据守",
  xinjiewei: "解围",
  retianxiang: "天香",
  retianxiang_info: "当你受到伤害时，你可以弃置一张红桃手牌，防止此次伤害并选择一名其他角色，然后你选择一项：1.令其受到伤害来源对其造成的1点伤害，然后摸X张牌（X为其已损失体力值且至多为5）；2.令其失去1点体力，然后获得你弃置的牌。",
  xinjiewei_info: "你可以将装备区里的牌当【无懈可击】使用；当你的武将牌从背面翻至正面时，你可以弃置一张牌，然后移动场上的一张牌。",
  xinjushou_info: "结束阶段，你可以翻面并摸四张牌，然后弃置一张手牌，若以此法弃置的是装备牌，则你改为使用之。",
  jixi_info: "出牌阶段，你可以将任意一张“田”当作【顺手牵羊】使用。",
  xinqiangxi_info: "出牌阶段各限一次，你可以选择一项：1. 失去1点体力并对你攻击范围内的一名其他角色造成1点伤害；2. 弃置一张装备牌并对你攻击范围内的一名其他角色造成1点伤害。",
  qimou_info: "限定技，出牌阶段，你可以失去任意点体力，然后直到回合结束，你计算与其他角色的距离时-X，且你可以多使用X张【杀】（X为你失去的体力值）。",
  tiaoxin_info: "出牌阶段限一次，你可以指定一名攻击范围内包含你的角色，该角色需对你使用一张【杀】，否则你弃置其一张牌。",
  zhiji_info: `觉醒技，准备阶段，若你没有手牌，你须回复1点体力或摸两张牌，然后减1点体力上限，并获得技能${get.poptip("reguanxing")}。`,
  xiangle_info: "锁定技，当你成为一名角色使用【杀】的目标后，该角色需弃置一张基本牌，否则此【杀】对你无效。",
  fangquan_info: "你可跳过你的出牌阶段，若如此做，回合结束时，你可以弃置一张手牌并令一名其他角色进行一个额外的回合。",
  ruoyu_info: `主公技，觉醒技，准备阶段，若你的体力是全场最少的(或之一)，你须增加1点体力上限并回复1点体力，然后获得技能${get.poptip("rejijiang")}。`,
  qiaobian_info: "你可以弃置一张手牌并跳过自己的一个阶段（准备阶段和结束阶段除外）。若你以此法跳过了摸牌阶段，则你可以获得至多两名其他角色的各一张手牌；若你以此法跳过了出牌阶段，则你可以移动场上的一张牌。",
  tuntian_info: "①当你于回合外失去牌后，你可以判定。若判定结果不为♥，则你将此牌置于你的武将牌上，称为“田”。②你计算与其他角色的距离时-X（X为你武将牌上“田”的数目）。",
  zaoxian_info: `觉醒技，准备阶段，若你武将牌上至少拥有三张“田”，则你减1点体力上限，并获得技能${get.poptip("jixi")}。`,
  jiang_info: "每当你使用（指定目标后）或被使用（成为目标后）一张【决斗】或红色的【杀】时，你可以摸一张牌。",
  hunzi_info: `觉醒技，准备阶段，若你的体力值为1，你减1点体力上限，并获得技能${get.poptip("reyingzi")}和${get.poptip("gzyinghun")}。`,
  zhiba_info: "主公技，其他吴势力角色的出牌阶段限一次，其可与你进行一次拼点。若该角色没赢，你可以获得双方拼点的牌。若你已发动过〖魂姿〗，你可以拒绝此拼点。",
  zhijian_info: "出牌阶段，你可以将手牌中的一张装备牌置于一名其他角色装备区里（不得替换原装备），然后摸一张牌。",
  guzheng_info: "其他角色的弃牌阶段结束时，你可以令其获得本阶段内进入弃牌堆的牌中的一张，然后你获得其余的牌。",
  beige_info: "当有角色受到【杀】造成的伤害后，你可以弃一张牌，并令其进行一次判定，若判定结果为：♥该角色回复1点体力；♦︎该角色摸两张牌；♣伤害来源弃两张牌；♠伤害来源将其武将牌翻面。",
  duanchang_info: "锁定技，杀死你的角色失去当前的所有技能。",
  // fushen_info:'回合开始前，你可以选择与任意一名角色交换控制权，该角色可选择在下一个回合开始前与你换回。',
  huashen_info: "①游戏开始时，你随机将武将牌堆中的两张牌扣置于武将牌上（均称为“化身牌”），选择并亮出一张“化身牌”并声明该武将牌上的一个技能，你拥有该技能且同时将性别和势力属性变成与该武将相同直到该化身被替换（你不可声明限定技、觉醒技、隐匿技、使命技、主公技等特殊技能）。②回合开始时或回合结束时，你重新可以选择一张“化身牌”并声明该武将牌上的一个技能。",
  xinsheng_info: "当你受到1点伤害后，你可以获得一张“化身牌”。",
  jiangwei: "姜维",
  liushan: "刘禅",
  zhanghe: "张郃",
  dengai: "邓艾",
  sunce: "孙策",
  zhangzhang: "张昭张纮",
  caiwenji: "蔡琰",
  zuoci: "左慈",
  zhurong: "祝融",
  menghuo: "孟获",
  caopi: "曹丕",
  re_xuhuang: "徐晃",
  lusu: "旧鲁肃",
  lusu_prefix: "旧",
  sunjian: "孙坚",
  dongzhuo: "董卓",
  jiaxu: "贾诩",
  huoshou: "祸首",
  huoshou1: "祸首",
  huoshou2: "祸首",
  zaiqi: "再起",
  zaiqixx: "再起",
  juxiang: "巨象",
  juxiang1: "巨象",
  juxiang2: "巨象",
  lieren: "烈刃",
  xingshang: "行殇",
  fangzhu: "放逐",
  songwei: "颂威",
  songwei2: "颂威",
  duanliang: "断粮",
  duanliang1: "断粮",
  haoshi: "好施",
  dimeng: "缔盟",
  jiuchi: "酒池",
  roulin: "肉林",
  benghuai: "崩坏",
  baonue: "暴虐",
  baonue2: "暴虐",
  baonue_hp: "体力",
  baonue_maxHp: "体力上限",
  luanwu: "乱武",
  wansha: "完杀",
  weimu: "帷幕",
  jiezi: "截辎",
  jiezi_info: "锁定技，其他角色跳过摸牌阶段后，你摸一张牌。",
  huoshou_info: "锁定技，【南蛮入侵】对你无效；你视为所有【南蛮入侵】的伤害来源。",
  zaiqi_info: "摸牌阶段，若你已受伤，则你可以改为亮出牌堆顶的X张牌（X为你已损失的体力值），并回复X点体力（X为其中♥牌的数目）。然后你将这些♥牌置入弃牌堆，并获得其余的牌。",
  zaiqixx_info: "摸牌阶段，若你已受伤，则你可以改为亮出牌堆顶的X张牌（X为你已损失的体力值+1），并回复X点体力（X为其中♥牌的数目）。然后你将这些♥牌置入弃牌堆，并获得其余的牌。",
  juxiang_info: "锁定技。①【南蛮入侵】对你无效。②其他角色使用的【南蛮入侵】结算结束后，你获得此牌对应的所有实体牌。",
  lieren_info: "当你使用【杀】造成伤害后，可与受到该伤害的角色进行拼点；若你赢，你获得对方的一张牌。",
  xingshang_info: "当有角色死亡后，你可以获得该角色的所有牌。",
  fangzhu_info: "当你受到伤害后，你可令一名其他角色摸X张牌（X为你已损失的体力值），然后该角色将武将牌翻面。",
  songwei_info: "主公技，其他魏势力的角色的判定牌结果为黑色且生效后，其可以令你摸一张牌。",
  duanliang_info: "你可以将一张黑色基本牌或装备牌当做【兵粮寸断】使用；若一名角色的手牌数大于或等于你的手牌数，则你对其使用【兵粮寸断】没有距离限制。",
  haoshi_info: "摸牌阶段，你可以额外摸两张牌。若此时你的手牌数多于五张，你须将一半(向下取整)的手牌交给场上除你外手牌数最少的一名角色。",
  dimeng_info: "出牌阶段限一次，你可以选择其他两名角色，你弃置等同于这两名角色手牌数量之差的牌，然后交换他们的手牌。",
  yinghun_old_info: "准备阶段，若你已受伤，则你可以令一名其他角色执行下列两项中的一项： 1.摸X张牌，然后弃一张牌。 2.摸一张牌，然后弃X张牌。 （X为你已损失的体力值）",
  jiuchi_info: "你可以将一张♠手牌当作【酒】使用。",
  roulin_info: "锁定技。你对女性角色、女性角色对你使用【杀】时，都需连续使用两张【闪】才能抵消。",
  benghuai_info: "锁定技。结束阶段，若你的体力不为全场最少，你失去1点体力或减1点体力上限。",
  baonue_info: "主公技，其他群雄角色造成伤害后，可进行一次判定，若为♠，你回复1点体力。",
  luanwu_info: "限定技，出牌阶段，你可令除你外的所有角色依次对与其距离最近的另一名角色使用一张【杀】，否则失去1点体力。",
  wansha_info: "锁定技，你的回合内，除你以外，不处于濒死状态的角色不能使用【桃】。",
  weimu_info: "锁定技，你不能成为黑色锦囊牌的目标。",
  sp_zhugeliang: "卧龙",
  pangtong: "庞统",
  xunyu: "荀彧",
  dianwei: "典韦",
  taishici: "太史慈",
  yanwen: "颜良文丑",
  yuanshao: "旧袁绍",
  yuanshao_prefix: "旧",
  re_pangde: "庞德",
  huoji: "火计",
  bazhen: "八阵",
  kanpo: "看破",
  niepan: "涅槃",
  oldniepan: "涅槃",
  quhu: "驱虎",
  jieming: "节命",
  qiangxix: "强袭",
  qiangxi: "强袭",
  tianyi: "天义",
  shuangxiong: "双雄",
  shuangxiong1: "双雄",
  shuangxiong2: "双雄",
  luanji: "乱击",
  xueyi: "血裔",
  mengjin: "猛进",
  huoji_info: "你可以将一张红色手牌当作【火攻】使用。",
  bazhen_info: "锁定技，若你的防具栏内没有牌且没有被废除，则你视为装备着【八卦阵】。",
  kanpo_info: "你可以将你的任意一张黑色手牌当做【无懈可击】使用。",
  niepan_info: "限定技，出牌阶段或当你处于濒死状态时，你可以弃置你区域内的所有牌并复原你的武将牌，然后摸三张牌并将体力回复至3点。",
  oldniepan_info: "限定技，当你处于濒死状态时，你可以弃置你区域内的所有牌并复原你的武将牌，然后摸三张牌并将体力回复至3点。",
  quhu_info: "出牌阶段限一次，你可以与一名体力值大于你的角色拼点，若你赢，则该角色对其攻击范围内另一名由你指定的角色造成1点伤害。若你没赢，该角色对你造成1点伤害。",
  jieming_info: "当你受到1点伤害后，你可令一名角色将手牌摸至X张（X为其体力上限且至多为5）。",
  qiangxi_info: "出牌阶段限一次，你可以失去1点体力或弃置一张武器牌，然后对你攻击范围内的一名其他角色造成1点伤害。",
  qiangxix_info: "出牌阶段限两次，你可以失去1点体力或弃置一张武器牌，然后对一名本阶段内未成为过〖强袭〗的目标的其他角色造成1点伤害。",
  tianyi_info: "出牌阶段限一次，你可以和一名其他角色拼点。若你赢，你获得以下技能效果直到回合结束：你使用【杀】没有距离限制；可额外使用一张【杀】；使用【杀】时可额外指定一个目标。若你没赢，你不能使用【杀】直到回合结束。",
  shuangxiong_info: "摸牌阶段，你可以改为进行一次判定：你获得此判定牌，且你可以于此回合内将任意一张与此判定牌不同颜色的手牌当做【决斗】使用。",
  luanji_info: "出牌阶段，你可以将任意两张相同花色的手牌当做【万箭齐发】使用。",
  xueyi_info: "主公技，锁定技，场上每有一名其他群雄角色存活，你的手牌上限便+2。",
  mengjin_info: "当你使用的【杀】被【闪】抵消时，你可以弃置目标角色的一张牌。",
  re_xiahouyuan: "夏侯渊",
  re_huangzhong: "黄忠",
  re_weiyan: "魏延",
  old_zhoutai: "周泰",
  old_caoren: "曹仁",
  xuhuang: "旧徐晃",
  xuhuang_prefix: "旧",
  pangde: "旧庞德",
  pangde_prefix: "旧",
  xiahouyuan: "旧夏侯渊",
  xiahouyuan_prefix: "旧",
  huangzhong: "旧黄忠",
  huangzhong_prefix: "旧",
  sp_zhangjiao: "张角",
  weiyan: "旧魏延",
  weiyan_prefix: "旧",
  xiaoqiao: "小乔",
  zhangjiao: "旧张角",
  zhangjiao_prefix: "旧",
  //yuji:'于吉',
  shensu: "神速",
  shensu1: "神速",
  shensu2: "神速",
  shensu4: "神速",
  jushou: "据守",
  moon_jushou: "据守",
  liegong: "烈弓",
  kuanggu: "狂骨",
  tianxiang: "天香",
  hongyan: "红颜",
  buqu: "不屈",
  buqu_bg: "创",
  leiji: "雷击",
  guidao: "鬼道",
  huangtian: "黄天",
  huangtian2: "黄天",
  guhuo: "蛊惑",
  fenji: "奋激",
  releiji: "雷击",
  jiewei: "解围",
  tiangong: "天公",
  tiangong2: "天公",
  xinliegong: "烈弓",
  xinkuanggu: "狂骨",
  gzbuqu: "不屈",
  gzbuqu_info: "①当你扣减1点体力时，若你的体力值小于1，你可以将牌堆顶的一张牌置于你的武将牌上，称为“创”。②当你回复1点体力时，你移去一张“创”。③若你有“创”且点数均不相同，则你不结算濒死流程。",
  xinkuanggu_info: "当你造成1点伤害后，若受伤角色受到此伤害时你与其的距离不大于1，则你可以回复1点体力或摸一张牌。",
  xinliegong_info: "①你使用【杀】可以选择你距离不大于此【杀】点数的角色为目标。②当你使用【杀】指定一个目标后，你可以根据下列条件执行相应的效果：1.其手牌数小于等于你的手牌数，此【杀】不可被响应，2.其体力值大于等于你的体力值，此【杀】伤害+1。",
  jiewei_info: "当你的武将牌翻面后，你可以摸一张牌。然后你可以使用一张锦囊牌或装备牌，并可以在此牌结算后弃置场上一张同类型的牌。",
  releiji_info: "当你使用或打出一张【闪】时，你可令一名其他角色进行一次判定：若结果为梅花，你回复1点体力，并对其造成1点雷电伤害；若结果为黑桃，你对其造成2点雷电伤害。",
  tiangong_info: "锁定技，你防止即将受到的雷电伤害。每当你造成雷电伤害时，你摸一张牌。",
  shensu_info: "你可以跳过判定阶段和摸牌阶段，或跳过出牌阶段并弃置一张装备牌。若如此做，则你可以视为对任意一名角色使用一张无距离限制的【杀】。",
  jushou_info: "结束阶段，你可以摸三张牌并翻面。",
  moon_jushou_info: "结束阶段，你可以摸一张牌并翻面。",
  liegong_info: "当你使用【杀】时，若目标的手牌数大于等于你的体力值，或小于等于你的攻击范围，你可令此【杀】不能被响应。",
  kuanggu_info: "锁定技，当你造成伤害后，若受伤角色受到此伤害时你与其的距离不大于1，你回复X点体力（X为伤害值）。",
  tianxiang_info: "当你即将受到伤害时，你可以弃置一张♥手牌，将伤害转移给一名其他角色，然后该角色摸X张牌（X为其已损失的体力值）。",
  hongyan_info: "锁定技，你区域内的黑桃牌和黑桃判定牌均视为红桃。",
  buqu_info: "锁定技，当你处于濒死状态时，你亮出牌堆顶的一张牌并置于你的武将牌上，称之为“创”。若此牌的点数与你武将牌上已有的“创”点数均不同，则你回复至1体力。若点数相同，则将此牌置入弃牌堆。只要你的武将牌上有“创”，你的手牌上限便与“创”的数量相等。",
  buqu_info_guozhan: "锁定技，当你处于濒死状态时，你亮出牌堆顶的一张牌并置于你的武将牌上，称之为“创”。若此牌的点数与你武将牌上已有的“创”点数均不同，则你回复至1体力。若点数相同，则将此牌置入弃牌堆。",
  leiji_info: "当你使用或打出一张【闪】时，你可令任意一名角色进行一次判定。若结果为黑桃，其受到2点雷电伤害。",
  guidao_info: "一名角色的判定牌生效前，你可以打出一张黑色牌替换之。",
  huangtian_info: "主公技，其他群势力角色的出牌阶段限一次，其可以交给你一张【闪】或【闪电】。",
  guhuo_info: "每名角色的回合限一次，你可以扣置一张手牌当一张基本牌或普通锦囊牌使用或打出。其他角色依次选择是否质疑。一旦有其他角色质疑则翻开此牌：若为假则此牌作废，若为真，则质疑角色获得技能“缠怨”（锁定技，你不能质疑于吉，只要你的体力值为1，你失去你的武将技能）。",
  fenji_info: "当一名角色的手牌不因赠予或交给而被另一名角色得到后，或一名角色的手牌被另一名角色弃置后，你可以失去1点体力，令其摸两张牌。",
  new_fenji: "奋激",
  new_fenji_info: "一名角色的结束阶段开始时，若其没有手牌，你可以令其摸两张牌，然后你失去1点体力。",
  gzduanliang: "断粮",
  gzduanliang_info: "你可以将一张黑色基本牌或黑色装备牌当【兵粮寸断】使用；你可以对距离为2的角色使用【兵粮寸断】。",
  xinfu_guhuo: "蛊惑",
  xinfu_guhuo_info: `每回合限一次。你可以扣置一张手牌当做一张基本牌或普通锦囊牌使用或打出，其他角色依次选择是否质疑。当有角色质疑时，你终止质疑流程并展示此牌：若为假，此牌作废；若为真，该角色获得${get.poptip("chanyuan")}。`,
  guhuo_guess: "蛊惑",
  guhuo_guess_info: "",
  chanyuan: "缠怨",
  chanyuan_info: "锁定技。你不能于〖蛊惑〗的结算流程中进行质疑。当你的体力值为1时，你的其他技能失效。",
  guhuo_respond: "蛊惑",
  guhuo_respond_info: "",
  guhuo_wuxie: "蛊惑",
  guhuo_wuxie_info: "",
  guhuo_phase: "蛊惑",
  guhuo_phase_info: "",
  xinhongyan: "红颜",
  xinhongyan_info: "锁定技，你的♠牌和♠判定牌的花色视为♥。一名角色的判定结果生效前，若判定结果为♥，则你将其改为一种花色。",
  olliangyin: "良姻",
  olliangyin_info: "当有牌发生移动后，若此移动事件是本回合内你拥有〖良姻〗期间的首个有牌移出游戏/移入游戏的事件，则你可以选择一名其他角色。你与其各摸一张牌/弃置一张牌，然后你可以选择你或其中的一名手牌数为X的角色，该角色回复1点体力（X为你的“箜”数）。",
  olkongsheng: "箜声",
  olkongsheng_info: "①准备阶段开始时，你可以将任意张牌置于你的武将牌上，称为“箜”。②结束阶段开始时，若你有不为装备牌的“箜”，则你获得“箜”中的非装备牌，然后令一名角色依次使用“箜”中的装备牌并失去1点体力。",
  dcwanglie: "往烈",
  dcwanglie_info: "①出牌阶段，你对其他角色使用的前两张牌无距离限制。②当你于出牌阶段内使用牌时，你可以令此牌不能被响应，然后你于本阶段内不能使用牌指定其他角色为目标。",
  nzry_shicai: "恃才",
  nzry_shicai_info: "当你使用非装备牌结算结束后，或成为自己使用装备牌的目标后，若此牌为你本回合使用的首张该类型牌，则你可以将此牌置于牌堆顶，然后摸一张牌。",
  lianhuan: "连环",
  lianhuan_info: "你可以将♣手牌当作【铁索连环】使用或重铸。"
};
const characterTitles = {
  sp_zhugeliang: "卧龙",
  pangtong: "凤雏",
  xunyu: "王佐之才",
  dianwei: "古之恶来",
  taishici: "笃烈之士",
  yanwen: "虎狼兄弟",
  yuanshao: "乱箭肃敌",
  jiangwei: "龙的衣钵",
  liushan: "无为的真命主",
  zhanghe: "料敌机先",
  dengai: "矫然的壮士",
  old_dengai: "武将列传",
  sunce: "江东的小霸王",
  zhangzhang: "经天纬地",
  caiwenji: "异乡的孤女",
  zuoci: "迷之仙人",
  zhurong: "野性的女王",
  menghuo: "南蛮王",
  caopi: "霸业的继承者",
  re_xuhuang: "周亚夫之风",
  lusu: "当世入杰",
  sunjian: "武烈帝",
  dongzhuo: "魔王",
  jiaxu: "冷酷的毒士",
  re_xiahouyuan: "疾行的猎豹",
  re_huangzhong: "老当益壮",
  re_weiyan: "嗜血的独狼",
  old_zhoutai: "历战之躯",
  old_caoren: "大将军",
  xuhuang: "周亚夫之风",
  pangde: "人马一体",
  xiahouyuan: "疾行的猎豹",
  huangzhong: "老当益壮",
  sp_zhangjiao: "大贤良师",
  weiyan: "嗜血的独狼",
  xiaoqiao: "矫情之花",
  zhangjiao: "大贤良师",
  re_yuanshao: "高贵的名门",
  re_lusu: "独断外交家",
  re_yuji: "太平青领道",
  wangji: "经行合一",
  kuailiangkuaiyue: "雍论臼谋",
  sunliang: "寒江枯木",
  yl_luzhi: "国之桢干",
  xuyou: "朝秦暮楚",
  luji: "瑚琏之器",
  wangping: "兵谋以致用",
  yanyan: "断头将军",
  zhugezhan: "临难死义",
  lukang: "社稷之瑰宝",
  haozhao: "扣弦的豪将",
  yl_yuanshu: "仲家帝",
  zhangxiu: "北地枪王",
  chendao: "白毦督",
  re_pangde: "人马一体",
  guanqiujian: "镌功铭征荣",
  zhoufei: "软玉温香",
  old_zhoufei: "战场绝版"
};
const characterIntro = {
  huangzhong: "字汉升，今河南南阳人。汉末三国时期蜀汉名将。本为刘表部下中郎将，后归刘备，并助刘备攻益州刘璋，在定军山一战中阵斩曹操部下名将夏侯渊。备称汉中王后改封后将军，赐关内侯。",
  weiyan: "字文长，义阳人。三国时期蜀汉名将，诸葛亮死后，魏延因被陷害谋反而遭杨仪一党所杀。",
  xiahouyuan: "字妙才，沛国谯人。东汉末年曹操部下名将，夏侯惇之族弟，八虎骑之一。群雄征讨董卓时随曹操一同起兵，后征战四方，屡立功勋。在平定马超叛乱后负责西北防线的镇守。公元219年刘备攻打汉中，被刘备部将黄忠所杀。",
  caoren: "字子孝，沛国谯人，曹操的从弟。三国时期曹魏名将，官至大司马。谥曰忠侯。",
  xiaoqiao: "庐江皖县人也。父桥国老德尊于时。小乔国色流离，资貌绝伦。建安三年，周瑜协策攻皖，拔之。娶小乔为妻。后人谓英雄美女，天作之合。",
  zhoutai: "字幼平，九江下蔡人，三国时期吴国武将。早年与蒋钦随孙策左右，立过数次战功。孙策讨伐六县山贼时，周泰胆气绝伦，保卫孙权，勇战退敌，身受十二处伤。有诗云：三番救主出重围，忠勇如公世所稀。遍体疮痍犹痛饮，血痕残酒满征衣。",
  yuji: "自号太平道人，琅琊人，在吴郡、会稽一带为百姓治病，甚得人心。孙策怒之，以惑人心为由斩之，后策常受吉咒而亡。",
  zhangjiao: "乱世的开始，黄巾起义军首领，太平道创始人。张角早年信奉黄老学说，对在汉代十分流行的谶纬之学也深有研究，对民间医术 、巫术也很熟悉。",
  dianwei: "己吾城村人。东汉末年曹魏猛将。擅使大双戟，为人壮猛任侠，曾为乡人刘氏报仇，杀人出市，人莫敢近。相貌魁梧，膂力过人。建安二年（197），张绣背叛曹操，典韦为保护曹操而独挡叛军，击杀多人，但最终因寡不敌众而战死。",
  xunyu: "荀彧，字文若，颍川颍阴（今河南许昌）人。东汉末年曹操帐下首席谋臣，杰出的战略家。自小被世人称作“王佐之才”。",
  pangtong: "庞统，字士元，襄阳（治今湖北襄阳）人。三国时刘备帐下谋士，官拜军师中郎将。才智与诸葛亮齐名，人称“凤雏”。在进围雒县时，统率众攻城，不幸被流矢击中去世，时年三十六岁。追赐统为关内侯，谥曰靖侯。庞统死后，葬于落凤庞统墓坡。",
  sp_zhugeliang: "字孔明，号卧龙居士，琅琊阳都人。刘备曾“三顾茅庐”得见卧龙。卧龙以一篇《隆中对》分析天下形势，提出先取荆州，再取益州成鼎足之势的说法。《三国演义》中的诸葛亮善用“火攻”，曾用火攻战术赢得多场战役，如“火烧赤壁”、“火烧博望坡”、“火烧藤甲兵”等。",
  taishici: "太史慈，字子义，东莱黄县（今山东龙口东黄城集）人。东汉末年武将，守言应诺，恪遵信义，始终如一，弭息诽论。官至建昌都尉。弓马熟练，箭法精良。原为刘繇部下，后被孙策收降，于赤壁之战前病逝，死时才四十一岁。",
  pangde: "字令明，东汉末年雍州南安郡狟道县（今甘肃天水市武山县四门镇）人。曹操部下重要将领。官至立义将军，拜关门亭侯。谥曰壮侯。有一子庞会。",
  yanwen: "东汉末年河北袁绍部下武将，素有威名。颜良与文丑一起作为袁绍军队的勇将而闻名。建安四年（199），袁绍以颜良、文丑为将，率精卒十万，准备攻许都；次年，兵进黎阳，遣颜良攻白马。终均亡于关羽刀下。",
  yuanshao: "字本初，汉族，汝南汝阳人，出身名门望族，自曾祖父起四代有五人位居三公，自己也居三公之上，其家族也因此有“四世三公”之称。曾于初平元年被推举为反董卓联合军的盟主，联军瓦解后，在汉末群雄割据的过程中，袁绍先占据冀州，又先后夺青、并二州，并于建安四年击败了割据幽州的军阀公孙瓒，势力达到顶点；但在建安五年的官渡之战中败于曹操。在平定冀州叛乱之后，于建安七年病死。",
  xuhuang: "字公明，河东杨人。三国时期曹魏名将，本为杨奉帐下骑都尉，杨奉被曹操击败后转投曹操，在曹操手下多立功勋，参与官渡、赤壁、关中征伐、汉中征伐等几次重大战役。",
  caopi: "字子桓，三国时期著名的政治家、文学家，曹魏的开国皇帝，公元220－226年在位。沛国谯人，魏武帝曹操与武宣卞皇后的长子。去世后庙号高祖，谥为文皇帝，葬于首阳陵。",
  sunjian: "字文台，汉族，吴郡富春人。东汉末期地方军阀，著名将领。史书说他“容貌不凡，性阔达，好奇节”，是大军事家孙武的后裔。汉末群雄之一，三国中吴国的奠基人。孙权建国后，追谥孙坚为武烈皇帝。",
  dongzhuo: "字仲颖，陇西临洮人。东汉末年少帝、献帝时权臣，西凉军阀。官至太师、郿侯。其为人残忍嗜杀，倒行逆施，招致群雄联合讨伐，但联合军在董卓迁都长安不久后瓦解。后被其亲信吕布所杀。",
  zhurong: "据传为火神祝融氏后裔，南蛮王孟获之妻。武艺超群，善使飞刀，是《三国演义》中写到的唯一真正上过战场的女性。曾与孟获一起抵抗蜀军，在诸葛亮七擒七纵孟获之后，随孟获投降蜀汉。",
  menghuo: "中国三国时期南中少数族首领。系东汉末益州建宁郡( 今云南晋宁东 )大姓，身材肥硕。生卒年不详。官至御史中丞。曾被诸葛亮七擒七纵，传为佳话。",
  jiaxu: "字文和，武威姑臧人。三国时期魏国著名谋士。曾先后担任三国军阀李傕、张绣、曹操的谋士。官至魏国太尉，谥曰肃侯。",
  lusu: "字子敬，汉族，临淮东城人，中国东汉末年东吴的著名军事统帅。他曾为孙权提出鼎足江东的战略规划，因此得到孙权的赏识，于周瑜死后代替周瑜领兵，守陆口。曾单刀赴会关羽于荆州。",
  zhanghe: "字儁乂，河间鄚人。三国时期魏国名将。官渡之战时，本为袁绍部将的张郃投降了曹操，并在曹操帐下多立功勋，于曹魏建立后加封为征西车骑将军。诸葛亮六出祁山之间，张郃多次抵御蜀军的进攻，于公元231年在木门道被诸葛亮设伏射死。后谥曰壮侯。为曹魏“五子良将”之一。",
  dengai: "字士载，义阳棘阳人。三国时期魏国杰出的军事家、将领。公元263年他与钟会分别率军攻打蜀汉，最后他率先进入成都，使得蜀汉灭亡。后因遭到钟会的污蔑和陷害，被司马昭猜忌而被收押，最后与其子邓忠一起被卫瓘派遣的武将田续所杀害。",
  jiangwei: "字伯约，天水冀人。三国时期蜀汉著名将领、军事统帅。原为曹魏天水郡的中郎将，后降蜀汉，官至凉州刺史、大将军。诸葛亮去世后继承诸葛亮的遗志，继续率领蜀汉军队北伐曹魏，与曹魏名将陈泰、郭淮、邓艾等多次交手。",
  liushan: "蜀汉后主，字公嗣。小名阿斗。刘备之子，母亲是昭烈皇后甘氏。三国时期蜀汉第二位皇帝，公元223－263年在位。公元263年蜀汉被曹魏所灭，刘禅投降曹魏，被封为安乐公。",
  sunce: "字伯符，吴郡富春人。孙坚长子，孙权长兄。东汉末年割据江东一带的军阀，汉末群雄之一，三国时期吴国的奠基者。三国演义中绰号“小霸王”，统一江东。在一次狩猎中为刺客所伤，不久后身亡，年仅二十六岁。其弟孙权接掌孙策势力，并于称帝后，追谥孙策为长沙桓王。",
  zhangzhang: "张昭，字子布，彭城人，三国时期吴国重臣，善丹青。拜辅吴将军，班亚三司，改封娄侯。年八十一卒，谥曰文侯。张纮，字子纲，广陵人。东吴谋士，和张昭一起合称“二张”。孙策平定江东时亲自登门邀请，张纮遂出仕为官。张纮后来建议孙权迁都秣陵，孙权正在准备时张纮病逝，其年六十岁。孙权为之流涕。",
  zuoci: "左慈，字元放，东汉末方士，汉族，庐江（今安徽庐江西南）人。在道教历史上，东汉时期的丹鼎派道术是从他一脉相传。",
  caiwenji: "名琰，原字昭姬，晋时避司马昭讳，改字文姬，东汉末年陈留圉（今河南开封杞县）人，东汉大文学家蔡邕的女儿，是中国历史上著名的才女和文学家，精于天文数理，既博学能文，又善诗赋，兼长辩才与音律。代表作有《胡笳十八拍》、《悲愤诗》等 。",
  yanyan: "严颜，东汉末年武将，初为刘璋部下，担任巴郡太守。建安十九年，刘备进攻江州，严颜战败被俘，张飞对严颜说：“大军至，何以不降而敢拒战？”，严颜回答说：“卿等无状，侵夺我州，我州但有断头将军，无降将军也！”，张飞生气，命左右将严颜牵去砍头，严颜表情不变地说：“砍头便砍头，何为怒邪！”张飞敬佩严颜的勇气，遂释放严颜并以严颜为宾客，之后的事迹不在正史中出现。",
  wangping: "王平，字子均，巴西宕渠（今四川省渠县东北）人，籍贯益州。三国时蜀汉后期大将。原属曹操，曹操与刘备争汉中，得以投降刘备。诸葛亮第一次北伐时与马谡一同守街亭，之后深受诸葛亮的器重，率领蜀汉的王牌军队无当飞军，多次随诸葛亮北伐。诸葛亮死后，拜前监军、镇北大将军，镇守汉中，曹爽率领十万大军攻汉中时，被王平所击退，累封安汉侯。延熙十一年，王平去世，其子王训继承了爵位。",
  luji: "陆绩（公元188年－公元219年），字公纪，吴郡吴县（今苏州）人，汉末庐江太守陆康之子。陆绩成年后，博学多识，通晓天文、历算，星历算数无不涉览。孙权征其为奏曹掾，常以直道见惮。后出为郁林太守，加偏将军。在军中不废著作，曾作《浑天图》，注《易经》，撰写《太玄经注》。",
  sunliang: "孙亮（243－260年），字子明，吴郡富春（今浙江杭州富阳区）人。三国时期吴国的第二位皇帝，公元252－258年在位。吴大帝孙权第七子，母潘皇后。史称吴少帝、吴废帝、会稽王。建兴元年（252年），十岁登基为帝，太平二年（257年），十五岁亲政，但一年后（258年）就被权臣孙綝废为会稽王。永安三年（260年），孙亮再被贬为候官侯，在前往封地途中自杀（一说被毒杀），终年18岁。西晋太康年间，原先任职吴国的官员戴显将孙亮的遗骨葬在赖乡。",
  xuyou: "许攸（？－204年），字子远，南阳（治今河南南阳）人。本为袁绍帐下谋士，官渡之战时其家人因犯法而被收捕，许攸因此背袁投曹，并为曹操设下偷袭袁绍军屯粮之所乌巢的计策，袁绍因此而大败于官渡。后许攸随曹操平定冀州，因自恃其功而屡屡口出狂言，终因触怒曹操而被杀。",
  yl_luzhi: "卢植（139年—192年），字子干。涿郡涿县（今河北涿州）人。东汉末年经学家、将领。卢植性格刚毅，师从太尉陈球、大儒马融等，为郑玄、管宁、华歆的同门师兄。曾先后担任九江、庐江太守，平定蛮族叛乱。后与马日磾、蔡邕等一起在东观校勘儒学经典书籍，并参与续写《汉记》。黄巾起义时为北中郎将，率军与张角交战，后被诬陷下狱，皇甫嵩平定黄巾后力救卢植，于是复任为尚书。后因上谏激怒董卓被免官，隐居在上谷军都山，被袁绍请为军师。初平三年（192年）去世。著有《尚书章句》、《三礼解诂》等，今皆失佚。唐代时配享孔子，北宋时被追封为良乡伯。白马将军公孙瓒以及后来的蜀汉昭烈帝刘备皆为卢植门下弟子。范阳卢氏后来也成为著名的家族。",
  kuailiangkuaiyue: "蒯良，字子柔，襄阳中庐人。归刘表。蒯良为刘表定下安抚荆楚的政治方向，佐其成业，被刘表誉为“雍季之论”。之后，蒯良就被刘表擢升为主簿（bù）。其后蒯良的生平，就不得而知了，《三国志》亦没有记载其卒年。与蒯越、以及同样活跃于襄阳的蒯祺（诸葛亮姐夫）或为同族兄弟。蒯越（？－214年），字异度，襄阳中庐（今湖北襄阳西南）人。东汉末期人物，演义中为蒯良之弟。原本是荆州牧刘表的部下，曾经在刘表初上任时帮助刘表铲除荆州一带的宗贼（以宗族、乡里关系组成的武装集团）。刘表病逝后与刘琮一同投降曹操，后来官至光禄勋。",
  guanqiujian: "毌丘俭，字仲恭，河东闻喜（今山西闻喜县）人。三国时期曹魏后期的重要将领。继承父毌丘兴爵位高阳乡侯，任平原侯文学。魏明帝即位后，上疏劝魏明帝停止加建皇宫的工程，升为荆州刺史。景初二年（238年）从司马懿攻灭公孙渊；正始五年（244年）至正始六年（245年）两次率兵征讨高句丽，攻破丸都，几亡其国，刻石纪功而还；253年击退吴国诸葛恪的大举进犯，战功累累。司马师废帝，毌丘俭感昔日魏明帝之恩，为曹魏政权做拼死一搏，于正元二年（255年）发动兵变，即后人所谓“淮南三叛”（王凌、毌丘俭、诸葛诞）之一，惜准备不足，兵败身亡。",
  haozhao: "郝昭（生卒年不详），字伯道，太原人，中国东汉末年至曹魏初年著名将领。郝昭少年从军，屡立战功，逐渐晋升为杂号将军，后受曹真的推荐镇守陈仓（在小说三国演义中是司马懿推荐），防御蜀汉。太和二年（228年），诸葛亮率军北伐，为郝昭所阻，劝降不成，昼夜相攻二十余日后被迫退军。魏明帝因此封其为关内侯。不久因染疾而病死。",
  zhugezhan: "诸葛瞻，字思远，琅邪阳都（今山东沂南县）人。三国时期蜀汉大臣，蜀汉丞相诸葛亮之子。邓艾伐蜀时，他与长子诸葛尚及蜀将张遵、李球、黄崇等人防御绵竹（今四川德阳），因不听黄崇速占险要的建议而坐失良机，后来出城与邓艾决战，在交战时阵亡，绵竹也随后失守。",
  zhoufei: "周妃（210年？—？），一说本名周彻。周瑜独女，生母无载，疑为汉末美女小乔，因嫁孙登为太子妃，故称周妃。周瑜英年早逝，其遗孤都得到孙权厚遇，除却她本人在黄武四年（225年）嫁予太子外，兄长周循亦娶孙权长女孙鲁班为妻。",
  lukang: "陆抗，字幼节，吴郡吴县（今江苏苏州）人。三国时期吴国名将，丞相陆逊次子。陆抗袭父爵为江陵侯，为建武校尉，领其父众五千人。后迁立节中郎将、镇军将军等。孙皓为帝，任镇军大将军、都督西陵、信陵、夷道、乐乡、公安诸军事，驻乐乡（今湖北江陵西南）。凤凰元年（272年），击退晋将羊祜进攻，并攻杀叛将西陵督步阐。后拜大司马、荆州牧，卒于官，终年49岁。与陆逊皆是吴国的中流砥柱，并称“逊抗 ”，被誉为吴国最后的名将。",
  zhangxiu: "张绣，武威祖厉（今甘肃靖远）人。骠骑将军张济的从子。东汉末年割据宛城的军阀，汉末群雄之一。初随张济征伐，张济死后与刘表联合。后降曹操，因曹操调戏其嫂而突袭曹操，复与刘表连和。官渡之战前夕，听从贾诩的建议再次投降曹操，参加官渡之战，官至破羌将军，封宣威侯。在北征乌桓（207年）途中去世（一说为曹丕逼死），谥定侯。",
  chendao: "陈到，字叔至，生卒年不详，豫州汝南（今河南驻马店平舆县）人。三国时期蜀汉将领，刘备帐下白毦兵统领，名位常亚于赵云，以忠勇著称。蜀汉建兴年间，任征西将军、永安都督，封亭侯。在任期间去世。"
};
const characterFilters = {
  zuoci(mode) {
    return mode != "guozhan";
  }
};
const dynamicTranslates = {
  drlt_jueyan(player) {
    if (player.hasSkill("drlt_jueyan_effect")) {
      return lib.translate["drlt_jueyan_rewrite_info"];
    }
    return lib.translate["drlt_jueyan_info"];
  },
  nzry_juzhan(player) {
    const bool = player.storage.nzry_juzhan;
    let yang = "当你成为其他角色【杀】的目标后，你可以与其各摸一张牌，然后其本回合内不能再对你使用牌", yin = "当你使用【杀】指定一名角色为目标后，你可以获得其一张牌，然后你本回合内不能再对其使用牌";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技。", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  nzry_zhenliang(player) {
    const bool = player.storage.nzry_zhenliang;
    let yang = "出牌阶段限一次，你可以弃置一张与“任”颜色相同的牌并对攻击范围内的一名角色造成1点伤害", yin = "当你于回合外使用或打出的牌结算完成后，若此牌与“任”颜色相同，则你可以令一名角色摸一张牌";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技。", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  nzry_chenglve(player) {
    const bool = player.storage.nzry_chenglve;
    let yang = "你可以摸一张牌，然后弃置两张手牌", yin = "你可以摸两张牌，然后弃置一张手牌";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技。出牌阶段限一次，", end = "。若如此做，直到本回合结束，你使用与弃置牌花色相同的牌无距离和次数限制。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  nzry_shenshi(player) {
    const bool = player.storage.nzry_shenshi;
    let yang = "出牌阶段限一次，你可以将一张牌交给一名手牌数最多的角色，然后对其造成1点伤害，若该角色因此死亡，则你可以令一名角色将手牌摸至四张", yin = "其他角色对你造成伤害后，你可以观看该角色的手牌，然后交给其一张牌，当前角色回合结束时，若此牌仍在该角色的手牌区或装备区，你将手牌摸至四张";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技。", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  }
};
const perfectPairs = {};
const voices = {
  "#yingyang1": "此战，我必取胜！",
  "#yingyang2": "相斗之趣，吾常胜之！",
  "#liegong_re_huangzhong1": "弓不离手，自有转机。",
  "#liegong_re_huangzhong2": "箭阵开道，所向无敌！",
  "#re_huangzhong:die": "把我的弓，拿来，呃。",
  "#gzbuqu1": "还不够！",
  "#gzbuqu2": "我绝不会倒下！",
  "#old_zhoutai:die": "已经，尽力了……",
  "#jushou1": "我先休息一会！",
  "#jushou2": "尽管来吧！",
  "#new_caoren:die": "实在是守不住了……",
  "#duanliang1_re_xuhuang1": "粮不三载，敌军已犯行军大忌。",
  "#duanliang1_re_xuhuang2": "断敌粮秣，此战可胜。",
  "#jiezi1": "因粮于敌，故军食可足也。",
  "#jiezi2": "食敌一钟，当吾二十钟。",
  "#re_xuhuang:die": "敌军防备周全，是吾轻敌……",
  "#jianchu_re_pangde1": "来呀，冲杀出去，杀他个片甲不留。",
  "#jianchu_re_pangde2": "一人一骑，横扫千军！",
  "#re_pangde:die": "我宁为国家鬼，不为贼将也！",
  "#shensu1_re_xiahouyuan1": "吾等无需恋战。",
  "#shensu1_re_xiahouyuan2": "吾自当以一当十，速战速决。",
  "#re_xiahouyuan:die": "吾命休矣，遂成竖子之名……",
  "#kuanggu_re_weiyan1": "哼！也不看看我是何人！",
  "#kuanggu_re_weiyan2": "哈哈哈哈哈哈，赢你还不容易？",
  "#qimou1": "成王败寇，怎可有勇无谋？",
  "#qimou2": "且不要因为暂时的得失而胆怯。",
  "#re_weiyan:die": "奸贼……害我……",
  "#tianxiang1": "接着哦~",
  "#tianxiang2": "替我挡着~",
  "#hongyan": "（琴声）",
  "#xiaoqiao:die": "公瑾……我先走一步……",
  "#releiji1": "成为黄天之世的祭品吧！",
  "#releiji2": "呼风唤雨，驱雷策电！",
  "#guidao_sp_zhangjiao1": "道施所向，皆由我控。",
  "#guidao_sp_zhangjiao2": "哼哼，天意如此。",
  "#huangtian21": "苍天不覆，黄天将替！",
  "#huangtian22": "黄天立，民心顺，天下平。",
  "#sp_zhangjiao:die": "黄天既覆……苍生何存？",
  "#guhuo_guess1": "道法玄机，变幻莫测。",
  "#guhuo_guess2": "如真似幻，扑朔迷离。",
  "#re_yuji:die": "道法玄机，竟被参破……",
  "#bazhen1": "你可识得此阵？",
  "#bazhen2": "太极生两仪，两仪生四象，四象生八卦。",
  "#huoji1": "此火可助我军大获全胜。",
  "#huoji2": "燃烧吧！",
  "#kanpo1": "雕虫小技。",
  "#kanpo2": "你的计谋被识破了。",
  "#sp_zhugeliang:die": "我的计谋竟被……",
  "#lianhuan1": "伤一敌可连其百！",
  "#lianhuan2": "通通连起来吧！",
  "#niepan1": "凤雏岂能消亡？",
  "#niepan2": "浴火重生！",
  "#pangtong:die": "看来我命中注定将丧命于此……",
  "#quhu1": "此乃驱虎吞狼之计。",
  "#quhu2": "借你之手，与他一搏吧。",
  "#jieming1": "秉忠贞之志，守谦退之节。",
  "#jieming2": "我，永不背弃。",
  "#xunyu:die": "主公要臣死，臣不得不死……",
  "#qiangxi1": "吃我一戟！",
  "#qiangxi2": "看我三步之内取你小命！",
  "#dianwei:die": "主公，快走！",
  "#tianyi1": "请助我一臂之力！",
  "#tianyi2": "我当要替天行道！",
  "#taishici:die": "大丈夫，当带三尺之剑，立不世之功！",
  "#shuangxiong1": "吾乃河北上将颜良文丑是也！",
  "#shuangxiong2": "快来与我等决一死战！",
  "#yanwen:die": "这红脸长须大将是……",
  "#luanji1": "弓箭手，准备放箭！",
  "#luanji2": "全都去死吧！",
  "#yuanshao:die": "老天不助我袁家啊！……",
  "#huoshou11": "背黑锅我来，送死？你去！",
  "#huoshou12": "通通算我的！",
  "#zaiqi1": "起！",
  "#zaiqi2": "丞相助我！",
  "#menghuo:die": "七纵之恩……来世……再报了……",
  "#juxiang11": "小小把戏~",
  "#juxiang12": "大王，看我的。",
  "#lieren1": "亮兵器吧。",
  "#lieren2": "尝尝我飞刀的厉害！",
  "#zhurong:die": "大王，我……先走一步了……",
  "#xingshang1": "来，管杀还管埋！",
  "#xingshang2": "我的是我的，你的还是我的。",
  "#fangzhu1": "死罪可免，活罪难赦！",
  "#fangzhu2": "给我翻过来！",
  "#songwei21": "仙福永享，寿与天齐！",
  "#songwei22": "千秋万载，一统江山！",
  "#caopi:die": "子建，子建……",
  "#haoshi1": "来来来，见面分一半。",
  "#haoshi2": "拿去拿去，莫跟哥哥客气！",
  "#dimeng1": "合纵连横，方能以弱胜强。",
  "#dimeng2": "以和为贵，以和为贵。",
  "#re_lusu:die": "此联盟已破，吴蜀休矣……",
  "#yinghun1": "不诛此贼三族，则吾死不瞑目！",
  "#yinghun2": "以吾魂魄，保佑吾儿之基业。",
  "#sunjian:die": "有埋伏！呃……啊！！",
  "#jiuchi1": "呃呵呵呵呵，好酒好酒！",
  "#jiuchi2": "呃……再来……一壶……",
  "#roulin1": "食色，性也~~",
  "#roulin2": "美人儿，来，香一个~~",
  "#benghuai1": "嗯呃~",
  "#benghuai2": "哎，我是不是该减肥了？",
  "#baonue21": "呵哈哈哈哈哈哈哈哈！",
  "#baonue22": "顺我者昌，逆我者亡！",
  "#dongzhuo:die": "汉室衰落，非我一人之罪……",
  "#luanwu1": "哭喊吧，哀求吧，挣扎吧，然后，死吧！",
  "#luanwu2": "哼哼哼……坐山观虎斗！",
  "#wansha1": "神仙难救，神仙难救啊。",
  "#wansha2": "我要你三更死，谁敢留你到五更！",
  "#weimu1": "此计伤不到我。",
  "#weimu2": "你奈我何？",
  "#jiaxu:die": "我的时辰也到了……",
  "#tiaoxin1": "贼将早降，可免一死。",
  "#tiaoxin2": "汝等小儿，可敢杀我？",
  "#zhiji1": "先帝之志，丞相之托，不可忘也！",
  "#zhiji2": "丞相厚恩，维万死不能相报。",
  "#jiangwei:die": "我计不成，乃天命也……",
  "#xiangle1": "打打杀杀，真没意思。",
  "#xiangle2": "我爸爸是刘备！",
  "#fangquan1": "诶，这可如何是好啊？",
  "#fangquan2": "哎，你办事儿，我放心~",
  "#ruoyu1": "不装疯卖傻，岂能安然无恙？",
  "#ruoyu2": "世人皆错看我，唉！",
  "#liushan:die": "别打脸，我投降还不行吗？",
  "#qiaobian1": "兵无常势，水无常形。",
  "#qiaobian2": "用兵之道，变化万千。",
  "#zhanghe:die": "啊……膝盖……中箭了……",
  "#tuntian1": "休养生息，备战待敌。",
  "#tuntian2": "锄禾日当午，汗滴禾下土。",
  "#zaoxian1": "屯田日久，当建奇功！",
  "#zaoxian2": "开辟险路，奇袭敌军！",
  "#dengai:die": "吾破蜀克敌，竟葬于奸贼之手！",
  "#jiang1": "江东子弟，何惧于天下！",
  "#jiang2": "吾乃江东小霸王孙伯符！",
  "#hunzi1": "父亲在上，魂佑江东；公瑾在旁，智定天下！",
  "#hunzi2": "愿承父志，与公瑾共谋天下！",
  "#yinghun_sunce1": "父亲，助我背水一战！",
  "#yinghun_sunce2": "孙氏英烈，庇佑江东！",
  "#zhiba1": "是友是敌，一探便知。",
  "#zhiba2": "我若怕你，非孙伯符也！",
  "#sunce:die": "内事不决问张昭，外事不决问周瑜……",
  "#zhijian1": "请恕老臣直言！",
  "#zhijian2": "为臣者，当冒死以谏！",
  "#guzheng1": "今当稳固内政，以御外患。",
  "#guzheng2": "固国安邦，居当如是！",
  "#zhangzhang:die": "竭力尽智，死而无憾……",
  "#beige1": "悲歌可以当泣，远望可以当归。",
  "#beige2": "制兹八拍兮拟排忧，何知曲成兮心转愁。",
  "#duanchang1": "流落异乡愁断肠。",
  "#duanchang2": "日东月西兮徒相望，不得相随兮空断肠。",
  "#caiwenji:die": "人生几何时，怀忧终年岁……",
  "#huashen21": "哼，肉眼凡胎，岂能窥视仙人变幻？",
  "#huashen22": "万物苍生，幻化由心。",
  "#xinsheng1": "幻幻无穷，生生不息。",
  "#xinsheng2": "吐故纳新，师法天地。",
  "#zuoci:die": "腾云跨风，飞升太虚……",
  "#qizhi1": "声东击西，敌寇一网成擒。",
  "#qizhi2": "吾意不在此地，已遣别部出发。",
  "#jinqu1": "建上昶水城，以逼夏口！",
  "#jinqu2": "通川聚粮，伐吴之业，当步步为营。",
  "#wangji:die": "天下之势，必归大魏，可恨，未能得见呐！",
  "#nzry_juzhan_11": "砍头便砍头，何为怒耶！",
  "#nzry_juzhan_12": "我州但有断头将军，无降将军也！",
  "#yanyan:die": "宁可断头死，安能屈膝降！",
  "#nzry_feijun1": "山地崎岖，也挡不住飞军破势！",
  "#nzry_feijun2": "无当飞军，伐叛乱，镇蛮夷！",
  "#nzry_binglve1": "兵略者，明战胜攻取之数，形机之势，诈谲之变。",
  "#nzry_binglve2": "奇略兵速，敌未能料之。",
  "#wangping:die": "无当飞军，也有困于深林之时……",
  "#nzry_huaiju1": "袖中怀绿桔，遗母报乳哺。",
  "#nzry_huaiju2": "情深舐犊，怀擢藏橘。",
  "#nzry_yili1": "遗失礼仪，则俱非议。",
  "#nzry_yili2": "行遗礼之举，于不敬王者。",
  "#nzry_zhenglun1": "整论四海未泰，修文德以平。",
  "#nzry_zhenglun2": "今论者不务道德怀取之术，而惟尚武，窃所未安。",
  "#luji:die": "恨不能见，车同轨，书同文……",
  "#nzry_kuizhu1": "子通专恣，必谋而诛之！",
  "#nzry_kuizhu2": "孙綝久专，不可久忍，必溃诛！",
  "#nzry_zhizheng1": "风驰电掣，政权不怠！",
  "#nzry_zhizheng2": "廉平掣政，实为艰事。",
  "#nzry_lijun11": "立于朝堂，定于军心。",
  "#nzry_lijun12": "君立于朝堂，军侧于四方！",
  "#sunliang:die": "今日欲诛逆臣而不得，方知机事不密则害成……",
  "#nzry_chenglve1": "成略在胸，良计速出。",
  "#nzry_chenglve2": "吾有良略在怀，必为阿瞒所需。",
  "#nzry_shicai_21": "吾才满腹，袁本初竟不从之。",
  "#nzry_shicai_22": "阿瞒有我良计，取冀州便是易如反掌。",
  "#nzry_cunmu1": "哼！目光所及，短寸之间。",
  "#nzry_cunmu2": "狭目之见，只能窥底。",
  "#xuyou:die": "阿瞒，没有我你得不到冀州啊！",
  "#nzry_mingren_11": "吾之任，君之明举！",
  "#nzry_mingren_12": "得义真所救，吾任之必尽瘁以报。",
  "#nzry_zhenliang_11": "贞洁贤良，吾之本心。",
  "#nzry_zhenliang_12": "风霜以别草木之性，危乱而见贞良之节。",
  "#yl_luzhi:die": "泓泓眸子宿渊亭，不见蛾眉只见经……",
  "#nzry_jianxiang1": "得遇曹公，吾之幸也。",
  "#nzry_jianxiang2": "曹公得荆不喜，喜得吾二人足矣。",
  "#nzry_shenshi_11": "深中足智，鉴时审情。",
  "#nzry_shenshi_12": "数语之言，审时度势。",
  "#kuailiangkuaiyue:die": "表不能善用，所憾也……",
  "#drlt_zhenrong1": "东征高句丽，保辽东安稳。",
  "#drlt_zhenrong2": "跨海东征，家国俱荣。",
  "#drlt_hongju1": "一举拿下，鸿途可得。",
  "#drlt_hongju2": "鸿飞荣升，举重若轻。",
  "#guanqiujian:die": "峥嵘一生，然被平民所击射！",
  "#drlt_zhengu1": "镇守城池，必以骨相拼！",
  "#drlt_zhengu2": "孔明计虽百算，却难敌吾镇骨千具！",
  "#haozhao:die": "镇守陈仓，也有一失……",
  "#xinfu_zuilun1": "吾有三罪，未能除黄皓、制伯约、守国土。",
  "#xinfu_zuilun2": "唉，数罪当论，吾愧对先帝恩惠。",
  "#xinfu_fuyin1": "得父荫庇，平步青云。",
  "#xinfu_fuyin2": "吾自幼心怀父诫，方不愧父亲荫庇。",
  "#zhugezhan:die": "临难而死义，无愧先父……",
  "#drlt_qianjie1": "继父之节，谦逊恭毕。",
  "#drlt_qianjie2": "谦谦清廉德，节节卓尔茂。",
  "#drlt_jueyan1": "毁堰坝之计，实为阻晋粮道。",
  "#drlt_jueyan2": "堰坝毁之，可令敌军自退。",
  "#drlt_poshi1": "破晋军分进合击之势，牵晋军主力之实！",
  "#drlt_poshi2": "破羊祜之策，势在必行！",
  "#lukang:die": "哎，陛下不听，社稷恐有危难……",
  "#drlt_yongsi1": "传国玉玺在手，朕语便是天言。",
  "#drlt_yongsi2": "朕今日雄踞淮南，明日便可一匡天下。",
  "#drlt_weidi1": "天下，即将尽归吾袁公路！",
  "#drlt_weidi2": "传朕旨意，诸部遵旨即可。",
  "#yl_yuanshu:die": "仲朝国祚，本应千秋万代，薪传不息……",
  "#drlt_xiongluan1": "雄据宛城，虽乱世可安！",
  "#drlt_xiongluan2": "北地枭雄，乱世不败！！",
  "#drlt_congjian1": "听君谏言，去危亡，保宗祀！",
  "#drlt_congjian2": "从谏良计，可得自保！",
  "#zhangxiu:die": "若失文和……吾将何归……",
  "#drlt_wanglie1": "猛将之烈，统帅之所往。",
  "#drlt_wanglie2": "与子龙忠勇相往，猛烈相合。",
  "#chendao:die": "我的白毦兵，再也不能为先帝出力了……",
  "#liangyin1": "结得良姻，固吴基业。",
  "#liangyin2": "君恩之命，妾身良姻之福。",
  "#kongsheng1": "窈窕淑女，箜篌有知。",
  "#kongsheng2": "箜篌声声，琴瑟和鸣。",
  "#zhoufei:die": "夫君，妾身再也不能陪你看这江南翠绿了……",
  "#buqu1": "哼，这点小伤算什么！",
  "#buqu2": "战如熊虎，不惜躯命！",
  "#fenji1": "百战之身，奋勇趋前！",
  "#fenji2": "两肋插刀，愿赴此躯！",
  "#yinghun_ol_sunjian1": "提刀奔走，灭敌不休。",
  "#yinghun_ol_sunjian2": "贼寇草莽，我且出战。",
  "#xueyi_re_yuanshao1": "崇王攘夷，生长尊贵。",
  "#xueyi_re_yuanshao2": "衣冠华胄，宜蒙优免。",
  "#chanyuan1": "不识天数，在劫难逃。",
  "#chanyuan2": "凡人仇怨，皆由心生。",
  "#guanxing_jiangwei1": "继丞相之遗志，讨篡汉之逆贼！",
  "#guanxing_jiangwei2": "克复中原，指日可待！",
  "#jijiang1_liushan1": "匡扶汉室，谁敢出战！",
  "#jijiang1_liushan2": "我蜀汉岂无人乎？",
  "#jixi1": "攻其不备，出其不意！",
  "#jixi2": "偷渡阴平，直取蜀汉！",
  "#reyingzi_sunce1": "尔等看好了！",
  "#reyingzi_sunce2": "公瑾，助我决一死战！",
  "#drlt_qingce1": "感明帝之恩，清君侧之贼。",
  "#drlt_qingce2": "得太后手诏，清奸佞乱臣。",
  "#rejizhi_lukang1": "智父安能有愚子乎？",
  "#drlt_huairou1": "各保分界，无求细利。",
  "#drlt_huairou2": "胸怀千万，彰其德，包其柔。",
  "#shensu11": "吾善于千里袭人！",
  "#shensu12": "取汝首级，有如探囊取物！"
};
const characterSort = {
  shenhua_feng: ["sp_zhangjiao", "re_yuji", "old_zhoutai", "old_caoren", "re_xiahouyuan", "xiaoqiao", "re_huangzhong", "re_weiyan"],
  shenhua_huo: ["dianwei", "xunyu", "pangtong", "sp_zhugeliang", "taishici", "yanwen", "re_yuanshao", "re_pangde"],
  shenhua_lin: ["caopi", "re_xuhuang", "menghuo", "zhurong", "re_lusu", "sunjian", "dongzhuo", "jiaxu"],
  shenhua_shan: ["dengai", "zhanghe", "liushan", "jiangwei", "zhangzhang", "sunce", "caiwenji", "zuoci"],
  shenhua_yin: ["wangji", "kuailiangkuaiyue", "yanyan", "wangping", "sunliang", "luji", "xuyou", "yl_luzhi"],
  shenhua_lei: ["haozhao", "guanqiujian", "chendao", "zhugezhan", "lukang", "zhoufei", "zhangxiu", "yl_yuanshu"]
};
const characterSortTranslate = {
  shenhua_feng: "神话再临·风",
  shenhua_huo: "神话再临·火",
  shenhua_lin: "神话再临·林",
  shenhua_shan: "神话再临·山",
  shenhua_yin: "神话再临·阴",
  shenhua_lei: "神话再临·雷"
};
game.import("character", function() {
  return {
    name: "shenhua",
    connect: true,
    character: { ...characters },
    characterSort: {
      shenhua: characterSort
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
