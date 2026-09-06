import { lib, _status, get, game, ui } from "noname";
const characters = {
  dc_feiyi: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["dcqiansu", "dcxingbang", "dcfanhuo"]
  },
  yue_caozhi: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["dcfuyue", "dcwenlan"]
  },
  dc_muludawang: {
    sex: "male",
    group: "qun",
    hp: 5,
    skills: ["dczhoufa", "dcshouqun"],
    names: "null|null"
  },
  dc_zhangshiping: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcbinji", "dczangmao"]
  },
  dc_weifeng: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["dchuozhong", "dczhuguo"]
  },
  mamiao: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["dczhangguan", "dccongfeng"],
    groupBorder: "wei"
  },
  jimiaojimu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dczouyi", "dcyanxi"],
    names: "吉|邈-吉|穆"
  },
  dc_zhugejun: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["dcgengdu", "dcgumai"]
  },
  dc_xiangchong: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["dcguying", "dcmuzhen"]
  },
  dc_xiahouxuan: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["dcboxuan", "dcyizheng", "dcguilin"],
    names: "夏侯|玄"
  },
  houcheng: {
    sex: "male",
    group: "qun",
    hp: 5,
    skills: ["dcxianniang"]
  },
  dc_zhangyì: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["dcmurui", "dcaoren"]
  },
  panghong: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["dcpingzhi", "dcgangjian"]
  },
  yue_zhouyu: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["dcguyin", "dcpinglu"]
  },
  yue_diaochan: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["dctanban", "dcdiou"],
    names: "null|null"
  },
  dc_huangwudie: {
    sex: "female",
    group: "shu",
    hp: 4,
    skills: ["dcshuangrui", "dcfuxie"]
  },
  dc_mateng: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["mashu", "dcxiongyi"],
    dieAudios: ["mateng"]
  },
  dc_sp_zhurong: {
    sex: "female",
    group: "qun",
    hp: 4,
    skills: ["dcremanhou", "dcretanluan"],
    names: "null|null"
  },
  yue_zhugeguo: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["dcxidi", "dcchengyan"],
    names: "诸葛|果",
    clans: ["琅琊诸葛氏"]
  },
  yue_zoushi: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["dcyunzheng", "dchuoxin"],
    names: "邹|null"
  },
  yue_miheng: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcjigu", "dcsirui"]
  },
  dc_lifeng: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["dctunchu", "dcshuliang"]
  },
  wupu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcduanti", "dcshicao"]
  },
  zangba: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["rehengjiang"]
  },
  gongsunxiu: {
    sex: "male",
    group: "qun",
    hp: 5,
    skills: ["dcgangu", "dckuizhen"],
    names: "公孙|修"
  },
  dc_liuli: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["dcfuli", "dcdehua"]
  },
  yue_daqiao: {
    sex: "female",
    group: "wu",
    hp: 4,
    skills: ["dcqiqin", "dczixi"],
    names: "桥|null"
  },
  dc_kongrong: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dckrmingshi", "lirang"],
    dieAudios: ["kongrong"]
  },
  dc_sp_menghuo: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcmanwang"],
    dieAudios: ["sp_menghuo"]
  },
  yue_xiaoqiao: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["dcqiqin", "dcweiwan"],
    names: "桥|null"
  },
  dc_dongzhao: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["dcyijia", "dcdingji"]
  },
  kuaiqi: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["dcliangxiu", "dcxunjie"]
  },
  yue_caiyong: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcjiaowei", "dcfeibai"]
  },
  pangshanmin: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["dccaisi", "dczhuoli"]
  },
  dc_jiachong: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["dcbeini", "dcshizong"],
    groupBorder: "jin"
  },
  dc_sunchen: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["dczigu", "dczuowei"]
  },
  dc_zhangmancheng: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dclvecheng", "dczhongji"]
  },
  yue_zhoufei: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["dclingkong", "dcxianshu"],
    names: "周|null"
  },
  dc_wuban: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["dcyouzhan"],
    clans: ["陈留吴氏"]
  },
  yue_caiwenji: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["dcshuangjia", "dcbeifen"]
  },
  liuchongluojun: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcminze", "dcjini"],
    names: "刘|宠-骆|俊"
  },
  yuechen: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["dcporui", "dcgonghu"]
  },
  zhangkai: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcxiangshu"]
  },
  gaoxiang: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["dcchiying"]
  },
  yuanyin: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcmoshou", "dcyunjiu"]
  },
  dongwan: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["dcshengdu", "dcjieling"]
  },
  zhangchu: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["dcjizhong", "dcrihui", "dcguangshi"]
  },
  peiyuanshao: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcmoyu"]
  },
  mengjie: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcyinlu", "dcyouqi"]
  },
  dc_huojun: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["dcgue", "dcsigong"]
  },
  dc_sunhanhua: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["dchuiling", "dcchongxu"]
  },
  dc_sunziliufang: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["dcqinshen", "dcweidang"],
    names: "孙|资-刘|放"
  },
  yuantanyuanxiyuanshang: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcneifa"],
    names: "袁|谭-袁|尚-袁|熙"
  },
  qiaorui: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcaishou", "dcsaowei"]
  },
  xianglang: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["dckanji", "dcqianzheng"]
  },
  qinlang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["dchaochong", "dcjinjin"]
  },
  furongfuqian: {
    sex: "male",
    group: "shu",
    hp: 4,
    maxHp: 6,
    skills: ["dcxuewei", "dcyuguan"],
    names: "傅|肜-傅|佥"
  },
  zhenghun: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["dcqiangzhi", "dcpitian"]
  },
  dc_zhaotongzhaoguang: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["yizan_use", "dcqingren", "dclongyuan"],
    dieAudios: ["zhaotongzhaoguang"],
    names: "赵|统-赵|广"
  },
  dc_huanghao: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["dcqinqing", "huisheng", "dccunwei"]
  },
  liupi: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcjuying"]
  },
  dc_sp_jiaxu: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["zhenlue", "dcjianshu", "dcyongdi"],
    dieAudios: ["sp_jiaxu"]
  },
  leibo: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcsilve", "dcshuaijie"]
  },
  gongsundu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dczhenze", "dcanliao"],
    names: "公孙|度"
  },
  panghui: {
    sex: "male",
    group: "wei",
    hp: 5,
    skills: ["dcyiyong", "dcsuchou"]
  },
  dc_yuejiu: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dccuijin"]
  },
  chenjiao: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["dcxieshou", "dcqingyan", "dcqizi"]
  },
  wanglie: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcchongwang", "dchuagui"]
  },
  chengui: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcyingtu", "dccongshi"]
  },
  dc_huangquan: {
    sex: "male",
    group: "shu",
    hp: 4,
    skills: ["dcquanjian", "dctujue"]
  },
  yinfuren: {
    sex: "female",
    group: "wei",
    hp: 3,
    skills: ["dcyingyu", "dcyongbi"],
    names: "尹|null"
  },
  dc_lvkuanglvxiang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["dcshuhe", "dcliehou"],
    names: "吕|旷-吕|翔"
  },
  guanhai: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["suoliang", "qinbao"]
  },
  huzhao: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["midu", "xianwang"]
  },
  dc_liuba: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["dczhubi", "dcliuzhuan"]
  },
  zhangxun: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["suizheng"]
  },
  zongyu: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["zyqiao", "chengshang"]
  },
  dc_jiling: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["dcshuangren"],
    dieAudios: ["jiling"]
  },
  dc_yanghu: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["dcdeshao", "dcmingfa"],
    groupBorder: "jin"
  },
  caimaozhangyun: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["lianzhou", "jinglan"],
    names: "蔡|瑁-张|允"
  },
  tenggongzhu: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["xingchong", "liunian"],
    names: "孙|null"
  },
  dc_huangchengyan: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["dcjiezhen", "dczecai", "dcyinshi"]
  },
  dc_gaolan: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xizhen"]
  },
  guanning: {
    sex: "male",
    group: "qun",
    hp: 3,
    maxHp: 7,
    skills: ["dunshi"]
  },
  dc_jiben: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["xunli", "zhishi", "lieyi"]
  },
  mamidi: {
    sex: "male",
    group: "qun",
    hp: 4,
    maxHp: 6,
    skills: ["bingjie", "zhengding"]
  },
  re_dengzhi: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["jianliang", "weimeng"]
  },
  fengxi: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["yusui", "boyan"]
  },
  re_miheng: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["rekuangcai", "reshejian"]
  },
  re_chendeng: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["refuyuan", "reyingshui", "rewangzu"]
  },
  wanniangongzhu: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["zhenge", "xinghan"],
    names: "刘|null"
  },
  re_xunchen: {
    sex: "male",
    group: "qun",
    hp: 3,
    skills: ["refenglve", "anyong"],
    clans: ["颍川荀氏"]
  },
  re_kanze: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["xiashu", "rekuanshi"],
    dieAudios: ["kanze"]
  },
  lvlingqi: {
    sex: "female",
    group: "qun",
    hp: 4,
    skills: ["guowu", "zhuangrong"]
  },
  zhanghu: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["cuijian", "zhtongyuan"]
  },
  luyusheng: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["zhente", "zhiwei"],
    clans: ["吴郡陆氏"]
  },
  huaxin: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["spwanggui", "xibing"]
  },
  mengyou: {
    sex: "male",
    group: "qun",
    hp: 5,
    skills: ["manyi", "dcmanzhi"]
  },
  liuyong: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["zhuning", "fengxiang"]
  },
  dc_sunru: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["xiecui", "youxu"]
  },
  xiahoulingnv: {
    sex: "female",
    group: "wei",
    hp: 4,
    skills: ["fuping", "weilie"],
    names: "夏侯|令女"
  },
  zhangyao: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["yuanyu", "xiyan"]
  },
  tengyin: {
    sex: "male",
    group: "wu",
    hp: 3,
    skills: ["chenjian", "xixiu"]
  },
  zhangxuan: {
    sex: "female",
    group: "wu",
    hp: 4,
    skills: ["tongli", "shezang"]
  },
  wangtao: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["huguan", "yaopei"]
  },
  wangyue: {
    sex: "female",
    group: "shu",
    hp: 3,
    skills: ["huguan", "mingluan"]
  },
  zhaoyan: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["jinhui", "qingman"]
  },
  heyan: {
    sex: "male",
    group: "wei",
    hp: 3,
    skills: ["yachai", "qingtan"]
  },
  re_sunluyu: {
    sex: "female",
    group: "wu",
    hp: 3,
    skills: ["remeibu", "remumu"],
    dieAudios: ["sunluyu"]
  },
  re_dongbai: {
    sex: "female",
    group: "qun",
    hp: 3,
    skills: ["relianzhu", "rexiahui"],
    dieAudios: ["dongbai"]
  },
  zhoushan: {
    sex: "male",
    group: "wu",
    hp: 4,
    skills: ["dcmiyun", "dcdanying"]
  },
  dc_caiyang: {
    sex: "male",
    group: "wei",
    hp: 4,
    skills: ["dcxunji", "dcjiaofeng"]
  },
  xiahoujie: {
    sex: "male",
    group: "wei",
    hp: 5,
    skills: ["liedan", "zhuangdan"],
    names: "夏侯|杰"
  },
  caoxing: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["cxliushi", "zhanwan"]
  },
  re_chunyuqiong: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["recangchu", "reliangying", "reshishou"],
    names: "淳于|琼"
  },
  xingdaorong: {
    sex: "male",
    group: "qun",
    hp: 4,
    maxHp: 6,
    skills: ["xuxie"]
  },
  dc_xiahouen: {
    sex: "male",
    group: "wei",
    hp: 5,
    skills: ["chijian", "shiwu"],
    names: "夏侯|恩"
  },
  re_panfeng: {
    sex: "male",
    group: "qun",
    hp: 4,
    skills: ["xinkuangfu"]
  },
  jiangfei: {
    sex: "male",
    group: "shu",
    hp: 3,
    skills: ["reshengxi", "dcshoucheng"],
    names: "蒋|琬-费|祎"
  }
};
const cards = {};
const pinyins = {};
const skills = {
  //新杀费祎
  dcqiansu: {
    audio: 2,
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      return player != event.player && event.player.countCards("h") > player.countCards("h");
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const result = await player.draw({ num: 3 }).forResult();
      const target = trigger.player;
      if (result?.cards?.length) {
        const cards2 = result.cards.filter((card) => player.getCards("h").includes(card));
        if (!cards2?.length) {
          return;
        }
        await player.chooseToGive({
          target,
          position: "h",
          forced: true,
          filterCard(card) {
            return get.event().cards.includes(card);
          },
          cards: cards2
        });
      }
    }
  },
  dcxingbang: {
    audio: 2,
    enable: "phaseUse",
    usable(skill, player) {
      return player.hasSkill("dcfanhuo_mark") ? 3 : 1;
    },
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const target = event.targets[0];
      await player.draw();
      if (!target?.isIn() || !player.hasGainableCards(target, "he")) {
        return;
      }
      let result;
      result = await player.chooseToGive({ forced: true, position: "he", target }).forResult();
      if (result?.bool && result.cards?.length) {
        const card = result.cards[0];
        for (let i = 0; i < 3; i++) {
          if (!target?.isIn() || !target.hasGainableCards(player, "h")) {
            return;
          }
          result = await player.gainPlayerCard({ target, forced: true, position: "h" }).forResult();
          if (result?.bool && result.links?.length) {
            const cardx = result.links[0];
            const sha = get.autoViewAs({ name: "sha", isCard: true }, "unsure");
            if (card == cardx) {
              if (player.canUse(sha, target, false, false)) {
                await player.useCard({ card: sha, targets: [target], addCount: false });
                return;
              }
            }
          }
        }
      }
    },
    ai: {
      order: 5,
      result: {
        player: 1,
        target: -1
      }
    }
  },
  dcfanhuo: {
    audio: 2,
    enable: "phaseUse",
    manualConfirm: true,
    limited: true,
    skillAnimation: true,
    animationColor: "wood",
    filter(event, player) {
      return player.hasSkill("dcxingbang", null, false, false);
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      player.addTempSkill(event.name + "_mark");
    },
    subSkill: {
      mark: {
        mark: true,
        charlotte: true,
        intro: {
          content: "本回合兴邦改为出牌阶段限三次，然后此回合结束时你失去3点体力"
        },
        forced: true,
        trigger: { global: "phaseEnd" },
        async content(event, trigger, player) {
          await player.loseHp(3);
        }
      }
    },
    ai: {
      combo: "dcxingbang",
      order: 13,
      result: {
        player(player) {
          if (!player.hasSkill("dcxingbang") || (player.getStat().skill?.dcxingbang ?? 0) >= 3) return 0;
          if (player.hp + player.countCards("hs", (card) => player.canSaveCard(card, player)) < 3) return 0;
          return !player.hasUnknown() && game.hasPlayer((target) => target !== player && get.effect(target, "dcxingbang", player, player) > 0) ? 1 : -1;
        }
      }
    }
  },
  //乐曹植
  dcfuyue: {
    mod: {
      ignoredHandcard(card, player) {
        if (get.info("dcfuyue").hasFuyueTag(card)) {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name === "phaseDiscard" && get.info("dcfuyue").hasFuyueTag(card)) {
          return false;
        }
      }
    },
    audio: 2,
    hiddenCard(player, name) {
      return player.hasCards("hs", (card) => card.hasGaintag(`eternal_dcfuyue_${name}`));
    },
    enable: ["chooseToUse"],
    filter(event, player) {
      return player.hasCards("hs", (card) => {
        const name = get.info("dcfuyue").getFuyueName(card);
        if (!name) {
          return false;
        }
        const vcard = get.autoViewAs({ name }, "unsure");
        return event.filterCard(vcard, player, event);
      });
    },
    viewAs(cards2, player) {
      if (cards2.length) {
        var name = get.info("dcfuyue").getFuyueName(cards2[0]), nature = null;
        if (name) {
          return { name, nature };
        }
      }
      return null;
    },
    prompt(event, player) {
      return `将“赋”牌当该牌所拥有的任意一种牌名使用`;
    },
    position: "hs",
    filterCard(card, player, event) {
      event = event || _status.event;
      const filter = event._backup.filterCard;
      const name = get.info("dcfuyue").getFuyueName(card);
      if (!name) {
        return false;
      }
      return filter(get.autoViewAs({ name }, "unsure"), player, event);
    },
    check(card) {
      const player = get.player(), name = get.info("dcfuyue").getFuyueName(card);
      if (!name) {
        return 0;
      }
      if (_status.event.type != "phase") {
        return 1;
      }
      return player.getUseValue({ name }) + 0.1;
    },
    getFuyueName(card) {
      const skill = `eternal_dcfuyue_`;
      let tag = card.gaintag?.find((tag2) => tag2.startsWith(skill));
      if (tag) {
        return tag.slice(skill.length);
      }
      return null;
    },
    hasFuyueTag(card) {
      return card.gaintag?.some((tag) => tag.startsWith(`eternal_dcfuyue_`));
    },
    markAsFu(card, player) {
      const name = lib.inpile.filter((name2) => get.type(name2) != "equip" && card.name != name2).randomGet();
      const skill = `eternal_dcfuyue_`;
      let tag = card.gaintag?.find((tag2) => tag2.startsWith(skill));
      if (tag) {
        player.removeGaintag(tag, card);
      }
      if (name) {
        tag = `${skill}${name}`;
        game.addTempTag(`dcfuyue_${name}`, `赋(${get.translation(name)})`);
        player.addGaintag(card, tag);
      }
    },
    group: ["dcfuyue_start"],
    subSkill: {
      start: {
        audio: "dcfuyue",
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        filter(event, player) {
          return event.name !== "phase" || game.phaseNumber === 0;
        },
        forced: true,
        locked: true,
        async content(event, trigger, player) {
          const { markAsFu, hasFuyueTag } = get.info("dcfuyue");
          const cards2 = player.getCards("h").filter((card) => !hasFuyueTag(card));
          cards2.forEach((card) => {
            markAsFu(card, player);
          });
        }
      }
    },
    ai: {
      threaten: 1.5,
      order: 11,
      result: { player: 1 },
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag) {
        const fuCards = player.getCards("hs", (card) => get.info("dcfuyue").hasFuyueTag(card));
        let name;
        if (tag === "respondSha") {
          name = "sha";
        } else if (tag === "respondShan") {
          name = "shan";
        } else {
          return false;
        }
        return fuCards.some((card) => get.info("dcfuyue").getFuyueName(card) === name);
      }
    }
  },
  dcwenlan: {
    init(player, skill) {
      player.addSkill(skill + "_mark");
    },
    onremove(player, skill) {
      player.removeSkill(skill + "_mark");
    },
    audio: 2,
    trigger: { player: ["useCardAfter", "respondAfter"] },
    filter(event, player) {
      const evts = game.getAllGlobalHistory("everything", (evt) => ["useCard", "respond"].includes(evt.name) && evt.player == player && get.type(evt.card) != "delay", event);
      if (evts.length < 2) {
        return false;
      }
      if (evts.indexOf(event) % 2 !== 1) {
        return false;
      }
      const { isFuyueCard, getNames } = get.info("dcwenlan");
      const bool1 = isFuyueCard(event, player);
      const lastEvt = evts.at(-2);
      const bool2 = isFuyueCard(lastEvt, player);
      const names1 = getNames(event, player);
      const names2 = getNames(lastEvt, player);
      return bool1 && bool2 && names1.containsSome(...names2) || player.hasCards("h");
    },
    forced: true,
    locked: false,
    async content(event, trigger, player) {
      const evts = game.getAllGlobalHistory("everything", (evt) => ["useCard", "respond"].includes(evt.name) && evt.player == player && get.type(evt.card) != "delay", trigger);
      const { markAsFu } = get.info("dcfuyue");
      const { isFuyueCard, getNames } = get.info(event.name);
      const bool1 = isFuyueCard(trigger, player);
      const lastEvt = evts.at(-2);
      const bool2 = isFuyueCard(lastEvt, player);
      const names1 = getNames(trigger, player);
      const names2 = getNames(lastEvt, player);
      if (bool1 && bool2 && names1.containsSome(...names2)) {
        const num = names1.length + names2.length;
        const cards2 = [];
        const names = [];
        for (let i = 0; i < num; i++) {
          const card = get.cardPile2((cardx) => {
            return !cards2.includes(cardx) && !names.includes(cardx.name) && (names1.includes(cardx.name) || names2.includes(cardx.name));
          });
          if (card) {
            cards2.push(card);
            names.push(card.name);
          } else {
            continue;
          }
        }
        if (cards2.length > 0) {
          await player.gain({
            cards: cards2,
            animate: "draw"
          });
          player.getCards("h", (card) => cards2.includes(card)).forEach((card) => markAsFu(card, player));
        }
      } else if (player.hasCards("h")) {
        const result = await player.chooseCard({
          prompt: `文澜：选择任意张手牌标记为“赋”或替换“赋”牌名`,
          position: "h",
          selectCard: [1, Infinity],
          allowChooseAll: true,
          forced: true
        }).set("ai", (card) => 5 - get.value(card)).forResult();
        if (result?.bool && result.cards?.length) {
          for (const card of result.cards) {
            markAsFu(card, player);
          }
        }
      }
    },
    ai: {
      combo: "dcfuyue",
      threaten: 1.2
    },
    getNames(event, player) {
      const skill = `eternal_dcfuyue_`;
      const evtx = player.getAllHistory(
        "lose",
        (evtx2) => evtx2.getParent() === event && Object.keys(evtx2.gaintag_map).some((i) => {
          return evtx2.gaintag_map[i].some((tag) => tag.startsWith(skill));
        })
      )?.[0];
      if (!evtx) {
        return [];
      }
      const list = Object.keys(evtx.gaintag_map).reduce((sum, i) => {
        const tag = evtx.gaintag_map[i].find((tag2) => tag2.startsWith(skill));
        if (tag) {
          sum.add(tag.slice(skill.length));
        }
        return sum;
      }, []);
      return list.addArray([event.card.name, event.cards[0].name]);
    },
    isFuyueCard(event, player) {
      const skill = `eternal_dcfuyue_`;
      return player.hasAllHistory(
        "lose",
        (evtx) => evtx.getParent() === event && event.cards.length == 1 && Object.keys(evtx.gaintag_map).some((i) => {
          return evtx.gaintag_map[i].some((tag) => tag.startsWith(skill));
        })
      );
    },
    subSkill: {
      mark: {
        charlotte: true,
        init(player, skill) {
          const evts = game.getAllGlobalHistory("everything", (evt) => ["useCard", "respond"].includes(evt.name) && evt.player == player && get.type(evt.card) != "delay");
          if (evts.length) {
            const evt = evts.at(-1);
            const { isFuyueCard, getNames } = get.info("dcwenlan");
            const bool = isFuyueCard(evt, player);
            const names = getNames(evt, player);
            player.setStorage(skill, { bool, names }, true);
          }
        },
        onremove(player, skill) {
          delete player.storage[skill];
          player.removeTip(skill);
        },
        trigger: { player: ["useCard1", "respond"] },
        forced: true,
        popup: false,
        firstDo: true,
        filter(event, player) {
          return get.type(event.card) != "delay";
        },
        async content(event, trigger, player) {
          const { isFuyueCard, getNames } = get.info("dcwenlan");
          const bool = isFuyueCard(trigger, player);
          const names = getNames(trigger, player);
          player.setStorage(event.name, { bool, names }, true);
          if (bool) {
            player.addTip(
              event.name,
              `${get.translation(event.name)} ${player.getStorage(event.name, { bool: false, names: [] }).names.map((name) => get.translation(name)).join("、")}`
            );
          } else {
            player.removeTip(event.name);
          }
        },
        intro: {
          content(storage = { bool: false, names: [] }, player) {
            if (storage?.bool) {
              return `<br><li>使用的上一张牌为“赋”<li>牌名：${storage.names.map((name) => get.translation(name)).join("、")}`;
            }
            return "寥落纸上数言";
          }
        }
      }
    }
  },
  //木鹿大王
  dczhoufa: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      if (!player.hasCards("hes", (card) => get.type(card) != "basic")) {
        return false;
      }
      const list = get.inpileVCardList(([type, _, name, nature]) => get.is.damageCard(get.autoViewAs({ name, nature }, "unsure")));
      return list.some(([type, _, name, nature]) => {
        const vcard = get.autoViewAs({ name, nature }, "unsure");
        return event.filterCard(vcard, player, event);
      });
    },
    chooseButton: {
      dialog(event, player) {
        const list = get.inpileVCardList(([type, _, name, nature]) => {
          let vcard = get.autoViewAs({ name, nature }, "unsure");
          if (!get.is.damageCard(vcard)) {
            return false;
          }
          return event.filterCard(vcard, player, event);
        });
        return ui.create.dialog("咒法", [list, "vcard"]);
      },
      check({ link: [type, _, name, nature] }) {
        return get.player().getUseValue(get.autoViewAs({ name, nature }, "unsure"));
      },
      backup(links, player) {
        return {
          audio: "dczhoufa",
          position: "hse",
          filterCard: (card) => get.type(card) != "basic",
          check(card) {
            return 8 - get.value(card);
          },
          viewAs: { name: links[0][2], nature: links[0][3], storage: { dczhoufa: true } },
          popname: true
        };
      },
      prompt(links, player) {
        return "将一张非基本牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
      }
    },
    group: "dczhoufa_thunder",
    subSkill: {
      thunder: {
        charlotte: true,
        trigger: {
          source: "damageBegin1"
        },
        filter(event, player) {
          return event.card?.storage?.dczhoufa && !event.hasNature("thunder");
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          game.setNature(trigger, "thunder");
        }
      },
      backup: {}
    },
    ai: {
      order: 1,
      result: {
        player: 1
      }
    }
  },
  dcshouqun: {
    init(player, skill) {
      player.setStorage(skill, player.maxHp, true);
    },
    onremove: true,
    derivation: "dcyuxiang",
    frequent: true,
    audio: 2,
    trigger: {
      player: "phaseDrawBegin1"
    },
    filter(event) {
      return !event.numFixed;
    },
    check(event, player) {
      return player.maxHp > 0;
    },
    async content(event, trigger, player) {
      trigger.changeToZero();
      const cards2 = get.cards(player.maxHp, true);
      await player.showCards(cards2, `${get.translation(player)}发动了【${get.translation(event.name)}】`, true).set("isFlash", false).set("clearArena", false).set("callback", async function(event2, trigger2, player2) {
        const list = event2.cards.filter((card) => {
          if (["equip3", "equip4", "equip3_4"].includes(get.subtype(card))) {
            return true;
          } else if (get.type2(card) == "trick") {
            return true;
          }
          return ["sha", "jiu"].includes(get.name(card));
        });
        const result = await player2.chooseControl({
          choiceList: [`获得其中的坐骑牌、锦囊牌、【杀】和【酒】，然后你体力上限+1（不能超过初始上限）`, `获得所有展示牌，然后直到你的下回合开始，你获得“驭象”且每次受到火焰伤害后，体力上限-1`],
          ai(event3, player3) {
            const { list: list2 } = get.event();
            if (player3.maxHp < 4) {
              return 0;
            }
            return 1;
          },
          list
        }).forResult();
        if (result?.control && result.control != "cancel2") {
          if (result.index == 0) {
            const next = player2.gain(list, "gain2");
            await next;
            const { cards: cards3 } = next;
            if (player2.maxHp < player2.getStorage("dcshouqun", 6)) {
              await player2.gainMaxHp();
            }
          } else {
            await player2.gain({ cards: event2.cards, animate: "gain2" });
            await player2.addTempSkills("dcyuxiang", { player: "phaseBegin" });
            player2.addTempSkill("dcshouqun_debuff", { player: "phaseBegin" });
          }
        }
        game.broadcastAll(ui.clear);
      });
    },
    subSkill: {
      debuff: {
        charlotte: true,
        audio: "dcshouqun",
        trigger: {
          player: "damageEnd"
        },
        filter(event, player) {
          return event.hasNature("fire");
        },
        forced: true,
        async content(event, trigger, player) {
          await player.loseMaxHp();
        },
        ai: {
          neg: true,
          effect: {
            target(card, player, target) {
              if (get.tag(card, "fireDamage")) {
                return [1, -2];
              }
            }
          }
        }
      }
    }
  },
  dcyuxiang: {
    mod: {
      globalFrom(from, to, distance) {
        return distance - 2;
      }
    },
    trigger: {
      player: "useCardToPlayered"
    },
    filter(event, player) {
      if (get.distance(player, event.target) > 2) {
        return false;
      }
      return event.card.name == "sha" && !event.directHit.includes(event.target);
    },
    forced: true,
    logTarget: "target",
    async content(event, trigger, player) {
      trigger.directHit.add(trigger.target);
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        return arg?.card?.name == "sha" && get.distance(player, arg.target) <= 2;
      }
    }
  },
  //魏讽
  dchuozhong: {
    audio: 2,
    enable: "phaseUse",
    usable: 2,
    filterCard: true,
    position: "h",
    check(card) {
      return 9 - get.value(card);
    },
    filter(event, player) {
      return player.hasCards("h") && game.hasPlayer((p) => p !== player && p.hasCards("he"));
    },
    filterTarget(card, player, target) {
      return player.inRange(target) && target !== player;
    },
    selectTarget: [1, Infinity],
    multiline: true,
    multitarget: true,
    lose: false,
    discard: false,
    delay: false,
    async content(event, trigger, player) {
      const {
        cards: [card],
        targets
      } = event;
      const type = get.type2(card);
      await player.showCards(card, `${get.translation(player)}发动了〖惑众〗`);
      await game.doAsyncInOrder(targets, async (target) => {
        if (!game.hasPlayer((target2) => target2.hasCards("he"))) {
          return;
        }
        const result = await target.chooseCardTarget({
          prompt: `惑众：选择一项：1.获得另一名其他角色的一张牌；2.交给${get.translation(player)}一张牌（不选择卡牌即视为进行获得牌操作）`,
          filterCard: true,
          position: "he",
          selectCard: [0, 1],
          complexSelect: true,
          filterTarget(card2, player2, target2) {
            if (target2 === player2) return false;
            if (!ui.selected.cards?.length) {
              if (target2 === get.event().sourcex) {
                return false;
              }
              return target2.hasCards("he");
            }
            return target2 === get.event().sourcex;
          },
          forced: true,
          type,
          sourcex: player,
          ai1(card2) {
            const player2 = get.player();
            if (player2.countCards("he") < 3) {
              return 0;
            }
            if (get.type2(card2) === get.event().type) {
              return 6.5 - get.value(card2);
            }
            return 5 - get.value(card2);
          },
          ai2(target2) {
            const player2 = get.player();
            let att = get.attitude(player2, target2);
            if (ui.selected.cards?.length) {
              if (att < 0 && target2 === get.event().sourcex) {
                return 0;
              }
              if (target2.hasSkillTag("nogain")) {
                att /= 9;
              }
              return 4 - att;
            }
            return -att;
          }
        }).forResult();
        if (result?.targets?.length) {
          const { cards: cards2, targets: targets2 } = result;
          target.line(targets2);
          if (!cards2?.length) {
            await target.gainPlayerCard({
              target: targets2[0],
              position: "he",
              forced: true
            });
          } else {
            await target.give(cards2, targets2[0]);
          }
        }
      });
      const otherPlayers = game.filterPlayer((p) => p !== player);
      let maxHandCount = -1;
      const playersToDiscard = [];
      for (const p of otherPlayers) {
        let handNum = p.countCards("h");
        if (handNum > maxHandCount) {
          maxHandCount = handNum;
          playersToDiscard.length = 1;
          playersToDiscard[0] = p;
        } else if (handNum === maxHandCount) {
          playersToDiscard.push(p);
        }
      }
      await game.doAsyncInOrder(playersToDiscard, async (target) => {
        await target.showHandcards();
        const hs = target.getCards("he", (card2) => get.type2(card2) === type);
        if (hs.length) {
          target.$throw(hs.length, 1e3);
          game.log(target, "将", `#y${get.cnNumber(hs.length)}张牌`, "置于牌堆顶");
          await target.lose({
            cards: hs,
            position: ui.cardPile,
            insert_card: true
          });
        }
      });
    },
    ai: {
      order: 9,
      result: {
        player: 1,
        target: -1
      }
    }
  },
  dczhuguo: {
    audio: 2,
    forced: true,
    trigger: {
      global: ["loseAfter", "loseAsyncAfter", "cardsGotoPileAfter"]
    },
    usable: 3,
    filter(event, player, name, target) {
      if (event.name === "cardsGotoPile") {
        return true;
      }
      if (event.name === "lose") {
        if (event.position === ui.cardPile && event.getlx !== false && event.cards2.length) {
          return true;
        }
      }
      return game.hasPlayer((target2) => {
        return target2.hasHistory("lose", (evt) => evt.getParent() === event && evt.position === ui.cardPile && evt.cards2?.length);
      });
    },
    async content(event, trigger, player) {
      await player.draw(2, "bottom");
    }
  },
  //张世平
  dcbinji: {
    audio: 2,
    trigger: { global: "roundStart" },
    filter(event, player) {
      return true;
    },
    check: () => true,
    async content(event, trigger, player) {
      await player.draw(3);
      if (!player.hasCards("he") || !game.hasPlayer((current) => current != player)) {
        return;
      }
      const result = await player.chooseCardTarget({
        prompt: `镔济：交给至多三名其他角色各一张牌`,
        filterTarget: lib.filter.notMe,
        selectTarget: [1, 3],
        filterCard: true,
        forced: true,
        selectCard: [1, 3],
        position: "he",
        complexSelect: true,
        targetprompt() {
          const links = ui.selected.cards;
          return ["获得", get.translation(links[ui.selected.targets.length - 1])].join("<br>");
        },
        filterOk() {
          return ui.selected.cards.length == ui.selected.targets.length;
        },
        ai1(card) {
          const player2 = get.player();
          const num = game.countPlayer((current) => current != player2 && get.attitude(player2, current) > 0);
          if (ui.selected.cards.length >= num) {
            return 0;
          }
          return 1 / Math.max(0.1, get.value(card));
        },
        ai2(target) {
          const player2 = get.player();
          if (ui.selected.targets.length >= ui.selected.cards.length) {
            return 0;
          }
          let att = get.attitude(player2, target);
          if (target.hasSkillTag("nogain")) {
            att /= 9;
          }
          return Math.max(4 + att, 1);
        }
      }).forResult();
      if (result?.bool) {
        const { cards: cards2, targets } = result;
        player.addSkill(`${event.name}_gain`);
        await game.loseAsync({
          gain_list: targets.map((target, i) => [target, cards2[i]]),
          giver: player,
          player,
          cards: cards2,
          gaintag: [event.name],
          animate: "giveAuto"
        }).setContent("gaincardMultiple");
      }
    },
    subSkill: {
      gain: {
        audio: "dcbinji",
        charlotte: true,
        forced: true,
        trigger: { global: ["loseAfter", "loseAsyncAfter", "addToExpansionAfter", "equipAfter", "addJudgeAfter", "gainAfter"] },
        getIndex(event, player) {
          return game.filterPlayer((target) => {
            const evt = event.getl?.(target);
            return evt?.hs?.length > 0 && Object.values(evt.gaintag_map).flat().includes("dcbinji");
          }).sortBySeat();
        },
        filter(event, player, name, target) {
          return true;
        },
        logTarget(event, player, name, target) {
          return target;
        },
        async content(event, trigger, player) {
          const {
            targets: [target]
          } = event;
          const card = get.cardPile((card2) => get.subtype(card2) == "equip1", void 0, "random");
          if (card) {
            await target.gain(card, "gain2");
          } else {
            target.chat("匹夫之勇，愚蠢之至！");
          }
          await player.draw();
        }
      }
    }
  },
  dczangmao: {
    audio: 2,
    enable: "phaseUse",
    usable: 3,
    map: {
      discard: ["弃置任意张方块牌，然后从牌堆或弃牌堆随机获得等量张坐骑牌", () => get.player().countDiscardableCards(get.player(), "he", { suit: "diamond" })],
      give: ["交给一名其他角色一张方块牌，然后获得其装备区一张坐骑牌", () => get.player().countCards("he", { suit: "diamond" })],
      equip: ["将一张坐骑牌置入一名其他角色装备区， 然后其交给你两张手牌", () => get.player().countCards("he", (card) => ["equip3", "equip4", "equip3_4"].includes(get.subtype(card)))]
    },
    chooseButton: {
      dialog(event, player) {
        const map = get.info("dczangmao").map;
        const keys = Object.keys(map);
        return ui.create.dialog("驵贸：请选择一项", [keys.map((key) => [key, map[key][0]]), "textbutton"], "hidden");
      },
      filter(button) {
        const map = get.info("dczangmao").map;
        return map[button.link][1]();
      },
      check(button) {
        return Math.random();
      },
      backup(links, player) {
        return {
          audio: "dczangmao",
          position: "he",
          ...links[0] == "discard" ? {} : { lose: false, discard: false, delay: false },
          check(card) {
            return 6 - get.value(card);
          },
          ...{
            discard: {
              filterCard(card, player2) {
                return get.suit(card) == "diamond" && lib.filter.cardDiscardable(card, player2, "dczangmao");
              },
              selectCard: [1, Infinity],
              async content(event, trigger, player2) {
                const { cards: cards2 } = event;
                const gain = [];
                while (gain.length < cards2.length) {
                  const card = get.cardPile((card2) => ["equip3", "equip4", "equip3_4"].includes(get.subtype(card2)) && !gain.includes(card2), void 0, "random");
                  if (card) {
                    gain.push(card);
                  } else {
                    break;
                  }
                }
                if (gain.length) {
                  await player2.gain(gain, "gain2");
                } else {
                  player2.chat("塞翁失马，焉知非福");
                }
              }
            },
            give: {
              filterCard: { suit: "diamond" },
              filterTarget: lib.filter.notMe,
              async content(event, trigger, player2) {
                const { cards: cards2, target } = event;
                await player2.give(cards2, target);
                if (target.countGainableCards(player2, "e", (card) => ["equip3", "equip4", "equip3_4"].includes(get.subtype(card)))) {
                  await player2.gainPlayerCard(target, "e", true).set("filterButton", (button) => ["equip3", "equip4", "equip3_4"].includes(get.subtype(button.link)));
                } else {
                  player2.chat("其真无马邪？");
                }
              },
              ai: {
                result: {
                  target: 1
                }
              }
            },
            equip: {
              filterCard(card, player2) {
                return ["equip3", "equip4", "equip3_4"].includes(get.subtype(card));
              },
              filterTarget(card, player2, target) {
                return target != player2 && target.canEquip(ui.selected.cards[0], true);
              },
              async content(event, trigger, player2) {
                const { cards: cards2, target } = event;
                player2.$giveAuto(cards2, target, false);
                await target.equip(cards2[0]);
                const cardsx = target.getGainableCards(player2, "h");
                if (cardsx?.length) {
                  await target.chooseToGive({
                    target: player2,
                    position: "h",
                    selectCard: 2,
                    forced: true
                  });
                } else {
                  player2.chat("其真不知马也！");
                }
              },
              ai: {
                result: {
                  target: -1
                }
              }
            }
          }[links[0]]
        };
      },
      prompt(links, player) {
        return `驵贸：${get.info("dczangmao").map[links[0]][0]}`;
      }
    },
    subSkill: {
      backup: {}
    },
    ai: {
      order: 6,
      result: {
        player: 1
      }
    }
  },
  //马邈
  dczhangguan: {
    audio: 2,
    trigger: {
      global: "phaseBegin"
    },
    async cost(event, trigger, player) {
      const num = player.countCards("h") - player.hp;
      if (num > 0) {
        event.result = await player.chooseToDiscard(get.prompt2(event.skill), "h", num).set("ai", (card) => {
          if (get.event().eff) {
            return 10 - get.value(card);
          }
          return 0;
        }).set(
          "eff",
          (() => {
            const target = _status.currentPhase;
            if (!target?.countGainableCards(player, "he")) {
              return false;
            }
            const eff = get.effect(target, { name: "shunshou_copy2" }, player, player);
            if (eff < 0 || get.attitude(player, target) > 0) {
              return false;
            }
            const bonos = player.hasSkill("dccongfeng") ? 3 : 6;
            return eff > Math.sqrt(num) * bonos;
          })()
        ).set("chooseonly", true).forResult();
      } else {
        event.result = await player.chooseBool(get.prompt2(event.skill)).forResult();
      }
    },
    async content(event, trigger, player) {
      const count = player.countCards("h");
      if (count < player.hp) {
        await player.drawTo(player.hp);
      }
      if (event.cards?.length) {
        await player.modedDiscard(event.cards);
      }
      const num = player.countCards("h") - count;
      if (num == 0) {
        await player.recover();
      }
      if (num < 0) {
        const target = _status.currentPhase;
        if (target?.isIn() && target.hasGainableCards(player, "he") && player != target) {
          await player.gainPlayerCard(target, "he", true);
        }
      }
    },
    subSkill: {
      effect: {
        trigger: {
          global: "useCard"
        },
        charlotte: true,
        filter(event, player) {
          if (event.player == player) {
            return false;
          }
          const evts = game.getGlobalHistory("useCard", (evt) => evt.player != player);
          return evts?.length > 0 && get.color(event.card) == get.color(evts[0].card);
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          trigger.directHit.add(player);
        }
      }
    }
  },
  dccongfeng: {
    audio: 2,
    trigger: {
      global: ["gainAfter", "loseAsyncAfter"]
    },
    getIndex(event, player) {
      if (!event.getl || !event.getg) {
        return [];
      }
      const list = [], gains = event.getg(player), loses = event.getl(player).cards2;
      game.filterPlayer((current) => {
        const gains2 = event.getg(current), loses2 = event.getl(current).cards2;
        if (current == player) {
          return false;
        }
        if (gains2.length && loses.length && gains2.containsSome(...loses)) {
          list.add([current, player]);
        }
        if (gains.length && loses2.length && loses2.containsSome(...gains)) {
          list.add([player, current]);
        }
        return true;
      });
      return list;
    },
    filter(event, player, name, list) {
      if (event.getParent().name == "dccongfeng") {
        return false;
      }
      const [gain, lose] = list;
      return lose.countGainableCards(gain, "he");
    },
    async cost(event, trigger, player) {
      const [gain, lose] = event.indexedData;
      event.result = await gain.chooseBool(get.prompt(event.skill, lose, gain), "随机获得其一张牌").set("choice", get.effect(lose, { name: "shunshou_copy2" }, gain, gain) > 0).forResult();
    },
    logTarget(event, player, name, list) {
      return list.find((current) => current != player);
    },
    async content(event, trigger, player) {
      const [gain, lose] = event.indexedData;
      const cards2 = lose.getGainableCards(gain, "he");
      if (cards2?.length) {
        await gain.gain(cards2.randomGets(1), "giveAuto");
      }
    }
  },
  //吉吉国王
  dczouyi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    selectTargetAI(event, player) {
      let cache = _status.event.getTempCache("dczouyi", "results");
      if (Array.isArray(cache)) {
        return cache;
      }
      let allPlayers = game.filterPlayer((current) => current != player), startNums = allPlayers.map((current) => current.countCards("h")), num = player.countCards("h");
      let draw = 0, discard = 0, all = 0;
      allPlayers.forEach((current, index) => {
        let countA = 1, countB = 1;
        for (let i = 0; i < startNums.length; i++) {
          let numx = startNums[i];
          if ((i != index || current.countCards("e")) && numx == num + 2 || i == index && num + 3 == numx) {
            countA++;
          }
          if (i != index && numx == num - 1 || i == index && num - 3 == numx) {
            countB++;
          }
        }
        allPlayers.forEach((current2, index2) => {
          let nums = startNums.slice(0), numx = num + 1, countC = 1;
          nums[index] -= 1;
          nums[index2] += 2;
          nums.forEach((value) => {
            if (value == numx) {
              countC++;
            }
          });
          if (countC > all) {
            all = countC;
          }
        });
        if (countA > draw) {
          draw = countA;
        }
        if (countB > discard) {
          discard = countB;
        }
      });
      event.putTempCache("dczouyi", "results", [draw, discard, all]);
      return [draw, discard, all];
    },
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog(`###诹议###${get.translation("dczouyi_info")}`, [
          [
            ["draw", "你摸两张牌并可弃置一名其他角色一张牌"],
            ["discard", "你弃置一张牌并可令一名其他角色摸两张牌"]
          ],
          "textbutton"
        ]);
      },
      filter(button, player) {
        if (button.link == "discard") {
          return player.countDiscardableCards(player, "he");
        }
        return true;
      },
      check(button) {
        const player = get.player(), results = get.info("dczouyi").selectTargetAI(get.event(), player);
        if (results.minBy((i) => i) == results[["draw", "discard"].indexOf(button.link)]) {
          return 0;
        }
        return 1;
      },
      select: [1, 2],
      backup(links, player) {
        return {
          audio: "dczouyi",
          links,
          async content(event, trigger, player2) {
            const { links: links2 } = get.info(event.name);
            if (links2.includes("draw")) {
              await player2.draw(2);
              if (game.hasPlayer((target) => target.countDiscardableCards(player2, "he") && target != player2)) {
                const result = await player2.chooseTarget(`诹议：弃置一名其他角色一张牌`, (card, player3, target) => {
                  return target.countDiscardableCards(player3, "he") && target != player3;
                }).set("ai", (target) => {
                  const { player: player3, readyToDiscard: bool } = get.event(), num2 = player3.countCards("h") - (bool ? 1 : 0), numx = target.countCards("h");
                  let eff = get.effect(target, { name: "guohe_copy2" }, player3, player3);
                  if (numx == num2 && target.countCards("e") || numx == num2 + 1) {
                    eff *= 3;
                  }
                  return eff;
                }).set("readyToDiscard", links2.includes("discard")).forResult();
                if (result?.targets?.length) {
                  const target = result.targets[0];
                  player2.line(target, "yellow");
                  await player2.discardPlayerCard(target, "he", true);
                }
              }
            }
            if (links2.includes("discard")) {
              await player2.chooseToDiscard("he", true);
              const result = await player2.chooseTarget(`诹议：令一名其他角色摸两张牌`, lib.filter.notMe).set("ai", (target) => {
                const player3 = get.player(), num2 = player3.countCards("h"), numx = target.countCards("h") + 2;
                let eff = get.effect(target, { name: "wuzhong" }, player3, player3);
                if (num2 == numx) {
                  eff *= 3;
                }
                return eff;
              }).forResult();
              if (result?.targets?.length) {
                const target = result.targets[0];
                player2.line(target, "green");
                await target.draw(2);
              }
            }
            const num = game.countPlayer((target) => target.countCards("h") == player2.countCards("h"));
            if (num <= 0) {
              return;
            }
            player2.addMark("dcyanxi", num, false);
            if (player2.isDamaged()) {
              await player2.recover(num);
            }
          }
        };
      },
      prompt(links, player) {
        const map = {
          draw: "你摸两张牌并可弃置一名其他角色一张牌",
          discard: "你弃置一张牌并可令一名其他角色摸两张牌"
        };
        return `###诹议：是否执行下列选项？###${links.map((type) => map[type]).join("<br>")}`;
      }
    },
    ai: {
      order(item, player) {
        if (!player) {
          return 1;
        }
        let results = lib.skill.dczouyi.selectTargetAI(get.event(), player);
        return results.maxBy((i) => i) * 3;
      },
      result: {
        player: 1
      }
    },
    subSkill: {
      backup: {}
    }
  },
  dcyanxi: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      const card = get.autoViewAs({ name: "sha", isCard: true, storage: { dcyanxi: true } });
      return event.player != player && player.countMark("dcyanxi") > 0 && player.canUse(card, event.player, false, false);
    },
    logTarget: "player",
    check(event, player) {
      const card = get.autoViewAs({ name: "sha", isCard: true, storage: { dcyanxi: true } });
      return get.effect(event.player, card, player, player) > 0;
    },
    async content(event, trigger, player) {
      const target = trigger.player, card = get.autoViewAs({ name: "sha", isCard: true, storage: { dcyanxi: true } });
      let isFirst = true;
      player.addTempSkill("dcyanxi_jueqing");
      while (player.countMark(event.name) > 0 && player.canUse(card, target, false, false) && target.isIn()) {
        if (isFirst) {
          isFirst = false;
        } else {
          player.logSkill(event.name, target);
        }
        player.removeMark(event.name, 1, false);
        await player.useCard(card, target, false);
      }
      player.removeSkill("dcyanxi_jueqing");
    },
    intro: {
      content: "还可以发动#次"
    },
    ai: {
      combo: "dczouyi"
    },
    subSkill: {
      jueqing: {
        trigger: {
          source: "damageBefore"
        },
        charlotte: true,
        filter(event, player) {
          return event.card?.storage?.dcyanxi;
        },
        direct: true,
        async content(event, trigger, player) {
          trigger.cancel();
          trigger.player.loseHp(trigger.num);
        },
        ai: {
          jueqing: true
        }
      }
    }
  },
  //新杀诸葛均
  dcgengdu: {
    audio: 2,
    trigger: {
      player: "phaseUseBegin"
    },
    frequent: true,
    async content(event, trigger, player) {
      const cards2 = get.cards(4);
      await game.cardsGotoOrdering(cards2);
      await player.showCards(cards2, `${get.translation(player)}发动了【耕读】`);
      const list = ["red", "black"];
      const result = await player.chooseControl(list).set("prompt", "耕读：选择一种颜色的牌获得").set(
        "choiceList",
        list.map((i) => {
          const colors = cards2.filter((card) => get.color(card) == i);
          return `${get.translation(i)}：${colors.length ? get.translation(colors) : "空气"}`;
        })
      ).set("ai", () => {
        return get.event().results;
      }).set(
        "results",
        (() => {
          let count = (color2) => cards2.filter((card) => get.color(card) == color2);
          let results = list.sort((a, b) => count(b) - count(a));
          return results[0];
        })()
      ).forResult();
      const color = result.control, gains = cards2.filter((card) => get.color(card) == color);
      if (gains?.length) {
        await player.gain(gains, "gain2");
      }
      if (["red", "black"].includes(color)) {
        player.addTempSkill(`dcgengdu_${color}`, "phaseChange");
        player.setStorage(`dcgengdu_${color}`, cards2.length - gains.length, true);
      }
    },
    subSkill: {
      red: {
        enable: "chooseToUse",
        charlotte: true,
        filter(event, player) {
          const list = event.dcgengduList;
          return list.length && player.countCards("hes", { color: "red" });
        },
        usable(skill, player) {
          return player.getStorage(skill, 0);
        },
        onChooseToUse(event) {
          if (game.online || event.dcgengduList) {
            return;
          }
          const player = event.player;
          let list = lib.inpile.filter((i) => {
            if (get.type(i) != "trick") {
              return false;
            }
            if (event && !event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
              return false;
            }
            return true;
          });
          game.checkGlobalHistory("useCard", (evt) => {
            if (list.includes(evt.card.name)) {
              list.remove(evt.card.name);
            }
          });
          event.set("dcgengduList", list);
        },
        chooseButton: {
          dialog(event, player) {
            const list = event.dcgengduList;
            return ui.create.dialog("耕读", [list, "vcard"]);
          },
          check(button) {
            if (get.event().getParent().type != "phase") {
              return 1;
            }
            return get.player().getUseValue({ name: button.link[2] });
          },
          prompt(links, player) {
            return "将一张红色牌当作【" + get.translation(links[0][2]) + "】使用";
          },
          backup(links, player) {
            return {
              audio: "dcgengdu",
              filterCard(card, player2) {
                return get.color(card) === "red";
              },
              popname: true,
              check(card) {
                return 6 - get.value(card);
              },
              position: "hes",
              viewAs: { name: links[0][2] }
            };
          }
        },
        hiddenCard(player, name) {
          const skill = "dcgengdu_red";
          const count = player.stat[player.stat.length - 1].skill[skill] || 0;
          if (count >= get.info(skill).usable(skill, player)) {
            return false;
          }
          return player.hasCard((card) => {
            if (_status.connectMode && get.position(card) === "h") {
              return true;
            }
            return get.color(card) === "red";
          }, "hes");
        },
        ai: {
          fireAttack: true,
          skillTagFilter(player) {
            if (!player.countCards("hse", { color: "red" })) {
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
        intro: {
          content: "本阶段限$次，你可以将一张红色牌当作本回合未被使用过的普通锦囊牌使用"
        },
        onremove: true
      },
      black: {
        audio: "dcgengdu",
        trigger: {
          player: "useCardAfter"
        },
        usable(skill, player) {
          return player.getStorage(skill, 0);
        },
        filter(event, player) {
          if (!player.getStorage("dcgengdu_black", 0)) {
            return false;
          }
          return get.color(event.card) == "black";
        },
        forced: true,
        locked: false,
        charlotte: true,
        async content(event, trigger, player) {
          const next = player.draw(2);
          next.gaintag.add("dcgengdu");
          await next;
          player.addTempSkill("dcgengdu_mark");
        },
        intro: {
          content: "本阶段限$次，你使用黑色牌后摸两张牌，这些牌本回合无法使用或打出且不计入手牌上限"
        },
        onremove: true
      },
      mark: {
        charlotte: true,
        locked: true,
        onremove(player) {
          player.removeGaintag("dcgengdu");
        },
        mod: {
          ignoredHandcard(card, player) {
            if (card.hasGaintag("dcgengdu")) {
              return true;
            }
          },
          cardDiscardable(card, player, name) {
            if (name == "phaseDiscard" && card.hasGaintag("dcgengdu")) {
              return false;
            }
          },
          cardEnabled(card, player) {
            if (card.cards?.some((i) => i.hasGaintag("dcgengdu"))) {
              return false;
            }
          },
          cardRespondable(card, player) {
            if (card.cards?.some((i) => i.hasGaintag("dcgengdu"))) {
              return false;
            }
          },
          cardSavable(card, player) {
            if (card.cards?.some((i) => i.hasGaintag("dcgengdu"))) {
              return false;
            }
          }
        }
      },
      red_backup: {}
    }
  },
  dcgumai: {
    audio: 2,
    trigger: {
      player: "damageBegin3",
      source: "damageBegin1"
    },
    round: 1,
    filter(event, player) {
      return player.countCards("h");
    },
    check(event, player, name) {
      const { card } = event;
      if (name == "damageBegin3") {
        const effect2 = get.damageEffect(player, event.source, player, event.nature);
        const canFilterDamage2 = player.hasSkillTag("filterDamage", null, {
          player: event.source,
          card: event.card
        });
        if (canFilterDamage2) return false;
        return effect2 < 0;
      }
      const effect = get.damageEffect(event.player, player, player, event.nature);
      const canFilterDamage = event.player.hasSkillTag("filterDamage", null, {
        player,
        card
      });
      if (canFilterDamage) return false;
      return effect > 0;
    },
    prompt2(event, player, name) {
      const target = event.player;
      const { source } = event;
      return `${player == target ? "你" : get.translation(target)}即将受到${source ? `来自${player == source ? "你" : get.translation(source)}` : "无来源"}的${event.num}点伤害，你可以展示所有手牌，令此伤害${name == "damageBegin1" ? "+" : "-"}1`;
    },
    async content(event, trigger, player) {
      const suit = get.suit(player.getCards("h")[0], player), bool = player.getCards("h").every((card) => get.suit(card, player) == suit);
      await player.showHandcards(`${get.translation(player)}发动了【孤脉】`);
      if (event.triggername == "damageBegin1") {
        trigger.num++;
        player.popup(" +1 ", "fire");
        game.log(player, "令此伤害+1");
      } else {
        trigger.num--;
        player.popup(" -1 ", "water");
        game.log(player, "令此伤害-1");
      }
      if (bool) {
        const result = await player.chooseToDiscard("h", "孤脉：你可以弃置一张手牌并重置【孤脉】").set("ai", (card) => {
          const { goon } = get.event();
          if (!goon) {
            return 0;
          }
          return 7 - get.value(card);
        }).set("goon", player.storage[`${event.name}_roundcount`]).forResult();
        if (result?.bool) {
          player.refreshSkill(event.name);
        }
      }
    }
  },
  //新杀向宠
  dcguying: {
    getNum(player) {
      const history = player.getAllHistory("useSkill", (evt) => evt.skill == "dcguying");
      let count = 1;
      for (let i = history.length - 1; i >= 0; i--) {
        const record = history[i];
        if (record["dcguying_mark"] === true) {
          count++;
        } else {
          break;
        }
      }
      return count;
    },
    init(player, skill) {
      const num = get.info(skill).getNum(player);
      player.setStorage(skill, num, true);
      player.addTip(skill, `${get.translation(skill)} ${player.getStorage(skill)}`);
    },
    onremove(player, skill) {
      delete player.storage[skill];
      player.removeTip(skill);
    },
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    async cost(event, trigger, player) {
      const num = get.info(event.skill).getNum(player);
      player.setStorage(event.skill, num, true);
      player.addTip(event.skill, `${get.translation(event.skill)} ${player.getStorage(event.skill)}`);
      event.result = await player.chooseTarget(get.prompt(event.skill), [1, num], `令至多${get.cnNumber(num)}名角色获得以下效果直到你的下个结束阶段开始前：下次受到伤害后，摸体力上限张牌（至多摸五张），然后将X张手牌交给你（X为其手牌数减体力上限）。若在此期间此效果未触发，你下次发动〖固营〗可以多选择一名角色。`).set("ai", (target) => get.attitude(get.player(), target) / target.hp).forResult();
    },
    async content(event, trigger, player) {
      const history = player.getAllHistory("useSkill", (evt) => evt.skill == event.name);
      if (history.length) {
        history[history.length - 1][event.name + "_mark"] = true;
      }
      const targets = event.targets, skill = event.name + "_effect";
      player.addTempSkill(skill, { player: "phaseJieshuBegin" });
      player.markAuto(skill, targets);
    },
    intro: { content: "当前【固营】角色数上限：#" },
    subSkill: {
      effect: {
        charlotte: true,
        onremove(player, skill) {
          delete player.storage[skill];
          lib.skill.dcguying.init(player, "dcguying");
        },
        marktext: "营",
        intro: { content: "$下次受到伤害后，摸体力上限张牌（至多摸五张），然后将超出体力上限的手牌交给你" },
        audio: "dcguying",
        trigger: { global: "damageEnd" },
        filter(event, player) {
          return event.num > 0 && player.getStorage("dcguying_effect").includes(event.player);
        },
        forced: true,
        logTarget: "player",
        async content(event, trigger, player) {
          const history = player.getAllHistory("useSkill", (evt) => evt.skill == "dcguying");
          if (history.length) {
            history[history.length - 1]["dcguying_mark"] = false;
          }
          lib.skill.dcguying.init(player, "dcguying");
          const target = trigger.player;
          player.unmarkAuto(event.name, target);
          if (!player.getStorage(event.name).length) {
            player.removeSkill(event.name);
          }
          await target.draw(Math.min(5, target.maxHp));
          const num = target.countCards("h") - target.maxHp;
          if (num > 0 && target != player) {
            await target.chooseToGive(`固营：将${get.cnNumber(num)}张手牌交给${get.translation(player)}`, player, num, true).set("ai", (card) => {
              return (get.event().goon > 0 ? 8 : 6) - get.value(card);
            }).set("goon", get.attitude(target, player));
          }
        }
      }
    }
  },
  dcmuzhen: {
    audio: 2,
    enable: "phaseUse",
    onChooseToUse(event) {
      if (game.online) {
        return;
      }
      const count = event.player.getHistory("useSkill", (evt) => evt.skill == "dcmuzhen" && evt.event.getParent("phaseUse") === event.getParent()).length + 1;
      event.set("dcmuzhen_count", count);
    },
    filter(event, player) {
      const types = player.getCards("he").map((card) => get.type2(card)).unique(), count = event.dcmuzhen_count;
      return types.length > 0 && types.some((type) => !player.getStorage("dcmuzhen_used").includes(type) && player.countCards("he", (card) => get.type2(card, player) == type) >= count);
    },
    filterTarget: lib.filter.notMe,
    filterCard(card, player) {
      const selected = ui.selected.cards, type = get.type2(card, player), bool = !player.getStorage("dcmuzhen_used").includes(type);
      if (!selected.length) {
        return bool;
      }
      return get.type2(selected[0], player) == type && bool;
    },
    selectCard() {
      const count = get.event().dcmuzhen_count;
      return count;
    },
    position: "he",
    complexCard: true,
    lose: false,
    discard: false,
    delay: false,
    async content(event, trigger, player) {
      const cards2 = event.cards, num = cards2.length, type = get.type2(cards2[0], player), target = event.targets[0], str = get.translation(target);
      player.addTempSkill(event.name + "_used", ["phaseChange", "phaseAfter"]);
      player.markAuto(event.name + "_used", type);
      await player.give(cards2, target);
      const list = [`令${str}弃置等量其他类型的牌`, `获得${str}场上等量的牌`, `令${str}展示牌堆顶等量的牌，并获得其中类型相同的牌`], controls = [1, 2, 3].map((num2) => "选项" + (num2 == 2 ? "二" : get.cnNumber(num2)));
      if (!target.countGainableCards(player, "ej")) {
        list[1] = `<span style="opacity:0.5; ">${list[1]}</span>`;
        controls.remove(controls[1]);
      }
      const result = await player.chooseControl(controls).set("choiceList", list).set("prompt", `睦阵：令${str}执行一项`).set("ai", () => {
      }).forResult();
      if (!result?.control) {
        return;
      }
      if (result.control == "选项一") {
        const resultx = await target.chooseToDiscard(`睦阵：请弃置${num}张类型不为${get.translation(type)}的牌`, "he", num, true, (card) => get.event().cardsx?.includes(card)).set(
          "cardsx",
          target.getCards("he", (card) => get.type2(card, target) != type)
        ).forResult();
        if (resultx?.cards?.length < num) {
          await target.showHandcards();
        }
      } else if (result.control == "选项二") {
        await player.gainPlayerCard(target, "ej", num, true);
      } else if (result.control == "选项三") {
        const cardsx = get.cards(num, true);
        await target.showCards(cardsx);
        const gain = cardsx.filter((card) => get.type(card, false) === type);
        if (gain.length) {
          await target.gain(gain, "gain2");
        }
      }
    },
    subSkill: {
      used: {
        onremove: true,
        charlotte: true,
        intro: {
          content: "已交出过<span class=thundertext>$</span>"
        }
      }
    }
  },
  //新杀夏侯玄
  dcboxuan: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter(event, player) {
      if (!event.targets?.length || !event.cards?.length) {
        return false;
      }
      if (!event.targets?.some((target) => target != player) && !player.storage.dcboxuan) {
        return false;
      }
      return player.hasHistory("lose", (evt) => {
        const evtx = evt.relatedEvent || evt.getParent();
        if (evtx != event) {
          return false;
        }
        return evt.getl(player)?.hs?.length;
      });
    },
    frequent: true,
    check: () => true,
    async content(event, trigger, player) {
      const cards2 = get.bottomCards(3, true);
      await player.showCards(cards2, `${get.translation(player)}发动了【博玄】`).set("log", (cards3, player2) => [player2, "展示了牌堆底的", cards3]);
      const list = ["cardNameLength", "suit", "type2"].map((attri) => cards2.some((card) => get[attri](trigger.card) == get[attri](card)));
      if (list[0]) {
        await player.draw();
      }
      if (list[1] && game.hasPlayer((target) => {
        return target.countDiscardableCards(player, "he") && target != player;
      })) {
        const result = await player.chooseTarget(`博玄：你可弃置一名其他角色一张牌`, (card, player2, target) => {
          return target.countDiscardableCards(player2, "he") && target != player2;
        }).set("ai", (target) => get.effect(target, { name: "guohe_copy2" }, get.player(), get.player())).forResult();
        if (result?.targets) {
          player.line(result.targets);
          await player.discardPlayerCard(result.targets[0], "he", true);
        }
      }
      if (list[2] && cards2.some((card) => player.hasUseTarget(card, true, true))) {
        const result = await player.chooseCardButton(`博玄：你可以使用一张展示牌`, cards2).set("filterButton", (button) => get.player().hasUseTarget(button.link, true, true)).set("ai", (button) => get.player().getUseValue(button.link)).forResult();
        if (result?.links) {
          const card = result.links[0];
          if (player.hasUseTarget(card, true, true)) {
            await player.chooseUseTarget(card);
          }
        }
      }
    }
  },
  dcboxuan_rewrite: {
    //空技能，博玄修改后
  },
  dcyizheng: {
    audio: 2,
    trigger: { player: ["phaseBegin"] },
    filter(event, player) {
      return player.hasCards("h") && game.hasPlayer((target) => {
        return target != player && target.hasCards("h");
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), [1, Infinity], (card, player2, target) => {
        return target != player2 && target.hasCards("h");
      }).set("ai", (target) => {
        if (player.hp == 1) {
          return 0;
        }
        return -get.attitude(get.player(), target);
      }).forResult();
    },
    async content(event, trigger, player) {
      const targets = [player].concat(event.targets).sortBySeat();
      let showEvent = player.chooseCardOL(targets, "议政：请选择要展示的牌", true).set("ai", function(card) {
        return -get.value(card);
      }).set("source", player);
      showEvent.aiCard = function(target) {
        const hs = target.getCards("h");
        return { bool: true, cards: [hs.randomGet()] };
      };
      showEvent._args.remove("glow_result");
      const result = await showEvent.forResult();
      const cards2 = [];
      for (var i = 0; i < targets.length; i++) {
        cards2.push(result[i].cards[0]);
      }
      await player.showCards(cards2, `${get.translation(player)} 发动了【${get.translation(event.name)}】`, false).set("multipleShow", true).set("customButton", (button) => {
        const target = get.owner(button.link);
        if (target) {
          button.node.gaintag.innerHTML = target.getName();
        }
      }).set("delay_time", targets.length * 1.5);
      if (cards2.map((card) => get.type2(card)).unique().length == 1) {
        player.popup("洗具");
        const result2 = await player.chooseTarget(true).set("createDialog", [`议政：令一名角色获得这些牌`, cards2]).set("ai", (target) => get.attitude(get.player(), target)).forResult();
        if (result2?.targets) {
          const target = result2.targets[0];
          player.line(target);
          let gainEvent = target.gain(cards2);
          gainEvent.set(
            "givers",
            targets.filter((i2) => i2 != target)
          );
          gainEvent.set("animate", function(event2) {
            const player2 = event2.player, cards3 = event2.cards, givers = event2.givers;
            for (let i2 = 0; i2 < givers.length; i2++) {
              givers[i2].$give(cards3[i2], player2);
            }
            return 500;
          });
          await gainEvent;
        }
      } else {
        player.popup("杯具");
        await game.loseAsync({
          lose_list: targets.map((target, index) => {
            return [target, [cards2[index]]];
          }),
          discarder: player
        }).setContent("discardMultiple");
      }
    }
  },
  dcguilin: {
    audio: 2,
    derivation: ["dcboxuan_rewrite"],
    limited: true,
    unique: true,
    skillAnimation: true,
    animationColor: "thunder",
    enable: "phaseUse",
    trigger: { player: "dying" },
    filter(event, player) {
      if (event.name == "dying") {
        return player.isDying();
      }
      return true;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.recoverTo(player.maxHp);
      await player.removeSkills("dcyizheng");
      if (player.hasSkill("dcboxuan", null, null, false)) {
        player.storage.dcboxuan = true;
      }
      game.log(player, "修改了", "#g【博玄】");
    },
    ai: {
      order: 10,
      result: {
        player: (player) => get.recoverEffect(player, player, player)
      }
    }
  },
  //侯成
  dcxianniang: {
    audio: 2,
    trigger: {
      player: ["loseAfter", "damageEnd"],
      global: "loseAsyncAfter"
    },
    filter(event, player) {
      if (player.getStorage("dcxianniang_used").includes(event.name === "damage" ? "damage" : "lose")) {
        return false;
      }
      if (!game.hasPlayer((current) => player.countCards("h") <= current.countCards("h") && current.hasCards(current == player ? "e" : "he"))) {
        return false;
      }
      if (event.name === "damage") {
        return true;
      }
      if (event.type !== "discard" || (event.discarder || event.getParent(2).player) === player) {
        return false;
      }
      return (event.getl?.(player)?.cards2 ?? []).length > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), (card, player2, target) => {
        return player2.countCards("h") <= target.countCards("h") && target.hasCards(target == player2 ? "e" : "he");
      }).set("ai", (target) => {
        let att = get.attitude(get.player(), target) * -1;
        if (target.getHp() < target.countCards("h")) {
          return att * 2;
        }
        return att;
      }).forResult();
    },
    async content(event, trigger, player) {
      player.addTempSkill(event.name + "_used", "roundStart");
      player.markAuto(event.name + "_used", trigger.name == "damage" ? "damage" : "lose");
      const {
        targets: [target]
      } = event;
      const tag = event.name + "_tag";
      const position = target != player ? "he" : "e";
      if (!target.hasGainableCards(player, position)) {
        return;
      }
      const next = player.gainPlayerCard(target, [1, 2], position, true);
      next.gaintag.add(tag);
      const { links } = await next.forResult();
      if (!links?.length) {
        return;
      }
      player.addSkill(tag);
      const num = links.length;
      const targetsx = game.filterPlayer((current) => current != player && current != target);
      if (player.countCards("h") && targetsx.length) {
        const { bool, cards: cards2, targets } = await player.chooseCardTarget({
          prompt: "献酿：你可将至多" + get.cnNumber(num) + "张牌交给另一名其他角色",
          filterCard: true,
          position: "he",
          selectCard: [1, num],
          filterTarget: (card, player2, target2) => get.event().targetsx.includes(target2),
          ai1(card) {
            if (card.name == "du") {
              return 10;
            }
            const player2 = get.player();
            if (!game.hasPlayer((current) => {
              return get.attitude(player2, current) > 0 && !current.hasSkillTag("nogain");
            })) {
              return 0;
            }
            return 1 / Math.max(0.1, get.value(card));
          },
          ai2(target2) {
            let player2 = get.player(), att = get.attitude(player2, target2);
            if (ui.selected.cards[0].name == "du") {
              return -att;
            }
            if (target2.hasSkillTag("nogain")) {
              att /= 6;
            }
            return att;
          },
          targetsx
        }).forResult();
        if (bool) {
          player.line(targets[0]);
          targets[0].addSkill(tag);
          const next2 = targets[0].gain(cards2, player, "giveAuto");
          next2.gaintag.add(tag);
          await next2;
        }
      }
      if (player.getRoundHistory("gain", (evt) => evt.getParent(2).name == event.name && evt.source != player).reduce((num2, evt) => num2 + evt.cards.length, 0) > 2) {
        await player.loseHp();
      }
    },
    subSkill: {
      tag: {
        charlotte: true,
        mod: {
          cardname(card) {
            const evt = get.event();
            if (evt.name !== "chooseToUse") {
              return;
            }
            if (get.type(card, null, false) == "basic" && card.hasGaintag("dcxianniang_tag")) {
              return "jiu";
            }
          },
          cardnature(card) {
            const evt = get.event();
            if (evt.name !== "chooseToUse") {
              return;
            }
            if (get.type(card, null, false) == "basic" && card.hasGaintag("dcxianniang_tag")) {
              return false;
            }
          }
        },
        ai: {
          save: true,
          skillTagFilter(player, tag, arg) {
            if (!player.countCards("h", (card) => {
              return get.type(card, null, false) == "basic" && card.hasGaintag("dcxianniang_tag");
            })) {
              return false;
            }
          }
        }
      },
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  //张翼
  dcmurui: {
    //direct打赢复活赛力
    audio: 2,
    trigger: {
      global: ["roundStart", "phaseAfter"],
      player: "phaseBegin"
    },
    filter(event, player, name) {
      if (player.getStorage("dcmurui_filter").includes(name)) {
        return false;
      }
      return name === "phaseAfter" && game.getGlobalHistory("everything", (evt) => evt.name == "die").length || ["phaseBegin", "roundStart"].includes(name);
    },
    direct: true,
    clearTime: true,
    async content(event, trigger, player) {
      let name = event.triggername;
      player.when({ player: ["useCardAfter", "dcmurui"] }, false).filter((evt, player2, namex) => {
        return namex === "dcmurui" || player2.getStorage("dcmurui").includes(evt.card) && ["sourceDamage", "damage"].some((type) => game.hasPlayer2((current) => current.hasHistory(type, (evtx) => evt.card === evtx.card)));
      }).assign({ firstDo: true }).step(async (event2, trigger2, player2) => {
        if (event2.triggername === "dcmurui") {
          return;
        }
        await player2.draw(2);
        player2.markAuto("dcmurui_filter", name);
        player2.markSkill("dcaoren");
      }).finish();
      await player.chooseToUse("使用一张牌，若造成伤害则不能再于此时用牌").set("oncard", () => {
        const event2 = get.event(), { card, player: player2 } = event2;
        player2.markAuto("dcmurui", [card]);
      }).set("addCount", false).set("logSkill", event.name).forResult();
      await event.trigger("dcmurui");
    }
  },
  dcaoren: {
    audio: 2,
    intro: {
      markcount: (_, player) => player.getStorage("dcmurui_filter").length - player.countMark("dcaoren_used"),
      content: (_, player) => "当前剩余发动次数：" + (player.getStorage("dcmurui_filter").length - player.countMark("dcaoren_used"))
    },
    trigger: {
      player: "useCardAfter"
    },
    filter: (event, player) => player.countMark("dcaoren_used") < player.getStorage("dcmurui_filter").length && get.type(event.card) === "basic" && event.cards.filterInD().length,
    async content(event, trigger, player) {
      await player.gain(trigger.cards.filterInD(), "gain2");
      player.addMark("dcaoren_used", 1, false);
      player.addTempSkill("dcaoren_used", "roundStart");
    },
    ai: {
      combo: "dcmurui"
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      }
    }
  },
  //庞宏
  dcpingzhi: {
    audio: 2,
    mark: true,
    zhuanhuanji: true,
    marktext: "☯",
    usable: 1,
    enable: "phaseUse",
    filterTarget(card, player, target) {
      return target.countCards("h");
    },
    intro: {
      content(storage) {
        return "转换技，出牌阶段限一次，你可观看一名角色的手牌并展示其中一张牌，" + (storage ? "然后其使用此牌，若此牌造成伤害" : "你弃置此牌，然后其视为对你使用一张【火攻】，若其未因此造成伤害") + "则此技能视为未发动过。";
      }
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.changeZhuanhuanji(event.name);
      const result = await player.choosePlayerCard(target, true, `请选择${get.translation(target)}一张手牌展示`, "visible", "h").set("ai", (button) => {
        const { player: player2, target: target2 } = get.event(), { link } = button;
        const att = get.attitude(player2, target2), storage = player2.storage.dcpingzhi, huogong = get.autoViewAs({ name: "huogong", isCard: true });
        if (att > 0) {
          return storage ? 6 - get.value(link) : player2.getUseValue(link);
        }
        return storage ? get.value(link) + get.effect(player2, huogong, target2, player2) < 0 && !player2.hasCard((card) => get.suit(card) == get.suit(link)) ? 2 : 0 : -target2.getUseValue(link);
      }).forResult();
      if (!result?.cards?.length) {
        return;
      }
      const { cards: cards2 } = result;
      player.addTempSkill(event.name + "_check", "phaseUseAfter");
      await player.showCards(cards2, `${get.translation(player)}对${get.translation(target)}发动了【评骘】`);
      if (player.storage[event.name]) {
        await target.modedDiscard(cards2, player);
        const huogong = get.autoViewAs({ name: "huogong", isCard: true });
        if (target.canUse(huogong, player, false)) {
          await target.useCard(huogong, player, false);
        } else if (player.getStat("skill")[event.name]) {
          delete player.getStat("skill")[event.name];
          game.log(player, "重置了", "#g【评骘】");
        }
      } else if (target.hasUseTarget(cards2[0])) {
        await target.chooseUseTarget(cards2[0], true, false);
      }
    },
    ai: {
      order(item, player) {
        const storage = player.storage.dcpingzhi;
        if (!storage) {
          return game.hasPlayer((current) => get.effect(current, { name: "guohe_copy2" }, player, player) + get.effect(player, { name: "huogong" }, current, player) > 0) ? 10 : 1;
        }
        return game.hasPlayer((current) => get.effect(current, { name: "guohe_copy2" }, player, player) > 0 || current.hasCard((card) => current.hasValueTarget(card) > 0, "h") && get.attitude(player, current) > 0) ? 10 : 1;
      },
      result: {
        target(player, target) {
          const storage = player.storage.dcpingzhi;
          if (!storage) {
            return !player.countCards("h") || get.effect(target, { name: "guohe_copy2" }, player, player) + get.effect(player, { name: "huogong" }, target, player) > 0 ? -1 : 0;
          }
          return get.attitude(player, target) > 0 && target.hasCard((card) => target.hasValueTarget(card) > 0, "h") ? 1 : get.effect(target, { name: "guohe_copy2" }, player, player);
        }
      }
    },
    subSkill: {
      check: {
        trigger: { global: "useCardAfter" },
        filter(event, player) {
          if (!player.getStat().skill.dcpingzhi) {
            return false;
          }
          if (player.storage.dcpingzhi) {
            return event.getParent().name == "dcpingzhi" && !game.hasPlayer2((current) => current.hasHistory("damage", (evtx) => evtx.card === event.card));
          } else {
            return event.getParent(2).name == "dcpingzhi" && game.hasPlayer2((current) => current.hasHistory("damage", (evtx) => evtx.card === event.card));
          }
        },
        charlotte: true,
        silent: true,
        async content(event, trigger, player) {
          delete player.getStat("skill").dcpingzhi;
          game.log(player, "重置了", "#g【评骘】");
        }
      }
    }
  },
  dcgangjian: {
    audio: 2,
    trigger: {
      global: "phaseAfter"
    },
    forced: true,
    filter(event, player) {
      if (player.getHistory("damage").length) {
        return false;
      }
      let num = 0;
      game.getGlobalHistory("everything", (evt) => {
        return evt.name == "showCards" && evt.cards.length;
      }).forEach((evt) => {
        num += evt.cards.length;
      });
      return num > 0;
    },
    async content(event, trigger, player) {
      let num = 0;
      game.getGlobalHistory("everything", (evt) => {
        return evt.name == "showCards" && evt.cards.length;
      }).forEach((evt) => {
        num += evt.cards.length;
      });
      await player.draw(Math.min(num, 5));
    }
  },
  //乐周瑜
  dcguyin: {
    audio: 2,
    trigger: { global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "gameDrawBegin"] },
    filter(event, player) {
      if (event.name == "gameDraw") {
        return true;
      } else if (event.name.indexOf("lose") === 0) {
        if (event.type != "discard" || event.getlx === false || event.position !== ui.discardPile) {
          return false;
        }
      } else {
        const evtx = event.getParent();
        if (evtx.name !== "orderingDiscard") {
          return false;
        }
        const evt2 = evtx.relatedEvent || evtx.getParent();
        if (evt2.name != "useCard") {
          return false;
        }
      }
      const list = game.filterPlayer2((current) => player != current).reduce((listx, i) => {
        if (i._start_cards) {
          listx.addArray(i._start_cards);
        }
        return listx;
      }, []);
      return game.hasPlayer((current) => {
        const cards2 = event.name == "cardsDiscard" ? event.cards.filterInD("d") : event.getl(current)?.cards2 || [];
        return cards2.some((card) => list.includes(card));
      });
    },
    forced: true,
    async content(event, trigger, player) {
      if (trigger.name == "gameDraw") {
        const me = player;
        const numx = trigger.num;
        trigger.num = function(player2) {
          return player2 == me ? 0 : 1 + (typeof numx == "function" ? numx(player2) : numx);
        };
      } else {
        await player.draw();
      }
    }
  },
  dcpinglu: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      if (player.hasCard((card) => card.hasGaintag("dcpinglu_mark"), "h")) {
        return false;
      }
      return game.hasPlayer((current) => get.info("dcpinglu").filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return player.inRange(target) && target.countGainableCards(player, "h");
    },
    selectTarget: -1,
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      const gains = [];
      for (const target of event.targets.sortBySeat()) {
        const cards2 = target.getCards("h", (card) => lib.filter.canBeGained(card, target, player));
        if (cards2.length) {
          gains.push(cards2.randomGet());
        }
      }
      if (!gains.length) {
        return;
      }
      player.addTempSkill(event.name + "_mark", "phaseUseAfter");
      const next = player.gain(gains, "giveAuto");
      next.gaintag.add(event.name + "_mark");
      await next;
    },
    ai: {
      order: 10,
      result: {
        player: 1
      }
    },
    subSkill: {
      mark: {
        mod: {
          aiOrder(player, card, num) {
            if (get.itemtype(card) == "card" && card.hasGaintag("dcpinglu_mark") && game.hasPlayer((current) => {
              return player.inRange(current) && current.countGainableCards(player, "h") && get.attitude(player, current) < 0;
            })) {
              return num + 0.1;
            }
          }
        },
        charlotte: true,
        onremove: (player, skill) => player.removeGaintag(skill)
      }
    }
  },
  //乐貂蝉
  dctanban: {
    audio: 2,
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
      const cards2 = player.getCards("h");
      player.addGaintag(cards2, "dctanban");
    },
    mod: {
      ignoredHandcard(card) {
        if (card.hasGaintag("dctanban")) {
          return true;
        }
      },
      cardDiscardable(card, _, name) {
        if (name == "phaseDiscard" && card.hasGaintag("dctanban")) {
          return false;
        }
      }
    },
    group: "dctanban_change",
    subSkill: {
      change: {
        audio: "dctanban",
        trigger: { player: "phaseDrawEnd" },
        filter(event, player) {
          return player.countCards("h");
        },
        prompt2: () => "交换手牌中的“檀板”牌",
        check(event, player) {
          return player.countCards("h", (card) => !card.hasGaintag("dctanban")) * 2 < player.countCards("h");
        },
        async content(event, trigger, player) {
          const cards2 = player.getCards("h", (card) => !card.hasGaintag("dctanban"));
          player.removeGaintag("dctanban");
          player.addGaintag(cards2, "dctanban");
        }
      }
    }
  },
  dcdiou: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter(event, player) {
      if (!player.hasCard((card) => _status.connectMode || !card.hasGaintag("dctanban"), "h")) {
        return false;
      }
      return player.hasHistory("lose", (evt) => {
        const evtx = evt.relatedEvent || evt.getParent();
        if (evtx != event) {
          return false;
        }
        return Object.keys(evt.gaintag_map).some((i) => evt.gaintag_map[i].includes("dctanban"));
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard(get.prompt2(event.skill), (card, player2) => {
        return !card.hasGaintag("dctanban");
      }).set("ai", (card) => {
        const player2 = get.player();
        const shown = game.getGlobalHistory("everything", (evt) => {
          return evt.name === "showCards";
        }).reduce((list, evt) => list.addArray(evt.cards), []);
        const cardx = {
          name: get.name(card, player2),
          nature: get.nature(card, player2),
          isCard: true
        };
        return player2.getUseValue(cardx) + (shown.includes(card) && get.event().getTrigger().card.name !== cardx.name) ? 0 : get.effect(player2, { name: "draw" }, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const next = player.showCards(event.cards, get.translation(player) + "发动了【低讴】");
      await next;
      const cardx = {
        name: get.name(event.cards[0], player),
        nature: get.nature(event.cards[0], player),
        isCard: true
      };
      if (get.type(cardx) !== "equip" && get.type(cardx) !== "delay" && player.hasUseTarget(cardx)) {
        await player.chooseUseTarget(cardx, true, false);
      }
      if (!game.getGlobalHistory(
        "everything",
        (evt) => {
          return evt.name === "showCards" && evt !== next && evt.cards.includes(event.cards[0]);
        },
        next
      ).length || trigger.card.name === cardx.name) {
        await player.draw(2);
      }
    },
    ai: {
      combo: "dctanban"
    }
  },
  //黄舞蝶
  dcshuangrui: {
    onChooseTarget(event, player) {
      event.targetprompt2.add((target) => {
        if (event.getParent().skill !== "dcshuangrui" || !target.classList.contains("selectable")) {
          return;
        }
        if (player.inRange(target)) {
          return "加伤";
        } else {
          return "不可响应";
        }
      });
    },
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.hasPlayer((current) => {
        return current != player && player.canUse({ name: "sha", isCard: true }, current, false);
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), function(card, player2, target) {
        return target != player2 && player2.canUse({ name: "sha", isCard: true }, target, false);
      }).set("ai", (target) => {
        const player2 = get.player(), card = { name: "sha", isCard: true };
        return get.effect(target, card, player2, player2);
      }).set("_get_card", { name: "sha", isCard: true }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      let directHit = [], baseDamage = 1;
      if (player.inRange(target)) {
        baseDamage++;
        await player.addTempSkills("dcshaxue");
      } else {
        directHit.addArray(game.players);
        await player.addTempSkills("dcshouxing");
      }
      await player.useCard({ name: "sha", isCard: true }, target, false).set("directHit", directHit).set("baseDamage", baseDamage);
    },
    ai: {
      skillTagFilter(player, tag, arg) {
        if (!_status.event.getParent("dcshuangrui_cost", true, true)) {
          return false;
        }
        return !player.inRange(arg.target);
      },
      directHit_ai: true
    },
    derivation: ["dcshouxing", "dcshaxue"]
  },
  dcfuxie: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return game.hasPlayer((current) => current != player && current.countCards("he"));
    },
    chooseButton: {
      dialog(event, player) {
        const skills2 = player.getSkills(null, false, false).filter((skill) => {
          let info = get.info(skill);
          if (!info || info.charlotte || get.skillInfoTranslation(skill, player).length == 0) {
            return false;
          }
          return true;
        });
        const dialog = ui.create.dialog("伏械：弃置一张武器牌或失去1个技能");
        dialog.direct = true;
        dialog.add([
          [["discardEquip1", "弃置武器牌"]],
          (item, type, position, noclick, node) => {
            node = ui.create.buttonPresets.tdnodes(item, type, position, noclick);
            node.link = ["discard", "equip1"];
            return node;
          }
        ]);
        dialog.add([skills2, "skill"]);
        return dialog;
      },
      filter(button, player) {
        if (Array.isArray(button.link)) {
          return player.countDiscardableCards(player, "he", (card) => get.subtype(card) == button.link[1]);
        }
        return true;
      },
      check(button) {
        const player = get.player();
        if (Array.isArray(button.link)) {
          if (player.countDiscardableCards(player, "he", (card) => get.subtype(card) == button.link[1] && get.value(card) < 10)) {
            return 3;
          }
          return 1;
        }
        if (["dcshouxing", "dcshaxue"].includes(button.link)) {
          return 4;
        }
        return 2;
      },
      backup(links, player) {
        return {
          audio: "dcfuxie",
          choice: links[0],
          filterCard(card) {
            const { choice } = get.info("dcfuxie_backup");
            if (Array.isArray(choice)) {
              return get.subtype(card) == "equip1" && lib.filter.cardDiscardable(card, player, "dcfuxie");
            }
            return false;
          },
          position: "he",
          selectCard() {
            const { choice } = get.info("dcfuxie_backup");
            if (Array.isArray(choice)) {
              return 1;
            }
            return -1;
          },
          filterTarget(card, player2, target) {
            return target != player2 && target.countCards("he");
          },
          async content(event, trigger, player2) {
            const { choice } = get.info("dcfuxie_backup");
            if (Array.isArray(choice)) {
              await player2.modedDiscard(event.cards);
            } else {
              await player2.removeSkills(choice);
            }
            const target = event.target;
            await target.chooseToDiscard(2, true, "he");
          },
          ai1(card) {
            return 10 - get.value(card);
          },
          ai2(target) {
            const player2 = get.player();
            return get.effect(target, { name: "guohe_copy2" }, player2, player2);
          }
        };
      },
      prompt(links, player) {
        let prompt = Array.isArray(links[0]) ? "弃置一张武器牌" : `失去【${get.translation(links[0])}】`;
        return `${prompt}，令一名角色弃置两张牌`;
      }
    },
    subSkill: {
      backup: {}
    },
    ai: {
      order: 3,
      result: {
        player(player, target) {
          if (["dcshouxing", "dcshaxue"].some((skill) => player.hasSkill(skill))) {
            return 1;
          }
          if (player.countCards("he", (card) => get.subtype(card) == "equip1")) {
            return 1;
          }
          return 0;
        }
      }
    }
  },
  dcshouxing: {
    audio: 2,
    enable: "chooseToUse",
    filterCard: true,
    selectCard: [1, Infinity],
    position: "hse",
    viewAs: { name: "sha" },
    viewAsFilter(player) {
      if (!player.countCards("hse")) {
        return false;
      }
    },
    filterTarget(card, player, target) {
      const cards2 = ui.selected.cards;
      if (!cards2 || !cards2.length) {
        return false;
      }
      if (player.inRange(target)) {
        return false;
      }
      if (get.distance(player, target) != cards2.length) {
        return false;
      }
      return lib.filter.targetEnabled(card, player, target);
    },
    complexSelect: true,
    prompt: "将X张牌当杀对一名攻击范围外的角色使用（X为你计算与其的距离）",
    check(card) {
      return 4.5 - get.value(card);
    },
    async precontent(event) {
      event.getParent().addCount = false;
    },
    ai: {
      skillTagFilter(player) {
        if (!player.countCards("hes")) {
          return false;
        }
      },
      respondSha: true
    }
  },
  dcshaxue: {
    audio: 2,
    trigger: {
      source: "damageSource"
    },
    filter(event, player) {
      return event.player != player;
    },
    check(event, player) {
      return get.distance(player, event.player) <= 2;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      await player.draw(2);
      const num = get.distance(player, trigger.player);
      if (num > 0 && trigger.player.isIn()) {
        await player.chooseToDiscard(num, "he", true);
      }
    }
  },
  //马腾
  dcxiongyi: {
    skillAnimation: true,
    animationColor: "gray",
    unique: true,
    enable: "phaseUse",
    audio: "xiongyi",
    limited: true,
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await game.asyncDraw([event.target, player], 3);
      if (game.getAllGlobalHistory("everything", (evt) => {
        return evt.name == event.name && evt.player == player;
      }).indexOf(event) == 0 && player.isMinHp(true)) {
        if (player.isDamaged()) {
          await player.recover();
        }
      }
      player.addAdditionalSkill(event.name, "dcxiongyi_restore");
    },
    ai: {
      order: 1,
      result: {
        target: 1
      }
    },
    subSkill: {
      restore: {
        trigger: {
          player: "dyingAfter"
        },
        charlotte: true,
        direct: true,
        filter(event, player) {
          return player.isIn();
        },
        async content(event, trigger, player) {
          game.log(player, "重置了", "#g【雄异】");
          player.restoreSkill("dcxiongyi");
          player.addAdditionalSkill("dcxiongyi", []);
        }
      }
    }
  },
  //群祝融
  dcremanhou: {
    audio: "dcmanhou",
    enable: "phaseUse",
    usable: 1,
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("###蛮后###摸至多四张牌并执行等量项");
      },
      chooseControl(event, player) {
        var list = Array.from({
          length: 4
        }).map((_, i) => get.cnNumber(i + 1) + "张");
        list.push("cancel2");
        return list;
      },
      check(event, player) {
        if (get.effect(player, { name: "losehp" }, player, player) > 4 || player.countCards("hs", (card) => player.canSaveCard(card, player)) > 0 || player.hp > 2) {
          return "四张";
        }
        return "两张";
      },
      backup(result, player) {
        return {
          num: result.control,
          audio: "dcmanhou",
          filterCard: () => false,
          selectCard: -1,
          async content(event, trigger, player2) {
            var num = Array.from({
              length: 4
            }).map((_, i) => get.cnNumber(i + 1) + "张").indexOf(lib.skill.dcremanhou_backup.num) + 1;
            await player2.draw(num);
            if (num >= 1) {
              await player2.removeSkills("dcretanluan");
            }
            if (num >= 2 && player2.countCards("h")) {
              await player2.chooseToDiscard("h", true);
            }
            if (num >= 3) {
              if (game.hasPlayer((target) => target.countDiscardableCards(player2, "ej"))) {
                const [target] = (await player2.chooseTarget(
                  "弃置场上的一张牌",
                  (card, player3, target2) => {
                    return target2.countDiscardableCards(player3, "ej");
                  },
                  true
                ).set("ai", (target2) => {
                  const player3 = get.player();
                  return get.effect(target2, { name: "guohe_copy", position: "ej" }, player3, player3);
                }).forResult()).targets ?? [];
                if (target) {
                  player2.line(target);
                  await player2.discardPlayerCard(target, "ej", true);
                }
              }
            }
            if (num >= 4) {
              await player2.loseHp();
              await player2.addSkills("dcretanluan");
            }
          }
        };
      }
    },
    ai: {
      order: 8,
      result: { player: 1 }
    },
    subSkill: { backup: {} },
    derivation: "dcretanluan"
  },
  dcretanluan: {
    init(player, skill) {
      if (typeof player.getStat("skill")?.[skill] === "number") {
        delete player.getStat("skill")[skill];
      }
    },
    onChooseToUse(event) {
      if (!game.online && !event.dcretanluan) {
        event.set(
          "dcretanluan",
          game.filterPlayer2().reduce((list, target) => {
            return list.addArray(
              target.getHistory("lose", (evt) => {
                return evt.type === "discard";
              }).map((evt) => evt.cards.filterInD("d")).flat().unique()
            );
          }, [])
        );
      }
    },
    audio: "dctanluan",
    enable: "phaseUse",
    filter(event, player) {
      return event.dcretanluan?.some((card) => player.hasUseTarget(card));
    },
    usable: 1,
    chooseButton: {
      dialog(event, player) {
        const dialog = ui.create.dialog('###探乱###<div class="text center">' + lib.translate.dcretanluan_info + "</div>");
        dialog.add(event.dcretanluan);
        return dialog;
      },
      filter(button, player) {
        return player.hasUseTarget(button.link);
      },
      check(button) {
        const card = button.link;
        return get.player().getUseValue(card) * (get.tag(card, "damage") >= 1 ? 3 : 1);
      },
      prompt(links) {
        return '###探乱###<div class="text center">使用' + get.translation(links) + "，若此牌被【无懈可击】抵消或你因此对其他角色造成伤害，则重置〖蛮后〗</div>";
      },
      backup(links, player) {
        return {
          audio: "dctanluan",
          filterCard: () => false,
          selectCard: -1,
          popname: true,
          viewAs: links[0],
          card: links[0],
          async precontent(event, trigger, player2) {
            player2.addTempSkill("dcretanluan_effect");
            const card = get.info("dcretanluan_backup").card;
            event.result.cards = [card];
            event.result.card = get.autoViewAs(card, [card]);
            event.result.card.dcretanluan = true;
          }
        };
      }
    },
    subSkill: {
      backup: {},
      effect: {
        charlotte: true,
        audio: "dctanluan",
        trigger: {
          source: "damageSource",
          player: "eventNeutralized"
        },
        filter(event, player) {
          if (typeof player.getStat("skill")["dcremanhou"] !== "number") {
            return false;
          }
          if (event.name == "damage") {
            return event.card?.dcretanluan === true && event.player != player;
          }
          if (event.type != "card" && event.name != "_wuxie") {
            return false;
          }
          return event.card?.dcretanluan === true;
        },
        forced: true,
        async content(event, trigger, player) {
          delete player.getStat("skill")["dcremanhou"];
          player.popup("dcremanhou");
          game.log(player, "重置了技能", "【" + get.translation("dcremanhou") + "】");
        }
      },
      record: {
        charlotte: true,
        onremove: true,
        intro: { content: "【探乱】已记录角色：$" }
      }
    }
  },
  dcmanhou: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("###蛮后###摸至多四张牌并执行等量项");
      },
      chooseControl(event, player) {
        var list = Array.from({
          length: 4
        }).map((_, i) => get.cnNumber(i + 1) + "张");
        list.push("cancel2");
        return list;
      },
      check(event, player) {
        if (get.effect(player, { name: "losehp" }, player, player) > 4 || player.countCards("hs", (card) => player.canSaveCard(card, player)) > 0 || player.hp > 2) {
          return "四张";
        }
        return "两张";
      },
      backup(result, player) {
        return {
          num: result.control,
          audio: "dcmanhou",
          filterCard: () => false,
          selectCard: -1,
          async content(event, trigger, player2) {
            var num = Array.from({
              length: 4
            }).map((_, i) => get.cnNumber(i + 1) + "张").indexOf(lib.skill.dcmanhou_backup.num) + 1;
            await player2.draw(num);
            if (num >= 1) {
              await player2.removeSkills("dctanluan");
            }
            if (num >= 2 && player2.countCards("h")) {
              await player2.chooseToDiscard("h", true);
            }
            if (num >= 3) {
              await player2.loseHp();
            }
            if (num >= 4) {
              if (player2.countCards("he")) {
                await player2.chooseToDiscard("he", true);
              }
              await player2.addSkills("dctanluan");
            }
          }
        };
      }
    },
    ai: {
      order: 8,
      result: { player: 1 }
    },
    subSkill: { backup: {} }
  },
  dctanluan: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      return event.isFirstTarget;
    },
    locked: true,
    async cost(event, trigger, player) {
      const num = trigger.targets.length, num1 = game.filterPlayer((current) => !trigger.targets.includes(current)).length;
      if (num >= num1 && trigger.targets.some((current) => current.countDiscardableCards(player, "ej"))) {
        event.result = await player.chooseTarget(get.prompt(event.skill), (card, player2, target) => {
          const evt = _status.event.getTrigger();
          return evt.targets.includes(target) && target.countDiscardableCards(player2, "ej");
        }).set("ai", (target) => {
          const player2 = get.player();
          const att = get.attitude(player2, target);
          if (att > 0 && (target.countCards("j") > 0 || target.countCards("e", (card) => {
            return get.value(card, target) < 0;
          }))) {
            return 2;
          }
          if (att < 0 && target.countCards("e") > 0 && !target.hasSkillTag("noe")) {
            return -1;
          }
          return 0;
        }).forResult();
      } else {
        event.result = {
          bool: true
        };
      }
    },
    async content(event, trigger, player) {
      if (event.targets && event.targets.length) {
        await player.discardPlayerCard(event.targets[0], "ej", `弃置${get.translation(event.targets[0])}场上的一张牌`, true);
      } else {
        player.addTempSkill("dctanluan_add");
      }
    },
    subSkill: {
      add: {
        audio: "dctanluan",
        trigger: {
          player: "useCard2"
        },
        async cost(event, trigger, player) {
          player.removeSkill("dctanluan_add");
          var goon = false;
          var info = get.info(trigger.card);
          if (!["basic", "trick"].includes(get.type(trigger.card))) {
            return;
          }
          if (trigger.targets && !info.multitarget) {
            if (game.hasPlayer(function(current) {
              return !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current);
            })) {
              goon = true;
            }
          }
          if (!goon) {
            return;
          }
          event.result = await player.chooseTarget("是否发动【探乱】？", `为${get.translation(trigger.card)}添加一个目标`, (card, player2, target) => {
            const evt = _status.event.getTrigger();
            return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player2, target);
          }).set("ai", (target) => {
            return get.effect(target, _status.event.getTrigger().card, get.player());
          }).forResult();
        },
        async content(event, trigger, player) {
          const targets = event.targets;
          player.line(targets, "green");
          trigger.targets.addArray(targets);
        }
      }
    }
  },
  //乐诸葛果
  dcxidi: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    forced: true,
    async content(event, trigger, player) {
      const cards2 = player.getCards("h");
      player.addGaintag(cards2, "dcxidi_tag");
    },
    mod: {
      ignoredHandcard(card) {
        if (card.hasGaintag("dcxidi_tag")) {
          return true;
        }
      },
      cardDiscardable(card, _, name) {
        if (name == "phaseDiscard" && card.hasGaintag("dcxidi_tag")) {
          return false;
        }
      }
    },
    group: "dcxidi_guanxing",
    subSkill: {
      guanxing: {
        audio: "dcxidi",
        trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
        forced: true,
        locked: false,
        preHidden: true,
        async content(event, trigger, player) {
          const num = Math.max(
            1,
            player.countCards("h", (card) => card.hasGaintag("dcxidi_tag"))
          );
          const result = player.chooseToGuanxing(num).set("prompt", "羲笛：点击或拖动将牌移动到牌堆顶或牌堆底").forResult();
          if (!result.bool || !result.moved[0].length) {
            player.addTempSkill("guanxing_fail");
          }
        },
        ai: {
          guanxing: true,
          skillTagFilter(player, tag, arg) {
            if (tag === "guanxing") {
              return true;
            }
          }
        }
      }
    }
  },
  dcchengyan: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      if (event.card.name != "sha" && get.type(event.card) != "trick") {
        return false;
      }
      if (!event.isFirstTarget) {
        return false;
      }
      return event.target != player;
    },
    logTarget: "target",
    async content(event, trigger, player) {
      const target = trigger.target;
      const cards2 = (await player.draw().forResult()).cards;
      if (get.itemtype(cards2) != "cards") {
        return;
      }
      await player.showCards(cards2, get.translation(player) + "发动了【乘烟】");
      const card = cards2[0];
      if (card.name == "sha" || get.type(card, false) == "trick" && get.info(card, false).filterTarget) {
        player.addTempSkill("dcchengyan_effect");
        player.markAuto("dcchengyan_effect", [[trigger.card, card, target]]);
      } else {
        await player.draw().set("gaintag", ["dcxidi_tag"]);
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        trigger: { player: "useCardToBegin" },
        filter(event, player) {
          const storage = player.getStorage("dcchengyan_effect");
          return storage.some((list) => list[0] == event.card && list[2] == event.target);
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          const list = player.getStorage("dcchengyan_effect").find((list2) => list2[0] == trigger.card && list2[2] == trigger.target);
          trigger.setContent(lib.card[list[1].name].content);
        }
      }
    }
  },
  //乐邹氏
  dcyunzheng: {
    audio: 2,
    init() {
      game.addGlobalSkill("dcyunzheng_global");
    },
    onremove() {
      if (!game.hasPlayer((i) => i.hasSkill("dcyunzheng", null, null, false), true)) {
        game.removeGlobalSkill("dcyunzheng_global");
      }
    },
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    forced: true,
    async content(event, trigger, player) {
      const cards2 = player.getCards("h");
      player.addGaintag(cards2, "eternal_dcyunzheng_tag");
    },
    mod: {
      ignoredHandcard(card) {
        if (card.hasGaintag("eternal_dcyunzheng_tag")) {
          return true;
        }
      },
      cardDiscardable(card, _, name) {
        if (name == "phaseDiscard" && card.hasGaintag("eternal_dcyunzheng_tag")) {
          return false;
        }
      }
    },
    group: "dcyunzheng_fengyin",
    subSkill: {
      fengyin: {
        audio: "dcyunzheng",
        trigger: {
          global: ["phaseBefore", "loseAfter", "loseAsyncAfter", "gainAfter", "equipAfter", "addJudgeAfter", "addToExpansionAfter"],
          player: ["dchuoxin_update", "enterGame"]
        },
        filter(event, player) {
          if (["lose", "loseAsync", "equip", "addJudge", "addToExpansion"].includes(event.name) && !game.hasPlayer((target) => {
            const evt = event.getl(target);
            return evt && (evt.hs || []).length;
          })) {
            return false;
          }
          return game.hasPlayer((target) => {
            if (player === target) {
              return false;
            }
            return target.hasCard((card) => card.hasGaintag("eternal_dcyunzheng_tag"), "h") == !target.hasSkill("dcyunzheng_block");
          });
        },
        logTarget(event, player) {
          return game.filterPlayer((target) => {
            if (player === target) {
              return false;
            }
            return target.hasCard((card) => card.hasGaintag("eternal_dcyunzheng_tag"), "h") == !target.hasSkill("dcyunzheng_block");
          }).sortBySeat();
        },
        forced: true,
        async content(event, trigger, player) {
          const targets = game.filterPlayer((target) => {
            if (player === target) {
              return false;
            }
            return target.hasCard((card) => card.hasGaintag("eternal_dcyunzheng_tag"), "h") == !target.hasSkill("dcyunzheng_block");
          }).sortBySeat();
          for (const target of targets) {
            target[target.hasSkill("dcyunzheng_block") ? "removeSkill" : "addSkill"]("dcyunzheng_block");
          }
        }
      },
      global: {
        mod: {
          aiValue(player, card, num) {
            if (num <= 0 || get.itemtype(card) !== "card" || !card.hasGaintag("eternal_dcyunzheng_tag")) {
              return;
            }
            if (player.hasSkill("dcyunzheng")) {
              return num * 1.2;
            }
            return num / 10;
          },
          aiUseful(player, card, num) {
            if (num <= 0 || get.itemtype(card) !== "card" || !card.hasGaintag("eternal_dcyunzheng_tag")) {
              return;
            }
            if (player.hasSkill("dcyunzheng")) {
              return num * 1.2;
            }
            return num / 10;
          },
          aiOrder(player, card, num) {
            if (num <= 0 || get.itemtype(card) !== "card" || !card.hasGaintag("eternal_dcyunzheng_tag")) {
              return;
            }
            if (player.hasSkill("dcyunzheng")) {
              return num * 0.8;
            }
            return num * 10;
          }
        },
        trigger: {
          player: ["dieAfter", "loseAfter"],
          global: ["loseAsyncAfter", "cardsDiscardAfter", "equipAfter", "addJudgeAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          if (event.name == "die") {
            return !game.hasPlayer((cur) => cur.hasSkill("dcyunzheng", null, null, false), true);
          }
          return event.getd?.(player, "cards2")?.some((card) => card.hasGaintag("eternal_dcyunzheng_tag"));
        },
        silent: true,
        forceDie: true,
        async content(event, trigger, player) {
          if (trigger.name == "die") {
            game.removeGlobalSkill("dcyunzheng_gloabl");
            game.countPlayer((cur) => cur.removeSkill("dcyunzheng_block"));
          } else {
            for (const card of trigger.getd(player, "cards2")) {
              if (card.hasGaintag("eternal_dcyunzheng_tag")) {
                game.broadcastAll((card2) => {
                  card2.removeGaintag("eternal_dcyunzheng_tag");
                }, card);
              }
            }
          }
        }
      },
      block: {
        inherit: "fengyin"
      }
    }
  },
  dchuoxin: {
    audio: 2,
    trigger: { player: "useCard" },
    filter(event, player) {
      return get.type(event.card) !== "equip" && game.hasPlayer((current) => {
        return player !== current && current.countCards("h");
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget({
        prompt: get.prompt2(event.skill),
        filterTarget(card, player2, target) {
          return player2 !== target && target.countCards("h") > 0;
        },
        ai(target) {
          let att = get.attitude(get.player(), target);
          if (att > 0) {
            return 0;
          }
          if (!target.hasSkill("dcyunzheng_block")) {
            att *= target.getSkills(null, false, false).filter((i) => {
              return lib.skill.dcyunzheng_block.skillBlocker(i, target);
            }).length + 1;
          }
          return 1 - att;
        }
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      const result = await player.choosePlayerCard({
        prompt: "惑心：展示" + get.translation(target) + "的一张手牌",
        position: "h",
        target,
        forced: true
      }).forResult();
      const tag = "eternal_dcyunzheng_tag";
      if (result.bool) {
        let cards2 = result.cards.slice();
        await player.showCards(cards2, get.translation(player) + "发动了【惑心】");
        const cardx = cards2.filter((card) => card.hasGaintag(tag) || get.suit(card) == get.suit(trigger.card));
        if (cards2.some((card) => !card.hasGaintag(tag))) {
          target.addGaintag(
            cards2.filter((card) => !card.hasGaintag(tag)),
            "eternal_dcyunzheng_tag"
          );
          await event.trigger("dchuoxin_update");
        }
        if (cardx.length) {
          const result2 = await player.chooseBool({
            prompt: "惑心：是否获得" + get.translation(cardx) + "？",
            choice: get.value(cardx, player) > 7
          }).forResult();
          if (result2.bool) {
            await player.gain({
              cards: cardx,
              source: target,
              animate: "give"
            });
          }
          cards2.removeArray(cardx);
        }
      }
    }
  },
  //乐祢衡
  dcjigu: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    forced: true,
    async content(event, trigger, player) {
      const cards2 = player.getCards("h");
      player.addGaintag(cards2, "dcjigu");
    },
    mod: {
      ignoredHandcard(card) {
        if (card.hasGaintag("dcjigu")) {
          return true;
        }
      },
      cardDiscardable(card, _, name) {
        if (name == "phaseDiscard" && card.hasGaintag("dcjigu")) {
          return false;
        }
      }
    },
    group: "dcjigu_temp",
    subSkill: {
      used: {
        charlotte: true,
        onremove: true
      },
      temp: {
        audio: "dcjigu",
        trigger: {
          player: "damageEnd",
          source: "damageSource"
        },
        filter(event, player) {
          return player.countCards("e") == player.countCards("h", (card) => card.hasGaintag("dcjigu"));
        },
        forced: true,
        prompt2(event, player) {
          return "摸" + get.cnNumber(
            Array.from({ length: 5 }).map((_, i) => i + 1).reduce((sum, i) => sum + player.countEmptySlot(i), 0)
          ) + "张牌";
        },
        async content(event, trigger, player) {
          player.addTempSkill("dcjigu_used", { global: "roundStart" });
          player.addMark("dcjigu_used", 1, false);
          await player.draw(
            Array.from({ length: 5 }).map((_, i) => i + 1).reduce((sum, i) => sum + player.countEmptySlot(i), 0)
          );
          let num1 = player.countMark("dcjigu_used");
          let num2 = game.countPlayer2((current) => {
            return current.actionHistory.some((i) => i.isMe && !i.isSkipped);
          });
          if (num1 >= num2) {
            player.tempBanSkill(event.name, "roundStart");
          }
        }
      }
    }
  },
  dcsirui: {
    audio: 2,
    mod: {
      targetInRange(card) {
        if (card.storage && card.storage.dcsirui) {
          return true;
        }
      },
      cardUsable(card, player, num) {
        if (card.storage && card.storage.dcsirui) {
          return Infinity;
        }
      }
    },
    enable: "phaseUse",
    filter(event, player) {
      if (!player.countCards("hes")) {
        return false;
      }
      return get.inpileVCardList((info) => {
        const name = info[2];
        if (get.type(name) != "basic" && get.type(name) != "trick") {
          return false;
        }
        return true;
      }).some((card) => player.hasCard((cardx) => get.cardNameLength(cardx) == get.cardNameLength(card[2]) && player.hasUseTarget(get.autoViewAs({ name: card[2], nature: card[3], storage: { dcsirui: true } }, [cardx]), false, false), "hes"));
    },
    usable: 1,
    locked: false,
    chooseButton: {
      dialog(event, player) {
        const list = get.inpileVCardList((info) => {
          const name = info[2];
          if (get.type(name) != "basic" && get.type(name) != "trick") {
            return false;
          }
          return true;
        }).filter((card) => player.hasCard((cardx) => get.cardNameLength(cardx) == get.cardNameLength(card[2]) && player.hasUseTarget(get.autoViewAs({ name: card[2], nature: card[3], storage: { dcsirui: true } }, [cardx]), false, false), "hes"));
        return ui.create.dialog("思锐", [list, "vcard"]);
      },
      check(button) {
        return get.event().player.getUseValue({
          name: button.link[2],
          nature: button.link[3],
          storage: { dcsirui: true }
        });
      },
      backup(links, player) {
        return {
          audio: "dcsirui",
          filterCard(card, player2) {
            return get.cardNameLength(card) == get.cardNameLength(lib.skill.dcsirui_backup.viewAs.name);
          },
          popname: true,
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            storage: { dcsirui: true }
          },
          check(card) {
            return 7 - get.value(card);
          },
          position: "hes",
          async precontent(event, trigger, player2) {
            event.getParent().addCount = false;
          }
        };
      },
      prompt(links, player) {
        return "将一张字数为" + get.cardNameLength(links[0][2]) + "的牌当作" + get.translation(links[0][3] || "") + "【" + get.translation(links[0][2]) + "】使用";
      }
    },
    ai: {
      order(item, player) {
        let list = get.inpileVCardList((info) => {
          const name = info[2];
          if (get.type(name) != "basic" && get.type(name) != "trick") {
            return false;
          }
          return true;
        }).filter((card) => player.hasCard((cardx) => get.cardNameLength(cardx) == get.cardNameLength(card[2]) && player.hasUseTarget(get.autoViewAs({ name: card[2], nature: card[3] }, [cardx]), false, false), "hes")).map((card) => {
          return { name: card[2], nature: card[3] };
        }).filter((card) => player.getUseValue(card, true, true) > 0);
        if (!list.length) {
          return 0;
        }
        list.sort((a, b) => (player.getUseValue(b, true, true) || 0) - (player.getUseValue(a, true, true) || 0));
        return get.order(list[0], player) * 0.99;
      },
      result: { player: 1 }
    },
    subSkill: {
      backup: { audio: "dcsirui" }
    }
  },
  //李丰
  dctunchu: {
    audio: 2,
    trigger: { global: "gameDrawBegin" },
    forced: true,
    async content(event, trigger, player) {
      const me = player;
      const numx = trigger.num;
      const sum = game.players.slice().concat(game.dead).length * 4;
      trigger.num = (player2) => player2 == me ? sum : typeof numx == "function" ? numx(player2) : numx;
    },
    mod: {
      cardDiscardable(card, player) {
        if (get.position(card) == "h") {
          return false;
        }
      },
      canBeDiscarded(card, player) {
        if (get.position(card) == "h") {
          return false;
        }
      },
      aiOrder(player, card, num) {
        if (num > 0 && get.name(card, player) == "huogong") {
          return 0;
        }
      },
      aiValue(player, card, num) {
        if (num > 0 && get.name(card, player) == "huogong") {
          return 0.01;
        }
      },
      aiUseful(player, card, num) {
        if (num > 0 && get.name(card, player) == "huogong") {
          return 0;
        }
      }
    },
    group: "dctunchu_limit",
    subSkill: {
      limit: {
        audio: "dctunchu",
        trigger: { player: "phaseZhunbeiBegin" },
        filter(event, player) {
          return player.countCards("h") > player.getHp();
        },
        forced: true,
        async content(event, trigger, player) {
          player.addTempSkill("dctunchu_debuff");
          player.addMark("dctunchu_debuff", 3, false);
        }
      },
      debuff: {
        mark: true,
        intro: {
          markcount(storage) {
            return (storage || 0).toString();
          },
          content(storage) {
            return "还可使用" + (storage || 0).toString() + "张牌";
          }
        },
        charlotte: true,
        onremove: true,
        trigger: { player: "useCard0" },
        filter(event, player) {
          return player.hasMark("dctunchu_debuff");
        },
        forced: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          player.removeMark("dctunchu_debuff", 1, false);
        },
        mod: {
          cardEnabled(card, player) {
            if (player.hasMark("dctunchu_debuff")) {
              return;
            }
            if (get.itemtype(card) == "card" && get.position(card) == "h") {
              return false;
            }
            if (card.cards && (card.cards || []).some((i) => get.position(i) == "h")) {
              return false;
            }
          },
          cardSavable() {
            return lib.skill.dctunchu.subSkill.debuff.mod.cardEnabled.apply(this, arguments);
          }
        }
      }
    }
  },
  dcshuliang: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      return player.countCards("he") && game.hasPlayer((target) => !target.countCards("h"));
    },
    async cost(event, trigger, player) {
      const num = Math.min(
        player.countCards("he"),
        game.countPlayer((target) => !target.countCards("h"))
      );
      let list = [];
      while (num - list.length > 0) {
        const { bool, targets, cards: cards2 } = await player.chooseCardTarget({
          prompt: list.length ? "是否继续发动【输粮】？" : get.prompt(event.skill),
          prompt2: lib.translate.dcshuliang_info,
          position: "he",
          animate: false,
          filterCard(card, player2) {
            return !get.event().list.some((list2) => list2[1] == card);
          },
          filterTarget(card, player2, target) {
            return !target.countCards("h") && !get.event().list.some((list2) => list2[0] == target);
          },
          ai1(card) {
            if (card.name == "du") {
              return 200;
            }
            let info = get.info(card);
            if (info && info.toself) {
              return 10;
            }
            return get.unuseful(card);
          },
          ai2(target) {
            const player2 = get.event().player, att = get.attitude(player2, target);
            if (player2.hasCard((card) => {
              return card.name == "du" && !get.event().list.some((list2) => list2[1] == card);
            }, "h") && !target.countCards("h") && !get.event().list.some((list2) => list2[0] == target) && !target.hasSkillTag("nodu")) {
              return -200 * att;
            }
            return att;
          }
        }).set("list", list).forResult();
        if (bool) {
          list.push([targets[0], cards2[0]]);
          player.addGaintag(cards2, "olsujian_given");
        } else {
          break;
        }
      }
      event.result = {
        bool: Boolean(list.length),
        targets: list.slice().map((list2) => list2[0]),
        cards: list.slice().flatMap((list2) => list2[1]),
        cost_data: list
      };
    },
    async content(event, trigger, player) {
      const list = event.cost_data;
      await game.loseAsync({
        gain_list: list,
        player,
        cards: event.cards,
        giver: player,
        animate: "giveAuto"
      }).setContent("gaincardMultiple");
      for (let i = 0; i < list.length; i++) {
        const target = event.targets[i], card = event.cards[i];
        if (get.owner(card) == target && get.position(card) == "h" && target.canUse(card, target)) {
          await target.chooseUseTarget(card);
        }
      }
    }
  },
  //吴普
  dcduanti: {
    audio: 2,
    trigger: {
      player: ["useCardAfter", "respondAfter"]
    },
    forced: true,
    filter(event, player) {
      return event._copdcduanti;
    },
    onremove: ["dcduanti", "dcduanti_counter"],
    group: "dcduanti_counter",
    async content(event, trigger, player) {
      await player.recover();
      if (player.countMark("dcduanti") >= 5) {
        return;
      }
      player.addMark("dcduanti", 1, false);
      await player.gainMaxHp();
    },
    subSkill: {
      counter: {
        trigger: {
          player: ["useCard1", "respond"]
        },
        forced: true,
        charlotte: true,
        popup: false,
        firstDo: true,
        async content(event, trigger, player) {
          if (!player.countMark("dcduanti_counter")) {
            const num = game.getAllGlobalHistory("everything", (evt) => {
              return evt.player === player && ["useCard", "respond"].includes(evt.name) && evt !== trigger;
            }).length;
            if (num) {
              player.addMark("dcduanti_counter", num, false);
            }
          }
          player.addMark("dcduanti_counter", 1, false);
          if (player.countMark("dcduanti_counter") % 5 === 0) {
            trigger._copdcduanti = true;
          }
          player.markSkill("dcduanti");
        }
      }
    },
    intro: {
      markcount(storage, player) {
        return player.countMark("dcduanti_counter");
      },
      content(storage, player) {
        return `<li>已使用过${get.cnNumber(player.countMark("dcduanti_counter"))}张牌<br><li>已以此法增加${player.countMark("dcduanti")}点体力上限`;
      }
    }
  },
  dcshicao: {
    audio: 2,
    enable: "phaseUse",
    onremove: ["dcshicao_aiRecord"],
    chooseButton: {
      dialog(event, player) {
        return ui.create.dialog("###识草###选择一种类型与要摸牌的来源", [["caoying_basic", "caoying_trick", "caoying_equip"], "vcard"], [["牌堆顶", "牌堆底"], "tdnodes"]);
      },
      check(button) {
        const player = get.player();
        const bottom = player.storage.dcshicao_bottom, aiStorage = player.getStorage("dcshicao_aiRecord");
        if (bottom && aiStorage.length > 0 && ui.cardPile.lastChild && get.name(ui.cardPile.lastChild, false) === get.name(aiStorage.lastItem, false)) {
          if (button.link === "牌堆底" || button.link[2].slice(8) === get.type2(aiStorage.lastItem, false)) {
            return 20;
          }
        }
        if (button.link === "牌堆顶" || button.link[2].slice(8) === "basic") {
          return 10;
        }
        return 5 + Math.random();
      },
      filter(button, player) {
        if (!ui.selected.buttons.length) {
          return true;
        }
        return ui.selected.buttons[0].parentNode != button.parentNode;
      },
      select: 2,
      backup(links, player) {
        if (links[0].includes("牌堆")) {
          links.reverse();
        }
        return {
          audio: "dcshicao",
          type: links[0][2].slice(8),
          pos: links[1],
          filterCard: () => false,
          selectCard: -1,
          async content(event, trigger, player2) {
            let { type, pos } = lib.skill.dcshicao_backup;
            game.log(player2, "声明了", `#y${get.translation(type)}牌`);
            const next = player2.draw();
            const bottom = pos === "牌堆底";
            if (bottom) {
              next.set("bottom", true);
              if (player2.getStorage("dcshicao_aiRecord").length > 0) {
                player2.storage.dcshicao_aiRecord.pop();
              }
            }
            const drawnCards = (await next.forResult()).cards;
            if (get.type2(drawnCards[0], player2) === type) {
              return;
            }
            let cards2;
            if (!bottom) {
              cards2 = get.bottomCards(2);
              cards2.reverse();
            } else {
              cards2 = get.cards(2);
            }
            await game.cardsGotoOrdering(cards2);
            await player2.viewCards(`${bottom ? "牌堆顶" : "牌堆底"}的两张牌(靠左的在牌堆更靠上)`, cards2);
            player2.storage.dcshicao_record = cards2.slice();
            player2.storage.dcshicao_aiRecord = cards2.slice();
            player2.storage.dcshicao_bottom = !bottom;
            const skill = "dcshicao";
            player2.localMarkSkill(skill, player2, event);
            if (bottom) {
              cards2.reverse();
            }
            await game.cardsGotoPile(cards2, bottom ? "insert" : null);
            player2.tempBanSkill(skill);
          },
          ai: {
            result: { player: 1 }
          }
        };
      },
      prompt(links, player) {
        return `点击“确定”，从${links[1]}摸一张牌`;
      }
    },
    intro: {
      mark(dialog, content, player) {
        var cards2 = player.getStorage("dcshicao_record");
        if (cards2 && cards2.length) {
          if (player.isUnderControl(true)) {
            dialog.addText(`上一次观看的${player.storage.dcshicao_bottom ? "牌堆底" : "牌堆顶"}的牌：`);
            dialog.addAuto(cards2);
            dialog.addText("（牌堆顶——牌堆底）");
          } else {
            return "不给看";
          }
        }
      }
    },
    subSkill: {
      backup: {}
    },
    ai: {
      order: 8,
      result: {
        player: 1
      }
    }
  },
  //新杀曹爽
  dcjianzhuan: {
    audio: 2,
    trigger: { player: "useCard" },
    filter(event, player) {
      const evtx = event.getParent("phaseUse");
      return player.isPhaseUsing() && player.getHistory("useSkill", (evt) => {
        return evt.skill == "dcjianzhuan" && evt.event.getParent("phaseUse") == evtx;
      }).length < 4 - player.getStorage("dcjianzhuan").length;
    },
    forced: true,
    derivation: "dcjianzhuan_faq",
    async content(event, trigger, player) {
      const evtx = event.getParent("phaseUse"), num = player.getHistory("useSkill", (evt) => {
        return evt.skill == "dcjianzhuan" && evt.event.getParent("phaseUse") == evtx;
      }).length, info = get.info("dcjianzhuan").choices;
      let choices = [], choiceList = [], map = {};
      for (const i in info) {
        map[info[i].intro] = i;
        if (player.getStorage("dcjianzhuan").includes(i) || player.getStorage("dcjianzhuan_used").includes(i)) {
          continue;
        }
        choices.push(info[i].intro);
        choiceList.push(info[i].introx(num));
      }
      const { control } = await player.chooseControl(choices).set("choiceList", choiceList).set("ai", () => {
        const player2 = get.event().player, num2 = get.event().num, info2 = get.info("dcjianzhuan").choices;
        let choices2 = get.event().controls.slice(), map2 = get.event().map;
        return choices2.sort((a, b) => info2[map2[b]].ai_effect(player2, num2) - info2[map2[a]].ai_effect(player2, num2))[0];
      }).set("num", num).set("map", map).set("prompt", "渐专：请选择一项执行").forResult();
      if (control) {
        if (!player.storage.dcjianzhuan_used) {
          player.when("phaseUseAfter").step(async () => delete player.storage.dcjianzhuan_used);
        }
        player.markAuto("dcjianzhuan_used", [map[control]]);
        await info[map[control]].content(player, num);
      }
    },
    choices: {
      discard_target: {
        intro: "拆牌",
        introx: (num) => `令一名其他角色弃置${get.cnNumber(num)}张牌`,
        weight: 1,
        ai_effect(player, num) {
          return game.hasPlayer((target) => {
            return player != target && get.effect(target, { name: "guohe_copy2" }, player, player) > 0;
          }) ? 2 + num : 0;
        },
        async content(player, num = 1) {
          if (!game.hasPlayer((current) => current != player)) {
            return;
          }
          const { bool, targets } = await player.chooseTarget(`令一名其他角色弃置${get.cnNumber(num)}张牌`, true, lib.filter.notMe).set("ai", (target) => {
            return get.effect(target, { name: "guohe_copy2" }, get.event().player, get.event().player) * Math.sqrt(Math.min(get.event().num, target.countDiscardableCards(target, "he")));
          }).set("num", num).forResult();
          if (bool) {
            const target = targets[0];
            player.line(target);
            await target.chooseToDiscard(num, "he", true);
          }
        }
      },
      draw_self: {
        intro: "摸牌",
        introx: (num) => `摸${get.cnNumber(num)}张牌`,
        weight: 1,
        ai_effect(player, num) {
          return 3;
        },
        async content(player, num = 1) {
          await player.draw(num);
        }
      },
      recast_self: {
        intro: "重铸",
        introx: (num) => `重铸${get.cnNumber(num)}张牌`,
        weight: 1,
        ai_effect(player, num) {
          return 1;
        },
        async content(player, num = 1) {
          if (!player.hasCard(lib.filter.cardRecastable, "he")) {
            return;
          }
          const { bool, cards: cards2 } = await player.chooseCard(`重铸${get.cnNumber(num)}张牌`, "he", num, lib.filter.cardRecastable, true).set("ai", lib.skill.zhiheng.check).forResult();
          if (bool) {
            await player.recast(cards2);
          }
        }
      },
      discard_self: {
        intro: "弃牌",
        introx: (num) => `弃置${get.cnNumber(num)}张牌`,
        weight: "90%",
        ai_effect(player, num) {
          let cards2 = player.getCards("hs");
          cards2.sort((a, b) => get.value(b) - get.value(a));
          cards2 = cards2.slice(0, -Math.min(num, cards2.length));
          return cards2.some((card) => player.hasValueTarget(card, true, true)) ? 4 : -4;
        },
        async content(player, num = 1) {
          await player.chooseToDiscard(num, "he", true, "allowChooseAll");
        }
      }
    },
    group: "dcjianzhuan_remove",
    subSkill: {
      remove: {
        audio: "dcjianzhuan",
        trigger: { player: "phaseUseEnd" },
        filter(event, player) {
          if (player.getStorage("dcjianzhuan").length >= 3) {
            return false;
          }
          return player.getStorage("dcjianzhuan_used").length >= 4 - player.getStorage("dcjianzhuan").length;
        },
        forced: true,
        async content(event, trigger, player) {
          const info = get.info("dcjianzhuan").choices;
          let map = {};
          let unfixedWeightTotal = 0, remainedWeight = 100;
          let entries = [];
          for (const i in info) {
            const infox = info[i];
            map[infox.intro] = i;
            if (player.getStorage("dcjianzhuan").includes(i)) {
              continue;
            }
            let weight = (infox.weight || 1).toString();
            if (weight.endsWith("%")) {
              weight = Math.min(remainedWeight, parseInt(weight.slice(0, -1)));
              entries.push([infox.intro, weight]);
              remainedWeight -= weight;
            } else {
              weight = parseInt(weight);
              unfixedWeightTotal += weight;
              entries.push([infox.intro, -weight]);
            }
          }
          entries = entries.map((entry) => {
            let weight = entry[1];
            if (weight < 0) {
              weight = -remainedWeight / unfixedWeightTotal * weight;
            }
            return [entry[0], weight];
          });
          let rand = Math.random() * 100;
          let removeChoice = entries.find((entry) => {
            rand -= entry[1];
            return rand < 0;
          })[0];
          if (get.isLuckyStar(player) && Object.keys(entries).includes("弃牌")) {
            removeChoice = "弃牌";
          }
          player.markAuto("dcjianzhuan", [map[removeChoice]]);
          player.popup(removeChoice);
          game.log(player, "移去了", "#g" + removeChoice, "项");
        }
      }
    },
    mark: true,
    intro: {
      markcount(storage) {
        return 4 - (storage || []).length;
      },
      content(storage) {
        if (!(storage || []).length) {
          return "暂未移去任何项";
        }
        const info = get.info("dcjianzhuan").choices;
        let str = "";
        for (const i of storage) {
          str += info[i].intro;
          str += "、";
        }
        str = str.slice(0, -1);
        return "已移去" + str + "项";
      }
    }
  },
  dcfanshi: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      return 4 - player.getStorage("dcjianzhuan").length < 2;
    },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "thunder",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const info = get.info("dcjianzhuan").choices;
      let choices = [];
      for (const i in info) {
        if (!player.getStorage("dcjianzhuan").includes(i)) {
          choices.push(i);
        }
      }
      if (choices.length) {
        for (const choice of choices) {
          for (let i = 1; i <= 3; i++) {
            await info[choice].content(player, 1);
          }
        }
      }
      await player.gainMaxHp(2);
      await player.recover(2);
      await player.changeSkills(["dcfudou"], ["dcjianzhuan"]);
    },
    derivation: "dcfudou",
    ai: { combo: "dcjianzhuan" }
  },
  dcfudou: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      if (event.targets.length != 1 || event.target == player) {
        return false;
      }
      const color = get.color(event.card);
      if (!["black", "red"].includes(color)) {
        return false;
      }
      const damage = event.target.getAllHistory("sourceDamage", (evt) => evt.player == player).length;
      return Math.min(1, damage) == (color == "black");
    },
    check(event, player) {
      const color = get.color(event.card);
      if (color == "red") {
        return get.attitude(player, event.target) > 0;
      }
      if (player.getHp() + player.countCards("hs", (card) => player.canSaveCard(card, player)) <= 1) {
        return false;
      }
      return get.effect(player, { name: "losehp" }, player, player) >= get.effect(event.target, { name: "losehp" }, player, player);
    },
    prompt2(event, player) {
      return "与" + get.translation(event.target) + "各" + (get.color(event.card) == "black" ? "失去1点体力" : "摸一张牌");
    },
    logTarget: "target",
    async content(event, trigger, player) {
      const color = get.color(trigger.card), target = trigger.target;
      if (color == "red") {
        await player.draw("nodelay");
        await target.draw();
      } else {
        await player.loseHp();
        await target.loseHp();
      }
    }
  },
  //司马师
  dcsanshi: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    group: ["dcsanshi_gain", "dcsanshi_directHit"],
    async content(event, trigger, player) {
      const recordedNumbers = [];
      let num = get.rand(0, ui.cardPile.childNodes.length - 1);
      for (let i = 0; i < ui.cardPile.childNodes.length; i++) {
        let j = i + num;
        if (j >= ui.cardPile.childNodes.length) {
          j -= ui.cardPile.childNodes.length;
        }
        const card = ui.cardPile.childNodes[j], number = get.number(card, false);
        if (!recordedNumbers.includes(number)) {
          recordedNumbers.add(number);
          card.storage.dcsanshi = true;
          num = get.rand(0, ui.cardPile.childNodes.length - 1);
        }
      }
      player.addSkill("dcsanshi_mark");
    },
    subSkill: {
      gain: {
        audio: "dcsanshi",
        trigger: { global: "phaseEnd" },
        filter(event, player) {
          return game.hasGlobalHistory("cardMove", (evt) => {
            if (evt.name == "lose") {
              if (evt.position !== ui.discardPile) {
                return false;
              }
            } else if (evt.name !== "cardsDiscard") {
              return false;
            }
            if (lib.skill.dcsanshi_gain.notUseOrRespond(evt, player)) {
              return evt.cards.some((card) => {
                return card.storage.dcsanshi && get.position(card) === "d";
              });
            }
            return false;
          });
        },
        forced: true,
        notUseOrRespond(event, player) {
          if (event.name !== "cardsDiscard") {
            return true;
          }
          const evtx = event.getParent();
          if (evtx.name !== "orderingDiscard") {
            return true;
          }
          const evt2 = evtx.relatedEvent || evtx.getParent();
          return !["useCard", "respond"].includes(evt2.name) || evt2.player !== player;
        },
        async content(event, trigger, player) {
          const cards2 = [];
          game.checkGlobalHistory("cardMove", (evt) => {
            if (evt.name == "lose") {
              if (evt.position !== ui.discardPile) {
                return false;
              }
            } else if (evt.name !== "cardsDiscard") {
              return false;
            }
            if (lib.skill.dcsanshi_gain.notUseOrRespond(evt, player)) {
              cards2.addArray(
                evt.cards.filter((card) => {
                  return card.storage.dcsanshi && get.position(card) === "d";
                })
              );
            }
          });
          if (cards2.length) {
            player.gain(cards2, "gain2");
          }
        }
      },
      directHit: {
        audio: "dcsanshi",
        trigger: { player: "useCard" },
        forced: true,
        filter(event, player) {
          return event.cards && event.cards.some((card) => {
            return card.storage.dcsanshi;
          });
        },
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.filterPlayer());
          game.log(trigger.card, "不可被响应");
        }
      },
      mark: {
        trigger: {
          player: "gainEnd",
          global: "loseAsyncEnd"
        },
        forced: true,
        popup: false,
        silent: true,
        lastDo: true,
        filter(event, player) {
          if (!["dcsanshi", "dcchenlve"].every((skill) => player.hasSkill(skill, null, false, false))) {
            return false;
          }
          const cards2 = event.getg(player);
          if (!cards2.length) {
            return false;
          }
          return cards2.some((card) => card.storage.dcsanshi);
        },
        async content(event, trigger, player) {
          var cards2 = trigger.getg(player);
          if (cards2.length) {
            cards2 = cards2.filter((card) => card.storage.dcsanshi);
            player.addGaintag(cards2, "dcsanshi_tag");
          }
        }
      }
    },
    ai: {
      threaten: 3
    }
  },
  dczhenrao: {
    audio: 2,
    trigger: { global: "useCardToPlayered" },
    filter(event, player) {
      if ((() => {
        if (event.player === player) {
          if (!event.isFirstTarget) {
            return false;
          }
          return event.targets.some((target) => target !== player);
        }
        return event.target === player;
      })()) {
        return event.targets.concat(event.player).some((target) => {
          return target.countCards("h") > player.countCards("h") && !player.getStorage("dczhenrao").includes(target);
        });
      }
      return false;
    },
    direct: true,
    async content(event, trigger, player) {
      const result = await player.chooseTarget(get.prompt("dczhenrao"), "对一名可选角色造成1点伤害", (card, player2, target2) => {
        return get.event().targets.includes(target2) && !player2.getStorage("dczhenrao").includes(target2);
      }).set(
        "targets",
        trigger.targets.concat(trigger.player).filter((target2) => target2.countCards("h") > player.countCards("h"))
      ).set("ai", (target2) => {
        const player2 = get.player();
        return get.damageEffect(target2, player2, player2);
      }).forResult();
      if (!result.bool) {
        return;
      }
      const target = result.targets[0];
      player.logSkill("dczhenrao", target);
      if (!player.storage.dczhenrao) {
        player.when({ global: "phaseAfter" }).step(async () => player.unmarkSkill("dczhenrao"));
      }
      player.markAuto("dczhenrao", target);
      await target.damage();
      await game.delayx();
    },
    intro: {
      content: "已以此法对$造成过伤害",
      onunmark: true
    },
    ai: {
      expose: 0.2,
      threaten: 3
    }
  },
  dcchenlve: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "thunder",
    manualConfirm: true,
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const cards2 = ["cardPile", "discardPile"].map((pos) => Array.from(ui[pos].childNodes)).flat();
      const sishiList = [];
      const isSishi = (card) => card.storage.dcsanshi;
      const lose_list = [], players = game.filterPlayer();
      players.forEach((current) => {
        const pos = "ej" + (current !== player ? "h" : "");
        const sishis = current.getCards(pos, isSishi);
        if (sishis.length > 0) {
          current.$throw(sishis);
          lose_list.push([current, sishis]);
          sishiList.addArray(sishis);
        }
      });
      if (lose_list.length) {
        await game.loseAsync({ lose_list }).setContent("chooseToCompareLose");
        await game.delayx();
      }
      sishiList.addArray(cards2.filter(isSishi));
      player.gain(sishiList, "gain2");
      player.when("phaseUseEnd").filter((evt) => evt === event.getParent("phaseUse")).step(async () => {
        const lose_list2 = [], players2 = game.filterPlayer();
        players2.forEach((current) => {
          const cards3 = current.getCards("hej").filter((card) => sishiList.includes(card));
          if (cards3.length > 0) {
            current.$throw(cards3, 1e3);
            lose_list2.push([current, cards3]);
          }
        });
        if (lose_list2.length) {
          await game.loseAsync({ lose_list: lose_list2 }).setContent("chooseToCompareLose");
        }
        await game.cardsGotoSpecial(sishiList);
        game.log(sishiList, "被移出了游戏");
      });
      player.when("die").assign({
        forceDie: true
      }).step(async () => {
        await game.cardsDiscard(sishiList);
        game.log(sishiList, "被置入了弃牌堆");
      });
    },
    ai: {
      order: 0.5,
      result: {
        player(player) {
          if (player.getHp(true) > 1 && player.countCards("he") > 1) {
            return 0;
          }
          if (!player.isDamaged() && (player.countCards("h") > 1 || player.countCards("e") > 0)) {
            return 0;
          }
          return 13;
        }
      },
      combo: "dcsanshi"
    }
  },
  //王凌
  dcjichou: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player) {
      const evts = player.getHistory("useCard");
      const names = evts.map((evt) => evt.card.name).unique();
      return evts.length > 0 && evts.length === names.length && evts.some((evt) => evt.cards.some((card) => get.position(card) === "d"));
    },
    async content(event, trigger, player) {
      const cards2 = [];
      player.checkHistory("useCard", (evt) => {
        cards2.addArray(evt.cards.filterInD("d"));
      });
      const num = Math.min(cards2.length, game.countPlayer());
      if (_status.connectMode) {
        game.broadcastAll(() => {
          _status.noclearcountdown = true;
        });
      }
      const { bool, links } = await player.chooseButton([`集筹：将${num < cards2.length ? "至多" + get.cnNumber(num) + "张牌" : "任意张牌"}交给等量角色`, cards2], "allowChooseAll").set("selectButton", [1, num]).set("population", [game.countPlayer((current) => get.attitude(player, current) > 0), game.countPlayer((current) => get.attitude(player, current) < 0)]).set("ai", (button) => {
        const card = button.link, population = get.event().population;
        if (ui.selected.buttons.length > population[0] + population[1]) {
          return 0;
        }
        if (ui.selected.buttons.length > get.event().population[0]) {
          return 2 - get.value(card);
        }
        return 2 + get.value(card);
      }).forResult();
      if (bool) {
        const { bool: bool2, targets } = await player.chooseTarget(`集筹：请选择${get.cnNumber(links.length)}名角色`, `操作提示：请按照顺序选择要交给牌的目标，令这些角色按顺序获得这些牌：${get.translation(links)}`, true, links.length).set(
          "values",
          links.map((i) => get.value(i))
        ).set("ai", (target) => {
          const att = get.attitude(get.player(), target);
          const chosenNum = ui.selected.targets.length, values = get.event().values;
          if (values[chosenNum] > 0) {
            return att;
          }
          return 0.01 - att;
        }).forResult();
        if (_status.connectMode) {
          game.broadcastAll(() => {
            delete _status.noclearcountdown;
            game.stopCountChoose();
          });
        }
        if (bool2) {
          const gain_list = [], givenCards = [];
          targets.forEach((target, i) => {
            player.line(target, "green");
            gain_list.push([target, links[i]]);
            givenCards.push(links[i]);
            game.log(player, "将", links[i], "交给了", target);
          });
          event.getParent().set("givenCards", givenCards);
          await game.loseAsync({
            gain_list,
            player,
            cards: givenCards,
            giver: player,
            animate: "gain2"
          }).setContent("gaincardMultiple");
          const names = givenCards.map((card) => card.name).toUniqued();
          await game.delayx();
          const newNames = names.filter((name) => !player.getStorage(event.name).includes(name));
          if (newNames.length) {
            player.markAuto(event.name, newNames);
            await player.draw(newNames.length);
          }
        }
      }
      if (_status.connectMode) {
        game.broadcastAll(() => {
          delete _status.noclearcountdown;
          game.stopCountChoose();
        });
      }
    },
    onremove: true,
    intro: { content: "已交出牌名：$" }
  },
  dcmouli: {
    audio: 2,
    trigger: { player: "phaseEnd" },
    filter(event, player) {
      const names = [];
      player.checkAllHistory("useSkill", (evt) => {
        if (evt.skill !== "dcjichou") {
          return;
        }
        const evtx = evt.event;
        if (evtx.givenCards) {
          names.addArray(evtx.givenCards.map((card) => get.name(card, false)));
        }
      });
      return names.length > 5;
    },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "water",
    derivation: ["dczifu"],
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.gainMaxHp();
      await player.recover();
      await player.addSkills("dczifu");
    },
    ai: {
      combo: "dcjichou"
    }
  },
  dczifu: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    forced: true,
    async content(event, trigger, player) {
      const maxLimit = Math.min(5, player.maxHp);
      let count = player.countCards("h");
      if (count < maxLimit) {
        await player.draw(maxLimit - count);
      }
      if (!player.hasHistory("gain", (evt) => evt.getParent(2) === event)) {
        return;
      }
      count = player.countCards("h");
      const toKeepCount = player.getCards("h").map((card) => get.name(card)).unique().length;
      if (count > toKeepCount) {
        const { bool, cards: cards2 } = await player.chooseCard("自缚：选择要保留的手牌", "选择不同牌名的手牌各一张，然后弃置其余手牌", toKeepCount).set("filterCard", (card) => {
          if (!ui.selected.cards.length) {
            return true;
          }
          const name = get.name(card, player);
          if (ui.selected.cards.some((card2) => get.name(card2, player) === name)) {
            return false;
          }
          return true;
        }).set("complexCard", true).set("ai", get.value).forResult();
        if (!bool) {
          return;
        }
        const toDiscard = player.getCards("h").removeArray(cards2);
        if (toDiscard.length) {
          player.discard(toDiscard);
        }
      }
    },
    ai: {
      halfneg: true
    }
  },
  //蒋济
  dcshiju: {
    audio: 2,
    global: "dcshiju_global",
    subSkill: {
      global: {
        audio: "dcshiju",
        forceaudio: true,
        enable: "phaseUse",
        filter(event, player) {
          if (!player.countCards("he")) {
            return false;
          }
          return game.hasPlayer((current) => current.hasSkill("dcshiju") && !current.hasSkill("dcshiju_targeted"));
        },
        filterTarget(card, player, target) {
          return target.hasSkill("dcshiju") && !target.hasSkill("dcshiju_targeted");
        },
        selectTarget() {
          const num = game.countPlayer((current) => current.hasSkill("dcshiju") && !current.hasSkill("dcshiju_targeted"));
          return num > 1 ? 1 : -1;
        },
        filterCard: true,
        position: "he",
        check(card) {
          const player = get.player();
          if (get.type(card) === "equip") {
            const subtype = get.subtype(card);
            let valueFix = 0;
            if (game.hasPlayer((current) => {
              if (!current.hasSkill("dcshiju") || current.hasSkill("dcshiju_targeted")) {
                return false;
              }
              if (current.hasUseTarget(card) && !player.countEmptySlot(subtype)) {
                return true;
              }
            })) {
              valueFix += 5;
            }
            return valueFix + 6 - get.value(card);
          }
          if (get.is.damageCard(card)) {
            return 10 - get.value(card);
          }
          return 6 - get.value(card);
        },
        prompt() {
          const list = game.filterPlayer((current) => {
            return current.hasSkill("dcshiju") && !current.hasSkill("dcshiju_targeted");
          });
          return `将一张牌交给${get.translation(list)}${list.length > 1 ? "中的一人" : ""}，其可以使用此牌，且你本回合的攻击范围+X（X为其装备区的牌数）。若此牌为装备牌或此牌造成了伤害，你与其各摸两张牌。`;
        },
        discard: false,
        lose: false,
        log: false,
        prepare(cards2, player, targets) {
          targets[0].logSkill("dcshiju");
        },
        async content(event, trigger, player) {
          const card = event.cards[0], target = event.target;
          target.addTempSkill("dcshiju_targeted", "phaseUseAfter");
          if (target != player) {
            await player.give(card, target);
          } else if (get.type(card) == "equip" && get.position(card) == "e") {
            await player.give(card, target);
          }
          if (!target.getCards("h").includes(card)) {
            return;
          }
          const next = target.chooseUseTarget(card);
          const result = await next.forResult();
          if (!result?.bool) {
            return;
          }
          const count = target.countCards("e");
          if (count > 0) {
            player.addTempSkill("dcshiju_range");
            player.addMark("dcshiju_range", count, false);
          }
          if (get.type(card) == "equip" || target.hasHistory("sourceDamage", (evt) => evt.getParent(3) === next)) {
            await game.asyncDraw([player, target], 2);
          }
        },
        ai: {
          order: 8,
          result: {
            target(player, target) {
              const card = ui.selected.cards[0];
              if (!card) {
                return;
              }
              if (target.hasSkillTag("nogain")) {
                return 0;
              }
              if (card.name == "du" && target.hasSkillTag("nodu")) {
                return 0;
              }
              if (get.value(card) < 0) {
                return -5;
              }
              const nh = target.countCards("h");
              return Math.max(1, 5 - nh);
            }
          }
        }
      },
      range: {
        charlotte: true,
        onremove: true,
        mod: {
          attackRange(player, num) {
            return num + player.countMark("dcshiju_range");
          }
        },
        intro: { content: "本回合攻击范围+#" }
      },
      targeted: { charlotte: true }
    }
  },
  dcyingshi: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      if (!event.isFirstTarget) {
        return false;
      }
      if (event.card.storage?.dcyingshi) {
        return false;
      }
      return get.type(event.card) === "trick";
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget().set("prompt", get.prompt2(event.skill)).set("filterTarget", (card, player2, target) => {
        return get.event().getTrigger().targets.includes(target);
      }).set("ai", (target) => {
        const player2 = get.player(), trigger2 = get.event().getTrigger();
        const num = player2.countCards("e");
        const effect = get.effect(target, trigger2.card, player2, player2);
        if (!num) {
          if (effect > 0 && get.attitude(player2, target) < 0) {
            return 0;
          }
          return effect;
        }
        return Math.max(effect, get.effect(target, { name: "guohe_copy2" }, target, player2) * num);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0], count = player.countCards("e") + 1;
      let result;
      const prompt = `###${get.translation(player)}对你发动了【应时】###弃置${get.cnNumber(count)}张牌，令其本回合不能再发动〖应时〗，或令其于此牌结算后视为对你使用一张同名牌"`;
      result = await target.chooseToDiscard(prompt, count, "he").set("ai", (card) => {
        if (get.event().goon) {
          return 15 - get.value(card);
        }
        return 0;
      }).set("goon", !get.tag(trigger.card, "norepeat") && get.effect(target, trigger.card, trigger.player, target) < 0).forResult();
      if (result?.bool) {
        player.tempBanSkill("dcyingshi");
      } else {
        const cardx = {
          name: trigger.card.name,
          nature: trigger.card.nature,
          isCard: true,
          storage: { dcyingshi: true }
        };
        player.when({ global: "useCardAfter" }).filter((evt) => evt === trigger.getParent()).step(async (event2, trigger2, player2) => {
          const next = player2.useCard(get.copy(cardx), target, false);
          if (trigger2.addedTarget) {
            next.addedTarget = trigger2.addedTarget;
          }
          if (trigger2.addedTargets && trigger2.addedTargets.length) {
            next.addedTargets = trigger2.addedTargets.slice(0);
          }
        });
      }
    }
  },
  //公孙修
  dcgangu: {
    audio: 2,
    trigger: { global: "loseHpAfter" },
    filter(event, player) {
      return event.player !== player;
    },
    usable: 1,
    forced: true,
    async content(event, trigger, player) {
      await player.draw(3);
      if (!player.isMinHp()) {
        await player.loseHp();
      }
    },
    ai: {
      combo: "dckuizhen",
      halfneg: true
    }
  },
  dckuizhen: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.hasCards("h", (card) => game.hasPlayer((current) => current != player && lib.filter.canBeGained(card, player, current)));
    },
    filterTarget(card, player, target) {
      if (target == player || !ui.selected.cards?.length) {
        return false;
      }
      return ui.selected.cards.every((cardx) => lib.filter.canBeGained(cardx, player, target));
    },
    filterCard: true,
    selectCard: [1, Infinity],
    allowChooseAll: true,
    position: "h",
    check(card) {
      return 8 - get.value(card);
    },
    discard: false,
    lose: false,
    delay: 0,
    usable: 1,
    async content(event, trigger, player) {
      const {
        targets: [target],
        cards: cards2
      } = event;
      const num = cards2.length;
      const next = player.give(cards2, target);
      next.gaintag.add(event.name);
      await next;
      await player.randomGain({ num, position: "h", target });
    },
    ai: {
      order: 1,
      result: {
        player: 1,
        target: -1
      }
    },
    group: ["dckuizhen_effect"],
    subSkill: {
      effect: {
        audio: "dckuizhen",
        forced: true,
        locked: false,
        trigger: { global: ["useCard", "phaseEnd"] },
        filter(event, player) {
          const target = event.player;
          if (event.name == "phase") {
            return game.hasPlayer((current) => {
              return !current.hasCards("h", (card) => card.hasGaintag("dckuizhen")) && current.hasHistory("lose", (evt) => {
                for (const i in evt.gaintag_map) {
                  if (evt.gaintag_map[i].includes("dckuizhen")) {
                    return true;
                  }
                }
                return false;
              });
            });
          }
          return target.hasHistory("lose", (evt) => {
            if (evt.getParent() != event) {
              return false;
            }
            for (const i in evt.gaintag_map) {
              if (evt.gaintag_map[i].includes("dckuizhen")) {
                return true;
              }
            }
            return false;
          });
        },
        logTarget(event, player) {
          if (event.name == "useCard") {
            return event.player;
          }
          return game.filterPlayer((current) => {
            return !current.hasCards("h", (card) => card.hasGaintag("dckuizhen")) && current.hasHistory("lose", (evt) => {
              for (const i in evt.gaintag_map) {
                if (evt.gaintag_map[i].includes("dckuizhen")) {
                  return true;
                }
              }
              return false;
            });
          }).sortBySeat();
        },
        async content(event, trigger, player) {
          const targets = event.targets;
          if (trigger.name == "useCard") {
            await player.draw({ num: 1 });
          } else {
            await game.doAsyncInOrder(targets, async (target) => {
              await target.loseHp();
            });
          }
        }
      }
    }
  },
  //刘理
  dcfuli: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.countDiscardableCards(player, "h");
    },
    usable: 1,
    async content(event, trigger, player) {
      await player.showHandcards(get.translation(player) + "发动了【抚黎】");
      const getNum = (type) => {
        let num = ["basic", "trick", "equip"].indexOf(type);
        if (num === -1) {
          num = 3;
        }
        return num;
      };
      const types = player.getDiscardableCards(player, "h").reduce((list, card) => {
        return list.add(get.type2(card));
      }, []).sort((a, b) => getNum(a) - getNum(b));
      if (types.length) {
        const { control } = await player.chooseControl(types).set("ai", () => {
          const player2 = get.event().player, types2 = get.event().controls.slice();
          const getNum2 = (type) => {
            const cards2 = player2.getDiscardableCards(player2, "h").filter((card) => get.type2(card) == type);
            const countCards = (target, player3, cards3) => {
              return target.countCards("h") - (target == player3 ? cards3.length : 0);
            };
            const max = game.findPlayer((target) => {
              return !game.hasPlayer((target2) => {
                return countCards(target2, player2, cards2) > countCards(target, player2, cards2);
              });
            }).countCards("h");
            return Math.min(
              max,
              cards2.reduce((sum, card) => sum + get.cardNameLength(card), 0)
            ) / cards2.length;
          };
          return types2.sort((a, b) => {
            return getNum2(b) - getNum2(a);
          })[0];
        }).set("prompt", "弃置一种类别的所有手牌，然后摸这些牌的名字字数之和的牌").forResult();
        if (control) {
          const cards2 = player.getDiscardableCards(player, "h").filter((card) => get.type2(card) == control);
          await player.discard(cards2);
          const max = game.findPlayer((target) => target.isMaxHandcard()).countCards("h");
          const num = Math.min(
            max,
            cards2.reduce((sum, card) => sum + get.cardNameLength(card), 0)
          );
          if (num) {
            await player.draw(num);
          }
          const goon = cards2.some((card) => get.is.damageCard(card));
          const { bool, targets } = await player.chooseTarget("抚黎：是否令一名角色的攻击范围" + (goon ? "减至0" : "-1") + "直到你的下个回合开始？", (card, player2, target) => {
            return !get.event().goon || target.getAttackRange() > 0;
          }).set("ai", (target) => {
            const player2 = get.event().player, num2 = target.getAttackRange();
            if (get.attitude(player2, target) > 0) {
              return -1;
            }
            if (get.event().goon) {
              return num2;
            }
            if (num2 < 1) {
              return 1 / (1 - num2);
            }
            return 5 / num2;
          }).set("goon", goon).forResult();
          if (bool) {
            const target = targets[0];
            player.line(target);
            target.addSkill("dcfuli_range");
            target.addMark("dcfuli_range", goon ? target.getAttackRange() : 1, false);
            player.when(["phaseBegin", "dieBegin"]).step(async () => {
              target.removeMark("dcfuli_range", target.countMark("dcfuli_range"), false);
              if (!target.hasMark("dcfuli_range")) {
                target.removeSkill("dcfuli_range");
              }
            });
          }
        }
      }
    },
    ai: {
      order: 1,
      result: {
        player(player) {
          const types = player.getDiscardableCards(player, "h").reduce((list, card) => {
            return list.add(get.type2(card));
          }, []);
          if (!types.some((type) => {
            const cards2 = player.getDiscardableCards(player, "h").filter((card) => get.type2(card) == type);
            const countCards = (target, player2, cards3) => {
              return target.countCards("h") - (target == player2 ? cards3.length : 0);
            };
            return !game.filterPlayer((target) => {
              return !game.hasPlayer((target2) => {
                return countCards(target2, player, cards2) > countCards(target, player, cards2);
              });
            }).includes(player);
          })) {
            return 0;
          }
          return 1;
        }
      }
    },
    subSkill: {
      range: {
        charlotte: true,
        onremove: true,
        mod: {
          attackRange(player, num) {
            return num - player.countMark("dcfuli_range");
          }
        },
        marktext: " - ",
        intro: { content: "攻击范围-#" }
      }
    }
  },
  dcdehua: {
    audio: 2,
    trigger: { global: "roundStart" },
    forced: true,
    async content(event, trigger, player) {
      const list = lib.inpile.filter((name) => {
        if (get.type(name) === "delay" || player.getStorage("dcdehua").includes(name)) {
          return false;
        }
        const card = new lib.element.VCard({ name, isCard: true });
        return get.tag(card, "damage") && player.hasUseTarget(card);
      });
      if (list.length) {
        const { bool, links } = await player.chooseButton(['###德化###<div class="text center">视为使用一张未以此法选择过且可以使用的伤害类卡牌</div>', [list, "vcard"]], true).set("ai", (button) => {
          const name = button.link[2], player2 = get.player();
          let value = player2.getUseValue({ name, isCard: true }, null, true);
          if (player2.countCards("h", (card) => get.name(card) === name && player2.hasUseTarget(card))) {
            value /= 3;
          }
          if (name === "sha") {
            value /= 2;
          }
          return value;
        }).forResult();
        if (bool) {
          const name = links[0][2], card = new lib.element.VCard({ name, isCard: true });
          await player.chooseUseTarget(card, true);
          player.markAuto("dcdehua", [name]);
        }
      }
      if (!lib.inpile.some((name) => {
        if (get.type(name) === "delay") {
          return false;
        }
        const card = new lib.element.VCard({ name });
        return get.tag(card, "damage") && !player.getStorage("dcdehua").includes(name);
      })) {
        await player.removeSkills("dcdehua");
        player.addSkill("dcdehua_hand");
      }
    },
    mod: {
      maxHandcard(player, num) {
        return num + player.getStorage("dcdehua").length;
      },
      cardEnabled(card, player) {
        if (player.getStorage("dcdehua").includes(card.name) && (get.position(card) == "h" || card.cards && card.cards.some((i) => get.position(i) == "h"))) {
          return false;
        }
      },
      cardSavable(card, player) {
        if (player.getStorage("dcdehua").includes(card.name) && (get.position(card) == "h" || card.cards && card.cards.some((i) => get.position(i) == "h"))) {
          return false;
        }
      },
      aiValue(player, card) {
        if (player.getStorage("dcdehua").includes(get.name(card))) {
          return 0;
        }
      },
      aiUseful() {
        return lib.skill.dcdehua.mod.aiValue.apply(this, arguments);
      }
    },
    intro: {
      content(storage) {
        return "<li>手牌上限+" + storage.length + "<br><li>不能使用手牌中的" + get.translation(storage);
      }
    },
    subSkill: {
      hand: {
        charlotte: true,
        mark: true,
        intro: { content: "伤害牌不计入手牌上限" },
        mod: {
          ignoredHandcard(card) {
            if (get.is.damageCard(card)) {
              return true;
            }
          },
          cardDiscardable(card, _, name) {
            if (name == "phaseDiscard" && get.is.damageCard(card)) {
              return false;
            }
          }
        }
      }
    }
  },
  //蒋琬费祎
  dcshoucheng: {
    audio: "shoucheng",
    global: "dcshoucheng_ai",
    trigger: {
      global: ["equipAfter", "addJudgeAfter", "loseAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    filter(event, player) {
      const target = _status.currentPhase;
      return game.hasPlayer((current) => {
        if (target && current == target) {
          return false;
        }
        let evt = event.getl(current);
        return evt && evt.hs && evt.hs.length && current.countCards("h") == 0;
      });
    },
    async cost(event, trigger, player) {
      const targetx = _status.currentPhase;
      const targets = game.filterPlayer((current) => {
        if (targetx && current == targetx || !current.isIn()) {
          return false;
        }
        let evt = trigger.getl(current);
        return evt && evt.hs && evt.hs.length && current.countCards("h") == 0;
      }).sortBySeat(targetx || player);
      event.result = await player.chooseTarget("是否对" + (targets.length > 1 ? "其中一名角色" : get.translation(targets[0])) + "发动【守成】？", "令其摸两张牌", (card, player2, target) => {
        return get.event().targets.includes(target);
      }).set("targets", targets).set("ai", (target) => get.attitude(get.event().player, target)).forResult();
    },
    usable: 1,
    async content(event, trigger, player) {
      const target = event.targets[0];
      if (get.mode() != "identity" || player.identity != "nei") {
        player.addExpose(0.2);
      }
      target.draw(2);
    },
    subSkill: {
      ai: {
        ai: {
          noh: true,
          skillTagFilter(player, tag, arg) {
            if (player === _status.currentPhase || player.countCards("h") != 1) {
              return false;
            }
            return game.hasPlayer((current) => {
              return current.hasSkill("dcshoucheng") && get.attitude(current, player) > 0;
            });
          }
        }
      }
    }
  },
  //乐大乔
  dczixi: {
    init() {
      game.addGlobalSkill("dczixi_judge");
      game.broadcastAll(() => lib.skill.dczixi.video());
    },
    video() {
      const list = lib.skill.dczixi.zixiList;
      for (const name of list) {
        const namex = "dczixi_" + name;
        if (!lib.card[namex]) {
          lib.card[namex] = {
            type: "special_delay",
            fullskin: true,
            noEffect: true,
            wuxieable: false,
            judgeSlots: [name]
          };
          lib.card[namex].cardimage = name;
          lib.translate[namex] = lib.translate[name] + "·姊希";
          lib.translate[namex + "_info"] = "由【姊希】技能创造的无效果【" + lib.translate[name] + "】";
        }
      }
    },
    audio: 2,
    trigger: { player: ["phaseUseBegin", "phaseUseEnd"] },
    filter(event, player) {
      return player.hasCards("he", (card) => {
        return card.hasGaintag("eternal_dcqiqin_tag") && lib.skill.dczixi.zixiList.some((name) => {
          return game.hasPlayer((target) => target.canAddJudge(get.autoViewAs({ name: "dczixi_" + name }, [card])));
        });
      });
    },
    zixiList: ["lebu", "bingliang", "shandian"],
    selectAi(player, names) {
      const maxMap = /* @__PURE__ */ new Map();
      const cards2 = player.getCards("he", (card) => {
        return card.hasGaintag("eternal_dcqiqin_tag") && get.value(card) < 7;
      });
      if (!cards2.length) {
        return maxMap;
      }
      const targets = game.filterPlayer();
      const attitudeMap = /* @__PURE__ */ new Map();
      targets.forEach((target) => {
        attitudeMap.set(target, get.attitude(player, target));
      });
      for (const name of names) {
        let max = [0, null, null];
        let res = [null, null, 0];
        for (const card of cards2) {
          const card1 = get.autoViewAs({ name: `dczixi_${name}` }, [card]);
          const card2 = get.autoViewAs({ name }, [card]);
          for (const target of targets.filter((current) => current.canAddJudge(card1))) {
            const eff = get.effect(target, card2, player, player);
            const attitude = attitudeMap.get(target);
            if (attitude > 0) {
              if (-eff > res[2]) {
                res = [target, card, -eff / 16];
              }
            } else {
              if (eff > res[2]) {
                res = [target, card, eff];
              }
            }
            if (res[0] && res[2] > max[0]) {
              max = [res[2], res[1], res[0]];
            }
          }
        }
        maxMap.set(get.translation(name), max);
      }
      return maxMap;
    },
    async cost(event, trigger, player) {
      game.addVideo("skill", player, ["dczixi", []]);
      const dialog = [];
      dialog.push(`###${get.prompt("dczixi")}###<div class="text center">将至多两张“琴”以你选择的牌名置于一名角色的判定区</div>`);
      const hs = player.getCards("h", (card) => card.hasGaintag("eternal_dcqiqin_tag"));
      const es = player.getCards("e", (card) => card.hasGaintag("eternal_dcqiqin_tag"));
      if (hs.length) {
        dialog.addArray(['<div class="text center">你的手牌</div>', hs]);
      }
      if (es.length) {
        dialog.addArray(['<div class="text center">你的装备</div>', es]);
      }
      const names = lib.skill.dczixi.zixiList.filter((name) => {
        return player.hasCards("he", (card) => {
          return card.hasGaintag("eternal_dcqiqin_tag") && game.hasPlayer((target) => target.canAddJudge(get.autoViewAs({ name: "dczixi_" + name }, [card])));
        });
      });
      let map = {};
      for (const name of names) {
        map[get.translation(name)] = name;
      }
      const maxMap = lib.skill.dczixi.selectAi(player, Object.values(map));
      dialog.push([Object.keys(map), "tdnodes"]);
      const result = await player.chooseButtonTarget({
        createDialog: dialog,
        filterButton(button) {
          const type = typeof button.link, card = button.link;
          const { player: player2, map: map2 } = get.event();
          if (type == "string") {
            if (ui.selected.buttons.filter((button2) => typeof button2.link == "string").length < 2) {
              const name = map2[card];
              return game.hasPlayer((target) => {
                return player2.hasCards("he", (cardx) => {
                  return cardx.hasGaintag("eternal_dcqiqin_tag") && target.canAddJudge(get.autoViewAs({ name: "dczixi_" + name }, [cardx]));
                });
              });
            }
          } else {
            if (ui.selected.buttons.filter((button2) => typeof button2.link != "string").length < 2) {
              const names2 = ui.selected.buttons.filter((button2) => typeof button2.link == "string").map((button2) => map2[button2.link]);
              if (names2.length) {
                return game.hasPlayer((target) => {
                  return names2.some((name) => card.hasGaintag("eternal_dcqiqin_tag") && target.canAddJudge(get.autoViewAs({ name: "dczixi_" + name }, [card])));
                });
              }
            }
          }
          return false;
        },
        selectButton: [1, 4],
        filterTarget(card, player2, target) {
          const links = ui.selected.buttons.map((button) => button.link);
          const map2 = get.event().map;
          const namex = links.filter((link) => typeof link == "string"), cards2 = links.filter((link) => !namex.includes(link));
          for (let i = 0; i < namex.length; i++) {
            const name = map2[namex[i]], card2 = cards2[i];
            if (!target.canAddJudge(get.autoViewAs({ name: "dczixi_" + name }, [card2]))) {
              return false;
            }
          }
          return true;
        },
        filterOk() {
          if (![2, 4].includes(ui.selected.buttons.length)) {
            return false;
          }
          return ui.selected.buttons.filter((button) => typeof button.link == "string").length == ui.selected.buttons.filter((button) => typeof button.link != "string").length;
        },
        ai1(button) {
          const { maxMap: maxMap2 } = get.event();
          const size = maxMap2.size;
          if (!size) {
            return 0;
          }
          if (ui.selected.buttons.length > 1) {
            return 0;
          }
          if (!ui.selected.buttons.length) {
            if (typeof button.link !== "string") {
              return 0;
            }
            const val = maxMap2.get(button.link);
            if (!val) {
              return 0;
            }
            return val[0];
          } else {
            if (typeof button.link == "string") {
              return 0;
            }
            if (ui.selected.buttons.some((btn) => typeof btn.link == "string" && maxMap2.get(btn.link)?.[1] == button.link)) {
              return 1;
            }
            return 0;
          }
        },
        ai2(target) {
          const { maxMap: maxMap2 } = get.event();
          if (ui.selected.buttons.some((btn) => typeof btn.link == "string" && maxMap2.get(btn.link)?.[2] == target)) {
            return 1;
          }
          return 0;
        },
        complexSelect: true,
        complexTarget: true
      }).set("map", map).set("maxMap", maxMap).forResult();
      if (result?.bool && result.links?.length && result.targets?.length) {
        event.result = {
          bool: true,
          cost_data: result.links,
          targets: result.targets
        };
      }
    },
    async content(event, trigger, player) {
      const {
        targets: [target],
        cost_data: links
      } = event;
      const namex = links.filter((link) => typeof link == "string"), cards2 = links.filter((link) => !namex.includes(link));
      const names = lib.skill.dczixi.zixiList.filter((name) => {
        return player.hasCards("he", (card) => {
          return card.hasGaintag("eternal_dcqiqin_tag") && game.hasPlayer((target2) => target2.canAddJudge(get.autoViewAs({ name: "dczixi_" + name }, [card])));
        });
      });
      let map = {};
      for (const name of names) {
        map[get.translation(name)] = name;
      }
      player.$give(cards2, target, false);
      await game.delay(0.5);
      for (let i = 0; i < namex.length; i++) {
        const name = map[namex[i]], card = cards2[i];
        await target.addJudge({ name: "dczixi_" + name }, [card]);
      }
    },
    ai: { combo: "dcqiqin" },
    group: "dczixi_effect",
    subSkill: {
      judge: {
        ai: {
          threaten(player, target) {
            if (!player.hasSkill("dczixi") || ![1, 2, 3].includes(target.countCards("j"))) {
              return;
            }
            return 3 + target.countCards("j");
          }
        }
      },
      effect: {
        audio: "dczixi",
        trigger: { player: "useCardToTargeted" },
        filter(event, player) {
          return event.isFirstTarget && event.targets.length == 1 && [1, 2, 3].includes(event.target.countCards("j")) && (get.type(event.card) == "basic" || get.type(event.card) == "trick");
        },
        prompt2(event, player) {
          const target = event.target, str = get.translation(target);
          return ["令" + get.translation(event.card) + "对" + str + "额外结算一次", "摸两张牌", "获得" + str + "判定区和装备区里的所有牌，并对其造成3点伤害"][target.countCards("j") - 1];
        },
        check(event, player) {
          const target = event.target, num = target.countCards("j");
          if (num == 2) {
            return true;
          }
          if (num == 1) {
            return get.effect(target, event.card, player, player) > 0;
          }
          return get.attitude(player, target) < 0 && get.damageEffect(target, player, player) > 0;
        },
        logTarget: "target",
        async content(event, trigger, player) {
          const target = trigger.target, num = target.countCards("j");
          switch (num) {
            case 1:
              trigger.getParent().effectCount++;
              game.log(trigger.card, "额外结算一次");
              break;
            case 2:
              await player.draw(2);
              break;
            case 3:
              const cards2 = target.getGainableCards(player, "ej");
              if (cards2.length) {
                await player.gain({ cards: cards2, source: target, animate: "giveAuto", bySelf: true });
              }
              await target.damage(3);
              break;
          }
        },
        ai: {
          effect: {
            player_use(card, player, target) {
              if (!target || player._dczixi_effect_use || get.tag(card, "multitarget")) {
                return;
              }
              let js = target.countCards("j");
              if (js == 1) {
                return [2, 0, 2, 0];
              } else if (js == 2) {
                return [1, 2];
              } else if (js == 3 && get.attitude(player, target) < 0) {
                player._dczixi_effect_use = true;
                let eff = get.damageEffect(target, player, player);
                delete player._dczixi_effect_use;
                if (eff > 0) {
                  return [1, 0, 1, -6];
                }
              }
            }
          }
        }
      }
    }
  },
  //孔融
  dckrmingshi: {
    audio: "mingshi",
    trigger: { player: "damageBegin4" },
    filter(event, player) {
      return event.source && event.source.countCards("h") > player.countCards("h");
    },
    forced: true,
    logTarget: "source",
    async content(event, trigger, player) {
      const target = trigger.source;
      const { bool } = await target.chooseToDiscard("名士：弃置一张手牌，或令对" + get.translation(player) + "造成的伤害-1").set("ai", (card) => {
        if (get.event().goon) {
          return 0;
        }
        return 6 - get.value(card);
      }).set("goon", get.damageEffect(player, target, target) <= 0).forResult();
      if (!bool) {
        trigger.num--;
      }
    },
    ai: {
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "damage") && target != player) {
            if (_status.event.name == "dckrmingshi") {
              return;
            }
            if (get.attitude(player, target) > 0 && current < 0) {
              return "zeroplayertarget";
            }
            var bs = player.getCards("h");
            bs.remove(card);
            if (card.cards) {
              bs.removeArray(card.cards);
            } else {
              bs.removeArray(ui.selected.cards);
            }
            if (bs.length > target.countCards("h")) {
              if (bs.some((bsi) => get.value(bsi) < 7)) {
                return [1, 0, 1, -0.5];
              }
              return [1, 0, 0.3, 0];
            }
            return [1, 0, 1, -0.5];
          }
        }
      }
    }
  },
  //新服SP孟获
  dcmanwang: {
    audio: "spmanwang",
    inherit: "spmanwang",
    check(card) {
      var player = _status.event.player;
      var max = Math.min(player.isDamaged() ? 3 : 2, 4 - player.countMark("dcmanwang"));
      if (!max && !player.hasSkill("dcpanqin")) {
        return 0;
      }
      if (max == 0 && ui.selected.length > 0) {
        return 0;
      }
      return 7 - ui.selected.cards.length - get.value(card);
    },
    async content(event, trigger, player) {
      const num = Math.min(event.cards.length, 4 - player.countMark("dcmanwang"));
      if (num >= 1) {
        await player.addSkills("dcpanqin");
      }
      if (num >= 2) {
        await player.draw();
      }
      if (num >= 3) {
        await player.recover();
      }
      if (num >= 4) {
        await player.draw({ num: 2 });
        await player.removeSkills("dcpanqin");
      }
    },
    ai: {
      order: 2,
      result: {
        player(player, target) {
          if (player.getUseValue({ name: "nanman" }) <= 0) {
            return 0;
          }
          if (player.getStat("skill").spmanwang && player.hasSkill("dcpanqin")) {
            return 0;
          }
          return 1;
        }
      }
    },
    derivation: "dcpanqin"
  },
  dcpanqin: {
    audio: "sppanqin",
    inherit: "sppanqin",
    async content(event, trigger, player) {
      const cards2 = [];
      for (const evt of player.getHistory("lose", (evt2) => evt2.type === "discard" && evt2.getParent(trigger.name) === trigger)) {
        for (const card of evt.cards2) {
          if (get.position(card, true) === "d") {
            cards2.add(card);
          }
        }
      }
      player.addTempSkill("dcpanqin_eff");
      await player.chooseUseTarget({
        forced: true,
        card: get.autoViewAs({ name: "nanman" }),
        cards: cards2
      });
    },
    subSkill: {
      eff: {
        charlotte: true,
        trigger: { player: "useCard" },
        filter(event, player) {
          return event.card.name == "nanman" && event.getParent(2).name == "dcpanqin" && player.countMark("dcmanwang") < 4 && player.hasSkill("dcmanwang", null, null, false) && event.cards.length <= event.targets.length;
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const { source, target, targets, card, cards: cards2, skill, forced, num } = event;
          player.addMark("dcmanwang", 1, false);
          switch (player.countMark("dcmanwang")) {
            case 1: {
              await player.draw(2);
              await player.removeSkills("dcpanqin");
              break;
            }
            case 2: {
              await player.recover();
              break;
            }
            case 3: {
              await player.draw();
              break;
            }
            case 4: {
              await player.addSkills("dcpanqin");
              break;
            }
          }
          await player.gainMaxHp();
          await player.recover();
        }
      }
    }
  },
  //小乔
  dcqiqin: {
    audio: 2,
    audioname: ["yue_daqiao"],
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    forced: true,
    async content(event, trigger, player) {
      const cards2 = player.getCards("h");
      player.addGaintag(cards2, "eternal_dcqiqin_tag");
    },
    group: "dcqiqin_restore",
    subSkill: {
      tag: {},
      restore: {
        audio: "dcqiqin",
        audioname: ["yue_daqiao"],
        trigger: { player: "phaseZhunbeiBegin" },
        filter(event, player) {
          return Array.from(ui.discardPile.childNodes).some((card) => card.hasGaintag("eternal_dcqiqin_tag"));
        },
        forced: true,
        async content(event, trigger, player) {
          const cards2 = Array.from(ui.discardPile.childNodes).filter((card) => card.hasGaintag("eternal_dcqiqin_tag"));
          await player.gain({
            cards: cards2,
            animate: "gain2"
          });
        }
      }
    },
    mod: {
      ignoredHandcard(card, player) {
        if (card.hasGaintag("eternal_dcqiqin_tag")) {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name == "phaseDiscard" && card.hasGaintag("eternal_dcqiqin_tag")) {
          return false;
        }
      }
    }
  },
  dcweiwan: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.hasCards(lib.skill.dcweiwan.position, (card) => {
        return lib.skill.dcweiwan.filterCard(card, player);
      }) && game.hasPlayer((target) => {
        return lib.skill.dcweiwan.filterTarget(null, player, target);
      });
    },
    filterCard(card, player) {
      return card.hasGaintag("eternal_dcqiqin_tag") && lib.filter.cardDiscardable(card, player);
    },
    filterTarget(card, player, target) {
      return target != player && target.hasCards("hej");
    },
    position: "he",
    check(card) {
      const player = _status.event.player;
      const target = game.players.reduce(
        (result, current) => {
          if (current === player) {
            return result;
          }
          const effect = Math.abs(lib.skill.dcweiwan.ai.result.target(player, current));
          return effect > result[1] ? [current, effect] : result;
        },
        [null, 0]
      )[0];
      return target ? lib.skill.dcweiwan.getWeiWanEffect(player, card, target) : 0;
    },
    usable: 1,
    async content(event, trigger, player) {
      const target = event.target;
      let suit = get.suit(event.cards[0], player);
      let cards2 = target.getCards("hej", (card) => get.suit(card, target) != suit && lib.filter.canBeGained(card, player, target));
      if (!cards2.length) {
        player.chat("无牌可得！！");
        return;
      }
      let suits = lib.suit.slice();
      suits.reverse();
      suits.add("none");
      suits.forEach((suit2) => {
        let cards22 = cards2.filter((card) => get.suit(card, target) == suit2);
        if (cards22.length) {
          cards22.randomRemove();
          cards2.removeArray(cards22);
        }
      });
      if (!cards2.length) {
        player.chat("无牌可得！！");
        return;
      }
      await player.gain(cards2, target, "give");
      switch (cards2.length) {
        case 1:
          await target.loseHp();
          break;
        case 2:
          player.addTempSkill("dcweiwan_buff");
          player.markAuto("dcweiwan_buff", [target]);
          break;
        case 3:
          player.addTempSkill("dcweiwan_debuff");
          player.markAuto("dcweiwan_debuff", [target]);
          break;
      }
    },
    ai: {
      order: 9,
      result: {
        target: (player, target) => {
          const att = get.sgn(get.attitude(player, target)) - 1;
          const cards2 = player.getCards(lib.skill.dcweiwan.position, (card) => lib.skill.dcweiwan.filterCard(card, player));
          return att * cards2.reduce((result, card) => {
            const effect = lib.skill.dcweiwan.getWeiWanEffect(player, card, target);
            return effect > result ? effect : result;
          }, 0);
        }
      },
      combo: "dcqiqin"
    },
    getWeiWanEffect(player, cardx, target) {
      const suit = get.suit(cardx, player);
      const cards2 = target.getCards("hej", (card) => get.suit(card, target) !== suit && lib.filter.canBeGained(card, player, target));
      const num = lib.suits.filter((suit2) => cards2.some((card) => get.suit(card, target) === suit2)).length;
      switch (num) {
        case 1:
          return num + Math.max(0, get.sgn(get.effect(target, { name: "losehp" }, player, player)));
        case 2:
          return num + player.countCards("he", (card) => player.canUse(card, target, false) && get.effect(target, card, player, player) > 0);
        case 3:
          return Math.ceil(num / 2);
        default:
          return num;
      }
    },
    subSkill: {
      buff: {
        charlotte: true,
        onremove: true,
        intro: { content: "本回合对$使用牌无距离和次数限制" },
        mod: {
          targetInRange(card, player, target) {
            if (player.getStorage("dcweiwan_buff").includes(target)) {
              return true;
            }
          },
          cardUsableTarget(card, player, target) {
            if (player.getStorage("dcweiwan_buff").includes(target)) {
              return true;
            }
          }
        }
      },
      debuff: {
        charlotte: true,
        onremove: true,
        intro: { content: "本回合不能对$使用牌" },
        mod: {
          playerEnabled(card, player, target) {
            if (player.getStorage("dcweiwan_debuff").includes(target)) {
              return false;
            }
          }
        }
      }
    }
  },
  //董昭
  dcyijia: {
    audio: 2,
    trigger: { global: "damageEnd" },
    filter(event, player) {
      if (!event.player.isIn()) {
        return false;
      }
      if (get.distance(player, event.player) > 1) {
        return false;
      }
      return player.canMoveCard(
        null,
        true,
        game.filterPlayer((i) => i != event.player),
        event.player,
        "canReplace"
      );
    },
    check(event, player) {
      return player.canMoveCard(
        true,
        true,
        game.filterPlayer((i) => i != event.player),
        event.player,
        "canReplace"
      );
    },
    prompt2(event, player) {
      return `将场上一张装备牌移动至${get.translation(event.player)}的装备区内（替换原装备）。然后若其因此脱离了一名角色的攻击范围，你摸一张牌。`;
    },
    logTarget: "player",
    line: false,
    async content(event, trigger, player) {
      const target = trigger.player;
      const inRangeList = game.filterPlayer((current) => current.inRange(target));
      await player.moveCard(
        true,
        game.filterPlayer((i) => i != target),
        target,
        "canReplace"
      ).set("nojudge", true);
      const leaveSomeone = inRangeList.some((current) => !current.inRange(target));
      if (leaveSomeone) {
        player.draw();
      }
    },
    ai: {
      maixie: true,
      expose: 0.2,
      threaten: 3.3
    }
  },
  dcdingji: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    direct: true,
    async content(event, trigger, player) {
      let result;
      result = await player.chooseTarget(get.prompt2("dcdingji")).set("ai", (target2) => {
        let att = get.attitude(get.player(), target2) / 2;
        const delta2 = 5 - target2.countCards("h");
        let fix = 1;
        const hs2 = target2.getCards("h");
        outer: for (let i = 0; i < hs2.length - 1; i++) {
          const name1 = get.name(hs2[i]);
          for (let j = i + 1; j < hs2.length; j++) {
            const name2 = get.name(hs2[j]);
            if (name1 == name2) {
              fix = 0.5;
              break outer;
            }
          }
        }
        if (delta2 > 0) {
          if (target2.hasSkillTag("nogain")) {
            att /= 3;
          }
          return Math.sqrt(delta2) * att * fix;
        }
        if (delta2 > -2 && att > 0) {
          return fix == 0.5 ? 0.1 : -1;
        }
        return -Math.sqrt(-delta2) * att / 2;
      }).forResult();
      if (!result.bool) {
        return;
      }
      const target = result.targets[0];
      player.logSkill("dcdingji", target);
      if (target != player) {
        player.addExpose(0.3);
      }
      const delta = 5 - target.countCards("h");
      if (delta != 0) {
        await target[delta > 0 ? "draw" : "chooseToDiscard"](Math.abs(delta), true, "allowChooseAll");
      }
      await target.showHandcards();
      const hs = target.getCards("h");
      let hasSame = false;
      outer: for (let i = 0; i < hs.length - 1; i++) {
        const name1 = get.name(hs[i]);
        for (let j = i + 1; j < hs.length; j++) {
          const name2 = get.name(hs[j]);
          if (name1 == name2) {
            hasSame = true;
            break outer;
          }
        }
      }
      await game.delayex();
      if (hasSame) {
        return;
      }
      const list = get.inpileVCardList((info) => {
        if (!["basic", "trick"].includes(info[0])) {
          return false;
        }
        if (!target.hasUseTarget(new lib.element.VCard({ name: info[2], nature: info[3], isCard: true }))) {
          return false;
        }
        return hs.some((card) => {
          return get.name(card) == info[2] && get.is.sameNature([card, info[3]], true);
        });
      });
      if (!list.length) {
        return;
      }
      result = await target.chooseButton(["是否视为使用其中一张牌？", [list, "vcard"]]).set("ai", (button) => {
        return get.player().getUseValue({ name: button.link[2] });
      }).forResult();
      if (result.bool) {
        target.chooseUseTarget(
          new lib.element.VCard({
            name: result.links[0][2],
            nature: result.links[0][3],
            isCard: true
          }),
          true,
          false
        );
      }
    }
  },
  //蒯祺
  dcliangxiu: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.hasCard((card) => {
        const type = get.type2(card, player);
        return player.hasCard((cardx) => {
          if (card == cardx) {
            return false;
          }
          return get.type2(cardx, player) != type;
        }, "he");
      }, "he");
    },
    filterCard(card, player) {
      if (!ui.selected.cards.length) {
        return true;
      }
      return get.type2(ui.selected.cards[0], player) != get.type2(card, player);
    },
    selectCard: 2,
    check(card) {
      const player = get.player();
      const bannedTypes = [];
      bannedTypes.addArray(player.getStorage("dcliangxiu"));
      if (!ui.selected.cards.length) {
        let val = get.value(card);
        if (val > 5.5) {
          return 0;
        }
        if (bannedTypes.includes(get.type2(card, player))) {
          return 7.5 - val;
        }
        return 5.5 - val;
      }
      bannedTypes.addArray(ui.selected.cards.map((card2) => get.type2(card2, player)));
      bannedTypes.add(get.type2(card, player));
      const filter = (card2) => !bannedTypes.includes(get.type2(card2, player));
      if (!get.cardPile(filter)) {
        return 0;
      }
      return 6 - get.value(card);
    },
    position: "he",
    complexCard: true,
    onremove: true,
    async content(event, trigger, player) {
      let cards2 = [];
      const bannedTypes = [];
      bannedTypes.addArray(event.cards.map((card) => get.type2(card, player)));
      bannedTypes.addArray(player.getStorage("dcliangxiu"));
      const filter = (card) => !bannedTypes.includes(get.type2(card, player));
      const piles = ["cardPile", "discardPile"];
      for (const pile of piles) {
        for (let i = 0; i < ui[pile].childNodes.length; i++) {
          const card = ui[pile].childNodes[i];
          if (filter(card)) {
            cards2.add(card);
            if (cards2.length >= 2) {
              break;
            }
          }
        }
        if (cards2.length >= 2) {
          break;
        }
      }
      if (!cards2.length) {
        player.chat("没牌了…");
        game.log("但是哪里都找不到没有符合条件的牌！");
        return;
      }
      player.markAuto("dcliangxiu", cards2.map((card) => get.type2(card, false)).toUniqued());
      player.when({ global: "phaseChange" }).step(async () => {
        player.unmarkSkill("dcliangxiu");
      });
      if (_status.connectMode) {
        game.broadcastAll(() => _status.noclearcountdown = true);
      }
      let given_map = {};
      while (cards2.length) {
        let result;
        if (cards2.length == 1) {
          result = { bool: true, links: cards2.slice() };
        } else {
          result = await player.chooseCardButton("良秀：请选择要分配的牌", cards2, [1, cards2.length], true).set("ai", (button) => {
            if (!ui.selected.buttons.length) {
              return get.buttonValue(button);
            }
            return 0;
          }).forResult();
        }
        const gives = result.links;
        const result2 = await player.chooseTarget("选择获得" + get.translation(gives) + "的角色", cards2.length == 1).set("ai", (target) => {
          return get.attitude(get.event().player, target) * get.sgn(get.sgn(get.event().goon) + 0.5);
        }).set(
          "goon",
          gives.reduce((sum, card) => sum + get.value(card), 0)
        ).forResult();
        if (result2.bool) {
          cards2.removeArray(gives);
          const id = result2.targets[0].playerid;
          if (!given_map[id]) {
            given_map[id] = [];
          }
          given_map[id].addArray(gives);
        }
      }
      if (_status.connectMode) {
        game.broadcastAll(() => delete _status.noclearcountdown);
      }
      let list = [];
      for (const i in given_map) {
        const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
        player.line(source, "green");
        game.log(source, "获得了", given_map[i]);
        list.push([source, given_map[i]]);
      }
      await game.loseAsync({
        gain_list: list,
        giver: player,
        animate: "gain2"
      }).setContent("gaincardMultiple");
      game.delayx();
    },
    intro: {
      content: "已因此技能获得过$牌",
      onunmark: true
    },
    ai: {
      order: 2,
      result: { player: 1 }
    }
  },
  dcxunjie: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      if (["handcard", "hp"].every((i) => player.isTempBanned(`dcxunjie_${i}`))) {
        return false;
      }
      return player.hasHistory("gain", (evt) => {
        return !evt.getParent("phaseDraw", true);
      });
    },
    direct: true,
    async content(event, trigger, player) {
      const choices = [];
      const choiceList = ["令一名角色将手牌数摸或弃置至与其体力值相同", "令一名角色将体力回复或失去至与其手牌数相同"];
      if (!player.isTempBanned("dcxunjie_handcard")) {
        choices.push("选项一");
      } else {
        choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "（已被选择过）</span>";
      }
      if (!player.isTempBanned("dcxunjie_hp")) {
        choices.push("选项二");
      } else {
        choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "（已被选择过）</span>";
      }
      let result;
      if (_status.connectMode) {
        game.broadcastAll(() => {
          _status.noclearcountdown = true;
        });
      }
      if (choices.length == 1) {
        result = { control: choices[0] };
      } else {
        result = await player.chooseControl(choices, "cancel2").set("choiceList", choiceList).set("prompt", get.prompt("dcxunjie")).set("ai", () => {
          return get.event().choice;
        }).set(
          "choice",
          (() => {
            const getValue = (index2, target2) => {
              let att = get.attitude(player, target2);
              att = Math.sign(att) * Math.sqrt(Math.abs(att));
              let delt2 = target2.getHp(true) - target2.countCards("h");
              if (index2 == 1 && delt2 < 0) {
                delt2 = 0;
              }
              return (1 - 3 * index2) * att * delt2;
            };
            const list = game.filterPlayer().map((current) => {
              const val0 = getValue(0, current), val1 = getValue(1, current);
              return [val0, val1, Math.max(val0, val1)];
            }).sort((a, b) => {
              return b[2] - a[2];
            });
            const toChoose = list[0];
            if (toChoose[2] <= 0) {
              return "cancel2";
            }
            return toChoose[0] > toChoose[1] ? 0 : 1;
          })()
        ).forResult();
      }
      if (result.control == "cancel2") {
        if (_status.connectMode) {
          game.broadcastAll(() => {
            delete _status.noclearcountdown;
            game.stopCountChoose();
          });
        }
        return;
      }
      let prompt = "";
      const choice = result.control, index = choice == "选项一" ? 0 : 1;
      if (choices.length == 1) {
        prompt = `###${get.prompt("dcxunjie")}###<div class="text center">${choiceList[index]}</div>`;
      } else {
        prompt = `###殉节：请选择一名角色###<div class="text center">${choiceList[index].replace("一名", "该")}</div>`;
      }
      result = await player.chooseTarget(prompt).set("ai", (target2) => {
        const player2 = get.player(), index2 = get.event().index;
        let att = get.attitude(player2, target2);
        att = Math.sign(att) * Math.sqrt(Math.abs(att));
        let delt2 = target2.getHp(true) - target2.countCards("h");
        if (index2 == 1 && delt2 < 0) {
          delt2 = 0;
        }
        return (1 - 2 * index2) * att * delt2;
      }).set("index", index).forResult();
      if (_status.connectMode) {
        game.broadcastAll(() => {
          delete _status.noclearcountdown;
          game.stopCountChoose();
        });
      }
      if (!result.bool) {
        return;
      }
      const target = result.targets[0];
      player.logSkill("dcxunjie", target);
      player.tempBanSkill(`dcxunjie_${index == 0 ? "handcard" : "hp"}`, "roundStart", false);
      const delt = (target.getHp(true) - target.countCards("h")) * (1 - 2 * index);
      if (delt == 0) {
        return;
      } else if (index == 0) {
        target[delt > 0 ? "draw" : "chooseToDiscard"](Math.abs(delt), true, "allowChooseAll");
      } else {
        target[delt > 0 ? "recover" : "loseHp"](Math.abs(delt));
      }
    }
  },
  //乐蔡邕
  dcjiaowei: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    group: "dcjiaowei_prevent",
    async content(event, trigger, player) {
      const cards2 = player.getCards("h");
      player.addGaintag(cards2, "dcjiaowei_tag");
    },
    mod: {
      ignoredHandcard(card, player) {
        if (card.hasGaintag("dcjiaowei_tag")) {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name == "phaseDiscard" && card.hasGaintag("dcjiaowei_tag")) {
          return false;
        }
      }
    },
    subSkill: {
      prevent: {
        audio: "dcjiaowei",
        trigger: {
          player: "loseAfter",
          global: ["loseAsyncAfter", "addJudgeAfter", "equipAfter", "gainAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          if (player.hasSkill("dcjiaowei_effect")) {
            return false;
          }
          if (!event.getl?.(player)?.hs?.length) {
            return false;
          }
          if (event.name === "lose") {
            return Object.values(event.gaintag_map).flat().includes("dcjiaowei_tag");
          }
          return player.hasHistory("lose", (evt) => {
            if (event !== evt.getParent()) {
              return false;
            }
            return Object.values(evt.gaintag_map).flat().includes("dcjiaowei_tag");
          });
        },
        forced: true,
        async content(event, trigger, player) {
          player.addTempSkill("dcjiaowei_effect");
        }
      },
      effect: {
        audio: "dcjiaowei",
        trigger: { player: "damageBegin4" },
        forced: true,
        async content(event, trigger, player) {
          player.removeSkill(event.name);
          trigger.cancel();
        },
        mark: true,
        intro: { content: "防止本回合下次受到的伤害" }
      }
    }
  },
  dcfeibai: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    locked: false,
    prompt(event, player) {
      const history = player.getHistory("useCard");
      const ind = history.indexOf(event) - 1, evt = history[ind];
      const len = get.cardNameLength(event.card) + (evt ? get.cardNameLength(evt.card) : 0);
      return `${get.prompt("dcfeibai")}（字数之和为${len}）`;
    },
    async content(event, trigger, player) {
      const history = player.getHistory("useCard");
      const ind = history.indexOf(trigger) - 1, evt = history[ind], cards2 = [];
      const len = get.cardNameLength(trigger.card) + (evt ? get.cardNameLength(evt.card) : 0);
      while (cards2.length < 2) {
        const card = get.cardPile((cardx) => get.cardNameLength(cardx, false) === len && !cards2.includes(cardx));
        if (!card) {
          break;
        }
        cards2.add(card);
      }
      if (cards2.length) {
        const result = await player.chooseCardButton(`飞白：获得一张牌`, cards2, true).set("ai", (button) => get.value(button.link, player)).forResult();
        if (result?.links?.length) {
          await player.gain(result.links, "gain");
        }
      } else {
        await player.draw(2).gaintag.add("dcjiaowei_tag");
        player.tempBanSkill(event.name);
      }
    },
    mod: {
      aiOrder(player, card, num) {
        const evt = player.getLastUsed();
        const len = get.cardNameLength(card) + (evt ? get.cardNameLength(evt.card) : 0);
        const cardx = get.cardPile((card2) => get.cardNameLength(card2, false) === len);
        if (cardx) {
          return num + 8 + (len == 2 || len == 4 ? 2 : 0);
        }
      }
    }
  },
  //庞山民
  dccaisi: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter(event, player) {
      return get.type(event.card) === "basic" && _status.currentPhase;
    },
    prompt2(event, player) {
      const num = Math.pow(2, player.countMark("dccaisi_more"));
      return `从${player == _status.currentPhase ? "" : "弃"}牌堆中随机获得${get.cnNumber(num)}张非基本牌`;
    },
    async content(event, trigger, player) {
      const position = player == _status.currentPhase ? "cardPile2" : "discardPile";
      let cards2 = [], num = Math.pow(2, player.countMark("dccaisi_more"));
      while (num > 0) {
        num--;
        let card = get[position]((card2) => get.type(card2) != "basic" && !cards2.includes(card2), "random");
        if (card) {
          cards2.add(card);
        } else {
          break;
        }
      }
      if (cards2.length) {
        await player.gain(cards2, "gain2");
      } else {
        player.chat("没有非基本牌…");
        game.log(`但是${position == "discardPile" ? "弃" : ""}牌堆里没有非基本牌！`);
      }
      const sum = player.getHistory("useSkill", (evt) => evt.skill == "dccaisi").length;
      if (sum <= player.maxHp) {
        player.addTempSkill("dccaisi_more");
        player.setStorage("dccaisi_more", player.getStorage("dccaisi_more", 0) + 1);
      } else {
        player.tempBanSkill("dccaisi");
      }
    },
    subSkill: { more: { charlotte: true, onremove: true } }
  },
  dczhuoli: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    forced: true,
    filter(event, player) {
      return player.getHistory("useCard").length > player.getHp() || player.getHistory("gain").reduce((sum, evt) => sum + evt.cards.length, 0) > player.getHp();
    },
    async content(event, trigger, player) {
      if (player.maxHp < game.countPlayer2()) {
        await player.gainMaxHp();
      }
      await player.recover();
    }
  },
  //魏贾充
  dcbeini: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterCard(card, player) {
      const delt = player.countCards("h") - player.maxHp;
      return delt > 0;
    },
    selectCard() {
      const player = get.player();
      const delt = player.countCards("h") - player.maxHp;
      return delt > 0 ? delt : -1;
    },
    promptfunc: () => {
      const player = get.player();
      const delt = player.countCards("h") - player.maxHp;
      let str = "";
      if (delt > 0) {
        str += `弃置${get.cnNumber(delt)}张牌`;
      } else if (delt == 0) {
        str += `点击“确定”`;
      } else {
        str += `摸${get.cnNumber(-delt)}张牌`;
      }
      return `${str}，然后选择两名角色，前者视为对后者使用一张【杀】，且这两者的非锁定技失效。`;
    },
    allowChooseAll: true,
    async content(event, trigger, player) {
      if (player.countCards("h") < player.maxHp) {
        await player.drawTo(player.maxHp);
      }
      if (game.countPlayer() < 2) {
        return;
      }
      var result = await player.chooseTarget("悖逆：请选择两名角色", "前者视为对后者使用一张【杀】，且这两名角色的非锁定技失效直到回合结束。", true, 2, (card, player2, target2) => {
        var sha2 = new lib.element.VCard({ name: "sha", isCard: true });
        if (ui.selected.targets.length) {
          var targetx = ui.selected.targets[0];
          return targetx.canUse(sha2, target2, false);
        }
        return lib.filter.cardEnabled(sha2, target2);
      }).set("targetprompt", ["打人", "被打"]).set("multitarget", true).set("ai", (target2) => {
        var aiTargets = get.event().aiTargets;
        if (aiTargets) {
          return aiTargets[ui.selected.targets.length] == target2 ? 10 : 0;
        }
        return 0;
      }).set(
        "aiTargets",
        (() => {
          var targets = [], eff = 0;
          var sha2 = new lib.element.VCard({ name: "sha", isCard: true });
          for (var user2 of game.filterPlayer()) {
            for (var target2 of game.filterPlayer()) {
              if (user2 == target2) {
                continue;
              }
              var targetsx = [user2, target2];
              targetsx.forEach((i) => i.addSkill("dcbeini_fengyin2"));
              var effx = get.effect(target2, sha2, user2, player);
              targetsx.forEach((i) => i.removeSkill("dcbeini_fengyin2"));
              if (user2 == player) {
                effx += 1;
              }
              if (get.attitude(player, user2) > 0) {
                effx -= 0.1;
              }
              if (effx > eff) {
                eff = effx;
                targets = targetsx;
              }
            }
          }
          if (targets.length) {
            return targets;
          }
          return null;
        })()
      ).forResult();
      if (result.bool) {
        var user = result.targets[0], target = result.targets[1];
        result.targets.forEach((i) => i.addTempSkill("dcbeini_fengyin"));
        var sha = new lib.element.VCard({ name: "sha", isCard: true });
        if (user.canUse(sha, target, false)) {
          user.useCard(sha, target, false, "noai");
        }
      }
    },
    ai: {
      order: 0.1,
      result: {
        player(player) {
          if (player.countCards("h") - player.maxHp >= 3) {
            return 1;
          }
          return game.hasPlayer((current) => get.attitude(player, current) <= 0) ? 1 : 0;
        }
      }
    },
    subSkill: {
      fengyin: {
        inherit: "fengyin"
      },
      fengyin2: {
        inherit: "fengyin"
      }
    }
  },
  dcshizong: {
    audio: 2,
    enable: "chooseToUse",
    hiddenCard(player, name) {
      if (get.type(name) != "basic") {
        return false;
      }
      return player.countCards("he") >= player.countMark("dcshizong_used") + 1;
    },
    filter(event, player) {
      if (event.type == "wuxie" || event.dcshizong) {
        return false;
      }
      if (player.countCards("he") < player.countMark("dcshizong_used") + 1) {
        return false;
      }
      return get.inpileVCardList((info) => {
        return info[0] == "basic";
      }).some((info) => event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event));
    },
    chooseButton: {
      dialog(event, player) {
        const vcards = get.inpileVCardList((info) => {
          if (info[0] != "basic") {
            return false;
          }
          const card = { name: info[2], nature: info[3], isCard: true };
          return event.filterCard(card, player, event);
        });
        return ui.create.dialog("恃纵", [vcards, "vcard"], "hidden");
      },
      check(button) {
        if (get.event().getParent().type != "phase") {
          return 1;
        }
        const player = get.player();
        const card = { name: button.link[2], nature: button.link[3] };
        if (game.hasPlayer((current) => {
          return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
        })) {
          switch (button.link[2]) {
            case "tao":
              return 5;
            case "jiu":
              return 3.01;
            case "sha":
              if (button.link[3] == "fire") {
                return 2.95;
              } else if (button.link[3] == "thunder") {
                return 2.92;
              } else {
                return 2.9;
              }
          }
        }
        return 0;
      },
      backup(links, player) {
        return {
          filterCard: true,
          filterTarget: lib.filter.notMe,
          selectTarget: 1,
          selectCard: () => get.player().countMark("dcshizong_used") + 1,
          viewAs: {
            name: links[0][2],
            nature: links[0][3],
            suit: "none",
            number: null,
            isCard: true
          },
          position: "he",
          popname: true,
          ignoreMod: true,
          ai1(card) {
            return 1 / (1.1 + Math.max(-1, get.value(card)));
          },
          ai2(target) {
            return get.attitude(get.player(), target);
          },
          async precontent(event, trigger, player2) {
            const target = event.result.targets[0];
            player2.addTempSkill("dcshizong_used");
            player2.addMark("dcshizong_used", 1, false);
            player2.logSkill("dcshizong", target);
            await player2.give(event.result.cards.slice(), target);
            const viewAs = new lib.element.VCard({
              name: event.result.card.name,
              nature: event.result.card.nature,
              isCard: true
            });
            let result = await target.chooseCard("恃纵：是否将一张牌置于牌堆底？", `若如此做，${get.translation(player2)}视为使用一张${get.translation(viewAs.nature)}【${get.translation(viewAs.name)}】`, "he").set("ai", (card) => {
              if (get.event().goon) {
                return 7 - get.value(card);
              }
              return 0;
            }).set("goon", get.attitude(target, player2) * (player2.getUseValue(viewAs) || 1) >= 1).forResult();
            if (result?.bool) {
              const card = result.cards[0];
              await game.delayex();
              const next = target.loseToDiscardpile(card, ui.cardPile);
              next.log = false;
              if (get.position(card) == "e") {
                game.log(target, "将", card, "置于了牌堆底");
              } else {
                next.blank = true;
                game.log(target, "将一张牌置于了牌堆底");
              }
              await next;
              game.broadcastAll((viewAs2) => {
                lib.skill.dcshizong_backup2.viewAs = viewAs2;
              }, lib.skill.dcshizong_backup.viewAs);
              const evt2 = event.getParent();
              evt2.set("_backupevent", "dcshizong_backup2");
              evt2.set("openskilldialog", `请选择${get.translation(viewAs.nature)}${get.translation(viewAs.name)}的目标`);
              evt2.backup("dcshizong_backup2");
              evt2.set("norestore", true);
              evt2.set("custom", {
                add: {},
                replace: { window() {
                } }
              });
              evt2.goto(0);
              if (target != _status.currentPhase) {
                player2.tempBanSkill("dcshizong");
              }
            } else {
              target.chat("不放！");
              game.log(target, "选择不将牌置于牌堆底");
              var evt = event.getParent();
              evt.set("dcshizong", true);
              evt.goto(0);
              player2.tempBanSkill("dcshizong");
            }
            await game.delayx();
          },
          ai: { order: 10 }
        };
      },
      prompt(links, player) {
        return `###恃纵：选择要交出的牌和目标角色###将${get.cnNumber(player.countMark("dcshizong_used") + 1)}张牌交给一名其他角色，其可以选择将一张牌置于牌堆底，视为你使用一张${get.translation(links[0][3] || "")}${get.translation(links[0][2])}。`;
      }
    },
    ai: {
      order() {
        const player = get.player(), event = get.event();
        if (event.filterCard({ name: "jiu" }, player, event) && get.effect(player, { name: "jiu" }) > 0) {
          return get.order({ name: "jiu" }) + 0.1;
        }
        return get.order({ name: "sha" }) + 0.1;
      },
      respondSha: true,
      fireAttack: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        if (arg === "respond" || tag == "fireAttack") {
          return true;
        }
        if (player.countCards("he") < player.countMark("dcshizong_used") + 1) {
          return false;
        }
        if (tag == "respondSha") {
          return false;
        }
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
      backup2: {
        filterCard: () => false,
        selectCard: -1,
        log: false
      },
      used: {
        charlotte: true,
        onremove: true,
        intro: { content: "本回合已发动#次【恃纵】" }
      }
    }
  },
  //张曼成
  dclvecheng: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const { target } = event;
      player.addTempSkill("dclvecheng_xiongluan");
      player.markAuto("dclvecheng_xiongluan", [target]);
      var cards2 = player.getCards("h", "sha");
      if (cards2.length) {
        player.addGaintag(cards2, "dclvecheng_xiongluan");
      }
    },
    ai: {
      threaten: 3.1,
      order: 3.5,
      expose: 0.2,
      result: {
        target(player, target) {
          if (player.getStorage("dclvecheng_xiongluan").includes(target)) {
            return 0;
          }
          if (target.hasSkillTag(
            "freeShan",
            false,
            {
              player,
              type: "use"
            },
            true
          )) {
            return -0.6;
          }
          var hs = player.countCards("h", (card) => {
            if (!player.canUse(card, target)) {
              return false;
            }
            return get.name(card) == "sha" && get.effect(target, card, player, player) > 0;
          });
          var ts = target.hp;
          if (hs >= ts && ts > 1) {
            return -2;
          }
          return -1;
        }
      }
    },
    subSkill: {
      xiongluan: {
        trigger: { player: ["phaseEnd", "useCard1"] },
        charlotte: true,
        forced: true,
        popup: false,
        onremove(player, skill) {
          player.removeGaintag(skill);
          delete player.storage[skill];
        },
        filter(event, player) {
          if (event.name == "useCard") {
            if (event.addCount === false || !event.targets?.some((target) => player.getStorage("dclvecheng_xiongluan").includes(target))) {
              return false;
            }
            return player.hasHistory("lose", (evt) => {
              const evtx = evt.relatedEvent || evt.getParent();
              if (evtx != event) {
                return false;
              }
              return Object.values(evt.gaintag_map).flat().includes("dclvecheng_xiongluan");
            });
          }
          return player.getStorage("dclvecheng_xiongluan").some((i) => i.isIn());
        },
        async content(event, trigger, player) {
          if (trigger.name == "useCard") {
            trigger.addCount = false;
            const stat = player.getStat().card, name = trigger.card.name;
            if (typeof stat[name] == "number") {
              stat[name]--;
            }
            return;
          }
          const targets = player.getStorage(event.name).slice().sortBySeat();
          if (!targets.length) {
            return;
          }
          while (targets.length && player.isIn()) {
            const target = targets.shift();
            await target.showHandcards();
            let cards2 = target.getCards("h", (card) => {
              return get.name(card) === "sha" && target.canUse(card, player, false);
            });
            if (!cards2.length) {
              continue;
            }
            let forced = false;
            while (cards2.length && player.isIn()) {
              const prompt2 = forced ? `掠城：选择对${get.translation(player)}使用的【杀】` : `掠城：是否依次对${get.translation(player)}使用所有的【杀】？`;
              const result = await target.chooseToUse(
                forced,
                function(card, player2, event2) {
                  if (get.itemtype(card) != "card" || get.name(card) != "sha") {
                    return false;
                  }
                  return lib.filter.filterCard.apply(this, arguments);
                },
                prompt2
              ).set("targetRequired", true).set("complexTarget", true).set("complexSelect", true).set("filterTarget", function(card, player2, target2) {
                if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
                  return false;
                }
                return lib.filter.targetEnabled.apply(this, arguments);
              }).set("sourcex", player).forResult();
              if (result.bool) {
                cards2 = target.getCards("h", (card) => {
                  return get.name(card) === "sha" && target.canUse(card, player, false);
                });
                forced = true;
              } else {
                break;
              }
            }
          }
        },
        intro: { content: "对$使用“掠城”【杀】无任何次数限制" },
        mod: {
          cardUsableTarget(card, player, target) {
            if (!card.cards || card.cards.length != 1) {
              return;
            }
            if (card.name == "sha" && card.cards[0].hasGaintag("dclvecheng_xiongluan") && player.getStorage("dclvecheng_xiongluan").includes(target)) {
              return true;
            }
          }
        }
      }
    }
  },
  dczhongji: {
    audio: 2,
    trigger: { player: "useCard" },
    filter(event, player) {
      if (player.countCards("h") >= player.maxHp) {
        return false;
      }
      var suit = get.suit(event.card);
      return !lib.suit.includes(suit) || !player.countCards("h", { suit });
    },
    check(event, player) {
      var num = Math.min(20, player.maxHp - player.countCards("h"));
      if (num <= 0) {
        return false;
      }
      var numx = player.getHistory("useSkill", (evt) => {
        return evt.skill == "dczhongji";
      }).length + 1;
      if (numx > num) {
        return false;
      }
      if (_status.currentPhase != player) {
        return true;
      }
      if (player.hasCard((card) => {
        var suit = get.suit(card);
        return player.hasValueTarget(card) && !player.hasCard((cardx) => {
          return cardx != card && get.suit(cardx) == suit;
        });
      })) {
        return false;
      }
      return true;
    },
    prompt2(event, player) {
      var num = Math.min(20, player.maxHp - player.countCards("h"));
      var str = num > 0 ? "摸" + get.cnNumber(num) + "张牌，然后" : "";
      return str + "弃置" + get.cnNumber(
        1 + player.getHistory("useSkill", (evt) => {
          return evt.skill == "dczhongji";
        }).length
      ) + "张牌";
    },
    async content(event, trigger, player) {
      const drawNum = Math.min(20, player.maxHp - player.countCards("h"));
      if (drawNum > 0) {
        await player.draw({
          num: drawNum
        });
      }
      const discardNum = player.getHistory("useSkill", (evt) => evt.skill == "dczhongji").length;
      await player.chooseToDiscard({
        prompt: "螽集：请弃置" + get.cnNumber(discardNum) + "张牌",
        position: "he",
        forced: true,
        selectCard: discardNum,
        ai: get.unuseful
      });
    },
    ai: {
      threaten: 3.2
    }
  },
  //乐周妃
  dclingkong: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    filter(event, player) {
      return (event.name != "phase" || game.phaseNumber == 0) && player.countCards("h");
    },
    async content(event, trigger, player) {
      const cards2 = player.getCards("h");
      if (cards2.length) {
        player.addGaintag(cards2, "dclingkong_tag");
      }
    },
    mod: {
      ignoredHandcard(card, player) {
        if (card.hasGaintag("dclingkong_tag")) {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name == "phaseDiscard" && card.hasGaintag("dclingkong_tag")) {
          return false;
        }
      }
    },
    group: "dclingkong_marker",
    subSkill: {
      marker: {
        audio: "dclingkong",
        trigger: {
          player: "gainAfter",
          global: "loseAsyncAfter"
        },
        forced: true,
        filter: (event, player) => {
          const phaseDraw = event.getParent("phaseDraw");
          if (phaseDraw?.player === player) {
            return false;
          }
          const history = player.getHistory("gain", (evt2) => {
            const phaseDraw2 = evt2.getParent("phaseDraw");
            return !phaseDraw2 || phaseDraw2.player !== player;
          });
          const evt = event.name == "loseAsync" ? event.childEvents?.find((evtx) => evtx.name == "gain" && evtx.player == player) : event;
          if (history.indexOf(evt) !== 0) {
            return false;
          }
          const hs = player.getCards("h");
          if (!hs.length) {
            return false;
          }
          const cards2 = event.getg?.(player);
          return cards2?.some((card) => hs.includes(card));
        },
        async content(event, trigger, player) {
          let hs = player.getCards("h"), cards2 = trigger.getg(player);
          cards2 = cards2.filter((card) => hs.includes(card));
          if (cards2.length) {
            player.addGaintag(cards2, "dclingkong_tag");
          }
          await game.delayx();
        }
      }
    }
  },
  dcxianshu: {
    audio: 2,
    enable: "phaseUse",
    filter: (event, player) => {
      return game.hasPlayer((current) => current != player) && player.hasCard((card) => card.hasGaintag("dclingkong_tag"), "h");
    },
    filterCard: (card) => card.hasGaintag("dclingkong_tag"),
    filterTarget: lib.filter.notMe,
    discard: false,
    lose: false,
    delay: false,
    position: "h",
    check: (card) => {
      const player = _status.event.player, event = _status.event, color = get.color(card);
      if (color == "red") {
        return (event.getTempCache("dcxianshu", "red") || event.putTempCache(
          "dcxianshu",
          "red",
          game.hasPlayer((current) => {
            return current != player && current.hp <= player.hp && current.isDamaged() && get.recoverEffect(current, player, player) > 0;
          }).toString()
        )) == "true" ? 7 - get.value(card) : 0;
      } else if (color == "black") {
        return (event.getTempCache("dcxianshu", "black") || event.putTempCache(
          "dcxianshu",
          "black",
          game.hasPlayer((current) => {
            return current != player && current.hp >= player.hp && get.effect(current, { name: "losehp" }, player, player) > 0;
          }).toString()
        )) == "true" ? 7 - get.value(card) : 0;
      }
      return 6 - get.value(card);
    },
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      await player.give(cards2, target, true);
      const color = get.color(cards2[0], player);
      if (target.isIn()) {
        const num = Math.min(Math.abs(target.getHp() - player.getHp()), 5);
        if (num > 0) {
          await player.draw({ num });
        }
      }
      if (color == "red") {
        if (target.getHp() <= player.getHp() && target.isDamaged()) {
          await target.recover();
        }
      } else if (color == "black") {
        if (target.getHp() >= player.getHp()) {
          await target.loseHp();
        }
      }
    },
    ai: {
      combo: "dclingkong",
      order: 10,
      result: {
        player(player, target) {
          if (!ui.selected.cards.length) {
            return 0;
          }
          let num = target.getHp() - player.getHp();
          const card = ui.selected.cards[0], color = get.color(card);
          if (color == "red" && target.getHp() <= player.getHp() && target.isDamaged()) {
            num++;
          } else if (color == "black" && target.getHp() >= player.getHp()) {
            num--;
          }
          return Math.min(Math.abs(num), 5) * 1.1;
        },
        target(player, target) {
          if (!ui.selected.cards.length) {
            return 0;
          }
          const card = ui.selected.cards[0], color = get.color(card), val = get.value(card, target);
          if (color == "red" && target.getHp() <= player.getHp() && target.isDamaged()) {
            return get.recoverEffect(target, player, target) + val / 1.4;
          } else if (color == "black" && target.getHp() >= player.getHp()) {
            return get.effect(target, { name: "losehp" }, player, target) + val / 1.4;
          }
          return val / 1.4;
        }
      }
    }
  },
  //吴班
  dcyouzhan: {
    audio: 2,
    trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
    forced: true,
    getIndex(event, player) {
      if (player != _status.currentPhase) {
        return false;
      }
      return game.filterPlayer((current) => {
        if (current == player) {
          return false;
        }
        const evt = event.getl(current);
        return evt?.cards2?.length;
      }).sortBySeat();
    },
    logTarget: (event, player, triggername, target) => target,
    async content(event, trigger, player) {
      const target = event.targets[0];
      const next = player.draw();
      next.gaintag = [event.name];
      await next;
      player.addTempSkill(event.name + "_limit");
      target.addTempSkill(event.name + "_effect");
      target.addMark(event.name + "_effect", 1, false);
      target.addTempSkill(event.name + "_draw");
    },
    ai: {
      damageBonus: true,
      skillTagFilter(player, tag, arg) {
        if (!arg || !arg.target || !arg.target.hasSkill("dcyouzhan_effect")) {
          return false;
        }
      }
    },
    subSkill: {
      effect: {
        audio: "dcyouzhan",
        trigger: { player: "damageBegin3" },
        filter(event, player) {
          return player.hasMark("dcyouzhan_effect");
        },
        forced: true,
        charlotte: true,
        onremove: true,
        async content(event, trigger, player) {
          trigger.num += player.countMark(event.name);
          player.removeSkill(event.name);
        },
        mark: true,
        intro: { content: "本回合下一次受到的伤害+#" },
        ai: {
          effect: {
            target(card, player, target) {
              if (get.tag(card, "damage")) {
                return 1 + 0.5 * target.countMark("dcyouzhan_effect");
              }
            }
          }
        }
      },
      draw: {
        trigger: { global: "phaseJieshuBegin" },
        forced: true,
        charlotte: true,
        filter(event, player) {
          return !player.getHistory("damage").length;
        },
        async content(event, trigger, player) {
          await player.draw({ num: Math.min(3, player.getHistory("lose").length) });
        }
      },
      limit: {
        charlotte: true,
        onremove(player) {
          player.removeGaintag("dcyouzhan");
        },
        mod: {
          ignoredHandcard(card, player) {
            if (card.hasGaintag("dcyouzhan")) {
              return true;
            }
          },
          cardDiscardable(card, player, name) {
            if (name == "phaseDiscard" && card.hasGaintag("dcyouzhan")) {
              return false;
            }
          }
        }
      }
    }
  },
  //乐蔡文姬
  dcshuangjia: {
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
      const cards2 = player.getCards("h");
      player.addGaintag(cards2, "dcshuangjia_tag");
    },
    mod: {
      ignoredHandcard(card, player) {
        if (card.hasGaintag("dcshuangjia_tag")) {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name == "phaseDiscard" && card.hasGaintag("dcshuangjia_tag")) {
          return false;
        }
      },
      globalTo(from, to, distance) {
        return distance + Math.min(
          5,
          to.countCards("h", (card) => card.hasGaintag("dcshuangjia_tag"))
        );
      }
    },
    mark: true,
    marktext: "笳",
    intro: {
      name: "胡笳",
      content(storage, player) {
        const num = player.countCards("h", (card) => card.hasGaintag("dcshuangjia_tag"));
        return `当前拥有${get.cnNumber(num)}张“胡笳”手牌`;
      },
      markcount(storage, player, skill) {
        return player.countCards("h", (card) => card.hasGaintag("dcshuangjia_tag"));
      }
    }
  },
  dcbeifen: {
    audio: 2,
    trigger: {
      player: ["loseAfter"],
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    filter(event, player) {
      const evt = event.getl(player);
      if (!evt?.hs?.length) {
        return false;
      }
      if (event.name == "lose") {
        return Object.values(event.gaintag_map).flat().includes("dcshuangjia_tag");
      }
      return player.hasHistory("lose", (evt2) => {
        if (event != evt2.getParent()) {
          return false;
        }
        return Object.values(evt2.gaintag_map).flat().includes("dcshuangjia_tag");
      });
    },
    forced: true,
    async content(event, trigger, player) {
      const suits = new Set(lib.suit);
      for (const card of player.iterableGetCards("h", (card2) => card2.hasGaintag("dcshuangjia_tag"))) {
        suits.delete(get.suit(card));
      }
      const cards2 = [];
      for (const suit of suits) {
        const card = get.cardPile((cardx) => get.suit(cardx, false) == suit);
        if (card) {
          cards2.push(card);
        }
      }
      if (cards2.length) {
        await player.gain({
          cards: cards2,
          animate: "draw"
        });
      }
    },
    mod: {
      cardUsable(card, player) {
        var len = player.countCards("h");
        var cnt = player.countCards("h", (card2) => card2.hasGaintag("dcshuangjia_tag"));
        if (2 * cnt < len) {
          return Infinity;
        }
      },
      targetInRange(card, player) {
        var len = player.countCards("h");
        var cnt = player.countCards("h", (card2) => card2.hasGaintag("dcshuangjia_tag"));
        if (2 * cnt < len) {
          return true;
        }
      },
      aiOrder(player, card, num) {
        if (get.itemtype(card) == "card" && card.hasGaintag("dcshuangjia_tag")) {
          var suits = lib.suit.slice();
          player.countCards("h", (cardx) => {
            if (!cardx.hasGaintag("dcshuangjia_tag")) {
              return false;
            }
            if (card == cardx) {
              return false;
            }
            suits.remove(get.suit(cardx));
          });
          if (suits.length) {
            return num + suits.length * 2.5;
          }
        }
      }
    }
  },
  //孟优
  dcmanzhi: {
    audio: 2,
    trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
    filter(event, player) {
      if (event.name == "phaseJieshu") {
        var del = 0;
        game.getGlobalHistory("changeHp", (evt) => {
          if (evt.player != player) {
            return;
          }
          for (var phase of lib.phaseName) {
            var evtx = evt.getParent(phase);
            if (evtx && evtx.name == phase) {
              del += evt.changedHp;
              break;
            }
          }
        });
        if (del != 0) {
          return false;
        }
      }
      return game.hasPlayer((current) => {
        if (current == player) {
          return false;
        }
        return !player.hasSkill("dcmanzhi_1") && current.countCards("he") >= 1 || !player.hasSkill("dcmanzhi_2") && current.countCards("hej");
      });
    },
    async cost(event, trigger, player) {
      const result = await player.chooseButtonTarget({
        createDialog: [
          `###${get.prompt(event.skill)}###<div class='text center'>你可以选择一项并选择一名其他角色…</div>`,
          [
            [
              ["give", "令其交给你两张牌，然后其视为使用一张无距离限制的【杀】"],
              ["gain", "你获得其区域内的至多两张牌，然后交给其等量的牌并摸一张牌"]
            ],
            "textbutton"
          ]
        ],
        filterButton(button) {
          const player2 = get.player();
          const trigger2 = get.event().getTrigger();
          const chosen = [player2.hasSkill("dcmanzhi_1"), player2.hasSkill("dcmanzhi_2")];
          if (button.link === "give") {
            return game.hasPlayer((current) => current != player2 && current.countCards("he") >= 2 && (!chosen[0] || trigger2.name == "phaseZhunbei"));
          }
          return game.hasPlayer((current) => current != player2 && current.hasCards("hej") && (!chosen[1] || trigger2.name == "phaseZhunbei"));
        },
        filterTarget(card, player2, target) {
          if (!ui.selected.buttons.length || player2 == target) {
            return false;
          }
          const trigger2 = get.event().getTrigger();
          const chosen = [player2.hasSkill("dcmanzhi_1"), player2.hasSkill("dcmanzhi_2")];
          const link = ui.selected.buttons[0].link;
          if (link === "give") {
            return target.countCards("he") >= 2 && (!chosen[0] || trigger2.name == "phaseZhunbei");
          }
          return target.hasCards("hej") && (!chosen[1] || trigger2.name == "phaseZhunbei");
        },
        ai1(button) {
          const player2 = get.player();
          const link = button.link;
          const trigger2 = get.event().getTrigger();
          if (link == "gain") {
            if (trigger2.name == "phaseZhunbei" && !player2.hasShan() && !game.hasPlayer((current) => current != player2 && current.countCards("he") >= 2 && get.attitude(player2, current) > 0)) {
              return 2.5;
            }
            return 1.5;
          } else {
            if (game.hasPlayer((current) => {
              const att = get.attitude(player2, current);
              return att > 0 && current.getUseValue({ name: "sha" }, false) > 5 && current.countCards("he") >= 4;
            })) {
              return 2;
            }
            if (player2.hasShan() || player2.getHp() >= 2) {
              return 1;
            }
            return 0;
          }
        },
        ai2(target) {
          const player2 = get.player();
          get.event().getTrigger();
          const link = ui.selected.buttons[0].link;
          const att = get.attitude(player2, target);
          if (link == "give") {
            if (att > 0 && target.getUseValue({ name: "sha" }, false) > 5 && target.countCards("he") >= 4) {
              return 2;
            }
            if (att < 0 && (target.getUseValue({ name: "jiu" }, false) <= 5 || player2.getHp() >= 2)) {
              return 1;
            }
          }
          return 1 - att;
        }
      }).forResult();
      event.result = {
        bool: result.bool,
        targets: result.targets,
        cost_data: result.links
      };
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      if (event.cost_data[0] == "give") {
        player.addTempSkill("dcmanzhi_1");
        const num = Math.min(2, target.countCards("he"));
        if (!num) {
          return;
        }
        const result = await target.chooseToGive(player, "he", true, num, `蛮智：请交给${get.translation(player)}${get.cnNumber(num)}张牌`).forResult();
        if (!result?.bool) {
          return;
        }
        await target.chooseUseTarget("sha", true, "nodistance");
      } else {
        player.addTempSkill("dcmanzhi_2");
        let result = await player.gainPlayerCard(target, "hej", [1, 2], true).forResult();
        if (!result?.bool || !target.isIn()) {
          return;
        }
        const num = result.cards.length;
        const hs = player.getCards("he");
        if (!hs.length) {
          return;
        }
        result = await player.chooseToGive(target, "he", true, num, `交给${get.translation(target)}${get.cnNumber(num)}张牌`).forResult();
        if (result?.bool) {
          await player.draw();
        }
      }
    },
    subSkill: {
      1: { charlotte: true },
      2: { charlotte: true }
    }
  },
  //孙綝
  dczigu: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterCard: true,
    position: "he",
    selectCard: 1,
    check(card) {
      var player = _status.event.player;
      if (!player.hasSkill("dczuowei")) {
        return 6 - get.value(card);
      }
      if (player.countCards("h") == player.countCards("e") + 1 && !player.hasCard((card2) => player.hasValueTarget(card2), "h")) {
        if (get.position(card) == "e") {
          return 0;
        }
        return 8 - get.value(card);
      }
      return 6 - get.value(card);
    },
    async content(event, trigger, player) {
      let result;
      const targets = game.filterPlayer((current) => {
        return current.countGainableCards(player, "e");
      });
      if (targets.length == 0) {
        result = { bool: false };
      } else if (targets.length == 1) {
        result = { bool: true, targets };
      } else {
        result = await player.chooseTarget("自固：获得一名角色装备区里的一张牌", true, (card, player2, target2) => {
          return target2.countGainableCards(player2, "e");
        }).set("ai", (target2) => {
          if (target2 == _status.event.player) {
            return 10;
          }
          if (get.attitude(_status.event.player, target2) < 0) {
            if (target2.hasCard((card) => {
              return get.value(card, player) >= 6;
            })) {
              return 12;
            }
            return 8;
          }
          return 0;
        }).forResult();
      }
      let target;
      if (result.bool) {
        target = result.targets[0];
        event.target = target;
        result = await player.gainPlayerCard("e", target, true).forResult();
      }
      if (!result.bool || target == player || !result.cards || !result.cards.some((i) => get.owner(i) == player)) {
        await player.draw();
      }
    },
    ai: {
      order(item, player) {
        if (!player.hasSkill("dczuowei")) {
          return 9;
        }
        if (player.countCards("h") == player.countCards("e") + 1 && !player.hasCard((card) => player.hasValueTarget(card), "h")) {
          return 9;
        }
        return 1;
      },
      result: {
        player: 1
      }
    }
  },
  dczuowei: {
    audio: 2,
    trigger: { player: "useCard" },
    frequent: true,
    filter(event, player) {
      if (_status.currentPhase != player) {
        return false;
      }
      if (!player.hasSkill("dczuowei_ban")) {
        return true;
      }
      return Math.sign(player.countCards("h") - Math.max(1, player.countCards("e"))) >= 0;
    },
    direct: true,
    locked: false,
    async content(event, trigger, player) {
      let result;
      const hs = player.countCards("h");
      const es = Math.max(1, player.countCards("e"));
      const sign = Math.sign(hs - es);
      if (sign > 0) {
        result = await player.chooseBool(get.prompt("dczuowei"), "令" + get.translation(trigger.card) + "不可被响应").set("frequentSkill", event.name).set("ai", () => 1).forResult();
      } else if (sign == 0) {
        result = await player.chooseTarget(get.prompt("dczuowei"), "对一名其他角色造成1点伤害", lib.filter.notMe).set("ai", (target) => {
          return get.damageEffect(target, _status.event.player, _status.event.player);
        }).forResult();
      } else {
        result = await player.chooseBool(get.prompt("dczuowei"), "摸两张牌，然后本回合你不能再触发该分支").set("ai", () => 1).forResult();
      }
      if (!result.bool) {
        return;
      }
      if (sign <= 0 && !event.isMine() && !event.isOnline()) {
        await game.delayx();
      }
      if (sign > 0) {
        player.logSkill("dczuowei");
        trigger.directHit.addArray(game.players);
        return;
      }
      if (sign == 0) {
        const target = result.targets[0];
        player.logSkill("dczuowei", target);
        await target.damage();
        return;
      }
      player.logSkill("dczuowei");
      await player.draw(2);
      player.addTempSkill("dczuowei_ban");
    },
    subSkill: {
      ban: { charlotte: true }
    },
    mod: {
      aiValue(player, card, num) {
        if (_status.currentPhase != player) {
          return;
        }
        const event = get.event();
        if (!player.isPhaseUsing()) {
          return;
        }
        if (event.type != "phase") {
          return;
        }
        const cardsh = [], cardse = [];
        for (const cardx of ui.selected.cards) {
          const pos = get.position(cardx);
          if (pos == "h") {
            cardsh.add(cardx);
          } else if (pos == "e") {
            cardse.add(cardx);
          }
        }
        const hs = player.countCards("h") - cardsh.length, es = Math.max(1, player.countCards("e") - cardse.length);
        const delt = hs - es;
        if (delt <= 0) {
          return;
        }
        if (get.position(card) == "h" && delt == 1) {
          return num / 1.25;
        }
      },
      aiUseful() {
        return lib.skill.dczuowei.mod.aiValue.apply(this, arguments);
      },
      aiOrder(player, card, num) {
        if (player.hasSkill("dczuowei_ban") || _status.currentPhase != player) {
          return;
        }
        const cardsh = [], cardse = [];
        const pos = get.position(card);
        if (pos == "h") {
          cardsh.add(card);
        } else if (pos == "e") {
          cardse.add(card);
        }
        if (get.tag(card, "draw") || get.tag(card, "gain")) {
          const hs = player.countCards("h") - cardsh.length, es = Math.max(1, player.countCards("e") - cardse.length + (get.type(card) == "equip"));
          if (player.hasSkill("dczuowei_ban") && hs < es || hs == es) {
            return num + 10;
          }
          return num / 5;
        }
      }
    },
    ai: {
      threaten: 3,
      reverseEquip: true,
      effect: {
        player_use(card, player, target, current) {
          if (_status.currentPhase != player) {
            return;
          }
          let cha = player.countCards("h") - Math.max(1, player.countCards("e"));
          if (cha == 0 || cha < 0 && !player.hasSkill("dczuowei_ban")) {
            return [1, 2];
          }
        }
      }
    }
  },
  //刘宠骆俊
  dcminze: {
    audio: 2,
    enable: "phaseUse",
    filterTarget(card, player, target) {
      if (player.getStorage("dcminze_targeted").includes(target)) {
        return false;
      }
      return target.countCards("h") < player.countCards("h");
    },
    filterCard(card, player) {
      if (!ui.selected.cards.length) {
        return true;
      }
      return get.name(ui.selected.cards[0]) != get.name(card);
    },
    selectCard: [1, 2],
    complexCard: true,
    position: "he",
    discard: false,
    lose: false,
    delay: false,
    group: "dcminze_draw",
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      await player.give(cards2, target);
      player.addTempSkill("dcminze_targeted", "phaseUseAfter");
      player.markAuto("dcminze_targeted", [target]);
      player.addTempSkill("dcminze_given");
      player.markAuto(
        "dcminze_given",
        cards2.map((card) => get.name(card, player))
      );
    },
    ai: {
      order: 6.5,
      expose: 0.2
    },
    subSkill: {
      targeted: { onremove: true, charlotte: true },
      given: {
        charlotte: true,
        onremove: true,
        intro: {
          content: "本回合以此法交出的牌名：$"
        }
      },
      draw: {
        trigger: { player: "phaseJieshuBegin" },
        filter(event, player) {
          return player.getStorage("dcminze_given").length;
        },
        forced: true,
        locked: false,
        async content(event, trigger, player) {
          const num = Math.min(5, player.getStorage("dcminze_given").length) - player.countCards("h");
          if (num > 0) {
            player.draw(num);
          }
        }
      }
    }
  },
  dcjini: {
    audio: 2,
    trigger: { player: "damageEnd" },
    direct: true,
    filter(event, player) {
      return player.maxHp - player.countMark("dcjini_counted") > 0;
    },
    async content(event, trigger, player) {
      let result;
      result = await player.chooseCard(get.prompt2("dcjini"), [1, player.maxHp - player.countMark("dcjini_counted")], lib.filter.cardRecastable).set("ai", (card) => {
        return 6 - get.value(card);
      }).forResult();
      if (result.bool) {
        const cards2 = result.cards;
        player.logSkill("dcjini");
        player.addTempSkill("dcjini_counted");
        player.addMark("dcjini_counted", cards2.length, false);
        event.recast = player.recast(cards2);
        await event.recast;
      } else {
        return;
      }
      if (trigger.source && trigger.source.isIn() && player.hasHistory("gain", (evt) => evt.getParent(2) == event.recast && evt.cards.some((value) => get.name(value) == "sha"))) {
        await player.chooseToUse(
          function(card) {
            if (get.name(card) != "sha") {
              return false;
            }
            return lib.filter.filterCard.apply(this, arguments);
          },
          "击逆：是否对" + get.translation(trigger.source) + "使用一张不可被响应的杀？"
        ).set("complexSelect", true).set("filterTarget", function(card, player2, target) {
          if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
            return false;
          }
          return lib.filter.targetEnabled.apply(this, arguments);
        }).set("sourcex", trigger.source).set("oncard", () => {
          _status.event.directHit.addArray(game.players);
        });
      }
    },
    subSkill: {
      counted: {
        onremove: true,
        charlotte: true
      }
    }
  },
  //乐綝
  dcporui: {
    audio: 2,
    trigger: { global: "phaseJieshuBegin" },
    filter(event, player) {
      if (player == event.player) {
        return false;
      }
      if (player.countMark("dcporui_round") >= (player.hasMark("dcgonghu_basic") ? 2 : 1) || player.countCards("h") == 0) {
        return false;
      }
      return game.hasPlayer((current) => {
        if (current == player || current == event.player) {
          return false;
        }
        return current.hasHistory("lose", (evt) => evt.cards2.length);
      }) && player.countCards("he") > 0;
    },
    async cost(event, trigger, player) {
      const map = /* @__PURE__ */ new Map();
      game.countPlayer((current) => {
        if (current == player || current == trigger.player) {
          return false;
        }
        if (current.hasHistory("lose", (evt) => evt.cards2.length)) {
          map.set(
            current,
            Math.min(
              5,
              current.getHistory("lose").reduce((num, evt) => num + evt.cards2.length, 0)
            ) + 1
          );
        }
      });
      const next = player.chooseCardTarget({
        prompt: get.prompt(event.skill),
        prompt2: get.skillInfoTranslation(event.skill, player, false),
        filterCard: lib.filter.cardDiscardable,
        position: "he",
        filterTarget(card, player2, target) {
          return get.event().map.has(target);
        },
        ai1(card) {
          return 7 - get.value(card);
        },
        ai2(target) {
          let player2 = get.event().player, num = get.event().map.get(target), eff = get.effect(target, { name: "sha" }, player2, player2);
          if (num > 1 && eff !== 0) {
            eff -= 10 / target.getHp() * Math.pow(2, num);
          }
          return eff * num;
        }
      }).set("map", map);
      next.set(
        "targetprompt2",
        next.targetprompt2.concat([
          (target) => {
            if (!target.isIn() || !get.event().filterTarget(null, get.player(), target)) {
              return false;
            }
            return `破锐${get.event().map.get(target)}`;
          }
        ])
      );
      event.result = await next.forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target],
        cards: cards2
      } = event;
      player.addTempSkill(event.name + "_round", "roundStart");
      player.addMark(event.name + "_round", 1, false);
      await player.discard(cards2);
      const num = Math.min(
        5,
        target.getHistory("lose").reduce((num2, evt) => num2 + evt.cards2.length, 0)
      );
      let count = num + 1;
      const card = get.autoViewAs({ name: "sha", isCard: true, storage: { [event.name]: true } });
      while (count-- && player.canUse(card, target, false) && target.isIn()) {
        await player.useCard(card, target);
      }
      if (!player.hasMark("dcgonghu_damage") && target.isIn() && player.countCards("h") && num) {
        const numx = Math.min(num, player.countCards("h"));
        await player.chooseToGive(target, "h", numx, true, `破锐：交给${get.translation(target)}${get.cnNumber(numx)}张手牌`);
      }
    },
    subSkill: { round: { charlotte: true, onremove: true } },
    ai: {
      expose: 0.4,
      threaten: 3.8
    }
  },
  dcgonghu: {
    audio: 2,
    trigger: {
      player: ["loseAfter", "damageEnd"],
      source: "damageSource",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    forced: true,
    filter(event, player) {
      if (event.name == "damage") {
        if (player.hasMark("dcgonghu_damage")) {
          return false;
        }
        let num1 = 0, num2 = 0;
        player.getHistory("damage", (evt2) => num1 += evt2.num);
        player.getHistory("sourceDamage", (evt2) => num2 += evt2.num);
        return num1 > 1 || num2 > 1;
      }
      if (!_status.currentPhase || _status.currentPhase == player) {
        return false;
      }
      if (player.hasMark("dcgonghu_basic")) {
        return false;
      }
      if (_status.currentPhase && _status.currentPhase == player) {
        return false;
      }
      var evt = event.getl(player);
      if (!evt || !evt.cards2 || !evt.cards2.some((i) => get.type2(i, player) == "basic")) {
        return false;
      }
      var num = 0;
      player.getHistory("lose", function(evtx) {
        if (num < 2) {
          if (evtx && evtx.cards2) {
            num += evtx.cards2.filter((i) => get.type2(i, player) == "basic").length;
          }
        }
      });
      return num >= 2;
    },
    group: ["dcgonghu_basic", "dcgonghu_trick"],
    async content(event, trigger, player) {
      player.addMark("dcgonghu_" + (trigger.name == "damage" ? "damage" : "basic"), 1, false);
      game.log(player, "修改了技能", "#g【破锐】");
    },
    ai: {
      combo: "dcporui"
    },
    subSkill: {
      trick: {
        audio: "dcgonghu",
        trigger: { player: "useCard2" },
        direct: true,
        locked: true,
        filter(event, player) {
          if (!player.hasMark("dcgonghu_basic") || !player.hasMark("dcgonghu_damage")) {
            return false;
          }
          var card = event.card;
          if (get.color(card, false) != "red" || get.type(card, null, false) != "trick") {
            return false;
          }
          var info = get.info(card);
          if (info.allowMultiple == false) {
            return false;
          }
          if (event.targets && !info.multitarget) {
            if (game.hasPlayer(function(current) {
              return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
            })) {
              return true;
            }
          }
          return false;
        },
        async content(event, trigger, player) {
          let result;
          const prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
          result = await player.chooseTarget(get.prompt("dcgonghu_trick"), function(card, player2, target) {
            player2 = _status.event.player;
            return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player2, target);
          }).set("prompt2", prompt2).set("ai", function(target) {
            const trigger2 = _status.event.getTrigger();
            const player2 = _status.event.player;
            return get.effect(target, trigger2.card, player2, player2);
          }).set("card", trigger.card).set("targets", trigger.targets).forResult();
          if (result.bool) {
            if (!event.isMine() && !event.isOnline()) {
              game.delayx();
            }
            event.targets = result.targets;
          } else {
            return;
          }
          if (event.targets) {
            player.logSkill("dcgonghu_trick", event.targets);
            trigger.targets.addArray(event.targets);
          }
        }
      },
      basic: {
        audio: "dcgonghu",
        trigger: { player: "useCard" },
        forced: true,
        filter(event, player) {
          if (!player.hasMark("dcgonghu_basic") || !player.hasMark("dcgonghu_damage")) {
            return false;
          }
          var card = event.card;
          return get.color(card, false) == "red" && get.type(card, null, false) == "basic";
        },
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.filterPlayer());
          game.log(trigger.card, "不可被响应");
        }
      }
    }
  },
  //张闿
  dcxiangshu: {
    audio: 2,
    trigger: { global: "phaseUseBegin" },
    direct: true,
    filter(event, player) {
      return event.player != player && event.player.countCards("h") >= event.player.hp;
    },
    async content(event, trigger, player) {
      let result;
      const list = [0, 1, 2, 3, 4, 5, "cancel2"];
      result = await player.chooseControl(list).set("prompt", get.prompt2("dcxiangshu")).set("ai", () => {
        return _status.event.choice;
      }).set(
        "choice",
        (function() {
          if (get.attitude(player, trigger.player) > 0) {
            return "cancel2";
          }
          const cards2 = trigger.player.getCards("h");
          let num2 = 0;
          for (const card of cards2) {
            if (!trigger.player.hasValueTarget(card)) {
              num2++;
              if (num2 >= 5) {
                break;
              }
            }
          }
          if (cards2.length >= 3 && Math.random() < 0.5) {
            num2 = Math.max(0, num2 - 1);
          }
          return num2;
        })()
      ).forResult();
      if (result?.control == "cancel2") {
        return;
      }
      player.logSkill("dcxiangshu", trigger.player);
      const num = result.index;
      player.storage.dcxiangshu_lottery = num;
      player.addTempSkill("dcxiangshu_lottery", "phaseUseAfter");
      result = await player.chooseToDiscard("相鼠：是否弃置一张手牌不公布此数字？", "h").set("ai", (card) => 2 - get.value(card)).forResult();
      if (!result?.bool) {
        const lotteryNum = player.storage.dcxiangshu_lottery;
        player.markSkill("dcxiangshu_lottery");
        player.popup(lotteryNum);
        game.log(player, "选择了数字", "#g" + lotteryNum);
      }
    },
    subSkill: {
      lottery: {
        audio: "dcxiangshu",
        trigger: { global: "phaseUseEnd" },
        charlotte: true,
        forced: true,
        onremove: true,
        logTarget: "player",
        filter(event, player) {
          return typeof player.storage.dcxiangshu_lottery == "number" && Math.abs(event.player.countCards("h") - player.storage.dcxiangshu_lottery) <= 1;
        },
        async content(event, trigger, player) {
          const delt = Math.abs(trigger.player.countCards("h") - player.storage.dcxiangshu_lottery);
          if (delt <= 1 && trigger.player.countGainableCards("he", player) > 0) {
            await player.gainPlayerCard(trigger.player, "he", true);
          }
          if (delt == 0) {
            await trigger.player.damage(player);
          }
        },
        intro: { content: "猜测的数字为#" }
      }
    }
  },
  //裴元绍
  dcmoyu: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return game.hasPlayer((current) => lib.skill.dcmoyu.filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return player != target && !player.getStorage("dcmoyu_clear").includes(target) && target.countGainableCards(player, "hej");
    },
    async content(event, trigger, player) {
      const target = event.target;
      player.addTempSkill("dcmoyu_clear", "phaseUseAfter");
      player.markAuto("dcmoyu_clear", [target]);
      await player.gainPlayerCard(target, "hej", true, 1 + player.hasSkill("dcmoyu_add"));
      player.removeSkill("dcmoyu_add");
      player.getStorage("dcmoyu_clear").length;
      const result = await target.chooseToUse(
        function(card, player2, event2) {
          if (get.name(card) != "sha") {
            return false;
          }
          return lib.filter.filterCard.apply(this, arguments);
        },
        "是否对" + get.translation(player) + "使用一张无距离限制的【杀】？"
      ).set("targetRequired", true).set("complexTarget", true).set("complexSelect", true).set("filterTarget", function(card, player2, target2) {
        if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
          return false;
        }
        return lib.filter.targetEnabled.apply(this, arguments);
      }).set("sourcex", player).forResult();
      if (result.bool) {
        if (player.hasHistory("damage", (evt) => {
          return evt.card && evt.card.name == "sha" && evt.getParent(4) == event;
        })) {
          player.tempBanSkill("dcmoyu");
          player.addTempSkill("dcmoyu_ban");
        } else {
          player.addTempSkill("dcmoyu_add", "phaseChange");
        }
      }
    },
    global: "dcmoyu_ai",
    subSkill: {
      clear: {
        charlotte: true,
        onremove: true
      },
      ban: {
        charlotte: true,
        mark: true,
        marktext: '<span style="text-decoration: line-through;">欲</span>',
        intro: { content: "偷马贼被反打了！" }
      },
      add: {
        charlotte: true,
        mark: true,
        marktext: "欲",
        intro: { content: "欲望加速，下次抢两张！" }
      },
      ai: {
        ai: {
          effect: {
            target(card, player, target, current) {
              if (get.type(card) == "delay" && current < 0) {
                var currentx = _status.currentPhase;
                if (!currentx || !currentx.isIn()) {
                  return;
                }
                var list = game.filterPlayer((current2) => {
                  if (current2 == target) {
                    return true;
                  }
                  if (!current2.hasSkill("dcmoyu")) {
                    return false;
                  }
                  if (current2.hasJudge("lebu")) {
                    return false;
                  }
                  return get.attitude(current2, target) > 0;
                });
                list.sortBySeat(currentx);
                if (list.indexOf(target) != 0) {
                  return "zerotarget";
                }
              }
            }
          }
        }
      }
    },
    ai: {
      order: 9,
      threaten: 2.4,
      result: {
        target(player, target) {
          var num = get.sgn(get.attitude(player, target));
          var eff = get.effect(target, { name: "shunshou" }, player, player) * num;
          if (eff * num > 0) {
            return eff / 10;
          }
          if (player.hasShan() && !target.hasSkillTag(
            "directHit_ai",
            true,
            {
              target: player,
              card: { name: "sha" }
            },
            true
          )) {
            return eff;
          }
          if (target.hasSha() && player.hp + player.countCards("hs", function(card) {
            var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
            if (mod2 != "unchanged") {
              return mod2;
            }
            var mod = game.checkMod(card, player, player, "unchanged", "cardSavable", player);
            if (mod != "unchanged") {
              return mod;
            }
            var savable = get.info(card).savable;
            if (typeof savable == "function") {
              savable = savable(card, player, player);
            }
            return savable;
          }) <= 1) {
            return 0;
          }
          return eff;
        }
      }
    }
  },
  oldmoyu: {
    audio: "dcmoyu",
    init: () => {
      game.addGlobalSkill("oldmoyu_ai");
    },
    onremove: () => {
      if (!game.hasPlayer((i) => i.hasSkill("oldmoyu", null, null, false), true)) {
        game.removeGlobalSkill("oldmoyu_ai");
      }
    },
    enable: "phaseUse",
    filter(event, player) {
      return !player.hasSkill("oldmoyu_ban") && game.hasPlayer((current) => lib.skill.oldmoyu.filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return player != target && !player.getStorage("oldmoyu_clear").includes(target) && target.countGainableCards(player, "hej");
    },
    async content(event, trigger, player) {
      let result;
      const { target } = event;
      player.addTempSkill("oldmoyu_clear");
      player.markAuto("oldmoyu_clear", [target]);
      result = await player.gainPlayerCard(target, "hej", true).forResult();
      const num = player.getStorage("oldmoyu_clear").length;
      result = await target.chooseToUse(
        function(card, player2, event2) {
          if (get.name(card) != "sha") {
            return false;
          }
          return lib.filter.filterCard.apply(this, arguments);
        },
        "是否对" + get.translation(player) + "使用一张无距离限制的【杀】（伤害基数为" + num + "）？"
      ).set("targetRequired", true).set("complexTarget", true).set("complexSelect", true).set("filterTarget", function(card, player2, target2) {
        if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
          return false;
        }
        return lib.filter.targetEnabled.apply(this, arguments);
      }).set("sourcex", player).set("num", num).set("oncard", (card) => {
        _status.event.baseDamage = _status.event.getParent().num;
      }).forResult();
      if (result.bool) {
        if (player.hasHistory("damage", (evt) => {
          return evt.card && evt.card.name == "sha" && evt.getParent(4) == event;
        })) {
          player.addTempSkill("oldmoyu_ban");
        }
      }
    },
    subSkill: {
      clear: {
        charlotte: true,
        onremove: true
      },
      ban: {
        charlotte: true,
        mark: true,
        marktext: "欲",
        intro: { content: "偷马贼被反打了！" }
      },
      ai: {
        trigger: { player: "dieAfter" },
        filter: () => {
          return !game.hasPlayer((i) => i.hasSkill("oldmoyu", null, null, false), true);
        },
        silent: true,
        forceDie: true,
        content: () => {
          game.removeGlobalSkill("oldmoyu_ai");
        },
        ai: {
          effect: {
            target(card, player, target, current) {
              if (get.type(card) == "delay" && current < 0) {
                var currentx = _status.currentPhase;
                if (!currentx || !currentx.isIn()) {
                  return;
                }
                var list = game.filterPlayer((current2) => {
                  if (current2 == target) {
                    return true;
                  }
                  if (!current2.hasSkill("oldmoyu")) {
                    return false;
                  }
                  if (current2.hasJudge("lebu")) {
                    return false;
                  }
                  return get.attitude(current2, target) > 0;
                });
                list.sortBySeat(currentx);
                if (list.indexOf(target) != 0) {
                  return "zerotarget";
                }
              }
            }
          }
        }
      }
    },
    ai: {
      order: 9,
      threaten: 2.4,
      result: {
        target(player, target) {
          var num = get.sgn(get.attitude(player, target));
          var eff = get.effect(target, { name: "shunshou" }, player, player) * num;
          if (eff * num > 0) {
            return eff / 10;
          }
          if (player.hasShan() && !target.hasSkillTag(
            "directHit_ai",
            true,
            {
              target: player,
              card: { name: "sha" }
            },
            true
          )) {
            return eff;
          }
          if (target.hasSha() && player.hp + player.countCards("hs", function(card) {
            var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
            if (mod2 != "unchanged") {
              return mod2;
            }
            var mod = game.checkMod(card, player, player, "unchanged", "cardSavable", player);
            if (mod != "unchanged") {
              return mod;
            }
            var savable = get.info(card).savable;
            if (typeof savable == "function") {
              savable = savable(card, player, player);
            }
            return savable;
          }) <= player.getStorage("oldmoyu_clear").length + 1) {
            return 0;
          }
          return eff;
        }
      }
    }
  },
  //张楚
  dcjizhong: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: lib.filter.notMe,
    selectTarget: 1,
    async content(event, trigger, player) {
      const target = event.target;
      await target.draw(2);
      if (!target.hasMark("dcjizhong")) {
        const result = await target.chooseBool(`集众：令${get.translation(player)}获得你三张牌，或点击“取消”获得“信众”标记`).set("ai", () => false).forResult();
        if (!result.bool) {
          target.addMark("dcjizhong", 1);
          return;
        }
      }
      let num = Math.min(target.countCards("he"), 3);
      if (num > 0) {
        await player.gainPlayerCard(target, "he", num, true);
      }
    },
    marktext: "信",
    intro: {
      name: "信众",
      name2: "信众",
      markcount: () => 0,
      content: "已成为信徒"
    },
    ai: {
      order: 9.5,
      result: {
        target(player, target) {
          var num = target.countCards("h");
          if (num <= 1) {
            return -num;
          }
          if (get.attitude(player, target) > 0 && !target.hasMark("dcjizhong")) {
            return 1;
          }
          return -1 / (num / 2 + 1);
        }
      }
    }
  },
  dcrihui: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    usable: 1,
    filter(event, player) {
      if (!event.targets || event.targets.length != 1 || event.targets[0] == player) {
        return false;
      }
      const card = event.card;
      const target = event.targets[0];
      const marked = target.hasMark("dcjizhong");
      return (get.type(card) == "trick" || get.color(card) == "black" && get.type(card) == "basic") && (marked && target.countGainableCards(player, "hej") || !marked && game.hasPlayer((current) => current.hasMark("dcjizhong")));
    },
    logTarget: (event) => event.targets[0],
    prompt2(event, player) {
      const target = event.targets[0];
      if (target.hasMark("dcjizhong")) {
        return "获得该角色区域内的一张牌";
      } else {
        const targets = game.filterPlayer((current) => current.hasMark("dcjizhong"));
        const card = { name: event.card.name, nature: event.card.nature, isCard: true };
        return `令所有有“信众”的角色（${get.translation(targets)}）依次视为对其使用一张${get.translation(card)}`;
      }
    },
    check(event, player) {
      const target = event.targets[0];
      if (target.hasMark("dcjizhong")) {
        return get.effect(target, { name: "shunshou_copy" }, player, player) > 0;
      } else {
        const card = { name: event.card.name, nature: event.card.nature, isCard: true };
        let eff = 0;
        game.countPlayer((current) => {
          if (!current.hasMark("dcjizhong") || !current.canUse(card, player, false)) {
            return;
          }
          eff += get.effect(target, card, current, player);
        });
        return eff > 0;
      }
    },
    async content(event, trigger, player) {
      const target = trigger.targets[0];
      if (target.hasMark("dcjizhong")) {
        await player.gainPlayerCard(target, "hej", true);
      } else {
        const card = { name: trigger.card.name, nature: trigger.card.nature, isCard: true };
        const targets = game.filterPlayer((current) => current.hasMark("dcjizhong")).sortBySeat(_status.currentPhase);
        for (const current of targets) {
          if (target.isIn() && current.isIn() && current.canUse(card, target, false)) {
            await current.useCard(card, target, false);
          }
        }
      }
    },
    ai: { combo: "dcjizhong" }
  },
  dcguangshi: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return !game.hasPlayer((current) => current != player && !current.hasMark("dcjizhong"));
    },
    forced: true,
    async content(event, trigger, player) {
      await player.draw(game.filterPlayer().reduce((sum, current) => sum + current.countMark("dcjizhong"), 0));
      await player.loseHp();
    },
    ai: {
      combo: "dcjizhong",
      halfneg: true
    }
  },
  //董绾
  dcshengdu: {
    audio: 2,
    trigger: { player: "phaseBegin" },
    direct: true,
    async content(event, trigger, player) {
      const result = await player.chooseTarget(get.prompt2("dcshengdu"), lib.filter.notMe).set("ai", (target) => {
        const player2 = _status.event.player;
        const att = get.attitude(player2, target);
        const eff = get.effect(
          target,
          {
            name: "sha",
            storage: { dcjieling: true }
          },
          player2,
          player2
        );
        let value = att / 5;
        if (value < 0) {
          value = -value / 1.3;
        }
        value = Math.max(value - eff / 20, 0.01);
        return value;
      }).forResult();
      if (result.bool) {
        const target = result.targets[0];
        player.logSkill("dcshengdu", target);
        target.addMark("dcshengdu", 1);
      }
    },
    intro: { content: "mark" },
    group: "dcshengdu_effect",
    subSkill: {
      effect: {
        audio: "dcshengdu",
        trigger: { global: "gainAfter" },
        filter(event, player) {
          return event.getParent(2).name == "phaseDraw" && event.player.hasMark("dcshengdu");
        },
        forced: true,
        logTarget: "player",
        async content(event, trigger, player) {
          var num = trigger.player.countMark("dcshengdu");
          player.draw(num * trigger.cards.length);
          trigger.player.removeMark("dcshengdu", num);
        }
      }
    }
  },
  dcjieling: {
    audio: 2,
    enable: "phaseUse",
    position: "hs",
    viewAs: {
      name: "sha",
      storage: { dcjieling: true }
    },
    filterCard(card, player) {
      if (player.getStorage("dcjieling_count").includes(get.suit(card))) {
        return false;
      }
      if (ui.selected.cards.length) {
        return get.suit(card) != get.suit(ui.selected.cards[0]);
      }
      return true;
    },
    selectCard: 2,
    complexCard: true,
    check(card) {
      return 6 - get.value(card);
    },
    async precontent(event, trigger, player) {
      player.addTempSkill("dcjieling_after");
      event.getParent().addCount = false;
      player.addTempSkill("dcjieling_count", "phaseUseAfter");
      player.markAuto(
        "dcjieling_count",
        event.result.cards.reduce((list, card) => list.add(get.suit(card, player)), [])
      );
    },
    ai: {
      order(item, player) {
        return get.order({ name: "sha" }) + 0.1;
      }
    },
    locked: false,
    mod: {
      targetInRange(card) {
        if (card.storage && card.storage.dcjieling) {
          return true;
        }
      },
      cardUsable(card, player, num) {
        if (card.storage && card.storage.dcjieling) {
          return Infinity;
        }
      }
    },
    subSkill: {
      after: {
        charlotte: true,
        audio: "dcjieling",
        trigger: { global: "useCardAfter" },
        filter(event, player) {
          return event.card.name == "sha" && event.card.storage && event.card.storage.dcjieling;
        },
        direct: true,
        async content(event, trigger, player) {
          const damaged = game.hasPlayer2((current) => {
            return current.hasHistory("damage", (evt) => evt.card == trigger.card);
          });
          const targets = trigger.targets.filter((i) => i.isIn());
          player.logSkill("dcjieling_after", targets);
          if (damaged) {
            for (const target of targets) {
              target.loseHp();
            }
          } else {
            for (const target of targets) {
              target.addMark("dcshengdu", 1);
            }
          }
        }
      },
      count: {
        intro: {
          content(s, p) {
            let str = "此阶段已转化过的卡牌花色：";
            for (let i = 0; i < s.length; i++) {
              str += get.translation(s[i]);
            }
            return str;
          }
        },
        charlotte: true,
        onremove: true
      }
    }
  },
  //袁胤
  dcmoshou: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    filter(event, player) {
      return get.color(event.card) == "black" && player.maxHp > player.countMark("dcmoshou");
    },
    frequent: true,
    prompt2(event, player) {
      const num = player.maxHp - player.countMark("dcmoshou");
      let info = "摸" + get.cnNumber(num) + "张牌";
      if (num === 1) {
        info += "，然后重置【墨守】摸牌数";
      } else if (num > 1) {
        info += "，然后令你下次以此法摸的牌数-1";
      }
      return info;
    },
    async content(event, trigger, player) {
      const { name: mark } = event;
      let num = player.maxHp - player.countMark(mark);
      if (num > 0) {
        await player.draw(num);
      }
      if (num > 1) {
        player.addMark(mark, 1, false);
      } else if (num === 1) {
        player.clearMark(mark, false);
      }
    },
    ai: {
      effect: {
        target_use(card, player, target) {
          if (typeof card === "object" && get.color(card) === "black") {
            const num = target.maxHp - target.countMark("dcmoshou");
            return [1, 0.6 * num];
          }
        }
      }
    },
    onremove: true,
    mark: true,
    intro: {
      markcount: (storage, player) => player.maxHp - player.countMark("dcmoshou"),
      content: (storage, player) => `下次【墨守】摸牌数：${player.maxHp - player.countMark("dcmoshou")}`
    }
  },
  dcyunjiu: {
    audio: 2,
    trigger: { global: "dieAfter" },
    getCards(event, player) {
      const cards2 = [];
      const evt = player.getHistory("lose", (evtx) => evtx.getParent(2) == event)[0];
      return evt ? cards2.addArray(evt.hs).addArray(evt.es).filterInD("d") : [];
    },
    filter(event, player) {
      return get.info("dcyunjiu").getCards(event, event.player).length;
    },
    async cost(event, trigger, player) {
      const { player: target } = trigger, cards2 = get.info(event.skill).getCards(trigger, target);
      let result;
      if (cards2.length > 1) {
        result = await player.chooseCardButton("运柩：请选择要分配的牌", cards2).set("ai", (button) => {
          const player2 = get.player(), { link } = button;
          if (!game.hasPlayer((current) => player2 != current && get.attitude(player2, current)) > 0) {
            return 6.5 - get.value(link);
          }
          return get.value(link);
        }).forResult();
      } else if (cards2.length === 1) {
        result = { bool: true, links: cards2.slice(0) };
      } else {
        return;
      }
      if (!result.bool) {
        return;
      }
      const toGive = result.links.slice(0);
      result = await player.chooseTarget("选择一名其他角色获得" + get.translation(toGive), lib.filter.notMe).set("ai", (target2) => {
        const { player: player2, enemy } = get.event();
        const att = get.attitude(player2, target2);
        if (enemy) {
          return -att;
        } else if (att > 0) {
          return att / (1 + target2.countCards("h"));
        } else {
          return Math.max(0.1, att) / 100;
        }
      }).set("enemy", get.value(toGive[0], player, "raw") < 0).forResult();
      event.result = {
        bool: result.bool,
        targets: result.targets,
        cost_data: toGive
      };
    },
    async content(event, trigger, player) {
      const {
        cost_data: cards2,
        targets: [target]
      } = event;
      player.line(target, "green");
      await target.gain(cards2, "gain2").set("giver", player);
      await player.gainMaxHp();
      await player.recover();
    }
  },
  //高翔
  dcchiying: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target.hp <= player.hp;
    },
    async content(event, tirgger, player) {
      const target = event.target, targets = [player];
      while (game.hasPlayer((current) => target.inRange(current) && !targets.includes(current))) {
        const result = await target.chooseTarget("驰应：是否弃置攻击范围内一名角色一张牌？", function(card, player2, target2) {
          return _status.event.player.inRange(target2) && !_status.event.targets.includes(target2);
        }).set("targets", targets).set("ai", function(target2) {
          return get.effect(target2, { name: "guohe_copy2" }, _status.event.player, _status.event.player);
        }).forResult();
        if (result.bool) {
          target.line(result.targets, "green");
          await target.discardPlayerCard(result.targets[0], true, "he");
          targets.addArray(result.targets);
        } else {
          break;
        }
      }
      if (target != player) {
        let cards2 = [];
        game.getGlobalHistory("cardMove", (evt) => {
          if (evt.getParent(3) == event) {
            cards2.addArray(evt.cards.filter((card) => get.type(card) == "basic"));
          }
        });
        cards2 = cards2.filterInD("d");
        if (cards2.length) {
          target.gain(cards2, "gain2");
        }
      }
    },
    ai: {
      order: 6,
      result: {
        target(player, target) {
          var targets = game.filterPlayer((current) => target.inRange(current) && current != player);
          var eff = 0;
          for (var targetx of targets) {
            var effx = get.effect(targetx, { name: "guohe_copy2" }, player, target);
            if (get.attitude(player, targetx) < 0) {
              effx /= 2;
            }
            eff += effx;
          }
          return (target == player ? 0.5 : 1) * eff * (get.attitude(player, target) <= 0 ? 0.75 : 1);
        }
      }
    }
  },
  //霍峻
  dcgue: {
    audio: 2,
    enable: ["chooseToUse", "chooseToRespond"],
    hiddenCard(player, name) {
      if (player.hasSkill("dcgue_blocker", null, null, false)) {
        return false;
      }
      return name == "sha" || name == "shan";
    },
    filter(event, player) {
      if (event.dcgue || event.type == "wuxie" || player == _status.currentPhase) {
        return false;
      }
      if (player.hasSkill("dcgue_blocker", null, null, false)) {
        return false;
      }
      for (var name of ["sha", "shan"]) {
        if (event.filterCard({ name, isCard: true }, player, event)) {
          return true;
        }
      }
      return false;
    },
    chooseButton: {
      dialog(event, player) {
        var vcards = [];
        for (var name of ["sha", "shan"]) {
          var card = { name, isCard: true };
          if (event.filterCard(card, player, event)) {
            vcards.push(["基本", "", name]);
          }
        }
        return ui.create.dialog("孤扼", [vcards, "vcard"], "hidden");
      },
      check(button) {
        if (_status.event.player.countCards("h", { name: ["sha", "shan"] }) > 1) {
          return 0;
        }
        return 1;
      },
      backup(links, player) {
        return {
          filterCard: () => false,
          selectCard: -1,
          viewAs: {
            name: links[0][2],
            isCard: true
          },
          log: false,
          popname: true,
          async precontent(event, trigger, player2) {
            player2.logSkill("dcgue");
            player2.addTempSkill("dcgue_blocker");
            await player2.showHandcards();
            if (player2.countCards("h", { name: ["sha", "shan"] }) > 1) {
              const evt = event.getParent();
              evt.set("dcgue", true);
              evt.goto(0);
              delete evt.openskilldialog;
              return;
            }
            await game.delayx();
          }
        };
      },
      prompt(links, player) {
        return (player.countCards ? "展示所有手牌" : "") + (player.countCards("h", { name: ["sha", "shan"] }) <= 1 ? "，然后视为使用【" + get.translation(links[0][2]) + "】" : "");
      }
    },
    subSkill: { blocker: { charlotte: true } },
    ai: {
      order: 1,
      respondSha: true,
      respondShan: true,
      skillTagFilter(player) {
        if (player.hasSkill("dcgue_blocker", null, null, false)) {
          return false;
        }
      },
      result: {
        player(player) {
          if (player.countCards("h", { name: ["sha", "shan"] }) > 1) {
            return 0;
          }
          return 1;
        }
      }
    }
  },
  dcsigong: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      if (event.player === player || !event.player.isIn()) {
        return false;
      }
      if (!player.canUse("sha", event.player, false)) {
        return false;
      }
      let respondEvts = [];
      for (const current of game.filterPlayer2()) {
        respondEvts.addArray(current.getHistory("useCard"));
        respondEvts.addArray(current.getHistory("respond"));
      }
      respondEvts = respondEvts.filter((i) => i.respondTo).map((evt) => evt.respondTo);
      return event.player.hasHistory("useCard", (evt) => {
        return respondEvts.some((list) => list[1] == evt.card);
      });
    },
    direct: true,
    async content(event, trigger, player) {
      const num = 1 - player.countCards("h");
      event.num = num;
      let prompt2 = "";
      let next;
      if (num >= 0) {
        next = player.chooseBool().set("ai", () => _status.event.goon);
        prompt2 += (num > 0 ? "摸一张牌，" : "") + "视为对" + get.translation(trigger.player) + "使用一张【杀】（伤害基数+1）";
      } else {
        next = player.chooseToDiscard(-num, "allowChooseAll").set("ai", (card) => {
          if (_status.event.goon) {
            return 5.2 - get.value(card);
          }
          return 0;
        }).set("logSkill", ["dcsigong", trigger.player]);
        prompt2 += "将手牌数弃置至1，视为对" + get.translation(trigger.player) + "使用一张【杀】（伤害基数+1）";
      }
      next.set("prompt", get.prompt("dcsigong", trigger.player));
      next.set("prompt2", prompt2);
      next.set("goon", get.effect(trigger.player, { name: "sha" }, player, player) > 0);
      const result = await next.forResult();
      if (!result.bool) {
        return;
      }
      if (num >= 0) {
        player.logSkill("dcsigong", trigger.player);
      }
      if (num > 0) {
        await player.draw(num, "nodelay");
      }
      event.num = Math.max(1, Math.abs(num));
      if (player.canUse("sha", trigger.player, false)) {
        player.addTempSkill("dcsigong_check");
        await player.useCard({ name: "sha", isCard: true }, trigger.player, false).set("shanReq", event.num).set("oncard", (card) => {
          const evt = _status.event;
          evt.baseDamage++;
          for (const target of game.filterPlayer(null, null, true)) {
            const id = target.playerid;
            const map = evt.customArgs;
            if (!map[id]) {
              map[id] = {};
            }
            map[id].shanRequired = evt.shanReq;
          }
        });
      }
    },
    subSkill: {
      check: {
        charlotte: true,
        forced: true,
        popup: false,
        trigger: { source: "damageSource" },
        filter(event, player) {
          return event.card && event.card.name == "sha" && event.getParent(3).name == "dcsigong";
        },
        async content(event, trigger, player) {
          player.tempBanSkill("dcsigong", "roundStart");
        }
      }
    }
  },
  //孙寒华
  dchuiling: {
    audio: 2,
    trigger: { player: "useCard" },
    forced: true,
    direct: true,
    filter() {
      return ui.discardPile.childNodes.length > 0;
    },
    onremove: true,
    mark: true,
    marktext: "灵",
    intro: {
      name2: "灵",
      mark(dialog, storage, player) {
        dialog.addText("共有" + (storage || 0) + "个标记");
        dialog.addText("注：图标的颜色代表弃牌堆中较多的颜色");
      }
    },
    global: "dchuiling_hint",
    async content(event, trigger, player) {
      let mark = false;
      let red = 0, black = 0;
      for (let i = 0; i < ui.discardPile.childNodes.length; i++) {
        const color = get.color(ui.discardPile.childNodes[i]);
        if (color == "red") {
          red++;
        }
        if (color == "black") {
          black++;
        }
      }
      if (red == black) {
        return;
      } else if (red > black) {
        player.logSkill("dchuiling");
        await player.recover();
        if (get.color(trigger.card) == "black") {
          mark = true;
        }
        event.logged = true;
      } else {
        if (!event.isMine() && !event.isOnline()) {
          game.delayx();
        }
        if (get.color(trigger.card) == "red") {
          mark = true;
        }
        if (game.hasPlayer((current) => current != player && current.hasDiscardableCards(player, "he"))) {
          const result = await player.chooseTarget(get.prompt("dchuiling"), "你可以弃置一名其他角色的一张牌", (card, player2, target) => {
            return target != player2 && target.hasDiscardableCards(player2, "he");
          }).set("ai", (target) => {
            return get.effect(target, { name: "guohe_copy2" }, _status.event.player);
          }).forResult();
          if (result?.bool) {
            const target = result.targets[0];
            if (!event.logged) {
              player.logSkill("dchuiling", target);
            } else {
              player.line(target);
            }
            await player.discardPlayerCard(target, "he", true);
          }
        }
      }
      if (mark) {
        if (!event.logged) {
          player.logSkill("dchuiling");
        }
        player.addMark("dchuiling", 1);
        event.logged = true;
      }
    },
    subSkill: {
      hint: {
        trigger: {
          global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"]
        },
        forced: true,
        popup: false,
        lastDo: true,
        forceDie: true,
        forceOut: true,
        filter(event, player) {
          if (event._dchuiling_checked) {
            return false;
          }
          event._dchuiling_checked = true;
          var cards2 = event.getd();
          if (!cards2.filterInD("d").length) {
            return false;
          }
          return true;
        },
        markColor: [
          ["rgba(241, 42, 42, 0.75)", "black"],
          ["", ""],
          ["rgba(18, 4, 4, 0.75)", "rgb(200, 200, 200)"]
        ],
        async content(event, trigger, player) {
          let red = 0, black = 0;
          for (let i = 0; i < ui.discardPile.childNodes.length; i++) {
            const color = get.color(ui.discardPile.childNodes[i]);
            if (color == "red") {
              red++;
            }
            if (color == "black") {
              black++;
            }
          }
          if (trigger.name.indexOf("lose") == 0) {
            const cards2 = trigger.getd().filterInD("d");
            for (let i = 0; i < cards2.length; i++) {
              const color = get.color(cards2[i]);
              if (color == "red") {
                red++;
              }
              if (color == "black") {
                black++;
              }
            }
          }
          game.broadcastAll(
            function(ind) {
              var bgColor = lib.skill.dchuiling_hint.markColor[ind][0], text = '<span style="color: ' + lib.skill.dchuiling_hint.markColor[ind][1] + '">灵</span>';
              for (var player2 of game.players) {
                if (player2.marks.dchuiling) {
                  player2.marks.dchuiling.firstChild.style.backgroundColor = bgColor;
                  player2.marks.dchuiling.firstChild.innerHTML = text;
                }
              }
            },
            Math.sign(black - red) + 1
          );
        }
      }
    },
    mod: {
      aiOrder(player, card, num) {
        if (get.itemtype(card) != "card") {
          return;
        }
        var len = ui.discardPile.childNodes.length;
        if (!len) {
          var type = get.type(card);
          if (type == "basic" || type == "trick") {
            if (player.getDamagedHp() > 0) {
              return num + (get.color(card) == "red" ? 15 : 10);
            }
            return num + 10;
          }
          return;
        }
        if (len > 40) {
          return;
        }
        var red = 0, black = 0;
        for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
          var color = get.color(ui.discardPile.childNodes[i]);
          if (color == "red") {
            red++;
          }
          if (color == "black") {
            black++;
          }
        }
        if (red == black) {
          var type = get.type(card);
          if (type == "basic" || type == "trick") {
            if (player.getDamagedHp() > 0) {
              return num + (get.color(card) == "red" ? 15 : 10);
            }
            return num + 10;
          }
          return;
        } else {
          var color = get.color(card);
          if (color == "red" && red < black || color == "black" && red > black) {
            return num + 10;
          }
        }
      }
    }
  },
  dcchongxu: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "wood",
    derivation: ["dctaji", "dcqinghuang"],
    manualConfirm: true,
    prompt() {
      return "限定技。你可以失去〖汇灵〗，增加" + Math.min(game.players.length, _status.event.player.countMark("dchuiling")) + "点体力上限，然后获得〖踏寂〗和〖青荒〗。";
    },
    filter(event, player) {
      return player.countMark("dchuiling") >= 4;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const num = Math.min(game.players.length, player.countMark("dchuiling"));
      await player.removeSkills("dchuiling");
      await player.gainMaxHp(num);
      await player.addSkills(["dctaji", "dcqinghuang"]);
    },
    ai: {
      combo: "dchuiling",
      order(itemp, player) {
        if (player.hasCard((card) => {
          return get.type(card) != "equip" && player.getUseValue(card) > 1;
        }, "h")) {
          return 12;
        }
        return 0.1;
      },
      result: {
        player(player) {
          var count = player.countMark("dchuiling");
          if (count >= game.countPlayer() - 1) {
            return 1;
          }
          return count >= 6 || player.hp <= 2 ? 1 : 0;
        }
      }
    }
  },
  dctaji: {
    audio: 2,
    trigger: {
      player: "loseEnd",
      global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"]
    },
    forced: true,
    locked: false,
    filter(event, player) {
      var evt = event.getl(player);
      return evt && evt.hs && evt.hs.length;
    },
    async content(event, trigger, player) {
      const evt = trigger.getParent();
      const effects = [
        [
          "useCard",
          async (event2, trigger2, player2) => {
            const targets = game.filterPlayer((current) => {
              return current.countDiscardableCards(player2, "he") && current != player2;
            });
            if (!targets.length) {
              return;
            }
            const result = await player2.chooseTarget("踏寂：弃置其他角色一张牌", true, (card, player3, target) => {
              return _status.event.targets.includes(target);
            }).set("targets", targets).set("ai", (target) => {
              return get.effect(target, { name: "guohe_copy2" }, _status.event.player);
            }).forResult();
            if (result?.bool) {
              const target = result.targets[0];
              player2.line(target);
              await player2.discardPlayerCard(target, "he", true);
            }
          }
        ],
        [
          "respond",
          async (event2, trigger2, player2) => {
            await player2.draw();
          }
        ],
        [
          "discard",
          async (event2, trigger2, player2) => {
            await player2.recover();
          }
        ],
        [
          "other",
          async (event2, trigger2, player2) => {
            player2.addSkill("dctaji_damage");
            player2.addMark("dctaji_damage", 1, false);
            game.log(player2, "下一次对其他角色造成的伤害", "#g+1");
          }
        ]
      ];
      let name = evt.name;
      if (trigger.name == "loseAsync") {
        name = evt.type;
      }
      const list = ["useCard", "respond", "discard", "other"];
      if (!list.includes(name)) {
        name = "other";
      }
      for (let i = 0; i < 1 + player.countMark("dcqinghuang_add"); i++) {
        if (!list.length) {
          break;
        }
        if (!list.includes(name)) {
          name = list.randomRemove(1)[0];
        }
        if (name == "useCard") {
          list.remove("useCard");
        }
        for (const effect of effects) {
          if (effect[0] == name) {
            list.remove(name);
            const next = game.createEvent("dctaji_" + name);
            next.player = player;
            next.setContent(effect[1]);
            await next;
            break;
          }
        }
      }
    },
    subSkill: {
      damage: {
        audio: "dctaji",
        trigger: { source: "damageBegin1" },
        forced: true,
        charlotte: true,
        onremove: true,
        filter(event, player) {
          return event.player != player;
        },
        async content(event, trigger, player) {
          trigger.num += player.countMark(event.name);
          player.removeSkill(event.name);
        },
        intro: {
          content: "下次对其他角色造成伤害时，此伤害+#"
        }
      }
    }
  },
  dcqinghuang: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return player.maxHp > 1;
    },
    check(event, player) {
      var num1 = player.countCards("h");
      var num2 = player.countCards("h", (card) => player.hasValueTarget(card));
      var num3 = player.getHandcardLimit();
      if (player.isDamaged()) {
        return num2 > 1 || num1 - num2 - num3 > 0;
      } else {
        return num2 > 2 + Math.max(0, 3 - player.hp) || player.hp > 2 && num1 - num2 - num3 > 2;
      }
    },
    async content(event, trigger, player) {
      player.loseMaxHp();
      player.addTempSkill("dcqinghuang_add");
      player.addMark("dcqinghuang_add", 1, false);
    },
    ai: {
      combo: "dctaji"
    },
    subSkill: {
      add: {
        charlotte: true,
        onremove: true
      }
    }
  },
  //孟节
  dcyinlu: {
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    locked: false,
    derivation: ["dcyinlu_lequan", "dcyinlu_huoxi", "dcyinlu_zhangqi", "dcyinlu_yunxiang"],
    global: ["dcyinlu_lequan", "dcyinlu_huoxi", "dcyinlu_zhangqi", "dcyinlu_yunxiang"],
    group: "dcyinlu_move",
    filter(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    hasMark(target) {
      return lib.skill.dcyinlu.derivation.some((i) => target.hasMark(i));
    },
    async content(event, trigger, player) {
      const marks = lib.skill.dcyinlu.derivation.slice(0, 3);
      const num = Math.min(3, game.countPlayer());
      const result = await player.chooseTarget({
        prompt: `引路：令${get.cnNumber(num)}名角色分别获得〖引路〗标记`,
        forced: true,
        selectTarget: num,
        complexTarget: true,
        targetprompt: () => {
          return get.translation(lib.skill.dcyinlu.derivation[ui.selected.targets.length - 1]);
        },
        ai(target) {
          const player2 = get.player();
          if (ui.selected.targets?.length == 2) {
            return get.effect(target, { name: "losehp" }, player2, player2);
          }
          return get.attitude(player2, target);
        }
      }).forResult();
      if (result?.bool && result.targets?.length) {
        const targets = result.targets;
        player.line(targets);
        for (let i = 0; i < targets.length; i++) {
          targets[i].addMark(marks[i]);
          if (player != targets[i] && targets[i].identityShown) {
            if (get.mode() != "identity" || player.identity != "nei") {
              player.addExpose(0.3);
            }
          }
        }
        const target = targets.randomGet();
        if (num < 3) {
          target.addMark(marks[2]);
        }
        if (num < 2) {
          target.addMark(marks[1]);
        }
      }
      player.addMark("dcyinlu_yunxiang", 1);
      player.addMark("dcyinlu_xiang", 1);
      game.log(player, "获得了1点芸香值");
    },
    subSkill: {
      move: {
        audio: "dcyinlu",
        trigger: {
          player: "phaseZhunbeiBegin",
          global: "die"
        },
        direct: true,
        filter(event, player) {
          if (event.name == "die") {
            return lib.skill.dcyinlu.hasMark(event.player);
          }
          return game.hasPlayer((current) => {
            return lib.skill.dcyinlu.hasMark(current);
          });
        },
        async content(event, trigger, player) {
          if (trigger.name != "die") {
            if (_status.connectMode) {
              game.broadcastAll(function() {
                _status.noclearcountdown = true;
              });
            }
            try {
              const targetResult = await player.chooseTarget(get.prompt("dcyinlu_move"), "移动一名角色的〖引路〗标记", 2, (card, player2, target) => {
                if (ui.selected.targets.length == 0) {
                  return lib.skill.dcyinlu.hasMark(target);
                }
                return true;
              }).set("ai", (target) => {
                const player2 = _status.event.player;
                if (ui.selected.targets.length == 0) {
                  const owned2 = lib.skill.dcyinlu.derivation.filter((i) => target.hasMark(i));
                  const att = get.attitude(player2, target);
                  if (att > 0) {
                    if (owned2.includes("dcyinlu_zhangqi")) {
                      return target.hasCard({ suit: "spade" }, "he") ? 5 : 10;
                    }
                    if (owned2.includes("dcyinlu_lequan") && target.isHealthy() && game.hasPlayer((current) => {
                      return current != target && get.recoverEffect(current, player2, player2) > 0;
                    })) {
                      return 2;
                    }
                    return 0;
                  }
                  if (att < 0) {
                    if (owned2.some((i) => i != "dcyinlu_zhangqi")) {
                      return 8;
                    }
                    return 0;
                  }
                  if (owned2.includes("dcyinlu_zhangqi") && game.hasPlayer((current) => {
                    return current != target && get.effect(current, { name: "losehp" }, player2, player2) > 0;
                  })) {
                    return 3;
                  }
                  return 1;
                } else {
                  const targetx = ui.selected.targets[0];
                  const att = get.attitude(player2, targetx), att2 = get.attitude(player2, target);
                  const owned2 = lib.skill.dcyinlu.derivation.filter((i) => targetx.hasMark(i));
                  if (att > 0) {
                    if (owned2.includes("dcyinlu_zhangqi")) {
                      return -att2;
                    }
                    if (owned2.includes("dcyinlu_lequan")) {
                      return get.recoverEffect(target, player2, player2);
                    }
                  } else if (att < 0) {
                    if (owned2.some((i) => i != "dcyinlu_zhangqi")) {
                      return att2;
                    }
                  } else {
                    if (owned2.includes("dcyinlu_zhangqi")) {
                      return get.effect(target, { name: "losehp" }, player2, player2);
                    }
                    return att2;
                  }
                }
                return Math.random();
              }).set("complexTarget", true).forResult();
              if (!targetResult?.bool || !targetResult.targets?.length) {
                return;
              }
              const marks = lib.skill.dcyinlu.derivation;
              const targets = targetResult.targets;
              const owned = marks.filter((mark2) => targets[0].hasMark(mark2));
              let mark;
              if (owned.length == 1) {
                mark = owned[0];
              } else {
                const controlResult = await player.chooseControl(owned).set("prompt", "引路：选择要移动" + get.translation(targets[0]) + "的标记").set(
                  "choiceList",
                  owned.map((mark2) => {
                    return '<div class="skill">【' + get.translation(mark2) + "】</div><div>" + lib.translate[mark2 + "_info"] + "</div>";
                  })
                ).set("displayIndex", false).set("ai", () => {
                  return _status.event.choice;
                }).set(
                  "choice",
                  (function() {
                    const att = get.attitude(player, targets[0]), att2 = get.attitude(player, targets[1]);
                    if (att > 0) {
                      if (owned.includes("dcyinlu_zhangqi") && att2 < 0) {
                        return "dcyinlu_zhangqi";
                      }
                      if (owned.includes("dcyinlu_lequan") && att2 > 0) {
                        return "dcyinlu_lequan";
                      }
                    } else if (att < 0) {
                      const marksx = owned.filter((i) => i != "dcyinlu_zhangqi");
                      if (marksx.length && att2 > 0) {
                        return marksx[0];
                      }
                      return owned[0];
                    } else {
                      if (owned.includes("dcyinlu_zhangqi")) {
                        return "dcyinlu_zhangqi";
                      }
                    }
                    if (owned.length > 1) {
                      owned.remove("dcyinlu_zhangqi");
                    }
                    return owned[0];
                  })()
                ).forResult();
                mark = controlResult.control;
              }
              const count = targets[0].countMark(mark);
              player.logSkill("dcyinlu_move", targets, false);
              player.line2(targets, mark == "dcyinlu_zhangqi" ? "fire" : "green");
              targets[1].addMark(mark, count);
              if (mark == "dcyinlu_yunxiang") {
                targets[1].addMark("dcyinlu_xiang", targets[0].countMark("dcyinlu_xiang"));
              }
              targets[0].removeMark(mark, count);
              if (player != targets[1] && targets[1].identityShown) {
                if (get.mode() != "identity" || player.identity != "nei") {
                  player.addExpose(0.3);
                }
              }
              return;
            } finally {
              if (_status.connectMode) {
                game.broadcastAll(function() {
                  delete _status.noclearcountdown;
                  game.stopCountChoose();
                });
              }
            }
          }
          event.marks = lib.skill.dcyinlu.derivation.filter((mark) => trigger.player.hasMark(mark));
          while (event.marks.length) {
            const mark = event.marks[0];
            const result = await player.chooseTarget("引路：是否转移“" + get.translation(mark) + "”标记？").set("ai", (target) => {
              const player2 = _status.event.player, mark2 = _status.event.mark;
              if (mark2 == "dcyinlu_zhangqi") {
                return get.effect(target, { name: "losehp" }, player2, player2) + 0.1;
              }
              if (mark2 == "dcyinlu_lequan") {
                return get.recoverEffect(target, player2, player2) + get.attitude(player2, target) / 5;
              }
              return get.attitude(player2, target);
            }).set("mark", mark).forResult();
            if (result.bool) {
              const target = result.targets[0];
              player.logSkill("dcyinlu_move", target);
              const count = trigger.player.countMark(mark);
              target.addMark(mark, count);
              if (mark == "dcyinlu_yunxiang") {
                target.addMark("dcyinlu_xiang", trigger.player.countMark("dcyinlu_xiang"));
              }
              trigger.player.removeMark(mark, count, false);
              if (player != target && target.identityShown) {
                if (get.mode() != "identity" || player.identity != "nei") {
                  player.addExpose(0.3);
                }
              }
            }
            event.marks.shift();
          }
        }
      },
      lequan: {
        trigger: { player: "phaseJieshuBegin" },
        direct: true,
        charlotte: true,
        filter(event, player) {
          return player.hasMark("dcyinlu_lequan") && game.hasPlayer((current) => current.hasSkill("dcyinlu"));
        },
        marktext: "乐",
        intro: {
          name: "乐泉",
          name2: "乐泉",
          markcount: () => 0,
          content: "结束阶段，你可以弃置一张♦牌，然后回复1点体力。"
        },
        async content(event, trigger, player) {
          const result = await player.chooseToDiscard("乐泉：是否弃置一张♦牌，然后回复1点体力？", { suit: "diamond" }, "he").set("ai", (card) => {
            if (_status.event.goon) {
              return 7 - get.value(card);
            }
            return 0;
          }).set("logSkill", "dcyinlu_lequan").set("goon", get.recoverEffect(player, player)).forResult();
          if (result.bool) {
            await player.recover();
          }
        }
      },
      huoxi: {
        trigger: { player: "phaseJieshuBegin" },
        direct: true,
        charlotte: true,
        filter(event, player) {
          return player.hasMark("dcyinlu_huoxi") && game.hasPlayer((current) => current.hasSkill("dcyinlu"));
        },
        marktext: "藿",
        intro: {
          name: "藿溪",
          name2: "藿溪",
          markcount: () => 0,
          content: "结束阶段，你可以弃置一张♥牌，然后摸两张牌。"
        },
        async content(event, trigger, player) {
          const result = await player.chooseToDiscard("藿溪：是否弃置一张♥牌，然后摸两张牌？", { suit: "heart" }, "he").set("ai", (card) => {
            return 6 - get.value(card);
          }).set("logSkill", "dcyinlu_huoxi").forResult();
          if (result.bool) {
            await player.draw(2);
          }
        }
      },
      zhangqi: {
        trigger: { player: "phaseJieshuBegin" },
        forced: true,
        direct: true,
        charlotte: true,
        filter(event, player) {
          return player.hasMark("dcyinlu_zhangqi") && game.hasPlayer((current) => current.hasSkill("dcyinlu"));
        },
        marktext: "瘴",
        intro: {
          name: "瘴气",
          name2: "瘴气",
          markcount: () => 0,
          content: "锁定技。结束阶段，你须弃置一张♠牌，否则失去1点体力。"
        },
        async content(event, trigger, player) {
          const result = await player.chooseToDiscard("瘴气：弃置一张♠牌，或失去1点体力", { suit: "spade" }, "he").set("ai", (card) => {
            if (_status.event.goon) {
              return 7 - get.value(card);
            }
            return 0;
          }).set("logSkill", "dcyinlu_zhangqi").set("goon", get.effect(player, { name: "losehp" }, player) < 0).forResult();
          if (!result.bool) {
            player.logSkill("dcyinlu_zhangqi");
            await player.loseHp();
          }
        }
      },
      yunxiang: {
        trigger: { player: ["phaseJieshuBegin", "damageBegin4"] },
        direct: true,
        charlotte: true,
        filter(event, player) {
          if (!game.hasPlayer((current) => current.hasSkill("dcyinlu"))) {
            return false;
          }
          if (event.name == "phaseJieshu") {
            return player.hasMark("dcyinlu_yunxiang");
          }
          return player.hasMark("dcyinlu_yunxiang") && player.hasMark("dcyinlu_xiang");
        },
        onremove(player) {
          delete player.storage.dcyinlu_xiang;
        },
        marktext: "芸",
        intro: {
          name: "芸香",
          name2: "芸香",
          markcount(storage, player) {
            return player.countMark("dcyinlu_xiang");
          },
          content(storage, player) {
            return "①结束阶段，你可以弃置一张♣牌，获得1点“芸香”值。②当你受到伤害时，你可以扣减所有“芸香”值，减少等量的伤害。<li>当前芸香值：" + player.countMark("dcyinlu_xiang");
          }
        },
        async content(event, trigger, player) {
          let result;
          if (trigger.name == "phaseJieshu") {
            result = await player.chooseToDiscard("芸香：是否弃置一张♣牌，获得1枚“香”？", { suit: "club" }, "he").set("ai", (card) => {
              return 6 - get.value(card) + 2.5 * _status.event.player.countMark("dcyinlu_xiang");
            }).set("logSkill", "dcyinlu_yunxiang").forResult();
          } else {
            result = await player.chooseBool("芸香：是否移去所有“香”，令此伤害-" + player.countMark("dcyinlu_xiang") + "？").set("ai", () => {
              return _status.event.bool;
            }).set("bool", get.damageEffect(player, trigger.source, player) < 0).forResult();
          }
          if (result.bool) {
            if (trigger.name == "phaseJieshu") {
              player.addMark("dcyinlu_xiang", 1, false);
              game.log(player, "获得了1点芸香值");
            } else {
              player.logSkill("dcyinlu_yunxiang");
              var num = player.countMark("dcyinlu_xiang");
              player.removeMark("dcyinlu_xiang", num, false);
              game.log(player, "扣减了", num, "点芸香值");
              trigger.num = Math.max(0, trigger.num - num);
            }
          }
        }
      }
    }
  },
  dcyouqi: {
    audio: 2,
    trigger: { global: "loseAfter" },
    filter(event, player) {
      if (event.getParent(3).name.indexOf("dcyinlu_") != 0 || player == event.player) {
        return false;
      }
      return true;
    },
    derivation: "dcyouqi_faq",
    direct: true,
    forced: true,
    async content(event, trigger, player) {
      if (Math.random() < 1.25 - 0.25 * get.distance(player, trigger.player) || get.isLuckyStar(player)) {
        player.logSkill("dcyouqi");
        player.gain(trigger.cards.filterInD("d"), "gain2");
      }
    },
    ai: {
      combo: "dcyinlu"
    }
  },
  //孙资刘放
  dcqinshen: {
    audio: 2,
    trigger: { player: "phaseDiscardEnd" },
    frequent: true,
    prompt2() {
      return "摸" + get.cnNumber(lib.skill.dcqinshen.getNum()) + "张牌";
    },
    getNum() {
      const list = lib.suit.slice();
      const suit = get.discarded().map((c) => get.suit(c, false));
      list.removeArray(suit);
      return list.length;
    },
    filter(event, player) {
      return lib.skill.dcqinshen.getNum() > 0;
    },
    async content(event, trigger, player) {
      await player.draw(lib.skill.dcqinshen.getNum());
    }
  },
  dcweidang: {
    audio: 2,
    trigger: { global: "phaseJieshuBegin" },
    /**
     * @deprecated
     */
    getLength: (card) => get.cardNameLength(card),
    filter(event, player) {
      const num = lib.skill.dcqinshen.getNum();
      return event.player != player && (_status.connectMode ? player.countCards("he") : player.hasCard((card) => get.cardNameLength(card) == num, "he"));
    },
    async cost(event, trigger, player) {
      const num = lib.skill.dcqinshen.getNum();
      event.result = await player.chooseCard(get.prompt(event.skill), "将一张字数为" + num + "的牌置于牌堆底，然后获得一张字数为" + num + "的牌。若你能使用此牌，你使用之。", "he", (card, player2, target) => {
        return get.cardNameLength(card) == _status.event.num;
      }).set("num", num).set("ai", (card) => {
        return 5 - get.value(card);
      }).forResult();
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      const num = lib.skill.dcqinshen.getNum();
      game.broadcastAll(function(player2) {
        const cardx = ui.create.card();
        cardx.classList.add("infohidden");
        cardx.classList.add("infoflip");
        player2.$throw(cardx, 1e3, "nobroadcast");
      }, player);
      await player.lose(cards2, ui.cardPile);
      await game.delayx();
      const card = get.cardPile((cardx) => get.cardNameLength(cardx) == num);
      if (card) {
        await player.gain(card, "gain2");
        if (player.hasUseTarget(card)) {
          await player.chooseUseTarget(card, true);
        }
      }
    }
  },
  //三袁
  dcneifa: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    async content(event, trigger, player) {
      await player.draw(3);
      const result = await player.chooseToDiscard(true, "he").set("ai", function(cardx) {
        const player2 = _status.event.player;
        let num = 0;
        let hs = player2.getCards("h");
        const muniu = player2.getEquip("muniu");
        if (muniu && muniu.cards) {
          hs = hs.concat(muniu.cards);
        }
        if (get.type(cardx) == "basic") {
          const shas = hs.filter(function(card) {
            return card != cardx && get.name(card, player2) == "sha" && player2.hasValueTarget(card, false);
          });
          const numx = player2.countCards("h", function(card) {
            return get.type2(card, player2) == "trick";
          });
          num += Math.min(numx, Math.max(0, shas.length - player2.getCardUsable("sha"))) * 0.65;
          num += Math.min(
            player2.getCardUsable("sha") + numx,
            shas.filter(function(card) {
              return game.countPlayer(function(current) {
                return player2.canUse(card, current) && get.effect(current, card, player2, player2) > 0;
              }) > 1;
            }).length
          ) * 1.1;
          const taos = Math.min(
            player2.maxHp - player2.hp,
            hs.filter(function(card) {
              return cardx != card && get.name(card, player2) == "tao";
            }).length
          );
          num += taos * player2.getDamagedHp() * 1.2;
        } else if (get.type2(cardx) == "trick") {
          Math.sqrt(
            Math.min(
              5,
              player2.countCards("h", function(card) {
                return get.type(card, null, player2) == "basic";
              })
            )
          );
          num += hs.filter(function(card) {
            return card != cardx && get.type2(card) == "trick" && player2.hasValueTarget(card);
          }).length * 0.65;
        } else {
          num = 4;
        }
        return num * 1.5 - get.value(cardx);
      }).forResult();
      if (result.bool && result.cards && result.cards.length && get.type(result.cards[0]) != "equip") {
        const name = get.type(result.cards[0]) == "basic" ? "dcneifa_basic" : "dcneifa_trick";
        player.addTempSkill(name, "phaseUseAfter");
        const num = Math.min(
          5,
          player.countCards("h", function(cardx) {
            const type = get.type(cardx, null, player);
            return name == "dcneifa_basic" != (type == "basic") && type != "equip";
          })
        );
        if (num > 0) {
          player.addMark(name, num, false);
        } else {
          player.storage[name] = 0;
        }
      }
    },
    ai: {
      threaten: 2.33
    }
  },
  dcneifa_basic: {
    mark: true,
    marktext: "伐",
    onremove: true,
    intro: {
      name: "内伐 - 基本牌",
      content: "本回合内不能使用锦囊牌，使用【杀】选择目标时可以额外指定一个目标且使用【杀】的目标次数上限+#。"
    },
    mod: {
      cardEnabled(card, player) {
        if (get.type(card, "trick") == "trick") {
          return false;
        }
      },
      cardSavable(card, player) {
        if (get.type(card, "trick") == "trick") {
          return false;
        }
      },
      cardUsable(card, player, num) {
        if (card.name == "sha") {
          return num + player.countMark("dcneifa_basic");
        }
      }
    },
    trigger: { player: "useCard2" },
    sourceSkill: "dcneifa",
    filter(event, player) {
      if (event.card.name != "sha") {
        return false;
      }
      return game.hasPlayer(function(current) {
        return !event.targets.includes(current) && player.canUse(event.card, current, false);
      });
    },
    direct: true,
    async content(event, trigger, player) {
      let result;
      result = await player.chooseTarget(get.prompt("dcneifa"), "为" + get.translation(trigger.card) + "额外指定一个目标", (card, currentPlayer, target) => {
        return !get.event().targets.includes(target) && currentPlayer.canUse(get.event().card, target, false);
      }).set("targets", trigger.targets).set("ai", (target) => get.effect(target, get.event().card, get.player(), get.player())).set("card", trigger.card).forResult();
      if (!result.bool) {
        return;
      }
      if (!event.isMine() && !event.isOnline()) {
        await game.delayx();
      }
      event.targets = result.targets;
      player.logSkill("dcneifa", event.targets);
      trigger.targets.addArray(event.targets);
    }
  },
  dcneifa_trick: {
    trigger: { player: "useCard2" },
    direct: true,
    mark: true,
    marktext: "伐",
    onremove: true,
    mod: {
      cardEnabled(card, player) {
        if (get.type(card) == "basic") {
          return false;
        }
      },
      cardSavable(card, player) {
        if (get.type(card) == "basic") {
          return false;
        }
      }
    },
    intro: {
      name: "内伐 - 锦囊牌",
      content: "本回合内不能使用基本牌，且使用普通锦囊牌选择目标时可以增加或减少一个目标。"
    },
    sourceSkill: "dcneifa",
    filter(event, player) {
      if (get.type(event.card) != "trick") {
        return false;
      }
      if (event.targets && event.targets.length > 0) {
        return true;
      }
      var info = get.info(event.card);
      if (info.allowMultiple == false) {
        return false;
      }
      if (event.targets && !info.multitarget) {
        if (game.hasPlayer(function(current) {
          return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current);
        })) {
          return true;
        }
      }
      return false;
    },
    async content(event, trigger, player) {
      const prompt2 = "为" + get.translation(trigger.card) + "增加或减少一个目标";
      const result = await player.chooseTarget(get.prompt("dcneifa"), function(card, player2, target) {
        player2 = _status.event.player;
        if (_status.event.targets.includes(target)) {
          return true;
        }
        return lib.filter.targetEnabled2(_status.event.card, player2, target);
      }).set("prompt2", prompt2).set("ai", function(target) {
        const trigger2 = _status.event.getTrigger();
        const player2 = _status.event.player;
        return get.effect(target, trigger2.card, player2, player2) * (_status.event.targets.includes(target) ? -1 : 1);
      }).set("targets", trigger.targets).set("card", trigger.card).forResult();
      if (!result.bool) {
        return;
      }
      if (!event.isMine() && !event.isOnline()) {
        await game.delayx();
      }
      const targets = result.targets;
      player.logSkill("dcneifa", targets);
      if (trigger.targets.includes(targets[0])) {
        trigger.targets.removeArray(targets);
      } else {
        trigger.targets.addArray(targets);
      }
    }
  },
  //桥蕤
  dcaishou: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return player.hasCard((card) => card.hasGaintag("dcaishou_tag"), "h");
    },
    forced: true,
    locked: false,
    group: ["dcaishou_draw", "dcaishou_lose"],
    subfrequent: ["draw"],
    async content(event, trigger, player) {
      await player.discard(player.getCards("h", (card) => card.hasGaintag("dcaishou_tag")));
      let len = 0;
      for (const evt of player.getHistory("lose", (evt2) => evt2.getParent(2) === event)) {
        len += evt.cards.length;
      }
      if (len > Math.max(0, player.hp) && player.maxHp < 9) {
        await player.gainMaxHp();
      }
    },
    subSkill: {
      draw: {
        audio: "dcaishou",
        trigger: { player: "phaseJieshuBegin" },
        frequent(event, player) {
          return player.maxHp > 1;
        },
        prompt2(event, player) {
          return "摸" + get.cnNumber(player.maxHp) + "张牌，称为“隘”";
        },
        check(event, player) {
          return player.maxHp > 1;
        },
        async content(event, trigger, player) {
          const next = player.draw(player.maxHp);
          next.gaintag.add("dcaishou_tag");
          await next;
        }
      },
      lose: {
        audio: "dcaishou",
        trigger: {
          player: "loseAfter",
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        forced: true,
        locked: false,
        filter(event, player) {
          if (player == _status.currentPhase) {
            return false;
          }
          var evt = event.getl(player);
          if (!evt || !evt.hs || !evt.hs.length || player.hasCard((card) => card.hasGaintag("dcaishou_tag"), "h")) {
            return false;
          }
          if (event.name == "lose") {
            for (var i in event.gaintag_map) {
              if (event.gaintag_map[i].includes("dcaishou_tag")) {
                return true;
              }
            }
            return false;
          }
          return player.hasHistory("lose", function(evt2) {
            if (event != evt2.getParent()) {
              return false;
            }
            for (var i2 in evt2.gaintag_map) {
              if (evt2.gaintag_map[i2].includes("dcaishou_tag")) {
                return true;
              }
            }
            return false;
          });
        },
        async content(event, trigger, player) {
          player.loseMaxHp();
        }
      }
    }
  },
  dcsaowei: {
    audio: 2,
    trigger: { global: "useCardAfter" },
    filter(event, player) {
      return event.player != player && event.card.name == "sha" && event.targets.length && !event.targets.includes(player) && event.targets.every((current) => player.inRange(current) && current.isIn()) && player.hasCard((card) => card.hasGaintag("dcaishou_tag"), "h");
    },
    direct: true,
    clearTime: true,
    async content(event, trigger, player) {
      player.addTempSkill("dcsaowei_gain");
      const next = player.chooseToUse();
      next.set("openskilldialog", "扫围：是否将一张“隘”当做【杀】对" + get.translation(trigger.targets) + "使用？");
      next.set("norestore", true);
      next.set("_backupevent", `${event.name}_backup`);
      next.set("custom", {
        add: {},
        replace: { window() {
        } }
      });
      next.backup(`${event.name}_backup`);
      next.set("targetRequired", true);
      next.set("complexTarget", true);
      next.set("complexSelect", true);
      next.set("filterTarget", function(card, player2, target) {
        if (!_status.event.targets.includes(target)) {
          return false;
        }
        return lib.filter.filterTarget.apply(this, arguments);
      });
      next.set("selectTarget", -1);
      next.set("targets", trigger.targets);
      next.set("addCount", false);
      next.set("logSkill", event.name);
      await next;
    },
    ai: { combo: "dcaishou" },
    subSkill: {
      backup: {
        viewAs: { name: "sha" },
        filterCard(card, player) {
          return get.itemtype(card) == "card" && card.hasGaintag("dcaishou_tag");
        },
        position: "h",
        selectCard: 1,
        ai1(card) {
          const player = get.player();
          if (player.isHealthy() && player.hasSkill("dcaishou") && player.countCards("h", (card2) => card2.hasGaintag("dcaishou_tag")) == 1) {
            return 0;
          }
          let eff = 0;
          for (const target of get.event().targets || []) {
            eff += get.effect(target, get.autoViewAs({ name: "sha" }, [card]), player, player);
          }
          if (eff > 0) {
            return 6.5 + eff / 10 - get.value(card);
          }
          return 0;
        },
        log: false,
        manualConfirm: true
      },
      gain: {
        audio: "dcsaowei",
        charlotte: true,
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          return event.skill == "dcsaowei_backup" && player.hasHistory("sourceDamage", (evt) => evt.card == event.card);
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const cards2 = trigger.cards.filterInD();
          if (cards2.length > 0) {
            await player.gain(cards2, "gain2");
          }
        }
      }
    }
  },
  //向朗
  dckanji: {
    audio: 2,
    enable: "phaseUse",
    usable: 2,
    filter(event, player) {
      return player.countCards("h");
    },
    async content(event, trigger, player) {
      await player.showHandcards();
      const suits = /* @__PURE__ */ new Set();
      const cards2 = player.getCards("h");
      for (const card of cards2) {
        suits.add(get.suit(card));
      }
      if (suits.size === cards2.length) {
        player.draw(2);
        event.suitsLength = suits.size;
        player.addTempSkill("dckanji_check");
      }
    },
    subSkill: {
      check: {
        trigger: { player: "gainAfter" },
        filter(event, player) {
          if (event.getParent(2).name != "dckanji") {
            return false;
          }
          var len = event.getParent(2).suitsLength;
          var suits = [];
          player.getCards("h", (card) => suits.add(get.suit(card)));
          return suits.length >= 4 && len < 4;
        },
        charlotte: true,
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          player.skip("phaseDiscard");
          game.log(player, "跳过了", "#y弃牌阶段");
        }
      }
    },
    ai: {
      order: 9,
      result: {
        player(player, target) {
          var count = player.countCards("h");
          if (count > 4) {
            return false;
          }
          var suits = [];
          player.getCards("h", (card) => suits.add(get.suit(card)));
          return suits.length == count ? 1 : 0;
        }
      }
    }
  },
  dcqianzheng: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    usable: 2,
    filter(event, player) {
      return event.player != player && (get.type(event.card) == "trick" || event.card.name == "sha") && player.countCards("he") > 1;
    },
    preHidden: true,
    async cost(event, trigger, player) {
      const str = "，若重铸的牌中没有" + get.translation(get.type2(trigger.card)) + "牌，你于" + get.translation(trigger.cards) + "进入弃牌堆后获得之";
      event.result = await player.chooseCard(get.prompt(event.skill), "重铸两张牌" + (trigger.cards.length ? str : "") + "。", 2, "he", lib.filter.cardRecastable).set("ai", (card) => {
        var val = get.value(card);
        if (get.type2(card) == _status.event.type) {
          val += 0.5;
        }
        return 6 - val;
      }).setHiddenSkill(event.skill).set("type", get.type2(trigger.card)).forResult();
    },
    async content(event, trigger, player) {
      if (event.cards.every((card) => get.type2(card) != get.type2(trigger.card))) {
        trigger.getParent().dcqianzheng = true;
        player.addTempSkill("dcqianzheng_gain");
      }
      await player.recast(event.cards);
    },
    subSkill: {
      gain: {
        trigger: { global: "cardsDiscardAfter" },
        filter(event, player) {
          var evt = event.getParent();
          if (evt.name != "orderingDiscard") {
            return false;
          }
          return evt.relatedEvent.dcqianzheng && evt.relatedEvent.cards.filterInD("d").length;
        },
        charlotte: true,
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          const evt = trigger.getParent().relatedEvent;
          player.gain(evt.cards.filterInD("d"), "gain2");
        }
      }
    }
  },
  //秦朗
  dchaochong: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter(event, player) {
      return player.getHandcardLimit() != player.countCards("h");
    },
    direct: true,
    locked: false,
    async content(event, trigger, player) {
      var del = player.getHandcardLimit() - player.countCards("h");
      event.delta = del;
      if (del > 0) {
        const result = await player.chooseBool(get.prompt("dchaochong"), "摸" + get.cnNumber(Math.min(5, del)) + "张牌，然后令你的手牌上限-1").set("ai", () => {
          var player2 = _status.event.player;
          if (player2.isPhaseUsing() && player2.hasCard((cardx) => player2.hasUseTarget(cardx) && player2.hasValueTarget(cardx), "hs")) {
            return false;
          }
          return true;
        }).forResult();
        if (result.bool) {
          player.logSkill("dchaochong");
          player.draw(Math.min(5, event.delta));
          lib.skill.dchaochong.change(player, -1);
        }
      } else if (del < 0) {
        const result = await player.chooseToDiscard(get.prompt("dchaochong"), "弃置" + get.cnNumber(-del) + "张手牌，然后令你的手牌上限+1", -del, "allowChooseAll").set("ai", (card) => {
          var player2 = _status.event.player;
          if (player2.isPhaseUsing() && player2.hasCard((cardx) => player2.hasValueTarget(cardx), "hs")) {
            return 6 - player2.getUseValue(card);
          }
          return 5 - get.value(card);
        }).set("logSkill", "dchaochong").forResult();
        if (result.bool) {
          lib.skill.dchaochong.change(player, 1);
        }
      }
    },
    change(player, num) {
      if (typeof player.storage.dchaochong !== "number") {
        player.storage.dchaochong = 0;
      }
      if (!num) {
        return;
      }
      player.storage.dchaochong += num;
      player.markSkill("dchaochong");
      game.log(player, "的手牌上限", "#g" + (num > 0 ? "+" : "") + num);
    },
    markimage: "image/card/handcard.png",
    intro: {
      content(storage, player) {
        var num = player.storage.dchaochong;
        return "手牌上限" + (num >= 0 ? "+" : "") + num;
      }
    },
    mod: {
      maxHandcard(player, num) {
        return num + player.countMark("dchaochong");
      }
    },
    ai: { threaten: 2.2 }
  },
  dcjinjin: {
    audio: 2,
    trigger: {
      source: "damageSource",
      player: "damageEnd"
    },
    usable: 2,
    logTarget: "source",
    check(event, player) {
      if (typeof player.storage.dchaochong != "number" || player.storage.dchaochong == 0) {
        return true;
      }
      var evt = event.getParent("useCard");
      if (evt && evt.player == player && event.source == player) {
        return false;
      }
      if (player.isPhaseUsing() && player.storage.dchaochong == -1) {
        return true;
      }
      return Math.abs(player.storage.dchaochong) >= 2;
    },
    prompt2(event, player) {
      var str = "";
      if (typeof player.storage.dchaochong == "number" && player.storage.dchaochong != 0) {
        str += "重置因〖佞宠〗增加或减少的手牌上限，";
      }
      var num = Math.abs(player.countMark("dchaochong")) || 1;
      if (event.source && event.source.isIn()) {
        str += "令伤害来源弃置至多" + get.cnNumber(num) + "张牌，然后你摸" + num + "-X张牌（X为其弃置的牌数）";
      } else {
        str += "你摸" + get.cnNumber(num) + "张牌";
      }
      return str;
    },
    async content(event, trigger, player) {
      const del = Math.abs(player.countMark("dchaochong")) || 1;
      event.delta = del;
      player.storage.dchaochong = 0;
      if (player.hasSkill("dchaochong", null, false, false)) {
        player.markSkill("dchaochong");
      }
      game.log(player, "重置了手牌上限");
      let result = { bool: false };
      if (trigger.source && trigger.source.isIn()) {
        result = await trigger.source.chooseToDiscard(get.translation(player) + "对你发动了【矜谨】", "弃置至多" + get.cnNumber(del) + "张牌，然后" + get.translation(player) + "摸" + del + "-X张牌（X为你弃置的牌数）。", [1, del], "he", "allowChooseAll").set("ai", (card) => {
          if (_status.event.goon) {
            return 5.5 - get.value(card);
          }
          return 0;
        }).set("goon", get.attitude(trigger.source, player) < 0).forResult();
      }
      let num = event.delta;
      if (result.bool) {
        num -= result.cards.length;
      }
      if (num > 0) {
        await player.draw(num);
      }
    },
    ai: {
      combo: "dchaochong",
      maixie: true,
      maixie_hp: true,
      threaten: 0.85,
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage")) {
            if (player.hasSkillTag("jueqing", false, target)) {
              return [1, -2];
            }
            if (!target.hasFriend()) {
              return;
            }
            var num = 0;
            if (typeof target.storage.dcninchong == "number") {
              num = Math.abs(target.storage.dcninchong);
            }
            if (num <= 0) {
              return;
            }
            return [1, Math.min(1, num / 3)];
          }
        }
      }
    }
  },
  //二傅
  dcxuewei: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    direct: true,
    async content(event, trigger, player) {
      const result = await player.chooseTarget(get.prompt2("dcxuewei"), (card, player2, target2) => {
        return target2.hp <= player2.hp;
      }).set("ai", (target2) => {
        var player2 = _status.event.player;
        return get.effect(target2, { name: "tao" }, player2, player2) + 0.1;
      }).forResult();
      if (result.bool) {
        var target = result.targets[0];
        player.logSkill("dcxuewei", target);
        player.addTempSkill("dcxuewei_shelter", { player: "phaseBegin" });
        player.markAuto("dcxuewei_shelter", [target]);
      }
    },
    ai: { threaten: 1.1 },
    subSkill: {
      shelter: {
        audio: "dcxuewei",
        trigger: { global: "damageBegin4" },
        filter(event, player) {
          return player.getStorage("dcxuewei_shelter").includes(event.player);
        },
        charlotte: true,
        forced: true,
        onremove: true,
        logTarget: "player",
        marktext: "卫",
        intro: { content: "保护对象：$" },
        async content(event, trigger, player) {
          trigger.cancel();
          await player.loseHp();
          if (trigger.player != player) {
            await game.asyncDraw([player, trigger.player]);
          } else {
            await player.draw("nodelay");
          }
          await game.delayx();
        },
        ai: {
          filterDamage: true,
          skillTagFilter(player, tag, arg) {
            if (arg && arg.player && arg.player.hasSkillTag("jueqing", false, player)) {
              return false;
            }
            return true;
          }
        }
      }
    }
  },
  dcyuguan: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    filter(event, player) {
      var num = player.getDamagedHp();
      if (num == 0) {
        return false;
      }
      return !game.hasPlayer((current) => {
        return current.getDamagedHp() > num;
      });
    },
    check(event, player) {
      var num = player.getDamagedHp() - 1;
      if (num <= 0) {
        return false;
      }
      return game.countPlayer((target) => {
        if (player === target) {
          return player.maxHp - player.countCards("h") - 1;
        }
        if (get.attitude(player, target) > 0) {
          return target.maxHp - target.countCards("h");
        }
        return 0;
      }) > 1;
    },
    async content(event, trigger, player) {
      await player.loseMaxHp();
      const num = player.getDamagedHp();
      if (!player.isIn() || !num) {
        return;
      }
      const result = await player.chooseTarget("御关：令至多" + get.cnNumber(num) + "名角色将手牌摸至体力上限", [1, Math.min(game.countPlayer(), num)], true).set("ai", (target) => {
        return get.attitude(_status.event.player, target) * Math.max(0.1, target.maxHp - target.countCards("h"));
      }).forResult();
      if (result.bool) {
        const targets = result.targets.sortBySeat(_status.currentPhase);
        player.line(targets);
        for (const target of targets) {
          target.drawTo(target.maxHp);
        }
      }
    }
  },
  //郑浑
  dcqiangzhi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      if (target == player) {
        return false;
      }
      return target.countDiscardableCards(player, "he") + player.countDiscardableCards(player, "he") >= 3;
    },
    async content(event, trigger, player) {
      const target = event.target;
      if (target.countDiscardableCards(player, "he") + player.countDiscardableCards(player, "he") < 3) {
        return;
      }
      const dialog = [];
      dialog.push("强峙：弃置你与" + get.translation(target) + "的共计三张牌");
      if (player.countCards("h")) {
        dialog.addArray(['<div class="text center">你的手牌</div>', player.getCards("h")]);
      }
      if (player.countCards("e")) {
        dialog.addArray(['<div class="text center">你的装备</div>', player.getCards("e")]);
      }
      if (target.countCards("h")) {
        dialog.add('<div class="text center">' + get.translation(target) + "的手牌</div>");
        if (player.hasSkillTag("viewHandcard", null, target, true)) {
          dialog.push(target.getCards("h"));
        } else {
          dialog.push([target.getCards("h"), "blank"]);
        }
      }
      if (target.countCards("e")) {
        dialog.addArray(['<div class="text center">' + get.translation(target) + "的装备</div>", target.getCards("e")]);
      }
      const result = await player.chooseButton(3, true).set("createDialog", dialog).set("filterButton", (button) => {
        if (!lib.filter.canBeDiscarded(button.link, _status.event.player, get.owner(button.link))) {
          return false;
        }
        return true;
      }).set("filterOk", () => {
        return ui.selected.buttons.length == 3;
      }).set("ai", (button) => {
        const player2 = _status.event.player;
        const target2 = _status.event.getParent().target;
        const card = button.link;
        if (get.owner(card) == player2) {
          if (_status.event.damage) {
            return 15 - get.value(card);
          }
          if (player2.hp >= 3 || get.damageEffect(player2, target2, player2) >= 0 || player2.hasSkill("dcpitian") && player2.getHandcardLimit() - player2.countCards("h") >= 1 && player2.hp > 1) {
            return 0;
          }
          if (ui.selected.buttons.length == 0) {
            return 10 - get.value(card);
          }
          return 0;
        } else {
          if (_status.event.damage) {
            return 0;
          }
          return -(get.sgnAttitude(player2, target2) || 1) * get.value(card);
        }
      }).set(
        "damage",
        get.damageEffect(target, player, player) > 10 && player.countCards("he", (card) => {
          return lib.filter.canBeDiscarded(card, player, player) && get.value(card) < 5;
        }) >= 3
      ).forResult();
      if (!result?.bool) {
        return;
      }
      const links = result.links;
      const list1 = [];
      const list2 = [];
      const players = [player, target];
      for (const card of links) {
        if (get.owner(card) == player) {
          list1.push(card);
        } else {
          list2.push(card);
        }
      }
      if (list1.length && list2.length) {
        await game.loseAsync({
          lose_list: [
            [player, list1],
            [target, list2]
          ],
          discarder: player
        }).setContent("discardMultiple");
      } else if (list2.length) {
        await target.discard(list2);
      } else {
        await player.discard(list1);
      }
      if (list1.length >= 3 || list2.length >= 3) {
        if (list2.length >= 3) {
          players.reverse();
        }
        players[0].line(players[1]);
        await players[1].damage(players[0]);
      }
    },
    ai: {
      expose: 0.2,
      order: 4,
      result: {
        target(player, target) {
          return get.effect(target, { name: "guohe_copy2" }, player, target) / 2 * (target.countDiscardableCards(player, "he") >= 2 ? 1.25 : 1) + get.damageEffect(target, player, target) / 3;
        }
      }
    }
  },
  dcpitian: {
    audio: 2,
    trigger: {
      player: ["loseAfter", "damageEnd"],
      global: "loseAsyncAfter"
    },
    forced: true,
    locked: false,
    group: "dcpitian_draw",
    filter(event, player) {
      if (event.name == "damage") {
        return true;
      }
      return event.type == "discard" && event.getl(player).cards2.length > 0;
    },
    async content(event, trigger, player) {
      player.addMark("dcpitian_handcard", 1, false);
      player.addSkill("dcpitian_handcard");
      game.log(player, "的手牌上限", "#y+1");
    },
    subSkill: {
      draw: {
        audio: "dcpitian",
        trigger: { player: "phaseJieshuBegin" },
        filter(event, player) {
          return player.countCards("h") < player.getHandcardLimit();
        },
        prompt2(event, player) {
          return "摸" + get.cnNumber(Math.min(5, player.getHandcardLimit() - player.countCards("h"))) + "张牌，重置因〖辟田〗增加的手牌上限";
        },
        check(event, player) {
          return player.getHandcardLimit() - player.countCards("h") > Math.min(2, player.hp - 1);
        },
        async content(event, trigger, player) {
          const num = Math.min(5, player.getHandcardLimit() - player.countCards("h"));
          if (num > 0) {
            await player.draw(num);
          }
          player.removeMark("dcpitian_handcard", player.countMark("dcpitian_handcard"), false);
          game.log(player, "重置了", "#g【辟田】", "增加的手牌上限");
        }
      },
      handcard: {
        markimage: "image/card/handcard.png",
        intro: {
          content(storage, player) {
            return "手牌上限+" + storage;
          }
        },
        charlotte: true,
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("dcpitian_handcard");
          }
        }
      }
    },
    ai: {
      effect: {
        target(card, player, target) {
          if (get.tag(card, "discard")) {
            return 0.9;
          }
          if (get.tag(card, "damage")) {
            return 0.95;
          }
        }
      }
    }
  },
  //新服二赵
  dcqingren: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    frequent: true,
    filter(event, player) {
      return player.hasHistory("useSkill", (evt) => ["yizan_use", "yizan_use_backup"].includes(get.sourceSkillFor(evt)));
    },
    async content(event, trigger, player) {
      player.draw(player.getHistory("useSkill", (evt) => ["yizan_use", "yizan_use_backup"].includes(get.sourceSkillFor(evt))).length);
    },
    ai: {
      combo: "yizan_use"
    }
  },
  dclongyuan: {
    audio: "xinfu_longyuan",
    forced: true,
    juexingji: true,
    trigger: { global: "phaseEnd" },
    skillAnimation: true,
    animationColor: "orange",
    filter(event, player) {
      return player.countMark("yizan_use") >= 3;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      player.draw(2);
      player.recover();
      player.storage.yizan = true;
    },
    derivation: "yizan_rewrite",
    ai: { combo: "yizan_use" }
  },
  //黄皓
  dcqinqing: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    direct: true,
    filter(event, player) {
      var zhu = game.filterPlayer((current) => current.getSeatNum() == 1)[0];
      if (!zhu || !zhu.isIn()) {
        return false;
      }
      return game.hasPlayer((current) => {
        return current != player && current.inRange(zhu);
      });
    },
    seatRelated: true,
    async content(event, trigger, player) {
      const result = await player.chooseTarget(get.prompt2("dcqinqing"), function(card, player2, target2) {
        const zhu2 = game.filterPlayer((current) => current.getSeatNum() == 1)[0];
        return target2 != player2 && target2.inRange(zhu2) && target2.countDiscardableCards(player2, "he") > 0;
      }).set("ai", function(target2) {
        const zhu2 = game.filterPlayer((current) => current.getSeatNum() == 1)[0];
        const he = target2.countCards("he");
        if (get.attitude(_status.event.player, target2) > 0) {
          if (target2.countCards("h") > zhu2.countCards("h") + 1) {
            return 0.1;
          }
        } else {
          if (he > zhu2.countCards("h") + 1) {
            return 2;
          }
          if (he > 0) {
            return 1;
          }
        }
        return 0;
      }).forResult();
      if (!result.bool) {
        return;
      }
      const target = result.targets[0];
      event.target = target;
      player.logSkill("dcqinqing", target);
      if (target.countCards("he")) {
        await player.discardPlayerCard(target, "he", true);
      }
      const zhu = game.filterPlayer((current) => current.getSeatNum() == 1)[0];
      if (zhu && zhu.isIn()) {
        if (target.countCards("h") > zhu.countCards("h")) {
          await player.draw();
        }
      }
    }
  },
  dccunwei: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    forced: true,
    filter(event, player) {
      return get.type2(event.card) == "trick" && (event.targets.length == 1 || player.countCards("he") > 0);
    },
    async content(event, trigger, player) {
      if (trigger.targets.length == 1) {
        player.draw();
      } else if (player.countCards("he") > 0) {
        player.chooseToDiscard("he", true, "存畏：请弃置一张牌");
      }
    },
    ai: { halfneg: true }
  },
  //刘辟
  dcjuying: {
    audio: 2,
    trigger: { player: "phaseUseEnd" },
    filter(event, player) {
      return ["sha", "jiu"].some((name) => {
        return player.getCardUsable(name, true) > player.getHistory("useCard", (evt) => {
          return evt.getParent("phaseUse") == event && evt.card.name == name && evt.addCount !== false;
        }).length;
      });
    },
    direct: true,
    async content(event, trigger, player) {
      const result = await player.chooseButton([
        get.prompt("dcjuying"),
        [
          [
            ["sha", "你于下回合使用【杀】的次数上限+1"],
            ["hand", "本回合手牌上限+2"],
            ["draw", "摸三张牌"]
          ],
          "textbutton"
        ]
      ]).set("ai", function(button) {
        const player2 = _status.event.player;
        const choice = button.link;
        if (choice == "draw") {
          return 10;
        }
        if (choice == "sha") {
          return 9;
        }
        const del = 3 - player2.hp;
        if (choice == "hand") {
          if (del <= 0 || player2.needsToDiscard()) {
            return 8;
          }
        }
        return 0;
      }).set("selectButton", [1, 3]).forResult();
      if (!result.bool) {
        return;
      }
      player.logSkill("dcjuying");
      const choices = result.links;
      if (choices.includes("sha")) {
        player.addMark("dcjuying_sha", 1, false);
        player.addSkill("dcjuying_sha");
      }
      if (choices.includes("hand")) {
        player.addMark("dcjuying_hand", 1, false);
        player.addTempSkill("dcjuying_hand");
      }
      if (choices.includes("draw")) {
        await player.draw(3);
      }
      const num = choices.length - Math.max(0, player.hp);
      if (num > 0) {
        await player.chooseToDiscard(true, "he");
      }
    },
    ai: {
      effect: {
        player_use(card, player, target) {
          if (typeof card == "object" && player.isPhaseUsing() && ["sha", "jiu"].some((name) => {
            return card.name == name && player.getCardUsable(name) == 1 && !player.getCardUsable(name == "sha" ? "jiu" : "sha");
          })) {
            return "zeroplayertarget";
          }
        },
        target_use(card, player, target) {
          if (card.name == "jiu" && player.getCardUsable("sha") == 2) {
            return [1, 1];
          }
        }
      }
    },
    subSkill: {
      sha: {
        trigger: { player: "phaseBegin" },
        filter(event, player) {
          return player.countMark("dcjuying_sha") > 0;
        },
        silent: true,
        firstDo: true,
        charlotte: true,
        onremove: true,
        async content(event, trigger, player) {
          player.addMark("dcjuying_effect", player.countMark("dcjuying_sha"), false);
          player.addTempSkill("dcjuying_effect");
          player.removeSkill("dcjuying_sha");
        },
        intro: { content: "下回合使用【杀】的次数上限+#" }
      },
      effect: {
        onremove: true,
        charlotte: true,
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.countMark("dcjuying_effect");
            }
          }
        },
        intro: { content: "本回合使用【杀】的次数上限+#" }
      },
      hand: {
        onremove: true,
        charlotte: true,
        mod: {
          maxHandcard(player, num) {
            return num + 2 * player.countMark("dcjuying_hand");
          }
        }
      }
    }
  },
  //新服加强魏贾诩
  dcjianshu: {
    audio: "jianshu",
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("h", { color: "black" }) > 0;
    },
    filterTarget(card, player, target) {
      if (target == player) {
        return false;
      }
      if (ui.selected.targets.length) {
        return ui.selected.targets[0] != target && !ui.selected.targets[0].hasSkillTag("noCompareSource") && target.countCards("h") && !target.hasSkillTag("noCompareTarget");
      }
      return true;
    },
    targetprompt: ["发起者", "拼点目标"],
    filterCard: { color: "black" },
    discard: false,
    lose: false,
    delay: false,
    check(card) {
      if (_status.event.player.hp == 1) {
        return 8 - get.value(card);
      }
      return 6 - get.value(card);
    },
    selectTarget: 2,
    multitarget: true,
    async content(event, trigger, player) {
      const { cards: cards2, targets } = event;
      await player.give(cards2, targets[0], "give");
      if (!targets[0].canCompare(targets[1])) {
        return;
      }
      const result = await targets[0].chooseToCompare(targets[1]).forResult();
      player.addTempSkill("dcjianshu_check", "phaseUseAfter");
      if (result.bool) {
        const cards1 = targets[0].getCards("he", function(card) {
          return lib.filter.cardDiscardable(card, targets[0], "dcjianshu");
        });
        if (cards1.length > 0) {
          await targets[0].discard(cards1.randomGet());
        }
        await targets[1].loseHp();
      } else if (result.tie) {
        await targets[0].loseHp();
        await targets[1].loseHp();
      } else {
        const cards22 = targets[1].getCards("he", function(card) {
          return lib.filter.cardDiscardable(card, targets[1], "dcjianshu");
        });
        if (cards22.length > 0) {
          await targets[1].discard(cards22.randomGet());
        }
        await targets[0].loseHp();
      }
    },
    subSkill: {
      check: {
        trigger: { global: "dieAfter" },
        charlotte: true,
        forced: true,
        popup: false,
        filter(event, player) {
          return event.getParent(3).name == "dcjianshu";
        },
        async content(event, trigger, player) {
          delete player.getStat("skill").dcjianshu;
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
  dcyongdi: {
    audio: "yongdi",
    audioname: ["xinping"],
    limited: true,
    enable: "phaseUse",
    filterTarget(card, player, target) {
      return target.hasSex("male");
    },
    animationColor: "thunder",
    skillAnimation: "legend",
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const target = event.target;
      if (target.isMinMaxHp() || target.isMinHp()) {
        await target.gainMaxHp();
        await target.recover();
      }
      if (target.isMinHandcard()) {
        await target.draw(Math.min(5, target.maxHp));
      }
      await game.delayx();
    },
    ai: {
      expose: 0.3,
      order: 1,
      result: {
        target(player, target) {
          var val = 0;
          var bool1 = !game.hasPlayer((current) => current.maxHp < target.maxHp), bool2 = target.isMinHp(), bool3 = target.isMinHandcard();
          if (bool1) {
            val += 6.5;
          }
          if (bool2) {
            if (bool1) {
              target.maxHp++;
            }
            val += Math.max(0, get.recoverEffect(target, player, player));
            if (bool1) {
              target.maxHp--;
            }
          }
          if (bool3) {
            var num = Math.max(0, Math.min(5, target.maxHp + (bool1 ? 1 : 0)));
            val += 5 * num;
          }
          return val;
        }
      }
    }
  },
  //雷普
  dcsilve: {
    audio: 2,
    trigger: {
      player: "enterGame",
      global: "phaseBefore"
    },
    onremove: ["dcsilve", "dcsilve_self"],
    filter(event, player) {
      return game.hasPlayer((current) => current != player && !player.getStorage("dcsilve").includes(current)) && (event.name != "phase" || game.phaseNumber == 0);
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget("私掠：请选择一名其他角色", "选择一名其他角色（暂时仅你可见），称为“私掠”角色，且你获得后续效果", true, (card, player2, target) => {
        return target != player2 && !player2.getStorage("dcsilve").includes(target);
      }).set("ai", (target) => {
        const att = get.attitude(get.player(), target);
        if (att > 0) {
          return att + 1;
        }
        if (att == 0) {
          return Math.random();
        }
        return att;
      }).set("animate", false).forResult();
    },
    logLine: false,
    async content(event, trigger, player) {
      const [target] = event.targets;
      player.markAuto(event.name, [target]);
      player.addSkill(event.name + "_rob");
      player.addSkill(event.name + "_revenge");
      target.addSkill(event.name + "_target");
      target.storage[event.name + "_target"] ??= [];
      target.storage[event.name + "_target"].push(player);
    },
    subSkill: {
      rob: {
        audio: "dcsilve",
        trigger: { global: "damageSource" },
        filter(event, player) {
          if (!player.getStorage("dcsilve").includes(event.source)) {
            return false;
          }
          if (!event.player.isIn() || event.player == player || event.source == event.player) {
            return false;
          }
          if (player.getStorage("dcsilve_robbed").includes(event.player)) {
            return false;
          }
          return event.player.countCards("he") > 0;
        },
        charlotte: true,
        prompt2(event, player) {
          return "获得" + get.translation(event.player) + "一张牌";
        },
        logTarget: "player",
        async content(event, trigger, player) {
          const [target] = event.targets;
          player.addTempSkill("dcsilve_robbed");
          player.markAuto("dcsilve_self", [target]);
          if (target.countGainableCards(player, "he") > 0) {
            player.markAuto("dcsilve_robbed", [target]);
            await player.gainPlayerCard(target, "he", true);
          }
          if (trigger.source && trigger.source != player) {
            trigger.source.markSkill("dcsilve_target");
          }
        }
      },
      revenge: {
        audio: "dcsilve",
        trigger: { global: "damageEnd" },
        filter(event, player) {
          if (!player.getStorage("dcsilve").includes(event.player)) {
            return false;
          }
          if (!event.player.isIn() || !event.source?.isIn() || event.source == player) {
            return false;
          }
          return true;
        },
        charlotte: true,
        direct: true,
        clearTime: true,
        async content(event, trigger, player) {
          if (trigger.player && trigger.player != player) {
            trigger.player.markSkill("dcsilve_target");
          }
          player.markAuto("dcsilve_self", [trigger.player]);
          const result = await player.chooseToUse("私掠：对" + get.translation(trigger.source) + "使用一张【杀】，或弃置一张手牌", function(card, player2, event2) {
            if (get.name(card) != "sha") {
              return false;
            }
            return lib.filter.filterCard.apply(this, arguments);
          }).set("targetRequired", true).set("complexTarget", true).set("complexSelect", true).set("filterTarget", function(card, player2, target) {
            if (target != _status.event.source && !ui.selected.targets.includes(_status.event.source)) {
              return false;
            }
            return lib.filter.targetEnabled.apply(this, arguments);
          }).set("source", trigger.source).set("logSkill", event.name).forResult();
          if (!result?.bool) {
            if (player.countCards("h") > 0) {
              await player.chooseToDiscard("h", true).set("logSkill", event.name);
            }
          }
        }
      },
      self: {
        marktext: "私",
        intro: {
          name: "私掠",
          content(storage, player) {
            if (!storage?.length) {
              return "没有打劫对象";
            }
            if (storage[0] == player) {
              return "已绑定" + get.translation(player) + "自己";
            }
            return "打劫对象：" + get.translation(storage);
          }
        }
      },
      target: {
        marktext: "掠",
        intro: {
          name: "私掠",
          content(storage, player) {
            return "被" + get.translation(storage) + "盯上了！";
          }
        }
      },
      robbed: { onremove: true, charlotte: true }
    }
  },
  dcshuaijie: {
    audio: 2,
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    animationColor: "thunder",
    filter(event, player) {
      var targets = player.getStorage("dcsilve").filter((i) => i.isIn());
      if (!targets.length) {
        return true;
      }
      return targets.filter((target) => {
        return player.hp > target.hp && player.countCards("e") > target.countCards("e");
      }).length == targets.length;
    },
    async content(event, trigger, player) {
      await player.awakenSkill(event.name);
      await player.loseMaxHp();
      const choices = [];
      const choiceList = ["获得“私掠”角色至多三张牌", "从牌堆随机获得三张类型各不相同的牌"];
      const targets = player.getStorage("dcsilve").filter((i) => i.isIn());
      event.targets = targets;
      if (targets.length) {
        choices.push("选项一");
      } else {
        choiceList[0] = '<span style="opacity:0.5; ">' + choiceList[0] + "</span>";
      }
      choices.push("选项二");
      const result = await player.chooseControl(choices).set("prompt", "衰劫：选择一项").set("choiceList", choiceList).set("ai", () => _status.event.choice).set(
        "choice",
        (function() {
          let eff = 0;
          for (const target of targets) {
            eff += get.effect(target, { name: "shunshou_copy2" }, player, player) * 2;
          }
          eff -= get.effect(player, { name: "dongzhuxianji" }, player, player);
          return eff > 0 && choices.includes("选项一") ? "选项一" : "选项二";
        })()
      ).forResult();
      if (result.control == "选项一") {
        if (targets.length) {
          for (const target of targets) {
            if (target.countGainableCards(player, "he") > 0) {
              player.line(target);
              await player.gainPlayerCard(target, "he", true, [1, 3]);
            }
          }
        }
      } else {
        const cards2 = [];
        for (let i = 0; i < 3; i++) {
          const card = get.cardPile2((cardx) => {
            return cards2.filter((cardxx) => get.type2(cardxx) == get.type2(cardx)).length == 0;
          }, "random");
          if (card) {
            cards2.push(card);
          }
        }
        if (cards2.length) {
          await player.gain(cards2, "gain2");
        }
      }
      const currentTargets = player.getStorage("dcsilve").filter((i) => i.isIn());
      for (const target of currentTargets) {
        target.unmarkAuto("dcsilve_target", [player]);
      }
      delete player.storage.dcsilve;
      delete player.storage.dcsilve_self;
      player.markAuto("dcsilve", [player]);
      player.markAuto("dcsilve_self", [player]);
    },
    ai: {
      combo: "dcsilve",
      order: 8,
      result: {
        player(player) {
          var targets = player.getStorage("dcsilve").filter((i) => i.isIn());
          if (!targets.length) {
            return 1;
          }
          var att = 0;
          targets.forEach((i) => att += get.attitude(player, i));
          if (att < 0) {
            return 1;
          }
          return 0;
        }
      }
    }
  },
  //庞会
  dcyiyong: {
    audio: 2,
    trigger: {
      source: "damageBegin1"
    },
    //usable:2,
    filter(event, player) {
      return player.countDiscardableCards(player, "he") > 0 && player != event.player;
    },
    check(event, player) {
      return get.attitude(player, event.player) < 0 && player.countCards("he", (card) => lib.filter.cardDiscardable(card, player, "dcyiyong") && get.value(card, player) < 7) > 0;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const list = [player];
      if (trigger.player.countDiscardableCards(trigger.player, "he") > 0) {
        list.push(trigger.player);
      }
      if (!event.isMine() && !event.isOnline()) {
        await game.delayx();
      }
      const result = await player.chooseCardOL(list, "he", true, [1, Infinity], "异勇：弃置任意张牌", (card, player2, target) => {
        return lib.filter.cardDiscardable(card, player2, "dcyiyong");
      }).set("allowChooseAll", true).set("ai", (card) => {
        const evt = _status.event.getParent(2);
        const evtx = _status.event.getParent();
        const source = evt.player, player2 = _status.event.player, target = evtx.list[1];
        if (!target) {
          return get.unuseful(card);
        }
        if (player2 == source) {
          let total = 0, need = 0;
          target.countCards("he", (card2) => {
            if (lib.filter.cardDiscardable(card2, target, "dcyiyong") && get.value(card2) < 5) {
              need += get.number(card2);
            }
          });
          for (const i of ui.selected.cards) {
            total += get.number(i);
          }
          if (total >= need + 5) {
            return 0;
          }
          let val = 6;
          if (target.hp <= 2 && !target.hasSkillTag("filterDamage", null, {
            player: player2,
            card: evt.getTrigger().card
          })) {
            val += 2 + get.number(card) / 5;
          }
          if (target.countCards("he", (card2) => get.value(card2) < 5) >= 3) {
            val -= 3 + get.number(card) / 5;
          }
          return val - get.value(card);
        }
        if (ui.selected.cards.length > 1 && ui.selected.cards.length + 2 >= source.countCards("he")) {
          return 0;
        }
        if (player2.hp <= 2 && !target.hasSkillTag("filterDamage", null, {
          player: player2,
          card: evt.getTrigger().card
        })) {
          return 10 - get.value(card);
        }
        return 5 - get.value(card);
      }).forResult();
      const lose_list = [];
      for (let i = 0; i < result.length; i++) {
        const current = list[i], cards2 = result[i].cards;
        lose_list.push([current, cards2]);
      }
      await game.loseAsync({ lose_list }).setContent("discardMultiple");
      const getn = function(cards2) {
        return cards2.map((i) => get.number(i, false)).reduce((p, c) => p + c, 0);
      };
      const cards0 = result[0]?.cards || [];
      const cards1 = result[1]?.cards || [];
      const num0 = getn(cards0), num1 = getn(cards1);
      if (num0 <= num1) {
        await player.draw(cards1.length + 1);
      }
      if (num0 >= num1) {
        trigger.num++;
      }
    }
  },
  dcsuchou: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    forced: true,
    async content(event, trigger, player) {
      const { index } = await player.chooseControl().set("prompt", "夙仇：请选择一项").set("choiceList", ["失去1点体力，本阶段使用牌不可被响应", "减1点体力上限，本阶段使用牌不可被响应", "失去〖夙仇〗"]).set("ai", () => {
        const player2 = get.event().player;
        if (player2.isHealthy()) {
          return player2.maxHp <= 2 ? 2 : 0;
        }
        return 1;
      }).forResult();
      switch (index) {
        case 0:
          await player.loseHp();
          player.addTempSkill("dcsuchou_effect", "phaseUseAfter");
          break;
        case 1:
          await player.loseMaxHp();
          player.addTempSkill("dcsuchou_effect", "phaseUseAfter");
          break;
        case 2:
          await player.removeSkills("dcsuchou");
          break;
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        mark: true,
        marktext: "仇",
        intro: { content: "使用牌不可被响应" },
        audio: "dcsuchou",
        trigger: { player: "useCard" },
        filter(event, player) {
          return event.card.name == "sha" || get.type(event.card) == "trick";
        },
        forced: true,
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.players);
          game.log(trigger.card, "不可被响应");
        },
        ai: { directHit_ai: true }
      }
    }
  },
  //乐就
  dccuijin: {
    audio: 2,
    trigger: { global: "useCard" },
    filter(event, player) {
      return (event.card.name == "sha" || event.card.name == "juedou") && (event.player == player || player.inRange(event.player)) && player.countCards("he") > 0;
    },
    checkx(event, player) {
      get.damageEffect(event.player, player, player);
      let damageBonus = 0, mayDamage = 0, odds = 2;
      if (event.card.name === "sha") {
        const nature = get.nature(event.card);
        for (let tar of event.targets) {
          if (event.player.hasSkillTag("jueqing", false, tar) || tar.hasSkillTag("filterDamage", null, {
            player: event.player,
            card: event.card
          })) {
            continue;
          }
          const hitOdds = 1 - tar.mayHaveShan(player, "use", true, "odds");
          if (hitOdds >= 1 || event.player.hasSkillTag(
            "directHit_ai",
            true,
            {
              target: tar,
              card: event.card
            },
            true
          )) {
            damageBonus += get.damageEffect(tar, event.player, player, nature);
          } else {
            odds = Math.min(odds, hitOdds);
            mayDamage += hitOdds * get.damageEffect(tar, event.player, player, nature);
          }
        }
      } else if (event.card.name === "juedou") {
        event.targets.sortBySeat(_status.currentPhase);
        let userSha = event.player.mayHaveSha(player, "respond", null, "count");
        for (let tar of event.targets) {
          if (event.player.hasSkillTag("jueqing", false, tar) || tar.hasSkillTag("filterDamage", null, {
            player: event.player,
            card: event.card
          })) {
            continue;
          }
          if (event.player.hasSkillTag(
            "directHit_ai",
            true,
            {
              target: tar,
              card: event.card
            },
            true
          ) || (userSha -= tar.mayHaveSha(player, "respond", null, "count")) >= 0) {
            damageBonus += get.damageEffect(tar, event.player, player);
          } else {
            damageBonus += get.damageEffect(event.player, tar, player);
          }
        }
      }
      if (damageBonus) {
        return damageBonus;
      }
      if (!mayDamage || odds > 1) {
        return get.damageEffect(event.player, player, player) + 2 * get.effect(player, "draw", player, player);
      }
      return mayDamage + (1 - odds) * (get.damageEffect(event.player, player, player) + 2 * get.effect(player, "draw", player, player));
    },
    async cost(event, trigger, player) {
      const skillName = event.name.slice(0, -5);
      event.result = await player.chooseToDiscard("he", get.prompt(skillName, trigger.player), "弃置一张牌并令" + get.translation(trigger.player) + "使用的" + get.translation(trigger.card) + "伤害+1，但若其未造成伤害，则你摸两张牌并对其造成1点伤害。").set("ai", function(card) {
        const goon = get.event().goon;
        if (goon) {
          return goon - get.value(card);
        }
        return 0;
      }).set(
        "goon",
        (() => {
          const num = lib.skill.dccuijin.checkx(trigger, player) * player.countCards("he") / 10;
          return num;
        })()
      ).set("chooseonly", true).set("logSkill", [skillName, trigger.player]).forResult();
      event.result.skill_popup = false;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      await player.discard(event.cards);
      if (typeof trigger.baseDamage !== "number") {
        trigger.baseDamage = 1;
      }
      trigger.baseDamage++;
      player.addSkill("dccuijin_damage");
      player.markAuto("dccuijin_damage", [trigger.card]);
      if (!player.storage.dccuijin_map) {
        player.storage.dccuijin_map = { cards: [], targets: [] };
      }
      player.storage.dccuijin_map.cards.push(trigger.card);
      player.storage.dccuijin_map.targets.push(trigger.targets.slice());
    },
    subSkill: {
      damage: {
        trigger: {
          global: ["damage", "damageCancelled", "damageZero", "shaMiss", "useCardToExcluded", "useCardToEnd", "eventNeutralized", "useCardAfter", "shaCancelled"]
        },
        forced: true,
        silent: true,
        firstDo: true,
        charlotte: true,
        onremove: true,
        filter(event, player, name) {
          if (!event.card) {
            return false;
          }
          var cards2 = player.getStorage("dccuijin_damage");
          if (!cards2.includes(event.card)) {
            return false;
          }
          return true;
        },
        async content(event, trigger, player) {
          const card = trigger.card;
          const idx = player.storage.dccuijin_map.cards.indexOf(card);
          if (event.triggername == "useCardAfter") {
            let cards2 = player.getStorage("dccuijin_damage");
            cards2 = cards2.remove(card);
            if (!cards2.length) {
              player.removeSkill("dccuijin_damage");
              delete player.storage.dccuijin_map;
            } else if (idx !== -1) {
              player.storage.dccuijin_map.cards.splice(idx, 1);
              player.storage.dccuijin_map.targets.splice(idx, 1);
            }
            return;
          }
          if (idx !== -1) {
            let target, source;
            if (trigger.name.indexOf("damage") == 0) {
              target = trigger.player;
              source = trigger.source;
            } else {
              target = trigger.target;
              source = trigger.player;
            }
            if (player.storage.dccuijin_map.targets[idx].includes(target) && !target.hasHistory("damage", (evt) => {
              return evt.card == card;
            })) {
              player.logSkill("dccuijin_damage", source);
              player.storage.dccuijin_map.targets[idx].remove(target);
              await player.draw(2);
              if (source && source.isIn()) {
                player.line(source, "green");
                await source.damage();
              }
            }
          }
          await game.delayx();
        }
      }
    }
  },
  //陈矫
  dcxieshou: {
    audio: 2,
    trigger: {
      global: "damageEnd"
    },
    usable: 1,
    filter(event, player) {
      return get.distance(player, event.player) <= 2 && event.player.isIn();
    },
    check(event, player) {
      return get.attitude(player, event.player) > 4;
    },
    locked: false,
    logTarget: "player",
    onremove: true,
    change(player, num) {
      player.addSkill("dcxieshoux");
      if (typeof player.storage.dcxieshoux !== "number") {
        player.storage.dcxieshoux = 0;
      }
      if (!num) {
        return;
      }
      player.storage.dcxieshoux += num;
      if (player.storage.dcxieshoux != 0) {
        player.markSkill("dcxieshoux");
      } else {
        player.unmarkSkill("dcxieshoux");
      }
      game.log(player, "的手牌上限", (num > 0 ? "+" : "") + num);
    },
    async content(event, trigger, player) {
      let result;
      let target = trigger.player;
      event.target = target;
      lib.skill.dcxieshou.change(player, -1);
      const choiceList = ["回复1点体力", "复原，摸两张牌"];
      const list = [];
      if (target.getDamagedHp() == 0) {
        choiceList[0] = '<span style="opacity:0.5; ">' + choiceList[0] + "</span>";
      } else {
        list.push("选项一");
      }
      list.push("选项二");
      result = await target.chooseControl(list).set("choiceList", choiceList).set("prompt", get.translation(player) + "对你发动了【协守】，请选择一项").forResult();
      if (result.control == "选项一") {
        target.recover();
      } else {
        target.link(false);
        await target.draw(2);
      }
    },
    ai: {
      expose: 0.3
    }
  },
  dcxieshoux: {
    markimage: "image/card/handcard.png",
    intro: {
      content(storage, player) {
        var num = player.storage.dcxieshoux;
        return "手牌上限" + (num >= 0 ? "+" : "") + num;
      }
    },
    charlotte: true,
    mod: {
      maxHandcard(player, num) {
        return num + (player.storage.dcxieshoux || 0);
      }
    }
  },
  dcqingyan: {
    audio: 2,
    trigger: {
      target: "useCardToTargeted"
    },
    filter(event, player) {
      return event.player != player && get.color(event.card) == "black";
    },
    usable: 2,
    async cost(event, trigger, player) {
      if (player.countCards("h") < player.hp) {
        event.result = await player.chooseBool(get.prompt(event.skill), "将手牌摸至体力上限（摸" + get.cnNumber(player.maxHp - player.countCards("h")) + "张牌）").set("ai", () => 1).forResult();
      } else {
        event.result = await player.chooseToDiscard(get.prompt(event.skill), "弃置一张手牌令你的手牌上限+1", "chooseonly").set("ai", (card) => 6 - get.value(card)).forResult();
      }
    },
    async content(event, trigger, player) {
      if (event.cards && event.cards.length) {
        await player.discard(event.cards);
        lib.skill.dcxieshou.change(player, 1);
      } else {
        player.drawTo(player.maxHp);
      }
    }
  },
  dcqizi: {
    mod: {
      cardSavable(card, player, target) {
        if (get.distance(player, target) > 2 && card.name == "tao" && target == _status.event.dying) {
          return false;
        }
      }
    },
    ai: {
      neg: true
    }
  },
  //公孙度
  dczhenze: {
    audio: 2,
    trigger: { player: "phaseDiscardBegin" },
    direct: true,
    async content(event, trigger, player) {
      const getCond = (player2) => Math.sign(player2.countCards("h") - Math.max(0, player2.hp));
      const me = getCond(player);
      const recovers = game.filterPlayer((current) => getCond(current) == me);
      const loses = game.filterPlayer().removeArray(recovers);
      const list = [];
      if (loses.length) {
        list.push("选项一");
      }
      if (recovers.length) {
        list.push("选项二");
      }
      list.push("cancel2");
      const sign = [
        ["≥", "＜"],
        ["≠", "＝"],
        ["≤", "＞"]
      ];
      const choiceList = ["令所有手牌数" + sign[me + 1][0] + "体力值的角色失去1点体力" + (loses.length ? "（" + get.translation(loses) + "）" : ""), "令所有手牌数" + sign[me + 1][1] + "体力值的角色回复1点体力" + (recovers.length ? "（" + get.translation(recovers) + "）" : "")];
      if (!loses.length) {
        choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
      }
      if (!recovers.length) {
        choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
      }
      const result = await player.chooseControl(list).set("choiceList", choiceList).set("prompt", get.prompt("dczhenze")).set("ai", () => _status.event.choice).set(
        "choice",
        (() => {
          let eff1 = loses.reduce((prev, i) => prev + get.effect(i, { name: "losehp" }, player, player), 0), eff2 = recovers.reduce((prev, i) => prev + get.recoverEffect(i, player, player), 0), max = Math.max(0, eff1, eff2);
          if (max === 0) {
            return "cancel2";
          }
          if (eff1 > eff2) {
            return "选项一";
          }
          return "选项二";
        })()
      ).forResult();
      if (result.control == "cancel2") {
        return;
      }
      const lose = result.control == "选项一";
      const targets = lose ? loses : recovers;
      player.logSkill("dczhenze", targets);
      for (const i of targets) {
        await i[lose ? "loseHp" : "recover"]();
      }
    }
  },
  dcanliao: {
    audio: 2,
    enable: "phaseUse",
    usable(skill, player) {
      return game.countPlayer((current) => current.group == "qun");
    },
    filter(event, player) {
      return game.hasPlayer((target) => lib.skill.dcanliao.filterTarget(null, player, target));
    },
    filterTarget(card, player, target) {
      return target.countCards("he");
    },
    async content(event, trigger, player) {
      const { target } = event;
      const result = await player.choosePlayerCard(target, "he", true).set("filterButton", (button) => {
        const card = button.link;
        const owner = get.owner(card);
        return !owner || owner.canRecast(card, _status.event.player);
      }).set("ai", (card) => {
        if (get.attitude(_status.event.player, _status.event.getParent().target) >= 0) {
          return -get.buttonValue(card);
        }
        return get.buttonValue(card);
      }).forResult();
      if (result.bool) {
        target.recast(result.links);
      }
    },
    ai: {
      expose: 0.1,
      result: {
        target(player, target) {
          if (target.hasCard((card) => get.value(card) >= 6, "e") && get.attitude(player, target) < 0) {
            return -1;
          }
          return 1;
        }
      }
    }
  },
  //王烈
  dcchongwang: {
    audio: 2,
    trigger: { global: "useCard" },
    filter(event, player) {
      if (player == event.player) {
        return false;
      }
      const type = get.type(event.card);
      if (!["basic", "trick"].includes(type)) {
        return false;
      }
      const history = game.getAllGlobalHistory("useCard");
      const index = history.indexOf(event);
      if (index > 0) {
        return history[index - 1].player == player;
      }
      return false;
    },
    async cost(event, trigger, player) {
      const source = trigger.player;
      const list = [["exclude", `令${get.translation(trigger.card)}无效`]];
      const cards2 = trigger.cards.filterInD();
      if (source.isIn() && cards2.length > 0) {
        list.push(["gain", `令${get.translation(source)}收回${get.translation(cards2)}`]);
      }
      const result = await player.chooseButton([get.prompt(event.skill, source), [list, "textbutton"], "noforcebutton"]).set("ai", (button) => {
        const player2 = get.player();
        const choice = button.link;
        const evt = _status.event.getTrigger();
        if (choice == "exclude") {
          let effect = 0;
          if (!evt.targets.length && get.info(evt.card, false).notarget) {
            effect -= get.effect(evt.player, evt.card, evt.player, player2);
          }
          for (const i of evt.targets) {
            effect -= get.effect(i, evt.card, evt.player, player2);
          }
          return effect;
        } else {
          const cards3 = evt.cards.filterInD();
          return get.value(cards3, evt.player) * get.attitude(player2, evt.player);
        }
      }).forResult();
      event.result = {
        bool: result.bool,
        cost_data: result.links
      };
    },
    logTarget: "player",
    async content(event, trigger, player) {
      if (!event.isMine() && !event.isOnline()) {
        await game.delayx();
      }
      if (event.cost_data[0] == "gain") {
        player.addTempSkill("dcchongwang_gain");
        trigger._dcchongwang = true;
      } else {
        trigger.targets.length = 0;
        trigger.all_excluded = true;
        game.log(trigger.card, "被无效了");
      }
    },
    ai: {
      threaten: 3.5,
      directHit_ai: true
    },
    subSkill: {
      gain: {
        trigger: { global: "useCardAfter" },
        charlotte: true,
        forced: true,
        popup: false,
        filter(event, player) {
          return event._dcchongwang;
        },
        async content(event, trigger, player) {
          trigger.player.gain(trigger.cards.filterInD(), "gain2");
        }
      }
    }
  },
  dchuagui: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    async cost(event, trigger, player) {
      const min = Math.max.apply(
        Math,
        game.filterPlayer().map((current) => 1 + current.getFriends().length)
      );
      const max = Math.min(
        min,
        game.countPlayer((current) => current != player && current.countCards("he") > 0)
      );
      event.result = await player.chooseTarget(get.prompt(event.skill), `令至多${get.cnNumber(max)}名角色进行囚徒困境选择`, [1, max], (card, player2, target) => {
        return target != player2 && target.countCards("he") > 0;
      }).set("animate", false).set("ai", (target) => {
        return -get.attitude(get.player(), target);
      }).forResult();
    },
    logLine: false,
    async content(event, trigger, player) {
      const targets = event.targets.sortBySeat();
      const shown = [], given = [];
      const map = await game.chooseAnyOL(targets, get.info(event.name).chooseButton, [player]).forResult();
      for (const target of targets) {
        target.addExpose(0.05);
        const { links } = map.get(target);
        let choice;
        if (links[0] == 0) {
          choice = "仅展示牌";
          shown.push([links[1], target, choice]);
        } else {
          choice = "交给牌";
          given.push([links[1], target, choice]);
        }
        target.popup(choice);
        game.log(target, "选择了", "#y" + choice);
      }
      if (shown.length) {
        await player.showCards(
          shown.flatMap((item) => item[0]),
          get.translation(player) + "发动了【化归】"
        ).set("customButton", (button) => {
          const target = get.owner(button.link);
          if (target) {
            game.createButtonCardsetion(target.getName(true), button);
          }
        }).set("delay_time", 4).set("multipleShow", true);
      }
      event.videoId = lib.status.videoId++;
      game.broadcastAll(
        (name, id, results) => {
          const dialog = ui.create.dialog(name + "发动了【化归】", "hidden", "forcebutton");
          dialog.videoId = id;
          dialog.classList.add("scroll1");
          dialog.classList.add("scroll2");
          dialog.classList.add("fullwidth");
          dialog.classList.add("fullheight");
          dialog.buttonss = [];
          const list2 = ["仅展示牌的玩家", "交出牌的玩家"];
          for (let i = 0; i < list2.length; i++) {
            dialog.add('<div class="text center">' + list2[i] + "</div>");
            const buttons = ui.create.div(".buttons", dialog.content);
            dialog.buttonss.push(buttons);
            buttons.classList.add("popup");
            buttons.classList.add("guanxing");
          }
          dialog.open();
          const getx = function() {
            const item = results.shift();
            const card = item[0], index = item[2] == "仅展示牌" ? 0 : 1;
            const button = ui.create.button(card, "card", dialog.buttonss[index]);
            game.createButtonCardsetion(item[1].getName(true), button);
            if (results.length > 0) {
              setTimeout(getx, 500);
            }
          };
          setTimeout(getx, 500);
        },
        get.translation(player),
        event.videoId,
        shown.concat(given)
      );
      await game.delay(0, 2e3 + (shown.length + given.length) * 500);
      game.broadcastAll("closeDialog", event.videoId);
      const list = given.length > 0 ? given : shown;
      const cards2 = list.flatMap((item) => item[0]);
      player.line(list.map((item) => item[1]));
      await player.gain(cards2, "give");
    },
    chooseButton(player, source, eventId) {
      const str = get.translation(source);
      return player.chooseButton(
        2,
        [
          `###${str}对你发动了【化归】，选择展示或交给其一张牌###<div class="text center">若所有人都选择了仅展示，则${str}获得这张牌</div>`,
          player.getCards("he"),
          [
            ["仅展示一张牌", `将一张牌交给${str}`].map((item, i) => {
              return [i, item];
            }),
            "textbutton"
          ]
        ],
        true
      ).set("filterButton", (button) => {
        const { link } = button;
        if (!ui.selected.buttons.length) {
          return typeof link == "number";
        }
        return get.itemtype(link) == "card";
      }).set("source", source).set("id", eventId).set("_global_waiting", true).set("ai", (button) => {
        const { player: player2, source: source2 } = get.event();
        const { link } = button;
        const att = get.attitude(player2, source2), hs = player2.getCards("he");
        hs.sort((b, a) => get.value(b, player2) - get.value(a, player2));
        if (!ui.selected.buttons.length) {
          if (att < -2 && Math.random() > (get.value(hs[0], player2) - 3) / 5 && link == 1) {
            return 2;
          }
          if (link == 0) {
            return 1;
          }
        } else {
          const choice = ui.selected.buttons[0].link;
          if (choice == 0) {
            return 6 - get.value(link);
          }
          return 6 + (att > 0 ? 1.5 : 0) - get.value(link);
        }
      });
    }
  },
  //陈珪
  dcyingtu: {
    audio: 2,
    trigger: {
      global: ["gainAfter", "loseAsyncAfter"]
    },
    usable: 1,
    getIndex(event, player) {
      var targets = [];
      if (lib.skill.dcyingtu.filterx(event, player, player.getNext())) {
        targets.add(player.getNext());
      }
      if (lib.skill.dcyingtu.filterx(event, player, player.getPrevious())) {
        targets.add(player.getPrevious());
      }
      return targets.sortBySeat(_status.currentPhase);
    },
    filterx(event, player, target) {
      var evt = event.getParent("phaseDraw");
      if (evt && target == evt.player) {
        return false;
      }
      return event.getg(target).length > 0 && target.hasCard(function(card) {
        return lib.filter.canBeGained(card, target, player);
      }, "he");
    },
    logTarget(event, player, triggername, target) {
      return target;
    },
    check(event, player, triggername, source) {
      var target = source == player.getNext() ? player.getPrevious() : player.getNext();
      return Math.min(0, get.attitude(player, target)) >= get.attitude(player, source);
    },
    prompt2: "获得该角色的一张牌，然后将一张牌交给该角色的对位角色。若你给出的是装备牌，则其使用其得到的牌。",
    async content(event, trigger, player) {
      let result;
      const target0 = event.targets[0];
      event.target = target0;
      const side = target0 == player.getPrevious() ? "getNext" : "getPrevious";
      event.side = side;
      await player.gainPlayerCard(target0, true, "he");
      const he = player.getCards("he");
      if (!he.length) {
        return;
      }
      const target = player[side]();
      event.target = target;
      if (he.length == 1) {
        result = { bool: true, cards: he };
      } else {
        result = await player.chooseCard("he", true, "交给" + get.translation(target) + "一张牌").forResult();
      }
      if (!result.bool) {
        return;
      }
      const card = result.cards[0];
      event.card = card;
      player.line(target);
      await player.give(card, target);
      if (target.getCards("h").includes(card) && get.type(card, null, target) == "equip" && target.canUse(card, target)) {
        await target.chooseUseTarget(card, true, "nopopup");
      }
    }
  },
  dccongshi: {
    audio: 2,
    trigger: { global: "useCardAfter" },
    forced: true,
    filter(event, player) {
      return get.type(event.card, null, false) == "equip" && event.player.isMaxEquip();
    },
    async content(event, trigger, player) {
      player.draw();
    }
  },
  //黄权
  dcquanjian: {
    audio: 2,
    enable: "phaseUse",
    usable: 2,
    filter(event, player) {
      return game.hasPlayer((current) => current != player);
    },
    chooseButton: {
      dialog(event, player) {
        var dialog = ui.create.dialog("劝谏：令一名其他角色…", "hidden");
        dialog.add([
          [
            ["damage", "对其攻击范围内的一名角色造成1点伤害"],
            ["draw", "将其手牌数调整至手牌上限（至多摸至五张），且其本回合内不能使用手牌"]
          ],
          "textbutton"
        ]);
        return dialog;
      },
      filter(button, player) {
        return !player.getStorage("dcquanjian_used").includes(button.link);
      },
      check: () => 1 + Math.random(),
      backup(links) {
        return get.copy(lib.skill["dcquanjian_" + links[0]]);
      },
      prompt(links) {
        if (links[0] == "damage") {
          return "令一名其他角色对攻击范围内的另一名角色造成1点伤害";
        }
        return "令一名其他角色将手牌数调整至手牌上限（至多摸至五张）且本回合内不能使用手牌";
      }
    },
    ai: {
      order: 2,
      result: { player: 1 }
    },
    subSkill: {
      backup: { audio: "dcquanjian" },
      used: {
        charlotte: true,
        onremove: true
      },
      damage: {
        audio: "dcquanjian",
        selectTarget: 2,
        filterTarget(card, player, target) {
          if (!ui.selected.targets.length) {
            return target != player;
          }
          return ui.selected.targets[0].inRange(target);
        },
        complexTarget: true,
        complexSelect: true,
        filterCard: () => false,
        selectCard: -1,
        targetprompt: ["造成伤害", "受到伤害"],
        multitarget: true,
        async content(event, trigger, player) {
          const { target, targets } = event;
          player.addTempSkill("dcquanjian_used", "phaseUseAfter");
          player.markAuto("dcquanjian_used", "damage");
          const result = await targets[0].chooseControl().set("choiceList", ["对" + get.translation(targets[1]) + "造成1点伤害", "本回合下次受到的伤害+1"]).set("ai", () => _status.event.eff >= 0 ? 0 : 1).set("eff", get.damageEffect(targets[1], targets[0], targets[0])).forResult();
          if (result.index == 0) {
            await targets[1].damage(targets[0]);
          } else {
            target.addMark("dcquanjian_effect", 1, false);
            target.addTempSkill("dcquanjian_effect");
          }
        },
        ai: {
          result: {
            player(player, target) {
              if (ui.selected.targets.length == 0) {
                if (!game.hasPlayer((current) => current.inRangeOf(target) && get.damageEffect(current, target, player) > 0)) {
                  return 0;
                }
                if (get.attitude(player, target) > 0) {
                  return 2;
                }
                return 1;
              }
              return get.damageEffect(target, ui.selected.targets[0], player, player);
            }
          }
        }
      },
      draw: {
        audio: "dcquanjian",
        filterTarget: lib.filter.notMe,
        filterCard: () => false,
        selectCard: -1,
        async content(event, trigger, player) {
          const { target } = event;
          let result;
          player.addTempSkill("dcquanjian_used", "phaseUseAfter");
          player.markAuto("dcquanjian_used", "draw");
          const num1 = target.countCards("h");
          const num2 = target.getHandcardLimit();
          let num = 0;
          if (num1 > num2) {
            event.index = 0;
            num = num1 - num2;
            result = await target.chooseControl().set("choiceList", ["弃置" + get.cnNumber(num) + "张手牌，且本回合内不能使用或打出手牌", "本回合下次受到的伤害+1"]).set("ai", () => {
              const event2 = get.event();
              const player2 = get.player();
              if (event2.number === 1 && player2.hasCard((card) => lib.filter.cardDiscardable(card, player2, "dcquanjian_draw") && get.value(card) < 5, "h")) {
                return 0;
              }
              return 1;
            }).set("number", num).forResult();
          } else {
            event.index = 1;
            num = Math.min(num2, 5) - num1;
            result = await target.chooseControl().set("choiceList", [(num > 0 ? "摸" + get.cnNumber(num) + "张牌且" : "") + "本回合内不能使用或打出手牌", "本回合下次受到的伤害+1"]).set("ai", () => get.event().idx).set("idx", num > 0 ? 0 : get.damageEffect(target, player, target) > 20 ? 0 : 1).forResult();
          }
          event.num = num;
          if (result.index == 0) {
            if (event.index == 0) {
              await target.chooseToDiscard("h", true, num, "allowChooseAll");
            } else {
              await target.draw(num);
            }
            target.addTempSkill("dcquanjian_disable");
          } else {
            target.addMark("dcquanjian_effect", 1, false);
            target.addTempSkill("dcquanjian_effect");
          }
        },
        ai: {
          result: {
            target(player, target) {
              var num1 = target.countCards("h"), num2 = target.getHandcardLimit();
              if (num1 > num2) {
                return -1;
              }
              return Math.min(5, num2) - num1;
            }
          }
        }
      },
      effect: {
        charlotte: true,
        trigger: { player: "damageBegin3" },
        forced: true,
        onremove: true,
        marktext: "谏",
        async content(event, trigger, player) {
          trigger.num += player.countMark(event.name);
          player.removeSkill(event.name);
        },
        intro: { content: "下次受到的伤害+#" },
        ai: { threaten: 2.5 }
      },
      disable: {
        charlotte: true,
        mod: {
          cardEnabled2(card, player) {
            if (get.position(card) == "h") {
              return false;
            }
          }
        },
        mark: true,
        marktext: "禁",
        intro: { content: "不能使用或打出手牌" },
        ai: { threaten: 2.5 }
      }
    }
  },
  dctujue: {
    audio: 2,
    trigger: { player: "dying" },
    limited: true,
    skillAnimation: true,
    animationColor: "gray",
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(lib.filter.notMe, get.prompt2(event.skill)).set("ai", (target) => {
        const { skip, player: player2 } = get.event();
        if (skip) {
          return 0;
        }
        return 200 + get.attitude(player2, target);
      }).set("skip", player.countCards("hs", { name: ["tao", "jiu"] }) + player.hp > 0).forResult();
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const {
        targets: [target]
      } = event;
      const cards2 = player.getCards("he");
      if (!cards2.length) {
        return;
      }
      const num = Math.max(5, cards2.length);
      await player.give(cards2, target);
      await player.recover(num);
      await player.draw(num);
    }
  },
  //尹夫人
  dcyingyu: {
    audio: 2,
    trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
    direct: true,
    filter(event, player) {
      if (event.name == "phaseJieshu" && !player.storage.dcyingyu) {
        return false;
      }
      return game.countPlayer(function(current) {
        return current.countCards("h") > 0;
      }) > 1;
    },
    async content(event, trigger, player) {
      const result = await player.chooseTarget(2, get.prompt("dcyingyu"), "展示两名角色的各一张手牌。若这两张牌花色不同，则你可以令其中一名角色获得另一名角色的展示牌。", function(card2, player2, target) {
        return target.countCards("h") > 0;
      }).set("ai", function(target) {
        let currentPlayer = _status.event.player;
        if (!ui.selected.targets.length) {
          return get.attitude(currentPlayer, target);
        }
        return 1 - get.attitude(currentPlayer, target);
      }).forResult();
      if (!result.bool) {
        return;
      }
      const targets = result.targets.sortBySeat();
      const cards2 = [];
      player.logSkill("dcyingyu", targets);
      let cardResult = await player.choosePlayerCard(targets[0], true, "h").forResult();
      let card = cardResult.cards[0];
      player.line(targets[0]);
      await player.showCards(card, get.translation(player) + "对" + get.translation(targets[0]) + "发动了【媵予】");
      cards2.push(card);
      cardResult = await player.choosePlayerCard(targets[1], true, "h").forResult();
      card = cardResult.cards[0];
      player.line(targets[1]);
      await player.showCards(card, get.translation(player) + "对" + get.translation(targets[1]) + "发动了【媵予】");
      cards2.push(card);
      if (get.suit(cards2[0], targets[0]) == get.suit(cards2[1], targets[1])) {
        return;
      }
      const str1 = get.translation(targets[0]), str2 = get.translation(targets[1]);
      const controlResult = await player.chooseControl("cancel2").set("choiceList", ["令" + str1 + "获得" + str2 + "的" + get.translation(cards2[1]), "令" + str2 + "获得" + str1 + "的" + get.translation(cards2[0])]).set("goon", get.attitude(player, targets[0]) > 0 ? 0 : 1).set("ai", () => _status.event.goon).forResult();
      if (controlResult.control != "cancel2") {
        const i = controlResult.index;
        await targets[1 - i].give(cards2[1 - i], targets[i], "give");
      }
    },
    onremove: true
  },
  dcyongbi: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.countCards("h") > 0 && game.hasPlayer((current) => lib.skill.dcyongbi.filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return target != player && target.hasSex("male");
    },
    selectCard: -1,
    filterCard: true,
    position: "h",
    limited: true,
    skillAnimation: true,
    animationColor: "fire",
    discard: false,
    lose: false,
    async content(event, trigger, player) {
      const cards2 = event.cards;
      const target = event.target;
      player.awakenSkill(event.name);
      await player.showCards(cards2, `${get.translation(player)}发动了〖${get.translation(event.name)}〗`);
      if (player.hasSkill("dcyingyu", null, null, false)) {
        player.storage.dcyingyu = true;
      }
      await player.give(cards2, target);
      const list = [];
      for (const card of cards2) {
        list.add(get.suit(card, player));
        if (list.length >= 3) {
          break;
        }
      }
      if (list.length >= 2) {
        player.addMark("dcyongbi_eff1", 2, false);
        player.addSkill("dcyongbi_eff1");
        target.addMark("dcyongbi_eff1", 2, false);
        target.addSkill("dcyongbi_eff1");
      }
      if (list.length >= 3) {
        player.addMark("dcyongbi_eff2", 1, false);
        player.addSkill("dcyongbi_eff2");
        target.addMark("dcyongbi_eff2", 1, false);
        target.addSkill("dcyongbi_eff2");
      }
    },
    ai: {
      order(item, player) {
        if (player.hasUnknown()) {
          return 0;
        }
        let list = [];
        for (let i of player.getCards("h")) {
          list.add(get.suit(i, player));
          if (list.length >= 3) {
            return 10;
          }
        }
        return 0;
      },
      result: {
        player: 1.8,
        target(player, target) {
          let zhu = get.zhu(player);
          if (zhu && get.attitude(player, zhu) > 0) {
            if (target == zhu) {
              return 4;
            }
          }
          return 1.8;
        }
      }
    },
    subSkill: {
      eff1: {
        mod: {
          maxHandcard: (player, num) => num + player.countMark("dcyongbi_eff1")
        },
        charlotte: true,
        onremove: true,
        marktext: "拥",
        intro: { content: "手牌上限+#" }
      },
      eff2: {
        audio: "dcyongbi",
        trigger: { player: "damageBegin4" },
        forced: true,
        filter(event, player) {
          return event.num > 1;
        },
        async content(event, trigger, player) {
          trigger.num -= player.countMark("dcyongbi_eff2");
        },
        charlotte: true,
        onremove: true,
        marktext: "嬖",
        intro: { content: "受到大于1的伤害时，此伤害-#" }
      }
    }
  },
  //吕旷吕翔
  dcshuhe: {
    audio: 2,
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
    check(cardx) {
      var player = _status.event.player;
      var num1 = get.number(cardx), players = game.filterPlayer();
      var goon = false, effect = 0;
      for (var current of players) {
        var cards2 = current.getCards("ej", function(card2) {
          var num = get.number(card2);
          return num == num1;
        });
        if (cards2.length) {
          goon = true;
          var att = get.attitude(player, current);
          for (var card of cards2) {
            if (get.position(card) == "e") {
              var val = get.value(card, current);
              if (att <= 0) {
                effect += val;
              } else {
                effect -= val / 2;
              }
            } else {
              var eff = get.effect(current, { name: card.viewAs || card.name }, player, player);
              effect -= get.sgn(att) * eff;
            }
          }
        }
      }
      if (goon) {
        if (effect > 0) {
          return 6 + effect - get.value(cardx);
        }
        return 0;
      }
      return game.hasPlayer(function(current2) {
        return current2 != player && get.attitude(player, current2) > 0;
      }) ? 6 - get.value(cardx) : 0;
    },
    async content(event, trigger, player) {
      const { cards: cards2 } = event;
      let result;
      await player.showCards(cards2, get.translation(player) + "发动了【数合】");
      player.addMark("dcliehou", 1);
      const cards22 = [];
      const num1 = get.number(cards2[0], player);
      const lose_list = [];
      const players = game.filterPlayer();
      for (const current of players) {
        const matched = current.getCards("ej", (card) => {
          const num = get.number(card);
          return num == num1;
        });
        if (matched.length > 0) {
          player.line(current, "thunder");
          current.$throw(matched);
          lose_list.push([current, matched]);
          cards22.addArray(matched);
        }
      }
      if (lose_list.length > 0) {
        await game.loseAsync({
          lose_list
        }).setContent("chooseToCompareLose");
        if (cards22.length > 0) {
          await game.delayx();
          await player.gain(cards22, "gain2");
        }
        return;
      }
      result = await player.chooseTarget(true, lib.filter.notMe, "将" + get.translation(cards2[0]) + "交给一名其他角色").set("ai", (target) => {
        return get.attitude(_status.event.player, target);
      }).forResult();
      if (result.bool) {
        const target = result.targets[0];
        player.line(target, "green");
        await player.give(cards2, target);
      }
    },
    ai: {
      order: 2,
      result: {
        player: 1
      }
    }
  },
  dcliehou: {
    audio: 2,
    trigger: { player: "phaseDrawBegin2" },
    forced: true,
    filter(event, player) {
      return !event.numFixed;
    },
    async content(event, trigger, player) {
      var num = Math.min(6, 1 + player.countMark("dcliehou"));
      trigger.num += num;
      trigger._dcliehou = num;
    },
    group: "dcliehou_discard",
    subSkill: {
      discard: {
        audio: "dcliehou",
        trigger: { player: "phaseDrawEnd" },
        forced: true,
        filter(event, player) {
          return typeof event._dcliehou == "number";
        },
        async content(event, trigger, player) {
          const num = trigger._dcliehou;
          const result = await player.chooseToDiscard(num, "he", "弃置" + get.cnNumber(num) + "张牌，或失去1点体力").set("ai", (card) => {
            if (_status.event.goon) {
              return 6 - get.value(card);
            }
            return 26 - get.value(card);
          }).set("goon", player.hp > Math.max(1, 4 - num) || get.effect(player, { name: "losehp" }, player, player) > 0).forResult();
          if (!result.bool) {
            player.loseHp();
          }
        }
      }
    },
    marktext: "爵",
    intro: {
      name: "列侯(爵)",
      name2: "爵",
      content: "〖列侯〗的摸牌数+#"
    }
  },
  //管亥
  suoliang: {
    audio: 2,
    trigger: { source: "damageSource" },
    logTarget: "player",
    usable: 1,
    filter(event, player) {
      return event.player != player && event.player.maxHp > 0 && event.player.countCards("he") > 0;
    },
    check(event, player) {
      return get.attitude(player, event.player) <= 0;
    },
    async content(event, trigger, player) {
      const target = trigger.player;
      const result = await player.choosePlayerCard(target, true, "he", [1, target.maxHp], "选择" + get.translation(target) + "的至多" + get.cnNumber(target.maxHp) + "张牌").forResult();
      if (result.bool) {
        await player.showCards(result.cards, get.translation(player) + "对" + get.translation(target) + "发动了【索粮】");
        const cards2 = result.cards.filter((card) => {
          const suit = get.suit(card, target);
          if (suit != "heart" && suit != "club") {
            return false;
          }
          return lib.filter.canBeGained(card, target, player);
        });
        if (cards2.length) {
          await player.gain(cards2, target, "giveAuto", "bySelf");
        } else {
          await target.modedDiscard(result.cards, player);
        }
      }
    }
  },
  qinbao: {
    audio: 2,
    trigger: { player: "useCard" },
    forced: true,
    filter(event, player) {
      return (event.card.name == "sha" || get.type(event.card, null, false) == "trick") && game.hasPlayer(function(current) {
        return current != player && current.countCards("h") >= player.countCards("h");
      });
    },
    async content(event, trigger, player) {
      var hs = player.countCards("h");
      trigger.directHit.addArray(
        game.filterPlayer(function(current) {
          return current != player && current.countCards("h") >= hs;
        })
      );
    },
    ai: {
      threaten: 1.4,
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        if (!arg?.target) {
          return false;
        }
        return player.countCards("h", function(card) {
          return !ui.selected.cards.includes(card);
        }) <= arg.target.countCards("h");
      }
    }
  },
  //胡昭
  midu: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    chooseButton: {
      dialog(event, player) {
        var dialog = ui.create.dialog("弥笃：选择要废除或恢复的装备栏或判定区", "hidden");
        dialog.classList.add("withbg");
        dialog.noforcebutton = true;
        var list1 = [], list2 = [];
        for (var i = 1; i < 6; i++) {
          for (var j = 0; j < player.countEnabledSlot(i); j++) {
            list1.push(i);
          }
          if (player.hasDisabledSlot(i)) {
            list2.push(i);
          }
        }
        (player.isDisabledJudge() ? list2 : list1).push(-1);
        var addTable = function(list, bool) {
          const adds = [];
          for (var i2 of list) {
            adds.push([[i2, bool], i2 > 0 ? get.translation("equip" + i2) + "栏" : "判定区"]);
          }
          dialog.add([adds, "tdnodes"]);
        };
        if (list1.length) {
          dialog.addText("未废除");
          addTable(list1, true);
        }
        if (list2.length) {
          dialog.addText("已废除");
          addTable(list2, false);
        }
        return dialog;
      },
      filter(button, player) {
        if (!ui.selected.buttons.length) {
          return true;
        }
        if (!ui.selected.buttons[0].link[1]) {
          return false;
        }
        return button.link[1];
      },
      check(button) {
        var player = _status.event.player;
        if (!button.link[1]) {
          if (button.link[0] <= 0) {
            return -10;
          }
          if (player.hasCard(function(card) {
            return get.subtype(card) == "equip" + button.link[0];
          }, "hs")) {
            return 15;
          }
          return 10;
        }
        if (button.link[0] <= 0 || player.hasEmptySlot(button.link[0]) && !player.hasCard(function(card) {
          return get.subtype(card) == "equip" + button.link[0] && player.canUse(card, player) && get.effect(player, card, player, player) > 0;
        }, "hs")) {
          return 5;
        }
        return 0;
      },
      select: [1, Infinity],
      backup(links, player) {
        if (!links[0][1]) {
          return {
            audio: "midu",
            selectCard: -1,
            selectTarget: -1,
            filterCard: () => false,
            filterTarget: () => false,
            equip: links[0][0],
            async content(event, trigger, player2) {
              var pos = lib.skill.midu_backup.equip;
              if (pos <= 0) {
                player2.enableJudge();
              } else {
                player2.enableEquip(pos);
              }
              player2.addTempSkills("rehuomo", { player: "phaseBegin" });
            }
          };
        } else {
          return {
            audio: "midu",
            selectCard: -1,
            filterCard: () => false,
            filterTarget: true,
            equip: links.map((i) => i[0]).sort(),
            async content(event, trigger, player2) {
              const list = lib.skill.midu_backup.equip;
              const num = list.length;
              let bool = false;
              if (list.includes(-1)) {
                list.remove(-1);
                bool = true;
              }
              if (list.length > 0) {
                player2.disableEquip(list);
              }
              if (bool) {
                player2.disableJudge();
              }
              event.target.draw(num);
            },
            ai: {
              tag: {
                draw: 1
              },
              result: {
                target: 2
              }
            }
          };
        }
      },
      prompt(links, player) {
        if (!links[0][1]) {
          return "恢复一个装备栏或判定区并获得〖活墨〗";
        }
        var numc = get.cnNumber(links.length);
        return "废除" + numc + "个区域并令一名角色摸" + numc + "张牌";
      }
    },
    derivation: "rehuomo",
    ai: {
      order: 8,
      result: { player: 1 }
    },
    subSkill: { backup: {} }
  },
  xianwang: {
    audio: 2,
    mod: {
      globalTo(source, player, distance) {
        var num = player.countDisabledSlot();
        if (num > 0) {
          return distance + (num > 2 ? 2 : 1);
        }
      },
      globalFrom(source, player, distance) {
        var num = source.countDisabledSlot();
        if (num > 0) {
          return distance - (num > 2 ? 2 : 1);
        }
      }
    },
    ai: {
      combo: "midu"
    }
  },
  //刘巴
  dczhubi: {
    audio: 2,
    trigger: {
      global: ["loseAfter", "loseAsyncAfter"]
    },
    filter(event, player) {
      if (event.type != "discard" || event.getlx === false) {
        return false;
      }
      for (var i of event.cards) {
        if (get.suit(i, event.player) == "diamond" && get.position(i) === "d") {
          return true;
        }
      }
      return false;
    },
    prompt2: "检索一张【无中生有】并置于牌堆顶",
    async content(event, trigger, player) {
      const card = get.cardPile(function(card2) {
        return card2.name == "wuzhong" && get.suit(card2) != "diamond";
      });
      if (card) {
        game.log(player, "将", card, "置于牌堆顶");
        await game.cardsGotoPile(card, "insert");
        await game.delayx();
      }
    }
  },
  dcliuzhuan: {
    audio: 2,
    group: ["dcliuzhuan_mark", "dcliuzhuan_gain"],
    mod: {
      targetEnabled(card) {
        if (card.cards) {
          for (var i of card.cards) {
            if (i.hasGaintag("dcliuzhuan_tag")) {
              return false;
            }
          }
        } else if (get.itemtype(card) == "card") {
          if (card.hasGaintag("dcliuzhuan_tag")) {
            return false;
          }
        }
      }
    },
    subSkill: {
      gain: {
        audio: "dcliuzhuan",
        trigger: { global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter"] },
        forced: true,
        logTarget: () => _status.currentPhase,
        filter(event, player) {
          var current = _status.currentPhase;
          if (!current) {
            return false;
          }
          if (event.name == "cardsDiscard") {
            var evtx = event.getParent();
            if (evtx.name != "orderingDiscard") {
              return false;
            }
            var evtx2 = evtx.relatedEvent || evtx.getParent();
            return current.hasHistory("lose", function(evtx3) {
              var evtx4 = evtx3.relatedEvent || evtx3.getParent();
              if (evtx2 != evtx4) {
                return false;
              }
              for (var i2 in evtx3.gaintag_map) {
                if (evtx3.gaintag_map[i2].includes("dcliuzhuan_tag")) {
                  return true;
                }
              }
            });
          } else if (event.name == "lose") {
            if (event.player != current || event.position != ui.discardPile) {
              return false;
            }
            for (var i in event.gaintag_map) {
              if (event.gaintag_map[i].includes("dcliuzhuan_tag")) {
                return true;
              }
            }
            return false;
          }
          return current.hasHistory("lose", function(evt) {
            if (evt.getParent() != event || evt.position != ui.discardPile) {
              return false;
            }
            for (var i2 in evt.gaintag_map) {
              if (evt.gaintag_map[i2].includes("dcliuzhuan_tag")) {
                return true;
              }
            }
          });
        },
        async content(event, trigger, player) {
          let cards2;
          const current = _status.currentPhase;
          if (trigger.name == "lose") {
            cards2 = trigger.hs.filter(function(i) {
              return trigger.gaintag_map[i.cardid] && trigger.gaintag_map[i.cardid].includes("dcliuzhuan_tag") && get.position(i, true) == "d";
            });
          } else if (trigger.name == "cardsDiscard") {
            const evtx = trigger.getParent();
            const evtx2 = evtx.relatedEvent || evtx.getParent();
            const history = current.getHistory("lose", function(evtx3) {
              const evtx4 = evtx3.relatedEvent || evtx3.getParent();
              if (evtx2 != evtx4) {
                return false;
              }
              for (const i in evtx3.gaintag_map) {
                if (evtx3.gaintag_map[i].includes("dcliuzhuan_tag")) {
                  return true;
                }
              }
            });
            cards2 = trigger.cards.filter(function(i) {
              for (const evt of history) {
                if (evt.gaintag_map[i.cardid] && evt.gaintag_map[i.cardid].includes("dcliuzhuan_tag") && get.position(i, true) == "d") {
                  return true;
                }
              }
              return false;
            });
          } else {
            cards2 = [];
            current.getHistory("lose", function(evt) {
              if (evt.getParent() != trigger || evt.position != ui.discardPile) {
                return false;
              }
              for (const card of evt.hs) {
                if (get.position(card, true) != "d") {
                  continue;
                }
                const i = card.cardid;
                if (evt.gaintag_map[i] && evt.gaintag_map[i].includes("dcliuzhuan_tag")) {
                  cards2.push(card);
                }
              }
            });
          }
          if (cards2 && cards2.length > 0) {
            await player.gain(cards2, "gain2");
          }
        }
      },
      mark: {
        trigger: { global: "gainBegin" },
        forced: true,
        popup: false,
        silent: true,
        lastDo: true,
        filter(event, player) {
          if (player == event.player || event.player != _status.currentPhase) {
            return false;
          }
          var evt = event.getParent("phaseDraw");
          if (evt && evt.name == "phaseDraw") {
            return false;
          }
          return true;
        },
        async content(event, trigger, player) {
          trigger.gaintag.add("dcliuzhuan_tag");
          trigger.player.addTempSkill("dcliuzhuan_tag");
        }
      },
      tag: {
        charlotte: true,
        onremove: (player, skill) => player.removeGaintag(skill)
      }
    }
  },
  //张勋
  suizheng: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "令一名角色下回合内获得〖随征〗效果").set("", (target) => {
        const player2 = get.player();
        const attitude = get.attitude(player2, target);
        if (target.hasJudge("lebu")) {
          return attitude / 2;
        }
        return attitude * get.threaten(target) * Math.sqrt(2 + (player2 === target ? player2.countCards("h", "sha") * 2 : target.countCards("h")));
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      target.addMark("suizheng_effect", 2, false);
      target.markAuto("suizheng_source", [player]);
      target.addTempSkill("suizheng_effect", {
        player: player === target ? "phaseJieshuBefore" : "phaseAfter"
      });
    },
    subSkill: {
      effect: {
        audio: "suizheng",
        charlotte: true,
        mod: {
          targetInRange(card) {
            if (card.name == "sha") {
              return true;
            }
          },
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + player.countMark("suizheng_effect");
            }
          }
        },
        trigger: { player: "phaseUseEnd" },
        forced: true,
        popup: false,
        filter(event, player) {
          const list = player.getStorage("suizheng_source");
          if (!list.some((current) => current.isIn())) {
            return false;
          }
          return player.hasHistory("sourceDamage", (evt) => {
            return evt.player.isIn() && evt.getParent("phaseUse") == event;
          });
        },
        async content(event, trigger, player) {
          const targets = player.getStorage("suizheng_source").slice(0).sortBySeat();
          event.targets = targets;
          for (const target of targets) {
            if (!target.isIn()) {
              continue;
            }
            const list = player.getHistory("sourceDamage", (evt) => {
              return evt.player.isIn() && evt.getParent("phaseUse") == trigger && target.canUse({ name: "sha", isCard: true }, evt.player, false);
            }).map((evt) => evt.player).toUniqued();
            if (!list.length) {
              continue;
            }
            const result = await target.chooseTarget("随征：是否对一名角色使用【杀】？", (card, player2, target2) => {
              return get.event().targets.includes(target2);
            }).set("targets", list).set("ai", (target2) => {
              const player2 = get.player();
              return get.effect(target2, { name: "sha" }, player2, player2);
            }).forResult();
            if (result?.bool) {
              await target.useCard({ name: "sha", isCard: true }, result.targets[0], false);
            }
          }
        },
        onremove(player) {
          delete player.storage.suizheng_effect;
          delete player.storage.suizheng_source;
        },
        intro: { content: `使用【杀】无距离限制且次数上限+#` }
      }
    }
  },
  //纪灵
  dcshuangren: {
    audio: "shuangren",
    trigger: { player: "phaseUseBegin" },
    direct: true,
    preHidden: true,
    filter(event, player) {
      return player.countCards("h") > 0 && game.hasPlayer(function(current) {
        return current != player && player.canCompare(current);
      });
    },
    async content(event, trigger, player) {
      var goon;
      if (player.needsToDiscard() > 1) {
        goon = player.hasCard(function(card) {
          return card.number > 10 && get.value(card) <= 5;
        });
      } else if (player.hasSha()) {
        goon = player.hasCard(function(card) {
          return card.number >= 9 && get.value(card) <= 5 || get.value(card) <= 3;
        });
      } else {
        goon = player.hasCard(function(card) {
          return get.value(card) <= 5;
        });
      }
      const compareTargetResult = await player.chooseTarget(get.prompt2("dcshuangren"), function(card, player2, target2) {
        return player2.canCompare(target2);
      }).set("ai", function(target2) {
        var player2 = _status.event.player;
        if (_status.event.goon && get.attitude(player2, target2) < 0) {
          return get.effect(target2, { name: "sha" }, player2, player2);
        }
        return 0;
      }).set("goon", goon).setHiddenSkill(event.name).forResult();
      if (!compareTargetResult.bool) {
        return;
      }
      const target = compareTargetResult.targets[0];
      player.logSkill("dcshuangren", target);
      const compareResult = await player.chooseToCompare(target).forResult();
      if (!compareResult.bool) {
        player.addTempSkill("dcshuangren_debuff", "phaseUseAfter");
        return;
      }
      if (game.hasPlayer(function(current) {
        if (target == current || target.group != current.group) {
          return false;
        }
        return player.canUse("sha", current, false);
      })) {
        var str = "请选择视为使用【杀】的目标";
        var str2 = "操作提示：选择一名角色B，或选择包含A（" + get.translation(target) + "）在内的两名角色A和B（B的势力需为" + get.translation(target.group) + "势力）";
        const useResult = await player.chooseTarget([1, 2], str, str2, true, function(card, player2, target2) {
          if (!player2.canUse("sha", target2, false)) {
            return false;
          }
          var current = _status.event.target;
          if (target2 == current) {
            return true;
          }
          if (target2.group != current.group) {
            return false;
          }
          if (!ui.selected.targets.length) {
            return true;
          }
          return ui.selected.targets[0] == current;
        }).set("ai", function(target2) {
          var player2 = _status.event.player;
          return get.effect(target2, { name: "sha" }, player2, player2);
        }).set("target", target).set("complexTarget", true).forResult();
        if (useResult.bool && useResult.targets && useResult.targets.length) {
          await player.useCard({ name: "sha", isCard: true }, useResult.targets, false);
        }
      } else {
        await player.useCard({ name: "sha", isCard: true }, target, false);
      }
    },
    subSkill: {
      debuff: {
        charlotte: true,
        mod: {
          cardEnabled(card) {
            if (card.name == "sha") {
              return false;
            }
          }
        }
      }
    }
  },
  //羊祜
  dcdeshao: {
    audio: 2,
    usable: 2,
    trigger: { target: "useCardToTargeted" },
    filter(event, player) {
      return player != event.player && get.color(event.card) == "black";
    },
    logTarget: "player",
    check(event, player) {
      var eff = get.effect(player, { name: "draw" }, player, player);
      if (player.countCards("h") + 1 <= event.player.countCards("h") && event.player.countCards("he") > 0) {
        eff += get.effect(event.player, { name: "guohe_copy2" }, player, player);
      }
      return eff;
    },
    async content(event, trigger, player) {
      await player.draw();
      var target = trigger.player;
      if (player.countCards("h") <= target.countCards("h") && target.countCards("he") > 0) {
        await player.discardPlayerCard(target, true, "he");
        player.addExpose(0.2);
      }
    }
  },
  dcmingfa: {
    audio: 2,
    trigger: { player: "useCardAfter" },
    direct: true,
    filter(event, player) {
      return player.isPhaseUsing() && (event.card.name == "sha" || get.type(event.card) == "trick") && event.cards.filterInD().length > 0 && !player.getExpansions("dcmingfa").length;
    },
    async content(event, trigger, player) {
      var str, cards2 = trigger.cards.filterInD(), card = trigger.card;
      if (cards2.length == 1 && card.name == cards2[0].name && (card.nature || false) == (cards2[0].nature || false)) {
        str = get.translation(cards2[0]);
      } else {
        str = get.translation(trigger.card) + "（" + get.translation(cards2) + "）";
      }
      var cardx = {
        name: trigger.card.name,
        nature: trigger.card.nature,
        isCard: true
      };
      const result = await player.chooseTarget(lib.filter.notMe, get.prompt("dcmingfa"), "将" + str + "作为“明伐”牌置于武将牌上，并选择一名其他角色。该角色下回合结束时对其执行〖明伐〗的后续效果。").set("card", cardx).set(
        "goon",
        (function() {
          var getMax = function(card2) {
            return Math.max.apply(
              Math,
              game.filterPlayer(function(current) {
                return current != player && lib.filter.targetEnabled2(card2, player, current);
              }).map(function(i) {
                return get.effect(i, card2, player, player) * Math.sqrt(Math.min(i.getHandcardLimit(), 1 + i.countCards("h")));
              }).concat([0])
            );
          };
          var eff1 = getMax(cardx);
          if (player.hasCard(function(card2) {
            if (card2.name != "sha" && get.type(card2) != "trick" || !player.hasValueTarget(card2, null, true)) {
              return false;
            }
            return getMax({
              name: get.name(card2),
              nature: get.nature(card2),
              isCard: true
            }) >= eff1;
          }, "hs")) {
            return false;
          }
          return true;
        })()
      ).set("ai", function(target2) {
        if (!_status.event.goon) {
          return 0;
        }
        var player2 = _status.event.player, card2 = _status.event.card;
        if (!lib.filter.targetEnabled2(card2, player2, target2)) {
          return 0;
        }
        return get.effect(target2, card2, player2, player2) * Math.sqrt(Math.min(target2.getHandcardLimit(), 1 + target2.countCards("h")));
      }).forResult();
      if (result.bool) {
        var target = result.targets[0];
        player.logSkill("dcmingfa", target);
        var card = {
          name: trigger.card.name,
          nature: trigger.card.nature,
          isCard: true
        };
        player.storage.dcmingfa_info = [card, target];
        player.addToExpansion(trigger.cards.filterInD(), "gain2").gaintag.add("dcmingfa");
      }
    },
    group: "dcmingfa_use",
    ai: { expose: 0.2 },
    intro: {
      mark(dialog, storage, player) {
        var cards2 = player.getExpansions("dcmingfa");
        if (!cards2.length) {
          return "没有“明伐”牌";
        } else {
          dialog.add(cards2);
        }
        var info = player.storage.dcmingfa_info;
        if (info) {
          dialog.addText("记录牌：" + get.translation(info[0]) + "<br>记录目标：" + get.translation(info[1]));
        }
      },
      content: "expansion"
    },
    onremove(player, skill) {
      var cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
      delete player.storage.dcmingfa_info;
    },
    subSkill: {
      use: {
        audio: "dcmingfa",
        trigger: { global: ["phaseEnd", "die"] },
        forced: true,
        filter(event, player) {
          if (!player.storage.dcmingfa_info || !player.getExpansions("dcmingfa").length) {
            return false;
          }
          return event.player == player.storage.dcmingfa_info[1];
        },
        async content(event, trigger, player) {
          const target = trigger.player;
          event.target = target;
          const card = player.storage.dcmingfa_info[0];
          delete player.storage.dcmingfa_info;
          event.card = card;
          const count = Math.max(1, Math.min(5, target.countCards("h")));
          if (event.player.isIn()) {
            for (let i = 0; i < count; i++) {
              if (target.isIn() && lib.filter.targetEnabled2(card, player, target)) {
                await player.useCard(get.copy(card), target);
              }
            }
          }
          const cards2 = player.getExpansions("dcmingfa");
          if (cards2.length > 0) {
            await player.loseToDiscardpile(cards2);
          }
        }
      }
    }
  },
  //蔡瑁张允
  lianzhou: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      if (!player.isLinked()) {
        return true;
      }
      return game.hasPlayer(function(current) {
        return current != player && current.hp == player.hp && !current.isLinked();
      });
    },
    async content(event, trigger, player) {
      let result;
      if (!player.isLinked()) {
        await player.link();
      }
      const num = game.countPlayer((current) => {
        return current != player && current.hp == player.hp && !current.isLinked();
      });
      if (num <= 0) {
        return;
      }
      result = await player.chooseTarget([1, num], "选择横置任意名体力值等于你的角色", function(card, player2, current) {
        return current != player2 && current.hp == player2.hp && !current.isLinked();
      }).set("ai", function(target) {
        const player2 = _status.event.player;
        return get.effect(target, { name: "tiesuo" }, player2, player2);
      }).forResult();
      if (result.bool) {
        const targets = result.targets.sortBySeat();
        player.line(targets, "green");
        for (const i of targets) {
          i.link();
        }
      }
    },
    ai: { halfneg: true }
  },
  jinglan: {
    audio: 2,
    trigger: { source: "damageSource" },
    forced: true,
    async content(event, trigger, player) {
      var delta = player.countCards("h") - player.hp;
      if (delta > 0) {
        player.chooseToDiscard("h", 4, true);
      } else if (delta == 0) {
        player.chooseToDiscard("he", true);
        player.recover();
      } else {
        player.damage("fire", "nosource");
        player.draw(5);
      }
    },
    ai: { halfneg: true }
  },
  //滕公主
  xingchong: {
    audio: 2,
    trigger: { global: "roundStart" },
    direct: true,
    filter(event, player) {
      return player.maxHp > 0;
    },
    async content(event, trigger, player) {
      var list = [];
      for (var i = 0; i <= Math.min(5, player.maxHp); i++) {
        list.push(get.cnNumber(i) + "张");
      }
      list.push("cancel2");
      const controlResult = await player.chooseControl(list).set("prompt", get.prompt("xingchong")).set("prompt2", "请首先选择摸牌的张数").set("ai", function() {
        var player2 = _status.event.player, num1 = player2.maxHp, num22 = player2.countCards("h");
        if (num1 <= num22) {
          return 0;
        }
        return Math.ceil((num1 - num22) / 2);
      }).forResult();
      if (controlResult.control == "cancel2") {
        return;
      }
      player.logSkill("xingchong");
      const num2 = controlResult.index;
      if (num2 > 0) {
        await player.draw(num2);
      }
      const num = Math.min(5, player.maxHp) - num2;
      if (num == 0) {
        return;
      }
      if (player.countCards("h") <= 0) {
        return;
      }
      const cardResult = await player.chooseCard("h", [1, Math.min(player.countCards("h"), num)], "请选择要展示的牌").set("ai", () => 1 + Math.random()).forResult();
      if (cardResult.bool) {
        var cards2 = cardResult.cards;
        player.showCards(cards2, get.translation(player) + "发动了【幸宠】");
        player.addGaintag(cards2, "xingchong");
        player.addTempSkill("xingchong_effect", "roundStart");
      }
    },
    subSkill: {
      effect: {
        audio: "xingchong",
        trigger: {
          player: ["loseAfter"],
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          var evt = event.getl(player);
          if (!evt || !evt.cards2 || !evt.cards2.length) {
            return false;
          }
          if (event.name == "lose") {
            for (var i in event.gaintag_map) {
              if (event.gaintag_map[i].includes("xingchong")) {
                return true;
              }
            }
            return false;
          }
          return player.hasHistory("lose", function(evt2) {
            if (event != evt2.getParent()) {
              return false;
            }
            for (var i2 in evt2.gaintag_map) {
              if (evt2.gaintag_map[i2].includes("xingchong")) {
                return true;
              }
            }
            return false;
          });
        },
        forced: true,
        popup: false,
        charlotte: true,
        onremove(player) {
          player.removeGaintag("xingchong");
        },
        async content(event, trigger, player) {
          if (trigger.delay === false) {
            await game.delayx();
          }
          player.logSkill("xingchong_effect");
          let num = 0;
          if (trigger.name === "lose") {
            for (const i in trigger.gaintag_map) {
              if (trigger.gaintag_map[i].includes("xingchong")) {
                num++;
              }
            }
          } else {
            player.getHistory("lose", (evt) => {
              if (trigger !== evt.getParent()) {
                return false;
              }
              for (const i in evt.gaintag_map) {
                if (evt.gaintag_map[i].includes("xingchong")) {
                  num++;
                }
              }
            });
          }
          await player.draw(2 * num);
        }
      }
    }
  },
  liunian: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    forced: true,
    filter(event, player) {
      return game.hasGlobalHistory("cardMove", function(evt) {
        return evt.washCard && (evt.shuffleNumber == 1 || evt.shuffleNumber == 2);
      });
    },
    async content(event, trigger, player) {
      if (game.hasGlobalHistory("cardMove", function(evt) {
        return evt.washCard && evt.shuffleNumber == 1;
      })) {
        player.gainMaxHp();
        await game.delayx();
      }
      if (game.hasGlobalHistory("cardMove", function(evt) {
        return evt.washCard && evt.shuffleNumber == 2;
      })) {
        player.recover();
        await game.delayx();
      } else {
        return;
      }
      player.addSkill("liunian_effect");
      player.addMark("liunian_effect", 10, false);
    },
    subSkill: {
      effect: {
        charlotte: true,
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("liunian_effect");
          }
        },
        marktext: "年",
        intro: {
          content: "手牌上限+#"
        }
      }
    }
  },
  //黄承彦
  dcjiezhen: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target != player;
    },
    async content(event, trigger, player) {
      const { target } = event;
      const skills2 = target.getSkills(null, false, false).filter((skill) => {
        if (skill == "bazhen") {
          return;
        }
        var info = get.info(skill);
        return info && !get.is.locked(skill) && !info.limited && !info.juexingji && !info.zhuSkill && !info.charlotte && !info.persevereSkill;
      });
      target.addAdditionalSkills("dcjiezhen_blocker", "bazhen");
      target.addSkill("dcjiezhen_blocker");
      target.markAuto("dcjiezhen_blocker", skills2);
      player.addSkill("dcjiezhen_clear");
      player.markAuto("dcjiezhen_clear", [target]);
    },
    ai: {
      order: 1,
      result: {
        target(player, target) {
          var skills2 = target.getSkills(null, false, false).filter(function(i) {
            if (i == "bazhen") {
              return;
            }
            var info = get.info(i);
            return info && !get.is.locked(i) && !info.limited && !info.juexingji && !info.zhuSkill && !info.charlotte && !info.persevereSkill;
          });
          if (!skills2.length && target.hasEmptySlot(2)) {
            return 1;
          }
          return -0.5 * skills2.length;
        }
      }
    },
    subSkill: {
      blocker: {
        init(player, skill) {
          player.addSkillBlocker(skill);
        },
        onremove(player, skill) {
          player.removeSkillBlocker(skill);
          player.removeAdditionalSkill(skill);
          delete player.storage.dcjiezhen_blocker;
        },
        charlotte: true,
        locked: true,
        skillBlocker(skill, player) {
          return skill != "bazhen" && skill != "dcjiezhen_blocker" && !lib.skill[skill].charlotte && !lib.skill[skill].persevereSkill && player.getStorage("dcjiezhen_blocker").includes(skill);
        },
        mark: true,
        marktext: "阵",
        intro: {
          markcount: () => 0,
          content(storage, player, skill) {
            if (storage.length) {
              return "失效技能：" + get.translation(storage);
            }
            return "无失效技能";
          }
        }
      },
      clear: {
        audio: "dcjiezhen",
        charlotte: true,
        trigger: {
          global: ["judgeAfter", "die"],
          player: "phaseBegin"
        },
        forced: true,
        forceDie: true,
        onremove: true,
        filter(event, player) {
          if (event.name == "die") {
            return player == event.player || player.getStorage("dcjiezhen_clear").includes(event.player);
          } else if (event.name == "judge") {
            return event.skill == "bagua" && player.getStorage("dcjiezhen_clear").includes(event.player);
          }
          return player.getStorage("dcjiezhen_clear").length > 0;
        },
        logTarget(event, player) {
          if (event.name != "phase") {
            return event.player;
          }
          return player.getStorage("dcjiezhen_clear");
        },
        async content(event, trigger, player) {
          const targets = player.getStorage("dcjiezhen_clear");
          if (trigger.name == "die" && player == trigger.player) {
            for (const target of targets) {
              target.removeSkill("dcjiezhen_blocker");
            }
            player.removeSkill("dcjiezhen_clear");
            return;
          }
          const list = trigger.name == "phase" ? targets.slice(0).sortBySeat() : [trigger.player];
          for (const target of list) {
            const storage = player.getStorage("dcjiezhen_clear");
            if (storage.includes(target)) {
              storage.remove(target);
              target.removeSkill("dcjiezhen_blocker");
              if (target.isIn() && target.countGainableCards(player, "hej") > 0) {
                await player.gainPlayerCard(target, "hej", true);
              }
            }
          }
          player.removeSkill("dcjiezhen_clear");
        }
      }
    },
    derivation: "bazhen"
  },
  dczecai: {
    audio: 2,
    trigger: { global: "roundEnd" },
    limited: true,
    skillAnimation: true,
    animationColor: "soil",
    getMax() {
      const getNum = function(current2) {
        var history = current2.actionHistory;
        var num = 0;
        for (var i = history.length - 1; i >= 0; i--) {
          for (var j = 0; j < history[i].useCard.length; j++) {
            if (get.type2(history[i].useCard[j].card, false) == "trick") {
              num++;
            }
          }
          if (history[i].isRound) {
            break;
          }
        }
        return num;
      };
      let max = 0, current = false, targets = game.filterPlayer();
      for (const target of targets) {
        const num = getNum(target);
        if (num > max) {
          max = num;
          current = target;
        } else if (num == max) {
          current = false;
        }
      }
      return current;
    },
    async cost(event, trigger, player) {
      const target = lib.skill.dczecai.getMax();
      let str = "令一名其他角色获得〖集智〗直到下一轮结束";
      if (target && target != player) {
        str += "；若选择的目标为" + get.translation(target) + "，则其获得一个额外的回合";
      }
      event.result = await player.chooseTarget(lib.filter.notMe, get.prompt(event.skill), str).set("maximum", event.target).set("ai", function(target2) {
        if (target2 != _status.event.maximum) {
          return 0;
        }
        return get.attitude(_status.event.player, target2);
      }).forResult();
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const target = event.targets[0];
      await target.addAdditionalSkills("dczecai_effect", "rejizhi");
      target.addTempSkill("dczecai_effect", "roundEnd");
      if (target == lib.skill.dczecai.getMax()) {
        target.insertPhase();
      }
    },
    derivation: "rejizhi",
    subSkill: {
      effect: {
        charlotte: true,
        mark: true,
        marktext: "才",
        intro: { content: "已拥有技能〖集智〗" }
      }
    }
  },
  dcyinshi: {
    audio: 2,
    trigger: { player: "damageBegin" },
    usable: 1,
    filter(event, player) {
      return !event.card || get.color(event.card) == "none";
    },
    forced: true,
    async content(event, trigger, player) {
      trigger.cancel();
    },
    group: "dcyinshi_gain",
    subSkill: {
      gain: {
        audio: "dcyinshi",
        trigger: { global: "judgeEnd" },
        forced: true,
        filter(event, player) {
          return event.skill == "bagua" && event.result.card && get.position(event.result.card, true) == "o";
        },
        async content(event, trigger, player) {
          player.gain(trigger.result.card, "gain2");
        }
      }
    }
  },
  //高览
  xizhen: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    direct: true,
    filter(event, player) {
      return game.hasPlayer(function(current) {
        return current != player && (player.canUse("sha", current, false) || player.canUse("juedou", current, false));
      });
    },
    async content(event, trigger, player) {
      const targetResult = await player.chooseTarget(get.prompt("xizhen"), "视为对一名角色使用【杀】或【决斗】", function(card, player2, target2) {
        return target2 != player2 && (player2.canUse("sha", target2, false) || player2.canUse("juedou", target2, false));
      }).set("ai", function(target2) {
        var player2 = _status.event.player;
        var eff1 = 0, eff2 = 0;
        if (player2.canUse("sha", target2, false)) {
          eff1 = get.effect(target2, { name: "sha" }, player2, player2);
        }
        if (player2.canUse("juedou", target2, false)) {
          eff2 = get.effect(target2, { name: "juedou" }, player2, player2);
        }
        var effx = Math.max(eff1, eff2);
        if (effx <= 0) {
          return 0;
        }
        if (target2.isHealthy()) {
          effx *= 3;
        }
        if (get.attitude(player2, target2) > 0) {
          effx *= 1.6;
        }
        return effx;
      }).forResult();
      if (!targetResult.bool) {
        return;
      }
      const target = targetResult.targets[0];
      player.logSkill("xizhen", target);
      const list = [];
      if (player.canUse("sha", target, false)) {
        list.push("sha");
      }
      if (player.canUse("juedou", target, false)) {
        list.push("juedou");
      }
      let control;
      if (list.length == 1) {
        control = list[0];
      } else {
        const controlResult = await player.chooseControl(list).set("prompt", "视为对" + get.translation(target) + "使用…").set("target", target).set("ai", function() {
          var player2 = _status.event.player, target2 = _status.event.target;
          var eff1 = get.effect(target2, { name: "sha" }, player2, player2), eff2 = get.effect(target2, { name: "juedou" }, player2, player2);
          return eff1 > eff2 ? 0 : 1;
        }).forResult();
        control = controlResult.control;
      }
      await player.useCard({ name: control, isCard: true }, target, false);
      if (target.isIn()) {
        player.storage.xizhen_effect = target;
        player.addTempSkill("xizhen_effect", "phaseUseAfter");
      }
    },
    subSkill: {
      effect: {
        audio: "xizhen",
        charlotte: true,
        onremove: true,
        trigger: { global: ["useCard", "respond"] },
        logTarget(event, player) {
          return player.storage.xizhen_effect;
        },
        forced: true,
        filter(event, player) {
          return Array.isArray(event.respondTo) && event.respondTo[0] == player && player.storage.xizhen_effect && player.storage.xizhen_effect.isIn();
        },
        async content(event, trigger, player) {
          const target = player.storage.xizhen_effect;
          await target.recover();
          await player.draw(target.isHealthy() ? 2 : 1);
        },
        mark: "character",
        intro: { content: "已指定$为目标" }
      }
    }
  },
  //管宁
  dunshi: {
    audio: 2,
    enable: ["chooseToUse", "chooseToRespond"],
    usable: 1,
    init(player, skill) {
      if (!player.storage[skill]) {
        player.storage[skill] = [["sha", "shan", "tao", "jiu"], 0];
      }
    },
    hiddenCard(player, name) {
      if (player.storage.dunshi && player.storage.dunshi[0].includes(name) && !player.getStat("skill").dunshi) {
        return true;
      }
      return false;
    },
    marktext: "席",
    mark: true,
    intro: {
      markcount(storage) {
        return storage[1];
      },
      content(storage, player) {
        if (!storage) {
          return;
        }
        var str = "<li>";
        if (!storage[0].length) {
          str += "已无可用牌";
        } else {
          str += "剩余可用牌：";
          str += get.translation(storage[0]);
        }
        str += "<br><li>“席”标记数量：";
        str += storage[1];
        return str;
      }
    },
    filter(event, player) {
      if (event.type == "wuxie") {
        return false;
      }
      var storage = player.storage.dunshi;
      if (!storage || !storage[0].length) {
        return false;
      }
      for (var i of storage[0]) {
        var card = { name: i, isCard: true };
        if (event.filterCard(card, player, event)) {
          return true;
        }
      }
      return false;
    },
    chooseButton: {
      dialog(event, player) {
        var list = [];
        var storage = player.storage.dunshi;
        for (var i of storage[0]) {
          list.push(["基本", "", i]);
        }
        return ui.create.dialog("遁世", [list, "vcard"], "hidden");
      },
      filter(button, player) {
        var evt = _status.event.getParent();
        return evt.filterCard({ name: button.link[2], isCard: true }, player, evt);
      },
      check(button) {
        var card = { name: button.link[2] }, player = _status.event.player;
        if (_status.event.getParent().type != "phase") {
          return 1;
        }
        if (card.name == "jiu") {
          return 0;
        }
        if (card.name == "sha" && player.hasSkill("jiu")) {
          return 0;
        }
        return player.getUseValue(card, null, true);
      },
      backup(links, player) {
        return {
          audio: "dunshi",
          filterCard() {
            return false;
          },
          popname: true,
          viewAs: {
            name: links[0][2],
            isCard: true
          },
          selectCard: -1,
          async precontent(event, trigger, player2) {
            player2.addTempSkill("dunshi_damage");
            player2.storage.dunshi_damage = event.result.card.name;
          }
        };
      },
      prompt(links, player) {
        return "选择【" + get.translation(links[0][2]) + "】的目标";
      }
    },
    ai: {
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        var storage = player.storage.dunshi;
        if (!storage || !storage[0].length) {
          return false;
        }
        if (player.getStat("skill").dunshi) {
          return false;
        }
        switch (tag) {
          case "respondSha":
            return (_status.event.type != "phase" || player == game.me || player.isUnderControl() || player.isOnline()) && storage[0].includes("sha");
          case "respondShan":
            return storage[0].includes("shan");
          case "save":
            if (arg == player && storage[0].includes("jiu")) {
              return true;
            }
            return storage[0].includes("tao");
        }
      },
      order: 2,
      result: {
        player(player) {
          if (_status.event.type == "dying") {
            return get.attitude(player, _status.event.dying);
          }
          return 1;
        }
      }
    },
    initList() {
      var list, skills2 = [], banned = [], bannedInfo = ["游戏开始时"];
      if (get.mode() == "guozhan") {
        list = [];
        for (var i in lib.characterPack.mode_guozhan) {
          list.push(i);
        }
      } else if (_status.connectMode) {
        list = get.charactersOL();
      } else {
        list = [];
        for (var i in lib.character) {
          if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) {
            continue;
          }
          list.push(i);
        }
      }
      for (var i of list) {
        if (i.indexOf("gz_jun") == 0) {
          continue;
        }
        for (var j of lib.character[i][3]) {
          var skill = lib.skill[j];
          if (!skill || skill.zhuSkill || banned.includes(j)) {
            continue;
          }
          if (skill.ai && (skill.ai.combo || skill.ai.neg)) {
            continue;
          }
          const infox = get.skillInfoTranslation(j);
          if (bannedInfo.some((item) => infox.includes(item))) {
            continue;
          }
          const info = get.plainText(get.translation(j));
          if ("仁/义/礼/智/信".split("/").some((item) => info.includes(item))) {
            skills2.add(j);
          }
        }
      }
      _status.dunshi_list = skills2;
    },
    subSkill: {
      backup: { audio: "dunshi" },
      damage: {
        audio: "dunshi",
        trigger: { global: "damageBegin2" },
        forced: true,
        charlotte: true,
        filter(event, player) {
          return event.source == _status.currentPhase;
        },
        onremove: true,
        logTarget: "source",
        async content(event, trigger, player) {
          const cardname = player.storage.dunshi_damage;
          player.removeSkill("dunshi_damage");
          const target = trigger.source;
          const card = get.translation(trigger.source), card2 = get.translation(cardname), card3 = get.translation(trigger.player);
          const list = ["防止即将对" + card3 + "造成的伤害，并令" + card + "获得一个技能名中包含“仁/义/礼/智/信”的技能", "从〖遁世〗中删除【" + card2 + "】并获得一枚“席”", "减1点体力上限，然后摸等同于“席”数的牌"];
          const result = await player.chooseButton([
            "遁世：请选择两项",
            [
              list.map((item, i2) => {
                return [i2, item];
              }),
              "textbutton"
            ]
          ]).set("forced", true).set("selectButton", 2).set("ai", function(button) {
            var player2 = _status.event.player;
            switch (button.link) {
              case 0:
                if (get.attitude(player2, _status.currentPhase) > 0) {
                  return 3;
                }
                return 0;
              case 1:
                return 1;
              case 2:
                var num = player2.storage.dunshi[1];
                for (var i2 of ui.selected.buttons) {
                  if (i2.link == 1) {
                    num++;
                  }
                }
                if (num > 0 && player2.isDamaged()) {
                  return 2;
                }
                return 0;
            }
          }).forResult();
          const links = result.links.sort();
          for (var i of links) {
            game.log(player, "选择了", "#g【遁世】", "的", "#y选项" + get.cnNumber(i + 1, true));
          }
          if (links.includes(0)) {
            trigger.cancel();
            if (!_status.dunshi_list) {
              lib.skill.dunshi.initList();
            }
            var skills2 = _status.dunshi_list.filter(function(i2) {
              return !target.hasSkill(i2, null, null, false);
            }).randomGets(3);
            if (skills2.length) {
              const videoId = lib.status.videoId++;
              var func = function(skills3, id, target2) {
                var dialog = ui.create.dialog("forcebutton");
                dialog.videoId = id;
                dialog.add("令" + get.translation(target2) + "获得一个技能");
                for (var i2 = 0; i2 < skills3.length; i2++) {
                  dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(skills3[i2]) + "】</div><div>" + lib.translate[skills3[i2] + "_info"] + "</div></div>");
                }
                dialog.addText(" <br> ");
              };
              if (player.isOnline()) {
                player.send(func, skills2, videoId, target);
              } else if (player == game.me) {
                func(skills2, videoId, target);
              }
              const controlResult = await player.chooseControl(skills2).set("ai", function() {
                var controls = _status.event.controls;
                if (controls.includes("cslilu")) {
                  return "cslilu";
                }
                if (controls.includes("zhichi")) {
                  return "zhichi";
                }
                return controls[0];
              }).forResult();
              game.broadcastAll("closeDialog", videoId);
              target.addSkills(controlResult.control);
            }
          }
          var storage = player.storage.dunshi;
          if (links.includes(1)) {
            storage[0].remove(cardname);
            storage[1]++;
            player.markSkill("dunshi");
          }
          if (links.includes(2)) {
            player.loseMaxHp();
            if (storage[1] > 0) {
              await player.draw(storage[1]);
            }
          }
        }
      }
    }
  },
  //吉本
  xunli: {
    audio: 2,
    trigger: { global: ["loseAfter", "loseAsyncAfter"] },
    forced: true,
    filter(event, player) {
      if (event.getParent("lieyi", true)) {
        return false;
      }
      if (event.type != "discard" || event.getlx === false || player.getExpansions("xunli").length >= 9) {
        return false;
      }
      return event.cards.some((card) => get.position(card, true) === "d" && get.color(card, event.cards2?.includes(card) ? event.player : false) === "black");
    },
    async content(event, trigger, player) {
      const num = 9 - player.getExpansions("xunli").length;
      if (num <= 0) {
        return;
      }
      const cards2 = trigger.cards.filter((card) => get.position(card, true) == "d" && get.color(card, trigger.cards2?.includes(card) ? trigger.player : false) == "black").randomGets(num);
      const next = player.addToExpansion("gain2", cards2);
      next.gaintag.add("xunli");
      await next;
    },
    marktext: "疠",
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    group: "xunli_exchange",
    subSkill: {
      exchange: {
        audio: "xunli",
        trigger: { player: "phaseUseBegin" },
        filter(event, player) {
          return player.hasExpansions("xunli") && player.hasCards("h", (card) => get.color(card, player) == "black");
        },
        async cost(event, trigger, player) {
          const cards2 = player.getExpansions("xunli");
          if (!cards2.length || !player.countCards("h")) {
            return;
          }
          const next = player.chooseToMove("寻疠：是否交换“疠”和黑色手牌？");
          next.set("list", [
            [get.translation(player) + "（你）的疠", cards2],
            ["手牌区", player.getCards("h", (card) => get.color(card, player) == "black")]
          ]);
          next.set("filterMove", (from, to) => typeof to != "number");
          next.set("processAI", (list) => {
            const player2 = _status.event.player;
            const getv = (card) => {
              if (get.info(card).toself) {
                return 0;
              }
              return player2.getUseValue(card, false);
            };
            const cards3 = list[0][1].concat(list[1][1]).sort((a, b) => getv(b) - getv(a));
            const cards22 = cards3.splice(0, player2.getExpansions("xunli").length);
            return [cards22, cards3];
          });
          const result = await next.forResult();
          event.result = {
            bool: result?.moved?.length > 0,
            cost_data: result?.moved
          };
        },
        async content(event, trigger, player) {
          const pushs = event.cost_data[0];
          const gains = event.cost_data[1];
          pushs.removeArray(player.getExpansions("xunli"));
          gains.removeArray(player.getCards("h"));
          if (!pushs.length || pushs.length != gains.length) {
            return;
          }
          const gain = player.addToExpansion(pushs, player, "giveAuto");
          gain.gaintag.add("xunli");
          await gain;
          game.log(player, "将", pushs, "作为“疠”置于武将牌上");
          await player.gain(gains, "gain2");
        }
      }
    },
    ai: { notemp: true }
  },
  zhishi: {
    audio: 2,
    trigger: { player: "phaseJieshuBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill)).set("ai", (target) => {
        const player2 = get.player();
        let att = get.attitude(player2, target);
        if (att <= 4) {
          return 0;
        }
        if (target.hasSkillTag("nogain")) {
          att /= 10;
        }
        return att;
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      player.addTempSkill("zhishi_mark", { player: "phaseBegin" });
      player.markAuto("zhishi_mark", [target]);
    },
    ai: {
      combo: "xunli",
      expose: 0.3
    },
    subSkill: {
      mark: {
        charlotte: true,
        onremove: true,
        mark: "characters",
        intro: { content: "决定帮助$，具体帮不帮另说" },
        trigger: { global: ["dying", "useCardToTargeted"] },
        filter(event, player) {
          if (!player.hasExpansions("xunli")) {
            return false;
          }
          const storage = player.getStorage("zhishi_mark");
          if (event.name == "dying") {
            return storage.includes(event.player);
          }
          return event.card.name == "sha" && storage.includes(event.target);
        },
        async cost(event, trigger, player) {
          const target = get.info(event.skill).logTarget(trigger, player);
          const result = await player.chooseButton([get.prompt(event.skill, target), '<div class="text center">弃置任意张“疠”并令其摸等量的牌</div>', player.getExpansions("xunli")], [1, Infinity], "allowChooseAll").set("ai", (button) => {
            const { player: player2, target: target2 } = get.event();
            const att = get.attitude(player2, target2);
            const card = button.link;
            if (att <= 0) {
              return 0;
            }
            if (target2.hp < 1 && target2 != get.zhu(player2)) {
              return 0;
            }
            if (target2.hasSkillTag("nogain")) {
              return 0;
            }
            return target2.getUseValue(card, false);
          }).forResult();
          event.result = {
            bool: result.bool,
            cost_data: result.links
          };
        },
        logTarget(event, player) {
          return event.name == "dying" ? event.player : event.target;
        },
        async content(event, trigger, player) {
          const target = event.targets[0];
          const links = event.cost_data;
          await player.loseToDiscardpile(links);
          await target.draw(links.length);
        }
      }
    }
  },
  lieyi: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.hasExpansions("xunli") && game.hasPlayer((current) => current != player);
    },
    filterTarget: lib.filter.notMe,
    async content(event, trigger, player) {
      const { target } = event;
      const cards2 = player.getExpansions("xunli");
      await player.showCards(cards2, `${get.translation(player)}对${get.translation(target)}发动了【烈医】`);
      let bool = false;
      while (true) {
        const cards3 = player.getExpansions("xunli");
        const cards22 = cards3.filter((card) => target.isIn() && player.canUse(card, target, false));
        if (cards22.length) {
          const result = await player.chooseButton([`请选择你要对${get.translation(target)}使用的一张牌`, cards22]).set("ai", (button) => {
            const { player: player2, target: target2 } = get.event();
            return get.effect(target2, button.link, player2, player2);
          }).set("target", target).forResult();
          if (result?.bool) {
            const next = player.useCard(result.links[0], target, false);
            await next;
            if (!bool && target.hasHistory("damage", (evt) => evt.getParent("lieyi") == next.getParent() && evt._dyinged)) {
              bool = true;
            }
            continue;
          }
        }
        if (cards3.length) {
          await player.loseToDiscardpile(cards3);
        }
        if (!bool) {
          await player.loseHp();
        }
        return;
      }
    },
    ai: {
      order(item, player) {
        return Math.max(get.order({ name: "sha" }), 2) - 0.2;
      },
      result: {
        target(player, target) {
          var cards2 = player.getExpansions("xunli");
          var effect = 0, damage = 0;
          for (var i of cards2) {
            if (player.canUse(i, target, false)) {
              effect += get.effect(target, i, player, target);
              damage += get.tag(i, "damage");
            }
          }
          if (damage >= target.hp) {
            return effect;
          }
          if (player.hp > 2 && cards2.length > 3) {
            return effect / 3;
          }
          return 0;
        }
      },
      combo: "xunli"
    }
  },
  //马日磾
  bingjie: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    check(event, player) {
      return player.maxHp > 3 && player.isDamaged() && player.hasCard(function(card) {
        return game.hasPlayer(function(current) {
          return current != player && get.attitude(player, current) < 0 && player.canUse(card, current, null, true) && get.effect(current, card, player, player) > 0;
        }) && player.hasValueTarget(card);
      }, "hs");
    },
    async content(event, trigger, player) {
      await player.loseMaxHp();
      player.addTempSkill("bingjie_effect");
      game.delayx();
    },
    subSkill: {
      effect: {
        audio: "bingjie",
        trigger: { player: "useCardToPlayered" },
        forced: true,
        charlotte: true,
        logTarget: "target",
        filter(event, player) {
          return event.target != player && (event.card.name == "sha" || get.type(event.card, null, false) == "trick") && event.target.countCards("he") > 0;
        },
        async content(event, trigger, player) {
          const result = await trigger.target.chooseToDiscard("he", true).forResult();
          if (result.bool && result.cards.length && get.color(result.cards[0], trigger.target) == get.color(trigger.card)) {
            game.log(trigger.target, "不能响应", trigger.card);
            trigger.directHit.push(trigger.target);
          }
        },
        ai: {
          effect: {
            player_use(card, player, target) {
              if (player !== target && get.itemtype(target) === "player" && (card.name === "sha" || get.type(card, null, false) === "trick") && target.countCards("he") && !target.hasSkillTag("noh")) {
                return [1, 0, 1, -1];
              }
            }
          }
        }
      }
    }
  },
  zhengding: {
    audio: 2,
    trigger: { player: ["useCard", "respond"] },
    forced: true,
    filter(event, player) {
      if (player == _status.currentPhase) {
        return false;
      }
      if (!Array.isArray(event.respondTo)) {
        return false;
      }
      if (player == event.respondTo[0]) {
        return false;
      }
      var color = get.color(event.card);
      if (color == "none") {
        return false;
      }
      return color == get.color(event.respondTo[1]);
    },
    async content(event, trigger, player) {
      player.gainMaxHp();
      await player.recover();
    }
  },
  //孙茹
  xiecui: {
    audio: 2,
    trigger: { global: "damageBegin1" },
    filter(event, player) {
      var source = event.source;
      if (!source || source != _status.currentPhase || event.getParent().type != "card") {
        return false;
      }
      return !source.hasHistory("sourceDamage", function(evt) {
        return evt.getParent().type == "card";
      });
    },
    logTarget: "source",
    prompt2(event, player) {
      var str = "令" + get.translation(event.player) + "即将受到的";
      str += "" + event.num + "点";
      if (event.hasNature("linked")) {
        str += get.translation(event.nature) + "属性";
      }
      str += "伤害+1";
      if (event.source.group == "wu") {
        var cards2 = event.cards.filterInD();
        if (cards2.length) {
          str += "；然后" + get.translation(event.source) + "获得" + get.translation(cards2) + "，且本回合的手牌上限+1";
        }
      }
      return str;
    },
    check(event, player) {
      var att = get.attitude(player, event.player);
      if (att < 0) {
        if (event.source.group != "wu" || !event.cards.filterInD().length) {
          return true;
        }
        return get.attitude(player, event.source) > 0;
      }
      return false;
    },
    async content(event, trigger, player) {
      trigger.num++;
      var source = trigger.source;
      if (source.group == "wu") {
        var cards2 = trigger.cards.filterInD();
        if (cards2.length > 0) {
          source.gain(cards2, "gain2");
          source.addMark("xiecui_effect", 1, false);
          source.addTempSkill("xiecui_effect");
        }
      }
    },
    subSkill: {
      effect: {
        charlotte: true,
        mod: {
          maxHandcard: (player, num) => num + player.countMark("xiecui_effect")
        },
        marktext: "翠",
        onremove: true,
        intro: { content: "手牌上限+#" }
      }
    },
    ai: { threaten: 1.75 }
  },
  youxu: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    logTarget: "player",
    filter(event, player) {
      return event.player.countCards("h") > event.player.hp;
    },
    check(event, player) {
      if (get.attitude(player, event.player) <= 0) {
        return true;
      } else {
        return game.hasPlayer(function(current) {
          return current != event.player && current.isDamaged() && current.isMinHp() && get.attitude(player, current) > 0 && get.recoverEffect(current, player, player) > 0;
        });
      }
    },
    async content(event, trigger, player) {
      const cardResult = player == trigger.player ? await player.chooseCard("h", true, "请展示一张手牌").forResult() : await player.choosePlayerCard(trigger.player, true, "h").forResult();
      if (!cardResult.bool) return;
      const card = cardResult.cards[0];
      var str = get.translation(player);
      if (player != trigger.player) {
        str += "对" + get.translation(trigger.player);
      }
      str += "发动了【忧恤】";
      player.showCards(card, str);
      if (!game.hasPlayer((current) => current != trigger.player)) return;
      const targetResult = await player.chooseTarget("令一名角色获得" + get.translation(card), "若其体力值为全场最少，则其回复1点体力", true, function(card2, player2, target2) {
        return target2 != _status.event.getTrigger().player;
      }).set("ai", function(target2) {
        var player2 = _status.event.player, att = get.attitude(player2, target2);
        if (att < 0) {
          return 0;
        }
        if (target2.isDamaged() && target2.isMinHp && get.recoverEffect(target2, player2, player2) > 0) {
          return 4 * att;
        }
        return att;
      }).forResult();
      if (!targetResult.bool) return;
      const target = targetResult.targets[0];
      player.line(target, "green");
      target.gain(card, trigger.player, "give").giver = player;
      if (target.isMinHp()) {
        target.recover();
      }
    }
  },
  //夏侯令女
  fuping: {
    audio: 2,
    hiddenCard(player, name) {
      var list = player.getStorage("fuping").slice(0);
      list.removeArray(player.getStorage("fuping_round"));
      return list.includes(name) && player.hasCard((card) => get.type(card) != "basic", "ehs");
    },
    enable: "chooseToUse",
    locked: false,
    filter(event, player) {
      var list = player.getStorage("fuping").slice(0);
      list.removeArray(player.getStorage("fuping_round"));
      if (!list.length) {
        return false;
      }
      if (!player.hasCard((card) => get.type(card) != "basic", "ehs")) {
        return false;
      }
      for (var i of list) {
        var type = get.type2(i, false);
        if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
          return true;
        }
      }
      return false;
    },
    chooseButton: {
      dialog(event, player) {
        var list = player.getStorage("fuping").slice(0);
        list.removeArray(player.getStorage("fuping_round"));
        var list2 = [];
        for (var i of list) {
          var type = get.type2(i, false);
          if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
            list2.push([type, "", i]);
          }
        }
        return ui.create.dialog("浮萍", [list2, "vcard"]);
      },
      check(button) {
        if (_status.event.getParent().type != "phase") {
          return 1;
        }
        return _status.event.player.getUseValue({ name: button.link[2] }, null, true);
      },
      backup(links, player) {
        return {
          audio: "fuping",
          filterCard: (card) => get.type(card) != "basic",
          position: "he",
          popname: true,
          viewAs: {
            name: links[0][2]
          },
          check(card) {
            return 8 - get.value(card);
          },
          async precontent(event, trigger, player2) {
            player2.addTempSkill("fuping_round");
            player2.markAuto("fuping_round", [event.result.card.name]);
          }
        };
      },
      prompt(links, player) {
        return "将一张非基本牌当做【" + get.translation(links[0][2]) + "】使用";
      }
    },
    ai: {
      order: 8,
      result: { player: 1 },
      respondSha: true,
      skillTagFilter(player) {
        var list = player.getStorage("fuping").slice(0);
        list.removeArray(player.getStorage("fuping_round"));
        return list.includes("sha");
      }
    },
    mod: {
      targetInRange(card, player, target) {
        if (!player.hasEnabledSlot()) {
          return true;
        }
      }
    },
    marktext: "萍",
    intro: { content: "已记录$" },
    group: "fuping_mark",
    subSkill: {
      mark: {
        audio: "fuping",
        trigger: { global: "useCardAfter" },
        filter(event, player) {
          return player != event.player && event.targets.includes(player) && player.hasEnabledSlot() && !player.getStorage("fuping").includes(event.card.name);
        },
        logTarget: "player",
        prompt2: (event) => "废除一个装备栏并记录【" + get.translation(event.card.name) + "】",
        check(event, player) {
          var list = ["tao", "juedou", "guohe", "shunshou", "wuzhong", "xietianzi", "yuanjiao", "wanjian", "nanman", "huoshaolianying", "chuqibuyi", "zhujinqiyuan", "lebu", "bingliang"];
          if (!list.includes(event.card.name)) {
            return false;
          }
          if (["nanman", "wanjian"].includes(event.card.name) && !player.hasValueTarget({ name: event.card.name })) {
            return false;
          }
          var list = [3, 5, 4, 1, 2];
          for (var i of list) {
            if (player.hasEnabledSlot(i)) {
              var card = player.getEquip(i);
              if (!card || player.hasEmptySlot(i)) {
                return true;
              }
              if (get.value(card, player) <= 0) {
                return true;
              }
            }
          }
          return false;
        },
        async content(event, trigger, player) {
          player.markAuto("fuping", [trigger.card.name]);
          game.log(player, "记录了", "#y" + get.translation(trigger.card.name));
          player.chooseToDisable().set("ai", function(event2, player2, list) {
            var list = [3, 5, 4, 1, 2];
            for (var i of list) {
              if (player2.hasEnabledSlot(i)) {
                var card = player2.getEquip(i);
                if (!card || player2.hasEmptySlot(i)) {
                  return "equip" + i;
                }
                if (get.value(card, player2) <= 0) {
                  return "equip" + i;
                }
              }
            }
            return list.randomGet();
          });
        }
      },
      backup: { audio: "fuping" },
      round: { charlotte: true, onremove: true }
    }
  },
  weilie: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.countMark("weilie_used") <= player.getStorage("fuping").length + 1 && player.countCards("he") > 0 && game.hasPlayer((current) => current.isDamaged());
    },
    filterCard: true,
    position: "he",
    filterTarget: (card, player, target) => target.isDamaged(),
    check(card) {
      return 8 - get.value(card);
    },
    async content(event, trigger, player) {
      const { target, name } = event;
      player.addSkill(name + "_used");
      player.addMark(name + "_used", 1, false);
      await target.recover();
      if (target.isDamaged()) {
        await target.draw(2);
      }
    },
    onremove: true,
    ai: {
      order: 1,
      result: {
        player(player, target) {
          var eff = get.recoverEffect(target, player, player);
          if (target.getDamagedHp() > 1) {
            eff += get.effect(target, { name: "draw" }, player, player);
          }
          return eff;
        }
      }
    },
    subSkill: {
      used: {
        charlotte: true,
        onremove: true,
        intro: { content: "本局游戏已发动#次【炜烈】" }
      }
    }
  },
  //张瑶
  //Partly powered by 烟雨墨染
  yuanyu: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    async content(event, trigger, player) {
      let result;
      await player.draw(2);
      if (player.countCards("h") > 0 && game.hasPlayer((current) => current != player)) {
        const suits = lib.suit.slice(0);
        const cards2 = player.getExpansions("yuanyu");
        for (const i of cards2) {
          suits.remove(get.suit(i, false));
        }
        let str = "选择一张手牌，作为“怨”置于武将牌上；同时选择一名其他角色，令该角色获得〖怨语〗的后续效果。";
        if (suits.length) {
          str += "目前“怨”中未包含的花色：";
          for (const i of suits) {
            str += get.translation(i);
          }
        }
        result = await player.chooseCardTarget({
          filterCard: true,
          filterTarget: lib.filter.notMe,
          position: "h",
          prompt: "怨语：选择置于武将牌上的牌和目标",
          prompt2: str,
          suits,
          forced: true,
          ai1(card) {
            const val = get.value(card);
            const evt = _status.event;
            if (evt.suits.includes(get.suit(card, false))) {
              return 8 - val;
            }
            return 5 - val;
          },
          ai2(target2) {
            const player2 = _status.event.player;
            if (player2.storage.yuanyu_damage && player2.storage.yuanyu_damage.includes(target2)) {
              return 0;
            }
            return -get.attitude(player2, target2);
          }
        }).forResult();
      } else {
        return;
      }
      const target = result.targets[0];
      player.addSkill("yuanyu_damage");
      player.markAuto("yuanyu_damage", result.targets);
      player.line(target, "green");
      if (!target.storage.yuanyu_mark) {
        target.storage.yuanyu_mark = player;
        target.markSkillCharacter("yuanyu_mark", player, "怨语", "已获得〖怨语〗效果");
        target.addSkill("yuanyu_mark");
      }
      const next = player.addToExpansion(result.cards, player, "give");
      next.gaintag.add("yuanyu");
      await next;
    },
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    onremove(player, skill) {
      var cards2 = player.getExpansions(skill);
      if (cards2.length) {
        player.loseToDiscardpile(cards2);
      }
      player.removeSkill("yuanyu_damage");
    },
    ai: {
      order: 7,
      result: {
        player: 1
      }
    },
    subSkill: {
      mark: {
        mark: "character",
        charlotte: true,
        intro: {
          content: "已获得〖怨语〗效果",
          onunmark: true
        }
      },
      damage: {
        trigger: { global: ["damageSource", "phaseDiscardBegin"] },
        forced: true,
        charlotte: true,
        onremove(player, skill) {
          if (player.storage[skill]) {
            for (var i of player.storage[skill]) {
              if (i.storage.yuanyu_mark == player) {
                i.unmarkSkill("yuanyu_mark");
              }
            }
          }
          delete player.storage[skill];
        },
        filter(event, player) {
          if (event.name == "damage") {
            var source = event.source;
            return source && player.getStorage("yuanyu_damage").includes(source) && source.countCards("h") > 0;
          } else {
            if (player == event.player) {
              return player.getStorage("yuanyu_damage").some(function(target) {
                return target.isIn() && target.countCards("h") > 0;
              });
            } else if (player.getStorage("yuanyu_damage").includes(event.player)) {
              return event.player.countCards("h") > 0;
            }
            return false;
          }
        },
        async content(event, trigger, player) {
          let targets;
          if (trigger.name == "phaseDiscard") {
            if (trigger.player == player) {
              targets = player.getStorage("yuanyu_damage").filter(function(target) {
                return target.isIn() && target.countCards("h") > 0;
              }).sortBySeat();
            } else {
              targets = [trigger.player];
            }
          } else {
            targets = [trigger.source];
          }
          while (targets.length) {
            const target = targets.shift();
            let count = trigger.name == "damage" ? trigger.num : 1;
            while (count > 0 && target.countCards("h") > 0) {
              count--;
              var suits = lib.suit.slice(0), cards2 = player.getExpansions("yuanyu");
              for (var i of cards2) {
                suits.remove(get.suit(i, false));
              }
              var next = target.chooseCard("h", true, "将一张手牌置于" + get.translation(player) + "的武将牌上");
              next.set("suits", suits);
              next.set("ai", function(card) {
                get.value(card);
                var evt = _status.event;
                if (evt.suits.includes(get.suit(card, false))) {
                  return 5 - get.value(card);
                }
                return 8 - get.value(card);
              });
              if (suits.length) {
                var str = "目前未包含的花色：";
                for (var i of suits) {
                  str += get.translation(i);
                }
                next.set("prompt2", str);
              }
              const result = await next.forResult();
              player.addToExpansion(result.cards, target, "give").gaintag.add("yuanyu");
              if (!player.hasSkill("yuanyu_damage")) {
                return;
              }
            }
          }
        }
      }
    }
  },
  xiyan: {
    audio: 2,
    trigger: { player: "addToExpansionAfter" },
    filter(event, player) {
      if (!event.gaintag.includes("yuanyu")) {
        return false;
      }
      var cards2 = player.getExpansions("yuanyu");
      if (cards2.length < lib.suit.length) {
        return false;
      }
      var suits = lib.suit.slice(0);
      for (var i of cards2) {
        suits.remove(get.suit(i));
        if (!suits.length) {
          return true;
        }
      }
      return false;
    },
    logTarget: () => _status.currentPhase,
    prompt2: "获得所有“怨”",
    check: () => true,
    async content(event, trigger, player) {
      let result;
      await player.removeSkill("yuanyu_damage");
      const cards2 = player.getExpansions("yuanyu");
      await player.gain(cards2, "gain2");
      const target = _status.currentPhase;
      if (player == target) {
        await player.addMark("xiyan_buff", 4, false);
        await player.addTempSkill("xiyan_buff");
        delete player.getStat("skill").yuanyu;
        return;
      }
      result = await player.chooseBool("夕颜：是否令" + get.translation(target) + "本回合的手牌上限-4且不能使用基本牌？").set("ai", () => _status.event.bool).set("bool", get.attitude(player, target) < 0).forResult();
      if (!result.bool) {
        return;
      }
      const target2 = _status.currentPhase;
      await target2.addMark("xiyan_debuff", 4, false);
      await target2.addTempSkill("xiyan_debuff");
    },
    subSkill: {
      buff: {
        charlotte: true,
        mark: true,
        marktext: " + ",
        intro: {
          content: "本回合手牌上限+#且使用牌无次数限制"
        },
        mod: {
          maxHandcard(player, num) {
            return num + player.countMark("xiyan_buff");
          },
          cardUsable(card, player) {
            return Infinity;
          }
        },
        sub: true
      },
      debuff: {
        charlotte: true,
        mark: true,
        marktext: " - ",
        intro: {
          content: "本回合手牌上限-#且不能使用基本牌"
        },
        mod: {
          maxHandcard(player, num) {
            return num - player.countMark("xiyan_debuff");
          },
          cardEnabled(card) {
            if (get.type(card) == "basic") {
              return false;
            }
          },
          cardSavable(card) {
            if (get.type(card) == "basic") {
              return false;
            }
          }
        },
        sub: true
      }
    },
    ai: {
      combo: "yuanyu"
    }
  },
  //滕胤
  chenjian: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    prompt2(event, player) {
      return "亮出牌堆顶的" + get.cnNumber(3 + player.countMark("chenjian")) + "张牌，然后执行以下一至两项：⒈弃置一张牌，然后令一名角色获得与你弃置牌花色相同的牌。⒉使用其中剩余的一张牌。若你执行了所有选项，则你获得一枚“陈见”并重铸所有手牌";
    },
    async content(event, trigger, player) {
      const cards2 = get.cards(3 + player.countMark("chenjian"));
      event.cards = cards2;
      await player.showCards(cards2, get.translation(player) + "发动了【陈见】");
      const list = [];
      if (player.countCards("he", (i) => {
        return lib.filter.cardDiscardable(i, player, "chenjian");
      })) {
        list.push("选项一");
      }
      if (event.cards.some((i) => {
        return player.hasUseTarget(i);
      })) {
        list.push("选项二");
      }
      let control;
      if (list.length === 1) {
        control = list[0];
      } else if (list.length > 1) {
        const result = await player.chooseControl(list).set("choiceList", ["弃置一张牌，然后令一名角色获得与你弃置牌花色相同的牌", "使用" + get.translation(event.cards) + "中的一张牌"]).set("prompt", "陈见：请选择一项").set("ai", () => {
          let player2 = _status.event.player, cards3 = _status.event.getParent().cards;
          if (cards3.some((i) => {
            return player2.getUseValue(i) > 0;
          })) {
            return "选项二";
          }
          return "选项一";
        }).forResult();
        control = result.control;
      } else {
        return;
      }
      let goon = 0;
      const choosed = control;
      if (choosed === "cancel2") {
        return;
      }
      let step = choosed === "选项二" ? 6 : 3;
      let shouldEnd = false;
      while (true) {
        if (step === 3) {
          if (player.countCards("he", (i) => {
            return lib.filter.cardDiscardable(i, player, "chenjian");
          })) {
            const result = await player.chooseToDiscard("he", !goon).set("ai", function(card) {
              let evt = _status.event.getParent(), val = goon && evt.player.countMark("chenjian") < 2 ? 0 : -get.value(card), suit2 = get.suit(card);
              for (let i of evt.cards) {
                if (get.suit(i, false) == suit2) {
                  val += get.value(i, "raw");
                }
              }
              return val;
            }).set("prompt", "陈见：" + (goon ? "是否" : "请") + "弃置一张牌，然后令一名角色获得" + get.translation(event.cards) + "中花色与之相同的牌" + (goon ? "？" : "")).forResult();
            if (!result.bool) {
              return;
            }
            goon++;
            const suit = get.suit(result.cards[0], player);
            const cards23 = event.cards.filter(function(i) {
              return get.suit(i, false) == suit;
            });
            if (cards23.length) {
              const targetResult = await player.chooseTarget(true, "选择一名角色获得" + get.translation(cards23)).set("ai", function(target) {
                let att = get.attitude(_status.event.player, target);
                if (att > 0) {
                  return att + Math.max(0, 5 - target.countCards("h"));
                }
                return att;
              }).forResult();
              if (targetResult.bool) {
                const target = targetResult.targets[0];
                player.line(target, "green");
                await target.gain(cards23, "gain2");
                event.cards.removeArray(cards23);
              }
              if (choosed === "选项二") {
                shouldEnd = true;
                break;
              }
              step = 6;
              continue;
            }
            if (choosed === "选项一") {
              step = 6;
              continue;
            }
            shouldEnd = true;
            break;
          }
          if (choosed === "选项一") {
            step = 6;
            continue;
          }
          return;
        }
        const cards22 = cards2.filter(function(i) {
          return player.hasUseTarget(i);
        });
        if (cards22.length) {
          const result = await player.chooseButton(["陈见：" + (goon ? "是否" : "请") + "使用其中一张牌" + (goon ? "？" : ""), cards22], !goon).set("ai", function(button) {
            return player.getUseValue(button.link);
          }).forResult();
          if (!result.bool) {
            return;
          }
          await player.chooseUseTarget(true, result.links[0], false);
          event.cards.removeArray(result.links);
          goon += 2;
          if (choosed === "选项二") {
            step = 3;
            continue;
          }
          shouldEnd = true;
          break;
        }
        if (choosed === "选项二") {
          step = 3;
          continue;
        }
        return;
      }
      if (shouldEnd && goon > 2) {
        if (player.countMark("chenjian") < 2) {
          player.addMark("chenjian", 1, false);
        }
        await player.recast(player.getCards("h", lib.filter.cardRecastable));
      }
    },
    marktext: "见",
    intro: { content: "展示牌数量+#" }
  },
  xixiu: {
    mod: {
      canBeDiscarded(card, player, target) {
        if (player != target && get.position(card) == "e" && target.countCards("e") == 1) {
          return false;
        }
      }
    },
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    forced: true,
    filter(event, player) {
      if (player == event.player || !player.countCards("e")) {
        return false;
      }
      var suit = get.suit(event.card, false);
      if (suit == "none") {
        return false;
      }
      return player.hasCard(function(card) {
        return get.suit(card, player) == suit;
      }, "e");
    },
    async content(event, trigger, player) {
      player.draw();
    },
    ai: {
      effect: {
        target_use(card, player, target) {
          if (typeof card == "object" && player != target) {
            var suit = get.suit(card);
            if (suit == "none") {
              return;
            }
            if (player.hasCard(function(card2) {
              return get.suit(card2, player) == suit;
            }, "e")) {
              return [1, 0.08];
            }
          }
        }
      }
    }
  },
  //张嫙
  tongli: {
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter(event, player) {
      if (!event.isFirstTarget || event.card.storage && event.card.storage.tongli) {
        return false;
      }
      var type = get.type(event.card);
      if (type != "basic" && type != "trick") {
        return false;
      }
      var hs = player.getCards("h");
      if (!hs.length) {
        return false;
      }
      var evt = event.getParent("phaseUse");
      if (!evt || evt.player != player) {
        return false;
      }
      var num1 = player.getHistory("useCard", function(evtx) {
        if (evtx.getParent("phaseUse") != evt) {
          return false;
        }
        return !evtx.card.storage || !evtx.card.storage.tongli;
      }).length;
      if (hs.length < num1) {
        return false;
      }
      var list = [];
      for (var i of hs) {
        list.add(get.suit(i, player));
      }
      return list.length == num1;
    },
    prompt2(event, player) {
      var evt = event.getParent("phaseUse");
      var num = player.getHistory("useCard", function(evtx) {
        if (evtx.getParent("phaseUse") != evt) {
          return false;
        }
        return !evtx.card.storage || !evtx.card.storage.tongli;
      }).length;
      var str = "额外结算" + get.cnNumber(num) + "次";
      if (event.card.name == "sha" && game.hasNature(event.card)) {
        str += get.translation(event.card.nature);
      }
      return str + "【" + get.translation(event.card.name) + "】";
    },
    check(event, player) {
      return !get.tag(event.card, "norepeat");
    },
    async content(event, trigger, player) {
      var evt = trigger.getParent("phaseUse");
      var num = player.getHistory("useCard", function(evtx) {
        if (evtx.getParent("phaseUse") != evt) {
          return false;
        }
        return true;
      }).length;
      trigger.getParent().effectCount += num;
    }
    /*subSkill:{
    	effect:{
    		trigger:{player:'useCardAfter'},
    		forced:true,
    		charlotte:true,
    		filter:function(event,player){
    			return event.tongli_effect!=undefined;
    		},
    		content:function(){
    			'step 0'
    			event.card=trigger.tongli_effect[0];
    			event.count=trigger.tongli_effect[1];
    			'step 1'
    			event.count--;
    			for(var i of trigger.targets){
    				if(!i.isIn()||!player.canUse(card,i,false)) return;
    			}
    			if(trigger.addedTarget&&!trigger.addedTarget.isIn()) return;
    			if(trigger.addedTargets&&trigger.addedTargets.length){
    				for(var i of trigger.addedTargets){
    					if(!i.isIn()) return;
    				}
    			}
    			var next=player.useCard(get.copy(card),trigger.targets,false);
    			if(trigger.addedTarget) next.addedTarget=trigger.addedTarget;
    			if(trigger.addedTargets&&trigger.addedTargets.length) next.addedTargets=trigger.addedTargets.slice(0);
    			if(event.count>0) event.redo();
    		},
    	},
    },*/
  },
  shezang: {
    audio: 2,
    round: 1,
    trigger: { global: "dying" },
    frequent: true,
    filter(event, player) {
      return event.player == player || player == _status.currentPhase;
    },
    async content(event, trigger, player) {
      var cards2 = [];
      for (var i of lib.suit) {
        var card = get.cardPile2(function(card2) {
          return get.suit(card2, false) == i;
        });
        if (card) {
          cards2.push(card);
        }
      }
      if (cards2.length) {
        player.gain(cards2, "gain2");
      }
    }
  },
  //王桃王悦
  huguan: {
    audio: 2,
    audioname: ["wangyue"],
    init(player) {
      game.addGlobalSkill("huguan_all");
    },
    trigger: { global: "useCard" },
    direct: true,
    filter(event, player) {
      if (get.color(event.card, false) != "red") {
        return false;
      }
      var evt = event.getParent("phaseUse");
      if (!evt || evt.player != event.player) {
        return false;
      }
      return event.player.getHistory("useCard", function(event2) {
        return event2.getParent("phaseUse") == evt;
      }).indexOf(event) === 0;
    },
    async content(event, trigger, player) {
      const result = await player.chooseControl(lib.suit, "cancel2").set("prompt", get.prompt("huguan", trigger.player)).set("prompt2", "令某种花色的手牌不计入其本回合的手牌上限").set("ai", function() {
        var player2 = _status.event.player, target = _status.event.getTrigger().player, att = get.attitude(player2, target);
        if (att <= 0) {
          if (!player2.hasSkill("yaopei") || target.isDamaged() || !player2.countCards("he") || target.needsToDiscard() - target.needsToDiscard(-target.countCards("h") / 4) > (att > -2 ? 1.6 : 1)) {
            return "cancel2";
          }
        }
        let list = lib.suit.slice(0);
        if (att <= 0 && target.getStorage("huguan_add")) {
          for (let i of target.getStorage("huguan_add")) {
            if (list.includes(i)) {
              return i;
            }
          }
        }
        list.removeArray(target.getStorage("huguan_add"));
        if (list.length) {
          return list.randomGet();
        }
        return "cancel2";
      }).forResult();
      if (result.control != "cancel2") {
        const target = trigger.player;
        player.logSkill("huguan", target);
        game.log(player, "选择了", "#g" + get.translation(result.control), "花色");
        target.addTempSkill("huguan_add");
        target.markAuto("huguan_add", [result.control]);
      }
    },
    subSkill: {
      add: {
        charlotte: true,
        onremove: true,
        mod: {
          ignoredHandcard(card, player) {
            if (player.getStorage("huguan_add").includes(get.suit(card, player))) {
              return true;
            }
          },
          cardDiscardable(card, player, name) {
            if (name == "phaseDiscard" && player.getStorage("huguan_add").includes(get.suit(card, player))) {
              return false;
            }
          }
        },
        intro: { content: "本回合$花色的牌不计入手牌上限" }
      },
      all: {
        mod: {
          aiValue(player, card, num) {
            if (player && player.storage.huguan_all > 0 && get.itemtype(card) == "card" && get.color(card, player) == "red") {
              return num + player.storage.huguan_all;
            }
          }
        },
        trigger: {
          player: ["phaseUseBegin", "useCard"]
        },
        filter(event, player) {
          if (event.name === "useCard") {
            return player.storage.huguan_all;
          }
          return true;
        },
        silent: true,
        charlotte: true,
        async content(event, trigger, player) {
          let num = -157;
          if (trigger.name === "useCard") {
            player.storage.huguan_all = 0;
            return;
          }
          game.countPlayer((current) => {
            if (current.hasSkill("huguan")) {
              num = Math.max(num, get.attitude(_status.event.player, current));
            }
          }, true);
          if (num === -157) {
            game.removeGlobalSkill("huguan_all");
          } else if (num === 0) {
            player.storage.huguan_all = 6;
          } else if (num > 0) {
            player.storage.huguan_all = 9;
          }
        }
      }
    }
  },
  yaopei: {
    audio: 2,
    trigger: { global: "phaseDiscardEnd" },
    direct: true,
    filter(event, player) {
      if (player == event.player || !event.player.isIn() || !player.countSkill("huguan")) {
        return false;
      }
      var suits = [];
      event.player.getHistory("lose", function(evt) {
        if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) {
          for (var i of evt.cards2) {
            suits.add(get.suit(i, evt.hs.includes(i) ? evt.player : false));
          }
        }
      });
      if (suits.length >= lib.suit.length) {
        return false;
      }
      if (_status.connectMode && player.countCards("h") > 0) {
        return true;
      }
      return player.hasCard(function(card) {
        return !suits.includes(get.suit(card));
      }, "he");
    },
    async content(event, trigger, player) {
      const suits = [];
      trigger.player.getHistory("lose", function(evt) {
        if (evt.type == "discard" && evt.getParent("phaseDiscard") == trigger) {
          for (var i of evt.cards2) {
            suits.add(get.suit(i, evt.hs.includes(i) ? evt.player : false));
          }
        }
      });
      const result = await player.chooseCardTarget({
        prompt: get.prompt("yaopei", trigger.player),
        prompt2: "操作提示：选择要弃置的牌，并选择执行摸牌选项的角色，另一名角色执行回复体力的选项。",
        suits,
        position: "he",
        filterCard(card, player2) {
          return !_status.event.suits.includes(get.suit(card)) && lib.filter.cardDiscardable(card, player2, "yaopei");
        },
        filterTarget(card, player2, target) {
          return target == player2 || target == _status.event.getTrigger().player;
        },
        ai1(card) {
          let player2 = _status.event.player, source = _status.event.getTrigger().player;
          if (get.attitude(player2, source) > 0 && (get.recoverEffect(player2, player2, player2) > 0 || get.recoverEffect(source, player2, player2) > 0)) {
            return 12 - get.value(card);
          }
          return 8 - get.value(card);
        },
        ai2(target) {
          let player2 = _status.event.player, source = _status.event.getTrigger().player;
          let recoverer = player2 === target ? source : player2;
          if (recoverer.isHealthy()) {
            return get.attitude(player2, target);
          }
          let att = get.attitude(player2, recoverer), rec = get.recoverEffect(recoverer, player2, player2);
          if (rec > 0) {
            return Math.abs(att) + get.attitude(player2, target);
          }
          return 0;
        }
      }).forResult();
      if (result.bool) {
        const target = trigger.player;
        player.logSkill("yaopei", target);
        await player.discard(result.cards);
        if (player == result.targets[0]) {
          if (target.isDamaged() && target.hp < player.hp && (get.mode() != "identity" || player.identity != "nei")) {
            player.addExpose(0.15);
          }
          await target.recover();
          await player.draw(2);
        } else {
          if ((player.isHealthy() || player.hp > target.hp) && (get.mode() != "identity" || player.identity != "nei")) {
            player.addExpose(0.15);
          }
          await target.draw(2);
          await player.recover();
        }
      }
    },
    ai: {
      combo: "huguan"
    }
  },
  mingluan: {
    audio: 2,
    trigger: { global: "phaseJieshuBegin" },
    direct: true,
    filter(event, player) {
      const bool = game.getGlobalHistory("changeHp", (evt) => evt.getParent().name == "recover" && evt.changedHp > 0).length;
      return player != event.player && event.player.isIn() && bool && player.hasCards("he");
    },
    async content(event, trigger, player) {
      let he = player.getCards("he"), disval = 0, dis = 0, spare = 30, use = true;
      for (let i of he) {
        let val = get.value(i, player);
        if (val < 6 && get.position(i) == "h") {
          dis++;
          disval += val;
        } else if (val < spare) {
          spare = val;
        }
      }
      if (!dis) {
        dis = 1;
        disval = spare;
        spare = -1;
      }
      let draw = Math.min(trigger.player.countCards("h"), 5 + dis - player.countCards("h"));
      if (6 * draw < disval) {
        use = false;
      }
      const next = player.chooseToDiscard("he", get.prompt("mingluan"), "弃置任意张牌，并摸等同于" + get.translation(trigger.player) + "手牌数的牌（至多摸至五张）", [1, Infinity], "allowChooseAll");
      next.set("ai", function(card) {
        let val = get.value(card, player);
        if (val < 0 && card.name !== "du") {
          return 30;
        }
        if (!_status.event.use) {
          return 0;
        }
        if (ui.selected.cards.length) {
          if (get.position(card) !== "h") {
            return 0;
          }
          return 6 - val;
        }
        if (_status.event.spare < 0 || get.position(card) === "h") {
          return 30 - val;
        }
        return 0;
      }).set("spare", spare).set("use", use);
      next.logSkill = ["mingluan", trigger.player];
      const result = await next.forResult();
      if (result.bool) {
        const num = trigger.player.countCards("h"), num2 = 5 - player.countCards("h");
        if (num > 0 && num2 > 0) {
          await player.draw(Math.min(num, num2));
        }
      }
    }
  },
  //赵嫣
  jinhui: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    manualConfirm: true,
    async content(event, trigger, player) {
      const cards2 = [];
      while (cards2.length < 3) {
        const card = get.cardPile2((card2) => {
          if (cards2.some((cardx) => cardx.name == card2.name)) {
            return false;
          }
          const info = get.info(card2, false);
          if (info.ai && info.ai.tag && info.ai.tag.damage) {
            return false;
          }
          return !info.notarget && (info.toself || info.singleCard || !info.selectTarget || info.selectTarget == 1);
        });
        if (card) {
          cards2.push(card);
        } else {
          break;
        }
      }
      if (!cards2.length) {
        return;
      }
      await player.showCards(cards2, `${get.translation(player)}发动了【锦绘】`);
      await game.cardsGotoOrdering(cards2);
      if (!game.hasPlayer((current) => current !== player)) {
        return;
      }
      let result = await player.chooseTarget({
        prompt: "选择【锦绘】的目标",
        filterTarget: lib.filter.notMe,
        forced: true,
        ai(target2) {
          const event2 = get.event();
          const cards3 = event2.getParent().cards.slice(0);
          let max_effect = 0;
          let max_effect_player = 0;
          for (const card of cards3) {
            const targetx = lib.skill.jinhui.getUsableTarget(card, target2, player);
            if (targetx) {
              const effect2 = get.effect(targetx, card, target2, target2);
              const effect3 = get.effect(targetx, card, target2, player);
              if (effect2 > max_effect) {
                max_effect = effect2;
                max_effect_player = effect3;
              }
            }
          }
          return max_effect_player;
        }
      }).forResult();
      if (!result?.bool || !result.targets?.length) {
        return;
      }
      const target = result.targets[0];
      player.line(target, "green");
      const targetCards = cards2.filter((card) => lib.skill.jinhui.getUsableTarget(card, target, player));
      if (targetCards.length) {
        if (targetCards.length == 1) {
          result = { bool: true, links: targetCards };
        } else {
          result = await target.chooseButton({
            createDialog: ["选择按“锦绘”规则使用一张牌", targetCards],
            forced: true,
            ai(button) {
              const event2 = get.event();
              const player2 = get.player();
              const target2 = event2.getParent().player;
              const card = button.link;
              const targetx = lib.skill.jinhui.getUsableTarget(card, player2, target2);
              const effect = get.effect(targetx, card, player2, player2);
              const cards3 = event2.getParent().cards.slice(0);
              let effect2 = 0;
              let effect3 = 0;
              cards3.remove(button.link);
              for (const card2 of cards3) {
                const targetx2 = lib.skill.jinhui.getUsableTarget(card2, target2, player2);
                if (targetx2) {
                  effect2 += get.effect(targetx2, card2, target2, target2);
                  effect3 += get.effect(targetx2, card2, target2, player2);
                }
              }
              if (effect2 > 0) {
                effect += effect3;
              }
              return effect;
            }
          }).forResult();
        }
        if (result?.bool) {
          const card = result.links[0];
          cards2.remove(card);
          const targetx = lib.skill.jinhui.getUsableTarget(card, target, player);
          await target.useCard({
            card,
            targets: [targetx],
            addCount: false,
            noai: true
          });
        }
      }
      const selfCards = cards2.filter((card) => lib.skill.jinhui.getUsableTarget(card, player, target));
      while (selfCards.length) {
        result = await player.chooseButton({
          createDialog: ["是否按“锦绘”规则使用其中一张牌？", selfCards],
          ai(button) {
            const { player: player2, target: target2 } = get.event();
            const card2 = button.link;
            const targetx2 = lib.skill.jinhui.getUsableTarget(card2, player2, target2);
            return get.effect(targetx2, card2, player2, player2);
          }
        }).set("target", target).forResult();
        if (!result?.bool) {
          return;
        }
        const card = result.links[0];
        selfCards.remove(card);
        const targetx = lib.skill.jinhui.getUsableTarget(card, player, target);
        if (targetx) {
          await player.useCard({
            card,
            targets: [targetx],
            addCount: false,
            noai: true
          });
        }
      }
    },
    getUsableTarget(card, player, target) {
      const info = get.info(card, false);
      if (info.toself) {
        return player.canUse(card, player, false) ? player : false;
      }
      return target?.isIn() && player.canUse(card, target, false) ? target : false;
    },
    ai: {
      order: 5,
      result: { player: 1 }
    }
  },
  qingman: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    forced: true,
    logTarget: "player",
    filter(event, player) {
      if (!event.player.isIn()) {
        return false;
      }
      var num = player.countCards("h");
      if (num >= 5) {
        return false;
      }
      var num2 = 0;
      for (var i = 1; i <= 5; i++) {
        num2 += event.player.countEmptySlot(i);
      }
      return num < num2;
    },
    async content(event, trigger, player) {
      var num2 = 0;
      for (var i = 1; i <= 5; i++) {
        num2 += trigger.player.countEmptySlot(i);
      }
      player.drawTo(num2);
    }
  },
  //何晏
  yachai: {
    audio: 2,
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return event.source && event.source.isIn();
    },
    logTarget: "source",
    check(event, player) {
      if (get.attitude(player, event.source) <= 0) {
        return true;
      }
      return event.source.countCards("h") < Math.sqrt(event.source.getHp());
    },
    async content(event, trigger, player) {
      const target = trigger.source, str = get.translation(player);
      const th = target.countCards("h");
      const num = Math.ceil(th / 2);
      let result;
      if (th > 0) {
        const list = ["本回合不能使用手牌，然后" + str + "摸两张牌", "展示所有手牌，并将其中一种花色的所有牌交给" + str, "弃置" + get.cnNumber(num) + "张手牌"];
        result = await target.chooseControl().set("choiceList", list).set("ai", () => get.event().idx).set(
          "idx",
          (function() {
            let att = get.sgn(get.attitude(target, player)), use = get.effect(player, { name: "draw" }, player, target) * 1.5, give = {}, discard = [];
            target.countCards("h", (i) => {
              discard.add(i);
              let suit = get.suit(i, target), val = target.getUseValue(i, null, true);
              give[suit] ??= 0;
              give[suit] += get.value(i);
              if (val > 1) {
                use -= Math.sqrt(Math.abs(val));
              }
            });
            discard.sort((a, b) => get.value(a) - get.value(b));
            discard = discard.slice(0, Math.min(num, discard.length)).reduce((sum, card) => sum + get.value(card), 0);
            give = att * Math.min(...Object.values(give));
            const res = [use, give, -discard];
            return res.indexOf(Math.max(...res));
          })()
        ).forResult();
      } else {
        result = { index: 0 };
      }
      switch (result?.index) {
        case 0:
          target.addTempSkill("yachai_block");
          await player.draw(2);
          return;
        case 1: {
          await target.showHandcards();
          const map = {}, hs = target.getCards("h");
          for (const i of hs) {
            map[get.suit(i, target)] ??= [];
            map[get.suit(i, target)].push(i);
          }
          const list = Object.keys(map).filter((i) => lib.suit.includes(i));
          let result2;
          if (!list.length) {
            return;
          } else if (list.length == 1) {
            result2 = { control: list[0] };
          } else {
            result2 = await target.chooseControl({
              controls: list,
              prompt: "将一种花色的牌交给" + get.translation(player),
              choice: (() => {
                const suit = list.slice().sort((a, b) => {
                  return get.value(map[a], target) - get.value(map[b], target);
                })[0];
                return list.indexOf(suit);
              })()
            }).forResult();
          }
          if (result2?.control) {
            const cards2 = map[result2.control].filter(function(card) {
              return lib.filter.canBeGained(card, player, target, "yachai");
            });
            if (cards2.length) {
              await target.give(cards2, player, "give");
            }
          }
          return;
        }
        case 2:
          await target.chooseToDiscard("h", true, num);
      }
    },
    subSkill: {
      block: {
        mark: true,
        intro: { content: "不能使用手牌" },
        charlotte: true,
        mod: {
          cardEnabled(card, player) {
            let hs = player.getCards("h"), cards2 = [card];
            if (Array.isArray(card.cards)) {
              cards2.addArray(card.cards);
            }
            for (let i of cards2) {
              if (hs.includes(i)) {
                return false;
              }
            }
          },
          cardSavable(card, player) {
            let hs = player.getCards("h"), cards2 = [card];
            if (Array.isArray(card.cards)) {
              cards2.addArray(card.cards);
            }
            for (let i of cards2) {
              if (hs.includes(i)) {
                return false;
              }
            }
          }
        }
      }
    }
  },
  qingtan: {
    audio: 2,
    enable: "phaseUse",
    usable: 2,
    filter(event, player) {
      return game.hasPlayer((current) => current.countCards("h") > 0);
    },
    filterTarget(card, player, target) {
      return target.countCards("h") > 0;
    },
    selectTarget: -1,
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      const { targets } = event;
      targets.sortBySeat();
      const next = player.chooseCardOL(targets, "请选择要展示的牌", true).set("ai", function(card) {
        return -get.value(card);
      }).set("source", player);
      next.aiCard = function(target) {
        const hs = target.getCards("h");
        return { bool: true, cards: [hs.randomGet()] };
      };
      next._args.remove("glow_result");
      const result = await next.forResult();
      const listMap = /* @__PURE__ */ new Map();
      for (let i = 0; i < targets.length; i++) {
        listMap.set(result[i].cards[0], targets[i]);
      }
      const cards2 = Array.from(listMap.keys()).flat();
      await player.showCards(cards2, get.translation(player) + "发动了【清谈】").set("customButton", (button) => {
        const target = get.owner(button.link);
        if (target) {
          game.createButtonCardsetion(`${target.getName(true)}`, button);
        }
      }).set("delay_time", 4).set("multipleShow", true);
      const list = [], map = {};
      for (const card of cards2) {
        const color = get.color(card);
        map[color] ??= [];
        map[color].push(card);
      }
      const dialog = ["清谈：你可以获得一种颜色的所有牌"];
      for (const color of Object.keys(lib.color)) {
        if (map[color]) {
          dialog.push([
            map[color].map((card) => [card, listMap.get(card)]),
            (item, type, position, noclick, node) => {
              node = ui.create.buttonPresets.card(item[0], type, position, noclick);
              game.createButtonCardsetion(`${item[1].getName(true)}`, node);
              return node;
            }
          ]);
          list.push(color);
        }
      }
      if (list.length) {
        const result2 = await player.chooseControl(list, "cancel2").set("dialog", dialog).set("list", list).set("map", map).set("listMap", listMap).set("ai", () => {
          let max = 0, res = "cancel2";
          const { list: list2, map: map2, player: player2, listMap: listMap2 } = get.event();
          for (let color of list2) {
            let temp = 0;
            for (let card of map2[color]) {
              temp += get.value(card, player2) + get.sgn(get.attitude(player2, listMap2.get(card))) * (6 - get.value(card, listMap2.get(card)));
            }
            for (let colorx in map2) {
              if (colorx === color) {
                continue;
              }
              for (let cardx of map2[colorx]) {
                temp -= get.sgn(get.attitude(player2, listMap2.get(cardx))) * get.value(cardx, listMap2.get(cardx));
              }
            }
            if (temp > max) {
              res = color;
              max = temp;
            }
          }
          return res;
        }).forResult();
        if (result2?.control != "cancel2") {
          const color = result2.control;
          player.chat(get.translation(color + 2));
          game.log(player, "选择了", "#y" + get.translation(color + 2));
          const cards22 = cards2.filter((card) => get.color(card) == color);
          await player.gain(cards22, "give");
          const draws = cards22.map((card) => listMap.get(card));
          await game.asyncDraw(draws);
          for (let i = 0; i < cards2.length; i++) {
            if (!cards22.includes(cards2[i])) {
              await targets[i].modedDiscard(cards2[i], player);
            }
          }
          await game.delayx();
        }
      }
    },
    ai: {
      order: 7,
      result: {
        player: 0.3,
        target: -1
      }
    }
  },
  //邓芝
  jianliang: {
    audio: 2,
    trigger: { player: "phaseDrawBegin2" },
    filter(event, player) {
      return !player.isMaxHandcard();
    },
    direct: true,
    async content(event, trigger, player) {
      const result = await player.chooseTarget(get.prompt("jianliang"), "令至多两名角色各摸一张牌", [1, 2]).set("ai", (target) => {
        return Math.sqrt(5 - Math.min(4, target.countCards("h"))) * get.attitude(_status.event.player, target);
      }).forResult();
      if (result.bool) {
        const targets = result.targets.sortBySeat();
        player.logSkill("jianliang", targets);
        if (targets.length == 1) {
          await targets[0].draw();
        } else {
          await game.asyncDraw(targets);
        }
      }
      game.delayx();
    }
  },
  weimeng: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => get.info("weimeng").filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return player.hp > 0 && target != player && target.countGainableCards(player, "h") > 0;
    },
    async content(event, trigger, player) {
      const { target } = event;
      if (!target.countGainableCards(player, "h") || player.hp <= 0) {
        return;
      }
      let result = await player.gainPlayerCard(target, "h", true, [1, player.hp]).forResult();
      if (result?.bool && target.isIn()) {
        const num = result.cards.length;
        const number1 = result.cards.reduce((num2, card) => num2 += get.number(card, player), 0);
        event.number1 = number1;
        result = await player.chooseToGive(target, "he", true, `危盟：选择交给${get.translation(target)}${get.cnNumber(num)}张牌`, `（已得到牌的点数和：${number1}）`, num).forResult();
        if (result?.bool) {
          const number2 = result.cards.reduce((num2, card) => num2 += get.number(card, player), 0);
          event.number2 = number2;
          if (number1 < number2) {
            await player.draw();
          } else if (number1 > number2) {
            await player.discardPlayerCard(target, true, "hej");
          }
        }
      }
    },
    ai: {
      order: 6,
      tag: {
        lose: 1,
        loseCard: 1,
        gain: 1
      },
      result: {
        target(player, target) {
          return -Math.pow(Math.min(player.hp, target.countCards("h")), 2) / 4;
        }
      }
    }
  },
  //冯熙
  yusui: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    filter(event, player) {
      return event.player != player && event.player.isIn() && get.color(event.card) == "black";
    },
    logTarget: "player",
    check(event, player) {
      var target = event.player;
      if (player.hp < 3 || get.attitude(player, target) > -3) {
        return false;
      }
      if (player.hp < target.hp) {
        return true;
      }
      if (Math.min(target.countCards("h") - player.countCards("h"), target.countCards("h")) > 3) {
        return true;
      }
      return false;
    },
    usable: 1,
    preHidden: true,
    async content(event, trigger, player) {
      let result;
      await player.loseHp();
      event.target = trigger.player;
      const target = event.target;
      let addIndex = 0;
      const list = [];
      const num = target.countCards("h") - player.countCards("h");
      if (num > 0 && target.countCards("h") > 0) {
        list.push("令其弃置" + get.cnNumber(num) + "张手牌");
      } else {
        addIndex++;
      }
      if (target.hp > player.hp) {
        list.push("令其失去" + get.cnNumber(target.hp - player.hp) + "点体力");
      }
      if (!list.length) {
        return;
      } else if (list.length == 1) {
        result = { index: 0 };
      } else {
        result = await player.chooseControl().set("choiceList", list).set("prompt", "令" + get.translation(target) + "执行一项").set("ai", function() {
          const player2 = _status.event.player;
          const target2 = _status.event.getParent().target;
          return target2.hp - player2.hp > Math.min(_status.event.getParent().num, target2.countCards("h")) / 2 ? 1 : 0;
        }).forResult();
      }
      if (result.index + addIndex == 0) {
        await target.chooseToDiscard(num, true, "h", "allowChooseAll");
      } else {
        await target.loseHp(target.hp - player.hp);
      }
    }
  },
  boyan: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target != player;
    },
    async content(event, trigger, player) {
      const target = event.target;
      await target.drawTo(Math.min(5, target.maxHp));
      target.addTempSkill("boyan_block");
    },
    subSkill: {
      block: {
        mark: true,
        intro: { content: "不能使用或打出手牌" },
        charlotte: true,
        mod: {
          cardEnabled2(card) {
            if (get.position(card) == "h") {
              return false;
            }
          }
        }
      }
    },
    ai: {
      order: (item, player) => {
        if (game.hasPlayer((cur) => {
          if (player === cur || get.attitude(player, cur) <= 0) {
            return false;
          }
          return Math.min(5, cur.maxHp) - cur.countCards("h") > 2;
        })) {
          return get.order({ name: "nanman" }, player) - 0.1;
        }
        return 10;
      },
      result: {
        target(player, target) {
          if (get.attitude(player, target) > 0) {
            return Math.max(0, Math.min(5, target.maxHp) - target.countCards("h"));
          }
          if (Math.max(0, Math.min(5, target.maxHp) - target.countCards("h")) <= 1 && target.countCards("h", "shan") && !target.hasSkillTag("respondShan", true, null, true) && player.countCards("h", function(card) {
            return get.tag(card, "respondShan") && player.getUseValue(card, null, true) > 0 && get.effect(target, card, player, player) > 0;
          })) {
            return -2;
          }
        }
      }
    }
  },
  //祢衡
  rekuangcai: {
    audio: 2,
    forced: true,
    trigger: { player: "phaseDiscardBegin" },
    filter(event, player) {
      return !player.getHistory("useCard").length || !player.getHistory("sourceDamage").length;
    },
    async content(event, trigger, player) {
      lib.skill.rekuangcai.change(player, player.getHistory("useCard").length ? -1 : 1);
    },
    mod: {
      targetInRange(card, player) {
        if (player == _status.currentPhase) {
          return true;
        }
      },
      cardUsable(card, player) {
        if (player == _status.currentPhase) {
          return Infinity;
        }
      }
    },
    change(player, num) {
      if (typeof player.storage.rekuangcai_change != "number") {
        player.storage.rekuangcai_change = 0;
      }
      player.storage.rekuangcai_change += num;
      player.addSkill("rekuangcai_change");
    },
    group: "rekuangcai_draw",
    subSkill: {
      draw: {
        audio: "rekuangcai",
        trigger: { player: "phaseJieshuBegin" },
        forced: true,
        filter(event, player) {
          return player.getHistory("sourceDamage").length > 0;
        },
        async content(event, trigger, player) {
          player.draw(Math.min(5, player.getStat("damage")));
        }
      },
      change: {
        mod: {
          maxHandcard(player, num) {
            if (typeof player.storage.rekuangcai_change == "number") {
              return num + player.storage.rekuangcai_change;
            }
          }
        },
        charlotte: true,
        mark: true,
        intro: {
          content: (num) => "手牌上限" + (num < 0 ? "" : "+") + num
        }
      }
    }
  },
  reshejian: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    filter(event, player) {
      if (player == event.player || event.targets.length != 1) {
        return false;
      }
      return event.player.isIn() && player.countCards("h") >= 2;
    },
    usable: 2,
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard("h", [2, Infinity], get.prompt(event.skill, trigger.player), '<div class="text center">弃置至少两张手牌，然后选择一项：<br>⒈弃置其等量的牌。⒉对其造成1点伤害。</div>', "allowChooseAll").set("ai", function(card) {
        if (_status.event.goon && ui.selected.cards.length < 2) {
          return 5.6 - get.value(card);
        }
        return 0;
      }).set(
        "goon",
        (function() {
          var target = trigger.player;
          if (get.attitude(player, target) >= 0) {
            return false;
          }
          if (get.damageEffect(target, player, player) > 0) {
            return true;
          }
          if (target.countCards("he", function(card) {
            return get.value(card, target) > 6;
          }) >= 2) {
            return true;
          }
          return false;
        })()
      ).set("chooseonly", true).forResult();
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const {
        cards: cards2,
        targets: [target]
      } = event;
      await player.discard(cards2);
      const num = cards2.length;
      let result;
      if (!target.isIn()) {
        return;
      } else if (!target.countDiscardableCards(player, "he")) {
        result = { index: 1 };
      } else {
        result = await player.chooseControl().set("choiceList", ["弃置" + get.translation(target) + "的" + get.cnNumber(num) + "张牌", "对" + get.translation(target) + "造成1点伤害"]).set("ai", function() {
          const player2 = _status.event.player;
          const eff0 = get.effect(target, { name: "guohe_copy2" }, player2, player2) * Math.min(1.7, target.countCards("he"));
          const eff1 = get.damageEffect(target, player2, player2);
          return eff0 > eff1 ? 0 : 1;
        }).forResult();
      }
      if (result?.index == 0) {
        await player.discardPlayerCard(target, num, true, "he", "allowChooseAll");
      } else if (result?.index == 1) {
        await target.damage();
      }
    }
  },
  //陈登
  refuyuan: {
    audio: 2,
    trigger: { global: "useCardToTargeted" },
    logTarget: "target",
    filter(event, player) {
      return event.card.name == "sha" && event.target.isIn() && !game.hasPlayer2(function(current) {
        return current.hasHistory("useCard", function(evt) {
          return evt.card != event.card && get.color(evt.card, false) == "red" && evt.targets && evt.targets.includes(event.target);
        });
      });
    },
    check(event, player) {
      return get.attitude(player, event.target) > 0;
    },
    async content(event, trigger, player) {
      trigger.target.draw();
    }
  },
  reyingshui: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("he") > 0 && game.hasPlayer((current) => player.inRange(current));
    },
    position: "he",
    filterCard: true,
    filterTarget(card, player, target) {
      return player.inRange(target);
    },
    discard: false,
    lose: false,
    delay: false,
    check(card) {
      if (get.type(card) == "equip") {
        return 3 - get.value(card);
      }
      return 6.5 - get.value(card);
    },
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      await player.give(cards2, target);
      const next = target.chooseCard("he", [2, Infinity], "交给" + get.translation(player) + "至少两张装备牌，否则受到1点伤害", { type: "equip" }, "allowChooseAll");
      if (get.damageEffect(target, player, target) >= 0) {
        next.set("ai", () => -1);
      } else {
        next.set("ai", (card) => ui.selected.cards.length < 2 ? 6 - get.value(card) : 0);
      }
      const result = await next.forResult();
      if (result.bool) {
        await target.give(result.cards, player);
      } else {
        await target.damage("nocard");
      }
    },
    ai: {
      order: 5,
      tag: {
        damage: 0.5
      },
      result: {
        target: -1.5
      }
    }
  },
  rewangzu: {
    audio: 2,
    trigger: { player: "damageBegin1" },
    filter(event, player) {
      return event.source && player != event.source && player.hasCard((card) => lib.filter.cardDiscardable(card, player, "rewangzu"), "h");
    },
    usable: 1,
    async cost(event, trigger, player) {
      var num = player.getFriends().length;
      if (!game.hasPlayer(function(current) {
        return current != player && current.getFriends().length > num;
      })) {
        event.result = await player.chooseToDiscard("h", get.prompt(event.skill), "弃置一张手牌并令伤害-1", "chooseonly").set("ai", function(card) {
          return 7 - get.value(card);
        }).forResult();
      } else {
        event.result = await player.chooseBool(get.prompt(event.skill), "随机弃置一张手牌并令伤害-1").forResult();
      }
    },
    async content(event, trigger, player) {
      if (!event.cards || !event.cards.length) {
        const cards2 = player.getCards("h", (card) => lib.filter.cardDiscardable(card, player, "rewangzu"));
        if (cards2.length) {
          await player.discard(cards2.randomGet());
        }
      } else {
        await player.discard(event.cards);
      }
      trigger.num--;
    }
  },
  //万年公主
  zhenge: {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    direct: true,
    async content(event, trigger, player) {
      const targetResult = await player.chooseTarget(get.prompt("zhenge"), "令一名角色的攻击范围+1").set("ai", function(target2) {
        var player2 = _status.event.player, att = get.attitude(player2, target2);
        if (att > 0) {
          if (!target2.hasMark("zhenge_effect")) {
            att *= 1.5;
          }
          if (!game.hasPlayer(function(current) {
            return get.distance(target2, current, "attack") > 2;
          })) {
            const usf = Math.max(
              ...game.filterPlayer().map((current) => {
                if (target2.canUse("sha", current, false)) {
                  return get.effect(current, { name: "sha" }, target2, player2);
                }
                return 0;
              })
            );
            return att + usf;
          }
          return att;
        }
        return 0;
      }).forResult();
      if (!targetResult.bool) return;
      const target = targetResult.targets[0];
      player.logSkill("zhenge", target);
      target.addSkill("zhenge_effect");
      if (target.countMark("zhenge_effect") < 5) {
        target.addMark("zhenge_effect", 1, false);
      }
      if (!game.hasPlayer((current) => {
        return current != target && !target.inRange(current);
      })) {
        const shaTargetResult = await player.chooseTarget("是否令" + get.translation(target) + "视为对另一名角色使用【杀】？", function(card, player2, target2) {
          return _status.event.source.canUse("sha", target2);
        }).set("source", target).set("ai", function(target2) {
          var evt = _status.event;
          return get.effect(target2, { name: "sha" }, evt.source, evt.player);
        }).forResult();
        if (shaTargetResult.bool) {
          await target.useCard({ name: "sha", isCard: true }, shaTargetResult.targets[0], false);
        }
        await game.delayx();
        return;
      }
      await game.delayx();
    },
    subSkill: {
      effect: {
        charlotte: true,
        onremove: true,
        mod: {
          attackRange(player, num) {
            return num + player.countMark("zhenge_effect");
          }
        },
        intro: { content: "攻击范围+#" }
      }
    }
  },
  xinghan: {
    audio: 2,
    init(player) {
      player.addSkill("xinghan_count");
    },
    onremove(player) {
      player.removeSkill("xinghan_count");
    },
    trigger: { global: "damageSource" },
    forced: true,
    filter(event, player) {
      return event.card && event.card == player.storage.xinghan_temp && event.source && event.source.hasMark("zhenge_effect");
    },
    logTarget: "source",
    async content(event, trigger, player) {
      player.draw(player.isMaxHandcard(true) ? 1 : Math.min(5, trigger.source.getAttackRange()));
    },
    subSkill: {
      count: {
        trigger: { global: "useCard1" },
        forced: true,
        charlotte: true,
        popup: false,
        firstDo: true,
        filter(event, player) {
          return event.card.name == "sha" && !game.hasPlayer2(function(current) {
            return current.hasHistory("useCard", function(evt) {
              return evt != event && evt.card.name == "sha";
            });
          });
        },
        async content(event, trigger, player) {
          player.addTempSkill("xinghan_temp");
          player.storage.xinghan_temp = trigger.card;
        }
      },
      temp: { onremove: true }
    },
    ai: { combo: "zhenge" }
  },
  //荀谌
  refenglve: {
    audio: 2,
    enable: "phaseUse",
    usable(skill, player) {
      return 1 + player.countMark("refenglve_add");
    },
    filter(event, player) {
      return player.countCards("h") > 0 && !player.hasSkillTag("noCompareSource") && game.hasPlayer(function(current) {
        return current != player && current.countCards("h") > 0 && !current.hasSkillTag("noCompareTarget");
      });
    },
    filterTarget(card, player, target) {
      return target != player && target.countCards("h") > 0 && !target.hasSkillTag("noCompareTarget");
    },
    async content(event, trigger, player) {
      const { target } = event;
      let result;
      result = await player.chooseToCompare(target).forResult();
      if (result.bool) {
        if (!target.countCards("hej")) {
          return;
        } else {
          await player.gainPlayerCard(target, true, "hej", 2, "获得" + get.translation(target) + "区域里的两张牌");
        }
      } else if (result.tie) {
        player.addTempSkill(event.name + "_add", "phaseUseAfter");
        player.addMark(event.name + "_add", 1, false);
        if (get.position(result.player, true) == "d") {
          await player.gain(result.player, "gain2");
        }
      } else {
        if (get.position(result.player, true) == "d") {
          await target.gain(result.player, "gain2");
        }
      }
    },
    ai: {
      order: 8,
      result: {
        target(player, target) {
          if (!player.hasCard(function(card) {
            if (get.position(card) != "h") {
              return false;
            }
            var val = get.value(card);
            if (val < 0) {
              return true;
            }
            if (val <= 5) {
              return card.number >= 11;
            }
            if (val <= 6) {
              return card.number >= 13;
            }
            return false;
          })) {
            return 0;
          }
          return -Math.sqrt(1 + target.countCards("he")) / (1 + target.countCards("j"));
        }
      }
    },
    subSkill: {
      add: {
        charlotte: true,
        onremove: true
      }
    }
  },
  anyong: {
    audio: 2,
    trigger: { global: "damageSource" },
    direct: true,
    filter(event, player) {
      return event.source && event.source == _status.currentPhase && event.num == 1 && // event.player != event.source &&
      event.player.isIn() && player.countCards("he") > 0 && event.source.getHistory("sourceDamage", function(evt) {
        return evt.player != event.source;
      }).indexOf(event) == 0;
    },
    async content(event, trigger, player) {
      const result = await player.chooseToDiscard("he", get.prompt("anyong", trigger.player), "弃置一张牌并对其造成1点伤害").set("goon", get.damageEffect(trigger.player, player, player) > 0).set("ai", function(card) {
        if (_status.event.goon) {
          return 7 - get.value(card);
        }
        return 0;
      }).set("logSkill", ["anyong", trigger.player]).forResult();
      if (result.bool) {
        await trigger.player.damage();
      }
    }
  },
  //刘永
  zhuning: {
    audio: 2,
    enable: "phaseUse",
    usable(skill, player) {
      return 1 + (player.hasSkill(skill + "_rewrite", null, null, false) ? 1 : 0);
    },
    filter(event, player) {
      return player.countCards("he") && game.hasPlayer((current) => player != current);
    },
    filterCard: true,
    position: "he",
    filterTarget: lib.filter.notMe,
    selectCard: [1, Infinity],
    delay: false,
    lose: false,
    discard: false,
    allowChooseAll: true,
    check(card) {
      if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
        return 0;
      }
      if (!ui.selected.cards.length && card.name == "du") {
        return 20;
      }
      var player = get.owner(card);
      if (ui.selected.cards.length >= Math.max(1, player.countCards("h") - player.hp)) {
        return 0;
      }
      return 10 - get.value(card);
    },
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      const next = player.give(cards2, target);
      next.gaintag.add("fengxiang_tag");
      await next;
      const list = get.inpileVCardList((info) => {
        const card = { name: info[2], nature: info[3], isCard: true };
        if (!["basic", "trick"].includes(get.type(info[2])) || !get.tag(card, "damage")) {
          return false;
        }
        return player.hasUseTarget(card);
      });
      if (!list.length) {
        return;
      }
      const result = await player.chooseButton(["是否视为使用一张伤害牌？", [list, "vcard"]]).set("ai", (button) => {
        return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
      }).forResult();
      if (!result?.links?.length) {
        return;
      }
      await player.chooseUseTarget({ name: result.links[0][2], nature: result.links[0][3], isCard: true }, true, false);
      if (!player.hasHistory("sourceDamage", (evt) => {
        if (!evt.card) {
          return false;
        }
        const evtx = evt.getParent("useCard");
        return evtx.card == evt.card && evtx.getParent(2) == event;
      })) {
        player.addTempSkill(event.name + "_rewrite", "phaseAnyAfter");
      }
    },
    subSkill: { rewrite: { charlotte: true } },
    ai: {
      fireAttack: true,
      order: 4,
      result: {
        target(player, target) {
          if (target.hasSkillTag("nogain")) {
            return 0;
          }
          if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
            if (target.hasSkillTag("nodu")) {
              return 0;
            }
            return -10;
          }
          if (target.hasJudge("lebu")) {
            return 0;
          }
          var nh = target.countCards("h");
          var np = player.countCards("h");
          if (player.hp == player.maxHp || player.countCards("h") <= 1) {
            if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) {
              return 0;
            }
          }
          return Math.max(1, 5 - nh);
        }
      }
    }
  },
  fengxiang: {
    getMax(event) {
      var max = 0, max2 = null, players = game.filterPlayer();
      for (var current of players) {
        var num = 0, cards2 = current.getCards("h", function(card) {
          return card.hasGaintag("fengxiang_tag");
        });
        if (event) {
          if (event.name == "gain" && event.gaintag.includes("fengxiang_tag")) {
            cards2.removeArray(event.cards);
          }
          var evt = event.getl(current);
          if (evt && evt.gaintag_map) {
            for (var i in evt.gaintag_map) {
              if (evt.gaintag_map[i].includes("fengxiang_tag")) {
                num++;
              }
            }
          }
        }
        num += cards2.length;
        if (num > max) {
          max = num;
          max2 = current;
        } else if (num == max) {
          max2 = null;
        }
      }
      return max2;
    },
    audio: 2,
    init(player) {
      game.addGlobalSkill("fengxiang_use");
    },
    onremove(player) {
      if (!game.hasPlayer((current) => current.hasSkill("fengxiang", null, null, false), true)) {
        game.removeGlobalSkill("fengxiang_use");
      }
    },
    trigger: { player: "damageEnd" },
    forced: true,
    filter(event, player) {
      var target = lib.skill.fengxiang.getMax();
      return !target || target.isDamaged();
    },
    logTarget(event, player) {
      return lib.skill.fengxiang.getMax() || player;
    },
    async content(event, trigger, player) {
      var target = lib.skill.fengxiang.getMax();
      if (target) {
        target.recover();
      } else {
        player.draw();
      }
    },
    group: "fengxiang_draw",
    subSkill: {
      draw: {
        audio: "fengxiang",
        trigger: {
          global: ["equipAfter", "addJudgeAfter", "loseAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        forced: true,
        filter(event, player) {
          if (event.name == "lose" && event.getlx === false) {
            return false;
          }
          return lib.skill.fengxiang.getMax() != lib.skill.fengxiang.getMax(event);
        },
        async content(event, trigger, player) {
          if (trigger.delay === false) {
            game.delayx();
          }
          player.draw();
        }
      },
      use: {
        mod: {
          aiOrder(player, card, num) {
            if (num > 0 && get.itemtype(card) === "card" && card.hasGaintag("fengxiang_tag") && game.hasPlayer((current) => {
              return current.hasSkill("fengxiang") && get.attitude(player, current) > 0;
            })) {
              return num + 10;
            }
          }
        },
        trigger: { player: "dieAfter" },
        filter(event, player) {
          return !game.hasPlayer((current) => current.hasSkill("fengxiang", null, null, false), true);
        },
        silent: true,
        forceDie: true,
        charlotte: true,
        async content(event, trigger, player) {
          game.removeGlobalSkill("fengxiang_use");
        }
      }
    }
  },
  //阚泽
  rekuanshi: {
    audio: "kuanshi",
    trigger: { player: "phaseJieshuBegin" },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill)).set("ai", (target) => {
        let att = get.attitude(get.player(), target);
        if (target.hp < 3) {
          att /= 1.5;
        }
        return att;
      }).forResult();
    },
    async content(event, trigger, player) {
      const [target] = event.targets;
      player.addTempSkill(event.name + "_effect", { player: "phaseBegin" });
      player.markAuto(event.name + "_effect", [target]);
      await game.delayx();
    },
    subSkill: {
      effect: {
        charlotte: true,
        audio: "kuanshi",
        onremove: true,
        intro: { content: "每回合限一次，当$于一回合内受到第2点伤害后，其回复1点体力。" },
        trigger: { global: "damageEnd" },
        filter(event, player) {
          if (!player.getStorage("rekuanshi_effect").includes(event.player) || event.player.isHealthy()) {
            return false;
          }
          let history = event.player.getHistory("damage", null, event), num = 0;
          for (const evt of history) {
            if (evt.rekuanshi) {
              return false;
            }
            num += evt.num;
          }
          return num > 1 && num - event.num < 2;
        },
        forced: true,
        logTarget: "player",
        async content(event, trigger, player) {
          trigger.rekuanshi = true;
          await trigger.player.recover();
        }
      }
    }
  },
  //吕玲绮
  guowu: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    preHidden: true,
    async content(event, trigger, player) {
      const hs = player.getCards("h");
      await player.showCards(hs, get.translation(player) + "发动了【帼武】");
      const list = [];
      for (const c of hs) {
        list.add(get.type2(c, player));
        if (list.length >= 3) {
          break;
        }
      }
      if (list.length >= 1) {
        const card = get.discardPile((i) => i.name == "sha");
        if (card) {
          await player.gain(card, "gain2");
        }
      }
      if (list.length >= 2) {
        player.addTempSkill("guowu_dist", "phaseUseAfter");
      }
      if (list.length >= 3) {
        player.addTempSkill("guowu_add", "phaseUseAfter");
      }
    },
    subSkill: {
      dist: {
        charlotte: true,
        mod: { targetInRange: () => true }
      },
      used: { charlotte: true },
      add: {
        audio: "guowu",
        charlotte: true,
        trigger: { player: "useCard1" },
        direct: true,
        filter(event, player) {
          var info = get.info(event.card, false);
          if (info.allowMultiple == false) {
            return false;
          }
          if (event.card.name != "sha" && (info.type != "trick" || get.mode() == "guozhan" || player.hasSkill("guowu_used"))) {
            return false;
          }
          if (event.targets && !info.multitarget) {
            if (game.hasPlayer(function(current) {
              return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
            })) {
              return true;
            }
          }
          return false;
        },
        async content(event, trigger, player) {
          let result;
          const num = game.countPlayer((current) => {
            return !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current) && lib.filter.targetInRange(trigger.card, player, current);
          });
          result = await player.chooseTarget("帼武：是否为" + get.translation(trigger.card) + "增加" + (num > 1 ? "至多两个" : "一个") + "目标？", [1, Math.min(2, num)], function(card, player2, target) {
            const trigger2 = _status.event.getTrigger();
            card = trigger2.card;
            return !trigger2.targets.includes(target) && lib.filter.targetEnabled2(card, player2, target) && lib.filter.targetInRange(card, player2, target);
          }).set("ai", function(target) {
            const player2 = _status.event.player;
            const card = _status.event.getTrigger().card;
            return get.effect(target, card, player2, player2);
          }).forResult();
          if (!result.bool) {
            return;
          }
          if (player != game.me && !player.isOnline()) {
            await game.delayx();
          }
          const targets = result.targets.sortBySeat();
          player.logSkill("guowu_add", targets);
          trigger.targets.addArray(targets);
          if (get.mode() == "guozhan") {
            player.addTempSkill("guowu_used", "phaseUseAfter");
          }
        }
      }
    }
  },
  zhuangrong: {
    derivation: ["llqshenwei", "wushuang"],
    audio: 2,
    trigger: { global: "phaseEnd" },
    forced: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "gray",
    filter(event, player) {
      return player.hp == 1 || player.countCards("h") == 1;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      await player.loseMaxHp();
      if (player.maxHp > player.hp) {
        await player.recover(player.maxHp - player.hp);
      }
      await player.drawTo(Math.min(5, player.maxHp));
      await player.addSkills(["llqshenwei", "wushuang"]);
    }
  },
  llqshenwei: {
    audio: 2,
    trigger: { player: "phaseDrawBegin2" },
    forced: true,
    filter: (event) => !event.numFixed,
    async content(event, trigger, player) {
      trigger.num += 2;
    },
    mod: {
      maxHandcard: (player, num) => num + 2
    }
  },
  cuijian: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => lib.skill.cuijian.filterTarget(null, player, current));
    },
    filterTarget(card, player, target) {
      return target != player && target.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      const { target } = event;
      let result;
      let num;
      const hs = target.getCards("h", "shan");
      if (hs.length) {
        hs.addArray(target.getCards("he", (card) => get.subtype(card) == "equip2"));
        await player.gain(hs, target, "give", "bySelf");
        if (player.hasMark("zhtongyuan_basic")) {
          return;
        } else {
          num = hs.length;
          event.num = num;
        }
      } else {
        if (player.hasMark("zhtongyuan_trick")) {
          await player.draw(2);
        }
        return;
      }
      const hs2 = player.getCards("he");
      if (!hs2.length || !target.isIn()) {
        return;
      } else if (hs2.length <= num) {
        result = { bool: true, cards: hs2 };
      } else {
        result = await player.chooseCard("he", true, "选择交给" + get.translation(target) + get.cnNumber(num) + "张牌", num).forResult();
      }
      if (result.bool && result.cards && result.cards.length) {
        await player.give(result.cards, target);
      }
    },
    ai: {
      order: 4,
      result: {
        player(player, target) {
          if (!target.countCards("h", "shan")) {
            return player.hasMark("zhtongyuan_trick") ? 2 : 0;
          }
          return 0;
        },
        target(player, target) {
          if (target.countCards("h", "shan")) {
            var num = -target.countCards("h") / 2;
            var card = target.getEquip(2);
            if (card) {
              num -= get.value(card, target) / 2;
            }
            return num;
          }
          return -0.01;
        }
      }
    }
  },
  tongyuan: { audio: 2 },
  zhtongyuan: {
    audio: "tongyuan",
    trigger: { player: ["useCardAfter", "respondAfter"] },
    forced: true,
    filter(event, player) {
      var type = get.type2(event.card, false);
      return (type == "basic" || type == "trick") && get.color(event.card, false) == "red" && !player.hasMark("zhtongyuan_" + type);
    },
    async content(event, trigger, player) {
      var type = get.type2(trigger.card, false);
      if (!player.hasMark("zhtongyuan_" + type)) {
        player.addMark("zhtongyuan_" + type, 1, false);
        game.log(player, "修改了技能", "#g【摧坚】");
      }
    },
    group: ["zhtongyuan_basic", "zhtongyuan_trick"],
    subSkill: {
      basic: {
        trigger: { player: "useCard2" },
        direct: true,
        locked: true,
        filter(event, player) {
          if (!player.hasMark("zhtongyuan_basic") || !player.hasMark("zhtongyuan_trick")) {
            return false;
          }
          var card = event.card;
          if (get.color(card, false) != "red" || get.type(card, null, false) != "basic") {
            return false;
          }
          var info = get.info(card);
          if (info.allowMultiple == false) {
            return false;
          }
          if (event.targets && !info.multitarget) {
            if (game.hasPlayer(function(current) {
              return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
            })) {
              return true;
            }
          }
          return false;
        },
        async content(event, trigger, player) {
          let result;
          const prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
          result = await player.chooseTarget(get.prompt("zhtongyuan"), (card, currentPlayer, target) => {
            return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, currentPlayer, target);
          }).set("prompt2", prompt2).set("ai", (target) => get.effect(target, trigger.card, player, player)).set("card", trigger.card).set("targets", trigger.targets).forResult();
          if (!result.bool) {
            return;
          }
          if (!event.isMine() && !event.isOnline()) {
            game.delayx();
          }
          event.targets = result.targets;
          if (event.targets) {
            player.logSkill("zhtongyuan", event.targets);
            trigger.targets.addArray(event.targets);
          }
        }
      },
      trick: {
        audio: "zhtongyuan",
        trigger: { player: "useCard" },
        forced: true,
        filter(event, player) {
          if (!player.hasMark("zhtongyuan_basic") || !player.hasMark("zhtongyuan_trick")) {
            return false;
          }
          var card = event.card;
          return get.color(card, false) == "red" && get.type(card, null, false) == "trick";
        },
        async content(event, trigger, player) {
          trigger.directHit.addArray(game.filterPlayer());
          game.log(trigger.card, "不可被响应");
        }
      }
    },
    ai: {
      combo: "zhtongyuan"
    }
  },
  //陆郁生
  zhente: {
    audio: 2,
    trigger: { target: "useCardToTargeted" },
    logTarget: "player",
    usable: 1,
    preHidden: true,
    filter(event, player) {
      var color = get.color(event.card);
      if (player == event.player || event.player.isDead() || color == "none" || get.mode() == "guozhan" && color != "black") {
        return false;
      }
      var type = get.type(event.card);
      return type == "basic" || type == "trick";
    },
    check(event, player) {
      return !event.excluded.includes(player) && get.effect(player, event.card, event.player, player) < 0;
    },
    async content(event, trigger, player) {
      const result = await trigger.player.chooseControl().set("choiceList", ["本回合内不能再使用" + get.translation(get.color(trigger.card)) + "牌", "令" + get.translation(trigger.card) + "对" + get.translation(player) + "无效"]).set("prompt", get.translation(player) + "发动了【贞特】，请选择一项").set("ai", function() {
        var player2 = _status.event.player;
        var target = _status.event.getParent().player;
        var card = _status.event.getTrigger().card, color = get.color(card);
        if (get.effect(target, card, player2, player2) <= 0) {
          return 1;
        }
        var hs = player2.countCards("h", function(card2) {
          return get.color(card2, player2) == color && player2.hasValueTarget(card2, null, true);
        });
        if (!hs.length) {
          return 0;
        }
        if (hs > 1) {
          return 1;
        }
        return Math.random() > 0.5 ? 0 : 1;
      }).forResult();
      if (result.index == 0) {
        trigger.player.addTempSkill("zhente2");
        trigger.player.storage.zhente2.add(get.color(trigger.card));
        trigger.player.markSkill("zhente2");
      } else {
        trigger.excluded.add(player);
      }
    }
  },
  zhente2: {
    mod: {
      cardEnabled(card, player) {
        const color = get.color(card);
        if (color != "unsure" && player.getStorage("zhente2").includes(color)) {
          return false;
        }
      },
      cardSavable(card, player) {
        const color = get.color(card);
        if (color != "unsure" && player.getStorage("zhente2").includes(color)) {
          return false;
        }
      }
    },
    charlotte: true,
    onremove: true,
    init(player, skill) {
      if (!player.storage[skill]) {
        player.storage[skill] = [];
      }
    },
    intro: { content: "本回合内不能使用$牌" }
  },
  zhiwei: {
    audio: 2,
    trigger: {
      player: ["enterGame", "showCharacterAfter", "phaseZhunbeiBegin"],
      global: ["phaseBefore"]
    },
    direct: true,
    filter(event, player, name) {
      if (player.hasSkill("zhiwei2")) {
        return false;
      }
      if (!game.hasPlayer((current) => current != player)) {
        return false;
      }
      if (get.mode() == "guozhan") {
        return event.name == "showCharacter" && event.toShow.some((name2) => {
          return get.character(name2, 3).includes("zhiwei");
        });
      }
      return event.name != "showCharacter" && (name != "phaseBefore" || game.phaseNumber == 0);
    },
    async content(event, trigger, player) {
      let result;
      result = await player.chooseTarget("请选择【至微】的目标", "选择一名其他角色。该角色造成伤害后，你摸一张牌，该角色受到伤害后，你随机弃置一张手牌。你弃牌阶段弃置的牌均被该角色获得。", true, lib.filter.notMe).set("ai", (target) => {
        const att = get.attitude(_status.event.player, target);
        if (att > 0) {
          return 1 + att;
        }
        return Math.random();
      }).forResult();
      if (result.bool) {
        const target = result.targets[0];
        player.logSkill("zhiwei", target);
        player.storage.zhiwei2 = target;
        player.addSkill("zhiwei2");
      }
    }
  },
  zhiwei2: {
    group: ["zhiwei2_draw", "zhiwei2_discard", "zhiwei2_gain", "zhiwei2_clear"],
    charlotte: true,
    onremove: true,
    mark: "character",
    sourceSkill: "zhiwei",
    intro: {
      content: "$造成伤害后你摸一张牌；$受到伤害后你弃置一张牌；你于弃牌阶段弃置牌后交给$"
    },
    subSkill: {
      draw: {
        audio: "zhiwei",
        trigger: { global: "damageSource" },
        forced: true,
        filter(event, player) {
          return event.source == player.storage.zhiwei2;
        },
        logTarget: "source",
        async content(event, trigger, player) {
          player.draw();
        }
      },
      discard: {
        audio: "zhiwei",
        trigger: { global: "damageEnd" },
        forced: true,
        filter(event, player) {
          return event.player == player.storage.zhiwei2 && player.countCards("h", function(card) {
            return lib.filter.cardDiscardable(card, player, "zhiwei2_discard");
          });
        },
        logTarget: "player",
        async content(event, trigger, player) {
          player.discard(
            player.getCards("h", function(card) {
              return lib.filter.cardDiscardable(card, player, "zhiwei2_discard");
            }).randomGet()
          );
        }
      },
      gain: {
        audio: "zhiwei",
        trigger: {
          player: "loseAfter",
          global: "loseAsyncAfter"
        },
        forced: true,
        filter(event, player) {
          if (event.type != "discard" || event.getlx === false || event.getParent("phaseDiscard").player != player || !player.storage.zhiwei2 || !player.storage.zhiwei2.isIn()) {
            return false;
          }
          var evt = event.getl(player);
          return evt && evt.cards2.filterInD("d").length > 0;
        },
        logTarget(event, player) {
          return player.storage.zhiwei2;
        },
        async content(event, trigger, player) {
          if (trigger.delay === false) {
            game.delay();
          }
          player.storage.zhiwei2.gain(trigger.getl(player).cards2.filterInD("d"), "gain2");
        }
      },
      clear: {
        audio: "zhiwei",
        trigger: {
          global: "die",
          player: ["hideCharacterEnd", "removeCharacterEnd"]
        },
        forced: true,
        filter(event, player) {
          if (event.name == "die") {
            return event.player == player.storage.zhiwei2;
          }
          if (event.name == "removeCharacter") {
            return event.toRemove == "luyusheng" || event.toRemove == "gz_luyusheng";
          }
          return event.toHide == "luyusheng" || event.toHide == "gz_luyusheng";
        },
        async content(event, trigger, player) {
          player.removeSkill("zhiwei2");
          if (trigger.name !== "die" || get.mode() !== "guozhan") {
            return;
          }
          if (get.character(player.name1, 3).includes("zhiwei")) {
            player.hideCharacter(0);
          }
          if (get.character(player.name2, 3).includes("zhiwei")) {
            player.hideCharacter(1);
          }
        }
      }
    }
  },
  //华歆
  spwanggui: {
    audio: "wanggui",
    trigger: { source: "damageSource" },
    usable: 1,
    filter(event, player) {
      return game.hasPlayer(function(current) {
        return current.group != player.group;
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt(event.skill), "对一名势力不同的其他角色造成1点伤害", function(card, player2, target) {
        return target.group != player2.group;
      }).set("ai", function(target) {
        var player2 = _status.event.player;
        return get.damageEffect(target, player2, player2);
      }).forResult();
    },
    async content(event, trigger, player) {
      const target = event.targets[0];
      target.damage();
    },
    group: "spwanggui_draw",
    subSkill: {
      draw: {
        audio: "wanggui",
        trigger: { player: "damageEnd" },
        async cost(event, trigger, player) {
          event.result = await player.chooseTarget(get.prompt("spwanggui"), "令自己摸一张牌，或和一名势力相同的其他角色各摸一张牌", function(card, player2, target) {
            return target.group == player2.group;
          }).set("ai", function(target) {
            var player2 = _status.event.player, att = get.attitude(player2, target);
            if (target != player2) {
              att *= 2;
            }
            if (target.hasSkillTag("nogain")) {
              att /= 1.7;
            }
            return att;
          }).forResult();
        },
        async content(event, trigger, player) {
          const target = event.targets[0];
          if (player == target) {
            await player.draw();
            return;
          }
          const list = [player, target].sortBySeat();
          await game.asyncDraw(list);
          await game.delayx();
        }
      }
    }
  },
  wanggui: {
    audio: 2,
    trigger: {
      player: "damageEnd",
      source: "damageSource"
    },
    filter(event, player) {
      if (player.isUnseen()) {
        return false;
      }
      if (!player.isUnseen(2)) {
        return true;
      }
      return !player.isUnseen(0) && get.character(player.name1, 3).includes("wanggui") || !player.isUnseen(1) && get.character(player.name2, 3).includes("wanggui");
    },
    usable: 1,
    preHidden: true,
    async cost(event, trigger, player) {
      if (player.isUnseen(2)) {
        event.result = await player.chooseTarget(get.prompt(event.skill), "望归：是否对与你势力不同的一名角色造成1点伤害？", (card, player2, target) => {
          return target.isEnemyOf(player2);
        }).set("ai", (target) => {
          let player2 = _status.event.player;
          return get.damageEffect(target, player2, player2);
        }).setHiddenSkill(event.skill).forResult();
      } else {
        event.result = await player.chooseBool("望归：是否令与你势力相同的角色各摸一张牌？").setHiddenSkill(event.skill).forResult();
        event.result.targets = game.filterPlayer((current) => {
          return current.isFriendOf(player);
        });
      }
    },
    async content(event, trigger, player) {
      if (player.isUnseen(2)) {
        const target = event.targets[0];
        target.damage("nocard");
      } else {
        const targets = event.targets;
        targets.sortBySeat();
        await game.asyncDraw(targets);
      }
    }
  },
  xibing: {
    audio: 2,
    trigger: { global: "useCardToPlayered" },
    filter(event, player) {
      if (player == event.player || event.targets.length != 1) {
        return false;
      }
      var bool = function(card) {
        return (card.name == "sha" || get.type(card, null, false) == "trick") && get.color(card, false) == "black";
      };
      if (!bool(event.card)) {
        return false;
      }
      var evt = event.getParent("phaseUse");
      if (evt.player != event.player) {
        return false;
      }
      return true;
    },
    usable: 1,
    logTarget: "player",
    check(event, player) {
      var target = event.player;
      var att = get.attitude(player, target);
      var num2 = Math.min(5, target.hp) - target.countCards("h");
      if (num2 <= 0) {
        return false;
      }
      var num = target.countCards("h", function(card) {
        return target.hasValueTarget(card, null, true);
      });
      if (!num) {
        return att > 0;
      }
      return (num - num2) * att < 0;
    },
    preHidden: true,
    async content(event, trigger, player) {
      const num = Math.min(5, trigger.player.hp) - trigger.player.countCards("h");
      if (num > 0) {
        trigger.player.draw(num);
        trigger.player.addTempSkill("xibing_banned");
      }
    },
    subSkill: {
      banned: {
        mod: {
          cardEnabled(card) {
            return false;
          },
          cardSavable(card) {
            return false;
          }
        }
      }
    }
  },
  //小虎
  remeibu: {
    audio: "meibu",
    trigger: {
      global: "phaseUseBegin"
    },
    filter(event, player) {
      return event.player != player && event.player.isIn() && event.player.inRange(player) && player.countCards("he") > 0;
    },
    direct: true,
    derivation: ["rezhixi"],
    checkx(event, player) {
      if (get.attitude(player, event.player) >= 0) {
        return false;
      }
      return event.player.countCards("h") > event.player.hp;
    },
    async content(event, trigger, player) {
      const check = lib.skill.new_meibu.checkx(trigger, player);
      const result = await player.chooseToDiscard(get.prompt2("remeibu", trigger.player), "he").set("ai", (card) => {
        if (_status.event.check) {
          return 6 - get.value(card);
        }
        return 0;
      }).set("check", check).set("logSkill", ["remeibu", trigger.player]).forResult();
      if (result.bool) {
        const target = trigger.player;
        const card = result.cards[0];
        player.line(target, "green");
        player.markAuto("remeibu_gain", [get.suit(card, player)]);
        player.addTempSkill("remeibu_gain");
        target.addTempSkills("rezhixi", "phaseUseEnd");
      }
    },
    ai: {
      expose: 0.2
    },
    subSkill: {
      gain: {
        trigger: { global: "loseAfter" },
        forced: true,
        charlotte: true,
        popup: false,
        onremove: true,
        filter(event, player) {
          return event.getParent(3).name == "rezhixi" && player.getStorage("remeibu_gain").includes(get.suit(event.cards[0], event.player)) && get.position(event.cards[0]) == "d";
        },
        async content(event, trigger, player) {
          player.gain(trigger.cards[0], "gain2");
        }
      }
    }
  },
  remumu: {
    audio: "mumu",
    trigger: { player: "phaseUseBegin" },
    filter(event, player) {
      return game.hasPlayer(function(current) {
        return current.countCards("e") > 0;
      });
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(get.prompt2(event.skill), function(card, player2, target) {
        return target.countCards("e") > 0;
      }).set("ai", function(target) {
        const player2 = _status.event.player;
        const att = get.attitude(player2, target);
        const es = target.getCards("e");
        let eff;
        for (const i of es) {
          eff = -(get.value(i, target) - 0.1) * att;
        }
        return eff;
      }).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      let result;
      if (player == target) {
        result = { index: 0 };
      } else {
        const str = get.translation(target);
        result = await player.chooseControl().set("choiceList", ["弃置" + str + "装备区的一张牌且本阶段使用【杀】的次数上限+1", "获得" + str + "装备区的一张牌且本阶段使用【杀】的次数上限-1"]).set("ai", function() {
          const player2 = _status.event.player;
          if (player2.countCards("hs", function(card) {
            return get.name(card, player2) == "sha" && player2.hasValueTarget(card);
          }) < Math.max(1, player2.getCardUsable("sha"))) {
            return 1;
          }
          return 0;
        }).forResult();
      }
      if (result?.index == 0) {
        player.addTempSkill(`${event.name}_effect`, "phaseUseAfter");
        await player.discardPlayerCard({ target, position: "e", forced: true });
      } else {
        player.addTempSkill(`${event.name}_debuff`, "phaseUseAfter");
        await player.gainPlayerCard({ target, position: "e", forced: true });
      }
    },
    subSkill: {
      debuff: {
        charlotte: true,
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num - 1;
            }
          }
        },
        mark: true,
        intro: {
          markcount: () => -1,
          content: "出杀次数-1"
        }
      },
      effect: {
        charlotte: true,
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") {
              return num + 1;
            }
          }
        },
        mark: true,
        intro: {
          markcount: () => 1,
          content: "出杀次数+1"
        }
      }
    }
  },
  rezhixi: {
    trigger: {
      player: "useCard"
    },
    forced: true,
    filter(event, player) {
      return (event.card.name == "sha" || get.type(event.card) == "trick") && player.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      player.chooseToDiscard("h", true);
    },
    ai: {
      neg: true,
      nokeep: true
    }
  },
  //董白
  relianzhu: {
    audio: "lianzhu",
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    filterCard: true,
    discard: false,
    lose: false,
    delay: false,
    position: "he",
    filterTarget: lib.filter.notMe,
    check(card) {
      var num = get.value(card);
      if (get.color(card) == "black") {
        if (num >= 6) {
          return 0;
        }
        return 9 - num;
      } else {
        return 7 - num;
      }
    },
    async content(event, trigger, player) {
      const { cards: cards2, target } = event;
      player.give(cards2, target, true);
      if (get.color(cards2[0], player) == "red") {
        await player.draw();
        return;
      }
      const result = await target.chooseToDiscard("he", 2, "弃置两张牌，或令" + get.translation(player) + "摸两张牌").set("goon", get.attitude(target, player) < 0).set("ai", function(card) {
        if (!_status.event.goon) {
          return -get.value(card);
        }
        return 6 - get.value(card);
      }).forResult();
      if (!result.bool) {
        await player.draw(2);
      }
    },
    ai: {
      order: 3,
      expose: 0.2,
      result: {
        target(player, target) {
          if (ui.selected.cards.length && get.color(ui.selected.cards[0]) == "red") {
            if (target.countCards("h") < player.countCards("h")) {
              return 1;
            }
            return 0.5;
          }
          return -1;
        }
      }
    }
  },
  rexiahui: {
    audio: "xiahui",
    mod: {
      ignoredHandcard(card, player) {
        if (get.color(card, player) == "black") {
          return true;
        }
      },
      cardDiscardable(card, player, name) {
        if (name == "phaseDiscard" && get.color(card, player) == "black") {
          return false;
        }
      }
    },
    trigger: { global: "phaseEnd" },
    forced: true,
    logTarget: "player",
    filter(event, player) {
      var target = event.player;
      return target != player && target.countCards("h", function(card) {
        return card.hasGaintag("rexiahui");
      }) == 0 && target.getHistory("lose", function(evt) {
        for (var i in evt.gaintag_map) {
          if (evt.gaintag_map[i].includes("rexiahui")) {
            return true;
          }
        }
      }).length > 0;
    },
    async content(event, trigger, player) {
      trigger.player.loseHp();
    },
    group: "rexiahui_gain",
    subSkill: {
      gain: {
        trigger: { global: "gainEnd" },
        forced: true,
        popup: false,
        filter(event, player) {
          if (player == event.player) {
            return false;
          }
          var evt = event.getl(player);
          return evt && evt.cards2 && evt.cards2.filter(function(card) {
            return get.color(card, player) == "black";
          }).length > 0;
        },
        async content(event, trigger, player) {
          trigger.player.addSkill("rexiahui_block");
          var cards2 = trigger.getl(player).cards2.filter(function(card) {
            return get.color(card, player) == "black";
          });
          trigger.player.addGaintag(cards2, "rexiahui");
        }
      },
      block: {
        mod: {
          cardEnabled2(card) {
            if (get.itemtype(card) == "card" && card.hasGaintag("rexiahui")) {
              return false;
            }
          },
          cardDiscardable(card) {
            if (card.hasGaintag("rexiahui")) {
              return false;
            }
          }
        },
        charlotte: true,
        forced: true,
        popup: false,
        trigger: { player: "changeHp" },
        filter(event, player) {
          return event.changedHp < 0;
        },
        async content(event, trigger, player) {
          player.removeSkill("rexiahui_block");
        },
        onremove(player) {
          player.removeGaintag("rexiahui");
        }
      }
    }
  },
  //周善
  dcmiyun: {
    audio: 2,
    trigger: { global: ["roundStart", "roundEnd"] },
    filter(event, player, name) {
      if (name === "roundStart") {
        return game.hasPlayer((current) => current != player && current.countGainableCards(player, "he"));
      }
      return player.hasCard((card) => card.hasGaintag("dcmiyun_tag"), "h") && game.hasPlayer((current) => current != player);
    },
    forced: true,
    direct: true,
    group: "dcmiyun_lose",
    async content(event, trigger, player) {
      switch (event.triggername) {
        case "roundStart": {
          const result = await player.chooseTarget("密运：获得一名其他角色的一张牌，称为“安”", true, (card, player2, target) => {
            return target != player2 && target.countGainableCards(player2, "he");
          }).set("ai", (target) => {
            return get.effect(target, { name: "shunshou_copy2" }, _status.event.player, _status.event.player);
          }).forResult();
          if (result?.bool && result.targets?.length) {
            const target = result.targets[0];
            player.logSkill("dcmiyun", target);
            const next = player.gainPlayerCard(target, true, "visibleMove");
            next.gaintag.add("dcmiyun_tag");
            await next;
          }
          break;
        }
        case "roundEnd": {
          const result2 = await player.chooseCardTarget({
            prompt: "密运：将包括“安”在内的任意张手牌交给一名其他角色",
            forced: true,
            filterTarget: lib.filter.notMe,
            selectCard: [1, Infinity],
            filterOk() {
              for (var card of ui.selected.cards) {
                if (card.hasGaintag("dcmiyun_tag")) {
                  return true;
                }
              }
              return false;
            },
            goon: game.hasPlayer((current) => player != current && get.attitude(player, current) > 0),
            allowChooseAll: true,
            ai1(card) {
              if (get.itemtype(card) != "card") {
                return 0;
              }
              if (card.hasGaintag("dcmiyun_tag")) {
                return 100;
              }
              if (_status.event.goon) {
                return 8 - get.value(card);
              }
              return -get.value(card);
            },
            ai2(target) {
              return get.attitude(_status.event.player, target);
            }
          }).forResult();
          if (result2?.bool && result2.cards?.length && result2.targets?.length) {
            const {
              targets: [target],
              cards: cards2
            } = result2;
            player.logSkill("dcmiyun", target);
            await player.give(cards2, target);
            await player.drawTo(player.maxHp);
          }
          break;
        }
      }
    },
    mod: {
      aiValue(player, card, num) {
        if (get.itemtype(card) == "card" && card.hasGaintag("dcmiyun_tag")) {
          return Math.abs(num) * 10;
        }
      },
      aiUseful() {
        return lib.skill.dcmiyun.mod.aiValue.apply(this, arguments);
      },
      aiOrder(player, card, num) {
        if (get.itemtype(card) == "card" && card.hasGaintag("dcmiyun_tag")) {
          return 0;
        }
      }
    },
    subSkill: {
      lose: {
        audio: "dcmiyun",
        trigger: {
          player: "loseAfter",
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        forced: true,
        filter(event, player) {
          if (event.getParent().name == "dcmiyun") {
            return false;
          }
          var evt = event.getl(player);
          if (!evt || !evt.cards2 || !evt.cards2.length) {
            return false;
          }
          if (event.name == "lose") {
            for (var i in event.gaintag_map) {
              if (event.gaintag_map[i].includes("dcmiyun_tag")) {
                return true;
              }
            }
            return false;
          }
          return player.hasHistory("lose", (evt2) => {
            if (event != evt2.getParent()) {
              return false;
            }
            for (var i2 in evt2.gaintag_map) {
              if (evt2.gaintag_map[i2].includes("dcmiyun_tag")) {
                return true;
              }
            }
            return false;
          });
        },
        async content(event, trigger, player) {
          player.loseHp();
        }
      }
    }
  },
  dcdanying: {
    audio: 2,
    mod: {
      aiOrder(player, card, num) {
        if (num <= 0 || card.name !== "sha" && card.name !== "shan" || !player.hasCard((i) => i.hasGaintag("dcmiyun_tag"), "h")) {
          return;
        }
        return Math.max(0.12, num / 25);
      }
    },
    locked: false,
    enable: ["chooseToUse", "chooseToRespond"],
    usable: 1,
    hiddenCard(player, name) {
      if (!_status.connectMode && !player.hasCard((card) => card.hasGaintag("dcmiyun_tag"), "h")) {
        return false;
      }
      return name == "sha" || name == "shan";
    },
    filter(event, player) {
      if (event.type == "wuxie" || !player.hasCard((card) => card.hasGaintag("dcmiyun_tag"), "h")) {
        return false;
      }
      for (var name of ["sha", "shan"]) {
        if (event.filterCard({ name, isCard: true }, player, event)) {
          return true;
        }
      }
      return false;
    },
    chooseButton: {
      dialog(event, player) {
        var vcards = [];
        for (var name of ["sha", "shan"]) {
          var card = { name, isCard: true };
          if (event.filterCard(card, player, event)) {
            vcards.push(["基本", "", name]);
          }
        }
        var dialog = ui.create.dialog("胆迎", [vcards, "vcard"], "hidden");
        dialog.direct = true;
        return dialog;
      },
      backup(links, player) {
        return {
          filterCard: () => false,
          selectCard: -1,
          viewAs: {
            name: links[0][2],
            isCard: true
          },
          popname: true,
          async precontent(event, trigger, player2) {
            player2.logSkill("dcdanying");
            player2.showCards(
              player2.getCards("h", (card) => card.hasGaintag("dcmiyun_tag")),
              get.translation(player2) + "的“安”"
            );
            player2.addTempSkill("dcdanying_discard");
          }
        };
      },
      prompt(links, player) {
        return "展示“安”，然后视为使用【" + get.translation(links[0][2]) + "】";
      }
    },
    ai: {
      order(item, player) {
        var o1 = get.order({ name: "sha" }), o2 = get.order({ name: "shan" });
        if (player.countCards("h") > 3 || player == _status.currentPhase) {
          return Math.max(o1, o2) + 0.1;
        }
        return Math.min(o1, o2) - 0.1;
      },
      combo: "dcmiyun",
      respondSha: true,
      respondShan: true,
      skillTagFilter(player, tag, arg) {
        if (!player.hasCard((card) => card.hasGaintag("dcmiyun_tag"), "h")) {
          return false;
        }
      },
      result: {
        player: 1
      }
    },
    subSkill: {
      discard: {
        audio: "dcdanying",
        trigger: { target: "useCardToTargeted" },
        charlotte: true,
        forced: true,
        filter(event, player) {
          return player.countDiscardableCards(event.player, "he");
        },
        async content(event, trigger, player) {
          trigger.player.discardPlayerCard(player, "he", true);
          player.removeSkill("dcdanying_discard");
        },
        ai: {
          effect: {
            target_use(card, player, target) {
              if (_status._dcdanying_aiChecking) {
                return;
              }
              _status._dcdanying_aiChecking = true;
              let eff = get.effect(target, { name: "guohe_copy2" }, player, player);
              delete _status._dcdanying_aiChecking;
              return [1, get.sgn(eff)];
            }
          }
        }
      }
    }
  },
  //蔡阳
  dcxunji: {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target != player && !player.getStorage("dcxunji_effect").includes(target);
    },
    async content(event, trigger, player) {
      const { target } = event;
      player.markAuto("dcxunji_effect", [target]);
      player.addTempSkill("dcxunji_effect", { player: "die" });
      target.addTempSkill("dcxunji_mark", { player: "phaseEnd" });
    },
    ai: {
      order: 1,
      result: {
        player(player, target) {
          if (player.hp < 2) {
            return 0;
          }
          return get.effect(target, { name: "juedou" }, player, player);
        }
      }
    },
    subSkill: {
      mark: {
        mark: true,
        marktext: "嫉",
        intro: { content: "你已经被盯上了！" }
      },
      effect: {
        audio: "dcxunji",
        charlotte: true,
        trigger: { global: "phaseJieshuBegin" },
        forced: true,
        popup: false,
        onremove: true,
        filter(event, player) {
          return player.getStorage("dcxunji_effect").includes(event.player);
        },
        async content(event, trigger, player) {
          const target = trigger.player;
          if (target.getHistory("useCard", (evt) => get.color(evt.card) == "black").length > 0 && player.canUse("juedou", target)) {
            await player.useCard({ name: "juedou", isCard: true }, target, event.name);
          }
          player.unmarkAuto(event.name, [target]);
          if (!player.getStorage(event.name).length) {
            player.removeSkill(event.name);
          }
        },
        group: "dcxunji_loseHp"
      },
      loseHp: {
        trigger: { source: "damageSource" },
        forced: true,
        popup: false,
        filter(event, player) {
          return event.card && event.card.name == "juedou" && event.getParent().skill == "dcxunji_effect" && event.player.isIn();
        },
        async content(event, trigger, player) {
          trigger.player.line(player);
          player.damage(trigger.num, trigger.player);
        }
      }
    }
  },
  dcjiaofeng: {
    audio: 2,
    trigger: { source: "damageBegin1" },
    forced: true,
    usable: 1,
    filter(event, player) {
      return player.isDamaged() && !player.getHistory("sourceDamage").length;
    },
    async content(event, trigger, player) {
      var num = player.getDamagedHp();
      if (num > 0) {
        player.draw();
      }
      if (num > 1) {
        trigger.num++;
      }
      if (num > 2) {
        player.recover();
      }
    }
  },
  //夏侯杰
  liedan: {
    audio: 2,
    trigger: { global: "phaseZhunbeiBegin" },
    forced: true,
    filter(event, player) {
      return player != event.player || player.countMark("liedan") > 4;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      if (player == trigger.player) {
        player.die();
        return;
      }
      var num = 0;
      if (player.hp > trigger.player.hp) {
        num++;
      }
      if (player.countCards("h") > trigger.player.countCards("h")) {
        num++;
      }
      if (player.countCards("e") > trigger.player.countCards("e")) {
        num++;
      }
      if (num) {
        player.draw(num);
        if (num == 3 && player.maxHp < 8) {
          player.gainMaxHp();
        }
      } else {
        player.addMark("liedan", 1);
        player.loseHp();
      }
    },
    intro: { content: "mark" },
    ai: {
      halfneg: true
    }
  },
  zhuangdan: {
    audio: 2,
    trigger: { global: "phaseEnd" },
    forced: true,
    filter(event, player) {
      return player != event.player && player.isMaxHandcard(true);
    },
    async content(event, trigger, player) {
      player.addTempSkill("zhuangdan_mark", { player: "phaseEnd" });
      player.tempBanSkill("liedan", { player: "phaseEnd" });
    },
    ai: { combo: "liedan" },
    subSkill: {
      mark: {
        charlotte: true,
        mark: true,
        marktext: "胆",
        intro: { content: "我超勇的" }
      }
    }
  },
  //乌巢酒仙
  recangchu: {
    audio: 2,
    trigger: { global: "phaseBefore", player: "enterGame" },
    marktext: "粮",
    forced: true,
    filter(event, player) {
      if (event.name == "phase" && game.phaseNumber != 0) {
        return false;
      }
      return player.countMark("recangchu") < game.countPlayer();
    },
    async content(event, trigger, player) {
      player.addMark("recangchu", Math.min(3, game.countPlayer() - player.countMark("recangchu")));
    },
    ai: {
      notemp: true
    },
    intro: { content: "mark", name: "粮" },
    mod: {
      maxHandcard(player, num) {
        return num + player.countMark("recangchu");
      }
    },
    group: ["recangchu2", "recangchu3"]
  },
  recangchu2: {
    audio: "recangchu",
    trigger: {
      player: "gainAfter",
      global: "loseAsyncAfter"
    },
    forced: true,
    usable: 1,
    sourceSkill: "recangchu",
    filter(event, player) {
      return player != _status.currentPhase && player.countMark("recangchu") < game.countPlayer() && event.getg(player).length > 0;
    },
    async content(event, trigger, player) {
      player.addMark("recangchu", 1);
    }
  },
  recangchu3: {
    audio: "recangchu",
    trigger: { global: "die" },
    forced: true,
    sourceSkill: "recangchu",
    filter(event, player) {
      return player.countMark("recangchu") > game.countPlayer();
    },
    async content(event, trigger, player) {
      player.removeMark("recangchu", player.countMark("recangchu") - game.countPlayer());
    }
  },
  reliangying: {
    audio: 2,
    trigger: { player: "phaseDiscardBegin" },
    filter(event, player) {
      return player.hasMark("recangchu");
    },
    direct: true,
    async content(event, trigger, player) {
      const draws = Array.from({ length: player.countMark("recangchu") }).map((_, i) => get.cnNumber(i + 1) + "张");
      const { control } = await player.chooseControl(draws, "cancel2").set("prompt", get.prompt("reliangying")).set("prompt2", "摸至多" + get.cnNumber(player.countMark("recangchu")) + "张牌，然后交给等量的角色各一张牌").set("ai", () => {
        const player2 = get.event().player;
        const num = Math.min(
          player2.countMark("recangchu"),
          game.countPlayer((current) => get.attitude(player2, current) > 0)
        );
        if (num > 0) {
          return get.cnNumber(num) + "张";
        }
        return "cancel2";
      }).forResult();
      if (control != "cancel2") {
        player.logSkill("reliangying");
        const num = draws.indexOf(control) + 1, max = Math.min(num, player.countCards("he"), game.countPlayer());
        await player.draw(num);
        let list = [];
        if (_status.connectMode) {
          game.broadcastAll(() => _status.noclearcountdown = true);
        }
        while (max - list.length > 0) {
          const { bool, cards: cards2, targets } = await player.chooseCardTarget({
            prompt: "粮营：将" + get.cnNumber(max - 1) + "至" + get.cnNumber(max) + "张牌交给其他角色",
            position: "he",
            animate: false,
            filterCard(card, player2) {
              return !get.event().list.some((list2) => list2[1] == card);
            },
            filterTarget(card, player2, target) {
              return target != player2 && !get.event().list.some((list2) => list2[0] == target);
            },
            ai1(card) {
              if (card.name == "shan") {
                return 1;
              }
              return Math.random();
            },
            ai2(target) {
              return get.attitude(get.event().player, target);
            }
          }).set("list", list).set("forced", max - list.length > 1).forResult();
          if (bool) {
            list.push([targets[0], cards2[0]]);
            player.addGaintag(cards2, "olsujian_given");
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
          await game.loseAsync({
            gain_list: list,
            player,
            cards: list.slice().flatMap((list2) => list2[1]),
            giver: player,
            animate: "giveAuto"
          }).setContent("gaincardMultiple");
        }
      }
    },
    ai: {
      combo: "recangchu"
    }
  },
  reshishou: {
    audio: 2,
    trigger: { player: ["useCard", "damageEnd"] },
    forced: true,
    filter(event, player) {
      if (!player.countMark("recangchu")) {
        return false;
      }
      return event.name == "damage" ? event.hasNature("fire") : event.card && event.card.name == "jiu";
    },
    async content(event, trigger, player) {
      player.removeMark("recangchu", Math.min(player.countMark("recangchu"), trigger.num || 1));
    },
    ai: {
      combo: "recangchu",
      neg: true
    },
    group: "reshishou2"
  },
  reshishou2: {
    audio: "reshishou",
    trigger: { player: "phaseZhunbeiBegin" },
    forced: true,
    sourceSkill: "reshishou",
    filter(event, player) {
      return !player.countMark("recangchu");
    },
    async content(event, trigger, player) {
      player.loseHp();
    }
  },
  //曹性
  cxliushi: {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.countCards("he", { suit: "heart" }) > 0;
    },
    filterCard: { suit: "heart" },
    position: "he",
    filterTarget(card, player, target) {
      return player.canUse("sha", target, false);
    },
    check(card) {
      var player = _status.event.player;
      var next = player.getNext();
      var att = get.attitude(player, next);
      if (att > 0) {
        var js = next.getCards("j");
        if (js.length) {
          return get.judge(js[0]) + 10 - get.value(card);
        }
        return 9 - get.value(card);
      }
      return 6 - get.value(card);
    },
    discard: false,
    prepare: "throw",
    loseTo: "cardPile",
    visible: true,
    insert: true,
    async content(event, trigger, player) {
      const { cards: cards2, targets } = event;
      game.log(player, "将", cards2, "置于牌堆顶");
      await player.useCard({ name: "sha", isCard: true, storage: { cxliushi: true } }, false, targets);
    },
    group: "cxliushi_damage",
    subSkill: {
      damage: {
        trigger: { source: "damageSource" },
        forced: true,
        popup: false,
        filter(event, player) {
          return event.card?.storage?.cxliushi == true && event.player.isIn() && event.getParent(3).name == "cxliushi";
        },
        async content(event, trigger, player) {
          trigger.player.addMark("cxliushi2", 1);
          trigger.player.addSkill("cxliushi2");
        }
      }
    },
    ai: {
      order() {
        return get.order({ name: "sha" }) - 0.4;
      },
      result: {
        target(player, target) {
          var eff = get.effect(target, { name: "sha" }, player, target);
          var damageEff = get.damageEffect(target, player, player);
          if (eff > 0) {
            return damageEff > 0 ? 0 : eff;
          }
          if (target.hasSkill("bagua_skill") || target.hasSkill("rw_bagua_skill") || target.hasSkill("bazhen")) {
            return 0;
          }
          return eff;
        }
      }
    }
  },
  cxliushi2: {
    mod: {
      maxHandcard(player, num) {
        return num - player.countMark("cxliushi2");
      }
    },
    onremove: true,
    charlotte: true,
    intro: {
      name2: "流",
      content: "手牌上限-#"
    }
  },
  zhanwan: {
    audio: 2,
    trigger: { global: "phaseDiscardEnd" },
    forced: true,
    filter(event, player) {
      return event.player.hasSkill("cxliushi2") && event.player.getHistory("lose", function(evt) {
        if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) {
          return true;
        }
      }).length > 0;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      trigger.player.removeSkill("cxliushi2");
      let num = 0;
      trigger.player.getHistory("lose", function(evt) {
        if (evt.type == "discard" && evt.getParent("phaseDiscard") == trigger) {
          num += evt.cards2.length;
        }
      });
      await player.draw(num);
    },
    ai: {
      combo: "cxliushi"
    }
  },
  //说出吾名吓汝一跳
  xuxie: {
    audio: 2,
    trigger: { player: "phaseUseBegin" },
    logTarget(event, player) {
      return game.filterPlayer(function(current) {
        return get.distance(player, current) <= 1;
      }).sortBySeat();
    },
    check(event, player) {
      if (player.isHealthy()) {
        return false;
      }
      var list = game.filterPlayer(function(current) {
        return get.distance(player, current) <= 1;
      });
      var draw = 0;
      var discard = 0;
      var num = 2 / player.getDamagedHp();
      while (list.length) {
        var target = list.shift();
        var att = get.attitude(player, target);
        if (att > 0) {
          draw++;
          if (target.countDiscardableCards(player, "he") > 0) {
            discard--;
          }
        }
        if (att == 0) {
          draw--;
          if (target.countDiscardableCards(player, "he") > 0) {
            discard--;
          }
        }
        if (att < 0) {
          draw--;
          if (target.countDiscardableCards(player, "he") > 0) {
            discard++;
          }
        }
      }
      return draw >= num || discard >= num;
    },
    async content(event, trigger, player) {
      await player.loseMaxHp();
      const targets = game.filterPlayer(function(current) {
        return get.distance(player, current) <= 1;
      }).sortBySeat();
      if (!targets.length) {
        return;
      }
      event.targets = targets;
      const result = await player.chooseControl().set("choiceList", ["弃置" + get.translation(targets) + "的各一张牌", "令" + get.translation(targets) + "各摸一张牌"]).set("ai", function() {
        let player2 = _status.event.player;
        let list = _status.event.getParent().targets.slice(0);
        let draw = 0;
        let discard = 0;
        while (list.length) {
          let target = list.shift();
          let att = get.attitude(player2, target);
          if (att > 0) {
            draw++;
            if (target.countDiscardableCards(player2, "he") > 0) {
              discard--;
            }
          }
          if (att < 0) {
            draw--;
            if (target.countDiscardableCards(player2, "he") > 0) {
              discard++;
            }
          }
        }
        if (draw > discard) {
          return 1;
        }
        return 0;
      }).forResult();
      if (result.index == 1) {
        await game.asyncDraw(targets);
        await game.delay();
        return;
      }
      while (targets.length) {
        const target = targets.shift();
        if (target.countDiscardableCards(player, "he") > 0) {
          await player.discardPlayerCard(target, "he", true);
        }
      }
    },
    group: "xuxie_add",
    subSkill: {
      add: {
        audio: "xuxie",
        trigger: { player: "phaseUseEnd" },
        forced: true,
        locked: false,
        filter(event, player) {
          return game.hasPlayer(function(current) {
            return current.maxHp > player.maxHp;
          });
        },
        async content(event, trigger, player) {
          player.gainMaxHp();
          player.chooseDrawRecover(2, true);
        }
      }
    }
  },
  // 夏侯恩
  chijian: {
    audio: 2,
    init(player, skill) {
      player.addExtraEquip(skill, "qinggang", true, (player2) => player2.hasEmptySlot(1) && lib.card.qinggang);
    },
    onremove(player, skill) {
      player.removeExtraEquip(skill);
    },
    mod: {
      cardUsable(card, player, num) {
        if (card.name === "sha" && player.isPhaseUsing()) return num + 1;
      }
    },
    group: "chijian_qinggang",
    subSkill: {
      qinggang: {
        mod: {
          attackRangeBase(player) {
            const num = lib.card.qinggang.distance.attackFrom;
            if (typeof num != "number" || !player.hasEmptySlot(1)) {
              return;
            }
            return Math.max(player.getEquipRange(player.getCards("e")), 1 - num);
          }
        },
        audio: "chijian",
        inherit: "qinggang_skill",
        filter(event, player) {
          if (!player.hasEmptySlot(1)) return false;
          return event.card.name == "sha";
        }
      }
    }
  },
  shiwu: {
    audio: 2,
    trigger: { global: "phaseBegin" },
    filter(event, player) {
      if (event.player === player) return false;
      const juedou = new lib.element.VCard({ name: "juedou", isCard: true });
      return player.canUse(juedou, event.player);
    },
    prompt2(event, player) {
      return `视为对${get.translation(event.player)}使用【决斗】，失败则本回合抢走你的剑`;
    },
    check(event, player) {
      const juedou = new lib.element.VCard({ name: "juedou", isCard: true });
      const target = event.player;
      const shas = target.mayHaveSha(player, "respond", null, "count") - player.mayHaveSha(player, "respond", null, "count");
      return get.effect(target, juedou, player, player) > 0 && get.attitude(player, target) <= 0 && shas <= 0;
    },
    logTarget: "player",
    async content(event, trigger, player) {
      const target = trigger.player;
      const next = player.useCard({
        card: new lib.element.VCard({ name: "juedou", isCard: true }),
        targets: [target]
      });
      await next;
      if (player.hasHistory("sourceDamage", (evt) => evt.getParent(2) == next && evt.player === target)) {
        const card = get.cardPile((card2) => get.is.damageCard(card2), "bottom");
        if (card) await player.gain(card, "draw");
      }
      if (target.hasHistory("sourceDamage", (evt) => evt.getParent(2) == next && evt.player === player)) {
        await target.addTempSkills("chijian", { player: "phaseEnd" });
        await player.removeSkills("chijian");
        target.when({ player: "phaseEnd" }).step(async () => {
          await player.addSkills("chijian");
        });
      }
    },
    group: "shiwu_lose",
    derivation: "chijian",
    subSkill: {
      lose: {
        audio: "shiwu",
        trigger: { player: "dieAfter" },
        filter(event, player) {
          return event.source?.isIn();
        },
        forced: true,
        locked: false,
        forceDie: true,
        async content(event, trigger, player) {
          await trigger.source.addSkills("chijian");
        }
      }
    }
  },
  //新潘凤
  xinkuangfu: {
    enable: "phaseUse",
    usable: 1,
    audio: 2,
    delay: false,
    filterTarget(card, player, target) {
      if (player == target) {
        return player.countCards("e", function(card2) {
          return lib.filter.cardDiscardable(card2, player);
        }) > 0;
      }
      return target.countDiscardableCards(player, "e") > 0;
    },
    filter(event, player) {
      return game.hasPlayer(function(current) {
        return current.countCards("e") > 0;
      });
    },
    useShaValue(player) {
      let cache = _status.event.getTempCache("xinkuangfu", "useShaValue");
      if (cache) {
        return cache;
      }
      let eff = -Infinity, odds = 0, tar = null;
      game.countPlayer((cur) => {
        if (!player.canUse("sha", cur, false)) {
          return;
        }
        let eff2 = get.effect(cur, { name: "sha" }, player, player);
        if (eff2 < eff) {
          return;
        }
        let directHit = 1 - cur.mayHaveShan(player, "use", true, "odds");
        if (get.attitude(player, cur) > 0) {
          directHit = 1;
        } else {
          eff2 *= directHit;
        }
        if (eff2 <= eff) {
          return;
        }
        tar = cur;
        eff = eff2;
        odds = directHit;
      });
      _status.event.putTempCache("xinkuangfu", "useShaValue", {
        tar,
        eff,
        odds
      });
      return { tar, eff, odds };
    },
    async content(event, trigger, player) {
      const target = event.target;
      if (player == target) {
        await player.chooseToDiscard("e", true);
      } else {
        await player.discardPlayerCard(target, "e", true);
      }
      await player.chooseUseTarget("sha", true, false, "nodistance");
      const bool = game.hasPlayer2((current) => {
        return current.getHistory("damage", (evt) => evt.getParent("xinkuangfu") == event).length > 0;
      });
      if (player == target && bool) {
        await player.draw(2);
      } else if (player != target && !bool) {
        await player.chooseToDiscard("h", 2, true);
      }
    },
    ai: {
      order() {
        return get.order({ name: "sha" }) - 0.3;
      },
      result: {
        player(player, target) {
          let cache = lib.skill.xinkuangfu.useShaValue(player), eff = cache.eff / 10;
          if (player === target) {
            return 2 * cache.odds + eff;
          }
          return Math.min(2, player.countCards("h")) * (cache.odds - 1) + eff;
        },
        target(player, target) {
          let att = get.attitude(player, target), max = 0, min = 1;
          target.countCards("e", function(card) {
            var val = get.value(card, target);
            if (val > max) {
              max = val;
            }
            if (val < min) {
              min = val;
            }
          });
          if (att <= 0) {
            if (target.hasSkillTag("noe")) {
              return 2 - max / 3;
            }
            if (min <= 0) {
              return 1;
            }
            return -max / 3;
          }
          if (target.hasSkillTag("noe")) {
            return 2 - min / 4;
          }
          if (min <= 0) {
            return 1;
          }
          if (player === target) {
            let cache = lib.skill.xinkuangfu.useShaValue(player);
            return cache.eff / 10 - 1;
          }
          return 0;
        }
      }
    }
  }
};
const translates = {
  dc_feiyi: "新杀费祎",
  dc_feiyi_prefix: "新杀",
  dcqiansu: "谦素",
  dcqiansu_info: "其他角色的结束阶段，若其手牌数比你多，你可以摸三张牌，然后交给该角色其中一张。",
  dcxingbang: "兴邦",
  dcxingbang_info: "出牌阶段限一次，你可以摸一张牌并交给一名其他角色一张牌。然后你获得其一张手牌，若此牌：是你交给该角色的牌，视为对其使用一张【杀】；不是你交给该角色的牌，重复获得牌的流程（至多获得三张）。",
  dcfanhuo: "泛祸",
  dcfanhuo_info: `限定技，出牌阶段，你可令${get.poptip("dcxingbang")}改为“出牌阶段限三次”直到回合结束，然后你于此回合结束时失去3点体力。`,
  re_panfeng: "潘凤",
  xinkuangfu: "狂斧",
  xinkuangfu_info: "出牌阶段限一次，你可选择：1，弃置装备区里的一张牌，你使用无对应实体牌的普【杀】。若此【杀】造成伤害，你摸两张牌。2，弃置一名其他角色装备区里的一张牌，你使用无对应实体牌的普【杀】。若此【杀】未造成伤害，你弃置两张手牌。（均无距离和次数限制）",
  xingdaorong: "邢道荣",
  xuxie: "虚猲",
  xuxie_info: "出牌阶段开始时，你可以减1点体力上限并选择所有距离1以内的角色，弃置这些角色的各一张牌或令这些角色各摸一张牌。出牌阶段结束时，若你的体力上限不为全场最多，则你加1点体力上限，然后回复1点体力或摸两张牌。",
  dc_xiahouen: "新杀夏侯恩",
  dc_xiahouen_prefix: "新杀",
  chijian: "持剑",
  chijian_info: `锁定技。①你于出牌阶段内使用【杀】的次数上限+1。②若你的武器栏为空，视为你装备着${get.poptip("qinggang")}。`,
  shiwu: "恃武",
  shiwu_info: `①其他角色的回合开始时，你可以视为对其使用【决斗】，若你以此法对其造成伤害，你从牌堆中获得一张伤害牌；若其以此法对你造成伤害，直到其回合结束，其获得${get.poptip("chijian")}且你失去${get.poptip("chijian")}。②一名角色杀死你后，其获得${get.poptip("chijian")}。`,
  caoxing: "曹性",
  cxliushi: "流矢",
  cxliushi2: "流矢",
  cxliushi_info: "出牌阶段，你可以将一张红桃牌置于牌堆顶，视为对一名角色使用一张【杀】（无距离限制且不计入使用次数）。当此【杀】造成伤害后，受到伤害的角色获得一个“流”。有“流”的角色手牌上限-X（X为其“流”数）。",
  zhanwan: "斩腕",
  zhanwan_info: "锁定技，有“流”的角色于弃牌阶段弃牌后，你摸等量的牌，然后其移去所有的“流”。",
  re_chunyuqiong: "淳于琼",
  recangchu: "仓储",
  recangchu2: "仓储",
  recangchu3: "仓储",
  recangchu_info: "锁定技。①游戏开始时，你获得3个“粮”。你的手牌上限+X（X为“粮”数）。②每回合限一次，当你于回合外得到牌后，你获得一个“粮”。（你的“粮”数不能超过存活角色数）",
  reliangying: "粮营",
  reliangying_info: "弃牌阶段开始时，你可以摸至多X张牌，然后交给等量的角色各一张牌。（X为你的“粮”数）",
  reshishou: "失守",
  reshishou2: "失守",
  reshishou_info: "锁定技，当你使用【酒】时或受到1点火焰伤害后，你移去一个“粮”。准备阶段，若你没有“粮”，你失去1点体力。",
  xiahoujie: "夏侯杰",
  liedan: "裂胆",
  liedan_info: "锁定技，其他角色的准备阶段开始时，若X大于0，则你摸X张牌。若X等于3，则你加1点体力上限（至多加到8）。若X为0，则你失去1点体力并获得一枚“裂”（X为你的手牌数，体力值，装备区牌数中大于其的数量）。准备阶段，若“裂”数大于4，则你死亡。",
  zhuangdan: "壮胆",
  zhuangdan_mark: "壮胆",
  zhuangdan_info: "锁定技，其他角色的回合结束时，若你的手牌数为全场唯一最多，则你令〖裂胆〗失效直到你下回合结束。",
  dc_caiyang: "蔡阳",
  dcxunji: "寻嫉",
  dcxunji_info: "出牌阶段限一次，你可以选择一名其他角色。该角色的下个结束阶段开始时，若其此回合使用过黑色牌，则你视为对其使用一张【决斗】，且当此【决斗】对其造成伤害后，其对你造成等量的伤害。",
  dcjiaofeng: "交锋",
  dcjiaofeng_info: "锁定技。每回合限一次，当你造成伤害时，若你本回合内未造成过其他伤害且你已损失的体力值：大于0，则你摸一张牌；大于1，则此伤害+1；大于2，则你回复1点体力。",
  zhoushan: "周善",
  dcmiyun: "密运",
  dcmiyun_tag: "安",
  dcmiyun_info: "锁定技。①每轮开始时，你正面向上获得一名其他角色的一张牌，称为“安”。②每轮结束时，若你有“安”，你将包括“安”的在内的任意张手牌交给一名其他角色，然后你将手牌补至体力上限。③当你不因〖密运②〗失去“安”后，你失去1点体力。",
  dcdanying: "胆迎",
  dcdanying_info: "每回合限一次。你可以展示“安”，然后视为使用或打出一张【杀】或【闪】。然后当你于本回合下一次成为牌的目标后，使用者弃置你的一张牌。",
  re_sunluyu: "孙鲁育",
  remeibu: "魅步",
  remeibu_info: "其他角色的出牌阶段开始时，若你在其攻击范围内，你可以弃置一张牌A，该角色于本阶段内拥有〖止息〗，且当其因〖止息〗弃置与牌A花色相同的牌时，你获得之。",
  rezhixi: "止息",
  rezhixi_info: "锁定技，当你使用【杀】或普通锦囊牌时，你弃置一张手牌。",
  remumu: "穆穆",
  remumu_info: "出牌阶段开始时，你可以选择一项：1.弃置一名其他角色装备区里的一张牌，然后你本回合可使用【杀】的次数+1；2.获得其他角色装备区里的一张牌，然后你本回合可使用【杀】的次数-1。",
  re_dongbai: "董白",
  relianzhu: "连诛",
  relianzhu_info: "出牌阶段限一次，你可将一张牌正面朝上交给一名其他角色。若此牌为：红色，你摸一张牌；黑色，对方弃置两张牌或令你摸两张牌。",
  rexiahui: "黠慧",
  rexiahui_info: "锁定技，①你的黑色牌不计入手牌上限。②当有其他角色获得你的黑色牌后，其于下次扣减体力值前不能使用，打出，弃置这些牌。③一名其他角色的回合结束时，若其本回合失去过其所有“黠慧”牌，则其失去1点体力。",
  heyan: "何晏",
  yachai: "崖柴",
  yachai_info: "当你受到伤害后，你可令伤害来源选择一项：①其本回合不能再使用手牌，然后你摸两张牌；②其展示所有手牌，然后将其手牌中一种花色的所有牌交给你；③弃置一半数量的手牌（向上取整）。",
  qingtan: "清谈",
  qingtan_info: "出牌阶段限两次，你可令所有有手牌的角色同时选择一张手牌并同时展示。你可以获得其中一种颜色的牌，然后展示此颜色牌的角色各摸一张牌。若如此做，弃置其他的牌。",
  zhaoyan: "赵嫣",
  jinhui: "锦绘",
  jinhui_info: "出牌阶段限一次，你可以随机亮出牌堆中的三张不具有“伤害”标签且使用目标范围为“自己”或“一名角色”的牌，然后选择一名其他角色。该角色选择并按如下“锦绘”规则使用其中一张，然后你可以按如下“锦绘”规则使用剩余的任意张牌：若此牌的使用目标为“自己”，则对自己使用该牌，否则对对方使用该牌（无距离限制且不计入次数限制）。",
  qingman: "轻幔",
  qingman_info: "锁定技。一名角色的回合结束时，你将手牌摸至X张（X为其装备区中空栏的数量）。",
  wangtao: "王桃",
  wangyue: "王悦",
  huguan: "护关",
  huguan_info: "一名角色于出牌阶段内使用第一张牌时，若此牌为红色，则你可以声明一种花色。该花色的牌不计入其本回合的手牌上限。",
  yaopei: "摇佩",
  yaopei_info: "其他角色的弃牌阶段结束时，若你本回合发动过〖护关〗，则你可以弃置一张与其于此阶段弃置的牌花色均不相同的牌。然后你选择一项：①其摸两张牌，你回复1点体力。②其回复1点体力，你摸两张牌。",
  mingluan: "鸣鸾",
  mingluan_info: "其他角色的结束阶段开始时，若有角色于本回合内回复过体力，则你可以弃置任意张牌，然后摸X张牌（X为当前角色的手牌数，且至多摸至五张）。",
  zhangxuan: "张嫙",
  tongli: "同礼",
  tongli_info: "当你于出牌阶段内使用基本牌或普通锦囊牌指定第一个目标后，若你手牌中的花色数和你于本阶段内使用过的牌数相等，则你可以令此牌额外结算X次（X为你手牌中的花色数）。",
  shezang: "奢葬",
  shezang_info: "每轮限一次。当你或你回合内的其他角色进入濒死状态时，你可以从牌堆中获得每种花色的牌各一张。",
  tengyin: "滕胤",
  chenjian: "陈见",
  chenjian_info: "准备阶段，你可亮出牌堆顶的3+X张牌（X为你“陈见”标记的数量且至多为2），然后执行以下一至两项：⒈弃置一张牌，然后令一名角色获得与你弃置牌花色相同的牌。⒉使用其中剩余的一张牌。若你执行了所有选项，则你获得一枚“陈见”并重铸所有手牌。",
  xixiu: "皙秀",
  xixiu_info: "锁定技。①当你成为其他角色使用牌的目标时，若你的装备区内有和此牌花色相同的牌，则你摸一张牌。②若你装备区内的牌数为1，则其他角色不能弃置你装备区内的牌。",
  zhangyao: "张媱",
  yuanyu: "怨语",
  yuanyu_info: "出牌阶段限一次。你可以摸两张牌，然后选择一张手牌和一名其他角色。该角色获得如下效果直到你发动〖夕颜〗：{你与该角色的弃牌阶段开始时，或当该角色造成1点伤害后，其须将一张手牌作为“怨”置于你的武将牌上}。然后你将你选择的手牌作为“怨”置于你的武将牌上。",
  xiyan: "夕颜",
  xiyan_info: "当有牌作为“怨”移动到你的武将牌上后，若“怨”中的花色数达到4种，则你可以获得所有“怨”。然后若当前回合角色：是你，你本回合手牌上限+4且使用牌无次数限制且重置你的〖怨语〗于此阶段的发动次数；不是你，你可令当前回合角色本回合手牌上限-4且不能使用基本牌。",
  xiahoulingnv: "夏侯令女",
  fuping: "浮萍",
  fuping_info: "①其他角色对你使用的牌结算结束后，若你未因此技能记录过此牌的名称且你有未废除的装备栏，则你可以废除一个装备栏，记录此牌的名称。②每回合每种牌名限一次。你可以将一张非基本牌当做〖浮萍①〗记录过的基本牌或锦囊牌使用或打出。③若你的所有装备栏均已被废除，则你使用牌无距离限制。",
  weilie: "炜烈",
  weilie_info: "每局游戏限X次。出牌阶段，你可以弃置一张牌并选择一名已受伤的角色，令该角色回复1点体力。然后若其体力值小于体力上限，则其摸两张牌（X为你〖浮萍①〗中的记录数+2）。",
  dc_sunru: "孙茹",
  xiecui: "撷翠",
  xiecui_info: "当有角色于回合内第一次因执行牌的效果而造成伤害时，你可以令此伤害+1。若其势力为吴，则该角色获得此伤害牌对应的实体牌，且其本回合的手牌上限+1。",
  youxu: "忧恤",
  youxu_info: "一名角色A的回合结束时，若其手牌数大于体力值，则你可以展示A的一张手牌，然后将此牌交给另一名角色B。若B的体力值为全场最少，则B回复1点体力。",
  huaxin: "华歆",
  wanggui: "望归",
  wanggui_info: "每回合限触发一次，当你造成或受到伤害后，若你：仅明置了此武将牌，则你可对与你势力不同的一名角色造成1点伤害；武将牌均明置，则你可令与你势力相同的角色各摸一张牌。",
  spwanggui: "望归",
  spwanggui_info: "①当你受到伤害后，你可以摸一张牌，或和一名势力相同的其他角色各摸一张牌；②每回合限一次，当你造成伤害后，你可以对一名与你势力不同的角色造成1点伤害。",
  xibing: "息兵",
  xibing_info: "每回合限一次，当其他角色于其出牌阶段内使用黑色【杀】或黑色普通锦囊牌指定唯一角色为目标后，你可令该角色将手牌摸至当前体力值（至多摸至五张）。若其因此摸牌，其本回合不能再使用牌。",
  luyusheng: "陆郁生",
  zhente: "贞特",
  zhente2: "贞特",
  zhente_info: "每回合限一次，当你成为其他角色使用基本牌或普通锦囊牌的目标后，你可令使用者选择一项：1.本回合不能再使用与此牌颜色相同的牌；2.此牌对你无效。",
  zhente_info_guozhan: "每回合限一次，当你成为其他角色使用黑色基本牌或黑色普通锦囊牌的目标后，你可令使用者选择一项：1.本回合不能再使用黑色牌；2.此牌对你无效。",
  zhiwei: "至微",
  zhiwei2: "至微",
  zhiwei_info: "游戏开始时/准备阶段，若场上没有因此法被选择过的角色存活，则你选择一名其他角色。该角色造成伤害后，你摸一张牌，该角色受到伤害后，你随机弃置一张手牌。你弃牌阶段弃置的牌均被该角色获得。",
  zhiwei_info_guozhan: "你明置此武将牌时，选择一名其他角色。该角色造成伤害后，你摸一张牌，该角色受到伤害后，你随机弃置一张手牌。你弃牌阶段弃置的牌均被该角色获得。该角色死亡时，若你的两个武将牌均明置，你暗置此武将牌。",
  zhanghu: "张虎",
  cuijian: "摧坚",
  cuijian_info: "出牌阶段限一次，你可以选择一名有手牌的其他角色。若其手牌中有【闪】，则其将所有【闪】和防具牌交给你，然后你交给其等量的牌。",
  zhtongyuan: "同援",
  zhtongyuan_info: "锁定技。①当你使用红色锦囊牌后，你于〖摧坚〗后增加“若其手牌中没有【闪】，则你摸两张牌”；②当你使用或打出红色基本牌后，你删除〖摧坚〗中的“，然后你交给其等量的牌”。③当你使用红色的普通锦囊牌/基本牌时，若你已发动过〖摧坚①〗和〖摧坚②〗，则此牌不可被响应/可额外增加一个目标。",
  lvlingqi: "吕玲绮",
  guowu: "帼武",
  guowu_info: "出牌阶段开始时，你可以展示全部手牌，根据你展示的类型数，你获得对应效果：至少一类，从弃牌堆获得一张【杀】；至少两类，此阶段使用牌无距离限制；至少三类，此阶段使用【杀】或普通锦囊牌可以多指定至多两个目标。",
  guowu_info_guozhan: "出牌阶段开始时，你可以展示全部手牌，根据你展示的类型数，你获得对应效果：至少一类，从弃牌堆获得一张【杀】；至少两类，此阶段使用牌无距离限制；至少三类，此阶段使用【杀】可以多指定至多两个目标（限一次）。",
  zhuangrong: "妆戎",
  zhuangrong_info: "觉醒技，一名角色的回合结束时，若你的体力值或手牌数为1，你减1点体力上限并回复体力至上限，将手牌摸至体力上限，然后获得〖神威〗和〖无双〗。",
  llqshenwei: "神威",
  llqshenwei_info: "锁定技，摸牌阶段开始时，你令额定摸牌数+2；你的手牌上限+2。",
  re_kanze: "阚泽",
  rekuanshi: "宽释",
  rekuanshi_info: "结束阶段，你可以选择一名角色。你获得如下效果直到你下回合开始：每回合限一次，当其于一回合内受到第2点伤害后，其回复1点体力。",
  liuyong: "刘永",
  zhuning: "诛佞",
  zhuning_info: "出牌阶段限一次。你可将任意张牌交给一名其他角色（称为“隙”），然后可视为使用一张具有伤害标签的基本牌/锦囊牌（不计入次数限制）。若你以此法使用的牌未造成伤害，则你将〖诛佞〗于本阶段内改为“限两次”。",
  fengxiang: "封乡",
  fengxiang_info: "锁定技。①当你受到伤害后，若场上：存在“隙”唯一最多的角色，则其回复1点体力；不存在，则你摸一张牌。②当有角色的手牌移动后，若场上“隙”唯一最多的角色因此发生变化，则你摸一张牌。",
  fengxiang_tag: "隙",
  re_xunchen: "荀谌",
  refenglve: "锋略",
  refenglve_info: "出牌阶段限一次，你可以和一名其他角色进行拼点。若你赢，你获得其区域里的两张牌；若平局，则你获得你的拼点牌且令此技能于本阶段内的发动次数上限+1；若你输，其获得你的拼点牌。",
  anyong: "暗涌",
  anyong_info: "当一名角色于其回合内第一次造成伤害后，若伤害值为1，则你可弃置一张牌，并对受伤角色造成1点伤害。",
  wanniangongzhu: "万年公主",
  zhenge: "枕戈",
  zhenge_info: "准备阶段，你可以选择一名角色。该角色本局游戏的攻击范围+1（至多+5）。然后若除其外的所有角色都在该角色的攻击范围内，则你可以令其视为对另一名角色使用一张【杀】。",
  xinghan: "兴汉",
  xinghan_info: "锁定技，每回合的第一张【杀】造成伤害后，若此【杀】的使用者成为过〖枕戈〗的目标，则你摸一张牌。若你的手牌数不是全场唯一最多的，则改为摸X张牌（X为该角色的攻击范围且最多为5）。",
  re_chendeng: "陈登",
  refuyuan: "扶援",
  refuyuan_info: "一名角色成为【杀】的目标后，若其本回合内没有成为过其他红色牌的目标，则你可以令其摸一张牌。",
  reyingshui: "营说",
  reyingshui_info: "出牌阶段限一次，你可将一张牌交给攻击范围内的一名其他角色，然后其选择一项：①交给你至少两张装备牌。②受到你对其造成的1点伤害。",
  rewangzu: "望族",
  rewangzu_info: "每回合限一次。当你受到其他角色造成的伤害时，你可随机弃置一张手牌，令此伤害-1。若你所在阵营的存活角色数是全场最多的，则你可以自行选择弃置的牌。",
  re_miheng: "祢衡",
  rekuangcai: "狂才",
  rekuangcai_info: "锁定技。①你于回合内使用牌无距离和次数限制。②弃牌阶段开始时，若你本回合内：未使用过牌，则你本局游戏的手牌上限+1；使用过牌但未造成过伤害，则你本局游戏的手牌上限-1。③结束阶段开始时，你摸X张牌（X为你本回合内造成的伤害且至多为5）。",
  reshejian: "舌剑",
  reshejian_info: "每回合限两次。当你成为其他角色使用牌的唯一目标后，你可以弃置至少两张手牌。若如此做，你选择一项：⒈弃置其等量的牌。⒉对其造成1点伤害。",
  fengxi: "冯熙",
  yusui: "玉碎",
  yusui_info: "每回合限一次，当你成为其他角色使用黑色牌的目标后，你可以失去1点体力，然后选择一项：⒈令其将手牌数弃置至与你相同；⒉令其失去Y点体力（Y为其的体力值减去你的体力值，不为正时不可选择）。",
  boyan: "驳言",
  boyan_info: "出牌阶段限一次，你可选择一名其他角色。其将手牌摸至体力上限（至多摸至五张），然后其本回合不能使用或打出手牌。",
  re_dengzhi: "邓芝",
  jianliang: "简亮",
  jianliang_info: "摸牌阶段开始时，若你的手牌数不为全场最多，则你可以令至多两名角色各摸一张牌。",
  weimeng: "危盟",
  weimeng_info: "出牌阶段限一次，你可以获得一名其他角色的至多X张手牌，然后交给其等量的牌（X为你的体力值）。若你给出的牌点数之和：大于得到的牌，则你摸一张牌；小于得到的牌，弃置该角色区域内的一张牌。",
  mamidi: "马日磾",
  bingjie: "秉节",
  bingjie_info: "出牌阶段开始时，你可减1点体力上限，然后当你本回合使用【杀】或普通锦囊牌指定其他角色为目标后，其弃置一张牌。若其弃置的牌与你使用的牌颜色相同，其无法响应此牌。",
  zhengding: "正订",
  zhengding_info: "锁定技。当你于回合外使用或打出牌响应其他角色使用的牌时，若这两张牌颜色相同，则你加1点体力上限并回复1点体力。",
  dc_jiben: "吉本",
  xunli: "询疠",
  xunli_info: `锁定技。①当有黑色牌不于${get.poptip("lieyi")}的结算中因弃置而进入弃牌堆后，若X大于0，则你将其中的随机X张牌置于武将牌上作为“疠”（X=min(这些牌的数量，9-Y)，Y=你的“疠”数）。②出牌阶段开始时，你可以用任意张黑色手牌交换等量的“疠”。`,
  zhishi: "指誓",
  zhishi_info: "结束阶段，你可选择一名角色。当该角色于你的下回合开始前{成为【杀】的目标后或进入濒死状态时}，你可移去任意张“疠”，然后其摸等量的牌。",
  lieyi: "烈医",
  lieyi_info: "出牌阶段限一次。你可以展示所有“疠”并选择一名其他角色，对其使用其中的一张可对其使用的牌（无距离和次数限制）并重复此流程，并将其余的牌置于弃牌堆。然后若其未于此流程中因受到伤害而进入过濒死状态，则你失去1点体力。",
  guanning: "管宁",
  dunshi: "遁世",
  dunshi_info: "每回合限一次。你可以视为使用或打出一张【杀】/【闪】/【桃】/【酒】，然后当前回合角色于本回合内下一次造成伤害时，你选择两项：⒈防止此伤害。系统从技能名中包含“仁/义/礼/智/信”字样的技能中随机选择三个其未拥有的技能，然后你令当前回合角色获得其中一个技能。⒉从〖遁世〗中删除你本次使用或打出的牌并获得一个“席”。⒊减1点体力上限并摸X张牌（X为你的“席”数）。",
  dc_gaolan: "高览",
  xizhen: "袭阵",
  xizhen_info: "出牌阶段开始时，你可选择一名其他角色，视为对其使用【杀】或【决斗】。然后当有角色于本阶段内使用或打出牌响应你时，该角色回复1点体力，你摸一张牌（若其满体力，改为两张）。",
  dc_huangchengyan: "黄承彦",
  dcjiezhen: "解阵",
  dcjiezhen_info: "出牌阶段限一次，你可选择一名其他角色。该角色获得〖八阵〗，且其所有不为{锁定技、限定技、觉醒技、主公技、带有Charlotte标签}的技能失效。你的下回合开始时，或其因【八卦阵】发起的判定结算结束后，你令其恢复其以此法失效的所有技能并失去以此法获得的〖八阵〗，然后获得其区域内的一张牌。",
  dczecai: "择才",
  dczecai_info: "限定技。每轮结束时，你可令一名其他角色获得〖集智〗直到下一轮结束；若其是本轮内使用过锦囊牌数量唯一最多的角色，则其执行一个额外回合。",
  dcyinshi: "隐世",
  dcyinshi_info: "锁定技。①每回合限一次，当你受到伤害时，若此伤害的渠道不为有颜色的牌，则你防止此伤害。②当有因【八卦阵】发起的判定的判定牌生效时，你获得此判定牌。",
  tenggongzhu: "滕公主",
  xingchong: "幸宠",
  xingchong_info: "每轮开始时，你可声明两个自然数X和Y，且(X+Y)≤min(5, 你的体力上限)。你摸X张牌并展示Y张手牌。若如此做，当你于本轮内失去一张以此法展示的牌后，你摸两张牌。",
  liunian: "流年",
  liunian_info: "锁定技。一名角色的回合结束时，若本回合内进行了本次游戏的第一次洗牌，则你加1点体力上限；若本回合内进行了本次游戏的第二次洗牌，则你于本回合结束时回复1点体力，且本局游戏内的手牌上限+10。",
  caimaozhangyun: "蔡瑁张允",
  lianzhou: "连舟",
  lianzhou_info: "锁定技。准备阶段，你横置你的武将牌。然后你可横置任意名体力值等于你的角色。",
  jinglan: "惊澜",
  jinglan_info: "锁定技。当你造成伤害后，若你的手牌数：大于体力值，你弃置四张手牌；等于体力值，你弃置一张牌并回复1点体力；小于体力值，你受到1点无来源火焰伤害并摸五张牌。",
  dc_yanghu: "羊祜",
  dcdeshao: "德劭",
  dcdeshao_info: "每回合限两次。当你成为其他角色使用的黑色牌的目标后，你可以摸一张牌，然后若其手牌数不小于你，则你弃置其一张牌。",
  dcmingfa: "明伐",
  dcmingfa_info: "①出牌阶段限一次。当你使用【杀】或普通锦囊牌结算结束后，若你的武将牌上没有“明伐”牌，则你可以将此牌作为“明伐”牌置于武将牌上并选择一名其他角色，记录该角色和此牌的名称。②一名角色的回合结束时，若其是你〖明伐①〗记录的角色，则你视为对其依次使用X张〖明伐①〗记录的牌，然后移去“明伐”牌（X为其手牌数且至少为1，至多为5）。③一名角色死亡时，若其是你〖明伐①〗记录的角色，则你移去“明伐”牌。",
  dc_jiling: "纪灵",
  dcshuangren: "双刃",
  dcshuangren_info: "出牌阶段开始时，你可以和一名其他角色A进行拼点。若你赢，你选择一名角色B，或选择包含A在内的两名角色A和B（B的势力需与A相同），然后视为对被选择的角色使用一张【杀】（不计入次数限制）；若你没赢，则你本阶段内不能使用【杀】。",
  zhangxun: "张勋",
  suizheng: "随征",
  suizheng_info: "结束阶段，你可以选择一名角色Ａ，获得如下效果直到其下回合结束：①Ａ于下回合出牌阶段内使用【杀】的次数上限+2且无距离限制；②Ａ下回合的出牌阶段结束时，你可以选择一名此阶段内受到过Ａ造成的伤害的角色Ｂ，视为对Ｂ使用一张【杀】。",
  dc_liuba: "刘巴",
  dczhubi: "铸币",
  dczhubi_info: "当有♦牌因弃置而进入弃牌堆后，你可以令系统从牌堆/弃牌堆中检索一张【无中生有】，并将此牌置于牌堆顶。",
  dcliuzhuan: "流转",
  dcliuzhuan_tag: "转",
  dcliuzhuan_info: "锁定技。①其他角色于其回合内不于摸牌阶段而得到的牌称为“转”。②你不能成为实体牌中包含“转”的牌的目标。③当有“转”直接进入弃牌堆或经由处理区进入弃牌堆后，你获得之。",
  huzhao: "胡昭",
  midu: "弥笃",
  midu_info: "出牌阶段限一次。你可以选择一项：⒈废除任意个装备栏或判定区，并令一名角色摸等量的牌。⒉恢复一个已经被废除的装备栏或判定区，然后你获得〖活墨〗直到下回合开始。",
  xianwang: "贤望",
  xianwang_info: "锁定技。若你有被废除的装备栏，则其他角色至你的距离+1，你至其他角色的距离-1；若废除的装备栏数大于2，则改为距离+2/-2。",
  guanhai: "管亥",
  suoliang: "索粮",
  suoliang_info: "每回合限一次。当你对其他角色造成伤害后，你可以选择并展示其的至多X张牌（X为其体力上限且至多为5）。若这些牌中有♥或♣牌，则你获得这些牌；否则你弃置这些牌。",
  qinbao: "侵暴",
  qinbao_info: "锁定技。当你使用【杀】或普通锦囊牌时，你令所有手牌数不小于你的其他角色不能响应此牌。",
  dc_lvkuanglvxiang: "吕旷吕翔",
  dcshuhe: "数合",
  dcshuhe_info: "出牌阶段限一次，你可以展示一张手牌并获得一枚“爵”。若场上有与此牌点数相同的牌，则你获得这些牌；否则你将此牌交给一名其他角色。",
  dcliehou: "列侯",
  dcliehou_info: "锁定技。摸牌阶段开始时，你令额定摸牌数+X；然后此摸牌阶段结束时，你选择一项：⒈弃置X张牌。⒉失去1点体力（X为你的“爵”数+1且至多为6）。",
  yinfuren: "尹夫人",
  dcyingyu: "媵予",
  dcyingyu_info: "准备阶段开始时，你可以展示两名角色的各一张手牌。若这两张牌的花色不同，则你可以令一名角色获得另一名角色的展示牌。",
  dcyongbi: "拥嬖",
  dcyongbi_info: "限定技。出牌阶段，你可以将所有手牌展示并交给一名其他男性角色。你将〖媵予〗的发动时机改为“准备阶段和结束阶段开始时”。然后若这些牌中包含的花色数：大于1，则你与其本局游戏的手牌上限+2；大于2，则当你或其于本局游戏内受到大于1的伤害时，此伤害-1。",
  dc_huangquan: "黄权",
  dcquanjian: "劝谏",
  dcquanjian_info: "出牌阶段每项各限一次。你可以选择一项流程并选择一名其他角色A：⒈令A对其攻击范围内的另一名角色B造成1点伤害。⒉令A将手牌数调整至手牌上限（至多摸至五张），且其本回合内不能使用手牌。然后A选择一项：⒈执行此流程。⒉本回合下次受到的伤害+1。",
  dctujue: "途绝",
  dctujue_info: "限定技。当你进入濒死状态时，你可以将所有牌交给一名其他角色。然后你回复X点体力并摸X张牌（X为你以此法交给其牌的数量，且至少为5）。",
  dctujue_append: '<span style="font-family: yuanli"><li>温馨提示：<br>无名杀现版本黄权体力值和【途绝】均为海外服版</span>',
  chengui: "陈珪",
  dcyingtu: "营图",
  dcyingtu_info: "每回合限一次。当你的上家/下家于摸牌阶段外得到牌后，你可以获得其一张牌，然后将一张牌交给你的下家/上家。若你给出的牌为装备牌，则其使用之。",
  dccongshi: "从势",
  dccongshi_info: "锁定技。一名角色使用的装备牌结算结束后，若其装备区内的牌数为全场最多，则你摸一张牌。",
  wanglie: "王烈",
  dcchongwang: "崇望",
  dcchongwang_info: "其他角色使用基本牌或普通锦囊牌时，若你是本局游戏内上一张被使用的牌的使用者，则你可以选择一项：⒈令其于此牌结算结束后收回此牌对应的所有实体牌；⒉令此牌无效。",
  dchuagui: "化归",
  dchuagui_info: "出牌阶段开始时，你可以选择至多X名有牌的其他角色（X为存活角色数最多阵营的存活角色数且你选择的角色其他角色不可见）。这些角色同时选择一项：⒈交给你一张牌，⒉展示一张牌。若这些角色均选择选项二，则你获得所有展示牌。",
  gongsundu: "公孙度",
  dczhenze: "震泽",
  dczhenze_info: "弃牌阶段开始时，你可以选择一项：1.令所有手牌数与体力值大小关系与你不同的角色失去1点体力；2.令所有手牌数和体力值关系与你相同的角色回复1点体力。",
  dcanliao: "安辽",
  dcanliao_info: "出牌阶段限X次（X为群势力角色数）。你可以重铸一名角色的一张牌。",
  dc_yuejiu: "乐就",
  dccuijin: "催进",
  dccuijin_info: "当你或你攻击范围内的角色使用【杀】或【决斗】时，你可以弃置一张牌，令此牌的伤害基数+1。然后当此牌被目标角色抵消或无效或防止伤害后，你摸两张牌并对使用者造成1点伤害。",
  panghui: "庞会",
  dcyiyong: "异勇",
  dcyiyong_info: "当你对其他角色造成伤害时，若你有牌，你可以与其同时弃置至少一张牌。若你以此法弃置的牌的点数之和：不大于其，你摸X+1张牌；不小于其，此伤害+1（X为其以此法弃置的牌数）。",
  dcsuchou: "夙仇",
  dcsuchou_info: "锁定技，出牌阶段开始时，你选择一项：①失去1点体力或减1点体力上限，本阶段使用牌不可被响应；②失去〖夙仇〗。",
  chenjiao: "陈矫",
  dcxieshoux: "协守/清严",
  dcxieshou: "协守",
  dcxieshou_info: "每回合限一次。当一名角色受到伤害后，若你至其的距离不大于2，你可以令你的手牌上限-1，然后其选择一项：1.回复1点体力；2.复原，摸两张牌。",
  dcqingyan: "清严",
  dcqingyan_info: "每回合限两次。当你成为其他角色使用黑色牌的目标后，若你的手牌数：小于体力值，你可以将手牌补至体力上限；不小于体力值，你可以弃置一张手牌令你的手牌上限+1。",
  dcqizi: "弃子",
  dcqizi_info: "锁定技。你不能对至其的距离大于2且正在进行濒死流程的角色使用【桃】。",
  leibo: "雷薄",
  dcsilve: "私掠",
  dcsilve_info: "游戏开始时，你选择一名其他角色（对其他角色不可见），称为“私掠”角色。然后你获得以下效果：①当“私掠”角色对其他角色造成伤害后，若你本回合未因此效果得到过受伤角色的牌，你可以获得受伤角色一张牌；②当“私掠”角色受到其他角色造成的伤害后，若伤害来源存活，你须对伤害来源使用一张【杀】（无距离限制），否则你弃置一张手牌。",
  dcshuaijie: "衰劫",
  dcshuaijie_info: "限定技。出牌阶段，若你的体力值与装备区里的牌数均大于“私掠”角色，或没有角色有“私掠”，你可以减1点体力上限，然后选择一项：1.获得“私掠”角色至多三张牌；2.从牌堆随机获得三张类型各不同的牌。最后将你的“私掠”角色改为你。",
  dc_sp_jiaxu: "新杀SP贾诩",
  dc_sp_jiaxu_prefix: "新杀SP",
  dcjianshu: "间书",
  dcjianshu_info: "出牌阶段限一次。你可以将一张黑色手牌交给一名其他角色，并选择另一名其他角色，你令前者与后者拼点。赢的角色随机弃置一张牌，没赢的角色失去1点体力。若有角色因此死亡，你令你〖间书〗于此阶段发动的次数上限+1。",
  dcyongdi: "拥嫡",
  dcyongdi_info: "限定技。出牌阶段，你可以选择一名男性角色，若其：体力上限或体力值最少，其加1点体力上限并回复1点体力；手牌数最少，其摸X张牌（X为其体力上限且至多为5）。",
  liupi: "新杀刘辟",
  liupi_prefix: "新杀",
  dcjuying: "踞营",
  dcjuying_info: "出牌阶段结束时，若你于此阶段内使用【杀】或【酒】的次数未达到上限，你可以选择任意项：1.下回合使用【杀】的次数上限+1；2.本回合手牌上限+2；3.摸三张牌。若你选择的项数超过了你的体力值，你弃置一张牌。",
  dc_huanghao: "新杀黄皓",
  dc_huanghao_prefix: "新杀",
  dcqinqing: "寝情",
  dcqinqing_info: "结束阶段，你可以弃置一名攻击范围内包含一号位的其他角色一张牌。然后若其手牌数大于一号位，你摸一张牌。",
  dccunwei: "存畏",
  dccunwei_info: "锁定技。当你成为锦囊牌的目标后，若你是唯一目标，你摸一张牌；否则你弃置一张牌。",
  dc_zhaotongzhaoguang: "赵统赵广",
  dcqingren: "青刃",
  dcqingren_info: "结束阶段，你可以摸X张牌（X为你本回合发动〖翊赞〗的次数）。",
  dclongyuan: "龙渊",
  dclongyuan_info: "觉醒技。一名角色的回合结束时，若你本局游戏已发动过至少三次〖翊赞〗，你摸两张牌并回复1点体力，将〖翊赞〗修改为“你可以将一张基本牌当任意基本牌使用或打出”。",
  zhenghun: "郑浑",
  dcqiangzhi: "强峙",
  dcqiangzhi_info: "出牌阶段限一次。你可以弃置你和一名其他角色的共计三张牌。然后若你与其之中有角色因此失去了三张牌，该角色对另一名角色造成1点伤害。",
  dcpitian: "辟田",
  dcpitian_info: "①当你的牌被弃置后，或当你受到伤害后，你的手牌上限+1。②结束阶段，若你的手牌数小于手牌上限，你可以摸至手牌上限（至多摸五张），然后重置因〖辟田①〗增加的手牌上限。",
  furongfuqian: "傅肜傅佥",
  dcxuewei: "血卫",
  dcxuewei_info: "结束阶段，你可以选择一名体力值不大于你的角色，然后你获得如下效果直到你的下回合开始时：当其受到伤害时，防止此伤害，然后你失去1点体力，你与其各摸一张牌（若该角色为你，则改为你摸一张牌）。",
  dcyuguan: "御关",
  dcyuguan_info: "一名角色的回合结束时，若你已损失的体力值为全场最多，你可以减1点体力上限，然后令至多X名角色将手牌摸至体力上限（X为你已损失的体力值）。",
  qinlang: "秦朗",
  dchaochong: "昊宠",
  dchaochong_info: "当你使用牌后，你可以将手牌摸至或弃置至你的手牌上限数（至多摸五张）。然后若你以此法：得到牌，你的手牌上限-1；失去牌，你的手牌上限+1。",
  dcjinjin: "矜谨",
  dcjinjin_info: "每回合限两次。当你造成或受到伤害后，你可以重置因〖昊宠〗增加或减少的手牌上限，令伤害来源弃置至多X张牌，然后你摸Y张牌（X为你以此法变化的手牌上限且至少为1，Y为X减其以此法弃置的牌数）。",
  xianglang: "向朗",
  dckanji: "勘集",
  dckanji_info: "出牌阶段限两次。你可以展示所有手牌，若花色均不同，你摸两张牌。然后若你的手牌因此包含了四种花色，你跳过下一个弃牌阶段。",
  dcqianzheng: "愆正",
  dcqianzheng_info: "每回合限两次。当你成为其他角色使用【杀】或普通锦囊牌的目标后，你可以重铸两张牌。若你以此法重铸的牌中没有与指定你为目标的牌类别相同的牌，你于此牌对应的实体牌进入弃牌堆后获得此牌对应的所有实体牌。",
  qiaorui: "桥蕤",
  dcaishou: "隘守",
  dcaishou_tag: "隘",
  dcaishou_info: "①结束阶段，你可以摸X张牌，称为“隘”（X为你的体力上限）。②准备阶段，你弃置所有“隘”，若你以此法弃置的牌数大于体力值且你的体力上限小于9，你加1点体力上限。③当你于回合外失去最后一张“隘”后，你减1点体力上限。",
  dcsaowei: "扫围",
  dcsaowei_info: "当一名其他角色使用【杀】结算结束后，若此牌的目标角色不包含你且均在你的攻击范围内，你可以将一张“隘”当做【杀】对所有目标角色使用。以此法转化的【杀】结算完毕后，若此【杀】造成过伤害，你获得此【杀】对应的实体牌。",
  yuantanyuanxiyuanshang: "袁谭袁尚袁熙",
  dcneifa: "内伐",
  dcneifa_info: "出牌阶段开始时，你可以摸三张牌，然后弃置一张牌。若你弃置的牌类型为：基本牌，本阶段你不能使用锦囊牌，且【杀】的使用次数上限+X且可以额外指定一名目标；锦囊牌，本阶段你不能使用基本牌，且使用普通锦囊牌选择目标时可以增加或减少一个目标（X为你发动〖内伐〗弃牌后手牌中因〖内伐〗而不能使用的牌的数量且最多为5。你以此法选择的额外目标均无距离限制）。",
  dc_sunziliufang: "新杀孙资刘放",
  dc_sunziliufang_prefix: "新杀",
  dcqinshen: "勤慎",
  dcqinshen_info: "弃牌阶段结束时，你可以摸X张牌（X为本回合未进入过弃牌堆的花色数）。",
  dcweidang: "伪谠",
  dcweidang_info: "其他角色的结束阶段，你可以将一张字数为X的牌置于牌堆底，然后获得牌堆里一张字数为X的牌（X为本回合未进入过弃牌堆的花色数）。若你能使用此牌，你使用之。",
  mengjie: "孟节",
  dcyinlu: "引路",
  dcyinlu_info: `①游戏开始时，你令三名角色依次分别获得${get.poptip("dcyinlu_lequan")}、${get.poptip("dcyinlu_huoxi")}、${get.poptip("dcyinlu_zhangqi")}标记（若场上角色数为2则改为令这两名角色依次获得“乐泉”和“藿溪”，之后随机一名角色获得“瘴气”），然后你获得${get.poptip("dcyinlu_yunxiang")}标记并获得1点“芸香”值。②准备阶段/有〖引路〗标记的角色死亡时，你可以移动一名角色的1枚/其的所有〖引路〗标记。`,
  dcyinlu_lequan: "乐泉",
  dcyinlu_lequan_info: "结束阶段，你可以弃置一张♦牌，然后回复1点体力。",
  dcyinlu_huoxi: "藿溪",
  dcyinlu_huoxi_info: "结束阶段，你可以弃置一张♥牌，然后摸两张牌。",
  dcyinlu_zhangqi: "瘴气",
  dcyinlu_zhangqi_info: "锁定技。结束阶段，你须弃置一张♠牌，否则失去1点体力。",
  dcyinlu_yunxiang: "芸香",
  dcyinlu_yunxiang_info: "①结束阶段，你可以弃置一张♣牌，获得1点“芸香”值。②当你受到伤害时，你可以扣减所有“芸香”值，减少等量的伤害。",
  dcyouqi: "幽栖",
  dcyouqi_info: "锁定技。当其他角色因〖引路〗标记弃置牌后，你有一定概率获得此牌。",
  dcyouqi_faq: "〖幽栖〗概率<br>",
  dcyouqi_faq_info: "当满足〖幽栖〗条件时，系统生成一个随机数X∈[0,1)。若X小于(1.25-0.25Y)，或幸运星模式已开启，你获得此牌（Y为你至该角色的距离）。",
  dc_sunhanhua: "孙寒华",
  dchuiling: "汇灵",
  dchuiling_info: "锁定技。当你使用牌时，若此牌颜色为弃牌堆中数量较少的颜色，你获得1枚“灵”标记。若弃牌堆中：红色牌数大于黑色牌数，你回复1点体力；黑色牌数大于红色牌数，你可以弃置一名其他角色的一张牌。",
  dcchongxu: "冲虚",
  dcchongxu_info: `限定技。出牌阶段，若“灵”数不小于4，你可以失去${get.poptip("dchuiling")}，增加X点体力上限（X为你的“灵”数且至多为游戏人数），然后获得${get.poptip("dctaji")}和${get.poptip("dcqinghuang")}。`,
  dctaji: "踏寂",
  dctaji_info: "当你失去手牌时，根据你失去牌的原因执行以下效果：1.使用：你弃置其他角色一张牌；2.打出：你摸一张牌；3.弃置：你回复1点体力；4.其他：你下一次对其他角色造成伤害时，此伤害+1。",
  dcqinghuang: "青荒",
  dcqinghuang_info: `出牌阶段开始时，你可以减1点体力上限，然后你于本回合发动${get.poptip("dctaji")}时额外随机执行一种效果。`,
  dc_huojun: "霍峻",
  dcgue: "孤扼",
  dcgue_info: "每回合限一次。当你需要于回合外使用或打出【杀】或【闪】时，你可以发动此技能：你展示所有手牌，若其中【杀】和【闪】的数量之和不超过1，你视为使用或打出此牌。",
  dcsigong: "伺攻",
  dcsigong_info: "其他角色的回合结束时，若其于本回合内使用牌被响应过，你可以将手牌摸至或弃置至1，视为对其使用一张需使用X张【闪】抵消的【杀】，且此【杀】的伤害基数+1（X为你以此法弃置的牌数且至少为1）。当你以此法造成伤害后，该技能于本轮失效。",
  peiyuanshao: "裴元绍",
  oldmoyu: "没欲",
  oldmoyu_info: "出牌阶段每名角色限一次。你可以获得一名其他角色区域里的一张牌，然后其可以对你使用一张无距离限制的【杀】，且此【杀】伤害基数为X（X为你于本回合发动此技能的次数）。若此【杀】对你造成了伤害，你令此技能于本回合失效。",
  dcmoyu: "没欲",
  dcmoyu_info: "出牌阶段每名角色限一次。你可以获得一名其他角色区域里的一张牌，然后其可以对你使用一张无距离限制的【杀】。若此【杀】：未对你造成过伤害，你将此技能于此阶段下次获得的牌数改为两张；对你造成过伤害，你令此技能于本回合失效。",
  zhangchu: "张楚",
  dcjizhong: "集众",
  dcjizhong_info: "出牌阶段限一次。你可以令一名其他角色摸两张牌，然后其选择一项：1.若其没有“信众”标记，其获得“信众”标记；2.你获得其三张牌。",
  dcrihui: "日彗",
  dcrihui_info: "每回合限一次。当你使用普通锦囊牌或黑色基本牌结算结束后，若此牌的目标数为1且目标不为你，且其：没有“信众”，则你可以令所有有“信众”的角色依次视为对其使用一张与此牌牌名和属性相同的牌；有“信众”，则你可以获得其区域里的一张牌。",
  dcguangshi: "光噬",
  dcguangshi_info: "锁定技。准备阶段，若所有其他角色均有“信众”，你摸X张牌并失去1点体力（X为全场“信众”数）。",
  dongwan: "董绾",
  dcshengdu: "生妒",
  dcshengdu_info: "回合开始时，你可以选择一名其他角色，令其获得1枚“生妒”标记。有“生妒”标记的角色于摸牌阶段得到牌后，你摸X张牌，然后其移去所有“生妒”标记（X为摸牌数乘以其拥有的“生妒”标记数）。",
  dcjieling: "介绫",
  dcjieling_info: "出牌阶段每种花色限一次，你可以将两张花色不同的手牌当无距离限制且无任何次数限制的【杀】使用。然后若此【杀】：造成了伤害，所有目标角色失去1点体力；未造成伤害，所有目标角色依次获得1枚“生妒”标记。",
  yuanyin: "袁胤",
  dcmoshou: "墨守",
  dcmoshou_info: "当你成为一名角色使用的黑色牌的目标后，你可以摸体力上限张牌，然后若你以此法摸的牌数：大于1，你令下次以此法摸的牌数-1；为1，将此技能摸牌数重置为你的体力上限。",
  dcyunjiu: "运柩",
  dcyunjiu_info: "一名角色死亡后，你可以将其此次弃置的一张牌交给一名其他角色。然后你加1点体力上限并回复1点体力。",
  gaoxiang: "高翔",
  dcchiying: "驰应",
  dcchiying_info: "出牌阶段限一次。你可以选择一名体力不大于你的角色，令其可以弃置其攻击范围内的任意名其他角色各一张牌。然后若该角色不为你，其获得以此法弃置的牌中所有的基本牌。",
  zhangkai: "张闿",
  dcxiangshu: "相鼠",
  dcxiangshu_info: "其他角色的出牌阶段开始时，若其手牌数不小于其体力值，你可以选择一个不大于5的非负整数，然后你弃置一张手牌或声明此数字。若如此做，此阶段结束时，若其手牌数与你选择的数字：差值不大于1，你获得其一张牌；相等，你对其造成1点伤害。",
  mengyou: "孟优",
  dcmanzhi: "蛮智",
  dcmanzhi_info: "①准备阶段，你可以选择一名其他角色并选择一项：1.令其交给你两张牌，然后其视为使用一张无距离限制的【杀】；2.获得其区域内至多两张牌，然后交给其等量的牌并摸一张牌。②结束阶段，若你的体力值与本回合准备阶段时的体力值相等，你可以执行你未于本回合执行过的〖蛮智①〗的分支。",
  dc_sunchen: "孙綝",
  dczigu: "自固",
  dczigu_info: "出牌阶段限一次。你可以弃置一张牌，然后获得场上的一张装备牌。若你没有因此获得其他角色的牌，你摸一张牌。",
  dczuowei: "作威",
  dczuowei_info: "当你于回合内使用牌时，你可以根据你的手牌数执行对应效果：大于X，令此牌不可被响应；等于X，对一名其他角色造成1点伤害；小于X，摸两张牌且不能于本回合再触发该选项（X为你装备区里牌的数量且至少为1）。",
  liuchongluojun: "刘宠骆俊",
  dcminze: "悯泽",
  dcminze_info: "①出牌阶段每名角色限一次。你可以将至多两张牌名不同的牌交给一名手牌数小于你的角色。②结束阶段，你将手牌摸至X张（X为你本回合因〖悯泽①〗失去过的牌的牌名数且至多为5）。",
  dcjini: "击逆",
  dcjini_info: "当你受到伤害后，你可以重铸至多Y张手牌（Y为你的体力上限减本回合你以此法重铸过的牌数）。若你以此法获得了【杀】，你可以对伤害来源使用一张无视距离且不可被响应的【杀】。",
  yuechen: "乐綝",
  dcporui: "破锐",
  dcporui_info: "每轮限一次。其他角色的结束阶段，你可以弃置一张牌并选择另一名于此回合内失去过牌的其他角色，你视为对其依次使用X+1张【杀】，然后你交给其X张手牌（X为其本回合失去的牌数且至多为5）。",
  dcgonghu: "共护",
  dcgonghu_info: "锁定技。①当你于回合外失去基本牌后，若你本回合内失去基本牌的数量大于1，你将〖破锐〗改为每轮限两次。②当你造成或受到伤害后，若你本回合内造成或受到的总伤害大于1，你删除〖破锐〗中的“，然后你交给其X张手牌”。③当你使用红色基本牌/红色普通锦囊牌时，若你已发动过〖共护①〗和〖共护②〗，则此牌不可被响应/可额外增加一个目标。",
  yue_caiwenji: "乐蔡琰",
  yue_caiwenji_prefix: "乐",
  dcshuangjia: "霜笳",
  dcshuangjia_tag: "胡笳",
  dcshuangjia_info: "锁定技。①游戏开始，你将初始手牌标记为“胡笳”。②你的“胡笳”牌不计入手牌上限。③其他角色至你的距离+X（X为你的“胡笳”数且至多为5）。",
  dcbeifen: "悲愤",
  dcbeifen_info: "锁定技。①当你失去牌后，若这些牌中有“胡笳”牌，你获得与你手牌中“胡笳”牌花色均不同的每种花色的牌各一张。②若你手牌中“胡笳”牌数小于不为“胡笳”牌的牌数，你使用牌无距离和次数限制。",
  dc_wuban: "吴班",
  dcyouzhan: "诱战",
  dcyouzhan_info: "锁定技。当其他角色于你的回合内失去牌后，你摸一张牌（不计入本回合的手牌上限），且其获得如下效果：1.其于此回合下一次受到的伤害+1；2.结束阶段，若其于此回合未受到过伤害，其摸X张牌（X为其此回合失去过牌的次数且至多为3）。",
  yue_zhoufei: "乐周妃",
  yue_zhoufei_prefix: "乐",
  dclingkong: "灵箜",
  dclingkong_tag: "箜篌",
  dclingkong_info: "锁定技。①游戏开始时，你将手牌标记为“箜篌”。②你的“箜篌”牌不计入手牌上限。③当你于一回合内首次于摸牌阶段外得到牌后，你将这些牌标记为“箜篌”。",
  dcxianshu: "贤淑",
  dcxianshu_info: "出牌阶段，你可以将一张“箜篌”正面向上交给一名其他角色，然后你摸X张牌（X为你与其的体力值之差且至多为5）。若此牌为红色，且该角色的体力值不大于你，则其回复1点体力；若此牌为黑色，且该角色的体力值不小于你，则其失去1点体力。",
  dc_zhangmancheng: "张曼成",
  dclvecheng: "掠城",
  dclvecheng_info: "出牌阶段限一次。你可以选择一名其他角色，你于本回合对其使用当前手牌中的【杀】无任何次数限制。然后回合结束时，其展示所有手牌，若其中有【杀】，其可以选择对你依次使用其中所有的【杀】。",
  dczhongji: "螽集",
  dczhongji_info: "当你使用牌时，若此牌无花色或你手牌区里没有与此牌花色相同的手牌，你可以将手牌摸至体力上限并弃置X张牌（X为本回合发动〖螽集〗的次数）。",
  dc_jiachong: "贾充",
  dcbeini: "悖逆",
  dcbeini_info: "出牌阶段限一次。你可以将手牌调整至体力上限，然后令一名角色视为对另一名角色使用一张【杀】，且这些角色的非锁定技失效直到回合结束。",
  dcshizong: "恃纵",
  dcshizong_info: "当你需要使用一张基本牌时，你可以交给一名其他角色X张牌，然后其可以将一张牌置于牌堆底，视为你使用之。若其不为当前回合角色或其此次未放置牌，此技能失效直到回合结束（X为你本回合发动〖恃纵〗的次数）。",
  pangshanmin: "庞山民",
  dccaisi: "才思",
  dccaisi_info: "当你于回合内/回合外使用基本牌结算结束后，你可以从牌堆/弃牌堆随机获得一张非基本牌，然后若你本回合发动此技能的次数：小于等于你的体力上限，本回合你发动此技能获得的牌数翻倍；大于你的体力上限，本回合此技能失效。",
  dczhuoli: "擢吏",
  dczhuoli_info: "锁定技。一名角色的回合结束时，若你本回合使用或获得的牌数大于体力值，你加1点体力上限（若你的体力上限不小于本局游戏人数，跳过此步），回复1点体力。",
  yue_caiyong: "乐蔡邕",
  yue_caiyong_prefix: "乐",
  dcjiaowei: "焦尾",
  dcjiaowei_tag: "弦",
  dcjiaowei_info: "锁定技。①游戏开始时，你将手牌标记为“弦”。②你的“弦”牌不计入手牌上限。③当你失去“弦”后，防止你本回合下次受到的伤害。",
  dcfeibai: "飞白",
  dcfeibai_info: "当你使用牌结算完毕后，你可以从随机两张字数为X的牌选择一张获得（X为此牌与你本回合使用的上一张牌的字数之和）。若牌堆和弃牌堆中没有字数为X的牌，则你摸两张牌并标记为“弦”，然后〖飞白〗于本回合失效。",
  kuaiqi: "蒯祺",
  dcliangxiu: "良秀",
  dcliangxiu_info: "出牌阶段，你可以弃置两张不同类型的牌，然后将牌堆/弃牌堆中两张与你弃置或本阶段以此法分配的牌类型均不同的牌分配给任意角色。",
  dcxunjie: "殉节",
  dcxunjie_info: "每轮每项限一次。一名角色的回合结束时，若你本回合于摸牌阶段外得到过牌，你可以选择一项：1.令一名角色将手牌数摸或弃置至与其体力值相同；2.令一名角色将体力回复或失去至与其手牌数相同。",
  dc_dongzhao: "董昭",
  dcyijia: "移驾",
  dcyijia_info: "一名角色受到伤害后，若你至其的距离不大于1，你可以将场上一张装备牌移动至其对应装备栏（替换原装备）。若其因此脱离了一名角色的攻击范围，你摸一张牌。",
  dcdingji: "定基",
  dcdingji_info: "准备阶段，你可以令一名角色将手牌摸或弃置至五张，然后其展示手牌。若牌名均不同，则其可以视为使用其中一张基本或普通锦囊牌。",
  yue_xiaoqiao: "乐小乔",
  yue_xiaoqiao_prefix: "乐",
  dcqiqin: "绮琴",
  dcqiqin_tag: "琴",
  dcqiqin_info: "锁定技。①游戏开始时，你将手牌标记为“琴”。②你的“琴”牌不计入手牌上限。③准备阶段，你获得位于弃牌堆的所有“琴”。",
  dcweiwan: "媦婉",
  dcweiwan_info: "出牌阶段限一次，你可以弃置一张“琴”并随机获得一名其他角色区域内花色与此牌不相同的牌各一张，若你获得了：一张牌，其失去1点体力；两张牌，本回合你对其使用牌无距离和次数限制；三张牌，本回合你不能对其使用牌。",
  dc_sp_menghuo: "新杀SP孟获",
  dc_sp_menghuo_prefix: "新杀SP",
  dcmanwang: "蛮王",
  dcmanwang_info: `出牌阶段，你可以弃置任意张牌。然后你依次执行以下选项中的前等量项：⒈获得${get.poptip("dcpanqin")}。⒉摸一张牌。⒊回复1点体力。⒋摸两张牌并失去${get.poptip("dcpanqin")}。`,
  dcpanqin: "叛侵",
  dcpanqin_info: `出牌阶段或弃牌阶段结束时，你可将你于本阶段内弃置且位于弃牌堆的所有牌当做【南蛮入侵】使用。然后若此牌被使用时对应的实体牌数不大于此牌的目标数，则你执行并移除${get.poptip("dcmanwang")}中的最后一个选项，然后加1点体力上限并回复1点体力。`,
  dc_kongrong: "孔融",
  dckrmingshi: "名士",
  dckrmingshi_info: "锁定技，当你受到其他角色造成的伤害时，若其手牌数大于你，则其需弃置一张手牌，否则此伤害-1。",
  yue_daqiao: "乐大乔",
  yue_daqiao_prefix: "乐",
  dczixi: "姊希",
  dczixi_info: "①出牌阶段开始和结束时，你可以将至多两张“琴”当作一张无效果的【乐不思蜀】、【兵粮寸断】或【闪电】置于一名角色的判定区。②当你使用基本牌或普通锦囊牌指定唯一目标后，你可根据其判定区内的牌数执行对应项：1.令此牌对其额外结算一次；2.摸两张牌；3.获得其装备区与判定区所有牌，并对其造成3点伤害。",
  jiangfei: "蒋琬费祎",
  dcshoucheng: "守成",
  dcshoucheng_info: "每回合限一次，当一名角色于其回合外失去手牌后，若其没有手牌，你可令其摸两张牌。",
  dc_liuli: "刘理",
  dcfuli: "抚黎",
  dcfuli_info: "出牌阶段限一次，你可以展示手牌并弃置一种类别的所有手牌，然后摸X张牌（X为这些牌的牌名字数和且X至多为场上手牌数最多的角色的手牌数）。然后你可以选择一名角色，令其攻击范围-Y直到你的下个回合开始（Y为1，若你因此弃置了伤害类卡牌，则Y改为减其攻击范围）。",
  dcdehua: "德化",
  dcdehua_info: "锁定技。①每轮开始时，若有你可以未以此法选择过且可以使用的非延时类伤害牌的牌名，你选择其中一个并视为使用之，然后你不能使用手牌中此牌名的牌。若你已选择过所有的伤害牌牌名，你失去〖德化〗，本局游戏你的伤害牌不计入手牌数。②你的手牌上限+Y（Y为你〖德化①〗选择过的牌名数）。",
  gongsunxiu: "公孙修",
  dcgangu: "干蛊",
  dcgangu_info: "锁定技。每回合限一次。当其他角色失去体力后，你摸三张牌，然后若你的体力不为全场最小，你失去1点体力。",
  dckuizhen: "溃阵",
  dckuizhen_info: "出牌阶段限一次，你可以交给一名其他角色任意张手牌并随机获得其等量张手牌，以此法留在其手牌的牌成为“溃阵”牌。其他角色使用“溃阵”牌时，你摸一张牌。其失去全部“溃阵”牌的回合结束时，失去1点体力。",
  dcshiju: "势举",
  dcshiju_info: "一名角色的出牌阶段限一次。其可以交给你一张牌（若其为你则改为选择一张自己装备区的牌获得之或选择一张手牌），你可以使用此牌，然后其本回合攻击范围+X（X为你装备区里的牌数）。若此牌为装备牌或此牌造成了伤害，你与其各摸两张牌。",
  dcyingshi: "应时",
  dcyingshi_info: "当你不因〖应时〗使用普通锦囊牌指定目标后，你可令其中一个目标选择一项：⒈令你于此牌结算结束后视为对其使用一张与此牌牌名相同的牌；⒉弃置X张牌，你本回合不能再发动〖应时〗（X为你装备区里的牌数+1）。",
  dcjichou: "集筹",
  dcjichou_info: "结束阶段结束时，若你本回合使用过牌且这些牌的牌名均不同，你可以观看位于弃牌堆中的这些牌，选择任意张牌并选择等量角色，将这些牌交给这些角色各一张，然后你摸X张牌（X为其中此前未因此给出过的牌名数）。",
  dcmouli: "谋立",
  dcmouli_info: `觉醒技。回合结束时，若你因${get.poptip("dcjichou")}给出的牌的牌名总数大于5，你加1点体力上限并回复1点体力，然后获得${get.poptip("dczifu")}。`,
  dczifu: "自缚",
  dczifu_info: "锁定技。出牌阶段开始时，你将手牌摸至体力上限（至多摸至五张）。若你以此法得到牌，你须选择手牌中不同牌名的牌各一张，然后弃置其余的手牌。",
  dcsanshi: "散士",
  dcsanshi_tag: "死士",
  dcsanshi_info: "锁定技。①游戏开始时，你令系统将牌堆中每个点数的随机一张牌永久标记为“死士”（“死士”对你可见）。②一名角色的回合结束时，若本回合有“死士”不因你使用或打出而进入弃牌堆，你于弃牌堆中获得这些牌。③你使用“死士”不能被响应。",
  dczhenrao: "震扰",
  dczhenrao_info: "每回合每名角色限一次。当你使用牌指定第一个目标后，若目标角色包含其他角色，或当其他角色使用牌指定你为目标后，你可以选择手牌数大于你的其中一个目标或此牌的使用者，然后对其造成1点伤害。",
  dcchenlve: "沉略",
  dcchenlve_info: "限定技。出牌阶段，你可以将牌堆、弃牌堆、场上及其他角色的手牌区里的所有“死士”置入处理区，然后你获得这些牌。若如此做，你获得如下效果：1.此阶段结束时，你将这些牌移出游戏；2.当你死亡时，你将所有以此法移出游戏的“死士”置入弃牌堆。",
  dcjianzhuan: "渐专",
  dcjianzhuan_info: "锁定技。①当你于出牌阶段使用牌时，你选择此阶段未执行过的一项执行：⒈令一名其他角色弃置X张牌；⒉摸X张牌；⒊重铸X张牌；⒋弃置X张牌（X为此技能于本阶段的发动次数）。②出牌阶段结束时，若你本阶段执行过〖渐专①〗的所有选项且〖渐专①〗剩余选项数大于1，则你随机移除〖渐专①〗的一项。",
  dcjianzhuan_faq: "渐专概率",
  dcjianzhuan_faq_info: "<br>当系统随机选择要删除的选项时，“弃置X张牌”的选项概率固定为90%；剩余选项平分剩余的10%概率。<br>如第一次删除时，删除弃牌选项概率为90%，其余三个选项被删除的概率均为3.33%，若删除了非弃牌选项，第二次删除时，删除弃牌选项的概率依旧是90%，其余两个选项被删除的概率均为5%。",
  dcfanshi: "返势",
  dcfanshi_info: `觉醒技，结束阶段，若〖渐专①〗剩余选项数小于2，则你执行三次X视为1的剩余选项，然后增加2点体力上限并回复2点体力，失去${get.poptip("dcjianzhuan")}并获得${get.poptip("dcfudou")}。`,
  dcfudou: "覆斗",
  dcfudou_info: "当你使用黑色牌/红色牌指定唯一目标后，若该角色不为你，且其于本局游戏对你/未对你造成过伤害，则你可以与其各失去1点体力/各摸一张牌。",
  wupu: "吴普",
  dcduanti: "锻体",
  dcduanti_info: "锁定技。当你使用或打出牌结算结束后，若此牌是你本局游戏使用或打出过的牌中的第5X张牌（X∈N⁺），你回复1点体力，然后若你以此法增加的上限小于5，你加1点体力上限。",
  dcshicao: "识草",
  dcshicao_info: "出牌阶段，你可以声明一种类型，然后选择从牌堆顶或牌堆底摸一张牌。若此牌类型与你声明的类型不同，你观看牌堆另一端的两张牌，此技能本回合失效。",
  dc_lifeng: "李丰",
  dctunchu: "囤储",
  dctunchu_info: "锁定技。①你的初始手牌数为游戏人数的四倍。②你的手牌不能被弃置。③准备阶段，若你的手牌数大于你的体力值，则你本回合至多使用三张牌。",
  dcshuliang: "输粮",
  dcshuliang_info: "一名角色的回合结束时，你可以将任意张牌交给任意名没有手牌的角色各一张，然后本次获得可以指定自己为目标的牌的角色可以依次选择是否使用本次获得的牌。",
  yue_miheng: "乐祢衡",
  yue_miheng_prefix: "乐",
  dcjigu: "激鼓",
  dcjigu_info: "锁定技。①游戏开始时，你将手牌标记为“激鼓”。②你的“激鼓”牌不计入手牌上限。③当你造成或受到伤害后，若你的“激鼓”牌数等于你的装备区牌数，你摸X张牌（X为你的空缺装备栏数）。然后若你本轮〖激鼓〗发动次数不小于已进行过回合的角色数，此效果本轮失效。",
  dcsirui: "思锐",
  dcsirui_info: "出牌阶段限一次，你可以将一张牌当作与其字数相同的一张无距离和次数限制的基本牌或普通锦囊牌使用。",
  yue_zoushi: "乐邹氏",
  yue_zoushi_prefix: "乐",
  dcyunzheng: "韵筝",
  dcyunzheng_tag: "筝",
  dcyunzheng_info: "锁定技。①游戏开始时，你将手牌标记为“筝”。②你的“筝”牌不计入手牌上限。③手牌中有“筝”的其他角色的非锁定技失效。",
  dchuoxin: "惑心",
  dchuoxin_info: "当你使用非装备牌时，你可以展示一名其他角色的一张手牌并将此牌标记为“筝”。若此牌已为“筝”牌或与你使用牌花色相同，你可以获得之。",
  yue_zhugeguo: "乐诸葛果",
  yue_zhugeguo_prefix: "乐",
  dcxidi: "羲笛",
  dcxidi_tag: "笛",
  dcxidi_info: "锁定技。①游戏开始时，你将手牌标记为“笛”。②你的“笛”牌不计入手牌上限。③准备阶段或结束阶段，你观看牌堆顶X张牌，然后将这些牌以任意顺序置于牌堆顶和牌堆底（X为你手牌中的“笛”数且至少为1）。",
  dcchengyan: "乘烟",
  dcchengyan_info: "当你使用【杀】或普通锦囊牌指定其他角色为目标后，你可以摸一张牌并展示之，若展示牌为【杀】或可指定目标的普通锦囊牌，你将使用牌对其的结算方式改为展示牌牌名的结算方式；否则，你摸一张牌并标记为“笛”。",
  dc_sp_zhurong: "新杀SP祝融",
  dc_sp_zhurong_prefix: "新杀SP",
  dcremanhou: "蛮后",
  dcremanhou_info: `出牌阶段限一次，你可以摸至多四张牌并根据摸牌数依次执行以下等量项：①失去${get.poptip("dcretanluan")}；②弃置一张手牌；③弃置场上的一张牌；④失去1点体力，获得${get.poptip("dcretanluan")}。`,
  dcretanluan: "探乱",
  dcretanluan_info: `出牌阶段限一次，你可以使用本回合弃牌堆中因弃置进入弃牌堆的一张牌，若你因此使用的牌被【无懈可击】抵消或对其他角色造成了伤害，则你重置${get.poptip("dcremanhou")}。`,
  dcmanhou: "蛮后",
  dcmanhou_info: "出牌阶段限一次，你可以摸至多四张牌并根据摸牌数依次执行以下等量项：①失去〖探乱〗；②弃置一张手牌；③失去1点体力；④弃置一张牌并获得〖探乱〗。",
  dctanluan: "探乱",
  dctanluan_info: "锁定技，你使用牌指定目标后，若目标角色数大于等于非目标角色数，你可以弃置其中一个目标角色场上的一张牌；若目标角色数小于非目标角色数，则本回合你使用下一张牌的目标数+1。",
  dc_mateng: "新杀马腾",
  dc_mateng_prefix: "新杀",
  dcxiongyi: "雄异",
  dcxiongyi_info: "限定技，出牌阶段，你可以与一名其他角色各摸三张牌，然后若你体力值为全场唯一最少，你回复1点体力。当你脱离濒死状态后，你复原此技能并删去回复体力的效果。",
  dc_huangwudie: "黄舞蝶",
  dcshuangrui: "双锐",
  dcshuangrui_info: "准备阶段，你可以选择一名其他角色，视为对其使用一张【杀】；若该角色不在你攻击范围内，你令此【杀】不可被响应且本回合获得〖狩星〗，否则你令此【杀】伤害+1且本回合获得〖铩雪〗。",
  dcfuxie: "伏械",
  dcfuxie_info: "出牌阶段，你可以弃置一张武器牌或失去一个技能，令一名其他角色弃置两张牌。",
  dcshouxing: "狩星",
  dcshouxing_info: "你可以将X张牌当作一张不计入次数限制的【杀】对一名攻击范围外的角色使用（X为你计算与其的距离）。",
  dcshaxue: "铩雪",
  dcshaxue_info: "你对其他角色造成伤害后，可以摸两张牌并弃置X张牌（X为你计算与其的距离）。",
  yue_diaochan: "乐貂蝉",
  yue_diaochan_prefix: "乐",
  dctanban: "檀板",
  dctanban_info: "①游戏开始时，你将手牌标记为“檀板”。②你的“檀板”牌不计入手牌上限。③摸牌阶段结束时，你可以交换两种牌的“檀板”标记。",
  dcdiou: "低讴",
  dcdiou_info: "当你使用实体牌含“檀板”牌结算完毕后，你可以展示一张非“檀板”手牌，然后视为使用之，若此牌为本回合首次被展示或牌名与你本次使用的牌名相同，则你摸两张牌。",
  yue_zhouyu: "乐周瑜",
  yue_zhouyu_prefix: "乐",
  dcguyin: "顾音",
  dcguyin_info: "锁定技。①你的初始手牌数为0，其他角色的初始手牌数+1。②其他角色的初始手牌因使用或弃置进入弃牌堆后，你摸一张牌。",
  dcpinglu: "平虏",
  dcpinglu_info: "出牌阶段，你可以获得攻击范围内所有其他角色各随机一张手牌。若如此做，直到这些牌离开你的手牌区，本技能此阶段失效。",
  panghong: "庞宏",
  dcpingzhi: "评骘",
  dcpingzhi_info: "转换技。出牌阶段限一次，你可观看一名角色的手牌并展示其中一张牌，阳：你弃置此牌，然后其视为对你使用一张【火攻】，若其未因此造成伤害则此技能视为未发动过；阴：然后其使用此牌，若此牌造成伤害则此技能视为未发动过。",
  dcgangjian: "刚简",
  dcgangjian_info: "锁定技。每个回合结束时，若你本回合未受到过伤害，你摸X张牌（X为本回合展示过的牌数至多为5）。",
  dc_zhangyì: "新杀张翼",
  dc_zhangyì_prefix: "新杀",
  dcmurui: "暮锐",
  dcmurui_info: "你可于以下时机点使用一张牌：1、每轮开始时；2、有角色死亡的回合结束后；3、你的回合开始时。若此牌造成了伤害，则你摸两张牌并删除对应选项。",
  dcaoren: "鏖刃",
  dcaoren_info: "每轮限X次（X为“暮锐”中已删除选项数），你使用的基本牌结算完毕后，可将之收回手牌。",
  houcheng: "侯成",
  dcxianniang: "献酿",
  dcxianniang_info: "每轮每项限一次，当你的牌被其他角色弃置或受到伤害后，你可以获得一名手牌数不小于你的角色至多两张牌，并可以交给另一名其他角色至多等量张牌；因此获得或交出的基本牌只能当【酒】使用。若你本轮因此技能获得其他角色的牌超过两张，则你失去1点体力。",
  dc_xiahouxuan: "新杀夏侯玄",
  dc_xiahouxuan_prefix: "新杀",
  dcboxuan: "博玄",
  dcboxuan_info: "你使用手牌结算完毕后，若此牌目标包含其他角色，你可展示牌堆底的三张牌，若其中有牌与你使用的牌：1.牌名字数相同，你摸一张牌；2.花色相同，你可弃置一名其他角色一张牌；3.类型相同，你可使用一张展示牌。",
  dcboxuan_rewrite: "博玄·改",
  dcboxuan_rewrite_info: "你使用手牌结算完毕后，若此牌有目标，你可展示牌堆底的三张牌，若其中有牌与你使用的牌：1.牌名字数相同，你摸一张牌；2.花色相同，你可弃置一名其他角色一张牌；3.类型相同，你可使用一张展示牌。",
  dcyizheng: "议政",
  dcyizheng_info: "你的回合开始时，你可与任意名其他角色各展示一张手牌，若展示的牌类型均相同，你可将这些牌交给一名角色，否则，你弃置这些牌。",
  dcguilin: "归林",
  dcguilin_info: `限定技，出牌阶段或你进入濒死状态时，你可以将体力回复至体力上限，然后失去${get.poptip("dcyizheng")}并修改${get.poptip("dcboxuan")}。`,
  dc_xiangchong: "新杀向宠",
  dc_xiangchong_prefix: "新杀",
  dcguying: "固营",
  dcguying_info: "结束阶段，你可以选择一名角色，其获得以下效果直到你的下个结束阶段开始前：下次受到伤害后，摸体力上限张牌（至多摸五张），然后将X张手牌交给你（X为其手牌数减体力上限）。若在此期间此效果未触发，你下次发动〖固营〗可以多选择一名角色。",
  dcmuzhen: "睦阵",
  dcmuzhen_info: "出牌阶段，你可以将一种类型的X张牌交给一名其他角色(X为本阶段此技能发动次数，每种类型限一次），然后选择一项:1.令其弃置等量其他类型的牌， 不足则全弃并展示手牌；2、获得其场上等量的牌；3、令其展示牌堆顶等量的牌，并获得其中类型相同的牌。",
  dc_zhugejun: "新杀诸葛均",
  dc_zhugejun_prefix: "新杀",
  dcgengdu: "耕读",
  dcgengdu_info: "出牌阶段开始时，你可以亮出牌堆顶四张牌，并选择一种颜色的所有牌获得。若你选择的颜色为：黑色，本阶段限X次，你使用黑色牌后摸两张牌，这些牌本回合无法使用或打出且不计入手牌上限；红色，本阶段限X次，你可以将一张红色牌当作本回合未被使用过的普通锦囊牌使用。（X为本次你未获得的亮出牌数）",
  dcgumai: "孤脉",
  dcgumai_info: "每轮限一次，你造成或受到伤害时，若你有手牌，你可以展示所有手牌并令此伤害+1/-1。若展示的牌花色均相同，你可以弃置一张手牌令此技能视为未发动过。",
  jimiaojimu: "吉邈吉穆",
  dczouyi: "诹议",
  dczouyi_info: "出牌阶段限一次，你可执行至多两项：1.你摸两张牌并可弃置一名其他角色一张牌；2.你弃置一张牌并可令一名其他角色摸两张牌。结算后〖掩袭〗使用次数增加X，你回复X点体力（X为手牌数与你相同的角色数）。",
  dcyanxi: "掩袭",
  dcyanxi_info: "每局游戏限零次，其他角色回合结束时，你可视为对其使用一张【杀】（此杀造成的伤害改为失去体力），结算后若此技能可使用次数不为0，再次发动直至此技能无使用次数或其阵亡。",
  mamiao: "马邈",
  dczhangguan: "仗关",
  dczhangguan_info: "每回合开始时，你可将手牌数调整至体力值，然后若你的手牌数：不变，你回复1点体力；减少，若当前回合角色不为你，你获得其一张牌。",
  dccongfeng: "从风",
  dccongfeng_info: "你/其他角色不因此技能获得其他角色/你的牌后，可额外随机获得一张。",
  dc_zhangshiping: "新杀张世平",
  dc_zhangshiping_prefix: "新杀",
  dcbinji: "镔济",
  dcbinji_info: "每轮开始时，你可以摸三张牌，然后交给至多三名其他角色各一张牌。当这些角色失去这些牌后，其从牌堆或弃牌堆中随机获得一张武器牌，然后你摸一张牌。",
  dczangmao: "驵贸",
  dczangmao_info: "出牌阶段限三次，你可以：1.弃置任意张方块牌，然后从牌堆或弃牌堆随机获得等量张坐骑牌；2、交给一名其他角色一张方块牌，然后获得其装备区一张坐骑牌；3、将一张坐骑牌置入一名其他角色装备区， 然后其交给你两张手牌。",
  dc_weifeng: "新杀魏讽",
  dc_weifeng_prefix: "新杀",
  dchuozhong: "惑众",
  dchuozhong_info: "出牌阶段限两次，你可以展示一张手牌并选择攻击范围内任意名其他角色，这些角色依次选择一项：1.获得另一名其他角色的一张牌；2.交给你一张牌。全部结算后，手牌数最多的其他角色展示手牌并将所有与你展示牌类型相同的牌置于牌堆顶。",
  dczhuguo: "蛀国",
  dczhuguo_info: "锁定技，每回合限三次，牌堆牌数量增加后，你从牌堆底摸两张牌。",
  dc_muludawang: "新杀木鹿大王",
  dc_muludawang_prefix: "新杀",
  dczhoufa: "咒法",
  dczhoufa_info: "出牌阶段限一次，你可以将一张非基本牌当伤害牌使用，此牌造成的伤害为雷电伤害。",
  dcshouqun: "兽群",
  dcshouqun_info: `摸牌阶段，你可以改为展示牌堆顶X张牌（X为你的体力上限），并选择一项：1.获得其中的坐骑牌、锦囊牌、【杀】和【酒】，然后你体力上限+1（不能超过初始上限）；2.获得所有展示牌，然后直到你的下回合开始，你获得${get.poptip("dcyuxiang")}且每次受到火焰伤害后，体力上限-1。`,
  dcyuxiang: "驭象",
  dcyuxiang_info: "锁定技，你计算与其他角色的的距离-2，你对距离2以内的角色使用的【杀】不能被响应。",
  yue_caozhi: "乐曹植",
  yue_caozhi_prefix: "乐",
  dcfuyue: "赋乐",
  dcfuyue_info: "锁定技。①游戏开始时，你将手牌标记为“赋”。②你的“赋”牌不计入手牌上限。③当你标记手牌为“赋”时，你令其随机获得另一种非装备牌牌名。④你使用“赋”牌时可选择使用该牌所拥有的任意一种牌名。",
  dcwenlan: "文澜",
  dcwenlan_info: "当你每使用或打出两张牌结算结束后，若这两张牌均为“赋”且包含相同牌名，则你从牌堆中获得这两张“赋”包含牌名的牌各一张并标记为“赋”；否则你选择任意张手牌，随机变更其中的“赋”获得的牌名并将其余牌标记为“赋”。"
};
const characterTitles = {
  //dc_feiyi: "",
  yue_caozhi: "漱律缀章",
  dc_muludawang: "八纳洞主",
  dc_zhangshiping: "慷赀桃园",
  dc_weifeng: "趁浪逐波",
  mamiao: "退路自有",
  re_panfeng: "联军上将",
  xingdaorong: "零陵上将",
  dc_xiahouen: "乌禾同仓",
  caoxing: "健儿",
  re_chunyuqiong: "西园右校尉",
  xiahoujie: "当阳虎胆",
  dc_caiyang: "一据千里",
  zhoushan: "荆吴刑天",
  dc_xiahouxuan: "玄隐山林",
  dc_kongrong: "凛然重义",
  re_dongbai: "魔姬",
  re_sunluyu: "舍身饲虎",
  heyan: "傅粉何郎",
  zhaoyan: "霞蔚青歇",
  wangtao: "晔兮如华",
  wangyue: "温乎如莹",
  zhangxuan: "玉宇嫁蔷",
  tengyin: "厉操遵蹈",
  zhangyao: "琼楼孤蒂",
  xiahoulingnv: "女义如山",
  dc_sunru: "呦呦鹿鸣",
  pangshanmin: "抱玉向晚",
  kuaiqi: "依云睦月",
  jimiaojimu: "戮力同心",
  dc_huangwudie: "刀弓双绝",
  dc_liuli: "安平王",
  liuyong: "甘陵王",
  wanniangongzhu: "还汉明珠",
  zhanghu: "晋阳侯",
  lvlingqi: "无双虓姬",
  tenggongzhu: "芳华荏苒",
  panghui: "临渭亭侯",
  dc_zhaotongzhaoguang: "翊赞季兴",
  yuantanyuanxiyuanshang: "兄弟阋墙",
  yuechen: "广昌亭侯",
  panghong: "针砭时弊",
  villain_kongyiji: "禁止盗用",
  re_kanze: "慧眼的博士",
  re_chendeng: "湖海之士",
  caimaozhangyun: "乘雷潜狡",
  dc_lvkuanglvxiang: "数合斩将",
  dc_gaolan: "诽殇之柱",
  yinfuren: "委身允翕",
  chengui: "弄虎如婴",
  chenjiao: "刚断骨鲠",
  dc_sp_jiaxu: "料事如神",
  qinlang: "跼高蹐厚",
  dc_dongzhao: "筹定魏勋",
  houcheng: "猢威挽骊",
  mamidi: "南冠楚囚",
  dc_jiling: "仲家的主将",
  zhangxun: "仲家将军",
  dc_yuejiu: "仲家军督",
  leibo: "背仲豺寇",
  qiaorui: "跛夫猎虎",
  dongwan: "蜜言如鸩",
  yuanyin: "载路素车",
  guanning: "辟境归元",
  huzhao: "阖门守静",
  dc_huangchengyan: "捧月共明",
  mengjie: "万安隐者",
  wanglie: "通识达道",
  huaxin: "渊清玉洁",
  luyusheng: "义姑",
  re_xunchen: "三公谋主",
  re_miheng: "狂傲奇人",
  fengxi: "东吴苏武",
  re_dengzhi: "绝境的外交家",
  dc_yanghu: "制纮同轨",
  zongyu: "九酝鸿胪",
  guanhai: "掠地劫州",
  liupi: "慕义渠帅",
  peiyuanshao: "买椟还珠",
  zhangchu: "大贤后裔",
  zhangkai: "无餍狍鸮",
  dc_zhangmancheng: "蚁萃宛洛",
  dc_zhugejun: "三珠之隐根",
  dc_xiangchong: "镇军之岳",
  dc_lifeng: "继责尽任",
  dc_liuba: "清尚之节",
  dc_huangquan: "忠事三朝",
  furongfuqian: "奕世忠义",
  xianglang: "校书翾翻",
  dc_huojun: "坚磐石锐",
  gaoxiang: "玄乡侯",
  dc_wuban: "激东奋北",
  jiangfei: "社稷股肱",
  dc_zhangyì: "执忠守义",
  dc_jiben: "白虹贯日",
  zhenghun: "民安寇灭",
  dc_sunhanhua: "青丝慧剑",
  liuchongluojun: "定境安民",
  wupu: "健体养魄",
  dc_huanghao: "便辟佞慧",
  dc_sunziliufang: "谄陷负讥",
  dc_sunchen: "凶竖盈溢",
  dc_jiachong: "始作俑者",
  gongsundu: "雄张海东",
  mengyou: "蛮杰陷谋",
  dc_sp_menghuo: "勒格诗惹",
  gongsunxiu: "寸莛击钟",
  dc_sp_zhurong: "诗惹喜莫",
  dc_mateng: "驰骋西陲",
  yue_zhouyu: "顾曲周郎",
  yue_diaochan: "檀声向晚",
  yue_caiwenji: "胡笳十八拍",
  yue_zhoufei: "芙蓉泣露",
  yue_caiyong: "焦尾识音",
  yue_xiaoqiao: "绿绮嫒媛",
  yue_daqiao: "玉桐姊韵",
  yue_miheng: "鹗立鸷群",
  yue_zoushi: "淯水吟",
  yue_zhugeguo: "玉露清音"
};
const characterIntro = {
  weifeng: "魏讽（？—219年），字子京，济阴（一说沛国）人。东汉末年历史人物。颇有智谋，口才出众，善于蛊惑人心。倾动邺城，相国钟繇辟为西曹掾。建安二十四年，魏讽趁曹操大军未返，与长乐卫尉陈祎谋袭魏都邺城。陈祎心中恐惧，向太子曹丕告密。最终魏讽被杀，连坐死者数十人（一作数千人）",
  mamiao: "马邈（生卒年不详），三国时蜀汉江油守将。景耀六年（263年），司马昭派军队大举进攻蜀汉，邓艾率军偷渡阴平，先登至江油，马邈投降。",
  jimiaojimu: "吉邈（？~218年），字文然，吉穆（？~218年），字思然，东汉末年太医令吉平之子。建安二十三年正月，与吉平、少府耿纪、丞相司直韦晃、京兆人金祎起兵许都反抗曹操，事败被杀。",
  houcheng: "侯成（生卒年不详），东汉末年吕布帐下将领。因献酒遭吕布责骂而心不自安，在曹操围下邳时，与宋宪、魏续缚陈宫、高顺，率众降曹操。",
  panghong: "庞宏（生卒年不详），又作庞厷、庞肱，字巨师，荆州襄阳（今湖北襄樊）人，庞统之子，三国时期蜀汉涪陵太守。他刚正直率，敢于褒贬人物，因看不起尚书令陈袛，受到陈袛压制，死在涪陵太守的任上。",
  liuli: "刘理（？—244年），字奉孝，涿郡涿县（今河北涿州）人，三国时期蜀汉昭烈帝刘备之子，蜀汉后主刘禅、甘陵王刘永异母弟。章武元年（221年），刘备称帝，派司徒许靖封刘理为梁王。建兴八年（230年），改封为安平王。延熙七年（244年），刘理去世，谥号悼王。",
  xingdaorong: "邢道荣是《三国演义》中虚构的人物，为零陵太守刘度手下武将，被评价有万夫不当之勇，于《三国演义》第五十二回登场，被赵云刺死。",
  caoxing: "曹性，东汉末年吕布部将，史载他曾与身为自己上司的反叛者郝萌交战，并砍去郝萌一臂，受到吕布的嘉奖。在罗贯中所著古典小说《三国演义》中，也有关于曹性箭射夏侯惇左目的描述，而曹性也随即被暴怒的夏侯惇所杀。在穿越小说《三国之银河射手》中，主角穿越成为曹性，经过一番闯荡之后，被封为“银河射手”。",
  xiahoujie: "夏侯杰（？—208年），是罗贯中的小说《三国演义》中曹操的部将，征战时常常带在身边。在第42回长坂坡之战中，张飞大吼，从马儿受惊跌下马来而死。",
  huaxin: "华歆（157年－232年1月30日），字子鱼，汉族。平原郡高唐县人（今山东省高唐县）。汉末至三国曹魏初年名士、重臣。华歆早年拜太尉陈球为师，与卢植、郑玄、管宁等为同门，又与管宁、邴原共称一龙，华歆为龙头。汉灵帝时华歆被举为孝廉，任郎中，因病去官。又被大将军何进征召为尚书郎。后任豫章太守，甚得民心。孙策率军南下，华歆举郡投降，被奉为上宾。官渡之战时，被征为议郎、参司空军事。入为尚书、侍中，又代荀彧为尚书令。丞相曹操讨孙权时，授华歆为军师。后为魏王国的御史大夫。曹丕即王位，拜华歆为相国，封安乐乡侯。曹魏建立后，其相国职名改称司徒。魏明帝即位，升任太尉，晋封博平侯。太和五年十二月（232年1月），华歆去世，年七十五，谥号“敬”。有文集三十卷，今佚失，其余见《全三国文》。",
  luyusheng: "陆郁生（？年-？），三国时期吴国官员陆绩之女。陆郁生的父亲陆绩是吴郡公认的才子，又是当时吴郡陆氏的领袖。陆绩赴任担任郁林太守，遂取此名。陆郁生年少的时候就定下坚贞的志向。建安二十四年（219年)，陆绩早亡，她与两个兄弟陆宏、陆睿当时都只有几岁，一起返回吴县，被他们的从兄陆瑁接回抚养。13周岁的陆郁生嫁给同郡出身的张白为妻。出嫁3个月后，张白因为其兄张温一族的案件遭到连坐，被处以流刑，后死于流放地，陆郁生成为了寡妇，其后公开宣言不再改嫁，困难于生计但拒绝了所有提亲，在艰苦中从未停止服侍、照顾张白的姐妹。事情传到朝廷，皇帝褒奖陆郁生，号其为“义姑”。她的表侄姚信在文集中称赞她的义举。",
  fengxi: "冯熙（?—223年），字子柔，颍川郡父城县（今河南省平顶山市宝丰县）人。汉末三国时期吴国官员，东汉初年名将冯异的后人。孙权担任车骑将军时，冯熙担任其幕府东曹掾，后迁立信都尉。刘备去世时，奉命进入蜀汉吊丧，返回后，任中大夫。后奉命出使魏国，受到魏文帝曹丕和尚书令陈群招揽，宁死不从，自尽未果。孙权闻之流泪，称其“东吴苏武”。最终在曹魏死去。",
  heyan: "何晏（？－249年），字平叔。南阳郡宛县（今河南省南阳市）人。三国时期曹魏大臣、玄学家，东汉大将军何进之孙（一称何进弟何苗之孙）。何晏之父早逝，司空曹操纳其母尹氏为妾，他因而被收养，为曹操所宠爱。少年时以才秀知名，喜好老庄之学，娶曹操之女金乡公主。魏文帝在位时，未被授予官职。魏明帝认为何晏虚浮不实，也只授其冗官之职。大将军曹爽秉政时，何晏与之共事，得以累官至侍中、吏部尚书，典选举，封列侯。高平陵之变后，与大将军曹爽同为太傅司马懿所杀，被夷灭三族。何晏有文集十一卷，并曾与郑冲等共撰《论语集解》，今已佚。钟嵘《诗品》称“平叔鸿鹄之篇，风规见矣。”将何晏诗列入中品。袁宏在《名士传》中将何晏等称为正始名士。他与夏侯玄、王弼等倡导玄学，竞事清谈，遂开一时风气，为魏晋玄学的创始者之一。",
  zhaoyan: "赵嫣，生卒年不详。东吴方士（一说是丞相）赵达之妹，吴大帝孙权之妃，人称赵夫人。她心灵手巧，多才多艺，有“三绝”之称。孙权曾经想要找擅长绘画之人绘制山川地势军阵之图。赵达举荐了自己的妹妹。赵嫣认为水墨容易褪色，不方便在军旅之中保存。自己擅长刺绣，可以在锦帛上绣出孙权所需之图。待制作完成后献于孙权，只见方帛锦绣之上有五岳河海城邑行阵之形，孙权大为赞叹。时人谓之“针绝”。除刺绣之外，赵嫣还擅长绘画织锦，她能用彩丝织成云霞龙蛇之锦，大则盈尺，小则方寸，宫中谓之“机绝”。孙权在昭阳宫居住之时，饱受暑气之扰，以紫绡制成帷帐缓解暑气。赵嫣认为此物不足为贵，她削下自己的头发剖为细丝，以郁夷国出产的神胶连接，花了数月功夫将其制成一顶幔帐，打开之后薄如蝉翼，轻赛寒烟。放下帐帷能笼罩一丈之地，帐内清风自生暑意顿消。收起来则可纳入枕中，携带方便。时人谓之“丝绝”。",
  wangtao: "王桃是在《花关索传》中登场的虚拟人物，盗贼王令公的两个女儿之一，王悦的姐姐，与妹妹都是关索之妻。姐妹俩原为卢塘寨山贼，以武艺与美貌而闻名，被众多男性求婚却皆不与理睬。她们在关索回西川认父途中与关索交手时不敌，因意气投合而一齐下嫁。虽为架空之人物，但四川省内有记述夫妻三人共同守护葭萌关一事，民间亦流传如夫妻三人曾共同参与诸葛亮之南蛮征伐等轶事。",
  wangyue: "王悦是在《花关索传》中登场的虚拟人物，盗贼王令公的两个女儿之一，王桃的妹妹，与姐姐都是关索之妻。姐妹俩原为卢塘寨山贼，以武艺与美貌而闻名，被众多男性求婚却皆不与理睬。她们在关索回西川认父途中与关索交手时不敌，因意气投合而一齐下嫁。虽为架空之人物，但四川省内有记述夫妻三人共同守护葭萌关一事，民间亦流传如夫妻三人曾共同参与诸葛亮之南蛮征伐等轶事。",
  zhangxuan: "张嫙，三国时期孙吴将领张布之女，孙皓后妃张媱的姐姐。初为卫尉冯朝之子冯纯的妻子，后为孙皓后妃，册封左夫人。因孙皓诛灭张布，张媱口吐怨言，被暴怒的孙皓下令棒杀。后来孙皓怀念她的容颜，于是询问侍从：“张布还有女儿吗？”侍从回答：“张布的大女儿嫁给了已故卫尉冯朝的儿子冯纯。”于是孙皓夺走了冯纯的妻子张嫙，纳入宫中。孙皓颇为宠爱张嫙，册封其为左夫人。昼夜嬉戏，纸醉金迷，不理朝政。后来张嫙也去世了，孙皓非常悲伤，下令以最高的规格埋葬张嫙。因为悲伤过度，孙皓一度半年都不出宫门，甚至由于葬礼太过奢华被宫外之人认为孙皓已经死了。",
  tengyin: "滕胤（？－256年），字承嗣，三国时期吴国重臣，北海郡剧县（今山东省昌乐县）人。滕胤仪表堂堂，少时有节操，后娶公主为妻。孙权称王后，滕胤被封都亭侯。其后历任丹杨太守、吴郡太守、会稽太守。孙亮继位后，出任太常、卫将军。诸葛恪被杀后，群臣推举滕胤为司徒，但遭权臣孙峻党羽所阻挠，滕胤也有意避嫌，最终只晋爵高密侯。孙峻死后，由其堂弟孙綝执政。滕胤的连襟、骠骑将军吕据联系北伐前线诸将推举滕胤为相，希望分割孙綝权力，但并未成功，滕胤被改任大司马，镇守武昌。不久，滕胤与吕据密谋推翻孙綝，因计划泄露而被杀，惨遭灭族。孙綝被杀后，景帝孙休为滕胤平反。",
  zhangyao: "张美人，三国东吴末帝孙皓后妃，张布之女。另有张布女，张美人姊被孙皓立为左夫人。《吴书五妃嫔传第五》：江表传曰：皓以张布女为美人，有宠，皓问曰：“汝父所在？”答曰：“贼以杀之。”皓大怒，棒杀之。后思其颜色，使巧工刻木作美人形象，恒置座侧。问左右：“布复有女否？”答曰：“布大女适故卫尉冯朝子纯。”即夺纯妻入宫，大有宠，拜为左夫人，昼夜与夫人房宴，不听朝政，使尚方以金作华燧、步摇、假髻以千数。令宫人著以相扑，朝成夕败，辄出更作，工匠因缘偷盗，府藏为空。会夫人死，皓哀愍思念，葬于苑中，大作冢，使工匠刻柏作木人，内冢中以为兵卫，以金银珍玩之物送葬，不可称计。已葬之后，皓治丧於内，半年不出。国人见葬太奢丽，皆谓皓已死，所葬者是也。皓舅子何都颜状似皓，云都代立。临海太守奚熙信讹言，举兵欲还诛都，都叔父植时为备海督，击杀熙，夷三族，讹言乃息，而人心犹疑。",
  xiahoulingnv: "夏侯令女，字令女，名不详。生卒年不详，三国时期人物。夏侯文宁之女（《三国演义》中为夏侯令之女），曹文叔之妻。其事迹见于《三国志·魏书·诸夏侯曹传第九》裴松之注引皇甫谧《列女传》。而在《三国演义》中，由于作者断句错误，便认为“夏侯令女”是“夏侯令之女”之意（见《三国演义》第107回：“乃夏侯令女也”，由其语气可推断）。",
  lvlingqi: "吕玲绮，虚拟人物，源于日本光荣株式会社（现光荣特库摩公司）旗下游戏《真·三国无双》系列，初次登场于《真三国无双7：猛将传》。吕布的女儿，寂寥而威风凛凛的战姬，发挥着不亚于父亲的武艺，非常勇敢地身先士卒立于前线。虽然有着能够直面困难的坚强意志，却由于过去的经历而有着非常害怕孤独的一面。",
  liuyong: "刘永，字公寿，涿郡涿县（今河北涿州）人，三国时期蜀汉昭烈帝刘备之子，蜀汉后主刘禅之弟。章武元年（221年）六月，封鲁王。建兴八年（230年），改封甘陵王。咸熙元年（264年），蜀汉灭亡，刘永被迁往洛阳，被任命为奉车都尉，封乡侯。",
  wanniangongzhu: "刘氏（生卒年不详），河南郡雒阳县（今河南省洛阳市）人，汉灵帝刘宏之女，汉少帝刘辩与汉献帝刘协的姐妹，封万年公主。",
  mamidi: "马日磾（？～194年），字翁叔。扶风茂陵（今陕西省兴平市）人。东汉中后期大臣，经学大师马融之族孙（一作族子）。马日磾年轻时即继承马融学说，以才学入仕。曾任谏议大夫，与蔡邕、卢植等人东观典校官藏的《五经》记传，并参与续写《东观汉记》。后历任射声校尉、太尉、太常等职。初平三年（192年），掌权的李傕任命马日磾为太傅、录尚书事，与太仆赵岐共同出使关东。他到寿春袁术处后，对其多有所求，遭袁术轻鄙，袁术遂夺其符节，来随意征辟将士，并企图强迫马日磾任其军师，马日磾求去不能，忧愤发病，兴平元年（194年），卒于寿春。",
  guanning: "管宁（158年—241年），字幼安。北海郡朱虚县（今山东省安丘、临朐东南）人。汉末三国时期著名隐士。管宁与华歆、邴原并称为“一龙”。汉末天下大乱时，与邴原及王烈等人避于辽。在当地只谈经典而不问世事，做讲解《诗经》《书经》，谈祭礼、整治威仪、陈明礼让等教化工作，人们都很乐于接受他的教导。直到魏文帝黄初四年（公元223年）才返乡，辽东太守公孙恭亲自送别。此后曹魏几代帝王数次征召管宁，他都没有应命。正始二年（公元241年），管宁逝世，年八十四。著有《氏姓论》。",
  tenggongzhu: "滕公主，名讳不详，三国人物，吴大帝孙权之女。一说为养女，生父为孙权堂弟孙奂。黄武年间（222年—228年），以公主身份下嫁功臣滕胄之子滕胤，当时滕胤年仅20岁。滕胤皮肤白皙，容貌俊美，每逢入朝大臣们没有不惊叹称羡的。滕胤仕官后，上书言及时局，又对政策多有匡弼。孙权对公主也特别宠爱，因为滕胤的缘故，又格外增加对公主的赏赐，又几次探望慰劳。少帝孙亮时期，孙綝以宗室身份独揽大权作恶多端，引发群臣不满。五凤三年（256年）滕胤与连襟吕据密谋推翻孙綝，事败遭到夷三族 。公主则被亲兄孙壹救出，携其逃亡曹魏。",
  caimaozhangyun: "蔡瑁，字德珪，生卒年不详。襄阳蔡州人，东汉末年荆州名士。少年时与曹操交好。初平元年（公元190年），刘表为荆州刺史。时宗贼猖獗，蔡瑁协助刘表诛杀宗贼，平定荆州之地，蔡瑁因此得刘表重用，并在刘表任镇南将军时担任他的军师。刘表病亡后，蔡瑁拥护刘表幼子刘琮继位，并逼迫他投降南征的曹操。蔡瑁在曹操麾下历任从事中郎、司马、长水校尉，受封汉阳亭侯。张允，生卒年不详，荆州牧刘表的外甥，与蔡瑁一样是刘表幼子刘琮的党羽。刘表病重之时，张允害怕刘表会把州牧之位传给长子刘琦，于是将远赴而来的刘琦阻于门外，不准他与刘表相见。曹操大军到达新野时，张允也随蔡瑁一同投降曹操。之后便隐没于历史之中，并无记载。在《三国演义》中，蔡瑁张允擅长水战，是东吴心腹大患。周瑜用反间计诱骗曹操除掉二人，使得曹军再无能够统领水军的大将。",
  zhangxun: "张勋，东汉末年军阀袁术帐下大将，袁术称帝后受封大将军。初平四年（公元193年），袁术引兵入陈留，被曹操、袁绍合力击败，逃至雍丘。后入九江，杀死扬州刺史陈温而自领之，并任命张勋、桥蕤为大将。时孙策依附于袁术，被表为怀义校尉，张勋对其倾心敬服。袁术称帝后，任命张勋为大将军，攻打吕布，大败而还。其后曹操又以袁术称帝为名南下进攻，袁术闻之大惊，即走度淮，留张勋、桥蕤守蕲阳以拒曹。曹操破其军，斩桥蕤，张勋退走。建安四年（公元199年），袁术病死，张勋率残军欲南投孙策，途中被袁术旧部刘勋俘虏，其后下落不明。",
  huzhao: "胡昭（162年－250年），字孔明，颍川（治今河南禹州）人。汉末三国时期隐士、书法家。胡昭善长隶书，与钟繇、邯郸淳、卫觊、韦诞齐名。有“钟氏小巧，胡氏豪放”之说，世人并称“钟胡”。",
  guanhai: "管亥（生卒年不详），青州黄巾军渠帅，率军侵略北海，围北海相孔融于都昌。孔融派遣太史慈突围而出，前往平原向刘备求援，刘备率军来到，击退管亥。《三国演义》中管亥在单挑中为关羽斩杀。",
  yinfuren: "尹夫人，原汉大将军何进的儿媳，丈夫早逝，生有一子何晏。曹操任司空时娶尹氏为妾，一并收养何晏，并生有一子曹矩。",
  chengui: "陈珪（生卒年不详），一作圭，字汉瑜。徐州下邳（治今江苏睢宁西北）人，广汉太守陈亹之孙，太尉陈球之侄，吴郡太守陈瑀（一作陈璃）、汝阴太守陈琮的从兄，陈登、陈应之父。官至沛相。",
  wanglie: "王烈，字彦方（141-219），平原县（今山东德州平原）人。生于永和六年（公元141年），卒于建安二十三年（公元218年）。王烈少时师从陈寔，闻名遐迩。董卓作乱时避乱辽东，并多次拒绝曹操的聘请。七十八岁时病死于辽东。",
  panghui: "庞会，（214—？），三国时期曹魏名将，庞德之子。曹丕即位后，思庞德忠烈，遂赐庞会等兄弟四人爵关内侯，邑各百户。庞会勇烈，有先父之风，官至中尉将军，封列侯。",
  chenjiao: "陈矫（？－237年7月11日），字季弼，广陵郡东阳县（治今安徽省天长市西北，今地属江苏省如皋市）人。三国时期曹魏名臣。陈矫本姓刘，因过继与母族而改姓陈。早年避乱江东，后广陵太守陈登请为功曹。曹操辟为丞相掾属，迁任相县令，转任征南长史。又为彭城、乐陵太守，迁任魏郡西部都尉。曹操东征，拜丞相长史，转西曹属、尚书。曹丕称帝，领吏部事，封高陵亭侯，迁尚书令。明帝继位后，进爵东乡侯，后转侍中，加光禄大夫，又拜司徒。景初元年（237年），陈矫去世，谥贞侯。",
  gongsundu: "公孙度 （？－204年），字升济，辽东襄平（今辽宁辽阳）人，东汉末年辽东太守。少随父迁居玄菟郡。初为玄菟小吏，建宁二年（169年），继升尚书郎、冀州刺史，后被免官。初平元年（190年），经同乡徐荣推荐，被董卓任命为辽东太守。公孙度到任后，厉行严刑峻法，打击豪强势力，使令行政通，羽翼渐丰。不久，中原地区董卓乱起，各地军阀无暇东顾。公孙度趁机自立为辽东侯、平州牧。继则东伐高句丽，西击乌桓，南取辽东半岛，越海取胶东半岛北部东莱诸县，开疆扩土；又招贤纳士，设馆开学，广招流民，威行海外，俨然以辽东王自居。建安九年（204年）病逝，子公孙康继承其位由于公孙度的锐意进取和苦心经营，使辽东地区在汉末三国的战乱年代，获得了暂时的安宁，推动了当地生产技术和封建文化的发展。",
  leibo: "雷薄（生卒年不详），本为东汉末年袁术麾下部将。离开称帝后昏庸奢侈的袁术，与陈兰一起占据嵩山为山贼。后来袭击兵败的袁术，抢夺财宝。同时在《三国演义》中也有出场。",
  liupi: "刘辟，东汉末年黄巾起义军将领。黄巾军将领。黄巾之乱后，与龚都一起率军盘踞在汝南。欲追随刘备，将汝南让给刘备。《三国演义》中，在与曹操的部将高览交战时，为保护刘备而战死。",
  zhenghun: "郑浑（生卒年不详），字文公。开封（今河南省开封市）人。汉末及三国时期曹魏大臣，东汉名儒郑众曾孙、名士郑泰之弟。郑浑早年避乱淮南，后转投豫章太守华歆。又被曹操辟为掾属，历任下蔡县长、邵陵县令，任内颇有政绩，深得民心。任左冯翊时，击杀扰乱郡县的梁兴，又击败作乱的山贼。历任上党太守、京兆尹、丞相掾属等职。曹丕称帝后，拜侍御史，加驸马都尉。先后任阳平、沛郡太守，任内兴修水利，使农田常年丰收，被百姓称为“郑陂”。后转任山阳和魏郡太守。魏明帝曹叡听闻郑浑的事迹之后，下诏将其政绩布告天下。官至将作大匠。卒年不详。",
  furongfuqian: "傅肜（？－222年），义阳（今湖北枣阳）人，三国时蜀汉将领。刘备攻伐吴国时，傅肜为别督。后刘备被陆逊击败，傅肜率部断后，奋战至死。死前怒斥道：“吴狗！何有汉将军降者！”<br>傅佥[qiān] ( ? ~263年），义阳（治今湖北省枣阳市)人，蜀汉将领傅彤之子，三国时期蜀汉名将。金长于谋略，并颇有胆勇，姜维甚爱之。傅佥官至关中都督。魏国攻伐蜀汉时，傅佥和蒋舒防守阳安关，兵败战死。",
  qinlang: "秦朗（生卒年不详），字元明，小字阿蘇（一作阿鳔），新兴（治今山西忻州）云中人。三国时期曹魏将领，官至骁骑将军、给事中，曾率兵讨伐鲜卑轲比能和步度根的叛军。",
  xianglang: "向朗（约167年—247年），字巨达。襄阳郡宜城县（今湖北宜城）人，三国时期蜀汉官员、藏书家、学者。向朗早年师从于司马徽，并被荆州牧刘表任命为临沮县长。后随刘备入蜀，历任巴西、牂牁、房陵太守，并拜步兵校尉，领丞相长史，随丞相诸葛亮北伐。因包庇马谡被免职，后为光禄勋，转左将军、特进，封显明亭侯。曾代理丞相册封张皇后及太子刘璿。晚年专心研究典籍，诱导青年学习，家中藏书丰富，受到举国尊重。延熙十年（247年），向朗去世。《全三国文》收录有一篇《遗言戒子》",
  yuantanyuanxiyuanshang: "袁谭、袁尚的武将介绍请移步「袁谭袁尚」，此处为袁熙的介绍。<br>袁熙（？－207年），字显奕（《后汉书》、《东光世系》作显雍），汝南郡汝阳县（今河南商水）人，是东汉末年占据河北的军阀袁绍次子，袁绍打败公孙瓒后，令袁熙为幽州刺史。袁绍官渡兵败后不久病死，其兄长袁谭、弟弟袁尚各自独立，互相攻伐，曹操趁机进攻袁谭、袁尚，并逐渐占河北。袁熙接纳兵败的袁尚后，因为属下叛变而逃往乌桓，被曹操击败后，逃往辽东太守公孙康帐下，却被公孙康杀死，二人首级被献给曹操。",
  zhanghu: "张虎，生卒年不详，雁门马邑(今山西朔城区大夫庄)人。张辽之子，三国时期曹魏武将。官至偏将军，封晋阳侯，有一子张统。",
  mengjie: "孟节，南中蛮王孟获之兄。是小说《三国演义》中杜撰的人物，史上并无记载。诸葛亮南征孟获之时，帐下军士因误饮哑泉之水失语。当地山神告知诸葛亮，言万安溪畔有一高士隐居彼处，号“万安隐者”。其草庵后有一泉，名安乐泉，可解哑泉之毒。庵前生有一草，名薤叶芸香，可防瘴气之染。诸葛亮于是带人连夜前往其隐居之处，求得泉水草叶解毒防瘴，拜求隐士姓名，方知其名为孟节，由此而叹：“方信盗跖、下惠之事，今亦有之。”诸葛亮欲申奏刘禅，立其为王，孟节辞之。又以金帛赠之，孟节坚辞不受。诸葛亮嗟叹不已，拜别而回。",
  peiyuanshao: "裴元绍，《三国演义》人物，原黄巾军之武将。黄巾起义失败之后，与周仓一同率领残部在山中落草当山贼。公元200年，在关羽欲返刘备旗下，在突破曹操的五道关卡后路过其落草之地，与周仓一同向关羽要求能以期成为关羽家臣。但此时仅周仓同行，其他弟兄则于山中等待。不久后，因其欲夺偶然路过的赵云之马，反遭讨伐战败身死。",
  zhangchu: "张楚，《阵面对决》第九弹“燎原”中登场的一个原创人物。她是张角的女儿，张宁的姐姐，在逃亡途中被刘备捕获。之后在诸葛亮的建议下，张楚被囚禁。在《阵面对决》的“怒焰”故事线中，张楚随着刘备入了西川，并被软禁在成都。夷陵之战后，刘备大败，全国主力外出用以支援刘备，朝内空虚，张楚趁机逃跑。",
  dongwan: "董绾，袁术老婆，嫉妒冯芳女的美貌，与冯方女有矛盾。",
  yuanyin: "袁胤（生卒年不详），东汉末期人物，据说是袁隗之子，是袁术从弟。兴平二年（公元195年）被袁术任命为丹杨太守，后因孙策平定江东被逐。建安四年（公元199年），袁术卒，袁胤因畏惧曹操，遂率领袁术部曲并带着其灵柩及妻子到皖城并投奔庐江太守刘勋。6个月后皖城被孙策所破，袁胤等人迁居吴郡，此后事迹不详。",
  gaoxiang: "高翔（又作高详、高祥）（生卒年不详），荆州南郡（治今湖北省公安县）人，三国时期蜀汉将领。曾随刘备攻打汉中，后又随蜀汉丞相诸葛亮参加北伐曹魏的战争。建兴九年（公元231年）的北伐中大破司马懿。官至杂号大将军（即某杂号将军加大，但无考何杂号将军），封玄乡侯。此后，关于高翔的记载不详。",
  zhoushan: "周善，《三国演义》中人物，不见于正史记载。为吴侯孙权的家将，此人最有胆量，自幼穿房入户，多随孙策。权为骗其妹回吴，遣善将五百人，扮为商人，分作五船；更诈修国书，以备盘诘；船内暗藏兵器。周善领命，往荆州。正骗得孙夫人带刘禅上船，赵云前来抢走禅，周善在后梢挟住舵，只顾放船下水。正僵持时张飞赶到，周善见张飞上船，提刀来迎，被张飞手起一剑砍倒，提头掷于孙夫人前。",
  zhangkai: "张闿，陶谦的手下都尉。奉命截杀曹操之父曹嵩，杀死曹嵩，夺去财宝逃往淮南投奔袁术，并担任刺杀陈王刘宠和陈国相骆俊的任务。",
  mengyou: "孟优，《三国演义》里的人物，南蛮王孟获之弟。与诸葛亮的南征军交战，向败战的兄长推荐朵思大王，劝兄长借助朵思之力与蜀汉军对抗。后来与兄长一起发誓归顺蜀汉。",
  liuchongluojun: "刘宠（?~197年），汉明帝刘庄玄孙，陈敬王刘羡曾孙，陈顷王刘崇之孙，陈孝王刘承之子，陈国第六位国君，也是东汉陈国的最后一位国君。骆俊（?-197），字孝远，东汉末年扬州会稽郡乌伤县（今浙江义乌）人。宗室陈王刘宠的国相，在任期间励精图治，深得民众爱戴。刘宠勇猛过人，善使弓弩，箭法高超。在其父刘承死后，继承陈王爵位。中平年间，黄巾军起义，郡县官兵都弃城逃走，刘宠于是征兵自守卫。当时天下饥荒，诸王侯都已不再享有租赋，反屡遭抢掠，有的甚至流离在外，死于荒野。只有陈国仍很富强，邻郡百姓纷纷前去投靠，陈国拥有部众达十余万人。初平元年（190年），各州郡起兵讨伐董卓，刘宠率军屯驻阳夏，自称辅汉大将军。建安二年（197年），袁术向陈国求取粮草，遭陈国国相骆俊拒绝，袁术大为生气，便派刺客张闿假装路过陈国，乘机杀死骆俊和刘宠。",
  yuechen: "乐綝（195~257年），字号不详，阳平郡卫国县（今河南省清丰县）人。三国时期曹魏将领，右将军乐进的儿子。果毅坚毅，袭封广昌亭侯，累迁扬州刺史。甘露二年，为叛乱的征东大将军诸葛诞所杀，追赠卫尉。",
  kuaiqi: "蒯祺（?~219年），南郡中卢人，荆州望族子弟，与荆州牧刘表帐下谋士蒯良、蒯越为同族，东汉末年房陵太守。建安二十四年（219年），汉中王刘备遣宜都太守孟达从秭归北攻房陵，蒯祺于战斗中被孟达所部士兵所杀。清朝任兆麟《心斋十种》中的《襄阳记》辑本引用《万历襄阳府志》“（蒯）钦从祖祺妇，即诸葛孔明之姊也”，称蒯祺娶故兖州泰山郡丞诸葛珪长女，即他是知名政治家、蜀汉丞相诸葛亮的姐夫。但在任兆麟之前的《襄阳记》辑本中，并没有这一条。",
  pangshanmin: "庞山民，荆州襄阳人，三国时期曹魏大臣。庞山民出身荆州庞氏，为隐士庞德公之子、凤雏庞统的堂兄，娶诸葛亮二姐诸葛氏（“若雪”为网络小说虚构）为妻。后出仕曹魏，历任黄门、吏部郎等职。",
  gongsunxiu: "公孙修（？－238），三国时期人物，公孙渊之子。景初元年（237年），魏明帝曹叡派出幽州刺史毌丘俭攻打公孙渊，久战不利回师。公孙渊即自立为燕王，改元绍汉，引诱鲜卑侵扰北方，背叛曹魏。景初二年（238年）春，曹魏又派司马懿和高句丽国王高位宫率军攻打公孙渊，围城日久，公孙渊粮尽之后，与儿子公孙修一起出逃后被擒获，父子二人同时被斩首示众。",
  wupu: "吴普，三国时期医药学家。名医华佗弟子。广陵(今扬州)人。约三世纪中叶在世。他以华佗所创五禽戏进行养生锻炼，因获长寿，“年九十余，耳目聪明，齿牙完坚”，但主要是在本草学上有一定成就。所撰《吴普本草》六卷，又名《吴氏本草》，为《神农本草经》古辑注本之一。流行于世达数百年，后代有不少子书引述其内容，如南北朝贾思勰《齐民要术》、唐代官修《艺文类聚》，《唐书·艺文志》还载有该书六卷书目。宋初所修《太平御览》，仍收载其较多条文。自此该书即散佚不存，清焦循有辑本。据辑佚可知，此书对本草药性的叙述较为详明，书中对某一类药常列述前代诸家关于药性的不同叙述，总汇魏晋以前药性研究之成果，又详载药物产地及其生态环境，略述药物形态及采造时月、加工方法等。但南朝齐、梁时陶弘景《本草经集注》对其“草石不分，虫兽无辨”有所批评。"
};
const characterFilters = {};
const dynamicTranslates = {
  dcyanxi(player) {
    return lib.translate["dcyanxi_info"].replace(/零/, get.cnNumber(player.countMark("dcyanxi")));
  },
  dcboxuan(player) {
    if (player.storage.dcboxuan) {
      return lib.translate["dcboxuan_rewrite_info"];
    }
    return lib.translate["dcboxuan_info"];
  },
  cuijian(player) {
    return "出牌阶段限一次，你可以选择一名有手牌的其他角色。若其手牌中有【闪】，则其将所有【闪】和防具牌交给你" + (player.hasMark("zhtongyuan_basic") ? "" : "，然后你交给其等量的牌") + "。" + (player.hasMark("zhtongyuan_trick") ? "若其手牌中没有【闪】，则你摸两张牌。" : "");
  },
  dunshi(player) {
    var info = player.storage.dunshi;
    var str = "每回合限一次。你可以视为使用或打出一张";
    var list = ["sha", "shan", "tao", "jiu"];
    for (var i of list) {
      var strx = "【" + get.translation(i) + "】";
      if (info && !info[0].includes(i)) {
        strx = '<span style="text-decoration:line-through;">' + strx + "</span>";
      }
      str += strx;
      if (i != "jiu") {
        str += "/";
      }
    }
    str += "，然后当前回合角色于本回合内下一次造成伤害时，你选择两项：⒈防止此伤害。系统从技能名中包含“仁/义/礼/智/信”字样的技能中随机选择三个其未拥有的技能，然后你令当前回合角色获得其中一个技能。⒉从〖遁世〗中删除你本次使用或打出的牌并获得一个“席”。⒊减1点体力上限并摸X张牌（X为你的“席”数）。";
    return str;
  },
  dcporui(player) {
    return "每轮限" + (player.hasMark("dcgonghu_basic") ? "两" : "一") + "次。其他角色的结束阶段，你可以弃置一张牌并选择另一名于此回合内失去过牌的其他角色，你视为对其依次使用X+1张【杀】" + (player.hasMark("dcgonghu_damage") ? "" : "，然后你交给其X张手牌") + "（X为其本回合失去的牌数且至多为5）。";
  },
  dcmanwang(player) {
    var num = 4 - player.countMark("dcmanwang");
    var str = "出牌阶段，你可以弃置任意张牌。然后你依次执行以下选项中的前等量项：";
    var list = [`⒈获得${get.poptip("dcpanqin")}。`, "⒉摸一张牌。", "⒊回复1点体力。", `⒋摸两张牌并失去${get.poptip("dcpanqin")}。`];
    for (var i = 0; i < 4; i++) {
      if (i == num) {
        str += '<span style="text-decoration: line-through;">';
      }
      str += list[i];
    }
    if (num < 4) {
      str += "</span>";
    }
    return str;
  },
  dcjianzhuan(player) {
    let str = "锁定技。①当你于出牌阶段使用牌时，你选择此阶段未执行过的一项执行：";
    const list = ["⒈令一名其他角色弃置X张牌", "；", "⒉摸X张牌", "；", "⒊重铸X张牌", "；", "⒋弃置X张牌"], info = get.info("dcjianzhuan").choices, storage = player.getStorage("dcjianzhuan");
    let choices = [];
    for (const k in info) {
      choices.push(k);
    }
    for (let i = 0; i < list.length; i++) {
      const j = i / 2, goon = Array.from({ length: list.length }).map((_, i2) => i2).includes(j);
      if (goon && storage.includes(choices[j])) {
        str += '<span style="text-decoration: line-through;">';
      }
      str += list[i];
      if (goon && storage.includes(choices[j])) {
        str += "</span>";
      }
    }
    return str + "（X为此技能于本阶段的发动次数）。②出牌阶段结束时，若你本阶段执行过〖渐专①〗的所有选项且〖渐专①〗剩余选项数大于1，则你随机移除〖渐专①〗的一项。";
  },
  dcpingzhi(player) {
    const bool = player.storage.dcpingzhi;
    let yang = "你弃置此牌，然后其视为对你使用一张【火攻】，若其未因此造成伤害则此技能视为未发动过", yin = "然后其使用此牌，若此牌造成伤害则此技能视为未发动过";
    if (bool) {
      yin = `<span class='bluetext'>${yin}</span>`;
    } else {
      yang = `<span class='firetext'>${yang}</span>`;
    }
    let start = "转换技。出牌阶段限一次，你可观看一名角色的手牌并展示其中一张牌，", end = "。";
    return `${start}阳：${yang}；阴：${yin}${end}`;
  },
  dcmurui: (player) => {
    let filters = [
      { key: "roundStart", text: "1、每轮开始时;" },
      { key: "phaseAfter", text: "2、有角色死亡的回合结束后;" },
      { key: "phaseBegin", text: "3、你的回合开始时。" }
    ];
    let storage = player.getStorage("dcmurui_filter");
    let str = filters.filter((f) => !storage.includes(f.key)).map((f) => f.text).join("");
    return `你可于以下时机点使用一张牌:${str || "无时机。"}若此牌造成了伤害，则你摸两张牌并删除对应选项。`;
  }
};
const voices = {
  "#dczhoufa1": "叱咄唎，吽嚤吒，风从虎、雨从龙！",
  "#dczhoufa2": "哞哞吒，哈噜嘎，风也大、雨也大！",
  "#dcshouqun1": "山精野怪听我号令，虎豹豺狼随我旗行！",
  "#dcshouqun2": "象狮虎豹狼豺魈，哇呀呀！皆列阵前行！",
  "#dc_muludawang:die": "哎哎哎！别踩别踩！",
  "#dcfuyue1": "曲终人不见，邺下风冷，落梅如坟。",
  "#dcfuyue2": "人言江南丝竹好，偏我来时不逢春。",
  "#dcwenlan1": "胸中万仞，寥落纸上数言。",
  "#dcwenlan2": "欲写当年白马篇，笺已破，笔已残。",
  "#yue_caozhi:die": "志较天高，命犹纸薄。",
  "#chijian1": "嘎达！他赵云算个屁！出来混要讲实力！",
  "#chijian2": "嘎达！这叫大青釭！寻常人可背不起！",
  "#shiwu1": "唔！剑你背过吗？人你杀过吗？",
  "#shiwu2": "唔！这叫实力！你懂吗！",
  "#dc_xiahouen:die": "啊！我的剑！",
  "#dcbinji1": "好铁锻成好兵器，保准能捅贼将一万个窟隆！",
  "#dcbinji2": "这铁好啊，硬的像虎骨，韧的像龙筋！",
  "#dczangmao1": "不才走南闯北，做得些贩马生意。",
  "#dczangmao2": "幽州驹、冀州马，铜钱换马，童叟无欺！",
  "#dc_zhangshiping:die": "什么？玄德奔南走了？",
  "#dchuozhong1": "杀贼之荣光，我魏讽，岂能独享！",
  "#dchuozhong2": "事败才叫造反，功成即是勤王！",
  "#dczhuguo1": "让邺城燃烧！让奸贼陨落！",
  "#dczhuguo2": "一声魏王，没了五十万枯骨！",
  "#dc_weifeng:die": "气死我了，气死我了！",
  "#dczhangguan1": "大将军战于前，我等何患之有？",
  "#dczhangguan2": "立国四十年，江油无战事！",
  "#dccongfeng1": "生义孰轻孰重，马某还拎的清！",
  "#dccongfeng2": "是他刘禅无德，非我等无义！",
  "#mamiao:die": "娘子？娘子！娘子呀~",
  "#dczouyi1": "今夜月黑风高，正乃除贼良时！",
  "#dczouyi2": "效日磾讨莽何罗，使汉祚不移！",
  "#dcyanxi1": "我等趁夜掩杀，曹贼必无可逃！",
  "#dcyanxi2": "今日先杀王必，明日再斩曹操！",
  "#jimiaojimu:die": "杀贼不成，天不祐汉！",
  "#dcgengdu1": "荷锄载露归，古卷伴青灯。",
  "#dcgengdu2": "阡陌桑麻入目，不羡长安万户。",
  "#dcgumai1": "松柏入青云，野菊守霜晨。",
  "#dcgumai2": "兄别之言在耳，不敢使田亩荒芜。",
  "#dc_zhugejun:die": "这田中禾黍，已熟二十八载矣。",
  "#dcjiaowei1": "古木为薪，来煎琴音。",
  "#dcjiaowei2": "天雷击焦木，弦动如天籁仙鸣。",
  "#dcfeibai1": "顺笔若枯丝平行，转折如青锋突起。",
  "#dcfeibai2": "以帚蘸金，可妆鸿都以飞白。",
  "#yue_caiyong:die": "笔颓墨尽，而立成老夫。",
  "#dcxidi1": "霜清飞鸟静，月明晚笛声。",
  "#dcxidi2": "玉声暗飞来，青城盈春风。",
  "#dcchengyan1": "素女乘烟去，白玉凤凰声。",
  "#dcchengyan2": "香魄成飞仙，凤萧月中闻。",
  "#yue_zhugeguo:die": "七情盈丹海，不敢妄飞升。",
  "#dcmanhou1": "既为蛮王之妻，当彰九黎之仪。",
  "#dcmanhou2": "君行役四海，妾怎敢居后。",
  "#dctanluan1": "暗索缚雄兵，尔等不过如此！",
  "#dctanluan2": "飞刀伤汉将，何人再来一战？",
  "#dc_sp_zhurong:die": "丞相已数释，夫君忘恩乎？",
  "#dcxianniang1": "将军！嘿嘿~酒来了~",
  "#dcxianniang2": "酒里没毒，真是的，自己吓自己！",
  "#houcheng:die": "将军，你不喝酒呀？",
  "#dcmurui1": "背水一战，将至绝地而何畏死。",
  "#dcmurui2": "破釜沉舟，置之死地而后生。",
  "#dcaoren1": "为国效死，百战不殆。",
  "#dcaoren2": "血染沙场，一往无前。",
  "#dc_zhangyì:die": "大汉，万胜！",
  "#dcpingzhi1": "陈祗何许人也？我等当重其虚！",
  "#dcpingzhi2": "这满朝朱紫，鲜有非酒囊饭袋之徒。",
  "#dcgangjian1": "道同则谋，道不同则不相为谋。",
  "#dcgangjian2": "怎么，陈尚书要教我几句道德仁义？",
  "#panghong:die": "不孝子宏，泉下无颜见父祖。",
  "#dcguyin1": "曲有误，不可不顾。",
  "#dcguyin2": "兀音曳绕梁，愿君去芜存菁。",
  "#dcpinglu1": "惊涛卷千雪，如林敌舰今何存？",
  "#dcpinglu2": "羽扇摧樯橹，纶巾曳风流。",
  "#yue_zhouyu:die": "高山难觅流水意，曲终人散皆难违。",
  "#dcmoshou1": "好战必亡，此亘古之理。",
  "#dcmoshou2": "天下汹汹之势，恪守方得自保。",
  "#dcyunjiu1": "此吾主之柩，请诸君勿扰。",
  "#dcyunjiu2": "故者为大，尔等欲欺大者乎？",
  "#yuanyin:die": "臣不负忠，虽死如是。",
  "#dctanban1": "将军，妾身奏的如何？",
  "#dctanban2": "将军还想再听一曲？",
  "#dcdiou1": "一日不见兮，思之如狂。",
  "#dcdiou2": "有一美人兮，见之不忘。",
  "#yue_diaochan:die": "红颜薄命，一曲离歌终。",
  "#dcshuangrui1": "刚柔并济，武学之道可不分男女。",
  "#dcshuangrui2": "人言女子柔弱，我偏要以武证道。",
  "#dcfuxie1": "箭射辕角，夏侯老贼必中疑兵之计。",
  "#dcfuxie2": "借父三矢以诱敌，佯装黄汉升在此。",
  "#dcshouxing1": "古时后羿射日，今我以星为狩。",
  "#dcshouxing2": "柔荑挽雕弓，箭出大星落。",
  "#dcshaxue1": "短兵奋进，杀人于无形。",
  "#dcshaxue2": "霜刃映雪，三步之内，必取汝性命！",
  "#dc_huangwudie:die": "谁说，战死沙场专属男儿？",
  "#dcyunzheng1": "佳人弄青丝，柔荑奏鸣筝。",
  "#dcyunzheng2": "玉柱冷寒雪，清商怨羽声。",
  "#dchuoxin1": "闻君精通音律，与我合奏一曲如何？",
  "#dchuoxin2": "知君有心意，此筝寄我情。",
  "#yue_zoushi:die": "雁归衡阳，良人当还……",
  "#dcduanti1": "流水不腐，户枢不蠹。",
  "#dcduanti2": "五禽锻体，百病不侵。",
  "#dcshicao1": "掌中非药，乃活人之根本。",
  "#dcshicao2": "药长于草木，然草木非皆可入药。",
  "#wupu:die": "医者，不可使人长生……",
  "#dcjianzhuan1": "今作擎天之柱，何怜八方风雨？",
  "#dcjianzhuan2": "吾寄百里之命，当居万丈危楼。",
  "#dcfanshi1": "垒巨木为寨，发屯兵自守。",
  "#dcfanshi2": "吾居伊周之位，怎可以罪见黜？",
  "#dc_caoshuang:die": "我度太傅之意，不欲伤我兄弟耳……",
  "#zangba:die": "短刃沉江，负主重托……",
  "#dcsanshi1": "春雨润物，未觉其暖，已见其青。",
  "#dcsanshi2": "养士效孟尝，用时可得千臂之助力。",
  "#dczhenrao1": "此病需静养，怎堪兵戈铁马之扰。",
  "#dczhenrao2": "孤值有疾，竟为文家小儿所扰。",
  "#dcchenlve1": "怀泰山之重，必立以千仞。",
  "#dcchenlve2": "万世之勋待取，此乃亮剑之时。",
  "#dc_simashi:die": "东兴之败，此我过也，诸将何罪！",
  "#dcjichou1": "备武整戈，待天下风起之时。",
  "#dcjichou2": "定淮联兖，邀群士共襄大义。",
  "#dcmouli1": "君上暗弱，以致受制于强臣。",
  "#dcmouli2": "吾闻楚王彪有智勇，可迎之于许都。",
  "#dczifu1": "今势穷，吾自缚于斯，请太傅发落。",
  "#dczifu2": "凌有罪，公劳师而来，唯系首待斩。",
  "#dc_wangling:die": "曹魏之盛，再难复梦……",
  "#dcshiju1": "借力为己用，可攀青云直上。",
  "#dcshiju2": "应势而动，事半而功倍。",
  "#dcyingshi1": "今君失道寡助，何不审时以降？",
  "#dcyingshi2": "君既掷刀于地，可保富贵无虞。",
  "#dc_jiangji:die": "大醉解忧，然忧无解，唯忘耳……",
  "#dcgangu1": "干父之蛊，全辽裔未竟之业。",
  "#dcgangu2": "承志奉祠，达于行伍之事。",
  "#dckuizhen1": "今一马当先，效霸王破釜！",
  "#dckuizhen2": "自古北马皆傲，视南风为鱼俎。",
  "#gongsunxiu:die": "大星坠地，父子俱亡……",
  "#dcfuli1": "民为贵，社稷次之，君为轻。",
  "#dcfuli2": "民之所欲，天必从之。",
  "#dcdehua1": "君子怀德，可驱怀土之小人。",
  "#dcdehua2": "以德与人，福虽未至，祸已远离。",
  "#dc_liuli:die": "覆舟之水，皆百姓之泪……",
  "#dcqiqin_yue_daqiao1": "山月栖瑶琴，一曲渔歌和晚音。",
  "#dcqiqin_yue_daqiao2": "指尖有琴音，何不于君指上听？",
  "#dczixi1": "日暮飞伯劳，倦梳头，坐看鸥鹭争舟。",
  "#dczixi2": "姊折翠柳寄江北，念君心悠悠。",
  "#yue_daqiao:die": "曲终人散，再会奈何桥畔……",
  "#dcqiqin1": "渔歌唱晚落山月，素琴薄暮声。",
  "#dcqiqin2": "指上琴音浅，欲听还需抚瑶琴。",
  "#dcweiwan1": "繁花初成，所幸未晚于桑榆。",
  "#dcweiwan2": "群胥泛舟，共载佳期若瑶梦。",
  "#yue_xiaoqiao:die": "独寄人间白首，曲误周郎难顾……",
  "#dcyijia1": "曹侯忠心可鉴，可暂居其檐下。",
  "#dcyijia2": "今东都糜败，陛下当移驾许昌。",
  "#dcdingji1": "丞相宜进爵国公，以彰殊勋。",
  "#dcdingji2": "今公与诸将并侯，岂天下所望哉！",
  "#dc_dongzhao:die": "凡有天下者，无虚伪不真之人……",
  "#dcliangxiu1": "君子性谦，不夺人之爱。",
  "#dcliangxiu2": "蒯门多隽秀，吾居其末。",
  "#dcxunjie1": "君子有节，可杀而不可辱。",
  "#dcxunjie2": "吾受国命，城破则身死。",
  "#kuaiqi:die": "泉下万事休，人间雪满头……",
  "#dccaisi1": "扶耒耜，植桑陌，习诗书，以传家。",
  "#dccaisi2": "惟楚有才，于庞门为盛。",
  "#dczhuoli1": "良梓千万，当擢才而用。",
  "#dczhuoli2": "任人唯才，不妨寒门入上品。",
  "#pangshanmin:die": "九品中正后，庙堂无寒门。",
  "#dcbeini1": "臣等忠心耿耿，陛下何故谋反？",
  "#dcbeini2": "公等养汝，正拟今日，复何疑？",
  "#dcshizong1": "成济、王经已死，独我安享富贵。",
  "#dcshizong2": "吾乃司马公心腹，顺我者生！",
  "#dc_jiachong:die": "诸公勿怪，充乃奉命行事……",
  "#dczigu1": "卿有成材良木，可妆吾家江山。",
  "#dczigu2": "吾好锦衣玉食，卿家可愿割爱否？",
  "#dczuowei1": "不顺我意者，当填在野之壑。",
  "#dczuowei2": "吾令不从者，当膏霜锋之锷。",
  "#dc_sunchen:die": "臣家火起，请离席救之……",
  "#dclvecheng1": "我等一无所有，普天又有何惧？",
  "#dclvecheng2": "我视百城为饵，皆可食之果腹。",
  "#dczhongji1": "羸汉暴政不息，黄巾永世不绝。",
  "#dczhongji2": "宛洛膏如秋实，怎可不生螟虫？",
  "#dc_zhangmancheng:die": "逡巡不前，坐以待毙……",
  "#dclingkong1": "吴宫绿荷惊涟漪，飞燕啄新泥。",
  "#dclingkong2": "箜篌奏晚歌，渔樵有归期。",
  "#dcxianshu1": "居宠而不骄，秉贤淑于内庭。",
  "#dcxianshu2": "心怀玲珑意，宜家国于春秋。",
  "#yue_zhoufei:die": "红颜薄命，望君珍重……",
  "#dcyouzhan1": "本将军在此！贼仲达何在？",
  "#dcyouzhan2": "以身为饵，诱老贼出营。",
  "#dc_wuban:die": "班……有负丞相重望……",
  "#dcshuangjia1": "塞外青鸟匿，不闻折柳声。",
  "#dcshuangjia2": "向晚吹霜笳，雪落白发生。",
  "#dcbeifen1": "此心如置冰壶，无物可暖。",
  "#dcbeifen2": "年少爱登楼，欲说语还休。",
  "#yue_caiwenji:die": "天何薄我，天何薄我……",
  "#dcminze1": "百姓千载皆苦，勿以苛政待之。",
  "#dcminze2": "黎庶待哺，人主当施恩德泽。",
  "#dcjini1": "备劲弩强刃，待恶客上门。",
  "#dcjini2": "逆贼犯境，诸君当共击之。",
  "#liuchongluojun:die": "袁术贼子，折我大汉基业……",
  "#dcporui1": "承父勇烈，问此间谁堪敌手。",
  "#dcporui2": "敌锋虽锐，吾亦击之如破卵。",
  "#dcgonghu1": "大都督中伏，吾等当舍命救之。",
  "#dcgonghu2": "袍泽临难，但有共死而无坐视。",
  "#yuechen:die": "天下犹魏，公休何故如此？",
  "#dcxiangshu1": "要财还是要命，选一个吧！",
  "#dcxiangshu2": "有什么好东西，都给我交出来！",
  "#zhangkai:die": "报应竟来得这么快……",
  "#dcchiying1": "今诱老贼来此，必折其父子于上方谷。",
  "#dcchiying2": "列柳城既失，当下唯死守阳平关。",
  "#gaoxiang:die": "老贼不死，实天意也……",
  "#dcshengdu1": "姐姐有的，妹妹也要有。",
  "#dcshengdu2": "你我同为佳丽，凭甚汝得独宠？",
  "#dcjieling1": "来人，送冯氏上路！",
  "#dcjieling2": "我有一求，请姐姐赴之。",
  "#dongwan:die": "陛下饶命，妾并无歹意……",
  "#dcjizhong1": "聚八方之众，昭黄天之明。",
  "#dcjizhong2": "联苦厄黎庶，传大道太平。",
  "#dcrihui1": "甲子双至，黄巾再起。",
  "#dcrihui2": "日中必彗，操刀必割。",
  "#dcguangshi1": "舍身饲火，光耀人间。",
  "#dcguangshi2": "愿为奉光之薪柴，照太平于人间。",
  "#zhangchu:die": "苦难不尽，黄天不死……",
  "#dcmoyu1": "人之所有，我之所欲。",
  "#dcmoyu2": "胸有欲壑千丈，自当饥不择食。",
  "#peiyuanshao:die": "好生厉害的白袍小将……",
  "#dcyinlu1": "南疆苦瘴，非土人不得过。",
  "#dcyinlu2": "闻丞相南征，某特来引之。",
  "#dcyouqi1": "寒烟锁旧山，坐看云起出。",
  "#dcyouqi2": "某隐居山野，不慕富贵功名。",
  "#mengjie:die": "蛮人无知，请丞相教之……",
  "#dcgue1": "哀兵必胜，况吾众志成城。",
  "#dcgue2": "扼守孤城，试问万夫谁开？",
  "#dcsigong1": "善守者亦善攻，不可死守。",
  "#dcsigong2": "璋军疲敝，可伺机而攻。",
  "#dc_huojun:die": "蒙君知恩，奈何早薨……",
  "#dchuiling1": "天地有灵，汇于我眸间。",
  "#dchuiling2": "撷四时钟灵，拈芳兰毓秀。",
  "#dcchongxu1": "慕圣道冲虚，有求者皆应。",
  "#dcchongxu2": "养志无为，遗冲虚于物外。",
  "#dc_sunhanhua:die": "长生不长乐，悔觅仙途……",
  "#dcqinshen1": "怀藏拙之心，赚不名之利。",
  "#dcqinshen2": "勤可补拙，慎可避祸。",
  "#dcweidang1": "臣等忠耿之言，绝无藏私之意。",
  "#dcweidang2": "假谠言之术，行利己之实。",
  "#dc_sunziliufang:die": "臣一心为国朝，冤枉呀。",
  "#dcneifa1": "同室操戈，胜者王、败者寇。",
  "#dcneifa2": "兄弟无能，吾当继袁氏大统。",
  "#yuantanyuanxiyuanshang:die": "同室内伐，贻笑大方……",
  "#dcaishou1": "某家未闻有一合而破关之将。",
  "#dcaishou2": "凭关而守，敌强又奈何？",
  "#dcsaowei1": "今从王师猎虎，必擒吕布。",
  "#dcsaowei2": "七军围猎，虓虎插翅难逃。",
  "#qiaorui:die": "今兵败城破，唯死而已……",
  "#dckanji1": "览文库全书，筑文心文胆。",
  "#dckanji2": "世间学问，皆载韦编之上。",
  "#dcqianzheng1": "悔往昔之种种，恨彼时之切切。",
  "#dcqianzheng2": "罪臣怀咎难辞，有愧国恩。",
  "#xianglang:die": "识文重义而徇私，恨也……",
  "#dchaochong1": "朗螟蛉之子，幸隆曹氏厚恩。",
  "#dchaochong2": "幸得义父所重，必效死奉曹。",
  "#dcjinjin1": "螟蛉终非麒麟，不可气盛自矜。",
  "#dcjinjin2": "我姓非曹，可敬人，不可欺人。",
  "#qinlang:die": "二姓之人，死无其所……",
  "#dcxuewei1": "慷慨赴国难，青山侠骨香。",
  "#dcxuewei2": "舍身卫主之志，死犹未悔！",
  "#dcyuguan1": "城后即为汉土，吾等无路可退！",
  "#dcyuguan2": "舍身卫关，身虽死而志犹在。",
  "#furongfuqian:die": "此间，何有汉将军降者！",
  "#dcqiangzhi1": "吾民在后，岂惧尔等魍魉。",
  "#dcqiangzhi2": "凶兵来袭，当长戈相迎。",
  "#dcpitian1": "此间辟地数旬，必成良田千亩。",
  "#dcpitian2": "民以物力为天，物力唯田可得。",
  "#zhenghun:die": "此世为官，未辱青天之名……",
  "#dcqingren1": "此身忠义，可鉴天涯明月。",
  "#dcqingren2": "青釭并龙胆，试刃三千里。",
  "#dcqinqing1": "陛下今日不理朝政，退下吧！",
  "#dcqinqing2": "此事咱家自会传达陛下。",
  "#huisheng_dc_huanghao1": "不就是想要好处嘛？",
  "#huisheng_dc_huanghao2": "这些都拿去。",
  "#dccunwei1": "陛下专宠，诸侯畏惧。",
  "#dccunwei2": "君侧之人，众所畏惧。",
  "#dc_huanghao:die": "难道都是我一个人的错吗！",
  "#dcjuying1": "垒石为寨，纵万军亦可阻。",
  "#dcjuying2": "如虎踞汝南，攻守自有我。",
  "#liupi:die": "玄德公高义，辟宁死不悔！",
  "#dcsilve1": "劫尔之富，济我之贫！",
  "#dcsilve2": "徇私而动，劫财掠货。",
  "#dcshuaijie1": "弱肉强食，实乃天地至理。",
  "#dcshuaijie2": "恃强凌弱，方为我辈本色！",
  "#leibo:die": "此人不可力敌，速退！",
  "#dczhenze1": "名震千里，泽被海东。",
  "#dczhenze2": "施威除暴，上下咸服。",
  "#dcanliao1": "地阔天高，大有可为。",
  "#dcanliao2": "水草丰沛，当展宏图。",
  "#gongsundu:die": "为何都不愿出仕！",
  "#dcyiyong1": "关氏鼠辈，庞令明之子来邪！",
  "#dcyiyong2": "凭一腔勇力，父仇定可报还！",
  "#dcsuchou1": "关家人我杀定了，谁也保不住！",
  "#dcsuchou2": "身陷仇海，谁知道我是怎么过的！",
  "#panghui:die": "大仇虽报，奈何心有余创……",
  "#dccuijin1": "军令如山，诸君焉敢不前？",
  "#dccuijin2": "前攻者赏之，后靡斩之！",
  "#dc_yuejiu:die": "此役既败，请速斩我……",
  "#dcxieshou1": "此城所能守者，在你我之协力。",
  "#dcxieshou2": "据地利而拥人和，其天时在我。",
  "#dcqingyan1": "清风盈大袖，严韵久长存。",
  "#dcqingyan2": "至清之人无徒，唯余雁阵惊寒。",
  "#chenjiao:die": "矫既死，则魏再无直臣哉……",
  "#dcchongwang1": "乡人所崇者，烈之义行也。",
  "#dcchongwang2": "诸家争讼曲直，可质于我。",
  "#dchuagui1": "烈不才，难为君之朱紫。",
  "#dchuagui2": "一身风雨，难坐高堂。",
  "#wanglie:die": "烈尚不能自断，何断人乎？",
  "#dcyingtu1": "不过略施小计，聊戏莽夫耳。",
  "#dcyingtu2": "栖虎狼之侧，安能不图存身？",
  "#dccongshi1": "阁下奉天子以令诸侯，珪自当相从。",
  "#dccongshi2": "将军率六师以伐不臣，珪何敢相抗？",
  "#chengui:die": "终日戏虎，竟为虎所噬……",
  "#dcquanjian1": "陛下宜后镇，臣请为先锋！",
  "#dcquanjian2": "吴人悍战，陛下万不可涉险！",
  "#dctujue1": "归蜀无路，孤臣泪尽江北。",
  "#dctujue2": "受吾主殊遇，安能降吴！",
  "#dc_huangquan:die": "败军之将，何言忠乎？",
  "#dcyingyu1": "妾身蒲柳，幸蒙将军不弃。",
  "#dcyingyu2": "妾之所有，愿尽予君。",
  "#dcyongbi1": "海誓山盟，此生不渝。",
  "#dcyongbi2": "万千宠爱，幸君怜之。",
  "#yinfuren:die": "奈何遇君何其晚乎？",
  "#dcshuhe1": "齐心共举，万事俱成。",
  "#dcshuhe2": "手足协力，天下可往。",
  "#dcliehou1": "论功行赏，加官进侯。",
  "#dcliehou2": "增班列侯，赏赐无量！",
  "#dc_lvkuanglvxiang:die": "不避其死，以成其忠……",
  "#suoliang1": "奉上万石粮草，吾便退兵！",
  "#suoliang2": "听闻北海富庶，特来借粮。",
  "#qinbao1": "赤箓护身，神鬼莫当。",
  "#qinbao2": "头裹黄巾，代天征伐。",
  "#guanhai:die": "这红脸汉子，为何如此眼熟……",
  "#midu1": "皓首穷经，其心不移。",
  "#midu2": "竹简册书，百读不厌。",
  "#xianwang1": "浩气长存，以正压邪。",
  "#xianwang2": "名彰千里，盗无敢侵。",
  "#huzhao:die": "纵有清名，无益于世也……",
  "#dczhubi1": "铸币平市，百货可居。",
  "#dczhubi2": "做钱直百，府库皆实。",
  "#dcliuzhuan1": "身似浮萍，随波逐流。",
  "#dcliuzhuan2": "辗转四方，宦游八州。",
  "#dc_liuba:die": "竹蕴于林，风必摧之……",
  "#suizheng1": "屡屡随征，战皆告捷。",
  "#suizheng2": "将勇兵强，大举出征！",
  "#zhangxun:die": "此役，死伤甚重……",
  "#zyqiao1": "吾六十何为不受兵邪？",
  "#zyqiao2": "芝性骄傲，吾独不为屈。",
  "#chengshang1": "嘉其抗直，甚爱待之。",
  "#chengshang2": "为国鞠躬，必受封赏。",
  "#zongyu:die": "吾年逾七十，唯少一死耳……",
  "#dcdeshao1": "名德远播，朝野俱瞻。",
  "#dcdeshao2": "增修德信，以诚服人。",
  "#dcmingfa1": "煌煌大势，无须诈取。",
  "#dcmingfa2": "开示公道，不为掩袭。",
  "#dc_yanghu:die": "臣死之后，杜元凯可继之……",
  "#lianzhou1": "操练水军，以应东吴。",
  "#lianzhou2": "连锁环舟，方能共济。",
  "#jinglan1": "潮生潮落，风浪不息。",
  "#jinglan2": "狂风舟起，巨浪滔天。",
  "#caimaozhangyun:die": "丞相，冤枉，冤枉啊！",
  "#xingchong1": "佳人有荣幸，好女天自怜。",
  "#xingchong2": "世间万般宠爱，独聚我于一身。",
  "#liunian1": "佳期若梦，似水流年。",
  "#liunian2": "逝者如流水，昼夜不将息。",
  "#tenggongzhu:die": "已过江北，再无江南……",
  "#dcjiezhen1": "八阵无破，唯解死而向生。",
  "#dcjiezhen2": "此阵，可由景门入、生门出。",
  "#dczecai1": "诸葛良才，可为我佳婿。",
  "#dczecai2": "梧桐亭亭，必引凤而栖。",
  "#dcyinshi1": "南阳隐世，耕读传家。",
  "#dcyinshi2": "手扶耒耜，不闻风雷。",
  "#dc_huangchengyan:die": "卧龙出山天伦逝，悔教吾婿离南阳……",
  "#xizhen1": "今我为刀俎，尔等皆为鱼肉。",
  "#xizhen2": "先发可制人，后发制于人。",
  "#dc_gaolan:die": "郭公则害我！",
  "#dunshi1": "失路青山隐，藏名白水游。",
  "#dunshi2": "隐居青松畔，遁走孤竹丘。",
  "#guanning:die": "高节始终，无憾矣……",
  "#xunli1": "病情扑朔，容某思量。",
  "#xunli2": "此疾难辨，容某细察。",
  "#zhishi1": "嚼指为誓，誓杀国贼！",
  "#zhishi2": "心怀汉恩，断指相随。",
  "#lieyi1": "君有疾在身，不治将恐深。",
  "#lieyi2": "汝身患重疾，当以虎狼之药去之。",
  "#dc_jiben:die": "今事不成，惟死而已！",
  "#bingjie1": "秉节传旌，心存丹衷。",
  "#bingjie2": "秉节刚劲，奸佞务尽。",
  "#zhengding1": "行义修正，改故用新。",
  "#zhengding2": "义约谬误，有所正订。",
  "#mamidi:die": "失节屈辱忧恚！",
  "#jianliang1": "岂曰少衣食，与君共袍泽！",
  "#jianliang2": "义士同心力，粮秣应期来！",
  "#weimeng1": "此礼献于友邦，共赴兴汉大业！",
  "#weimeng2": "吴有三江之守，何故委身侍魏？",
  "#re_dengzhi:die": "伯约啊，我帮不了你了……",
  "#yusui1": "宁为玉碎，不为瓦全！",
  "#yusui2": "生义相左，舍生取义。",
  "#boyan1": "黑白颠倒，汝言谬矣！",
  "#boyan2": "魏王高论，实为无知之言。",
  "#fengxi:die": "乡音未改双鬓苍，身陷北国有义求……",
  "#rekuangcai1": "耳所瞥闻，不忘于心。",
  "#rekuangcai2": "吾焉能从屠沽儿耶？",
  "#reshejian1": "伤人的，可不止刀剑！",
  "#reshejian2": "死公！云等道？",
  "#re_miheng:die": "恶口……终至杀身……",
  "#refuyuan1": "今君困顿，扶援相助。",
  "#refuyuan2": "恤君之患，以相扶援。",
  "#reyingshui1": "道之以德，齐之以礼。",
  "#reyingshui2": "施恩行惠，赡之以义。",
  "#rewangzu1": "名门望族，显贵荣达。",
  "#rewangzu2": "能人辈出，仕宦显达。",
  "#re_chendeng:die": "吾疾无人可治……",
  "#zhenge1": "常备不懈，严阵以待。",
  "#zhenge2": "枕戈待旦，日夜警惕。",
  "#xinghan1": "汉之兴旺，不敢松懈。",
  "#xinghan2": "兴汉除贼，吾之所愿。",
  "#wanniangongzhu:die": "兴汉的使命，还没有完成……",
  "#refenglve1": "当今敢称贤者，唯袁氏本初一人！",
  "#refenglve2": "冀州宝地，本当贤者居之。",
  "#anyong1": "殿上太守且相看，殿下几人还拥韩？",
  "#anyong2": "冀州暗潮汹涌，群仕居危思变。",
  "#re_xunchen:die": "为臣当不贰，贰臣不当为……",
  "#guowu1": "方天映黛眉，赤兔牵红妆。",
  "#guowu2": "武姬青丝利，巾帼女儿红。",
  "#zhuangrong1": "锋镝鸣手中，锐戟映秋霜。",
  "#zhuangrong2": "红妆非我愿，学武觅封侯。",
  "#lvlingqi:die": "父亲，女儿好累……",
  "#cuijian1": "所当皆披靡，破坚若无人！",
  "#cuijian2": "一枪定顽敌，一骑破坚城！",
  "#tongyuan1": "乐将军何在？随我共援上方谷！",
  "#tongyuan2": "袍泽有难，岂有坐视之理？",
  "#zhanghu:die": "虎父威犹在，犬子叹奈何……",
  "#zhente1": "抗声昭节，义形于色。",
  "#zhente2": "少履贞特之行，三从四德。",
  "#zhiwei1": "体信贯于神明，送终以礼。",
  "#zhiwei2": "昭德以行，生不能侍奉二主。",
  "#luyusheng:die": "父亲，郁生甚是想念……",
  "#wanggui1": "存志太虚，安心玄妙。",
  "#wanggui2": "礼法有度，良德才略。",
  "#xibing1": "千里运粮，非用兵之利。",
  "#xibing2": "宜弘一代之治，绍三王之迹。",
  "#huaxin:die": "大举发兵，劳民伤国……",
  "#manyi_mengyou1": "我辈蛮夷久居荒野，岂为兽虫所伤。",
  "#manyi_mengyou2": "我乃蛮王孟获之弟，谁敢伤我！",
  "#dcmanzhi1": "吾有蛮勇可攻，亦有蛮智可御。",
  "#dcmanzhi2": "远交近攻之法，怎可不为我所用。",
  "#mengyou:die": "大哥，诸葛亮又打来了……",
  "#zhuning1": "此剑半丈，当斩奸佞人头！",
  "#zhuning2": "此身八尺，甘为柱国之石。",
  "#fengxiang1": "北风摧蜀地，王爵换乡侯。",
  "#fengxiang2": "汉皇可负我，我不负父兄。",
  "#liuyong:die": "他日若是凛风起，你自长哭我自笑……",
  "#xiecui1": "东隅既得，亦收桑榆。",
  "#xiecui2": "江东多娇，锦花相簇。",
  "#youxu1": "积富之家，当恤众急。",
  "#youxu2": "周忧济难，请君恤之。",
  "#dc_sunru:die": "伯言，抗儿便托付于你了……",
  "#fuping1": "有草生清池，无根碧波上。",
  "#fuping2": "愿为浮萍草，托身寄清池。",
  "#weilie1": "好学尚贞烈，义形必沾巾。",
  "#weilie2": "贞烈过男子，何处弱须眉？",
  "#xiahoulingnv:die": "心存死志，绝不肯从！",
  "#yuanyu1": "此生最恨者，吴垣孙氏人。",
  "#yuanyu2": "愿为宫外柳，不做建章卿。",
  "#xiyan1": "夕阳绝美，只叹黄昏。",
  "#xiyan2": "朱颜将逝，知我何求。",
  "#zhangyao:die": "花开人赏，花败谁怜……",
  "#chenjian1": "国有其弊，上书当陈。",
  "#chenjian2": "食君之禄，怎可默言。",
  "#xixiu1": "君子如玉，德形皓白。",
  "#xixiu2": "木秀于身，芬芳自如。",
  "#tengyin:die": "臣好洁，不堪与之合污！",
  "#tongli1": "胞妹殊礼，妾幸同之。",
  "#tongli2": "夫妻之礼，举案齐眉。",
  "#shezang1": "世间千百物，物物皆相思。",
  "#shezang2": "伊人将逝，何物为葬？",
  "#zhangxuan:die": "陛下，臣妾绝无异心！",
  "#huguan1": "共护边关，蜀汉可安。",
  "#huguan2": "护君周全，妾身无悔。",
  "#yaopei1": "环佩春风，步摇桃粉。",
  "#yaopei2": "赠君摇佩，佑君安好。",
  "#wangtao:die": "落花有意，何人来摘……",
  "#huguan_wangyue1": "此战虽险，悦亦可助之。",
  "#huguan_wangyue2": "葭萌关外，同君携手。",
  "#mingluan1": "鸾笺寄情，笙歌动心。",
  "#mingluan2": "鸾鸣轻歌，声声悦耳。",
  "#wangyue:die": "这次比试不算，再来……",
  "#jinhui1": "大则盈尺，小则方寸。",
  "#jinhui2": "十指纤纤，万分机巧。",
  "#qingman1": "经纬分明，片片罗縠。",
  "#qingman2": "罗帐轻幔，可消酷暑烦躁。",
  "#zhaoyan:die": "彩绘锦绣，二者不可缺其一……",
  "#yachai1": "才秀知名，无所顾惮。",
  "#yachai2": "讲论经义，为万世法。",
  "#qingtan1": "事而为事，由无以成。",
  "#qingtan2": "转蓬去其根，流飘从风移。",
  "#heyan:die": "恃无以生……",
  "#dcmiyun1": "不要大张旗鼓，要神不知鬼不觉。",
  "#dcmiyun2": "小阿斗，跟本将军走一趟吧。",
  "#dcdanying1": "早就想会会你常山赵子龙了。",
  "#dcdanying2": "赵子龙是吧？兜鍪给你打掉。",
  "#zhoushan:die": "夫人救我！夫人救我！",
  "#dcxunji1": "待拿下你，再找丞相谢罪。",
  "#dcxunji2": "姓关的，我现在就来抓你！",
  "#dcjiaofeng1": "此击透骨，亦解骨肉之痛。",
  "#dcjiaofeng2": "关羽？哼，不过如此！",
  "#dc_caiyang:die": "何处来的鼓声？",
  "#liedan1": "声若洪钟，震胆发聩！",
  "#liedan2": "阴雷滚滚，肝胆俱颤！",
  "#zhuangdan1": "假丞相虎威，壮豪将龙胆。",
  "#zhuangdan2": "我家丞相在此，哪个有胆敢动我？",
  "#xiahoujie:die": "你吼那么大声干嘛……",
  "#cxliushi1": "就你叫夏侯惇？",
  "#cxliushi2": "兀那贼将，且吃我一箭！",
  "#zhanwan1": "郝萌，尔敢造反不成？",
  "#zhanwan2": "健儿护主，奸逆断腕！",
  "#caoxing:die": "夏侯将军，有话好说……",
  "#recangchu1": "广积粮草，有备无患。",
  "#recangchu2": "吾奉命于此、建仓储粮。",
  "#reliangying1": "酒气上涌，精神倍长。",
  "#reliangying2": "仲简在此，谁敢来犯？",
  "#reshishou1": "腹痛骤发，痛不可当。",
  "#reshishou2": "火光冲天，悔不当初。",
  "#re_chunyuqiong:die": "这酒，饮不得啊……",
  "#xuxie1": "说出吾名，吓汝一跳！",
  "#xuxie2": "我乃是零陵上将军！",
  "#xingdaorong:die": "孔明之计，我难猜透啊……",
  "#xinkuangfu1": "大斧到处，片甲不留！",
  "#xinkuangfu2": "你可接得住我一斧？",
  "#re_panfeng:die": "来者……可是魔将？",
  "#shengxi1": "国之生计，在民生息。",
  "#shengxi2": "安民止战，兴汉室！",
  "#shoucheng1": "待吾等助将军一臂之力！",
  "#shoucheng2": "国库盈余，可助军威！",
  "#jiangfei:die": "墨守成规，终为其害啊……",
  "#dctunchu1": "秋收冬藏，此四时之理，亘古不变。",
  "#dctunchu2": "屯粮之家，必无饥馑之虞。",
  "#dcshuliang1": "北伐鏖战正酣，此正需粮之时。",
  "#dcshuliang2": "粮草先于兵马而动，此军心之本。",
  "#dc_lifeng:die": "黍穗重丰，不见丞相还……",
  "#dcfudou1": "既作困禽，何妨铤险以覆车？",
  "#dcfudou2": "据将覆之巢，必作犹斗之困兽。",
  "#dctaji1": "仙途本寂寥，结发叹长生。",
  "#dctaji2": "仙者不言，手执春风。",
  "#dcqinghuang1": "上士无争，焉生妄心。",
  "#dcqinghuang2": "心有草木，何畏荒芜？",
  "#huomo_huzhao1": "行文挥毫，得心应手。",
  "#huomo_huzhao2": "泼墨走笔，挥洒自如。",
  "#llqshenwei1": "我乃温侯吕奉先之女！",
  "#llqshenwei2": "继父神威，无坚不摧！",
  "#wushuang_lvlingqi1": "猛将策良骥，长戟破敌营。",
  "#wushuang_lvlingqi2": "杀气腾剑戟，严风卷戎装。",
  "#dcjigu1": "我接着奏乐，诸公接着舞。",
  "#dcjigu2": "这不是鼓，而是曹公的脸面！",
  "#dcsirui1": "暑气可借酒气消，此间艳阳最佐酒。",
  "#dcsirui2": "诸君饮泥而醉，举世唯我独醒！",
  "#yue_miheng:die": "映日荷花今犹在，不见当年采荷人……"
};
const characterSort = {
  sp_baigei: ["re_panfeng", "xingdaorong", "caoxing", "re_chunyuqiong", "xiahoujie", "dc_caiyang", "zhoushan", "dc_xiahouen"],
  sp_caizijiaren: ["dc_xiahouxuan", "dc_kongrong", "re_dongbai", "re_sunluyu", "heyan", "zhaoyan", "wangtao", "wangyue", "zhangxuan", "tengyin", "zhangyao", "xiahoulingnv", "dc_sunru", "pangshanmin", "kuaiqi"],
  sp_zhilan: ["jimiaojimu", "dc_huangwudie", "dc_liuli", "liuyong", "wanniangongzhu", "zhanghu", "lvlingqi", "tenggongzhu", "panghui", "dc_zhaotongzhaoguang", "yuantanyuanxiyuanshang", "yuechen", "panghong"],
  sp_guixin: ["mamiao", "zangba", "re_kanze", "re_chendeng", "caimaozhangyun", "dc_lvkuanglvxiang", "dc_gaolan", "yinfuren", "chengui", "chenjiao", "dc_sp_jiaxu", "qinlang", "dc_dongzhao", "houcheng"],
  sp_daihan: ["mamidi", "dc_jiling", "zhangxun", "dc_yuejiu", "leibo", "qiaorui", "dongwan", "yuanyin"],
  sp_jianghu: ["dc_zhangshiping", "guanning", "huzhao", "dc_huangchengyan", "mengjie", "wanglie"],
  sp_zongheng: ["huaxin", "luyusheng", "re_xunchen", "re_miheng", "fengxi", "re_dengzhi", "dc_yanghu", "zongyu"],
  sp_taiping: ["guanhai", "liupi", "peiyuanshao", "zhangchu", "zhangkai", "dc_zhangmancheng"],
  sp_yanhan: ["dc_zhugejun", "dc_xiangchong", "dc_lifeng", "dc_liuba", "dc_huangquan", "furongfuqian", "xianglang", "dc_huojun", "gaoxiang", "dc_wuban", "jiangfei", "dc_zhangyì", "dc_feiyi"],
  sp_jishi: ["dc_jiben", "zhenghun", "dc_sunhanhua", "liuchongluojun", "wupu"],
  sp_raoting: ["dc_weifeng", "dc_huanghao", "dc_sunziliufang", "dc_sunchen", "dc_jiachong"],
  sp_yijun: ["gongsundu", "mengyou", "dc_sp_menghuo", "gongsunxiu", "dc_sp_zhurong", "dc_mateng", "dc_muludawang"],
  sp_zhengyin: ["yue_caozhi", "yue_zhouyu", "yue_diaochan", "yue_caiwenji", "yue_zhoufei", "yue_caiyong", "yue_xiaoqiao", "yue_daqiao", "yue_miheng", "yue_zoushi", "yue_zhugeguo"],
  huicui_waitforsort: []
};
const characterSortTranslate = {
  sp_baigei: "无双上将",
  sp_caizijiaren: "才子佳人",
  sp_zhilan: "芝兰玉树",
  sp_zongheng: "纵横捭阖",
  sp_guixin: "天下归心",
  sp_jianghu: "江湖之远",
  sp_daihan: "代汉涂高",
  sp_taiping: "太平甲子",
  sp_yanhan: "匡鼎炎汉",
  sp_jishi: "悬壶济世",
  sp_raoting: "绕庭之鸦",
  sp_yijun: "异军突起",
  sp_zhengyin: "正音雅乐",
  huicui_waitforsort: "等待分包"
};
game.import("character", function() {
  return {
    name: "huicui",
    connect: true,
    character: { ...characters },
    characterSort: {
      huicui: characterSort
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
