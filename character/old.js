import { get, game, ui, _status, lib } from "noname";
const characters = {
  two_yj_hanbing: {
    sex: "female",
    group: "qun",
    hp: 4,
    skills: ["chegu", "jianrou"],
    names: "null|null",
    img: "image/character/yj_hanbing.jpg",
    dieAudios: ["yj_hanbing"]
  },
  two_yj_tengjia: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["renjia", "yj_yanyu"],
    names: "null|null",
    img: "image/character/yj_tengjia.jpg",
    dieAudios: ["yj_tengjia"]
  },
  two_yj_puyuan: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["pyhuanling", "pyshenduan"],
    img: "image/character/yj_puyuan.jpg",
    dieAudios: ["yj_puyuan"]
  },
  x_dc_zhangqiying: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["x_dc_falu", "x_dc_zhenyi", "x_dc_dianhua"],
    dieAudios: ["zhangqiying"]
  },
  x_yao_yuanshu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["yao_yaoyi", "yao_chenwei"],
    dieAudios: ["yao_yuanshu"],
    img: "image/character/yao_yuanshu.jpg"
  },
  fx_baosanniang: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["mbfangxu", "mbzhuguan", "mblisuo"]
  },
  sy_baosanniang: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["meiyong", "rexushen", "rezhennan"],
    dieAudios: ["baosanniang"]
  },
  ol_baosanniang: {
    sex: "female",
    group: "shu",
    hp: 4,
    skills: ["olwuniang", "olxushen"],
    dieAudios: ["baosanniang"]
  },
  junk_sunquan: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["dili", "yuheng"],
    groupInGuozhan: "wu",
    dieAudios: ["shen_sunquan"]
  },
  new_simayi: {
    sex: "male",
    group: "shen",
    hp: 4,
    skills: ["jilin", "yingyou", "yingtian"],
    groupInGuozhan: "wei",
    names: "司马|懿"
  },
  hr_wufu: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dchuairen", "dcchizei"],
    dieAudios: ["wufu"],
    img: "image/character/wufu.jpg"
  },
  xj_peixiu: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["xjzhitu", "dcxiujue"],
    names: "裴|秀",
    dieAudios: ["fj_peixiu"],
    img: "image/character/fj_peixiu.jpg"
  },
  cx_majun: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["chuanxie", "yjqiaosi"],
    names: "马|钧",
    dieAudios: ["yj_majun"],
    img: "image/character/yj_majun.jpg"
  },
  qq_majun: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["yuliao", "qiqiao", "yanxie"],
    names: "马|钧",
    dieAudios: ["yj_majun"],
    img: "image/character/yj_majun.jpg"
  },
  one_dc_sp_machao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["onedcspzhuiji", "onedcspshichou"]
  },
  two_dc_sp_machao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["zhuiji", "dc_olshichou"]
  },
  old_wuyi: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["benxi"],
    clans: ["陈留吴氏"]
  },
  old_shixie: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["biluan", "lixia"],
    dieAudios: ["shixie"]
  },
  panfeng: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["kuangfu"]
  },
  old_guanyinping: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["xueji_old", "oldhuxiao", "oldwuji"],
    dieAudios: ["guanyinping"]
  },
  old_caocao: {
    sex: "male",
    group: "shen",
    hp: 3,
    skills: ["junkguixin", "feiying"],
    dieAudios: ["shen_caocao"]
  },
  old_chendao: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["drlt_wanglie"],
    dieAudios: ["chendao"]
  },
  old_liyan: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["duliang", "fulin"],
    dieAudios: ["liyan"]
  },
  old_guanzhang: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["old_fuhun"],
    names: "关|兴-张|苞"
  },
  new_caoren: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["moon_jushou", "jiewei"],
    dieAudios: ["caoren"]
  },
  huangzhong: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["liegong"]
  },
  old_dingfeng: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["fenxun", "duanbing"],
    dieAudios: ["dingfeng"]
  },
  old_huanghao: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["oldqinqing", "oldhuisheng"],
    dieAudios: ["huanghao"]
  },
  oldre_liubiao: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["zishou", "zongshi"],
    dieAudios: ["liubiao"]
  },
  old_liubiao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["oldzishou", "zongshi"],
    dieAudios: ["liubiao"]
  },
  old_gaoshun: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xianzhen", "jinjiu"],
    dieAudios: ["gaoshun"]
  },
  old_caorui: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["huituo", "oldmingjian", "xingshuai"],
    isZhugong: true,
    dieAudios: ["caorui"]
  },
  old_handang: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["oldgongji", "oldjiefan"],
    dieAudios: ["handang"]
  },
  old_yangzhi: {
    sex: "female",
    group: "jin",
    hp: 3,
    skills: ["wanyi", "maihuo"],
    clans: ["弘农杨氏"],
    dieAudios: ["yangzhi"]
  },
  old_yangyan: {
    sex: "female",
    group: "jin",
    hp: 3,
    skills: ["xuanbei", "xianwan"],
    clans: ["弘农杨氏"],
    dieAudios: ["yangyan"]
  },
  madai: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["mashu", "oldqianxi"]
  },
  xuhuang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["gzduanliang"]
  },
  junk_simayi: {
    sex: "male",
    group: "jin",
    hp: 3,
    skills: ["buchen", "smyyingshi", "xiongzhi", "quanbian"],
    hasHiddenSkill: true,
    names: "司马|懿",
    dieAudios: ["jin_simayi"]
  },
  fazheng: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["enyuan", "xuanhuo"]
  },
  ol_yuanshu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["wangzun", "tongji"],
    dieAudios: ["re_yuanshu"]
  },
  pangde: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["mashu", "mengjin"]
  },
  ol_huaxiong: {
    sex: "male",
    group: "qun",
    hp: 6,
    skills: ["new_reyaowu"],
    dieAudios: ["old_huaxiong"]
  },
  old_wangyun: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["wylianji", "moucheng"],
    clans: ["太原王氏"],
    dieAudios: ["wangyun"]
  },
  old_xiaoqiao: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["tianxiang", "hongyan"],
    names: "桥|null",
    dieAudios: ["xiaoqiao"]
  },
  weiyan: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["kuanggu"]
  },
  xiahouyuan: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["shensu"],
    names: "夏侯|渊"
  },
  old_zhangxingcai: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["oldshenxian", "qiangwu"],
    dieAudios: ["zhangxingcai"]
  },
  old_fuhuanghou: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["oldzhuikong", "oldqiuyuan"],
    dieAudios: ["fuhuanghou"]
  },
  old_caochong: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["oldrenxin", "oldchengxiang"],
    dieAudios: ["caochong"]
  },
  yuji: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["old_guhuo"]
  },
  zhangjiao: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["leiji", "guidao", "huangtian"],
    isZhugong: true
  },
  old_zhangfei: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["new_repaoxiao", "new_tishen"],
    dieAudios: ["re_zhangfei"]
  },
  old_zhaoyun: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["longdan", "new_yajiao"],
    dieAudios: ["re_zhaoyun"]
  },
  old_huatuo: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["jijiu", "chulao"],
    dieAudios: ["re_huatuo"]
  },
  old_guanyu: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["wusheng", "yijue"],
    dieAudios: ["re_guanyu"]
  },
  old_caochun: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["shanjia"],
    dieAudios: ["caochun"]
  },
  masu: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["xinzhan", "huilei"]
  },
  xushu: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["xswuyan", "jujian"],
    groupBorder: "wei"
  },
  liru: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["juece", "mieji", "fencheng"]
  },
  xin_yujin: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["jieyue"],
    dieAudios: ["yujin.mp3"]
  },
  old_zhonghui: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["zzhenggong", "zquanji", "zbaijiang"],
    clans: ["颍川钟氏"]
  },
  old_xusheng: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["pojun"],
    dieAudios: ["xusheng"]
  },
  old_zhuran: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["olddanshou"],
    dieAudios: ["zhuran"]
  },
  old_lingtong: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["oldxuanfeng"],
    dieAudios: ["lingtong"]
  },
  old_caoxiu: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["taoxi"],
    dieAudios: ["caoxiu"]
  },
  old_caozhen: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["sidi"],
    dieAudios: ["caozhen"]
  },
  old_maliang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["xiemu", "naman"]
  },
  old_chenqun: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["dingpin", "oldfaen"],
    dieAudios: ["chenqun"],
    clans: ["颍川陈氏"]
  },
  old_zhuhuan: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["youdi"]
  },
  old_zhuzhi: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["anguo"],
    dieAudios: ["zhuzhi"]
  },
  old_zhugezhan: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["old_zuilun", "old_fuyin"],
    names: "诸葛|瞻",
    dieAudios: ["zhugezhan"]
  },
  old_guanqiujian: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["drlt_zhenrong", "drlt_hongju"],
    names: "毌丘|俭",
    dieAudios: ["guanqiujian"]
  },
  old_wanglang: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["gushe", "jici"],
    dieAudios: ["wanglang"]
  },
  old_wangyi: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["oldzhenlie", "oldmiji"]
  },
  re_yujin: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["yizhong"],
    dieAudios: ["yujin.mp3"]
  }
};
const cards = {};
const pinyins = {};
const skills = {
  //寒冰剑
  chegu: {
    audio: 2,
    onremove(player, skill) {
      player.removeSkill("chegu_effect");
    },
    trigger: {
      player: "useCardToPlayer"
    },
    filter(event, player) {
      if (player !== _status.currentPhase || get.type(event.card) == "equip") {
        return false;
      }
      return event.targets?.length && event.isFirstTarget;
    },
    check(event, player) {
      const getV = (current) => get.effect(current, { name: "guohe_copy2" }, player, player), targets = game.filterPlayer((current) => current.countDiscardableCards(player, "he") > 0).sort((a, b) => getV(b) - getV(a));
      const getAllV = (num, numx) => {
        let index = 0, eff = 0;
        while (index < num) {
          const target = targets[index];
          if (!target) {
            break;
          }
          index++;
          const count = Math.min(numx, target.countDiscardableCards(player, "he"));
          eff += count * getV(target);
        }
        return eff;
      };
      const list = [1, 2 + player.countMark("chegu_effect")];
      let val = Math.max(getAllV(...list), getAllV(...list.reverse()));
      return event.targets.reduce((val2, current) => {
        return val2 - get.effect(current, event.card, player, player);
      }, val) > 0;
    },
    async content(event, trigger, player) {
      const evt = trigger.getParent();
      if (evt) {
        evt.targets.length = 0;
        evt.all_excluded = true;
      }
      const getPrompt = (list) => {
        const [num, numx] = list;
        return `弃置${num > 1 ? "至多" : ""}${get.cnNumber(num)}名角色${num > 1 ? "各" : ""}${numx > 1 ? "至多" : ""}${get.cnNumber(numx)}张牌`;
      }, list1 = [1, 2 + player.countMark("chegu_effect")], list2 = [2 + player.countMark("chegu_effect"), 1];
      const result = await player.chooseButton(
        [
          "彻骨：选择一项",
          [
            [
              [list1, getPrompt(list1)],
              [list2, getPrompt(list2)]
            ],
            "textbutton"
          ]
        ],
        true
      ).set("ai", (button) => {
        const list = button.link, player2 = get.player();
        const getV = (current) => get.effect(current, { name: "guohe_copy2" }, player2, player2), targets = game.filterPlayer((current) => current.countDiscardableCards(player2, "he") > 0).sort((a, b) => getV(b) - getV(a));
        const getAllV = (num, numx) => {
          let index = 0, eff = 0;
          while (index < num) {
            const target = targets[index];
            if (!target) {
              break;
            }
            index++;
            const count = Math.min(numx, target.countDiscardableCards(player2, "he"));
            eff += count * getV(target);
          }
          return eff;
        };
        return getAllV(...list);
      }).forResult();
      if (result?.bool && result.links?.length) {
        const [num, numx] = result.links[0], targets = game.filterPlayer((current) => current.countDiscardableCards(player, "he") > 0);
        if (!targets?.length) {
          return;
        }
        const result2 = targets.length === 1 ? {
          bool: true,
          targets
        } : await player.chooseTarget("彻骨：选择要弃牌的目标角色", [1, num], true, (card, player2, target) => {
          return target.countDiscardableCards(player2, "he");
        }).set("maxNum", numx).set("ai", (target) => {
          const { player: player2, maxNum } = get.event();
          return get.effect(target, { name: "guohe_copy2" }, player2, player2) * Math.min(maxNum, target.countDiscardableCards(player2, "he"));
        }).forResult();
        if (result2?.bool && result2.targets?.length) {
          const func = async (target) => {
            const discard = Math.min(numx, target.countDiscardableCards(player, "he"));
            if (discard > 0) {
              await player.discardPlayerCard(target, [1, discard], true, "he");
            }
          };
          player.line(result2.targets, "green");
          await game.doAsyncInOrder(result2.targets, func);
          const colors = [], types = [];
          game.getGlobalHistory("everything", (evt2) => {
            if (evt2.name != "lose" || evt2.type != "discard") {
              return false;
            }
            if (evt2.getParent(3) === event && evt2.cards?.length) {
              evt2.cards.forEach((card) => {
                colors.add(get.color(card, false));
                types.add(get.type2(card, false));
              });
            }
          });
          if (colors.length === 1 || types.length === 1) {
            player.addTempSkill("chegu_effect");
            player.addMark("chegu_effect", 1, false);
          }
        }
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "本回合【彻骨】数值+#"
        }
      }
    }
  },
  jianrou: {
    audio: 2,
    round: 1,
    trigger: {
      player: "damageBegin3"
    },
    filter(event, player) {
      return player.countDiscardableCards(player, "he") >= 2;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard(get.prompt2(event.skill), 2, "he").set("eff", get.damageEffect(player, trigger.source ?? player, player)).set("ai", (card) => {
        const { player: player2, eff } = get.event();
        if (eff >= 0) {
          return 0;
        }
        if (ui.selected.cards.length) {
          const cardx = ui.selected.cards[0];
          if (get.color(cardx, false) == get.color(card, false) || get.type2(cardx, false) == get.type2(card, false)) {
            return 16 - get.value(card);
          }
          return 4 - get.value(card);
        }
        return 7 - get.value(card);
      }).set("chooseonly", true).forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2, name } = event;
      await player.modedDiscard(cards2);
      trigger.cancel();
      const check = (key) => cards2.map((card) => get[key](card, false)).toUniqued().length === 1;
      if (check("color") || check("type2")) {
        await player.draw();
        const limit = `${name}_roundcount`;
        if (player.storage[limit]) {
          delete player.storage[limit];
          player.unmarkSkill(limit);
          game.log(player, "令", "#g【剑柔】", "视为未发动过");
        }
      }
    }
  },
  //爻袁术
  yao_yaoyi: {
    audio: 2,
    init(player, skill) {
      game.broadcastAll(
        (player2, skill2) => {
          const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
              if (mutation.type === "childList") {
                const cards2 = player2._start_cards ?? [];
                if (player2.node.handcards1.cardMod[skill2] && !_status.gameDrawed) {
                  for (const card2 of mutation.addedNodes) {
                    if (cards2.includes(card2)) {
                      game.broadcastAll(
                        (card3, player3, skill3) => {
                          card3.addGaintag(`${skill3}_tag`);
                          game.addVideo("addGaintag", player3, [[get.cardInfo(card3)], `${skill3}_tag`]);
                          card3.classList.add(skill3);
                          game.addVideo("skill", player3, [skill3, [true, [get.cardInfo(card3)]]]);
                        },
                        card2,
                        player2,
                        skill2
                      );
                    }
                  }
                }
                for (const card2 of mutation.removedNodes) {
                  if (cards2.includes(card2) && !card2.hasGaintag(`${skill2}_tag`)) {
                    game.broadcastAll(
                      (card3, player3, skill3) => {
                        card3.classList.remove(skill3);
                        game.addVideo("skill", player3, [skill3, [false, [get.cardInfo(card3)]]]);
                      },
                      card2,
                      player2,
                      skill2
                    );
                  }
                }
              }
            }
          });
          const config = { childList: true };
          observer.observe(player2.node.handcards1, config);
          observer.observe(player2.node.handcards2, config);
          player2.node.handcards1.cardMod ??= {};
          player2.node.handcards2.cardMod ??= {};
          const cardMod = (card2) => {
            if (card2.classList.contains(skill2)) {
              return ["爻疑", "此牌对你不可见"];
            }
          };
          player2.node.handcards1.cardMod[skill2] = cardMod;
          player2.node.handcards2.cardMod[skill2] = cardMod;
          player2.node.handcards1.classList.add(skill2);
          player2.node.handcards2.classList.add(skill2);
          if (_status.gameDrawed) {
            const cards2 = player2._start_cards ?? [];
            player2.getCards("h").forEach((card2) => {
              if (cards2.includes(card2)) {
                game.broadcastAll(
                  (card3, player3, skill3) => {
                    card3.addGaintag(`${skill3}_tag`);
                    game.addVideo("addGaintag", player3, [[get.cardInfo(card3)], `${skill3}_tag`]);
                    card3.classList.add(skill3);
                    game.addVideo("skill", player3, [skill3, [true, [get.cardInfo(card3)]]]);
                  },
                  card2,
                  player2,
                  skill2
                );
              }
            });
          }
          const { card, blank, ...others } = ui.create.buttonPresets;
          ui.create.buttonPresets = {
            ...others,
            card(item, ...args) {
              if (item.classList.contains(skill2) && args[args.length - 1] !== skill2) {
                return blank(item, ...args, skill2);
              }
              return card(item, ...args);
            },
            blank(item, ...args) {
              if (item.classList.contains(skill2) && args[args.length - 1] !== skill2) {
                return card(item, ...args, skill2);
              }
              return blank(item, ...args);
            }
          };
        },
        player,
        skill
      );
    },
    onremove(player, skill) {
      player.removeGaintag(`${skill}_tag`);
      game.broadcastAll(
        (player2, skill2) => {
          player2.node.handcards1.classList.remove(skill2);
          player2.node.handcards2.classList.remove(skill2);
          delete player2.node.handcards1.cardMod[skill2];
          delete player2.node.handcards2.cardMod[skill2];
          player2.getCards("h").forEach((card) => {
            if (card.classList.contains(skill2)) {
              card.classList.remove(skill2);
              game.addVideo("skill", player2, [skill2, [false, [get.cardInfo(card)]]]);
            }
          });
        },
        player,
        skill
      );
    },
    video(player, info) {
      for (const cardid of info[1]) {
        for (const card of player.getCards("h")) {
          if (card.cardid === cardid[4]) {
            card.classList[info[0] ? "add" : "remove"]("yao_yaoyi");
          }
        }
      }
    },
    enable: "chooseToUse",
    filter(event, player) {
      return get.inpileVCardList((info) => lib.skill.yao_yaoyi.hiddenCard(player, info[2])).some((info) => {
        const card = { name: info[2], nature: info[3] };
        return player.hasCard((cardx) => cardx.classList.contains("yao_yaoyi") && event.filterCard({ ...card, cards: [cardx] }, player, event), "h");
      });
    },
    chooseButton: {
      dialog(event, player) {
        const list = get.inpileVCardList((info) => lib.skill.yao_yaoyi.hiddenCard(player, info[2])).filter((info) => {
          const card = { name: info[2], nature: info[3] };
          return player.hasCard((cardx) => cardx.classList.contains("yao_yaoyi") && event.filterCard({ ...card, cards: [cardx] }, player, event), "h");
        });
        return ui.create.dialog("爻疑", [list, "vcard"]);
      },
      filter(button, player) {
        const event = get.event().getParent(), info = button.link, card = { name: info[2], nature: info[3] };
        return player.hasCard((cardx) => cardx.classList.contains("yao_yaoyi") && event.filterCard({ ...card, cards: [cardx] }, player, event), "h");
      },
      check(button) {
        const event = get.event().getParent();
        if (event.type !== "phase") {
          return 1;
        }
        return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
      },
      prompt(links) {
        const event = get.event().getParent();
        return "将一张背置牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】" + (event.name === "chooseToRespond" ? "打出" : "使用");
      },
      backup(links, player) {
        return {
          audio: "yao_yaoyi",
          filterCard(card) {
            return get.itemtype(card) == "card" && card.classList.contains("yao_yaoyi");
          },
          popname: true,
          check(card) {
            return 1 + Math.random();
          },
          position: "hse",
          viewAs: { name: links[0][2], nature: links[0][3] },
          async precontent(event, trigger, player2) {
            player2.addTempSkill("yao_yaoyi_used");
            player2.markAuto("yao_yaoyi_used", [event.result.card?.name]);
          }
        };
      }
    },
    hiddenCard(player, name) {
      if (!lib.inpile.includes(name) || player.getStorage("yao_yaoyi_used").includes(name)) {
        return false;
      }
      return ["basic", "trick"].includes(get.type(name)) && player.hasCard((card) => _status.connectMode || card.classList.contains("yao_yaoyi"), "h");
    },
    locked: false,
    mod: {
      cardEnabled(card, player) {
        if (!card || get.is.convertedCard(card)) {
          return;
        }
        if (card?.cards?.some((cardx) => cardx.classList.contains("yao_yaoyi"))) {
          return false;
        }
      },
      cardRespondable(card, player) {
        return get.info("yao_yaoyi").mod.cardEnabled.apply(this, arguments);
      },
      cardSavable(card, player) {
        return get.info("yao_yaoyi").mod.cardEnabled.apply(this, arguments);
      }
    },
    ai: {
      respondSha: true,
      respondShan: true,
      skillTagFilter(player) {
        if (!player.hasCard((card) => _status.connectMode || card.classList.contains("yao_yaoyi"), "h")) {
          return false;
        }
      },
      order(item, player) {
        if (player && _status.event.type == "phase") {
          const list = get.inpileVCardList((info) => lib.skill.yao_yaoyi.hiddenCard(player, info[2]));
          let max = 0;
          list.forEach((info) => {
            const card = { name: info[2], nature: info[3] };
            if (player.getUseValue(card) > 0) {
              const temp = get.order(card);
              if (temp > max) {
                max = temp;
              }
            }
          });
          if (max > 0) {
            max += 1;
          }
          return max;
        }
        return 1;
      },
      result: {
        player(player) {
          return get.event().dying ? get.attitude(player, get.event().dying) : 1;
        }
      }
    },
    subSkill: {
      backup: {},
      tag: {},
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  yao_chenwei: {
    audio: 2,
    trigger: { player: "useCard" },
    filter(event, player) {
      if (!player.hasHistory("lose", (evt) => {
        if (evt.getParent() !== event) {
          return false;
        }
        return Object.values(evt.gaintag_map).flat().includes("yao_yaoyi_tag");
      })) {
        return false;
      }
      if (!player.storage.yao_chenwei) {
        return player.countCards("h") > 0;
      }
      return game.hasPlayer((target) => target !== player && target.countGainableCards(player, "he"));
    },
    async cost(event, trigger, player) {
      const next = player.chooseTarget(get.prompt(event.skill));
      if (player.storage[event.skill]) {
        next.prompt2 = "获得一名其他角色的一张牌并将此牌背置";
        next.filterTarget = function(card, player2, target) {
          return target !== player2 && target.countGainableCards(player2, "he");
        };
        next.ai = function(target) {
          const player2 = get.player();
          return get.effect(target, { name: "shunshou_copy2" }, player2, player2);
        };
      } else {
        next.prompt2 = "令一名角色将你的一张手牌翻面";
        next.ai = function(target) {
          const player2 = get.player();
          return 1 + Math.sign(get.attitude(player2, target)) + Math.random();
        };
      }
      event.result = await next.forResult();
    },
    async content(event, trigger, player) {
      const storage = player.storage[event.name], target = event.targets[0];
      player.changeZhuanhuanji(event.name);
      if (storage) {
        const result = await player.gainPlayerCard(target, "he", true).forResult();
        if (result?.bool && result.cards?.some((i) => get.position(i) === "h" && get.owner(i) === player && !i.classList.contains("yao_yaoyi"))) {
          game.broadcastAll(
            (cards2) => {
              for (const card of cards2) {
                card.classList.add("yao_yaoyi");
                card.addGaintag("yao_yaoyi_tag");
              }
            },
            result.cards.filter((i) => get.position(i) === "h" && get.owner(i) === player && !i.classList.contains("yao_yaoyi"))
          );
        }
      } else {
        const result = await target.choosePlayerCard(player, "h", true).set("prompt2", `将${get.translation(player)}的一张手牌翻面`).forResult();
        if (result?.bool && result.cards?.some((i) => get.position(i) === "h" && get.owner(i) === player)) {
          game.broadcastAll(
            (cards2) => {
              for (const card of cards2) {
                if (card.hasGaintag("yao_yaoyi_tag")) {
                  card.removeGaintag("yao_yaoyi_tag");
                  game.addVideo("removeGaintag", player, ["yao_yaoyi_tag", [get.cardInfo(card)]]);
                  card.classList.remove("yao_yaoyi");
                  game.addVideo("skill", player, ["yao_yaoyi", [false, [get.cardInfo(card)]]]);
                } else {
                  card.addGaintag("yao_yaoyi_tag");
                  game.addVideo("addGaintag", player, [[get.cardsInfo(card)], "yao_yaoyi_tag"]);
                  card.classList.add("yao_yaoyi");
                  game.addVideo("skill", player, ["yao_yaoyi", [true, [get.cardInfo(card)]]]);
                }
              }
            },
            result.cards.filter((i) => get.position(i) === "h" && get.owner(i) === player)
          );
        }
      }
    },
    zhuanhuanji: true,
    marktext: "☯",
    mark: true,
    intro: {
      content(storage) {
        return `当你使用背置牌时，你可以${["获得一名其他角色的一张牌并将此牌背置", "令一名角色将你的一张手牌翻面"][1 - storage]}`;
      }
    },
    ai: {
      combo: "yao_yaoyi"
    }
  },
  //魏武帝
  junkguixin: {
    audio: "guixin",
    trigger: {
      player: "phaseEnd"
    },
    forbid: ["guozhan"],
    init() {
      if (!_status.junkguixin) {
        _status.junkguixin = [];
        if (!_status.characterlist) {
          game.initCharacterList();
        }
        for (const name of _status.characterlist) {
          if (!lib.character[name][3]) {
            continue;
          }
          _status.junkguixin.addArray(
            lib.character[name][3].filter((skill) => {
              var info = get.info(skill);
              return info && info.zhuSkill && (!info.ai || !info.ai.combo);
            })
          );
        }
      }
    },
    async cost(event, trigger, player) {
      const controls = ["获得技能", "修改势力", "cancel2"];
      if (!_status.junkguixin.some((skill) => !player.hasSkill(skill, null, false, false))) {
        controls.shift();
      }
      const result = await player.chooseControl({
        controls,
        prompt: get.prompt2("junkguixin"),
        ai() {
          return _status.event.controls.length === 3 ? "获得技能" : "cancel2";
        }
      }).forResult();
      if (result.control === "cancel2") {
        event.result = {
          bool: false
        };
        return;
      }
      switch (result.control) {
        case "获得技能": {
          const skills2 = _status.junkguixin.filter((skill) => !player.hasSkill(skill, null, false, false));
          if (!skills2.length) {
            event.result = {
              bool: false
            };
            return;
          }
          const list = skills2.map((skill) => {
            return [
              skill,
              '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + get.translation(skill) + "】</div><div>" + lib.translate[skill + "_info"] + "</div></div>"
            ];
          });
          const result2 = await player.chooseButton({
            prompt: "归心：选择获得一个主公技",
            createDialog: [list, "textbutton"],
            forced: true,
            ai() {
              return 1 + Math.random();
            }
          }).forResult();
          event.result = {
            bool: result2.bool,
            cost_data: {
              control: "skill",
              skill: result2.links?.[0]
            }
          };
          break;
        }
        case "修改势力": {
          const result2 = await player.chooseTarget({
            prompt: "请选择【归心】的目标",
            prompt2: "更改一名其他角色的势力",
            filterTarget: lib.filter.notMe,
            forced: true,
            ai() {
              return 1 + Math.random();
            }
          }).forResult();
          event.result = {
            bool: result2.bool,
            targets: result2.targets,
            cost_data: {
              control: "target"
            }
          };
          break;
        }
      }
    },
    logTarget(event) {
      const type = event?.cost_data.control;
      if (type === "skill") {
        return null;
      }
      return event?.targets;
    },
    async content(event, trigger, player) {
      const control = event.cost_data.control;
      if (control === "skill") {
        await player.addSkills(event.cost_data.skill);
        return;
      }
      const target = event.targets[0];
      const groups = lib.group.filter((group) => group !== "shen" && group !== target.group);
      const result = await player.chooseControl({
        prompt: "请选择" + get.translation(target) + "变更的势力",
        controls: groups,
        ai() {
          return get.event().controls.randomGet();
        }
      }).forResult();
      if (result.control) {
        player.popup(get.translation(result.control + "2"));
        await target.changeGroup(result.control);
      }
    }
  },
  oldqinqing: {
    audio: "qinqing",
    mode: ["identity", "versus"],
    available(mode) {
      if (mode == "versus" && _status.mode != "four") {
        return false;
      }
      if (mode == "identity" && _status.mode == "purple") {
        return false;
      }
      return true;
    },
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      var zhu = get.zhu(player);
      if (!zhu || !zhu.isZhu) {
        return false;
      }
      return game.hasPlayer(function(current) {
        return current != zhu && current != player && current.inRange(zhu);
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2("dcqinqing"),
        filterTarget(card, player2, target) {
          const zhu = get.zhu(player2);
          return target !== player2 && target.inRange(zhu);
        },
        ai(target) {
          const zhu = get.zhu(player);
          const he = target.countCards("he");
          if (get.attitude(_status.event.player, target) > 0) {
            if (target.countCards("h") > zhu.countCards("h") + 1) {
              return 0.1;
            }
          } else {
            if (he > zhu.countCards("h") + 1) {
              return 2;
            }
            if (he > 0) {
              return 1;
            }
          }
          return 0;
        }
      }).forResult();
    },
    logTarget: "targets",
    async content(event, trigger, player) {
      const target = event.targets[0];
      if (target.countDiscardableCards(player, "he")) {
        await player.discardPlayerCard({
          target,
          position: "he",
          forced: true
        });
      }
      await target.draw();
      const zhu = get.zhu(player);
      if (zhu && zhu.isIn()) {
        if (target.countCards("h") > zhu.countCards("h")) {
          await player.draw();
        }
      }
    }
  },
  oldhuisheng: {
    audio: "huisheng",
    trigger: { player: "damageBegin4" },
    direct: true,
    filter(event, player) {
      if (!player.countCards("he")) {
        return false;
      }
      if (!event.source || event.source == player || !event.source.isIn()) {
        return false;
      }
      if (player.storage.oldhuisheng && player.storage.oldhuisheng.includes(event.source)) {
        return false;
      }
      return true;
    },
    init(player) {
      if (player.storage.oldhuisheng) {
        player.storage.oldhuisheng = [];
      }
    },
    async content(event, trigger, player) {
      if (!player.storage.oldhuisheng) {
        player.storage.oldhuisheng = [];
      }
      player.storage.oldhuisheng.push(trigger.source);
      const att = get.attitude(player, trigger.source) > 0;
      let goon = false;
      if (player.hp === 1) {
        goon = true;
      } else {
        const he = player.getCards("he");
        let num2 = 0;
        for (const card of he) {
          if (get.value(card) < 8) {
            num2++;
            if (num2 >= 2) {
              goon = true;
              break;
            }
          }
        }
      }
      const result = await player.chooseCard({
        prompt: get.prompt2("oldhuisheng", trigger.source),
        position: "he",
        selectCard: [1, player.countCards("he")],
        ai(card) {
          if (_status.event.att) {
            return 10 - get.value(card);
          }
          if (_status.event.goon) {
            return 8 - get.value(card);
          }
          if (!ui.selected.cards.length) {
            return 7 - get.value(card);
          }
          return 0;
        }
      }).set("goon", goon).set("att", att).forResult();
      if (!result.bool) {
        return;
      }
      player.logSkill("oldhuisheng", trigger.source);
      await game.delay();
      const num = result.cards?.length ?? 0;
      const sourceGoon = num > 2 || get.attitude(trigger.source, player) >= 0;
      let forced = false;
      let str = "获得其中一张牌并防止伤害";
      if (trigger.source.countCards("he") < num) {
        forced = true;
      } else {
        str += "，或取消并弃置" + get.cnNumber(num) + "张牌";
      }
      const result2 = await trigger.source.chooseButton({
        forced,
        createDialog: [str, result.cards],
        ai(button) {
          if (_status.event.goon) {
            return get.value(button.link);
          }
          return get.value(button.link) - 8;
        }
      }).set("goon", sourceGoon).forResult();
      if (result2.bool) {
        const card = result2.links?.[0];
        await trigger.source.gain({
          cards: [card],
          source: player,
          animate: "giveAuto",
          bySelf: true
        });
        trigger.cancel();
      } else {
        await trigger.source.chooseToDiscard({
          selectCard: num,
          position: "he",
          forced: true
        });
      }
    }
  },
  oldzishou: {
    audio: "zishou",
    audioname: ["re_liubiao"],
    trigger: { player: "phaseDrawBegin2" },
    check(event, player) {
      return player.countCards("h") <= 2 && player.getDamagedHp() >= 2 || player.skipList.includes("phaseUse");
    },
    filter(event, player) {
      return !event.numFixed && player.isDamaged();
    },
    async content(event, trigger, player) {
      trigger.num += player.getDamagedHp();
      player.skip("phaseUse");
    },
    ai: {
      threaten: 1.5
    }
  },
  oldgongji: {
    audio: "gongji",
    enable: ["chooseToUse", "chooseToRespond"],
    locked: false,
    filterCard: { type: "equip" },
    position: "hes",
    viewAs: {
      name: "sha",
      storage: { oldgongji: true }
    },
    viewAsFilter(player) {
      if (!player.countCards("hes", { type: "equip" })) {
        return false;
      }
    },
    prompt: "将一张装备牌当无距离限制的【杀】使用或打出",
    check(card) {
      var val = get.value(card);
      if (_status.event.name == "chooseToRespond") {
        return 1 / Math.max(0.1, val);
      }
      return 5 - val;
    },
    mod: {
      targetInRange(card) {
        if (card.storage && card.storage.oldgongji) {
          return true;
        }
      }
    },
    ai: {
      respondSha: true,
      skillTagFilter(player) {
        if (!player.countCards("hes", { type: "equip" })) {
          return false;
        }
      }
    }
  },
  oldjiefan: {
    audio: "jiefan",
    trigger: { player: "chooseToUseBegin" },
    filter(event, player) {
      return event.type == "dying" && _status.currentPhase !== player;
    },
    direct: true,
    clearTime: true,
    async content(event, trigger, player) {
      const list = [event.name, trigger.dying];
      await player.chooseToUse({
        filterCard(card, player2, event2) {
          if (get.name(card) != "sha") {
            return false;
          }
          return lib.filter.filterCard.apply(this, arguments);
        },
        prompt: get.prompt2(...list)
      }).set("targetRequired", true).set("complexSelect", true).set("complexTarget", true).set("filterTarget", function(card, player2, target) {
        if (target != _status.currentPhase && !ui.selected.targets.includes(_status.currentPhase)) {
          return false;
        }
        return lib.filter.filterTarget.apply(this, arguments);
      }).set("logSkill", list).set("oncard", function() {
        _status.event.player.addTempSkill("oldjiefan_recover");
      }).set("custom", {
        add: {},
        replace: {
          window: () => {
            ui.click.cancel();
          }
        }
      });
    },
    ai: {
      save: true,
      order: 3,
      result: { player: 1 }
    },
    subSkill: {
      recover: {
        // audio:'jiefan',
        trigger: { source: "damageBegin2" },
        filter(event, player) {
          return event.getParent(4).name == "oldjiefan";
        },
        forced: true,
        popup: false,
        charlotte: true,
        async content(event, trigger, player) {
          trigger.cancel();
          const evt = event.getParent("_save");
          const card = { name: "tao", isCard: true };
          if (evt && evt.dying && player.canUse(card, evt.dying)) {
            await player.useCard({
              card: get.autoViewAs(card),
              targets: [evt.dying],
              skill: "oldjiefan_recover"
            });
          }
        }
      }
    }
  },
  oldmingjian: {
    audio: "mingjian",
    trigger: { player: "phaseUseBefore" },
    filter(event, player) {
      return player.countCards("h");
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "跳过出牌阶段并将所有手牌交给一名其他角色，你结束此回合，然后其于此回合后获得一个额外的出牌阶段", lib.filter.notMe).set("ai", (target) => {
        var player2 = _status.event.player, att = get.attitude(player2, target);
        if (target.hasSkillTag("nogain")) {
          return 0.01 * att;
        }
        if (player2.countCards("h") == player2.countCards("h", "du")) {
          return -att;
        }
        if (target.hasJudge("lebu")) {
          att *= 1.25;
        }
        if (get.attitude(player2, target) > 3) {
          var basis = get.threaten(target) * att;
          if (player2 == get.zhu(player2) && player2.hp <= 2 && player2.countCards("h", "shan") && !game.hasPlayer(function(current) {
            return get.attitude(current, player2) > 3 && current.countCards("h", "tao") > 0;
          })) {
            return 0;
          }
          if (target.countCards("h") + player2.countCards("h") > target.hp + 2) {
            return basis * 0.8;
          }
          return basis;
        }
        return 0;
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      await player.give(player.getCards("h"), target);
      trigger.cancel();
      const evt = trigger.getParent("phase", true);
      if (evt) {
        game.log(player, "结束了回合");
        evt.num = evt.phaseList.length;
        evt.goto(11);
      }
      const next = target.insertPhase();
      next._noTurnOver = true;
      next.phaseList = ["phaseUse"];
    },
    async phase(event, trigger, player) {
      await player.phaseUse();
      game.broadcastAll(function() {
        if (ui.tempnowuxie) {
          ui.tempnowuxie.close();
          delete ui.tempnowuxie;
        }
      });
    }
  },
  oldshenxian: {
    audio: "shenxian",
    inherit: "shenxian"
  },
  old_guhuo: {
    audio: 2,
    enable: ["chooseToUse", "chooseToRespond"],
    hiddenCard(player, name) {
      return lib.inpile.includes(name) && player.countCards("hs") > 0;
    },
    filter(event, player) {
      if (!player.countCards("hs")) {
        return false;
      }
      for (const i of lib.inpile) {
        const type = get.type(i);
        if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
          return true;
        }
        if (i == "sha") {
          for (const j of lib.inpile_nature) {
            if (event.filterCard(get.autoViewAs({ name: i, nature: j }, "unsure"), player, event)) {
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
        for (const i of lib.inpile) {
          if (event.type != "phase") {
            if (!event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
              continue;
            }
          }
          const type = get.type(i);
          if (type == "basic" || type == "trick") {
            list.push([type, "", i]);
          }
          if (i == "sha") {
            for (const j of lib.inpile_nature) {
              if (event.type != "phase") {
                if (!event.filterCard(get.autoViewAs({ name: i, nature: j }, "unsure"), player, event)) {
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
          return current != player && current.hp != 0 && (get.realAttitude || get.attitude)(current, player) < 0;
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
              return current != player2 && current.hp != 0 && (get.realAttitude || get.attitude)(current, player2) < 0;
            });
            const cardx = lib.skill.old_guhuo_backup.viewAs;
            if (enemyNum) {
              if (card.name == cardx.name && (card.name != "sha" || get.is.sameNature(card, cardx))) {
                return 2 + Math.random() * 3;
              } else if (lib.skill.old_guhuo_backup.aiUse < 0.5 && !player2.isDying()) {
                return 0;
              }
            }
            return 6 - get.value(card);
          },
          async precontent(event, trigger, player2) {
            player2.logSkill("old_guhuo");
            player2.addTempSkill("old_guhuo_guess");
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
        if (!player.countCards("hs")) {
          return false;
        }
      },
      threaten: 1.2,
      order: 8.1,
      result: {
        player: 1
      }
    },
    subSkill: {
      guess: {
        trigger: {
          player: ["useCardBefore", "respondBefore"]
        },
        forced: true,
        silent: true,
        popup: false,
        firstDo: true,
        charlotte: true,
        filter(event, player) {
          return event.skill && event.skill.indexOf("old_guhuo_") == 0;
        },
        async content(event, trigger, player) {
          event.fake = false;
          event.betrayer = [];
          const [card] = trigger.cards;
          if (card.name != trigger.card.name || card.name == "sha" && !get.is.sameNature(trigger.card, card)) {
            event.fake = true;
          }
          player.popup(trigger.card.name, "metal");
          const next = player.lose(card, ui.ordering);
          next.relatedEvent = trigger;
          await next;
          trigger.throw = false;
          trigger.skill = "old_guhuo_backup";
          game.log(player, "声明", trigger.targets && trigger.targets.length ? "对" : "", trigger.targets || "", trigger.name == "useCard" ? "使用" : "打出", trigger.card);
          event.prompt = get.translation(player) + "声明" + (trigger.targets && trigger.targets.length ? "对" + get.translation(trigger.targets) : "") + (trigger.name == "useCard" ? "使用" : "打出") + (get.translation(trigger.card.nature) || "") + get.translation(trigger.card.name) + "，是否质疑？";
          event.targets = game.filterPlayer(function(current) {
            return current != player && current.hp != 0;
          }).sortBySeat(_status.currentPhase);
          game.broadcastAll(
            function(card2, player2) {
              _status.old_guhuoNode = card2.copy("thrown");
              if (lib.config.cardback_style != "default") {
                _status.old_guhuoNode.style.transitionProperty = "none";
                ui.refresh(_status.old_guhuoNode);
                _status.old_guhuoNode.classList.add("infohidden");
                ui.refresh(_status.old_guhuoNode);
                _status.old_guhuoNode.style.transitionProperty = "";
              } else {
                _status.old_guhuoNode.classList.add("infohidden");
              }
              _status.old_guhuoNode.style.transform = "perspective(600px) rotateY(180deg) translateX(0)";
              player2.$throwordered2(_status.old_guhuoNode);
            },
            trigger.cards[0],
            player
          );
          event.onEnd01 = function() {
            _status.old_guhuoNode.removeEventListener("webkitTransitionEnd", _status.event.onEnd01);
            setTimeout(function() {
              _status.old_guhuoNode.style.transition = "all ease-in 0.3s";
              _status.old_guhuoNode.style.transform = "perspective(600px) rotateY(270deg)";
              const onEnd = function() {
                _status.old_guhuoNode.classList.remove("infohidden");
                _status.old_guhuoNode.style.transition = "all 0s";
                ui.refresh(_status.old_guhuoNode);
                _status.old_guhuoNode.style.transform = "perspective(600px) rotateY(-90deg)";
                ui.refresh(_status.old_guhuoNode);
                _status.old_guhuoNode.style.transition = "";
                ui.refresh(_status.old_guhuoNode);
                _status.old_guhuoNode.style.transform = "";
                _status.old_guhuoNode.removeEventListener("webkitTransitionEnd", onEnd);
              };
              _status.old_guhuoNode.listenTransition(onEnd);
            }, 300);
          };
          for (const target of event.targets) {
            const { links } = await target.chooseButton([event.prompt, [["reguhuo_ally", "reguhuo_betray"], "vcard"]], true).set("ai", function(button) {
              const player2 = _status.event.player;
              const evt = _status.event.getParent("old_guhuo_guess"), evtx = evt.getTrigger();
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
              event.betrayer.add(target);
            } else {
              game.log(target, "#g不质疑");
              target.popup("不质疑", "wood");
            }
          }
          await game.delayx();
          game.broadcastAll(function(onEnd) {
            _status.event.onEnd01 = onEnd;
            if (_status.old_guhuoNode) {
              _status.old_guhuoNode.listenTransition(onEnd, 300);
            }
          }, event.onEnd01);
          await game.delay(2);
          if (!event.betrayer.length) {
            return;
          }
          if (event.fake) {
            event.betrayer.forEach((target) => target.popup("质疑正确", "wood"));
            await game.asyncDraw(event.betrayer);
            game.log(player, "声明的", trigger.card, "作废了");
            trigger.cancel();
            trigger.getParent().goto(0);
            trigger.line = false;
            event.clearUI = true;
          } else {
            event.betrayer.forEach((target) => target.popup("质疑错误", "fire"));
            for (let target of event.betrayer) {
              await target.loseHp();
            }
            if (get.suit(card) != "heart") {
              game.log(player, "声明的", trigger.card, "作废了");
              trigger.cancel();
              trigger.getParent().goto(0);
              trigger.line = false;
              event.clearUI = true;
            }
          }
          await game.delay(2);
          if (event.clearUI) {
            game.broadcastAll(() => ui.clear());
          }
        }
      },
      cheated: {
        trigger: {
          player: "gainAfter",
          global: "loseAsyncAfter"
        },
        charlotte: true,
        forced: true,
        silent: true,
        popup: false,
        firstDo: true,
        onremove: true,
        filter(event, player) {
          if (event.getParent().name == "draw") {
            return true;
          }
          var cards2 = event.getg(player);
          if (!cards2.length) {
            return false;
          }
          return game.hasPlayer((current) => {
            if (current == player) {
              return false;
            }
            var evt = event.getl(current);
            if (evt && evt.cards && evt.cards.length) {
              return true;
            }
            return false;
          });
        },
        async content(event, trigger, player) {
          player.removeSkill("old_guhuo_cheated");
        }
      }
    }
  },
  old_zuilun: {
    audio: "xinfu_zuilun",
    subSkill: {
      e: {},
      h: {}
    },
    enable: "phaseUse",
    usable: 2,
    filterTarget(card, player, target) {
      if (player == target) {
        return false;
      }
      var pos = "he";
      if (player.hasSkill("old_zuilun_h")) {
        pos = "e";
      }
      if (player.hasSkill("old_zuilun_e")) {
        pos = "h";
      }
      return target.countGainableCards(player, pos) > 0;
    },
    async content(event, trigger, player) {
      const target = event.target ?? event.targets?.[0];
      if (!target) {
        return;
      }
      let pos = "he";
      if (player.hasSkill("old_zuilun_h")) {
        pos = "e";
      }
      if (player.hasSkill("old_zuilun_e")) {
        pos = "h";
      }
      const result = await player.gainPlayerCard({
        target,
        position: pos,
        forced: true
      }).forResult();
      if (result.bool && result.cards && result.cards.length) {
        await target.draw();
        const originalPos = result.cards[0].original;
        if (originalPos === "h" || originalPos === "e") {
          player.addTempSkill("old_zuilun_" + originalPos, "phaseUseAfter");
        }
      }
    },
    ai: {
      order: 7,
      result: {
        target: -1
      }
    }
  },
  old_fuyin: {
    audio: "xinfu_fuyin",
    mod: {
      targetEnabled(card, player, target) {
        if ((card.name == "juedou" || card.name == "sha" || card.name == "huogong") && player != target && player.countCards("h") >= target.countCards("h") && target.hasEmptySlot(2)) {
          return false;
        }
      }
    }
  },
  old_jijun: {
    marktext: "方",
    audio: "xinfu_jijun",
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill) {
      var cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    enable: "phaseUse",
    filterCard: true,
    selectCard: [1, Infinity],
    allowChooseAll: true,
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    check(card) {
      var player = _status.event.player;
      if (36 - player.getExpansions("old_jijun").length <= player.countCards("h")) {
        return 1;
      }
      return 5 - get.value(card);
    },
    discard: false,
    lose: false,
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      await player.addToExpansion({
        cards: cards2,
        source: player,
        animate: "give",
        gaintag: ["old_jijun"]
      });
    },
    ai: {
      order: 1,
      result: {
        player: 1
      },
      combo: "old_fangtong"
    }
  },
  old_fangtong: {
    trigger: {
      player: "phaseJieshuBegin"
    },
    audio: "xinfu_fangtong",
    forced: true,
    skillAnimation: true,
    animationColor: "metal",
    filter(event, player) {
      return player.getExpansions("old_jijun").length > 35;
    },
    async content(event, trigger, player) {
      const winners = player.getFriends();
      game.over(player == game.me || winners.includes(game.me));
    },
    ai: {
      combo: "oldjijun"
    }
  },
  oldanxu: {
    enable: "phaseUse",
    usable: 1,
    multitarget: true,
    audio: 2,
    filterTarget(card, player, target) {
      if (player == target) {
        return false;
      }
      var num = target.countCards("h");
      if (ui.selected.targets.length) {
        return num < ui.selected.targets[0].countCards("h");
      }
      var players = game.filterPlayer();
      for (var i = 0; i < players.length; i++) {
        if (num > players[i].countCards("h")) {
          return true;
        }
      }
      return false;
    },
    selectTarget: 2,
    async content(event, trigger, player) {
      const { targets } = event;
      let result;
      let gainner;
      let giver;
      if (targets[0].countCards("h") < targets[1].countCards("h")) {
        gainner = targets[0];
        giver = targets[1];
      } else {
        gainner = targets[1];
        giver = targets[0];
      }
      result = await gainner.gainPlayerCard({
        target: giver,
        position: "h",
        visible: true,
        forced: true
      }).forResult();
      if (result.bool && result.links?.length && get.suit(result.links[0]) !== "spade") {
        await player.draw();
      }
    },
    ai: {
      order: 10.5,
      threaten: 2,
      result: {
        target(player, target) {
          var num = target.countCards("h");
          var att = get.attitude(player, target);
          if (ui.selected.targets.length == 0) {
            if (att > 0) {
              return -1;
            }
            var players = game.filterPlayer();
            for (var i = 0; i < players.length; i++) {
              var num2 = players[i].countCards("h");
              var att2 = get.attitude(player, players[i]);
              if (att2 >= 0 && num2 < num) {
                return -1;
              }
            }
            return 0;
          } else {
            return 1;
          }
        },
        player: 0.1
      }
    }
  },
  oldfaen: {
    audio: "faen",
    trigger: { global: ["turnOverAfter", "linkAfter"] },
    filter(event, player) {
      if (event.name == "link") {
        return event.player.isLinked();
      }
      return true;
    },
    check(event, player) {
      return get.attitude(player, event.player) > 0;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      await trigger.player.draw();
    },
    ai: {
      expose: 0.2
    },
    global: "faen_global"
  },
  oldxuanfeng: {
    audio: "xuanfeng",
    trigger: {
      player: ["loseAfter"],
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    filter(event, player) {
      var evt = event.getl(player);
      return evt && evt.es && evt.es.length > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt("oldxuanfeng"),
        filterTarget(card, player2, target) {
          if (target == player2) {
            return false;
          }
          return get.distance(player2, target) <= 1 || player2.canUse("sha", target, false);
        },
        ai(target) {
          if (get.distance(player, target) <= 1) {
            return get.damageEffect(target, player, player) * 2;
          } else {
            return get.effect(target, { name: "sha" }, player, player);
          }
        }
      }).forResult();
    },
    logTarget: "targets",
    async content(event, trigger, player) {
      const target = event.targets[0];
      const distance = get.distance(player, target);
      if (distance <= 1 && player.canUse("sha", target, false)) {
        const result = await player.chooseControl({
          controls: ["出杀", "造成伤害"],
          ai() {
            return "造成伤害";
          }
        }).forResult();
        if (result.control === "出杀") {
          await player.useCard({
            card: get.autoViewAs({ name: "sha", isCard: true }),
            targets: [target],
            addCount: false
          }).set("animate", false);
          await game.delay();
        } else {
          await target.damage();
        }
      } else if (distance <= 1) {
        await target.damage();
      } else {
        await player.useCard({
          card: get.autoViewAs({ name: "sha", isCard: true }),
          targets: [target],
          addCount: false
        }).set("animate", false);
        await game.delay();
      }
    },
    ai: {
      effect: {
        target(card, player, target, current) {
          if (get.type(card) == "equip") {
            return [1, 3];
          }
        }
      },
      reverseEquip: true,
      noe: true
    }
  }
};
const translates = {
  old_zhangxingcai: "旧张星彩",
  old_zhangxingcai_prefix: "旧",
  old_xusheng: "旧徐盛",
  old_xusheng_prefix: "旧",
  old_lingtong: "旧凌统",
  old_lingtong_prefix: "旧",
  old_zhuran: "旧朱然",
  old_zhuran_prefix: "旧",
  old_caoxiu: "旧曹休",
  old_caoxiu_prefix: "旧",
  old_caozhen: "旧曹真",
  old_caozhen_prefix: "旧",
  old_maliang: "旧马良",
  old_maliang_prefix: "旧",
  old_chenqun: "旧陈群",
  old_chenqun_prefix: "旧",
  old_zhuhuan: "旧朱桓",
  old_zhuhuan_prefix: "旧",
  old_zhuzhi: "旧朱治",
  old_zhuzhi_prefix: "旧",
  old_zhugezhan: "旧诸葛瞻",
  old_zhugezhan_prefix: "旧",
  yuji: "旧于吉",
  yuji_prefix: "旧",
  old_zhangfei: "新杀张飞",
  old_zhangfei_prefix: "新杀",
  old_huatuo: "OL华佗",
  old_huatuo_prefix: "OL",
  old_guanyu: "旧关羽",
  old_guanyu_prefix: "旧",
  ol_zhuran: "OL朱然",
  ol_zhuran_prefix: "OL",
  old_fuhuanghou: "旧伏寿",
  old_fuhuanghou_prefix: "旧",
  old_caochong: "旧曹冲",
  old_caochong_prefix: "旧",
  old_guanqiujian: "旧毌丘俭",
  old_guanqiujian_prefix: "旧",
  old_wangyun: "旧王允",
  old_wangyun_prefix: "旧",
  old_zhaoyun: "新杀赵云",
  old_zhaoyun_prefix: "新杀",
  ol_huaxiong: "旧华雄",
  ol_huaxiong_prefix: "旧",
  old_xiaoqiao: "旧小乔",
  old_xiaoqiao_prefix: "旧",
  old_wanglang: "旧王朗",
  old_wanglang_prefix: "旧",
  old_wangyi: "旧王异",
  old_wangyi_prefix: "旧",
  xin_yujin: "节钺于禁",
  xin_yujin_prefix: "节钺",
  re_yujin: "毅重于禁",
  re_yujin_prefix: "毅重",
  old_guhuo: "蛊惑",
  old_guhuo_info: "你可以扣置一张手牌当做一张基本牌或普通锦囊牌使用或打出，体力值不为0的其他角色依次选择是否质疑。然后，若有质疑的角色，你展示此牌：若为假，此牌作废，这些角色摸一张牌；若为真，这些角色失去1点体力，且若此牌不为♥，此牌作废。",
  old_guhuo_guess: "蛊惑",
  old_jijun: "集军",
  old_jijun_info: "出牌阶段，你可以将任意张手牌置于武将牌上，称为“方”。",
  old_fangtong: "方统",
  old_fangtong_info: "锁定技。结束阶段，若你的“方”数目不小于36，则以你的阵营胜利结束本局游戏。",
  old_zuilun: "罪论",
  old_zuilun_info: "出牌阶段，你可以获得一名其他角色的一张牌（手牌、装备区各一次），然后该角色摸一张牌。",
  old_fuyin: "父荫",
  old_fuyin_info: "锁定技。若你的装备区里没有防具牌，你不能成为手牌数不小于你的其他角色使用【杀】、【决斗】或【火攻】的目标。",
  oldanxu: "安恤",
  oldanxu_info: "出牌阶段限一次。你可以选择手牌数不相等的两名其他角色，其中手牌少的角色获得手牌多的角色的一张手牌并展示之，然后若此牌不为黑桃，你摸一张牌。",
  oldfaen: "法恩",
  oldfaen_info: "当一名角色翻面或横置后，你可以令其摸一张牌。",
  oldxuanfeng: "旋风",
  oldxuanfeng_info: "当你失去装备区里的牌后，你可以选择一项：1.视为对一名其他角色使用一张【杀】；2.对一名距离为1的角色造成1点伤害。",
  ol_yuanshu: "旧袁术",
  ol_yuanshu_prefix: "旧",
  fazheng: "旧法正",
  fazheng_prefix: "旧",
  junk_simayi: "旧晋司马懿",
  junk_simayi_prefix: "旧晋",
  madai: "旧马岱",
  madai_prefix: "旧",
  old_yangzhi: "旧杨芷",
  old_yangzhi_prefix: "旧",
  old_yangyan: "旧杨艳",
  old_yangyan_prefix: "旧",
  old_caorui: "旧曹叡",
  old_caorui_prefix: "旧",
  oldmingjian: "明鉴",
  oldmingjian_info: "出牌阶段开始前，你可以跳过此阶段并将所有手牌交给一名其他角色。若如此做，你结束当前回合，然后其获得一个额外的回合（仅包含出牌阶段）。",
  old_handang: "旧韩当",
  old_handang_prefix: "旧",
  oldgongji: "弓骑",
  oldgongji_info: "你可以将一张装备牌当做无距离限制的【杀】使用或打出。",
  oldjiefan: "解烦",
  oldjiefan_info: "当一名角色A于你的回合外处于濒死状态时，你可以对当前回合角色使用一张【杀】。当此【杀】造成伤害时，你防止此伤害，视为对A使用一张【桃】。",
  old_gaoshun: "旧高顺",
  old_gaoshun_prefix: "旧",
  old_liubiao: "旧刘表",
  old_liubiao_prefix: "旧",
  oldre_liubiao: "RE刘表",
  oldre_liubiao_prefix: "RE",
  oldzishou: "自守",
  oldzishou_info: "摸牌阶段，若你已受伤，你可令额定摸牌数+X（X为你已损失的体力值），然后跳过下一个出牌阶段。",
  old_huanghao: "旧黄皓",
  old_huanghao_prefix: "旧",
  oldqinqing: "寝情",
  oldqinqing_info: "结束阶段，你可以选择一名攻击范围内含有主公的其他角色，然后你弃置该角色的一张牌（无牌则不弃），并令其摸一张牌。若该角色的手牌数大于主公，你摸一张牌。",
  oldhuisheng: "贿生",
  oldhuisheng_info: "每名角色限一次。当你受到其他角色对你造成的伤害时，你可以令其观看你任意数量的牌并令其选择一项：1.获得这些牌中的一张并防止此伤害；2.弃置等量的牌。",
  old_dingfeng: "旧丁奉",
  old_dingfeng_prefix: "旧",
  new_caoren: "旧曹仁",
  new_caoren_prefix: "旧",
  old_liyan: "旧李严",
  old_liyan_prefix: "旧",
  old_chendao: "旧陈到",
  old_chendao_prefix: "旧",
  old_caocao: "旧神曹操",
  old_caocao_prefix: "旧神",
  junkguixin: "归心",
  junkguixin_info: "回合结束时，你可以选择一项：①获得剩余武将牌堆的所有主公技的其中一个技能；②更改一名其他角色的势力。",
  old_caochun: "旧曹纯",
  old_caochun_prefix: "旧",
  old_guanyinping: "旧关银屏",
  old_guanyinping_prefix: "旧",
  panfeng: "旧潘凤",
  panfeng_prefix: "旧",
  old_shixie: "旧士燮",
  old_shixie_prefix: "旧",
  old_wuyi: "旧吴懿",
  old_wuyi_prefix: "旧",
  one_dc_sp_machao: "牢SP马超",
  one_dc_sp_machao_prefix: "牢|SP",
  two_dc_sp_machao: "牢SP马超",
  two_dc_sp_machao_prefix: "牢|SP",
  cx_majun: "传械马钧",
  cx_majun_ab: "牢马钧",
  cx_majun_prefix: "牢",
  qq_majun: "奇巧马钧",
  qq_majun_ab: "牢马钧",
  qq_majun_prefix: "牢",
  xj_peixiu: "牢裴秀",
  xj_peixiu_prefix: "牢",
  hr_wufu: "牢伍孚",
  hr_wufu_prefix: "牢",
  new_simayi: "牢神司马懿",
  new_simayi_prefix: "牢|神",
  junk_sunquan: "牢神孙权",
  junk_sunquan_prefix: "牢|神",
  ol_baosanniang: "牢鲍三娘",
  ol_baosanniang_prefix: "牢",
  x_yao_yuanshu: "牢爻袁术",
  x_yao_yuanshu_prefix: "牢|爻",
  yao_yaoyi: "爻疑",
  yao_yaoyi_tag: "invisible",
  yao_yaoyi_info: "锁定技。①你的起始手牌背置。②每回合每种牌名限一次，你可以将一张背置的牌当作任意基本牌或普通锦囊牌使用或打出。",
  yao_chenwei: "谶纬",
  yao_chenwei_info: "转换技。当你使用背置牌时，你可以，阳：令一名角色将你的一张手牌翻面；阴：获得一名其他角色的一张牌并将此牌背置。",
  sy_baosanniang: "手杀牢鲍三娘",
  sy_baosanniang_prefix: "手杀|牢",
  fx_baosanniang: "芳许鲍三娘",
  fx_baosanniang_ab: "手杀牢鲍三娘",
  fx_baosanniang_prefix: "手杀|牢",
  x_dc_zhangqiying: "新杀牢张琪瑛",
  x_dc_zhangqiying_prefix: "新杀|牢",
  two_yj_puyuan: "牢SP蒲元",
  two_yj_puyuan_prefix: "牢|SP",
  two_yj_tengjia: "牢藤甲男孩",
  two_yj_tengjia_prefix: "牢",
  two_yj_hanbing: "牢寒冰剑少女",
  two_yj_hanbing_prefix: "牢",
  chegu: "彻骨",
  chegu_info: "你于回合内使用非装备牌指定目标时，可以取消此牌的全部目标并选择一项：1.弃置一名角色至多[2]张牌；2.弃置至多[2]名角色各一张牌。然后若以此法弃置的牌颜色或类型均相同，本回合此技能[]中的数值均+1。",
  jianrou: "剑柔",
  jianrou_info: "每轮限一次，你受到伤害时，可以弃置两张牌并防止此伤害。若你以此法弃置的牌颜色或类型相同，你摸一张牌并令此技能视为未发动过。"
};
const characterTitles = {
  //two_yj_hanbing: "",
  //two_yj_tengjia: "",
  old_zhangxingcai: "将门红妆",
  old_xusheng: "奋身御前",
  old_lingtong: "豪情烈胆",
  old_zhuran: "猇亭之战",
  old_caoxiu: "下辨扬威",
  old_caozhen: "霜雷之威",
  old_maliang: "白眉智士",
  old_chenqun: "动仗名义",
  old_zhuhuan: "飞刀制敌",
  old_zhuzhi: "安国将军",
  old_zhugezhan: "决战邓艾",
  yuji: "太平道人",
  old_zhangfei: "智擒严颜",
  old_huatuo: "药坛圣手",
  old_guanyu: "军神封侯",
  old_fuhuanghou: "孤注一掷",
  old_caochong: "资优神童",
  old_guanqiujian: "攻破东川",
  old_wangyun: "连计将成",
  old_zhaoyun: "武动乾坤",
  ol_huaxiong: "魔将",
  old_xiaoqiao: "花好月圆",
  old_wanglang: "骧龙御宇",
  old_wangyi: "决意的巾帼",
  xin_yujin: "讨暴坚垒",
  re_yujin: "坚毅果敢",
  ol_yuanshu: "见玺心悦",
  fazheng: "蜀汉的辅翼",
  junk_simayi: "三狼吞魏",
  //这个其实是神司马懿的皮肤
  madai: "平北将军",
  old_yangzhi: "妍芷艳质",
  old_yangyan: "妍芷艳质",
  old_caorui: "勤于朝政",
  old_handang: "冠军太守",
  old_gaoshun: "攻无不克",
  old_liubiao: "跨蹈汉南",
  oldre_liubiao: "外宽内忌",
  old_huanghao: "恃权贪贿",
  old_dingfeng: "清侧重臣",
  new_caoren: "神勇可撼",
  old_liyan: "督运粮草",
  old_chendao: "白毦统领",
  old_caocao: "挟汉临诸夏",
  old_caochun: "长坂败备",
  old_guanyinping: "将门虎女",
  panfeng: "联军上将",
  old_shixie: "雄长一州",
  old_wuyi: "高昂果劲",
  one_dc_sp_machao: "杵枪摧敌",
  two_dc_sp_machao: "咬牙切齿",
  cx_majun: "名巧天下",
  qq_majun: "名巧天下",
  xj_peixiu: "玄静守真",
  hr_wufu: "忠虹贯日",
  new_simayi: "权控三势",
  junk_sunquan: "历战年兽",
  //这个是标孙权的皮肤
  ol_baosanniang: "翩若游凤",
  old_manchong: "严刑峻法",
  old_yj_jushou: "献策不绝"
};
const characterIntro = {};
const characterFilters = {};
const dynamicTranslates = {
  chegu(player, skill) {
    const info = lib.translate[`${skill}_info`], num = 2 + player.countMark(`${skill}_effect`);
    return info.replaceAll("[2]", `[${num}]`);
  },
  yao_chenwei(player, skill) {
    const bool = player.storage[skill];
    let str1 = "阳：令一名角色将你的一张手牌翻面";
    let str2 = "获得一名其他角色的一张牌并将此牌背置";
    if (bool) {
      str2 = `<span class="bluetext">${str2}</span>`;
    } else {
      str1 = `<span class="firetext">${str1}</span>`;
    }
    return `转换技。当你使用背置牌时，你可以，${str1}；阴：${str2}。`;
  }
};
const voices = {
  "#kuangfu1": "这家伙还是给我用吧！",
  "#kuangfu2": "吾乃上将潘凤，可斩华雄！",
  "#panfeng:die": "潘凤又被华雄斩啦……",
  "#new_reyaowu_ol_huaxiong1": "别得意的太早。",
  "#new_reyaowu_ol_huaxiong2": "黄毛小儿，就这两下子吗？",
  "#chulao1": "病入膏肓，需下猛药。",
  "#chulao2": "病去，如抽丝。",
  "#leiji1": "雷公助我！",
  "#leiji2": "以我之真气，合天地之造化！",
  "#guidao1": "哼哼哼哼~",
  "#guidao2": "天下大势，为我所控。",
  "#kuanggu1": "我会怕你吗！",
  "#kuanggu2": "真是美味啊！",
  "#duanliang11": "截其源，断其粮，贼可擒也。",
  "#duanliang12": "人是铁，饭是钢。",
  "#liegong1": "百步穿杨！",
  "#liegong2": "中！",
  "#xiemu1": "暴戾之气，伤人害己。",
  "#xiemu2": "休要再起战事！",
  "#naman1": "慢着，让我来！",
  "#naman2": "弃暗投明，光耀门楣。",
  "#old_maliang:die": "皇叔为何不听我之言？",
  "#youdi1": "无名小卒，可敢再前进一步！",
  "#youdi2": "予以小利，必有大获。",
  "#old_zhuhuan:die": "这巍巍巨城，吾竟无力撼动……",
  "#xinzhan1": "吾通晓兵法，世人皆知。",
  "#xinzhan2": "用兵之道，攻心为上。",
  "#huilei1": "丞相视某如子，某以丞相为父。",
  "#huilei2": "谡愿以死安大局。",
  "#oldzhenlie1": "我，绝不屈服！",
  "#oldzhenlie2": "休要小看妇人志气！",
  "#oldmiji1": "我将尽我所能！",
  "#oldmiji2": "奇谋，只在绝境中诞生！",
  "#old_wangyi:die": "忠义已尽，死又何妨？",
  "#oldqianxi1": "伤其十指，不如断其一指！",
  "#oldqianxi2": "斩草除根，除恶务尽！",
  "#madai:die": "反骨贼已除，丞相放心……",
  "#mengjin1": "你，可敢挡我？",
  "#mengjin2": "我要杀你们个片甲不留！",
  "#pangde:die": "四面都是水，我命休矣……",
  "#enyuan1": "滴水之恩，涌泉以报。",
  "#enyuan2": "得人恩果千年记。",
  "#enyuan3": "睚眦之怨，无不报复。",
  "#enyuan4": "谁敢得罪我？",
  "#xuanhuo1": "给你的，十倍奉还给我。",
  "#xuanhuo2": "重用许靖，以眩远近。",
  "#fazheng:die": "蜀翼既折，蜀汉哀矣……",
  "#yizhong1": "不先为备，何以待敌？",
  "#yizhong2": "稳重行军，百战不殆！",
  "#xin_yujin:die": "呃，晚节不保……",
  "#xiahouyuan:die": "竟然……比我还……快……",
  "#weiyan:die": "谁敢杀我？！呃啊……",
  "#xuhuang:die": "一顿不吃，饿得慌……",
  "#huangtian2_zhangjiao1": "岁在甲子，天下大吉！",
  "#huangtian2_zhangjiao2": "苍天已死，黄天当立！",
  "#zhangjiao:die": "黄天，也死了……",
  "#wuyan1": "唉，一切尽在不言中。",
  "#wuyan2": "嘘，言多必失啊。",
  "#jujian1": "将军岂愿抓牌乎？",
  "#jujian2": "我看好你！",
  "#xushu:die": "娘……孩儿不孝……向您……请罪……",
  "#old_guhuo1": "你信吗？",
  "#old_guhuo2": "猜猜看哪~",
  "#yuji:die": "竟然……被猜到了……",
  "#old_fuhun1": "呐喊破敌，锐不可挡！",
  "#old_fuhun2": "匹夫之勇，插标卖首！",
  "#wusheng_old_guanzhang": "武圣之名，威震华夏！",
  "#paoxiao_old_guanzhang": "杀呀！",
  "#old_guanzhang:die": "父亲，我来了……",
  "#huangzhong:die": "不得不服老啦~"
};
const characterSort = {
  old_standard: ["ol_yuanshu"],
  old_shenhua: ["old_caocao", "yuji", "zhangjiao", "old_zhugezhan", "old_guanqiujian", "xiahouyuan", "weiyan", "old_xiaoqiao", "pangde", "xuhuang", "huangzhong", "new_caoren", "old_chendao"],
  old_refresh: ["old_zhangfei", "old_huatuo", "old_zhaoyun", "ol_huaxiong", "old_guanyu"],
  old_yijiang1: ["masu", "xushu", "xin_yujin", "old_xusheng", "old_lingtong", "fazheng", "old_gaoshun", "re_yujin"],
  old_yijiang2: ["old_zhonghui", "madai", "old_handang", "old_liubiao", "oldre_liubiao", "old_guanzhang", "old_wangyi"],
  old_yijiang3: ["liru", "old_zhuran", "old_fuhuanghou", "old_caochong"],
  old_yijiang4: ["old_caozhen", "old_chenqun", "old_zhuhuan", "old_caorui", "old_wuyi"],
  old_yijiang5: ["old_caoxiu", "old_zhuzhi"],
  old_yijiang67: ["old_huanghao", "old_liyan"],
  old_sp: ["old_shixie", "panfeng", "old_wanglang", "old_maliang", "old_zhangxingcai", "old_wangyun", "old_dingfeng", "old_guanyinping"],
  old_online: ["junk_simayi", "old_yangyan", "old_yangzhi", "junk_sunquan", "ol_baosanniang"],
  old_decade: ["two_yj_hanbing", "two_yj_tengjia", "x_yao_yuanshu", "hr_wufu", "xj_peixiu", "qq_majun", "cx_majun", "one_dc_sp_machao", "two_dc_sp_machao", "x_dc_zhangqiying", "two_yj_puyuan"],
  old_mobile: ["old_caochun", "new_simayi", "fx_baosanniang", "sy_baosanniang"]
};
const characterSortTranslate = {
  old_standard: "标准包",
  old_shenhua: "神话再临",
  old_refresh: "界限突破",
  old_yijiang1: "一将成名2011",
  old_yijiang2: "一将成名2012",
  old_yijiang3: "一将成名2013",
  old_yijiang4: "一将成名2014",
  old_yijiang5: "一将成名2015",
  old_yijiang67: "原创设计",
  old_sp: "SP",
  old_online: "Online",
  old_decade: "十周年",
  old_mobile: "移动版"
};
game.import("character", function() {
  return {
    name: "old",
    connect: true,
    character: { ...characters },
    characterSort: {
      old: characterSort
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
