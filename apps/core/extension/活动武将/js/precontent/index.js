import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
import FaDongCharacter from './FaDongCharacter.js';
import hezongkangqincharacter from './hezongkangqincharacter.js';
import decadeQiHuan from './decadeQiHuan.js';
import decadeZhuoGui from './decadeZhuoGui.js';
import decadeKuiBa from './decadeKuiBa.js';
import HD_chaoshikong from './HD_chaoshikong.js';
import MiNikill from './MiNikill.js';
import WeChatkill from './WeChatkill.js';
import MX_feihongyinxue from './MX_feihongyinxue.js';
import MiNiAppkill from './MiNiAppkill.js';
import huodongcharacter from './huodongcharacter.js';

export async function precontent(bilibilicharacter) {
    //清空在线更新后的活动武将缓存
    await (async () => {
        if (!lib.config['extension_活动武将_update_state']) return;
        const ensureDirByFile = async (base, file) => {
            const parts = file.split('/');
            parts.pop();
            if (parts.length) await game.promises.ensureDirectory([...base.split('/'), ...parts]);
        };
        const listFiles = async dir => {
            const result = [];
            const walk = async current => {
                const [folders, files] = await game.promises.getFileList(current);
                for (const file of files) result.push(`${current}/${file}`.replace(`${dir}/`, ''));
                for (const folder of folders) await walk(`${current}/${folder}`);
            };
            try {
                await walk(dir);
            }
            catch (e) { }
            return result;
        };
        const copyFiles = async (fromDir, toDir, files) => {
            for (const file of files) {
                const data = await game.promises.readFile(`${fromDir}/${file}`);
                await ensureDirByFile(toDir, file);
                await game.promises.writeFile(
                    data,
                    file.includes('/') ? `${toDir}/${file.split('/').slice(0, -1).join('/')}` : toDir,
                    file.split('/').pop()
                );
            }
        };
        try {
            alert('检测到上次扩展更新未完成，正在处理残留文件...');
            const backupFiles = await listFiles('extension/活动武将/update_backup');
            if (backupFiles.length) {
                await copyFiles('extension/活动武将/update_backup', 'extension/活动武将', backupFiles);
                alert('已从备份恢复旧版本扩展');
            }
            await game.promises.removeDir('extension/活动武将/update_temp').catch(() => { });
            await game.promises.removeDir('extension/活动武将/update_backup').catch(() => { });
            delete lib.config['extension_活动武将_update_state'];
            await game.promises.saveConfig('extension_活动武将_update_state');
            alert('扩展更新残留清理完成');
        }
        catch (e) {
            console.error(e);
            alert('扩展更新残留清理失败，请手动检查update_temp和update_backup目录');
        }
    })();
    //存储活动武将扩展的文件和文件夹分布
    _status['extension_活动武将_files'] = await (async () => {
        const getFileList = async function (path = 'extension/活动武将') {
            const [folders, files] = await game.promises.getFileList(path);
            const map = { files };
            if (Array.isArray(folders) && folders.length > 0) {
                for (const folder of folders) map[folder] = await getFileList(`${path}/${folder}`);
            }
            return map;
        };
        return await getFileList();
    })();
    //闪闪节
    lib.arenaReady.push(() => {
        if (lib.config.extension_活动武将_HD_shanshan) {
            let num = 0;
            for (let i = 0; i < lib.card.list.length; i++) {
                if (lib.card.list[i][2] != 'shan' || lib.card.list[i][0] != 'diamond') continue;
                if ([5, 6, 7].includes(lib.card.list[i][1])) {
                    num++;
                    lib.card.list[i][2] = 'bol_shanshan';
                }
            }
            if (num > 0) game.log(`${get.cnNumber(num)}张`, '#g【闪闪】', '已加入牌堆');
        }
    });
    //合纵抗秦、官渡之战模式特殊规则
    lib.skill._hzkq_shijian = {
        charlotte: true,
        ruleSkill: true,
        trigger: { global: 'chooseButtonBefore' },
        filter(event, player) {
            if (_status._hzkq_shijian || event.getParent().name !== 'chooseCharacter' || get.mode() === 'boss') return false;
            const KQShiJian = lib.config.extension_活动武将_KQShiJian ?? [], GDShiJian = lib.config.extension_活动武将_GDShiJian ?? [];
            return (Array.isArray(KQShiJian) && KQShiJian.length > 0) || (Array.isArray(GDShiJian) && GDShiJian.length > 0);
        },
        silent: true,
        async content(event, trigger, player) {
            _status._hzkq_shijian = true;
            const KQShiJian = lib.config.extension_活动武将_KQShiJian ?? [], GDShiJian = lib.config.extension_活动武将_GDShiJian ?? [];
            if (Array.isArray(KQShiJian) && KQShiJian.length > 0) {
                for (const evt of KQShiJian) {
                    if (['qin_hezonglianheng', 'qin_changpingzhizhan', 'qin_lvshichunqiu', 'qin_shaqiuzhibian', 'qin_zhaojizhiluan', 'qin_shichengtaihou'].includes(evt)) game.addGlobalSkill(evt);
                    switch (evt) {
                        case 'qin_bianfatuqiang':
                            game.bianfaed = true;
                            var cards = [5, 7, 9].map(i => game.createCard2('qin_shangyangbianfa', 'spade', i));
                            game.broadcastAll(() => lib.inpile.add('qin_zhenlongchangjian'));
                            await game.cardsGotoPile(cards, () => ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)]);
                            game.log(cards, '已加入牌堆');
                            break;
                        case 'qin_hezonglianheng':
                            game.lianhenged = true;
                            break;
                        case 'qin_changpingzhizhan':
                            _status._aozhan = true;
                            game.playBackgroundMusic();
                            break;
                        case 'qin_hengsaoliuhe':
                            game.qin_hengsaoliuhe = true;
                            var cards = [];
                            if (!lib.inpile.includes('qin_chuanguoyuxi')) {
                                var card1 = game.createCard2('qin_chuanguoyuxi', 'heart', 7);
                                game.broadcastAll(() => lib.inpile.add('qin_chuanguoyuxi'));
                                cards.push(card1);
                            }
                            if (!lib.inpile.includes('qin_zhenlongchangjian')) {
                                var card2 = game.createCard2('qin_zhenlongchangjian', 'heart', 2);
                                game.broadcastAll(() => lib.inpile.add('qin_zhenlongchangjian'));
                                cards.push(card2);
                            }
                            if (cards.length > 0) {
                                //for (const card of cards) ui.cardPile.insertBefore(card, ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
                                await game.cardsGotoPile(cards, () => ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)]);
                                game.log(cards, '已加入牌堆');
                            }
                            break;
                        case 'qin_shichengtaihou':
                            for (const name in lib.character) {
                                if (lib.character[name].sex === 'female' || lib.character[name].sex === 'double') {
                                    if (typeof lib.character[name].hp === 'number') lib.character[name].hp++;
                                    if (typeof lib.character[name].maxHp === 'number') lib.character[name].maxHp++;
                                }
                            }
                            break;
                    }
                }
                game.broadcastAll(evt => {
                    if (get.is.phoneLayout()) ui.bolhzkqInfo = ui.create.div('.touchinfo.left', ui.window);
                    else ui.bolhzkqInfo = ui.create.div(ui.gameinfo);
                    ui.bolhzkqInfo.innerHTML = '合纵抗秦事件：' + evt.map(i => `${lib.translate[i]}${i === 'qin_changpingzhizhan' ? '/鏖战模式' : ''}`).join('、');
                }, KQShiJian);
                const humans = game.players.filter(current => current === game.me || current.isOnline());
                if (humans.length > 0) {
                    await game.chooseAnyOL(humans, (player, KQShiJian) => {
                        return player.chooseControl('ok').set('prompt', `###本局抗秦特殊事件###${KQShiJian.map(evt => `<li>${lib.translate[evt]}：${lib.translate[`${evt}_info`]}`).join('<br>')}`).set('_global_waiting', true);
                    }, [KQShiJian]);
                }
            }
            if (Array.isArray(GDShiJian) && GDShiJian.length > 0) {
                for (const evt of GDShiJian) game.addGlobalSkill(evt);
                game.broadcastAll(evt => {
                    if (get.is.phoneLayout()) ui.bolGuanDuInfo = ui.create.div('.touchinfo.left', ui.window);
                    else ui.bolGuanDuInfo = ui.create.div(ui.gameinfo);
                    ui.bolGuanDuInfo.innerHTML = '官渡之战事件：' + get.translation(evt);
                }, GDShiJian);
                const humans = game.players.filter(current => current === game.me || current.isOnline());
                if (humans.length > 0) {
                    await game.chooseAnyOL(humans, (player, GDShiJian) => {
                        return player.chooseControl('ok').set('prompt', `###本局官渡特殊事件###${GDShiJian.map(evt => `<li>${lib.translate[evt]}：${lib.translate[`${evt}_info`]}`).join('<br>')}`).set('_global_waiting', true);
                    }, [GDShiJian]);
                }
            }
        },
    };
    //嬴政装备传国玉玺和真龙长剑
    lib.skill._qin_start = {
        charlotte: true,
        ruleSkill: true,
        trigger: { global: 'gameStart' },
        filter(event, player) {
            return game.qin_hengsaoliuhe && get.nameList(player).includes('qin_yingzheng');
        },
        silent: true,
        content() {
            //传国玉玺
            const chuanguoyuxi = get.cardPile2(card => card.name === 'qin_chuanguoyuxi' && player.canEquip(card, true));
            if (chuanguoyuxi) player.equip(chuanguoyuxi);
            //真龙长剑
            const zhenlongchangjian = get.cardPile2(card => card.name === 'qin_zhenlongchangjian' && player.canEquip(card, true));
            if (zhenlongchangjian) player.equip(zhenlongchangjian);
        },
    };
    //座位号显示
    if (lib.config.extension_活动武将_ShowSeatNum) {
        const originSetSeatNum = lib.element.player.setSeatNum;
        lib.element.player.setSeatNum = function () {
            originSetSeatNum.apply(this, arguments);
            if (this.getSeatNum() != 0) this.setNickname(get.cnNumber(this.getSeatNum(), true) + '号位');
        };
        const originSwapSeat = game.swapSeat;
        game.swapSeat = function (player1, player2) {
            originSwapSeat.apply(this, arguments);
            if (player1.getSeatNum() != 0) player1.setNickname(get.cnNumber(player1.getSeatNum(), true) + '号位');
            if (player2.getSeatNum() != 0) player2.setNickname(get.cnNumber(player2.getSeatNum(), true) + '号位');
        };
    }
    //十周年UI势力显示
    lib.hooks.addGroup.push(function decadeUI_addGroupCSS(id, short, name, config) {
        for (const sheet of document.styleSheets) {
            try {
                const rules = sheet.cssRules || sheet.rules;
                for (const rule of rules) {
                    if (rule.selectorText === `.player > .camp-wrap[data-camp="${id}"] > .camp-back`) return;
                }
            }
            catch (e) {
                continue;
            }
        }
        if (typeof config.color != "undefined" && config.color != null) {
            let color1, color2, color3, color4;
            if (typeof config.color == "string" && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(config.color)) {
                let c1 = parseInt(`0x${config.color.slice(1, 3)}`);
                let c2 = parseInt(`0x${config.color.slice(3, 5)}`);
                let c3 = parseInt(`0x${config.color.slice(5, 7)}`);
                color1 = color2 = color3 = color4 = [c1, c2, c3, 1];
            }
            else if (Array.isArray(config.color) && config.color.length == 4) {
                if (config.color.every(item => Array.isArray(item))) {
                    color1 = config.color[0];
                    color2 = config.color[1];
                    color3 = config.color[2];
                    color4 = config.color[3];
                }
                else color1 = color2 = color3 = color4 = config.color;
            }
            if (color1 && color2 && color3 && color4) {
                lib.init.sheet(`.player > .camp-wrap[data-camp="${id}"] > .camp-back {
                    background: linear-gradient(
                        to bottom,
                        rgba(${color1.join(", ")}),
                        rgba(${color2.join(", ")}),
                        rgba(${color3.join(", ")}),
                        rgba(${color4.join(", ")})
                    );
                }`);
                lib.init.sheet(`.player > .camp-wrap[data-camp="${id}"] > .camp-name {
                    text-shadow:
                        0 0 5px rgba(${color1.join(", ")}),
                        0 0 10px rgba(${color2.join(", ")}),
                        0 0 15px rgba(${color3.join(", ")}),
                        0 0 20px rgba(${color4.join(", ")});
                }`);
            }
        }
    });
    /*
    //点击显示
    game.getBolPhone = function () {
        //获取浏览器navigator对象的userAgent属性（浏览器用于HTTP请求的用户代理头的值）
        var info = navigator.userAgent;
        //通过正则表达式的test方法判断是否包含“Mobile”字符串
        var isPhone = /mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(info);
        //如果包含“Mobile”（是手机设备）则返回true
        return isPhone;
    };
    //低配
    get.bolInform = function (str1, str2) {
        if ((() => {
            return game.getBolPhone();
            //const info = navigator.userAgent;
            //return /mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(info);
        })()) {
            return `<span onclick="alert('${str2}')"style="text-decoration:underline; cursor:pointer;">${str1}</span>`;
        }
        return `<abbr title=\"${str2}\"><ins>${str1}</ins></abbr>`;
    };
    //高配
    //感谢 雷 的技术支持
    get.bolskillTips = function (tipname, id) {
        var dibeijing = ui.create.div('.bol-dibeijing', document.body);
        dibeijing.style.zIndex = 16;
        var skilltip = ui.create.div('.bol-skilltip', dibeijing);
        skilltip.innerHTML = tipname;
        var herf = document.getElementById(id);
        if (herf) {
            var left = herf.getBoundingClientRect().left;
            if (game.getBolPhone()) left += herf.offsetParent.offsetLeft;
            left += document.body.offsetWidth * 0.15;
            skilltip.style.left = left + 'px';
            skilltip.style.top = (herf.getBoundingClientRect().top + 30) + 'px';
        }
        dibeijing.listen(function (e) {
            e.stopPropagation();
            this.remove();
        })
    };
    get.bolInformX = function (str1, str2) {
        const id = Math.random().toString(36).slice(-8);
        return "<a id='" + id + "' style='color:unset' href=\"javascript:get.bolskillTips('" + str2 + "','" + id + "');\">" + str1 + "※</a>";
    };
    */
    //适配poptip
    lib.poptip.add({
        name: '韵律技',
        id: 'rule_yunlvSkill',
        info: '同普通转换技类似，韵律技分为平和仄两种状态，韵律技初始默认状态为平，满足转韵条件时韵律技会转成另一种状态并重置技能的发动次数。',
    });
    lib.poptip.add({
        name: '仁望值',
        id: 'rule_renwangnum',
        info: '三国杀外服机制（已废弃），拥有涉及仁望值技能的角色于游戏开始时获得1点仁望值，且其出牌阶段结束时，其根据以下满足的条件数增加等量的仁望值：①本阶段有角色获得过累计两张牌；②本阶段有角色回复过体力；③本阶段未对其他角色造成过伤害。一名角色的仁望值上限为5。',
    });
    lib.poptip.add({
        name: '整肃',
        id: 'rule_zhengsu',
        info: '<li>技能发动者从“擂进”、“变阵”、“鸣止”三个选项中选择一个令目标执行，若其于其本回合弃牌阶段结束后达成选项条件，则选择整肃奖励。<br><li>整肃奖励：选择摸两张牌或回复1点体力<br><li>擂进：回合内所有于出牌阶段使用的牌点数递增且不少于三张。<br><li>变阵：回合内所有于出牌阶段使用的牌花色相同且不少于两张。<br><li>鸣止：回合内所有于弃牌阶段弃置的牌花色均不相同且不少于两张。',
    });
    lib.poptip.add({
        name: '谋略值',
        id: 'rule_moulvenum',
        info: `上限为5，拥有谋略值的角色可以发动技能${get.poptip('wechatmiaoji')}。`,
    });
    lib.poptip.add({
        name: '奋武技',
        id: 'rule_shiwuSkill',
        info: '奋武技的使用次数为本轮你造成和受到的伤害值+1，至多为5。',
    });
    lib.poptip.add({
        name: '移志技',
        id: 'rule_yizhiSkill',
        info: '同普通转换技类似，移志技拥有“昔”和“今”两种状态及对应效果且只有在相应状态下拥有相应效果。技能初始状态为“昔”，在满足特定条件下转换状态至“今”。',
    });
    lib.poptip.add({
        name: '移志',
        id: 'rule_yizhi',
        info: '移志技的转换状态操作，如无说明，则默认每局游戏仅可执行一次。',
    });
    lib.poptip.add({
        name: '强攻',
        id: 'rule_qianggong',
        info: '强攻是一种特殊的选项。选择强攻时，先执行此项，然后依次执行其余选项。执行完毕后，须从所有选项删除不为强攻的一项。当所有选项仅剩余强攻和另一选项时，不能选择强攻。',
    });
    lib.namePrefix.set(get.poptip('rule_mamba'), {
        getSpan: () => get.prefixSpan('牢'),
    });
    lib.poptip.add({
        name: '成器',
        id: 'rule_xizifuSkill',
        info: '成器后的数字为本局游戏发动此技能的次数上限，发动带有此标签的技能后，需满足技能“进学”条件才可继续发动此技能。',
    });
    //----------------游戏播报·始----------------
    lib.skill._OpenTheGame = {
        charlotte: true,
        ruleSkill: true,
        forceDie: true,
        trigger: { global: 'gameDrawAfter' },
        filter(event, player) {
            const config = lib.config.extension_活动武将_HDfightAudio;
            return config && config !== 'off' && player == game.me && !lib.skill?.mx_start;
        },
        silent: true,
        firstDo: true,
        priority: Infinity,
        content() {
            player.$fullscreenpop('游戏开始', 'fire');
            game.broadcastAll(function (config) {
                if (lib.config.background_audio) game.playAudio('..', 'extension', '活动武将/audio/effect', 'bilibili_OpenTheGame' + (config === 'default' ? '' : ('_' + config)));
            }, lib.config.extension_活动武将_HDfightAudio);
        },
    };
    lib.skill._bilibili_miaoshou = {
        charlotte: true,
        ruleSkill: true,
        trigger: { player: 'xmiaoshou' },
        filter(event, player) {
            const config = lib.config.extension_活动武将_HDfightAudio;
            return config && config !== 'off';
        },
        silent: true,
        firstDo: true,
        forceDie: true,
        content() {
            const config = lib.config.extension_活动武将_HDfightAudio;
            trigger.player.$fullscreenpop({ 'default': '妙手回春', 'decade': '青囊济世', 'ol': '悬壶济世' }[config], 'water');
            game.broadcastAll(function (config) {
                if (lib.config.background_audio) game.playAudio('..', 'extension', '活动武将/audio/effect', 'bilibili_miaoshou' + (config === 'default' ? '' : ('_' + config)));
            }, config);
        },
    };
    lib.skill._bilibili_yishu = {
        charlotte: true,
        ruleSkill: true,
        trigger: { player: 'xyishu' },
        filter(event, player) {
            const config = lib.config.extension_活动武将_HDfightAudio;
            return config && config !== 'off';
        },
        silent: true,
        firstDo: true,
        forceDie: true,
        content() {
            const config = lib.config.extension_活动武将_HDfightAudio;
            trigger.player.$fullscreenpop({ 'default': '医术高超', 'decade': '神医妙手', 'ol': '杏林春满' }[config], 'water');
            game.broadcastAll(function (config) {
                if (lib.config.background_audio) game.playAudio('..', 'extension', '活动武将/audio/effect', 'bilibili_yishu' + (config === 'default' ? '' : ('_' + config)));
            }, config);
        },
    };
    lib.skill._recovertrigger = {
        charlotte: true,
        ruleSkill: true,
        trigger: {
            player: 'phaseEnd',
            global: 'recoverEnd',
        },
        filter(event, player) {
            if (event.name === 'phase') return player.storage.jstxyishugaochao;
            if (_status.currentPhase === player) return true;
            return event.player != event.source && event.source == player;
        },
        silent: true,
        firstDo: true,
        forceDie: true,
        content() {
            if (trigger.name === 'phase') delete player.storage.jstxyishugaochao;
            else if (_status.currentPhase !== player) _status.event.trigger('xmiaoshou');
            else {
                if (player.storage.jstxyishugaochao == undefined) player.storage.jstxyishugaochao = trigger.num;
                else player.storage.jstxyishugaochao += trigger.num;
                if (player.storage.jstxyishugaochao >= 3) {
                    player.storage.jstxyishugaochao -= 3;
                    _status.event.trigger('xyishu');
                }
            }
        },
    };
    lib.skill._jishaAudio = {
        charlotte: true,
        ruleSkill: true,
        trigger: { source: 'dieBegin' },
        filter(event, player) {
            const config = lib.config.extension_活动武将_HDfightAudio;
            return config && config !== 'off' && event.player != player;
        },
        silent: true,
        firstDo: true,
        content() {
            'step 0'
            player.addMark('_jishaAudio', 1, false);
            'step 1'
            let config = lib.config.extension_活动武将_HDfightAudio;
            config = config === 'default' ? lib.config.extension_活动武将_HDkillAudio : config;
            let list;
            switch (config) {
                case 'new':
                    list = ['一破·卧龙出山', '双连·一战成名', '三连·举世皆惊', '四连·天下无敌', '五连·诛天灭地', '六连·诛天灭地', '七连·诛天灭地'];
                    break;
                case 'decade':
                    list = ['首破<br>一骑当先', '连破<br>世无双', '三破<br>冠三军', '四破<br>震诸侯', '五破<br>天下无敌', '六破<br>统九州乾坤', '七破<br>千古第一人'];
                    break;
                case 'ol':
                    list = ['一破·龙战于野', '二连<br>飞龙在天', '三连<br>亢龙有悔', '四连<br>天下无敌', '五连<br>威震天下', '六连<br>天崩地裂', '七连<br>毁天灭地'];
                    break;
                default:
                    list = ['一血·卧龙出山', '双杀·一战成名', '三杀·举世皆惊', '四杀·天下无敌', '五杀·诛天灭地', '六杀·癫狂杀戮', '无双·万军取首'];
                    break;
            }
            var num = Math.min(7, player.countMark('_jishaAudio'));
            player.$fullscreenpop(list[num - 1], ['water', 'wood', 'thunder', 'fire'][Math.min(3, num - 1)]);
            game.broadcastAll(function (num, config) {
                if (lib.config.background_audio) {
                    game.playAudio('..', 'extension', '活动武将/audio/effect', 'bilibili_jisha' + num + (config === 'default' ? '' : ('_' + config)));
                }
            }, num, config);
        },
    };
    lib.skill._bilibili_HighDamageAudio = {
        charlotte: true,
        ruleSkill: true,
        trigger: { source: 'damageBegin4' },
        filter(event, player) {
            const config = lib.config.extension_活动武将_HDfightAudio;
            return ['decade', 'default'].includes(config) && event.player != player && event.num >= 3;
        },
        silent: true,
        lastDo: true,
        priority: -Infinity,
        content() {
            const config = lib.config.extension_活动武将_HDfightAudio === 'decade';
            if (trigger.num == 3) {
                player.$fullscreenpop(config ? '万夫莫敌' : '癫狂屠戮', 'fire');
                game.broadcastAll(function (config) {
                    if (lib.config.background_audio) game.playAudio('..', 'extension', '活动武将/audio/effect', 'bilibili_diankuang' + (config ? '_decade' : ''));
                }, config);
            }
            else {
                player.$fullscreenpop(config ? '神威震乾坤' : '无双<br>万军取首', 'fire');
                game.broadcastAll(function (config) {
                    if (lib.config.background_audio) game.playAudio('..', 'extension', '活动武将/audio/effect', 'bilibili_wanjun' + (config ? '_decade' : ''));
                }, config);
            }
        },
    };
    //skillAnimation技能配音播放
    var originTrySkillAnimate = lib.element.player.trySkillAnimate;
    lib.element.player.trySkillAnimate = function (name, popname, checkShow) {
        if (!game.online && lib.config.skill_animation_type != 'off' && lib.skill[name] && lib.skill[name].skillAnimation && lib.config.extension_活动武将_HDskillAnimateAudio) {
            game.broadcastAll(function (name) {
                if (ui.backgroundMusic) ui.backgroundMusic.pause();
                game.playAudio('..', 'extension', '活动武将/audio/effect', 'spell_' + (lib.skill[name].juexingji ? 'wake' : 'limit'));
            }, name);
            setTimeout(function () {
                if (ui.backgroundMusic) ui.backgroundMusic.play();
            }, 4000);
        }
        originTrySkillAnimate.apply(this, arguments);
    };
    //对局BGM
    game.bol_playAudio = function () {
        ui.backgroundMusic.src = lib.assetURL + 'extension/活动武将/audio/effect/bgm_1.mp3';
        ui.backgroundMusic.volume = lib.config.volumn_background / 8;
        ui.backgroundMusic.addEventListener('ended', game.players.length > 4 ? game.bol_playAudio : game.bol_playAudiox);
    };
    game.bol_playAudiox = function () {
        game.bol_playAudio3 = true;
        ui.backgroundMusic.src = lib.assetURL + 'extension/活动武将/audio/effect/bgm_2.mp3';
        ui.backgroundMusic.volume = lib.config.volumn_background / 8;
        ui.backgroundMusic.addEventListener('ended', game.bol_playAudiox);
    };
    //选将
    lib.skill._bol_playAudio1 = {
        ruleSkill: true,
        charlotte: true,
        trigger: { global: 'chooseButtonBefore' },
        filter(event, player) {
            if (!lib.config.extension_活动武将_HD_bgmPlay || !game.zhu || game.zhu.identity != 'zhu') return false;
            return !game.bol_playAudio1 && event.parent.name == 'chooseCharacter' && get.mode() == 'identity' && _status.mode == 'normal';
        },
        silent: true,
        firstDo: true,
        priority: Infinity + 114 - 514,
        content() {
            'step 0'
            lib.config.background_music = 'music_off';
            game.playBackgroundMusic();
            lib.onover.push(function () {
                ui.backgroundMusic.src = '';
            });
            game.bol_playAudio1 = true;
            'step 1'
            ui.backgroundMusic.src = lib.assetURL + 'extension/活动武将/audio/effect/bgm_0.mp3';
            ui.backgroundMusic.volume = lib.config.volumn_background / 8;
        },
    };
    //开局、对局、残局
    lib.skill._bol_playAudio2 = {
        ruleSkill: true,
        charlotte: true,
        trigger: { global: ['gameDrawAfter', 'phaseBefore'] },
        filter(event, player) {
            return game.bol_playAudio1 && !game.bol_playAudio2;
        },
        silent: true,
        firstDo: true,
        priority: Infinity + 114 - 514,
        content() {
            game.bol_playAudio2 = true;
            var bgm = ((game.zhu && ['wei', 'shu', 'wu', 'qun'].includes(game.zhu.group)) ? game.zhu.group : 'qun');
            ui.backgroundMusic.src = lib.assetURL + 'extension/活动武将/audio/effect/bgm_' + bgm + '.mp3';
            ui.backgroundMusic.volume = lib.config.volumn_background / 8;
            ui.backgroundMusic.addEventListener('ended', game.players.length > 4 ? game.bol_playAudio : game.bol_playAudiox);
        },
    };
    lib.skill._bol_playAudio3 = {
        ruleSkill: true,
        charlotte: true,
        trigger: { global: 'phaseBeginStart' },
        filter(event, player) {
            return game.bol_playAudio2 && !game.bol_playAudio3 && game.players.length <= 4;
        },
        silent: true,
        firstDo: true,
        priority: Infinity + 114 - 514,
        content() {
            game.bol_playAudiox();
        },
    };
    //----------------游戏播报·末----------------

    //快捷添加/删除武将
    game.HDdeleteCharacter = function (name) {
        if (lib.character[name]) delete lib.character[name];
        var packs = Object.keys(lib.characterPack).filter(pack => lib.characterPack[pack][name]);
        if (packs.length) packs.forEach(pack => delete lib.characterPack[pack][name]);
    };
    game.HDaddCharacter = function (name, character, packs = '') {
        game.HDdeleteCharacter(name);
        if (_status['extension_活动武将_files']?.image.character.files.includes(`${name}.jpg`)) {
            character[4] ??= [];
            character[4].push(`ext:活动武将/image/character/${name}.jpg`);
        }
        const pack = packs.split(':').find(p => lib.characterPack[p]);
        if (pack) {
            lib.characterPack[pack][name] = character;
            if (lib.config.characters.includes(pack)) lib.character[name] = character;
            lib.config.forbidai[lib.config[`forbidai_user_${pack}`] ? 'add' : 'remove'](name);
        }
        else lib.character[name] = character;
    };
    //移动武将所在武将包
    game.HDmoveCharacter = function (name, packss) {
        var nameinfo = get.character(name);
        if (nameinfo) {
            nameinfo[4] ??= [];
            game.HDaddCharacter(name, nameinfo, packss);
        }
    };
    //肘击自动确认
    const oldAutoConfirm = lib.hooks.checkEnd.find(i => i.name === 'autoConfirm');
    if (oldAutoConfirm) {
        lib.hooks.checkEnd[lib.hooks.checkEnd.indexOf(oldAutoConfirm)] = function autoConfirm(event, ...args) {
            if (event.noAutoConfirm) return;
            return oldAutoConfirm(event, ...args);
        };
    }
    //chooseTargetControl
    Object.assign(lib.element.player, {
        bilibili_chooseTargetControl(params) {
            const next = game.createEvent('bilibili_chooseTargetControl');
            Object.assign(next, params);
            //选人的
            if (typeof next.filterTarget === 'object') next.filterTarget = get.filter(next.filterTarget, 2);
            next.selectTarget = get.select(next.selectTarget);
            if (next.filterTarget === undefined || next.filterTarget === true) next.filterTarget = lib.filter.all;
            next.ai1 ??= get.attitude2;
            //选项
            next.filterControl ??= () => ui.selected.targets.length > 0;
            next.controls ??= Array.from({ length: (next.choiceList ?? []).length }).map(i => `选项${get.cnNumber(i + 1, true)}`);
            if (!next.forced) next.controls.add('cancel2');
            next.ai2 ??= () => 0;
            //启动
            next.player = this;
            next.noconfirm = true;
            next.noAutoConfirm = true;
            next._args = Array.from(arguments);
            next.setContent('bilibili_chooseTargetControl');
            return next;
        },
    });
    Object.assign(lib.element.content, {
        bilibili_chooseTargetControl: [
            async (event, _trigger, player) => {
                //牢生长谈
                if (![...event.controls].remove('cancel2').length) {
                    event.result = { bool: false };
                    event.finish();
                    return;
                }
                const skills = player.getSkills('invisible').concat(lib.skill.global);
                game.expandSkills(skills);
                for (const skill of skills) lib.skill[skill]?.onChooseTarget?.(event, player);
                //本人操作走这里
                if (event.isMine()) {
                    if (event.hsskill && !event.forced && _status.prehidden_skills?.includes(event.hsskill)) {
                        ui.click.cancel();
                        return;
                    }
                    event.dialog = ui.create.dialog(event.prompt || '请选择目标和选项');
                    if (event.choiceList) {
                        event.dialog.forcebutton = true;
                        for (let i = 0; i < event.choiceList.length; i++) {
                            event.dialog.add('<div class="popup text" style="width:calc(100% - 10px);display:inline-block">' + (event.displayIndex !== false ? `选项${get.cnNumber(i + 1, true)}：` : '') + event.choiceList[i] + '</div>');
                        }
                    }
                    else if (event.prompt2) event.dialog.addText(event.prompt2, event.prompt2.length <= 20);
                    event.dialog.open();
                    event.controlbars = [];
                    for (const control of event.controls) {
                        const control2 = ui.create.control([control]);
                        control2._control = control;
                        control2.classList[control === 'cancel2' || event.filterControl(control, event.player, event) ? 'remove' : 'add']('unselectable');
                        control2.custom = () => {
                            const event = get.event();
                            if (control2.classList.contains('unselectable')) return;
                            event.result = {
                                bool: control !== 'cancel2',
                                targets: ui.selected.targets.slice(),
                                control: control,
                                index: event.controls.indexOf(control),
                            };
                            event.dialog?.close();
                            event.controlbars?.forEach(i => i.close());
                            game.resume();
                            _status.imchoosing = false;
                            game.uncheck();
                        };
                        event.controlbars.push(control2);
                    }
                    event.custom ??= {
                        add: {},
                        replace: {},
                    };
                    const addTarget = event.custom.add.target;
                    event.custom.add.target = function () {
                        addTarget?.call(this);
                        const event = get.event();
                        for (const control2 of event.controlbars) {
                            const control = control2._control;
                            control2.classList[control === 'cancel2' || event.filterControl(control, event.player, event) ? 'remove' : 'add']('unselectable');
                        }
                    };
                    const replaceWindow = event.custom.replace.window;
                    event.custom.replace.window = function () {
                        replaceWindow?.call(this);
                        game.uncheck();
                        const event = get.event();
                        for (const control2 of event.controlbars) {
                            const control = control2._control;
                            control2.classList[control === 'cancel2' || event.filterControl(control, event.player, event) ? 'remove' : 'add']('unselectable');
                        }
                        game.check();
                    };
                    game.check();
                    game.pause();
                }
                else if (event.isOnline()) event.result = await event.sendAsync();//联机走这里
                else event.result = 'ai';//ai和托管走这里
            },
            async (event, _trigger, player) => {
                //ai结算
                if (event.result !== 'ai') return;
                if (event.processAI) event.result = event.processAI();
                else {
                    game.check();
                    if (ai.basic.chooseTarget(event.ai1) || event.forced) {
                        let result = event.ai2(), control, index;
                        if (typeof result === 'number') {
                            index = result;
                            control = event.controls[result];
                        }
                        else {
                            control = result;
                            index = event.controls.indexOf(result);
                        }
                        event.result = {
                            bool: control !== 'cancel2',
                            targets: ui.selected.targets.slice(),
                            control,
                            index,
                        };
                    }
                    else {
                        event.result = {
                            bool: false,
                            targets: ui.selected.targets.slice(),
                            control: 'cancel2',
                            index: event.controls.indexOf('cancel2'),
                        };
                    }
                    game.uncheck();
                }
            },
            async (event, _trigger, player) => {
                event.dialog?.close();
                event.controlbars?.forEach(i => i.close());
                event.resume();
                if (event.result?.bool && event.result.targets?.length && event.animate !== false) {
                    for (const i of event.result.targets) i.addTempClass('target');
                }
            },
        ],
    });

    //武将包和卡包
    if (bilibilicharacter.enable) {
        //--------------------武将包--------------------//
        //诸侯伐董
        game.import('character', FaDongCharacter);
        //合纵抗秦
        game.import('character', hezongkangqincharacter);
        //戚宦之争——我补完了！！！
        game.import('character', decadeQiHuan);
        //捉鬼驱邪
        game.import('character', decadeZhuoGui);
        //魁拔
        game.import('character', decadeKuiBa);
        //超时空密探
        game.import('character', HD_chaoshikong);
        //欢乐三国杀
        game.import('character', MiNikill);
        //三国杀小程序
        game.import('character', WeChatkill);
        //三国杀新小程序
        game.import('character', MiNiAppkill);
        //线下--飞鸿印雪
        game.import('character', MX_feihongyinxue);
        //没想到吧，我换前缀了
        game.import('character', huodongcharacter);
        //--------------------卡牌包--------------------//
    }
    //更新公告
    game.showExtensionChangeLog((() => {
        //更新告示
        _status.HDWJ_ChangeLog = [
            {
                type: 'text',
                data: [
                    '新人制作扩展，希望大家支持',
                    '新人技术不足，希望大家包涵',
                    '<a href="https://github.com/HuoDong-Update-Organization/HuoDong-update">点击前往活动武将Github仓库</a>'
                ],
            },
            {
                type: 'players',
                data: (() => {
                    _status.HDWJ_ChangeLog_character = {
                        MiNiAppkill: Object.keys(MiNiAppkill().character),
                        MiNikill: ['Mbaby_star_dongzhuo', 'Mbaby_star_sunjian', 'Mbaby_star_zhangzhao', 'Mbaby_zhanghu', 'Mbaby_yue_xiaoqiao', 'Mbaby_dc_sp_zhurong', 'Mbaby_shen_guojia', 'Mqing_lvdiao'],
                        WeChatkill: ['wechat_sb_zhurong', 'wechat_zhi_yanghu', 'wechat_zhiyin_zhaoe', 'wechat_zhi_jiaxu'],
                    };
                    return Object.values(_status.HDWJ_ChangeLog_character).flat();
                })(),
            },
            {
                type: 'text',
                textAlign: 'left',
                get data() {
                    return [
                        'bugfix、素材补充、技能调整',
                        ...(() => {
                            const map = _status.HDWJ_ChangeLog_character ?? {};
                            return Object.keys(map).map(ext => {
                                const str = lib.translate[`${ext}_character_config`] || lib.translate[ext] || ext;
                                return `${str}：${map[ext].map(name => lib.translate[name]).join('、')}`;
                            });
                        })(),
                        'To be continued...',
                    ];
                },
            },
        ];
        return _status.HDWJ_ChangeLog;
    })(), '活动武将');
}