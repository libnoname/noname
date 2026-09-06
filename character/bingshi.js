import { lib, get, ui, _status, game } from "noname";
const characters = {
  pot_xiaoqiao: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["potheyun", "potyinhui"],
    names: "桥|null"
  },
  pot_zhouyu: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["potchiyun", "potyanhui", "potfentao", "potxiongzi"]
  },
  pot_chengpu: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["potduzuo", "potbihan"]
  },
  pot_xiahouba: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["potlibing", "potpoxi"],
    names: "夏侯|霸"
  },
  pot_chenqun: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["potfaen", "potdingpin"]
  },
  pot_caozhen: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["potsifeng"]
  },
  pot_lvyi: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["pothuilv", "potsongyan", "potshishi"]
  },
  pot_caoshuang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["potdianyi", "potshequan", "potjianzhuan"]
  },
  pot_zhangren: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["potfuan", "potyinxian"]
  },
  pot_sunchen: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["potnigu", "potlulian"]
  },
  sp_zhonghui: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["mbsizi", "mbxiezhi", "mbyunan", "mbkechang"],
    isZhugong: true,
    clans: ["颍川钟氏"],
    doubleGroup: ["wei", "qun"]
  },
  pot_zanghong: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["pot_liezhi", "pot_jugu"]
  },
  pot_chenjiao: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["potqingyan", "potceduan"]
  },
  pot_chendao: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["potwanglie", "pothongyi"]
  },
  pot_dengai: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["pottuntian", "potzaoxian", "potjixi"]
  },
  pot_huanjie: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["potgongmou", "potzhengshuo"]
  },
  pot_xinxianying: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["potjiejie", "potqingshi"]
  },
  mb_chenzhi: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["mbquanchong", "mbrenxing"]
  },
  pot_lusu: {
    sex: "male",
    hp: 3,
    group: "wu",
    skills: ["pothaoshi", "potdimeng"]
  },
  mb_sunjun: {
    sex: "male",
    hp: 3,
    group: "wu",
    skills: ["mbxiongtu", "mbxianshuai"]
  },
  pot_weiyan: {
    hp: 4,
    sex: "male",
    group: "shu",
    skills: ["potzhongao", "potzhuangshi", "potyinzhan"]
  },
  mb_zhangyan: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["mbfeijing", "mbxiaoge"]
  },
  guoyuan: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["mbqingdao", "mbxiugeng", "mbchenshe"]
  },
  mb_huangzu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["mbchizhang", "mbduanyang"]
  },
  mb_tianfeng: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["mbganggeng", "mbsijian"]
  },
  mb_luyusheng: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["mbrunwei", "mbshuanghuai"],
    clans: ["吴郡陆氏"]
  },
  mb_yanghong: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["mbjianji", "mbyuanmo"]
  },
  mb_xiahoushang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["mbtanfeng"],
    dieAudios: ["tw_xiahoushang"],
    img: "image/character/tw_xiahoushang.jpg",
    names: "夏侯|尚"
  },
  sunsháo: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["mbganjue", "mbzhuji"]
  },
  //跟孙邵拼音字母相同了
  pangxi: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["mbxuye", "mbkuangxiang"]
  },
  pot_yuji: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["potfuji", "potdaozhuan"]
  },
  pot_lougui: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["potguansha", "potjiyu"]
  },
  pot_dongzhao: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["spmiaolve", "spyingjia"],
    img: "image/character/tw_dongzhao.jpg",
    dieAudios: ["tw_dongzhao"]
  },
  pot_taishici: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["pothanzhan", "potzhanlie", "potzhenfeng"],
    names: "太史|慈"
  }
};
const cards = {};
const pinyins = {};
const skills = {
  //potential--潜在, 潜力, 可能, 电位, 潜能, 势
  //势小乔
  potheyun: {
    audio: 2,
    enable: "phaseUse",
    usable: 2,
    filter(event, player) {
      const skills2 = player.getSkills(null, false, false).filter((skill) => {
        const info = get.info(skill);
        const dizhuSkill = ["飞扬", "跋扈", "恃强", "殷富"];
        const t = lib.translate[skill];
        if (dizhuSkill.includes(t)) {
          return true;
        }
        return info && !info.charlotte;
      });
      return skills2.length && game.hasPlayer((current) => get.info("potheyun").filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      const skills2 = player.getSkills(null, false, false).filter((skill) => {
        const info = get.info(skill);
        const dizhuSkill = ["飞扬", "跋扈", "恃强", "殷富"];
        const t = lib.translate[skill];
        if (dizhuSkill.includes(t)) {
          return true;
        }
        return info && !info.charlotte;
      });
      return target.getSkills(null, false, false).containsSome(...skills2);
    },
    async content(event, trigger, player) {
      const target = event.target;
      const skills2 = player.getSkills(null, false, false).filter((skill) => {
        const info = get.info(skill);
        const dizhuSkill = ["飞扬", "跋扈", "恃强", "殷富"];
        const t = lib.translate[skill];
        if (dizhuSkill.includes(t)) {
          return true;
        }
        return info && !info.charlotte;
      });
      const list = [];
      for (const skill of skills2) {
        list.push([skill, `<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【` + get.translation(skill) + "】</div><div>" + lib.translate[skill + "_info"] + "</div></div>"]);
      }
      const result = skills2.length > 1 ? await player.chooseButton({
        createDialog: ["合韵：请失去一个技能", [list, "textbutton"]],
        forced: true,
        ai(button) {
          const player2 = get.player();
          if (player2.additionalSkills?.potyinhui?.includes(button.link)) return 10 + Math.random();
          if (get.info(button.link).ai?.neg) return 100 + Math.random();
          return 1 + Math.random();
        }
      }).forResult() : { bool: true, links: skills2 };
      if (result?.bool && result.links?.length) {
        const skills3 = result.links;
        await player.removeSkills(skills3);
        await target.draw({ num: 2 });
      }
    },
    ai: {
      order: 1,
      result: {
        player(player, target) {
          const skills2 = player.getSkills(null, false, false).filter((skill) => {
            const info = get.info(skill);
            const dizhuSkill = ["飞扬", "跋扈", "恃强", "殷富"];
            const t = lib.translate[skill];
            if (dizhuSkill.includes(t)) return true;
            return info && !info.charlotte;
          });
          return skills2.some((skill) => {
            if (player.additionalSkills?.potyinhui?.includes(skill)) return true;
            return get.info(skill).ai?.neg;
          }) ? 1 : -1;
        },
        target: 1
      }
    }
  },
  potyinhui: {
    audio: 12,
    keepSkill: true,
    logAudio: (index) => typeof index == "number" ? `potyinhui${index}.mp3` : 2,
    trigger: { global: "roundStart" },
    filter(event, player) {
      return game.hasPlayer((target) => {
        if (target === player) return false;
        return target.getSkills(null, false, false).filter((skill) => {
          if (player.hasSkill(skill)) return false;
          const info = get.info(skill);
          const dizhuSkill = ["飞扬", "跋扈", "恃强", "殷富"];
          const t = lib.translate[skill];
          if (dizhuSkill.includes(t)) {
            return true;
          }
          return info && !info.charlotte;
        }).length > 0;
      });
    },
    //参考朱佩兰
    refreshSkill(player, skills2) {
      if (typeof skills2 === "string") skills2 = [skills2];
      Object.keys(player.storage).filter((i) => skills2.some((skill) => i.startsWith(skill))).forEach((storage) => delete player.storage[storage]);
      const suffixs = ["used", "round", "block", "blocker"];
      for (const skill of skills2) {
        const info = get.info(skill);
        if (info.usable !== void 0) {
          if (typeof player.getStat("triggerSkill")[skill] == "number" && player.getStat("triggerSkill")[skill] >= 1) {
            delete player.getStat("triggerSkill")[skill];
          }
          if (typeof player.getStat("skill")[skill] == "number" && player.getStat("skill")[skill] >= 1) {
            delete player.getStat("skill")[skill];
          }
        }
        if (info.round && player.storage[skill + "_roundcount"]) {
          delete player.storage[skill + "_roundcount"];
        }
        if (player.storage[`temp_ban_${skill}`]) {
          delete player.storage[`temp_ban_${skill}`];
        }
        if (player.awakenedSkills.includes(skill)) {
          player.restoreSkill(skill);
        }
        for (const suffix of suffixs) {
          if (player.hasSkill(skill + "_" + suffix)) {
            player.removeSkill(skill + "_" + suffix);
          }
        }
      }
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget(card, player2, target) {
          if (target === player2) return false;
          return target.getSkills(null, false, false).filter((skill) => {
            if (player2.hasSkill(skill)) return false;
            const info = get.info(skill);
            const dizhuSkill = ["飞扬", "跋扈", "恃强", "殷富"];
            const t = lib.translate[skill];
            if (dizhuSkill.includes(t)) {
              return true;
            }
            return info && !info.charlotte;
          }).length > 0;
        },
        ai(target) {
          const { player: player2, filterTarget } = get.event();
          const targets = game.filterPlayer((target2) => filterTarget(null, player2, target2));
          return Math.max(
            ...targets.map((target2) => {
              const skills2 = target2.getSkills(null, false, false).filter((skill) => {
                if (player2.hasSkill(skill)) return false;
                const info = get.info(skill);
                const dizhuSkill = ["飞扬", "跋扈", "恃强", "殷富"];
                const t = lib.translate[skill];
                if (dizhuSkill.includes(t)) {
                  return true;
                }
                return info && !info.charlotte;
              });
              return Math.max(...skills2.map((skill) => get.skillRank(skill)));
            })
          );
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      if (player.additionalSkills?.[event.name]?.length) {
        get.info("potyinhui").refreshSkill(player, player.additionalSkills[event.name]);
        await player.removeAdditionalSkills(event.name);
      }
      const skills2 = target.getSkills(null, false, false).removeArray(player.getSkills(null, false, false)).filter((skill) => {
        const info = get.info(skill);
        const dizhuSkill = ["飞扬", "跋扈", "恃强", "殷富"];
        const t = lib.translate[skill];
        if (dizhuSkill.includes(t)) {
          return true;
        }
        return info && !info.charlotte;
      });
      if (skills2.length) {
        const list = [];
        for (let skill of skills2) {
          if (skill == "bahu") skill = "jsrgbahu";
          if (skill == "feiyang") skill = "jsrgfeiyang";
          list.push([skill, `<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【` + get.translation(skill) + "】</div><div>" + lib.translate[skill + "_info"] + "</div></div>"]);
        }
        const result = skills2.length > 1 ? await player.chooseButton({
          createDialog: ["音洄：请获得一个技能", [list, "textbutton"]],
          forced: true,
          ai(button) {
            const info = get.info(button.link);
            if (!info || info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) {
              return 0;
            }
            return 1 + Math.random();
          }
        }).forResult() : { bool: true, links: skills2 };
        if (result?.bool && result.links?.length) {
          const skill = result.links[0];
          get.info("potyinhui").refreshSkill(player, skill);
          await player.addAdditionalSkills(event.name, skill, true);
          game.broadcastAll((skill2) => {
            const skills3 = [skill2];
            game.expandSkills(skills3);
            for (const i of skills3) {
              const info = get.info(i);
              if (!info) {
                continue;
              }
              if (!info.audioname2) {
                info.audioname2 = {};
              }
              info.audioname2.pot_xiaoqiao = "potyinhui_audio";
            }
          }, skill);
        }
      }
    },
    subSkill: {
      audio: {
        get audio() {
          const list = [];
          for (let i = 3; i <= 12; i++) {
            list.push(`potyinhui${i}.mp3`);
          }
          return list;
        }
      }
    }
  },
  //势周瑜
  potchiyun: {
    audio: 2,
    audioname2: {
      pot_zhouyu_shadow: "potchiyun_pot_zhouyu_shadow"
    },
    logAudio2: {
      pot_zhouyu_shadow: (event, player) => "potchiyun_pot_zhouyu_shadow" + (player.storage.potchiyun1 ? get.rand(3, 4) : get.rand(1, 2)) + ".mp3"
    },
    trigger: {
      player: "gainAfter",
      global: "loseAsyncAfter"
    },
    filter(event, player) {
      if (!player.countCards("h")) {
        return false;
      }
      if ((player.storage.potchiyun1 || player.storage.potchiyun2) && player != _status.currentPhase) {
        return false;
      }
      return event.getg?.(player)?.length && lib.phaseName.some((phase) => {
        return player.getHistory("gain", (evt) => evt.getParent(phase) === event.getParent(phase)).map((evt) => event.name == "gain" ? evt : evt.getParent()).indexOf(event) === 0;
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCardTarget({
        prompt: get.prompt(event.skill),
        prompt2: "炽沄：交给一名其他角色任意张手牌",
        filterCard: true,
        selectCard: [1, Infinity],
        filterTarget: lib.filter.notMe,
        position: "h",
        complexCard: true,
        ai1(card) {
          if (ui.selected.cards?.length) {
            return 0;
          }
          return 8 - get.value(card);
        },
        ai2(target) {
          const player2 = get.player();
          if (player2.storage.potchiyun1 && game.hasPlayer((current) => get.attitude(player2, current) > 0 && player2 != current)) {
            return get.attitude(player2, target);
          } else {
            return -get.attitude(player2, target);
          }
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        cards: cards2,
        targets: [target]
      } = event;
      const colors = cards2.map((card) => get.color(card)).unique();
      await player.give(cards2, target);
      const list = [], choiceList = ["展示所有" + get.translation(colors) + "手牌并受到来自" + get.translation(player) + "的1点火焰伤害", "令" + get.translation(player) + "摸两张牌，然后你进入连环状态"];
      if (target.hasCards("h", (card) => colors.includes(get.color(card))) && !player.storage[event.name + "1"]) {
        list.push("选项一");
      } else {
        choiceList[0] = `<span style="opacity:0.5">` + choiceList[0] + "</span>";
      }
      if (!player.storage[event.name + "2"]) {
        list.push("选项二");
      } else {
        choiceList[1] = `<span style="opacity:0.5">` + choiceList[1] + "</span>";
      }
      if (!list.length) {
        return;
      }
      const result = list.length > 1 ? await target.chooseControl(list).set("choiceList", choiceList).set("prompt", "请选择一项").set("ai", () => {
        const { player: player2, target: target2 } = get.event();
        if (get.damageEffect(player2, target2, target2, "fire") > 0) {
          return "选项一";
        }
        return "选项二";
      }).set("target", player).forResult() : { control: list[0] };
      if (typeof result?.control == "string") {
        if (result.control == "选项一") {
          await target.showCards(
            target.getCards("h", (card) => colors.includes(get.color(card))),
            `${get.translation(player)}发动了【${get.translation(event.name)}】`
          );
          await target.damage("fire");
        } else {
          target.line(player);
          await player.draw({ num: 2 });
          await target.link(true);
        }
      }
    },
    subSkill: {
      pot_zhouyu_shadow: { audio: 4 }
    }
  },
  potyanhui: {
    audio: 6,
    audioname: ["pot_zhouyu_shadow"],
    logAudio: (player, indexedData) => "potyanhui" + (lib.skill.potyanhui.audioname.includes(player.skin.name) ? "_pot_zhouyu_shadow" : "") + (indexedData ? indexedData : get.rand(1, 2)) + ".mp3",
    popup: false,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      if ((player.storage.potyanhui1 || player.storage.potyanhui2) && player != _status.currentPhase) {
        return false;
      }
      return event.targets?.some((target) => target.hasCards("h")) && event.isFirstTarget;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt(event.skill),
        prompt2: "焰洄：展示一名目标角色的一张手牌",
        filterTarget(card, player2, target) {
          return get.event().targets?.includes(target);
        },
        ai(target) {
          return -get.attitude(get.player(), target);
        }
      }).set(
        "targets",
        trigger.targets.filter((target) => target.hasCards("h"))
      ).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      if (!target.hasCards("h")) {
        return;
      }
      player.logSkill(event.name, [target], null, null, [player]);
      const result = await player.choosePlayerCard({
        forced: true,
        position: "h",
        prompt: `展示${get.translation(target)}的一张手牌`,
        target
      }).forResult();
      if (result?.bool && result.links?.length) {
        const cards2 = result.links;
        const shown = game.getGlobalHistory("everything", (evt) => {
          return evt.name == "showCards" && evt.cards?.length > 0;
        }).map((evt) => evt.cards).flat();
        await target.showCards(cards2, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
        if (shown.includes(cards2[0])) {
          await target.modedDiscard({ cards: cards2, discarder: player });
        }
      }
      if (!player.hasSkill(event.name + "_used")) {
        player.addTempSkill("potyanhui_used", "phaseAnyAfter");
        player.when({ global: "phaseAnyEnd" }).step(async (event2, trigger2, player2) => {
          const bool1 = game.hasPlayer((current) => {
            return current.hasHistory("lose", (evt) => evt.type == "discard" && evt.getParent(2).name == "potyanhui" && evt.getParent(trigger2.name) == event2.getParent(trigger2.name));
          }) && !player2.storage.potyanhui1, bool2 = game.hasPlayer2((current) => {
            return game.hasGlobalHistory("everything", (evt) => {
              return evt.name == "showCards" && evt.cards?.length > 0 && evt.player == current;
            });
          }) && !player2.storage.potyanhui2;
          if (!bool1 && !bool2) {
            return;
          }
          const num = game.countPlayer2((current) => {
            return game.hasGlobalHistory("everything", (evt) => {
              return evt.name == "showCards" && evt.cards?.length > 0 && evt.player == current;
            });
          });
          const targets = game.filterPlayer((current) => {
            return current.hasHistory("lose", (evt) => evt.type == "discard" && evt.getParent(2).name == "potyanhui" && evt.getParent(trigger2.name) == event2.getParent(trigger2.name));
          });
          const result2 = await player2.chooseButtonTarget({
            createDialog: [
              "焰洄：请选择一项",
              [
                [
                  ["damage", "对一名本阶段因此弃置过牌的角色造成1点火焰伤害（" + get.translation(targets) + ")"],
                  ["draw", "摸" + num + "张牌"]
                ],
                "textbutton"
              ]
            ],
            complexSelect: true,
            forced: true,
            filterButton(button) {
              const { player: player3, targets: targets2, num: num2 } = get.event();
              if (button.link == "damage") {
                return targets2.length > 0 && !player3.storage.potyanhui1;
              }
              return num2 > 0 && !player3.storage.potyanhui2;
            },
            filterTarget(card, player3, target2) {
              return get.event().targets?.includes(target2);
            },
            selectTarget() {
              if (ui.selected.buttons?.[0]?.link == "damage") {
                return 1;
              }
              return -1;
            },
            ai1(button) {
              const { player: player3, targets: targets2, num: num2 } = get.event();
              if (button.link == "draw") {
                if (player3.isPhaseUsing() && player3.needsToDiscard()) {
                  return 0;
                }
                return num2 * get.effect(player3, { name: "draw" }, player3, player3);
              }
              return Math.max(
                ...targets2.map((current) => {
                  return get.damageEffect(current, player3, player3, "fire");
                })
              );
            },
            ai2(target2) {
              const player3 = get.player();
              return get.damageEffect(target2, player3, player3, "fire");
            }
          }).set("num", num).set("targets", targets).forResult();
          if (result2?.bool && result2.links?.length) {
            const {
              links: [link],
              targets: [target2]
            } = result2;
            if (link == "damage") {
              if (target2?.isIn()) {
                player2.line(target2);
                player2.logSkill("potyanhui", [target2], null, null, [player2, get.rand(5, 6)]);
                await target2.damage("fire");
              }
            } else {
              player2.logSkill("potyanhui", null, null, null, [player2, get.rand(3, 4)]);
              await player2.draw({ num });
            }
          }
        });
      }
    },
    init(player, skill) {
      player.addSkill(skill + "_mark");
      game.countPlayer((current) => {
        const cards2 = current.getCards("h", (card) => {
          const shown = game.getGlobalHistory("everything", (evt) => {
            return evt.name == "showCards" && evt.cards?.length > 0;
          }).map((evt) => evt.cards).flat();
          return shown.includes(card);
        });
        if (cards2.length) {
          current.addGaintag(cards2, skill);
        }
      });
    },
    onremove(player, skill) {
      player.removeSkill(skill + "_mark");
      game.countPlayer((current) => current.removeGaintag(skill));
    },
    subSkill: {
      used: { charlotte: true },
      mark: {
        popup: false,
        forced: true,
        silent: true,
        charlotte: true,
        trigger: {
          global: ["showCardsAfter", "gainAfter", "loseAsyncAfter", "phaseAfter"]
        },
        filter(event, player) {
          return player == _status.currentPhase || !player.storage.potyanhui1 && !player.storage.potyanhui2;
        },
        getIndex(event, player) {
          if (event.name == "phase") {
            return game.filterPlayer();
          }
          if (event.name == "showCards") {
            return [event.player];
          }
          return game.filterPlayer((current) => {
            if (!event.getg?.(current)?.length) {
              return false;
            }
            return current.hasCards("h", (card) => {
              const shown = game.getGlobalHistory("everything", (evt) => {
                return evt.name == "showCards" && evt.cards?.length > 0;
              }).map((evt) => evt.cards).flat();
              return shown.includes(card);
            });
          });
        },
        async content(event, trigger, player) {
          const target = event.indexedData;
          if (trigger.name == "phase") {
            target.removeGaintag("potyanhui");
          } else if (trigger.name == "showCards") {
            const cards2 = trigger.cards;
            game.broadcastAll((cards3) => {
              cards3.forEach((card) => card.addGaintag("potyanhui"));
            }, cards2);
          } else {
            const cards2 = target.getCards("h", (card) => {
              const shown = game.getGlobalHistory("everything", (evt) => {
                return evt.name == "showCards" && evt.cards?.length > 0;
              }).map((evt) => evt.cards).flat();
              return shown.includes(card);
            });
            if (cards2.length) {
              target.addGaintag(cards2, "potyanhui");
            }
          }
        }
      }
    }
  },
  potfentao: {
    audio: 2,
    forced: true,
    audioname2: {
      pot_zhouyu_shadow: "potfentao_pot_zhouyu_shadow"
    },
    logAudio2: {
      pot_zhouyu_shadow: (event, player) => "potfentao_pot_zhouyu_shadow" + (player.storage.potfentao2 ? get.rand(3, 4) : get.rand(1, 2)) + ".mp3"
    },
    trigger: { global: "damageBegin4" },
    filter(event, player) {
      if ((player.storage.potfentao1 || player.storage.potfentao2) && player != _status.currentPhase) {
        return false;
      }
      return event.hasNature("fire") && event.player.isLinked() && player != event.player;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const target = event.targets[0], bool1 = player.storage[event.name + "1"], bool2 = player.storage[event.name + "2"];
      if (bool1 && bool2) {
        return;
      }
      if (target?.isIn()) {
        let result;
        if (bool2) {
          result = { bool: false };
        } else {
          const forced = bool1 ? true : false;
          if (bool1 && !target.hasDiscardableCards(target, "he")) {
            return;
          }
          result = target.hasDiscardableCards(target, "he") ? await target.chooseToDiscard({
            forced,
            prompt: `${get.translation(player)}对你发动了焚涛：请选择弃置一半牌` + (bool1 ? "" : "或点击“取消”令本次传导伤害+1"),
            position: "he",
            selectCard: Math.ceil(target.countCards("he") / 2),
            ai(card) {
              const { player: player2, num } = get.event();
              if (num + 1 >= player2.getHp() + player2.hujia) {
                return 114514 - get.value(card);
              }
              return 7 - get.value(card);
            }
          }).set("num", trigger.num).forResult() : { bool: false };
        }
        if (!result?.bool || !result.cards?.length) {
          if (trigger.notLink()) {
            trigger.num++;
            player.removeSkill(event.name + "_dam");
          } else {
            player.addTempSkill(event.name + "_dam");
            player.addMark(event.name + "_dam", 1, false);
            trigger.num += player.countMark(event.name + "_dam");
          }
        } else {
          target.when({ player: "damageAfter" }).filter((evt) => evt === trigger).step(async (event2, trigger2, player2) => {
            player.logSkill("potfentao", target, null, null, [event2, player]);
            await player2.link(true);
          });
        }
      }
    },
    subSkill: {
      dam: { charlotte: true, onremove: true },
      pot_zhouyu_shadow: { audio: 4 }
    }
  },
  potxiongzi: {
    audio: 4,
    logAudio(event, player, triggername, _, costResult) {
      if (costResult.cost_data == "保留选项二") {
        return ["potxiongzi3.mp3", "potxiongzi4.mp3"];
      }
      return 2;
    },
    trigger: { player: "phaseZhunbeiBegin" },
    limited: true,
    skillAnimation: true,
    animationColor: "fire",
    filter(event, player) {
      return ["potchiyun", "potyanhui", "potfentao"].some((skill) => player.hasSkill(skill, null, null, false));
    },
    async cost(event, trigger, player) {
      const result = await player.chooseControl({
        controls: ["保留选项一", "保留选项二", "cancel2"],
        prompt: get.prompt2(event.skill),
        ai() {
          return ["保留选项一", "保留选项二"].randomGet();
        }
      }).forResult();
      if (typeof result?.control == "string" && result.control != "cancel2") {
        event.result = {
          bool: true,
          cost_data: result.control
        };
      }
    },
    async content(event, trigger, player) {
      const { cost_data: link } = event;
      player.awakenSkill(event.name);
      player.changeSkin({ characterName: "pot_zhouyu" }, "pot_zhouyu_shadow");
      for (const skill of ["potchiyun", "potyanhui", "potfentao"]) {
        player.setStorage(skill + (link === "保留选项一" ? "2" : "1"), true, true);
      }
      await player.draw({ num: 2 });
    }
  },
  //势程普
  potduzuo: {
    audio: 2,
    trigger: {
      player: "gainAfter",
      global: "loseAsyncAfter"
    },
    filter(event, player) {
      return event.getg?.(player)?.length && event.getParent().name != "potduzuo";
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt(event.skill),
        prompt2: "选择一名角色令其获得一张火【杀】",
        ai(target) {
          return get.attitude(get.player(), target) * (114514 - target.countCards("h"));
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const card = get.cardPile((card2) => get.name(card2) == "sha" && get.nature(card2) == "fire");
      if (card) {
        await target.gain({ cards: [card], animate: "gain2" });
      } else {
        target.popup("没喽");
      }
    }
  },
  potbihan: {
    audio: 2,
    trigger: { global: "damageBegin3" },
    filter(event, player) {
      if (!event.card || event.card.name != "sha") {
        return false;
      }
      if (!event.player?.isIn()) {
        return false;
      }
      return [player, event.player].some((i) => i.countCards("h") > i.getHp());
    },
    async cost(event, trigger, player) {
      const target = trigger.player;
      event.result = await player.chooseTarget({
        prompt: get.prompt(event.skill, trigger.player),
        prompt2: "将你或其将手牌弃至当前体力并令此伤害-1",
        filterTarget(card, player2, target2) {
          const targetx = get.event().targetx;
          return [targetx, player2].includes(target2) && target2.countCards("h") > target2.getHp();
        },
        ai(target2) {
          const { player: player2, targetx } = get.event();
          if (get.attitude(player2, targetx) > 0 && [player2, targetx].some((i) => i.countCards("h") - i.getHp() <= 2)) {
            return get.attitude(player2, target2) * (114514 - target2.countCards("h"));
          } else {
            if (targetx.countCards("h") - targetx.getHp() >= 5) {
              return -get.attitude(player2, target2);
            }
          }
          return 0;
        }
      }).set("targetx", target).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const num = target.countCards("h") - target.getHp();
      if (target.hasDiscardableCards(target, "h")) {
        const { cards: cards2 } = await target.chooseToDiscard({ forced: true, position: "h", selectCard: num }).forResult();
        if (cards2?.length >= num) {
          trigger.num--;
        }
      }
    }
  },
  //势夏侯霸
  potlibing: {
    audio: 2,
    forced: true,
    trigger: { player: "useCardAfter" },
    mark: true,
    intro: {
      markcount(storage, player) {
        if (!storage) {
          return 1;
        }
        return 1 + storage;
      },
      content(storage, player) {
        const num = player.countMark("potlibing_attack");
        let str = "<li>攻击范围+" + num;
        str += "<li>使用非伤害牌结算后：<br>";
        if (!storage) {
          str += "攻击范围+1";
        } else if (typeof storage == "number" && storage == 1) {
          const num2 = 1 + player.countMark("potlibing_draw");
          str += "摸" + num2 + "张牌";
        } else if (typeof storage == "number" && storage == 2) {
          str += "使用下一张伤害牌伤害+1";
        }
        return str;
      }
    },
    filter(event, player) {
      return !get.is.damageCard(event.card) || player.storage.potlibing || player.hasMark("potlibing_attack") || player.hasMark("potlibing_draw");
    },
    onremove(player, skill) {
      player.removeSkill(skill + "_attack");
      player.removeSkill(skill + "_draw");
      delete player.storage[skill];
    },
    async content(event, trigger, player) {
      if (get.is.damageCard(trigger.card)) {
        get.info(event.name).onremove(player, event.name);
        game.log(player, "重置了技能", `#g${get.translation(event.name)}`);
      } else {
        if (!player.storage[event.name]) {
          player.addSkill(event.name + "_attack");
          player.addMark(event.name + "_attack", 1, false);
          player.setStorage(event.name, 1, true);
        } else if (typeof player.storage[event.name] == "number" && player.storage[event.name] == 1) {
          const num = 1 + player.countMark(event.name + "_draw");
          await player.draw({ num });
          player.addSkill(event.name + "_draw");
          player.addMark(event.name + "_draw", 1, false);
          player.setStorage(event.name, 2, true);
        } else {
          delete player.storage[event.name];
          player.addSkill(event.name + "_dam");
          player.addMark(event.name + "_dam", 1, false);
        }
      }
      player.markSkill(event.name);
    },
    subSkill: {
      draw: { charlotte: true, onremove: true },
      attack: {
        onremove: true,
        charlotte: true,
        mod: {
          attackRange(player, num) {
            return num + player.countMark("potlibing_attack");
          }
        }
      },
      dam: {
        charlotte: true,
        mark: true,
        intro: {
          content: "下一张伤害牌伤害+#"
        },
        forced: true,
        onremove: true,
        audio: "potlibing",
        trigger: { player: "useCard" },
        filter(event, player) {
          return get.is.damageCard(event.card) && player.hasMark("potlibing_dam");
        },
        async content(event, trigger, player) {
          if (typeof trigger.baseDamage != "number") {
            trigger.baseDamage = 1;
          }
          trigger.baseDamage += player.countMark(event.name);
          player.removeSkill(event.name);
        }
      }
    }
  },
  potpoxi: {
    audio: 2,
    locked: true,
    trigger: {
      player: "loseAfter",
      global: "loseAsyncAfter"
    },
    filter(event, player) {
      if (event.type != "discard") {
        return false;
      }
      const evt = event.getl?.(player);
      return evt?.cards2?.some((card) => card.name == "sha");
    },
    getIndex(event, player) {
      const evt = event.getl(player), cards2 = evt.cards2.filter((card) => card.name == "sha" && player.hasUseTarget(card, false, false));
      return cards2;
    },
    direct: true,
    async content(event, trigger, player) {
      const card = event.indexedData;
      if (player.hasUseTarget(card, false, false)) {
        await player.chooseUseTarget({
          card,
          forced: true,
          addCount: false,
          nodistance: true
        }).set("oncard", () => {
          const event2 = get.event();
          const targets = game.filterPlayer((current) => current.countCards("h") <= player.countCards("h"));
          event2.directHit.addArray(targets);
        }).set("logSkill", event.name);
      }
    }
  },
  //势陈群
  potfaen: {
    audio: 2,
    trigger: { global: "useCard" },
    filter(event, player) {
      const history = game.getAllGlobalHistory("useCard");
      const index = history.indexOf(event);
      if (!event.player?.isIn()) {
        return false;
      }
      if (index > 0) {
        return history[index - 1].player == player;
      }
      return false;
    },
    async cost(event, trigger, player) {
      const target = trigger.player;
      const list = [`令${get.translation(target)}摸一张牌`];
      if (target.countDiscardableCards(target, "he")) {
        list.push(`令${get.translation(target)}弃一张牌`);
      }
      list.push("cancel2");
      const result = await player.chooseControl({
        controls: list,
        prompt: "法恩：你可以选择一项",
        ai() {
          const { player: player2, target: target2, controls } = get.event();
          if (get.attitude(player2, target2) > 0) {
            controls.remove(controls[1]);
          }
          return controls.slice(0).remove("cancel2").randomGet();
        }
      }).set("target", target).forResult();
      if (typeof result?.control == "string" && result.control != "cancel2") {
        event.result = {
          bool: true,
          cost_data: result.control
        };
      }
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const {
        cost_data: link,
        targets: [target]
      } = event;
      if (link == `令${get.translation(target)}摸一张牌`) {
        await target.draw({ num: 1 });
      } else {
        if (target.countDiscardableCards(target, "he")) {
          await target.chooseToDiscard({ forced: true, position: "he" });
        }
      }
      player.addTempSkill(event.name + "_effect");
      player.markAuto(event.name + "_effect", [link == `令${get.translation(target)}摸一张牌` ? "discard" : "draw"]);
    },
    subSkill: {
      effect: {
        audio: "potfaen",
        charlotte: true,
        forced: true,
        onremove: true,
        firstDo: true,
        intro: {
          content(storage, player) {
            return "本回合下一张牌被使用时，使用者须" + (storage.includes("draw") ? "摸" : "") + (storage.includes("discard") ? "弃" : "") + "一张牌";
          }
        },
        trigger: { global: "useCard" },
        filter(event, player) {
          return player.getStorage("potfaen_effect").length && event.player?.isIn();
        },
        logTarget: "player",
        async content(event, trigger, player) {
          const {
            targets: [target]
          } = event;
          const storage = player.getStorage(event.name).slice();
          player.removeSkill(event.name);
          if (storage.includes("draw")) {
            await target.draw({ num: 1 });
          }
          if (storage.includes("discard") && target.countDiscardableCards(target, "he")) {
            await target.chooseToDiscard({ forced: true, position: "he" });
          }
        }
      }
    }
  },
  potdingpin: {
    audio: 2,
    round: 1,
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      return game.hasPlayer((current) => current.hasHistory("lose", (evt) => evt.cards2?.length));
    },
    async cost(event, trigger, player) {
      let maxLose = 0, targets = [];
      for (const target of game.filterPlayer()) {
        const lose = target.iterHistory("lose", (evt) => evt.cards2?.length).map((evt) => evt.cards2.length).reduce((sum, len) => sum + len, 0);
        if (lose > maxLose) {
          maxLose = lose;
          targets = [target];
        } else if (lose === maxLose) {
          targets.push(target);
        }
      }
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget(card, player2, target) {
          return get.event().targets.includes(target);
        },
        ai(target) {
          return get.attitude(get.player(), target) * (114514 - target.countCards("h"));
        }
      }).set("targets", targets).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      const next = target.phaseDraw();
      event.next.remove(next);
      trigger.next.push(next);
    }
  },
  //势曹真
  potsifeng: {
    audio: 6,
    logAudio: () => 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => current != player);
    },
    check(event, player) {
      return game.hasPlayer((current) => get.attitude(player, current) < 0);
    },
    async content(event, trigger, player) {
      const cards2 = get.cards(3, true);
      if (!cards2.length || !game.hasPlayer((current) => current != player)) {
        return;
      }
      await game.cardsGotoOrdering(cards2);
      while (cards2.length) {
        const result = await player.chooseButtonTarget({
          createDialog: [`伺锋：请选择要分配的“伺锋”牌和目标（先选择的牌在前面）`, cards2],
          forced: true,
          allowChooseAll: true,
          selectButton: [1, Infinity],
          filterTarget: lib.filter.notMe,
          ai1(button) {
            return 1 + Math.random();
          },
          ai2(target) {
            const player2 = get.player();
            return -get.attitude(player2, target);
          }
        }).forResult();
        if (result?.bool && result.targets?.length) {
          const {
            links,
            targets: [target]
          } = result;
          cards2.removeArray(links);
          player.line(target);
          await target.addToExpansion({ cards: links.reverse(), source: player, animate: "give", gaintag: [event.name] });
        }
      }
    },
    intro: {
      name: "伺锋",
      markcount: "expansion",
      mark(dialog, content, player) {
        const cards2 = player.getExpansions("potsifeng");
        if (cards2.length) {
          if (player.hasSkill("potsifeng", null, null, false)) {
            dialog.addAuto(cards2);
          } else {
            return "共有" + get.cnNumber(cards2.length) + "张“伺锋”";
          }
        }
      },
      content(content, player) {
        const cards2 = player.getExpansions("potsifeng");
        if (cards2.length) {
          if (player.hasSkill("potsifeng", null, null, false)) {
            return get.translation(cards2);
          }
          return "共有" + get.cnNumber(cards2.length) + "张“伺锋”";
        }
      }
    },
    group: ["potsifeng_use", "potsifeng_effect"],
    subSkill: {
      use: {
        audio: "potsifeng",
        logAudio: () => ["potsifeng3.mp3", "potsifeng4.mp3"],
        trigger: { global: "useCardAfter" },
        filter(event, player) {
          return event.player.hasExpansions("potsifeng") && event.player == _status.currentPhase;
        },
        forced: true,
        locked: false,
        logTarget: "player",
        async content(event, trigger, player) {
          const color = get.color(trigger.card);
          const {
            targets: [target]
          } = event;
          if (target.hasExpansions("potsifeng")) {
            const card = target.getExpansions("potsifeng")[0];
            await target.loseToDiscardpile({ cards: [card] });
            if (color != get.color(card) && target.hasDiscardableCards(target, "h")) {
              await target.chooseToDiscard({ forced: true, position: "h" });
            }
          }
        }
      },
      effect: {
        audio: "potsifeng",
        logAudio: () => ["potsifeng5.mp3", "potsifeng6.mp3"],
        trigger: { global: "phaseEnd" },
        filter(event, player) {
          return event.player.hasExpansions("potsifeng");
        },
        logTarget: "player",
        async cost(event, trigger, player) {
          const target = trigger.player;
          const list = [`对${get.translation(target)}造成1点伤害`, `获得${get.translation(target)}所有“伺锋”牌`];
          const result = await player.chooseControl({
            choiceList: list,
            prompt: "伺锋：请选择一项",
            ai() {
              const { player: player2, target: target2 } = get.event();
              const controls = get.event().controls.slice();
              const cards2 = target2.getExpansions("potsifeng");
              if (get.attitude(player2, target2) > 0) {
                return "选项一";
              } else {
                if (cards2.length >= 3) {
                  controls.remove("选项一");
                }
                return controls.randomGet();
              }
            }
          }).set("target", target).forResult();
          if (typeof result?.index == "number") {
            event.result = {
              bool: true,
              cost_data: result.index
            };
          }
        },
        async content(event, trigger, player) {
          const target = event.targets[0], cards2 = target.getExpansions("potsifeng");
          if (event.cost_data == 0) {
            if (cards2.length) {
              await target.loseToDiscardpile({ cards: cards2 });
            }
            await target.damage();
          } else {
            if (cards2.length) {
              await player.gain({ cards: cards2, animate: "give" });
            }
          }
        }
      }
    }
  },
  //势吕壹
  pothuilv: {
    audio: 2,
    trigger: { global: "phaseUseBegin" },
    filter(event, player) {
      if (player == event.player) {
        return false;
      }
      return ["red", "black"].some((color) => !player.getStorage("pothuilv_round").includes(color));
    },
    async cost(event, trigger, player) {
      const list = ["red", "black", "cancel2"].removeArray(player.getStorage(event.skill + "_round")), target = trigger.player;
      const result = await player.chooseControl({
        controls: list,
        prompt: get.prompt(event.skill, target),
        prompt2: "令其从牌堆中获得一张此颜色的牌",
        ai() {
          const { player: player2, controls, target: target2 } = get.event();
          if (get.attitude(player2, target2) > 0) {
            return "cancel2";
          }
          if (controls.includes("red")) {
            return "red";
          }
          return controls.slice(0).remove("cancel2").randomGet();
        }
      }).set("target", target).forResult();
      if (typeof result?.control == "string" && result.control != "cancel2") {
        event.result = {
          bool: true,
          cost_data: result.control
        };
      }
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const {
        cost_data: color,
        targets: [target]
      } = event;
      player.addTempSkill(event.name + "_round", "roundStart");
      player.markAuto(event.name + "_round", [color]);
      const card = get.cardPile2((card2) => get.color(card2) == color);
      if (card) {
        player.addTempSkill(event.name + "_effect", "phaseUseAfter");
        player.markAuto(event.name + "_effect", [card]);
        player.when({ global: "phaseUseEnd" }).filter((evt) => evt == trigger).then(async (event2, trigger2, player2) => {
          trigger2.pothuilv_check = true;
        });
        target.addTempSkill(event.name + "_mark", "phaseUseAfter");
        await target.gain({
          cards: [card],
          animate: "gain2",
          gaintag: ["pothuilv_mark"]
        });
        await target.showCards(card, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
      } else {
        player.chat("没牌喽");
      }
    },
    subSkill: {
      round: { charlotte: true, onremove: true },
      mark: {
        charlotte: true,
        onremove(player, skill) {
          player.removeGaintag(skill);
        }
      },
      effect: {
        audio: "pothuilv",
        charlotte: true,
        onremove: true,
        trigger: { global: "phaseUseEnd" },
        filter(event, player) {
          if (!event.pothuilv_check) {
            return false;
          }
          const bool1 = event.player.hasHistory("useCard", (evt) => evt.getParent("phaseUse") == event && evt.cards?.some((card) => player.getStorage("pothuilv_effect").includes(card)));
          const bool2 = player.getStorage("pothuilv_effect").some((card) => get.position(card) !== "d");
          return bool1 || bool2;
        },
        forced: true,
        logTarget: "player",
        async content(event, trigger, player) {
          const target = event.targets[0];
          const bool1 = target.hasHistory("useCard", (evt) => evt.getParent("phaseUse") == trigger && evt.cards?.some((card) => player.getStorage(event.name).includes(card)));
          const bool2 = player.getStorage(event.name).some((card) => get.position(card) !== "d");
          if (bool1) {
            await target.damage();
          }
          if (bool2) {
            await player.damage({ source: target, unreal: true });
            const cards2 = player.getStorage(event.name).filter((card) => get.position(card) !== "d");
            if (cards2.length && game.hasPlayer((current) => current != target)) {
              const result = await player.chooseTarget({
                prompt: `隳律：你可以将${get.translation(cards2)}交给另一名角色`,
                filterTarget(card, player2, target2) {
                  return target2 != get.event().target;
                },
                ai(target2) {
                  const player2 = get.player();
                  if (get.event().cards.some((card) => get.name(card) == "du")) {
                    return -get.attitude(player2, target2);
                  }
                  return get.attitude(player2, target2);
                }
              }).set("cards", cards2).set("target", target).forResult();
              if (result?.bool && result.targets?.length) {
                const target2 = result.targets[0];
                player.line(target2);
                await target2.gain({
                  cards: cards2,
                  animate: "gain2",
                  giver: player
                });
              }
            }
          }
        }
      }
    }
  },
  potsongyan: {
    audio: 2,
    trigger: { player: ["phaseZhunbeiBegin", "damageEnd"] },
    filter(event, player) {
      return player.hasUseTarget(get.autoViewAs({ name: "wuzhong", isCard: true }));
    },
    prompt2: "视为使用一张【无中生有】",
    frequent: true,
    async content(event, trigger, player) {
      game.filterPlayer().forEach((current) => current.addTempSkill(event.name + "_wuxie"));
      await player.chooseUseTarget(get.autoViewAs({ name: "wuzhong", isCard: true }), true);
      game.filterPlayer().forEach((current) => current.removeSkill(event.name + "_wuxie"));
    },
    getColors(player) {
      const colors = player.getRoundHistory("lose", (evt) => evt.type == "discard").flatMap((evt) => evt.cards).map((card) => get.color(card)).unique();
      return colors;
    },
    subSkill: {
      wuxie: {
        charlotte: true,
        onChooseToUse(event) {
          if (!game.online && !event.potsongyan) {
            const player = event.player;
            event.set("potsongyan", get.info("potsongyan").getColors(player));
          }
        },
        enable: "chooseToUse",
        filter(event, player) {
          if (event.type != "wuxie") {
            return false;
          }
          return player.hasCards("hes", (card) => (event.potsongyan || []).includes(get.color(card)));
        },
        position: "hes",
        filterCard(card, player) {
          return get.event().potsongyan?.includes(get.color(card));
        },
        viewAs: { name: "wuxie" },
        prompt: "将一张牌当做【无懈可击】使用",
        check(card) {
          return 8 - get.value(card);
        }
      }
    }
  },
  potshishi: {
    getRespondEvts(event, player) {
      let respondEvts = [];
      for (const current of game.filterPlayer2((current2) => current2 != player, null, true)) {
        respondEvts.addArray(current.getAllHistory("useCard", (evt) => evt.respondTo?.[0] === player, event));
        respondEvts.addArray(current.getAllHistory("respond", (evt) => evt.respondTo?.[0] === player, event));
      }
      return respondEvts;
    },
    init(player, skill) {
      player.addSkill(skill + "_mark");
    },
    onremove(player, skill) {
      delete player.storage[skill];
      player.removeSkill(skill + "_mark");
    },
    intro: { content: "$不能响应你使用的牌，直到你使用牌被其他角色响应" },
    audio: 2,
    trigger: { player: "useCard" },
    filter(event, player) {
      const respondEvts = get.info("potshishi").getRespondEvts(null, player);
      if (player.hasAllHistory("useCard", (evt) => {
        return respondEvts.some((evtx) => evtx.respondTo[1] == evt.card);
      })) {
        return false;
      }
      return get.info("potshishi").logTarget(event, player).length > 0;
    },
    forced: true,
    logTarget(event, player) {
      return player.getAllHistory("damage", (evt) => evt.source?.isIn()).map((evt) => evt.source).toUniqued().sortBySeat();
    },
    async content(event, trigger, player) {
      trigger.directHit.addArray(event.targets);
      game.log(event.targets, "不可响应", trigger.card);
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (player.getStorage("potshishi").includes(arg?.target)) {
          return true;
        }
      }
    },
    subSkill: {
      mark: {
        charlotte: true,
        trigger: {
          player: "damage",
          global: ["useCard", "respond"]
        },
        filter(event, player) {
          const respondEvts = get.info("potshishi").getRespondEvts(event.name == "damage" ? null : event, player);
          if (event.name == "damage") {
            if (get.itemtype(event.source) !== "player" || player.getStorage("potshishi").includes(event.source)) {
              return false;
            }
            return !player.hasAllHistory("useCard", (evt) => {
              return respondEvts.some((evtx) => evtx.respondTo[1] == evt.card);
            });
          }
          if (!player.getStorage("potshishi").length) {
            return false;
          }
          if (!Array.isArray(event.respondTo)) {
            return false;
          }
          if (player == event.player || event.respondTo[0] !== player) {
            return false;
          }
          return respondEvts.indexOf(event) == 0;
        },
        silent: true,
        firstDo: true,
        async content(event, trigger, player) {
          if (trigger.name == "damage") {
            player.markAuto("potshishi", [trigger.source]);
          } else {
            player.setStorage("potshishi", [], true);
          }
        }
      }
    }
  },
  //势曹爽
  potdianyi: {
    audio: 2,
    trigger: {
      player: "damageEnd",
      source: "damageSource",
      global: "dying"
    },
    filter(event, player, name) {
      const { triggers, triggered } = player.getStorage("potdianyi", { triggers: [], triggered: [] });
      if (!triggers.includes(name)) {
        return false;
      }
      if (event.name === "damage" && event.num < 1) {
        return false;
      }
      return !triggered.includes(name);
    },
    forced: true,
    async content(event, trigger, player) {
      const name = event.triggername;
      const storage = player.getStorage(event.name, { triggers: [], triggered: [] });
      storage.triggered.push(name);
      player.setStorage(event.name, storage);
      const num = player.getRoundHistory("useSkill", (evt) => evt.skill == event.name).length;
      const shequanCards = game.filterPlayer((current) => current != player).flatMap((cur) => cur.getCards("hej", (card) => card.hasGaintag("eternal_potshequan")));
      Array.from(ui.cardPile.childNodes).forEach((c) => {
        if (c.hasGaintag("eternal_potshequan")) {
          shequanCards.push(c);
        }
      });
      Array.from(ui.discardPile.childNodes).forEach((c) => {
        if (c.hasGaintag("eternal_potshequan")) {
          shequanCards.push(c);
        }
      });
      if (!shequanCards.length) {
        return;
      }
      const gain = shequanCards.randomGets(num);
      if (gain.length) {
        await game.loseAsync({
          cards: gain,
          gain_list: [[player, gain]]
        }).setContent(async (event2) => {
          event2.type = "gain";
          const { cards: cards2, gain_list } = event2;
          const position = [];
          const [[player2]] = gain_list;
          for (const card of cards2) {
            position.push(get.position(card, "judge"));
          }
          for (const index in position) {
            const card = cards2[index];
            const pos = position[index];
            if ("hesx".includes(pos)) {
              const owner = get.owner(card);
              owner?.$giveAuto([card], player2);
            } else {
              player2.$gain2([card], true);
            }
          }
          await game.delay(0, get.delayx(500, 500));
          await player2.gain({ cards: cards2 }).set("getlx", false);
          await game.delayx();
        });
      }
      const gained = player.getRoundHistory("gain", (evt) => evt.getParent(2)?.name === event.name).flatMap((evt) => evt.cards).length;
      if (gained > player.maxHp) {
        await player.loseHp(1);
      }
    },
    group: ["potdianyi_clear"],
    subSkill: {
      clear: {
        charlotte: true,
        trigger: {
          global: "roundStart"
        },
        firstDo: true,
        silent: true,
        async content(event, trigger, player) {
          const storage = player.getStorage("potdianyi", { triggers: [], triggered: [] });
          storage.triggered = [];
          player.setStorage("potdianyi", storage, true);
        }
      }
    },
    ai: {
      threaten: 1.3
    }
  },
  potshequan: {
    audio: 2,
    trigger: {
      player: "damageEnd",
      source: "damageSource",
      global: "dying"
    },
    filter(event, player, name) {
      const { triggers, triggered } = player.getStorage("potshequan", { triggers: [], triggered: [] });
      if (!triggers.includes(name)) {
        return false;
      }
      if (event.name === "damage" && event.num < 1) {
        return false;
      }
      return !triggered.includes(name);
    },
    forced: true,
    logTarget(event, player) {
      return game.filterPlayer((cur) => cur != player && cur.isIn()).sortBySeat(player);
    },
    async content(event, trigger, player) {
      const name = event.triggername;
      const storage = player.getStorage(event.name, { triggers: [], triggered: [] });
      storage.triggered.push(name);
      player.setStorage(event.name, storage);
      const targets = game.filterPlayer((current) => current != player && current.isIn() && current.hasCards("h", (c) => !c.hasGaintag("eternal_potshequan")));
      if (!targets.length) {
        return;
      }
      const map = await game.chooseAnyOL(targets, get.info(event.name).chooseCard, []).forResult();
      for (const target of targets) {
        const result = map.get(target);
        if (result?.bool && result.cards?.length) {
          target.addGaintag(result.cards, "eternal_potshequan");
        }
      }
    },
    chooseCard(player, eventId) {
      return player.chooseCard({
        prompt: "奢权：选择一张手牌标记为“奢权”",
        forced: true,
        position: "h",
        selectCard: 1,
        filterCard(card) {
          return !card.hasGaintag("eternal_potshequan");
        }
      }).set("ai", (card) => {
        return -get.value(card);
      }).set("id", eventId).set("_global_waiting", true);
    },
    group: ["potshequan_clear"],
    subSkill: {
      clear: {
        charlotte: true,
        trigger: {
          global: "roundStart"
        },
        firstDo: true,
        silent: true,
        async content(event, trigger, player) {
          const storage = player.getStorage("potshequan", { triggers: [], triggered: [] });
          storage.triggered = [];
          player.setStorage("potshequan", storage, true);
        }
      }
    },
    ai: {
      threaten: 1.2
    }
  },
  potjianzhuan: {
    mark: true,
    marktext: "专",
    intro: {
      name: "渐专",
      mark(dialog, storage, player) {
        const { triggers: potdianyi } = player.getStorage("potdianyi", { triggers: [] });
        const { triggers: potshequan } = player.getStorage("potshequan", { triggers: [] });
        const map = {
          damageSource: "造成伤害后",
          damageEnd: "受到伤害后",
          dying: "一名角色进入濒死状态时"
        };
        if (!potdianyi.length && !potshequan.length) {
          dialog.addText("尚未触发任何时机");
        }
        if (potdianyi.length > 0) {
          dialog.addText(`典易已添加：${potdianyi.map((t) => map[t]).join("、")}`);
        }
        if (potshequan.length > 0) {
          dialog.addText(`奢权已添加：${potshequan.map((t) => map[t]).join("、")}`);
        }
      }
    },
    derivation: ["potnizun"],
    audio: 2,
    trigger: {
      player: "damageEnd",
      source: "damageSource",
      global: "dying"
    },
    filter(event, player, name) {
      if (!player.hasSkill("potdianyi", null, false, false) && !player.hasSkill("potshequan", null, false, false)) {
        return false;
      }
      if (event.name === "damage" && event.num < 1) {
        return false;
      }
      const { triggers: potdianyi } = player.getStorage("potdianyi", { triggers: [] });
      const { triggers: potshequan } = player.getStorage("potshequan", { triggers: [] });
      const alltriggers = potdianyi.concat(potshequan);
      if (alltriggers.length === 3) {
        return true;
      }
      return !alltriggers.includes(name);
    },
    forced: true,
    popup: false,
    async content(event, trigger, player) {
      const name = event.triggername;
      const map = {
        damageSource: "造成伤害后",
        damageEnd: "受到伤害后",
        dying: "一名角色进入濒死状态时"
      };
      const choices = ["potdianyi", "potshequan"].filter((skill) => player.hasSkill(skill, null, false, false)).map((skill) => get.translation(skill));
      const { triggers: potdianyi } = player.getStorage("potdianyi", { triggers: [] });
      const { triggers: potshequan } = player.getStorage("potshequan", { triggers: [] });
      if (potdianyi.concat(potshequan).length == 3) {
        player.logSkill(`${event.name}_animate`);
        player.awakenSkill(event.name);
        const result = await player.chooseControl({
          controls: choices,
          prompt: "渐专：选择失去一个技能",
          ai() {
            return 0;
          }
        }).forResult();
        const skillToRemove = result?.index == 0 ? "potdianyi" : "potshequan";
        const x = player.getStorage(skillToRemove, { triggers: [] }).triggers.length - 1;
        await player.changeSkills(["potnizun"], [skillToRemove]);
        await player.gainMaxHp({ num: x });
        await player.recover({ num: x });
      } else {
        player.logSkill(event.name);
        const result = await player.chooseControl({
          controls: choices,
          prompt: `渐专：首次${map[name]}，选择为哪个技能添加触发时机`,
          ai(event2) {
            if (get.event().controls.length == 1) {
              return 0;
            }
            return event2.triggername == "dying" ? 0 : 1;
          }
        }).forResult();
        const skillToAdd = result?.index == 0 ? "potdianyi" : "potshequan";
        const storage = player.getStorage(skillToAdd, { triggers: [], triggered: [] });
        storage.triggers.push(name);
        player.setStorage(skillToAdd, storage, true);
        game.log(player, "的", `#g【${get.translation(skillToAdd)}】`, "增加触发时机", `#y${map[name]}`);
        player.markSkill("potjianzhuan");
      }
    },
    global: ["potjianzhuan_mod"],
    subSkill: {
      animate: {
        skillAnimation: true,
        animationColor: "water"
      },
      mod: {
        mod: {
          cardnumber(card, owner) {
            if (card.hasGaintag?.("eternal_potshequan") && get.position(card) === "h") {
              if (owner && get.itemtype(owner) == "player") {
                return owner.hasSkill("potjianzhuan") ? 13 : 1;
              }
            }
          }
        }
      }
    },
    ai: {
      combo: ["potdianyi", "potshequan"],
      threaten: 1.5
    }
  },
  potnizun: {
    onremove(player, skill) {
      const cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile({ cards: cards2 });
      }
    },
    mark: true,
    marktext: "奢",
    intro: {
      markcount: "expansion",
      mark(dialog, storage, player) {
        const usedCount = player.countRoundHistory("useCard", (evt) => evt.skill == "potnizun_backup");
        if (usedCount > 0) {
          dialog.addText(`本轮受到的伤害+${usedCount}`);
        }
        const cards2 = player.getExpansions("potnizun");
        if (cards2.length > 0) {
          dialog.addSmall(cards2);
        } else {
          dialog.addText("武将牌上无”奢权“牌");
        }
      }
    },
    audio: 2,
    enable: ["chooseToUse"],
    usable: 1,
    hiddenCard(player, name) {
      const cards2 = player.getExpansions("potnizun");
      return cards2.some((card) => card.name === name);
    },
    filter(event, player) {
      const cards2 = player.getExpansions("potnizun");
      if (cards2.length === 0) {
        return false;
      }
      return cards2.some((card) => event.filterCard(card, player, event));
    },
    chooseButton: {
      dialog(event, player) {
        const cards2 = player.getExpansions("potnizun");
        const dialog = ui.create.dialog("溺尊：选择要使用的”奢权“牌", cards2);
        return dialog;
      },
      filter(button, player) {
        const card = button.link;
        const evt = get.event().getParent();
        return evt?.filterCard?.(card, player, evt) ?? false;
      },
      check(button) {
        const player = get.player();
        const card = button.link;
        return player.getUseValue(card) + 0.1;
      },
      backup(links, player) {
        const card = links[0];
        return {
          audio: "potnizun",
          card,
          viewAs: get.autoViewAs(card, [card]),
          selectCard: -1,
          filterCard() {
            return false;
          },
          async precontent(event, _, player2) {
            const card2 = lib.skill.potnizun_backup.card;
            event.result.cards = [card2];
            event.result.card = get.autoViewAs(card2, [card2]);
          },
          popname: true
        };
      },
      prompt(links, player) {
        const card = links[0];
        return `选择${get.translation(card.name)}的目标`;
      }
    },
    group: ["potnizun_damage", "potnizun_phaseEnd"],
    subSkill: {
      damage: {
        audio: "potnizun",
        trigger: {
          player: "damageBegin3"
        },
        filter(event, player) {
          return player.hasRoundHistory("useCard", (evt) => evt.skill == "potnizun_backup");
        },
        forced: true,
        async content(event, trigger, player) {
          const usedCount = player.countRoundHistory("useCard", (evt) => evt.skill == "potnizun_backup");
          trigger.num += usedCount;
        }
      },
      phaseEnd: {
        trigger: {
          global: "phaseEnd"
        },
        filter(event, player) {
          if (!player.hasHistory("useCard")) {
            return false;
          }
          const discarded = get.discarded().filter((card) => card.hasGaintag("eternal_potshequan"));
          return discarded.filterInD("d").length > 0;
        },
        forced: true,
        async content(event, trigger, player) {
          const discarded = get.discarded().filter((card) => card.hasGaintag("eternal_potshequan"));
          const shequanCards = discarded.filterInD("d");
          if (shequanCards.length > 0) {
            await player.addToExpansion({
              cards: shequanCards,
              animate: "gain2",
              gaintag: ["potnizun"]
            });
          }
        }
      }
    },
    ai: {
      threaten: 2,
      order: 10,
      result: {
        player(player) {
          if (_status.event.dying) {
            return get.attitude(player, _status.event.dying);
          }
          return 1;
        }
      },
      respondSha: true,
      respondShan: true,
      save: true,
      skillTagFilter(player, tag, arg) {
        const cards2 = player.getExpansions("potnizun");
        return cards2.some((card) => get.tag(card, tag));
      }
    }
  },
  //势张任
  potfuan: {
    audio: 2,
    onremove(player, skill) {
      delete player.storage[skill];
      player.removeTip(skill);
    },
    trigger: {
      player: "phaseJieshuBegin"
    },
    check: (event, player) => player.hasSkill("potyinxian"),
    filter(event, player) {
      return player.getAttackRange() > 0;
    },
    prompt2: `结束阶段，你可以将你基础的攻击范围调整至0，并失去因${get.poptip("potyinxian")}增加的攻击范围，若如此做，你摸因此减少的攻击范围张牌（至多摸5张），然后选择一个手牌中的花色并记录（每轮每个花色限一次）。`,
    async content(event, trigger, player) {
      const prevRange = player.getAttackRange();
      player.addSkill(event.name + "_range");
      player.clearMark("potyinxian_range", false);
      const currRange = player.getAttackRange();
      const num = Math.min(prevRange - currRange, 5);
      if (num > 0) {
        await player.draw(num);
      }
      const used = player.getStorage(event.name + "_used");
      const storage = player.getStorage(event.name);
      const suits = player.getCards("h").map((card) => get.suit(card)).unique().filter((i) => !storage.includes(i) && !used.includes(i));
      if (suits.length) {
        const result = await player.chooseControl({
          prompt: "伏暗：请选择要记录的花色",
          controls: suits,
          choice: get.rand(0, suits.length - 1)
        }).forResult();
        if (result.control) {
          const suit = result.control;
          player.addTempSkill(event.name + "_used", "roundStart");
          player.markAuto(event.name + "_used", suit);
          player.markAuto(event.name, suit);
          player.addTip(
            event.name,
            `${get.translation(event.name)} ${player.getStorage(event.name).map((i) => get.translation(i)).join("")}`
          );
        }
      }
    },
    intro: {
      content: "已记录花色：$"
    },
    group: "potfuan_sha",
    subSkill: {
      sha: {
        trigger: {
          global: "phaseEnd"
        },
        filter(event, player) {
          if (_status.currentPhase == player) {
            return false;
          }
          const storage = player.getStorage("potfuan");
          return get.discarded().some((i) => storage.includes(get.suit(i))) && player.hasUseTarget(get.autoViewAs({ name: "sha", isCard: true }), false, false);
        },
        async cost(event, trigger, player) {
          const storage = player.getStorage("potfuan");
          const suits = get.discarded().map((card) => get.suit(card)).unique().filter((i) => storage.includes(i));
          event.result = await player.chooseTarget({
            prompt: get.prompt(event.skill),
            prompt2: `移除${get.translation(suits)}，然后对一名角色视为使用一张无距离限制的【杀】。若如此做，当此牌造成伤害结算完毕后，你可以选择一项：1.再发动一次〖伏暗②〗，以此法发动后不能再次选择；2.令其技能失效直至其下个回合结束。`,
            filterTarget(card, player2, target) {
              return player2.canUse(card, target, false, false);
            },
            ai(target) {
              return get.effect(target, get.card(), get.player(), get.player());
            }
          }).set("_get_card", get.autoViewAs({ name: "sha", isCard: true })).forResult();
        },
        async content(event, trigger, player) {
          const {
            targets: [target]
          } = event;
          const name = "potfuan";
          const storage = player.getStorage(name);
          const suits = get.discarded().map((card2) => get.suit(card2)).unique().filter((i) => storage.includes(i));
          player.unmarkAuto(name, suits);
          if (!storage.length) {
            player.removeTip(name);
          } else {
            player.addTip(
              name,
              `${get.translation(name)} ${player.getStorage(name).map((i) => get.translation(i)).join("")}`
            );
          }
          const card = get.autoViewAs({ name: "sha", isCard: true });
          const next = player.useCard({
            card,
            targets: [target],
            addCount: false
          });
          await next;
          if (game.hasPlayer2((target2) => target2.hasHistory("damage", (evt) => evt.card == next.card), true)) {
            let result;
            if (player.storage.potfuan_only) {
              result = { index: 1 };
            } else {
              result = await player.chooseControl({
                choiceList: [`再发动一次〖伏暗②〗，以此法发动后不能再次选择`, `令${get.translation(target)}技能失效直至其下个回合结束`],
                choice: 0
              }).forResult();
            }
            if (typeof result.index == "number") {
              if (result.index == 0) {
                player.setStorage("potfuan_only", true);
                player.logSkill(event.name, target);
                await player.useCard({
                  card,
                  targets: [target],
                  addCount: false
                });
              } else {
                target.addTempSkill("baiban", { player: "phaseAfter" });
              }
            }
          }
        }
      },
      used: {
        charlotte: true,
        onremove: true
      },
      range: {
        charlotte: true,
        mod: {
          attackRangeBase(player, num) {
            return 0;
          }
        }
      }
    }
  },
  potyinxian: {
    audio: 2,
    trigger: {
      player: ["useCard", "useCardAfter"]
    },
    filter(event, player, name) {
      if (name == "useCard") {
        return event.card.name == "sha" && event.targets?.some((target) => {
          const distance = get.distance(player, target);
          return player.inRange(target) && !game.hasPlayer((current) => current != target && player.inRange(current) && get.distance(player, current) > distance);
        });
      }
      return _status.currentPhase != player;
    },
    forced: true,
    async content(event, trigger, player) {
      if (event.triggername == "useCard") {
        trigger.baseDamage++;
        game.log(trigger.card, "的基础伤害+1");
      } else {
        player.addSkill(event.name + "_range");
        player.addMark(event.name + "_range", 1, false);
      }
    },
    subSkill: {
      range: {
        charlotte: true,
        onremove: true,
        markimage: "image/card/attackRange.png",
        intro: {
          content: "攻击范围+#"
        },
        mod: {
          attackRange(player, num) {
            return num + player.countMark("potyinxian_range");
          }
        }
      }
    }
  },
  //势孙綝
  potnigu: {
    audio: 4,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hasDiscardableCards(player, "he");
    },
    complexCard: true,
    filterCard(card, player) {
      if (ui.selected.cards?.some((cardx) => get.suit(cardx) == get.suit(card))) {
        return false;
      }
      return lib.filter.cardDiscardable(card, player);
    },
    position: "he",
    check(card) {
      return 6 - get.value(card);
    },
    selectCard: [1, Infinity],
    async content(event, trigger, player) {
      const targets = game.filterPlayer((target) => player.inRange(target));
      player.line(targets);
      const resultMap = await game.chooseAnyOL(targets, get.info(event.name).chooseToGive, [player]).forResult();
      let count = 0;
      for (const target of targets.sortBySeat()) {
        const result = resultMap.get(target);
        if (result?.bool) {
          await target.give(result.cards, player);
        } else {
          count++;
        }
      }
      if (count > 0) {
        player.addMark(event.name + "_damage", count, false);
        player.addTempSkill(event.name + "_damage");
      }
    },
    /**
     *
     * @param {Player} player
     * @param {Player} source
     * @param {string} eventId
     * @returns {GameEvent}
     */
    chooseToGive(player, source, eventId) {
      const next = player.chooseCard({
        prompt: `逆固：是否交给${get.translation(source)}一张牌`,
        position: "he",
        ai(card) {
          const { sourcex, player: player2 } = get.event();
          return get.attitude(player2, sourcex) > 0 ? sourcex.getUseValue(card) : 6 - get.value(card);
        }
      });
      next.set("sourcex", source);
      next.set("id", eventId);
      next.set("_global_waiting", true);
      return next;
    },
    subSkill: {
      damage: {
        audio: "potnigu",
        onremove: true,
        charlotte: true,
        forced: true,
        trigger: {
          source: "damageBegin1"
        },
        filter(event, player) {
          return player.hasMark("potnigu_damage");
        },
        logTarget: "player",
        async content(event, trigger, player) {
          player.removeMark(event.name, 1, false);
          trigger.num++;
          if (!player.hasMark(event.name)) {
            player.removeSkill(event.name);
          }
        },
        intro: {
          content: "本回合下#次伤害+1"
        }
      }
    },
    ai: {
      order: 7,
      result: {
        player: 1
      }
    }
  },
  potlulian: {
    audio: 4,
    trigger: {
      player: "useCardAfter"
    },
    forced: true,
    filter(event, player) {
      const type = get.type2(event.card);
      return player.hasHistory("lose", (evt) => (evt.relatedEvent || evt.getParent()) == event && evt.hs?.length) && !player.hasCards("h", (card) => get.type2(card) == type) && event.targets?.some((target) => {
        return target.getHp() <= player.getHp() || target.countCards("e") <= player.countCards("e");
      });
    },
    async content(event, trigger, player) {
      const { targets } = trigger;
      let bool1 = false, bool2 = false;
      for (const target of targets) {
        if (!bool1 && target.getHp() <= player.getHp()) {
          bool1 = true;
        }
        if (!bool2 && target.countCards("e") <= player.countCards("e")) {
          bool2 = true;
        }
      }
      if (bool1) {
        await game.doAsyncInOrder(targets, async (target) => target.link(true));
      }
      if (bool2) {
        await player.draw();
      }
      if (bool1 && bool2) {
        const selectableTargets = game.filterPlayer((target) => !target.isMinHp());
        if (selectableTargets.length) {
          let result;
          if (selectableTargets.length == 1) {
            result = { targets: selectableTargets };
          } else {
            result = await player.chooseTarget({
              prompt: "戮连：对一名体力值不为最小的角色造成1点火焰伤害",
              forced: true,
              filterTarget(card, player2, target) {
                return get.event().targets.includes(target);
              },
              ai(target) {
                return get.damageEffect(target, get.player(), get.player(), "fire");
              }
            }).set("targets", selectableTargets).forResult();
          }
          if (result?.targets?.length) {
            const {
              targets: [target]
            } = result;
            player.line(target, "fire");
            await target.damage({ num: 1, nature: "fire" });
          }
        }
      }
    }
  },
  //势邓艾·重做
  pottuntian: {
    audio: 2,
    chargeSkill: 0,
    locked: false,
    forced: true,
    group: ["pottuntian_phaseUse"],
    trigger: {
      player: "loseAfter",
      global: ["loseAsyncAfter", "gainAfter", "addToExpansionAfter", "addJudgeAfter", "equipAfter", "phaseBegin"]
    },
    filter(event, player) {
      if (event.name == "phase") {
        return !player.countCharge(true);
      }
      if (!event.getl?.(player)?.cards2.some((card) => !get.is.damageCard(card)) || !player.countCharge(true)) {
        return false;
      }
      const evt2 = event.relatedEvent || event.getParent();
      if (evt2.name === "useCard" && evt2.player === player && get.type(evt2.card, null, false) === "equip") {
        return false;
      }
      return true;
    },
    async content(event, trigger, player) {
      if (trigger.name == "phase") {
        await player.draw();
        game.log(player, "的蓄力值上限+1");
        player.addMark(event.name, 1, false);
        player.markSkill("charge");
      } else {
        player.addCharge(1);
      }
    },
    mod: {
      maxCharge(player, num) {
        return num + player.countMark("pottuntian");
      }
    },
    subSkill: {
      phaseUse: {
        audio: "pottuntian",
        enable: "phaseUse",
        filter(event, player) {
          return player.countCharge() > 0;
        },
        usable: 1,
        async precontent(event, trigger, player) {
          const skill = event.name.slice(4);
          const result = await player.chooseNumbers(`###${get.translation(skill)}###出牌阶段限一次，你可以消耗任意点蓄力值，令至多等量名角色从牌堆或弃牌堆中各获得一张红桃牌`, [{ prompt: "请选择要移去的蓄力值", min: 1, max: player.countCharge() }]).set("processAI", () => {
            const player2 = get.player();
            const num = Math.min(player2.countCharge(), 7);
            return [num];
          }).forResult();
          if (result?.bool && result.numbers?.length) {
            event.result = {
              bool: true
            };
            event.getParent().set(skill, result.numbers[0]);
          } else {
            event.getParent().goto(0);
          }
        },
        async content(event, trigger, player) {
          const { [event.name]: num } = event.getParent(2);
          if (!num) {
            return;
          }
          player.removeCharge(num);
          const result = await player.chooseTarget(`屯田：令至多${num}名角色各获得一张红桃牌`, [1, num], true).set("ai", (target) => get.attitude(get.player(), target) > 0).forResult();
          const { targets } = result;
          if (!targets?.length) {
            return;
          }
          player.line(targets);
          await game.doAsyncInOrder(targets, async (target) => {
            const card = get.cardPile((card2) => get.suit(card2) == "heart");
            if (card) {
              return target.gain(card, "gain2");
            } else if (target != player) {
              target.throwEmotion(player, "egg");
              target.chat("我的免费鸡蛋呢");
            }
          });
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
  potzaoxian: {
    audio: 2,
    forced: true,
    trigger: { player: "removeMark" },
    filter(event, player) {
      return event.markName == "charge" && event.num >= 2;
    },
    async content(event, trigger, player) {
      const { num } = trigger;
      const list = ["wuzhong", "wuxie", "wugu"];
      const numList = [2, 5, 7], cards2 = [];
      for (let i = 0; i < numList.length; i++) {
        if (num >= numList[i]) {
          const card = get.discardPile((card2) => get.name(card2) == list[i]);
          if (card) {
            cards2.push(card);
          } else {
            player.chat(`没有${get.translation(list[i])}!`);
          }
        }
      }
      if (cards2.length) {
        await player.gain(cards2, "gain2");
      }
    }
  },
  potjixi: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      return get.info("potjixi").getTargets(player).length && _status.currentPhase?.countDiscardableCards(player, "he") > 0;
    },
    getTargets(player) {
      return player.getHistory("useCard").flatMap((evt) => evt.targets || []).unique().remove(player);
    },
    logTarget: () => _status.currentPhase,
    check(event, player) {
      return get.info("potjixi").getTargets(player).some((target) => get.effect(target, { name: "shunshou" }, player, player) > 0);
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      await player.discardPlayerCard({ target, position: "he", forced: true });
      const card = get.autoViewAs({ name: "shunshou", isCard: true });
      const targets = get.info(event.name).getTargets(player).filter((target2) => player.canUse(card, target2, false));
      if (targets.length) {
        await player.chooseUseTarget({
          card,
          prompt: `急袭：视为对任意名其他角色使用一张无距离限制的【顺手牵羊】`,
          selectTarget: [1, targets.length],
          filterTarget(card2, player2, target2) {
            return get.event().targets.includes(target2);
          }
        }).set("targets", targets);
      }
    }
  },
  //势钟会
  mbsizi: {
    audio: 7,
    logAudio(event) {
      if (typeof event == "number") {
        return `mbsizi${event}.mp3`;
      }
      return 2;
    },
    enable: "phaseUse",
    usable: 1,
    beginMarkCount: 4,
    chargeSkill: 4,
    init(player, skill) {
      const num = lib.skill[skill].beginMarkCount;
      player.addCharge(num, false);
    },
    filter(event, player) {
      return player.countCharge() > 0;
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog(get.prompt2("mbsizi"), "hidden");
      },
      chooseControl(event, player) {
        const choices = Array.from(Array(player.countCharge())).map((v, i) => i + 1);
        return [...choices, "cancel2"];
      },
      check(event, player) {
        return get.rand(1, player.countCharge());
      },
      backup(result, player) {
        return {
          audio: "mbsizi",
          logAudio: () => 2,
          control: result.control,
          async content(event, trigger, player2) {
            const { control: num } = get.info(event.name), skill = "mbsizi_effect";
            player2.removeCharge(num);
            player2.addTempSkill(skill, { player: "phaseBegin" });
            player2.addMark(skill, num, false);
            if (num > player2.getHp()) {
              player2.addTempSkill("mbsizi_extra", { player: "phaseBegin" });
            }
          }
        };
      },
      prompt(result, player) {
        let prompt = `直到你的回合开始，接下来${get.cnNumber(result.control)}个回合：`;
        let list = ["所有角色使用【杀】造成的伤害+1", "每个回合结束时，本回合内使用过【杀】的角色失去1点体力，你摸两张牌", "每个回合结束时，若本回合未有角色使用过【杀】，你与当前回合角色各失去1点体力"];
        if (result.control <= player.hp) {
          list = list.slice(0, 2);
        }
        return `###${prompt}###${list.join("<br>")}`;
      }
    },
    subSkill: {
      backup: {},
      extra: {
        charlotte: true
      },
      effect: {
        charlotte: true,
        onremove(player, skill) {
          player.clearMark(skill, false);
          player.removeSkill("mbsizi_extra");
        },
        intro: {
          content(storage, player) {
            if (!storage) {
              return "已无效果";
            }
            let list = ["所有角色使用【杀】造成的伤害+1", "每个回合结束时，你摸两张牌且本回合内使用过【杀】的角色失去1点体力", "每个回合结束时，若本回合未有角色使用过【杀】，当前回合角色失去1点体力"];
            if (!player.hasSkill("mbsizi_extra")) {
              list = list.slice(0, 2);
            }
            return `剩余可用${storage || "0"}个回合<br>${list.map((i) => `<li>${i}`).join("<br>")}`;
          }
        },
        trigger: {
          global: ["phaseEnd", "damageBegin1"]
        },
        filter(event, player) {
          if (!player.countMark("mbsizi_effect")) {
            return false;
          }
          return event.name == "phase" || event.card?.name == "sha" && event.notLink();
        },
        async cost(event, trigger, player) {
          if (trigger.name == "phase") {
            player.removeMark(event.skill, 1, false);
            event.result = {
              bool: true,
              skill_popup: false
            };
          } else {
            trigger.num++;
          }
        },
        async content(event, trigger, player) {
          const targets = game.filterPlayer2(
            (current) => {
              return current.hasHistory("useCard", (evt) => evt.card?.name == "sha");
            },
            void 0,
            true
          );
          const func = async (target) => {
            if (!target?.isIn()) {
              return;
            }
            await target.loseHp();
          };
          player.logSkill("mbsizi", null, null, null, [get.rand(4, 5)]);
          await player.draw(2);
          if (targets.length) {
            await game.doAsyncInOrder(targets, func);
          }
          if (player.hasSkill("mbsizi_extra") && !targets?.length) {
            player.logSkill("mbsizi", null, null, null, [get.rand(6, 7)]);
            await game.doAsyncInOrder([_status.currentPhase], func);
          }
        }
      }
    },
    ai: {
      order: 10,
      result: {
        player: 1
      }
    }
  },
  mbxiezhi: {
    audio: 2,
    trigger: { player: "changeHpAfter" },
    filter(event, player) {
      return event.changedHp != 0;
    },
    forced: true,
    async content(event, trigger, player) {
      const max = Math.max(player.countCharge(true), 0);
      const num = Math.min(Math.abs(trigger.changedHp), max);
      if (num > 0) {
        player.addCharge(num);
      }
      const num2 = Math.abs(trigger.changedHp) - num;
      if (num2 > 0) {
        const buff = `${event.name}_effect`;
        player.addSkill(buff);
        player.addMark(buff, 1, false);
        game.log(player, "的手牌上限和出杀次数", "#y+1");
        await game.delayx();
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        intro: { content: "手牌上限和出杀次数+#" },
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("mbxiezhi_effect");
          },
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.countMark("mbxiezhi_effect");
            }
          }
        }
      }
    }
  },
  mbyunan: {
    audio: 4,
    trigger: {
      source: "dying"
    },
    juexingji: true,
    initGroup: "wei",
    forced: true,
    skillAnimation: true,
    animationColor: "purple",
    filter(event, player) {
      return game.getRoundHistory("everything", (evt) => evt.name == "die").length > 0;
    },
    async content(event, trigger, player) {
      await player.changeGroup("qun");
      player.awakenSkill(event.name);
      const skill = "mbkechang";
      if (!player.hasSkill(skill, null, null, false)) {
        await player.addSkills(skill);
      } else {
        player.setStorage(skill, true);
        player.popup(skill, "purple");
        game.log(player, "升级了技能", `#g【${get.translation(skill)}】`);
        await game.delayx();
      }
    },
    derivation: ["mbkechang"]
  },
  mbkechang: {
    audio: 2,
    onremove: true,
    zhuSkill: true,
    forced: true,
    trigger: {
      player: "useCard1"
    },
    filter(event, player) {
      if (event.card.name != "sha") {
        return false;
      }
      return player.getStorage("mbkechang", false) === true;
    },
    async content(event, trigger, player) {
      trigger.directHit.addArray(game.players);
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        return player.getStorage("mbkechang", false) && arg?.card?.name == "sha";
      }
    },
    derivation: ["mbkechang_rewrite"],
    global: "mbkechang_global",
    subSkill: {
      rewrite: {
        nopop: true
      },
      global: {
        charlotte: true,
        mod: {
          targetInRange(card, player) {
            if (player.group != "qun" || card.name != "sha") {
              return;
            }
            if (game.hasPlayer((current) => current.hasSkill("mbkechang"))) {
              return true;
            }
          }
        }
      }
    }
  },
  //势臧洪
  pot_liezhi: {
    audio: 2,
    enable: "chooseToUse",
    usable: 1,
    locked: false,
    mod: {
      cardUsable(card) {
        if (card?.storage?.potliezhi) {
          return Infinity;
        }
      }
    },
    filter(event, player) {
      return ["tao", "jiu"].some((name) => {
        const card = new lib.element.VCard({ name, isCard: true, storage: { potliezhi: true } });
        return event.filterCard(card, player, event);
      });
    },
    chooseButton: {
      dialog(event, player) {
        const list = ["tao", "jiu"].filter((name) => {
          const card = new lib.element.VCard({ name, isCard: true, storage: { potliezhi: true } });
          return event.filterCard(card, player, event);
        });
        const dialog = ui.create.dialog("烈志", [list, "vcard"], "hidden");
        dialog.direct = true;
        return dialog;
      },
      check(button) {
        if (get.event().getParent().type != "phase") {
          return 1;
        }
        const player = get.player(), card = new lib.element.VCard({ name: button.link[2], isCard: true, storage: { potliezhi: true } });
        if (button.link[2] == "tao" && player.getDamagedHp() <= 1) {
          return 0;
        }
        return player.getUseValue(card);
      },
      prompt(links) {
        return `减少1点体力上限，视为使用一张${get.translation(links[0][2])}`;
      },
      backup(links, player) {
        return {
          viewAs: {
            name: links[0][2],
            isCard: true,
            storage: {
              potliezhi: true
            }
          },
          filterCard: () => false,
          selectCard: -1,
          manualConfirm: true,
          log: false,
          popname: true,
          async precontent(event, trigger, player2) {
            event.getParent().addCount = false;
            player2.logSkill("pot_liezhi");
            await player2.loseMaxHp();
          }
        };
      }
    },
    hiddenCard(player, name) {
      return ["tao", "jiu"].includes(name);
    },
    ai: {
      order: 1,
      result: {
        player(player) {
          if (player.maxHp <= 1) {
            return -2;
          }
          if (_status.event.dying) {
            return get.attitude(player, _status.event.dying);
          }
          return 1;
        }
      }
    }
  },
  pot_jugu: {
    audio: 2,
    trigger: {
      target: "useCardToTargeted"
    },
    filter(event, player) {
      return !player.isDamaged();
    },
    check(event, player) {
      return player.getHistory("useSkill", (evt) => evt.skill == "pot_jugu").length < 2;
    },
    async content(event, trigger, player) {
      await player.draw(2);
      const num = Math.min(player.countDiscardableCards(player, "he"), player.getHistory("useSkill", (evt) => evt.skill == event.name).length);
      if (num > 0) {
        await player.chooseToDiscard(num, "he", true);
      }
    }
  },
  //势陈矫
  potqingyan: {
    audio: 3,
    enable: "chooseToUse",
    onChooseToUse(event) {
      if (game.online) {
        return;
      }
      const num = Math.min(event.player.getRoundHistory("useSkill", (evt) => evt.skill == "potqingyan").length + 1, 5);
      event.set("qingyanCount", num);
    },
    filter(event, player) {
      if (player.countCards("h", (card) => card.hasGaintag("potqingyan"))) {
        return false;
      }
      if (player.countCards("h") < event.qingyanCount) {
        return false;
      }
      return ["shan", "wuxie"].some((name) => {
        const card = new lib.element.VCard({ name, isCard: true });
        return event.filterCard(card, player, event);
      });
    },
    chooseButton: {
      dialog(event, player) {
        const list = ["shan", "wuxie"].filter((name) => {
          const card = new lib.element.VCard({ name, isCard: true });
          return event.filterCard(card, player, event);
        });
        const dialog = ui.create.dialog("清严", [list, "vcard"], "hidden");
        dialog.direct = true;
        return dialog;
      },
      backup(links, player) {
        const num = get.event().qingyanCount;
        return {
          filterCard: true,
          ignoreMod: true,
          position: "h",
          selectCard: num,
          popname: true,
          viewAs: {
            name: links[0][2],
            isCard: true,
            suit: "none",
            number: null
          },
          log: false,
          async precontent(event, trigger, player2) {
            player2.logSkill("potqingyan");
            const evt = event.result;
            await player2.showCards(evt.cards, `${get.translation(player2)}发动了【清严】`);
            player2.addGaintag(evt.cards, "potqingyan");
            evt.card = new lib.element.VCard({ name: evt.card.name, isCard: true });
            evt.cards = [];
          }
        };
      },
      prompt(links, player) {
        const event = get.event();
        return `###清严###展示${get.cnNumber(event.qingyanCount)}张手牌，视为使用一张${get.translation(links[0][2])}`;
      }
    },
    hiddenCard(player, name) {
      if (!["shan", "wuxie"].includes(name)) {
        return false;
      }
      if (player.countCards("h", (card) => card.hasGaintag("potqingyan"))) {
        return false;
      }
      const num = player.getRoundHistory("useSkill", (evt) => evt.skill == "potqingyan").length + 1;
      return player.countCards("h") >= num;
    },
    ai: {
      order(item, player) {
        player ??= get.player();
        return get.order({ name: "shan" }, player) + 0.1;
      },
      result: {
        player: 1
      }
    }
  },
  potceduan: {
    audio: 3,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target.inRange(player);
    },
    async content(event, trigger, player) {
      const { target } = event, targets = game.filterPlayer((current) => target.inRange(current) && current.countCards("h"));
      const map = await game.chooseAnyOL(targets, get.info(event.name).showCard, []).forResult();
      const cards2 = [];
      for (const target2 of targets) {
        const result = map.get(target2);
        if (result?.bool && result.cards?.length) {
          cards2.addArray(result.cards);
        }
      }
      if (!cards2?.length) {
        return;
      }
      await player.showCards(cards2, `${get.translation(player)}发动了【策断】`).set("multipleShow", true);
      const colorMap = /* @__PURE__ */ new Map();
      for (const card of cards2) {
        const color = get.color(card);
        let num2 = 0;
        if (colorMap.has(color)) {
          num2 = colorMap.get(color);
        }
        num2++;
        colorMap.set(color, num2);
      }
      const colors = Array.from(colorMap.keys()), maxColor = colors.maxBy((color) => colorMap.get(color));
      if (!maxColor) {
        return;
      }
      const num = colorMap.get(maxColor);
      const cards22 = player.getCards("h", (card) => {
        const color = get.color(card);
        return colorMap.has(color) && colorMap.get(color) == num;
      });
      if (cards22.length) {
        const card = get.autoViewAs({ name: "sha" }, cards22);
        if (player.canUse(card, target, false, true)) {
          const next = player.useCard(card, cards22, target, false);
          await next;
          if (player.hasHistory("sourceDamage", (evt) => evt.getParent(2) == next)) {
            await player.draw();
          }
        }
      }
    },
    showCard(player, eventId) {
      const next = player.chooseCard("策断：展示一张手牌", "h", true);
      next.set("id", eventId);
      next.set("_global_waiting", true);
      return next;
    },
    ai: {
      order(item, player) {
        player ??= get.player();
        return get.order({ name: "sha" }, player) + 0.1;
      },
      result: {
        target(player, target) {
          const card = get.autoViewAs({ name: "sha" }, "unsure");
          if (player.canUse(card, target, false, true)) {
            return get.effect(target, card, player, target);
          }
          return 0;
        },
        player(player) {
          if (player.countCards("h") >= 4) {
            return -3;
          }
          return -1;
        }
      }
    }
  },
  //旧的势邓艾（神笔三技能互绑的三血白）
  old_pottuntian: {
    audio: "pottuntian",
    beginMarkCount: 1,
    chargeSkill: 3,
    init(player, skill) {
      const num = lib.skill[skill].beginMarkCount;
      player.addCharge(num, false);
    },
    getNum(player) {
      const num = game.getGlobalHistory("everything", (evt) => {
        if (evt.player != player || evt.name != "removeMark") {
          return false;
        }
        return evt.markName == "charge";
      }).reduce((sum, evt) => sum + evt.num, 0);
      return num;
    },
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCharge();
    },
    filterTarget(event, player, target) {
      return target.countCards("he");
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.removeCharge();
      const { cards: cards2 } = await target.chooseCard("he", true, "选择一张牌置于" + get.translation(player) + "的武将牌上作为「田」").set("ai", (card) => {
        const player2 = get.player(), target2 = get.event().target, att = get.attitude(player2, target2);
        if (att <= 0) {
          return 6 - get.value(card);
        }
        return target2.getUseValue(card);
      }).set("target", player).forResult();
      if (cards2?.length) {
        const next = player.addToExpansion(cards2, target, "give");
        next.gaintag.add("old_pottuntian");
        await next;
      }
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
    group: ["old_pottuntian_biyue", "old_pottuntian_addCharge"],
    subSkill: {
      biyue: {
        audio: "pottuntian",
        trigger: { player: "phaseEnd" },
        filter(event, player) {
          const num = lib.skill.old_pottuntian.getNum(player);
          return num > 0;
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          const num = lib.skill.old_pottuntian.getNum(player);
          if (num > 0) {
            await player.draw(num);
          }
        }
      },
      addCharge: {
        audio: "pottuntian",
        trigger: {
          player: "loseAfter",
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          if (player == _status.currentPhase || !player.countCharge(true)) {
            return false;
          }
          if (event.name != "addToExpansion") {
            if (event.name == "lose" && event.getlx !== false) {
              for (var i in event.gaintag_map) {
                if (event.gaintag_map[i].includes("old_pottuntian")) {
                  return true;
                }
              }
            }
            if (game.getGlobalHistory("cardMove", (evt2) => {
              if (evt2.name != "lose" || event != evt2.getParent()) {
                return false;
              }
              for (var i2 in evt2.gaintag_map) {
                if (evt2.gaintag_map[i2].includes("old_pottuntian") && evt2.player == player) {
                  return true;
                }
              }
              return false;
            }).length) {
              return true;
            }
          }
          if (event.name == "gain" && event.player == player) {
            return false;
          }
          const evt = event.getl(player);
          return evt && evt.cards2 && evt.cards2.length > 0;
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          player.addCharge(1);
        }
      }
    },
    ai: {
      order: 7,
      result: {
        player(player, target) {
          return get.effect(target, { name: "shunshou_copy2" }, player, player);
        }
      },
      //剩下这部分ai直接照抄手杀界屯田力
      effect: {
        target() {
          return lib.skill.tuntian.ai.effect.target.apply(this, arguments);
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
  old_potjixi: {
    audio: "potjixi",
    mod: {
      targetInRange(card) {
        if (card.storage?.old_potjixi) {
          return true;
        }
      }
    },
    enable: ["chooseToUse", "chooseToRespond"],
    hiddenCard(player, name) {
      if (player.hasSkill("old_pottuntian", null, null, false) && player.hasMark("old_potzaoxian") && player.getExpansions("old_pottuntian").some((card) => card.name == name)) {
        return true;
      }
    },
    filter(event, player) {
      if (event.responded || event.old_potjixi || !player.hasSkill("old_pottuntian", null, null, false) || !player.hasMark("old_potzaoxian")) {
        return false;
      }
      return player.getExpansions("old_pottuntian").some((card) => event.filterCard(get.autoViewAs({ name: card.name, nature: card.nature, storage: { old_potjixi: true } }, [card]), player, event));
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("急袭", player.getExpansions("old_pottuntian"), "hidden");
      },
      filter(button, player) {
        const evt = _status.event.getParent();
        return evt.filterCard(get.autoViewAs({ name: button.link.name, nature: button.link.nature, storage: { old_potjixi: true } }, [button.link]), player, evt);
      },
      check(button) {
        const card = button.link, player = get.player();
        return player.getUseValue({
          name: card.name,
          nature: card.nature,
          storage: { old_potjixi: true }
        });
      },
      backup(links, player) {
        return {
          audio: "potjixi",
          filterCard(card) {
            return card === lib.skill.old_potjixi_backup.card;
          },
          selectCard: -1,
          viewAs: {
            name: links[0].name,
            nature: links[0].nature,
            storage: { old_potjixi: true }
          },
          card: links[0],
          position: "x",
          async precontent(event, trigger, player2) {
            player2.removeMark("old_potzaoxian", 1);
            event.result.card = get.autoViewAs(event.result.cards?.[0]);
            event.getParent()?.set("addCount", false);
            game.log(event.result.cards?.[0], "不计入次数");
          }
        };
      },
      prompt(links, player) {
        return "急袭：请选择" + get.translation(links[0]) + "的目标";
      }
    },
    ai: {
      combo: ["old_pottuntian", "old_potzaoxian"],
      effect: {
        target(card, player, target, effect) {
          if (get.tag(card, "respondShan")) {
            return 0.7;
          }
          if (get.tag(card, "respondSha")) {
            return 0.7;
          }
        }
      },
      order: 9,
      respondShan: true,
      respondSha: true,
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
      backup: { audio: "potjixi" }
    }
  },
  old_potzaoxian: {
    audio: "potzaoxian",
    trigger: {
      global: "phaseEnd"
    },
    filter(event, player) {
      if (!player.hasSkill("old_pottuntian", null, null, false)) {
        return false;
      }
      const num = player.countCharge();
      return [0, 3].includes(num);
    },
    forced: true,
    async content(event, trigger, player) {
      player.addMark("old_potzaoxian", 1);
    },
    marktext: "峥",
    intro: {
      name: "峥嵘",
      content: "mark"
    },
    ai: {
      combo: ["old_pottuntian", "old_potjixi"]
    }
  },
  //势桓阶（传奇搅屎棍，新时代鲁大师）
  potgongmou: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.hasPlayer((target) => {
        if (target == player || target.countCards("h") + player.countCards("h") == 0) {
          return false;
        }
        return true;
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget("你可发动共谋，与1名其他角色交换手牌并获得技能", (card, player2, target) => {
        if (target == player2 || target.countCards("h") + player2.countCards("h") == 0) {
          if (target != player2) {
            target.prompt("没牌交换", "fire");
          }
          return false;
        }
        return true;
      }).set("ai", (target) => {
        const player2 = get.player();
        return -get.attitude(player2, target) * (target.countCards("h") - player2.countCards("h"));
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await player.swapHandcards(target);
      await player.addTempSkills(get.info(event.name).derivation[0]);
      await target.addTempSkills(get.info(event.name).derivation[1]);
    },
    derivation: ["qice", "kanpo"],
    ai: {
      threaten: 3
    }
  },
  potzhengshuo: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "fire",
    filter(event, player) {
      return true;
    },
    filterTarget: true,
    selectTarget: -1,
    multiline: true,
    multitarget: true,
    line: "thunder",
    prompt: "你可令全场角色依次弃置所有手牌，然后洗牌并重新分发手牌",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const { targets } = event;
      player.chat("新年好啊！");
      await game.doAsyncInOrder(targets, async (target) => target.modedDiscard(target.getCards("h")));
      await game.washCard();
      player.chat("发牌！");
      await game.asyncDraw(targets.sortBySeat(), 4);
    },
    ai: {
      //贯彻搅屎棍精神，有大直接开
      //孩子们，有人对这个AI哈气了
      order: 114514,
      threaten: 1919810,
      result: {
        player(player, target) {
          if (player.hasUnknown()) {
            return 0;
          }
          return game.countPlayer((current) => {
            const att = Math.sign(Math.sign(get.attitude(player, current)) - 0.5);
            return (4 - current.countCards("h")) * att;
          });
        }
      }
    }
  },
  //势辛宪英
  potjiejie: {
    global: "potjiejie_global",
    audio: 2,
    subSkill: {
      global: {
        audio: "potjiejie",
        enable: "phaseUse",
        filter(event, player) {
          if (player != _status.currentPhase) {
            return false;
          }
          if (!player.countCards("h") || player.hasSkill("potjiejie_used")) {
            return false;
          }
          return game.hasPlayer((current) => current.hasSkill("potjiejie"));
        },
        filterTarget(card, player, target) {
          return target.hasSkill("potjiejie");
        },
        selectTarget() {
          if (game.countPlayer((current) => {
            return current.hasSkill("potjiejie");
          }) > 1) {
            return 1;
          }
          return -1;
        },
        prompt() {
          const player = get.player(), targets = game.filterPlayer((current) => {
            return current.hasSkill("potjiejie");
          });
          let list = get.translation(targets);
          if (targets.length > 1) {
            list += "中的一人";
          }
          if (targets.length == 1 && targets[0] == player) {
            return "观看自己手牌并选择花色执行对应效果";
          }
          return `令${list}观看你的手牌并选择花色执行效果`;
        },
        prepare(cards2, player, targets) {
          targets[0].logSkill("potjiejie", [player]);
        },
        log: false,
        manualConfirm: true,
        async content(event, trigger, player) {
          const target = event.target;
          player.addTempSkill("potjiejie_used", "phaseUseAfter");
          game.addCardKnower(player.getCards("h"), target);
          player.getHistory("custom").push({
            potjiejie: true,
            suits: player.getCards("h").map((card) => get.suit(card, player)).toUniqued(),
            target
          });
          const list = get.addNewRowList(player.getCards("h"), "suit", player);
          const result = await target.chooseButton([
            [
              [[`诫节：请选择一个花色<div class="text center">若${get.translation(player)}手牌包含此花色，其本回合使用此花色的牌无次数限制，然后弃置其余花色的手牌，否则其获得此花色的一张牌</div>`], "addNewRow"],
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
          ]).set("ai", (button) => {
            const { player: player2, target: target2 } = get.event();
            const att = get.attitude(player2, target2);
            const { links } = button;
            const hs = target2.getCards("h");
            if (att > 0) {
              if (!links.length) {
                return 2;
              }
              if (links.filter((card) => card.name == "sha" && target2.getUseValue(card, true, false)).length > 1 && hs.length - links.length < 3) {
                return 1;
              }
              return get.event().getRand();
            } else if (att <= 0) {
              if (!links.length) {
                return 0;
              }
              if (links.length < 2) {
                return 2;
              }
              if (links.filter((card) => card.name == "sha" && target2.getUseValue(card, true, false)).length < 2) {
                return 1;
              }
              return 0;
            }
          }).set("target", player).forResult();
          if (result?.links?.length) {
            const [choice] = result.links;
            game.log(target, "选择了" + get.translation(choice));
            target.popup(choice);
            if (player.hasCard((card) => get.suit(card, player) == choice, "h")) {
              const skill = "potjiejie_effect";
              player.markAuto(skill, [choice]);
              player.addTip(
                skill,
                `诫节${player.getStorage(skill).sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a)).map((suit) => get.translation(suit)).join("")}`
              );
              player.addTempSkill(skill);
              await player.modedDiscard(player.getCards("h", (card) => get.suit(card, player) != choice));
            } else {
              const card = get.cardPile((card2) => {
                return get.suit(card2) == choice;
              });
              if (card) {
                await player.gain(card, "gain2");
              }
            }
          }
          if (target.countMark("potjiejie_blocker") >= 2) {
            return;
          }
          let getSuits = (current) => current.getRoundHistory("custom", (evt) => {
            return evt?.potjiejie && evt.target == target;
          }).reduce((arr, evt) => arr.addArray(evt?.suits || []), []);
          const num = getSuits(player).length;
          if (!game.hasPlayer((current) => current != player && getSuits(current).length >= num)) {
            target.addTempSkill("potjiejie_blocker", { global: "roundStart" });
            target.addMark("potjiejie_blocker", 1, false);
            await target.useSkill("potqingshi", [player]);
          }
        },
        ai: {
          order: 5,
          result: {
            player(player, target) {
              return get.attitude(player, target);
            }
          }
        }
      },
      blocker: {
        charlotte: true,
        onremove: true
      },
      used: {
        charlotte: true
      },
      effect: {
        charlotte: true,
        onremove(player, skill) {
          delete player.storage[skill];
          player.removeTip(skill);
        },
        mark: true,
        intro: {
          content: (storage) => `本回合使用${get.translation(storage)}牌无次数限制`
        },
        mod: {
          cardUsable(card, player) {
            const list = player.getStorage("potjiejie_effect");
            const suit = get.suit(card);
            if (suit === "unsure" || list.includes(suit)) {
              return Infinity;
            }
          }
        }
      }
    }
  },
  potqingshi: {
    audio: 4,
    logAudio(event, player, triggername, _, costResult) {
      let target;
      if (event.name == "useSkill") {
        target = event.targets[0];
      } else {
        target = costResult.targets[0];
      }
      if (player.getFriends(true).includes(target)) {
        return ["potqingshi1.mp3", "potqingshi2.mp3"];
      }
      return ["potqingshi3.mp3", "potqingshi4.mp3"];
    },
    trigger: {
      player: "damageEnd"
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill)).set("ai", (target) => {
        const player2 = get.player();
        if (player2.getFriends(true).includes(target)) {
          return get.effect(player2, { name: "draw" }, player2, player2) + get.effect(target, { name: "draw" }, player2, player2) > 0;
        }
        return get.effect(target, { name: "guohe_copy2" }, target, player2) + get.effect(player2, { name: "guohe_copy2" }, player2, player2) > 0;
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      if (player.getFriends(true).includes(target)) {
        await game.asyncDraw([player, target]);
      } else {
        await player.chooseToDiscard(true, "he");
        await player.discardPlayerCard(target, "he", true);
      }
    }
  },
  //陈祇
  mbquanchong: {
    audio: 4,
    logAudio: (index) => typeof index == "number" ? `mbquanchong${index}.mp3` : 2,
    trigger: {
      player: "phaseJieshuBegin"
    },
    forced: true,
    round: 1,
    filter(event, player) {
      return player.countDiscardableCards(player, "he");
    },
    async content(event, trigger, player) {
      if (player.countDiscardableCards(player, "he")) {
        await player.modedDiscard(player.getCards("he"));
        player.insertPhase();
        if (!player.isMaxHp(true)) {
          player.when({ player: "phaseBegin" }, false).assign({ firstDo: true }).filter((evt) => evt.skill == event.name).step(async (event2, trigger2, player2) => {
            player2.logSkill("mbquanchong", null, null, null, [get.rand(3, 4)]);
            await player2.loseHp();
          }).finish();
        }
      }
    }
  },
  mbrenxing: {
    audio: 2,
    trigger: { global: ["loseAfter", "loseAsyncAfter"] },
    filter(event, player) {
      if (game.players.every((target) => !event.getl(target)?.cards?.length) || event.getParent("phaseDiscard", true)) {
        return false;
      }
      if (player.countMark("mbrenxing_used") >= 2) {
        return false;
      }
      return game.getGlobalHistory("everything", (evt) => {
        if (!["lose", "loseAsync"].includes(evt.name) || evt.type != "discard" || evt.getParent("phaseDiscard", true)) {
          return false;
        }
        return game.players.some((target) => evt.getl(target)?.cards?.length);
      }).indexOf(event) == 0 && (_status.currentPhase?.isIn() || game.hasPlayer((current) => {
        return ["useCard", "respond"].every((key) => !current.getHistory(key, (evt) => evt.card?.name == "sha").length) && current.countDiscardableCards(player, "he");
      }));
    },
    async cost(event, trigger, player) {
      const result = await player.chooseButtonTarget({
        createDialog: [
          "任行：你可选择一项",
          [
            [
              ["draw", "你与当前回合角色各摸一张牌"],
              ["discard", "弃置一名本回合未使用或打出过【杀】的角色一张牌"]
            ],
            "textbutton"
          ]
        ],
        noShas: (() => {
          return game.filterPlayer((current) => {
            return ["useCard", "respond"].every((key) => !current.getHistory(key, (evt) => evt.card?.name == "sha").length) && current.countDiscardableCards(player, "he");
          });
        })(),
        filterButton(button) {
          if (button.link == "discard") {
            return get.event().noShas?.length;
          }
          return _status.currentPhase?.isIn();
        },
        selectTarget() {
          const link = ui.selected.buttons?.[0]?.link;
          return link == "discard" ? 1 : -1;
        },
        filterTarget(card, player2, target) {
          const link = ui.selected.buttons?.[0]?.link;
          if (link == "discard") {
            return get.event().noShas?.includes(target);
          }
          return target == _status.currentPhase || target == player2;
        },
        ai1(button) {
          const player2 = get.player();
          const target = _status.currentPhase;
          if (button.link === "draw" && target?.isIn()) {
            return get.effect(target, { name: "draw" }, target, player2) + get.effect(player2, { name: "draw" }, player2, player2);
          } else {
            return Math.max(...game.filterPlayer().map((current) => get.effect(current, { name: "guohe_copy2" }, player2, player2)));
          }
        },
        ai2(target) {
          const player2 = get.player();
          return get.effect(target, { name: "guohe_copy2" }, player2, player2);
        }
      }).forResult();
      event.result = {
        bool: result?.bool,
        targets: result?.targets,
        cost_data: result?.links
      };
    },
    async content(event, trigger, player) {
      const { targets, cost_data: choice } = event, name = "mbrenxing_used";
      player.addTempSkill(name, "roundStart");
      player.addMark(name, 1, false);
      if (choice.includes("draw")) {
        if (player == _status.currentPhase) {
          targets.push(player);
        }
        await game.asyncDraw(targets);
      } else {
        await player.discardPlayerCard(event.targets[0], "he", true);
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  //势鲁肃
  pothaoshi: {
    audio: 3,
    logAudio: () => 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return game.hasPlayer((target) => target != player);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return target != player2;
      }).set("ai", (target) => {
        return get.attitude(get.player(), target);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0], skill = event.name + "_clear";
      target.markAuto(event.name + "_use", player);
      target.addAdditionalSkill(`${event.name}_use_${player.playerid}`, event.name + "_use");
      player.addTempSkill(skill, { player: "phaseBegin" });
      player.storage[skill].set(target, 2);
      player.addTip(
        skill,
        [...player.storage[skill].entries()].map(([target2, num]) => {
          return `${get.translation(skill)}${get.translation(target2)} ${num}`;
        }).join("<br>")
      );
      player.addTempSkill(event.name + "_change", { player: "phaseBegin" });
    },
    group: ["pothaoshi_draw"],
    subSkill: {
      tag: {},
      draw: {
        audio: "pothaoshi",
        logAudio: () => "pothaoshi3.mp3",
        trigger: { player: "loseAfter" },
        forced: true,
        locked: false,
        filter(event, player) {
          const storage = player.storage["pothaoshi_clear"], target = event.getParent().pothaoshi;
          return event.getl(player)?.hs?.length && !player.countCards("h") && storage?.has(target) && storage.get(target) > 0;
        },
        async content(event, trigger, player) {
          const skill = "pothaoshi_clear";
          player.storage[skill].set(trigger.getParent().pothaoshi, player.storage[skill].get(trigger.getParent().pothaoshi) - 1);
          player.addTip(
            skill,
            [...player.storage[skill].entries()].map(([target, num]) => {
              return `${get.translation(skill)}${get.translation(target)} ${num}`;
            }).join("<br>")
          );
          await player.drawTo(3);
        }
      },
      clear: {
        charlotte: true,
        init(player, skill) {
          player.storage[skill] = /* @__PURE__ */ new Map([]);
        },
        onremove(player, skill) {
          [...player.storage[skill].entries()].forEach(([target, num]) => {
            target.unmarkAuto("pothaoshi_use", [player]);
            lib.skill.pothaoshi_use.init(target, "pothaoshi_use");
            target.removeAdditionalSkill(`pothaoshi_use_${player.playerid}`);
          });
          player.removeTip(skill);
          delete player.storage[skill];
        }
      },
      change: {
        trigger: {
          global: ["loseEnd", "loseAsyncEnd", "gainEnd", "addToExpansionEnd", "equipEnd", "addJudgeEnd"]
        },
        silent: true,
        charlrotte: true,
        filter(event, player) {
          return event.getg?.(player)?.length || event.getl?.(player)?.hs?.length;
        },
        forceDie: true,
        async content(event, trigger, player) {
          const toAdd = trigger.getg?.(player) || [], toRemove = trigger.getl?.(player)?.hs || [];
          event.set("toAdd", toAdd);
          event.set("toRemove", toRemove);
          await event.trigger("pothaoshiChange");
        }
      },
      use: {
        init(player, skill) {
          const toRemove = player.getCards("s", (card) => card.hasGaintag("pothaoshi_tag"));
          game.deleteFakeCards(toRemove);
          const cards2 = player.getStorage(skill).reduce((cards3, target) => {
            const fake = target.isAlive() && target.countCards("h") ? game.createFakeCards(target.getCards("h")) : [];
            return cards3.addArray(fake);
          }, []);
          player.directgains(cards2, null, "pothaoshi_tag");
        },
        onremove(player, skill) {
          const toRemove = player.getCards("s", (card) => card.hasGaintag("pothaoshi_tag"));
          game.deleteFakeCards(toRemove);
        },
        mark: true,
        intro: {
          content: "你可以如手牌般使用或打出<span class=thundertext>$</span>的手牌"
        },
        forced: true,
        popup: false,
        delay: false,
        charlotte: true,
        trigger: {
          player: ["useCardBefore", "respondBefore"],
          global: ["pothaoshiChange"]
        },
        filter(event, player) {
          if (["useCard", "respond"].includes(event.name)) {
            const cards2 = player.getCards("s", (card) => card.hasGaintag("pothaoshi_tag"));
            return event.cards && event.cards.some((card) => cards2.includes(card));
          }
          return player.getStorage("pothaoshi_use").includes(event.player);
        },
        async content(event, trigger, player) {
          const tag = "pothaoshi_tag";
          if (["useCard", "respond"].includes(trigger.name)) {
            trigger.set("pothaoshi", player);
            const real = player.getStorage(event.name).reduce((cards2, target) => {
              const hs = target.isAlive() && target.countCards("h") ? target.getCards("h") : [];
              return cards2.addArray(hs);
            }, []);
            for (let i = 0; i < trigger.cards.length; i++) {
              const card = trigger.cards[i];
              const cardx = real.find((cardx2) => cardx2.cardid == card._cardid);
              if (cardx) {
                trigger.cards[i] = cardx;
                trigger.card.cards[i] = cardx;
              }
            }
          } else {
            game.deleteFakeCards(player.getCards("s", (card) => trigger.toRemove.find((cardx) => cardx.cardid == card._cardid)));
            player.directgains(game.createFakeCards(trigger.toAdd), null, tag);
          }
        }
      }
    }
  },
  potdimeng: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.countPlayer() > 1;
    },
    filterTarget(card, player, target) {
      const selected = ui.selected.targets;
      if (!selected.length) {
        return true;
      }
      return Math.abs(target.countCards("h") - selected[0].countCards("h")) <= 3;
    },
    complexTarget: true,
    selectTarget: 2,
    multiline: true,
    multitarget: true,
    async content(event, trigger, player) {
      const { targets } = event, num = player.getDamagedHp();
      await targets[0].swapHandcards(targets[1]);
      if (num == 0) {
        return;
      }
      const discard = Math.min(num, player.countDiscardableCards(player, "he")), count = targets[0].countCards("h") - targets[1].countCards("h");
      if (discard == 0 && count == 0) {
        return;
      }
      if (count == 0) {
        await player.chooseToDiscard(`缔盟：是否弃置${get.cnNumber(discard)}张牌？`, discard, "he");
        return;
      }
      const target = targets.sort((a, b) => a.countCards("h") - b.countCards("h"))[0];
      if (discard == 0) {
        const result2 = await player.chooseBool(`缔盟：是否令${get.translation(target)}摸${get.cnNumber(num)}张牌？`).set("choice", get.effect(target, { name: "draw" }, player, player) > 0).forResult();
        if (result2?.bool) {
          await target.draw(num);
        }
        return;
      }
      const result = await player.chooseToDiscard(`缔盟：弃置${get.cnNumber(discard)}张牌或令${get.translation(target)}摸${get.cnNumber(num)}张牌`, discard, "he").set("targetx", target).set("ai", (card) => {
        const player2 = get.player(), target2 = get.event().targetx, eff = get.effect(target2, { name: "wuzhong" }, player2, player2);
        if (eff > 0) {
          return 0;
        }
        return 6.5 - get.value(card);
      }).forResult();
      if (!result?.cards?.length) {
        await target.draw(num);
      }
    },
    ai: {
      order: 6,
      threaten: 3,
      expose: 0.9,
      result: {
        target(player, target) {
          const list = [];
          const num = player.getDamagedHp();
          const players = game.filterPlayer();
          if (ui.selected.targets.length == 0) {
            for (let i = 0; i < players.length; i++) {
              if (players[i] != player && get.attitude(player, players[i]) > 3) {
                list.push(players[i]);
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
            for (let i = 0; i < players.length; i++) {
              if (players[i] != player && get.attitude(player, players[i]) < 1) {
                list.push(players[i]);
              }
            }
            list.sort(function(a, b) {
              return b.countCards("h") - a.countCards("h");
            });
            if (from.countCards("h") >= list[0].countCards("h")) {
              return -get.attitude(player, target);
            }
            for (let i = 0; i < list.length && from.countCards("h") < list[i].countCards("h"); i++) {
              if (list[i].countCards("h") - from.countCards("h") <= num) {
                const count = list[i].countCards("h") - from.countCards("h");
                if (count < 2 && from.countCards("h") >= 2) {
                  return -get.attitude(player, target);
                }
                if (target == list[i]) {
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
  //孙峻
  mbxiongtu: {
    audio: 4,
    logAudio: (index) => typeof index === "number" ? `mbxiongtu${index}.mp3` : 2,
    enable: "phaseUse",
    usable(skill, player) {
      return player.hasSkill(skill + "_double") ? 2 : 1;
    },
    filter(event, player) {
      return game.hasPlayer((target) => target.hasCards("h") && target != player);
    },
    filterTarget(card, player, target) {
      return target.hasCards("h") && target != player;
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      if (!target.hasCards("h")) {
        return;
      }
      const result = await player.choosePlayerCard(`凶图：请展示${get.translation(target)}的一张手牌`, target, "h", true).forResult();
      if (result?.cards?.length) {
        const card = result.cards[0];
        await player.showCards(card, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
        const num = lib.suit.slice(0).removeArray(
          get.discarded().map((card2) => get.suit(card2)).unique()
        ).length;
        const resultx = num > 0 ? await player.chooseToDiscard({
          prompt: `凶图：弃置${num}张牌对${get.translation(target)}造成1点伤害或取消并弃置${get.translation(card)}`,
          position: "he",
          selectCard: num,
          ai(card2) {
            if (get.event().num > 2) {
              return 0;
            }
            return 6 - get.value(card2);
          }
        }).set("num", num).forResult() : await player.chooseBool({
          prompt: `凶图：对${get.translation(target)}造成1点伤害或取消并弃置${get.translation(card)}`,
          ai() {
            const { player: player2, target: target2 } = get.event();
            if (get.damageEffect(target2, player2, player2) > 0) return true;
            return false;
          }
        }).set("target", target).forResult();
        if (resultx?.bool) {
          player.logSkill("mbxiongtu", [target], null, null, [get.rand(3, 4)]);
          await target.damage();
        } else {
          await target.modedDiscard(card, player);
        }
        player.addTempSkill(event.name + "_effect");
      }
    },
    ai: {
      order: 1,
      result: {
        target: -1
      }
    },
    subSkill: {
      effect: {
        audio: "mbxiongtu",
        charlotte: true,
        forced: true,
        trigger: {
          source: "damageSource"
        },
        filter(event, player) {
          return event.getParent().name != "mbxiongtu";
        },
        async content(event, trigger, player) {
          player.removeSkill(event.name);
          player.addTempSkill("mbxiongtu_double", "phaseChange");
          await player.draw();
        },
        mark: true,
        intro: {
          content: "下次不因此技能造成伤害后，摸一张牌并改为限两次"
        }
      },
      double: {
        charlotte: true
      }
    }
  },
  mbxianshuai: {
    audio: 2,
    init(player, skill) {
      player.addSkill(skill + "_record");
    },
    onremove(player, skill) {
      player.removeSkill(skill + "_record");
    },
    mod: {
      cardUsable(card, player, num) {
        if (_status.currentPhase != player) {
          return;
        }
        const cards2 = card.cards;
        if (cards2.length == 1) {
          if (player.getCards("h").includes(cards2[0]) && !player.getStorage("mbxianshuai_record").includes(get.suit(cards2[0], player))) {
            return Infinity;
          }
        }
        return;
      }
    },
    trigger: { player: "useCard1" },
    filter(event, player) {
      if (_status.currentPhase != player) {
        return false;
      }
      return event.mbxianshuai && event.addCount !== false;
    },
    forced: true,
    async content(event, trigger, player) {
      trigger.addCount = false;
      const stat = player.getStat().card, name = trigger.card.name;
      if (typeof stat[name] === "number") {
        stat[name]--;
      }
    },
    subSkill: {
      record: {
        init(player, skill) {
          if (_status.currentPhase != player) {
            return;
          }
          const suits = player.getHistory("lose", (evt) => {
            if ((evt.relatedEvent || evt.getParent()).name != "useCard") {
              return false;
            }
            return evt.cards.length == 1 && evt.hs?.length == 1;
          }).map((evt) => get.suit(evt.getParent()?.card)).unique();
          if (suits.length) {
            player.addTempSkill("mbxianshuai_clear");
            player.markAuto(
              skill,
              suits.sort((a, b) => lib.suit.indexOf(a) - lib.suit.indexOf(b))
            );
            player.addTip(skill, `${get.translation(skill)} ${player.getStorage(skill).reduce((str, suit) => str += get.translation(suit), "")}`);
          }
        },
        trigger: { player: "useCard0" },
        charlotte: true,
        silent: true,
        filter(event, player) {
          if (_status.currentPhase != player) {
            return false;
          }
          return event.cards.length == 1 && !player.getStorage("mbxianshuai_record").includes(get.suit(event.card)) && player.hasHistory("lose", (evt) => {
            const evtx = evt.relatedEvent || evt.getParent();
            return evtx == event && evt.hs?.length == 1;
          });
        },
        async content(event, trigger, player) {
          trigger.set("mbxianshuai", true);
          player.addTempSkill("mbxianshuai_clear");
          player.markAuto(event.name, get.suit(trigger.card));
          player.storage[event.name] = player.getStorage(event.name).sort((a, b) => lib.suit.indexOf(a) - lib.suit.indexOf(b));
          player.addTip(event.name, `${get.translation(event.name)} ${player.getStorage(event.name).reduce((str, suit) => str += get.translation(suit), "")}`);
        },
        intro: {
          content: "已使用过的花色:$"
        }
      },
      clear: {
        onremove(player, skill) {
          delete player.storage.mbxianshuai_record;
          player.unmarkSkill("mbxianshuai_record");
          player.removeTip("mbxianshuai_record");
        },
        charlotte: true
      }
    }
  },
  //势魏延
  potzhongao: {
    audio: 5,
    dutySkill: true,
    derivation: ["potkuanggu", "potkuanggu_pot_weiyan_achieve", "kunfen"],
    group: ["potzhongao_start", "potzhongao_achieve", "potzhongao_fail"],
    subSkill: {
      start: {
        audio: "potzhongao1.mp3",
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        filter(event, player) {
          return event.name != "phase" || game.phaseNumber == 0;
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          await player.addSkills("potkuanggu");
        }
      },
      achieve: {
        audio: ["potzhongao2.mp3", "potzhongao3.mp3"],
        trigger: {
          source: "dieAfter"
        },
        forced: true,
        locked: false,
        skillAnimation: true,
        animationColor: "fire",
        async content(event, trigger, player) {
          player.awakenSkill(event.name.slice(0, -8));
          game.log(player, "成功完成使命");
          player.changeSkin("potzhongao", "pot_weiyan_achieve");
          game.broadcastAll(() => {
            _status.tempMusic = "effect_yinzhanBGM";
            game.playBackgroundMusic();
          });
          player.setStorage("potkuanggu", 1);
          const num1 = player.countMark("potzhuangshi_limit"), num2 = player.countMark("potzhuangshi_directHit");
          if (num2 > 0) {
            await player.draw();
          }
          if (num1 > 0) {
            if (!player.isDamaged()) {
              await player.draw();
            } else {
              await player.recover();
            }
          }
        }
      },
      fail: {
        audio: ["potzhongao4.mp3", "potzhongao5.mp3"],
        trigger: {
          player: ["dying", "phaseUseBegin"]
        },
        filter(event, player) {
          return event.name == "dying" || !event.usedZhuangshi;
        },
        lastDo: true,
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          player.awakenSkill(event.name.slice(0, -5));
          game.log(player, "使命失败");
          player.changeSkin("potzhongao", "pot_weiyan_fail");
          game.broadcastAll(() => {
            _status.tempMusic = "effect_tuishouBGM";
            game.playBackgroundMusic();
          });
          await player.changeSkills(["kunfen"], ["potzhuangshi"]);
        }
      }
    }
  },
  potzhuangshi: {
    audio: 2,
    audioname: ["pot_weiyan_achieve"],
    trigger: {
      player: "phaseUseBegin"
    },
    async cost(event, trigger, player) {
      const { bool: bool1, cards: cards2 } = await player.chooseToDiscard(get.prompt(event.skill), [1, Infinity], "h", "allowChooseAll").set("prompt2", "弃置任意张手牌，令你此阶段使用的前等量张牌无距离限制且不可被响应").set("ai", (card) => {
        const player2 = get.player();
        let num = Math.floor(player2.countCards("h") / 2);
        if (!game.hasPlayer((current) => get.attitude(player2, current) < 0)) {
          num = 1;
        }
        if (ui.selected.cards.length < num && card.name != "du") {
          if (get.tag(card, "damage")) {
            return 0.1 - ui.selected.cards.length;
          }
          return 7 - get.value(card);
        }
        return 0;
      }).set("chooseonly", true).forResult();
      if (bool1 && cards2.length) {
        game.broadcastAll((cards3) => {
          cards3.forEach((card) => card.addGaintag("potzhuangshi_tag"));
        }, cards2);
      }
      const { bool: bool2, numbers } = await player.chooseNumbers(get.prompt(event.skill), [
        {
          prompt: "失去任意点体力值，令你此阶段使用的前等量张牌不计入次数限制",
          min: 1,
          max: player.getHp()
        }
      ]).set("processAI", () => {
        const player2 = get.player();
        if (player2.hp < 2 || !game.hasPlayer((current) => get.attitude(player2, current) < 0)) {
          return false;
        }
        let num = Math.min(Math.floor(player2.countCards("h") / 2), player2.hp - 1);
        return [num];
      }).forResult();
      event.result = {
        bool: bool1 || bool2,
        cards: cards2,
        cost_data: numbers
      };
      player.removeGaintag("potzhuangshi_tag");
    },
    async content(event, trigger, player) {
      trigger.set("usedZhuangshi", true);
      const { cards: cards2, cost_data: numbers } = event;
      if (cards2) {
        const number = cards2.length;
        player.addTempSkill("potzhuangshi_directHit", "phaseChange");
        player.addMark("potzhuangshi_directHit", number, false);
        player.addTip("potzhuangshi_directHit", `不可响应 ${number}`);
      }
      if (numbers) {
        const number = numbers[0];
        player.addTempSkill("potzhuangshi_limit", "phaseChange");
        player.addMark("potzhuangshi_limit", number, false);
        player.addTip("potzhuangshi_limit", `不计次数 ${number}`);
      }
      if (cards2) {
        await player.modedDiscard(cards2);
      }
      if (numbers) {
        const number = numbers[0];
        await player.loseHp(number);
      }
    },
    onremove(player) {
      player.removeSkill("potzhuangshi_directHit");
      player.removeSkill("potzhuangshi_limit");
    },
    subSkill: {
      limit: {
        trigger: {
          player: "useCard0"
        },
        charlotte: true,
        filter(event, player) {
          return player.hasMark("potzhuangshi_limit");
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          if (trigger.addCount !== false) {
            trigger.addCount = false;
            const stat = player.getStat().card, name = trigger.card.name;
            if (typeof stat[name] == "number") {
              stat[name]--;
            }
          }
          player.removeMark("potzhuangshi_limit", 1, false);
          const num = player.countMark("potzhuangshi_limit");
          if (num > 0) {
            player.addTip("potzhuangshi_limit", `不计次数 ${num}`);
          } else {
            player.removeTip("potzhuangshi_limit");
          }
        },
        onremove(player, skill) {
          player.clearMark(skill, false);
          player.removeTip(skill);
        },
        ai: {
          presha: true,
          skillTagFilter(player, tag, arg) {
            if (!player.hasMark("potzhuangshi_limit")) {
              return false;
            }
          }
        }
      },
      directHit: {
        trigger: {
          player: "useCard0"
        },
        charlotte: true,
        filter(event, player) {
          return player.hasMark("potzhuangshi_directHit");
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.players);
          player.removeMark("potzhuangshi_directHit", 1, false);
          const num = player.countMark("potzhuangshi_directHit");
          if (num > 0) {
            player.addTip("potzhuangshi_directHit", `不可响应 ${num}`);
          } else {
            player.removeTip("potzhuangshi_directHit");
          }
        },
        onremove(player, skill) {
          player.clearMark(skill, false);
          player.removeTip(skill);
        },
        mod: {
          targetInRange(card, player) {
            if (player.hasMark("potzhuangshi_directHit")) {
              return true;
            }
          }
        }
      }
    }
  },
  potyinzhan: {
    audio: 3,
    audioname: ["pot_weiyan_achieve", "pot_weiyan_fail"],
    trigger: {
      source: "damageBegin1"
    },
    forced: true,
    filter(event, player) {
      if (event.card?.name != "sha") {
        return false;
      }
      const target = event.player;
      if (player.hp <= target.hp || player.countCards("h") <= target.countCards("h")) {
        return true;
      }
      return false;
    },
    logTarget: "player",
    popup: false,
    logAudio: (player, indexedData) => "potyinzhan" + (lib.skill.potyinzhan.audioname.includes(player.skin.name) ? "_" + player.skin.name : "") + (indexedData ? indexedData : get.rand(1, 2)) + ".mp3",
    async content(event, trigger, player) {
      const target = trigger.player, bool1 = target.hp >= player.hp, bool2 = target.countCards("h") >= player.countCards("h");
      player.logSkill("potyinzhan", null, null, null, [player, bool1 && bool2 ? 3 : get.rand(1, 2)]);
      if (bool1) {
        trigger.num++;
      }
      if (bool2) {
        if (bool1) {
          player.popup("乘势", "fire");
        }
        player.when("useCardAfter").filter((evt) => evt == trigger.getParent(2)).step(async (event2, trigger2, player2) => {
          let result;
          if (target.isIn() && target.countDiscardableCards(player2, "he")) {
            result = await player2.discardPlayerCard(target, "he", true).forResult();
          }
          if (bool1) {
            await player2.recover();
            if (result?.cards?.length) {
              await player2.gain(result.cards.filterInD("od"), "gain2");
            }
          }
        });
      }
    }
  },
  potkuanggu: {
    audio: 2,
    audioname: ["pot_weiyan_fail"],
    audioname2: {
      pot_weiyan_achieve: "potkuanggu_pot_weiyan_achieve"
    },
    trigger: {
      source: "damageSource"
    },
    filter(event, player) {
      return event.checkKuanggu && event.num > 0;
    },
    frequent: true,
    popup: false,
    logAudio: (player, indexedData) => "potkuanggu" + (lib.skill.potkuanggu.audioname.includes(player.skin.name) ? "_" + player.skin.name : "") + (indexedData ? indexedData : get.rand(1, 2)) + ".mp3",
    logAudio2: {
      pot_weiyan_achieve: (player, indexedData) => "potkuanggu_pot_weiyan_achieve" + (indexedData ? indexedData : get.rand(1, 2)) + ".mp3"
    },
    async cost(event, trigger, player) {
      let choice, list = ["draw_card"], choiceList = ["选项一：回复1点体力", "选项二：摸一张牌"];
      if (player.getStorage(event.skill, 0) && player.countCards("he")) {
        list.push("背水！");
        choiceList.push("背水：弃置一张牌并令你本阶段使用【杀】的次数+1");
      }
      if (player.isDamaged()) {
        list.unshift("recover_hp");
      } else {
        choiceList[0] = `<span class = 'transparent'>${choiceList[0]}</span>`;
      }
      if (list.length == 1) {
        event.result = await player.chooseBool(get.prompt(event.skill), "摸一张牌").set("frequentSkill", event.skill).forResult();
        event.result.cost_data = "draw_card";
      } else {
        list.push("cancel2");
        if (player.isDamaged() && get.recoverEffect(player) > 0 && player.countCards("hs", function(card) {
          return card.name == "sha" && player.hasValueTarget(card);
        }) >= player.getCardUsable("sha")) {
          if (player.countCards("he") > 1 && list.includes("背水！")) {
            choice = "背水！";
          } else {
            choice = "recover_hp";
          }
        } else {
          choice = "draw_card";
        }
        const { control } = await player.chooseControl(list).set("prompt", get.prompt(event.skill)).set("choiceList", choiceList).set("displayIndex", false).set("choice", choice).set("ai", () => {
          return get.event().choice;
        }).forResult();
        event.result = {
          bool: control != "cancel2",
          cost_data: control
        };
      }
    },
    async content(event, trigger, player) {
      const result = event.cost_data;
      if (result == "背水！" && player.skin.name === "pot_weiyan_achieve") {
        player.logSkill("potkuanggu", null, null, null, [player, get.rand(3, 4)]);
      } else {
        player.logSkill("potkuanggu", null, null, null, [player]);
      }
      if (result == "recover_hp" || result == "背水！") {
        await player.recover();
      }
      if (result == "draw_card" || result == "背水！") {
        await player.draw();
      }
      if (result == "背水！" && player.countCards("he")) {
        await player.chooseToDiscard("he", true);
        player.addTempSkill("potkuanggu_effect", "phaseChange");
        player.addMark("potkuanggu_effect", 1, false);
      }
    },
    subSkill: {
      pot_weiyan_achieve: {
        audio: 4
      },
      effect: {
        charlotte: true,
        onremove: true,
        mod: {
          cardUsable(card, player, num) {
            if (player.countMark("potkuanggu_effect") && card.name == "sha") {
              return num + player.countMark("potkuanggu_effect");
            }
          }
        }
      }
    }
  },
  kunfen_pot_weiyan: { audio: 2 },
  //张燕
  mbfeijing: {
    audio: 4,
    logAudio() {
      return ["mbfeijing1.mp3", "mbfeijing3.mp3"];
    },
    trigger: { player: "useCardToPlayer" },
    filter(event, player) {
      if (event.card.name != "sha" || !event.isFirstTarget) {
        return false;
      }
      if (event.targets?.length != 1 || !event.target?.isIn()) {
        return false;
      }
      const [left, right] = get.info("mbfeijing").getTargets(player, event.target);
      return left.length || right.length;
    },
    usable: 2,
    getTargets(source, target) {
      let left = [], right = [], left2 = source, right2 = source;
      while (!(left2 == target && right2 == target)) {
        if (left2 != target) {
          left2 = left2.getPrevious();
          if (left2.isIn() && left2 != target) {
            left.push(left2);
          }
        }
        if (right2 != target) {
          right2 = right2.getNext();
          if (right2.isIn() && right2 != target) {
            right.push(right2);
          }
        }
      }
      return [left, right];
    },
    async cost(event, trigger, player) {
      const [left, right] = get.info(event.skill).getTargets(player, trigger.target);
      if (left.length && right.length) {
        const shun = `顺时针：${left.map((i) => get.translation(i)).join("、")}`, ni = `逆时针：${right.map((i) => get.translation(i)).join("、")}`, prompt = "令顺时针或逆时针上的角色同时展示并依次弃置一张手牌，然后你可令弃置一种颜色牌的所有角色成为此【杀】额外目标";
        const result = await player.chooseButton([
          get.prompt(event.skill),
          prompt,
          [
            [
              [left, shun],
              [right, ni]
            ],
            "textbutton"
          ]
        ]).set("ai", (button) => {
          const player2 = get.player(), trigger2 = get.event().getTrigger(), targets = button.link;
          let eff = 0;
          for (let target of targets) {
            if (lib.filter.targetEnabled2(trigger2.card, player2, target)) {
              eff += get.effect(target, trigger2.card, player2, player2);
            }
          }
          return eff;
        }).forResult();
        event.result = {
          bool: result?.bool,
          targets: result?.links?.[0]
        };
      } else {
        const targets = left.length ? left : right;
        event.result = await player.chooseBool(get.prompt2(event.skill, targets)).forResult();
        if (event.result?.bool) {
          event.result.targets = targets;
        }
      }
    },
    async content(event, trigger, player) {
      const targets = event.targets.filter((target) => target.countCards("h", (card) => lib.filter.cardDiscardable(card, target, "mbfeijing")));
      if (targets.length) {
        const next = player.chooseCardOL(targets, "h", true, "飞径：展示并弃置一张手牌", (card, player2) => {
          return lib.filter.cardDiscardable(card, player2, "mbfeijing");
        }).set("ai", get.unuseful).set("aiCard", (target) => {
          const cards3 = target.getCards("h");
          return { bool: true, cards: [cards3.randomGet()] };
        });
        next._args.remove("glow_result");
        const result = await next.forResult();
        const cards2 = [];
        for (let i = 0; i < result.length; i++) {
          targets[i];
          const card = result[i].cards[0];
          cards2.push(card);
        }
        await player.showCards(cards2, get.translation(player) + "发动了【飞径】").set("customButton", (button) => {
          const target = get.owner(button.link);
          if (target) {
            game.createButtonCardsetion(`${target.getName(true)}`, button);
          }
        }).set("delay_time", 4).set("multipleShow", true);
        const colors = {};
        for (let i = 0; i < result.length; i++) {
          const current = targets[i], card = result[i].cards[0], color = get.color(card, current);
          await current.discard([card]);
          if (!colors[color]) {
            colors[color] = [];
          }
          colors[color].add(current);
        }
        const list = [];
        for (let color in colors) {
          list.add([colors[color], `${get.translation(color)}：${colors[color].map((i) => get.translation(i)).join("、")}`]);
        }
        if (!list.length) {
          return;
        }
        const result2 = await player.chooseButton(["飞径：是否令弃置一种颜色牌的所有角色成为此【杀】额外目标？", [list, "textbutton"]]).set("ai", (button) => {
          const player2 = get.player(), trigger2 = get.event().getTrigger(), targets2 = button.link;
          let eff = 0;
          for (let target of targets2) {
            if (lib.filter.targetEnabled2(trigger2.card, player2, target)) {
              eff += get.effect(target, trigger2.card, player2, player2);
            }
          }
          return eff;
        }).forResult();
        if (result2?.bool && result2.links?.length) {
          const targetx = result2.links[0].filter((target) => lib.filter.targetEnabled2(trigger.card, player, target));
          if (targetx.length) {
            player.line(targetx);
            trigger.targets.addArray(targetx);
            trigger.getParent().feijingExtra ??= [];
            trigger.getParent().feijingExtra.addArray(targetx);
          }
        }
      }
    },
    group: "mbfeijing_viewas",
    subSkill: {
      viewas: {
        audio: ["mbfeijing2.mp3", "mbfeijing4.mp3"],
        enable: ["chooseToRespond", "chooseToUse"],
        filterCard(card, player) {
          return get.type2(card) == "trick" && get.tag(card, "damage");
        },
        position: "hes",
        viewAs: {
          name: "sha"
        },
        viewAsFilter(player) {
          if (!player.countCards("hes", (card) => get.type2(card) == "trick" && get.tag(card, "damage"))) {
            return false;
          }
        },
        prompt: "将一张伤害类锦囊牌当杀使用或打出",
        check(card) {
          const val = get.value(card);
          if (_status.event.name == "chooseToRespond") {
            return 1 / Math.max(0.1, val);
          }
          return 7 - val;
        },
        ai: {
          skillTagFilter(player) {
            if (!player.countCards("hes", (card) => get.type2(card) == "trick" && get.tag(card, "damage"))) {
              return false;
            }
          },
          respondSha: true
        }
      }
    }
  },
  mbxiaoge: {
    audio: 4,
    trigger: {
      source: "damageBegin2",
      player: "useCardAfter"
    },
    forced: true,
    filter(event, player) {
      if (event.name == "damage") {
        const evt = event.getParent("useCard", true);
        return evt?.feijingExtra?.includes(event.player) && evt?.targets?.includes(event.player) && evt?.card?.name == "sha";
      }
      return event.card.name == "sha" && event.targets.length == 1;
    },
    logTarget(event, player) {
      return event[event.name == "damage" ? "player" : "targets"];
    },
    logAudio(event) {
      if (event.name == "damage") {
        return 2;
      }
      return ["mbxiaoge3.mp3", "mbxiaoge4.mp3"];
    },
    async content(event, trigger, player) {
      if (trigger.name == "damage") {
        trigger.cancel();
        if (player.isDamaged()) {
          await player.recover();
        }
        const target = trigger.player, evt = trigger.getParent("useCard", true);
        let cards2;
        target.getHistory("lose", (evtx) => {
          const evtv = evtx.getParent(2);
          if (evtv?.name != "mbfeijing") {
            return false;
          }
          if (evtv?.getTrigger()?.getParent() != evt) {
            return false;
          }
          cards2 = evtx.cards2.filterInD("d");
        });
        if (cards2?.length) {
          await player.gain(cards2, "gain2");
        }
      } else {
        const card = { name: "juedou", isCard: true }, target = event.targets[0];
        if (player.canUse(card, target)) {
          await player.useCard(card, target);
        }
      }
    }
  },
  //国渊
  mbqingdao: {
    audio: 2,
    trigger: { global: "useCardAfter" },
    filter(event, player) {
      return event.player != player && get.is.damageCard(event.card) && event.targets?.includes(player);
    },
    async cost(event, trigger, player) {
      const damaged = player.hasHistory("damage", (evt) => evt.card && evt.getParent(2) == trigger);
      let result;
      if (damaged) {
        result = await player.chooseButtonTarget({
          createDialog: [
            `###${get.prompt(event.skill)}###<div class="text center">从牌堆或弃牌堆中获得一张【闪】，或弃置一名角色区域内的一张牌</div>`,
            [
              [
                ["shan", "获得【闪】"],
                ["discard", "弃置牌"]
              ],
              "tdnodes"
            ]
          ],
          filterButton(button) {
            if (button.link == "discard") {
              return game.hasPlayer((target) => target.countDiscardableCards(get.player(), "hej"));
            }
            return true;
          },
          filterTarget(card, player2, target) {
            return target.countDiscardableCards(player2, "hej");
          },
          selectTarget() {
            if (ui.selected.buttons.length) {
              const link = ui.selected.buttons[0].link;
              if (link == "discard") {
                return 1;
              }
              return 0;
            }
            return 0;
          },
          filterOk() {
            if (ui.selected.buttons.length) {
              const link = ui.selected.buttons[0].link;
              if (link == "discard") {
                return ui.selected.targets.length == 1;
              }
              return true;
            }
            return false;
          },
          ai1(button) {
            const player2 = get.player();
            if (button.link == "discard") {
              const values = game.filterPlayer((target) => target.countDiscardableCards(player2, "hej")).map((target) => get.effect(target, { name: "guohe_copy" }, player2, player2)).sort((a, b) => b - a);
              return values.length ? values[0] : 0;
            }
            if (button.link == "shan") {
              if (!player2.countCards("h", "shan")) {
                return get.effect(player2, { name: "wuzhong" }, player2, player2) * 2;
              }
              return get.effect(player2, { name: "wuzhong" }, player2, player2) / 3;
            }
          },
          ai2(target) {
            if (ui.selected.buttons[0].link != "discard") {
              return 1;
            }
            return get.effect(target, { name: "guohe_copy" }, get.player(), get.player());
          }
        }).forResult();
      } else {
        result = await player.chooseButton([
          `###${get.prompt(event.skill)}###<div class="text center">从牌堆或弃牌堆中获得一张【杀】，或使用一张手牌（无距离限制）</div>`,
          [
            [
              ["sha", "获得【杀】"],
              ["use", "使用手牌"]
            ],
            "tdnodes"
          ]
        ]).set("filterButton", (button) => {
          if (button.link == "use") {
            return get.player().hasCard((card) => get.player().hasUseTarget(card, false, false), "hs");
          }
          return true;
        }).set("ai", (button) => {
          const player2 = get.player();
          if (button.link == "use") {
            const values = player2.getCards("hs", (card) => player2.hasUseTarget(card, false, false)).map((card) => player2.getUseValue(card)).sort((a, b) => b - a);
            return values.length ? values[0] * 1.5 : 0;
          }
          if (button.link == "sha") {
            if (!player2.countCards("h", "sha")) {
              return get.effect(player2, { name: "wuzhong" }, player2, player2);
            }
            return get.effect(player2, { name: "wuzhong" }, player2, player2) / 3;
          }
        }).forResult();
      }
      if (result.bool) {
        event.result = {
          bool: true,
          cost_data: {
            links: result.links,
            targets: result?.targets || []
          }
        };
      }
    },
    async content(event, trigger, player) {
      const link = event.cost_data.links[0], targets = event.cost_data.targets;
      if (link == "sha" || link == "shan") {
        const card = get.cardPile((card2) => card2.name == link);
        if (card) {
          await player.gain({ cards: [card], animate: "draw" });
        } else {
          player.chat(`孩子们，一张${get.translation(link)}都没有力`);
        }
      }
      if (link == "discard" && targets.length) {
        player.line(targets);
        if (!targets[0].countDiscardableCards(player, "hej")) {
          return;
        }
        await player.discardPlayerCard(targets[0], "hej", true);
      }
      if (link == "use" && player.hasCard((card) => player.hasUseTarget(card, false, false), "hs")) {
        await player.chooseToUse({
          filterCard(card) {
            if (get.itemtype(card) != "card" || !["h", "s"].includes(get.position(card))) {
              return false;
            }
            return lib.filter.filterCard.apply(this, arguments);
          },
          filterTarget(card, player2, target) {
            return lib.filter.targetEnabled.apply(this, arguments);
          },
          prompt: "清蹈：使用一张手牌（无距离限制）",
          addCount: false,
          forced: true
        });
      }
    }
  },
  mbxiugeng: {
    audio: 4,
    logAudio: (index) => typeof index === "number" ? "mbxiugeng" + index + ".mp3" : 2,
    trigger: { player: "phaseBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), [1, 2]).set("ai", (target) => get.attitude(get.player(), target)).forResult();
    },
    async content(event, trigger, player) {
      player.line(event.targets);
      for (const target of event.targets.sortBySeat()) {
        target.removeSkill("mbxiugeng_effect");
        target.setStorage("mbxiugeng_effect", target.countCards("h"));
        target.addSkill("mbxiugeng_effect");
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        forced: true,
        popup: false,
        init(player, skill) {
          const storage = player.storage[skill];
          if (storage >= 0) {
            player.addTip(skill, `${get.translation(skill)} ${storage}`);
          }
        },
        onremove(player, skill) {
          delete player.storage[skill];
          player.removeTip(skill);
        },
        mark: true,
        intro: {
          content: "当前记录值为：#"
        },
        trigger: { player: "phaseDrawBegin" },
        async content(event, trigger, player) {
          const record = player.storage[event.name];
          if (typeof record === "number") {
            player.logSkill("mbxiugeng", null, null, null, [player.countCards("h") >= record ? 4 : 3]);
            const num = player.countCards("h");
            if (num <= record) {
              await player.draw({ num: 2, nodelay: true });
            }
            if (num >= record) {
              player.addSkill("mbxiugeng_handcard");
              player.addMark("mbxiugeng_handcard", 1, false);
            }
          }
          player.removeSkill(event.name);
        }
      },
      handcard: {
        markimage: "image/card/handcard.png",
        charlotte: true,
        onremove: true,
        intro: {
          content: "手牌上限+#"
        },
        mark: true,
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("mbxiugeng_handcard");
          }
        }
      }
    }
  },
  mbchenshe: {
    audio: 3,
    logAudio: (index) => typeof index === "number" ? "mbchenshe" + index + ".mp3" : 2,
    trigger: { global: "dying" },
    filter(event, player) {
      return event.player != player && lib.skill.mbchenshe.logTarget(event, player).length;
    },
    logTarget(event, player) {
      return [player, event.player, event.source].filter((target) => target?.isIn() && target?.hasDiscardableCards(player, "he"));
    },
    check(event, player) {
      const targets = lib.skill.mbchenshe.logTarget(event, player), target = event.player;
      if (get.attitude(player, target) > 0 || targets.length < 3) {
        return targets.reduce((sum, target2) => {
          return sum + get.effect(target2, { name: "guohe_copy2" }, player, player);
        }, 0) > 0;
      }
      return false;
    },
    async content(event, trigger, player) {
      const targets = lib.skill.mbchenshe.logTarget(trigger, player), cards2 = [];
      for (const target of targets) {
        let result;
        if (!target.hasDiscardableCards(player, "he")) {
          continue;
        }
        if (target == player) {
          result = await target.chooseToDiscard(`陈赦：请弃置一张牌`, "he", true).forResult();
        } else {
          result = await player.discardPlayerCard(`陈赦：请弃置${get.translation(target)}一张牌`, target, "he", true).forResult();
        }
        if (result?.cards) {
          cards2.addArray(result.cards);
        }
      }
      if (cards2.length == 3 && cards2.map((card) => get.suit(card, false)).unique().length == 1) {
        player.logSkill("mbchenshe", trigger.player, null, null, [3]);
        await trigger.player.recoverTo(trigger.player.maxHp);
        await player.removeSkills(event.name);
      }
    }
  },
  //手杀黄祖
  mbchizhang: {
    mod: {
      targetInRange(card, player, target) {
        if (get.is.damageCard(card)) {
          return true;
        }
      }
    },
    locked: false,
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return event.isFirstTarget && get.is.damageCard(event.card) && player.countDiscardableCards(player, "h") && player.hasHistory("lose", (evt) => {
        const evtx = evt.relatedEvent || evt.getParent();
        return evtx == event.getParent() && evt.hs?.length;
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard(get.prompt2(event.skill), [1, Infinity], "chooseonly").set("ai", (card) => {
        const suits = ui.selected.cards?.map((card2) => get.suit(card2, get.player())).unique();
        if (suits?.includes(get.suit(card, get.player()))) {
          return 0;
        }
        return 6 - get.value(card);
      }).forResult();
    },
    logTarget(event, player) {
      return game.filterPlayer((target) => target != player);
    },
    async content(event, trigger, player) {
      const cards2 = event.cards, colors = cards2.map((card) => get.color(card)).unique(), targets = game.filterPlayer((target) => target != player);
      await player.discard(cards2);
      targets.forEach((target) => target.addTempSkill(event.name + "_global"));
      trigger.card.storage ??= {};
      trigger.card.storage.mbchizhang = [targets, colors];
    },
    subSkill: {
      global: {
        charlotte: true,
        mod: {
          cardEnabled(card, player) {
            let evt = get.event();
            if (evt.name != "chooseToUse") {
              evt = evt.getParent("chooseToUse");
            }
            if (!evt?.respondTo || !evt.respondTo[1]?.storage?.mbchizhang) {
              return;
            }
            const color = get.color(card, player), colors = evt.respondTo[1].storage.mbchizhang[1], targets = evt.respondTo[1].storage.mbchizhang[0];
            if (color === "unsure" || !targets.includes(player)) {
              return;
            }
            if (colors.includes(color)) {
              return false;
            }
          },
          cardRespondable(card, player) {
            let evt = get.event();
            if (evt.name != "chooseToRespond") {
              evt = evt.getParent("chooseToRespond");
            }
            if (!evt?.respondTo || !evt.respondTo[1]?.storage?.mbchizhang) {
              return;
            }
            const color = get.color(card, player), colors = evt.respondTo[1].storage.mbchizhang[1], targets = evt.respondTo[1].storage.mbchizhang[0];
            if (color === "unsure" || !targets.includes(player)) {
              return;
            }
            if (colors.includes(color)) {
              return false;
            }
          }
        }
      }
    }
  },
  mbduanyang: {
    audio: 3,
    logAudio: (index) => typeof index === "number" ? "mbduanyang" + index + ".mp3" : 2,
    trigger: {
      player: "loseAfter",
      global: ["loseAsyncAfter", "equipAfter", "addJudgeAfter", "gainAfter", "addToExpansionAfter"]
    },
    usable: 1,
    filter(event, player) {
      if (event.getParent().name == "useCard") {
        return false;
      }
      return event.getl?.(player)?.hs?.some((card) => get.name(card, false) == "sha" && !get.owner(card));
    },
    async content(event, trigger, player) {
      const card = trigger.getl(player).hs.filter((card2) => get.name(card2, false) == "sha" && !get.owner(card2)).randomGet();
      await player.addToExpansion(card, "gain2").set("gaintag", ["mbduanyang"]);
    },
    intro: {
      markcount: "expansion",
      content: "expansion"
    },
    group: ["mbduanyang_damage", "mbduanyang_use"],
    subSkill: {
      use: {
        audio: ["mbduanyang1.mp3", "mbduanyang2.mp3"],
        charlotte: true,
        trigger: {
          global: "phaseAnyEnd"
        },
        filter(event, player) {
          return player.getExpansions("mbduanyang").length;
        },
        forced: true,
        async content(event, trigger, player) {
          for (const card of player.getExpansions("mbduanyang")) {
            if (!player.hasUseTarget(card, true, false)) {
              continue;
            }
            player.$gain2(card);
            const sha = get.autoViewAs(card, [card]);
            sha.storage.mbduanyang = true;
            await player.chooseUseTarget(sha, [card], true, false);
          }
          await player.loseToDiscardpile(player.getExpansions("mbduanyang"));
        }
      },
      damage: {
        popup: false,
        trigger: { source: "damageSource" },
        filter(event, player) {
          const target = event.player;
          return event.card?.storage?.mbduanyang && event.card?.name == "sha" && target.isIn() && target.countCards("hej", (card) => target.canRecast(card));
        },
        async cost(event, trigger, player) {
          const target = trigger.player;
          event.result = await player.choosePlayerCard(get.prompt2(event.skill, target), target, "hej", [1, 2], (card) => target.canRecast(card)).forResult();
        },
        logTarget: "player",
        async content(event, trigger, player) {
          const cards2 = event.cards, target = trigger.player;
          player.logSkill("mbduanyang", target, null, null, [3]);
          await target.recast(cards2);
          await player.draw(4);
        }
      }
    }
  },
  //手杀田丰
  mbganggeng: {
    audio: 4,
    logAudio: (index) => typeof index === "number" ? "mbganggeng" + index + ".mp3" : 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h") > 1;
    },
    filterCard: true,
    selectCard: [2, Infinity],
    filterTarget: lib.filter.notMe,
    lose: false,
    discard: false,
    delay: false,
    check(card) {
      if (get.player().countCards("h") < 3) {
        8 - get.value(card);
      }
      return 7 - get.value(card);
    },
    allowChooseAll: true,
    async content(event, trigger, player) {
      const cards2 = event.cards, target = event.targets[0];
      await player.give(cards2, target);
      player.addTempSkill(event.name + "_effect");
      player.markAuto(event.name + "_effect", [target]);
    },
    subSkill: {
      effect: {
        intro: {
          content: "players"
        },
        onremove: true,
        charlotte: true,
        forced: true,
        popup: false,
        trigger: { player: "phaseEnd" },
        filter(event, player) {
          return lib.skill.mbganggeng_effect.logTarget(event, player).length;
        },
        logTarget(event, player) {
          return player.getStorage("mbganggeng_effect").filter((target) => target.isIn()).sortBySeat();
        },
        async content(event, trigger, player) {
          const targets = lib.skill[event.name].logTarget(trigger, player);
          for (const target of targets) {
            player.logSkill("mbganggeng", [target], null, null, [target.isMaxHandcard() ? 3 : 4]);
            if (target.isMaxHandcard()) {
              await player.draw();
            } else {
              await player.discardPlayerCard(target, "hej", true);
            }
          }
        }
      }
    },
    ai: {
      order: 5,
      result: {
        target(player, target) {
          return 1;
        }
      }
    }
  },
  mbsijian: {
    audio: 2,
    trigger: {
      player: ["loseAfter", "dying"],
      global: ["loseAsyncAfter", "equipAfter", "addJudgeAfter", "gainAfter", "addToExpansionAfter"]
    },
    usable: 2,
    filter(event, player) {
      if (event.name == "dying") {
        return true;
      }
      return event.getl(player)?.hs?.length && !player.countCards("h");
    },
    async cost(event, trigger, player) {
      const count = player.getAllHistory("useSkill", (evt) => evt.skill == event.skill && evt.event.mbsijian_both).length;
      const result = await player.chooseButton([
        get.prompt(event.skill),
        [
          [
            ["discard", `令一名其他角色使用下一张牌时需弃置一张牌`],
            ["draw", `令当前回合角色摸两张牌`],
            ["both", `背水！执行以上所有选项，然后失去${count}点体力`]
          ],
          "textbutton"
        ]
      ]).set("filterButton", (button) => {
        const bool1 = game.hasPlayer((target) => target != get.player()), bool2 = _status.currentPhase?.isIn();
        if (button.link == "discard") {
          return bool1;
        }
        if (button.link == "draw") {
          return bool2;
        }
        if (button.link == "both") {
          return (bool1 || bool2) && !_status.dying.length;
        }
      }).set("ai", (button) => {
        if (button.link == "discard") {
          return 1;
        }
        const target = _status.currentPhase;
        if (target?.isIn() && get.attitude(get.player(), target) > 0) {
          if (button.link == "both") {
            return get.event().count > 1 ? 0 : 3;
          }
          return 2;
        }
        return 0;
      }).set("count", count).forResult();
      if (result?.links) {
        event.result = {
          bool: true,
          cost_data: result.links[0]
        };
      }
    },
    async content(event, trigger, player) {
      const link = event.cost_data;
      if (link != "draw" && game.hasPlayer((target) => target != player)) {
        const result = await player.chooseTarget(`死谏：令一名其他角色使用下一张牌时需弃置一张牌`, true, lib.filter.notMe).set("ai", (target) => {
          const has = target.hasSkill("mbsijian_handcard") ? 0 : 2;
          return -get.attitude(get.player(), target) * target.countCards("he") + has;
        }).forResult();
        if (result?.targets) {
          const target = result.targets[0];
          player.line(target);
          target.addSkill(event.name + "_discard");
          target.addMark(event.name + "_discard", 1, false);
        }
      }
      if (link != "discard" && _status.currentPhase?.isIn()) {
        await _status.currentPhase.draw(2);
      }
      if (link == "both") {
        const num = player.getAllHistory("useSkill", (evt) => evt.skill == event.name && evt.event.mbsijian_both).length;
        await player.loseHp(num);
        event.getParent().set("mbsijian_both", true);
      }
    },
    group: "mbsijian_die",
    subSkill: {
      die: {
        silent: true,
        popup: false,
        forceDie: true,
        trigger: { player: "die" },
        async content(event, trigger, player) {
          game.countPlayer((current) => current.removeSkill("mbsijian_discard"));
        }
      },
      discard: {
        trigger: { player: "useCard1" },
        charlotte: true,
        onremove: true,
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const num = player.countMark(event.name);
          player.removeSkill(event.name);
          if (num > 0 && player.hasDiscardableCards(player, "he")) {
            await player.chooseToDiscard({
              prompt: `死谏：请弃置${get.cnNumber(num)}张牌`,
              position: "he",
              forced: true,
              selectCard: num
            });
          }
        },
        intro: { content: "下次使用牌时弃置#张牌" }
      }
    }
  },
  //手杀陆郁生
  mbrunwei: {
    audio: 4,
    logAudio: (index) => typeof index === "number" ? "mbrunwei" + index + ".mp3" : 2,
    enable: "phaseUse",
    usable: 1,
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog(get.prompt2("mbrunwei"));
      },
      chooseControl(event, player) {
        return [1, 2, 3, 4, 5, "cancel2"];
      },
      check() {
        return 4;
      },
      backup(result, player) {
        return {
          num: result.control,
          log: false,
          delay: false,
          async content(event, trigger, player2) {
            const num = lib.skill.mbrunwei_backup.num, skill = "mbrunwei";
            const cards2 = get.cards(num, true);
            player2.logSkill("mbrunwei", null, null, null, [get.rand(1, 2)]);
            await player2.showCards(cards2, `${get.translation(player2)}发动了【${get.translation(skill)}】`);
            const used = player2.hasSkill(skill + "_twice");
            if (used && !game.hasPlayer((target) => {
              return !target.hasHistory("gain", (evt) => evt.cards?.length);
            })) {
              return;
            }
            const list = get.addNewRowList(cards2, "color");
            const result2 = await player2.chooseButtonTarget({
              createDialog: [
                [
                  [[`润微：选择一名角色令其获得其中一种颜色的牌`], "addNewRow"],
                  [
                    (dialog) => {
                      dialog.forcebutton = false;
                      dialog._scrollset = false;
                      dialog.css({
                        top: "20%"
                      });
                    },
                    "handle"
                  ],
                  list.map((item) => [Array.isArray(item) ? item : [item], "addNewRow"])
                ]
              ],
              forced: true,
              used,
              targetsx: game.filterPlayer((target) => !target.hasHistory("gain", (evt) => evt.cards?.length)),
              filterButton(button) {
                return button.links.length;
              },
              filterTarget(card, player3, target) {
                if (get.event().used) {
                  return get.event().targetsx?.includes(target);
                }
                return true;
              },
              ai1(button) {
                return button.links.length;
              },
              ai2(target) {
                const player3 = get.player();
                if (!get.event().used && player3 == target) {
                  return 114514;
                }
                return get.attitude(player3, target);
              }
            }).forResult();
            if (result2?.links?.length && result2?.targets.length) {
              const target = result2.targets[0], gain = cards2.filter((card) => get.color(card, false) == result2.links[0]);
              player2.line(target);
              if (!player2.hasSkill(skill + "_twice")) {
                player2.addTempSkill(skill + "_twice", "phaseChange");
                player2.addMark(skill + "_twice", gain.length, false);
                player2.addTip(skill + "_twice", `润微  ${gain.length}`);
              }
              let gaintag = [];
              if (player2 == target) {
                gaintag = ["mbrunwei"];
                player2.when({ player: "phaseUseEnd" }).filter((evt) => event.getParent("phaseUse") == evt).step(async () => {
                  const cards3 = player2.getCards("h", (card) => card.hasGaintag("mbrunwei"));
                  if (cards3.length) {
                    player2.logSkill("mbrunwei", null, null, null, [4]);
                    await player2.modedDiscard(cards3, player2);
                  }
                });
              }
              const next = target.gain(gain, "gain2");
              next.gaintag.addArray(gaintag);
              await next;
            }
          }
        };
      }
    },
    ai: {
      order: 10,
      result: {
        player(player) {
          const used = player.hasSkill("mbrunwei_twice");
          if (!used) {
            return 1;
          } else if (game.hasPlayer((target) => {
            return !target.hasHistory("gain", (evt) => evt.cards.length) && get.attitude(player, target) > 0;
          })) {
            return 1;
          }
          return 0;
        }
      }
    },
    subSkill: {
      twice: {
        onremove(player, skill) {
          delete player.storage[skill];
          player.removeTip(skill);
        },
        intro: {
          markcount: "mark",
          content: "再失去#张牌重置技能"
        },
        trigger: {
          player: "loseAfter",
          global: ["loseAsyncAfter", "equipAfter", "gainAfter", "addToExpansionAfter", "addJudgeAfter"]
        },
        filter(event, player) {
          if (!event.getl?.(player)?.cards2?.length || !player.hasMark("mbrunwei_twice")) {
            return false;
          }
          const evt2 = event.relatedEvent || event.getParent();
          if (evt2.name === "useCard" && evt2.player === player && get.type(evt2.card, null, false) === "equip") {
            return false;
          }
          return true;
        },
        silent: true,
        async content(event, trigger, player) {
          const num = trigger.getl(player)?.cards2?.length;
          if (num >= player.countMark(event.name)) {
            player.logSkill("mbrunwei", null, null, null, [3]);
            const info = get.info(event.name);
            if (typeof info.onremove === "function") {
              info.onremove(player, event.name);
            }
            player.unmarkSkill(event.name);
            delete player.getStat().skill.mbrunwei;
            game.log(player, "重置了", `#g【${get.translation(event.name)}】`);
          } else {
            player.removeMark(event.name, num, false);
            player.addTip(event.name, `润微  ${player.countMark(event.name)}`);
          }
        }
      }
    }
  },
  mbshuanghuai: {
    audio: 3,
    logAudio: (index) => typeof index === "number" ? "mbshuanghuai" + index + ".mp3" : 3,
    init(player, skill) {
      const history = player.getAllHistory("useSkill", (evt) => evt.skill == skill && evt.targets);
      if (history.length) {
        const target = history[history.length - 1].targets[0];
        if (target) {
          player.storage[skill] = target;
          player.markSkill(skill);
          player.addTip(skill, `霜怀 ${get.translation(target)}`);
        }
      }
    },
    onremove(player, skill) {
      delete player.storage[skill];
      player.removeTip(skill);
    },
    trigger: { global: "damageBegin4" },
    usable: 1,
    filter(event, player) {
      return get.distance(event.player, player) <= 1;
    },
    popup: false,
    logTarget: "player",
    async cost(event, trigger, player) {
      const result = await player.chooseButton([
        get.prompt2(event.skill, trigger.player),
        [
          [
            ["cancel", `防止此伤害`],
            ["tao", `令其从弃牌堆获得一张【桃】`]
          ],
          "textbutton"
        ]
      ]).set("filterButton", (button) => {
        return get.event().links.includes(button.link);
      }).set(
        "links",
        ["cancel", "tao"].filter((link) => {
          if (link == "tao") {
            const card = get.discardPile((cardx) => cardx.name == "tao");
            if (!card) {
              return false;
            }
          }
          return true;
        })
      ).set("ai", (button) => {
        const trigger2 = get.event().getTrigger(), eff = get.damageEffect(trigger2.player, trigger2.source, get.player());
        if (eff > 0) {
          return 0;
        }
        if (trigger2.player.hasSkillTag("maixie") && trigger2.num === 1 && button.link == "tao") {
          return 1 + Math.random();
        }
        return Math.random();
      }).forResult();
      if (result.bool) {
        event.result = {
          bool: true,
          cost_data: result.links[0]
        };
      }
    },
    async content(event, trigger, player) {
      const link = event.cost_data, target = trigger.player, last = player.storage[event.name];
      player.logSkill("mbshuanghuai", target, null, null, [link == "cancel" ? 1 : 2]);
      if (link == "cancel") {
        trigger.cancel();
      } else {
        const card = get.discardPile("tao");
        if (card) {
          await target.gain(card, "gain2");
        }
      }
      if (last && last == target) {
        await game.asyncDraw([player, target]);
        return;
      }
      if (last && last != target) {
        player.logSkill("mbshuanghuai", null, null, null, [3]);
        await player.loseHp();
      }
      player.storage[event.name] = target;
      player.markSkill(event.name);
      player.addTip(event.name, `霜怀 ${get.translation(target)}`);
    },
    intro: {
      content: "player",
      markcount: () => 0
    }
  },
  //势陈到
  potwanglie: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return player.countCards("h");
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard(get.prompt2(event.skill), "h").set("ai", (card) => {
        const player2 = get.player();
        if (player2.hasValueTarget(card, true)) {
          return player2.getUseValue(card, false, true) * (get.tag(card, "damage") && get.type(card) != "delay" ? 2 : 1);
        }
        return 0.1 + Math.random();
      }).forResult();
    },
    async content(event, trigger, player) {
      const card = event.cards[0];
      player.addGaintag(card, "potwanglie");
      player.addTempSkill(event.name + "_effect", "phaseUseAfter");
      await game.delayx();
    },
    locked: false,
    mod: {
      aiOrder(player, card, num) {
        if (!player.isPhaseUsing() || typeof card !== "object" || num <= 0) {
          return;
        }
        if (get.itemtype(card) == "card" && card.hasGaintag("potwanglie")) ;
        return num;
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove(player) {
          player.removeGaintag("potwanglie");
        },
        mod: {
          targetInRange(card, player, target) {
            if (card.cards?.some((cardx) => cardx.hasGaintag("potwanglie"))) {
              return true;
            }
          }
        },
        audio: "potwanglie",
        trigger: { player: ["useCard", "useCardAfter"] },
        filter(event, player) {
          return player.hasHistory("lose", (evt) => {
            const evtx = evt.relatedEvent || evt.getParent();
            if (event !== evtx) {
              return false;
            }
            return Object.values(evt.gaintag_map).flat().includes("potwanglie");
          });
        },
        silent: true,
        async content(event, trigger, player) {
          if (event.triggername == "useCard") {
            player.logSkill(event.name);
            if (Array.isArray(trigger.directHit)) {
              trigger.directHit.addArray(game.players);
            }
            game.log(trigger.card, "不可被响应");
          } else {
            player.addTempSkill("potwanglie_debuff", "phaseUseAfter");
          }
        },
        ai: {
          directHit_ai: true,
          skillTagFilter(player, tag, arg) {
            if (arg?.card?.cards?.some((card) => card.hasGaintag("potwanglie"))) {
              return true;
            }
          }
        }
      },
      debuff: {
        mark: true,
        charlotte: true,
        intro: { content: "本阶段不能对其他角色使用牌" },
        mod: {
          playerEnabled(card, player, target) {
            if (player !== target) {
              return false;
            }
          }
        }
      }
    }
  },
  pothongyi: {
    audio: 4,
    locked: true,
    popup: false,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return player.hasMark("pothongyi");
    },
    //提前若为
    maxMark() {
      return 5;
    },
    logAudio: (index) => typeof index === "number" ? "pothongyi" + index + ".mp3" : 2,
    async cost(event, trigger, player) {
      const num = player.countMark("pothongyi");
      let list = [`摸${get.cnNumber(num)}张牌`, `移去所有“毅”标记`];
      const result = await player.chooseControl().set("prompt", get.translation(event.skill) + "：请选择一项执行，并于结束阶段执行另一项").set("choiceList", list).set("num", num).set("ai", () => {
        return 1;
      }).forResult();
      event.result = { bool: true, cost_data: result.index };
    },
    async content(event, trigger, player) {
      player.logSkill("pothongyi", null, null, null, [get.rand(3, 4)]);
      const control = event.cost_data;
      const num = player.countMark("pothongyi");
      if (!num) {
        return;
      }
      if (control == 0) {
        player.draw({ num });
      } else if (control == 1) {
        player.clearMark("pothongyi");
      }
      player.when({ player: "phaseJieshuBegin" }).filter((evt) => evt.getParent("phase") == trigger.getParent("phase")).step(async (event2, trigger2, player2) => {
        if (control == 1) {
          await player2.draw({ num });
        } else if (control == 0) {
          player2.clearMark("pothongyi");
        }
      });
    },
    marktext: "毅",
    intro: {
      name2: "毅",
      content: "mark"
    },
    group: "pothongyi_mark",
    subSkill: {
      mark: {
        audio: ["pothongyi1.mp3", "pothongyi2.mp3"],
        trigger: {
          global: "phaseBefore",
          source: "damageSource",
          player: ["enterGame", "damageEnd"]
        },
        //getIndex: event => (event.name === "damage" ? event.num : 1),
        filter(event, player) {
          if (player.countMark("pothongyi") >= get.info("pothongyi").maxMark()) {
            return false;
          }
          return event.name != "phase" || game.phaseNumber == 0;
        },
        forced: true,
        async content(event, trigger, player) {
          const num = get.info("pothongyi").maxMark() - player.countMark("pothongyi");
          player.addMark("pothongyi", Math.min(trigger.name === "damage" ? trigger.num : 3, num));
        }
      }
    }
  },
  //手杀杨弘
  //用同一张牌拼点神将
  mbjianji: {
    audio: 3,
    logAudio: (index) => typeof index === "number" ? "mbjianji" + index + ".mp3" : "mbjianji" + get.rand(2, 3) + ".mp3",
    enable: "phaseUse",
    usable: 1,
    filter: (event, player) => player.hasCard(true, "h"),
    filterTarget(card, player, target) {
      if (ui.selected.targets.length) {
        return ui.selected.targets[0].canCompare(target) && !ui.selected.targets[0].hasSkillTag("noCompareSource") && !target.hasSkillTag("noCompareTarget");
      }
      return game.hasPlayer((current) => target.canCompare(current));
    },
    targetprompt: ["发起者", "拼点目标"],
    filterCard: true,
    discard: false,
    lose: false,
    delay: false,
    check(card) {
      if (get.player().getHp() == 1) {
        return 8 - get.value(card);
      }
      if (get.name(card, get.player()) == "sha") {
        return 7 - get.value(card);
      }
      return 6 - get.value(card);
    },
    selectTarget: 2,
    multitarget: true,
    multiline: true,
    complexTarget: true,
    complexSelect: true,
    async content(event, trigger, player) {
      const target1 = event.targets[0], target2 = event.targets[1], card = event.cards[0];
      player.addGaintag(card, "mbjianji");
      player.addTempSkill(event.name + "_put");
      event.targets.forEach((target) => target.addTempSkill(event.name + "_fake"));
      const result = await target1.chooseToCompare(target2, function(card2) {
        if (typeof card2 == "string" && lib.skill[card2]) {
          var ais = lib.skill[card2].check || function() {
            return 0;
          };
          return ais();
        }
        var addi = get.value(card2) >= 8 && get.type(card2) != "equip" ? -3 : 0;
        if (card2.name == "du") {
          addi -= 3;
        }
        var source = _status.event.source;
        var player2 = _status.event.player;
        var event2 = _status.event.getParent();
        var getn = function(card3) {
          if (card3.hasGaintag("mbjianji")) {
            if (!player2.hasCard(function(card4) {
              var val = get.value(card4);
              return val < 0 || val <= 5 && get.number(card4) >= 10;
            }, "h")) {
              return 10 + Math.random() * 3;
            }
          }
          if (player2.hasSkillTag("forceWin", null, { card: card3 })) {
            return 13 * (event2.small ? -1 : 1);
          }
          return get.number(card3) * (event2.small ? -1 : 1);
        };
        if (source && source != player2) {
          if (get.attitude(player2, source) > 1) {
            if (event2.small) {
              return getn(card2) - get.value(card2) / 3 + addi;
            }
            return -getn(card2) - get.value(card2) / 3 + addi;
          }
          if (event2.small) {
            return -getn(card2) - get.value(card2) / 5 + addi;
          }
          return getn(card2) - get.value(card2) / 5 + addi;
        } else {
          if (event2.small) {
            return -getn(card2) - get.value(card2) / 5 + addi;
          }
          return getn(card2) - get.value(card2) / 5 + addi;
        }
      }).set("mbjianji", true).set("mbjianji_card", card).set("position", "hs").set("filterCard", function(card2) {
        if (get.position(card2) == "s") {
          return card2.hasGaintag("mbjianji");
        }
        return true;
      }).forResult();
      const sha = async function sha2(target, victim) {
        if (!target.canUse({ name: "sha", isCard: true }, victim, false, false)) {
          return;
        }
        await target.useCard({ name: "sha", isCard: true }, victim).set("addCount", false);
      };
      player.removeGaintag("mbjianji");
      if (result.bool) {
        await sha(target1, target2);
      } else if (!result.tie) {
        await sha(target2, target1);
      }
      if (get.name(event.cards[0], player) === "sha") {
        let targets = [
          [target1, result.player],
          [target2, result.target]
        ].filter((list) => {
          if (list[1] == card) {
            return true;
          }
        }).map((list) => list[0]).sortBySeat();
        if (targets.length) {
          for (const target of targets) {
            await target.chat("我也干了");
          }
          await game.delayx();
          player.logSkill("mbjianji", [targets], null, null, [1]);
          for (const target of targets) {
            await target.damage();
          }
        }
      }
    },
    subSkill: {
      fake: {
        charlotte: true,
        trigger: {
          global: ["chooseCardOLBegin", "chooseCardOLEnd"]
        },
        filter(event, player) {
          return event.type == "compare" && event.getParent().mbjianji;
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          const evt = trigger.getParent(2);
          const card = evt.cards[0];
          if (!card) {
            return;
          }
          if (event.triggername == "chooseCardOLBegin") {
            const cardx = game.createFakeCards(card, true, "mbjianji_card")[0];
            player.directgains([cardx], null, "mbjianji");
          } else {
            const cards2 = player.getCards("s", (card2) => card2.hasGaintag("mbjianji"));
            game.deleteFakeCards(cards2);
            if (!trigger.result[trigger.list.indexOf(player)].skill) {
              if (trigger.result[trigger.list.indexOf(player)].cards[0]._cardid === card.cardid) {
                trigger.result[trigger.list.indexOf(player)].cards = [card];
              }
            }
          }
        }
      },
      put: {
        charlotte: true,
        trigger: { global: "compareCardShowBefore" },
        filter(event, player) {
          if (!event?.mbjianji) {
            return false;
          }
          const evt = event.getParent();
          if (!(evt?.name === "mbjianji" && evt.player === player)) {
            return false;
          }
          return [event.card1, event.card2].includes(evt.cards[0]);
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          const card = trigger.getParent().cards[0];
          if (get.position(card) !== "o") {
            const owner = get.owner(card);
            if (owner) {
              await owner.lose([card], ui.ordering, false).set("log", false);
            } else {
              await game.cardsGotoOrdering([card]);
            }
          }
        }
      }
    },
    ai: {
      expose: 0.4,
      order: 4,
      result: {
        target(player, target) {
          if (ui.selected.targets.length) {
            return -1;
          }
          return -0.5;
        }
      }
    }
  },
  mbyuanmo: {
    audio: 3,
    trigger: { player: ["phaseZhunbeiBegin", "damageEnd"] },
    filter: (event, player) => player.canMoveCard(),
    logAudio: (index) => typeof index === "number" ? "mbyuanmo" + index + ".mp3" : 1,
    async cost(event, trigger, player) {
      let nums = {};
      game.filterPlayer().forEach((target) => nums[target.playerid] = game.countPlayer((c) => c.inRangeOf(target)));
      event.result = await player.moveCard(get.prompt2(event.skill)).set("logSkill", [event.skill, null, null, null, [get.rand(2, 3)]]).forResult();
      event.result.cost_data = nums;
    },
    usable: 2,
    popup: false,
    async content(event, trigger, player) {
      const drawer = event.targets[0];
      const num = event.cost_data[drawer.playerid] - game.countPlayer((c) => c.inRangeOf(drawer));
      if (num > 0) {
        const result = await player.chooseBool("远谟", `是否令${get.translation(drawer)}摸${get.cnNumber(num)}张牌？`).set("choice", get.effect(drawer, { name: "draw" }, player, player) > 0).forResult();
        if (result?.bool) {
          player.logSkill("mbyuanmo", [drawer], null, null, [1]);
          await drawer.draw(Math.min(5, num));
        }
      }
    }
  },
  //夏侯尚
  mbtanfeng: {
    audio: "twtanfeng",
    trigger: { player: "phaseZhunbeiBegin" },
    async cost(event, trigger, player) {
      const result = await player.chooseButton([
        get.prompt(event.skill),
        [
          [
            ["discard", "弃置一名角色至多两张牌，然后若其手牌数小于等于你,你跳过摸牌阶段"],
            ["damage", "对一名角色造成1点火焰伤害，然后若其体力值小于等于你，你跳过出牌阶段。"]
          ],
          "textbutton"
        ]
      ]).set("filterButton", (button) => !(button.link === "discard" && !game.hasPlayer((c) => c.countDiscardableCards(get.player(), "he")))).set("ai", (button) => {
        const player2 = get.player();
        if (button.link === "discard") {
          if (!game.hasPlayer((target) => {
            return target.countCards("he") - 2 > player2.countCards("he") && get.effect(target, { name: "guohe_copy2" }, player2);
          })) {
            return 0;
          }
          return 1;
        } else if (button.link === "damage") {
          if (!game.hasPlayer((target) => target.getHp() - 1 > player2.getHp() && get.damageEffect(target, player2, player2, "fire"))) {
            return 0;
          }
          return 1;
        }
      }).set("selectButton", [1, 2]).forResult();
      event.result = {
        bool: result.bool,
        cost_data: result.links
      };
    },
    async content(event, trigger, player) {
      const choices = event.cost_data;
      if (choices.includes("discard") && game.hasPlayer((c) => c.countDiscardableCards(player, "he"))) {
        const result = await player.chooseTarget("探锋：弃置一名角色至多两张牌", true, (card, player2, target) => {
          return target.countDiscardableCards(player2, "he");
        }).set("ai", (target) => {
          return get.effect(target, { name: "guohe_copy2" }, get.player());
        }).forResult();
        player.line(result.targets);
        await player.discardPlayerCard(result.targets[0], true, "he", [1, 2]);
        if (result.targets[0].countCards("h") <= player.countCards("h")) {
          player.skip("phaseDraw");
        }
      }
      if (choices.includes("damage")) {
        const result = await player.chooseTarget("探锋：对一名角色造成1点火焰伤害", true).set("ai", (target) => {
          const player2 = get.player();
          return get.damageEffect(target, player2, player2, "fire");
        }).forResult();
        player.line(result.targets);
        await result.targets[0].damage("fire");
        if (result.targets[0].getHp() <= player.getHp()) {
          player.skip("phaseUse");
        }
      }
    }
  },
  //孙韶
  mbganjue: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("e") > 0;
    },
    filterCard: true,
    position: "e",
    viewAs: {
      name: "sha",
      storage: { mbganjue: true }
    },
    viewAsFilter(player) {
      if (!player.countCards("e")) {
        return false;
      }
    },
    prompt: "将装备区的一张牌当【杀】使用或打出",
    check(card) {
      return 6 - get.value(card);
    },
    async precontent(event, trigger, player) {
      event.getParent().addCount = false;
      event.result._apply_args = {
        oncard: (card, currentPlayer) => {
          const evt = get.event();
          evt.directHit.addArray(
            evt.targets.filter((target) => {
              return !target.hasCard((cardx) => get.suit(cardx, target) == get.suit(card), "h");
            })
          );
        }
      };
    },
    ai: {
      order(item, player) {
        return get.order({ name: "sha" }, player) - 0.2;
      },
      result: { player: 1 }
    },
    locked: false,
    mod: {
      cardUsable(card, player) {
        if (card?.storage?.mbganjue) {
          return Infinity;
        }
      },
      targetInRange(card, player, target) {
        if (card?.storage?.mbganjue) {
          return true;
        }
      }
    }
  },
  mbzhuji: {
    audio: 4,
    trigger: { player: "phaseUseEnd" },
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    logAudio: (index) => typeof index === "number" ? "mbzhuji" + index + ".mp3" : 2,
    popup: false,
    async cost(event, trigger, player) {
      const list = get.addNewRowList(player.getCards("h"), "suit", player);
      const result = await player.chooseButton([
        [
          [[`${get.translation(event.skill)}：请选择一个花色的牌`], "addNewRow"],
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
      ]).set("filterButton", (button) => {
        const player2 = get.player();
        if (!button.links.length || button.links.some((card) => !lib.filter.cardDiscardable(card, player2, get.event().getParent().name))) {
          return false;
        }
        return true;
      }).set("ai", (button) => {
        const player2 = get.player();
        const es = player2.countCards("e");
        if (!es) {
          return 4 - button.links.length;
        }
        if (button.links.length > es && button.links.length <= 3) {
          return 5 - button.links.length;
        }
        return 0;
      }).forResult();
      if (result?.bool && result?.links?.length) {
        event.result = {
          bool: result?.bool,
          cost_data: result?.links,
          cards: player.getCards("h").filter((card) => result?.links?.includes(get.suit(card, player)))
        };
      }
    },
    async content(event, trigger, player) {
      const cards2 = event.cards;
      const suit = get.suit(cards2[0], player);
      const es = player.countCards("e");
      const next = player.modedDiscard(cards2);
      await next;
      const card = get.cardPile2((card2) => get.type(card2) == "equip" && get.suit(card2) == suit);
      if (!card) {
        player.chat(`孩子们，牌堆没有${get.translation(suit)}装备牌了`);
        return;
      }
      await player.gain(card, "draw");
      if (player.hasCard((cardx) => cardx == card, "h")) {
        await player.chooseUseTarget(card, true);
      }
      const num = next.cards.length;
      player.logSkill("mbzhuji", null, null, null, [num >= es ? get.rand(1, 2) : get.rand(3, 4)]);
      if (num >= es) {
        const result = await player.chooseButton(
          [
            "筑墼：选择一项执行",
            [
              [
                ["draw", "摸两张牌"],
                ["recover", "回复1点体力"],
                ["hujia", "获得1点护甲"]
              ],
              "textbutton"
            ]
          ],
          true
        ).set("filterButton", (button) => {
          const player2 = get.player();
          if (button.link == "recover") {
            return player2.isDamaged();
          }
          if (button.link == "hujia") {
            return player2.hujia < 5;
          }
          return true;
        }).set("ai", (button) => {
          if (button.link == "recover") {
            return get.recoverEffect(player, player, player) > 0 ? 1 : 0;
          }
          return Math.random();
        }).forResult();
        if (!result?.bool || !result.links?.length) {
          return;
        }
        switch (result.links[0]) {
          case "draw": {
            await player.draw(2);
            break;
          }
          case "recover": {
            await player.recover();
            break;
          }
          case "hujia": {
            await player.changeHujia(1, null, true);
            break;
          }
        }
      }
    }
  },
  //庞羲
  mbxuye: {
    audio: 3,
    trigger: { global: "damageEnd" },
    filter(event, player) {
      return event.player.isMinHandcard() && event.player.isAlive();
    },
    usable: 1,
    logTarget: "player",
    check(event, player) {
      return get.attitude(player, event.player) > 0;
    },
    logAudio: (index) => "mbxuye" + (typeof index === "number" ? index : [1, 3].randomGet()) + ".mp3",
    async content(event, trigger, player) {
      const target = event.targets[0];
      const isMax = target.isMaxHandcard();
      await target.draw(2);
      if (!isMax && target.isMaxHandcard() && target.countCards("hej") > 0) {
        player.logSkill("mbxuye", target, null, null, [2]);
        const result = await player.choosePlayerCard(`蓄业：将${get.translation(target)}场上一张牌置于牌堆顶`, target, "hej", true).forResult();
        const card = result.cards[0];
        target.$throw(card, 1e3);
        game.log(player, "将", card, "置于牌堆顶");
        await target.lose(card, ui.cardPile, "insert");
        game.updateRoundNumber();
      }
    },
    ai: { expose: 0.2 }
  },
  mbkuangxiang: {
    audio: 3,
    enable: "phaseUse",
    filter(event, player) {
      return game.hasPlayer((target) => {
        return target != player && target.countCards("h") <= player.countCards("h");
      });
    },
    filterTarget(card, player, target) {
      return target != player && target.countCards("h") <= player.countCards("h");
    },
    usable: 1,
    logAudio: (index) => "mbkuangxiang" + [1, 3].randomGet() + ".mp3",
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.addTempSkill("mbkuangxiang_effect", { player: "phaseUseBegin" });
      player.markAuto("mbkuangxiang_effect", [player, target]);
      await player.swapHandcards(target);
    },
    derivation: "mbxuye",
    //ai待补充
    ai: {
      order: 6,
      result: {
        target(player, target) {
          const hs1 = player.getCards("h"), hs2 = target.getCards("h");
          return get.value(hs1, player) - get.value(hs2, target);
        }
      }
    },
    group: ["mbkuangxiang_mark"],
    subSkill: {
      //给交换的牌上标记
      mark: {
        charlotte: true,
        trigger: { global: "loseAsyncBegin" },
        filter(event, player) {
          return event.getParent(2).name == "mbkuangxiang" && event.getParent(2).player == player;
        },
        silent: true,
        firstDo: true,
        async content(event, trigger, player) {
          game.broadcastAll((player2) => {
            lib.translate["mbkuangxiang_" + player2.playerid] = "匡襄";
          }, player);
          trigger.set("gaintag", ["mbkuangxiang_" + player.playerid]);
        }
      },
      effect: {
        charlotte: true,
        onremove(player, skill) {
          game.filterPlayer((target) => {
            return player.storage[skill].includes(target);
          }).forEach((target) => target.removeGaintag("mbkuangxiang_" + player.playerid));
          delete player.storage[skill];
        },
        intro: { content: "players" },
        audio: "mbkuangxiang2.mp3",
        trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
        getIndex(event, player) {
          return game.filterPlayer2((target) => {
            if (!player.getStorage("mbkuangxiang_effect").includes(target)) {
              return false;
            }
            let evt = event.getl(target);
            if (!evt?.hs?.length) {
              return false;
            }
            if (event.name == "lose") {
              return Object.values(event.gaintag_map).flat().includes("mbkuangxiang_" + player.playerid);
            }
            return target.hasHistory("lose", (evtx) => {
              return evtx.getParent() == event && evtx.hs.length && Object.values(evtx.gaintag_map).flat().includes("mbkuangxiang_" + player.playerid);
            });
          }).sortBySeat();
        },
        check: () => true,
        prompt2: "你执行一次〖蓄业〗的效果：摸两张牌，然后若手牌数因此成为全场最多，你将场上的一张牌置于牌堆顶。",
        filter(event, player, triggername, target) {
          return !target.hasCard((card) => card.hasGaintag("mbkuangxiang_" + player.playerid), "h");
        },
        async content(event, trigger, player) {
          var next = game.createEvent("mbkuangxiang_xuye");
          next.set("player", player);
          next.set("targets", [player]);
          next.setContent(lib.skill.mbxuye.content);
        }
      }
    }
  },
  //势娄圭
  potguansha: {
    limited: true,
    audio: 2,
    trigger: { player: "phaseUseEnd" },
    filter(event, player) {
      return player.hasCards("he");
    },
    check(event, player) {
      return player.getCards("he").reduce((sum, card) => sum + get.info("zhiheng").check(card), 0) > 0;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const cards2 = player.getCards("he");
      await player.loseToDiscardpile({ cards: cards2 });
      let gains = [];
      while (gains.length < cards2.length) {
        const card = get.cardPile2((card2) => get.type(card2) === "basic" && !gains.includes(card2));
        if (card) {
          gains.push(card);
        } else {
          break;
        }
      }
      if (gains.length) {
        await player.gain({ cards: gains, animate: "gain2" });
        player.addTempSkill("potguansha_hand");
        player.addMark("potguansha_hand", gains.map((card) => card.name).unique().length, false);
      }
    },
    subSkill: {
      hand: {
        charlotte: true,
        onremove: true,
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("potguansha_hand");
          }
        },
        intro: { content: "手牌上限+#" }
      }
    }
  },
  potjiyu: {
    audio: 3,
    enable: "phaseUse",
    filter(event, player) {
      return player.hasCard((card) => lib.filter.cardDiscardable(card, player), "h");
    },
    filterCard: lib.filter.cardDiscardable,
    check(card) {
      return 8 - get.value(card);
    },
    prompt() {
      return lib.translate["potjiyu_info"].split("②")[0].slice(1);
    },
    usable: 1,
    async content(event, trigger, player) {
      let gains = [];
      let types = [get.type2(event.cards[0])];
      while (true) {
        const card = get.cardPile2((card2) => !types.includes(get.type2(card2)));
        if (card) {
          gains.push(card);
          types.push(get.type2(card));
        } else {
          break;
        }
      }
      if (gains.length) {
        player.addTempSkill("potjiyu_effect", ["phaseBefore", "phaseChange", "phaseAfter", ...lib.phaseName.map((i) => i + "After")]);
        await player.gain({
          cards: gains,
          animate: "gain2",
          gaintag: ["potjiyu_effect"]
        });
      }
    },
    ai: {
      order: 10,
      result: { player: 1 }
    },
    group: "potjiyu_refresh",
    subSkill: {
      effect: {
        charlotte: true,
        onremove(player, skill) {
          player.removeGaintag(skill);
          if (typeof player.storage?.counttrigger?.["potjiyu_refresh"] === "number") {
            delete player.storage.counttrigger["potjiyu_refresh"];
          }
        }
      },
      refresh: {
        audio: "potjiyu",
        trigger: {
          player: "loseAfter",
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          if (player.hasCard((card) => card.hasGaintag("potjiyu_effect"), "h") || typeof player.getStat("skill")?.["potjiyu"] !== "number") {
            return false;
          }
          const evt = event.getl(player);
          if (!evt?.hs?.length) {
            return false;
          }
          if (event.name === "lose") {
            return Object.values(event.gaintag_map).flat().includes("potjiyu_effect");
          }
          return player.hasHistory("lose", (evt2) => {
            if (event !== evt2.getParent()) {
              return false;
            }
            return Object.values(evt2.gaintag_map).flat().includes("potjiyu_effect");
          });
        },
        usable: 2,
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          delete player.getStat("skill")["potjiyu"];
          player.popup("potjiyu");
          game.log(player, "重置了技能", "#g【" + get.translation("potjiyu") + "】");
        }
      }
    }
  },
  //势于吉
  potdaozhuan: {
    audio: 4,
    enable: "chooseToUse",
    logAudio: (index) => typeof index === "number" ? "potdaozhuan" + index + ".mp3" : 2,
    filter(event, player) {
      if (event.potdaozhuan) {
        return false;
      }
      let num = player.countCards("he");
      if (_status.currentPhase?.isIn() && _status.currentPhase !== player) {
        num += _status.currentPhase.countCards("he");
      }
      if (num <= 0) {
        return false;
      }
      return get.inpileVCardList((info) => {
        const name = info[2];
        if (get.type(name) !== "basic") {
          return false;
        }
        return !player.getStorage("potdaozhuan_used").includes(name);
      }).some((card) => event.filterCard(new lib.element.VCard({ name: card[2], nature: card[3], isCard: true }), player, event));
    },
    usable: 1,
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("道转", [get.inpileVCardList((info) => get.type(info[2]) === "basic"), "vcard"]);
      },
      filter(button, player) {
        const event = get.event().getParent();
        if (player.getStorage("potdaozhuan_used").includes(button.link[2])) {
          return false;
        }
        return event.filterCard(new lib.element.VCard({ name: button.link[2], nature: button.link[3], isCard: true }), player, event);
      },
      check(button) {
        const event = get.event().getParent();
        if (event.type !== "phase") {
          return 1;
        }
        return get.player().getUseValue(new lib.element.VCard({ name: button.link[2], nature: button.link[3], isCard: true }));
      },
      prompt(links, player) {
        let prompt = "将你";
        if (_status.currentPhase?.isIn() && _status.currentPhase !== player) {
          prompt += "或" + get.translation(_status.currentPhase);
        }
        prompt += "的一张牌置入弃牌堆，";
        return '###道转###<div class="text center">' + prompt + "视为使用" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】</div>";
      },
      backup(links) {
        return {
          filterCard: () => false,
          selectCard: -1,
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            isCard: true
          },
          log: false,
          async precontent(event, trigger, player) {
            const goon = _status.currentPhase?.isIn() && _status.currentPhase !== player;
            let prompt = "将你";
            if (goon) {
              prompt += "或" + get.translation(_status.currentPhase);
            }
            prompt += "的一张牌置入弃牌堆";
            let dialog = ["道转：" + prompt];
            if (player.countCards("h")) {
              dialog.push('<div class="text center">你的手牌</div>');
              dialog.push(player.getCards("h"));
            }
            if (player.countCards("e")) {
              dialog.push('<div class="text center">你的装备牌</div>');
              dialog.push(player.getCards("e"));
            }
            if (goon) {
              const target = _status.currentPhase;
              if (target.countCards("h")) {
                const cards2 = target.getCards("h");
                dialog.push('<div class="text center">' + get.translation(target) + "的手牌</div>");
                if (player.hasSkillTag("viewHandcard", null, target, true)) {
                  dialog.push(cards2);
                } else {
                  dialog.push([cards2.slice().randomSort(), "blank"]);
                }
              }
              if (target.countCards("e")) {
                dialog.push('<div class="text center">' + get.translation(target) + "的装备牌</div>");
                dialog.push(target.getCards("e"));
              }
            }
            const result = await player.chooseButton(dialog).set("filterButton", (button) => {
              const card = button.link, { player: player2, useCard, targets } = get.event();
              if (!targets?.length) {
                return true;
              }
              ui.selected.cards.add(card);
              const bool = targets.some((target) => {
                if (!lib.filter.cardEnabled(useCard, player2, "forceEnable")) {
                  return false;
                }
                return lib.filter.targetEnabled2(useCard, player2, target) && lib.filter.targetInRange(useCard, player2, target);
              });
              ui.selected.cards.remove(card);
              return bool;
            }).set("useCard", event.result.card).set("targets", event.result.targets).set("ai", (button) => {
              const player2 = get.player(), source = get.owner(button.link);
              return get.value(button.link, get.owner(source)) * Math.sign(-get.attitude(player2, source));
            }).forResult();
            if (result?.bool) {
              player.logSkill("potdaozhuan", null, null, null, [get.rand(1, 2)]);
              player.addTempSkill("potdaozhuan_used", "roundStart");
              player.markAuto("potdaozhuan_used", [event.result.card.name]);
              if (result.links?.length) {
                const target = _status.currentPhase;
                const owners = result.links.map((i) => get.owner(i)).unique();
                await owners[0].loseToDiscardpile(result.links);
                if (owners[0] === target) {
                  player.tempBanSkill("potdaozhuan", "roundStart");
                  player.logSkill("potdaozhuan", null, null, null, [get.rand(3, 4)]);
                }
              }
              return;
            }
            const evt = event.getParent();
            evt.set("potdaozhuan", true);
            evt.goto(0);
          }
        };
      }
    },
    hiddenCard(player, name) {
      if (player.isTempBanned("potdaozhuan") || player.getStat("skill")["potdaozhuan"]) {
        return false;
      }
      return get.type(name) === "basic" && !player.getStorage("potdaozhuan_used").includes(name);
    },
    ai: {
      fireAttack: true,
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        if (arg === "respond") {
          return false;
        }
        return get.info("potdaozhuan").hiddenCard(
          player,
          (() => {
            switch (tag) {
              case "fireAttack":
                return "sha";
              default:
                return tag.slice("respond".length).toLowerCase();
            }
          })()
        );
      },
      order(item, player) {
        if (player && _status.event.type === "phase") {
          let max = 0, names = get.inpileVCardList((info) => {
            const name = info[2];
            if (get.type(name) !== "basic") {
              return false;
            }
            return !player.getStorage("potdaozhuan_used").includes(name);
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
    subSkill: {
      backup: {},
      used: {
        charlotte: true,
        onremove: true,
        intro: { content: "本轮已使用牌名：$" }
      }
    }
  },
  potfuji: {
    audio: 5,
    enable: "phaseUse",
    logAudio: (index) => typeof index == "number" ? `potfuji${index}.mp3` : 2,
    filter(event, player) {
      return player.countCards("he") > 0 && game.hasPlayer((target) => target !== player);
    },
    filterCard: true,
    position: "he",
    selectCard: () => [1, Infinity],
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
      return 8 - get.value(card);
    },
    multiline: true,
    multitarget: true,
    complexSelect: true,
    usable: 1,
    lose: false,
    discard: false,
    delay: false,
    async content(event, trigger, player) {
      const { targets, cards: links } = event;
      await player.showCards(links, get.translation(player) + "发动了【" + get.translation(event.name) + "】");
      const gain_list = targets.map((target, i) => [target, [links[i]]]);
      await game.loseAsync({
        gain_list,
        player,
        cards: links,
        giver: player,
        animate: "give",
        gaintag: ["potfuji"]
      }).setContent("gaincardMultiple");
      for (const list of gain_list) {
        list[0].addSkill("potfuji_effect");
      }
      if (player.isMinHandcard()) {
        player.logSkill("potfuji", null, null, null, [3]);
        player.changeSkin({ characterName: "pot_yuji" }, "pot_yuji_shadow");
        get.info(event.name).dynamic(player);
        await player.draw(2);
        player.addTempSkill(["potfuji_sha", "potfuji_shan"], { player: "phaseBegin" });
      }
      player.when({ player: ["phaseBegin"] }, false).assign({
        lastDo: true
      }).step(async () => {
        player.changeSkin({ characterName: "pot_yuji" }, "pot_yuji");
        game.broadcastAll(function(player2) {
          if (player2.node.potfuji_dynamic) {
            player2.node.potfuji_dynamic.delete();
            player2.node.potfuji_dynamic2.delete();
            delete player2.node.potfuji_dynamic;
            delete player2.node.potfuji_dynamic2;
          }
        }, player);
      }).finish();
    },
    dynamic(player) {
      game.broadcastAll(function(player2) {
        if ((() => {
          for (const sheet of document.styleSheets) {
            try {
              const rules = sheet.cssRules || sheet.rules;
              for (const rule of rules) {
                if (rule.selectorText === ".player .player_fuji") {
                  return false;
                }
              }
            } catch (e) {
              continue;
            }
          }
          return true;
        })()) {
          lib.init.sheet(".player .player_fuji { animation: game_start 0.5s; -webkit-animation: game_start 0.5s; position: absolute; width: 100%; height: 100%; left: 0; top: 0; z-index: 4; pointer-events: none; background: linear-gradient( to top, rgba(0, 255, 255, 0.3) 0%, rgba(0, 255, 255, 0.3) 60%, rgba(0, 255, 255, 0) 80%, rgba(0, 255, 255, 0) 100% );}");
        }
        if (!player2.node.potfuji_dynamic) {
          player2.node.potfuji_dynamic = ui.create.div(".player_fuji", player2.node.avatar);
          player2.node.potfuji_dynamic2 = ui.create.div(".player_fuji", player2.node.avatar2);
        }
      }, player);
    },
    ai: {
      order: 10,
      result: {
        target(player, target) {
          var card = ui.selected.cards[ui.selected.targets.length];
          if (!card) {
            return 0;
          }
          if (get.value(card) < 0) {
            return -1;
          }
          return Math.sqrt(5 - Math.min(4, target.countCards("h")));
        }
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        trigger: {
          player: ["useCard", "useCardAfter"],
          source: "damageBegin1"
        },
        mark: true,
        marktext: "符",
        intro: {
          mark(dialog, content, player) {
            const cards2 = player.getCards("h", (card) => card.hasGaintag("potfuji"));
            if (cards2?.length) {
              dialog.addAuto(cards2);
            } else {
              dialog.addText("无符济牌");
            }
          }
        },
        filter(event, player, name) {
          const ori_event = event.name === "damage" ? event.getParent("useCard") : event;
          if (!ori_event || ori_event.name !== "useCard" || !player.hasHistory("lose", (evt) => {
            const evtx = evt.relatedEvent || evt.getParent();
            if (evtx !== ori_event) {
              return false;
            }
            return Object.values(evt.gaintag_map).flat().includes("potfuji");
          })) {
            return false;
          }
          return name === "useCard" || ori_event.card.name === (event.name === "damage" ? "sha" : "shan");
        },
        forced: true,
        logTarget: "player",
        popup: false,
        async content(event, trigger, player) {
          if (trigger.name === "damage" || event.triggername === "useCardAfter") {
            player.logSkill("potfuji", null, null, null, [trigger.name === "damage" ? 4 : 5]);
          }
          if (trigger.name === "damage") {
            trigger.num++;
          } else if (event.triggername === "useCardAfter") {
            await player.draw();
          } else {
            const history = player.getHistory("lose", (evt) => {
              if ((evt.relatedEvent || evt.getParent()) !== trigger) {
                return false;
              }
              return Object.values(evt.gaintag_map).flat().includes("potfuji");
            })[0], cards2 = history.getl(player).cards2.filter((card) => history.gaintag_map[card.cardid]?.includes("potfuji"));
            let gains = [];
            for (const card of cards2) {
              const gain = get.cardPile2((gain2) => !gains.includes(gain2) && get.suit(gain2) === get.suit(card, false));
              if (gain) {
                gains.push(gain);
              }
            }
            if (gains.length) {
              await player.gain({ cards: gains, animate: "draw" });
            }
          }
        }
      },
      sha: {
        charlotte: true,
        mark: true,
        marktext: "杀",
        intro: {
          name: "符济 - 杀",
          content: "使用【杀】造成的伤害+1"
        },
        audio: "potfuji4.mp3",
        trigger: { player: "useCard" },
        filter(event, player) {
          return event.card.name === "sha";
        },
        forced: true,
        logTarget: "player",
        async content(event, trigger, player) {
          const gain = get.cardPile2((gain2) => get.suit(gain2) === get.suit(trigger.card, false));
          if (gain) {
            await player.gain({ cards: [gain], animate: "draw" });
          }
          trigger.baseDamage ??= 1;
          trigger.baseDamage++;
          player.when({
            player: "useCardAfter"
          }).filter((evt) => evt === trigger).step(async () => {
            player.removeSkill("potfuji_sha");
            if (!player.hasSkill("potfuji_shan")) {
              player.changeSkin({ characterName: "pot_yuji" }, "pot_yuji");
              game.broadcastAll(function(player2) {
                if (player2.node.potfuji_dynamic) {
                  player2.node.potfuji_dynamic.delete();
                  player2.node.potfuji_dynamic2.delete();
                  delete player2.node.potfuji_dynamic;
                  delete player2.node.potfuji_dynamic2;
                }
              }, player);
            }
          });
        }
      },
      shan: {
        charlotte: true,
        mark: true,
        marktext: "闪",
        intro: {
          name: "符济 - 闪",
          content: "使用【闪】结算完毕后摸一张牌"
        },
        audio: "potfuji5.mp3",
        trigger: { player: "useCard" },
        filter(event, player) {
          return event.card.name === "shan";
        },
        forced: true,
        async content(event, trigger, player) {
          const gain = get.cardPile2((gain2) => get.suit(gain2) === get.suit(trigger.card, false));
          if (gain) {
            await player.gain({ cards: [gain], animate: "draw" });
          }
          player.when("useCardAfter").filter((evt) => evt === trigger).step(async () => {
            player.removeSkill("potfuji_shan");
            await player.draw();
            if (!player.hasSkill("potfuji_sha")) {
              player.changeSkin({ characterName: "pot_yuji" }, "pot_yuji");
              game.broadcastAll(function(player2) {
                if (player2.node.potfuji_dynamic) {
                  player2.node.potfuji_dynamic.delete();
                  player2.node.potfuji_dynamic2.delete();
                  delete player2.node.potfuji_dynamic;
                  delete player2.node.potfuji_dynamic2;
                }
              }, player);
            }
          });
        }
      }
    }
  },
  //势董昭
  spmiaolve: {
    audio: "twmiaolve",
    inherit: "twmiaolve",
    getIndex: () => 1,
    async cost(event, trigger, player) {
      if (trigger.name == "damage") {
        const result = await player.chooseButton([`###${get.prompt(event.skill)}###获得一张智囊或摸两张牌`, [get.zhinangs(), "vcard"], [["摸两张牌", "取消"], "tdnodes"]], true).set("ai", (button) => {
          const player2 = get.player();
          const { link } = button;
          if (Array.isArray(link)) {
            if (!get.cardPile((cardx) => cardx.name == link[2])) {
              return 0;
            }
            return (Math.random() + 1.5) * player2.getUseValue({ name: link[2] });
          }
          if (link == "摸两张牌") {
            return get.effect(player2, { name: "draw" }, player2, player2) * 2;
          }
          return 0;
        }).forResult();
        event.result = {
          bool: result?.bool && result?.links?.[0] != "取消",
          cost_data: result?.links
        };
      } else {
        event.result = { bool: true };
      }
    },
    async content(event, trigger, player) {
      if (trigger.name == "damage") {
        if (event.cost_data[0] == "摸两张牌") {
          await player.draw(2);
        } else {
          const card = get.cardPile((card2) => card2.name == event.cost_data[0][2]);
          if (card) {
            await player.gain(card, "gain2");
          }
        }
      } else {
        if (!lib.inpile.includes("dz_mantianguohai")) {
          lib.inpile.add("dz_mantianguohai");
        }
        if (!_status.dz_mantianguohai_suits) {
          _status.dz_mantianguohai_suits = lib.suit.slice(0);
        }
        const list = _status.dz_mantianguohai_suits.randomRemove(2).map((i) => game.createCard2("dz_mantianguohai", i, 5));
        if (list.length) {
          await player.gain(list, "gain2", "log");
        }
      }
    }
  },
  spyingjia: {
    audio: "twyingjia",
    inherit: "twyingjia",
    limited: true,
    skillAnimation: true,
    animationColor: "thunder",
    async content(event, trigger, player) {
      const {
        targets: [target],
        cards: cards2
      } = event;
      player.awakenSkill(event.name);
      await player.discard({ cards: cards2 });
      target.insertPhase(event.name);
      target.addSkill(event.name + "_draw");
    },
    subSkill: {
      mark: {
        charlotte: true,
        init(player, skill) {
          const history = player.getHistory("useCard"), map = {};
          if (!history.length) {
            return;
          }
          let num = 0;
          for (const i of history) {
            if (get.type2(i.card) == "trick") {
              if (!map[i.card.name]) {
                if (num == 0) {
                  num = 1;
                }
                map[i.card.name] = true;
              } else {
                num = 2;
              }
            }
          }
          if (num > 0) {
            player.addTip(skill, `${get.translation(skill)} ${num}`, "phaseAfter");
          }
        },
        onremove(player, skill) {
          player.removeTip(skill);
        },
        silent: true,
        popup: false,
        firstDo: true,
        trigger: { player: "useCard" },
        filter(event, player) {
          return get.type2(event.card) == "trick";
        },
        async content(event, trigger, player) {
          const history = player.getHistory("useCard"), map = {};
          let num = 0;
          for (const i of history) {
            if (get.type2(i.card) == "trick") {
              if (!map[i.card.name]) {
                map[i.card.name] = true;
                if (num == 0) {
                  num = 1;
                }
              } else {
                num = 2;
              }
            }
          }
          player.addTip(event.name, `${get.translation(event.name)} ${num}`, "phaseAfter");
        }
      },
      draw: {
        charlotte: true,
        trigger: { player: "phaseBegin" },
        filter(event, player) {
          return event.skill == "spyingjia";
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          player.removeSkill(event.name);
          await player.draw(2);
        }
      }
    }
  },
  //势太史慈 ---
  potzhanlie: {
    audio: 3,
    trigger: { global: "phaseBegin" },
    forced: true,
    locked: false,
    logAudio: () => 2,
    async content(event, trigger, player) {
      const effectMap = /* @__PURE__ */ new Map([
        ["hp", player.getHp()],
        ["damagedHp", player.getDamagedHp()],
        ["countplayer", game.countPlayer()]
      ]);
      const num = effectMap.get(player.storage.potzhanlie) || player.getAttackRange();
      player.addTempSkill("potzhanlie_addMark");
      if (num > 0) {
        player.addMark("potzhanlie_addMark", num, false);
      }
    },
    get limit() {
      return 6;
    },
    group: "potzhanlie_lie",
    subSkill: {
      addMark: {
        charlotte: true,
        onremove: true,
        audio: "potzhanlie3.mp3",
        trigger: { global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"] },
        getIndex(event, player) {
          return Math.min(
            event.getd().filter((i) => i.name === "sha").length,
            get.info("potzhanlie").limit - player.countMark("potzhanlie_lie"),
            Math.max(
              player.countMark("potzhanlie_addMark") - game.getGlobalHistory(
                "everything",
                (evt) => {
                  if (evt === event) {
                    return false;
                  }
                  return ["lose", "loseAsync", "cardsDiscard"].includes(evt.name) && evt.getd().some((i) => i.name === "sha");
                },
                event
              ).reduce((sum, evt) => sum + evt.getd().filter((i) => i.name === "sha").length, 0),
              0
            )
          );
        },
        forced: true,
        async content(event, trigger, player) {
          player.addMark("potzhanlie_lie", 1);
        },
        intro: { content: "本回合前#张【杀】进入弃牌堆后，获得等量“烈”标记" }
      },
      lie: {
        trigger: { player: "phaseUseEnd" },
        filter: (event, player) => player.hasUseTarget(new lib.element.VCard({ name: "sha", isCard: true }), false) && player.hasMark("potzhanlie_lie"),
        direct: true,
        async content(event, trigger, player) {
          const str = player.hasMark("potzhanlie_lie") ? "移去所有“烈”，" : "";
          const next = player.chooseUseTarget({
            prompt: get.prompt("potzhanlie"),
            prompt2: `<div class="text center">${str}视为使用一张无次数限制的【杀】</div>`,
            card: get.autoViewAs({ name: "sha", isCard: true }),
            addCount: false
          });
          next.set("oncard", () => {
            const currentEvent = get.event();
            const currentPlayer = currentEvent.player;
            const num = currentPlayer.countMark("potzhanlie_lie");
            currentPlayer.addTempSkill("potzhanlie_buff");
            currentPlayer.clearMark("potzhanlie_lie");
            currentEvent.set("potzhanlie", Math.floor(num / 2));
          });
          next.set("logSkill", "potzhanlie");
          await next;
        },
        marktext: "烈",
        intro: {
          name: "烈",
          content: "mark"
        }
      },
      buff: {
        charlotte: true,
        trigger: { player: "useCard1" },
        filter: (event) => event?.potzhanlie,
        forced: true,
        locked: false,
        popup: false,
        async content(event, trigger, player) {
          const num = trigger.potzhanlie, str = get.translation(trigger.card);
          const result = await player.chooseButton([
            "战烈：是否选择至多" + get.cnNumber(num) + "项执行？",
            [
              [
                ["目标+1", "令" + str + "可以额外指定一个目标"],
                ["伤害+1", "令" + str + "基础伤害值+1"],
                ["弃牌响应", "令" + str + "需额外弃置一张牌方可响应"],
                ["摸牌", str + "结算完毕后，你摸三张牌"]
              ],
              "textbutton"
            ]
          ]).set("selectButton", [1, num]).set("ai", (button) => {
            const player2 = get.player(), trigger2 = get.event().getTrigger(), choice = button.link;
            switch (choice) {
              case "目标+1":
                return Math.max(
                  ...game.filterPlayer((target) => {
                    return !trigger2.targets?.includes(target) && lib.filter.targetEnabled2(trigger2.card, player2, target) && lib.filter.targetInRange(trigger2.card, player2, target);
                  }).map((target) => get.effect(target, trigger2.card, player2, player2))
                );
              case "伤害+1":
                return (trigger2.targets || []).reduce((sum, target) => {
                  const effect = get.damageEffect(target, player2, player2);
                  return sum + effect * (target.hasSkillTag("filterDamage", null, {
                    player: player2,
                    card: trigger2.card
                  }) ? 1 : 1 + (trigger2.baseDamage || 1) + (trigger2.extraDamage || 0));
                }, 0);
              case "弃牌响应":
                return (trigger2.targets || []).reduce((sum, target) => {
                  const card = get.autoViewAs({ name: "sha", nature: "stab" }, "unsure");
                  return sum + get.effect(target, card, player2, player2);
                }, 0);
              case "摸牌":
                return get.effect(player2, { name: "draw" }, player2, player2) * 3;
            }
          }).forResult();
          if (result.bool) {
            const choices = result.links;
            for (const choice of choices) {
              switch (choice) {
                case "目标+1":
                  player.when("useCard2").filter((evt) => evt === trigger).step(async (event2, trigger2, player2) => {
                    const result2 = await player2.chooseTarget("是否为" + get.translation(trigger2.card) + "增加一个目标？", (card, player3, target) => {
                      const evt = get.event().getTrigger();
                      return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player3, target) && lib.filter.targetInRange(evt.card, player3, target);
                    }).set("ai", (target) => {
                      const player3 = get.player(), evt = get.event().getTrigger();
                      return get.effect(target, evt.card, player3);
                    }).forResult();
                    if (result2?.bool && result2.targets?.length) {
                      const [target] = result2.targets;
                      player2.line(target, trigger2.card.nature);
                      trigger2.targets.add(target);
                      game.log(target, "成为了", trigger2.card, "的额外目标");
                    }
                  });
                  break;
                case "伤害+1":
                  trigger.baseDamage++;
                  game.log(trigger.card, "造成的伤害", "#y+1");
                  break;
                case "弃牌响应":
                  player.addTempSkill("potzhanlie_guanshi");
                  player.markAuto("potzhanlie_guanshi", [trigger.card]);
                  break;
                case "摸牌":
                  player.when("useCardAfter").filter((evt) => evt === trigger).step(async () => await player.draw(3));
                  break;
              }
            }
          }
        }
      },
      guanshi: {
        charlotte: true,
        onremove: true,
        audio: "potzhanlie",
        trigger: { player: "useCardToBegin" },
        filter(event, player) {
          if (!event.target?.isIn()) {
            return false;
          }
          return !event.getParent().directHit.includes(event.target) && player.getStorage("potzhanlie_guanshi").includes(event.card);
        },
        forced: true,
        logTarget: "target",
        async content(event, trigger, player) {
          const { target } = trigger;
          const result = await target.chooseToDiscard("战烈：弃置一张牌，否则不可响应" + get.translation(trigger.card), "he").set("ai", (card) => {
            const player2 = get.player(), trigger2 = get.event().getTrigger();
            if (get.effect(player2, trigger2.card, trigger2.player, player2) >= 0) {
              return 0;
            }
            const num = player2.countCards("hs", { name: "shan" });
            if (num === 0) {
              return 0;
            }
            if (card.name === "shan" && num <= 1) {
              return 0;
            }
            return 8 - get.value(card);
          }).forResult();
          if (!result?.bool) {
            trigger.set("directHit", true);
            game.log(target, "不可响应", trigger.card);
          }
        }
      }
    }
  },
  pothanzhan: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const target = event.targets[0];
      for (const drawer of [player, target]) {
        const num = (() => {
          return ({
            hp: drawer.getHp(),
            damagedHp: drawer.getDamagedHp(),
            countplayer: game.countPlayer()
          }[player.storage.pothanzhan] ?? drawer.maxHp) - drawer.countCards("h");
        })();
        if (num > 0) {
          await drawer.draw(Math.min(num, 3));
        }
      }
      const juedou = new lib.element.VCard({ name: "juedou", isCard: true });
      if (player.canUse(juedou, target)) {
        await player.useCard(juedou, target, false);
      }
    },
    ai: {
      order(item, player) {
        if ((player.countCards("h", { name: "sha" }) || player.maxHp - player.countCards("h")) > 1) {
          return 10;
        }
        return 1;
      },
      result: {
        target(player, target) {
          return get.effect(target, new lib.element.VCard({ name: "juedou", isCard: true }), player, player) - Math.max(
            0,
            Math.min(
              3,
              (() => {
                return ({
                  hp: target.getHp(),
                  damagedHp: target.getDamagedHp(),
                  countplayer: game.countPlayer()
                }[player.storage.pothanzhan] ?? target.maxHp) - target.countCards("h");
              })()
            )
          ) * get.effect(target, { name: "draw" }, player, player);
        }
      }
    }
  },
  potzhenfeng: {
    limited: true,
    audio: 4,
    enable: "phaseUse",
    filter(event, player) {
      return player.isDamaged() || ["pothanzhan", "potzhanlie"].some((skill) => player.hasSkill(skill, null, null, false));
    },
    skillAnimation: true,
    animationColor: "metal",
    logAudio: (index) => typeof index === "number" ? "potzhenfeng" + index + ".mp3" : 2,
    chooseButton: {
      dialog(event, player) {
        const dialog = ui.create.dialog("振锋：你可以选择一项", "hidden");
        dialog.add([
          [
            ["recover", "回复2点体力"],
            ["cover", "修改〖酣战〗和〖战烈〗描述中的“X”值"]
          ],
          "textbutton"
        ]);
        return dialog;
      },
      filter(button, player) {
        switch (button.link) {
          case "recover":
            return player.isDamaged();
          case "cover":
            return ["pothanzhan", "potzhanlie"].some((skill) => player.hasSkill(skill, null, null, false));
        }
      },
      check(button) {
        const player = get.player();
        if (button.link == "recover") {
          return player.getHp() <= 2;
        }
        if (button.link == "cover") {
          let numbers = [player.getHp(), player.getDamagedHp(), game.countPlayer()];
          if (numbers.some((c) => c > player.getAttackRange())) {
            return Math.max(...numbers) * 2;
          }
        }
        return 0.1;
      },
      backup(links) {
        return {
          item: links[0],
          skillAnimation: true,
          animationColor: "metal",
          log: false,
          async content(event, trigger, player) {
            player.awakenSkill("potzhenfeng");
            if (get.info(event.name).item === "recover") {
              player.logSkill("potzhenfeng", null, null, null, [null]);
              player.changeSkin({ characterName: "pot_taishici" }, "pot_taishici_shadow1");
              await player.recover(2);
            } else {
              let dialog = [], skills2 = ["pothanzhan", "potzhanlie"].filter((skill) => player.hasSkill(skill, null, null, false)), list = [
                ["hp", "当前体力值"],
                ["damagedHp", "当前已损失体力值"],
                ["countplayer", "场上存活角色数"]
              ];
              dialog.push("振锋：修改" + skills2.map((skill) => "〖" + get.translation(skill) + "〗").join("和") + "描述中的“X”为...");
              for (const skill of skills2) {
                dialog.push('<div class="text center">' + get.translation(skill) + "</div>");
                dialog.push([list.map((item) => [item[0] + "|" + skill, item[1]]), "tdnodes"]);
              }
              const result = await player.chooseButton(dialog, [1, Math.min(2, skills2.length)], true).set("filterButton", (button) => {
                return !ui.selected.buttons.some((but) => but.link.split("|")[1] === button.link.split("|")[1]);
              }).set("ai", (button) => {
                const player2 = get.player();
                switch (button.link.split("|")[0]) {
                  case "hp":
                    return player2.getHp();
                  case "damagedHp":
                    return player2.getDamagedHp();
                  case "countplayer":
                    return game.countPlayer();
                }
              }).forResult();
              if (result?.bool && result.links?.length) {
                player.logSkill("potzhenfeng", null, null, null, [get.rand(3, 4)]);
                let changeList = [];
                for (const link of result.links) {
                  const [change, skill] = link.split("|");
                  if (skill == "pothanzhan") {
                    changeList.push(change);
                  }
                  player.storage[skill] = change;
                  player.popup(skill);
                  game.log(player, "修改", "#g【" + get.translation(skill) + "】", "的", "#yX", "为", "#g" + list.find((item) => item[0] === change)[1]);
                }
                if (changeList[0]) {
                  switch (changeList[0]) {
                    case "hp":
                      player.changeSkin({ characterName: "pot_taishici" }, "pot_taishici_shadow3");
                      break;
                    case "damagedHp":
                      player.changeSkin({ characterName: "pot_taishici" }, "pot_taishici_shadow2");
                      break;
                    case "countplayer":
                      player.changeSkin({ characterName: "pot_taishici" }, "pot_taishici_shadow4");
                  }
                } else {
                  player.changeSkin({ characterName: "pot_taishici" }, "pot_taishici_shadow1");
                }
              }
            }
          }
        };
      },
      prompt(links) {
        return `点击“确定”，${links[0] === "recover" ? "回复2点体力" : "修改〖酣战〗和〖战烈〗描述中的“X”值"}`;
      }
    },
    subSkill: {
      backup: {}
    },
    ai: {
      order: 15,
      threaten: 2,
      result: {
        player(player) {
          if (player.getDamagedHp() >= 2) {
            return 1;
          }
          return -1;
        }
      }
    }
  }
};
const translates = {
  pot_xiaoqiao: "势小乔",
  pot_xiaoqiao_prefix: "势",
  potheyun: "合韵",
  potheyun_info: "出牌阶段限两次，你可以选择一名与你有相同技能的角色，然后你失去一个技能并令其摸两张牌。",
  potyinhui: "音洄",
  potyinhui_info: "每轮开始时，你可以失去因此获得的技能（若无则跳过），然后获得一名其他角色的一个技能。",
  pot_zhouyu: "势周瑜",
  pot_zhouyu_prefix: "势",
  potchiyun: "炽沄",
  potchiyun_info: "你每阶段首次获得牌后，可交给一名其他角色任意张手牌，其选择一项：1.展示所有与这些牌颜色相同的手牌，你对其造成1点火焰伤害；2.你摸两张牌，其进入连环状态。",
  potyanhui: "焰洄",
  potyanhui_info: "你使用牌指定目标后，可展示一名目标角色的一张手牌，若此牌本回合已被展示过，你弃置之。此阶段结束时（不可叠加），你选择一项：1.对一名本阶段因此被弃置过牌的角色造成1点火焰伤害；2，摸X张牌（X为本回合被展示过牌的角色数）。",
  potfentao: "焚涛",
  potfentao_info: "锁定技，有连环状态的其他角色受到火焰伤害时，其选择一项：1.此次传导中的伤害+1；2.弃置一半牌（向上取整），此伤害结算后其进入连环状态。",
  potxiongzi: "雄姿",
  potxiongzi_info: `限定技，准备阶段，你可令本局游戏的${get.poptip("potchiyun")}、${get.poptip("potyanhui")}和${get.poptip("potfentao")}只能在你的回合内发动，然后仅保留其中全部的一选项或二选项，并摸两张牌。`,
  pot_chengpu: "势程普",
  pot_chengpu_prefix: "势",
  potduzuo: "督佐",
  potduzuo_info: "你不因此技能获得牌后，可令一名角色获得一张火【杀】。",
  potbihan: "蔽扞",
  potbihan_info: "一名角色受到【杀】的伤害时，你可令你或其将手牌弃至当前体力值，令此【杀】伤害-1。",
  pot_xiahouba: "势夏侯霸",
  pot_xiahouba_prefix: "势",
  potlibing: "厉兵",
  potlibing_info: "锁定技，你使用非伤害牌结算后，执行上次执行项的下一项：1.攻击范围+1；2.摸X张牌（X为执行此选项次数+1）；3.使用的下一张伤害牌伤害+1。你使用伤害牌结算后，重置此技能。",
  potpoxi: "迫袭",
  potpoxi_info: "锁定技，你的牌因弃置而进入弃牌堆时，若此牌为【杀】，你使用之（无次数与距离限制）。以此法使用的【杀】不能被手牌数小于等于你的角色响应。",
  pot_chenqun: "势陈群",
  pot_chenqun_prefix: "势",
  potfaen: "法恩",
  potfaen_info: "当有角色使用牌时，若上一张牌的使用者为你，你可选择：1.令其摸一张牌；2.令其弃置一张牌。若如此做，本回合下一张牌被使用时，你令使用者额外执行另一项。",
  potdingpin: "定品",
  potdingpin_info: "每轮限一次，一个回合结束时，你可令本回合失去牌最多的一名角色执行一个额外的摸牌阶段。",
  pot_caozhen: "势曹真",
  pot_caozhen_prefix: "势",
  potsifeng: "伺锋",
  potsifeng_info: "结束阶段，你可以将牌堆顶三张牌分配并扣置在任意名其他角色的武将牌上。其于回合内使用牌后，你移去其武将牌上的第一张“伺锋”牌，若此牌与移去的“伺锋”牌颜色不同，其弃置一张手牌；其回合结束时，你选择一项：1.获得其武将牌上的“伺锋”；2.移去其剩余的“伺锋”并对该角色造成1点伤害。",
  pot_lvyi: "势吕壹",
  pot_lvyi_prefix: "势",
  pothuilv: "隳律",
  pothuilv_info: "每轮每种颜色限一次，其他角色的出牌阶段开始时，你可以选择一种颜色，令其从牌堆中随机获得一张该颜色的牌并展示。此阶段结束时，若该角色于此阶段内使用过此牌，你对其造成1点伤害；若此牌不在弃牌堆，其对你造成1点虚拟伤害，然后你可将该牌交给另一名角色。",
  potsongyan: "耸言",
  potsongyan_info: "准备阶段或当你受到伤害后，你可以视为使用一张【无中生有】，此【无中生有】结算过程中，本轮因弃置失去过牌的角色可以将一张与其本轮弃置的牌颜色相同的牌当做【无懈可击】使用。",
  potshishi: "恃势",
  potshishi_info: "锁定技，对你造成过伤害的角色不能响应你使用的牌，直到你使用的牌被其他角色响应。",
  pot_caoshuang: "势曹爽",
  pot_caoshuang_prefix: "势",
  potdianyi: "典易",
  potdianyi_info: "锁定技，触发对应时机后，你随机获得X张“奢权”牌（X为此技能本轮的发动次数）。若你本轮以此法获得牌数大于你的体力上限，你失去1点体力。",
  potshequan: "奢权",
  potshequan_info: "锁定技，触发对应时机后，你令所有其他角色同时选择一张手牌，并标记为“奢权”。",
  potjianzhuan: "渐专",
  potjianzhuan_info: `锁定技，你的“奢权”手牌点数为K，其他角色的“奢权”手牌点数为A。当你本局游戏首次造成伤害后、受到伤害后或一名角色进入濒死状态时，你为${get.poptip("potshequan")}或${get.poptip("potdianyi")}增加一个每轮限一次的对应触发时机。当增加过所有时机后，你失去${get.poptip("potshequan")}或${get.poptip("potdianyi")}，获得${get.poptip("potnizun")}并增加X点体力上限回复X点体力（X为你失去对应技能的时机数）。`,
  potnizun: "溺尊",
  potnizun_info: "锁定技，你使用过牌的回合结束时，你将本回合弃牌堆中的“奢权”牌置于你的武将牌上。每回合限一次，你可如手牌般使用这些牌，然后当你受到伤害时，此伤害值+X（X为你本轮以此法使用牌的数量）。",
  pot_zhangren: "势张任",
  pot_zhangren_prefix: "势",
  potfuan: "伏暗",
  potfuan_info: `①结束阶段，你可以将你基础的攻击范围调整至0，并失去因${get.poptip("potyinxian")}增加的攻击范围，若如此做，你摸因此减少的攻击范围张牌（至多摸5张），然后选择一个手牌中的花色并记录（每轮每个花色限一次）。②其他角色的回合结束时，若本回合有你记录花色的牌进入了弃牌堆，你可以移除对应花色，然后对一名角色视为使用一张无距离限制的【杀】。若如此做，当此牌造成伤害结算完毕后，你可以选择一项：1.再发动一次〖伏暗②〗，以此法发动后不能再次选择；2.令其技能失效直至其下个回合结束。`,
  potyinxian: "引弦",
  potyinxian_info: "锁定技，①你对你攻击范围内与其距离最远的角色使用的【杀】造成的伤害+1。②当你于回合外使用一张牌后，你的攻击范围+1。",
  pot_sunchen: "势孙綝",
  pot_sunchen_prefix: "势",
  potnigu: "逆固",
  potnigu_info: "出牌阶段限一次，你可以弃置任意张花色不同的牌，令攻击范围内的角色同时选择是否交给你一张牌，然后你本回合造成的下X次伤害+1（X为选择不交给你牌的角色数）。",
  potlulian: "戮连",
  potlulian_info: `锁定技，你使用手牌结算后，若你没有此类别的手牌，且有目标角色：体力值小于等于你，横置此牌所有目标；装备区牌数小于等于你，你摸一张牌。${get.poptip("rule_chengshi")}：你对一名体力值不为最小的角色造成1点火焰伤害。`,
  sp_zhonghui: "势钟会",
  sp_zhonghui_prefix: "势",
  mbsizi: "肆恣",
  mbsizi_info: `蓄力技（4/4）。出牌阶段限一次，你可消耗任意蓄力值，令从此回合开始的等量个回合，执行以下效果，直到你的下回合开始：1.所有角色使用【杀】造成的伤害+1；2.每个回合结束时，你摸两张牌且本回合内使用过【杀】的角色失去1点体力。若你消耗的蓄力值大于你的体力值，执行一个额外效果：每个回合结束时，若本回合未有角色使用过【杀】，当前回合角色失去1点体力。`,
  mbxiezhi: "挟志",
  mbxiezhi_info: "锁定技，当你的体力值变化后，你获得X点蓄力值（X为本次变化的值）。若你有因此未获得的蓄力值，你的手牌上限与使用【杀】的次数永久+1。",
  mbyunan: "迂难",
  mbyunan_info: `觉醒技，你的登场势力为魏。当你令一名角色进入濒死状态时，若本轮已有角色死亡，你将势力变更为群，然后获得${get.poptip("mbkechang")}，若已有则改为升级${get.poptip({
    id: "yunan_kechang",
    name: "〖克昌〗",
    type: "character",
    info: "主公技，锁定技，群势力角色使用【杀】无距离限制；你使用的【杀】不可被响应。"
  })}。`,
  mbkechang: "克昌",
  mbkechang_info: "主公技，锁定技，群势力角色使用【杀】无距离限制。",
  mbkechang_rewrite: "克昌·二级",
  get mbkechang_rewrite_info() {
    return lib.poptip.getInfo("yunan_kechang");
  },
  pot_taishici: "势太史慈",
  pot_taishici_prefix: "势",
  pothanzhan: "酣战",
  pothanzhan_info: "出牌阶段限一次，你可以选择一名其他角色，你与其将手牌数摸至X张（X为各自体力上限且至多摸三张），然后你视为对其使用一张【决斗】。",
  potzhanlie: "战烈",
  potzhanlie_info: "①一名角色的回合开始时，你记录X（X为你的攻击范围），本回合中的前X张【杀】进入弃牌堆后，你获得等量“烈”标记（你至多拥有6个“烈”标记）。②出牌阶段结束时，你可移除全部“烈”标记，视为使用一张无次数限制的【杀】并选择以下选项中的至多Y项（Y为你本次移除的标记数/2，向下取整）：1.令此【杀】可以额外指定一个目标；2.令此【杀】基础伤害值+1；3.令此【杀】需额外弃置一张牌方可响应；4.此【杀】结算完毕后，你摸三张牌。",
  potzhenfeng: "振锋",
  potzhenfeng_info: "限定技，出牌阶段，你可以选择一项：①回复2点体力；②修改〖酣战〗和〖战烈〗描述中的“X”为当前体力值、已损失体力值、存活角色数中的一项（拥有对应技能方可选择）。",
  pot_dongzhao: "势董昭",
  pot_dongzhao_prefix: "势",
  spmiaolve: "妙略",
  spmiaolve_info: `游戏开始时，你获得两张${get.poptip("dz_mantianguohai")}；当你受到伤害后，你可以选择一项：1：摸两张牌；2：从牌堆或弃牌堆中获得一张智囊。`,
  spyingjia: "迎驾",
  spyingjia_info: "限定技，一名角色的回合结束后，若你本回合使用了大于等于两张同名锦囊牌，你可以弃置一张手牌，令一名角色执行一个额外的回合，此额外回合开始时，其摸两张牌。",
  pot_lougui: "势娄圭",
  pot_lougui_prefix: "势",
  potguansha: "灌沙",
  potguansha_info: "限定技，出牌阶段结束时，你可以将所有牌替换为等量基本牌，然后你本回合的手牌上限+X（X为你获得的基本牌名数）。",
  potjiyu: "急御",
  potjiyu_info: "①出牌阶段限一次，你可以弃置一张手牌，从牌堆中随机获得与此牌类别不同的牌各一张。②每阶段限两次，当你失去本阶段因〖急御①〗获得的所有牌后，你重置〖急御①〗。",
  pot_yuji: "势于吉",
  pot_yuji_prefix: "势",
  potdaozhuan: "道转",
  potdaozhuan_info: "每回合限一次，你可以将你或者当前回合角色的一张牌置入弃牌堆，视为使用一张基本牌（每轮每种牌名限一次）。若当前回合角色因此失去了牌，则本轮此技能失效。",
  potfuji: "符济",
  potfuji_info: "出牌阶段限一次，你可以展示至多X张牌并交给等量其他角色，称为“符济”（X为场上其他角色数）。其他角色使用“符济”牌时获得一张与“符济”牌花色相同的牌；然后若此牌为：【杀】，此牌造成的伤害+1；【闪】，结算完毕后其摸一张牌。然后若你的手牌数为全场最低，则你摸两张牌，且你使用的下一张【杀】和【闪】视为拥有对应效果直到你的下个回合开始。",
  pot_chendao: "势陈到",
  pot_chendao_prefix: "势",
  potwanglie: "往烈",
  potwanglie_info: "出牌阶段开始时，你可以选择一张手牌，你此阶段使用此牌无距离限制且不可被响应，且你使用此牌结算结束后，你于此阶段不能对其他角色使用牌。",
  pothongyi: "弘毅",
  pothongyi_info: "锁定技。①游戏开始时，你获得3枚“毅”标记；当你造成或受到一点伤害后，你获得1枚“毅”标记；你至多拥有5个“毅”标记。②准备阶段，你选择一项，并于结束阶段执行另一项：1.摸X张牌（X为你当前拥有的“毅”标记数）；2.移去所有“毅”标记。",
  pothongyi_append: `<span style="font-family: yuanli"><li>该技能为海外版</span>`,
  pangxi: "势庞羲",
  pangxi_prefix: "势",
  mbxuye: "蓄业",
  mbxuye_info: "每回合限一次，当全场手牌数最少的角色受到伤害后，你可以令其摸两张牌，然后若其手牌数因此成为全场最多，你将其区域里的一张牌置于牌堆顶。",
  mbkuangxiang: "匡襄",
  mbkuangxiang_info: "出牌阶段限一次，你可以与一名手牌数不大于你的其他角色交换手牌，且直到你的下个出牌阶段开始前，你或其失去所有因此获得的手牌后，你可以执行一次〖蓄业〗的效果（不受发动次数影响）。",
  sunsháo: "势孙韶",
  sunsháo_prefix: "势",
  mbganjue: "敢决",
  mbganjue_info: "出牌阶段限一次，你可以将一张装备区的牌当做不计入次数且无距离和次数限制的普通【杀】使用，若目标角色没有与此【杀】花色相同的手牌，其不可响应此【杀】。",
  mbzhuji: "筑墼",
  mbzhuji_info: "出牌阶段结束时，你可弃置一种花色的所有手牌（至少一张），获得并使用牌堆中一张该花色的装备牌。若你弃置的牌数大于等于你弃牌时装备区的牌数，你选择一项：1.摸两张牌；2.回复1点体力；3.获得1点护甲。",
  mb_xiahoushang: "势夏侯尚",
  mb_xiahoushang_prefix: "势",
  mbtanfeng: "探锋",
  mbtanfeng_info: "准备阶段，你可以选择任意项：1.弃置一名角色至多两张牌，然后若其手牌数小于等于你，你跳过摸牌阶段；2.对一名角色造成1点火焰伤害，然后若其体力值小于等于你，你跳过出牌阶段。",
  mb_yanghong: "势杨弘",
  mb_yanghong_prefix: "势",
  mbjianji: "间计",
  mbjianji_info: "出牌阶段限一次，你可秘密选择一张手牌，并令两名角色进行拼点，赢的角色视为对没赢的角色使用一张无距离限制的【杀】，且此次拼点中这些角色可秘密选择改为用此牌进行拼点。然后若此牌为【杀】，你对选择用此牌拼点的角色各造成1点伤害。",
  mbjianji_card: "间计",
  mbjianji_card_info: "秘密选择的牌，可用于拼点",
  mbyuanmo: "远谟",
  mbyuanmo_info: "每回合限两次，准备阶段或当你受到伤害后，你可以移动场上的一张牌，然后你可以令因此失去牌的角色摸X张牌（X为其攻击范围内因此减少的角色数且至多为5）",
  mb_luyusheng: "势陆郁生",
  mb_luyusheng_prefix: "势",
  mbrunwei: "润微",
  mbrunwei_info: "出牌阶段限一次，你可以展示牌堆顶至多五张牌，令一名角色获得其中一种颜色的所有牌。若如此做：1.每阶段限一次，你不因自己使用装备牌而再失去X张牌后（X为其因此获得的牌数），该技能本阶段改为“限两次”，但不能以本回合获得过牌的角色为目标；2.本阶段结束时，你弃置以此法获得的手牌。",
  mbshuanghuai: "霜怀",
  mbshuanghuai_info: "每回合限一次，当与你距离1以内的角色受到伤害时，你可以选择一项：1.防止此伤害；2.令其从弃牌堆中获得一张【桃】。若该角色与你上一次发动时：相同，你与其各摸一张牌；不同，你失去1点体力。",
  mb_tianfeng: "势田丰",
  mb_tianfeng_prefix: "势",
  mbganggeng: "刚鲠",
  mbganggeng_info: "出牌阶段限一次，你可以将至少两张手牌交给一名其他角色。回合结束时，若其手牌数：为全场最多，你摸一张牌；不为全场最多，你弃置其区域里的一张牌。",
  mbsijian: "死谏",
  mbsijian_info: `每回合限两次，当你失去最后的手牌后，或当你进入濒死状态时，你可以选择一项：1.选择一名其他角色，其使用下一张牌时须弃置一张牌。2.令当前回合角色摸两张牌。若此时没有角色处于濒死状态，你可以${get.poptip("rule_beishui")}：失去X点体力（X为你此前发动过背水的次数）。`,
  mb_huangzu: "势黄祖",
  mb_huangzu_prefix: "势",
  mbchizhang: "鸱张",
  mbchizhang_info: "你使用伤害牌无距离限制。当你使用手牌中除【闪电】外的伤害牌指定目标后，你可以弃置任意数量的手牌，其他角色不能使用或打出与你此法弃置牌颜色相同的牌响应此牌。",
  mbduanyang: "断鞅",
  mbduanyang_info: "每回合限一次，当你的手牌不因使用而进入弃牌堆时，你可以将其中随机一张【杀】置于武将牌上，并于本阶段结束时使用之；你以此法使用的【杀】造成伤害后，你可以重铸受伤角色区域内至多两张牌，然后摸四张牌。",
  guoyuan: "势国渊",
  guoyuan_prefix: "势",
  mbqingdao: "清蹈",
  mbqingdao_info: "当其他角色对你使用的伤害牌结算完毕后，若你：因此牌受到伤害，则你可以从牌堆或弃牌堆中获得一张【闪】，或弃置一名角色区域内的一张牌；未因此牌受到伤害，则你可以从牌堆或弃牌堆中获得一张【杀】，或使用一张手牌（无距离限制）。",
  mbxiugeng: "修耕",
  mbxiugeng_info: "回合开始时，你可以记录至多两名角色的手牌数。若如此做，这些角色的下一个摸牌阶段开始时若其手牌数：小于等于记录值，其摸两张牌；大于等于记录值，其手牌上限+1。",
  mbchenshe: "陈赦",
  mbchenshe_info: "当一名其他角色进入濒死状态时，你可以依次弃置你、该角色、伤害来源的各一张牌，若这些角色以此法弃置了共计三张牌，且这些牌的花色皆相同，则其回复体力至上限，然后你失去此技能。",
  mb_zhangyan: "势张燕",
  mb_zhangyan_prefix: "势",
  mbfeijing: "飞径",
  mbfeijing_info: "你可以将一张伤害类锦囊牌当做【杀】使用或打出。每回合限两次，你使用【杀】指定唯一目标时，可以令你与其中间逆时针或顺时针方向上的所有角色同时展示并依次弃置一张手牌，然后你可以选择一种颜色，令弃置此颜色牌的角色成为此【杀】的额外目标。",
  mbxiaoge: "骁戈",
  mbxiaoge_info: "锁定技，你使用的【杀】：对因〖飞径〗成为此【杀】目标的角色造成伤害时，防止之，然后你回复1点体力并获得其因〖飞径〗弃置的牌；仅指定了一名角色为目标，此【杀】结算后你视为对其使用一张【决斗】。",
  pot_weiyan: "势魏延",
  pot_weiyan_prefix: "势",
  potzhongao: "忠傲",
  potzhongao_info: `使命技，①游戏开始时，你获得${get.poptip("potkuanggu")}。②成功：你杀死一名角色后，升级${get.poptip("potkuanggu")}为${get.poptip("potkuanggu_pot_weiyan_achieve")}，然后若你本阶段使用的牌数：小于因${get.poptip("potzhuangshi")}弃置的牌数，摸一张牌；小于因${get.poptip("potzhuangshi")}失去的体力值，回复1点体力（体力值已满则改为摸一张牌）。③失败：你进入濒死，或你未于出牌阶段开始时执行${get.poptip("potzhuangshi")}，失去${get.poptip("potzhuangshi")}并获得${get.poptip("kunfen")}。`,
  potzhuangshi: "壮誓",
  potzhuangshi_info: "出牌阶段开始时，你可以执行任意项：1.弃置任意张手牌，令你此阶段使用的前等量张牌无距离限制且不可被响应；2.失去任意点体力，令你此阶段使用的前等量张牌不计入次数限制。",
  potzhuangshi_tag: "已选择弃置",
  potyinzhan: "饮战",
  potyinzhan_info: `锁定技，你使用【杀】对一名角色造成伤害时，若：1.你的体力值小于等于其，此伤害+1；2.你的手牌数小于等于其，你于此【杀】结算结束后弃置其一张牌；${get.poptip("rule_chengshi")}：你回复1点体力，获得其弃置的牌。`,
  potkuanggu: "狂骨",
  potkuanggu_info: "你对距离1以内的一名角色造成伤害后，可以选择一项：1.回复1点体力；2.摸一张牌。",
  potkuanggu_pot_weiyan_achieve: "狂骨·二级",
  potkuanggu_pot_weiyan_achieve_info: `你对距离1以内的一名角色造成伤害后，可以选择一项：1.回复1点体力；2.摸一张牌；3.${get.poptip("rule_beishui")}：弃置一张牌并令你此阶段使用【杀】的次数+1。`,
  pot_lusu: "势鲁肃",
  pot_lusu_prefix: "势",
  pothaoshi: "好施",
  pothaoshi_info: "结束阶段，你可以选择一名其他角色：直到你的下个回合开始，其可以如手牌般使用或打出你的手牌，且其前两次因此令你失去最后的手牌时，你将手牌摸至三张。",
  potdimeng: "缔盟",
  potdimeng_info: "出牌阶段限一次，你可以选择两名手牌数之差小于等于3的角色，令他们交换手牌。然后你选择一项：1.弃置X张牌（不足则全弃）；2.交换后手牌较少的角色摸X张牌（X为你已损失的体力值）。",
  mb_sunjun: "势孙峻",
  mb_sunjun_prefix: "势",
  mbxiongtu: "凶图",
  mbxiongtu_info: "出牌阶段限一次，你可以展示一名其他角色的一张手牌并选择一项：1.弃置此牌：2.弃置X张牌并对其造成1点伤害（X为本回合未进入过弃牌堆的花色数）。若如此做，本回合你不因此技能造成伤害后，你摸一张牌，然后此技能本阶段改为限两次。",
  mbxianshuai: "先率",
  mbxianshuai_info: "锁定技，你于回合内使用手牌中每个花色的首张牌不计入次数限制且无次数限制。",
  mb_chenzhi: "势陈祗",
  mb_chenzhi_prefix: "势",
  mbquanchong: "权宠",
  mbquanchong_info: "锁定技，每轮限一次，结束阶段，你弃置所有牌，执行一个额外回合，若你体力值不为全场唯一最大，则以此法执行的回合开始时你失去1点体力。",
  mbrenxing: "任行",
  mbrenxing_info: "每轮限两次，每回合首次有牌不于弃牌阶段被弃置时，你可选择一项：1.与当前回合角色各摸一张牌；2.弃置一名本回合未使用或打出过【杀】的角色一张牌。",
  pot_xinxianying: "势辛宪英",
  pot_xinxianying_prefix: "势",
  potjiejie: "诫节",
  potjiejie_info: `每名角色的出牌阶段限一次，当前回合角色可以令你观看其手牌，然后你可以选择一种花色，若其手牌：1.包含此花色，其本回合使用此花色的牌无次数限制，然后弃置其余花色的手牌；2.不包含此花色，其获得此花色的一张牌。每轮限两次，若其本轮以此法向你展示牌所包含的花色为唯一最多，你对其发动一次${get.poptip("potqingshi")}。`,
  potqingshi: "清识",
  potqingshi_info: "当你受到伤害后，你可选择一名角色，然后若你与其阵营：相同：你与其各摸一张牌；不同：你弃置你与其各一张牌。",
  pot_huanjie: "势桓阶",
  pot_huanjie_prefix: "势",
  potgongmou: "共谋",
  potgongmou_info: `准备阶段，你可以与一名其他角色交换手牌，若如此做，你获得技能${get.poptip("qice")}且其获得技能${get.poptip("kanpo")}至本回合结束。`,
  potzhengshuo: "正朔",
  potzhengshuo_info: "限定技，出牌阶段，你可以令所有角色弃置所有手牌，然后洗牌。若如此做，所有角色各摸四张牌。",
  pot_dengai: "势邓艾",
  pot_dengai_prefix: "势",
  pottuntian: "屯田",
  pottuntian_info: "蓄力技（0/0），当你不因自己使用装备牌而失去非伤害牌后，你获得1点蓄力值；出牌阶段限一次，你可以消耗任意点蓄力值，令至多等量名角色从牌堆或弃牌堆中各获得一张红桃牌；一名角色的回合开始时，若你蓄力值已满，你摸一张牌且蓄力值上限+1。",
  potjixi: "急袭",
  potjixi_info: "一名角色的回合结束时，若场上存在本回合你使用过牌指定为目标的其他角色，你可弃置当前回合角色一张牌，然后视为使用一张指定其中任意名角色为目标的无视距离的【顺手牵羊】。",
  potzaoxian: "凿险",
  potzaoxian_info: "锁定技，当你一次性消耗的蓄力值数量：不小于2，你从弃牌堆中获得一张【无中生有】；不小于5，你从弃牌堆中获得一张【无懈可击】；不小于7，你从弃牌堆中获得一张【五谷丰登】。",
  old_pottuntian: "屯田",
  old_pottuntian_info: "蓄力技（1/3），出牌阶段限一次，你可以减少1点蓄力值，令一名角色将一张牌置于你的武将牌上，称为“田”。回合结束时，你摸X张牌（X为你本回合失去过的蓄力值数量）。你于回合外失去牌或“田”后，获得1点蓄力值。",
  old_potjixi: "急袭",
  old_potjixi_info: `若你拥有技能${get.poptip("old_pottuntian")}，你可移除1枚“峥嵘”标记，然后将一张“田”以不计入次数且无距离限制的方式使用或打出。`,
  old_potzaoxian: "凿险",
  old_potzaoxian_info: `锁定技，一名角色的回合结束时，若你拥有技能${get.poptip("old_pottuntian")}，且你拥有0或3点蓄力值，你获得1枚“峥嵘”标记。`,
  pot_chenjiao: "势陈矫",
  pot_chenjiao_prefix: "势",
  potqingyan: "清严",
  potqingyan_info: "当你需要使用【闪】或【无懈可击】时，可以展示X张手牌（X为本轮发动此技能的次数且至多为5）并视为使用之，然后此技能失效直到你手牌中没有以此法展示过的牌。",
  potceduan: "策断",
  potceduan_info: "出牌阶段限一次，你可以选择一名攻击范围包含你的角色，其攻击范围内的所有角色同时展示一张手牌，然后你将手牌中展示牌最多颜色的所有牌当做一张不计入次数限制的【杀】对其使用，若造成伤害，你摸一张牌。",
  pot_zanghong: "势臧洪",
  pot_zanghong_prefix: "势",
  pot_liezhi: "烈志",
  pot_liezhi_info: "每回合限一次，你可减少1点体力上限，视为使用一张无次数限制的【桃】/【酒】。",
  pot_jugu: "据孤",
  pot_jugu_info: "当你成为牌的目标后，若你未受伤，你可摸两张牌，然后弃置X张牌（X为你本回合发动此技能的次数）。"
};
const characterTitles = {
  pot_xiaoqiao: "衷音慰湟",
  pot_zhouyu: "燎琰涤浪",
  pot_chengpu: "焚乌荡寇",
  //pot_xiahouba: "",
  //pot_chenqun: "",
  pot_caozhen: "荷国天督",
  //pot_lvyi: "",
  pot_caoshuang: "擅政专权",
  //pot_zhangren: "",
  pot_sunchen: "凶竖盈溢",
  pot_dengai: "勇气陵云",
  //pot_chenjiao: "",
  //pot_zanghong: "",
  sp_zhonghui: "荡蜚缴志",
  mb_chenzhi: "承担接贤",
  mb_sunjun: "横逆自固",
  guoyuan: "清介有守",
  mb_huangzu: "守殁枭寒",
  mb_tianfeng: "河北瑰杰",
  mb_luyusheng: "义姑",
  mb_xiahoushang: "魏胤前驱",
  pangxi: "壁玉佐君",
  sunsháo: "明敌御疆",
  mb_yanghong: "柔迩驭远",
  pot_xinxianying: "明鉴致节",
  pot_lusu: "廓开大计",
  pot_weiyan: "矜忠跨万山",
  pot_taishici: "志踏天阶",
  pot_dongzhao: "陈筹定势",
  pot_lougui: "一日之寒",
  pot_yuji: "夙仙望道",
  pot_chendao: "白毦督",
  mb_zhangyan: "轻勇骇势",
  pot_huanjie: "才周托命"
};
const characterIntro = {
  lvyi: "吕壹（？—约238年），三国时期孙吴官员。吕壹出身不详，因受孙权宠信而官至中书典校郎（亦称“校事”），负责监察中央和地方州郡的文书事务。吕壹性苛惨，用法深刻，善于罗织罪名、诬陷大臣。他先后诬陷丞相顾雍、左将军朱据（孙权女婿）、江夏太守刁嘉等人，朝野震恐，太常潘濬甚至计划在宴会上亲手刺杀他以除国害。大将军陆逊等人亦“忧壹乱国，每言之辄流涕”。后朱据一案真相大白，孙权幡然醒悟，下令处死吕壹，并“引咎责躬”，向群臣致歉。吕壹事件是孙权晚年借校事制衡江东大族、巩固皇权之举，但亦反映其晚年猜忌群臣、治国严苛的一面。",
  zanghong: "臧洪（？—约196年 [21]），字子源，广陵射阳（今江苏宝应县东）人，东汉文学家。臧洪十五岁时，以父功拜童子郎，知名太学。后举孝廉为郎，任即丘长。中平末，弃官还家，太守张超任为功曹。后董卓专权，臧洪劝说张超联合兖州刺史刘岱等起兵讨卓，于酸枣设坛。臧洪升坛盟誓，辞气慷慨，涕泣横下，闻者莫不激扬。后归袁绍，任青州刺史、东郡太守。后张超被曹操围困，求救于臧洪，袁绍不允发兵，臧洪遂与袁绍决裂。袁绍兴兵围东郡，历年攻城不下，便令陈琳写信给臧洪，劝其归降。但臧洪回信拒绝，后城破被杀。臧洪在“缔谋连衡”西伐董卓的过程中，起了重大的积极作用的。臧洪著有《酸枣盟辞》《答陈琳书》。",
  huanjie: "桓阶（？—221年），字伯绪（《孙夫人碑》作伯序），长沙临湘（今湖南长沙）人。三国时期曹魏大臣，先为郡功曹，太守孙坚举为孝廉，朝廷任命他做尚书郎。孙坚战死，桓阶冒险求见刘表，索回孙坚尸体。曹操平定荆州，感念桓阶曾游说长沙太守张羡投曹，任命他当丞相主薄、赵郡太守。曹操封公建国，桓阶任虎贲中郎将、侍中。曹丕继位，桓阶任尚书令、侍中，封高乡亭侯，被曹丕视为寄命之臣。黄初二年（221年），桓阶得病，进爵安乐乡侯，改任太常，同年去世，谥号贞侯。",
  chenzhi: "陈祗（？―258年/259年9月23日），字奉宗，汝南（今河南平舆）人，三国时期蜀汉大臣，大司徒许靖兄长的外孙。陈祗早年受费祎的赏拔，董允死后担任侍中，逐渐成为蜀汉后主刘禅的宠臣，官至尚书令、镇军将军。陈祗上承主指，下接阉竖，权力甚至超过大将军姜维，也导致宦官黄皓开始干预政事。景耀元年（《华阳国志》作景耀二年八月丙子），陈祗去世，被追谥为“忠侯”。",
  guoyuan: "国渊，字子尼，乐安郡盖县人，三国时期曹魏官吏。汉末经学大师郑玄的高足，曾跟从管宁“邴原避乱辽东，后来回归中原，曹操任其为司空豫，而国渊亦忠于职守，在朝议上讨论问题时，经常厉言疾色，敢于发言，正直无私。曹操推行屯田制，令国渊负责处理屯田事宜。国渊发挥其管理才能，多方面平衡政策利害，将屯田的土地分配给人民，又按照人民比例安排更员跟进，更列明屯田的各项实行措施，短短五年间就令到国家仓廪丰实，百姓亦能安居乐业。曹操证伐关中，留国渊作后勤，担任居府长史，统摄府中诸事。不久，田银、苏伯于河间造反，将军贾信破之，田银属下千余人众请求投降，程显劝曹操不诛降众，国渊亦认为请降余党并非首恶，为其求救，结果这千余人都得以保命。后来国渊任职太仆，位列九卿，但是仍穿布衣吃素食，把俸禄赏赐都分给亲朋故旧，自己却保持着谦恭节俭，最后死在官任上。",
  sunsháo: "孙韶（188年一241年），字公礼，吴郡富春（今浙江杭州富阳区）人，三国时期吴国宗室、将领。孙韶的伯父孙河，本姓俞，孙策很喜爱他，便赐姓孙，将他列名孙氏家族之中。建安九年（204年），孙河被杀，孙韶统帅孙河的军队，被孙权任命为承烈校尉。后任广陵太守、偏将军。黄初二年（221年），孙权受封吴王。升任他为扬威将军，封建德侯。黄武四年（225年）十月，孙韶派遣将领高寿等人率领五百敢死士兵，从小路夜袭魏文帝曹丕的军队，曹丕大惊，高寿等人夺得其车盖而回。黄龙元年（229年），孙权称帝，任命孙韶为镇北将军。孙权后加任孙韶兼任幽州牧，假节。赤乌四年（241年），孙韶去世。",
  pangxi: "庞羲（生卒年不详），汉末三国时蜀地官吏。河南（治今河南洛阳）人。一生扎根蜀地，辅佐过刘焉、刘璋、刘备。初为议郎，与刘焉有通家之好。长平观之战后，南下益州，辅佐刘焉、刘璋父子。刘璋、张鲁反目时，出任巴郡太守，抵御张鲁，后改任巴西太守。建安十九年（214年），刘备定成都，任庞羲为左将军司马。建安二十四年（219年）秋，庞羲等人共劝刘备进位汉中王。"
};
const characterFilters = {};
const dynamicTranslates = {
  potchiyun(player, skill) {
    let s1 = player.storage[skill + "1"], s2 = player.storage[skill + "2"], t1 = "1.展示所有与这些牌颜色相同的手牌，你对其造成1点火焰伤害；", t2 = "2.你摸两张牌，其进入连环状态";
    if (s1) {
      t1 = `<span style="text-decoration: line-through;">${t1}</span>`;
    }
    if (s2) {
      t2 = `<span style="text-decoration: line-through;">${t2}</span>`;
    }
    return `你每阶段首次获得牌后，可交给一名其他角色任意张手牌，其选择一项：${t1}${t2}。`;
  },
  potyanhui(player, skill) {
    let s1 = player.storage[skill + "1"], s2 = player.storage[skill + "2"], t1 = "1.对一名因此弃置过牌的角色造成1点火焰伤害；", t2 = "2.摸X张牌（X为本回合展示过牌的角色数）";
    if (s1) {
      t1 = `<span style="text-decoration: line-through;">${t1}</span>`;
    }
    if (s2) {
      t2 = `<span style="text-decoration: line-through;">${t2}</span>`;
    }
    return `你使用牌指定目标后，可展示一名目标角色的一张手牌，若此牌本回合已被展示过，你弃置之。此阶段结束时，你选择一项：${t1}${t2}。`;
  },
  potfentao(player, skill) {
    let s1 = player.storage[skill + "1"], s2 = player.storage[skill + "2"], t1 = "1.此次传导中的伤害+1；", t2 = "2.弃置一半牌（向上取整），此伤害结算后其进入连环状态";
    if (s1) {
      t1 = `<span style="text-decoration: line-through;">${t1}</span>`;
    }
    if (s2) {
      t2 = `<span style="text-decoration: line-through;">${t2}</span>`;
    }
    return `锁定技，有连环状态的其他角色受到火焰伤害时，其选择一项：${t1}${t2}。`;
  },
  mbkechang(player, skill) {
    if (player.getStorage(skill, false)) {
      return lib.translate[`${skill}_rewrite_info`];
    }
    return lib.translate[`${skill}_info`];
  },
  potkuanggu(player) {
    if (player.getStorage("potkuanggu", 0)) {
      return lib.translate["potkuanggu_pot_weiyan_achieve_info"];
    }
    return lib.translate["potkuanggu_info"];
  },
  pothanzhan(player) {
    let str = lib.translate.pothanzhan_info;
    if (!player.storage.pothanzhan) {
      return str;
    }
    return str.replace(
      "X为各自体力上限",
      "X为" + {
        hp: "各自体力值",
        damagedHp: "各自损失体力值",
        countplayer: "场上存活角色数"
      }[player.storage.pothanzhan]
    );
  },
  potzhanlie(player) {
    let str = lib.translate.potzhanlie_info;
    if (!player.storage.potzhanlie) {
      return str;
    }
    return str.replace(
      "X为你的攻击范围",
      "X为" + {
        hp: "你的体力值",
        damagedHp: "你的损失体力值",
        countplayer: "场上存活角色数"
      }[player.storage.potzhanlie]
    );
  }
};
const perfectPairs = {};
const voices = {
  "#potshanxi1": "我军兵动如风，出之必伏山越！",
  "#potshanxi2": "疾如雷霆之威，刃卷秋霜之寒！",
  "#potshanxi3": "山中风疾，我军兵厉，问尔何不归服？",
  "#potshanxi4": "山越民丁散漫，遇我何以称军？",
  "#potqizhou1": "要说军容绮靡，天下唯我一人！",
  "#potqizhou2": "军勇何足道哉？器善方为精兵！",
  "#pot_heqi:die": "至尊若不持重，必要再遭祸败啊… ",
  "#potheyun1": "我有一曲雅乐，随江遥助军威。",
  "#potheyun2": "江东岂独郎才，曲高亦能和之。",
  "#potyinhui1": "夜夜听水观澜，仿其声而弄此琴。",
  "#potyinhui2": "日日闻弦聆音，白知此韵何意。",
  "#potyinhui3": "只怕此曲未罢，曹贼已大败而归！",
  "#potyinhui4": "唱罢大江东去，君当引军破曹！",
  "#potyinhui5": "江东安乐之土，岂容北兵轻犯？",
  "#potyinhui6": "百姓所欲无他，唯安乐之韵不绝矣。",
  "#potyinhui7": "待君功成之日，妾再为君抚琴。",
  "#potyinhui8": "如今大军压境，我亦当有所为。",
  "#potyinhui9": "此曲清寒，聆之犹见，雾锁大江。",
  "#potyinhui10": "贼既敢来，必困此江流之中。",
  "#potyinhui11": "非此鱼米之乡，何有大雅之韵？",
  "#potyinhui12": "民无饥寒之苦，方有礼乐之教。",
  "#pot_xiaoqiao:die": "何其壮哉，何其哀哉……",
  "#potchiyun1": "孙郎既有凌霄壮魄，瑜当馈以展志青天。",
  "#potchiyun2": "但凭瑜之能器，成江东壁才之愿。",
  "#potchiyun_pot_zhouyu_shadow1": "以此剑锋，送雄兵随江而去！",
  "#potchiyun_pot_zhouyu_shadow2": "掌中星火，成燎原焚天之势。",
  "#potchiyun_pot_zhouyu_shadow3": "诸位雄心壮志，看我驱策领图。",
  "#potchiyun_pot_zhouyu_shadow4": "身后吴土灯火，当由吾来守护！",
  "#potyanhui1": "既有夺城之力，所图岂在一方！",
  "#potyanhui2": "你我同心共志，天下垂手可得！",
  "#potyanhui3": "引子敬而定宏图，振长策共吞天下！",
  "#potyanhui4": "闻弦而知雅意，抚瑶琴以会群英！",
  "#potyanhui5": "便趁此胜，作气连捷！",
  "#potyanhui6": "敌势已弱，进起胜焰！",
  "#potyanhui_pot_zhouyu_shadow1": "你我皆图此计，定是万无一失。",
  "#potyanhui_pot_zhouyu_shadow2": "且看吾略，如何速定九州。",
  "#potyanhui_pot_zhouyu_shadow3": "孟德自持势众，亦难撼动江东！",
  "#potyanhui_pot_zhouyu_shadow4": "天下英雄尽出我辈，瑜自信独领风流！",
  "#potyanhui_pot_zhouyu_shadow5": "火雨齐落，焰吞三千舟楫。",
  "#potyanhui_pot_zhouyu_shadow6": "雄艟尽发，潮没百万曹军。",
  "#potfentao1": "以你我长志雄才，席卷九州！",
  "#potfentao2": "江东星火，终要席卷天下！",
  "#potfentao_pot_zhouyu_shadow1": "孟德无需忧败，你我许都再会。",
  "#potfentao_pot_zhouyu_shadow2": "曹公何须马革？三江亦可葬君！",
  "#potfentao_pot_zhouyu_shadow3": "长江千里，业火尽付东流！",
  "#potfentao_pot_zhouyu_shadow4": "北卒百万，今日当入大江！",
  "#potxiongzi1": "九州犹在，试问谁主沉浮？",
  "#potxiongzi2": "以吾一人薪火，焚没百万庸贼。",
  "#potxiongzi3": "纵有波汹浪涌，岂阻江海奔流？",
  "#potxiongzi4": "雄图尽展，坐清天下归吴。",
  "#pot_zhouyu:die": "大业终有成时，只恨未与伯符共见呐……",
  "#pot_zhouyu_shadow:die": "恨瑜以有涯之生，终难尽无穷之志……",
  "#potsifeng1": "各路坚守自固，蜀军疲而自退矣。",
  "#potsifeng2": "我军十倍于贼，又有何惧之有。",
  "#potsifeng3": "哼！以此观之，蜀军不过尔尔。",
  "#potsifeng4": "蜀军惯用此计，嫣能再诈于我。",
  "#potsifeng5": "速割陇上之粮，勿教蜀军清获。",
  "#potsifeng6": "蜀军兵败溃散，正宜吾等追击。",
  "#pot_caozhen:die": "这诸葛亮……万不可深追啊……",
  "#potduzuo1": "你我各执万军，曹贼将以何胜？",
  "#potduzuo2": "如今大敌临前，我当为君助！",
  "#potbihan1": "江东有我在日，孙氏自然不倾！",
  "#potbihan2": "少主如若有失，我罪万死难赎！",
  "#pot_chengpu:die": "泉下得见老主公，我亦无所愧矣。",
  "#potnigu1": "我令既不得行，我刑当得行也！",
  "#potnigu2": "天子若有他意，我亦当复改图！",
  "#potnigu3": "正值尽忠死战之时，何故生此迟疑！",
  "#potnigu4": "诸卿若不奉我，便是已有反心！",
  "#potlulian1": "我心性善，不忍见离，自许汝举族团圆！",
  "#potlulian2": "莫言泉下孤苦，自有汝族相陪！",
  "#potlulian3": "朝事在君，生杀在我！",
  "#potlulian4": "本朝可无天子，可无我孙綝否？",
  "#pot_sunchen:die": "臣无功劳亦有苦劳，望陛下饶命，饶命啊！",
  "#mbsizi1": "昔韩信暗度陈仓，乃定三秦之地。",
  "#mbsizi2": "今吾大军十万，岂惧蜀道之险？",
  "#mbsizi3": "德彰功显，取之何愧？",
  "#mbsizi4": "晋公既疑我，吾等亦当早决。",
  "#mbsizi5": "忍辱负重，只为今朝问鼎。",
  "#mbsizi6": "公无忧天下，故以康为虑耳。",
  "#mbsizi7": "公命同乘，何以弃我而去？",
  "#mbxiezhi1": "西蜀沃野千里，何故思归魏阙？",
  "#mbxiezhi2": "成则天下之主，败亦西蜀刘备。",
  "#mbyunan1": "纵有子房之谋，亦难逃谗言中伤。",
  "#mbyunan2": "此生如履薄冰，一朝蹙则万劫不复。",
  "#mbyunan3": "司马氏心狠手毒，不可同甘，只可共苦。",
  "#mbyunan4": "而今功高震主，岂可坐待其祸？",
  "#mbkechang1": "假使天命在魏，何使司马专权？",
  "#mbkechang2": "晋公皆赖我计，何不可谋而自立？",
  "#sp_zhonghui:die": "此谋虽败，亦远胜屈膝他人！",
  "#potqingyan1": " 行如圭臬，无偏毫厘。",
  "#potqingyan2": " 既执权柄，不纵私欲。",
  "#potqingyan3": " 清风两袖，正色一堂。",
  "#potceduan1": "若蒙救援，使为外藩，则吴人可挫也。",
  "#potceduan2": "鄙郡虽小，形便之国也。",
  "#potceduan3": "江东虎狼，非王师不能制之。",
  "#pot_chenjiao:die": "纵无申胥之效，敢忘弘演之义乎？",
  "#pot_liezhi1": "今王室将危，贼臣未枭，此诚报恩效命之秋也。",
  "#pot_liezhi2": "汉室不幸，皇纲失统，今当纠合义兵，共赴国难。",
  "#pot_jugu1": "洪为大义，不得不死，今诸君无事空与此祸。",
  "#pot_jugu2": "袁氏无道，所图不轨，洪安可背国而事贼？",
  "#pot_zanghong:die": "惜洪力劣，不能推刃为天下报仇，何谓服乎？",
  "#potjiejie1": "职守，人之大义也，安可不出？",
  "#potjiejie2": "为人执鞭而弃其事，不祥，不可也！",
  "#potqingshi1": "军旅之间可以济者，唯仁与恕。",
  "#potqingshi2": "在职思其所司，在义思其所立。",
  "#potqingshi3": "会在事纵恣，非持久处下之道。",
  "#potqingshi4": "智多而肆，吾畏其有他志。",
  "#pot_xinxianying:die": "汝若依言行之，必可全身而退。",
  "#mbquanchong1": "这等小事，何劳陛下过问？",
  "#mbquanchong2": "陛下万般恩宠，臣常思竭诚相报。",
  "#mbquanchong3": "大胆庞宏，竟敢瞧我不起？",
  "#mbquanchong4": "朝堂有我一日，汝便休想翻身。",
  "#mbrenxing1": "吾乃天子近臣，自依圣命行事。",
  "#mbrenxing2": "陛下金口玉言，岂会有误？",
  "#mb_chenzhi:die": "微臣寸功未建，有辱圣恩啊。",
  "#potgongmou1": "夫居万死之地，必有死争之心。",
  "#potgongmou2": "大王案六军以示余力，何忧于败而欲自往？",
  "#potzhengshuo1": "安帝以来，唯有名号，尺土一民，皆非汉有。",
  "#potzhengshuo2": "孙权在远称臣，此即天人之应也。",
  "#qice_pot_huanjie1": "无有奇策，何以解之？",
  "#qice_pot_huanjie2": "为今之际，唯效图纬故事。",
  "#pot_huanjie:die": "陛下厚遇，臣唯结草相报。",
  "#pot_huanjie:victory": "殿下身承天命，无所与让也。",
  "#pottuntian1": "屯田开渠，为军农要用。",
  "#pottuntian2": "农者，胜之本也。",
  "#potjixi1": "今掩其空虚，破之必矣。",
  "#potjixi2": "存亡之分，在此一举。",
  "#potzaoxian1": "乘胜进击，一鼓作气。",
  "#potzaoxian2": "为建破蜀之功，何惧丧身之险。",
  "#pot_dengai:die": "忠心天日可表，奈何为乱贼所蔽。",
  "#pothaoshi1": "万贯家财，尽施百姓又何妨？",
  "#pothaoshi2": "今战事频起，百姓流离，吾安忍坐视？",
  "#pothaoshi3": "以其无私，故能成其私也。",
  "#potdimeng1": "两家联盟若成，则无虑强曹之患。",
  "#potdimeng2": "今为将军陈以时势，望明缔盟之重也。",
  "#pot_lusu:die": "但恐时移世易，联盟不再啊。",
  "#mbxiongtu1": "明日置酒设宴，还望使君勿醉。",
  "#mbxiongtu2": "使君病未善平，有带服药酒，可取之。",
  "#mbxiongtu3": "诸葛恪民心尽失，此实为大好之机。",
  "#mbxiongtu4": "诸葛恪跋扈自恣，峻请为陛下除之。",
  "#mbxianshuai1": "吾不为陛下分忧，谁为陛下分忧？",
  "#mbxianshuai2": "臣即率兵马，征伐曹魏。",
  "#mb_sunjun:die": "啊啊，诸葛恪，汝生时吾尚且不惧，更况死乎？",
  "#potzhongao1": "主公有延助力，何忧汉室难兴！",
  "#potzhongao2": "此番斩将得胜，只是连捷之始！",
  "#potzhongao3": "此身搏杀不懈，只为成主公之业！",
  "#potzhongao4": "一时得失何须挂怀，自有再建功业之机！",
  "#potzhongao5": "吾身无需担忧，诸位还需奋进！",
  "#potkuanggu1": "曹贼吾犬，我有何惧哉？",
  "#potkuanggu2": "我尚未全力一搏，又试问谁能阻挡？",
  "#potkuanggu_pot_weiyan_achieve1": "饮罢贼血，看我再立功绩！",
  "#potkuanggu_pot_weiyan_achieve2": "与我为敌，是汝等最大的不幸！",
  "#potkuanggu_pot_weiyan_achieve3": "贼寇尚未尽戮，我岂会还营！",
  "#potkuanggu_pot_weiyan_achieve4": "可还有强敌，能让我浅尝一败！",
  "#potkuanggu_pot_weiyan_fail1": "趁此番小胜，再图一雪前耻！",
  "#potkuanggu_pot_weiyan_fail2": "我自当率军击贼，岂可为断后之将！",
  "#potzhuangshi1": "若魏寇将十万之众，延当为主公尽歼！",
  "#potzhuangshi2": "纵曹贼举天下进犯，延亦可勠力拒退！",
  "#potzhuangshi_pot_weiyan_achieve1": "丞相无需多虑，我定能亲身立功！",
  "#potzhuangshi_pot_weiyan_achieve2": "夏侯楙怯而无谋，有何计议之需！",
  "#potyinzhan1": "征战沙场，实乃平生快事！",
  "#potyinzhan2": "为主破敌，如鱼饮水！",
  "#potyinzhan3": "魏文长在此，尔辈何敢乃尔！",
  "#potyinzhan_pot_weiyan_achieve1": "既遇我魏延，休再妄想生还！",
  "#potyinzhan_pot_weiyan_achieve2": "敢阻我锋芒，自是要丢盔弃甲！",
  "#potyinzhan_pot_weiyan_achieve3": "强敌我斩，坚甲我摧！",
  "#potyinzhan_pot_weiyan_fail1": "宁战死沙场，绝不弃甲而降！",
  "#potyinzhan_pot_weiyan_fail2": "纵士少兵疲，亦可杀出重围！",
  "#potyinzhan_pot_weiyan_fail3": "战事何计兵将多寡，但看心怀之气！",
  "#kunfen_pot_weiyan1": "身承主公深信，岂可为小错所扰！",
  "#kunfen_pot_weiyan2": "前路既艰，更需倍道而行！",
  "#pot_weiyan:die": "止为大汉献身，纵死又有何恨？",
  "#pot_weiyan_achieve:die": "战死沙场固为快事，且待来生看大汉兴复！",
  "#pot_weiyan_fail:die": "不怨小人构陷，只恨主公雄志未成……",
  "#mbrunwei1": "以妾身微躯，亦可奉叔妹无虞。",
  "#mbrunwei2": "妾力虽微，然足挑一肩家计。",
  "#mbrunwei3": "君等困顿未解，我岂可半途而废。",
  "#mbrunwei4": "有舍有得，此固自然之理。",
  "#mbshuanghuai1": "女子有节，宁兰摧玉折，无负心违愿。",
  "#mbshuanghuai2": "谦则德之柄，顺则妇之行。",
  "#mbshuanghuai3": "颜子贵于能改，仲尼嘉其不贰，而况妇人者哉!",
  "#mb_luyusheng:die": "有辱家族之荣，亦负父亲之望。",
  "#mbganggeng1": "犯颜敢谏，何惧一死乎？",
  "#mbganggeng2": "丰有良言，将军何不纳之？",
  "#mbganggeng3": "将军今得天时，此战必可胜之。",
  "#mbganggeng4": "唉!大事去矣，大事去矣!",
  "#mbsijian1": "若可劝得主公，丰死之无悔!",
  "#mbsijian2": "郁寄于心，丰不吐不快!",
  "#mb_tianfeng:die": "用人不疑，疑人不用，主公岂不知此理？",
  "#mbchizhang1": "孙权屡屡犯我，必将其生擒泄愤!",
  "#mbchizhang2": "竖子，安敢口出狂言！",
  "#mbduanyang1": "众士向前，退者立斩！",
  "#mbduanyang2": "大胆竖子，安敢乱我军心!",
  "#mbduanyang3": "诸将所为甚是得当，吾安可不赏？",
  "#mb_huangzu:die": "人骂汝父作锻锡公，奈何不杀？",
  "#mbchenshe1": "此等余党，非为首恶，请曹公免于行刑。",
  "#mbchenshe2": "田银、苏伯既破，余党复何虑哉？",
  "#mbchenshe3": "今者千人得生，全赖曹公恩德。",
  "#mbxiugeng1": "既受此托，安可负曹公之任!",
  "#mbxiugeng2": "相土处民，计民置吏，方可成屯田之功。",
  "#mbxiugeng3": "百姓竞劝乐业，实是人间乐土。",
  "#mbxiugeng4": "所幸风调雨顺，岁岁仓廪丰实。",
  "#mbqingdao1": "上不欺君，下不虐民，此为官之道也。",
  "#mbqingdao2": "为官之法，惟有三事，曰清、曰慎、曰勤。",
  "#guoyuan:die": "吾一生清俭，死亦当薄葬。",
  "#potfuji1": "此符上格神明，下通幽府，有诸般之神效。",
  "#potfuji2": "吾所书之符上可鞭笞百鬼，更况些许小疾。",
  "#potfuji3": "天地有常法，不失铢分也。",
  "#potfuji4": "得天意者寿，失天意者亡。",
  "#potfuji5": "天者养人命，地者养人形。",
  "#potdaozhuan1": "吾承天道法，闭其凶恶之路，开天太平之阶。",
  "#potdaozhuan2": "幸欲报天地之功而得寿者，努力信道勿懈。",
  "#potdaozhuan3": "不学无求贤，不耕无求收，子知之乎？",
  "#potdaozhuan4": "哀哉，有志之士，早计早计，无负今言。",
  "#pot_yuji:die": "子为愚者，尚迷不信道，堕卑贱苦，岂不哀哉!",
  "#pot_yuji_shadow:die": "子思其意无邪倾，积德累行道自成。",
  "#mbkuangxiang1": "吾与益州有通家之好，安忍其诸孙受害？",
  "#mbkuangxiang2": "伐鲁之事，吾可为君之助力。",
  "#mbkuangxiang3": "匡君辅政，丈夫之任也。",
  "#mbxuye1": "今世宜须兵位，且召汉昌賨民为兵。",
  "#mbxuye2": "募兵但为御敌，岂敢怀有贰心？",
  "#mbxuye3": "今天下扰乱，治下岂可无人？",
  "#pangxi:die": "吾救君诸子，广有匡襄，州牧安可疑我？",
  "#mbzhuji1": "有此金汤之固，何惧远征之敌。",
  "#mbzhuji2": "甲坚兵利，敌军自是难攻。",
  "#mbzhuji3": "起楼橹，修器备，以御敌寇。",
  "#mbzhuji4": "若无城甲之坚，何以拒敌之外。",
  "#mbganjue1": "坚毅果敢，勇而有决，大丈夫当如是也。",
  "#mbganjue2": "将贵及时应变，早溃敌军。",
  "#sunsháo:die": "至尊恩遇，臣恐不能报还……",
  "#mbjianji1": "先擒刘备，后图吕布，则徐州可得也。",
  "#mbjianji2": "今日不可力战，需以计图谋。",
  "#mbjianji3": "刘备易取，但恐吕布相救，故需以间计图之。",
  "#mbyuanmo1": "某今献一计，可使刘备即日就擒。",
  "#mbyuanmo2": "孙策据长江之险，兵精良广，未可图也。",
  "#mbyuanmo3": "今当先伐刘备，然后图取孙策未迟。",
  "#mb_yanghong:die": "今日固死，死又何惧。",
  "#potwanglie1": "上将者，但建今日之功，不勘往昔之烈。",
  "#potwanglie2": "一人之兵，如震如霆，霆霆冥冥，天下皆惊!",
  "#pothongyi1": "非弘不能胜其重，非毅无以致其远。",
  "#pothongyi2": "士不可以不弘毅，任重而道远。",
  "#pothongyi3": "纵具万险，亦需一试。",
  "#pothongyi4": "路虽千里，行则将至。",
  "#pot_chendao:die": "先帝功业，终止于此乎？",
  "#potguansha1": "如此坚壁可成，虽金汤之固，未能过也。",
  "#potguansha2": "今趁天寒，可灌沙为城，不过达晓之功。",
  "#potjiyu1": "丞相今与贼战，当即筑营寨，以御敌变也。",
  "#potjiyu2": "丞相英明一世，岂为此事所迷？",
  "#potjiyu3": "三军既出，营为首务，安可不筑城以御乎？",
  "#pot_lougui:die": "丞相留步，老夫告辞。",
  "#pothanzhan1": "君壮情烈胆，某必当奉陪！",
  "#pothanzhan2": "哼！你我再斗一番，方知孰为霸王！",
  "#potzhanlie1": "君头已在此，还不授首来降！",
  "#potzhanlie2": "且看此箭之下，焉有偷生之人？",
  "#potzhanlie3": "哼，汝还能战否？",
  "#potzhenfeng1": "前番未见高下，此番定决生死！",
  "#potzhenfeng2": "天道择义而襄，英雄待机而胜！",
  "#potzhenfeng3": "待吾重振兵马，胜负犹未可知！",
  "#potzhenfeng4": "有胆气者，随某前去一战！",
  "#pot_taishici:die": "身征大义，魂念江东……"
};
const characterSort = {
  bingshi_qi: ["pot_zhangren", "pot_lougui", "pot_yuji", "mb_xiahoushang", "sunsháo", "mb_yanghong", "pot_dengai", "pot_lvyi", "pot_xiahouba"],
  bingshi_zheng: ["pot_chenjiao", "guoyuan", "pot_taishici", "pot_chendao", "mb_tianfeng", "pot_chenqun", "pot_chengpu"],
  bingshi_shi: ["pot_weiyan", "mb_huangzu", "pot_dongzhao", "pangxi", "mb_zhangyan", "mb_chenzhi", "sp_zhonghui", "pot_zhouyu", "pot_xiaoqiao", "pot_sunchen", "mb_sunjun"],
  bingshi_jie: ["pot_xinxianying", "pot_lusu", "mb_luyusheng", "pot_huanjie", "pot_zanghong", "pot_caozhen"]
};
const characterSortTranslate = {
  bingshi_qi: "兵势篇·奇",
  bingshi_zheng: "兵势篇·正",
  bingshi_shi: "兵势篇·势",
  bingshi_jie: "兵势篇·节"
};
game.import("character", function() {
  return {
    name: "bingshi",
    connect: true,
    character: { ...characters },
    characterSort: {
      bingshi: characterSort
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
