import { game, get, lib, _status, ui } from "noname";
const characters = {
  //起
  jsrg_liuhong: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgchaozheng", "jsrgshenchong", "jsrgjulian"],
    isZhugong: true
  },
  jsrg_hejin: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgzhaobing", "jsrgzhuhuan", "jsrgyanhuo"]
  },
  jsrg_sunjian: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgpingtao", "jsrgjuelie"]
  },
  jsrg_huangfusong: {
    sex: "male",
    group: "qun",
    hp: 4,
    names: "皇甫|嵩",
    skills: ["jsrgguanhuo", "jsrg_new_juxia"]
  },
  jsrg_xushao: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["sbyingmen", "sbpingjian"]
  },
  jsrg_dongbai: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["jsrgshichong", "jsrg_new_lianzhu"]
  },
  jsrg_qiaoxuan: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["jsrg_new_juezhi", "jsrgjizhao"]
  },
  jsrg_yangbiao: {
    sex: "male",
    group: "qun",
    hp: 3,
    maxHp: 4,
    skills: ["jsrgzhaohan", "jsrgrangjie", "jsrgyizheng"],
    dieAudios: ["yangbiao"],
    clans: ["弘农杨氏"]
  },
  jsrg_kongrong: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["jsrg_new_lirang", "jsrg_new_zhengyi"],
    dieAudios: ["kongrong"]
  },
  jsrg_zhujun: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgfendi", "jsrgjuxiang"]
  },
  jsrg_liubei: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgjishan", "jsrgzhenqiao"]
  },
  jsrg_wangyun: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["jsrgshelun", "jsrgfayi"],
    clans: ["太原王氏"]
  },
  jsrg_liuyan: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["xinfu_limu", "jsrgtushe", "jsrgtongjue"],
    isZhugong: true,
    dieAudios: ["liuyan"]
  },
  jsrg_caocao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgzhenglve", "jsrghuilie"]
  },
  jsrg_nanhualaoxian: {
    sex: "male",
    group: "qun",
    hp: 3,
    names: "庄|周",
    skills: ["jsrgshoushu", "jsrgxundao", "jsrglinghua"]
  },
  //承
  jsrg_sunce: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["jsrgduxing", "jsrgzhiheng", "jsrgzhasi", "jsrgbashi"],
    isZhugong: true
  },
  jsrg_xuyou: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["jsrglipan", "jsrgqingxi", "jsrgjinmie"],
    doubleGroup: ["wei", "qun"]
  },
  jsrg_lvbu: {
    sex: "male",
    group: "qun",
    hp: 5,
    skills: ["jsrgwuchang", "jsrgqingjiao", "jsrgchengxu"],
    doubleGroup: ["shu", "qun"]
  },
  jsrg_zhanghe: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["jsrgqiongtu", "jsrgxianzhu"],
    doubleGroup: ["wei", "qun"]
  },
  jsrg_zoushi: {
    sex: "female",
    group: "qun",
    hp: 3,
    names: "邹|null",
    skills: ["jsrgguyin", "jsrgzhangdeng"]
  },
  jsrg_guanyu: {
    sex: "male",
    group: "shu",
    hp: 5,
    skills: ["jsrgguanjue", "jsrgnianen"],
    groupBorder: "wei"
  },
  jsrg_chendeng: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["jsrglunshi", "jsrgguitu"]
  },
  jsrg_zhenji: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["jsrgjixiang", "jsrgchengxian"]
  },
  jsrg_zhangliao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgzhengbing", "jsrgtuwei"],
    doubleGroup: ["wei", "qun"]
  },
  jsrg_xugong: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["jsrgbiaozhao", "jsrgyechou"]
  },
  jsrg_chunyuqiong: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgcangchu", "jsrgshishou"],
    dieAudios: ["re_chunyuqiong"],
    names: "淳于|琼"
  },
  //转
  jsrg_guojia: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["jsrgqingzi", "jsrgdingce", "jsrgzhenfeng"]
  },
  jsrg_zhangfei: {
    sex: "male",
    group: "shu",
    hp: 5,
    skills: ["jsrgbaohe", "jsrgxushi"]
  },
  jsrg_machao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgzhuiming", "mashu"]
  },
  jsrg_lougui: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["jsrgshacheng", "jsrgninghan"]
  },
  jsrg_zhangren: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgfuni", "jsrgchuanxin"]
  },
  jsrg_huangzhong: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["jsrgcuifeng", "jsrgdengnan"]
  },
  jsrg_xiahourong: {
    sex: "male",
    group: "wei",
    hp: 4,
    names: "夏侯|荣",
    skills: ["jsrgfenjian"]
  },
  jsrg_sunshangxiang: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["jsrgguiji", "jsrgjiaohao"]
  },
  jsrg_pangtong: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["jsrgmanjuan", "jsrgyangming"]
  },
  jsrg_hansui: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgniluan", "jsrghuchou", "jsrgjiemeng"],
    isZhugong: true
  },
  jsrg_zhangchu: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["jsrghuozhong", "jsrgrihui"],
    dieAudios: ["zhangchu"]
  },
  jsrg_xiahouen: {
    sex: "male",
    group: "wei",
    hp: 4,
    names: "夏侯|恩",
    skills: ["jsrghujian", "jsrgshili"],
    img: "image/character/tw_xiahouen.jpg",
    dieAudios: ["tw_xiahouen"]
  },
  jsrg_fanjiangzhangda: {
    sex: "male",
    group: "wu",
    hp: 5,
    names: "范|强-张|达",
    skills: ["jsrgfushan"]
  },
  //合
  jsrg_zhugeliang: {
    sex: "male",
    group: "shu",
    hp: 3,
    names: "诸葛|亮",
    skills: ["jsrgwentian", "jsrgchushi", "jsrgyinlve"],
    clans: ["琅琊诸葛氏"]
  },
  jsrg_jiangwei: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["jsrgjinfa", "jsrgfumou", "jsrgxuanfeng"],
    groupBorder: "wei"
  },
  jsrg_luxun: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["jsrgyoujin", "jsrgdailao", "jsrgzhubei"],
    clans: ["吴郡陆氏"]
  },
  jsrg_zhaoyun: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["jsrglonglin", "jsrgzhendan"]
  },
  jsrg_simayi: {
    sex: "male",
    group: "wei",
    hp: 4,
    names: "司马|懿",
    skills: ["jsrgyingshi", "jsrgtuigu"]
  },
  jsrg_guoxun: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["jsrgeqian", "jsrgfusha"]
  },
  jsrg_sunlubansunluyu: {
    sex: "female",
    group: "wu",
    hp: 3,
    names: "孙|鲁班-孙|鲁育",
    skills: ["jsrgdaimou", "jsrgfangjie"]
  },
  jsrg_caofang: {
    sex: "male",
    group: "wei",
    hp: 3,
    maxHp: 4,
    skills: ["jsrgzhaotu", "jsrgjingju", "jsrgweizhui"],
    isZhugong: true
  },
  jsrg_sunjun: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["jsrgyaoyan", "jsrgbazheng"]
  },
  jsrg_liuyong: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["jsrgdanxin", "jsrgfengxiang"],
    dieAudios: ["liuyong"]
  },
  jsrg_weiwenzhugezhi: {
    sex: "male",
    group: "wu",
    hp: 4,
    names: "卫|温-诸葛|直",
    skills: ["jsrgfuhai"],
    dieAudios: ["weiwenzhugezhi"]
  },
  jsrg_zhangxuan: {
    sex: "female",
    group: "wu",
    hp: 4,
    skills: ["jsrgtongli", "jsrgshezang"],
    dieAudios: ["zhangxuan"]
  },
  jsrg_gaoxiang: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["jsrgchiying"],
    dieAudios: ["gaoxiang"]
  },
  jsrg_guozhao: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["jsrgpianchong", "jsrgzunwei"],
    dieAudios: ["guozhao"]
  },
  //衰
  jsrg_yuanshao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgzhimeng", "jsrgtianyu", "jsrgzhuni", "jsrghezhi"],
    isZhugong: true
  },
  jsrg_caojiewangfu: {
    sex: "male",
    group: "qun",
    hp: 3,
    names: "曹|节-王|甫",
    skills: ["jsrgzonghai", "jsrgjueyin"]
  },
  jsrg_songhuanghou: {
    sex: "female",
    group: "qun",
    hp: 3,
    names: "宋|null",
    skills: ["jsrgzhongzen", "jsrgxuchong"]
  },
  jsrg_zhangjiao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgxiangru", "jsrgwudao"]
  },
  jsrg_yangqiu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["mbsaojian"]
  },
  jsrg_dongzhuo: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgguanshi", "jsrgcangxiong", "jsrgjiebing"]
  },
  jsrg_zhanghuan: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgzhushou", "jsrgyangge"]
  },
  jsrg_liubiao: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["jsrgyansha", "jsrgqingping"]
  },
  jsrg_yl_luzhi: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["jsrgruzong", "jsrgdaoren"]
  },
  jsrg_chenfan: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["jsrggangfen", "jsrgdangren"]
  },
  jsrg_zhangju: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgqiluan", "jsrgxiangjia"]
  },
  //兴
  jsrg_jiananfeng: {
    sex: "female",
    group: "jin",
    hp: 3,
    skills: ["jsrgshanzheng", "jsrgxiongbao", "jsrgliedu"]
  },
  jsrg_wenyang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["jsrgfuzhen"]
  },
  jsrg_zhugedan: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["jsrgzuozhan", "jsrgcuibing", "jsrglangan"],
    names: "诸葛|诞",
    clans: ["琅琊诸葛氏"]
  },
  jsrg_wangjun: {
    sex: "male",
    group: "jin",
    hp: 4,
    skills: ["jsrgchengliu", "jsrgjianlou"]
  },
  jsrg_limi: {
    sex: "male",
    group: "shu",
    groupBorder: "jin",
    hp: 3,
    skills: ["jsrgciyin", "jsrgchendu"]
  },
  jsrg_simazhao: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["jsrgqiantun", "jsrgxiezheng", "jsrgzhaoxiong"],
    names: "司马|昭"
  },
  jin_jsrg_simazhao: {
    sex: "male",
    group: "jin",
    isZhugong: true,
    hp: 4,
    isUnseen: true,
    skills: ["jsrgweisi", "jsrgxiezheng", "jsrgdangyi"],
    names: "司马|昭"
  },
  jsrg_dengai: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["jsrgpiqi", "jsrgzhoulin"]
  },
  jsrg_simaliang: {
    sex: "male",
    group: "jin",
    hp: 3,
    maxHp: 4,
    skills: ["jsrgsheju", "jsrgzuwang"],
    names: "司马|亮"
  },
  jsrg_tufashujineng: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["jsrgqinrao", "jsrgfuran"],
    names: "秃发|树机能"
  },
  jsrg_lukang: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["jsrgzhuwei", "jsrgkuangjian"],
    clans: ["吴郡陆氏"]
  },
  jsrg_malong: {
    sex: "male",
    group: "jin",
    hp: 4,
    skills: ["jsrgfennan", "jsrgxunji"]
  }
};
const cards = {
  xumou_jsrg: {
    type: "special_delay",
    allowDuplicate: true,
    blankCard: true,
    fullimage: true,
    wuxieable: false,
    async effect(event, trigger, player) {
      const card = get.autoViewAs(event.cards[0]);
      card.storage.xumou_jsrg = true;
      const result = await player.chooseUseTarget(card, event.cards, `蓄谋:是否使用${get.translation(card)}？`, `请选择要使用的目标。若不使用此牌，则判定区内的所有"蓄谋"牌都将被置入弃牌堆。`).forResult();
      if (!result.bool) {
        const cards2 = player.getCards("j", (card2) => (card2.viewAs || card2.name) == "xumou_jsrg");
        if (cards2.length > 0) {
          await player.loseToDiscardpile(cards2);
        }
      } else {
        player.addTempSkill("xumou_jsrg_temp", "phaseChange");
        player.markAuto("xumou_jsrg_temp", [event.cards[0].name]);
      }
    }
  },
  ying: {
    audio: true,
    fullskin: true,
    type: "basic",
    cardcolor: "spade",
    enable: false,
    destroy: "discardPile",
    getYing(count) {
      var cards2 = [];
      if (typeof count != "number") {
        count = 1;
      }
      while (count--) {
        let card = game.createCard("ying", "spade", 1);
        cards2.push(card);
      }
      return cards2;
    },
    ai: {
      basic: {
        useful: 0,
        value: 0
      }
    }
  }
};
const pinyins = {};
const skills = {
  //江山如故·衰
  //张举
  jsrgqiluan: {
    usable: 2,
    enable: "chooseToUse",
    hiddenCard(player, name) {
      return (name === "sha" || name === "shan") && (player.getStat("skill").jsrgqiluan || 0) < 2 && player.countCards("he") > 0;
    },
    filter(event, player) {
      return (event.filterCard({ name: "sha", isCard: true }, player, event) || event.filterCard({ name: "shan", isCard: true }, player, event)) && player.hasCard((card) => lib.filter.cardDiscardable(card, player, "jsrgqiluan"));
    },
    chooseButton: {
      dialog(event, player) {
        const vcards = [];
        if (event.filterCard({ name: "sha", isCard: true }, player, event)) {
          vcards.push("sha");
        }
        if (event.filterCard({ name: "shan", isCard: true }, player, event)) {
          vcards.push("shan");
        }
        return ui.create.dialog("起乱", [vcards, "vcard"], "hidden");
      },
      backup(links, player) {
        return {
          viewAs: { name: links[0][2], isCard: true },
          filterCard: () => false,
          selectCard: -1,
          popname: true,
          log: false,
          async precontent(event, trigger, player2) {
            const stat = player2.getStat("skill");
            if (!stat.jsrgqiluan) {
              stat.jsrgqiluan = 0;
            }
            stat.jsrgqiluan++;
            const evt = event.getParent();
            player2.logSkill("jsrgqiluan");
            const { cards: cards2, targets } = await player2.chooseCardTarget({
              prompt: "弃置任意张牌并选择等量角色",
              position: "he",
              filterCard: (card) => lib.filter.cardDiscardable(card, get.player(), "jsrgqiluan"),
              filterTarget: lib.filter.notMe,
              selectCard: [1, Infinity],
              selectTarget: [1, Infinity],
              filterOk() {
                return ui.selected.cards.length === ui.selected.targets.length;
              },
              forced: true
            }).forResult();
            player2.line(targets);
            targets.sortBySeat();
            const cardsNum = cards2.length;
            await player2.discard(cards2);
            let hasSomeoneUsed = false;
            for (const target of targets) {
              const cardName = event.result.card.name;
              const chooseToRespondEvent = target.chooseToRespond("是否替" + get.translation(player2) + "打出一张" + get.translation(cardName) + "？", { name: cardName });
              chooseToRespondEvent.set("ai", () => {
                const event2 = _status.event;
                return get.attitude(event2.player, event2.source) - 2;
              });
              chooseToRespondEvent.set("source", player2);
              chooseToRespondEvent.set("skillwarn", "替" + get.translation(player2) + "打出一张" + get.translation(cardName));
              chooseToRespondEvent.noOrdering = true;
              chooseToRespondEvent.autochoose = cardName === "sha" ? lib.filter.autoRespondSha : lib.filter.autoRespondShan;
              const { bool, card, cards: cards3 } = await chooseToRespondEvent.forResult();
              if (bool) {
                hasSomeoneUsed = true;
                event.result.card = card;
                event.result.cards = cards3;
                event.result._apply_args = {
                  throw: false,
                  addSkillCount: false
                };
                target.addExpose(0.2);
                await player2.draw(cardsNum);
                break;
              }
            }
            if (!hasSomeoneUsed) {
              evt.goto(0);
            }
          }
        };
      },
      prompt(links, player) {
        return `请选择【${get.translation(links[0][2])}】的目标`;
      }
    }
    //技能收益太低，不写AI了
  },
  jsrgxiangjia: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.getEquips(1).length > 0;
    },
    viewAs: {
      name: "jiedao",
      isCard: true
    },
    filterCard: () => false,
    selectCard: -1,
    onuse(result, player) {
      player.addTempSkill("jsrgxiangjia_effect");
    },
    //技能收益太低，先不写AI了
    subSkill: {
      effect: {
        charlotte: true,
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          const card = get.autoViewAs({ name: "jiedao", isCard: true });
          return event.skill === "jsrgxiangjia" && event.targets.some((current) => {
            return current.isIn() && current.canUse(card, player);
          });
        },
        popup: false,
        async content(event, trigger, player) {
          const card = get.autoViewAs({ name: "jiedao", isCard: true });
          for (const target of trigger.targets) {
            if (target.isIn() && target.canUse(card, player)) {
              const result = await target.chooseTarget(`是否对${get.translation(player)}使用【借刀杀人】？`, `操作提示：直接选择${get.translation(player)}使用【杀】的目标角色`, (card2, player2, target2) => {
                const source = get.event().source;
                return lib.card.jiedao.filterAddedTarget(card2, player2, target2, source);
              }).set("source", player).set("ai", (target2) => {
                const player2 = get.player(), card2 = get.autoViewAs({ name: "jiedao", isCard: true });
                const source = get.event().source;
                let eff = get.effect(source, card2, player2, player2);
                _status.event.preTarget = source;
                eff += get.effect(target2, card2, player2, player2);
                delete _status.event.preTarget;
                return eff;
              }).forResult();
              if (result.bool) {
                await target.useCard(get.autoViewAs({ name: "jiedao", isCard: true }), [player, result.targets[0]]);
              }
            }
          }
        }
      }
    }
  },
  //陈蕃
  jsrggangfen: {
    trigger: { global: "useCardToPlayer" },
    filter(event, player) {
      if (event.card.name !== "sha") {
        return false;
      }
      if (event.player === player || event.player.countCards("h") <= player.countCards("h")) {
        return false;
      }
      return !event.targets.includes(player) && lib.filter.targetEnabled(event.card, event.player, player);
    },
    logTarget: "player",
    prompt2(event, player) {
      return `你可以成为该角色使用的${get.translation(event.card)}的额外目标，并令所有其他角色也选择是否成为此牌的目标。然后该角色展示所有手牌，若其中的黑色牌数量小于此牌目标数，则此牌无效。`;
    },
    check(event, player) {
      if (event.targets.reduce((p, c) => {
        return p + get.effect(c, event.card, event.player, player);
      }, 0) >= 0) {
        return false;
      }
      return game.countPlayer((current) => event.targets.includes(current) || get.attitude(current, player) > 0) > event.player.countCards("h");
    },
    async content(event, trigger, player) {
      trigger.targets.add(player);
      const source = trigger.player;
      const targets = game.filterPlayer((current) => {
        return current !== player && current !== source && !trigger.targets.includes(current) && lib.filter.targetEnabled(trigger.card, source, current);
      }).sortBySeat();
      for (const target of targets) {
        const { bool } = await target.chooseBool(`是否也成为${get.translation(trigger.card)}的目标？`, `若最终目标数大于${get.translation(source)}手牌中的黑色牌数，则此牌无效。`).set("ai", () => get.event().choice).set(
          "choice",
          (() => {
            if (get.attitude(target, player) < 0) {
              return false;
            }
            return game.countPlayer((current) => trigger.targets.includes(current) || get.attitude(current, player) > 0) > trigger.player.countCards("h");
          })()
        ).forResult();
        if (bool) {
          target.addExpose(0.15);
          target.chat("我也上！");
          target.line(source);
          trigger.targets.add(target);
          game.log(target, "也成为了", trigger.card, "的目标");
          await game.delayx();
        }
      }
      await source.showHandcards();
      const blackNum = source.countCards("h", (card) => get.color(card, source) === "black");
      if (blackNum < trigger.targets.length) {
        trigger.getParent().all_excluded = true;
        trigger.targets.length = 0;
        trigger.untrigger();
      }
    },
    ai: {
      expose: 0.2,
      threaten: 4.5
    }
  },
  jsrgdangren: {
    zhuanhuanji: true,
    enable: "chooseToUse",
    filter(event, player) {
      if (player.storage.jsrgdangren) {
        return false;
      }
      const card = get.autoViewAs({ name: "tao", isCard: true });
      return event.filterCard(card, player, event) && event.filterTarget(card, player, player);
    },
    viewAs: { name: "tao", isCard: true },
    filterTarget(card, player, target) {
      return target === player;
    },
    selectTarget: -1,
    filterCard() {
      return false;
    },
    selectCard: -1,
    check() {
      const player = get.player();
      if (player.isDying()) {
        return true;
      }
      return game.countPlayer((current) => {
        return current.hp <= 2 && get.attitude(player, current) > 0;
      }) > game.countPlayer((current) => {
        return current.hp <= 2 && get.attitude(player, current) <= 0;
      });
    },
    log: false,
    prompt: "视为对自己使用【桃】",
    async precontent(event, trigger, player) {
      player.logSkill("jsrgdangren");
      player.changeZhuanhuanji("jsrgdangren");
    },
    hiddenCard(player, name) {
      return name === "tao";
    },
    mark: true,
    marktext: "☯",
    intro: {
      content(storage) {
        if (storage) {
          return "当你可以对其他角色使用【桃】时，你须视为使用之。";
        }
        return "当你需要对自己使用【桃】时，你可以视为使用之";
      }
    },
    ai: {
      //仅能对自己使用桃
      save: true,
      skillTagFilter(player, arg, target) {
        return player == target != player.storage.jsrgdangren;
      }
    },
    group: "jsrgdangren_save",
    subSkill: {
      save: {
        trigger: { player: "chooseToUseBegin" },
        filter(event, player) {
          if (event.responded || !player.storage.jsrgdangren) {
            return false;
          }
          const card = get.autoViewAs({ name: "tao", isCard: true });
          if (!event.filterCard(card, player, event)) {
            return false;
          }
          const backup = _status.event;
          _status.event = event;
          const hasTarget = game.hasPlayer((current) => {
            return current !== player && event.filterTarget(card, player, current);
          });
          _status.event = backup;
          return hasTarget;
        },
        async cost(event, trigger, player) {
          const card = get.autoViewAs({ name: "tao", isCard: true });
          const backup = _status.event;
          _status.event = trigger;
          const targets = game.filterPlayer((current) => {
            return current !== player && trigger.filterTarget(card, player, current);
          });
          _status.event = backup;
          if (targets.length === 1) {
            event.result = { bool: true, targets };
          } else {
            event.result = await player.chooseTarget(true, "当仁：请选择【桃】的目标", (card2, player2, target) => {
              return get.event().targets.includes(target);
            }).set("targets", targets).forResult();
          }
        },
        async content(event, trigger, player) {
          trigger.result = {
            bool: true,
            card: { name: "tao", isCard: true },
            targets: event.targets
          };
          trigger.untrigger();
          trigger.set("responded", true);
          player.changeZhuanhuanji("jsrgdangren");
        }
      }
    }
  },
  //卢植
  jsrgruzong: {
    trigger: { player: "phaseEnd" },
    filter(event, player) {
      const target = lib.skill.jsrgruzong.getTarget(player);
      if (!target) {
        return false;
      }
      const hs = player.countCards("h");
      if (target !== player) {
        return target.countCards("h") > hs;
      }
      return game.hasPlayer((current) => current !== player && current.countCards("h") < hs);
    },
    getTarget(player) {
      const targets = [];
      player.checkHistory("useCard", (evt) => targets.addArray(evt.targets));
      return targets.length === 1 ? targets[0] : null;
    },
    frequent: true,
    async cost(event, trigger, player) {
      const target = lib.skill.jsrgruzong.getTarget(player);
      if (target !== player) {
        const bool = await player.chooseBool(get.prompt(event.skill, target), "将手牌数摸至与该角色相同").set("frequentSkill", event.skill);
        if (bool) {
          event.result = {
            bool,
            targets: [target],
            cost_data: "drawToOthers"
          };
        }
      } else {
        event.result = await player.chooseTarget(
          get.prompt(event.skill),
          "令任意名角色将手牌数摸至与你相同",
          (card, player2, target2) => {
            return target2.countCards("h") < player2.countCards("h");
          },
          [1, Infinity]
        ).set("ai", (target2) => {
          const player2 = get.player();
          return get.attitude(player2, target2) * Math.sqrt(player2.countCards("h") - target2.countCards("h")) / (target2.hasSkillTag("nogain") ? 1 : 10);
        }).forResult();
      }
    },
    async content(event, trigger, player) {
      if (event.cost_data === "drawToOthers") {
        const num = Math.min(5, event.targets[0].countCards("h") - player.countCards("h"));
        if (num > 0) {
          await player.draw(num);
        }
      } else {
        const num = player.countCards("h");
        await game.asyncDraw(event.targets.sortBySeat(), (target) => {
          return Math.min(5, num - target.countCards("h"));
        });
      }
    }
  },
  jsrgdaoren: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    filterCard: true,
    position: "h",
    discard: false,
    lose: false,
    delay: false,
    filterTarget: lib.filter.notMe,
    check(card) {
      return 6 - get.value(card);
    },
    async content(event, trigger, player) {
      const target = event.target;
      await player.give(event.cards, target);
      const targets = game.filterPlayer((current) => {
        return player.inRange(current) && target.inRange(current);
      }).sortBySeat();
      for (const current of targets) {
        player.line(current);
        await current.damage("nocard");
        await game.delayx();
      }
    },
    ai: {
      order: 2,
      result: {
        player(player, target) {
          const targets = game.filterPlayer((current) => {
            return player.inRange(current) && target.inRange(current);
          });
          if (targets.length === 0) {
            return false;
          }
          return targets.reduce((p, c) => {
            let eff = get.damageEffect(c, player, player);
            if (eff < 0 && c.hp <= 2) {
              const att = get.attitude(player, c);
              if (att > 0) {
                eff *= Math.sqrt(att);
              }
            }
            return p + eff;
          }, 0);
        }
      }
    }
  },
  //刘表
  jsrgyansha: {
    trigger: { player: "phaseZhunbeiBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "你可以选择任意名角色，视为对这些角色使用【五谷丰登】，然后未被选择的角色依次可以将一张装备牌当作【杀】对目标角色使用。", [1, Infinity], (card, player2, target) => {
        return player2.canUse({ name: "wugu", isCard: true }, target);
      }).forResult();
    },
    async content(event, trigger, player) {
      const targets = event.targets.slice(0).sortBySeat();
      await player.useCard({ name: "wugu", isCard: true }, targets);
      const players = game.filterPlayer((current) => !targets.includes(current)).sortBySeat();
      for (const current of players) {
        const aliveTargets = targets.filter((current2) => current2.isIn());
        if (!aliveTargets.length) {
          break;
        }
        const result = await current.chooseCardTarget({
          prompt: `是否将一张装备牌当作【杀】对${get.translation(targets)}${targets.length > 1 ? "中的一名角色" : ""}使用？`,
          position: "hes",
          filterCard(card) {
            return get.type(card) === "equip";
          },
          filterTarget(card, player2, target) {
            if (!get.event().targets.includes(target)) {
              return false;
            }
            card = get.autoViewAs({ name: "sha" }, ui.selected.cards);
            return player2.canUse(card, target, false);
          },
          ai1(card) {
            return 7 - get.value(card);
          },
          ai2(target) {
            const player2 = get.player(), card = get.autoViewAs({ name: "sha" }, ui.selected.cards);
            return get.effect(target, card, player2, player2);
          },
          targets: aliveTargets
        }).forResult();
        if (result.bool) {
          await current.useCard(get.autoViewAs({ name: "sha" }, result.cards), result.cards, result.targets);
        }
      }
    }
  },
  jsrgqingping: {
    trigger: { player: "phaseJieshuBegin" },
    frequent: true,
    filter(event, player) {
      const targets = game.filterPlayer((current) => player.inRange(current)), hs = player.countCards("h");
      return targets.length > 0 && targets.every((current) => current.countCards("h") <= hs);
    },
    async content(event, trigger, player) {
      await player.draw(game.countPlayer((current) => player.inRange(current)));
    }
  },
  //张奂
  jsrgzhushou: {
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      if (!player.getHistory("lose").length) {
        return false;
      }
      const card = lib.skill.jsrgzhushou.getMaxCard();
      if (!card) {
        return false;
      }
      return game.hasPlayer((current) => {
        return current.hasHistory("lose", (evt) => {
          return evt.cards2 && evt.cards2.includes(card);
        });
      });
    },
    async cost(event, trigger, player) {
      const card = lib.skill.jsrgzhushou.getMaxCard();
      const targets = game.filterPlayer((current) => {
        return current.hasHistory("lose", (evt) => {
          return evt.cards2 && evt.cards2.includes(card);
        });
      });
      const result = await player.chooseTarget(get.prompt(event.skill), `选择一名本回合内失去过${get.translation(card)}的角色，对其造成1点伤害。`, (card2, player2, target) => {
        return get.event().targets.includes(target);
      }).set("targets", targets).set("ai", (target) => {
        const player2 = get.player();
        return get.damageEffect(target, player2, player2);
      }).forResult();
      if (result.bool) {
        event.result = {
          bool: true,
          targets: result.targets,
          cards: [card]
        };
      }
    },
    async content(event, trigger, player) {
      await player.showCards(event.cards, `${get.translation(player)}发动了【诛首】`);
      await event.targets[0].damage("nocard");
    },
    getMaxCard() {
      let cardsLost = [];
      game.getGlobalHistory("cardMove", (evt) => {
        if (evt.name === "cardsDiscard" || evt.name === "lose" && evt.position === ui.discardPile) {
          cardsLost.addArray(evt.cards);
        }
      });
      cardsLost = cardsLost.filterInD("d");
      let max = 0;
      return cardsLost.reduce(
        (maxCard, card) => {
          const num = get.number(card, false);
          if (num > max) {
            max = num;
            return card;
          } else if (num === max) {
            return void 0;
          }
          return maxCard;
        },
        void 0
      );
    }
  },
  jsrgyangge: {
    global: "jsrgyangge_mizhao",
    derivation: "mizhao",
    subSkill: {
      used: {
        mark: true,
        marktext: "戈",
        intro: {
          content: "本轮已被发动过〖密诏〗"
        },
        charlotte: true,
        onremove: ["jsrgyangge"]
      },
      mizhao: {
        //直接继承mizhao
        inherit: "mizhao",
        usable: void 0,
        filter(event, player) {
          return player.countCards("h") > 0 && player.isMinHp() && game.hasPlayer((current) => lib.skill.jsrgyangge_mizhao.filterTarget(void 0, player, current));
        },
        filterTarget(card, player, target) {
          if (player === target) {
            return false;
          }
          return target.hasSkill("jsrgyangge") && !target.hasMark("jsrgyangge");
        },
        async contentBefore(event, trigger, player) {
          event.targets[0].addTempSkill("jsrgyangge_used", "roundStart");
          event.targets[0].addMark("jsrgyangge");
        },
        prompt() {
          const player = get.player();
          const targets = game.filterPlayer((current) => lib.skill.jsrgyangge_mizhao.filterTarget(void 0, player, current));
          return `对${get.translation(targets)}${targets.length > 1 ? "中的一人" : ""}发动【密诏】`;
        }
      }
    }
  },
  //董卓
  jsrgguanshi: {
    enable: "phaseUse",
    usable: 1,
    viewAs: { name: "huogong" },
    viewAsFilter(player) {
      return player.hasCard((card) => get.name(card) === "sha", "hs");
    },
    filterCard(card) {
      return get.name(card) === "sha";
    },
    selectTarget: [1, Infinity],
    onuse(result, player) {
      player.addTempSkill("jsrgguanshi_effect");
    },
    position: "hs",
    selectTargetAi(card) {
      let cache = _status.event.getTempCache("jsrgguanshi", "targets");
      if (Array.isArray(cache)) {
        return cache.length;
      }
      let player = _status.event.player, targets = [], shas = player.mayHaveSha(
        player,
        "respond",
        player.getCards("h", (i) => {
          return card === i;
        })
      );
      game.countPlayer((tar) => {
        if (player === tar) {
          return;
        }
        let eff = get.effect(tar, get.autoViewAs({ name: "juedou" }, [card]), player, player);
        if (eff <= 0) {
          return;
        }
        if (get.attitude(player, tar) > 0) {
          targets.push([tar, eff, 0]);
        } else {
          targets.push([tar, eff, tar.mayHaveSha(player, "respond", null, "count")]);
        }
      });
      targets.sort((a, b) => {
        if (!a[2]) {
          return -1;
        }
        if (!b[2]) {
          return 1;
        }
        return b[1] / b[2] - a[1] / a[2];
      });
      for (let i = 0; i < targets.length; i++) {
        if (targets[i][2] > shas) {
          targets = targets.slice(0, i);
          break;
        } else {
          shas -= targets[i][2];
        }
      }
      _status.event.putTempCache("jsrgguanshi", "targets", targets);
      return targets.length;
    },
    check(card) {
      let num = lib.skill.jsrgguanshi.selectTargetAi(card);
      if (!num) {
        return -1;
      }
      if (num === 1) {
        return 4 - get.value(card);
      }
      return num + 5 - get.value(card);
    },
    ai: {
      order: 9,
      result: {
        player(player, target) {
          let tars = _status.event.getTempCache("jsrgguanshi", "targets");
          if (!tars) {
            return lib.card.juedou.ai.result.player(player, target);
          }
          return 0;
        },
        target(player, target) {
          let tars = _status.event.getTempCache("jsrgguanshi", "targets");
          if (!tars) {
            return lib.card.juedou.ai.result.target(player, target);
          }
          for (let tar of tars) {
            if (tar[0] === target) {
              return tar[1] / get.attitude(player, target);
            }
          }
          return 0;
        }
      }
    },
    subSkill: {
      effect: {
        trigger: { player: ["useCardToBefore", "useCardToAfter", "useCardToExcluded", "useCardToOmitted", "useCardToCancelled", "eventNeutralized"] },
        forced: true,
        charlotte: true,
        popup: false,
        firstDo: true,
        priority: 100,
        filter(event, player, name) {
          if (event.type !== "card" || event.skill !== "jsrgguanshi") {
            return false;
          }
          const isUnhurted = event.card.storage?.jsrgguanshi;
          if (name === "useCardToBefore") {
            return isUnhurted;
          }
          return !isUnhurted && event.target && !player.hasHistory("sourceDamage", (evt) => {
            return evt.card === event.card && evt.getParent() === event;
          });
        },
        async content(event, trigger, player) {
          if (event.triggername === "useCardToBefore") {
            trigger.setContent(lib.card.juedou.content);
          } else {
            const card = trigger.card;
            if (!card.storage) {
              card.storage = {};
            }
            card.storage.jsrgguanshi = true;
          }
        }
      }
    }
  },
  jsrgcangxiong: {
    trigger: {
      player: "loseAfter",
      global: ["gainAfter", "loseAsyncAfter"]
    },
    getIndex(event, player, triggername) {
      if (event.type === "discard") {
        return event.getl(player).cards2 || [];
      } else if (event.name === "gain") {
        if (event.player === player) {
          return;
        }
        const cardsGained = event.getg(event.player), cardsLost = event.getl(player).cards2;
        return cardsLost.filter((card) => cardsGained.includes(card));
      } else if (event.name === "loseAsync" && event.type === "gain") {
        const cardsLost = event.getl(player).cards2;
        if (!cardsLost.length) {
          return [];
        }
        const cardsGained = [];
        game.countPlayer2(
          (current) => {
            if (current !== player) {
              cardsGained.addArray(event.getg(current));
            }
          },
          null,
          true
        );
        return cardsLost.filter((card) => cardsGained.includes(card));
      }
      return [];
    },
    filter(event, player, name, card) {
      if (player.isDisabledJudge()) {
        return false;
      }
      if (event.type === "discard") {
        return get.position(card, true) === "d";
      } else {
        const owner = game.findPlayer2(
          (current) => {
            return current !== player && event.getg(current).includes(card);
          },
          null,
          true
        );
        return owner.getCards("h").includes(card);
      }
    },
    prompt2(event, player, name, card) {
      return `将${get.translation(card)}作为蓄谋牌置入判定区${player.isPhaseUsing() ? "，然后摸一张牌。" : ""}`;
    },
    async content(event, trigger, player) {
      const card = event.indexedData;
      if (get.position(card) === "d") {
        player.$gain2(card, false);
        game.log(player, "使用", card, "进行了明目张胆的蓄谋");
      } else {
        get.owner(card).$giveAuto(card, player, false);
      }
      await game.delayx();
      await player.addJudge({ name: "xumou_jsrg" }, [card]);
      if (player.isPhaseUsing()) {
        await player.draw();
      }
    }
  },
  jsrgjiebing: {
    derivation: "jsrgbaowei",
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    juexingji: true,
    seatRelated: true,
    skillAnimation: true,
    animationColor: "gray",
    filter(event, player) {
      const target = lib.skill.jsrgjiebing.getZhugong(player);
      return target && player.countCards("j", (card) => {
        return (card.viewAs || card.name) == "xumou_jsrg";
      }) > target.getHp();
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.gainMaxHp(2);
      await player.recover(2);
      await player.addSkills("jsrgbaowei");
    },
    ai: {
      combo: "jsrgcangxiong"
    },
    getZhugong(player) {
      const mode = get.mode();
      if (mode === "identity") {
        if (_status.mode === "purple") {
          return game.findPlayer2((current) => {
            return current.isZhu2() && current.identity.slice(0, 1) === player.identity.slice(0, 1);
          });
        }
        return game.findPlayer2((current) => current.isZhu2());
      } else {
        return game.findPlayer2((current) => current.getSeatNum() === 1);
      }
    }
  },
  jsrgbaowei: {
    trigger: { player: "phaseJieshuBegin" },
    forced: true,
    filter(event, player) {
      return game.hasPlayer((current) => {
        return current !== player && (current.getHistory("useCard").length > 0 || current.getHistory("respond").length > 0);
      });
    },
    async content(event, trigger, player) {
      const targets = game.filterPlayer((current) => current !== player && (current.getHistory("useCard").length > 0 || current.getHistory("respond").length > 0));
      if (targets.length > 2) {
        await player.loseHp(2);
      } else {
        let target;
        if (targets.length === 1) {
          target = targets[0];
        } else {
          target = (await player.chooseTarget(true, "暴威：对一名目标角色造成2点伤害", (card, player2, target2) => {
            return get.event().targets.includes(target2);
          }).set("targets", targets).set("ai", (target2) => {
            const player2 = get.player();
            return get.damageEffect(target2, player2, player2) * (1.1 - get.sgn(get.attitude(player2, target2)));
          }).forResult()).targets[0];
        }
        player.line(target, "green");
        await target.damage(2);
      }
    },
    ai: {
      //这里应该写一个强命AI，但是比较麻烦，可能还要写全局AI技能，先摆了
    }
  },
  //阳球
  jsrgsaojian: {
    audio: 3,
    enable: "phaseUse",
    usable: 1,
    logAudio: (index) => typeof index === "number" ? "jsrgsaojian" + index + ".mp3" : 2,
    filter(event, player) {
      return game.hasPlayer((current) => current != player && current.countCards("h") > 0);
    },
    filterTarget(card, player, target) {
      return target != player && target.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      const target = event.target;
      if (target.countCards("h") > 0) {
        const {
          cards: [card]
        } = await player.choosePlayerCard(target, true, "h", "visible").set("ai", (button) => {
          return get.event().getRand(button.link.cardid);
        }).forResult();
        const videoId = lib.status.videoId++;
        game.addVideo("showCards", player, [`${get.translation(player)}对${get.translation(target)}发动了【扫奸】`, get.cardsInfo([card])]);
        game.broadcastAll(
          (card2, id, player2, target2) => {
            if (target2 === game.me) {
              return;
            }
            const dialog = ui.create.dialog(`${get.translation(player2)}对${get.translation(target2)}发动了【扫奸】`, [card2]);
            dialog.forcebutton = true;
            dialog.videoId = id;
          },
          card,
          videoId,
          player,
          target
        );
        await game.delay(3);
        game.broadcastAll("closeDialog", videoId);
        for (let i = 0; i < 5; i++) {
          const { cards: discarded } = await target.chooseToDiscard("h", true).set("ai", (card2) => {
            return get.event().getRand(card2.cardid);
          }).forResult();
          if (!discarded || !discarded.length || discarded[0] === card) {
            break;
          }
        }
        if (target.countCards("h") > player.countCards("h")) {
          player.logSkill("jsrgsaojian", null, null, null, [3]);
          await player.loseHp();
        }
      }
    },
    ai: {
      order: 7,
      result: {
        target(player, target) {
          if (target.countCards("h") <= player.countCards("h") - 1) {
            return -3;
          }
          if (player.hp === 1 && get.effect(player, { name: "losehp" }, player, player) < 0) {
            return 0;
          }
          return -1;
        }
      },
      tag: {
        loseCard: 1,
        discard: 1
      }
    }
  },
  mbsaojian: {
    audio: "jsrgsaojian",
    inherit: "jsrgsaojian",
    logAudio: (index) => typeof index === "number" ? "jsrgsaojian" + index + ".mp3" : "jsrgsaojian" + get.rand(1, 2) + ".mp3",
    async content(event, trigger, player) {
      const target = event.target, targets = [player].concat(
        /* @__PURE__ */ (() => {
          return [];
        })()
      );
      const videoId = event.videoId = lib.status.videoId++, eventId = get.id();
      game.broadcastAll(
        (id, player2, target2, targets2, event2) => {
          const dialog = ui.create.dialog("扫奸：" + (game.me === player2 ? "请选择" : "为" + get.translation(player2) + "推荐") + "其中一张牌");
          dialog.videoId = id;
          dialog.add('<div class="text center">' + get.translation(target2) + "的手牌</div>");
          dialog.add(target2.getCards("h"));
        },
        videoId,
        player,
        target,
        targets,
        event
      );
      let humans = targets.filter((current) => current === game.me || current.isOnline());
      let locals = targets.slice(), card;
      locals.removeArray(humans);
      const send = (current, eventId2, videoId2, player2) => {
        lib.skill.mbsaojian.chooseCard(current, eventId2, videoId2, player2);
        game.resume();
      };
      let time = 1e4;
      if (lib.configOL && lib.configOL.choose_timeout) {
        time = parseInt(lib.configOL.choose_timeout) * 1e3;
      }
      targets.forEach((current) => current.showTimer(time));
      event._global_waiting = true;
      if (locals.some((current) => current !== player)) {
        for (const current of locals) {
          if (current === player) {
            continue;
          }
          const result = await lib.skill.mbsaojian.chooseCard(current, eventId, videoId, player).forResult();
          if (result?.bool && result.links?.length) {
            game.broadcastAll(
              (player2, videoId2, card2) => {
                const dialog = get.idDialog(videoId2);
                if (!dialog) {
                  return;
                }
                const link = Array.from(dialog.content.childNodes[2].childNodes).find((but) => but.link === card2);
                const choice = Array.from(dialog.content.childNodes[2].childNodes).find((but) => but._mbsaojian_choose?.includes(player2));
                if (choice) {
                  choice._mbsaojian_choose.remove(player2);
                  choice.querySelector(".info").innerHTML = choice._mbsaojian_choose.map((i) => get.translation(i) + "推荐").join("<br>");
                  if (!choice._mbsaojian_choose.length) {
                    delete choice._mbsaojian_choose;
                    choice.classList.remove("glow2");
                  }
                }
                if (choice !== link) {
                  if (!link._mbsaojian_choose) {
                    link._mbsaojian_choose = [];
                  }
                  link._mbsaojian_choose.add(player2);
                  link.querySelector(".info").innerHTML = link._mbsaojian_choose.map((i) => get.translation(i) + "推荐").join("<br>");
                  if (!link.classList.contains("glow2")) {
                    link.classList.add("glow2");
                  }
                }
              },
              current,
              videoId,
              result.links[0]
            );
          }
        }
      }
      if (humans.length) {
        const solve = function(resolve, reject) {
          return function(result, current) {
            if (result?.bool && result.links?.length) {
              if (current === player) {
                card = result.links[0];
              } else {
                game.broadcastAll(
                  (player2, videoId2, card2) => {
                    const dialog = get.idDialog(videoId2);
                    if (!dialog) {
                      return;
                    }
                    const link = Array.from(dialog.content.childNodes[2].childNodes).find((but) => but.link === card2);
                    const choice = Array.from(dialog.content.childNodes[2].childNodes).find((but) => but._mbsaojian_choose?.includes(player2));
                    if (choice) {
                      choice._mbsaojian_choose.remove(player2);
                      choice.querySelector(".info").innerHTML = choice._mbsaojian_choose.map((i) => get.translation(i) + "推荐").join("<br>");
                      if (!choice._mbsaojian_choose.length) {
                        delete choice._mbsaojian_choose;
                        choice.classList.remove("glow2");
                      }
                    }
                    if (choice !== link) {
                      if (!link._mbsaojian_choose) {
                        link._mbsaojian_choose = [];
                      }
                      link._mbsaojian_choose.add(player2);
                      link.querySelector(".info").innerHTML = link._mbsaojian_choose.map((i) => get.translation(i) + "推荐").join("<br>");
                      if (!link.classList.contains("glow2")) {
                        link.classList.add("glow2");
                      }
                    }
                  },
                  current,
                  videoId,
                  result.links[0]
                );
              }
              resolve();
            } else {
              reject();
            }
          };
        };
        await Promise.any(
          humans.map((current) => {
            return new Promise((resolve, reject) => {
              if (current.isOnline()) {
                current.send(send, current, eventId, videoId, player);
                current.wait(solve(resolve, reject));
              } else {
                const next = lib.skill.mbsaojian.chooseCard(current, eventId, videoId, player);
                const solver = solve(resolve, reject);
                if (_status.connectMode) {
                  game.me.wait(solver);
                }
                return next.forResult().then((result) => {
                  if (_status.connectMode) {
                    game.me.unwait(result, current);
                  } else {
                    solver(result, current);
                  }
                });
              }
            });
          })
        ).catch(() => {
        });
        game.broadcastAll("cancel", eventId);
      }
      if (locals.includes(player)) {
        const result = await lib.skill.mbsaojian.chooseCard(player, eventId, videoId, player).forResult();
        if (result?.bool && result.links?.length) {
          card = result.links[0];
        }
      }
      game.broadcastAll("closeDialog", videoId);
      delete event._global_waiting;
      for (const current of targets) {
        current.hideTimer();
      }
      for (let i = 0; i < 5; i++) {
        const result = await target.chooseToDiscard("h", true).set("ai", (card2) => {
          return 1 + Math.random();
        }).forResult();
        if (!result?.cards?.length || result.cards[0] === card) {
          player.logSkill("mbsaojian", null, null, null, [3]);
          break;
        }
      }
    },
    chooseCard(player, eventId, videoId, source) {
      const dialog = get.idDialog(videoId), forced = player === source;
      return player.chooseButton([1, 2]).set("dialog", dialog).set("ai", (button) => {
        if (!get.event().forced) {
          return 1 + Math.random();
        }
        return 1 + Math.random() + button._mbsaojian_choose?.length;
      }).set("forced", forced).set("filterButton", () => !ui.selected.buttons.length).set("id", eventId).set("_global_waiting", true);
    }
  },
  //张角
  jsrgxiangru: {
    trigger: { global: "damageBegin2" },
    filter(event, player) {
      if (event.player.hp + event.player.hujia > event.num) {
        return false;
      }
      const source = event.source;
      if (!source || !source.isIn()) {
        return false;
      }
      if (player !== event.player) {
        return event.player.isDamaged() && player !== source && player.countCards("he") > 1;
      }
      return game.hasPlayer((current) => {
        return current !== source && current !== player && current.isDamaged() && current.countCards("he") >= 1;
      });
    },
    async cost(event, trigger, player) {
      const target = trigger.player, source = trigger.source;
      const targets = (target === player ? game.filterPlayer((current) => {
        return current !== source && current !== player && current.isDamaged() && current.countCards("he") >= 1;
      }) : [player]).filter((current) => current !== source && current !== target && current.countCards("he") >= 1);
      targets.sortBySeat();
      let cards2 = null, giver = null;
      const eventId = get.id(), send = (target2, source2, current, eventId2, eventNum) => {
        lib.skill.jsrgxiangru.chooseTarget(target2, source2, current, eventId2, eventNum);
        game.resume();
      }, humans = targets.filter((current) => current === game.me || current.isOnline()), locals = targets.slice(0);
      locals.removeArray(humans);
      event._global_waiting = true;
      let time = 1e4;
      if (lib.configOL && lib.configOL.choose_timeout) {
        time = parseInt(lib.configOL.choose_timeout) * 1e3;
      }
      targets.forEach((current) => current.showTimer(time));
      if (humans.length > 0) {
        const solve = function(resolve, reject) {
          return function(result, player2) {
            if (result && result.bool && !cards2) {
              resolve();
              giver = player2;
              cards2 = result.cards;
            } else {
              reject();
            }
          };
        };
        await Promise.any(
          humans.map((current) => {
            return new Promise((resolve, reject) => {
              if (current.isOnline()) {
                current.send(send, target, source, current, eventId, trigger.num);
                current.wait(solve(resolve, reject));
              } else {
                const next = lib.skill.jsrgxiangru.chooseTarget(target, source, current, eventId, trigger.num);
                const solver = solve(resolve, reject);
                if (_status.connectMode) {
                  game.me.wait(solver);
                }
                return next.forResult().then((result) => {
                  if (_status.connectMode && !cards2) {
                    game.me.unwait(result, current);
                  } else {
                    solver(result, current);
                  }
                });
              }
            });
          })
        ).catch(() => {
        });
        game.broadcastAll("cancel", eventId);
      }
      if (!cards2 && locals.length > 0) {
        for (let current of locals) {
          if (cards2) {
            continue;
          }
          const result = await lib.skill.jsrgxiangru.chooseTarget(target, source, current).forResult();
          if (result.bool) {
            giver = current;
            cards2 = result.cards;
          }
        }
      }
      delete event._global_waiting;
      for (let i of targets) {
        i.hideTimer();
      }
      if (cards2) {
        event.result = {
          bool: true,
          targets: [player === target ? giver : target],
          cost_data: { cards: cards2, giver }
        };
        game.broadcastAll((result) => console.log(result), event.result);
      }
    },
    async content(event, trigger, player) {
      const { giver, cards: cards2 } = event.cost_data;
      await giver.give(cards2, trigger.source);
      trigger.cancel();
    },
    chooseTarget(target, source, current, eventId, eventNum) {
      const goon = (() => {
        if (get.attitude(current, target) < 4) {
          return false;
        }
        if (current.countCards("hs", (card) => current.canSaveCard(card, target)) >= 1 - (target.hp + target.hujia - eventNum)) {
          return false;
        }
        if (target == get.zhu(current) || get.attitude(current, source) > 0) {
          return "长崎素世一般的恳求";
        }
        return "给点废牌算了";
      })();
      const next = current.chooseCard("he", 2);
      next.set("prompt", `是否对${get.translation(target)}发动【相濡】？`);
      next.set("prompt2", `选择交给${get.translation(source)}两张牌，然后防止${get.translation(target)}即将受到的致命伤害。`);
      next.set("id", eventId);
      next.set("_global_waiting", true);
      next.set("ai", (card) => {
        if (goon) {
          if (goon.includes("长崎素世")) {
            return 20 - get.value(card);
          }
          return 5 - get.value(card);
        }
        return 0;
      });
      return next;
    }
  },
  jsrgwudao: {
    derivation: "jsrgjinglei",
    trigger: { global: "dying" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "gray",
    filter(event, player) {
      return player.countCards("h") === 0;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.gainMaxHp();
      await player.recover();
      await player.addSkills("jsrgjinglei");
    }
  },
  jsrgjinglei: {
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => !current.isMinHandcard() && current != player);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "选择一名其他角色，令任意名手牌数之和小于其的角色各对其造成1点雷属性伤害", (card, player2, target) => !target.isMinHandcard() && target != player2).set("ai", (target) => {
        const player2 = get.player();
        if (get.attitude(player2, target) >= 0) {
          return false;
        }
        return get.damageEffect(target, player2, player2, "thunder") * Math.sqrt(target.countCards("h"));
      }).forResult();
    },
    async content(event, trigger, player) {
      const [target] = event.targets;
      const maxmium = target.countCards("h");
      const next = player.chooseTarget(true, `选择任意名手牌数之和小于${maxmium}的角色`, [1, Infinity]);
      next.set("promptbar", "none");
      next.set("maxmium", maxmium);
      next.set("complexTarget", true);
      next.set("filterTarget", (card, player2, targetx) => {
        const selected = ui.selected.targets, maxmium2 = get.event().maxmium;
        return selected.reduce((p, c) => {
          return p + c.countCards("h");
        }, targetx.countCards("h")) < maxmium2;
      });
      next.set("ai", (target2) => {
        return 1 / (1 + target2.countCards("h"));
      });
      const { targets: sources } = await next.forResult();
      sources.sortBySeat();
      player.line(sources, "thunder");
      for (let source of sources) {
        if (!source.isIn() || !target.isIn()) {
          continue;
        }
        await target.damage(source, "thunder");
      }
    }
  },
  //宋皇后
  jsrgzhongzen: {
    trigger: { player: "phaseDiscardBegin" },
    forced: true,
    filter(event, player) {
      const hs = player.countCards("h");
      return game.hasPlayer((current) => {
        if (current === player) {
          return false;
        }
        const hs2 = current.countCards("h");
        return hs2 > 0 && hs2 < hs;
      });
    },
    logTarget(event, player) {
      const hs = player.countCards("h");
      return game.filterPlayer((current) => {
        if (current === player) {
          return false;
        }
        const hs2 = current.countCards("h");
        return hs2 > 0 && hs2 < hs;
      });
    },
    async content(event, trigger, player) {
      const targets = event.targets.slice(0);
      await game.doAsyncInOrder(targets, async (target, index) => {
        if (player.isIn() && target.countCards("h") > 0) {
          return target.chooseToGive(player, "h", true);
        }
      });
    },
    group: "jsrgzhongzen_discard",
    subSkill: {
      discard: {
        trigger: { player: "phaseDiscardEnd" },
        forced: true,
        filter(event, player) {
          if (player.countCards("he") === 0) {
            return false;
          }
          const cards2 = [];
          player.getHistory("lose", (evt) => {
            if (evt.type === "discard" && evt.getParent("phaseDiscard") === event) {
              cards2.addArray(evt.cards);
            }
          });
          return cards2.length > player.hp && cards2.reduce((num, card) => {
            if (num <= player.hp && get.suit(card, false) === "spade") {
              num++;
            }
            return num;
          }, 0) > player.hp;
        },
        async content(event, trigger, player) {
          await player.chooseToDiscard(true, "he", player.countCards("he"));
        }
      }
    }
  },
  jsrgxuchong: {
    trigger: { target: "useCardToTargeted" },
    async cost(event, trigger, player) {
      const current = _status.currentPhase;
      const choices = ["摸一张牌"];
      if (current) {
        choices.push(`令${get.translation(current)}本回合的手牌上限+2`);
      }
      const { control } = await player.chooseControl("cancel2").set("choiceList", choices).forResult();
      if (control !== "cancel2") {
        event.result = {
          bool: true,
          targets: control === "选项二" ? [current] : []
        };
      }
    },
    async content(event, trigger, player) {
      if (event.targets && event.targets.length) {
        const [target] = event.targets;
        target.addTempSkill("jsrgxuchong_effect");
        target.addMark("jsrgxuchong_effect", 2, false);
      } else {
        await player.draw("nodelay");
      }
      await player.gain(lib.card.ying.getYing(1), "gain2");
    },
    subSkill: {
      effect: {
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("jsrgxuchong_effect");
          }
        },
        onremove: true,
        charlotte: true,
        intro: {
          content: "手牌上限+#"
        }
      }
    }
  },
  //曹节王甫
  jsrgzonghai: {
    trigger: { global: "dying" },
    logTarget: "player",
    round: 1,
    filter(event, player) {
      return event.player !== player && event.player.hp <= 0;
    },
    check(event, player) {
      return get.attitude(player, event.player) < 0;
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      const { targets } = await target.chooseTarget([1, 2], true, "请选择至多两名角色", `${get.translation(player)}对你发动了【纵害】。你可以选择至多两名角色，只有他（们）可以使用牌拯救你，且当此次濒死结算结束后，他（们均）会受到来自${get.translation(player)}的1点伤害。`).set("ai", (target2) => {
        const evt = get.event(), player2 = evt.player, source = evt.getParent().player;
        return get.damageEffect(target2, source, player2);
      }).set("forceDie", true).forResult();
      target.line(targets);
      game.log(target, "选择了", targets);
      targets.sortBySeat(_status.currentPhase || player);
      const allPlayers = game.filterPlayer().sortBySeat();
      if (!trigger._jsrgzonghai_id) {
        trigger._jsrgzonghai_id = get.id();
      }
      const id = trigger._jsrgzonghai_id;
      allPlayers.forEach((target2) => {
        if (!targets.includes(target2)) {
          target2.addTempSkill("jsrgzonghai_blocker");
          target2.markAuto("jsrgzonghai_blocker", [id]);
        }
      });
      target.addSkill("jsrgzonghai_damage");
      if (!target.storage.jsrgzonghai_damage) {
        target.storage.jsrgzonghai_damage = [];
      }
      target.storage.jsrgzonghai_damage.push({
        id,
        targets,
        source: player
      });
    },
    subSkill: {
      blocker: {
        charlotte: true,
        onremove: true,
        mod: {
          cardSavable: (card, player) => {
            if (player.getStorage("jsrgzonghai_blocker").includes(get.event().getParent()._jsrgzonghai_id)) {
              return false;
            }
          },
          cardEnabled: (card, player) => {
            if (player.getStorage("jsrgzonghai_blocker").includes(get.event().getParent()._jsrgzonghai_id)) {
              return false;
            }
          }
        }
      },
      damage: {
        trigger: {
          player: "dyingAfter"
        },
        filter(event, player) {
          let storage = player.getStorage("jsrgzonghai_damage");
          for (let i of storage) {
            if (i.id == event._jsrgzonghai_id) {
              return true;
            }
          }
          return false;
        },
        silent: true,
        forceDie: true,
        charlotte: true,
        async content(event, trigger, player) {
          let storage;
          for (let i = 0; i < player.storage.jsrgzonghai_damage.length; i++) {
            if (player.storage.jsrgzonghai_damage[i].id == trigger._jsrgzonghai_id) {
              storage = player.storage.jsrgzonghai_damage[i];
              player.storage.jsrgzonghai_damage.splice(i, 1);
              break;
            }
          }
          if (!storage) {
            return;
          }
          game.countPlayer((target) => {
            target.unmarkAuto("jsrgzonghai_blocker", [storage.id]);
            if (!target.getStorage("jsrgzonghai_blocker").length) {
              target.removeSkill("jsrgzonghai_blocker");
            }
          });
          if (storage.source.isIn()) {
            while (storage.targets.length) {
              let target = storage.targets.shift();
              if (target.isIn()) {
                await target.damage(storage.source);
              }
            }
          }
          if (!player.storage.jsrgzonghai_damage.length) {
            player.removeSkill("jsrgzonghai_damage");
          }
        }
      }
    }
  },
  jsrgjueyin: {
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return player.getHistory("damage")[0] === event;
    },
    async content(event, trigger, player) {
      await player.draw(3);
      const targets = game.filterPlayer().sortBySeat();
      targets.forEach((current) => {
        current.addTempSkill("jsrgjueyin_damage");
        current.addMark("jsrgjueyin_damage", 1, false);
      });
    },
    subSkill: {
      damage: {
        onremove: true,
        charlotte: true,
        trigger: { player: "damageBegin1" },
        forced: true,
        async content(event, trigger, player) {
          trigger.num += player.countMark(event.name);
        },
        intro: {
          content: "本回合受到的伤害+#"
        }
      }
    }
  },
  //梦袁绍
  jsrgzhimeng: {
    trigger: { player: "phaseZhunbeiBegin" },
    logTarget() {
      return game.filterPlayer((current) => current.countCards("h") > 0).sortBySeat();
    },
    prompt: "是否发动【执盟】？",
    async content(event, trigger, player) {
      const cards2 = get.cards(game.countPlayer());
      await game.cardsGotoOrdering(cards2);
      await player.showCards(cards2, `${get.translation(player)}发动了【执盟】`);
      const targets = game.filterPlayer((current) => current.countCards("h") > 0).sortBySeat();
      const showCardEvent = player.chooseCardOL(targets, `${get.translation(player)}发动了【执盟】，请展示一张手牌`, true);
      showCardEvent.set("ai", (card) => {
        if (get.event()._suits.includes(get.suit(card))) {
          return 1 + Math.random();
        }
        return (1 - get.value(card)) * Math.random();
      });
      showCardEvent.set(
        "_suits",
        cards2.map((card) => get.suit(card, false))
      );
      showCardEvent.set("source", player);
      showCardEvent.set("aiCard", (target) => {
        const hs = target.getCards("h");
        return { bool: true, cards: [hs.randomGet()] };
      });
      showCardEvent._args.remove("glow_result");
      const result = await showCardEvent.forResult();
      const cardsToShown = [];
      for (let i = 0; i < targets.length; i++) {
        cardsToShown.push(result[i].cards[0]);
      }
      await player.showCards(cardsToShown, get.translation(player) + "发动了【执盟】").set("customButton", (button) => {
        const target = get.owner(button.link);
        if (target) {
          game.createButtonCardsetion(`${target.getName(true)}`, button);
        }
      }).set("delay_time", 4).set("multipleShow", true);
      const suitsMap = {};
      for (let i = 0; i < targets.length; i++) {
        const target = targets[i], card = cardsToShown[i], suit = get.suit(card, target);
        if (!(suit in suitsMap)) {
          suitsMap[suit] = target;
        } else {
          suitsMap[suit] = null;
        }
      }
      const gain_list = [];
      for (const data of Object.entries(suitsMap)) {
        const [suit, target] = data;
        if (target) {
          const cardsToGain = cards2.filter((card) => get.suit(card, false) === suit);
          if (cardsToGain.length) {
            gain_list.push([target, cardsToGain]);
          }
        }
      }
      if (gain_list.length) {
        await game.loseAsync({
          gain_list,
          animate: "gain2"
        }).setContent("gaincardMultiple");
      }
    }
  },
  jsrgtianyu: {
    trigger: { global: ["loseAsyncAfter", "cardsDiscardAfter"] },
    // frequent: true,
    getIndex(event) {
      return lib.skill.jsrgtianyu.getCards(event);
    },
    filter(event, player, triggername, card) {
      return get.position(card, true) === "d";
    },
    frequent(event, player, triggername, card) {
      return get.value(card, player) > 0;
    },
    getCards(event) {
      const cards2 = event.getd().filter((card) => {
        return get.type(card, null, false) === "equip" || get.tag(card, "damage", null, false) > 0;
      });
      if (!cards2.length) {
        return [];
      }
      game.checkGlobalHistory("cardMove", (evt) => {
        if (evt.name === "lose") {
          cards2.removeArray(evt.cards);
        }
      });
      return cards2;
    },
    prompt2(event, player, triggername, card) {
      return `获得即将进入弃牌堆的${get.translation(card)}`;
    },
    async content(event, trigger, player) {
      const cards2 = event.indexedData;
      await player.gain(cards2, "gain2");
    }
  },
  jsrgzhuni: {
    enable: "phaseUse",
    usable: 1,
    filterTarget: true,
    selectTarget: -1,
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      let targets = event.targets.slice(0), results = [], forceTargets = [];
      if (player.hasSkill("jsrghezhi")) {
        forceTargets = targets.filter((current) => current !== player && current.group === "qun");
        targets.removeArray(forceTargets);
      }
      const map = await game.chooseAnyOL(targets, get.info(event.name).chooseTarget, [player]).forResult();
      for (const chooser of targets) {
        const result = map.get(chooser);
        let target2;
        if (!result?.targets || result === "ai") {
          target2 = game.filterPlayer((current) => current !== player).randomGet();
        } else {
          target2 = result.targets[0];
        }
        results.push([chooser, target2]);
        if (chooser === player) {
          forceTargets.forEach((current) => results.push([current, target2]));
        }
      }
      const ticketsMap = /* @__PURE__ */ new Map();
      results.forEach((data) => {
        const [source, current] = data;
        source.line(current);
        game.log(source, forceTargets.includes(source) ? "自愿选择" : "选择了", current, "作为讨伐目标");
        ticketsMap.set(current, (ticketsMap.get(current) || 0) + 1);
      });
      let maxTicket = 0;
      const target = ticketsMap.entries().reduce((target2, data) => {
        const [current, ticket] = data;
        if (ticket > maxTicket) {
          maxTicket = ticket;
          return current;
        } else if (ticket === maxTicket) {
          return false;
        } else {
          return target2;
        }
      }, false);
      if (target) {
        game.log(target, "成为了", "#g【诛逆】", "的讨伐目标");
        player.addTempSkill("jsrgzhuni_effect");
        player.markAuto("jsrgzhuni_effect", [target]);
      }
      event.getParent().maxTicket = maxTicket;
    },
    ai: {
      order: 10,
      result: { player: 1 },
      threaten: 1.8
    },
    chooseTarget(player, source) {
      const next = player.chooseTarget(`${get.translation(source)}发动了【诛逆】，请选择一名讨伐目标`, (card, player2, target) => target !== source, true);
      next.set("ai", (target) => -get.attitude(get.player(), target));
      next.set("animate", false);
      next.set("_global_waiting", true);
      return next;
    },
    subSkill: {
      effect: {
        onremove: true,
        mod: {
          targetInRange(card, player, target) {
            if (player.getStorage("jsrgzhuni_effect").includes(target)) {
              return true;
            }
          },
          cardUsableTarget(card, player, target) {
            if (player.getStorage("jsrgzhuni_effect").includes(target)) {
              return true;
            }
          }
        },
        charlotte: true,
        intro: {
          content: "对$使用牌无距离和次数限制"
        }
      }
    }
  },
  jsrghezhi: {
    zhuSkill: true,
    locked: true
  },
  //江山如故·合
  //蓄谋临时禁用
  xumou_jsrg_temp: {
    charlotte: true,
    onremove: true,
    mod: {
      cardEnabled(card, player) {
        if (!card.storage || !card.storage.xumou_jsrg) {
          return;
        }
        if (player.getStorage("xumou_jsrg_temp").includes(get.name(card, false))) {
          return false;
        }
      }
    }
  },
  //404诸葛亮
  jsrgwentian: {
    trigger: { player: ["phaseZhunbeiBegin", "phaseJudgeBegin", "phaseDrawBegin", "phaseUseBegin", "phaseDiscardBegin", "phaseJieshuBegin"] },
    usable: 1,
    prompt2: "观看牌堆顶的五张牌，将其中一张交给其他角色，并将其余牌置于牌堆顶或牌堆底",
    group: "jsrgwentian_viewas",
    async content(event, trigger, player) {
      const cards2 = get.cards(5);
      await game.cardsGotoOrdering(cards2);
      if (game.hasPlayer((current) => current != player)) {
        const result = await player.chooseButton(["问天：将一张牌交给一名其他角色", cards2], true).forResult();
        if (result.bool) {
          const result2 = await player.chooseTarget(`将${get.translation(result.links)}交给一名其他角色`, lib.filter.notMe, true).set("ai", (target) => {
            return get.attitude(get.player(), target);
          }).forResult();
          if (result2.bool) {
            cards2.removeArray(result.links);
            const target = result2.targets[0];
            player.line(target, "green");
            await target.gain(result.links, "gain2").set("giver", player);
          }
        }
      }
      const next = player.chooseToMove("allowChooseAll");
      next.set("list", [["牌堆顶", cards2.filterInD()], ["牌堆底"]]);
      next.set("prompt", "问天：点击或拖动将牌移动到牌堆顶或牌堆底");
      next.processAI = (list) => {
        const cards3 = list[0][1], player2 = _status.event.player;
        const top2 = [];
        const judges = player2.getCards("j");
        let stopped = false;
        if (!player2.hasWuxie()) {
          for (let i = 0; i < judges.length; i++) {
            const judge = get.judge(judges[i]);
            cards3.sort((a, b) => judge(b) - judge(a));
            if (judge(cards3[0]) < 0) {
              stopped = true;
              break;
            } else {
              top2.unshift(cards3.shift());
            }
          }
        }
        let bottom2;
        if (!stopped) {
          cards3.sort((a, b) => get.value(b, player2) - get.value(a, player2));
          while (cards3.length) {
            if (get.value(cards3[0], player2) <= 5) {
              break;
            }
            top2.unshift(cards3.shift());
          }
        }
        bottom2 = cards3;
        return [top2, bottom2];
      };
      const { moved } = await next.forResult();
      const top = moved[0];
      const bottom = moved[1];
      top.reverse();
      game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event2, card) => {
        if (event2.top_cards.includes(card)) {
          return ui.cardPile.firstChild;
        }
        return null;
      });
      player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
      game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
      await game.delayx();
    },
    subSkill: {
      viewas: {
        audio: "jsrgwentian",
        enable: "chooseToUse",
        filter(event, player) {
          for (const name of ["wuxie", "huogong"]) {
            if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
              return true;
            }
          }
          return false;
        },
        hiddenCard(player, name) {
          if (player.isTempBanned("jsrgwentian")) {
            return false;
          }
          return name == "wuxie";
        },
        viewAs(cards2, player) {
          const event = get.event(), filter = event._backup.filterCard;
          for (const name of ["wuxie", "huogong"]) {
            if (filter(get.autoViewAs({ name }, "unsure"), player, event)) {
              return { name };
            }
          }
          return null;
        },
        filterCard: () => false,
        selectCard: -1,
        prompt() {
          const player = get.player();
          const event = get.event(), filter = event._backup.filterCard;
          let str = "将牌堆顶的牌当【";
          for (const name of ["wuxie", "huogong"]) {
            if (filter({ name }, player, event)) {
              str += get.translation(name);
              break;
            }
          }
          str += "】使用";
          return str;
        },
        log: false,
        async precontent(event, trigger, player) {
          player.logSkill("jsrgwentian");
          const cards2 = get.cards();
          const name = event.result.card?.name;
          event.result.card = get.autoViewAs({ name }, cards2);
          event.result.cards = cards2;
          game.cardsGotoOrdering(cards2);
          const color = name == "wuxie" ? "black" : "red";
          if (get.color(cards2, false) != color) {
            player.tempBanSkill("jsrgwentian", "roundStart");
          }
        }
      }
    }
  },
  jsrgchushi: {
    available(mode) {
      return mode == "identity" || mode == "versus" && (_status.mode == "four" || _status.mode == "guandu");
    },
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      const zhu = get.zhu(player);
      if (!zhu || !zhu.isZhu2() || !zhu.isIn() || !zhu.countCards("h")) {
        return false;
      }
      return !player.isZhu2() && player.countCards("h");
    },
    async content(event, trigger, player) {
      const next = player.chooseToDebate(
        game.filterPlayer((current) => {
          return (current == player || current.isZhu2()) && current.countCards("h");
        })
      ).set("callback", async (event2) => {
        const result = event2.debateResult;
        if (result.bool && result.opinion) {
          const { opinion, targets } = result;
          if (!["red", "black"].includes(opinion)) {
            return;
          }
          targets.sortBySeat();
          if (opinion == "red") {
            do {
              for (const current of targets) {
                await current.draw();
              }
            } while (targets.map((current) => {
              return current.countCards("h");
            }).reduce((p, c) => {
              return p + c;
            }, 0) < 7);
          } else {
            player.addMark("jsrgchushi_add", 1, false);
            player.addTempSkill("jsrgchushi_add", "roundStart");
          }
        }
      });
      if (get.attitude(get.zhu(player), player) > 0) {
        next.set("ai", (card) => {
          const target = get.zhu(player), history = target.getHistory("gain", (evt) => evt.getParent("jsrgwentian", true)?.player == player);
          if (history.length && get.color(card) == get.color(history[0].cards[0])) {
            return 2 + Math.random();
          }
          return Math.random();
        });
      }
      await next;
    },
    ai: {
      order(item, player) {
        if (!player) {
          player = get.player();
        }
        const target = get.zhu(player);
        if (!target) {
          return 0.1;
        }
        if (get.attitude(player, target) <= 0) {
          return 0.1;
        }
        const history = target.getHistory("gain", (evt) => evt.getParent("jsrgwentian", true)?.player == player);
        if (!history.length) {
          return 5;
        }
        if (get.color(history[0].cards[0]) == "red") {
          return 1;
        }
        return 11;
      },
      result: {
        player(player) {
          const target = get.zhu(player);
          if (!target) {
            return 0;
          }
          return get.attitude(player, target);
        }
      }
    },
    subSkill: {
      add: {
        audio: "jsrgchushi",
        trigger: { source: "damageBegin1" },
        filter(event) {
          return event.hasNature("linked");
        },
        forced: true,
        charlotte: true,
        onremove: true,
        async content(_, trigger, player) {
          trigger.num += player.countMark("jsrgchushi_add");
        },
        ai: {
          damageBonus: true,
          skillTagFilter(player, tag, arg) {
            if (tag === "damageBonus") {
              return arg && arg.card && game.hasNature(arg.card, "linked");
            }
          }
        },
        intro: {
          content: "造成的属性伤害+#"
        }
      }
    }
  },
  jsrgyinlve: {
    trigger: {
      global: "damageBegin4"
    },
    filter(event, player) {
      return event.player.isIn() && ["fire", "thunder"].some((n) => !player.getStorage("jsrgyinlve_used").includes(n) && event.hasNature(n));
    },
    check(event, player) {
      if (get.damageEffect(event.player, event.source, player, get.natureList(event.nature)) < -5) {
        return true;
      }
      return false;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      trigger.cancel();
      const natures = ["fire", "thunder"];
      let index;
      if (natures.every((n) => !player.getStorage("jsrgyinlve_used").includes(n) && trigger.hasNature(n))) {
        const result = await player.chooseControl(["摸牌阶段", "弃牌阶段"]).set("prompt", "请选择要新回合内仅有的阶段").forResult();
        index = result.index;
      } else {
        index = [0, 1].find((i) => !player.getStorage("jsrgyinlve_used").includes(natures[i]) && trigger.hasNature(natures[i]));
      }
      player.addTempSkill("jsrgyinlve_used", "roundStart");
      player.markAuto("jsrgyinlve_used", natures[index]);
      player.insertPhase().set("phaseList", [["phaseDraw", "phaseDiscard"][index]]);
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  //姜维
  jsrgjinfa: {
    enable: "phaseUse",
    usable: 1,
    filterCard: true,
    position: "h",
    discard: false,
    lose: false,
    delay: false,
    check() {
      return 1 + Math.random();
    },
    async content(event, trigger, player) {
      await player.showCards(event.cards);
      player.chooseToDebate(
        game.filterPlayer((current) => {
          return current.maxHp <= player.maxHp;
        })
      ).set("callback", async (event2) => {
        const result = event2.debateResult;
        if (result.bool && result.opinion) {
          const { cards: fixedCards } = event2.getParent("jsrgjinfa");
          const color = get.color(fixedCards);
          const { opinion, targets } = result;
          if (opinion == color) {
            const result2 = await player.chooseTarget("是否令至多两名参与议事的角色将手牌摸至体力上限？", [1, 2], (card, player2, target) => {
              return get.event().targets.includes(target);
            }).set("targets", targets).set("ai", (target) => {
              const player2 = get.player();
              const att = get.attitude(player2, target);
              if (att <= 0) {
                return -1;
              }
              return att * Math.sqrt(Math.max(0.1, target.maxHp - target.countCards("h")));
            }).forResult();
            if (result2.bool) {
              const targets2 = result2.targets;
              targets2.sortBySeat();
              player.line(targets2, "green");
              for (const current of targets2) {
                if (current.countCards("h") < current.maxHp) {
                  await current.drawTo(current.maxHp);
                }
              }
            }
          } else {
            await player.gain(lib.card.ying.getYing(2), "gain2");
          }
        }
        if (result.opinions.some((idea) => idea != "others" && result[idea].length == 1 && result[idea][0][0] == player)) {
          const list = lib.group.slice();
          list.remove(player.group);
          list.push("cancel2");
          const { control } = await player.chooseControl(list).set("prompt", "是否变更势力？").set("ai", () => {
            if (!get.event().change) {
              return "cancel2";
            }
            const controls = get.event().controls;
            const groups = ["wei", "shu"].filter((g) => controls.includes(g));
            if (groups.length) {
              return groups.randomGet();
            }
            return controls.randomGet();
          }).set("change", ["wei", "shu"].includes(player.group) ? Math.random() < 0.5 : true).forResult();
          if (control != "cancel2") {
            player.popup(control + "2", get.groupnature(control, "raw"));
            player.changeGroup(control);
          }
        }
      });
    },
    ai: {
      order(item, player) {
        if (player.countCards("h") == 1) {
          return 10;
        }
        return 1;
      },
      result: {
        player: 1
      }
    }
  },
  jsrgfumou: {
    trigger: { global: "chooseToDebateAfter" },
    groupSkill: "wei",
    forced: true,
    locked: false,
    filter(event, player) {
      if (player.group != "wei") {
        return false;
      }
      if (!event.targets.includes(player)) {
        return false;
      }
      if (event.red.some((i) => i[0] == player)) {
        return event.black.length;
      }
      if (event.black.some((i) => i[0] == player)) {
        return event.red.length;
      }
      return false;
    },
    async content(event, trigger, player) {
      const targets = [];
      if (trigger.red.some((i) => i[0] == player)) {
        targets.addArray(trigger.black.map((i) => i[0]));
      }
      if (trigger.black.some((i) => i[0] == player)) {
        targets.addArray(trigger.red.map((i) => i[0]));
      }
      player.line(targets, "thunder");
      targets.forEach((target) => {
        target.addTempSkill("jsrgfumou_forbid");
        target.markAuto(
          "jsrgfumou_forbid",
          ["red", "black"].filter((color) => {
            return trigger[color].some((i) => i[0] == target);
          })
        );
      });
      game.broadcastAll((targets2) => {
        lib.skill.jsrgfumou_backup.targets = targets2;
      }, targets);
      const next = player.chooseToUse();
      next.set("openskilldialog", `是否将一张【影】当【出其不意】对一名与你意见不同的角色使用？`);
      next.set("norestore", true);
      next.set("_backupevent", "jsrgfumou_backup");
      next.set("custom", {
        add: {},
        replace: { window() {
        } }
      });
      next.backup("jsrgfumou_backup");
    },
    subSkill: {
      backup: {
        filterCard(card) {
          return get.itemtype(card) == "card" && get.name(card) == "ying";
        },
        viewAs: { name: "chuqibuyi" },
        selectCard: 1,
        position: "hs",
        log: false,
        filterTarget(card, player, target) {
          const targets = lib.skill.jsrgfumou_backup.targets;
          if (!targets.includes(target) || ui.selected.targets.containsSome(targets)) {
            return false;
          }
          return lib.filter.targetEnabled.apply(this, arguments);
        },
        ai1(card) {
          return 6 - get.value(card);
        }
      },
      forbid: {
        charlotte: true,
        onremove: true,
        mod: {
          cardEnabled(card, player) {
            const color = get.color(card);
            if (color != "unsure" && player.getStorage("jsrgfumou_forbid").includes(color)) {
              return false;
            }
          },
          cardRespondable(card, player) {
            const color = get.color(card);
            if (color != "unsure" && player.getStorage("jsrgfumou_forbid").includes(color)) {
              return false;
            }
          },
          cardSavable(card, player) {
            const color = get.color(card);
            if (color != "unsure" && player.getStorage("jsrgfumou_forbid").includes(color)) {
              return false;
            }
          }
        },
        mark: true,
        intro: {
          content: "本回合不能使用或打出$牌"
        }
      }
    }
  },
  jsrgxuanfeng: {
    enable: "chooseToUse",
    filterCard: { name: "ying" },
    position: "hs",
    groupSkill: "shu",
    locked: false,
    viewAs: {
      name: "sha",
      nature: "stab",
      storage: { jsrgxuanfeng: true }
    },
    viewAsFilter(player) {
      if (player.group != "shu") {
        return false;
      }
      if (!player.countCards("hs", "ying")) {
        return false;
      }
    },
    prompt: "将一张【影】当无距离和次数限制的刺【杀】使用",
    check(card) {
      const val = get.value(card);
      return 5 - val;
    },
    mod: {
      targetInRange(card, player, target) {
        if (card.storage && card.storage.jsrgxuanfeng) {
          return true;
        }
      },
      cardUsable(card) {
        if (card.storage && card.storage.jsrgxuanfeng) {
          return Infinity;
        }
      }
    },
    ai: {
      order: 2,
      combo: "jsrgjinfa"
    }
  },
  //陆逊
  jsrgyoujin: {
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => {
        return player.canCompare(current);
      });
    },
    direct: true,
    async content(event, trigger, player) {
      const result = await player.chooseTarget(get.prompt2("jsrgyoujin"), (card, player2, target2) => {
        return player2.canCompare(target2);
      }).set("ai", (target2) => {
        if (!get.event().goon) {
          return 0;
        }
        return -get.attitude(get.player(), target2);
      }).set("goon", player.countCards("hs", ["shan", "caochuan"]) || player.getHp() >= 3).forResult();
      if (!result.bool) {
        return;
      }
      const { targets } = result, target = targets[0];
      player.logSkill("jsrgyoujin", target);
      const result2 = await player.chooseToCompare(target).set("small", true).forResult();
      player.addTempSkill("jsrgyoujin_forbid");
      player.markAuto("jsrgyoujin_forbid", [result2.num1]);
      target.addTempSkill("jsrgyoujin_forbid");
      target.markAuto("jsrgyoujin_forbid", [result2.num2]);
      if (!result2.tie) {
        const targets2 = [target, player];
        if (result2.bool) {
          targets2.reverse();
        }
        const sha = new lib.element.VCard({ name: "sha", isCard: true });
        if (targets2[0].canUse(sha, targets2[1], false)) {
          targets2[0].useCard(sha, targets2[1], false);
        }
      }
    },
    subSkill: {
      forbid: {
        charlotte: true,
        onremove: true,
        mod: {
          cardEnabled2(card, player) {
            if (get.itemtype(card) == "card" && player.getStorage("jsrgyoujin_forbid").some((num) => num > get.number(card))) {
              return false;
            }
          }
        },
        mark: true,
        intro: {
          content: "本回合不能使用或打出点数小于$的手牌"
        }
      }
    }
  },
  jsrgdailao: {
    enable: "phaseUse",
    filter(event, player) {
      return !player.hasCard((card) => {
        return player.hasUseTarget(card, true, true);
      });
    },
    async content(event, trigger, player) {
      await player.showHandcards();
      await player.draw(2);
      const evt = event.getParent("phase", true);
      if (evt) {
        game.log(player, "结束了回合");
        evt.num = evt.phaseList.length;
        evt.goto(11);
      }
      const evtx = event.getParent("phaseUse", true);
      if (evtx) {
        evtx.skipped = true;
      }
    },
    ai: {
      order: 1e-4,
      result: { player: 1 }
    }
  },
  jsrgzhubei: {
    trigger: { source: "damageBegin1" },
    forced: true,
    init(player) {
      player.addSkill("jsrgzhubei_record");
    },
    filter(event, player) {
      return event.player.hasHistory("damage", (evt) => {
        return evt.source == player;
      });
    },
    logTarget: "player",
    async content(event, trigger, player) {
      trigger.num++;
    },
    subSkill: {
      record: {
        trigger: {
          global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        charlotte: true,
        silent: true,
        filter(event, player) {
          return game.hasPlayer((current) => {
            if (current.countCards("h")) {
              return false;
            }
            const evt = event.getl(current);
            return evt && evt.hs && evt.hs.length;
          });
        },
        async content(event, trigger, player) {
          game.countPlayer((current) => {
            if (current.countCards("h")) {
              return false;
            }
            const evt = trigger.getl(current);
            if (evt && evt.hs && evt.hs.length) {
              current.addTempSkill("jsrgzhubei_lost");
            }
          });
        }
      },
      lost: { charlotte: true }
    },
    mod: {
      cardUsableTarget(card, player, target) {
        if (target.hasSkill("jsrgzhubei_lost")) {
          return true;
        }
      }
    }
  },
  //赵云
  jsrglonglin: {
    audio: 2,
    trigger: {
      global: "useCardToPlayered"
    },
    usable: 1,
    filter(event, player) {
      if (event.player == player) {
        return false;
      }
      if (event.card.name != "sha") {
        return false;
      }
      return event.isFirstTarget && event.player.isPhaseUsing();
    },
    direct: true,
    async content(event, trigger, player) {
      const juedou = new lib.element.VCard({ name: "juedou", storage: { jsrglonglin: true }, isCard: true });
      const result = await player.chooseToDiscard(get.prompt2("jsrglonglin"), "he").set("ai", (card) => {
        if (get.event().goon) {
          return 5 - get.value(card);
        }
        return 0;
      }).set(
        "goon",
        (trigger.player.canUse(juedou, player) ? Math.max(0, get.effect(player, juedou, trigger.player, trigger.player)) : 0) + trigger.targets.map((target) => {
          return get.effect(target, trigger.card, trigger.player, player);
        }).reduce((p, c) => {
          return p + c;
        }, 0) < -4
      ).set("logSkill", ["jsrglonglin", trigger.player]).forResult();
      if (result.bool) {
        trigger.excluded.addArray(trigger.targets);
        await game.delayx();
        if (trigger.player.canUse(juedou, player)) {
          const result2 = await trigger.player.chooseBool(`是否视为对${get.translation(player)}使用一张【决斗】？`).set("choice", get.effect(player, juedou, trigger.player, trigger.player) >= 0).forResult();
          if (result2.bool) {
            player.addTempSkill("jsrglonglin_source");
            trigger.player.useCard(juedou, player);
          }
        }
      }
    },
    subSkill: {
      source: {
        trigger: { source: "damageSource" },
        charlotte: true,
        forced: true,
        popup: false,
        filter(event, player) {
          return event.card && event.card.storage && event.card.storage.jsrglonglin;
        },
        async content(event, trigger, player) {
          player.line(trigger.player);
          trigger.player.addTempSkill("jsrglonglin_forbid", "phaseUseAfter");
        }
      },
      forbid: {
        mod: {
          cardEnabled(card, player) {
            if (!card.cards) {
              return;
            }
            if (card.cards.some((cardx) => get.position(cardx) == "h")) {
              return false;
            }
          },
          cardSavable(card, player) {
            if (!card.cards) {
              return;
            }
            if (card.cards.some((cardx) => get.position(cardx) == "h")) {
              return false;
            }
          }
        },
        charlotte: true,
        mark: true,
        intro: {
          content: "不能使用手牌"
        }
      }
    }
  },
  jsrgzhendan: {
    audio: 2,
    enable: ["chooseToUse", "chooseToRespond"],
    filter(event, player) {
      if (event.type == "wuxie") {
        return false;
      }
      if (!_status.connectMode && !player.countCards("hs", (card) => {
        return get.type2(card) != "basic";
      })) {
        return false;
      }
      return get.inpileVCardList((info) => {
        if (info[0] != "basic") {
          return false;
        }
        return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
      }).length;
    },
    chooseButton: {
      dialog(event, player) {
        const vcards = get.inpileVCardList((info) => {
          if (info[0] != "basic") {
            return false;
          }
          return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
        });
        return ui.create.dialog("镇胆", [vcards, "vcard"]);
      },
      check(button) {
        if (get.event().getParent().type != "phase") {
          return 1;
        }
        return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
      },
      backup(links, player) {
        return {
          audio: "jsrgzhendan",
          popname: true,
          viewAs: { name: links[0][2], nature: links[0][3] },
          filterCard(card, player2) {
            return get.type2(card) != "basic";
          },
          selectCard: 1,
          position: "hs"
        };
      },
      prompt(links, player) {
        return "将一张非基本手牌当" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用或打出";
      }
    },
    hiddenCard(player, name) {
      return get.type(name) == "basic" && player.countCards("hs") > 0;
    },
    ai: {
      respondSha: true,
      respondShan: true,
      skillTagFilter(player) {
        return player.countCards("hs") > 0;
      },
      order: 0.5,
      result: {
        player(player) {
          if (get.event().dying) {
            return get.attitude(player, get.event().dying);
          }
          return 1;
        }
      }
    },
    group: "jsrgzhendan_damage",
    subSkill: {
      backup: {},
      damage: {
        audio: "jsrgzhendan",
        trigger: {
          player: "damageEnd",
          global: "roundEnd"
        },
        filter(event, player) {
          if (event.name === "damage" && !player.isTempBanned("olzhendan")) {
            return true;
          }
          const history = _status.globalHistory;
          if (event.name !== "damage" || !history[history.length - 1].isRound) {
            for (let i = history.length - (event.name === "damage" ? 2 : 1); i >= 0; i--) {
              if (game.hasPlayer2((current) => {
                const actionHistory = current.actionHistory[i];
                return actionHistory.isMe && !actionHistory.isSkipped;
              })) {
                return true;
              }
              if (history[i].isRound) {
                break;
              }
            }
          }
          return false;
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          const history = _status.globalHistory;
          let num = 0;
          if (trigger.name !== "damage" || !history[history.length - 1].isRound) {
            for (let i = history.length - (trigger.name === "damage" ? 2 : 1); i >= 0; i--) {
              game.hasPlayer2((current) => {
                const actionHistory = current.actionHistory[i];
                return actionHistory.isMe && !actionHistory.isSkipped;
              }) && num++;
              if (num === 5 || history[i].isRound) {
                break;
              }
            }
          }
          num > 0 && await player.draw(num);
          trigger.name === "damage" && player.tempBanSkill("jsrgzhendan", "roundStart");
        }
      }
    }
  },
  //司马懿
  jsrgyingshi: {
    trigger: { player: "turnOverAfter" },
    async content(event, trigger, player) {
      const number = game.dead.length > 2 ? 5 : 3;
      const cards2 = get.bottomCards(number);
      game.cardsGotoOrdering(cards2);
      const next = player.chooseToMove("allowChooseAll");
      next.set("list", [["牌堆顶"], ["牌堆底", cards2.reverse()]]);
      next.set("prompt", "鹰眎：点击或拖动将牌移动到牌堆顶或牌堆底");
      next.processAI = (list) => {
        const cards3 = list[1][1], player2 = _status.event.player;
        const top2 = [];
        const judges = player2.getCards("j");
        let stopped = false;
        if (!player2.hasWuxie()) {
          for (let i = 0; i < judges.length; i++) {
            const judge = get.judge(judges[i]);
            cards3.sort((a, b) => judge(b) - judge(a));
            if (judge(cards3[0]) < 0) {
              stopped = true;
              break;
            } else {
              top2.unshift(cards3.shift());
            }
          }
        }
        let bottom2;
        if (!stopped) {
          cards3.sort((a, b) => get.value(b, player2) - get.value(a, player2));
          while (cards3.length) {
            if (get.value(cards3[0], player2) <= 5) {
              break;
            }
            top2.unshift(cards3.shift());
          }
        }
        bottom2 = cards3;
        return [top2, bottom2];
      };
      const { moved } = await next.forResult();
      const top = moved[0];
      const bottom = moved[1];
      top.reverse();
      game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event2, card) => {
        if (event2.top_cards.includes(card)) {
          return ui.cardPile.firstChild;
        }
        return null;
      });
      player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
      game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
      await game.delayx();
    },
    ai: {
      combo: "jsrgtuigu"
    }
  },
  jsrgtuigu: {
    trigger: { player: "phaseBegin" },
    prompt2(event, player) {
      const num = Math.floor(game.countPlayer() / 2);
      return `你翻面，令你本回合的手牌上限+${num}，摸${get.cnNumber(num)}张牌，视为使用一张【解甲归田】（目标角色不能使用这些牌直到其下回合结束）。`;
    },
    group: ["jsrgtuigu_insert", "jsrgtuigu_recover"],
    async content(event, trigger, player) {
      await player.turnOver();
      const num = Math.floor(game.countPlayer() / 2);
      player.addTempSkill("jsrgtuigu_handcard");
      player.addMark("jsrgtuigu_handcard", num, false);
      await player.draw(num);
      const jiejia = new lib.element.VCard({ name: "jiejia", storage: { jsrgtuigu: true }, isCard: true });
      if (player.hasUseTarget(jiejia)) {
        player.addTempSkill("jsrgtuigu_block");
        await player.chooseUseTarget(jiejia, true);
      }
    },
    subSkill: {
      insert: {
        audio: "jsrgtuigu",
        trigger: { global: "roundEnd" },
        filter(event, player) {
          const curLen = player.actionHistory.length;
          for (let i = curLen - 1; i >= 0; i--) {
            const history = player.actionHistory[i];
            if (history.isMe && !history.isSkipped) {
              return false;
            }
            if (history.isRound) {
              break;
            }
          }
          return true;
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          player.insertPhase();
        }
      },
      recover: {
        audio: "jsrgtuigu",
        trigger: {
          player: "loseAfter",
          global: ["gainAfter", "equipAfter", "addJudgeAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          if (player.isHealthy()) {
            return false;
          }
          const evt = event.getl(player);
          return evt && evt.es && evt.es.length > 0;
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          await player.recover();
        }
      },
      handcard: {
        markimage: "image/card/handcard.png",
        intro: {
          content(storage, player) {
            return "手牌上限+" + storage;
          }
        },
        onremove: true,
        charlotte: true,
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("jsrgtuigu_handcard");
          }
        }
      },
      block: {
        trigger: { global: "gainAfter" },
        filter(event, player) {
          if (event.getParent().name != "jiejia") {
            return false;
          }
          const card = event.getParent(2).card;
          if (card && card.storage && card.storage.jsrgtuigu) {
            return true;
          }
          return false;
        },
        charlotte: true,
        forced: true,
        silent: true,
        async content(event, trigger, player) {
          trigger.player.addGaintag(trigger.cards, "jsrgtuigu");
          trigger.player.addTempSkill("jsrgtuigu_blocked", { player: "phaseAfter" });
        }
      },
      blocked: {
        mod: {
          cardEnabled2(card) {
            if (get.itemtype(card) == "card" && card.hasGaintag("jsrgtuigu")) {
              return false;
            }
          }
        },
        charlotte: true,
        forced: true,
        popup: false,
        onremove(player) {
          player.removeGaintag("jsrgtuigu");
        }
      }
    }
  },
  //郭循
  jsrgeqian: {
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      if (!event.isFirstTarget || event.targets.length != 1 || event.target == player) {
        return false;
      }
      if (event.card.name == "sha") {
        return true;
      }
      return event.getParent(3).name == "xumou_jsrg";
    },
    prompt2(event, player) {
      return `令${get.translation(event.card)}不计入次数限制，且你获得${get.translation(event.target)}一张牌，然后其可以令你本回合至其的距离+2`;
    },
    group: "jsrgeqian_prepare",
    logTarget: "target",
    async content(event, trigger, player) {
      if (trigger.addCount !== false) {
        trigger.addCount = false;
        let stat = player.getStat().card, name = trigger.card.name;
        if (typeof stat[name] == "number") {
          stat[name]--;
        }
      }
      await player.gainPlayerCard(trigger.target, "he", true);
      const result = await trigger.target.chooseBool(`是否令${get.translation(player)}至你的距离于本回合内+2？`).set("ai", () => true).forResult();
      if (result?.bool) {
        player.addTempSkill("jsrgeqian_distance");
        if (!player.storage.jsrgeqian_distance) {
          player.storage.jsrgeqian_distance = {};
        }
        const id = trigger.target.playerid;
        if (typeof player.storage.jsrgeqian_distance[id] != "number") {
          player.storage.jsrgeqian_distance[id] = 0;
        }
        player.storage.jsrgeqian_distance[id] += 2;
        player.markSkill("jsrgeqian_distance");
      }
    },
    subSkill: {
      prepare: {
        audio: "jsrgeqian",
        trigger: { player: "phaseJieshuBegin" },
        filter(event, player) {
          return player.countCards("h") && !player.isDisabledJudge();
        },
        direct: true,
        async content(event, trigger, player) {
          while (player.countCards("h") && !player.isDisabledJudge()) {
            const result = await player.chooseCard(get.prompt("jsrgeqian"), "你可以蓄谋任意次").set("ai", (card) => {
              const player2 = get.player();
              if (player2.hasValueTarget(card)) {
                return player2.getUseValue(card);
              }
              return 0;
            }).forResult();
            if (result?.bool && result?.cards?.length) {
              await player.addJudge({ name: "xumou_jsrg" }, result.cards);
            } else {
              break;
            }
          }
        }
      },
      distance: {
        onremove: true,
        charlotte: true,
        mod: {
          globalFrom(player, target, distance) {
            if (!player.storage.jsrgeqian_distance) {
              return;
            }
            const dis = player.storage.jsrgeqian_distance[target.playerid];
            if (typeof dis == "number") {
              return distance + dis;
            }
          }
        },
        intro: {
          content(storage, player) {
            if (!storage) {
              return;
            }
            const map = _status.connectMode ? lib.playerOL : game.playerMap;
            let str = `你本回合：`;
            for (const id in storage) {
              str += "<li>至" + get.translation(map[id]) + "的距离+" + storage[id];
            }
            return str;
          }
        }
      }
    }
  },
  jsrgfusha: {
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "fire",
    filter(event, player) {
      return game.countPlayer((current) => {
        return player.inRange(current);
      }) == 1;
    },
    filterTarget(card, player, target) {
      return player.inRange(target);
    },
    selectTarget: -1,
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      event.target.damage(Math.min(game.countPlayer2(), player.getAttackRange()));
    },
    ai: {
      order: 1,
      result: {
        target: -2
      }
    }
  },
  //大小虎
  jsrgdaimou: {
    trigger: {
      global: "useCardToPlayer"
    },
    filter(event, player) {
      if (event.card.name != "sha") {
        return false;
      }
      const list = player.getStorage("jsrgdaimou_used");
      if (event.target != player) {
        return !list.includes("other") && !player.isDisabledJudge();
      }
      return !list.includes("me") && player.hasCard((card) => {
        return (card.viewAs || card.name) == "xumou_jsrg" && lib.filter.cardDiscardable(card, player, "jsrgdaimou");
      }, "j");
    },
    async cost(event, trigger, player) {
      if (trigger.target == player) {
        event.result = { bool: true };
      } else {
        event.result = await player.chooseBool(get.prompt(event.skill), "你可以用牌堆顶的牌蓄谋").set("ai", () => true).forResult();
      }
    },
    async content(event, trigger, player) {
      player.addTempSkill("jsrgdaimou_used");
      player.markAuto("jsrgdaimou_used", trigger.target == player ? "me" : "other");
      if (trigger.target == player) {
        const { bool, links } = await player.chooseButton(
          [
            "殆谋：请弃置区域里的一张蓄谋牌",
            player.getCards("j", (card) => {
              return (card.viewAs || card.name) == "xumou_jsrg";
            })
          ],
          true
        ).set("filterButton", (button) => {
          return lib.filter.cardDiscardable(button.link, get.player(), "jsrgdaimou");
        }).set("ai", ({ link }) => {
          const player2 = get.player(), card = link.cards?.[0];
          if (!card) {
            return 0;
          }
          if (!player2.hasValueTarget(card)) {
            return 200;
          }
          if (player2.countCards(
            "j",
            (cardx) => cardx?.cards?.some((cardxx) => {
              return cardxx.name == card.name;
            })
          ) > 1) {
            return 101;
          }
          return 1 / Math.max(0.01, player2.getUseValue(link));
        }).forResult();
        if (bool) {
          await player.discard(links);
        }
      } else {
        await player.addJudge({ name: "xumou_jsrg" }, get.cards());
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  jsrgfangjie: {
    trigger: { player: "phaseZhunbeiBegin" },
    direct: true,
    async content(event, trigger, player) {
      if (!player.hasCard((card) => {
        return (card.viewAs || card.name) == "xumou_jsrg";
      }, "j")) {
        player.logSkill("jsrgfangjie");
        await player.recover();
        await player.draw();
      } else {
        const { bool, links } = await player.chooseButton(
          [
            "是否弃置区域里的任意张蓄谋牌并失去〖芳洁〗？",
            player.getCards("j", (card) => {
              return (card.viewAs || card.name) == "xumou_jsrg";
            })
          ],
          [1, Infinity],
          "allowChooseAll"
        ).set("filterButton", (button) => {
          return lib.filter.cardDiscardable(button.link, get.player(), "jsrgdaimou");
        }).set("ai", () => 0).forResult();
        if (bool) {
          player.logSkill("jsrgfangjie");
          await player.discard(links);
          player.removeSkills("jsrgfangjie");
        }
      }
    }
  },
  //曹芳
  jsrgzhaotu: {
    enable: "chooseToUse",
    viewAs: { name: "lebu" },
    position: "hes",
    round: 1,
    viewAsFilter(player) {
      return player.countCards("hes");
    },
    filterCard(card, player) {
      return get.color(card) == "red" && get.type2(card) != "trick";
    },
    onuse(result, player) {
      player.tempBanSkill("jsrgzhaotu", null, false);
      const next = result.targets[0].insertPhase();
      next.skill = "jsrgzhaotu";
      result.targets[0].when({
        player: "phaseBegin"
      }).filter((evt) => evt.skill == "jsrgzhaotu").step(async (event, trigger, player2) => {
        player2.addTempSkill("jsrgzhaotu_handcard");
        player2.addMark("jsrgzhaotu_handcard", 2, false);
      });
    },
    subSkill: {
      handcard: {
        intro: {
          content(storage, player) {
            return "手牌上限-" + storage;
          }
        },
        charlotte: true,
        onremove: true,
        mod: {
          maxHandcard(player, num) {
            return num - player.countMark("jsrgzhaotu_handcard");
          }
        }
      }
    },
    ai: {
      order: 5,
      result: {
        target(player, target) {
          let dis = 0.5 - 0.75 * target.needsToDiscard(2, null, true);
          if (dis > 0) {
            return dis;
          }
          if (player.hasSkill("jsrgjingju") && player.hasZhuSkill("jsrgweizhui") && get.attitude(player, target) > 0) {
            return game.countPlayer((current) => {
              if (current === player || current === target || current.group !== "wei") {
                return false;
              }
              return player.hasZhuSkill("jsrgweizhui", current) && get.attitude(player, current) > 0;
            });
          }
          return dis;
        }
      }
    }
  },
  jsrgjingju: {
    enable: "chooseToUse",
    filter(event, player) {
      if (event.type == "wuxie" || event.jsrgjingju) {
        return false;
      }
      if (!player.canMoveCard(
        null,
        false,
        game.filterPlayer((i) => i != player),
        player,
        (card) => {
          if (card.cards) {
            return get.position(card.cards[0]) == "j";
          }
          return get.position(card) == "j";
        }
      )) {
        return false;
      }
      return get.inpileVCardList((info) => {
        if (info[0] != "basic") {
          return false;
        }
        return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
      }).length;
    },
    chooseButton: {
      dialog(event, player) {
        const vcards = get.inpileVCardList((info) => {
          if (info[0] != "basic") {
            return false;
          }
          return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
        });
        return ui.create.dialog("惊惧", [vcards, "vcard"], "hidden");
      },
      check(button) {
        let player = _status.event.player;
        if (get.event().getParent().type != "phase") {
          return 1;
        }
        return get.player().getUseValue({ name: button.link[2], nature: button.link[3] }) + game.countPlayer((current) => {
          if (current === player || current.group !== "wei") {
            return false;
          }
          return player.hasZhuSkill("jsrgweizhui", current) && get.attitude(player, current) > 0;
        });
      },
      backup(links, player) {
        return {
          filterCard: () => false,
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            isCard: true
          },
          log: false,
          selectCard: -1,
          async precontent(event, trigger, player2) {
            const result = await player2.moveCard({
              prompt: "惊惧：将其他角色判定区里的牌移动至你的判定区",
              sourceTargets: game.filterPlayer((current) => current !== player2),
              aimTargets: [player2],
              filter(card) {
                if ("cards" in card) {
                  return get.position(card.cards[0]) === "j";
                }
                return get.position(card) === "j";
              }
            }).set("logSkill", "jsrgjingju").forResult();
            if (!result.bool) {
              const parent = event.getParent();
              if (parent != null) {
                parent.jsrgjingju = true;
                parent.goto(0);
                delete parent.openskilldialog;
              }
              return;
            }
            await game.delayx();
          }
        };
      },
      prompt(links, player) {
        return "选择" + get.translation(links[0][3] || "") + "【" + get.translation(links[0][2]) + "】的目标";
      }
    },
    ai: {
      order() {
        const player = get.player(), event = _status.event;
        if (player.canMoveCard(null, false, game.filterPlayer(), player, (card) => {
          return get.position(card) == "j";
        })) {
          if (event.type == "dying") {
            if (event.filterCard({ name: "tao" }, player, event)) {
              return 0.5;
            }
          } else {
            if (event.filterCard({ name: "tao" }, player, event) || event.filterCard({ name: "shan" }, player, event)) {
              return 4;
            }
            if (event.filterCard({ name: "sha" }, player, event)) {
              return 2.9;
            }
          }
        }
        return 0;
      },
      save: true,
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        return player.canMoveCard(null, false, game.filterPlayer(), player, (card) => {
          return get.position(card) == "j";
        });
      },
      result: {
        player(player) {
          if (get.event().type == "dying") {
            return get.attitude(player, get.event().dying);
          }
          return 1;
        }
      }
    }
  },
  jsrgweizhui: {
    trigger: { global: "phaseJieshuBegin" },
    zhuSkill: true,
    direct: true,
    filter(event, player) {
      return player != event.player && event.player.group == "wei" && event.player.isIn() && player.hasZhuSkill("jsrgweizhui", event.player);
    },
    async content(event, trigger, player) {
      const { bool, cards: cards2 } = await trigger.player.chooseCard(`是否响应${get.translation(player)}的主公技【危坠】？`, "将一张黑色手牌当【过河拆桥】对其使用", (card, player2) => {
        if (get.color(card) != "black") {
          return false;
        }
        return player2.canUse(get.autoViewAs({ name: "guohe" }, [card]), get.event().target);
      }).set("target", player).set("ai", (card) => {
        if (get.effect(get.event().target, get.autoViewAs({ name: "guohe" }, [card]), player) <= 0) {
          return 0;
        }
        return 7 - get.value(card);
      }).forResult();
      if (bool) {
        trigger.player.logSkill("jsrgweizhui", player);
        trigger.player.useCard(get.autoViewAs({ name: "guohe" }, cards2), cards2, player);
      }
    }
  },
  //孙峻
  jsrgyaoyan: {
    trigger: { player: "phaseZhunbeiBegin" },
    multiline: true,
    multitarget: true,
    logTarget: () => game.filterPlayer().sortBySeat(),
    async content(event, trigger, player) {
      const { targets } = event;
      const toDebateList = [];
      while (targets.length) {
        const current = targets.shift();
        if (!current.isIn()) {
          continue;
        }
        const { bool } = await current.chooseBool(`是否响应${get.translation(player)}的【邀宴】，于回合结束参与议事？`).set(
          "choice",
          (() => {
            if (current === player) {
              return true;
            }
            const att = get.attitude(current, player);
            if (att > 0) {
              if (!toDebateList.includes(player)) {
                return false;
              }
              return true;
            } else {
              if (!player.hasCards("h")) {
                return false;
              }
              if (Math.ceil([...toDebateList, current].length / 2) <= [...toDebateList, current].filter((currentx) => get.attitude(currentx, player) < 0).length) {
                return true;
              }
              if (!player.hasCards("h", { color: "red" })) {
                return false;
              }
              const num1 = game.countPlayer((currentx) => get.attitude(current, currentx) < 0 && currentx.hasCards("h") && toDebateList.includes(currentx));
              const num2 = game.countPlayer((currentx) => get.attitude(currentx, player) > 0 && currentx.hasCards("h") && toDebateList.includes(currentx));
              if (num1 >= num2 + 2) {
                return true;
              }
              if (num1 >= num2) {
                return Math.random() < 0.5;
              }
              return Math.random() < 0.2;
            }
          })()
        ).forResult();
        if (bool) {
          toDebateList.add(current);
          if (current == player) {
            current.chat(["感谢诸位前来会盟！", "列位诸公！对酒！当歌！"].randomGet());
          } else {
            const list = ["我是不会客气的！", "来啊！换大盏", "是啊，吃什么"];
            if (toDebateList.length > 1) {
              list.add("那好啊！他参会我也参会！");
            }
            current.chat(list.randomGet());
          }
          game.log(current, "#g同意", "参加", player, "的议事");
          await game.delay();
        } else {
          if (!toDebateList.includes(player)) {
            if (current == player) {
              current.chat(["我和你们开玩笑呢？！", "容我告老还乡", "我就不能歇会儿吗？！"].randomGet());
            } else {
              current.chat(["你走了，我们吃什么？", "接着奏乐接着舞！"].randomGet());
            }
          } else {
            current.addExpose(0.3);
            current.chat(["孙什么？峻什么？没听说过", "他请我们了吗？"].randomGet());
          }
          game.log(current, "#r拒绝", "参加", player, "的议事");
          await game.delay();
        }
      }
      if (toDebateList.length) {
        player.addTempSkill("jsrgyaoyan_hold");
        player.markAuto("jsrgyaoyan_hold", toDebateList);
      }
    },
    subSkill: {
      hold: {
        charlotte: true,
        onremove: true,
        intro: { content: "已邀请$于回合结束时议事" },
        trigger: { player: "phaseEnd" },
        filter(event, player) {
          return player.getStorage("jsrgyaoyan_hold").some((current) => current.isIn());
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const list = player.getStorage(event.name).filter((current) => current.isIn());
          player.removeSkill(event.name);
          const others = game.filterPlayer().removeArray(list).filter((current) => current != player && current.hasGainableCards(player, "h"));
          await player.chooseToDebate(list).set("others", others).set("ai", (card) => {
            const evt = get.event();
            const { player: player2, source } = evt;
            const { targets, others: others2 } = evt.getParent(2);
            const att = get.attitude(player2, source);
            if (!others2.length) {
              const color = att > 0 ? "black" : "red";
              if (get.color(card) == color) {
                return 10;
              }
              return Math.random();
            } else {
              if (get.color(card) == "red") {
                return 10;
              }
              return Math.random();
            }
          }).set("aiCard", (target) => {
            const evt = get.event();
            const { player: player2, source } = evt;
            const { targets, others: others2 } = evt.getParent(2);
            const att = get.attitude(target, source);
            if (!others2.length) {
              const color = att > 0 ? "black" : "red";
              let hs = target.getCards("h", { color });
              if (!hs.length) {
                hs = target.getCards("h");
              }
              return { bool: true, cards: [hs.randomGet()] };
            } else {
              let hs = target.getCards("h", { color: "red" });
              if (!hs.length) {
                hs = target.getCards("h");
              }
              return { bool: true, cards: [hs.randomGet()] };
            }
          }).set("callback", async (event2) => {
            const { bool, opinion, targets } = event2.debateResult;
            if (bool && opinion && ["red", "black"].includes(opinion)) {
              if (opinion == "red") {
                const notDebated = game.filterPlayer().removeArray(targets).filter((current) => current != player && current.hasGainableCards(player, "h"));
                if (notDebated.length) {
                  const result = await player.chooseTarget("邀宴：获得任意名未议事的角色的各一张手牌", [1, Infinity], true, (card, player2, target) => {
                    return get.event().targets?.includes(target);
                  }).set("targets", notDebated).set("ai", (target) => {
                    const player2 = get.player();
                    const att = get.attitude(player2, target);
                    return -att;
                  }).forResult();
                  if (result?.bool) {
                    const targets2 = result.targets.sortBySeat();
                    player.line(targets2, "green");
                    await player.gainMultiple(targets2);
                  }
                }
              } else {
                const result = await player.chooseTarget("邀宴：你可以对本次参与议事的一名角色造成2点伤害", (card, player2, target) => {
                  return get.event().targets.includes(target);
                }).set("targets", targets).set("ai", (target) => {
                  const player2 = get.player();
                  return get.damageEffect(target, player2, player2);
                }).forResult();
                if (result?.bool) {
                  player.line(result.targets[0]);
                  await result.targets[0].damage(2);
                }
              }
            }
          });
        }
      }
    }
  },
  jsrgbazheng: {
    trigger: { global: "debateShowOpinion" },
    filter(event, player) {
      if (!event.targets.includes(player)) {
        return false;
      }
      const damagedPlayers = player.getHistory("sourceDamage").map((evt) => evt.player).toUniqued();
      let dissent;
      const colors = ["red", "black"];
      for (const color of colors) {
        if (event[color].some((i) => i[0] == player)) {
          dissent = colors.find((i) => i != color);
          break;
        }
      }
      return event[dissent].some((i) => damagedPlayers.includes(i[0]));
    },
    forced: true,
    locked: false,
    direct: true,
    async content(event, trigger, player) {
      let myOpinion, dissent;
      const colors = ["red", "black"];
      for (const color of colors) {
        if (trigger[color].some((i) => i[0] == player)) {
          myOpinion = color;
          dissent = colors.find((i) => i != color);
          break;
        }
      }
      const damagedPlayers = player.getHistory("sourceDamage").map((evt) => evt.player).toUniqued();
      let dissident = [];
      for (let i = 0; i < trigger[dissent].length; i++) {
        const pair = trigger[dissent][i];
        if (damagedPlayers.includes(pair[0])) {
          dissident.push(pair[0]);
          trigger[myOpinion].push(pair);
          trigger[dissent].splice(i--, 1);
        }
      }
      player.logSkill("jsrgbazheng", dissident);
    },
    ai: {
      combo: "jsrgyaoyan"
    }
  },
  //刘永
  jsrgdanxin: {
    enable: "chooseToUse",
    onChooseToUse(event) {
      if (game.online) {
        return;
      }
      const count = event.player.getHistory("useSkill", (evt) => evt.skill == "jsrgdanxin").length + 1;
      event.set("jsrgdanxin_count", count);
    },
    viewAs: {
      name: "tuixinzhifu",
      storage: { jsrgdanxin: true }
    },
    filterCard: true,
    selectCard() {
      const count = get.event().jsrgdanxin_count;
      return count;
    },
    check(card) {
      let val = get.value(card);
      if (get.suit(card) == "heart") {
        return 1 / Math.max(0.1, val);
      }
      return 6 - val;
    },
    position: "hes",
    async precontent(event, trigger, player) {
      player.addTempSkill("jsrgdanxin_effect");
    },
    ai: {
      order(item, player) {
        if (game.hasPlayer((current) => player != current && player.canUse({ name: "tuixinzhifu" }, current) && get.effect(current, "jsrgdanxin", player, player) > 0)) {
          return 10;
        }
        return 5;
      },
      result: {
        target(player, target) {
          if (player.isDamaged() || get.attitude(player, target) > 0 && target.isDamaged()) {
            const bool = player.hasSkillTag("viewHandcard", null, target, true) && target.hasCard({ suit: "heart" }, "h") || target.hasCard((card) => {
              if (["e", "j"].includes(get.position(card))) {
                return get.suit(card) == "heart";
              }
              return get.suit(card) == "heart" && card.isKnownBy(player);
            }, "hej");
            return 1 + get.recoverEffect(player, player, player) + get.recoverEffect(target, player, player) + bool ? 2 : 0;
          }
          return lib.card.tuixinzhifu.ai.result.target(player, target);
        }
      }
    },
    subSkill: {
      effect: {
        trigger: {
          player: ["gainPlayerCardBefore", "chooseToGiveBefore"],
          global: "gainAfter"
        },
        filter(event, player, name) {
          const level = name != "gainAfter" ? 1 : 2;
          return event.getParent(level).card?.storage?.jsrgdanxin;
        },
        forced: true,
        popup: false,
        charlotte: true,
        async content(event, trigger, player) {
          if (event.triggername == "gainAfter") {
            const { targets } = trigger.getParent(2);
            await player.showCards(trigger.cards);
            if (trigger.cards.some((card) => get.suit(card) == "heart")) {
              const owners = trigger.cards.filter((card) => get.suit(card) == "heart").map((card) => get.owner(card)).toUniqued();
              for (const owner of owners) {
                if (owner && owner.isIn()) {
                  await owner.recover();
                  await owner.draw();
                }
              }
            }
            if (trigger.player == player) {
              return;
            }
            player.addTempSkill("jsrgdanxin_distance");
            if (!player.storage.jsrgdanxin_distance) {
              player.storage.jsrgdanxin_distance = {};
            }
            const id = targets[0].playerid;
            if (typeof player.storage.jsrgdanxin_distance[id] != "number") {
              player.storage.jsrgdanxin_distance[id] = 0;
            }
            player.storage.jsrgdanxin_distance[id]++;
            player.markSkill("jsrgdanxin_distance");
          } else if (event.triggername == "gainPlayerCardBefore") {
            trigger.ai = (button) => {
              const { player: player2, target } = get.event();
              const { link: card } = button;
              if (get.recoverEffect(player2, player2, player2) > 0 && get.suit(card) == "heart") {
                return 10;
              }
              if (get.attitude(player2, target) > 0) {
                if (get.position(card) == "j") {
                  const cardj = card.viewAs ? { name: card.viewAs } : card;
                  return get.effect(target, cardj, target, player2) < 0 ? 11 : 0;
                } else if (get.position(card) == "e") {
                  return get.value(card, target) <= 0 ? 5 : 0;
                } else {
                  return 6 - get.value(card);
                }
              }
              return get.value(card);
            };
          } else {
            trigger.ai = (card) => {
              const { player: player2, target } = get.event();
              const recover = get.suit(card) == "heart" ? get.recoverEffect(target, player2, player2) : 0;
              if (get.attitude(player2, target) > 0) {
                return recover + get.value(card);
              }
              return recover + 6 - get.value(card);
            };
          }
        }
      },
      distance: {
        onremove: true,
        charlotte: true,
        mod: {
          globalFrom(player, target, distance) {
            if (!player.storage.jsrgdanxin_distance) {
              return;
            }
            const dis = player.storage.jsrgdanxin_distance[target.playerid];
            if (typeof dis == "number") {
              return distance + dis;
            }
          }
        },
        intro: {
          content(storage, player) {
            if (!storage) {
              return;
            }
            const map = _status.connectMode ? lib.playerOL : game.playerMap;
            let str = `你本回合：`;
            for (const id in storage) {
              str += "<li>至" + get.translation(map[id]) + "的距离+" + storage[id];
            }
            return str;
          }
        }
      }
    }
  },
  jsrgfengxiang: {
    audio: "fengxiang",
    trigger: {
      player: "damageEnd",
      source: "damageSource"
    },
    forced: true,
    direct: true,
    filter(event, player, name) {
      const key = name == "damageEnd" ? "damage" : "sourceDamage";
      if (player.getHistory(key).indexOf(event) !== 0) {
        return false;
      }
      return game.hasPlayer((current) => {
        return current.countCards("e");
      });
    },
    async content(event, trigger, player) {
      const { bool, targets } = await player.chooseTarget(
        "封乡：与一名其他角色交换装备区里的所有牌",
        (card, player2, target) => {
          return target.countCards("e") + player2.countCards("e") > 0 && player2 != target;
        },
        true
      ).set("ai", (target) => {
        const player2 = get.player();
        const att = get.attitude(player2, target);
        let delta = get.value(target.getCards("e"), player2) - get.value(player2.getCards("e"), player2);
        if (att > 0) {
          if (delta < 0) {
            delta += att / 3;
          }
        } else {
          if (delta < 0) {
            delta -= att / 3;
          }
        }
        return delta;
      }).forResult();
      if (bool) {
        player.logSkill("jsrgfengxiang", targets[0]);
        const num = player.countCards("e");
        await player.swapEquip(targets[0]);
        const delta = num - player.countCards("e");
        if (delta > 0) {
          await player.draw(delta);
        }
      }
    }
  },
  jsrgfuhai: {
    audio: "xinfu_fuhai",
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => {
        return current.countCards("h") && current != player;
      });
    },
    filterTarget(card, player, target) {
      return target.countCards("h") && target != player;
    },
    selectTarget: -1,
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      const targets = event.targets.sortBySeat();
      const next = player.chooseCardOL(targets, "请展示一张手牌", true).set("ai", (card) => {
        return -get.value(card);
      }).set("aiCard", (target) => {
        const hs = target.getCards("h");
        return { bool: true, cards: [hs.randomGet()] };
      });
      next._args.remove("glow_result");
      let result = await next.forResult();
      const cards2 = [];
      for (let i = 0; i < targets.length; i++) {
        cards2.push(result[i].cards[0]);
      }
      await player.showCards(cards2, get.translation(player) + "发动了【浮海】").set("customButton", (button) => {
        const target = get.owner(button.link);
        if (target) {
          game.createButtonCardsetion(`${target.getName(true)}`, button);
        }
      }).set("delay_time", 4).set("multipleShow", true);
      let clock = -1, anticlock = -1;
      for (let j = 0; j < 2; j++) {
        let increase = -Infinity, decrease = Infinity, count = 0;
        for (let i = 0; i < targets.length; i++) {
          const number = get.number(cards2[i], false);
          let flag = false;
          if (number > increase) {
            increase = number;
            flag = true;
          } else {
            increase = Infinity;
          }
          if (number < decrease) {
            decrease = number;
            flag = true;
          } else {
            decrease = -Infinity;
          }
          if (flag) {
            count++;
          } else {
            break;
          }
        }
        targets.reverse();
        cards2.reverse();
        if (j == 0) {
          anticlock = Math.max(1, count);
        } else {
          clock = Math.max(1, count);
        }
      }
      result = await player.chooseControl(`↖顺时针(${clock})`, `逆时针(${anticlock})↗`).set("prompt", "请选择一个方向，摸对应数量的牌").set("ai", () => get.event().choice).set("choice", clock > anticlock ? 0 : 1).forResult();
      if (typeof result?.index !== "number") {
        return;
      }
      await player.draw(result.index == 0 ? clock : anticlock);
    },
    ai: {
      order: 8,
      result: { player: 1 }
    }
  },
  //张嫙
  jsrgtongli: {
    audio: "tongli",
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      if (!event.isFirstTarget) {
        return false;
      }
      const type = get.type(event.card);
      if (type != "basic" && type != "trick") {
        return false;
      }
      const hs = player.getCards("h");
      if (!hs.length) {
        return false;
      }
      const evt = event.getParent("phaseUse");
      if (!evt || evt.player != player) {
        return false;
      }
      const num1 = player.getHistory("useCard", (evtx) => {
        return evtx.getParent("phaseUse") == evt;
      }).length;
      if (hs.length < num1) {
        return false;
      }
      const list = [];
      for (const i of hs) {
        list.add(get.suit(i, player));
      }
      return list.length == num1;
    },
    prompt2(event, player) {
      let str = "展示所有手牌，额外结算一次";
      if (event.card.name == "sha" && game.hasNature(event.card)) {
        str += get.translation(event.card.nature);
      }
      return str + "【" + get.translation(event.card.name) + "】";
    },
    check(event, player) {
      return !get.tag(event.card, "norepeat");
    },
    async content(event, trigger, player) {
      await player.showHandcards();
      trigger.getParent().effectCount++;
    }
  },
  jsrgshezang: {
    audio: "shezang",
    round: 1,
    trigger: { global: "dying" },
    frequent: true,
    filter(event, player) {
      return event.player == player || player == _status.currentPhase;
    },
    async content(event, trigger, player) {
      const cards2 = get.cards(4);
      game.cardsGotoOrdering(cards2);
      const videoId = lib.status.videoId++;
      game.broadcastAll(
        (player2, id, cards3) => {
          let str = "奢葬";
          if (player2 == game.me && !_status.auto) {
            str += "：获得任意张花色各不相同的牌";
          }
          const dialog = ui.create.dialog(str, cards3);
          dialog.videoId = id;
        },
        player,
        videoId,
        cards2
      );
      const time = get.utc();
      game.addVideo("showCards", player, ["奢葬", get.cardsInfo(cards2)]);
      game.addVideo("delay", null, 2);
      const list = [];
      for (const i of cards2) {
        list.add(get.suit(i, false));
      }
      const next = player.chooseButton([1, list.length]);
      next.set("dialog", event.videoId);
      next.set("filterButton", function(button) {
        for (let i = 0; i < ui.selected.buttons.length; i++) {
          if (get.suit(ui.selected.buttons[i].link) == get.suit(button.link)) {
            return false;
          }
        }
        return true;
      });
      next.set("ai", function(button) {
        return get.value(button.link, _status.event.player);
      });
      const result = await next.forResult();
      if (result.bool && result.links?.length) {
        const time2 = 1e3 - (get.utc() - time);
        if (time2 > 0) {
          await game.delay(0, time2);
        }
        game.broadcastAll("closeDialog", videoId);
        await player.gain(result.links, "gain2");
      }
    }
  },
  jsrgchiying: {
    audio: "dcchiying",
    enable: "phaseUse",
    usable: 1,
    filterTarget: true,
    async content(event, trigger, player) {
      const target = event.target;
      const targets = game.filterPlayer((current) => target.inRange(current) && current != player).sortBySeat(player);
      if (!targets.length) {
        return;
      }
      while (targets.length) {
        const current = targets.shift();
        if (current.countCards("he")) {
          await current.chooseToDiscard("驰应：请弃置一张牌", "he", true);
        }
      }
      let cards2 = [];
      game.getGlobalHistory("cardMove", (evt) => {
        if (evt.getParent(3) == event) {
          cards2.addArray(evt.cards.filter((card) => get.type(card) == "basic"));
        }
      });
      if (cards2.length <= target.getHp()) {
        cards2 = cards2.filterInD("d");
        if (cards2.length) {
          await target.gain(cards2, "gain2");
        }
      }
    },
    ai: {
      order: 6,
      result: {
        player(player, target) {
          const targets = game.filterPlayer((current) => target.inRange(current) && current != player);
          let eff = 0;
          for (const targetx of targets) {
            let effx = get.effect(targetx, { name: "guohe_copy2" }, targetx, player);
            eff += effx;
          }
          return eff;
        },
        target(player, target) {
          return game.countPlayer((current) => {
            return current !== player && target.inRange(current) && current.countCards("h");
          }) / 2 * get.effect(target, { name: "draw" }, target, target);
        }
      }
    }
  },
  //郭照
  jsrgpianchong: {
    audio: "pianchong",
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      return player.getHistory("lose").length;
    },
    frequent: true,
    async content(event, trigger, player) {
      const result = await player.judge().forResult();
      let num = 0;
      game.getGlobalHistory("cardMove", (evt) => {
        if (evt.name != "cardsDiscard") {
          if (evt.name != "lose" || evt.position != ui.discardPile) {
            return false;
          }
        }
        num += evt.cards.filter((i) => get.color(i, false) == result.color).length;
      });
      if (num > 0) {
        await player.draw(num);
      }
    }
  },
  jsrgzunwei: {
    audio: "zunwei",
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      const storage = player.getStorage("jsrgzunwei");
      return storage.length < 3 && game.hasPlayer((current) => {
        return player.isDamaged() && current.getHp() > player.getHp() && !storage.includes(2) || current.countCards("h") > player.countCards("h") && !storage.includes(0) || current.countCards("e") > player.countCards("e") && !storage.includes(1);
      });
    },
    chooseButton: {
      dialog(event, player) {
        const list = ["选择手牌数大于你的一名角色", "选择装备数大于你的一名角色", "选择体力值大于你的一名角色"];
        const choiceList = ui.create.dialog("尊位：请选择一项", "forcebutton", "hidden");
        choiceList.add([
          list.map((item, i) => {
            if (player.getStorage("jsrgzunwei").includes(i)) {
              item = `<span style="text-decoration: line-through;">${item}</span>`;
            }
            return [i, item];
          }),
          "textbutton"
        ]);
        return choiceList;
      },
      filter(button) {
        const player = get.player();
        if (player.getStorage("jsrgzunwei").includes(button.link)) {
          return false;
        }
        if (button.link == 2) {
          if (!player.isDamaged()) {
            return false;
          }
          return game.hasPlayer((current) => {
            return current.getHp() > player.getHp();
          });
        }
        if (button.link == 0) {
          return game.hasPlayer((current) => {
            return current.countCards("h") > player.countCards("h");
          });
        }
        if (button.link == 1) {
          return game.hasPlayer((current) => {
            return current.countCards("e") > player.countCards("e");
          });
        }
      },
      backup(links) {
        const next = get.copy(lib.skill.jsrgzunwei.backups[links[0]]);
        next.audio = "zunwei";
        next.filterCard = function() {
          return false;
        };
        next.selectCard = -1;
        return next;
      },
      check(button) {
        const player = get.player();
        switch (button.link) {
          case 2: {
            const target = game.findPlayer(function(current) {
              return current.isMaxHp();
            });
            return (Math.min(target.hp, player.maxHp) - player.hp) * 2;
          }
          case 0: {
            const target = game.findPlayer(function(current) {
              return current.isMaxHandcard();
            });
            return Math.min(5, target.countCards("h") - player.countCards("h")) * 0.8;
          }
          case 1: {
            const target = game.findPlayer(function(current) {
              return current.isMaxEquip();
            });
            return (target.countCards("e") - player.countCards("e")) * 1.4;
          }
        }
      },
      prompt(links) {
        return ["选择一名手牌数大于你的其他角色，将手牌数摸至与其相同（至多摸五张）", "选择一名装备区内牌数大于你的其他角色，将其装备区里的牌移至你的装备区，直到你装备数不小于其", "选择一名体力值大于你的其他角色，将体力值回复至与其相同"][links[0]];
      }
    },
    backups: [
      {
        filterTarget(card, player, target) {
          return target.countCards("h") > player.countCards("h");
        },
        async content(event, trigger, player) {
          await player.draw(Math.min(5, event.target.countCards("h") - player.countCards("h")));
          if (!player.storage.jsrgzunwei) {
            player.storage.jsrgzunwei = [];
          }
          player.storage.jsrgzunwei.add(0);
        },
        ai: {
          order: 10,
          result: {
            player(player, target) {
              return Math.min(5, target.countCards("h") - player.countCards("h"));
            }
          }
        }
      },
      {
        filterTarget(card, player, target) {
          return target.countCards("e") > player.countCards("e");
        },
        async content(event, trigger, player) {
          if (!player.storage.jsrgzunwei) {
            player.storage.jsrgzunwei = [];
          }
          player.storage.jsrgzunwei.add(1);
          const target = event.target;
          do {
            if (!target.countCards("e", (card) => {
              return player.canEquip(card);
            })) {
              break;
            }
            const { bool, links } = await player.chooseButton([`尊位：将${get.translation(target)}的一张装备牌移至你的区域内`, target.getCards("e")], true).set("filterButton", (button) => {
              return get.player().canEquip(button.link);
            }).set("ai", get.buttonValue).forResult();
            if (bool) {
              target.$give(links[0], player, false);
              await player.equip(links[0]);
            }
          } while (player.countCards("e") < target.countCards("e"));
        },
        ai: {
          order: 10,
          result: {
            target(player, target) {
              return player.countCards("e") - target.countCards("e");
            }
          }
        }
      },
      {
        filterTarget(card, player, target) {
          if (player.isHealthy()) {
            return false;
          }
          return target.hp > player.hp;
        },
        async content(event, trigger, player) {
          await player.recover(event.target.hp - player.hp);
          if (!player.storage.jsrgzunwei) {
            player.storage.jsrgzunwei = [];
          }
          player.storage.jsrgzunwei.add(2);
        },
        ai: {
          order: 10,
          result: {
            player(player, target) {
              return Math.min(target.hp, player.maxHp) - player.hp;
            }
          }
        }
      }
    ],
    ai: {
      order: 10,
      result: {
        player: 1
      }
    },
    subSkill: {
      backup: {}
    }
  },
  //江山如故·转
  //404郭嘉
  jsrgqingzi: {
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => {
        if (current == player) {
          return false;
        }
        return current.hasCard((card) => {
          return lib.filter.canBeDiscarded(card, player, current);
        }, "e");
      });
    },
    derivation: "xinshensu",
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt("jsrgqingzi"),
        prompt2: "弃置任意名其他角色装备区里的一张牌，然后令这些角色获得〖神速〗直到你的下回合开始",
        filterTarget(card, player2, target) {
          return target !== player2 && target.hasCard((card2) => lib.filter.canBeDiscarded(card2, player2, target), "e");
        },
        selectTarget: [1, Infinity],
        ai(target) {
          const currentPlayer = get.player();
          return target.hasCard((card) => lib.filter.canBeDiscarded(card, currentPlayer, target) && get.value(card, target) > 3 || target.hp == 1 && get.value(card, target) > 0) ? 1 : 0;
        }
      }).forResult();
    },
    logTarget: "targets",
    async content(event, trigger, player) {
      const { targets } = event;
      targets.sortBySeat();
      player.addSkill("jsrgqingzi_clear");
      for (const target of targets) {
        if (target.hasCard((card) => lib.filter.canBeDiscarded(card, player, target), "e")) {
          await player.discardPlayerCard({
            target,
            position: "e",
            forced: true
          });
          await target.addAdditionalSkills(`jsrgqingzi_${player.playerid}`, "xinshensu");
          player.markAuto("jsrgqingzi_clear", [target]);
        }
      }
    },
    subSkill: {
      clear: {
        audio: "jsrgqingzi",
        charlotte: true,
        trigger: {
          global: "die",
          player: "phaseBegin"
        },
        forced: true,
        popup: false,
        forceDie: true,
        onremove: true,
        filter(event, player) {
          if (event.name == "die") {
            return player == event.player || player.getStorage("jsrgqingzi_clear").includes(event.player);
          }
          return player.getStorage("jsrgqingzi_clear").length > 0;
        },
        async content(event, trigger, player) {
          const targets = player.getStorage("jsrgqingzi_clear");
          if (trigger.name === "die" && player === trigger.player) {
            for (const target of targets) {
              target.removeAdditionalSkill(`jsrgqingzi_${player.playerid}`);
            }
            player.removeSkill("jsrgqingzi_clear");
            return;
          }
          if (trigger.name == "phase") {
            event.targets = targets.slice(0).sortBySeat();
          } else {
            event.targets = [trigger.player];
          }
          const storage = player.getStorage("jsrgqingzi_clear");
          for (const target of event.targets) {
            if (storage.includes(target)) {
              storage.remove(target);
              target.removeAdditionalSkill(`jsrgqingzi_${player.playerid}`);
            }
          }
          if (!storage.length) {
            player.removeSkill("jsrgqingzi_clear");
          }
        }
      }
    }
  },
  jsrgdingce: {
    trigger: { player: "damageEnd" },
    filter(event, player) {
      if (!event.source?.isIn()) {
        return false;
      }
      return player.hasCard((card) => {
        return lib.filter.cardDiscardable(card, player, "jsrgdingce");
      });
    },
    async cost(event, trigger, player) {
      const { source: target } = trigger;
      event.result = await player.chooseToDiscard({
        prompt: get.prompt(event.skill, target),
        prompt2: "弃置你与其的各一张手牌。若这两张牌颜色相同，你视为使用一张【洞烛先机】。",
        ai(card) {
          return _status.event.goon ? 6 - get.value(card) : 0;
        }
      }).set("chooseonly", true).set(
        "goon",
        get.attitude(player, target) < 0 || player.getCards("h").concat(target.getCards("h")).filter((card) => get.value(card) < 5.5).length >= 2
      ).forResult();
    },
    async content(event, trigger, player) {
      const { source: target } = trigger;
      await player.discard(event.cards);
      const card = event.cards[0];
      if (!target.hasDiscardableCards(player, "h")) {
        return;
      }
      const next = player.discardPlayerCard({
        target,
        position: "h",
        forced: true
      });
      if (target === player) {
        next.set("ai", (button) => {
          const card2 = button.link;
          return (get.color(card2, false) === get.event().color ? 7.5 : 5) - get.value(card2);
        });
        next.set("color", get.color(card, false));
      }
      const result = await next.forResult();
      if (!result?.bool || !result.cards?.length) {
        return;
      }
      const discardedCard = result.cards[0];
      if (get.color(card, false) === get.color(discardedCard, false)) {
        await game.delayex();
        await player.chooseUseTarget({
          card: get.autoViewAs({ name: "dongzhuxianji", isCard: true }),
          forced: true
        });
      }
    }
  },
  jsrgzhenfeng: {
    enable: "phaseUse",
    locked: false,
    filter(event, player) {
      if (!event.jsrgzhenfeng) {
        return false;
      }
      return event.jsrgzhenfeng.some(
        (info) => event.filterCard(
          {
            name: info[2],
            nature: info[3],
            storage: { jsrgzhenfeng: true },
            isCard: true
          },
          player,
          event
        )
      );
    },
    onChooseToUse(event) {
      if (!event.jsrgzhenfeng && !game.online) {
        let str = "";
        game.countPlayer((current) => {
          current.getSkills(null, false, false).forEach((skill) => {
            let info = get.info(skill);
            if (!info || info.charlotte) {
              return;
            }
            let translation = get.skillInfoTranslation(skill, current);
            str += translation;
          });
        });
        event.set("jsrgzhenfeng", lib.skill.jsrgzhenfeng.getInclusion(str, null, event.player));
      }
    },
    getInclusion(str, checkCard, player) {
      let list = [];
      const names = Object.keys(lib.card);
      for (const name of names) {
        let type = get.type(name);
        if (!["basic", "trick"].includes(type)) {
          continue;
        }
        if (player && player.getStorage("jsrgzhenfeng_used").includes(type)) {
          continue;
        }
        const reg = `【${get.translation(name)}】`;
        if (name == "sha") {
          if (str.includes(reg)) {
            if (checkCard && checkCard.name == name) {
              return true;
            }
            list.push([type, "", name]);
          }
          for (let nature of lib.inpile_nature) {
            const reg1 = `【${get.translation(nature) + get.translation(name)}】`, reg2 = `${get.translation(nature)}【${get.translation(name)}】`;
            if (str.includes(reg1) || str.includes(reg2)) {
              if (checkCard && checkCard.name == name && checkCard.nature == nature) {
                return true;
              }
              list.push([type, "", name, nature]);
            }
          }
        } else {
          if (!str.includes(reg)) {
            continue;
          }
          if (checkCard && checkCard.name == name) {
            return true;
          }
          list.push([type, "", name]);
        }
      }
      if (checkCard) {
        return false;
      }
      return list;
    },
    chooseButton: {
      dialog(event, player) {
        let list = event.jsrgzhenfeng.filter((info) => {
          return event.filterCard(
            {
              name: info[2],
              nature: info[3],
              storage: { jsrgzhenfeng: true },
              isCard: true
            },
            player,
            event
          );
        });
        return ui.create.dialog("针锋", [list, "vcard"]);
      },
      filter(button, player) {
        return _status.event.getParent().filterCard(
          {
            name: button.link[2],
            nature: button.link[3],
            storage: { jsrgzhenfeng: true },
            isCard: true
          },
          player,
          _status.event.getParent()
        );
      },
      check(button) {
        let player = _status.event.player;
        let card = {
          name: button.link[2],
          nature: button.link[3],
          storage: { jsrgzhenfeng: true },
          isCard: true
        };
        let eff = player.getUseValue(card);
        if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) {
          eff /= 5;
        }
        let info = get.info(card);
        if (info.toself) {
          let str = player.getSkills(null, false, false).map((skill) => {
            let info2 = get.info(skill);
            if (!info2 || info2.charlotte) {
              return;
            }
            return get.skillInfoTranslation(skill, player);
          }).join("\n");
          if (lib.skill.jsrgzhenfeng.getInclusion(str, card)) {
            let num = 1;
            if (player.getHp() + player.hujia <= 1) {
              num++;
            }
            eff += get.damageEffect(player, player, player) * num;
          }
        }
        return eff;
      },
      backup(links, player) {
        return {
          audio: "jsrgzhenfeng",
          filterCard: () => false,
          selectCard: -1,
          popname: true,
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            storage: { jsrgzhenfeng: true },
            isCard: true
          },
          log: false,
          async precontent(event, trigger, player2) {
            player2.logSkill("jsrgzhenfeng");
            const evt = event.getParent();
            if (evt != null) {
              evt.addCount = false;
            }
            player2.addTempSkill("jsrgzhenfeng_used", "phaseUseAfter");
            player2.markAuto("jsrgzhenfeng_used", [get.type(event.result.card)]);
          }
        };
      },
      prompt(links, player) {
        return "视为使用一张" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
      }
    },
    mod: {
      cardUsable(card) {
        if (card.storage?.jsrgzhenfeng) {
          return Infinity;
        }
      },
      targetInRange(card) {
        if (card.storage?.jsrgzhenfeng) {
          return true;
        }
      }
    },
    ai: {
      order: 1,
      result: {
        player: 1
      }
    },
    group: "jsrgzhenfeng_effect",
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      },
      effect: {
        audio: "jsrgzhenfeng",
        trigger: { global: "useCardToBegin" },
        charlotte: true,
        forced: true,
        onremove: true,
        filter(event, player) {
          if (!event.card.storage?.jsrgzhenfeng) {
            return false;
          }
          let str = event.target.getSkills(null, false, false).map((skill) => {
            let info = get.info(skill);
            if (!info || info.charlotte) {
              return;
            }
            return get.skillInfoTranslation(skill, event.target);
          }).join("\n");
          return lib.skill.jsrgzhenfeng.getInclusion(str, event.card);
        },
        logTarget: "target",
        async content(event, trigger, player) {
          await trigger.target.damage();
        }
      }
    }
  },
  //张飞
  jsrgbaohe: {
    trigger: { global: "phaseUseEnd" },
    filter(event, player) {
      return player.countCards("he") >= 2 && game.hasPlayer((current) => {
        return current.inRange(event.player) && player.canUse("sha", current, false);
      });
    },
    async cost(event, trigger, player) {
      const val = game.filterPlayer((current) => current.inRange(trigger.player) && player.canUse("sha", current, false)).map((current) => get.effect(current, { name: "sha" }, player, player)).reduce((a, b) => a + b, 0);
      event.result = await player.chooseToDiscard({
        prompt: get.prompt2("jsrgbaohe"),
        selectCard: 2,
        position: "he",
        ai(card) {
          const val2 = get.event().val;
          if (val2 > 20) {
            return 6 - get.value(card);
          }
          if (val2 > 0) {
            return 4 - get.value(card);
          }
          return 0;
        }
      }).set("val", val).forResult();
    },
    async content(event, trigger, player) {
      const targets = game.filterPlayer((current) => current.inRange(trigger.player) && player.canUse("sha", current, false));
      if (targets.length) {
        player.addTempSkill("jsrgbaohe_add");
        await game.delayex();
        await player.useCard({
          card: get.autoViewAs({ name: "sha", isCard: true, storage: { jsrgbaohe: true } }),
          targets,
          addCount: false
        });
      }
    },
    subSkill: {
      add: {
        audio: "jsrgbaohe",
        trigger: {
          global: "useCard"
        },
        charlotte: true,
        forced: true,
        filter(event, player) {
          const evt = event?.getParent(3);
          const respondTo = event?.respondTo;
          if (evt?.name != "useCard" || !Array.isArray(respondTo) || !respondTo[1].storage || !respondTo[1].storage.jsrgbaohe) {
            return false;
          }
          return evt.targets.length > evt.num + 1;
        },
        logTarget(event) {
          const evt = event?.getParent(3);
          return evt?.targets.slice(evt.num + 1);
        },
        async content(event, trigger, player) {
          const evt = trigger.getParent(3);
          if (evt == null) {
            return;
          }
          const targets = evt.targets.slice(evt.num + 1);
          const map = evt.customArgs;
          for (let target of targets) {
            const id = target.playerid;
            if (id == null) {
              continue;
            }
            if (!map[id]) {
              map[id] = {};
            }
            if (typeof map[id].extraDamage !== "number") {
              map[id].extraDamage = 0;
            }
            map[id].extraDamage++;
          }
          await game.delayx();
        }
      }
    }
  },
  jsrgxushi: {
    enable: "phaseUse",
    usable: 1,
    filterCard: true,
    filterTarget: lib.filter.notMe,
    selectCard: [1, Infinity],
    selectTarget: [1, Infinity],
    position: "he",
    filterOk() {
      return ui.selected.cards.length == ui.selected.targets.length;
    },
    check(card) {
      let player = get.player();
      if (ui.selected.cards.length >= game.countPlayer((current) => {
        return current != player && get.attitude(player, current) > 0;
      })) {
        return 0;
      }
      return 5 - get.value(card);
    },
    prompt: "按顺序选择卡牌和角色，并将卡牌交给对应顺序的角色。然后你获得两倍数量的【影】。",
    complexSelect: true,
    multitarget: true,
    multiline: true,
    discard: false,
    lose: false,
    delay: false,
    async contentBefore(event) {
      const evt = event.getParent();
      if (evt == null) {
        return;
      }
      evt._jsrgxushi_targets = event.targets.slice();
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      const evt = event.getParent();
      if (evt == null) {
        return;
      }
      const targets = evt._jsrgxushi_targets;
      const list = [];
      for (const [i, target] of targets.entries()) {
        const card = cards2[i];
        list.push([target, card]);
        player.line(target);
      }
      await game.loseAsync({
        gain_list: list,
        player,
        cards: cards2,
        giver: player,
        animate: "giveAuto"
      }).setContent("gaincardMultiple");
      await player.gain({
        cards: lib.card.ying.getYing(2 * cards2.length),
        animate: "gain2"
      });
    },
    ai: {
      order: 2.5,
      result: {
        target(player, target) {
          let card = ui.selected.cards[ui.selected.targets.length];
          if (!card) {
            return 0;
          }
          if (get.value(card) < 0) {
            return -1;
          }
          if (get.value(card) < 1.5 && player.hasSkill("jsrgbaohe")) {
            return (get.sgnAttitude(player, target) + 0.01) / 5;
          }
          return Math.sqrt(5 - Math.min(4, target.countCards("h")));
        }
      }
    }
  },
  jsrgzhuiming: {
    trigger: {
      player: "useCardToPlayered"
    },
    filter(event, player) {
      if (event.card.name != "sha") {
        return false;
      }
      return event.isFirstTarget && event.targets.length == 1 && event.target.isIn();
    },
    direct: true,
    async content(event, trigger, player) {
      let target = trigger.target;
      let colors = Object.keys(lib.color).remove("none");
      let result = await player.chooseControl(colors, "cancel2").set("prompt", get.prompt("jsrgzhuiming")).set("prompt2", `声明一种颜色并令${get.translation(trigger.target)}弃置任意张牌`).set("ai", () => {
        let player2 = get.player(), target2 = get.event().target, att = get.attitude(player2, target2) > 0 ? 1 : -1, colors2 = get.event().controls, known = target2.getCards("e");
        if (att > 0) {
          return "cancel2";
        }
        known.addArray(target2.getKnownCards(player2));
        if (colors2.includes("red") && !known.some((i) => get.color(i) != "red")) {
          return "red";
        }
        known = 2 * known.filter((i) => get.color(i) == colors2[0]).length - known.length;
        if (Math.abs(known) > 1) {
          if (known > 1) {
            return colors2[0];
          }
          return colors2[1];
        }
        let list = get.event().controls.map((i) => [
          i,
          target2.getCards("he").map(get.value).reduce((p, c) => p + c, 0)
        ]).sort((a, b) => {
          return att * (a[1] - b[1]);
        });
        return list[0][0];
      }).set("target", target).forResult();
      let color = result.control;
      if (color == "cancel2") {
        event.finish();
        return;
      }
      player.logSkill("jsrgzhuiming", target);
      player.popup(color, color == "red" ? "fire" : "thunder");
      game.log(player, "声明了", color);
      let prompt = `追命：${get.translation(player)}声明了${get.translation(color)}`, prompt2 = `请弃置任意张牌，然后其展示你一张牌，若此牌颜色为${get.translation(color)}，此【杀】不计入次数限制、不可被响应且伤害+1`;
      await target.chooseToDiscard(prompt, prompt2, [1, Infinity], "he", true, "allowChooseAll").set("ai", (card2) => {
        let color2 = get.event().color, player2 = get.player();
        if (get.position(card2) == "e" && get.color(card2) == color2) {
          return 2;
        }
        if (player2.getHp() <= 2 && get.color(card2) == color2) {
          return Math.random() < 0.5;
        }
        return 0;
      }).set("color", color);
      if (target.countCards("he")) {
        result = await player.choosePlayerCard(target, "he", true).set("ai", (button) => {
          let color2 = get.event().color, att = get.event().att;
          if (get.position(button.link) == "e" && get.color(button.link) == color2) {
            return 100 * att;
          }
          return 1 + Math.random();
        }).set("color", color).set("att", get.attitude(player, target) > 0 ? 1 : -1).forResult();
      } else {
        event.finish();
        return;
      }
      let card = result.cards[0];
      player.showCards(card, `${get.translation(target)}因【追命】被展示`);
      if (get.color(card) == color) {
        trigger.directHit.addArray(game.players);
        let evt = trigger.getParent();
        if (evt.addCount !== false) {
          evt.addCount = false;
          const stat = player.getStat().card, name = trigger.card.name;
          if (typeof stat[name] == "number") {
            stat[name]--;
          }
        }
        let map = trigger.getParent().customArgs;
        let id = target.playerid;
        if (!map[id]) {
          map[id] = {};
        }
        if (typeof map[id].extraDamage != "number") {
          map[id].extraDamage = 0;
        }
        map[id].extraDamage++;
        game.log(trigger.card, "不计入次数限制、不可被响应、伤害+1");
      }
    }
  },
  //娄圭
  jsrgshacheng: {
    trigger: { global: "useCardAfter" },
    filter(event, player) {
      if (event.card.name != "sha") {
        return false;
      }
      return event.targets.some((i) => i.isIn() && i.hasHistory("lose", (evt) => evt.cards2.length)) && player.getExpansions("jsrgshacheng").length;
    },
    group: "jsrgshacheng_build",
    async cost(event, trigger, player) {
      const cards2 = player.getExpansions("jsrgshacheng");
      const targets = trigger.targets.filter((i) => i.isIn() && i.hasHistory("lose", (evt) => evt.cards2.length));
      const map = /* @__PURE__ */ new Map();
      trigger.targets.forEach((target) => {
        if (target.isIn()) {
          const num = Math.min(
            5,
            target.getHistory("lose").map((evt) => evt.cards2.length).reduce((p, c) => p + c, 0)
          );
          if (num > 0) {
            map.set(target, num);
          }
        }
      });
      const next = player.chooseButtonTarget({
        createDialog: [`###${get.prompt(event.skill)}###移去一张“城”，令一名目标角色摸X张牌（X为该角色本回合失去过的牌数且至多为5）`, cards2],
        targets,
        drawMap: map,
        filterButton: true,
        filterTarget(card, player2, target) {
          return get.event().targets.includes(target);
        },
        ai2(target) {
          return target == get.event().targetx ? 1 : 0;
        },
        targetx: (() => {
          let info = [];
          targets.filter((target) => {
            let att = get.attitude(player, target);
            if (att <= 0) {
              return false;
            }
            if (Math.abs(att) > 1) {
              att = Math.sign(att) * Math.sqrt(Math.abs(att));
            }
            info.push([
              target,
              att * target.getHistory("lose").map((evt) => evt.cards2.length).reduce((p, c) => p + c, 0)
            ]);
            return false;
          });
          if (!info.length) {
            return null;
          }
          info = info.sort((a, b) => {
            return b[1] - a[1];
          })[0];
          if (info[1] <= 0) {
            return null;
          }
          return info[0];
        })()
      });
      next.set(
        "targetprompt2",
        next.targetprompt2.concat([
          (target) => {
            if (!target.isIn() || !get.event().filterTarget(null, get.player(), target)) {
              return false;
            }
            return `${get.cnNumber(get.event().drawMap.get(target))}张`;
          }
        ])
      );
      const result = await next.forResult();
      if (result?.links?.length && result.targets?.length) {
        event.result = {
          bool: true,
          targets: result.targets,
          cost_data: result.links
        };
      }
    },
    async content(event, trigger, player) {
      const cards2 = event.cost_data, [target] = event.targets;
      await player.loseToDiscardpile(cards2);
      await target.draw(
        Math.min(
          5,
          target.getHistory("lose").map((evt) => evt.cards2.length).reduce((p, c) => p + c, 0)
        )
      );
    },
    marktext: "城",
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill) {
      let cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
    },
    subSkill: {
      build: {
        audio: "jsrgshacheng",
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
          const next = player.addToExpansion(get.cards(2), "gain2");
          next.gaintag.add("jsrgshacheng");
          await next;
        }
      }
    }
  },
  jsrgninghan: {
    trigger: { global: "damageEnd" },
    filter(event, player) {
      return event.hasNature("ice") && event.cards?.someInD();
    },
    forced: true,
    async content(event, trigger, player) {
      const cards2 = trigger.cards.filterInD();
      const next = player.addToExpansion(cards2, "gain2");
      next.gaintag.add("jsrgshacheng");
      await next;
    },
    global: "jsrgninghan_frozen",
    subSkill: {
      frozen: {
        mod: {
          cardnature(card, player) {
            if (!game.hasPlayer((current) => current.hasSkill("jsrgninghan"))) {
              return;
            }
            if (card.name === "sha" && get.suit(card) === "club") {
              return "ice";
            }
          },
          aiOrder(player, card, num) {
            if (!game.hasPlayer((current) => current.hasSkill("jsrgninghan"))) {
              return;
            }
            if (num && card.name === "sha" && game.hasNature(card, "ice")) {
              return num + 0.15 * Math.sign(
                game.countPlayer((current) => {
                  if (!current.hasSkill("jsrgninghan")) {
                    return 0;
                  }
                  return Math.sign(get.attitude(player, current));
                })
              );
            }
          }
        }
      }
    },
    ai: {
      combo: "jsrgshacheng"
    }
  },
  //张任
  jsrgfuni: {
    trigger: { global: "roundStart" },
    group: ["jsrgfuni_unlimit", "jsrgfuni_zero"],
    forced: true,
    direct: true,
    async content(event, trigger, player) {
      const count = Math.ceil(game.countPlayer() / 2);
      let result = await player.chooseTarget(`伏匿：请选择至多${get.cnNumber(count)}名角色`, `令这些角色获得共计${get.cnNumber(count)}张【影】`, true, [1, count]).set("ai", (target) => {
        return get.attitude(get.player(), target) + get.event().getRand(target.playerid);
      }).forResult();
      if (result?.bool) {
        const targets = result.targets.slice().sortBySeat(_status.currentPhase);
        player.logSkill("jsrgfuni", targets);
        const num = count / targets.length;
        if (num == 1 || num == count) {
          result = {
            bool: true,
            links: targets.map((current) => {
              return `${num}|${current.playerid}`;
            })
          };
        } else {
          let dialog = ["伏匿：选择每名角色要获得的【影】数"];
          let len = count - targets.length + 1;
          for (let target of targets) {
            dialog.addArray([
              `<div class="text center">${get.translation(target)}</div>`,
              [
                Array.from({ length: len }).map((_, i) => {
                  return [`${i + 1}|${target.playerid}`, get.cnNumber(i + 1, true)];
                }),
                "tdnodes"
              ]
            ]);
          }
          result = await player.chooseButton(dialog, true).set("filterButton", (button) => {
            let total = 0, info = button.link.split("|");
            let numFix = 0;
            for (let buttonx of ui.selected.buttons) {
              let infox = buttonx.link.split("|");
              let num2 = parseInt(infox[0]);
              total += num2;
              if (infox[1] == info[1]) {
                numFix = num2;
              }
            }
            return total + parseInt(info[0]) - numFix <= get.event().count;
          }).set("count", count).set("filterOk", () => {
            let total = 0;
            for (let buttonx of ui.selected.buttons) {
              total += parseInt(buttonx.link.split("|")[0]);
            }
            return total == get.event().count;
          }).set("selectButton", () => {
            return [get.event().len, Math.max(get.event().len, ui.selected.buttons.length) + 1];
          }).set("len", targets.length).set("custom", {
            add: {},
            replace: {
              button(button) {
                if (!_status.event.isMine()) {
                  return;
                }
                if (button.classList.contains("selectable") == false) {
                  return;
                }
                if (button.classList.contains("selected")) {
                  ui.selected.buttons.remove(button);
                  button.classList.remove("selected");
                  if (_status.multitarget || _status.event.complexSelect) {
                    game.uncheck();
                    game.check();
                  }
                } else {
                  let current = button.parentNode.querySelector(".selected");
                  if (current) {
                    ui.selected.buttons.remove(current);
                    current.classList.remove("selected");
                  }
                  button.classList.add("selected");
                  ui.selected.buttons.add(button);
                }
                game.check();
              }
            }
          }).set("processAI", () => {
            return get.event().aiResult;
          }).set(
            "aiResult",
            (() => {
              let result2 = targets.map((i) => {
                return [i == player ? 2 : 1, i.playerid];
              });
              let rest = count - targets.length - 1;
              while (rest--) {
                result2[Math.floor(Math.random() * result2.length)][0]++;
              }
              return {
                bool: true,
                links: result2.map((i) => `${i[0]}|${i[1]}`)
              };
            })()
          ).forResult();
        }
        if (result?.bool) {
          let links = result.links;
          let list = [];
          for (let link of links) {
            let info = link.split("|");
            let id = info[1];
            let target = (_status.connectMode ? lib.playerOL : game.playerMap)[id];
            player.line(target);
            let yings = lib.card.ying.getYing(parseInt(info[0]));
            list.push([target, yings]);
            game.log(target, "获得了", yings);
          }
          await game.loseAsync({
            gain_list: list,
            animate: "gain2"
          }).setContent("gaincardMultiple");
        }
      }
    },
    subSkill: {
      zero: {
        priority: Infinity,
        mod: {
          attackRange: () => 0
        }
      },
      unlimit: {
        audio: "jsrgfuni",
        trigger: {
          global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"]
        },
        filter(event, player) {
          return event.getd().some((i) => get.name(i, false) == "ying");
        },
        forced: true,
        async content(event, trigger, player) {
          player.addTempSkill("jsrgfuni_buff");
        }
      },
      buff: {
        charlotte: true,
        trigger: { player: "useCard1" },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.players);
          game.log(trigger.card, "不可被响应");
        },
        mark: true,
        intro: {
          content: "使用牌无距离限制且不能被响应"
        },
        mod: {
          targetInRange: () => true
        }
      }
    },
    ai: {
      expose: 0.15,
      halfneg: true
    }
  },
  jsrgchuanxin: {
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      return player.countCards("hes") && game.hasPlayer(
        (current) => player.canUse(
          {
            name: "sha",
            storage: { jsrgchuanxin: true }
          },
          current
        )
      );
    },
    direct: true,
    clearTime: true,
    async content(event, trigger, player) {
      const next = player.chooseToUse();
      next.set("openskilldialog", `###${get.prompt("jsrgchuanxin")}###将一张牌当【杀】使用，且当一名角色受到此【杀】伤害时，此伤害+X（X为其本回合回复过的体力值）。`);
      next.set("norestore", true);
      next.set("_backupevent", "jsrgchuanxin_backup");
      next.set("addCount", false);
      next.set("logSkill", "jsrgchuanxin");
      next.set("custom", {
        add: {},
        replace: { window() {
        } }
      });
      next.backup("jsrgchuanxin_backup");
      await next;
    },
    subSkill: {
      backup: {
        filterCard(card) {
          return get.itemtype(card) == "card";
        },
        viewAs: {
          name: "sha",
          storage: { jsrgchuanxin: true }
        },
        selectCard: 1,
        position: "hes",
        ai1(card) {
          let player = get.player();
          let maxVal = 5.5;
          if (get.name(card, false) == "ying" && player.hasSkill("jsrgchuanxin")) {
            maxVal -= 3;
          }
          return maxVal - get.value(card);
        },
        log: false,
        async precontent(event, trigger, player) {
          player.addTempSkill("jsrgchuanxin_add");
        }
      },
      add: {
        trigger: { global: "damageBegin3" },
        filter(event, player) {
          if (!event.card || !event.card.storage || !event.card.storage.jsrgchuanxin) {
            return false;
          }
          if (event.getParent().type != "card") {
            return false;
          }
          return game.hasGlobalHistory("changeHp", (evt) => {
            return evt.getParent().name == "recover" && evt.player == event.player;
          });
        },
        forced: true,
        charlotte: true,
        async content(event, trigger, player) {
          const num = game.getGlobalHistory("changeHp", (evt) => evt.getParent().name == "recover" && evt.player == trigger.player).map((evt) => evt.num).reduce((p, c) => p + c, 0);
          trigger.num += num;
          game.log(trigger.card, "的伤害+" + num);
        }
      }
    }
  },
  //黄忠
  jsrgcuifeng: {
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "orange",
    locked: false,
    chooseButton: {
      dialog(event, player) {
        let list = [];
        for (let name of lib.inpile) {
          let info = lib.card[name];
          if (!info || info.notarget || info.selectTarget && info.selectTarget != 1 || !get.tag({ name }, "damage")) {
            continue;
          }
          if (name == "sha") {
            list.push(["基本", "", "sha"]);
            for (let nature of lib.inpile_nature) {
              list.push(["基本", "", name, nature]);
            }
          } else if (get.type(name) == "trick") {
            list.push(["锦囊", "", name]);
          } else if (get.type(name) == "basic") {
            list.push(["基本", "", name]);
          }
        }
        return ui.create.dialog("摧锋", [list, "vcard"]);
      },
      filter(button, player) {
        return _status.event.getParent().filterCard(
          {
            name: button.link[2],
            nature: button.link[3],
            isCard: true,
            storage: { jsrgcuifeng: true }
          },
          player,
          _status.event.getParent()
        );
      },
      check(button) {
        let player = _status.event.player;
        let effect = player.getUseValue({
          name: button.link[2],
          nature: button.link[3],
          storage: { jsrgcuifeng: true }
        });
        if (effect > 0) {
          return effect;
        }
        return 0;
      },
      backup(links, player) {
        return {
          audio: "jsrgcuifeng",
          selectCard: -1,
          filterCard: () => false,
          popname: true,
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            isCard: true,
            storage: { jsrgcuifeng: true }
          },
          log: false,
          async precontent(event, trigger, player2) {
            player2.logSkill("jsrgcuifeng");
            player2.awakenSkill("jsrgcuifeng");
            const targets = event.result.targets;
            if (!player2.storage.jsrgcuifeng_check) {
              player2.when("phaseEnd").step(async (event2, trigger2, player3) => {
                let num = 0;
                targets.forEach((target) => {
                  target.checkHistory("damage", (evt) => num += evt.num);
                });
                if (num !== 1) {
                  player3.refreshSkill();
                }
                delete player3.storage.jsrgcuifeng_check;
              });
            }
            player2.setStorage("jsrgcuifeng_check", true);
          }
        };
      },
      prompt(links, player) {
        return "请选择" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "的目标";
      }
    },
    mod: {
      targetInRange: (card) => {
        if (card.storage?.jsrgcuifeng) {
          return true;
        }
      }
    },
    ai: {
      order: 1.9,
      result: { player: 1 }
    }
  },
  jsrgdengnan: {
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "orange",
    chooseButton: {
      dialog(event, player) {
        let list = [];
        for (let name of lib.inpile) {
          let info = lib.card[name];
          if (!info || info.type != "trick" || info.notarget || get.tag({ name }, "damage")) {
            continue;
          }
          list.push(["锦囊", "", name]);
        }
        return ui.create.dialog("登难", [list, "vcard"]);
      },
      filter(button, player) {
        return _status.event.getParent().filterCard({ name: button.link[2], isCard: true }, player, _status.event.getParent());
      },
      check(button) {
        let player = _status.event.player;
        return player.getUseValue(button.link[2]);
      },
      backup(links, player) {
        return {
          audio: "jsrgdengnan",
          selectCard: -1,
          filterCard: () => false,
          popname: true,
          viewAs: {
            name: links[0][2],
            isCard: true,
            storage: { jsrgdengnan: true }
          },
          log: false,
          async precontent(event, trigger, player2) {
            player2.logSkill("jsrgdengnan");
            player2.awakenSkill("jsrgdengnan");
            if (!player2.storage.jsrgdengnan_check) {
              player2.when("phaseEnd").step(async () => {
                const targets = player2.getHistory("useCard", (evt) => evt.card.storage?.jsrgdengnan && evt.targets?.length).flatMap((evt) => evt.targets);
                if (targets.every((current) => current.hasHistory("damage"))) {
                  player2.refreshSkill();
                }
                delete player2.storage.jsrgdengnan_check;
              });
            }
            player2.setStorage("jsrgdengnan_check", true);
          }
        };
      },
      prompt(links, player) {
        return "请选择" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "的目标";
      }
    },
    ai: {
      order: 2,
      result: { player: 1 }
    }
  },
  //夏侯荣
  jsrgfenjian: {
    enable: "chooseToUse",
    locked: false,
    filter(event, player) {
      return ["juedou", "tao"].some((name) => {
        return !player.getStorage("jsrgfenjian_used").includes(name) && event.filterCard(
          {
            name,
            isCard: true,
            storage: { jsrgfenjian: true }
          },
          player,
          event
        );
      });
    },
    hiddenCard(player, name) {
      if (["juedou", "tao"].some((i) => i == name && !player.getStorage("jsrgfenjian_used").includes(name))) {
        return true;
      }
      return false;
    },
    chooseButton: {
      dialog(event, player) {
        let dialog = ui.create.dialog("奋剑", [["juedou", "tao"].filter((name) => !player.getStorage("jsrgfenjian_used").includes(name)), "vcard"]);
        dialog.direct = true;
        return dialog;
      },
      filter(button, player) {
        let evt = _status.event.getParent();
        return evt.filterCard(
          {
            name: button.link[2],
            isCard: true,
            storage: { jsrgfenjian: true }
          },
          player,
          evt
        );
      },
      check(button) {
        if (button.link[2] === "tao") {
          let dying = _status.event.getParent(2).dying;
          if (dying) {
            return get.effect(
              dying,
              {
                name: "tao",
                isCard: true,
                storage: { jsrgfenjian: true }
              },
              _status.event.player
            );
          }
        }
        return _status.event.player.getUseValue({
          name: button.link[2],
          isCard: true,
          storage: { jsrgfenjian: true }
        });
      },
      backup(links) {
        return {
          audio: "jsrgfenjian",
          viewAs: {
            name: links[0][2],
            isCard: true,
            storage: { jsrgfenjian: true }
          },
          filterCard: () => false,
          selectCard: -1,
          log: false,
          async precontent(event, trigger, player) {
            player.logSkill("jsrgfenjian");
            player.addTempSkill("jsrgfenjian_effect");
            player.addMark("jsrgfenjian_effect", 1, false);
            player.addTempSkill("jsrgfenjian_used");
            player.markAuto("jsrgfenjian_used", [event.result.card.name]);
          }
        };
      },
      prompt(links) {
        return "奋剑：令你本回合受到的伤害+1，视为使用" + get.translation(links[0][2]);
      }
    },
    mod: {
      targetEnabled(card, player, target) {
        if (player == target && card.storage?.jsrgfenjian) {
          return false;
        }
      }
    },
    ai: {
      order(item, player) {
        return Math.max(get.order({ name: "juedou" }), get.order({ name: "tao" })) + 0.2;
      },
      result: {
        player: (player) => {
          if (_status.event.dying) {
            return 2 * get.sgnAttitude(player, _status.event.dying);
          }
          return 1;
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      },
      effect: {
        audio: "jsrgfenjian",
        charlotte: true,
        trigger: { player: "damageBegin3" },
        forced: true,
        onremove: true,
        async content(event, trigger, player) {
          trigger.num += player.countMark("jsrgfenjian_effect");
        },
        intro: { content: "本回合受到的伤害+#" }
      }
    }
  },
  //孙尚香
  jsrgguiji: {
    enable: "phaseUse",
    filter(event, player) {
      if (player.hasSkill("jsrgguiji_used")) {
        return false;
      }
      return game.hasPlayer((current) => lib.skill.jsrgguiji.filterTarget("keiki", player, current));
    },
    filterTarget(card, player, target) {
      return target.countCards("h") < player.countCards("h") && target.hasSex("male");
    },
    async content(event, trigger, player) {
      const { target } = event;
      player.addSkill("jsrgguiji_swapback");
      player.markAuto("jsrgguiji_swapback", target);
      player.addTempSkill("jsrgguiji_used");
      await player.swapHandcards(target);
    },
    ai: {
      order: 6,
      result: {
        target(player, target) {
          const val = player.getCards("h").map((card) => get.value(card)).reduce((a, b) => a + b, 0);
          const val2 = target.getCards("h").map((card) => get.value(card)).reduce((a, b) => a + b, 0);
          return val - val2;
        }
      }
    },
    subSkill: {
      used: { charlotte: true },
      swapback: {
        audio: "jsrgguiji",
        trigger: {
          global: ["phaseUseEnd", "dieAfter"]
        },
        filter(event, player) {
          return player.getStorage("jsrgguiji_swapback").includes(event.player);
        },
        charlotte: true,
        check(event, player) {
          return player.getCards("h").map((i) => get.value(i)).reduce((p, c) => p + c, 0) < event.player.getCards("h").map((i) => get.value(i)).reduce((p, c) => p + c, 0) + 4 * Math.random();
        },
        async cost(event, trigger, player) {
          player.unmarkAuto("jsrgguiji_swapback", [trigger.player]);
          if (trigger.name !== "phaseUse") {
            event.result = { bool: false };
            return;
          }
          const result = await player.chooseBool({
            prompt: get.prompt("jsrgguiji_swapback", trigger.player),
            prompt2: "与其交换手牌。",
            ai() {
              return get.event().bool;
            }
          }).set("bool", lib.skill.jsrgguiji_swapback.check(trigger, player) > 0).forResult();
          event.result = {
            bool: result.bool,
            targets: [trigger.player]
          };
        },
        logTarget: "targets",
        async content(event, trigger, player) {
          await player.swapHandcards(trigger.player);
        },
        intro: {
          content: "$的下个出牌阶段结束时，你可以与其交换手牌"
        }
      }
    }
  },
  jsrgjiaohao: {
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return [1, 2, 3, 4, 5].some((i) => player.countEmptySlot(i));
    },
    forced: true,
    locked: false,
    global: "jsrgjiaohao_g",
    async content(event, trigger, player) {
      const count = Math.ceil([1, 2, 3, 4, 5].map((i) => player.countEmptySlot(i)).reduce((p, c) => p + c, 0) / 2);
      await player.gain({
        cards: lib.card.ying.getYing(count),
        animate: "gain2"
      });
    },
    subSkill: {
      g: {
        audio: "jsrgjiaohao",
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
          return game.hasPlayer((current) => {
            if (current == player || !current.hasSkill("jsrgjiaohao")) {
              return false;
            }
            return player.hasCard((card) => {
              return get.type(card) == "equip" && current.canEquip(card);
            });
          });
        },
        filterTarget(card, player, target) {
          if (target.isMin()) {
            return false;
          }
          return target != player && target.hasSkill("jsrgjiaohao") && target.canEquip(card);
        },
        selectTarget() {
          let num = game.countPlayer((current) => {
            return current.hasSkill("jsrgjiaohao");
          });
          return num > 1 ? 1 : -1;
        },
        chessForceAll: true,
        filterCard(card) {
          return get.type(card) == "equip";
        },
        check(card) {
          let player = get.player();
          if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
            return 11 - get.equipValue(card);
          }
          return 6 - get.value(card);
        },
        prompt() {
          let list = game.filterPlayer((current) => {
            return current.hasSkill("jsrgjiaohao");
          });
          return `将一张装备牌置于${get.translation(list)}${list.length > 1 ? "中的一人" : ""}的装备区`;
        },
        discard: false,
        lose: false,
        prepare(cards2, player, targets) {
          player.$give(cards2, targets[0], false);
        },
        async content(event, trigger, player) {
          await event.target.equip(event.cards[0]);
        },
        ai: {
          order: 10,
          result: {
            target(player, target) {
              let card = ui.selected.cards[0];
              if (card) {
                return get.effect(target, card, target, target);
              }
              return 0;
            }
          }
        }
      }
    }
  },
  //庞统
  jsrgmanjuan: {
    trigger: {
      player: "loseEnd",
      global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"]
    },
    filter(event, player) {
      return player.countCards("h") == 0 ^ player.hasSkill("jsrgmanjuan_in");
    },
    forced: true,
    locked: false,
    firstDo: true,
    silent: true,
    async content(event, trigger, player) {
      if (!player.countCards("h")) {
        const cards2 = game.getGlobalHistory("cardMove", (evt) => evt.name == "lose" && evt.position == ui.discardPile || evt.name == "cardsDiscard").flatMap((evt) => evt.cards.filterInD("d"));
        const cardsx = cards2.map((card) => {
          const cardx = ui.create.card();
          cardx.init(get.cardInfo(card));
          cardx._cardid = card.cardid;
          return cardx;
        });
        player.directgains(cardsx, null, "jsrgmanjuan");
        player.addSkill("jsrgmanjuan_in");
      } else {
        player.removeSkill("jsrgmanjuan_in");
      }
    },
    onremove(player) {
      player.removeSkill("jsrgmanjuan_in");
    },
    subSkill: {
      in: {
        audio: "jsrgmanjuan",
        trigger: {
          global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"]
        },
        charlotte: true,
        forced: true,
        locked: false,
        silent: true,
        filter(event, player) {
          let cards2 = event.getd();
          return cards2.length;
        },
        onremove(player) {
          let cards2 = player.getCards("s", (card) => {
            return card.hasGaintag("jsrgmanjuan");
          });
          if (player.isOnline2()) {
            player.send(
              function(cards3, player2) {
                cards3.forEach((i) => i.delete());
                if (player2 == game.me) {
                  ui.updatehl();
                }
              },
              cards2,
              player
            );
          }
          cards2.forEach((i) => i.delete());
          if (player == game.me) {
            ui.updatehl();
          }
        },
        group: ["jsrgmanjuan_use", "jsrgmanjuan_lose"],
        async content(event, trigger, player) {
          const idList = player.getCards("s", (card) => card.hasGaintag("jsrgmanjuan")).map((i) => i._cardid);
          const cards2 = game.getGlobalHistory("cardMove", (evt) => evt.name == "lose" && evt.position == ui.discardPile || evt.name == "cardsDiscard").flatMap((evt) => evt.cards).filter((card) => get.position(card, true) == "d" && !idList.includes(card.cardid));
          const cards22 = cards2.map((card) => {
            const cardx = ui.create.card();
            cardx.init(get.cardInfo(card));
            cardx._cardid = card.cardid;
            return cardx;
          });
          player.directgains(cards22, null, "jsrgmanjuan");
        },
        mod: {
          cardEnabled2(card, player) {
            if (get.itemtype(card) == "card" && card.hasGaintag("jsrgmanjuan")) {
              if (!player.hasSkill("jsrgmanjuan")) {
                return false;
              }
              if (player.getStorage("jsrgmanjuan_used").includes(get.number(card, false))) {
                return false;
              }
            }
          }
        }
      },
      use: {
        trigger: {
          player: ["useCardBefore", "respondBefore"]
        },
        charlotte: true,
        forced: true,
        popup: false,
        firstDo: true,
        filter(event, player) {
          let cards2 = player.getCards("s", (card) => card.hasGaintag("jsrgmanjuan") && card._cardid);
          return event.cards && event.cards.some((card) => {
            return cards2.includes(card);
          });
        },
        async content(event, trigger, player) {
          const idList = player.getCards("s", (card) => card.hasGaintag("jsrgmanjuan")).map((i) => i._cardid);
          const cards2 = game.getGlobalHistory("cardMove", (evt) => evt.name == "lose" && evt.position == ui.discardPile || evt.name == "cardsDiscard").flatMap((evt) => evt.cards).filter((card) => idList.includes(card.cardid));
          const cards22 = [];
          for (let card of trigger.cards) {
            let cardx = cards2.find((cardx2) => cardx2.cardid == card._cardid);
            if (cardx) {
              cards22.push(cardx);
            } else {
              cards22.push(card);
            }
          }
          const cards3 = trigger.cards.filter((card) => card.hasGaintag("jsrgmanjuan"));
          trigger.cards = cards22;
          trigger.card.cards = cards22;
          if (player.isOnline2()) {
            player.send(
              (cards4, player2) => {
                cards4.forEach((card) => card.delete());
                if (player2 == game.me) {
                  ui.updatehl();
                }
              },
              cards3,
              player
            );
          }
          cards3.forEach((card) => card.delete());
          if (player == game.me) {
            ui.updatehl();
          }
          player.addTempSkill("jsrgmanjuan_used");
          player.markAuto(
            "jsrgmanjuan_used",
            cards3.map((card) => get.number(card, false))
          );
        }
      },
      lose: {
        trigger: {
          global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd", "cardsGotoOrderingBegin", "phaseAfter"]
        },
        charlotte: true,
        forced: true,
        popup: false,
        firstDo: true,
        filter(event, player) {
          if (event.name == "phase") {
            return true;
          }
          const idList = player.getCards("s", (card) => card.hasGaintag("jsrgmanjuan")).map((i) => i._cardid);
          return event.cards && event.cards.some((card) => {
            return idList.includes(card.cardid);
          });
        },
        async content(event, trigger, player) {
          let cards2;
          if (trigger.name == "phase") {
            cards2 = player.getCards("s", (card) => {
              return card.hasGaintag("jsrgmanjuan");
            });
          } else {
            let idList = [];
            game.checkGlobalHistory("cardMove", (evt) => {
              if (evt.name == "lose" && evt.position == ui.discardPile || evt.name == "cardsDiscard") {
                idList.addArray(evt.cards.filter((i) => get.position(i, true) == "d").map((i) => i.cardid));
              }
            });
            cards2 = player.getCards("s", (card) => {
              return card.hasGaintag("jsrgmanjuan") && !idList.includes(card._cardid);
            });
          }
          if (player.isOnline2()) {
            player.send(
              function(cards3, player2) {
                cards3.forEach((i) => i.delete());
                if (player2 == game.me) {
                  ui.updatehl();
                }
              },
              cards2,
              player
            );
          }
          cards2.forEach((i) => i.delete());
          if (player == game.me) {
            ui.updatehl();
          }
        }
      },
      used: {
        onremove: true,
        charlotte: true
      }
    }
  },
  jsrgyangming: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => {
        return player.canCompare(current);
      });
    },
    filterTarget(card, player, current) {
      return player.canCompare(current);
    },
    async content(event, trigger, player) {
      const { target } = event;
      target.addTempSkill("jsrgyangming_lose", "phaseUseAfter");
      while (true) {
        const isFriend = get.attitude(player, target) > 0;
        const selfNoEnough = player.countCards("h", (card) => get.value(card) < 6) <= 1;
        const otherNoEnough = target.countCards("h", (card) => get.value(card) < 6) <= 1;
        const small = isFriend && (selfNoEnough || otherNoEnough);
        let result = await player.chooseToCompare(target).set("small", small).forResult();
        if (result.winner === target) {
          if (target.storage.jsrgyangming_lose) {
            await target.draw(target.storage.jsrgyangming_lose);
          }
          await player.recover();
          return;
        }
        if (!player.canCompare(target)) {
          result = { bool: false };
        } else {
          result = await player.chooseBool({
            prompt: "是否与其重复此拼点流程？",
            ai() {
              return get.event().bool;
            }
          }).set("bool", get.effect(target, "jsrgyangming", player, player) > 0).forResult();
        }
        game.broadcastAll((target2) => {
          target2.storage.jsrgyangming_lose++;
        }, target);
        if (!result.bool) {
          return;
        }
      }
    },
    ai: {
      order: 1,
      expose: 0.15,
      result: {
        target(player, target) {
          let maxnum = 0;
          let cards2 = target.getCards("h");
          for (let i = 0; i < cards2.length; i++) {
            if (get.number(cards2[i]) > maxnum) {
              maxnum = get.number(cards2[i]);
            }
          }
          if (maxnum > 10) {
            maxnum = 10;
          }
          if (maxnum < 5 && cards2.length > 1) {
            maxnum = 5;
          }
          let cards3 = player.getCards("h");
          for (let i = 0; i < cards3.length; i++) {
            if (get.number(cards3[i]) < maxnum) {
              return 1;
            }
          }
          return 0;
        }
      }
    },
    subSkill: {
      lose: {
        init(player, skill) {
          player.storage[skill] = 0;
        },
        onremove: true,
        charlotte: true
      }
    }
  },
  //韩遂
  jsrgniluan: {
    audio: "niluan",
    trigger: { player: "phaseZhunbeiBegin" },
    async cost(event, trigger, player) {
      const damaged = game.filterPlayer((current) => {
        return current.hasAllHistory("sourceDamage", (evt) => evt.player == player);
      }), undamaged = game.filterPlayer().removeArray(damaged);
      const result = await player.chooseButton(
        [
          `###${get.prompt(event.skill)}###选择至多两项执行`,
          [
            [
              ["damage", "弃置一张牌，对一名未对你造成过伤害的角色造成1点伤害"],
              ["draw", "令一名对你造成过伤害的角色摸两张牌"]
            ],
            "textbutton"
          ]
        ],
        [1, 2]
      ).set("filterButton", (button) => {
        const { player: player2, damaged: damaged2, undamaged: undamaged2 } = get.event();
        if (button.link == "damage") {
          return player2.countDiscardableCards(player2, "he") && undamaged2.length;
        }
        return damaged2.length;
      }).set("ai", (button) => {
        const { player: player2, damaged: damaged2, undamaged: undamaged2 } = get.event();
        if (button.link == "damage") {
          if (undamaged2.some((current) => get.damageEffect(current, player2, player2) > 0)) {
            return 1;
          }
          return 0;
        }
        if (damaged2.some((current) => get.effect(current, { name: "draw" }, player2, player2) > 0)) {
          return 1;
        }
        return 0;
      }).set("damaged", damaged).set("undamaged", undamaged).forResult();
      if (result?.bool && result.links?.length) {
        event.result = {
          bool: true,
          cost_data: result.links
        };
      }
    },
    async content(event, trigger, player) {
      const damaged = game.filterPlayer((current) => {
        return current.hasAllHistory("sourceDamage", (evt) => evt.player == player);
      }), undamaged = game.filterPlayer().removeArray(damaged), list = event.cost_data;
      if (list.includes("damage") && undamaged.length) {
        const result = await player.chooseCardTarget({
          prompt: "逆乱：弃置一张牌并选择一名未对你造成过伤害的角色，对其造成1点伤害",
          forced: true,
          filterCard: lib.filter.cardDiscardable,
          filterTarget(card, player2, target) {
            const targets = get.event().undamaged;
            return targets.includes(target);
          },
          undamaged,
          ai1(card) {
            return 6 - get.value(card);
          },
          ai2(target) {
            const player2 = get.player();
            return get.damageEffect(target, player2, player2);
          }
        }).forResult();
        if (result?.bool) {
          const {
            cards: cards2,
            targets: [target]
          } = result;
          player.line(target);
          await player.modedDiscard(cards2);
          await target.damage();
        }
      }
      if (list.includes("draw") && damaged.length) {
        const result = await player.chooseTarget("逆乱：令一名对你造成过伤害的角色摸两张牌", true, (card, player2, target) => {
          return get.event().damaged.includes(target);
        }).set("damaged", damaged).set("ai", (target) => {
          const player2 = get.player();
          return get.effect(target, { name: "draw" }, player2, player2);
        }).forResult();
        if (result?.bool) {
          const {
            targets: [target]
          } = result;
          player.line(target);
          await target.draw(2);
        }
      }
    }
  },
  jsrghuchou: {
    trigger: { source: "damageBegin1" },
    filter(event, player) {
      const history = _status.globalHistory;
      for (let i = history.length - 1; i >= 0; i--) {
        let evts = history[i]["useCard"];
        for (let j = evts.length - 1; j >= 0; j--) {
          let evt = evts[j];
          let card = evt.card, targets = evt.targets;
          if (!get.is.damageCard(card) || !targets.includes(player)) {
            continue;
          }
          return event.player == evt.player;
        }
      }
      return false;
    },
    forced: true,
    async content(event, trigger, player) {
      trigger.num++;
    },
    init(player) {
      player.addSkill("jsrghuchou_tip");
    },
    onremove(player) {
      player.removeSkill("jsrghuchou_tip");
    },
    subSkill: {
      tip: {
        trigger: { target: "useCardToTarget" },
        charlotte: true,
        init(player, skill) {
          const history = _status.globalHistory || [];
          round: for (let i = history.length - 1; i >= 0; i--) {
            let evts = history[i]["useCard"];
            for (let j = evts.length - 1; j >= 0; j--) {
              let evt = evts[j];
              let card = evt.card, targets = evt.targets;
              if (!get.is.damageCard(card) || !targets.includes(player)) {
                continue;
              }
              player.addTip(skill, `互雠 ${get.translation(evt.player)}`);
              break round;
            }
          }
        },
        onremove(player, skill) {
          player.removeTip(skill);
        },
        filter(event, player) {
          if (get.tag(event.card, "damage")) {
            lib.skill.jsrghuchou_tip.init(player, "jsrghuchou_tip");
          }
          return false;
        },
        async content(event, trigger, player) {
        }
      }
    },
    ai: {
      damageBonus: true,
      skillTagFilter: (player, tag, arg) => {
        if (tag === "damageBonus" && arg && arg.target) {
          const history = _status.globalHistory;
          for (let i = history.length - 1; i >= 0; i--) {
            let evts = history[i]["useCard"];
            for (let j = evts.length - 1; j >= 0; j--) {
              let evt = evts[j];
              let card = evt.card, targets = evt.targets;
              if (!get.tag(card, "damage") || !targets.includes(player)) {
                continue;
              }
              return arg.target === evt.player;
            }
          }
          return false;
        }
      },
      effect: {
        player: (card, player, target) => {
          if (get.tag(card, "damage") && target && lib.skill.jsrghuchou.ai.skillTagFilter(player, "damageBonus", {
            card,
            target
          }) && !target.hasSkillTag("filterDamage", null, {
            player,
            card
          })) {
            return [1, 0, 2, 0];
          }
        }
      }
    }
  },
  jsrgjiemeng: {
    zhuSkill: true,
    locked: true,
    init: () => {
      game.addGlobalSkill("jsrgjiemeng_effect");
    },
    onremove: () => {
      if (!game.hasPlayer((i) => i.hasSkill("jsrgjiemeng", null, null, false), true)) {
        game.removeGlobalSkill("jsrgjiemeng_effect");
      }
    },
    subSkill: {
      effect: {
        mod: {
          globalFrom(from, to, distance) {
            if (from.group != "qun") {
              return;
            }
            if (to.hasZhuSkill("jsrgjiemeng")) {
              return;
            }
            return distance - game.countPlayer((current) => current.group == "qun");
          }
        },
        trigger: { player: "dieAfter" },
        filter: () => {
          return !game.hasPlayer((i) => i.hasSkill("jsrgjiemeng", null, null, false), true);
        },
        silent: true,
        forceDie: true,
        content: () => {
          game.removeGlobalSkill("jsrgjiemeng_effect");
        }
      }
    }
  },
  //张楚
  jsrghuozhong: {
    audio: "dcjizhong",
    global: "jsrghuozhong_g",
    subSkill: {
      g: {
        audio: "dcjizhong",
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
          if (player.hasJudge("bingliang")) {
            return false;
          }
          if (!game.hasPlayer((current) => current.hasSkill("jsrghuozhong"))) {
            return false;
          }
          return player.countCards("hes", (card) => get.color(card) == "black" && get.type2(card) != "trick") > 0;
        },
        position: "hes",
        prompt() {
          let list = game.filterPlayer((target) => {
            return target.hasSkill("jsrghuozhong");
          });
          return `将一张黑色非锦囊牌当【兵粮寸断】置于自己的判定区，然后令${get.translation(list)}${list.length > 1 ? "中的一人" : ""}摸两张牌。`;
        },
        filterCard(card, player, event) {
          return get.color(card) == "black" && get.type2(card) != "trick" && player.canAddJudge({ name: "bingliang", cards: [card] });
        },
        selectTarget() {
          const targets = game.filterPlayer((target) => {
            return target.hasSkill("jsrghuozhong");
          });
          if (targets.length > 1) {
            return 1;
          }
          return -1;
        },
        filterTarget(card, player, target) {
          return target.hasSkill("jsrghuozhong");
        },
        check(card) {
          return 6 - get.value(card);
        },
        discard: false,
        lose: false,
        prepare: "throw",
        async content(event, trigger, player) {
          await player.addJudge({ name: "bingliang" }, event.cards);
          await event.target.draw(2);
        },
        ai: {
          result: {
            player(player) {
              if (game.hasPlayer((current) => get.attitude(player, current) > 2 && current.hasSkill("jsrghuozhong"))) {
                return 1;
              }
              return 0;
            }
          },
          order: 9
        }
      }
    }
  },
  jsrgrihui: {
    audio: "dcrihui",
    locked: false,
    trigger: { source: "damageSource" },
    filter(event, player) {
      return event.getParent().type == "card" && event.card && event.card.name == "sha" && game.hasPlayer((current) => {
        return current != player && current.countCards("j");
      });
    },
    prompt: "是否发动【日彗】？",
    prompt2(event, player) {
      let list = game.filterPlayer((current) => {
        return current != player && current.countCards("j");
      });
      return `令${get.translation(list)}${list.length > 1 ? "各" : ""}摸一张牌。`;
    },
    logTarget(event, player) {
      return game.filterPlayer((current) => {
        return current != player && current.countCards("j");
      });
    },
    group: "jsrgrihui_sha",
    async content(event, trigger, player) {
      game.asyncDraw(lib.skill.jsrgrihui.logTarget(trigger, player));
    },
    mod: {
      cardUsableTarget(card, player, target) {
        if (card.name == "sha" && !player.getStorage("jsrgrihui_targeted").includes(target)) {
          return true;
        }
      }
    },
    subSkill: {
      sha: {
        trigger: { player: "useCardToPlayered" },
        forced: true,
        silent: true,
        firstDo: true,
        async content(event, trigger, player) {
          player.addTempSkill("jsrgrihui_targeted");
          player.markAuto("jsrgrihui_targeted", trigger.target);
        }
      },
      targeted: {
        charlotte: true,
        onremove: true
      }
    }
  },
  //夏侯恩
  jsrghujian: {
    audio: "twfujian",
    trigger: {
      global: "phaseEnd"
    },
    filter(event, player) {
      if (!Array.from(ui.discardPile.childNodes).some((i) => i.name == "chixueqingfeng")) {
        return false;
      }
      return game.hasGlobalHistory("everything", (evt) => ["useCard", "respond"].includes(evt.name) && evt.player.isIn());
    },
    popup: false,
    forced: true,
    locked: false,
    group: "jsrghujian_begin",
    async content(event, trigger, player) {
      const cards2 = Array.from(ui.discardPile.childNodes).filter((i) => i.name == "chixueqingfeng");
      if (!cards2.length) {
        return;
      }
      const history = _status.globalHistory;
      let target = null;
      for (let i = history.length - 1; i >= 0 && !target; i--) {
        const evts = history[i]["everything"];
        for (let j = evts.length - 1; j >= 0; j--) {
          const evt = evts[j];
          if (!["useCard", "respond"].includes(evt.name)) {
            continue;
          }
          target = evt.player;
          break;
        }
      }
      if (!target || !target.isIn()) {
        return;
      }
      const result = await target.chooseBool({
        prompt: `是否响应${get.translation(player)}的【护剑】？`,
        prompt2: "获得弃牌堆里的【赤血青锋】。"
      }).forResult();
      if (result.bool) {
        player.logSkill("jsrghujian");
        player.line(target);
        await target.gain({
          cards: cards2,
          animate: "gain2"
        });
      }
    },
    subSkill: {
      begin: {
        audio: "twfujian",
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
          await player.gain({
            cards: [game.createCard2("chixueqingfeng", "spade", 6)],
            animate: "gain2"
          });
        }
      }
    }
  },
  jsrgshili: {
    audio: "twjianwei",
    enable: "phaseUse",
    usable: 1,
    viewAs: {
      name: "juedou"
    },
    filterCard: { type: "equip" },
    position: "hs",
    viewAsFilter(player) {
      return player.hasCard({ type: "equip" }, "hs");
    },
    check(card) {
      return (get.name(card, false) == "chixueqingfeng" ? 20 : 12) - _status.event.player.getUseValue(card);
    },
    ai: {
      order: 1e-3
    }
  },
  //范疆张达
  jsrgfushan: {
    trigger: { player: "phaseUseBegin" },
    forced: true,
    locked: false,
    filter(event, player) {
      return game.hasPlayer((i) => i != player);
    },
    async content(event, trigger, player) {
      const { target } = event;
      let targets = game.filterPlayer((i) => i != player);
      let shas = player.mayHaveSha(target, "use", null, "count") - player.getCardUsable("sha", true);
      for (let target2 of targets) {
        let att = get.attitude(target2, player);
        let result = await target2.chooseCard("he", `负山：是否交给${get.translation(player)}一张牌？`, `若如此做，其此阶段使用【杀】的次数上限+1`).set("att", att).set("ai", (card) => {
          if (!get.event().goon) {
            return -get.value(card);
          }
          let isSha = get.name(card, get.event().target) == "sha";
          if (get.event().att < 0) {
            return (isSha ? 0 : 5) - get.value(card);
          }
          return (isSha ? 10 : 0) - get.value(card);
        }).set("goon", att > 0 && shas >= 0 || att < 0 && target2.hp > player.getCardUsable("sha", true) && shas < -1 / Math.max(1, player.hp)).set("target", player).forResult();
        if (result.bool) {
          target2.give(result.cards, player);
          target2.line(player);
          player.addTempSkill("jsrgfushan_sha", "phaseAfter");
          player.addMark("jsrgfushan_sha", 1, false);
          player.markAuto("jsrgfushan_given", target2);
        }
      }
      player.when("phaseUseAfter").filter((evt) => evt == trigger).step(async (event2, trigger2, player2) => {
        player2.logSkill("jsrgfushan");
        if (player2.getCardUsable("sha", true) > player2.getHistory("useCard", (evt) => {
          return evt.getParent("phaseUse") == trigger2 && evt.card.name == "sha" && evt.addCount !== false;
        }).length && player2.storage.jsrgfushan_given && player2.storage.jsrgfushan_given.every((i) => i.isIn())) {
          await player2.loseHp(2);
        } else {
          await player2.drawTo(player2.maxHp);
        }
        delete player2.storage.jsrgfushan_given;
      });
    },
    subSkill: {
      sha: {
        charlotte: true,
        onremove: true,
        marktext: "负",
        intro: { content: "使用【杀】的次数上限+#" },
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.countMark("jsrgfushan_sha");
            }
          }
        }
      }
    }
  },
  //江山如故·承
  //404孙策
  jsrgduxing: {
    enable: "phaseUse",
    viewAs: {
      name: "juedou",
      storage: { jsrgduxing: true },
      isCard: true
    },
    viewAsFilter(player) {
      if (player.hasSkill("jsrgduxing_used")) {
        return false;
      }
    },
    filterCard: () => false,
    selectCard: -1,
    selectTarget: [1, Infinity],
    log: false,
    async precontent(event, trigger, player) {
      player.logSkill("jsrgduxing");
      const targets = event.result.targets ?? [];
      for (let target of [player, ...targets]) {
        target.addTempSkill("jsrgduxing_allsha");
      }
      player.addTempSkill("jsrgduxing_restore");
      player.addTempSkill("jsrgduxing_used", "phaseUseAfter");
    },
    ai: {
      order: 5,
      result: {
        player(player, target) {
          Math.sign(get.effect(target, { name: "juedou" }, player, player));
          if (player.hasSkillTag(
            "directHit_ai",
            true,
            {
              target,
              card: { name: "juedou" }
            },
            true
          ) || ui.selected.targets.concat(target).reduce((p, c) => {
            return p + c.countCards("h");
          }, 0) < player.countCards("h", "sha")) {
            return 0;
          }
          return -114514;
        },
        target: -1.5
      }
    },
    subSkill: {
      allsha: {
        charlotte: true,
        mod: {
          cardname(card, player, name) {
            if (get.color(card) == "red") {
              return "sha";
            }
          }
        }
      },
      used: { charlotte: true },
      restore: {
        charlotte: true,
        trigger: { global: "useCardAfter" },
        forced: true,
        popup: false,
        forceDie: true,
        forceOut: true,
        filter(event, player) {
          return event.card.name == "juedou" && event.card.storage?.jsrgduxing;
        },
        async content(event, trigger, player) {
          for (const current of game.filterPlayer(lib.filter.all, [], true)) {
            current.removeSkill("jsrgduxing_allsha");
          }
        }
      }
    }
  },
  jsrgzhiheng: {
    trigger: {
      source: "damageBegin1"
    },
    forced: true,
    filter(event, player) {
      if (event.getParent().type != "card") {
        return false;
      }
      let respondEvts = [];
      respondEvts.addArray(event.player.getHistory("useCard")).addArray(event.player.getHistory("respond"));
      respondEvts = respondEvts.filter((i) => i.respondTo).map((evt) => evt.respondTo);
      return respondEvts.some((list) => {
        return list[0] == player;
      });
    },
    async content(event, trigger, player) {
      trigger.num++;
    }
  },
  jsrgzhasi: {
    trigger: {
      player: "damageBegin4"
    },
    limited: true,
    skillAnimation: true,
    animationColor: "wood",
    filter(event, player) {
      return event.num >= player.getHp();
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      trigger.cancel();
      player.changeSkills(["rezhiheng"], ["jsrgzhiheng"]);
      player.addSkill("jsrgzhasi_undist");
    },
    derivation: "rezhiheng",
    subSkill: {
      undist: {
        group: "undist",
        trigger: {
          player: ["useCardAfter", "damageEnd"]
        },
        filter(event, player) {
          if (event.name == "useCard") {
            return event.targets.some((target) => {
              return target != player;
            });
          }
          return true;
        },
        forced: true,
        popup: false,
        charlotte: true,
        async content(event, trigger, player) {
          player.removeSkill("jsrgzhasi_undist");
        },
        mark: true,
        intro: {
          content: "诈死中，不计入距离和座次的计算"
        }
      }
    }
  },
  jsrgbashi: {
    trigger: { player: "chooseToRespondBefore" },
    zhuSkill: true,
    usable: 4,
    filter(event, player) {
      if (event.responded) {
        return false;
      }
      if (player.storage.jsrgbashiing) {
        return false;
      }
      if (!player.hasZhuSkill("jsrgbashi")) {
        return false;
      }
      if (!event.filterCard({ name: "sha" }, player, event) && !event.filterCard({ name: "shan" }, player, event)) {
        return false;
      }
      return game.hasPlayer(function(current) {
        return current != player && current.group == "wu";
      });
    },
    check(event, player) {
      if (get.damageEffect(player, event.player, player) >= 0) {
        return false;
      }
      return true;
    },
    async content(event, trigger, player) {
      const targets = game.filterPlayer((target) => target.isIn() && target !== player && target.group === "wu");
      for (const target of targets) {
        if (!(target == game.me && !_status.auto || get.attitude(target, player) > 2 || target.isOnline())) {
          continue;
        }
        player.storage.jsrgbashiing = true;
        const list = ["sha", "shan"].filter((name2) => trigger.filterCard({ name: name2 }, player, trigger));
        const names = list.map((i) => "【" + get.translation(i) + "】").join("或");
        const next = target.chooseToRespond({
          prompt: "是否替" + get.translation(player) + "打出一张" + names + "？",
          filterCard: function(card, player2) {
            if (!get.event().namex.includes(get.name(card))) {
              return false;
            }
            return lib.filter.cardRespondable(card, player2);
          },
          namex: list
        });
        next.set("ai", () => {
          const event2 = _status.event;
          return get.attitude(event2.player, event2.source) - 2;
        });
        next.set("skillwarn", "替" + get.translation(player) + "打出一张" + names);
        next.autochoose = (...args) => {
          if (!lib.filter.autoRespondSha.apply(next, args)) {
            return false;
          }
          return lib.filter.autoRespondShan.apply(next, args);
        };
        next.set("source", player);
        const result = await next.forResult();
        delete player.storage.jsrgbashiing;
        if (!result.bool) {
          continue;
        }
        const name = result.card.name;
        trigger.result = { bool: true, card: { name, isCard: true } };
        trigger.responded = true;
        trigger.animate = false;
        if (typeof target.ai.shown == "number" && target.ai.shown < 0.95) {
          target.ai.shown += 0.3;
          if (target.ai.shown > 0.95) {
            target.ai.shown = 0.95;
          }
        }
        return;
      }
      delete player.storage.jsrgbashiing;
    },
    ai: {
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        if (arg == "use") {
          return false;
        }
        if (player.storage.jsrgbashiing) {
          return false;
        }
        if (!player.hasZhuSkill("jsrgbashi")) {
          return false;
        }
        return game.hasPlayer(function(current) {
          return current != player && current.group == "wu";
        });
      }
    }
  },
  //许攸
  jsrglipan: {
    forbid: ["guozhan"],
    trigger: {
      player: "phaseEnd"
    },
    async cost(event, trigger, player) {
      let list = lib.group.slice();
      list.remove(player.group);
      let getV = function(group) {
        let val = 1;
        if (group == "wei" || group == "qun") {
          val++;
        }
        game.countPlayer((current) => {
          if (current.group != group) {
            return false;
          }
          let att = get.attitude(player, current);
          if (att > 0) {
            val++;
          } else if (att == 0) {
            val += 0.5;
          } else {
            val--;
          }
        });
        return val;
      };
      let maxGroup = list.slice().sort((a, b) => {
        return getV(b) - getV(a);
      })[0];
      list.push("cancel2");
      const result = await player.chooseControl(list).set("prompt", get.prompt(event.skill)).set("prompt2", "变更为另一个势力").set("ai", () => {
        return _status.event.choice;
      }).set("choice", maxGroup).forResult();
      event.result = {
        bool: result.control != "cancel2",
        cost_data: result.control
      };
    },
    async content(event, trigger, player) {
      const group = event.cost_data;
      player.popup(group + "2", get.groupnature(group, "raw"));
      await player.changeGroup(group);
      let num = game.countPlayer((current) => {
        return current.group == group && current != player;
      });
      if (num > 0) {
        await player.draw(num);
      }
      trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
      player.addTempSkill("jsrglipan_backfire");
    },
    subSkill: {
      backfire: {
        trigger: {
          player: "phaseUseEnd"
        },
        charlotte: true,
        forced: true,
        popup: false,
        filter(event, player) {
          return event._extraPhaseReason == "jsrglipan";
        },
        async content(event, trigger, player) {
          const targets = game.filterPlayer((current) => {
            return current.group == player.group;
          });
          const func = async (target) => {
            if (!target?.isIn()) {
              return;
            }
            const card = get.autoViewAs({ name: "juedou" }, "unsure");
            if (!target.canUse(card, player, false)) {
              return;
            }
            const next = target.chooseToUse();
            next.set("openskilldialog", `离叛：是否将一张牌当做决斗对${get.translation(player)}使用？`);
            next.set("norestore", true);
            next.set("_backupevent", "jsrglipan_backup");
            next.set("targetRequired", true);
            next.set("complexTarget", true);
            next.set("sourcex", player);
            next.set("custom", {
              add: {},
              replace: { window() {
              } }
            });
            next.set("filterTarget", function(card2, player2, target2) {
              const { sourcex } = get.event();
              if (target2 != sourcex && !ui.selected.targets.includes(sourcex)) {
                return false;
              }
              return lib.filter.targetEnabled.apply(this, arguments);
            });
            next.backup("jsrglipan_backup");
            await next;
          };
          await game.doAsyncInOrder(targets, func);
        }
      },
      backup: {
        filterCard(card) {
          return get.itemtype(card) == "card";
        },
        viewAs: {
          name: "juedou"
        },
        selectCard: 1,
        position: "hes",
        ai1(card) {
          return 7 - get.value(card);
        },
        log: false
      }
    }
  },
  jsrgqingxi: {
    enable: "phaseUse",
    filter(event, player) {
      if (player.group != "qun") {
        return false;
      }
      return game.hasPlayer((current) => lib.skill.jsrgqingxi.filterTarget("", player, current));
    },
    groupSkill: "qun",
    filterTarget(card, player, target) {
      if (target.countCards("h") >= player.countCards("h")) {
        return false;
      }
      return !player.getStorage("jsrgqingxi_used").includes(target);
    },
    async content(event, trigger, player) {
      const { target } = event;
      player.addTempSkill("jsrgqingxi_used", "phaseUseAfter");
      player.markAuto("jsrgqingxi_used", [target]);
      const num = player.countCards("h") - target.countCards("h");
      if (num <= 0) {
        return;
      }
      await player.chooseToDiscard({
        prompt: "轻袭：弃置" + get.cnNumber(num) + "张手牌",
        selectCard: num,
        allowChooseAll: true,
        forced: true
      });
      const card = get.autoViewAs({
        name: "sha",
        nature: "stab",
        isCard: true
      });
      if (player.canUse(card, target, false)) {
        await player.useCard({
          card,
          targets: [target],
          addCount: false
        });
      }
    },
    ai: {
      order: 8,
      result: {
        target: (player, target) => {
          let num = player.countCards("h") - target.countCards("h"), eff = get.effect(target, { name: "sha", nature: "stab" }, player, target), val = 0, ph = _status.event.getTempCache("jsrgqingxi_result", "ph");
          if (!ph) {
            ph = player.getCards("h").sort((a, b) => {
              return get.value(a) - get.value(b);
            });
            _status.event.putTempCache("jsrgqingxi_result", "ph", ph);
          }
          ph.slice(0, num).forEach((i) => {
            val += get.value(i, player);
          });
          eff = Math.sign(eff) * Math.sqrt(Math.abs(eff));
          if (val > 2 * Math.abs(eff)) {
            return 0;
          }
          return eff / num;
        }
      }
    },
    subSkill: {
      used: {
        onremove: true,
        charlotte: true
      }
    }
  },
  jsrgjinmie: {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      if (player.group != "wei") {
        return false;
      }
      return game.hasPlayer((current) => current.countCards("h") > player.countCards("h"));
    },
    groupSkill: "wei",
    filterTarget(card, player, target) {
      return target.countCards("h") > player.countCards("h");
    },
    async content(event, trigger, player) {
      const { target } = event;
      const card = get.autoViewAs({
        name: "sha",
        nature: "fire",
        storage: { jsrgjinmie: target },
        isCard: true
      });
      if (player.canUse(card, target, false)) {
        player.useCard({
          card,
          targets: [target],
          addCount: false
        });
        player.addTempSkill("jsrgjinmie_effect");
      }
    },
    ai: {
      order: 0.5,
      result: {
        target(player, target) {
          let eff = get.effect(target, { name: "sha", nature: "fire" }, player, target) / 30;
          if (!target.mayHaveShan(player, "use")) {
            eff *= 2;
          }
          let del = target.countCards("h") - player.countCards("h") + 1.5;
          eff *= Math.sqrt(del);
          return eff;
        }
      }
    },
    subSkill: {
      effect: {
        trigger: {
          source: "damageSource"
        },
        filter(event, player) {
          return event.card && event.card.storage && event.card.storage.jsrgjinmie && event.card.storage.jsrgjinmie.isIn();
        },
        forced: true,
        popup: false,
        charlotte: true,
        async content(event, trigger, player) {
          const target = trigger.card.storage.jsrgjinmie;
          const del = target.countCards("h") - player.countCards("h");
          if (del > 0) {
            player.line(target);
            await player.discardPlayerCard({
              target,
              position: "h",
              forced: true,
              selectButton: del,
              allowChooseAll: true
            });
          }
        }
      }
    }
  },
  //吕布
  jsrgwuchang: {
    forbid: ["guozhan"],
    trigger: {
      player: "gainAfter",
      global: "loseAsyncAfter"
    },
    forced: true,
    filter(event, player) {
      let cards2 = event.getg(player);
      if (!cards2.length) {
        return false;
      }
      return game.hasPlayer((current) => {
        if (current == player) {
          return false;
        }
        return event.getl(current).cards2.length;
      });
    },
    group: "jsrgwuchang_add",
    async content(event, trigger, player) {
      const targets = game.filterPlayer((current) => current !== player && trigger.getl(current).cards2.length > 0);
      const target = targets[0];
      await player.changeGroup(target.group);
      player.popup(target.group + "2", get.groupnature(target.group, "raw"));
    },
    subSkill: {
      add: {
        trigger: {
          source: "damageBegin1"
        },
        filter(event, player) {
          if (!event.card || !["sha", "juedou"].includes(event.card.name) || event.getParent().type != "card") {
            return false;
          }
          return event.player.group == player.group;
        },
        forced: true,
        async content(event, trigger, player) {
          trigger.num++;
          const group = "qun";
          await player.changeGroup(group);
          player.popup(group + "2", get.groupnature(group, "raw"));
        }
      }
    }
  },
  jsrgqingjiao: {
    enable: "phaseUse",
    filter(event, player) {
      if (player.group != "qun") {
        return false;
      }
      if (!player.countCards("hes")) {
        return false;
      }
      const list = player.getStorage("jsrgqingjiao_used");
      return !list.includes("tuixinzhifu") && game.hasPlayer((current) => {
        return current.countCards("h") > player.countCards("h");
      }) || !list.includes("chenghuodajie") && game.hasPlayer((current) => {
        return current.countCards("h") < player.countCards("h");
      });
    },
    groupSkill: "qun",
    position: "hes",
    filterCard: true,
    selectCard: 1,
    discard: false,
    lose: false,
    delay: false,
    filterTarget(card, player, target) {
      let mod = game.checkMod(ui.selected.cards[0], player, "unchanged", "cardEnabled2", player);
      if (!mod) {
        return false;
      }
      let del = target.countCards("h") - player.countCards("h");
      if (del == 0) {
        return false;
      }
      let name = del > 0 ? "tuixinzhifu" : "chenghuodajie";
      if (player.getStorage("jsrgqingjiao_used").includes(name)) {
        return false;
      }
      return player.canUse({ name, cards: ui.selected.cards }, target);
    },
    async content(event, trigger, player) {
      const { target, cards: cards2 } = event;
      const del = target.countCards("h") - player.countCards("h");
      const name = del > 0 ? "tuixinzhifu" : "chenghuodajie";
      player.addTempSkill("jsrgqingjiao_used", "phaseUseAfter");
      player.markAuto("jsrgqingjiao_used", name);
      await player.useCard({
        card: get.autoViewAs({ name }),
        cards: cards2,
        targets: [target]
      });
    },
    ai: {
      order: 7,
      result: {
        player(player, target) {
          let name = target.countCards("h") > player.countCards("h") ? "tuixinzhifu" : "chenghuodajie";
          let list = [];
          if (ui.selected.cards.length) {
            list.addArray(ui.selected.cards);
          }
          let card = get.autoViewAs({ name }, list);
          return get.effect(target, card, player, player);
        }
      }
    },
    subSkill: {
      used: {
        onremove: true,
        charlotte: true
      }
    }
  },
  jsrgchengxu: {
    trigger: { player: "useCard" },
    forced: true,
    locked: false,
    filter(event, player) {
      if (player.group != "shu") {
        return false;
      }
      return game.hasPlayer((current) => {
        return current != player && current.group == player.group;
      });
    },
    groupSkill: "shu",
    async content(event, trigger, player) {
      trigger.directHit.addArray(game.filterPlayer((current) => current != player && current.group == player.group));
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        return player.group == "shu" && player.group == arg.target.group;
      }
    }
  },
  //张郃
  jsrgqiongtu: {
    audio: 2,
    enable: "chooseToUse",
    groupSkill: "qun",
    viewAs: {
      name: "wuxie",
      suit: "none",
      number: void 0,
      isCard: true
    },
    filter(event, player) {
      if (!player.countCards("he", (card) => _status.connectMode || get.type(card) != "basic")) {
        return false;
      }
      return player.group == "qun" && !player.hasSkill("jsrgqiongtu_check");
    },
    viewAsFilter(player) {
      if (!player.countCards("he", (card) => _status.connectMode || get.type(card) != "basic")) {
        return false;
      }
      return player.group == "qun" && !player.hasSkill("jsrgqiongtu_check");
    },
    filterCard(card) {
      return get.type(card) != "basic";
    },
    position: "he",
    popname: true,
    ignoreMod: true,
    log: false,
    async precontent(event, trigger, player) {
      player.logSkill("jsrgqiongtu");
      const card = event.result.cards?.[0];
      if (card == null) {
        return;
      }
      event.card = card;
      event.result.card = {
        name: event.result.card?.name,
        storage: { jsrgqiongtu: true },
        isCard: true
      };
      event.result.cards = [];
      player.addTempSkill("jsrgqiongtu_check");
      await player.addToExpansion({
        cards: [card],
        source: player,
        animate: "give",
        gaintag: ["jsrgqiongtu"]
      });
    },
    marktext: "途",
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill) {
      let cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
      delete player.storage[skill];
    },
    subSkill: {
      check: {
        trigger: { global: "useCardAfter" },
        filter(event, player) {
          return event.card.name == "wuxie" && event.card.storage?.jsrgqiongtu;
        },
        forced: true,
        popup: false,
        charlotte: true,
        async content(event, trigger, player) {
          await game.delayx();
          const evt = trigger.getParent(4);
          if (evt == null) {
            return;
          }
          let state;
          if (evt.name == "phaseJudge") {
            state = evt.cancelled;
          } else {
            state = evt._neutralized;
          }
          if (state) {
            await player.draw();
          } else {
            await player.changeGroup("wei");
            const cards2 = player.getExpansions("jsrgqiongtu");
            if (cards2.length) {
              await player.gain({
                cards: cards2,
                animate: "gain2"
              });
            }
          }
        }
      }
    }
  },
  jsrgxianzhu: {
    audio: 2,
    enable: "chooseToUse",
    filter(event, player) {
      return player.group == "wei" && player.hasCard((card) => {
        return _status.connectMode || get.type(card) == "trick";
      }, "hs");
    },
    groupSkill: "wei",
    locked: false,
    viewAs: {
      name: "sha",
      storage: { jsrgxianzhu: true }
    },
    position: "hs",
    filterCard(card) {
      return get.type(card) == "trick";
    },
    check(card) {
      let player = _status.event.player;
      let cardx = {
        name: "sha",
        storage: { jsrgxianzhu: true },
        cards: [card]
      };
      if (game.hasPlayer((current) => {
        return player.canUse(cardx, current) && get.effect(current, card, player, player) > 0 && get.effect(current, cardx, player, player) > 0;
      })) {
        return 15 - get.value(card);
      }
      return 0;
    },
    onuse(links, player) {
      player.addTempSkill("jsrgxianzhu_after");
    },
    mod: {
      cardUsable(card) {
        if (card.storage && card.storage.jsrgxianzhu) {
          return Infinity;
        }
      }
    },
    subSkill: {
      after: {
        audio: "jsrgxianzhu",
        trigger: {
          global: "damageSource"
        },
        filter(event, player) {
          let targets = event.getParent(2).targets;
          if (!targets || targets.length != 1) {
            return false;
          }
          if (!event.card || !event.card.storage || !event.card.storage.jsrgxianzhu) {
            return false;
          }
          let target = event.player, card = event.cards[0];
          if (!target.isIn()) {
            return false;
          }
          if (get.type(card) != "trick") {
            return false;
          }
          if (!player.canUse(card, target, false)) {
            return false;
          }
          return true;
        },
        forced: true,
        charlotte: true,
        group: "jsrgxianzhu_inf",
        async content(event, trigger, player) {
          const card = get.autoViewAs({
            name: trigger.cards[0].name,
            isCard: true
          });
          await player.useCard({
            card,
            targets: [trigger.player],
            addCount: false
          });
          await game.delayx();
        }
      },
      inf: {
        trigger: { player: "useCard1" },
        forced: true,
        popup: false,
        firstDo: true,
        filter(event, player) {
          if (event.card.storage && event.card.storage.jsrgxianzhu && event.addCount !== false) {
            return true;
          }
          return false;
        },
        async content(event, trigger, player) {
          trigger.addCount = false;
          const stat = player.getStat().card;
          const name = trigger.card.name;
          if (typeof stat[name] == "number") {
            stat[name]--;
          }
        }
      }
    }
  },
  //邹氏
  jsrgguyin: {
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    check(event, player) {
      return player.isTurnedOver() || game.countPlayer2((current) => current.hasSex("male")) >= 2;
    },
    async content(event, trigger, player) {
      await player.turnOver();
      const targets = game.filterPlayer((current) => current != player && current.hasSex("male")).sortBySeat();
      player.line(targets);
      await game.delayx();
      for (const target of targets) {
        const result = await target.chooseBool("是否响应" + get.translation(player) + "的【孤吟】？", "你可以翻面。").set("ai", () => {
          return _status.event.bool;
        }).set(
          "bool",
          (function() {
            return target.isTurnedOver() || get.attitude(target, player) > 0 && (game.countPlayer2((current) => current.hasSex("male")) >= 3 || target.getHp() <= 1 && player.hasSkill("jsrgzhangdeng"));
          })()
        ).forResult();
        if (result.bool) {
          await target.turnOver();
        }
      }
      const drawer = game.filterPlayer((current) => {
        return current == player || current.isTurnedOver();
      }).sortBySeat();
      let index = 0;
      let count = 0;
      while (++index) {
        const target = drawer[index - 1];
        if (target.isIn()) {
          await target.draw();
          count++;
        }
        if (count >= game.countPlayer2((current) => current.hasSex("male"))) {
          break;
        }
        if (index >= drawer.length) {
          index = 0;
        }
      }
    }
  },
  jsrgzhangdeng: {
    trigger: {
      global: "logSkill"
    },
    filter(event, player) {
      return event.player.getHistory("useSkill", (evt) => {
        return evt.skill == "jsrgzhangdeng_jiu";
      }).map((evt) => evt.event).indexOf(event.log_event) == 1;
    },
    global: "jsrgzhangdeng_jiu",
    forced: true,
    locked: false,
    async content(event, trigger, player) {
      await player.turnOver(false);
    },
    ai: { combo: "jsrgguyin" },
    subSkill: {
      jiu: {
        audio: "jsrgzhangdeng",
        enable: "chooseToUse",
        filter(event, player) {
          return player.isTurnedOver() && game.hasPlayer((current) => {
            return current.hasSkill("jsrgzhangdeng") && current.isTurnedOver();
          });
        },
        viewAs: { name: "jiu", isCard: true },
        viewAsFilter(player) {
          return player.isTurnedOver() && game.hasPlayer((current) => {
            return current.hasSkill("jsrgzhangdeng") && current.isTurnedOver();
          });
        },
        filterCard: () => false,
        log: false,
        selectCard: -1,
        async precontent(event, trigger, player) {
          player.logSkill("jsrgzhangdeng_jiu");
          const targets = game.filterPlayer((current) => current.hasSkill("jsrgzhangdeng") && current.isTurnedOver());
          player.line(targets[0]);
        }
      }
    }
  },
  //关羽
  jsrgguanjue: {
    trigger: {
      player: ["useCard", "respond"]
    },
    filter(event, player) {
      return lib.suit.includes(get.suit(event.card));
    },
    forced: true,
    async content(event, trigger, player) {
      const targets = game.filterPlayer((current) => current != player);
      const suit = get.suit(trigger.card);
      for (const target of targets) {
        target.addTempSkill("jsrgguanjue_ban");
        target.markAuto("jsrgguanjue_ban", [suit]);
      }
    },
    subSkill: {
      ban: {
        onremove: true,
        charlotte: true,
        mod: {
          cardEnabled(card, player) {
            if (player.getStorage("jsrgguanjue_ban").includes(get.suit(card))) {
              return false;
            }
          },
          cardRespondable(card, player) {
            if (player.getStorage("jsrgguanjue_ban").includes(get.suit(card))) {
              return false;
            }
          },
          cardSavable(card, player) {
            if (player.getStorage("jsrgguanjue_ban").includes(get.suit(card))) {
              return false;
            }
          }
        },
        mark: true,
        marktext: "绝",
        intro: {
          content: "本回合内不能使用或打出$的牌"
        }
      }
    }
  },
  jsrgnianen: {
    enable: ["chooseToUse", "chooseToRespond"],
    filter(event, player) {
      if (!player.countCards("hes")) {
        return false;
      }
      for (let name of lib.inpile) {
        if (get.type2(name) != "basic") {
          continue;
        }
        let card = { name };
        if (event.filterCard(get.autoViewAs(card, "unsure"), player, event)) {
          return true;
        }
        if (name == "sha") {
          for (let nature of lib.inpile_nature) {
            card.nature = nature;
            if (event.filterCard(get.autoViewAs(card, "unsure"), player, event)) {
              return true;
            }
          }
        }
      }
      return false;
    },
    derivation: "mashu",
    chooseButton: {
      dialog(event, player) {
        let list = [];
        for (let name of lib.inpile) {
          if (name == "sha") {
            if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
              list.push(["基本", "", "sha"]);
            }
            for (let nature of lib.inpile_nature) {
              if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
                list.push(["基本", "", "sha", nature]);
              }
            }
          } else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
            list.push(["基本", "", name]);
          }
        }
        let dialog = ui.create.dialog("念恩", [list, "vcard"]);
        dialog.direct = true;
        return dialog;
      },
      filter(button, player) {
        return _status.event.getParent().filterCard(get.autoViewAs({ name: button.link[2], nature: button.link[3] }, "unsure"), player, _status.event.getParent());
      },
      check(button) {
        if (_status.event.getParent().type != "phase") {
          return 1;
        }
        let player = _status.event.player;
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
          audio: "jsrgnianen",
          filterCard: true,
          popname: true,
          check(card) {
            return 8 - get.value(card);
          },
          position: "hes",
          viewAs: { name: links[0][2], nature: links[0][3] },
          log: false,
          async precontent(event, trigger, player2) {
            player2.logSkill("jsrgnianen");
            const card = event.result.card;
            if (card != null && get.color(card, player2) != "red" || get.name(card) != "sha" || get.natureList(card).length) {
              player2.tempBanSkill("jsrgnianen");
              player2.addTempSkill("jsrgnianen_blocker");
              player2.addAdditionalSkill("jsrgnianen_blocker", "mashu");
            }
          }
        };
      },
      prompt(links, player) {
        return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
      }
    },
    hiddenCard(player, name) {
      if (!lib.inpile.includes(name)) {
        return false;
      }
      let type = get.type2(name);
      return type == "basic" && player.countCards("hes") > 0 && !player.isTempBanned("jsrgnianen");
    },
    ai: {
      fireAttack: true,
      respondSha: true,
      respondShan: true,
      skillTagFilter(player) {
        if (!player.countCards("hes") || player.isTempBanned("jsrgnianen")) {
          return false;
        }
      },
      order: 1,
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
      blocker: {
        charlotte: true,
        mark: true,
        marktext: "恩",
        intro: { content: "视为拥有〖马术〗" }
      }
    }
  },
  //生鱼片
  jsrglunshi: {
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return game.hasPlayer((current) => {
        return current.inRangeOf(target);
      });
    },
    async content(event, trigger, player) {
      const { target } = event;
      let num = game.countPlayer((current) => current.inRangeOf(target));
      const len = target.countCards("h");
      num = Math.max(0, Math.min(len + num, 5) - len);
      if (num > 0) {
        await target.draw(num);
      }
      num = game.countPlayer((current) => current.inRange(target));
      if (num > 0) {
        await target.chooseToDiscard({
          selectCard: num,
          position: "he",
          forced: true,
          prompt: get.translation(player) + "对你发动了【论势】",
          prompt2: "请弃置" + get.cnNumber(num) + "张牌"
        });
      }
    },
    ai: {
      order: 6,
      result: {
        target(player, target) {
          let num1 = game.countPlayer((current) => {
            return current.inRangeOf(target);
          }), num2 = game.countPlayer((current) => {
            return current.inRange(target);
          });
          let len = target.countCards("h");
          num1 = Math.max(0, Math.min(len + num1, 5) - len);
          return (num1 - num2 + 1) / 2;
        }
      }
    }
  },
  jsrgguitu: {
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    filter(event, player) {
      return game.countPlayer((current) => {
        return current.getEquips(1).length;
      }) >= 2;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        filterTarget(card, player2, target) {
          return target.getEquips(1).length;
        },
        selectTarget: [1, 2],
        prompt: get.prompt2("jsrgguitu"),
        ai(target) {
          let sign = -1;
          let val = 0;
          if (ui.selected.targets.length) {
            sign = 1;
            const targetx = ui.selected.targets[0];
            const cards3 = targetx.getEquips(1);
            const list2 = cards3.map((card) => {
              return [card, get.value(card, targetx)];
            });
            list2.sort((a, b) => b[1] - a[1]);
            val = get.attitude(_status.event.player, targetx) * list2[0][1];
          }
          const cards2 = target.getEquips(1);
          const list = cards2.map((card) => {
            return [card, get.value(card, target)];
          });
          list.sort((a, b) => b[1] - a[1]);
          return get.attitude(_status.event.player, target) * list[0][1] * sign - val;
        }
      }).set("filterOk", () => {
        let num = 0;
        for (const target of ui.selected.targets) {
          num += target.getEquips(1).length;
        }
        return num >= 2;
      }).forResult();
    },
    logTarget: "targets",
    async content(event, trigger, player) {
      const { targets } = event;
      targets.sortBySeat();
      const rangeList = targets.map((target) => target.getAttackRange());
      const weapons = [];
      for (const target of targets) {
        weapons.addArray(target.getEquips(1));
      }
      let result;
      if (weapons.length > 2) {
        const list2 = ["诡图：选择要交换的武器牌"];
        for (const target of targets) {
          list2.addArray(['<div class="text center">' + get.translation(target) + "的武器牌</div>", target.getEquips(1)]);
        }
        result = await player.chooseButton({
          createDialog: list2,
          filterButton(button) {
            const count = _status.event.count;
            if (count == 1) {
              return true;
            }
            for (const selectedButton of ui.selected.buttons) {
              if (get.owner(button.link) == get.owner(selectedButton.link)) {
                return false;
              }
            }
            return true;
          },
          selectButton: 2,
          forced: true,
          ai(button) {
            const currentPlayer = _status.event.player;
            const card = button.link;
            const owner = get.owner(card);
            const att = get.attitude(currentPlayer, owner);
            return -get.value(card) * att;
          }
        }).set("count", targets.length).forResult();
      } else {
        result = { bool: true, links: weapons };
      }
      if (!result.bool) {
        return;
      }
      const links = result.links;
      const list = [];
      for (const target of targets) {
        const targetWeapons = target.getEquips(1).filter((i) => links.includes(i));
        if (targetWeapons.length) {
          list.push([target, targetWeapons]);
        }
      }
      let players;
      let cards2;
      if (list.length == 2) {
        players = list.map((i) => i[0]);
        cards2 = list.map((i) => i[1]);
      } else {
        players = [list[0][0], list[0][0]];
        cards2 = list[0][1];
      }
      await game.loseAsync({
        player: players[0],
        target: players[1],
        cards1: cards2[0],
        cards2: cards2[1]
      }).setContent("swapHandcardsx");
      if (Array.isArray(cards2[1])) {
        for (const card of cards2[1]) {
          if (get.position(card, true) == "o") {
            players[0].equip(card);
          }
        }
      }
      if (Array.isArray(cards2[0])) {
        for (const card of cards2[0]) {
          if (get.position(card, true) == "o") {
            players[1].equip(card);
          }
        }
      }
      const newRangeList = targets.map((target) => target.getAttackRange());
      for (const [index, target] of targets.entries()) {
        if (newRangeList[index] < rangeList[index]) {
          await target.recover();
        }
      }
    }
  },
  //甄宓
  jsrgjixiang: {
    trigger: {
      global: ["chooseToUseBegin", "chooseToRespondBegin"]
    },
    filter(event, player) {
      if (player != _status.currentPhase) {
        return false;
      }
      if (player == event.player) {
        return false;
      }
      if (!player.countCards("he")) {
        return false;
      }
      return get.inpileVCardList((info) => {
        const name = info[2];
        info[3];
        if (info[0] != "basic") {
          return false;
        }
        const card = { name, isCard: true };
        if (player.getStorage("jsrgjixiang_record").includes(name)) {
          return false;
        }
        return event.filterCard(card, event.player, event);
      }).length;
    },
    global: "jsrgjixiang_save",
    async cost(event, trigger, player) {
      const list = get.inpileVCardList((info) => {
        const name2 = info[2];
        info[3];
        if (info[0] != "basic") {
          return false;
        }
        const card2 = { name: name2 };
        if (player.getStorage("jsrgjixiang_record").includes(name2)) {
          return false;
        }
        return trigger.filterCard(card2, trigger.player, trigger);
      });
      if (!list.length) {
        return;
      }
      const evt = trigger.getParent();
      const listx = list.map((i) => i[2]).toUniqued();
      let names = "";
      for (let i = 0; i < listx.length; i++) {
        names += "【" + get.translation(listx[i]) + "】";
        names += i < listx.length - 2 ? "、" : "或";
      }
      names = names.slice(0, names.length - 1);
      const reason = trigger.name == "chooseToUse" ? "使用" : "打出";
      const used = player.getStorage("jsrgjixiang_record").filter((name2) => listx.includes(name2));
      let str = get.translation(trigger.player) + (evt.card ? "因" + get.translation(evt.card) : "") + "需要" + reason + "一张" + names + "，是否弃置一张牌视为其" + reason + "之" + (used.length ? "（你不能以此法令其" + reason + get.translation(used) + "）" : "") + "？若如此做，你摸一张牌并令〖称贤〗此阶段可发动次数上限+1。";
      event.str = str;
      let result;
      if (list.length == 1) {
        result = { bool: true, links: list };
      } else {
        event.asked = true;
        result = await player.chooseButton(["###" + get.prompt(event.skill, trigger.player) + '###<div class="text center">' + str + "</div>", [list, "vcard"]]).set("ai", () => Math.random() + 1).forResult();
      }
      if (!result.bool) {
        return;
      }
      event.list = list;
      const name = result.links[0][2], nature = result.links[0][3];
      const card = { name, nature, isCard: true }, prompt = event.asked ? "济乡：是否弃置一张牌" + (trigger.filterTarget ? "并选择目标角色" : "") + "？" : get.prompt("jsrgjixiang", trigger.player);
      str = event.asked ? "若如此做，视为" + get.translation(trigger.player) + reason + get.translation(card) + "，然后你摸一张牌并令〖称贤〗此阶段可发动次数上限+1。" : event.str;
      const next = player.chooseCardTarget({
        prompt,
        prompt2: str,
        filterCard: lib.filter.cardDiscardable,
        position: "he",
        goon: get.attitude(player, trigger.player) > 1 && (evt.card ? get.effect(trigger.player, evt.card, evt.player, player) < 0 : get.effect(trigger.player, { name: event.list[0][2] }, trigger.player, player) > 0),
        ai1(card2) {
          if (_status.event.goon) {
            return 6 - get.value(card2);
          }
          return 0;
        },
        _get_card: card
      });
      let keys = ["filterTarget", "selectTarget", "ai2"];
      for (let key of keys) {
        delete next[key];
      }
      for (let i in trigger) {
        if (!(i in next)) {
          next[i] = trigger[i];
        }
      }
      next.filterTargetx = trigger.filterTarget || (() => false);
      next.filterTarget = function(card2, player2, target) {
        this.filterTargetx;
        card2 = _status.event._get_card;
        player2 = _status.event.getTrigger().player;
        return this.filterTargetx.apply(this, arguments);
      };
      if (typeof next.selectTarget != "number" && typeof next.selectTarget != "function" && get.itemtype(next.selectTarget) != "select") {
        next.selectTarget = -1;
      }
      const result2 = await next.forResult();
      event.result = {
        bool: result2.bool,
        cards: result2.cards,
        targets: result2.targets,
        cost_data: card
      };
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const card = event.cost_data, cardx = event.cards[0];
      const targets = event.targets || [];
      event.targets = targets;
      player.addTempSkill("jsrgjixiang_record");
      player.markAuto("jsrgjixiang_record", [card.name]);
      await player.discard(cardx);
      trigger.untrigger();
      trigger.set("responded", true);
      const result = {
        bool: true,
        card
      };
      if (targets.length) {
        result.targets = targets;
      }
      trigger.result = result;
      await player.draw();
      let phaseName;
      for (const name of lib.phaseName) {
        const evt = trigger.getParent(name);
        if (!evt || evt.name != name) {
          continue;
        }
        phaseName = name;
        break;
      }
      if (phaseName) {
        player.addTempSkill("jsrgjixiang_add", phaseName + "After");
        player.addMark("jsrgjixiang_add", 1, false);
      }
    },
    subSkill: {
      record: {
        charlotte: true,
        onremove: true,
        mark: true,
        marktext: "乡",
        intro: {
          content: "已触发过牌名：$"
        }
      },
      add: {
        charlotte: true,
        onremove: true,
        mark: true,
        intro: {
          markcount: (storage, player) => storage || 0,
          content: (storage, player) => "〖称贤〗可发动次数+" + (storage || 0)
        }
      },
      save: {
        charlotte: true,
        ai: {
          save: true,
          skillTagFilter(player, arg, target) {
            return _status.currentPhase && _status.currentPhase != player && _status.currentPhase.hasSkill("jsrgjixiang") && _status.currentPhase.countCards("he");
          }
        }
      }
    }
  },
  jsrgchengxian: {
    getVCards(event, player) {
      return get.inpileVCardList((info) => {
        if (info[0] != "trick") {
          return false;
        }
        const name = info[2], nature = info[3], infox = get.info({ name });
        if (!infox || infox.notarget || !infox.selectTarget) {
          return false;
        }
        if (player.getStorage("jsrgchengxian").includes(name)) {
          return false;
        }
        if (!player.hasCard((card) => {
          const num = game.countPlayer((current) => {
            return player.canUse(card, current);
          });
          if (!num) {
            return false;
          }
          const cardx = { name, nature };
          cardx.cards = [card];
          const num2 = game.countPlayer((current) => {
            return player.canUse(cardx, current);
          });
          return num == num2;
        }, "hs")) {
          return false;
        }
        return event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event);
      });
    },
    enable: "phaseUse",
    usable(skill, player) {
      return 2 + player.countMark("jsrgjixiang_add");
    },
    filter(event, player) {
      if (!player.countCards("hs")) {
        return false;
      }
      return get.info("jsrgchengxian").getVCards(event, player).length;
    },
    chooseButton: {
      dialog(event, player) {
        const list = get.info("jsrgchengxian").getVCards(event, player);
        return ui.create.dialog("称贤", [list, "vcard"]);
      },
      filter(button, player) {
        return _status.event.getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, _status.event.getParent());
      },
      check(button) {
        if (_status.event.getParent().type != "phase") {
          return 1;
        }
        const player = _status.event.player;
        if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan"].includes(button.link[2])) {
          return 0;
        }
        return player.getUseValue({
          name: button.link[2],
          nature: button.link[3]
        });
      },
      backup(links, player) {
        return {
          audio: "jsrgchengxian",
          filterCard(card, player2) {
            const num = game.countPlayer((current) => {
              return player2.canUse(card, current);
            });
            if (!num) {
              return false;
            }
            const cardx = get.copy(lib.skill.jsrgchengxian_backup.viewAs);
            cardx.cards = [card];
            const num2 = game.countPlayer((current) => {
              return player2.canUse(cardx, current);
            });
            return num == num2;
          },
          popname: true,
          check(card) {
            return 8 - get.value(card);
          },
          position: "hs",
          viewAs: { name: links[0][2], nature: links[0][3] },
          async precontent(event, trigger, player2) {
            player2.logSkill("jsrgchengxian");
            if (!player2.storage.jsrgchengxian) {
              player2.when({ global: "phaseAfter" }).step(async () => {
                player2.unmarkSkill("jsrgchengxian");
              });
            }
            player2.markAuto("jsrgchengxian", event.result.card?.name);
          }
        };
      },
      prompt(links, player) {
        return "将一张合法目标数与" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "相同的手牌当此牌使用";
      }
    },
    marktext: "贤",
    intro: {
      content: "本回合已因〖称贤〗使用过$",
      onunmark: true
    },
    ai: {
      order: 6,
      result: {
        player: 1
      }
    }
  },
  //张辽
  jsrgzhengbing: {
    audio: 2,
    enable: "phaseUse",
    usable: 3,
    filter(event, player) {
      return player.group == "qun";
    },
    filterCard: lib.filter.cardRecastable,
    check(card) {
      let player = _status.event.player, val = 5 + ["shan", "tao"].includes(get.name(card)) * 1.5;
      if (player.needsToDiscard() > 2 && get.name(card) == "sha" && player.countCards("hs", "sha") > 1) {
        val += 0.5;
      }
      return val - get.value(card);
    },
    position: "he",
    groupSkill: "qun",
    lose: false,
    discard: false,
    delay: false,
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      await player.recast(cards2);
      switch (get.name(cards2[0])) {
        case "sha":
          player.addTempSkill("jsrgzhengbing_sha");
          player.addMark("jsrgzhengbing_sha", 2, false);
          break;
        case "shan":
          await player.draw();
          break;
        case "tao":
          await player.changeGroup("wei");
      }
    },
    ai: {
      order: 7,
      result: { player: 1 }
    },
    subSkill: {
      sha: {
        charlotte: true,
        onremove: true,
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("jsrgzhengbing_sha");
          }
        },
        intro: {
          content: "手牌上限+#"
        }
      }
    }
  },
  jsrgtuwei: {
    audio: 2,
    trigger: {
      player: "phaseUseBegin"
    },
    filter(event, player) {
      return player.group == "wei" && game.hasPlayer((current) => {
        return player.inRange(current) && current.countGainableCards(player, "he") > 0;
      });
    },
    groupSkill: "wei",
    direct: true,
    async content(event, trigger, player) {
      let result;
      result = await player.chooseTarget(
        get.prompt("jsrgtuwei"),
        "获得攻击范围内任意名角色的各一张牌。然后回合结束时这些角色中未受过伤害的角色依次获得你的一张牌。",
        (card, player2, target) => {
          return player2.inRange(target) && target.countGainableCards(player2, "he") > 0;
        },
        [1, Infinity]
      ).set("ai", (target) => {
        let player2 = _status.event.player;
        return get.effect(target, { name: "shunshou_copy2" }, player2, player2);
      }).forResult();
      if (result.bool) {
        let targets = result.targets.slice();
        targets.sortBySeat();
        player.logSkill("jsrgtuwei", targets);
        player.gainMultiple(result.targets, "he");
        player.addTempSkill("jsrgtuwei_backfire");
        player.markAuto("jsrgtuwei_backfire", targets);
      }
    },
    subSkill: {
      backfire: {
        audio: "jsrgtuwei",
        trigger: {
          player: "phaseEnd"
        },
        charlotte: true,
        onremove: true,
        forced: true,
        filter(event, player) {
          return player.getStorage("jsrgtuwei_backfire").some((target) => {
            return !target.getHistory("damage").length && target.isIn();
          });
        },
        async content(event, trigger, player) {
          const targets = player.getStorage("jsrgtuwei_backfire").filter((target) => !target.getHistory("damage").length && target.isIn());
          targets.sortBySeat();
          for (const target of targets) {
            if (target.isIn() && player.countGainableCards(target, "he")) {
              target.line(player);
              await target.gainPlayerCard(player, true, "he");
            }
            if (!player.countCards("he")) {
              break;
            }
          }
        },
        ai: {
          effect: {
            player(card, player, target) {
              if (player != target && get.tag(card, "damage") && target && player.getStorage("jsrgtuwei_backfire").includes(target) && !target.getHistory("damage").length) {
                return [1, 1, 1, 0];
              }
            }
          }
        }
      }
    }
  },
  //许贡
  jsrgbiaozhao: {
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.countPlayer((current) => current != player) >= 1;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), lib.filter.notMe, 1).set("ai", (target) => {
        const player2 = get.player(), att = get.attitude(player2, target), hs = target.countCards("hs");
        return -att / Math.sqrt(hs + 0.1);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0], skill = `${event.name}_syujin`;
      player.addTempSkill(skill, { player: ["phaseBegin", "dying"] });
      player.markAuto(skill, target);
      target.addTip(`${skill}_${player.playerid}`, `表召 ${get.translation(player)}`);
    },
    global: "jsrgbiaozhao_global",
    subSkill: {
      global: {
        mod: {
          cardUsableTarget(card, player, target) {
            if (player == target) {
              return;
            }
            if (game.hasPlayer((current) => {
              return current.getStorage("jsrgbiaozhao_syujin").includes(target);
            })) {
              return true;
            }
          }
        }
      },
      syujin: {
        charlotte: true,
        onremove(player, skill) {
          player.getStorage(skill).forEach((current) => {
            current.removeTip(`${skill}_${player.playerid}`);
          });
          player.setStorage(skill, null, true);
        },
        intro: {
          content: "你已表召$<br>其以外的角色对其使用牌无次数限制，这些角色使用的牌对你造成的伤害+1"
        },
        trigger: {
          global: "useCard"
        },
        filter(event, player) {
          return player.getStorage("jsrgbiaozhao_syujin").includes(event.player);
        },
        async cost(event, trigger, player) {
          const id = player.playerid, map = trigger.customArgs;
          map[id] ??= {};
          if (typeof map[id].extraDamage != "number") {
            map[id].extraDamage = 0;
          }
          map[id].extraDamage++;
        }
      }
    }
  },
  jsrgyechou: {
    trigger: { player: "die" },
    forceDie: true,
    direct: true,
    skillAnimation: true,
    animationColor: "wood",
    async content(event, trigger, player) {
      let result;
      result = await player.chooseTarget(get.prompt2("jsrgyechou"), lib.filter.notMe).set("ai", (target) => {
        let player2 = _status.event.player;
        return -get.attitude(player2, target);
      }).forResult();
      if (result.bool) {
        let target = result.targets[0];
        player.logSkill("jsrgyechou", target);
        target.addSkill("jsrgyechou_effect");
        target.addMark("jsrgyechou_effect", 1, false);
      }
    },
    subSkill: {
      effect: {
        trigger: {
          player: "damageBegin3"
        },
        filter(event, player) {
          return event.num >= player.getHp();
        },
        forced: true,
        charlotte: true,
        onremove: true,
        async content(event, trigger, player) {
          trigger.num *= 2 * player.countMark("jsrgyechou_effect");
        },
        mark: true,
        marktext: "仇",
        intro: {
          content: "当你受到伤害值不小于体力值的伤害时，此伤害翻&倍"
        },
        ai: {
          effect: {
            target(card, player, target) {
              if (get.tag(card, "damage")) {
                if (player.hasSkillTag("jueqing", false, target)) {
                  return [1, -2];
                }
                if (target.hp == 1) {
                  return 2;
                }
              }
            }
          }
        }
      }
    }
  },
  //淳于琼
  jsrgcangchu: {
    audio: "recangchu",
    trigger: {
      global: "phaseJieshuBegin"
    },
    filter(event, player) {
      return player.getHistory("gain").length;
    },
    direct: true,
    async content(event, trigger, player) {
      let result;
      let num = 0;
      player.checkHistory("gain", (evt) => {
        num += evt.cards.length;
      });
      event.num = num;
      result = await player.chooseTarget(get.prompt("jsrgcangchu"), "令至多" + get.cnNumber(num) + "名角色各摸" + get.cnNumber(num > game.countPlayer() ? 2 : 1) + "张牌", [1, num]).set("ai", (target) => {
        let player2 = _status.event.player;
        return get.attitude(player2, target) / Math.sqrt(target.countCards("hs") + 1);
      }).forResult();
      if (result.bool) {
        let targets = result.targets.slice();
        targets.sortBySeat();
        player.logSkill("jsrgcangchu", targets);
        game.asyncDraw(targets, num > game.countPlayer() ? 2 : 1);
        game.delayex();
      }
    }
  },
  jsrgshishou: {
    audio: "reshishou",
    trigger: {
      player: "useCard"
    },
    forced: true,
    filter(event, player) {
      return event.card.name == "jiu";
    },
    group: "jsrgshishou_burn",
    async content(event, trigger, player) {
      await player.draw(3);
      player.addTempSkill("jsrgshishou_nouse");
    },
    mod: {
      aiOrder(player, card, num) {
        if (card.name == "jiu") {
          return 0.01;
        }
      }
    },
    ai: {
      halfneg: true,
      effect: {
        player_use(card, player, target) {
          if (card.name == "jiu") {
            return [1, 1];
          }
        }
      }
    },
    subSkill: {
      nouse: {
        charlotte: true,
        mod: {
          cardEnabled(card, player) {
            return false;
          },
          cardUsable(card, player) {
            return false;
          },
          cardSavable(card, player) {
            return false;
          }
        },
        mark: true,
        marktext: "失",
        intro: {
          content: "喝醉了，不能再使用牌"
        }
      },
      burn: {
        audio: "reshishou",
        trigger: {
          player: "damageEnd"
        },
        forced: true,
        filter(event, player) {
          return event.hasNature("fire");
        },
        async content(event, trigger, player) {
          player.tempBanSkill("jsrgcangchu", { player: "phaseEnd" });
          player.addTempSkill("jsrgshishou_blocker", { player: "phaseEnd" });
        }
      },
      blocker: {
        charlotte: true,
        mark: true,
        marktext: "守",
        intro: {
          content: "〖仓储〗失效直到下回合结束"
        }
      }
    }
  },
  //江山如故·起
  sbyingmen: {
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      if (!_status.characterlist) {
        game.initCharacterList();
      }
      let characters2 = _status.characterlist.randomRemove(4);
      lib.skill.sbyingmen.addVisitors(characters2, player);
      game.delayx();
    },
    ai: {
      combo: "sbpingjian"
    },
    group: "sbyingmen_reload",
    subSkill: {
      reload: {
        trigger: { player: "phaseBegin" },
        forced: true,
        async content(event, trigger, player) {
          if (!_status.characterlist) {
            game.initCharacterList();
          }
          const num = player.getStorage("sbyingmen").length;
          if (num > 0) {
            const result = await player.chooseButton(["盈门：是否移去任意名访客？", [player.getStorage("sbyingmen"), "character"]], [1, num]).set("ai", (button) => {
              return Math.random() > 0.8;
            }).forResult();
            if (result?.bool && result.links?.length) {
              lib.skill.sbyingmen.removeVisitors(result.links, player);
              game.log(player, "移去了", "#y" + get.translation(result.links));
            }
          }
          const characters2 = _status.characterlist.randomRemove(4 - player.getStorage("sbyingmen").length);
          if (characters2.length) {
            lib.skill.sbyingmen.addVisitors(characters2, player);
          }
          await game.delayx();
        }
      }
    },
    getSkills(characters2, player) {
      let skills2 = [];
      for (let name of characters2) {
        if (Array.isArray(get.character(name).skills)) {
          for (let skill of get.character(name).skills) {
            let list = get.skillCategoriesOf(skill, player);
            list.remove("锁定技");
            if (list.length > 0) {
              continue;
            }
            let info = get.info(skill);
            if (info && (!info.unique || info.gainable)) {
              skills2.add(skill);
            }
          }
        }
      }
      return skills2;
    },
    addVisitors(characters2, player) {
      player.addSkillBlocker("sbyingmen");
      game.log(player, "将", "#y" + get.translation(characters2), "加入了", "#g“访客”");
      game.broadcastAll(
        function(player2, characters3) {
          player2.tempname.addArray(characters3);
          player2.$draw(
            characters3.map(function(name) {
              let cardname = "huashen_card_" + name;
              lib.card[cardname] = {
                fullimage: true,
                image: "character:" + name
              };
              lib.translate[cardname] = get.rawName2(name);
              return game.createCard(cardname, " ", " ");
            }),
            "nobroadcast"
          );
        },
        player,
        characters2
      );
      player.markAuto("sbyingmen", characters2);
      let storage = player.getStorage("sbyingmen");
      let skills2 = lib.skill.sbyingmen.getSkills(storage, player);
      player.addInvisibleSkill(skills2);
    },
    removeVisitors(characters2, player) {
      let skills2 = lib.skill.sbyingmen.getSkills(characters2, player);
      let characters22 = player.getStorage("sbyingmen").slice(0);
      characters22.removeArray(characters2);
      skills2.removeArray(lib.skill.sbyingmen.getSkills(characters22, player));
      if (Array.isArray(player.tempname)) {
        game.broadcastAll((player2, characters3) => player2.tempname.removeArray(characters3), player, characters2);
      }
      player.unmarkAuto("sbyingmen", characters2);
      _status.characterlist.addArray(characters2);
      player.removeInvisibleSkill(skills2);
    },
    onremove(player, skill) {
      lib.skill.sbyingmen.removeVisitors(player.getStorage("sbyingmen"), player);
      player.removeSkillBlocker("sbyingmen");
    },
    skillBlocker(skill, player) {
      if (!player.invisibleSkills.includes(skill) || skill == "sbpingjian" || skill == "sbyingmen") {
        return false;
      }
      player.removeSkillBlocker("sbyingmen");
      const bool = !player.hasSkill("sbpingjian");
      player.addSkillBlocker("sbyingmen");
      return bool;
    },
    marktext: "客",
    intro: {
      name: "访客",
      mark(dialog, storage, player) {
        if (!storage || !storage.length) {
          return "当前没有“访客”";
        }
        dialog.addSmall([storage, "character"]);
        let skills2 = lib.skill.sbyingmen.getSkills(storage, player);
        if (skills2.length) {
          dialog.addText("<li>当前可用技能：" + get.translation(skills2), false);
        }
      }
    }
  },
  sbpingjian: {
    trigger: { player: ["useSkill", "logSkillBegin"] },
    forced: true,
    locked: false,
    filter(event, player) {
      let skill = get.sourceSkillFor(event);
      return player.invisibleSkills.includes(skill) && lib.skill.sbyingmen.getSkills(player.getStorage("sbyingmen"), player).includes(skill);
    },
    async content(event, trigger, player) {
      const visitors = player.getStorage("sbyingmen").slice(0);
      const drawers = visitors.filter(function(name) {
        return get.character(name).skills?.includes(get.sourceSkillFor(trigger));
      });
      event.drawers = drawers;
      const dialog = ["评鉴：请选择移去一张“访客”"];
      if (drawers.length) {
        dialog.push('<div class="text center">如果移去' + get.translation(drawers) + "，则你摸一张牌</div>");
      }
      dialog.push([visitors, "character"]);
      const result = await player.chooseButton(dialog, true).set("direct", true).forResult();
      if (result?.bool) {
        lib.skill.sbyingmen.removeVisitors(result.links, player);
        game.log(player, "移去了", "#y" + get.translation(result.links[0]));
        if (event.drawers.includes(result.links[0])) {
          player.addTempSkill("sbpingjian_draw");
          player.markAuto("sbpingjian_draw", [trigger.skill]);
        }
      }
    },
    group: "sbpingjian_trigger",
    subSkill: {
      draw: {
        charlotte: true,
        onremove: true,
        trigger: { player: ["useSkillAfter", "logSkill"] },
        forced: true,
        popup: false,
        filter(event, player) {
          return player.getStorage("sbpingjian_draw").includes(event.skill);
        },
        async content(event, trigger, player) {
          player.unmarkAuto(event.name, [trigger.skill]);
          await player.draw();
          if (!player.getStorage(event.name).length) {
            player.removeSkill(event.name);
          }
        }
      },
      trigger: {
        trigger: { player: "triggerInvisible" },
        forced: true,
        forceDie: true,
        popup: false,
        charlotte: true,
        priority: 10,
        filter(event, player) {
          if (event.revealed) {
            return false;
          }
          let info = get.info(event.skill);
          if (info.charlotte) {
            return false;
          }
          let skills2 = lib.skill.sbyingmen.getSkills(player.getStorage("sbyingmen"), player);
          game.expandSkills(skills2);
          return skills2.includes(event.skill);
        },
        async content(event, trigger, player) {
          let result;
          if (get.info(trigger.skill).silent) {
            return;
          } else {
            const info = get.info(trigger.skill);
            const evt = trigger, evtTrigger = evt._trigger;
            let str;
            info.check;
            if (info.prompt) {
              str = info.prompt;
            } else {
              if (typeof info.logTarget == "string") {
                str = get.prompt(evt.skill, evtTrigger[info.logTarget], player);
              } else if (typeof info.logTarget == "function") {
                const logTarget = info.logTarget(evtTrigger, player, evt.triggername, evt.indexedData);
                if (get.itemtype(logTarget)?.indexOf("player") == 0) {
                  str = get.prompt(evt.skill, logTarget, player);
                }
              } else {
                str = get.prompt(evt.skill, null, player);
              }
            }
            if (typeof str == "function") {
              str = str(evtTrigger, player, evt.triggername, evt.indexedData);
            }
            let next = player.chooseBool("评鉴：" + str);
            next.set("yes", !info.check || info.check(evtTrigger, player, evt.triggername, evt.indexedData));
            next.set("hsskill", evt.skill);
            next.set("forceDie", true);
            next.set("ai", function() {
              return _status.event.yes;
            });
            if (typeof info.prompt2 == "function") {
              next.set("prompt2", info.prompt2(evtTrigger, player, evt.triggername, evt.indexedData));
            } else if (typeof info.prompt2 == "string") {
              next.set("prompt2", info.prompt2);
            } else if (info.prompt2 != false) {
              if (lib.dynamicTranslate[evt.skill]) {
                next.set("prompt2", lib.dynamicTranslate[evt.skill](player, evt.skill));
              } else if (lib.translate[evt.skill + "_info"]) {
                next.set("prompt2", lib.translate[evt.skill + "_info"]);
              }
            }
            if (trigger.skillwarn) {
              if (next.prompt2) {
                next.set("prompt2", '<span class="thundertext">' + trigger.skillwarn + "。</span>" + next.prompt2);
              } else {
                next.set("prompt2", trigger.skillwarn);
              }
            }
            result = await next.forResult();
          }
          if (result?.bool) {
            if (!get.info(trigger.skill).cost) {
              trigger.revealed = true;
            }
          } else {
            trigger.untrigger();
            trigger.cancelled = true;
          }
        }
      }
    },
    ai: { combo: "sbyingmen" }
  },
  jsrgchaozheng: {
    audio: 4,
    trigger: { player: "phaseZhunbeiBegin" },
    logTarget(event, player) {
      return game.filterPlayer((i) => i != player);
    },
    prompt: "是否发动【朝争】？",
    logAudio: (index) => typeof index === "number" ? "jsrgchaozheng" + index + ".mp3" : 2,
    async content(event, trigger, player) {
      await player.chooseToDebate(game.filterPlayer((current) => current != player)).set("callback", async (event2) => {
        const result = event2.debateResult;
        const { bool, opinion, targets, opinions } = result;
        if (bool && opinion) {
          if (opinion && ["red", "black"].includes(opinion)) {
            player.logSkill("jsrgchaozheng", targets, null, null, [opinion == "red" ? 3 : 4]);
            for (const target of result.red.map((i) => i[0]).sortBySeat()) {
              await target[opinion == "red" ? "recover" : "loseHp"]();
            }
          }
        }
        if (opinions.some(
          (idea) => targets.every(
            (target) => result[idea].slice().map((i) => i[0]).includes(target)
          )
        )) {
          await player.draw(targets.length);
        }
      });
    }
  },
  jsrgshenchong: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    filterTarget: lib.filter.notMe,
    derivation: ["jsrgfeiyang", "jsrgbahu"],
    skillAnimation: true,
    animationColor: "soil",
    async content(event, trigger, player) {
      const { target, name: skillName } = event;
      player.awakenSkill(skillName);
      await target.addSkills(["jsrgfeiyang", "jsrgbahu"]);
      player.addSkill(skillName + "_die");
      player.markAuto(skillName + "_die", [target]);
    },
    ai: {
      order: 1,
      result: { target: 1 }
    },
    subSkill: {
      die: {
        audio: "jsrgshenchong",
        trigger: { player: "die" },
        charlotte: true,
        forced: true,
        forceDie: true,
        filter(event, player) {
          return player.getStorage("jsrgshenchong_die").length;
        },
        async content(event, trigger, player) {
          const targets = player.getStorage("jsrgshenchong_die");
          player.line(targets);
          targets.sortBySeat().forEach((current) => {
            current.clearSkills();
            current.chooseToDiscard(current.countCards("h"), "h", true);
          });
        }
      }
    }
  },
  jsrgfeiyang: {
    trigger: { player: "phaseJudgeBegin" },
    direct: true,
    filter(event, player) {
      return player.countCards("j") && player.countCards("h") > 1;
    },
    async content(event, trigger, player) {
      let result;
      result = await player.chooseToDiscard("h", 2, get.prompt("jsrgfeiyang"), "弃置两张手牌并弃置判定区里的一张牌").set("logSkill", "jsrgfeiyang").set("ai", function(card) {
        if (_status.event.goon) {
          return 9 - get.value(card);
        }
        return 0;
      }).set(
        "goon",
        (() => {
          if (player.hasSkillTag("rejudge") && player.countCards("j") < 2) {
            return false;
          }
          if (player.hasSkill("dckanyu", null, false, false) && !player.hasCards("j", (card) => card.name == "lebu")) {
            return false;
          }
          return player.hasCard(function(card) {
            if (get.tag(card, "damage") && get.damageEffect(player, player, _status.event.player, get.natureList(card)) >= 0) {
              return false;
            }
            return get.effect(
              player,
              {
                name: card.viewAs || card.name,
                cards: [card]
              },
              player,
              player
            ) < 0;
          }, "j");
        })()
      ).forResult();
      if (result.bool) {
        player.discardPlayerCard(player, "j", true);
      }
    }
  },
  jsrgbahu: {
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    async content(event, trigger, player) {
      await player.draw();
    },
    mod: {
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return num + 1;
        }
      }
    }
  },
  jsrgjulian: {
    audio: 4,
    logAudio: () => ["jsrgjulian1.mp3", "jsrgjulian2.mp3"],
    trigger: { global: "gainAfter" },
    filter(event, player) {
      const { player: source } = event;
      const skill = "jsrgjulian";
      if (source == player || source.group != "qun" || source.countMark(`${skill}_count`) >= lib.skill[skill].maxNum) {
        return false;
      }
      const evt = event.getParent("phaseDraw");
      return (!evt || evt.player != source) && event.getParent().name == "draw" && event.getParent(2).name != skill && player.hasZhuSkill(skill, event.player);
    },
    popup: false,
    async cost(event, trigger, player) {
      event.result = await trigger.player.chooseBool(`是否响应${get.translation(player)}的【聚敛】摸一张牌？`).forResult();
    },
    async content(event, trigger, player) {
      const { player: source } = trigger;
      source.logSkill(event.name, player);
      source.addTempSkill(`${event.name}_count`);
      source.addMark(`${event.name}_count`, 1, false);
      await source.draw();
    },
    maxNum: 2,
    group: "jsrgjulian_gain",
    zhuSkill: true,
    subSkill: {
      gain: {
        audio: ["jsrgjulian3.mp3", "jsrgjulian4.mp3"],
        trigger: { player: "phaseJieshuBegin" },
        filter(event, player) {
          return lib.skill["jsrgjulian_gain"].logTarget(null, player).length;
        },
        prompt: "是否发动【聚敛】？",
        prompt2: "获得其他所有群势力角色的各一张牌",
        logTarget(event, player) {
          return game.filterPlayer((current) => {
            return current.group == "qun" && current.countGainableCards(player, "he") > 0 && current != player;
          }).sortBySeat();
        },
        async content(event, trigger, player) {
          for (const target of event.targets) {
            await player.gainPlayerCard(target, "he", true);
          }
        }
      },
      count: {
        charlotte: true,
        onremove: true
      }
    }
  },
  //何进
  jsrgzhaobing: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      const hs = player.getCards("h");
      if (!hs.length) {
        return false;
      }
      return hs.every((card) => lib.filter.cardDiscardable(card, player, "jsrgzhaobing"));
    },
    async cost(event, trigger, player) {
      const cards2 = player.getCards("h");
      const num = cards2.length;
      event.result = await player.chooseTarget(get.prompt(event.skill), `弃置所有手牌，令至多${get.cnNumber(num)}名其他角色依次选择一项：1.正面向上交给你一张【杀】；2.失去1点体力`, [1, num], lib.filter.notMe).set("ai", (target) => {
        const { player: player2, goon } = get.event();
        if (!goon) {
          return 0;
        }
        return 2 - get.attitude(player2, target);
      }).set(
        "goon",
        num / 2 < game.countPlayer((current) => {
          return 2 - get.attitude(player, current) > 0;
        })
      ).forResult();
    },
    async content(event, trigger, player) {
      const { targets } = event;
      if (player.countCards("h")) {
        await player.discard(player.getCards("h"));
      }
      for (const target of targets.sortBySeat()) {
        if (!target.isIn()) {
          continue;
        }
        const { bool } = await target.chooseToGive(player, `诏兵：交给${get.translation(player)}一张【杀】，或失去1点体力`, (card) => get.name(card) == "sha").set("ai", (card) => {
          if (get.event().goon) {
            return 0;
          }
          return 6 - get.value(card);
        }).set("goon", get.effect(target, { name: "losehp" }, target, target) >= 0).forResult();
        if (!bool) {
          await target.loseHp();
        }
      }
    },
    ai: { expose: 0.2 }
  },
  jsrgzhuhuan: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      if (!player.countCards("h")) {
        return false;
      }
      const hs = player.getCards("h", "sha");
      if (!hs.length) {
        return false;
      }
      return hs.every((card) => lib.filter.cardDiscardable(card, player, "jsrgzhuhuan"));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), lib.filter.notMe).set("ai", (target) => {
        const player2 = get.player();
        return get.damageEffect(target, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      await player.showHandcards();
      const hs = player.getCards("h", "sha");
      await player.discard(hs);
      const num = hs.length;
      if (!num) {
        return;
      }
      const result = target.countCards("he") < num ? { bool: false } : await target.chooseToDiscard(`${get.translation(player)}对你发动了【诛宦】`, `弃置${get.cnNumber(num)}张牌并受到1点伤害；或点击“取消”令其回复1点体力且其摸${get.cnNumber(num)}张牌`, num, "he").set("ai", (card) => {
        if (get.event().goon) {
          return 0;
        }
        return 5.5 - get.value(card);
      }).set("goon", target.hp <= 2 || get.attitude(target, player) >= 0 || player.isHealthy()).forResult();
      if (result?.bool) {
        await target.damage();
      } else {
        await player.draw(num);
        await player.recover();
      }
    },
    ai: { expose: 0.2 }
  },
  jsrgyanhuo: {
    inherit: "spyanhuo",
    audio: 2,
    forced: true
  },
  //孙坚
  jsrgpingtao: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const { target } = event;
      const att = get.attitude(target, player);
      const { bool } = await target.chooseToGive(player, `${get.translation(player)}对你发动了【平讨】`, "交给其一张牌并令其此回合使用【杀】的次数上限+1；或点击“取消”令其视为对你使用一张【杀】", "he").set("ai", (card) => {
        const { give, att: att2 } = get.event();
        if (give) {
          if (card.name == "sha" || card.name == "tao" || card.name == "jiu") {
            return 0;
          }
          return 8 - get.value(card);
        }
        if (att2 < 0 && card.name == "sha") {
          return -1;
        }
        return 4 - get.value(card);
      }).set("give", (att >= 0 || target.hp == 1 && target.countCards("hs", "shan") <= 1) && get.effect(target, { name: "sha" }, player, target) < 0).set("att", att).forResult();
      if (bool) {
        player.addTempSkill(event.name + "_sha");
        player.addMark(event.name + "_sha", 1, false);
      } else if (player.canUse({ name: "sha", isCard: true }, target, false)) {
        await player.useCard({ name: "sha", isCard: true }, target, false);
      }
    },
    ai: {
      expose: 0.15,
      order: 5,
      result: { target: -1 }
    },
    subSkill: {
      sha: {
        charlotte: true,
        onremove: true,
        marktext: "讨",
        intro: { content: "本回合使用【杀】的次数上限+#" },
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.countMark("jsrgpingtao_sha");
            }
          }
        }
      }
    }
  },
  jsrgjuelie: {
    audio: 4,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return player.countCards("he") && event.card.name == "sha";
    },
    logTarget: "target",
    logAudio: () => ["jsrgjuelie3.mp3", "jsrgjuelie4.mp3"],
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard(get.prompt(event.skill, trigger.target), "当你使用【杀】指定一名角色为目标后，你可以弃置任意张牌，然后弃置其等量的牌", [1, Infinity], "he").set("allowChooseAll", true).set("ai", (card) => {
        if (ui.selected.cards.length >= _status.event.max) {
          return 0;
        }
        if (_status.event.goon) {
          return 4.5 - get.value(card);
        }
        return 0;
      }).set("max", trigger.target.countDiscardableCards(player, "he")).set("goon", get.attitude(player, trigger.target) < 0).set("chooseonly", true).forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      await player.discard(cards2);
      const num = cards2.length;
      if (trigger.target.countDiscardableCards(player, "he")) {
        await player.discardPlayerCard("平讨：弃置" + get.translation(trigger.target) + get.cnNumber(num) + "张牌", num, "he", trigger.target, true);
      }
    },
    ai: {
      unequip_ai: true,
      skillTagFilter(player, tag, arg) {
        if (!arg || !arg.name || arg.name != "sha") {
          return false;
        }
        if (!arg.target) {
          return false;
        }
        let card = arg.target.getEquip(2);
        return card && get.value(card) > 0 && player.hasCard((cardx) => {
          return lib.filter.cardDiscardable(cardx, player, "jsrgjuelie_discard") && get.value(cardx) < 5;
        });
      }
    },
    group: "jsrgjuelie_pojun",
    subSkill: {
      pojun: {
        audio: ["jsrgjuelie1.mp3", "jsrgjuelie2.mp3"],
        trigger: { source: "damageBegin1" },
        filter(event, player) {
          if (!player.isMinHandcard() && !player.isMinHp()) {
            return false;
          }
          return event.getParent().name == "sha";
        },
        forced: true,
        locked: false,
        logTarget: "player",
        async content(event, trigger, player) {
          trigger.num++;
        }
      }
    }
  },
  //皇甫嵩
  jsrgguanhuo: {
    audio: 2,
    enable: "phaseUse",
    viewAs: {
      name: "huogong",
      isCard: true,
      storage: { jsrgguanhuo: true }
    },
    async precontent(event, trigger, player) {
      player.addTempSkill("jsrgguanhuo_effect");
    },
    filterCard: () => false,
    selectCard: -1,
    prompt: "视为使用一张【火攻】",
    ai: {
      order(item, player) {
        return get.order({ name: "huogong" }) + 0.01;
      },
      effect: {
        player(card, player) {
          if (_status.event.getParent().skill == "jsrgguanhuo" && player.getHistory("useSkill", (evt) => {
            return evt.skill == "jsrgguanhuo" && evt.event.getParent("phaseUse") === _status.event.getParent("phaseUse");
          }).length == 1) {
            return "zeroplayertarget";
          }
          if (_status.event.type == "phase" && _status.event.skill == "jsrgguanhuo" && player.getHistory("useSkill", (evt) => {
            return evt.skill == "jsrgguanhuo" && evt.event.getParent("phaseUse") === _status.event.getParent("phaseUse");
          }).length > 1 && player.countCards("h") <= 3) {
            return [0, 0];
          }
        }
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          return event.card?.storage?.jsrgguanhuo && !game.hasPlayer2((current) => current.hasHistory("damage", (evt) => evt.card == event.card));
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const count = player.getHistory("useSkill", (evt) => {
            return evt.skill == "jsrgguanhuo" && evt.event.getParent("phaseUse") === trigger.getParent("phaseUse");
          }).length;
          if (count == 1) {
            player.addTempSkill("jsrgguanhuo_ex", "phaseUseAfter");
            player.addMark("jsrgguanhuo_ex", 1, false);
            trigger.targets.forEach((i) => i.removeSkill("huogong2"));
          } else {
            await player.removeSkills("jsrgguanhuo");
          }
        }
      },
      ex: {
        charlotte: true,
        onremove: true,
        intro: { content: "你使用【火攻】造成的伤害+#" },
        trigger: { source: "damageBegin1" },
        filter(event, player) {
          return event.card?.name == "huogong" && event.getParent().type == "card";
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          trigger.num += player.countMark("jsrgguanhuo_ex");
        }
      }
    }
  },
  jsrgjuxia: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    usable: 1,
    countSkill(player) {
      return player.getSkills(null, false, false).filter((skill) => {
        const info = get.info(skill);
        if (!info || info.charlotte) {
          return false;
        }
        return true;
      }).length;
    },
    filter(event, player) {
      return event.player != player && lib.skill.jsrgjuxia.countSkill(event.player) > lib.skill.jsrgjuxia.countSkill(player);
    },
    async cost(event, trigger, player) {
      const goon = get.effect(player, trigger.card, trigger.player, trigger.player) < 2 * get.effect(player, { name: "draw" }, player, trigger.player);
      if (goon && !event.isMine() && !event.isOnline()) {
        await game.delayx();
      }
      event.result = await trigger.player.chooseBool(`是否对${get.translation(player)}发动【居下】？`, `令${get.translation(trigger.card)}对其无效，然后其摸两张牌`).set("ai", () => {
        return _status.event.goon;
      }).set("goon", goon).forResult();
    },
    popup: false,
    async content(event, trigger, player) {
      trigger.player.logSkill(event.name, player);
      trigger.excluded.add(player);
      await player.draw(2);
    },
    ai: {
      effect: {
        target_use(card, player, target) {
          if (lib.skill.jsrgjuxia.countSkill(target) >= lib.skill.jsrgjuxia.countSkill(player)) {
            return;
          }
          if (card && (card.cards || card.isCard) && get.attitude(target, player) > 0 && (!target.storage.counttrigger || !target.storage.counttrigger.jsrgjuxia)) {
            return [0, 0.5, 0, 0.5];
          }
        }
      }
    }
  },
  jsrg_new_juxia: {
    audio: "jsrgjuxia",
    trigger: { target: "useCardToTargeted" },
    usable: 1,
    filter(event, player) {
      return event.player != player && lib.skill.jsrgjuxia.countSkill(event.player) > lib.skill.jsrgjuxia.countSkill(player);
    },
    logTarget: "player",
    async content(event, trigger, player) {
      await player.draw(2);
    },
    ai: {
      effect: {
        target_use(card, player, target) {
          if (lib.skill.jsrgjuxia.countSkill(target) >= lib.skill.jsrgjuxia.countSkill(player)) {
            return;
          }
          if (card && (card.cards || card.isCard) && (!target.storage.counttrigger || !target.storage.counttrigger.jsrg_new_juxia)) {
            return [1, 1];
          }
        }
      }
    }
  },
  //许劭
  jsrgyingmen: {
    trigger: {
      global: "phaseBefore",
      player: ["enterGame", "phaseBegin"]
    },
    forced: true,
    filter(event, player, name) {
      if (player.getStorage("jsrgyingmen").length >= 4) {
        return false;
      }
      if (name == "phaseBefore") {
        return game.phaseNumber == 0;
      }
      return event.name != "phase" || event.player == player;
    },
    update(player) {
      let id = player.playerid;
      let characters2 = player.getStorage("jsrgyingmen");
      let skillName = "jsrgpingjian_" + id;
      let skillsx = [], skillsx2 = [];
      let map = {};
      let skillsy = lib.skill[skillName] ? lib.skill[skillName].group : [];
      for (let name of characters2) {
        let skills2 = lib.character[name][3].slice();
        skills2 = skills2.filter((skill) => {
          let list = get.skillCategoriesOf(skill, player);
          list.removeArray(["锁定技", "Charlotte"]);
          if (list.length) {
            return false;
          }
          let info = get.info(skill);
          return info && (!info.unique || info.gainable);
        });
        game.expandSkills(skills2);
        for (let i = 0; i < skills2.length; i++) {
          let skill = skills2[i];
          let info = get.info(skill);
          if (info.silent || info.charlotte) {
            continue;
          }
          if (!info.forced && !info.frequent && (!info.mod || info.charlotte && info.mod)) {
            continue;
          }
          let infox = get.copy(info);
          let newname = skill + "_" + id;
          map[newname] = infox;
          if (info.audio) {
            infox.audio = typeof info.audio != "number" ? info.audio : skill;
          }
          if (infox.frequent) {
            delete infox.frequent;
          }
          if (infox.forceDie) {
            delete infox.forceDie;
          }
          let popup = infox.popup;
          if (infox.forced && infox.direct) {
            delete infox.direct;
            infox.popup = false;
          }
          if (infox.forced && !infox.prompt2) {
            let skillx = skill;
            while (true) {
              let prompt2 = lib.translate[skillx + "_info"];
              if (prompt2 && prompt2.length) {
                infox.prompt2 = prompt2;
                break;
              }
              let ind = skillx.lastIndexOf("_");
              if (ind == -1) {
                break;
              }
              skillx = skillx.slice(0, ind);
            }
          }
          if (popup != false && !infox.silent) {
            infox.forced = false;
          }
          if (!infox.charlotte && infox.mod) {
            delete infox.mod;
          }
          skillsx2.add(skill);
          skills2[i] = newname;
        }
        if (skills2.length) {
          skillsx.addArray(skills2);
        }
      }
      let skillsRemoving = skillsy.removeArray(skillsx);
      player.removeSkill(skillsRemoving);
      game.broadcastAll(
        function(name, skillsx3, skillsx22, id2, map2) {
          for (let i in map2) {
            lib.skill[i] = map2[i];
          }
          lib.skill[name] = {
            unique: true,
            group: skillsx3
          };
          lib.translate[name] = "评鉴";
          for (let i of skillsx22) {
            lib.translate[i + "_" + id2] = lib.translate[i];
            lib.translate[i + "_" + id2 + "_info"] = lib.translate[i + "_info"];
          }
        },
        skillName,
        skillsx,
        skillsx2,
        id,
        map
      );
      player.addSkill(skillName);
      player.addSkill("jsrgpingjian_blocker");
      player.addSkillTrigger(skillName);
    },
    bannedList: ["zishu", "weishu", "xinfu_zhanji", "kyouko_rongzhu"],
    async content(event, trigger, player) {
      if (!_status.characterlist) {
        game.initCharacterList();
      }
      let num = player.getStorage("jsrgyingmen").length;
      let list = [];
      _status.characterlist.randomSort();
      for (let i = 0; i < _status.characterlist.length; i++) {
        let name = _status.characterlist[i];
        let skills2 = lib.character[name][3].slice();
        if (skills2.some((skill) => {
          return lib.skill.jsrgyingmen.bannedList.includes(skill);
        })) {
          continue;
        }
        list.push(name);
        _status.characterlist.remove(name);
        if (list.length >= 4 - num) {
          break;
        }
      }
      if (list.length) {
        player.markAuto("jsrgyingmen", list);
        if (player.hasSkill("jsrgpingjian", null, false, false)) {
          lib.skill.jsrgyingmen.update(player);
        }
        game.log(player, "将", "#g" + get.translation(list), "置为", "#y访客");
        game.broadcastAll(
          function(player2, list2) {
            let cards2 = [];
            for (let i = 0; i < list2.length; i++) {
              let cardname = "huashen_card_" + list2[i];
              lib.card[cardname] = {
                fullimage: true,
                image: "character:" + list2[i]
              };
              lib.translate[cardname] = get.rawName2(list2[i]);
              cards2.push(game.createCard(cardname, "", ""));
            }
            player2.$draw(cards2, "nobroadcast");
          },
          player,
          list
        );
      }
    },
    ai: {
      combo: "jsrgpingjian"
    },
    marktext: "客",
    intro: {
      name: "访客(盈门/评鉴)",
      mark(dialog, storage, player) {
        dialog.addText("剩余“访客”");
        if (storage) {
          dialog.addSmall([storage, "character"]);
        } else {
          dialog.addText("无");
        }
      }
    }
  },
  jsrgpingjian: {
    trigger: { player: ["logSkill", "useSkillAfter"] },
    forced: true,
    locked: false,
    onremove(player) {
      player.removeSkill("jsrgpingjian_" + player.playerid);
    },
    filter(event, player) {
      let skill = event.skill, name = event.event ? event.event.name : "";
      let visitors = player.getStorage("jsrgyingmen");
      for (let visitor of visitors) {
        let skills2 = lib.character[visitor][3].slice();
        game.expandSkills(skills2);
        let info = get.info(skill);
        if (info && (info.charlotte || info.silent)) {
          continue;
        }
        if (skills2.some((skillx) => {
          return skill.indexOf(skillx) == 0 || name.indexOf(skillx + "_" + player.playerid) == 0;
        })) {
          return true;
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      let result;
      let current;
      let skill = trigger.skill, name = trigger.event ? trigger.event.name : "";
      let visitors = player.getStorage("jsrgyingmen");
      for (let visitor of visitors) {
        let skills2 = lib.character[visitor][3].slice();
        game.expandSkills(skills2);
        let info = get.info(skill);
        if (info && info.charlotte) {
          continue;
        }
        if (skills2.some((skillx) => {
          return skill.indexOf(skillx) == 0 || name.indexOf(skillx + "_" + player.playerid) == 0;
        })) {
          current = visitor;
          break;
        }
      }
      event.current = current;
      result = await player.chooseButton(['###评鉴：移去一名访客###<div class="text center">若移去的访客为' + get.translation(current) + "，则你摸一张牌</div>", [player.getStorage("jsrgyingmen"), "character"]], true).set("ai", (button) => {
        if (button.link == _status.event.toremove) {
          return 1;
        }
        return Math.random();
      }).set(
        "toremove",
        (function() {
          let list = player.getStorage("jsrgyingmen");
          let rand = Math.random();
          if (rand < 0.33) {
            return list[0];
          }
          if (rand < 0.66) {
            return current;
          }
          return list.randomGet();
        })()
      ).forResult();
      if (result.bool) {
        let visitor = result.links[0];
        game.log(player, "从", "#y访客", "中移去了", "#g" + get.translation(visitor));
        player.popup(visitor);
        player.unmarkAuto("jsrgyingmen", [visitor]);
        _status.characterlist.add(visitor);
        if (visitor == event.current) {
          await player.draw();
        }
        lib.skill.jsrgyingmen.update(player);
      }
    },
    subSkill: {
      blocker: {
        init(player, skill) {
          player.addSkillBlocker(skill);
        },
        onremove(player, skill) {
          player.removeSkillBlocker(skill);
        },
        charlotte: true,
        locked: true,
        skillBlocker(skill, player) {
          if (skill != "jsrgpingjian_" + player.playerid) {
            return false;
          }
          if (player._jsrgpingjian_blockerChecking) {
            return;
          }
          player._jsrgpingjian_blockerChecking = true;
          let own = player.hasSkill("jsrgpingjian");
          delete player._jsrgpingjian_blockerChecking;
          return !own;
        }
      }
    }
  },
  //董白
  jsrgshichong: {
    zhuanhuanji: true,
    trigger: { player: "useCardToPlayered" },
    direct: true,
    filter(event, player) {
      return event.target != player && event.targets.length == 1 && event.target.isIn() && event.target.countCards("h");
    },
    mark: true,
    marktext: "☯",
    intro: {
      content(storage, player) {
        let str = "转换技。当你使用牌指定其他角色为唯一目标后，";
        if (storage) {
          return str + "目标角色可以交给你一张手牌。";
        }
        return str + "你可以获得目标角色一张手牌。";
      }
    },
    async content(event, trigger, player) {
      let result;
      if (!player.storage.jsrgshichong) {
        result = await player.chooseBool(get.prompt("jsrgshichong", trigger.target), "你可以获得该角色的一张手牌").set("ai", () => {
          return _status.event.bool;
        }).set("bool", get.attitude(player, trigger.target) <= 0).forResult();
      } else {
        result = await trigger.target.chooseCard("是否发动" + get.translation(player) + "的【恃宠】？", "你可以选择一张手牌，并交给该角色").set("ai", (card) => {
          if (_status.event.goon) {
            return 5 - get.value(card);
          }
          return 0 - get.value(card);
        }).set("goon", get.attitude(trigger.target, player) > 2).forResult();
      }
      if (result.bool) {
        if (!player.storage.jsrgshichong) {
          player.logSkill("jsrgshichong", trigger.target);
          player.gainPlayerCard(trigger.target, "h", true);
        } else {
          trigger.target.logSkill("jsrgshichong", player);
          trigger.target.give(result.cards, player);
        }
        player.changeZhuanhuanji("jsrgshichong");
      }
    }
  },
  jsrglianzhu: {
    enable: "phaseUse",
    usable: 1,
    filterCard: { color: "black" },
    position: "h",
    filterTarget: lib.filter.notMe,
    lose: false,
    discard: false,
    delay: false,
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      await player.showCards(cards2, `${get.translation(player)}发动了【连诛】`);
      await player.give(cards2, target, true);
      const targets = game.filterPlayer((current) => current.group === target.group && current !== player && player.canUse("guohe", current));
      await game.delayx();
      await game.doAsyncInOrder(
        targets,
        (current) => player.useCard({
          card: {
            name: "guohe",
            isCard: true
          },
          targets: [current]
        })
      );
    },
    ai: {
      order: 4,
      result: {
        target(player, target) {
          let targets = game.filterPlayer((current) => {
            return current.group == target.group && current != player;
          });
          let eff = targets.reduce((p, c) => {
            return p + get.effect(c, { name: "guohe" }, player, player);
          }, 0);
          if (ui.selected.cards.length) {
            eff += get.value(ui.selected.cards[0], target);
          }
          return eff;
        }
      }
    }
  },
  jsrg_new_lianzhu: {
    trigger: {
      player: "phaseJieshuBegin"
    },
    async cost(event, trigger, player) {
      const card = new lib.element.VCard({ name: "guohe", isCard: true });
      const targets = game.filterPlayer((current) => player.canUse(card, current));
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card2, player2, target) => {
        return get.event().targetx.includes(target);
      }).set("targetx", targets).set("ai", (target) => {
        const card2 = new lib.element.VCard({ name: "guohe", isCard: true }), player2 = get.player();
        return get.effect(target, card2, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const { targets, name } = event;
      const result = {
        targets,
        card: new lib.element.VCard({ name: "guohe", isCard: true })
      };
      const next = player.useResult(result, event);
      player.when("useCardAfter").filter((evt) => evt == next).step(async (event2, trigger2, player2) => {
        if (trigger2.targets?.length > 1) {
          return;
        }
        const target = trigger2.targets[0];
        if (!target?.isIn()) {
          return;
        }
        player2.line(target, "green");
        let current = target.getNext();
        while (current != target) {
          if (current?.isIn()) {
            break;
          }
          current = current.getNext();
        }
        const bool = target == current || player2 == current, prompt = bool ? "结束此流程" : `令${get.translation(player2)}对${get.translation(current)}发动〖连诛〗`;
        const result2 = await target.chooseControl().set("choiceList", ["失去1点体力", prompt]).set("prompt", "连诛：请选择一项").set("ai", () => get.event().resultx).set(
          "resultx",
          (() => {
            if (bool) {
              return 1;
            }
            const eff1 = get.effect(target, { name: "losehp" }, target, target), eff2 = get.effect(current, { name: "guohe" }, player2, target);
            return eff1 > eff2 ? 0 : 1;
          })()
        ).forResult();
        if (result2.index == 0) {
          await target.loseHp();
        } else {
          if (bool) {
            return;
          }
          const card = new lib.element.VCard({ name: "guohe", isCard: true });
          if (!player2.canUse(card, current, false)) {
            return;
          }
          const resultx = {
            skill: name,
            targets: [current]
          };
          await player2.useResult(resultx, event2);
        }
      });
      await next;
    },
    subSkill: {
      backup: {
        filterCard: () => false,
        selectCard: -1,
        position: "h",
        viewAs: {
          name: "guohe",
          isCard: true
        },
        prompt: "视为使用一张【过河拆桥】",
        check(card) {
          return 7 - get.value(card);
        },
        log: false
      }
    }
  },
  //桥玄
  jsrgjuezhi: {
    trigger: { source: "damageBegin1" },
    filter(event, player) {
      if (_status.currentPhase != player || player.hasSkill("jsrgjuezhi_used", null, null, false)) {
        return false;
      }
      return event.card && event.getParent().type == "card" && lib.skill.jsrgjuezhi.getNum(event.player, player) > 0;
    },
    forced: true,
    locked: false,
    getNum(target, player) {
      return target.countCards("e", (card) => {
        let subtype = get.subtypes(card);
        for (let i of subtype) {
          if (player.hasDisabledSlot(i)) {
            return true;
          }
        }
        return false;
      });
    },
    group: "jsrgjuezhi_disable",
    async content(event, trigger, player) {
      player.addTempSkill("jsrgjuezhi_used", ["phaseZhunbeiAfter", "phaseJudgeAfter", "phaseDrawAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"]);
      trigger.num += lib.skill.jsrgjuezhi.getNum(trigger.player, player);
    },
    subSkill: {
      disable: {
        audio: "jsrgjuezhi",
        trigger: {
          player: "loseAfter",
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        direct: true,
        filter(event, player) {
          const evt = event.getl(player);
          return evt && evt.es && evt.es.length > 0;
        },
        async content(event, trigger, player) {
          const cards2 = trigger.getl(player).es;
          for (const card of cards2) {
            const subtypes = get.subtypes(card).filter((slot) => player.hasEnabledSlot(slot));
            if (subtypes.length <= 0) {
              continue;
            }
            const result = await player.chooseBool({
              prompt: get.prompt("jsrgjuezhi_disable"),
              prompt2: `废除你的${get.translation(subtypes)}栏`,
              ai() {
                return 1;
              }
            }).forResult();
            if (result.bool) {
              player.logSkill("jsrgjuezhi_disable");
              await player.disableEquip({
                slots: subtypes
              });
            }
          }
        }
      },
      used: { charlotte: true }
    }
  },
  jsrg_new_juezhi: {
    audio: "jsrgjuezhi",
    trigger: { global: "damageBegin3" },
    filter(event, player) {
      if (_status.currentPhase != player) {
        return false;
      }
      return lib.skill.jsrgjuezhi.getNum(event.player, player) > 0;
    },
    logTarget: "player",
    group: "jsrg_new_juezhi_disable",
    async content(event, trigger, player) {
      trigger.num++;
    },
    subSkill: {
      disable: {
        audio: "jsrg_new_juezhi",
        trigger: {
          player: "loseAfter",
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        getIndex(event, player) {
          return event.getl(player)?.es ?? [];
        },
        filter(event, player, name, card) {
          return get.subtypes(card).some((slot) => player.hasEnabledSlot(slot));
        },
        prompt2(event, player, name, card) {
          const slots = get.subtypes(card).filter((slot) => player.hasEnabledSlot(slot));
          return `废除你的${get.translation(slots)}栏`;
        },
        async content(event, trigger, player) {
          const card = event.indexedData;
          const slots = get.subtypes(card).filter((slot) => player.hasEnabledSlot(slot));
          await player.disableEquip(slots);
          await player.draw(2);
        }
      }
    }
  },
  jsrgjizhao: {
    trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill)).set("ai", (target) => {
        const player2 = get.player(), att = get.attitude(player2, target);
        if (target.countCards("ej", (card) => get.effect(target, card, target, player2) <= 0)) {
          return 4 + att;
        }
        if (target.countCards("ej") && !target.countCards("h")) {
          return 6 - att;
        }
        return target.countCards("h") * get.sgn(att);
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      const result = await target.chooseToUse({
        filterCard(card, player2, event2) {
          if (get.itemtype(card) != "card" || get.position(card) != "h" && get.position(card) != "s") {
            return false;
          }
          return lib.filter.filterCard.apply(this, arguments);
        },
        prompt: "急召：使用一张手牌，否则" + get.translation(player) + "可以移动你区域里的一张牌",
        addCount: false,
        goon: !target.countCards("ej", (card) => get.effect(target, card, target, player)) && get.attitude(target, player) > 0,
        ai1(card) {
          if (_status.event.goon) {
            return get.order(card);
          }
          return 0;
        }
      }).forResult();
      if (result.bool) {
        return;
      }
      const result2 = await player.chooseTarget(`急召：是否移动${get.translation(target)}的一张牌？`, (cardx, player2, target2) => {
        const { from } = get.event();
        if (from == target2) {
          return false;
        }
        if (from.countCards("h")) {
          return true;
        }
        if (from.countCards("e", (card) => target2.canEquip(card))) {
          return true;
        }
        return from.countCards("j", (card) => target2.canAddJudge(card));
      }).set("from", target).set("ai", (target2) => {
        const { player: player2, from } = get.event(), att = get.attitude(player2, target2), att2 = get.attitude(player2, from), getE = (card2) => get.effect(target2, card2, player2, player2) - get.effect(from, card2, player2, player2), getEffect = (card2) => {
          const pos = get.position(card2);
          switch (pos) {
            case "h": {
              return att2 > 0 ? 0 : get.sgn(att);
            }
            case "e": {
              return target2.canEquip(card2) ? getE(card2) : 0;
            }
            case "j": {
              return target2.canAddJudge(card2) ? getE(card2) : 0;
            }
          }
          return 0;
        };
        const card = from.getCards("hej").maxBy(getEffect);
        return card ? getEffect(card) : 0;
      }).set("targetprompt", "移动目标").forResult();
      if (!result2.bool || !result2.targets?.length) {
        return;
      }
      const targetx = result2.targets[0];
      await game.delay();
      const result3 = await player.choosePlayerCard("hej", true, target, (button) => {
        const { player: player2, from, to } = get.event(), card = button.link, eff1 = get.effect(from, card, from, player2), eff2 = get.effect(to, card, to, player2);
        if (get.position(card) != "h") {
          return eff2 - eff1;
        }
        return 2 + get.value(card) * get.sgnAttitude(player2, to);
      }).set("from", target).set("to", targetx).set("filterButton", function(button) {
        const { player: player2, from, to } = get.event(), card = button.link;
        if (get.position(card) == "h") {
          return true;
        } else if (get.position(card) == "j") {
          return to.canAddJudge(card);
        } else {
          return to.canEquip(card);
        }
      }).forResult();
      if (result3.bool && result3.links.length) {
        const link = result3.links[0];
        if (get.position(link) == "h") {
          await targetx.gain(link, target, "giveAuto");
        } else {
          target.$give(link, targetx, false);
          if (get.position(link) == "e") {
            await targetx.equip(link);
          } else if (link.viewAs) {
            await targetx.addJudge({ name: link.viewAs }, [link]);
          } else {
            await targetx.addJudge(link);
          }
        }
        game.log(target, "的", get.position(link) == "h" ? "一张手牌" : link, "被移动给了", targetx);
        await game.delay();
      }
    },
    ai: {
      effect: {
        target_use(card, player, target, current) {
          if (get.type(card) == "delay" && current < 0) {
            if (target.countCards("j")) {
              return;
            }
            return "zerotarget";
          }
        }
      }
    }
  },
  //杨彪
  jsrgzhaohan: {
    audio: "zhaohan",
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    //locked:false,
    filter(event, player) {
      if (game.shuffleNumber == 0) {
        return player.isDamaged();
      }
      return true;
    },
    async content(event, trigger, player) {
      await player[game.shuffleNumber > 0 ? "loseHp" : "recover"]();
    }
  },
  jsrgrangjie: {
    audio: "rangjie",
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return player.canMoveCard() && event.num > 0;
    },
    check(event, player) {
      return player.canMoveCard(true);
    },
    getIndex: (event) => event.num,
    async content(event, trigger, player) {
      if (!player.canMoveCard()) {
        return;
      }
      const result = await player.moveCard(true).forResult();
      if (!result?.card) {
        return;
      }
      const suit = get.suit(result.card, false);
      const cards2 = Array.from(ui.discardPile.childNodes);
      const gains = [];
      const history = game.getGlobalHistory("cardMove", (evt) => {
        if (evt.name == "lose") {
          return evt.position == ui.discardPile;
        }
        return evt.name == "cardsDiscard";
      });
      for (let i = history.length - 1; i >= 0; i--) {
        let evt = history[i];
        let cards22 = evt.cards.filter((card) => {
          return cards2.includes(card) && get.suit(card, false) == suit;
        });
        if (cards22.length) {
          gains.addArray(cards22);
          cards2.removeArray(cards22);
        }
        if (!cards2.length) {
          break;
        }
      }
      if (gains.length) {
        const result2 = await player.chooseButton(["让节：是否获得一张" + get.translation(suit) + "牌？", gains]).set("ai", get.buttonValue).forResult();
        if (result2?.bool && result2?.links?.length) {
          await player.gain(result2.links, "gain2");
        }
      }
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
            if (target._jsrgrangjie_aiChecking) {
              return;
            }
            target._jsrgrangjie_aiChecking = true;
            let moveCard = target.canMoveCard(true);
            delete target._jsrgrangjie_aiChecking;
            if (!moveCard || !target.hasFriend()) {
              return;
            }
            let num = 1;
            if (get.attitude(player, target) > 0) {
              if (player.needsToDiscard()) {
                num = 0.5;
              } else {
                num = 0.3;
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
  jsrgyizheng: {
    audio: "yizheng",
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer(function(current) {
        return current.countCards("h") > player.countCards("h") && player.canCompare(current);
      });
    },
    filterTarget(card, player, current) {
      return current.countCards("h") > player.countCards("h") && player.canCompare(current);
    },
    async content(event, trigger, player) {
      const { target } = event;
      let result = await player.chooseToCompare(target).forResult();
      if (result.bool) {
        target.skip("phaseDraw");
        target.addTempSkill("yizheng2", { player: "phaseDrawSkipped" });
        return;
      }
      result = await target.chooseControl({
        prompt: `是否对${get.translation(player)}造成至多2点伤害？`,
        controls: ["1", "2", "cancel"],
        ai() {
          return get.event().choice;
        }
      }).set("choice", get.damageEffect(player, target, target) > 0 ? get.attitude(target, player) > 0 ? 0 : 1 : "cancel2").forResult();
      if (result.control != "cancel2") {
        const num = result.index + 1;
        target.line(player);
        await player.damage({
          num,
          source: target
        });
      }
    },
    ai: {
      order: 1,
      result: {
        target(player, target) {
          if (target.skipList.includes("phaseDraw") || target.hasSkill("pingkou")) {
            return 0;
          }
          let hs = player.getCards("h").sort(function(a, b) {
            return b.number - a.number;
          });
          let ts = target.getCards("h").sort(function(a, b) {
            return b.number - a.number;
          });
          if (!hs.length || !ts.length) {
            return 0;
          }
          if (hs[0].number > ts[0].number) {
            return -1;
          }
          return 0;
        }
      }
    }
  },
  //孔融
  jsrglirang: {
    audio: "splirang",
    trigger: { global: "phaseDrawBegin" },
    filter(event, player) {
      return event.player != player && player.countCards("he") > 1;
    },
    async cost(event, trigger, player) {
      const { player: target } = trigger;
      event.result = await player.chooseCard(get.prompt(event.name.slice(0, -5), target), "你可以选择两张牌，将这些牌交给该角色。若如此做，你获得其本回合弃牌阶段弃置的所有牌。", 2, "he").set("ai", (card) => {
        const { player: player2, target: target2, give } = get.event();
        if (!give) {
          return 0;
        }
        return target2.getUseValue(card) - player2.getUseValue(card) + 0.5;
      }).set("give", get.attitude(player, target) > 0).set("target", target).forResult();
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const { player: target } = trigger, { cards: cards2, name } = event;
      player.tempBanSkill(name, "roundStart");
      await player.give(cards2, target);
      player.addTempSkill("jsrglirang_record", "roundStart");
      player.addTempSkill("jsrglirang_given");
      player.markAuto("jsrglirang_record", [target]);
    },
    subSkill: {
      record: {
        charlotte: true,
        onremove: true,
        intro: { content: "本轮〖礼让〗目标：$" }
      },
      given: {
        audio: "splirang",
        getCards(event, player) {
          const cards2 = [];
          event.player.getHistory("lose", (evt) => {
            if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) {
              cards2.addArray(evt.cards2.filterInD("d"));
            }
          });
          return cards2;
        },
        trigger: { global: "phaseDiscardEnd" },
        filter(event, player) {
          return get.info("jsrglirang_given").getCards(event, player).length;
        },
        charlotte: true,
        prompt2(event, player) {
          const cards2 = get.info("jsrglirang_given").getCards(event, player);
          return "获得" + get.translation(cards2);
        },
        async content(event, trigger, player) {
          await player.gain({
            cards: get.info(event.name).getCards(trigger, player),
            animate: "gain2"
          });
        }
      }
    }
  },
  jsrgzhengyi: {
    trigger: { player: "damageBegin4" },
    filter(event, player) {
      const list = player.getStorage("jsrglirang_record");
      if (!list.length) {
        return false;
      }
      return game.getGlobalHistory(
        "everything",
        (evt) => {
          return evt.name == "damage" && evt.player == player;
        },
        event
      ).indexOf(event) == 0 && list.some((i) => i.isIn());
    },
    direct: true,
    async content(event, trigger, player) {
      const targets = player.getStorage("jsrglirang_record").filter((i) => i.isIn());
      let target2;
      while (targets.length) {
        const target = targets.shift();
        const { bool } = await target.chooseBool("是否对" + get.translation(player) + "发动【争义】？", "将此" + (trigger.source ? "来源为" + get.translation(trigger.source) : "无来源") + "的" + trigger.num + "点伤害转移给你").set("ai", () => {
          return _status.event.bool;
        }).set("bool", get.damageEffect(player, trigger.source, target) > get.damageEffect(target, trigger.source, target)).forResult();
        if (bool) {
          target2 = target;
          break;
        }
      }
      if (!target2?.isIn()) {
        return;
      }
      target2.logSkill("jsrgzhengyi", player);
      trigger.cancel();
      await target2.damage(trigger.source, trigger.nature, trigger.num).set("card", trigger.card).set("cards", trigger.cards);
    },
    ai: { combo: "jsrglirang" }
  },
  jsrg_new_lirang: {
    audio: "jsrglirang",
    trigger: {
      global: "roundStart"
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), [1, 2], lib.filter.notMe).set("ai", (target) => {
        return get.attitude(get.player(), target);
      }).forResult();
    },
    async content(event, trigger, player) {
      const { targets, name } = event;
      const cards2 = get.cards(4);
      await game.cardsGotoOrdering(cards2);
      await player.showCards(cards2, `${get.translation(player)}发动了【礼让】`, true);
      for (const target of targets) {
        const gains2 = cards2.filterInD();
        if (!gains2.length) {
          continue;
        }
        const result = await target.chooseButton(["礼让：获得任意张牌", gains2], [1, Infinity]).set("ai", (button) => {
          if (!ui.selected.buttons.length) {
            return get.value(button.link);
          }
          const { player: player2, gains: gains3 } = get.event();
          if (gains3.length <= ui.selected.buttons.length + 1) {
            return 0;
          }
          return get.value(button.link);
        }).set("complexSelect", true).set("gains", gains2).forResult();
        if (result?.bool && result.links?.length) {
          await target.gain(result.links, "gain2");
        }
      }
      const gains = cards2.filterInD();
      if (gains?.length) {
        await player.gain(gains, "gain2");
      }
      game.countPlayer2((current) => current.removeTip(name), true);
      const [minChar, maxChar] = get.info("jsrg_new_zhengyi").getLirangList();
      if (minChar?.isIn()) {
        minChar.addTip(name, `${get.translation(name)} 唯一最少`);
        minChar.when({ global: "roundEnd" }).step(async (event2, trigger2, player2) => {
          player2.removeTip(name);
        });
      }
      if (maxChar?.isIn()) {
        maxChar.addTip(name, `${get.translation(name)} 唯一最多`);
        maxChar.when({ global: "roundEnd" }).step(async (event2, trigger2, player2) => {
          player2.removeTip(name);
        });
      }
    }
  },
  jsrg_new_zhengyi: {
    audio: "zhengyi",
    getLirangList() {
      let min = 114514, max = 0, minChar, maxChar;
      game.countPlayer2((current) => {
        let num = 0;
        game.getRoundHistory("everything", (evt) => {
          if (evt.name != "gain" || evt.player != current || evt.getParent().name != "jsrg_new_lirang" || !evt?.cards?.length) {
            return false;
          }
          num += evt.cards.length;
        });
        if (num === 0) {
          return false;
        }
        if (num == max) {
          maxChar = null;
        }
        if (num > max) {
          maxChar = current;
          max = num;
        }
        if (num == min) {
          minChar = null;
        }
        if (num < min) {
          minChar = current;
          min = num;
        }
      }, true);
      return [minChar, maxChar];
    },
    global: "jsrg_new_zhengyi_global",
    subSkill: {
      global: {
        trigger: {
          global: "damageBegin3"
        },
        filter(event, player) {
          const [minChar, maxChar] = get.info("jsrg_new_zhengyi").getLirangList();
          if (event.player != minChar || player != maxChar) {
            return false;
          }
          return game.getGlobalHistory(
            "everything",
            (evt) => {
              return evt.name == "damage" && evt.player == event.player;
            },
            event
          ).indexOf(event) == 0;
        },
        check(event, player) {
          return get.damageEffect(player, event.source, player, event.nature) > get.damageEffect(event.player, event.source, player, event.nature);
        },
        prompt2(event) {
          return `代替其承受即将受到的${event.num}点伤害`;
        },
        logTarget: "player",
        async content(event, trigger, player) {
          trigger.cancel();
          const next = player.damage(trigger.source, trigger.nature, trigger.num);
          next.set("card", trigger.card);
          next.set("cards", trigger.cards);
          await next;
        }
      }
    },
    ai: { combo: "jsrglirang" }
  },
  //朱儁
  jsrgfendi: {
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return event.targets.length == 1 && event.card.name == "sha" && event.targets[0].countCards("h") > 0;
    },
    usable: 1,
    logTarget: "target",
    async cost(event, trigger, player) {
      const { target } = trigger;
      event.result = await player.choosePlayerCard(target, "h", [1, Infinity], `分敌：展示${get.translation(target)}的任意张手牌`, "allowChooseAll").set("ai", (button) => {
        if (_status.event.all) {
          return 1;
        }
        if (ui.selected.buttons.length) {
          return 0;
        }
        return Math.random();
      }).set("all", !target.mayHaveShan(player, "use") && Math.random() < 0.75).set("forceAuto", true).forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event, { target } = trigger;
      await target.showCards(cards2, get.translation(player) + "对" + get.translation(target) + "发动了【分敌】");
      target.addTempSkill("jsrgfendi_tag");
      target.addGaintag(cards2, "jsrgfendi_tag");
      target.markAuto("jsrgfendi_tag", [trigger.getParent()]);
      player.addTempSkill("jsrgfendi_gain");
      if (!trigger.card.storage) {
        trigger.card.storage = {};
      }
      trigger.card.storage.jsrgfendi = cards2.slice();
      player.storage.jsrgfendi_gain = target;
    },
    subSkill: {
      tag: {
        charlotte: true,
        onremove(player, skill) {
          player.removeGaintag(skill);
          delete player.storage[skill];
        },
        trigger: { global: "useCardAfter" },
        filter(event, player) {
          return player.getStorage("jsrgfendi_tag").includes(event);
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          player.unmarkAuto(event.name, [trigger]);
          if (!player.getStorage(event.name).length) {
            player.removeSkill(event.name);
          }
        },
        mod: {
          cardEnabled(card, player) {
            if (card.cards?.some((i) => !i.hasGaintag("jsrgfendi_tag"))) {
              return false;
            } else if (get.itemtype(card) == "card") {
              if (!card.hasGaintag("jsrgfendi_tag")) {
                return false;
              }
            }
          },
          cardRespondable(card, player) {
            return lib.skill.jsrgfendi_tag.mod.cardEnabled.apply(this, arguments);
          },
          cardSavable(card, player) {
            return lib.skill.jsrgfendi_tag.mod.cardEnabled.apply(this, arguments);
          }
        }
      },
      gain: {
        charlotte: true,
        onremove: true,
        trigger: { global: "damageSource" },
        filter(event, player) {
          if (!event.card?.storage) {
            return false;
          }
          const cards2 = event.card.storage.jsrgfendi;
          const target = player.storage.jsrgfendi_gain;
          if (!cards2 || !target?.isIn()) {
            return false;
          }
          const cardsx = target.getCards("h");
          cardsx.addArray(Array.from(ui.discardPile));
          return cards2.some((i) => cardsx.includes(i));
        },
        forced: true,
        popup: false,
        logTarget: (event, player) => player.storage.jsrgfendi_gain,
        async content(event, trigger, player) {
          const target = player.storage.jsrgfendi_gain;
          const cardsx = target.getCards("h");
          cardsx.addArray(Array.from(ui.discardPile));
          const cards2 = trigger.card.storage.jsrgfendi.filter((i) => cardsx.includes(i));
          await player.gain({
            cards: cards2,
            animate: "give"
          });
        }
      }
    }
  },
  jsrgjuxiang: {
    trigger: {
      player: "gainAfter",
      global: "loseAsyncAfter"
    },
    filter(event, player) {
      let evt = event.getParent("phaseDraw");
      if (evt && evt.name == "phaseDraw") {
        return false;
      }
      let hs = player.getCards("h");
      let cards2 = event.getg(player).filter((i) => hs.includes(i));
      if (!cards2.length) {
        return false;
      }
      for (let card of cards2) {
        if (!lib.filter.cardDiscardable(card, player, "jsrgjuxiang")) {
          return false;
        }
      }
      return true;
    },
    check(event, player) {
      let target = _status.currentPhase;
      if (!target || get.attitude(player, target) <= 0) {
        return false;
      }
      let evt = event.getParent("phaseDiscard"), evt2 = event.getParent("phaseJieshu");
      if (evt && evt.name == "phaseDiscard" || evt2 && evt.name == "phaseJieshu") {
        return false;
      }
      if (target.getCardUsable({ name: "sha" }) >= target.countCards("hs", "sha")) {
        return false;
      }
      if (!target.hasValueTarget({ name: "sha" })) {
        return false;
      }
      let hs = player.getCards("h");
      let cards2 = event.getg(player).filter((i) => hs.includes(i));
      let val = 0;
      for (let i of cards2) {
        val += get.value(i);
      }
      if (val < 10) {
        return true;
      }
      return false;
    },
    prompt2(event, player) {
      let hs = player.getCards("h");
      let cards2 = event.getg(player).filter((i) => hs.includes(i));
      let target = _status.currentPhase;
      let str = "弃置" + get.translation(cards2);
      if (target && target.isIn()) {
        let list = [];
        for (let card of cards2) {
          list.add(get.suit(card, player));
        }
        let num = list.length;
        str += "，然后令" + get.translation(target) + "于此回合额定的出牌阶段内使用【杀】的次数上限+" + num;
      }
      return str;
    },
    async content(event, trigger, player) {
      let hs = player.getCards("h");
      let cards2 = trigger.getg(player).filter((i) => hs.includes(i));
      let list = [];
      for (let card of cards2) {
        list.add(get.suit(card, player));
      }
      const num = list.length;
      await player.discard(cards2);
      let target = _status.currentPhase;
      if (target && target.isIn()) {
        target.addTempSkill("jsrgjuxiang_sha");
        target.addMark("jsrgjuxiang_sha", num, false);
        let evt = trigger.getParent("phaseUse");
        if (evt && evt.name == "phaseUse" && !evt.skill) {
          evt.player.addTempSkill("jsrgjuxiang_buff", "phaseUseAfter");
          evt.player.addMark("jsrgjuxiang_buff", num, false);
        }
      }
    },
    subSkill: {
      sha: {
        trigger: { global: "phaseUseBegin" },
        filter(event, player) {
          return !event.skill;
        },
        silent: true,
        charlotte: true,
        forced: true,
        onremove: true,
        async content(event, trigger, player) {
          trigger.player.addTempSkill("jsrgjuxiang_buff", "phaseUseAfter");
          trigger.player.addMark("jsrgjuxiang_buff", player.countMark("jsrgjuxiang_sha"), false);
        }
      },
      buff: {
        charlotte: true,
        intro: { content: "使用【杀】的次数上限+#" },
        onremove: true,
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.countMark("jsrgjuxiang_buff");
            }
          }
        }
      }
    }
  },
  //刘备
  jsrgjishan: {
    audio: 4,
    trigger: {
      source: "damageSource",
      global: "damageBegin4"
    },
    filter(event, player, name) {
      if (player.getStorage("jsrgjishan_used").includes(name)) {
        return false;
      }
      if (name == "damageBegin4") {
        return player.hp > 0;
      }
      return game.hasPlayer((current) => current.isMinHp() && player.getStorage("jsrgjishan").includes(current) && current.isDamaged());
    },
    async cost(event, trigger, player) {
      const { triggername, skill } = event, { player: target } = trigger;
      if (triggername == "damageBegin4") {
        const result = await player.chooseBool(get.prompt(skill, target), "失去1点体力并防止此伤害，然后你与其各摸一张牌").set("choice", get.info(skill).check(trigger, player)).forResult();
        event.result = {
          bool: result?.bool,
          targets: [target]
        };
      } else {
        event.result = await player.chooseTarget(get.prompt(skill), "令一名体力值最小且你对其发动过〖积善①〗的角色回复1点体力", (card, player2, target2) => {
          return target2.isMinHp() && player2.getStorage("jsrgjishan").includes(target2) && target2.isDamaged();
        }).set("ai", (target2) => {
          const player2 = get.player();
          return get.recoverEffect(target2, player2, player2);
        }).forResult();
      }
    },
    async content(event, trigger, player) {
      const {
        triggername,
        name,
        targets: [target]
      } = event;
      player.addTempSkill(name + "_used");
      player.markAuto(name + "_used", [triggername]);
      if (triggername == "damageBegin4") {
        player.markAuto(name, [target]);
        trigger.cancel();
        await player.loseHp();
        await game.asyncDraw([player, target].sortBySeat(_status.currentPhase));
      } else {
        await target.recover();
      }
    },
    onremove: true,
    check(event, player) {
      return get.damageEffect(event.player, event.source, _status.event.player, event.nature) * event.num < get.effect(player, { name: "losehp" }, player, _status.event.player) + get.effect(player, { name: "draw" }, player, _status.event.player) + get.effect(event.player, { name: "draw" }, player, _status.event.player) / 2;
    },
    logAudio(event, player, name) {
      if (name == "damageBegin4") {
        return ["jsrgjishan1.mp3", "jsrgjishan2.mp3"];
      }
      return ["jsrgjishan3.mp3", "jsrgjishan4.mp3"];
    },
    intro: { content: "已帮助$抵挡过伤害" },
    ai: { expose: 0.2 },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  jsrgzhenqiao: {
    audio: 2,
    trigger: { player: "useCardToTargeted" },
    forced: true,
    filter(event, player) {
      return event.isFirstTarget && event.card.name == "sha" && player.hasEmptySlot(1);
    },
    async content(event, trigger, player) {
      trigger.getParent().effectCount++;
    },
    mod: {
      attackRange(player, num) {
        return num + 1;
      },
      aiOrder: (player, card, num) => {
        if (num > 0 && get.itemtype(card) === "card" && get.subtype(card) === "equip1" && !player.getEquip(1)) {
          if (card.name !== "zhuge" || player.getCardUsable("sha") || !player.needsToDiscard() || player.countCards("hs", (i) => {
            return get.name(i) === "sha" && lib.filter.cardEnabled(i, player);
          }) < 2) {
            return 0;
          }
        }
      },
      aiValue: (player, card, num) => {
        if (num > 0 && get.itemtype(card) === "card" && card.name !== "zhuge" && get.subtype(card) === "equip1" && !player.getEquip(1)) {
          return 0.01 * num;
        }
      },
      aiUseful() {
        return lib.skill.jsrgzhenqiao.mod.aiValue.apply(this, arguments);
      }
    }
  },
  //王允
  jsrgshelun: {
    audio: 4,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h") && game.hasPlayer((current) => current != player);
    },
    filterTarget(card, player, target) {
      return player != target;
    },
    logAudio: (index) => typeof index === "number" ? "jsrgshelun" + index + ".mp3" : 2,
    async content(event, trigger, player) {
      const num = player.countCards("h"), target = event.targets[0], targets = game.filterPlayer((current) => {
        return current.countCards("h") <= num && current != target;
      });
      if (!targets?.length) {
        return;
      }
      await player.chooseToDebate(targets).set("callback", async (event2, trigger2, player2) => {
        let result = event2.debateResult;
        if (result.bool && result.opinion) {
          let opinion = result.opinion;
          let target2 = event2.getParent(2).target;
          if (opinion && ["red", "black"].includes(opinion)) {
            player2.logSkill("jsrgshelun", target2, null, null, [opinion == "red" ? 3 : 4]);
            if (opinion == "red") {
              player2.discardPlayerCard(target2, "he", true, 2);
            } else {
              await target2.damage(2);
            }
          }
        }
      }).set("ai", (card) => {
        let player2 = _status.event.player;
        let color = player2 == _status.event.source || get.damageEffect(_status.event.getParent(2).target, player2, player2) > 0 ? "black" : "red";
        let val = 5 - get.value(card);
        if (get.color(card) == color) {
          val += 10;
        }
        return val;
      }).set("aiCard", (target2) => {
        let color = target2 == _status.event.source || get.damageEffect(_status.event.getParent(2).target, target2, target2) > 0 ? "black" : "red";
        let hs = target2.getCards("h", { color });
        if (!hs.length) {
          hs = target2.getCards("h");
        }
        return { bool: true, cards: [hs.randomGet()] };
      }).set("target", target);
    },
    ai: {
      order: 8,
      expose: 0.2,
      result: { target: -1 }
    }
  },
  jsrgfayi: {
    audio: 2,
    trigger: { global: "chooseToDebateAfter" },
    filter(event, player) {
      if (!event.targets.includes(player)) {
        return false;
      }
      if (event.red.map((i) => i[0]).includes(player)) {
        return event.black.length;
      }
      if (event.black.map((i) => i[0]).includes(player)) {
        return event.red.length;
      }
      return false;
    },
    async cost(event, trigger, player) {
      let targets = [];
      if (trigger.red.map((i) => i[0]).includes(player)) {
        targets = trigger.black;
      }
      if (trigger.black.map((i) => i[0]).includes(player)) {
        targets = trigger.red;
      }
      event.result = await player.chooseTarget(get.prompt2(event.skill), [1, Infinity], (card, player2, target) => {
        return _status.event.targets.includes(target);
      }).set(
        "targets",
        targets.map((i) => i[0])
      ).set("ai", (target) => {
        const player2 = _status.event.player;
        return get.damageEffect(target, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const func = async (target) => await target.damage();
      await game.doAsyncInOrder(event.targets, func);
    },
    ai: {
      combo: "jsrgshelun"
    }
  },
  jsrgtushe: {
    audio: "xinfu_tushe",
    mod: {
      aiOrder(player, card, num) {
        if (get.tag(card, "multitarget")) {
          if (player.countCards("h", { type: "basic" })) {
            return num / 10;
          }
          return num * 10;
        }
        if (get.type(card) === "basic") {
          return num + 10;
        }
      },
      aiValue(player, card, num) {
        if (card.name === "zhangba") {
          return 114514;
        }
        if (["shan", "tao", "jiu"].includes(card.name)) {
          if (player.getEquip("zhangba") && player.countCards("hs") > 1) {
            return 0.01;
          }
          return num / 2;
        }
        if (get.tag(card, "multitarget")) {
          return num + game.players.length;
        }
      },
      aiUseful(player, card, num) {
        if (card.name === "zhangba") {
          return 114514;
        }
        if (get.name(card, player) === "shan") {
          if (player.countCards("hs", (i) => {
            if (card === i || card.cards && card.cards.includes(i)) {
              return false;
            }
            return get.name(i, player) === "shan";
          })) {
            return -1;
          }
          return num / Math.pow(Math.max(1, player.hp), 2);
        }
      }
    },
    trigger: {
      player: "useCardToPlayered"
    },
    filter(event, player) {
      if (get.type(event.card) == "equip") {
        return false;
      }
      if (event.getParent().triggeredTargets3.length > 1) {
        return false;
      }
      return event.targets.length > 0;
    },
    check(event, player) {
      return !player.countCards("h", { type: "basic" });
    },
    locked: false,
    frequent: true,
    async content(event, trigger, player) {
      await player.showHandcards();
      if (player.countCards("h", { type: "basic" })) {
        return;
      }
      const result = await player.chooseBool({
        prompt: `图射：是否摸${get.cnNumber(trigger.targets.length)}张牌？`,
        ai() {
          return 1;
        }
      }).forResult();
      if (result.bool) {
        await player.draw(trigger.targets.length);
      }
    },
    ai: {
      presha: true,
      pretao: true,
      threaten: 1.8,
      effect: {
        player_use(card, player, target) {
          if (typeof card === "object" && card.name !== "shan" && get.type(card) !== "equip" && !player.countCards("h", (i) => {
            if (card === i || card.cards && card.cards.includes(i)) {
              return false;
            }
            return get.type(i) === "basic";
          })) {
            let targets = [], evt = _status.event.getParent("useCard");
            targets.addArray(ui.selected.targets);
            if (evt && evt.card == card) {
              targets.addArray(evt.targets);
            }
            if (targets.length) {
              return [1, targets.length];
            }
            if (get.tag(card, "multitarget")) {
              return [1, game.players.length - 1];
            }
            return [1, 1];
          }
        }
      }
    }
  },
  jsrgtongjue: {
    enable: "phaseUse",
    usable: 1,
    zhuSkill: true,
    filter(event, player) {
      return player.hasZhuSkill("jsrgtongjue") && game.hasPlayer((current) => current != player && current.group == "qun");
    },
    filterCard: true,
    selectCard: [1, Infinity],
    filterTarget(card, player, target) {
      return target != player && target.group == "qun";
    },
    selectTarget: [1, Infinity],
    filterOk() {
      return ui.selected.cards.length == ui.selected.targets.length;
    },
    check(card) {
      let player = _status.event.player;
      if (player.hasCard((card2) => {
        return player.hasValueTarget(card2);
      }, "hs")) {
        return 3 - player.getUseValue(card);
      }
      return 3 - get.value(card);
    },
    multiline: true,
    multitarget: true,
    delay: false,
    discard: false,
    lose: false,
    async content(event, trigger, player) {
      const { cards: cards2, targets } = event;
      let list = [];
      for (let i = 0; i < targets.length; i++) {
        let target = targets[i];
        let card = cards2[i];
        list.push([target, card]);
      }
      await game.loseAsync({
        gain_list: list,
        player,
        cards: cards2,
        giver: player,
        animate: "giveAuto"
      }).setContent("gaincardMultiple");
      player.addTempSkill("jsrgtongjue_blocker");
      player.markAuto("jsrgtongjue_blocker", targets);
    },
    ai: {
      order: 5,
      result: {
        target: 1
      }
    },
    subSkill: {
      blocker: {
        charlotte: true,
        onremove: true,
        mod: {
          playerEnabled(card, player, target) {
            if (player.getStorage("jsrgtongjue_blocker").includes(target)) {
              return false;
            }
          }
        },
        mark: true,
        intro: { content: "$已经立牧自居，不可接近" }
      }
    }
  },
  //404曹操
  jsrgzhenglve: {
    audio: 4,
    trigger: { global: "phaseEnd" },
    isFirst(player) {
      let bool = function(target) {
        if (game.hasPlayer((current) => current.getSeatNum() > 0)) {
          return target.getSeatNum() == 1;
        }
        return target == _status.roundStart;
      };
      return game.filterPlayer((target) => {
        switch (get.mode()) {
          case "identity":
            return target.isZhu;
          case "guozhan":
            return get.is.jun(target);
          case "versus": {
            if (["three", "four", "guandu"].includes(_status.mode)) {
              return target.identity == "zhu";
            }
            return bool(target);
          }
          case "doudizhu":
          case "boss":
            return target.identity == "zhu";
          default:
            return bool(target);
        }
      }).includes(player);
    },
    filter(event, player) {
      return get.info("jsrgzhenglve").isFirst(event.player);
    },
    locked: false,
    group: "jsrgzhenglve_damage",
    prompt2(event, player) {
      const num = Math.min(
        event.player.hasHistory("sourceDamage") ? 1 : 2,
        game.countPlayer((current) => !current.hasMark("jsrgzhenglve_mark"))
      );
      let str = `你可以摸一张牌`;
      if (num) {
        str += `并令${get.cnNumber(num)}名角色获得“猎”标记`;
      }
      return str;
    },
    drawNum: 1,
    logAudio: () => 2,
    async content(event, trigger, player) {
      await player.draw(lib.skill[event.name].drawNum);
      const damaged = trigger.player.hasHistory("sourceDamage");
      const num = damaged ? 1 : 2;
      const targets = game.filterPlayer((current) => !current.hasMark("jsrgzhenglve_mark"));
      if (!targets.length) {
        return;
      }
      const result = targets.length <= num ? { bool: true, targets } : await player.chooseTarget("令" + (num > 1 ? "至多" : "") + get.cnNumber(num) + "名角色获得“猎”标记", true, [1, num], (card, player2, target) => {
        return !target.hasMark("jsrgzhenglve_mark");
      }).set("ai", (target) => {
        const att = get.attitude(get.player(), target);
        return 100 - att;
      }).forResult();
      if (result.bool) {
        const { targets: targets2 } = result;
        player.line(targets2);
        targets2.forEach((target) => target.addMark("jsrgzhenglve_mark", 1));
      }
    },
    mod: {
      cardUsableTarget(card, player, target) {
        if (target.hasMark("jsrgzhenglve_mark")) {
          return true;
        }
      },
      targetInRange(card, player, target) {
        if (target.hasMark("jsrgzhenglve_mark")) {
          return true;
        }
      }
    },
    subSkill: {
      damage: {
        audio: ["jsrgzhenglve3.mp3", "jsrgzhenglve4.mp3"],
        trigger: { source: "damageSource" },
        usable: 1,
        filter(event, player) {
          return event.player.hasMark("jsrgzhenglve_mark");
        },
        prompt2(event, player) {
          let cards2 = event.cards || [];
          return "摸一张牌" + (cards2.filterInD().length ? "并获得" + get.translation(event.cards.filterInD()) : "");
        },
        async content(event, trigger, player) {
          await player.draw();
          if (trigger.cards?.someInD()) {
            await player.gain(trigger.cards.filterInD(), "gain2");
          }
        }
      },
      mark: {
        marktext: "猎",
        intro: {
          name: "猎(政略)",
          name2: "猎",
          markcount: () => 0,
          content: "已拥有“猎”标记"
        }
      }
    }
  },
  jsrghuilie: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    juexingji: true,
    forced: true,
    skillAnimation: true,
    animationColor: "thunder",
    derivation: ["jsrgpingrong", "feiying"],
    filter(event, player) {
      return game.countPlayer((current) => current.hasMark("jsrgzhenglve_mark")) > 2;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.loseMaxHp();
      await player.addSkills(["jsrgpingrong", "feiying"]);
    },
    ai: {
      combo: ["jsrgzhenglve", "twzhenglve"]
    }
  },
  jsrgpingrong: {
    audio: 3,
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      return !player.hasSkill("jsrgpingrong_used") && game.hasPlayer((current) => current.hasMark("jsrgzhenglve_mark"));
    },
    logAudio: () => 2,
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "移去一名角色的“猎”，然后你执行一个额外回合。若你在此额外回合内未造成伤害，则你失去1点体力。", (card, player2, target) => {
        return target.hasMark("jsrgzhenglve_mark");
      }).set("ai", (target) => {
        return get.attitude(_status.event.player, target);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.addTempSkill("jsrgpingrong_used", "roundStart");
      target.removeMark("jsrgzhenglve_mark", target.countMark("jsrgzhenglve_mark"));
      player.insertPhase();
      player.addSkill("jsrgpingrong_check");
    },
    subSkill: {
      used: { charlotte: true },
      check: {
        charlotte: true,
        audio: "jsrgpingrong3.mp3",
        trigger: { player: "phaseAfter" },
        filter(event, player) {
          return event.skill == "jsrgpingrong" && !player.getHistory("sourceDamage").length;
        },
        forced: true,
        async content(event, trigger, player) {
          await player.loseHp();
        }
      }
    },
    ai: {
      combo: "jsrgzhenglve"
    }
  },
  //南华老仙
  jsrgshoushu: {
    locked: true,
    trigger: {
      //player:'enterGame',
      //global:'phaseBefore',
      global: "roundStart"
    },
    filter(event, player) {
      if (game.hasPlayer(function(current) {
        return current.countCards("hej", "taipingyaoshu");
      })) {
        return false;
      }
      return true;
    },
    group: "jsrgshoushu_destroy",
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt("jsrgshoushu"),
        prompt2: "将【太平要术】置入一名角色的装备区",
        filterTarget(card, player2, target) {
          return target.canEquip(get.event().cardx, true);
        },
        ai(target) {
          return target.getUseValue(get.event().cardx) * get.attitude(get.player(), target);
        }
      }).set("cardx", get.autoViewAs({ name: "taipingyaoshu" })).forResult();
    },
    logTarget: "targets",
    async content(event, trigger, player) {
      if (!lib.inpile.includes("taipingyaoshu")) {
        lib.inpile.push("taipingyaoshu");
      }
      const card = game.createCard2("taipingyaoshu", "heart", 3);
      if (card) {
        await event.targets[0].equip(card);
      }
    },
    subSkill: {
      destroy: {
        audio: "jsrgshoushu",
        trigger: {
          global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"]
        },
        forced: true,
        filter(event, player) {
          return game.hasPlayer((current) => {
            let evt = event.getl(current);
            if (evt && evt.es) {
              return evt.es.some((i) => i.name == "taipingyaoshu");
            }
            return false;
          });
        },
        async content(event, trigger, player) {
          const cards2 = game.filterPlayer().map((current) => trigger.getl(current)).filter((evt) => Array.isArray(evt?.es)).flatMap((evt) => evt.es.filter((card) => card.name === "taipingyaoshu"));
          await game.cardsGotoSpecial(cards2);
          game.log(cards2, "被销毁了");
        }
      }
    }
  },
  jsrgxundao: {
    trigger: { player: "judge" },
    filter(event, player) {
      return game.hasPlayer((current) => current.countCards("he"));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), `${get.translation(player)}（你）的${trigger.judgestr || ""}判定为${get.translation(player.judging[0])}，是否令至多两名角色依次弃置一张牌，然后选择其中一张作为新判定牌？`, [1, 2], (card, player2, target) => {
        return target.countCards("he");
      }).set("ai", (target) => {
        const { player: player2, todiscard } = get.event();
        if (!todiscard) {
          return 0;
        }
        if (todiscard != "all") {
          if (target == todiscard) {
            return 100;
          }
        }
        return get.effect(target, { name: "guohe_copy2" }, player2, player2) / 2;
      }).set(
        "todiscard",
        (() => {
          if (trigger.judgestr == "闪电" && get.damageEffect(player, null, player, "thunder") >= 0) {
            return "all";
          }
          let friends = game.filterPlayer((i) => get.attitude(i, player) > 0);
          for (let friend of friends) {
            let cardsx = friend.getCards("he", (card) => trigger.judge(card) > 0);
            cardsx.sort((a, b) => {
              return get.value(a) - get.value(b);
            });
            if (cardsx.length) {
              let card = cardsx[0];
              if (trigger.judge(player.judging[0]) >= 0) {
                if (get.value(card) > 4) {
                  return false;
                }
              }
              return get.owner(card);
            }
          }
          return "all";
        })()
      ).forResult();
    },
    async content(event, trigger, player) {
      let cards2 = [];
      for (const target of event.targets.sortBySeat(_status.currentPhase)) {
        if (!target.countDiscardableCards(target, "he")) {
          continue;
        }
        const result2 = await target.chooseToDiscard(`寻道：请弃置一张牌${target == player ? "" : "，可能被作为新判定牌"}`, "he", true).set("ai", (card2) => {
          const trigger2 = get.event().getTrigger();
          const { player: player2, judging } = get.event();
          const result3 = trigger2.judge(card2) - trigger2.judge(judging);
          const attitude = get.attitude(player2, trigger2.player);
          if (attitude == 0 || result3 == 0) {
            return 0.1;
          }
          if (attitude > 0) {
            return result3 + 0.01;
          } else {
            return 0.01 - result3;
          }
        }).set("judging", player.judging[0]).forResult();
        if (result2?.cards?.length) {
          cards2.addArray(result2.cards);
        }
      }
      cards2 = cards2.filterInD("d");
      if (!cards2.length) {
        return;
      }
      const result = cards2.length == 1 ? { links: cards2 } : await player.chooseButton(["寻道：选择一张作为新判定牌", cards2], true).set("ai", (button) => {
        return get.event().getTrigger().judge(button.link);
      }).forResult();
      if (!result?.links?.length) {
        return;
      }
      const [card] = result.links;
      await game.cardsGotoOrdering(card).set("relatedEvent", trigger);
      if (player.judging[0].clone) {
        game.broadcastAll(
          function(card2, card22, player2) {
            if (card2.clone) {
              card2.clone.classList.remove("thrownhighlight");
            }
            let node = player2.$throwordered(card22.copy(), true);
            node.classList.add("thrownhighlight");
            ui.arena.classList.add("thrownhighlight");
          },
          player.judging[0],
          card,
          player
        );
        game.addVideo("deletenode", player, get.cardsInfo([player.judging[0].clone]));
      }
      await game.cardsDiscard(player.judging[0]);
      player.judging[0] = card;
      trigger.orderingCards.add(card);
      game.log(player, "的判定牌改为", card);
      await game.delay(2);
    },
    ai: {
      rejudge: true,
      tag: { rejudge: 1 }
    }
  },
  jsrglinghua: {
    trigger: {
      player: ["phaseZhunbeiBegin", "phaseJieshuBegin"]
    },
    prompt2(event, player) {
      let zhunbei = event.name == "phaseZhunbei";
      return "进行目标为你" + (zhunbei ? "" : "且效果反转") + "的【闪电】判定。若你未因此受到伤害，你可以" + (zhunbei ? "令一名角色回复1点体力" : "对一名角色造成1点雷电伤害");
    },
    check(event, player) {
      let e2 = player.getEquip(2);
      if (e2 && e2.name == "taipingyaoshu") {
        return true;
      }
      if (event.name == "phaseZhunbei" && game.hasPlayer((current) => {
        return get.recoverEffect(current, player, player) >= 0;
      })) {
        return true;
      }
      if (event.name == "phaseJieshu" && game.hasPlayer((current) => {
        return get.damageEffect(current, player, player, "thunder") >= 0;
      }) && player.hasSkillTag("rejudge") && player.hasCard((card) => {
        return lib.card.shandian.judge(card) < 0;
      }, "he")) {
        return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      const next = player.executeDelayCardEffect("shandian");
      if (trigger.name == "phaseJieshu") {
        next.judge = (card) => -lib.card.shandian.judge(card) - 4;
        next.judge2 = (result) => !lib.card.shandian.judge2(result);
      }
      await next;
      if (!player.hasHistory("damage", (evt) => evt.getParent(2) == next)) {
        let result;
        if (trigger.name == "phaseJieshu") {
          result = await player.chooseTarget("灵化：是否对一名角色造成1点雷电伤害？").set("ai", (target) => {
            const player2 = get.player();
            return get.damageEffect(target, player2, player2, "thunder");
          }).forResult();
        } else if (game.hasPlayer((current) => current.isDamaged())) {
          result = await player.chooseTarget("灵化：是否令一名角色回复1点体力？", (card, player2, target) => {
            return target.isDamaged();
          }).set("ai", (target) => {
            const player2 = get.player();
            return get.recoverEffect(target, player2, player2);
          }).forResult();
        }
        if (result?.targets?.length) {
          const [target] = result.targets;
          player.line(target);
          if (trigger.name == "phaseZhunbei") {
            await target.recover();
          } else {
            await target.damage("thunder");
          }
        }
      }
    },
    ai: { threaten: 2.8 }
  },
  //江山如故·兴
  //贾南风
  jsrgshanzheng: {
    audio: 4,
    logAudio: (index) => typeof index === "number" ? "jsrgshanzheng" + index + ".mp3" : 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => current != player);
    },
    filterTarget: lib.filter.notMe,
    selectTarget: [1, Infinity],
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      await player.chooseToDebate(
        game.filterPlayer((current) => {
          return current == player || event.targets.includes(current);
        })
      ).set("callback", lib.skill.jsrgshanzheng.callback);
    },
    async callback(event, trigger, player) {
      const result = event.debateResult;
      if (result.bool && result.opinion) {
        if (result.opinion == "red") {
          const targets = game.filterPlayer((current) => !result.targets.includes(current));
          if (!targets.length) {
            return;
          }
          const resultx = await player.chooseTarget("擅政：你可以对一名未参与议事的角色造成1点伤害", (card, player2, target) => {
            return get.event().targets.includes(target);
          }).set("targets", targets).set("ai", (target) => {
            const player2 = get.player();
            return get.damageEffect(target, player2, player2);
          }).forResult();
          if (resultx?.bool) {
            player.logSkill("jsrgshanzheng", resultx.targets, null, null, [3]);
            player.line(resultx.targets.sortBySeat(), "green");
            for (const target of resultx.targets.sortBySeat()) {
              await target.damage();
            }
          }
        } else if (result.opinion == "black") {
          const cards2 = [], targets = [];
          for (const color of result.opinions) {
            if (result[color]?.length) {
              cards2.addArray(result[color].map((i) => i[1]).filter((card) => get.itemtype(card) == "card"));
              targets.addArray(result[color].map((i) => i[0]));
            }
          }
          targets.remove(player);
          player.logSkill("jsrgshanzheng", targets, null, null, [4]);
          if (cards2.length) {
            await player.gain(cards2, "give");
          }
        }
      }
    },
    ai: {
      order: 8,
      result: {
        target(player, target) {
          return 0.5 - Math.random();
        }
      }
    }
  },
  jsrgxiongbao: {
    audio: 2,
    trigger: { global: "chooseToDebateBegin" },
    filter(event, player) {
      if (!event.list.includes(player)) {
        return false;
      }
      if (event.fixedResult?.some((key) => key[0] == player)) {
        return false;
      }
      return player.countCards("h") > 1;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard(get.prompt2(event.skill), 2).set("ai", (card) => {
        let val = 6 - get.value(card);
        if (!ui.selected.cards.length) {
          if (player.hasCard((cardx) => card != cardx && get.color(cardx) == get.color(card)), "h") {
            val += 3;
          }
          return val;
        }
        if (get.color(card) == get.color(ui.selected.cards[0])) {
          val += 3;
        }
        return val;
      }).forResult();
    },
    async content(event, trigger, player) {
      if (!Array.isArray(trigger.fixedResult)) {
        trigger.fixedResult = [];
      }
      trigger.fixedResult.push([player, event.cards[0]]);
      trigger.fixedResult.push([player, event.cards[1]]);
      for (const current of trigger.list) {
        if (current == player || !current.countCards("h")) {
          continue;
        }
        player.line(current, "thunder");
        trigger.fixedResult.push([current, current.getCards("h").randomGet()]);
      }
    }
  },
  jsrgliedu: {
    audio: 2,
    forced: true,
    trigger: {
      player: "useCard"
    },
    filter(event, player) {
      return game.hasPlayer(function(current) {
        return current != player && (current.hasSex("female") || current.countCards("h") > player.countCards("h"));
      });
    },
    async content(event, trigger, player) {
      trigger.directHit.addArray(
        game.filterPlayer(function(current) {
          return current != player && (current.hasSex("female") || current.countCards("h") > player.countCards("h"));
        })
      );
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        return arg.target.hasSex("female") || arg.target.countCards("h") > player.countCards("h");
      }
    }
  },
  //文鸯
  jsrgfuzhen: {
    audio: 4,
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    filter(event, player) {
      return game.hasPlayer((current) => player.canUse({ name: "sha", nature: "thunder", isCard: true }, current, false));
    },
    async cost(event, trigger, player) {
      const result = await player.chooseTarget(get.prompt(event.skill), "视为对至多三名其他角色使用一张雷【杀】（选择的第一名目标为秘密目标）").set("filterTarget", function(card, player2, target) {
        return player2.canUse({ name: "sha", nature: "thunder", isCard: true }, target, false);
      }).set("selectTarget", [1, 3]).set("complexTarget", true).set("ai", (target) => {
        const player2 = get.player();
        if (player2.hp <= 1) {
          return 0;
        }
        let eff = get.effect(target, { name: "sha", nature: "thunder", isCard: true }, player2, player2);
        if (!ui.selected.targets.length && !target.mayHaveShan(player2, "use")) {
          eff *= 2;
        }
        return eff;
      }).set("targetprompt", ["秘密目标", "出杀目标"]).forResult();
      if (result.bool) {
        event.result = {
          bool: true,
          cost_data: result.targets[0],
          targets: result.targets.sortBySeat()
        };
      } else {
        event.result = { bool: false };
      }
    },
    logAudio: (index) => typeof index == "number" ? "jsrgfuzhen" + index + ".mp3" : 2,
    async content(event, trigger, player) {
      const targets = event.targets, silentTarget = event.cost_data;
      await player.loseHp();
      const card = get.autoViewAs({ name: "sha", nature: "thunder", isCard: true });
      player.when("useCardAfter").filter((evt) => evt.getParent() == event).step(async (event2, trigger2, player2) => {
        player2.logSkill("jsrgfuzhen", null, null, null, [get.rand(3, 4)]);
        const sum = player2.getHistory("sourceDamage", (evt) => evt.card && evt.card == trigger2.card).reduce((num, evt) => {
          return num + evt.num;
        }, 0);
        if (sum) {
          await player2.draw(sum);
        }
        player2.line(silentTarget, "green");
        game.log(player2, "选择的秘密目标是", silentTarget);
        await game.delay();
        if (silentTarget && !silentTarget.getHistory("damage", (evt) => evt.card == trigger2.card).length) {
          const cardx = get.autoViewAs({ name: "sha", nature: "thunder", isCard: true });
          const targetx = targets.filter((target) => target.isIn() && player2.canUse(cardx, target, false));
          if (targetx.length) {
            await player2.useCard(cardx, targets);
          }
        }
      });
      await player.useCard(card, targets).set("forceDie", true);
    }
  },
  //诞神
  jsrgbeizhi: {
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return player.canCompare(target);
    },
    filter(event, player) {
      return player.countCards("h") > 0 && game.hasPlayer((current) => lib.skill.jsrgbeizhi.filterTarget(null, player, current));
    },
    async content(event, trigger, player) {
      const result = await player.chooseToCompare(event.target).forResult();
      if (result.winner) {
        const winner = result.winner, target = winner == player ? event.target : player, card = { name: "juedou", isCard: true };
        if (!winner.canUse(card, target)) {
          return;
        }
        let targets = game.filterPlayer((current) => winner.canUse(card, current));
        if (targets.length > 3) {
          const result2 = await winner.chooseTarget("悖志：选择使用【决斗】的目标", true, 3).set("filterTarget", (card2, player2, target2) => {
            if (!ui.selected.targets.length) {
              return target2 == get.event().targetx;
            }
            return get.event().useTargets.includes(target2);
          }).set("complexTarget", true).set("targetx", target).set("useTargets", targets).set("ai", (target2) => {
            const player2 = get.player();
            return get.effect(target2, { name: "juedou", isCard: true }, player2, player2);
          }).forResult();
          targets = result2.targets;
        }
        winner.addTempSkill("jsrgbeizhi_effect");
        await winner.useCard(card, targets);
        winner.removeSkill("jsrgbeizhi_effect");
      }
    },
    subSkill: {
      effect: {
        trigger: {
          global: "damageSource"
        },
        forced: true,
        direct: true,
        charlotte: true,
        filter(event, player) {
          if (!event.source || !event.source.isIn()) {
            return false;
          }
          if (!event.player.isIn() || !event.player.countGainableCards(event.source, "he")) {
            return false;
          }
          return event.card?.name == "juedou" && event.getParent("jsrgbeizhi", true);
        },
        async content(event, trigger, player) {
          await trigger.source.gainPlayerCard(trigger.player, "he", true);
        }
      }
    },
    ai: {
      order: 7,
      result: {
        target(player, target) {
          let hs = player.getCards("h").sort(function(a, b) {
            return get.number(b) - get.number(a);
          });
          let ts = target.getCards("h").sort(function(a, b) {
            return get.number(b) - get.number(a);
          });
          if (!hs.length || !ts.length) {
            return 0;
          }
          if (get.number(hs[0]) > get.number(ts[0]) || get.number(hs[0]) - ts.length >= 9 + Math.min(2, player.hp / 2)) {
            return get.sgnAttitude(player, target) * get.damageEffect(target, player, player);
          }
          return 0;
        }
      }
    }
  },
  jsrgshenji: {
    trigger: { global: "useCardToTargeted" },
    filter(event, player) {
      if (!event.targets || event.targets.length <= 1) {
        return false;
      }
      if (event.targets.length != event.getParent().triggeredTargets4.length) {
        return false;
      }
      return event.targets.includes(player);
    },
    forced: true,
    logTarget: "player",
    async content(event, trigger, player) {
      const evt = trigger.getParent();
      evt.targets = [...evt.targets.remove(player), player];
      evt.triggeredTargets4 = [...evt.triggeredTargets4.remove(player), player];
    }
  },
  //王濬
  jsrgchengliu: {
    audio: 2,
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    filter(event, player) {
      return game.hasPlayer((current) => current.countCards("e") < player.countCards("e"));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return target.countCards("e") < player2.countCards("e");
      }).set("ai", (target) => {
        return get.damageEffect(target, get.player(), get.player());
      }).forResult();
    },
    async content(event, trigger, player) {
      let target = event.targets[0], targets = [];
      while (target.isIn()) {
        const num = player.getHistory("useSkill", (evt) => evt.skill == event.name).length;
        await target.damage(num);
        targets.add(target);
        if (!player.countDiscardableCards(player, "e")) {
          return;
        }
        const result = await player.chooseToDiscard(`是否弃置装备区里的一张牌？`, "e").set("ai", (card) => {
          if (get.event().goon) {
            return 10 - get.value(card);
          }
          return 0;
        }).set(
          "goon",
          (function() {
            return game.hasPlayer((current) => {
              if (targets.includes(current)) {
                return false;
              }
              return current.countCards("e") + 1 < player.countCards("e") && get.damageEffect(current, player, player) > 0;
            });
          })()
        ).forResult();
        if (result.bool) {
          if (!game.hasPlayer((current) => current.countCards("e") < player.countCards("e"))) {
            break;
          }
          const result2 = await player.chooseTarget(`###是否继续发动〖乘流〗？###对装备区牌数小于你的一名角色造成${num + 1}点伤害`, (card, player2, target2) => {
            if (get.event().targets.includes(target2)) {
              return false;
            }
            return target2.countCards("e") < player2.countCards("e");
          }).set("targets", targets).set("ai", (target2) => {
            return get.damageEffect(target2, get.player(), get.player());
          }).forResult();
          if (result2.bool) {
            await player.logSkill(event.name, result2.targets);
            target = result2.targets[0];
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }
  },
  jsrgjianlou: {
    audio: 2,
    trigger: {
      global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"]
    },
    filter(event, player) {
      if (!player.countCards("he")) {
        return false;
      }
      if (!event.getd || !event.getl) {
        return false;
      }
      let cards2 = event.getd();
      return cards2.some((card) => {
        if (get.position(card) != "d") {
          return false;
        }
        if (get.type(card) != "equip") {
          return false;
        }
        if (!player.canEquip(card, true)) {
          return false;
        }
        return game.hasPlayer((current) => {
          let evt = event.getl(current);
          if (!(evt?.es?.includes(card) || evt?.js?.includes(card))) {
            return false;
          }
          if (card.willBeDestroyed("discardPile", current, event)) {
            return false;
          }
          return true;
        });
      });
    },
    usable: 1,
    async cost(event, trigger, player) {
      const cards2 = trigger.getd().filter((card) => {
        if (get.type(card) != "equip") {
          return false;
        }
        if (!player.canEquip(card, true)) {
          return false;
        }
        return game.hasPlayer((current) => {
          let evt = trigger.getl(current);
          if (evt?.es?.includes(card)) {
            return true;
          }
          if (evt?.js?.includes(card)) {
            return true;
          }
          return false;
        });
      });
      const result = await player.chooseButton([get.prompt2(event.skill), cards2]).set("ai", (button) => {
        const player2 = get.player();
        return get.equipValue(button.link, player2);
      }).forResult();
      event.result = {
        bool: result.bool,
        cards: result?.links
      };
    },
    async content(event, trigger, player) {
      const card = event.cards[0];
      await player.chooseToDiscard(`舰楼：弃置一张牌并获得${get.translation(card)}`, "he", true).set("ai", (card2) => {
        const cardx = get.event().cardx;
        if (get.position(card2) == "e" && get.subtype(card2) == get.subtype(cardx)) {
          return 15 - get.value(card2);
        }
        return get.equipValue(card2) - get.value(card2);
      }).set("cardx", card).forResult();
      await player.gain(card, "gain2");
      if (!player.countCards("e", (cardx) => get.subtype(cardx) == get.subtype(card)) && player.canEquip(card)) {
        await game.delayx();
        player.$give(card, player, false);
        await player.equip(card);
      }
    }
  },
  //李密
  jsrgciyin: {
    audio: 3,
    enable: ["chooseToUse", "chooseToRespond"],
    filter(event, player) {
      if (!player.countCards("hes") || player.hasSkill("jsrgciyin_used")) {
        return false;
      }
      if (!event.ciyin_suits || player.countCards("hes") < Math.max(4 - event.ciyin_suits.length, 1)) {
        return false;
      }
      for (let i of lib.inpile) {
        let type = get.type(i);
        if (type == "basic" && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
          return true;
        }
      }
      return false;
    },
    onChooseToUse(event) {
      if (game.online) {
        return;
      }
      let suits = [];
      game.getGlobalHistory("cardMove", function(evt) {
        if (suits.length >= 3) {
          return;
        }
        if (evt.name == "lose") {
          if (evt.position == ui.discardPile) {
            for (let i of evt.cards) {
              suits.add(get.suit(i, false));
            }
          }
        } else {
          if (evt.name == "cardsDiscard") {
            for (let i of evt.cards) {
              suits.add(get.suit(i, false));
            }
          }
        }
      });
      event.set("ciyin_suits", suits);
    },
    onChooseToRespond(event) {
      if (game.online) {
        return;
      }
      let suits = [];
      game.getGlobalHistory("cardMove", function(evt) {
        if (suits.length >= 3) {
          return;
        }
        if (evt.name == "lose") {
          if (evt.position == ui.discardPile) {
            for (let i of evt.cards) {
              suits.add(get.suit(i, false));
            }
          }
        } else {
          if (evt.name == "cardsDiscard") {
            for (let i of evt.cards) {
              suits.add(get.suit(i, false));
            }
          }
        }
      });
      event.set("ciyin_suits", suits);
    },
    chooseButton: {
      dialog(event, player) {
        let list = [];
        for (let i = 0; i < lib.inpile.length; i++) {
          let name = lib.inpile[i];
          if (name == "sha") {
            if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
              list.push(["基本", "", "sha"]);
            }
            for (let nature of lib.inpile_nature) {
              if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
                list.push(["基本", "", "sha", nature]);
              }
            }
          } else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
            list.push(["基本", "", name]);
          }
        }
        return ui.create.dialog("辞应", [list, "vcard"]);
      },
      check(button) {
        if (_status.event.getParent().type != "phase") {
          return 1;
        }
        let player = _status.event.player;
        if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) {
          return 0;
        }
        return player.getUseValue({
          name: button.link[2],
          nature: button.link[3]
        }) - 3;
      },
      backup(links, player) {
        return {
          filterCard: true,
          selectCard() {
            const num = Math.max(4 - _status.event.ciyin_suits.length, 1);
            return [num, Infinity];
          },
          audio: ["jsrgciyin1.mp3", "jsrgciyin2.mp3"],
          ai1(card) {
            const suits = _status.event.ciyin_suits;
            if (!suits.includes(get.suit(card))) {
              return 15 - get.value(card);
            }
            return 4 - get.value(card);
          },
          position: "hes",
          viewAs: { name: links[0][2], nature: links[0][3] },
          allowChooseAll: true,
          async precontent(event, trigger, player2) {
            player2.addTempSkill("jsrgciyin_used");
          }
        };
      },
      prompt(links, player) {
        const num = Math.max(4 - _status.event.ciyin_suits.length, 1);
        return "将至少" + get.cnNumber(num) + "张牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用或打出";
      }
    },
    hiddenCard(player, name) {
      if (!lib.inpile.includes(name)) {
        return false;
      }
      let type = get.type(name);
      return type == "basic" && player.countCards("seh") > 0 && !player.hasSkill("jsrgciyin_used");
    },
    ai: {
      fireAttack: true,
      respondSha: true,
      respondShan: true,
      skillTagFilter(player) {
        if (!player.countCards("hes") || player.hasSkill("jsrgciyin_used")) {
          return false;
        }
      },
      order: 1,
      result: {
        player(player) {
          if (_status.event.dying) {
            return get.attitude(player, _status.event.dying);
          }
          return 1;
        }
      }
    },
    group: "jsrgciyin_draw",
    subSkill: {
      draw: {
        audio: "jsrgciyin3.mp3",
        trigger: { global: ["cardsDiscardAfter"] },
        forced: true,
        filter(event, player) {
          const evt = event.getParent();
          if (evt.name != "orderingDiscard") {
            return false;
          }
          const evtx = evt.relatedEvent || evt.getParent();
          if (evtx.skill != "jsrgciyin_backup" || evtx.player != player) {
            return false;
          }
          let suits = [];
          game.getGlobalHistory("cardMove", function(evt2) {
            if (suits.length >= 4) {
              return;
            }
            if (evt2.name == "lose") {
              if (evt2.position == ui.discardPile) {
                for (let i of evt2.cards) {
                  suits.add(get.suit(i, false));
                }
              }
            } else {
              if (evt2.name == "cardsDiscard") {
                for (let i of evt2.cards) {
                  suits.add(get.suit(i, false));
                }
              }
            }
          });
          return suits.length >= 4 && player.countCards("h") < player.maxHp;
        },
        async content(event, trigger, player) {
          await player.drawTo(player.maxHp);
        }
      },
      backup: {},
      used: {
        charlotte: true
      }
    }
  },
  jsrgchendu: {
    audio: 2,
    trigger: {
      global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"]
    },
    locked: true,
    filter(event, player, name) {
      if (name == "cardsDiscardAfter") {
        const evt2 = event.getParent();
        if (evt2.name != "orderingDiscard") {
          return false;
        }
        const evtx = evt2.relatedEvent || evt2.getParent();
        if (!["useCard", "respond"].includes(evtx.name) || evtx.player != player) {
          return false;
        }
        return event.cards.filterInD("d").length > player.hp;
      }
      if (event.type != "discard" || event.getlx === false) {
        return false;
      }
      let evt = event.getl(player);
      if (!evt || !evt.cards2 || !evt.cards2.length) {
        return false;
      }
      return evt.cards2.length > player.hp;
    },
    async cost(event, trigger, player) {
      const cards2 = trigger.getd().filterInD("d");
      let map = {}, targetx = [];
      if (_status.connectMode) {
        game.broadcastAll(function() {
          _status.noclearcountdown = true;
        });
      }
      do {
        const { bool, links } = cards2.length == 1 ? { links: cards2.slice(0), bool: true } : await player.chooseCardButton("陈笃：请选择要分配的牌", true, cards2, [1, cards2.length]).set("ai", (button) => {
          if (ui.selected.buttons.length == 0) {
            return 20 - get.value(button.link);
          }
          return 0;
        }).forResult();
        if (!bool) {
          return;
        }
        cards2.removeArray(links);
        const togive = links.slice(0);
        const { targets } = await player.chooseTarget("选择一名角色获得" + get.translation(links), true).set("filterTarget", (card, player2, target) => {
          if (player2 != _status.currentPhase && !get.event().gived) {
            if (target != _status.currentPhase) {
              return false;
            }
          }
          return target != player2;
        }).set("gived", targetx.length > 0).set("ai", (target) => {
          const att = get.attitude(_status.event.player, target);
          if (_status.event.enemy) {
            return -att;
          } else if (att > 0) {
            return att / (1 + target.countCards("h"));
          } else {
            return att / 100;
          }
        }).set("enemy", get.value(togive[0], player, "raw") < 0).forResult();
        if (targets.length) {
          targetx.addArray(targets);
          const playerid = targets[0].playerid;
          if (!map[playerid]) {
            map[playerid] = [];
          }
          map[playerid].addArray(togive);
        }
      } while (cards2.length > 0);
      if (_status.connectMode) {
        game.broadcastAll(function() {
          delete _status.noclearcountdown;
          game.stopCountChoose();
        });
      }
      const list = [];
      for (const i in map) {
        const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
        list.push([source, map[i]]);
      }
      event.result = {
        bool: true,
        targets: targetx,
        cost_data: list
      };
    },
    async content(event, trigger, player) {
      const list = event.cost_data;
      await game.loseAsync({
        gain_list: list,
        player,
        cards: list.map((i) => i[1]).flat(),
        giver: player,
        animate: "gain2"
      }).setContent("gaincardMultiple");
    }
  },
  //司马昭
  jsrgqiantun: {
    audio: 4,
    logAudio: (index) => typeof index === "number" ? "jsrgqiantun" + index + ".mp3" : 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return player.canCompare(target) && target.countCards("h") && target != player;
    },
    async content(event, trigger, player) {
      const target = event.target, cards2 = target.getCards("h").sort((a, b) => get.number(a, target) - get.number(b, target));
      const result = await target.chooseCard("展示任意张手牌，只能用这些牌拼点", [1, Infinity], "h", true, "allowChooseAll").set("maxNum", get.number(cards2[cards2.length - 1], target)).set("minNum", get.number(cards2[0], target)).set("ai", (card) => {
        const { player: player2, maxNum, minNum } = get.event();
        if (maxNum > 12) {
          return 2;
        }
        if (minNum < 2) {
          if (get.number(card, player2) == minNum) {
            return 2;
          }
          return 0;
        }
        if ([minNum, maxNum].some((num) => get.number(card, player2) == num)) {
          return 1;
        }
        return Math.random() - 0.5;
      }).forResult();
      if (!result.bool) {
        return;
      }
      await target.showCards(result.cards);
      target.addGaintag(result.cards, "jsrgqiantun_tag");
      const next = player.chooseToCompare(target);
      next.set("filterCard", (card, player2) => {
        const bool = (cardx) => cardx.hasGaintag("jsrgqiantun_tag");
        return !player2?.countCards("h", bool) || bool(card);
      });
      if (target.countCards("h") + 1 > result.cards.length * 2) {
        next.set("small", true);
      }
      const result3 = await next.forResult();
      target.removeGaintag("jsrgqiantun_tag");
      if (result3.winner == player) {
        player.logSkill("jsrgqiantun", [target], null, null, [3]);
        const cards3 = target.getCards("h", (card) => result.cards.includes(card));
        if (cards3.length) {
          await target.give(cards3, player);
        }
      } else {
        player.logSkill("jsrgqiantun", [target], null, null, [4]);
        const cards3 = target.getCards("h", (card) => !result.cards.includes(card));
        if (cards3.length) {
          await target.give(cards3, player);
        }
      }
      await player.showHandcards(get.translation(player) + "发动了【谦吞】");
    },
    ai: {
      order: 8,
      result: {
        target: -1
      }
    }
  },
  jsrgxiezheng: {
    audio: 2,
    audioname: ["jin_jsrg_simazhao"],
    trigger: {
      player: "phaseJieshuBegin"
    },
    filter(event, player) {
      return game.hasPlayer((current) => current.countCards("h"));
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), [1, 3], function(card, player2, target) {
        return target.countCards("h");
      }).set(
        "goon",
        (function() {
          return player.hasValueTarget({ name: "binglinchengxiax" }) && (player.hp > 2 || !player.hasAllHistory("useSkill", (evt) => {
            return evt.skill == "jsrgxiezheng";
          }));
        })()
      ).set("ai", (target) => {
        const { player: player2, goon } = get.event();
        if (!goon) {
          return 0;
        }
        let val = 0;
        if (ui.selected.targets.length) {
          val -= get.sgnAttitude(player2, target);
        }
        val += get.sgnAttitude(player2, target);
        if (target.mayHaveSha(player2, null, null, "odds") > 0.5) {
          val *= 2;
        }
        return val;
      }).forResult();
    },
    async content(event, trigger, player) {
      for (const target of event.targets.sortBySeat()) {
        if (!target.countCards("h")) {
          continue;
        }
        const result = await target.chooseCard("h", true, "将一张手牌置于牌堆顶").set("targetx", player).set("ai", (card2) => {
          const { player: player2, targetx } = get.event();
          let att = 0;
          if (player2 && targetx) {
            att = get.sgnAttitude(player2, targetx);
          }
          let val = 7 - get.value(card2);
          if (card2.name == "sha") {
            val += att * 4;
          }
          return val;
        }).forResult();
        if (result?.bool && result?.cards?.length) {
          target.$throw(1, 1e3);
          game.log(target, "将", "#y一张手牌", "置于了牌堆顶");
          await target.lose(result.cards, ui.cardPile, "insert");
          game.updateRoundNumber();
        }
      }
      const card = { name: "binglinchengxiax", isCard: true, xiezheng: true };
      if (player.hasUseTarget(card)) {
        await player.chooseUseTarget(card, true);
      }
      if (!game.hasPlayer2((current) => {
        return current.getHistory("damage", (evt) => evt.getParent(card.name)?.card?.xiezheng).length;
      }, true)) {
        await player.loseHp();
      }
    }
  },
  jsrgzhaoxiong: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    limited: true,
    skillAnimation: true,
    animationColor: "thunder",
    filter(event, player) {
      return player.isDamaged() && player.hasAllHistory("useSkill", (evt) => evt.skill == "jsrgxiezheng");
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      player.changeSkin({ characterName: "jsrg_simazhao" }, "jin_jsrg_simazhao");
      await player.changeGroup("jin");
      await player.changeSkills(["jsrgweisi", "jsrgdangyi"], ["jsrgqiantun"]);
    },
    derivation: ["jsrgweisi", "jsrgdangyi"],
    ai: {
      combo: "jsrgxiezheng"
    }
  },
  jsrgweisi: {
    audio: 3,
    enable: "phaseUse",
    logAudio: (index) => typeof index === "number" ? "jsrgweisi" + index + ".mp3" : 2,
    usable: 1,
    filterTarget(card, player, target) {
      return target != player;
    },
    async content(event, trigger, player) {
      const { target } = event;
      if (target.countCards("h")) {
        const result = await target.chooseCard("将任意张手牌移出游戏直到本回合结束", [1, Infinity], "h", "allowChooseAll").set("ai", (card2) => {
          const { numx, player: player2 } = get.event();
          if (player2.countCards("h", "sha") <= numx) {
            return 9;
          }
          if (get.name(card2, player2) == "sha") {
            return 0;
          }
          return 5;
        }).set("numx", player.countCards("h") / 4).forResult();
        if (result.bool) {
          const next = target.addToExpansion(result.cards, "giveAuto", target);
          next.gaintag.add("jsrgweisi");
          await next;
          target.when({
            global: ["phaseBefore", "phaseAfter"]
          }).step(async (event2, trigger2, player2) => {
            const cards2 = player2.getExpansions("jsrgweisi");
            if (cards2.length) {
              await player2.gain(cards2, "draw");
              game.log(player2, "收回了" + get.cnNumber(cards2.length) + "张“威肆”牌");
            }
          });
        }
      }
      const card = { name: "juedou", isCard: true };
      player.when({
        source: "damageSource"
      }).filter((evt) => evt.getParent(event.name) == event).step(async (event2, trigger2, player2) => {
        const cards2 = trigger2.player.getCards("h");
        if (cards2.length) {
          trigger2.player.give(cards2, player2);
          player2.logSkill("jsrgweisi", [trigger2.player], null, null, [3]);
        }
      });
      if (player.canUse(card, target)) {
        await player.useCard(card, target);
      }
    },
    intro: {
      markcount: "expansion",
      mark(dialog, storage, player) {
        let cards2 = player.getExpansions("jsrgweisi");
        if (player.isUnderControl(true)) {
          dialog.addAuto(cards2);
        } else {
          return "共有" + get.cnNumber(cards2.length) + "张牌";
        }
      }
    },
    ai: {
      order: 9,
      result: { target: -1 }
    }
  },
  jsrgdangyi: {
    init(player, skill) {
      player.setMark(skill, skill === "mbdangyi" ? 2 : player.getDamagedHp() + 1, false);
      game.broadcastAll(function(player2) {
        if ((() => {
          for (const sheet of document.styleSheets) {
            try {
              const rules = sheet.cssRules || sheet.rules;
              for (const rule of rules) {
                if (rule.selectorText === ".player .playerjiu_dangyi") {
                  return false;
                }
              }
            } catch (e) {
              continue;
            }
          }
          return true;
        })()) {
          lib.init.sheet(".player .playerjiu_dangyi { animation: game_start 0.5s; -webkit-animation: game_start 0.5s; position: absolute; width: 100%; height: 100%; left: 0; top: 0; z-index: 4; pointer-events: none; background: linear-gradient( to top, rgba(255, 0, 0, 0.3) 0%, rgba(255, 0, 0, 0.3) 60%, rgba(255, 0, 0, 0) 80%, rgba(255, 0, 0, 0) 100% );}");
        }
        if (!player2.node.jiu_dangyi) {
          player2.node.jiu_dangyi = ui.create.div(".playerjiu_dangyi", player2.node.avatar);
          player2.node.jiu_dangyi2 = ui.create.div(".playerjiu_dangyi", player2.node.avatar2);
        }
      }, player);
    },
    zhuSkill: true,
    trigger: { source: "damageBegin1" },
    check(event, player) {
      return get.attitude(player, event.player) < 0 && !event.player.hasSkillTag("filterDamage", null, {
        player,
        card: event.card
      });
    },
    logTarget: "player",
    filter(event, player) {
      return player.countMark("jsrgdangyi_used") < player.countMark("jsrgdangyi");
    },
    async content(event, trigger, player) {
      player.addSkill(event.name + "_used");
      player.addMark(event.name + "_used", 1, false);
      trigger.num++;
      game.broadcastAll(
        function(player2, name) {
          if (player2.countMark(name + "_used") >= player2.countMark(name) && player2.node.jiu_dangyi) {
            player2.node.jiu_dangyi.delete();
            player2.node.jiu_dangyi2.delete();
            delete player2.node.jiu_dangyi;
            delete player2.node.jiu_dangyi2;
          }
        },
        player,
        event.name
      );
    },
    audio: 2,
    mark: true,
    intro: {
      markcount(storage = 0, player, skill) {
        const used = `${skill}_used`;
        return `${storage - player.countMark(used)}/${storage}`;
      },
      content(storage = 0, player, skill) {
        return `剩余可发动次数为${storage - player.countMark(`${skill}_used`)}`;
      }
    },
    onremove(player, skill) {
      delete player.storage[skill];
      game.broadcastAll(function(player2) {
        if (player2.node.jiu_dangyi) {
          player2.node.jiu_dangyi.delete();
          player2.node.jiu_dangyi2.delete();
          delete player2.node.jiu_dangyi;
          delete player2.node.jiu_dangyi2;
        }
      }, player);
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  jsrgzuozhan: {
    audio: 4,
    logAudio: () => 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async cost(event, trigger, player) {
      const result = await player.chooseTarget([1, 2], lib.filter.notMe, get.prompt2(event.skill)).set("ai", (target) => {
        const player2 = get.player();
        let val = target.hp;
        if (get.attitude(player2, target) > 0) {
          val *= 2;
        }
        return val;
      }).forResult();
      if (!result?.targets) {
        result.targets = [];
      }
      event.result = {
        bool: true,
        targets: [player, ...result.targets]
      };
    },
    async content(event, trigger, player) {
      player.markAuto("jsrgzuozhan", event.targets);
      event.targets.sort((a, b) => b.hp - a.hp);
      player.addMark("jsrgzuozhan_range", Math.min(event.targets[0].hp, 5));
      player.markSkill("jsrgzuozhan");
    },
    mod: {
      attackFrom(from, to, distance) {
        return distance - from.countMark("jsrgzuozhan_range");
      }
    },
    intro: {
      markcount(storage, player) {
        let num = 0;
        num += player.countMark("jsrgzuozhan_range");
        num -= player.countMark("jsrglangan_range");
        if (num == 0) {
          return null;
        }
        return num;
      },
      mark(dialog, storage, player) {
        if (storage) {
          dialog.addSmall([storage.map((key) => key.name), "character"]);
        }
        let num = 0;
        num += player.countMark("jsrgzuozhan_range");
        num -= player.countMark("jsrglangan_range");
        if (num != 0) {
          dialog.addText(`攻击范围${num > 0 ? "+" : ""}${num}`);
        }
      }
    },
    group: "jsrgzuozhan_gain",
    subSkill: {
      gain: {
        audio: ["jsrgzuozhan3.mp3", "jsrgzuozhan4.mp3"],
        trigger: {
          global: "dieAfter"
        },
        filter(event, player) {
          if (!player.isIn() && event.player != player) {
            return false;
          }
          if (!player.getStorage("jsrgzuozhan").includes(event.player)) {
            return false;
          }
          return game.hasPlayer((current) => current.isIn() && player.getStorage("jsrgzuozhan").includes(current));
        },
        forceDie: true,
        async cost(event, trigger, player) {
          event.result = await player.chooseTarget("坐瞻：令一名“坐瞻”角色获得" + player.countMark("jsrgzuozhan_range") + "张不同牌名的基本牌", true).set("filterTarget", (card, player2, target) => {
            return target.isIn() && player2.getStorage("jsrgzuozhan").includes(target);
          }).set("ai", (target) => {
            return get.attitude(get.player(), target);
          }).forResult();
        },
        async content(event, trigger, player) {
          let cards2 = [], num = player.countMark("jsrgzuozhan_range");
          while (cards2.length < num) {
            const card = get.discardPile((card2) => {
              if (get.type(card2) != "basic") {
                return false;
              }
              if (!cards2.length) {
                return true;
              }
              return cards2.every((cardx) => cardx.name != card2.name);
            });
            if (card) {
              cards2.add(card);
            } else {
              break;
            }
          }
          if (cards2.length) {
            await event.targets[0].gain(cards2, "gain2");
          }
        }
      }
    }
  },
  jsrgcuibing: {
    audio: 5,
    trigger: { player: "phaseUseEnd" },
    forced: true,
    logAudio(event, player) {
      const num = Math.min(
        5,
        game.countPlayer((current) => player.inRange(current))
      ), numx = player.countCards("h");
      if (num > numx) {
        return 2;
      }
      if (num == numx) {
        return ["jsrgcuibing5.mp3"];
      }
      return ["jsrgcuibing3.mp3", "jsrgcuibing4.mp3"];
    },
    async content(event, trigger, player) {
      const num = Math.min(
        5,
        game.countPlayer((current) => player.inRange(current))
      ), numx = player.countCards("h");
      if (numx > num) {
        await player.chooseToDiscard("h", numx - num, true, "allowChooseAll");
        let discard = numx - num, i = 0;
        while (game.hasPlayer((current) => current.countCards("ej")) && i < discard) {
          const result = await player.chooseTarget("是否弃置场上的牌？", (card, player2, target) => {
            return target.countCards("ej");
          }).set("ai", (target) => {
            let att = get.attitude(get.player(), target);
            if (att > 0 && target.countCards("j")) {
              return 1;
            }
            if (att < 0 && target.countCards("e")) {
              return 2;
            }
            return 0;
          }).forResult();
          if (result?.bool) {
            const result2 = await player.discardPlayerCard(result.targets[0], "ej", [1, discard - i]).forResult();
            if (result2?.bool && result2?.links?.length) {
              i += result2.links.length;
            } else {
              break;
            }
          } else {
            break;
          }
        }
      } else {
        await player.drawTo(num);
        player.addTempSkill("jsrgcuibing_keji");
      }
    },
    subSkill: {
      keji: {
        trigger: { player: "phaseDiscardBefore" },
        direct: true,
        charlotte: true,
        async content(event, trigger, player) {
          trigger.cancel();
        }
      }
    }
  },
  jsrglangan: {
    audio: 2,
    trigger: { global: "dieAfter" },
    forced: true,
    async content(event, trigger, player) {
      await player.recover();
      await player.draw(2);
      if (player.countMark("jsrglangan_range") < 3) {
        player.addMark("jsrglangan_range", 1, false);
      }
      player.markSkill("jsrgzuozhan");
    },
    ai: {
      threaten: 1.5
    }
  },
  //邓艾
  jsrgpiqi: {
    enable: "phaseUse",
    viewAs: {
      name: "shunshou",
      isCard: true,
      storage: {
        jsrgpiqi: true
      }
    },
    filterCard: () => false,
    selectCard: -1,
    filter(event, player) {
      const card = { name: "shunshou", isCard: true, storage: { jsrgpiqi: true } };
      return player.countMark("jsrgpiqi_used") < 2 && game.hasPlayer((current) => {
        return lib.skill.jsrgpiqi.filterTarget(card, player, current);
      });
    },
    filterTarget(card, player, target) {
      if (player.getStorage("jsrgpiqi_targets").includes(target)) {
        return false;
      }
      return lib.filter.targetEnabled2(card, player, target);
    },
    async precontent(event, trigger, player) {
      player.addTempSkill("jsrgpiqi_used", "phaseUseAfter");
      player.addMark("jsrgpiqi_used", 1, false);
      player.addTempSkill("jsrgpiqi_targets", "phaseUseAfter");
      const targets = event.result.targets;
      player.markAuto("jsrgpiqi_targets", targets);
      for (const target of game.players) {
        if (targets.some((current) => get.distance(target, current) <= 1)) {
          target.addTempSkill("jsrgpiqi_kanpo");
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      },
      targets: {
        charlotte: true,
        onremove: true
      },
      kanpo: {
        enable: "chooseToUse",
        filterCard(card) {
          return get.name(card) == "shan";
        },
        viewAsFilter(player) {
          return player.countCards("hes", "shan") > 0;
        },
        viewAs: { name: "wuxie" },
        position: "hes",
        prompt: "将一张闪当无懈可击使用",
        check(card) {
          const tri = _status.event.getTrigger();
          if (tri && tri.card && tri.card.name == "chiling") {
            return -1;
          }
          return 8 - get.value(card);
        }
      }
    }
  },
  jsrgzhoulin: {
    trigger: {
      player: ["phaseBegin", "phaseAfter"],
      source: "damageBegin1"
    },
    filter(event, player, name) {
      if (event.name == "damage") {
        return event.card?.name == "sha" && player.getStorage("jsrgzhoulin").includes(event.player);
      }
      if (name == "phaseAfter") {
        return player.getStorage("jsrgzhoulin").length;
      }
      return game.hasPlayer((current) => !player.inRange(current) && current != player);
    },
    direct: true,
    async content(event, trigger, player) {
      if (event.triggername == "phaseBegin") {
        player.markAuto(
          event.name,
          game.filterPlayer((current) => !player.inRange(current) && current != player)
        );
      } else if (trigger.name == "phase") {
        player.unmarkAuto(event.name, player.getStorage(event.name));
      } else {
        player.logSkill(event.name, trigger.player);
        trigger.num++;
      }
    },
    intro: {
      content: "本回合对$使用杀造成伤害+1"
    }
  },
  //司马亮
  jsrgsheju: {
    trigger: {
      player: "useCardToPlayered",
      target: "useCardToTargeted"
    },
    filter(event, player) {
      if ([event.player, event.target].some((target) => {
        return !target?.isIn() || !target.countCards("h");
      })) {
        return false;
      }
      return event.card.name === "sha" && event.targets.length === 1;
    },
    forced: true,
    logTarget(event, player) {
      return event.player === player ? event.target : event.player;
    },
    async content(event, trigger, player) {
      await player.chooseToDebate({ list: [player, event.targets[0]] }).set("callback", async (event2) => {
        const result = event2.debateResult;
        if (result?.bool) {
          if (result.opinion === "black") {
            for (const i of result.targets) {
              await i.loseMaxHp();
            }
          } else if (result.black.length) {
            const targets = result.black.map((i) => i[0]);
            if (targets.length == 1) {
              await targets[0].draw(2);
            } else {
              await game.asyncDraw(targets, 2);
              await game.delayx();
            }
          }
        }
      });
    }
  },
  jsrgzuwang: {
    trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
    filter(event, player) {
      return player.countCards("h") < player.maxHp;
    },
    forced: true,
    async content(event, trigger, player) {
      await player.drawTo(player.maxHp);
    }
  },
  //秃发树机能
  jsrgqinrao: {
    trigger: { global: "phaseUseBegin" },
    filter(event, player) {
      return event.player !== player && player.hasCard((card) => {
        return player.canUse(get.autoViewAs({ name: "juedou" }, [card]), event.player, false);
      }, "hes");
    },
    direct: true,
    clearTime: true,
    async content(event, trigger, player) {
      const target = trigger.player;
      const next = player.chooseToUse();
      next.set("openskilldialog", get.prompt2("jsrgqinrao", target));
      next.set("norestore", true);
      next.set("_backupevent", "jsrgqinrao_backup");
      next.set("custom", {
        add: {},
        replace: { window() {
        } }
      });
      next.backup("jsrgqinrao_backup");
      next.set("targetRequired", true);
      next.set("complexTarget", true);
      next.set("complexSelect", true);
      next.set("filterTarget", function(card, player2, target2) {
        if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
          return false;
        }
        return lib.filter.targetEnabled.apply(this, arguments);
      });
      next.set("sourcex", target);
      next.set("addCount", false);
      next.logSkill = "jsrgqinrao";
      await next;
    },
    subSkill: {
      backup: {
        viewAs: {
          name: "juedou",
          storage: { jsrgqinrao: true }
        },
        filterCard(card) {
          return get.itemtype(card) === "card";
        },
        position: "hes",
        check(card) {
          return 5 - get.value(card);
        },
        log: false,
        async precontent(event, trigger, player) {
          player.addTempSkill("jsrgqinrao_effect");
        }
      },
      effect: {
        charlotte: true,
        trigger: { global: "chooseToRespondBegin" },
        filter(event, player) {
          if (event.player === player || event.getParent().name !== "juedou") {
            return false;
          }
          const evt = event.getParent(2);
          return evt?.name === "useCard" && evt.player === player && evt.card.storage?.jsrgqinrao;
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const target = trigger.player;
          if (target.hasCard((card) => get.name(card) === "sha" && trigger.filterCard(card, target, trigger) && lib.filter.cardRespondable(card, target, trigger), "h")) {
            trigger.set("forced", true);
          } else {
            await target.showHandcards();
          }
        }
      }
    }
  },
  jsrgfuran: {
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return event.source?.isIn() && !event.source.inRange(player);
    },
    frequent: true,
    logTarget: "source",
    async content(event, trigger, player) {
      player.addTempSkill("jsrgfuran_recover");
      player.addMark("jsrgfuran_recover", 1, false);
    },
    subSkill: {
      recover: {
        charlotte: true,
        onremove: true,
        trigger: { global: "phaseEnd" },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          await player.recover(player.countMark(event.name));
          player.removeSkill(event.name);
        },
        intro: { content: "本回合结束时回复#点体力" }
      }
    }
  },
  //陆抗
  jsrgzhuwei: {
    enable: "phaseUse",
    filter(event, player) {
      return player.canMoveCard(null, true);
    },
    usable: 1,
    async content(event, trigger, player) {
      let map = {}, map2 = {};
      game.filterPlayer((target) => map[target.playerid] = game.countPlayer((current) => target.inRange(current)));
      await player.moveCard(true).set("nojudge", true);
      game.filterPlayer((target) => map2[target.playerid] = game.countPlayer((current) => target.inRange(current)));
      const targets = game.filterPlayer((target) => {
        if (typeof map[target.playerid] !== "number" || typeof map2[target.playerid] !== "number") {
          return false;
        }
        return map[target.playerid] > 0 && map2[target.playerid] === 0;
      });
      if (targets.length) {
        const result = await player.chooseTarget("是否令一名攻击范围内变为没有角色的角色失去2点体力？", (card, player2, target) => {
          return get.event().targets.includes(target);
        }).set("targets", targets).set("ai", (target) => {
          const player2 = get.player();
          return get.effect(target, { name: "losehp" }, player2, player2);
        }).forResult();
        if (result.bool) {
          const target = result.targets[0];
          player.line(target);
          await target.loseHp(2);
        }
      }
    },
    ai: {
      order: 9,
      result: {
        player(player) {
          return player.canMoveCard(true, true) ? 1 : 0;
        }
      }
    }
  },
  jsrgkuangjian: {
    enable: "chooseToUse",
    filter(event, player) {
      return get.inpileVCardList((info) => {
        return get.type(info[2]) == "basic";
      }).some((card) => {
        return player.hasCard((cardx) => {
          if (get.type(cardx) !== "equip") {
            return false;
          }
          return event.filterCard({ name: card[2], nature: card[3], storage: { jsrgkuangjian: true }, cards: [cardx] }, player, event);
        }, "hes");
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
            return event.filterCard({ name: card[2], nature: card[3], storage: { jsrgkuangjian: true }, cards: [cardx] }, player, event);
          }, "hes");
        });
        return ui.create.dialog("匡谏", [list, "vcard"]);
      },
      filter(button, player) {
        const evt = get.event().getParent();
        return evt.filterCard({ name: button.link[2], nature: button.link[3], storage: { jsrgkuangjian: true } }, player, evt);
      },
      check(button) {
        if (get.event().type != "phase") {
          return 1;
        }
        return get.player().getUseValue({ name: button.link[2], nature: button.link[3], storage: { jsrgkuangjian: true } });
      },
      backup(links, player) {
        return {
          audio: "jsrgkuangjian",
          filterCard: { type: "equip" },
          popname: true,
          check(card) {
            return 6 - get.value(card);
          },
          position: "hes",
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            storage: { jsrgkuangjian: true }
          },
          async precontent(event, trigger, player2) {
            player2.addTempSkill("jsrgkuangjian_effect");
          }
        };
      },
      prompt(links, player) {
        return "###匡谏###将一张装备牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用";
      }
    },
    mod: {
      cardUsable(card, player, num) {
        if (card.storage?.jsrgkuangjian) {
          return Infinity;
        }
      },
      playerEnabled(card, player, target) {
        if (target === player && card.storage?.jsrgkuangjian) {
          return false;
        }
      }
    },
    locked: false,
    hiddenCard(player, name) {
      if (!lib.inpile.includes(name)) {
        return false;
      }
      return get.type(name) == "basic" && player.hasCard((card) => {
        if (get.position(card) === "h" && _status.connectMode) {
          return true;
        }
        return get.type(card) === "equip";
      }, "hes");
    },
    ai: {
      fireAttack: true,
      respondSha: true,
      skillTagFilter(player, tag, arg) {
        if (arg == "respond") {
          return false;
        }
        if (!player.hasCard((card) => {
          if (get.position(card) === "h" && _status.connectMode) {
            return true;
          }
          return get.type(card) === "equip";
        }, "hes")) {
          return false;
        }
      },
      order(item, player = _status.event.player) {
        if (player && get.event().type == "phase") {
          let max = 0, names = get.inpileVCardList((info) => {
            return get.type(info[2]) == "basic";
          });
          names = names.map((namex) => {
            return { name: namex[2], nature: namex[3], storage: { jsrgkuangjian: true } };
          });
          names.forEach((card) => {
            if (player.getUseValue(card) > 0) {
              let temp = get.order(card);
              if (temp > max) {
                max = temp;
              }
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
      backup: {},
      effect: {
        charlotte: true,
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          if (event.skill !== "jsrgkuangjian_backup" || !event.cards?.filterInD("od").some((card) => get.type(card) === "equip")) {
            return false;
          }
          const cards2 = event.cards.filterInD("od").filter((card) => get.type(card) === "equip");
          return event.targets?.some((target) => target.isIn() && cards2.some((card) => target.hasUseTarget(card)));
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          let targets = trigger.targets.slice();
          while (trigger.cards.filterInD("od").some((card) => get.type(card) === "equip")) {
            const target = targets.shift();
            if (!target.isIn()) {
              continue;
            }
            while (trigger.cards.filterInD("od").some((card) => get.type(card) === "equip" && target.hasUseTarget(card))) {
              const result = await target.chooseButton(
                [
                  "选择使用其中一张装备牌",
                  trigger.cards.filterInD("od").filter((card) => {
                    return get.type(card) === "equip" && target.hasUseTarget(card);
                  })
                ],
                true
              ).forResult();
              if (result?.bool && result.links?.length) {
                await target.chooseUseTarget(result.links[0], true);
              } else {
                break;
              }
            }
          }
        }
      }
    }
  },
  //马隆
  jsrgfennan: {
    audio: 2,
    enable: "phaseUse",
    usable(skill, player) {
      return 2;
    },
    filter(event, player) {
      return game.hasPlayer((target) => {
        return event.jsrgfennan?.includes(target) || target.countCards("h");
      });
    },
    onChooseToUse(event) {
      if (!game.online && !event.jsrgfennan) {
        let list = game.filterPlayer((target) => {
          return event.player.canMoveCard(null, null, target, (card) => {
            return !game.getGlobalHistory("everything", (evt) => {
              if (evt.name !== "equip" && evt.name !== "addJudge") {
                return false;
              }
              if (evt.card !== card) {
                return false;
              }
              const name = evt.getParent().name;
              return name === "moveCard" || get.skillInfoTranslation(name, event.player).includes("移动");
            }).length;
          });
        });
        event.set("jsrgfennan", list);
      }
    },
    filterTarget(card, player, target) {
      const event = _status.event;
      return event.jsrgfennan?.includes(target) || target.countCards("h");
    },
    async content(event, trigger, player) {
      const target = event.target, evt = event.getParent(2);
      const num = 3;
      let result, str = get.translation(player);
      if (!evt.jsrgfennan?.includes(target)) {
        result = { index: 1 };
      } else if (!target.countCards("h")) {
        result = { index: 0 };
      } else {
        result = await target.chooseControl().set("choiceList", ["令" + str + "翻面，然后其移动你场上的一张本回合未被移动过的牌", "令" + str + "观看你的手牌并重铸其中至多" + get.cnNumber(num) + "张牌"]).set("ai", () => {
          const player2 = get.player(), source = get.event().getParent().player;
          if (get.attitude(player2, source) > 0) {
            return source.isTurnedOver() ? 0 : 1;
          }
          return Math.random() > player2.countVCards("e") / player2.countEnabledSlot() ? 0 : 1;
        }).forResult();
      }
      if (result.index == 0) {
        await player.turnOver();
        await player.moveCard(
          target,
          (card) => {
            return !game.getGlobalHistory("everything", (evt2) => {
              if (evt2.name !== "equip" && evt2.name !== "addJudge") {
                return false;
              }
              if (evt2.card !== card) {
                return false;
              }
              const name = evt2.getParent().name;
              return name === "moveCard" || get.skillInfoTranslation(name, player).includes("移动");
            }).length;
          },
          true
        );
      } else {
        const result2 = await player.choosePlayerCard(target, "h", "visible", [1, num], "是否重铸其至多" + get.cnNumber(num) + "张牌？").set("filterButton", (button) => {
          const player2 = get.event().getParent().target;
          return lib.filter.cardRecastable(button.link, player2);
        }).set("ai", (button) => {
          const player2 = get.player(), target2 = get.event().getParent().target;
          return get.sgn(get.sgn(get.attitude(player2, target2)) - 0.5) * lib.skill.zhiheng.check(button.link);
        }).forResult();
        if (result2?.bool && result2.cards?.length) {
          await target.recast(result2.cards);
        }
      }
    },
    ai: {
      order: 9,
      result: {
        player(player, target) {
          return Math.random() * 2 - 1;
        }
      }
    }
  },
  jsrgxunji: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      const targets = player.getHistory("useCard", (evt) => evt.targets?.some((i) => i !== player)).slice().map((evt) => evt.targets.filter((i) => i !== player)).flat().unique();
      if (!player.hasHistory("sourceDamage", (evtx) => {
        const evt = evtx.getParent("useCard");
        if (!evt || evt.name !== "useCard" || !get.tag(evt.card, "damage")) {
          return false;
        }
        return evt.cards?.someInD("d");
      })) {
        return false;
      }
      return targets.length && targets.every((target) => player.hasHistory("sourceDamage", (evt) => evt.player === target));
    },
    prompt2(event, player) {
      const cards2 = player.getHistory("sourceDamage", (evtx) => {
        const evt = evtx.getParent("useCard");
        if (!evt || evt.name !== "useCard" || !get.tag(evt.card, "damage")) {
          return false;
        }
        return evt.cards?.someInD("d");
      }).reduce((sum, evtx) => {
        return sum.addArray(evtx.getParent("useCard").cards.filterInD("d"));
      }, []);
      return "将" + get.translation(cards2) + "分配给任意名角色各一张";
    },
    async content(event, trigger, player) {
      let cards2 = player.getHistory("sourceDamage", (evtx) => {
        const evt = evtx.getParent("useCard");
        if (!evt || evt.name !== "useCard" || !get.tag(evt.card, "damage")) {
          return false;
        }
        return evt.cards?.someInD("d");
      }).reduce((sum, evtx) => {
        return sum.addArray(evtx.getParent("useCard").cards.filterInD("d"));
      }, []), map = {};
      player.$gain2(cards2, false);
      await game.delayx();
      if (_status.connectMode) {
        game.broadcastAll(() => _status.noclearcountdown = true);
      }
      while (cards2.length && game.hasPlayer((target) => !map[target.playerid])) {
        let resultx;
        if (cards2.length === 1) {
          resultx = { bool: true, links: cards2 };
        } else {
          resultx = await player.chooseCardButton("勋济：请选择要分配的牌", cards2, Object.keys(map).length === 0).set("ai", (button) => {
            const player2 = get.player(), map2 = get.event().map;
            let targets = game.filterPlayer((target) => !map2[target.playerid]);
            return targets.some((target) => get.value(button.link, "raw") * get.value(button.link, target) * get.attitude(player2, target) > 0) ? 1 : 0;
          }).set("map", map).forResult();
        }
        const card = resultx?.links?.[0] || cards2[0];
        cards2.remove(card);
        const result = await player.chooseTarget(
          "选择获得" + get.translation(card) + "的角色",
          (card2, player2, target) => {
            return !get.event().map[target.playerid];
          },
          true
        ).set("map", map).set("ai", (target) => {
          const player2 = get.player();
          return get.attitude(player2, target) * get.event().value;
        }).set("value", get.value(card, player, "raw")).set("ainmate", false).forResult();
        if (result?.bool && result.targets?.length) {
          const target = result.targets[0];
          map[target.playerid] = [target, card];
        }
      }
      if (_status.connectMode) {
        game.broadcastAll(() => {
          delete _status.noclearcountdown;
          game.stopCountChoose();
        });
      }
      if (Object.keys(map).length) {
        await game.loseAsync({
          gain_list: Object.values(map),
          giver: player,
          animate: "gain2"
        }).setContent("gaincardMultiple");
      }
    }
  }
};
const translates = {
  //江山如故·起
  jsrg_liuhong: "起刘宏",
  jsrg_liuhong_prefix: "起",
  jsrgchaozheng: "朝争",
  jsrgchaozheng_info: "准备阶段，你可以令所有其他角色议事。若结果为：红色，意见为红色的角色各回复1点体力；黑色，意见为红色的角色各失去1点体力。然后若所有意见均相同，你摸X张牌（X为此次议事的角色数）。",
  jsrgshenchong: "甚宠",
  jsrgshenchong_info: `限定技。出牌阶段，你可以令一名其他角色获得获得${get.poptip("jsrgfeiyang")}和${get.poptip("jsrgbahu")}。若如此做，当你死亡时，其失去所有技能并弃置所有手牌。`,
  jsrgjulian: "聚敛",
  jsrgjulian_info: "主公技。①其他群势力角色每回合限两次。当其不于摸牌阶段且不因〖聚敛〗摸牌后，其可以摸一张牌。②结束阶段，你可以获得所有其他群势力角色各一张牌。",
  jsrgfeiyang: "飞扬",
  jsrgfeiyang_info: "判定阶段开始时，若你的判定区里有牌，你可以弃置两张手牌并弃置你判定区里的一张牌。",
  jsrgbahu: "跋扈",
  jsrgbahu_info: "锁定技。①准备阶段，你摸一张牌。②你使用【杀】的次数上限+1。",
  jsrg_hejin: "起何进",
  jsrg_hejin_prefix: "起",
  jsrgzhaobing: "诏兵",
  jsrgzhaobing_info: "结束阶段，你可以弃置所有手牌，然后令至多X名其他角色依次选择一项：1.正面向上交给你一张【杀】；2.失去1点体力（X为你本次弃置的牌数）。",
  jsrgzhuhuan: "诛宦",
  jsrgzhuhuan_info: "准备阶段，你可以展示所有手牌并弃置所有【杀】，然后令一名其他角色选择一项：1.弃置等量的牌，然后受到1点伤害；2.令你摸等量的牌，然后你回复1点体力。",
  jsrgyanhuo: "延祸",
  jsrgyanhuo_info: "锁定技。当你死亡时，你增加如下全局技能：当有角色使用【杀】时，此【杀】的伤害值基数+1。",
  jsrg_sunjian: "起孙坚",
  jsrg_sunjian_prefix: "起",
  jsrgpingtao: "平讨",
  jsrgpingtao_info: "出牌阶段限一次。你可以令一名其他角色选择一项：1.交给你一张牌，然后你于此回合使用【杀】的次数上限+1；2.令你视为对其使用一张【杀】。",
  jsrgjuelie: "绝烈",
  jsrgjuelie_info: "①当你使用【杀】指定一名角色为目标后，你可以弃置任意张牌并弃置其等量的牌。②若你的手牌数或体力值为全场最小，则你使用【杀】造成的伤害+1。",
  jsrg_huangfusong: "起皇甫嵩",
  jsrg_huangfusong_prefix: "起",
  jsrgguanhuo: "观火",
  jsrgguanhuo_info: "出牌阶段，你可以视为使用一张【火攻】。你以此法使用的未造成过伤害的【火攻】结算结束后，若你此阶段发动〖观火〗的次数：为1，则你于此阶段使用【火攻】造成的伤害+1；不为1，你失去〖观火〗。",
  jsrgjuxia: "居下",
  jsrgjuxia_info: "每回合限一次。当其他角色使用牌指定你为目标后，若其技能数多于你，其可以令此牌对你无效，然后令你摸两张牌。",
  jsrg_new_juxia: "居下",
  jsrg_new_juxia_info: "每回合限一次。当其他角色使用牌指定你为目标后，若其技能数多于你，你可摸两张牌。",
  jsrg_xushao: "起许劭",
  jsrg_xushao_prefix: "起",
  jsrgyingmen: "盈门",
  jsrgyingmen_info: "锁定技。①游戏开始时，你将武将牌堆中随机四张武将牌置于你的武将牌上，称为“访客”。②回合开始时，若你的“访客”数小于4，你随机从武将牌堆中将“访客”补至四张。",
  jsrgpingjian: "评鉴",
  jsrgpingjian_info: "你可以于满足你“访客”上的一个无技能标签或仅有锁定技标签的技能条件的时机发动此技能，然后你选择移去一张“访客”。若移去的是本次发动技能的“访客”，你摸一张牌。",
  jsrg_dongbai: "起董白",
  jsrg_dongbai_prefix: "起",
  jsrgshichong: "恃宠",
  jsrgshichong_info: "转换技。当你使用牌指定其他角色为唯一目标后，阳：你可以获得目标角色一张手牌；阴：目标角色可以交给你一张手牌。",
  jsrglianzhu: "连诛",
  jsrglianzhu_info: "出牌阶段限一次。你可以展示一张黑色手牌并交给一名其他角色，然后视为你对所有与其势力相同的其他角色依次使用一张【过河拆桥】。",
  jsrg_new_lianzhu: "连诛",
  jsrg_new_lianzhu_info: "结束阶段，你可视为使用一张【过河拆桥】，结算后此牌唯一目标须选择一项：1.失去1点体力；2.令你对其下家发动〖连诛〗。",
  jsrg_qiaoxuan: "起桥玄",
  jsrg_qiaoxuan_prefix: "起",
  jsrgjuezhi: "绝质",
  jsrgjuezhi_info: "①当你失去一张装备区里的装备牌后，你可以废除对应的装备栏。②你的回合每阶段限一次。当你使用牌对目标角色造成伤害时，你令此伤害+X（X为其装备区里的牌与你已废除的装备栏中相同副类别的数量）。",
  jsrg_new_juezhi: "绝质",
  jsrg_new_juezhi_info: "①当你失去一张装备区里的装备牌后，你可以废除对应的装备栏并摸两张牌。②一名角色于你的回合内受到伤害时，若其装备区中有与你已废除装备栏副类别相同的牌，你可以令此伤害+1。",
  jsrgjizhao: "急召",
  jsrgjizhao_info: "准备阶段或结束阶段，你可以令一名角色选择一项：1.使用一张手牌；2.令你可以移动其区域里的一张牌。",
  jsrg_yangbiao: "起杨彪",
  jsrg_yangbiao_prefix: "起",
  jsrgzhaohan: "昭汉",
  jsrgzhaohan_info: "锁定技。准备阶段，若本局游戏：未洗过牌，你回复1点体力；洗过牌，你失去1点体力。",
  jsrgrangjie: "让节",
  jsrgrangjie_info: "当你受到1点伤害后，你可以移动场上的一张牌，然后你可以于弃牌堆中选择获得一张本回合进入弃牌堆且与此牌花色相同的牌。",
  jsrgyizheng: "义争",
  jsrgyizheng_info: "出牌阶段限一次。你可以与一名手牌数大于你的角色拼点。若你：赢，其跳过下一个摸牌阶段；没赢，其可以对你造成至多2点伤害。",
  jsrg_kongrong: "起孔融",
  jsrg_kongrong_prefix: "起",
  jsrglirang: "礼让",
  jsrglirang_info: "每轮限一次。其他角色的摸牌阶段开始时，你可以交给其两张牌。然后此回合的弃牌阶段结束时，你可以获得所有其于此阶段因弃置进入弃牌堆的牌。",
  jsrgzhengyi: "争义",
  jsrgzhengyi_info: "当你每回合首次受到伤害时，本轮因〖礼让〗得到过牌的其他角色可以将此伤害转移给其。",
  jsrg_new_lirang: "礼让",
  jsrg_new_lirang_info: "每轮开始时，你可选择至多两名其他角色并亮出牌堆顶四张牌，这些角色可以依次获得其中任意张牌，然后你获得剩余牌。",
  jsrg_new_zhengyi: "争义",
  jsrg_new_zhengyi_info: "本轮因〖礼让〗获得牌唯一最少的角色每回合首次受到伤害时，本轮因〖礼让〗获得牌唯一最多的角色可以将此伤害转移给其。",
  jsrg_zhujun: "起朱儁",
  jsrg_zhujun_prefix: "起",
  jsrgfendi: "分敌",
  jsrgfendi_info: "每回合限一次。当你使用【杀】指定唯一目标后，你可以展示其任意张手牌，令其不能使用或打出对应实体牌不全为这些牌的牌直到此【杀】结算结束。然后当此【杀】对其造成伤害后，你于其手牌区或弃牌堆获得这些牌。",
  jsrgjuxiang: "拒降",
  jsrgjuxiang_info: "当你不于摸牌阶段得到牌后，你可以弃置之，令当前回合角色于此回合额定的出牌阶段内使用【杀】的次数上限+X（X为你以此法弃置的牌的花色数）。",
  jsrg_liubei: "起刘备",
  jsrg_liubei_prefix: "起",
  jsrgjishan: "积善",
  jsrgjishan_info: "每回合每项各限一次。①当一名角色受到伤害时，你可以失去1点体力并防止此伤害，然后你与其各摸一张牌。②当你造成伤害后，你可以令一名体力值最小且你对其发动过〖积善①〗的角色回复1点体力。",
  jsrgzhenqiao: "振鞘",
  jsrgzhenqiao_info: "锁定技。①你的攻击范围+1。②当你使用【杀】指定目标后，若你的武器栏为空且未废除，你令此【杀】的效果额外结算一次。",
  jsrg_wangyun: "起王允",
  jsrg_wangyun_prefix: "起",
  jsrgshelun: "赦论",
  jsrgshelun_info: "出牌阶段限一次，若你有手牌，你可以选择一名其他角色，然后令除其外所有手牌数不大于你的角色议事。若结果为：红色，你弃置其两张牌；黑色，你对其造成2点伤害。",
  jsrgfayi: "伐异",
  jsrgfayi_info: "当你议事结算结束后，你可以对任意名意见与你不同的角色造成1点伤害。",
  jsrg_liuyan: "起刘焉",
  jsrg_liuyan_prefix: "起",
  jsrgtushe: "图射",
  jsrgtushe_info: "当你使用非装备牌指定目标后，你可以展示所有手牌（无牌则不展示）。若你没有基本牌，你可以摸X张牌（X为此牌指定的目标数）。",
  jsrgtongjue: "通绝",
  jsrgtongjue_info: "主公技。出牌阶段限一次。你可以将任意张牌交给等量名其他群势力角色。然后你不能使用牌指定这些角色为目标直到回合结束。",
  jsrg_caocao: "梦曹操",
  jsrg_caocao_prefix: "梦",
  jsrgzhenglve: "政略",
  jsrgzhenglve_info: "①一号位的回合结束时，你可以摸一张牌，然后令一名没有“猎”标记的角色获得“猎”（若一号位本回合没有造成过伤害则改为至多两名）。②你对有“猎”的角色使用牌无距离和次数限制。③每回合限一次。当你对有“猎”的角色造成伤害后，你可以摸一张牌并获得造成此伤害的牌。",
  jsrgzhenglve_info_identity: "①主公的回合结束时，你可以摸一张牌，然后令一名没有“猎”标记的角色获得“猎”（若主公本回合没有造成过伤害则改为至多两名）。②你对有“猎”的角色使用牌无距离和次数限制。③每回合限一次。当你对有“猎”的角色造成伤害后，你可以摸一张牌并获得造成此伤害的牌。",
  jsrghuilie: "会猎",
  jsrghuilie_info: "觉醒技。准备阶段，若有“猎”的角色数大于2，你减1点体力上限，然后获得〖平戎〗和〖飞影〗。",
  jsrgpingrong: "平戎",
  jsrgpingrong_info: "每轮限一次。一名角色的回合结束时，你可以移去一名角色的“猎”，然后你于此回合后执行一个额外回合。该回合结束后，若你于此回合未造成过伤害，你失去1点体力。",
  jsrg_nanhualaoxian: "起南华老仙",
  jsrg_nanhualaoxian_prefix: "起",
  jsrgshoushu: "授术",
  jsrgshoushu_info: "锁定技。①每轮开始时，若场上没有【太平要术】，你可以从游戏外将【太平要术】置于一名角色的装备区内。②当【太平要术】离开一名角色的装备区后，你令此牌销毁。",
  jsrgxundao: "寻道",
  jsrgxundao_info: "当你的判定牌生效前，你可以令至多两名角色依次弃置一张牌，然后你选择一张以此法弃置且位于弃牌堆中的牌代替此判定牌。",
  jsrglinghua: "灵化",
  jsrglinghua_info: "①准备阶段，你可以执行目标角色为你的【闪电】效果。若你未因此受到伤害，你可以令一名角色回复1点体力。②结束阶段，你可以执行目标角色为你且判定效果反转的【闪电】效果。若你未因此受到伤害，你可以对一名角色造成1点雷电伤害。",
  sbyingmen: "盈门",
  sbyingmen_info: "锁定技。①游戏开始时，你将武将牌堆中随机四张武将牌置于你的武将牌上，称为“访客”。②回合开始时，你可选择是否移去任意张”访客“，然后若你的“访客”数小于4，你随机从武将牌堆中将“访客”补至四张。",
  sbpingjian: "评鉴",
  sbpingjian_info: "你可以于满足你“访客”上的一个无技能标签或仅有锁定技标签的技能条件的时机发动此技能，然后你选择移去一张“访客”。若移去的是本次发动技能的“访客”，则你于此技能结算结束时摸一张牌。",
  //江山如故·承
  jsrg_sunce: "梦孙策",
  jsrg_sunce_prefix: "梦",
  jsrgduxing: "独行",
  jsrgduxing_info: "出牌阶段限一次。你可以视为使用一张可以指定任意名目标角色的【决斗】，且你与所有目标角色的红色手牌均视为【杀】直到此牌结算结束。",
  jsrgzhiheng: "猘横",
  jsrgzhiheng_info: "锁定技。当你因执行牌的效果对目标角色造成伤害时，若其于此回合响应过你使用过的牌，此伤害+1。",
  jsrgzhasi: "诈死",
  jsrgzhasi_info: "限定技。当你受到伤害值不小于你的体力值的伤害时，你可以防止此伤害，然后失去〖猘横〗并获得〖制衡〗。然后你不计入距离和座次计算直到你对其他角色使用牌后或当你受到伤害后。",
  jsrgbashi: "霸世",
  jsrgbashi_info: "主公技，每回合限四次，当你需要打出【杀】或【闪】时，你可以令其他吴势力角色选择是否打出一张【杀】或【闪】。若有角色响应，则视为你打出了一张【杀】或【闪】。",
  jsrg_xuyou: "承许攸",
  jsrg_xuyou_prefix: "承",
  jsrglipan: "离叛",
  jsrglipan_info: "回合结束时，你可以变更势力，然后摸X张牌并执行一个额外的出牌阶段。此阶段结束时，所有与你势力相同的角色依次可以将一张牌当【决斗】对你使用（X为与你势力相同的其他角色数）。",
  jsrgqingxi: "轻袭",
  jsrgqingxi_info: "群势力技。出牌阶段每名角色限一次。你可以选择一名手牌数小于你的角色，你将手牌数弃置至与其相同，然后视为对其使用一张刺【杀】。",
  jsrgjinmie: "烬灭",
  jsrgjinmie_info: "魏势力技。出牌阶段限一次。你可以选择一名手牌数大于你的角色，你视为对其使用一张火【杀】。当此牌造成伤害后，你将其手牌数弃置至与你相同。",
  jsrg_lvbu: "承吕布",
  jsrg_lvbu_prefix: "承",
  jsrgwuchang: "无常",
  jsrgwuchang_info: "锁定技。①当你获得其他角色的牌后，你变更势力为与其相同。②当你使用【杀】或【决斗】对与你势力相同的目标角色造成伤害时，此伤害+1，然后变更势力为群。",
  jsrgqingjiao: "轻狡",
  jsrgqingjiao_info: "群势力技。出牌阶段各限一次。你可以将一张牌当【推心置腹】/【趁火打劫】对一名手牌数大于/小于你的角色使用。",
  jsrgchengxu: "乘虚",
  jsrgchengxu_info: "蜀势力技。与你势力相同的其他角色不能响应你使用的牌。",
  jsrg_zhanghe: "承张郃",
  jsrg_zhanghe_prefix: "承",
  jsrgqiongtu: "穷途",
  jsrgqiongtu_info: "群势力技。每回合限一次。你可以将一张非基本牌置于武将牌上视为使用一张【无懈可击】。若此牌生效，你摸一张牌，否则你变更势力为魏并获得所有“穷途”牌。",
  jsrgxianzhu: "先著",
  jsrgxianzhu_info: "魏势力技。你可以将一张普通锦囊牌当无次数限制的【杀】使用。当此牌对唯一目标造成伤害后，你视为对该角色使用一张此普通锦囊牌。",
  jsrg_zoushi: "承邹氏",
  jsrg_zoushi_prefix: "承",
  jsrgguyin: "孤吟",
  jsrgguyin_info: "准备阶段，你可以翻面，且令所有其他男性角色依次选择是否翻面。然后你和所有背面朝上的角色轮流各摸一张牌，直到你们累计以此法得到X张牌（X为场上存活角色与死亡角色中男性角色数）。",
  jsrgzhangdeng: "帐灯",
  jsrgzhangdeng_info: "①当一名武将牌背面朝上的角色需要使用【酒】时，若你的武将牌背面朝上，其可以视为使用之。②当一名角色于一回合第二次发动〖帐灯①〗时，你将武将牌翻面至正面朝上。",
  jsrg_guanyu: "承关羽",
  jsrg_guanyu_prefix: "承",
  jsrgguanjue: "冠绝",
  jsrgguanjue_info: "锁定技。当你使用或打出有花色的牌时，你令所有其他角色于此回合内不能使用或打出该花色的牌。",
  jsrgnianen: "念恩",
  jsrgnianen_info: "你可以将一张牌当任意基本牌使用或打出，然后若此牌不为红色或你以此法使用或打出的牌不为普通【杀】，则直到此回合结束，该技能失效且你视为拥有〖马术〗。",
  jsrg_chendeng: "承陈登",
  jsrg_chendeng_prefix: "承",
  jsrglunshi: "论势",
  jsrglunshi_info: "出牌阶段限一次。你可以令一名角色摸等同于其攻击范围内角色数的牌（至多摸至五张），然后其弃置等同于攻击范围内含有其的角色数的牌。",
  jsrgguitu: "诡图",
  jsrgguitu_info: "准备阶段，你可以交换场上的两张武器牌，然后攻击范围以此法减少的角色回复1点体力。",
  jsrg_zhenji: "承甄宓",
  jsrg_zhenji_prefix: "承",
  jsrgjixiang: "济乡",
  jsrgjixiang_info: "回合内每种牌名限一次。当一名其他角色需要使用或打出一张基本牌时，你可以弃置一张牌令其视为使用或打出之，然后你摸一张牌并令〖称贤〗于此阶段可发动次数上限+1。",
  jsrgchengxian: "称贤",
  jsrgchengxian_info: "出牌阶段限两次。你可以将一张手牌当一张本回合未以此法使用过的普通锦囊牌使用（此转化牌须与以此法转化的手牌的合法目标数相同）。",
  jsrg_zhangliao: "承张辽",
  jsrg_zhangliao_prefix: "承",
  jsrgzhengbing: "整兵",
  jsrgzhengbing_info: "群势力技。出牌阶段限三次。你可以重铸一张牌，若此牌为：【杀】，你本回合手牌上限+2；【闪】，你摸一张牌；【桃】，你变更势力为魏。",
  jsrgtuwei: "突围",
  jsrgtuwei_info: "魏势力技。出牌阶段开始时，你可以获得攻击范围内任意名角色各一张牌。然后此回合结束时，这些角色中未于本回合受到过伤害的角色依次获得你的一张牌。",
  jsrg_xugong: "承许贡",
  jsrg_xugong_prefix: "承",
  jsrgbiaozhao: "表召",
  jsrgbiaozhao_info: "准备阶段，你可以选择一名其他角色。直到你的下回合开始时或你进入濒死时，其以外的角色对其使用牌无次数限制，且其对你使用的牌造成的伤害+1。",
  jsrgyechou: "业仇",
  jsrgyechou_info: "当你死亡时，你可以令一名其他角色获得如下效果：当其受到伤害值不小于其体力值的伤害时，其令此伤害翻倍。",
  jsrg_chunyuqiong: "承淳于琼",
  jsrg_chunyuqiong_prefix: "承",
  jsrgcangchu: "仓储",
  jsrgcangchu_info: "一名角色的结束阶段，你可以令至多X名角色各摸一张牌，若X大于存活角色数，则改为各摸两张牌（X为你于此回合得到的牌数）。",
  jsrgshishou: "失守",
  jsrgshishou_info: "锁定技。①当你使用【酒】时，你摸三张牌，然后你本回合不能再使用牌。②当你受到火焰伤害后，你令〖仓储〗失效直到你的下回合结束后。",
  //江山如故·转
  ying: "影",
  ying_info: "当此牌进入弃牌堆后，系统将此牌移出游戏。",
  jsrg_guojia: "梦郭嘉",
  jsrg_guojia_prefix: "梦",
  jsrgqingzi: "轻辎",
  jsrgqingzi_info: "准备阶段，你可以弃置任意名其他角色装备区里的各一张牌，然后令这些角色获得〖神速〗直到你的下回合开始。",
  jsrgdingce: "定策",
  jsrgdingce_info: "当你受到伤害后，你可以依次弃置你与伤害来源的各一张手牌。若这两张牌颜色相同，你视为使用一张【洞烛先机】。",
  jsrgzhenfeng: "针锋",
  jsrgzhenfeng_info: "出牌阶段每种类别各限一次。你可以视为使用一张存活角色的技能描述中包含的基本牌或普通锦囊牌（无距离和次数限制）。当此牌对技能描述中包含此牌的角色生效时，你对其造成1点伤害。",
  jsrg_zhangfei: "转张飞",
  jsrg_zhangfei_prefix: "转",
  jsrgbaohe: "暴喝",
  jsrgbaohe_info: "一名角色的出牌阶段结束时，你可以弃置两张牌，然后视为你对攻击范围内包含其的所有角色使用一张【杀】。当一名角色使用牌响应此【杀】后，此【杀】对后续目标角色造成的伤害+1。",
  jsrgxushi: "虚势",
  jsrgxushi_info: "出牌阶段限一次。你可以交给任意名角色各一张牌，然后你获得两倍数量的【影】。",
  jsrg_machao: "转马超",
  jsrg_machao_prefix: "转",
  jsrgzhuiming: "追命",
  jsrgzhuiming_info: "当你使用【杀】指定唯一目标后，你可以声明一种颜色并令目标角色弃置任意张牌，然后你展示目标角色一张牌。若此牌颜色与你声明的颜色相同，则此【杀】不计入次数限制、不可被响应且伤害+1。",
  jsrg_lougui: "转娄圭",
  jsrg_lougui_prefix: "转",
  jsrgshacheng: "沙城",
  jsrgshacheng_info: "①游戏开始时，你将牌堆顶的两张牌置于武将牌上，称为“城”。②当一名角色使用【杀】结算结束后，你可以移去一张“城”，令此牌的其中一名目标角色摸X张牌（X为该角色本回合失去过的牌数且至多为5）。",
  jsrgninghan: "凝寒",
  jsrgninghan_info: "锁定技。①所有角色手牌中的♣【杀】均视为冰【杀】。②当一名角色受到冰冻伤害后，你将造成此伤害的牌对应的实体牌置入“城”。",
  jsrg_zhangren: "转张任",
  jsrg_zhangren_prefix: "转",
  jsrgfuni: "伏匿",
  jsrgfuni_info: "锁定技。①你的攻击范围终值为0。②每轮开始时，你令任意名角色获得共计X张【影】（X为存活角色数的一半，向上取整）。③当有牌进入弃牌堆后，若其中有【影】，你于本回合使用牌无距离限制且不能被响应。",
  jsrgchuanxin: "穿心",
  jsrgchuanxin_info: "一名角色的结束阶段，你可以将一张牌当【杀】使用。当一名角色受到渠道为此【杀】的伤害时，此伤害+Y（Y为其本回合回复过的体力值）。",
  jsrg_huangzhong: "转黄忠",
  jsrg_huangzhong_prefix: "转",
  jsrgcuifeng: "摧锋",
  jsrgcuifeng_info: "限定技。出牌阶段，你可以视为使用一张单目标的伤害类牌（无距离限制）。此回合结束时，若此牌目标本回合受到的伤害值之和不为1，你重置武将牌上的所有技能。",
  jsrgdengnan: "登难",
  jsrgdengnan_info: "限定技。出牌阶段，你可以视为使用一张非伤害类普通锦囊牌。此回合结束时，若此牌的目标均于此回合受到过伤害，你重置武将牌上的所有技能。",
  jsrg_xiahourong: "转夏侯荣",
  jsrg_xiahourong_prefix: "转",
  jsrgfenjian: "奋剑",
  jsrgfenjian_info: "每回合各限一次。当你需要对其他角色使用【决斗】或【桃】时，你可以令你本回合受到的伤害+1，视为使用之。",
  jsrg_sunshangxiang: "转孙尚香",
  jsrg_sunshangxiang_prefix: "转",
  jsrgguiji: "闺忌",
  jsrgguiji_info: "每回合限一次。出牌阶段，你可以与一名手牌数小于你的男性角色交换手牌。然后其下个出牌阶段结束时，你可以与其交换手牌。",
  jsrgjiaohao: "骄豪",
  jsrgjiaohao_info: "①其他角色的出牌阶段限一次。其可以将手牌中的一张装备牌置于你的装备区。②准备阶段，你获得X张【影】（X为你空置装备栏数的一半，向上取整）。",
  jsrg_pangtong: "转庞统",
  jsrg_pangtong_prefix: "转",
  jsrgmanjuan: "漫卷",
  jsrgmanjuan_info: "若你没有手牌，你可以如手牌般使用或打出于本回合进入弃牌堆的牌（每种点数每回合限一次）。",
  jsrgyangming: "养名",
  jsrgyangming_info: "出牌阶段限一次。你可以与一名角色拼点，若其：没赢，你可以与其重复此流程；赢，其摸X张牌，然后你回复1点体力（X为其此阶段没赢的次数）。",
  jsrg_hansui: "转韩遂",
  jsrg_hansui_prefix: "转",
  jsrgniluan: "逆乱",
  jsrgniluan_info: "准备阶段，你可以选择任意项：1.弃置一张牌，对一名未对你造成过伤害的角色造成1点伤害；2.令一名对你造成过伤害的角色摸两张牌。",
  jsrghuchou: "互雠",
  jsrghuchou_info: "锁定技。当你对最后对你使用伤害类牌的角色造成伤害时，此伤害+1。",
  jsrgjiemeng: "皆盟",
  jsrgjiemeng_info: "主公技，锁定技。所有群势力角色至其他角色的距离-X（X为群势力角色数）。",
  jsrg_zhangchu: "转张楚",
  jsrg_zhangchu_prefix: "转",
  jsrghuozhong: "惑众",
  jsrghuozhong_info: "所有角色出牌阶段限一次。其可以将一张黑色非锦囊牌当【兵粮寸断】置于其判定区，然后令你摸两张牌。",
  jsrgrihui: "日彗",
  jsrgrihui_info: "①当你使用【杀】对目标角色造成伤害后，你可以令判定区有牌的其他角色各摸一张牌。②你于一回合内对判定区没有牌的角色使用的第一张【杀】无任何次数限制。",
  jsrg_xiahouen: "转夏侯恩",
  jsrg_xiahouen_prefix: "转",
  jsrghujian: "护剑",
  jsrghujian_info: "①游戏开始时，你从游戏外获得一张【赤血青锋】。②一名角色的回合结束时，此回合最后一名使用或打出牌的角色可以获得弃牌堆中的【赤血青锋】。",
  jsrgshili: "恃力",
  jsrgshili_info: "出牌阶段限一次。你可以将一张手牌中的装备牌当【决斗】使用。",
  jsrg_fanjiangzhangda: "转范强张达",
  jsrg_fanjiangzhangda_ab: "转范疆张达",
  jsrg_fanjiangzhangda_prefix: "转",
  jsrgfushan: "负山",
  jsrgfushan_info: "出牌阶段开始时，所有其他角色可以依次交给你一张牌并令你此阶段使用【杀】的次数上限+1。此阶段结束时，若你使用【杀】的次数未达到上限且此阶段以此法交给你牌的角色均存活，你失去2点体力，否则你将手牌摸至体力上限。",
  //江山如故·合
  jsrg_zhugeliang: "梦诸葛亮",
  jsrg_zhugeliang_prefix: "梦",
  jsrgwentian: "问天",
  jsrgwentian_info: "①你可以将牌堆顶的牌当【无懈可击】/【火攻】使用，若此牌不为黑色/红色，〖问天〗于本轮失效。②每回合限一次。你的一个阶段开始时，你可以观看牌堆顶的五张牌，然后将其中一张牌交给一名其他角色，将其余牌以任意顺序置于牌堆顶或牌堆底。",
  jsrgchushi: "出师",
  jsrgchushi_info: "出牌阶段限一次。若你不为主公，你可以与主公议事。若结果为：红色，你与其各摸一张牌，若你与其手牌数之和小于7，重复此流程；黑色，当你于本轮内造成属性伤害时，此伤害+1。",
  jsrgyinlve: "隐略",
  jsrgyinlve_info: "每轮各限一次。当一名角色受到火焰/雷电伤害时，你可以防止此伤害，然后于当前回合结束后执行一个只有摸牌/弃牌阶段的回合。",
  jsrg_jiangwei: "合姜维",
  jsrg_jiangwei_prefix: "合",
  jsrgjinfa: "矜伐",
  jsrgjinfa_info: "出牌阶段限一次。你可以展示一张手牌，然后令所有体力上限不大于你的角色议事。若结果与此牌颜色：相同，你令其中至多两名角色将手牌摸至体力上限；不同，你获得两张【影】。然后若没有其他角色与你意见相同，你可以变更势力。",
  jsrgfumou: "复谋",
  jsrgfumou_info: "魏势力技。当你议事结算结束后，与你意见不同的角色本回合不能使用或打出与其意见颜色相同的牌，你可以将一张【影】当【出其不意】对一名与你意见不同的角色使用。",
  jsrgxuanfeng: "选锋",
  jsrgxuanfeng_info: "蜀势力技。你可以将一张【影】当无距离和次数限制的刺【杀】使用。",
  jsrg_luxun: "合陆逊",
  jsrg_luxun_prefix: "合",
  jsrgyoujin: "诱进",
  jsrgyoujin_info: "出牌阶段开始时，你可以与一名角色拼点，你与其本回合不能使用或打出点数小于自己拼点牌的手牌，且赢的角色视为对没赢的角色使用一张【杀】。",
  jsrgdailao: "待劳",
  jsrgdailao_info: "出牌阶段，若你没有可以使用的手牌，你可以展示所有手牌并摸两张牌，然后结束此回合。",
  jsrgzhubei: "逐北",
  jsrgzhubei_info: "锁定技。①当你对本回合受到过伤害的角色造成伤害时，此伤害+1。②你对本回合失去过最后手牌的角色使用牌无次数限制。",
  jsrg_zhaoyun: "合赵云",
  jsrg_zhaoyun_prefix: "合",
  jsrglonglin: "龙临",
  jsrglonglin_info: "其他角色于其出牌阶段内首次使用【杀】指定第一个目标后，你可以弃置一张牌令此【杀】无效，然后其可以视为对你使用一张【决斗】，你以此法造成伤害后，其本阶段不能再使用手牌。",
  jsrgzhendan: "镇胆",
  jsrgzhendan_info: "①你可以将一张非基本手牌当任意基本牌使用或打出。②当你受到伤害后或每轮结束时，你摸X张牌并令该技能本轮失效（X为本轮所有角色执行过的回合数且至多为5）。",
  jsrg_simayi: "合司马懿",
  jsrg_simayi_prefix: "合",
  jsrgyingshi: "鹰眎",
  jsrgyingshi_info: "当你翻面时，你可以观看牌堆底的三张牌（若死亡角色数大于2则改为五张），然后将其中任意数量的牌以任意顺序置于牌堆顶，其余以任意顺序置于牌堆底。",
  jsrgtuigu: "蜕骨",
  jsrgtuigu_info: "①回合开始时，你可以翻面并令你本回合的手牌上限+X，然后摸X张牌并视为使用一张【解甲归田】（X为存活角色数的一半，向下取整），目标角色不能使用以此法得到的牌直到其回合结束。②每轮结束时，若你本轮未执行过回合，则你执行一个额外回合。③当你失去装备区里的牌后，你回复1点体力。",
  jsrg_guoxun: "合郭循",
  jsrg_guoxun_prefix: "合",
  jsrgeqian: "遏前",
  jsrgeqian_info: "①结束阶段，你可以蓄谋任意次。②当你使用【杀】或蓄谋牌指定其他角色为唯一目标后，你可以令此牌不计入次数限制并获得目标一张牌，然后其可以令你本回合至其的距离+2。",
  jsrgfusha: "伏杀",
  jsrgfusha_info: "限定技。出牌阶段，若你的攻击范围内仅有一名角色，你可以对其造成X点伤害（X为你的攻击范围，至多为游戏人数）。",
  jsrg_sunlubansunluyu: "合大小虎",
  jsrg_sunlubansunluyu_prefix: "合",
  jsrgdaimou: "殆谋",
  jsrgdaimou_info: "每回合各限一次。当一名角色使用【杀】指定其他角色/你为目标时，你可以用牌堆顶的牌蓄谋/你须弃置你区域里的一张蓄谋牌。",
  jsrgfangjie: "芳洁",
  jsrgfangjie_info: "准备阶段，若你没有蓄谋牌，你回复1点体力并摸一张牌，否则你可以弃置你区域里的任意张蓄谋牌并失去〖芳洁〗。",
  jsrg_caofang: "合曹芳",
  jsrg_caofang_prefix: "合",
  jsrgzhaotu: "诏图",
  jsrgzhaotu_info: "每轮限一次。你可以将一张红色非锦囊牌当【乐不思蜀】使用，然后当前回合结束后，目标执行一个手牌上限-2的额外回合。",
  jsrgjingju: "惊惧",
  jsrgjingju_info: "当你需要使用任意一种基本牌时，你可以将其他角色判定区里的一张牌移动至你的判定区，视为你使用之。",
  jsrgweizhui: "危坠",
  jsrgweizhui_info: "主公技。其他魏势力角色的结束阶段，其可以将一张黑色手牌当【过河拆桥】对你使用。",
  jsrg_sunjun: "合孙峻",
  jsrg_sunjun_prefix: "合",
  jsrgyaoyan: "邀宴",
  jsrgyaoyan_info: "准备阶段，你可以令所有角色依次选择是否于回合结束时议事，若议事结果为：红色，你获得任意名未议事的角色各一张手牌；黑色，你可以对一名议事的角色造成2点伤害。",
  jsrgbazheng: "霸政",
  jsrgbazheng_info: "当你参与的议事展示意见时，本回合受到过你伤害的角色意见视为与你相同。",
  jsrg_liuyong: "合刘永",
  jsrg_liuyong_prefix: "合",
  jsrgdanxin: "丹心",
  jsrgdanxin_info: "你可以将X张牌当【推心置腹】使用（X为本回合此技能发动次数），你展示以此法交出与得到的牌，以此法得到♥牌的角色回复1点体力并摸一张牌，然后你至目标角色的距离+1直到回合结束。",
  jsrgfengxiang: "封乡",
  jsrgfengxiang_info: "锁定技，你每回合首次造成或受到伤害后，你与一名其他角色交换装备区里的所有牌。若你装备区里的牌因此减少，你摸等同于减少牌数的牌。",
  jsrg_weiwenzhugezhi: "合卫温诸葛直",
  jsrg_weiwenzhugezhi_prefix: "合",
  jsrgfuhai: "浮海",
  jsrgfuhai_info: "出牌阶段限一次。你可以令所有有手牌的其他角色同时展示一张手牌，然后你选择一个方向并摸X张牌（X为该方向上的角色展示的点数连续严格递增或严格递减的牌数，至少为1）。",
  jsrg_zhangxuan: "合张嫙",
  jsrg_zhangxuan_prefix: "合",
  jsrgtongli: "同礼",
  jsrgtongli_info: "当你于出牌阶段内使用基本牌或普通锦囊牌指定第一个目标后，若你手牌中的花色数和你于本阶段内使用过的牌数相等，则你可以展示所有手牌，令此牌额外结算一次。",
  jsrgshezang: "奢葬",
  jsrgshezang_info: "每轮限一次。当你或你回合内的其他角色进入濒死状态时，你可以亮出牌堆顶的四张牌，获得其中任意张花色各不相同的牌。",
  jsrg_gaoxiang: "合高翔",
  jsrg_gaoxiang_prefix: "合",
  jsrgchiying: "驰应",
  jsrgchiying_info: "出牌阶段限一次。你可以选择一名角色，令其攻击范围内的其他角色依次弃置一张牌。若以此法弃置的基本牌数不大于其体力值，其获得这些基本牌。",
  jsrg_guozhao: "合郭照",
  jsrg_guozhao_prefix: "合",
  jsrgpianchong: "偏宠",
  jsrgpianchong_info: "一名角色的结束阶段，若你于此回合内失去过牌，你可以判定。若结果为红色/黑色，你摸此回合进入弃牌堆的红色/黑色牌数量的牌。",
  jsrgzunwei: "尊位",
  jsrgzunwei_info: "出牌阶段限一次。你可以选择一名其他角色并选择执行一项，然后移除该选项：1.将手牌数摸至与该角色相同（最多摸五张）；2.将其装备牌移至你的装备区，直到你装备区的牌数不少于其；3.将体力值回复至与该角色相同。",
  xumou_jsrg: "蓄谋",
  xumou_jsrg_info: "“蓄谋”牌可在判定区内重复存在。判定阶段开始时，你选择一项：⒈使用此牌对应的实体牌，然后本阶段不能再使用此牌名的牌；⒉将所有的“蓄谋”牌置入弃牌堆。",
  jsrg_yuanshao: "梦袁绍",
  jsrg_yuanshao_prefix: "梦",
  jsrgzhimeng: "执盟",
  jsrgzhimeng_info: "准备阶段，你可以亮出牌堆顶的Ｘ张牌（Ｘ为存活角色数），然后令所有角色同时展示一张手牌。若有角色展示的手牌花色与其他角色均不同，则这些角色从亮出牌中获得该花色的所有牌。",
  jsrgtianyu: "天予",
  jsrgtianyu_info: "当一张具有“伤害”标签的牌或装备牌被置入弃牌堆时，若此牌本回合内未处于过任何角色的手牌区或装备区，则你可以获得之。",
  jsrgzhuni: "诛逆",
  jsrgzhuni_info: "出牌阶段限一次，你可以令所有角色同时选择一名除你之外的其他角色。若有角色本回合内被指定过的次数唯一最多，则你本回合内对该角色使用牌没有次数和距离限制。",
  jsrghezhi: "合志",
  jsrghezhi_info: "主公技，锁定技。其他群势力角色需要因〖诛逆〗而选择角色时，改为选择你本次选择的角色。",
  jsrg_caojiewangfu: "衰曹节王甫",
  jsrg_caojiewangfu_prefix: "衰",
  jsrgzonghai: "纵害",
  jsrgzonghai_info: "每轮限一次。当有其他角色进入濒死状态时，你可以令其选择至多两名角色。未被选择的角色不能于此次濒死结算中使用牌，且此次濒死状态结算结束后，你对其选择的角色各造成１点伤害。",
  jsrgjueyin: "绝禋",
  jsrgjueyin_info: "当你于一回合内首次受到伤害后，你可以摸三张牌，然后本回合内所有角色受到的伤害+1。",
  jsrg_songhuanghou: "衰宋皇后",
  jsrg_songhuanghou_prefix: "衰",
  jsrgzhongzen: "众谮",
  jsrgzhongzen_info: "锁定技。①弃牌阶段开始时，你令所有手牌数小于你的角色各交给你一张手牌。②弃牌阶段结束时，若你本阶段弃置的♠牌数大于你的体力值，则你弃置所有牌。",
  jsrgxuchong: "虚宠",
  jsrgxuchong_info: "当你成为牌的目标后，你可以选择一项：⒈摸一张牌；⒉令当前回合角色本回合的手牌上限+2。选择完成后，你获得一张【影】。",
  jsrg_zhangjiao: "衰张角",
  jsrg_zhangjiao_prefix: "衰",
  jsrgxiangru: "相濡",
  jsrgxiangru_info: "当一名已受伤的其他角色／你受到致命伤害时，你／已受伤的其他角色可以交给伤害来源两张牌，然后防止此伤害。",
  jsrgwudao: "悟道",
  jsrgwudao_info: `觉醒技。一名角色进入濒死状态时，若你没有手牌，则你加１点体力上限并回复１点体力，然后获得${get.poptip("jsrgjinglei")}。`,
  jsrgjinglei: "惊雷",
  jsrgjinglei_info: "准备阶段，你可以选择一名其他角色Ａ，然后选择任意名手牌数之和小于Ａ的角色，令这些角色依次对Ａ造成１点雷属性伤害。",
  jsrg_yangqiu: "衰阳球",
  jsrg_yangqiu_prefix: "衰",
  jsrgsaojian: "扫奸",
  jsrgsaojian_info: "出牌阶段限一次，你可以观看一名其他角色的手牌，然后展示其中的一张（对该角色自己不可见）。然后该角色重复弃置一张手牌，直到其以此法弃置了五张牌／弃置了你选择的牌／没有可弃置的手牌。若其弃置完成后的手牌数大于你，则你失去１点体力。",
  mbsaojian: "扫奸",
  mbsaojian_info: "出牌阶段限一次，你可以观看一名其他角色的手牌并选择其中的一张，然后该角色重复弃置一张手牌，直到其以此法弃置了五张牌／弃置了你选择的牌／没有可弃置的手牌。",
  jsrg_dongzhuo: "衰董卓",
  jsrg_dongzhuo_prefix: "衰",
  jsrgguanshi: "观势",
  jsrgguanshi_info: "出牌阶段限一次，你可以将【杀】当作【火攻】对任意名角色使用。当此【火攻】对一名目标角色结算结束后，若未对其造成伤害，则此牌对其余目标角色改为以【决斗】的形式结算。",
  jsrgcangxiong: "藏凶",
  jsrgcangxiong_info: "当你因弃置或被其他角色得到牌而失去一张牌后，你可以用此牌蓄谋。然后若此时在你的出牌阶段内，则你摸一张牌。",
  jsrgjiebing: "劫柄",
  jsrgjiebing_info_identity: "觉醒技。准备阶段，若你的蓄谋牌数大于主公的体力值，则你加２点体力上限并回复２点体力，然后获得〖暴威〗。",
  jsrgjiebing_info: "觉醒技。准备阶段，若你的蓄谋牌数大于一号位的体力值，则你加２点体力上限并回复２点体力，然后获得〖暴威〗。",
  jsrgbaowei: "暴威",
  jsrgbaowei_info: "锁定技。结束阶段，若本回合内使用或打出过牌的其他角色数：大于２，则你失去２点体力；不大于２，则你对其中一名角色造成２点伤害。",
  jsrg_zhanghuan: "衰张奂",
  jsrg_zhanghuan_prefix: "衰",
  jsrgzhushou: "诛首",
  jsrgzhushou_info: "一名角色的回合结束时，若你于本回合内失去过牌，则你可以选择弃牌堆中本回合置入的点数唯一最大的牌，并对本回合失去过此牌的一名角色造成1点伤害。",
  jsrgyangge: "扬戈",
  jsrgyangge_mizhao: "密诏",
  jsrgyangge_info: "每轮限一次。体力值最低的其他角色可以于其出牌阶段内对你发动〖密诏〗。",
  jsrg_liubiao: "衰刘表",
  jsrg_liubiao_prefix: "衰",
  jsrgyansha: "宴杀",
  jsrgyansha_info: "准备阶段，你可以视为对任意名角色使用【五谷丰登】。此牌结算结束后，所有非目标角色可以依次将一张装备牌当作【杀】对其中一名目标角色使用。",
  jsrgqingping: "清平",
  jsrgqingping_info: "结束阶段，若你攻击范围内的角色均有手牌且手牌数均不大于你，则你可以摸等同于这些角色数的牌。",
  jsrg_yl_luzhi: "衰卢植",
  jsrg_yl_luzhi_prefix: "衰",
  jsrgruzong: "儒宗",
  jsrgruzong_info: "回合结束时，若你本回合使用牌指定过的目标角色仅有一名，则你可以将手牌数摸至与其相同。若该角色为你自己，则你可以改为令任意名其他角色将手牌摸至与你相同（均至多摸五张）。",
  jsrgdaoren: "蹈刃",
  jsrgdaoren_info: "出牌阶段限一次，你可以将一张手牌交给一名其他角色，然后对你与其攻击范围内均包含的所有角色各造成１点伤害。",
  jsrg_chenfan: "衰陈蕃",
  jsrg_chenfan_prefix: "衰",
  jsrggangfen: "刚忿",
  jsrggangfen_info: "当手牌数大于你的角色使用【杀】指定其他角色为目标时，你可以成为此【杀】的额外目标，并令所有其他角色也选择是否如此做。然后使用者展示其手牌，若其黑色手牌数小于目标数，则取消此【杀】的所有目标。",
  jsrgdangren: "当仁",
  jsrgdangren_info: "转换技。阳：当你需要对自己使用【桃】时，你可以视为使用之。阴：当你可以对其他角色使用【桃】时，你须视为使用之。",
  jsrg_zhangju: "衰张举",
  jsrg_zhangju_prefix: "衰",
  jsrgqiluan: "起乱",
  jsrgqiluan_info: "每回合限两次。当你需要使用【杀】或【闪】时，你可以弃置任意张牌，并令至多等量名其他角色选择是否代替你使用之。若有角色响应，则你摸等同与你弃置牌数的牌。",
  jsrgxiangjia: "相假",
  jsrgxiangjia_info: "出牌阶段限一次。若你的装备区内有武器牌，则你可以视为使用一张【借刀杀人】。然后此牌的目标角色可以视为对你使用一张【借刀杀人】。",
  //江山如故·兴
  jsrg_jiananfeng: "兴贾南风",
  jsrg_jiananfeng_prefix: "兴",
  jsrgshanzheng: "擅政",
  jsrgshanzheng_info: "出牌阶段限一次，你可以与任意名角色议事，若结果为：红色，你可对一名未参加议事的角色造成1点伤害；黑色，你获得所有意见牌。",
  jsrgxiongbao: "凶暴",
  jsrgxiongbao_info: "你参与议事时，可以额外展示一张手牌，若如此做，其他角色改为随机展示手牌。",
  jsrgliedu: "烈妒",
  jsrgliedu_info: "锁定技，其他女性角色和手牌数大于你的角色不能响应你使用的牌。",
  jsrg_wenyang: "兴文鸯",
  jsrg_wenyang_prefix: "兴",
  jsrg_zhugedan: "兴诸葛诞",
  jsrg_zhugedan_prefix: "兴",
  jsrg_wangjun: "兴王濬",
  jsrg_wangjun_prefix: "兴",
  jsrg_limi: "兴李密",
  jsrg_limi_prefix: "兴",
  jsrgfuzhen: "覆阵",
  jsrgfuzhen_info: "准备阶段，你可秘密选择一名其他角色，然后失去1点体力并视为对其在内的至多三名角色使用一张雷【杀】。此牌结算完成后，你摸此牌造成伤害值张牌，若未对秘密选择的角色造成伤害，你视为对这些角色再使用一张雷【杀】。",
  jsrgbeizhi: "悖志",
  jsrgbeizhi_info: "出牌阶段限一次，你可以与一名角色拼点，赢的角色需视为对包含没赢角色在内的三名角色使用一张【决斗】（不足则全选），此牌造成伤害后，伤害来源获得受伤角色的一张牌。",
  jsrgshenji: "深忌",
  jsrgshenji_info: "锁定技，以你为目标的牌若有其他目标，则你最后结算此牌的效果。",
  jsrgzuozhan: "坐瞻",
  jsrgzuozhan_info: "游戏开始时，你选择你与至多两名其他角色，你的攻击范围+X（X为选择角色中最高的体力值且至多为5）。一名“坐瞻”角色死亡后，你令一名存活的“坐瞻”角色从弃牌堆获得至多X张牌名各不相同的基本牌。",
  jsrgcuibing: "摧冰",
  jsrgcuibing_info: "锁定技，出牌阶段结束时，你将手牌摸或弃至X张（X为你攻击范围内的角色且至多为5）。若你因此弃置了牌，你弃置场上至多等量张牌，否则跳过本回合弃牌阶段。",
  jsrglangan: "阑干",
  jsrglangan_info: "锁定技，其他角色死亡后，你回复1点体力并摸两张牌，然后你的攻击范围-1（至多-3）。",
  jsrgchengliu: "乘流",
  jsrgchengliu_info: "准备阶段，你可对一名装备区内牌数小于你的角色造成X点伤害（X为你本回合发动〖乘流〗的次数），然后你可以弃置装备区里的一张牌并对一名本回合未以此法选择过的角色重复此流程。",
  jsrgjianlou: "舰楼",
  jsrgjianlou_info: "每回合限一次，当场上一张装备牌进入弃牌堆时，你可以弃置一张牌并获得之，然后若此牌对应的装备栏中没有牌，你使用之。",
  jsrgciyin: "辞应",
  jsrgciyin_info: "每回合限一次，你可以将至少X张牌当作任意基本牌使用或打出（X为此回合未进入过弃牌堆的花色数且至少为1）。此牌结算完成后，若本回合所有花色的牌均进入过弃牌堆，你将手牌摸至体力上限。",
  jsrgchendu: "陈笃",
  jsrgchendu_info: "锁定技，你的牌因使用、打出或弃置而进入弃牌堆时，若这些牌的数量大于你的体力值，你将这些牌交给至多等量名其他角色（若不为你的回合，选择的角色需包括当前回合角色）。",
  jsrg_simazhao: "梦司马昭",
  jsrg_simazhao_prefix: "梦",
  jin_jsrg_simazhao: "梦司马昭",
  jin_jsrg_simazhao_prefix: "梦",
  jsrg_dengai: "兴邓艾",
  jsrg_dengai_prefix: "兴",
  jsrgqiantun: "谦吞",
  jsrgqiantun_info: "出牌阶段限一次，你可以令一名其他角色展示至少一张手牌，然后与其拼点，其本次拼点只能从展示牌中选择。若你赢，你获得其展示的手牌；若你没赢，你获得其未展示的手牌。然后你展示手牌。",
  jsrgqiantun_tag: "invisible",
  jsrgxiezheng: "挟征",
  jsrgxiezheng_info: "结束阶段，你可以令至多三名角色依次将一张手牌置于牌堆顶，然后视为你使用一张【兵临城下】；此牌结算完成后若未造成伤害，你失去1点体力。",
  jsrgzhaoxiong: "昭凶",
  jsrgzhaoxiong_info: "限定技，准备阶段，若你已受伤且发动过〖挟征〗，你可以变更势力为晋，失去〖谦吞〗并获得〖威肆〗和〖荡异〗。",
  jsrgweisi: "威肆",
  jsrgweisi_info: "出牌阶段限一次，你可以选择一名其他角色，令其将任意张手牌移出游戏直到回合结束，然后视为对其使用一张【决斗】；此牌对其造成伤害后，你获得其所有手牌。",
  jsrgdangyi: "荡异",
  jsrgdangyi_info: "主公技，每局游戏限X次，你造成伤害时可以令此伤害+1（X为你获得此技能时的已损失体力值+1）。",
  jsrgpiqi: "辟奇",
  jsrgpiqi_info: "出牌阶段限两次，你可以视为使用一张无距离限制的【顺手牵羊】（不能指定相同目标），与目标距离1以内的角色本回合可以将【闪】当【无懈可击】使用。",
  jsrgzhoulin: "骤临",
  jsrgzhoulin_info: "你使用【杀】对一名角色造成伤害时，若本回合开始时其不在你攻击范围内，此伤害+1。",
  jsrg_simaliang: "兴司马亮",
  jsrg_simaliang_prefix: "兴",
  jsrgsheju: "慑惧",
  jsrgsheju_info: "锁定技，当你使用【杀】指定唯一目标后/成为【杀】的唯一目标后，你与目标角色/此牌使用者议事，若结果为黑色，则双方各减1点体力上限；否则意见为黑色的角色摸两张牌。",
  jsrgzuwang: "族望",
  jsrgzuwang_info: "锁定技，准备阶段和结束阶段，你将手牌数摸至体力上限。",
  jsrgzuwang_append: '<span style="font-family: yuanli">“公何不讨人而惧为人所讨！”——何勖</span>',
  jsrg_tufashujineng: "兴秃发树机能",
  jsrg_tufashujineng_prefix: "兴",
  jsrgqinrao: "侵扰",
  jsrgqinrao_info: "其他角色的出牌阶段开始时，你可以将一张牌当作【决斗】对其使用。此牌结算过程中，若其手牌中有可打出的【杀】，则其必须打出；否则其展示手牌。",
  jsrgfuran: "复燃",
  jsrgfuran_info: "当你受到有来源造成的伤害后，若你不在其攻击范围内，则你可以于本回合结束时回复1点体力。",
  jsrg_lukang: "兴陆抗",
  jsrg_lukang_prefix: "兴",
  jsrgzhuwei: "筑围",
  jsrgzhuwei_info: "出牌阶段限一次，你可以移动场上的一张装备牌，然后你可以令一名攻击范围内因此没有角色的角色失去2点体力。",
  jsrgkuangjian: "匡谏",
  jsrgkuangjian_info: "你可以将一张装备牌当作任意基本牌使用（无次数限制但不可指定自己为目标），然后目标角色使用此装备牌。",
  jsrg_malong: "兴马隆",
  jsrg_malong_prefix: "兴",
  jsrgfennan: "奋难",
  jsrgfennan_info: "出牌阶段限两次，你可以令一名角色选择一项：①令你将武将牌翻面，然后你移动其场上一张本回合未被移动过的牌；②令你观看其手牌并可以重铸其中至多三张牌。",
  jsrgxunji: "勋济",
  jsrgxunji_info: "结束阶段，若你本回合对本回合使用牌指定过的其他角色均造成过伤害，则你可以将本回合造成过伤害的牌对应的位于弃牌堆的实体牌分配给任意角色各一张。"
};
const characterTitles = {
  jsrg_liuhong: "轧庭焚礼",
  jsrg_hejin: "独意误国谋",
  jsrg_sunjian: "拨定烈志",
  jsrg_huangfusong: "安危定倾",
  jsrg_xushao: "识人读心",
  jsrg_dongbai: "魔姬",
  jsrg_qiaoxuan: "泛爱博容",
  jsrg_yangbiao: "德彰海内",
  jsrg_kongrong: "北海太守",
  jsrg_zhujun: "征无遗虑",
  jsrg_liubei: "负戎荷戈",
  jsrg_wangyun: "居功自矜",
  jsrg_liuyan: "裂土之宗",
  jsrg_caocao: "汉征西将军",
  jsrg_nanhualaoxian: "冯虚御风",
  jsrg_sunce: "问鼎的霸王",
  jsrg_xuyou: "毕方矫翼",
  jsrg_lvbu: "虎视中原",
  jsrg_zhanghe: "微子去殷",
  jsrg_zoushi: "淯水香魂",
  jsrg_guanyu: "羊左之义",
  jsrg_chendeng: "惊涛弄潮",
  jsrg_zhenji: "一顾倾国",
  jsrg_zhangliao: "利刃风骑",
  jsrg_xugong: "独计击流",
  jsrg_chunyuqiong: "乌巢酒仙",
  jsrg_guojia: "赤壁的先知",
  jsrg_zhangfei: "长坂之威",
  jsrg_machao: "潼关之勇",
  jsrg_lougui: "梦梅居士",
  jsrg_zhangren: "索命神射",
  jsrg_huangzhong: "定军之英",
  jsrg_xiahourong: "擐甲执兵",
  jsrg_sunshangxiang: "情断吴江",
  jsrg_pangtong: "荆楚之高俊",
  jsrg_hansui: "雄踞北疆",
  jsrg_zhangchu: "大贤后裔",
  jsrg_xiahouen: "背剑之将",
  jsrg_fanjiangzhangda: "你死我亡",
  jsrg_zhugeliang: "炎汉忠魂",
  jsrg_jiangwei: "赤血化龙",
  jsrg_luxun: "却敌安疆",
  jsrg_zhaoyun: "北伐之柱",
  jsrg_simayi: "危崖隐羽",
  jsrg_guoxun: "秉心不回",
  jsrg_sunlubansunluyu: "恶紫夺朱",
  jsrg_caofang: "引狼入庙",
  jsrg_sunjun: "朋党执虎",
  jsrg_liuyong: "甘陵王",
  jsrg_weiwenzhugezhi: "帆至夷洲",
  jsrg_zhangxuan: "玉宇嫁蔷",
  jsrg_gaoxiang: "玄乡侯",
  jsrg_guozhao: "碧海青天",
  jsrg_yuanshao: "号令天下",
  jsrg_caojiewangfu: "浊乱海内",
  jsrg_songhuanghou: "兰心蕙质",
  jsrg_zhangjiao: "万蛾赴火",
  jsrg_yangqiu: "身蹈水火",
  jsrg_dongzhuo: "华夏震栗",
  jsrg_zhanghuan: "正身洁己",
  jsrg_liubiao: "单骑入荆",
  jsrg_yl_luzhi: "眸宿渊渟",
  jsrg_chenfan: "不畏强御",
  jsrg_zhangju: "草头天子",
  jsrg_jiananfeng: "凤啸峻旹",
  jsrg_wenyang: "貔貅若拒",
  jsrg_zhugedan: "护国孤獒",
  jsrg_wangjun: "顺流长驱",
  jsrg_limi: "情切哺乌",
  jsrg_simazhao: "堕节肇业",
  jin_jsrg_simazhao: "独祅吞天",
  jsrg_dengai: "策袭鼎迁",
  jsrg_simaliang: "冲粹的蒲牢",
  jsrg_tufashujineng: "朔西扰攘",
  jsrg_lukang: "架海金梁",
  jsrg_malong: "困局诡阵"
};
const characterIntro = {
  qiaoxuan: "桥玄（110年－184年6月6日），一作乔玄，字公祖。梁国睢阳县（今河南省商丘市睢阳区）人。东汉时期名臣。桥玄年轻时曾任睢阳县功曹，因坚持追究陈国相羊昌的恶行而闻名。后被举为孝廉，历任洛阳左尉、齐相及上谷、汉阳太守、司徒长史、将作大匠。汉桓帝末年，出任度辽将军，击败鲜卑、南匈奴、高句丽侵扰，保境安民。汉灵帝初年，迁任河南尹、少府、大鸿胪。建宁三年（170年），迁司空。次年，拜司徒。光和元年（178年），升任太尉。桥玄有感于国势日衰，于是称病请辞，改任太中大夫。光和七年（184年），桥玄去世，年七十五。桥玄性格刚强，不阿权贵，待人谦俭，尽管屡历高官，但不因为自己处在高位而有所私请。他为官清廉，去世后连下葬的钱都没有，被时人称为名臣。",
  lougui: "娄圭，字子伯，荆州南阳郡（治今河南南阳）人。曹魏时期著名谋士、将军，娄圭年轻时与曹操有交情，曾经随曹操平定冀州，南征刘表，击破马超，立有功劳，连曹操都感叹他的计谋。 后来曹操和他的儿子们一起出去游玩，娄圭当时也一起随行。因言语不当，被南郡（治今湖北荆州）人习授举报，曹操认为有意诽谤，遭杀害。在小说《三国演义》里，娄圭被设定为京兆人（今陕西西安），隐居终南山，道号“梦梅居士”。于第59回登场。",
  xiahourong: "夏侯荣（207年—219年） ，字幼权，名将夏侯渊之子。建安二十四年（219年）汉中之战，父亲夏侯渊战死后，夏侯荣不愿逃跑，随后拔剑冲入敌阵，战死。",
  guoxun: "郭脩（？～253年），一作郭循，字孝先，凉州西平人，三国时期曹魏官员。原为曹魏中郎，被蜀汉将领姜维俘虏后降蜀汉，任左将军，后来刺杀了蜀汉大将军费祎。被曹魏追封为长乐乡侯，谥曰威侯。",
  caofang: "曹芳（232年－274年），字兰卿，沛国谯县（今安徽省亳州市）人。三国时期曹魏第三位皇帝（239年1月22日－254年10月17日在位），疑为魏武帝曹操曾孙，任城威王曹彰之孙，任城王曹楷之子。太和六年（232年），生于任城王府。青龙三年（235年），选为魏明帝曹叡养子，册封齐王。景初三年（239年），立为皇太子，同日魏明帝曹叡病死，曹芳正式即位，由大将军曹爽和太尉司马懿共同辅政。正始十年，经历高平陵之变，曹爽倒台，政权落入司马氏手中。嘉平六年（254年），中书令李丰和光禄大夫张缉图谋废掉司马师，改立夏侯玄为大将军。司马师平定叛乱后，将曹芳废为齐王，拥戴高贵乡公曹髦继位。西晋建立后，册封邵陵县公。泰始十年（274年），曹芳病逝，终年四十三岁，谥号为厉。",
  sunjun: "孙峻（219年-256年10月19日），字子远，扬州吴郡富春（今浙江省杭州市）人，昭义中郎将孙静曾孙，定武中郎将孙暠之孙，散骑侍郎孙恭之子。三国时期吴国宗室、权臣。孙峻从小弓马娴熟，胆量非凡。孙权晚年时，孙峻担任武卫都尉，掌握军权，然后又任侍中，开始涉足朝政。孙权临终前，孙峻接受遗诏同诸葛恪、滕胤共同辅佐朝政。此后，其身兼武卫将军，一直主持宫廷的值班、守卫等要害部门，并被封为都乡侯。孙峻生性喜好专断，容不下诸葛恪，于是与吴主孙亮密谋发动政变，在酒宴中设伏兵杀死诸葛恪。孙峻谋杀诸葛恪之后，升任丞相、大将军，督察内外一切军务，假节，晋封富春侯。此后，孙峻独揽朝政。孙峻在任职期间，滥施刑杀，淫乱宫女，和全公主孙鲁班私通。五凤元年（254年），吴侯孙英企图谋杀孙峻，后来事情被泄露，孙英自杀。时隔一年，吴国将军孙仪、张怡、林恂等人乘蜀国使节来访之机，共同谋划诛杀孙峻。后被孙峻发觉，孙仪自杀，林恂等被认为有罪诛死。太平元年（256年），孙峻梦见被诸葛恪所击，因惊悸恐惧发病而死，时年38岁。",
  sunlubansunluyu: "孙鲁班，孙权之女。孙鲁班与孙权二子孙和不睦。孙权长子孙登死后，孙和被立为太子。孙鲁班向孙权进谗言废孙和太子之位，孙和被废后忧愤而死。<br>孙鲁育，又名小虎，孙权与步练师之女。吴后期，孙鲁班诬陷孙鲁育参与谋反，于是孙峻杀害了孙鲁育。",
  jsrg_caocao: "初平元年二月，董卓徙天子都长安，焚洛阳宫室，众诸侯畏卓兵强，莫敢进。操怒斥众人:“为人臣而临此境，当举义兵以诛暴乱，大众已合，诸君何疑？此一战而天下定矣！”遂引兵汴水，遇卓将徐荣，大破之。操迎天子，攻吕布，伐袁术，安汉室，拜为征西将军。是时，袁绍兼四州之地，将攻许都。操欲扫清寰宇，兴复汉室，遂屯兵官渡。既克绍，操曰：“若天命在吾，吾为周文王矣。”",
  jsrg_sunce: "建安五年，操、绍相拒于官渡，孙策欲阴袭许昌，迎汉帝，遂密治兵，部署诸将。未发，会为许贡门客所刺，将计就计，尽托江东于权，诈死以待天时。八月，操、绍决战，孙策亲冒矢石，斩将刈旗，得扬、豫之地。曹操败走冀、青，刘备远遁荆、益。而后历时七年，孙策三分天下已有其二，帝于洛阳，建霸王未竟之功业。权表求吴王，封为仲帝，共治天下。",
  jsrg_guojia: "初平元年二月，郭嘉拜见袁绍，闻曹操怒斥众诸侯，乃对曰：“董卓于汴水或有埋伏，慎之！”曹操未从，果败于徐荣。三月，曹操与郭嘉论天下事：“使孤成大业者，必此人也。”郭嘉从破袁绍，讨谭、尚，连战数克，计定辽东。时年三十八，征乌桓归途郭嘉因劳染疾，命悬之际竟意外饮下柳皮醋水而愈。建安十三年，曹操屯兵赤壁，郭嘉识破连环之计，议上中下三策，可胜刘备。尚未献策，曹操便决意采纳上策，“奉孝之才，足胜孤百倍，卿言上策，如何不取？”由此，赤壁战后曹操尽得天下。",
  jsrg_zhugeliang: "建兴六年春，汉丞相诸葛亮使赵云、邓芝为先锋，马谡为副将拒箕谷，牵制曹真主力。自率三十万大军攻祁山，三郡叛魏应亮，关中响震。曹叡命张郃拒亮，亮使定军山降将姜维与郃战于街亭，张郃久攻不下。后曹真强攻赵云军，赵云死战，坚守箕谷，马谡、邓芝当场战死忠勇殉国。……既克张郃，曹真溃逃，曹叡弃守长安，迁都邺城。十月，司马懿击退孙权，回援曹真。而后三年，丞相所到之处，无不望风而降，皆箪食壶浆，以迎汉军。尽收豫、徐、兖、并之地，建兴十年春，司马懿父子三人死于诸葛武侯火计，同年，孙权上表称臣，至此四海清平，大汉一统。而后诸葛亮荐蒋琬为丞相，姜维为大将军，自回隆中归隐，后主挽留再三，皆不受。魏延亦辞官相随，侍奉左右。后主时有不决之事，便往隆中拜访相父，均未得面，童子答曰外出云游，遗数锦囊，拆而视之，皆治国之良策也。",
  jsrg_yuanshao: "太祖圣武皇帝，汝南汝阳人也，姓袁，讳绍,字本初。太祖于黎阳梦有一神授一宝刀，及觉，果在卧所，铭日思召。解之曰：思召，绍字也。 ……灵帝崩，少帝继位。卓议欲废立，太祖拒之，卓案剑吆曰：“竖子敢然！天下之事，岂不在我/我欲为之，谁敢不从！”绍勃然曰：“天下健者，岂惟董乎！”横剑径出。世人方知太祖贤名非以权势取之。实乃英雄气也。初平元年，太祖于勃海起兵，其从弟后将军术等十余位诸侯同时俱起，兴兵讨董。是时，豪杰既多附招，州郡蜂起，莫不以袁氏为名。……太祖既得冀州，尝出猎白登山，见一白鹿口含宝剑而来，获之，剑名中兴。或曰：汉失其鹿，陈逐而获之。建安五年，太祖与曹操战于官渡，曹操欲夜袭乌巢，恰有流星如火,光长十余丈照于曹营，昼有云如坏山，当营而陨, 不及地尺而散，吏士皆以为不详，太祖并兵俱攻大破之，操自军破后，头风病发，六年夏五月死。",
  jsrg_simazhao: "司马昭，字子上，早年受荫庇于父兄，不慕霸业。及父兄殂谢，昭承继家业、负谋魏自立之责，野心渐起，虽心气才学不及父兄，仍弹竭经营大业 笼人心，除异己，欲令百官贵胃俯首。<br>唯诸葛诞拥兵自重，独据淮南、昭恐其不利手宗族大业、欲除之以建战功，威服四方。昭乃使计逼反诸葛诞，又担忧曹髦为乱后方，乃挟之以同征淮南，临戎除逆。<br>昭惯施权谋，建高墙于寿春城外，围而不攻，为彰显恩德，围城期间每有归降者，皆宽救旧罪。昭收服叛逃倒戈者众，诞、安等屡次突围皆大败而归。<br>昭自觉宗族夙愿将成之际，雷声滚滚，大雨倾盆，围墙塌落，魏军困于泥沼，诸葛诞趁势突围、文鸯乘乱欲劫天子。昭恐宗族大业尽毁于己手，积怨缠身，方寸惊乱，亲率三军攻城、誓荡平淮南，讨灭天下不臣，成大业，慰父兄。",
  yangqiu: "阳球（？-179年），字方正，渔阳泉州（今天津市武清县）人。阳球出身世代豪门，能击剑，习弓马，好申不害、韩非之学。以杀人复仇知名。初举孝谦，补尚书侍郎。后出任高唐令，辟于司徙刘宠府中，举高第。当时九江郡（治阴陵，今安徽定远西北）贼起，三府推举阳球有理奸之才，遂出任九江太守。阳球上任后，设下方略，将凶贼全部歼灭，又收捕郡中奸吏尽杀之。升任平原相，因治事严苦，征诣廷尉，罪当免官。但灵帝以其在九江时有功，任命其为议郎，升任将作大匠，坐事论。不久，任尚书令，奏请罢鸿都文学，书奏不省。光和二年（179年），升任司隶校尉，遂奏收中常侍王甫等人，阳球亲自拷问，五毒备极，王甫父子皆死于杖下。既杀王甫，阳球还欲诛杀曹节等人，使权门屏气，京师震畏。不久，曹节谮毁阳球，使其转任卫尉。其冬，阳球与司徙刘郃等欲诛宦官，反为所诬，遂被收缚洛阳狱，诛死。",
  zhanghuan: "张奂（104-181年），字然明，又名张焕。敦煌渊泉（今甘肃省瓜州县）人，后以功移籍弘农郡（今河南灵宝），书法家张芝的父亲。中国东汉经学家、军事家、文学家，“凉州三明”之一。早年师从太尉朱宠，研习《欧阳尚书》，自行删减《牟氏章句》。汉桓帝时，举贤良出身，对策第一，授议郎，历任安定都尉、武威太守、度辽将军、护匈奴中郎将等职。多次赢得对外战争，招抚外族，促进边境和平，功勋卓著。汉灵帝即位，迁大司农，受到宦官集团利用，讨伐大将军窦武。事后，上疏为窦武等人申冤。累迁太常卿，辞官归乡，授课著书，不再出仕。光和四年（181年），张奂去世，时年七十八。",
  chenfan: "陈蕃（？-168年），字仲举。汝南平舆（今河南省平舆北）人。东汉时期名臣，与窦武、刘淑合称“三君”。陈蕃年少时有大志，举孝廉，授郎中。因母去世，辞官居丧。后由太尉李固荐举为乐安太守。因得罪大将军梁冀，由太守降为县令。为了零陵桂阳的流民山匪得罪皇帝身边的人，被外放为豫章太守。后升任大鸿胪。延熹六年（163年），陈蕃被征为尚书仆射，转太中大夫。延熹八年（165年），陈藩代杨秉为太尉，次年，被免官。永康元年（167年），汉桓帝去世，窦皇后临朝，以陈蕃为太傅，管理尚书事宜。次年，汉灵帝即位，陈藩与大将军窦武谋诛宦官，事泄，宦官曹节劫持汉灵帝与窦太后，诛杀窦武，又率宫中卫士包围了陈蕃，陈蕃率学士80人抵抗，被害，年七十余。",
  zhangju: "张举（生卒年不详），渔阳人，与张纯同郡，是东汉末年起义军将领，曾在汉朝担任泰山太守。中平四年（187年），张举受张纯挑唆，联合乌桓起兵攻打郡县，部众到达了十多万；张举自称天子，张纯自称弥天将军安定王，声称自己将取代汉朝。刘虞担任幽州牧后，用怀柔之策说服乌桓罢兵，并悬赏求购张举、张纯；两人逃出塞外，后来张纯被门客王政所杀，张举则下落不明。",
  caojiewangfu: "曹节（？―181年），字汉丰，南阳育阳（今河南省南阳市宛城区瓦店镇）人。东汉宦官。因事入宫，累迁西园骑。汉顺帝时期，迁小黄门。汉桓帝继位，迁中常侍，加任奉车都尉。拥戴汉灵帝有功，册封长安乡侯。联合长乐五官史朱瑀等矫诏诛杀窦武、陈蕃等人，升任长乐卫尉，进封育阳县侯。建宁二年（169年），加位特进、大长秋。权倾朝野，诬害勃海王刘悝，累迁尚书令。光和四年（181年），曹节去世，获赠车骑将军。<br>王甫（？—179年），东汉时期宦官。前十常侍之一。灵帝初为长乐食监，受中常侍曹节等矫诏为黄门令，将兵诛杀大将军窦武等人,因迁中常侍。后与节诬奏勃海王刘悝谋反，封冠军侯。由此操纵朝政，父兄子弟皆为公卿列校、牧守令长，布满天下。光和二年 (179)，与养子永乐少府萌、沛相吉并为司隶校尉阳球收捕，磔尸于城门。",
  songhuanghou: "孝灵宋皇后（？―178年），宋氏，名不详，世称“宋孝灵”，扶风平陵人，汉章帝刘炟妃子宋贵人堂曾孙女，执金吾宋酆之女。建宁三年（170年），宋氏入选掖庭，封为贵人。建宁四年（171年），汉灵帝立宋氏为皇后。宋皇后无宠，却正位中宫，后宫得宠的姬妾们便共同谮恶宋皇后，诬陷宋皇后行祝诅之事。汉灵帝听信其言，于光和元年（178年）策收宋氏的皇后玺绶。宋皇后自行前往暴室狱，忧死，其父、兄弟皆伏诛。各个常侍、小黄门在宫中的，都怜悯宋氏无辜，一同筹钱安葬宋皇后及宋酆父子于皋门亭宋氏旧茔。",
  jiananfeng: "贾南风（257年—300年），小名峕，字南风，晋平阳襄陵（今山西襄汾）人。曹魏豫州刺史贾逵孙女，晋初大臣贾充之女，晋惠帝司马衷的皇后。",
  limi: "李密（224年—287年），又名宓，一名虔，字令伯，益州犍为郡武阳县（今四川省眉山市彭山区）人。西晋时期大臣、文学家。",
  simaliang: "司马亮（？～291年7月25日），字子翼，河内郡温县（今河南省温县）人，西晋宗室大臣，“八王之乱”的参与者。魏太傅司马懿第四子，大将军司马师与相国司马昭之弟，晋武帝司马炎叔父。仕魏为散骑仕郎，拜东中郎将，封广阳乡侯。入晋，累封汝南王。历官宗师、侍中，太尉，录尚书事。晋武帝末为杨骏所排斥，出镇许昌。及惠帝即位，杨骏被贾后所诛，入朝拜太宰、录尚书事，与太保卫瓘同辅政。与楚王司马玮争兵权，玮承贾后旨诬亮有废立之谋，杀死司马亮，谥号文成。",
  tufashujineng: "秃发树机能（？-279年），姓秃发，世居河西（今青海东部一甘肃河西交界一带），“河西鲜卑”秃发部首领匹孤四世孙，西晋鲜卑族首领。秃发树机能于泰始六年（270年），率鲜卑部众于万斛堆大败胡烈指挥的官军。后乘胜南下，一举攻占高平。晋武帝司马炎再派杜预、石鉴率大军西征。双方交战一年，官军不仅未能消灭秃发树机能，却激起更多少数民族的反抗。咸宁元年（275年），秃发树机能率众向金城和凉州以西的广大少数民族区域发展。咸宁三年（277年），秃发树机能军在数路晋军围攻下，遭到重创。晋武帝任命自动请战的马隆充当讨虏护军、凉州刺史。咸宁五年（279年），袭取凉州。后为晋将马隆所败，部下杀之降晋。",
  malong: "马隆（生卒年不详），字孝兴，东平郡平陆县人。西晋时期名将、军事家，官至护东羌校尉，封爵奉高县侯。马隆智勇兼备，爱好名节。起家武猛从事。泰始年间，经过州县的举荐，累迁司马督。咸宁五年（279年），河西鲜卑首领秃发树机能率众反叛时，担任讨虏护军、武威太守，革新武器装备。后出任宣威将军，平定“秦凉之变”，斩杀秃发树机能，收复凉州。太康初年，出任平虏护军、西平太守，戍边十余年，发展生产，功绩卓著，声名大震。太熙元年（290年），授护东羌校尉、奉高县侯，后死于任上。著有《八阵总述》一书，《风后握奇经》一卷。"
};
const characterFilters = {
  jsrg_caocao(mode) {
    return mode != "chess" && mode != "tafang";
  },
  jsrg_xushao(mode) {
    return mode != "guozhan";
  },
  jsrg_jiangwei(mode) {
    return mode !== "guozhan";
  }
};
const dynamicTranslates = {
  jsrgshichong(player) {
    const bool = player.storage.jsrgshichong;
    let yang = "你可以获得目标角色一张手牌", yin = "目标角色可以交给你一张手牌";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技。当你使用牌指定其他角色为唯一目标后，", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  jsrgdangren(player) {
    const bool = player.storage.jsrgdangren;
    let yang = "当你需要对自己使用【桃】时，你可以视为使用之", yin = "当你可以对其他角色使用【桃】时，你须视为使用之";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技。", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  }
};
const voices = {
  "#jsrgqiongtu1": "箭倒辕门，徒无用也，今大势去矣。",
  "#jsrgqiongtu2": "前狼后虎，凶蛇两端，不知何处能归？",
  "#jsrgxianzhu1": "敌荡荡无虑，旌旗不整，乃率一而可击十。",
  "#jsrgxianzhu2": "诱之以利，士贪于得，设伏投机，必取！",
  "#jsrgguanhuo1": "四面合围，纵火惊之，此战必剿黄巾残党！",
  "#jsrgguanhuo2": "兵有奇变，不在众寡，当以计胜之！",
  "#jsrgjuxia1": "昔与明公俱为鸿鹄，不意明公今为凤皇耳！",
  "#jsrgjuxia2": "天下事在公，义真何敢多言。",
  "#jsrg_huangfusong:die": "一生为国纵横沙场，奈何宦海沉浮。",
  "#jsrgzhengbing1": "厉兵秣马，待敌制胜。",
  "#jsrgzhengbing2": "戎装既整，如羽扣弦。",
  "#jsrgtuwei1": "成败之机，在此一战！",
  "#jsrgtuwei2": "一相与一，勇者得前！",
  "#jsrg_zhangliao:die": "病厄缠身，君恩难报……",
  "#jsrglonglin1": "江山北望，熄天下烽火！",
  "#jsrglonglin2": "龙吟震九州，翼展蔽日月！",
  "#jsrgzhendan1": "匹马行南北，何暇问死生！",
  "#jsrgzhendan2": "纵千万人，吾往矣！",
  "#jsrg_zhaoyun:die": "北伐！北伐？北伐……",
  "#jsrgsaojian1": "今某作司隶，此曹子安得容乎！",
  "#jsrgsaojian2": "满朝虫豸，何以言政，必诛之！",
  "#jsrgsaojian3": "哎，奸路既生，再难尽除！",
  "#jsrg_yangqiu:die": "臣何敢违君言？但恐生祸患啊！",
  "#jsrgxiezheng1": "烈祖明皇帝乘舆仍出，陛下何妨效之。",
  "#jsrgxiezheng2": "陛下宜誓临戎，使将士得凭天威。",
  "#jsrgxiezheng_jin_jsrg_simazhao1": "既得众将之力，何愁贼不得平？",
  "#jsrgxiezheng_jin_jsrg_simazhao2": "逆贼起兵作乱，诸位无心报国乎？",
  "#jsrgqiantun1": "辅国臣之本分，何敢图于禄勋。",
  "#jsrgqiantun2": "蜀贼吴寇未灭，臣未可受此殊荣。",
  "#jsrgqiantun3": "陛下一国之君，不可使以小性。",
  "#jsrgqiantun4": "讲经宴筵，实非治国之道也。",
  "#jsrgweisi1": "上者慑敌以威，灭敌以势。",
  "#jsrgweisi2": "哼，求存者多，未见求死者也。",
  "#jsrgweisi3": "未想逆贼区区，竟然好物甚巨。",
  "#jsrgzhaoxiong1": "若得灭蜀之功，何不可受禅为帝。",
  "#jsrgzhaoxiong2": "已极人臣之贵，当一尝人主之威。",
  "#jsrgdangyi1": "哼！斩首示众，以儆效尤。",
  "#jsrgdangyi2": "汝等仍存异心，可见心存魏阙。",
  "#jsrg_simazhao:die": "曹髦小儿竟有如此肝胆……我实不甘。",
  "#jin_jsrg_simazhao:die": "愿我晋祚，万世不易，国运永昌。",
  "#jsrgshanzheng1": "陛下于此道不明，本后且代为理政。",
  "#jsrgshanzheng2": "诏命皆从我出，诸君当知谁为这一国之主。",
  "#jsrgshanzheng3": "哼！再有犯者，皆有如此人。",
  "#jsrgshanzheng4": "尔等罪证，可俱在本宫手中。",
  "#jsrgxiongbao1": "不论汝用何法，本后只要死的。",
  "#jsrgxiongbao2": "且慢，若事有不获大可行雷霆手段。",
  "#jsrgliedu1": "好个贱婢，看来留不得你。",
  "#jsrgliedu2": "待本后开膛破肚，一验是子是女。",
  "#jsrg_jiananfeng:die": "只恨未早下杀手，致有今日险境。",
  "#jsrgciyin1": "今蒙恩诏，寸心难表，然念祖母，诚难上道。",
  "#jsrgciyin2": "是臣尽节于陛下之日长，报养刘之日短也。",
  "#jsrgciyin3": "臣亡国贱俘，蒙陛下累征不弃，敢不陨首以报。",
  "#jsrgchendu1": "愿陛下矜悯愚诚，听臣微志，庶刘侥幸，保卒余年。",
  "#jsrgchendu2": "臣无祖母，无以至今日；祖母无臣，无以终余年。",
  "#jsrg_limi:die": "人亦有言，有因有缘。官无中人，不如归田。",
  "#jsrgfennan1": "幸得陛下厚任，吾当亡命战场，以报所受。",
  "#jsrgfennan2": "敌虽万众之数，以吾之谋，易为平之。",
  "#jsrgxunji1": "天统之境，岂容丑虏犯边。",
  "#jsrgxunji2": "凉州有危，臣者当济。",
  "#jsrg_malong:die": "惟愿长守边境，不使百姓为虏所扰。",
  "#jsrgchengliu1": "顺流鼓棹，径造三山。",
  "#jsrgchengliu2": "今威名已著，当直取敌都。",
  "#jsrgjianlou1": "作船七载，以备伐吴。",
  "#jsrgjianlou2": "奉诏修舟舰，待机伐孙吴。",
  "#jsrg_wangjun:die": "吾功大无匹，但为浑父子所抑而已。",
  "#jsrgzuozhan1": "首义难成大事，且待吾之良机！",
  "#jsrgzuozhan2": "天下风云变幻，何须急于一时！",
  "#jsrgzuozhan3": "将军忠心可鉴，日月昭彰！",
  "#jsrgzuozhan4": "昭伯旧党皆为其诛，吾又岂能安坐！",
  "#jsrgcuibing1": "	内据淮南，外联孙吴，必可功成！",
  "#jsrgcuibing2": "淮南可与吴寇，亦不予汝司马一族！",
  "#jsrgcuibing3": "残阳孤城，当鉴吾之丹心！",
  "#jsrgcuibing4": "困兽之争，只求玉碎冰摧！",
  "#jsrgcuibing5": "再守数日，必得东吴援军！",
  "#jsrglangan1": "粮草不至，淮南岌岌可危……",
  "#jsrglangan2": "我大义之军，何以至此……",
  "#jsrg_zhugedan:die": "大义载天，守忠覆地！",
  "#jsrgfuzhen1": "若不拼死一战，何以诛此国贼！",
  "#jsrgfuzhen2": "虽为败势，鸯亦有险中取胜之法！",
  "#jsrgfuzhen3": "鼓噪而复进之，必取老贼之首！",
  "#jsrgfuzhen4": "一鼓乱其心，后必破之！",
  "#jsrg_wenyang:die": "恨不得手刃司马老贼，致其有残生之机……",
  "#jsrgchaozheng1": "何故争论无休？朝堂自有公论。",
  "#jsrgchaozheng2": "今日之言，无是无非，皆为我大汉社稷。",
  "#jsrgchaozheng3": "诸卿一心为公，大汉中兴可期！",
  "#jsrgchaozheng4": "朝野皆论朋党之私，欲置朕于何处！",
  "#jsrgshenchong1": "天子近前，岂曰无人？赏！",
  "#jsrgshenchong2": "诸臣皆为己利，唯汝独讨朕心。",
  "#jsrgjulian1": "朕聚天下之财，岂不为天下之事乎？",
  "#jsrgjulian2": "若为汉家中兴，朕又何惜此金银之物！",
  "#jsrgjulian3": "天下既无贤才，不知民有闲财否？哈哈哈！",
  "#jsrgjulian4": "府仓国库，皆归朕有！",
  "#jsrg_liuhong:die": "中兴无望，唯将大志托于此剑……",
  "#jsrgzhaobing1": "此事，便依本初之言。",
  "#jsrgzhaobing2": "诸侯兵马，皆听我调遣。",
  "#jsrgzhuhuan1": "杀了你们，天下都是我说了算！",
  "#jsrgzhuhuan2": "整顿天下，为国除害！",
  "#jsrgyanhuo1": "附肉之蛆，也想弑主？",
  "#jsrgyanhuo2": "陛下在哪儿？陛下在哪儿！",
  "#jsrg_hejin:die": "太后诏我入宫，汝等这是何意？！",
  "#jsrgshelun1": "董贼既死，凉州旧部当有处置。",
  "#jsrgshelun2": "此事甚难定夺，还请诸公共议。",
  "#jsrgshelun3": "此辈何罪？但为其主，不足杀之。",
  "#jsrgshelun4": "今不屠此逆军，何慰关东义士之心？",
  "#jsrgfayi1": "吾除董贼，朝野自是吾一言之堂。",
  "#jsrgfayi2": "念私惠而忘公义，其与董贼同罪！",
  "#jsrg_wangyun:die": "罢兵不成，新乱又起……老夫当以死谢天下……",
  "#jsrgzhenglve1": "臣奉陛下之命，以伐乱臣。",
  "#jsrgzhenglve2": "陛下且安坐宫中，待臣之捷报。",
  "#jsrgzhenglve3": "齐桓之功，唯霸可彰王道。",
  "#jsrgzhenglve4": "晋公亦霸，然亦躬奉周王。",
  "#jsrghuilie1": "奉辞伐罪，旌麾南指，欲请将军会猎于吴。",
  "#jsrghuilie2": "宝雕弓，金鈚箭，臣乞为陛下猎天下之不臣。",
  "#jsrgpingrong1": "兵贵神速，勿失此讨贼良机。",
  "#jsrgpingrong2": "以战平戎，以武止戈。",
  "#jsrgpingrong3": "治世匡以仁德，乱世当用重典。",
  "#jsrg_caocao:die": "本欲征西讨贼，为国效命，奈何天命……唉……",
  "#jsrgjishan1": "刀兵罪在我，而百姓何辜耶？",
  "#jsrgjishan2": "备宁愿一死，只求百姓得安。",
  "#jsrgjishan3": "民若得安，则天下安矣！",
  "#jsrgjishan4": "勿以恶小而为之，勿以善小而不为。",
  "#jsrgzhenqiao1": "剑出鞘鸣，引得龙吟海内！",
  "#jsrgzhenqiao2": "鲲鹏之志，志在天下苍生！",
  "#jsrg_liubei:die": "楼桑羽葆，黄粱一梦……",
  "#jsrgpingtao1": "董贼势败在即，诸公何故不前。",
  "#jsrgpingtao2": "歃血为盟，誓诛此国贼。",
  "#jsrgjuelie1": "传令所部兵马，定绝董贼后路。",
  "#jsrgjuelie2": "今当夷汝三族，县示四海。",
  "#jsrgjuelie3": "洛阳已在眼下，莫让董贼轻逃。",
  "#jsrgjuelie4": "火势刻不容缓，全军速速进发。",
  "#jsrg_sunjian:die": "若违此誓，某必为万箭穿心！"
};
const characterSort = {
  jiangshanrugu_qi: ["jsrg_liuhong", "jsrg_hejin", "jsrg_sunjian", "jsrg_huangfusong", "jsrg_xushao", "jsrg_dongbai", "jsrg_qiaoxuan", "jsrg_yangbiao", "jsrg_kongrong", "jsrg_zhujun", "jsrg_liubei", "jsrg_wangyun", "jsrg_liuyan", "jsrg_caocao", "jsrg_nanhualaoxian"],
  jiangshanrugu_cheng: ["jsrg_sunce", "jsrg_xuyou", "jsrg_lvbu", "jsrg_zhanghe", "jsrg_zoushi", "jsrg_guanyu", "jsrg_chendeng", "jsrg_zhenji", "jsrg_zhangliao", "jsrg_xugong", "jsrg_chunyuqiong"],
  jiangshanrugu_zhuan: ["jsrg_guojia", "jsrg_zhangfei", "jsrg_machao", "jsrg_lougui", "jsrg_zhangren", "jsrg_huangzhong", "jsrg_xiahourong", "jsrg_sunshangxiang", "jsrg_pangtong", "jsrg_hansui", "jsrg_zhangchu", "jsrg_xiahouen", "jsrg_fanjiangzhangda"],
  jiangshanrugu_he: ["jsrg_zhugeliang", "jsrg_jiangwei", "jsrg_luxun", "jsrg_zhaoyun", "jsrg_simayi", "jsrg_guoxun", "jsrg_sunlubansunluyu", "jsrg_caofang", "jsrg_sunjun", "jsrg_liuyong", "jsrg_weiwenzhugezhi", "jsrg_zhangxuan", "jsrg_gaoxiang", "jsrg_guozhao"],
  jiangshanrugu_shuai: ["jsrg_yuanshao", "jsrg_caojiewangfu", "jsrg_songhuanghou", "jsrg_zhangjiao", "jsrg_dongzhuo", "jsrg_yangqiu", "jsrg_zhanghuan", "jsrg_liubiao", "jsrg_yl_luzhi", "jsrg_chenfan", "jsrg_zhangju"],
  jiangshanrugu_xing: ["jsrg_malong", "jsrg_lukang", "jsrg_tufashujineng", "jsrg_simaliang", "jin_jsrg_simazhao", "jsrg_simazhao", "jsrg_jiananfeng", "jsrg_wenyang", "jsrg_zhugedan", "jsrg_wangjun", "jsrg_limi", "jsrg_dengai"]
};
const characterSortTranslate = {
  jiangshanrugu_qi: "江山如故·起",
  jiangshanrugu_cheng: "江山如故·承",
  jiangshanrugu_zhuan: "江山如故·转",
  jiangshanrugu_he: "江山如故·合",
  jiangshanrugu_shuai: "江山如故·衰",
  jiangshanrugu_xing: "江山如故·兴"
};
game.import("character", function() {
  return {
    name: "jsrg",
    connect: true,
    character: { ...characters },
    characterSort: {
      jsrg: characterSort
    },
    characterSubstitute: {
      jsrg_simazhao: [["jin_jsrg_simazhao", []]]
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
