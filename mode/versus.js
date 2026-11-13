import { get, _status, lib, game, ui } from "noname";
const type = "mode";
const versus = {
  name: "versus",
  init() {
    if (get.config("versus_mode") === "jiange") {
      lib.characterPack.mode_versus = lib.jiangeboss;
    } else if (get.config("versus_mode") === "siguo") {
      lib.characterPack.mode_versus = {
        tangzi: {
          sex: "male",
          group: ["wei", "wu"].randomGet(),
          hp: 4,
          skills: ["xingzhao"],
          dieAudios: ["xf_tangzi"]
        },
        liuqi: {
          sex: "male",
          group: ["shu", "qun"].randomGet(),
          hp: 3,
          skills: ["wenji", "tunjiang"],
          dieAudios: ["sp_liuqi"]
        }
      };
      for (const i in lib.characterPack.mode_versus) {
        lib.character[i] = lib.characterPack.mode_versus[i];
      }
      delete lib.character.sp_liuqi;
      delete lib.character.xf_tangzi;
      lib.cardPack.mode_versus = ["zong", "xionghuangjiu", "tongzhougongji", "lizhengshangyou"];
      lib.translate.mode_versus_character_config = "四国武将";
    }
    if (!lib.cardPack.mode_versus) {
      delete lib.card.zong;
      delete lib.card.xionghuangjiu;
      delete lib.card.tongzhougongji;
      delete lib.card.lizhengshangyou;
    }
  },
  start: [
    async (event, trigger, player) => {
      _status.mode = get.config("versus_mode");
      if (_status.connectMode) {
        _status.mode = lib.configOL.versus_mode;
      }
      if (_status.brawl && _status.brawl.submode) {
        _status.mode = _status.brawl.submode;
      }
      if (lib.config.test_game) {
        _status.mode = "standard";
      }
    },
    async (event, trigger, player) => {
      const playback = localStorage.getItem(`${lib.configprefix}playback`);
      if (playback) {
        ui.create.me();
        ui.arena.style.display = "none";
        ui.system.style.display = "none";
        _status.playback = playback;
        localStorage.removeItem(`${lib.configprefix}playback`);
        const store = lib.db.transaction(["video"], "readwrite").objectStore("video");
        store.get(parseInt(playback)).onsuccess = (e) => {
          if (e.target.result) {
            game.playVideoContent(e.target.result.video);
          } else {
            alert("播放失败：找不到录像");
            game.reload();
          }
        };
        event.finish();
        return;
      }
      if (_status.connectMode) {
        game.waitForPlayer(() => {
          switch (lib.configOL.versus_mode) {
            case "1v1":
              lib.configOL.number = 2;
              break;
            case "2v2":
              lib.configOL.number = 4;
              break;
            case "3v3":
              lib.configOL.number = 6;
              break;
            case "4v4":
            case "guandu":
              lib.configOL.number = 8;
              break;
          }
        });
      } else if (_status.mode === "jiange" || _status.mode === "siguo" || _status.mode === "four" || _status.mode === "guandu") {
        if (_status.mode === "four" && !get.config("enable_all_cards_four")) {
          lib.card.list = lib.cardsFour;
          game.fixedPile = true;
        } else if (_status.mode === "siguo") {
          for (const card of lib.card.list) {
            switch (card[2]) {
              case "tao":
                card[2] = "zong";
                break;
              case "jiu":
                card[2] = "xionghuangjiu";
                break;
              case "wuzhong":
                card[2] = "tongzhougongji";
                break;
              case "wugu":
              case "taoyuan":
                card[2] = "lizhengshangyou";
                break;
            }
          }
        } else if (_status.mode === "guandu") {
          for (let i = 0; i < lib.card.list.length; i++) {
            switch (lib.card.list[i][2]) {
              case "jiu":
                lib.card.list[i][2] = "xujiu";
                break;
              case "wugu":
                lib.card.list[i][2] = "tunliang";
                break;
              case "nanman":
                lib.card.list[i][2] = "lulitongxin";
                break;
              case "taoyuan":
              case "shandian":
                lib.card.list[i][2] = "yuanjun";
                break;
              case "muniu":
                lib.card.list.splice(i--, 1);
                break;
            }
          }
        }
        game.prepareArena(8);
      } else if (_status.mode === "two") {
        game.prepareArena(4);
      } else if (_status.mode === "endless") {
        game.prepareArena(2);
      } else if (_status.mode === "three") {
        if (lib.character.wenpin) {
          lib.character.wenpin[3] = ["zhenwei_three"];
        }
        if (lib.character.zhugejin) {
          lib.character.zhugejin[3] = ["hongyuan", "huanshi_three", "mingzhe"];
        }
        if (lib.character.key_yuzuru) {
          lib.character.key_yuzuru[2] = 4;
          lib.character.key_yuzuru[3] = ["yuzuru_bujin"];
        }
        if (lib.character.guanyu) {
          lib.character.guanyu[3] = ["wusheng", "zhongyi"];
        }
        if (lib.character.lvbu) {
          lib.character.lvbu[3] = ["wushuang", "zhanshen"];
        }
        if (lib.character.xiahoudun) {
          lib.character.xiahoudun[3] = ["ganglie_three"];
        }
        if (!get.config("enable_all_cards")) {
          lib.translate.wuzhong_info += "若对方存活角色多于己方，则额外摸一张牌";
          lib.translate.zhuge_info = "锁定技，出牌阶段，你使用【杀】的次数上限+3";
          lib.card.list = lib.cardsThree;
          game.fixedPile = true;
        } else if (Array.isArray(lib.config.forbidthreecard)) {
          for (let i = 0; i < lib.card.list.length; i++) {
            if (lib.config.forbidthreecard.includes(lib.card.list[i][2])) {
              lib.card.list.splice(i--, 1);
            }
          }
        }
        ui.create.cardsAsync();
        game.finishCards();
      } else {
        if (lib.storage.choice == null) {
          game.save("choice", 20);
        }
        if (lib.storage.zhu == null) {
          game.save("zhu", true);
        }
        if (lib.storage.noreplace_end == null) {
          game.save("noreplace_end", true);
        }
        if (get.config("first_less") == null) {
          game.saveConfig("first_less", true, true);
        }
        if (lib.storage.autoreplaceinnerhtml == null) {
          game.save("autoreplaceinnerhtml", true);
        }
        if (lib.storage.single_control == null) {
          game.save("single_control", true);
        }
        if (lib.storage.number == null) {
          game.save("number", 3);
        }
        if (lib.storage.versus_reward == null) {
          game.save("versus_reward", 3);
        }
        if (lib.storage.versus_punish == null) {
          game.save("versus_punish", "弃牌");
        }
        if (lib.storage.replace_number == null) {
          game.save("replace_number", 3);
        }
        switch (lib.storage.seat_order) {
          case "交叉":
            lib.storage.cross_seat = true;
            lib.storage.random_seat = false;
            break;
          case "随机":
            lib.storage.cross_seat = false;
            lib.storage.random_seat = true;
            break;
          default:
            lib.storage.cross_seat = false;
            lib.storage.random_seat = false;
        }
        game.save("only_zhu", true);
        ui.wuxie.hide();
        ui.create.cardsAsync();
        game.finishCards();
      }
    },
    async (event, trigger, player) => {
      if (!_status.connectMode && _status.brawl && _status.brawl.chooseCharacterBefore) {
        _status.brawl.chooseCharacterBefore();
      }
      if (_status.connectMode) {
        if (_status.mode === "guandu") {
          for (let i = 0; i < lib.card.list.length; i++) {
            switch (lib.card.list[i][2]) {
              case "jiu":
                lib.card.list[i][2] = "xujiu";
                break;
              case "wugu":
                lib.card.list[i][2] = "tunliang";
                break;
              case "nanman":
                lib.card.list[i][2] = "lulitongxin";
                break;
              case "taoyuan":
              case "shandian":
                lib.card.list[i][2] = "yuanjun";
                break;
              case "muniu":
                lib.card.list.splice(i--, 1);
                break;
            }
          }
        }
        if (lib.configOL.versus_mode === "1v1") {
          game.randomMapOL("hidden");
        } else {
          game.randomMapOL();
        }
      } else if (_status.mode === "guandu") {
        let list = [
          ["zhu", "ezhu", "ezhong", "zhong", "ezhong", "zhong", "zhong", "ezhong"],
          ["zhu", "ezhong", "zhong", "ezhu", "ezhong", "zhong", "ezhong", "zhong"],
          ["zhu", "ezhong", "zhong", "ezhong", "zhong", "ezhong", "zhong", "ezhu"],
          ["zhu", "ezhu", "zhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong"],
          ["zhu", "ezhong", "zhong", "ezhong", "zhong", "ezhu", "zhong", "ezhong"]
        ].randomGet();
        const side = true;
        const num = Math.floor(Math.random() * 8);
        list = list.splice(8 - num).concat(list);
        _status.firstAct = game.players[num];
        for (let i = 0; i < 8; i++) {
          if (list[i][0] === "e") {
            game.players[i].side = side;
            game.players[i].identity = list[i].slice(1);
          } else {
            game.players[i].side = !side;
            game.players[i].identity = list[i];
          }
          if (game.players[i].identity === "zhu") {
            game[`${game.players[i].side}Zhu`] = game.players[i];
            game.players[i].isZhu = true;
          }
          game.players[i].setIdentity(game.players[i].identity);
          game.players[i].node.identity.dataset.color = get.translation(`${game.players[i].side}Color`);
          game.players[i].getId();
        }
        game.chooseCharacterGuandu();
      } else if (_status.mode === "four") {
        _status.fouralign = [0, 1, 2, 3, 4];
        let list = [
          ["zhong", "ezhong", "ezhong", "zhong", "zhong", "ezhong", "ezhong", "zhong"],
          ["zhong", "ezhong", "zhong", "ezhong", "ezhong", "zhong", "ezhong", "zhong"],
          ["zhong", "ezhong", "ezhong", "zhong", "ezhong", "zhong", "zhong", "ezhong"],
          ["zhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong"],
          ["zhong", "ezhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong", "zhong"]
        ][_status.fouralign.randomRemove()];
        let rand1 = Math.floor(Math.random() * 4);
        let rand2 = Math.floor(Math.random() * 4);
        for (let i = 0; i < list.length; i++) {
          if (list[i] === "zhong") {
            if (rand1 === 0) {
              list[i] = "zhu";
            }
            rand1--;
          } else {
            if (rand2 === 0) {
              list[i] = "ezhu";
            }
            rand2--;
          }
        }
        const side = Math.random() < 0.5;
        const num = Math.floor(Math.random() * 8);
        list = list.splice(8 - num).concat(list);
        _status.firstAct = game.players[num];
        for (let i = 0; i < 8; i++) {
          if (list[i][0] === "e") {
            game.players[i].side = side;
            game.players[i].identity = list[i].slice(1);
          } else {
            game.players[i].side = !side;
            game.players[i].identity = list[i];
          }
          if (game.players[i].identity === "zhu") {
            game[`${game.players[i].side}Zhu`] = game.players[i];
            game.players[i].isZhu = true;
          }
          game.players[i].setIdentity(game.players[i].identity);
          game.players[i].node.identity.dataset.color = get.translation(`${game.players[i].side}Color`);
          game.players[i].getId();
        }
        game.chooseCharacterFour();
      } else if (_status.mode === "two") {
        for (const current of game.players) {
          current.getId();
        }
        game.chooseCharacterTwo();
      } else if (_status.mode === "endless") {
        game.chooseCharacterEndless();
      } else if (_status.mode === "siguo") {
        const list = ["wei", "wei", "shu", "shu", "wu", "wu", "qun", "qun"].randomSort();
        for (let i = 0; i < game.players.length; i++) {
          game.players[i].side = list[i];
          game.players[i].identity = list[i];
          game.players[i].setIdentity(list[i]);
          game.players[i].node.identity.style.display = "none";
          game.players[i].getId();
          game.players[i].node.action.innerHTML = "即将<br>获胜";
          game.players[i].node.action.style.letterSpacing = "0px";
          game.players[i].node.action.style.lineHeight = "22px";
          game.players[i].node.action.style.top = "3px";
          game.players[i].node.action.style.right = "3px";
        }
        game.chooseCharacterSiguo();
      } else if (_status.mode === "jiange") {
        const list = ["shumech", "shu", "shuboss", "shu", "wei", "weiboss", "wei", "weimech"];
        const pos = Math.floor(Math.random() * 8);
        for (let i = 0; i < 8; i++) {
          let j = pos + i;
          if (j >= 8) {
            j -= 8;
          }
          if (list[i][0] === "w") {
            game.players[j].side = true;
            game.players[j].setIdentity("wei");
            game.players[j].identity = "wei";
          } else {
            game.players[j].side = false;
            game.players[j].setIdentity("shu");
            game.players[j].identity = "shu";
          }
          if (list[i].indexOf("mech") !== -1) {
            game.players[j].type = "mech";
          } else if (list[i].indexOf("boss") !== -1) {
            game.players[j].type = "boss";
          } else {
            game.players[j].type = "human";
          }
          game.players[i].getId();
        }
        game.chooseCharacterJiange();
      } else if (_status.mode === "three") {
        game.chooseCharacterThree();
      } else {
        game.chooseCharacter();
      }
    },
    async (event, trigger, player) => {
      const players = get.players(lib.sort.position);
      const info = [];
      for (const current of players) {
        info.push({
          name: current.name1,
          name2: current.name2,
          identity: current.node.identity.firstChild.innerHTML,
          nickname: current.node.nameol.innerHTML,
          color: current.node.identity.dataset.color
        });
      }
      _status.videoInited = true;
      if (_status.mode === "four" || _status.mode === "jiange" || _status.connectMode || _status.mode === "two" || _status.mode === "siguo" || _status.mode === "endless") {
        info.push(false);
      } else if (_status.mode === "three") {
        info.push(true);
      } else {
        info.push(lib.storage.single_control && game.players.length >= 4);
      }
      game.addVideo("init", null, info);
      event.trigger("gameStart");
      if (_status.connectMode) {
        if (_status.mode === "1v1") {
          _status.first_less = true;
          game.gameDraw(_status.firstChoose.next);
          game.phaseLoop(_status.firstChoose.next);
        } else if (_status.mode === "2v2" || _status.mode === "3v3") {
          _status.first_less = true;
          let firstChoose = _status.firstAct || game.players.randomGet();
          if (firstChoose.next.side === firstChoose.side) {
            firstChoose = firstChoose.next;
          }
          game.gameDraw(firstChoose, (player2) => {
            if (lib.configOL.replace_handcard && player2 === firstChoose.previousSeat) {
              return 5;
            }
            return 4;
          });
          game.phaseLoop(firstChoose);
        } else if (_status.mode === "guandu") {
          game.gameDraw(_status.firstAct);
          game.phaseLoop(_status.firstAct);
        } else if (_status.mode === "4v4") {
          game.gameDraw(_status.firstAct, (player2) => {
            if (player2 === _status.firstAct.previousSeat) {
              return 5;
            }
            return 4;
          });
          game.replaceHandcards(_status.firstAct.previous, _status.firstAct.previous.previous);
          game.phaseLoop(_status.firstAct);
        }
        event.finish();
      } else {
        if (_status.mode === "guandu") {
          game.gameDraw(_status.firstAct, 4);
          game.phaseLoop(_status.firstAct);
        } else if (_status.mode === "two") {
          _status.first_less = true;
          _status.first_less_forced = true;
          const firstChoose = _status.firstAct;
          game.gameDraw(firstChoose, (player2) => {
            if (player2 === _status.firstAct.previousSeat && get.config("replace_handcard_two")) {
              return 5;
            }
            return 4;
          });
          game.phaseLoop(firstChoose);
        } else if (_status.mode === "endless") {
          _status.first_less = true;
          _status.first_less_forced = true;
          const firstChoose = _status.firstAct;
          game.gameDraw(firstChoose);
          game.phaseLoop(firstChoose);
        } else if (_status.mode === "four") {
          game.gameDraw(_status.firstAct, (player2) => {
            if (player2 === _status.firstAct.previousSeat) {
              return 5;
            }
            return 4;
          });
          if (game.me === _status.firstAct.previous || game.me === _status.firstAct.previous.previous) {
            game.me.chooseBool({ prompt: "是否置换手牌？" });
            event.replaceCard = true;
          }
        } else if (_status.mode === "siguo") {
          _status.siguoai = [
            [-7.5, -2, 0, -4.5, -6, -7.5],
            [-7.5, -2, 0, -4.5, -6, -7.5],
            [-6, -6, -1, -4.5, -6, -7.5],
            [-6, -3, 0, -3, -3, -6],
            [-6, -3, 0, -3, -3, -6],
            [-6, -6, -6, -6, -6, -6]
          ].randomGet();
          const firstChoose = _status.firstAct;
          game.gameDraw(firstChoose);
          game.phaseLoop(firstChoose);
        } else if (_status.mode === "jiange") {
          let firstAct;
          for (const current of game.players) {
            if (current.type === "mech" && current.group === "wei") {
              firstAct = current;
              break;
            }
          }
          _status.actlist = [firstAct, firstAct.next, firstAct.previous, firstAct.next.next, firstAct.previous.previous, firstAct.next.next.next, firstAct.previous.previous.previous, firstAct.next.next.next.next];
          game.gameDraw(firstAct);
          game.phaseLoopJiange();
        } else if (_status.mode === "three") {
          let firstAct;
          if (_status.color) {
            firstAct = game.enemyZhu;
          } else {
            firstAct = game.friendZhu;
          }
          game.gameDraw(firstAct, 4);
          game.addGlobalSkill("autoswap");
          if (lib.config.show_handcardbutton) {
            ui.versushs = ui.create.system("手牌", null, true);
            lib.setPopped(ui.versushs, game.versusHoverHandcards, 220);
          }
          game.phaseLoopThree(firstAct);
        } else {
          let firstAct;
          if (lib.storage.zhu) {
            _status.currentSide = true;
            firstAct = _status.currentSide === game.me.side ? game.friendZhu : game.enemyZhu;
          } else {
            if (!lib.storage.cross_seat && !lib.storage.random_seat && lib.storage.number > 1) {
              for (let i = 0; i < game.players.length - 1; i++) {
                if (game.players[i].side !== game.players[i + 1].side) {
                  let actcount;
                  if (Math.random() < 0.5) {
                    actcount = i;
                  } else {
                    if (i >= lib.storage.number) {
                      actcount = i - lib.storage.number;
                    } else {
                      actcount = i + lib.storage.number;
                    }
                  }
                  if (actcount > 0) {
                    actcount--;
                  } else {
                    actcount = game.players.length - 1;
                  }
                  firstAct = game.players[actcount];
                  break;
                }
              }
            } else {
              firstAct = game.players[Math.floor(Math.random() * game.players.length)];
            }
          }
          game.gameDraw(firstAct, 4);
          _status.first_less = true;
          _status.round = 0;
          if (lib.storage.single_control) {
            game.addGlobalSkill("autoswap");
            if (game.players.length > 2 && lib.config.show_handcardbutton) {
              ui.versushs = ui.create.system("手牌", null, true);
              lib.setPopped(ui.versushs, game.versusHoverHandcards, 220);
            }
          }
          _status.enemyCount = ui.create.system(`杀敌: ${get.cnNumber(0, true)}`, null, true);
          _status.friendCount = ui.create.system(`阵亡: ${get.cnNumber(0, true)}`, null, true);
          lib.setPopped(_status.friendCount, game.versusHoverFriend);
          lib.setPopped(_status.enemyCount, game.versusHoverEnemy);
          game.versusPhaseLoop(firstAct);
        }
        if (_status.mode !== "four") {
          event.finish();
        }
      }
    },
    async (event, trigger, player, result) => {
      if (event.replaceCard && result.bool) {
        const hs = game.me.getCards("h");
        for (const card of hs) {
          card.discard(false);
        }
        game.me.directgain(get.cards(hs.length));
      }
      if (_status.ladder) {
        lib.storage.ladder.current -= 40;
        _status.ladder_tmp = true;
        game.save("ladder", lib.storage.ladder);
        game.addGlobalSkill("versus_ladder");
      }
      game.phaseLoop(_status.firstAct);
    }
  ],
  game: {
    getLadderName: (score) => {
      if (score < 900) {
        return "平民";
      }
      if (score < 1e3) {
        return "卫士五";
      }
      if (score < 1100) {
        return "卫士四";
      }
      if (score < 1200) {
        return "卫士三";
      }
      if (score < 1300) {
        return "卫士二";
      }
      if (score < 1400) {
        return "卫士一";
      }
      if (score < 1500) {
        return "校尉三";
      }
      if (score < 1600) {
        return "校尉二";
      }
      if (score < 1700) {
        return "校尉一";
      }
      if (score < 1800) {
        return "中郎将三";
      }
      if (score < 1900) {
        return "中郎将二";
      }
      if (score < 2e3) {
        return "中郎将一";
      }
      if (score < 2100) {
        return "大将五";
      }
      if (score < 2200) {
        return "大将四";
      }
      if (score < 2300) {
        return "大将三";
      }
      if (score < 2400) {
        return "大将二";
      }
      if (score < 2500) {
        return "大将一";
      }
      return "枭雄";
    },
    checkOnlineResult: (player) => {
      if (_status.mode === "4v4" || _status.mode === "guandu") {
        const zhu = game.findPlayer((current) => current.identity === "zhu");
        return player.side === zhu.side;
      }
      return game.players[0].side === player.side;
    },
    getRoomInfo: (uiintro) => {
      if (lib.configOL.versus_mode === "1v1") {
        uiintro.add(`<div class="text chat">候选人数：${lib.configOL.choice_num}人`);
        uiintro.add(`<div class="text chat">替补人数：${lib.configOL.replace_number}人`);
      }
      if (lib.configOL.versus_mode === "2v2" || lib.configOL.versus_mode === "3v3") {
        uiintro.add(`<div class="text chat">四号位保护：${lib.configOL.replace_handcard ? "开启" : "关闭"}`);
        if (lib.configOL.versus_mode === "2v2") {
          uiintro.add(`<div class="text chat">四号位【飞扬】：${lib.configOL.olfeiyang_four ? "开启" : "关闭"}`);
        }
      }
      let last = uiintro.add(`<div class="text chat">出牌时限：${lib.configOL.choose_timeout}秒`);
      if (lib.configOL.banned.length) {
        last = uiintro.add(`<div class="text chat">禁用武将：${get.translation(lib.configOL.banned)}`);
      }
      if (lib.configOL.bannedcards.length) {
        last = uiintro.add(`<div class="text chat">禁用卡牌：${get.translation(lib.configOL.bannedcards)}`);
      }
      last.style.paddingBottom = "8px";
    },
    getVideoName: () => {
      if (_status.mode === "three") {
        const zhu = game.findPlayer2((current) => current.side === game.me.side && current.identity === "zhu");
        const str3 = `${game.me.side ? "暖/" : "冷/"}${get.translation(zhu.previousSeat.name1)}/${get.translation(zhu.name1)}/${get.translation(zhu.nextSeat.name1)}`;
        return ["统率三军", str3];
      }
      let str = get.translation(game.me.name1);
      if (game.me.name2) {
        str += `/${get.translation(game.me.name2)}`;
      }
      let str2;
      if (game.versusVideoName) {
        str2 = game.versusVideoName;
      } else {
        switch (_status.mode) {
          case "two":
            str2 = "欢乐成双";
            break;
          case "endless":
            str2 = "无尽模式";
            break;
          case "three":
            str2 = "统率三军";
            break;
          case "siguo":
            str2 = "同舟共济";
            break;
          case "jiange":
            str2 = "守卫剑阁";
            break;
          case "four":
            str2 = "对决 - 4v4";
            break;
          case "guandu":
            str2 = "官渡之战";
            break;
          default:
            str2 = `对决 - ${lib.storage.number}v${lib.storage.number}`;
        }
      }
      return [str, str2];
    },
    addRecord: (bool) => {
      if (typeof bool !== "boolean") {
        return;
      }
      const data = lib.config.gameRecord.versus.data;
      const identity = `${get.cnNumber(lib.storage.number)}人`;
      if (!data[identity]) {
        data[identity] = [0, 0];
      }
      if (bool) {
        data[identity][0]++;
      } else {
        data[identity][1]++;
      }
      const list = ["一人", "两人", "三人"];
      let str = "";
      for (const item of list) {
        if (data[item]) {
          str += `${item}：${data[item][0]}胜 ${data[item][1]}负<br>`;
        }
      }
      lib.config.gameRecord.versus.str = str;
      game.saveConfig("gameRecord", lib.config.gameRecord);
    },
    chooseCharacterJiange: () => {
      const next = game.createEvent("chooseCharacter");
      next.showConfig = true;
      next.setContent(async (event, trigger, player) => {
        ui.arena.classList.add("choose-character");
        for (const i in lib.characterPack.mode_versus) {
          lib.character[i] = lib.characterPack.mode_versus[i];
        }
        lib.characterIntro.boss_liedixuande = lib.characterIntro.liubei;
        lib.characterIntro.boss_gongshenyueying = lib.characterIntro.huangyueying;
        lib.characterIntro.boss_tianhoukongming = lib.characterIntro.shen_zhugeliang;
        lib.characterIntro.boss_yuhuoshiyuan = lib.characterIntro.pangtong;
        lib.characterIntro.boss_qiaokuijunyi = lib.characterIntro.zhanghe;
        lib.characterIntro.boss_jiarenzidan = lib.characterIntro.caozhen;
        lib.characterIntro.boss_duanyuzhongda = lib.characterIntro.simayi;
        lib.characterIntro.boss_juechenmiaocai = lib.characterIntro.xiahouyuan;
        lib.characterIntro.boss_kumuyuanrang = lib.characterIntro.xiahoudun;
        lib.characterIntro.boss_baijiwenyuan = lib.characterIntro.zhangliao;
        lib.characterIntro.boss_yihanyunchang = lib.characterIntro.guanyu;
        lib.characterIntro.boss_fuweizilong = lib.characterIntro.zhaoyun;
        lib.characterIntro.boss_weiwuyide = lib.characterIntro.zhangfei;
        lib.characterIntro.boss_elaiziman = lib.characterIntro.dianwei;
        lib.characterIntro.boss_shenjianhansheng = lib.characterIntro.huangzhong;
        lib.characterIntro.boss_yiyongwenze = lib.characterIntro.yujin;
        for (const i in lib.skill) {
          if (lib.skill[i].seatRelated === true) {
            lib.skill[i] = {};
            if (lib.translate[`${i}_info`]) {
              lib.translate[`${i}_info`] = "此模式下不可用";
            }
          }
        }
        const list = {
          weilist: [],
          shulist: [],
          weimech: [],
          shumech: [],
          weiboss: [],
          shuboss: []
        };
        if (lib.characterPack.boss) {
          for (const i in lib.characterPack.boss) {
            if (!lib.character[i]) {
              if (lib.characterPack.boss[i].isJiangeBoss || lib.characterPack.boss[i].isJiangeMech) {
                lib.character[i] = lib.characterPack.boss[i];
              }
            }
          }
        }
        for (const i in lib.character) {
          if (lib.character[i].isJiangeBoss) {
            list[`${lib.character[i].group}boss`].push(i);
            continue;
          } else if (lib.character[i].isJiangeMech) {
            list[`${lib.character[i].group}mech`].push(i);
            continue;
          }
          if (lib.filter.characterDisabled(i)) {
            continue;
          }
          if (get.is.double(i)) {
            continue;
          }
          if (lib.character[i].group === "wei") {
            list.weilist.push(i);
          } else if (lib.character[i].group === "shu") {
            list.shulist.push(i);
          }
        }
        let dialog;
        switch (game.me.type) {
          case "human": {
            for (const current of game.players) {
              if (current.type !== "human") {
                current.init(list[`${current.identity}${current.type}`].randomRemove());
              }
            }
            dialog = ui.create.dialog("选择角色", [list[`${game.me.identity}list`].randomGets(8), "character"]);
            ui.create.cheat = () => {
              _status.createControl = ui.cheat2;
              ui.cheat = ui.create.control("更换", () => {
                if (ui.cheat2 && ui.cheat2.dialog === _status.event.dialog) {
                  return;
                }
                if (game.changeCoin) {
                  game.changeCoin(-3);
                }
                const buttons = ui.create.div(".buttons");
                const node = _status.event.dialog.buttons[0].parentNode;
                _status.event.dialog.buttons = ui.create.buttons(list[`${game.me.identity}list`].randomGets(8), "character", buttons);
                _status.event.dialog.content.insertBefore(buttons, node);
                buttons.addTempClass("start");
                node.remove();
                game.uncheck();
                game.check();
              });
              delete _status.createControl;
            };
            const createCharacterDialog = () => {
              event.dialogxx = ui.create.characterDialog("heightset", (name) => {
                if (lib.character[name].isJiangeBoss) {
                  return true;
                }
                if (lib.character[name].isJiangeMech) {
                  return true;
                }
                if (lib.character[name][1] !== game.me.identity) {
                  return true;
                }
              });
              if (ui.cheat2) {
                ui.cheat2.addTempClass("controlpressdownx", 500);
                ui.cheat2.classList.remove("disabled");
              }
            };
            if (lib.onfree) {
              lib.onfree.push(createCharacterDialog);
            } else {
              createCharacterDialog();
            }
            ui.create.cheat2 = () => {
              ui.cheat2 = ui.create.control("自由选将", function() {
                if (this.dialog === _status.event.dialog) {
                  if (game.changeCoin) {
                    game.changeCoin(10);
                  }
                  this.dialog.close();
                  _status.event.dialog = this.backup;
                  this.backup.open();
                  delete this.backup;
                  game.uncheck();
                  game.check();
                  if (ui.cheat) {
                    ui.cheat.addTempClass("controlpressdownx", 500);
                    ui.cheat.classList.remove("disabled");
                  }
                } else {
                  if (game.changeCoin) {
                    game.changeCoin(-10);
                  }
                  this.backup = _status.event.dialog;
                  _status.event.dialog.close();
                  _status.event.dialog = _status.event.parent.dialogxx;
                  this.dialog = _status.event.dialog;
                  this.dialog.open();
                  game.uncheck();
                  game.check();
                  if (ui.cheat) {
                    ui.cheat.classList.add("disabled");
                  }
                }
              });
              if (lib.onfree) {
                ui.cheat2.classList.add("disabled");
              }
            };
            if (!_status.brawl || !_status.brawl.chooseCharacterFixed) {
              if (!ui.cheat && get.config("change_choice")) {
                ui.create.cheat();
              }
              if (!ui.cheat2 && get.config("free_choose")) {
                ui.create.cheat2();
              }
            }
            break;
          }
          case "mech":
            dialog = ui.create.dialog("选择角色", [list[`${game.me.identity}mech`], "character"]);
            break;
          case "boss":
            for (const current of game.players) {
              if (current.type === "mech") {
                current.init(list[`${current.identity}${current.type}`].randomRemove());
              }
            }
            dialog = ui.create.dialog("选择角色", [list[`${game.me.identity}boss`], "character"]);
            break;
        }
        const choice = game.me.chooseButton({
          dialog,
          forced: true,
          selectButton: () => {
            if (get.config("double_character_jiange")) {
              return [2, 2];
            }
            return [1, 1];
          }
        }).set("onfree", true);
        const result = await choice.forResult();
        if (ui.cheat) {
          ui.cheat.close();
          delete ui.cheat;
        }
        if (ui.cheat2) {
          ui.cheat2.close();
          delete ui.cheat2;
        }
        const double = result.links.length === 2;
        game.me.init(result.links[0], result.links[1]);
        for (const current of game.players) {
          if (current.name1) {
            continue;
          }
          if (current.type !== "human") {
            current.init(list[`${current.identity}${current.type}`].randomRemove());
          } else {
            if (double) {
              current.init(list[`${current.identity}list`].randomRemove(), list[`${current.identity}list`].randomRemove());
            } else {
              current.init(list[`${current.identity}list`].randomRemove());
            }
          }
        }
        game.addRecentCharacter(game.me.name, game.me.name2);
        setTimeout(() => {
          ui.arena.classList.remove("choose-character");
        }, 500);
      });
    },
    chooseCharacterSiguo: () => {
      const next = game.createEvent("chooseCharacter");
      next.showConfig = true;
      next.setContent(async (event, trigger, player) => {
        _status.firstAct = game.players.randomGet();
        for (const current of game.players) {
          current.node.name.innerHTML = get.verticalStr(`${get.cnNumber(get.distance(_status.firstAct, current, "absolute") + 1, true)}号位`);
        }
        ui.arena.classList.add("choose-character");
        const list = {
          wei: [],
          shu: [],
          wu: [],
          qun: []
        };
        event.list = list;
        for (const i in lib.character) {
          if (lib.filter.characterDisabled(i)) {
            continue;
          }
          if (get.is.double(i)) {
            continue;
          }
          if (get.config("siguo_character") === "off" && lib.characterPack.mode_versus[i]) {
            continue;
          }
          if (list[lib.character[i][1]]) {
            list[lib.character[i][1]].push(i);
          }
        }
        const duallist = [];
        if (get.config("siguo_character") === "increase") {
          for (const i in lib.characterPack.mode_versus) {
            if (lib.characterPack.mode_versus[i][1] === game.me.identity) {
              duallist.push(i);
            }
          }
        }
        if (duallist.length && Math.random() < 0.5) {
          event.friendChoice = duallist.randomGet();
          list[game.me.identity].remove(event.friendChoice);
          duallist.length = 0;
        } else {
          event.friendChoice = list[game.me.identity].randomRemove();
        }
        const myChoice = list[game.me.identity].randomGets(7);
        if (duallist.length) {
          const myChoiceName = duallist.randomGet();
          if (list[game.me.identity].includes(myChoiceName) && !myChoice.includes(myChoiceName)) {
            myChoice.randomRemove();
            myChoice.push(myChoiceName);
          }
        }
        const dialog = ui.create.dialog("选择角色", [myChoice.concat([event.friendChoice]), "character"]);
        dialog.buttons[7].node.name.innerHTML = get.verticalStr("队友选择");
        const addSetting = (dialog2) => {
          dialog2.add("选择座位").classList.add("add-setting");
          const seats = document.createElement("table");
          seats.classList.add("add-setting");
          seats.style.margin = "0";
          seats.style.width = "100%";
          seats.style.position = "relative";
          for (let i = 1; i <= game.players.length; i++) {
            const td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
            td.innerHTML = get.cnNumber(i, true);
            td.link = i - 1;
            seats.appendChild(td);
            if (get.distance(_status.firstAct, game.me, "absolute") === i - 1) {
              td.classList.add("bluebg");
            }
            td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function() {
              if (_status.dragged) {
                return;
              }
              if (_status.justdragged) {
                return;
              }
              if (get.distance(_status.firstAct, game.me, "absolute") === this.link) {
                return;
              }
              const current = this.parentNode.querySelector(".bluebg");
              if (current) {
                current.classList.remove("bluebg");
              }
              this.classList.add("bluebg");
              _status.firstAct = game.me;
              for (let i2 = 0; i2 < this.link; i2++) {
                _status.firstAct = _status.firstAct.previous;
              }
              for (const current2 of game.players) {
                current2.node.name.innerHTML = get.verticalStr(`${get.cnNumber(get.distance(_status.firstAct, current2, "absolute") + 1, true)}号位`);
              }
            });
          }
          dialog2.content.appendChild(seats);
          if (game.me === game.zhu) {
            seats.previousSibling.style.display = "none";
            seats.style.display = "none";
          }
          dialog2.add(ui.create.div(".placeholder.add-setting"));
          dialog2.add(ui.create.div(".placeholder.add-setting"));
          if (get.is.phoneLayout()) {
            dialog2.add(ui.create.div(".placeholder.add-setting"));
          }
        };
        const removeSetting = () => {
          const dialog2 = _status.event.dialog;
          if (dialog2) {
            dialog2.style.height = "";
            delete dialog2._scrollset;
            const list2 = Array.from(dialog2.querySelectorAll(".add-setting"));
            while (list2.length) {
              list2.shift().remove();
            }
            ui.update();
          }
        };
        event.addSetting = addSetting;
        event.removeSetting = removeSetting;
        if (get.config("change_identity")) {
          addSetting(dialog);
        }
        ui.create.cheat = () => {
          _status.createControl = ui.cheat2;
          ui.cheat = ui.create.control("更换", () => {
            if (ui.cheat2 && ui.cheat2.dialog === _status.event.dialog) {
              return;
            }
            if (game.changeCoin) {
              game.changeCoin(-3);
            }
            const buttons = ui.create.div(".buttons");
            const node = _status.event.dialog.buttons[0].parentNode;
            list[game.me.identity].add(event.friendChoice);
            event.friendChoice = list[game.me.identity].randomRemove();
            _status.event.dialog.buttons = ui.create.buttons(list[game.me.identity].randomGets(7).concat([event.friendChoice]), "character", buttons);
            _status.event.dialog.buttons[7].node.name.innerHTML = get.verticalStr("队友选择");
            _status.event.dialog.content.insertBefore(buttons, node);
            buttons.addTempClass("start");
            node.remove();
            game.uncheck();
            game.check();
          });
          delete _status.createControl;
        };
        const createCharacterDialog = () => {
          event.dialogxx = ui.create.characterDialog("heightset", (name) => {
            if (lib.character[name][1] !== game.me.identity) {
              return true;
            }
          });
          if (ui.cheat2) {
            ui.cheat2.addTempClass("controlpressdownx", 500);
            ui.cheat2.classList.remove("disabled");
          }
        };
        if (lib.onfree) {
          lib.onfree.push(createCharacterDialog);
        } else {
          createCharacterDialog();
        }
        ui.create.cheat2 = () => {
          ui.cheat2 = ui.create.control("自由选将", function() {
            if (this.dialog === _status.event.dialog) {
              if (game.changeCoin) {
                game.changeCoin(10);
              }
              this.dialog.close();
              _status.event.dialog = this.backup;
              this.backup.open();
              delete this.backup;
              game.uncheck();
              game.check();
              if (ui.cheat) {
                ui.cheat.addTempClass("controlpressdownx", 500);
                ui.cheat.classList.remove("disabled");
              }
            } else {
              if (game.changeCoin) {
                game.changeCoin(-10);
              }
              this.backup = _status.event.dialog;
              _status.event.dialog.close();
              _status.event.dialog = _status.event.parent.dialogxx;
              this.dialog = _status.event.dialog;
              this.dialog.open();
              game.uncheck();
              game.check();
              if (ui.cheat) {
                ui.cheat.classList.add("disabled");
              }
            }
          });
          if (lib.onfree) {
            ui.cheat2.classList.add("disabled");
          }
        };
        const choice = game.me.chooseButton({ dialog, forced: true, filterButton: (button) => button.link !== _status.event.friendChoice }).set("onfree", true).set("friendChoice", event.friendChoice);
        if (!ui.cheat && get.config("change_choice")) {
          ui.create.cheat();
        }
        if (!ui.cheat2 && get.config("free_choose")) {
          ui.create.cheat2();
        }
        const result = await choice.forResult();
        if (ui.cheat) {
          ui.cheat.close();
          delete ui.cheat;
        }
        if (ui.cheat2) {
          ui.cheat2.close();
          delete ui.cheat2;
        }
        game.me.init(result.links[0]);
        event.list[game.me.side].remove(result.links[0]);
        const added = { wei: 0, shu: 0, wu: 0, qun: 0 };
        const dualside = { wei: [], shu: [], wu: [], qun: [] };
        if (get.config("siguo_character") === "increase") {
          for (const i in lib.characterPack.mode_versus) {
            if (Math.random() < 0.5) {
              dualside[lib.characterPack.mode_versus[i][1]].push(i);
            }
          }
        }
        for (const current of game.players) {
          current.node.identity.style.display = "";
          if (current !== game.me) {
            if (current.identity === game.me.identity) {
              current.init(event.friendChoice);
            } else {
              if (dualside[current.side] && dualside[current.side].length) {
                const enemyChoice = dualside[current.side];
                if (enemyChoice._skipped || Math.random() < 0.5) {
                  const enemyChoiceName = enemyChoice.randomRemove();
                  if (event.list[current.side].includes(enemyChoiceName)) {
                    current.init(enemyChoiceName);
                    event.list[current.side].remove(enemyChoiceName);
                  }
                } else {
                  enemyChoice._skipped = true;
                }
              }
              if (!current.name1) {
                current.init(event.list[current.side].randomRemove());
              }
            }
          }
          current.addSkill("longchuanzhibao");
          if (added[current.side] === 0) {
            if (Math.random() < 0.5) {
              current.gainZhibao();
              added[current.side] = 1;
            } else {
              added[current.side] = -1;
            }
          } else if (added[current.side] < 0) {
            current.gainZhibao();
          }
        }
        _status.firstAct.gainZhibao();
        game.addRecentCharacter(game.me.name1);
        setTimeout(() => {
          ui.arena.classList.remove("choose-character");
        }, 500);
        ui.longchuanzhibao = ui.create.system("龙船至宝", null, true);
        lib.setPopped(
          ui.longchuanzhibao,
          () => {
            const map = { wei: 0, shu: 0, wu: 0, qun: 0 };
            for (const current of game.players) {
              map[current.side] += current.storage.longchuanzhibao;
            }
            const uiintro = ui.create.dialog("hidden");
            for (const i in map) {
              uiintro.addText(`${get.translation(i)}势力：${get.cnNumber(map[i])}个`);
            }
            uiintro.content.lastChild.style.paddingBottom = "8px";
            return uiintro;
          },
          150
        );
      });
    },
    chooseCharacterTwo: () => {
      const next = game.createEvent("chooseCharacter");
      next.showConfig = true;
      next.setContent(async (event, trigger, player) => {
        ui.arena.classList.add("choose-character");
        const bool = Math.random() < 0.5;
        const bool2 = Math.random() < 0.5;
        const ref = game.players[0];
        ref.side = bool;
        ref.next.side = bool2;
        ref.next.next.side = !bool;
        ref.previous.side = !bool2;
        let firstChoose = game.players.randomGet();
        if (firstChoose.next.side === firstChoose.side) {
          firstChoose = firstChoose.next;
        }
        _status.firstAct = firstChoose;
        for (let i = 0; i < 4; i++) {
          firstChoose.node.name.innerHTML = get.verticalStr(`${get.cnNumber(i + 1, true)}号位`);
          firstChoose = firstChoose.next;
        }
        for (const current of game.players) {
          if (current.side === game.me.side) {
            current.node.identity.firstChild.innerHTML = "友";
          } else {
            current.node.identity.firstChild.innerHTML = "敌";
          }
          current.node.identity.dataset.color = `${current.side}zhu`;
        }
        const list = [];
        const list4 = [];
        for (const i in lib.characterReplace) {
          const ix = lib.characterReplace[i];
          for (let j = 0; j < ix.length; j++) {
            if (lib.filter.characterDisabled(ix[j])) {
              ix.splice(j--, 1);
            }
          }
          if (ix.length) {
            list.push(i);
            list4.addArray(ix);
          }
        }
        for (const i in lib.character) {
          if (!list4.includes(i) && !lib.filter.characterDisabled(i)) {
            list.push(i);
            list4.push(i);
          }
        }
        event.list = list;
        _status.characterlist = list4;
        const addSetting = (dialog2) => {
          dialog2.add("选择座位").classList.add("add-setting");
          const seats = document.createElement("table");
          seats.classList.add("add-setting");
          seats.style.margin = "0";
          seats.style.width = "100%";
          seats.style.position = "relative";
          for (let i = 1; i <= game.players.length; i++) {
            const td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
            td.innerHTML = get.cnNumber(i, true);
            td.link = i - 1;
            seats.appendChild(td);
            if (get.distance(_status.firstAct, game.me, "absolute") === i - 1) {
              td.classList.add("bluebg");
            }
            td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function() {
              if (_status.dragged) {
                return;
              }
              if (_status.justdragged) {
                return;
              }
              if (get.distance(_status.firstAct, game.me, "absolute") === this.link) {
                return;
              }
              const current = this.parentNode.querySelector(".bluebg");
              if (current) {
                current.classList.remove("bluebg");
              }
              this.classList.add("bluebg");
              _status.firstAct = game.me;
              for (let i2 = 0; i2 < this.link; i2++) {
                _status.firstAct = _status.firstAct.previous;
              }
              let firstChoose2 = _status.firstAct;
              firstChoose2.next.side = !firstChoose2.side;
              firstChoose2.next.next.side = !firstChoose2.side;
              firstChoose2.previous.side = firstChoose2.side;
              for (const current2 of game.players) {
                if (current2.side === game.me.side) {
                  current2.node.identity.firstChild.innerHTML = "友";
                } else {
                  current2.node.identity.firstChild.innerHTML = "敌";
                }
                current2.node.identity.dataset.color = `${current2.side}zhu`;
              }
              for (let i2 = 0; i2 < 4; i2++) {
                firstChoose2.node.name.innerHTML = get.verticalStr(`${get.cnNumber(i2 + 1, true)}号位`);
                firstChoose2 = firstChoose2.next;
              }
            });
          }
          dialog2.content.appendChild(seats);
          if (game.me === game.zhu) {
            seats.previousSibling.style.display = "none";
            seats.style.display = "none";
          }
          dialog2.add(ui.create.div(".placeholder.add-setting"));
          dialog2.add(ui.create.div(".placeholder.add-setting"));
          if (get.is.phoneLayout()) {
            dialog2.add(ui.create.div(".placeholder.add-setting"));
          }
        };
        const removeSetting = () => {
          const dialog2 = _status.event.dialog;
          if (dialog2) {
            dialog2.style.height = "";
            delete dialog2._scrollset;
            const list2 = Array.from(dialog2.querySelectorAll(".add-setting"));
            while (list2.length) {
              list2.shift().remove();
            }
            ui.update();
          }
        };
        event.addSetting = addSetting;
        event.removeSetting = removeSetting;
        let characterChoice;
        if (_status.brawl && _status.brawl.chooseCharacter) {
          characterChoice = _status.brawl.chooseCharacter(list, game.me);
        } else {
          characterChoice = list.randomGets(7);
        }
        let basenum = 1;
        let basestr = "选择角色";
        if (get.config("two_assign")) {
          basenum = 2;
          basestr = "选择你和队友的角色";
          event.two_assign = true;
        }
        if (get.config("replace_character_two")) {
          basestr += "（含一名替补角色）";
          _status.replacetwo = true;
          game.additionaldead = [];
          basenum *= 2;
        }
        const dialog = ui.create.dialog(basestr, [characterChoice, "characterx"]);
        const choice = game.me.chooseButton({ dialog, forced: true, selectButton: basenum }).set("onfree", true);
        if (!_status.brawl || !_status.brawl.noAddSetting) {
          if (get.config("change_identity")) {
            addSetting(dialog);
          }
        }
        ui.create.cheat = () => {
          _status.createControl = ui.cheat2;
          ui.cheat = ui.create.control("更换", () => {
            if (ui.cheat2 && ui.cheat2.dialog === _status.event.dialog) {
              return;
            }
            if (game.changeCoin) {
              game.changeCoin(-3);
            }
            const buttons = ui.create.div(".buttons");
            const node = _status.event.dialog.buttons[0].parentNode;
            _status.event.dialog.buttons = ui.create.buttons(list.randomGets(7), "characterx", buttons);
            _status.event.dialog.content.insertBefore(buttons, node);
            buttons.addTempClass("start");
            node.remove();
            game.uncheck();
            game.check();
          });
          delete _status.createControl;
        };
        if (lib.onfree) {
          lib.onfree.push(() => {
            event.dialogxx = ui.create.characterDialog("heightset");
            if (ui.cheat2) {
              ui.cheat2.addTempClass("controlpressdownx", 500);
              ui.cheat2.classList.remove("disabled");
            }
          });
        } else {
          event.dialogxx = ui.create.characterDialog("heightset");
        }
        ui.create.cheat2 = () => {
          ui.cheat2 = ui.create.control("自由选将", function() {
            if (this.dialog === _status.event.dialog) {
              if (game.changeCoin) {
                game.changeCoin(10);
              }
              this.dialog.close();
              _status.event.dialog = this.backup;
              this.backup.open();
              delete this.backup;
              game.uncheck();
              game.check();
              if (ui.cheat) {
                ui.cheat.addTempClass("controlpressdownx", 500);
                ui.cheat.classList.remove("disabled");
              }
            } else {
              if (game.changeCoin) {
                game.changeCoin(-10);
              }
              this.backup = _status.event.dialog;
              _status.event.dialog.close();
              _status.event.dialog = _status.event.parent.dialogxx;
              this.dialog = _status.event.dialog;
              this.dialog.open();
              game.uncheck();
              game.check();
              if (ui.cheat) {
                ui.cheat.classList.add("disabled");
              }
            }
          });
          ui.cheat2.classList.add("disabled");
        };
        if (!_status.brawl || !_status.brawl.chooseCharacterFixed) {
          if (!ui.cheat && get.config("change_choice")) {
            ui.create.cheat();
          }
          if (!ui.cheat2 && get.config("free_choose")) {
            ui.create.cheat2();
          }
        }
        const result = await choice.forResult();
        if (ui.cheat) {
          ui.cheat.close();
          delete ui.cheat;
        }
        if (ui.cheat2) {
          ui.cheat2.close();
          delete ui.cheat2;
        }
        for (const item of result.links) {
          game.addRecentCharacter(item);
        }
        game.me.init(result.links[0]);
        if (_status.replacetwo) {
          game.me.replacetwo = result.links[1];
        }
        event.list.remove(game.me.name1);
        for (const current of game.players) {
          if (current !== game.me) {
            if (_status.brawl && _status.brawl.chooseCharacter) {
              const brawlList = _status.brawl.chooseCharacter(event.list, current);
              current.init(brawlList.randomGet());
              event.list.remove(current.name1);
              if (_status.replacetwo) {
                current.replacetwo = brawlList.randomGet(current.name1);
                event.list.remove(current.replacetwo);
              }
            } else {
              if (event.two_assign && current.side === game.me.side) {
                if (_status.replacetwo) {
                  current.init(result.links[2]);
                  current.replacetwo = result.links[3];
                } else {
                  current.init(result.links[1]);
                }
              } else {
                let name = event.list.randomRemove();
                if (lib.characterReplace[name] && lib.characterReplace[name].length) {
                  name = lib.characterReplace[name].randomGet();
                }
                current.init(name);
                if (_status.replacetwo) {
                  let name2 = event.list.randomRemove();
                  if (lib.characterReplace[name2] && lib.characterReplace[name2].length) {
                    name2 = lib.characterReplace[name2].randomGet();
                  }
                  current.replacetwo = name2;
                }
              }
            }
          }
        }
        for (const current of game.players) {
          _status.characterlist.remove(current.name1);
          _status.characterlist.remove(current.replacetwo);
        }
        setTimeout(() => {
          ui.arena.classList.remove("choose-character");
        }, 500);
        if (get.config("olfeiyang_four")) {
          const target = _status.firstAct.previous;
          if (target.isIn()) {
            target.addSkill("olfeiyang");
          }
        }
        game.addGlobalSkill("versus_viewHandcard");
        if (get.config("two_phaseswap")) {
          game.addGlobalSkill("autoswap");
          if (lib.config.show_handcardbutton) {
            ui.versushs = ui.create.system("手牌", null, true);
            lib.setPopped(ui.versushs, game.versusHoverHandcards, 220);
          }
        }
      });
    },
    chooseCharacterEndless: () => {
      const next = game.createEvent("chooseCharacter");
      next.showConfig = true;
      next.setContent(async (event, trigger, player) => {
        ui.arena.classList.add("choose-character");
        for (const i in lib.skill) {
          if (lib.skill[i].seatRelated === true) {
            lib.skill[i] = {};
            if (lib.translate[`${i}_info`]) {
              lib.translate[`${i}_info`] = "此模式下不可用";
            }
          }
        }
        const firstChoose = game.players.randomGet();
        _status.firstAct = firstChoose;
        firstChoose.side = false;
        firstChoose.next.side = true;
        for (const current of game.players) {
          if (current.side === game.me.side) {
            current.node.identity.firstChild.innerHTML = "友";
          } else {
            current.node.identity.firstChild.innerHTML = "敌";
          }
          current.node.identity.dataset.color = `${current.side}zhu`;
        }
        const list = [];
        for (const i in lib.character) {
          if (!lib.filter.characterDisabled(i)) {
            list.push(i);
          }
        }
        event.list = list;
        _status.endlessListAll = list.slice(0);
        const characterChoice = list.randomGets(6);
        const dialog = ui.create.dialog("选择角色", [characterChoice, "character"]);
        const choice = game.me.chooseButton({ dialog, forced: true }).set("onfree", true);
        ui.create.cheat = () => {
          _status.createControl = ui.cheat2;
          ui.cheat = ui.create.control("更换", () => {
            if (ui.cheat2 && ui.cheat2.dialog === _status.event.dialog) {
              return;
            }
            if (game.changeCoin) {
              game.changeCoin(-3);
            }
            const buttons = ui.create.div(".buttons");
            const node = _status.event.dialog.buttons[0].parentNode;
            _status.event.dialog.buttons = ui.create.buttons(list.randomGets(7), "character", buttons);
            _status.event.dialog.content.insertBefore(buttons, node);
            buttons.addTempClass("start");
            node.remove();
            game.uncheck();
            game.check();
          });
          delete _status.createControl;
        };
        if (lib.onfree) {
          lib.onfree.push(() => {
            event.dialogxx = ui.create.characterDialog("heightset");
            if (ui.cheat2) {
              ui.cheat2.addTempClass("controlpressdownx", 500);
              ui.cheat2.classList.remove("disabled");
            }
          });
        } else {
          event.dialogxx = ui.create.characterDialog("heightset");
        }
        ui.create.cheat2 = () => {
          ui.cheat2 = ui.create.control("自由选将", function() {
            if (this.dialog === _status.event.dialog) {
              if (game.changeCoin) {
                game.changeCoin(10);
              }
              this.dialog.close();
              _status.event.dialog = this.backup;
              this.backup.open();
              delete this.backup;
              game.uncheck();
              game.check();
              if (ui.cheat) {
                ui.cheat.addTempClass("controlpressdownx", 500);
                ui.cheat.classList.remove("disabled");
              }
            } else {
              if (game.changeCoin) {
                game.changeCoin(-10);
              }
              this.backup = _status.event.dialog;
              _status.event.dialog.close();
              _status.event.dialog = _status.event.parent.dialogxx;
              this.dialog = _status.event.dialog;
              this.dialog.open();
              game.uncheck();
              game.check();
              if (ui.cheat) {
                ui.cheat.classList.add("disabled");
              }
            }
          });
          ui.cheat2.classList.add("disabled");
        };
        if (!_status.brawl || !_status.brawl.chooseCharacterFixed) {
          if (!ui.cheat && get.config("change_choice")) {
            ui.create.cheat();
          }
          if (!ui.cheat2 && get.config("free_choose")) {
            ui.create.cheat2();
          }
        }
        const result = await choice.forResult();
        if (ui.cheat) {
          ui.cheat.close();
          delete ui.cheat;
        }
        if (ui.cheat2) {
          ui.cheat2.close();
          delete ui.cheat2;
        }
        for (const item of result.links) {
          game.addRecentCharacter(item);
        }
        game.me.init(result.links[0]);
        event.list.remove(game.me.name1);
        for (const current of game.players) {
          if (current !== game.me) {
            current.init(event.list.randomRemove());
            if (_status.replacetwo) {
              current.replacetwo = event.list.randomRemove();
            }
          }
        }
        _status.endlessList = event.list;
        setTimeout(() => {
          ui.arena.classList.remove("choose-character");
        }, 500);
      });
    },
    chooseCharacterFour: () => {
      const next = game.createEvent("chooseCharacter");
      next.showConfig = true;
      next.ai = function(player, list, list2) {
        if (player.identity === "zhu") {
          list2.randomSort();
          let choice;
          if (Math.random() - 0.8 < 0 && list2.length) {
            choice = list2[0];
          } else {
            choice = list[0];
          }
          player.init(choice);
          if (!player.isInitFilter("noZhuHp")) {
            player.hp++;
            player.maxHp++;
            player.update();
          }
        } else if (Math.random() < 0.5) {
          let choice = 0;
          for (let i = 0; i < list.length; i++) {
            if (lib.character[list[i]][1] === game[`${player.side}Zhu`].group) {
              choice = i;
              break;
            }
          }
          player.init(list[choice]);
        } else {
          player.init(list[0]);
        }
        this.list.remove(player.name1);
        this.list2.remove(player.name1);
      };
      next.setContent([
        async (event, trigger, player) => {
          ui.arena.classList.add("choose-character");
          const list2 = [];
          event.list = [];
          event.choiceFour = get.config("character_four") || lib.choiceFour;
          event.filterChoice = (name) => {
            if (get.config("enable_all")) {
              return false;
            }
            return !event.choiceFour.includes(name);
          };
          for (const i in lib.character) {
            if (event.filterChoice(i)) {
              continue;
            }
            if (lib.filter.characterDisabled(i)) {
              continue;
            }
            event.list.push(i);
            if (lib.character[i].isZhugong) {
              list2.push(i);
            }
          }
          if (_status.brawl && _status.brawl.chooseCharacterFilter) {
            event.list = _status.brawl.chooseCharacterFilter(event.list);
          }
          event.list.randomSort();
          event.list2 = list2;
          event.four_assign = get.config("four_assign");
          if (!event.four_assign) {
            event.current = _status.firstAct;
          } else {
            event.current = _status.firstAct.next;
          }
          event.flipassign = true;
          if (_status.firstAct.side) {
            for (const current of game.players) {
              current.side = !current.side;
              current.node.identity.dataset.color = get.translation(`${current.side}Color`);
            }
          }
          for (const current of game.players) {
            if (!current.node.name_seat) {
              current.node.name_seat = ui.create.div(".name.name_seat", get.verticalStr(get.seatTranslation(get.distance(_status.firstAct, current, "absolute"))), current);
              current.node.name_seat.style.opacity = 1;
            }
          }
          if (get.config("ladder")) {
            const date = /* @__PURE__ */ new Date();
            if (!lib.storage.ladder) {
              lib.storage.ladder = {
                current: 900,
                top: 900,
                month: date.getMonth()
              };
              game.save("ladder", lib.storage.ladder);
            } else if (date.getMonth() !== lib.storage.ladder.month && get.config("ladder_monthly")) {
              lib.storage.ladder.month = date.getMonth();
              lib.storage.ladder.current = 900;
              game.save("ladder", lib.storage.ladder);
            }
            if (!ui.ladder) {
              ui.ladder = ui.create.system(game.getLadderName(lib.storage.ladder.current), null, true);
            }
            lib.setPopped(
              ui.ladder,
              () => {
                const uiintro = ui.create.dialog("hidden");
                uiintro.add(`<div class="text center">当前分数：<div style="width:40px;text-align:left;font-family:xinwei">${lib.storage.ladder.current + (_status.ladder_tmp ? 40 : 0)}</div></div>`);
                uiintro.add(`<div class="text center">历史最高：<div style="width:40px;text-align:left;font-family:xinwei">${lib.storage.ladder.top}</div></div>`);
                uiintro.content.lastChild.style.paddingBottom = "8px";
                return uiintro;
              },
              180
            );
            _status.ladder = true;
            _status.ladder_mmr = 0;
          }
          event.addSetting = () => {
            const cs = (link, node) => {
              game.swapPlayer(node._link);
              _status.rechoose = true;
              for (const current of game.players) {
                current.uninit();
                if (current.node.name_seat) {
                  current.node.name_seat.style.display = "";
                }
                current.classList.remove("selectedx");
              }
              game.resume();
            };
            if (!event.seatsbutton) {
              event.seatsbutton = [
                ui.create.control("一号位", cs),
                ui.create.control("一号位", cs),
                ui.create.control("一号位", cs),
                ui.create.control("换边", () => {
                  if (_status.firstAct.side === game.me.side) {
                    cs(null, { _link: _status.firstAct.nextSeat });
                  } else {
                    cs(null, { _link: _status.firstAct });
                  }
                })
              ];
            }
            const seats = [];
            for (const current of game.players) {
              if (current !== game.me && current.side === game.me.side) {
                seats.add([1 + get.distance(_status.firstAct, current, "absolute"), current]);
              }
              seats.sort((a, b) => a[0] - b[0]);
            }
            for (let i = 0; i < event.seatsbutton.length; i++) {
              if (i < seats.length) {
                event.seatsbutton[i].firstChild.innerHTML = `${get.cnNumber(seats[i][0], true)}号位`;
                event.seatsbutton[i].firstChild._link = seats[i][1];
              }
            }
          };
          if (!get.config("four_assign") && !get.config("four_phaseswap")) {
            if (get.config("change_identity")) {
              event.addSetting();
            }
            if (get.config("fouralign") && !event.fouralignbutton) {
              event.fouralignbutton = ui.create.control("变阵", () => {
                if (!_status.fouralign.length || _status.fouralign.length === 1 && _status.fouralign[0] === 0) {
                  _status.fouralign = [0, 1, 2, 3, 4];
                }
                let list = [
                  ["zhong", "ezhong", "ezhong", "zhong", "zhong", "ezhong", "ezhong", "zhong"],
                  ["zhong", "ezhong", "zhong", "ezhong", "ezhong", "zhong", "ezhong", "zhong"],
                  ["zhong", "ezhong", "ezhong", "zhong", "ezhong", "zhong", "zhong", "ezhong"],
                  ["zhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong"],
                  ["zhong", "ezhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong", "zhong"]
                ][_status.fouralign.shift()];
                let rand1 = Math.floor(Math.random() * 4);
                let rand2 = Math.floor(Math.random() * 4);
                for (let i = 0; i < list.length; i++) {
                  if (list[i] === "zhong") {
                    if (rand1 === 0) {
                      list[i] = "zhu";
                    }
                    rand1--;
                  } else {
                    if (rand2 === 0) {
                      list[i] = "ezhu";
                    }
                    rand2--;
                  }
                }
                const side = Math.random() < 0.5;
                const num = game.players.indexOf(_status.firstAct);
                list = list.splice(8 - num).concat(list);
                for (let i = 0; i < 8; i++) {
                  if (list[i][0] === "e") {
                    game.players[i].side = side;
                    game.players[i].identity = list[i].slice(1);
                  } else {
                    game.players[i].side = !side;
                    game.players[i].identity = list[i];
                  }
                  if (game.players[i].identity === "zhu") {
                    game[`${game.players[i].side}Zhu`] = game.players[i];
                    game.players[i].isZhu = true;
                  }
                  game.players[i].setIdentity(game.players[i].identity);
                  game.players[i].node.identity.dataset.color = get.translation(`${game.players[i].side}Color`);
                  if (game.players[i].node.name_seat) {
                    game.players[i].node.name_seat.remove();
                    delete game.players[i].node.name_seat;
                  }
                }
                _status.rechoose = true;
                for (const current of game.players) {
                  current.uninit();
                  if (current.node.name_seat) {
                    current.node.name_seat.style.display = "";
                  }
                  current.classList.remove("selectedx");
                }
                game.resume();
              });
            }
          }
        },
        async (event, trigger, player, result) => {
          if (event.current === game.me || event.four_assign && event.current.side === game.me.side) {
            let dialog = event.xdialog;
            if (!dialog) {
              if (get.config("expand_dialog")) {
                dialog = event.xdialog || ui.create.characterDialog("heightset", event.filterChoice, "expandall");
              } else {
                dialog = event.xdialog || ui.create.characterDialog("heightset", event.filterChoice);
              }
            }
            const names = [];
            for (const current of game.players) {
              if (current.name1) {
                names.push(current.name1);
              }
            }
            for (const button of dialog.buttons) {
              if (names.includes(button.link)) {
                button.classList.add("unselectable");
                button.classList.add("noclick");
              }
            }
            game.me.chooseButton({ dialog, forced: true }).set("onfree", true).closeDialog = false;
            event.xdialog = dialog;
            dialog.static = true;
            event.current.classList.add("selectedx");
            game.delay(0.5);
          } else {
            event.ai(event.current, event.list.randomGets(3), event.list2);
            event.current.node.name_seat.style.display = "none";
            if (!event.four_assign) {
              event.current = event.current.next;
              event.redo();
            }
          }
        },
        async (event, trigger, player, result) => {
          if (_status.rechoose) {
            delete _status.rechoose;
            event.goto(0);
            const dialog = event.xdialog;
            if (dialog) {
              for (const button of dialog.buttons) {
                button.classList.remove("unselectable");
                button.classList.remove("noclick");
              }
            }
            return;
          }
          if (event.seatsbutton) {
            for (const item of event.seatsbutton) {
              item.close();
            }
            delete event.seatsbutton;
          }
          event.current.classList.remove("selectedx");
          if (event.current.side === game.me.side) {
            event.current.init(result.buttons[0].link);
            if (event.current === game.me) {
              game.addRecentCharacter(result.buttons[0].link);
            }
            event.list.remove(event.current.name1);
            event.list2.remove(event.current.name1);
            if (event.current.identity === "zhu") {
              if (!event.current.isInitFilter("noZhuHp")) {
                event.current.hp++;
                event.current.maxHp++;
                event.current.update();
              }
            }
            event.current.node.name_seat.remove();
          }
          if (event.four_assign) {
            if (game.players.some((current) => !current.name1)) {
              const side = event.current.side;
              event.current = _status.firstAct.next;
              if (event.flipassign) {
                for (let iwhile = 0; iwhile < 8; iwhile++) {
                  event.current = event.current.next;
                  if (event.current.side !== side && !event.current.name1) {
                    break;
                  }
                }
              } else {
                for (let iwhile = 0; iwhile < 8; iwhile++) {
                  event.current = event.current.previous;
                  if (event.current.side === side && !event.current.name1) {
                    break;
                  }
                }
              }
              event.flipassign = !event.flipassign;
              event.goto(1);
            }
          } else {
            for (const current of game.players) {
              if (!current.name1) {
                event.ai(current, event.list.splice(0, 3), event.list2);
                current.node.name_seat.remove();
              }
            }
          }
        },
        async (event, trigger, player, result) => {
          if (get.config("four_phaseswap")) {
            game.addGlobalSkill("autoswap");
            if (lib.config.show_handcardbutton) {
              ui.versushs = ui.create.system("手牌", null, true);
              lib.setPopped(ui.versushs, game.versusHoverHandcards, 220);
            }
          }
          if (event.xdialog) {
            event.xdialog.close();
          }
          ui.control.style.transitionDuration = "0s";
          ui.refresh(ui.control);
          ui.arena.classList.remove("choose-character");
          setTimeout(() => {
            ui.control.style.transitionDuration = "";
          }, 500);
          lib.init.onfree();
          delete _status.fouralign;
          if (event.fouralignbutton) {
            event.fouralignbutton.close();
            delete event.fouralignbutton;
          }
        }
      ]);
    },
    chooseCharacterThree: () => {
      const next = game.createEvent("chooseCharacter");
      next.setContent(async (event, trigger, player) => {
        if (lib.config.continue_name_versus_three) {
          event.friendlist = lib.config.continue_name_versus_three.friend;
          event.enemylist = lib.config.continue_name_versus_three.enemy;
          _status.color = lib.config.continue_name_versus_three.color;
          game.additionaldead = [];
          game.saveConfig("continue_name_versus_three");
          lib.init.onfree();
        } else {
          const chara = get.config("character_three") || lib.choiceThree;
          const result = await game.chooseCharacterDouble(
            (i) => {
              if (get.config("enable_all_three")) {
                if (lib.filter.characterDisabled(i)) {
                  return false;
                }
                return !lib.filter.characterDisabled(i);
              } else {
                return chara.includes(i);
              }
            },
            (i) => i === 1 ? "主帅" : "前锋"
          ).forResult();
          game.addRecentCharacter(...result.friend);
          event.friendlist = result.friend;
          event.enemylist = result.enemy;
        }
        _status.friendBackup = event.friendlist.slice(0);
        _status.enemyBackup = event.enemylist.slice(0);
        _status.coinCoeff = get.coinCoeff(event.friendlist);
        ui.create.players(6);
        for (const current of game.players) {
          current.getId();
          current.node.action.innerHTML = "行动";
        }
        ui.arena.setNumber(7);
        for (const current of game.players) {
          current.dataset.position = parseInt(current.dataset.position) + 1;
        }
        game.singleHandcard = true;
        ui.arena.classList.add("single-handcard");
        ui.window.classList.add("single-handcard");
        ui.fakeme = ui.create.div(".fakeme.avatar");
        _status.prepareArena = true;
        ui.create.me();
        ui.me.appendChild(ui.fakeme);
        game.friend = [];
        game.enemy = [];
        for (const i in lib.skill) {
          if (lib.skill[i].seatRelated === true) {
            lib.skill[i] = {};
            if (lib.translate[`${i}_info`]) {
              lib.translate[`${i}_info`] = "此模式下不可用";
            }
          }
        }
        for (let i = 0; i < game.players.length; i++) {
          if (i < 3) {
            game.friend.push(game.players[i]);
          } else {
            game.enemy.push(game.players[i]);
          }
        }
        game.friendZhu = game.players[1];
        game.enemyZhu = game.players[4];
        for (let i = 0; i < 3; i++) {
          game.friend[i].side = _status.color;
          game.enemy[i].side = !_status.color;
          if (game.friendZhu === game.friend[i]) {
            game.friend[i].identity = "zhu";
            game.friend[i].setIdentity(`${_status.color}Zhu`);
          } else {
            game.friend[i].identity = "zhong";
            game.friend[i].setIdentity(`${_status.color}Zhong`);
          }
          if (game.enemyZhu === game.enemy[i]) {
            game.enemy[i].identity = "zhu";
            game.enemy[i].setIdentity(`${!_status.color}Zhu`);
          } else {
            game.enemy[i].identity = "zhong";
            game.enemy[i].setIdentity(`${!_status.color}Zhong`);
          }
          game.friend[i].init(event.friendlist[i]);
          game.enemy[i].init(event.enemylist[i]);
          game.friend[i].node.identity.dataset.color = get.translation(`${_status.color}Color`);
          game.enemy[i].node.identity.dataset.color = get.translation(`${!_status.color}Color`);
        }
        if (!game.friendZhu.isInitFilter("noZhuHp")) {
          game.friendZhu.maxHp++;
          game.friendZhu.hp++;
          game.friendZhu.update();
        }
        if (!game.enemyZhu.isInitFilter("noZhuHp")) {
          game.enemyZhu.maxHp++;
          game.enemyZhu.hp++;
          game.enemyZhu.update();
        }
        game.onSwapControl();
      });
    },
    chooseCharacter: () => {
      const next = game.createEvent("chooseCharacter");
      next.showConfig = true;
      next.setContent([
        async (event, trigger, player) => {
          if (lib.config.continue_name_versus) {
            _status.friend = lib.config.continue_name_versus.friend;
            _status.enemy = lib.config.continue_name_versus.enemy;
            _status.color = lib.config.continue_name_versus.color;
            game.additionaldead = [];
            game.saveConfig("continue_name_versus");
            lib.init.onfree();
            return;
          }
          event.check = function() {
            this.dialog.classList.add("fullwidth");
            this.dialog.classList.add("fullheight");
            this.dialog.classList.add("noslide");
            for (const button of this.dialog.buttons) {
              button.style.opacity = 1;
            }
            this.dialog.add("选项");
            this.dialog.versus_zhu = this.dialog.add(ui.create.switcher("versus_zhu", lib.storage.zhu)).querySelector(".toggle");
            this.dialog.versus_main_zhu = this.dialog.add(ui.create.switcher("versus_main_zhu", lib.storage.main_zhu)).querySelector(".toggle");
            if (lib.storage.zhu) {
              this.dialog.versus_main_zhu.parentNode.classList.remove("disabled");
            } else {
              this.dialog.versus_main_zhu.parentNode.classList.add("disabled");
            }
            this.dialog.versus_noreplace_end = this.dialog.add(ui.create.switcher("versus_noreplace_end", lib.storage.noreplace_end)).querySelector(".toggle");
            this.dialog.versus_assign_enemy = this.dialog.add(ui.create.switcher("versus_assign_enemy", lib.storage.assign_enemy)).querySelector(".toggle");
            this.dialog.versus_single_control = this.dialog.add(ui.create.switcher("versus_single_control", lib.storage.single_control)).querySelector(".toggle");
            this.dialog.versus_first_less = this.dialog.add(ui.create.switcher("versus_first_less", get.config("first_less"))).querySelector(".toggle");
            this.dialog.versus_reward = this.dialog.add(ui.create.switcher("versus_reward", [0, 1, 2, 3, 4], lib.storage.versus_reward)).querySelector(".toggle");
            this.dialog.versus_punish = this.dialog.add(ui.create.switcher("versus_punish", ["弃牌", "无", "摸牌"], lib.storage.versus_punish)).querySelector(".toggle");
            this.dialog.versus_seat_order = this.dialog.add(ui.create.switcher("seat_order", ["对阵", "交叉", "随机"], lib.storage.seat_order)).querySelector(".toggle");
            this.dialog.versus_number = this.dialog.add(ui.create.switcher("versus_number", [1, 2, 3], lib.storage.number)).querySelector(".toggle");
            this.dialog.replace_number = this.dialog.add(ui.create.switcher("replace_number", [0, 1, 2, 3, 5, 7, 9, 17], lib.storage.replace_number)).querySelector(".toggle");
            this.dialog.choice = this.dialog.add(ui.create.switcher("choice", [12, 16, 20, 24, 40, "∞"], lib.storage.choice)).querySelector(".toggle");
          };
          event.confirm = () => {
            const dialog = event.dialog;
            const num = lib.storage.number + lib.storage.replace_number;
            _status.friend.splice(num);
            _status.enemy.splice(num);
            dialog.close();
            if (ui.confirm) {
              ui.confirm.close();
            }
            game.resume();
          };
          ui.control.style.transition = "all 0s";
          if (get.is.phoneLayout()) {
            ui.control.style.top = "calc(100% - 80px)";
          } else if (game.layout === "newlayout") {
            ui.control.style.top = "calc(100% - 30px)";
          } else {
            ui.control.style.top = "calc(100% - 70px)";
          }
          _status.friend = [];
          _status.enemy = [];
          game.additionaldead = [];
          _status.color = Math.random() < 0.5;
          const list = [];
          for (const i in lib.character) {
            if (lib.filter.characterDisabled(i)) {
              continue;
            }
            list.push(i);
          }
          const groupSort = (name) => {
            if (lib.character[name][1] === "wei") {
              return 0;
            }
            if (lib.character[name][1] === "shu") {
              return 1;
            }
            if (lib.character[name][1] === "wu") {
              return 2;
            }
            if (lib.character[name][1] === "qun") {
              return 3;
            }
          };
          const sortByGroup = (a, b) => {
            const del = groupSort(a) - groupSort(b);
            if (del !== 0) {
              return del;
            }
            if (a.indexOf("_") !== -1) {
              a = a.slice(a.indexOf("_") + 1);
            }
            if (b.indexOf("_") !== -1) {
              b = b.slice(b.indexOf("_") + 1);
            }
            return a > b ? 1 : -1;
          };
          if (lib.storage.choice === "∞") {
            list.sort(sortByGroup);
          } else {
            list.randomSort();
          }
          _status.list = list;
          const choice = lib.storage.choice === "∞" ? list.length : lib.storage.choice;
          event.dialog = ui.create.dialog("选择角色", [list.slice(0, choice), "character"]);
          event.dialog.classList.add("fixed");
          event.check();
          ui.create.cheat = () => {
            _status.createControl = event.fill;
            ui.cheat = ui.create.control("更换", () => {
              if (_status.choosefinished) {
                return;
              }
              if (lib.storage.choice === "∞") {
                list.sort(sortByGroup);
              } else {
                list.randomSort();
              }
              _status.friend.length = 0;
              _status.enemy.length = 0;
              const choice2 = lib.storage.choice === "∞" ? list.length : lib.storage.choice;
              ui.dialog.content.firstChild.innerHTML = "选择角色";
              const buttons = ui.create.div(".buttons");
              const node = _status.event.dialog.buttons[0].parentNode;
              _status.event.dialog.buttons = ui.create.buttons(list.slice(0, choice2), "character", buttons);
              _status.event.dialog.content.insertBefore(buttons, node);
              buttons.addTempClass("start");
              node.remove();
            });
            delete _status.createControl;
          };
          if (!ui.cheat && get.config("change_choice")) {
            ui.create.cheat();
          }
          if (lib.config.test_game) {
            setTimeout(() => {
              event.switchToAuto();
            }, 500);
          }
          event.switchToAuto = () => {
            delete _status.choosefinished;
            event.fill.close();
            const buttons = _status.event.dialog.buttons.slice(0);
            buttons.randomSort();
            for (let i = 0; i < buttons.length; i++) {
              if (buttons[i].classList.contains("glow") || buttons[i].classList.contains("selectedx")) {
                buttons.splice(i, 1);
                i--;
              }
            }
            const dialog = _status.event.dialog;
            const max = dialog.versus_number.link + dialog.replace_number.link;
            for (const button of buttons) {
              if (_status.friend.length < max) {
                _status.friend.push(button.link);
              } else if (_status.enemy.length < max) {
                _status.enemy.push(button.link);
              } else {
                break;
              }
            }
            _status.friend.splice(max);
            _status.enemy.splice(max);
            dialog.close();
            if (ui.confirm) {
              ui.confirm.close();
            }
            game.resume();
          };
          event.fill = ui.create.control("补全", event.switchToAuto);
          event.custom.replace.button = (button) => {
            if (_status.choose_enemy) {
              if (button.classList.contains("glow") || button.classList.contains("selectedx") || _status.choosefinished) {
                return;
              }
              _status.choose_enemy = false;
              if (!_status.color) {
                button.classList.add("selectedx");
              } else {
                button.classList.add("glow");
              }
              _status.enemy.push(button.link);
              const buttons = _status.event.dialog.buttons.slice(0);
              for (let i = 0; i < buttons.length; i++) {
                if (buttons[i].classList.contains("glow") || buttons[i].classList.contains("selectedx")) {
                  buttons.splice(i, 1);
                  i--;
                }
              }
            } else {
              if (button.classList.contains("glow") || button.classList.contains("selectedx") || _status.choosefinished) {
                return;
              }
              if (_status.color) {
                button.classList.add("selectedx");
              } else {
                button.classList.add("glow");
              }
              _status.friend.push(button.link);
              const buttons = _status.event.dialog.buttons.slice(0);
              for (let i = 0; i < buttons.length; i++) {
                if (buttons[i].classList.contains("glow") || buttons[i].classList.contains("selectedx")) {
                  buttons.splice(i, 1);
                  i--;
                }
              }
              if (lib.storage.assign_enemy) {
                _status.choose_enemy = true;
              } else {
                const button2 = buttons[Math.floor(Math.random() * buttons.length)];
                if (_status.color) {
                  button2.classList.add("glow");
                } else {
                  button2.classList.add("selectedx");
                }
                _status.enemy.push(button2.link);
                _status.event.dialog.content.firstChild.innerHTML = `对方选择了${get.translation(button2.link)}`;
              }
            }
          };
          event.custom.add.window = () => {
            const dialog = _status.event.dialog;
            if (_status.friend.length === _status.enemy.length && _status.friend.length >= dialog.versus_number.link + dialog.replace_number.link) {
              event.fill.firstChild.innerHTML = "开始";
              _status.choosefinished = true;
              if (ui.cheat) {
                ui.cheat.close();
                delete ui.cheat;
              }
            }
            game.save("zhu", dialog.versus_zhu.link);
            if (lib.storage.zhu) {
              dialog.versus_main_zhu.parentNode.classList.remove("disabled");
            } else {
              dialog.versus_main_zhu.parentNode.classList.add("disabled");
            }
            game.save("main_zhu", dialog.versus_main_zhu.link);
            game.save("assign_enemy", dialog.versus_assign_enemy.link);
            game.save("seat_order", dialog.versus_seat_order.link);
            game.save("noreplace_end", dialog.versus_noreplace_end.link);
            game.save("single_control", dialog.versus_single_control.link);
            switch (lib.storage.seat_order) {
              case "交叉":
                lib.storage.cross_seat = true;
                lib.storage.random_seat = false;
                break;
              case "随机":
                lib.storage.cross_seat = false;
                lib.storage.random_seat = true;
                break;
              default:
                lib.storage.cross_seat = false;
                lib.storage.random_seat = false;
            }
            game.saveConfig("first_less", dialog.versus_first_less.link, true);
            game.save("number", dialog.versus_number.link);
            game.save("versus_reward", dialog.versus_reward.link);
            game.save("versus_punish", dialog.versus_punish.link);
            game.save("replace_number", dialog.replace_number.link);
            game.save("choice", dialog.choice.link);
            let count;
            if (dialog.buttons.length > lib.storage.choice) {
              count = dialog.buttons.length - lib.storage.choice;
              const removed = [];
              for (let i = dialog.buttons.length - 1; i >= 0 && count > 0; i--) {
                if (dialog.buttons[i].classList.contains("target") === false && dialog.buttons[i].classList.contains("glow") === false) {
                  dialog.buttons[i].remove();
                  _status.list.remove(dialog.buttons[i].link);
                  removed.push(dialog.buttons[i].link);
                  dialog.buttons.splice(i, 1);
                  count--;
                }
              }
              for (const item of removed) {
                _status.list.splice(lib.storage.choice, 0, item);
              }
            } else if (dialog.buttons.length < lib.storage.choice || lib.storage.choice === "∞") {
              const list2 = _status.list;
              const choice2 = lib.storage.choice === "∞" ? list2.length : lib.storage.choice;
              const buttons = dialog.querySelector(".buttons");
              let button;
              for (let i = dialog.buttons.length; i < choice2; i++) {
                button = ui.create.button(list2[i], "character", buttons).addTempClass("zoom");
                dialog.buttons.push(button);
                button.style.opacity = 1;
              }
            }
          };
          game.pause();
          lib.init.onfree();
        },
        async (event, trigger, player, result) => {
          _status.friendBackup = _status.friend.slice(0);
          _status.enemyBackup = _status.enemy.slice(0);
          _status.friendDied = [];
          _status.enemyDied = [];
          _status.totalCount = _status.friend.length;
          _status.coinCoeff = get.coinCoeff(_status.friend);
          ui.wuxie.show();
          ui.control.style.display = "none";
          setTimeout(() => {
            ui.control.style.top = "";
            ui.control.style.display = "";
            ui.control.style.transition = "";
          }, 500);
          if (ui.cheat) {
            ui.cheat.close();
            delete ui.cheat;
          }
          delete _status.list;
          const num = lib.storage.number;
          ui.create.players(num * 2);
          for (const current of game.players) {
            current.getId();
            current.node.action.innerHTML = "行动";
          }
          if (lib.storage.single_control && game.players.length >= 4) {
            ui.arena.setNumber(parseInt(ui.arena.dataset.number) + 1);
            for (const current of game.players) {
              current.dataset.position = parseInt(current.dataset.position) + 1;
            }
            game.singleHandcard = true;
            ui.arena.classList.add("single-handcard");
            ui.window.classList.add("single-handcard");
            ui.fakeme = ui.create.div(".fakeme.avatar");
          }
          _status.prepareArena = true;
          ui.create.me();
          if (ui.fakeme) {
            ui.me.appendChild(ui.fakeme);
          }
          let position;
          if (lib.storage.zhu && lib.storage.only_zhu) {
            position = Math.ceil(num / 2) - 1;
          } else {
            position = Math.floor(Math.random() * num);
          }
          game.friend = [];
          game.enemy = [];
          if (lib.storage.random_seat) {
            const players = game.players.slice(0);
            game.friend.push(game.me);
            players.remove(game.me);
            for (let i = 0; i < num - 1; i++) {
              game.friend.push(players.randomRemove());
            }
            for (let i = 0; i < num; i++) {
              game.enemy.push(players.randomRemove());
            }
          } else {
            for (const i in lib.skill) {
              if (lib.skill[i].seatRelated === true) {
                lib.skill[i] = {};
                if (lib.translate[`${i}_info`]) {
                  lib.translate[`${i}_info`] = "此模式下不可用";
                }
              }
            }
            if (lib.storage.cross_seat) {
              for (let i = 0; i < game.players.length; i++) {
                if (i % 2 === 0) {
                  game.friend.push(game.players[i]);
                } else {
                  game.enemy.push(game.players[i]);
                }
              }
            } else {
              for (let i = 0; i < position; i++) {
                game.friend.push(game.players[i - position + num * 2]);
              }
              for (let i = position; i < num; i++) {
                game.friend.push(game.players[i - position]);
              }
              for (let i = 0; i < num; i++) {
                game.enemy.push(game.players[num - position + i]);
              }
            }
          }
          if (position === Math.ceil(num / 2) - 1 && lib.storage.zhu || lib.storage.zhu && lib.storage.single_control) {
            const dialog = ui.create.dialog("按顺序选择出场角色", [_status.friend, "character"]);
            game.me.chooseButton({ dialog, selectButton: num, forced: true });
          }
          if (lib.storage.random_seat && lib.storage.zhu) {
            if (lib.storage.only_zhu) {
              game.friendZhu = game.me;
            } else {
              game.friendZhu = game.friend.randomGet();
            }
            game.enemyZhu = game.enemy.randomGet();
          }
          for (let i = 0; i < num; i++) {
            game.friend[i].side = _status.color;
            game.enemy[i].side = !_status.color;
            if (lib.storage.random_seat && lib.storage.zhu) {
              if (game.friendZhu === game.friend[i]) {
                game.friend[i].identity = "zhu";
                game.friend[i].setIdentity(`${_status.color}Zhu`);
              } else {
                game.friend[i].identity = "zhong";
                game.friend[i].setIdentity(`${_status.color}Zhong`);
              }
              if (game.enemyZhu === game.enemy[i]) {
                game.enemy[i].identity = "zhu";
                game.enemy[i].setIdentity(`${!_status.color}Zhu`);
              } else {
                game.enemy[i].identity = "zhong";
                game.enemy[i].setIdentity(`${!_status.color}Zhong`);
              }
            } else {
              if (game.me === game.friend[i] && lib.storage.zhu) {
                game.friend[i].identity = "zhu";
                game.friend[i].setIdentity(`${_status.color}Zhu`);
                game.friendZhu = game.friend[i];
              } else {
                game.friend[i].identity = "zhong";
                game.friend[i].setIdentity(`${_status.color}Zhong`);
              }
              if (lib.storage.zhu && get.distance(game.enemy[i], game.me, "pure") === num) {
                game.enemy[i].identity = "zhu";
                game.enemy[i].setIdentity(`${!_status.color}Zhu`);
                game.enemyZhu = game.enemy[i];
              } else {
                game.enemy[i].identity = "zhong";
                game.enemy[i].setIdentity(`${!_status.color}Zhong`);
              }
            }
            game.friend[i].node.identity.dataset.color = get.translation(`${_status.color}Color`);
            game.enemy[i].node.identity.dataset.color = get.translation(`${!_status.color}Color`);
          }
          if (lib.storage.zhu && !game.enemyZhu) {
            game.enemy[0].identity = "zhu";
            game.enemy[0].setIdentity(`${!_status.color}Zhu`);
            game.enemyZhu = game.enemy[0];
          }
        },
        async (event, trigger, player, result) => {
          const num = lib.storage.number;
          if (result && result.buttons) {
            const list = [];
            for (const button of result.buttons) {
              list.push(button.link);
              _status.friend.remove(button.link);
            }
            _status.friend = list.concat(_status.friend);
          }
          for (let i = 0; i < num; i++) {
            game.friend[i].init(_status.friend[i]);
            game.enemy[i].init(_status.enemy[i]);
            game.friend[i].node.identity.dataset.color = get.translation(`${_status.color}Color`);
            game.enemy[i].node.identity.dataset.color = get.translation(`${!_status.color}Color`);
          }
          if (lib.storage.zhu && lib.storage.main_zhu) {
            if (!game.friendZhu.isInitFilter("noZhuHp")) {
              game.friendZhu.maxHp++;
              game.friendZhu.hp++;
              game.friendZhu.update();
            }
            if (!game.enemyZhu.isInitFilter("noZhuHp")) {
              game.enemyZhu.maxHp++;
              game.enemyZhu.hp++;
              game.enemyZhu.update();
            }
          }
          _status.friend.splice(0, num);
          _status.enemy.splice(0, num);
          if (lib.storage.single_control && game.players.length >= 4) {
            game.onSwapControl();
          }
        }
      ]);
    },
    chooseCharacterOL: () => {
      switch (lib.configOL.versus_mode) {
        case "1v1":
          game.chooseCharacterOL1();
          break;
        case "2v2":
          game.chooseCharacterOL2();
          break;
        case "3v3":
          game.chooseCharacterOL3();
          break;
        case "4v4":
          game.chooseCharacterOL4();
          break;
        case "guandu":
          game.chooseCharacterOLGuandu();
          break;
      }
    },
    chooseCharacterOLGuandu: () => {
      const next = game.createEvent("chooseCharacter");
      next.setContent([
        async (event, trigger, player) => {
          let list = [
            ["zhu", "ezhu", "ezhong", "zhong", "ezhong", "zhong", "zhong", "ezhong"],
            ["zhu", "ezhong", "zhong", "ezhu", "ezhong", "zhong", "ezhong", "zhong"],
            ["zhu", "ezhong", "zhong", "ezhong", "zhong", "ezhong", "zhong", "ezhu"],
            ["zhu", "ezhu", "zhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong"],
            ["zhu", "ezhong", "zhong", "ezhong", "zhong", "ezhu", "zhong", "ezhong"]
          ].randomGet();
          const side = true;
          let num = Math.floor(Math.random() * 8);
          list = list.splice(8 - num).concat(list);
          for (let i = 0; i < 8; i++) {
            if (list[i][0] === "e") {
              game.players[i].side = side;
              game.players[i].identity = list[i].slice(1);
            } else {
              game.players[i].side = !side;
              game.players[i].identity = list[i];
            }
            if (game.players[i].identity === "zhu") {
              game[`${game.players[i].side}Zhu`] = game.players[i];
              game.players[i].isZhu = true;
            }
            game.players[i].setIdentity(game.players[i].identity);
            game.players[i].node.identity.dataset.color = get.translation(`${game.players[i].side}Color`);
            game.players[i].getId();
          }
          const map = {};
          num = Math.floor(Math.random() * 8);
          list = list.splice(8 - num).concat(list);
          for (let i = 0; i < 8; i++) {
            if (list[i][0] === "e") {
              game.players[i].side = side;
              game.players[i].identity = list[i].slice(1);
            } else {
              game.players[i].side = !side;
              game.players[i].identity = list[i];
            }
            map[game.players[i].playerid] = [game.players[i].side, game.players[i].identity];
          }
          const evt_list = [
            ["huoshaowuchao", "chunyuqiong"],
            ["liangcaokuifa", "sp_xuyou"],
            ["zhanyanliangzhuwenchou", "jsp_guanyu"],
            ["shishengshibai", "re_guojia"],
            ["xutuhuanjin", "yj_jushou"],
            ["liangjunxiangchi", "yj_jushou"],
            ["jianshoudaiyuan", "tianfeng"],
            ["yiruoshengqiang", "re_caocao"],
            ["shichongerjiao", "sp_xuyou"]
          ].randomGet();
          const evt = evt_list[0];
          const character = evt_list[1];
          game.addGlobalSkill(evt);
          const func = (map2, evt2, character2) => {
            for (const i in map2) {
              const player2 = lib.playerOL[i];
              if (player2) {
                player2.side = map2[i][0];
                player2.identity = map2[i][1];
                player2.setIdentity();
                player2.node.identity.dataset.color = get.translation(`${player2.side}Color`);
                if (player2.identity === "zhu") {
                  game[`${player2.side}Zhu`] = player2;
                  player2.isZhu = true;
                }
              }
            }
            ui.arena.classList.add("choose-character");
            if (evt2 === "shishengshibai") {
              ui.guanduInfo = get.is.phoneLayout() ? ui.create.div(".touchinfo.left", ui.window) : ui.create.div(ui.gameinfo);
              ui.guanduInfo.innerHTML = "十胜十败（0）";
            }
            const showGuanduEvent = (evt3, character3) => {
              if (ui[`GuanduEvent_${evt3}`]) {
                return;
              }
              ui[`GuanduEvent_${evt3}`] = ui.create.system(get.translation(evt3), null, true);
              lib.setPopped(
                ui[`GuanduEvent_${evt3}`],
                () => {
                  const uiintro = ui.create.dialog("hidden");
                  uiintro.add(get.translation(evt3));
                  uiintro.add(`<div class="text center">${get.translation(`${evt3}_info`)}</div>`);
                  const ul = uiintro.querySelector("ul");
                  if (ul) {
                    ul.style.width = "180px";
                  }
                  uiintro.add(ui.create.div(".placeholder"));
                  return uiintro;
                },
                250
              );
            };
            for (const i in lib.playerOL) {
              const target = lib.playerOL[i];
              if (target === game.me) {
                showGuanduEvent(evt2);
              } else if (target.isOnline2()) {
                target.send(showGuanduEvent, evt2, character2);
              }
            }
            if (lib.config.background_speak) {
              game.playAudio("skill", evt2);
            }
            const dialog = ui.create.dialog(`本局特殊事件：${get.translation(evt2)}`);
            dialog.addText(get.translation(`${evt2}_info`), false);
            dialog.add([[character2], "character"]);
            setTimeout(() => {
              dialog.close();
            }, 5e3);
          };
          game.broadcastAll(func, map, evt, character);
          _status.firstAct = game.falseZhu;
          game.delay(0, 5e3);
        },
        async (event, trigger, player, result) => {
          game.falseZhu.chooseButtonOL(
            [
              [game.falseZhu, ["请选择武将", [["caocao"], "characterx"]], true],
              [game.trueZhu, ["请选择武将", [["re_yuanshao"], "characterx"]], true]
            ],
            (player2, result2) => {
              if (game.online || player2 === game.me) {
                player2.init(result2.links[0]);
              }
            }
          );
        },
        async (event, trigger, player, result) => {
          game.broadcastAll((result2) => {
            for (const i in result2) {
              if (!lib.playerOL[i].name) {
                lib.playerOL[i].init(result2[i].links[0]);
              }
              lib.playerOL[i].hp++;
              lib.playerOL[i].maxHp++;
              lib.playerOL[i].update();
            }
          }, result);
        },
        async (event, trigger, player, result) => {
          event.falseList = ["xiahouyuan", "litong", "zangba", "manchong", "xunyu", "guojia", "zhangliao", "xuhuang", "caohong", "jsp_guanyu", "hanhaoshihuan", "caoren", "yujin", "liuye", "chengyu", "xunyou", "zhangxiu", "sp_jiaxu"].filter((name) => {
            if (lib.characterReplace[name]) {
              let goon = false;
              for (const i of lib.characterReplace[name]) {
                if (lib.character[i]) {
                  lib.character[i][1] = "wei";
                  goon = true;
                }
              }
              return goon;
            } else if (lib.character[name]) {
              lib.character[name][1] = "wei";
              return true;
            }
            return false;
          });
          event.trueList = ["xinping", "hanmeng", "gaogan", "yuantanyuanshang", "lvkuanglvxiang", "xinpi", "xunchen", "sp_ol_zhanghe", "chenlin", "jsp_liubei", "yj_jushou", "guotufengji", "gaolan", "xuyou", "tianfeng", "chunyuqiong", "shenpei"].filter((name) => {
            if (lib.characterReplace[name]) {
              let goon = false;
              for (const i of lib.characterReplace[name]) {
                if (lib.character[i]) {
                  lib.character[i][1] = "qun";
                  goon = true;
                }
              }
              return goon;
            } else if (lib.character[name]) {
              lib.character[name][1] = "qun";
              return true;
            }
            return false;
          });
          game.broadcast(
            (list1, list2) => {
              for (const name of list1) {
                if (lib.characterReplace[name]) {
                  for (const i of lib.characterReplace[name]) {
                    if (lib.character[i]) {
                      lib.character[i][1] = "wei";
                    }
                  }
                } else if (lib.character[name]) {
                  lib.character[name][1] = "wei";
                }
              }
              for (const name of list2) {
                if (lib.characterReplace[name]) {
                  for (const i of lib.characterReplace[name]) {
                    if (lib.character[i]) {
                      lib.character[i][1] = "qun";
                    }
                  }
                } else if (lib.character[name]) {
                  lib.character[name][1] = "qun";
                }
              }
            },
            event.falseList,
            event.trueList
          );
          event.map = {};
          const list = [];
          game.countPlayer((current) => {
            if (current.identity === "zhong") {
              const choice = event[`${current.side}List`].randomRemove(2);
              event.map[current.playerid] = choice;
              list.push([current, ["请选择武将", [choice, "characterx"]], true]);
            }
          });
          game.me.chooseButtonOL(list, (player2, result2) => {
            if (game.online || player2 === game.me) {
              player2.init(result2.links[0]);
            }
          });
        },
        async (event, trigger, player, result) => {
          for (const i in result) {
            if (result[i] === "ai") {
              result[i] = event.map[i].randomRemove(1)[0];
            } else {
              result[i] = result[i].links[0];
            }
          }
          game.broadcastAll((result2) => {
            for (const i in result2) {
              if (!lib.playerOL[i].name) {
                lib.playerOL[i].init(result2[i]);
              }
            }
            setTimeout(() => {
              ui.arena.classList.remove("choose-character");
            }, 500);
          }, result);
        }
      ]);
    },
    chooseCharacterGuandu: () => {
      const next = game.createEvent("chooseCharacter");
      next.setContent([
        async (event, trigger, player) => {
          lib.init.onfree();
          ui.arena.classList.add("choose-character");
          const side = game.me.side.toString();
          event.friendSide = side;
          event.enemySide = side === "true" ? "false" : "true";
          event.zhuList = [["caocao"], ["re_yuanshao"]];
          event.falseList = ["xiahouyuan", "litong", "zangba", "manchong", "xunyu", "guojia", "zhangliao", "xuhuang", "caohong", "jsp_guanyu", "hanhaoshihuan", "caoren", "yujin", "liuye", "chengyu", "xunyou", "zhangxiu", "sp_jiaxu"].filter((name) => {
            if (lib.characterReplace[name]) {
              let goon = false;
              for (const i of lib.characterReplace[name]) {
                if (lib.character[i]) {
                  lib.character[i][1] = "wei";
                  goon = true;
                }
              }
              return goon;
            } else if (lib.character[name]) {
              lib.character[name][1] = "wei";
              return true;
            }
            return false;
          });
          event.trueList = ["xinping", "hanmeng", "gaogan", "yuantanyuanshang", "lvkuanglvxiang", "xinpi", "xunchen", "sp_ol_zhanghe", "chenlin", "jsp_liubei", "yj_jushou", "guotufengji", "gaolan", "xuyou", "tianfeng", "chunyuqiong", "shenpei"].filter((name) => {
            if (lib.characterReplace[name]) {
              let goon = false;
              for (const i of lib.characterReplace[name]) {
                if (lib.character[i]) {
                  lib.character[i][1] = "qun";
                  goon = true;
                }
              }
              return goon;
            } else if (lib.character[name]) {
              lib.character[name][1] = "qun";
              return true;
            }
            return false;
          });
        },
        async (event, trigger, player, result) => {
          game[`${event.enemySide}Zhu`].chooseButton({ createDialog: ["请选择你的武将牌", [event.zhuList[event.enemySide === "true" ? 1 : 0], "characterx"]], forced: true });
        },
        async (event, trigger, player, result) => {
          game[`${event.enemySide}Zhu`].init(result.links[0]);
          game[`${event.enemySide}Zhu`].maxHp++;
          game[`${event.enemySide}Zhu`].hp++;
          game[`${event.enemySide}Zhu`].update();
        },
        async (event, trigger, player, result) => {
          game.countPlayer((current) => {
            if (current.side.toString() === event.enemySide && current.identity === "zhong") {
              let choice = event[`${event.enemySide}List`].randomRemove(2)[0];
              if (lib.characterReplace[choice]) {
                choice = lib.characterReplace[choice].randomGet();
              }
              current.init(choice);
            }
          });
        },
        async (event, trigger, player, result) => {
          const evt_list = [
            ["huoshaowuchao", "chunyuqiong"],
            ["liangcaokuifa", "sp_xuyou"],
            ["zhanyanliangzhuwenchou", "jsp_guanyu"],
            ["shishengshibai", "re_guojia"],
            ["xutuhuanjin", "yj_jushou"],
            ["liangjunxiangchi", "yj_jushou"],
            ["jianshoudaiyuan", "tianfeng"],
            ["yiruoshengqiang", "re_caocao"],
            ["shichongerjiao", "sp_xuyou"]
          ].randomGet();
          const evt = evt_list[0];
          const character = evt_list[1];
          game.addGlobalSkill(evt);
          const showGuanduEvent = (evt2) => {
            if (ui[`GuanduEvent_${evt2}`]) {
              return;
            }
            ui[`GuanduEvent_${evt2}`] = ui.create.system(get.translation(evt2), null, true);
            lib.setPopped(
              ui[`GuanduEvent_${evt2}`],
              () => {
                const uiintro = ui.create.dialog("hidden");
                uiintro.add(get.translation(evt2));
                uiintro.add(`<div class="text center">${get.translation(`${evt2}_info`)}</div>`);
                const ul = uiintro.querySelector("ul");
                if (ul) {
                  ul.style.width = "180px";
                }
                uiintro.add(ui.create.div(".placeholder"));
                return uiintro;
              },
              250
            );
          };
          showGuanduEvent(evt);
          game.broadcastAll((evt2) => {
            if (lib.config.background_speak) {
              game.playAudio("skill", evt2);
            }
            if (evt2 === "shishengshibai") {
              ui.guanduInfo = get.is.phoneLayout() ? ui.create.div(".touchinfo.left", ui.window) : ui.create.div(ui.gameinfo);
              ui.guanduInfo.innerHTML = "十胜十败（0）";
            }
          }, evt);
          game.me.chooseControl({ controls: ["ok"] }).set("dialog", [`###本局特殊事件：${get.translation(evt)}###${get.translation(`${evt}_info`)}`, [[character], "character"]]);
        },
        async (event, trigger, player, result) => {
          game[`${event.friendSide}Zhu`].chooseButton({ createDialog: ["请选择你的武将牌", [event.zhuList[event.friendSide === "true" ? 1 : 0], "characterx"]], forced: true });
        },
        async (event, trigger, player, result) => {
          if (game[`${event.friendSide}Zhu`] === game.me) {
            game[`${event.friendSide}Zhu`].init(result.links[0]);
            game[`${event.friendSide}Zhu`].maxHp++;
            game[`${event.friendSide}Zhu`].hp++;
            game[`${event.friendSide}Zhu`].update();
          } else {
            event.zhuChoice = result.links[0];
          }
        },
        async (event, trigger, player, result) => {
          if (game.me.identity !== "zhu") {
            event.choose_me = true;
            game.me.chooseButton({ createDialog: ["请选择你的武将牌", [event[`${event.friendSide}List`].randomRemove(2), "characterx"]], forced: true });
          }
        },
        async (event, trigger, player, result) => {
          if (event.choose_me) {
            game.me.init(result.links[0]);
          }
          game.countPlayer((current) => {
            if (current !== game.me && current.side.toString() === event.friendSide) {
              if (current.identity === "zhong") {
                let choice = event[`${event.friendSide}List`].randomRemove(2)[0];
                if (lib.characterReplace[choice]) {
                  choice = lib.characterReplace[choice].randomGet();
                }
                current.init(choice);
              } else {
                current.init(event.zhuChoice);
                current.maxHp++;
                current.hp++;
                current.update();
              }
            }
          });
        },
        async (event, trigger, player, result) => {
          setTimeout(() => {
            ui.arena.classList.remove("choose-character");
          }, 500);
        }
      ]);
    },
    chooseCharacterOL4: () => {
      const next = game.createEvent("chooseCharacter");
      next.setContent([
        async (event, trigger, player) => {
          let list = [
            ["zhong", "ezhong", "ezhong", "zhong", "zhong", "ezhong", "ezhong", "zhong"],
            ["zhong", "ezhong", "zhong", "ezhong", "ezhong", "zhong", "ezhong", "zhong"],
            ["zhong", "ezhong", "ezhong", "zhong", "ezhong", "zhong", "zhong", "ezhong"],
            ["zhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong"],
            ["zhong", "ezhong", "ezhong", "zhong", "ezhong", "zhong", "ezhong", "zhong"]
          ].randomGet();
          let rand1 = Math.floor(Math.random() * 4);
          let rand2 = Math.floor(Math.random() * 4);
          for (let i = 0; i < list.length; i++) {
            if (list[i] === "zhong") {
              if (rand1 === 0) {
                list[i] = "zhu";
              }
              rand1--;
            } else {
              if (rand2 === 0) {
                list[i] = "ezhu";
              }
              rand2--;
            }
          }
          const side = Math.random() < 0.5;
          const map = {};
          const num = Math.floor(Math.random() * 8);
          list = list.splice(8 - num).concat(list);
          _status.firstAct = game.players[num];
          event.current = _status.firstAct.next;
          for (let i = 0; i < 8; i++) {
            if (list[i][0] === "e") {
              game.players[i].side = side;
              game.players[i].identity = list[i].slice(1);
            } else {
              game.players[i].side = !side;
              game.players[i].identity = list[i];
            }
            map[game.players[i].playerid] = [game.players[i].side, game.players[i].identity];
          }
          if (_status.firstAct.side) {
            for (const current of game.players) {
              current.side = !current.side;
              map[current.playerid] = [current.side, current.identity];
            }
          }
          game.broadcastAll((current) => {
            for (const currentPlayer of game.players) {
              currentPlayer.node.name_seat = ui.create.div(".name.name_seat", get.verticalStr(lib.translate[`unknown${get.distance(current, currentPlayer, "absolute")}`]), currentPlayer);
              currentPlayer.node.name_seat.style.opacity = 1;
            }
          }, _status.firstAct);
          const filterChoice = (name) => {
            if (!lib.choiceFour.includes(name)) {
              return true;
            }
            if (lib.characterPack.refresh && lib.characterPack.refresh[name]) {
              if (!lib.configOL.characterPack.includes("refresh")) {
                return true;
              }
              return false;
            }
            if (lib.characterPack.standard && lib.characterPack.standard[name]) {
              if (!lib.configOL.characterPack.includes("standard")) {
                return true;
              }
              if (lib.configOL.characterPack.includes("refresh") && lib.characterPack.refresh[`re_${name}`]) {
                return true;
              }
              return false;
            }
            if (lib.characterPack.shenhua && lib.characterPack.shenhua[name]) {
              if (!lib.configOL.characterPack.includes("shenhua")) {
                return true;
              }
              return false;
            }
            if (lib.characterPack.sp && lib.characterPack.sp[name]) {
              if (!lib.configOL.characterPack.includes("sp")) {
                return true;
              }
              return false;
            }
            if (lib.characterPack.yijiang && lib.characterPack.yijiang[name]) {
              if (!lib.configOL.characterPack.includes("yijiang")) {
                return true;
              }
              return false;
            }
            return true;
          };
          event.flipassign = true;
          event.videoId = lib.status.videoId++;
          const func = (filter, id, selected, map2, choiceFour) => {
            lib.choiceFour = choiceFour;
            const dialog = ui.create.characterDialog("heightset", filter, "expandall").open();
            dialog.videoId = id;
            for (const i in map2) {
              const player2 = lib.playerOL[i];
              if (player2) {
                player2.side = map2[i][0];
                player2.identity = map2[i][1];
                player2.setIdentity();
                player2.node.identity.dataset.color = get.translation(`${player2.side}Color`);
                if (player2.identity === "zhu") {
                  game[`${player2.side}Zhu`] = player2;
                  player2.isZhu = true;
                }
              }
            }
            ui.arena.classList.add("choose-character");
          };
          event.map = map;
          event.selected = [];
          game.broadcastAll(func, filterChoice, event.videoId, event.selected, map, lib.choiceFour);
          _status.onreconnect = [func, filterChoice, event.videoId, event.selected, map, lib.choiceFour];
        },
        async (event, trigger, player, result) => {
          game.broadcastAll((player2) => {
            player2.classList.add("selectedx");
          }, event.current);
          event.current.chooseButton({
            forced: true,
            filterButton: (button) => !_status.event.selected.includes(button.link),
            ai: (button) => {
              if (_status.event.player.identity === "zhu") {
                if (Math.random() < 0.8) {
                  const info = lib.character[button.link];
                  if (!info || !info.isZhugong) {
                    return 0;
                  }
                }
              }
              const seed = _status.event.seed;
              const rank = get.rank(button.link, true);
              if (seed > 0.4) {
                return rank >= 6 ? Math.random() : -Math.random();
              } else if (seed > 0.1) {
                return rank >= 4 && rank < 6 ? Math.random() : -Math.random();
              } else {
                return rank < 4 ? Math.random() : -Math.random();
              }
            }
          }).set("selected", event.selected).set("dialog", event.videoId).set("seed", Math.random());
        },
        async (event, trigger, player, result) => {
          event.selected.push(result.links[0]);
          game.broadcastAll(
            (player2, name, zhu) => {
              player2.classList.remove("selectedx");
              player2.init(name);
              if (player2.node.name_seat) {
                player2.node.name_seat.remove();
              }
            },
            event.current,
            result.links[0]
          );
          if (event.current.identity === "zhu") {
            if (!event.current.isInitFilter("noZhuHp")) {
              event.current.maxHp++;
              event.current.hp++;
              event.current.update();
            }
          }
          event.current.classList.remove("selectedx");
          if (game.players.some((current) => !current.name1)) {
            const side = event.current.side;
            event.current = _status.firstAct.next;
            if (event.flipassign) {
              for (let iwhile = 0; iwhile < 8; iwhile++) {
                event.current = event.current.next;
                if (event.current.side !== side && !event.current.name1) {
                  break;
                }
              }
            } else {
              for (let iwhile = 0; iwhile < 8; iwhile++) {
                event.current = event.current.previous;
                if (event.current.side === side && !event.current.name1) {
                  break;
                }
              }
            }
            event.flipassign = !event.flipassign;
            event.goto(1);
          }
        },
        async (event, trigger, player, result) => {
          _status.onreconnect = [
            () => {
              for (const player2 of game.players) {
                if (player2.identity === "zhu") {
                  game[`${player2.side}Zhu`] = player2;
                  player2.isZhu = true;
                }
              }
            }
          ];
          game.broadcastAll((id) => {
            const dialog = get.idDialog(id);
            if (dialog) {
              dialog.close();
            }
            setTimeout(() => {
              ui.arena.classList.remove("choose-character");
            }, 500);
          }, event.videoId);
        }
      ]);
    },
    chooseCharacterOL3: () => {
      const next = game.createEvent("chooseCharacterOL");
      next.setContent(async (event, trigger, player) => {
        game.additionaldead = [];
        game.broadcastAll(
          (ref, bool) => {
            ui.arena.classList.add("choose-character");
            for (let i = 0; i < 6; i++) {
              ref.side = bool;
              ref = ref.next;
              bool = !bool;
            }
            for (const current of game.players) {
              if (current.side === game.me.side) {
                current.node.identity.firstChild.innerHTML = "友";
              } else {
                current.node.identity.firstChild.innerHTML = "敌";
              }
              current.node.identity.dataset.color = `${current.side}zhu`;
            }
          },
          game.players[0],
          Math.random() < 0.5
        );
        if (game.me.side == null) {
          game.me.side = game.players[0].side;
        }
        _status.onreconnect = [
          () => {
            const players = game.players.concat(game.dead);
            for (const current of players) {
              if (current.side === game.me.side) {
                current.node.identity.firstChild.innerHTML = "友";
              } else {
                current.node.identity.firstChild.innerHTML = "敌";
              }
            }
          }
        ];
        const list = get.charactersOL();
        const choose = [];
        event.list = list;
        for (const current of game.players) {
          choose.push([current, ["选择出场和备用武将", [list.randomRemove(5), "character"]], 2, true]);
        }
        const result = await game.me.chooseButtonOL(choose, (player2, result2) => {
          if (game.online || player2 === game.me) {
            player2.init(result2.links[0]);
          }
        }).forResult();
        for (const i in result) {
          if (result[i] === "ai") {
            result[i] = event.list.randomRemove(2);
          } else {
            result[i] = result[i].links;
          }
        }
        game.broadcastAll(
          (result2, func1, func2) => {
            setTimeout(() => {
              ui.arena.classList.remove("choose-character");
            }, 500);
            _status.friendDied = [];
            _status.enemyDied = [];
            _status.friend = [];
            _status.enemy = [];
            _status.enemyCount = ui.create.system(`杀敌: ${get.cnNumber(0, true)}`, null, true);
            _status.friendCount = ui.create.system(`阵亡: ${get.cnNumber(0, true)}`, null, true);
            lib.setPopped(_status.friendCount, func1);
            lib.setPopped(_status.enemyCount, func2);
            for (const i in result2) {
              if (!lib.playerOL[i].name1) {
                lib.playerOL[i].init(result2[i][0]);
              }
              if (lib.playerOL[i].side === game.me.side) {
                _status.friend.push(result2[i][1]);
              } else {
                _status.enemy.push(result2[i][1]);
              }
            }
          },
          result,
          game.versusHoverFriend,
          game.versusHoverEnemy
        );
        _status.onreconnect = [
          (list1, list2, list3, list4, side, func1, func2) => {
            if (side !== game.me.side) {
              let tmp;
              tmp = list1;
              list1 = list2;
              list2 = tmp;
              tmp = list3;
              list3 = list4;
              list4 = tmp;
            }
            _status.friendDied = list1;
            _status.enemyDied = list2;
            _status.friend = list3;
            _status.enemy = list4;
            _status.enemyCount = ui.create.system(`杀敌: ${get.cnNumber(_status.enemyDied.length, true)}`, null, true);
            _status.friendCount = ui.create.system(`阵亡: ${get.cnNumber(_status.friendDied.length, true)}`, null, true);
            lib.setPopped(_status.friendCount, func1);
            lib.setPopped(_status.enemyCount, func2);
            for (const current of game.players) {
              if (current.side === game.me.side) {
                current.node.identity.firstChild.innerHTML = "友";
              } else {
                current.node.identity.firstChild.innerHTML = "敌";
              }
            }
          },
          _status.friendDied,
          _status.enemyDied,
          _status.friend,
          _status.enemy,
          game.me.side,
          game.versusHoverFriend,
          game.versusHoverEnemy
        ];
      });
    },
    chooseCharacterOL2: () => {
      const next = game.createEvent("chooseCharacterOL");
      next.setContent([
        async (event, trigger, player) => {
          const ref = game.players[0];
          const bool = Math.random() < 0.5;
          const bool2 = Math.random() < 0.5;
          ref.side = bool;
          ref.next.side = bool2;
          ref.next.next.side = !bool;
          ref.previous.side = !bool2;
          let firstChoose = game.players.randomGet();
          if (firstChoose.next.side === firstChoose.side) {
            firstChoose = firstChoose.next;
          }
          _status.firstAct = firstChoose;
          for (let i = 0; i < 4; i++) {
            firstChoose.node.name.innerHTML = get.verticalStr(`${get.cnNumber(i + 1, true)}号位`);
            firstChoose = firstChoose.next;
          }
          for (const current of game.players) {
            if (current.side === game.me.side) {
              current.node.identity.firstChild.innerHTML = "友";
            } else {
              current.node.identity.firstChild.innerHTML = "敌";
            }
            current.node.identity.dataset.color = `${current.side}zhu`;
          }
          ui.arena.classList.add("choose-character");
          game.broadcast(
            (ref2, bool3, bool22, firstChoose2) => {
              ref2.side = bool3;
              ref2.next.side = bool22;
              ref2.next.next.side = !bool3;
              ref2.previous.side = !bool22;
              for (let i = 0; i < 4; i++) {
                firstChoose2.node.name.innerHTML = get.verticalStr(`${get.cnNumber(i + 1, true)}号位`);
                firstChoose2 = firstChoose2.next;
              }
              for (const current of game.players) {
                if (current.side === game.me.side) {
                  current.node.identity.firstChild.innerHTML = "友";
                } else {
                  current.node.identity.firstChild.innerHTML = "敌";
                }
                current.node.identity.dataset.color = `${current.side}zhu`;
              }
              ui.arena.classList.add("choose-character");
            },
            ref,
            bool,
            bool2,
            _status.firstAct
          );
          _status.onreconnect = [
            () => {
              const players = game.players.concat(game.dead);
              for (const current of players) {
                if (current.side === game.me.side) {
                  current.node.identity.firstChild.innerHTML = "友";
                } else {
                  current.node.identity.firstChild.innerHTML = "敌";
                }
              }
            }
          ];
          const list = [];
          const libCharacter = {};
          const list4 = [];
          for (const item of lib.configOL.characterPack) {
            const pack = lib.characterPack[item];
            for (const j in pack) {
              if (lib.connectBanned.includes(j)) {
                continue;
              }
              if (lib.character[j]) {
                libCharacter[j] = pack[j];
              }
            }
          }
          for (const i in lib.characterReplace) {
            const ix = lib.characterReplace[i];
            for (let j = 0; j < ix.length; j++) {
              if (!libCharacter[ix[j]] || lib.filter.characterDisabled(ix[j], libCharacter)) {
                ix.splice(j--, 1);
              }
            }
            if (ix.length) {
              list.push(i);
              list4.addArray(ix);
            }
          }
          game.broadcast((list2) => {
            for (const i in lib.characterReplace) {
              const ix = lib.characterReplace[i];
              for (let j = 0; j < ix.length; j++) {
                if (!list2.includes(ix[j])) {
                  ix.splice(j--, 1);
                }
              }
            }
          }, list4);
          for (const i in libCharacter) {
            if (list4.includes(i) || lib.filter.characterDisabled(i, libCharacter)) {
              continue;
            }
            list.push(i);
            list4.push(i);
          }
          const choose = {};
          event.list = list;
          _status.characterlist = list4;
          for (const current of game.players) {
            choose[current.playerid] = list.randomRemove(6);
          }
          game._characterChoice = choose;
          event._choiceMap = {};
          event.videoId = lib.status.videoId++;
          game.broadcastAll(
            (id, choice) => {
              game._characterChoice = choice;
              game._characterDialogID = id;
              const dialog = ui.create.dialog("请选择武将");
              dialog.videoId = id;
              let players;
              let friends;
              const player2 = game.me;
              for (const i in choice) {
                const current = lib.playerOL[i];
                if (current === player2) {
                  players = choice[i];
                } else if (current.side === player2.side) {
                  friends = choice[i];
                }
              }
              dialog.addText("你的选将框");
              let buttons = ui.create.div(".buttons", dialog.content);
              dialog.players = ui.create.buttons(players, "characterx", buttons);
              dialog.buttons = dialog.buttons.concat(dialog.players);
              dialog.addText("队友的选将框（点击可为其推荐武将）");
              buttons = ui.create.div(".buttons", dialog.content);
              dialog.friends = ui.create.buttons(friends, "characterx", buttons);
              dialog.buttons = dialog.buttons.concat(dialog.friends);
            },
            event.videoId,
            choose
          );
          const send = () => {
            const next2 = game.me.chooseButton({
              selectButton: [1, 2],
              forced: true,
              //托管选择
              ai: (button) => {
                if (ui.selected.buttons.length) {
                  return 0;
                }
                const dialog = get.idDialog(game._characterDialogID);
                if (dialog.friends && dialog.friends.includes(button)) {
                  return 0;
                }
                if (dialog.classList.contains("glow2")) {
                  return 1 + Math.random();
                }
                return 0.5 + Math.random();
              }
            });
            next2.set("dialog", game._characterDialogID);
            next2.set("callback", (player2, result) => {
              player2.init(result.links[0], null, null, false);
              const button = game._playerChoice;
              button.classList.remove("glow2");
              button.classList.add("selected");
              delete game._playerChoice;
            });
            next2.set("custom", {
              replace: {
                button: (button) => {
                  const dialog = get.idDialog(game._characterDialogID);
                  const origin = button._link;
                  button.link;
                  if (dialog.players.includes(button)) {
                    if (!button.classList.contains("selected")) {
                      button.classList.add("selected");
                      ui.selected.buttons.add(button);
                      game._playerChoice = button;
                      for (const other of dialog.players) {
                        if (other !== button && other.classList.contains("selected")) {
                          other.classList.remove("selected");
                          ui.selected.buttons.remove(other);
                        }
                      }
                    }
                    game.check();
                  } else {
                    if (game._friendConfirmed) {
                      return;
                    }
                    if (button === dialog._recommending) {
                      return;
                    }
                    dialog._recommending = button;
                    button.classList.add("glow2");
                    for (const other of dialog.friends) {
                      if (other !== button && other.classList.contains("glow2")) {
                        other.classList.remove("glow2");
                      }
                    }
                    if (dialog.delay) {
                      return;
                    }
                    if (game.online) {
                      game.send("tempResult", origin);
                    } else {
                      game.me.tempUnwait(origin);
                    }
                    dialog.delay = setTimeout(() => {
                      delete dialog.delay;
                      if (game._friendConfirmed) {
                        return;
                      }
                      const recommend = dialog._recommending._link;
                      if (recommend !== origin) {
                        if (game.online) {
                          game.send("tempResult", recommend);
                        } else {
                          game.me.tempUnwait(recommend);
                        }
                      }
                    }, 500);
                  }
                }
              },
              add: {}
            });
            if (game.online) {
              game.resume();
            }
          };
          event.recommend = (player2, choice) => {
            if (player2.name1 || game._characterDialogID == null) {
              return;
            }
            const dialog = get.idDialog(game._characterDialogID);
            if (dialog) {
              for (const button of dialog.players) {
                if (button._link === choice) {
                  button.classList.add("glow2");
                } else if (button.classList.contains("glow2")) {
                  button.classList.remove("glow2");
                }
              }
            }
          };
          event.confirm = (player2, choice) => {
            if (!player2.name1) {
              player2.init(choice, null, null, false);
            }
            game._friendConfirmed = true;
            if (game._characterDialogID == null) {
              return;
            }
            const dialog = get.idDialog(game._characterDialogID);
            if (!dialog) {
              return;
            }
            for (const button of dialog.friends) {
              button.classList.remove("glow2");
              if (button.link === choice || lib.characterReplace[button._link] && lib.characterReplace[button._link].includes(choice)) {
                button.classList.add("selected");
              }
            }
          };
          const sendback = (result, player2) => {
            const type2 = typeof result;
            const friend = game.findPlayer((current) => current !== player2 && current.side === player2.side);
            if (type2 === "string") {
              if (friend === game.me) {
                event.recommend(friend, result);
              } else if (friend.isOnline()) {
                friend.send(event.recommend, friend, result);
              } else {
                friend._aiChoice = result;
              }
            } else if (result && type2 === "object") {
              const choice = result.links[0];
              event._choiceMap[player2.playerid] = choice;
              if (friend === game.me) {
                event.confirm(player2, choice);
              } else if (friend.isOnline()) {
                friend.send(event.confirm, player2, choice);
              }
            }
          };
          event.sendback = sendback;
          event.ai_targets = [];
          for (const current of game.players) {
            if (current.isOnline()) {
              event.withol = true;
              current.send(send);
              current.wait(sendback);
            } else if (current === game.me) {
              event.withme = true;
              send();
              game.me.wait(sendback);
            } else {
              event.ai_targets.push(current);
              current.showTimer();
            }
          }
          if (event.ai_targets.length) {
            event.ai_targets.randomSort();
            setTimeout(() => {
              event.interval = setInterval(() => {
                const target = event.ai_targets.shift();
                const list2 = game._characterChoice[target.playerid];
                let choice;
                if (target._aiChoice && list2.includes(target._aiChoice)) {
                  choice = target._aiChoice;
                } else {
                  choice = list2.randomGet();
                }
                if (lib.characterReplace[choice]) {
                  choice = lib.characterReplace[choice].randomGet();
                }
                event.sendback(
                  {
                    result: bool,
                    links: [choice]
                  },
                  target
                );
                target.hideTimer();
                if (!event.ai_targets.length) {
                  clearInterval(event.interval);
                  if (event.withai) {
                    game.resume();
                  }
                }
              }, 1e3);
            }, 6e3);
          }
        },
        async (event, trigger, player, result) => {
          if (event.withme) {
            game.me.unwait(result);
          }
        },
        async (event, trigger, player, result) => {
          if (event.withol && !event.resultOL) {
            game.pause();
          }
        },
        async (event, trigger, player, result) => {
          if (event.ai_targets.length > 0) {
            event.withai = true;
            game.pause();
          }
        },
        async (event, trigger, player) => {
          game.broadcastAll((id) => {
            const dialog = get.idDialog(id);
            if (dialog) {
              dialog.close();
              clearInterval(dialog.delay);
            }
          }, event.videoId);
          const result = event._choiceMap;
          for (const i in lib.playerOL) {
            if (!lib.character[result[i]]) {
              result[i] = game._characterChoice[i].randomGet();
            }
            _status.characterlist.remove(result[i]);
            if (!lib.playerOL[i].name1) {
              lib.playerOL[i].init(result[i]);
            }
            lib.playerOL[i].update();
          }
          game.broadcast((result2) => {
            for (const i in result2) {
              if (!lib.playerOL[i].name1) {
                lib.playerOL[i].init(result2[i]);
                lib.playerOL[i].update();
              }
            }
            setTimeout(() => {
              ui.arena.classList.remove("choose-character");
            }, 500);
          }, result);
          setTimeout(() => {
            ui.arena.classList.remove("choose-character");
          }, 500);
          if (lib.configOL.olfeiyang_four) {
            const target = _status.firstAct.previous;
            if (target.isIn()) {
              target.addSkill("olfeiyang");
            }
          }
          game.addGlobalSkill("versus_viewHandcard");
        }
      ]);
    },
    chooseCharacterOL1: () => {
      const next = game.createEvent("chooseCharacterOL");
      next.setContent(async (event, trigger, player) => {
        game.removeCard("shengdong");
        game.additionaldead = [];
        let list = get.charactersOL();
        list = list.randomGets(parseInt(lib.configOL.choice_num));
        list.remove("huatuo");
        list.remove("sunquan");
        event.videoId = lib.status.videoId++;
        if (Math.random() < 0.5) {
          event.choosing = game.players[0];
        } else {
          event.choosing = game.players[1];
        }
        const createDialog = (list2, id, list1, list22) => {
          const dialog = ui.create.dialog("选择角色", [list2, "character"]);
          dialog.classList.add("fullwidth");
          dialog.classList.add("fullheight");
          dialog.classList.add("noslide");
          dialog.classList.add("fixed");
          dialog.videoId = id;
          if (list22 && list22) {
            ui.arena.classList.add("playerhidden");
            for (const button of dialog.buttons) {
              if (list1.includes(button.link)) {
                button.classList.add("selectedx");
              } else if (list22.includes(button.link)) {
                button.classList.add("glow");
              }
            }
          } else {
            if (list1 !== game.me) {
              dialog.content.firstChild.innerHTML = "等待对手选择";
            }
          }
        };
        game.broadcastAll(createDialog, list, event.videoId, event.choosing);
        game.players[0].storage.versuslist = [];
        game.players[1].storage.versuslist = [];
        event.selected = [];
        _status.firstChoose = event.choosing;
        event.num = (parseInt(lib.configOL.replace_number) + 1) * 2;
        _status.onreconnect = [createDialog, list, event.videoId, _status.firstChoose.storage.versuslist, _status.firstChoose.next.storage.versuslist];
        game.broadcastAll((player2) => {
          player2.setIdentity("truezhu");
          player2.next.setIdentity("falsezhu");
        }, _status.firstChoose);
        do {
          const result3 = await event.choosing.chooseButton({
            selectButton: 1,
            forced: true,
            filterButton: (button) => !_status.event.selected.includes(button.link),
            ai: () => Math.random()
          }).set("selected", event.selected).forResult();
          event.choosing.storage.versuslist.push(result3.links[0]);
          game.broadcastAll(
            (link, choosing, first, id) => {
              const dialog = get.idDialog(id);
              if (dialog) {
                if (choosing === game.me) {
                  choosing = "你";
                } else {
                  choosing = "对手";
                }
                dialog.content.firstChild.innerHTML = `${choosing}选择了${get.translation(link)}`;
                for (const button of dialog.buttons) {
                  if (button.link === link) {
                    if (first) {
                      button.classList.add("selectedx");
                    } else {
                      button.classList.add("glow");
                    }
                  }
                }
              }
            },
            result3.links[0],
            event.choosing,
            event.choosing === _status.firstChoose,
            event.videoId
          );
          event.selected.push(result3.links[0]);
          event.choosing = event.choosing.next;
          event.num--;
        } while (event.num);
        await game.delay(2);
        game.broadcastAll((id) => {
          ui.arena.classList.remove("playerhidden");
          const dialog = get.idDialog(id);
          if (dialog) {
            dialog.close();
          }
        }, event.videoId);
        _status.friendDied = [];
        _status.enemyDied = [];
        _status.friend = game.players[0].storage.versuslist;
        _status.enemy = game.players[1].storage.versuslist;
        delete game.players[0].storage.versuslist;
        delete game.players[1].versuslist;
        _status.enemyCount = ui.create.system(`杀敌: ${get.cnNumber(0, true)}`, null, true);
        _status.friendCount = ui.create.system(`阵亡: ${get.cnNumber(0, true)}`, null, true);
        lib.setPopped(_status.friendCount, game.versusHoverFriend);
        lib.setPopped(_status.enemyCount, game.versusHoverEnemy);
        game.me.side = true;
        game.players[0].side = true;
        game.players[1].side = false;
        const func = (list1, list2, list3, list4, func1, func2, playerid) => {
          if (game.me.playerid === playerid) {
            game.me.side = true;
            game.me.next.side = false;
          } else {
            game.me.side = false;
            game.me.next.side = true;
          }
          if (game.me.side) {
            _status.enemyDied = list1;
            _status.friendDied = list2;
            _status.enemy = list3;
            _status.friend = list4;
          } else {
            _status.friendDied = list1;
            _status.enemyDied = list2;
            _status.friend = list3;
            _status.enemy = list4;
          }
          _status.enemyCount = ui.create.system(`杀敌: ${get.cnNumber(_status.enemyDied.length, true)}`, null, true);
          _status.friendCount = ui.create.system(`阵亡: ${get.cnNumber(_status.friendDied.length, true)}`, null, true);
          lib.setPopped(_status.friendCount, func1);
          lib.setPopped(_status.enemyCount, func2);
        };
        _status.onreconnect = [func, _status.enemyDied, _status.friendDied, _status.enemy, _status.friend, game.versusHoverFriend, game.versusHoverEnemy, game.players[0].playerid];
        game.broadcast(func, _status.enemyDied, _status.friendDied, _status.enemy, _status.friend, game.versusHoverFriend, game.versusHoverEnemy, game.players[0].playerid);
        const choices = [
          [game.players[0], ["选择出场角色", [_status.friend, "character"]]],
          [game.players[1], ["选择出场角色", [_status.enemy, "character"]]]
        ];
        const result = await game.me.chooseButtonOL(choices, (player2, result3) => {
          if (game.online || player2 === game.me) {
            player2.init(result3.links[0]);
          }
        }).forResult();
        let result1;
        const friend = result[game.players[0].playerid];
        if (friend && friend.links && friend.links.length) {
          result1 = friend.links[0];
        } else {
          result1 = _status.friend.randomGet();
        }
        let result2;
        const enemy = result[game.players[1].playerid];
        if (enemy && enemy.links && enemy.links.length) {
          result2 = enemy.links[0];
        } else {
          result2 = _status.enemy.randomGet();
        }
        if (!game.players[0].name1) {
          game.players[0].init(result1);
        }
        if (!game.players[1].name1) {
          game.players[1].init(result2);
        }
        _status.friend.remove(result1);
        _status.enemy.remove(result2);
        game.broadcast(
          (result12, result22) => {
            if (game.me.side) {
              if (!game.me.name1) {
                game.me.init(result12);
              }
              if (!game.me.next.name1) {
                game.me.next.init(result22);
              }
              _status.friend.remove(result12);
              _status.enemy.remove(result22);
            } else {
              if (!game.me.name1) {
                game.me.init(result22);
              }
              if (!game.me.next.name1) {
                game.me.next.init(result12);
              }
              _status.friend.remove(result22);
              _status.enemy.remove(result12);
            }
          },
          result1,
          result2
        );
      });
    },
    phaseLoopThree: (player) => {
      _status.isRoundFilter = (event) => event._isThreeRound === true;
      const next = game.createEvent("phaseLoop");
      next.player = player;
      next.swap = (player2) => {
        if (player2.side === game.me.side) {
          return game.enemyZhu;
        } else {
          return game.me;
        }
      };
      next.setContent([
        async (event, trigger, player2) => {
          if (game.players.includes(event.player)) {
            lib.onphase.forEach((i) => i());
            const phase = event.player.phase();
            if (!game.players.some((current) => current.classList.contains("acted"))) {
              phase._isThreeRound = true;
            }
            event.next.remove(phase);
            let isRoundEnd = false;
            if (lib.onround.every((i) => i(phase, event.player))) {
              isRoundEnd = _status.roundSkipped;
              if (_status.isRoundFilter) {
                isRoundEnd = _status.isRoundFilter(phase, event.player);
              } else if (_status.seatNumSettled) {
                const seatNum = event.player.getSeatNum();
                if (seatNum !== 0) {
                  if (get.itemtype(_status.lastPhasedPlayer) !== "player" || seatNum < _status.lastPhasedPlayer.getSeatNum()) {
                    isRoundEnd = true;
                  }
                }
              } else if (event.player === _status.roundStart) {
                isRoundEnd = true;
              }
              if (isRoundEnd && _status.globalHistory.some((i) => i.isRound)) {
                for (const current of game.players) {
                  current.classList.remove("acted");
                }
                game.log();
                await event.trigger("roundEnd");
              }
            }
            event.next.push(phase);
            player2.classList.add("acted");
            await phase;
          }
          await event.trigger("phaseOver");
        },
        async (event, trigger, player2) => {
          if (player2.identity !== "zhu") {
            for (let i = 0; i < game.players.length; i++) {
              if (game.players[i].side === player2.side && game.players[i].identity !== "zhu" && game.players[i] !== player2 && !game.players[i].classList.contains("acted")) {
                event.player = game.players[i];
                lib.onphase.forEach((i2) => i2());
                const phase = event.player.phase();
                if (!game.players.some((current) => current.classList.contains("acted"))) {
                  phase._isThreeRound = true;
                }
                event.next.remove(phase);
                let isRoundEnd = false;
                if (lib.onround.every((i2) => i2(phase, event.player))) {
                  isRoundEnd = _status.roundSkipped;
                  if (_status.isRoundFilter) {
                    isRoundEnd = _status.isRoundFilter(phase, event.player);
                  } else if (_status.seatNumSettled) {
                    const seatNum = event.player.getSeatNum();
                    if (seatNum !== 0) {
                      if (get.itemtype(_status.lastPhasedPlayer) !== "player" || seatNum < _status.lastPhasedPlayer.getSeatNum()) {
                        isRoundEnd = true;
                      }
                    }
                  } else if (event.player === _status.roundStart) {
                    isRoundEnd = true;
                  }
                  if (isRoundEnd && _status.globalHistory.some((i2) => i2.isRound)) {
                    for (const current of game.players) {
                      current.classList.remove("acted");
                    }
                    game.log();
                    await event.trigger("roundEnd");
                  }
                }
                event.next.push(phase);
                event.player.classList.add("acted");
                await phase;
                break;
              }
            }
            await event.trigger("phaseOver");
          }
        },
        async (event, trigger, player2) => {
          let target = event.swap(player2);
          let swap = [];
          const swap2 = [];
          for (const current of game.players) {
            if (!current.classList.contains("acted")) {
              if (current.side === target.side) {
                swap.push(current);
              } else {
                swap2.push(current);
              }
            }
          }
          if (swap.length === 0) {
            if (swap2.length) {
              target = event.swap(target);
              swap = swap2;
            } else {
              for (const current of game.players) {
                current.classList.remove("acted");
              }
              delete _status.roundStart;
              event.redo();
              await game.delay();
              return;
            }
          }
          if (swap.length === 1) {
            event.directresult = swap[0];
          } else {
            const rand = Math.random();
            const next2 = target.chooseTarget("选择行动的角色", true, (card, player3, target2) => target2.side === target.side && !target2.classList.contains("acted"));
            next2._triggered = null;
            next2.includeOut = true;
            next2.ai = (target2) => {
              let num = 0;
              if (target2.hasCards("j")) {
                num -= 5;
              }
              if (target2.identity !== "zhu") {
                for (const current of game.players) {
                  if (current.identity !== "zhu" && current !== target2 && current.side === target2.side && current.hasCards("j")) {
                    num -= 2;
                  }
                }
              }
              if (rand < 1 / 3) {
                num += 1 / (target2.hp + 1);
              } else if (rand < 2 / 3) {
                num += target2.countCards("h") / 5;
              }
              return num;
            };
          }
        },
        async (event, trigger, player2, result) => {
          if (event.directresult) {
            event.player = event.directresult;
            delete event.directresult;
          } else if (result.bool) {
            event.player = result.targets[0];
          }
          event.goto(0);
        }
      ]);
    },
    versusPhaseLoop: (player) => {
      const next = game.createEvent("phaseLoop");
      next.player = player;
      next.setContent([
        async (event, trigger, player2) => {
          if (game.players.includes(event.player)) {
            lib.onphase.forEach((i) => i());
            const phase = event.player.phase();
            event.next.remove(phase);
            let isRoundEnd = false;
            if (lib.onround.every((i) => i(phase, event.player))) {
              isRoundEnd = _status.roundSkipped;
              if (_status.isRoundFilter) {
                isRoundEnd = _status.isRoundFilter(phase, event.player);
              } else if (_status.seatNumSettled) {
                const seatNum = event.player.getSeatNum();
                if (seatNum !== 0) {
                  if (get.itemtype(_status.lastPhasedPlayer) !== "player" || seatNum < _status.lastPhasedPlayer.getSeatNum()) {
                    isRoundEnd = true;
                  }
                }
              } else if (event.player === _status.roundStart) {
                isRoundEnd = true;
              }
              if (isRoundEnd && _status.globalHistory.some((i) => i.isRound)) {
                for (const current of game.players) {
                  current.classList.remove("acted");
                }
                game.log();
                await event.trigger("roundEnd");
              }
            }
            event.next.push(phase);
            if (lib.storage.zhu) {
              player2.classList.add("acted");
            }
            await phase;
          }
          await event.trigger("phaseOver");
        },
        async (event, trigger, player2) => {
          if (lib.storage.zhu) {
            _status.currentSide = !_status.currentSide;
            _status.round++;
            if (_status.round >= 2 * Math.max(game.friend.length, game.enemy.length)) {
              _status.round = 0;
              for (const current of game.players) {
                current.classList.remove("acted");
              }
              delete _status.roundStart;
            }
            const list = _status.currentSide === game.me.side ? game.friend.slice(0) : game.enemy.slice(0);
            for (let i = 0; i < list.length; i++) {
              if (list[i].classList.contains("acted") || list[i].isOut()) {
                list.splice(i, 1);
                i--;
              }
            }
            if (list.length === 0) {
              event.redo();
            } else if (list.length === 1 || game.me !== game.friendZhu && !lib.storage.single_control || _status.currentSide !== game.me.side) {
              list.sort((a, b) => {
                if (a.countCards("j") > b.countCards("j")) {
                  return 1;
                }
                return a.hp - b.hp;
              });
              event.player = list[0];
              event.goto(0);
            } else {
              const result = await game.me.chooseTarget("选择要行动的角色", true, (card, player3, target) => target.classList.contains("acted") === false && target.side === game.me.side).set("includeOut", true).forResult();
              event.player = result.targets[0];
              event.goto(0);
            }
          } else {
            event.player = event.player.next;
            event.goto(0);
          }
        }
      ]);
    },
    phaseLoopJiange: () => {
      const next = game.createEvent("phaseLoop");
      next.num = 0;
      next.player = _status.actlist[0];
      next.setContent(async (event, trigger, player) => {
        while (true) {
          if (game.players.includes(event.player)) {
            lib.onphase.forEach((i) => i());
            const phase = event.player.phase();
            event.next.remove(phase);
            let isRoundEnd = false;
            if (lib.onround.every((i) => i(phase, event.player))) {
              isRoundEnd = _status.roundSkipped;
              if (_status.isRoundFilter) {
                isRoundEnd = _status.isRoundFilter(phase, event.player);
              } else if (_status.seatNumSettled) {
                const seatNum = event.player.getSeatNum();
                if (seatNum !== 0) {
                  if (get.itemtype(_status.lastPhasedPlayer) !== "player" || seatNum < _status.lastPhasedPlayer.getSeatNum()) {
                    isRoundEnd = true;
                  }
                }
              } else if (event.player === _status.roundStart) {
                isRoundEnd = true;
              }
              if (isRoundEnd && _status.globalHistory.some((i) => i.isRound)) {
                game.log();
                await event.trigger("roundEnd");
              }
            }
            event.next.push(phase);
            await phase;
          }
          await event.trigger("phaseOver");
          const findNext = (current) => {
            const index = _status.actlist.indexOf(current);
            return _status.actlist[(index + 1) % _status.actlist.length];
          };
          event.player = findNext(event.player);
        }
      });
    },
    replacePlayerOL: (player) => {
      const next = game.createEvent("replacePlayer", false, _status.event.getParent());
      next.source = player;
      next.setContent("replacePlayerOL");
    },
    replacePlayer: (player) => {
      const next = game.createEvent("replacePlayer", false, _status.event.getParent());
      next.source = player;
      next.setContent("replacePlayer");
    },
    replacePlayerTwo: (player, character) => {
      const next = game.createEvent("replacePlayerTwo", false, _status.event.getParent());
      next.source = player;
      next.character = character;
      next.setContent("replacePlayerTwo");
    },
    versusClickToSwap: function(e) {
      if (_status.dragged) {
        return;
      }
      if (this.link === game.me) {
        if (!this.classList.contains("buttonclick")) {
          this.addTempClass("buttonclick");
        }
      } else if (_status.event.player === game.me && !_status.auto) {
        game.me.popup("请稍后再换人");
        e.stopPropagation();
      } else {
        game.modeSwapPlayer(this.link);
      }
    },
    versusHoverEnemy: () => {
      const uiintro = ui.create.dialog("hidden");
      if (_status.enemyDied.length) {
        uiintro.add("已阵亡");
        uiintro.add([_status.enemyDied, "character"]);
      }
      uiintro.add("未上场");
      if (_status.enemy.length) {
        uiintro.add([_status.enemy, "character"]);
      } else {
        uiintro.add("（无）");
      }
      return uiintro;
    },
    versusHoverFriend: () => {
      const uiintro = ui.create.dialog("hidden");
      if (_status.friendDied.length) {
        uiintro.add("已阵亡");
        uiintro.add([_status.friendDied, "character"]);
      }
      uiintro.add("未上场");
      if (_status.friend.length) {
        uiintro.add([_status.friend, "character"]);
      } else {
        uiintro.add("（无）");
      }
      return uiintro;
    },
    versusHoverHandcards: () => {
      const uiintro = ui.create.dialog("hidden");
      let added = false;
      for (const current of game.players) {
        if (current.name && current.side === game.me.side && current !== game.me) {
          added = true;
          uiintro.add(get.translation(current));
          const cards = current.getCards("h");
          if (cards.length) {
            uiintro.addSmall(cards, true);
          } else {
            uiintro.add("（无）");
          }
        }
      }
      if (added) {
        return uiintro;
      }
    },
    versusCheckEnemy: () => {
      _status.clicked = true;
      if (ui.intro) {
        ui.intro.close();
        if (ui.intro.source === "versusCheckEnemy") {
          delete ui.intro;
          ui.control.show();
          game.resume2();
          return;
        }
      }
      game.pause2();
      ui.control.hide();
      ui.intro = ui.create.dialog();
      ui.intro.source = "versusCheckEnemy";
      if (_status.enemyDied.length) {
        ui.intro.add("已阵亡");
        ui.intro.add([_status.enemyDied, "character"]);
      }
      ui.intro.add("未上场");
      if (_status.enemy.length) {
        ui.intro.add([_status.enemy, "character"]);
      } else {
        ui.intro.add("（无）");
      }
    },
    versusCheckFriend: () => {
      _status.clicked = true;
      if (ui.intro) {
        ui.intro.close();
        if (ui.intro.source === "versusCheckFriend") {
          delete ui.intro;
          ui.control.show();
          game.resume2();
          return;
        }
      }
      game.pause2();
      ui.control.hide();
      ui.intro = ui.create.dialog();
      ui.intro.source = "versusCheckFriend";
      if (_status.friendDied.length) {
        ui.intro.add("已阵亡");
        ui.intro.add([_status.friendDied, "character"]);
      }
      ui.intro.add("未上场");
      if (_status.friend.length) {
        ui.intro.add([_status.friend, "character"]);
      } else {
        ui.intro.add("（无）");
      }
    },
    versusSwapPlayer: function() {
      if (ui.intro) {
        ui.intro.close();
        if (ui.intro.source === "versusSwapPlayer") {
          delete ui.intro;
          ui.control.show();
          game.resume2();
          return;
        }
      }
      if (_status.event.player === game.me && _status.paused || _status.paused2) {
        game.me.popup("请稍后再换人");
      } else {
        _status.clicked = true;
        if (ui.intro) {
          ui.intro.close();
          if (ui.intro.source === this.parentNode) {
            delete ui.intro;
            ui.control.show();
            game.resume2();
            return;
          }
        }
        game.pause2();
        ui.control.hide();
        ui.intro = ui.create.dialog();
        ui.intro.source = "versusSwapPlayer";
        const players = [];
        for (const current of game.players) {
          if (current.side === game.me.side && current !== game.me) {
            players.push(current);
          }
        }
        ui.intro.add(players, true);
        const buttons = ui.intro.querySelectorAll(".button");
        for (const button of buttons) {
          button.addEventListener(lib.config.touchscreen ? "touchend" : "click", game.versusClickToSwap);
        }
      }
    },
    switchAutoreplace: function(e) {
      e.stopPropagation();
      this.classList.toggle("on");
      game.save("autoreplaceinnerhtml", this.classList.contains("on"));
    },
    onSwapControl: () => {
      game.addVideo("onSwapControl");
      const name = game.me.name;
      if (ui.fakeme && ui.fakeme.current !== name) {
        ui.fakeme.current = name;
        if (ui.versushighlight && ui.versushighlight !== game.me) {
          ui.versushighlight.classList.remove("current_action");
        }
        ui.versushighlight = game.me;
        game.me.classList.add("current_action");
        ui.fakeme.style.backgroundImage = game.me.node.avatar.style.backgroundImage;
      }
    },
    modeSwapPlayer: (player) => {
      if (_status.mode === "three" || _status.mode === "standard" && lib.storage.single_control) {
        game.swapControl(player);
        game.onSwapControl();
      } else {
        game.swapPlayer(player);
      }
    },
    updateLineMe: (opacity, player) => {
      if (!player) {
        player = game.me;
      }
      ui.lineme.width = ui.window.offsetWidth;
      ui.lineme.height = ui.window.offsetHeight;
      const ctx = ui.linemectx;
      ctx.shadowBlur = 5;
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.fillStyle = "white";
      if (typeof opacity !== "number") {
        opacity = 0.5;
      }
      ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 2]);
      ctx.beginPath();
      let startx;
      let endx;
      let pos;
      const endy = game.me.offsetHeight / 2 + game.me.offsetTop + ui.arena.offsetTop;
      const starty = ui.me.offsetTop + ui.arena.offsetTop + ui.me.offsetHeight / 2;
      if (game.me.offsetLeft + game.me.offsetWidth / 2 <= ui.arena.offsetWidth / 2) {
        startx = ui.me.offsetLeft + ui.arena.offsetLeft;
        endx = game.me.offsetLeft + ui.arena.offsetLeft;
        pos = -1;
      } else {
        startx = ui.me.offsetLeft + ui.arena.offsetLeft + ui.me.offsetWidth;
        endx = game.me.offsetWidth + game.me.offsetLeft + ui.arena.offsetLeft;
        pos = 1;
      }
      ctx.moveTo(startx, starty);
      startx += pos * ui.arena.offsetLeft / 2;
      ctx.quadraticCurveTo(startx, starty, startx, starty - (starty - endy) / 2);
      ctx.quadraticCurveTo(startx, endy, endx, endy);
      ctx.stroke();
    }
  },
  jiangeboss: Object.assign(
    new Proxy(
      {},
      {
        set(target, prop, newValue) {
          return Reflect.set(target, prop, get.convertedCharacter(newValue));
        }
      }
    ),
    {
      boss_liedixuande: {
        sex: "male",
        group: "shu",
        hp: 5,
        skills: ["boss_lingfeng", "boss_jizhen"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "shu",
        names: "刘|备"
      },
      boss_gongshenyueying: {
        sex: "female",
        group: "shu",
        hp: 4,
        skills: ["boss_gongshenjg", "boss_jingmiao", "boss_zhinang"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "shu",
        names: "黄|月英"
      },
      boss_tianhoukongming: {
        sex: "male",
        group: "shu",
        hp: 4,
        skills: ["boss_biantian", "bazhen"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "shu",
        names: "诸葛|亮"
      },
      boss_yuhuoshiyuan: {
        sex: "male",
        group: "shu",
        hp: 4,
        skills: ["boss_yuhuojg", "boss_qiwu", "boss_tianyujg"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "shu",
        names: "庞|统"
      },
      boss_qiaokuijunyi: {
        sex: "male",
        group: "wei",
        hp: 4,
        skills: ["boss_huodi", "boss_jueji"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "wei",
        names: "张|郃"
      },
      boss_jiarenzidan: {
        sex: "male",
        group: "wei",
        hp: 5,
        skills: ["boss_chiying", "boss_jingfan"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "wei",
        names: "曹|真"
      },
      boss_duanyuzhongda: {
        sex: "male",
        group: "wei",
        hp: 5,
        skills: ["boss_fanshi", "boss_xuanlei", "boss_skonghun"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "wei",
        names: "司马|懿"
      },
      boss_juechenmiaocai: {
        sex: "male",
        group: "wei",
        hp: 5,
        skills: ["boss_chuanyun", "boss_leili", "boss_fengxing"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "wei",
        names: "夏侯|渊"
      },
      boss_jileibaihu: {
        sex: "male",
        group: "shu",
        hp: 5,
        skills: ["boss_jiguan", "boss_zhenwei", "boss_benlei"],
        isJiangeMech: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "shu",
        names: "null|null"
      },
      boss_yunpingqinglong: {
        sex: "male",
        group: "shu",
        hp: 5,
        skills: ["boss_jiguan", "boss_mojianjg"],
        isJiangeMech: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "shu",
        names: "null|null"
      },
      boss_lingjiaxuanwu: {
        sex: "male",
        group: "shu",
        hp: 5,
        skills: ["boss_jiguan", "yizhong", "boss_lingyu"],
        isJiangeMech: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "shu",
        names: "null|null"
      },
      boss_chiyuzhuque: {
        sex: "male",
        group: "shu",
        hp: 5,
        skills: ["boss_jiguan", "boss_yuhuojg", "boss_tianyun"],
        isJiangeMech: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "shu",
        names: "null|null"
      },
      boss_fudibian: {
        sex: "male",
        group: "wei",
        hp: 5,
        skills: ["boss_jiguan", "boss_didongjg"],
        isJiangeMech: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "wei",
        names: "null|null"
      },
      boss_tuntianchiwen: {
        sex: "male",
        group: "wei",
        hp: 5,
        skills: ["boss_jiguan", "boss_tanshi", "boss_tunshi"],
        isJiangeMech: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "wei",
        names: "null|null"
      },
      boss_shihuosuanni: {
        sex: "male",
        group: "wei",
        hp: 5,
        skills: ["boss_jiguan", "boss_lianyujg"],
        isJiangeMech: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "wei",
        names: "null|null"
      },
      boss_lieshiyazi: {
        sex: "male",
        group: "wei",
        hp: 5,
        skills: ["boss_jiguan", "boss_nailuo"],
        isJiangeMech: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "wei",
        names: "null|null"
      },
      boss_kumuyuanrang: {
        sex: "male",
        group: "wei",
        hp: 5,
        skills: ["boss_bashi", "boss_danjing"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "wei",
        names: "夏侯|惇"
      },
      boss_baijiwenyuan: {
        sex: "male",
        group: "wei",
        hp: 5,
        skills: ["boss_jiaoxie"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "wei",
        names: "张|辽"
      },
      boss_yihanyunchang: {
        sex: "male",
        group: "shu",
        hp: 5,
        skills: ["boss_xiaorui", "boss_huchen"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "shu",
        names: "关|羽"
      },
      boss_fuweizilong: {
        sex: "male",
        group: "shu",
        hp: 5,
        skills: ["boss_fengjian", "boss_keding"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "shu",
        names: "赵|云"
      },
      boss_weiwuyide: {
        sex: "male",
        group: "shu",
        hp: 4,
        skills: ["boss_mengwu", "boss_hupo", "boss_shuhun"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "shu",
        names: "张|飞"
      },
      boss_elaiziman: {
        sex: "male",
        group: "wei",
        hp: 5,
        skills: ["boss_yingji", "boss_zhene", "boss_weizhu"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "wei",
        names: "典|韦"
      },
      boss_shenjianhansheng: {
        sex: "male",
        group: "shu",
        hp: 4,
        skills: ["boss_qixian", "boss_jinggong", "boss_beishi"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "shu",
        names: "黄|忠"
      },
      boss_yiyongwenze: {
        sex: "male",
        group: "wei",
        hp: 4,
        skills: ["boss_hanjun", "boss_pigua", "boss_zhengji"],
        isJiangeBoss: true,
        isHiddenBoss: true,
        isBossAllowed: true,
        extraModeData: "wei",
        names: "于|禁"
      }
    }
  ),
  cardsFour: [
    ["spade", 7, "sha"],
    ["spade", 8, "sha"],
    ["spade", 8, "sha"],
    ["spade", 9, "sha"],
    ["spade", 9, "sha"],
    ["spade", 10, "sha"],
    ["spade", 10, "sha"],
    ["club", 2, "sha"],
    ["club", 3, "sha"],
    ["club", 4, "sha"],
    ["club", 5, "sha"],
    ["club", 6, "sha"],
    ["club", 7, "sha"],
    ["club", 8, "sha"],
    ["club", 8, "sha"],
    ["club", 9, "sha"],
    ["club", 9, "sha"],
    ["club", 10, "sha"],
    ["club", 10, "sha"],
    ["club", 11, "sha"],
    ["club", 11, "sha"],
    ["heart", 10, "sha"],
    ["heart", 10, "sha"],
    ["heart", 11, "sha"],
    ["diamond", 6, "sha"],
    ["diamond", 7, "sha"],
    ["diamond", 8, "sha"],
    ["diamond", 9, "sha"],
    ["diamond", 10, "sha"],
    ["diamond", 13, "sha"],
    ["heart", 2, "shan"],
    ["heart", 2, "shan"],
    ["heart", 13, "shan"],
    ["diamond", 2, "shan"],
    ["diamond", 2, "shan"],
    ["diamond", 3, "shan"],
    ["diamond", 4, "shan"],
    ["diamond", 5, "shan"],
    ["diamond", 6, "shan"],
    ["diamond", 7, "shan"],
    ["diamond", 8, "shan"],
    ["diamond", 9, "shan"],
    ["diamond", 10, "shan"],
    ["diamond", 11, "shan"],
    ["diamond", 11, "shan"],
    ["heart", 3, "tao"],
    ["heart", 4, "tao"],
    ["heart", 6, "tao"],
    ["heart", 7, "tao"],
    ["heart", 8, "tao"],
    ["heart", 9, "tao"],
    ["heart", 12, "tao"],
    ["diamond", 12, "tao"],
    ["spade", 2, "bagua"],
    ["club", 2, "bagua"],
    ["spade", 5, "jueying"],
    ["club", 5, "dilu"],
    ["heart", 13, "zhuahuang"],
    ["heart", 5, "chitu"],
    ["spade", 13, "dawan"],
    ["diamond", 13, "zixin"],
    ["club", 1, "zhuge"],
    ["diamond", 1, "zhuge"],
    ["spade", 2, "cixiong"],
    ["spade", 6, "qinggang"],
    ["spade", 5, "qinglong"],
    ["spade", 12, "zhangba"],
    ["diamond", 5, "guanshi"],
    ["diamond", 12, "fangtian"],
    ["heart", 5, "qilin"],
    ["heart", 3, "wugu"],
    ["heart", 4, "wugu"],
    ["heart", 1, "taoyuan"],
    ["spade", 7, "nanman"],
    ["spade", 13, "nanman"],
    ["club", 7, "nanman"],
    ["heart", 1, "wanjian"],
    ["spade", 1, "juedou"],
    ["club", 1, "juedou"],
    ["diamond", 1, "juedou"],
    ["heart", 7, "wuzhong"],
    ["heart", 8, "wuzhong"],
    ["heart", 9, "wuzhong"],
    ["heart", 11, "wuzhong"],
    ["spade", 3, "shunshou"],
    ["spade", 4, "shunshou"],
    ["spade", 11, "shunshou"],
    ["diamond", 3, "shunshou"],
    ["diamond", 4, "shunshou"],
    ["spade", 3, "guohe"],
    ["spade", 4, "guohe"],
    ["spade", 12, "guohe"],
    ["club", 3, "guohe"],
    ["club", 4, "guohe"],
    ["heart", 12, "guohe"],
    ["club", 12, "jiedao"],
    ["club", 13, "jiedao"],
    ["spade", 11, "wuxie"],
    ["club", 12, "wuxie"],
    ["club", 13, "wuxie"],
    ["spade", 6, "lebu"],
    ["club", 6, "lebu"],
    ["heart", 6, "lebu"],
    ["spade", 1, "shandian", "thunder"],
    ["spade", 2, "hanbing"],
    ["club", 2, "renwang"],
    ["heart", 12, "shandian", "thunder"],
    ["diamond", 12, "wuxie"],
    ["heart", 4, "sha", "fire"],
    ["heart", 7, "sha", "fire"],
    ["heart", 10, "sha", "fire"],
    ["diamond", 4, "sha", "fire"],
    ["diamond", 5, "sha", "fire"],
    ["spade", 4, "sha", "thunder"],
    ["spade", 5, "sha", "thunder"],
    ["spade", 6, "sha", "thunder"],
    ["spade", 7, "sha", "thunder"],
    ["spade", 8, "sha", "thunder"],
    ["club", 5, "sha", "thunder"],
    ["club", 6, "sha", "thunder"],
    ["club", 7, "sha", "thunder"],
    ["club", 8, "sha", "thunder"],
    ["heart", 8, "shan"],
    ["heart", 9, "shan"],
    ["heart", 11, "shan"],
    ["heart", 12, "shan"],
    ["diamond", 6, "shan"],
    ["diamond", 7, "shan"],
    ["diamond", 8, "shan"],
    ["diamond", 10, "shan"],
    ["diamond", 11, "shan"],
    ["heart", 5, "tao"],
    ["heart", 6, "tao"],
    ["diamond", 2, "tao"],
    ["diamond", 3, "tao"],
    ["diamond", 9, "jiu"],
    ["spade", 3, "jiu"],
    ["spade", 9, "jiu"],
    ["club", 3, "jiu"],
    ["club", 9, "jiu"],
    ["diamond", 13, "hualiu"],
    ["club", 1, "baiyin"],
    ["spade", 2, "tengjia"],
    ["club", 2, "tengjia"],
    ["spade", 1, "guding"],
    ["diamond", 1, "zhuque"],
    ["heart", 2, "huogong"],
    ["heart", 3, "huogong"],
    ["diamond", 12, "huogong"],
    ["spade", 11, "tiesuo"],
    ["spade", 12, "tiesuo"],
    ["club", 10, "tiesuo"],
    ["club", 11, "tiesuo"],
    ["club", 12, "tiesuo"],
    ["club", 13, "tiesuo"],
    ["heart", 13, "wuxie"],
    ["heart", 13, "wuxie"],
    ["spade", 13, "wuxie"],
    ["spade", 10, "bingliang"],
    ["club", 4, "bingliang"]
  ],
  cardsThree: [
    ["spade", 7, "sha"],
    ["spade", 8, "sha"],
    ["spade", 8, "sha"],
    ["spade", 9, "sha"],
    ["spade", 9, "sha"],
    ["spade", 10, "sha"],
    ["spade", 10, "sha"],
    ["club", 2, "sha"],
    ["club", 3, "sha"],
    ["club", 4, "sha"],
    ["club", 5, "sha"],
    ["club", 6, "sha"],
    ["club", 7, "sha"],
    ["club", 8, "sha"],
    ["club", 8, "sha"],
    ["club", 9, "sha"],
    ["club", 9, "sha"],
    ["club", 10, "sha"],
    ["club", 10, "sha"],
    ["club", 11, "sha"],
    ["club", 11, "sha"],
    ["heart", 10, "sha"],
    ["heart", 10, "sha"],
    ["heart", 11, "sha"],
    ["diamond", 6, "sha"],
    ["diamond", 7, "sha"],
    ["diamond", 8, "sha"],
    ["diamond", 9, "sha"],
    ["diamond", 10, "sha"],
    ["diamond", 13, "sha"],
    ["heart", 2, "shan"],
    ["heart", 2, "shan"],
    ["heart", 13, "shan"],
    ["diamond", 2, "shan"],
    ["diamond", 2, "shan"],
    ["diamond", 3, "shan"],
    ["diamond", 4, "shan"],
    ["diamond", 5, "shan"],
    ["diamond", 6, "shan"],
    ["diamond", 7, "shan"],
    ["diamond", 8, "shan"],
    ["diamond", 9, "shan"],
    ["diamond", 10, "shan"],
    ["diamond", 11, "shan"],
    ["diamond", 11, "shan"],
    ["heart", 3, "tao"],
    ["heart", 4, "tao"],
    ["heart", 6, "tao"],
    ["heart", 7, "tao"],
    ["heart", 8, "tao"],
    ["heart", 9, "tao"],
    ["heart", 12, "tao"],
    ["diamond", 12, "tao"],
    ["spade", 2, "bagua"],
    ["club", 2, "bagua"],
    ["spade", 5, "jueying"],
    ["club", 5, "dilu"],
    ["heart", 13, "zhuahuang"],
    ["heart", 5, "chitu"],
    ["spade", 13, "dawan"],
    ["diamond", 13, "zixin"],
    ["club", 1, "zhuge"],
    ["diamond", 1, "zhuge"],
    ["spade", 2, "cixiong"],
    ["spade", 6, "qinggang"],
    ["spade", 5, "qinglong"],
    ["spade", 12, "zhangba"],
    ["diamond", 5, "guanshi"],
    ["diamond", 12, "fangtian"],
    ["heart", 5, "qilin"],
    ["heart", 3, "wugu"],
    ["heart", 4, "wugu"],
    ["heart", 1, "taoyuan"],
    ["spade", 7, "nanman"],
    ["spade", 13, "nanman"],
    ["club", 7, "nanman"],
    ["heart", 1, "wanjian"],
    ["spade", 1, "juedou"],
    ["club", 1, "juedou"],
    ["diamond", 1, "juedou"],
    ["heart", 7, "wuzhong"],
    ["heart", 8, "wuzhong"],
    ["heart", 9, "wuzhong"],
    ["heart", 11, "wuzhong"],
    ["spade", 3, "shunshou"],
    ["spade", 4, "shunshou"],
    ["spade", 11, "shunshou"],
    ["diamond", 3, "shunshou"],
    ["diamond", 4, "shunshou"],
    ["spade", 3, "guohe"],
    ["spade", 4, "guohe"],
    ["spade", 12, "guohe"],
    ["club", 3, "guohe"],
    ["club", 4, "guohe"],
    ["heart", 12, "guohe"],
    ["club", 12, "jiedao"],
    ["club", 13, "jiedao"],
    ["spade", 11, "wuxie"],
    ["club", 12, "wuxie"],
    ["club", 13, "wuxie"],
    ["spade", 6, "lebu"],
    ["club", 6, "lebu"],
    ["heart", 6, "lebu"],
    ["spade", 1, "hanbing"],
    ["club", 2, "renwang"],
    ["heart", 4, "sha", "fire"],
    ["heart", 7, "sha", "fire"],
    ["heart", 10, "sha", "fire"],
    ["diamond", 4, "sha", "fire"],
    ["diamond", 5, "sha", "fire"],
    ["spade", 4, "sha", "thunder"],
    ["spade", 5, "sha", "thunder"],
    ["spade", 6, "sha", "thunder"],
    ["spade", 7, "sha", "thunder"],
    ["spade", 8, "sha", "thunder"],
    ["club", 5, "sha", "thunder"],
    ["club", 6, "sha", "thunder"],
    ["club", 7, "sha", "thunder"],
    ["club", 8, "sha", "thunder"],
    ["heart", 8, "shan"],
    ["heart", 9, "shan"],
    ["heart", 11, "shan"],
    ["heart", 12, "shan"],
    ["diamond", 6, "shan"],
    ["diamond", 7, "shan"],
    ["diamond", 8, "shan"],
    ["diamond", 10, "shan"],
    ["diamond", 11, "shan"],
    ["heart", 5, "tao"],
    ["heart", 6, "tao"],
    ["diamond", 2, "tao"],
    ["diamond", 3, "tao"],
    ["diamond", 9, "jiu"],
    ["spade", 3, "jiu"],
    ["spade", 9, "jiu"],
    ["club", 3, "jiu"],
    ["club", 9, "jiu"],
    ["diamond", 13, "hualiu"],
    ["club", 1, "baiyin"],
    ["spade", 2, "tengjia"],
    ["spade", 1, "guding"],
    ["diamond", 1, "zhuque"],
    ["heart", 2, "huogong"],
    ["heart", 3, "huogong"],
    ["diamond", 12, "huogong"],
    ["spade", 11, "tiesuo"],
    ["spade", 12, "tiesuo"],
    ["club", 10, "tiesuo"],
    ["club", 11, "tiesuo"],
    ["club", 12, "tiesuo"],
    ["club", 13, "tiesuo"],
    ["heart", 13, "wuxie"],
    ["heart", 13, "wuxie"],
    ["spade", 13, "wuxie"],
    ["spade", 10, "bingliang"],
    ["club", 4, "bingliang"]
  ],
  choiceThree: ["re_caocao", "re_simayi", "xiahoudun", "re_zhangliao", "re_guojia", "zhenji", "re_xiahouyuan", "xuhuang", "wenpin", "re_xuzhu", "wangyi", "dianwei", "re_lidian", "xunyou", "dengai", "wangji", "zhongyao", "yuejin", "simalang", "zhangchunhua", "sp_caoren", "luzhi", "litong", "re_liubei", "guanyu", "re_zhangfei", "re_zhugeliang", "re_zhaoyun", "re_machao", "huangyueying", "jiangwei", "xin_masu", "liuchen", "re_huangzhong", "mizhu", "old_madai", "wangping", "xin_fazheng", "re_xushu", "liyan", "sp_sunshangxiang", "zhoucang", "yanyan", "mazhong", "mayunlu", "sunquan", "re_ganning", "re_huanggai", "re_zhouyu", "re_daqiao", "sunshangxiang", "sunjian", "re_xiaoqiao", "sunce", "re_luxun", "zhugejin", "dingfeng", "lingtong", "guyong", "xusheng", "yufan", "handang", "panzhangmazhong", "zhugeke", "zumao", "xuezong", "re_huatuo", "lvbu", "diaochan", "re_pangde", "jiaxu", "chengong", "re_gongsunzan", "caifuren", "gongsunyuan", "yj_jushou", "sp_liuqi", "quyi", "caiyong", "key_yuzuru", "ol_lisu", "zhanghuyuechen", "xujing", "zhoufang", "re_taishici", "ol_zhurong"],
  choiceFour: [
    "sunquan",
    "zhenji",
    "re_diaochan",
    "zhugeliang",
    "sunshangxiang",
    "re_huangyueying",
    "re_caocao",
    "re_liubei",
    "re_simayi",
    "re_guanyu",
    "re_zhouyu",
    "re_lvbu",
    "re_daqiao",
    "re_zhangfei",
    "re_zhangliao",
    "re_zhaoyun",
    "re_xuzhu",
    "re_machao",
    "re_ganning",
    "re_guojia",
    "re_lidian",
    "re_xiahoudun",
    "re_xushu",
    "re_lvmeng",
    "re_xiahouyuan",
    "re_xiaoqiao",
    "re_huangzhong",
    "yanwen",
    "dianwei",
    "pangtong",
    "taishici",
    "sp_zhugeliang",
    "re_pangde",
    "dongzhuo",
    "jiaxu",
    "sunjian",
    "xuhuang",
    "zhurong",
    "jiangwei",
    "sunce",
    "wangping",
    "sunliang",
    "wangji",
    "yanyan",
    "chengong",
    "zhangchunhua",
    "xin_fazheng",
    "lingtong",
    "wuguotai",
    "caozhi",
    "xusheng",
    "xunyou",
    "zhonghui",
    "xin_wangyi",
    "old_madai",
    //'bulianshi',
    "handang",
    "liubiao",
    "fuhuanghou",
    "xin_liru",
    //'jianyong',
    "panzhangmazhong",
    "yufan",
    "liufeng",
    "yj_jushou",
    "caifuren",
    "guyong",
    "zhoucang",
    "sunluban",
    "gongsunyuan",
    "liuchen",
    "xiahoushi",
    "sunxiu",
    //'quancong',
    "guotufengji",
    "liyan",
    //'sundeng','cenhun','guohuanghou',
    "caiyong",
    "wuxian",
    //'xuecong',
    "liuxie",
    "yuejin",
    "caoang",
    "hetaihou",
    "simalang",
    "mayunlu",
    "zhugejin",
    "sp_machao",
    "zhugeke",
    "sp_caoren",
    "dingfeng",
    "heqi",
    "chengyu",
    "wenpin",
    "guanyinping",
    "kanze",
    "sp_sunshangxiang",
    "quyi",
    "sp_jiangwei",
    "dongbai",
    //'litong',
    "yangxiu",
    "sunqian",
    "sunhao",
    "xiahouba",
    "liuqi",
    "luzhi",
    "zhugeguo",
    "guosi",
    "xf_tangzi",
    "xf_sufei",
    "caohong",
    "mazhong"
  ],
  translate: {
    zhu: "主",
    zhong: "忠",
    truezhu: "帅",
    falsezhu: "将",
    trueZhu: "帅",
    falseZhu: "将",
    trueZhong: "兵",
    falseZhong: "卒",
    trueColor: "zhu",
    falseColor: "wei",
    versus_zhu_config: "启用主将",
    versus_only_zhu_config: "只当主将",
    versus_main_zhu_config: "主将死亡后结束",
    versus_assign_enemy_config: "指定对手",
    versus_cross_seat_config: "交叉座位",
    versus_random_seat_config: "随机座位",
    versus_noreplace_end_config: "无替补时结束",
    versus_single_control_config: "单人控制",
    seat_order_config: "座位排列",
    versus_first_less_config: "先手少摸牌",
    versus_reward_config: "杀敌摸牌",
    versus_punish_config: "杀死队友",
    versus_number_config: "对阵人数",
    replace_number_config: "替补人数",
    choice_config: "候选人数",
    mode_versus_character_config: "剑阁武将",
    mode_versus_card_config: "同舟共济",
    tangzi: "唐咨",
    liuqi: "刘琦",
    wenji: "问计",
    wenji2: "问计",
    wenji_info: "队友的出牌阶段开始时，你可令其交给你一张手牌，若此牌为锦囊牌，则非队友角色计算与你的距离+1直到你的下个回合开始。",
    tunjiang: "屯江",
    tunjiang_info: "结束阶段开始时，若你于本回合的出牌阶段使用过至少两张牌且未造成过伤害，你可以选择一项：1.你摸两张牌；2.队友摸两张牌。",
    xingzhao: "兴棹",
    xingzhao2: "兴棹",
    xingzhao3: "兴棹",
    xingzhao_bg: "棹",
    xingzhao_info: "锁定技，若你和队友持有的龙船至宝数合计为：1个以上，你具有技能“恂恂”；2个以上，当你或队友使用装备牌时，其摸一张牌；3个以上，你和队友跳过判定阶段。",
    boss_liedixuande: "烈帝玄德",
    boss_gongshenyueying: "工神月英",
    boss_tianhoukongming: "天侯孔明",
    boss_yuhuoshiyuan: "浴火士元",
    boss_qiaokuijunyi: "巧魁儁乂",
    boss_jiarenzidan: "佳人子丹",
    boss_duanyuzhongda: "断狱仲达",
    boss_juechenmiaocai: "绝尘妙才",
    boss_jileibaihu: "机雷白虎",
    boss_yunpingqinglong: "云屏青龙",
    boss_lingjiaxuanwu: "灵甲玄武",
    boss_chiyuzhuque: "炽羽朱雀",
    boss_fudibian: "缚地狴犴",
    boss_tuntianchiwen: "吞天螭吻",
    boss_shihuosuanni: "食火狻猊",
    boss_lieshiyazi: "裂石睚眦",
    boss_kumuyuanrang: "枯目元让",
    boss_baijiwenyuan: "百计文远",
    boss_yihanyunchang: "翊汉云长",
    boss_fuweizilong: "扶危子龙",
    boss_weiwuyide: "威武翼德",
    boss_elaiziman: "恶来子满",
    boss_shenjianhansheng: "神箭汉升",
    boss_yiyongwenze: "毅勇文则",
    boss_mengwu: "猛武",
    boss_mengwu_info: "锁定技，你使用【杀】无距离次数限制，使用【杀】被抵消后摸一张牌。",
    boss_hupo: "虎魄",
    boss_hupo_info: "锁定技，你的锦囊牌视为【杀】。",
    boss_shuhun: "蜀魂",
    boss_shuhun_info: "锁定技，你造成伤害后，令随机一名友方角色恢复1点体力。",
    boss_yingji: "影戟",
    boss_yingji_info: "出牌阶段限一次，你可以展示所有手牌视为使用一张【杀】，且此【杀】的伤害基数改为你以此法展示的类别数。",
    boss_zhene: "镇恶",
    boss_zhene_info: "锁定技，你于出牌阶段使用牌指定目标后，若其手牌数不大于你，其不能响应此牌。",
    boss_weizhu: "卫主",
    boss_weizhu_info: "友方角色受到伤害时，你可以弃置一张手牌防止之。",
    boss_qixian: "启弦",
    boss_qixian_info: "你于出牌阶段内获得一张牌后，令你本回合下一次使用【杀】的伤害+1。",
    boss_jinggong: "惊弓",
    boss_jinggong_info: "锁定技，你使用【杀】无距离限制；你的回合结束时，若你本回合未使用【杀】，你失去1点体力。",
    boss_beishi: "备矢",
    boss_beishi_info: "锁定技，其他友方角色对敌方角色造成伤害后，你摸一张牌",
    boss_hanjun: "撼军",
    boss_hanjun_info: "出牌阶段限一次，你可以随机弃置所有敌方角色各一张牌，然后获得其中的装备牌或非装备牌。",
    boss_pigua: "披挂",
    boss_pigua_info: "锁定技，准备阶段，若你的装备区没有牌，你失去1点体力并从牌堆或弃牌堆获得一张装备牌。",
    boss_zhengji: "整纪",
    boss_zhengji_info: "锁定技，友方角色的装备被弃置后，你令所有友方角色各摸一张牌。",
    boss_xiaorui: "骁锐",
    boss_xiaorui2: "骁锐",
    boss_xiaorui_info: "友方角色于其回合内使用【杀】造成伤害后，其使用【杀】的次数+1。",
    boss_huchen: "虎臣",
    boss_huchen_info: "锁定技，你摸牌阶段摸牌数+X（X为你击杀的敌方角色数）。",
    boss_fengjian: "封缄",
    boss_fengjian2: "封缄",
    boss_fengjian_info: "受到你伤害的角色于其下个回合结束前，无法使用牌指定你为目标。",
    boss_keding: "克定",
    boss_keding_info: "当你使用【杀】或普通锦囊牌仅指定唯一目标时，你可以弃置任意张手牌，为其指定等量的额外目标。",
    boss_bashi: "拔矢",
    boss_bashi_info: "每当你成为其他角色使用的【杀】或普通锦囊牌的目标时，你可以从正面翻至背面，若如此做，此牌对你无效。",
    boss_danjing: "啖睛",
    boss_danjing_info: "友方角色进入濒死状态时，若你的体力值大于1，你可以失去1点体力，视为对其使用一张【桃】。",
    boss_jiaoxie: "缴械",
    boss_jiaoxie_info: "出牌阶段限一次，你可令敌方守城器械交给你一张牌。",
    boss_lianyujg: "炼狱",
    boss_lianyujg_info: "结束阶段，你可以对所有敌方角色造成1点火焰伤害。",
    boss_didongjg: "地动",
    boss_didongjg_info: "结束阶段，你可以选择一名敌方角色将其武将牌翻面。",
    boss_mojianjg: "魔箭",
    boss_mojianjg_info: "出牌阶段开始时，你可以对所有敌方角色使用一张【万箭齐发】。",
    boss_jiguan: "机关",
    boss_jiguan_info: "锁定技，你不能成为【乐不思蜀】的目标。",
    boss_lingyu: "灵愈",
    boss_lingyu_info: "结束阶段，你可以将自己的武将牌翻面，然后令所有已受伤的己方其他角色回复1点体力。",
    boss_tianyun: "天陨",
    boss_tianyun_info: "结束阶段，你可以失去1点体力，然后令一名敌方角色随机受到2~3点火焰伤害并弃置其装备区里的所有牌。",
    boss_zhenwei: "镇卫",
    boss_zhenwei_info: "锁定技，其他己方角色的防御距离+1。",
    boss_benlei: "奔雷",
    boss_benlei_info: "锁定技，准备阶段，你对敌方攻城器械随机造成2~3点雷电伤害。",
    boss_nailuo: "奈落",
    boss_nailuo_info: "结束阶段，你可以将你的武将牌翻面，令所有敌方角色弃置装备区内的所有牌。",
    boss_tanshi: "贪食",
    boss_tanshi_info: "锁定技，结束阶段开始时，你须弃置一张手牌。",
    boss_tunshi: "吞噬",
    boss_tunshi_info: "锁定技，准备阶段，你对所有手牌数量大于你的敌方角色造成1点伤害。",
    boss_yuhuojg: "浴火",
    boss_yuhuojg_info: "锁定技，每当你受到火焰伤害时，防止此伤害。",
    boss_qiwu: "栖梧",
    boss_qiwu_info: "每当你使用一张梅花牌，你可以令一名友方角色回复1点体力。",
    boss_tianyujg: "天狱",
    boss_tianyujg_info: "锁定技，结束阶段，你令所有未横置的敌方角色横置。",
    boss_gongshenjg: "工神",
    boss_gongshenjg_info: "结束阶段，若已方器械已受伤，你可以为其回复1点体力；否则你可以对敌方器械造成1点火焰伤害。",
    boss_zhinang: "智囊",
    boss_zhinang_info: "准备阶段，你可以亮出牌堆顶的五张牌，你可以将其中锦囊或装备牌交给一名己方角色。",
    boss_jingmiao: "精妙",
    boss_jingmiao_info: "锁定技，每当敌方角色使用的无懈可击生效后，你令其失去1点体力。",
    boss_biantian: "变天",
    boss_biantian_info: "锁定技，准备阶段，你进行一次判定，若为红色，直到下个回合开始前，令敌方所有角色处于“狂风”状态，若为黑色，直到下个回合开始前，令己方所有角色处于“大雾”状态。",
    boss_biantian2: "大雾",
    boss_biantian3: "狂风",
    boss_lingfeng: "灵锋",
    boss_lingfeng_info: "摸牌阶段，你可以改为亮出牌堆顶的两张牌，然后获得之，若这些牌的颜色不同，你令一名敌方角色失去1点体力。",
    boss_jizhen: "激阵",
    boss_jizhen_info: "锁定技，结束阶段，你令所有已受伤的己方角色摸一张牌。",
    boss_huodi: "惑敌",
    boss_huodi_info: "结束阶段，若有武将牌背面朝上的己方角色，你可以令一名敌方角色将其武将牌翻面。",
    boss_jueji: "绝汲",
    boss_jueji_info: "敌方角色摸牌阶段，若其已受伤，你可以令其少摸一张牌。",
    boss_chuanyun: "穿云",
    boss_chuanyun_info: "结束阶段，你可以对体力比你多的一名其他角色造成1点伤害。",
    boss_leili: "雷厉",
    boss_leili_info: "每当你的【杀】造成伤害后，你可以对另一名敌方角色造成1点雷电伤害。",
    boss_fengxing: "风行",
    boss_fengxing_info: "准备阶段，你可以选择一名敌方角色，若如此做，视为对其使用了一张【杀】。",
    boss_skonghun: "控魂",
    boss_skonghun_info: "出牌阶段开始时，若你已损失体力值不小于敌方角色数，你可以对所有敌方角色各造成1点雷电伤害，然后你恢复X点体力（X为受到伤害的角色数）。",
    boss_fanshi: "反噬",
    boss_fanshi_info: "锁定技，结束阶段，你失去1点体力。",
    boss_xuanlei: "玄雷",
    boss_xuanlei_info: "锁定技，准备阶段，令所有判定区内有牌的敌方角色受到1点雷电伤害。",
    boss_chiying: "持盈",
    boss_chiying_info: "锁定技，每当己方角色受到多于1伤害时，你防止其余伤害。",
    boss_jingfan: "惊帆",
    boss_jingfan_info: "锁定技，己方其他角色的进攻距离+1。",
    longchuanzhibao: "龙船至宝",
    longchuanzhibao_bg: "船",
    zong: "粽",
    zong_info: "1. 出牌阶段对自己使用，回复1点体力；2. 自己或队友濒死时对其使用，目标角色回复1点体力。",
    xionghuangjiu: "雄黄酒",
    xionghuangjiu_info: "1. 出牌阶段对自己使用，本回合使用的下一张【杀】伤害+1；若队友已死亡，改为使本回合使用的下一张牌伤害+1；2. 自己濒死时使用，回复1点体力。",
    tongzhougongji: "同舟共济",
    tongzhougongji_info: "出牌阶段使用，选择一项：1.摸X张牌（X为你所在势力拥有的龙船至宝数）；2.你和队友各摸一张牌。",
    lizhengshangyou: "力争上游",
    lizhengshangyou_info: "出牌阶段对所有角色使用，若目标角色的势力拥有龙船至宝，其回复1点体力，若目标角色的势力没有龙船至宝，其弃置一张牌。",
    tunliang: "屯粮",
    tunliang_info: "出牌阶段，对至多三名角色使用。目标角色各摸一张牌。",
    yuanjun: "援军",
    yuanjun_info: "出牌阶段，对至多两名已受伤的角色使用。目标角色回复1点体力。",
    xujiu: "酗酒",
    xujiu2: "酗酒",
    xujiu_info: "出牌阶段，对一名敌方角色使用，其本回合受到的伤害+1。",
    huoshaowuchao: "火烧乌巢",
    huoshaowuchao_info: "锁定技，本局游戏内造成的无属性伤害均视为火属性。",
    liangcaokuifa: "粮草匮乏",
    liangcaokuifa_info: "锁定技，所有角色摸牌阶段的额定摸牌数-1。当一名角色使用的牌结算完成后，若其因此牌造成了伤害，则其摸一张牌。",
    zhanyanliangzhuwenchou: "斩颜良诛文丑",
    zhanyanliangzhuwenchou_info: "锁定技，一名角色的回合开始时，其选择一项：视为使用一张不可被【无懈可击】响应的【决斗】，或失去1点体力。",
    shishengshibai: "十胜十败",
    shishengshibai_info: "锁定技，一名角色使用牌时，若此牌是整局游戏使用的第整十张牌且此牌不为延时锦囊牌或装备牌，则此牌所有目标角色再次成为此牌的目标角色。",
    liangjunxiangchi: "两军相持",
    liangjunxiangchi_info: "若当前游戏轮数：小于等于4，所有角色的手牌上限+X（X为当前游戏轮数）；大于4，所有角色于其回合内使用的第一张【杀】造成的伤害+1。",
    xutuhuanjin: "徐图缓进",
    xutuhuanjin_yingzi: "徐图缓进",
    xutuhuanjin_info: "所有角色的出牌阶段结束时，若其于此阶段未使用或打出过【杀】，则其下个摸牌阶段多摸一张牌。",
    jianshoudaiyuan: "坚守待援",
    jianshoudaiyuan_info: "所有角色均可以将【杀】当作【闪】，【闪】当作【杀】使用或打出，然后其手牌上限-1直到其下一个弃牌阶段结束。",
    yiruoshengqiang: "以弱胜强",
    yiruoshengqiang_info: "造成伤害时，若受伤角色体力值大于伤害来源，此伤害+1。",
    shichongerjiao: "恃宠而骄",
    shichongerjiao_info: "结束阶段，若你的体力值为全场唯一最多，你弃一张牌；若你的手牌数为全场最多，你失去1点体力。"
  },
  skill: {
    versus_viewHandcard: {
      ai: {
        viewHandcard: true,
        skillTagFilter: (player, tag, target) => player.side === target.side
      }
    },
    huoshaowuchao: {
      trigger: { global: "damageBefore" },
      silent: true,
      firstDo: true,
      filter: (event, player) => !event.hasNature("linked"),
      async content(event, trigger, player) {
        game.setNature(trigger, "fire");
      }
    },
    liangcaokuifa: {
      trigger: { player: ["useCardAfter", "phaseDrawBegin"] },
      silent: true,
      filter: (event, player) => {
        if (event.name === "phaseDraw") {
          return true;
        }
        return player.getHistory("sourceDamage", (evt) => evt.card === event.card).length > 0;
      },
      async content(event, trigger, player) {
        if (trigger.name === "phaseDraw") {
          trigger.num--;
        } else {
          await player.draw();
        }
      }
    },
    zhanyanliangzhuwenchou: {
      trigger: { player: "phaseBegin" },
      silent: true,
      content: [
        async (event, trigger, player, result) => {
          player.chooseUseTarget({
            card: { name: "juedou", isCard: true, storage: { nowuxie: true } },
            prompt: "选择一名角色，视为对其使用【决斗】",
            prompt2: "或点【取消】失去1点体力"
          });
        },
        async (event, trigger, player, result) => {
          if (!result.bool) {
            await player.loseHp();
          }
        }
      ]
    },
    xujiu2: {
      charlotte: true,
      onremove: true,
      trigger: { player: "damageBegin2" },
      forced: true,
      async content(event, trigger, player) {
        trigger.num += player.countMark("xujiu2");
      },
      intro: { content: "本回合受到的伤害+#" },
      ai: { threaten: (player, target) => 1 + target.countMark("xujiu2") }
    },
    shishengshibai: {
      mod: {
        aiOrder: (player, card, num) => {
          if (_status.shishengshibai && _status.shishengshibai % 10 === 9) {
            if (["sha", "tao", "guohe", "shunshou", "tunliang", "wuzhong", "juedou", "yuanjun"].includes(card.name)) {
              return num + 15;
            }
          }
        }
      },
      trigger: {
        player: "useCard1"
      },
      silent: true,
      async content(event, trigger, player) {
        if (event.triggername === "useCard1") {
          if (!_status.shishengshibai) {
            _status.shishengshibai = 0;
          }
          _status.shishengshibai++;
          game.broadcastAll((num) => {
            if (ui.guanduInfo) {
              ui.guanduInfo.innerHTML = `十胜十败（${num}）`;
            }
          }, _status.shishengshibai);
          if (_status.shishengshibai % 10 === 0 && trigger.targets && trigger.targets.length > 0 && !["delay", "equip"].includes(get.type(trigger.card))) {
            trigger.effectCount++;
          }
        }
      },
      ai: {
        result: {
          player: (card, player, target) => {
            if (_status.shishengshibai && _status.shishengshibai % 10 === 9 && card.name === "tiesuo") {
              return [0, 0, 0, 0];
            }
          }
        }
      }
    },
    liangjunxiangchi: {
      mod: {
        maxHandcard: (player, num) => {
          if (game.roundNumber <= 4) {
            return num + game.roundNumber;
          }
        }
      },
      trigger: { source: "damageBegin1" },
      filter: (event, player) => {
        if (game.roundNumber <= 4) {
          return false;
        }
        const evt2 = event.getParent("phaseUse");
        if (evt2.player !== player) {
          return false;
        }
        return player.getHistory("useCard", (evt) => evt.card.name === "sha" && evt.getParent("phaseUse") === evt2).indexOf(event.getParent()) === 0;
      },
      silent: true,
      forced: true,
      async content(event, trigger, player) {
        trigger.num++;
      }
    },
    xutuhuanjin: {
      trigger: { player: "phaseUseEnd" },
      filter: (event, player) => {
        if (player.getHistory("useCard", (evt) => evt.card && evt.card.name === "sha" && evt.getParent("phaseUse") === event).length > 0) {
          return false;
        }
        if (player.getHistory("respond", (evt) => evt.card && evt.card.name === "sha" && evt.getParent("phaseUse") === event).length > 0) {
          return false;
        }
        return true;
      },
      forced: true,
      async content(event, trigger, player) {
        player.addTempSkill("xutuhuanjin_yingzi", { player: "phaseDrawAfter" });
        player.addMark("xutuhuanjin_yingzi", 1, false);
      },
      subSkill: {
        yingzi: {
          charlotte: true,
          onremove: true,
          trigger: { player: "phaseDrawBegin2" },
          filter: (event, player) => !event.numFixed && player.hasMark("xutuhuanjin_yingzi"),
          forced: true,
          async content(event, trigger, player) {
            trigger.num += player.countMark("xutuhuanjin_yingzi");
          },
          marktext: "缓",
          intro: { content: "下个摸牌阶段多摸#张牌" }
        }
      }
    },
    jianshoudaiyuan: {
      charlotte: true,
      mod: {
        aiValue: (player, card, num) => {
          if (card.name !== "sha" && card.name !== "shan") {
            return;
          }
          const geti = () => {
            const cards = player.getCards("hs", (card2) => card2.name === "sha" || card2.name === "shan");
            if (cards.contains(card)) {
              return cards.indexOf(card);
            }
            return cards.length;
          };
          return Math.max(num, [7, 5, 5, 3][Math.min(geti(), 3)]);
        },
        aiUseful: function() {
          return lib.skill.jianshoudaiyuan.mod.aiValue.apply(this, arguments);
        }
      },
      locked: false,
      enable: ["chooseToUse", "chooseToRespond"],
      position: "hs",
      prompt: "将【杀】当作【闪】，或将【闪】当作的【杀】使用或打出，然后你的下个弃牌阶段的手牌上限-1",
      viewAs: (cards, player) => {
        if (cards.length) {
          let name = false;
          switch (get.name(cards[0], player)) {
            case "sha":
              name = "shan";
              break;
            case "shan":
              name = "sha";
              break;
          }
          if (name) {
            return { name };
          }
        }
        return null;
      },
      onuse: (links, player) => {
        player.addTempSkill("jianshoudaiyuan_less", { player: "phaseDiscardAfter" });
        player.addMark("jianshoudaiyuan_less", 1, false);
        player.markSkill("jianshoudaiyuan_less");
      },
      onrespond: (links, player) => {
        player.addTempSkill("jianshoudaiyuan_less", { player: "phaseDiscardAfter" });
        player.addMark("jianshoudaiyuan_less", 1, false);
        player.markSkill("jianshoudaiyuan_less");
      },
      check: (card) => {
        const player = _status.event.player;
        if (_status.event.type === "phase") {
          let max = 0;
          let name2;
          const list = ["sha"];
          const map = { sha: "shan" };
          for (const name of list) {
            if (player.hasCards("hs", map[name]) && player.getUseValue({ name }) > 0) {
              const temp = get.order({ name });
              if (temp > max) {
                max = temp;
                name2 = map[name];
              }
            }
          }
          if (name2 === get.name(card, player)) {
            return 1;
          }
          return 0;
        }
        return 1;
      },
      filterCard: (card, player, event) => {
        event = event || _status.event;
        const filter = event._backup.filterCard;
        const name = get.name(card, player);
        if (name === "sha" && filter({ name: "shan", cards: [card] }, player, event)) {
          return true;
        }
        if (name === "shan" && filter({ name: "sha", cards: [card] }, player, event)) {
          return true;
        }
        return false;
      },
      filter: (event, player) => {
        const filter = event.filterCard;
        if (filter({ name: "sha" }, player, event) && player.hasCards("hs", "shan")) {
          return true;
        }
        if (filter({ name: "shan" }, player, event) && player.hasCards("hs", "sha")) {
          return true;
        }
        return false;
      },
      ai: {
        respondSha: true,
        respondShan: true,
        skillTagFilter: (player, tag) => {
          let name;
          switch (tag) {
            case "respondSha":
              name = "shan";
              break;
            case "respondShan":
              name = "sha";
              break;
          }
          if (!player.hasCards("hs", name)) {
            return false;
          }
        },
        order: (item, player) => {
          if (player && _status.event.type === "phase") {
            if (player.hasCards("hs", "shan") && player.getUseValue({ name: "sha" }) > 0) {
              return get.order({ name: "sha" }, player) * 0.99;
            }
            return 0;
          }
          return 1e-3;
        }
      },
      subSkill: {
        less: {
          onremove: true,
          charlotte: true,
          market: "守",
          intro: { content: "手牌上限-#" },
          mod: {
            maxHandcard: (player, num) => num - player.countMark("jianshoudaiyuan_less")
          }
        }
      }
    },
    yiruoshengqiang: {
      trigger: { source: "damageBegin2" },
      filter: (event, player) => event.player.hp > player.hp,
      forced: true,
      silent: true,
      async content(event, trigger, player) {
        trigger.num++;
      }
    },
    shichongerjiao: {
      charlotte: true,
      trigger: { player: "phaseJieshu" },
      filter: (event, player) => lib.skill.shichongerjiao.filterx(event, player) || lib.skill.shichongerjiao.filtery(event, player),
      filterx: (event, player) => player.isMaxHp(),
      filtery: (event, player) => player.isMaxHandcard(),
      forced: true,
      silent: true,
      async content(event, trigger, player) {
        const bool1 = lib.skill.shichongerjiao.filterx(trigger, player);
        const bool2 = lib.skill.shichongerjiao.filtery(trigger, player);
        if (bool1) {
          player.chooseToDiscard({ position: "he", forced: true });
        }
        if (bool2) {
          player.loseHp();
        }
      }
    },
    wenji: {
      trigger: { global: "phaseUseBegin" },
      filter: (event, player) => event.player.side === player.side && event.player !== player && event.player.hasCards("h"),
      logTarget: "player",
      check: (event, player) => event.player.needsToDiscard(1) || event.player.countCards("h") > player.countCards("h") + 1 || player.hp === 1,
      async content(event, trigger, player) {
        const result = await trigger.player.chooseCard({
          prompt: `将一张手牌交给${get.translation(player)}`,
          forced: true,
          ai: (card) => get.type(card) === "trick" ? 8 - get.value(card) : 6 - get.value(card)
        }).forResult();
        if (player.isDead() && !event.forceDie || player.isOut() && !event.includeOut || player.removed) {
          return;
        }
        if (result.bool && result.cards.length) {
          player.gain({ cards: result.cards, source: trigger.player, animate: "give" });
          if (get.type(result.cards[0]) === "trick") {
            player.addTempSkill("wenji2", { player: "phaseBegin" });
          }
        }
      }
    },
    wenji2: {
      mark: true,
      intro: {
        content: "非队友角色计算与你的距离+1"
      },
      mod: {
        globalTo: (from, to, distance) => {
          if (from.side !== to.side) {
            return distance + 1;
          }
        }
      }
    },
    tunjiang: {
      trigger: { player: "phaseEnd" },
      direct: true,
      filter: (event, player) => !player.getStat("damage") && player.countUsed() >= 2,
      async content(event, trigger, player) {
        const target = game.players.find((current) => current.side === player.side && current !== player);
        if (target) {
          event.target = target;
          const result = await player.chooseControl({
            controls: ["cancel2"],
            ai: () => target.countCards("h") >= player.countCards("h") ? 1 : 0,
            prompt: get.prompt("xingzhao"),
            choiceList: ["摸两张牌", `令${get.translation(target)}摸两张牌`]
          }).forResult();
          if (player.isDead() && !event.forceDie || player.isOut() && !event.includeOut || player.removed) {
            return;
          }
          if (result.index === 0) {
            player.logSkill("xingzhao");
            await player.draw(2);
          } else if (result.index === 1) {
            player.logSkill("xingzhao", event.target);
            await event.target.draw(2);
          }
        } else {
          const result = await player.chooseBool({ prompt: get.prompt("xingzhao") }).forResult();
          if (player.isDead() && !event.forceDie || player.isOut() && !event.includeOut || player.removed) {
            return;
          }
          if (result.bool) {
            player.logSkill("xingzhao");
            await player.draw(2);
          }
        }
      }
    },
    xingzhao: {
      inherit: "xunxun",
      mark: true,
      intro: {
        content: (storage, player) => {
          let num = 0;
          for (const current of game.players) {
            if (current.side === player.side) {
              num += current.storage.longchuanzhibao;
            }
          }
          let str = "无技能";
          if (num >= 1) {
            str = "具有技能“恂恂”";
          }
          if (num >= 2) {
            str += "；当你或队友使用装备牌时，其摸一张牌";
          }
          if (num >= 3) {
            str += "；你和队友跳过判定阶段";
          }
          return str;
        }
      },
      filter: (event, player) => {
        for (const current of game.players) {
          if (current.side === player.side && current.storage.longchuanzhibao) {
            return true;
          }
        }
        return false;
      },
      global: ["xingzhao2", "xingzhao3"]
    },
    xingzhao2: {
      trigger: { player: "useCard" },
      forced: true,
      filter: (event, player) => {
        if (get.type(event.card) !== "equip") {
          return false;
        }
        let num = 0;
        let bool = false;
        for (const current of game.players) {
          if (current.side === player.side) {
            num += current.storage.longchuanzhibao;
            if (current.hasSkill("xingzhao")) {
              bool = true;
            }
          }
        }
        return bool && num >= 2;
      },
      async content(event, trigger, player) {
        await player.draw();
      }
    },
    xingzhao3: {
      trigger: { player: "phaseJudgeBefore" },
      forced: true,
      filter: (event, player) => {
        let num = 0;
        let bool = false;
        for (const current of game.players) {
          if (current.side === player.side) {
            num += current.storage.longchuanzhibao;
            if (current.hasSkill("xingzhao")) {
              bool = true;
            }
          }
        }
        return bool && num >= 3;
      },
      async content(event, trigger, player) {
        trigger.cancel();
        game.log(player, "跳过了判定阶段");
      }
    },
    xionghuangjiu: {
      trigger: { source: "damageBegin1" },
      filter: (event, player) => event.card && event.card === player.storage.xionghuangjiu && event.notLink(),
      forced: true,
      async content(event, trigger, player) {
        trigger.num++;
      },
      temp: true,
      vanish: true,
      onremove: (player) => {
        game.addVideo("jiuNode", player, false);
        if (player.node.jiu) {
          player.node.jiu.delete();
          player.node.jiu2.delete();
          delete player.node.jiu;
          delete player.node.jiu2;
        }
        delete player.storage.xionghuangjiu;
      },
      group: ["xionghuangjiu2", "xionghuangjiu3"]
    },
    xionghuangjiu2: {
      trigger: { player: "useCardAfter", global: "phaseAfter" },
      priority: 2,
      filter: (event, player) => {
        if (event.name === "useCard") {
          return event.card && event.card === player.storage.xionghuangjiu;
        }
        return true;
      },
      forced: true,
      popup: false,
      audio: false,
      async content(event, trigger, player) {
        game.broadcastAll((player2) => {
          player2.removeSkill("xionghuangjiu");
        }, player);
      }
    },
    xionghuangjiu3: {
      trigger: { player: "useCard" },
      silent: true,
      filter: (event, player) => !player.storage.xionghuangjiu,
      async content(event, trigger, player) {
        player.storage.xionghuangjiu = trigger.card;
      }
    },
    longchuanzhibao: {
      mark: "auto",
      nopop: true,
      init: (player) => {
        player.storage.longchuanzhibao = 0;
      },
      intro: {
        content: (storage, player) => {
          let str = `已有${storage}个龙船至宝，${get.translation(player.side)}势力共有`;
          let num = storage;
          for (const current of game.players) {
            if (current.side === player.side && current !== player) {
              num += current.storage.longchuanzhibao;
              break;
            }
          }
          str += `${num}个龙船至宝。新一轮开始时，拥有至少4个龙船至宝的势力获胜`;
          return str;
        }
      },
      trigger: { source: "damageEnd" },
      silent: true,
      filter: (event, player) => event.player.storage.longchuanzhibao > 0,
      async content(event, trigger, player) {
        player.gainZhibao(1, trigger.player);
        game.delay();
      },
      group: "longchuanzhibao_over",
      subSkill: {
        over: {
          trigger: { player: "roundStart" },
          silent: true,
          filter: () => {
            const map = { wei: 0, shu: 0, wu: 0, qun: 0 };
            for (const current of game.players) {
              map[current.side] += current.storage.longchuanzhibao;
              if (map[current.side] >= 4) {
                _status.winside = current.side;
                return true;
              }
            }
          },
          async content(event, trigger, player) {
            for (const current of game.players) {
              current.classList.remove("current_action");
            }
            const me = game.me._trueMe || game.me;
            game.over(_status.winside === me.side);
          }
        }
      }
    },
    //剑阁技能
    boss_mengwu: {
      trigger: {
        player: "shaMiss"
      },
      forced: true,
      async content(event, trigger, player) {
        await player.draw();
      },
      mod: {
        cardUsable(card, player) {
          if (card.name === "sha") {
            return Infinity;
          }
        },
        targetInRange(card, player) {
          if (card.name === "sha") {
            return true;
          }
        }
      }
    },
    boss_hupo: {
      forced: true,
      mod: {
        cardname(card, player) {
          if (["trick", "delay"].includes(lib.card[card.name].type)) {
            return "sha";
          }
        },
        cardnature(card, player) {
          if (["trick", "delay"].includes(lib.card[card.name].type)) {
            return null;
          }
        }
      }
    },
    boss_shuhun: {
      trigger: {
        source: "damageSource"
      },
      forced: true,
      filter(event, player) {
        return game.hasPlayer((current) => current.isFriendOf(player) && current.isDamaged());
      },
      logTarget(event, player) {
        return game.filterPlayer((current) => current.isFriendOf(player) && current.isDamaged()).randomGet();
      },
      async content(event, trigger, player) {
        const target = event.targets[0];
        await target.recover();
      }
    },
    boss_yingji: {
      enable: "phaseUse",
      usable: 1,
      filterCard: true,
      selectCard: -1,
      ignoreMod: true,
      viewAs: {
        name: "sha"
      },
      async precontent(event, trigger, player) {
        delete event.result.skill;
        const cards = event.result.cards;
        player.logSkill("boss_yingji");
        await player.showCards(cards);
        event.result.cards = [];
        event.result.card = new lib.element.VCard({ name: "sha", isCard: true });
        player.when("useCard1").filter((evt) => evt.getParent() === event.getParent()).step(async (event2, trigger2, player2) => {
          trigger2.baseDamage = cards.map((card) => get.type2(card)).toUniqued().length;
        });
      },
      ai: {
        order: 9
      }
    },
    boss_zhene: {
      trigger: {
        player: "useCardToPlayered"
      },
      filter(event, player) {
        return event.target.countCards("h") <= player.countCards("h");
      },
      forced: true,
      logTarget: "target",
      async content(event, trigger, player) {
        trigger.getParent().directHit.add(trigger.target);
      }
    },
    boss_weizhu: {
      trigger: {
        global: "damageBegin4"
      },
      filter(event, player) {
        return player.hasCards("h") && event.player.isFriendOf(player);
      },
      async cost(event, trigger, player) {
        event.result = await player.chooseToDiscard(get.prompt2(event.skill, trigger.player), "h").set("chooseonly", true).set("eff", get.damageEffect(trigger.player, trigger.source ?? trigger.player, player)).set("ai", (card) => {
          const { eff } = get.event();
          if (eff >= 0) {
            return 0;
          }
          return 7 - get.value(card);
        }).forResult();
        event.result.targets = [trigger.player];
      },
      async content(event, trigger, player) {
        const { cards } = event;
        await player.modedDiscard(cards);
        trigger.cancel();
      }
    },
    boss_qixian: {
      trigger: {
        player: "gainAfter",
        global: ["loseAfter", "loseAsyncAfter"]
      },
      getIndex(event, player) {
        if (!event.getg) {
          return false;
        }
        return event.getg(player);
      },
      filter(event, player) {
        return player.isPhaseUsing();
      },
      forced: true,
      locked: false,
      async content(event, trigger, player) {
        player.when("useCard1").filter((evt) => evt.card?.name === "sha").step(async (event2, trigger2, player2) => {
          trigger2.baseDamage ??= 1;
          trigger2.baseDamage++;
        });
      }
    },
    boss_jinggong: {
      trigger: {
        player: "phaseEnd"
      },
      forced: true,
      filter(event, player) {
        return !player.hasHistory("useCard", (evt) => evt?.card?.name === "sha");
      },
      async content(event, trigger, player) {
        await player.loseHp();
      },
      mod: {
        targetInRange(card, player) {
          if (card.name === "sha") {
            return true;
          }
        }
      }
    },
    boss_beishi: {
      trigger: {
        global: "damageSource"
      },
      forced: true,
      filter(event, player) {
        if (event.player.isFriendOf(player)) {
          return false;
        }
        return event.source?.isFriendOf(player) && event.source !== player;
      },
      logTarget: "source",
      async content(event, trigger, player) {
        await player.draw();
      }
    },
    boss_hanjun: {
      enable: "phaseUse",
      usable: 1,
      filter(event, player) {
        return game.hasPlayer((current) => !current.isFriendOf(player) && current.hasDiscardableCards(player, "he"));
      },
      filterTarget(card, player, target) {
        return !target.isFriendOf(player) && target.hasDiscardableCards(player, "he");
      },
      selectTarget: -1,
      async content(event, trigger, player) {
        const cards = event.target.getDiscardableCards(player, "he");
        if (cards?.length) {
          const card = cards.randomGet();
          await event.target.modedDiscard(card, player);
          event.getParent().hanjunCards ??= [];
          event.getParent().hanjunCards.add(card);
        }
      },
      async contentAfter(event, trigger, player) {
        const cards = event.getParent().hanjunCards;
        if (cards.length) {
          const equips = cards.filter((card) => get.type(card) === "equip");
          const noequips = cards.filter((card) => get.type(card) !== "equip");
          const result = equips.length && noequips.length ? await player.chooseControl("装备牌", "非装备牌").set("choiceList", [`获得${get.translation(equips)}`, `获得${get.translation(noequips)}`]).set("prompt", "撼军：请选择获得的类型").set("ai", () => get.event().resultx).set("resultx", equips.length > noequips.length ? 0 : 1).forResult() : {
            index: equips.length ? 0 : 1
          };
          if (result.index === 0) {
            await player.gain(equips, "gain2");
          } else {
            await player.gain(noequips, "gain2");
          }
        }
      }
    },
    boss_pigua: {
      trigger: {
        player: "phaseZhunbeiBegin"
      },
      filter(event, player) {
        return !player.hasCards("e");
      },
      forced: true,
      async content(event, trigger, player) {
        await player.loseHp();
        const card = get.cardPile((card2) => get.type(card2) === "equip");
        if (card) {
          await player.gain(card, "gain2");
        }
      }
    },
    boss_zhengji: {
      trigger: {
        global: ["loseAfter", "loseAsyncAfter"]
      },
      getIndex(event, player) {
        if (!event.getl || event.type !== "discard") {
          return [];
        }
        return game.filterPlayer((current) => current.isFriendOf(player)).reduce((cards, current) => {
          const equips = event.getl(current)?.es;
          if (equips?.length) {
            cards.addArray(equips);
          }
          return cards;
        }, []);
      },
      logTarget(event, player) {
        return game.filterPlayer((current) => current.isFriendOf(player));
      },
      forced: true,
      async content(event, trigger, player) {
        await game.asyncDraw(event.targets);
      }
    },
    boss_xiaorui: {
      trigger: { global: "damageSource" },
      forced: true,
      locked: false,
      logTarget: "source",
      filter: (event, player) => {
        const target = event.source;
        return target && target === _status.currentPhase && target.isAlive() && target.isFriendOf(player) && event.card && event.card.name === "sha" && event.getParent().type === "card";
      },
      async content(event, trigger, player) {
        const source = trigger.source;
        source.addTempSkill("boss_xiaorui2");
        source.addMark("boss_xiaorui2", 1, false);
      }
    },
    boss_xiaorui2: {
      onremove: true,
      charlotte: true,
      mod: {
        cardUsable: (card, player, num) => {
          if (card.name === "sha") {
            return num + player.countMark("boss_xiaorui2");
          }
        }
      }
    },
    boss_huchen: {
      trigger: {
        player: "phaseDrawBegin2",
        source: "dieAfter"
      },
      forced: true,
      filter: (event, player) => {
        if (event.name === "die") {
          return event.player.isEnemyOf(player);
        }
        return !event.numFixed && player.countMark("boss_huchen") > 0;
      },
      async content(event, trigger, player) {
        if (trigger.name === "die") {
          player.addMark("boss_huchen", 1);
        } else {
          trigger.num += player.countMark("boss_huchen");
        }
      },
      intro: {
        content: "已斩杀过$名敌将"
      }
    },
    boss_fengjian: {
      trigger: { source: "damageSource" },
      forced: true,
      locked: false,
      filter: (event, player) => event.player.isAlive(),
      logTarget: "player",
      async content(event, trigger, player) {
        trigger.player.addTempSkill("boss_fengjian2", { player: "phaseAfter" });
        trigger.player.markAuto("boss_fengjian2", [player]);
      }
    },
    boss_fengjian2: {
      onremove: true,
      intro: {
        content: "不能对$使用牌"
      },
      mod: {
        playerEnabled: (card, player, target) => {
          if (player.getStorage("boss_fengjian2").includes(target)) {
            return false;
          }
        }
      }
    },
    boss_keding: {
      trigger: { player: "useCard2" },
      filter: (event, player) => {
        if (!event.targets || event.targets.length !== 1) {
          return false;
        }
        const card = event.card;
        if (card.name !== "sha" && get.type(card) !== "trick") {
          return false;
        }
        const info = get.info(card);
        if (info.allowMultiple == false) {
          return false;
        }
        if (!player.hasCards("h")) {
          return false;
        }
        if (!info.multitarget) {
          if (game.hasPlayer((current) => !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && lib.filter.targetInRange(card, player, current))) {
            return true;
          }
        }
        return false;
      },
      async cost(event, trigger, player) {
        const card = trigger.card;
        const prompt2 = `弃置任意张手牌，并为${get.translation(card)}增加等量的目标`;
        const targets = game.filterPlayer((current) => !trigger.targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && lib.filter.targetInRange(card, player, current));
        let max = 0;
        if (!trigger.targets[0].hasSkill("heiguangkai_skill")) {
          max = targets.filter((target) => get.effect(target, card, player, player) > 0).length;
        }
        event.result = await player.chooseCardTarget({
          prompt: get.prompt("boss_keding"),
          prompt2,
          selectCard: () => {
            const player2 = _status.event.player;
            const targets2 = _status.event.targets;
            return [Math.max(1, ui.selected.targets.length), Math.min(targets2.length, player2.countCards("h"))];
          },
          selectTarget: () => ui.selected.cards.length,
          position: "h",
          filterCard: lib.filter.cardDiscardable,
          filterTarget: (card2, player2, target) => _status.event.targets.includes(target),
          targets,
          ai1: (card2) => {
            if (ui.selected.cards.length >= _status.event.max) {
              return 0;
            }
            return 5 - get.value(card2);
          },
          ai2: (target) => {
            if (target.hasSkill("heiguangkai_skill")) {
              return 0;
            }
            const trigger2 = _status.event.getTrigger();
            const player2 = _status.event.player;
            return get.effect(target, trigger2.card, player2, player2);
          },
          max,
          allowChooseAll: true
        }).forResult();
      },
      async content(event, trigger, player) {
        player.discard({ cards: event.cards });
        trigger.targets.addArray(event.targets);
      }
    },
    boss_bashi: {
      filter: (event, player) => event.player !== player && event.card && (event.card.name === "sha" || get.type(event.card) === "trick") && !player.isTurnedOver(),
      logTarget: "player",
      check: (event, player) => {
        if (event.getParent().excluded.includes(player)) {
          return false;
        }
        if (get.attitude(player, event.player) > 0) {
          return false;
        }
        if (get.tag(event.card, "respondSha")) {
          if (!player.hasCards("h", { name: "sha" })) {
            return true;
          }
        } else if (get.tag(event.card, "respondShan")) {
          if (!player.hasCards("h", { name: "shan" })) {
            return true;
          }
        } else if (get.tag(event.card, "damage")) {
          if (event.card.name === "shuiyanqijunx") {
            return player.countCards("e") < 2;
          }
          return true;
        }
        return false;
      },
      trigger: { target: "useCardToTargeted" },
      async content(event, trigger, player) {
        player.turnOver();
        trigger.getParent().excluded.add(player);
      }
    },
    boss_danjing: {
      trigger: { global: "dying" },
      filter: (event, player) => player.hp > 1 && event.player.hp < 1 && event.player.isFriendOf(player),
      check: (event, player) => {
        const target = event.player;
        return get.attitude(player, target) > 0 && lib.filter.cardSavable({ name: "tao", isCard: true }, player, target);
      },
      logTarget: "player",
      content: [
        async (event, trigger, player, result) => {
          await player.loseHp();
        },
        async (event, trigger, player, result) => {
          const card = { name: "tao", isCard: true };
          if (lib.filter.cardSavable(card, player, trigger.player)) {
            await player.useCard({ card, targets: [trigger.player] });
          }
        }
      ]
    },
    boss_jiaoxie: {
      enable: "phaseUse",
      usable: 1,
      filter: (event, player) => {
        return game.hasPlayer((current) => lib.skill.boss_jiaoxie.filterTarget(null, player, current));
      },
      filterTarget: (card, player, target) => target.isEnemyOf(player) && target.type === "mech" && target.hasCards("he"),
      async content(event, trigger, player) {
        const { target } = event;
        if (!target.hasCards("he")) {
          return;
        }
        const result = await target.chooseCard({
          position: "he",
          forced: true,
          prompt: `将一张牌交给${get.translation(player)}`
        }).forResult();
        if (player.isDead() && !event.forceDie || player.isOut() && !event.includeOut || player.removed) {
          return;
        }
        if (result.bool) {
          await player.gain({ cards: result.cards, source: target, animate: "give" });
        }
      },
      ai: {
        order: 9,
        result: {
          target: (player, target) => {
            if (target.hasCards("e", (card) => get.value(card, target) <= 0)) {
              return 1;
            }
            return -1;
          }
        }
      }
    },
    boss_didongjg: {
      trigger: { player: "phaseEnd" },
      async cost(event, trigger, player) {
        event.result = await player.chooseTarget({
          prompt: get.prompt("boss_didongjg"),
          filterTarget: (card, player2, target) => target.isEnemyOf(player2),
          ai: (target) => {
            const att = get.attitude(player, target);
            if (target.isTurnedOver()) {
              if (att > 0) {
                return att + 5;
              }
              return -1;
            }
            if (player.isTurnedOver()) {
              return 5 - att;
            }
            return -att;
          }
        }).forResult();
      },
      async content(event, trigger, player) {
        await event.targets[0].turnOver();
      },
      ai: {
        threaten: 1.7
      }
    },
    boss_lianyujg: {
      trigger: { player: "phaseEnd" },
      unique: true,
      async content(event, trigger, player) {
        const targets = game.filterPlayer((current) => current.isEnemyOf(player));
        while (targets.length) {
          const current = targets.shift();
          player.line(current, "fire");
          await current.damage({ nature: "fire" });
          if (player.isDead() && !event.forceDie || player.isOut() && !event.includeOut || player.removed) {
            return;
          }
        }
      },
      ai: {
        threaten: 2
      }
    },
    boss_mojianjg: {
      trigger: { player: "phaseUseBegin" },
      async content(event, trigger, player) {
        const list = game.filterPlayer((current) => player.canUse("wanjian", current) && current.isEnemyOf(player));
        list.sort(lib.sort.seat);
        await player.useCard({ card: { name: "wanjian" }, targets: list });
      },
      ai: {
        threaten: 1.8
      }
    },
    boss_qiwu: {
      audio: true,
      trigger: { player: "useCard" },
      direct: true,
      filter: (event, player) => {
        if (get.suit(event.card) === "club") {
          return game.hasPlayer((current) => current.isFriendOf(player) && current.isDamaged());
        }
        return false;
      },
      async content(event, trigger, player) {
        const noneed = trigger.card.name === "tao" && trigger.targets[0] === player && player.hp === player.maxHp - 1;
        const result = await player.chooseTarget({
          prompt: get.prompt("boss_qiwu"),
          filterTarget: (card, player2, target) => target.hp < target.maxHp && target.isFriendOf(player2),
          ai: (target) => {
            let num = get.attitude(player, target);
            if (num > 0) {
              if (noneed && player === target) {
                num = 0.5;
              } else if (target.hp === 1) {
                num += 3;
              } else if (target.hp === 2) {
                num += 1;
              }
            }
            return num;
          }
        }).forResult();
        if (player.isDead() && !event.forceDie || player.isOut() && !event.includeOut || player.removed) {
          return;
        }
        if (result.bool) {
          player.logSkill("qiwu", result.targets);
          await result.targets[0].recover();
        }
      },
      ai: {
        expose: 0.3,
        threaten: 1.5
      }
    },
    boss_tianyujg: {
      audio: true,
      trigger: { player: "phaseEnd" },
      forced: true,
      filter: (event, player) => {
        return game.hasPlayer((current) => current.isEnemyOf(player) && !current.isLinked());
      },
      async content(event, trigger, player) {
        const targets = game.filterPlayer();
        targets.sort(lib.sort.seat);
        while (targets.length) {
          const target = targets.shift();
          if (!target.isLinked() && target.isEnemyOf(player)) {
            player.line(target, "green");
            await target.link();
          }
          if (player.isDead() && !event.forceDie || player.isOut() && !event.includeOut || player.removed) {
            return;
          }
        }
      }
    },
    boss_jueji: {
      audio: 2,
      trigger: { global: "phaseDrawBegin" },
      filter: (event, player) => {
        if (event.player.isFriendOf(player)) {
          return false;
        }
        return event.num > 0 && event.player !== player && event.player.hp < event.player.maxHp;
      },
      logTarget: "player",
      async content(event, trigger, player) {
        player.line(trigger.player, "green");
        trigger.num--;
      },
      ai: {
        expose: 0.2,
        threaten: 1.4
      }
    },
    boss_huodi: {
      audio: 2,
      trigger: { player: "phaseEnd" },
      filter: (event, player) => {
        return game.hasPlayer((current) => current.isFriendOf(player) && current.isTurnedOver());
      },
      async cost(event, trigger, player) {
        event.result = await player.chooseTarget({
          prompt: get.prompt("boss_huodi"),
          filterTarget: (card, player2, target) => !target.isFriendOf(player2),
          ai: (target) => {
            if (target.isTurnedOver()) {
              return 0;
            }
            return -get.attitude(player, target);
          }
        }).forResult();
      },
      async content(event, trigger, player) {
        await event.targets[0].turnOver();
      },
      ai: {
        expose: 0.2
      }
    },
    boss_chuanyun: {
      audio: true,
      trigger: { player: "phaseEnd" },
      async cost(event, trigger, player) {
        event.result = await player.chooseTarget({
          prompt: get.prompt("boss_chuanyun"),
          filterTarget: (card, player2, target) => player2.hp < target.hp,
          ai: (target) => get.damageEffect(target, player, player)
        }).forResult();
      },
      async content(event, trigger, player) {
        await event.targets[0].damage();
      }
    },
    boss_leili: {
      audio: 2,
      trigger: { source: "damageEnd" },
      filter: (event) => event.card && event.card.name === "sha",
      async cost(event, trigger, player) {
        event.result = await player.chooseTarget({
          prompt: get.prompt("boss_leili"),
          filterTarget: (card, player2, target) => {
            if (target === trigger.player) {
              return false;
            }
            return target.isEnemyOf(player2);
          },
          ai: (target) => get.damageEffect(target, player, player, "thunder")
        }).forResult();
      },
      async content(event, trigger, player) {
        await event.targets[0].damage({ nature: "thunder" });
      },
      ai: {
        expose: 0.2,
        threaten: 1.3
      }
    },
    boss_fengxing: {
      audio: true,
      trigger: { player: "phaseBegin" },
      direct: true,
      async content(event, trigger, player) {
        const result = await player.chooseTarget({
          prompt: get.prompt("boss_fengxing"),
          filterTarget: (card, player2, target) => {
            if (target.isFriendOf(player2)) {
              return false;
            }
            return lib.filter.targetEnabled({ name: "sha" }, player2, target);
          },
          ai: (target) => get.effect(target, { name: "sha" }, player)
        }).forResult();
        if (player.isDead() && !event.forceDie || player.isOut() && !event.includeOut || player.removed) {
          return;
        }
        if (result.bool) {
          player.logSkill("boss_fengxing");
          await player.useCard({ card: { name: "sha" }, targets: result.targets, addCount: false });
        }
      },
      ai: {
        expose: 0.2,
        threaten: 1.3
      }
    },
    boss_xuanlei: {
      audio: true,
      trigger: { player: "phaseBegin" },
      forced: true,
      filter: (event, player) => {
        return game.hasPlayer((current) => current.isEnemyOf(player) && current.hasCards("j"));
      },
      async content(event, trigger, player) {
        const targets = game.filterPlayer((current) => current.isEnemyOf(player) && current.hasCards("j"));
        targets.sort(lib.sort.seat);
        player.line(targets, "thunder");
        while (targets.length) {
          await targets.shift().damage({ nature: "thunder" });
          if (player.isDead() && !event.forceDie || player.isOut() && !event.includeOut || player.removed) {
            return;
          }
        }
      }
    },
    boss_fanshi: {
      audio: true,
      trigger: { player: "phaseEnd" },
      forced: true,
      check: () => false,
      async content(event, trigger, player) {
        await player.loseHp();
      }
    },
    boss_skonghun: {
      audio: true,
      trigger: { player: "phaseUseBegin" },
      filter: (event, player) => {
        let num = player.maxHp - player.hp;
        if (num === 0) {
          return false;
        }
        for (const current of game.players) {
          if (current.side !== player.side) {
            num--;
          }
        }
        return num >= 0;
      },
      forced: true,
      locked: false,
      async content(event, trigger, player) {
        const targets = game.filterPlayer((current) => current.isEnemyOf(player));
        targets.sort(lib.sort.seat);
        player.line(targets, "thunder");
        const num = targets.length;
        while (targets.length) {
          await targets.shift().damage({ nature: "thunder" });
          if (player.isDead() && !event.forceDie || player.isOut() && !event.includeOut || player.removed) {
            return;
          }
        }
        await player.recover(num);
      },
      ai: {
        threaten: (player, target) => {
          if (target.hp === 1) {
            return 2;
          }
          if (target.hp === 2 && game.players.length < 8) {
            return 1.5;
          }
          return 0.5;
        }
      }
    },
    boss_chiying: {
      audio: 2,
      trigger: { global: "damageBegin4" },
      forced: true,
      filter: (event, player) => {
        if (event.num <= 1) {
          return false;
        }
        return event.player.isFriendOf(player);
      },
      async content(event, trigger, player) {
        trigger.num = 1;
      }
    },
    boss_jingfan: {
      global: "boss_jingfan2"
    },
    boss_jingfan2: {
      mod: {
        globalFrom: (from, to, distance) => {
          if (to.isEnemyOf(from)) {
            return;
          }
          const players = game.filterPlayer();
          for (const current of players) {
            if (current.hasSkill("boss_jingfan") && current.isFriendOf(from) && current !== from) {
              return distance - 1;
            }
          }
        }
      }
    },
    boss_lingyu: {
      trigger: { player: "phaseEnd" },
      check: (event, player) => {
        if (player.isTurnedOver()) {
          return true;
        }
        let num = 0;
        const players = game.filterPlayer();
        for (const current of players) {
          if (current.hp < current.maxHp && current.isFriendOf(player) && get.recoverEffect(current) > 0) {
            if (current.hp === 1) {
              return true;
            }
            num++;
            if (num >= 2) {
              return true;
            }
          }
        }
        return false;
      },
      content: [
        async (event, trigger, player, result) => {
          await player.turnOver();
        },
        async (event, trigger, player, result) => {
          const targets = game.filterPlayer((current) => current.isDamaged() && current.isFriendOf(player));
          player.line(targets, "green");
          while (targets.length) {
            await targets.shift().recover();
            if (player.isDead() && !event.forceDie || player.isOut() && !event.includeOut || player.removed) {
              return;
            }
          }
        }
      ],
      ai: {
        threaten: 1.5
      }
    },
    boss_zhenwei: {
      global: "boss_zhenwei2",
      ai: {
        threaten: 1.5
      }
    },
    boss_zhenwei2: {
      mod: {
        globalTo: (from, to, distance) => {
          if (to.isFriendOf(from)) {
            return;
          }
          const players = game.filterPlayer();
          for (const current of players) {
            if (current.hasSkill("boss_zhenwei") && current.isFriendOf(to) && current !== to) {
              return distance + 1;
            }
          }
        }
      }
    },
    boss_benlei: {
      mode: ["versus"],
      trigger: { player: "phaseBegin" },
      forced: true,
      filter: (event, player) => {
        if (_status.mode !== "jiange") {
          return false;
        }
        const players = game.filterPlayer();
        for (const current of players) {
          if (current.type === "mech" && current.isEnemyOf(player)) {
            return true;
          }
        }
      },
      async content(event, trigger, player) {
        const target = game.findPlayer((current) => current.type === "mech" && current.isEnemyOf(player));
        if (target) {
          player.line(target, "thunder");
          await target.damage({ num: Math.random() > 0.4 ? 2 : 3, nature: "thunder" });
        }
      },
      ai: {
        threaten: (player, target) => {
          if (_status.mode === "jiange") {
            for (const current of game.players) {
              if (current.type === "mech" && current.isEnemyOf(target)) {
                return 2;
              }
            }
          }
          return 1;
        }
      }
    },
    boss_nailuo: {
      trigger: { player: "phaseEnd" },
      check: (event, player) => {
        if (player.isTurnedOver()) {
          return true;
        }
        let num = 0;
        const players = game.filterPlayer();
        for (const current of players) {
          if (current.isEnemyOf(player)) {
            const es = current.getCards("e");
            for (const card of es) {
              switch (get.subtype(card)) {
                case "equip1":
                  num += 1;
                  break;
                case "equip2":
                  num += 2;
                  break;
                case "equip3":
                  num += 2;
                  break;
                case "equip4":
                  num += 1;
                  break;
                case "equip5":
                  num += 1.5;
                  break;
              }
            }
          }
        }
        if (_status.mode === "jiange") {
          for (const current of players) {
            if (current.isFriendOf(player) && current.hasSkill("huodi")) {
              return num > 0;
            }
          }
        }
        return num >= 4;
      },
      filter: (event, player) => {
        const players = game.filterPlayer();
        for (const current of players) {
          if (current.isEnemyOf(player) && current.hasCards("e")) {
            return true;
          }
        }
        return false;
      },
      content: [
        async (event, trigger, player, result) => {
          await player.turnOver();
        },
        async (event, trigger, player, result) => {
          const targets = get.players();
          while (targets.length) {
            const current = targets.shift();
            if (current.isEnemyOf(player)) {
              const es = current.getCards("e");
              if (es.length) {
                const next = current.discard({ cards: es });
                player.line(current, "green");
                await next;
              }
            }
            if (player.isDead() && !event.forceDie || player.isOut() && !event.includeOut || player.removed) {
              return;
            }
          }
        }
      ]
    },
    boss_tanshi: {
      trigger: { player: "phaseEnd" },
      forced: true,
      check: () => false,
      filter: (event, player) => player.hasCards("h"),
      async content(event, trigger, player) {
        await player.chooseToDiscard({ position: "h", forced: true });
      }
    },
    boss_tunshi: {
      trigger: { player: "phaseBegin" },
      forced: true,
      filter: (event, player) => {
        const nh = player.countCards("h");
        return game.hasPlayer((current) => current.isEnemyOf(player) && current.countCards("h") > nh);
      },
      async content(event, trigger, player) {
        const nh = player.countCards("h");
        const targets = game.filterPlayer((current) => current.isEnemyOf(player) && current.countCards("h") > nh);
        targets.sort(lib.sort.seat);
        while (targets.length) {
          const current = targets.shift();
          const next = current.damage();
          player.line(current, "thunder");
          await next;
          if (player.isDead() && !event.forceDie || player.isOut() && !event.includeOut || player.removed) {
            return;
          }
        }
      }
    },
    boss_jiguan: {
      mod: {
        targetEnabled: (card, player, target) => {
          if (card.name === "lebu") {
            return false;
          }
        }
      }
    },
    boss_gongshenjg: {
      audio: 2,
      trigger: { player: "phaseEnd" },
      mode: ["versus"],
      filter: (event, player) => {
        if (_status.mode !== "jiange") {
          return false;
        }
        const players = game.filterPlayer();
        for (const current of players) {
          if (current.type === "mech") {
            if (current.isEnemyOf(player)) {
              return true;
            }
            if (current.hp < current.maxHp) {
              return true;
            }
          }
        }
        return false;
      },
      async content(event, trigger, player) {
        let enemy;
        for (const current of game.filterPlayer()) {
          if (current.type === "mech") {
            if (current.isFriendOf(player)) {
              if (current.hp < current.maxHp) {
                player.line(current, "green");
                await current.recover();
                return;
              }
            } else {
              enemy = current;
            }
          }
        }
        if (enemy) {
          player.line(enemy, "fire");
          await enemy.damage({ nature: "fire" });
        }
      }
    },
    boss_jingmiao: {
      trigger: { global: "useCardAfter" },
      filter: (event, player) => event.player.isEnemyOf(player) && event.card.name === "wuxie",
      logTarget: "player",
      check: (event, player) => get.attitude(player, event.player) < 0,
      async content(event, trigger, player) {
        player.line(trigger.player, "green");
        await trigger.player.loseHp();
      },
      ai: {
        expose: 0.2,
        threaten: 1.3
      }
    },
    boss_zhinang: {
      trigger: { player: "phaseBegin" },
      frequent: true,
      content: [
        async (event, trigger, player, result) => {
          event.cards = get.cards(5);
          event.cards2 = [];
          for (const card of event.cards) {
            const type2 = get.type(card, "trick");
            if (type2 === "trick" || type2 === "equip") {
              event.cards2.push(card);
            }
          }
          if (!event.isMine() || event.cards2.length === 0) {
            await player.showCards(event.cards);
          }
        },
        async (event, trigger, player, result) => {
          if (event.cards2.length === 0) {
            event.finish();
            return;
          }
          const dialog = ui.create.dialog("将五张牌中的锦囊牌或装备牌交给一名己方角色", "hidden");
          dialog.add(event.cards);
          for (const button of dialog.buttons) {
            button.style.opacity = event.cards2.includes(button.link) ? 1 : 0.5;
          }
          player.chooseTarget({
            forced: true,
            dialog,
            filterTarget: (card, player2, target) => target.isFriendOf(player2),
            ai: (target) => {
              const att = get.attitude(player, target);
              if (att > 0 && target.hasJudge("lebu")) {
                return 0.1;
              }
              if (player.countCards("h") > player.hp && target === player) {
                return Math.max(1, att - 2);
              }
              if (target === player) {
                return att + 5;
              }
              return att;
            }
          });
        },
        async (event, trigger, player, result) => {
          if (result && result.targets && result.targets.length) {
            event.target = result.targets[0];
          }
          if (event.cards2.length) {
            player.line(event.target, "green");
            await event.target.gain({ cards: event.cards2, animate: "gain2", log: true });
          }
        }
      ],
      ai: {
        threaten: 1.3
      }
    },
    boss_biantian4: {
      trigger: { player: "dieBegin" },
      forced: true,
      popup: false,
      async content(event, trigger, player) {
        for (const current of game.players) {
          if (current.hasSkill("boss_biantian3")) {
            current.removeSkill("boss_biantian3");
            current.popup("boss_biantian3");
          }
          if (current.hasSkill("boss_biantian2")) {
            current.removeSkill("boss_biantian2");
            current.popup("boss_biantian2");
          }
        }
      }
    },
    boss_biantian: {
      trigger: { player: "phaseBegin" },
      forced: true,
      unique: true,
      audio: false,
      group: "boss_biantian4",
      content: [
        async (event, trigger, player, result) => {
          for (const current of game.players) {
            if (current.hasSkill("boss_biantian3")) {
              current.removeSkill("boss_biantian3");
              current.popup("boss_biantian3");
            }
            if (current.hasSkill("boss_biantian2")) {
              current.removeSkill("boss_biantian2");
              current.popup("boss_biantian2");
            }
          }
          player.judge({
            judge: (card) => {
              const color = get.color(card);
              if (color === "black") {
                return 1;
              }
              if (color === "red") {
                return 0;
              }
              return -1;
            }
          });
        },
        async (event, trigger, player, result) => {
          const targets = [];
          const players = game.filterPlayer();
          if (result.color === "red") {
            game.trySkillAudio("boss_biantianx2");
            for (const current of players) {
              if (!current.isFriendOf(player)) {
                current.addSkill("boss_biantian3");
                current.popup("kuangfeng");
                targets.push(current);
              }
            }
            player.logSkill("kuangfeng", targets, "fire");
          } else if (result.color === "black") {
            game.trySkillAudio("boss_biantianx1");
            for (const current of players) {
              if (current.isFriendOf(player)) {
                current.addSkill("boss_biantian2");
                current.popup("dawu");
                targets.push(current);
              }
            }
            player.logSkill("dawu", targets, "thunder");
          }
        }
      ],
      ai: {
        threaten: 1.6
      }
    },
    boss_biantian2: {
      audio: false,
      trigger: { player: "damageBefore" },
      filter: (event) => {
        if (!event.hasNature("thunder")) {
          return true;
        }
        return false;
      },
      forced: true,
      mark: true,
      marktext: "雾",
      intro: {
        content: "已获得大雾标记"
      },
      async content(event, trigger, player) {
        trigger.cancel();
      },
      ai: {
        nofire: true,
        nodamage: true,
        effect: {
          target: (card, player, target, current) => {
            if (get.tag(card, "damage") && !get.tag(card, "thunderDamage")) {
              return "zeroplayertarget";
            }
          }
        }
      }
    },
    boss_biantian3: {
      trigger: { player: "damageBegin3" },
      filter: (event) => {
        if (event.hasNature("fire")) {
          return true;
        }
        return false;
      },
      mark: true,
      marktext: "风",
      intro: {
        content: "已获得狂风标记"
      },
      forced: true,
      async content(event, trigger, player) {
        trigger.num++;
      },
      ai: {
        effect: {
          target: (card, player, target, current) => {
            if (get.tag(card, "fireDamage")) {
              return 1.5;
            }
          }
        }
      }
    },
    boss_jizhen: {
      audio: 2,
      trigger: { player: "phaseEnd" },
      forced: true,
      filter: (event, player) => {
        return game.hasPlayer((current) => current.isFriendOf(player) && current.isDamaged());
      },
      async content(event, trigger, player) {
        const list = game.filterPlayer((current) => current.isFriendOf(player) && current.isDamaged());
        if (list.length) {
          player.line(list, "green");
          game.asyncDraw(list);
        }
      },
      ai: {
        threaten: 1.4
      }
    },
    boss_lingfeng: {
      audio: 2,
      trigger: { player: "phaseDrawBefore" },
      content: [
        async (event, trigger, player, result) => {
          trigger.cancel();
          event.cards = get.cards(2);
          await player.showCards(event.cards);
        },
        async (event, trigger, player, result) => {
          if (get.color(event.cards[0]) !== get.color(event.cards[1])) {
            player.chooseTarget({
              prompt: "是否令一名敌方角色失去1点体力？",
              filterTarget: (card, player2, target) => !target.isFriendOf(player2),
              ai: (target) => -get.attitude(player, target)
            });
          }
        },
        async (event, trigger, player, result) => {
          if (result.bool && result.targets && result.targets.length) {
            player.line(result.targets, "green");
            await result.targets[0].loseHp();
          }
        },
        async (event, trigger, player, result) => {
          player.gain({ cards: event.cards });
          player.$draw(event.cards);
          game.delay();
        }
      ],
      ai: {
        threaten: 1.4
      }
    },
    boss_yuhuojg: {
      audio: true,
      trigger: { player: "damageBegin2" },
      filter: (event) => event.hasNature("fire"),
      forced: true,
      async content(event, trigger, player) {
        trigger.cancel();
      },
      ai: {
        nofire: true,
        effect: {
          target: (card, player, target, current) => {
            if (get.tag(card, "fireDamage")) {
              return "zeroplayertarget";
            }
          }
        }
      }
    },
    boss_tianyun: {
      trigger: { player: "phaseEnd" },
      direct: true,
      content: [
        async (event, trigger, player, result) => {
          event.forceDie = true;
          player.chooseTarget({
            prompt: get.prompt("boss_tianyun"),
            filterTarget: (card, player2, target) => target.isEnemyOf(player2),
            ai: (target) => {
              if (player.hp <= 1 || get.attitude(player, target) > -3) {
                return 0;
              }
              const eff = get.damageEffect(target, player, player, "fire");
              if (eff > 0) {
                return eff + target.countCards("e") / 2;
              }
              return 0;
            }
          });
        },
        async (event, trigger, player, result) => {
          if (!result.bool) {
            event.finish();
            return;
          }
          player.logSkill("boss_tianyun", result.targets, "fire");
          player.loseHp();
          event.target = result.targets[0];
        },
        async (event, trigger, player, result) => {
          if (event.target) {
            await event.target.damage({ num: Math.random() > 0.4 ? 2 : 3, nature: "fire" });
          }
        },
        async (event, trigger, player, result) => {
          if (event.target) {
            const es = event.target.getCards("e");
            if (es.length) {
              await event.target.discard({ cards: es });
            }
          }
        }
      ],
      ai: {
        threaten: 2
      }
    },
    versus_ladder: {
      trigger: { global: ["damageEnd", "recoverEnd", "dieEnd", "gainEnd", "phaseDiscardEnd"] },
      silent: true,
      filter: (event, player) => {
        if (!_status.ladder) {
          return false;
        }
        if (event._ladder_mmr_counted) {
          return false;
        }
        if (!event.source) {
          return false;
        }
        return event.source === game.me || event.player === game.me;
      },
      async content(event, trigger, player) {
        switch (event.triggername) {
          case "damageEnd": {
            if (trigger.source.side !== trigger.player.side) {
              if (trigger.source === game.me) {
                _status.ladder_mmr += 0.5 * Math.max(1, trigger.num);
              } else {
                _status.ladder_mmr += 0.2 * Math.max(1, trigger.num);
              }
            }
            break;
          }
          case "recoverEnd": {
            if (trigger.source !== trigger.player) {
              if (trigger.source === game.me) {
                if (trigger.player.side === game.me.side) {
                  _status.ladder_mmr += 0.5 * trigger.num;
                } else {
                  _status.ladder_mmr -= 0.3 * trigger.num;
                }
              }
            } else {
              _status.ladder_mmr += 0.3 * trigger.num;
            }
            break;
          }
          case "dieEnd": {
            if (trigger.source === game.me && trigger.player.side !== game.me.side) {
              _status.ladder_mmr += 2;
            }
            break;
          }
          case "gainEnd": {
            if (trigger.cards && trigger.cards.length) {
              if (trigger.source === game.me && trigger.player !== game.me) {
                if (trigger.player.side === game.me.side) {
                  _status.ladder_mmr += 0.3 * trigger.cards.length;
                } else {
                  _status.ladder_mmr -= 0.1 * trigger.cards.length;
                }
              } else {
                if (trigger.source) {
                  if (trigger.source.side !== game.me.side) {
                    _status.ladder_mmr += 0.3 * trigger.cards.length;
                  }
                } else {
                  _status.ladder_mmr += 0.1 * trigger.cards.length;
                }
              }
            }
            break;
          }
          case "phaseDiscardEnd": {
            if (trigger.player === player) {
              if (trigger.cards && trigger.cards.length) {
                _status.ladder_mmr -= 0.2 * trigger.cards.length;
              }
            }
            break;
          }
        }
        trigger._ladder_mmr_counted = true;
      }
    }
  },
  card: {
    tunliang: {
      audio: true,
      fullskin: true,
      type: "trick",
      enable: true,
      selectTarget: [1, 3],
      filterTarget: true,
      async content(event, trigger, player) {
        const { target } = event;
        await target.draw();
      },
      ai: {
        basic: {
          order: 7.2,
          useful: 4.5,
          value: 9.2
        },
        result: {
          target: 1
        },
        tag: {
          draw: 1
        }
      }
    },
    yuanjun: {
      fullskin: true,
      type: "trick",
      selectTarget: [1, 2],
      enable: true,
      filterTarget: (card, player, target) => target !== player && target.hp < target.maxHp,
      async content(event, trigger, player) {
        const { target } = event;
        await target.recover();
      },
      ai: {
        basic: {
          order: (card, player) => {
            if (player.hasSkillTag("pretao")) {
              return 5;
            }
            return 2;
          },
          useful: [6, 4],
          value: [6, 4]
        },
        result: {
          target: (player, target) => 2
        },
        tag: {
          recover: 1
        }
      }
    },
    xujiu: {
      audio: "jiu",
      cardimage: "jiu",
      fullskin: true,
      type: "basic",
      enable: true,
      filterTarget: (card, player, target) => target.isEnemyOf(player),
      selectTarget: 1,
      async content(event, trigger, player) {
        const { target } = event;
        target.addTempSkill("xujiu2");
        target.addMark("xujiu2", event.baseDamage || 1, false);
      },
      ai: {
        basic: {
          order: (item, player) => {
            const cards = player.getCards("hs", (card) => get.tag(card, "damage") && player.hasValueTarget(card));
            if (!cards.length) {
              return 0;
            }
            let cardx = cards.filter((card) => get.name(card) === "sha");
            cardx.sort((a, b) => player.getUseValue(b) - player.getUseValue(a));
            cardx = cardx.slice(Math.min(cardx.length, player.getCardUsable("sha")), cardx.length);
            cards.removeArray(cardx);
            return get.order(cards.sort((a, b) => get.order(b, player) - get.order(a, player))[0]) + 0.3;
          },
          useful: 5,
          value: 3
        },
        result: {
          target: (player, target) => {
            if (target.hasSkill("gangzhi") || get.attitude(player, target) >= 0) {
              return 0;
            }
            const cards = player.getCards("hs", (card) => get.tag(card, "damage") && player.canUse(card, target) && get.effect(target, card, player, player) > 0);
            if (!cards.length) {
              return 0;
            }
            let cardx = cards.filter((card) => get.name(card) === "sha");
            cardx.sort((a, b) => get.effect(target, b, player, player) - get.effect(target, a, player, player));
            cardx = cardx.slice(Math.min(cardx.length, player.getCardUsable("sha")), cardx.length);
            cards.removeArray(cardx);
            return -cards.reduce((sum, card) => sum + get.effect(target, card, player, player), 0);
          }
        }
      }
    },
    zong: {
      fullskin: true,
      type: "basic",
      cardcolor: "red",
      enable: (card, player) => player.hp < player.maxHp,
      savable: (card, player, dying) => dying.side === player.side,
      selectTarget: -1,
      filterTarget: (card, player, target) => target === player && target.hp < target.maxHp,
      modTarget: (card, player, target) => target.hp < target.maxHp,
      async content(event, trigger, player) {
        const { target } = event;
        await target.recover();
      },
      ai: {
        basic: {
          order: (card, player) => {
            if (player.hasSkillTag("pretao")) {
              return 5;
            }
            return 2;
          },
          useful: [8, 6.5, 5, 4],
          value: [8, 6.5, 5, 4]
        },
        result: {
          target: (player, target) => {
            if (target.hp <= 0) {
              return 2;
            }
            const nd = player.needsToDiscard();
            let keep = false;
            if (nd <= 0) {
              keep = true;
            } else if (nd === 1 && target.hp >= 2 && target.countCards("h", "tao") <= 1) {
              keep = true;
            }
            get.mode();
            if (target.hp >= 2 && keep && target.hasFriend()) {
              if (target.hp > 2 || nd === 0) {
                return 0;
              }
              if (target.hp === 2) {
                if (game.hasPlayer((current) => {
                  if (target !== current && get.attitude(target, current) >= 3) {
                    if (current.hp <= 1) {
                      return true;
                    }
                  }
                })) {
                  return 0;
                }
              }
            }
            return 2;
          }
        },
        tag: {
          recover: 1,
          save: 1
        }
      }
    },
    xionghuangjiu: {
      fullskin: true,
      type: "basic",
      enable: (event, player) => !player.hasSkill("jiu") && !player.hasSkill("xionghuangjiu"),
      lianheng: true,
      logv: false,
      savable: (card, player, dying) => dying === player,
      usable: 1,
      selectTarget: -1,
      modTarget: true,
      filterTarget: (card, player, target) => target === player,
      async content(event, trigger, player) {
        const { target, targets, cards } = event;
        let { card } = event;
        if (target.isDying()) {
          target.recover();
          if (_status.currentPhase === target) {
            target.getStat().card.jiu--;
          }
        } else {
          if (cards && cards.length) {
            card = cards[0];
          }
          game.broadcastAll(
            (target2, card2, gain2) => {
              if (get.population(target2.side) === 1) {
                target2.addSkill("xionghuangjiu");
              } else {
                if (!target2.storage.jiu) {
                  target2.storage.jiu = 0;
                }
                target2.storage.jiu++;
                target2.addSkill("jiu");
              }
              game.addVideo("jiuNode", target2, true);
              if (!target2.node.jiu && lib.config.jiu_effect) {
                target2.node.jiu = ui.create.div(".playerjiu", target2.node.avatar);
                target2.node.jiu2 = ui.create.div(".playerjiu", target2.node.avatar2);
              }
              if (gain2 && card2.clone && (card2.clone.parentNode === target2.parentNode || card2.clone.parentNode === ui.arena)) {
                card2.clone.moveDelete(target2);
              }
            },
            target,
            card,
            target === targets[0]
          );
          if (target === targets[0]) {
            if (card.clone && (card.clone.parentNode === target.parentNode || card.clone.parentNode === ui.arena)) {
              game.addVideo("gain2", target, get.cardsInfo([card]));
            }
          }
        }
      },
      ai: {
        basic: {
          useful: (card, i) => {
            if (_status.event.player.hp > 1) {
              if (i === 0) {
                return 5;
              }
              return 1;
            }
            if (i === 0) {
              return 7.3;
            }
            return 3;
          },
          value: (card, player, i) => {
            if (player.hp > 1) {
              if (i === 0) {
                return 5;
              }
              return 1;
            }
            if (i === 0) {
              return 7.3;
            }
            return 3;
          }
        },
        order: () => get.order({ name: "sha" }) + 0.2,
        result: {
          target: (player, target) => {
            if (target && target.isDying()) {
              return 2;
            }
            if (lib.config.mode === "stone" && !player.isMin()) {
              if (player.getActCount() + 1 >= player.actcount) {
                return 0;
              }
            }
            const shas = player.getCards("h", "sha");
            if (shas.length > 1 && player.getCardUsable("sha") > 1) {
              return 0;
            }
            let card;
            if (shas.length) {
              for (const currentCard of shas) {
                if (lib.filter.filterCard(currentCard, target)) {
                  card = currentCard;
                  break;
                }
              }
            } else if (player.hasSha() && player.needsToDiscard()) {
              if (player.countCards("h", "hufu") !== 1) {
                card = { name: "sha" };
              }
            }
            if (card) {
              if (game.hasPlayer((current) => get.attitude(target, current) < 0 && target.canUse(card, current, true, true) && !current.getEquip("baiyin") && get.effect(current, card, target) > 0)) {
                return 1;
              }
            }
            return 0;
          }
        },
        tag: {
          save: 1
        }
      }
    },
    tongzhougongji: {
      fullskin: true,
      cardimage: "lulitongxin",
      notarget: true,
      enable: true,
      type: "trick",
      async content(event, trigger, player) {
        let num = 0;
        let friend;
        for (const current of game.players) {
          if (current.side === player.side) {
            if (current !== player) {
              friend = current;
            }
            num += current.storage.longchuanzhibao;
          }
        }
        const result = await player.chooseControl({
          ai: () => num > 2 || num === 2 && get.population(player.side) === 1 ? 0 : 1,
          choiceList: [`摸${get.cnNumber(num)}张牌`, "你和队友各摸一张牌"]
        }).forResult();
        if (player.isDead() && !event.forceDie || player.isOut() && !event.includeOut || player.removed) {
          return;
        }
        if (result.index === 0) {
          if (num) {
            await player.draw(num);
          }
        } else if (friend) {
          player.line(friend);
          game.asyncDraw([player, friend]);
        } else {
          await player.draw();
        }
      },
      ai: {
        basic: {
          order: 7.2,
          useful: 4,
          value: 9.2
        },
        result: {
          target: 2
        },
        tag: {
          draw: 1
        }
      }
    },
    lizhengshangyou: {
      fullskin: true,
      cardimage: "lianjunshengyan",
      type: "trick",
      enable: true,
      selectTarget: -1,
      reverseOrder: true,
      filterTarget: (card, player, target) => {
        for (const current of game.players) {
          if (current.side === target.side && current.storage.longchuanzhibao) {
            return target.isDamaged();
          }
        }
        return target.hasCards("he");
      },
      async content(event, trigger, player) {
        const { target } = event;
        for (const current of game.players) {
          if (current.side === target.side && current.storage.longchuanzhibao) {
            await target.recover();
            return;
          }
        }
        await target.chooseToDiscard({ position: "he", forced: true });
      },
      ai: {
        basic: {
          order: 9,
          useful: [3, 1],
          value: 0
        },
        result: {
          target: (player, target) => {
            for (const current of game.players) {
              if (current.side === target.side && current.storage.longchuanzhibao) {
                return 1.5;
              }
            }
            return -1;
          }
        },
        tag: {
          recover: 0.5,
          multitarget: 1
        }
      }
    }
  },
  element: {
    content: {
      replacePlayer: [
        async (event, trigger, player) => {
          const { source } = event;
          if (source.removed) {
            return event.finish();
          }
          const cards = source.getCards("hej");
          if (cards.length) {
            source.$throw(cards, 1e3);
            await game.cardsDiscard(cards);
          }
        },
        async (event, trigger, player) => {
          const { source } = event;
          const list = source.side === game.me.side ? _status.friend : _status.enemy;
          if (list.length === 0) {
            game.friend.remove(source);
            game.enemy.remove(source);
            if (game.friend.length === 0) {
              game.over(false);
            } else if (game.enemy.length === 0) {
              game.over(true);
            }
            if (game.friendZhu && game.friendZhu.classList.contains("dead") && game.friend.length) {
              game.friendZhu = game.friend[0];
              game.friendZhu.setIdentity(`${_status.color}Zhu`);
            }
            if (game.enemyZhu && game.enemyZhu.classList.contains("dead") && game.enemy.length) {
              game.enemyZhu = game.enemy[0];
              game.enemyZhu.setIdentity(`${!_status.color}Zhu`);
            }
            return event.finish();
          }
          if (source.side === game.me.side && list.length > 1 && (game.me === game.friendZhu || lib.storage.zhu && lib.storage.single_control) && !_status.auto) {
            event.dialog = ui.create.dialog("选择替补角色", [list, "character"]);
            event.filterButton = () => true;
            event.player = game.me;
            event.forced = true;
            event.custom.replace.confirm = () => {
              event.character = ui.selected.buttons[0].link;
              event.dialog.close();
              if (ui.confirm) {
                ui.confirm.close();
              }
              delete event.player;
              game.resume();
            };
            game.check();
            game.pause();
          } else {
            event.character = list[Math.floor(Math.random() * list.length)];
          }
        },
        async (event, trigger, player) => {
          const { source } = event;
          game.uncheck();
          _status.friend.remove(event.character);
          _status.enemy.remove(event.character);
          source.revive(null, false);
          game.additionaldead.push({
            name: source.name,
            stat: source.stat
          });
          game.addVideo("reinit", source, [event.character, get.translation(`${source.side}Color`)]);
          source.uninit();
          source.init(event.character);
          game.log(source, "出场");
          source.node.identity.dataset.color = get.translation(`${source.side}Color`);
          await source.draw(4);
          let evt = event.getParent("dying");
          if (evt && evt.parent) {
            evt = evt.parent;
            evt.untrigger(false, source);
            for (let i = 0; i < 100; i++) {
              evt = evt.parent;
              if (evt.player === source) {
                evt.finish();
              }
              if (evt.name === "phase") {
                break;
              }
            }
          }
          if (lib.storage.single_control) {
            game.onSwapControl();
          }
          await game.triggerEnter(source);
        },
        async (event, trigger, player) => {
          const { source } = event;
        }
      ],
      replacePlayerTwo: [
        async (event, trigger, player) => {
          const { source } = event;
          if (source.removed) {
            return event.finish();
          }
          const cards = source.getCards("hej");
          if (cards.length) {
            source.$throw(cards, 1e3);
            await game.cardsDiscard(cards);
          }
          await game.delay();
        },
        async (event, trigger, player) => {
          const { source } = event;
          source.revive(null, false);
          game.additionaldead.push({
            name: source.name,
            stat: source.stat
          });
          game.addVideo("reinit", source, [event.character, get.translation(`${source.side}Color`)]);
          source.uninit();
          source.init(event.character);
          game.log(source, "出场");
          await source.draw(4);
          let evt = event.getParent("dying");
          if (evt && evt.parent) {
            evt = evt.parent;
            evt.untrigger(false, source);
            for (let i = 0; i < 100; i++) {
              evt = evt.parent;
              if (evt.player === source) {
                evt.finish();
              }
              if (evt.name === "phase") {
                break;
              }
            }
          }
          await game.triggerEnter(source);
        }
      ],
      replacePlayerOL: [
        async (event, trigger, player) => {
          const { source } = event;
          if (source.removed) {
            return event.finish();
          }
          const cards = source.getCards("hej");
          if (cards.length) {
            source.$throw(cards, 1e3);
            await game.cardsDiscard(cards);
          }
          await game.delay();
        },
        async (event, trigger, player) => {
          const { source } = event;
          if (event.source.side === game.me.side) {
            if (_status.friend.length === 1) {
              event.directresult = _status.friend[0];
            } else if (event.source === game.me) {
              if (_status.auto) {
                event.directresult = _status.friend.randomGet();
              }
            } else {
              if (!event.source.isOnline()) {
                event.directresult = _status.friend.randomGet();
              }
            }
          } else {
            if (_status.enemy.length === 1) {
              event.directresult = _status.enemy[0];
            } else {
              if (!event.source.isOnline()) {
                event.directresult = _status.enemy.randomGet();
              }
            }
          }
          if (!event.directresult) {
            if (event.source === game.me) {
              event.dialog = ui.create.dialog("选择替补角色", [_status.friend, "character"]);
              event.filterButton = () => true;
              event.player = game.me;
              event.forced = true;
              event.custom.replace.confirm = () => {
                event.directresult = ui.selected.buttons[0].link;
                event.dialog.close();
                if (ui.confirm) {
                  ui.confirm.close();
                }
                delete event.player;
                game.resume();
              };
              event.switchToAuto = () => {
                event.directresult = _status.friend.randomGet();
                event.dialog.close();
                if (ui.confirm) {
                  ui.confirm.close();
                }
                delete event.player;
              };
              game.check();
              game.pause();
            } else {
              event.source.send((player2) => {
                if (_status.auto) {
                  _status.event._result = _status.friend.randomGet();
                } else {
                  const next = game.createEvent("replacePlayer");
                  next.source = player2;
                  next.setContent(async (event2, trigger2, player3) => {
                    event2.dialog = ui.create.dialog("选择替补角色", [_status.friend, "character"]);
                    event2.filterButton = () => true;
                    event2.player = event2.source;
                    event2.forced = true;
                    event2.custom.replace.confirm = () => {
                      event2.result = ui.selected.buttons[0].link;
                      event2.dialog.close();
                      if (ui.confirm) {
                        ui.confirm.close();
                      }
                      delete event2.player;
                      game.resume();
                      game.uncheck();
                    };
                    event2.switchToAuto = () => {
                      event2.result = _status.friend.randomGet();
                      event2.dialog.close();
                      if (ui.confirm) {
                        ui.confirm.close();
                      }
                      delete event2.player;
                      game.uncheck();
                    };
                    game.check();
                    game.pause();
                  });
                }
                game.resume();
              }, event.source);
              event.source.wait();
              game.pause();
            }
          }
        },
        async (event, trigger, player) => {
          const { source } = event;
          game.uncheck();
          if (!event.directresult) {
            if (event.resultOL) {
              event.directresult = event.resultOL[source.playerid];
            }
            if (!event.directresult || event.directresult === "ai") {
              if (source.side === game.me.side) {
                event.directresult = _status.friend.randomGet();
              } else {
                event.directresult = _status.enemy.randomGet();
              }
            }
          }
          const name = event.directresult;
          const color = source.node.identity.dataset.color;
          game.additionaldead.push({
            name: source.name,
            stat: source.stat
          });
          game.broadcastAll(
            (source2, name2, color2) => {
              _status.friend.remove(name2);
              _status.enemy.remove(name2);
              source2.revive(null, false);
              source2.uninit();
              source2.init(name2);
              source2.node.identity.dataset.color = color2;
              if (source2 === game.me) {
                ui.arena.classList.remove("selecting");
              }
            },
            source,
            name,
            color
          );
          game.log(source, "出场");
          await source.draw(4);
          let evt = event.getParent("dying");
          if (evt && evt.parent) {
            evt = evt.parent;
            evt.untrigger(false, source);
            for (let i = 0; i < 100; i++) {
              evt = evt.parent;
              if (evt.player === source) {
                evt.finish();
              }
              if (evt.name === "phase") {
                break;
              }
            }
          }
          game.addVideo("reinit", source, [name, color]);
          await game.triggerEnter(source);
        }
      ]
    },
    player: {
      gainZhibao: function(num, source) {
        if (source) {
          if (num === true || num > source.storage.longchuanzhibao) {
            num = source.storage.longchuanzhibao;
          }
        } else {
          if (typeof num !== "number") {
            num = 1;
          }
        }
        if (!num || typeof num !== "number") {
          return this;
        }
        this.storage.longchuanzhibao += num;
        this.updateMark("longchuanzhibao");
        if (source) {
          source.storage.longchuanzhibao -= num;
          source.updateMark("longchuanzhibao");
          game.log(this, "从", source, `处获得了${get.cnNumber(num)}个`, "#y龙船至宝");
        } else {
          game.log(this, `获得了${get.cnNumber(num)}个`, "#y龙船至宝");
        }
        if (source && source.side !== this.side) {
          this.draw(num, "nodelay");
          const that = this;
          const friend = game.findPlayer((current) => current.side === that.side && current !== that);
          if (friend) {
            friend.draw(num, "nodelay");
          }
        }
        const map = { wei: 0, shu: 0, wu: 0, qun: 0 };
        for (const current of game.players) {
          map[current.side] += current.storage.longchuanzhibao;
        }
        for (const current of game.players) {
          if (map[current.side] >= 4) {
            current.classList.add("current_action");
          } else {
            current.classList.remove("current_action");
          }
        }
        return this;
      },
      dieAfter2: function(source) {
        if (_status.connectMode && _status.mode !== "guandu") {
          if (_status.mode === "1v1" || _status.mode === "3v3") {
            return;
          } else if (_status.mode === "2v2") {
            let friend;
            for (const current of game.players) {
              if (current.side === this.side) {
                friend = current;
                break;
              }
            }
            if (friend) {
              const next = game.createEvent("versusDraw");
              next.setContent([
                async (event, trigger, player) => await player.chooseBool({ prompt: "是否摸一张牌？" }).forResult(),
                async (event, trigger, player, result) => {
                  if (result.bool) {
                    await player.draw();
                  }
                }
              ]);
              next.player = friend;
            }
          } else if (_status.mode === "4v4") {
            if (this.identity === "zhu") {
              return;
            } else {
              if (source) {
                if (source.side === this.side) {
                  if (source.identity === "zhu") {
                    source.discard(source.getCards("he"));
                  }
                } else {
                  let num1 = 0;
                  let num2 = 1;
                  for (const current of game.players) {
                    if (current.side === source.side) {
                      num1++;
                    } else {
                      num2++;
                    }
                  }
                  source.draw(2 + Math.max(0, num2 - num1));
                }
              }
            }
            return;
          }
        } else {
          if (_status.mode === "four" || _status.mode === "guandu") {
            if (this.identity === "zhu") {
              return;
            } else {
              if (source) {
                if (source.side === this.side) {
                  if (_status.mode === "guandu" || source.identity === "zhu") {
                    source.discard(source.getCards("he"));
                  }
                } else {
                  if (_status.mode === "guandu") {
                    return;
                  }
                  let num1 = 0;
                  let num2 = 1;
                  for (const current of game.players) {
                    if (current.side === source.side) {
                      num1++;
                    } else {
                      num2++;
                    }
                  }
                  source.draw(2 + Math.max(0, num2 - num1));
                }
              }
            }
            return;
          } else if (_status.mode === "two") {
            let friend;
            for (const current of game.players) {
              if (current.side === this.side) {
                friend = current;
                break;
              }
            }
            if (_status.replacetwo) {
              if (this.replacetwo) {
                if (source) {
                  if (source.side === this.side) {
                    const he = source.getCards("he");
                    if (he.length) {
                      source.discard(he);
                    }
                  } else {
                    source.draw(3);
                  }
                }
              } else if (friend && friend.replacetwo) {
                if (source) {
                  if (source.side === this.side) {
                    const he = source.getCards("he");
                    if (he.length) {
                      source.discard(he);
                    }
                  } else {
                    source.draw(3);
                  }
                }
              }
            } else {
              if (friend) {
                const next = game.createEvent("versusDraw");
                next.setContent([
                  async (event, trigger, player) => await player.chooseBool({ prompt: "是否摸一张牌？" }).forResult(),
                  async (event, trigger, player, result) => {
                    if (result.bool) {
                      await player.draw();
                    }
                  }
                ]);
                next.player = friend;
              }
            }
            return;
          } else if (_status.mode === "siguo") {
            return;
          } else if (_status.mode === "jiange") {
            return;
          } else if (_status.mode === "three") {
            if (this.identity === "zhu") {
              return;
            } else {
              game.friend.remove(this);
              game.enemy.remove(this);
              if (source) {
                source.draw(2);
              }
            }
            return;
          }
          const list = this.side === game.me.side ? _status.friend : _status.enemy;
          if (list.length === 0 && lib.storage.noreplace_end || lib.storage.zhu && lib.storage.main_zhu && this.identity === "zhu" && game.players.length > 2) {
            return;
          } else if (game.friend.length === 1 && this === game.friend[0] && _status.friend.length === 0) {
            return;
          } else if (game.enemy.length === 1 && this === game.enemy[0] && _status.enemy.length === 0) {
            return;
          } else {
            if (source) {
              if (source.side !== this.side) {
                if (lib.storage.versus_reward) {
                  source.draw(lib.storage.versus_reward);
                }
              } else {
                if (lib.storage.versus_punish === "弃牌") {
                  source.discard(source.getCards("he"));
                } else if (lib.storage.versus_punish === "摸牌" && lib.storage.versus_reward) {
                  source.draw(lib.storage.versus_reward);
                }
              }
            } else {
              game.delay();
            }
          }
        }
      },
      dieAfter: function(source) {
        if (_status.connectMode) {
          if (_status.mode === "1v1" || _status.mode === "3v3") {
            game.broadcastAll((dead) => {
              if (dead.side === game.me.side) {
                _status.friendDied.push(dead.name1);
                _status.friendCount.innerHTML = `阵亡: ${get.cnNumber(_status.friendDied.length, true)}`;
              } else {
                _status.enemyDied.push(dead.name1);
                _status.enemyCount.innerHTML = `杀敌: ${get.cnNumber(_status.enemyDied.length, true)}`;
              }
            }, this);
            if (this.side === game.me.side) {
              if (_status.friend.length === 0) {
                game.over(false);
                return;
              }
            } else {
              if (_status.enemy.length === 0) {
                game.over(true);
                return;
              }
            }
            game.replacePlayerOL(this);
          } else if (_status.mode === "2v2") {
            if (_status.replacetwo) ;
            let friend;
            for (const current of game.players) {
              if (current.side === this.side) {
                friend = current;
                break;
              }
            }
            if (!friend) {
              game.over(this.side !== game.me.side);
            } else {
              friend.showGiveup();
            }
          } else if (_status.mode === "4v4" || _status.mode === "guandu") {
            if (this.identity === "zhu") {
              game.over(this.side !== game.me.side);
            } else {
              if (_status.mode === "guandu" && source && source.side !== this.side) {
                const hs = this.getCards("h");
                if (hs.length) {
                  source.gain(hs, this, "giveAuto");
                }
              }
              const side1 = [];
              const side2 = [];
              for (const current of game.players) {
                if (current.side) {
                  side1.push(current);
                } else {
                  side2.push(current);
                }
              }
              if (side1.length === 1) {
                side1[0].showGiveup();
              }
              if (side2.length === 1) {
                side2[0].showGiveup();
              }
            }
            return;
          }
        } else {
          const me = game.me._trueMe || game.me;
          if (_status.mode === "four" || _status.mode === "guandu") {
            if (this.identity === "zhu") {
              game.over(this.side !== me.side);
            } else {
              if (_status.mode === "guandu" && source && source.side !== this.side) {
                const hs = this.getCards("h");
                if (hs.length) {
                  source.gain(hs, this, "giveAuto");
                }
              }
              const side1 = [];
              const side2 = [];
              for (const current of game.players) {
                if (current.side) {
                  side1.push(current);
                } else {
                  side2.push(current);
                }
              }
              if (me.side) {
                if (side1.length <= side2.length - 2) {
                  me.showGiveup();
                }
              } else {
                if (side1.length >= side2.length + 2) {
                  me.showGiveup();
                }
              }
            }
            return;
          } else if (_status.mode === "two") {
            let friend;
            for (const current of game.players) {
              if (current.side === this.side) {
                friend = current;
                break;
              }
            }
            if (_status.replacetwo) {
              if (this.replacetwo) {
                game.replacePlayerTwo(this, this.replacetwo);
                delete this.replacetwo;
                if (get.config("olfeiyang_four") && this === _status.firstAct.previous) {
                  this.addSkill("olfeiyang");
                }
              } else if (friend && friend.replacetwo) {
                game.replacePlayerTwo(this, friend.replacetwo);
                delete friend.replacetwo;
                if (get.config("olfeiyang_four") && this === _status.firstAct.previous) {
                  this.addSkill("olfeiyang");
                }
              } else {
                game.over(this.side !== me.side);
              }
            } else {
              if (!friend) {
                game.over(this.side !== me.side);
              } else {
                friend.showGiveup();
              }
            }
            return;
          } else if (_status.mode === "siguo") {
            if (game.players.length === 1 || game.players.length === 2 && game.players[0].side === game.players[1].side) {
              game.over(me.side === game.players[0].side);
            }
            const assignzhibao = function() {
              const list2 = game.players.slice(0);
              let max = 0;
              let list22 = [];
              for (const argument of arguments) {
                list2.remove(argument);
              }
              for (const item of list2) {
                if (item.storage.longchuanzhibao > max) {
                  max = item.storage.longchuanzhibao;
                }
              }
              for (const item of list2) {
                if (item.storage.longchuanzhibao === max) {
                  if (list22.length) {
                    list22 = list2;
                    break;
                  } else {
                    list22.push(item);
                  }
                }
              }
              for (const argument of arguments) {
                for (let j = 0; j < argument.storage.longchuanzhibao; j++) {
                  const current = list22.randomGet();
                  if (!current.storage._longchuanzhibao) {
                    current.storage._longchuanzhibao = 1;
                  } else {
                    current.storage._longchuanzhibao++;
                  }
                }
                for (const item of list22) {
                  if (item.storage._longchuanzhibao) {
                    argument.line(item, "green");
                    item.gainZhibao(item.storage._longchuanzhibao, argument);
                    delete item.storage._longchuanzhibao;
                  }
                }
              }
            };
            if (source) {
              if (source.side === this.side) {
                assignzhibao(this, source);
              } else {
                if (this.storage.longchuanzhibao) {
                  source.gainZhibao(true, this);
                }
              }
            } else {
              assignzhibao(this);
            }
            return;
          } else if (_status.mode === "jiange") {
            if (get.population("wei") === 0) {
              game.over(me.identity === "shu");
            } else if (get.population("shu") === 0) {
              game.over(me.identity === "wei");
            }
            return;
          } else if (_status.mode === "three") {
            if (this.identity === "zhu") {
              if (game.friend.includes(this)) {
                game.over(false);
              } else {
                game.over(true);
              }
            } else {
              if (this === me) {
                game.modeSwapPlayer(game.friendZhu);
              }
              game.friend.remove(this);
              game.enemy.remove(this);
            }
            return;
          }
          if (this.side === me.side) {
            _status.friendDied.push(this.name1);
            _status.friendCount.innerHTML = `阵亡: ${get.cnNumber(_status.friendDied.length, true)}`;
          } else {
            _status.enemyDied.push(this.name1);
            _status.enemyCount.innerHTML = `杀敌: ${get.cnNumber(_status.enemyDied.length, true)}`;
          }
          const list = this.side === me.side ? _status.friend : _status.enemy;
          if (list.length === 0 && lib.storage.noreplace_end || lib.storage.zhu && lib.storage.main_zhu && this.identity === "zhu" && game.players.length > 2) {
            if (game.friend.includes(this)) {
              game.over(false);
            } else {
              game.over(true);
            }
          } else if (game.friend.length === 1 && this === game.friend[0] && _status.friend.length === 0) {
            game.over(false);
          } else if (game.enemy.length === 1 && this === game.enemy[0] && _status.enemy.length === 0) {
            game.over(true);
          } else {
            game.replacePlayer(this);
          }
        }
      }
    }
  },
  get: {
    rawAttitude: (from, to) => {
      if (from.side === to.side) {
        if (to.identity === "zhu") {
          if (_status.connectMode) {
            if (_status.mode === "4v4" || _status.mode === "guandu") {
              return 7;
            }
          } else {
            if (lib.storage.main_zhu || _status.mode === "four" || _status.mode === "guandu") {
              return 7;
            }
          }
        }
        return 6;
      } else {
        if (_status.mode === "siguo") {
          const list = ["wei", "shu", "wu", "qun"];
          const map = { wei: 0, shu: 0, wu: 0, qun: 0 };
          const map2 = { wei: 0, shu: 0, wu: 0, qun: 0 };
          for (const current of game.players) {
            map[current.side] += get.condition(current) * get.threaten(current, false, false);
            map2[current.side] += current.storage.longchuanzhibao;
          }
          let allin = false;
          for (const i in map) {
            if (get.population(i) === 1) {
              map[i] /= 1.5;
            }
            if (map2[i] >= 4) {
              allin = i;
              break;
            } else if (map2[i] === 3) {
              map[i] += 10;
            } else if (map2[i] === 2) {
              map[i]++;
            }
          }
          if (allin) {
            return to.side === allin ? -20 : 0;
          }
          list.sort((a, b) => map[b] - map[a]);
          const id1 = list.indexOf(from.side);
          const id2 = list.indexOf(to.side);
          let att = -1;
          switch (id1) {
            case 0:
              att = _status.siguoai[id2 + 2];
              break;
            case 1:
              switch (id2) {
                case 0:
                  att = _status.siguoai[0];
                  break;
                case 2:
                  att = _status.siguoai[1];
                  break;
                case 3:
                  att = _status.siguoai[2];
                  break;
              }
              break;
            case 2:
              switch (id2) {
                case 0:
                  att = _status.siguoai[0];
                  break;
                case 1:
                  att = _status.siguoai[1];
                  break;
                case 3:
                  att = _status.siguoai[2];
                  break;
              }
              break;
            case 3: {
              if (id2 === 0) {
                att = _status.siguoai[1];
                break;
              } else {
                att = _status.siguoai[2];
                break;
              }
            }
          }
          if (map2[to.side] >= 4) {
            att -= 10;
          } else if (map2[to.side] === 3) {
            att -= 3;
          } else if (map2[to.side] === 2) {
            att -= 0.5;
          }
          if (to.storage.longchuanzhibao) {
            return att * 1.2;
          }
          return att;
        } else {
          if (to.identity === "zhu") {
            if (_status.connectMode) {
              if (_status.mode === "4v4" || _status.mode === "guandu") {
                return -10;
              }
            } else {
              if (lib.storage.main_zhu || _status.mode === "four" || _status.mode === "guandu") {
                return -10;
              }
            }
          }
          return -6;
        }
      }
    }
  },
  help: {
    对决模式: `<div style="margin:10px">同舟共济（四国）</div><ul style="margin-top:0"><li>游戏开始时，每个势力的随机一名角色得到一个龙船至宝，1号位角色所在的势力额外获得一个龙船至宝，场上共5枚龙船至宝。龙船至宝是一个特殊标记。<li>争夺龙船至宝的方式：当敌人受到了你造成的伤害后，若其有龙船至宝，则你获得其一个龙船至宝。若你杀死了该敌人，则你获得其所有的龙船至宝。<li>获得龙船至宝时的摸牌：除游戏开始时外，若你从非队友处获得了龙船至宝，则你和队友各摸X张牌。（X为该次获得的龙船至宝数；获得队友的龙船至宝不摸牌）<li>无来源死亡时：当一名角色死亡时，若没有伤害来源，则其持有的所有龙船至宝交给场上龙船至宝数唯一最多的角色，若没有则随机分配，获得龙船至宝的角色和其队友各摸X张牌。<li>杀死队友时：当你杀死队友时，则将你和队友持有的所有龙船至宝交给场上龙船至宝数唯一最多的敌人，若没有则随机分配，获得龙船至宝的角色和其队友各摸X张牌。<li>胜利条件：满足一下任意条件游戏结束：（1）在新的一轮开始时，若你的势力获得的龙船至宝至少为4个，则你和队友获胜；（2）消灭所有敌人。</ul><div style="margin:10px">2v2 替补模式</div><ul style="margin-top:0"><li>选将时额外选择一名替补武将，阵亡时使用自己的替补武将上场，无替补时改为用队友的替补武将，两人均无替补时游戏结束<li>杀死敌方武将摸三张牌，杀死友方武将弃置所有牌</ul><div style="margin:10px">4v4</div><ul style="margin-top:0"><li>双方各有一名主公和三名忠臣，杀死对方主公获胜<li>8号位游戏开始时额外摸一张牌，7、8号位可在游戏开始时置换一次手牌<li>杀死对方忠臣摸2+x张牌，x为对方（含刚被杀的忠臣）与己方的存活人数之差；主公杀死己方忠臣须弃置所有牌`
  }
};
export {
  versus as default,
  type
};
