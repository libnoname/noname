import { get, lib, _status, game, ui } from "noname";
const type = "card";
const zhulu = {
  name: "zhulu",
  connect: true,
  card: {
    zhulu_card: {
      audio: true,
      fullskin: true,
      type: "trick",
      enable: true,
      cardcolor: "red",
      selectTarget: -1,
      filterTarget: true,
      async contentBefore(event, trigger, player) {
        const card = event.card;
        if (get.is.versus()) {
          const result = await player.chooseControl("顺时针", "逆时针", (event2, player2) => {
            if (player2.next.side === player2.side) {
              return "逆时针";
            }
            return "顺时针";
          }).set("prompt", `选择${get.translation(card)}的结算方向`).forResult();
          if (result && result.control === "顺时针") {
            const evt = event.getParent();
            evt.fixedSeat = true;
            evt.targets.sortBySeat();
            evt.targets.reverse();
            if (evt.targets[evt.targets.length - 1] === player) {
              evt.targets.unshift(evt.targets.pop());
            }
          }
        }
        ui.clear();
        let num;
        if (event.targets) {
          num = event.targets.length;
        } else {
          num = game.countPlayer();
        }
        const cards = [];
        for (let i = 0; i < num; i++) {
          const cardx = get.cardPile((card2) => get.type(card2) === "equip" && !cards.includes(card2));
          if (cardx) {
            cards.push(cardx);
          }
        }
        if (!cards.length) {
          event.getParent().excluded.addArray(game.players);
          return;
        }
        const orderingEvent = game.cardsGotoOrdering(cards);
        orderingEvent.relatedEvent = event.getParent();
        const dialog = ui.create.dialog("逐鹿天下", cards, true);
        _status.dieClose.push(dialog);
        dialog.videoId = lib.status.videoId++;
        game.addVideo("cardDialog", null, ["逐鹿天下", get.cardsInfo(cards), dialog.videoId]);
        event.getParent().preResult = dialog.videoId;
        game.broadcast(
          (cards2, id) => {
            const dialog2 = ui.create.dialog("逐鹿天下", cards2, true);
            _status.dieClose.push(dialog2);
            dialog2.videoId = id;
          },
          cards,
          dialog.videoId
        );
        game.log(event.card, "亮出了", cards);
        await orderingEvent;
      },
      async content(event, trigger, player) {
        const { target } = event;
        const dialog = ui.dialogs.find((dialog2) => dialog2.videoId === event.preResult);
        if (!dialog) {
          return;
        }
        const equips = [];
        for (const button2 of dialog.buttons) {
          const card2 = button2.link;
          if (target.canEquip(card2, true)) {
            equips.push(card2);
          }
        }
        let result;
        let directButton;
        if (equips.length > 1) {
          const next = target.chooseButton(true, (button2) => {
            const player2 = _status.event.player;
            return get.effect(player2, button2.link, player2, player2);
          });
          next.set("equips", equips);
          next.set("filterButton", (button2) => _status.event.equips.includes(button2.link));
          next.set("dialog", event.preResult);
          next.set("closeDialog", false);
          next.set("dialogdisplay", true);
          result = await next.forResult();
        } else if (equips.length) {
          directButton = equips[0];
        } else {
          return;
        }
        let card;
        if (directButton) {
          card = directButton;
        } else {
          card = result.links[0];
        }
        const button = dialog.buttons.find((button2) => button2.link === card);
        if (button) {
          const innerHTML = target.getName(true);
          game.createButtonCardsetion(innerHTML, button);
          dialog.buttons.remove(button);
        }
        const capt = `${get.translation(target)}选择了${get.translation(button.link)}`;
        let equipEvent;
        if (card) {
          equipEvent = target.equip(card);
          target.$gain2(card);
          game.broadcast(
            (card2, id, name, capt2) => {
              const dialog2 = get.idDialog(id);
              if (dialog2) {
                dialog2.content.firstChild.innerHTML = capt2;
                const button2 = dialog2.buttons.find((button3) => button3.link === card2);
                if (button2) {
                  game.createButtonCardsetion(name, button2);
                  dialog2.buttons.remove(button2);
                }
              }
            },
            card,
            dialog.videoId,
            target.getName(true),
            capt
          );
        }
        dialog.content.firstChild.innerHTML = capt;
        game.addVideo("dialogCapt", null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
        game.log(target, "选择了", button.link);
        const delayEvent = game.delay();
        if (equipEvent) {
          await equipEvent;
        }
        await delayEvent;
      },
      async contentAfter(event) {
        const dialog = ui.dialogs.find((dialog2) => dialog2.videoId === event.preResult);
        if (dialog) {
          dialog.close();
          _status.dieClose.remove(dialog);
        }
        game.broadcast((id) => {
          const dialog2 = get.idDialog(id);
          if (dialog2) {
            dialog2.close();
            _status.dieClose.remove(dialog2);
          }
        }, event.preResult);
        game.addVideo("cardDialog", null, event.preResult);
      },
      ai: {
        wuxie() {
          if (Math.random() < 0.5) {
            return 0;
          }
        },
        basic: {
          order: 3,
          useful: 1
        },
        result: {
          target(player, target) {
            if (get.is.versus()) {
              if (target === player) {
                return 1.5;
              }
              return 1;
            }
            if (player.hasUnknown(2)) {
              return 0;
            }
            return (1 - get.distance(player, target, "absolute") / game.countPlayer()) * get.attitude(player, target) > 0 ? 0.4 : 0.7;
          }
        },
        tag: {
          draw: 1,
          multitarget: 1
        }
      }
    },
    kaihua: {
      enable: true,
      fullskin: true,
      type: "trick",
      selectTarget: -1,
      toself: true,
      filterTarget(card, player, target) {
        return target === player;
      },
      modTarget: true,
      async content(event, trigger, player) {
        const { target } = event;
        if (!target.hasCards("he")) {
          return;
        }
        const result = await target.chooseToDiscard(true, "he", [1, 2]).set("ai", (card) => {
          if (!ui.selected.cards.length && get.type(card) === "equip") {
            return 8 - get.value(card);
          }
          return 6 - get.value(card);
        }).forResult();
        if (!result.bool || !result.cards) {
          return;
        }
        const equips = result.cards.some((card) => get.type(card) === "equip");
        await target.draw(result.cards.length + (equips ? 1 : 0));
      },
      ai: {
        wuxie() {
          return 0;
        },
        basic: {
          useful: 3,
          value: 3,
          order: 5
        },
        result: {
          target(player, target, card) {
            const cards = ui.selected.cards.concat(card.cards || []);
            const num = player.countCards("he", (card2) => {
              if (cards.includes(card2)) {
                return false;
              }
              if (get.type(card2) === "equip") {
                return 8 > get.value(card2);
              }
              return 6 > get.value(card2);
            });
            if (!num) {
              return 0;
            }
            if (player.countCards("he", (card2) => {
              if (cards.includes(card2)) {
                return false;
              }
              if (get.type(card2) === "equip") {
                return 4 > get.value(card2);
              }
              return false;
            })) {
              return 1.6;
            }
            if (num < 2) {
              return 0.5;
            }
            return 1.2;
          }
        },
        tag: {
          loseCard: 1,
          discard: 1,
          norepeat: 1
        }
      }
    },
    jiejia: {
      fullskin: true,
      type: "trick",
      enable: true,
      filterTarget(card, player, target) {
        return target.countCards("e") > 0;
      },
      async content(event, trigger, player) {
        const { target } = event;
        const es = target.getCards("e");
        if (!es.length) {
          return;
        }
        await target.gain(es, "gain2", "log");
      },
      ai: {
        order: 10,
        tag: {
          gain: 1
          //loseCard:1,
        },
        basic: {
          useful: 0.5,
          value: 0.5
        },
        result: {
          target(player, target) {
            const e5 = target.getEquip("muniu");
            if (e5 && e5.name === "muniu" && e5.cards && e5.cards.length > 1) {
              return -1;
            }
            if (target.countCards("e", (card) => get.value(card, target) <= 0) || target.hasSkillTag("noe")) {
              return 1;
            }
            return 0;
          }
        }
      }
    },
    caochuan: {
      fullskin: true,
      type: "trick",
      wuxieable: true,
      global: ["caochuan_skill"],
      notarget: true,
      async content(event, trigger, player) {
        const evt2 = event.getParent(3)._trigger;
        evt2.neutralize();
        const evt = evt2.getParent();
        const next = game.createEvent("caochuan_gain");
        _status.event.next.remove(next);
        evt.after.unshift(next);
        next.player = player;
        next.setContent(async (event2, trigger2, player2) => {
          const cards = event2.getParent().cards.filterInD();
          if (!cards.length) {
            return;
          }
          await player2.gain(cards, "gain2", "log");
        });
      },
      ai: {
        basic: {
          useful: [6, 4],
          value: [6, 4]
        },
        result: { player: 1 }
      }
    },
    numa: {
      fullskin: true,
      type: "equip",
      subtype: "equip4",
      filterTarget(card, player, target) {
        if (player === target) {
          return false;
        }
        return target.canEquip(card, true);
      },
      selectTarget: 1,
      toself: false,
      loseThrow: true,
      customSwap() {
        return true;
      },
      ai: {
        order: 9,
        value(card, player) {
          if (player.getEquips(4).includes(card)) {
            return 0;
          }
          return 4;
        },
        equipValue(card, player) {
          if (player.getCards("e").includes(card)) {
            return 0;
          }
          return -get.value(player.getCards("e"));
        },
        basic: {
          equipValue: 5
        },
        result: {
          keepAI: true,
          target(player, target) {
            const cards = target.getCards("e");
            if (cards.length === 1 && cards[0].name === "nvzhuang") {
              return 0;
            }
            const val = get.value(cards, target);
            if (val > 0) {
              return -val;
            }
            return 0;
          }
        }
      }
    },
    yajiaoqiang: {
      fullskin: true,
      type: "equip",
      subtype: "equip1",
      bingzhu: ["赵云"],
      distance: { attackFrom: -2 },
      skills: ["yajiaoqiang_skill"],
      ai: {
        equipValue(card, player) {
          const skills = ["longdan", "kanpo", "rekanpo", "qingguo", "reqingguo", "ollongdan", "refanghun"];
          for (const skill of skills) {
            if (player.hasSkill(skill)) {
              return 5;
            }
          }
          if (player.countCards("h", (card2) => get.color(card2) === "black" && ["wuxie", "caochuan"].includes(card2))) {
            return 5;
          }
          return 2;
        },
        basic: {
          equipValue: 5
        }
      }
    },
    wufengjian: {
      fullskin: true,
      type: "equip",
      subtype: "equip1",
      filterTarget(card, player, target) {
        if (player === target) {
          return false;
        }
        return target.canEquip(card, true);
      },
      selectTarget: 1,
      toself: false,
      skills: ["wufengjian_skill"],
      ai: {
        order: 9,
        equipValue(card, player) {
          if (get.position(card) === "e") {
            return -2;
          }
          return 2;
        },
        value(card, player) {
          if (player.getEquips(1).includes(card)) {
            if (player.hasSkillTag("noh")) {
              return 0;
            }
            return -3.5;
          }
          return 1.5;
        },
        basic: {
          equipValue: 5
        },
        result: {
          keepAI: true,
          target(player, target) {
            let val2 = 0;
            const card = target.getEquip(1);
            if (card) {
              val2 = get.value(card, target);
              if (val2 < 0) {
                return 0;
              }
            }
            return -2 - val2;
          }
        }
      }
    },
    zheji: {
      fullskin: true,
      type: "equip",
      subtype: "equip1",
      filterTarget(card, player, target) {
        if (player === target) {
          return false;
        }
        return target.canEquip(card, true);
      },
      selectTarget: 1,
      toself: false,
      distance: { attackFrom: 1 },
      ai: {
        order: 9,
        equipValue(card, player) {
          if (get.position(card) === "e") {
            return -2;
          }
          return 2;
        },
        value(card, player) {
          if (player.getEquips(1).includes(card)) {
            return -3.5;
          }
          return 3;
        },
        basic: {
          equipValue: 5
        },
        result: {
          keepAI: true,
          target(player, target) {
            let val2 = 0;
            const card = target.getEquip(1);
            if (card) {
              val2 = get.value(card, target);
              if (val2 < 0) {
                return 0;
              }
            }
            return -2.5 - val2;
          }
        }
      }
    },
    yinfengjia: {
      fullskin: true,
      type: "equip",
      subtype: "equip2",
      filterTarget(card, player, target) {
        if (player === target) {
          return false;
        }
        return target.canEquip(card, true);
      },
      selectTarget: 1,
      toself: false,
      skills: ["yinfengjia_skill"],
      ai: {
        order: 9,
        equipValue(card, player) {
          if (get.position(card) === "e") {
            return -7;
          }
          return 1;
        },
        value(card, player) {
          if (player.getEquips(2).includes(card)) {
            return -9;
          }
          return 2.5;
        },
        basic: {
          equipValue: 5
        },
        result: {
          keepAI: true,
          target(player, target) {
            let val2 = 0;
            const card = target.getEquip(2);
            if (card) {
              val2 = get.value(card, target);
              if (val2 < 0) {
                return 0;
              }
            }
            return -2 - val2;
          }
        }
      }
    },
    nvzhuang: {
      fullskin: true,
      type: "equip",
      subtype: "equip2",
      bingzhu: ["司马懿", "诸葛亮"],
      filterTarget(card, player, target) {
        if (player === target) {
          return false;
        }
        return target.canEquip(card, true);
      },
      selectTarget: 1,
      toself: false,
      loseDelay: false,
      async onEquip(event, trigger, player) {
        const { card } = event;
        if (player.sex === "male" && player.hasCards("he", (cardx) => card.cards && !card.cards.includes(cardx))) {
          player.chooseToDiscard(true, (cardx) => !_status.event.card?.cards.includes(cardx), "he").set("card", card).forResult();
        }
      },
      async onLose(event, trigger, player) {
        if (player.sex !== "male") {
          return;
        }
        const next = game.createEvent("nvzhuang_lose");
        event.next.remove(next);
        let evt = event.getParent();
        if (evt.getlx === false) {
          evt = evt.getParent();
        }
        evt.after.push(next);
        next.player = player;
        next.setContent(async (event2, trigger2, player2) => {
          if (!player2.countCards("he")) {
            return;
          }
          player2.popup("nvzhuang");
          player2.chooseToDiscard(true, "he");
        });
      },
      ai: {
        order: 9.5,
        equipValue(card, player) {
          if (player.getEquips(2).includes(card)) {
            if (player.sex !== "male") {
              return 0;
            }
            const num = player.countCards("he", (cardx) => cardx !== card);
            if (num === 0) {
              return 0;
            }
            return 4 / num;
          }
          return 1;
        },
        value() {
          return lib.card.nvzhuang.ai.equipValue.apply(this, arguments);
        },
        basic: {
          equipValue: 5
        },
        result: {
          keepAI: true,
          target(player, target) {
            const card = target.getEquip(2);
            if (target.sex === "male") {
              let val = 0;
              let val2 = 0;
              if (card) {
                val2 = get.value(card, target);
                if (val2 < 0) {
                  return 0;
                }
              }
              const num = target.countCards("he", (cardx) => cardx !== card);
              if (num > 0) {
                val += 4 / num;
              }
              return -val;
            }
            if (card) {
              const val2 = get.value(card, target);
              if (val2 > 0) {
                return -val2 / 4;
              }
            }
            return 0;
          }
        }
      }
    },
    yexingyi: {
      fullskin: true,
      type: "equip",
      subtype: "equip2",
      skills: ["yexingyi_skill"],
      ai: {
        equipValue: 4,
        basic: {
          equipValue: 4
        }
      }
    },
    jinhe: {
      fullskin: true,
      type: "equip",
      subtype: "equip5",
      filterTarget(card, player, target) {
        if (player === target) {
          return false;
        }
        return target.canEquip(card, true);
      },
      selectTarget: 1,
      toself: false,
      skills: ["jinhe_skill"],
      global: ["jinhe_lose"],
      loseDelay: false,
      async onEquip(event, trigger, player) {
        const { card } = event;
        const target = player;
        target.markSkill("jinhe_skill");
        const parent = event.getParent(2);
        if (parent.name !== "jinhe") {
          return;
        }
        const source = parent.player;
        event.target = target;
        event.player = source;
        const id = card.cardid;
        if (!_status.jinhe) {
          _status.jinhe = {};
        }
        if (_status.jinhe[id]) {
          await game.cardsDiscard(_status.jinhe[id].card);
          delete _status.jinhe[id];
        }
        const cards2 = get.cards(2);
        const result = await source.chooseButton(["选择一张牌作为「礼」", cards2], true).forResult();
        _status.jinhe[id] = {
          player: source,
          card: result.links[0]
        };
        game.broadcast((jinhe) => {
          _status.jinhe = jinhe;
        }, _status.jinhe);
        await game.cardsGotoSpecial(result.links[0]);
        cards2.remove(result.links[0]);
        cards2[0].fix();
        ui.cardPile.insertBefore(cards2[0], ui.cardPile.firstChild);
        game.updateRoundNumber();
        target.markSkill("jinhe_skill");
      },
      async onLose(event, trigger, player) {
        const { card } = event;
        player.unmarkSkill("jinhe_skill");
        const id = card.cardid;
        const parent = event.getParent(2);
        if (parent && parent.name !== "swapEquip" && get.position(card?.cards?.[0]) !== "d" && event.parent.type !== "equip" && _status.jinhe && _status.jinhe[id]) {
          const card2 = _status.jinhe[id].card;
          player.$throw(card2, 1e3);
          game.log(card, "掉落了", card2);
          await game.cardsDiscard(card2);
          delete _status.jinhe[id];
        }
      },
      ai: {
        order: 9.5,
        equipValue(card, player) {
          if (!player.getEquips(5).includes(card)) {
            return 5;
          }
          if (_status.jinhe && _status.jinhe[card.cardid] && _status.event.name !== "gainPlayerCard") {
            return 3 * player.countCards("h");
          }
          return 0;
        },
        value() {
          return lib.card.jinhe.ai.equipValue.apply(this, arguments);
        },
        basic: {
          equipValue: 5
        },
        result: {
          keepAI: true,
          target(player, target, cardx) {
            if (_status.jinhe && _status.jinhe[cardx.cardid]) {
              return -0.5 - 2 * target.countCards("h");
            }
            const card = target.getEquip(5);
            if (!card) {
              return 0;
            }
            return -get.value(card, target);
          },
          target_use(player, target) {
            return -0.5 - 2 * target.countCards("h");
          }
        }
      }
    }
  },
  skill: {
    jinhe_lose: {
      trigger: {
        player: ["loseAfter", "equipAfter"],
        global: "loseAsyncAfter"
      },
      equipSkill: true,
      forced: true,
      filter(event, player) {
        if (event.getl === false) {
          return false;
        }
        if (!event.getd(player).length || !_status.jinhe || event.getParent(2).name === "jinhe_skill" && event.getParent(2).player === player) {
          return false;
        }
        const evt = event.getl(player);
        if (!evt) {
          return false;
        }
        for (const equip of evt.es) {
          if (equip.name === "jinhe" && _status.jinhe[equip.cardid]) {
            return true;
          }
        }
        return false;
      },
      async content(event, trigger, player) {
        const es = trigger.getl(player).es;
        const discards = [];
        for (const equip of es) {
          if (equip.name !== "jinhe" || !_status.jinhe[equip.cardid]) {
            continue;
          }
          const card = _status.jinhe[equip.cardid].card;
          const discard = game.cardsDiscard(card);
          player.$throw(card);
          game.log(card, "进入了弃牌堆");
          delete _status.jinhe[equip.cardid];
          discards.push(discard);
        }
        game.broadcastAll((jinhe) => {
          _status.jinhe = jinhe;
        }, _status.jinhe);
        await Promise.all(discards);
        const hs = player.getDiscardableCards(player, "h");
        if (hs.length) {
          await player.discard({ cards: hs });
        }
        game.broadcastAll(ui.clear);
      }
    },
    jinhe_skill: {
      equipSkill: true,
      intro: {
        mark(dialog, storage, player) {
          const card = player.getEquip("jinhe");
          if (card && _status.jinhe && _status.jinhe[card.cardid]) {
            if (_status.jinhe[card.cardid].player === game.me || _status.jinhe[card.cardid].player.isUnderControl()) {
              dialog.addAuto([_status.jinhe[card.cardid].card]);
            } else {
              return "共有一张「礼」";
            }
          } else {
            return "没有牌";
          }
        }
      },
      mark: true,
      marktext: "礼",
      enable: "phaseUse",
      filter(event, player) {
        if (!_status.jinhe) {
          return false;
        }
        const card = player.getEquip("jinhe");
        return card && card.name === "jinhe" && _status.jinhe[card.cardid] !== void 0;
      },
      prepare(cards, player) {
        const card = player.getEquip("jinhe");
        if (card && card.name === "jinhe" && _status.jinhe[card.cardid]) {
          const tothrow = _status.jinhe[card.cardid].card;
          player.$throw(tothrow);
          game.log(player, "将", tothrow, "置入了弃牌堆");
        }
      },
      async content(event, trigger, player) {
        const card = player.getEquip("jinhe");
        if (!card || card.name !== "jinhe" || !_status.jinhe[card.cardid]) {
          return;
        }
        const gift = _status.jinhe[card.cardid].card;
        const discard = game.cardsDiscard(gift);
        const suit = get.suit(gift);
        delete _status.jinhe[card.cardid];
        game.broadcastAll((jinhe) => {
          _status.jinhe = jinhe;
        }, _status.jinhe);
        await discard;
        const cards = player.getCards("he", (card2) => {
          if (get.position(card2) === "h") {
            return get.suit(card2) === suit;
          }
          return get.position(card2) === "e" && card2.name === "jinhe";
        });
        if (cards.length) {
          await player.discard({ cards });
        }
        game.broadcastAll(ui.clear);
      },
      ai: {
        order: 1,
        result: {
          player(player) {
            const suit = get.suit(_status.jinhe[player.getEquip("jinhe").cardid].card);
            const hs = player.getCards("h", (card) => get.suit(card) === suit);
            if (!hs.length || get.value(hs) < 5) {
              return 1;
            }
            return -1;
          }
        }
      }
    },
    yexingyi_skill: {
      equipSkill: true,
      mod: {
        targetEnabled(card, player, target) {
          if (get.color(card) === "black" && get.type(card, "trick") === "trick" && !target.hasSkillTag("unequip2") && !player.hasSkillTag("unequip", false, {
            name: card ? card.name : null,
            target,
            card
          })) {
            const cards = player.getEquips("yexingyi");
            if (player.hasSkill("yexingyi_skill", null, false) || !card.cards || !cards.some((cardx) => card.cards.includes(cardx) || ui.selected.cards.includes(cardx))) {
              return false;
            }
          }
        }
      }
    },
    yinfengjia_skill: {
      trigger: { player: "damageBegin3" },
      forced: true,
      equipSkill: true,
      filter(event, player) {
        if (get.type(event.card, "trick") !== "trick") {
          return false;
        }
        if (player.hasSkillTag("unequip2")) {
          return false;
        }
        if (event.source && event.source.hasSkillTag("unequip", false, {
          name: event.card ? event.card.name : null,
          target: player,
          card: event.card
        })) {
          return false;
        }
        return true;
      },
      async content(event, trigger, player) {
        trigger.num++;
      }
    },
    wufengjian_skill: {
      equipSkill: true,
      trigger: { player: "useCard" },
      forced: true,
      filter(event, player) {
        if (event.card.name !== "sha") {
          return false;
        }
        const cards = player.getEquips("wufengjian");
        return player.hasCard((card) => !cards.includes(card), "he");
      },
      async content(event, trigger, player) {
        if (player !== game.me && !player.isUnderControl() && !player.isOnline()) {
          game.delayx();
        }
        await player.chooseToDiscard(true, "he", (card) => !_status.event.cards?.includes(card)).set("cards", player.getEquips("wufengjian"));
      }
    },
    yajiaoqiang_skill: {
      equipSkill: true,
      trigger: { player: "useCardAfter" },
      filter(event, player) {
        if (_status.currentPhase === player || get.color(event.card) !== "black" || event.cards.filterInD().length === 0) {
          return false;
        }
        return player.getHistory("useCard", (evt) => get.color(evt.card) === "black").indexOf(event) === 0;
      },
      prompt2(event, player) {
        return `获得${get.translation(event.cards.filterInD())}`;
      },
      async content(event, trigger, player) {
        player.gain(trigger.cards.filterInD(), "gain2", "log");
      }
    },
    caochuan_skill: {
      trigger: { target: "useCardToBegin" },
      forced: true,
      priority: 6,
      filter(event, player) {
        if (event.directHit || !get.tag(event.card, "damage") || !["basic", "trick"].includes(get.type(event.card))) {
          return false;
        }
        return player.hasUsableCard("caochuan");
      },
      async content(event, trigger, player) {
        const next = player.chooseToUse();
        next.set("prompt", `是否使用【草船借箭】响应${get.translation(trigger.player)}使用的${get.translation(trigger.card)}？`);
        next.set("filterCard", (card, player2) => {
          if (get.name(card) !== "caochuan") {
            return false;
          }
          return lib.filter.cardEnabled(card, player2, "forceEnable");
        });
        next.set("respondTo", [trigger.player, trigger.card]);
        next.set("goon", -get.effect(player, trigger.card, trigger.player, player));
        next.set("ai1", () => _status.event.goon);
      }
    }
  },
  translate: {
    jinhe: "锦盒",
    jinhe_info: "此牌的使用目标为其他角色。当你使用【锦盒】时，你将原有的与此牌对应的「礼」置入弃牌堆（若有），然后观看牌堆顶的两张牌并将其中一张置于游戏外与此牌对应，称之为「礼」。<br>出牌阶段，你可以将与此牌对应的「礼」置入弃牌堆，然后弃置【锦盒】以及所有与「礼」花色相同的手牌。当此牌因其他原因进入弃牌堆后，你将与此牌对应的「礼」置入弃牌堆并弃置所有手牌。",
    jinhe_skill: "锦盒",
    jinhe_lose: "锦盒",
    yexingyi: "夜行衣",
    yexingyi_info: "锁定技，你不是黑色锦囊牌的合法目标。",
    nvzhuang: "女装",
    nvzhuang_info: "此牌的使用目标为其他角色。锁定技，当此牌进入或离开你的装备区时，若你的性别为男性，你弃置一张不为此牌的牌。",
    yinfengjia: "引蜂甲",
    yinfengjia_info: "此牌的使用目标为其他角色。锁定技，当你受到锦囊牌造成的伤害时，此伤害+1。",
    yinfengjia_skill: "引蜂甲",
    zheji: "折戟",
    zheji_info: "此牌的使用目标为其他角色。这是一把坏掉的武器……",
    wufengjian: "无锋剑",
    wufengjian_info: "此牌的使用目标为其他角色。锁定技，当你使用【杀】时，你弃置一张不为装备区内【无锋剑】的牌。",
    wufengjian_skill: "无锋剑",
    yajiaoqiang_skill: "涯角枪",
    yajiaoqiang: "涯角枪",
    yajiaoqiang_info: "当你于一名其他角色的回合内第一次使用的黑色牌结算完成后，你可以获得此牌对应的所有实体牌。",
    numa: "驽马",
    numa_info: "此牌的使用目标为其他角色。锁定技，当此牌进入你的装备区时，你弃置装备区内的所有其他牌。",
    caochuan: "草船借箭",
    caochuan_info: "当带有「伤害」标签的基本牌或普通锦囊牌对你生效前，对此牌使用。抵消此牌对你产生的效果。当此牌结算完成后，你获得此牌对应的所有实体牌。",
    jiejia: "解甲归田",
    jiejia_info: "出牌阶段，对一名装备区内有牌的角色使用。该角色获得其装备区内的所有牌。",
    kaihua: "树上开花",
    kaihua_info: "出牌阶段，对包含你自己在内的一名角色使用。目标角色弃置一至两张牌，然后摸等量的牌。若其以此法弃置了装备牌，则多摸一张牌。",
    zhulu_card: "逐鹿天下",
    zhulu_card_info: "出牌阶段，对所有角色使用。你从牌堆和弃牌堆亮出等同于目标角色数的装备牌，每名目标角色将其中一张牌置于自己的装备区。",
    caochuan_gain: "草船借箭"
  },
  list: [
    ["diamond", 3, "jiejia"],
    ["diamond", 4, "shan"],
    ["diamond", 5, "yajiaoqiang"],
    ["diamond", 6, "sha"],
    ["diamond", 8, "shan"],
    ["diamond", 9, "kaihua"],
    ["diamond", 10, "yinfengjia"],
    ["diamond", 11, "sha"],
    ["club", 3, "jiejia"],
    ["club", 4, "sha", "thunder"],
    ["club", 5, "zheji"],
    ["club", 6, "jiu"],
    ["club", 8, "jiu"],
    ["club", 9, "zhulu_card"],
    ["club", 10, "jinhe"],
    ["club", 11, "sha"],
    ["heart", 3, "sha", "fire"],
    ["heart", 4, "shan"],
    ["heart", 5, "numa"],
    ["heart", 6, "tao"],
    ["heart", 8, "shan"],
    ["heart", 9, "kaihua"],
    ["heart", 10, "nvzhuang"],
    ["heart", 11, "kaihua"],
    ["spade", 3, "caochuan"],
    ["spade", 4, "sha", "thunder"],
    ["spade", 5, "wufengjian"],
    ["spade", 6, "caochuan"],
    ["spade", 8, "sha"],
    ["spade", 9, "sha"],
    ["spade", 10, "yexingyi"],
    ["spade", 11, "sha"]
  ]
};
export {
  zhulu as default,
  type
};
